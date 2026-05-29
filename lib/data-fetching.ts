import { createClient } from '@/lib/supabase/client'
import type { Destination, BlogPost, Video, Profile } from '@/lib/types'

// Placeholder data for when Supabase is not configured
const PLACEHOLDER_DESTINATIONS: Destination[] = [
  {
    id: '1',
    slug: 'sigiriya-rock-fortress',
    name: 'Sigiriya Rock Fortress',
    description: 'An ancient palace and fortress complex carved into a massive column of rock. Known as the Eighth Wonder of the World by locals, it offers breathtaking views and features ancient frescoes.',
    category: 'visit',
    featured_image: 'https://upload.wikimedia.org/wikipedia/commons/8/8e/Sigiriya_Rock_Fortress_View_from_Pidurangala_Rock.jpg',
    images: ['https://upload.wikimedia.org/wikipedia/commons/8/8e/Sigiriya_Rock_Fortress_View_from_Pidurangala_Rock.jpg'],
    video_id: 'wM3j0P1iI9w',
    best_time: 'January to April',
    location: 'Central Province',
    highlights: ['Ancient ruins', 'Panoramic views', 'Mirror wall frescoes', 'Lion Paws'],
    created_by: 'admin',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    slug: 'galle-fort',
    name: 'Galle Dutch Fort',
    description: 'A beautifully preserved colonial-era fort on the southwest coast. Wander through cobblestone streets, boutique shops, and cafes while watching stunning sunsets from the ramparts.',
    category: 'visit',
    featured_image: 'https://upload.wikimedia.org/wikipedia/commons/5/54/SL_Galle_Fort_asv2020-01_img24.jpg',
    images: ['https://upload.wikimedia.org/wikipedia/commons/5/54/SL_Galle_Fort_asv2020-01_img24.jpg'],
    video_id: 'qKqg5vP_6A0',
    best_time: 'December to March',
    location: 'Southern Province',
    highlights: ['Colonial architecture', 'Lighthouse', 'Boutique shopping', 'Sunset walks'],
    created_by: 'admin',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '3',
    slug: 'nine-arch-bridge',
    name: 'Nine Arch Bridge',
    description: 'A spectacular colonial-era railway bridge hidden deep in the jungle. An iconic spot for photography, especially when the iconic blue train passes through the misty mountains of Ella.',
    category: 'visit',
    featured_image: 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Nine_Arches_Bridge_in_Ella.jpg',
    images: ['https://upload.wikimedia.org/wikipedia/commons/0/0e/Nine_Arches_Bridge_in_Ella.jpg'],
    video_id: 'V1bFr2SWP1I',
    best_time: 'January to May',
    location: 'Ella, Uva Province',
    highlights: ['Jungle trek', 'Photography', 'Historic railway', 'Scenic views'],
    created_by: 'admin',
    created_at: new Date(Date.now() - 172800000).toISOString(),
    updated_at: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: '4',
    slug: 'yala-national-park',
    name: 'Yala National Park',
    description: 'The most famous wildlife park in Sri Lanka, offering the highest leopard density in the world. Embark on a thrilling safari to spot elephants, sloth bears, and diverse birdlife.',
    category: 'visit',
    featured_image: 'https://upload.wikimedia.org/wikipedia/commons/e/e6/Leopard_in_the_Yala_National_Park.jpg',
    images: ['https://upload.wikimedia.org/wikipedia/commons/e/e6/Leopard_in_the_Yala_National_Park.jpg'],
    video_id: 'tNxg7Z5kH7U',
    best_time: 'February to July',
    location: 'Southern Province',
    highlights: ['Leopard spotting', 'Jeep safari', 'Wild elephants', 'Nature photography'],
    created_by: 'admin',
    created_at: new Date(Date.now() - 259200000).toISOString(),
    updated_at: new Date(Date.now() - 259200000).toISOString(),
  },
  {
    id: '5',
    slug: 'galle-face-street-food',
    name: 'Galle Face Green Street Food',
    description: 'Experience the bustling heart of Colombo at sunset. The promenade comes alive with dozens of food carts offering spicy isso vadei (prawn fritters), kottu roti, and local sweets.',
    category: 'eat',
    featured_image: 'https://upload.wikimedia.org/wikipedia/commons/f/f0/Colombo_-_Galle_Face.jpg',
    images: ['https://upload.wikimedia.org/wikipedia/commons/f/f0/Colombo_-_Galle_Face.jpg'],
    video_id: 'dQw4w9WgXcQ',
    best_time: 'Year-round (Evenings)',
    location: 'Colombo',
    highlights: ['Isso Vadei', 'Ocean views', 'Local atmosphere', 'Affordable eats'],
    created_by: 'admin',
    created_at: new Date(Date.now() - 345600000).toISOString(),
    updated_at: new Date(Date.now() - 345600000).toISOString(),
  },
  {
    id: '6',
    slug: 'mirissa-seafood',
    name: 'Mirissa Beach Seafood',
    description: 'Dine right on the sand under fairy lights. Mirissa beach is famous for its massive displays of freshly caught seafood that you can pick and have grilled to order.',
    category: 'eat',
    featured_image: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Mirissa-Plage_%283%29.jpg',
    images: ['https://upload.wikimedia.org/wikipedia/commons/a/a5/Mirissa-Plage_%283%29.jpg'],
    video_id: 'dQw4w9WgXcQ',
    best_time: 'November to April',
    location: 'Mirissa',
    highlights: ['Fresh catch', 'Beachfront dining', 'Grilled jumbo prawns', 'Romantic setting'],
    created_by: 'admin',
    created_at: new Date(Date.now() - 432000000).toISOString(),
    updated_at: new Date(Date.now() - 432000000).toISOString(),
  },
  {
    id: '7',
    slug: 'jetwing-beach',
    name: 'Jetwing Beach Hotel',
    description: 'A luxurious beachfront property in Negombo designed by the legendary architect Geoffrey Bawa. Offers stunning Indian Ocean views, a world-class spa, and exceptional dining.',
    category: 'stay',
    featured_image: 'https://upload.wikimedia.org/wikipedia/commons/e/e9/Negombo_Beach%2C_Sri_Lanka.jpg',
    images: ['https://upload.wikimedia.org/wikipedia/commons/e/e9/Negombo_Beach%2C_Sri_Lanka.jpg'],
    video_id: 'dQw4w9WgXcQ',
    best_time: 'December to April',
    location: 'Negombo',
    highlights: ['Beachfront pool', 'Ayurvedic spa', 'Geoffrey Bawa design', 'Fine dining'],
    created_by: 'admin',
    created_at: new Date(Date.now() - 518400000).toISOString(),
    updated_at: new Date(Date.now() - 518400000).toISOString(),
  },
  {
    id: '8',
    slug: '98-acres-resort',
    name: '98 Acres Resort & Spa',
    description: 'An elegant, eco-friendly boutique hotel standing on a scenic 98-acre tea estate. Experience ultimate luxury in chalets made of recyclable materials with majestic views of Little Adams Peak.',
    category: 'stay',
    featured_image: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Ella_rock_view.jpg',
    images: ['https://upload.wikimedia.org/wikipedia/commons/e/e0/Ella_rock_view.jpg'],
    video_id: 'dQw4w9WgXcQ',
    best_time: 'February to June',
    location: 'Ella',
    highlights: ['Eco-luxury', 'Mountain views', 'Tea estate', 'Infinity pool'],
    created_by: 'admin',
    created_at: new Date(Date.now() - 604800000).toISOString(),
    updated_at: new Date(Date.now() - 604800000).toISOString(),
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
  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .order('created_at', { ascending: false })

    if (error || !data) {
      console.error('Error fetching videos, using placeholder:', error)
      return PLACEHOLDER_VIDEOS
    }

    return data
  } catch (error) {
    console.error('Exception fetching videos, using placeholder:', error)
    return PLACEHOLDER_VIDEOS
  }
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
