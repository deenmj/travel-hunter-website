import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/lib/constants'

export function HeroSection() {
  return (
    <section className="relative w-full flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/0/0e/Nine_Arches_Bridge_in_Ella.jpg"
        alt="Nine Arch Bridge, Ella, Sri Lanka"
        className="absolute inset-0 w-full h-full object-cover object-center z-0"
      />
      
      {/* Gradient Overlay for Text Readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/80 z-0"></div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 lg:py-32 w-full flex flex-col items-center text-center">
        <span className="inline-block py-1 px-3 rounded-full bg-emerald-500/20 text-emerald-300 backdrop-blur-md border border-emerald-500/30 text-xs md:text-sm font-semibold tracking-wider uppercase mb-4 md:mb-5 animate-fade-in-up">
          Authentic Sri Lanka
        </span>
        
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white mb-4 drop-shadow-lg max-w-4xl leading-tight">
          Discover the Heart of <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500 bg-clip-text text-transparent">Sri Lanka</span>
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-slate-100/90 mb-8 max-w-2xl mx-auto leading-relaxed drop-shadow-md font-medium">
          Explore hidden waterfalls, pristine beaches, and ancient ruins curated by local experts who know the island best.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center w-full max-w-md mx-auto">
          <Link href={ROUTES.DESTINATIONS} className="w-full sm:w-auto">
            <Button className="h-12 sm:h-14 px-8 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold rounded-full w-full shadow-lg shadow-emerald-500/25 transition-all hover:scale-105 active:scale-95 text-base sm:text-lg border-0">
              Start Exploring
            </Button>
          </Link>

          <Link href={ROUTES.VIDEOS} className="w-full sm:w-auto">
            <Button
              variant="outline"
              className="h-12 sm:h-14 px-8 border border-white/40 text-white hover:bg-white/10 hover:border-white/80 font-bold rounded-full w-full backdrop-blur-md transition-all hover:scale-105 active:scale-95 text-base sm:text-lg bg-white/5"
            >
              Watch Stories
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mt-12 md:mt-16 pt-6 md:pt-8 border-t border-white/20 w-full max-w-4xl backdrop-blur-sm rounded-3xl">
          <div className="flex flex-col items-center">
            <div className="text-2xl md:text-4xl font-black text-emerald-400 drop-shadow-md mb-1">25+</div>
            <p className="text-xs md:text-sm font-medium text-gray-300 uppercase tracking-wide">Destinations</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-2xl md:text-4xl font-black text-blue-400 drop-shadow-md mb-1">100+</div>
            <p className="text-xs md:text-sm font-medium text-gray-300 uppercase tracking-wide">Local Tips</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-2xl md:text-4xl font-black text-amber-400 drop-shadow-md mb-1">50+</div>
            <p className="text-xs md:text-sm font-medium text-gray-300 uppercase tracking-wide">Videos</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-2xl md:text-4xl font-black text-emerald-300 drop-shadow-md mb-1">10K+</div>
            <p className="text-xs md:text-sm font-medium text-gray-300 uppercase tracking-wide">Travelers</p>
          </div>
        </div>
      </div>
    </section>
  )
}
