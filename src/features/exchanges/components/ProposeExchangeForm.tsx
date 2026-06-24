'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { proposeExchange } from '@/features/exchanges/actions/proposeExchange'

export function ProposeExchangeForm({
  listingId,
  sourceRequestId,
  providerId,
}: {
  listingId?: string
  sourceRequestId?: string
  providerId: string
}) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    if (listingId) formData.append('listing_id', listingId)
    if (sourceRequestId) formData.append('source_request_id', sourceRequestId)
    formData.append('provider_id', providerId)

    const result = await proposeExchange(formData)

    if (result.error) {
      setError(result.error)
      setIsLoading(false)
    } else {
      setIsLoading(false)
      router.push(`/exchanges/${result.exchangeId}`)
    }
  }

  const handleCancel = () => {
    if (listingId) {
      router.push(`/listings/${listingId}`)
    } else {
      router.push('/explore?tab=requests')
    }
  }

  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-[0_4px_20px_-4px_rgba(45,106,79,0.08)] overflow-hidden border border-outline-variant/30 w-full max-w-2xl mx-auto mt-8">
      <div className="p-6 border-b border-outline-variant/30 bg-surface-container-low/50">
        <h2 className="font-headline-md text-headline-md text-on-surface">Propose an Exchange</h2>
        <p className="font-body-md text-body-md text-on-surface-variant mt-2">
          Offer your skills to the neighbor in return for this listing.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 md:p-8 flex flex-col gap-8">
        {error && (
          <div className="bg-error-container text-on-error-container p-4 rounded-lg text-body-md font-body-md border border-error/20 flex items-start gap-3">
            <span className="material-symbols-outlined shrink-0 text-error">error</span>
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-3">
          <label htmlFor="offered_skill" className="block font-label-md text-label-md text-on-surface font-bold">
            What skill are you offering in return? <span className="text-error">*</span>
          </label>
          <input
            type="text"
            id="offered_skill"
            name="offered_skill"
            required
            placeholder="e.g. 2 hours of Web Design"
            className="w-full bg-surface-container rounded-lg border-outline-variant/50 focus:border-primary focus:ring-1 focus:ring-primary p-4 text-body-md font-body-md"
          />
        </div>

        <div className="space-y-3">
          <label htmlFor="initial_message" className="block font-label-md text-label-md text-on-surface font-bold">
            Initial Message (Optional)
          </label>
          <textarea
            id="initial_message"
            name="initial_message"
            rows={4}
            placeholder="Say hi, introduce yourself, and explain why this would be a great trade!"
            className="w-full bg-surface-container rounded-lg border-outline-variant/50 focus:border-primary focus:ring-1 focus:ring-primary p-4 text-body-md font-body-md"
          ></textarea>
        </div>

        <div className="flex flex-col-reverse md:flex-row justify-end gap-3 pt-6 border-t border-outline-variant/30 mt-4">
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-3 rounded-lg font-label-md text-label-md text-on-surface-variant border border-outline-variant hover:bg-surface-container-high transition-colors text-center"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-primary hover:bg-primary/90 disabled:opacity-50 text-on-primary px-8 py-3 rounded-lg font-label-md text-label-md font-bold transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? (
              'Sending Proposal...'
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px]">send</span> Send Proposal
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
