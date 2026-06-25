'use client'

import { useState } from 'react'
import { updateExchangeStatus } from '@/features/exchanges/actions/updateExchangeStatus'

export function ExchangeActions({
  exchangeId,
  status,
  isProvider,
  hasReviewed,
  targetId,
  targetName
}: {
  exchangeId: string
  status: string | null
  isProvider: boolean
  hasReviewed?: boolean
  targetId?: string
  targetName?: string
}) {
  const [isLoading, setIsLoading] = useState(false)

  const handleUpdateStatus = async (newStatus: string) => {
    setIsLoading(true)
    await updateExchangeStatus(exchangeId, newStatus)
    setIsLoading(false)
  }

  // Determine what actions are available
  let actions: React.ReactNode = null

  // Pending Status (Provider sees Accept/Decline, Requester sees Waiting)
  if (status === 'Proposed' || status === 'Pending') {
    if (isProvider) {
      actions = (
        <>
          <button 
            onClick={() => handleUpdateStatus('Accepted')}
            disabled={isLoading}
            className="w-full bg-primary text-on-primary font-label-md text-label-md py-3 rounded-lg font-bold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">check</span>
            Accept Proposal
          </button>
          <button 
            onClick={() => handleUpdateStatus('Cancelled')}
            disabled={isLoading}
            className="w-full bg-transparent text-error font-label-md text-label-md py-3 rounded-lg border-[1.5px] border-outline-variant hover:border-error hover:bg-error-container/20 transition-colors flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
            Decline
          </button>
        </>
      )
    } else {
      actions = (
        <button 
          onClick={() => handleUpdateStatus('Cancelled')}
          disabled={isLoading}
          className="w-full bg-transparent text-error font-label-md text-label-md py-3 rounded-lg border-[1.5px] border-outline-variant hover:border-error hover:bg-error-container/20 transition-colors flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">cancel</span>
          Cancel Request
        </button>
      )
    }
  } else if (status === 'Accepted') {
    actions = (
      <>
        <button 
          onClick={() => handleUpdateStatus('Completed')}
          disabled={isLoading}
          className="w-full bg-primary text-on-primary font-label-md text-label-md py-3 rounded-lg font-bold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 shadow-sm"
        >
          <span className="material-symbols-outlined text-[18px]">task_alt</span>
          Mark as Completed
        </button>
        <button 
          onClick={() => handleUpdateStatus('Cancelled')}
          disabled={isLoading}
          className="w-full bg-transparent text-error font-label-md text-label-md py-3 rounded-lg border-[1.5px] border-outline-variant hover:border-error hover:bg-error-container/20 transition-colors flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">cancel</span>
          Cancel Exchange
        </button>
      </>
    )
  } else if (status === 'Completed' && !hasReviewed) {
    actions = (
      <a 
        href={`?modal=review&exchangeId=${exchangeId}&targetId=${targetId || ''}&targetName=${encodeURIComponent(targetName || 'Neighbor')}`}
        className="w-full bg-tertiary text-on-tertiary font-label-md text-label-md py-3 rounded-lg font-bold hover:bg-tertiary-container hover:text-on-tertiary-container transition-colors flex items-center justify-center gap-2"
      >
        <span className="material-symbols-outlined text-[18px]">rate_review</span>
        Leave a Review
      </a>
    )
  }

  if (!actions) return null

  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-[0_4px_20px_-4px_rgba(45,106,79,0.08)] p-6 flex flex-col gap-3 border border-outline-variant/20">
      <h3 className="font-label-md text-label-md text-on-surface mb-2">Actions</h3>
      {actions}
    </div>
  )
}
