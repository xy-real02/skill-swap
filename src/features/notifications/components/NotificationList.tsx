'use client'

import { Notification } from '@/features/notifications/queries/getNotifications'
import { markNotificationRead } from '@/features/notifications/actions/markNotificationRead'
import { markAllNotificationsRead } from '@/features/notifications/actions/markAllNotificationsRead'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'

function formatRelativeTime(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()
  const diffInMs = now.getTime() - date.getTime()
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
  
  if (diffInDays === 0) {
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
    if (diffInHours === 0) {
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
      return diffInMinutes <= 1 ? 'Just now' : `${diffInMinutes} mins ago`
    }
    return `${diffInHours} hr${diffInHours > 1 ? 's' : ''} ago`
  }
  if (diffInDays === 1) return 'Yesterday'
  if (diffInDays < 7) return `${diffInDays} days ago`
  
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date)
}

export function NotificationList({ notifications }: { notifications: Notification[] }) {
  const router = useRouter()
  const [isMarkingAll, setIsMarkingAll] = useState(false)
  const [filterTab, setFilterTab] = useState<'All' | 'Unread'>('All')

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.is_read) {
      await markNotificationRead(notification.id)
    }

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
  const filteredNotifications = notifications.filter(n => {
    if (filterTab === 'Unread') return !n.is_read
    return true
  })

  return (
    <>
      <div className="w-full pt-6">
        <div className="flex flex-col sm:flex-row sm:justify-end items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
            {/* Filter Tabs */}
            <div className="flex bg-surface-container-low rounded-lg p-1 border border-outline-variant/30">
              <button
                onClick={() => setFilterTab('All')}
                className={`px-4 py-1.5 rounded-md font-label-sm transition-colors ${
                  filterTab === 'All' 
                    ? 'bg-surface shadow-sm text-on-surface' 
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterTab('Unread')}
                className={`px-4 py-1.5 rounded-md font-label-sm transition-colors flex items-center gap-1.5 ${
                  filterTab === 'Unread' 
                    ? 'bg-surface shadow-sm text-on-surface' 
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                }`}
              >
                Unread
                {unreadCount > 0 && (
                  <span className={`w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-bold ${
                    filterTab === 'Unread' ? 'bg-primary text-on-primary' : 'bg-surface-variant text-on-surface-variant'
                  }`}>
                    {unreadCount}
                  </span>
                )}
              </button>
            </div>

            {unreadCount > 0 && (
              <button 
                onClick={handleMarkAllRead}
                disabled={isMarkingAll}
                className="text-primary hover:text-primary/80 font-label-md transition-colors disabled:opacity-50 underline-offset-4 hover:underline"
              >
                {isMarkingAll ? 'Marking...' : 'Mark all as read'}
              </button>
            )}
          </div>
        </div>

        {filteredNotifications.length === 0 ? (
          <div className="bg-surface-container-lowest rounded-[24px] p-12 text-center border border-outline-variant/20 flex flex-col items-center justify-center relative overflow-hidden shadow-sm mt-8">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
            <div className="w-20 h-20 bg-primary-container text-primary rounded-full flex items-center justify-center mb-6 shadow-sm relative z-10">
              <span className="material-symbols-outlined text-[40px]">notifications_active</span>
            </div>
            <h3 className="font-headline-md text-headline-md text-on-surface mb-2 relative z-10">
              {filterTab === 'Unread' ? "No unread notifications" : "You're all caught up!"}
            </h3>
            <p className="text-on-surface-variant font-body-lg w-full max-w-[400px] mx-auto mb-8 relative z-10">
              When neighbors interact with your listings or exchanges, you'll be notified here.
            </p>
            <Link 
              href="/explore"
              className="bg-primary text-on-primary hover:bg-primary/90 px-8 py-3 rounded-full font-label-lg shadow-sm transition-all relative z-10"
            >
              Explore Skills
            </Link>
          </div>
        ) : (
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-[0_4px_20px_-4px_rgba(45,106,79,0.06)] overflow-hidden flex flex-col">
            {filteredNotifications.map((notification) => {
              const isUnread = !notification.is_read
              
              // Map types to icons, colors, and contextual subtext
              let icon = 'notifications'
              let iconColor = 'text-primary'
              let bgColor = 'bg-primary/10'
              let subtext = 'View Details →'

              switch (notification.type) {
                case 'new_message':
                  icon = 'chat'
                  iconColor = 'text-[#2D6A4F]'
                  bgColor = 'bg-[#2D6A4F]/10'
                  subtext = 'Read Message →'
                  break
                case 'proposal_accepted':
                  icon = 'handshake'
                  iconColor = 'text-[#1B4332]'
                  bgColor = 'bg-[#1B4332]/10'
                  subtext = 'Go to Workspace →'
                  break
                case 'exchange_completed':
                  icon = 'verified'
                  iconColor = 'text-[#1B4332]'
                  bgColor = 'bg-[#1B4332]/10'
                  subtext = 'View Exchange →'
                  break
                case 'proposal_declined':
                  icon = 'cancel'
                  iconColor = 'text-error'
                  bgColor = 'bg-error/10'
                  subtext = 'View Status →'
                  break
                case 'request_matched':
                  icon = 'auto_awesome'
                  iconColor = 'text-[#D8F3DC]'
                  bgColor = 'bg-primary'
                  subtext = 'View Listing Match →'
                  break
              }

              return (
                <button
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`w-full text-left p-4 sm:p-6 transition-all duration-200 border-b border-outline-variant/20 last:border-0 hover:bg-surface-container group relative flex items-start gap-4 ${isUnread ? 'bg-primary/5' : 'bg-transparent'}`}
                >
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 mt-1 transition-transform duration-200 group-hover:scale-110 ${bgColor} ${iconColor}`}>
                    <span className="material-symbols-outlined">{icon}</span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 flex flex-col justify-center transition-transform duration-200 group-hover:-translate-y-0.5">
                    <div className="flex justify-between items-baseline gap-2 mb-1">
                      <h3 className={`font-headline-sm text-[16px] leading-tight pr-2 ${isUnread ? 'text-on-surface font-bold' : 'text-on-surface-variant'}`}>
                        {notification.message}
                      </h3>
                      <span className={`font-label-sm text-[12px] shrink-0 ${isUnread ? 'text-primary font-bold' : 'text-on-surface-variant'}`}>
                        {notification.created_at ? formatRelativeTime(notification.created_at) : ''}
                      </span>
                    </div>
                    <p className={`font-body-md text-[13px] line-clamp-1 ${isUnread ? 'text-primary/90 font-medium' : 'text-on-surface-variant/80'}`}>
                      {subtext}
                    </p>
                  </div>

                  {/* Unread Indicator */}
                  {isUnread && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-12 bg-primary rounded-r-md"></div>
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
