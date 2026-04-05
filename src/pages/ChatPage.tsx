import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useChat } from '@/hooks/useChat'
import { ChannelList } from '@/components/chat/ChannelList'
import { MessageList } from '@/components/chat/MessageList'
import { MessageInput } from '@/components/chat/MessageInput'
import { MessageSquare } from 'lucide-react'

export function ChatPage() {
  const [userId, setUserId] = useState<string | null>(null)
  const [activeChannelId, setActiveChannelId] = useState<string | null>(null)
  const { messages, channels, loading, generating, send, createChannel } = useChat(activeChannelId)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setUserId(data.user.id)
    })
  }, [])

  // Auto-select first channel
  useEffect(() => {
    if (!activeChannelId && channels.length > 0) {
      setActiveChannelId(channels[0].id)
    }
  }, [channels, activeChannelId])

  const handleSend = (content: string) => {
    if (userId) send(content, userId)
  }

  const handleCreateChannel = async (name: string, description: string, aiEnabled: boolean) => {
    const channel = await createChannel(name, description, aiEnabled)
    setActiveChannelId(channel.id)
  }

  return (
    <div className="flex h-full bg-white">
      <ChannelList
        channels={channels}
        activeChannelId={activeChannelId}
        onSelectChannel={setActiveChannelId}
        onCreateChannel={handleCreateChannel}
      />

      <section className="flex flex-col flex-1 min-w-0">
        {activeChannelId ? (
          <>
            <header className="flex items-center gap-2 px-4 py-3 border-b border-gray-200 bg-white">
              <MessageSquare className="w-5 h-5 text-gray-400" />
              <h1 className="text-sm font-semibold text-gray-800">
                {channels.find((c) => c.id === activeChannelId)?.name || 'Channel'}
              </h1>
              <span className="text-xs text-gray-400 ml-2">
                {channels.find((c) => c.id === activeChannelId)?.description}
              </span>
            </header>
            <MessageList messages={messages} loading={loading} generating={generating} />
            <MessageInput onSend={handleSend} disabled={generating || !userId} />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="flex flex-col items-center gap-3 text-center">
              <MessageSquare className="w-12 h-12 text-gray-300" />
              <p className="text-sm text-gray-500">チャンネルを選択してください</p>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
