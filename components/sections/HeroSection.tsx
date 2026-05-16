import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/lib/constants'

export function HeroSection() {
  return (
    <section className="relative w-full h-[calc(100vh-64px)] min-h-96 bg-gradient-to-b from-emerald-50 via-blue-50 to-white dark:from-slate-900 dark:via-slate-800 dark:to-slate-950 flex items-center justify-center overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-10 animate-blob"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-10 animate-blob animation-delay-2000"></div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-12 md:py-20 text-center">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
          Discover Sri Lanka&apos;s Hidden Gems
        </h1>

        <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
          Explore authentic destinations, local cuisine, and unforgettable experiences curated by travel enthusiasts who know every corner of this island.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href={ROUTES.DESTINATIONS}>
            <Button className="h-12 px-8 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-full w-full sm:w-auto">
              Explore Destinations
            </Button>
          </Link>

          <Link href={ROUTES.VIDEOS}>
            <Button
              variant="outline"
              className="h-12 px-8 border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:border-emerald-400 dark:text-emerald-400 dark:hover:bg-slate-800 font-semibold rounded-full w-full sm:w-auto"
            >
              Watch Videos
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 pt-8 border-t border-gray-200 dark:border-slate-700">
          <div>
            <div className="text-2xl md:text-3xl font-bold text-emerald-600 dark:text-emerald-400">25+</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Destinations</p>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400">100+</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Local Tips</p>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-bold text-amber-600 dark:text-amber-400">50+</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Videos</p>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-bold text-green-600 dark:text-green-400">10K+</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Travelers</p>
          </div>
        </div>
      </div>
    </section>
  )
}
