import Link from 'next/link'
import React from 'react'

interface TopBarProps {
  title: string | React.ReactNode;
  description?: string | React.ReactNode;
  backHref?: string;
  action?: React.ReactNode;
}

export function TopBar({ title, description, backHref, action }: TopBarProps) {
  return (
    <header className="mb-lg sticky top-16 md:top-0 bg-surface/90 backdrop-blur-md z-30 pt-4 pb-4 -mx-margin-mobile px-margin-mobile md:-mx-lg md:px-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-outline-variant/30 md:border-transparent">
      <div className="flex items-center gap-4 w-full md:w-auto">
        {backHref && (
          <Link href={backHref} className="text-on-surface-variant hover:bg-secondary-container hover:text-primary p-2 rounded-full transition-colors flex items-center justify-center shrink-0 border border-outline-variant/30">
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </Link>
        )}
        <div className="flex-1">
          <h1 className="font-headline-md text-[24px] md:text-[32px] text-primary font-bold tracking-tight leading-tight">{title}</h1>
          {description && <div className="text-on-surface-variant font-body-md text-[14px] md:text-body-md mt-1">{description}</div>}
        </div>
      </div>
      {action && (
        <div className="shrink-0 w-full md:w-auto mt-2 md:mt-0 flex items-center gap-3">
          {action}
        </div>
      )}
    </header>
  )
}
