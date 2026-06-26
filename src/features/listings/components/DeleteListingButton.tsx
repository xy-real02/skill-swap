'use client'

import { useState } from 'react'
import { deleteListing } from '@/features/listings/actions/deleteListing'

export function DeleteListingButton({ listingId }: { listingId: string }) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this listing? This action cannot be undone.')) {
      return
    }

    setIsDeleting(true)
    try {
      await deleteListing(listingId)
    } catch (error) {
      console.error(error)
      alert('Failed to delete listing. Please try again.')
      setIsDeleting(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="w-full bg-error/10 text-error font-label-md text-label-md font-bold py-3 px-4 rounded-lg hover:bg-error/20 transition-colors flex items-center justify-center gap-2 mt-2 shadow-sm disabled:opacity-50"
    >
      <span className="material-symbols-outlined">{isDeleting ? 'hourglass_empty' : 'delete'}</span>
      {isDeleting ? 'Deleting...' : 'Delete Listing'}
    </button>
  )
}
