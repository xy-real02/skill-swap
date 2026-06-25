'use client'

import { useState } from 'react'
import { ReportItem } from '../queries/getReports'
import { resolveReport } from '../actions/resolveReport'
import { AlertTriangle, ExternalLink, CheckCircle, Trash2, Ban, ShieldAlert } from 'lucide-react'
import Link from 'next/link'

export function ReportCard({ report }: { report: ReportItem }) {
  const [isResolving, setIsResolving] = useState(false)
  const [action, setAction] = useState<'Dismiss' | 'DeleteContent' | 'BanUser'>('Dismiss')
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isPending = report.status === 'Pending'

  const handleResolve = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const res = await resolveReport({
      reportId: report.id,
      action,
      resolutionNote: note,
    })

    setLoading(false)
    if (res.error) {
      setError(res.error)
    } else {
      setIsResolving(false)
    }
  }

  const formatReason = (val: string) => {
    switch (val) {
      case 'spam': return 'Spam or Misleading'
      case 'harassment': return 'Harassment or Hate Speech'
      case 'inappropriate_content': return 'Inappropriate Content'
      case 'fraudulent_claim': return 'Fraudulent Claim or Scam'
      default: return 'Other Violation'
    }
  }

  return (
    <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-5 md:p-6 shadow-xl hover:border-slate-700 transition-all flex flex-col justify-between gap-4">
      <div>
        <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className={`text-[10px] uppercase font-bold px-2.5 py-1 rounded-full ${
              report.target_type === 'Listing' ? 'bg-purple-950 text-purple-300 border border-purple-800' :
              report.target_type === 'Request' ? 'bg-blue-950 text-blue-300 border border-blue-800' :
              'bg-amber-950 text-amber-300 border border-amber-800'
            }`}>
              {report.target_type}
            </span>
            <span className={`text-[10px] uppercase font-bold px-2.5 py-1 rounded-full ${
              isPending ? 'bg-red-950 text-red-300 border border-red-800 animate-pulse' : 'bg-slate-800 text-slate-400'
            }`}>
              {report.status}
            </span>
          </div>
          <span className="text-xs text-slate-400">
            {new Date(report.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
          <span>{report.target_title}</span>
          {report.target_url && (
            <Link href={report.target_url} target="_blank" className="text-slate-400 hover:text-primary transition-colors inline-flex items-center">
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          )}
        </h3>

        <div className="text-xs text-slate-400 mb-3">
          Reported by <span className="font-semibold text-slate-200">{report.reporter_name}</span>
        </div>

        <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80 mb-4">
          <div className="text-xs font-bold text-red-400 mb-1 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Reason: {formatReason(report.reason)}</span>
          </div>
          {report.details && (
            <p className="text-xs text-slate-300 italic mt-1.5 pt-1.5 border-t border-slate-800/80">
              "{report.details}"
            </p>
          )}
        </div>
      </div>

      {!isPending ? (
        <div className="bg-slate-800/40 rounded-xl p-3 text-xs text-slate-400 border border-slate-800 flex items-center justify-between">
          <span>Resolution Note: <strong className="text-slate-200">{report.resolution_note || 'None'}</strong></span>
          {report.resolved_at && <span>{new Date(report.resolved_at).toLocaleDateString()}</span>}
        </div>
      ) : isResolving ? (
        <form onSubmit={handleResolve} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 animate-fade-in">
          {error && <p className="text-xs text-red-400">{error}</p>}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Select Action</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setAction('Dismiss')}
                className={`p-2 rounded-lg text-xs font-bold transition-all border flex flex-col items-center gap-1 ${
                  action === 'Dismiss' ? 'bg-slate-800 border-amber-500 text-amber-400 shadow' : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <CheckCircle className="w-4 h-4" />
                <span>Dismiss</span>
              </button>
              <button
                type="button"
                onClick={() => setAction('DeleteContent')}
                className={`p-2 rounded-lg text-xs font-bold transition-all border flex flex-col items-center gap-1 ${
                  action === 'DeleteContent' ? 'bg-slate-800 border-red-500 text-red-400 shadow' : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Content</span>
              </button>
              <button
                type="button"
                onClick={() => setAction('BanUser')}
                className={`p-2 rounded-lg text-xs font-bold transition-all border flex flex-col items-center gap-1 ${
                  action === 'BanUser' ? 'bg-slate-800 border-red-600 text-red-500 shadow' : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <Ban className="w-4 h-4" />
                <span>Ban Author</span>
              </button>
            </div>
          </div>

          <div>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Resolution note for audit log..."
              required
              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-primary"
            />
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsResolving(false)}
              disabled={loading}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:bg-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-1.5 bg-error hover:bg-error/90 text-on-error rounded-lg text-xs font-bold shadow transition-all disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Confirm'}
            </button>
          </div>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setIsResolving(true)}
          className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 flex items-center justify-center gap-1.5 transition-all shadow-md group"
        >
          <ShieldAlert className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
          <span>Review Report</span>
        </button>
      )}
    </div>
  )
}
