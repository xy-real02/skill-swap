import { getRequestById } from '@/features/requests/queries/getRequestById'
import { ProposeExchangeForm } from '@/features/exchanges/components/ProposeExchangeForm'
import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { TopBar } from '@/components/layout/TopBar'

export default async function ProposeToRequestPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const supabase = await createClient()
  
  const { data: authData } = await supabase.auth.getUser()
  if (!authData.user) {
    redirect(`/login?redirectTo=/requests/${resolvedParams.id}/propose`)
  }

  const request = await getRequestById(resolvedParams.id)
  
  if (!request) {
    notFound()
  }

  if (request.owner_id === authData.user.id) {
    // Cannot propose to own request
    redirect('/explore')
  }

  return (
    <>
      <TopBar 
        title="I Can Help!"
        description={<span>Propose an exchange to help <strong>{request.profiles.full_name}</strong>.</span>}
        backHref="/explore?tab=requests"
      />
      <div className="max-w-2xl mx-auto py-8 px-margin-mobile md:px-0">

      {/* Request Summary Card */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 mb-8">
        <h2 className="font-label-lg text-on-surface font-bold mb-1">They need: {request.title}</h2>
        <p className="font-body-md text-on-surface-variant mb-4">{request.description}</p>
        
        <div className="bg-secondary-container/30 rounded-xl p-4">
          <h4 className="font-label-sm text-on-surface font-bold">They're offering in return:</h4>
          <p className="font-body-sm text-on-surface-variant">{request.offered_in_return}</p>
        </div>
      </div>

      {/* We reuse the ProposeExchangeForm, but pass source_request_id instead of listing_id */}
      <div className="bg-surface border border-surface-variant rounded-3xl p-6 sm:p-8 shadow-sm">
        <h2 className="font-headline-sm text-headline-sm text-on-surface mb-6">Your Proposal</h2>
        <ProposeExchangeForm 
          providerId={request.owner_id} 
          sourceRequestId={request.id}
        />
      </div>
      </div>
    </>
  )
}
