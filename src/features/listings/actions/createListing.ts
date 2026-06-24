'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createListing(formData: FormData) {
  const supabase = await createClient()

  // 1. Authenticate user
  const { data: authData, error: authError } = await supabase.auth.getUser()
  if (authError || !authData.user) {
    return { error: 'You must be logged in to create a listing.' }
  }
  const userId = authData.user.id

  // 2. Extract and validate input data
  const title = formData.get('title') as string
  const category = formData.get('category') as string
  const description = formData.get('description') as string
  const availability = formData.get('availability') as string | null
  const exchange_preference = formData.get('exchange_preference') as string | null
  const location_note = formData.get('location_note') as string | null

  if (!title || title.length > 80) {
    return { error: 'Title must be between 1 and 80 characters.' }
  }
  if (!description || description.length > 500) {
    return { error: 'Description must be between 1 and 500 characters.' }
  }
  if (!category) {
    return { error: 'Category is required.' }
  }

  // 3. Enforce max listings per user
  // Fetch community settings to get the limit, fallback to 5
  const { data: settings } = await supabase
    .from('community_settings')
    .select('max_listings_per_user')
    .maybeSingle()
  const maxListings = settings?.max_listings_per_user ?? 5

  // Fetch current user's active/paused listings count
  const { count, error: countError } = await supabase
    .from('listings')
    .select('*', { count: 'exact', head: true })
    .eq('owner_id', userId)
    .neq('status', 'Archived')

  if (countError) {
    return { error: 'Failed to verify listing limit.' }
  }

  if (count !== null && count >= maxListings) {
    return { error: `You have reached the maximum allowed listings (${maxListings}). Please pause or archive an existing listing to create a new one.` }
  }

  // 4. Prevent duplicate listings
  const { data: existingListing } = await supabase
    .from('listings')
    .select('id')
    .eq('owner_id', userId)
    .eq('title', title)
    .eq('category', category)
    .eq('status', 'Active')
    .maybeSingle()

  if (existingListing) {
    return { error: 'You already have an active listing with this title in this category.' }
  }

  // 5. Insert the new listing
  const { data, error } = await supabase
    .from('listings')
    .insert({
      owner_id: userId,
      title,
      category,
      description,
      availability,
      exchange_preference,
      location_note,
      status: 'Active',
    })
    .select()
    .single()

  if (error) {
    return { error: 'Failed to create listing. Please try again.' }
  }

  // 6. Revalidate explore page to show new listing
  revalidatePath('/explore')

  return { data }
}
