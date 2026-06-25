'use client'

import Link from 'next/link'
import { useState } from 'react'
import { createPortal } from 'react-dom'
import { ReportModal } from '@/features/moderation/components/ReportModal'
import { cancelRequest } from '@/features/requests/actions/cancelRequest'
import { TrustedMemberBadge } from '@/components/ui/TrustedMemberBadge'
import { RequestWithProfile } from '../queries/getActiveRequests'

export function RequestCard({ request, currentUserId, isModal = false }: { request: RequestWithProfile, currentUserId?: string, isModal?: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const isOwner = currentUserId === request.owner_id
  
  // Calculate expiration text
  const expiresAt = request.expires_at ? new Date(request.expires_at) : new Date()
  const daysLeft = Math.ceil((expiresAt.getTime() - new Date().getTime()) / (1000 * 3600 * 24))
  const isExpiringSoon = daysLeft <= 3

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
                  <span className="material-symbols-outlined text-[18px]">live_help</span>
                </div>
                <h3 className="font-headline-sm text-[18px] font-bold text-on-surface line-clamp-1">
                  My Request Details
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
              <RequestCard request={request} currentUserId={currentUserId} isModal={true} />
            </div>
          </div>
        </div>,
        document.body
      )}

      <article className="flex flex-col bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 hover:shadow-md transition-shadow group h-full">
        <div className="flex justify-between items-start mb-4 gap-2 flex-wrap">
          <span className="bg-primary-container text-on-primary-container font-label-sm text-label-sm px-3 py-1 rounded-full font-bold truncate max-w-full">
            {request.category}
          </span>
          <span suppressHydrationWarning className={`font-label-sm text-label-sm px-3 py-1 rounded-full font-bold flex items-center gap-1 shrink-0 max-w-full truncate ${request.status === 'Cancelled' ? 'bg-error/10 text-error' : isExpiringSoon ? 'bg-error-container text-on-error-container' : 'bg-surface-variant text-on-surface-variant'}`}>
            <span className="material-symbols-outlined text-[16px] shrink-0">{request.status === 'Cancelled' ? 'cancel' : 'schedule'}</span>
            <span className="truncate">{request.status === 'Cancelled' ? 'Cancelled' : daysLeft > 0 ? `Expires in ${daysLeft} days` : 'Expired'}</span>
          </span>
        </div>
        
        <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2 font-bold line-clamp-2">
          {request.title}
        </h3>
        
        <p className="font-body-md text-body-md text-on-surface-variant mb-6 line-clamp-3 flex-grow">
          {request.description}
        </p>
        
        <div className="bg-surface-container rounded-xl p-4 mb-6">
          <h4 className="font-label-sm text-label-sm text-on-surface font-bold mb-1">Offering in return:</h4>
          <p className="font-body-sm text-body-sm text-on-surface-variant">{request.offered_in_return}</p>
          
          {request.desired_timeframe && (
            <div className="mt-3 pt-3 border-t border-outline-variant/30">
              <h4 className="font-label-sm text-label-sm text-on-surface font-bold mb-1">Desired timeframe:</h4>
              <p className="font-body-sm text-body-sm text-on-surface-variant">{request.desired_timeframe}</p>
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-surface-variant">
          <Link href={`/profile/${request.owner_id}`} className="flex items-center gap-3 group/profile">
            <img 
              src={request.profiles.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + request.owner_id} 
              alt={request.profiles.full_name} 
              className="w-10 h-10 rounded-full object-cover border-2 border-transparent group-hover/profile:border-primary transition-colors"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <p className="font-label-md text-label-md text-on-surface font-bold truncate group-hover/profile:text-primary transition-colors">
                  {request.profiles.full_name}
                </p>
                <TrustedMemberBadge score={request.profiles.reputation_score} exchanges={request.profiles.exchange_count} />
              </div>
              <div className="flex items-center gap-1 text-on-surface-variant font-label-sm text-[11px]">
                <span className="material-symbols-outlined text-[14px]">star</span>
                {request.profiles.reputation_score?.toFixed(1) || 'New'}
                <span className="mx-1">•</span>
                {request.profiles.community_zone}
              </div>
            </div>
          </Link>
          
          {!isOwner && (
            <div className="relative shrink-0">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="w-9 h-9 rounded-full hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant transition-colors cursor-pointer border border-outline-variant/30 bg-surface shadow-sm"
                title="Request options"
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
                      {currentUserId && daysLeft > 0 && request.status !== 'Cancelled' ? (
                        <Link
                          href={`?tab=requests&modal=propose-request&requestId=${request.id}&providerId=${request.owner_id}&title=${encodeURIComponent(request.title)}`}
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-primary hover:bg-surface-container-low transition-colors w-full cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px]">handshake</span>
                          I Can Help
                        </Link>
                      ) : !currentUserId && daysLeft > 0 && request.status !== 'Cancelled' ? (
                        <Link
                          href="/login"
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-primary hover:bg-surface-container-low transition-colors w-full cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px]">login</span>
                          Log in to Help
                        </Link>
                      ) : null}
                    </div>
                    <div className="py-1">
                      <Link
                        href={`?modal=report&targetId=${request.id}&targetType=Request&title=${encodeURIComponent(request.title)}`}
                        scroll={false}
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-error hover:bg-error/10 transition-colors w-full text-left cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px]">flag</span>
                        Report Request
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
          
          {isOwner && (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="w-9 h-9 rounded-full hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant transition-colors cursor-pointer border border-outline-variant/30 bg-surface shadow-sm"
                title="Request options"
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
                    {!isModal && (
                      <div className="py-1">
                        <button
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-on-surface hover:bg-surface-container-low transition-colors w-full text-left cursor-pointer"
                          onClick={() => { setMenuOpen(false); setModalOpen(true); }}
                        >
                          <span className="material-symbols-outlined text-[16px] text-primary">visibility</span>
                          View Details
                        </button>
                      </div>
                    )}
                    {request.status !== 'Cancelled' && (
                      <div className="py-1">
                        <button
                          onClick={async () => {
                            setMenuOpen(false)
                            if (confirm('Are you sure you want to cancel this skill request?')) {
                              await cancelRequest(request.id)
                            }
                          }}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-error hover:bg-error/10 transition-colors w-full text-left cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px]">cancel</span>
                          Cancel Request
                        </button>
                      </div>
                    )}
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
