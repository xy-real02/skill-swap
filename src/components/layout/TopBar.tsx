import Link from 'next/link'
import React from 'react'

export interface TopBarProps {
  title: string | React.ReactNode;
  description?: string | React.ReactNode;
  backHref?: string;
}

export function TopBar({ title, description, backHref }: TopBarProps) {
  return (
    <>
      {/* Spacer to push content down below the fixed header */}
      <div 
        className={`-mt-margin-mobile md:-mt-lg w-full shrink-0 h-[88px] md:h-[96px]`} 
        aria-hidden="true" 
      />
      
      <header className="fixed top-16 md:top-0 left-0 md:left-[240px] right-0 bg-surface/90 backdrop-blur-md z-40 border-b border-outline-variant/30">
        <div className="w-full max-w-[1200px] mx-auto md:mx-0 px-margin-mobile md:px-lg py-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="flex items-center gap-4 w-full">
            {backHref && (
              <Link href={backHref} className="text-on-surface-variant hover:bg-secondary-container hover:text-primary p-2 rounded-full transition-colors flex items-center justify-center shrink-0 border border-outline-variant/30">
                <span className="material-symbols-outlined text-[20px]">arrow_back</span>
              </Link>
            )}
            <div className="flex-1">
              <h1 className="font-headline-sm text-[20px] md:text-[24px] text-primary font-bold tracking-tight leading-tight">{title}</h1>
              {description && <div className="text-on-surface-variant font-label-md text-[13px] md:text-[14px] mt-0.5 line-clamp-1 md:line-clamp-none">{description}</div>}
            </div>
          </div>
        </div>
      </header>
    </>
  )
}
