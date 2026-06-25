import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Sidebar } from '@/components/layout/Sidebar'
import { MobileNav } from '@/components/layout/MobileNav'
import { GlobalTopBar } from '@/components/layout/GlobalTopBar'

export default async function MainLayout({
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

  // Fetch profile for sidebar
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const mainNavItems = [
    { href: '/explore', icon: 'explore', label: 'Explore', matchPattern: '/explore' },
    { href: '/listings', icon: 'list_alt', label: 'My Listings', matchPattern: '/listings' },
    { href: '/exchanges', icon: 'swap_horiz', label: 'My Exchanges', matchPattern: '/exchanges' },
    { href: '/messages', icon: 'chat', label: 'Messages', matchPattern: '/messages' },
    { href: '/notifications', icon: 'notifications', label: 'Notifications', matchPattern: '/notifications' },
    { href: '/profile/me', icon: 'person', label: 'My Profile', matchPattern: '/profile' },
  ]

  return (
    <div className="light bg-surface text-on-surface font-body-md text-body-md antialiased min-h-screen flex flex-col md:flex-row">
      {/* TopNavBar (Mobile Only) */}
      <nav className="md:hidden w-full flex justify-between items-center px-margin-mobile h-16 bg-surface shadow-[0_4px_20px_0_rgba(45,106,79,0.08)] fixed top-0 left-0 z-50">
        <div className="font-headline-md text-headline-md text-primary">SkillSwap</div>
        <div className="flex items-center gap-4">
          <Link href="/notifications" className="text-on-surface-variant hover:text-primary transition-colors">
            <span className="material-symbols-outlined">notifications</span>
          </Link>
          <img 
            alt="User avatar" 
            src={profile?.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + user.id}
            className="w-8 h-8 rounded-full object-cover" 
          />
        </div>
      </nav>

      <Sidebar navItems={mainNavItems} profile={profile} />

      {/* Main Content Canvas */}
      <main className="flex-1 mt-16 md:mt-0 md:ml-[240px] p-margin-mobile md:p-lg max-w-[1200px] mx-auto w-full">
        <GlobalTopBar />
        {children}
      </main>

      <MobileNav navItems={mainNavItems} />
    </div>
  )
}
