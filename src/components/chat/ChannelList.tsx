import { useState } from 'react'
import { Hash, Plus, Bot, X } from 'lucide-react'
import type { Channel } from '@/types'

interface ChannelListProps {
  channels: Channel[]
  activeChannelId: string | null
  onSelectChannel: (id: string) => void
  onCreateChannel: (name: string, description: string, aiEnabled: boolean) => void
}

export function ChannelList({ channels, activeChannelId, onSelectChannel, onCreateChannel }: ChannelListProps) {
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [aiEnabled, setAiEnabled] = useState(true)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    onCreateChannel(name.trim(), description.trim(), aiEnabled)
    setName('')
    setDescription('')
    setAiEnabled(true)
    setShowForm(false)
  }

  return (
    <nav className="flex flex-col h-full bg-gray-900 text-gray-300 w-64 shrink-0">
      <header className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
        <h2 className="text-sm font-semibold text-white tracking-wide uppercase">Channels</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="p-1 rounded hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
        >
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </button>
      </header>

      {showForm && (
        <form onSubmit={handleSubmit} className="p-3 border-b border-gray-700 bg-gray-800">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Channel name"
            className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white text-sm placeholder-gray-500 border border-gray-600 focus:border-blue-500 focus:outline-none"
          />
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description (optional)"
            className="w-full mt-2 px-3 py-2 rounded-lg bg-gray-700 text-white text-sm placeholder-gray-500 border border-gray-600 focus:border-blue-500 focus:outline-none"
          />
          <label className="flex items-center gap-2 mt-2 text-xs text-gray-400 cursor-pointer">
            <input
              type="checkbox"
              checked={aiEnabled}
              onChange={(e) => setAiEnabled(e.target.checked)}
              className="rounded border-gray-600 bg-gray-700 text-blue-500"
            />
            <Bot className="w-3 h-3" />
            AI応答を有効にする
          </label>
          <button
            type="submit"
            className="w-full mt-2 px-3 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            作成
          </button>
        </form>
      )}

      <ul className="flex-1 overflow-y-auto py-2">
        {channels.map((channel) => (
          <li key={channel.id}>
            <button
              onClick={() => onSelectChannel(channel.id)}
              className={channel.id === activeChannelId ? "flex items-center gap-2 w-full px-4 py-2 text-sm text-white bg-gray-700 font-medium" : "flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"}
            >
              <Hash className="w-4 h-4 shrink-0" />
              <span className="truncate flex-1 text-left">{channel.name}</span>
              {channel.is_ai_enabled && <Bot className="w-3 h-3 text-blue-400 shrink-0" />}
            </button>
          </li>
        ))}
      </ul>

      {channels.length === 0 && (
        <p className="px-4 py-8 text-center text-xs text-gray-500">チャンネルがありません</p>
      )}
    </nav>
  )
}
