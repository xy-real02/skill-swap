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
  newRole?: 'user' | 'moderator' | 'admin'
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const adminClient = createAdminClient()

  // Verify caller is admin
  const { data: caller } = await adminClient.from('profiles').select('role').eq('id', user.id).single()
  if (caller?.role?.toLowerCase() !== 'admin') {
    return { error: 'Only platform administrators can modify user roles or status.' }
  }

  // Fetch target
  const { data: target, error } = await adminClient.from('profiles').select('role, status, full_name').eq('id', targetUserId).single()
  if (error || !target) {
    return { error: 'Member not found.' }
  }

  const currentRole = target.role?.toLowerCase() || 'user'

  if (action === 'changeRole' && newRole) {
    // ACTIVE-ADMIN SAFETY CHECK
    if (currentRole === 'admin' && newRole !== 'admin') {
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
      .update({ role: newRole })
      .eq('id', targetUserId)

    if (updateErr) {
      console.error('changeRole err:', updateErr)
      return { error: 'Failed to update member role.' }
    }

    // Log action
    await adminClient.from('moderation_log').insert({
      moderator_id: user.id,
      target_user_id: targetUserId,
      action: `Role Changed to ${newRole.toUpperCase()}`,
      reason: `Admin updated role for ${target.full_name}`,
    })
  } else if (action === 'toggleBan') {
    if (currentRole === 'admin') {
      return { error: 'Cannot ban an active platform administrator. Demote them first.' }
    }

    const newStatus = target.status === 'banned' ? 'active' : 'banned'
    const { error: banErr } = await adminClient
      .from('profiles')
      .update({ status: newStatus })
      .eq('id', targetUserId)

    if (banErr) {
      return { error: 'Failed to update member ban status.' }
    }

    await adminClient.from('moderation_log').insert({
      moderator_id: user.id,
      target_user_id: targetUserId,
      action: newStatus === 'banned' ? 'User Banned' : 'User Unbanned',
      reason: `Admin toggled ban status for ${target.full_name}`,
    })
  }

  revalidatePath('/admin/members')
  return { success: true }
}
