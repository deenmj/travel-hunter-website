import { createClient } from '@/lib/supabase/client'
import type { Destination, BlogPost, Video, Profile, SiteSettings } from '@/lib/types'

// Placeholder data for when Supabase is not configured
const PLACEHOLDER_DESTINATIONS: Destination[] = [
  {
    id: '1',
    slug: 'sigiriya-rock-fortress',
    name: 'Sigiriya Rock Fortress',
    description: 'An ancient palace and fortress complex carved into a massive column of rock. Known as the Eighth Wonder of the World by locals, it offers breathtaking views and features ancient frescoes.',
    category: 'travel',
    featured_image: 'https://upload.wikimedia.org/wikipedia/commons/8/8e/Sigiriya_Rock_Fortress_View_from_Pidurangala_Rock.jpg',
    images: ['https://upload.wikimedia.org/wikipedia/commons/8/8e/Sigiriya_Rock_Fortress_View_from_Pidurangala_Rock.jpg'],
    video_id: 'wM3j0P1iI9w',
    best_time: 'January to April',
    location: 'Central Province',
    region: 'Sigiriya',
    budget: 'mid',
    highlights: ['Ancient ruins', 'Panoramic views', 'Mirror wall frescoes', 'Lion Paws'],
    is_top_pick: true,
    created_by: 'admin',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    slug: 'galle-fort',
    name: 'Galle Dutch Fort',
    description: 'A beautifully preserved colonial-era fort on the southwest coast. Wander through cobblestone streets, boutique shops, and cafes while watching stunning sunsets from the ramparts.',
    category: 'travel',
    featured_image: 'https://upload.wikimedia.org/wikipedia/commons/5/54/SL_Galle_Fort_asv2020-01_img24.jpg',
    images: ['https://upload.wikimedia.org/wikipedia/commons/5/54/SL_Galle_Fort_asv2020-01_img24.jpg'],
    video_id: 'qKqg5vP_6A0',
    best_time: 'December to March',
    location: 'Southern Province',
    region: 'Galle',
    budget: 'low',
    highlights: ['Colonial architecture', 'Lighthouse', 'Boutique shopping', 'Sunset walks'],
    is_top_pick: true,
    created_by: 'admin',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '3',
    slug: 'nine-arch-bridge',
    name: 'Nine Arch Bridge',
    description: 'A spectacular colonial-era railway bridge hidden deep in the jungle. An iconic spot for photography, especially when the iconic blue train passes through the misty mountains of Ella.',
    category: 'travel',
    featured_image: 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Nine_Arches_Bridge_in_Ella.jpg',
    images: ['https://upload.wikimedia.org/wikipedia/commons/0/0e/Nine_Arches_Bridge_in_Ella.jpg'],
    video_id: 'V1bFr2SWP1I',
    best_time: 'January to May',
    location: 'Ella, Uva Province',
    region: 'Ella',
    budget: 'low',
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
    category: 'travel',
    featured_image: 'https://upload.wikimedia.org/wikipedia/commons/e/e6/Leopard_in_the_Yala_National_Park.jpg',
    images: ['https://upload.wikimedia.org/wikipedia/commons/e/e6/Leopard_in_the_Yala_National_Park.jpg'],
    video_id: 'tNxg7Z5kH7U',
    best_time: 'February to July',
    location: 'Southern Province',
    budget: 'mid',
    highlights: ['Leopard spotting', 'Jeep safari', 'Wild elephants', 'Nature photography'],
    is_top_pick: true,
    created_by: 'admin',
    created_at: new Date(Date.now() - 259200000).toISOString(),
    updated_at: new Date(Date.now() - 259200000).toISOString(),
  },
  {
    id: '5',
    slug: 'galle-face-street-food',
    name: 'Galle Face Green Street Food',
    description: 'Experience the bustling heart of Colombo at sunset. The promenade comes alive with dozens of food carts offering spicy isso vadei (prawn fritters), kottu roti, and local sweets.',
    category: 'food',
    featured_image: 'https://upload.wikimedia.org/wikipedia/commons/f/f0/Colombo_-_Galle_Face.jpg',
    images: ['https://upload.wikimedia.org/wikipedia/commons/f/f0/Colombo_-_Galle_Face.jpg'],
    video_id: 'dQw4w9WgXcQ',
    best_time: 'Year-round (Evenings)',
    location: 'Colombo',
    region: 'Colombo',
    budget: 'low',
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
    category: 'food',
    featured_image: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Mirissa-Plage_%283%29.jpg',
    images: ['https://upload.wikimedia.org/wikipedia/commons/a/a5/Mirissa-Plage_%283%29.jpg'],
    video_id: 'dQw4w9WgXcQ',
    best_time: 'November to April',
    location: 'Mirissa',
    region: 'Mirissa',
    budget: 'mid',
    highlights: ['Fresh catch', 'Beachfront dining', 'Grilled jumbo prawns', 'Romantic setting'],
    is_top_pick: true,
    created_by: 'admin',
    created_at: new Date(Date.now() - 432000000).toISOString(),
    updated_at: new Date(Date.now() - 432000000).toISOString(),
  },
  {
    id: '7',
    slug: 'sri-lankan-wellness-retreat',
    name: 'Sri Lankan Wellness Retreat',
    description: 'Experience traditional Ayurvedic healing and modern wellness in a luxurious setting. Includes yoga, meditation, herbal treatments and organic cuisine surrounded by tropical gardens.',
    category: 'lifestyle',
    featured_image: 'https://upload.wikimedia.org/wikipedia/commons/e/e9/Negombo_Beach%2C_Sri_Lanka.jpg',
    images: ['https://upload.wikimedia.org/wikipedia/commons/e/e9/Negombo_Beach%2C_Sri_Lanka.jpg'],
    video_id: 'dQw4w9WgXcQ',
    best_time: 'December to April',
    location: 'Negombo',
    region: 'Negombo',
    budget: 'luxury',
    highlights: ['Ayurvedic spa', 'Yoga sessions', 'Meditation', 'Organic dining'],
    created_by: 'admin',
    created_at: new Date(Date.now() - 518400000).toISOString(),
    updated_at: new Date(Date.now() - 518400000).toISOString(),
  },
  {
    id: '8',
    slug: 'ella-tea-country-experience',
    name: 'Ella Tea Country Experience',
    description: 'Immerse yourself in the misty highlands. Walk through emerald tea plantations, visit a tea factory, learn the art of Ceylon tea, and enjoy breathtaking mountain views from a luxury eco-resort.',
    category: 'lifestyle',
    featured_image: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Ella_rock_view.jpg',
    images: ['https://upload.wikimedia.org/wikipedia/commons/e/e0/Ella_rock_view.jpg'],
    video_id: 'dQw4w9WgXcQ',
    best_time: 'February to June',
    location: 'Ella',
    region: 'Ella',
    budget: 'mid',
    highlights: ['Tea estate tours', 'Mountain views', 'Eco-resort', 'Cultural immersion'],
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
    destination_id: undefined,
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
    destination_id: undefined,
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
    destination_id: undefined,
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
    content: 'Sri Lanka offers year-round travel opportunities with different seasons affecting different parts of the island. The southwest monsoon hits from May to September, making the east coast ideal during this period. The northeast monsoon from October to January makes the south and west coasts the better choice. The inter-monsoon periods of April-May and October-November can bring rain across the island. For the cultural triangle (Sigiriya, Anuradhapura, Polonnaruwa), January to April is best. For hill country (Ella, Nuwara Eliya), February to April offers the clearest skies.',
    featured_image: 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Nine_Arches_Bridge_in_Ella.jpg',
    category: 'travel',
    author_id: '1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    slug: 'cultural-guide-sri-lanka',
    title: 'Cultural Guide to Sri Lanka',
    excerpt: 'Understand the rich culture and traditions of Sri Lanka',
    content: 'Sri Lanka is a melting pot of Buddhist, Hindu, Muslim and Christian cultures. The island has a rich history spanning over 2,500 years, with ancient kingdoms, colonial influences, and a vibrant modern culture. Visitors should dress modestly when visiting temples, remove shoes before entering sacred sites, and always show respect for religious customs. The island is famous for its traditional dances, including Kandyan dance, and its unique festivals like Vesak and the Kandy Esala Perahera.',
    featured_image: 'https://upload.wikimedia.org/wikipedia/commons/8/8e/Sigiriya_Rock_Fortress_View_from_Pidurangala_Rock.jpg',
    category: 'lifestyle',
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

export async function getTopPicks(limit: number = 4): Promise<Destination[]> {
  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('destinations')
      .select('*')
      .eq('is_top_pick', true)
      .limit(limit)
      .order('created_at', { ascending: false })

    if (error || !data || data.length === 0) {
      return PLACEHOLDER_DESTINATIONS.filter((d) => d.is_top_pick).slice(0, limit)
    }

    return data
  } catch (error) {
    console.error('Exception fetching top picks:', error)
    return PLACEHOLDER_DESTINATIONS.filter((d) => d.is_top_pick).slice(0, limit)
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

// Default site settings fallback
const DEFAULT_SITE_SETTINGS: SiteSettings = {
  id: 'default',
  hero_image: 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Nine_Arches_Bridge_in_Ella.jpg',
  contact_phone: '+94 778 363 959',
  contact_email: 'travelhunterlk@gmail.com',
  contact_address: '188, Kurugoda, Akurana, Kandy, 20850',
  youtube_url: '',
  instagram_url: '',
  facebook_url: '',
  tiktok_url: '',
  updated_at: new Date().toISOString(),
}

// Site settings query
export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .limit(1)
      .single()

    if (error || !data) {
      console.error('Error fetching site settings, using defaults:', error)
      return DEFAULT_SITE_SETTINGS
    }

    return data
  } catch (error) {
    console.error('Exception fetching site settings, using defaults:', error)
    return DEFAULT_SITE_SETTINGS
  }
}

// Reading time utility
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200
  const wordCount = content.trim().split(/\s+/).length
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute))
}
