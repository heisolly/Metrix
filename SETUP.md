# Metrix Platform Setup Guide

## Overview
Metrix is a gaming tournament platform built with Next.js, TypeScript, and Supabase. This guide will help you set up the development environment.

## Prerequisites
- Node.js 18+
- npm 9+
- Git
- Supabase account (free tier is sufficient for development)

## Step 1: Clone and Install Dependencies

```bash
# Clone the repository
git clone <repository-url>
cd metrix-platform

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies (if using separate backend)
cd ../backend
npm install

# Install root dependencies
cd ..
npm install
```

## Step 2: Set Up Supabase

1. **Create a new Supabase project**
   - Go to [supabase.com](https://supabase.com)
   - Click "Start your project"
   - Choose organization and create new project
   - Wait for the project to be ready

2. **Get your credentials**
   - Go to Project Settings > API
   - Copy the Project URL and anon key

3. **Set up environment variables**
   - In `frontend/.env.local`, update:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your-project-url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
     ```

4. **Run the database schema**
   - Go to Supabase Dashboard > SQL Editor
   - Copy and paste the contents of `docs/database-schema.sql`
   - Run the script to create all tables

## Step 3: Configure Authentication

1. **Enable email confirmation**
   - Go to Authentication > Settings
   - Ensure "Enable email confirmations" is checked

2. **Set up redirect URLs**
   - In Authentication > URL Configuration
   - Add:
     - `http://localhost:3000/auth/callback`
     - `http://localhost:3000`

## Step 4: Set Up Edge Functions (Optional)

If you want to use the backend API via Edge Functions:

1. **Install Supabase CLI**
   ```bash
   npm install -g supabase
   ```

2. **Link your project**
   ```bash
   supabase link --project-ref your-project-ref
   ```

3. **Deploy functions**
   ```bash
   supabase functions deploy tournaments
   supabase functions deploy matches
   supabase functions deploy wallet
   ```

## Step 5: Run the Development Server

```bash
cd frontend
npm run dev
```

The app will be available at `http://localhost:3000`

## Database Schema Overview

### Core Tables
- **users**: User profiles with roles (player, spectator, admin, organizer)
- **games**: Available games for tournaments
- **tournaments**: Tournament information and settings
- **tournament_participants**: Users registered for tournaments
- **matches**: Individual matches within tournaments
- **match_results**: Results submitted by spectators
- **wallets**: User wallet balances
- **transactions**: Financial transactions
- **disputes**: Match dispute records

### Key Features
- Row Level Security (RLS) for data protection
- Automatic user profile creation on signup
- Wallet auto-creation for new users
- Real-time subscriptions for live updates

## API Endpoints

### Using Supabase Directly
The frontend uses Supabase client directly for most operations. See `frontend/src/lib/supabase-client.ts` for service functions.

### Using Edge Functions
If deployed, Edge Functions provide REST API endpoints:
- `/functions/v1/tournaments` - Tournament management
- `/functions/v1/matches` - Match operations
- `/functions/v1/wallet` - Wallet and transactions

## Development Workflow

1. **Make changes to code**
2. **Test locally**
3. **Commit and push** (if using Git)
4. **Deploy to production** (when ready)

## Common Issues

### 1. CORS Errors
Ensure your frontend URL is added to Supabase CORS settings.

### 2. Authentication Issues
Check that environment variables are correctly set and the Supabase project is active.

### 3. Database Permissions
RLS policies are in place. Make sure you're logged in to access protected data.

## Next Steps

1. Implement the UI components for each user role
2. Set up Paystack integration for payments
3. Create admin dashboard for tournament management
4. Implement real-time match updates
5. Add email notifications for various events

## Production Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Supabase
1. Upgrade to Pro plan for production
2. Set up custom domain
3. Configure production environment variables
4. Enable additional security features

## Support

For issues:
1. Check Supabase logs in Dashboard
2. Review browser console for errors
3. Ensure all environment variables are set
4. Verify database schema is correctly applied
