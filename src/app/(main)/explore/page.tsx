import { getActiveListings } from '@/features/listings/queries/getActiveListings'
import { getActiveRequests, type RequestWithProfile } from '@/features/requests/queries/getActiveRequests'
import { ListingCard, type ListingWithProfile } from '@/features/listings/components/ListingCard'
import { RequestCard } from '@/features/requests/components/RequestCard'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string; tab?: string }>
}) {
  const resolvedSearchParams = await searchParams
  const category = resolvedSearchParams.category || 'All Categories'
  const activeTab = resolvedSearchParams.tab === 'requests' ? 'requests' : 'listings'
  
  let listings: ListingWithProfile[] = []
  let requests: RequestWithProfile[] = []
  
  if (activeTab === 'listings') {
    listings = await getActiveListings({ 
      category: category === 'All Categories' ? undefined : category 
    })
  } else {
    requests = await getActiveRequests({ 
      category: category === 'All Categories' ? undefined : category 
    })
  }

  // Static list for now
  const categories = ['All Categories', 'Home Repair', 'Education', 'Gardening', 'Tech Support', 'Culinary']

  const supabase = await createClient()
  const { data: authData } = await supabase.auth.getUser()
  const currentUserId = authData.user?.id

  return (
    <>
      <div className="sticky top-[148px] md:top-[104px] bg-surface/90 backdrop-blur-md z-20 pt-2 -mx-margin-mobile px-margin-mobile md:-mx-lg md:px-lg mb-6">
        
        {/* Search */}
        <div className="mb-6 relative w-full md:w-96 group">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">search</span>
          <input 
            className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:border-primary focus:ring-2 focus:ring-tertiary-fixed-dim/20 transition-all font-body-md text-body-md placeholder:text-outline-variant" 
            placeholder="Search skills, people, or topics..." 
            type="text" 
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-6 border-b border-surface-variant mb-6 relative">
          <Link 
            href={`/explore?tab=listings&category=${category}`}
            className={`pb-3 border-b-2 font-label-md text-label-md transition-colors ${
              activeTab === 'listings' ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-primary'
            }`}
          >
            Skills Offered
          </Link>
          <Link 
            href={`/explore?tab=requests&category=${category}`}
            className={`pb-3 border-b-2 font-label-md text-label-md transition-colors ${
              activeTab === 'requests' ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-primary'
            }`}
          >
            Skill Requests
          </Link>
          
          <div className="ml-auto flex items-center mb-2">
             <Link 
              href={activeTab === 'listings' ? '/listings/create' : '/requests/create'} 
              className="hidden md:flex items-center gap-2 bg-primary text-on-primary hover:bg-primary/90 px-4 py-2 rounded-full font-label-sm font-bold transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              {activeTab === 'listings' ? 'Share a Skill' : 'Post a Request'}
            </Link>
          </div>
        </div>
        
        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => {
            const isActive = category === cat
            return (
              <a 
                key={cat}
                href={`/explore?tab=${activeTab}&category=${cat}`}
                className={`whitespace-nowrap px-4 py-2 rounded-full font-label-sm text-label-sm transition-colors ${
                  isActive 
                    ? 'bg-primary text-on-primary' 
                    : 'bg-secondary-container text-primary hover:bg-secondary-container/80 border border-transparent'
                }`}
              >
                {cat}
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
            <div className="col-span-full py-12 text-center text-on-surface-variant">
              <p className="font-body-lg">No listings found for this category yet.</p>
              <p className="mt-2">Be the first to share a skill!</p>
            </div>
          )
        )}

        {activeTab === 'requests' && (
          requests && requests.length > 0 ? (
            requests.map(request => (
              <RequestCard key={request.id} request={request} currentUserId={currentUserId} />
            ))
          ) : (
            <div className="col-span-full py-12 text-center text-on-surface-variant">
              <p className="font-body-lg">No skill requests found for this category.</p>
              <p className="mt-2">Need help with something? Post a request!</p>
            </div>
          )
        )}
      </div>
    </>
  )
}
