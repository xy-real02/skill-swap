'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export interface RealtimeMessage {
  id: string
  exchange_id: string
  sender_id: string
  content: string
  created_at: string | null
  is_read: boolean | null
  sender?: { id: string; full_name: string | null; avatar_url: string | null } | null
}

/**
 * Subscribes to the `messages` table via Supabase Realtime, filtered by exchange_id.
 * Returns the current message list and appends new ones live.
 *
 * @param exchangeId - The exchange to subscribe to.
 * @param initialMessages - Server-rendered initial messages (avoids flash of empty state).
 * @param currentUserId - Used to hydrate sender info on optimistic inserts.
 * @param otherUser - The other participant (used to hydrate sender on live messages).
 */
export function useRealtimeMessages<T extends RealtimeMessage>(
  exchangeId: string,
  initialMessages: T[],
  currentUserId: string,
  otherUser?: { id?: string; full_name?: string | null; avatar_url?: string | null } | null
) {
  const [messages, setMessages] = useState<T[]>(initialMessages)

  // Keep in sync when server re-renders with fresh data
  useEffect(() => {
    setMessages(initialMessages)
  }, [initialMessages])

  useEffect(() => {
    const supabase = createClient()
    const channel = supabase
      .channel(`chat-${exchangeId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `exchange_id=eq.${exchangeId}`,
        },
        (payload) => {
          const newMsg = payload.new as RealtimeMessage
          setMessages((prev) => {
            if (prev.some((m) => m.id === newMsg.id)) return prev
            const hydrated = {
              ...newMsg,
              sender:
                newMsg.sender_id === currentUserId
                  ? { id: currentUserId, full_name: null, avatar_url: null }
                  : otherUser ?? null,
            } as T
            return [...prev, hydrated]
          })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [exchangeId, currentUserId, otherUser])

  return messages
}
