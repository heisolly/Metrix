-- Admin Setup Script
-- Run this in Supabase SQL Editor to set up admin access

-- 1. Ensure is_admin column exists
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

-- 2. Make your user an admin (REPLACE WITH YOUR EMAIL)
-- Option A: Using email
UPDATE public.profiles 
SET is_admin = TRUE 
WHERE email = 'your-email@example.com';

-- Option B: Using user ID
-- UPDATE public.profiles 
-- SET is_admin = TRUE 
-- WHERE id = 'your-user-id-here';

-- 3. Verify admin status
SELECT id, email, username, is_admin 
FROM public.profiles 
WHERE is_admin = TRUE;

-- 4. (Optional) Create an admin user if you don't have an account yet
-- First sign up normally at /signup, then run:
-- UPDATE public.profiles SET is_admin = TRUE WHERE email = 'new-admin@example.com';

-- NOTES:
-- - Replace 'your-email@example.com' with your actual email
-- - You must have an account created first (sign up normally)
-- - After setting is_admin = TRUE, sign in at /admin/signin
-- - Regular users should still use /signin
