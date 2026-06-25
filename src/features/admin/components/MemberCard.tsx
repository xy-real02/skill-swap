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
  const isSuspended = member.status?.toLowerCase() === 'suspended'
  const role = member.role?.toLowerCase() || 'member'

  const handleRoleChange = async (newRole: 'Member' | 'Moderator' | 'Admin') => {
    if (newRole.toLowerCase() === role) return
    if (!window.confirm(`Change ${member.full_name}'s role to ${newRole}?`)) return

    setLoading(true)
    setError(null)
    const res = await manageMember({ targetUserId: member.id, action: 'changeRole', newRole })
    setLoading(false)
    if (res.error) setError(res.error)
  }

  const handleToggleBan = async () => {
    const act = isSuspended ? 'REINSTATE' : 'SUSPEND'
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
      isSuspended ? 'border-red-900/80 bg-red-950/10 opacity-75' :
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
            <span>{member.role || 'Member'}</span>
          </span>

          {isSuspended && (
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-red-600 text-white animate-pulse">
              Suspended
            </span>
          )}
          {isMe && (
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-blue-600 text-white">
              You
            </span>
          )}
        </div>

        <div className="flex items-center gap-3.5 mb-4">
          <img src={avatar} alt={member.full_name} className="w-12 h-12 rounded-full border border-slate-700 bg-slate-800 shrink-0 object-cover" />
          <div className="overflow-hidden">
            <h3 className="text-base font-bold text-white truncate flex items-center gap-1.5">
              <span>{member.full_name}</span>
              <Link href={`/profile/${member.id}`} target="_blank" className="text-slate-500 hover:text-primary transition-colors">
                <ExternalLink className="w-3.5 h-3.5 shrink-0" />
              </Link>
            </h3>
            <p className="text-xs text-slate-400 truncate">📍 {member.community_zone}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 py-2.5 px-3 bg-slate-950/60 rounded-xl border border-slate-800/80 mb-3 text-center">
          <div>
            <span className="block text-[10px] uppercase font-bold text-slate-500">Reputation</span>
            <span className="text-sm font-bold text-amber-400 inline-flex items-center gap-1">
              <Star className="w-3 h-3 fill-amber-400" />
              {Number(member.reputation_score || 0).toFixed(1)}
            </span>
          </div>
          <div className="border-l border-slate-800">
            <span className="block text-[10px] uppercase font-bold text-slate-500">Exchanges</span>
            <span className="text-sm font-bold text-slate-200">{member.exchange_count || 0}</span>
          </div>
        </div>
      </div>

      {error && <p className="text-xs text-red-400 text-center">{error}</p>}

      <div className="space-y-2 pt-2 border-t border-slate-800/80">
        <div className="flex items-center justify-between gap-2">
          <label className="text-[11px] font-semibold text-slate-400">Assign Role:</label>
          <div className="flex gap-1">
            <button
              type="button"
              disabled={loading || role === 'member'}
              onClick={() => handleRoleChange('Member')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                role === 'member' ? 'bg-slate-700 text-white cursor-default shadow border border-slate-600' : 'bg-slate-950 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
              }`}
            >
              Member
            </button>
            <button
              type="button"
              disabled={loading || role === 'moderator'}
              onClick={() => handleRoleChange('Moderator')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                role === 'moderator' ? 'bg-emerald-600 text-white cursor-default shadow-lg shadow-emerald-600/20 border border-emerald-500' : 'bg-slate-950 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
              }`}
            >
              Mod
            </button>
            <button
              type="button"
              disabled={loading || role === 'admin'}
              onClick={() => handleRoleChange('Admin')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                role === 'admin' ? 'bg-amber-500 text-slate-950 cursor-default shadow-lg shadow-amber-500/20 border border-amber-400' : 'bg-slate-950 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
              }`}
            >
              Admin
            </button>
          </div>
        </div>

        {!isMe && (
          <button
            type="button"
            disabled={loading}
            onClick={handleToggleBan}
            className={`w-full py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 border shadow-lg ${
              isSuspended
                ? 'bg-emerald-600 hover:bg-emerald-500 border-emerald-500 text-white shadow-emerald-600/20'
                : 'bg-red-600 hover:bg-red-500 border-red-500 text-white shadow-red-600/20'
            }`}
          >
            {isSuspended ? <CheckCircle2 className="w-4 h-4 text-white shrink-0" /> : <Ban className="w-4 h-4 text-white shrink-0" />}
            <span>{loading ? 'Processing...' : isSuspended ? 'Reinstate Account' : 'Suspend Account'}</span>
          </button>
        )}
      </div>
    </div>
  )
}
