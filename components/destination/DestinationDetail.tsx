import Link from 'next/link'
import {
  MapPin,
  Calendar,
  Wallet,
  Star,
  ArrowLeft,
  Sparkles,
  Car,
  Ticket,
  Clock,
  Lightbulb,
  ChevronRight,
  Play,
  ShieldCheck,
  Map as MapIcon,
  ExternalLink,
} from 'lucide-react'
import { VideoEmbed } from '@/components/destination/VideoEmbed'
import { ShareButton } from '@/components/ui/ShareButton'
import { DestinationGallery } from '@/components/destination/DestinationGallery'
import type { Destination } from '@/lib/types'
import { CATEGORY_LABELS, CATEGORY_ICONS, ROUTES } from '@/lib/constants'
import {
  getGalleryImages,
  getBudgetLabel,
  getRating,
  getHowToReach,
  getEntryFees,
  hasVideo,
} from '@/lib/destination-utils'
import { getDestinationThumbnail, resolveVideoSource } from '@/lib/video-utils'
import { getDestinationHref } from '@/lib/destination-utils'

interface DestinationDetailProps {
  destination: Destination
  related: Destination[]
}

const categoryStyles: Record<string, { badge: string; accent: string; gradient: string }> = {
  travel: {
    badge: 'bg-blue-500/90 text-white',
    accent: 'text-blue-600 dark:text-blue-400',
    gradient: 'from-blue-600/80 to-emerald-900/60',
  },
  food: {
    badge: 'bg-orange-500/90 text-white',
    accent: 'text-orange-600 dark:text-orange-400',
    gradient: 'from-orange-600/80 to-amber-900/60',
  },
  lifestyle: {
    badge: 'bg-emerald-500/90 text-white',
    accent: 'text-emerald-600 dark:text-emerald-400',
    gradient: 'from-emerald-600/80 to-teal-900/60',
  },
}

const DEFAULT_CATEGORY_STYLE = {
  badge: 'bg-slate-500/90 text-white',
  accent: 'text-slate-600 dark:text-slate-400',
  gradient: 'from-slate-600/80 to-slate-900/60',
}

function SectionHeading({ label, title }: { label: string; title: string }) {
  return (
    <div className="mb-8">
      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest flex items-center gap-2">
        <span className="w-6 h-px bg-emerald-600/50 dark:bg-emerald-400/50"></span>
        {label}
      </span>
      <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mt-2">{title}</h2>
    </div>
  )
}

export function DestinationDetail({ destination, related }: DestinationDetailProps) {
  const heroImage = getDestinationThumbnail(destination)
  const galleryImages = getGalleryImages(destination)
  const styles = categoryStyles[destination.category] ?? DEFAULT_CATEGORY_STYLE
  const rating = getRating(destination.slug)
  const budget = getBudgetLabel(destination.category)
  const videoSource = resolveVideoSource(destination.video_id, destination.video_url)
  const showVideo = hasVideo(destination)

  const quickInfo = [
    {
      icon: MapPin,
      label: 'Location',
      value: destination.location || 'Sri Lanka',
    },
    {
      icon: Calendar,
      label: 'Best Time',
      value: destination.best_time || 'Year-round',
    },
    {
      icon: Wallet,
      label: 'Budget',
      value: budget,
    },
    {
      icon: Star,
      label: 'Rating',
      value: `${rating} / 5`,
      highlight: true,
    },
  ]

  const practicalItems = [
    {
      icon: Car,
      title: 'How to Reach',
      content: destination.how_to_reach || getHowToReach(destination),
    },
    {
      icon: Ticket,
      title: 'Fees & Costs',
      content: destination.entry_fees || getEntryFees(destination.category),
    },
    {
      icon: Clock,
      title: 'Best Time to Visit',
      content: destination.best_time
        ? `Plan your visit during ${destination.best_time} for the best weather and experience.`
        : 'Visit during dry season months (Dec–Apr on west coast, Apr–Sep on east coast) for ideal conditions.',
    },
  ]

  const mapSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    destination.name + ' ' + (destination.location || 'Sri Lanka')
  )}`

  return (
    <article className="bg-white dark:bg-slate-950 min-h-screen">
      {/* ── 1. Hero ── */}
      <section className="relative w-full min-h-[60vh] md:min-h-[70vh] flex flex-col justify-between overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          {heroImage ? (
            <img
              src={heroImage}
              alt={destination.name}
              className="w-full h-full object-cover object-center scale-[1.02] transform transition-transform duration-1000"
            />
          ) : (
            <div className="w-full h-full bg-slate-900" />
          )}
          
          {/* Refined Premium Gradients for Text Readability */}
          {/* Top gradient for nav bar visibility */}
          <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-black/70 via-black/30 to-transparent" />
          
          {/* Bottom gradient for title visibility */}
          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
          
          {/* Subtle colored tint based on category */}
          <div className={`absolute inset-0 mix-blend-overlay opacity-30 bg-gradient-to-tr ${styles.gradient}`} />
        </div>

        {/* Top Navigation Bar */}
        <div className="relative z-20 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 flex items-center justify-between">
          <Link
            href={ROUTES.DESTINATIONS}
            className="group flex items-center gap-2 text-white text-sm font-semibold transition-all bg-black/20 hover:bg-black/40 px-4 sm:px-5 py-2.5 rounded-full backdrop-blur-md border border-white/10"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span className="hidden sm:inline">Back to Destinations</span>
            <span className="inline sm:hidden">Back</span>
          </Link>

          <ShareButton 
            url={`${typeof window !== 'undefined' ? window.location.origin : ''}${getDestinationHref(destination)}`} 
            title={destination.name} 
            className="flex items-center gap-2 h-10 sm:h-11 px-4 sm:px-5 rounded-full bg-black/20 hover:bg-black/40 text-white font-medium text-sm backdrop-blur-md border border-white/10 transition-all"
          />
        </div>

        {/* Bottom Content Area */}
        <div className="relative z-20 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 sm:pb-12 mt-auto">
          {/* Branding Subtitle */}
          <div className="flex items-center gap-2 mb-4 opacity-90">
            <span className="w-6 h-px bg-white/60"></span>
            <span className="text-[10px] sm:text-xs font-bold text-white uppercase tracking-[0.2em]">
              Travel Hunter Guide
            </span>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4 sm:mb-5">
            <span
              className={`inline-flex items-center gap-1.5 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest shadow-lg border border-white/20 backdrop-blur-md ${styles.badge}`}
            >
              {CATEGORY_ICONS[destination.category]} {CATEGORY_LABELS[destination.category]}
            </span>
            {destination.is_top_pick && (
              <span className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1 sm:py-1.5 bg-amber-500/95 border border-amber-400/50 backdrop-blur-md text-white text-[10px] sm:text-xs font-bold rounded-full shadow-lg uppercase tracking-widest">
                <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Top Pick
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.05] tracking-tight drop-shadow-2xl max-w-4xl break-words">
            {destination.name}
          </h1>
        </div>
      </section>

      {/* ── 2. Quick Info Row ── */}
      <section className="border-b border-slate-200/50 dark:border-slate-800/50 bg-white dark:bg-slate-950 sticky top-[72px] z-40 shadow-sm w-full overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 md:py-4">
          <div className="flex overflow-x-auto hide-scrollbar gap-3 md:gap-6 pb-2 -mb-2 snap-x snap-mandatory">
            {quickInfo.map(({ icon: Icon, label, value, highlight }) => (
              <div
                key={label}
                className="flex items-center gap-2 md:gap-3 p-2.5 md:p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm min-w-[140px] md:min-w-0 flex-1 shrink-0 snap-start"
              >
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center shrink-0 shadow-sm border border-slate-100 dark:border-slate-700/50">
                  <Icon className={`w-5 h-5 md:w-6 md:h-6 ${highlight ? 'text-amber-500 fill-amber-500' : 'text-emerald-600 dark:text-emerald-400'}`} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] md:text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{label}</p>
                  <p className="text-sm md:text-base font-bold text-slate-900 dark:text-slate-100 mt-0.5 truncate">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Container - We removed the massive space-y here to use custom section padding */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ── 3. Main Video ── */}
        {showVideo && videoSource && (
          <section className="py-12 md:py-16 border-b border-slate-100 dark:border-slate-800/60 max-w-5xl mx-auto">
            <SectionHeading label="Watch" title="Experience It First" />
            <div className="rounded-[2rem] overflow-hidden shadow-2xl shadow-slate-200/50 dark:shadow-none ring-1 ring-slate-200/60 dark:ring-slate-800 bg-black">
              <VideoEmbed
                youtubeId={destination.video_id}
                videoUrl={destination.video_url}
                title={`${destination.name} video`}
                className="rounded-[2rem] scale-[1.01]"
              />
            </div>
            <p className="mt-5 text-xs md:text-sm font-semibold text-slate-500 dark:text-slate-400 flex items-center justify-center gap-2 px-4 text-center bg-slate-50 dark:bg-slate-900 py-3 rounded-full w-max mx-auto border border-slate-100 dark:border-slate-800">
              <Play className="w-3.5 h-3.5 md:w-4 md:h-4 text-emerald-500 fill-emerald-500 shrink-0" />
              Travel Hunter&apos;s video guide to {destination.name}
            </p>
          </section>
        )}

        {/* ── 4. Travel Hunter's Story & Map Integration ── */}
        <section className="py-12 md:py-16 border-b border-slate-100 dark:border-slate-800/60">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
            <div className="flex-1 max-w-4xl">
              <SectionHeading label="Our Take" title="Travel Hunter's Story" />
              <div className="prose prose-base md:prose-lg prose-slate dark:prose-invert max-w-none">
                <div className="relative pl-5 md:pl-8 border-l-4 border-emerald-500">
                  <p className="text-base md:text-xl text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line font-medium break-words">
                    {destination.description}
                  </p>
                </div>
              </div>

              {destination.highlights && destination.highlights.length > 0 && (
                <div className="mt-10 p-6 md:p-8 rounded-3xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border border-amber-200/60 dark:border-amber-900/40 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center">
                      <Lightbulb className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <h3 className="font-black text-lg text-slate-900 dark:text-white">Pro Tip from Travel Hunter</h3>
                  </div>
                  <p className="text-base md:text-lg text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                    {destination.highlights[0]}
                  </p>
                </div>
              )}
            </div>

            {/* Quick Actions Sidebar */}
            <div className="w-full lg:w-80 shrink-0">
              <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800 p-6 rounded-3xl sticky top-[160px]">
                <h3 className="font-black text-lg text-slate-900 dark:text-white mb-4">Location Details</h3>
                <div className="flex items-start gap-3 mb-6">
                  <MapPin className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <p className="text-slate-600 dark:text-slate-300 font-medium text-sm leading-relaxed">
                    {destination.location || 'Sri Lanka'}
                  </p>
                </div>
                
                <a 
                  href={mapSearchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm h-12 rounded-xl transition-all shadow-sm hover:shadow-md active:scale-[0.98]"
                >
                  <MapIcon className="w-4 h-4" />
                  View on Google Maps
                  <ExternalLink className="w-3 h-3 ml-1 opacity-70" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── 5. Highlights ── */}
        {destination.highlights && destination.highlights.length > 0 && (
          <section className="py-12 md:py-16 border-b border-slate-100 dark:border-slate-800/60">
            <SectionHeading label="Must-See" title="Highlights" />
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {destination.highlights.map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 hover:shadow-md transition-shadow"
                >
                  <span className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/50 flex items-center justify-center shrink-0">
                    <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </span>
                  <span className="text-sm md:text-base text-slate-700 dark:text-slate-200 font-medium pt-1 leading-relaxed">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ── 6. Image Gallery ── */}
        {galleryImages.length > 0 && (
          <section className="py-12 md:py-16 border-b border-slate-100 dark:border-slate-800/60">
            <SectionHeading label="Gallery" title="Photos & Views" />
            <DestinationGallery images={galleryImages} name={destination.name} />
          </section>
        )}

        {/* ── 7. Practical Info ── */}
        <section className="py-12 md:py-16">
          <SectionHeading label="Plan Your Visit" title="Practical Info" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            {practicalItems.map(({ icon: Icon, title, content }) => (
              <div
                key={title}
                className="p-6 md:p-8 rounded-[2rem] border border-slate-200/60 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/30 hover:bg-white dark:hover:bg-slate-900 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950/40 flex items-center justify-center mb-6 border border-emerald-200/50 dark:border-emerald-900/50 shadow-inner">
                  <Icon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-3">{title}</h3>
                <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed font-medium">{content}</p>
              </div>
            ))}
          </div>
        </section>

      </div>

      {/* ── 8. Related Places (MOVED OUTSIDE MAIN CONTAINER) ── */}
      {related.length > 0 && (
        <section className="bg-slate-50 dark:bg-slate-900/50 py-16 md:py-24 border-t border-slate-200 dark:border-slate-800">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
              <SectionHeading label="Explore More" title="Suggested Places" />
              <Link
                href={ROUTES.DESTINATIONS}
                className="inline-flex items-center justify-center gap-2 text-sm font-bold text-white bg-slate-900 dark:bg-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 px-6 py-3 rounded-full transition-all active:scale-95 shadow-md mb-8 sm:mb-8"
              >
                View all destinations <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
              {related.map((place) => {
                const thumb = getDestinationThumbnail(place)
                const placeRating = getRating(place.slug || place.id)
                return (
                  <div key={place.id} className="group relative">
                    <Link
                      href={getDestinationHref(place)}
                      className="block rounded-[2rem] overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 hover:border-emerald-300 dark:hover:border-emerald-700"
                    >
                      <div className="relative h-56 overflow-hidden bg-slate-100 dark:bg-slate-800">
                        {thumb ? (
                          <img
                            src={thumb}
                            alt={place.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-5xl">
                            {CATEGORY_ICONS[place.category]}
                          </div>
                        )}
                        <span className="absolute top-4 left-4 px-3 py-1.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md text-slate-900 dark:text-white text-[10px] font-black rounded-xl shadow-lg uppercase tracking-wider">
                          {place.category}
                        </span>
                      </div>
                      <div className="p-6 md:p-8">
                        <h3 className="font-black text-xl md:text-2xl text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-1 mb-3">
                          {place.name}
                        </h3>
                        <div className="flex items-center justify-between mt-auto">
                          {place.location && (
                            <div className="flex items-center gap-1.5 text-sm font-medium text-slate-500 dark:text-slate-400">
                              <MapPin className="w-4 h-4 text-emerald-500 shrink-0" />
                              <span className="truncate">{place.location}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1.5 text-sm text-amber-500 font-black bg-amber-50 dark:bg-amber-950/30 px-2.5 py-1 rounded-lg">
                            <Star className="w-4 h-4 fill-amber-500" />
                            {placeRating}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}
    </article>
  )
}
