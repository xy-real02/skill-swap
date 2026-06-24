'use client'

import { useState } from 'react'
import { ListingWithProfile } from '@/features/listings/queries/getActiveListings'
import { ReviewWithReviewer } from '@/features/reviews/queries/getPublishedReviews'
import { ExchangeHistoryItem } from '@/features/exchanges/queries/getUserExchangeHistory'
import { ListingCard } from '@/features/listings/components/ListingCard'
import { ReviewList } from '@/features/reviews/components/ReviewList'
import Link from 'next/link'

export function ProfileTabs({
  listings,
  reviews,
  history,
  isOwner,
  currentUserId
}: {
  listings: ListingWithProfile[]
  reviews: ReviewWithReviewer[]
  history: ExchangeHistoryItem[]
  isOwner: boolean
  currentUserId: string
}) {
  const [activeTab, setActiveTab] = useState<'skills' | 'reviews' | 'history'>('skills')

  return (
    <>
      {/* Tabs */}
      <div className="flex gap-8 border-b border-surface-variant mb-8 overflow-x-auto no-scrollbar">
        <button 
          onClick={() => setActiveTab('skills')}
          className={`font-label-md text-label-md pb-3 px-2 whitespace-nowrap transition-colors ${
            activeTab === 'skills' 
              ? 'text-primary font-bold border-b-2 border-primary' 
              : 'text-on-surface-variant hover:text-primary'
          }`}
        >
          Skills Offered
        </button>
        <button 
          onClick={() => setActiveTab('reviews')}
          className={`font-label-md text-label-md pb-3 px-2 whitespace-nowrap transition-colors ${
            activeTab === 'reviews' 
              ? 'text-primary font-bold border-b-2 border-primary' 
              : 'text-on-surface-variant hover:text-primary'
          }`}
        >
          Reviews
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          className={`font-label-md text-label-md pb-3 px-2 whitespace-nowrap transition-colors ${
            activeTab === 'history' 
              ? 'text-primary font-bold border-b-2 border-primary' 
              : 'text-on-surface-variant hover:text-primary'
          }`}
        >
          Exchange History
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'skills' && (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
          {listings.map(listing => (
            <ListingCard key={listing.id} listing={listing} currentUserId={currentUserId} />
          ))}
          
          {/* New Listing Ghost Card */}
          {isOwner && (
            <Link href="/listings/create" className="block h-full group">
              <div className="bg-surface/50 border-2 border-dashed border-outline-variant rounded-xl p-6 flex flex-col items-center justify-center h-full min-h-[300px] hover:bg-surface-container-low hover:border-primary transition-all cursor-pointer">
                <div className="w-16 h-16 rounded-full bg-secondary-container flex items-center justify-center mb-4 group-hover:bg-primary-container transition-colors">
                  <span className="material-symbols-outlined text-[32px] text-primary group-hover:text-on-primary transition-colors">add</span>
                </div>
                <h3 className="font-label-md text-label-md text-on-surface mb-1 font-bold">Add a New Skill</h3>
                <p className="font-body-md text-body-md text-on-surface-variant text-center px-4">What else can you share with the community?</p>
              </div>
            </Link>
          )}

          {!isOwner && listings.length === 0 && (
            <div className="col-span-full py-12 text-center text-on-surface-variant">
              This member doesn't have any active listings right now.
            </div>
          )}
        </section>
      )}

      {activeTab === 'reviews' && (
        <section className="max-w-2xl">
          <ReviewList reviews={reviews} />
        </section>
      )}

      {activeTab === 'history' && (
        <section className="flex flex-col gap-4 max-w-3xl">
          {history.length === 0 ? (
            <div className="py-12 text-center text-on-surface-variant bg-surface-container-lowest rounded-2xl border border-outline-variant/30">
              No completed exchanges yet.
            </div>
          ) : (
            history.map(exchange => {
              const otherUser = exchange.provider_id === currentUserId ? exchange.requester : exchange.provider
              const isDisputed = exchange.status === 'Disputed'
              return (
                <div key={exchange.id} className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/30 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img 
                      src={otherUser?.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + (otherUser?.id || 'default')}
                      alt={otherUser?.full_name || 'User'}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-label-md text-on-surface font-bold">Exchange with {otherUser?.full_name}</h4>
                      <p className="font-label-sm text-on-surface-variant">
                        {exchange.listing?.title || exchange.offered_skill}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className={`px-3 py-1 rounded-full text-label-sm font-bold flex items-center gap-1 ${isDisputed ? 'bg-error-container text-on-error-container' : 'bg-primary-container/20 text-primary'}`}>
                      <span className="material-symbols-outlined text-[14px]">
                        {isDisputed ? 'report' : 'check_circle'}
                      </span>
                      {exchange.status}
                    </div>
                    {isOwner && (
                      <Link href={`/exchanges/${exchange.id}`} className="text-primary hover:bg-secondary-container p-2 rounded-full transition-colors">
                        <span className="material-symbols-outlined">arrow_forward</span>
                      </Link>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </section>
      )}
    </>
  )
}
