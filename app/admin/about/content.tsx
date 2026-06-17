'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronLeft, Save, AlertCircle } from 'lucide-react'

export interface AboutPageData {
  id: string
  hero_tagline: string
  hero_title: string
  hero_description: string
  hero_image_url: string
  story_title: string
  story_content: string
  youtube_subscribers: string
  videos_created: string
  places_explored: string
  community_members: string
  youtube_url: string
  instagram_url: string
  facebook_url: string
  tiktok_url: string
  contact_email: string
  contact_phone: string
  contact_address: string
  updated_at: string
  created_at: string
}

const DEFAULT_ABOUT_DATA: AboutPageData = {
  id: '',
  hero_tagline: "Sri Lanka's Travel Hunter",
  hero_title: 'Discover Sri Lanka With Me',
  hero_description: 'Exploring hidden gems, authentic experiences, and unforgettable adventures across the island.',
  hero_image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=700&h=800&fit=crop',
  story_title: 'The Journey Begins',
  story_content: 'My passion for travel started with a simple question: "What if I could help others discover Sri Lanka the way I see it?" What began as personal travel videos has blossomed into a thriving community of over 250K subscribers.',
  youtube_subscribers: '250K+',
  videos_created: '500+',
  places_explored: '150+',
  community_members: '500K+',
  youtube_url: 'https://youtube.com',
  instagram_url: 'https://instagram.com',
  facebook_url: 'https://facebook.com',
  tiktok_url: 'https://tiktok.com',
  contact_email: 'travelhunterlk@gmail.com',
  contact_phone: '+94 (123) 456-789',
  contact_address: 'Sri Lanka',
  updated_at: new Date().toISOString(),
  created_at: new Date().toISOString(),
}

export default function AdminAboutContent() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState<AboutPageData>(DEFAULT_ABOUT_DATA)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { createClient } = await import('@/lib/supabase/client')
        const supabase = createClient()

        const { data, error: fetchError } = await supabase
          .from('about_page')
          .select('*')
          .limit(1)
          .single()

        if (fetchError && fetchError.code !== 'PGRST116') {
          throw fetchError
        }

        if (data) {
          setFormData(data)
        }
      } catch (err) {
        console.error('Error fetching about data:', err)
        // Use default data if fetch fails
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleChange = (field: keyof AboutPageData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    setSuccess(false)

    try {
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()

      if (!formData.id) {
        // Insert if no ID exists
        const { error: insertError } = await supabase
          .from('about_page')
          .insert([{
            hero_tagline: formData.hero_tagline,
            hero_title: formData.hero_title,
            hero_description: formData.hero_description,
            hero_image_url: formData.hero_image_url,
            story_title: formData.story_title,
            story_content: formData.story_content,
            youtube_subscribers: formData.youtube_subscribers,
            videos_created: formData.videos_created,
            places_explored: formData.places_explored,
            community_members: formData.community_members,
            youtube_url: formData.youtube_url,
            instagram_url: formData.instagram_url,
            facebook_url: formData.facebook_url,
            tiktok_url: formData.tiktok_url,
            contact_email: formData.contact_email,
            contact_phone: formData.contact_phone,
            contact_address: formData.contact_address,
          }])

        if (insertError) throw insertError
      } else {
        // Update existing record
        const { error: updateError } = await supabase
          .from('about_page')
          .update({
            hero_tagline: formData.hero_tagline,
            hero_title: formData.hero_title,
            hero_description: formData.hero_description,
            hero_image_url: formData.hero_image_url,
            story_title: formData.story_title,
            story_content: formData.story_content,
            youtube_subscribers: formData.youtube_subscribers,
            videos_created: formData.videos_created,
            places_explored: formData.places_explored,
            community_members: formData.community_members,
            youtube_url: formData.youtube_url,
            instagram_url: formData.instagram_url,
            facebook_url: formData.facebook_url,
            tiktok_url: formData.tiktok_url,
            contact_email: formData.contact_email,
            contact_phone: formData.contact_phone,
            contact_address: formData.contact_address,
            updated_at: new Date().toISOString(),
          })
          .eq('id', formData.id)

        if (updateError) throw updateError
      }

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      console.error('Error saving about data:', err)
      setError(err instanceof Error ? err.message : 'Failed to save changes')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-slate-600 dark:text-slate-400">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/(dashboard)/dashboard"
              className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              Back
            </Link>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Edit About Page</h1>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 text-white font-semibold px-6 py-2 rounded-lg transition-colors"
          >
            <Save className="w-5 h-5" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-800 dark:text-red-300">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-lg">
            <p className="text-emerald-800 dark:text-emerald-300 font-semibold">Changes saved successfully!</p>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Hero Section */}
          <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Hero Section</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Hero Tagline
                </label>
                <input
                  type="text"
                  value={formData.hero_tagline}
                  onChange={(e) => handleChange('hero_tagline', e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Hero Title
                </label>
                <input
                  type="text"
                  value={formData.hero_title}
                  onChange={(e) => handleChange('hero_title', e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Hero Description
                </label>
                <textarea
                  value={formData.hero_description}
                  onChange={(e) => handleChange('hero_description', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Hero Image URL
                </label>
                <input
                  type="text"
                  value={formData.hero_image_url}
                  onChange={(e) => handleChange('hero_image_url', e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Story Section */}
          <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Story Section</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Story Title
                </label>
                <input
                  type="text"
                  value={formData.story_title}
                  onChange={(e) => handleChange('story_title', e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Story Content (separate paragraphs with blank lines)
                </label>
                <textarea
                  value={formData.story_content}
                  onChange={(e) => handleChange('story_content', e.target.value)}
                  rows={8}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-mono text-sm"
                />
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Stats Section</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  YouTube Subscribers
                </label>
                <input
                  type="text"
                  value={formData.youtube_subscribers}
                  onChange={(e) => handleChange('youtube_subscribers', e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Videos Created
                </label>
                <input
                  type="text"
                  value={formData.videos_created}
                  onChange={(e) => handleChange('videos_created', e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Places Explored
                </label>
                <input
                  type="text"
                  value={formData.places_explored}
                  onChange={(e) => handleChange('places_explored', e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Community Members
                </label>
                <input
                  type="text"
                  value={formData.community_members}
                  onChange={(e) => handleChange('community_members', e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Social Links Section */}
          <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Social Media Links</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  YouTube URL
                </label>
                <input
                  type="text"
                  value={formData.youtube_url}
                  onChange={(e) => handleChange('youtube_url', e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Instagram URL
                </label>
                <input
                  type="text"
                  value={formData.instagram_url}
                  onChange={(e) => handleChange('instagram_url', e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Facebook URL
                </label>
                <input
                  type="text"
                  value={formData.facebook_url}
                  onChange={(e) => handleChange('facebook_url', e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  TikTok URL
                </label>
                <input
                  type="text"
                  value={formData.tiktok_url}
                  onChange={(e) => handleChange('tiktok_url', e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Contact Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Contact Email
                </label>
                <input
                  type="email"
                  value={formData.contact_email}
                  onChange={(e) => handleChange('contact_email', e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Contact Phone
                </label>
                <input
                  type="text"
                  value={formData.contact_phone}
                  onChange={(e) => handleChange('contact_phone', e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Contact Address
                </label>
                <input
                  type="text"
                  value={formData.contact_address}
                  onChange={(e) => handleChange('contact_address', e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex gap-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              <Save className="w-5 h-5" />
              {saving ? 'Saving...' : 'Save All Changes'}
            </button>
            <Link
              href="/admin/(dashboard)/dashboard"
              className="inline-flex items-center justify-center gap-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Cancel
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
