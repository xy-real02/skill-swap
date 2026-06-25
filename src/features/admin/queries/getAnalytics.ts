import { createAdminClient } from '@/lib/supabase/admin'

export interface PlatformAnalytics {
  totalMembers: number
  totalListings: number
  completedExchanges: number
  pendingReports: number
  recentJoinsCount: number
  zoneStats: { zone: string; count: number }[]
}

export async function getAnalytics(): Promise<PlatformAnalytics> {
  const adminClient = createAdminClient()

  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  const [
    membersRes,
    listingsRes,
    exchangesRes,
    reportsRes,
    recentRes,
    allProfilesRes,
  ] = await Promise.all([
    adminClient.from('profiles').select('*', { count: 'exact', head: true }),
    adminClient.from('listings').select('*', { count: 'exact', head: true }),
    adminClient.from('exchanges').select('*', { count: 'exact', head: true }).eq('status', 'completed'),
    adminClient.from('reports').select('*', { count: 'exact', head: true }).or('status.is.null,status.eq.Pending'),
    adminClient.from('profiles').select('*', { count: 'exact', head: true }).gte('created_at', sevenDaysAgo.toISOString()),
    adminClient.from('profiles').select('community_zone'),
  ])

  // Calculate zone stats
  const zoneCounts: Record<string, number> = {}
  if (allProfilesRes.data) {
    for (const row of allProfilesRes.data) {
      const z = row.community_zone || 'Unspecified'
      zoneCounts[z] = (zoneCounts[z] || 0) + 1
    }
  }

  const zoneStats = Object.entries(zoneCounts)
    .map(([zone, count]) => ({ zone, count }))
    .sort((a, b) => b.count - a.count)

  return {
    totalMembers: membersRes.count || 0,
    totalListings: listingsRes.count || 0,
    completedExchanges: exchangesRes.count || 0,
    pendingReports: reportsRes.count || 0,
    recentJoinsCount: recentRes.count || 0,
    zoneStats,
  }
}
