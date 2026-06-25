'use client'

import { Flag } from 'lucide-react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'

interface ReportModalProps {
  targetId: string
  targetType: 'Listing' | 'Request' | 'Profile' | 'Review' | 'Exchange'
  targetTitle?: string
  className?: string
  iconOnly?: boolean
}

export function ReportModal({
  targetId,
  targetType,
  targetTitle,
  className = '',
  iconOnly = true,
}: ReportModalProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handleOpen = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const newParams = new URLSearchParams(searchParams.toString())
    newParams.set('modal', 'report')
    newParams.set('targetId', targetId)
    newParams.set('targetType', targetType)
    if (targetTitle) newParams.set('title', targetTitle)
    router.push(`${pathname}?${newParams.toString()}`, { scroll: false })
  }

  return (
    <button
      type="button"
      onClick={handleOpen}
      title={`Report this ${targetType.toLowerCase()}`}
      className={`inline-flex items-center gap-1 text-slate-400 hover:text-red-500 transition-colors ${className}`}
      aria-label={`Report ${targetType}`}
    >
      <Flag className="w-4 h-4" />
      {!iconOnly && <span className="text-xs font-medium">Report</span>}
    </button>
  )
}
