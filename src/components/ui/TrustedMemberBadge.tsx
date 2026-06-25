'use client'

import React from 'react'

export function TrustedMemberBadge({
  score,
  exchanges,
}: {
  score?: number | null
  exchanges?: number | null
}) {
  if ((score || 0) < 4.5) return null

  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 shadow-xs cursor-help select-none shrink-0 transition-transform hover:scale-105"
      title="Trusted Member: High community reputation (≥4.5 ★)"
    >
      <span className="material-symbols-outlined text-[13px] text-amber-600 dark:text-amber-400">verified</span>
      Trusted Member
    </span>
  )
}
