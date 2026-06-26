'use client'

import { ModerationLogItem } from '../queries/getModerationLogs'
import { Shield, User } from 'lucide-react'
import Link from 'next/link'

const formatActionDisplay = (act: string, reason: string | null) => {
  if (act === 'report_dismissed') return 'Report Dismissed'
  if (act === 'content_removed') return 'Content Removed'
  if (act === 'member_suspended') return 'Member Suspended'
  if (act === 'member_reinstated') return 'Member Reinstated'
  if (act === 'review_removed') return 'Review Removed'
  if (act === 'warning_issued' && reason?.startsWith('Role updated')) return 'Role Changed'
  if (act === 'warning_issued') return 'Warning Issued'
  return act
}

export function ModerationLogTable({ logs }: { logs: ModerationLogItem[] }) {
  if (logs.length === 0) {
    return (
      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-12 text-center text-on-surface-variant">
        <Shield className="w-12 h-12 mx-auto mb-3 text-on-surface-variant/40" />
        <p className="font-headline-sm text-lg font-bold">No Moderation Actions Logged</p>
        <p className="text-sm mt-1">Actions taken by moderators and administrators will appear here.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-surface-variant bg-surface-container-low text-on-surface-variant font-label-sm text-xs uppercase tracking-wider">
            <th className="py-3 px-4 font-bold">Timestamp</th>
            <th className="py-3 px-4 font-bold">Moderator</th>
            <th className="py-3 px-4 font-bold">Action Taken</th>
            <th className="py-3 px-4 font-bold">Target Member</th>
            <th className="py-3 px-4 font-bold">Reason / Note</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-variant/60 font-body-sm text-sm">
          {logs.map((log) => (
            <tr key={log.id} className="hover:bg-surface-container-low/60 transition-colors">
              <td className="py-3.5 px-4 whitespace-nowrap text-on-surface-variant text-xs">
                {new Date(log.created_at).toLocaleString()}
              </td>
              <td className="py-3.5 px-4 whitespace-nowrap">
                <Link href={`/profile/${log.moderator_id}`} className="font-bold text-on-surface hover:text-primary transition-colors inline-flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-primary" />
                  {log.moderator_name}
                </Link>
              </td>
              <td className="py-3.5 px-4 whitespace-nowrap">
                <span className="bg-primary-container text-on-primary-container font-label-sm text-xs px-2.5 py-1 rounded-full font-bold">
                  {formatActionDisplay(log.action, log.reason)}
                </span>
              </td>
              <td className="py-3.5 px-4 whitespace-nowrap">
                <Link href={`/profile/${log.target_user_id}`} className="font-bold text-on-surface hover:text-primary transition-colors inline-flex items-center gap-1.5">
                  <User className="w-4 h-4 text-on-surface-variant" />
                  {log.target_user_name}
                </Link>
              </td>
              <td className="py-3.5 px-4 text-on-surface-variant max-w-md truncate" title={log.reason || 'No reason provided'}>
                {log.reason || 'No reason provided'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
