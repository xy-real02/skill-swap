import { CreateRequestForm } from '@/features/requests/components/CreateRequestForm'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function CreateRequestPage() {
  const supabase = await createClient()
  const { data: authData } = await supabase.auth.getUser()

  if (!authData.user) {
    redirect('/login?redirectTo=/requests/create')
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="font-headline-md text-headline-md text-primary mb-2">Request a Skill</h1>
        <p className="text-on-surface-variant font-body-md text-body-md">
          Need a hand with something? Broadcast it to the community.
        </p>
      </div>

      <div className="bg-surface border border-surface-variant rounded-3xl p-6 sm:p-8 shadow-sm">
        <CreateRequestForm />
      </div>
    </div>
  )
}
