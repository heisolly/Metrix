# Live Match Timer System

## How It Works

### Admin Control (Match Control Page)

**URL**: `/admin/matches/[id]`

The admin has full control over the match timer:

1. **Timer Display**: Large red monospace digits showing MM:SS format
2. **Three Control Buttons**:
   - **Start/Pause** (Green/Yellow): Starts countdown or pauses it
   - **Set** (Blue): Opens prompt to set custom time (e.g., "5:00", "10:30")
   - **Reset** (Red): Stops timer and resets to 5:00

3. **How to Use**:

   ```
   Step 1: Click "Set" to enter desired time (e.g., "5:00")
   Step 2: Click "Start" to begin countdown
   Step 3: Timer counts down automatically: 5:00 → 4:59 → 4:58...
   Step 4: Click "Save Stats" to persist to database
   Step 5: Users will see the updated time on their page
   ```

4. **Timer Features**:
   - Counts down every second automatically
   - Can pause and resume
   - Stops at 0:00
   - Persists when saved to database

### User View (Match Detail Page)

**URL**: `/dashboard/matches/[id]`

Users see the timer set by the admin:

1. **Display Only**: Users cannot control the timer
2. **Auto-Sync**: Page refreshes every 2 seconds to show latest time
3. **Visual Alerts**:
   - Normal: Red text
   - Low Time (≤60 seconds): Pulsing red animation
4. **Label**: "Synced with Admin" to show it's controlled by admin

### Workflow Example

**Admin Side:**

```
1. Admin opens match control page
2. Clicks "Set" → enters "10:00"
3. Clicks "Start" → timer begins: 10:00, 9:59, 9:58...
4. Clicks "Save Stats" → saves to database
5. Timer continues counting down
6. At 5:00, clicks "Save Stats" again
7. Timer continues to 0:00
```

**User Side:**

```
1. User opens their match detail page
2. Sees "10:00" (from admin's last save)
3. Page refreshes every 2 seconds
4. After admin saves at 5:00, user sees "5:00" within 2 seconds
5. When timer hits ≤60 seconds, display pulses red
6. Timer shows 0:00 when match time expires
```

## Technical Details

### Database Field

- **Column**: `match_details.time_remaining`
- **Type**: String (MM:SS format)
- **Example**: "5:00", "10:30", "0:45"

### Sync Mechanism

- **Admin**: Timer runs locally with setInterval (1 second)
- **Save**: Admin clicks "Save Stats" to persist to DB
- **User**: Fetches from DB every 2 seconds
- **No Conflict**: User doesn't run local countdown, just displays DB value

### Benefits

✅ **Single Source of Truth**: Admin controls the timer
✅ **Near Real-Time**: 2-second sync keeps users updated
✅ **No Conflicts**: User page doesn't create competing timers
✅ **Reliable**: Works even if user refreshes page
✅ **Visual Feedback**: Pulsing when time is running out

## Troubleshooting

### Timer not updating for users?

- Admin must click "Save Stats" to persist changes
- User page syncs every 2 seconds after save

### Timer resets when admin refreshes?

- This is expected - timer state is in memory
- Admin should save frequently to persist progress

### Want faster sync?

- Change interval in user page: `setInterval(loadMatchDetails, 1000)` for 1-second sync
- Note: More frequent = more database queries

## Future Enhancements

Possible improvements:

- WebSocket for real-time sync (no polling)
- Server-side timer that runs independently
- Timer history/logs
- Auto-save every N seconds
- Sound alerts when time runs out
