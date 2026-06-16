-- ============================================================================
-- TRAVEL HUNTER - ADMIN SECURITY PATCH
-- Run this in your Supabase SQL Editor to secure your live database
-- ============================================================================

-- 1. Change the default role for new users to 'user' instead of 'editor'
ALTER TABLE profiles ALTER COLUMN role SET DEFAULT 'user';

-- 2. Downgrade any unauthorized users who currently have 'editor' role to 'user'
-- Only 'deenmj3149@gmail.com' (and any other manually approved admins) should remain admin.
-- If you have other legitimate admins, add their emails to the IN list below.
UPDATE profiles 
SET role = 'user' 
WHERE role = 'editor' 
  AND email NOT IN ('deenmj3149@gmail.com');

-- (Optional) If you want to see who you just downgraded, you can run:
-- SELECT email, role FROM profiles WHERE role = 'user';
