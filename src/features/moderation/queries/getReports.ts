import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export interface ReportItem {
  id: string
  reporter_id: string
  target_id: string
  target_type: string
  reason: string
  details: string | null
  status: string
  resolved_by: string | null
  resolution_note: string | null
  resolved_at: string | null
  created_at: string
  reporter_name?: string
  target_title?: string
  target_url?: string
}

export async function getReports(statusFilter: 'Pending' | 'Resolved' | 'All' = 'Pending'): Promise<ReportItem[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const adminClient = createAdminClient()

  let query = adminClient.from('reports').select('*').order('created_at', { ascending: false })
  if (statusFilter === 'Pending') {
    query = query.eq('status', 'open')
  } else if (statusFilter === 'Resolved') {
    query = query.in('status', ['resolved', 'dismissed'])
  }

  const { data: reports, error } = await query
  if (error || !reports) {
    console.error('getReports error:', error)
    return []
  }

  const reporterIds = Array.from(new Set(reports.map(r => r.reporter_id)))
  const { data: profiles } = await adminClient
    .from('profiles')
    .select('id, full_name')
    .in('id', reporterIds)

  const profileMap = new Map(profiles?.map(p => [p.id, p.full_name]) || [])

  const listingIds = reports.filter(r => r.target_type?.toLowerCase() === 'listing').map(r => r.target_id)
  const requestIds = reports.filter(r => r.target_type?.toLowerCase() === 'request').map(r => r.target_id)
  const targetProfileIds = reports.filter(r => r.target_type?.toLowerCase() === 'profile').map(r => r.target_id)

  const [listingsRes, requestsRes, targetProfilesRes] = await Promise.all([
    listingIds.length ? adminClient.from('listings').select('id, title').in('id', listingIds) : Promise.resolve({ data: [] }),
    requestIds.length ? adminClient.from('requests').select('id, title').in('id', requestIds) : Promise.resolve({ data: [] }),
    targetProfileIds.length ? adminClient.from('profiles').select('id, full_name').in('id', targetProfileIds) : Promise.resolve({ data: [] }),
  ])

  const listingMap = new Map(listingsRes.data?.map((l: any) => [l.id, l.title]) || [])
  const requestMap = new Map(requestsRes.data?.map((r: any) => [r.id, r.title]) || [])
  const targetProfileMap = new Map(targetProfilesRes.data?.map((p: any) => [p.id, p.full_name]) || [])

  return reports.map(r => {
    const normType = r.target_type?.toLowerCase()
    let title = 'Unknown Content'
    let url = ''

    if (normType === 'listing') {
      title = listingMap.get(r.target_id) || 'Deleted Listing'
      url = `/listings/${r.target_id}`
    } else if (normType === 'request') {
      title = requestMap.get(r.target_id) || 'Deleted Request'
      url = `/explore?tab=requests`
    } else if (normType === 'profile') {
      title = targetProfileMap.get(r.target_id) || 'Unknown User'
      url = `/profile/${r.target_id}`
    }

    return {
      id: r.id,
      reporter_id: r.reporter_id,
      target_id: r.target_id,
      target_type: normType ? normType.charAt(0).toUpperCase() + normType.slice(1) : 'Content',
      reason: r.reason,
      details: r.details,
      status: r.status === 'open' ? 'Pending' : r.status === 'dismissed' ? 'Dismissed' : 'Resolved',
      resolved_by: r.resolved_by,
      resolution_note: r.resolution_note,
      resolved_at: r.resolved_at,
      created_at: r.created_at || new Date().toISOString(),
      reporter_name: profileMap.get(r.reporter_id) || 'Anonymous',
      target_title: title,
      target_url: url,
    }
  })
}
