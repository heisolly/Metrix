-- Add match_details column to matches table for storing live game statistics
-- This column will store JSON data including kills, deaths, time remaining, rounds, etc.

ALTER TABLE matches 
ADD COLUMN IF NOT EXISTS match_details JSONB DEFAULT '{}'::jsonb;

-- Add comment to document the column
COMMENT ON COLUMN matches.match_details IS 'Stores live match statistics and game-specific data in JSON format';

-- Create an index for better query performance on match_details
CREATE INDEX IF NOT EXISTS idx_matches_match_details ON matches USING GIN (match_details);
