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
          <div className="bg-surface-container-lowest rounded-[24px] p-12 text-center border border-outline-variant/20 flex flex-col items-center justify-center relative overflow-hidden shadow-sm">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
            <div className="w-20 h-20 bg-primary-container text-primary rounded-full flex items-center justify-center mb-6 shadow-sm relative z-10">
              <span className="material-symbols-outlined text-[40px]">inventory_2</span>
            </div>
            <h3 className="font-headline-md text-headline-md text-on-surface mb-2 relative z-10">Ready to share your skills?</h3>
            <p className="text-on-surface-variant font-body-lg w-full max-w-[400px] mx-auto relative z-10 mb-8">
              Your community is waiting. Create your first listing and start exchanging your expertise today.
            </p>
            <Link 
              href="/listings/create"
              className="bg-primary text-on-primary font-label-lg py-3 px-8 rounded-full font-bold hover:bg-primary/90 transition-all shadow-sm hover:shadow flex items-center gap-2 relative z-10"
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
