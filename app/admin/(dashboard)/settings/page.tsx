'use client'

import { useState } from 'react'
import { Save, Shield, Settings, Users, Globe, ExternalLink } from 'lucide-react'

export default function SettingsPage() {
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)

  const [generalSettings, setGeneralSettings] = useState({
    siteName: 'Travel Hunter',
    siteDescription: 'Discover the hidden gems of Sri Lanka. Explore unique destinations, authentic cuisine, and memorable stays curated by local travel experts.',
    siteKeywords: 'Sri Lanka, travel, destinations, places to visit, where to eat, where to stay',
    contactEmail: 'hello@travelhunter.com',
  })

  const [socialSettings, setSocialSettings] = useState({
    facebook: 'https://facebook.com/travelhunter',
    instagram: 'https://instagram.com/travelhunter',
    youtube: 'https://youtube.com/c/travelhunter',
    twitter: 'https://twitter.com/travelhunter',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    // Simulate saving settings
    setTimeout(() => {
      setSaving(false)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    }, 1000)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Settings</h1>
        <p className="text-sm text-slate-500 mt-1">Configure global website metadata, social media links, and preferences.</p>
      </div>

      {/* Success Banner */}
      {success && (
        <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700/50 text-emerald-700 dark:text-emerald-300 px-4 py-3 rounded-xl text-sm font-medium">
          ✅ Settings saved successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* General Settings */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700/50 p-6 space-y-5">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
            <Globe className="w-5 h-5 text-emerald-500" />
            <h2 className="text-base font-semibold">General Website Settings</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Site Name
              </label>
              <input
                type="text"
                value={generalSettings.siteName}
                onChange={(e) => setGeneralSettings({ ...generalSettings, siteName: e.target.value })}
                className="w-full h-12 px-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Support / Contact Email
              </label>
              <input
                type="email"
                value={generalSettings.contactEmail}
                onChange={(e) => setGeneralSettings({ ...generalSettings, contactEmail: e.target.value })}
                className="w-full h-12 px-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Site Meta Keywords
            </label>
            <input
              type="text"
              value={generalSettings.siteKeywords}
              onChange={(e) => setGeneralSettings({ ...generalSettings, siteKeywords: e.target.value })}
              className="w-full h-12 px-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Site Meta Description
            </label>
            <textarea
              value={generalSettings.siteDescription}
              onChange={(e) => setGeneralSettings({ ...generalSettings, siteDescription: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all resize-y"
            />
          </div>
        </div>

        {/* Social Media */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700/50 p-6 space-y-5">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
            <ExternalLink className="w-5 h-5 text-emerald-500" />
            <h2 className="text-base font-semibold">Social Media Handles</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Facebook URL</label>
              <input
                type="url"
                value={socialSettings.facebook}
                onChange={(e) => setSocialSettings({ ...socialSettings, facebook: e.target.value })}
                className="w-full h-12 px-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Instagram URL</label>
              <input
                type="url"
                value={socialSettings.instagram}
                onChange={(e) => setSocialSettings({ ...socialSettings, instagram: e.target.value })}
                className="w-full h-12 px-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">YouTube Channel URL</label>
              <input
                type="url"
                value={socialSettings.youtube}
                onChange={(e) => setSocialSettings({ ...socialSettings, youtube: e.target.value })}
                className="w-full h-12 px-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Twitter URL</label>
              <input
                type="url"
                value={socialSettings.twitter}
                onChange={(e) => setSocialSettings({ ...socialSettings, twitter: e.target.value })}
                className="w-full h-12 px-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Security / System Info */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700/50 p-6 space-y-4">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
            <Shield className="w-5 h-5 text-emerald-500" />
            <h2 className="text-base font-semibold">Security & Roles Info</h2>
          </div>

          <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            <Users className="w-5 h-5 text-emerald-500 shrink-0" />
            <p>
              Only users with the role of <strong className="text-emerald-600">admin</strong> or <strong className="text-emerald-600">editor</strong> are granted access to write, edit, or delete any content. Standard users have read-only public access.
            </p>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-xl font-medium text-sm hover:shadow-lg hover:shadow-emerald-500/25 transition-all disabled:opacity-50"
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Save Settings
          </button>
        </div>
      </form>
    </div>
  )
}
