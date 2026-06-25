'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function deleteListing(listingId: string) {
  const supabase = await createClient()

  // Verify authentication
  const { data: authData } = await supabase.auth.getUser()
  if (!authData.user) {
    throw new Error('Not authenticated')
  }

  // Fetch the listing to verify ownership
  const { data: listing, error: fetchError } = await supabase
    .from('listings')
    .select('owner_id')
    .eq('id', listingId)
    .single()

  if (fetchError || !listing) {
    throw new Error('Listing not found')
  }

  if (listing.owner_id !== authData.user.id) {
    throw new Error('Unauthorized: You can only delete your own listings')
  }

  // Check if the listing has any associated exchanges
  const { data: exchanges, error: exchangesError } = await supabase
    .from('exchanges')
    .select('id')
    .eq('listing_id', listingId)
    .limit(1)

  if (exchangesError) {
    throw new Error('Failed to verify listing dependencies')
  }

  const hasExchanges = exchanges && exchanges.length > 0

  if (hasExchanges) {
    // Soft delete to preserve exchange history
    const { error: softDeleteError } = await supabase
      .from('listings')
      .update({ status: 'Archived' })
      .eq('id', listingId)

    if (softDeleteError) {
      throw new Error(`Failed to archive listing: ${softDeleteError.message}`)
    }
  } else {
    // Hard delete since there is no history tied to it
    const { error: hardDeleteError } = await supabase
      .from('listings')
      .delete()
      .eq('id', listingId)

    if (hardDeleteError) {
      throw new Error(`Failed to delete listing: ${hardDeleteError.message}`)
    }
  }

  // Revalidate and redirect
  revalidatePath('/explore')
  revalidatePath('/listings')
  redirect('/listings')
}
