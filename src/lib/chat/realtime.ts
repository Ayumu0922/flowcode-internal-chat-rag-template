import { supabase } from '@/lib/supabase'
import type { Message } from '@/types'
import type { RealtimeChannel } from '@supabase/supabase-js'

export function subscribeToMessages(
  channelId: string,
  onNewMessage: (message: Message) => void,
): RealtimeChannel {
  const channel = supabase
    .channel(`messages:${channelId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `channel_id=eq.${channelId}`,
      },
      (payload) => {
        onNewMessage(payload.new as Message)
      },
    )
    .subscribe()

  return channel
}

export function unsubscribeFromMessages(channel: RealtimeChannel): void {
  supabase.removeChannel(channel)
}
