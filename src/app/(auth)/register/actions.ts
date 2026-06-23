'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

// Per spec: all text inputs must be trimmed and HTML-stripped before saving.
function sanitize(value: FormDataEntryValue | null): string {
  if (typeof value !== 'string') return ''
  return value.trim().replace(/<[^>]*>/g, '')
}

export async function register(formData: FormData) {
  const fullName = sanitize(formData.get('full_name'))
  const email = sanitize(formData.get('email'))
  const password = formData.get('password') as string

  // --- Input validation (server-side; client validates too but never trust it)
  if (!fullName) {
    redirect('/register?error=full_name_required')
  }

  if (fullName.length > 80) {
    redirect('/register?error=full_name_too_long')
  }

  if (!email || !email.includes('@')) {
    redirect('/register?error=invalid_email')
  }

  if (!password || password.length < 8) {
    redirect('/register?error=password_too_short')
  }

  // --- Supabase sign-up
  // The `data` object inside `options` is passed to the Supabase Auth user
  // metadata. The `on_auth_user_created` database trigger reads
  // `raw_user_meta_data->>'full_name'` and writes it to the `profiles` table.
  const supabase = await createClient()

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  })

  if (error) {
    // Map Supabase errors to user-friendly codes.
    // Never expose the raw Supabase message to the client (per spec).
    if (error.message.toLowerCase().includes('already registered') ||
        error.message.toLowerCase().includes('already exists') ||
        error.code === 'user_already_exists') {
      redirect('/register?error=email_taken')
    }
    redirect('/register?error=signup_failed')
  }

  // If Supabase email confirmation is enabled, the user lands on a
  // "check your email" page. If it is disabled (dev mode), they are
  // immediately signed in and can go to /explore.
  revalidatePath('/', 'layout')
  redirect('/register?success=check_email')
}
