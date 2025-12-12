# Admin Match Management & Countdown System

## 🎯 Overview

A complete admin match management system with spectacular countdown features:

- **All Match Actions**: View, Edit, Delete, Start, Cancel
- **Countdown System**: Animated countdowns with crazy fonts and effects
- **Filters & Search**: Find matches quickly
- **Real-time Updates**: Live status changes

## ✅ What Was Created

### 1. **Countdown Component** (`src/components/Countdown.tsx`)

#### Features:

- ✨ **Animated Digits** - Numbers flip when they change
- 🎨 **Multiple Variants**:
  - `default` - Red/Orange (General use)
  - `neon` - Purple/Pink (Match countdowns)
  - `fire` - Red/Orange (Tournament countdowns)
  - `ice` - Blue/Cyan (Event countdowns)
- 🔤 **Crazy Fonts**:
  - Orbitron (Sci-fi style)
  - Rajdhani (Tech style)
  - Monospace fallbacks
- ⚡ **Glowing Effects**:
  - Neon glow around numbers
  - Pulsing corners
  - Animated separators
- ⏱️ **Auto-updates** every second
- 🎉 **Completion callback**

#### Visual Design:

```
┌─────────────────────────────────────┐
│      🕐 MATCH STARTING SOON         │
│   ================================  │
│                                     │
│   ╔══╗  ╔══╗    ╔══╗  ╔══╗        │
│   ║ 02 ║  ║ 45 ║ :  ║ 30 ║ :  ║ 15 ║ │
│   ╚══╝  ╚══╝    ╚══╝  ╚══╝        │
│   HOURS  MINUTES  SECONDS          │
│                                     │
└─────────────────────────────────────┘
```

#### Usage:

```typescript
import Countdown from '@/components/Countdown';

// Basic countdown
<Countdown
  targetDate="2025-01-15T14:00:00Z"
  title="Match Starts In"
/>

// With variant and callback
<Countdown
  targetDate={match.scheduled_time}
  title="TOURNAMENT FINALS"
  variant="fire"
  onComplete={() => alert('Match started!')}
/>

// Preset variants
<TournamentCountdown targetDate={date} title="Tournament" />
<MatchCountdown targetDate={date} title="Match" />
<EventCountdown targetDate={date} title="Event" />
```

### 2. **Admin Matches Page** (`/admin/matches`)

#### All Features:

**Match Display**:

- ✅ All matches in database
- ✅ Tournament name
- ✅ Player names
- ✅ Match status badges
- ✅ Scheduled time
- ✅ Match code
- ✅ Round number

**Actions for Each Match**:

1. **⏰ Countdown** - Show/hide countdown timer
2. **▶️ Start** - Change status to 'live' (for scheduled matches)
3. **✏️ Edit** - Edit match details and room codes
4. **👁️ View** - Preview as player (opens in new tab)
5. **❌ Cancel** - Cancel scheduled match
6. **🗑️ Delete** - Permanently remove match

**Filters**:

- 🔍 **Search Bar**: Search by player, tournament, or match code
- 🎯 **Status Filter**: All, Scheduled, Live, Completed, Cancelled, Disputed

**Status Badges**:

- 🟢 **Live** - Green, pulsing
- 🔵 **Scheduled** - Blue
- ⚪ **Completed** - White
- 🟡 **Disputed** - Yellow
- 🔴 **Cancelled** - Red

## 🎮 How to Use

### Admin Workflow:

#### 1. View All Matches

1. Go to `/admin/matches`
2. See all matches listed
3. Use filters/search to find specific matches

#### 2. Start a Match

1. Find scheduled match
2. Click **"Start"** button
3. Status changes to "Live"
4. Players see match is active

#### 3. Show Countdown

1. Click **"Countdown"** button on scheduled match
2. Spectacular countdown appears
3. Shows days/hours/minutes/seconds until match
4. Click again to hide

#### 4. Edit Match

1. Click **"Edit"** button
2. Opens match editor
3. Update room codes, player IDs, etc.
4. Save changes

#### 5. Cancel Match

1. Click **"Cancel"** button
2. Confirm action
3. Status changes to "Cancelled"
4. Players notified

#### 6. Delete Match

1. Click **"Delete"** button
2. Confirm (this is permanent!)
3. Match removed from database

### Countdown Usage:

**On Match Cards**:

- Click "Countdown" button
- Countdown expands below match info
- Shows time until scheduled_time
- Updates every second
- Auto-hides when match starts

**On Pages**:

```tsx
// Tournament page
<TournamentCountdown
  targetDate={tournament.start_date}
  title={tournament.name}
/>

// Match detail page
<MatchCountdown
  targetDate={match.scheduled_time}
  title="Match Starting"
/>
```

## 🎨 Countdown Variants

### 1. Default (Red/Orange)

```typescript
<Countdown targetDate={date} variant="default" />
```

- Red to orange gradient
- Fire-like glow
- Use for general countdowns

### 2. Neon (Purple/Pink)

```typescript
<Countdown targetDate={date} variant="neon" />
```

- Purple to pink gradient
- Electric glow
- Use for match countdowns

### 3. Fire (Red/Orange)

```typescript
<Countdown targetDate={date} variant="fire" />
```

- Intense red/orange
- Flame-like effects
- Use for tournaments

### 4. Ice (Blue/Cyan)

```typescript
<Countdown targetDate={date} variant="ice" />
```

- Cool blue/cyan
- Frozen glow
- Use for special events

## 💻 Technical Details

### Admin Matches Page Structure:

**State Management**:

```typescript
const [matches, setMatches] = useState<any[]>([]);
const [filterStatus, setFilterStatus] = useState("all");
const [searchTerm, setSearchTerm] = useState("");
const [showCountdown, setShowCountdown] = useState<string | null>(null);
```

**Data Fetching**:

- Fetches matches from `matches` table
- Fetches profiles separately (no RLS issues)
- Fetches tournaments separately
- Merges data client-side

**Actions Implementation**:

```typescript
// Start match
const handleStartMatch = async (matchId: string) => {
  await supabase.from("matches").update({ status: "live" }).eq("id", matchId);
};

// Cancel match
const handleCancelMatch = async (matchId: string) => {
  await supabase
    .from("matches")
    .update({ status: "cancelled" })
    .eq("id", matchId);
};

// Delete match
const handleDeleteMatch = async (matchId: string) => {
  await supabase.from("matches").delete().eq("id", matchId);
};
```

### Countdown Component Logic:

**Time Calculation**:

```typescript
function calculateTimeLeft() {
  const difference = +new Date(targetDate) - +new Date();

  if (difference > 0) {
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }
  return { days: 0, hours: 0, minutes: 0, seconds: 0 };
}
```

**Auto-update**:

```typescript
useEffect(() => {
  const timer = setInterval(() => {
    const newTimeLeft = calculateTimeLeft();
    setTimeLeft(newTimeLeft);

    if (allZeros) {
      setIsComplete(true);
      onComplete?.();
    }
  }, 1000);

  return () => clearInterval(timer);
}, []);
```

**Animations**:

```typescript
// Flip animation when number changes
<AnimatePresence mode="wait">
  <motion.div
    key={value}
    initial={{ y: -20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    exit={{ y: 20, opacity: 0 }}
  >
    {value}
  </motion.div>
</AnimatePresence>

// Pulsing glow
<motion.div
  animate={{ opacity: [0.5, 1, 0.5] }}
  transition={{ duration: 2, repeat: Infinity }}
/>
```

## 🎯 Page URLs

**Admin Matches**: `/admin/matches`
**Create Match**: `/admin/matches/create`
**Edit Match**: `/admin/matches/[matchId]/edit`
**View Match**: `/dashboard/matches/[matchId]`
**Disputes**: `/admin/matches?tab=disputes`

## 🎨 Visual Effects

### Countdown Effects:

1. **Glow Rings** - Around each time unit
2. **Animated Corners** - Pulsing corner accents
3. **Number Flip** - Smooth transition when changing
4. **Separator Pulse** - Colons between units pulse
5. **Title Animation** - Rotating clock icon
6. **Progress Bar** - Pulsing bar at bottom
7. **Text Shadow** - Neon glow on numbers

### Match Card Effects:

1. **Hover Border** - Red glow on hover
2. **Status Badges** - Color-coded with pulse on "Live"
3. **Expand/Collapse** - Smooth countdown reveal
4. **Button Hover** - Scale and glow effects
5. **Stagger Animation** - Cards fade in sequentially

## 📊 Status Management

**All Statuses**:

- `scheduled` - Match is planned
- `live` - Currently in progress
- `completed` - Match finished
- `cancelled` - Admin cancelled
- `disputed` - Under review

**Status Flow**:

```
scheduled → live → completed
    ↓
cancelled (admin action)
    ↓
disputed (if issues)
```

## 🚀 Examples

### Example 1: Tournament Page with Countdown

```tsx
// In tournament page
<div className="mb-8">
  <TournamentCountdown
    targetDate={tournament.start_date}
    title={`{tournament.name} STARTS IN`}
  />
</div>
```

### Example 2: Match with Multiple Actions

```tsx
// Admin can:
1. Click "Countdown" - See time remaining
2. Click "Start" - Begin match immediately
3. Click "Edit" - Update room codes
4. Click "View" - See player view
5. Click "Cancel" - Stop the match
6. Click "Delete" - Remove permanently
```

### Example 3: Filtered Match List

```tsx
// Search for specific player
<input value={searchTerm} onChange={setSearchTerm} />
// Shows only matches with that player

// Filter by status
<select value={filterStatus} onChange={setFilterStatus}>
  <option value="live">Live Only</option>
</select>
// Shows only live matches
```

## 💡 Tips

**For Admins**:

1. **Use Countdown** - Build hype for big matches
2. **Start Early** - Give players buffer time
3. **Check Edit First** - Ensure room codes are set before starting
4. **Preview** - Use "View" to see what players see
5. **Search is Powerful** - Search by tournament name, player, or code

**Countdown Best Practices**:

1. **Show 24h+ before** - Build anticipation
2. **Display on homepage** - For big tournaments
3. **Use right variant** - Fire for tournaments, Neon for matches
4. **Test timing** - Ensure timezone handling is correct

## ✅ Summary

You now have:

- ✅ **Full match management** at `/admin/matches`
- ✅ **All CRUD actions** (Create, Read, Update, Delete)
- ✅ **Spectacular countdowns** with animations
- ✅ **4 visual variants** for different events
- ✅ **Crazy fonts** (Orbitron, Rajdhani)
- ✅ **Search & filters** for finding matches
- ✅ **Status management** (Start, Cancel, etc.)
- ✅ **Real-time updates** every second

Admins have complete control over all matches with beautiful visual feedback! 🎉
