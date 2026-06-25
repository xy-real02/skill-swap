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
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-outline-variant/30">
        <div>
          <h1 className="text-3xl font-extrabold text-on-surface font-headline-md tracking-tight">
            Members Dashboard
          </h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Review community roster, manage executive roles, and enforce neighborhood guidelines.
          </p>
        </div>
      </div>

      {/* Analytics Overview (Bento Grid Style) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stat Card 1 */}
        <div className="bg-surface border border-outline-variant/40 rounded-3xl p-6 shadow-[0_4px_24px_rgba(45,106,79,0.05)] relative overflow-hidden group hover:border-primary/40 transition-all">
          <div className="absolute -top-6 -right-6 p-4 opacity-10 pointer-events-none group-hover:scale-110 transition-transform">
            <Users className="w-40 h-40 text-primary" />
          </div>
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-on-surface-variant mb-2">Total Members</h3>
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-extrabold text-primary font-headline-md tracking-tight">
              {analytics.totalMembers.toLocaleString()}
            </span>
            <span className="text-xs font-bold text-primary bg-secondary-container border border-secondary/20 px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
              <TrendingUp className="w-3.5 h-3.5" /> +{analytics.recentJoinsCount} new
            </span>
          </div>
        </div>

        {/* Stat Card 2 */}
        <div className="bg-surface border border-outline-variant/40 rounded-3xl p-6 shadow-[0_4px_24px_rgba(45,106,79,0.05)] relative overflow-hidden group hover:border-primary/40 transition-all">
          <div className="absolute -top-6 -right-6 p-4 opacity-10 pointer-events-none group-hover:scale-110 transition-transform">
            <ArrowRightLeft className="w-40 h-40 text-primary" />
          </div>
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-on-surface-variant mb-2">Completed Swaps</h3>
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-extrabold text-primary font-headline-md tracking-tight">
              {analytics.completedExchanges.toLocaleString()}
            </span>
            <span className="text-xs font-bold text-on-surface-variant bg-surface-container-high border border-outline-variant/30 px-3 py-1 rounded-full">
              Verified exchanges
            </span>
          </div>
        </div>

        {/* Stat Card 3 */}
        <div className="bg-surface border border-outline-variant/40 rounded-3xl p-6 shadow-[0_4px_24px_rgba(45,106,79,0.05)] relative overflow-hidden group hover:border-tertiary/40 transition-all border-l-4 border-l-tertiary">
          <div className="absolute -top-6 -right-6 p-4 opacity-10 pointer-events-none group-hover:scale-110 transition-transform">
            <AlertTriangle className="w-40 h-40 text-tertiary" />
          </div>
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-on-surface-variant mb-2">Pending Safety Reports</h3>
          <div className="flex items-baseline gap-3">
            <span className={`text-4xl font-extrabold font-headline-md tracking-tight ${analytics.pendingReports > 0 ? 'text-error' : 'text-on-surface'}`}>
              {analytics.pendingReports}
            </span>
            <span className={`text-xs font-bold px-3 py-1 rounded-full border shadow-sm ${
              analytics.pendingReports > 0
                ? 'bg-error-container text-on-error-container border-error/30'
                : 'bg-secondary-container text-on-secondary-container border-secondary/30'
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
              className="w-full pl-10 pr-4 py-3 bg-surface border border-outline-variant/50 rounded-2xl text-sm text-on-surface placeholder:text-outline focus:outline-none focus:border-primary shadow-sm transition-all"
            />
            <span className="material-symbols-outlined absolute left-3.5 top-3 text-outline text-[20px]">
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
