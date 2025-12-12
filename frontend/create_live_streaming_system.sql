-- Create live streaming system tables

-- 1. Live streams table
CREATE TABLE IF NOT EXISTS live_streams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
  stream_url TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  viewer_count INTEGER DEFAULT 0,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Live chat messages table
CREATE TABLE IF NOT EXISTS live_chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  stream_id UUID REFERENCES live_streams(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  message TEXT NOT NULL,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Live stream viewers table (for tracking active viewers)
CREATE TABLE IF NOT EXISTS live_stream_viewers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  stream_id UUID REFERENCES live_streams(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  session_id TEXT NOT NULL,
  last_seen TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(stream_id, session_id)
);

-- 4. Create indexes
CREATE INDEX IF NOT EXISTS idx_live_streams_active ON live_streams(is_active);
CREATE INDEX IF NOT EXISTS idx_live_streams_match ON live_streams(match_id);
CREATE INDEX IF NOT EXISTS idx_live_chat_stream ON live_chat_messages(stream_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_live_viewers_stream ON live_stream_viewers(stream_id);
CREATE INDEX IF NOT EXISTS idx_live_viewers_last_seen ON live_stream_viewers(last_seen);

-- 5. Function to update viewer count
CREATE OR REPLACE FUNCTION update_viewer_count()
RETURNS TRIGGER AS 
BEGIN
  -- Update viewer count for the stream
  UPDATE live_streams
  SET 
    viewer_count = (
      SELECT COUNT(DISTINCT session_id)
      FROM live_stream_viewers
      WHERE stream_id = NEW.stream_id
      AND last_seen > NOW() - INTERVAL '30 seconds'
    ),
    updated_at = NOW()
  WHERE id = NEW.stream_id;
  
  RETURN NEW;
END;
 LANGUAGE plpgsql;

-- 6. Trigger to update viewer count
DROP TRIGGER IF EXISTS trigger_update_viewer_count ON live_stream_viewers;
CREATE TRIGGER trigger_update_viewer_count
  AFTER INSERT OR UPDATE ON live_stream_viewers
  FOR EACH ROW
  EXECUTE FUNCTION update_viewer_count();

-- 7. Function to clean up old viewers
CREATE OR REPLACE FUNCTION cleanup_old_viewers()
RETURNS void AS 
BEGIN
  -- Delete viewers who haven't been seen in 1 minute
  DELETE FROM live_stream_viewers
  WHERE last_seen < NOW() - INTERVAL '1 minute';
  
  -- Update all stream viewer counts
  UPDATE live_streams
  SET 
    viewer_count = (
      SELECT COUNT(DISTINCT session_id)
      FROM live_stream_viewers
      WHERE stream_id = live_streams.id
      AND last_seen > NOW() - INTERVAL '30 seconds'
    ),
    updated_at = NOW()
  WHERE is_active = true;
END;
 LANGUAGE plpgsql;

-- 8. Enable Row Level Security
ALTER TABLE live_streams ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_stream_viewers ENABLE ROW LEVEL SECURITY;

-- 9. RLS Policies for live_streams
DROP POLICY IF EXISTS "Anyone can view active streams" ON live_streams;
DROP POLICY IF EXISTS "Authenticated users can create streams" ON live_streams;
DROP POLICY IF EXISTS "Authenticated users can update streams" ON live_streams;

CREATE POLICY "Anyone can view active streams"
  ON live_streams
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create streams"
  ON live_streams
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update streams"
  ON live_streams
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete streams"
  ON live_streams
  FOR DELETE
  TO authenticated
  USING (true);

-- 10. RLS Policies for live_chat_messages
DROP POLICY IF EXISTS "Anyone can view chat messages" ON live_chat_messages;
DROP POLICY IF EXISTS "Authenticated users can send messages" ON live_chat_messages;

CREATE POLICY "Anyone can view chat messages"
  ON live_chat_messages
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can send messages"
  ON live_chat_messages
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- 11. RLS Policies for live_stream_viewers
DROP POLICY IF EXISTS "Anyone can track viewers" ON live_stream_viewers;

CREATE POLICY "Anyone can track viewers"
  ON live_stream_viewers
  FOR ALL
  USING (true);

-- 12. Create updated_at trigger
CREATE OR REPLACE FUNCTION update_live_streams_updated_at()
RETURNS TRIGGER AS 
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
 LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS live_streams_updated_at ON live_streams;
CREATE TRIGGER live_streams_updated_at
  BEFORE UPDATE ON live_streams
  FOR EACH ROW
  EXECUTE FUNCTION update_live_streams_updated_at();

-- 13. Create default active stream (optional)
-- INSERT INTO live_streams (stream_url, title, description, is_active)
-- VALUES (
--   'http://192.168.137.29:8080/',
--   'Metrix Tournament - Live Match',
--   'Watch the best players compete in real-time!',
--   true
-- );
