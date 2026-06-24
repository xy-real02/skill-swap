import { getListingById } from '@/features/listings/queries/getListingById'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export default async function ListingDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = await params
  const listing = await getListingById(resolvedParams.id)

  if (!listing) {
    notFound()
  }

  const profile = listing.profiles
  const avatar = profile?.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + (profile?.id || 'default')

  return (
    <div className="pb-24">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-on-surface-variant font-label-sm text-label-sm mb-lg">
        <Link href="/explore" className="hover:text-primary transition-colors">Explore</Link>
        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        <Link href={`/explore?category=${listing.category}`} className="hover:text-primary transition-colors">{listing.category}</Link>
        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        <span className="text-on-surface font-bold truncate max-w-[200px]">{listing.title}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
        {/* Left Column: Details */}
        <div className="md:col-span-8 space-y-md">
          
          {/* Header Section */}
          <div className="space-y-sm">
            <div className="flex flex-wrap items-center gap-sm">
              <span className="bg-secondary-container text-on-secondary-container font-label-sm text-label-sm px-3 py-1 rounded-full border border-secondary-fixed-dim/50">
                {listing.category}
              </span>
              <span className="flex items-center gap-1 bg-surface-container-high text-primary font-label-sm text-label-sm px-3 py-1 rounded-full border border-outline-variant/30">
                <span className="w-2 h-2 rounded-full bg-[#2D6A4F]"></span> {listing.status}
              </span>
            </div>
            
            <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface">
              {listing.title}
            </h1>
            
            {listing.location_note && (
              <div className="flex items-center gap-2 text-on-surface-variant font-body-md text-body-md">
                <span className="material-symbols-outlined text-[20px]">location_on</span>
                <span>{listing.location_note}</span>
              </div>
            )}
          </div>

          {/* Description */}
          <section className="bg-surface-container-lowest rounded-xl p-md md:p-8 warm-shadow space-y-sm">
            <h2 className="font-headline-sm text-headline-sm text-on-surface mb-xs">About this Skill</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed whitespace-pre-wrap">
              {listing.description}
            </p>
          </section>

          {/* Logistics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
            {/* Availability */}
            <section className="bg-surface-container-lowest rounded-xl p-md warm-shadow flex flex-col gap-sm">
              <div className="flex items-center gap-2 text-primary">
                <span className="material-symbols-outlined">calendar_today</span>
                <h3 className="font-headline-sm text-headline-sm">Availability</h3>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant">Typically available during these times:</p>
              <div className="flex flex-wrap gap-2 mt-auto pt-2">
                <span className="bg-surface-container text-on-surface-variant font-label-sm text-label-sm px-3 py-1.5 rounded-full">
                  {listing.availability || 'Flexible / Upon Request'}
                </span>
              </div>
            </section>

            {/* Exchange Preferences */}
            <section className="bg-secondary-container/30 border border-secondary-fixed-dim/50 rounded-xl p-md warm-shadow flex flex-col gap-sm">
              <div className="flex items-center gap-2 text-primary">
                <span className="material-symbols-outlined">sync</span>
                <h3 className="font-headline-sm text-headline-sm">Looking For</h3>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant">
                {listing.exchange_preference || 'Open to any fair offer!'}
                <span className="inline-block align-middle ml-1 text-primary">↺</span>
              </p>
            </section>
          </div>
        </div>

        {/* Right Column: Sidebar */}
        <aside className="md:col-span-4 relative mt-lg md:mt-0">
          <div className="sticky top-24 space-y-md">
            {/* Member Card */}
            <div className="bg-surface-container-lowest rounded-xl warm-shadow p-6 border border-outline-variant/20 flex flex-col items-center text-center">
              <div className="relative mb-4">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-surface">
                  <img 
                    alt={`${profile?.full_name} Avatar`} 
                    src={avatar}
                    className="w-full h-full object-cover" 
                  />
                </div>
                {profile?.reputation_score && profile.reputation_score >= 4.5 && (
                  <div className="absolute bottom-0 right-0 bg-secondary-container text-primary rounded-full p-1 shadow-sm border-2 border-surface" title="Trusted Member">
                    <span className="material-symbols-outlined text-[16px] block">verified</span>
                  </div>
                )}
              </div>
              
              <h3 className="font-headline-sm text-headline-sm text-on-surface mb-1">{profile?.full_name}</h3>
              
              {profile?.reputation_score && profile.reputation_score >= 4.5 && (
                <p className="font-label-sm text-label-sm text-primary flex items-center gap-1 mb-4">
                  <span className="material-symbols-outlined text-[16px]">verified</span> Trusted Member
                </p>
              )}
              
              <div className="flex items-center gap-6 mb-6">
                <div className="flex flex-col items-center">
                  <div className="flex items-center text-on-surface font-label-md text-label-md">
                    <span className="text-[#E9A84C] material-symbols-outlined text-[18px] mr-1" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    {profile?.reputation_score?.toFixed(1) || '0.0'}
                  </div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant font-normal">Reviews</span>
                </div>
                
                <div className="w-px h-8 bg-outline-variant/50"></div>
                
                <div className="flex flex-col items-center">
                  <div className="flex items-center text-on-surface font-label-md text-label-md">
                    <span className="text-primary material-symbols-outlined text-[18px] mr-1">handshake</span>
                    {profile?.exchange_count || 0}
                  </div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant font-normal">Completed</span>
                </div>
              </div>

              <div className="w-full space-y-3">
                <button className="w-full bg-[#2D6A4F] text-on-primary font-label-md text-label-md font-bold py-3 px-4 rounded-lg hover:bg-primary transition-colors flex items-center justify-center gap-2 shadow-sm">
                  <span className="material-symbols-outlined">handshake</span> Propose Exchange
                </button>
                <button className="w-full bg-transparent text-[#2D6A4F] font-label-md text-label-md font-bold py-3 px-4 rounded-lg border-[1.5px] border-[#2D6A4F] hover:bg-secondary-container/20 transition-colors flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined">chat</span> Message Neighbor
                </button>
              </div>
            </div>

            {/* Safety/Trust Banner */}
            <div className="bg-surface-container-low rounded-xl p-4 flex gap-3 text-on-surface-variant border border-outline-variant/30">
              <span className="material-symbols-outlined text-primary shrink-0">health_and_safety</span>
              <div>
                <p className="font-label-sm text-label-sm text-on-surface">Community Trust</p>
                <p className="font-label-sm text-label-sm font-normal mt-1 leading-relaxed">
                  Exchanges are built on mutual respect. Never share private address details until an exchange is confirmed.
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
