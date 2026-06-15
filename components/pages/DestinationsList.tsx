'use client'

import Link from 'next/link'
import { useEffect, useState, useCallback } from 'react'
import { Search } from 'lucide-react'
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
import { getDestinationHref, getRating } from '@/lib/destination-utils'
import { WishlistButton } from '@/components/ui/WishlistButton'
import { Star, ShieldCheck, MapPin, X, SlidersHorizontal, Trash2 } from 'lucide-react'
import { CATEGORIES, CATEGORY_LABELS, CATEGORY_ICONS, BUDGET_LEVELS, ALL_DISTRICTS } from '@/lib/constants'

interface Filters {
  region?: string
  budget?: string
  category?: string
}

const DEFAULT_FILTERS: Filters = { category: 'all', region: 'all', budget: 'all' }

export function DestinationsList() {
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [filteredDestinations, setFilteredDestinations] = useState<Destination[]>([])
  
  const [activeFilters, setActiveFilters] = useState<Filters>(DEFAULT_FILTERS)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'featured' | 'name-asc' | 'name-desc'>('featured')
  
  const [loading, setLoading] = useState(true)

  const activeFilterCount = [
    activeFilters.category !== 'all' ? 1 : 0,
    activeFilters.region !== 'all' ? 1 : 0,
    activeFilters.budget !== 'all' ? 1 : 0,
  ].reduce((a, b) => a + b, 0)

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

    if (activeFilters.category && activeFilters.category !== 'all') {
      result = result.filter((d) => d.category === activeFilters.category)
    }
    if (activeFilters.region && activeFilters.region !== 'all') {
      result = result.filter((d) => d.region === activeFilters.region || d.location?.includes(activeFilters.region!))
    }
    if (activeFilters.budget && activeFilters.budget !== 'all') {
      result = result.filter((d) => d.budget === activeFilters.budget)
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      result = result.filter(
        (d) =>
          d.name.toLowerCase().includes(query) ||
          d.description.toLowerCase().includes(query) ||
          (d.location && d.location.toLowerCase().includes(query)) ||
          (d.region && d.region.toLowerCase().includes(query))
      )
    }

    if (sortBy === 'name-asc') {
      result.sort((a, b) => a.name.localeCompare(b.name))
    } else if (sortBy === 'name-desc') {
      result.sort((a, b) => b.name.localeCompare(a.name))
    } else {
      result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    }

    setFilteredDestinations(result)
  }, [activeFilters, searchQuery, sortBy, destinations])

  const clearFilters = useCallback(() => {
    setSearchQuery('')
    setActiveFilters(DEFAULT_FILTERS)
  }, [])

  return (
    <section className="w-full bg-slate-50 dark:bg-slate-950 min-h-screen">
      {/* ── Hero Header & Search ── */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 pb-6 md:pb-10 pt-10 md:pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white mb-3 md:mb-6 tracking-tight">
            Explore Destinations
          </h1>
          <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-8 md:mb-10">
            Find your perfect getaway from our curated collection of amazing places in Sri Lanka.
          </p>

          {/* Main Search Bar */}
          <div className="max-w-3xl mx-auto relative group">
            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
              <Search className="h-5 w-5 md:h-6 md:w-6 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Search place, district, keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full h-14 md:h-16 pl-[3.5rem] md:pl-[4rem] pr-12 rounded-full border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-base md:text-lg shadow-sm focus:ring-0 focus:border-emerald-500 dark:focus:border-emerald-500 transition-all text-slate-900 dark:text-white placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-5 flex items-center"
              >
                <X className="h-5 w-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">

        {/* ── Compact Professional Filter Toolbar ── */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl md:rounded-full p-3 md:p-4 shadow-sm border border-slate-200 dark:border-slate-800 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 items-center">
            
            {/* Type Filter */}
            <div className="w-full">
              <Select value={activeFilters.category} onValueChange={(val) => setActiveFilters({ ...activeFilters, category: val })}>
                <SelectTrigger className="w-full h-12 rounded-xl md:rounded-full bg-slate-50 dark:bg-slate-800 border-none font-semibold px-5">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-emerald-500" />
                    <SelectValue placeholder="All Types" />
                  </div>
                </SelectTrigger>
                <SelectContent className="rounded-2xl">
                  <SelectItem value="all" className="font-medium">All Types</SelectItem>
                  {Object.entries(CATEGORIES).map(([key, val]) => (
                    <SelectItem key={val} value={val} className="font-medium">
                      <span className="mr-2">{CATEGORY_ICONS[val as keyof typeof CATEGORY_ICONS]}</span>
                      {CATEGORY_LABELS[val as keyof typeof CATEGORY_LABELS]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Region Filter */}
            <div className="w-full">
              <Select value={activeFilters.region} onValueChange={(val) => setActiveFilters({ ...activeFilters, region: val })}>
                <SelectTrigger className="w-full h-12 rounded-xl md:rounded-full bg-slate-50 dark:bg-slate-800 border-none font-semibold px-5">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-500" />
                    <SelectValue placeholder="All Districts" />
                  </div>
                </SelectTrigger>
                <SelectContent className="rounded-2xl max-h-[300px]">
                  <SelectItem value="all" className="font-medium">Anywhere</SelectItem>
                  {ALL_DISTRICTS.map((district) => (
                    <SelectItem key={district} value={district} className="font-medium">{district}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Budget Filter */}
            <div className="w-full">
              <Select value={activeFilters.budget} onValueChange={(val) => setActiveFilters({ ...activeFilters, budget: val })}>
                <SelectTrigger className="w-full h-12 rounded-xl md:rounded-full bg-slate-50 dark:bg-slate-800 border-none font-semibold px-5">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-500 font-bold">₹</span>
                    <SelectValue placeholder="Any Budget" />
                  </div>
                </SelectTrigger>
                <SelectContent className="rounded-2xl">
                  <SelectItem value="all" className="font-medium">Any Budget</SelectItem>
                  {Object.entries(BUDGET_LEVELS).map(([key, data]) => (
                    <SelectItem key={key} value={key} className="font-medium">
                      {key === 'low' ? '₹' : key === 'mid' ? '₹₹' : '₹₹₹'} - {data.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Reset Button */}
            <div className="w-full">
              <Button 
                onClick={clearFilters}
                disabled={activeFilterCount === 0}
                variant="ghost"
                className="w-full h-12 rounded-xl md:rounded-full font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Reset Filters
              </Button>
            </div>

          </div>
        </div>

        {/* ── Results Header ── */}
        <div className="flex items-center justify-between mb-6 gap-3">
          <div className="text-base md:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300 py-1 px-3 rounded-full text-sm">
              {filteredDestinations.length}
            </span>
            <span className="hidden sm:inline">Places Found</span>
            <span className="sm:hidden">Found</span>
          </div>
          <div className="w-40 sm:w-48 shrink-0">
            <Select value={sortBy} onValueChange={(val) => setSortBy(val as any)}>
              <SelectTrigger className="w-full h-10 md:h-11 rounded-xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-sm font-semibold shadow-sm">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured / Newest</SelectItem>
                <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                <SelectItem value="name-desc">Name (Z-A)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* ── Results Grid ── */}
        <div className="w-full">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 md:h-[22rem] bg-slate-200 dark:bg-slate-800 rounded-2xl md:rounded-3xl animate-pulse"></div>
              ))}
            </div>
          ) : filteredDestinations.length === 0 ? (
            <div className="text-center py-20 md:py-32 bg-white dark:bg-slate-900 rounded-[2rem] md:rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-sm max-w-3xl mx-auto px-6">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-8 h-8 md:w-10 md:h-10 text-slate-400 dark:text-slate-500" />
              </div>
              <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white mb-3">No results found</h3>
              <p className="text-base md:text-lg text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto">
                Try broadening your search or adjusting the filters.
              </p>
              <Button 
                onClick={clearFilters}
                className="rounded-full px-8 h-12 text-base font-bold bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
              >
                Clear all filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDestinations.map((destination) => {
                const thumbnail = getDestinationThumbnail(destination)
                const rating = getRating(destination.slug || destination.id)
                return (
                <div key={destination.id} className="relative group h-full">
                  <Link href={getDestinationHref(destination)} className="block h-full">
                    <Card className="overflow-hidden border-0 bg-white dark:bg-slate-900 shadow-[0_4px_20px_rgb(0,0,0,0.04)] dark:shadow-[0_4px_20px_rgb(0,0,0,0.2)] hover:shadow-2xl hover:-translate-y-1 md:hover:-translate-y-2 transition-all duration-500 cursor-pointer h-full flex flex-col rounded-2xl md:rounded-[2rem] group ring-1 ring-slate-100 dark:ring-slate-800 hover:ring-emerald-500/50 dark:hover:ring-emerald-500/50">
                      <div className="relative aspect-[4/3] bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0">
                        {thumbnail ? (
                          <img
                            src={thumbnail}
                            alt={destination.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-3xl md:text-4xl bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/40 dark:to-teal-900/40">
                            🗺️
                          </div>
                        )}
                        
                        <div className="absolute top-3 md:top-4 right-3 md:right-4 z-10 flex flex-col gap-1.5 items-end">
                          {destination.is_top_pick && (
                            <span className="inline-flex items-center gap-1 px-2 md:px-2.5 py-1 md:py-1.5 bg-amber-500/95 backdrop-blur-md text-white text-[10px] md:text-xs font-black rounded-lg md:rounded-xl shadow-lg uppercase tracking-wider">
                              <ShieldCheck className="w-3 h-3 md:w-3.5 md:h-3.5" /> Approved
                            </span>
                          )}
                        </div>

                        <div className="absolute top-3 md:top-4 left-3 md:left-4 z-10">
                          <div className="flex gap-1 md:gap-1.5">
                            {destination.category && (
                              <span className="inline-flex items-center px-2 md:px-2.5 py-1 md:py-1.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md text-slate-900 dark:text-white text-[10px] md:text-xs font-black rounded-lg md:rounded-xl shadow-lg uppercase tracking-wider">
                                {destination.category}
                              </span>
                            )}
                            {destination.budget && (
                              <span className="inline-flex items-center px-2 md:px-2.5 py-1 md:py-1.5 bg-emerald-500/95 backdrop-blur-md text-white text-[10px] md:text-xs font-black rounded-lg md:rounded-xl shadow-lg uppercase tracking-wider">
                                {destination.budget === 'low' ? '₹' : destination.budget === 'mid' ? '₹₹' : '₹₹₹'}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
                        
                        <div className="absolute bottom-3 md:bottom-5 left-3 md:left-5 right-3 md:right-5 z-10">
                          <h3 className="font-black text-xl sm:text-2xl md:text-3xl text-white group-hover:text-emerald-400 transition-colors line-clamp-1 drop-shadow-md mb-1 md:mb-2">
                            {destination.name}
                          </h3>
                          <div className="flex items-center gap-2 md:gap-3">
                            {destination.location && (
                              <div className="flex items-center gap-1 text-xs md:text-sm text-slate-200 font-medium">
                                <MapPin className="w-3 h-3 md:w-4 md:h-4 text-emerald-400 shrink-0" />
                                <span className="truncate">{destination.location}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-1 text-xs md:text-sm text-amber-400 font-bold shrink-0">
                              <Star className="w-3 h-3 md:w-4 md:h-4 fill-amber-400" />
                              {rating}
                            </div>
                          </div>
                        </div>
                      </div>

                      <CardContent className="p-4 md:p-6 flex-1 flex flex-col justify-between relative bg-white dark:bg-slate-900">
                        <div>
                          <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4 md:mb-6">
                            {destination.description}
                          </p>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mt-auto">
                          {destination.highlights?.slice(0, 3).map((highlight, idx) => (
                            <span key={idx} className="text-xs font-medium bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-800">
                              {highlight}
                            </span>
                          ))}
                          {destination.highlights && destination.highlights.length > 3 && (
                            <span className="text-xs font-medium bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-800">
                              +{destination.highlights.length - 3}
                            </span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                  
                  {/* Floating Wishlist Button */}
                  <div className="absolute -top-2 -right-2 md:-top-3 md:-right-3 z-20 scale-90 group-hover:scale-100 transition-transform duration-300">
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
          )}
        </div>
      </div>
    </section>
  )
}
