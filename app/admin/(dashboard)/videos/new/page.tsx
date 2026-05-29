'use client'

import { useState, FormEvent, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Sparkles, AlertCircle } from 'lucide-react'
import { createVideo } from '@/lib/admin-actions'
import { getDestinations } from '@/lib/data-fetching'
import { ROUTES } from '@/lib/constants'
import type { Destination } from '@/lib/types'

export default function NewVideoPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [fetchingDetails, setFetchingDetails] = useState(false)
  const [destinations, setDestinations] = useState<Destination[]>([])

  const [form, setForm] = useState({
    title: '',
    slug: '',
    youtube_id: '',
    description: '',
    thumbnail: '',
    destination_id: '',
  })

  useEffect(() => {
    const fetchDestinations = async () => {
      const data = await getDestinations()
      setDestinations(data)
    }
    fetchDestinations()
  }, [])

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const handleTitleChange = (title: string) => {
    setForm((prev) => ({
      ...prev,
      title,
      slug: generateSlug(title),
    }))
  }

  // Auto fetch details from YouTube Link
  const handleLinkPaste = async (url: string) => {
    if (!url) return

    // Extract ID
    const match = url.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    )
    const ytId = match ? match[1] : url.length === 11 ? url : ''

    if (!ytId) return

    setForm((prev) => ({ ...prev, youtube_id: ytId }))
    setFetchingDetails(true)
    setError(null)

    try {
      // Fetch details using noembed / oembed proxy
      const response = await fetch(
        `https://noembed.com/embed?url=https://www.youtube.com/watch?v=${ytId}`
      )
      const data = await response.json()

      if (data && data.title) {
        setForm((prev) => ({
          ...prev,
          title: data.title,
          slug: generateSlug(data.title),
          thumbnail: data.thumbnail_url || `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`,
        }))
      } else {
        // Fallback to default thumbnail if title fetch fails
        setForm((prev) => ({
          ...prev,
          thumbnail: `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`,
        }))
      }
    } catch (err) {
      console.error('Error fetching YouTube info', err)
      // Fallback
      setForm((prev) => ({
        ...prev,
        thumbnail: `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`,
      }))
    } finally {
      setFetchingDetails(false)
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    if (!form.youtube_id) {
      setError('A valid YouTube Video ID or URL is required.')
      setSaving(false)
      return
    }

    const payload = {
      ...form,
      description: form.description || undefined,
      thumbnail: form.thumbnail || undefined,
      destination_id: form.destination_id || undefined,
    }

    const result = await createVideo(payload)

    if (result.error) {
      setError(result.error)
      setSaving(false)
      return
    }

    setSuccess(true)
    setTimeout(() => {
      router.push(ROUTES.ADMIN_VIDEOS)
    }, 1500)
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back */}
      <Link
        href={ROUTES.ADMIN_VIDEOS}
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Videos
      </Link>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Add New Video</h1>
        <p className="text-sm text-slate-500 mt-1">
          Paste a YouTube link to quickly import and feature beautiful travel videos.
        </p>
      </div>

      {/* Success */}
      {success && (
        <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700/50 text-emerald-700 dark:text-emerald-300 px-4 py-3 rounded-xl text-sm font-medium">
          ✅ Video added successfully! Redirecting...
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700/50 text-red-700 dark:text-red-300 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700/50 p-6 space-y-5">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
            Video Source
          </h2>

          {/* YouTube Link / Paste Box */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Paste YouTube Link or Video ID <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                onChange={(e) => handleLinkPaste(e.target.value)}
                required={!form.youtube_id}
                className="w-full h-12 pl-4 pr-12 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
                {fetchingDetails ? (
                  <div className="w-5 h-5 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
                ) : (
                  <Sparkles className="w-5 h-5 text-emerald-500" />
                )}
              </div>
            </div>
            <p className="text-xs text-slate-400">
              We'll automatically fetch the video title and thumbnail preview!
            </p>
          </div>

          {/* Extracted YouTube ID (read-only for clarity, editable if needed) */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Detected Video ID
            </label>
            <input
              type="text"
              value={form.youtube_id}
              onChange={(e) => setForm((prev) => ({ ...prev, youtube_id: e.target.value }))}
              placeholder="e.g., dQw4w9WgXcQ"
              className="w-full h-12 px-4 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all font-mono"
            />
          </div>
        </div>

        {/* Video details (Auto filled but editable) */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700/50 p-6 space-y-5">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
            Video Metadata (Auto-Fetched)
          </h2>

          {/* Title */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Video Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Fetched title"
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
              placeholder="auto-generated-slug"
              className="w-full h-12 px-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Description / Notes
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Add a brief description about this video content..."
              rows={4}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all resize-y"
            />
          </div>

          {/* Destination Association */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Associate with Destination
            </label>
            <select
              value={form.destination_id}
              onChange={(e) => setForm((prev) => ({ ...prev, destination_id: e.target.value }))}
              className="w-full h-12 px-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all"
            >
              <option value="">None / General Video</option>
              {destinations.map((dest) => (
                <option key={dest.id} value={dest.id}>
                  {dest.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Thumbnail Preview Card */}
        {form.thumbnail && (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700/50 p-6 space-y-4">
            <h2 className="text-base font-semibold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
              Thumbnail Preview
            </h2>
            <div className="relative aspect-video rounded-xl overflow-hidden max-w-md bg-slate-100 border border-slate-200">
              <img
                src={form.thumbnail}
                alt="Thumbnail"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {/* Submit */}
        <div className="flex items-center gap-3 justify-end pt-2">
          <Link href={ROUTES.ADMIN_VIDEOS}>
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
                Save Video
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
