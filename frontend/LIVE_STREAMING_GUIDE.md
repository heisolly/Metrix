# Live Streaming System Guide

## Overview

The Live Streaming page allows users to watch live gameplay from your local HTTP screen stream at `http://192.168.137.29:8080/`.

## Features

### 1. Live Stream Player

- **Embedded iframe** displaying your screen stream
- **Fullscreen mode** for immersive viewing
- **Auto-refresh** connection status every 10 seconds
- **Error handling** with retry button
- **Aspect ratio** maintained (16:9)

### 2. Stream Controls

- 🔊 **Mute/Unmute** audio
- 🖥️ **Fullscreen** toggle
- ⚙️ **Refresh** connection
- 📡 **Connection status** indicator

### 3. Live Chat

- **Real-time messaging** (simulated)
- **User avatars** with initials
- **Timestamps** for each message
- **Auto-scroll** to latest messages
- **Enter key** to send messages

### 4. Stream Stats

- 👁️ **Viewer count** (simulated, updates every 5s)
- 💬 **Message count**
- 📡 **Live/Offline status**
- 📶 **Stream quality** indicator

### 5. Status Indicators

- ✅ **LIVE NOW** badge when streaming
- ❌ **OFFLINE** badge when not streaming
- 🔴 **Pulsing red dot** for live indicator
- 🌐 **Connection status** (Connected/Disconnected)

## Access

### Public URL

```
http://localhost:3000/live
```

### Navigation

Add to your main navigation menu for easy access.

## Stream Configuration

### Current Setup

- **Stream URL**: `http://192.168.137.29:8080/`
- **Protocol**: HTTP
- **Type**: Local network stream
- **Format**: Screen stream (iframe embed)

### To Change Stream URL

Edit line 20 in `/src/app/live/page.tsx`:

```typescript
const [streamUrl] = useState("http://YOUR_NEW_URL:PORT/");
```

## Technical Details

### Stream Detection

The page automatically checks if the stream is live:

```typescript
const checkStreamStatus = async () => {
  try {
    const response = await fetch(streamUrl, {
      method: "HEAD",
      mode: "no-cors",
    });
    setIsLive(true);
    setStreamError(false);
  } catch (error) {
    setIsLive(false);
    setStreamError(true);
  }
};
```

### Auto-Refresh

- **Status check**: Every 10 seconds
- **Viewer count**: Every 5 seconds (simulated)

### Error Handling

If stream is unavailable:

- Shows error message
- Displays retry button
- Maintains UI structure

## Chat System

### Current Implementation

- **Client-side only** (simulated)
- **Demo messages** pre-loaded
- **Local state** management

### To Implement Real Chat

1. Set up WebSocket server
2. Connect to chat backend
3. Replace `chatMessages` state with real data
4. Add user authentication

Example:

```typescript
// Connect to WebSocket
const ws = new WebSocket("ws://your-chat-server");

ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  setChatMessages((prev) => [...prev, message]);
};

// Send message
const handleSendMessage = () => {
  ws.send(
    JSON.stringify({
      user: currentUser.username,
      message: chatMessage,
      timestamp: new Date(),
    })
  );
};
```

## Viewer Count

### Current Implementation

Simulated random count (100-150 viewers).

### To Implement Real Count

1. Track connections on server
2. Broadcast count to all clients
3. Update state from server data

```typescript
// Example with WebSocket
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data.type === "viewer_count") {
    setViewerCount(data.count);
  }
};
```

## Customization

### Stream Title & Description

Edit lines 224-229:

```tsx
<h2 className="text-xl font-black text-white mb-2">
  Your Custom Title
</h2>
<p className="text-white/70 text-sm">
  Your custom description
</p>
```

### Colors & Branding

- **Live indicator**: Red (`bg-red-500`)
- **Chat**: Purple/Pink gradient
- **Background**: Slate/Black gradient

### Layout

- **Desktop**: 2/3 stream + 1/3 chat
- **Mobile**: Stacked (stream on top, chat below)

## Network Requirements

### For Local Streaming

1. **Same Network**: Viewers must be on same network as `192.168.137.29`
2. **Port Access**: Port `8080` must be accessible
3. **Firewall**: Allow incoming connections on port 8080

### For Public Streaming

1. **Port Forwarding**: Forward port 8080 on router
2. **Public IP**: Use your public IP instead of `192.168.x.x`
3. **HTTPS**: Consider using HTTPS for security
4. **CDN**: Use streaming service (YouTube Live, Twitch, etc.)

## Recommended Streaming Software

### For Screen Streaming

1. **OBS Studio** - Professional streaming
2. **IP Webcam** - Mobile streaming
3. **VLC Media Player** - Simple HTTP streaming
4. **FFmpeg** - Command-line streaming

### Setup Example (OBS)

1. Install OBS Studio
2. Add "Display Capture" source
3. Go to Settings → Stream
4. Set Server to `http://192.168.137.29:8080/`
5. Start streaming

## Browser Compatibility

### Supported Browsers

- ✅ Chrome/Edge (Recommended)
- ✅ Firefox
- ✅ Safari
- ⚠️ Mobile browsers (may have autoplay restrictions)

### Known Issues

- **Autoplay**: Some browsers block autoplay
- **CORS**: Cross-origin issues with some streams
- **HTTPS**: Mixed content warnings on HTTPS sites

## Performance Optimization

### For Better Performance

1. **Reduce quality** if viewers have slow connections
2. **Use adaptive bitrate** streaming
3. **Enable caching** on stream server
4. **Optimize iframe** loading

### Recommended Settings

- **Resolution**: 1280x720 (720p)
- **Bitrate**: 2500-4000 kbps
- **FPS**: 30 or 60
- **Codec**: H.264

## Future Enhancements

### Planned Features

- [ ] Real-time chat with WebSocket
- [ ] Multiple stream quality options
- [ ] Picture-in-picture mode
- [ ] Stream recording/replay
- [ ] Viewer reactions (emojis)
- [ ] Moderator controls
- [ ] Stream scheduling
- [ ] Multi-stream support
- [ ] Mobile app integration

### Integration Ideas

- Link to active tournaments
- Show match stats alongside stream
- Betting/predictions during stream
- Highlight clips
- Stream analytics

## Troubleshooting

### Stream Not Loading

1. Check stream URL is correct
2. Verify stream server is running
3. Check network connectivity
4. Try refreshing the page
5. Clear browser cache

### Chat Not Working

1. Check browser console for errors
2. Verify WebSocket connection (if implemented)
3. Check user authentication

### Poor Quality

1. Reduce stream bitrate
2. Check network bandwidth
3. Lower resolution
4. Use wired connection

## Security Considerations

### Important Notes

- ⚠️ **Local IP exposed** in code
- ⚠️ **No authentication** on stream
- ⚠️ **Public access** if deployed

### Recommendations

1. **Use environment variables** for stream URL
2. **Add authentication** for stream access
3. **Implement rate limiting**
4. **Monitor bandwidth** usage
5. **Use HTTPS** in production

## Summary

The Live Streaming page provides:

- ✅ **Embedded stream player**
- ✅ **Live chat interface**
- ✅ **Viewer statistics**
- ✅ **Stream controls**
- ✅ **Error handling**
- ✅ **Responsive design**
- ✅ **Real-time status**

Access at: `http://localhost:3000/live`

Enjoy streaming your tournaments! 🎮📺✨
