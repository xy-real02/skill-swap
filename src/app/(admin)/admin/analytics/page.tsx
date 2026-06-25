import { getAnalytics } from '@/features/admin/queries/getAnalytics'
import { Users, FileText, Repeat, AlertCircle, TrendingUp, MapPin } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function AdminAnalyticsPage() {
  const stats = await getAnalytics()

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white font-headline-md tracking-tight">
          Platform Overview
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Real-time metrics and growth indicators across the SkillSwap community.
        </p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-6 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase text-slate-400">Total Members</span>
            <div className="p-2 bg-blue-500/10 text-blue-400 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white">{stats.totalMembers}</div>
          <div className="flex items-center gap-1 text-emerald-400 text-xs mt-2 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+{stats.recentJoinsCount} this week</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-6 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase text-slate-400">Active Listings</span>
            <div className="p-2 bg-purple-500/10 text-purple-400 rounded-xl">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white">{stats.totalListings}</div>
          <div className="text-xs text-slate-500 mt-2">Available skills & offers</div>
        </div>

        <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-6 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase text-slate-400">Exchanges Done</span>
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <Repeat className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white">{stats.completedExchanges}</div>
          <div className="text-xs text-emerald-500/80 mt-2">Successfully completed</div>
        </div>

        <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-6 shadow-xl relative overflow-hidden group hover:border-red-500/50 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase text-slate-400">Pending Reports</span>
            <div className="p-2 bg-red-500/10 text-red-400 rounded-xl animate-pulse">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white">{stats.pendingReports}</div>
          <Link href="/moderator/queue" className="text-xs text-red-400 hover:underline mt-2 inline-block font-semibold">
            Review mod queue &rarr;
          </Link>
        </div>
      </div>

      {/* Zone Breakdown & Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-amber-400" />
            <span>Community Zone Distribution</span>
          </h2>
          <div className="space-y-4">
            {stats.zoneStats.map(({ zone, count }) => {
              const pct = stats.totalMembers > 0 ? Math.round((count / stats.totalMembers) * 100) : 0
              return (
                <div key={zone} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold text-slate-300">
                    <span>{zone}</span>
                    <span className="text-slate-400">{count} members ({pct}%)</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(pct, 2)}%` }}
                    ></div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white mb-3">Platform System Status</h3>
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800/80">
                <span className="text-slate-400">Database Engine</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  Online
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800/80">
                <span className="text-slate-400">Auth & Storage</span>
                <span className="text-emerald-400 font-bold">Operational</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800/80">
                <span className="text-slate-400">Active Admin Count</span>
                <span className="text-amber-400 font-bold">Safe (&ge; 1)</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 text-center">
            <Link
              href="/admin/members"
              className="w-full inline-block py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/10 transition-all"
            >
              Manage Directory & Roles
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
