# Tournament Bracket System - Implementation Plan

## 🎯 **Overview**

A complete tournament bracket/pairing system where:

- **Admins** can create, edit, and manage match pairings
- **Players** can view their matches and opponents
- **Public** can see the tournament bracket structure

---

## 📋 **Features**

### **For Admins:**

1. ✅ Create bracket from tournament participants
2. ✅ Drag & drop players into matches
3. ✅ Set match times and rounds
4. ✅ Assign spectators to matches
5. ✅ Edit existing pairings
6. ✅ Auto-generate bracket structure

### **For Players:**

1. ✅ View tournament bracket
2. ✅ See their next match
3. ✅ View opponent details
4. ✅ See match schedule
5. ✅ Navigate to match room

### **For Public:**

1. ✅ View bracket structure
2. ✅ See match results
3. ✅ Follow tournament progress

---

## 🗂️ **Database Schema**

### **Existing Tables:**

```sql
matches
├── id (UUID)
├── tournament_id (UUID)
├── round (INTEGER)
├── match_number (INTEGER)
├── player1_id (UUID)
├── player2_id (UUID)
├── spectator_id (UUID)
├── scheduled_time (TIMESTAMPTZ)
├── status (TEXT) -- 'scheduled', 'live', 'completed'
├── winner_id (UUID)
└── created_at (TIMESTAMPTZ)
```

### **No Changes Needed!**

The existing `matches` table already has everything we need.

---

## 🎨 **UI Components**

### **1. Bracket Visualization**

- Tournament bracket tree (64 → 32 → 16 → 8 → 4 → 2 → 1)
- Match cards showing players
- Round labels
- Connection lines between rounds

### **2. Admin Controls**

- [Edit Pairings] button (admin only)
- [Generate Bracket] button
- [Save Changes] button
- Drag & drop interface
- Time picker for each match
- Spectator assignment dropdown

### **3. Player View**

- Read-only bracket
- Highlighted user's matches
- "Your Next Match" indicator
- Click to view match details

---

## 🔄 **Workflows**

### **Admin Creates Bracket:**

1. Admin goes to `/admin/tournaments/:id`
2. Clicks "Generate Bracket"
3. System creates bracket structure based on participant count
4. Admin can edit pairings, times, spectators
5. Clicks "Save Pairings"
6. Matches created in database
7. Players see their matches

### **Player Views Bracket:**

1. Player goes to tournament page
2. Sees bracket with all matches
3. Their matches are highlighted
4. Clicks match to see details
5. Can navigate to match room when live

### **Admin Edits Pairings:**

1. Admin clicks "Edit Pairings"
2. Drag & drop to swap players
3. Update times/spectators
4. Save changes
5. Affected players' dashboards update

---

## 📁 **Files to Create/Modify**

### **New Components:**

1. `src/components/TournamentBracket.tsx` - Bracket visualization
2. `src/components/BracketMatch.tsx` - Individual match card
3. `src/components/AdminBracketEditor.tsx` - Admin edit interface

### **Modified Pages:**

1. `src/app/admin/tournaments/[id]/page.tsx` - Add bracket section
2. `src/app/dashboard/tournaments/[id]/page.tsx` - Player bracket view
3. `src/app/dashboard/overview/page.tsx` - Next match widget

### **New API Functions:**

1. `generateBracket()` - Auto-create bracket structure
2. `updateMatchPairings()` - Save admin edits
3. `getPlayerMatches()` - Fetch user's matches

---

## 🎯 **Bracket Structure**

### **Single Elimination (64 players):**

```
Round 1: 32 matches (64 players)
Round 2: 16 matches (32 players)
Round 3: 8 matches (16 players)
Round 4: 4 matches (8 players - Quarterfinals)
Round 5: 2 matches (4 players - Semifinals)
Round 6: 1 match (2 players - Finals)
```

### **Match Numbering:**

```
Round 1: Match 1-32
Round 2: Match 33-48
Round 3: Match 49-56
Round 4: Match 57-60
Round 5: Match 61-62
Round 6: Match 63
```

---

## 🚀 **Implementation Steps**

### **Phase 1: Bracket Generation**

1. Create bracket generation algorithm
2. Handle different participant counts (16, 32, 64)
3. Create matches in database
4. Handle byes for odd numbers

### **Phase 2: Bracket Visualization**

1. Create responsive bracket component
2. Show rounds and matches
3. Display player names
4. Show match status

### **Phase 3: Admin Controls**

1. Add edit mode toggle
2. Implement drag & drop
3. Add time picker
4. Add spectator assignment
5. Save functionality

### **Phase 4: Player Integration**

1. Update dashboard widget
2. Add match details page
3. Highlight user's matches
4. Add navigation to match room

---

## 🎨 **Visual Design**

### **Bracket Layout:**

```
┌─────────────────────────────────────────────────┐
│  ROUND 1    ROUND 2    ROUND 3    FINALS        │
│                                                  │
│  Match 1 ──┐                                    │
│            ├─ Match 33 ──┐                      │
│  Match 2 ──┘             │                      │
│                          ├─ Match 49 ──┐        │
│  Match 3 ──┐             │             │        │
│            ├─ Match 34 ──┘             │        │
│  Match 4 ──┘                           ├─ Winner│
│                                        │        │
│  Match 5 ──┐                           │        │
│            ├─ Match 35 ──┐             │        │
│  Match 6 ──┘             │             │        │
│                          ├─ Match 50 ──┘        │
│  Match 7 ──┐             │                      │
│            ├─ Match 36 ──┘                      │
│  Match 8 ──┘                                    │
└─────────────────────────────────────────────────┘
```

### **Match Card:**

```
┌──────────────────────────┐
│  Match #1 - Round 1      │
│  ──────────────────────  │
│  🎮 Player A             │
│      vs                  │
│  🎮 Player B             │
│  ──────────────────────  │
│  📅 Dec 10, 11:00 AM     │
│  👁️ Spectator: John      │
│  Status: Scheduled       │
└──────────────────────────┘
```

---

## 🔧 **Technical Details**

### **Bracket Generation Algorithm:**

```typescript
function generateBracket(participants: User[], tournamentId: string) {
  const playerCount = participants.length;
  const rounds = Math.ceil(Math.log2(playerCount));

  // Round 1: Pair all players
  const round1Matches = [];
  for (let i = 0; i < playerCount; i += 2) {
    round1Matches.push({
      player1: participants[i],
      player2: participants[i + 1] || null, // Handle odd numbers
      round: 1,
      match_number: i / 2 + 1,
    });
  }

  // Create subsequent rounds (empty, to be filled by winners)
  // ...
}
```

### **Drag & Drop:**

```typescript
// Using react-beautiful-dnd or similar
const onDragEnd = (result) => {
  if (!result.destination) return;

  const { source, destination } = result;
  // Swap players between matches
  updateMatchPairings(source, destination);
};
```

---

## ✅ **Success Criteria**

### **Admin Can:**

- ✅ Generate bracket automatically
- ✅ Edit any match pairing
- ✅ Set match times
- ✅ Assign spectators
- ✅ Save changes
- ✅ View bracket structure

### **Player Can:**

- ✅ See tournament bracket
- ✅ Find their matches easily
- ✅ View opponent info
- ✅ See match schedule
- ✅ Navigate to match room

### **System:**

- ✅ Auto-updates player dashboards
- ✅ Handles different tournament sizes
- ✅ Manages match progression
- ✅ Tracks winners

---

## 📊 **Data Flow**

```
Admin Creates Bracket
        ↓
Generate matches in DB
        ↓
Players see matches
        ↓
Match starts (status: live)
        ↓
Spectator verifies result
        ↓
Winner advances to next round
        ↓
Bracket updates automatically
```

---

## 🎉 **Benefits**

### **For Admins:**

- Easy tournament management
- Visual bracket editor
- Flexible pairing control
- Quick setup

### **For Players:**

- Clear match schedule
- Know opponents in advance
- Easy navigation
- Tournament progress tracking

### **For Platform:**

- Professional tournament system
- Automated match progression
- Better user experience
- Scalable structure

---

## 📝 **Next Steps**

1. Create bracket generation algorithm
2. Build bracket visualization component
3. Add admin edit controls
4. Integrate with tournament page
5. Update player dashboard
6. Test with different tournament sizes

---

**Ready to implement!** 🚀
