import { createAdminClient } from '@/lib/supabase/admin'

export interface ModerationLogItem {
  id: string
  moderator_id: string
  target_user_id: string
  target_content_id: string | null
  action: string
  reason: string | null
  created_at: string
  moderator_name?: string
  target_user_name?: string
}

export async function getModerationLogs(): Promise<ModerationLogItem[]> {
  const adminClient = createAdminClient()

  const { data: logs, error } = await adminClient
    .from('moderation_log')
    .select('*')
    .order('created_at', { ascending: false })

  if (error || !logs) {
    console.error('getModerationLogs error:', error)
    return []
  }

  const userIds = Array.from(new Set([
    ...logs.map(l => l.moderator_id),
    ...logs.map(l => l.target_user_id)
  ].filter(Boolean)))

  const { data: profiles } = await adminClient
    .from('profiles')
    .select('id, full_name')
    .in('id', userIds)

  const profileMap = new Map<string, string>()
  profiles?.forEach(p => {
    profileMap.set(p.id, p.full_name || 'Anonymous User')
  })

  return logs.map(l => ({
    ...l,
    moderator_name: profileMap.get(l.moderator_id) || l.moderator_id,
    target_user_name: profileMap.get(l.target_user_id) || l.target_user_id,
  }))
}
