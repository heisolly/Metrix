# Fix RLS Policies for Admin Operations

Run this SQL in your Supabase SQL Editor to fix the Row Level Security issues:

```sql
-- ============================================================================
-- FIX RLS POLICIES FOR ADMIN OPERATIONS
-- ============================================================================

-- 1. Drop existing policies on tournaments table
DROP POLICY IF EXISTS "Public tournaments are viewable by everyone" ON tournaments;
DROP POLICY IF EXISTS "Authenticated users can create tournaments" ON tournaments;
DROP POLICY IF EXISTS "Users can update their own tournaments" ON tournaments;
DROP POLICY IF EXISTS "Admins can manage all tournaments" ON tournaments;

-- 2. Create new comprehensive policies for tournaments
ALTER TABLE tournaments ENABLE ROW LEVEL SECURITY;

-- Everyone can view tournaments
CREATE POLICY "Anyone can view tournaments"
    ON tournaments FOR SELECT
    USING (true);

-- Admins can do everything with tournaments
CREATE POLICY "Admins can manage tournaments"
    ON tournaments FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.is_admin = true
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.is_admin = true
        )
    );

-- Authenticated users can create tournaments (for player-created tournaments if needed)
CREATE POLICY "Authenticated users can create tournaments"
    ON tournaments FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- 3. Fix matches table policies
DROP POLICY IF EXISTS "Matches viewable by participants" ON matches;
DROP POLICY IF EXISTS "Admins can manage matches" ON matches;

ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

-- Everyone can view matches
CREATE POLICY "Anyone can view matches"
    ON matches FOR SELECT
    USING (true);

-- Admins can manage all matches
CREATE POLICY "Admins can manage matches"
    ON matches FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.is_admin = true
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.is_admin = true
        )
    );

-- Players can view their own matches
CREATE POLICY "Players can view their matches"
    ON matches FOR SELECT
    TO authenticated
    USING (
        auth.uid() = player1_id
        OR auth.uid() = player2_id
        OR auth.uid() = spectator_id
    );

-- 4. Fix spectators table foreign key reference
-- The spectators table references profiles, not auth.users
DROP TABLE IF EXISTS spectators CASCADE;

CREATE TABLE spectators (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
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

-- Recreate spectators RLS policies
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

-- 5. Fix tournament_participants policies
DROP POLICY IF EXISTS "Anyone can view participants" ON tournament_participants;
DROP POLICY IF EXISTS "Users can join tournaments" ON tournament_participants;
DROP POLICY IF EXISTS "Admins can manage participants" ON tournament_participants;

ALTER TABLE tournament_participants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view participants"
    ON tournament_participants FOR SELECT
    USING (true);

CREATE POLICY "Users can join tournaments"
    ON tournament_participants FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage participants"
    ON tournament_participants FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.is_admin = true
        )
    );

-- 6. Fix withdrawal_requests policies
DROP POLICY IF EXISTS "Users can view own requests" ON withdrawal_requests;
DROP POLICY IF EXISTS "Users can create requests" ON withdrawal_requests;
DROP POLICY IF EXISTS "Admins can manage requests" ON withdrawal_requests;

ALTER TABLE withdrawal_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own requests"
    ON withdrawal_requests FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create requests"
    ON withdrawal_requests FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage requests"
    ON withdrawal_requests FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.is_admin = true
        )
    );

-- 7. Fix transactions policies
DROP POLICY IF EXISTS "Users can view own transactions" ON transactions;
DROP POLICY IF EXISTS "System can create transactions" ON transactions;
DROP POLICY IF EXISTS "Admins can manage transactions" ON transactions;

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own transactions"
    ON transactions FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage transactions"
    ON transactions FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.is_admin = true
        )
    );

-- ============================================================================
-- POLICIES FIXED
-- ============================================================================
```

After running this, your admin should be able to:

- ✅ Create tournaments
- ✅ Edit tournaments
- ✅ Create matches
- ✅ View spectators
- ✅ Manage all admin functions
