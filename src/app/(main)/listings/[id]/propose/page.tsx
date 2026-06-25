import { getListingById } from '@/features/listings/queries/getListingById'
import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { ProposeExchangeForm } from '@/features/exchanges/components/ProposeExchangeForm'
import { TopBar } from '@/components/layout/TopBar'

export default async function ProposePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = await params
  
  const supabase = await createClient()
  const { data: authData } = await supabase.auth.getUser()
  if (!authData.user) {
    redirect('/login')
  }

  const listing = await getListingById(resolvedParams.id)

  if (!listing || listing.owner_id === authData.user.id) {
    notFound()
  }

  return (
    <>
      <TopBar 
        title="Propose Exchange"
        backHref={`/listings/${listing.id}`}
      />
      <div className="pb-24 pt-6 px-margin-mobile md:px-0">
        <div className="max-w-3xl mx-auto space-y-6">
        {/* Context Header */}
        <div className="flex items-center gap-4 bg-secondary-container/30 border border-secondary-fixed-dim/50 rounded-xl p-6">
          <div className="bg-primary/10 text-primary p-3 rounded-full flex shrink-0">
            <span className="material-symbols-outlined text-3xl">sync</span>
          </div>
          <div>
            <p className="font-label-sm text-label-sm text-on-surface-variant mb-1">You are proposing an exchange for:</p>
            <h1 className="font-headline-sm text-headline-sm text-on-surface">{listing.title}</h1>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">person</span> {listing.profiles?.full_name}
            </p>
          </div>
        </div>

        <ProposeExchangeForm listingId={listing.id} providerId={listing.owner_id} />
      </div>
      </div>
    </>
  )
}
