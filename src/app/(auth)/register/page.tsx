import Link from 'next/link'
import { register } from './actions'

const ERROR_MESSAGES: Record<string, string> = {
  full_name_required: 'Please enter your full name.',
  full_name_too_long: 'Full name must be 80 characters or fewer.',
  invalid_email: 'Please enter a valid email address.',
  password_too_short: 'Password must be at least 8 characters.',
  email_taken: 'An account with this email already exists.',
  signup_failed: 'Could not create your account. Please try again.',
}

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>
}) {
  const { error, success } = await searchParams

  // After successful sign-up show a "check your email" screen instead of
  // the form — keeps the user from accidentally double-submitting.
  if (success === 'check_email') {
    return (
      <div className="w-full max-w-sm space-y-4 p-8 text-center">
        <div className="text-4xl">📬</div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Check your email
        </h1>
        <p className="text-sm text-slate-500">
          We sent a confirmation link to your inbox. Click it to activate your
          account, then come back to sign in.
        </p>
        <Link
          href="/login"
          className="inline-block w-full bg-blue-600 text-white rounded-md px-4 py-2 text-sm font-semibold hover:bg-blue-700 transition text-center"
        >
          Back to Sign In
        </Link>
      </div>
    )
  }

  return (
    <div className="w-full max-w-sm space-y-6 p-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Create an account
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Join your local SkillSwap community.
        </p>
      </div>

      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="full_name">
            Full Name
          </label>
          <input
            id="full_name"
            name="full_name"
            type="text"
            required
            maxLength={80}
            placeholder="Jane Doe"
            className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
            placeholder="••••••••"
            className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-slate-400 mt-1">At least 8 characters.</p>
        </div>

        <button
          formAction={register}
          className="w-full bg-blue-600 text-white rounded-md px-4 py-2 text-sm font-semibold hover:bg-blue-700 transition"
        >
          Create Account
        </button>
      </form>

      {error && (
        <p className="p-4 bg-red-100 text-red-700 text-center rounded-md text-sm">
          {ERROR_MESSAGES[error] ?? 'Something went wrong. Please try again.'}
        </p>
      )}

      <p className="text-center text-sm text-slate-500">
        Already have an account?{' '}
        <Link href="/login" className="text-blue-600 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  )
}
