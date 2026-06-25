'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Play, Video as VideoIcon } from 'lucide-react'
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
    <div className="bg-white dark:bg-slate-950 min-h-screen">
      {/* ── Videos Hero Section ── */}
      <section className="relative w-full py-20 md:py-32 bg-slate-50 dark:bg-slate-900 overflow-hidden border-b border-slate-100 dark:border-slate-800">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-teal-50/50 dark:from-emerald-950/20 dark:to-teal-950/20 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <span className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/50 mb-6 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 shadow-sm">
            <VideoIcon className="w-6 h-6" />
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white mb-6">
            Travel Videos
          </h1>
          <p className="text-base md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
            Immerse yourself in high-quality travel documentaries, vlogs, and cinematic tours of Sri Lanka.
          </p>
        </div>
      </section>

      {/* ── Videos Grid Section ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-72 bg-slate-100 dark:bg-slate-800 rounded-[2rem] animate-pulse"></div>
            ))}
          </div>
        ) : videos.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-[2rem] border border-slate-100 dark:border-slate-800">
            <VideoIcon className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-lg font-bold text-slate-600 dark:text-slate-400">No videos yet.</p>
            <p className="text-slate-500 mt-2">Check back soon for new travel videos!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {videos.map((video) => (
              <Link key={video.id} href={`${ROUTES.VIDEOS}/${video.slug}`} className="group relative">
                <div className="overflow-hidden border border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer flex flex-col rounded-[2rem] hover:border-emerald-500/50 dark:hover:border-emerald-500/50">
                  <div className="relative aspect-video w-full bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0">
                    <img
                      src={video.thumbnail || getYouTubeThumbnail(video.youtube_id)}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                      loading="lazy"
                    />
                    
                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-900/10 group-hover:bg-slate-900/40 transition-all duration-500">
                      <div className="w-14 h-14 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <Play className="w-6 h-6 text-emerald-600 dark:text-emerald-400 fill-emerald-600 dark:fill-emerald-400 ml-1" />
                      </div>
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>

                  <div className="p-6">
                    <h3 className="font-black text-lg md:text-xl text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2 leading-snug">
                      {video.title}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
