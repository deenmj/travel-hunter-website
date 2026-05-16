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
    <section className="max-w-6xl mx-auto px-4 py-12 md:py-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Latest Videos
          </h2>
          <p className="text-gray-600 dark:text-gray-400">Watch travel experiences from Sri Lanka</p>
        </div>
        <Link href={ROUTES.VIDEOS}>
          <Button variant="ghost" className="gap-2">
            View All <ChevronRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>

      {videos.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">No videos found yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <Link key={video.id} href={`${ROUTES.VIDEOS}/${video.slug}`}>
              <div className="group cursor-pointer">
                <div className="relative h-48 w-full bg-gray-200 dark:bg-slate-700 rounded-lg overflow-hidden mb-4">
                  <img
                    src={getYouTubeThumbnail(video.youtube_id)}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />

                  {/* Play button overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300">
                    <div className="w-12 h-12 rounded-full bg-white bg-opacity-80 group-hover:bg-opacity-100 flex items-center justify-center transition-all duration-300 transform group-hover:scale-110">
                      <Play className="w-6 h-6 text-blue-600 fill-blue-600" />
                    </div>
                  </div>
                </div>

                <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2 mb-2">
                  {video.title}
                </h3>

                {video.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {video.description}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}
