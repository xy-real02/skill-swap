'use client'

import { useState } from 'react'
import { Flag, AlertCircle, CheckCircle2 } from 'lucide-react'
import { submitReport } from '../actions/submitReport'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'

const REASONS = [
  { label: 'Spam or misleading', value: 'spam' },
  { label: 'Harassment or hate speech', value: 'harassment' },
  { label: 'Inappropriate content', value: 'inappropriate_content' },
  { label: 'Potential scam or fraud', value: 'fraudulent_claim' },
  { label: 'Other violation', value: 'other' },
]

export function ReportForm({
  targetId,
  targetType,
  targetTitle,
}: {
  targetId: string
  targetType: 'Listing' | 'Request' | 'Profile' | 'Review' | 'Exchange'
  targetTitle?: string
}) {
  const [reason, setReason] = useState('spam')
  const [details, setDetails] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handleClose = () => {
    const newParams = new URLSearchParams(searchParams.toString())
    newParams.delete('modal')
    newParams.delete('targetId')
    newParams.delete('targetType')
    newParams.delete('title')
    router.replace(newParams.toString() ? `${pathname}?${newParams.toString()}` : pathname, { scroll: false })
  }

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
        handleClose()
      }, 1500)
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center space-y-3 animate-fade-in w-full">
        <CheckCircle2 className="w-12 h-12 text-emerald-500 animate-bounce" />
        <h4 className="text-lg font-bold text-on-surface w-full text-center">Report Submitted</h4>
        <p className="text-sm text-on-surface-variant leading-relaxed w-full max-w-[480px] mx-auto text-center px-2">
          Thank you for helping keep the SkillSwap community safe. Our moderation team will review this report shortly.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {targetTitle && (
        <div className="text-xs text-on-surface-variant bg-surface-container p-3 rounded-xl border border-outline-variant/30">
          Target: <strong className="text-on-surface">{targetTitle}</strong>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-xs text-error bg-error-container/40 p-3 rounded-xl border border-error/20">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div>
        <label className="block text-xs font-bold uppercase text-on-surface-variant mb-2">
          Violation Category
        </label>
        <select
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          disabled={loading}
          className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl text-sm text-on-surface focus:outline-none focus:border-primary font-medium"
        >
          {REASONS.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase text-on-surface-variant mb-2">
          Additional Context / Evidence
        </label>
        <textarea
          rows={3}
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          disabled={loading}
          placeholder="Please describe the violation or attach relevant context..."
          className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl text-sm text-on-surface focus:outline-none focus:border-primary placeholder:text-on-surface-variant/60 resize-none font-medium"
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={handleClose}
          disabled={loading}
          className="px-5 py-2.5 rounded-xl text-xs font-bold text-on-surface-variant hover:bg-surface-container transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 bg-error hover:bg-error/90 text-on-error font-bold text-xs rounded-xl shadow-lg shadow-error/20 transition-all flex items-center gap-1.5 disabled:opacity-50"
        >
          <Flag className="w-3.5 h-3.5" />
          <span>{loading ? 'Submitting...' : 'Submit Report'}</span>
        </button>
      </div>
    </form>
  )
}
