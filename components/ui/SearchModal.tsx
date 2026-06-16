'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X, MapPin, Film, Newspaper, TrendingUp, Clock } from 'lucide-react'
import { ROUTES, REGIONS } from '@/lib/constants'

interface SearchResult {
  id: string
  type: 'destination' | 'video' | 'blog'
  title: string
  slug: string
  description?: string
  image?: string
  category?: string
}

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

const TRENDING_SEARCHES = ['Ella', 'Sigiriya', 'Galle Fort', 'Mirissa', 'Tea Plantations', 'Yala Safari']

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus()
      const recent = localStorage.getItem('th-recent-searches')
      if (recent) setRecentSearches(JSON.parse(recent))
    } else {
      setQuery('')
      setResults([])
    }
  }, [isOpen])

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  // Search with debounce
  const searchTimeout = useRef<NodeJS.Timeout>()
  const handleSearch = useCallback((value: string) => {
    setQuery(value)
    if (searchTimeout.current) clearTimeout(searchTimeout.current)

    if (!value.trim()) {
      setResults([])
      return
    }

    setLoading(true)
    searchTimeout.current = setTimeout(async () => {
      try {
        // Client-side search across Supabase
        // Only attempt if Supabase environment variables are available
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
          console.log('[v0] Supabase not configured, search unavailable')
          setResults([])
          setLoading(false)
          return
        }

        const { createClient } = await import('@/lib/supabase/client')
        const supabase = createClient()

        if (!supabase) {
          setResults([])
          setLoading(false)
          return
        }

        const [destResult, videoResult, blogResult] = await Promise.all([
          supabase.from('destinations').select('id, name, slug, description, featured_image, category').ilike('name', `%${value}%`).limit(5),
          supabase.from('videos').select('id, title, slug, description, thumbnail').ilike('title', `%${value}%`).limit(3),
          supabase.from('blog_posts').select('id, title, slug, excerpt, featured_image').ilike('title', `%${value}%`).limit(3),
        ])

        const searchResults: SearchResult[] = [
          ...(destResult.data || []).map((d) => ({
            id: d.id,
            type: 'destination' as const,
            title: d.name,
            slug: d.slug,
            description: d.description,
            image: d.featured_image,
            category: d.category,
          })),
          ...(videoResult.data || []).map((v) => ({
            id: v.id,
            type: 'video' as const,
            title: v.title,
            slug: v.slug,
            description: v.description,
            image: v.thumbnail,
          })),
          ...(blogResult.data || []).map((b) => ({
            id: b.id,
            type: 'blog' as const,
            title: b.title,
            slug: b.slug,
            description: b.excerpt,
            image: b.featured_image,
          })),
        ]

        setResults(searchResults)
      } catch (error) {
        console.error('[v0] Search error:', error)
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 300)
  }, [])

  const handleSelect = (result: SearchResult) => {
    // Save to recent searches
    const updated = [query, ...recentSearches.filter((s) => s !== query)].slice(0, 5)
    localStorage.setItem('th-recent-searches', JSON.stringify(updated))

    const paths = {
      destination: ROUTES.DESTINATIONS,
      video: ROUTES.VIDEOS,
      blog: ROUTES.BLOG,
    }
    router.push(`${paths[result.type]}/${result.slug}`)
    onClose()
  }

  const handleTrendingClick = (term: string) => {
    setQuery(term)
    handleSearch(term)
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'destination': return <MapPin className="w-4 h-4 text-emerald-500" />
      case 'video': return <Film className="w-4 h-4 text-red-500" />
      case 'blog': return <Newspaper className="w-4 h-4 text-blue-500" />
      default: return null
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'destination': return 'Destination'
      case 'video': return 'Video'
      case 'blog': return 'Blog'
      default: return ''
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl mx-4 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-fade-in-up">
        {/* Search input */}
        <div className="flex items-center gap-3 px-5 h-16 border-b border-slate-100 dark:border-slate-800">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search destinations, videos, blogs..."
            className="flex-1 h-full text-base bg-transparent text-slate-900 dark:text-white placeholder:text-slate-400 outline-none"
          />
          {query && (
            <button onClick={() => { setQuery(''); setResults([]) }} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
              <X className="w-5 h-5" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-[10px] font-semibold text-slate-400 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
            ESC
          </kbd>
        </div>

        {/* Results or suggestions */}
        <div className="max-h-[60vh] overflow-y-auto">
          {loading && (
            <div className="p-8 text-center">
              <div className="w-6 h-6 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mx-auto" />
              <p className="text-sm text-slate-400 mt-3">Searching...</p>
            </div>
          )}

          {!loading && results.length > 0 && (
            <div className="py-2">
              {results.map((result) => (
                <button
                  key={`${result.type}-${result.id}`}
                  onClick={() => handleSelect(result)}
                  className="w-full flex items-center gap-3 px-5 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left group"
                >
                  {result.image ? (
                    <img src={result.image} alt="" className="w-12 h-12 rounded-lg object-cover shrink-0" />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                      {getTypeIcon(result.type)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors truncate">
                      {result.title}
                    </p>
                    <p className="text-xs text-slate-400 truncate">{result.description}</p>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full shrink-0">
                    {getTypeLabel(result.type)}
                  </span>
                </button>
              ))}
            </div>
          )}

          {!loading && query && results.length === 0 && (
            <div className="p-8 text-center">
              <Search className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">No results for &ldquo;{query}&rdquo;</p>
              <p className="text-xs text-slate-400 mt-1">Try searching for destinations, videos, or blog posts</p>
            </div>
          )}

          {!loading && !query && (
            <div className="p-5 space-y-5">
              {/* Recent searches */}
              {recentSearches.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    Recent Searches
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((term) => (
                      <button
                        key={term}
                        onClick={() => handleTrendingClick(term)}
                        className="px-3 py-1.5 text-sm bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Trending */}
              <div>
                <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5" />
                  Trending Searches
                </h3>
                <div className="flex flex-wrap gap-2">
                  {TRENDING_SEARCHES.map((term) => (
                    <button
                      key={term}
                      onClick={() => handleTrendingClick(term)}
                      className="px-3 py-1.5 text-sm bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-full hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors font-medium"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick regions */}
              <div>
                <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  Explore Regions
                </h3>
                <div className="flex flex-wrap gap-2">
                  {REGIONS.slice(0, 8).map((region) => (
                    <button
                      key={region}
                      onClick={() => handleTrendingClick(region)}
                      className="px-3 py-1.5 text-sm bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                      📍 {region}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
