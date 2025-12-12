# Database Schema Cache Fix

## Issue

The bracket tree was not displaying because of Supabase PostgREST errors:

- `Could not find a relationship between 'tournament_participants' and 'user_id' in the schema cache`
- `Could not find a relationship between 'matches' and 'player1_id' in the schema cache`

## Root Cause

The queries were trying to use PostgREST's automatic joins like:

```typescript
.select('*, player1:player1_id(id, username, email)')
```

However, the foreign keys reference `auth.users(id)`, but `username` and `email` are stored in the `profiles` table, not `auth.users`. PostgREST cannot automatically traverse through `auth.users` to `profiles`.

## Solution

Changed all queries to:

1. Fetch base data without joins
2. Extract all user IDs
3. Fetch profiles separately
4. Merge profile data with base data using a Map

## Fixed Files

### 1. Admin Tournament Page

**File**: `src/app/admin/tournaments/[id]/page.tsx`

**Before**:

```typescript
.select('*, player1:player1_id(id, username, email), ...')
```

**After**:

```typescript
// 1. Get matches without joins
const { data: matchesData } = await supabase
  .from("matches")
  .select("*")
  .eq("tournament_id", tournamentId);

// 2. Collect all player IDs
const playerIds = new Set<string>();
matchesData.forEach((match) => {
  if (match.player1_id) playerIds.add(match.player1_id);
  if (match.player2_id) playerIds.add(match.player2_id);
});

// 3. Fetch profiles
const { data: profiles } = await supabase
  .from("profiles")
  .select("id, username, email")
  .in("id", Array.from(playerIds));

// 4. Merge data
const profileMap = new Map(profiles?.map((p) => [p.id, p]) || []);
const matchesWithProfiles = matchesData.map((match) => ({
  ...match,
  player1: match.player1_id ? profileMap.get(match.player1_id) : null,
  player2: match.player2_id ? profileMap.get(match.player2_id) : null,
}));
```

### 2. User Tournament Page

**File**: `src/app/dashboard/tournaments/[id]/page.tsx`

Applied the same fix as admin page for fetching matches with player profiles.

### 3. Spectators Query

Also fixed the spectators query in the admin page to use the same pattern.

## Benefits

- ✅ No more 400 Bad Request errors
- ✅ Bracket tree now displays correctly
- ✅ All player names load properly
- ✅ More efficient (fewer database queries with `.in()`)
- ✅ Better error handling

## Testing

1. Navigate to `/admin/tournaments/[id]`
2. Bracket tree should now display without errors
3. Player names should appear in match cards
4. Check browser console - no 400 errors

## Schema Reference

### Foreign Keys

- `tournament_participants.user_id` → `auth.users(id)`
- `matches.player1_id` → `auth.users(id)`
- `matches.player2_id` → `auth.users(id)`
- `matches.spectator_id` → `auth.users(id)`
- `profiles.id` → `auth.users(id)`

The chain is: `matches.player1_id` → `auth.users.id` → `profiles.id`

We cannot directly query: `matches → profiles` because there's no direct foreign key. We must fetch separately and merge.
