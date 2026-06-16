import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { getDestinations } from '@/lib/data-fetching'
import { CATEGORIES, CATEGORY_LABELS, ROUTES } from '@/lib/constants'
import { getDestinationThumbnail } from '@/lib/video-utils'
import { getDestinationHref } from '@/lib/destination-utils'

export async function CategoriesSection() {
  const destinations = await getDestinations()
  const categories = {
    travel: destinations.filter((d) => d.category === CATEGORIES.TRAVEL).slice(0, 3),
    food: destinations.filter((d) => d.category === CATEGORIES.FOOD).slice(0, 3),
    lifestyle: destinations.filter((d) => d.category === CATEGORIES.LIFESTYLE).slice(0, 3),
  }

  const categoryMeta = {
    travel: { gradient: 'from-blue-500 to-cyan-500', emoji: '✈️', image: 'https://upload.wikimedia.org/wikipedia/commons/8/8e/Sigiriya_Rock_Fortress_View_from_Pidurangala_Rock.jpg' },
    food: { gradient: 'from-orange-500 to-yellow-500', emoji: '🍜', image: 'https://upload.wikimedia.org/wikipedia/commons/f/f0/Colombo_-_Galle_Face.jpg' },
    lifestyle: { gradient: 'from-emerald-500 to-teal-500', emoji: '🌿', image: 'https://images.unsplash.com/photo-1588416936097-41850ab3d86d?w=800' },
  }

  return (
    <section className="relative bg-slate-50 dark:bg-slate-900/40 py-16 md:py-24 border-y border-slate-100 dark:border-slate-800/60 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-50/50 via-transparent to-transparent dark:from-emerald-950/20 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Browse</span>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mt-1 mb-3">
            Explore by Category
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Easily filter travel spots, culinary hubs, and lifestyle experiences.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {Object.entries(categories).map(([categoryKey, items]) => {
            const meta = categoryMeta[categoryKey as keyof typeof categoryMeta]
            return (
              <div key={categoryKey} className="space-y-4">
                <div className={`relative bg-gradient-to-br ${meta.gradient} rounded-2xl overflow-hidden text-white shadow-xl shadow-slate-200/50 dark:shadow-none group`}>
                  <img
                    src={meta.image}
                    alt={CATEGORY_LABELS[categoryKey as keyof typeof CATEGORY_LABELS]}
                    className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="relative p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-2xl font-extrabold tracking-tight">
                          {CATEGORY_LABELS[categoryKey as keyof typeof CATEGORY_LABELS]}
                        </h3>
                        <p className="text-xs text-white/80 mt-1 font-medium">{items.length} places curated</p>
                      </div>
                      <span className="text-3xl filter drop-shadow">{meta.emoji}</span>
                    </div>
                  </div>
                </div>

                {items.length === 0 ? (
                  <Card className="h-32 flex items-center justify-center border border-dashed border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/30 rounded-2xl">
                    <p className="text-sm text-slate-400 dark:text-slate-500 font-medium">Coming soon</p>
                  </Card>
                ) : (
                  <div className="space-y-3">
                    {items.map((destination) => {
                      const thumbnail = getDestinationThumbnail(destination)
                      return (
                      <Link key={destination.id} href={getDestinationHref(destination)}>
                        <Card className="overflow-hidden border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-900 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer rounded-xl group">
                          <CardContent className="p-0 flex items-center gap-3">
                            {thumbnail ? (
                              <div className="w-16 h-16 shrink-0 overflow-hidden">
                                <img
                                  src={thumbnail}
                                  alt={destination.name}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                              </div>
                            ) : (
                              <div className={`w-16 h-16 shrink-0 bg-gradient-to-br ${meta.gradient} flex items-center justify-center text-xl`}>
                                {meta.emoji}
                              </div>
                            )}
                            <div className="flex-1 min-w-0 py-3 pr-2">
                              <h4 className="font-bold text-slate-800 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors truncate">
                                {destination.name}
                              </h4>
                              {destination.location && (
                                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 truncate">
                                  📍 {destination.location}
                                </p>
                              )}
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-500 shrink-0 mr-3 transition-colors" />
                          </CardContent>
                        </Card>
                      </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
