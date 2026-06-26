'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useState } from 'react'

export function SearchBar() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  const initialQuery = searchParams.get('q') || ''
  const [query, setQuery] = useState(initialQuery)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams.toString())
    if (query.trim()) {
      params.set('q', query.trim())
    } else {
      params.delete('q')
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  return (
    <form onSubmit={handleSearch} className="relative w-full group flex items-center">
      <span className="material-symbols-outlined absolute left-4 text-outline group-focus-within:text-primary transition-colors text-[24px]">search</span>
      <input 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-2xl py-4 pl-14 pr-[100px] focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-body-lg text-body-lg placeholder:text-outline-variant shadow-sm hover:shadow-md" 
        placeholder="Search skills, people, or topics..." 
        type="text" 
      />
      <button 
        type="submit" 
        className="absolute right-2 bg-primary text-on-primary hover:bg-primary/90 px-4 py-2 rounded-xl font-label-md transition-colors"
      >
        Search
      </button>
    </form>
  )
}
