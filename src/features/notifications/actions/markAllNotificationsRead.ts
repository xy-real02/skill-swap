'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function markAllNotificationsRead() {
  const supabase = await createClient()

  const { data: authData } = await supabase.auth.getUser()
  if (!authData.user) {
    return { error: 'Not authenticated' }
  }

  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('user_id', authData.user.id)
    .eq('is_read', false)

  if (error) {
    console.error('Error marking all notifications read:', error)
    return { error: 'Failed to update notifications' }
  }

  revalidatePath('/notifications')
  return { success: true }
}
