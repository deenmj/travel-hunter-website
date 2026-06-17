'use client'

import { useState, useEffect } from 'react'
import {
  Save,
  Loader2,
  ImageIcon,
  FileText,
  BarChart,
  ExternalLink,
  Phone,
  Mail,
  MapPin,
} from 'lucide-react'
import ImageUpload from '@/components/admin/ImageUpload'
import { getAboutPageDataAdmin, updateAboutPageData } from '@/lib/admin-actions'

export default function AboutSettingsPage() {
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [heroSettings, setHeroSettings] = useState({
    tagline: '',
    title: '',
    description: '',
    imageUrl: '',
  })

  const [storySettings, setStorySettings] = useState({
    title: '',
    content: '',
  })

  const [statsSettings, setStatsSettings] = useState({
    youtube: '',
    videos: '',
    places: '',
    community: '',
  })

  const [socialSettings, setSocialSettings] = useState({
    youtube: '',
    instagram: '',
    facebook: '',
    tiktok: '',
  })

  const [contactSettings, setContactSettings] = useState({
    phone: '',
    email: '',
    address: '',
  })

  // Load settings from Supabase on mount
  useEffect(() => {
    async function loadSettings() {
      try {
        const result = await getAboutPageDataAdmin()
        if (result.data) {
          setHeroSettings({
            tagline: result.data.hero_tagline || '',
            title: result.data.hero_title || '',
            description: result.data.hero_description || '',
            imageUrl: result.data.hero_image_url || '',
          })
          setStorySettings({
            title: result.data.story_title || '',
            content: result.data.story_content || '',
          })
          setStatsSettings({
            youtube: result.data.youtube_subscribers || '',
            videos: result.data.videos_created || '',
            places: result.data.places_explored || '',
            community: result.data.community_members || '',
          })
          setSocialSettings({
            youtube: result.data.youtube_url || '',
            instagram: result.data.instagram_url || '',
            facebook: result.data.facebook_url || '',
            tiktok: result.data.tiktok_url || '',
          })
          setContactSettings({
            phone: result.data.contact_phone || '',
            email: result.data.contact_email || '',
            address: result.data.contact_address || '',
          })
        }
      } catch (err) {
        console.error('Failed to load about page settings:', err)
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
      const result = await updateAboutPageData({
        hero_tagline: heroSettings.tagline,
        hero_title: heroSettings.title,
        hero_description: heroSettings.description,
        hero_image_url: heroSettings.imageUrl,
        story_title: storySettings.title,
        story_content: storySettings.content,
        youtube_subscribers: statsSettings.youtube,
        videos_created: statsSettings.videos,
        places_explored: statsSettings.places,
        community_members: statsSettings.community,
        youtube_url: socialSettings.youtube,
        instagram_url: socialSettings.instagram,
        facebook_url: socialSettings.facebook,
        tiktok_url: socialSettings.tiktok,
        contact_email: contactSettings.email,
        contact_phone: contactSettings.phone,
        contact_address: contactSettings.address,
      })

      if (result.error) {
        setError(result.error)
      } else {
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save about page settings')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
          <p className="text-sm text-slate-500">Loading about page settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">About Page Settings</h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage all content displayed on the public About page.
        </p>
      </div>

      {/* Success Banner */}
      {success && (
        <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700/50 text-emerald-700 dark:text-emerald-300 px-4 py-3 rounded-xl text-sm font-medium animate-fade-in">
          ✅ About page updated successfully!
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700/50 text-red-700 dark:text-red-300 px-4 py-3 rounded-xl text-sm font-medium">
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Hero Section */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700/50 p-6 space-y-5">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
            <ImageIcon className="w-5 h-5 text-emerald-500" />
            <h2 className="text-base font-semibold">Hero Section</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Tagline
              </label>
              <input
                type="text"
                value={heroSettings.tagline}
                onChange={(e) => setHeroSettings({ ...heroSettings, tagline: e.target.value })}
                className="w-full h-12 px-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Title
              </label>
              <input
                type="text"
                value={heroSettings.title}
                onChange={(e) => setHeroSettings({ ...heroSettings, title: e.target.value })}
                className="w-full h-12 px-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Description
            </label>
            <textarea
              value={heroSettings.description}
              onChange={(e) => setHeroSettings({ ...heroSettings, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 resize-y"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Hero Image
            </label>
            <ImageUpload
              value={heroSettings.imageUrl}
              onChange={(url) => setHeroSettings({ ...heroSettings, imageUrl: url })}
              label="Hero Image"
            />
          </div>
        </div>

        {/* Story Section */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700/50 p-6 space-y-5">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
            <FileText className="w-5 h-5 text-emerald-500" />
            <h2 className="text-base font-semibold">Story Section</h2>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Story Title
            </label>
            <input
              type="text"
              value={storySettings.title}
              onChange={(e) => setStorySettings({ ...storySettings, title: e.target.value })}
              className="w-full h-12 px-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Story Content (Paragraphs)
            </label>
            <p className="text-xs text-slate-500">Separate paragraphs with double newlines (Press Enter twice).</p>
            <textarea
              value={storySettings.content}
              onChange={(e) => setStorySettings({ ...storySettings, content: e.target.value })}
              rows={8}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 resize-y"
            />
          </div>
        </div>

        {/* Journey Stats */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700/50 p-6 space-y-5">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
            <BarChart className="w-5 h-5 text-emerald-500" />
            <h2 className="text-base font-semibold">Journey Stats</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                YT Subscribers
              </label>
              <input
                type="text"
                value={statsSettings.youtube}
                onChange={(e) => setStatsSettings({ ...statsSettings, youtube: e.target.value })}
                className="w-full h-12 px-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Videos Created
              </label>
              <input
                type="text"
                value={statsSettings.videos}
                onChange={(e) => setStatsSettings({ ...statsSettings, videos: e.target.value })}
                className="w-full h-12 px-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Places Explored
              </label>
              <input
                type="text"
                value={statsSettings.places}
                onChange={(e) => setStatsSettings({ ...statsSettings, places: e.target.value })}
                className="w-full h-12 px-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Community
              </label>
              <input
                type="text"
                value={statsSettings.community}
                onChange={(e) => setStatsSettings({ ...statsSettings, community: e.target.value })}
                className="w-full h-12 px-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700/50 p-6 space-y-5">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
            <ExternalLink className="w-5 h-5 text-emerald-500" />
            <h2 className="text-base font-semibold">Social Links</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">YouTube</label>
              <input
                type="url"
                value={socialSettings.youtube}
                onChange={(e) => setSocialSettings({ ...socialSettings, youtube: e.target.value })}
                className="w-full h-12 px-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Instagram</label>
              <input
                type="url"
                value={socialSettings.instagram}
                onChange={(e) => setSocialSettings({ ...socialSettings, instagram: e.target.value })}
                className="w-full h-12 px-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Facebook</label>
              <input
                type="url"
                value={socialSettings.facebook}
                onChange={(e) => setSocialSettings({ ...socialSettings, facebook: e.target.value })}
                className="w-full h-12 px-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">TikTok</label>
              <input
                type="url"
                value={socialSettings.tiktok}
                onChange={(e) => setSocialSettings({ ...socialSettings, tiktok: e.target.value })}
                className="w-full h-12 px-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700/50 p-6 space-y-5">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
            <Mail className="w-5 h-5 text-emerald-500" />
            <h2 className="text-base font-semibold">Contact Information</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-slate-400" />Phone Number</span>
              </label>
              <input
                type="tel"
                value={contactSettings.phone}
                onChange={(e) => setContactSettings({ ...contactSettings, phone: e.target.value })}
                className="w-full h-12 px-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-slate-400" />Email Address</span>
              </label>
              <input
                type="email"
                value={contactSettings.email}
                onChange={(e) => setContactSettings({ ...contactSettings, email: e.target.value })}
                className="w-full h-12 px-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-slate-400" />Address</span>
            </label>
            <input
              type="text"
              value={contactSettings.address}
              onChange={(e) => setContactSettings({ ...contactSettings, address: e.target.value })}
              className="w-full h-12 px-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            />
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
            Save About Page
          </button>
        </div>
      </form>
    </div>
  )
}
