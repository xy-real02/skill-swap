'use client'

import { useState } from 'react'
import { submitReview } from '@/features/reviews/actions/submitReview'
import { Button } from '@/components/ui/Button'
import { useRouter } from 'next/navigation'

export function ReviewForm({
  exchangeId,
  targetId,
  targetName
}: {
  exchangeId: string
  targetId: string
  targetName: string
}) {
  const router = useRouter()
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (rating === 0) {
      setError('Please select a star rating.')
      return
    }

    setIsPending(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    formData.append('rating', rating.toString())
    formData.append('exchange_id', exchangeId)
    formData.append('target_id', targetId)

    const result = await submitReview(formData)

    if (result.error) {
      setError(result.error)
      setIsPending(false)
    } else {
      router.push(`/exchanges/${exchangeId}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30 p-6 md:p-8 flex flex-col gap-6">
      {error && (
        <div className="p-4 bg-error/10 border-[1.5px] border-error/20 rounded-xl flex items-center gap-3 text-error font-body-md">
          <span className="material-symbols-outlined">error</span>
          <p>{error}</p>
        </div>
      )}

      {/* Star Rating */}
      <div className="flex flex-col items-center justify-center gap-2 py-4">
        <label className="font-headline-sm text-headline-sm text-on-surface font-bold text-center">
          How was your exchange with {targetName}?
        </label>
        <p className="font-body-md text-on-surface-variant text-center mb-4">
          Your review will be published once both of you submit one, or after 7 days.
        </p>

        <div className="flex items-center gap-2" onMouseLeave={() => setHoverRating(0)}>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className="transition-transform hover:scale-110 active:scale-95 focus:outline-none"
              onMouseEnter={() => setHoverRating(star)}
              onClick={() => setRating(star)}
            >
              <span 
                className={`material-symbols-outlined text-[48px] ${
                  (hoverRating || rating) >= star 
                    ? 'text-primary' 
                    : 'text-outline-variant'
                }`}
                style={{ fontVariationSettings: (hoverRating || rating) >= star ? "'FILL' 1" : "'FILL' 0" }}
              >
                star
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="w-full h-px bg-outline-variant/30"></div>

      {/* Comment */}
      <div className="flex flex-col gap-2">
        <label htmlFor="comment" className="font-label-md text-label-md font-bold text-on-surface flex justify-between">
          <span>Leave a comment (Optional)</span>
          <span className={`font-normal ${comment.length > 500 ? 'text-error' : 'text-on-surface-variant'}`}>
            {comment.length}/500
          </span>
        </label>
        <textarea
          id="comment"
          name="comment"
          rows={5}
          maxLength={500}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="bg-surface border-[1.5px] border-outline-variant rounded-xl px-4 py-3 font-body-md text-on-surface focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none resize-y"
          placeholder="e.g. Maria was a wonderful teacher and very patient! I highly recommend trading skills with her."
        />
      </div>

      {/* Actions */}
      <div className="pt-4 flex flex-col sm:flex-row gap-4 items-center sm:justify-end border-t border-outline-variant/30">
        <Button 
          type="button" 
          variant="ghost" 
          className="w-full sm:w-auto"
          onClick={() => router.back()}
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          variant="primary" 
          className="w-full sm:w-auto min-w-[140px]"
          disabled={isPending || rating === 0 || comment.length > 500}
          icon={isPending ? 'sync' : 'send'}
          iconClassName={isPending ? 'animate-spin' : ''}
        >
          {isPending ? 'Submitting...' : 'Submit Review'}
        </Button>
      </div>
    </form>
  )
}
