"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, UserPlus, UserMinus, Search } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminTournamentParticipantsPage() {
  const params = useParams();
  const router = useRouter();
  const tournamentId = params.id as string;

  const [tournament, setTournament] = useState<any>(null);
  const [participants, setParticipants] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    loadData();
  }, [tournamentId]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load tournament
      const { data: tourney } = await supabase
        .from('tournaments')
        .select('*')
        .eq('id', tournamentId)
        .single();
      
      setTournament(tourney);

      // Load participants
      const { data: parts } = await supabase
        .from('tournament_participants')
        .select(`
          *,
          profile:profiles(id, username, email, full_name)
        `)
        .eq('tournament_id', tournamentId);
      
      setParticipants(parts || []);

      // Load all users
      const { data: users } = await supabase
        .from('profiles')
        .select('id, username, email, full_name')
        .order('username');
      
      setAllUsers(users || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const addParticipant = async (userId: string) => {
    setAdding(true);
    try {
      const { error } = await supabase
        .from('tournament_participants')
        .insert({
          tournament_id: tournamentId,
          user_id: userId,
          status: 'registered',
          payment_reference: `ADMIN_ADD_${Date.now()}`
        });

      if (error) throw error;

      // Update participant count
      await supabase.rpc('increment_tournament_participants', {
        tournament_id: tournamentId
      });

      alert('Participant added successfully!');
      loadData();
    } catch (error: any) {
      console.error('Error adding participant:', error);
      alert(`Failed to add participant: ${error.message}`);
    } finally {
      setAdding(false);
    }
  };

  const removeParticipant = async (participantId: string) => {
    if (!confirm('Are you sure you want to remove this participant?')) return;

    try {
      const { error } = await supabase
        .from('tournament_participants')
        .delete()
        .eq('id', participantId);

      if (error) throw error;

      // Decrement participant count
      await supabase.rpc('decrement_tournament_participants', {
        tournament_id: tournamentId
      });

      alert('Participant removed successfully!');
      loadData();
    } catch (error: any) {
      console.error('Error removing participant:', error);
      alert(`Failed to remove participant: ${error.message}`);
    }
  };

  const filteredUsers = allUsers.filter(user => {
    const isAlreadyParticipant = participants.some(p => p.user_id === user.id);
    if (isAlreadyParticipant) return false;

    const query = searchQuery.toLowerCase();
    return (
      user.username?.toLowerCase().includes(query) ||
      user.email?.toLowerCase().includes(query) ||
      user.full_name?.toLowerCase().includes(query)
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-slate-900 to-black flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-slate-900 to-black p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.back()}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <div>
            <h1 className="text-3xl font-black text-white">Manage Participants</h1>
            <p className="text-white/70">{tournament?.name}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Current Participants */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900 border-2 border-white/10 rounded-2xl p-6"
          >
            <h2 className="text-2xl font-black text-white mb-4">
              Current Participants ({participants.length}/{tournament?.max_participants})
            </h2>

            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {participants.length === 0 ? (
                <p className="text-white/50 text-center py-8">No participants yet</p>
              ) : (
                participants.map((participant) => (
                  <div
                    key={participant.id}
                    className="bg-black/20 rounded-lg p-4 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-white">
                        {participant.profile?.username || 'Unknown'}
                      </div>
                      <div className="text-sm text-white/50">
                        {participant.profile?.email}
                      </div>
                      <div className="text-xs text-white/30 mt-1">
                        Ref: {participant.payment_reference}
                      </div>
                    </div>
                    <button
                      onClick={() => removeParticipant(participant.id)}
                      className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-500 rounded-lg transition-all"
                    >
                      <UserMinus className="w-5 h-5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </motion.div>

          {/* Add Participants */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-slate-900 border-2 border-white/10 rounded-2xl p-6"
          >
            <h2 className="text-2xl font-black text-white mb-4">Add Participant</h2>

            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-black/20 border-2 border-white/10 rounded-lg text-white placeholder-white/50 focus:border-red-500 focus:outline-none"
              />
            </div>

            <div className="space-y-2 max-h-[520px] overflow-y-auto">
              {filteredUsers.length === 0 ? (
                <p className="text-white/50 text-center py-8">
                  {searchQuery ? 'No users found' : 'All users are already participants'}
                </p>
              ) : (
                filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="bg-black/20 rounded-lg p-4 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-white">{user.username || 'Unknown'}</div>
                      <div className="text-sm text-white/50">{user.email}</div>
                    </div>
                    <button
                      onClick={() => addParticipant(user.id)}
                      disabled={adding}
                      className="p-2 bg-green-500/20 hover:bg-green-500/30 text-green-500 rounded-lg transition-all disabled:opacity-50"
                    >
                      <UserPlus className="w-5 h-5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
