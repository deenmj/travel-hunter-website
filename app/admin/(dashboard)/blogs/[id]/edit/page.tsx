'use client'

import { useState, useEffect, FormEvent, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save } from 'lucide-react'
import { getBlogPostById, updateBlogPost } from '@/lib/admin-actions'
import { ROUTES } from '@/lib/constants'
import type { BlogPost } from '@/lib/types'
import ImageUpload from '@/components/admin/ImageUpload'

export default function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [form, setForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featured_image: '',
    video_id: '',
  })

  useEffect(() => {
    const fetchBlogPost = async () => {
      const result = await getBlogPostById(id)
      if (result.data) {
        const post = result.data as BlogPost
        setForm({
          title: post.title || '',
          slug: post.slug || '',
          excerpt: post.excerpt || '',
          content: post.content || '',
          featured_image: post.featured_image || '',
          // Add fallback in case video_id is not in the db
          video_id: (post as any).video_id || '',
        })
      } else {
        setError('Blog post not found')
      }
      setLoading(false)
    }
    fetchBlogPost()
  }, [id])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    const payload = {
      ...form,
      excerpt: form.excerpt || undefined,
      featured_image: form.featured_image || undefined,
      video_id: form.video_id || undefined,
    }

    const result = await updateBlogPost(id, payload)

    if (result.error) {
      setError(result.error)
      setSaving(false)
      return
    }

    setSuccess(true)
    setTimeout(() => {
      router.push(ROUTES.ADMIN_BLOG)
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
        href={ROUTES.ADMIN_BLOG}
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Blog Posts
      </Link>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Edit Blog Post</h1>
        <p className="text-sm text-slate-500 mt-1">Update the details of this blog post.</p>
      </div>

      {/* Success */}
      {success && (
        <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700/50 text-emerald-700 dark:text-emerald-300 px-4 py-3 rounded-xl text-sm font-medium">
          ✅ Blog post updated successfully! Redirecting...
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
            Post Details
          </h2>

          {/* Title */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Blog Title <span className="text-red-500">*</span>
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

          {/* Short Excerpt */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Short Description / Excerpt
            </label>
            <textarea
              value={form.excerpt}
              onChange={(e) => setForm((prev) => ({ ...prev, excerpt: e.target.value }))}
              rows={2}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all resize-y"
            />
          </div>

          {/* Main Content */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Content (supports HTML / text) <span className="text-red-500">*</span>
            </label>
            <textarea
              value={form.content}
              onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))}
              required
              rows={12}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all resize-y font-mono"
            />
          </div>
        </div>

        {/* Media & Options */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700/50 p-6 space-y-5">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
            Featured Media & Extra Options
          </h2>

          {/* Featured Image */}
          <ImageUpload
            value={form.featured_image}
            onChange={(url) => setForm((prev) => ({ ...prev, featured_image: url }))}
            label="Featured Image"
          />

          {/* YouTube Video option */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Optional YouTube Video ID
            </label>
            <input
              type="text"
              value={form.video_id}
              onChange={(e) => {
                let val = e.target.value
                const match = val.match(
                  /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
                )
                if (match) val = match[1]
                setForm((prev) => ({ ...prev, video_id: val }))
              }}
              className="w-full h-12 px-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center gap-3 justify-end pt-2">
          <Link href={ROUTES.ADMIN_BLOG}>
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
                Update Blog Post
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
