import { createClient } from '@/lib/supabase/server'
import { ListingWithProfile } from '@/features/listings/queries/getActiveListings'

export async function getUserListings(userId: string): Promise<ListingWithProfile[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('listings')
    .select(`
      *,
      owner:profiles!listings_owner_id_fkey(*)
    `)
    .eq('owner_id', userId)
    .eq('status', 'Active')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching user listings:', error)
    return []
  }

  return data as unknown as ListingWithProfile[]
}
