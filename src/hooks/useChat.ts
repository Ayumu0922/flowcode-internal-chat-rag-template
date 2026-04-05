import { useState, useEffect, useCallback, useRef } from 'react'
import type { Message, Channel } from '@/types'
import { supabase } from '@/lib/supabase'
import { fetchMessages, sendMessage } from '@/lib/chat/messages'
import { subscribeToMessages, unsubscribeFromMessages } from '@/lib/chat/realtime'
import { generateRAGResponse } from '@/lib/rag/generate'
import type { RealtimeChannel } from '@supabase/supabase-js'

export function useChat(channelId: string | null) {
  const [messages, setMessages] = useState<Message[]>([])
  const [channels, setChannels] = useState<Channel[]>([])
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)
  const subscriptionRef = useRef<RealtimeChannel | null>(null)

  // Load channels
  useEffect(() => {
    async function loadChannels() {
      const { data } = await supabase
        .from('channels')
        .select('*')
        .order('created_at', { ascending: true })

      if (data) setChannels(data)
    }

    loadChannels()
  }, [])

  // Load messages and subscribe to realtime
  useEffect(() => {
    if (!channelId) return

    setLoading(true)

    fetchMessages(channelId)
      .then((msgs) => {
        setMessages(msgs)
        setLoading(false)
      })
      .catch(() => setLoading(false))

    // Subscribe to new messages
    const channel = subscribeToMessages(channelId, (newMessage) => {
      setMessages((prev) => {
        if (prev.some((m) => m.id === newMessage.id)) return prev
        return [...prev, newMessage]
      })
    })

    subscriptionRef.current = channel

    return () => {
      if (subscriptionRef.current) {
        unsubscribeFromMessages(subscriptionRef.current)
        subscriptionRef.current = null
      }
    }
  }, [channelId])

  const send = useCallback(
    async (content: string, userId: string) => {
      if (!channelId) return

      await sendMessage(channelId, userId, content)

      // Check if channel has AI enabled
      const channel = channels.find((c) => c.id === channelId)

      if (channel?.is_ai_enabled) {
        setGenerating(true)

        try {
          await generateRAGResponse(content, channelId)
        } catch (err) {
          console.error('RAG generation failed:', err)
        } finally {
          setGenerating(false)
        }
      }
    },
    [channelId, channels],
  )

  const createChannel = useCallback(async (name: string, description: string, aiEnabled: boolean) => {
    const { data, error } = await supabase
      .from('channels')
      .insert({ name, description, is_ai_enabled: aiEnabled })
      .select()
      .single()

    if (error) throw error
    setChannels((prev) => [...prev, data])
    return data
  }, [])

  return {
    messages,
    channels,
    loading,
    generating,
    send,
    createChannel,
  }
}
