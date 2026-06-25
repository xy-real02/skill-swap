import { createClient } from '@/lib/supabase/server'
import { Database } from '@/types/database.types'

export type Profile = Database['public']['Tables']['profiles']['Row']

export async function getProfile(profileId: string): Promise<Profile | null> {
  const supabase = await createClient()

  const { data: authData } = await supabase.auth.getUser()
  const isOwner = authData.user?.id === profileId

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', profileId)
    .single()

  if (error || !data) {
    console.error('Error fetching profile:', error)
    return null
  }

  // Calculate live completed exchange count to guarantee accuracy even before migrations run
  const { count: liveExchangeCount } = await supabase
    .from('exchanges')
    .select('*', { count: 'exact', head: true })
    .or(`provider_id.eq.${profileId},requester_id.eq.${profileId}`)
    .eq('status', 'Completed')

  if (liveExchangeCount !== null) {
    data.exchange_count = liveExchangeCount
  }

  // Calculate live reputation score to guarantee instant accuracy
  const { data: reviews } = await supabase
    .from('reviews')
    .select('rating')
    .eq('target_id', profileId)

  if (reviews && reviews.length > 0) {
    const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    data.reputation_score = Number(avg.toFixed(2))
  }

  // Enforce privacy: clear sensitive fields if not the owner
  if (!isOwner) {
    data.phone_number = null
    // Add any other sensitive fields here in the future
  }

  return data as Profile
}
