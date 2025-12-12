-- Create homepage content management system

-- 1. Create homepage_sections table
CREATE TABLE IF NOT EXISTS homepage_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_key TEXT UNIQUE NOT NULL, -- 'tournament_games', 'hero', etc.
  title TEXT,
  subtitle TEXT,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  settings JSONB DEFAULT '{}', -- Additional settings like colors, limits, etc.
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create homepage_tournament_games table
CREATE TABLE IF NOT EXISTS homepage_tournament_games (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  game_name TEXT NOT NULL,
  team1_name TEXT NOT NULL,
  team1_logo TEXT,
  team2_name TEXT NOT NULL,
  team2_logo TEXT,
  match_time TEXT NOT NULL,
  match_date TEXT NOT NULL,
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'finished', 'live')),
  color_primary TEXT DEFAULT '#ef4444',
  color_secondary TEXT DEFAULT '#dc2626',
  color_name TEXT DEFAULT 'red',
  is_featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create indexes
CREATE INDEX IF NOT EXISTS idx_homepage_sections_key ON homepage_sections(section_key);
CREATE INDEX IF NOT EXISTS idx_homepage_sections_active ON homepage_sections(is_active);
CREATE INDEX IF NOT EXISTS idx_homepage_tournament_games_status ON homepage_tournament_games(status);
CREATE INDEX IF NOT EXISTS idx_homepage_tournament_games_active ON homepage_tournament_games(is_active);
CREATE INDEX IF NOT EXISTS idx_homepage_tournament_games_order ON homepage_tournament_games(display_order);

-- 4. Enable Row Level Security
ALTER TABLE homepage_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE homepage_tournament_games ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies for homepage_sections
DROP POLICY IF EXISTS "Anyone can view homepage sections" ON homepage_sections;
DROP POLICY IF EXISTS "Admins can manage homepage sections" ON homepage_sections;

CREATE POLICY "Anyone can view homepage sections"
  ON homepage_sections
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Admins can manage homepage sections"
  ON homepage_sections
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- 6. RLS Policies for homepage_tournament_games
DROP POLICY IF EXISTS "Anyone can view active tournament games" ON homepage_tournament_games;
DROP POLICY IF EXISTS "Admins can manage tournament games" ON homepage_tournament_games;

CREATE POLICY "Anyone can view active tournament games"
  ON homepage_tournament_games
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Admins can manage tournament games"
  ON homepage_tournament_games
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- 7. Create updated_at triggers
CREATE OR REPLACE FUNCTION update_homepage_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS homepage_sections_updated_at ON homepage_sections;
CREATE TRIGGER homepage_sections_updated_at
  BEFORE UPDATE ON homepage_sections
  FOR EACH ROW
  EXECUTE FUNCTION update_homepage_updated_at();

DROP TRIGGER IF EXISTS homepage_tournament_games_updated_at ON homepage_tournament_games;
CREATE TRIGGER homepage_tournament_games_updated_at
  BEFORE UPDATE ON homepage_tournament_games
  FOR EACH ROW
  EXECUTE FUNCTION update_homepage_updated_at();

-- 8. Insert default homepage section for tournament games
INSERT INTO homepage_sections (section_key, title, subtitle, description, is_active, display_order, settings)
VALUES (
  'tournament_games',
  'Tournament Trending Match',
  'Tournament Game',
  'Watch the most exciting tournament matches',
  true,
  1,
  '{"tab_labels": ["All Games", "Upcoming Games", "Finished Games"]}'::jsonb
)
ON CONFLICT (section_key) DO NOTHING;

-- 9. Insert sample tournament games (matching current design)
INSERT INTO homepage_tournament_games (
  game_name, team1_name, team1_logo, team2_name, team2_logo,
  match_time, match_date, status, color_primary, color_secondary, color_name,
  is_featured, display_order, is_active
) VALUES
  ('PUBG MOBILE', 'Pro Player', '/assets/4-3.png', 'Lion King', '/assets/1-2.png', '07:30', '30 Dec 2024', 'upcoming', '#ef4444', '#dc2626', 'red', true, 1, true),
  ('PUBG MOBILE', 'Assassin', '/assets/4-3.png', 'Cyberpunk', '/assets/1-2.png', '09:00', '30 Dec 2024', 'upcoming', '#ef4444', '#dc2626', 'red', false, 2, true),
  ('PUBG MOBILE', 'Fire Squad', '/assets/4-3.png', 'Dark Force', '/assets/1-2.png', '11:30', '30 Dec 2024', 'finished', '#ef4444', '#dc2626', 'red', false, 3, true),
  ('VALORANT', 'Venom Strike', '/assets/4-3.png', 'Phoenix Rising', '/assets/1-2.png', '14:00', '31 Dec 2024', 'upcoming', '#a855f7', '#9333ea', 'purple', false, 4, true),
  ('CS:GO', 'Shadow Ops', '/assets/4-3.png', 'Neon Ninjas', '/assets/1-2.png', '16:30', '31 Dec 2024', 'finished', '#f97316', '#ea580c', 'orange', false, 5, true),
  ('FORTNITE', 'Storm Legion', '/assets/4-3.png', 'Arctic Wolves', '/assets/1-2.png', '19:00', '01 Jan 2025', 'upcoming', '#3b82f6', '#2563eb', 'blue', false, 6, true),
  ('APEX LEGENDS', 'Titan Squad', '/assets/4-3.png', 'Viper Elite', '/assets/1-2.png', '21:00', '01 Jan 2025', 'finished', '#22c55e', '#16a34a', 'green', false, 7, true),
  ('VALORANT', 'Phantom Kings', '/assets/4-3.png', 'Radiant Force', '/assets/1-2.png', '10:00', '02 Jan 2025', 'upcoming', '#a855f7', '#9333ea', 'purple', false, 8, true),
  ('PUBG MOBILE', 'Thunder Strike', '/assets/4-3.png', 'Shadow Legends', '/assets/1-2.png', '13:30', '02 Jan 2025', 'finished', '#ef4444', '#dc2626', 'red', false, 9, true)
ON CONFLICT DO NOTHING;

-- 10. Grant permissions
GRANT SELECT ON homepage_sections TO anon, authenticated;
GRANT SELECT ON homepage_tournament_games TO anon, authenticated;
GRANT ALL ON homepage_sections TO authenticated;
GRANT ALL ON homepage_tournament_games TO authenticated;
