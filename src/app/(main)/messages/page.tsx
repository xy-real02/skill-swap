import { getInboxConversations } from '@/features/messages/queries/getInboxConversations'
import { InboxList } from '@/features/messages/components/InboxList'
import { redirect } from 'next/navigation'
import { TopBar } from '@/components/layout/TopBar'
import { createClient } from '@/lib/supabase/server'

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
    <>
      <TopBar 
        title="Messages"
        description="Stay connected with your neighbors and manage your exchanges."
      />
      <div className="pt-6 px-margin-mobile md:px-lg max-w-container-max mx-auto w-full flex-1">

      <div className="max-w-3xl">
        <InboxList conversations={conversations} currentUserId={authData.user.id} />
      </div>

      <div className="h-xl"></div>
      </div>
    </>
  )
}
