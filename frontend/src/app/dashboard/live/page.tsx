"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { 
  Radio, 
  Users, 
  Eye, 
  MessageCircle,
  Send,
  Volume2,
  VolumeX,
  Maximize,
  Settings,
  Wifi,
  WifiOff,
  AlertCircle,
  Play,
  Trophy,
  Gamepad2
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/auth";

export default function DashboardLivePage() {
  const [user, setUser] = useState<any>(null);
  const [stream, setStream] = useState<any>(null);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [chatMessage, setChatMessage] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [viewerSessionId] = useState(() => `viewer_${Date.now()}_${Math.random()}`);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const lastMessageIdRef = useRef<string | null>(null);

  useEffect(() => {
    loadUser();
    loadStream();
    
    // Poll for new messages every 2 seconds
    const messageInterval = setInterval(pollNewMessages, 2000);
    
    // Track viewer presence every 10 seconds
    const presenceInterval = setInterval(updateViewerPresence, 10000);
    updateViewerPresence();

    // Cleanup old viewers every 30 seconds
    const cleanupInterval = setInterval(async () => {
      try {
        await supabase.rpc('cleanup_old_viewers');
      } catch (error) {
        console.error('Cleanup error:', error);
      }
    }, 30000);

    return () => {
      clearInterval(messageInterval);
      clearInterval(presenceInterval);
      clearInterval(cleanupInterval);
    };
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Error loading user:', error);
    }
  };

  const loadStream = async () => {
    // Only show loading on first load
    const isFirstLoad = !stream;
    
    try {
      if (isFirstLoad) setLoading(true);
      
      const { data: streamData, error: streamError } = await supabase
        .from('live_streams')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (streamError && streamError.code !== 'PGRST116') throw streamError;
      
      if (streamData) {
        // Only update stream if it's different or viewer count changed
        // This prevents the iframe from reloading
        if (!stream || stream.id !== streamData.id) {
          setStream(streamData);
        } else if (stream.viewer_count !== streamData.viewer_count) {
          // Only update viewer count without replacing entire object
          setStream((prev: any) => ({ ...prev, viewer_count: streamData.viewer_count }));
        }

        // Load initial messages only on first load
        if (isFirstLoad && chatMessages.length === 0) {
          const { data: messages } = await supabase
            .from('live_chat_messages')
            .select('*')
            .eq('stream_id', streamData.id)
            .order('created_at', { ascending: true })
            .limit(100);

          if (messages && messages.length > 0) {
            setChatMessages(messages);
            lastMessageIdRef.current = messages[messages.length - 1].id;
            scrollToBottom();
          }
        }
      }
    } catch (error) {
      console.error('Error loading stream:', error);
    } finally {
      if (isFirstLoad) setLoading(false);
    }
  };

  const pollNewMessages = async () => {
    if (!stream) return;

    try {
      let query = supabase
        .from('live_chat_messages')
        .select('*')
        .eq('stream_id', stream.id)
        .order('created_at', { ascending: true });

      // Only get messages after the last one we have
      if (chatMessages.length > 0) {
        const lastMessage = chatMessages[chatMessages.length - 1];
        query = query.gt('created_at', lastMessage.created_at);
      }

      const { data: newMessages } = await query.limit(50);

      if (newMessages && newMessages.length > 0) {
        // Filter out any messages we already have (by ID)
        const existingIds = new Set(chatMessages.map(m => m.id));
        const uniqueNewMessages = newMessages.filter(m => !existingIds.has(m.id));
        
        if (uniqueNewMessages.length > 0) {
          setChatMessages(prev => [...prev, ...uniqueNewMessages]);
          lastMessageIdRef.current = uniqueNewMessages[uniqueNewMessages.length - 1].id;
          scrollToBottom();
        }
      }
    } catch (error) {
      console.error('Error polling messages:', error);
    }
  };

  const updateViewerPresence = async () => {
    if (!stream || !user) return;

    try {
      await supabase
        .from('live_stream_viewers')
        .upsert({
          stream_id: stream.id,
          user_id: user.id,
          session_id: viewerSessionId,
          last_seen: new Date().toISOString()
        }, {
          onConflict: 'stream_id,session_id'
        });
    } catch (error) {
      console.error('Error updating presence:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!chatMessage.trim() || !stream || !user || sending) return;

    try {
      setSending(true);
      
      const { error } = await supabase
        .from('live_chat_messages')
        .insert({
          stream_id: stream.id,
          user_id: user.id,
          username: user.email?.split('@')[0] || 'User',
          message: chatMessage.trim(),
          is_admin: false
        });

      if (error) throw error;
      
      setChatMessage("");
      // Poll immediately for the new message
      setTimeout(pollNewMessages, 500);
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleFullscreen = () => {
    const iframe = document.getElementById('live-stream-iframe') as HTMLIFrameElement;
    if (iframe?.requestFullscreen) {
      iframe.requestFullscreen();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!stream) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Radio className="w-24 h-24 text-white/20 light:text-black/20 mx-auto mb-6" />
          <h2 className="text-3xl font-black text-white light:text-black mb-4">No Live Stream</h2>
          <p className="text-white/70 light:text-black/70">There are no active streams right now.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4 md:mb-8"
      >
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Radio className="w-10 h-10 md:w-12 md:h-12 text-red-500" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3 md:h-4 md:w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 md:h-4 md:w-4 bg-red-500"></span>
              </span>
            </div>
            <div>
              <h1 className="text-2xl md:text-5xl font-black text-white light:text-black">
                LIVE STREAM
              </h1>
              <div className="flex items-center gap-4 mt-1 md:mt-2">
                <span className="flex items-center gap-2 px-3 py-1 bg-red-500 text-white font-bold rounded-full text-xs md:text-sm">
                  <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-white rounded-full animate-pulse"></span>
                  LIVE NOW
                </span>
                <span className="flex items-center gap-2 text-white/70 light:text-black/70 text-xs md:text-sm">
                  <Eye className="w-3 h-3 md:w-4 md:h-4" />
                  {stream.viewer_count?.toLocaleString() || 0} watching
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stream Player & Chat */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Stream Player */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-2"
        >
          <div className="bg-slate-900 border border-white/10 rounded-xl md:rounded-2xl overflow-hidden">
            {/* Stream Controls */}
            <div className="bg-black/50 px-3 py-2 md:px-4 md:py-3 flex items-center justify-between border-b border-white/10">
              <div className="flex items-center gap-2 md:gap-3">
                <Wifi className="w-4 h-4 md:w-5 md:h-5 text-green-500" />
                <span className="text-white light:text-black font-bold text-xs md:text-sm">Connected</span>
              </div>
              <div className="flex items-center gap-1 md:gap-2">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-1.5 md:p-2 hover:bg-white/10 rounded-lg transition-colors"
                  title={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? (
                    <VolumeX className="w-4 h-4 md:w-5 md:h-5 text-white light:text-black" />
                  ) : (
                    <Volume2 className="w-4 h-4 md:w-5 md:h-5 text-white light:text-black" />
                  )}
                </button>
                <button
                  onClick={handleFullscreen}
                  className="p-1.5 md:p-2 hover:bg-white/10 rounded-lg transition-colors"
                  title="Fullscreen"
                >
                  <Maximize className="w-4 h-4 md:w-5 md:h-5 text-white light:text-black" />
                </button>
              </div>
            </div>

            {/* Stream Display */}
            <div className="relative bg-black aspect-video">
              <iframe
                id="live-stream-iframe"
                src={stream.stream_url}
                className="w-full h-full"
                allow="autoplay; fullscreen"
                allowFullScreen
                title="Live Stream"
              />
            </div>

            {/* Stream Info */}
            <div className="bg-black/30 px-4 py-3 md:px-6 md:py-4 border-t border-white/10">
              <h2 className="text-lg md:text-xl font-black text-white light:text-black mb-1 md:mb-2 line-clamp-1">
                {stream.title}
              </h2>
              <p className="text-white/70 light:text-black/70 text-xs md:text-sm line-clamp-2">
                {stream.description}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Chat Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1"
        >
          <div className="bg-slate-900 border border-white/10 rounded-xl md:rounded-2xl overflow-hidden h-[400px] md:h-[500px] lg:h-[600px] flex flex-col">
            {/* Chat Header */}
            <div className="bg-black/50 px-3 py-2 md:px-4 md:py-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 md:w-5 md:h-5 text-purple-500" />
                <h3 className="text-white light:text-black font-bold text-sm md:text-base">Live Chat</h3>
                <span className="ml-auto text-white/50 light:text-black/50 text-xs md:text-sm">
                  <Users className="w-3 h-3 md:w-4 md:h-4 inline mr-1" />
                  {stream.viewer_count || 0}
                </span>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-2 md:space-y-3">
              {chatMessages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`rounded-lg p-2 md:p-3 ${
                    msg.is_admin 
                      ? 'bg-red-500/20 border border-red-500/30' 
                      : 'bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center text-white text-[10px] md:text-xs font-bold ${
                      msg.is_admin 
                        ? 'bg-gradient-to-br from-red-500 to-orange-500'
                        : 'bg-gradient-to-br from-purple-500 to-pink-500'
                    }`}>
                      {msg.username?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-white light:text-black font-bold text-xs md:text-sm">
                      {msg.username}
                      {msg.is_admin && (
                        <span className="ml-2 px-1.5 py-0.5 bg-red-500 text-white text-[10px] rounded-full">
                          ADMIN
                        </span>
                      )}
                    </span>
                    <span className="text-white/40 light:text-black/40 text-[10px] md:text-xs ml-auto">
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-white/90 light:text-black/90 text-xs md:text-sm ml-7 md:ml-8 break-words">{msg.message}</p>
                </motion.div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Chat Input */}
            <div className="bg-black/30 p-3 md:p-4 border-t border-white/10">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Send a message..."
                  disabled={sending}
                  className="flex-1 px-3 py-2 md:px-4 md:py-3 bg-white/5 border border-white/10 rounded-lg md:rounded-xl text-white light:text-black placeholder-white/50 light:placeholder-black/50 focus:border-purple-500 focus:outline-none disabled:opacity-50 text-sm md:text-base"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={sending || !chatMessage.trim()}
                  className="px-3 py-2 md:px-4 md:py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold rounded-lg md:rounded-xl transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
