'use client'

import Link from 'next/link'
import { ArrowLeft, Clock, Calendar, Share2, Play } from 'lucide-react'
import type { BlogPost } from '@/lib/types'
import { ROUTES } from '@/lib/constants'
import { calculateReadingTime } from '@/lib/data-fetching'
import { ShareButton } from '@/components/ui/ShareButton'
import { VideoEmbed } from '@/components/destination/VideoEmbed'
import { DestinationGallery } from '@/components/destination/DestinationGallery'
import { resolveVideoSource } from '@/lib/video-utils'

interface BlogDetailProps {
  post: BlogPost
  related: BlogPost[]
}

export function BlogDetail({ post, related }: BlogDetailProps) {
  const showVideo = post.video_id || post.video_url
  const videoSource = resolveVideoSource(post.video_id, post.video_url)

  return (
    <article className="bg-white dark:bg-slate-950 min-h-screen">
      {/* ── 1. Hero ── */}
      <section className="relative w-full min-h-[50vh] md:min-h-[60vh] flex flex-col justify-between overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          {post.featured_image ? (
            <img
              src={post.featured_image}
              alt={post.title}
              className="w-full h-full object-cover object-center scale-[1.02]"
            />
          ) : (
            <div className="w-full h-full bg-slate-900" />
          )}
          
          <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-black/70 via-black/30 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-emerald-900/20 mix-blend-overlay" />
        </div>

        {/* Top Navigation Bar */}
        <div className="relative z-20 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 flex items-center justify-between">
          <Link
            href={ROUTES.BLOG}
            className="group flex items-center gap-2 text-white text-sm font-semibold transition-all bg-black/20 hover:bg-black/40 px-4 sm:px-5 py-2.5 rounded-full backdrop-blur-md border border-white/10"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span className="hidden sm:inline">Back to Blog</span>
            <span className="inline sm:hidden">Back</span>
          </Link>

          <ShareButton 
            url={`${typeof window !== 'undefined' ? window.location.origin : ''}${ROUTES.BLOG}/${post.slug}`} 
            title={post.title} 
            className="flex items-center gap-2 h-10 sm:h-11 px-4 sm:px-5 rounded-full bg-black/20 hover:bg-black/40 text-white font-medium text-sm backdrop-blur-md border border-white/10 transition-all"
          />
        </div>

        {/* Bottom Content Area */}
        <div className="relative z-20 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 sm:pb-12 mt-auto">
          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/90 text-white text-[10px] sm:text-xs font-bold rounded-full uppercase tracking-widest backdrop-blur-md border border-white/20">
              {post.category || 'Travel'}
            </span>
            <span className="flex items-center gap-1.5 text-white/90 text-xs sm:text-sm font-medium">
              <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              {new Date(post.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
            <span className="flex items-center gap-1.5 text-white/90 text-xs sm:text-sm font-medium">
              <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              {calculateReadingTime(post.content)} min read
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white leading-[1.1] tracking-tight drop-shadow-2xl">
            {post.title}
          </h1>
        </div>
      </section>

      {/* Main Content Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        
        {/* Excerpt if available */}
        {post.excerpt && (
          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 font-medium leading-relaxed mb-10 pb-10 border-b border-slate-200 dark:border-slate-800">
            {post.excerpt}
          </p>
        )}

        {/* Content */}
        <div className="prose prose-lg md:prose-xl prose-slate dark:prose-invert max-w-none mb-16 whitespace-pre-line">
          {post.content}
        </div>

        {/* ── Video ── */}
        {showVideo && videoSource && (
          <div className="mb-16">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <Play className="w-6 h-6 text-emerald-500 fill-emerald-500" />
              Watch Video
            </h3>
            <div className="rounded-[2rem] overflow-hidden shadow-2xl shadow-slate-200/50 dark:shadow-none ring-1 ring-slate-200/60 dark:ring-slate-800 bg-black">
              <VideoEmbed
                youtubeId={post.video_id}
                videoUrl={post.video_url}
                title={post.title}
                className="rounded-[2rem] scale-[1.01]"
              />
            </div>
          </div>
        )}

        {/* ── Gallery ── */}
        {post.images && post.images.length > 0 && (
          <div className="mb-16 border-t border-slate-200 dark:border-slate-800 pt-16">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-8">
              Gallery
            </h3>
            {/* Reuse destination gallery for consistent UI */}
            <DestinationGallery images={post.images} name={post.title} />
          </div>
        )}
      </div>
    </article>
  )
}
