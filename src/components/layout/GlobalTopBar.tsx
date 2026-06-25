'use client'

import { usePathname } from 'next/navigation'
import { TopBar } from './TopBar'

export function GlobalTopBar() {
  const pathname = usePathname()

  let title = ''
  let description = ''
  let backHref: string | undefined = undefined

  if (pathname === '/explore') {
    title = 'Explore Community Skills'
    description = 'Discover what your neighbors are sharing today.'
  } else if (pathname === '/listings') {
    title = 'My Listings'
    description = 'Manage the skills you are offering.'
  } else if (pathname === '/listings/create') {
    title = 'Share a Skill'
    description = 'Offer your expertise to the community.'
    backHref = '/explore'
  } else if (pathname === '/requests/create') {
    title = 'Request a Skill'
    description = 'Ask for help with something you need.'
    backHref = '/explore'
  } else if (pathname === '/exchanges') {
    title = 'My Exchanges'
    description = 'Manage your active, pending, and past skill swaps.'
  } else if (pathname === '/messages') {
    title = 'Messages'
    description = 'Chat with your neighbors and organize exchanges.'
  } else if (pathname === '/profile/edit') {
    title = 'Edit Profile'
    description = 'Update your personal information and skills.'
    backHref = '/profile/me'
  } else if (pathname === '/notifications') {
    title = 'Notifications'
    description = 'Stay up to date with your community activity.'
  } else if (pathname.startsWith('/moderator')) {
    title = 'Mod Portal'
    description = 'Review community reports and maintain town square safety.'
  } else {
    // Dynamic Routes
    const exchangeMatch = pathname.match(/^\/exchanges\/([^/]+)$/)
    if (exchangeMatch) {
      title = 'Exchange Details'
      description = 'View conversation and status of this exchange.'
      backHref = '/exchanges'
    }

    const reviewMatch = pathname.match(/^\/exchanges\/([^/]+)\/review$/)
    if (reviewMatch) {
      title = 'Leave a Review'
      description = 'Share your experience with this exchange.'
      backHref = `/exchanges/${reviewMatch[1]}`
    }

    const proposeListingMatch = pathname.match(/^\/listings\/([^/]+)\/propose$/)
    if (proposeListingMatch) {
      title = 'Propose Exchange'
      backHref = `/listings/${proposeListingMatch[1]}`
    }

    const proposeRequestMatch = pathname.match(/^\/requests\/([^/]+)\/propose$/)
    if (proposeRequestMatch) {
      title = 'Propose Exchange'
      backHref = `/requests/${proposeRequestMatch[1]}`
    }
  }

  // If no title matches, we don't render the topbar (e.g., perhaps an unknown page or 404)
  if (!title) return null

  return <TopBar title={title} description={description} backHref={backHref} />
}
