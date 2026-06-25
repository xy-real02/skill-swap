'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useSearchParams } from 'next/navigation'
import { deleteListing } from '@/features/listings/actions/deleteListing'
import { batchDeleteListings } from '@/features/listings/actions/batchDeleteListings'
import { ListingCard, type ListingWithProfile } from './ListingCard'

export function MyListingTableView({ listings }: { listings: ListingWithProfile[] }) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [isDeleting, setIsDeleting] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [activeModalItem, setActiveModalItem] = useState<ListingWithProfile | null>(null)
  const [mounted, setMounted] = useState(false)
  const searchParams = useSearchParams()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    setActiveModalItem(null)
  }, [searchParams])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveModalItem(null)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeModalItem])

  if (listings.length === 0) return null

  const allSelected = listings.length > 0 && selectedIds.size === listings.length

  const toggleAll = () => {
    if (allSelected) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(listings.map(l => l.id)))
    }
  }

  const toggleOne = (id: string) => {
    const next = new Set(selectedIds)
    if (next.has(id)) {
      next.delete(id)
    } else {
      next.add(id)
    }
    setSelectedIds(next)
  }

  const handleBatchDelete = async () => {
    if (selectedIds.size === 0) return
    if (!window.confirm(`Are you sure you want to delete ${selectedIds.size} selected listing${selectedIds.size === 1 ? '' : 's'}?`)) {
      return
    }

    setIsDeleting(true)
    try {
      await batchDeleteListings(Array.from(selectedIds))
      setSelectedIds(new Set())
    } catch (e) {
      alert('Failed to delete selected listings.')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleSingleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return
    setDeletingId(id)
    try {
      await deleteListing(id)
    } catch (e) {
      alert('Failed to delete')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="col-span-full space-y-4 w-full min-w-0">
      {/* Detail Modal Dialog via Portal */}
      {activeModalItem && mounted && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 md:p-10 overflow-y-auto animate-in fade-in duration-200">
          {/* Backdrop Scrim */}
          <div
            className="fixed inset-0 bg-scrim/60 backdrop-blur-sm transition-opacity cursor-pointer"
            onClick={() => setActiveModalItem(null)}
            aria-hidden="true"
          />

          {/* Modal Box */}
          <div
            className="relative w-full max-w-2xl bg-surface-container-lowest border border-outline-variant/30 rounded-3xl shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col my-auto"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header Bar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/20 bg-surface/80 backdrop-blur-md shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                  <span className="material-symbols-outlined text-[18px]">inventory_2</span>
                </div>
                <h3 className="font-headline-sm text-[18px] font-bold text-on-surface line-clamp-1">
                  My Listing Details
                </h3>
              </div>
              <button
                onClick={() => setActiveModalItem(null)}
                className="w-10 h-10 rounded-full hover:bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors focus:outline-none cursor-pointer"
                aria-label="Close modal"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 w-full">
              <ListingCard listing={activeModalItem} currentUserId={activeModalItem.owner_id} />
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Batch Action Bar */}
      {selectedIds.size > 0 && (
        <div className="bg-primary-container text-on-primary-container px-4 sm:px-6 py-3 rounded-2xl flex items-center justify-between shadow-md transition-all animate-fade-in gap-2 flex-wrap">
          <div className="flex items-center gap-2 font-bold font-label-md sm:font-label-lg">
            <span className="material-symbols-outlined text-[20px]">check_circle</span>
            <span>{selectedIds.size} item{selectedIds.size === 1 ? '' : 's'} selected</span>
          </div>
          <button
            onClick={handleBatchDelete}
            disabled={isDeleting}
            className="bg-error text-on-error hover:bg-error/90 font-label-md py-2 px-4 sm:px-5 rounded-full font-bold flex items-center gap-1.5 shadow transition-all disabled:opacity-50 text-xs sm:text-sm whitespace-nowrap cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px] sm:text-[18px]">{isDeleting ? 'hourglass_empty' : 'delete'}</span>
            {isDeleting ? 'Deleting...' : 'Delete Selected'}
          </button>
        </div>
      )}

      {/* Table Container */}
      <div className="overflow-x-auto bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-sm w-full">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-surface-variant bg-surface-container-low text-on-surface-variant font-label-sm text-[11px] sm:text-xs uppercase tracking-wider">
              <th className="py-3 px-3 sm:px-4 w-10 sm:w-12 text-center">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleAll}
                  className="w-4 h-4 rounded border-outline accent-primary cursor-pointer"
                />
              </th>
              <th className="py-3 px-3 sm:px-4 font-bold hidden md:table-cell">Category</th>
              <th className="py-3 px-3 sm:px-4 font-bold">Skill Offered</th>
              <th className="py-3 px-3 sm:px-4 font-bold hidden lg:table-cell">Looking For</th>
              <th className="py-3 px-3 sm:px-4 font-bold hidden xl:table-cell">Availability</th>
              <th className="py-3 px-3 sm:px-4 font-bold hidden sm:table-cell">Status</th>
              <th className="py-3 px-3 sm:px-4 text-right font-bold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-variant/60 font-body-sm text-sm">
            {listings.map((listing) => {
              const isSelected = selectedIds.has(listing.id)
              const isItemDeleting = deletingId === listing.id

              return (
                <tr
                  key={listing.id}
                  onClick={() => setActiveModalItem(listing)}
                  className={`transition-colors cursor-pointer ${isSelected ? 'bg-primary/5' : 'hover:bg-surface-container-low/60 active:bg-surface-container-low'}`}
                  title="Click to view full details"
                >
                  <td className="py-3.5 px-3 sm:px-4 text-center align-top sm:align-middle" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleOne(listing.id)}
                      className="w-4 h-4 rounded border-outline accent-primary cursor-pointer mt-1 sm:mt-0"
                    />
                  </td>
                  <td className="py-3.5 px-3 sm:px-4 whitespace-nowrap hidden md:table-cell">
                    <span className="bg-primary-container text-on-primary-container font-label-sm text-xs px-2.5 py-1 rounded-full font-bold">
                      {listing.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 sm:px-4 min-w-[180px]">
                    {/* Mobile meta row */}
                    <div className="flex items-center gap-1.5 mb-1 md:hidden flex-wrap">
                      <span className="bg-primary-container text-on-primary-container text-[10px] px-2 py-0.5 rounded-full font-bold">
                        {listing.category}
                      </span>
                      <span className="bg-emerald-500/10 text-emerald-600 text-[10px] px-1.5 py-0.5 rounded font-bold sm:hidden">
                        {listing.status || 'Active'}
                      </span>
                    </div>
                    
                    <p className="font-label-md font-bold text-on-surface line-clamp-1 group-hover:text-primary transition-colors" title={listing.title}>{listing.title}</p>
                    <p className="text-on-surface-variant text-xs line-clamp-1 mt-0.5" title={listing.description}>{listing.description}</p>
                    
                    {/* Looking for meta on small screens */}
                    <p className="text-on-surface-variant text-[11px] mt-1.5 lg:hidden line-clamp-1">
                      <span className="font-bold text-on-surface/80">Looking for:</span> {listing.exchange_preference || 'Open to offers'}
                    </p>
                  </td>
                  <td className="py-3.5 px-3 sm:px-4 text-on-surface-variant max-w-[180px] truncate hidden lg:table-cell" title={listing.exchange_preference || 'Open to offers'}>
                    {listing.exchange_preference || 'Open to offers'}
                  </td>
                  <td className="py-3.5 px-3 sm:px-4 whitespace-nowrap text-on-surface-variant text-xs font-bold hidden xl:table-cell">
                    {listing.availability || 'Flexible'}
                  </td>
                  <td className="py-3.5 px-3 sm:px-4 whitespace-nowrap hidden sm:table-cell">
                    <span className="bg-emerald-500/10 text-emerald-600 font-label-sm text-xs px-2 py-0.5 rounded font-bold">
                      {listing.status || 'Active'}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 sm:px-4 whitespace-nowrap text-right align-top sm:align-middle" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => handleSingleDelete(listing.id)}
                      disabled={isItemDeleting || isDeleting}
                      className="inline-flex items-center gap-1 bg-error/10 text-error hover:bg-error hover:text-on-error font-label-sm text-xs py-1.5 px-3 rounded-full transition-colors font-bold disabled:opacity-50 mt-0.5 sm:mt-0 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[14px]">{isItemDeleting ? 'hourglass_empty' : 'delete'}</span>
                      <span className="hidden xs:inline">{isItemDeleting ? '...' : 'Delete'}</span>
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
