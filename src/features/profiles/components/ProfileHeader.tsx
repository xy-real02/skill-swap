import { Profile } from '@/features/profiles/queries/getProfile'

export function ProfileHeader({
  profile,
  isOwner,
}: {
  profile: Profile
  isOwner: boolean
}) {
  return (
    <div className="bg-surface-container-lowest rounded-2xl p-6 sm:p-8 shadow-sm border border-outline-variant/30 flex flex-col md:flex-row gap-6 md:items-center relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
      
      {/* Avatar */}
      <div className="shrink-0 relative">
        <img 
          src={profile.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + profile.id}
          alt={profile.full_name}
          className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-surface shadow-md"
        />
        {profile.role === 'admin' || profile.role === 'moderator' ? (
          <div className="absolute -bottom-2 -right-2 bg-primary text-on-primary rounded-full p-1.5 border-4 border-surface shadow-sm" title="Community Moderator">
            <span className="material-symbols-outlined text-[18px]">shield</span>
          </div>
        ) : null}
      </div>

      {/* Profile Info */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
          <h1 className="font-display-sm text-[28px] sm:text-[32px] text-on-surface font-bold truncate">
            {profile.full_name}
          </h1>
          {isOwner && (
            <span className="inline-flex items-center gap-1 bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full font-label-sm text-label-sm">
              <span className="material-symbols-outlined text-[14px]">person</span>
              Your Profile
            </span>
          )}
        </div>
        
        <p className="font-body-md text-on-surface-variant mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px] text-primary">location_on</span>
          {profile.community_zone}
        </p>

        {profile.bio && (
          <p className="font-body-md text-on-surface/90 max-w-2xl leading-relaxed mb-6">
            {profile.bio}
          </p>
        )}

        {/* Stats Row */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-8">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-tertiary-container flex items-center justify-center text-on-tertiary-container">
              <span className="material-symbols-outlined">star</span>
            </div>
            <div>
              <p className="font-headline-sm text-[16px] text-on-surface font-bold">{profile.reputation_score || 0}</p>
              <p className="font-label-sm text-on-surface-variant">Reputation</p>
            </div>
          </div>

          <div className="w-px h-8 bg-outline-variant/30 hidden sm:block"></div>

          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container">
              <span className="material-symbols-outlined">handshake</span>
            </div>
            <div>
              <p className="font-headline-sm text-[16px] text-on-surface font-bold">{profile.exchange_count || 0}</p>
              <p className="font-label-sm text-on-surface-variant">Exchanges</p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      {isOwner && (
        <div className="mt-4 md:mt-0 self-start md:self-center">
          <button className="flex items-center gap-2 bg-surface text-on-surface font-label-md text-label-md font-bold py-2.5 px-4 rounded-lg border-[1.5px] border-outline hover:bg-surface-container-highest transition-colors shadow-sm">
            <span className="material-symbols-outlined text-[20px]">edit</span>
            Edit Profile
          </button>
        </div>
      )}
    </div>
  )
}
