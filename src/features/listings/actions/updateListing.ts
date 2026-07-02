'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { stripHtml } from '@/utils/sanitize'

export async function updateListing(listingId: string, formData: FormData) {
  const supabase = await createClient()

  // 1. Authenticate user
  const { data: authData, error: authError } = await supabase.auth.getUser()
  if (authError || !authData.user) {
    return { error: 'You must be logged in to update a listing.' }
  }
  const userId = authData.user.id

  // 2. Extract and validate input data
  const title = stripHtml(formData.get('title'))
  const category = stripHtml(formData.get('category'))
  const description = stripHtml(formData.get('description'))
  const availability = formData.get('availability') ? stripHtml(formData.get('availability')) || null : null
  const exchange_preference = formData.get('exchange_preference') ? stripHtml(formData.get('exchange_preference')) || null : null
  const location_note = formData.get('location_note') ? stripHtml(formData.get('location_note')) || null : null

  if (!title || title.length > 80) {
    return { error: 'Title must be between 1 and 80 characters.' }
  }
  if (!description || description.length > 500) {
    return { error: 'Description must be between 1 and 500 characters.' }
  }
  if (!category) {
    return { error: 'Category is required.' }
  }

  // 3. Verify ownership and check if listing exists
  const { data: existing, error: existingError } = await supabase
    .from('listings')
    .select('owner_id')
    .eq('id', listingId)
    .single()

  if (existingError || !existing) {
    return { error: 'Listing not found.' }
  }
  if (existing.owner_id !== userId) {
    return { error: 'You are not authorized to edit this listing.' }
  }

  // 4. Update the listing
  const { data, error } = await supabase
    .from('listings')
    .update({
      title,
      category,
      description,
      availability,
      exchange_preference,
      location_note,
    })
    .eq('id', listingId)
    .select()
    .single()

  if (error) {
    return { error: 'Failed to update listing. Please try again.' }
  }

  revalidatePath('/explore')
  revalidatePath('/dashboard')
  revalidatePath(`/explore/listings/${listingId}`)

  return { data }
}
