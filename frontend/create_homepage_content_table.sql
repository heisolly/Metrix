-- Create homepage_content table
CREATE TABLE IF NOT EXISTS homepage_content (
  id TEXT PRIMARY KEY DEFAULT 'homepage',
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default content
INSERT INTO homepage_content (id, content)
VALUES (
  'homepage',
  '{
    "hero_title": "Compete. Dominate. Win.",
    "hero_subtitle": "Join the ultimate esports platform for competitive gaming",
    "hero_cta_text": "Get Started",
    "about_title": "Why Choose Metrix?",
    "about_description": "The premier platform for competitive gaming tournaments",
    "features": [
      {
        "title": "Live Tournaments",
        "description": "Compete in real-time tournaments with players worldwide"
      },
      {
        "title": "Prize Pools",
        "description": "Win cash prizes and exclusive rewards"
      },
      {
        "title": "Live Stats",
        "description": "Track your performance with real-time statistics"
      }
    ],
    "custom_html": "",
    "custom_css": ""
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- Enable Row Level Security
ALTER TABLE homepage_content ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can read homepage content" ON homepage_content;
DROP POLICY IF EXISTS "Admins can update homepage content" ON homepage_content;
DROP POLICY IF EXISTS "Authenticated users can update homepage" ON homepage_content;

-- Policy: Anyone can read homepage content
CREATE POLICY "Anyone can read homepage content"
  ON homepage_content
  FOR SELECT
  USING (true);

-- Policy: Authenticated users can update homepage content
CREATE POLICY "Authenticated users can update homepage"
  ON homepage_content
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create updated_at trigger
DROP TRIGGER IF EXISTS homepage_content_updated_at ON homepage_content;
DROP FUNCTION IF EXISTS update_homepage_content_updated_at();

CREATE OR REPLACE FUNCTION update_homepage_content_updated_at()
RETURNS TRIGGER AS 
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
 LANGUAGE plpgsql;

CREATE TRIGGER homepage_content_updated_at
  BEFORE UPDATE ON homepage_content
  FOR EACH ROW
  EXECUTE FUNCTION update_homepage_content_updated_at();
