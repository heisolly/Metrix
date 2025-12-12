# Add Match Details Column Migration

## Error

`Could not find the 'match_details' column of 'matches' in the schema cache`

## Solution

The `match_details` column needs to be added to the `matches` table to store live game statistics.

## Steps to Apply Migration

### Option 1: Using Supabase Dashboard (Recommended)

1. **Go to Supabase Dashboard**
   - Navigate to: https://supabase.com/dashboard
   - Select your project

2. **Open SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Run the Migration**
   - Copy and paste the SQL from `add_match_details_column.sql`
   - Click "Run" or press `Ctrl+Enter`

4. **Verify the Column**
   - Go to "Table Editor"
   - Select the `matches` table
   - Confirm that `match_details` column appears with type `jsonb`

### Option 2: Using Supabase CLI

```bash
# Make sure you're in the frontend directory
cd c:\Softwares\Metrix\frontend

# Run the migration
supabase db push --file add_match_details_column.sql
```

## What This Migration Does

1. **Adds `match_details` column** to the `matches` table
   - Type: `JSONB` (JSON Binary - efficient storage and querying)
   - Default: `{}` (empty JSON object)

2. **Creates GIN Index** for better query performance on JSON data

3. **Stores Live Game Statistics** such as:
   - Player kills and deaths
   - Time remaining
   - Current round
   - Match notes
   - Any other game-specific data

## After Migration

Once the migration is complete:

- ✅ The "Save Stats" button will work
- ✅ Live match statistics will be persisted
- ✅ Stats will be available across page refreshes
- ✅ All users can view the live stats

## Verification Query

After running the migration, verify it worked:

```sql
-- Check if column exists
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'matches'
AND column_name = 'match_details';

-- Test inserting data
UPDATE matches
SET match_details = '{"player1_kills": 10, "player2_kills": 8}'::jsonb
WHERE id = (SELECT id FROM matches LIMIT 1);
```
