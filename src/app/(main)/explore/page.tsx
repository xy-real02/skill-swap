import { getActiveListings } from '@/features/listings/queries/getActiveListings'
import { ListingCard, type ListingWithProfile } from '@/features/listings/components/ListingCard'

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>
}) {
  const resolvedSearchParams = await searchParams
  const category = resolvedSearchParams.category || 'All Categories'
  const listings = await getActiveListings({ 
    category: category === 'All Categories' ? undefined : category 
  })

  // Static list for now based on the HTML
  const categories = ['All Categories', 'Home Repair', 'Education', 'Gardening', 'Tech Support', 'Culinary']

  return (
    <>
      {/* Header & Search */}
      <header className="mb-lg sticky top-16 md:top-0 bg-surface/90 backdrop-blur-md z-30 pt-4 pb-4 -mx-margin-mobile px-margin-mobile md:-mx-lg md:px-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="font-headline-md text-headline-md text-primary mb-1">Explore Community Skills</h1>
            <p className="text-on-surface-variant font-body-md text-body-md">Discover what your neighbors are sharing today.</p>
          </div>
          <div className="relative w-full md:w-96 group">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">search</span>
            <input 
              className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:border-primary focus:ring-2 focus:ring-tertiary-fixed-dim/20 transition-all font-body-md text-body-md placeholder:text-outline-variant" 
              placeholder="Search skills, people, or topics..." 
              type="text" 
            />
          </div>
        </div>
        
        {/* Tabs */}
        <div className="flex gap-6 border-b border-surface-variant mb-6">
          <button className="pb-3 border-b-2 border-primary text-primary font-label-md text-label-md transition-colors">Skills Offered</button>
          <button className="pb-3 border-b-2 border-transparent text-on-surface-variant hover:text-primary transition-colors font-label-md text-label-md">Skill Requests</button>
        </div>
        
        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => {
            const isActive = category === cat
            return (
              <a 
                key={cat}
                href={`/explore?category=${cat}`}
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
      </header>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter pb-24">
        {listings && listings.length > 0 ? (
          listings.map((listing: ListingWithProfile) => (
            <ListingCard key={listing.id} listing={listing} />
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-on-surface-variant">
            <p className="font-body-lg">No listings found for this category yet.</p>
            <p className="mt-2">Be the first to share a skill!</p>
          </div>
        )}
      </div>
    </>
  )
}
