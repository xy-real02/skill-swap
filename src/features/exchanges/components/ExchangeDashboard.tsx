'use client'

import { useState } from 'react'
import { UserExchange } from '@/features/exchanges/queries/getUserExchanges'
import Link from 'next/link'
import { TopBar } from '@/components/layout/TopBar'

export function ExchangeDashboard({
  exchanges,
  currentUserId,
}: {
  exchanges: UserExchange[]
  currentUserId: string
}) {
  const [activeTab, setActiveTab] = useState('Pending')

  const tabs = ['Pending', 'Active', 'Scheduled', 'Completed', 'Cancelled']

  const filteredExchanges = exchanges.filter((ex) => {
    if (activeTab === 'Pending') return ex.status === 'Pending'
    if (activeTab === 'Active') return ex.status === 'Accepted'
    if (activeTab === 'Completed') return ex.status === 'Completed'
    if (activeTab === 'Cancelled') return ex.status === 'Cancelled'
    return true
  })

  return (
    <>
      <TopBar 
        title="My Exchanges"
        description="Manage your active, pending, and past skill swaps."
      />
      <div className="max-w-container-max mx-auto w-full flex-1 pt-6">

      {/* Status Tabs */}
      <div className="flex overflow-x-auto hide-scrollbar gap-2 mb-lg pb-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full font-label-md text-label-md whitespace-nowrap transition-colors border ${
                isActive
                  ? 'bg-secondary-container text-on-secondary-container border-secondary-container'
                  : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant border-outline-variant/30'
              }`}
            >
              {tab}
            </button>
          )
        })}
      </div>

      {/* Exchange Cards List */}
      <div className="flex flex-col gap-6">
        {filteredExchanges.length === 0 ? (
          <div className="bg-surface-container-lowest rounded-xl p-8 text-center border border-outline-variant/20">
            <p className="text-on-surface-variant font-body-md">No exchanges found for this status.</p>
          </div>
        ) : (
          filteredExchanges.map((exchange) => {
            const isProvider = exchange.provider_id === currentUserId
            const otherUser = isProvider ? exchange.requester : exchange.provider

            return (
              <div key={exchange.id} className="bg-surface-container-lowest rounded-xl shadow-[0_4px_20px_-4px_rgba(45,106,79,0.08)] p-6 flex flex-col gap-6 border border-outline-variant/20 relative overflow-hidden group">
                {/* Decorative Loop Background */}
                <div className="absolute -right-12 -bottom-12 text-surface-container-high opacity-50 rotate-45 pointer-events-none">
                  <span className="material-symbols-outlined" style={{ fontSize: '180px' }}>loop</span>
                </div>

                {/* Header: Status & User */}
                <div className="flex flex-wrap justify-between items-start gap-4 relative z-10">
                  <div className="flex items-center gap-4">
                    <img 
                      src={otherUser?.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + (otherUser?.id || 'default')}
                      alt={`${otherUser?.full_name} Avatar`}
                      className="w-14 h-14 rounded-full object-cover border-2 border-surface" 
                    />
                    <div>
                      <h3 className="font-headline-sm text-headline-sm text-primary m-0">{otherUser?.full_name}</h3>
                      <p className="font-body-md text-body-md text-on-surface-variant flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">location_on</span> 
                        {otherUser?.community_zone || 'Local Neighbor'}
                      </p>
                    </div>
                  </div>
                  
                  <div className={`px-3 py-1 rounded-full font-label-sm text-label-sm flex items-center gap-1.5 shadow-sm border ${
                    exchange.status === 'Completed' ? 'bg-primary-fixed text-on-primary-fixed border-primary-fixed-dim/30' :
                    'bg-tertiary-fixed text-on-tertiary-fixed border-tertiary-fixed-dim/30'
                  }`}>
                    {exchange.status === 'Completed' ? (
                      <span className="material-symbols-outlined text-[16px]">verified</span>
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-tertiary"></span>
                    )}
                    {exchange.status}
                  </div>
                </div>

                {/* Trade Details (Bento-style layout) */}
                <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-4 bg-surface-container-low rounded-lg p-4 relative z-10">
                  {/* Offering */}
                  <div className="flex flex-col gap-2">
                    <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                      {isProvider ? 'They are offering' : 'You are offering'}
                    </span>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container shrink-0">
                        <span className="material-symbols-outlined">translate</span>
                      </div>
                      <div>
                        <p className="font-label-md text-label-md text-on-surface">{exchange.offered_skill}</p>
                      </div>
                    </div>
                  </div>

                  {/* Divider / Loop Motif */}
                  <div className="flex justify-center text-primary/40 hidden md:block">
                    <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>sync_alt</span>
                  </div>
                  <div className="h-px w-full bg-outline-variant/30 block md:hidden my-2 relative">
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-surface-container-low px-2 text-primary/40">
                      <span className="material-symbols-outlined text-[20px]">sync_alt</span>
                    </div>
                  </div>

                  {/* Requesting */}
                  <div className="flex flex-col gap-2">
                    <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                      {isProvider ? 'In exchange for your' : 'In exchange for their'}
                    </span>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center text-primary shrink-0">
                        <span className="material-symbols-outlined">plumbing</span>
                      </div>
                      <div>
                        <p className="font-label-md text-label-md text-on-surface">{exchange.listing?.title || 'Skill'}</p>
                        <p className="font-label-sm text-label-sm text-on-surface-variant">{exchange.listing?.category}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end mt-2 relative z-10">
                  <Link 
                    href={`/exchanges/${exchange.id}`}
                    className="bg-transparent text-primary hover:bg-secondary-container/30 font-label-md text-label-md px-6 py-2.5 rounded-lg border border-primary transition-colors ml-auto flex items-center gap-2"
                  >
                    View Conversation <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </Link>
                </div>
              </div>
            )
          })
        )}
      </div>

      <div className="h-xl"></div>
      </div>
    </>
  )
}
