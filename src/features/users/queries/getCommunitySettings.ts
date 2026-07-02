import { createClient } from '@/lib/supabase/server'
import { DEFAULT_COMMUNITY_ZONES } from '@/utils/constants'

export interface CommunitySettings {
  community_zone_list: string[] | null
}

/**
 * Fetches community_zone_list from community_settings.
 * Falls back to DEFAULT_COMMUNITY_ZONES if the table is empty or no zones are configured.
 */
export async function getCommunitySettings(): Promise<{ zones: string[] }> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('community_settings')
    .select('community_zone_list')
    .maybeSingle()

  const zones =
    data?.community_zone_list?.length
      ? data.community_zone_list
      : DEFAULT_COMMUNITY_ZONES

  return { zones }
}
