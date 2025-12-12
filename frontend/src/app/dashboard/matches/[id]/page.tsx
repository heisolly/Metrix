"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Copy, 
  Check, 
  Clock, 
  Users, 
  Trophy,
  Eye,
  Calendar,
  AlertCircle,
  Info,
  Gamepad2,
  Target,
  Skull,
  Timer,
  RefreshCw
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/auth";
import { getTemplate } from "@/lib/matchTemplates";
import LoadingScreen from "@/components/LoadingScreen";
import Countdown from "@/components/Countdown";

export default function MatchDetailPage() {
  const params = useParams();
  const router = useRouter();
  const matchId = params.id as string;

  const [match, setMatch] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [liveStats, setLiveStats] = useState({
    player1_kills: 0,
    player1_deaths: 0,
    player2_kills: 0,
    player2_deaths: 0,
    time_remaining: '',
    current_round: 1,
  });

  useEffect(() => {
    loadMatchDetails();
    // Auto-refresh every 0.5 seconds for real-time sync
    const interval = setInterval(loadMatchDetails, 500);
    return () => clearInterval(interval);
  }, [matchId]);

  const loadMatchDetails = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);

      // Fetch match details
      const { data: matchData, error } = await supabase
        .from('matches')
        .select('*')
        .eq('id', matchId)
        .single();

      if (error) throw error;

      if (matchData) {
        // Fetch related data
        const playerIds = [matchData.player1_id, matchData.player2_id, matchData.spectator_id].filter(Boolean);
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, username, email')
          .in('id', playerIds);

        const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);

        const { data: tournament } = await supabase
          .from('tournaments')
          .select('id, name, game')
          .eq('id', matchData.tournament_id)
          .single();

        setMatch({
          ...matchData,
          player1: profileMap.get(matchData.player1_id),
          player2: profileMap.get(matchData.player2_id),
          spectator: profileMap.get(matchData.spectator_id),
          tournament
        });

        // Load live stats from match_details
        if (matchData.match_details) {
          setLiveStats({
            player1_kills: matchData.match_details.player1_kills || 0,
            player1_deaths: matchData.match_details.player1_deaths || 0,
            player2_kills: matchData.match_details.player2_kills || 0,
            player2_deaths: matchData.match_details.player2_deaths || 0,
            time_remaining: matchData.match_details.time_remaining || '',
            current_round: matchData.match_details.current_round || 1,
          });
        }
      }
    } catch (error) {
      console.error('Error loading match:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const isUserInMatch = () => {
    return user && (match?.player1_id === user.id || match?.player2_id === user.id);
  };

  if (loading) return <LoadingScreen />;

  if (!match) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-slate-900 to-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Match Not Found</h2>
          <button
            onClick={() => router.back()}
            className="text-red-500 hover:text-red-400 font-bold"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const template = getTemplate(match.template_id || 'generic');
  const matchInfo = match.match_info || {};
  const isPlayer = isUserInMatch();

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-slate-900 to-black">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-white/50 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-bold">Back</span>
        </button>

        {/* Match Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-16 h-16 bg-gradient-to-br {template?.color || 'from-red-500 to-orange-500'} rounded-2xl flex items-center justify-center shadow-lg`}>
              <Gamepad2 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-white">
                {match.tournament?.name || 'Match Details'}
              </h1>
              <p className="text-white/70">{template?.game || match.tournament?.game}</p>
            </div>
          </div>

          {/* Match Status Badge */}
          <div className="flex flex-wrap items-center gap-3">
            <span className={`px-4 py-2 rounded-full font-bold text-sm {
              match.status === 'scheduled' ? 'bg-blue-500/20 text-blue-500 border border-blue-500/30' :
              match.status === 'live' ? 'bg-green-500/20 text-green-500 border border-green-500/30 animate-pulse' :
              match.status === 'completed' ? 'bg-white/20 text-white border border-white/30' :
              'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30'
            }`}>
              {match.status.toUpperCase()}
            </span>
            
            {isPlayer && (
              <span className="px-4 py-2 bg-yellow-500 text-black rounded-full font-bold text-sm">
                YOU'RE PLAYING
              </span>
            )}
          </div>
        </motion.div>

        {/* Countdown - Auto-displayed when enabled */}
        {match.show_countdown !== false && match.status === 'scheduled' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <Countdown
              targetDate={match.countdown_start_time || match.scheduled_time}
              title={`${match.tournament?.name} - Round ${match.round}`}
              variant="neon"
            />
          </motion.div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Players */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-slate-900 border border-white/10 rounded-2xl p-6"
            >
              <h2 className="text-xl font-black text-white mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-500" />
                Players
              </h2>

              <div className="space-y-3">
                {/* Player 1 */}
                <div className={`p-4 rounded-xl {
                  match.player1_id === user?.id ? 'bg-yellow-500/20 border-2 border-yellow-500' : 'bg-white/5'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                        {match.player1?.username?.charAt(0).toUpperCase() || 'P1'}
                      </div>
                      <div>
                        <div className="font-bold text-white">{match.player1?.username || 'Player 1'}</div>
                        <div className="text-sm text-white/50">{match.player1?.email}</div>
                      </div>
                    </div>
                    {match.winner_id === match.player1_id && (
                      <Trophy className="w-6 h-6 text-yellow-500" />
                    )}
                  </div>
                </div>

                <div className="text-center py-2">
                  <span className="text-white/30 font-bold">VS</span>
                </div>

                {/* Player 2 */}
                <div className={`p-4 rounded-xl {
                  match.player2_id === user?.id ? 'bg-yellow-500/20 border-2 border-yellow-500' : 'bg-white/5'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
                        {match.player2?.username?.charAt(0).toUpperCase() || 'P2'}
                      </div>
                      <div>
                        <div className="font-bold text-white">{match.player2?.username || 'Player 2'}</div>
                        <div className="text-sm text-white/50">{match.player2?.email}</div>
                      </div>
                    </div>
                    {match.winner_id === match.player2_id && (
                      <Trophy className="w-6 h-6 text-yellow-500" />
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Live Stats - Show when match is in progress or has stats */}
            {(match.status === 'in_progress' || match.match_details) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="bg-slate-900 border border-white/10 rounded-2xl p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-black text-white flex items-center gap-2">
                    <Target className="w-6 h-6 text-red-500" />
                    Live Match Stats
                    {match.status === 'in_progress' && (
                      <span className="flex items-center gap-2 text-sm">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        LIVE
                      </span>
                    )}
                  </h2>
                  <button
                    onClick={() => loadMatchDetails()}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    title="Refresh stats"
                  >
                    <RefreshCw className="w-5 h-5 text-white/50" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Player 1 Stats */}
                  <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/30 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-black">
                        {match.player1?.username?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-white font-black">{match.player1?.username}</div>
                        <div className="text-white/50 text-sm">Player 1</div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-black/30 rounded-lg p-3">
                        <div className="text-white/50 text-xs mb-1 flex items-center gap-1">
                          <Target className="w-3 h-3" />
                          Kills
                        </div>
                        <div className="text-3xl font-black text-blue-500">{liveStats.player1_kills}</div>
                      </div>
                      <div className="bg-black/30 rounded-lg p-3">
                        <div className="text-white/50 text-xs mb-1 flex items-center gap-1">
                          <Skull className="w-3 h-3" />
                          Deaths
                        </div>
                        <div className="text-3xl font-black text-white">{liveStats.player1_deaths}</div>
                      </div>
                      <div className="bg-black/30 rounded-lg p-3">
                        <div className="text-white/50 text-xs mb-1">K/D Ratio</div>
                        <div className="text-2xl font-black text-blue-400">
                          {liveStats.player1_deaths > 0 
                            ? (liveStats.player1_kills / liveStats.player1_deaths).toFixed(2)
                            : liveStats.player1_kills.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Player 2 Stats */}
                  <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/30 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-black">
                        {match.player2?.username?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-white font-black">{match.player2?.username}</div>
                        <div className="text-white/50 text-sm">Player 2</div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-black/30 rounded-lg p-3">
                        <div className="text-white/50 text-xs mb-1 flex items-center gap-1">
                          <Target className="w-3 h-3" />
                          Kills
                        </div>
                        <div className="text-3xl font-black text-purple-500">{liveStats.player2_kills}</div>
                      </div>
                      <div className="bg-black/30 rounded-lg p-3">
                        <div className="text-white/50 text-xs mb-1 flex items-center gap-1">
                          <Skull className="w-3 h-3" />
                          Deaths
                        </div>
                        <div className="text-3xl font-black text-white">{liveStats.player2_deaths}</div>
                      </div>
                      <div className="bg-black/30 rounded-lg p-3">
                        <div className="text-white/50 text-xs mb-1">K/D Ratio</div>
                        <div className="text-2xl font-black text-purple-400">
                          {liveStats.player2_deaths > 0 
                            ? (liveStats.player2_kills / liveStats.player2_deaths).toFixed(2)
                            : liveStats.player2_kills.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Match Info Row */}
                {(liveStats.time_remaining || liveStats.current_round > 1) && (
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    {liveStats.time_remaining && (
                      <div className="bg-black/30 rounded-lg p-4 text-center border border-red-500/20">
                        <div className="text-white/50 text-sm mb-2 flex items-center justify-center gap-1">
                          <Timer className="w-4 h-4" />
                          Time Remaining
                        </div>
                        <div className={`text-4xl font-black font-mono tracking-wider {
                          (() => {
                            const parts = liveStats.time_remaining.split(':');
                            const mins = parseInt(parts[0]) || 0;
                            const secs = parseInt(parts[1]) || 0;
                            const totalSecs = mins * 60 + secs;
                            return totalSecs <= 60 ? 'text-red-500 animate-pulse' : 'text-red-500';
                          })()
                        }`}>
                          {liveStats.time_remaining}
                        </div>
                        <div className="text-xs text-white/40 mt-2">Synced with Admin</div>
                      </div>
                    )}
                    <div className="bg-black/30 rounded-lg p-4 text-center">
                      <div className="text-white/50 text-sm mb-2 flex items-center justify-center gap-1">
                        <Trophy className="w-4 h-4" />
                        Current Round
                      </div>
                      <div className="text-4xl font-black text-white">{liveStats.current_round}</div>
                    </div>
                  </div>
                )}

                <div className="mt-4 text-center text-xs text-white/40">
                  Live sync with admin
                </div>
              </motion.div>
            )}

            {/* Room Details */}
            {isPlayer && (match.room_code || Object.keys(matchInfo).length > 0) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-green-500/30 rounded-2xl p-6"
              >
                <h2 className="text-xl font-black text-white mb-4 flex items-center gap-2">
                  <Gamepad2 className="w-5 h-5 text-green-500" />
                  Match Details
                </h2>

                <div className="space-y-4">
                  {match.room_code && (
                    <div className="bg-black/40 rounded-xl p-4 border border-green-500/30">
                      <div className="text-sm text-white/50 mb-1">Room Code</div>
                      <div className="flex items-center gap-3">
                        <div className="text-2xl font-black text-green-500 tracking-wider">
                          {match.room_code}
                        </div>
                        <button
                          onClick={() => copyToClipboard(match.room_code, 'room_code')}
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                          {copiedField === 'room_code' ? (
                            <Check className="w-5 h-5 text-green-500" />
                          ) : (
                            <Copy className="w-5 h-5 text-white/50" />
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {match.room_password && (
                    <div className="bg-black/40 rounded-xl p-4">
                      <div className="text-sm text-white/50 mb-1">Room Password</div>
                      <div className="flex items-center gap-3">
                        <div className="text-lg font-bold text-white">
                          {match.room_password}
                        </div>
                        <button
                          onClick={() => copyToClipboard(match.room_password, 'room_password')}
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                          {copiedField === 'room_password' ? (
                            <Check className="w-5 h-5 text-green-500" />
                          ) : (
                            <Copy className="w-5 h-5 text-white/50" />
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Dynamic Template Fields */}
                  {template?.fields.map(field => {
                    const value = matchInfo[field.key];
                    if (!value) return null;

                    return (
                      <div key={field.key} className="bg-black/40 rounded-xl p-4">
                        <div className="text-sm text-white/50 mb-1">{field.label}</div>
                        <div className="flex items-center gap-3">
                          <div className="text-white font-bold break-all flex-1">
                            {value}
                          </div>
                          {field.type === 'text' && (
                            <button
                              onClick={() => copyToClipboard(value, field.key)}
                              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                            >
                              {copiedField === field.key ? (
                                <Check className="w-5 h-5 text-green-500" />
                              ) : (
                                <Copy className="w-5 h-5 text-white/50" />
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Instructions */}
            {isPlayer && (template?.instructions || match.custom_instructions) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-6"
              >
                <h2 className="text-xl font-black text-white mb-4 flex items-center gap-2">
                  <Info className="w-5 h-5 text-blue-500" />
                  Match Instructions
                </h2>
                <div className="text-white/70 whitespace-pre-line">
                  {match.custom_instructions || template?.instructions}
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Match Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-slate-900 border border-white/10 rounded-2xl p-6"
            >
              <h3 className="text-lg font-black text-white mb-4">Match Info</h3>
              
              <div className="space-y-4 text-sm">
                <div>
                  <div className="text-white/50 mb-1">Match Code</div>
                  <div className="font-bold text-white">{match.match_code || 'N/A'}</div>
                </div>

                <div>
                  <div className="text-white/50 mb-1 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Scheduled Time
                  </div>
                  <div className="font-bold text-white">
                    {new Date(match.scheduled_time).toLocaleString()}
                  </div>
                </div>

                <div>
                  <div className="text-white/50 mb-1">Round</div>
                  <div className="font-bold text-white">Round {match.round}</div>
                </div>

                {match.spectator && (
                  <div>
                    <div className="text-white/50 mb-1 flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      Referee/Spectator
                    </div>
                    <div className="font-bold text-white">{match.spectator.username}</div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Actions */}
            {isPlayer && match.status === 'scheduled' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 rounded-2xl p-6"
              >
                <h3 className="text-lg font-black text-white mb-3 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  Get Ready
                </h3>
                <p className="text-white/70 text-sm mb-4">
                  Match starts soon! Make sure you have all the details above and are ready to join.
                </p>
                <button className="w-full py-3 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold rounded-xl transition-all">
                  I'm Ready
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
