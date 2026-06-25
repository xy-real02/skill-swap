'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { RequestCard } from './RequestCard'
import type { RequestWithProfile } from '../queries/getActiveRequests'

export function RequestTableView({ requests, currentUserId }: { requests: RequestWithProfile[], currentUserId?: string }) {
  const [activeModalItem, setActiveModalItem] = useState<RequestWithProfile | null>(null)
  const [menuPos, setMenuPos] = useState<{ id: string; style: React.CSSProperties } | null>(null)
  const [mounted, setMounted] = useState(false)
  const searchParams = useSearchParams()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    setActiveModalItem(null)
  }, [searchParams])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveModalItem(null)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeModalItem])

  useEffect(() => {
    if (!menuPos) return
    const handleScroll = () => setMenuPos(null)
    window.addEventListener('scroll', handleScroll, true)
    return () => window.removeEventListener('scroll', handleScroll, true)
  }, [menuPos])

  if (requests.length === 0) return null

  return (
    <>
      {/* Detail Modal Dialog via Portal */}
      {activeModalItem && mounted && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 md:p-10 overflow-y-auto animate-in fade-in duration-200">
          {/* Backdrop Scrim */}
          <div
            className="fixed inset-0 bg-scrim/60 backdrop-blur-sm transition-opacity cursor-pointer"
            onClick={() => setActiveModalItem(null)}
            aria-hidden="true"
          />

          {/* Modal Box */}
          <div
            className="relative w-full max-w-2xl bg-surface-container-lowest border border-outline-variant/30 rounded-3xl shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col my-auto"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header Bar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/20 bg-surface/80 backdrop-blur-md shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                  <span className="material-symbols-outlined text-[18px]">live_help</span>
                </div>
                <h3 className="font-headline-sm text-[18px] font-bold text-on-surface line-clamp-1">
                  Request Details
                </h3>
              </div>
              <button
                onClick={() => setActiveModalItem(null)}
                className="w-10 h-10 rounded-full hover:bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors focus:outline-none cursor-pointer"
                aria-label="Close modal"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 w-full">
              <RequestCard request={activeModalItem} currentUserId={currentUserId} isModal={true} />
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Table Content */}
      <div className="col-span-full overflow-x-auto bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-sm w-full">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-surface-variant bg-surface-container-low text-on-surface-variant font-label-sm text-[11px] sm:text-xs uppercase tracking-wider">
              <th className="py-3 px-3 sm:px-4 font-bold">Neighbor</th>
              <th className="py-3 px-3 sm:px-4 font-bold hidden md:table-cell">Category</th>
              <th className="py-3 px-3 sm:px-4 font-bold">Skill Requested</th>
              <th className="py-3 px-3 sm:px-4 font-bold hidden lg:table-cell">Offering in Return</th>
              <th className="py-3 px-3 sm:px-4 font-bold hidden sm:table-cell">Timeframe</th>
              <th className="py-3 px-3 sm:px-4 text-right font-bold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-variant/60 font-body-sm text-sm">
            {requests.map((request) => {
              const profile = request.profiles
              const avatar = profile?.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + (profile?.id || 'default')
              const isOwner = currentUserId === request.owner_id

              return (
                <tr
                  key={request.id}
                  onClick={() => setActiveModalItem(request)}
                  className="hover:bg-surface-container-low/60 transition-colors group cursor-pointer active:bg-surface-container-low"
                  title="Click to view full details"
                >
                  <td className="py-3.5 px-3 sm:px-4 whitespace-nowrap align-top sm:align-middle">
                    <Link
                      href={`/profile/${request.owner_id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-2 sm:gap-2.5 group/profile w-fit"
                    >
                      <img src={avatar} alt={profile?.full_name || 'User'} className="w-8 h-8 rounded-full object-cover shrink-0" />
                      <div>
                        <p className="font-label-md font-bold text-on-surface group-hover/profile:text-primary transition-colors max-w-[90px] sm:max-w-[140px] truncate">
                          {profile?.full_name || 'Anonymous'}
                        </p>
                        <div className="flex items-center gap-1 text-on-surface-variant text-[11px]">
                          <span className="material-symbols-outlined text-[13px] text-amber-500">star</span>
                          <span>{profile?.reputation_score?.toFixed(1) || 'New'}</span>
                        </div>
                      </div>
                    </Link>
                  </td>
                  <td className="py-3.5 px-3 sm:px-4 whitespace-nowrap hidden md:table-cell align-middle">
                    <span className="bg-primary-container text-on-primary-container font-label-sm text-xs px-2.5 py-1 rounded-full font-bold">
                      {request.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 sm:px-4 min-w-[160px] align-top sm:align-middle">
                    {/* Mobile category badge */}
                    <div className="mb-1 md:hidden">
                      <span className="bg-primary-container text-on-primary-container text-[10px] px-2 py-0.5 rounded-full font-bold">
                        {request.category}
                      </span>
                    </div>
                    
                    <p className="font-label-md font-bold text-on-surface line-clamp-1 group-hover:text-primary transition-colors" title={request.title}>{request.title}</p>
                    <p className="text-on-surface-variant text-xs line-clamp-1 mt-0.5" title={request.description}>{request.description}</p>
                    
                    {/* Offering / Timeframe on mobile */}
                    <div className="text-on-surface-variant text-[11px] mt-1.5 space-y-0.5 lg:hidden">
                      <p className="line-clamp-1"><span className="font-bold text-on-surface/80">Offering:</span> {request.offered_in_return || 'Open to offers'}</p>
                      <p className="line-clamp-1 sm:hidden text-xs text-primary/80 font-bold">{request.desired_timeframe || 'Flexible'}</p>
                    </div>
                  </td>
                  <td className="py-3.5 px-3 sm:px-4 text-on-surface-variant max-w-[180px] truncate hidden lg:table-cell align-middle" title={request.offered_in_return || 'Open to offers'}>
                    {request.offered_in_return || 'Open to offers'}
                  </td>
                  <td className="py-3.5 px-3 sm:px-4 whitespace-nowrap text-on-surface-variant text-xs font-bold hidden sm:table-cell align-middle">
                    {request.desired_timeframe || 'Flexible'}
                  </td>
                  <td className="py-3.5 px-3 sm:px-4 whitespace-nowrap text-right align-middle relative" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        if (menuPos?.id === request.id) {
                          setMenuPos(null)
                        } else {
                          const rect = e.currentTarget.getBoundingClientRect()
                          const spaceBelow = window.innerHeight - rect.bottom
                          const style: React.CSSProperties = spaceBelow < 160
                            ? { bottom: window.innerHeight - rect.top + 4, right: window.innerWidth - rect.right }
                            : { top: rect.bottom + 4, right: window.innerWidth - rect.right }
                          setMenuPos({ id: request.id, style })
                        }
                      }}
                      className="w-8 h-8 rounded-full hover:bg-surface-container-high inline-flex items-center justify-center text-on-surface-variant transition-colors cursor-pointer border border-outline-variant/30 bg-surface shadow-sm"
                      title="Actions"
                    >
                      <span className="material-symbols-outlined text-[18px]">more_vert</span>
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Dropdown Menu Portal */}
      {menuPos && mounted && typeof document !== 'undefined' && (() => {
        const activeItem = requests.find(r => r.id === menuPos.id)
        if (!activeItem) return null
        const isOwner = currentUserId && activeItem.owner_id === currentUserId
        return createPortal(
          <>
            <div 
              className="fixed inset-0 z-[9998]" 
              onClick={() => setMenuPos(null)} 
            />
            <div 
              style={menuPos.style}
              className="fixed z-[9999] w-48 bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-xl py-1 animate-in fade-in zoom-in-95 duration-150 divide-y divide-outline-variant/20 text-left font-body-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="py-1">
                <button
                  onClick={() => {
                    setMenuPos(null)
                    setActiveModalItem(activeItem)
                  }}
                  className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-bold text-on-surface hover:bg-surface-container-low transition-colors w-full text-left cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px] text-primary">visibility</span>
                  View Details
                </button>
                {!isOwner && currentUserId && (
                  <Link
                    href={`?tab=requests&modal=propose-request&requestId=${activeItem.id}&seekerId=${activeItem.owner_id}&title=${encodeURIComponent(activeItem.title)}`}
                    onClick={() => setMenuPos(null)}
                    className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-bold text-primary hover:bg-surface-container-low transition-colors w-full cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">handshake</span>
                    I Can Help
                  </Link>
                )}
                {!currentUserId && (
                  <Link
                    href="/login"
                    onClick={() => setMenuPos(null)}
                    className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-bold text-primary hover:bg-surface-container-low transition-colors w-full cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">login</span>
                    Log in to Help
                  </Link>
                )}
              </div>
            </div>
          </>,
          document.body
        )
      })()}
    </>
  )
}
