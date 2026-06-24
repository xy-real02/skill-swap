import { createClient } from '@/lib/supabase/server'
import { Database } from '@/types/database.types'

type ExchangeRow = Database['public']['Tables']['exchanges']['Row']
type ProfileRow = Database['public']['Tables']['profiles']['Row']
type ListingRow = Database['public']['Tables']['listings']['Row']

export type ExchangeHistoryItem = ExchangeRow & {
  provider: Pick<ProfileRow, 'id' | 'full_name' | 'avatar_url'> | null
  requester: Pick<ProfileRow, 'id' | 'full_name' | 'avatar_url'> | null
  listing: Pick<ListingRow, 'id' | 'title' | 'category'> | null
}

export async function getUserExchangeHistory(userId: string): Promise<ExchangeHistoryItem[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('exchanges')
    .select(`
      *,
      provider:provider_id(id, full_name, avatar_url),
      requester:requester_id(id, full_name, avatar_url),
      listing:listing_id(id, title, category)
    `)
    .or(`provider_id.eq.${userId},requester_id.eq.${userId}`)
    .in('status', ['Completed', 'Disputed'])
    .order('updated_at', { ascending: false })

  if (error) {
    console.error('Error fetching exchange history:', error)
    return []
  }

  return data as unknown as ExchangeHistoryItem[]
}
