# Match Visibility Guide

## What Everyone Can See (Public)

When ANY user visits `/dashboard/matches/[id]`, they can see:

### ✅ Match Header

- Tournament name
- Game type
- Match status badge (SCHEDULED, LIVE, COMPLETED)
- "YOU'RE PLAYING" badge (if they're a player)

### ✅ Players Section

- Player 1 name, avatar, email
- Player 2 name, avatar, email
- Winner trophy icon (if match is completed)

### ✅ Live Match Stats (PUBLIC - EVERYONE CAN SEE)

This section is visible to ALL users, not just players:

**Player 1 Stats:**

- Kills (large number)
- Deaths (large number)
- K/D Ratio (calculated)

**Player 2 Stats:**

- Kills (large number)
- Deaths (large number)
- K/D Ratio (calculated)

**Match Info:**

- Time Remaining (live countdown with pulsing animation)
- Current Round
- "LIVE" indicator (pulsing green dot when in progress)
- Refresh button
- "Live sync with admin" message

### ✅ Match Info Sidebar

- Match Code
- Scheduled Time
- Round number
- Referee/Spectator (if assigned)

### ✅ Countdown (if enabled)

- Shows countdown to match start
- Visible to everyone

---

## What ONLY Players Can See (Private)

These sections are wrapped in `isPlayer &&` checks:

### 🔒 Room Details (PRIVATE)

Only visible if you are Player 1 or Player 2:

- Room Code (with copy button)
- Room Password (with copy button)
- Room Link (with copy button)
- Map
- Mode
- Prohibited Weapons
- Allowed Weapons
- Loadout Rules
- All game-specific template fields

### 🔒 Match Instructions (PRIVATE)

Only visible if you are Player 1 or Player 2:

- Template instructions
- Custom instructions from admin

### 🔒 Get Ready Section (PRIVATE)

Only visible if you are Player 1 or Player 2:

- "I'm Ready" button
- Match preparation message

---

## Example Scenarios

### Scenario 1: You are Player 1

**You see:**

- ✅ Everything (public sections)
- ✅ Room code, password, link
- ✅ Loadout rules
- ✅ Instructions
- ✅ Live stats
- ✅ Timer

### Scenario 2: You are a Spectator/Other User

**You see:**

- ✅ Player names
- ✅ Live stats (kills, deaths, K/D)
- ✅ Timer countdown
- ✅ Current round
- ✅ Match status
- ❌ NO room code
- ❌ NO room password
- ❌ NO instructions

### Scenario 3: You are Not Logged In

**You see:**

- ✅ Player names
- ✅ Live stats (kills, deaths, K/D)
- ✅ Timer countdown
- ✅ Current round
- ✅ Match status
- ❌ NO room code
- ❌ NO room password
- ❌ NO instructions

---

## How to Test

1. **As Admin:**
   - Go to `/admin/matches/[id]`
   - Start timer
   - Update kills/deaths
   - Stats auto-save every 100ms

2. **As Player 1:**
   - Go to `/dashboard/matches/[id]`
   - See room code, password, link
   - See live stats updating
   - See timer counting down

3. **As Spectator:**
   - Log in as different user
   - Go to `/dashboard/matches/[id]`
   - See live stats updating
   - See timer counting down
   - NO room code/password visible

4. **As Public User:**
   - Open incognito window
   - Go to `/dashboard/matches/[id]`
   - See live stats (if not blocked by auth)
   - NO sensitive info visible

---

## Current Implementation

The live stats section is NOT wrapped in `isPlayer` check:

```tsx
{
  /* Live Stats - Show when match is in progress or has stats */
}
{
  (match.status === "in_progress" || match.match_details) && (
    <motion.div>
      {/* This is visible to EVERYONE */}
      <h2>Live Match Stats</h2>
      {/* Player 1 kills, deaths, K/D */}
      {/* Player 2 kills, deaths, K/D */}
      {/* Timer, Round */}
    </motion.div>
  );
}
```

The room details section IS wrapped in `isPlayer` check:

```tsx
{
  /* Room Details - ONLY FOR PLAYERS */
}
{
  isPlayer && (match.room_code || Object.keys(matchInfo).length > 0) && (
    <motion.div>
      {/* This is ONLY visible to players in the match */}
      <h2>Match Details</h2>
      {/* Room code, password, link */}
      {/* Template fields */}
    </motion.div>
  );
}
```

---

## Summary

✅ **Live stats ARE visible to everyone**
✅ **Timer countdown IS visible to everyone**
✅ **Player names ARE visible to everyone**
✅ **Match status IS visible to everyone**

🔒 **Room code is ONLY for players**
🔒 **Room password is ONLY for players**
🔒 **Instructions are ONLY for players**

This is the correct implementation for a spectator-friendly tournament system!
