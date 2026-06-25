import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name')
    .eq('id', user.id)
    .single()

  const role = profile?.role?.toLowerCase()
  if (role !== 'admin') {
    redirect('/explore')
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-body-md antialiased">
      {/* Admin Header */}
      <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 px-6 py-3.5 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <Link href="/admin/analytics" className="flex items-center gap-2 text-primary font-bold text-lg">
            <span className="material-symbols-outlined text-amber-400">local_police</span>
            <span className="text-white font-headline-sm">SkillSwap <span className="text-amber-400 text-xs px-2 py-0.5 bg-amber-950 border border-amber-800 rounded-full ml-1">Admin HQ</span></span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800">
            <Link
              href="/admin/analytics"
              className="px-4 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-all flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">monitoring</span>
              Analytics
            </Link>
            <Link
              href="/admin/members"
              className="px-4 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-all flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">group</span>
              Directory & Roles
            </Link>
            <Link
              href="/admin/config"
              className="px-4 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-all flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">settings</span>
              Settings & Zones
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/moderator/queue"
            className="hidden sm:flex px-3 py-1.5 text-xs font-semibold text-emerald-400 bg-emerald-950/40 hover:bg-emerald-900/40 rounded-xl transition-colors border border-emerald-800/60 items-center gap-1"
          >
            <span className="material-symbols-outlined text-[14px]">shield</span>
            Mod Queue
          </Link>
          <Link
            href="/explore"
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors border border-slate-700 flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            Back to App
          </Link>
        </div>
      </header>

      {/* Mobile nav tabs */}
      <div className="lg:hidden flex border-b border-slate-800 bg-slate-900 px-2 pt-2 overflow-x-auto">
        <Link
          href="/admin/analytics"
          className="flex-1 min-w-[100px] text-center py-2 text-xs font-bold text-slate-300 border-b-2 border-amber-500"
        >
          Analytics
        </Link>
        <Link
          href="/admin/members"
          className="flex-1 min-w-[100px] text-center py-2 text-xs font-bold text-slate-400 border-b-2 border-transparent"
        >
          Members
        </Link>
        <Link
          href="/admin/config"
          className="flex-1 min-w-[100px] text-center py-2 text-xs font-bold text-slate-400 border-b-2 border-transparent"
        >
          Config
        </Link>
      </div>

      <main className="flex-1 container mx-auto p-4 md:p-8 max-w-7xl">
        {children}
      </main>
    </div>
  )
}
