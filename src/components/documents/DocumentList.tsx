import { FileText, Trash2, Loader2 } from 'lucide-react'
import type { Document } from '@/types'

interface DocumentListProps {
  documents: Document[]
  loading: boolean
  processingId: string | null
  onDelete: (id: string, storagePath: string) => void
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1048576).toFixed(1)} MB`
}

export function DocumentList({ documents, loading, processingId, onDelete }: DocumentListProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (documents.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-12 text-center">
        <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
          <FileText className="w-6 h-6 text-gray-400" />
        </div>
        <p className="text-sm text-gray-500">まだドキュメントがありません</p>
        <p className="text-xs text-gray-400">ファイルをアップロードするとRAG検索が使えるようになります</p>
      </div>
    )
  }

  return (
    <ul className="flex flex-col gap-2">
      {documents.map((doc) => (
        <li key={doc.id} className="flex items-center gap-3 px-4 py-3 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
            {processingId === doc.id
              ? <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
              : <FileText className="w-5 h-5 text-blue-500" />
            }
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-800 truncate">{doc.name}</p>
            <p className="text-xs text-gray-500">
              {formatFileSize(doc.size_bytes)} ・ {new Date(doc.created_at).toLocaleDateString('ja-JP')}
            </p>
          </div>
          {processingId === doc.id ? (
            <span className="text-xs text-blue-500 font-medium shrink-0">処理中...</span>
          ) : (
            <button
              onClick={() => onDelete(doc.id, doc.storage_path)}
              className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </li>
      ))}
    </ul>
  )
}
