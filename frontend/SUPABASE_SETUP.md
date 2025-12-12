# Supabase Setup Guide for Metrix

## Prerequisites

- Supabase account (sign up at https://supabase.com)
- Node.js installed
- Metrix frontend project

## Installation

The Supabase client library has been installed:

```bash
npm install @supabase/supabase-js
```

## Configuration

### 1. Create a Supabase Project

1. Go to https://supabase.com/dashboard
2. Click "New Project"
3. Fill in project details:
   - **Name**: Metrix
   - **Database Password**: (create a strong password)
   - **Region**: Choose closest to your users
4. Click "Create new project"
5. Wait for project to be provisioned (~2 minutes)

### 2. Get Your API Credentials

1. In your Supabase project dashboard, go to **Settings** > **API**
2. Copy the following:
   - **Project URL** (under "Project URL")
   - **anon public** key (under "Project API keys")

### 3. Set Environment Variables

Create a `.env.local` file in the `frontend` directory:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

Replace the values with your actual Supabase credentials.

### 4. Database Schema

Run the following SQL in your Supabase SQL Editor to create the necessary tables:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Tournaments table
CREATE TABLE public.tournaments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  game TEXT NOT NULL,
  description TEXT,
  prize_pool DECIMAL(10, 2),
  entry_fee DECIMAL(10, 2),
  max_participants INTEGER,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'upcoming', -- upcoming, ongoing, finished
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.tournaments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tournaments are viewable by everyone"
  ON public.tournaments FOR SELECT
  USING (true);

-- Tournament participants
CREATE TABLE public.tournament_participants (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  tournament_id UUID REFERENCES public.tournaments(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  rank INTEGER,
  score INTEGER,
  prize_won DECIMAL(10, 2),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(tournament_id, user_id)
);

ALTER TABLE public.tournament_participants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Participants are viewable by everyone"
  ON public.tournament_participants FOR SELECT
  USING (true);

CREATE POLICY "Users can join tournaments"
  ON public.tournament_participants FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Leaderboard view
CREATE OR REPLACE VIEW public.leaderboard AS
SELECT
  p.id,
  p.username,
  p.full_name,
  p.avatar_url,
  COUNT(tp.id) AS tournaments_played,
  SUM(CASE WHEN tp.rank = 1 THEN 1 ELSE 0 END) AS wins,
  COALESCE(SUM(tp.prize_won), 0) AS total_earnings
FROM public.profiles p
LEFT JOIN public.tournament_participants tp ON p.id = tp.user_id
GROUP BY p.id, p.username, p.full_name, p.avatar_url
ORDER BY total_earnings DESC;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
 LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tournaments_updated_at
  BEFORE UPDATE ON public.tournaments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### 5. Enable Authentication

1. In Supabase Dashboard, go to **Authentication** > **Providers**
2. Enable **Email** provider
3. Configure email templates (optional)
4. Enable **Google** OAuth (optional):
   - Go to Google Cloud Console
   - Create OAuth credentials
   - Add credentials to Supabase

### 6. Storage Setup (Optional)

For user avatars and tournament images:

1. Go to **Storage** in Supabase Dashboard
2. Create a new bucket called `avatars`
3. Set bucket to **Public**
4. Create policies for upload/download

## Usage

The Supabase client is configured in `src/lib/supabase.ts`:

```typescript
import { supabase } from "@/lib/supabase";

// Example: Sign up
const { data, error } = await supabase.auth.signUp({
  email: "user@example.com",
  password: "password123",
});

// Example: Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: "user@example.com",
  password: "password123",
});

// Example: Get tournaments
const { data, error } = await supabase
  .from("tournaments")
  .select("*")
  .order("start_date", { ascending: false });
```

## Next Steps

1. Create `.env.local` with your Supabase credentials
2. Run the SQL schema in Supabase SQL Editor
3. Test authentication in your SignIn page
4. Implement tournament registration
5. Add user profile management

## Security Notes

- Never commit `.env.local` to git
- Use Row Level Security (RLS) policies
- Validate data on both client and server
- Use Supabase's built-in auth for security
- Regularly update dependencies

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js + Supabase Guide](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
