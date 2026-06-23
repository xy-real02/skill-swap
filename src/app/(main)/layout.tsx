import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="h-14 border-b border-slate-200 dark:border-slate-800 flex items-center px-6 shrink-0">
        <span className="font-bold text-blue-600 text-lg">SkillSwap</span>
      </header>
      <main className="flex-1 flex flex-col">{children}</main>
    </div>
  )
}
