-- ============================================================================
-- TRAVEL HUNTER - ABOUT PAGE TABLE MIGRATION
-- Copy and paste this ENTIRE script into the Supabase SQL Editor and click Run.
-- ============================================================================

-- 1. CREATE ABOUT PAGE TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS about_page (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  hero_tagline TEXT DEFAULT 'Sri Lanka''s Travel Hunter',
  hero_title TEXT DEFAULT 'Discover Sri Lanka With Me',
  hero_description TEXT DEFAULT 'Exploring hidden gems, authentic experiences, and unforgettable adventures across the island.',
  hero_image_url TEXT DEFAULT 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=700&h=800&fit=crop',
  story_title TEXT DEFAULT 'The Journey Begins',
  story_content TEXT DEFAULT 'My passion for travel started with a simple question: "What if I could help others discover Sri Lanka the way I see it?" What began as personal travel videos has blossomed into a thriving community of over 250K subscribers.',
  youtube_subscribers TEXT DEFAULT '250K+',
  videos_created TEXT DEFAULT '500+',
  places_explored TEXT DEFAULT '150+',
  community_members TEXT DEFAULT '500K+',
  youtube_url TEXT DEFAULT 'https://youtube.com',
  instagram_url TEXT DEFAULT 'https://instagram.com',
  facebook_url TEXT DEFAULT 'https://facebook.com',
  tiktok_url TEXT DEFAULT 'https://tiktok.com',
  contact_email TEXT DEFAULT 'travelhunterlk@gmail.com',
  contact_phone TEXT DEFAULT '+94 (123) 456-789',
  contact_address TEXT DEFAULT 'Sri Lanka',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);


-- 2. ENABLE ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE about_page ENABLE ROW LEVEL SECURITY;

-- Anyone can read about page data (needed for public /about page)
CREATE POLICY "Anyone can view about page" ON about_page
  FOR SELECT USING (true);

-- Only admins/editors can insert
CREATE POLICY "Admins can insert about page" ON about_page
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
  );

-- Only admins/editors can update
CREATE POLICY "Admins can update about page" ON about_page
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
  );

-- Only admins/editors can delete
CREATE POLICY "Admins can delete about page" ON about_page
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
  );


-- 3. SEED DEFAULT ROW
-- ============================================================================

INSERT INTO about_page (
  hero_tagline,
  hero_title,
  hero_description,
  hero_image_url,
  story_title,
  story_content,
  youtube_subscribers,
  videos_created,
  places_explored,
  community_members,
  youtube_url,
  instagram_url,
  facebook_url,
  tiktok_url,
  contact_email,
  contact_phone,
  contact_address
) VALUES (
  'Sri Lanka''s Travel Hunter',
  'Discover Sri Lanka With Me',
  'Exploring hidden gems, authentic experiences, and unforgettable adventures across the island.',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=700&h=800&fit=crop',
  'The Journey Begins',
  'My passion for travel started with a simple question: "What if I could help others discover Sri Lanka the way I see it?" What began as personal travel videos has blossomed into a thriving community of over 250K subscribers.',
  '250K+',
  '500+',
  '150+',
  '500K+',
  'https://youtube.com',
  'https://instagram.com',
  'https://facebook.com',
  'https://tiktok.com',
  'travelhunterlk@gmail.com',
  '+94 (123) 456-789',
  'Sri Lanka'
);


-- ============================================================================
-- DONE! Your about_page table is set up with:
--   ✅ Single settings row with default content
--   ✅ Row Level Security (public read, admin/editor write)
--   ✅ Hero section, story, stats, social links, and contact fields
-- ============================================================================
