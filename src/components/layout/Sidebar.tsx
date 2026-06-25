'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from '@/app/actions/auth'
import { Button } from '@/components/ui/Button'

export type NavItem = {
  href: string
  icon: string
  label: string
  // For matching sub-routes, e.g. /listings/create should keep /listings active
  matchPattern?: string 
}

export function Sidebar({
  navItems,
  baseRoute = '/',
}: {
  navItems: NavItem[]
  baseRoute?: string
}) {
  const pathname = usePathname()

  return (
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
        {navItems.map((item) => {
          let isActive = false
          if (item.matchPattern) {
            isActive = pathname?.startsWith(item.matchPattern) || false
            // Special case: don't highlight My Listings for global listing detail pages
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
              className={`flex items-center gap-3 px-md py-3 transition-all duration-200 ${
                isActive 
                  ? 'text-primary font-bold border-r-4 border-primary bg-secondary-container/10 translate-x-1'
                  : 'text-on-surface-variant hover:bg-secondary-container/30'
              }`}
            >
              <span 
                className="material-symbols-outlined" 
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
              >
                {item.icon}
              </span>
              <span className="font-label-md text-label-md">{item.label}</span>
            </Link>
          )
        })}
        
        <form action={signOut} className="mt-auto mb-4 w-full">
          <button type="submit" className="w-full flex items-center gap-3 px-md py-3 text-on-surface-variant hover:bg-error-container/30 hover:text-error transition-all duration-200">
            <span className="material-symbols-outlined">logout</span>
            <span className="font-label-md text-label-md">Sign Out</span>
          </button>
        </form>
      </nav>
      
      {/* Primary Action Button (e.g. Share a Skill) */}
      {baseRoute === '/explore' && (
        <div className="px-md mt-auto">
          <Button href="/listings/create" variant="primary" className="w-full">
            Share a Skill
          </Button>
        </div>
      )}
    </aside>
  )
}
