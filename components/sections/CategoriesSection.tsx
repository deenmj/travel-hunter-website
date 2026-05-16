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
    <section className="bg-slate-50 dark:bg-slate-900 py-12 md:py-16">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          Explore by Category
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(categories).map(([categoryKey, items]) => (
            <div key={categoryKey} className="space-y-4">
              <div className={`bg-gradient-to-br ${categoryColors[categoryKey as keyof typeof categoryColors]} rounded-lg p-6 text-white`}>
                <h3 className="text-2xl font-bold">{CATEGORY_LABELS[categoryKey as keyof typeof CATEGORY_LABELS]}</h3>
                <p className="text-sm text-white text-opacity-90 mt-2">{items.length} places curated</p>
              </div>

              {items.length === 0 ? (
                <Card className="h-32 flex items-center justify-center">
                  <p className="text-gray-600 dark:text-gray-400">Coming soon</p>
                </Card>
              ) : (
                <div className="space-y-3">
                  {items.map((destination) => (
                    <Link key={destination.id} href={`${ROUTES.DESTINATIONS}/${destination.slug}`}>
                      <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                        <CardContent className="p-4">
                          <h4 className="font-semibold text-gray-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                            {destination.name}
                          </h4>
                          {destination.location && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">📍 {destination.location}</p>
                          )}
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
