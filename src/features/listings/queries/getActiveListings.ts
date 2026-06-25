import { createClient } from '@/lib/supabase/server'

export async function getActiveListings(options?: {
  category?: string
  q?: string
  limit?: number
  excludeOwnerId?: string
  zone?: string
  minRep?: number
}) {
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
  if (options?.category && options.category !== 'All' && options.category !== 'All Categories') {
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

  if (error || !data) {
    console.error('Error fetching active listings:', error)
    return []
  }

  let filtered = data as any[]

  if (options?.zone && options.zone !== 'All Zones') {
    filtered = filtered.filter((item) => item.profiles?.community_zone === options.zone)
  }

  if (options?.minRep && options.minRep > 0) {
    filtered = filtered.filter((item) => (item.profiles?.reputation_score || 0) >= options.minRep!)
  }

  return filtered
}
