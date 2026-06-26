import { createClient } from '@/lib/supabase/server'
import { Database } from '@/types/database.types'

export type RequestWithProfile = Database['public']['Tables']['requests']['Row'] & {
  profiles: {
    id: string
    full_name: string
    avatar_url: string | null
    community_zone: string
    reputation_score: number | null
    exchange_count: number | null
  }
}

export async function getActiveRequests(options?: {
  category?: string
  q?: string
  limit?: number
  excludeOwnerId?: string
  zone?: string
  minRep?: number
}) {
  const supabase = await createClient()

  let query = supabase
    .from('requests')
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

  if (options?.excludeOwnerId) {
    query = query.neq('owner_id', options.excludeOwnerId)
  }

  if (options?.category && options.category !== 'All' && options.category !== 'All Categories') {
    query = query.eq('category', options.category)
  }

  if (options?.q) {
    query = query.or(`title.ilike.%${options.q}%,description.ilike.%${options.q}%`)
  }

  if (options?.limit) {
    query = query.limit(options.limit)
  }

  const { data, error } = await query

  if (error || !data) {
    console.error('Error fetching active requests:', error)
    return []
  }

  let filtered = data as any[]

  if (options?.zone && options.zone !== 'All Zones') {
    filtered = filtered.filter((item) => item.profiles?.community_zone === options.zone)
  }

  if (options?.minRep && options.minRep > 0) {
    filtered = filtered.filter((item) => (item.profiles?.reputation_score || 0) >= options.minRep!)
  }

  return filtered as unknown as RequestWithProfile[]
}
