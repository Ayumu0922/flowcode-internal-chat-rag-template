import { useEffect, useRef } from 'react'
import { Bot, User } from 'lucide-react'
import type { Message } from '@/types'
import { RAGResponse } from './RAGResponse'

interface MessageListProps {
  messages: Message[]
  loading: boolean
  generating: boolean
}

export function MessageList({ messages, loading, generating }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, generating])

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500">メッセージを読み込み中...</p>
        </div>
      </div>
    )
  }

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3 text-center max-w-sm">
          <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center">
            <Bot className="w-8 h-8 text-blue-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">会話を始めましょう</h3>
          <p className="text-sm text-gray-500">メッセージを送信すると、AIがドキュメントを参照して回答します。</p>
        </div>
      </div>
    )
  }

  return (
    <main className="flex-1 overflow-y-auto bg-gray-50 px-4 py-6">
      <ul className="flex flex-col gap-4 max-w-3xl mx-auto">
        {messages.map((message) => (
          <li
            key={message.id}
            className={message.is_ai_response ? "flex gap-3 items-start" : "flex gap-3 items-start flex-row-reverse"}
          >
            <div className={message.is_ai_response ? "w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0" : "w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center shrink-0"}>
              {message.is_ai_response
                ? <Bot className="w-4 h-4 text-blue-600" />
                : <User className="w-4 h-4 text-gray-600" />
              }
            </div>
            <div className={message.is_ai_response ? "max-w-lg bg-white rounded-2xl rounded-tl-md px-4 py-3 shadow-sm border border-gray-100" : "max-w-lg bg-blue-600 text-white rounded-2xl rounded-tr-md px-4 py-3 shadow-sm"}>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
              {message.is_ai_response && message.rag_sources && message.rag_sources.length > 0 && (
                <RAGResponse sources={message.rag_sources} />
              )}
              <time className={message.is_ai_response ? "block mt-1 text-xs text-gray-400" : "block mt-1 text-xs text-blue-200"}>
                {new Date(message.created_at).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}
              </time>
            </div>
          </li>
        ))}

        {generating && (
          <li className="flex gap-3 items-start">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 text-blue-600" />
            </div>
            <div className="bg-white rounded-2xl rounded-tl-md px-4 py-3 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
                <span className="ml-1 text-xs text-gray-400">ドキュメントを検索中...</span>
              </div>
            </div>
          </li>
        )}
      </ul>
      <div ref={bottomRef} />
    </main>
  )
}
