# Real-Time Live Streaming System - Complete Guide

## 🎯 Overview

A complete live streaming system with:

- ✅ **Real-time chat** (database-backed with Supabase Realtime)
- ✅ **Real viewer tracking** (updates every 10 seconds)
- ✅ **Admin controls** (create, edit, delete streams)
- ✅ **Public access** (unauthorized users can watch, not chat)
- ✅ **Dashboard access** (authenticated users can watch and chat)
- ✅ **Multi-stream support** (create multiple streams, activate one at a time)

## 📋 Setup Instructions

### 1. Run Database Migration

Execute the SQL file in Supabase SQL Editor:

```bash
create_live_streaming_system.sql
```

This creates:

- `live_streams` table
- `live_chat_messages` table
- `live_stream_viewers` table
- Real-time triggers
- RLS policies

### 2. Create Initial Stream (Optional)

Run this in Supabase SQL Editor:

```sql
INSERT INTO live_streams (stream_url, title, description, is_active)
VALUES (
  'http://192.168.137.29:8080/',
  'Metrix Tournament - Live Match',
  'Watch the best players compete in real-time!',
  true
);
```

### 3. Enable Realtime

In Supabase Dashboard:

1. Go to Database → Replication
2. Enable replication for:
   - `live_streams`
   - `live_chat_messages`
   - `live_stream_viewers`

## 🌐 Access Points

### Public Page (Unauthorized Users)

**URL**: `http://localhost:3000/live`

**Features**:

- ✅ View live stream
- ✅ See chat messages
- ✅ Real viewer count
- ❌ Cannot send messages
- Shows "Sign In to Chat" button

### Dashboard Page (Authenticated Users)

**URL**: `http://localhost:3000/dashboard/live`

**Features**:

- ✅ View live stream
- ✅ See chat messages
- ✅ Send chat messages
- ✅ Real viewer count
- ✅ Auto-scroll chat

### Admin Page (Admins Only)

**URL**: `http://localhost:3000/admin/live`

**Features**:

- ✅ Create new streams
- ✅ Edit stream details (URL, title, description)
- ✅ Activate/Deactivate streams
- ✅ Delete streams
- ✅ Send admin messages (marked with ADMIN badge)
- ✅ View all chat messages
- ✅ See viewer stats

## 🎮 Features Breakdown

### Real-Time Chat

**How it works**:

1. Messages stored in `live_chat_messages` table
2. Supabase Realtime broadcasts new messages
3. All connected clients receive updates instantly
4. Admin messages have special badge

**Message Structure**:

```typescript
{
  id: UUID,
  stream_id: UUID,
  user_id: UUID,
  username: string,
  message: string,
  is_admin: boolean,
  created_at: timestamp
}
```

### Real Viewer Tracking

**How it works**:

1. Each viewer gets unique `session_id`
2. Updates presence every 10 seconds
3. Viewers inactive for 1 minute are removed
4. Viewer count updates automatically
5. Cleanup runs every 30 seconds

**Viewer Structure**:

```typescript
{
  id: UUID,
  stream_id: UUID,
  user_id: UUID | null,
  session_id: string,
  last_seen: timestamp
}
```

### Stream Management

**Admin can**:

- Create multiple streams
- Edit stream URL, title, description
- Activate one stream at a time
- Deactivate all streams
- Delete streams
- View stats per stream

**Stream Structure**:

```typescript
{
  id: UUID,
  match_id: UUID | null,
  stream_url: string,
  title: string,
  description: string,
  is_active: boolean,
  viewer_count: number,
  started_at: timestamp,
  ended_at: timestamp | null,
  created_by: UUID
}
```

## 🔧 Admin Operations

### Create Stream

1. Go to `/admin/live`
2. Click "Create Stream"
3. Fill in:
   - Stream URL (e.g., `http://192.168.137.29:8080/`)
   - Title
   - Description
4. Click "Create Stream"

### Edit Stream

1. Select stream from list
2. Click "Edit"
3. Modify fields
4. Click "Save Changes"

### Activate Stream

1. Select stream
2. Click "Activate"
3. Only one stream can be active at a time
4. Previous active stream is deactivated

### Send Admin Message

1. Select active stream
2. Type message in chat input
3. Press Enter or click "Send"
4. Message appears with ADMIN badge

## 📊 Database Schema

### live_streams

```sql
CREATE TABLE live_streams (
  id UUID PRIMARY KEY,
  match_id UUID REFERENCES matches(id),
  stream_url TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  viewer_count INTEGER DEFAULT 0,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### live_chat_messages

```sql
CREATE TABLE live_chat_messages (
  id UUID PRIMARY KEY,
  stream_id UUID REFERENCES live_streams(id),
  user_id UUID REFERENCES profiles(id),
  username TEXT NOT NULL,
  message TEXT NOT NULL,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### live_stream_viewers

```sql
CREATE TABLE live_stream_viewers (
  id UUID PRIMARY KEY,
  stream_id UUID REFERENCES live_streams(id),
  user_id UUID REFERENCES profiles(id),
  session_id TEXT NOT NULL,
  last_seen TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(stream_id, session_id)
);
```

## 🔄 Real-Time Subscriptions

### Chat Subscription

```typescript
const chatSubscription = supabase
  .channel("live-chat")
  .on(
    "postgres_changes",
    { event: "INSERT", schema: "public", table: "live_chat_messages" },
    (payload) => {
      setChatMessages((prev) => [...prev, payload.new]);
    }
  )
  .subscribe();
```

### Stream Updates

```typescript
const streamSubscription = supabase
  .channel("live-stream")
  .on(
    "postgres_changes",
    { event: "UPDATE", schema: "public", table: "live_streams" },
    (payload) => {
      setStream(payload.new);
    }
  )
  .subscribe();
```

## 🎨 UI Components

### Public Page

- Stream player (iframe)
- Chat messages (read-only)
- Viewer count
- "Sign In to Chat" button
- Fullscreen controls
- Mute/Unmute

### Dashboard Page

- Stream player (iframe)
- Chat messages (read & write)
- Send message input
- Viewer count
- Fullscreen controls
- Mute/Unmute
- Auto-scroll chat

### Admin Page

- Stream list sidebar
- Stream controls (edit, activate, delete)
- Create stream button
- Chat with admin badge
- Viewer stats
- Stream URL editor

## 🚀 Usage Examples

### For Viewers (Public)

1. Visit `http://localhost:3000/live`
2. Watch stream
3. Read chat
4. Sign in to participate

### For Users (Dashboard)

1. Login to account
2. Go to Dashboard → Live
3. Watch stream
4. Send chat messages
5. Interact with community

### For Admins

1. Login as admin
2. Go to `/admin/live`
3. Create/manage streams
4. Send admin announcements
5. Monitor viewer engagement

## 🔐 Security

### RLS Policies

- **Streams**: Anyone can view, authenticated can create/update
- **Chat**: Anyone can view, authenticated can send
- **Viewers**: Anyone can track (for presence)

### Admin Features

- Only admins can access `/admin/live`
- Admin messages have `is_admin: true` flag
- Admin badge displayed in chat

## 📈 Performance

### Optimizations

- Chat limited to 100 recent messages
- Viewer cleanup every 30 seconds
- Presence updates every 10 seconds
- Auto-scroll only on new messages
- Efficient database queries with indexes

### Scalability

- Supports multiple concurrent streams
- Real-time updates via Supabase
- Efficient viewer tracking
- Message pagination ready

## 🐛 Troubleshooting

### Chat not updating

1. Check Supabase Realtime is enabled
2. Verify table replication is on
3. Check browser console for errors
4. Ensure RLS policies are correct

### Viewer count not accurate

1. Run cleanup function manually:
   ```sql
   SELECT cleanup_old_viewers();
   ```
2. Check `live_stream_viewers` table
3. Verify presence updates are running

### Stream not loading

1. Check stream URL is correct
2. Verify stream server is running
3. Test URL directly in browser
4. Check CORS settings

## 🎯 Next Steps

### Recommended Enhancements

- [ ] Stream quality selector
- [ ] Picture-in-picture mode
- [ ] Emoji reactions
- [ ] User mentions in chat
- [ ] Chat moderation tools
- [ ] Stream analytics dashboard
- [ ] Mobile app support
- [ ] Stream recording
- [ ] Highlight clips
- [ ] Multi-camera angles

## 📝 Summary

You now have:

- ✅ **3 pages**: Public, Dashboard, Admin
- ✅ **Real-time chat** with database
- ✅ **Real viewer tracking**
- ✅ **Admin controls** for streams
- ✅ **Multi-stream support**
- ✅ **Secure RLS policies**
- ✅ **Responsive design**

**Access**:

- Public: `/live`
- Dashboard: `/dashboard/live`
- Admin: `/admin/live`

Start streaming your tournaments with real-time engagement! 🎮📺✨
