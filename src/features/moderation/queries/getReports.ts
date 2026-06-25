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

  // Use admin client to ensure we can read all reports
  const adminClient = createAdminClient()

  let query = adminClient.from('reports').select('*').order('created_at', { ascending: false })
  if (statusFilter === 'Pending') {
    query = query.or('status.is.null,status.eq.Pending')
  } else if (statusFilter === 'Resolved') {
    query = query.neq('status', 'Pending').not('status', 'is', null)
  }

  const { data: reports, error } = await query
  if (error || !reports) {
    console.error('getReports error:', error)
    return []
  }

  // Enrich with reporter names & target titles
  const reporterIds = Array.from(new Set(reports.map(r => r.reporter_id)))
  const { data: profiles } = await adminClient
    .from('profiles')
    .select('id, full_name')
    .in('id', reporterIds)

  const profileMap = new Map(profiles?.map(p => [p.id, p.full_name]) || [])

  // Collect target IDs by type
  const listingIds = reports.filter(r => r.target_type === 'Listing').map(r => r.target_id)
  const requestIds = reports.filter(r => r.target_type === 'Request').map(r => r.target_id)
  const targetProfileIds = reports.filter(r => r.target_type === 'Profile').map(r => r.target_id)

  const [listingsRes, requestsRes, targetProfilesRes] = await Promise.all([
    listingIds.length ? adminClient.from('listings').select('id, title').in('id', listingIds) : Promise.resolve({ data: [] }),
    requestIds.length ? adminClient.from('requests').select('id, title').in('id', requestIds) : Promise.resolve({ data: [] }),
    targetProfileIds.length ? adminClient.from('profiles').select('id, full_name').in('id', targetProfileIds) : Promise.resolve({ data: [] }),
  ])

  const listingMap = new Map((listingsRes.data as { id: string; title: string }[])?.map(l => [l.id, l.title]) || [])
  const requestMap = new Map((requestsRes.data as { id: string; title: string }[])?.map(r => [r.id, r.title]) || [])
  const targetProfileMap = new Map((targetProfilesRes.data as { id: string; full_name: string }[])?.map(p => [p.id, p.full_name]) || [])

  return reports.map(r => {
    let target_title = 'Unknown Content'
    let target_url = ''

    if (r.target_type === 'Listing') {
      target_title = listingMap.get(r.target_id) || 'Deleted Listing'
      target_url = `/explore?listingId=${r.target_id}`
    } else if (r.target_type === 'Request') {
      target_title = requestMap.get(r.target_id) || 'Deleted Request'
      target_url = `/requests/${r.target_id}`
    } else if (r.target_type === 'Profile') {
      target_title = targetProfileMap.get(r.target_id) || 'Unknown Member'
      target_url = `/profile/${r.target_id}`
    }

    return {
      ...r,
      status: r.status || 'Pending',
      reporter_name: profileMap.get(r.reporter_id) || 'Anonymous Member',
      target_title,
      target_url,
    }
  })
}
