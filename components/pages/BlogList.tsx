'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { getBlogPosts, calculateReadingTime } from '@/lib/data-fetching'
import type { BlogPost } from '@/lib/types'
import { ROUTES } from '@/lib/constants'
import { Clock, BookOpen, ChevronRight } from 'lucide-react'

export function BlogList() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      const data = await getBlogPosts()
      setPosts(data)
      setLoading(false)
    }
    fetchPosts()
  }, [])

  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen">
      {/* ── Blog Hero Section ── */}
      <section className="relative w-full py-20 md:py-32 bg-slate-50 dark:bg-slate-900 overflow-hidden border-b border-slate-100 dark:border-slate-800">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-teal-50/50 dark:from-emerald-950/20 dark:to-teal-950/20 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <span className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/50 mb-6 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            <BookOpen className="w-6 h-6" />
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white mb-6">
            Travel Stories & Insights
          </h1>
          <p className="text-base md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
            Discover hidden gems, travel tips, and authentic cultural experiences directly from the road.
          </p>
        </div>
      </section>

      {/* ── Blog Grid Section ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-96 bg-slate-100 dark:bg-slate-800 rounded-[2rem] animate-pulse"></div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-[2rem] border border-slate-100 dark:border-slate-800">
            <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-lg font-bold text-slate-600 dark:text-slate-400">No blog posts found yet.</p>
            <p className="text-slate-500 mt-2">Check back soon for new travel stories!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link key={post.id} href={`${ROUTES.BLOG}/${post.slug}`} className="group relative h-full">
                <Card className="overflow-hidden border border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900 hover:border-emerald-500/50 dark:hover:border-emerald-500/50 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer h-full flex flex-col rounded-[2rem]">
                  <div className="relative h-56 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0">
                    {post.featured_image ? (
                      <img
                        src={post.featured_image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/40 dark:to-teal-900/40 flex items-center justify-center">
                        <BookOpen className="w-10 h-10 text-emerald-600/30 dark:text-emerald-400/30" />
                      </div>
                    )}
                    
                    {/* Read Time Badge */}
                    <div className="absolute top-4 right-4 z-10">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md text-slate-900 dark:text-white text-[10px] font-bold rounded-xl shadow-lg tracking-wider">
                        <Clock className="w-3.5 h-3.5 text-emerald-500" />
                        {calculateReadingTime(post.content)} MIN READ
                      </span>
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>

                  <CardContent className="p-6 md:p-8 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-black text-xl text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2 mb-3">
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                          {post.excerpt}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                      <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                        {new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-500 uppercase tracking-wider flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Read <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
