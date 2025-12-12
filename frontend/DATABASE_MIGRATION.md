# Metrix Database Migration - Safe Update

Run this SQL in your Supabase SQL Editor. It will safely add missing tables and columns without errors.

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- UPDATE PROFILES TABLE (Add missing columns)
-- ============================================
DO
BEGIN
  -- Add rank column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='profiles' AND column_name='rank') THEN
    ALTER TABLE public.profiles ADD COLUMN rank INTEGER DEFAULT 0;
  END IF;

  -- Add total_earnings column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='profiles' AND column_name='total_earnings') THEN
    ALTER TABLE public.profiles ADD COLUMN total_earnings DECIMAL(10, 2) DEFAULT 0;
  END IF;

  -- Add available_balance column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='profiles' AND column_name='available_balance') THEN
    ALTER TABLE public.profiles ADD COLUMN available_balance DECIMAL(10, 2) DEFAULT 0;
  END IF;

  -- Add pending_balance column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='profiles' AND column_name='pending_balance') THEN
    ALTER TABLE public.profiles ADD COLUMN pending_balance DECIMAL(10, 2) DEFAULT 0;
  END IF;

  -- Add bio column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='profiles' AND column_name='bio') THEN
    ALTER TABLE public.profiles ADD COLUMN bio TEXT;
  END IF;

  -- Add region column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='profiles' AND column_name='region') THEN
    ALTER TABLE public.profiles ADD COLUMN region TEXT;
  END IF;

  -- Add preferred_games column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='profiles' AND column_name='preferred_games') THEN
    ALTER TABLE public.profiles ADD COLUMN preferred_games TEXT[];
  END IF;
END ;

-- ============================================
-- TOURNAMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.tournaments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  game TEXT NOT NULL,
  description TEXT,
  prize_pool DECIMAL(10, 2) NOT NULL,
  entry_fee DECIMAL(10, 2) NOT NULL,
  max_participants INTEGER NOT NULL,
  current_participants INTEGER DEFAULT 0,
  status TEXT DEFAULT 'upcoming',
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE,
  region TEXT,
  mode TEXT,
  rules TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.tournaments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Tournaments are viewable by everyone" ON public.tournaments;
CREATE POLICY "Tournaments are viewable by everyone"
  ON public.tournaments FOR SELECT
  USING (true);

-- ============================================
-- TOURNAMENT PARTICIPANTS
-- ============================================
CREATE TABLE IF NOT EXISTS public.tournament_participants (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  tournament_id UUID REFERENCES public.tournaments(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  rank INTEGER,
  kills INTEGER DEFAULT 0,
  score INTEGER DEFAULT 0,
  prize_won DECIMAL(10, 2) DEFAULT 0,
  status TEXT DEFAULT 'registered',
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(tournament_id, user_id)
);

ALTER TABLE public.tournament_participants ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Participants are viewable by everyone" ON public.tournament_participants;
CREATE POLICY "Participants are viewable by everyone"
  ON public.tournament_participants FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can join tournaments" ON public.tournament_participants;
CREATE POLICY "Users can join tournaments"
  ON public.tournament_participants FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own participation" ON public.tournament_participants;
CREATE POLICY "Users can update own participation"
  ON public.tournament_participants FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================
-- MATCHES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.matches (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  tournament_id UUID REFERENCES public.tournaments(id) ON DELETE CASCADE,
  player1_id UUID REFERENCES auth.users(id),
  player2_id UUID,
  spectator_id UUID REFERENCES auth.users(id),
  match_code TEXT,
  scheduled_time TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'scheduled',
  winner_id UUID,
  player1_score INTEGER,
  player2_score INTEGER,
  result_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Matches are viewable by participants" ON public.matches;
CREATE POLICY "Matches are viewable by participants"
  ON public.matches FOR SELECT
  USING (auth.uid() = player1_id OR auth.uid() = player2_id OR auth.uid() = spectator_id);

-- ============================================
-- TRANSACTIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  description TEXT,
  tournament_id UUID REFERENCES public.tournaments(id),
  status TEXT DEFAULT 'completed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own transactions" ON public.transactions;
CREATE POLICY "Users can view own transactions"
  ON public.transactions FOR SELECT
  USING (auth.uid() = user_id);

-- ============================================
-- WITHDRAWAL REQUESTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.withdrawal_requests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  account_name TEXT NOT NULL,
  account_number TEXT NOT NULL,
  bank_name TEXT NOT NULL,
  routing_number TEXT,
  status TEXT DEFAULT 'pending',
  request_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_date TIMESTAMP WITH TIME ZONE,
  notes TEXT
);

ALTER TABLE public.withdrawal_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own withdrawal requests" ON public.withdrawal_requests;
CREATE POLICY "Users can view own withdrawal requests"
  ON public.withdrawal_requests FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create withdrawal requests" ON public.withdrawal_requests;
CREATE POLICY "Users can create withdrawal requests"
  ON public.withdrawal_requests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- NOTIFICATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT,
  read BOOLEAN DEFAULT false,
  link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;
CREATE POLICY "Users can view own notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;
CREATE POLICY "Users can update own notifications"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================
-- USER SETTINGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.user_settings (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  notifications_tournaments BOOLEAN DEFAULT true,
  notifications_matches BOOLEAN DEFAULT true,
  notifications_messages BOOLEAN DEFAULT false,
  notifications_marketing BOOLEAN DEFAULT false,
  theme TEXT DEFAULT 'dark',
  language TEXT DEFAULT 'en',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own settings" ON public.user_settings;
CREATE POLICY "Users can view own settings"
  ON public.user_settings FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own settings" ON public.user_settings;
CREATE POLICY "Users can insert own settings"
  ON public.user_settings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own settings" ON public.user_settings;
CREATE POLICY "Users can update own settings"
  ON public.user_settings FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================
-- TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
 LANGUAGE plpgsql;

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
DROP TRIGGER IF EXISTS update_tournaments_updated_at ON public.tournaments;
DROP TRIGGER IF EXISTS update_matches_updated_at ON public.matches;
DROP TRIGGER IF EXISTS update_user_settings_updated_at ON public.user_settings;

-- Create triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tournaments_updated_at
  BEFORE UPDATE ON public.tournaments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_matches_updated_at
  BEFORE UPDATE ON public.matches
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at
  BEFORE UPDATE ON public.user_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to create user settings on signup
CREATE OR REPLACE FUNCTION public.handle_new_user_settings()
RETURNS TRIGGER AS
BEGIN
  INSERT INTO public.user_settings (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
 LANGUAGE plpgsql SECURITY DEFINER;

-- Drop and recreate trigger for new users
DROP TRIGGER IF EXISTS on_auth_user_created_settings ON auth.users;
CREATE TRIGGER on_auth_user_created_settings
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_settings();

-- Function to update tournament participant count
CREATE OR REPLACE FUNCTION update_tournament_participants_count()
RETURNS TRIGGER AS
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.tournaments
    SET current_participants = current_participants + 1
    WHERE id = NEW.tournament_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.tournaments
    SET current_participants = current_participants - 1
    WHERE id = OLD.tournament_id;
  END IF;
  RETURN NULL;
END;
 LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_tournament_count ON public.tournament_participants;
CREATE TRIGGER update_tournament_count
  AFTER INSERT OR DELETE ON public.tournament_participants
  FOR EACH ROW
  EXECUTE FUNCTION update_tournament_participants_count();

-- ============================================
-- VIEWS
-- ============================================

-- Drop existing views
DROP VIEW IF EXISTS public.leaderboard;
DROP VIEW IF EXISTS public.user_stats;

-- Leaderboard view
CREATE VIEW public.leaderboard AS
SELECT
  p.id,
  p.username,
  p.full_name,
  p.avatar_url,
  p.rank,
  p.total_earnings,
  COUNT(DISTINCT tp.tournament_id) AS tournaments_played,
  SUM(CASE WHEN tp.rank = 1 THEN 1 ELSE 0 END) AS wins,
  ROUND(
    CASE
      WHEN COUNT(DISTINCT tp.tournament_id) > 0
      THEN (SUM(CASE WHEN tp.rank = 1 THEN 1 ELSE 0 END)::DECIMAL / COUNT(DISTINCT tp.tournament_id)::DECIMAL) * 100
      ELSE 0
    END,
    2
  ) AS win_rate
FROM public.profiles p
LEFT JOIN public.tournament_participants tp ON p.id = tp.user_id AND tp.status = 'completed'
GROUP BY p.id, p.username, p.full_name, p.avatar_url, p.rank, p.total_earnings
ORDER BY p.total_earnings DESC, wins DESC;

-- User stats view
CREATE VIEW public.user_stats AS
SELECT
  p.id,
  p.username,
  COUNT(DISTINCT tp.tournament_id) AS tournaments_played,
  SUM(CASE WHEN tp.rank = 1 THEN 1 ELSE 0 END) AS wins,
  SUM(CASE WHEN tp.rank <= 3 THEN 1 ELSE 0 END) AS podium_finishes,
  ROUND(
    CASE
      WHEN COUNT(DISTINCT tp.tournament_id) > 0
      THEN (SUM(CASE WHEN tp.rank = 1 THEN 1 ELSE 0 END)::DECIMAL / COUNT(DISTINCT tp.tournament_id)::DECIMAL) * 100
      ELSE 0
    END,
    2
  ) AS win_rate,
  COALESCE(SUM(tp.prize_won), 0) AS total_earnings,
  COALESCE(AVG(tp.kills), 0) AS avg_kills,
  COALESCE(AVG(tp.rank), 0) AS avg_placement
FROM public.profiles p
LEFT JOIN public.tournament_participants tp ON p.id = tp.user_id AND tp.status = 'completed'
GROUP BY p.id, p.username;

-- Grant permissions on views
GRANT SELECT ON public.leaderboard TO authenticated;
GRANT SELECT ON public.user_stats TO authenticated;
```

## ✅ This migration script:

- Safely adds missing columns to existing profiles table
- Creates all other tables with IF NOT EXISTS
- Drops and recreates policies to avoid conflicts
- Drops and recreates triggers
- Drops and recreates views
- Won't cause errors if run multiple times
