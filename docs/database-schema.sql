-- Metrix Platform Database Schema
-- Created for Supabase PostgreSQL

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User roles enum
CREATE TYPE user_role AS ENUM ('player', 'spectator', 'admin', 'organizer');

-- Tournament status enum
CREATE TYPE tournament_status AS ENUM ('draft', 'open', 'ongoing', 'completed', 'cancelled');

-- Match status enum
CREATE TYPE match_status AS ENUM ('scheduled', 'live', 'completed', 'disputed', 'cancelled');

-- Payment status enum
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(100),
  phone VARCHAR(20),
  avatar_url TEXT,
  role user_role NOT NULL DEFAULT 'player',
  region VARCHAR(50),
  bio TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Games table
CREATE TABLE public.games (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  icon_url TEXT,
  platforms TEXT[], -- e.g., ['PS5', 'Xbox Series X', 'PC']
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tournaments table
CREATE TABLE public.tournaments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  game_id UUID REFERENCES public.games(id) ON DELETE CASCADE,
  organizer_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  entry_fee DECIMAL(10, 2) NOT NULL DEFAULT 0,
  prize_pool DECIMAL(12, 2),
  max_players INTEGER NOT NULL,
  current_players INTEGER DEFAULT 0,
  format VARCHAR(50), -- e.g., 'Single Elimination', 'Double Elimination'
  region VARCHAR(50),
  start_time TIMESTAMP WITH TIME ZONE,
  end_time TIMESTAMP WITH TIME ZONE,
  status tournament_status DEFAULT 'draft',
  rules TEXT,
  bracket_data JSONB, -- Tournament bracket structure
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tournament participants
CREATE TABLE public.tournament_participants (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  tournament_id UUID REFERENCES public.tournaments(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  entry_fee_paid BOOLEAN DEFAULT FALSE,
  payment_status payment_status DEFAULT 'pending',
  payment_reference VARCHAR(100),
  placement INTEGER,
  prize_won DECIMAL(10, 2),
  registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(tournament_id, user_id)
);

-- Matches table
CREATE TABLE public.matches (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  tournament_id UUID REFERENCES public.tournaments(id) ON DELETE CASCADE,
  round_number INTEGER NOT NULL,
  match_number INTEGER NOT NULL,
  player1_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  player2_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  spectator_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  scheduled_time TIMESTAMP WITH TIME ZONE,
  start_time TIMESTAMP WITH TIME ZONE,
  end_time TIMESTAMP WITH TIME ZONE,
  status match_status DEFAULT 'scheduled',
  player1_score INTEGER,
  player2_score INTEGER,
  winner_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  match_data JSONB, -- Additional match details
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Match results verification
CREATE TABLE public.match_results (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  match_id UUID REFERENCES public.matches(id) ON DELETE CASCADE,
  spectator_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  player1_score INTEGER NOT NULL,
  player2_score INTEGER NOT NULL,
  player1_kills INTEGER,
  player2_kills INTEGER,
  player1_deaths INTEGER,
  player2_deaths INTEGER,
  duration_minutes INTEGER,
  notes TEXT,
  screenshots TEXT[], -- Array of screenshot URLs
  video_url TEXT,
  confidence_level VARCHAR(20), -- 'very_confident', 'confident', 'somewhat_confident'
  base_payment DECIMAL(8, 2),
  speed_bonus DECIMAL(8, 2) DEFAULT 0,
  accuracy_bonus DECIMAL(8, 2) DEFAULT 0,
  total_payment DECIMAL(8, 2),
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'verified', 'rejected'
  verified_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Disputes table
CREATE TABLE public.disputes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  match_id UUID REFERENCES public.matches(id) ON DELETE CASCADE,
  raised_by UUID REFERENCES public.users(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  evidence TEXT[], -- Screenshots, videos
  status VARCHAR(20) DEFAULT 'open', -- 'open', 'under_review', 'resolved', 'appealed'
  resolution VARCHAR(20), -- 'confirm_spectator', 'overturn_result', 'refund_both'
  admin_notes TEXT,
  resolved_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Wallet/Transactions table
CREATE TABLE public.wallets (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  balance DECIMAL(12, 2) DEFAULT 0,
  pending_balance DECIMAL(12, 2) DEFAULT 0,
  total_earned DECIMAL(12, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Transactions table
CREATE TABLE public.transactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  wallet_id UUID REFERENCES public.wallets(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL, -- 'deposit', 'withdrawal', 'prize', 'fee', 'bonus'
  amount DECIMAL(10, 2) NOT NULL,
  description TEXT,
  reference VARCHAR(100),
  status payment_status DEFAULT 'pending',
  tournament_id UUID REFERENCES public.tournaments(id) ON DELETE SET NULL,
  match_id UUID REFERENCES public.matches(id) ON DELETE SET NULL,
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Spectator applications
CREATE TABLE public.spectator_applications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  experience_years INTEGER,
  games_expertise TEXT[], -- Array of game names
  availability VARCHAR(20), -- 'flexible', 'part_time', 'full_time'
  hours_per_week INTEGER,
  portfolio_links TEXT[],
  why_join TEXT,
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  reviewed_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  review_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Spectator performance metrics
CREATE TABLE public.spectator_metrics (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  spectator_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  total_matches_spectated INTEGER DEFAULT 0,
  accuracy_rate DECIMAL(5, 2) DEFAULT 0,
  average_rating DECIMAL(3, 2) DEFAULT 0,
  certification_level VARCHAR(20) DEFAULT 'beginner', -- 'beginner', 'intermediate', 'expert'
  total_earned DECIMAL(12, 2) DEFAULT 0,
  disputes_handled INTEGER DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(spectator_id)
);

-- System settings
CREATE TABLE public.system_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  key VARCHAR(100) UNIQUE NOT NULL,
  value TEXT,
  description TEXT,
  updated_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit log
CREATE TABLE public.audit_log (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  action VARCHAR(50) NOT NULL,
  table_name VARCHAR(50),
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_username ON public.users(username);
CREATE INDEX idx_users_role ON public.users(role);
CREATE INDEX idx_tournaments_status ON public.tournaments(status);
CREATE INDEX idx_tournaments_game_id ON public.tournaments(game_id);
CREATE INDEX idx_tournament_participants_tournament_id ON public.tournament_participants(tournament_id);
CREATE INDEX idx_tournament_participants_user_id ON public.tournament_participants(user_id);
CREATE INDEX idx_matches_tournament_id ON public.matches(tournament_id);
CREATE INDEX idx_matches_status ON public.matches(status);
CREATE INDEX idx_matches_spectator_id ON public.matches(spectator_id);
CREATE INDEX idx_transactions_wallet_id ON public.transactions(wallet_id);
CREATE INDEX idx_transactions_status ON public.transactions(status);
CREATE INDEX idx_wallets_user_id ON public.wallets(user_id);

-- Functions and triggers
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, username, email, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', NEW.email),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
  );
  
  -- Create wallet for new user
  INSERT INTO public.wallets (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile and wallet on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update updated_at timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tournaments_updated_at BEFORE UPDATE ON public.tournaments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_matches_updated_at BEFORE UPDATE ON public.matches
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_wallets_updated_at BEFORE UPDATE ON public.wallets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Row Level Security (RLS) Policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tournament_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.match_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.spectator_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.spectator_metrics ENABLE ROW LEVEL SECURITY;

-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Everyone can view tournaments
CREATE POLICY "Tournaments are viewable by everyone" ON public.tournaments
  FOR SELECT USING (true);

-- Only organizers and admins can create tournaments
CREATE POLICY "Only organizers and admins can create tournaments" ON public.tournaments
  FOR INSERT WITH CHECK (
    auth.uid() = organizer_id OR 
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- Tournament participants can view their participation
CREATE POLICY "Users can view own tournament participation" ON public.tournament_participants
  FOR SELECT USING (auth.uid() = user_id);

-- Users can view matches they're involved in
CREATE POLICY "Users can view own matches" ON public.matches
  FOR SELECT USING (
    auth.uid() = player1_id OR 
    auth.uid() = player2_id OR 
    auth.uid() = spectator_id OR
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'spectator'))
  );

-- Spectators can view assigned matches
CREATE POLICY "Spectators can view assigned matches" ON public.matches
  FOR SELECT USING (auth.uid() = spectator_id);

-- Users can view own wallet
CREATE POLICY "Users can view own wallet" ON public.wallets
  FOR SELECT USING (auth.uid() = user_id);

-- Users can view own transactions
CREATE POLICY "Users can view own transactions" ON public.transactions
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.wallets WHERE id = wallet_id AND user_id = auth.uid())
  );

-- Insert initial data
INSERT INTO public.games (name, slug, description, platforms) VALUES
('Call of Duty', 'cod', 'Popular first-person shooter game', ARRAY['PS5', 'Xbox Series X', 'PC']),
('Valorant', 'valorant', 'Tactical 5v5 shooter game', ARRAY['PC']),
('FIFA', 'fifa', 'Football simulation game', ARRAY['PS5', 'Xbox Series X', 'PC']),
('Fortnite', 'fortnite', 'Battle royale game', ARRAY['PS5', 'Xbox Series X', 'PC', 'Nintendo Switch']);

-- Insert system settings
INSERT INTO public.system_settings (key, value, description) VALUES
('commission_rate', '20', 'Percentage of entry fees taken as commission'),
('spectator_base_pay', '3500', 'Base payment for spectators per match in Naira'),
('speed_bonus_percentage', '20', 'Speed bonus percentage for quick result submission'),
('min_withdrawal_amount', '1000', 'Minimum withdrawal amount in Naira'),
('max_players_per_tournament', '32', 'Maximum players allowed in a tournament');
