'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { ensureSlug } from '@/lib/slug'

// ─── Auth helpers ─────────────────────────────────────────────────────────────

async function requireAdmin() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('Not authenticated')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || (profile.role !== 'admin' && profile.role !== 'editor')) {
    throw new Error('Unauthorized')
  }

  return { supabase, user, role: profile.role }
}

// ─── Destinations ─────────────────────────────────────────────────────────────

export async function createDestination(formData: {
  name: string
  slug: string
  description: string
  category: 'visit' | 'eat' | 'stay'
  featured_image?: string
  images?: string[]
  video_id?: string
  video_url?: string
  best_time?: string
  location?: string
  highlights?: string[]
}) {
  const { supabase, user } = await requireAdmin()

  const slug = ensureSlug(formData.slug, formData.name)

  const { data, error } = await supabase
    .from('destinations')
    .insert({
      ...formData,
      slug,
      created_by: user.id,
    })
    .select()
    .single()

  if (error) {
    return { data: null, error: error.message }
  }

  revalidatePath('/admin/destinations')
  revalidatePath('/destinations')
  return { data, error: null }
}

export async function updateDestination(
  id: string,
  formData: {
    name?: string
    slug?: string
    description?: string
    category?: 'visit' | 'eat' | 'stay'
    featured_image?: string
    images?: string[]
    video_id?: string
    video_url?: string
    best_time?: string
    location?: string
    highlights?: string[]
  },
) {
  const { supabase } = await requireAdmin()

  const payload = { ...formData, updated_at: new Date().toISOString() }
  if (formData.name !== undefined) {
    payload.slug = ensureSlug(formData.slug, formData.name)
  } else if (formData.slug !== undefined) {
    const trimmed = formData.slug.trim()
    if (trimmed) payload.slug = trimmed
  }

  const { data, error } = await supabase
    .from('destinations')
    .update(payload)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return { data: null, error: error.message }
  }

  revalidatePath('/admin/destinations')
  revalidatePath('/destinations')
  return { data, error: null }
}

export async function deleteDestination(id: string) {
  const { supabase } = await requireAdmin()

  const { error } = await supabase.from('destinations').delete().eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/destinations')
  revalidatePath('/destinations')
  return { error: null }
}

export async function getDestinationById(id: string) {
  const { supabase } = await requireAdmin()

  const { data, error } = await supabase
    .from('destinations')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    return { data: null, error: error.message }
  }

  return { data, error: null }
}

// ─── Blog Posts ───────────────────────────────────────────────────────────────

export async function createBlogPost(formData: {
  title: string
  slug: string
  excerpt?: string
  content: string
  featured_image?: string
  video_id?: string
  video_url?: string
}) {
  const { supabase, user } = await requireAdmin()

  const { data, error } = await supabase
    .from('blog_posts')
    .insert({
      ...formData,
      author_id: user.id,
    })
    .select()
    .single()

  if (error) {
    return { data: null, error: error.message }
  }

  revalidatePath('/admin/blogs')
  revalidatePath('/blog')
  return { data, error: null }
}

export async function updateBlogPost(
  id: string,
  formData: {
    title?: string
    slug?: string
    excerpt?: string
    content?: string
    featured_image?: string
    video_id?: string
    video_url?: string
  },
) {
  const { supabase } = await requireAdmin()

  const { data, error } = await supabase
    .from('blog_posts')
    .update({ ...formData, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return { data: null, error: error.message }
  }

  revalidatePath('/admin/blogs')
  revalidatePath('/blog')
  return { data, error: null }
}

export async function deleteBlogPost(id: string) {
  const { supabase } = await requireAdmin()

  const { error } = await supabase.from('blog_posts').delete().eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/blogs')
  revalidatePath('/blog')
  return { error: null }
}

export async function getBlogPostById(id: string) {
  const { supabase } = await requireAdmin()

  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    return { data: null, error: error.message }
  }

  return { data, error: null }
}

// ─── Videos ───────────────────────────────────────────────────────────────────

export async function createVideo(formData: {
  title: string
  slug: string
  youtube_id?: string
  video_url?: string
  description?: string
  thumbnail?: string
  destination_id?: string
}) {
  const { supabase, user } = await requireAdmin()

  const { data, error } = await supabase
    .from('videos')
    .insert({
      ...formData,
      uploaded_by: user.id,
    })
    .select()
    .single()

  if (error) {
    return { data: null, error: error.message }
  }

  revalidatePath('/admin/videos')
  revalidatePath('/videos')
  return { data, error: null }
}

export async function updateVideo(
  id: string,
  formData: {
    title?: string
    slug?: string
    youtube_id?: string
    video_url?: string
    description?: string
    thumbnail?: string
    destination_id?: string
  },
) {
  const { supabase } = await requireAdmin()

  const { data, error } = await supabase
    .from('videos')
    .update({ ...formData, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return { data: null, error: error.message }
  }

  revalidatePath('/admin/videos')
  revalidatePath('/videos')
  return { data, error: null }
}

export async function deleteVideo(id: string) {
  const { supabase } = await requireAdmin()

  const { error } = await supabase.from('videos').delete().eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/videos')
  revalidatePath('/videos')
  return { error: null }
}

export async function getVideoById(id: string) {
  const { supabase } = await requireAdmin()

  const { data, error } = await supabase
    .from('videos')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    return { data: null, error: error.message }
  }

  return { data, error: null }
}

// ─── Media Library ────────────────────────────────────────────────────────────

export async function uploadMedia(fileName: string, file: File) {
  const { supabase } = await requireAdmin()

  const fileExt = fileName.split('.').pop()
  const filePath = `uploads/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

  const { data, error } = await supabase.storage
    .from('media')
    .upload(filePath, file)

  if (error) {
    return { data: null, error: error.message }
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from('media').getPublicUrl(data.path)

  return { data: { path: data.path, url: publicUrl }, error: null }
}

export async function deleteMedia(path: string) {
  const { supabase } = await requireAdmin()

  const { error } = await supabase.storage.from('media').remove([path])

  if (error) {
    return { error: error.message }
  }

  return { error: null }
}

export async function listMedia() {
  const { supabase } = await requireAdmin()

  const { data, error } = await supabase.storage
    .from('media')
    .list('uploads', {
      limit: 100,
      sortBy: { column: 'created_at', order: 'desc' },
    })

  if (error) {
    return { data: null, error: error.message }
  }

  const files = (data || []).map((file) => {
    const {
      data: { publicUrl },
    } = supabase.storage.from('media').getPublicUrl(`uploads/${file.name}`)
    return {
      ...file,
      url: publicUrl,
      path: `uploads/${file.name}`,
    }
  })

  return { data: files, error: null }
}

// ─── Stats ────────────────────────────────────────────────────────────────────

export async function getAdminStats() {
  const { supabase } = await requireAdmin()

  const [destinations, blogs, videos] = await Promise.all([
    supabase.from('destinations').select('id', { count: 'exact', head: true }),
    supabase.from('blog_posts').select('id', { count: 'exact', head: true }),
    supabase.from('videos').select('id', { count: 'exact', head: true }),
  ])

  return {
    destinations: destinations.count || 0,
    blogs: blogs.count || 0,
    videos: videos.count || 0,
  }
}

// ─── Site Settings ────────────────────────────────────────────────────────────

export async function getSiteSettingsAdmin() {
  const { supabase } = await requireAdmin()

  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .limit(1)
    .single()

  if (error) {
    return { data: null, error: error.message }
  }

  return { data, error: null }
}

export async function updateSiteSettings(formData: {
  hero_image?: string
  contact_phone?: string
  contact_email?: string
  contact_address?: string
  youtube_url?: string
  instagram_url?: string
  facebook_url?: string
  twitter_url?: string
}) {
  const { supabase } = await requireAdmin()

  // First try to get the existing settings row
  const { data: existing } = await supabase
    .from('site_settings')
    .select('id')
    .limit(1)
    .single()

  let result

  if (existing) {
    // Update existing row
    result = await supabase
      .from('site_settings')
      .update({ ...formData, updated_at: new Date().toISOString() })
      .eq('id', existing.id)
      .select()
      .single()
  } else {
    // Insert new row
    result = await supabase
      .from('site_settings')
      .insert({ ...formData })
      .select()
      .single()
  }

  if (result.error) {
    return { data: null, error: result.error.message }
  }

  revalidatePath('/')
  revalidatePath('/admin/settings')
  return { data: result.data, error: null }
}
