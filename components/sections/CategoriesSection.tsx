import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { getDestinations } from '@/lib/data-fetching'
import { CATEGORIES, CATEGORY_LABELS, ROUTES } from '@/lib/constants'
import type { Destination } from '@/lib/types'

export async function CategoriesSection() {
  const destinations = await getDestinations()
  const categories = {
    visit: destinations.filter((d) => d.category === CATEGORIES.VISIT).slice(0, 3),
    eat: destinations.filter((d) => d.category === CATEGORIES.EAT).slice(0, 3),
    stay: destinations.filter((d) => d.category === CATEGORIES.STAY).slice(0, 3),
  }

  const categoryColors = {
    visit: 'from-blue-500 to-cyan-500',
    eat: 'from-orange-500 to-yellow-500',
    stay: 'from-emerald-500 to-teal-500',
  }

  return (
    <section className="bg-slate-50 dark:bg-slate-900/40 py-16 md:py-24 border-y border-slate-100 dark:border-slate-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Browse</span>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mt-1 mb-3">
            Explore by Category
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Easily filter destinations, food hubs, and accommodation spots across the island.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {Object.entries(categories).map(([categoryKey, items]) => (
            <div key={categoryKey} className="space-y-4">
              <div className={`bg-gradient-to-br ${categoryColors[categoryKey as keyof typeof categoryColors]} rounded-2xl p-6 text-white shadow-lg shadow-slate-200 dark:shadow-none`}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-extrabold tracking-tight">{CATEGORY_LABELS[categoryKey as keyof typeof CATEGORY_LABELS]}</h3>
                    <p className="text-xs text-white/80 mt-1 font-medium">{items.length} places curated</p>
                  </div>
                  <span className="text-3xl filter drop-shadow">
                    {categoryKey === 'visit' ? '🗺️' : categoryKey === 'eat' ? '🍽️' : '🏨'}
                  </span>
                </div>
              </div>

              {items.length === 0 ? (
                <Card className="h-32 flex items-center justify-center border border-dashed border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/30 rounded-2xl">
                  <p className="text-sm text-slate-400 dark:text-slate-500 font-medium">Coming soon</p>
                </Card>
              ) : (
                <div className="space-y-3">
                  {items.map((destination) => (
                    <Link key={destination.id} href={`${ROUTES.DESTINATIONS}/${destination.slug}`}>
                      <Card className="overflow-hidden border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-900 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer rounded-xl">
                        <CardContent className="p-4 flex items-center justify-between gap-3">
                          <div className="truncate">
                            <h4 className="font-bold text-slate-800 dark:text-slate-100 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors truncate">
                              {destination.name}
                            </h4>
                            {destination.location && (
                              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 truncate">📍 {destination.location}</p>
                            )}
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 shrink-0" />
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
