'use client'

import { useEffect, useState } from 'react'
import { getSiteSettings } from '@/lib/data-fetching'
import type { SiteSettings } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { ArrowDown, Search, Facebook, Instagram, Youtube } from 'lucide-react'
import { SearchModal } from '@/components/ui/SearchModal'

export function HeroSection() {
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [searchOpen, setSearchOpen] = useState(false)

  useEffect(() => {
    getSiteSettings().then(setSettings)
  }, [])

  return (
    <>
      <section className="relative h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden">
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
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto space-y-6 mt-16 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-sm font-semibold uppercase tracking-wider mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Discover Sri Lanka
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white tracking-tight drop-shadow-xl leading-[1.1]">
            Uncover The <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-200">
              Hidden Gems
            </span>
          </h1>

          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto font-medium leading-relaxed drop-shadow-md">
            Explore unique destinations, authentic food, and memorable lifestyle experiences curated by local travel experts.
          </p>

          <div className="pt-4 flex flex-col items-center">
            {/* Prominent Search Bar */}
            <div 
              onClick={() => setSearchOpen(true)}
              className="w-full max-w-xl h-14 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-white/20 rounded-full flex items-center px-5 shadow-2xl hover:shadow-emerald-500/20 hover:scale-[1.02] transition-all cursor-text group"
            >
              <Search className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mr-3 shrink-0" />
              <span className="flex-1 text-left text-slate-500 dark:text-slate-400 text-sm md:text-base">
                Search destinations, food spots, or videos...
              </span>
              <Button 
                className="h-9 px-4 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shrink-0 shadow-md"
              >
                Search
              </Button>
            </div>

            {/* Social Links inside Hero */}
            <div className="flex items-center gap-4 mt-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              {settings?.facebook_url && (
                <a
                  href={settings.facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-emerald-500 hover:border-emerald-400 hover:scale-110 transition-all shadow-lg"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {settings?.instagram_url && (
                <a
                  href={settings.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-gradient-to-tr hover:from-yellow-400 hover:via-pink-500 hover:to-purple-500 hover:border-transparent hover:scale-110 transition-all shadow-lg"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {settings?.youtube_url && (
                <a
                  href={settings.youtube_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-red-600 hover:border-red-500 hover:scale-110 transition-all shadow-lg"
                  aria-label="YouTube"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              )}
              {settings?.tiktok_url && (
                <a
                  href={settings.tiktok_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-black hover:border-black hover:scale-110 transition-all shadow-lg"
                  aria-label="TikTok"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                </a>
              )}
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
