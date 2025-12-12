# Homepage Content Management System

## ✅ Complete Implementation

The homepage "Tournament Games" section is now fully editable by admins while preserving the exact design!

---

## 🎯 **What's Editable**

### **Section Settings**

Admins can edit:

- ✅ **Subtitle** - Small text above title ("Tournament Game")
- ✅ **Title** - Main heading ("Tournament Trending Match")
- ✅ **Tab Labels** - Button text ("All Games", "Upcoming Games", "Finished Games")
- ✅ **Visibility** - Show/hide entire section

### **Tournament Games**

Admins can manage:

- ✅ **Game Name** - PUBG MOBILE, VALORANT, etc.
- ✅ **Team Names** - Both team 1 and team 2
- ✅ **Team Logos** - Image URLs for both teams
- ✅ **Match Time** - e.g., "07:30"
- ✅ **Match Date** - e.g., "30 Dec 2024"
- ✅ **Status** - Upcoming, Live, or Finished
- ✅ **Color Theme** - 7 preset colors (red, purple, orange, blue, green, pink, yellow)
- ✅ **Display Order** - Reorder with up/down arrows
- ✅ **Visibility** - Show/hide individual games
- ✅ **Featured** - Mark as featured

---

## 📁 **Files Created/Modified**

### **Database Migration**

**File:** `migrations/create_homepage_cms.sql`

**Tables Created:**

1. `homepage_sections` - Section settings (title, subtitle, etc.)
2. `homepage_tournament_games` - Individual game entries

**Features:**

- RLS policies for security
- Indexes for performance
- Triggers for auto-updating timestamps
- Sample data pre-populated

### **Admin Page**

**File:** `src/app/admin/homepage/page.tsx`

**Features:**

- Section settings editor
- Game list with inline actions
- Add/Edit game modal
- Color picker with presets
- Reorder games (up/down arrows)
- Toggle visibility
- Delete games
- Real-time preview

### **Frontend Component**

**File:** `src/components/tournaments/TournamentGames.tsx`

**Changes:**

- Fetches data from database instead of hardcoded
- Preserves exact design
- Falls back gracefully if database fails
- Hides section if marked inactive

### **Navigation**

**File:** `src/app/admin/layout.tsx`

**Changes:**

- Added "Homepage" menu item
- Home icon imported

---

## 🗄️ **Database Schema**

### **homepage_sections**

```sql
CREATE TABLE homepage_sections (
  id UUID PRIMARY KEY,
  section_key TEXT UNIQUE NOT NULL,
  title TEXT,
  subtitle TEXT,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);
```

### **homepage_tournament_games**

```sql
CREATE TABLE homepage_tournament_games (
  id UUID PRIMARY KEY,
  game_name TEXT NOT NULL,
  team1_name TEXT NOT NULL,
  team1_logo TEXT,
  team2_name TEXT NOT NULL,
  team2_logo TEXT,
  match_time TEXT NOT NULL,
  match_date TEXT NOT NULL,
  status TEXT DEFAULT 'upcoming',
  color_primary TEXT DEFAULT '#ef4444',
  color_secondary TEXT DEFAULT '#dc2626',
  color_name TEXT DEFAULT 'red',
  is_featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);
```

---

## 🔧 **Admin Interface**

### **Access**

Navigate to: `/admin/homepage`

### **Section Settings Panel**

**View Mode:**

- Shows current subtitle, title, description
- Shows active/inactive status
- Click "Edit" button to modify

**Edit Mode:**

- Input field for subtitle
- Input field for title
- Checkbox for visibility
- "Save" button to apply changes

### **Tournament Games Panel**

**List View:**
Each game shows:

- Color indicator (left bar)
- Game name and status badge
- Team matchup (Team1 vs Team2)
- Time and date
- Action buttons:
  - 👁️ Show/Hide toggle
  - ✏️ Edit
  - 🗑️ Delete
- ⬆️⬇️ Reorder arrows

**Add/Edit Modal:**
Form fields:

- Game Name (text input)
- Status (dropdown: Upcoming/Live/Finished)
- Team 1 Name (text input)
- Team 1 Logo URL (text input)
- Team 2 Name (text input)
- Team 2 Logo URL (text input)
- Match Time (text input)
- Match Date (text input)
- Color Theme (7 color buttons)
- Featured (checkbox)
- Active/Visible (checkbox)

---

## 🎨 **Color Presets**

| Name   | Primary | Secondary |
| ------ | ------- | --------- |
| Red    | #ef4444 | #dc2626   |
| Purple | #a855f7 | #9333ea   |
| Orange | #f97316 | #ea580c   |
| Blue   | #3b82f6 | #2563eb   |
| Green  | #22c55e | #16a34a   |
| Pink   | #ec4899 | #db2777   |
| Yellow | #eab308 | #ca8a04   |

---

## 🚀 **Setup Instructions**

### **Step 1: Run Database Migration**

```sql
-- In Supabase SQL Editor
-- Run: migrations/create_homepage_cms.sql
```

This will:

- Create tables
- Set up RLS policies
- Insert sample data
- Create default section settings

### **Step 2: Verify Tables**

```sql
-- Check tables exist
SELECT * FROM homepage_sections;
SELECT * FROM homepage_tournament_games;
```

### **Step 3: Access Admin Panel**

1. Login as admin
2. Go to `/admin/homepage`
3. Start editing!

---

## 📊 **Usage Examples**

### **Example 1: Change Section Title**

1. Go to `/admin/homepage`
2. Click "Edit" on Section Settings
3. Change title to "EPIC BATTLES"
4. Click "Save Section Settings"
5. Visit homepage to see changes

### **Example 2: Add New Game**

1. Click "Add Game" button
2. Fill in form:
   - Game Name: "FORTNITE"
   - Team 1: "Storm Breakers"
   - Team 2: "Night Raiders"
   - Time: "20:00"
   - Date: "15 Jan 2025"
   - Status: "Upcoming"
   - Color: Blue
3. Click "Save Game"
4. Game appears on homepage

### **Example 3: Reorder Games**

1. Find game in list
2. Click ⬆️ to move up
3. Click ⬇️ to move down
4. Changes reflect immediately on homepage

### **Example 4: Hide a Game**

1. Find game in list
2. Click 👁️ (eye icon)
3. Game hidden from homepage
4. Click again to show

---

## 🔒 **Security**

### **Row Level Security (RLS)**

**Public Access:**

```sql
-- Anyone can view active content
SELECT * FROM homepage_sections WHERE is_active = true;
SELECT * FROM homepage_tournament_games WHERE is_active = true;
```

**Admin Access:**

```sql
-- Only admins can modify
UPDATE homepage_sections SET title = 'New Title' WHERE ...;
INSERT INTO homepage_tournament_games VALUES (...);
DELETE FROM homepage_tournament_games WHERE id = ...;
```

**Policies:**

- `Anyone can view homepage sections` - Public read
- `Admins can manage homepage sections` - Admin full access
- `Anyone can view active tournament games` - Public read
- `Admins can manage tournament games` - Admin full access

---

## 🎯 **Features**

### **✅ Implemented**

- ✅ Edit section title and subtitle
- ✅ Add/Edit/Delete tournament games
- ✅ Reorder games
- ✅ Toggle visibility
- ✅ Color theme selection
- ✅ Status management (upcoming/live/finished)
- ✅ Featured flag
- ✅ Real-time updates
- ✅ Preserves exact design
- ✅ RLS security
- ✅ Sample data included

### **🔮 Future Enhancements**

- Image upload for team logos
- Bulk operations
- Schedule automation
- Live score updates
- Analytics tracking
- Version history
- Draft/Publish workflow

---

## 🐛 **Troubleshooting**

### **Issue: Changes not showing on homepage**

**Solution:**

1. Check if section is marked "Active"
2. Check if game is marked "Active"
3. Clear browser cache
4. Verify database connection

### **Issue: Can't edit content**

**Solution:**

1. Verify you're logged in as admin
2. Check `profiles.is_admin = true`
3. Verify RLS policies are enabled

### **Issue: Database error**

**Solution:**

1. Run migration SQL file
2. Check table permissions
3. Verify Supabase connection

---

## 📝 **Database Queries**

### **Get All Active Games**

```sql
SELECT * FROM homepage_tournament_games
WHERE is_active = true
ORDER BY display_order ASC;
```

### **Update Section Title**

```sql
UPDATE homepage_sections
SET title = 'NEW TITLE'
WHERE section_key = 'tournament_games';
```

### **Add New Game**

```sql
INSERT INTO homepage_tournament_games (
  game_name, team1_name, team1_logo, team2_name, team2_logo,
  match_time, match_date, status, color_primary, color_secondary,
  color_name, display_order, is_active
) VALUES (
  'APEX LEGENDS', 'Team Alpha', '/logo1.png', 'Team Beta', '/logo2.png',
  '18:00', '20 Jan 2025', 'upcoming', '#22c55e', '#16a34a',
  'green', 10, true
);
```

### **Hide All Finished Games**

```sql
UPDATE homepage_tournament_games
SET is_active = false
WHERE status = 'finished';
```

---

## ✅ **Summary**

### **What Admins Can Do**

1. ✅ Edit section title and subtitle
2. ✅ Add new tournament games
3. ✅ Edit existing games
4. ✅ Delete games
5. ✅ Reorder games
6. ✅ Show/hide games
7. ✅ Change colors
8. ✅ Set game status
9. ✅ Mark as featured
10. ✅ Toggle section visibility

### **What's Preserved**

1. ✅ Exact design layout
2. ✅ Animations
3. ✅ Hexagonal cards
4. ✅ Color themes
5. ✅ VS badge
6. ✅ Team logos
7. ✅ Tab filtering
8. ✅ Responsive design

### **Result**

**The homepage tournament section is now fully editable by admins without breaking the design!** 🎉

---

## 🎉 **Access Points**

**Admin Panel:** `/admin/homepage`  
**Homepage View:** `/` (Tournament Games section)  
**Database:** Supabase tables `homepage_sections` and `homepage_tournament_games`

**Everything is ready to use!** 🚀
