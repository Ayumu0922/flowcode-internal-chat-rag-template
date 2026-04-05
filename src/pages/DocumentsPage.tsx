import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useDocuments } from '@/hooks/useDocuments'
import { DocumentUpload } from '@/components/documents/DocumentUpload'
import { DocumentList } from '@/components/documents/DocumentList'
import { FileText } from 'lucide-react'

export function DocumentsPage() {
  const [userId, setUserId] = useState<string | null>(null)
  const { documents, loading, uploading, processingId, upload, remove } = useDocuments()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setUserId(data.user.id)
    })
  }, [])

  const handleUpload = async (file: File) => {
    if (!userId) return

    try {
      await upload(file, userId)
    } catch (err) {
      console.error('Upload failed:', err)
    }
  }

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <header className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">ドキュメント管理</h1>
            <p className="text-sm text-gray-500">RAG検索用のドキュメントをアップロード・管理します</p>
          </div>
        </header>

        <section className="mb-8">
          <DocumentUpload onUpload={handleUpload} uploading={uploading} />
        </section>

        <section>
          <h2 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
            アップロード済み ({documents.length})
          </h2>
          <DocumentList
            documents={documents}
            loading={loading}
            processingId={processingId}
            onDelete={remove}
          />
        </section>
      </div>
    </div>
  )
}
