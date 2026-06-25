import { getReports } from '@/features/moderation/queries/getReports'
import { ReportCard } from '@/features/moderation/components/ReportCard'
import { ShieldCheck } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function ModeratorQueuePage() {
  const pendingReports = await getReports('Pending')

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white font-headline-md tracking-tight">
            Open Report Queue
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Review community flagged content and enforce safety guidelines.
          </p>
        </div>
        <div className="bg-emerald-950/80 border border-emerald-800/80 px-4 py-2 rounded-xl text-emerald-300 font-bold text-sm flex items-center gap-2 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span>{pendingReports.length} Pending Actions</span>
        </div>
      </div>

      {pendingReports.length === 0 ? (
        <div className="py-20 text-center bg-slate-900/40 border border-slate-800/60 rounded-3xl p-8 max-w-lg mx-auto">
          <ShieldCheck className="w-16 h-16 mx-auto text-emerald-500 mb-4 animate-bounce" />
          <h2 className="text-xl font-bold text-white mb-2">All Clear!</h2>
          <p className="text-sm text-slate-400">
            There are currently no pending moderation reports. Great job keeping SkillSwap safe!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pendingReports.map((report) => (
            <ReportCard key={report.id} report={report} />
          ))}
        </div>
      )}
    </div>
  )
}
