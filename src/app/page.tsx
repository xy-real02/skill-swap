import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { PLATFORM_CATEGORIES } from '@/utils/constants'

export default async function LandingPage() {
  // If a user is already logged in, bypass the landing page entirely
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (user) {
    redirect('/explore')
  }

  return (
    <main className="min-h-screen bg-background text-on-background flex flex-col relative overflow-x-hidden font-body-md selection:bg-primary-container selection:text-on-primary-container">
      {/* Ambient Glow Background */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[140px] pointer-events-none -z-10"></div>
      <div className="absolute -right-24 top-20 text-primary/5 rotate-12 pointer-events-none select-none hidden lg:block">
        <span className="material-symbols-outlined" style={{ fontSize: '480px' }}>handshake</span>
      </div>

      {/* Top Header / Nav */}
      <header className="w-full max-w-container-max mx-auto px-margin-mobile md:px-lg py-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary shadow-sm">
            <span className="material-symbols-outlined text-[24px]">swap_horiz</span>
          </div>
          <span className="font-headline-md text-2xl font-extrabold text-primary tracking-tight">SkillSwap</span>
        </div>
        <div className="flex items-center gap-3">
          <Link 
            href="/login" 
            className="px-5 py-2 rounded-full font-label-md font-bold text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-all"
          >
            Sign In
          </Link>
          <Link 
            href="/register" 
            className="px-6 py-2.5 rounded-full font-label-md font-bold bg-primary text-on-primary hover:bg-primary/90 shadow-sm hover:shadow transition-all"
          >
            Join Community
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 max-w-5xl mx-auto px-margin-mobile md:px-lg pt-16 pb-24 flex flex-col items-center text-center z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm uppercase tracking-wider mb-8 shadow-sm">
          <span className="material-symbols-outlined text-[16px] text-primary">eco</span>
          Non-Monetary Neighborhood Marketplace
        </div>

        <h1 className="font-headline-lg text-4xl sm:text-6xl lg:text-7xl font-extrabold text-on-surface tracking-tight max-w-4xl leading-[1.1] mb-6">
          Share your skills. <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-tertiary to-primary">Enrich your community.</span>
        </h1>

        <p className="font-body-lg text-lg sm:text-xl text-on-surface-variant max-w-2xl leading-relaxed mb-10">
          Exchange expertise directly with your neighbors. Offer what you know, request what you need, and build meaningful local connections through trusted, money-free swapping.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-20">
          <Link 
            href="/register" 
            className="w-full sm:w-auto px-8 py-4 rounded-full font-label-lg font-bold bg-primary text-on-primary hover:bg-primary/90 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-base"
          >
            Start Swapping Today
            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
          </Link>
          <Link 
            href="/explore" 
            className="w-full sm:w-auto px-8 py-4 rounded-full font-label-lg font-bold bg-surface-container-low text-on-surface hover:bg-surface-container border border-outline-variant/30 transition-all flex items-center justify-center gap-2 text-base"
          >
            <span className="material-symbols-outlined text-[20px]">explore</span>
            Explore Listings
          </Link>
        </div>

        {/* Categories Showcase */}
        <div className="w-full mb-24">
          <p className="font-label-md text-on-surface-variant uppercase tracking-widest text-xs mb-6 font-bold">
            Explore 10 Community Skill Categories
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2.5 max-w-3xl mx-auto">
            {PLATFORM_CATEGORIES.map((cat) => (
              <div 
                key={cat.name}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant/20 shadow-sm text-on-surface font-label-md font-medium"
              >
                <span className="material-symbols-outlined text-primary text-[18px]">{cat.icon}</span>
                {cat.name}
              </div>
            ))}
          </div>
        </div>

        {/* Bento Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left">
          <div className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant/20 shadow-sm relative overflow-hidden group flex flex-col justify-between">
            <div className="w-12 h-12 rounded-2xl bg-primary-container text-primary flex items-center justify-center mb-6 shadow-sm">
              <span className="material-symbols-outlined text-[28px]">payments</span>
            </div>
            <div>
              <h3 className="font-headline-sm text-xl font-bold text-on-surface mb-2">Zero Currency</h3>
              <p className="font-body-md text-on-surface-variant leading-relaxed">
                Your time and talents are your currency. No hidden fees, subscriptions, or digital wallets required.
              </p>
            </div>
          </div>

          <div className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant/20 shadow-sm relative overflow-hidden group flex flex-col justify-between">
            <div className="w-12 h-12 rounded-2xl bg-secondary-container text-on-secondary-container flex items-center justify-center mb-6 shadow-sm">
              <span className="material-symbols-outlined text-[28px]">verified_user</span>
            </div>
            <div>
              <h3 className="font-headline-sm text-xl font-bold text-on-surface mb-2">Verified Neighbors</h3>
              <p className="font-body-md text-on-surface-variant leading-relaxed">
                Reputation built on real completed swaps. Review history and community standing keep interactions trustworthy.
              </p>
            </div>
          </div>

          <div className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant/20 shadow-sm relative overflow-hidden group flex flex-col justify-between">
            <div className="w-12 h-12 rounded-2xl bg-tertiary-container text-on-tertiary-container flex items-center justify-center mb-6 shadow-sm">
              <span className="material-symbols-outlined text-[28px]">shield_person</span>
            </div>
            <div>
              <h3 className="font-headline-sm text-xl font-bold text-on-surface mb-2">Active Moderation</h3>
              <p className="font-body-md text-on-surface-variant leading-relaxed">
                Built-in conflict resolution flow, dispute escalation queue, and strict role-based access keep the marketplace safe.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-outline-variant/20 py-8 text-center bg-surface-container-low/50">
        <p className="font-body-md text-sm text-on-surface-variant">
          © {new Date().getFullYear()} SkillSwap Community Exchange. Built for neighbors, by neighbors.
        </p>
      </footer>
    </main>
  )
}