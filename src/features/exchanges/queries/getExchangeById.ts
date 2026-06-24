import { createClient } from '@/lib/supabase/server'
import { UserExchange } from './getUserExchanges'

export async function getExchangeById(id: string): Promise<UserExchange | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('exchanges')
    .select(`
      *,
      listing:listings(title, category),
      provider:profiles!exchanges_provider_id_fkey(id, full_name, avatar_url, location, reputation_score),
      requester:profiles!exchanges_requester_id_fkey(id, full_name, avatar_url, location, reputation_score)
    `)
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching exchange:', error)
    return null
  }

  return data as unknown as UserExchange
}
