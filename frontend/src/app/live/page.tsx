"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { 
  Radio, 
  Users, 
  Eye, 
  MessageCircle,
  Volume2,
  VolumeX,
  Maximize,
  Settings,
  Wifi,
  WifiOff,
  AlertCircle,
  LogIn
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function PublicLivePage() {
  const [stream, setStream] = useState<any>(null);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [viewerSessionId] = useState(() => `viewer_${Date.now()}_${Math.random()}`);
  const lastMessageIdRef = useRef<string | null>(null);

  useEffect(() => {
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

  const loadStream = async () => {
    // Only show loading on first load
    const isFirstLoad = !stream;
    try {
      if (isFirstLoad) setLoading(true);
      
      // Get active stream
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
      if (lastMessageIdRef.current && chatMessages.length > 0) {
        query = query.gt('created_at', chatMessages[chatMessages.length - 1]?.created_at || new Date(0).toISOString());
      }

      const { data: newMessages } = await query.limit(50);

      if (newMessages && newMessages.length > 0) {
        setChatMessages(prev => [...prev, ...newMessages]);
        lastMessageIdRef.current = newMessages[newMessages.length - 1].id;
      }
    } catch (error) {
      console.error('Error polling messages:', error);
    }
  };

  const updateViewerPresence = async () => {
    if (!stream) return;

    try {
      await supabase
        .from('live_stream_viewers')
        .upsert({
          stream_id: stream.id,
          session_id: viewerSessionId,
          last_seen: new Date().toISOString()
        }, {
          onConflict: 'stream_id,session_id'
        });
    } catch (error) {
      console.error('Error updating presence:', error);
    }
  };

  const handleFullscreen = () => {
    const iframe = document.getElementById('live-stream-iframe') as HTMLIFrameElement;
    if (iframe?.requestFullscreen) {
      iframe.requestFullscreen();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-black flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!stream) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-black flex items-center justify-center">
        <div className="text-center">
          <Radio className="w-24 h-24 text-white/20 mx-auto mb-6" />
          <h2 className="text-3xl font-black text-white mb-4">No Live Stream</h2>
          <p className="text-white/70 mb-8">There are no active streams right now. Check back later!</p>
          <Link
            href="/"
            className="inline-block px-8 py-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-black">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="relative">
              <Radio className="w-12 h-12 text-red-500" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
              </span>
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-white">
                LIVE STREAM
              </h1>
              <div className="flex items-center gap-4 mt-2">
                <span className="flex items-center gap-2 px-4 py-1 bg-red-500 text-white font-bold rounded-full text-sm">
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                  LIVE NOW
                </span>
                <span className="flex items-center gap-2 text-white/70">
                  <Eye className="w-4 h-4" />
                  {stream.viewer_count?.toLocaleString() || 0} watching
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Stream Player */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-2"
          >
            <div className="bg-slate-900 border border-white/10 rounded-2xl overflow-hidden">
              {/* Stream Controls */}
              <div className="bg-black/50 px-4 py-3 flex items-center justify-between border-b border-white/10">
                <div className="flex items-center gap-3">
                  <Wifi className="w-5 h-5 text-green-500" />
                  <span className="text-white font-bold text-sm">Connected</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    title={isMuted ? "Unmute" : "Mute"}
                  >
                    {isMuted ? (
                      <VolumeX className="w-5 h-5 text-white" />
                    ) : (
                      <Volume2 className="w-5 h-5 text-white" />
                    )}
                  </button>
                  <button
                    onClick={handleFullscreen}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    title="Fullscreen"
                  >
                    <Maximize className="w-5 h-5 text-white" />
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
              <div className="bg-black/30 px-6 py-4 border-t border-white/10">
                <h2 className="text-xl font-black text-white mb-2">
                  {stream.title}
                </h2>
                <p className="text-white/70 text-sm">
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
            <div className="bg-slate-900 border border-white/10 rounded-2xl overflow-hidden h-[600px] flex flex-col">
              {/* Chat Header */}
              <div className="bg-black/50 px-4 py-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-purple-500" />
                  <h3 className="text-white font-bold">Live Chat</h3>
                  <span className="ml-auto text-white/50 text-sm">
                    <Users className="w-4 h-4 inline mr-1" />
                    {stream.viewer_count || 0}
                  </span>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {chatMessages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`rounded-lg p-3 ${
                      msg.is_admin 
                        ? 'bg-red-500/20 border border-red-500/30' 
                        : 'bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                        msg.is_admin 
                          ? 'bg-gradient-to-br from-red-500 to-orange-500'
                          : 'bg-gradient-to-br from-purple-500 to-pink-500'
                      }`}>
                        {msg.username?.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-white font-bold text-sm">
                        {msg.username}
                        {msg.is_admin && (
                          <span className="ml-2 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                            ADMIN
                          </span>
                        )}
                      </span>
                      <span className="text-white/40 text-xs ml-auto">
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-white/90 text-sm ml-8">{msg.message}</p>
                  </motion.div>
                ))}
              </div>

              {/* Login Prompt */}
              <div className="bg-black/30 p-4 border-t border-white/10">
                <div className="text-center">
                  <p className="text-white/70 text-sm mb-3">
                    Login to join the conversation
                  </p>
                  <Link
                    href="/signin"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold rounded-xl transition-all"
                  >
                    <LogIn className="w-5 h-5" />
                    Sign In to Chat
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
