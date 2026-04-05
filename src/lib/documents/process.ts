import { supabase } from '@/lib/supabase'
import { chunkText } from '@/lib/rag/chunker'
import { generateEmbeddings } from '@/lib/rag/embeddings'

export async function processDocument(documentId: string, text: string): Promise<number> {
  // 1. Chunk the text
  const chunks = chunkText(text)

  if (chunks.length === 0) return 0

  // 2. Generate embeddings in batches
  const batchSize = 20
  let processedCount = 0

  for (let i = 0; i < chunks.length; i += batchSize) {
    const batch = chunks.slice(i, i + batchSize)
    const texts = batch.map((c) => c.content)

    const embeddings = await generateEmbeddings(texts)

    // 3. Insert chunks with embeddings
    const rows = batch.map((chunk, j) => ({
      document_id: documentId,
      content: chunk.content,
      chunk_index: chunk.index,
      embedding: embeddings[j],
    }))

    const { error } = await supabase.from('document_chunks').insert(rows)

    if (error) {
      console.error('Chunk insert error:', error)
      throw error
    }

    processedCount += batch.length
  }

  return processedCount
}
