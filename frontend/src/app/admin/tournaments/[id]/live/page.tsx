"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Play,
  Pause,
  SkipForward,
  Trophy,
  Skull,
  Target,
  Users,
  Clock,
  Plus,
  Check
} from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Participant {
  id: string;
  user_id: string;
  username: string;
  total_kills: number;
  placement: number | null;
  score: number;
  status: string;
}

interface Kill {
  id: string;
  killer_username: string;
  victim_username: string;
  weapon: string;
  kill_time: string;
}

export default function LiveTournamentPage() {
  const params = useParams();
  const router = useRouter();
  const tournamentId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [tournament, setTournament] = useState<any>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [kills, setKills] = useState<Kill[]>([]);
  const [currentRound, setCurrentRound] = useState<any>(null);
  
  // Kill entry form
  const [showKillForm, setShowKillForm] = useState(false);
  const [killForm, setKillForm] = useState({
    killer_id: "",
    victim_id: "",
    weapon: "",
    headshot: false
  });

  useEffect(() => {
    loadTournamentData();
    
    // Subscribe to real-time updates
    const killsChannel = supabase
      .channel(`tournament_${tournamentId}_kills`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tournament_kills',
          filter: `tournament_id=eq.${tournamentId}`
        },
        () => {
          loadKills();
          loadParticipants();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(killsChannel);
    };
  }, [tournamentId]);

  const loadTournamentData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        loadTournament(),
        loadParticipants(),
        loadKills(),
        loadCurrentRound()
      ]);
    } finally {
      setLoading(false);
    }
  };

  const loadTournament = async () => {
    const { data } = await supabase
      .from('tournaments')
      .select('*')
      .eq('id', tournamentId)
      .single();
    
    if (data) setTournament(data);
  };

  const loadParticipants = async () => {
    const { data } = await supabase
      .from('tournament_participants')
      .select(`
        id,
        user_id,
        total_kills,
        placement,
        score,
        status,
        profiles:user_id (username)
      `)
      .eq('tournament_id', tournamentId)
      .order('score', { ascending: false });

    if (data) {
      const formatted = data.map((p: any) => ({
        id: p.id,
        user_id: p.user_id,
        username: p.profiles?.username || 'Unknown',
        total_kills: p.total_kills || 0,
        placement: p.placement,
        score: p.score || 0,
        status: p.status
      }));
      setParticipants(formatted);
    }
  };

  const loadKills = async () => {
    const { data } = await supabase
      .rpc('get_tournament_kill_feed', {
        tournament_uuid: tournamentId,
        limit_count: 20
      });

    if (data) setKills(data);
  };

  const loadCurrentRound = async () => {
    const { data } = await supabase
      .from('tournament_rounds')
      .select('*')
      .eq('tournament_id', tournamentId)
      .eq('status', 'in_progress')
      .single();

    if (data) setCurrentRound(data);
  };

  const handleAddKill = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from('tournament_kills')
        .insert({
          tournament_id: tournamentId,
          round_number: tournament?.current_round || 1,
          killer_id: killForm.killer_id,
          victim_id: killForm.victim_id,
          weapon: killForm.weapon,
          headshot: killForm.headshot
        });

      if (error) throw error;

      setShowKillForm(false);
      setKillForm({ killer_id: "", victim_id: "", weapon: "", headshot: false });
    } catch (error: any) {
      alert(`Failed to add kill: ${error.message}`);
    }
  };

  const endRound = async () => {
    if (!confirm('End current round?')) return;

    try {
      // Update round status
      await supabase
        .from('tournament_rounds')
        .update({ 
          status: 'completed',
          end_time: new Date().toISOString()
        })
        .eq('tournament_id', tournamentId)
        .eq('round_number', tournament?.current_round);

      // Check if tournament is complete
      if (tournament?.current_round >= tournament?.total_rounds) {
        await supabase
          .from('tournaments')
          .update({ status: 'completed' })
          .eq('id', tournamentId);
        
        alert('Tournament completed!');
        router.push(`/admin/tournaments/${tournamentId}`);
      } else {
        alert('Round ended!');
        await loadTournamentData();
      }
    } catch (error: any) {
      alert(`Failed to end round: ${error.message}`);
    }
  };

  const startNextRound = async () => {
    try {
      const nextRound = (tournament?.current_round || 0) + 1;
      
      // Create new round
      await supabase
        .from('tournament_rounds')
        .insert({
          tournament_id: tournamentId,
          round_number: nextRound,
          status: 'in_progress',
          start_time: new Date().toISOString()
        });

      // Update tournament
      await supabase
        .from('tournaments')
        .update({ current_round: nextRound })
        .eq('id', tournamentId);

      alert(`Round ${nextRound} started!`);
      await loadTournamentData();
    } catch (error: any) {
      alert(`Failed to start round: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 text-white/50 hover:text-white mb-8 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-bold">Back to Tournament</span>
      </button>

      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-red-500 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/20 animate-pulse">
            <Target className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white">LIVE MANAGEMENT</h1>
            <p className="text-white/70">{tournament?.name} - Round {tournament?.current_round}</p>
          </div>
        </div>

        <div className="flex gap-3">
          {currentRound && (
            <button
              onClick={endRound}
              className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-orange-500/20 flex items-center gap-2"
            >
              <Pause className="w-5 h-5" />
              End Round
            </button>
          )}
          
          {!currentRound && tournament?.current_round < tournament?.total_rounds && (
            <button
              onClick={startNextRound}
              className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-green-500/20 flex items-center gap-2"
            >
              <SkipForward className="w-5 h-5" />
              Start Next Round
            </button>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Leaderboard */}
        <div className="lg:col-span-2">
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <Trophy className="w-6 h-6 text-yellow-500" />
                LEADERBOARD
              </h3>
              <button
                onClick={() => setShowKillForm(true)}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition-all flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Kill
              </button>
            </div>

            <div className="space-y-2">
              {participants.map((participant, index) => (
                <motion.div
                  key={participant.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-4 p-4 bg-black/40 rounded-xl border border-white/5 hover:border-red-500/30 transition-all"
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black ${
                    index === 0 ? 'bg-yellow-500 text-black' :
                    index === 1 ? 'bg-gray-400 text-black' :
                    index === 2 ? 'bg-orange-600 text-white' :
                    'bg-white/10 text-white'
                  }`}>
                    {index + 1}
                  </div>
                  
                  <div className="flex-1">
                    <div className="font-bold text-white">{participant.username}</div>
                    <div className="text-sm text-white/50">Score: {participant.score}</div>
                  </div>

                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Skull className="w-4 h-4 text-red-500" />
                      <span className="font-bold text-white">{participant.total_kills}</span>
                    </div>
                    {participant.placement && (
                      <div className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-lg">
                        <span className="text-purple-400 font-bold">#{participant.placement}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Kill Feed */}
        <div className="lg:col-span-1">
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-black text-white mb-6 flex items-center gap-2">
              <Skull className="w-6 h-6 text-red-500" />
              KILL FEED
            </h3>

            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {kills.map((kill, index) => (
                <motion.div
                  key={kill.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-3 bg-black/40 rounded-lg border border-red-500/20"
                >
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-bold text-white">{kill.killer_username}</span>
                    <Target className="w-4 h-4 text-red-500" />
                    <span className="text-white/70">{kill.victim_username}</span>
                  </div>
                  {kill.weapon && (
                    <div className="text-xs text-white/50 mt-1">{kill.weapon}</div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Kill Modal */}
      {showKillForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900 border border-white/10 rounded-2xl p-6 max-w-md w-full"
          >
            <h3 className="text-2xl font-black text-white mb-6">Add Kill</h3>
            
            <form onSubmit={handleAddKill} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-white mb-2">Killer</label>
                <select
                  value={killForm.killer_id}
                  onChange={(e) => setKillForm({...killForm, killer_id: e.target.value})}
                  required
                  className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-red-500 focus:outline-none"
                >
                  <option value="">Select killer...</option>
                  {participants.map(p => (
                    <option key={p.user_id} value={p.user_id}>{p.username}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-white mb-2">Victim</label>
                <select
                  value={killForm.victim_id}
                  onChange={(e) => setKillForm({...killForm, victim_id: e.target.value})}
                  required
                  className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-red-500 focus:outline-none"
                >
                  <option value="">Select victim...</option>
                  {participants.map(p => (
                    <option key={p.user_id} value={p.user_id}>{p.username}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-white mb-2">Weapon (Optional)</label>
                <input
                  type="text"
                  value={killForm.weapon}
                  onChange={(e) => setKillForm({...killForm, weapon: e.target.value})}
                  className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-red-500 focus:outline-none"
                  placeholder="e.g., M416, AWM"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="headshot"
                  checked={killForm.headshot}
                  onChange={(e) => setKillForm({...killForm, headshot: e.target.checked})}
                  className="w-5 h-5 rounded bg-black/40 border-white/10 text-red-500 focus:ring-red-500"
                />
                <label htmlFor="headshot" className="text-sm font-bold text-white">
                  Headshot
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowKillForm(false)}
                  className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-red-500/20 flex items-center justify-center gap-2"
                >
                  <Check className="w-5 h-5" />
                  Add Kill
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
