'use client'

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
  const isOwner = listing.owner_id === currentUserId
  
  return (
    <article className="flex flex-col bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 hover:shadow-md transition-shadow group h-full">
      <div className="flex justify-between items-start mb-4 gap-2">
        <span className="bg-primary-container text-on-primary-container font-label-sm text-label-sm px-3 py-1 rounded-full font-bold">
          {listing.category}
        </span>
        {listing.location_note ? (
          <span className="font-label-sm text-label-sm px-3 py-1 rounded-full font-bold flex items-center gap-1 bg-surface-variant text-on-surface-variant max-w-[160px] truncate">
            <span className="material-symbols-outlined text-[16px] shrink-0">location_on</span>
            <span className="truncate">{listing.location_note}</span>
          </span>
        ) : null}
      </div>
      
      <Link href={`/listings/${listing.id}`} className="block mb-2">
        <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold line-clamp-2 hover:text-primary transition-colors">
          {listing.title}
        </h3>
      </Link>
      
      <p className="font-body-md text-body-md text-on-surface-variant mb-6 line-clamp-3 flex-grow">
        {listing.description}
      </p>
      
      <div className="bg-surface-container rounded-xl p-4 mb-6">
        <h4 className="font-label-sm text-label-sm text-on-surface font-bold mb-1">Looking for in return:</h4>
        <p className="font-body-sm text-body-sm text-on-surface-variant">{listing.exchange_preference || 'Open to offers'}</p>
        
        {listing.availability && (
          <div className="mt-3 pt-3 border-t border-outline-variant/30">
            <h4 className="font-label-sm text-label-sm text-on-surface font-bold mb-1">Availability:</h4>
            <p className="font-body-sm text-body-sm text-on-surface-variant">{listing.availability}</p>
          </div>
        )}
      </div>
      
      <div className="flex items-center justify-between mt-auto pt-4 border-t border-surface-variant gap-2">
        <Link href={`/profile/${listing.owner_id}`} className="flex items-center gap-3 group/profile min-w-0">
          <img 
            src={avatar} 
            alt={profile?.full_name || 'User'} 
            className="w-10 h-10 rounded-full object-cover shrink-0 border-2 border-transparent group-hover/profile:border-primary transition-colors"
          />
          <div className="min-w-0 truncate">
            <p className="font-label-md text-label-md text-on-surface font-bold group-hover/profile:text-primary transition-colors truncate">
              {profile?.full_name || 'Anonymous User'}
            </p>
            <div className="flex items-center gap-1 text-on-surface-variant font-label-sm text-[11px] truncate">
              <span className="material-symbols-outlined text-[14px] shrink-0">star</span>
              <span>{profile?.reputation_score?.toFixed(1) || 'New'}</span>
              <span className="mx-1">•</span>
              <span className="truncate">{profile?.community_zone || 'Neighbor'}</span>
            </div>
          </div>
        </Link>
        
        {!isOwner && currentUserId && (
          <Link 
            href={`?tab=listings&modal=propose-listing&listingId=${listing.id}&providerId=${listing.owner_id}&title=${encodeURIComponent(listing.title)}`}
            className="bg-primary text-on-primary hover:bg-primary/90 font-label-md text-label-md py-2 px-4 rounded-full transition-colors whitespace-nowrap shrink-0"
          >
            Propose Exchange
          </Link>
        )}
        
        {(!currentUserId || isOwner) && (
          <Link 
            href={`/listings/${listing.id}`}
            className="text-primary hover:bg-primary-container font-label-md text-label-md py-2 px-4 rounded-full transition-colors whitespace-nowrap shrink-0"
          >
            View Details
          </Link>
        )}
      </div>
    </article>
  )
}
