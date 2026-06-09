import Link from 'next/link'
import { ChevronRight, Award } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { getTopPicks } from '@/lib/data-fetching'
import { ROUTES } from '@/lib/constants'
import { getDestinationThumbnail } from '@/lib/video-utils'
import { getDestinationHref } from '@/lib/destination-utils'
import { WishlistButton } from '@/components/ui/WishlistButton'

export async function TopPicks() {
  const destinations = await getTopPicks(3)

  if (destinations.length === 0) return null

  return (
    <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 border-t border-slate-100 dark:border-slate-800">
      {/* Background accent */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-amber-50/40 to-transparent dark:from-amber-950/10 pointer-events-none rounded-bl-[6rem]" />

      <div className="relative flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <span className="flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-500 uppercase tracking-widest">
            <Award className="w-4 h-4" /> Travel Hunter's Choice
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mt-1 mb-2">
            Top Picks
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl">
            Our absolute favorite experiences in Sri Lanka that you shouldn't miss.
          </p>
        </div>
        <Link href={ROUTES.DESTINATIONS}>
          <Button
            variant="outline"
            className="group h-11 px-5 border-slate-200 dark:border-slate-800 hover:bg-amber-50 dark:hover:bg-amber-950/20 hover:text-amber-600 hover:border-amber-500/30 rounded-xl transition-all gap-1.5 font-semibold text-sm"
          >
            View All <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>

      <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {destinations.map((destination) => {
          const thumbnail = getDestinationThumbnail(destination)
          return (
            <div key={destination.id} className="group relative">
              <Link href={getDestinationHref(destination)}>
                <Card className="overflow-hidden border border-slate-200/60 dark:border-slate-700/60 bg-white dark:bg-slate-900 hover:shadow-2xl hover:shadow-amber-500/10 hover:-translate-y-2 transition-all duration-300 cursor-pointer h-[28rem] flex flex-col rounded-3xl group">
                  <div className="relative h-2/3 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    {thumbnail ? (
                      <>
                        <img
                          src={thumbnail}
                          alt={destination.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
                      </>
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-amber-400 via-orange-500 to-red-500" />
                    )}
                    
                    <div className="absolute top-4 right-4 z-10 flex gap-2">
                      <span className="inline-flex items-center px-3 py-1 bg-amber-500 text-white text-[10px] font-bold rounded-full shadow-lg uppercase tracking-widest border border-amber-400">
                        Top Pick
                      </span>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 z-10">
                      <h3 className="font-black text-2xl text-white group-hover:text-amber-400 transition-colors line-clamp-1 drop-shadow-md">
                        {destination.name}
                      </h3>
                      {destination.location && (
                        <div className="flex items-center gap-1.5 text-sm text-slate-200 font-medium mt-1 drop-shadow">
                          <span className="text-amber-400">📍</span>
                          <span className="truncate">{destination.location}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <CardContent className="p-6 flex-1 flex flex-col justify-between bg-white dark:bg-slate-900 relative">
                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                      {destination.description}
                    </p>
                    
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-xs font-semibold text-amber-600 dark:text-amber-500 uppercase tracking-wider flex items-center gap-1">
                        Explore <ChevronRight className="w-3 h-3" />
                      </span>
                      <div className="flex items-center gap-2">
                        {destination.category && (
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md">
                            {destination.category}
                          </span>
                        )}
                        {destination.budget && (
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2.5 py-1 rounded-md">
                            {destination.budget}
                          </span>
                        )}
                      </div>
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
                />
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
