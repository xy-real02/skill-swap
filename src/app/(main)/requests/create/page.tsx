import { CreateRequestForm } from '@/features/requests/components/CreateRequestForm'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { TopBar } from '@/components/layout/TopBar'

export default async function CreateRequestPage() {
  const supabase = await createClient()
  const { data: authData } = await supabase.auth.getUser()

  if (!authData.user) {
    redirect('/login?redirectTo=/requests/create')
  }

  return (
    <>
      <TopBar 
        title="Request a Skill"
        description="Need a hand with something? Broadcast it to the community."
        backHref="/explore?tab=requests"
      />
      <div className="max-w-2xl mx-auto py-8 px-margin-mobile md:px-0">


      <div className="bg-surface border border-surface-variant rounded-3xl p-6 sm:p-8 shadow-sm">
        <CreateRequestForm />
      </div>
      </div>
    </>
  )
}
