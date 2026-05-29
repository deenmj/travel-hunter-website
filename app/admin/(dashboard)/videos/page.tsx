'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Plus, Search, Video, Edit2, Trash2, Clock, Play } from 'lucide-react'
import { getVideos } from '@/lib/data-fetching'
import { deleteVideo } from '@/lib/admin-actions'
import { ROUTES } from '@/lib/constants'
import type { Video as VideoType } from '@/lib/types'

export default function VideosPage() {
  const [videos, setVideos] = useState<VideoType[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  useEffect(() => {
    fetchVideos()
  }, [])

  const fetchVideos = async () => {
    const data = await getVideos()
    setVideos(data)
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    const result = await deleteVideo(id)
    if (!result.error) {
      setVideos((prev) => prev.filter((v) => v.id !== id))
      setSuccessMsg('Video deleted successfully!')
      setTimeout(() => setSuccessMsg(null), 3000)
    }
    setDeleteId(null)
  }

  const filtered = videos.filter((v) =>
    v.title.toLowerCase().includes(search.toLowerCase())
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
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Videos</h1>
          <p className="text-sm text-slate-500 mt-1">{videos.length} total videos</p>
        </div>
        <Link href={`${ROUTES.ADMIN_VIDEOS}/new`}>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-xl font-medium text-sm hover:shadow-lg hover:shadow-emerald-500/25 transition-all">
            <Plus className="w-4 h-4" />
            Add Video
          </button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search videos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all"
          />
        </div>
      </div>

      {/* Videos List */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((video) => (
            <div
              key={video.id}
              className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700/50 overflow-hidden hover:shadow-md transition-shadow flex flex-col"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video bg-slate-100 dark:bg-slate-800 shrink-0 group">
                {video.thumbnail ? (
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Video className="w-8 h-8 text-slate-400" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                    <Play className="w-6 h-6 text-red-600 fill-red-600 ml-0.5" />
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white line-clamp-2">
                    {video.title}
                  </h3>
                  {video.description && (
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      {video.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(video.created_at).toLocaleDateString()}
                  </span>
                  <div className="flex items-center gap-1">
                    <Link href={`${ROUTES.ADMIN_VIDEOS}/${video.id}/edit`}>
                      <button className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </Link>
                    <button
                      onClick={() => setDeleteId(video.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700/50">
          <Video className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
          <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">
            No videos found
          </h3>
          <p className="text-sm text-slate-500 mb-4">
            {search
              ? 'Try adjusting your search query'
              : 'Add YouTube videos of beautiful places in Sri Lanka!'}
          </p>
          <Link href={`${ROUTES.ADMIN_VIDEOS}/new`}>
            <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-medium text-sm hover:bg-emerald-700 transition-colors">
              <Plus className="w-4 h-4" />
              Add Video
            </button>
          </Link>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              Delete Video
            </h3>
            <p className="text-sm text-slate-500 mb-6">
              Are you sure you want to delete this video? This action cannot be undone.
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
