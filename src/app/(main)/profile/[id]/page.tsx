import { getProfile } from '@/features/profiles/queries/getProfile'
import { getUserListings } from '@/features/profiles/queries/getUserListings'
import { ProfileHeader } from '@/features/profiles/components/ProfileHeader'
import { ListingCard } from '@/features/listings/components/ListingCard'
import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  
  // Quick profile fetch for metadata
  // We can't use getProfile here as it depends on auth state and might nullify fields, 
  // but we only need full_name anyway.
  const supabase = await createClient()
  const { data } = await supabase.from('profiles').select('full_name').eq('id', resolvedParams.id).single()
  
  return {
    title: `${data?.full_name || 'Member'} | Skill Swap Profile`,
  }
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = await params
  
  const supabase = await createClient()
  const { data: authData } = await supabase.auth.getUser()
  if (!authData.user) {
    redirect('/login')
  }

  // Handle the special "me" parameter
  const targetId = resolvedParams.id === 'me' ? authData.user.id : resolvedParams.id

  if (resolvedParams.id === 'me') {
    redirect(`/profile/${authData.user.id}`)
  }

  const [profile, listings] = await Promise.all([
    getProfile(targetId),
    getUserListings(targetId)
  ])

  if (!profile) {
    notFound()
  }

  const isOwner = authData.user.id === targetId

  return (
    <div className="pt-6 px-margin-mobile md:px-lg max-w-container-max mx-auto w-full flex-1">
      {/* Top Section: Profile Header */}
      <ProfileHeader profile={profile} isOwner={isOwner} />

      {/* Bottom Section: Active Listings */}
      <div className="mt-12">
        <h2 className="font-headline-sm text-[22px] text-on-surface font-bold mb-6 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">campaign</span>
          {isOwner ? 'Your Active Listings' : `${profile.full_name.split(' ')[0]}'s Listings`}
        </h2>

        {listings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-sm">
            <div className="bg-secondary-container/50 text-primary w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-[32px]">inventory_2</span>
            </div>
            <h3 className="font-headline-sm text-on-surface mb-2 font-bold text-center">No active listings</h3>
            <p className="font-body-md text-on-surface-variant text-center max-w-md">
              {isOwner 
                ? "You haven't posted any skills to share with the community yet."
                : "This member doesn't have any active listings right now."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </div>

      <div className="h-xl"></div>
    </div>
  )
}
