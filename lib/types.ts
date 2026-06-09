// User profile from Supabase
export interface Profile {
  id: string
  email: string
  role: 'editor' | 'admin'
  full_name?: string
  created_at: string
  updated_at: string
}

// Destination data model
export interface Destination {
  id: string
  slug: string
  name: string
  description: string
  category: 'travel' | 'food' | 'lifestyle'
  featured_image?: string
  images?: string[]
  video_id?: string
  video_url?: string
  best_time?: string
  location?: string
  region?: string
  budget?: 'low' | 'mid' | 'luxury'
  highlights?: string[]
  is_top_pick?: boolean
  created_by: string
  created_at: string
  updated_at: string
}

// Blog post data model
export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt?: string
  content: string
  category?: 'travel' | 'food' | 'lifestyle'
  featured_image?: string
  video_id?: string
  video_url?: string
  author_id: string
  created_at: string
  updated_at: string
}

// Video data model
export interface Video {
  id: string
  slug: string
  title: string
  youtube_id?: string
  video_url?: string
  description?: string
  thumbnail?: string
  destination_id?: string
  is_main?: boolean
  uploaded_by: string
  created_at: string
  updated_at: string
}

// Form data for creating/editing content
export interface DestinationFormData {
  name: string
  slug: string
  description: string
  category: 'travel' | 'food' | 'lifestyle'
  featured_image?: File
  images?: File[]
  video_id?: string
  best_time?: string
  location?: string
  region?: string
  budget?: 'low' | 'mid' | 'luxury'
  highlights?: string[]
  is_top_pick?: boolean
}

export interface BlogPostFormData {
  title: string
  slug: string
  excerpt?: string
  content: string
  featured_image?: File
  category?: 'travel' | 'food' | 'lifestyle'
}

export interface VideoFormData {
  title: string
  slug: string
  youtube_id: string
  description?: string
  destination_id?: string
  is_main?: boolean
}

// Site settings (editable from admin panel)
export interface SiteSettings {
  id: string
  hero_image: string
  contact_phone: string
  contact_email: string
  contact_address: string
  youtube_url: string
  instagram_url: string
  facebook_url: string
  tiktok_url: string
  updated_at: string
}

// Wishlist item
export interface WishlistItem {
  id: string
  type: 'destination' | 'blog' | 'video'
  name: string
  slug: string
  image?: string
  addedAt: string
}
