'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function pauseListing(listingId: string, targetStatus: 'Active' | 'Paused') {
  const supabase = await createClient()

  const { data: authData, error: authError } = await supabase.auth.getUser()
  if (authError || !authData.user) {
    return { error: 'You must be logged in to modify listing status.' }
  }
  const userId = authData.user.id

  const { data: existing, error: existingError } = await supabase
    .from('listings')
    .select('owner_id, status')
    .eq('id', listingId)
    .single()

  if (existingError || !existing) {
    return { error: 'Listing not found.' }
  }
  if (existing.owner_id !== userId) {
    return { error: 'You are not authorized to modify this listing.' }
  }

  const { data, error } = await supabase
    .from('listings')
    .update({ status: targetStatus })
    .eq('id', listingId)
    .select()
    .single()

  if (error) {
    return { error: 'Failed to update listing status.' }
  }

  revalidatePath('/explore')
  revalidatePath('/dashboard')

  return { data }
}
