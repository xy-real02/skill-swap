import { getCommunitySettings } from '@/features/admin/queries/getCommunitySettings'
import { SettingsForm } from '@/features/admin/components/SettingsForm'
import { Sliders } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminConfigPage() {
  const settings = await getCommunitySettings()

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white font-headline-md tracking-tight">
            Platform & Neighborhood Settings
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Customize platform parameters, active neighborhood zones, and onboarding gates.
          </p>
        </div>
        <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl text-slate-300 font-bold text-sm flex items-center gap-2">
          <Sliders className="w-4 h-4 text-emerald-400" />
          <span>Active Config Loaded</span>
        </div>
      </div>

      <SettingsForm initialSettings={settings} />
    </div>
  )
}
