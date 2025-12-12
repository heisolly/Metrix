-- Match Creation Verification Script
-- Run this in Supabase SQL Editor to check if matches are being created

-- 1. Check all matches in the database
SELECT 
    id,
    tournament_id,
    round,
    match_number,
    match_code,
    player1_id,
    player2_id,
    spectator_id,
    scheduled_time,
    status,
    created_at
FROM public.matches
ORDER BY created_at DESC
LIMIT 20;

-- 2. Check matches with player names (using profiles)
SELECT 
    m.id,
    m.match_code,
    m.round,
    m.match_number,
    p1.username as player1_name,
    p1.email as player1_email,
    p2.username as player2_name,
    p2.email as player2_email,
    m.scheduled_time,
    m.status,
    m.created_at
FROM public.matches m
LEFT JOIN public.profiles p1 ON m.player1_id = p1.id
LEFT JOIN public.profiles p2 ON m.player2_id = p2.id
ORDER BY m.created_at DESC
LIMIT 10;

-- 3. Count total matches
SELECT COUNT(*) as total_matches FROM public.matches;

-- 4. Count matches by status
SELECT status, COUNT(*) as count
FROM public.matches
GROUP BY status;

-- 5. Check if a specific tournament has matches
-- Replace 'your-tournament-id' with actual tournament ID
-- SELECT * FROM public.matches WHERE tournament_id = 'your-tournament-id';

-- 6. Check for any errors in recent match inserts
-- Look for matches created in the last hour
SELECT *
FROM public.matches
WHERE created_at > NOW() - INTERVAL '1 hour'
ORDER BY created_at DESC;

-- 7. Check if all required columns exist
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'matches'
ORDER BY ordinal_position;
