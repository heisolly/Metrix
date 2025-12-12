# Admin Panel Database Schema

Add these tables to your Supabase database for the admin panel.

```sql
-- ============================================
-- ADMIN ROLES & PERMISSIONS
-- ============================================

-- Add admin role to profiles
DO
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='profiles' AND column_name='role') THEN
    ALTER TABLE public.profiles ADD COLUMN role TEXT DEFAULT 'player';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='profiles' AND column_name='is_admin') THEN
    ALTER TABLE public.profiles ADD COLUMN is_admin BOOLEAN DEFAULT false;
  END IF;
END ;

-- ============================================
-- SPECTATORS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.spectators (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending', -- pending, active, suspended
  level TEXT DEFAULT 'beginner', -- beginner, intermediate, expert
  games TEXT[] DEFAULT '{}',
  experience TEXT,
  youtube_link TEXT,
  twitch_link TEXT,
  matches_completed INTEGER DEFAULT 0,
  accuracy_rate DECIMAL(5, 2) DEFAULT 0,
  disputes_count INTEGER DEFAULT 0,
  total_earned DECIMAL(10, 2) DEFAULT 0,
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  approved_at TIMESTAMP WITH TIME ZONE,
  approved_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.spectators ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Spectators viewable by authenticated users"
  ON public.spectators FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can apply as spectator"
  ON public.spectators FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- DISPUTES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.disputes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  match_id UUID REFERENCES public.matches(id) ON DELETE CASCADE,
  tournament_id UUID REFERENCES public.tournaments(id),
  complaining_player_id UUID REFERENCES auth.users(id),
  spectator_id UUID REFERENCES auth.users(id),
  reason TEXT NOT NULL,
  player_evidence TEXT[], -- URLs to screenshots/videos
  spectator_notes TEXT,
  spectator_evidence TEXT[],
  status TEXT DEFAULT 'open', -- open, under_review, resolved, rejected
  resolution TEXT,
  resolved_by UUID REFERENCES auth.users(id),
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.disputes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Disputes viewable by involved parties"
  ON public.disputes FOR SELECT
  TO authenticated
  USING (
    auth.uid() = complaining_player_id OR
    auth.uid() = spectator_id OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

CREATE POLICY "Players can create disputes"
  ON public.disputes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = complaining_player_id);

-- ============================================
-- PLATFORM SETTINGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.platform_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  setting_key TEXT UNIQUE NOT NULL,
  setting_value TEXT,
  description TEXT,
  updated_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Settings viewable by admins"
  ON public.platform_settings FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

CREATE POLICY "Settings updatable by admins"
  ON public.platform_settings FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

-- Insert default settings
INSERT INTO public.platform_settings (setting_key, setting_value, description) VALUES
  ('platform_commission', '10', 'Platform commission percentage'),
  ('default_spectator_pay', '5', 'Default spectator pay per match'),
  ('dispute_deadline_hours', '24', 'Hours to file a dispute after match'),
  ('min_withdrawal_amount', '10', 'Minimum withdrawal amount')
ON CONFLICT (setting_key) DO NOTHING;

-- ============================================
-- ADMIN ACTIVITY LOG
-- ============================================
CREATE TABLE IF NOT EXISTS public.admin_activity_log (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  admin_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  target_type TEXT, -- user, tournament, match, dispute, etc
  target_id UUID,
  details JSONB,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.admin_activity_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Activity log viewable by admins"
  ON public.admin_activity_log FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

-- ============================================
-- ANNOUNCEMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.announcements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  tournament_id UUID REFERENCES public.tournaments(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info', -- info, warning, urgent
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Announcements viewable by tournament participants"
  ON public.announcements FOR SELECT
  TO authenticated
  USING (
    tournament_id IS NULL OR
    EXISTS (
      SELECT 1 FROM tournament_participants
      WHERE tournament_id = announcements.tournament_id
      AND user_id = auth.uid()
    )
  );

-- ============================================
-- UPDATE EXISTING TABLES
-- ============================================

-- Add admin fields to tournaments
DO
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='tournaments' AND column_name='platform') THEN
    ALTER TABLE public.tournaments ADD COLUMN platform TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='tournaments' AND column_name='format') THEN
    ALTER TABLE public.tournaments ADD COLUMN format TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='tournaments' AND column_name='banner_url') THEN
    ALTER TABLE public.tournaments ADD COLUMN banner_url TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='tournaments' AND column_name='registration_open') THEN
    ALTER TABLE public.tournaments ADD COLUMN registration_open TIMESTAMP WITH TIME ZONE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='tournaments' AND column_name='registration_close') THEN
    ALTER TABLE public.tournaments ADD COLUMN registration_close TIMESTAMP WITH TIME ZONE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='tournaments' AND column_name='require_spectator') THEN
    ALTER TABLE public.tournaments ADD COLUMN require_spectator BOOLEAN DEFAULT true;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='tournaments' AND column_name='spectator_pay_rate') THEN
    ALTER TABLE public.tournaments ADD COLUMN spectator_pay_rate DECIMAL(10, 2) DEFAULT 5;
  END IF;
END ;

-- Add phone to profiles
DO
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='profiles' AND column_name='phone') THEN
    ALTER TABLE public.profiles ADD COLUMN phone TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='profiles' AND column_name='is_banned') THEN
    ALTER TABLE public.profiles ADD COLUMN is_banned BOOLEAN DEFAULT false;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='profiles' AND column_name='last_login') THEN
    ALTER TABLE public.profiles ADD COLUMN last_login TIMESTAMP WITH TIME ZONE;
  END IF;
END ;

-- ============================================
-- ADMIN VIEWS
-- ============================================

-- Platform metrics view
CREATE OR REPLACE VIEW public.admin_platform_metrics AS
SELECT
  (SELECT COUNT(*) FROM profiles WHERE role = 'player') AS total_players,
  (SELECT COUNT(*) FROM spectators WHERE status = 'active') AS active_spectators,
  (SELECT COUNT(*) FROM tournaments WHERE status IN ('upcoming', 'ongoing')) AS active_tournaments,
  (SELECT COUNT(*) FROM matches WHERE DATE(scheduled_time) = CURRENT_DATE) AS todays_matches,
  (SELECT COUNT(*) FROM disputes WHERE status = 'open') AS open_disputes,
  (SELECT COUNT(*) FROM withdrawal_requests WHERE status = 'pending') AS pending_payouts,
  (SELECT COALESCE(SUM(entry_fee * current_participants), 0) FROM tournaments WHERE status = 'ongoing') AS active_entry_fees,
  (SELECT COALESCE(SUM(amount), 0) FROM transactions WHERE type = 'prize' AND created_at >= CURRENT_DATE - INTERVAL '30 days') AS monthly_payouts;

-- Recent activity view
CREATE OR REPLACE VIEW public.admin_recent_activity AS
SELECT
  'tournament' AS type,
  id,
  name AS title,
  start_date AS activity_date
FROM tournaments
WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
UNION ALL
SELECT
  'player' AS type,
  id,
  username AS title,
  created_at AS activity_date
FROM profiles
WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
UNION ALL
SELECT
  'dispute' AS type,
  id,
  reason AS title,
  created_at AS activity_date
FROM disputes
WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
ORDER BY activity_date DESC
LIMIT 20;

-- Grant view permissions
GRANT SELECT ON public.admin_platform_metrics TO authenticated;
GRANT SELECT ON public.admin_recent_activity TO authenticated;

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to log admin activity
CREATE OR REPLACE FUNCTION log_admin_activity(
  p_action TEXT,
  p_target_type TEXT,
  p_target_id UUID,
  p_details JSONB DEFAULT NULL
)
RETURNS void AS
BEGIN
  INSERT INTO public.admin_activity_log (admin_id, action, target_type, target_id, details)
  VALUES (auth.uid(), p_action, p_target_type, p_target_id, p_details);
END;
 LANGUAGE plpgsql SECURITY DEFINER;

-- Function to ban/unban user
CREATE OR REPLACE FUNCTION admin_toggle_user_ban(p_user_id UUID, p_ban BOOLEAN)
RETURNS void AS
BEGIN
  -- Check if caller is admin
  IF NOT EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true) THEN
    RAISE EXCEPTION 'Unauthorized: Admin access required';
  END IF;

  UPDATE profiles SET is_banned = p_ban WHERE id = p_user_id;

  PERFORM log_admin_activity(
    CASE WHEN p_ban THEN 'ban_user' ELSE 'unban_user' END,
    'user',
    p_user_id,
    NULL
  );
END;
 LANGUAGE plpgsql SECURITY DEFINER;

-- Function to approve spectator
CREATE OR REPLACE FUNCTION admin_approve_spectator(p_spectator_id UUID)
RETURNS void AS
BEGIN
  -- Check if caller is admin
  IF NOT EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true) THEN
    RAISE EXCEPTION 'Unauthorized: Admin access required';
  END IF;

  UPDATE spectators
  SET status = 'active',
      approved_at = NOW(),
      approved_by = auth.uid()
  WHERE id = p_spectator_id;

  -- Update user role
  UPDATE profiles
  SET role = 'spectator'
  WHERE id = (SELECT user_id FROM spectators WHERE id = p_spectator_id);

  PERFORM log_admin_activity('approve_spectator', 'spectator', p_spectator_id, NULL);
END;
 LANGUAGE plpgsql SECURITY DEFINER;
```

## Next Steps:

1. Run this SQL in Supabase SQL Editor
2. Create an admin user by updating a profile: `UPDATE profiles SET is_admin = true WHERE email = 'your-admin@email.com';`
3. The admin panel will check `is_admin` flag for access
