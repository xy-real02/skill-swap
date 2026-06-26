'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()

  const { data: authData } = await supabase.auth.getUser()
  if (!authData.user) {
    return { error: 'Not authenticated' }
  }

  const full_name = formData.get('full_name') as string
  const bio = formData.get('bio') as string | null
  const rawZone = (formData.get('community_zone') as string) || ''
  const community_zone = rawZone
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ')
  const phone_number = formData.get('phone_number') as string | null

  if (!full_name || full_name.trim().length < 2) {
    return { error: 'Full name is required and must be at least 2 characters.' }
  }

  if (!community_zone) {
    return { error: 'Community Zone is required.' }
  }

  const { error } = await supabase
    .from('profiles')
    .update({
      full_name: full_name.trim(),
      bio: bio ? bio.trim() : null,
      community_zone,
      phone_number: phone_number ? phone_number.trim() : null,
    })
    .eq('id', authData.user.id)

  if (error) {
    console.error('Error updating profile:', error)
    return { error: 'Failed to update profile. Please try again.' }
  }

  revalidatePath('/profile/me')
  revalidatePath(`/profile/${authData.user.id}`)
  
  return { success: true }
}
