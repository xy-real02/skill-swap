'use client'

import { useState } from 'react'
import { CommunitySettings } from '../queries/getCommunitySettings'
import { updateSettings } from '../actions/updateSettings'
import { Save, Plus, Trash2, CheckCircle2, AlertCircle, MapPin, Settings } from 'lucide-react'

export function SettingsForm({ initialSettings }: { initialSettings: CommunitySettings }) {
  const [name, setName] = useState(initialSettings.community_name)
  const [zones, setZones] = useState<string[]>(initialSettings.community_zone_list)
  const [newZone, setNewZone] = useState('')
  const [maxListings, setMaxListings] = useState(initialSettings.max_listings_per_user)
  const [expiryDays, setExpiryDays] = useState(initialSettings.request_expiry_days)
  const [requireApproval, setRequireApproval] = useState(initialSettings.require_approval)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleAddZone = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = newZone.trim()
    if (!trimmed) return
    if (zones.some(z => z.toLowerCase() === trimmed.toLowerCase())) {
      setError('Zone already exists.')
      return
    }
    setZones([...zones, trimmed])
    setNewZone('')
    setError(null)
  }

  const handleRemoveZone = (indexToRemove: number) => {
    if (zones.length <= 1) {
      setError('Platform requires at least one active neighborhood zone.')
      return
    }
    setZones(zones.filter((_, idx) => idx !== indexToRemove))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    const res = await updateSettings({
      communityName: name,
      zoneList: zones,
      maxListings: Number(maxListings),
      expiryDays: Number(expiryDays),
      requireApproval,
    })

    setLoading(false)
    if (res.error) {
      setError(res.error)
    } else {
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl animate-fade-in">
      {error && (
        <div className="flex items-center gap-2 p-4 text-sm font-bold text-error bg-error-container/40 border border-error/40 rounded-2xl shadow-sm">
          <AlertCircle className="w-5 h-5 shrink-0 text-error" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 p-4 text-sm font-bold text-primary bg-secondary-container border border-secondary/40 rounded-2xl shadow-sm animate-scale-up">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-primary" />
          <span>Platform settings and neighborhood zones updated successfully!</span>
        </div>
      )}

      {/* General Settings */}
      <div className="bg-surface border border-outline-variant/40 rounded-3xl p-6 md:p-8 shadow-[0_4px_24px_rgba(45,106,79,0.05)] space-y-6">
        <div className="flex items-center gap-3 text-primary pb-4 border-b border-outline-variant/30">
          <Settings className="w-6 h-6" />
          <h2 className="text-lg font-bold text-on-surface font-headline-sm">General Platform Configuration</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">Platform Community Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/50 rounded-xl text-sm text-on-surface focus:outline-none focus:border-primary font-bold shadow-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">Max Listings Per Member</label>
            <input
              type="number"
              min={1}
              max={100}
              value={maxListings}
              onChange={(e) => setMaxListings(Number(e.target.value))}
              required
              className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/50 rounded-xl text-sm text-on-surface focus:outline-none focus:border-primary font-bold shadow-sm"
            />
            <p className="text-[11px] font-semibold text-on-surface-variant mt-1.5">Prevents marketplace spam</p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">Request Expiry (Days)</label>
            <input
              type="number"
              min={1}
              max={365}
              value={expiryDays}
              onChange={(e) => setExpiryDays(Number(e.target.value))}
              required
              className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/50 rounded-xl text-sm text-on-surface focus:outline-none focus:border-primary font-bold shadow-sm"
            />
            <p className="text-[11px] font-semibold text-on-surface-variant mt-1.5">Auto-expires old requests</p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">Manual Approval</label>
            <label className="relative inline-flex items-center cursor-pointer mt-2">
              <input
                type="checkbox"
                checked={requireApproval}
                onChange={(e) => setRequireApproval(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-surface-container-high peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-outline after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary shadow-inner"></div>
              <span className="ml-3 text-xs font-bold text-on-surface">
                {requireApproval ? 'Required for New Members' : 'Auto-Approve'}
              </span>
            </label>
            <p className="text-[11px] font-semibold text-on-surface-variant mt-1.5">Gated community mode</p>
          </div>
        </div>
      </div>

      {/* Zone Management */}
      <div className="bg-surface border border-outline-variant/40 rounded-3xl p-6 md:p-8 shadow-[0_4px_24px_rgba(45,106,79,0.05)] space-y-6">
        <div className="flex items-center gap-3 text-primary pb-4 border-b border-outline-variant/30">
          <MapPin className="w-6 h-6" />
          <div>
            <h2 className="text-lg font-bold text-on-surface font-headline-sm">Neighborhood Zones</h2>
            <p className="text-xs font-semibold text-on-surface-variant mt-0.5">Members select their active zone during onboarding and exploration.</p>
          </div>
        </div>

        {/* Add Zone */}
        <div className="flex gap-2 max-w-md w-full">
          <input
            type="text"
            value={newZone}
            onChange={(e) => setNewZone(e.target.value)}
            placeholder="New neighborhood zone name..."
            className="flex-1 px-4 py-3 bg-surface-container-low border border-outline-variant/50 rounded-xl text-sm text-on-surface focus:outline-none focus:border-primary placeholder:text-outline shadow-sm font-semibold"
          />
          <button
            type="button"
            onClick={handleAddZone}
            className="px-6 py-3 bg-primary hover:bg-primary-container text-on-primary font-extrabold text-xs rounded-xl shadow-sm flex items-center gap-1 transition-all"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>

        {/* Zone Chips */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
          {zones.map((zone, idx) => (
            <div key={zone} className="flex items-center justify-between p-3.5 bg-surface-container-low border border-outline-variant/40 rounded-2xl group hover:border-primary/40 transition-all shadow-sm">
              <div className="flex items-center gap-2.5 truncate">
                <MapPin className="w-4 h-4 text-primary shrink-0" />
                <span className="text-sm font-bold text-on-surface truncate">{zone}</span>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveZone(idx)}
                title="Remove zone"
                className="text-on-surface-variant hover:text-error p-1 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-3.5 bg-primary hover:bg-primary-container text-on-primary font-extrabold text-sm rounded-2xl shadow-md transition-all flex items-center gap-2 disabled:opacity-50 hover:-translate-y-0.5"
        >
          <Save className="w-5 h-5" />
          <span>{loading ? 'Saving Changes...' : 'Save Configuration'}</span>
        </button>
      </div>
    </form>
  )
}
