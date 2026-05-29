'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Plus, X, Image as ImageIcon } from 'lucide-react'
import { createDestination } from '@/lib/admin-actions'
import { ROUTES, CATEGORY_LABELS } from '@/lib/constants'
import ImageUpload from '@/components/admin/ImageUpload'
import VideoInput from '@/components/admin/VideoInput'

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
    category: 'visit' as 'visit' | 'eat' | 'stay',
    featured_image: '',
    video_id: '',
    video_url: '',
    best_time: '',
    location: '',
    highlights: [] as string[],
    images: [] as string[],
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
      location: form.location || undefined,
      images: form.images.length > 0 ? form.images : undefined,
      highlights: form.highlights.length > 0 ? form.highlights : undefined,
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

          {/* Category */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Category <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['visit', 'eat', 'stay'] as const).map((cat) => (
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
                    {cat === 'visit' ? '🗺️' : cat === 'eat' ? '🍽️' : '🏨'}
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
