import { getMembers } from '@/features/admin/queries/getMembers'
import { getAnalytics } from '@/features/admin/queries/getAnalytics'
import { MemberTable } from '@/features/admin/components/MemberTable'
import { createClient } from '@/lib/supabase/server'
import { Users, TrendingUp, ArrowRightLeft, AlertTriangle } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminMembersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const resolvedParams = await searchParams
  const q = resolvedParams?.q || ''

  const [members, analytics] = await Promise.all([
    getMembers(q),
    getAnalytics(),
  ])

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const currentAdminId = user?.id || ''

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-3xl font-extrabold text-white font-headline-md tracking-tight">
            Members Dashboard
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Review community roster, manage executive roles, and enforce neighborhood guidelines.
          </p>
        </div>
      </div>

      {/* Analytics Overview (Bento Grid Style) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stat Card 1 */}
        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="absolute -top-6 -right-6 p-4 opacity-5 pointer-events-none group-hover:scale-110 transition-transform">
            <Users className="w-40 h-40 text-emerald-400" />
          </div>
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2">Total Members</h3>
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-extrabold text-white font-headline-md tracking-tight">
              {analytics.totalMembers.toLocaleString()}
            </span>
            <span className="text-xs font-bold text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full flex items-center gap-1 shadow-inner">
              <TrendingUp className="w-3.5 h-3.5" /> +{analytics.recentJoinsCount} new
            </span>
          </div>
        </div>

        {/* Stat Card 2 */}
        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="absolute -top-6 -right-6 p-4 opacity-5 pointer-events-none group-hover:scale-110 transition-transform">
            <ArrowRightLeft className="w-40 h-40 text-emerald-400" />
          </div>
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2">Completed Swaps</h3>
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-extrabold text-emerald-400 font-headline-md tracking-tight">
              {analytics.completedExchanges.toLocaleString()}
            </span>
            <span className="text-xs font-bold text-slate-300 bg-slate-800 border border-slate-700 px-2.5 py-1 rounded-full">
              Verified exchanges
            </span>
          </div>
        </div>

        {/* Stat Card 3 */}
        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden group hover:border-slate-700 transition-all border-l-4 border-l-amber-500">
          <div className="absolute -top-6 -right-6 p-4 opacity-5 pointer-events-none group-hover:scale-110 transition-transform">
            <AlertTriangle className="w-40 h-40 text-amber-500" />
          </div>
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2">Pending Safety Reports</h3>
          <div className="flex items-baseline gap-3">
            <span className={`text-4xl font-extrabold font-headline-md tracking-tight ${analytics.pendingReports > 0 ? 'text-amber-400' : 'text-white'}`}>
              {analytics.pendingReports}
            </span>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
              analytics.pendingReports > 0
                ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
            }`}>
              {analytics.pendingReports > 0 ? 'Requires attention' : 'Clean queue'}
            </span>
          </div>
        </div>
      </section>

      {/* Search Filter Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <form method="GET" className="max-w-md w-full">
          <div className="relative">
            <input
              type="text"
              name="q"
              defaultValue={q}
              placeholder="Search community members by name..."
              className="w-full pl-10 pr-4 py-3 bg-slate-900/90 border border-slate-800 rounded-2xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 shadow-xl transition-all"
            />
            <span className="material-symbols-outlined absolute left-3.5 top-3 text-slate-500 text-[20px]">
              search
            </span>
          </div>
        </form>
      </div>

      {/* Coherent Member Table Complete with Grid Switcher */}
      <MemberTable members={members} currentAdminId={currentAdminId} />
    </div>
  )
}
