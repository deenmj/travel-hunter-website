export interface AboutPageData {
  id: string
  hero_tagline: string
  hero_title: string
  hero_description: string
  hero_image_url: string
  story_title: string
  story_content: string
  youtube_subscribers: string
  videos_created: string
  places_explored: string
  community_members: string
  contact_email: string
  contact_phone: string
  contact_address: string
  updated_at: string
  created_at: string
}

export async function getAboutPageData(): Promise<AboutPageData | null> {
  try {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('about_page')
      .select('*')
      .limit(1)
      .maybeSingle()

    if (error) {
      console.error('Error fetching about page data:', error)
      return null
    }

    if (!data) {
      return null
    }

    return data as AboutPageData
  } catch (error) {
    console.error('Exception fetching about page data:', error)
    return null
  }
}

// Fetch site settings via server-side Supabase client (for use in server components)
export async function getSiteSettingsServer() {
  const DEFAULT = {
    youtube_url: '',
    instagram_url: '',
    facebook_url: '',
    tiktok_url: '',
    contact_phone: '+94 (123) 456-789',
    contact_email: 'travelhunterlk@gmail.com',
    contact_address: 'Sri Lanka',
  }

  try {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('site_settings')
      .select('youtube_url, instagram_url, facebook_url, tiktok_url, contact_phone, contact_email, contact_address')
      .limit(1)
      .maybeSingle()

    if (error || !data) {
      return DEFAULT
    }

    return {
      youtube_url: data.youtube_url || DEFAULT.youtube_url,
      instagram_url: data.instagram_url || DEFAULT.instagram_url,
      facebook_url: data.facebook_url || DEFAULT.facebook_url,
      tiktok_url: data.tiktok_url || DEFAULT.tiktok_url,
      contact_phone: data.contact_phone || DEFAULT.contact_phone,
      contact_email: data.contact_email || DEFAULT.contact_email,
      contact_address: data.contact_address || DEFAULT.contact_address,
    }
  } catch {
    return DEFAULT
  }
}

// Default fallback data
export const DEFAULT_ABOUT_DATA: AboutPageData = {
  id: '',
  hero_tagline: "Sri Lanka's Travel Hunter",
  hero_title: 'Discover Sri Lanka With Me',
  hero_description: 'Exploring hidden gems, authentic experiences, and unforgettable adventures across the island.',
  hero_image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=700&h=800&fit=crop',
  story_title: 'The Journey Begins',
  story_content: 'My passion for travel started with a simple question: "What if I could help others discover Sri Lanka the way I see it?" What began as personal travel videos has blossomed into a thriving community of over 250K subscribers.',
  youtube_subscribers: '250K+',
  videos_created: '500+',
  places_explored: '150+',
  community_members: '500K+',
  contact_email: 'travelhunterlk@gmail.com',
  contact_phone: '+94 (123) 456-789',
  contact_address: 'Sri Lanka',
  updated_at: new Date().toISOString(),
  created_at: new Date().toISOString(),
}
