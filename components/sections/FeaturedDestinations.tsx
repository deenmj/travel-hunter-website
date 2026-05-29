import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { getFeaturedDestinations } from '@/lib/data-fetching'
import { ROUTES } from '@/lib/constants'
import { getDestinationThumbnail } from '@/lib/video-utils'

export async function FeaturedDestinations() {
  const destinations = await getFeaturedDestinations(4)

  return (
    <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      {/* Section background accent */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-emerald-50/40 to-transparent dark:from-emerald-950/10 pointer-events-none rounded-bl-[4rem]" />

      <div className="relative flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
            Recommended
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mt-1 mb-2">
            Featured Destinations
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Discover the most popular places travelers love
          </p>
        </div>
        <Link href={ROUTES.DESTINATIONS}>
          <Button
            variant="outline"
            className="group h-11 px-5 border-slate-200 dark:border-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 hover:text-emerald-600 hover:border-emerald-500/30 rounded-xl transition-all gap-1.5 font-semibold text-sm"
          >
            View All <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>

      {destinations.length === 0 ? (
        <div className="text-center py-16 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
          <p className="text-slate-500 dark:text-slate-400 font-medium">No destinations found yet.</p>
        </div>
      ) : (
        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {destinations.map((destination, index) => {
            const thumbnail = getDestinationThumbnail(destination)
            return (
            <Link
              key={destination.id}
              href={`${ROUTES.DESTINATIONS}/${destination.slug}`}
              className={index === 0 ? 'sm:col-span-2 lg:col-span-1' : ''}
            >
              <Card className="group overflow-hidden border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-2 transition-all duration-300 cursor-pointer h-full flex flex-col">
                <div className="relative h-56 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  {thumbnail ? (
                    <>
                      <img
                        src={thumbnail}
                        alt={destination.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </>
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-emerald-400 via-teal-500 to-blue-500 flex items-center justify-center">
                      <span className="text-white text-4xl transform group-hover:scale-110 transition-transform">📍</span>
                    </div>
                  )}
                  <div className="absolute top-3 right-3 z-10">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-900/85 backdrop-blur-md text-white text-[10px] font-bold rounded-full border border-white/10 uppercase tracking-widest shadow-md">
                      {destination.category === 'visit' ? '🗺️ Visit' : destination.category === 'eat' ? '🍽️ Eat' : '🏨 Stay'}
                    </span>
                  </div>
                </div>

                <CardContent className="p-5 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
                      {destination.name}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {destination.description}
                    </p>
                  </div>
                  {destination.location && (
                    <div className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500 font-semibold mt-4">
                      <span>📍</span>
                      <span className="truncate">{destination.location}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
            )
          })}
        </div>
      )}
    </section>
  )
}
