import Link from 'next/link'
import { ArrowRight, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/lib/constants'

export function CTASection() {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 px-8 py-14 md:px-16 md:py-20 text-center shadow-2xl shadow-emerald-500/20">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/3 translate-y-1/3" />
          </div>

          <div className="relative z-10 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-emerald-100 text-xs font-semibold uppercase tracking-wider mb-5">
              <MapPin className="w-3.5 h-3.5" />
              Start Your Journey
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4 leading-tight">
              Ready to explore Sri Lanka?
            </h2>
            <p className="text-emerald-100/90 text-base md:text-lg mb-8 leading-relaxed">
              Browse curated destinations, watch travel videos, and read local guides to plan your perfect island adventure.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href={ROUTES.DESTINATIONS}>
                <Button className="h-12 px-8 bg-white text-emerald-700 hover:bg-emerald-50 font-bold rounded-full shadow-lg transition-all hover:scale-105 text-base gap-2">
                  Explore Destinations
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href={ROUTES.BLOG}>
                <Button
                  variant="outline"
                  className="h-12 px-8 border-white/40 text-white hover:bg-white/10 font-bold rounded-full backdrop-blur-sm transition-all hover:scale-105 text-base bg-transparent"
                >
                  Read Travel Guides
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
