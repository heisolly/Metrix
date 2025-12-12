# Safe Admin Database Migration

Run this SQL in your Supabase SQL Editor. This script safely adds admin features without causing conflicts.

```sql
-- ============================================================================
-- SAFE ADMIN DATABASE MIGRATION
-- This script can be run multiple times without errors
-- ============================================================================

-- 1. Add missing columns to profiles table (if they don't exist)
DO
BEGIN
    -- Add role column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name='profiles' AND column_name='role') THEN
        ALTER TABLE profiles ADD COLUMN role TEXT DEFAULT 'player';
    END IF;

    -- Add is_admin column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name='profiles' AND column_name='is_admin') THEN
        ALTER TABLE profiles ADD COLUMN is_admin BOOLEAN DEFAULT false;
    END IF;

    -- Add phone column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name='profiles' AND column_name='phone') THEN
        ALTER TABLE profiles ADD COLUMN phone TEXT;
    END IF;

    -- Add is_banned column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name='profiles' AND column_name='is_banned') THEN
        ALTER TABLE profiles ADD COLUMN is_banned BOOLEAN DEFAULT false;
    END IF;

    -- Add last_login column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name='profiles' AND column_name='last_login') THEN
        ALTER TABLE profiles ADD COLUMN last_login TIMESTAMPTZ;
    END IF;
END ;

-- 2. Add missing columns to tournaments table (if they don't exist)
DO
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name='tournaments' AND column_name='platform') THEN
        ALTER TABLE tournaments ADD COLUMN platform TEXT DEFAULT 'mobile';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name='tournaments' AND column_name='format') THEN
        ALTER TABLE tournaments ADD COLUMN format TEXT DEFAULT 'single_elimination';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name='tournaments' AND column_name='banner_url') THEN
        ALTER TABLE tournaments ADD COLUMN banner_url TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name='tournaments' AND column_name='registration_open') THEN
        ALTER TABLE tournaments ADD COLUMN registration_open TIMESTAMPTZ;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name='tournaments' AND column_name='registration_close') THEN
        ALTER TABLE tournaments ADD COLUMN registration_close TIMESTAMPTZ;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name='tournaments' AND column_name='require_spectator') THEN
        ALTER TABLE tournaments ADD COLUMN require_spectator BOOLEAN DEFAULT true;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name='tournaments' AND column_name='spectator_pay_rate') THEN
        ALTER TABLE tournaments ADD COLUMN spectator_pay_rate DECIMAL(10,2) DEFAULT 5.00;
    END IF;
END ;

-- 3. Create spectators table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS spectators (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'suspended', 'rejected')),
    games TEXT[] DEFAULT '{}',
    level TEXT,
    matches_completed INTEGER DEFAULT 0,
    accuracy_rate DECIMAL(5,2) DEFAULT 100.00,
    applied_at TIMESTAMPTZ DEFAULT NOW(),
    approved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create disputes table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS disputes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    match_id UUID REFERENCES matches(id) ON DELETE CASCADE NOT NULL,
    complaining_player_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    spectator_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    reason TEXT NOT NULL,
    player_evidence TEXT[],
    spectator_evidence TEXT[],
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'under_review', 'resolved', 'dismissed')),
    resolution TEXT,
    resolved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Create platform_settings table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS platform_settings (
    setting_key TEXT PRIMARY KEY,
    setting_value TEXT NOT NULL,
    description TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Create admin_activity_log table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS admin_activity_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID REFERENCES auth.users(id) ON DELETE SET NULL NOT NULL,
    action TEXT NOT NULL,
    target_type TEXT,
    target_id UUID,
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Create announcements table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tournament_id UUID REFERENCES tournaments(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'info' CHECK (type IN ('info', 'warning', 'urgent')),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Drop and recreate RLS policies for spectators
DROP POLICY IF EXISTS "Spectators viewable by authenticated users" ON spectators;
DROP POLICY IF EXISTS "Users can apply to be spectators" ON spectators;
DROP POLICY IF EXISTS "Admins can manage spectators" ON spectators;

ALTER TABLE spectators ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Spectators viewable by authenticated users"
    ON spectators FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Users can apply to be spectators"
    ON spectators FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage spectators"
    ON spectators FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.is_admin = true
        )
    );

-- 9. Drop and recreate RLS policies for disputes
DROP POLICY IF EXISTS "Disputes viewable by involved parties" ON disputes;
DROP POLICY IF EXISTS "Players can create disputes" ON disputes;
DROP POLICY IF EXISTS "Admins can manage disputes" ON disputes;

ALTER TABLE disputes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Disputes viewable by involved parties"
    ON disputes FOR SELECT
    TO authenticated
    USING (
        auth.uid() = complaining_player_id
        OR auth.uid() = spectator_id
        OR EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.is_admin = true
        )
    );

CREATE POLICY "Players can create disputes"
    ON disputes FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = complaining_player_id);

CREATE POLICY "Admins can manage disputes"
    ON disputes FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.is_admin = true
        )
    );

-- 10. Drop and recreate RLS policies for other admin tables
DROP POLICY IF EXISTS "Platform settings viewable by all" ON platform_settings;
DROP POLICY IF EXISTS "Admins can manage settings" ON platform_settings;

ALTER TABLE platform_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Platform settings viewable by all"
    ON platform_settings FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Admins can manage settings"
    ON platform_settings FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.is_admin = true
        )
    );

DROP POLICY IF EXISTS "Activity log viewable by admins" ON admin_activity_log;
DROP POLICY IF EXISTS "Admins can log activities" ON admin_activity_log;

ALTER TABLE admin_activity_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Activity log viewable by admins"
    ON admin_activity_log FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.is_admin = true
        )
    );

CREATE POLICY "Admins can log activities"
    ON admin_activity_log FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.is_admin = true
        )
    );

DROP POLICY IF EXISTS "Announcements viewable by all" ON announcements;
DROP POLICY IF EXISTS "Admins can manage announcements" ON announcements;

ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Announcements viewable by all"
    ON announcements FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Admins can manage announcements"
    ON announcements FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.is_admin = true
        )
    );

-- 11. Drop existing views first
DROP VIEW IF EXISTS admin_platform_metrics CASCADE;
DROP VIEW IF EXISTS admin_recent_activity CASCADE;

-- Create admin views
CREATE VIEW admin_platform_metrics AS
SELECT
    (SELECT COUNT(*) FROM profiles WHERE role = 'player') as total_players,
    (SELECT COUNT(*) FROM spectators WHERE status = 'active') as active_spectators,
    (SELECT COUNT(*) FROM tournaments WHERE status IN ('upcoming', 'ongoing')) as active_tournaments,
    (SELECT COUNT(*) FROM matches WHERE DATE(scheduled_time) = CURRENT_DATE) as todays_matches,
    (SELECT COUNT(*) FROM disputes WHERE status = 'open') as open_disputes,
    (SELECT COUNT(*) FROM withdrawal_requests WHERE status = 'pending') as pending_payouts,
    (SELECT COALESCE(SUM(entry_fee * current_participants), 0) FROM tournaments WHERE status = 'ongoing') as active_entry_fees,
    (SELECT COALESCE(SUM(amount), 0) FROM withdrawal_requests WHERE status = 'completed' AND completed_date >= NOW() - INTERVAL '30 days') as monthly_payouts;

CREATE VIEW admin_recent_activity AS
SELECT
    'tournament' as type,
    t.id,
    t.name as title,
    t.created_at,
    p.username as created_by
FROM tournaments t
LEFT JOIN profiles p ON t.created_by = p.id
ORDER BY t.created_at DESC
LIMIT 10;

-- 12. Create or replace admin functions
CREATE OR REPLACE FUNCTION log_admin_activity(
    p_action TEXT,
    p_target_type TEXT DEFAULT NULL,
    p_target_id UUID DEFAULT NULL,
    p_details JSONB DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS
DECLARE
    v_log_id UUID;
BEGIN
    INSERT INTO admin_activity_log (admin_id, action, target_type, target_id, details)
    VALUES (auth.uid(), p_action, p_target_type, p_target_id, p_details)
    RETURNING id INTO v_log_id;

    RETURN v_log_id;
END;
;

CREATE OR REPLACE FUNCTION admin_toggle_user_ban(
    p_user_id UUID,
    p_ban BOOLEAN
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS
BEGIN
    -- Check if caller is admin
    IF NOT EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true) THEN
        RAISE EXCEPTION 'Unauthorized: Admin access required';
    END IF;

    -- Update user ban status
    UPDATE profiles
    SET is_banned = p_ban
    WHERE id = p_user_id;

    -- Log the action
    PERFORM log_admin_activity(
        CASE WHEN p_ban THEN 'ban_user' ELSE 'unban_user' END,
        'user',
        p_user_id
    );
END;
;

CREATE OR REPLACE FUNCTION admin_approve_spectator(
    p_spectator_id UUID
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS
BEGIN
    -- Check if caller is admin
    IF NOT EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true) THEN
        RAISE EXCEPTION 'Unauthorized: Admin access required';
    END IF;

    -- Approve spectator
    UPDATE spectators
    SET status = 'active',
        approved_at = NOW()
    WHERE id = p_spectator_id;

    -- Log the action
    PERFORM log_admin_activity('approve_spectator', 'spectator', p_spectator_id);
END;
;

-- 13. Insert default platform settings
INSERT INTO platform_settings (setting_key, setting_value, description)
VALUES
    ('platform_commission', '10', 'Platform commission percentage'),
    ('default_spectator_pay', '5', 'Default spectator pay per match in USD'),
    ('dispute_deadline_hours', '24', 'Hours after match to file dispute'),
    ('min_withdrawal_amount', '10', 'Minimum withdrawal amount in USD')
ON CONFLICT (setting_key) DO NOTHING;

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================
```

**After running this, execute:**

```sql
-- Make yourself an admin (replace with your email)
UPDATE profiles
SET is_admin = true, role = 'admin'
WHERE email = 'your-email@example.com';
```
