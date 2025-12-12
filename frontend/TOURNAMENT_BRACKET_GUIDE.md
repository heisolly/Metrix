# Tournament Bracket System - Complete Guide

## 🎯 Overview

The tournament bracket system now displays matches in a **tree/chart format** showing the tournament progression from initial rounds (up to 64 players) down to the Finals (2 players).

## ✅ Issues Fixed

### 1. Database Schema

**Problem**: Missing `round` and `match_number` columns prevented bracket saves
**Solution**:

- Added `round` column (INTEGER) to track which round a match belongs to
- Added `match_number` column (INTEGER) for unique match identification
- Added `player2_id` foreign key constraint for data integrity

### 2. Bracket Saving

**Problem**: Bracket editor wasn't saving matches to the database
**Solution**:

- Enhanced error logging in `AdminBracketEditor.tsx`
- Added proper NULL handling for optional fields (player IDs, spectator, scheduled time)
- Added `.select()` to insertion to verify saved data
- Improved error messages with specific details

### 3. Bracket Visualization

**Problem**: Old component didn't show bracket as a tree/chart
**Solution**:

- Created new `BracketTree.tsx` component
- Displays bracket in traditional tournament tree format
- Shows progression from 64 users → 32 → 16 → 8 → 4 → 2 (Finals)
- Proper spacing between rounds for visual clarity

## 🎨 New BracketTree Component Features

### Visual Improvements

- **Tree Structure**: Traditional tournament bracket layout
- **Round Names**: Automatically labels rounds (Round of 64, Round of 32, Quarter-Finals, Semi-Finals, Finals)
- **Player Cards**: Enhanced player display with avatars and scores
- **Status Indicators**:
  - 🔵 Blue: Scheduled matches
  - 🟢 Green: Live matches (with pulsing indicator)
  - ⚪ White: Completed matches
  - 🟡 Yellow ring: User's own matches

### Interactive Features

- **Clickable Matches**: Click any match to view details
- **Winner Highlighting**: Winners shown with green background and trophy icon
- **Score Display**: Shows match scores when available
- **Time & Spectator Info**: Displays scheduling and assigned spectator

## 📖 How to Use

### For Administrators

#### 1. Create a Tournament Bracket

1. Navigate to `/admin/tournaments/[tournamentId]`
2. Scroll to "Bracket & Match Schedule" section
3. Click **"Edit Pairings"** button
4. Click **"Generate Bracket"** button
   - This automatically creates matches based on participants
   - Shuffles participants randomly for fair seeding
   - Creates all rounds needed (calculates log2 of participant count)

#### 2. Customize the Bracket

- **Assign Players**: Use dropdowns to select players for each match
- **Set Schedule**: Choose date/time for each match
- **Assign Spectator**: Select a verified spectator for each match
- **Manual Adjustments**: Swap players, remove matches, or modify details

#### 3. Save the Bracket

1. Click **"Save Bracket"** button
2. Check browser console for confirmation:
   ```
   Starting bracket save...
   Inserting matches: X
   Matches saved successfully: X
   ```
3. Success toast will show: "Created X matches"

#### 4. Verify Bracket Saved

- The bracket will immediately display in tree format
- Check user tournament page to confirm visibility
- Verify matches appear in database

### For Players (Users)

#### 1. View Tournament Bracket

1. Navigate to `/dashboard/tournaments/[tournamentId]`
2. Scroll to "Tournament Bracket" section
3. View the complete bracket tree showing:
   - All rounds (Finals, Semi-Finals, etc.)
   - Your matches highlighted in yellow
   - Match statuses and times
   - Current match scores

#### 2. Interact with Bracket

- **Find Your Matches**: Look for yellow-ringed cards
- **Click Your Match**: Opens match detail page
- **Track Progress**: See which round you're in
- **View Opponents**: See who you're playing and when

## 🔧 Troubleshooting

### Bracket Not Saving

**Check Console Logs**:

```javascript
console.log("Starting bracket save...", { tournamentId, matchCount });
console.log("Inserting matches:", matchCount);
console.log("Sample match:", firstMatch);
```

**Common Issues**:

1. **Foreign Key Violation**
   - Error: `violates foreign key constraint`
   - Cause: Player ID doesn't exist in auth.users
   - Fix: Ensure all player IDs are valid user IDs

2. **NULL Constraint Violation**
   - Error: `null value in column violates not-null constraint`
   - Cause: Required field is missing
   - Fix: Check that `tournament_id`, `round`, and `match_number` are provided

3. **Invalid Tournament ID**
   - Error: `insert or update on table "matches" violates foreign key constraint "matches_tournament_id_fkey"`
   - Cause: Tournament doesn't exist
   - Fix: Verify the tournament exists in the database

### Bracket Not Displaying

1. **No Matches Created**
   - Check if admin has generated the bracket
   - Verify matches exist: `SELECT * FROM matches WHERE tournament_id = 'xxx'`

2. **Missing Columns**
   - Error in console: `column "round" does not exist`
   - Fix: Run migration to add `round` and `match_number` columns

   ```sql
   ALTER TABLE public.matches
   ADD COLUMN IF NOT EXISTS "round" INTEGER,
   ADD COLUMN IF NOT EXISTS match_number INTEGER;
   ```

3. **Data Not Loading**
   - Check network tab for Supabase API errors
   - Verify RLS policies allow reading matches
   - Check if user is authenticated

### Bracket Spacing Issues

If the tree layout looks cramped:

- The component calculates spacing based on round number
- Formula: `baseSpacing * 2^(maxRound - currentRound)`
- Adjust `baseSpacing` in `BracketTree.tsx` line ~86

## 📊 Database Schema

### Matches Table Structure

```sql
CREATE TABLE public.matches (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  tournament_id UUID REFERENCES tournaments(id) ON DELETE CASCADE,
  round INTEGER NOT NULL,  -- NEW: Round number (1, 2, 3, etc.)
  match_number INTEGER NOT NULL,  -- NEW: Unique match number
  player1_id UUID REFERENCES auth.users(id),
  player2_id UUID REFERENCES auth.users(id),
  spectator_id UUID REFERENCES auth.users(id),
  match_code TEXT,
  scheduled_time TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'scheduled',
  winner_id UUID REFERENCES auth.users(id),
  player1_score INTEGER,
  player2_score INTEGER,
  result_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Round Number Calculation

```typescript
// For 64 participants: rounds = log2(64) = 6 rounds
// For 32 participants: rounds = log2(32) = 5 rounds
// For 16 participants: rounds = log2(16) = 4 rounds
const rounds = Math.ceil(Math.log2(participantCount));
```

## 🎯 File Changes Summary

### New Files

- ✅ `src/components/BracketTree.tsx` - Tree bracket visualization
- ✅ `src/components/TournamentStats.tsx` - Analytics dashboard
- ✅ `TOURNAMENT_BRACKET_GUIDE.md` - This guide

### Modified Files

- ✅ `src/components/AdminBracketEditor.tsx` - Enhanced error handling and logging
- ✅ `src/app/dashboard/tournaments/[id]/page.tsx` - Uses BracketTree component
- ✅ `src/app/admin/tournaments/[id]/page.tsx` - Uses BracketTree + Stats
- ✅ Database: Added `round` and `match_number` columns to `matches` table

## 🚀 Testing Checklist

### Admin Testing

- [ ] Create a new tournament with 8+ participants
- [ ] Click "Edit Pairings"
- [ ] Click "Generate Bracket"
- [ ] Verify console shows: "Matches saved successfully: X"
- [ ] Verify bracket displays in tree format
- [ ] Check that rounds are labeled correctly (Finals, Semi-Finals, etc.)
- [ ] Verify spacing between matches looks good
- [ ] Click a match - should navigate to match detail page

### User Testing

- [ ] Navigate to tournament as a registered participant
- [ ] Verify bracket displays
- [ ] Confirm your matches are highlighted in yellow
- [ ] Click your match - should navigate to match details
- [ ] Verify match times display correctly
- [ ] Check that spectator names show when assigned

### Database Testing

```sql
-- Verify matches were created
SELECT tournament_id, round, match_number, status
FROM matches
WHERE tournament_id = 'YOUR_TOURNAMENT_ID'
ORDER BY round, match_number;

-- Check round distribution
SELECT round, COUNT(*) as match_count
FROM matches
WHERE tournament_id = 'YOUR_TOURNAMENT_ID'
GROUP BY round
ORDER BY round;
```

## 📞 Support

If you encounter issues:

1. Check browser console for error messages
2. Check Supabase logs at `https://app.supabase.com/project/xaycdennzfvqttslbpqc/logs/explorer`
3. Verify all database columns exist
4. Ensure RLS policies are correctly configured
5. Review this guide's troubleshooting section
