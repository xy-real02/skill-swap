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
    <>
      <div className="max-w-3xl mx-auto pt-6 pb-24 px-margin-mobile md:px-0">
        <div className="bg-surface border border-surface-variant rounded-3xl p-6 sm:p-8 shadow-sm">
          <CreateRequestForm />
        </div>
      </div>
    </>
  )
}
