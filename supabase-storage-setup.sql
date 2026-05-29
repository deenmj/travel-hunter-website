-- ============================================================================
-- TRAVEL HUNTER - STORAGE BUCKET SETUP (run once in Supabase SQL Editor)
-- Fixes: "Bucket not found" when uploading images/videos in admin
-- ============================================================================

-- 1. Create the public media bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Storage policies (drop first if re-running)
DROP POLICY IF EXISTS "Public read access for media" ON storage.objects;
DROP POLICY IF EXISTS "Admin upload to media" ON storage.objects;
DROP POLICY IF EXISTS "Admin update media" ON storage.objects;
DROP POLICY IF EXISTS "Admin delete from media" ON storage.objects;

-- Anyone can view uploaded files (public bucket)
CREATE POLICY "Public read access for media" ON storage.objects
  FOR SELECT USING (bucket_id = 'media');

-- Logged-in admins/editors can upload
CREATE POLICY "Admin upload to media" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'media' AND
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
  );

-- Admins/editors can replace/update files
CREATE POLICY "Admin update media" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'media' AND
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
  );

-- Admins/editors can delete files
CREATE POLICY "Admin delete from media" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'media' AND
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
  );

-- ============================================================================
-- DONE! Try uploading again in Admin → Destinations → Edit → Featured Image
-- ============================================================================
