'use server'

import { createClient } from '@/lib/supabase/server'

export async function markMessagesRead(exchangeId: string) {
  const supabase = await createClient()
  const { data: auth } = await supabase.auth.getUser()
  if (!auth.user) return { error: 'Not authenticated' }

  const { error } = await supabase
    .from('messages')
    .update({ is_read: true })
    .eq('exchange_id', exchangeId)
    .neq('sender_id', auth.user.id)
    .eq('is_read', false)

  if (error) {
    console.error('markMessagesRead error:', error)
    return { error: error.message }
  }

  return { success: true }
}
