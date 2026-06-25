'use client'

import { useState } from 'react'
import { AdminMemberItem } from '../queries/getMembers'
import { manageMember } from '../actions/manageMember'
import { MemberCard } from './MemberCard'
import { Shield, ShieldAlert, User, Ban, CheckCircle2, Star, ExternalLink, Filter, LayoutGrid, Table as TableIcon, MoreVertical, Search } from 'lucide-react'
import Link from 'next/link'

interface MemberTableProps {
  members: AdminMemberItem[]
  currentAdminId: string
}

export function MemberTable({ members, currentAdminId }: MemberTableProps) {
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('all')
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  // Filter members by role tab
  const filteredMembers = members.filter((m) => {
    if (selectedRoleFilter === 'all') return true
    const r = m.role?.toLowerCase() || 'member'
    return r === selectedRoleFilter.toLowerCase()
  })

  const getInitials = (name: string) => {
    const parts = name.trim().split(' ')
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    }
    return name.slice(0, 2).toUpperCase()
  }

  const handleRoleChange = async (member: AdminMemberItem, newRole: 'Member' | 'Moderator' | 'Admin') => {
    const currentRole = member.role?.toLowerCase() || 'member'
    if (newRole.toLowerCase() === currentRole) return
    if (!window.confirm(`Change ${member.full_name}'s platform role to ${newRole}?`)) return

    setLoadingId(member.id)
    setActionError(null)
    const res = await manageMember({ targetUserId: member.id, action: 'changeRole', newRole })
    setLoadingId(null)
    if (res.error) setActionError(res.error)
  }

  const handleToggleBan = async (member: AdminMemberItem) => {
    const isSuspended = member.status?.toLowerCase() === 'suspended'
    const act = isSuspended ? 'REINSTATE' : 'SUSPEND'
    if (!window.confirm(`Are you sure you want to ${act} account for ${member.full_name}?`)) return

    setLoadingId(member.id)
    setActionError(null)
    const res = await manageMember({ targetUserId: member.id, action: 'toggleBan' })
    setLoadingId(null)
    if (res.error) setActionError(res.error)
  }

  return (
    <div className="space-y-6">
      {actionError && (
        <div className="p-4 rounded-2xl bg-red-950/80 border border-red-500/50 text-red-200 text-sm flex items-center justify-between">
          <span>⚠️ {actionError}</span>
          <button onClick={() => setActionError(null)} className="text-xs font-bold underline ml-4">Dismiss</button>
        </div>
      )}

      {/* Control Bar: Role Filters & View Mode */}
      <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'All Members', count: members.length },
            { id: 'member', label: 'Members', count: members.filter(m => (m.role?.toLowerCase() || 'member') === 'member').length },
            { id: 'moderator', label: 'Moderators', count: members.filter(m => m.role?.toLowerCase() === 'moderator').length },
            { id: 'admin', label: 'Admins', count: members.filter(m => m.role?.toLowerCase() === 'admin').length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedRoleFilter(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                selectedRoleFilter === tab.id
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                  : 'bg-slate-950/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800/80'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                selectedRoleFilter === tab.id ? 'bg-emerald-800 text-emerald-100' : 'bg-slate-900 text-slate-500'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex items-center gap-1">
            <button
              onClick={() => setViewMode('table')}
              title="Table View"
              className={`p-2 rounded-lg transition-all ${
                viewMode === 'table' ? 'bg-slate-800 text-emerald-400 shadow' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <TableIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              title="Grid View"
              className={`p-2 rounded-lg transition-all ${
                viewMode === 'grid' ? 'bg-slate-800 text-emerald-400 shadow' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {filteredMembers.length === 0 ? (
        <div className="relative isolate overflow-hidden flex flex-col items-center justify-center w-full min-h-[320px] bg-slate-900/60 rounded-3xl border border-slate-800 p-8 text-center shadow-2xl">
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-10"></div>
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4 shadow-inner">
            <User className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white mb-1 font-headline-sm">No Members Found</h3>
          <p className="text-sm text-slate-400 max-w-md">No community members match the selected role filter "{selectedRoleFilter}".</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((member) => (
            <MemberCard key={member.id} member={member} currentAdminId={currentAdminId} />
          ))}
        </div>
      ) : (
        /* Executive Table View */
        <div className="bg-slate-900/80 backdrop-blur-md rounded-3xl border border-slate-800 shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/80 border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400 font-extrabold">
                  <th className="p-4 pl-6">Member</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Platform Role</th>
                  <th className="p-4">Community Zone</th>
                  <th className="p-4">Reputation & Swaps</th>
                  <th className="p-4 pr-6 text-right">Executive Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-sm">
                {filteredMembers.map((member) => {
                  const isMe = member.id === currentAdminId
                  const isSuspended = member.status?.toLowerCase() === 'suspended'
                  const role = member.role?.toLowerCase() || 'member'
                  const isLoading = loadingId === member.id
                  const joinDate = member.created_at
                    ? new Date(member.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                    : 'Recent'

                  return (
                    <tr
                      key={member.id}
                      className={`transition-colors group ${
                        isSuspended
                          ? 'bg-red-950/20 hover:bg-red-950/30'
                          : role === 'admin'
                          ? 'bg-amber-950/10 hover:bg-amber-950/20'
                          : role === 'moderator'
                          ? 'bg-emerald-950/10 hover:bg-emerald-950/20'
                          : 'hover:bg-slate-800/40'
                      }`}
                    >
                      {/* Member Column */}
                      <td className="p-4 pl-6 py-4.5">
                        <div className="flex items-center gap-3.5">
                          <div className={`w-10 h-10 rounded-full font-extrabold flex items-center justify-center shrink-0 shadow-inner ${
                            isSuspended ? 'bg-red-900/40 text-rose-300 border border-rose-500/30' :
                            role === 'admin' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                            role === 'moderator' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                            'bg-slate-800 text-slate-300 border border-slate-700'
                          }`}>
                            {getInitials(member.full_name)}
                          </div>
                          <div>
                            <div className="font-bold text-white flex items-center gap-2">
                              <Link href={`/profile/${member.id}`} className="hover:text-emerald-400 hover:underline transition-colors flex items-center gap-1">
                                <span>{member.full_name}</span>
                                <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400" />
                              </Link>
                              {isMe && <span className="text-[10px] bg-slate-800 text-emerald-400 font-bold px-2 py-0.5 rounded-full border border-slate-700">YOU</span>}
                            </div>
                            <div className="text-xs text-slate-400">Joined {joinDate}</div>
                          </div>
                        </div>
                      </td>

                      {/* Status Column */}
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                          isSuspended
                            ? 'bg-red-950/80 text-rose-300 border-rose-500/40 shadow-sm shadow-rose-950'
                            : 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40 shadow-sm shadow-emerald-950'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${isSuspended ? 'bg-rose-400 animate-pulse' : 'bg-emerald-400'}`}></span>
                          <span>{isSuspended ? 'Suspended' : 'Active'}</span>
                        </span>
                      </td>

                      {/* Role Column */}
                      <td className="p-4">
                        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 w-fit">
                          {(['Member', 'Moderator', 'Admin'] as const).map((rOption) => {
                            const isCurrent = role === rOption.toLowerCase()
                            return (
                              <button
                                key={rOption}
                                type="button"
                                disabled={isLoading || isCurrent}
                                onClick={() => handleRoleChange(member, rOption)}
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold transition-all ${
                                  isCurrent
                                    ? rOption === 'Admin'
                                      ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 border border-amber-400'
                                      : rOption === 'Moderator'
                                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20 border border-emerald-500'
                                      : 'bg-slate-700 text-white shadow border border-slate-600'
                                    : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                                }`}
                              >
                                {rOption === 'Moderator' ? 'Mod' : rOption}
                              </button>
                            )
                          })}
                        </div>
                      </td>

                      {/* Community Zone Column */}
                      <td className="p-4">
                        <span className="px-3 py-1 bg-slate-800/80 text-emerald-300 font-semibold text-xs rounded-full border border-slate-700/80">
                          {member.community_zone || 'Unspecified'}
                        </span>
                      </td>

                      {/* Reputation & Swaps Column */}
                      <td className="p-4">
                        <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs">
                          <Star className="w-4 h-4 fill-amber-400 shrink-0" />
                          <span className="text-sm font-extrabold">{member.reputation_score || 0}</span>
                          <span className="text-slate-400 font-medium">({member.exchange_count || 0} swaps)</span>
                        </div>
                      </td>

                      {/* Actions Column */}
                      <td className="p-4 pr-6 text-right">
                        {!isMe && (
                          <button
                            type="button"
                            disabled={isLoading}
                            onClick={() => handleToggleBan(member)}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all inline-flex items-center gap-1.5 border shadow-lg ${
                              isSuspended
                                ? 'bg-emerald-600 hover:bg-emerald-500 border-emerald-500 text-white shadow-emerald-600/20'
                                : 'bg-red-600 hover:bg-red-500 border-red-500 text-white shadow-red-600/20'
                            }`}
                          >
                            {isSuspended ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Ban className="w-3.5 h-3.5" />}
                            <span>{isLoading ? '...' : isSuspended ? 'Reinstate' : 'Suspend'}</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="p-4.5 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-bold px-6">
            <span>Showing 1-{filteredMembers.length} of {filteredMembers.length} community members</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <Shield className="w-3.5 h-3.5" /> Live Directory Sync
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
