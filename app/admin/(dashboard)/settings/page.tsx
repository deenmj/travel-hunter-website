'use client'

import { useState, useEffect } from 'react'
import {
  Save,
  Shield,
  Users,
  Globe,
  ExternalLink,
  Phone,
  Mail,
  MapPin,
  ImageIcon,
  Loader2,
} from 'lucide-react'
import ImageUpload from '@/components/admin/ImageUpload'
import { getSiteSettingsAdmin, updateSiteSettings } from '@/lib/admin-actions'

export default function SettingsPage() {
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [generalSettings, setGeneralSettings] = useState({
    siteName: 'Travel Hunter',
    siteDescription:
      'Discover the hidden gems of Sri Lanka. Explore unique destinations, authentic cuisine, and memorable stays curated by local travel experts.',
    siteKeywords:
      'Sri Lanka, travel, destinations, places to visit, where to eat, where to stay',
  })

  const [heroImage, setHeroImage] = useState('')

  const [contactSettings, setContactSettings] = useState({
    phone: '+94 778 363 959',
    email: 'travelhunterlk@gmail.com',
    address: '188, Kurugoda, Akurana, Kandy, 20850',
  })

  const [socialSettings, setSocialSettings] = useState({
    youtube: '',
    instagram: '',
    facebook: '',
    tiktok: '',
  })

  // Load settings from Supabase on mount
  useEffect(() => {
    async function loadSettings() {
      try {
        const result = await getSiteSettingsAdmin()
        if (result.data) {
          setHeroImage(result.data.hero_image || '')
          setContactSettings({
            phone: result.data.contact_phone || '',
            email: result.data.contact_email || '',
            address: result.data.contact_address || '',
          })
          setSocialSettings({
            youtube: result.data.youtube_url || '',
            instagram: result.data.instagram_url || '',
            facebook: result.data.facebook_url || '',
            tiktok: result.data.tiktok_url || '',
          })
        }
      } catch (err) {
        console.error('Failed to load settings:', err)
      } finally {
        setLoading(false)
      }
    }
    loadSettings()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      const result = await updateSiteSettings({
        hero_image: heroImage,
        contact_phone: contactSettings.phone,
        contact_email: contactSettings.email,
        contact_address: contactSettings.address,
        youtube_url: socialSettings.youtube,
        instagram_url: socialSettings.instagram,
        facebook_url: socialSettings.facebook,
        tiktok_url: socialSettings.tiktok,
      })

      if (result.error) {
        setError(result.error)
      } else {
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
          <p className="text-sm text-slate-500">Loading settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Website Settings</h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage your hero image, contact information, social links, and global metadata.
        </p>
      </div>

      {/* Success Banner */}
      {success && (
        <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700/50 text-emerald-700 dark:text-emerald-300 px-4 py-3 rounded-xl text-sm font-medium animate-fade-in">
          ✅ Settings saved successfully!
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700/50 text-red-700 dark:text-red-300 px-4 py-3 rounded-xl text-sm font-medium">
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Hero Background Image */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700/50 p-6 space-y-5">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
            <ImageIcon className="w-5 h-5 text-emerald-500" />
            <h2 className="text-base font-semibold">Hero Background Image</h2>
          </div>
          <p className="text-sm text-slate-500">
            This image appears as the main background on the homepage hero section. Upload a
            high-resolution landscape image for best results.
          </p>
          <ImageUpload
            value={heroImage}
            onChange={(url) => setHeroImage(url)}
            label="Hero Background Image"
          />
        </div>

        {/* Contact Information */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700/50 p-6 space-y-5">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
            <Phone className="w-5 h-5 text-emerald-500" />
            <h2 className="text-base font-semibold">Contact Information</h2>
          </div>
          <p className="text-sm text-slate-500">
            This information will be displayed in the website footer and contact bar.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  Phone Number
                </span>
              </label>
              <input
                type="tel"
                value={contactSettings.phone}
                onChange={(e) =>
                  setContactSettings({ ...contactSettings, phone: e.target.value })
                }
                placeholder="+94 778 363 959"
                className="w-full h-12 px-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  Email Address
                </span>
              </label>
              <input
                type="email"
                value={contactSettings.email}
                onChange={(e) =>
                  setContactSettings({ ...contactSettings, email: e.target.value })
                }
                placeholder="travelhunterlk@gmail.com"
                className="w-full h-12 px-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                Address
              </span>
            </label>
            <input
              type="text"
              value={contactSettings.address}
              onChange={(e) =>
                setContactSettings({ ...contactSettings, address: e.target.value })
              }
              placeholder="188, Kurugoda, Akurana, Kandy, 20850"
              className="w-full h-12 px-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all"
            />
          </div>
        </div>

        {/* Social Media Links */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700/50 p-6 space-y-5">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
            <ExternalLink className="w-5 h-5 text-emerald-500" />
            <h2 className="text-base font-semibold">Social Media Links</h2>
          </div>
          <p className="text-sm text-slate-500">
            Add your social media profile URLs. Only links with a URL will be shown on the website.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                <span className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z" />
                    <path d="M9.545 15.568V8.432L15.818 12l-6.273 3.568z" fill="white" />
                  </svg>
                  YouTube Channel
                </span>
              </label>
              <input
                type="url"
                value={socialSettings.youtube}
                onChange={(e) =>
                  setSocialSettings({ ...socialSettings, youtube: e.target.value })
                }
                placeholder="https://youtube.com/@yourchannel"
                className="w-full h-12 px-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                <span className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-pink-500" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                  Instagram
                </span>
              </label>
              <input
                type="url"
                value={socialSettings.instagram}
                onChange={(e) =>
                  setSocialSettings({ ...socialSettings, instagram: e.target.value })
                }
                placeholder="https://instagram.com/yourpage"
                className="w-full h-12 px-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                <span className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  Facebook
                </span>
              </label>
              <input
                type="url"
                value={socialSettings.facebook}
                onChange={(e) =>
                  setSocialSettings({ ...socialSettings, facebook: e.target.value })
                }
                placeholder="https://facebook.com/yourpage"
                className="w-full h-12 px-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                <span className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-slate-800 dark:text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                  TikTok
                </span>
              </label>
              <input
                type="url"
                value={socialSettings.tiktok}
                onChange={(e) =>
                  setSocialSettings({ ...socialSettings, tiktok: e.target.value })
                }
                placeholder="https://tiktok.com/@yourpage"
                className="w-full h-12 px-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all"
              />
            </div>
          </div>
        </div>

        {/* General Website Settings */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700/50 p-6 space-y-5">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
            <Globe className="w-5 h-5 text-emerald-500" />
            <h2 className="text-base font-semibold">General Website Settings</h2>
          </div>
          <p className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-3 py-2 rounded-lg">
            💡 These fields are for reference only. Site name, description, and keywords are configured in the codebase.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Site Name
              </label>
              <input
                type="text"
                value={generalSettings.siteName}
                onChange={(e) =>
                  setGeneralSettings({ ...generalSettings, siteName: e.target.value })
                }
                className="w-full h-12 px-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all"
                disabled
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Site Meta Keywords
              </label>
              <input
                type="text"
                value={generalSettings.siteKeywords}
                onChange={(e) =>
                  setGeneralSettings({ ...generalSettings, siteKeywords: e.target.value })
                }
                className="w-full h-12 px-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all"
                disabled
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Site Meta Description
            </label>
            <textarea
              value={generalSettings.siteDescription}
              onChange={(e) =>
                setGeneralSettings({ ...generalSettings, siteDescription: e.target.value })
              }
              rows={3}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all resize-y"
              disabled
            />
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
              Only users with the role of{' '}
              <strong className="text-emerald-600">admin</strong> or{' '}
              <strong className="text-emerald-600">editor</strong> are granted access to write,
              edit, or delete any content. Standard users have read-only public access.
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
