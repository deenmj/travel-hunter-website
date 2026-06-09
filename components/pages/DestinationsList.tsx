'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Search, ArrowUpDown, ChevronDown } from 'lucide-react'
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
import { getDestinationThumbnail } from '@/lib/video-utils'
import { getDestinationHref } from '@/lib/destination-utils'
import { QuickFilters } from '@/components/sections/QuickFilters'
import { WishlistButton } from '@/components/ui/WishlistButton'

export function DestinationsList() {
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [filteredDestinations, setFilteredDestinations] = useState<Destination[]>([])
  
  const [activeFilters, setActiveFilters] = useState<{ region?: string; budget?: string; category?: string }>({})
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'featured' | 'name-asc' | 'name-desc'>('featured')
  
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
    let result = [...destinations]

    // 1. Quick Filters (Region, Budget, Category)
    if (activeFilters.category) {
      result = result.filter((d) => d.category === activeFilters.category)
    }
    if (activeFilters.region) {
      result = result.filter((d) => d.region === activeFilters.region || d.location?.includes(activeFilters.region!))
    }
    if (activeFilters.budget) {
      result = result.filter((d) => d.budget === activeFilters.budget)
    }

    // 2. Search Query Filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      result = result.filter(
        (d) =>
          d.name.toLowerCase().includes(query) ||
          d.description.toLowerCase().includes(query) ||
          (d.location && d.location.toLowerCase().includes(query))
      )
    }

    // 3. Sorting
    if (sortBy === 'name-asc') {
      result.sort((a, b) => a.name.localeCompare(b.name))
    } else if (sortBy === 'name-desc') {
      result.sort((a, b) => b.name.localeCompare(a.name))
    } else {
      // 'featured' / newest - by default sorting or created_at descending if present
      result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    }

    setFilteredDestinations(result)
  }, [activeFilters, searchQuery, sortBy, destinations])

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2">
          Explore Destinations
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Find your perfect getaway from {destinations.length} amazing locations.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Left Sidebar - Filters */}
        <div className="w-full lg:w-1/4 shrink-0 space-y-6 lg:sticky lg:top-24">
          <QuickFilters onFilterChange={setActiveFilters} />
        </div>

        {/* Right Content */}
        <div className="flex-1 w-full space-y-6">
          {/* Search and Sort */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search by name or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 px-4 pl-11 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-slate-800 dark:text-white transition-all shadow-sm"
              />
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600 text-sm"
                >
                  ✕
                </button>
              )}
            </div>
            
            <div className="w-full sm:w-48 shrink-0">
              <Select value={sortBy} onValueChange={(val) => setSortBy(val as any)}>
                <SelectTrigger className="w-full h-12 rounded-xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-sm shadow-sm">
                  <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
                    <ArrowUpDown className="w-4 h-4 text-emerald-500" />
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

          <div className="text-sm font-medium text-slate-500 mb-2">
            Showing {filteredDestinations.length} destinations
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-[22rem] bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse"></div>
              ))}
            </div>
          ) : filteredDestinations.length === 0 ? (
            <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
              <Search className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">No destinations found</h3>
              <p className="text-slate-500 dark:text-slate-400">Try adjusting your filters or search query.</p>
              <Button 
                onClick={() => {
                  setSearchQuery('')
                  setActiveFilters({})
                }}
                variant="outline" 
                className="mt-4 rounded-full"
              >
                Clear all filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredDestinations.map((destination) => {
                const thumbnail = getDestinationThumbnail(destination)
                return (
                <div key={destination.id} className="relative group h-full">
                  <Link href={getDestinationHref(destination)} className="block h-full">
                    <Card className="overflow-hidden border border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900 hover:border-emerald-500/50 dark:hover:border-emerald-500/50 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer h-full flex flex-col rounded-2xl group">
                      <div className="relative aspect-[4/3] bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0">
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
                        
                        <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 items-end">
                          {destination.category && (
                            <span className="inline-flex items-center px-2.5 py-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-slate-900 dark:text-white text-[10px] font-bold rounded-md shadow-sm uppercase tracking-wider">
                              {destination.category}
                            </span>
                          )}
                          {destination.budget && (
                            <span className="inline-flex items-center px-2.5 py-1 bg-emerald-500/90 backdrop-blur-md text-white text-[10px] font-bold rounded-md shadow-sm uppercase tracking-wider">
                              {destination.budget}
                            </span>
                          )}
                        </div>

                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                        
                        <div className="absolute bottom-4 left-4 right-4 z-10">
                          <h3 className="font-bold text-xl text-white group-hover:text-emerald-400 transition-colors line-clamp-1 drop-shadow-md">
                            {destination.name}
                          </h3>
                        </div>
                      </div>

                      <CardContent className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          {destination.location && (
                            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-3">
                              <span>📍</span>
                              <span className="truncate">{destination.location}</span>
                            </div>
                          )}
                          <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
                            {destination.description}
                          </p>
                        </div>
                        
                        <div className="flex flex-wrap gap-1.5 mt-auto">
                          {destination.highlights?.slice(0, 3).map((highlight, idx) => (
                            <span key={idx} className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-1 rounded-md whitespace-nowrap">
                              {highlight}
                            </span>
                          ))}
                          {destination.highlights && destination.highlights.length > 3 && (
                            <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-1 rounded-md">
                              +{destination.highlights.length - 3} more
                            </span>
                          )}
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
          )}
        </div>
      </div>
    </section>
  )
}
