import { CreateListingForm } from '@/features/listings/components/CreateListingForm'
import Link from 'next/link'
import { TopBar } from '@/components/layout/TopBar'

export default function CreateListingPage() {
  return (
    <>
      <TopBar 
        title="Share a Skill"
        description="Offer your expertise to the community. Fill out the details below to post your skill listing."
        backHref="/explore"
      />
      <div className="max-w-2xl mx-auto pt-6 pb-24">

      <div className="bg-surface-container-lowest rounded-xl warm-shadow p-6 md:p-8 border border-surface-variant">
        <CreateListingForm />
      </div>
      </div>
    </>
  )
}
