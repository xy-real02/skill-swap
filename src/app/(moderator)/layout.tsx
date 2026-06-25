import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function ModeratorLayout({
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
  if (role !== 'moderator' && role !== 'admin') {
    redirect('/explore')
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-body-md antialiased">
      {/* Mod Header */}
      <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 px-6 py-3.5 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <Link href="/moderator/queue" className="flex items-center gap-2 text-primary font-bold text-lg">
            <span className="material-symbols-outlined text-emerald-400">shield</span>
            <span className="text-white font-headline-sm">SkillSwap <span className="text-emerald-400 text-xs px-2 py-0.5 bg-emerald-950 border border-emerald-800 rounded-full ml-1">Mod Queue</span></span>
          </Link>

          <nav className="hidden md:flex items-center gap-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800">
            <Link
              href="/moderator/queue"
              className="px-4 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
            >
              Open Queue
            </Link>
            <Link
              href="/moderator/history"
              className="px-4 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
            >
              Action History
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
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
      <div className="md:hidden flex border-b border-slate-800 bg-slate-900 px-4 pt-2">
        <Link
          href="/moderator/queue"
          className="flex-1 text-center py-2.5 text-xs font-bold text-slate-300 border-b-2 border-emerald-500"
        >
          Open Queue
        </Link>
        <Link
          href="/moderator/history"
          className="flex-1 text-center py-2.5 text-xs font-bold text-slate-400 border-b-2 border-transparent"
        >
          Action History
        </Link>
      </div>

      <main className="flex-1 container mx-auto p-4 md:p-8 max-w-7xl">
        {children}
      </main>
    </div>
  )
}
