import { getProfile } from '@/features/profiles/queries/getProfile'
import { getUserListings } from '@/features/profiles/queries/getUserListings'
import { getPublishedReviews } from '@/features/reviews/queries/getPublishedReviews'
import { getUserExchangeHistory } from '@/features/exchanges/queries/getUserExchangeHistory'
import { ProfileBento } from '@/features/profiles/components/ProfileBento'
import { ProfileTabs } from '@/features/profiles/components/ProfileTabs'
import { createClient } from '@/lib/supabase/server'
import { getProfileName } from '@/features/users/queries/getProfileName'
import { notFound, redirect } from 'next/navigation'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const fullName = await getProfileName(resolvedParams.id)
  return {
    title: `${fullName || 'Member'} | Skill Swap Profile`,
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

  const [profile, listings, reviews, history] = await Promise.all([
    getProfile(targetId),
    getUserListings(targetId),
    getPublishedReviews(targetId),
    getUserExchangeHistory(targetId)
  ])

  if (!profile) {
    notFound()
  }

  const isOwner = authData.user.id === targetId

  return (
    <div className="w-full">
      <ProfileBento profile={profile} isOwner={isOwner} />

      <ProfileTabs 
        listings={listings} 
        reviews={reviews} 
        history={history}
        isOwner={isOwner}
        currentUserId={authData.user.id}
        profileId={targetId}
      />

      <div className="h-xl"></div>
    </div>
  )
}
