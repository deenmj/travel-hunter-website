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
} from 'lucide-react'
import { VideoEmbed } from '@/components/destination/VideoEmbed'
import { ShareButton } from '@/components/ui/ShareButton'
import { WishlistButton } from '@/components/ui/WishlistButton'
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

const categoryStyles = {
  visit: {
    badge: 'bg-blue-500/90 text-white',
    accent: 'text-blue-600 dark:text-blue-400',
    gradient: 'from-blue-600/80 to-emerald-900/60',
  },
  eat: {
    badge: 'bg-orange-500/90 text-white',
    accent: 'text-orange-600 dark:text-orange-400',
    gradient: 'from-orange-600/80 to-amber-900/60',
  },
  stay: {
    badge: 'bg-emerald-500/90 text-white',
    accent: 'text-emerald-600 dark:text-emerald-400',
    gradient: 'from-emerald-600/80 to-teal-900/60',
  },
}

function SectionHeading({ label, title }: { label: string; title: string }) {
  return (
    <div className="mb-6">
      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
        {label}
      </span>
      <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mt-1">{title}</h2>
    </div>
  )
}

export function DestinationDetail({ destination, related }: DestinationDetailProps) {
  const heroImage = getDestinationThumbnail(destination)
  const galleryImages = getGalleryImages(destination)
  const styles = categoryStyles[destination.category]
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

  return (
    <article className="bg-white dark:bg-slate-950">
      {/* ── 1. Hero ── */}
      <section className="relative w-full min-h-[45vh] md:min-h-[55vh] flex items-end overflow-hidden">
        {heroImage ? (
          <img
            src={heroImage}
            alt={destination.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 to-teal-800" />
        )}
        <div className={`absolute inset-0 bg-gradient-to-t ${styles.gradient} via-slate-900/60 to-slate-900/30`} />

        <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 md:pb-20 pt-28">
          <Link
            href={ROUTES.DESTINATIONS}
            className="inline-flex items-center gap-1.5 text-white/80 hover:text-white text-sm font-semibold mb-8 transition-colors bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full backdrop-blur-md"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Destinations
          </Link>

          <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-6">
            <span
              className={`inline-flex items-center gap-1.5 px-3 md:px-4 py-1.5 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-wider shadow-lg whitespace-nowrap ${styles.badge}`}
            >
              {CATEGORY_ICONS[destination.category]} {CATEGORY_LABELS[destination.category]}
            </span>
            {destination.is_top_pick && (
              <span className="inline-flex items-center gap-1.5 px-3 md:px-4 py-1.5 bg-amber-500/95 backdrop-blur-md text-white text-[10px] md:text-xs font-black rounded-xl shadow-lg uppercase tracking-wider whitespace-nowrap">
                <ShieldCheck className="w-3.5 h-3.5 md:w-4 md:h-4" /> Travel Hunter Approved
              </span>
            )}
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-black text-white leading-[1.1] drop-shadow-2xl max-w-4xl break-words">
              {destination.name}
            </h1>
            
            <div className="flex items-center gap-3 shrink-0">
              <ShareButton url={`${typeof window !== 'undefined' ? window.location.origin : ''}${getDestinationHref(destination)}`} title={destination.name} className="h-12 px-6 rounded-full" />
              <WishlistButton 
                item={{
                  id: destination.id,
                  type: 'destination',
                  name: destination.name,
                  slug: destination.slug,
                  image: heroImage || undefined
                }} 
                className="w-12 h-12 shadow-lg"
              />
            </div>
          </div>
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
                  <Icon className={`w-6 h-6 ${highlight ? 'text-amber-500 fill-amber-500' : 'text-emerald-600 dark:text-emerald-400'}`} />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{label}</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-0.5 truncate">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 space-y-16 md:space-y-24">
        {/* ── 3. Main Video ── */}
        {showVideo && videoSource && (
          <section className="max-w-5xl mx-auto">
            <SectionHeading label="Watch" title="Experience It First" />
            <div className="rounded-[2rem] overflow-hidden shadow-2xl shadow-slate-200/50 dark:shadow-none ring-1 ring-slate-200/60 dark:ring-slate-800 bg-black">
              <VideoEmbed
                youtubeId={destination.video_id}
                videoUrl={destination.video_url}
                title={`${destination.name} video`}
                className="rounded-[2rem] scale-[1.01]"
              />
            </div>
            <p className="mt-4 text-xs md:text-sm font-semibold text-slate-500 dark:text-slate-400 flex items-center justify-center gap-2 px-4 text-center">
              <Play className="w-3.5 h-3.5 md:w-4 md:h-4 text-emerald-500 fill-emerald-500 shrink-0" />
              Travel Hunter&apos;s video guide to {destination.name}
            </p>
          </section>
        )}

        {/* ── 4. Travel Hunter's Story ── */}
        <section className="max-w-4xl">
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
        </section>

        {/* ── 5. Highlights ── */}
        {destination.highlights && destination.highlights.length > 0 && (
          <section>
            <SectionHeading label="Must-See" title="Highlights" />
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {destination.highlights.map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800"
                >
                  <span className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/50 flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  </span>
                  <span className="text-sm md:text-base text-slate-700 dark:text-slate-200 font-medium pt-1">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ── 6. Image Gallery ── */}
        {galleryImages.length > 0 && (
          <section>
            <SectionHeading label="Gallery" title="Photos & Views" />
            <DestinationGallery images={galleryImages} name={destination.name} />
          </section>
        )}

        {/* ── 7. Practical Info ── */}
        <section>
          <SectionHeading label="Plan Your Visit" title="Practical Info" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {practicalItems.map(({ icon: Icon, title, content }) => (
              <div
                key={title}
                className="p-6 md:p-8 rounded-[2rem] border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center mb-6 border border-emerald-100 dark:border-emerald-900/50">
                  <Icon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-3">{title}</h3>
                <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed">{content}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── 8. Related Places ── */}
        {related.length > 0 && (
          <section className="pb-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-6">
              <SectionHeading label="Explore More" title="Related Places" />
              <Link
                href={ROUTES.DESTINATIONS}
                className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-600 hover:text-emerald-500 transition-colors sm:mb-6"
              >
                View all <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {related.map((place) => {
                const thumb = getDestinationThumbnail(place)
                const placeRating = getRating(place.slug || place.id)
                return (
                  <div key={place.id} className="group relative">
                    <Link
                      href={getDestinationHref(place)}
                      className="block rounded-[2rem] overflow-hidden border-0 bg-white dark:bg-slate-900 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:shadow-xl hover:-translate-y-2 transition-all duration-500 ring-1 ring-slate-100 dark:ring-slate-800 hover:ring-emerald-500/50"
                    >
                      <div className="relative h-48 overflow-hidden bg-slate-100 dark:bg-slate-800">
                        {thumb ? (
                          <img
                            src={thumb}
                            alt={place.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-4xl">
                            {CATEGORY_ICONS[place.category]}
                          </div>
                        )}
                        <span className="absolute top-4 left-4 px-3 py-1.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md text-slate-900 dark:text-white text-[10px] font-black rounded-xl shadow-lg uppercase tracking-wider">
                          {place.category}
                        </span>
                      </div>
                      <div className="p-6">
                        <h3 className="font-black text-xl text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-1 mb-2">
                          {place.name}
                        </h3>
                        <div className="flex items-center justify-between">
                          {place.location && (
                            <div className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
                              <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                              <span className="truncate">{place.location}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1 text-sm text-amber-500 font-bold">
                            <Star className="w-3.5 h-3.5 fill-amber-500" />
                            {placeRating}
                          </div>
                        </div>
                      </div>
                    </Link>
                    
                    <div className="absolute -top-3 -right-3 z-20 scale-90 group-hover:scale-100 transition-transform duration-300">
                      <WishlistButton 
                        item={{
                          id: place.id,
                          type: 'destination',
                          name: place.name,
                          slug: place.slug,
                          image: thumb || undefined
                        }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}
      </div>
    </article>
  )
}
