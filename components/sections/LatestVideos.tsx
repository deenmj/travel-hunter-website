import Link from 'next/link'
import { Play, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getLatestVideos } from '@/lib/data-fetching'
import type { Video } from '@/lib/types'
import { ROUTES } from '@/lib/constants'

export async function LatestVideos() {
  const videos = await getLatestVideos(6)

  const getYouTubeThumbnail = (youtubeId: string) => {
    return `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Visual Journeys</span>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mt-1 mb-2">
            Latest Videos
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Watch immersive travel experiences from Sri Lanka</p>
        </div>
        <Link href={ROUTES.VIDEOS}>
          <Button variant="outline" className="group h-11 px-5 border-slate-200 dark:border-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 hover:text-emerald-600 hover:border-emerald-500/30 rounded-xl transition-all gap-1.5 font-semibold text-sm">
            View All <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>

      {videos.length === 0 ? (
        <div className="text-center py-16 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
          <p className="text-slate-500 dark:text-slate-400 font-medium">No videos found yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.map((video) => (
            <Link key={video.id} href={`${ROUTES.VIDEOS}/${video.slug}`}>
              <div className="group cursor-pointer space-y-3">
                <div className="relative aspect-video w-full bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm group-hover:shadow-lg transition-all duration-300">
                  <img
                    src={video.thumbnail || getYouTubeThumbnail(video.youtube_id)}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />

                  {/* Play button overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-900/20 group-hover:bg-slate-900/40 transition-all duration-300">
                    <div className="w-14 h-14 rounded-full bg-white/90 backdrop-blur-sm text-emerald-600 flex items-center justify-center shadow-lg transition-all duration-300 transform group-hover:scale-110 group-hover:bg-white">
                      <Play className="w-6 h-6 fill-emerald-600 translate-x-0.5" />
                    </div>
                  </div>
                </div>

                <div className="space-y-1 px-1">
                  <h3 className="font-bold text-base text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2 leading-snug">
                    {video.title}
                  </h3>

                  {video.description && (
                    <p className="text-xs text-slate-400 dark:text-slate-500 line-clamp-2 leading-relaxed">
                      {video.description}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}
