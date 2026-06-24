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

  const profile = await getProfile('me')
  if (!profile) {
    redirect('/login')
  }

  // Fetch dynamic zones from community_settings
  const { data: settings } = await supabase.from('community_settings').select('community_zone_list').maybeSingle()
  const zones = settings?.community_zone_list?.length 
    ? settings.community_zone_list 
    : ['Northside Hub', 'South Market', 'East Village', 'West End']

  return (
    <div className="pt-6 px-margin-mobile md:px-lg max-w-container-max mx-auto w-full flex-1">
      <div className="mb-8">
        <Link 
          href={`/profile/${profile.id}`} 
          className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors font-label-md mb-4"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Back to Profile
        </Link>
        <h1 className="font-display-lg-mobile md:font-display-lg text-primary mb-2">
          Edit Profile
        </h1>
        <p className="font-body-lg text-on-surface-variant">
          Update your public identity and contact information.
        </p>
      </div>

      <div className="max-w-2xl">
        <EditProfileForm profile={profile} zones={zones} />
      </div>

      <div className="h-xl"></div>
    </div>
  )
}
