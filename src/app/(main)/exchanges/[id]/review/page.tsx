import { getExchangeById } from '@/features/exchanges/queries/getExchangeById'
import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { ReviewForm } from '@/features/reviews/components/ReviewForm'
import Link from 'next/link'

export const metadata = {
  title: 'Leave a Review | Skill Swap',
}

export default async function LeaveReviewPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = await params
  
  const supabase = await createClient()
  const { data: authData } = await supabase.auth.getUser()
  if (!authData.user) redirect('/login')

  const exchange = await getExchangeById(resolvedParams.id)
  if (!exchange) notFound()

  // Ensure current user is part of the exchange
  const currentUserId = authData.user.id
  const isProvider = exchange.provider_id === currentUserId
  const isRequester = exchange.requester_id === currentUserId

  if (!isProvider && !isRequester) {
    redirect('/exchanges')
  }

  // Ensure the exchange is completed
  if (exchange.status !== 'Completed') {
    redirect(`/exchanges/${exchange.id}`)
  }

  // Check if they already reviewed
  const { data: existingReview } = await supabase
    .from('reviews')
    .select('id')
    .eq('exchange_id', exchange.id)
    .eq('reviewer_id', currentUserId)
    .single()

  if (existingReview) {
    redirect(`/exchanges/${exchange.id}`)
  }

  const targetUser = isProvider ? exchange.requester : exchange.provider
  if (!targetUser) notFound()

  return (
    <div className="pt-6 px-margin-mobile md:px-lg max-w-[600px] mx-auto w-full flex-1">
      <div className="mb-8">
        <Link 
          href={`/exchanges/${exchange.id}`} 
          className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors font-label-md mb-4"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Back to Exchange
        </Link>
        <h1 className="font-display-lg-mobile md:font-display-lg text-primary mb-2">
          Leave a Review
        </h1>
        <p className="font-body-lg text-on-surface-variant">
          Your feedback helps build trust within the Skill Swap community.
        </p>
      </div>

      <ReviewForm 
        exchangeId={exchange.id}
        targetId={targetUser.id}
        targetName={targetUser.full_name}
      />
      
      <div className="h-xl"></div>
    </div>
  )
}
