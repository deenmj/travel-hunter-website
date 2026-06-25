'use client'

import { useEffect, useState } from 'react'
import { getSiteSettings } from '@/lib/data-fetching'
import type { SiteSettings } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { ArrowDown, Search } from 'lucide-react'
import { SearchModal } from '@/components/ui/SearchModal'

export function HeroSection() {
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [searchOpen, setSearchOpen] = useState(false)

  useEffect(() => {
    getSiteSettings().then(setSettings)
  }, [])

  return (
    <>
      <section className="relative h-[75vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0 bg-slate-900">
          <img
            src={
              settings?.hero_image ||
              'https://upload.wikimedia.org/wikipedia/commons/0/0e/Nine_Arches_Bridge_in_Ella.jpg'
            }
            alt="Sri Lanka landscape"
            className="w-full h-full object-cover object-center opacity-70 scale-105 animate-slow-pan"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-transparent to-slate-900/90" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/60 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto space-y-6 mt-16 animate-fade-in-up flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-xs font-bold uppercase tracking-widest mb-2 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Discover Sri Lanka
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white tracking-tight drop-shadow-2xl leading-[1.1]">
            Uncover The <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-200">
              Hidden Gems
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-white/90 max-w-2xl mx-auto font-medium leading-relaxed drop-shadow-md px-2 mb-10">
            Explore unique destinations, authentic food, and memorable lifestyle experiences curated by local travel experts.
          </p>

          <div className="w-full pt-4 flex flex-col items-center">
            {/* Prominent Search Bar */}
            <div 
              onClick={() => setSearchOpen(true)}
              className="w-full max-w-2xl h-16 sm:h-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-white/20 rounded-full flex items-center px-4 sm:px-6 shadow-2xl hover:shadow-emerald-500/20 hover:scale-[1.02] transition-all cursor-text group"
            >
              <Search className="w-6 h-6 text-emerald-600 dark:text-emerald-400 mr-3 sm:mr-4 shrink-0" />
              <div className="flex-1 text-left text-slate-500 dark:text-slate-400 text-base md:text-lg overflow-hidden whitespace-nowrap text-ellipsis pr-2 font-medium">
                <span className="hidden sm:inline">Search destinations, food spots, or videos...</span>
                <span className="sm:hidden">Search destinations...</span>
              </div>
              <Button 
                className="h-12 sm:h-14 px-6 sm:px-8 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-base font-bold shrink-0 shadow-lg"
              >
                Search
              </Button>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce opacity-70">
          <span className="text-[10px] font-bold text-white uppercase tracking-widest">Scroll</span>
          <ArrowDown className="w-4 h-4 text-white" />
        </div>
      </section>
      
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
