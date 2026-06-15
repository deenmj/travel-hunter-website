'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Plus, X, Image as ImageIcon } from 'lucide-react'
import { createDestination } from '@/lib/admin-actions'
import { ROUTES, CATEGORY_LABELS } from '@/lib/constants'
import ImageUpload from '@/components/admin/ImageUpload'
import VideoInput from '@/components/admin/VideoInput'
import GalleryInput from '@/components/admin/GalleryInput'

export default function NewDestinationPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [highlight, setHighlight] = useState('')

  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    category: 'travel' as 'travel' | 'food' | 'lifestyle',
    featured_image: '',
    video_id: '',
    video_url: '',
    best_time: '',
    how_to_reach: '',
    entry_fees: '',
    location: '',
    highlights: [] as string[],
    images: [] as string[],
    is_top_pick: false,
  })

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const handleNameChange = (name: string) => {
    setForm((prev) => ({
      ...prev,
      name,
      slug: generateSlug(name),
    }))
  }

  const addHighlight = () => {
    if (highlight.trim()) {
      setForm((prev) => ({
        ...prev,
        highlights: [...prev.highlights, highlight.trim()],
      }))
      setHighlight('')
    }
  }

  const removeHighlight = (index: number) => {
    setForm((prev) => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    const payload = {
      ...form,
      featured_image: form.featured_image || undefined,
      video_id: form.video_id || undefined,
      video_url: form.video_url || undefined,
      best_time: form.best_time || undefined,
      how_to_reach: form.how_to_reach || undefined,
      entry_fees: form.entry_fees || undefined,
      location: form.location || undefined,
      images: form.images.length > 0 ? form.images : undefined,
      highlights: form.highlights.length > 0 ? form.highlights : undefined,
      is_top_pick: form.is_top_pick,
    }

    const result = await createDestination(payload)

    if (result.error) {
      setError(result.error)
      setSaving(false)
      return
    }

    setSuccess(true)
    setTimeout(() => {
      router.push(ROUTES.ADMIN_DESTINATIONS)
    }, 1500)
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back */}
      <Link
        href={ROUTES.ADMIN_DESTINATIONS}
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Destinations
      </Link>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">New Destination</h1>
        <p className="text-sm text-slate-500 mt-1">
          Add a new travel destination for visitors to discover.
        </p>
      </div>

      {/* Success */}
      {success && (
        <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700/50 text-emerald-700 dark:text-emerald-300 px-4 py-3 rounded-xl text-sm font-medium">
          ✅ Destination created successfully! Redirecting...
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700/50 text-red-700 dark:text-red-300 px-4 py-3 rounded-xl text-sm font-medium">
          ❌ {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700/50 p-6 space-y-5">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
            Basic Information
          </h2>

          {/* Name */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Destination Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g., Sigiriya Rock Fortress"
              required
              className="w-full h-12 px-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all"
            />
          </div>

          {/* Slug */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              URL Slug
            </label>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))}
              placeholder="auto-generated-from-name"
              className="w-full h-12 px-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all"
            />
          </div>

          {/* Top Pick / Front Page Toggle */}
          <div className="flex items-center justify-between p-4 bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/50 rounded-xl">
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">Show on Front Page (Top Pick)</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Feature this destination prominently on the home page.</p>
            </div>
            <button
              type="button"
              onClick={() => setForm(prev => ({ ...prev, is_top_pick: !prev.is_top_pick }))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.is_top_pick ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${form.is_top_pick ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Category <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['travel', 'food', 'lifestyle'] as const).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, category: cat }))}
                  className={`p-3 rounded-xl border-2 text-center transition-all ${
                    form.category === cat
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <span className="text-xl block mb-1">
                    {cat === 'travel' ? '🗺️' : cat === 'food' ? '🍽️' : '🏨'}
                  </span>
                  <span className="text-xs font-medium">{CATEGORY_LABELS[cat]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Write a compelling description of this destination..."
              required
              rows={5}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all resize-y"
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Location
            </label>
            <input
              type="text"
              value={form.location}
              onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))}
              placeholder="e.g., Central Province, Sri Lanka"
              className="w-full h-12 px-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all"
            />
          </div>

          {/* Practical Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Best Time */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Best Time to Visit
              </label>
              <input
                type="text"
                value={form.best_time}
                onChange={(e) => setForm((prev) => ({ ...prev, best_time: e.target.value }))}
                placeholder="e.g., January to April"
                className="w-full h-12 px-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all"
              />
            </div>

            {/* Entry Fees */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Entry Fees / Cost
              </label>
              <input
                type="text"
                value={form.entry_fees}
                onChange={(e) => setForm((prev) => ({ ...prev, entry_fees: e.target.value }))}
                placeholder="e.g., LKR 500 for locals, USD 30 for foreigners"
                className="w-full h-12 px-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all"
              />
            </div>
          </div>

          {/* How to Reach */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              How to Reach
            </label>
            <textarea
              value={form.how_to_reach}
              onChange={(e) => setForm((prev) => ({ ...prev, how_to_reach: e.target.value }))}
              placeholder="e.g., Accessible by train from Colombo to Kandy, then a short tuk-tuk ride..."
              rows={3}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all resize-y"
            />
          </div>
        </div>

        {/* Media */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700/50 p-6 space-y-5">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
            Media
          </h2>

          {/* Featured Image */}
          <ImageUpload
            value={form.featured_image}
            onChange={(url) => setForm((prev) => ({ ...prev, featured_image: url }))}
            label="Featured Image"
          />

          {/* Video — Upload or URL */}
          <VideoInput
            value={{ youtubeId: form.video_id, videoUrl: form.video_url }}
            onChange={({ youtubeId, videoUrl }) =>
              setForm((prev) => ({ ...prev, video_id: youtubeId, video_url: videoUrl }))
            }
            label="Destination Video (Optional)"
          />

          <GalleryInput
            value={form.images}
            onChange={(images) => setForm((prev) => ({ ...prev, images }))}
            label="Gallery Photos (Optional)"
          />
        </div>

        {/* Highlights */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700/50 p-6 space-y-4">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
            Highlights
          </h2>

          <div className="flex gap-2">
            <input
              type="text"
              value={highlight}
              onChange={(e) => setHighlight(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addHighlight()
                }
              }}
              placeholder="Type a highlight and press Enter"
              className="flex-1 h-12 px-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all"
            />
            <button
              type="button"
              onClick={addHighlight}
              className="px-4 h-12 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {form.highlights.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {form.highlights.map((h, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-lg text-sm"
                >
                  {h}
                  <button
                    type="button"
                    onClick={() => removeHighlight(i)}
                    className="hover:text-red-500 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="flex items-center gap-3 justify-end pt-2">
          <Link href={ROUTES.ADMIN_DESTINATIONS}>
            <button
              type="button"
              className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
          </Link>
          <button
            type="submit"
            disabled={saving || success}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-xl font-medium text-sm hover:shadow-lg hover:shadow-emerald-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Destination
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
