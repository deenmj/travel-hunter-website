'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import {
  MapPin,
  FileText,
  Video,
  Plus,
  TrendingUp,
  Eye,
  Clock,
  ArrowRight,
  Settings,
} from 'lucide-react'
import { getDestinations, getBlogPosts, getVideos } from '@/lib/data-fetching'
import { ROUTES } from '@/lib/constants'
import type { Destination, BlogPost, Video as VideoType } from '@/lib/types'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ destinations: 0, blogPosts: 0, videos: 0 })
  const [recentDestinations, setRecentDestinations] = useState<Destination[]>([])
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([])
  const [recentVideos, setRecentVideos] = useState<VideoType[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const [destinations, posts, videos] = await Promise.all([
        getDestinations(),
        getBlogPosts(),
        getVideos(),
      ])

      setStats({
        destinations: destinations.length,
        blogPosts: posts.length,
        videos: videos.length,
      })
      setRecentDestinations(destinations.slice(0, 5))
      setRecentPosts(posts.slice(0, 5))
      setRecentVideos(videos.slice(0, 3))
      setLoading(false)
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="h-64 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  const statCards = [
    {
      label: 'Destinations',
      value: stats.destinations,
      icon: MapPin,
      color: 'from-emerald-500 to-emerald-600',
      shadowColor: 'shadow-emerald-500/20',
      href: ROUTES.ADMIN_DESTINATIONS,
    },
    {
      label: 'Blog Posts',
      value: stats.blogPosts,
      icon: FileText,
      color: 'from-blue-500 to-blue-600',
      shadowColor: 'shadow-blue-500/20',
      href: ROUTES.ADMIN_BLOG,
    },
    {
      label: 'Videos',
      value: stats.videos,
      icon: Video,
      color: 'from-purple-500 to-purple-600',
      shadowColor: 'shadow-purple-500/20',
      href: ROUTES.ADMIN_VIDEOS,
    },
  ]

  const quickActions = [
    {
      label: 'Edit About Page',
      href: '/admin/about',
      icon: Settings,
      gradient: 'from-orange-500 to-rose-600',
    },
    {
      label: 'New Destination',
      href: `${ROUTES.ADMIN_DESTINATIONS}/new`,
      icon: MapPin,
      gradient: 'from-emerald-500 to-teal-600',
    },
    {
      label: 'New Blog Post',
      href: `${ROUTES.ADMIN_BLOG}/new`,
      icon: FileText,
      gradient: 'from-blue-500 to-indigo-600',
    },
  ]

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
          Welcome back 👋
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Here's what's happening with your Travel Hunter content.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Link key={stat.label} href={stat.href}>
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700/50 p-5 hover:shadow-lg transition-all duration-200 group">
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-md ${stat.shadowColor}`}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <TrendingUp className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 transition-colors" />
                </div>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{stat.label}</p>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700/50 p-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <Link key={action.href} href={action.href}>
                <div
                  className={`bg-gradient-to-br ${action.gradient} rounded-xl p-4 text-white hover:opacity-90 transition-all duration-200 hover:shadow-lg flex items-center gap-3`}
                >
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <Plus className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{action.label}</p>
                    <p className="text-xs text-white/70">Create new content</p>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Recent Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Destinations */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Recent Destinations
            </h2>
            <Link
              href={ROUTES.ADMIN_DESTINATIONS}
              className="text-sm text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {recentDestinations.length > 0 ? (
            <div className="space-y-3">
              {recentDestinations.map((dest) => (
                <div
                  key={dest.id}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-lg shrink-0">
                    {dest.category === 'travel'
                      ? '🗺️'
                      : dest.category === 'food'
                        ? '🍽️'
                        : '🏨'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                      {dest.name}
                    </p>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(dest.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 capitalize">
                    {dest.category}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400">
              <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No destinations yet</p>
            </div>
          )}
        </div>

        {/* Recent Blog Posts */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Recent Blog Posts
            </h2>
            <Link
              href={ROUTES.ADMIN_BLOG}
              className="text-sm text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {recentPosts.length > 0 ? (
            <div className="space-y-3">
              {recentPosts.map((post) => (
                <div
                  key={post.id}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                      {post.title}
                    </p>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(post.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Eye className="w-4 h-4 text-slate-400 shrink-0" />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400">
              <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No blog posts yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
