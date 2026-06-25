import { getExchangeById } from '@/features/exchanges/queries/getExchangeById'
import { getExchangeMessages } from '@/features/exchanges/queries/getExchangeMessages'
import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ChatWindow } from '@/features/exchanges/components/ChatWindow'
import { ExchangeActions } from '@/features/exchanges/components/ExchangeActions'

export default async function ExchangeDetailPage({
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

  const otherUser = isProvider ? exchange.requester : exchange.provider
  const messages = await getExchangeMessages(exchange.id)

  // Status mapping for stepper
  const steps = [
    { id: 'Proposed', label: 'Proposed', icon: 'check', past: true, current: exchange.status === 'Proposed' },
    { id: 'Accepted', label: 'Accepted', icon: 'handshake', past: exchange.status === 'Completed' || exchange.status === 'Accepted', current: exchange.status === 'Accepted' },
    { id: 'Completed', label: 'Completed', icon: 'task_alt', past: exchange.status === 'Completed', current: exchange.status === 'Completed' }
  ]

  if (exchange.status === 'Cancelled') {
    steps.push({ id: 'Cancelled', label: 'Cancelled', icon: 'cancel', past: true, current: true })
  }

  // Check if they already reviewed
  const { data: existingReview } = await supabase
    .from('reviews')
    .select('id')
    .eq('exchange_id', exchange.id)
    .eq('reviewer_id', currentUserId)
    .single()

  const hasReviewed = !!existingReview

  return (
    <>
      <div className="pt-6 px-margin-mobile md:px-lg max-w-container-max mx-auto w-full">

      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter pb-24">
        {/* Left Column: Tracker & Actions */}
        <div className="md:col-span-4 flex flex-col gap-6">
          {/* Status Tracker Card */}
          <div className="bg-surface-container-lowest rounded-xl shadow-[0_4px_20px_-4px_rgba(45,106,79,0.08)] p-6 relative z-10 overflow-hidden border border-outline-variant/20">
            <h2 className="font-headline-sm text-headline-sm text-on-surface mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">timeline</span>
              Exchange Status
            </h2>
            <div className="flex flex-col gap-0 relative">
              {steps.map((step, index) => {
                const isLast = index === steps.length - 1
                const isActive = step.current || step.past
                
                return (
                  <div key={step.id} className={`flex gap-4 relative ${isLast ? '' : 'pb-8'}`}>
                    {!isLast && (
                      <div className={`absolute left-[15px] top-[32px] bottom-[-8px] w-[2px] z-0 ${isActive && !step.current ? 'bg-primary' : 'bg-surface-variant'}`}></div>
                    )}
                    
                    <div className={`rounded-full w-8 h-8 flex items-center justify-center z-10 shrink-0 shadow-sm relative ${
                      step.current ? 'bg-primary-fixed text-primary border-2 border-primary' : 
                      step.past ? 'bg-primary text-on-primary' : 
                      'bg-surface-container-high text-outline border-[1.5px] border-outline-variant'
                    }`}>
                      <span className="material-symbols-outlined text-[18px]">{step.icon}</span>
                      {step.current && <div className="absolute inset-0 rounded-full animate-ping bg-primary opacity-20"></div>}
                    </div>
                    
                    <div className="pt-1">
                      <h3 className={`font-label-md text-label-md ${step.current ? 'text-primary font-bold' : isActive ? 'text-on-surface' : 'text-outline'}`}>
                        {step.label}
                      </h3>
                      <p className={`font-label-sm text-label-sm font-normal mt-1 ${step.current ? 'text-primary/80' : isActive ? 'text-on-surface-variant' : 'text-outline-variant'}`}>
                        {step.current ? 'Current State' : isActive ? 'Done' : 'Pending'}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <ExchangeActions exchangeId={exchange.id} status={exchange.status} isProvider={isProvider} hasReviewed={hasReviewed} />
        </div>

        {/* Right Column: Messaging Thread */}
        <ChatWindow 
          exchangeId={exchange.id} 
          messages={messages} 
          currentUserId={currentUserId} 
          otherUser={otherUser} 
          exchangeStatus={exchange.status}
        />
      </div>
      </div>
    </>
  )
}
