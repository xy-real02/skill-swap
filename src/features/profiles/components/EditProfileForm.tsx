'use client'

import { useState } from 'react'
import { Profile } from '@/features/profiles/queries/getProfile'
import { updateProfile } from '@/features/profiles/actions/updateProfile'
import { Button } from '@/components/ui/Button'
import { useRouter } from 'next/navigation'

export function EditProfileForm({
  profile,
  zones,
}: {
  profile: Profile
  zones: string[]
}) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsPending(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const result = await updateProfile(formData)

    if (result.error) {
      setError(result.error)
      setIsPending(false)
    } else {
      router.replace(`/profile/${profile.id}`)
    }
  }

  return (
    <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30 p-6 md:p-8">
      {error && (
        <div className="mb-6 p-4 bg-error/10 border-[1.5px] border-error/20 rounded-xl flex items-center gap-3 text-error font-body-md">
          <span className="material-symbols-outlined">error</span>
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Full Name */}
        <div className="flex flex-col gap-2">
          <label htmlFor="full_name" className="font-label-md text-label-md font-bold text-on-surface">
            Full Name <span className="text-error">*</span>
          </label>
          <input
            id="full_name"
            name="full_name"
            type="text"
            required
            defaultValue={profile.full_name}
            className="bg-surface border-[1.5px] border-outline-variant rounded-xl px-4 py-3 font-body-md text-on-surface focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
            placeholder="e.g. Maria Clara"
          />
        </div>

        {/* Community Zone */}
        <div className="flex flex-col gap-2">
          <label htmlFor="community_zone" className="font-label-md text-label-md font-bold text-on-surface">
            Community Zone / Barangay <span className="text-error">*</span>
          </label>
          <div className="relative">
            <select
              id="community_zone"
              name="community_zone"
              required
              defaultValue={profile.community_zone}
              className="w-full appearance-none bg-surface border-[1.5px] border-outline-variant rounded-xl px-4 py-3 font-body-md text-on-surface focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
            >
              <option value="" disabled>Select your neighborhood...</option>
              {zones.map(zone => (
                <option key={zone} value={zone}>{zone}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-on-surface-variant">
              <span className="material-symbols-outlined">expand_more</span>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="flex flex-col gap-2">
          <label htmlFor="bio" className="font-label-md text-label-md font-bold text-on-surface">
            About Me
          </label>
          <p className="font-label-sm text-label-sm text-on-surface-variant mb-1">
            Tell your neighbors a bit about yourself and what you like to do.
          </p>
          <textarea
            id="bio"
            name="bio"
            rows={4}
            defaultValue={profile.bio || ''}
            className="bg-surface border-[1.5px] border-outline-variant rounded-xl px-4 py-3 font-body-md text-on-surface focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none resize-y"
            placeholder="I've been baking for 10 years and love exchanging pastries for gardening help!"
          />
        </div>

        {/* Phone Number */}
        <div className="flex flex-col gap-2">
          <label htmlFor="phone_number" className="font-label-md text-label-md font-bold text-on-surface">
            Phone Number (Optional)
          </label>
          <p className="font-label-sm text-label-sm text-on-surface-variant mb-1">
            Only visible to you. Will not be shared publicly.
          </p>
          <input
            id="phone_number"
            name="phone_number"
            type="tel"
            defaultValue={profile.phone_number || ''}
            className="bg-surface border-[1.5px] border-outline-variant rounded-xl px-4 py-3 font-body-md text-on-surface focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
            placeholder="09XX XXX XXXX"
          />
        </div>

        {/* Actions */}
        <div className="pt-4 flex flex-col sm:flex-row gap-4 items-center sm:justify-end border-t border-outline-variant/30">
          <Button 
            type="button" 
            variant="ghost" 
            className="w-full sm:w-auto"
            onClick={() => router.back()}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="primary" 
            className="w-full sm:w-auto min-w-[140px] flex items-center justify-center gap-2"
            disabled={isPending}
          >
            <span className={`material-symbols-outlined ${isPending ? 'animate-spin' : ''}`}>
              {isPending ? 'sync' : 'save'}
            </span>
            {isPending ? 'Saving...' : 'Save Profile'}
          </Button>
        </div>
      </form>
    </div>
  )
}
