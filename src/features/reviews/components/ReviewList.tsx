import { ReviewWithReviewer } from '@/features/reviews/queries/getPublishedReviews'

function formatDate(dateStr: string | null) {
  if (!dateStr) return 'Unknown date'
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function ReviewList({ reviews }: { reviews: ReviewWithReviewer[] }) {
  if (reviews.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-sm">
        <div className="bg-secondary-container/50 text-primary w-16 h-16 rounded-full flex items-center justify-center mb-4">
          <span className="material-symbols-outlined text-[32px]">reviews</span>
        </div>
        <h3 className="font-headline-sm text-on-surface mb-2 font-bold text-center">No reviews yet</h3>
        <p className="font-body-md text-on-surface-variant text-center max-w-md">
          This member hasn't received any published reviews from exchanges yet.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {reviews.map((review) => (
        <div key={review.id} className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/30 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src={review.reviewer?.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + (review.reviewer?.id || 'default')} 
                alt={review.reviewer?.full_name || 'Anonymous'}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <h4 className="font-label-md text-label-md text-on-surface">{review.reviewer?.full_name || 'Anonymous User'}</h4>
                <p className="font-label-sm text-label-sm text-on-surface-variant">{formatDate(review.created_at)}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-primary">
              <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              <span className="font-label-md text-label-md font-bold">{review.rating.toFixed(1)}</span>
            </div>
          </div>
          
          {review.comment ? (
            <p className="font-body-md text-on-surface bg-surface-container-low p-4 rounded-xl border border-outline-variant/10">
              "{review.comment}"
            </p>
          ) : (
            <p className="font-body-md text-on-surface-variant italic">
              No written comment provided.
            </p>
          )}
        </div>
      ))}
    </div>
  )
}
