# Metrix Database Schema for Supabase

Run this SQL in your Supabase SQL Editor to create all necessary tables and functions.

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROFILES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  region TEXT,
  preferred_games TEXT[],
  rank INTEGER DEFAULT 0,
  total_earnings DECIMAL(10, 2) DEFAULT 0,
  available_balance DECIMAL(10, 2) DEFAULT 0,
  pending_balance DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

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
  status TEXT DEFAULT 'upcoming', -- upcoming, ongoing, completed
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE,
  region TEXT,
  mode TEXT, -- solo, duo, squad
  rules TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.tournaments ENABLE ROW LEVEL SECURITY;

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
  status TEXT DEFAULT 'registered', -- registered, playing, completed, disqualified
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(tournament_id, user_id)
);

ALTER TABLE public.tournament_participants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Participants are viewable by everyone"
  ON public.tournament_participants FOR SELECT
  USING (true);

CREATE POLICY "Users can join tournaments"
  ON public.tournament_participants FOR INSERT
  WITH CHECK (auth.uid() = user_id);

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
  status TEXT DEFAULT 'scheduled', -- scheduled, in_progress, waiting_verification, completed, disputed
  winner_id UUID,
  player1_score INTEGER,
  player2_score INTEGER,
  result_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Matches are viewable by participants"
  ON public.matches FOR SELECT
  USING (auth.uid() = player1_id OR auth.uid() = player2_id OR auth.uid() = spectator_id);

-- ============================================
-- TRANSACTIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- prize, entry, withdrawal, deposit
  amount DECIMAL(10, 2) NOT NULL,
  description TEXT,
  tournament_id UUID REFERENCES public.tournaments(id),
  status TEXT DEFAULT 'completed', -- pending, completed, failed
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

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
  status TEXT DEFAULT 'pending', -- pending, processing, completed, failed
  request_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_date TIMESTAMP WITH TIME ZONE,
  notes TEXT
);

ALTER TABLE public.withdrawal_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own withdrawal requests"
  ON public.withdrawal_requests FOR SELECT
  USING (auth.uid() = user_id);

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
  type TEXT, -- tournament, match, system, prize
  read BOOLEAN DEFAULT false,
  link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

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
  theme TEXT DEFAULT 'dark', -- dark, light, system
  language TEXT DEFAULT 'en',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own settings"
  ON public.user_settings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own settings"
  ON public.user_settings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own settings"
  ON public.user_settings FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
 LANGUAGE plpgsql;

-- Triggers for updated_at
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

-- Function to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);

  INSERT INTO public.user_settings (user_id)
  VALUES (NEW.id);

  RETURN NEW;
END;
 LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

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

CREATE TRIGGER update_tournament_count
  AFTER INSERT OR DELETE ON public.tournament_participants
  FOR EACH ROW
  EXECUTE FUNCTION update_tournament_participants_count();

-- ============================================
-- VIEWS
-- ============================================

-- Leaderboard view
CREATE OR REPLACE VIEW public.leaderboard AS
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
CREATE OR REPLACE VIEW public.user_stats AS
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
```

## Next Steps:

1. Run this SQL in your Supabase SQL Editor
2. The database will automatically create profiles and settings when users sign up
3. All tables have Row Level Security enabled
4. Triggers handle automatic updates (participant counts, timestamps, etc.)
