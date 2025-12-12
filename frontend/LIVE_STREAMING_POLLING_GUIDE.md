# Live Streaming System - Simplified Setup (No Realtime Required)

## ✅ What Changed

The system now uses **polling** instead of Supabase Realtime, so you don't need to enable replication!

### How It Works

**Instead of Realtime subscriptions:**

- ❌ No need to enable replication
- ❌ No WebSocket connections
- ❌ No Realtime channels

**Using Polling:**

- ✅ Fetches new messages every 2 seconds
- ✅ Updates stream info every 5 seconds
- ✅ Tracks viewers every 10 seconds
- ✅ Cleans up old viewers every 30 seconds

## 🚀 Setup Instructions

### 1. Run SQL Migration

Execute in Supabase SQL Editor:

```bash
create_live_streaming_system.sql
```

This creates all necessary tables and functions.

### 2. Create First Stream (Admin)

Go to `/admin/live` and click "Create Stream":

- **URL**: `http://192.168.137.29:8080/`
- **Title**: "Metrix Tournament - Live Match"
- **Description**: "Watch live gameplay!"
- Click "Activate"

### 3. Done!

That's it! No Realtime configuration needed.

## 📊 Polling Intervals

| Feature         | Interval   | Purpose                 |
| --------------- | ---------- | ----------------------- |
| New Messages    | 2 seconds  | Chat updates            |
| Stream Info     | 5 seconds  | Viewer count, status    |
| Viewer Presence | 10 seconds | Track active viewers    |
| Cleanup         | 30 seconds | Remove inactive viewers |

## 🎯 How Polling Works

### Chat Messages

```typescript
// Every 2 seconds, check for new messages
setInterval(async () => {
  const { data } = await supabase
    .from("live_chat_messages")
    .select("*")
    .gt("created_at", lastMessageTime)
    .limit(50);

  if (data) {
    addNewMessages(data);
  }
}, 2000);
```

### Stream Updates

```typescript
// Every 5 seconds, refresh stream data
setInterval(async () => {
  const { data } = await supabase
    .from("live_streams")
    .select("*")
    .eq("is_active", true)
    .single();

  if (data) {
    updateStream(data);
  }
}, 5000);
```

### Viewer Tracking

```typescript
// Every 10 seconds, update presence
setInterval(async () => {
  await supabase.from("live_stream_viewers").upsert({
    stream_id: streamId,
    session_id: mySessionId,
    last_seen: new Date(),
  });
}, 10000);
```

## ⚡ Performance

### Advantages of Polling

- ✅ **Simple**: No complex setup
- ✅ **Reliable**: Works everywhere
- ✅ **No limits**: No Realtime quota
- ✅ **Compatible**: Works with all Supabase plans

### Considerations

- Updates every 2-5 seconds (not instant)
- More database queries
- Good for 100-500 concurrent users

### Optimization Tips

1. **Adjust intervals** if needed:

   ```typescript
   // Faster updates (more queries)
   setInterval(pollMessages, 1000); // 1 second

   // Slower updates (fewer queries)
   setInterval(pollMessages, 5000); // 5 seconds
   ```

2. **Limit message history**:

   ```typescript
   .limit(100) // Only load last 100 messages
   ```

3. **Use indexes** (already created in SQL):
   ```sql
   CREATE INDEX idx_live_chat_stream ON live_chat_messages(stream_id, created_at DESC);
   ```

## 🌐 Access Points

| Page      | URL               | Auth  | Chat                    |
| --------- | ----------------- | ----- | ----------------------- |
| Public    | `/live`           | No    | Read only               |
| Dashboard | `/dashboard/live` | Yes   | Read & Write            |
| Admin     | `/admin/live`     | Admin | Read & Write (as Admin) |

## 🔧 Customization

### Change Polling Speed

Edit the interval values in each page:

**Dashboard Live** (`src/app/dashboard/live/page.tsx`):

```typescript
// Line ~40-50
const messageInterval = setInterval(pollNewMessages, 2000); // Change 2000 to your value
const streamInterval = setInterval(loadStream, 5000); // Change 5000 to your value
```

**Public Live** (`src/app/live/page.tsx`):

```typescript
// Line ~30-40
const messageInterval = setInterval(pollNewMessages, 2000); // Change 2000 to your value
const streamInterval = setInterval(loadStream, 5000); // Change 5000 to your value
```

### Recommended Values

| Use Case      | Message Poll | Stream Poll   |
| ------------- | ------------ | ------------- |
| High Activity | 1000ms (1s)  | 3000ms (3s)   |
| Normal        | 2000ms (2s)  | 5000ms (5s)   |
| Low Activity  | 5000ms (5s)  | 10000ms (10s) |

## 🐛 Troubleshooting

### Messages not updating

1. Check browser console for errors
2. Verify SQL migration ran successfully
3. Check `live_chat_messages` table has data
4. Increase polling frequency

### Viewer count stuck

1. Run cleanup manually:
   ```sql
   SELECT cleanup_old_viewers();
   ```
2. Check `live_stream_viewers` table
3. Verify presence updates are running

### High database usage

1. Decrease polling frequency
2. Limit message history
3. Add more indexes if needed

## 📈 Scaling

### For More Users

1. **Increase intervals**: Poll less frequently
2. **Use caching**: Cache stream data
3. **Optimize queries**: Add indexes
4. **Consider CDN**: For stream delivery

### For Real-Time Needs

If you need instant updates:

1. Upgrade Supabase plan
2. Enable Realtime replication
3. Switch to WebSocket subscriptions
4. Or use external service (Pusher, Ably)

## ✅ Summary

**Setup Steps:**

1. ✅ Run SQL migration
2. ✅ Create stream in admin
3. ✅ Done!

**No Need To:**

- ❌ Enable Realtime
- ❌ Configure replication
- ❌ Set up WebSockets

**Works With:**

- ✅ All Supabase plans
- ✅ Any hosting
- ✅ All browsers

The system is ready to use! 🎮📺✨
