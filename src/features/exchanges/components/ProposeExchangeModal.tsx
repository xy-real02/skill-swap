'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { proposeExchange } from '@/features/exchanges/actions/proposeExchange'

export function ProposeExchangeModal({
  listingId,
  providerId,
}: {
  listingId: string
  providerId: string
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    formData.append('listing_id', listingId)
    formData.append('provider_id', providerId)

    const result = await proposeExchange(formData)

    if (result.error) {
      setError(result.error)
      setIsLoading(false)
    } else {
      setIsOpen(false)
      setIsLoading(false)
      // Redirect to the newly created exchange
      router.push(`/exchanges/${result.exchangeId}`)
    }
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="w-full bg-[#2D6A4F] text-on-primary font-label-md text-label-md font-bold py-3 px-4 rounded-lg hover:bg-primary transition-colors flex items-center justify-center gap-2 shadow-sm"
      >
        <span className="material-symbols-outlined">handshake</span> Propose Exchange
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-inverse-surface/50 p-4">
          <div className="bg-surface rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
            <div className="p-6 border-b border-outline-variant/30 flex justify-between items-center">
              <h2 className="font-headline-sm text-headline-sm text-on-surface">Propose an Exchange</h2>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-6">
              {error && (
                <div className="bg-error-container text-on-error-container p-3 rounded-lg text-body-md font-body-md">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="offered_skill" className="block font-label-md text-label-md text-on-surface">
                  What skill are you offering in return? <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  id="offered_skill"
                  name="offered_skill"
                  required
                  placeholder="e.g. 2 hours of Web Design"
                  className="w-full bg-surface-container rounded-lg border-outline-variant/50 focus:border-primary focus:ring-1 focus:ring-primary p-3"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="initial_message" className="block font-label-md text-label-md text-on-surface">
                  Initial Message (Optional)
                </label>
                <textarea
                  id="initial_message"
                  name="initial_message"
                  rows={3}
                  placeholder="Say hi and introduce yourself!"
                  className="w-full bg-surface-container rounded-lg border-outline-variant/50 focus:border-primary focus:ring-1 focus:ring-primary p-3"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-6 py-2 rounded-lg font-label-md text-label-md text-on-surface-variant hover:bg-surface-container-high transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-primary hover:bg-primary/90 disabled:opacity-50 text-on-primary px-6 py-2 rounded-lg font-label-md text-label-md font-bold transition-colors"
                >
                  {isLoading ? 'Sending...' : 'Send Proposal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
