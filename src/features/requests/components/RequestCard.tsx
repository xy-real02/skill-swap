'use client'

import Link from 'next/link'
import { RequestWithProfile } from '../queries/getActiveRequests'

export function RequestCard({ request, currentUserId }: { request: RequestWithProfile, currentUserId?: string }) {
  const isOwner = currentUserId === request.owner_id
  
  // Calculate expiration text
  const expiresAt = request.expires_at ? new Date(request.expires_at) : new Date()
  const daysLeft = Math.ceil((expiresAt.getTime() - new Date().getTime()) / (1000 * 3600 * 24))
  const isExpiringSoon = daysLeft <= 3

  return (
    <article className="flex flex-col bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 hover:shadow-md transition-shadow group h-full">
      <div className="flex justify-between items-start mb-4">
        <span className="bg-primary-container text-on-primary-container font-label-sm text-label-sm px-3 py-1 rounded-full font-bold">
          {request.category}
        </span>
        <span className={`font-label-sm text-label-sm px-3 py-1 rounded-full font-bold flex items-center gap-1 ${isExpiringSoon ? 'bg-error-container text-on-error-container' : 'bg-surface-variant text-on-surface-variant'}`}>
          <span className="material-symbols-outlined text-[16px]">schedule</span>
          {daysLeft > 0 ? `Expires in ${daysLeft} days` : 'Expired'}
        </span>
      </div>
      
      <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2 font-bold line-clamp-2">
        {request.title}
      </h3>
      
      <p className="font-body-md text-body-md text-on-surface-variant mb-6 line-clamp-3 flex-grow">
        {request.description}
      </p>
      
      <div className="bg-surface-container rounded-xl p-4 mb-6">
        <h4 className="font-label-sm text-label-sm text-on-surface font-bold mb-1">Offering in return:</h4>
        <p className="font-body-sm text-body-sm text-on-surface-variant">{request.offered_in_return}</p>
        
        {request.desired_timeframe && (
          <div className="mt-3 pt-3 border-t border-outline-variant/30">
            <h4 className="font-label-sm text-label-sm text-on-surface font-bold mb-1">Desired timeframe:</h4>
            <p className="font-body-sm text-body-sm text-on-surface-variant">{request.desired_timeframe}</p>
          </div>
        )}
      </div>
      
      <div className="flex items-center justify-between mt-auto pt-4 border-t border-surface-variant">
        <Link href={`/profile/${request.owner_id}`} className="flex items-center gap-3 group/profile">
          <img 
            src={request.profiles.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + request.owner_id} 
            alt={request.profiles.full_name} 
            className="w-10 h-10 rounded-full object-cover border-2 border-transparent group-hover/profile:border-primary transition-colors"
          />
          <div>
            <p className="font-label-md text-label-md text-on-surface font-bold group-hover/profile:text-primary transition-colors">
              {request.profiles.full_name}
            </p>
            <div className="flex items-center gap-1 text-on-surface-variant font-label-sm text-[11px]">
              <span className="material-symbols-outlined text-[14px]">star</span>
              {request.profiles.reputation_score?.toFixed(1) || 'New'}
              <span className="mx-1">•</span>
              {request.profiles.community_zone}
            </div>
          </div>
        </Link>
        
        {!isOwner && currentUserId && daysLeft > 0 && (
          <Link 
            href={`?tab=requests&modal=propose-request&requestId=${request.id}&providerId=${request.owner_id}&title=${encodeURIComponent(request.title)}`}
            className="bg-primary text-on-primary hover:bg-primary/90 font-label-md text-label-md py-2 px-4 rounded-full transition-colors whitespace-nowrap"
          >
            I Can Help
          </Link>
        )}
        
        {(!currentUserId || isOwner || daysLeft <= 0) && (
          <Link 
            href={`/requests/${request.id}`}
            className="text-primary hover:bg-primary-container font-label-md text-label-md py-2 px-4 rounded-full transition-colors whitespace-nowrap"
          >
            View Details
          </Link>
        )}
      </div>
    </article>
  )
}
