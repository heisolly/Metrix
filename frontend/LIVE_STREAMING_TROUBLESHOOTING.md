# 🔧 Live Streaming Troubleshooting & Setup Guide

## ⚠️ Issue: Stream Not Showing

If the admin page isn't showing the stream preview and users can't see it, follow these steps:

### Step 1: Run SQL Migration

**IMPORTANT**: You MUST run the SQL migration first!

1. Open Supabase Dashboard
2. Go to SQL Editor
3. Create new query
4. Copy and paste ALL content from `create_live_streaming_system.sql`
5. Click "Run"
6. Wait for success message

**Verify it worked:**

```sql
-- Run this to check if tables exist
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('live_streams', 'live_chat_messages', 'live_stream_viewers');
```

You should see 3 tables returned.

### Step 2: Create Your First Stream

1. Go to `/admin/live` in your browser
2. Click "Create Stream" button
3. Fill in:
   - **Stream URL**: `http://192.168.137.29:8080/`
   - **Title**: `Metrix Tournament - Live Match`
   - **Description**: `Watch live gameplay!`
4. Click "Create Stream"
5. You should see it appear in the streams list

### Step 3: Activate the Stream

1. Click on the stream you just created
2. Click the green "Activate" button
3. The stream should now show a red pulsing dot (LIVE indicator)

### Step 4: Test on User Pages

**Dashboard** (`/dashboard/live`):

- Login as a user
- Go to Dashboard → Live
- You should see the stream

**Public** (`/live`):

- Open in incognito/private window (no login)
- Go to `/live`
- You should see the stream

## 🐛 Common Issues

### Issue: "No Live Stream" message

**Cause**: No stream is marked as active

**Fix**:

1. Go to `/admin/live`
2. Select a stream
3. Click "Activate"

**Or check database:**

```sql
SELECT * FROM live_streams WHERE is_active = true;
```

If empty, activate one:

```sql
UPDATE live_streams
SET is_active = true
WHERE id = 'your-stream-id';
```

### Issue: Stream URL not loading

**Cause**: Stream server not running or wrong URL

**Fix**:

1. Make sure your screen stream is running at `http://192.168.137.29:8080/`
2. Test the URL directly in browser
3. Check if you're on the same network
4. Update the stream URL in admin if needed

### Issue: Chat not updating

**Cause**: Polling not working or database error

**Fix**:

1. Open browser console (F12)
2. Look for errors
3. Check if messages are being saved:

```sql
SELECT * FROM live_chat_messages ORDER BY created_at DESC LIMIT 10;
```

### Issue: Viewer count stuck at 0

**Cause**: Viewer tracking not working

**Fix**:

1. Check if cleanup function exists:

```sql
SELECT routine_name FROM information_schema.routines
WHERE routine_name = 'cleanup_old_viewers';
```

2. Manually run cleanup:

```sql
SELECT cleanup_old_viewers();
```

3. Check viewers table:

```sql
SELECT * FROM live_stream_viewers;
```

## 📊 Database Checks

### Check if tables exist:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name LIKE 'live_%';
```

Should return:

- `live_streams`
- `live_chat_messages`
- `live_stream_viewers`

### Check streams:

```sql
SELECT id, title, stream_url, is_active, viewer_count
FROM live_streams
ORDER BY created_at DESC;
```

### Check messages:

```sql
SELECT id, username, message, is_admin, created_at
FROM live_chat_messages
ORDER BY created_at DESC
LIMIT 20;
```

### Check viewers:

```sql
SELECT stream_id, COUNT(*) as viewer_count
FROM live_stream_viewers
WHERE last_seen > NOW() - INTERVAL '1 minute'
GROUP BY stream_id;
```

## 🔍 Debug Mode

Add this to your pages to see what's happening:

```typescript
// In useEffect
console.log("Stream:", stream);
console.log("Chat Messages:", chatMessages.length);
console.log("Active Stream:", activeStream);
```

## ✅ Quick Test Checklist

- [ ] SQL migration ran successfully
- [ ] Tables exist in database
- [ ] Stream created in admin
- [ ] Stream is activated (is_active = true)
- [ ] Stream URL is correct
- [ ] Stream server is running
- [ ] Can access `/admin/live`
- [ ] Can access `/dashboard/live`
- [ ] Can access `/live`
- [ ] Chat messages are saving
- [ ] Viewer count is updating

## 🚀 Quick Start Commands

### 1. Create a test stream via SQL:

```sql
INSERT INTO live_streams (stream_url, title, description, is_active)
VALUES (
  'http://192.168.137.29:8080/',
  'Test Stream',
  'Testing live streaming',
  true
);
```

### 2. Send a test message:

```sql
INSERT INTO live_chat_messages (stream_id, username, message, is_admin)
VALUES (
  (SELECT id FROM live_streams WHERE is_active = true LIMIT 1),
  'TestUser',
  'Hello from SQL!',
  false
);
```

### 3. Check if it's working:

```sql
SELECT
  s.title,
  s.is_active,
  s.viewer_count,
  COUNT(m.id) as message_count
FROM live_streams s
LEFT JOIN live_chat_messages m ON m.stream_id = s.id
GROUP BY s.id, s.title, s.is_active, s.viewer_count;
```

## 📝 Expected Behavior

### Admin Page (`/admin/live`):

- Shows list of all streams
- Can create new streams
- Can edit stream URL, title, description
- Can activate/deactivate streams
- Can delete streams
- Can send admin messages
- Messages update every 2 seconds
- Stream info updates every 5 seconds

### Dashboard Page (`/dashboard/live`):

- Shows active stream
- Shows chat messages
- Can send messages
- Messages update every 2 seconds
- Viewer count updates every 5 seconds

### Public Page (`/live`):

- Shows active stream
- Shows chat messages (read-only)
- Shows "Sign In to Chat" button
- Messages update every 2 seconds
- Viewer count updates every 5 seconds

## 🆘 Still Not Working?

1. **Check browser console** (F12) for errors
2. **Check Supabase logs** in dashboard
3. **Verify RLS policies** are correct
4. **Test database connection**:

```typescript
const { data, error } = await supabase.from("live_streams").select("*");
console.log("Streams:", data, "Error:", error);
```

5. **Check network tab** in browser dev tools
6. **Verify you're logged in** for dashboard page
7. **Clear browser cache** and reload

## 💡 Tips

- Use browser dev tools (F12) to debug
- Check both browser console and network tab
- Test SQL queries directly in Supabase
- Start with simple test data
- Verify each step before moving to next

Your live streaming should now work! 🎮📺✨
