-- ============================================
-- BATTLE ROYALE TOURNAMENT SYSTEM MIGRATION
-- ============================================
-- Run this in Supabase SQL Editor

-- 1. Add room details and tournament type to tournaments table
ALTER TABLE public.tournaments 
ADD COLUMN IF NOT EXISTS room_code TEXT,
ADD COLUMN IF NOT EXISTS room_password TEXT,
ADD COLUMN IF NOT EXISTS map_name TEXT,
ADD COLUMN IF NOT EXISTS tournament_type TEXT DEFAULT 'battle_royale', -- 'battle_royale' or 'bracket'
ADD COLUMN IF NOT EXISTS total_rounds INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS current_round INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS payment_disabled BOOLEAN DEFAULT false;

-- 2. Create tournament_kills table for live kill tracking
CREATE TABLE IF NOT EXISTS public.tournament_kills (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  tournament_id UUID REFERENCES public.tournaments(id) ON DELETE CASCADE,
  round_number INTEGER NOT NULL,
  killer_id UUID REFERENCES auth.users(id),
  victim_id UUID REFERENCES auth.users(id),
  kill_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  weapon TEXT,
  distance DECIMAL(10, 2),
  headshot BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.tournament_kills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tournament kills are viewable by everyone"
  ON public.tournament_kills FOR SELECT
  USING (true);

-- 3. Create tournament_rounds table
CREATE TABLE IF NOT EXISTS public.tournament_rounds (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  tournament_id UUID REFERENCES public.tournaments(id) ON DELETE CASCADE,
  round_number INTEGER NOT NULL,
  status TEXT DEFAULT 'pending', -- pending, in_progress, completed
  start_time TIMESTAMP WITH TIME ZONE,
  end_time TIMESTAMP WITH TIME ZONE,
  winner_id UUID REFERENCES auth.users(id),
  map_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(tournament_id, round_number)
);

ALTER TABLE public.tournament_rounds ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tournament rounds are viewable by everyone"
  ON public.tournament_rounds FOR SELECT
  USING (true);

-- 4. Update tournament_participants table
ALTER TABLE public.tournament_participants
ADD COLUMN IF NOT EXISTS placement INTEGER, -- Final placement in tournament
ADD COLUMN IF NOT EXISTS total_kills INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_damage DECIMAL(10, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS survival_time INTEGER DEFAULT 0, -- in seconds
ADD COLUMN IF NOT EXISTS round_placements JSONB DEFAULT '[]'::jsonb; -- Array of placements per round

-- 5. Create live_tournament_events table for real-time updates
CREATE TABLE IF NOT EXISTS public.live_tournament_events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  tournament_id UUID REFERENCES public.tournaments(id) ON DELETE CASCADE,
  round_number INTEGER NOT NULL,
  event_type TEXT NOT NULL, -- 'kill', 'death', 'placement', 'round_start', 'round_end'
  player_id UUID REFERENCES auth.users(id),
  data JSONB, -- Flexible field for event-specific data
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.live_tournament_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Live events are viewable by everyone"
  ON public.live_tournament_events FOR SELECT
  USING (true);

-- 6. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tournament_kills_tournament ON public.tournament_kills(tournament_id);
CREATE INDEX IF NOT EXISTS idx_tournament_kills_round ON public.tournament_kills(tournament_id, round_number);
CREATE INDEX IF NOT EXISTS idx_tournament_rounds_tournament ON public.tournament_rounds(tournament_id);
CREATE INDEX IF NOT EXISTS idx_live_events_tournament ON public.live_tournament_events(tournament_id);
CREATE INDEX IF NOT EXISTS idx_live_events_round ON public.live_tournament_events(tournament_id, round_number);

-- 7. Create function to calculate tournament leaderboard
CREATE OR REPLACE FUNCTION get_tournament_leaderboard(tournament_uuid UUID)
RETURNS TABLE (
  user_id UUID,
  username TEXT,
  avatar_url TEXT,
  total_kills INTEGER,
  placement INTEGER,
  total_damage DECIMAL,
  survival_time INTEGER,
  score INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    tp.user_id,
    p.username,
    p.avatar_url,
    tp.total_kills,
    tp.placement,
    tp.total_damage,
    tp.survival_time,
    tp.score
  FROM public.tournament_participants tp
  JOIN public.profiles p ON tp.user_id = p.id
  WHERE tp.tournament_id = tournament_uuid
  ORDER BY tp.score DESC, tp.total_kills DESC, tp.placement ASC;
END;
$$ LANGUAGE plpgsql;

-- 8. Create function to get live kill feed
CREATE OR REPLACE FUNCTION get_tournament_kill_feed(tournament_uuid UUID, limit_count INTEGER DEFAULT 20)
RETURNS TABLE (
  id UUID,
  killer_username TEXT,
  killer_avatar TEXT,
  victim_username TEXT,
  victim_avatar TEXT,
  weapon TEXT,
  distance DECIMAL,
  headshot BOOLEAN,
  kill_time TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    tk.id,
    p1.username as killer_username,
    p1.avatar_url as killer_avatar,
    p2.username as victim_username,
    p2.avatar_url as victim_avatar,
    tk.weapon,
    tk.distance,
    tk.headshot,
    tk.kill_time
  FROM public.tournament_kills tk
  LEFT JOIN public.profiles p1 ON tk.killer_id = p1.id
  LEFT JOIN public.profiles p2 ON tk.victim_id = p2.id
  WHERE tk.tournament_id = tournament_uuid
  ORDER BY tk.kill_time DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- 9. Create trigger to update participant kills count
CREATE OR REPLACE FUNCTION update_participant_kills()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Increment killer's kill count
    UPDATE public.tournament_participants
    SET total_kills = total_kills + 1
    WHERE tournament_id = NEW.tournament_id AND user_id = NEW.killer_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tournament_kill_counter
  AFTER INSERT ON public.tournament_kills
  FOR EACH ROW
  EXECUTE FUNCTION update_participant_kills();

-- 10. Add admin role check (if not exists)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE user_role AS ENUM ('user', 'admin', 'moderator');
  END IF;
END$$;

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Battle Royale Tournament System migration completed successfully!';
END$$;
