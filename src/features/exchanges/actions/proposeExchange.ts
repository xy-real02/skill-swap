'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function proposeExchange(formData: FormData) {
  const supabase = await createClient()

  // 1. Authenticate user
  const { data: authData, error: authError } = await supabase.auth.getUser()
  if (authError || !authData.user) {
    return { error: 'You must be logged in to propose an exchange.' }
  }

  // 2. Extract and validate data
  const listing_id = formData.get('listing_id') as string | null
  const source_request_id = formData.get('source_request_id') as string | null
  const provider_id = formData.get('provider_id') as string
  const offered_skill = formData.get('offered_skill') as string
  const initial_message = formData.get('initial_message') as string

  if ((!listing_id && !source_request_id) || !provider_id || !offered_skill) {
    return { error: 'Missing required fields.' }
  }

  if (authData.user.id === provider_id) {
    return { error: 'You cannot propose an exchange on your own post.' }
  }

  if (offered_skill.length < 5) {
    return { error: 'Please describe the skill you are offering in a bit more detail (min 5 characters).' }
  }

  // 3. Check for duplicate proposals
  let existingExchangeQuery = supabase
    .from('exchanges')
    .select('id')
    .eq('requester_id', authData.user.id)
    .in('status', ['Pending', 'Accepted'])

  if (listing_id) {
    existingExchangeQuery = existingExchangeQuery.eq('listing_id', listing_id)
  } else if (source_request_id) {
    existingExchangeQuery = existingExchangeQuery.eq('source_request_id', source_request_id)
  }

  const { data: existingExchange } = await existingExchangeQuery.maybeSingle()

  if (existingExchange) {
    return { error: 'You already have an active proposal for this post.' }
  }

  // 4. Insert into exchanges table
  const { data: exchange, error: exchangeError } = await supabase
    .from('exchanges')
    .insert({
      listing_id: listing_id || null,
      source_request_id: source_request_id || null,
      provider_id,
      requester_id: authData.user.id,
      offered_skill,
      status: 'Pending'
    })
    .select('id')
    .single()

  if (exchangeError) {
    console.error('Error creating exchange:', exchangeError)
    return { error: 'Failed to propose exchange. Please try again.' }
  }

  // 5. Optionally insert initial message into messages table
  if (initial_message && initial_message.trim() !== '') {
    const { error: messageError } = await supabase
      .from('messages')
      .insert({
        exchange_id: exchange.id,
        sender_id: authData.user.id,
        content: initial_message.trim(),
        is_read: false
      })

    if (messageError) {
      console.error('Error creating initial message:', messageError)
      // We don't fail the whole action if the message fails, 
      // but ideally this would be a transaction or RPC.
    }
  }

  // 6. Revalidate and return success
  revalidatePath('/', 'layout')
  revalidatePath('/exchanges')
  if (listing_id) revalidatePath(`/listings/${listing_id}`)
  
  return { success: true, exchangeId: exchange.id }
}
