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

export async function getActiveRequests(options?: { category?: string; limit?: number }) {
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

  if (options?.category && options.category !== 'All') {
    query = query.eq('category', options.category)
  }

  if (options?.limit) {
    query = query.limit(options.limit)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching active requests:', error)
    return []
  }

  return data as unknown as RequestWithProfile[]
}
