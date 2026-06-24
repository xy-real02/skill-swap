import { getInboxConversations } from '@/features/messages/queries/getInboxConversations'
import { InboxList } from '@/features/messages/components/InboxList'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Messages | Skill Swap',
  description: 'Your messages and skill exchange conversations.',
}

export default async function MessagesPage() {
  const supabase = await createClient()
  const { data: authData } = await supabase.auth.getUser()
  
  if (!authData.user) {
    redirect('/login')
  }

  const conversations = await getInboxConversations()

  return (
    <div className="pt-6 px-margin-mobile md:px-lg max-w-container-max mx-auto w-full flex-1">
      <div className="mb-lg">
        <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-primary mb-2">
          Messages
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant">
          Stay connected with your neighbors and manage your exchanges.
        </p>
      </div>

      <div className="max-w-3xl">
        <InboxList conversations={conversations} currentUserId={authData.user.id} />
      </div>

      <div className="h-xl"></div>
    </div>
  )
}
