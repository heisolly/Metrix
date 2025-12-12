# Admin Access Setup

## Step 1: Run the Admin Database Schema

1. Open your Supabase Dashboard: https://supabase.com/dashboard
2. Go to SQL Editor
3. Copy all SQL from `ADMIN_DATABASE_SCHEMA.md`
4. Run it

## Step 2: Make Yourself an Admin

Run this SQL in Supabase SQL Editor (replace with your email):

```sql
UPDATE profiles
SET is_admin = true, role = 'admin'
WHERE email = 'your-email@example.com';
```

## Step 3: Verify Admin Access

Check if you're an admin:

```sql
SELECT id, email, username, is_admin, role
FROM profiles
WHERE email = 'your-email@example.com';
```

You should see:

- `is_admin`: true
- `role`: admin

## Step 4: Access Admin Panel

1. Sign out and sign back in
2. Go to: http://localhost:3000/admin
3. You should see the admin dashboard

## Troubleshooting:

### If you get redirected to /dashboard/overview:

- Your `is_admin` flag is not set to true
- Run the UPDATE query again

### If you get redirected to /signin:

- You're not signed in
- Sign in first, then visit /admin

### If the page is blank:

- Check browser console for errors
- Make sure you ran the admin database schema
- Make sure the `admin_platform_metrics` view exists

## Quick Test:

Run this to check if admin views exist:

```sql
SELECT * FROM admin_platform_metrics;
```

If you get an error "relation does not exist", you need to run the admin schema SQL.
