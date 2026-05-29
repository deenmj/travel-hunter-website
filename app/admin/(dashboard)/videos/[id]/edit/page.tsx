'use client'

import { useState, useEffect, FormEvent, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save } from 'lucide-react'
import { getVideoById, updateVideo } from '@/lib/admin-actions'
import { getDestinations } from '@/lib/data-fetching'
import { ROUTES } from '@/lib/constants'
import type { Video as VideoType, Destination } from '@/lib/types'
import ImageUpload from '@/components/admin/ImageUpload'

export default function EditVideoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
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
    const fetchData = async () => {
      const [destData, videoResult] = await Promise.all([
        getDestinations(),
        getVideoById(id),
      ])

      setDestinations(destData)

      if (videoResult.data) {
        const video = videoResult.data as VideoType
        setForm({
          title: video.title || '',
          slug: video.slug || '',
          youtube_id: video.youtube_id || '',
          description: video.description || '',
          thumbnail: video.thumbnail || '',
          destination_id: video.destination_id || '',
        })
      } else {
        setError('Video not found')
      }
      setLoading(false)
    }
    fetchData()
  }, [id])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    const payload = {
      ...form,
      description: form.description || undefined,
      thumbnail: form.thumbnail || undefined,
      destination_id: form.destination_id || undefined,
    }

    const result = await updateVideo(id, payload)

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

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="h-8 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse w-48" />
        <div className="h-96 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
      </div>
    )
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
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Edit Video</h1>
        <p className="text-sm text-slate-500 mt-1">Update the details of this video.</p>
      </div>

      {/* Success */}
      {success && (
        <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700/50 text-emerald-700 dark:text-emerald-300 px-4 py-3 rounded-xl text-sm font-medium">
          ✅ Video updated successfully! Redirecting...
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
            Video details
          </h2>

          {/* YouTube Link / ID */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              YouTube Video ID <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.youtube_id}
              onChange={(e) => {
                let val = e.target.value
                const match = val.match(
                  /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
                )
                if (match) val = match[1]
                setForm((prev) => ({
                  ...prev,
                  youtube_id: val,
                  thumbnail: `https://img.youtube.com/vi/${val}/maxresdefault.jpg`,
                }))
              }}
              required
              className="w-full h-12 px-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all font-mono"
            />
          </div>

          {/* Title */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Video Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
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
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700/50 p-6">
          <ImageUpload
            value={form.thumbnail}
            onChange={(url) => setForm((prev) => ({ ...prev, thumbnail: url }))}
            label="Video Thumbnail (Auto-Fetched from YouTube, or Custom Upload/URL)"
          />
        </div>

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
                Update Video
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
