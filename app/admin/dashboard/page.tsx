'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MapPin, FileText, Video, Plus } from 'lucide-react'
import { getDestinations, getBlogPosts, getVideos } from '@/lib/data-fetching'
import { ROUTES } from '@/lib/constants'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    destinations: 0,
    blogPosts: 0,
    videos: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
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
      setLoading(false)
    }

    fetchStats()
  }, [])

  const quickActions = [
    {
      label: 'Add Destination',
      href: `${ROUTES.ADMIN_DESTINATIONS}/new`,
      icon: MapPin,
      color: 'emerald',
    },
    {
      label: 'Add Blog Post',
      href: `${ROUTES.ADMIN_BLOG}/new`,
      icon: FileText,
      color: 'blue',
    },
    {
      label: 'Add Video',
      href: `${ROUTES.ADMIN_VIDEOS}/new`,
      icon: Video,
      color: 'red',
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome to Admin</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your Travel Hunter content and track your progress
        </p>
      </div>

      {/* Stats */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Destinations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">{stats.destinations}</div>
              <p className="text-xs text-gray-500 mt-1">Places you've shared</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Blog Posts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">{stats.blogPosts}</div>
              <p className="text-xs text-gray-500 mt-1">Stories you've written</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
                <Video className="w-4 h-4" />
                Videos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">{stats.videos}</div>
              <p className="text-xs text-gray-500 mt-1">Videos you've shared</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon
              const colorMap = {
                emerald: 'bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-400',
                blue: 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400',
                red: 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400',
              }

              return (
                <Link key={action.href} href={action.href}>
                  <Button className="w-full h-auto flex flex-col items-center gap-3 py-6 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-gray-900 dark:text-white">
                    <div className={`p-3 rounded-lg ${colorMap[action.color as keyof typeof colorMap]}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="font-medium">{action.label}</span>
                  </Button>
                </Link>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Manage Content */}
      <Card>
        <CardHeader>
          <CardTitle>Manage Content</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Link href={ROUTES.ADMIN_DESTINATIONS}>
              <Button variant="outline" className="w-full justify-start h-10">
                <MapPin className="w-4 h-4 mr-2" />
                View All Destinations
              </Button>
            </Link>
            <Link href={ROUTES.ADMIN_BLOG}>
              <Button variant="outline" className="w-full justify-start h-10">
                <FileText className="w-4 h-4 mr-2" />
                View All Blog Posts
              </Button>
            </Link>
            <Link href={ROUTES.ADMIN_VIDEOS}>
              <Button variant="outline" className="w-full justify-start h-10">
                <Video className="w-4 h-4 mr-2" />
                View All Videos
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
