'use server'

import { createClient } from '@/lib/supabase/server'

export async function submitReport({
  targetId,
  targetType,
  reason,
  details,
}: {
  targetId: string
  targetType: string
  reason: string
  details?: string
}) {
  const supabase = await createClient()

  // 1. Authenticate
  const { data: authData, error: authError } = await supabase.auth.getUser()
  if (authError || !authData.user) {
    return { error: 'You must be logged in to report content.' }
  }

  const reporterId = authData.user.id

  // 2. Validate input
  if (!targetId || !targetType || !reason) {
    return { error: 'Missing required report fields.' }
  }

  const normalizedType = targetType.toLowerCase()
  const trimmedDetails = details ? details.trim().slice(0, 300) : null

  // 3. Prevent self-reporting
  if (normalizedType === 'profile' && targetId === reporterId) {
    return { error: 'You cannot report your own profile.' }
  }
  if (normalizedType === 'listing') {
    const { data: item } = await supabase
      .from('listings')
      .select('owner_id')
      .eq('id', targetId)
      .single()
    if (item?.owner_id === reporterId) {
      return { error: 'You cannot report your own listing.' }
    }
  }
  if (normalizedType === 'request') {
    const { data: item } = await supabase
      .from('requests')
      .select('owner_id')
      .eq('id', targetId)
      .single()
    if (item?.owner_id === reporterId) {
      return { error: 'You cannot report your own request.' }
    }
  }

  // 4. Check for existing open report by this user on this target
  const { data: existing } = await supabase
    .from('reports')
    .select('id')
    .eq('reporter_id', reporterId)
    .eq('target_id', targetId)
    .eq('status', 'open')
    .maybeSingle()

  if (existing) {
    return { error: 'You already have an open report pending for this content.' }
  }

  // 5. Insert report
  const { error: insertError } = await supabase.from('reports').insert({
    reporter_id: reporterId,
    target_id: targetId,
    target_type: normalizedType,
    reason,
    details: trimmedDetails,
    status: 'open',
  })

  if (insertError) {
    console.error('Submit report error:', insertError)
    return { error: insertError.message || 'Failed to submit report.' }
  }

  return { success: true }
}
