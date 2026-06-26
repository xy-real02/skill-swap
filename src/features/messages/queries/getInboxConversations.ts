import { createClient } from '@/lib/supabase/server'
import { Database } from '@/types/database.types'

export type InboxConversation = Database['public']['Tables']['exchanges']['Row'] & {
  listing: Pick<Database['public']['Tables']['listings']['Row'], 'title' | 'category'> | null
  provider: Pick<Database['public']['Tables']['profiles']['Row'], 'id' | 'full_name' | 'avatar_url' | 'community_zone'> | null
  requester: Pick<Database['public']['Tables']['profiles']['Row'], 'id' | 'full_name' | 'avatar_url' | 'community_zone'> | null
  messages: Array<Pick<Database['public']['Tables']['messages']['Row'], 'id' | 'content' | 'created_at' | 'sender_id' | 'is_read'>>
}

export async function getInboxConversations(): Promise<InboxConversation[]> {
  const supabase = await createClient()

  const { data: authData } = await supabase.auth.getUser()
  if (!authData.user) return []

  const { data, error } = await supabase
    .from('exchanges')
    .select(`
      *,
      listing:listings(title, category),
      provider:profiles!exchanges_provider_id_fkey(id, full_name, avatar_url, community_zone),
      requester:profiles!exchanges_requester_id_fkey(id, full_name, avatar_url, community_zone),
      messages(
        id, content, created_at, sender_id, is_read
      )
    `)
    .or(`provider_id.eq.${authData.user.id},requester_id.eq.${authData.user.id}`)
    .order('created_at', { foreignTable: 'messages', ascending: false })
    .limit(1, { foreignTable: 'messages' })

  if (error) {
    console.error('Error fetching inbox conversations:', error)
    return []
  }

  // Sort exchanges so that the one with the most recent message is first
  // If an exchange has no messages, fallback to exchange created_at
  const sortedData = (data as unknown as InboxConversation[]).sort((a, b) => {
    const timeA = a.messages && a.messages.length > 0 ? new Date(a.messages[0].created_at!).getTime() : new Date(a.created_at!).getTime()
    const timeB = b.messages && b.messages.length > 0 ? new Date(b.messages[0].created_at!).getTime() : new Date(b.created_at!).getTime()
    return timeB - timeA
  })

  return sortedData
}
