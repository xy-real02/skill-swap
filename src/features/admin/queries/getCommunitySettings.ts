import { createAdminClient } from '@/lib/supabase/admin'

export interface CommunitySettings {
  id?: string
  community_name: string
  community_zone_list: string[]
  max_listings_per_user: number
  request_expiry_days: number
  require_approval: boolean
}

export async function getCommunitySettings(): Promise<CommunitySettings> {
  const adminClient = createAdminClient()

  const { data, error } = await adminClient.from('community_settings').select('*').maybeSingle()
  if (error) {
    console.error('getCommunitySettings error:', error)
  }

  if (data) {
    return {
      id: data.id,
      community_name: data.community_name || 'SkillSwap Community',
      community_zone_list: data.community_zone_list?.length ? data.community_zone_list : ['Northside Hub', 'South Market', 'East Village', 'West End'],
      max_listings_per_user: data.max_listings_per_user || 10,
      request_expiry_days: data.request_expiry_days || 30,
      require_approval: Boolean(data.require_approval),
    }
  }

  // Fallback defaults
  return {
    community_name: 'SkillSwap Community',
    community_zone_list: ['Northside Hub', 'South Market', 'East Village', 'West End'],
    max_listings_per_user: 10,
    request_expiry_days: 30,
    require_approval: false,
  }
}
