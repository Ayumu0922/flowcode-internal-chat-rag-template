-- Enable pgvector
create extension if not exists vector;

-- Documents metadata
create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  storage_path text not null,
  mime_type text,
  size_bytes bigint default 0,
  uploaded_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

alter table public.documents enable row level security;

create policy "Authenticated users can read documents"
  on public.documents for select
  using (auth.role() = 'authenticated');

create policy "Authenticated users can upload documents"
  on public.documents for insert
  with check (auth.role() = 'authenticated');

create policy "Uploaders can delete own documents"
  on public.documents for delete
  using (auth.uid() = uploaded_by);

-- Document chunks with vector embeddings
create table if not exists public.document_chunks (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.documents(id) on delete cascade,
  content text not null,
  chunk_index int not null,
  embedding vector(1536),
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.document_chunks enable row level security;

create policy "Authenticated users can read chunks"
  on public.document_chunks for select
  using (auth.role() = 'authenticated');

create policy "Authenticated users can insert chunks"
  on public.document_chunks for insert
  with check (auth.role() = 'authenticated');

-- IVFFlat index for fast similarity search
create index if not exists idx_document_chunks_embedding
  on public.document_chunks
  using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);

-- Vector similarity search RPC
create or replace function public.match_document_chunks(
  query_embedding vector(1536),
  match_threshold float default 0.7,
  match_count int default 5
)
returns table (
  id uuid,
  document_id uuid,
  content text,
  chunk_index int,
  similarity float,
  document_name text
)
language sql stable
as $$
  select
    dc.id,
    dc.document_id,
    dc.content,
    dc.chunk_index,
    1 - (dc.embedding <=> query_embedding) as similarity,
    d.name as document_name
  from public.document_chunks dc
  join public.documents d on d.id = dc.document_id
  where 1 - (dc.embedding <=> query_embedding) > match_threshold
  order by dc.embedding <=> query_embedding
  limit match_count;
$$;

-- Supabase Storage bucket for documents
insert into storage.buckets (id, name, public)
values ('documents', 'documents', false)
on conflict (id) do nothing;

create policy "Authenticated users can upload to documents bucket"
  on storage.objects for insert
  with check (bucket_id = 'documents' and auth.role() = 'authenticated');

create policy "Authenticated users can read from documents bucket"
  on storage.objects for select
  using (bucket_id = 'documents' and auth.role() = 'authenticated');

create policy "Uploaders can delete from documents bucket"
  on storage.objects for delete
  using (bucket_id = 'documents' and auth.uid() = owner);
