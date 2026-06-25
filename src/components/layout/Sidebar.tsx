'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from '@/app/actions/auth'

export type NavItem = {
  href: string
  icon: string
  label: string
  matchPattern?: string 
}

export function Sidebar({
  navItems,
  profile,
}: {
  navItems: NavItem[]
  profile?: any
}) {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex flex-col py-6 gap-6 fixed left-0 top-0 h-full w-[240px] bg-surface-container-lowest border-r border-outline-variant/30 z-40">
      {/* Brand Header */}
      <div className="px-6 mb-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-container flex items-center justify-center text-on-primary font-bold shadow-md relative overflow-hidden group">
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          <span className="relative z-10 font-headline-sm">S</span>
        </div>
        <div>
          <div className="font-headline-sm text-headline-sm text-on-surface font-bold tracking-tight">SkillSwap</div>
          <div className="font-label-sm text-label-sm text-primary tracking-wide uppercase text-[10px] font-bold">Town Square</div>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-1 px-3">
        {navItems.map((item) => {
          let isActive = false
          if (item.label === 'My Profile') {
            isActive = pathname === `/profile/${profile?.id}` || pathname === '/profile/me' || pathname?.startsWith('/profile/edit') || false
          } else if (item.matchPattern) {
            isActive = pathname?.startsWith(item.matchPattern) || false
            if (item.href === '/listings' && pathname && pathname !== '/listings' && pathname !== '/listings/create') {
              isActive = false
            }
          } else {
            isActive = pathname === item.href
          }

          return (
            <Link 
              key={item.href}
              href={item.href} 
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300 relative overflow-hidden ${
                isActive 
                  ? 'bg-secondary-container/30 text-primary font-bold shadow-sm'
                  : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
              }`}
            >
              {/* Active Indicator Glow */}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-primary rounded-r-full shadow-[0_0_8px_rgba(45,106,79,0.6)]"></div>
              )}
              
              <span 
                className="material-symbols-outlined transition-transform duration-300 group-hover:scale-110" 
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
              >
                {item.icon}
              </span>
              <span className="font-label-md text-label-md relative z-10">{item.label}</span>
            </Link>
          )
        })}
      </nav>
      
      {/* User Profile Integration (Bottom) */}
      <div className="mt-auto px-4 w-full">
        <div className="bg-surface-container-low rounded-xl p-3 border border-outline-variant/30 flex flex-col gap-3 shadow-sm relative overflow-hidden group">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
          
          <div className="flex items-center gap-3">
            <img 
              src={profile?.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + (profile?.id || 'default')}
              alt={profile?.full_name || 'User'}
              className="w-10 h-10 rounded-full object-cover border border-outline-variant/30"
            />
            <div className="min-w-0 flex-1">
              <div className="font-label-md text-label-md text-on-surface font-bold truncate">{profile?.full_name || 'User'}</div>
              <div className="font-label-sm text-[11px] text-on-surface-variant truncate">
                {profile?.role === 'admin' ? 'Community Admin' : profile?.role === 'moderator' ? 'Community Mod' : 'Member'}
              </div>
            </div>
          </div>
          
          <div className="h-px bg-outline-variant/30 w-full"></div>
          
          <form action={signOut} className="w-full">
            <button type="submit" className="w-full flex items-center justify-center gap-2 py-1.5 text-on-surface-variant hover:text-error hover:bg-error-container/30 rounded-lg transition-colors font-label-sm text-label-sm">
              <span className="material-symbols-outlined text-[16px]">logout</span>
              Sign Out
            </button>
          </form>
        </div>
      </div>
    </aside>
  )
}
