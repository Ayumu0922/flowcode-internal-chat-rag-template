import { useState, useEffect, useCallback } from 'react'
import type { Document } from '@/types'
import { uploadDocument, extractText, fetchDocuments, deleteDocument } from '@/lib/documents/upload'
import { processDocument } from '@/lib/documents/process'

export function useDocuments() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [processingId, setProcessingId] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    fetchDocuments()
      .then((docs) => {
        setDocuments(docs)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const upload = useCallback(async (file: File, userId: string) => {
    setUploading(true)

    try {
      // 1. Upload file and save metadata
      const doc = await uploadDocument(file, userId)
      setDocuments((prev) => [doc, ...prev])

      // 2. Extract text
      const text = await extractText(file)

      if (!text.trim()) {
        setUploading(false)
        return doc
      }

      // 3. Process: chunk + embed
      setProcessingId(doc.id)
      await processDocument(doc.id, text)
      setProcessingId(null)
      setUploading(false)

      return doc
    } catch (err) {
      setUploading(false)
      setProcessingId(null)
      throw err
    }
  }, [])

  const remove = useCallback(async (documentId: string, storagePath: string) => {
    await deleteDocument(documentId, storagePath)
    setDocuments((prev) => prev.filter((d) => d.id !== documentId))
  }, [])

  return {
    documents,
    loading,
    uploading,
    processingId,
    upload,
    remove,
  }
}
