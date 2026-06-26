import { createClient } from '@/lib/supabase/server'
import { RequestWithProfile } from '@/features/requests/queries/getActiveRequests'

export async function getUserRequests(userId: string): Promise<RequestWithProfile[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
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
    .eq('owner_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching user requests:', error)
    return []
  }

  return data as unknown as RequestWithProfile[]
}
