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
        <div className="p-4 rounded-2xl bg-error-container border border-error text-on-error-container text-sm flex items-center justify-between shadow-md">
          <span>⚠️ {actionError}</span>
          <button onClick={() => setActionError(null)} className="text-xs font-bold underline ml-4">Dismiss</button>
        </div>
      )}

      {/* Control Bar: Role Filters & View Mode */}
      <div className="bg-surface border border-outline-variant/40 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-[0_4px_20px_rgba(45,106,79,0.05)]">
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
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                selectedRoleFilter === tab.id
                  ? 'bg-primary text-on-primary shadow-md'
                  : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface border border-outline-variant/30'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                selectedRoleFilter === tab.id ? 'bg-white/20 text-on-primary' : 'bg-surface-container-highest text-primary'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-surface-container-low p-1 rounded-xl border border-outline-variant/30 flex items-center gap-1">
            <button
              onClick={() => setViewMode('table')}
              title="Table View"
              className={`p-2 rounded-lg transition-all ${
                viewMode === 'table' ? 'bg-surface text-primary shadow-sm font-bold' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <TableIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              title="Grid View"
              className={`p-2 rounded-lg transition-all ${
                viewMode === 'grid' ? 'bg-surface text-primary shadow-sm font-bold' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {filteredMembers.length === 0 ? (
        <div className="relative isolate overflow-hidden flex flex-col items-center justify-center w-full min-h-[320px] bg-surface rounded-3xl border border-outline-variant/40 p-8 text-center shadow-md">
          <div className="w-16 h-16 rounded-2xl bg-secondary-container text-on-secondary-container flex items-center justify-center mb-4 shadow-inner">
            <User className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-on-surface mb-1 font-headline-sm">No Members Found</h3>
          <p className="text-sm text-on-surface-variant max-w-md">No community members match the selected role filter "{selectedRoleFilter}".</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((member) => (
            <MemberCard key={member.id} member={member} currentAdminId={currentAdminId} />
          ))}
        </div>
      ) : (
        /* Executive Table View (Light Material 3 Theme) */
        <div className="bg-surface rounded-3xl border border-outline-variant/40 shadow-[0_8px_30px_rgba(45,106,79,0.06)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant/30 text-[11px] uppercase tracking-wider text-on-surface-variant font-extrabold">
                  <th className="p-4 pl-6">Member</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Platform Role</th>
                  <th className="p-4">Community Zone</th>
                  <th className="p-4">Reputation & Swaps</th>
                  <th className="p-4 pr-6 text-right">Executive Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20 text-sm bg-surface">
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
                          ? 'bg-error-container/30 hover:bg-error-container/50'
                          : role === 'admin'
                          ? 'bg-secondary-container/20 hover:bg-secondary-container/40'
                          : 'hover:bg-surface-container-low/70'
                      }`}
                    >
                      {/* Member Column */}
                      <td className="p-4 pl-6 py-4.5">
                        <div className="flex items-center gap-3.5">
                          <div className={`w-10 h-10 rounded-full font-extrabold flex items-center justify-center shrink-0 shadow-sm ${
                            isSuspended ? 'bg-error text-on-error' :
                            role === 'admin' ? 'bg-primary text-on-primary' :
                            role === 'moderator' ? 'bg-secondary-container text-on-secondary-container' :
                            'bg-surface-container-highest text-on-surface'
                          }`}>
                            {getInitials(member.full_name)}
                          </div>
                          <div>
                            <div className="font-bold text-on-surface flex items-center gap-2">
                              <Link href={`/profile/${member.id}`} className="hover:text-primary hover:underline transition-colors flex items-center gap-1">
                                <span>{member.full_name}</span>
                                <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-on-surface-variant" />
                              </Link>
                              {isMe && <span className="text-[10px] bg-secondary-container text-on-secondary-container font-extrabold px-2 py-0.5 rounded-full">YOU</span>}
                            </div>
                            <div className="text-xs text-on-surface-variant">Joined {joinDate}</div>
                          </div>
                        </div>
                      </td>

                      {/* Status Column */}
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                          isSuspended
                            ? 'bg-error-container text-on-error-container border-error/30'
                            : 'bg-secondary-container text-on-secondary-container border-secondary/30'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${isSuspended ? 'bg-error animate-pulse' : 'bg-primary'}`}></span>
                          <span>{isSuspended ? 'Suspended' : 'Active'}</span>
                        </span>
                      </td>

                      {/* Role Column */}
                      <td className="p-4">
                        <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-xl border border-outline-variant/30 w-fit">
                          {(['Member', 'Moderator', 'Admin'] as const).map((rOption) => {
                            const isCurrent = role === rOption.toLowerCase()
                            return (
                              <button
                                key={rOption}
                                type="button"
                                disabled={isLoading || isCurrent}
                                onClick={() => handleRoleChange(member, rOption)}
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                                  isCurrent
                                    ? rOption === 'Admin'
                                      ? 'bg-primary text-on-primary shadow-sm'
                                      : rOption === 'Moderator'
                                      ? 'bg-secondary text-on-secondary shadow-sm'
                                      : 'bg-surface text-on-surface shadow-sm border border-outline-variant/30'
                                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface/60'
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
                        <span className="px-3 py-1 bg-surface-container-low text-on-surface font-semibold text-xs rounded-full border border-outline-variant/30">
                          {member.community_zone || 'Unspecified'}
                        </span>
                      </td>

                      {/* Reputation & Swaps Column */}
                      <td className="p-4">
                        <div className="flex items-center gap-1.5 text-tertiary font-bold text-xs">
                          <Star className="w-4 h-4 fill-tertiary shrink-0" />
                          <span className="text-sm font-extrabold">{member.reputation_score || 0}</span>
                          <span className="text-on-surface-variant font-medium">({member.exchange_count || 0} swaps)</span>
                        </div>
                      </td>

                      {/* Actions Column */}
                      <td className="p-4 pr-6 text-right">
                        {!isMe && (
                          <button
                            type="button"
                            disabled={isLoading}
                            onClick={() => handleToggleBan(member)}
                            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all inline-flex items-center gap-1.5 shadow-sm ${
                              isSuspended
                                ? 'bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container'
                                : 'bg-error text-on-error hover:bg-error/90'
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

          <div className="p-4 bg-surface-container-low border-t border-outline-variant/30 flex items-center justify-between text-xs text-on-surface-variant font-bold px-6">
            <span>Showing 1-{filteredMembers.length} of {filteredMembers.length} community members</span>
            <span className="text-primary flex items-center gap-1">
              <Shield className="w-3.5 h-3.5" /> Live Directory Sync
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
