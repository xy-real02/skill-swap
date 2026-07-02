import { createClient } from '@/lib/supabase/server'

/**
 * Fetches the community_zone for a given user profile.
 * Returns an empty string if the user has no zone set.
 */
export async function getUserZone(userId: string): Promise<string> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('profiles')
    .select('community_zone')
    .eq('id', userId)
    .maybeSingle()

  return data?.community_zone ?? ''
}
