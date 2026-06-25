import { getUserListings } from '@/features/listings/queries/getUserListings'
import { ListingCard } from '@/features/listings/components/ListingCard'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function MyListingsPage() {
  const supabase = await createClient()
  const { data: authData } = await supabase.auth.getUser()
  
  if (!authData.user) {
    redirect('/login')
  }

  const listings = await getUserListings(authData.user.id)

  return (
    <>
      <div className="max-w-container-max mx-auto w-full pt-4 px-margin-mobile md:px-lg">
        
        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-4 border-b border-surface-variant/50">
          <div className="flex items-center gap-2 text-on-surface-variant">
            <span className="material-symbols-outlined text-[20px]">inventory_2</span>
            <p className="font-body-md">
              You have <span className="font-bold text-on-surface">{listings.length}</span> active listing{listings.length === 1 ? '' : 's'}
            </p>
          </div>
          
          <Link 
            href="/listings/create"
            className="w-full sm:w-auto bg-primary text-on-primary font-label-md py-2.5 px-6 rounded-full font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            New Listing
          </Link>
        </div>

        {listings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 bg-surface-container-lowest rounded-3xl border border-outline-variant/30 shadow-sm">
            <div className="bg-primary/10 text-primary w-24 h-24 rounded-full flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-[48px]">stars</span>
            </div>
            <h2 className="font-headline-md text-on-surface mb-3 text-center">Ready to share your skills?</h2>
            <p className="font-body-lg text-on-surface-variant text-center max-w-md mb-8">
              Your community is waiting. Create your first listing and start exchanging your expertise today.
            </p>
            <Link 
              href="/listings/create"
              className="bg-primary text-on-primary font-label-lg py-3 px-8 rounded-full font-bold hover:bg-primary/90 transition-all shadow-sm hover:shadow flex items-center gap-2"
            >
              <span className="material-symbols-outlined">add</span>
              Create a Listing
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
            {listings.map(listing => (
              <ListingCard key={listing.id} listing={listing} currentUserId={authData.user.id} />
            ))}
          </div>
        )}
        <div className="h-24 md:h-12"></div>
      </div>
    </>
  )
}
