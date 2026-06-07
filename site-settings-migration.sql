-- ============================================================================
-- TRAVEL HUNTER - SITE SETTINGS TABLE MIGRATION
-- Copy and paste this ENTIRE script into the Supabase SQL Editor and click Run.
-- ============================================================================

-- 1. CREATE SITE SETTINGS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS site_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  hero_image TEXT DEFAULT 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Nine_Arches_Bridge_in_Ella.jpg',
  contact_phone TEXT DEFAULT '+94 778 363 959',
  contact_email TEXT DEFAULT 'travelhunterlk@gmail.com',
  contact_address TEXT DEFAULT '188, Kurugoda, Akurana, Kandy, 20850',
  youtube_url TEXT DEFAULT '',
  instagram_url TEXT DEFAULT '',
  facebook_url TEXT DEFAULT '',
  twitter_url TEXT DEFAULT '',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);


-- 2. ENABLE ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Anyone can read site settings (needed for public pages)
CREATE POLICY "Anyone can view site settings" ON site_settings
  FOR SELECT USING (true);

-- Only admins/editors can insert site settings
CREATE POLICY "Admins can insert site settings" ON site_settings
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
  );

-- Only admins/editors can update site settings
CREATE POLICY "Admins can update site settings" ON site_settings
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
  );

-- Only admins/editors can delete site settings
CREATE POLICY "Admins can delete site settings" ON site_settings
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
  );


-- 3. SEED DEFAULT SETTINGS ROW
-- ============================================================================

INSERT INTO site_settings (
  hero_image,
  contact_phone,
  contact_email,
  contact_address,
  youtube_url,
  instagram_url,
  facebook_url,
  twitter_url
) VALUES (
  'https://upload.wikimedia.org/wikipedia/commons/0/0e/Nine_Arches_Bridge_in_Ella.jpg',
  '+94 778 363 959',
  'travelhunterlk@gmail.com',
  '188, Kurugoda, Akurana, Kandy, 20850',
  '',
  '',
  '',
  ''
);


-- ============================================================================
-- DONE! Your site_settings table is set up with:
--   ✅ Single settings row with default contact info
--   ✅ Row Level Security (public read, admin/editor write)
--   ✅ Hero image, contact info, and social media URL fields
-- ============================================================================
