'use client'

import { useState } from 'react'
import { REGIONS, BUDGET_LEVELS, CATEGORIES } from '@/lib/constants'
import { Filter, MapPin, Wallet, Sparkles } from 'lucide-react'

interface QuickFiltersProps {
  onFilterChange: (filters: { region?: string; budget?: string; category?: string }) => void
}

export function QuickFilters({ onFilterChange }: QuickFiltersProps) {
  const [activeRegion, setActiveRegion] = useState<string>('')
  const [activeBudget, setActiveBudget] = useState<string>('')
  const [activeCategory, setActiveCategory] = useState<string>('')

  const handleRegion = (region: string) => {
    const next = activeRegion === region ? '' : region
    setActiveRegion(next)
    onFilterChange({ region: next, budget: activeBudget, category: activeCategory })
  }

  const handleBudget = (budget: string) => {
    const next = activeBudget === budget ? '' : budget
    setActiveBudget(next)
    onFilterChange({ region: activeRegion, budget: next, category: activeCategory })
  }
  
  const handleCategory = (category: string) => {
    const next = activeCategory === category ? '' : category
    setActiveCategory(next)
    onFilterChange({ region: activeRegion, budget: activeBudget, category: next })
  }

  return (
    <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 md:p-6 mb-8 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-4 h-4 text-emerald-500" />
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Quick Filters</h3>
      </div>

      <div className="space-y-6">
        {/* Categories */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-slate-500 flex items-center gap-1.5 uppercase">
            <Sparkles className="w-3.5 h-3.5" /> Type
          </label>
          <div className="flex flex-wrap gap-2">
            {Object.values(CATEGORIES).map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategory(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Regions */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-slate-500 flex items-center gap-1.5 uppercase">
            <MapPin className="w-3.5 h-3.5" /> Popular Regions
          </label>
          <div className="flex flex-wrap gap-2">
            {REGIONS.slice(0, 6).map((region) => (
              <button
                key={region}
                onClick={() => handleRegion(region)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-all border ${
                  activeRegion === region
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400'
                    : 'border-slate-200 dark:border-slate-700 hover:border-emerald-500/50 text-slate-600 dark:text-slate-300 bg-transparent'
                }`}
              >
                {region}
              </button>
            ))}
          </div>
        </div>

        {/* Budget */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-slate-500 flex items-center gap-1.5 uppercase">
            <Wallet className="w-3.5 h-3.5" /> Budget
          </label>
          <div className="flex flex-wrap gap-2">
            {Object.entries(BUDGET_LEVELS).map(([key, data]) => (
              <button
                key={key}
                onClick={() => handleBudget(key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all border ${
                  activeBudget === key
                    ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400'
                    : 'border-slate-200 dark:border-slate-700 hover:border-amber-500/50 text-slate-600 dark:text-slate-300 bg-transparent'
                }`}
              >
                <span>{data.icon}</span>
                <span>{data.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
