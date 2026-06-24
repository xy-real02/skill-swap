'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createListing } from '@/features/listings/actions/createListing'

const CATEGORIES = [
  'Home Repair',
  'Education',
  'Gardening',
  'Tech Support',
  'Culinary',
  'Arts & Crafts',
  'Fitness',
  'Language',
  'Other'
]

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
      } else {
        router.push(`/listings/${result.data?.id}`)
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
        <div className="bg-error-container text-on-error-container p-4 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="title" className="block font-label-md text-label-md text-on-surface mb-2">
          Skill Title <span className="text-error">*</span>
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          maxLength={80}
          className="input-field"
          placeholder="e.g. Urban Balcony Gardening"
        />
        <p className="mt-1 text-xs text-on-surface-variant text-right">Max 80 characters</p>
      </div>

      <div>
        <label htmlFor="category" className="block font-label-md text-label-md text-on-surface mb-2">
          Category <span className="text-error">*</span>
        </label>
        <select
          id="category"
          name="category"
          required
          defaultValue=""
          className="input-field"
        >
          <option value="" disabled>Select a category...</option>
          {CATEGORIES.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="description" className="block font-label-md text-label-md text-on-surface mb-2">
          Description <span className="text-error">*</span>
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

      <div className="pt-4 border-t border-surface-variant">
        <button
          type="submit"
          disabled={loading}
          className="w-full btn-primary"
        >
          {loading ? 'Posting...' : 'Share Skill'}
        </button>
      </div>
    </form>
  )
}
