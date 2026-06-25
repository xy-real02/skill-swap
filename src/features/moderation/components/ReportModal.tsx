'use client'

import { useState } from 'react'
import { Flag, AlertCircle, CheckCircle2 } from 'lucide-react'
import { submitReport } from '../actions/submitReport'

interface ReportModalProps {
  targetId: string
  targetType: 'Listing' | 'Request' | 'Profile' | 'Review' | 'Exchange'
  targetTitle?: string
  className?: string
  iconOnly?: boolean
}

const REASONS = [
  'Spam or misleading',
  'Harassment or hate speech',
  'Inappropriate content',
  'Potential scam or fraud',
  'Other violation',
]

export function ReportModal({
  targetId,
  targetType,
  targetTitle,
  className = '',
  iconOnly = true,
}: ReportModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [reason, setReason] = useState(REASONS[0])
  const [details, setDetails] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const res = await submitReport({
      targetId,
      targetType,
      reason,
      details,
    })

    setLoading(false)
    if (res.error) {
      setError(res.error)
    } else {
      setSuccess(true)
      setTimeout(() => {
        setIsOpen(false)
        setSuccess(false)
        setDetails('')
      }, 1500)
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setIsOpen(true)
        }}
        title={`Report this ${targetType.toLowerCase()}`}
        className={`inline-flex items-center gap-1 text-slate-400 hover:text-red-500 transition-colors ${className}`}
        aria-label={`Report ${targetType}`}
      >
        <Flag className="w-4 h-4" />
        {!iconOnly && <span className="text-xs font-medium">Report</span>}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
          onClick={(e) => {
            e.stopPropagation()
            setIsOpen(false)
          }}
        >
          <div
            className="relative w-full max-w-md p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl text-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 mb-4 text-red-400">
              <Flag className="w-5 h-5" />
              <h3 className="text-lg font-bold text-white">Report {targetType}</h3>
            </div>

            {targetTitle && (
              <p className="mb-4 text-xs text-slate-400 bg-slate-800/50 p-2.5 rounded-lg border border-slate-800 line-clamp-2">
                Target: <span className="font-semibold text-slate-200">{targetTitle}</span>
              </p>
            )}

            {success ? (
              <div className="py-8 text-center animate-scale-up">
                <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-emerald-400" />
                <h4 className="text-base font-bold text-white">Report Submitted</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Thank you. Our moderators will review this shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="flex items-center gap-2 p-3 text-xs text-red-300 bg-red-950/50 border border-red-800/60 rounded-xl">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                    <span>{error}</span>
                  </div>
                )}

                <div>
                  <label className="block mb-1.5 text-xs font-semibold text-slate-300">
                    Reason for reporting
                  </label>
                  <select
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-800 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-red-500"
                  >
                    {REASONS.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block mb-1.5 text-xs font-semibold text-slate-300">
                    Additional details (Optional)
                  </label>
                  <textarea
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    rows={3}
                    maxLength={500}
                    placeholder="Provide context to help moderators verify this violation..."
                    className="w-full px-3 py-2 text-sm bg-slate-800 border border-slate-700 rounded-xl text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-red-500 resize-none"
                  />
                  <div className="text-right text-[10px] text-slate-500 mt-1">
                    {details.length}/500
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    disabled={loading}
                    className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-500 rounded-xl transition-all shadow-lg shadow-red-600/20 disabled:opacity-50"
                  >
                    {loading ? 'Submitting...' : 'Submit Report'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  )
}
