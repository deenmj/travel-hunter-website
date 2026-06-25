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
import { Star, ShieldCheck, MapPin, X, SlidersHorizontal, Trash2, Wallet } from 'lucide-react'
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

  // ── Map state ──────────────────────────────────────────────────────────────
  const [selectedMapDistrict, setSelectedMapDistrict] = useState<string | null>(null)
  const [isMapModalOpen, setIsMapModalOpen] = useState(false)
  const [MapComponents, setMapComponents] = useState<{
    SriLankaMap: typeof import('@/components/destination/SriLankaMap').SriLankaMap
    MapModal: typeof import('@/components/destination/MapModal').MapModal
  } | null>(null)

  // Lazy-load map components only on client
  useEffect(() => {
    Promise.all([
      import('@/components/destination/SriLankaMap'),
      import('@/components/destination/MapModal'),
    ]).then(([mapMod, modalMod]) => {
      setMapComponents({
        SriLankaMap: mapMod.SriLankaMap,
        MapModal: modalMod.MapModal,
      })
    })
  }, [])

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
    setSelectedMapDistrict(null)
  }, [])

  // ── Handle map district selection ─────────────────────────────────────────
  const handleDistrictSelect = useCallback((district: string | null) => {
    setSelectedMapDistrict(district)
    setActiveFilters((prev) => ({ ...prev, region: district ?? 'all' }))
  }, [])

  // Sync region dropdown → map (clear map selection if user picks dropdown manually)
  const handleRegionFilterChange = useCallback((val: string) => {
    setActiveFilters((prev) => ({ ...prev, region: val }))
    setSelectedMapDistrict(val === 'all' ? null : val)
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

          {/* Mobile: Browse on Map button */}
          <div className="md:hidden mt-4">
            <button
              id="browse-on-map-btn"
              onClick={() => setIsMapModalOpen(true)}
              className={`inline-flex items-center gap-2.5 px-6 py-3 rounded-full font-bold text-sm transition-all active:scale-95 shadow-sm ${
                selectedMapDistrict
                  ? 'bg-emerald-600 text-white shadow-emerald-200 dark:shadow-emerald-900'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-2 border-slate-200 dark:border-slate-700 hover:border-emerald-400 hover:text-emerald-600'
              }`}
            >
              <span className="text-base">🗺️</span>
              {selectedMapDistrict ? `Map: ${selectedMapDistrict}` : 'Browse on Map'}
              {selectedMapDistrict && (
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(e) => { e.stopPropagation(); handleDistrictSelect(null) }}
                  className="ml-0.5 bg-white/25 hover:bg-white/40 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">

        {/* ── Desktop: Inline Map ── */}
        {MapComponents && (
          <div className="hidden md:block mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <span>🗺️</span> Browse by District
              </h2>
              {selectedMapDistrict && (
                <button
                  onClick={() => handleDistrictSelect(null)}
                  className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-200 transition-colors bg-emerald-50 dark:bg-emerald-950 px-3 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-800"
                >
                  <X className="w-3 h-3" />
                  Clear map selection
                </button>
              )}
            </div>
            <MapComponents.SriLankaMap
              destinations={destinations}
              selectedDistrict={selectedMapDistrict}
              onDistrictSelect={handleDistrictSelect}
              height={450}
              className="w-full"
            />
          </div>
        )}

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

            {/* Region Filter — synced with map */}
            <div className="w-full">
              <Select value={activeFilters.region} onValueChange={handleRegionFilterChange}>
                <SelectTrigger className={`w-full h-12 rounded-xl md:rounded-full border-none font-semibold px-5 transition-colors ${
                  selectedMapDistrict
                    ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                    : 'bg-slate-50 dark:bg-slate-800'
                }`}>
                  <div className="flex items-center gap-2">
                    <MapPin className={`w-4 h-4 ${selectedMapDistrict ? 'text-emerald-500' : 'text-emerald-500'}`} />
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
                disabled={activeFilterCount === 0 && !selectedMapDistrict}
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
          <div className="flex items-center gap-2 flex-wrap">
            <div className="text-base md:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300 py-1 px-3 rounded-full text-sm">
                {filteredDestinations.length}
              </span>
              <span className="hidden sm:inline">Places Found</span>
              <span className="sm:hidden">Found</span>
            </div>
            {/* Map selection active indicator (desktop) */}
            {selectedMapDistrict && (
              <span className="hidden md:inline-flex items-center gap-1.5 text-xs font-bold bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 px-3 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                <MapPin className="w-3 h-3" />
                {selectedMapDistrict}
                <button
                  onClick={() => handleDistrictSelect(null)}
                  className="hover:text-emerald-900 dark:hover:text-emerald-100 ml-0.5"
                  aria-label="Clear district filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
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
                  <Link href={getDestinationHref(destination)} className="block h-full relative group">
                    <Card className="overflow-hidden border border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 cursor-pointer h-full flex flex-col rounded-[1.5rem] md:rounded-[2rem]">
                      
                      {/* ── Image Section ── */}
                      <div className="relative aspect-[16/9] bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0">
                        {thumbnail ? (
                          <img
                            src={thumbnail}
                            alt={destination.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-4xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20">
                            🗺️
                          </div>
                        )}
                        
                        {/* Top Left Badges */}
                        <div className="absolute top-3 left-3 md:top-4 md:left-4 z-10 flex flex-col gap-1.5 items-start">
                          <div className="flex gap-1.5">
                            {destination.category && (
                              <span className="inline-flex items-center px-2.5 py-1 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md text-slate-900 dark:text-white text-[10px] font-black rounded-lg shadow-sm uppercase tracking-wider">
                                {destination.category}
                              </span>
                            )}
                            {destination.is_top_pick && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-500/95 backdrop-blur-md text-white text-[10px] font-black rounded-lg shadow-sm uppercase tracking-wider">
                                <ShieldCheck className="w-3.5 h-3.5" /> Approved
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      </div>

                      {/* ── Content Section ── */}
                      <CardContent className="p-5 md:p-6 flex-1 flex flex-col bg-white dark:bg-slate-900 relative">
                        
                        {/* Title and Rating Row */}
                        <div className="flex justify-between items-start gap-3 mb-2">
                          <h3 className="font-black text-xl md:text-2xl text-slate-900 dark:text-white line-clamp-1 group-hover:text-emerald-500 transition-colors">
                            {destination.name}
                          </h3>
                          <div className="flex items-center gap-1 text-sm font-bold text-slate-900 dark:text-white shrink-0 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-lg border border-slate-100 dark:border-slate-700">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            {rating}
                          </div>
                        </div>

                        {/* Location */}
                        <div className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 mb-3">
                          <MapPin className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span className="truncate">{destination.location || 'Sri Lanka'}</span>
                        </div>
                        
                        {/* Description */}
                        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed mb-5 flex-1">
                          {destination.description}
                        </p>
                        
                        {/* Footer Data Row */}
                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100 dark:border-slate-800/80">
                          
                          {/* Budget Indicator */}
                          <div className="flex items-center gap-1.5">
                            <Wallet className="w-4 h-4 text-slate-400" />
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                              {destination.budget === 'low' ? 'Budget' : destination.budget === 'mid' ? 'Mid Range' : destination.budget === 'luxury' ? 'Luxury' : 'Any'}
                            </span>
                          </div>

                          {/* Highlights Pills */}
                          <div className="flex gap-1.5">
                            {destination.highlights?.slice(0, 2).map((highlight, idx) => (
                              <span key={idx} className="text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-1 rounded-md max-w-[80px] truncate">
                                {highlight}
                              </span>
                            ))}
                            {destination.highlights && destination.highlights.length > 2 && (
                              <span className="text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-1 rounded-md">
                                +{destination.highlights.length - 2}
                              </span>
                            )}
                          </div>
                          
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Mobile: Map Modal ── */}
      {MapComponents && (
        <MapComponents.MapModal
          isOpen={isMapModalOpen}
          onClose={() => setIsMapModalOpen(false)}
          destinations={destinations}
          selectedDistrict={selectedMapDistrict}
          onDistrictSelect={handleDistrictSelect}
        />
      )}
    </section>
  )
}
