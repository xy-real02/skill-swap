'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createRequest } from '../actions/createRequest'
import { Button } from '@/components/ui/Button'

export function CreateRequestForm() {
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const categories = [
    'Home Repair', 'Education', 'Gardening', 'Tech Support', 'Culinary',
    'Arts & Crafts', 'Fitness', 'Pet Care', 'Language', 'Other'
  ]

  async function onSubmit(formData: FormData) {
    setError(null)
    
    startTransition(async () => {
      const result = await createRequest(formData)
      if (result.error) {
        setError(result.error)
      } else {
        router.push('/explore?tab=requests')
      }
    })
  }

  return (
    <form action={onSubmit} className="flex flex-col gap-6">
      {error && (
        <div className="bg-error-container text-on-error-container p-4 rounded-xl text-body-md border border-error/20 flex gap-3">
          <span className="material-symbols-outlined shrink-0">error</span>
          <p>{error}</p>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <label htmlFor="title" className="font-label-md text-on-surface font-bold">Request Title *</label>
        <input 
          type="text" 
          id="title" 
          name="title" 
          required 
          minLength={5}
          maxLength={100}
          className="bg-surface-container-lowest border border-outline-variant rounded-xl py-3 px-4 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-body-md text-on-surface"
          placeholder="e.g. Need help fixing a leaky faucet"
        />
        <p className="text-label-sm text-on-surface-variant">Be specific so others know exactly what you need.</p>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="category" className="font-label-md text-on-surface font-bold">Category *</label>
        <div className="relative">
          <select 
            id="category" 
            name="category" 
            required 
            className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl py-3 px-4 appearance-none focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-body-md text-on-surface"
          >
            <option value="" disabled selected>Select a category</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-outline-variant pointer-events-none">expand_more</span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="description" className="font-label-md text-on-surface font-bold">Detailed Description *</label>
        <textarea 
          id="description" 
          name="description" 
          required 
          minLength={20}
          maxLength={1000}
          rows={5}
          className="bg-surface-container-lowest border border-outline-variant rounded-xl py-3 px-4 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-body-md text-on-surface resize-y"
          placeholder="Describe exactly what you need help with. The more details, the better!"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="offered_in_return" className="font-label-md text-on-surface font-bold">What I Can Offer in Return *</label>
        <textarea 
          id="offered_in_return" 
          name="offered_in_return" 
          required 
          maxLength={500}
          rows={3}
          className="bg-surface-container-lowest border border-outline-variant rounded-xl py-3 px-4 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-body-md text-on-surface resize-y"
          placeholder="e.g. I can bake a batch of cookies, or offer 1 hour of Spanish tutoring."
        />
        <p className="text-label-sm text-on-surface-variant text-primary font-bold">Note: You must have an Active skill listing to post a request.</p>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="desired_timeframe" className="font-label-md text-on-surface font-bold">Desired Timeframe</label>
        <input 
          type="text" 
          id="desired_timeframe" 
          name="desired_timeframe" 
          maxLength={100}
          className="bg-surface-container-lowest border border-outline-variant rounded-xl py-3 px-4 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-body-md text-on-surface"
          placeholder="e.g. Sometime this weekend, or evenings next week"
        />
      </div>

      <div className="pt-6 border-t border-outline-variant/30 flex justify-end gap-4">
        <Button 
          type="button" 
          variant="ghost" 
          onClick={() => router.back()}
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          variant="primary" 
          disabled={isPending}
          className="min-w-[160px] flex items-center justify-center gap-2"
        >
          {isPending && <span className="material-symbols-outlined animate-spin">sync</span>}
          {isPending ? 'Posting...' : 'Post Request'}
        </Button>
      </div>
    </form>
  )
}
