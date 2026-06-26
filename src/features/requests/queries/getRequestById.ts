import { createClient } from '@/lib/supabase/server'
import { RequestWithProfile } from './getActiveRequests'

export async function getRequestById(id: string): Promise<RequestWithProfile | null> {
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
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching request by id:', error)
    return null
  }

  return data as unknown as RequestWithProfile
}
