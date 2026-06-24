'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createRequest(formData: FormData) {
  const supabase = await createClient()

  // 1. Authenticate user
  const { data: authData, error: authError } = await supabase.auth.getUser()
  if (authError || !authData.user) {
    return { error: 'You must be logged in to create a request.' }
  }

  // 2. Extract and validate data
  const title = formData.get('title') as string
  const category = formData.get('category') as string
  const description = formData.get('description') as string
  const offered_in_return = formData.get('offered_in_return') as string
  const desired_timeframe = formData.get('desired_timeframe') as string

  if (!title || !category || !description || !offered_in_return) {
    return { error: 'Missing required fields.' }
  }

  if (title.length < 5) {
    return { error: 'Title must be at least 5 characters.' }
  }

  if (description.length < 20) {
    return { error: 'Description must be at least 20 characters.' }
  }

  // 3. Enforce the "must have at least one active listing" rule
  const { count, error: countError } = await supabase
    .from('listings')
    .select('*', { count: 'exact', head: true })
    .eq('owner_id', authData.user.id)
    .eq('status', 'Active')

  if (countError) {
    console.error('Error checking active listings:', countError)
    return { error: 'Failed to verify account status.' }
  }

  if (count === 0) {
    return { error: 'You must have at least one Active listing before you can post a Skill Request.' }
  }

  // 4. Calculate expiration date (30 days from now)
  const expires_at = new Date()
  expires_at.setDate(expires_at.getDate() + 30)

  // 5. Insert into requests table
  const { error: insertError } = await supabase
    .from('requests')
    .insert({
      owner_id: authData.user.id,
      title,
      category,
      description,
      offered_in_return,
      desired_timeframe: desired_timeframe || null,
      status: 'Active',
      expires_at: expires_at.toISOString()
    })

  if (insertError) {
    console.error('Error creating request:', insertError)
    return { error: 'Failed to create request. Please try again.' }
  }

  // 6. Revalidate and return success
  revalidatePath('/explore')
  revalidatePath('/profile')
  
  return { success: true }
}
