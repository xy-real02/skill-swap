'use client'

import { useState } from 'react'
import { deleteListing } from '@/features/listings/actions/deleteListing'
import { batchDeleteListings } from '@/features/listings/actions/batchDeleteListings'
import type { ListingWithProfile } from './ListingCard'

export function MyListingTableView({ listings }: { listings: ListingWithProfile[] }) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [isDeleting, setIsDeleting] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

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
    <div className="col-span-full space-y-4">
      {/* Batch Action Bar */}
      {selectedIds.size > 0 && (
        <div className="bg-primary-container text-on-primary-container px-6 py-3 rounded-2xl flex items-center justify-between shadow-md transition-all animate-fade-in">
          <div className="flex items-center gap-2 font-bold font-label-lg">
            <span className="material-symbols-outlined">check_circle</span>
            <span>{selectedIds.size} item{selectedIds.size === 1 ? '' : 's'} selected</span>
          </div>
          <button
            onClick={handleBatchDelete}
            disabled={isDeleting}
            className="bg-error text-on-error hover:bg-error/90 font-label-md py-2 px-5 rounded-full font-bold flex items-center gap-1.5 shadow transition-all disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[18px]">{isDeleting ? 'hourglass_empty' : 'delete'}</span>
            {isDeleting ? 'Deleting...' : 'Delete Selected'}
          </button>
        </div>
      )}

      {/* Table Container */}
      <div className="overflow-x-auto bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-sm">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="border-b border-surface-variant bg-surface-container-low text-on-surface-variant font-label-sm text-xs uppercase tracking-wider">
              <th className="py-3.5 px-4 w-12 text-center">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleAll}
                  className="w-4 h-4 rounded border-outline accent-primary cursor-pointer"
                />
              </th>
              <th className="py-3.5 px-4 font-bold">Category</th>
              <th className="py-3.5 px-4 font-bold">Skill Offered</th>
              <th className="py-3.5 px-4 font-bold">Looking For</th>
              <th className="py-3.5 px-4 font-bold">Availability</th>
              <th className="py-3.5 px-4 font-bold">Status</th>
              <th className="py-3.5 px-4 text-right font-bold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-variant/60 font-body-sm text-sm">
            {listings.map((listing) => {
              const isSelected = selectedIds.has(listing.id)
              const isItemDeleting = deletingId === listing.id

              return (
                <tr
                  key={listing.id}
                  className={`transition-colors ${isSelected ? 'bg-primary/5' : 'hover:bg-surface-container-low/50'}`}
                >
                  <td className="py-3.5 px-4 text-center">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleOne(listing.id)}
                      className="w-4 h-4 rounded border-outline accent-primary cursor-pointer"
                    />
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="bg-primary-container text-on-primary-container font-label-sm text-xs px-2.5 py-1 rounded-full font-bold">
                      {listing.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 max-w-[240px]">
                    <p className="font-label-md font-bold text-on-surface truncate" title={listing.title}>{listing.title}</p>
                    <p className="text-on-surface-variant text-xs line-clamp-1 truncate" title={listing.description}>{listing.description}</p>
                  </td>
                  <td className="py-3.5 px-4 text-on-surface-variant max-w-[180px] truncate" title={listing.exchange_preference || 'Open to offers'}>
                    {listing.exchange_preference || 'Open to offers'}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap text-on-surface-variant text-xs font-bold">
                    {listing.availability || 'Flexible'}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="bg-emerald-500/10 text-emerald-600 font-label-sm text-xs px-2 py-0.5 rounded font-bold">
                      {listing.status || 'Active'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap text-right">
                    <button
                      onClick={() => handleSingleDelete(listing.id)}
                      disabled={isItemDeleting || isDeleting}
                      className="inline-flex items-center gap-1 bg-error/10 text-error hover:bg-error hover:text-on-error font-label-sm text-xs py-1.5 px-3 rounded-full transition-colors font-bold disabled:opacity-50"
                    >
                      <span className="material-symbols-outlined text-[14px]">{isItemDeleting ? 'hourglass_empty' : 'delete'}</span>
                      {isItemDeleting ? '...' : 'Delete'}
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
