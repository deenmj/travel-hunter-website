'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Play } from 'lucide-react'
import { getVideos } from '@/lib/data-fetching'
import type { Video } from '@/lib/types'
import { ROUTES } from '@/lib/constants'

export function VideosList() {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchVideos = async () => {
      const data = await getVideos()
      setVideos(data)
      setLoading(false)
    }
    fetchVideos()
  }, [])

  const getYouTubeThumbnail = (youtubeId?: string) => {
    if (!youtubeId) return ''
    return `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`
  }

  return (
    <section className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Travel Videos</h1>
        <p className="text-gray-600 dark:text-gray-400">
          {videos.length} videos showcasing Sri Lanka
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-48 bg-gray-200 dark:bg-slate-700 rounded-lg animate-pulse"></div>
          ))}
        </div>
      ) : videos.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">No videos yet. Check back soon!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <Link key={video.id} href={`${ROUTES.VIDEOS}/${video.slug}`}>
              <div className="group cursor-pointer">
                <div className="relative h-48 w-full bg-gray-200 dark:bg-slate-700 rounded-lg overflow-hidden mb-4">
                  <img
                    src={video.thumbnail || getYouTubeThumbnail(video.youtube_id)}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300">
                    <div className="w-12 h-12 rounded-full bg-white bg-opacity-80 group-hover:bg-opacity-100 flex items-center justify-center transition-all">
                      <Play className="w-6 h-6 text-blue-600 fill-blue-600" />
                    </div>
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2">
                  {video.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}
