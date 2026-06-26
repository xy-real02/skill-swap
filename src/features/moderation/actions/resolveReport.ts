'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

export async function resolveReport({
  reportId,
  action,
  resolutionNote,
}: {
  reportId: string
  action: 'Dismiss' | 'DeleteContent' | 'BanUser'
  resolutionNote: string
}) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const adminClient = createAdminClient()

  const { data: profile } = await adminClient
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const role = profile?.role?.toLowerCase()
  if (role !== 'moderator' && role !== 'admin') {
    return { error: 'You do not have permission to moderate reports.' }
  }

  const { data: report, error: reportError } = await adminClient
    .from('reports')
    .select('*')
    .eq('id', reportId)
    .single()

  if (reportError || !report) {
    return { error: 'Report not found.' }
  }

  const normType = report.target_type?.toLowerCase()
  let targetUserId = report.reporter_id

  if (normType === 'profile') {
    targetUserId = report.target_id
  } else if (normType === 'listing') {
    const { data: item } = await adminClient.from('listings').select('owner_id').eq('id', report.target_id).single()
    if (item?.owner_id) targetUserId = item.owner_id
  } else if (normType === 'request') {
    const { data: item } = await adminClient.from('requests').select('owner_id').eq('id', report.target_id).single()
    if (item?.owner_id) targetUserId = item.owner_id
  }

  // Guardrail: Prevent conflict of interest
  if (report.reporter_id === user.id || targetUserId === user.id) {
    return { error: 'Conflict of Interest: You cannot resolve reports filed by or against your own account or content.' }
  }

  const trimmedNote = resolutionNote.trim() || `Action taken: ${action}`
  let finalStatus = 'resolved'

  if (action === 'Dismiss') {
    finalStatus = 'dismissed'
  } else if (action === 'DeleteContent') {
    finalStatus = 'resolved'
    if (normType === 'listing') {
      await adminClient.from('listings').delete().eq('id', report.target_id)
    } else if (normType === 'request') {
      await adminClient.from('requests').delete().eq('id', report.target_id)
    }
  } else if (action === 'BanUser') {
    finalStatus = 'resolved'
    const { data: targetProfile } = await adminClient.from('profiles').select('role').eq('id', targetUserId).single()
    if (targetProfile?.role?.toLowerCase() === 'admin') {
      return { error: 'Cannot ban platform administrator.' }
    }
    await adminClient.from('profiles').update({ status: 'banned' }).eq('id', targetUserId)
  }

  const { error: updateErr } = await adminClient
    .from('reports')
    .update({
      status: finalStatus,
      resolved_by: user.id,
      resolution_note: trimmedNote,
      resolved_at: new Date().toISOString(),
    })
    .eq('id', reportId)

  if (updateErr) {
    console.error('resolveReport updateErr:', updateErr)
    return { error: 'Failed to update report status.' }
  }

  await adminClient.from('moderation_log').insert({
    moderator_id: user.id,
    target_user_id: targetUserId,
    target_content_id: report.target_id,
    action: action === 'Dismiss' ? 'report_dismissed' : action === 'DeleteContent' ? 'content_removed' : 'member_suspended',
    reason: trimmedNote,
  })

  revalidatePath('/moderator/queue')
  revalidatePath('/moderator/history')
  return { success: true }
}
