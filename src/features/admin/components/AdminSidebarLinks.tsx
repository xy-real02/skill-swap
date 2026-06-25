'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function AdminSidebarLinks({ isMobile = false }: { isMobile?: boolean }) {
  const pathname = usePathname()

  const navItems = [
    { href: '/admin/members', label: 'Members Directory', mobileLabel: 'Members', icon: 'groups' },
    { href: '/admin/analytics', label: 'Platform Analytics', mobileLabel: 'Analytics', icon: 'analytics' },
    { href: '/admin/moderation-log', label: 'Moderation Log', mobileLabel: 'Mod Log', icon: 'shield' },
    { href: '/admin/config', label: 'Community Settings', mobileLabel: 'Settings', icon: 'settings' },
  ]

  if (isMobile) {
    return (
      <div className="flex bg-surface-container-low px-2 pt-1 overflow-x-auto gap-1 w-full border-t border-outline-variant/20">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 text-center py-2.5 text-xs font-bold transition-all ${
                isActive
                  ? 'text-primary border-b-2 border-primary bg-surface shadow-sm font-extrabold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {item.mobileLabel}
            </Link>
          )
        })}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-1.5">
      {navItems.map((item) => {
        const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all hover:translate-x-1 ${
              isActive
                ? 'bg-secondary-container text-on-secondary-container shadow-sm font-extrabold'
                : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        )
      })}
    </div>
  )
}
