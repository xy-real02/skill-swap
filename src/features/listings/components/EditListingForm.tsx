'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateListing } from '@/features/listings/actions/updateListing'
import { PLATFORM_CATEGORIES } from '@/utils/constants'

export interface ListingEditData {
  id: string
  title: string
  category: string
  description: string
  availability?: string | null
  exchange_preference?: string | null
  location_note?: string | null
}

export function EditListingForm({ listing }: { listing: ListingEditData }) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    try {
      const result = await updateListing(listing.id, formData)
      if (result.error) {
        setError(result.error)
      } else {
        router.replace('/dashboard')
      }
    } catch (err) {
      setError('An unexpected error occurred.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 text-sm bg-error/10 border border-error/20 text-error rounded-lg">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="title" className="block font-label-md text-label-md text-on-surface mb-2">
          Skill Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          maxLength={80}
          defaultValue={listing.title}
          className="input-field"
          placeholder="e.g. Italian Cooking, Guitar Lessons, Gardening Tips"
        />
      </div>

      <div>
        <label htmlFor="category" className="block font-label-md text-label-md text-on-surface mb-2">
          Category
        </label>
        <select
          id="category"
          name="category"
          required
          defaultValue={listing.category}
          className="input-field"
        >
          <option value="">Select a category</option>
          {PLATFORM_CATEGORIES.map((cat) => (
            <option key={cat.name} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="description" className="block font-label-md text-label-md text-on-surface mb-2">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          required
          maxLength={500}
          rows={5}
          defaultValue={listing.description}
          className="input-field resize-none"
          placeholder="Describe your skill, what you can teach, and any requirements..."
        />
        <p className="mt-1 text-xs text-on-surface-variant text-right">Max 500 characters</p>
      </div>

      <div>
        <label htmlFor="availability" className="block font-label-md text-label-md text-on-surface mb-2">
          Availability (Optional)
        </label>
        <input
          id="availability"
          name="availability"
          type="text"
          defaultValue={listing.availability || ''}
          className="input-field"
          placeholder="e.g. Weekends, Wed Evenings, Flexible"
        />
      </div>

      <div>
        <label htmlFor="exchange_preference" className="block font-label-md text-label-md text-on-surface mb-2">
          What are you looking for? (Optional)
        </label>
        <input
          id="exchange_preference"
          name="exchange_preference"
          type="text"
          defaultValue={listing.exchange_preference || ''}
          className="input-field"
          placeholder="e.g. Bike maintenance, sourdough tips, open to anything"
        />
      </div>

      <div>
        <label htmlFor="location_note" className="block font-label-md text-label-md text-on-surface mb-2">
          Location Note (Optional)
        </label>
        <input
          id="location_note"
          name="location_note"
          type="text"
          defaultValue={listing.location_note || ''}
          className="input-field"
          placeholder="e.g. Downtown Arts District, Remote Only"
        />
        <p className="mt-2 text-xs text-on-surface-variant italic">
          Safety Tip: Never share your full address publicly. Only share when an exchange is confirmed.
        </p>
      </div>

      <div className="pt-6 border-t border-outline-variant/30 flex justify-end gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          disabled={loading}
          className="px-6 py-2.5 rounded-full font-label-md font-bold text-on-surface-variant hover:bg-surface-container transition-all"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="btn-primary"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  )
}
