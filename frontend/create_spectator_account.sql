-- Create Spectator Account
-- Run this in Supabase SQL Editor

-- 1. First, create the user account in Supabase Auth Dashboard:
--    - Go to Authentication > Users
--    - Click "Add User"
--    - Email: spectator_olly@metrix.com
--    - Password: Spectate1.
--    - Auto Confirm User: YES
--    - Copy the User ID after creation

-- 2. Then run this SQL to create the profile:
-- Replace 'USER_ID_HERE' with the actual UUID from step 1

INSERT INTO profiles (id, username, full_name, role, created_at, updated_at)
VALUES (
  'USER_ID_HERE', -- Replace with actual user ID from Auth
  'Spectator_Olly',
  'Spectator Olly',
  'spectator',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE
SET 
  username = 'Spectator_Olly',
  full_name = 'Spectator Olly',
  role = 'spectator';

-- 3. Verify the account was created:
SELECT id, username, full_name, role FROM profiles WHERE username = 'Spectator_Olly';

-- Note: The spectator can now login with:
-- Email: spectator_olly@metrix.com
-- Password: Spectate1.
