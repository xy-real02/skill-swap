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
      <div className="max-w-container-max mx-auto w-full pt-4">
        
      <div className="flex justify-end mb-6">
        <Link 
          href="/listings/create"
          className="bg-primary text-on-primary font-label-md text-label-md py-2 px-4 md:py-3 md:px-6 rounded-lg font-bold hover:bg-on-primary-fixed-variant transition-colors flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          New Listing
        </Link>
      </div>

      {listings.length === 0 ? (
        <div className="bg-surface-container-lowest rounded-xl p-8 text-center border border-outline-variant/20">
          <p className="text-on-surface-variant font-body-md mb-4">You haven't posted any skills yet.</p>
          <Link href="/listings/create" className="text-primary font-bold hover:underline">Share a skill now</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
