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
    <>
      <div className="max-w-container-max mx-auto w-full pt-6 h-[calc(100vh-140px)] flex flex-col">

      <div className="max-w-3xl">
        <InboxList conversations={conversations} currentUserId={authData.user.id} />
      </div>

      <div className="h-xl"></div>
      </div>
    </>
  )
}
