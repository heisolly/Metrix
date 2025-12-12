# 🚀 Quick Setup Guide

## ⚠️ IMPORTANT: Run Database Schema First!

You're seeing errors because the database tables don't exist yet. Follow these steps:

### Step 1: Go to Supabase Dashboard

1. Open your browser and go to: https://supabase.com/dashboard
2. Select your project: `xaycdennzfvqttslbpqc`

### Step 2: Open SQL Editor

1. Click on **"SQL Editor"** in the left sidebar
2. Click **"New Query"**

### Step 3: Run the Database Schema

1. Open the file: `DATABASE_SCHEMA.md` in this project
2. Copy **ALL** the SQL code (everything inside the ```sql code block)
3. Paste it into the Supabase SQL Editor
4. Click **"Run"** or press `Ctrl+Enter`

### Step 4: Verify Tables Created

1. Click on **"Table Editor"** in the left sidebar
2. You should see these tables:
   - ✅ profiles
   - ✅ tournaments
   - ✅ tournament_participants
   - ✅ matches
   - ✅ transactions
   - ✅ withdrawal_requests
   - ✅ notifications
   - ✅ user_settings

### Step 5: Test the Application

1. Go back to your app: http://localhost:3000
2. Sign in with your account
3. You should now see the username setup modal
4. After setting username, the dashboard will load with empty states

## 🔧 What the Schema Does:

- **Creates all database tables** for the Metrix platform
- **Sets up Row Level Security (RLS)** to protect user data
- **Creates automatic triggers** for:
  - Auto-creating profiles when users sign up
  - Auto-updating participant counts
  - Auto-updating timestamps
- **Creates views** for leaderboard and user stats
- **Sets up functions** for balance management

## ❓ Troubleshooting:

### If you get permission errors:

- Make sure you're logged into the correct Supabase account
- Make sure you're in the correct project

### If tables already exist:

- The SQL has `IF NOT EXISTS` checks, so it's safe to run multiple times
- If you want to start fresh, you can drop all tables first (⚠️ this deletes all data!)

### If you see "relation does not exist" errors:

- This means the tables weren't created
- Check the SQL Editor for any error messages
- Make sure you copied the entire SQL code

## 📝 Next Steps After Setup:

1. ✅ Sign in to your account
2. ✅ Set your username
3. ✅ Dashboard loads with empty states (0 tournaments, 0 earnings, etc.)
4. ✅ You can now start using the platform!

---

**Need help?** Check the console for specific error messages.
