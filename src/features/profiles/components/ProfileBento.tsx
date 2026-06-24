import { Profile } from '@/features/profiles/queries/getProfile'
import Link from 'next/link'

export function ProfileBento({
  profile,
  isOwner,
}: {
  profile: Profile
  isOwner: boolean
}) {
  const avatar = profile.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + profile.id
  const totalExchanges = profile.exchange_count || 0
  const isTrusted = profile.reputation_score && profile.reputation_score >= 4.5 && totalExchanges >= 5

  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-gutter mb-xl">
      {/* Main Identity Card */}
      <div className="col-span-1 lg:col-span-8 bg-surface-container-lowest rounded-[24px] p-lg shadow-[4px_0_24px_rgba(45,106,79,0.08)] flex flex-col md:flex-row gap-lg items-center md:items-start relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-secondary-container/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
        
        {/* Avatar */}
        <div className="relative shrink-0">
          <div className="w-[120px] h-[120px] rounded-full p-1 bg-surface-container-lowest border-[3px] border-primary z-10 relative">
            <img 
              src={avatar} 
              alt={profile.full_name} 
              className="w-full h-full rounded-full object-cover" 
            />
          </div>
          
          {/* Badge */}
          {isTrusted && (
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-secondary-container text-primary border border-surface-container-lowest px-3 py-1 rounded-full whitespace-nowrap z-20 flex items-center gap-1 shadow-sm">
              <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
              <span className="font-label-sm text-label-sm font-bold">Trusted Member</span>
            </div>
          )}
          {(profile.role === 'admin' || profile.role === 'moderator') && !isTrusted && (
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-primary text-on-primary border border-surface-container-lowest px-3 py-1 rounded-full whitespace-nowrap z-20 flex items-center gap-1 shadow-sm">
              <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>shield</span>
              <span className="font-label-sm text-label-sm font-bold">Moderator</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left z-10 mt-4 md:mt-0">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="font-headline-md text-[32px] text-on-surface font-bold">{profile.full_name}</h2>
            {isOwner && (
              <span className="bg-surface-container-high text-on-surface-variant px-2 py-0.5 rounded text-[11px] uppercase tracking-wider font-bold">You</span>
            )}
          </div>
          <div className="flex items-center gap-2 text-on-surface-variant font-body-md mb-6">
            <span className="material-symbols-outlined text-secondary text-[18px]">location_on</span>
            <span>{profile.community_zone}</span>
          </div>
          
          <div className="flex flex-wrap gap-6 justify-center md:justify-start">
            {/* Rep */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1 text-primary">
                <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="font-headline-sm text-[24px] font-bold">{profile.reputation_score ? profile.reputation_score.toFixed(1) : 'New'}</span>
              </div>
              <span className="font-label-sm text-label-sm text-on-surface-variant">Rating</span>
            </div>
            
            <div className="w-px h-12 bg-outline-variant hidden md:block"></div>
            
            {/* Stats */}
            <div className="flex flex-col gap-1 justify-center">
              <div className="flex items-center gap-2 text-primary">
                <span className="material-symbols-outlined text-[24px]">handshake</span>
                <span className="font-headline-sm text-[24px] font-bold">{totalExchanges}</span>
              </div>
              <span className="font-label-sm text-label-sm text-on-surface-variant">Exchanges</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        {isOwner && (
          <div className="absolute top-6 right-6 z-20 hidden md:block">
            <Link 
              href="/profile/edit"
              className="bg-surface-container-lowest text-primary font-label-md text-label-md px-4 py-2 border-[1.5px] border-primary rounded-lg hover:bg-secondary-container/50 transition-colors flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">edit</span>
              Edit Profile
            </Link>
          </div>
        )}
      </div>

      {/* Intro / Bio Card */}
      <div className="col-span-1 lg:col-span-4 bg-surface-container-lowest rounded-[24px] p-6 shadow-[4px_0_24px_rgba(45,106,79,0.08)] flex flex-col relative overflow-hidden">
        <h3 className="font-label-md text-label-md text-on-surface-variant mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-secondary">format_quote</span>
          About Me
        </h3>
        <p className="font-body-md text-on-surface leading-relaxed relative z-10 flex-1">
          {profile.bio || "This member hasn't added a bio yet."}
        </p>
        <div className="mt-4 flex items-center gap-2 text-primary font-label-sm text-label-sm">
          <span className="material-symbols-outlined text-[16px]">cycle</span>
          <span>Active recently</span>
        </div>
      </div>
    </section>
  )
}
