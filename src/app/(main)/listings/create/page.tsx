import { CreateListingForm } from '@/features/listings/components/CreateListingForm'
import { redirect } from 'next/navigation'

export default function CreateListingPage() {
  return (
    <>
      <div className="w-full max-w-2xl mx-auto pt-6 pb-24 px-margin-mobile md:px-0">
        <div className="bg-surface-container-lowest rounded-3xl p-6 md:p-8 border border-outline-variant/30 shadow-sm relative overflow-hidden">
          <CreateListingForm />
        </div>
      </div>
    </>
  )
}
