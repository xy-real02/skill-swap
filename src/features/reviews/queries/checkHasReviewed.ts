import { createClient } from '@/lib/supabase/server'

/**
 * Checks whether a user has already submitted a review for a given exchange.
 * Returns true if a review from reviewerId for exchangeId exists.
 */
export async function checkHasReviewed(exchangeId: string, reviewerId: string): Promise<boolean> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('reviews')
    .select('id')
    .eq('exchange_id', exchangeId)
    .eq('reviewer_id', reviewerId)
    .maybeSingle()

  return !!data
}
