# Making Tournament Brackets Clickable

## Overview

Allow users to click on matches in the tournament bracket to view live match details, stats, and timer.

## Implementation Guide

### Step 1: Add Click Handler to Bracket Component

The `TournamentBracket` component already supports `onMatchClick` prop (line 111 in TournamentBracket.tsx).

### Step 2: Add Navigation in Parent Component

Wherever you use `<TournamentBracket>`, add the `onMatchClick` handler:

```tsx
import { useRouter } from "next/navigation";
import TournamentBracket from "@/components/TournamentBracket";

export default function TournamentPage() {
  const router = useRouter();

  const handleMatchClick = (match: any) => {
    // Navigate to match detail page
    router.push(`/dashboard/matches/{match.id}`);
  };

  return (
    <TournamentBracket
      matches={matches}
      onMatchClick={handleMatchClick}
      currentUserId={user?.id}
    />
  );
}
```

### Step 3: What Users Will See

When they click a match in the bracket:

1. **Navigate to** `/dashboard/matches/[matchId]`
2. **See live stats** (kills, deaths, K/D, timer)
3. **If they're a player**: See room code, password, loadout rules
4. **If they're a spectator**: See only public stats

### Example Implementation for Admin Tournament Page

```tsx
// src/app/admin/tournaments/[id]/page.tsx

import { useRouter } from "next/navigation";

export default function AdminTournamentDetailPage() {
  const router = useRouter();

  const handleMatchClick = (match: any) => {
    // Admins go to admin match control page
    router.push(`/admin/matches/{match.id}`);
  };

  return (
    <TournamentBracket
      matches={matches}
      onMatchClick={handleMatchClick}
      isAdmin={true}
    />
  );
}
```

### Example Implementation for Public Tournament Page

```tsx
// src/app/tournaments/[id]/page.tsx

import { useRouter } from "next/navigation";

export default function PublicTournamentPage() {
  const router = useRouter();

  const handleMatchClick = (match: any) => {
    // Public users go to user match view
    router.push(`/dashboard/matches/{match.id}`);
  };

  return (
    <TournamentBracket
      matches={matches}
      onMatchClick={handleMatchClick}
      currentUserId={user?.id}
    />
  );
}
```

## Visual Feedback

The bracket already shows:

- ✅ **Hover effect** - Border changes to red on hover
- ✅ **Cursor pointer** - Shows it's clickable
- ✅ **Chevron icon** - Appears on hover (ChevronRight)
- ✅ **LIVE indicator** - Pulsing green dot for live matches
- ✅ **Winner trophy** - Shows on completed matches

## User Experience Flow

### For Players:

```
1. View tournament bracket
2. Click on their match
3. See match detail page with:
   - Room code (copy button)
   - Room password (copy button)
   - Prohibited weapons
   - Allowed weapons
   - Live stats
   - Timer countdown
```

### For Spectators:

```
1. View tournament bracket
2. Click on any match
3. See match detail page with:
   - Player names
   - Live stats (kills, deaths, K/D)
   - Timer countdown
   - Current round
   - NO room code/password
```

### For Admins:

```
1. View tournament bracket
2. Click on match
3. Go to admin match control page:
   - Start/pause timer
   - Update kills/deaths
   - Set time remaining
   - Complete match
```

## Quick Implementation

Add this to any page that displays brackets:

```tsx
const router = useRouter();

<TournamentBracket
  matches={matches}
  onMatchClick={(match) => router.push(`/dashboard/matches/{match.id}`)}
  currentUserId={user?.id}
/>;
```

That's it! Matches are now clickable and navigate to the live match detail page.
