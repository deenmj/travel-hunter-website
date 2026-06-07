'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { Search, MapPin, ArrowUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getDestinations } from '@/lib/data-fetching'
import type { Destination } from '@/lib/types'
import { CATEGORIES, CATEGORY_LABELS, ROUTES } from '@/lib/constants'
import { getDestinationThumbnail } from '@/lib/video-utils'
import { getDestinationHref } from '@/lib/destination-utils'

export function DestinationsList() {
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [filteredDestinations, setFilteredDestinations] = useState<Destination[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'featured' | 'name-asc' | 'name-desc'>('featured')
  const [uniqueLocations, setUniqueLocations] = useState<string[]>([])
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
    const locations = Array.from(
      new Set(
        destinations
          .map((d) => d.location)
          .filter((loc): loc is string => !!loc)
      )
    ).sort()
    setUniqueLocations(locations)
  }, [destinations])

  useEffect(() => {
    let result = [...destinations]

    // 1. Category Filter
    if (selectedCategory) {
      result = result.filter((d) => d.category === selectedCategory)
    }

    // 2. Location Filter
    if (selectedLocation) {
      result = result.filter((d) => d.location === selectedLocation)
    }

    // 3. Search Query Filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      result = result.filter(
        (d) =>
          d.name.toLowerCase().includes(query) ||
          d.description.toLowerCase().includes(query) ||
          (d.location && d.location.toLowerCase().includes(query))
      )
    }

    // 4. Sorting
    if (sortBy === 'name-asc') {
      result.sort((a, b) => a.name.localeCompare(b.name))
    } else if (sortBy === 'name-desc') {
      result.sort((a, b) => b.name.localeCompare(a.name))
    } else {
      // 'featured' / newest - by default sorting or created_at descending if present
      result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    }

    setFilteredDestinations(result)
  }, [selectedCategory, selectedLocation, searchQuery, sortBy, destinations])

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          All Destinations
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {filteredDestinations.length} destinations to explore
        </p>
      </div>

      {/* Category filters - scrolling pills on mobile, normal flex on desktop */}
      <div className="flex overflow-x-auto whitespace-nowrap pb-3 -mx-4 px-4 sm:mx-0 sm:px-0 gap-2 mb-6 scrollbar-none snap-x snap-mandatory">
        <Button
          onClick={() => setSelectedCategory(null)}
          variant={selectedCategory === null ? 'default' : 'outline'}
          className="h-8 md:h-10 text-xs md:text-sm px-3 md:px-4 rounded-full flex-shrink-0 snap-start"
        >
          All Categories
        </Button>
        {Object.entries(CATEGORIES).map(([key, value]) => (
          <Button
            key={value}
            onClick={() => setSelectedCategory(value)}
            variant={selectedCategory === value ? 'default' : 'outline'}
            className="h-8 md:h-10 text-xs md:text-sm px-3 md:px-4 rounded-full capitalize flex-shrink-0 snap-start"
          >
            {CATEGORY_LABELS[value as keyof typeof CATEGORY_LABELS]}
          </Button>
        ))}
      </div>

      {/* Search, Filter & Sort Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8 w-full">
        {/* Search Input */}
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search destinations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 px-3 pl-10 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 dark:text-white"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 text-sm"
            >
              ✕
            </button>
          )}
        </div>

        {/* Location Dropdown */}
        <div className="w-full sm:w-48">
          <Select value={selectedLocation || 'all'} onValueChange={(val) => setSelectedLocation(val === 'all' ? null : val)}>
            <SelectTrigger className="w-full h-10 rounded-xl bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-sm">
              <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
                <MapPin className="w-4 h-4 text-emerald-500 shrink-0" />
                <SelectValue placeholder="All Locations" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              {uniqueLocations.map((loc) => (
                <SelectItem key={loc} value={loc}>
                  {loc}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Sort Dropdown */}
        <div className="w-full sm:w-48">
          <Select value={sortBy} onValueChange={(val) => setSortBy(val as any)}>
            <SelectTrigger className="w-full h-10 rounded-xl bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-sm">
              <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
                <ArrowUpDown className="w-4 h-4 text-emerald-500 shrink-0" />
                <SelectValue placeholder="Sort By" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured / Newest</SelectItem>
              <SelectItem value="name-asc">Name (A-Z)</SelectItem>
              <SelectItem value="name-desc">Name (Z-A)</SelectItem>
            </SelectContent>
          </Select>
        </div>
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
          {filteredDestinations.map((destination) => {
            const thumbnail = getDestinationThumbnail(destination)
            return (
            <Link key={destination.id} href={getDestinationHref(destination)}>
              <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col">
                <div className="relative h-48 w-full bg-gray-200 dark:bg-slate-700 overflow-hidden flex-shrink-0">
                  {thumbnail ? (
                    <img
                      src={thumbnail}
                      alt={destination.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
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
            )
          })}
        </div>
      )}
    </section>
  )
}
