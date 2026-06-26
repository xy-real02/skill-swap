import { createClient } from '@/lib/supabase/server'
import { Database } from '@/types/database.types'

export type Notification = Database['public']['Tables']['notifications']['Row']

export async function getNotifications(): Promise<Notification[]> {
  const supabase = await createClient()

  const { data: authData } = await supabase.auth.getUser()
  if (!authData.user) return []

  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', authData.user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching notifications:', error)
    return []
  }

  return data as Notification[]
}
