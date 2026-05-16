import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/lib/constants'

export function HeroSection() {
  return (
    <section className="relative w-full min-h-[90vh] md:min-h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <Image
        src="https://images.unsplash.com/photo-1546708453-15743b0d268d?q=80&w=2000&auto=format&fit=crop"
        alt="Nine Arch Bridge, Ella, Sri Lanka"
        fill
        priority
        className="object-cover object-center z-0"
      />
      
      {/* Gradient Overlay for Text Readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80 z-0"></div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 w-full flex flex-col items-center text-center">
        <span className="inline-block py-1 px-3 rounded-full bg-emerald-500/20 text-emerald-300 backdrop-blur-md border border-emerald-500/30 text-sm font-semibold tracking-wider uppercase mb-6 animate-fade-in-up">
          Authentic Sri Lanka
        </span>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6 drop-shadow-lg max-w-4xl">
          Discover the Heart of <span className="text-emerald-400">Sri Lanka</span>
        </h1>

        <p className="text-lg md:text-2xl text-gray-200 mb-10 max-w-2xl mx-auto leading-relaxed drop-shadow-md font-medium">
          Explore hidden waterfalls, pristine beaches, and ancient ruins curated by local experts who know the island best.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-md mx-auto">
          <Link href={ROUTES.DESTINATIONS} className="w-full sm:w-auto">
            <Button className="h-14 px-8 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-full w-full shadow-lg shadow-emerald-900/50 transition-all hover:scale-105 text-lg">
              Start Exploring
            </Button>
          </Link>

          <Link href={ROUTES.VIDEOS} className="w-full sm:w-auto">
            <Button
              variant="outline"
              className="h-14 px-8 border-2 border-white/70 text-white hover:bg-white/10 hover:border-white font-bold rounded-full w-full backdrop-blur-sm transition-all text-lg bg-transparent"
            >
              Watch Stories
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mt-20 pt-10 border-t border-white/20 w-full max-w-4xl backdrop-blur-sm rounded-3xl">
          <div className="flex flex-col items-center">
            <div className="text-3xl md:text-4xl font-black text-emerald-400 drop-shadow-md mb-1">25+</div>
            <p className="text-sm md:text-base font-medium text-gray-300 uppercase tracking-wide">Destinations</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-3xl md:text-4xl font-black text-blue-400 drop-shadow-md mb-1">100+</div>
            <p className="text-sm md:text-base font-medium text-gray-300 uppercase tracking-wide">Local Tips</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-3xl md:text-4xl font-black text-amber-400 drop-shadow-md mb-1">50+</div>
            <p className="text-sm md:text-base font-medium text-gray-300 uppercase tracking-wide">Videos</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-3xl md:text-4xl font-black text-emerald-300 drop-shadow-md mb-1">10K+</div>
            <p className="text-sm md:text-base font-medium text-gray-300 uppercase tracking-wide">Travelers</p>
          </div>
        </div>
      </div>
    </section>
  )
}
