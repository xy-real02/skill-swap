import { CreateListingForm } from '@/features/listings/components/CreateListingForm'
import { redirect } from 'next/navigation'

export default function CreateListingPage() {
  return (
    <>
      <div className="max-w-2xl mx-auto pt-6 pb-24">

      <div className="bg-surface-container-lowest rounded-xl warm-shadow p-6 md:p-8 border border-surface-variant">
        <CreateListingForm />
      </div>
      </div>
    </>
  )
}
