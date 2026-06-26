'use client'

import { useState } from 'react'
import { InboxConversation } from '@/features/messages/queries/getInboxConversations'
import Link from 'next/link'

export function InboxList({
  conversations,
  currentUserId,
}: {
  conversations: InboxConversation[]
  currentUserId: string
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [unreadOnly, setUnreadOnly] = useState(false)

  if (conversations.length === 0) {
    return (
      <div className="bg-surface-container-lowest rounded-[24px] p-12 text-center border border-outline-variant/20 flex flex-col items-center justify-center relative overflow-hidden shadow-sm mt-8">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="w-20 h-20 bg-primary-container text-primary rounded-full flex items-center justify-center mb-6 shadow-sm relative z-10">
          <span className="material-symbols-outlined text-[40px]">forum</span>
        </div>
        <h3 className="font-headline-md text-headline-md text-on-surface mb-2 relative z-10">No messages yet</h3>
        <p className="text-on-surface-variant font-body-lg w-full max-w-[400px] mx-auto mb-8 relative z-10">
          When you propose an exchange or someone messages you about a listing, your conversations will appear here.
        </p>
        <Link 
          href="/explore"
          className="bg-primary text-on-primary hover:bg-primary/90 px-8 py-3 rounded-full font-label-lg shadow-sm transition-all relative z-10"
        >
          Explore Skills
        </Link>
      </div>
    )
  }

  const filteredConversations = conversations.filter((conv) => {
    const isProvider = conv.provider_id === currentUserId
    const otherUser = isProvider ? conv.requester : conv.provider
    const latestMessage = conv.messages && conv.messages.length > 0 ? conv.messages[0] : null
    const isUnread = latestMessage && !latestMessage.is_read && latestMessage.sender_id !== currentUserId

    if (unreadOnly && !isUnread) return false

    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      const nameMatch = otherUser?.full_name.toLowerCase().includes(q)
      const skillMatch = (isProvider ? conv.listing?.title : conv.offered_skill)?.toLowerCase().includes(q)
      if (!nameMatch && !skillMatch) return false
    }

    return true
  })

  return (
    <div className="flex flex-col gap-6">
      {/* Search Bar & Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/30 shadow-sm">
        <div className="relative flex-1 w-full">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
          <input 
            type="text"
            placeholder="Search by name or skill..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-surface-container rounded-xl border border-outline-variant/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-body-lg text-on-surface placeholder:text-on-surface-variant"
          />
        </div>
        <label className="flex items-center gap-2 font-label-md text-on-surface-variant cursor-pointer self-start sm:self-auto px-2">
          <input 
            type="checkbox" 
            checked={unreadOnly} 
            onChange={(e) => setUnreadOnly(e.target.checked)}
            className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary" 
          />
          Unread Only
        </label>
      </div>

      {filteredConversations.length === 0 ? (
        <div className="text-center py-12 bg-surface-container-lowest rounded-2xl border border-outline-variant/30">
          <p className="text-on-surface-variant font-body-lg">No conversations match your search.</p>
        </div>
      ) : (
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-[0_4px_20px_-4px_rgba(45,106,79,0.06)] overflow-hidden">
          {filteredConversations.map((conv) => {
            const isProvider = conv.provider_id === currentUserId
            const otherUser = isProvider ? conv.requester : conv.provider
            const latestMessage = conv.messages && conv.messages.length > 0 ? conv.messages[0] : null
            
            // Determine unread status: Message exists, is not read, and was NOT sent by me
            const isUnread = latestMessage && !latestMessage.is_read && latestMessage.sender_id !== currentUserId

            return (
              <Link 
                key={conv.id} 
                href={`/exchanges/${conv.id}`}
                className={`block p-4 sm:p-6 transition-all duration-200 border-b border-outline-variant/20 last:border-0 hover:bg-surface-container group relative ${isUnread ? 'bg-primary/5' : 'bg-transparent'}`}
              >
                <div className="flex gap-4 sm:gap-6 items-center sm:items-start group-hover:-translate-y-0.5 transition-transform duration-200">
                  {/* Avatar Area */}
                  <div className="relative shrink-0 mt-1">
                    <img 
                      src={otherUser?.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + (otherUser?.id || 'default')}
                      alt={otherUser?.full_name}
                      className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-[1.5px] border-surface shadow-sm"
                    />
                    {isUnread && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full border-2 border-surface-container-lowest shadow-sm"></div>
                    )}
                  </div>

                  {/* Content Area */}
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <div className="flex justify-between items-baseline gap-2 mb-1">
                      <div className="flex items-center gap-2 truncate">
                        <h3 className={`font-headline-sm text-[16px] sm:text-[18px] truncate ${isUnread ? 'text-on-surface font-bold' : 'text-on-surface/90'}`}>
                          {otherUser?.full_name}
                        </h3>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider hidden sm:inline-block ${
                          conv.status === 'Completed' ? 'bg-primary-fixed text-on-primary-fixed' :
                          conv.status === 'Pending' ? 'bg-tertiary-fixed text-on-tertiary-fixed' :
                          'bg-secondary-fixed text-on-secondary-fixed'
                        }`}>
                          {conv.status}
                        </span>
                      </div>
                      {latestMessage && (
                        <span className={`font-label-sm text-[12px] shrink-0 ${isUnread ? 'text-primary font-bold' : 'text-on-surface-variant'}`}>
                          {new Date(latestMessage.created_at!).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </span>
                      )}
                    </div>

                    <p className="font-label-sm text-[13px] text-primary/80 mb-2 truncate flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[14px]">sync_alt</span>
                      {isProvider ? conv.listing?.title : conv.offered_skill}
                    </p>

                    <div className="flex items-center gap-2">
                      <p className={`font-body-md text-[14px] sm:text-[15px] truncate ${isUnread ? 'text-on-surface font-bold' : 'text-on-surface-variant'}`}>
                        {latestMessage ? (
                          <>
                            {latestMessage.sender_id === currentUserId && <span className="text-primary/60 mr-1">You:</span>}
                            {latestMessage.content}
                          </>
                        ) : (
                          <span className="italic">No messages yet. Start the conversation!</span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
