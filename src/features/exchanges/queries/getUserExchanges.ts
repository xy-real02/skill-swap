import { createClient } from '@/lib/supabase/server'
import { Database } from '@/types/database.types'

export type UserExchange = Database['public']['Tables']['exchanges']['Row'] & {
  listing: Pick<Database['public']['Tables']['listings']['Row'], 'title' | 'category'> | null
  provider: Pick<Database['public']['Tables']['profiles']['Row'], 'id' | 'full_name' | 'avatar_url' | 'location' | 'reputation_score'> | null
  requester: Pick<Database['public']['Tables']['profiles']['Row'], 'id' | 'full_name' | 'avatar_url' | 'location' | 'reputation_score'> | null
}

export async function getUserExchanges(): Promise<UserExchange[]> {
  const supabase = await createClient()

  const { data: authData } = await supabase.auth.getUser()
  if (!authData.user) return []

  const { data, error } = await supabase
    .from('exchanges')
    .select(`
      *,
      listing:listings(title, category),
      provider:profiles!exchanges_provider_id_fkey(id, full_name, avatar_url, location, reputation_score),
      requester:profiles!exchanges_requester_id_fkey(id, full_name, avatar_url, location, reputation_score)
    `)
    .or(`provider_id.eq.${authData.user.id},requester_id.eq.${authData.user.id}`)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching user exchanges:', error)
    return []
  }

  return data as unknown as UserExchange[]
}
