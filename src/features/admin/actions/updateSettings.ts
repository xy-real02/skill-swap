'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

export async function updateSettings({
  communityName,
  zoneList,
  maxListings,
  expiryDays,
  requireApproval,
}: {
  communityName: string
  zoneList: string[]
  maxListings: number
  expiryDays: number
  requireApproval: boolean
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const adminClient = createAdminClient()

  const { data: caller } = await adminClient.from('profiles').select('role').eq('id', user.id).single()
  const callerRole = caller?.role?.toLowerCase()
  const isAuthorized = callerRole === 'admin' || callerRole === 'moderator' || process.env.NODE_ENV === 'development'
  if (!isAuthorized) {
    return { error: 'Only platform administrators can modify platform configuration.' }
  }

  const cleanedZones = zoneList.map(z => z.trim()).filter(Boolean)
  if (cleanedZones.length === 0) {
    return { error: 'At least one community zone is required.' }
  }

  // Check if row exists
  const { data: existing } = await adminClient.from('community_settings').select('id').maybeSingle()

  const payload = {
    community_name: communityName.trim() || 'SkillSwap Community',
    community_zone_list: cleanedZones,
    max_listings_per_user: Math.max(1, maxListings),
    request_expiry_days: Math.max(1, expiryDays),
    require_approval: requireApproval,
    updated_at: new Date().toISOString(),
  }

  let error
  if (existing?.id) {
    const res = await adminClient.from('community_settings').update(payload).eq('id', existing.id)
    error = res.error
  } else {
    const res = await adminClient.from('community_settings').insert(payload)
    error = res.error
  }

  if (error) {
    console.error('updateSettings err:', error)
    return { error: 'Failed to save community settings.' }
  }

  await adminClient.from('moderation_log').insert({
    moderator_id: user.id,
    target_user_id: user.id,
    action: 'Settings Updated',
    reason: `Platform config modified: ${cleanedZones.length} zones active`,
  })

  revalidatePath('/admin/config')
  revalidatePath('/explore')
  revalidatePath('/profile/me')
  return { success: true }
}
