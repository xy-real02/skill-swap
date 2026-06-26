'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { cancelRequest } from '@/features/requests/actions/cancelRequest'
import { RequestWithProfile } from '../queries/getActiveRequests'
import { RequestCard } from './RequestCard'

export function MyRequestTableView({ requests, currentUserId }: { requests: RequestWithProfile[], currentUserId: string }) {
  const [cancellingId, setCancellingId] = useState<string | null>(null)
  const [activeModalItem, setActiveModalItem] = useState<RequestWithProfile | null>(null)
  const [menuPos, setMenuPos] = useState<{ id: string; style: React.CSSProperties } | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

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
                  My Request Details
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

      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant/30 bg-surface-container-low/50 text-on-surface-variant font-label-md text-xs uppercase">
                <th className="py-3.5 px-6 font-bold">Request Title</th>
                <th className="py-3.5 px-4 font-bold">Category</th>
                <th className="py-3.5 px-4 font-bold">Status</th>
                <th className="py-3.5 px-4 font-bold">Expires</th>
                <th className="py-3.5 px-6 text-right font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20 font-body-md text-sm">
              {requests.map((req) => {
                const expiresAt = req.expires_at ? new Date(req.expires_at) : new Date()
                const daysLeft = Math.ceil((expiresAt.getTime() - new Date().getTime()) / (1000 * 3600 * 24))
                const isOwner = req.owner_id === currentUserId
                const isCancelling = cancellingId === req.id

                return (
                  <tr 
                    key={req.id} 
                    className="hover:bg-surface-container-lowest/80 transition-colors cursor-pointer"
                    onClick={() => setActiveModalItem(req)}
                  >
                    <td className="py-4 px-6 font-bold text-on-surface max-w-[280px] truncate">
                      {req.title}
                    </td>
                    <td className="py-4 px-4 text-on-surface-variant">
                      <span className="bg-primary-container/60 text-on-primary-container px-2.5 py-1 rounded-full text-xs font-bold">
                        {req.category}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2.5 py-1 rounded text-xs font-bold ${req.status === 'Cancelled' ? 'bg-error/10 text-error' : 'bg-emerald-500/10 text-emerald-600'}`}>
                        {req.status}
                      </span>
                    </td>
                    <td suppressHydrationWarning className="py-4 px-4 text-on-surface-variant text-xs font-medium">
                      {req.status === 'Cancelled' ? '-' : daysLeft > 0 ? `${daysLeft} days left` : 'Expired'}
                    </td>
                    <td className="py-4 px-6 text-right relative" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          if (menuPos?.id === req.id) {
                            setMenuPos(null)
                          } else {
                            const rect = e.currentTarget.getBoundingClientRect()
                            const spaceBelow = window.innerHeight - rect.bottom
                            const style: React.CSSProperties = spaceBelow < 160
                              ? { bottom: window.innerHeight - rect.top + 4, right: window.innerWidth - rect.right }
                              : { top: rect.bottom + 4, right: window.innerWidth - rect.right }
                            setMenuPos({ id: req.id, style })
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
      </div>

      {/* Dropdown Menu Portal */}
      {menuPos && mounted && typeof document !== 'undefined' && (() => {
        const activeItem = requests.find(r => r.id === menuPos.id)
        if (!activeItem) return null
        const isOwner = activeItem.owner_id === currentUserId
        const isCancelling = cancellingId === activeItem.id
        return createPortal(
          <>
            <div 
              className="fixed inset-0 z-[9998]" 
              onClick={() => setMenuPos(null)} 
            />
            <div 
              style={menuPos.style}
              className="fixed z-[9999] w-44 bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-xl py-1 animate-in fade-in zoom-in-95 duration-150 divide-y divide-outline-variant/20 text-left font-body-md"
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
                {isOwner && activeItem.status === 'Active' && (
                  <button
                    onClick={async () => {
                      setMenuPos(null)
                      if (window.confirm('Are you sure you want to cancel this request?')) {
                        setCancellingId(activeItem.id)
                        await cancelRequest(activeItem.id)
                        setCancellingId(null)
                      }
                    }}
                    disabled={isCancelling}
                    className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-bold text-error hover:bg-error/10 transition-colors w-full text-left disabled:opacity-50 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">{isCancelling ? 'hourglass_empty' : 'cancel'}</span>
                    {isCancelling ? 'Cancelling...' : 'Cancel Request'}
                  </button>
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
