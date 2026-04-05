export interface Channel {
  id: string
  name: string
  description: string
  created_by: string | null
  is_ai_enabled: boolean
  created_at: string
}

export interface Message {
  id: string
  channel_id: string
  user_id: string | null
  content: string
  is_ai_response: boolean
  rag_sources: RagSource[] | null
  created_at: string
}

export interface RagSource {
  documentId: string
  documentName: string
  chunkIndex: number
  similarity: number
}

export interface Document {
  id: string
  name: string
  storage_path: string
  mime_type: string | null
  size_bytes: number
  uploaded_by: string | null
  created_at: string
}

export interface SearchResult {
  id: string
  document_id: string
  content: string
  chunk_index: number
  similarity: number
  document_name: string
}

export interface Profile {
  id: string
  display_name: string
  avatar_url: string | null
  created_at: string
}
