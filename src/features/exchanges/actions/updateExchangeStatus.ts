'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateExchangeStatus(exchangeId: string, newStatus: string) {
  const supabase = await createClient()

  const { data: authData, error: authError } = await supabase.auth.getUser()
  if (authError || !authData.user) {
    return { error: 'You must be logged in.' }
  }

  // 1. Fetch exchange to verify permissions
  const { data: exchange, error: fetchError } = await supabase
    .from('exchanges')
    .select('provider_id, requester_id, status')
    .eq('id', exchangeId)
    .single()

  if (fetchError || !exchange) {
    return { error: 'Exchange not found.' }
  }

  const isProvider = authData.user.id === exchange.provider_id
  const isRequester = authData.user.id === exchange.requester_id

  if (!isProvider && !isRequester) {
    return { error: 'You do not have permission to update this exchange.' }
  }

  // Basic validation rules
  if (newStatus === 'Accepted' && !isProvider) {
    return { error: 'Only the provider can accept a proposal.' }
  }

  // 2. Update status
  const { error: updateError } = await supabase
    .from('exchanges')
    .update({ status: newStatus })
    .eq('id', exchangeId)

  if (updateError) {
    console.error('Error updating status:', updateError)
    return { error: 'Failed to update status. Please try again.' }
  }

  // 3. Revalidate
  revalidatePath('/exchanges')
  revalidatePath(`/exchanges/${exchangeId}`)
  
  return { success: true }
}
