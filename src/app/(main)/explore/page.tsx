import { getActiveListings } from '@/features/listings/queries/getActiveListings'
import { getActiveRequests, type RequestWithProfile } from '@/features/requests/queries/getActiveRequests'
import { PLATFORM_CATEGORIES } from '@/lib/categories'
import { ListingCard, type ListingWithProfile } from '@/features/listings/components/ListingCard'
import { RequestCard } from '@/features/requests/components/RequestCard'
import { ListingTableView } from '@/features/listings/components/ListingTableView'
import { RequestTableView } from '@/features/requests/components/RequestTableView'
import { ExploreFilterSidebar } from '@/features/listings/components/ExploreFilterSidebar'
import { ViewModeToggle } from '@/components/ui/ViewModeToggle'
import { createClient } from '@/lib/supabase/server'
import { SearchBar } from '@/components/ui/SearchBar'
import Link from 'next/link'
import { Suspense } from 'react'

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string; tab?: string; view?: string; zone?: string; minRep?: string }>
}) {
  const resolvedSearchParams = await searchParams
  const category = resolvedSearchParams.category || 'All Categories'
  const activeTab = resolvedSearchParams.tab === 'requests' ? 'requests' : 'listings'
  const view = resolvedSearchParams.view === 'table' ? 'table' : 'grid'
  const zone = resolvedSearchParams.zone
  const minRep = resolvedSearchParams.minRep ? parseFloat(resolvedSearchParams.minRep) : undefined
  const q = resolvedSearchParams.q

  const supabase = await createClient()
  const { data: authData } = await supabase.auth.getUser()
  const currentUserId = authData.user?.id

  let userZone = ''
  if (currentUserId) {
    const { data: profile } = await supabase.from('profiles').select('community_zone').eq('id', currentUserId).maybeSingle()
    if (profile?.community_zone) userZone = profile.community_zone
  }

  const { data: settings } = await supabase.from('community_settings').select('community_zone_list').maybeSingle()
  const availableZones = settings?.community_zone_list?.length
    ? settings.community_zone_list
    : ['Northside Hub', 'South Market', 'East Village', 'West End']

  let listings: ListingWithProfile[] = []
  let requests: RequestWithProfile[] = []

  if (activeTab === 'listings') {
    listings = await getActiveListings({
      category: category === 'All Categories' ? undefined : category,
      q,
      excludeOwnerId: currentUserId,
      zone,
      minRep,
    })
  } else {
    requests = await getActiveRequests({
      category: category === 'All Categories' ? undefined : category,
      q,
      excludeOwnerId: currentUserId,
      zone,
      minRep,
    })
  }

  const categories: { name: string; icon: string }[] = [
    { name: 'All Categories', icon: 'grid_view' },
    ...PLATFORM_CATEGORIES
  ]

  const categoryParam = category !== 'All Categories' ? `&category=${encodeURIComponent(category)}` : ''
  const viewParam = view === 'table' ? '&view=table' : ''

  return (
    <>
      {/* Search Bar (Not sticky, scrolls away) */}
      <div className="pt-2 pb-6 w-full">
        <Suspense fallback={<div className="h-14 bg-surface-container-lowest animate-pulse rounded-2xl w-full"></div>}>
          <SearchBar />
        </Suspense>
      </div>

      {/* Sticky Section: Tabs & Categories */}
      <div className="sticky top-16 z-20 bg-background/95 backdrop-blur py-3 border-b border-outline-variant/20 -mx-margin-mobile px-margin-mobile md:mx-0 md:px-0 mb-6 flex flex-col gap-4">
        {/* Top Row: Tabs & View Toggle */}
        <div className="flex justify-between items-center gap-4">
          <div className="flex gap-2 bg-surface-container-low p-1 rounded-full border border-outline-variant/30">
            <a 
              href={`/explore?tab=listings${categoryParam}${viewParam}`}
              className={`px-6 py-2 rounded-full font-label-md transition-all duration-200 ${
                activeTab === 'listings' 
                  ? 'bg-primary text-on-primary font-bold shadow-sm' 
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Skill Offers
            </a>
            <a 
              href={`/explore?tab=requests${categoryParam}${viewParam}`}
              className={`px-6 py-2 rounded-full font-label-md transition-all duration-200 ${
                activeTab === 'requests' 
                  ? 'bg-primary text-on-primary font-bold shadow-sm' 
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Skill Requests
            </a>
          </div>

          <div className="flex items-center gap-3">
            <ViewModeToggle />
            <Link 
              href={activeTab === 'listings' ? "/listings/create" : "/requests/create"}
              className="bg-primary text-on-primary font-label-md text-label-md px-4 py-2.5 rounded-full font-bold hover:bg-surface-tint transition-all shadow-sm flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              <span className="hidden sm:inline">Post {activeTab === 'listings' ? 'Offer' : 'Request'}</span>
            </Link>
          </div>
        </div>

        {/* Categories Row */}
        <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide -mx-margin-mobile px-margin-mobile md:mx-0 md:px-0">
          {categories.map((cat) => {
            const isActive = category === cat.name
            return (
              <a 
                key={cat.name}
                href={`/explore?tab=${activeTab}&category=${encodeURIComponent(cat.name)}${viewParam}`}
                className={`flex items-center gap-2 whitespace-nowrap px-4 py-2 rounded-full font-label-sm transition-all duration-200 border ${
                  isActive 
                    ? 'bg-primary text-on-primary border-primary shadow-sm font-bold' 
                    : 'bg-surface-container-low text-on-surface hover:bg-surface-container border-outline-variant/30'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">{cat.icon}</span>
                {cat.name}
              </a>
            )
          })}
        </div>
      </div>

      {/* Content Area with Filter Sidebar */}
      <div className="flex flex-col md:flex-row gap-6 items-start w-full">
        <ExploreFilterSidebar userZone={userZone} availableZones={availableZones} />
        <div className={`flex-1 w-full min-w-0 ${view === 'table' ? 'grid grid-cols-1 gap-4' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter'}`}>
          {activeTab === 'listings' && (
            listings && listings.length > 0 ? (
              view === 'table' ? (
                <ListingTableView listings={listings} currentUserId={currentUserId} />
              ) : (
                listings.map(listing => (
                  <ListingCard key={listing.id} listing={listing} currentUserId={currentUserId} />
                ))
              )
            ) : (
              <div className="col-span-full bg-surface-container-lowest rounded-[24px] p-12 text-center border border-outline-variant/20 flex flex-col items-center justify-center relative overflow-hidden shadow-sm">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
                <div className="w-20 h-20 bg-primary-container text-primary rounded-full flex items-center justify-center mb-6 shadow-sm relative z-10">
                  <span className="material-symbols-outlined text-[40px]">explore_off</span>
                </div>
                <h3 className="font-headline-md text-headline-md text-on-surface mb-2 relative z-10">No listings found</h3>
                <p className="text-on-surface-variant font-body-lg w-full max-w-[400px] mx-auto relative z-10 mb-6">
                  We couldn't find any listings matching your discovery filters. Try resetting them!
                </p>
                <Link 
                  href="?tab=listings&modal=create-listing"
                  className="relative z-10 inline-flex items-center gap-2 bg-primary text-on-primary hover:bg-primary/90 px-6 py-2.5 rounded-full font-label-md font-bold transition-all shadow-sm hover:shadow"
                >
                  <span className="material-symbols-outlined text-[18px]">add</span> Share a Skill
                </Link>
              </div>
            )
          )}

          {activeTab === 'requests' && (
            requests && requests.length > 0 ? (
              view === 'table' ? (
                <RequestTableView requests={requests} currentUserId={currentUserId} />
              ) : (
                requests.map(request => (
                  <RequestCard key={request.id} request={request} currentUserId={currentUserId} />
                ))
              )
            ) : (
              <div className="col-span-full bg-surface-container-lowest rounded-[24px] p-12 text-center border border-outline-variant/20 flex flex-col items-center justify-center relative overflow-hidden shadow-sm">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
                <div className="w-20 h-20 bg-primary-container text-primary rounded-full flex items-center justify-center mb-6 shadow-sm relative z-10">
                  <span className="material-symbols-outlined text-[40px]">post_add</span>
                </div>
                <h3 className="font-headline-md text-headline-md text-on-surface mb-2 relative z-10">No requests found</h3>
                <p className="text-on-surface-variant font-body-lg w-full max-w-[400px] mx-auto relative z-10 mb-6">
                  We couldn't find any requests matching your discovery filters. Try resetting them!
                </p>
                <Link 
                  href="?tab=requests&modal=create-request"
                  className="relative z-10 inline-flex items-center gap-2 bg-primary text-on-primary hover:bg-primary/90 px-6 py-2.5 rounded-full font-label-md font-bold transition-all shadow-sm hover:shadow"
                >
                  <span className="material-symbols-outlined text-[18px]">add</span> Post a Request
                </Link>
              </div>
            )
          )}
        </div>
      </div>
    </>
  )
}
