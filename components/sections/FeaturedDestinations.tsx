import Link from 'next/link'
import { ChevronRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { getFeaturedDestinations } from '@/lib/data-fetching'
import { ROUTES } from '@/lib/constants'
import { getDestinationThumbnail } from '@/lib/video-utils'
import { getDestinationHref } from '@/lib/destination-utils'
import { WishlistButton } from '@/components/ui/WishlistButton'

export async function FeaturedDestinations() {
  const destinations = await getFeaturedDestinations(6)

  if (destinations.length === 0) return null

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-500 uppercase tracking-widest">
            <Sparkles className="w-4 h-4" /> Discover
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mt-1 mb-2">
            Featured Destinations
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl">
            Explore hand-picked locations that showcase the diverse beauty of Sri Lanka.
          </p>
        </div>
        <Link href={ROUTES.DESTINATIONS}>
          <Button
            variant="outline"
            className="group h-11 px-5 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl transition-all gap-1.5 font-semibold text-sm"
          >
            Explore All <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {destinations.map((destination) => {
          const thumbnail = getDestinationThumbnail(destination)
          return (
            <div key={destination.id} className="relative group">
              <Link href={getDestinationHref(destination)}>
                <Card className="overflow-hidden border border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900 hover:border-emerald-500/50 dark:hover:border-emerald-500/50 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer h-full flex flex-col rounded-2xl group">
                  <div className="relative aspect-[4/3] bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    {thumbnail ? (
                      <img
                        src={thumbnail}
                        alt={destination.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/40 dark:to-teal-900/40">
                        🗺️
                      </div>
                    )}
                    
                    {destination.category && (
                      <div className="absolute top-4 right-4 z-10">
                        <span className="inline-flex items-center px-2.5 py-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-slate-900 dark:text-white text-[10px] font-bold rounded-md shadow-sm uppercase tracking-wider">
                          {destination.category}
                        </span>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                    
                    <div className="absolute bottom-4 left-4 right-4 z-10">
                      <h3 className="font-bold text-xl text-white group-hover:text-emerald-400 transition-colors line-clamp-1 drop-shadow-md">
                        {destination.name}
                      </h3>
                      {destination.location && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-200 font-medium mt-1 drop-shadow">
                          <span>📍</span>
                          <span className="truncate">{destination.location}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <CardContent className="p-5 flex-1 flex flex-col justify-between">
                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {destination.description}
                    </p>
                    
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-500 uppercase tracking-wider flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Read more <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              
              {/* Floating Wishlist Button */}
              <div className="absolute top-4 left-4 z-20">
                <WishlistButton 
                  item={{
                    id: destination.id,
                    type: 'destination',
                    name: destination.name,
                    slug: destination.slug,
                    image: thumbnail || undefined
                  }}
                  size="sm"
                />
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
