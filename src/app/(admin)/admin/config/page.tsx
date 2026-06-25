import { getCommunitySettings } from '@/features/admin/queries/getCommunitySettings'
import { SettingsForm } from '@/features/admin/components/SettingsForm'
import { Sliders } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminConfigPage() {
  const settings = await getCommunitySettings()

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-outline-variant/30">
        <div>
          <h1 className="text-3xl font-extrabold text-on-surface font-headline-md tracking-tight">
            Platform & Neighborhood Settings
          </h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Customize platform parameters, active neighborhood zones, and onboarding gates.
          </p>
        </div>
        <div className="bg-secondary-container border border-secondary/20 px-4 py-2 rounded-2xl text-on-secondary-container font-extrabold text-xs flex items-center gap-2 shadow-sm">
          <Sliders className="w-4 h-4 text-primary" />
          <span>Active Config Loaded</span>
        </div>
      </div>

      <SettingsForm initialSettings={settings} />
    </div>
  )
}
