import { createClient } from '@/lib/supabase/server'

export async function getListingById(id: string) {
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
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching listing by id:', error)
    return null
  }

  return data
}
