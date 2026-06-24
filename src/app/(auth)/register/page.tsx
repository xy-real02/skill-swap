import RegisterForm from './RegisterForm'

export default function RegisterPage({
  searchParams,
}: {
  searchParams: { error?: string; success?: string }
}) {
  return (
    <main className="min-h-screen bg-surface flex flex-col items-center justify-center relative overflow-hidden font-body-md text-body-md text-on-surface">
      {/* Watermark Motif */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <span className="text-[400px] text-primary opacity-5 font-bold leading-none select-none">↺</span>
      </div>

      <div className="relative z-20 mb-4 w-full max-w-[480px] px-margin-mobile">
        {searchParams?.error && (
          <div className="p-4 bg-error-container text-on-error-container rounded mb-4">
            {searchParams.error === 'email_taken'
              ? 'That email is already registered. Try logging in.'
              : searchParams.error === 'invalid_email'
              ? 'Please provide a valid email address.'
              : searchParams.error === 'password_too_short'
              ? 'Password must be at least 8 characters long.'
              : searchParams.error === 'full_name_required'
              ? 'Please provide your full name.'
              : 'An error occurred during registration. Please try again.'}
          </div>
        )}

        {searchParams?.success === 'check_email' && (
          <div className="p-4 bg-primary-container text-on-primary-container rounded mb-4 text-center">
            Registration successful! Please check your email to verify your account.
          </div>
        )}
      </div>

      {searchParams?.success !== 'check_email' && <RegisterForm />}
    </main>
  )
}
