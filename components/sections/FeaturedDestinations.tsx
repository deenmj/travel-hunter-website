import Link from 'next/link'
import Image from 'next/image'
import { ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { getFeaturedDestinations } from '@/lib/data-fetching'
import type { Destination } from '@/lib/types'
import { ROUTES } from '@/lib/constants'

export async function FeaturedDestinations() {
  const destinations = await getFeaturedDestinations(4)

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Featured Destinations
          </h2>
          <p className="text-gray-600 dark:text-gray-400">Discover the most popular places travelers love</p>
        </div>
        <Link href={ROUTES.DESTINATIONS}>
          <Button variant="ghost" className="gap-2">
            View All <ChevronRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>

      {destinations.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">No destinations found yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {destinations.map((destination) => (
            <Link key={destination.id} href={`${ROUTES.DESTINATIONS}/${destination.slug}`}>
              <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
                <div className="relative h-48 w-full bg-gray-200 dark:bg-slate-700 overflow-hidden">
                  {destination.featured_image ? (
                    <Image
                      src={destination.featured_image}
                      alt={destination.name}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center">
                      <span className="text-white text-4xl">📍</span>
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <span className="inline-block px-3 py-1 bg-emerald-600 text-white text-xs font-semibold rounded-full capitalize">
                      {destination.category}
                    </span>
                  </div>
                </div>

                <CardContent className="p-4">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1 line-clamp-2">
                    {destination.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {destination.description}
                  </p>
                  {destination.location && (
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">📍 {destination.location}</p>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}
