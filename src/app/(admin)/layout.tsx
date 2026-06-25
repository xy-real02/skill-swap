import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { AdminSidebarLinks } from '@/features/admin/components/AdminSidebarLinks'

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
    <div className="min-h-screen bg-background text-on-background flex font-body-md antialiased selection:bg-secondary-container selection:text-on-secondary-container">
      {/* Admin SideNavBar */}
      <nav className="hidden lg:flex flex-col h-full p-6 border-r border-outline-variant/30 bg-surface shadow-[4px_0_24px_rgba(45,106,79,0.06)] w-64 fixed left-0 top-0 z-40 justify-between">
        <div>
          {/* Brand Header */}
          <div className="flex items-center gap-3 mb-8 px-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-container flex items-center justify-center text-on-primary font-bold shadow-md">
              <span className="material-symbols-outlined text-[24px]">sync</span>
            </div>
            <div className="flex flex-col">
              <span className="font-headline-sm text-headline-sm text-primary font-extrabold tracking-tight">SkillSwap</span>
              <span className="font-label-sm text-[11px] text-on-surface-variant font-bold uppercase tracking-wider">Admin Console</span>
            </div>
          </div>

          {/* Dynamic Navigation Links */}
          <AdminSidebarLinks />
        </div>

        {/* Bottom Profile & Exit App */}
        <div className="flex flex-col gap-4 border-t border-outline-variant/30 pt-6">
          <Link
            href="/explore"
            className="w-full py-2.5 px-4 bg-primary text-on-primary hover:bg-primary-container rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all hover:-translate-y-0.5"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            <span>Back to Town Square</span>
          </Link>

          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 rounded-full bg-secondary-container text-primary font-extrabold flex items-center justify-center text-xs shadow-inner">
              {profile?.full_name?.slice(0, 2)?.toUpperCase() || 'AD'}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="font-bold text-xs text-on-surface truncate">{profile?.full_name || 'Admin User'}</span>
              <span className="text-[10px] text-primary font-bold tracking-wide uppercase">Staff Console</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Nav Header */}
      <div className="lg:hidden flex flex-col w-full sticky top-0 z-40 bg-surface border-b border-surface-variant shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary font-bold">sync</span>
            <span className="font-bold text-primary font-headline-sm">SkillSwap Admin</span>
          </div>
          <Link href="/explore" className="text-xs font-bold bg-secondary-container text-on-secondary-container px-3 py-1.5 rounded-lg">
            Exit Admin
          </Link>
        </div>
        <AdminSidebarLinks isMobile />
      </div>

      {/* Main Canvas */}
      <main className="flex-1 flex flex-col min-h-screen lg:ml-64 w-full bg-surface-container-low">
        <div className="flex-1 max-w-[1200px] w-full mx-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
