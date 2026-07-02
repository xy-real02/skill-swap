import { createClient } from '@/lib/supabase/server'

/**
 * Fetches a user's full_name by their profile ID.
 * Used in generateMetadata to populate page titles without a full profile fetch.
 */
export async function getProfileName(userId: string): Promise<string | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', userId)
    .single()

  return data?.full_name ?? null
}
