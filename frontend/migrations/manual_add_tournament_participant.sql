-- Manual Fix: Add User to Tournament After Payment
-- Run this in Supabase SQL Editor to manually add a user who paid but wasn't registered

-- STEP 1: Find the user and tournament
-- Replace 'user_email@example.com' with the actual user email
-- Replace 'Tournament Name' with the actual tournament name

SELECT 
  p.id as user_id,
  p.username,
  p.email,
  t.id as tournament_id,
  t.name as tournament_name,
  t.entry_fee
FROM profiles p
CROSS JOIN tournaments t
WHERE p.email = 'user_email@example.com'  -- CHANGE THIS
  AND t.name ILIKE '%Tournament Name%';    -- CHANGE THIS

-- STEP 2: After confirming the IDs above, manually add to tournament
-- Replace the UUIDs with actual values from STEP 1

INSERT INTO tournament_participants (
  tournament_id,
  user_id,
  status,
  payment_reference,
  created_at
) VALUES (
  'tournament-uuid-here',  -- From STEP 1
  'user-uuid-here',        -- From STEP 1
  'registered',
  'MANUAL-ALATPAY-' || NOW()::TEXT,  -- Manual reference
  NOW()
)
ON CONFLICT (tournament_id, user_id) DO NOTHING;

-- STEP 3: Update tournament participant count
UPDATE tournaments
SET current_participants = current_participants + 1
WHERE id = 'tournament-uuid-here';  -- From STEP 1

-- STEP 4: Verify the user was added
SELECT 
  tp.*,
  p.username,
  t.name as tournament_name
FROM tournament_participants tp
JOIN profiles p ON tp.user_id = p.id
JOIN tournaments t ON tp.tournament_id = t.id
WHERE tp.user_id = 'user-uuid-here'  -- From STEP 1
  AND tp.tournament_id = 'tournament-uuid-here';  -- From STEP 1
