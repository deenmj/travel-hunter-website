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
} from 'lucide-react'
import { VideoEmbed } from '@/components/destination/VideoEmbed'
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
      content: getHowToReach(destination),
    },
    {
      icon: Ticket,
      title: 'Fees & Costs',
      content: getEntryFees(destination.category),
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
        <div className={`absolute inset-0 bg-gradient-to-t ${styles.gradient} via-black/40 to-black/20`} />

        <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 md:pb-14 pt-24">
          <Link
            href={ROUTES.DESTINATIONS}
            className="inline-flex items-center gap-1.5 text-white/80 hover:text-white text-sm font-medium mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            All Destinations
          </Link>

          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 ${styles.badge}`}
          >
            {CATEGORY_ICONS[destination.category]} {CATEGORY_LABELS[destination.category]}
          </span>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-tight drop-shadow-lg max-w-3xl">
            {destination.name}
          </h1>
        </div>
      </section>

      {/* ── 2. Quick Info Row ── */}
      <section className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {quickInfo.map(({ icon: Icon, label, value, highlight }) => (
              <div
                key={label}
                className="flex items-start gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center shrink-0">
                  <Icon className={`w-5 h-5 ${highlight ? 'text-amber-500 fill-amber-500' : 'text-emerald-600 dark:text-emerald-400'}`} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 mt-0.5 truncate">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-14 md:space-y-20">
        {/* ── 3. Main Video ── */}
        {showVideo && videoSource && (
          <section>
            <SectionHeading label="Watch" title="Experience It First" />
            <div className="rounded-2xl overflow-hidden shadow-xl shadow-slate-200/50 dark:shadow-none ring-1 ring-slate-200/60 dark:ring-slate-800">
              <VideoEmbed
                youtubeId={destination.video_id}
                videoUrl={destination.video_url}
                title={`${destination.name} video`}
                className="rounded-2xl"
              />
            </div>
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <Play className="w-4 h-4 text-emerald-500" />
              Travel Hunter&apos;s video guide to {destination.name}
            </p>
          </section>
        )}

        {/* ── 4. Travel Hunter's Story ── */}
        <section>
          <SectionHeading label="Our Take" title="Travel Hunter's Story" />
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <div className="relative pl-6 border-l-4 border-emerald-500">
              <p className="text-base md:text-lg text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {destination.description}
              </p>
            </div>
          </div>

          {destination.highlights && destination.highlights.length > 0 && (
            <div className="mt-8 p-5 md:p-6 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-slate-900 dark:text-white">Pro Tip from Travel Hunter</h3>
              </div>
              <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {practicalItems.map(({ icon: Icon, title, content }) => (
              <div
                key={title}
                className="p-5 md:p-6 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm"
              >
                <div className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{content}</p>
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

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {related.map((place) => {
                const thumb = getDestinationThumbnail(place)
                return (
                  <Link
                    key={place.id}
                    href={getDestinationHref(place)}
                    className="group block rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="relative h-40 overflow-hidden bg-slate-100 dark:bg-slate-800">
                      {thumb ? (
                        <img
                          src={thumb}
                          alt={place.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-4xl">
                          {CATEGORY_ICONS[place.category]}
                        </div>
                      )}
                      <span className="absolute top-2 right-2 px-2 py-0.5 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold rounded-full uppercase">
                        {place.category}
                      </span>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
                        {place.name}
                      </h3>
                      {place.location && (
                        <p className="text-xs text-slate-400 mt-1 truncate">📍 {place.location}</p>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>
        )}
      </div>
    </article>
  )
}
