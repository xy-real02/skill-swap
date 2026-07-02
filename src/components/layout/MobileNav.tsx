'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from '@/features/users/actions/auth'
import type { NavItem } from './Sidebar'

export function MobileNav({ navItems, currentUserId }: { navItems: NavItem[], currentUserId?: string }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMenuOpen(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const checkIsActive = (item: NavItem) => {
    if (item.label === 'My Profile') {
      return pathname === `/profile/${currentUserId}` || pathname === '/profile/me' || pathname?.startsWith('/profile/edit') || false
    }
    if (item.matchPattern) {
      let active = pathname?.startsWith(item.matchPattern) || false
      if (item.href === '/listings' && pathname && pathname !== '/listings' && pathname !== '/listings/create') {
        active = false
      }
      return active
    }
    return pathname === item.href
  }

  const exploreItem = navItems.find(item => item.href === '/explore')
  const notifItem = navItems.find(item => item.href === '/notifications')
  
  const primaryHrefs = ['/explore', '/notifications']
  const menuItems = navItems.filter(item => !primaryHrefs.includes(item.href))

  const isBurgerActive = isMenuOpen || menuItems.some(checkIsActive)

  const renderNavButton = (item: NavItem) => {
    const isActive = checkIsActive(item)
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
  }

  return (
    <>
      {/* Floating Bottom Sheet Menu Overlay via Portal */}
      {isMenuOpen && mounted && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[9999] md:hidden flex flex-col justify-end animate-in fade-in duration-200">
          {/* Backdrop Scrim */}
          <div
            className="fixed inset-0 bg-scrim/60 backdrop-blur-sm cursor-pointer"
            onClick={() => setIsMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Bottom Sheet Drawer */}
          <div className="relative bg-surface-container-lowest border-t border-outline-variant/30 rounded-t-[32px] p-6 shadow-2xl z-10 animate-slide-up space-y-5 pb-8">
            {/* Drag Handle Bar */}
            <div className="w-12 h-1.5 bg-outline-variant/40 rounded-full mx-auto" />

            {/* Sheet Header */}
            <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                  <span className="material-symbols-outlined text-[18px]">widgets</span>
                </div>
                <h3 className="font-headline-sm text-lg font-bold text-on-surface">Navigation</h3>
              </div>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="w-8 h-8 rounded-full bg-surface-container hover:bg-surface-variant flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
                title="Close menu"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            {/* Hidden Nav Items Grid */}
            <div className="grid grid-cols-2 gap-3">
              {menuItems.map((item) => {
                const active = checkIsActive(item)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center gap-3 p-3.5 rounded-2xl border transition-all ${
                      active
                        ? 'bg-primary/10 border-primary/30 text-primary font-bold shadow-sm'
                        : 'bg-surface border-outline-variant/20 text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
                    }`}
                  >
                    <span
                      className="material-symbols-outlined text-[22px]"
                      style={active ? { fontVariationSettings: "'FILL' 1" } : {}}
                    >
                      {item.icon}
                    </span>
                    <span className="font-label-md text-sm truncate">{item.label}</span>
                  </Link>
                )
              })}
            </div>

            <div className="h-px bg-outline-variant/20 w-full" />

            {/* Sign Out Action */}
            <form action={signOut} className="w-full">
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-error/10 text-error hover:bg-error hover:text-on-error rounded-2xl font-bold font-label-md transition-colors shadow-sm cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">logout</span>
                <span>Sign Out</span>
              </button>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Mobile Bottom Navbar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface-container-lowest border-t border-outline-variant/20 flex justify-around items-center h-16 px-4 z-50 shadow-[0_-4px_20px_-4px_rgba(45,106,79,0.08)]">
        {/* Explore */}
        {exploreItem && renderNavButton(exploreItem)}

        {/* Notifications */}
        {notifItem && renderNavButton(notifItem)}

        {/* Burger Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`flex flex-col items-center gap-1 transition-colors cursor-pointer focus:outline-none ${
            isBurgerActive ? 'text-primary' : 'text-on-surface-variant hover:text-primary'
          }`}
          aria-expanded={isMenuOpen}
          aria-label="Toggle navigation menu"
        >
          <span
            className="material-symbols-outlined text-[24px]"
            style={isBurgerActive ? { fontVariationSettings: "'FILL' 1" } : {}}
          >
            menu
          </span>
          <span className={`font-label-sm text-[10px] leading-none ${isBurgerActive ? 'font-bold' : 'font-normal'}`}>
            Menu
          </span>
        </button>
      </nav>
    </>
  )
}
