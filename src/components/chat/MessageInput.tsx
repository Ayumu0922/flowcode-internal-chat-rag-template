import { useState } from 'react'
import { Send } from 'lucide-react'

interface MessageInputProps {
  onSend: (content: string) => void
  disabled: boolean
}

export function MessageInput({ onSend, disabled }: MessageInputProps) {
  const [value, setValue] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = value.trim()
    if (!trimmed || disabled) return
    onSend(trimmed)
    setValue('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <footer className="border-t border-gray-200 bg-white px-4 py-3">
      <form onSubmit={handleSubmit} className="flex items-end gap-3 max-w-3xl mx-auto">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="メッセージを入力...（Shift+Enterで改行）"
          rows={1}
          disabled={disabled}
          className="flex-1 resize-none rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={disabled || !value.trim()}
          className="shrink-0 w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </footer>
  )
}
