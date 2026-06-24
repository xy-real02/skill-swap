import Link from 'next/link'
import type { Database } from '@/types/database.types'

type ListingRow = Database['public']['Tables']['listings']['Row']
type ProfileRow = Database['public']['Tables']['profiles']['Row']

export type ListingWithProfile = ListingRow & {
  profiles: Pick<ProfileRow, 'id' | 'full_name' | 'avatar_url' | 'community_zone' | 'reputation_score' | 'exchange_count'> | null
}

export function ListingCard({ listing, currentUserId }: { listing: ListingWithProfile, currentUserId?: string }) {
  const profile = listing.profiles
  const avatar = profile?.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + (profile?.id || 'default')
  
  return (
    <Link href={`/listings/${listing.id}`} className="block h-full group">
      <div className="bg-surface-container-lowest rounded-xl warm-shadow p-6 flex flex-col h-full border border-surface-variant group-hover:border-primary/30 transition-all">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <img alt={profile?.full_name || 'User'} src={avatar} className="w-12 h-12 rounded-full object-cover" />
            <div>
              <h3 className="font-label-md text-label-md text-on-surface">{profile?.full_name || 'Anonymous User'}</h3>
              <div className="flex items-center gap-1 text-tertiary-fixed-dim">
                <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  {profile?.reputation_score?.toFixed(1) || '0.0'} ({profile?.exchange_count || 0} exchanges)
                </span>
              </div>
            </div>
          </div>
          <span className="px-3 py-1 bg-secondary-container text-primary rounded-full font-label-sm text-label-sm whitespace-nowrap overflow-hidden text-ellipsis max-w-[100px]">
            {listing.category}
          </span>
        </div>
        
        <h4 className="font-headline-sm text-headline-sm text-primary mb-2 line-clamp-1">{listing.title}</h4>
        <p className="font-body-md text-body-md text-on-surface-variant mb-4 line-clamp-2 flex-grow">{listing.description}</p>
        
        <div className="flex gap-2 mb-6 flex-wrap">
          {listing.availability && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-surface-container text-on-surface-variant rounded-md font-label-sm text-[11px]">
              <span className="material-symbols-outlined text-[14px]">calendar_today</span> {listing.availability}
            </span>
          )}
          {listing.location_note && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-surface-container text-on-surface-variant rounded-md font-label-sm text-[11px]">
              <span className="material-symbols-outlined text-[14px]">location_on</span> {listing.location_note}
            </span>
          )}
        </div>
        
        {listing.owner_id === currentUserId ? (
          <button className="w-full py-2.5 bg-transparent border-[1.5px] border-tertiary text-tertiary font-label-md text-label-md rounded-lg group-hover:bg-tertiary group-hover:text-on-tertiary transition-colors flex justify-center items-center gap-2">
            View My Listing <span className="material-symbols-outlined text-[18px]">visibility</span>
          </button>
        ) : (
          <button className="w-full py-2.5 bg-transparent border-[1.5px] border-primary text-primary font-label-md text-label-md rounded-lg group-hover:bg-primary group-hover:text-on-primary transition-colors flex justify-center items-center gap-2">
            Propose Exchange <span className="material-symbols-outlined text-[18px]">sync</span>
          </button>
        )}
      </div>
    </Link>
  )
}
