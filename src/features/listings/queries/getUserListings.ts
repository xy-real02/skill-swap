import { createClient } from '@/lib/supabase/server'
import { ListingWithProfile } from '@/features/listings/components/ListingCard'

export async function getUserListings(userId: string): Promise<ListingWithProfile[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('listings')
    .select(`
      *,
      profiles:owner_id (
        id,
        full_name,
        avatar_url,
        community_zone,
        reputation_score,
        exchange_count
      )
    `)
    .eq('owner_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching user listings:', error)
    return []
  }

  return data as unknown as ListingWithProfile[]
}
