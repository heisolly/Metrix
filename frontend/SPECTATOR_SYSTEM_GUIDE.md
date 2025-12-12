# Spectator System Setup Guide

## Overview

Complete spectator system with dashboard and match management capabilities.

## 1. Create Spectator Account

### Step 1: Create User in Supabase Auth

1. Go to **Supabase Dashboard** → **Authentication** → **Users**
2. Click **"Add User"**
3. Fill in details:
   - **Email**: `spectator_olly@metrix.com`
   - **Password**: `Spectate1.`
   - **Auto Confirm User**: ✅ YES
4. Click **"Create User"**
5. **Copy the User ID** (UUID) that appears

### Step 2: Create Profile

1. Go to **SQL Editor**
2. Run this SQL (replace `USER_ID_HERE` with the UUID from step 1):

```sql
INSERT INTO profiles (id, username, full_name, role, created_at, updated_at)
VALUES (
  'USER_ID_HERE', -- Replace with actual UUID
  'Spectator_Olly',
  'Spectator Olly',
  'spectator',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE
SET
  username = 'Spectator_Olly',
  full_name = 'Spectator Olly',
  role = 'spectator';
```

### Step 3: Verify Account

```sql
SELECT id, username, full_name, role
FROM profiles
WHERE username = 'Spectator_Olly';
```

## 2. Spectator Login Credentials

**Email**: `spectator_olly@metrix.com`  
**Password**: `Spectate1.`

## 3. Spectator Dashboard Access

### Routes Created:

- **Dashboard**: `/spectator/dashboard`
- **Match Management**: `/spectator/matches/[id]`

### Features:

✅ View all matches (live, upcoming, completed)  
✅ Search and filter matches  
✅ Stats overview  
✅ Manage live match scores  
✅ Update kills, deaths, timer, rounds  
✅ Real-time auto-save (100ms)  
✅ Same capabilities as admin for match management

## 4. How Spectators Work

### Workflow:

1. **Login** with spectator credentials
2. **Navigate** to `/spectator/dashboard`
3. **View** all matches
4. **Click** on a match to manage it
5. **Update** live stats (kills, deaths, timer)
6. **Stats sync** automatically to user pages

### Permissions:

- ✅ View all matches
- ✅ Edit match statistics
- ✅ Update live scores
- ✅ Manage timers
- ❌ Cannot create/delete matches
- ❌ Cannot edit tournament settings

## 5. Match Management

### Live Match Controls:

- **Player 1 Kills/Deaths** - Update scores
- **Player 2 Kills/Deaths** - Update scores
- **Timer** - Start/Stop/Reset countdown
- **Current Round** - Track round number
- **Notes** - Add match notes

### Auto-Save:

- Saves every **100ms** (0.1 seconds)
- Real-time sync to database
- Users see updates instantly

## 6. Files Created

### Pages:

1. `/src/app/spectator/dashboard/page.tsx` - Main dashboard
2. `/src/app/spectator/matches/[id]/page.tsx` - Match management (copy from admin)

### SQL:

1. `create_spectator_account.sql` - Account setup instructions
2. `create_spectator_applications_table.sql` - Applications table

### Admin:

1. `/admin/spectators` - View/approve applications

## 7. Testing the System

### Test Flow:

1. **Create spectator account** (follow steps above)
2. **Login** at `/signin` with spectator credentials
3. **Navigate** to `/spectator/dashboard`
4. **Select** a live match
5. **Update** scores and timer
6. **Verify** changes appear on user match pages

## 8. Spectator vs Admin

| Feature            | Spectator | Admin |
| ------------------ | --------- | ----- |
| View Matches       | ✅        | ✅    |
| Edit Match Stats   | ✅        | ✅    |
| Manage Timer       | ✅        | ✅    |
| Create Matches     | ❌        | ✅    |
| Delete Matches     | ❌        | ✅    |
| Create Tournaments | ❌        | ✅    |
| Manage Users       | ❌        | ✅    |
| View Applications  | ❌        | ✅    |

## 9. Earnings Tracking

Spectators earn **₦10,000 per tournament**. To track:

1. Admin approves spectator application
2. Spectator manages matches
3. Admin tracks completed tournaments
4. Payment processed weekly

## 10. Next Steps

1. ✅ Run SQL to create spectator account
2. ✅ Test login with credentials
3. ✅ Navigate to spectator dashboard
4. ✅ Test match management
5. ✅ Verify real-time updates work

## Summary

The spectator system is ready! Spectators can:

- Login with their credentials
- View all matches
- Manage live match statistics
- Earn ₦10,000 per tournament

All files are created and ready to use! 🎮👁️✅
