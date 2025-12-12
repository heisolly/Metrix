# Match Detail Pages System - Complete Guide

## 🎯 Overview

A comprehensive match detail system with:

- **User-facing match pages** with all game info
- **Admin-editable templates** for different games
- **Custom fields** for room codes, player IDs, etc.
- **Copy-to-clipboard** functionality
- **Pre-built templates** for popular games

## ✅ What Was Created

### 1. Database Schema

Added new columns to `matches` table:

```sql
- room_code (TEXT) - Game room/lobby code
- room_password (TEXT) - Room password
- match_info (JSONB) - Custom fields storage
- template_id (TEXT) - Selected template
- custom_instructions (TEXT) - Custom match instructions
```

### 2. Template System (`src/lib/matchTemplates.ts`)

Pre-built templates for:

- ✅ **Call of Duty: Warzone**
- ✅ **FIFA/FC 24**
- ✅ **Fortnite**
- ✅ **Valorant**
- ✅ **Generic** (for any game)

### 3. User Match Page (`/dashboard/matches/[id]`)

Players can view:

- Tournament and match info
- Opponents and spectator
- Room codes with copy button
- Game-specific details (Activision ID, PSN, etc.)
- Match instructions
- Status and schedule

### 4. Admin Editor (`/admin/matches/[id]/edit`)

Admins can:

- Select game template
- Fill in match details
- Set room codes
- Add custom instructions
- Preview as player

## 🎮 Available Templates

### 1. Call of Duty: Warzone

**Fields:**

- Room Code
- Room Password
- Game Mode (BR, Resurgence, etc.)
- Map selection
- Team Size
- Player Activision IDs
- Spectator Activision ID
- Custom Rules

**Use Case:** Perfect for COD tournaments with private lobbies

### 2. FIFA/FC 24

**Fields:**

- Platform (PlayStation, Xbox, PC)
- Player usernames

- Match duration
- Difficulty
- Squad type

**Use Case:** FIFA competitive matches

### 3. Fortnite

**Fields:**

- Custom Match Key
- Server Region
- Game Mode
- Player Epic IDs
- Match Rules

**Use Case:** Fortnite custom games

### 4. Valorant

**Fields:**

- Server selection
- Map
- Match type
- Riot IDs
- Overtime settings

**Use Case:** Valorant competitive matches

### 5. Generic/Custom

**Fields:**

- Game name
- Platform
- Usernames
- Lobby details
- Match settings

**Use Case:** Any game not covered above

## 📖 How to Use

### For Admins:

#### Step 1: Create a Match

1. Go to `/admin/matches/create`
2. Fill basic match info (tournament, players, date)
3. Click "Create Match"

#### Step 2: Set Up Match Details

1. Go to tournament page
2. Find the match in bracket
3. Click match to view
4. Click "Edit Match Setup" or go to `/admin/matches/[matchId]/edit`

#### Step 3: Choose Template

1. Select game template (COD, FIFA, Fortnite, etc.)
2. Template automatically shows relevant fields

#### Step 4: Fill Details

1. Enter room code
2. Enter room password (if any)
3. Fill all game-specific fields:
   - Player IDs/usernames
   - Game settings
   - Server/region
4. Add custom instructions if needed

#### Step 5: Save

1. Click "Save Match Setup"
2. Players can now view all details
3. Use "Preview as Player" to see what they see

### For Players:

#### View Match Details:

1. Go to `/dashboard/matches`
2. Click on a match
3. Or go directly to `/dashboard/matches/[matchId]`

#### What You'll See:

- **Match Header**: Tournament, game, status
- **Players**: Your opponent's info
- **Room Details**: Code, password, IDs (if set by admin)
- **Instructions**: How to join and play
- **Match Info**: Schedule, referee, etc.

#### Copy Details:

- Click copy icon next to any field
- Instant clipboard copy
- Green checkmark confirms

## 🎨 Template Examples

### Example 1: COD Warzone Match

```javascript
{
  template_id: 'cod_warzone',
  room_code: 'ABCD-1234',
  room_password: 'tournament',
  match_info: {
    game_mode: 'Battle Royale',
    map: 'Verdansk',
    team_size: 'Duos',
    player1_activision_id: 'Player1#1234567',
    player2_activision_id: 'Player2#7654321',
    spectator_activision_id: 'Referee#9999999',
    custom_rules: 'No vehicles, no loadout drops'
  }
}
```

**Players see:**

- Room Code: ABCD-1234 [Copy]
- Password: tournament [Copy]
- Mode: Battle Royale
- Map: Verdansk
- Team: Duos
- Opponent Activision: Player2#7654321 [Copy]
- Rules: No vehicles, no loadout drops

### Example 2: FIFA Match

```javascript
{
  template_id: 'fifa',
  match_info: {
    platform: 'PlayStation',
    player1_psn_gamertag: 'GamerPSN123',
    player2_psn_gamertag: 'OpponentPSN',
    match_duration: '6 minutes',
    difficulty: 'World Class',
    squad_type: 'Ultimate Team'
  }
}
```

### Example 3: Generic Game

```javascript
{
  template_id: 'generic',
  room_code: 'SERVER-123',
  match_info: {
    game_name: 'Rocket League',
    platform: 'PC (Steam)',
    player1_username: 'RocketPlayer1',
    player2_username: 'RocketPlayer2',
    lobby_details: 'Private match, password: rl2024',
    match_settings: 'Standard 3v3, 5 min, no bots'
  }
}
```

## 🔧 Technical Details

### Database Storage

**Structured Fields:**

- `room_code` - Plain text, easily searchable
- `room_password` - Plain text (consider encryption for production)
- `template_id` - References template in config

**Dynamic Fields (JSONB):**

- `match_info` - All template-specific fields
- Flexible schema
- Queryable with PostgreSQL JSONB functions

**Example Query:**

```sql
SELECT * FROM matches
WHERE match_info->>'game_mode' = 'Battle Royale';
```

### Template System

**Template Structure:**

```typescript
{
  id: 'cod_warzone',
  name: 'Call of Duty: Warzone',
  game: 'COD Warzone',
  color: 'from-orange-500 to-red-500',
  fields: [
    {
      key: 'room_code',
      label: 'Room Code',
      type: 'text',
      required: true
    }
  ],
  instructions: '...'
}
```

**Adding New Template:**

1. Open `src/lib/matchTemplates.ts`
2. Add new template to `MATCH_TEMPLATES` array
3. Define fields
4. Save and restart dev server

### Copy to Clipboard

**Implementation:**

```javascript
const copyToClipboard = (text: string, field: string) => {
  navigator.clipboard.writeText(text);
  setCopiedField(field);
  setTimeout(() => setCopiedField(null), 2000);
};
```

**Features:**

- Instant copy
- Visual feedback (checkmark)
- Auto-reset after 2 seconds

## 🎯 User Experience

### Player View Features:

- ✅ Clean, modern design
- ✅ "YOU'RE PLAYING" badge for participants
- ✅ Yellow highlight for user's card
- ✅ Copy buttons for all text fields
- ✅ Responsive mobile layout
- ✅ Status badges (Scheduled/Live/Completed)
- ✅ Winner highlighting (trophy icon)

### Access Control:

- ❌ Non-participants: Limited view (no room details)
- ✅ Participants: Full access to all details
- ✅ Admins: Can edit everything

## 📱 URLs

**User Match Page:**

```
/dashboard/matches/[matchId]
Example: /dashboard/matches/ce24e02f-f9be-472e-8610-45c106bb9ac0
```

**Admin Editor:**

```
/admin/matches/[matchId]/edit
Example: /admin/matches/ce24e02f-f9be-472e-8610-45c106bb9ac0/edit
```

## 🚀 Testing Checklist

### Admin Setup:

- [ ] Create a match
- [ ] Go to admin editor
- [ ] Select template
- [ ] Fill all fields
- [ ] Add room code
- [ ] Save successfully

### Player View:

- [ ] Navigate to match page
- [ ] See all details
- [ ] Copy room code (works)
- [ ] Copy player IDs (works)
- [ ] Instructions visible
- [ ] Status badge correct

### Templates:

- [ ] COD template loads
- [ ] FIFA template loads
- [ ] All fields display
- [ ] JSONB saves correctly
- [ ] Template switch works

## 💡 Tips

**For Admins:**

1. **Set up BEFORE match time** - Give players time to see details
2. **Double-check IDs** - Wrong Activision/PSN ID = frustrated players
3. **Test room codes** - Verify codes work before publishing
4. **Clear instructions** - Add any special rules
5. **Use templates** - Faster than manual entry

**For Players:**

1. **Check early** - View match details well before start time
2. **Copy everything** - Use copy buttons to avoid typos
3. **Add friends** - Some games need opponent as friend
4. **Screenshot** - Save details in case of issues

## 🎨 Customization

### Add New Template:

```typescript
// In src/lib/matchTemplates.ts
{
  id: 'apex_legends',
  name: 'Apex Legends',
  game: 'Apex Legends',
  color: 'from-red-500 to-orange-500',
  description: 'Apex Legends custom lobby',
  instructions: `
1. Join custom lobby
2. Wait for all players
3. Drop to designated location
  `,
  fields: [
    {
      key: 'lobby_code',
      label: 'Lobby Code',
      type: 'text',
      required: true
    },
    {
      key: 'player1_origin_id',
      label: 'Player 1 Origin ID',
      type: 'text',
      required: true
    }
    // Add more fields...
  ]
}
```

### Modify Styles:

**Match page colors:**

```typescript
// User page: src/app/dashboard/matches/[id]/page.tsx
const template = getTemplate(match.template_id);
// Uses: template.color for gradients
```

**Admin page sections:**

```typescript
// Admin editor: src/app/admin/matches/[id]/edit/page.tsx
// Modify className for different styles
```

## ✅ Summary

You now have:

- ✅ **5 Pre-built templates** (COD, FIFA, Fortnite, Valorant, Generic)
- ✅ **User match pages** with all game details
- ✅ **Admin template system** for easy setup
- ✅ **Copy-to-clipboard** for all fields
- ✅ **Flexible JSONB storage** for custom data
- ✅ **Beautiful, responsive design**

Players get all the info they need to join matches. Admins can set up matches in minutes using templates! 🎉
