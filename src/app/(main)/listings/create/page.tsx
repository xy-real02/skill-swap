import { CreateListingForm } from '@/features/listings/components/CreateListingForm'
import Link from 'next/link'

export default function CreateListingPage() {
  return (
    <div className="max-w-2xl mx-auto pb-24">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-on-surface-variant font-label-sm text-label-sm mb-lg">
        <Link href="/explore" className="hover:text-primary transition-colors">Explore</Link>
        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        <span className="text-on-surface font-bold">Share a Skill</span>
      </nav>

      <div className="mb-8">
        <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-primary mb-2">
          Share a Skill
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant">
          Offer your expertise to the community. Fill out the details below to post your skill listing.
        </p>
      </div>

      <div className="bg-surface-container-lowest rounded-xl warm-shadow p-6 md:p-8 border border-surface-variant">
        <CreateListingForm />
      </div>
    </div>
  )
}
