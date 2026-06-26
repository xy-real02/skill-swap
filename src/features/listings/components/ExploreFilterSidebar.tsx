'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import React from 'react'

export function ExploreFilterSidebar({
  userZone,
  availableZones = [],
}: {
  userZone?: string
  availableZones?: string[]
}) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentZone = searchParams.get('zone') || 'All Zones'
  const currentMinRep = searchParams.get('minRep') || '0'

  const fallbackZones = ['Northside Hub', 'South Market', 'East Village', 'West End']
  const zones = ['All Zones', ...(availableZones.length > 0 ? availableZones : fallbackZones)]

  const updateFilters = (newZone: string, newRep: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (newZone && newZone !== 'All Zones') params.set('zone', newZone)
    else params.delete('zone')

    if (newRep && newRep !== '0') params.set('minRep', newRep)
    else params.delete('minRep')

    router.push(`/explore?${params.toString()}`)
  }

  return (
    <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-5 shadow-xs flex flex-col gap-6 w-full md:w-64 shrink-0">
      <div className="flex items-center gap-2 border-b border-surface-variant pb-3 text-primary font-bold font-headline-sm text-[16px]">
        <span className="material-symbols-outlined text-[20px]">tune</span>
        Discovery Filters
      </div>

      {/* Near Me Quick Tab */}
      {userZone && (
        <div className="flex flex-col gap-2">
          <label className="font-label-sm text-on-surface-variant font-bold text-[12px] uppercase tracking-wider">
            Quick Filter
          </label>
          <button
            onClick={() =>
              updateFilters(currentZone === userZone ? 'All Zones' : userZone, currentMinRep)
            }
            className={`w-full py-2 px-3 rounded-xl font-label-md flex items-center justify-center gap-2 transition-all border cursor-pointer ${
              currentZone === userZone
                ? 'bg-primary-container text-on-primary-container border-primary shadow-xs font-bold'
                : 'bg-surface text-on-surface hover:bg-surface-container border-outline-variant/30'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">near_me</span>
            Members Near Me
          </button>
          <span className="text-[11px] text-on-surface-variant text-center px-1 truncate">
            Zone: {userZone}
          </span>
        </div>
      )}

      {/* Zone Dropdown */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="zone-select"
          className="font-label-sm text-on-surface-variant font-bold text-[12px] uppercase tracking-wider"
        >
          Community Zone
        </label>
        <select
          id="zone-select"
          value={currentZone}
          onChange={(e) => updateFilters(e.target.value, currentMinRep)}
          className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-3 py-2.5 text-on-surface font-body-sm focus:outline-primary cursor-pointer"
        >
          {zones.map((z) => (
            <option key={z} value={z}>
              {z}
            </option>
          ))}
        </select>
      </div>

      {/* Minimum Reputation Filter */}
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <label className="font-label-sm text-on-surface-variant font-bold text-[12px] uppercase tracking-wider">
            Min Reputation
          </label>
          <span className="font-label-sm font-bold text-primary">
            {currentMinRep === '0' ? 'Any ★' : `${currentMinRep}+ ★`}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-1.5 bg-surface-container-low p-1 rounded-xl">
          {['0', '4', '4.5'].map((rep) => (
            <button
              key={rep}
              onClick={() => updateFilters(currentZone, rep)}
              className={`py-1.5 rounded-lg font-label-sm transition-all cursor-pointer ${
                currentMinRep === rep
                  ? 'bg-primary text-on-primary font-bold shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {rep === '0' ? 'All' : `${rep}+ ★`}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
