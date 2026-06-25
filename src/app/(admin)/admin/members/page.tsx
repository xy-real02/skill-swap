import { getMembers } from '@/features/admin/queries/getMembers'
import { MemberCard } from '@/features/admin/components/MemberCard'
import { createClient } from '@/lib/supabase/server'
import { Users } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminMembersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const resolvedParams = await searchParams
  const q = resolvedParams?.q || ''
  const members = await getMembers(q)

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const currentAdminId = user?.id || ''

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white font-headline-md tracking-tight">
            User Directory & Role Assignment
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Search platform members, promote community moderators, and enforce platform safety.
          </p>
        </div>
        <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl text-slate-300 font-bold text-sm flex items-center gap-2">
          <Users className="w-4 h-4 text-amber-400" />
          <span>{members.length} Members Loaded</span>
        </div>
      </div>

      {/* Search Bar */}
      <form method="GET" className="max-w-md">
        <div className="relative">
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Search members by full name..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500 shadow-inner"
          />
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-500 text-[20px]">
            search
          </span>
        </div>
      </form>

      {members.length === 0 ? (
        <div className="py-16 text-center text-slate-500 bg-slate-900/40 rounded-3xl border border-slate-800">
          No members matching query "{q}".
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((member) => (
            <MemberCard key={member.id} member={member} currentAdminId={currentAdminId} />
          ))}
        </div>
      )}
    </div>
  )
}
