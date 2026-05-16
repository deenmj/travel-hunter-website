'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { getBlogPosts } from '@/lib/data-fetching'
import type { BlogPost } from '@/lib/types'
import { ROUTES } from '@/lib/constants'

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
    <section className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Travel Blog</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Stories and tips from travelers
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-200 dark:bg-slate-700 rounded-lg animate-pulse"></div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">No blog posts yet. Check back soon!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map((post) => (
            <Link key={post.id} href={`${ROUTES.BLOG}/${post.slug}`}>
              <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col">
                {post.featured_image && (
                  <div className="relative h-48 w-full bg-gray-200 dark:bg-slate-700 overflow-hidden flex-shrink-0">
                    <img
                      src={post.featured_image}
                      alt={post.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}

                <CardContent className="p-4 flex-grow flex flex-col">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 line-clamp-2">
                    {post.title}
                  </h3>

                  {post.excerpt && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 flex-grow">
                      {post.excerpt}
                    </p>
                  )}

                  <div className="text-xs text-gray-500 dark:text-gray-500 mt-4">
                    {new Date(post.created_at).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}
