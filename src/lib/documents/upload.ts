import { supabase } from '@/lib/supabase'
import type { Document } from '@/types'

export async function uploadDocument(file: File, userId: string): Promise<Document> {
  const storagePath = `${userId}/${Date.now()}_${file.name}`

  // Upload to Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from('documents')
    .upload(storagePath, file)

  if (uploadError) throw uploadError

  // Save metadata
  const { data, error: insertError } = await supabase
    .from('documents')
    .insert({
      name: file.name,
      storage_path: storagePath,
      mime_type: file.type,
      size_bytes: file.size,
      uploaded_by: userId,
    })
    .select()
    .single()

  if (insertError) throw insertError
  return data
}

export async function extractText(file: File): Promise<string> {
  // For text-based files, read directly
  if (file.type === 'text/plain' || file.type === 'text/markdown' || file.type === 'text/csv') {
    return file.text()
  }

  // For other types, read as text (basic extraction)
  // In production, you'd use a PDF parser or document processing service
  return file.text()
}

export async function fetchDocuments(): Promise<Document[]> {
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function deleteDocument(documentId: string, storagePath: string): Promise<void> {
  // Delete from storage
  await supabase.storage.from('documents').remove([storagePath])

  // Delete metadata (cascades to chunks)
  const { error } = await supabase
    .from('documents')
    .delete()
    .eq('id', documentId)

  if (error) throw error
}
