-- Channels
create table if not exists public.channels (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text default '',
  created_by uuid references auth.users(id),
  is_ai_enabled boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.channels enable row level security;

create policy "Authenticated users can read channels"
  on public.channels for select
  using (auth.role() = 'authenticated');

create policy "Authenticated users can create channels"
  on public.channels for insert
  with check (auth.role() = 'authenticated');

-- Messages
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  channel_id uuid not null references public.channels(id) on delete cascade,
  user_id uuid references auth.users(id),
  content text not null,
  is_ai_response boolean not null default false,
  rag_sources jsonb default null,
  created_at timestamptz not null default now()
);

alter table public.messages enable row level security;

create policy "Authenticated users can read messages"
  on public.messages for select
  using (auth.role() = 'authenticated');

create policy "Authenticated users can insert messages"
  on public.messages for insert
  with check (auth.role() = 'authenticated');

-- Enable Realtime for messages
alter publication supabase_realtime add table public.messages;

-- Default channel
insert into public.channels (name, description, is_ai_enabled)
values ('general', 'General discussion', true);
