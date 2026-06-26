'use client'

import React, { useEffect } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { CreateListingForm } from '@/features/listings/components/CreateListingForm'
import { CreateRequestForm } from '@/features/requests/components/CreateRequestForm'
import { EditProfileForm } from '@/features/profiles/components/EditProfileForm'
import { ReviewForm } from '@/features/reviews/components/ReviewForm'
import { ProposeExchangeForm } from '@/features/exchanges/components/ProposeExchangeForm'
import { ReportForm } from '@/features/moderation/components/ReportForm'
import type { Profile } from '@/features/profiles/queries/getProfile'

export function GlobalModalContainer({
  profile,
  zones = ['Northside Hub', 'South Market', 'East Village', 'West End']
}: {
  profile?: Profile | null
  zones?: string[]
}) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const modal = searchParams.get('modal')

  const closeModal = () => {
    if (window.history.length > 1) {
      router.back()
    } else {
      const newParams = new URLSearchParams(searchParams.toString())
      newParams.delete('modal')
      newParams.delete('id')
      newParams.delete('listingId')
      newParams.delete('requestId')
      newParams.delete('exchangeId')
      newParams.delete('providerId')
      newParams.delete('targetId')
      newParams.delete('targetType')
      newParams.delete('targetName')
      newParams.delete('title')
      newParams.delete('name')
      
      const queryString = newParams.toString()
      router.replace(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false })
    }
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && modal) {
        closeModal()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [modal, pathname, searchParams])

  if (!modal) return null

  const listingId = searchParams.get('listingId') || undefined
  const requestId = searchParams.get('requestId') || undefined
  const exchangeId = searchParams.get('exchangeId') || undefined
  const providerId = searchParams.get('providerId') || undefined
  const targetId = searchParams.get('targetId') || undefined
  const targetName = searchParams.get('targetName') || 'Neighbor'
  const titleText = searchParams.get('title') || undefined

  let modalTitle = 'SkillSwap'
  let content: React.ReactNode = null

  switch (modal) {
    case 'create-listing':
      modalTitle = 'Share a Skill'
      content = <CreateListingForm />
      break
    case 'create-request':
      modalTitle = 'Post a Request'
      content = <CreateRequestForm />
      break
    case 'edit-profile':
      modalTitle = 'Edit Profile'
      if (profile) {
        content = <EditProfileForm profile={profile} zones={zones} />
      } else {
        content = <div className="p-8 text-center text-on-surface-variant">Loading profile...</div>
      }
      break
    case 'review':
      modalTitle = `Review ${targetName}`
      if (exchangeId && targetId) {
        content = <ReviewForm exchangeId={exchangeId} targetId={targetId} targetName={targetName} />
      } else {
        content = <div className="p-8 text-center text-error">Missing review details.</div>
      }
      break
    case 'propose-listing':
      modalTitle = titleText ? `Propose Swap: ${titleText}` : 'Propose Exchange'
      if (providerId) {
        content = <ProposeExchangeForm listingId={listingId} providerId={providerId} />
      } else {
        content = <div className="p-8 text-center text-error">Missing provider details.</div>
      }
      break
    case 'propose-request':
      modalTitle = titleText ? `Offer Help: ${titleText}` : 'Offer Help'
      if (providerId) {
        content = <ProposeExchangeForm sourceRequestId={requestId} providerId={providerId} />
      } else {
        content = <div className="p-8 text-center text-error">Missing request details.</div>
      }
      break
    case 'report':
      modalTitle = `Report ${searchParams.get('targetType') || 'Content'}`
      if (targetId && searchParams.get('targetType')) {
        content = <ReportForm targetId={targetId} targetType={searchParams.get('targetType') as any} targetTitle={titleText} />
      } else {
        content = <div className="p-8 text-center text-error">Missing report target details.</div>
      }
      break
    default:
      return null
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-10 overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="fixed inset-0 bg-scrim/60 backdrop-blur-sm transition-opacity cursor-pointer"
        onClick={closeModal}
        aria-hidden="true"
      />

      <div 
        className="relative w-full max-w-2xl bg-surface-container-lowest border border-outline-variant/30 rounded-3xl shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant/20 bg-surface/80 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
              <span className="material-symbols-outlined text-[18px]">bolt</span>
            </div>
            <h3 className="font-headline-sm text-[18px] font-bold text-on-surface line-clamp-1">{modalTitle}</h3>
          </div>
          <button 
            onClick={closeModal}
            className="w-10 h-10 rounded-full hover:bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors focus:outline-none"
            aria-label="Close modal"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="p-6 md:p-8 overflow-y-auto flex-1 w-full space-y-4">
          {content}
        </div>
      </div>
    </div>
  )
}
