import { createClient } from '@/lib/supabase/server'

export async function getActiveListings(options?: { category?: string; limit?: number }) {
  const supabase = await createClient()

  // Query listings joined with the owner's profile data
  let query = supabase
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
    .eq('status', 'Active')
    .order('created_at', { ascending: false })

  // Apply optional category filter
  if (options?.category && options.category !== 'All') {
    query = query.eq('category', options.category)
  }

  // Apply optional limit
  if (options?.limit) {
    query = query.limit(options.limit)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching active listings:', error)
    return []
  }

  return data
}
