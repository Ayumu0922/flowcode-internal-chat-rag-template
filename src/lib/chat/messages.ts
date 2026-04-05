import { supabase } from '@/lib/supabase'
import type { Message } from '@/types'

export async function fetchMessages(channelId: string): Promise<Message[]> {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('channel_id', channelId)
    .order('created_at', { ascending: true })
    .limit(100)

  if (error) throw error
  return data || []
}

export async function sendMessage(
  channelId: string,
  userId: string,
  content: string,
): Promise<Message> {
  const { data, error } = await supabase
    .from('messages')
    .insert({
      channel_id: channelId,
      user_id: userId,
      content,
      is_ai_response: false,
    })
    .select()
    .single()

  if (error) throw error
  return data
}
