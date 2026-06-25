import { getProfile } from '@/features/profiles/queries/getProfile'
import { EditProfileForm } from '@/features/profiles/components/EditProfileForm'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

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
      <div className="w-full max-w-3xl mx-auto pt-6 pb-24 px-margin-mobile md:px-0">
        <div className="w-full max-w-2xl bg-surface-container-lowest rounded-3xl p-6 md:p-8 border border-outline-variant/30 shadow-sm relative overflow-hidden">
          <EditProfileForm profile={profile} zones={zones} />
        </div>
      </div>

      <div className="h-xl"></div>
    </>
  )
}
