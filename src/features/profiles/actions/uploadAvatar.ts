'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function uploadAvatar(formData: FormData) {
  const supabase = await createClient()

  const { data: authData } = await supabase.auth.getUser()
  if (!authData.user) {
    return { error: 'Not authenticated' }
  }
  const userId = authData.user.id

  const file = formData.get('avatar') as File | null
  if (!file || file.size === 0) {
    return { error: 'No file selected' }
  }

  if (file.size > 5 * 1024 * 1024) {
    return { error: 'Image size must be under 5MB.' }
  }

  if (!file.type.startsWith('image/')) {
    return { error: 'File must be an image.' }
  }

  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  const fileExt = file.name.split('.').pop() || 'png'
  const fileName = `${userId}-${Date.now()}.${fileExt}`

  let publicUrl = ''

  try {
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: true,
      })

    if (!uploadError) {
      const { data } = supabase.storage.from('avatars').getPublicUrl(fileName)
      publicUrl = data.publicUrl
    } else {
      throw uploadError
    }
  } catch (err) {
    // Fallback to base64 data URI if Supabase storage bucket 'avatars' is not provisioned
    const base64 = buffer.toString('base64')
    publicUrl = `data:${file.type};base64,${base64}`
  }

  const { error: dbError } = await supabase
    .from('profiles')
    .update({ avatar_url: publicUrl })
    .eq('id', userId)

  if (dbError) {
    console.error('Error updating avatar_url:', dbError)
    return { error: 'Failed to update profile avatar.' }
  }

  revalidatePath('/profile/me')
  revalidatePath(`/profile/${userId}`)
  revalidatePath('/dashboard')

  return { url: publicUrl }
}
