import { getUserListings } from '@/features/listings/queries/getUserListings'
import { getUserRequests } from '@/features/requests/queries/getUserRequests'
import { ListingCard } from '@/features/listings/components/ListingCard'
import { RequestCard } from '@/features/requests/components/RequestCard'
import { MyListingTableView } from '@/features/listings/components/MyListingTableView'
import { MyRequestTableView } from '@/features/requests/components/MyRequestTableView'
import { ViewModeToggle } from '@/components/ui/ViewModeToggle'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function MyListingsPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string; tab?: string }>
}) {
  const resolvedSearchParams = await searchParams
  const view = resolvedSearchParams.view === 'table' ? 'table' : 'grid'
  const tab = resolvedSearchParams.tab === 'requests' ? 'requests' : 'listings'

  const supabase = await createClient()
  const { data: authData } = await supabase.auth.getUser()
  
  if (!authData.user) {
    redirect('/login')
  }

  const listings = await getUserListings(authData.user.id)
  const requests = await getUserRequests(authData.user.id)

  return (
    <>
      <div className="max-w-container-max mx-auto w-full pt-4 px-margin-mobile md:px-lg">
        
        {/* Navigation Tabs */}
        <div className="flex items-center gap-3 mb-8 border-b border-outline-variant/30 pb-4 flex-wrap">
          <Link
            href="?tab=listings"
            className={`px-5 py-2.5 rounded-full font-label-md font-bold transition-all flex items-center gap-2 ${tab === 'listings' ? 'bg-primary text-on-primary shadow-sm' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'}`}
          >
            <span className="material-symbols-outlined text-[18px]">inventory_2</span>
            My Listings
            <span className={`px-2 py-0.5 rounded-full text-xs ${tab === 'listings' ? 'bg-on-primary/20 text-on-primary' : 'bg-on-surface-variant/15 text-on-surface-variant'}`}>
              {listings.length}
            </span>
          </Link>
          <Link
            href="?tab=requests"
            className={`px-5 py-2.5 rounded-full font-label-md font-bold transition-all flex items-center gap-2 ${tab === 'requests' ? 'bg-primary text-on-primary shadow-sm' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'}`}
          >
            <span className="material-symbols-outlined text-[18px]">live_help</span>
            My Skill Requests
            <span className={`px-2 py-0.5 rounded-full text-xs ${tab === 'requests' ? 'bg-on-primary/20 text-on-primary' : 'bg-on-surface-variant/15 text-on-surface-variant'}`}>
              {requests.length}
            </span>
          </Link>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-2 text-on-surface-variant">
            <span className="material-symbols-outlined text-[20px]">{tab === 'listings' ? 'inventory_2' : 'live_help'}</span>
            <p className="font-body-md">
              You have <span className="font-bold text-on-surface">{tab === 'listings' ? listings.length : requests.length}</span> {tab === 'listings' ? 'listing' : 'request'}{tab === 'listings' ? (listings.length === 1 ? '' : 's') : (requests.length === 1 ? '' : 's')}
            </p>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <ViewModeToggle />
            {tab === 'listings' ? (
              <Link 
                href="?modal=create-listing"
                className="w-full sm:w-auto bg-primary text-on-primary font-label-md py-2.5 px-6 rounded-full font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow whitespace-nowrap"
              >
                <span className="material-symbols-outlined text-[20px]">add</span>
                New Listing
              </Link>
            ) : (
              <Link 
                href="/requests/create"
                className="w-full sm:w-auto bg-primary text-on-primary font-label-md py-2.5 px-6 rounded-full font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow whitespace-nowrap"
              >
                <span className="material-symbols-outlined text-[20px]">add</span>
                New Request
              </Link>
            )}
          </div>
        </div>

        {tab === 'listings' ? (
          listings.length === 0 ? (
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
                href="?modal=create-listing"
                className="bg-primary text-on-primary font-label-lg py-3 px-8 rounded-full font-bold hover:bg-primary/90 transition-all shadow-sm hover:shadow flex items-center gap-2 relative z-10"
              >
                <span className="material-symbols-outlined">add</span>
                Create a Listing
              </Link>
            </div>
          ) : view === 'table' ? (
            <MyListingTableView listings={listings} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
              {listings.map(listing => (
                <ListingCard key={listing.id} listing={listing} currentUserId={authData.user.id} />
              ))}
            </div>
          )
        ) : (
          requests.length === 0 ? (
            <div className="bg-surface-container-lowest rounded-[24px] p-12 text-center border border-outline-variant/20 flex flex-col items-center justify-center relative overflow-hidden shadow-sm">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
              <div className="w-20 h-20 bg-primary-container text-primary rounded-full flex items-center justify-center mb-6 shadow-sm relative z-10">
                <span className="material-symbols-outlined text-[40px]">live_help</span>
              </div>
              <h3 className="font-headline-md text-headline-md text-on-surface mb-2 relative z-10">Need help learning a new skill?</h3>
              <p className="text-on-surface-variant font-body-lg w-full max-w-[400px] mx-auto relative z-10 mb-8">
                Post a skill request and let talented neighbors reach out to teach or mentor you.
              </p>
              <Link 
                href="/requests/create"
                className="bg-primary text-on-primary font-label-lg py-3 px-8 rounded-full font-bold hover:bg-primary/90 transition-all shadow-sm hover:shadow flex items-center gap-2 relative z-10"
              >
                <span className="material-symbols-outlined">add</span>
                Post a Request
              </Link>
            </div>
          ) : view === 'table' ? (
            <MyRequestTableView requests={requests} currentUserId={authData.user.id} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
              {requests.map(request => (
                <RequestCard key={request.id} request={request} currentUserId={authData.user.id} />
              ))}
            </div>
          )
        )}
        <div className="h-24 md:h-12"></div>
      </div>
    </>
  )
}
