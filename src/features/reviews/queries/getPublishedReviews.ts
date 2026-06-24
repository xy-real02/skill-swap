import { createClient } from '@/lib/supabase/server'
import { Database } from '@/types/database.types'

type ReviewRow = Database['public']['Tables']['reviews']['Row']
type ProfileRow = Database['public']['Tables']['profiles']['Row']

export type ReviewWithReviewer = ReviewRow & {
  reviewer: Pick<ProfileRow, 'id' | 'full_name' | 'avatar_url'> | null
}

export async function getPublishedReviews(targetId: string): Promise<ReviewWithReviewer[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('reviews')
    .select(`
      *,
      reviewer:reviewer_id (
        id,
        full_name,
        avatar_url
      )
    `)
    .eq('target_id', targetId)
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching published reviews:', error)
    return []
  }

  return data as unknown as ReviewWithReviewer[]
}
