import { getListingById } from '@/features/listings/queries/getListingById'
import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { ProposeExchangeForm } from '@/features/exchanges/components/ProposeExchangeForm'

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
    <div className="pb-24">
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-on-surface-variant font-label-sm text-label-sm mb-lg">
        <Link href="/explore" className="hover:text-primary transition-colors">Explore</Link>
        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        <Link href={`/listings/${listing.id}`} className="hover:text-primary transition-colors truncate max-w-[200px]">{listing.title}</Link>
        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        <span className="text-on-surface font-bold">Propose Exchange</span>
      </nav>

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
  )
}
