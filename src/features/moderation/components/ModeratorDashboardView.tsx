'use client'

import { useState } from 'react'
import { ReportItem } from '../queries/getReports'
import { resolveReport } from '../actions/resolveReport'
import Link from 'next/link'
import { ShieldCheck, AlertTriangle, ExternalLink, Link as LinkIcon } from 'lucide-react'

function timeAgo(dateString: string) {
  try {
    const date = new Date(dateString)
    const now = new Date()
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    if (seconds < 60) return 'just now'
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes} min${minutes !== 1 ? 's' : ''} ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`
    const days = Math.floor(hours / 24)
    return `${days} day${days !== 1 ? 's' : ''} ago`
  } catch {
    return 'recently'
  }
}

function formatReasonBadge(reason: string) {
  const r = reason.toLowerCase()
  if (r.includes('spam') || r.includes('scam') || r.includes('fraud')) {
    return { label: 'Spam / Scam', bg: 'bg-error-container text-on-error-container', border: 'border-error' }
  }
  if (r.includes('harass') || r.includes('hate') || r.includes('abuse')) {
    return { label: 'Harassment', bg: 'bg-[#ffdad6] text-[#93000a]', border: 'border-[#ba1a1a]' }
  }
  if (r.includes('inappropriate') || r.includes('nsfw')) {
    return { label: 'Inappropriate', bg: 'bg-[#fef3c7] text-[#92400e]', border: 'border-[#f59e0b]' }
  }
  return { label: reason || 'Violation', bg: 'bg-secondary-container text-on-secondary-container', border: 'border-secondary' }
}

export function ModeratorDashboardView({
  initialReports,
  defaultTab = 'Open',
}: {
  initialReports: ReportItem[]
  defaultTab?: 'Open' | 'Resolved'
}) {
  const [reports, setReports] = useState<ReportItem[]>(initialReports)
  const [activeTab, setActiveTab] = useState<'Open' | 'Resolved'>(defaultTab)
  const [selectedType, setSelectedType] = useState<string>('All')
  const [resolvingId, setResolvingId] = useState<string | null>(null)

  const filterTypes = ['All', 'Listing', 'Request', 'Profile']

  const displayedReports = reports.filter((r) => {
    const isPending = r.status === 'Pending'
    if (activeTab === 'Open' && !isPending) return false
    if (activeTab === 'Resolved' && isPending) return false
    if (selectedType !== 'All' && r.target_type.toLowerCase() !== selectedType.toLowerCase()) return false
    return true
  })

  const handleAction = async (report: ReportItem, actionType: 'Dismiss' | 'DeleteContent' | 'BanUser', note: string) => {
    setResolvingId(report.id)
    const res = await resolveReport({
      reportId: report.id,
      action: actionType,
      resolutionNote: note,
    })
    setResolvingId(null)

    if (!res.error) {
      setReports((prev) =>
        prev.map((item) =>
          item.id === report.id
            ? { ...item, status: actionType === 'Dismiss' ? 'Dismissed' : 'Resolved' }
            : item
        )
      )
    }
  }

  return (
    <div className="w-full pb-16 animate-fade-in pt-2">
      {/* Sticky Top Filter & Tabs Area */}
      <div className="sticky top-[72px] md:top-[80px] bg-surface/95 backdrop-blur-xl z-20 pt-3 pb-4 mb-8 border-b border-surface-variant/60 flex flex-col md:flex-row md:items-center justify-between gap-4 -mx-margin-mobile px-margin-mobile md:mx-0 md:px-0">
        {/* Segmented Control Tabs */}
        <div className="bg-surface-container rounded-full p-1 flex w-full md:w-auto min-w-[300px] shadow-inner border border-outline-variant/30 shrink-0">
          <button
            onClick={() => setActiveTab('Open')}
            className={`flex-1 py-2 px-6 rounded-full text-center text-xs md:text-sm font-label-md transition-all duration-200 cursor-pointer ${
              activeTab === 'Open'
                ? 'bg-primary text-on-primary font-bold shadow-md'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Open Reports ({reports.filter((r) => r.status === 'Pending').length})
          </button>
          <button
            onClick={() => setActiveTab('Resolved')}
            className={`flex-1 py-2 px-6 rounded-full text-center text-xs md:text-sm font-label-md transition-all duration-200 cursor-pointer ${
              activeTab === 'Resolved'
                ? 'bg-primary text-on-primary font-bold shadow-md'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Resolved ({reports.filter((r) => r.status !== 'Pending').length})
          </button>
        </div>

        {/* Filter Bar */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar items-center pb-1 md:pb-0">
          {filterTypes.map((type) => {
            const isActive = selectedType === type
            return (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 border cursor-pointer ${
                  isActive
                    ? 'bg-primary text-on-primary border-primary shadow-sm font-bold'
                    : 'bg-surface-container-low text-on-surface hover:bg-surface-container border-outline-variant/40'
                }`}
              >
                {type === 'All' ? 'All Types' : `${type}s`}
              </button>
            )
          })}
        </div>
      </div>

      {/* Report Cards List */}
      {displayedReports.length === 0 ? (
        <div className="flex flex-col items-center justify-center w-full min-h-[320px] bg-surface-container-lowest dark:bg-surface-container rounded-2xl border border-outline-variant/60 p-8 my-8 text-center shadow-sm">
          <ShieldCheck className="w-16 h-16 text-primary dark:text-primary-fixed-dim mb-4 animate-bounce" />
          <h3 className="text-2xl font-bold text-on-surface mb-2 w-full text-center">All Clear!</h3>
          <p className="text-base text-on-surface-variant w-full text-center leading-relaxed">
            {activeTab === 'Open'
              ? 'There are currently no open reports matching this filter. Great job keeping SkillSwap safe!'
              : 'No resolved reports match this filter yet.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 w-full">
          {displayedReports.map((report) => {
            const badge = formatReasonBadge(report.reason)
            const isProcessing = resolvingId === report.id
            const isResolved = report.status !== 'Pending'

            return (
              <div
                key={report.id}
                className="bg-surface-container-lowest dark:bg-surface-container rounded-2xl p-6 md:p-8 shadow-md border border-outline-variant/60 flex flex-col lg:flex-row gap-6 transition-all hover:border-primary/40 hover:shadow-lg"
              >
                <div className="flex-grow space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-semibold text-on-surface-variant">
                        Reported {timeAgo(report.created_at)}
                      </span>
                      <span className="w-1.5 h-1.5 rounded-full bg-outline-variant"></span>
                      <span className={`px-3 py-0.5 rounded-full text-xs font-bold ${badge.bg}`}>
                        {badge.label}
                      </span>
                      {isResolved && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300">
                          {report.status}
                        </span>
                      )}
                    </div>
                    <span className="px-2.5 py-1 bg-surface-container rounded-lg text-xs font-mono font-bold text-on-surface-variant border border-outline-variant/40 shrink-0">
                      ID: #{report.id.slice(0, 8)}
                    </span>
                  </div>

                  <div className="text-base md:text-lg text-on-surface">
                    <span className="font-bold">{report.reporter_name || 'Member'}</span> reported this{' '}
                    <span className="font-bold text-primary dark:text-primary-fixed-dim underline decoration-primary/30 underline-offset-4">{report.target_type}</span>
                    {report.target_title && report.target_title !== 'Unknown Content' && (
                      <strong className="text-on-surface"> "{report.target_title}"</strong>
                    )}
                  </div>

                  <div className={`bg-surface-container dark:bg-surface-container-high border-l-4 ${badge.border} p-4 rounded-xl text-sm md:text-base text-on-surface italic shadow-inner border border-outline-variant/20 leading-relaxed font-medium`}>
                    "{report.details || report.reason || 'No detailed text provided.'}"
                  </div>

                  {report.target_url && (
                    <div className="text-sm font-semibold text-on-surface-variant flex items-center gap-1.5 pt-1">
                      <LinkIcon className="w-4 h-4 text-primary dark:text-primary-fixed-dim" />
                      <Link href={report.target_url} className="text-primary dark:text-primary-fixed-dim hover:underline flex items-center gap-1">
                        View Original Context
                      </Link>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-3 min-w-[200px] lg:border-l lg:border-outline-variant/60 lg:pl-8 justify-center">
                  {isProcessing ? (
                    <div className="w-full py-4 text-center text-xs text-on-surface-variant animate-pulse font-bold">
                      Processing Action...
                    </div>
                  ) : !isResolved ? (
                    <>
                      <button
                        onClick={() => handleAction(report, 'DeleteContent', 'Removed offending content via Mod Dashboard')}
                        className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-on-error bg-error hover:opacity-90 transition-opacity shadow-sm text-center cursor-pointer"
                      >
                        {report.target_type === 'Profile' ? 'Suspend Member' : 'Remove Content'}
                      </button>
                      <button
                        onClick={() => handleAction(report, 'Dismiss', 'Member warned for minor violation')}
                        className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-[#b45309] dark:text-[#fbbf24] border-[1.5px] border-[#b45309] dark:border-[#fbbf24] hover:bg-[#fef3c7]/50 transition-colors text-center cursor-pointer bg-amber-50/50 dark:bg-amber-950/20"
                      >
                        Warn Member
                      </button>
                      <button
                        onClick={() => handleAction(report, 'Dismiss', 'Report dismissed as non-violating')}
                        className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-on-surface border border-outline-variant/60 bg-surface-container-low hover:bg-surface-container transition-colors text-center cursor-pointer shadow-sm"
                      >
                        Dismiss Report
                      </button>
                    </>
                  ) : (
                    <div className="text-center bg-surface-container-low p-3 rounded-xl border border-outline-variant/30">
                      <div className="text-xs font-bold text-on-surface mb-1">Resolved</div>
                      {report.resolution_note && (
                        <div className="text-[11px] text-on-surface-variant italic line-clamp-2">
                          "{report.resolution_note}"
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
