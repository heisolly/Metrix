"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { 
  Radio, 
  Users, 
  Eye, 
  MessageCircle,
  Send,
  Edit,
  Save,
  X,
  Plus,
  Trash2,
  Power,
  PowerOff,
  Settings as SettingsIcon
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/auth";
import Link from "next/link";

export default function AdminLivePage() {
  const [user, setUser] = useState<any>(null);
  const [streams, setStreams] = useState<any[]>([]);
  const [activeStream, setActiveStream] = useState<any>(null);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [chatMessage, setChatMessage] = useState("");
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    stream_url: "",
    title: "",
    description: ""
  });
  const [creating, setCreating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const lastMessageIdRef = useRef<string | null>(null);

  useEffect(() => {
    loadUser();
    loadStreams();
    
    // Poll for new messages every 2 seconds
    const messageInterval = setInterval(() => pollNewMessages(), 2000);
    
    // Poll for stream updates every 5 seconds
    const streamInterval = setInterval(loadStreams, 5000);

    return () => {
      clearInterval(messageInterval);
      clearInterval(streamInterval);
    };
  }, [activeStream]);

  const loadUser = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Error loading user:', error);
    }
  };

  const loadStreams = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('live_streams')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setStreams(data || []);

      // Set active stream if not set
      if (!activeStream && data && data.length > 0) {
        const active = data.find(s => s.is_active) || data[0];
        setActiveStream(active);
        loadChatMessages(active.id);
      }
    } catch (error) {
      console.error('Error loading streams:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadChatMessages = async (streamId: string) => {
    try {
      const { data } = await supabase
        .from('live_chat_messages')
        .select('*')
        .eq('stream_id', streamId)
        .order('created_at', { ascending: true })
        .limit(100);

      setChatMessages(data || []);
      if (data && data.length > 0) {
        lastMessageIdRef.current = data[data.length - 1].id;
      }
      scrollToBottom();
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const pollNewMessages = async () => {
    if (!activeStream) return;

    try {
      let query = supabase
        .from('live_chat_messages')
        .select('*')
        .eq('stream_id', activeStream.id)
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

  const handleSendMessage = async () => {
    if (!chatMessage.trim() || !activeStream || !user || sending) return;

    try {
      setSending(true);
      
      const { error } = await supabase
        .from('live_chat_messages')
        .insert({
          stream_id: activeStream.id,
          user_id: user.id,
          username: 'Admin',
          message: chatMessage.trim(),
          is_admin: true
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

  const handleCreateStream = async () => {
    if (!editForm.stream_url || !editForm.title) {
      alert('Please fill in stream URL and title');
      return;
    }

    try {
      const { error } = await supabase
        .from('live_streams')
        .insert({
          stream_url: editForm.stream_url,
          title: editForm.title,
          description: editForm.description,
          is_active: false,
          created_by: user?.id
        });

      if (error) throw error;

      setCreating(false);
      setEditForm({ stream_url: "", title: "", description: "" });
      loadStreams();
      alert('Stream created successfully!');
    } catch (error) {
      console.error('Error creating stream:', error);
      alert('Failed to create stream');
    }
  };

  const handleUpdateStream = async () => {
    if (!activeStream) return;

    try {
      const { error } = await supabase
        .from('live_streams')
        .update({
          stream_url: editForm.stream_url,
          title: editForm.title,
          description: editForm.description
        })
        .eq('id', activeStream.id);

      if (error) throw error;

      setEditing(false);
      loadStreams();
      alert('Stream updated successfully!');
    } catch (error) {
      console.error('Error updating stream:', error);
      alert('Failed to update stream');
    }
  };

  const handleToggleActive = async (streamId: string, currentStatus: boolean) => {
    try {
      // Deactivate all streams first
      await supabase
        .from('live_streams')
        .update({ is_active: false })
        .neq('id', '00000000-0000-0000-0000-000000000000');

      // Activate selected stream if turning on
      if (!currentStatus) {
        await supabase
          .from('live_streams')
          .update({ is_active: true })
          .eq('id', streamId);
      }

      loadStreams();
    } catch (error) {
      console.error('Error toggling stream:', error);
      alert('Failed to toggle stream');
    }
  };

  const handleDeleteStream = async (streamId: string) => {
    if (!confirm('Are you sure you want to delete this stream?')) return;

    try {
      const { error } = await supabase
        .from('live_streams')
        .delete()
        .eq('id', streamId);

      if (error) throw error;

      if (activeStream?.id === streamId) {
        setActiveStream(null);
      }
      loadStreams();
      alert('Stream deleted successfully!');
    } catch (error) {
      console.error('Error deleting stream:', error);
      alert('Failed to delete stream');
    }
  };

  const startEditing = (stream: any) => {
    setEditForm({
      stream_url: stream.stream_url,
      title: stream.title,
      description: stream.description || ""
    });
    setEditing(true);
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-black p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-black text-white mb-2">
              LIVE STREAM MANAGEMENT
            </h1>
            <p className="text-white/70">
              Manage live streams, chat, and viewer engagement
            </p>
          </div>
          <button
            onClick={() => setCreating(true)}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold rounded-xl transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create Stream
          </button>
        </div>

        {/* Create Stream Modal */}
        {creating && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-slate-900 border border-white/10 rounded-2xl p-8 max-w-2xl w-full"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-white">Create New Stream</h2>
                <button
                  onClick={() => {
                    setCreating(false);
                    setEditForm({ stream_url: "", title: "", description: "" });
                  }}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-white font-bold mb-2">Stream URL *</label>
                  <input
                    type="text"
                    value={editForm.stream_url}
                    onChange={(e) => setEditForm({ ...editForm, stream_url: e.target.value })}
                    placeholder="http://192.168.137.29:8080/"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/50 focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-white font-bold mb-2">Title *</label>
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    placeholder="Metrix Tournament - Live Match"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/50 focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-white font-bold mb-2">Description</label>
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    placeholder="Watch the best players compete in real-time!"
                    rows={3}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/50 focus:border-purple-500 focus:outline-none resize-none"
                  />
                </div>

                <button
                  onClick={handleCreateStream}
                  className="w-full px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold rounded-xl transition-all"
                >
                  Create Stream
                </button>
              </div>
            </motion.div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Streams List */}
          <div className="lg:col-span-1">
            <div className="bg-slate-900 border border-white/10 rounded-2xl p-6">
              <h2 className="text-xl font-black text-white mb-4">Streams</h2>
              <div className="space-y-3">
                {streams.map((stream) => (
                  <div
                    key={stream.id}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      activeStream?.id === stream.id
                        ? 'border-purple-500 bg-purple-500/10'
                        : 'border-white/10 hover:border-purple-500/50'
                    }`}
                    onClick={() => {
                      setActiveStream(stream);
                      loadChatMessages(stream.id);
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-bold text-sm truncate flex-1">
                        {stream.title}
                      </span>
                      {stream.is_active && (
                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse ml-2"></span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-white/50">
                      <Eye className="w-3 h-3" />
                      {stream.viewer_count || 0}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {activeStream && (
              <>
                {/* Stream Controls */}
                <div className="bg-slate-900 border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-black text-white">{activeStream.title}</h2>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => startEditing(activeStream)}
                        className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-500 font-bold rounded-lg transition-colors flex items-center gap-2"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleToggleActive(activeStream.id, activeStream.is_active)}
                        className={`px-4 py-2 font-bold rounded-lg transition-colors flex items-center gap-2 ${
                          activeStream.is_active
                            ? 'bg-red-500/20 hover:bg-red-500/30 text-red-500'
                            : 'bg-green-500/20 hover:bg-green-500/30 text-green-500'
                        }`}
                      >
                        {activeStream.is_active ? (
                          <>
                            <PowerOff className="w-4 h-4" />
                            Deactivate
                          </>
                        ) : (
                          <>
                            <Power className="w-4 h-4" />
                            Activate
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => handleDeleteStream(activeStream.id)}
                        className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-500 font-bold rounded-lg transition-colors flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>

                  {editing ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-white font-bold mb-2">Stream URL</label>
                        <input
                          type="text"
                          value={editForm.stream_url}
                          onChange={(e) => setEditForm({ ...editForm, stream_url: e.target.value })}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-purple-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-white font-bold mb-2">Title</label>
                        <input
                          type="text"
                          value={editForm.title}
                          onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-purple-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-white font-bold mb-2">Description</label>
                        <textarea
                          value={editForm.description}
                          onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                          rows={3}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-purple-500 focus:outline-none resize-none"
                        />
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={handleUpdateStream}
                          className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                        >
                          <Save className="w-5 h-5" />
                          Save Changes
                        </button>
                        <button
                          onClick={() => setEditing(false)}
                          className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-white/70">
                        <Radio className="w-4 h-4" />
                        <span className="text-sm">{activeStream.stream_url}</span>
                      </div>
                      <p className="text-white/70 text-sm">{activeStream.description}</p>
                      <div className="flex items-center gap-4 pt-2">
                        <div className="flex items-center gap-2">
                          <Eye className="w-4 h-4 text-blue-500" />
                          <span className="text-white font-bold">{activeStream.viewer_count || 0} viewers</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MessageCircle className="w-4 h-4 text-purple-500" />
                          <span className="text-white font-bold">{chatMessages.length} messages</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Chat */}
                <div className="bg-slate-900 border border-white/10 rounded-2xl overflow-hidden h-[500px] flex flex-col">
                  <div className="bg-black/50 px-6 py-4 border-b border-white/10">
                    <h3 className="text-xl font-black text-white">Live Chat (Admin)</h3>
                  </div>

                  <div className="flex-1 overflow-y-auto p-6 space-y-3">
                    {chatMessages.map((msg) => (
                      <div
                        key={msg.id}
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
                      </div>
                    ))}
                    <div ref={chatEndRef} />
                  </div>

                  <div className="bg-black/30 p-6 border-t border-white/10">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Send a message as admin..."
                        disabled={sending}
                        className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/50 focus:border-red-500 focus:outline-none disabled:opacity-50"
                      />
                      <button
                        onClick={handleSendMessage}
                        disabled={sending || !chatMessage.trim()}
                        className="px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold rounded-xl transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Send className="w-5 h-5" />
                        Send
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
