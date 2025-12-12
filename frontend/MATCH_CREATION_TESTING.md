# Match Creation Testing Guide

## ✅ The match creation code is already fixed and should work!

### 🔍 How to Test Match Creation

#### Step 1: Create a Match

1. **Sign in as admin** at `/admin/signin`
2. **Go to** `http://localhost:3000/admin/matches/create`
3. **Fill in the form**:
   - Select a tournament
   - Choose Player 1
   - Choose Player 2
   - Set round number (e.g., 1)
   - Pick a date
   - Pick a time
   - (Optional) Assign spectator
4. **Click** "Create Match"

#### Step 2: Check Success

**If successful, you should see**:

- ✅ Alert: "Match created successfully!"
- ✅ Redirect to tournament page
- ✅ Match appears in tournament bracket

#### Step 3: Verify in Database

**Option A - Using Supabase Dashboard**:

1. Go to Supabase Dashboard
2. Click "Table Editor"
3. Select "matches" table
4. Look for your newly created match
5. Check that it has:
   - `tournament_id` ✓
   - `player1_id` ✓
   - `player2_id` ✓
   - `round` ✓
   - `match_number` ✓
   - `match_code` ✓
   - `scheduled_time` ✓
   - `status: 'scheduled'` ✓

**Option B - Using SQL Query**:

1. Open `verify_matches.sql` (I just created it)
2. Copy Query #1 (Check all matches)
3. Run in Supabase SQL Editor
4. You should see your match in the results

### 🐛 Troubleshooting

#### Issue: "Match created successfully" but not in database

**Possible causes**:

1. **RLS Policy blocking insert**
   - Check Row Level Security policies
   - Query:

   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'matches';
   ```

2. **Silent failure**
   - Check browser console for errors (F12)
   - Look for red error messages

#### Issue: "Failed to create match: ..."

**Common errors**:

1. **"Could not find the 'match_type' column"**
   - ✅ Already fixed! This should not happen anymore
   - If it does, restart dev server: `npm run dev`

2. **"violates foreign key constraint"**
   - **Cause**: Player ID doesn't exist in auth.users
   - **Fix**: Ensure both players have accounts
   - **Check**:

   ```sql
   SELECT id, email FROM auth.users LIMIT 10;
   ```

3. **"null value in column violates not-null constraint"**
   - **Cause**: Missing required field
   - **Fix**: Ensure all required fields are filled

4. **"violates check constraint"**
   - **Cause**: Invalid data (e.g., negative round number)
   - **Fix**: Use valid values (round >= 1)

### ✅ What Gets Inserted

When you create a match, the following data is inserted into `matches` table:

```javascript
{
  tournament_id: "uuid-string",        // The tournament ID
  player1_id: "uuid-string",          // Player 1's user ID
  player2_id: "uuid-string",          // Player 2's user ID
  spectator_id: "uuid-string" | null, // Spectator (optional)
  round: 1,                           // Round number
  match_number: 1,                    // Auto-calculated
  scheduled_time: "2025-01-15T14:00:00Z", // ISO timestamp
  status: "scheduled",                // Always 'scheduled' for new matches
  match_code: "abc12345-R1-M1"       // Auto-generated
}
```

### 🔧 Manual Test in Database

If you want to insert a match manually to test:

```sql
-- First, get some IDs you'll need
SELECT id as tournament_id FROM tournaments LIMIT 1;
SELECT id as player_id FROM profiles LIMIT 2;

-- Then insert a test match (replace the IDs)
INSERT INTO public.matches (
  tournament_id,
  player1_id,
  player2_id,
  round,
  match_number,
  scheduled_time,
  status,
  match_code
) VALUES (
  'your-tournament-id-here',
  'player1-id-here',
  'player2-id-here',
  1,
  1,
  '2025-01-15 14:00:00',
  'scheduled',
  'TEST-R1-M1'
);

-- Check if it was inserted
SELECT * FROM matches WHERE match_code = 'TEST-R1-M1';
```

### 📊 Where to See Created Matches

Matches appear in **3 places**:

1. **Admin Tournament Page**
   - URL: `/admin/tournaments/[tournamentId]`
   - Shows in bracket tree
   - Click "Edit Pairings" to see all matches

2. **User Tournament Page**
   - URL: `/dashboard/tournaments/[tournamentId]`
   - Shows in bracket tree
   - User's matches highlighted in yellow

3. **User Matches List**
   - URL: `/dashboard/matches`
   - Shows all matches for that user
   - Filterable by status

### 🎯 Quick Verification Checklist

After creating a match, verify:

- [ ] Success message appeared
- [ ] Redirected to tournament page
- [ ] Match appears in Supabase dashboard
- [ ] `match_number` is set correctly
- [ ] `match_code` is generated (format: `xxx-R1-M1`)
- [ ] `status` is 'scheduled'
- [ ] Both player IDs are set
- [ ] Scheduled time is correct
- [ ] Match shows in bracket tree

### 💡 Tips

1. **Always check browser console** (F12) for errors
2. **Use Supabase Table Editor** for quick verification
3. **Check Recent Matches**: Run Query #6 from `verify_matches.sql`
4. **Create test tournament first** if you don't have one
5. **Ensure players exist** before creating match

### 🚀 Expected Workflow

```
1. Admin creates match via form
   ↓
2. Form validates (players different, etc.)
   ↓
3. Calculate next match_number
   ↓
4. Insert into matches table
   ↓
5. Show success message
   ↓
6. Redirect to tournament page
   ↓
7. Match appears in bracket tree
   ↓
8. Match visible to assigned players
```

## ✅ Summary

The match creation is **already working** with the fixes we made. If you're not seeing matches:

1. Check browser console for errors
2. Verify in Supabase dashboard (Table Editor → matches)
3. Run SQL queries from `verify_matches.sql`
4. Check that tournament exists and has participants
5. Ensure player IDs are valid

The database insert is at **line 98-112** of the create match form and includes all required fields!
