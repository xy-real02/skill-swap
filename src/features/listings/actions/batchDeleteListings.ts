'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function batchDeleteListings(listingIds: string[]) {
  if (!listingIds || listingIds.length === 0) return

  const supabase = await createClient()

  // Verify authentication
  const { data: authData } = await supabase.auth.getUser()
  if (!authData.user) {
    throw new Error('Not authenticated')
  }

  // Fetch listings to verify ownership
  const { data: listings, error: fetchError } = await supabase
    .from('listings')
    .select('id, owner_id')
    .in('id', listingIds)

  if (fetchError || !listings) {
    throw new Error('Failed to fetch listings')
  }

  // Verify ownership for all
  for (const item of listings) {
    if (item.owner_id !== authData.user.id) {
      throw new Error('Unauthorized: You can only delete your own listings')
    }
  }

  // Check which listings have associated exchanges
  const { data: exchanges } = await supabase
    .from('exchanges')
    .select('listing_id')
    .in('listing_id', listingIds)

  const listingsWithExchanges = new Set((exchanges || []).map(e => e.listing_id))
  
  const toArchive = listingIds.filter(id => listingsWithExchanges.has(id))
  const toDelete = listingIds.filter(id => !listingsWithExchanges.has(id))

  if (toArchive.length > 0) {
    const { error: softDeleteError } = await supabase
      .from('listings')
      .update({ status: 'Archived' })
      .in('id', toArchive)

    if (softDeleteError) {
      throw new Error(`Failed to archive listings: ${softDeleteError.message}`)
    }
  }

  if (toDelete.length > 0) {
    const { error: hardDeleteError } = await supabase
      .from('listings')
      .delete()
      .in('id', toDelete)

    if (hardDeleteError) {
      throw new Error(`Failed to delete listings: ${hardDeleteError.message}`)
    }
  }

  revalidatePath('/explore')
  revalidatePath('/listings')
}
