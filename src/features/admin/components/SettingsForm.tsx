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
        <div className="flex items-center gap-2 p-4 text-sm text-red-300 bg-red-950/80 border border-red-800 rounded-2xl shadow">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 p-4 text-sm text-emerald-300 bg-emerald-950/80 border border-emerald-800 rounded-2xl shadow animate-scale-up">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
          <span>Platform settings and neighborhood zones updated successfully!</span>
        </div>
      )}

      {/* General Settings */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
        <div className="flex items-center gap-3 text-amber-400 pb-4 border-b border-slate-800">
          <Settings className="w-6 h-6" />
          <h2 className="text-lg font-bold text-white">General Platform Configuration</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-3">
            <label className="block text-xs font-semibold uppercase text-slate-300 mb-2">Platform Community Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-300 mb-2">Max Listings Per Member</label>
            <input
              type="number"
              min={1}
              max={100}
              value={maxListings}
              onChange={(e) => setMaxListings(Number(e.target.value))}
              required
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500 font-bold"
            />
            <p className="text-[11px] text-slate-500 mt-1">Prevents marketplace spam</p>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-300 mb-2">Request Expiry (Days)</label>
            <input
              type="number"
              min={1}
              max={365}
              value={expiryDays}
              onChange={(e) => setExpiryDays(Number(e.target.value))}
              required
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500 font-bold"
            />
            <p className="text-[11px] text-slate-500 mt-1">Auto-expires old requests</p>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-300 mb-2">Manual Approval</label>
            <label className="relative inline-flex items-center cursor-pointer mt-2">
              <input
                type="checkbox"
                checked={requireApproval}
                onChange={(e) => setRequireApproval(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
              <span className="ml-3 text-xs font-semibold text-slate-300">
                {requireApproval ? 'Required for New Members' : 'Auto-Approve'}
              </span>
            </label>
            <p className="text-[11px] text-slate-500 mt-1">Gated community mode</p>
          </div>
        </div>
      </div>

      {/* Zone Management */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
        <div className="flex items-center gap-3 text-emerald-400 pb-4 border-b border-slate-800">
          <MapPin className="w-6 h-6" />
          <div>
            <h2 className="text-lg font-bold text-white">Neighborhood Zones</h2>
            <p className="text-xs text-slate-400 mt-0.5">Members select their active zone during onboarding and exploration.</p>
          </div>
        </div>

        {/* Add Zone */}
        <div className="flex gap-2 max-w-md w-full">
          <input
            type="text"
            value={newZone}
            onChange={(e) => setNewZone(e.target.value)}
            placeholder="New neighborhood zone name..."
            className="flex-1 px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500 placeholder:text-slate-600 shadow-inner"
          />
          <button
            type="button"
            onClick={handleAddZone}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl border border-emerald-500 shadow-lg shadow-emerald-600/20 flex items-center gap-1 transition-all"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>

        {/* Zone Chips */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
          {zones.map((zone, idx) => (
            <div key={zone} className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800/80 rounded-xl group hover:border-slate-700 transition-all">
              <div className="flex items-center gap-2 truncate">
                <MapPin className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="text-sm font-semibold text-slate-200 truncate">{zone}</span>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveZone(idx)}
                title="Remove zone"
                className="text-slate-500 hover:text-red-400 p-1 rounded transition-colors"
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
          className="px-8 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm rounded-2xl shadow-xl shadow-amber-500/10 transition-all flex items-center gap-2 disabled:opacity-50"
        >
          <Save className="w-5 h-5" />
          <span>{loading ? 'Saving Changes...' : 'Save Configuration'}</span>
        </button>
      </div>
    </form>
  )
}
