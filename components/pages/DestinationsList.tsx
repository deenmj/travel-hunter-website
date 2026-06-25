'use client'

import Link from 'next/link'
import { useEffect, useState, useCallback, useRef } from 'react'
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
import {
  Star, ShieldCheck, MapPin, X, SlidersHorizontal,
  Trash2, Wallet, Map as MapIcon,
} from 'lucide-react'
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

  // Ref to results panel for scrolling on mobile
  const resultsRef = useRef<HTMLDivElement>(null)

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
      result = result.filter(
        (d) => d.region === activeFilters.region || d.location?.includes(activeFilters.region!),
      )
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
          (d.region && d.region.toLowerCase().includes(query)),
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

  // Sync region dropdown → map
  const handleRegionFilterChange = useCallback((val: string) => {
    setActiveFilters((prev) => ({ ...prev, region: val }))
    setSelectedMapDistrict(val === 'all' ? null : val)
  }, [])

  // ─────────────────────────────────────────────────────────────────────────
  // Destination card (shared between mobile and desktop)
  // ─────────────────────────────────────────────────────────────────────────
  const renderCard = (destination: Destination) => {
    const thumbnail = getDestinationThumbnail(destination)
    const rating = getRating(destination.slug || destination.id)
    return (
      <div key={destination.id} className="relative group h-full">
        <Link href={getDestinationHref(destination)} className="block h-full relative group">
          <Card className="overflow-hidden border border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 cursor-pointer h-full flex flex-col rounded-[1.5rem] md:rounded-[2rem]">

            {/* Image */}
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

            {/* Content */}
            <CardContent className="p-5 md:p-6 flex-1 flex flex-col bg-white dark:bg-slate-900 relative">
              <div className="flex justify-between items-start gap-3 mb-2">
                <h3 className="font-black text-xl md:text-2xl text-slate-900 dark:text-white line-clamp-1 group-hover:text-emerald-500 transition-colors">
                  {destination.name}
                </h3>
                <div className="flex items-center gap-1 text-sm font-bold text-slate-900 dark:text-white shrink-0 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-lg border border-slate-100 dark:border-slate-700">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  {rating}
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 mb-3">
                <MapPin className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="truncate">{destination.location || 'Sri Lanka'}</span>
              </div>

              <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed mb-5 flex-1">
                {destination.description}
              </p>

              <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center gap-1.5">
                  <Wallet className="w-4 h-4 text-slate-400" />
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {destination.budget === 'low'
                      ? 'Budget'
                      : destination.budget === 'mid'
                      ? 'Mid Range'
                      : destination.budget === 'luxury'
                      ? 'Luxury'
                      : 'Any'}
                  </span>
                </div>
                <div className="flex gap-1.5">
                  {destination.highlights?.slice(0, 2).map((highlight, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-1 rounded-md max-w-[80px] truncate"
                    >
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
  }

  return (
    <section className="w-full bg-slate-50 dark:bg-slate-950 min-h-screen">

      {/* ═══════════════════════════════════════════════════════════════════
          HERO HEADER — shared across mobile & desktop
          ═══════════════════════════════════════════════════════════════════ */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 pb-6 md:pb-10 pt-10 md:pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white mb-3 md:mb-6 tracking-tight">
            Explore Destinations
          </h1>
          <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-8 md:mb-10">
            Find your perfect getaway from our curated collection of amazing places in Sri Lanka.
          </p>

          {/* Search Bar */}
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

          {/* ── Mobile: filter chips + Browse on Map button ── */}
          <div className="md:hidden mt-5 flex flex-wrap items-center justify-center gap-2.5">
            {/* Browse on Map */}
            <button
              id="browse-on-map-btn"
              onClick={() => setIsMapModalOpen(true)}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm transition-all active:scale-95 shadow-sm ${
                selectedMapDistrict
                  ? 'bg-emerald-600 text-white shadow-emerald-200 dark:shadow-emerald-900'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-2 border-slate-200 dark:border-slate-700 hover:border-emerald-400 hover:text-emerald-600'
              }`}
            >
              <MapIcon className="w-4 h-4" />
              {selectedMapDistrict ? `Map: ${selectedMapDistrict}` : 'Browse on Map'}
              {selectedMapDistrict && (
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDistrictSelect(null)
                  }}
                  className="ml-0.5 bg-white/25 hover:bg-white/40 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </span>
              )}
            </button>

            {/* Mobile Type chip */}
            <Select
              value={activeFilters.category}
              onValueChange={(val) => setActiveFilters({ ...activeFilters, category: val })}
            >
              <SelectTrigger className={`h-10 rounded-full border-2 font-semibold px-4 text-sm w-auto gap-1.5 ${activeFilters.category !== 'all' ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'}`}>
                <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-500" />
                <SelectValue placeholder="Type" />
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

            {/* Mobile Budget chip */}
            <Select
              value={activeFilters.budget}
              onValueChange={(val) => setActiveFilters({ ...activeFilters, budget: val })}
            >
              <SelectTrigger className={`h-10 rounded-full border-2 font-semibold px-4 text-sm w-auto gap-1.5 ${activeFilters.budget !== 'all' ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'}`}>
                <span className="text-emerald-500 font-bold text-xs">₹</span>
                <SelectValue placeholder="Budget" />
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

            {/* Reset — only show when filters are active */}
            {(activeFilterCount > 0 || selectedMapDistrict) && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-1.5 h-10 px-4 rounded-full border-2 border-red-200 bg-red-50 dark:bg-red-950/30 dark:border-red-900 text-red-600 dark:text-red-400 font-bold text-sm transition-all active:scale-95"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          DESKTOP TWO-COLUMN LAYOUT
          Left (62%): Large interactive Sri Lanka map
          Right (38%): Filters + results grid
          ═══════════════════════════════════════════════════════════════════ */}
      <div className="hidden md:flex max-w-[1600px] mx-auto px-6 lg:px-8 py-8 gap-6 items-start">

        {/* ── LEFT: Large Map Panel ──────────────────────────────────────── */}
        <div className="w-[62%] flex-shrink-0 sticky top-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200/80 dark:border-slate-800/80 overflow-hidden">

            {/* Map header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                  <MapIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 dark:text-white text-[15px]">Sri Lanka Map</div>
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
                    {selectedMapDistrict ? `Filtered: ${selectedMapDistrict}` : 'Click a district to filter'}
                  </div>
                </div>
              </div>
              {selectedMapDistrict && (
                <button
                  onClick={() => handleDistrictSelect(null)}
                  className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-200 transition-colors bg-emerald-50 dark:bg-emerald-950 px-3 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-800"
                >
                  <X className="w-3 h-3" />
                  Clear
                </button>
              )}
            </div>

            {/* Map itself — tall & prominent */}
            {MapComponents ? (
              <MapComponents.SriLankaMap
                destinations={destinations}
                selectedDistrict={selectedMapDistrict}
                onDistrictSelect={handleDistrictSelect}
                height={580}
                className="w-full !rounded-none !border-0 !shadow-none"
              />
            ) : (
              <div className="h-[580px] bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
                <div className="text-slate-400 text-sm font-medium animate-pulse">Loading map…</div>
              </div>
            )}
          </div>
        </div>

        {/* ── RIGHT: Filters + Results ───────────────────────────────────── */}
        <div className="flex-1 min-w-0 flex flex-col gap-5">

          {/* Filters Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800/80 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-emerald-500" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="bg-emerald-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full">
                    {activeFilterCount}
                  </span>
                )}
              </h2>
              {(activeFilterCount > 0 || selectedMapDistrict) && (
                <button
                  onClick={clearFilters}
                  className="text-xs font-bold text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  Reset all
                </button>
              )}
            </div>

            <div className="flex flex-col gap-3">
              {/* Type */}
              <Select
                value={activeFilters.category}
                onValueChange={(val) => setActiveFilters({ ...activeFilters, category: val })}
              >
                <SelectTrigger className={`w-full h-11 rounded-xl font-semibold px-4 transition-colors ${activeFilters.category !== 'all' ? 'bg-emerald-50 dark:bg-emerald-950 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'}`}>
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-emerald-500 shrink-0" />
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

              {/* Region — synced with map */}
              <Select value={activeFilters.region} onValueChange={handleRegionFilterChange}>
                <SelectTrigger
                  className={`w-full h-11 rounded-xl font-semibold px-4 transition-colors ${
                    selectedMapDistrict
                      ? 'bg-emerald-50 dark:bg-emerald-950 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-500 shrink-0" />
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

              {/* Budget */}
              <Select
                value={activeFilters.budget}
                onValueChange={(val) => setActiveFilters({ ...activeFilters, budget: val })}
              >
                <SelectTrigger className={`w-full h-11 rounded-xl font-semibold px-4 transition-colors ${activeFilters.budget !== 'all' ? 'bg-emerald-50 dark:bg-emerald-950 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'}`}>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-500 font-bold text-sm">₹</span>
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
          </div>

          {/* Results Header */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300 py-1 px-3 rounded-full text-sm">
                  {filteredDestinations.length}
                </span>
                Places Found
              </div>
              {selectedMapDistrict && (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 px-3 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-800">
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
            <div className="w-44 shrink-0">
              <Select value={sortBy} onValueChange={(val) => setSortBy(val as any)}>
                <SelectTrigger className="w-full h-10 rounded-xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-sm font-semibold shadow-sm">
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
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-[22rem] bg-slate-200 dark:bg-slate-800 rounded-3xl animate-pulse" />
                ))}
              </div>
            ) : filteredDestinations.length === 0 ? (
              <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm px-6">
                <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-8 h-8 text-slate-400 dark:text-slate-500" />
                </div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-3">No results found</h3>
                <p className="text-base text-slate-500 dark:text-slate-400 mb-8 max-w-sm mx-auto">
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
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                {filteredDestinations.map(renderCard)}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          MOBILE LAYOUT — single column with region dropdown
          ═══════════════════════════════════════════════════════════════════ */}
      <div className="md:hidden px-4 py-5">
        {/* Mobile region dropdown */}
        <div className="mb-4">
          <Select value={activeFilters.region} onValueChange={handleRegionFilterChange}>
            <SelectTrigger
              className={`w-full h-12 rounded-2xl font-semibold px-4 transition-colors shadow-sm ${
                selectedMapDistrict
                  ? 'bg-emerald-50 dark:bg-emerald-950 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-500 shrink-0" />
                <SelectValue placeholder="All Districts" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-2xl max-h-[300px]">
              <SelectItem value="all" className="font-medium">Anywhere in Sri Lanka</SelectItem>
              {ALL_DISTRICTS.map((district) => (
                <SelectItem key={district} value={district} className="font-medium">{district}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Mobile results header */}
        <div ref={resultsRef} className="flex items-center justify-between mb-4 gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300 py-1 px-3 rounded-full text-sm">
                {filteredDestinations.length}
              </span>
              <span>Found</span>
            </div>
          </div>
          <div className="w-36 shrink-0">
            <Select value={sortBy} onValueChange={(val) => setSortBy(val as any)}>
              <SelectTrigger className="w-full h-10 rounded-xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-sm font-semibold shadow-sm">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Newest</SelectItem>
                <SelectItem value="name-asc">A-Z</SelectItem>
                <SelectItem value="name-desc">Z-A</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Mobile cards */}
        <div className="w-full">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : filteredDestinations.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm px-6">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-7 h-7 text-slate-400 dark:text-slate-500" />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">No results</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                Try adjusting your search or filters.
              </p>
              <Button
                onClick={clearFilters}
                className="rounded-full px-6 h-11 text-sm font-bold bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900"
              >
                Clear all filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {filteredDestinations.map(renderCard)}
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
