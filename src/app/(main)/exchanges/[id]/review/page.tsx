import { getExchangeById } from '@/features/exchanges/queries/getExchangeById'
import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { ReviewForm } from '@/features/reviews/components/ReviewForm'
import Link from 'next/link'
import { TopBar } from '@/components/layout/TopBar'

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
    <>
      <TopBar 
        title="Leave a Review"
        description="Your feedback helps build trust within the Skill Swap community."
        backHref={`/exchanges/${exchange.id}`}
      />
      <div className="pt-6 px-margin-mobile md:px-lg max-w-[600px] mx-auto w-full flex-1">

      <ReviewForm 
        exchangeId={exchange.id}
        targetId={targetUser.id}
        targetName={targetUser.full_name}
      />
      
      <div className="h-xl"></div>
      </div>
    </>
  )
}
