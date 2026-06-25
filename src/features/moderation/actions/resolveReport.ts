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

  // 1. Authenticate & Verify Role
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

  // 2. Fetch Report
  const { data: report, error: reportError } = await adminClient
    .from('reports')
    .select('*')
    .eq('id', reportId)
    .single()

  if (reportError || !report) {
    return { error: 'Report not found.' }
  }

  // Determine target user ID
  let targetUserId = report.reporter_id // fallback
  if (report.target_type === 'Profile') {
    targetUserId = report.target_id
  } else if (report.target_type === 'Listing') {
    const { data: item } = await adminClient.from('listings').select('owner_id').eq('id', report.target_id).single()
    if (item?.owner_id) targetUserId = item.owner_id
  } else if (report.target_type === 'Request') {
    const { data: item } = await adminClient.from('requests').select('owner_id').eq('id', report.target_id).single()
    if (item?.owner_id) targetUserId = item.owner_id
  }

  const trimmedNote = resolutionNote.trim() || `Action: ${action}`
  let finalStatus = 'Resolved'

  // 3. Execute Action
  if (action === 'Dismiss') {
    finalStatus = 'Dismissed'
  } else if (action === 'DeleteContent') {
    finalStatus = 'Content Deleted'
    if (report.target_type === 'Listing') {
      await adminClient.from('listings').delete().eq('id', report.target_id)
    } else if (report.target_type === 'Request') {
      await adminClient.from('requests').delete().eq('id', report.target_id)
    }
  } else if (action === 'BanUser') {
    finalStatus = 'User Banned'
    // Prevent banning admins
    const { data: targetProfile } = await adminClient.from('profiles').select('role').eq('id', targetUserId).single()
    if (targetProfile?.role?.toLowerCase() === 'admin') {
      return { error: 'Cannot ban platform administrator.' }
    }
    await adminClient.from('profiles').update({ status: 'banned' }).eq('id', targetUserId)
  }

  // 4. Update Report
  await adminClient
    .from('reports')
    .update({
      status: finalStatus,
      resolved_by: user.id,
      resolution_note: trimmedNote,
      resolved_at: new Date().toISOString(),
    })
    .eq('id', reportId)

  // 5. Audit Log
  await adminClient.from('moderation_log').insert({
    moderator_id: user.id,
    target_user_id: targetUserId,
    target_content_id: report.target_id,
    action: action === 'Dismiss' ? 'Report Dismissed' : action === 'DeleteContent' ? 'Content Deleted' : 'User Banned',
    reason: trimmedNote,
  })

  revalidatePath('/moderator/queue')
  revalidatePath('/moderator/history')
  return { success: true }
}
