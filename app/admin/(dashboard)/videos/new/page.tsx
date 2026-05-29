'use client'

import { useState, FormEvent, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, AlertCircle } from 'lucide-react'
import { createVideo } from '@/lib/admin-actions'
import { getDestinations } from '@/lib/data-fetching'
import { ROUTES } from '@/lib/constants'
import type { Destination } from '@/lib/types'
import ImageUpload from '@/components/admin/ImageUpload'
import VideoInput from '@/components/admin/VideoInput'

export default function NewVideoPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [destinations, setDestinations] = useState<Destination[]>([])

  const [form, setForm] = useState({
    title: '',
    slug: '',
    youtube_id: '',
    video_url: '',
    description: '',
    thumbnail: '',
    destination_id: '',
  })

  useEffect(() => {
    getDestinations().then(setDestinations)
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    if (!form.youtube_id && !form.video_url) {
      setError('Please upload a video file or paste a YouTube/direct video URL.')
      setSaving(false)
      return
    }

    const payload = {
      ...form,
      youtube_id: form.youtube_id || undefined,
      video_url: form.video_url || undefined,
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
      <Link
        href={ROUTES.ADMIN_VIDEOS}
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Videos
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Add New Video</h1>
        <p className="text-sm text-slate-500 mt-1">
          Upload a video file or paste a YouTube link to feature travel content.
        </p>
      </div>

      {success && (
        <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700/50 text-emerald-700 dark:text-emerald-300 px-4 py-3 rounded-xl text-sm font-medium">
          ✅ Video added successfully! Redirecting...
        </div>
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700/50 text-red-700 dark:text-red-300 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700/50 p-6 space-y-5">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
            Video Source
          </h2>

          <VideoInput
            value={{ youtubeId: form.youtube_id, videoUrl: form.video_url }}
            onChange={({ youtubeId, videoUrl }) =>
              setForm((prev) => ({ ...prev, youtube_id: youtubeId, video_url: videoUrl }))
            }
            label="Video"
            required
            onYoutubeMeta={(meta) => {
              setForm((prev) => ({
                ...prev,
                title: meta.title || prev.title,
                slug: meta.title ? generateSlug(meta.title) : prev.slug,
                thumbnail: meta.thumbnail || prev.thumbnail,
              }))
            }}
          />
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700/50 p-6 space-y-5">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
            Video Details
          </h2>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Video Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Enter video title"
              required
              className="w-full h-12 px-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">URL Slug</label>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))}
              placeholder="auto-generated-slug"
              className="w-full h-12 px-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of this video..."
              rows={4}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all resize-y"
            />
          </div>

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

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700/50 p-6">
          <ImageUpload
            value={form.thumbnail}
            onChange={(url) => setForm((prev) => ({ ...prev, thumbnail: url }))}
            label="Video Thumbnail (Upload or URL)"
          />
        </div>

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
