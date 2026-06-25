'use client'

import Link from 'next/link'
import { useState } from 'react'
import { createPortal } from 'react-dom'
import { deleteListing } from '@/features/listings/actions/deleteListing'
import { pauseListing } from '@/features/listings/actions/pauseListing'
import { ReportModal } from '@/features/moderation/components/ReportModal'
import { TrustedMemberBadge } from '@/components/ui/TrustedMemberBadge'
import type { Database } from '@/types/database.types'

type ListingRow = Database['public']['Tables']['listings']['Row']
type ProfileRow = Database['public']['Tables']['profiles']['Row']

export type ListingWithProfile = ListingRow & {
  profiles: Pick<ProfileRow, 'id' | 'full_name' | 'avatar_url' | 'community_zone' | 'reputation_score' | 'exchange_count'> | null
}

export function ListingCard({ listing, currentUserId, isModal = false }: { listing: ListingWithProfile, currentUserId?: string, isModal?: boolean }) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const isOwner = currentUserId === listing.owner_id
  const profile = listing.profiles

  return (
    <>
      {modalOpen && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 md:p-10 overflow-y-auto animate-in fade-in duration-200">
          <div
            className="fixed inset-0 bg-scrim/60 backdrop-blur-sm transition-opacity cursor-pointer"
            onClick={() => setModalOpen(false)}
          />
          <div
            className="relative w-full max-w-2xl bg-surface-container-lowest border border-outline-variant/30 rounded-3xl shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col my-auto"
            onClick={(e) => e.stopPropagation()}
          >
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
                onClick={() => setModalOpen(false)}
                className="w-10 h-10 rounded-full hover:bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors focus:outline-none cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 w-full">
              <ListingCard listing={listing} currentUserId={currentUserId} isModal={true} />
            </div>
          </div>
        </div>,
        document.body
      )}

      <article className={`flex flex-col bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 transition-shadow group h-full ${isModal ? '' : 'hover:shadow-md'}`}>
        <div className="flex justify-between items-start mb-4 gap-2 flex-wrap">
          <span className="bg-primary-container text-on-primary-container font-label-sm text-label-sm px-3 py-1 rounded-full font-bold truncate max-w-full">
            {listing.category}
          </span>
          <div className="flex items-center gap-1.5 flex-wrap max-w-full min-w-0">
            {listing.status === 'Paused' && (
              <span className="bg-amber-500/10 text-amber-600 font-label-sm text-label-sm px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 shrink-0">
                <span className="material-symbols-outlined text-[14px]">pause</span>
                Paused
              </span>
            )}
            <span className="bg-surface-variant text-on-surface-variant font-label-sm text-label-sm px-3 py-1 rounded-full font-bold truncate max-w-full" title={listing.availability || 'Flexible'}>
              {listing.availability || 'Flexible'}
            </span>
          </div>
        </div>
        
        <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2 font-bold line-clamp-2">
          {listing.title}
        </h3>
        
        <p className="font-body-md text-body-md text-on-surface-variant mb-6 line-clamp-3 flex-grow">
          {listing.description}
        </p>
        
        {listing.exchange_preference && (
          <div className="bg-surface-container rounded-xl p-4 mb-6">
            <h4 className="font-label-sm text-label-sm text-on-surface font-bold mb-1">Looking for in return:</h4>
            <p className="font-body-sm text-body-sm text-on-surface-variant">{listing.exchange_preference}</p>
          </div>
        )}
        
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-surface-variant gap-4">
          <Link href={`/profile/${listing.owner_id}`} className="flex items-center gap-3 group/profile min-w-0">
            <div className="relative shrink-0">
              <img 
                src={profile?.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + listing.owner_id} 
                alt={profile?.full_name || 'Member'} 
                className="w-10 h-10 rounded-full object-cover shrink-0 border-2 border-transparent group-hover/profile:border-primary transition-colors"
              />
              <TrustedMemberBadge score={profile?.reputation_score} variant="compact" />
            </div>
            <div className="min-w-0">
              <p className="font-label-md text-label-md text-on-surface font-bold truncate group-hover/profile:text-primary transition-colors">
                {profile?.full_name || 'Anonymous Member'}
              </p>
              <div className="flex items-center gap-1 text-on-surface-variant font-label-sm text-[11px]">
                <span className="material-symbols-outlined text-[14px]">star</span>
                <span>{profile?.reputation_score?.toFixed(1) || 'New'}</span>
                <span className="mx-0.5">•</span>
                <span className="truncate">{profile?.community_zone || 'Neighbor'}</span>
              </div>
            </div>
          </Link>
          
          {isOwner ? (
            <div className="relative shrink-0">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="w-9 h-9 rounded-full hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant transition-colors cursor-pointer border border-outline-variant/30 bg-surface shadow-sm"
                title="Listing options"
                aria-expanded={menuOpen}
              >
                <span className="material-symbols-outlined text-[20px]">more_vert</span>
              </button>

              {menuOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setMenuOpen(false)} 
                  />
                  <div className="absolute right-0 bottom-11 z-20 w-44 bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-xl py-1.5 animate-in fade-in zoom-in-95 duration-150 divide-y divide-outline-variant/20">
                    <div className="py-1">
                      {!isModal && (
                        <button
                          onClick={() => { setMenuOpen(false); setModalOpen(true); }}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-on-surface hover:bg-surface-container-low transition-colors w-full text-left cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px] text-primary">visibility</span>
                          View Details
                        </button>
                      )}
                      <Link
                        href={`/listings/${listing.id}/edit`}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-on-surface hover:bg-surface-container-low transition-colors w-full text-left cursor-pointer"
                        onClick={() => setMenuOpen(false)}
                      >
                        <span className="material-symbols-outlined text-[16px] text-primary">edit</span>
                        Edit Listing
                      </Link>
                      <button
                        onClick={async () => {
                          setMenuOpen(false)
                          const nextStatus = listing.status === 'Paused' ? 'Active' : 'Paused'
                          await pauseListing(listing.id, nextStatus)
                        }}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-on-surface hover:bg-surface-container-low transition-colors w-full text-left cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px] text-amber-600">{listing.status === 'Paused' ? 'play_arrow' : 'pause'}</span>
                        {listing.status === 'Paused' ? 'Resume Listing' : 'Pause Listing'}
                      </button>
                    </div>
                    <div className="py-1">
                      <button
                        onClick={async () => {
                          setMenuOpen(false)
                          if (window.confirm('Are you sure you want to delete this listing? This action cannot be undone.')) {
                            setIsDeleting(true)
                            try {
                              await deleteListing(listing.id)
                            } catch (e) {
                              console.error(e)
                              alert('Failed to delete listing.')
                              setIsDeleting(false)
                            }
                          }
                        }}
                        disabled={isDeleting}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-error hover:bg-error/10 transition-colors w-full text-left disabled:opacity-50 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px]">{isDeleting ? 'hourglass_empty' : 'delete'}</span>
                        {isDeleting ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="relative shrink-0">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="w-9 h-9 rounded-full hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant transition-colors cursor-pointer border border-outline-variant/30 bg-surface shadow-sm"
                title="Listing options"
                aria-expanded={menuOpen}
              >
                <span className="material-symbols-outlined text-[20px]">more_vert</span>
              </button>

              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                  <div className="absolute right-0 bottom-11 z-20 w-48 bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-xl py-1.5 animate-in fade-in zoom-in-95 duration-150 divide-y divide-outline-variant/20">
                    <div className="py-1">
                      {!isModal && (
                        <button
                          onClick={() => { setMenuOpen(false); setModalOpen(true); }}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-on-surface hover:bg-surface-container-low transition-colors w-full text-left cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px] text-primary">visibility</span>
                          View Details
                        </button>
                      )}
                      {currentUserId ? (
                        <Link
                          href={`?tab=listings&modal=propose-listing&listingId=${listing.id}&providerId=${listing.owner_id}&title=${encodeURIComponent(listing.title)}`}
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-primary hover:bg-surface-container-low transition-colors w-full cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px]">sync</span>
                          Propose Exchange
                        </Link>
                      ) : (
                        <Link
                          href="/login"
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-primary hover:bg-surface-container-low transition-colors w-full cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px]">login</span>
                          Log in to Propose
                        </Link>
                      )}
                    </div>
                    <div className="py-1">
                      <Link
                        href={`?modal=report&targetId=${listing.id}&targetType=Listing&title=${encodeURIComponent(listing.title)}`}
                        scroll={false}
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-error hover:bg-error/10 transition-colors w-full text-left cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px]">flag</span>
                        Report Listing
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </article>
    </>
  )
}
