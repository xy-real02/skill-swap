import { getProfile } from '@/features/profiles/queries/getProfile'
import { EditProfileForm } from '@/features/profiles/components/EditProfileForm'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { TopBar } from '@/components/layout/TopBar'

export const metadata = {
  title: 'Edit Profile | Skill Swap',
  description: 'Update your Skill Swap profile details.',
}

export default async function EditProfilePage() {
  const supabase = await createClient()
  const { data: authData } = await supabase.auth.getUser()
  
  if (!authData.user) {
    redirect('/login')
  }

  const profile = await getProfile(authData.user.id)
  if (!profile) {
    redirect('/login')
  }

  // Fetch dynamic zones from community_settings
  const { data: settings } = await supabase.from('community_settings').select('community_zone_list').maybeSingle()
  const zones = settings?.community_zone_list?.length 
    ? settings.community_zone_list 
    : ['Northside Hub', 'South Market', 'East Village', 'West End']

  return (
    <>
      <TopBar 
        title="Edit Profile"
        description="Update your public identity and contact information."
        backHref={`/profile/me`}
      />
      <div className="pt-6 px-margin-mobile md:px-lg max-w-container-max mx-auto w-full flex-1">

      <div className="max-w-2xl">
        <EditProfileForm profile={profile} zones={zones} />
      </div>

      <div className="h-xl"></div>
      </div>
    </>
  )
}
