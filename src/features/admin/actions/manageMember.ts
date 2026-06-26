'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

export async function manageMember({
  targetUserId,
  action,
  newRole,
}: {
  targetUserId: string
  action: 'changeRole' | 'toggleBan'
  newRole?: 'Member' | 'Moderator' | 'Admin' | string
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const adminClient = createAdminClient()

  // Verify caller is admin
  const { data: caller } = await adminClient.from('profiles').select('role').eq('id', user.id).single()
  const callerRole = caller?.role?.toLowerCase()
  const isAuthorized = callerRole === 'admin'
  if (!isAuthorized) {
    return { error: 'Only platform administrators can modify user roles or status.' }
  }

  // Fetch target
  const { data: target, error } = await adminClient.from('profiles').select('role, status, full_name').eq('id', targetUserId).single()
  if (error || !target) {
    return { error: 'Member not found.' }
  }

  const currentRole = target.role?.toLowerCase() || 'member'

  if (action === 'changeRole' && newRole) {
    const formattedRole = newRole.toLowerCase() === 'admin' ? 'Admin' : newRole.toLowerCase() === 'moderator' ? 'Moderator' : 'Member'

    // ACTIVE-ADMIN SAFETY CHECK
    if (currentRole === 'admin' && formattedRole !== 'Admin') {
      const { count } = await adminClient
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .ilike('role', 'admin')

      if ((count || 0) <= 1) {
        return { error: 'CRITICAL: Cannot demote the last remaining active platform administrator.' }
      }
    }

    const { error: updateErr } = await adminClient
      .from('profiles')
      .update({ role: formattedRole })
      .eq('id', targetUserId)

    if (updateErr) {
      console.error('changeRole err:', updateErr)
      return { error: 'Failed to update member role.' }
    }

    await adminClient.from('moderation_log').insert({
      moderator_id: user.id,
      target_user_id: targetUserId,
      action: 'warning_issued',
      reason: `Role updated to ${formattedRole} for ${target.full_name}`,
    })
  } else if (action === 'toggleBan') {
    if (currentRole === 'admin') {
      return { error: 'Cannot suspend an active platform administrator. Demote them first.' }
    }

    const newStatus = target.status?.toLowerCase() === 'suspended' ? 'Active' : 'Suspended'
    const { error: banErr } = await adminClient
      .from('profiles')
      .update({ status: newStatus })
      .eq('id', targetUserId)

    if (banErr) {
      return { error: 'Failed to update member suspension status.' }
    }

    await adminClient.from('moderation_log').insert({
      moderator_id: user.id,
      target_user_id: targetUserId,
      action: newStatus === 'Suspended' ? 'member_suspended' : 'member_reinstated',
      reason: `Admin toggled account status for ${target.full_name}`,
    })
  }

  revalidatePath('/admin/members')
  return { success: true }
}
