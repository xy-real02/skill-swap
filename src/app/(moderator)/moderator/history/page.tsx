import { getReports } from '@/features/moderation/queries/getReports'
import { ReportCard } from '@/features/moderation/components/ReportCard'
import { History } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function ModeratorHistoryPage() {
  const resolvedReports = await getReports('Resolved')

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white font-headline-md tracking-tight">
            Moderation Action History
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Audit log of resolved reports and safety enforcement decisions.
          </p>
        </div>
        <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl text-slate-300 font-bold text-sm flex items-center gap-2">
          <History className="w-4 h-4 text-emerald-400" />
          <span>{resolvedReports.length} Actions Recorded</span>
        </div>
      </div>

      {resolvedReports.length === 0 ? (
        <div className="py-20 text-center bg-slate-900/40 border border-slate-800/60 rounded-3xl p-8 max-w-lg mx-auto">
          <History className="w-16 h-16 mx-auto text-slate-600 mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">No History Yet</h2>
          <p className="text-sm text-slate-400">
            Resolved moderation reports will appear here as a permanent audit trail.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resolvedReports.map((report) => (
            <ReportCard key={report.id} report={report} />
          ))}
        </div>
      )}
    </div>
  )
}
