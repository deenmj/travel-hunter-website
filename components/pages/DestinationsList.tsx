'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
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
import { Star, ShieldCheck, MapPin, Wallet, Filter, X } from 'lucide-react'
import { CATEGORIES, CATEGORY_LABELS, CATEGORY_ICONS, BUDGET_LEVELS, ALL_DISTRICTS } from '@/lib/constants'

export function DestinationsList() {
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [filteredDestinations, setFilteredDestinations] = useState<Destination[]>([])
  
  const [activeFilters, setActiveFilters] = useState<{ region?: string; budget?: string; category?: string }>({
    category: 'all',
    region: 'all',
    budget: 'all'
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'featured' | 'name-asc' | 'name-desc'>('featured')
  
  const [loading, setLoading] = useState(true)

  const popularRegions = ['Kandy', 'Ella', 'Galle', 'Sigiriya', 'Mirissa', 'Colombo']

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
    if (activeFilters.category && activeFilters.category !== 'all') {
      result = result.filter((d) => d.category === activeFilters.category)
    }
    if (activeFilters.region && activeFilters.region !== 'all') {
      result = result.filter((d) => d.region === activeFilters.region || d.location?.includes(activeFilters.region!))
    }
    if (activeFilters.budget && activeFilters.budget !== 'all') {
      result = result.filter((d) => d.budget === activeFilters.budget)
    }

    // 2. Search Query Filter
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
    <section className="w-full bg-slate-50 dark:bg-slate-950 min-h-screen">
      {/* Hero Header & Search */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 pb-10 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
            Explore Destinations
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10">
            Find your perfect getaway from our curated collection of amazing places in Sri Lanka.
          </p>

          {/* Strong Main Search Bar */}
          <div className="max-w-3xl mx-auto relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-6 w-6 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Search by Place, District, City, or Keyword (e.g. 'Beach', 'Kandy')"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full h-16 pl-14 pr-14 rounded-full border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-lg shadow-sm focus:ring-0 focus:border-emerald-500 dark:focus:border-emerald-500 transition-all text-slate-900 dark:text-white placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-5 flex items-center"
              >
                <X className="h-5 w-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter System */}
        <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 shadow-sm border border-slate-200 dark:border-slate-800 mb-8 space-y-6">
          
          {/* Top Row: Categories */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveFilters({ ...activeFilters, category: 'all' })}
              className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
                activeFilters.category === 'all'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
              }`}
            >
              All Types
            </button>
            {Object.entries(CATEGORIES).map(([key, val]) => (
              <button
                key={val}
                onClick={() => setActiveFilters({ ...activeFilters, category: val })}
                className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${
                  activeFilters.category === val
                    ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                }`}
              >
                <span>{CATEGORY_ICONS[val as keyof typeof CATEGORY_ICONS]}</span>
                {CATEGORY_LABELS[val as keyof typeof CATEGORY_LABELS]}
              </button>
            ))}
          </div>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* Middle Row: Regions & Budget */}
          <div className="flex flex-col lg:flex-row gap-6 justify-between lg:items-center">
            
            <div className="space-y-3 flex-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <MapPin className="w-4 h-4" /> Districts & Regions
              </label>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setActiveFilters({ ...activeFilters, region: 'all' })}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all border ${
                    activeFilters.region === 'all'
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  Anywhere
                </button>
                {popularRegions.map((region) => (
                  <button
                    key={region}
                    onClick={() => setActiveFilters({ ...activeFilters, region })}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all border ${
                      activeFilters.region === region
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {region}
                  </button>
                ))}
                
                {/* All Districts Dropdown */}
                <div className="w-48 ml-auto lg:ml-2">
                  <Select 
                    value={activeFilters.region === 'all' || popularRegions.includes(activeFilters.region || '') ? '' : activeFilters.region} 
                    onValueChange={(val) => setActiveFilters({ ...activeFilters, region: val })}
                  >
                    <SelectTrigger className="h-10 rounded-xl bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 font-semibold">
                      <SelectValue placeholder="All Districts..." />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      {ALL_DISTRICTS.map((district) => (
                        <SelectItem key={district} value={district}>{district}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Budget */}
            <div className="space-y-3 shrink-0">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Wallet className="w-4 h-4" /> Budget Level
              </label>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setActiveFilters({ ...activeFilters, budget: 'all' })}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all border ${
                    activeFilters.budget === 'all'
                      ? 'border-amber-500 bg-amber-50 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  Any
                </button>
                {Object.entries(BUDGET_LEVELS).map(([key, data]) => (
                  <button
                    key={key}
                    onClick={() => setActiveFilters({ ...activeFilters, budget: key })}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all border ${
                      activeFilters.budget === key
                        ? 'border-amber-500 bg-amber-50 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span>{key === 'low' ? '₹' : key === 'mid' ? '₹₹' : '₹₹₹'}</span>
                    <span>{data.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <div className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300 py-1 px-3 rounded-full text-sm">
              {filteredDestinations.length}
            </span>
            Places Found
          </div>
          <div className="w-full sm:w-48 shrink-0">
            <Select value={sortBy} onValueChange={(val) => setSortBy(val as any)}>
              <SelectTrigger className="w-full h-11 rounded-xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 font-semibold shadow-sm">
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

        {/* Results Grid */}
        <div className="w-full">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-[22rem] bg-slate-200 dark:bg-slate-800 rounded-3xl animate-pulse"></div>
              ))}
            </div>
          ) : filteredDestinations.length === 0 ? (
            <div className="text-center py-32 bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-sm max-w-3xl mx-auto">
              <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-slate-400 dark:text-slate-500" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3">No results found</h3>
              <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto">
                We couldn't find any places matching your exact search. Try broadening your criteria or checking for typos.
              </p>
              <Button 
                onClick={() => {
                  setSearchQuery('')
                  setActiveFilters({ category: 'all', region: 'all', budget: 'all' })
                }}
                className="rounded-full px-8 h-12 text-base font-bold bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
              >
                Clear all filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDestinations.map((destination) => {
                const thumbnail = getDestinationThumbnail(destination)
                const rating = getRating(destination.slug || destination.id)
                return (
                <div key={destination.id} className="relative group h-full">
                  <Link href={getDestinationHref(destination)} className="block h-full">
                    <Card className="overflow-hidden border-0 bg-white dark:bg-slate-900 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer h-full flex flex-col rounded-[2rem] group ring-1 ring-slate-100 dark:ring-slate-800 hover:ring-emerald-500/50 dark:hover:ring-emerald-500/50">
                      <div className="relative aspect-[4/3] bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0">
                        {thumbnail ? (
                          <img
                            src={thumbnail}
                            alt={destination.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-4xl bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/40 dark:to-teal-900/40">
                            🗺️
                          </div>
                        )}
                        
                        <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 items-end">
                          {destination.is_top_pick && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-amber-500/95 backdrop-blur-md text-white text-[10px] font-black rounded-xl shadow-lg uppercase tracking-wider">
                              <ShieldCheck className="w-3.5 h-3.5" /> Approved
                            </span>
                          )}
                        </div>

                        <div className="absolute top-4 left-4 z-10">
                          <div className="flex gap-1.5">
                            {destination.category && (
                              <span className="inline-flex items-center px-2.5 py-1.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md text-slate-900 dark:text-white text-[10px] font-black rounded-xl shadow-lg uppercase tracking-wider">
                                {destination.category}
                              </span>
                            )}
                            {destination.budget && (
                              <span className="inline-flex items-center px-2.5 py-1.5 bg-emerald-500/95 backdrop-blur-md text-white text-[10px] font-black rounded-xl shadow-lg uppercase tracking-wider">
                                {destination.budget === 'low' ? '₹' : destination.budget === 'mid' ? '₹₹' : '₹₹₹'}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
                        
                        <div className="absolute bottom-5 left-5 right-5 z-10">
                          <h3 className="font-black text-2xl md:text-3xl text-white group-hover:text-emerald-400 transition-colors line-clamp-1 drop-shadow-md mb-2">
                            {destination.name}
                          </h3>
                          <div className="flex items-center gap-3">
                            {destination.location && (
                              <div className="flex items-center gap-1 text-sm text-slate-200 font-medium">
                                <MapPin className="w-4 h-4 text-emerald-400" />
                                <span className="truncate">{destination.location}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-1 text-sm text-amber-400 font-bold">
                              <Star className="w-4 h-4 fill-amber-400" />
                              {rating}
                            </div>
                          </div>
                        </div>
                      </div>

                      <CardContent className="p-6 flex-1 flex flex-col justify-between relative bg-white dark:bg-slate-900">
                        <div>
                          <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed mb-6">
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
                  <div className="absolute -top-3 -right-3 z-20 scale-90 group-hover:scale-100 transition-transform duration-300">
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
