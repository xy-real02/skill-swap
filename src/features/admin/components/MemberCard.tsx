'use client'

import { useState } from 'react'
import { AdminMemberItem } from '../queries/getMembers'
import { manageMember } from '../actions/manageMember'
import { Shield, ShieldAlert, User, Ban, CheckCircle2, Star, ExternalLink } from 'lucide-react'
import Link from 'next/link'

export function MemberCard({ member, currentAdminId }: { member: AdminMemberItem; currentAdminId: string }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isMe = member.id === currentAdminId
  const isBanned = member.status === 'banned'
  const role = member.role?.toLowerCase() || 'user'

  const handleRoleChange = async (newRole: 'user' | 'moderator' | 'admin') => {
    if (newRole === role) return
    if (!window.confirm(`Change ${member.full_name}'s role to ${newRole.toUpperCase()}?`)) return

    setLoading(true)
    setError(null)
    const res = await manageMember({ targetUserId: member.id, action: 'changeRole', newRole })
    setLoading(false)
    if (res.error) setError(res.error)
  }

  const handleToggleBan = async () => {
    const act = isBanned ? 'UNBAN' : 'BAN'
    if (!window.confirm(`Are you sure you want to ${act} ${member.full_name}?`)) return

    setLoading(true)
    setError(null)
    const res = await manageMember({ targetUserId: member.id, action: 'toggleBan' })
    setLoading(false)
    if (res.error) setError(res.error)
  }

  const avatar = member.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.id}`

  return (
    <div className={`bg-slate-900 border rounded-2xl p-5 shadow-xl transition-all flex flex-col justify-between gap-4 ${
      isBanned ? 'border-red-900/80 bg-red-950/10 opacity-75' :
      role === 'admin' ? 'border-amber-500/50 bg-amber-950/10' :
      role === 'moderator' ? 'border-emerald-500/50 bg-emerald-950/10' :
      'border-slate-800'
    }`}>
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className={`text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
            role === 'admin' ? 'bg-amber-500 text-slate-950' :
            role === 'moderator' ? 'bg-emerald-500 text-slate-950' :
            'bg-slate-800 text-slate-300'
          }`}>
            {role === 'admin' ? <ShieldAlert className="w-3 h-3" /> : role === 'moderator' ? <Shield className="w-3 h-3" /> : <User className="w-3 h-3" />}
            <span>{role}</span>
          </span>

          {isBanned && (
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-red-600 text-white animate-pulse">
              Banned
            </span>
          )}
          {isMe && (
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-blue-600 text-white">
              You
            </span>
          )}
        </div>

        <div className="flex items-center gap-3.5 mb-3">
          <img src={avatar} alt={member.full_name} className="w-12 h-12 rounded-full object-cover border border-slate-700 shrink-0" />
          <div className="min-w-0">
            <Link href={`/profile/${member.id}`} target="_blank" className="text-base font-bold text-white hover:text-amber-400 truncate flex items-center gap-1 transition-colors">
              <span className="truncate">{member.full_name}</span>
              <ExternalLink className="w-3.5 h-3.5 shrink-0 text-slate-500" />
            </Link>
            <div className="text-xs text-slate-400 mt-0.5">{member.community_zone}</div>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-slate-400 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80 mb-2">
          <div className="flex items-center gap-1 text-amber-400 font-semibold">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>{member.reputation_score?.toFixed(1) || 'New'}</span>
          </div>
          <div>&bull;</div>
          <div><strong className="text-slate-200">{member.exchange_count || 0}</strong> Exchanges</div>
        </div>

        {error && (
          <div className="text-xs text-red-300 bg-red-950/80 p-2 rounded-lg border border-red-800 mb-2">
            {error}
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          <label className="text-[11px] text-slate-400 mr-1 font-semibold">Role:</label>
          <select
            value={role}
            onChange={(e) => handleRoleChange(e.target.value as any)}
            disabled={loading || isMe}
            className="bg-slate-800 border border-slate-700 text-xs text-white rounded-lg px-2 py-1 focus:outline-none focus:border-amber-500 font-semibold disabled:opacity-50"
          >
            <option value="user">User</option>
            <option value="moderator">Moderator</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {!isMe && (
          <button
            type="button"
            onClick={handleToggleBan}
            disabled={loading || role === 'admin'}
            title={role === 'admin' ? 'Demote admin before banning' : ''}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
              isBanned
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow'
                : 'bg-red-950/80 hover:bg-red-900 border border-red-800 text-red-300'
            } disabled:opacity-30`}
          >
            <Ban className="w-3 h-3" />
            <span>{isBanned ? 'Unban' : 'Ban'}</span>
          </button>
        )}
      </div>
    </div>
  )
}
