'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function cancelRequest(requestId: string) {
  const supabase = await createClient()

  const { data: authData, error: authError } = await supabase.auth.getUser()
  if (authError || !authData.user) {
    return { error: 'You must be logged in to cancel a request.' }
  }
  const userId = authData.user.id

  const { data: existing, error: existingError } = await supabase
    .from('requests')
    .select('owner_id, status')
    .eq('id', requestId)
    .single()

  if (existingError || !existing) {
    return { error: 'Request not found.' }
  }
  if (existing.owner_id !== userId) {
    return { error: 'You are not authorized to cancel this request.' }
  }
  if (existing.status !== 'Active') {
    return { error: 'Request is no longer active.' }
  }

  const { data, error } = await supabase
    .from('requests')
    .update({ status: 'Cancelled' })
    .eq('id', requestId)
    .select()
    .single()

  if (error) {
    return { error: 'Failed to cancel request. Please try again.' }
  }

  revalidatePath('/explore')
  revalidatePath('/dashboard')

  return { data }
}
