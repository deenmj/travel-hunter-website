'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Plus, Search, FileText, Edit2, Trash2, Clock, Eye } from 'lucide-react'
import { getBlogPosts } from '@/lib/data-fetching'
import { deleteBlogPost } from '@/lib/admin-actions'
import { ROUTES } from '@/lib/constants'
import type { BlogPost } from '@/lib/types'

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  useEffect(() => {
    fetchBlogs()
  }, [])

  const fetchBlogs = async () => {
    const data = await getBlogPosts()
    setBlogs(data)
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    const result = await deleteBlogPost(id)
    if (!result.error) {
      setBlogs((prev) => prev.filter((b) => b.id !== id))
      setSuccessMsg('Blog post deleted successfully!')
      setTimeout(() => setSuccessMsg(null), 3000)
    }
    setDeleteId(null)
  }

  const filtered = blogs.filter((b) =>
    b.title.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-12 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse w-48" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Success Message */}
      {successMsg && (
        <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700/50 text-emerald-700 dark:text-emerald-300 px-4 py-3 rounded-xl text-sm font-medium animate-in fade-in">
          ✅ {successMsg}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Blog Posts</h1>
          <p className="text-sm text-slate-500 mt-1">{blogs.length} total posts</p>
        </div>
        <Link href={`${ROUTES.ADMIN_BLOG}/new`}>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-xl font-medium text-sm hover:shadow-lg hover:shadow-emerald-500/25 transition-all">
            <Plus className="w-4 h-4" />
            Add Blog Post
          </button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search blog posts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all"
          />
        </div>
      </div>

      {/* Blogs List */}
      {filtered.length > 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700/50 overflow-hidden">
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {filtered.map((post) => (
              <div
                key={post.id}
                className="flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                {/* Image */}
                <div className="w-14 h-14 rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0">
                  {post.featured_image ? (
                    <img
                      src={post.featured_image}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FileText className="w-5 h-5 text-slate-400" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-slate-900 dark:text-white truncate">
                    {post.title}
                  </h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(post.created_at).toLocaleDateString()}
                    </span>
                    {post.excerpt && (
                      <span className="text-xs text-slate-400 truncate max-w-md hidden sm:inline">
                        {post.excerpt}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <Link href={`/blog/${post.slug}`} target="_blank">
                    <button className="p-2 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                  </Link>
                  <Link href={`${ROUTES.ADMIN_BLOG}/${post.id}/edit`}>
                    <button className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </Link>
                  <button
                    onClick={() => setDeleteId(post.id)}
                    className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700/50">
          <FileText className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
          <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">
            No blog posts found
          </h3>
          <p className="text-sm text-slate-500 mb-4">
            {search
              ? 'Try adjusting your search query'
              : 'Write your first blog post and share Sri Lanka stories!'}
          </p>
          <Link href={`${ROUTES.ADMIN_BLOG}/new`}>
            <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-medium text-sm hover:bg-emerald-700 transition-colors">
              <Plus className="w-4 h-4" />
              Add Blog Post
            </button>
          </Link>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              Delete Blog Post
            </h3>
            <p className="text-sm text-slate-500 mb-6">
              Are you sure you want to delete this blog post? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
