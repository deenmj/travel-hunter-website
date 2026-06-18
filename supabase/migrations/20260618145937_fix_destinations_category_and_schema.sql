
-- 1. Drop old check constraint
ALTER TABLE public.destinations DROP CONSTRAINT IF EXISTS destinations_category_check;

-- 2. Migrate existing rows to new category values
UPDATE public.destinations SET category = 'travel' WHERE category = 'visit';
UPDATE public.destinations SET category = 'food'   WHERE category = 'eat';
UPDATE public.destinations SET category = 'lifestyle' WHERE category = 'stay';

-- 3. Add new check constraint with correct values
ALTER TABLE public.destinations
  ADD CONSTRAINT destinations_category_check
  CHECK (category IN ('travel', 'food', 'lifestyle'));

-- 4. Add missing columns (safe - IF NOT EXISTS)
ALTER TABLE public.destinations ADD COLUMN IF NOT EXISTS region TEXT;
ALTER TABLE public.destinations ADD COLUMN IF NOT EXISTS budget TEXT
  CHECK (budget IN ('low', 'mid', 'luxury'));

-- 5. Create about_page table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.about_page (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  hero_tagline TEXT NOT NULL DEFAULT 'Sri Lanka''s Travel Hunter',
  hero_title TEXT NOT NULL DEFAULT 'Discover Sri Lanka With Me',
  hero_description TEXT NOT NULL DEFAULT 'Exploring hidden gems, authentic experiences, and unforgettable adventures across the island.',
  hero_image_url TEXT NOT NULL DEFAULT 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=700&h=800&fit=crop',
  story_title TEXT NOT NULL DEFAULT 'The Journey Begins',
  story_content TEXT NOT NULL DEFAULT 'My passion for travel started with a simple question: "What if I could help others discover Sri Lanka the way I see it?"',
  youtube_subscribers TEXT NOT NULL DEFAULT '250K+',
  videos_created TEXT NOT NULL DEFAULT '500+',
  places_explored TEXT NOT NULL DEFAULT '150+',
  community_members TEXT NOT NULL DEFAULT '500K+',
  youtube_url TEXT NOT NULL DEFAULT '',
  instagram_url TEXT NOT NULL DEFAULT '',
  facebook_url TEXT NOT NULL DEFAULT '',
  tiktok_url TEXT NOT NULL DEFAULT '',
  contact_email TEXT NOT NULL DEFAULT 'travelhunterlk@gmail.com',
  contact_phone TEXT NOT NULL DEFAULT '+94 778 363 959',
  contact_address TEXT NOT NULL DEFAULT '188, Kurugoda, Akurana, Kandy, 20850',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.about_page ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_about_page" ON public.about_page
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "admin_update_about_page" ON public.about_page
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "admin_insert_about_page" ON public.about_page
  FOR INSERT TO authenticated WITH CHECK (true);

-- 6. Seed default about_page row
INSERT INTO public.about_page (hero_tagline, hero_title, hero_description, contact_email, contact_phone, contact_address)
VALUES (
  'Sri Lanka''s Travel Hunter',
  'Discover Sri Lanka With Me',
  'Exploring hidden gems, authentic experiences, and unforgettable adventures across the island.',
  'travelhunterlk@gmail.com',
  '+94 778 363 959',
  '188, Kurugoda, Akurana, Kandy, 20850'
)
ON CONFLICT DO NOTHING;
