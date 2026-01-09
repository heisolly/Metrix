"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Key, 
  Lock, 
  Map, 
  Copy,
  Check,
  Eye,
  EyeOff,
  Trophy,
  Skull,
  Target,
  Clock,
  Users
} from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Kill {
  id: string;
  killer_username: string;
  victim_username: string;
  weapon: string;
  kill_time: string;
}

interface Participant {
  username: string;
  total_kills: number;
  score: number;
  placement: number | null;
}

export default function TournamentRoomViewPage() {
  const params = useParams();
  const tournamentId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [tournament, setTournament] = useState<any>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [kills, setKills] = useState<Kill[]>([]);
  const [copied, setCopied] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

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

    const participantsChannel = supabase
      .channel(`tournament_${tournamentId}_participants`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'tournament_participants',
          filter: `tournament_id=eq.${tournamentId}`
        },
        () => {
          loadParticipants();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(killsChannel);
      supabase.removeChannel(participantsChannel);
    };
  }, [tournamentId]);

  const loadTournamentData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        loadTournament(),
        loadParticipants(),
        loadKills()
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
        total_kills,
        score,
        placement,
        profiles:user_id (username)
      `)
      .eq('tournament_id', tournamentId)
      .order('score', { ascending: false })
      .limit(10);

    if (data) {
      const formatted = data.map((p: any) => ({
        username: p.profiles?.username || 'Unknown',
        total_kills: p.total_kills || 0,
        score: p.score || 0,
        placement: p.placement
      }));
      setParticipants(formatted);
    }
  };

  const loadKills = async () => {
    const { data } = await supabase
      .rpc('get_tournament_kill_feed', {
        tournament_uuid: tournamentId,
        limit_count: 10
      });

    if (data) setKills(data);
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
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

  // Only show room details if tournament is ongoing
  const showRoomDetails = tournament?.status === 'ongoing';

  return (
    <div className="max-w-6xl mx-auto pb-20 md:pb-0">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-black text-white mb-2">
          {tournament?.name}
        </h1>
        <p className="text-white/70">
          Round {tournament?.current_round} of {tournament?.total_rounds}
        </p>
      </div>

      {/* Room Details - Only show when tournament is ongoing */}
      {showRoomDetails && (
        <div className="bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/30 rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center">
              <Key className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white">ROOM DETAILS</h2>
              <p className="text-white/70 text-sm">Join the game with these credentials</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {/* Room Code */}
            <div className="bg-black/40 rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <Key className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-bold text-white/70">Room Code</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-white font-mono">
                  {tournament?.room_code || 'N/A'}
                </span>
                <button
                  onClick={() => copyToClipboard(tournament?.room_code, 'code')}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  {copied === 'code' ? (
                    <Check className="w-5 h-5 text-green-500" />
                  ) : (
                    <Copy className="w-5 h-5 text-white/50" />
                  )}
                </button>
              </div>
            </div>

            {/* Room Password */}
            <div className="bg-black/40 rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <Lock className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-bold text-white/70">Password</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-white font-mono">
                  {showPassword ? tournament?.room_password : '••••••'}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5 text-white/50" />
                    ) : (
                      <Eye className="w-5 h-5 text-white/50" />
                    )}
                  </button>
                  <button
                    onClick={() => copyToClipboard(tournament?.room_password, 'password')}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    {copied === 'password' ? (
                      <Check className="w-5 h-5 text-green-500" />
                    ) : (
                      <Copy className="w-5 h-5 text-white/50" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Map Name */}
            <div className="bg-black/40 rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <Map className="w-4 h-4 text-green-400" />
                <span className="text-sm font-bold text-white/70">Map</span>
              </div>
              <span className="text-2xl font-black text-white">
                {tournament?.map_name || 'TBD'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Live Stats Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Leaderboard */}
        <div className="bg-slate-900 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <Trophy className="w-6 h-6 text-yellow-500" />
            <h3 className="text-xl font-black text-white">TOP PLAYERS</h3>
          </div>

          <div className="space-y-2">
            {participants.slice(0, 10).map((participant, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-3 p-3 bg-black/40 rounded-lg border border-white/5"
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm ${
                  index === 0 ? 'bg-yellow-500 text-black' :
                  index === 1 ? 'bg-gray-400 text-black' :
                  index === 2 ? 'bg-orange-600 text-white' :
                  'bg-white/10 text-white'
                }`}>
                  {index + 1}
                </div>
                
                <div className="flex-1">
                  <div className="font-bold text-white text-sm">{participant.username}</div>
                  <div className="text-xs text-white/50">Score: {participant.score}</div>
                </div>

                <div className="flex items-center gap-1">
                  <Skull className="w-4 h-4 text-red-500" />
                  <span className="font-bold text-white text-sm">{participant.total_kills}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Kill Feed */}
        <div className="bg-slate-900 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <Skull className="w-6 h-6 text-red-500" />
            <h3 className="text-xl font-black text-white">RECENT KILLS</h3>
          </div>

          <div className="space-y-2">
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

      {/* Tournament Info */}
      {!showRoomDetails && tournament?.status === 'upcoming' && (
        <div className="mt-6 bg-blue-500/10 border border-blue-500/30 rounded-2xl p-6 text-center">
          <Clock className="w-12 h-12 text-blue-400 mx-auto mb-3" />
          <h3 className="text-xl font-black text-white mb-2">Tournament Starting Soon</h3>
          <p className="text-white/70">
            Room details will be revealed when the tournament begins
          </p>
        </div>
      )}
    </div>
  );
}
