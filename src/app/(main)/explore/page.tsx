import { getActiveListings } from '@/features/listings/queries/getActiveListings'
import { getActiveRequests, type RequestWithProfile } from '@/features/requests/queries/getActiveRequests'
import { ListingCard, type ListingWithProfile } from '@/features/listings/components/ListingCard'
import { RequestCard } from '@/features/requests/components/RequestCard'
import { createClient } from '@/lib/supabase/server'
import { SearchBar } from '@/components/ui/SearchBar'
import Link from 'next/link'
import { Suspense } from 'react'

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string; tab?: string }>
}) {
  const resolvedSearchParams = await searchParams
  const category = resolvedSearchParams.category || 'All Categories'
  const activeTab = resolvedSearchParams.tab === 'requests' ? 'requests' : 'listings'
  const q = resolvedSearchParams.q
  
  let listings: ListingWithProfile[] = []
  let requests: RequestWithProfile[] = []
  
  if (activeTab === 'listings') {
    listings = await getActiveListings({ 
      category: category === 'All Categories' ? undefined : category,
      q
    })
  } else {
    requests = await getActiveRequests({ 
      category: category === 'All Categories' ? undefined : category,
      q
    })
  }

  const categories = [
    { name: 'All Categories', icon: 'grid_view' },
    { name: 'Home Repair', icon: 'handyman' },
    { name: 'Education', icon: 'school' },
    { name: 'Gardening', icon: 'yard' },
    { name: 'Tech Support', icon: 'computer' },
    { name: 'Culinary', icon: 'restaurant' }
  ]

  const supabase = await createClient()
  const { data: authData } = await supabase.auth.getUser()
  const currentUserId = authData.user?.id

  return (
    <>
      {/* Search Bar (Not sticky, scrolls away) */}
      <div className="pt-2 pb-6 w-full">
        <Suspense fallback={<div className="h-14 bg-surface-container-lowest animate-pulse rounded-2xl w-full"></div>}>
          <SearchBar />
        </Suspense>
      </div>

      {/* Sticky Section: Tabs & Categories */}
      <div className="sticky top-[72px] md:top-[80px] bg-surface/95 backdrop-blur-xl z-20 pt-2 -mx-margin-mobile px-margin-mobile md:-mx-lg md:px-lg mb-6 border-b border-surface-variant/50">
        
        {/* Action Row: Segmented Control & Button */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
          
          {/* Segmented Control */}
          <div className="bg-surface-container rounded-full p-1 flex w-full md:w-auto relative isolate shadow-inner">
            <Link 
              href={`/explore?tab=listings&category=${category}`}
              className={`flex-1 md:w-48 py-2 px-4 rounded-full text-center font-label-md transition-all duration-300 z-10 ${
                activeTab === 'listings' ? 'text-on-primary' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Skills Offered
            </Link>
            <Link 
              href={`/explore?tab=requests&category=${category}`}
              className={`flex-1 md:w-48 py-2 px-4 rounded-full text-center font-label-md transition-all duration-300 z-10 ${
                activeTab === 'requests' ? 'text-on-primary' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Skill Requests
            </Link>

            {/* Sliding Background */}
            <div 
              className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-primary rounded-full -z-10 transition-transform duration-300 ease-out shadow-sm ${
                activeTab === 'requests' ? 'translate-x-[calc(100%+4px)]' : 'translate-x-0'
              }`}
            ></div>
          </div>

          {/* Action Button */}
          <Link 
            href={activeTab === 'listings' ? '/listings/create' : '/requests/create'} 
            className="flex w-full md:w-auto justify-center items-center gap-2 bg-primary text-on-primary hover:bg-primary/90 px-6 py-2.5 rounded-full font-label-md font-bold transition-all shadow-sm hover:shadow"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            {activeTab === 'listings' ? 'Share a Skill' : 'Post a Request'}
          </Link>

        </div>
        
        {/* Categories Row */}
        <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide -mx-margin-mobile px-margin-mobile md:mx-0 md:px-0">
          {categories.map((cat) => {
            const isActive = category === cat.name
            return (
              <a 
                key={cat.name}
                href={`/explore?tab=${activeTab}&category=${cat.name}`}
                className={`flex items-center gap-2 whitespace-nowrap px-4 py-2 rounded-full font-label-sm transition-all duration-200 border ${
                  isActive 
                    ? 'bg-secondary-container text-on-secondary-container border-transparent shadow-sm' 
                    : 'bg-surface text-on-surface-variant border-outline-variant/30 hover:bg-surface-container hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">{cat.icon}</span>
                {cat.name}
              </a>
            )
          })}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter pb-24">
        {activeTab === 'listings' && (
          listings && listings.length > 0 ? (
            listings.map((listing: ListingWithProfile) => (
              <ListingCard key={listing.id} listing={listing} currentUserId={currentUserId} />
            ))
          ) : (
            <div className="col-span-full bg-surface-container-lowest rounded-[24px] p-12 text-center border border-outline-variant/20 flex flex-col items-center justify-center relative overflow-hidden shadow-sm">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
              <div className="w-20 h-20 bg-primary-container text-primary rounded-full flex items-center justify-center mb-6 shadow-sm relative z-10">
                <span className="material-symbols-outlined text-[40px]">explore_off</span>
              </div>
              <h3 className="font-headline-md text-headline-md text-on-surface mb-2 relative z-10">No listings found</h3>
              <p className="text-on-surface-variant font-body-lg w-full max-w-[400px] mx-auto relative z-10">
                We couldn't find any listings for this category. Be the first to share a skill!
              </p>
            </div>
          )
        )}

        {activeTab === 'requests' && (
          requests && requests.length > 0 ? (
            requests.map(request => (
              <RequestCard key={request.id} request={request} currentUserId={currentUserId} />
            ))
          ) : (
            <div className="col-span-full bg-surface-container-lowest rounded-[24px] p-12 text-center border border-outline-variant/20 flex flex-col items-center justify-center relative overflow-hidden shadow-sm">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
              <div className="w-20 h-20 bg-primary-container text-primary rounded-full flex items-center justify-center mb-6 shadow-sm relative z-10">
                <span className="material-symbols-outlined text-[40px]">post_add</span>
              </div>
              <h3 className="font-headline-md text-headline-md text-on-surface mb-2 relative z-10">No requests found</h3>
              <p className="text-on-surface-variant font-body-lg w-full max-w-[400px] mx-auto relative z-10">
                There are no skill requests for this category yet. Need help with something? Post a request!
              </p>
            </div>
          )
        )}
      </div>
    </>
  )
}
