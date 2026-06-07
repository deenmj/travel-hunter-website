import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Facebook, Instagram, Youtube, Twitter } from 'lucide-react'
import { ROUTES } from '@/lib/constants'
import { getSiteSettings } from '@/lib/data-fetching'

export async function HeroSection() {
  const settings = await getSiteSettings()
  const heroImage = settings.hero_image || 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Nine_Arches_Bridge_in_Ella.jpg'

  return (
    <section className="relative w-full min-h-[90vh] md:min-h-[80vh] flex items-center justify-center py-12 md:py-16 overflow-hidden">
      {/* Background with Ken Burns effect */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Nine Arch Bridge, Ella, Sri Lanka"
          className="absolute inset-0 w-full h-full object-cover object-center animate-ken-burns scale-110"
        />
      </div>

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-slate-950 z-[1]" />
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/20 via-transparent to-teal-900/20 z-[1]" />

      {/* Decorative orbs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-blob z-[1]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-blob animation-delay-2000 z-[1]" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-6 md:py-12 w-full flex flex-col items-center text-center">
        <span className="inline-block py-1.5 px-4 rounded-full bg-emerald-500/20 text-emerald-300 backdrop-blur-md border border-emerald-500/30 text-xs md:text-sm font-semibold tracking-wider uppercase mb-4 sm:mb-5 animate-fade-in-up">
          Authentic Sri Lanka
        </span>

        <h1 className="text-3xl sm:text-5xl md:text-7xl font-black tracking-tight text-white mb-4 sm:mb-5 drop-shadow-2xl max-w-5xl leading-[1.1] animate-fade-in-up animation-delay-200">
          Discover the Heart of{' '}
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500 bg-clip-text text-transparent">
            Sri Lanka
          </span>
        </h1>

        <p className="text-sm sm:text-base md:text-xl text-slate-100/90 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed drop-shadow-md font-medium animate-fade-in-up animation-delay-400">
          Explore hidden waterfalls, pristine beaches, and ancient ruins curated by local experts who know the island best.
        </p>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center items-center w-full max-w-2xl mx-auto animate-fade-in-up animation-delay-600">
          <Link href={ROUTES.DESTINATIONS} className="w-full sm:w-auto">
            <Button className="h-11 sm:h-14 px-6 sm:px-8 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold rounded-full w-full shadow-lg shadow-emerald-500/30 transition-all hover:scale-105 active:scale-95 text-sm sm:text-lg border-0">
              Start Exploring
            </Button>
          </Link>

          <Link href={ROUTES.VIDEOS} className="w-full sm:w-auto">
            <Button
              variant="outline"
              className="h-11 sm:h-14 px-6 sm:px-8 border border-white/40 text-white hover:bg-white/10 hover:border-white/80 font-bold rounded-full w-full backdrop-blur-md transition-all hover:scale-105 active:scale-95 text-sm sm:text-lg bg-white/5"
            >
              Watch Stories
            </Button>
          </Link>

          <Link href={ROUTES.CONTACT} className="w-full sm:w-auto">
            <Button
              variant="outline"
              className="h-11 sm:h-14 px-6 sm:px-8 border border-teal-400/40 text-teal-300 hover:bg-teal-500/20 hover:border-teal-400/80 font-bold rounded-full w-full backdrop-blur-md transition-all hover:scale-105 active:scale-95 text-sm sm:text-lg bg-teal-500/5"
            >
              Contact Us
            </Button>
          </Link>
        </div>

        {/* Social Icons */}
        <div className="flex justify-center gap-3 sm:gap-4 mt-8 sm:mt-12 animate-fade-in-up animation-delay-700">
          {settings.facebook_url && (
            <a
              href={settings.facebook_url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-emerald-500/30 hover:border-emerald-400/50 transition-all hover:scale-110 active:scale-95 hover:text-emerald-200"
              aria-label="Facebook"
            >
              <Facebook className="w-4 h-4 sm:w-5 sm:h-5" />
            </a>
          )}
          {settings.instagram_url && (
            <a
              href={settings.instagram_url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-pink-500/30 hover:border-pink-400/50 transition-all hover:scale-110 active:scale-95 hover:text-pink-200"
              aria-label="Instagram"
            >
              <Instagram className="w-4 h-4 sm:w-5 sm:h-5" />
            </a>
          )}
          {settings.youtube_url && (
            <a
              href={settings.youtube_url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-red-500/30 hover:border-red-400/50 transition-all hover:scale-110 active:scale-95 hover:text-red-200"
              aria-label="YouTube"
            >
              <Youtube className="w-4 h-4 sm:w-5 sm:h-5" />
            </a>
          )}
          {settings.twitter_url && (
            <a
              href={settings.twitter_url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-blue-500/30 hover:border-blue-400/50 transition-all hover:scale-110 active:scale-95 hover:text-blue-200"
              aria-label="Twitter"
            >
              <Twitter className="w-4 h-4 sm:w-5 sm:h-5" />
            </a>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-white/15 w-full max-w-4xl backdrop-blur-md bg-white/5 rounded-3xl px-4 sm:px-6 animate-fade-in-up animation-delay-800">
          {[
            { value: '25+', label: 'Destinations', color: 'text-emerald-400' },
            { value: '100+', label: 'Local Tips', color: 'text-blue-400' },
            { value: '50+', label: 'Videos', color: 'text-amber-400' },
            { value: '10K+', label: 'Travelers', color: 'text-emerald-300' },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-1">
              <div className={`text-xl sm:text-2xl md:text-4xl font-black ${stat.color} drop-shadow-md`}>{stat.value}</div>
              <p className="text-[10px] sm:text-xs md:text-sm font-medium text-gray-300 uppercase tracking-wide whitespace-nowrap">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce hidden md:block">
        <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-1.5">
          <div className="w-1 h-2.5 bg-white/60 rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  )
}
