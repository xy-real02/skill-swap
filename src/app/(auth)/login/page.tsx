import { login } from './actions'
import Link from 'next/link'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string; error?: string }>
}) {
  const resolvedSearchParams = await searchParams
  const errorMessage = resolvedSearchParams?.message || resolvedSearchParams?.error

  return (
    <main className="min-h-screen py-12 bg-background flex flex-col items-center justify-center relative overflow-hidden font-body-md text-on-background">
      {/* Ambient Watermark */}
      <div className="fixed inset-0 pointer-events-none flex items-center justify-center select-none z-0 overflow-hidden">
        <span 
          className="text-primary opacity-[0.02] transform -rotate-12 select-none" 
          style={{ fontSize: '120vh', lineHeight: 1 }}
        >
          ↺
        </span>
      </div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-[420px] px-margin-mobile md:px-0 flex flex-col gap-md">
        
        {/* Error Warning */}
        {errorMessage && (
          <div className="bg-error-container rounded-lg p-sm flex items-start gap-sm border border-error/20 shadow-sm animate-fade-in-down">
            <span className="material-symbols-outlined text-on-error-container shrink-0 mt-[2px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              warning
            </span>
            <div className="flex flex-col gap-xs">
              <h3 className="font-label-md text-label-md text-on-error-container font-bold">Login Failed</h3>
              <p className="font-body-md text-body-md text-on-error-container/90 text-sm">
                {errorMessage}
              </p>
            </div>
          </div>
        )}

        {/* Login Card */}
        <div className="bg-surface-container-lowest rounded-xl shadow-[0_4px_20px_0_rgba(45,106,79,0.08)] p-lg flex flex-col gap-lg border border-surface-variant/50">
          
          {/* Header */}
          <div className="flex flex-col items-center text-center gap-xs">
            <div className="w-12 h-12 bg-secondary-container rounded-full flex items-center justify-center mb-sm text-primary">
              <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                handshake
              </span>
            </div>
            <h1 className="font-headline-md text-headline-md text-primary">Welcome Back</h1>
            <p className="font-body-md text-body-md text-on-surface-variant">Continue to your digital town square.</p>
          </div>

          {/* Form */}
          <form action={login} className="flex flex-col gap-md">
            {/* Email Input */}
            <div className="flex flex-col gap-xs">
              <label className="font-label-sm text-label-sm text-on-surface uppercase tracking-wider" htmlFor="email">
                Email Address
              </label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-outline-variant group-focus-within:text-primary transition-colors">
                  mail
                </span>
                <input 
                  id="email" 
                  name="email"
                  type="email" 
                  placeholder="neighbor@example.com" 
                  required 
                  className="w-full bg-surface-container-lowest border-[1.5px] border-secondary-fixed-dim rounded-lg pl-10 pr-sm py-sm font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-[3px] focus:ring-tertiary-fixed-dim/20 transition-all placeholder:text-outline-variant/60" 
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="flex flex-col gap-xs">
              <div className="flex justify-between items-center">
                <label className="font-label-sm text-label-sm text-on-surface uppercase tracking-wider" htmlFor="password">
                  Password
                </label>
                <Link href="#" className="font-label-sm text-label-sm text-primary hover:text-surface-tint underline decoration-primary/30 underline-offset-2 transition-all">
                  Forgot password?
                </Link>
              </div>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-outline-variant group-focus-within:text-primary transition-colors">
                  lock
                </span>
                <input 
                  id="password" 
                  name="password"
                  type="password" 
                  placeholder="••••••••" 
                  required 
                  className="w-full bg-surface-container-lowest border-[1.5px] border-secondary-fixed-dim rounded-lg pl-10 pr-sm py-sm font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-[3px] focus:ring-tertiary-fixed-dim/20 transition-all placeholder:text-outline-variant/60" 
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-sm mt-sm">
              <button 
                type="submit"
                className="w-full bg-primary text-on-primary rounded-lg py-[14px] font-label-md text-label-md font-bold hover:bg-surface-tint focus:outline-none focus:ring-[3px] focus:ring-primary/30 transition-all active:scale-[0.98] shadow-sm flex items-center justify-center gap-xs" 
              >
                Sign in
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
              <Link 
                href="/register"
                className="w-full bg-transparent text-primary border-[1.5px] border-secondary-fixed-dim rounded-lg py-[14px] font-label-md text-label-md font-bold hover:bg-secondary-container/30 hover:border-primary focus:outline-none focus:ring-[3px] focus:ring-primary/20 transition-all active:scale-[0.98] flex items-center justify-center"
              >
                Create an account
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}