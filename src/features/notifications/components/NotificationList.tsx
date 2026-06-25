'use client'

import { Notification } from '@/features/notifications/queries/getNotifications'
import { markNotificationRead } from '@/features/notifications/actions/markNotificationRead'
import { markAllNotificationsRead } from '@/features/notifications/actions/markAllNotificationsRead'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function NotificationList({ notifications }: { notifications: Notification[] }) {
  const router = useRouter()
  const [isMarkingAll, setIsMarkingAll] = useState(false)

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.is_read) {
      await markNotificationRead(notification.id)
    }

    // Route based on related_id and type
    // If it's a request match, route to listing
    // Most others route to exchange
    if (notification.type === 'request_matched') {
      router.push(`/listings/${notification.related_id}`)
    } else {
      router.push(`/exchanges/${notification.related_id}`)
    }
  }

  const handleMarkAllRead = async () => {
    setIsMarkingAll(true)
    await markAllNotificationsRead()
    setIsMarkingAll(false)
  }

  const unreadCount = notifications.filter(n => !n.is_read).length

  return (
    <>
      <div className="w-full pt-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="font-headline-md text-on-surface">Notifications</h1>
          {unreadCount > 0 && (
            <button 
              onClick={handleMarkAllRead}
              disabled={isMarkingAll}
              className="bg-secondary-container text-on-secondary-container hover:bg-secondary-container/80 px-4 py-2 rounded-lg font-label-md transition-colors disabled:opacity-50"
            >
              {isMarkingAll ? 'Marking...' : 'Mark all as read'}
            </button>
          )}
        </div>
      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-sm mt-8">
          <div className="bg-secondary-container/50 text-primary w-20 h-20 rounded-full flex items-center justify-center mb-6">
            <span className="material-symbols-outlined text-[40px]">notifications_active</span>
          </div>
          <h2 className="font-headline-sm text-headline-sm text-on-surface mb-2 font-bold text-center">You're all caught up!</h2>
          <p className="font-body-md text-body-md text-on-surface-variant text-center max-w-md">
            When neighbors interact with your listings or exchanges, you'll be notified here.
          </p>
        </div>
      ) : (
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-sm overflow-hidden flex flex-col">
          {notifications.map((notification) => {
            const isUnread = !notification.is_read
            
            // Map types to icons and colors
            let icon = 'notifications'
            let iconColor = 'text-primary'
            let bgColor = 'bg-primary/10'

            switch (notification.type) {
              case 'new_message':
                icon = 'chat'
                iconColor = 'text-[#2D6A4F]'
                bgColor = 'bg-[#2D6A4F]/10'
                break
              case 'proposal_accepted':
              case 'exchange_completed':
                icon = 'handshake'
                iconColor = 'text-[#1B4332]'
                bgColor = 'bg-[#1B4332]/10'
                break
              case 'proposal_declined':
                icon = 'cancel'
                iconColor = 'text-error'
                bgColor = 'bg-error/10'
                break
              case 'request_matched':
                icon = 'auto_awesome'
                iconColor = 'text-[#D8F3DC]'
                bgColor = 'bg-primary'
                break
            }

            return (
              <button
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`w-full text-left p-4 sm:p-6 transition-colors border-b border-outline-variant/20 last:border-0 hover:bg-surface-container-high relative flex items-start gap-4 ${isUnread ? 'bg-primary/5' : 'bg-transparent'}`}
              >
                {/* Icon */}
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${bgColor} ${iconColor}`}>
                  <span className="material-symbols-outlined">{icon}</span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <div className="flex justify-between items-baseline gap-2 mb-1">
                    <h3 className={`font-headline-sm text-[16px] leading-tight ${isUnread ? 'text-on-surface font-bold' : 'text-on-surface-variant'}`}>
                      {notification.message}
                    </h3>
                    <span className={`font-label-sm text-[12px] shrink-0 ${isUnread ? 'text-primary font-bold' : 'text-on-surface-variant'}`}>
                      {new Date(notification.created_at!).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <p className="font-body-md text-[14px] text-on-surface-variant line-clamp-1">
                    Click to view details
                  </p>
                </div>

                {/* Unread Dot */}
                {isUnread && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
                )}
              </button>
            )
          })}
        </div>
      )}
      </div>
    </>
  )
}
