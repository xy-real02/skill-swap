'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function submitReview(formData: FormData) {
  const supabase = await createClient()

  const { data: authData } = await supabase.auth.getUser()
  if (!authData.user) {
    return { error: 'Not authenticated' }
  }

  const exchange_id = formData.get('exchange_id') as string
  const target_id = formData.get('target_id') as string
  const ratingStr = formData.get('rating') as string
  const comment = formData.get('comment') as string | null

  if (!exchange_id || !target_id || !ratingStr) {
    return { error: 'Missing required fields.' }
  }

  const rating = parseInt(ratingStr, 10)
  if (isNaN(rating) || rating < 1 || rating > 5) {
    return { error: 'Rating must be between 1 and 5.' }
  }

  // Ensure they haven't already reviewed
  const { data: existingReview } = await supabase
    .from('reviews')
    .select('id')
    .eq('exchange_id', exchange_id)
    .eq('reviewer_id', authData.user.id)
    .single()

  if (existingReview) {
    return { error: 'You have already submitted a review for this exchange.' }
  }

  const { error } = await supabase
    .from('reviews')
    .insert({
      exchange_id,
      target_id,
      reviewer_id: authData.user.id,
      rating,
      comment: comment ? comment.trim() : null,
    })

  if (error) {
    console.error('Error submitting review:', error)
    return { error: 'Failed to submit review. Please try again.' }
  }

  revalidatePath(`/exchanges/${exchange_id}`)
  revalidatePath(`/profile/${target_id}`)
  
  return { success: true }
}
