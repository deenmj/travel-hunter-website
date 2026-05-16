'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { getDestinations } from '@/lib/data-fetching'
import type { Destination } from '@/lib/types'
import { CATEGORIES, CATEGORY_LABELS, ROUTES } from '@/lib/constants'

export function DestinationsList() {
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [filteredDestinations, setFilteredDestinations] = useState<Destination[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDestinations = async () => {
      const data = await getDestinations()
      setDestinations(data)
      setFilteredDestinations(data)
      setLoading(false)
    }
    fetchDestinations()
  }, [])

  useEffect(() => {
    if (selectedCategory) {
      setFilteredDestinations(destinations.filter((d) => d.category === selectedCategory))
    } else {
      setFilteredDestinations(destinations)
    }
  }, [selectedCategory, destinations])

  return (
    <section className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          All Destinations
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {filteredDestinations.length} destinations to explore
        </p>
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        <Button
          onClick={() => setSelectedCategory(null)}
          variant={selectedCategory === null ? 'default' : 'outline'}
          className="h-10"
        >
          All Categories
        </Button>
        {Object.entries(CATEGORIES).map(([key, value]) => (
          <Button
            key={value}
            onClick={() => setSelectedCategory(value)}
            variant={selectedCategory === value ? 'default' : 'outline'}
            className="h-10 capitalize"
          >
            {CATEGORY_LABELS[value as keyof typeof CATEGORY_LABELS]}
          </Button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-200 dark:bg-slate-700 rounded-lg animate-pulse"></div>
          ))}
        </div>
      ) : filteredDestinations.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">No destinations found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDestinations.map((destination) => (
            <Link key={destination.id} href={`${ROUTES.DESTINATIONS}/${destination.slug}`}>
              <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col">
                <div className="relative h-48 w-full bg-gray-200 dark:bg-slate-700 overflow-hidden flex-shrink-0">
                  {destination.featured_image ? (
                    <Image
                      src={destination.featured_image}
                      alt={destination.name}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center">
                      <span className="text-white text-5xl">📍</span>
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <span className="inline-block px-3 py-1 bg-emerald-600 text-white text-xs font-semibold rounded-full capitalize">
                      {destination.category}
                    </span>
                  </div>
                </div>

                <CardContent className="p-4 flex-grow flex flex-col">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1 line-clamp-2">
                    {destination.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 flex-grow">
                    {destination.description}
                  </p>
                  {destination.location && (
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-3">📍 {destination.location}</p>
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
