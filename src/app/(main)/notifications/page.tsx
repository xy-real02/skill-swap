import { getNotifications } from '@/features/notifications/queries/getNotifications'
import { NotificationList } from '@/features/notifications/components/NotificationList'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Notifications | Skill Swap',
  description: 'View your recent notifications.',
}

export default async function NotificationsPage() {
  const supabase = await createClient()
  const { data: authData } = await supabase.auth.getUser()
  
  if (!authData.user) {
    redirect('/login')
  }

  const notifications = await getNotifications()

  return (
    <div className="pt-6 px-margin-mobile md:px-lg max-w-container-max mx-auto w-full flex-1">
      <div className="max-w-3xl">
        <NotificationList notifications={notifications} />
      </div>
      <div className="h-xl"></div>
    </div>
  )
}
