import { createClient } from '@/lib/supabase/server'
import { Database } from '@/types/database.types'

export type Message = Database['public']['Tables']['messages']['Row'] & {
  sender: Pick<Database['public']['Tables']['profiles']['Row'], 'id' | 'full_name' | 'avatar_url'> | null
}

export async function getExchangeMessages(exchangeId: string): Promise<Message[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('messages')
    .select(`
      *,
      sender:profiles!messages_sender_id_fkey(id, full_name, avatar_url)
    `)
    .eq('exchange_id', exchangeId)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching messages:', error)
    return []
  }

  return data as unknown as Message[]
}
