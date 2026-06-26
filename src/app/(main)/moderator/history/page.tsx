import { getReports } from '@/features/moderation/queries/getReports'
import { ModeratorDashboardView } from '@/features/moderation/components/ModeratorDashboardView'

export const dynamic = 'force-dynamic'

export default async function ModeratorHistoryPage() {
  const allReports = await getReports('All')

  return <ModeratorDashboardView initialReports={allReports} defaultTab="Resolved" />
}
