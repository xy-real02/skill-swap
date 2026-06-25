import { getAnalytics } from '@/features/admin/queries/getAnalytics'
import { Users, FileText, Repeat, AlertCircle, TrendingUp, MapPin } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function AdminAnalyticsPage() {
  const stats = await getAnalytics()

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div className="border-b border-outline-variant/30 pb-4">
        <h1 className="text-3xl font-extrabold text-on-surface font-headline-md tracking-tight">
          Platform Overview
        </h1>
        <p className="text-sm text-on-surface-variant mt-1">
          Real-time metrics and growth indicators across the SkillSwap community.
        </p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-surface border border-outline-variant/40 rounded-3xl p-6 shadow-[0_4px_20px_rgba(45,106,79,0.05)] relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-extrabold uppercase tracking-wider text-on-surface-variant">Total Members</span>
            <div className="p-2.5 bg-secondary-container text-on-secondary-container rounded-2xl shadow-inner">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-4xl font-extrabold text-primary font-headline-md tracking-tight">{stats.totalMembers}</div>
          <div className="flex items-center gap-1 text-primary font-bold text-xs mt-3 bg-secondary-container/50 w-fit px-2.5 py-0.5 rounded-full">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+{stats.recentJoinsCount} this week</span>
          </div>
        </div>

        <div className="bg-surface border border-outline-variant/40 rounded-3xl p-6 shadow-[0_4px_20px_rgba(45,106,79,0.05)] relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-extrabold uppercase tracking-wider text-on-surface-variant">Active Listings</span>
            <div className="p-2.5 bg-secondary-container text-on-secondary-container rounded-2xl shadow-inner">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="text-4xl font-extrabold text-primary font-headline-md tracking-tight">{stats.totalListings}</div>
          <div className="text-xs font-semibold text-on-surface-variant mt-3">Available skills & offers</div>
        </div>

        <div className="bg-surface border border-outline-variant/40 rounded-3xl p-6 shadow-[0_4px_20px_rgba(45,106,79,0.05)] relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-extrabold uppercase tracking-wider text-on-surface-variant">Exchanges Done</span>
            <div className="p-2.5 bg-secondary-container text-on-secondary-container rounded-2xl shadow-inner">
              <Repeat className="w-5 h-5" />
            </div>
          </div>
          <div className="text-4xl font-extrabold text-primary font-headline-md tracking-tight">{stats.completedExchanges}</div>
          <div className="text-xs font-semibold text-primary mt-3">Successfully completed</div>
        </div>

        <div className="bg-surface border border-outline-variant/40 rounded-3xl p-6 shadow-[0_4px_20px_rgba(45,106,79,0.05)] relative overflow-hidden group hover:border-error/40 transition-colors border-l-4 border-l-error">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-extrabold uppercase tracking-wider text-on-surface-variant">Pending Reports</span>
            <div className="p-2.5 bg-error-container text-on-error-container rounded-2xl shadow-inner animate-pulse">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="text-4xl font-extrabold text-error font-headline-md tracking-tight">{stats.pendingReports}</div>
          <Link href="/moderator/queue" className="text-xs text-error font-extrabold hover:underline mt-3 inline-block">
            Review mod queue &rarr;
          </Link>
        </div>
      </div>

      {/* Zone Breakdown & Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
        <div className="lg:col-span-2 bg-surface border border-outline-variant/40 rounded-3xl p-8 shadow-[0_4px_24px_rgba(45,106,79,0.05)]">
          <h2 className="text-lg font-bold text-on-surface mb-6 flex items-center gap-2 font-headline-sm">
            <MapPin className="w-5 h-5 text-primary" />
            <span>Community Zone Distribution</span>
          </h2>
          <div className="space-y-5">
            {stats.zoneStats.map(({ zone, count }) => {
              const pct = stats.totalMembers > 0 ? Math.round((count / stats.totalMembers) * 100) : 0
              return (
                <div key={zone} className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-on-surface">
                    <span>{zone}</span>
                    <span className="text-on-surface-variant font-semibold">{count} members ({pct}%)</span>
                  </div>
                  <div className="w-full h-3 bg-surface-container-low rounded-full overflow-hidden border border-outline-variant/30 p-0.5">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-500 shadow-sm"
                      style={{ width: `${Math.max(pct, 2)}%` }}
                    ></div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="bg-surface border border-outline-variant/40 rounded-3xl p-8 shadow-[0_4px_24px_rgba(45,106,79,0.05)] flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-on-surface mb-5 font-headline-sm">Platform System Status</h3>
            <div className="space-y-3.5 text-xs">
              <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-2xl border border-outline-variant/30">
                <span className="text-on-surface-variant font-bold">Database Engine</span>
                <span className="text-primary font-extrabold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
                  Online
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-2xl border border-outline-variant/30">
                <span className="text-on-surface-variant font-bold">Auth & Storage</span>
                <span className="text-primary font-extrabold">Operational</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-2xl border border-outline-variant/30">
                <span className="text-on-surface-variant font-bold">Active Admin Count</span>
                <span className="text-tertiary font-extrabold">Safe (&ge; 1)</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-outline-variant/30 text-center">
            <Link
              href="/admin/members"
              className="w-full inline-block py-3 bg-primary hover:bg-primary-container text-on-primary font-bold text-xs rounded-xl shadow-md transition-all hover:-translate-y-0.5"
            >
              Manage Directory & Roles
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
