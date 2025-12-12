-- Create spectator_applications table
CREATE TABLE IF NOT EXISTS spectator_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  experience TEXT,
  games TEXT[] DEFAULT '{}',
  availability TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS idx_spectator_applications_status ON spectator_applications(status);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_spectator_applications_created_at ON spectator_applications(created_at DESC);

-- Create index on email for lookups
CREATE INDEX IF NOT EXISTS idx_spectator_applications_email ON spectator_applications(email);

-- Enable Row Level Security
ALTER TABLE spectator_applications ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can submit applications" ON spectator_applications;
DROP POLICY IF EXISTS "Authenticated users can view applications" ON spectator_applications;
DROP POLICY IF EXISTS "Authenticated users can update applications" ON spectator_applications;

-- Policy: Anyone can submit applications (insert)
CREATE POLICY "Anyone can submit applications"
  ON spectator_applications
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Policy: Authenticated users can view all applications
CREATE POLICY "Authenticated users can view applications"
  ON spectator_applications
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Authenticated users can update applications
CREATE POLICY "Authenticated users can update applications"
  ON spectator_applications
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create updated_at trigger
DROP TRIGGER IF EXISTS spectator_applications_updated_at ON spectator_applications;
DROP FUNCTION IF EXISTS update_spectator_applications_updated_at();

CREATE OR REPLACE FUNCTION update_spectator_applications_updated_at()
RETURNS TRIGGER AS 
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
 LANGUAGE plpgsql;

CREATE TRIGGER spectator_applications_updated_at
  BEFORE UPDATE ON spectator_applications
  FOR EACH ROW
  EXECUTE FUNCTION update_spectator_applications_updated_at();
