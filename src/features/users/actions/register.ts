'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { stripHtml } from '@/utils/sanitize'
import type { AuthError } from '@supabase/supabase-js'

export async function register(formData: FormData) {
  const fullName = stripHtml(formData.get('full_name'))
  const email = stripHtml(formData.get('email'))
  const password = formData.get('password') as string
  const bio = stripHtml(formData.get('bio'))
  const rawZone = stripHtml(formData.get('community_zone'))
  const communityZone = rawZone
    .split(/\s+/)
    .filter(Boolean)
    .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ')
  const phoneNumber = stripHtml(formData.get('phone_number'))

  // --- Server-side validation
  if (!fullName) redirect('/register?error=full_name_required')
  if (fullName.length > 80) redirect('/register?error=full_name_too_long')
  if (!email || !email.includes('@')) redirect('/register?error=invalid_email')
  if (!password || password.length < 8) redirect('/register?error=password_too_short')

  const supabase = await createClient()

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        bio,
        community_zone: communityZone,
        phone_number: phoneNumber,
      },
    },
  })

  if (error) {
    const authError = error as AuthError
    console.error('[register] Supabase signUp error:', {
      message: authError.message,
      code: authError.code,
      status: authError.status,
    })

    if (
      authError.message.toLowerCase().includes('already registered') ||
      authError.message.toLowerCase().includes('already exists') ||
      authError.code === 'user_already_exists'
    ) {
      redirect('/register?error=email_taken')
    }
    redirect('/register?error=signup_failed')
  }

  if (data.user) {
    const file = formData.get('avatar_file') as File
    if (file && file.size > 0) {
      const fileExt = file.name.split('.').pop() || 'png'
      const filePath = `${data.user.id}/${Date.now()}.${fileExt}`
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true })
      if (!uploadError) {
        const {
          data: { publicUrl },
        } = supabase.storage.from('avatars').getPublicUrl(filePath)
        await supabase.from('profiles').update({ avatar_url: publicUrl }).eq('id', data.user.id)
      }
    }
  }

  revalidatePath('/', 'layout')

  if (data.session) {
    redirect('/explore')
  } else {
    redirect('/register?success=check_email')
  }
}
