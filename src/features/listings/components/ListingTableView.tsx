'use client'

import Link from 'next/link'
import type { ListingWithProfile } from './ListingCard'

export function ListingTableView({ listings, currentUserId }: { listings: ListingWithProfile[], currentUserId?: string }) {
  if (listings.length === 0) return null

  return (
    <div className="col-span-full overflow-x-auto bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-sm">
      <table className="w-full text-left border-collapse min-w-[800px]">
        <thead>
          <tr className="border-b border-surface-variant bg-surface-container-low text-on-surface-variant font-label-sm text-xs uppercase tracking-wider">
            <th className="py-3.5 px-4 font-bold">Neighbor</th>
            <th className="py-3.5 px-4 font-bold">Category</th>
            <th className="py-3.5 px-4 font-bold">Skill Offered</th>
            <th className="py-3.5 px-4 font-bold">Looking For</th>
            <th className="py-3.5 px-4 font-bold">Location</th>
            <th className="py-3.5 px-4 text-right font-bold">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-variant/60 font-body-sm text-sm">
          {listings.map((listing) => {
            const profile = listing.profiles
            const avatar = profile?.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + (profile?.id || 'default')
            const isOwner = listing.owner_id === currentUserId

            return (
              <tr key={listing.id} className="hover:bg-surface-container-low/50 transition-colors group">
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <Link href={`/profile/${listing.owner_id}`} className="flex items-center gap-2.5 group/profile">
                    <img src={avatar} alt={profile?.full_name || 'User'} className="w-8 h-8 rounded-full object-cover shrink-0" />
                    <div>
                      <p className="font-label-md font-bold text-on-surface group-hover/profile:text-primary transition-colors">
                        {profile?.full_name || 'Anonymous'}
                      </p>
                      <div className="flex items-center gap-1 text-on-surface-variant text-[11px]">
                        <span className="material-symbols-outlined text-[13px] text-amber-500">star</span>
                        <span>{profile?.reputation_score?.toFixed(1) || 'New'}</span>
                      </div>
                    </div>
                  </Link>
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <span className="bg-primary-container text-on-primary-container font-label-sm text-xs px-2.5 py-1 rounded-full font-bold">
                    {listing.category}
                  </span>
                </td>
                <td className="py-3.5 px-4 max-w-[240px]">
                  <p className="font-label-md font-bold text-on-surface truncate" title={listing.title}>{listing.title}</p>
                  <p className="text-on-surface-variant text-xs line-clamp-1 truncate" title={listing.description}>{listing.description}</p>
                </td>
                <td className="py-3.5 px-4 text-on-surface-variant max-w-[180px] truncate" title={listing.exchange_preference || 'Open to offers'}>
                  {listing.exchange_preference || 'Open to offers'}
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap text-on-surface-variant text-xs">
                  {listing.location_note ? (
                    <span className="flex items-center gap-1 bg-surface-variant px-2 py-0.5 rounded-md text-on-surface-variant truncate max-w-[120px] font-bold">
                      <span className="material-symbols-outlined text-[14px]">location_on</span>
                      <span className="truncate">{listing.location_note}</span>
                    </span>
                  ) : '—'}
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap text-right">
                  {!isOwner && currentUserId ? (
                    <Link
                      href={`?tab=listings&modal=propose-listing&listingId=${listing.id}&providerId=${listing.owner_id}&title=${encodeURIComponent(listing.title)}`}
                      className="inline-flex items-center gap-1 bg-primary text-on-primary hover:bg-primary/90 font-label-sm text-xs py-1.5 px-3 rounded-full transition-colors shadow-sm font-bold"
                    >
                      <span className="material-symbols-outlined text-[14px]">sync</span> Propose
                    </Link>
                  ) : !currentUserId ? (
                    <Link href="/login" className="text-xs text-primary font-bold hover:underline">Log in</Link>
                  ) : null}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
