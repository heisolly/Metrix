# Editable Countdown System - Complete Guide

## 🎯 What Was Added

Admins can now **fully control** when and how countdowns appear for matches and tournaments!

### ✅ New Features

1. **Countdown Editor** - Admin UI to configure countdowns
2. **Auto-trigger** - Countdown appears when match/tournament is created
3. **Flexible Start Time** - Admin can set when countdown starts
4. **Toggle On/Off** - Show/hide countdown anytime
5. **Custom Target** - Override scheduled time

## 📊 Database Changes

Added to both `matches` and `tournaments` tables:

```sql
- show_countdown BOOLEAN (default: TRUE)
- countdown_start_time TIMESTAMP (optional custom start)
```

**How it works**:

- `show_countdown = TRUE` → Countdown displays
- `show_countdown = FALSE` → Countdown hidden
- `countdown_start_time = null` → Uses scheduled_time
- `countdown_start_time = set` → Uses custom time

## 🎨 Countdown Editor Component

### Location

Appears on match edit page: `/admin/matches/[id]/edit`

### Options

#### 1. Enable/Disable Toggle

Beautiful animated toggle:

- **ON** (Green) - Countdown visible to users
- **OFF** (Gray) - Countdown hidden

#### 2. Start Time Options

**Option A: Immediately**

- Countdown starts right now
- Good for announcing urgent matches
- Target: Scheduled time
- Example: Start countdown 1 hour before match

**Option B: Use Scheduled Time** (Default)

- Countdown to `scheduled_time`
- Automatic, no custom config needed
- Most common option
- Example: Match at 2pm → Count to 2pm

**Option C: Custom Time**

- Set specific start time
- Full date/time picker
- Target: Your custom time
- Example: Start countdown 24 hours before

### Visual Design

```
┌────────────────────────────────────┐
│ 🕐 Countdown Settings              │
├────────────────────────────────────┤
│                                    │
│ Show Countdown      [●────] ON    │
│                                    │
│ When should countdown start?       │
│                                    │
│ ○ Immediately                      │
│   Start countdown right now        │
│                                    │
│ ● Use Scheduled Time               │
│   Count to Dec 15, 2:00 PM        │
│                                    │
│ ○ Custom Time                      │
│   [Date/Time Picker]              │
│                                    │
│ ┌──────────────────────────────┐  │
│ │ Preview:                      │  │
│ │ Countdown to Dec 15, 2:00 PM  │  │
│ │ 📅 Uses scheduled time        │  │
│ └──────────────────────────────┘  │
│                                    │
│ [💾 Save Countdown Settings]      │
└────────────────────────────────────┘
```

## 🚀 How to Use

### For Admins:

#### Step 1: Create a Match

1. Go to `/admin/matches/create`
2. Fill match details
3. Set scheduled time
4. Click "Create Match"
5. **Countdown auto-enabled** ✅

#### Step 2: Configure Countdown

1. Go to `/admin/matches/[id]/edit`
2. Scroll to "Countdown Settings"
3. Choose options:
   - **Toggle ON/OFF**
   - **Pick start time option**
   - **Set custom time** (if needed)
4. Click "Save Countdown Settings"

#### Step 3: Verify

1. Click "Preview as Player"
2. See countdown if enabled
3. Adjust as needed

### For Users:

**Automatic Display**:

- Users visit `/dashboard/matches/[id]`
- If `show_countdown = TRUE` → Countdown appears
- If `show_countdown = FALSE` → No countdown

**What They See**:

```
┌─────────────────────────────────┐
│  COD Tournament - Round 1       │
│  ═══════════════════════════    │
│                                 │
│   02  :  45  :  30  :  15      │
│  HOURS  MINUTES SECONDS         │
│                                 │
└─────────────────────────────────┘

[Player Info Below]
[Room Codes Below]
```

## 📝 Usage Examples

### Example 1: Standard Match

**Admin sets**:
-show_countdown: TRUE

- Start option: "Use Scheduled Time"

**Result**:

- Countdown appears on match page
- Counts to scheduled_time
- Shows days/hours/minutes/seconds

### Example 2: Urgent Match

**Admin sets**:

- show_countdown: TRUE
- Start option: "Immediately"

**Result**:

- Countdown starts NOW
- Players see it immediately
- Builds urgency

### Example 3: Hidden Countdown

**Admin sets**:

- show_countdown: FALSE

**Result**:

- No countdown displays
- Match info still shows
- Less pressure on players

### Example 4: Custom Announcement

**Admin sets**:

- show_countdown: TRUE
- Start option: "Custom Time"
- Custom time: 24 hours before match

**Result**:

- Countdown targets custom time
- Can start countdown early
- Build anticipation

## 💡 Use Cases

### 1. Tournament Finals

```typescript
show_countdown: true;
start_option: "custom";
custom_time: "24 hours before finals";
```

**Why**: Build excitement, give notice

### 2. Regular Match

```typescript
show_countdown: true;
start_option: "scheduled";
```

**Why**: Simple, automatic

### 3. Practice Match

```typescript
show_countdown: false;
```

**Why**: No pressure, casual

### 4. Last-Minute Match

```typescript
show_countdown: true;
start_option: "now";
```

**Why**: Urgent notification

## 🔧 Technical Implementation

### Database Query

```typescript
// Fetch match with countdown settings
const { data: match } = await supabase
  .from("matches")
  .select("*, show_countdown, countdown_start_time, scheduled_time")
  .eq("id", matchId)
  .single();

// Determine countdown target
const target = match.countdown_start_time || match.scheduled_time;

// Show countdown?
const shouldShow =
  match.show_countdown !== false && match.status === "scheduled";
```

### Countdown Display Logic

```tsx
{
  match.show_countdown !== false && match.status === "scheduled" && (
    <Countdown
      targetDate={match.countdown_start_time || match.scheduled_time}
      title={`{match.tournament?.name} - Round {match.round}`}
      variant="neon"
    />
  );
}
```

### Save Handler

```typescript
const handleSaveCountdown = async (settings) => {
  await supabase
    .from("matches")
    .update({
      show_countdown: settings.show_countdown,
      countdown_start_time: settings.countdown_start_time,
    })
    .eq("id", matchId);
};
```

## 🎯 Where Countdowns Appear

**When Enabled (`show_countdown = TRUE`):**

1. **User Match Page** (`/dashboard/matches/[id]`)
   - Auto-displays for scheduled matches
   - Uses neon variant
   - Full-width, prominent

2. **Admin Matches List** (`/admin/matches`)
   - Toggle per match
   - Expandable countdown
   - Quick preview

3. **Tournament Page** (can be added)
   - Shows tournament countdown
   - Overview of upcoming matches

4. **Homepage** (can be added)
   - Featured match countdowns
   - Tournament announcements

## 🛠️ Admin Workflow

```
1. Create Match
   ↓
2. Match auto-created with show_countdown=TRUE
   ↓
3. Go to Edit page
   ↓
4. Configure countdown:
   - Enable/Disable
   - Set start time
   - Preview
   ↓
5. Save settings
   ↓
6. Countdown appears for users ✅
```

## 📊 Countdown States

### Active States

- **Counting** - Showing time remaining
- **Completed** - "TIME'S UP!" screen
- **Hidden** - Admin disabled

### Display Conditions

```typescript
// Shows when ALL are true:
1. show_countdown !== false
2. status === 'scheduled'
3. Target time is in future
```

## 🎨 Variants Available

**For Matches**:

- `neon` (Purple/Pink) - Recommended
- `default` (Red/Orange)

**For Tournaments**:

- `fire` (Red/Orange) - Recommended
- `neon` (Purple/Pink)

**For Events**:

- `ice` (Blue/Cyan) - Recommended

## ✅ Summary

### What Admins Can Do:

- ✅ **Toggle countdown** on/off anytime
- ✅ **Choose start time** (now/scheduled/custom)
- ✅ **Preview** before publishing
- ✅ **Edit anytime** - Update settings any time

### What Triggers:

- ✅ **Auto-enabled** when match created
- ✅ **Auto-displays** on match page (if enabled)
- ✅ **Updates live** every second
- ✅ **Completes automatically** at target time

### Files Changed:

1. ✅ `src/components/CountdownEditor.tsx` - Editor component
2. ✅ `src/app/admin/matches/[id]/edit/page.tsx` - Added editor
3. ✅ `src/app/dashboard/matches/[id]/page.tsx` - Auto-display
4. ✅ Database: Added `show_countdown` and `countdown_start_time` columns

The countdown system is now fully editable by admins and triggers automatically! 🎉
