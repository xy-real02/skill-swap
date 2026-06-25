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
    <div className={`bg-surface border rounded-3xl p-6 shadow-[0_4px_24px_rgba(45,106,79,0.05)] transition-all flex flex-col justify-between gap-5 hover:-translate-y-1 ${
      isSuspended ? 'border-error/50 bg-error-container/20 opacity-80' :
      role === 'admin' ? 'border-primary/40 bg-secondary-container/10' :
      'border-outline-variant/40'
    }`}>
      <div>
        <div className="flex items-center justify-between gap-2 mb-4">
          <span className={`text-[10px] uppercase font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-sm ${
            role === 'admin' ? 'bg-primary text-on-primary' :
            role === 'moderator' ? 'bg-secondary text-on-secondary' :
            'bg-surface-container-high text-on-surface-variant border border-outline-variant/30'
          }`}>
            {role === 'admin' ? <ShieldAlert className="w-3 h-3" /> : role === 'moderator' ? <Shield className="w-3 h-3" /> : <User className="w-3 h-3" />}
            <span>{member.role || 'Member'}</span>
          </span>

          <div className="flex gap-1.5 items-center">
            {isSuspended && (
              <span className="text-[10px] uppercase font-extrabold px-2.5 py-0.5 rounded-full bg-error text-on-error animate-pulse shadow-sm">
                Suspended
              </span>
            )}
            {isMe && (
              <span className="text-[10px] uppercase font-extrabold px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container">
                You
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 mb-5">
          <img src={avatar} alt={member.full_name} className="w-14 h-14 rounded-full border border-outline-variant/40 bg-surface-container-low shrink-0 object-cover shadow-sm" />
          <div className="overflow-hidden">
            <h3 className="text-base font-bold text-on-surface truncate flex items-center gap-1.5 font-headline-sm">
              <span>{member.full_name}</span>
              <Link href={`/profile/${member.id}`} target="_blank" className="text-on-surface-variant hover:text-primary transition-colors">
                <ExternalLink className="w-4 h-4 shrink-0" />
              </Link>
            </h3>
            <p className="text-xs font-semibold text-primary truncate mt-0.5">📍 {member.community_zone || 'Town Square'}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 py-3 px-4 bg-surface-container-low rounded-2xl border border-outline-variant/30 mb-4 text-center">
          <div>
            <span className="block text-[10px] uppercase font-bold tracking-wider text-on-surface-variant">Reputation</span>
            <span className="text-sm font-extrabold text-tertiary inline-flex items-center gap-1 mt-0.5">
              <Star className="w-3.5 h-3.5 fill-tertiary" />
              {Number(member.reputation_score || 0).toFixed(1)}
            </span>
          </div>
          <div className="border-l border-outline-variant/30">
            <span className="block text-[10px] uppercase font-bold tracking-wider text-on-surface-variant">Exchanges</span>
            <span className="text-sm font-extrabold text-on-surface mt-0.5 block">{member.exchange_count || 0}</span>
          </div>
        </div>
      </div>

      <div className="space-y-3 pt-3 border-t border-outline-variant/30">
        <div className="flex items-center justify-between gap-2">
          <label className="text-xs font-bold text-on-surface-variant">Assign Role:</label>
          <div className="flex gap-1 bg-surface-container-low p-1 rounded-xl border border-outline-variant/30">
            <button
              type="button"
              disabled={loading || role === 'member'}
              onClick={() => handleRoleChange('Member')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                role === 'member' ? 'bg-surface text-on-surface shadow-sm font-extrabold' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Member
            </button>
            <button
              type="button"
              disabled={loading || role === 'moderator'}
              onClick={() => handleRoleChange('Moderator')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                role === 'moderator' ? 'bg-secondary text-on-secondary shadow-sm font-extrabold' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Mod
            </button>
            <button
              type="button"
              disabled={loading || role === 'admin'}
              onClick={() => handleRoleChange('Admin')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                role === 'admin' ? 'bg-primary text-on-primary shadow-sm font-extrabold' : 'text-on-surface-variant hover:text-on-surface'
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
            className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm ${
              isSuspended
                ? 'bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container'
                : 'bg-error text-on-error hover:bg-error/90'
            }`}
          >
            {isSuspended ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <Ban className="w-4 h-4 shrink-0" />}
            <span>{loading ? 'Processing...' : isSuspended ? 'Reinstate Account' : 'Suspend Account'}</span>
          </button>
        )}
      </div>

      {error && <p className="text-xs font-bold text-error text-center">{error}</p>}
    </div>
  )
}
