'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { NavItem } from './Sidebar'

export function MobileNav({ navItems }: { navItems: NavItem[] }) {
  const pathname = usePathname()

  return (
    <nav className="md:hidden fixed bottom-0 w-full bg-surface-container-lowest border-t border-outline-variant/20 flex justify-around items-center h-16 px-4 z-50 shadow-[0_-4px_20px_-4px_rgba(45,106,79,0.08)]">
      {navItems.slice(0, 5).map((item) => {
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
            className={`flex flex-col items-center gap-1 transition-colors ${
              isActive ? 'text-primary' : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            <span 
              className="material-symbols-outlined text-[24px]" 
              style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
            >
              {item.icon}
            </span>
            <span className={`font-label-sm text-[10px] leading-none ${isActive ? 'font-bold' : 'font-normal'}`}>
              {item.label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
