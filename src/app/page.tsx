// src/app/page.tsx
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function LandingPage() {
  // If a user is already logged in, bypass the landing page entirely
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (user) {
    redirect('/explore')
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-1000">
      <div className="max-w-3xl space-y-8">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl text-slate-900 dark:text-white">
          Trade your skills. <br />
          <span className="text-blue-600">Build your community.</span>
        </h1>
        
        <p className="text-xl text-slate-600 dark:text-slate-300">
          SkillSwap is a non-monetary exchange platform. Offer what you know, request what you need, and connect with neighbors through a transparent, reputation-based ecosystem.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <Link 
            href="/login" 
            className="px-8 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
          >
            Get Started
          </Link>
          <Link 
            href="/login" 
            className="px-8 py-3 rounded-lg border border-slate-300 dark:border-slate-700 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition"
          >
            Sign In
          </Link>
        </div>

        <div className="pt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 text-left">
          <div className="space-y-2">
            <h3 className="font-bold text-lg">No Money Needed</h3>
            <p className="text-slate-500 text-sm">Exchange your time and expertise directly with others. Your skills are your currency.</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-lg">Verified Reputation</h3>
            <p className="text-slate-500 text-sm">Build trust through our review system. Every completed exchange strengthens your community standing.</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-lg">Secure & Safe</h3>
            <p className="text-slate-500 text-sm">Built-in moderation, secure messaging, and robust privacy controls keep the community safe.</p>
          </div>
        </div>
      </div>
    </div>
  )
}