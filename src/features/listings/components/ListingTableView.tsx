'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ListingCard, type ListingWithProfile } from './ListingCard'

export function ListingTableView({ listings, currentUserId }: { listings: ListingWithProfile[], currentUserId?: string }) {
  const [activeModalItem, setActiveModalItem] = useState<ListingWithProfile | null>(null)
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

  if (listings.length === 0) return null

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
                  <span className="material-symbols-outlined text-[18px]">inventory_2</span>
                </div>
                <h3 className="font-headline-sm text-[18px] font-bold text-on-surface line-clamp-1">
                  Listing Details
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
              <ListingCard listing={activeModalItem} currentUserId={currentUserId} />
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
              <th className="py-3 px-3 sm:px-4 font-bold">Skill Offered</th>
              <th className="py-3 px-3 sm:px-4 font-bold hidden lg:table-cell">Looking For</th>
              <th className="py-3 px-3 sm:px-4 font-bold hidden sm:table-cell">Location</th>
              <th className="py-3 px-3 sm:px-4 text-right font-bold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-variant/60 font-body-sm text-sm">
            {listings.map((listing) => {
              const profile = listing.profiles
              const avatar = profile?.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + (profile?.id || 'default')
              const isOwner = listing.owner_id === currentUserId

              return (
                <tr
                  key={listing.id}
                  onClick={() => setActiveModalItem(listing)}
                  className="hover:bg-surface-container-low/60 transition-colors group cursor-pointer active:bg-surface-container-low"
                  title="Click to view full details"
                >
                  <td className="py-3.5 px-3 sm:px-4 whitespace-nowrap align-top sm:align-middle">
                    <Link
                      href={`/profile/${listing.owner_id}`}
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
                      {listing.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 sm:px-4 min-w-[160px] align-top sm:align-middle">
                    {/* Mobile category badge */}
                    <div className="mb-1 md:hidden">
                      <span className="bg-primary-container text-on-primary-container text-[10px] px-2 py-0.5 rounded-full font-bold">
                        {listing.category}
                      </span>
                    </div>
                    
                    <p className="font-label-md font-bold text-on-surface line-clamp-1 group-hover:text-primary transition-colors" title={listing.title}>{listing.title}</p>
                    <p className="text-on-surface-variant text-xs line-clamp-1 mt-0.5" title={listing.description}>{listing.description}</p>
                    
                    {/* Looking for / Location on mobile */}
                    <div className="text-on-surface-variant text-[11px] mt-1.5 space-y-0.5 lg:hidden">
                      <p className="line-clamp-1"><span className="font-bold text-on-surface/80">Looking for:</span> {listing.exchange_preference || 'Open to offers'}</p>
                      {listing.location_note && (
                        <p className="line-clamp-1 sm:hidden flex items-center gap-0.5 text-xs text-primary/80 font-bold">
                          <span className="material-symbols-outlined text-[12px]">location_on</span>
                          <span>{listing.location_note}</span>
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="py-3.5 px-3 sm:px-4 text-on-surface-variant max-w-[180px] truncate hidden lg:table-cell align-middle" title={listing.exchange_preference || 'Open to offers'}>
                    {listing.exchange_preference || 'Open to offers'}
                  </td>
                  <td className="py-3.5 px-3 sm:px-4 whitespace-nowrap text-on-surface-variant text-xs hidden sm:table-cell align-middle">
                    {listing.location_note ? (
                      <span className="flex items-center gap-1 bg-surface-variant px-2 py-0.5 rounded-md text-on-surface-variant truncate max-w-[120px] font-bold">
                        <span className="material-symbols-outlined text-[14px]">location_on</span>
                        <span className="truncate">{listing.location_note}</span>
                      </span>
                    ) : '—'}
                  </td>
                  <td className="py-3.5 px-3 sm:px-4 whitespace-nowrap text-right align-top sm:align-middle">
                    {!isOwner && currentUserId ? (
                      <Link
                        href={`?tab=listings&modal=propose-listing&listingId=${listing.id}&providerId=${listing.owner_id}&title=${encodeURIComponent(listing.title)}`}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 bg-primary text-on-primary hover:bg-primary/90 font-label-sm text-xs py-1.5 px-3 rounded-full transition-colors shadow-sm font-bold mt-0.5 sm:mt-0"
                      >
                        <span className="material-symbols-outlined text-[14px]">sync</span>
                        <span>Propose</span>
                      </Link>
                    ) : !currentUserId ? (
                      <Link
                        href="/login"
                        onClick={(e) => e.stopPropagation()}
                        className="text-xs text-primary font-bold hover:underline"
                      >
                        Log in
                      </Link>
                    ) : null}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}
