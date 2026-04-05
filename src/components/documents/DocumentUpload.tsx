import { useState, useCallback } from 'react'
import { Upload, FileText, Loader2 } from 'lucide-react'

interface DocumentUploadProps {
  onUpload: (file: File) => void
  uploading: boolean
}

export function DocumentUpload({ onUpload, uploading }: DocumentUploadProps) {
  const [dragOver, setDragOver] = useState(false)

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragOver(false)
      const file = e.dataTransfer.files[0]
      if (file) onUpload(file)
    },
    [onUpload],
  )

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) onUpload(file)
      e.target.value = ''
    },
    [onUpload],
  )

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      className={dragOver ? "relative border-2 border-dashed border-blue-400 rounded-xl p-8 text-center bg-blue-50 transition-colors" : "relative border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-white hover:border-gray-400 transition-colors"}
    >
      {uploading ? (
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
          <p className="text-sm font-medium text-gray-700">ファイルを処理中...</p>
          <p className="text-xs text-gray-500">テキスト抽出 → チャンク分割 → ベクトル化</p>
        </div>
      ) : (
        <label className="flex flex-col items-center gap-3 cursor-pointer">
          <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center">
            {dragOver ? <FileText className="w-7 h-7 text-blue-500" /> : <Upload className="w-7 h-7 text-gray-400" />}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">ドキュメントをドラッグ＆ドロップ</p>
            <p className="text-xs text-gray-500 mt-1">または クリックしてファイルを選択</p>
          </div>
          <p className="text-xs text-gray-400">.txt, .md, .csv に対応</p>
          <input
            type="file"
            onChange={handleFileChange}
            accept=".txt,.md,.csv,.text"
            className="hidden"
          />
        </label>
      )}
    </div>
  )
}
