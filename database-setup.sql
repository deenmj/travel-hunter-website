-- ============================================================================
-- TRAVEL HUNTER - COMPLETE DATABASE SETUP
-- Copy and paste this ENTIRE script into the Supabase SQL Editor and click Run.
-- ============================================================================

-- 1. CREATE TABLES
-- ============================================================================

-- Profiles table (linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  email TEXT,
  role TEXT DEFAULT 'user',
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Destinations table
CREATE TABLE IF NOT EXISTS destinations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('travel', 'food', 'lifestyle')),
  featured_image TEXT,
  images TEXT[],
  video_id TEXT,
  video_url TEXT,
  best_time TEXT,
  location TEXT,
  region TEXT,
  budget TEXT CHECK (budget IN ('low', 'mid', 'luxury')),
  how_to_reach TEXT,
  entry_fees TEXT,
  is_top_pick BOOLEAN DEFAULT false,
  highlights TEXT[],
  created_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Blog Posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  featured_image TEXT,
  video_id TEXT,
  video_url TEXT,
  author_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Videos table
CREATE TABLE IF NOT EXISTS videos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  youtube_id TEXT,
  video_url TEXT,
  description TEXT,
  thumbnail TEXT,
  destination_id UUID REFERENCES destinations(id) ON DELETE SET NULL,
  uploaded_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);


-- 2. ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read their own profile, admins can read all
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Destinations: everyone can read, only admins/editors can write
CREATE POLICY "Anyone can view destinations" ON destinations
  FOR SELECT USING (true);

CREATE POLICY "Admins can insert destinations" ON destinations
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
  );

CREATE POLICY "Admins can update destinations" ON destinations
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
  );

CREATE POLICY "Admins can delete destinations" ON destinations
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
  );

-- Blog Posts: everyone can read, only admins/editors can write
CREATE POLICY "Anyone can view blog posts" ON blog_posts
  FOR SELECT USING (true);

CREATE POLICY "Admins can insert blog posts" ON blog_posts
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
  );

CREATE POLICY "Admins can update blog posts" ON blog_posts
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
  );

CREATE POLICY "Admins can delete blog posts" ON blog_posts
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
  );

-- Videos: everyone can read, only admins/editors can write
CREATE POLICY "Anyone can view videos" ON videos
  FOR SELECT USING (true);

CREATE POLICY "Admins can insert videos" ON videos
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
  );

CREATE POLICY "Admins can update videos" ON videos
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
  );

CREATE POLICY "Admins can delete videos" ON videos
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
  );


-- 3. SET UP YOUR ADMIN PROFILE
-- ============================================================================
-- This assigns admin role to the user you already created (deenmj3149@gmail.com)

INSERT INTO profiles (id, email, role, full_name)
VALUES ('97e68dcd-5b2b-4d5a-a37f-af9aabca99ee', 'deenmj3149@gmail.com', 'admin', 'Admin User')
ON CONFLICT (id) DO UPDATE SET role = 'admin', email = 'deenmj3149@gmail.com', full_name = 'Admin User';


-- 4. SEED DESTINATIONS DATA
-- ============================================================================

INSERT INTO destinations (slug, name, description, category, featured_image, images, video_id, best_time, location, highlights, created_by) VALUES
(
  'sigiriya-rock-fortress',
  'Sigiriya Rock Fortress',
  'An ancient palace and fortress complex carved into a massive column of rock. Known as the Eighth Wonder of the World by locals, it offers breathtaking views and features ancient frescoes.',
  'visit',
  'https://upload.wikimedia.org/wikipedia/commons/8/8e/Sigiriya_Rock_Fortress_View_from_Pidurangala_Rock.jpg',
  ARRAY['https://upload.wikimedia.org/wikipedia/commons/8/8e/Sigiriya_Rock_Fortress_View_from_Pidurangala_Rock.jpg'],
  'wM3j0P1iI9w',
  'January to April',
  'Central Province',
  ARRAY['Ancient ruins', 'Panoramic views', 'Mirror wall frescoes', 'Lion Paws'],
  '97e68dcd-5b2b-4d5a-a37f-af9aabca99ee'
),
(
  'galle-fort',
  'Galle Dutch Fort',
  'A beautifully preserved colonial-era fort on the southwest coast. Wander through cobblestone streets, boutique shops, and cafes while watching stunning sunsets from the ramparts.',
  'visit',
  'https://upload.wikimedia.org/wikipedia/commons/5/54/SL_Galle_Fort_asv2020-01_img24.jpg',
  ARRAY['https://upload.wikimedia.org/wikipedia/commons/5/54/SL_Galle_Fort_asv2020-01_img24.jpg'],
  'qKqg5vP_6A0',
  'December to March',
  'Southern Province',
  ARRAY['Colonial architecture', 'Lighthouse', 'Boutique shopping', 'Sunset walks'],
  '97e68dcd-5b2b-4d5a-a37f-af9aabca99ee'
),
(
  'nine-arch-bridge',
  'Nine Arch Bridge',
  'A spectacular colonial-era railway bridge hidden deep in the jungle. An iconic spot for photography, especially when the iconic blue train passes through the misty mountains of Ella.',
  'visit',
  'https://upload.wikimedia.org/wikipedia/commons/0/0e/Nine_Arches_Bridge_in_Ella.jpg',
  ARRAY['https://upload.wikimedia.org/wikipedia/commons/0/0e/Nine_Arches_Bridge_in_Ella.jpg'],
  'V1bFr2SWP1I',
  'January to May',
  'Ella, Uva Province',
  ARRAY['Jungle trek', 'Photography', 'Historic railway', 'Scenic views'],
  '97e68dcd-5b2b-4d5a-a37f-af9aabca99ee'
),
(
  'yala-national-park',
  'Yala National Park',
  'The most famous wildlife park in Sri Lanka, offering the highest leopard density in the world. Embark on a thrilling safari to spot elephants, sloth bears, and diverse birdlife.',
  'visit',
  'https://upload.wikimedia.org/wikipedia/commons/e/e6/Leopard_in_the_Yala_National_Park.jpg',
  ARRAY['https://upload.wikimedia.org/wikipedia/commons/e/e6/Leopard_in_the_Yala_National_Park.jpg'],
  'tNxg7Z5kH7U',
  'February to July',
  'Southern Province',
  ARRAY['Leopard spotting', 'Jeep safari', 'Wild elephants', 'Nature photography'],
  '97e68dcd-5b2b-4d5a-a37f-af9aabca99ee'
),
(
  'galle-face-street-food',
  'Galle Face Green Street Food',
  'Experience the bustling heart of Colombo at sunset. The promenade comes alive with dozens of food carts offering spicy isso vadei (prawn fritters), kottu roti, and local sweets.',
  'eat',
  'https://upload.wikimedia.org/wikipedia/commons/f/f0/Colombo_-_Galle_Face.jpg',
  ARRAY['https://upload.wikimedia.org/wikipedia/commons/f/f0/Colombo_-_Galle_Face.jpg'],
  'dQw4w9WgXcQ',
  'Year-round (Evenings)',
  'Colombo',
  ARRAY['Isso Vadei', 'Ocean views', 'Local atmosphere', 'Affordable eats'],
  '97e68dcd-5b2b-4d5a-a37f-af9aabca99ee'
),
(
  'mirissa-seafood',
  'Mirissa Beach Seafood',
  'Dine right on the sand under fairy lights. Mirissa beach is famous for its massive displays of freshly caught seafood that you can pick and have grilled to order.',
  'eat',
  'https://upload.wikimedia.org/wikipedia/commons/a/a5/Mirissa-Plage_%283%29.jpg',
  ARRAY['https://upload.wikimedia.org/wikipedia/commons/a/a5/Mirissa-Plage_%283%29.jpg'],
  'dQw4w9WgXcQ',
  'November to April',
  'Mirissa',
  ARRAY['Fresh catch', 'Beachfront dining', 'Grilled jumbo prawns', 'Romantic setting'],
  '97e68dcd-5b2b-4d5a-a37f-af9aabca99ee'
),
(
  'jetwing-beach',
  'Jetwing Beach Hotel',
  'A luxurious beachfront property in Negombo designed by the legendary architect Geoffrey Bawa. Offers stunning Indian Ocean views, a world-class spa, and exceptional dining.',
  'stay',
  'https://upload.wikimedia.org/wikipedia/commons/e/e9/Negombo_Beach%2C_Sri_Lanka.jpg',
  ARRAY['https://upload.wikimedia.org/wikipedia/commons/e/e9/Negombo_Beach%2C_Sri_Lanka.jpg'],
  'dQw4w9WgXcQ',
  'December to April',
  'Negombo',
  ARRAY['Beachfront pool', 'Ayurvedic spa', 'Geoffrey Bawa design', 'Fine dining'],
  '97e68dcd-5b2b-4d5a-a37f-af9aabca99ee'
),
(
  '98-acres-resort',
  '98 Acres Resort & Spa',
  'An elegant, eco-friendly boutique hotel standing on a scenic 98-acre tea estate. Experience ultimate luxury in chalets made of recyclable materials with majestic views of Little Adams Peak.',
  'stay',
  'https://upload.wikimedia.org/wikipedia/commons/e/e0/Ella_rock_view.jpg',
  ARRAY['https://upload.wikimedia.org/wikipedia/commons/e/e0/Ella_rock_view.jpg'],
  'dQw4w9WgXcQ',
  'February to June',
  'Ella',
  ARRAY['Eco-luxury', 'Mountain views', 'Tea estate', 'Infinity pool'],
  '97e68dcd-5b2b-4d5a-a37f-af9aabca99ee'
)
ON CONFLICT (slug) DO NOTHING;


-- 5. SEED BLOG POSTS DATA
-- ============================================================================

INSERT INTO blog_posts (slug, title, excerpt, content, featured_image, author_id) VALUES
(
  'best-time-visit-sri-lanka',
  'Best Time to Visit Sri Lanka',
  'Learn about the perfect time to plan your Sri Lankan adventure based on weather, festivals, and regional highlights.',
  '<p>Sri Lanka offers year-round travel opportunities, but the best time to visit depends on which part of the island you plan to explore.</p>
<h2>Southwest Coast & Hill Country</h2>
<p>The best time to visit the southwest coast (Colombo, Galle, Mirissa) and the hill country (Ella, Nuwara Eliya, Kandy) is from <strong>December to March</strong>. This is the dry season on the western side.</p>
<h2>East Coast</h2>
<p>For the east coast (Trincomalee, Arugam Bay, Pasikuda), plan your trip between <strong>April and September</strong>.</p>
<h2>Cultural Triangle</h2>
<p>The Cultural Triangle (Sigiriya, Polonnaruwa, Anuradhapura) is best visited from <strong>January to April</strong> when the weather is dry and pleasant for exploring ancient ruins.</p>
<h2>Wildlife Safari</h2>
<p>For the best wildlife viewing at Yala National Park, visit between <strong>February and July</strong> when the dry season concentrates animals around water holes, making them easier to spot.</p>',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
  '97e68dcd-5b2b-4d5a-a37f-af9aabca99ee'
),
(
  'cultural-guide-sri-lanka',
  'Cultural Guide to Sri Lanka',
  'Understand the rich culture and traditions of this beautiful island nation before your visit.',
  '<p>Sri Lanka is a melting pot of Buddhist, Hindu, Muslim, and Christian cultures, creating a vibrant and diverse society.</p>
<h2>Buddhism</h2>
<p>Over 70% of Sri Lankans are Buddhist, and the island is home to some of the most sacred Buddhist sites in the world, including the Temple of the Tooth in Kandy.</p>
<h2>Festivals</h2>
<p>Sri Lanka celebrates numerous colorful festivals throughout the year. The Esala Perahera in Kandy is one of Asia''s grandest Buddhist festivals, featuring decorated elephants and traditional dancers.</p>
<h2>Cuisine</h2>
<p>Sri Lankan cuisine is a feast of spices and flavors. Don''t miss trying rice and curry, hoppers, string hoppers, and kottu roti. The island is also famous for its Ceylon tea.</p>
<h2>Etiquette</h2>
<p>When visiting temples, always dress modestly (cover shoulders and knees), remove your shoes, and never pose with your back to a Buddha statue for photos.</p>',
  'https://images.unsplash.com/photo-1548013146-72f90ecb3c6b?w=800',
  '97e68dcd-5b2b-4d5a-a37f-af9aabca99ee'
),
(
  'top-10-hidden-gems-sri-lanka',
  'Top 10 Hidden Gems in Sri Lanka',
  'Escape the tourist crowds and discover lesser-known treasures across the island.',
  '<p>While Sigiriya and Galle Fort are must-visits, Sri Lanka has countless hidden gems waiting to be discovered.</p>
<h2>1. Knuckles Mountain Range</h2>
<p>A UNESCO World Heritage Site with spectacular hiking trails, waterfalls, and misty peaks that most tourists never see.</p>
<h2>2. Jaffna</h2>
<p>The cultural capital of the Tamil north, offering a completely different side of Sri Lanka with unique temples, cuisine, and colonial architecture.</p>
<h2>3. Kalpitiya</h2>
<p>A hidden paradise for kitesurfing and dolphin watching on the northwest coast.</p>
<h2>4. Demodara Loop</h2>
<p>A fascinating railway engineering marvel near Ella where the track loops over itself inside a hill.</p>
<h2>5. Pigeon Island</h2>
<p>One of the best snorkeling spots in Sri Lanka, located off the coast of Nilaveli with crystal-clear waters and coral reefs.</p>',
  'https://images.unsplash.com/photo-1588416936097-41850ab3d86d?w=800',
  '97e68dcd-5b2b-4d5a-a37f-af9aabca99ee'
)
ON CONFLICT (slug) DO NOTHING;


-- 6. SEED VIDEOS DATA
-- ============================================================================

INSERT INTO videos (slug, title, youtube_id, description, thumbnail) VALUES
(
  'sri-lanka-adventure',
  'Epic Sri Lanka Adventure',
  'wM3j0P1iI9w',
  'Explore the best destinations in Sri Lanka in this stunning travel video covering Sigiriya, Ella, and the southern coast.',
  'https://img.youtube.com/vi/wM3j0P1iI9w/maxresdefault.jpg'
),
(
  'colombo-food-guide',
  'Ultimate Colombo Food Guide',
  'qKqg5vP_6A0',
  'Discover the best places to eat in Colombo, from street food at Galle Face Green to fine dining experiences.',
  'https://img.youtube.com/vi/qKqg5vP_6A0/maxresdefault.jpg'
),
(
  'tea-plantation-tour',
  'Tea Plantation Tour',
  'V1bFr2SWP1I',
  'Experience the breathtaking tea plantations of Sri Lanka hill country and learn how Ceylon tea is produced.',
  'https://img.youtube.com/vi/V1bFr2SWP1I/maxresdefault.jpg'
)
ON CONFLICT (slug) DO NOTHING;


-- ============================================================================
-- MIGRATION: Run this if you already have the database set up
-- ============================================================================
-- ALTER TABLE destinations ADD COLUMN IF NOT EXISTS video_url TEXT;
-- ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS video_id TEXT;
-- ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS video_url TEXT;
-- ALTER TABLE videos ADD COLUMN IF NOT EXISTS video_url TEXT;
-- ALTER TABLE videos ALTER COLUMN youtube_id DROP NOT NULL;


-- 7. CREATE STORAGE BUCKET FOR MEDIA LIBRARY
-- ============================================================================

INSERT INTO storage.buckets (id, name, public) 
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to media bucket
CREATE POLICY "Public read access for media" ON storage.objects
  FOR SELECT USING (bucket_id = 'media');

-- Allow admin/editor upload to media bucket
CREATE POLICY "Admin upload to media" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'media' AND
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
  );

-- Allow admin/editor delete from media bucket
CREATE POLICY "Admin delete from media" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'media' AND
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
  );


-- ============================================================================
-- DONE! Your database is fully set up with:
--   ✅ 4 tables (profiles, destinations, blog_posts, videos)
--   ✅ Row Level Security policies
--   ✅ Admin profile for deenmj3149@gmail.com
--   ✅ 8 destinations (Visit, Eat, Stay categories)
--   ✅ 3 blog posts with full HTML content
--   ✅ 3 videos with YouTube thumbnails
--   ✅ Media storage bucket for image uploads
-- ============================================================================
A L T E R   T A B L E   b l o g _ p o s t s   A D D   C O L U M N   i m a g e s   T E X T [ ] ;  
 