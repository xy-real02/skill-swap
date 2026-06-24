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

  // Enforce privacy: clear sensitive fields if not the owner
  if (!isOwner) {
    data.phone_number = null
    // Add any other sensitive fields here in the future
  }

  return data as Profile
}
