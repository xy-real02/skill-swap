'use client'

import { InboxConversation } from '@/features/messages/queries/getInboxConversations'
import Link from 'next/link'

export function InboxList({
  conversations,
  currentUserId,
}: {
  conversations: InboxConversation[]
  currentUserId: string
}) {
  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-sm mt-8">
        <div className="bg-secondary-container/50 text-primary w-20 h-20 rounded-full flex items-center justify-center mb-6">
          <span className="material-symbols-outlined text-[40px]">forum</span>
        </div>
        <h2 className="font-headline-sm text-headline-sm text-on-surface mb-2 font-bold text-center">No messages yet</h2>
        <p className="font-body-md text-body-md text-on-surface-variant text-center max-w-md">
          When you propose an exchange or someone messages you about a listing, your conversations will appear here.
        </p>
        <Link 
          href="/explore"
          className="mt-8 bg-primary hover:bg-primary/90 text-on-primary px-8 py-3 rounded-full font-label-md text-label-md transition-colors"
        >
          Explore Listings
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-[0_4px_20px_-4px_rgba(45,106,79,0.06)] overflow-hidden">
      {conversations.map((conv, index) => {
        const isProvider = conv.provider_id === currentUserId
        const otherUser = isProvider ? conv.requester : conv.provider
        const latestMessage = conv.messages && conv.messages.length > 0 ? conv.messages[0] : null
        
        // Determine unread status: Message exists, is not read, and was NOT sent by me
        const isUnread = latestMessage && !latestMessage.is_read && latestMessage.sender_id !== currentUserId

        return (
          <Link 
            key={conv.id} 
            href={`/exchanges/${conv.id}`}
            className={`block p-4 sm:p-6 transition-colors border-b border-outline-variant/20 last:border-0 hover:bg-surface-container-lowest relative ${isUnread ? 'bg-primary/5' : 'bg-transparent'}`}
          >
            <div className="flex gap-4 sm:gap-6 items-center sm:items-start">
              {/* Avatar Area */}
              <div className="relative shrink-0">
                <img 
                  src={otherUser?.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + (otherUser?.id || 'default')}
                  alt={otherUser?.full_name}
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-[1.5px] border-surface shadow-sm"
                />
                {isUnread && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-error rounded-full border-2 border-surface-container-lowest shadow-sm"></div>
                )}
              </div>

              {/* Content Area */}
              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <div className="flex justify-between items-baseline gap-2 mb-1">
                  <h3 className={`font-headline-sm text-[16px] sm:text-[18px] leading-tight truncate ${isUnread ? 'text-on-surface font-bold' : 'text-on-surface/90'}`}>
                    {otherUser?.full_name}
                  </h3>
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
  )
}
