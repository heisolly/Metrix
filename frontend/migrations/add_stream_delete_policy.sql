-- Migration: Add DELETE policy for live_streams
-- This allows authenticated users (admins) to delete streams

-- Drop the policy if it exists
DROP POLICY IF EXISTS "Authenticated users can delete streams" ON live_streams;

-- Create the DELETE policy
CREATE POLICY "Authenticated users can delete streams"
  ON live_streams
  FOR DELETE
  TO authenticated
  USING (true);

-- Verify the policy was created
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename = 'live_streams'
ORDER BY policyname;
