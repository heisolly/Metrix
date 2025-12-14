# Battle Royale Tournament System Implementation Plan

## Overview

This system allows tournaments where all participants join a single game room instead of individual 1v1 matches. Perfect for Battle Royale games like PUBG Mobile, Free Fire, Call of Duty Mobile, etc.

## Database Schema Changes

### 1. Add new columns to `tournaments` table

```sql
-- Add room details to tournaments table
ALTER TABLE public.tournaments
ADD COLUMN room_code TEXT,
ADD COLUMN room_password TEXT,
ADD COLUMN map_name TEXT,
ADD COLUMN tournament_type TEXT DEFAULT 'battle_royale', -- 'battle_royale' or 'bracket'
ADD COLUMN total_rounds INTEGER DEFAULT 1,
ADD COLUMN current_round INTEGER DEFAULT 0;
```

### 2. Create `tournament_kills` table for live tracking

```sql
CREATE TABLE IF NOT EXISTS public.tournament_kills (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  tournament_id UUID REFERENCES public.tournaments(id) ON DELETE CASCADE,
  round_number INTEGER NOT NULL,
  killer_id UUID REFERENCES auth.users(id),
  victim_id UUID REFERENCES auth.users(id),
  kill_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  weapon TEXT,
  distance DECIMAL(10, 2),
  headshot BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.tournament_kills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tournament kills are viewable by everyone"
  ON public.tournament_kills FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage tournament kills"
  ON public.tournament_kills FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

### 3. Create `tournament_rounds` table

```sql
CREATE TABLE IF NOT EXISTS public.tournament_rounds (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  tournament_id UUID REFERENCES public.tournaments(id) ON DELETE CASCADE,
  round_number INTEGER NOT NULL,
  status TEXT DEFAULT 'pending', -- pending, in_progress, completed
  start_time TIMESTAMP WITH TIME ZONE,
  end_time TIMESTAMP WITH TIME ZONE,
  winner_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(tournament_id, round_number)
);

ALTER TABLE public.tournament_rounds ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tournament rounds are viewable by everyone"
  ON public.tournament_rounds FOR SELECT
  USING (true);
```

### 4. Update `tournament_participants` table

```sql
-- Add placement and round-specific stats
ALTER TABLE public.tournament_participants
ADD COLUMN placement INTEGER, -- Final placement in tournament
ADD COLUMN total_kills INTEGER DEFAULT 0,
ADD COLUMN total_damage DECIMAL(10, 2) DEFAULT 0,
ADD COLUMN survival_time INTEGER DEFAULT 0, -- in seconds
ADD COLUMN round_placements JSONB DEFAULT '[]'::jsonb; -- Array of placements per round
```

### 5. Create `live_tournament_events` table for real-time updates

```sql
CREATE TABLE IF NOT EXISTS public.live_tournament_events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  tournament_id UUID REFERENCES public.tournaments(id) ON DELETE CASCADE,
  round_number INTEGER NOT NULL,
  event_type TEXT NOT NULL, -- 'kill', 'death', 'placement', 'round_start', 'round_end'
  player_id UUID REFERENCES auth.users(id),
  data JSONB, -- Flexible field for event-specific data
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.live_tournament_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Live events are viewable by everyone"
  ON public.live_tournament_events FOR SELECT
  USING (true);
```

## Frontend Components to Create/Update

### 1. Admin: Live Tournament Management

**File:** `frontend/src/app/admin/tournaments/[id]/live/page.tsx`

- Real-time scoreboard
- Kill feed
- Player status tracking
- Round management (start/end rounds)
- Manual kill entry
- Placement updates

### 2. Admin: Tournament Room Setup

**File:** `frontend/src/app/admin/tournaments/[id]/room/page.tsx`

- Set room code
- Set room password
- Set map name
- Publish room details to participants

### 3. Player: Tournament Room Details

**File:** `frontend/src/app/dashboard/tournaments/[id]/room/page.tsx`

- View room code
- View room password
- View map name
- View current round
- View live leaderboard
- View kill feed

### 4. Player: Live Tournament View

**File:** `frontend/src/app/dashboard/tournaments/[id]/live/page.tsx`

- Real-time leaderboard
- Kill feed
- Personal stats
- Round information

## API Routes to Create

### 1. Tournament Room Management

**File:** `frontend/src/app/api/tournaments/[id]/room/route.ts`

- GET: Fetch room details
- POST: Update room details (admin only)

### 2. Live Tournament Updates

**File:** `frontend/src/app/api/tournaments/[id]/live/route.ts`

- GET: Fetch live tournament data
- POST: Submit kill/event (admin only)

### 3. Round Management

**File:** `frontend/src/app/api/tournaments/[id]/rounds/route.ts`

- GET: Fetch round data
- POST: Start new round
- PUT: End round and update placements

## Implementation Steps

1. **Database Migration** (Run SQL scripts)
2. **Create Admin Live Management Interface**
3. **Create Player Room View**
4. **Implement Real-time Updates** (using Supabase Realtime)
5. **Add Kill Tracking System**
6. **Create Leaderboard Calculations**
7. **Add Round Management**
8. **Testing and Refinement**

## Features

### Admin Features

- Set room code, password, and map before tournament starts
- Track kills in real-time
- Update player placements
- Start/end rounds
- View live statistics
- Manage tournament flow

### Player Features

- View room details (code, password, map)
- See live leaderboard
- Track personal performance
- View kill feed
- See round information
- Real-time updates

## Real-time Updates

Use Supabase Realtime subscriptions for:

- Live kill feed
- Leaderboard updates
- Round status changes
- Player eliminations

## Next Steps

1. Run database migrations
2. Create admin live management page
3. Create player room view page
4. Implement real-time subscriptions
5. Add kill tracking interface
6. Test with sample tournament
