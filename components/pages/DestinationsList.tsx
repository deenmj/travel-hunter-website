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
import {
  Star, ShieldCheck, MapPin, X, SlidersHorizontal,
  Trash2, Wallet, Map as MapIcon,
} from 'lucide-react'
import {
  CATEGORIES, CATEGORY_LABELS, CATEGORY_ICONS,
  BUDGET_LEVELS, ALL_DISTRICTS,
} from '@/lib/constants'

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

  // Lazy-load map only on client
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

  // ── Fetch destinations ─────────────────────────────────────────────────────
  useEffect(() => {
    getDestinations().then((data) => {
      setDestinations(data)
      setFilteredDestinations(data)
      setLoading(false)
    })
  }, [])

  // ── Filter + sort ──────────────────────────────────────────────────────────
  useEffect(() => {
    let result = [...destinations]
    if (activeFilters.category && activeFilters.category !== 'all')
      result = result.filter((d) => d.category === activeFilters.category)
    if (activeFilters.region && activeFilters.region !== 'all')
      result = result.filter(
        (d) => d.region === activeFilters.region || d.location?.includes(activeFilters.region!),
      )
    if (activeFilters.budget && activeFilters.budget !== 'all')
      result = result.filter((d) => d.budget === activeFilters.budget)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      result = result.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.description.toLowerCase().includes(q) ||
          (d.location && d.location.toLowerCase().includes(q)) ||
          (d.region && d.region.toLowerCase().includes(q)),
      )
    }
    if (sortBy === 'name-asc') result.sort((a, b) => a.name.localeCompare(b.name))
    else if (sortBy === 'name-desc') result.sort((a, b) => b.name.localeCompare(a.name))
    else result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    setFilteredDestinations(result)
  }, [activeFilters, searchQuery, sortBy, destinations])

  const clearFilters = useCallback(() => {
    setSearchQuery('')
    setActiveFilters(DEFAULT_FILTERS)
    setSelectedMapDistrict(null)
  }, [])

  const handleDistrictSelect = useCallback((district: string | null) => {
    setSelectedMapDistrict(district)
    setActiveFilters((prev) => ({ ...prev, region: district ?? 'all' }))
  }, [])

  const handleRegionFilterChange = useCallback((val: string) => {
    setActiveFilters((prev) => ({ ...prev, region: val }))
    setSelectedMapDistrict(val === 'all' ? null : val)
  }, [])

  // ── Shared destination card ────────────────────────────────────────────────
  const renderCard = (destination: Destination) => {
    const thumbnail = getDestinationThumbnail(destination)
    const rating = getRating(destination.slug || destination.id)
    return (
      <div key={destination.id} className="group h-full">
        <Link href={getDestinationHref(destination)} className="block h-full">
          <Card className="overflow-hidden border border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 cursor-pointer h-full flex flex-col rounded-2xl md:rounded-[1.75rem]">

            {/* Thumbnail */}
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
              {/* Badges */}
              <div className="absolute top-3 left-3 z-10 flex gap-1.5">
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>

            {/* Content */}
            <CardContent className="p-5 flex-1 flex flex-col bg-white dark:bg-slate-900">
              <div className="flex justify-between items-start gap-3 mb-2">
                <h3 className="font-black text-lg md:text-xl text-slate-900 dark:text-white line-clamp-1 group-hover:text-emerald-500 transition-colors">
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

              <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed flex-1 mb-4">
                {destination.description}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center gap-1.5">
                  <Wallet className="w-4 h-4 text-slate-400" />
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {destination.budget === 'low' ? 'Budget' : destination.budget === 'mid' ? 'Mid Range' : destination.budget === 'luxury' ? 'Luxury' : 'Any'}
                  </span>
                </div>
                <div className="flex gap-1.5">
                  {destination.highlights?.slice(0, 2).map((h, i) => (
                    <span key={i} className="text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-1 rounded-md max-w-[80px] truncate">
                      {h}
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

  // ── Empty state ────────────────────────────────────────────────────────────
  const EmptyState = () => (
    <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm px-6 col-span-full">
      <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-5">
        <Search className="w-8 h-8 text-slate-400 dark:text-slate-500" />
      </div>
      <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">No results found</h3>
      <p className="text-base text-slate-500 dark:text-slate-400 mb-7 max-w-sm mx-auto">
        Try broadening your search or adjusting the filters.
      </p>
      <Button
        onClick={clearFilters}
        className="rounded-full px-8 h-12 text-base font-bold bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
      >
        Clear all filters
      </Button>
    </div>
  )

  return (
    <section className="w-full bg-slate-50 dark:bg-slate-950 min-h-screen">

      {/* ═══════════════════════════════════════════════════════════════════
          HERO HEADER
          ═══════════════════════════════════════════════════════════════════ */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 pb-6 md:pb-10 pt-10 md:pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white mb-3 md:mb-5 tracking-tight">
            Explore Destinations
          </h1>
          <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-7 md:mb-9">
            Find your perfect getaway from our curated collection of amazing places in Sri Lanka.
          </p>

          {/* Search */}
          <div className="max-w-3xl mx-auto relative group">
            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
              <Search className="h-5 w-5 md:h-6 md:w-6 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Search place, district, keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full h-14 md:h-16 pl-14 md:pl-16 pr-12 rounded-full border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-base md:text-lg shadow-sm focus:ring-0 focus:border-emerald-500 dark:focus:border-emerald-500 transition-all text-slate-900 dark:text-white placeholder:text-slate-400"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute inset-y-0 right-5 flex items-center">
                <X className="h-5 w-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200" />
              </button>
            )}
          </div>

          {/* ── Mobile chips ── */}
          <div className="md:hidden mt-5 flex flex-wrap items-center justify-center gap-2">
            {/* Browse on Map */}
            <button
              id="browse-on-map-btn"
              onClick={() => setIsMapModalOpen(true)}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm transition-all active:scale-95 shadow-sm ${
                selectedMapDistrict
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-2 border-slate-200 dark:border-slate-700 hover:border-emerald-400 hover:text-emerald-600'
              }`}
            >
              <MapIcon className="w-4 h-4" />
              {selectedMapDistrict ? `Map · ${selectedMapDistrict}` : 'Browse on Map'}
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

            {/* Type chip */}
            <Select value={activeFilters.category} onValueChange={(val) => setActiveFilters({ ...activeFilters, category: val })}>
              <SelectTrigger className={`h-10 rounded-full border-2 font-semibold px-4 text-sm w-auto gap-1.5 ${activeFilters.category !== 'all' ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'}`}>
                <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-500" />
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl">
                <SelectItem value="all" className="font-medium">All Types</SelectItem>
                {Object.entries(CATEGORIES).map(([, val]) => (
                  <SelectItem key={val} value={val} className="font-medium">
                    <span className="mr-2">{CATEGORY_ICONS[val as keyof typeof CATEGORY_ICONS]}</span>
                    {CATEGORY_LABELS[val as keyof typeof CATEGORY_LABELS]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Budget chip */}
            <Select value={activeFilters.budget} onValueChange={(val) => setActiveFilters({ ...activeFilters, budget: val })}>
              <SelectTrigger className={`h-10 rounded-full border-2 font-semibold px-4 text-sm w-auto gap-1.5 ${activeFilters.budget !== 'all' ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'}`}>
                <span className="text-emerald-500 font-bold text-xs">₹</span>
                <SelectValue placeholder="Budget" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl">
                <SelectItem value="all" className="font-medium">Any Budget</SelectItem>
                {Object.entries(BUDGET_LEVELS).map(([key, data]) => (
                  <SelectItem key={key} value={key} className="font-medium">
                    {key === 'low' ? '₹' : key === 'mid' ? '₹₹' : '₹₹₹'} · {data.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {(activeFilterCount > 0 || selectedMapDistrict) && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-1.5 h-10 px-4 rounded-full border-2 border-red-200 bg-red-50 dark:bg-red-950/30 dark:border-red-900 text-red-600 dark:text-red-400 font-bold text-sm active:scale-95 transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          DESKTOP — Map (60%) + Filters (40%) side by side on top,
                    full-width results grid below
          ═══════════════════════════════════════════════════════════════════ */}
      <div className="hidden md:block max-w-[1400px] mx-auto px-6 lg:px-10 pt-8 pb-16">

        {/* ── TOP ROW: Map + Filters ── */}
        <div className="flex gap-6 items-start mb-8">

          {/* LEFT: Large Map (60%) */}
          <div className="w-[60%] flex-shrink-0">
            <div className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-sm border border-slate-200/70 dark:border-slate-800/70">

              {/* Map card header */}
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center shrink-0">
                    <MapIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-[14px] font-bold text-slate-900 dark:text-white leading-tight">
                      Sri Lanka Map
                    </p>
                    <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                      {selectedMapDistrict ? `Filtered · ${selectedMapDistrict}` : 'Click a district to filter'}
                    </p>
                  </div>
                </div>
                {selectedMapDistrict && (
                  <button
                    onClick={() => handleDistrictSelect(null)}
                    className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-200 bg-emerald-50 dark:bg-emerald-950/80 px-3 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-800 transition-colors"
                  >
                    <X className="w-3 h-3" />
                    Clear
                  </button>
                )}
              </div>

              {/* Map */}
              {MapComponents ? (
                <MapComponents.SriLankaMap
                  destinations={destinations}
                  selectedDistrict={selectedMapDistrict}
                  onDistrictSelect={handleDistrictSelect}
                  height={520}
                  className="w-full !rounded-none !border-0 !shadow-none"
                />
              ) : (
                <div className="h-[520px] bg-slate-50 dark:bg-slate-900/50 flex items-center justify-center">
                  <p className="text-slate-400 text-sm font-medium animate-pulse">Loading map…</p>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Filters panel (40%) */}
          <div className="flex-1 min-w-0">
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200/70 dark:border-slate-800/70 p-6">

              {/* Filters header */}
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-[15px]">
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
                    className="flex items-center gap-1 text-xs font-bold text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Reset all
                  </button>
                )}
              </div>

              <div className="flex flex-col gap-3">
                {/* Type */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 px-1">Type</label>
                  <Select value={activeFilters.category} onValueChange={(val) => setActiveFilters({ ...activeFilters, category: val })}>
                    <SelectTrigger className={`w-full h-11 rounded-xl font-semibold px-4 transition-colors ${activeFilters.category !== 'all' ? 'bg-emerald-50 dark:bg-emerald-950/80 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'}`}>
                      <div className="flex items-center gap-2">
                        <SlidersHorizontal className="w-4 h-4 text-emerald-500 shrink-0" />
                        <SelectValue placeholder="All Types" />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl">
                      <SelectItem value="all" className="font-medium">All Types</SelectItem>
                      {Object.entries(CATEGORIES).map(([, val]) => (
                        <SelectItem key={val} value={val} className="font-medium">
                          <span className="mr-2">{CATEGORY_ICONS[val as keyof typeof CATEGORY_ICONS]}</span>
                          {CATEGORY_LABELS[val as keyof typeof CATEGORY_LABELS]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* District / Region — synced with map */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 px-1">District / Region</label>
                  <Select value={activeFilters.region} onValueChange={handleRegionFilterChange}>
                    <SelectTrigger className={`w-full h-11 rounded-xl font-semibold px-4 transition-colors ${selectedMapDistrict ? 'bg-emerald-50 dark:bg-emerald-950/80 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'}`}>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-emerald-500 shrink-0" />
                        <SelectValue placeholder="All Districts" />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl max-h-[280px]">
                      <SelectItem value="all" className="font-medium">Anywhere in Sri Lanka</SelectItem>
                      {ALL_DISTRICTS.map((d) => (
                        <SelectItem key={d} value={d} className="font-medium">{d}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Budget */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 px-1">Budget</label>
                  <Select value={activeFilters.budget} onValueChange={(val) => setActiveFilters({ ...activeFilters, budget: val })}>
                    <SelectTrigger className={`w-full h-11 rounded-xl font-semibold px-4 transition-colors ${activeFilters.budget !== 'all' ? 'bg-emerald-50 dark:bg-emerald-950/80 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'}`}>
                      <div className="flex items-center gap-2">
                        <span className="text-emerald-500 font-bold">₹</span>
                        <SelectValue placeholder="Any Budget" />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl">
                      <SelectItem value="all" className="font-medium">Any Budget</SelectItem>
                      {Object.entries(BUDGET_LEVELS).map(([key, data]) => (
                        <SelectItem key={key} value={key} className="font-medium">
                          {key === 'low' ? '₹' : key === 'mid' ? '₹₹' : '₹₹₹'} · {data.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Reset button */}
                <Button
                  onClick={clearFilters}
                  disabled={activeFilterCount === 0 && !selectedMapDistrict && !searchQuery}
                  variant="ghost"
                  className="w-full h-11 rounded-xl font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors mt-1 disabled:opacity-40"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Reset Filters
                </Button>
              </div>

              {/* Active filter pills */}
              {(selectedMapDistrict || activeFilterCount > 0) && (
                <div className="mt-5 pt-5 border-t border-slate-100 dark:border-slate-800">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2.5">Active</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedMapDistrict && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 px-3 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                        <MapPin className="w-3 h-3" />
                        {selectedMapDistrict}
                        <button onClick={() => handleDistrictSelect(null)} aria-label="Clear district">
                          <X className="w-3 h-3 ml-0.5 hover:text-emerald-900" />
                        </button>
                      </span>
                    )}
                    {activeFilters.category !== 'all' && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-full">
                        {CATEGORY_ICONS[activeFilters.category as keyof typeof CATEGORY_ICONS]}
                        {CATEGORY_LABELS[activeFilters.category as keyof typeof CATEGORY_LABELS]}
                        <button onClick={() => setActiveFilters(p => ({ ...p, category: 'all' }))}>
                          <X className="w-3 h-3 ml-0.5" />
                        </button>
                      </span>
                    )}
                    {activeFilters.budget !== 'all' && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-full">
                        {activeFilters.budget === 'low' ? '₹ Budget' : activeFilters.budget === 'mid' ? '₹₹ Mid' : '₹₹₹ Luxury'}
                        <button onClick={() => setActiveFilters(p => ({ ...p, budget: 'all' }))}>
                          <X className="w-3 h-3 ml-0.5" />
                        </button>
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── BOTTOM ROW: Full-width Results ── */}
        <div>
          {/* Results bar */}
          <div className="flex items-center justify-between mb-5 gap-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300 py-1 px-3 rounded-full text-sm font-bold">
                  {filteredDestinations.length}
                </span>
                {filteredDestinations.length === 1 ? 'Place Found' : 'Places Found'}
              </span>
              {selectedMapDistrict && (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-3 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                  <MapPin className="w-3 h-3" />
                  {selectedMapDistrict}
                </span>
              )}
            </div>
            <div className="w-48 shrink-0">
              <Select value={sortBy} onValueChange={(val) => setSortBy(val as any)}>
                <SelectTrigger className="w-full h-10 rounded-xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-sm font-semibold shadow-sm">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured / Newest</SelectItem>
                  <SelectItem value="name-asc">Name (A–Z)</SelectItem>
                  <SelectItem value="name-desc">Name (Z–A)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Cards grid — full width, 3 columns */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-[22rem] bg-slate-200 dark:bg-slate-800 rounded-3xl animate-pulse" />
              ))}
            </div>
          ) : filteredDestinations.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDestinations.map(renderCard)}
            </div>
          )}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          MOBILE — single column
          ═══════════════════════════════════════════════════════════════════ */}
      <div className="md:hidden px-4 py-5">
        {/* Region dropdown */}
        <div className="mb-4">
          <Select value={activeFilters.region} onValueChange={handleRegionFilterChange}>
            <SelectTrigger className={`w-full h-12 rounded-2xl font-semibold px-4 shadow-sm transition-colors ${selectedMapDistrict ? 'bg-emerald-50 dark:bg-emerald-950 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700'}`}>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-500 shrink-0" />
                <SelectValue placeholder="All Districts" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-2xl max-h-[300px]">
              <SelectItem value="all" className="font-medium">Anywhere in Sri Lanka</SelectItem>
              {ALL_DISTRICTS.map((d) => (
                <SelectItem key={d} value={d} className="font-medium">{d}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Results header */}
        <div className="flex items-center justify-between mb-4 gap-3">
          <span className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300 py-1 px-3 rounded-full text-sm">
              {filteredDestinations.length}
            </span>
            Found
          </span>
          <div className="w-36 shrink-0">
            <Select value={sortBy} onValueChange={(val) => setSortBy(val as any)}>
              <SelectTrigger className="w-full h-10 rounded-xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-sm font-semibold shadow-sm">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Newest</SelectItem>
                <SelectItem value="name-asc">A–Z</SelectItem>
                <SelectItem value="name-desc">Z–A</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Mobile cards */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : filteredDestinations.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {filteredDestinations.map(renderCard)}
          </div>
        )}
      </div>

      {/* ── Mobile Map Modal ── */}
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
