'use server'

import { createClient } from '@/lib/supabase/server'
import { stripHtml } from '@/utils/sanitize'
import { revalidatePath } from 'next/cache'

export async function sendMessage(formData: FormData) {
  const supabase = await createClient()

  const { data: authData, error: authError } = await supabase.auth.getUser()
  if (authError || !authData.user) {
    return { error: 'You must be logged in to send a message.' }
  }

  const exchange_id = formData.get('exchange_id') as string
  const content = stripHtml(formData.get('content'))

  if (!exchange_id || !content || content.trim() === '') {
    return { error: 'Message cannot be empty.' }
  }

  if (content.length > 1000) {
    return { error: 'Message exceeds the 1000 character limit.' }
  }

  const { error: insertError } = await supabase
    .from('messages')
    .insert({
      exchange_id,
      sender_id: authData.user.id,
      content: content.trim(),
      is_read: false,
    })

  if (insertError) {
    console.error('Error sending message:', insertError)
    return { error: 'Failed to send message.' }
  }

  revalidatePath(`/exchanges/${exchange_id}`)
  return { success: true }
}
