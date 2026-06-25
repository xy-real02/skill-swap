import RegisterForm from './RegisterForm'

import { createClient } from '@/lib/supabase/server'

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>
}) {
  const resolvedSearchParams = await searchParams
  const supabase = await createClient()
  
  // Try to fetch zones from settings, fallback to defaults if table is empty or errored
  const { data } = await supabase.from('community_settings').select('community_zone_list').maybeSingle()
  const zones = data?.community_zone_list?.length 
    ? data.community_zone_list 
    : ['Northside Hub', 'South Market', 'East Village', 'West End']

  return (
    <main className="min-h-screen bg-surface py-12 flex flex-col items-center justify-center relative overflow-hidden font-body-md text-body-md text-on-surface">
      {/* Watermark Motif */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <span className="text-[400px] text-primary opacity-5 font-bold leading-none select-none">↺</span>
      </div>

      <div className="relative z-20 mb-4 w-full max-w-[480px] px-margin-mobile">
        {resolvedSearchParams?.error && (
          <div className="p-4 bg-error-container text-on-error-container rounded mb-4">
            {resolvedSearchParams.error === 'email_taken'
              ? 'That email is already registered. Try logging in.'
              : resolvedSearchParams.error === 'invalid_email'
              ? 'Please provide a valid email address.'
              : resolvedSearchParams.error === 'password_too_short'
              ? 'Password must be at least 8 characters long.'
              : resolvedSearchParams.error === 'full_name_required'
              ? 'Please provide your full name.'
              : 'An error occurred during registration. Please try again.'}
          </div>
        )}

        {resolvedSearchParams?.success === 'check_email' && (
          <div className="p-4 bg-primary-container text-on-primary-container rounded mb-4 text-center">
            Registration successful! Please check your email to verify your account.
          </div>
        )}
      </div>

      {resolvedSearchParams?.success !== 'check_email' && <RegisterForm zones={zones} />}
    </main>
  )
}
