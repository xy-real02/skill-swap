import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

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

  return (
    <div className="light bg-surface text-on-surface font-body-md text-body-md antialiased min-h-screen flex flex-col md:flex-row">
      {/* TopNavBar (Mobile Only) */}
      <nav className="md:hidden w-full flex justify-between items-center px-margin-mobile h-16 bg-surface shadow-[0_4px_20px_0_rgba(45,106,79,0.08)] fixed top-0 left-0 z-50">
        <div className="font-headline-md text-headline-md text-primary">SkillSwap</div>
        <div className="flex items-center gap-4">
          <button className="text-on-surface-variant hover:text-primary transition-colors">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <img 
            alt="User avatar" 
            src={profile?.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + user.id}
            className="w-8 h-8 rounded-full object-cover" 
          />
        </div>
      </nav>

      {/* SideNavBar (Desktop Only) */}
      <aside className="hidden md:flex flex-col py-lg gap-base fixed left-0 top-0 h-full w-[240px] bg-surface-container-low shadow-[0_0_15px_rgba(45,106,79,0.05)] z-40">
        <div className="px-md mb-8 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary font-bold">
            S
          </div>
          <div>
            <div className="font-headline-sm text-headline-sm text-primary">SkillSwap</div>
            <div className="font-label-sm text-label-sm text-on-surface-variant">Digital Town Square</div>
          </div>
        </div>
        <nav className="flex-1 flex flex-col">
          <Link href="/explore" className="flex items-center gap-3 px-md py-3 text-primary font-bold border-r-4 border-primary bg-secondary-container/10 translate-x-1 transition-all duration-200">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>explore</span>
            <span className="font-label-md text-label-md">Explore</span>
          </Link>
          <Link href="/listings" className="flex items-center gap-3 px-md py-3 text-on-surface-variant hover:bg-secondary-container/30 transition-all duration-200">
            <span className="material-symbols-outlined">list_alt</span>
            <span className="font-label-md text-label-md">My Listings</span>
          </Link>
          <Link href="/exchanges" className="flex items-center gap-3 px-md py-3 text-on-surface-variant hover:bg-secondary-container/30 transition-all duration-200">
            <span className="material-symbols-outlined">swap_horiz</span>
            <span className="font-label-md text-label-md">My Exchanges</span>
          </Link>
          <Link href="/messages" className="flex items-center gap-3 px-md py-3 text-on-surface-variant hover:bg-secondary-container/30 transition-all duration-200">
            <span className="material-symbols-outlined">chat</span>
            <span className="font-label-md text-label-md">Messages</span>
          </Link>
          <Link href="/profile" className="flex items-center gap-3 px-md py-3 text-on-surface-variant hover:bg-secondary-container/30 transition-all duration-200 mt-auto mb-4">
            <span className="material-symbols-outlined">person</span>
            <span className="font-label-md text-label-md">Profile</span>
          </Link>
        </nav>
        <div className="px-md mt-auto">
          <Link href="/listings/create" className="w-full bg-primary text-on-primary font-label-md text-label-md py-3 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center">
            Share a Skill
          </Link>
        </div>
      </aside>

      {/* Main Content Canvas */}
      <main className="flex-1 mt-16 md:mt-0 md:ml-[240px] p-margin-mobile md:p-lg max-w-[1200px] mx-auto w-full">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 w-full bg-surface-container-lowest border-t border-outline-variant/20 flex justify-around items-center h-16 px-4 z-50 shadow-[0_-4px_20px_-4px_rgba(45,106,79,0.08)]">
        <Link href="/explore" className="flex flex-col items-center gap-1 text-primary">
          <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>explore</span>
          <span className="font-label-sm text-[10px] leading-none">Explore</span>
        </Link>
        <Link href="/listings" className="flex flex-col items-center gap-1 text-on-surface-variant hover:text-primary transition-colors">
          <span className="material-symbols-outlined text-[24px]">list_alt</span>
          <span className="font-label-sm text-[10px] leading-none font-normal">Listings</span>
        </Link>
        <Link href="/exchanges" className="flex flex-col items-center gap-1 text-on-surface-variant hover:text-primary transition-colors">
          <span className="material-symbols-outlined text-[24px]">swap_horiz</span>
          <span className="font-label-sm text-[10px] leading-none font-normal">Exchanges</span>
        </Link>
        <Link href="/messages" className="flex flex-col items-center gap-1 text-on-surface-variant hover:text-primary transition-colors">
          <span className="material-symbols-outlined text-[24px]">chat_bubble</span>
          <span className="font-label-sm text-[10px] leading-none font-normal">Messages</span>
        </Link>
      </nav>
    </div>
  )
}
