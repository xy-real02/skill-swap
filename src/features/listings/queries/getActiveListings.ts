import { createClient } from '@/lib/supabase/server'

export async function getActiveListings(options?: { category?: string; q?: string; limit?: number; excludeOwnerId?: string }) {
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

  // Exclude current user's listings if specified
  if (options?.excludeOwnerId) {
    query = query.neq('owner_id', options.excludeOwnerId)
  }

  // Apply optional category filter
  if (options?.category && options.category !== 'All') {
    query = query.eq('category', options.category)
  }

  // Apply optional search query
  if (options?.q) {
    query = query.or(`title.ilike.%${options.q}%,description.ilike.%${options.q}%`)
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
