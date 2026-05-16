import { createClient } from '@/lib/supabase/client'
import type { Destination, BlogPost, Video, Profile } from '@/lib/types'

// Placeholder data for when Supabase is not configured
const PLACEHOLDER_DESTINATIONS: Destination[] = [
  {
    id: '1',
    slug: 'sigiriya-rock-fortress',
    name: 'Sigiriya Rock Fortress',
    description: 'Climb the iconic rock fortress with panoramic views of Sri Lanka',
    category: 'visit',
    featured_image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    images: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400'],
    video_id: 'dQw4w9WgXcQ',
    best_time: 'November to March',
    location: 'Central Province',
    highlights: ['Ancient fortress', 'Panoramic views', 'Mirror wall frescoes'],
    created_by: '1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    slug: 'kandy-temple-of-the-tooth',
    name: 'Temple of the Tooth, Kandy',
    description: 'Visit the sacred Buddhist temple housing the tooth relic of Buddha',
    category: 'visit',
    featured_image: 'https://images.unsplash.com/photo-1548013146-72f90ecb3c6b?w=800',
    images: ['https://images.unsplash.com/photo-1548013146-72f90ecb3c6b?w=400'],
    video_id: 'dQw4w9WgXcQ',
    best_time: 'Year-round',
    location: 'Central Province',
    highlights: ['Sacred temple', 'Buddhist pilgrimage', 'Cultural significance'],
    created_by: '1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    slug: 'ella-gap-hiking',
    name: 'Ella Gap Hiking Trail',
    description: 'Trek through misty mountains and tea plantations in Ella',
    category: 'visit',
    featured_image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    images: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400'],
    video_id: 'dQw4w9WgXcQ',
    best_time: 'January to March',
    location: 'Uva Province',
    highlights: ['Mountain views', 'Tea plantations', 'Adventure hiking'],
    created_by: '1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '4',
    slug: 'colombo-street-food',
    name: 'Colombo Street Food Tour',
    description: 'Taste authentic Sri Lankan cuisine at vibrant street food markets',
    category: 'eat',
    featured_image: 'https://images.unsplash.com/photo-1504674900968-8d6e7b8b0e48?w=800',
    images: ['https://images.unsplash.com/photo-1504674900968-8d6e7b8b0e48?w=400'],
    video_id: 'dQw4w9WgXcQ',
    best_time: 'November to April',
    location: 'Colombo',
    highlights: ['Street food', 'Local flavors', 'Cultural experience'],
    created_by: '1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

const PLACEHOLDER_VIDEOS: Video[] = [
  {
    id: '1',
    slug: 'sri-lanka-adventure',
    title: 'Epic Sri Lanka Adventure',
    youtube_id: 'dQw4w9WgXcQ',
    description: 'Explore the best destinations in Sri Lanka',
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    destination_id: null,
    uploaded_by: '1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    slug: 'colombo-food-guide',
    title: 'Ultimate Colombo Food Guide',
    youtube_id: 'dQw4w9WgXcQ',
    description: 'Discover the best places to eat in Colombo',
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    destination_id: null,
    uploaded_by: '1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    slug: 'tea-plantation-tour',
    title: 'Tea Plantation Tour',
    youtube_id: 'dQw4w9WgXcQ',
    description: 'Experience the tea plantations of Sri Lanka',
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    destination_id: null,
    uploaded_by: '1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

const PLACEHOLDER_BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    slug: 'best-time-visit-sri-lanka',
    title: 'Best Time to Visit Sri Lanka',
    excerpt: 'Learn about the perfect time to plan your Sri Lankan adventure',
    content: 'Sri Lanka offers year-round travel opportunities with different seasons...',
    featured_image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    author_id: '1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    slug: 'cultural-guide-sri-lanka',
    title: 'Cultural Guide to Sri Lanka',
    excerpt: 'Understand the rich culture and traditions of Sri Lanka',
    content: 'Sri Lanka is a melting pot of Buddhist, Hindu, Muslim and Christian cultures...',
    featured_image: 'https://images.unsplash.com/photo-1548013146-72f90ecb3c6b?w=800',
    author_id: '1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

// Destination queries
export async function getDestinations(category?: string): Promise<Destination[]> {
  try {
    const supabase = createClient()

    let query = supabase.from('destinations').select('*')

    if (category) {
      query = query.eq('category', category)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error || !data) {
      console.error('Error fetching destinations, using placeholder:', error)
      return category
        ? PLACEHOLDER_DESTINATIONS.filter((d) => d.category === category)
        : PLACEHOLDER_DESTINATIONS
    }

    return data
  } catch (error) {
    console.error('Exception fetching destinations, using placeholder:', error)
    return category
      ? PLACEHOLDER_DESTINATIONS.filter((d) => d.category === category)
      : PLACEHOLDER_DESTINATIONS
  }
}

export async function getDestinationBySlug(slug: string): Promise<Destination | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('destinations')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) {
    console.error('Error fetching destination:', error)
    return null
  }

  return data
}

export async function getFeaturedDestinations(limit: number = 4): Promise<Destination[]> {
  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('destinations')
      .select('*')
      .limit(limit)
      .order('created_at', { ascending: false })

    if (error || !data) {
      console.error('Error fetching featured destinations, using placeholder:', error)
      return PLACEHOLDER_DESTINATIONS.slice(0, limit)
    }

    return data
  } catch (error) {
    console.error('Exception fetching featured destinations, using placeholder:', error)
    return PLACEHOLDER_DESTINATIONS.slice(0, limit)
  }
}

// Blog post queries
export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false })

    if (error || !data) {
      console.error('Error fetching blog posts, using placeholder:', error)
      return PLACEHOLDER_BLOG_POSTS
    }

    return data
  } catch (error) {
    console.error('Exception fetching blog posts, using placeholder:', error)
    return PLACEHOLDER_BLOG_POSTS
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) {
    console.error('Error fetching blog post:', error)
    return null
  }

  return data
}

export async function getLatestBlogPosts(limit: number = 4): Promise<BlogPost[]> {
  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .limit(limit)
      .order('created_at', { ascending: false })

    if (error || !data) {
      console.error('Error fetching latest blog posts, using placeholder:', error)
      return PLACEHOLDER_BLOG_POSTS.slice(0, limit)
    }

    return data
  } catch (error) {
    console.error('Exception fetching latest blog posts, using placeholder:', error)
    return PLACEHOLDER_BLOG_POSTS.slice(0, limit)
  }
}

// Video queries
export async function getVideos(): Promise<Video[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('videos')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching videos:', error)
    return []
  }

  return data || []
}

export async function getVideoBySlug(slug: string): Promise<Video | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('videos')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) {
    console.error('Error fetching video:', error)
    return null
  }

  return data
}

export async function getLatestVideos(limit: number = 6): Promise<Video[]> {
  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .limit(limit)
      .order('created_at', { ascending: false })

    if (error || !data) {
      console.error('Error fetching latest videos, using placeholder:', error)
      return PLACEHOLDER_VIDEOS.slice(0, limit)
    }

    return data
  } catch (error) {
    console.error('Exception fetching latest videos, using placeholder:', error)
    return PLACEHOLDER_VIDEOS.slice(0, limit)
  }
}

export async function getVideosByDestination(destinationId: string): Promise<Video[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('videos')
    .select('*')
    .eq('destination_id', destinationId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching videos by destination:', error)
    return []
  }

  return data || []
}

// Profile queries
export async function getUserProfile(): Promise<Profile | null> {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) {
    console.error('Error fetching user profile:', error)
    return null
  }

  return data
}

export async function getProfileById(id: string): Promise<Profile | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching profile:', error)
    return null
  }

  return data
}
