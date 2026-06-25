import { createAdminClient } from '@/lib/supabase/admin'

export interface AdminMemberItem {
  id: string
  full_name: string
  avatar_url: string | null
  community_zone: string
  reputation_score: number | null
  exchange_count: number | null
  role: string | null
  status: string | null
  created_at: string | null
}

export async function getMembers(searchQuery?: string): Promise<AdminMemberItem[]> {
  const adminClient = createAdminClient()

  let query = adminClient.from('profiles').select('*').order('created_at', { ascending: false })
  if (searchQuery?.trim()) {
    query = query.ilike('full_name', `%${searchQuery.trim()}%`)
  }

  const { data, error } = await query
  if (error || !data) {
    console.error('getMembers error:', error)
    return []
  }

  return data.map(p => ({
    id: p.id,
    full_name: p.full_name || 'Anonymous User',
    avatar_url: p.avatar_url,
    community_zone: p.community_zone || 'Neighbor',
    reputation_score: p.reputation_score,
    exchange_count: p.exchange_count,
    role: p.role || 'Member',
    status: p.status || 'Active',
    created_at: p.created_at,
  }))
}
