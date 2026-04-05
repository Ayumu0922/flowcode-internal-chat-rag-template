import { FileText } from 'lucide-react'
import type { RagSource } from '@/types'

interface RAGResponseProps {
  sources: RagSource[]
}

export function RAGResponse({ sources }: RAGResponseProps) {
  if (sources.length === 0) return null

  return (
    <div className="mt-2 pt-2 border-t border-gray-100">
      <p className="text-xs font-medium text-gray-500 mb-1">参照ドキュメント:</p>
      <ul className="flex flex-col gap-1">
        {sources.map((source, i) => (
          <li key={i} className="flex items-center gap-1.5 text-xs text-blue-600">
            <FileText className="w-3 h-3 shrink-0" />
            <span className="truncate">{source.documentName}</span>
            <span className="text-gray-400 shrink-0">
              ({Math.round(source.similarity * 100)}%)
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
