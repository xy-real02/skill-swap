'use client'

import Link from 'next/link'
import { useSearchParams, usePathname } from 'next/navigation'

export function ViewModeToggle() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const currentView = searchParams.get('view') === 'table' ? 'table' : 'grid'

  const createHref = (view: 'grid' | 'table') => {
    const params = new URLSearchParams(searchParams.toString())
    if (view === 'table') {
      params.set('view', 'table')
    } else {
      params.delete('view')
    }
    const query = params.toString()
    return query ? `${pathname}?${query}` : pathname
  }

  return (
    <div className="bg-surface-container rounded-full p-1 flex items-center shadow-inner border border-outline-variant/20 shrink-0 isolate">
      <Link
        href={createHref('grid')}
        className={`p-2 rounded-full flex items-center justify-center transition-all duration-200 ${
          currentView === 'grid'
            ? 'bg-primary text-on-primary shadow-sm font-bold'
            : 'text-on-surface-variant hover:text-on-surface'
        }`}
        title="Grid View"
      >
        <span className="material-symbols-outlined text-[18px]">grid_view</span>
      </Link>
      <Link
        href={createHref('table')}
        className={`p-2 rounded-full flex items-center justify-center transition-all duration-200 ${
          currentView === 'table'
            ? 'bg-primary text-on-primary shadow-sm font-bold'
            : 'text-on-surface-variant hover:text-on-surface'
        }`}
        title="Table View"
      >
        <span className="material-symbols-outlined text-[18px]">table_rows</span>
      </Link>
    </div>
  )
}
