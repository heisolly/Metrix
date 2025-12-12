# Fix User Registration (Missing Profile)

If you are seeing "Database error saving new user" or "Registration failed", it is likely because the **User Profile** is not being created automatically.

Supabase handles Auth (email/password) in a separate system. We need a **Database Trigger** to automatically create a public profile when a user signs up.

## 🛠️ **The Fix: Create Profile Trigger**

Run this SQL in your Supabase SQL Editor:

```sql
-- ============================================================================
-- 1. Create Function to Handle New Users
-- ============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS
BEGIN
  INSERT INTO public.profiles (
    id,
    email,
    username,
    full_name,
    avatar_url,
    role,
    is_admin,
    created_at,
    updated_at
  )
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'fullName', ''),
    new.raw_user_meta_data->>'avatar_url',
    COALESCE(new.raw_user_meta_data->>'role', 'player'),
    false,
    NOW(),
    NOW()
  );
  RETURN new;
END;
 LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 2. Create the Trigger
-- ============================================================================
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ============================================================================
-- 3. Ensure Profiles RLS allows updates
-- ============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to insert their own profile (backup for client-side creation)
CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Allow users to update their own profile
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Allow everyone to read profiles
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

```

## 🚀 **Why This Works:**

1.  The **Function** `handle_new_user` runs automatically inside the database.
2.  It copies the data (username, name, email) from the auth system to your `public.profiles` table.
3.  The **Trigger** ensures this happens _every time_ someone signs up.
4.  `SECURITY DEFINER` allows it to bypass permission checks (so it works even if the new user doesn't have permissions yet).

## Notes:

- If you already tried to sign up and it failed, try a **new email/username** after running this script.
- The previous error "Database error saving new user" was likely because the app expected a profile that didn't exist.
