import { getListingById } from '@/features/listings/queries/getListingById'
import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { EditListingForm } from '@/features/listings/components/EditListingForm'

export default async function EditListingPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = await params
  
  const supabase = await createClient()
  const { data: authData } = await supabase.auth.getUser()
  if (!authData.user) {
    redirect('/login')
  }

  const listing = await getListingById(resolvedParams.id)

  if (!listing || listing.owner_id !== authData.user.id) {
    notFound()
  }

  return (
    <div className="w-full max-w-2xl mx-auto pt-6 pb-24 px-margin-mobile md:px-0">
      <div className="bg-surface-container-lowest rounded-3xl p-6 md:p-8 border border-outline-variant/30 shadow-sm relative overflow-hidden">
        <h1 className="text-2xl font-bold text-on-surface mb-6 font-display">Edit Skill Listing</h1>
        <EditListingForm listing={listing} />
      </div>
    </div>
  )
}
