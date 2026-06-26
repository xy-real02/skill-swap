'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createListing } from '@/features/listings/actions/createListing'
import { PLATFORM_CATEGORIES } from '@/lib/categories'

export function CreateListingForm() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    try {
      const result = await createListing(formData)
      if (result.error) {
        setError(result.error)
        setLoading(false)
      } else {
        router.push('/listings')
        router.refresh()
      }
    } catch (err) {
      setError('An unexpected error occurred.')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl bg-surface-container-lowest p-6 sm:p-8 rounded-xl border border-outline-variant/30 shadow-sm">
      {error && (
        <div className="p-4 bg-error-container text-on-error-container rounded-lg font-body-md text-sm">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="title" className="block font-label-md text-label-md text-on-surface mb-2">
          Listing Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          maxLength={100}
          className="input-field"
          placeholder="e.g., Professional Plumbing & Leak Repair"
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
          {loading ? 'Posting...' : 'Share Skill'}
        </button>
      </div>
    </form>
  )
}
