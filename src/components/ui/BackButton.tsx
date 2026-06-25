'use client'

import { useRouter } from 'next/navigation'

export function BackButton() {
  const router = useRouter()
  return (
    <button 
      onClick={() => router.back()}
      className="flex items-center gap-2 text-on-surface-variant hover:text-primary font-label-md text-label-md transition-colors group"
    >
      <span className="material-symbols-outlined text-[20px] group-hover:-translate-x-1 transition-transform">arrow_back</span>
      Back
    </button>
  )
}
