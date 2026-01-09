"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Gamepad2, Trophy, Clock, CheckCircle, XCircle, AlertCircle, Calendar } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/auth";
import LoadingScreen from "@/components/LoadingScreen";
import Link from "next/link";

export default function MatchesPage() {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    if (loading) {
      // Initial load
      loadMatches(true);
    } else {
      // Filter change - don't show loading screen
      loadMatches(false);
    }
  }, [filter]);

  const loadMatches = async (showLoading = false) => {
    try {
      if (showLoading) {
        setLoading(true);
      }
      
      const user = await getCurrentUser();
      if (!user) {
        if (showLoading) {
          setLoading(false);
        }
        return;
      }

      setUserId(user.id);

      // Load user's matches (without joins first)
      let query = supabase
        .from('matches')
        .select('*')
        .or(`player1_id.eq.{user.id},player2_id.eq.${user.id}`)
        .order('scheduled_time', { ascending: false });

      if (filter === 'upcoming') {
        query = query.eq('status', 'scheduled');
      } else if (filter === 'completed') {
        query = query.eq('status', 'completed');
      } else if (filter === 'disputed') {
        query = query.eq('status', 'disputed');
      }

      const { data: matchesData, error: matchesError } = await query;
      if (matchesError) throw matchesError;

      if (matchesData && matchesData.length > 0) {
        // Collect all unique IDs
        const playerIds = new Set<string>();
        const tournamentIds = new Set<string>();
        
        matchesData.forEach(match => {
          if (match.player1_id) playerIds.add(match.player1_id);
          if (match.player2_id) playerIds.add(match.player2_id);
          if (match.spectator_id) playerIds.add(match.spectator_id);
          if (match.tournament_id) tournamentIds.add(match.tournament_id);
        });

        // Fetch profiles
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, username, email')
          .in('id', Array.from(playerIds));

        // Fetch tournaments
        const { data: tournaments } = await supabase
          .from('tournaments')
          .select('id, name, game, prize_pool')
          .in('id', Array.from(tournamentIds));

        const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);
        const tournamentMap = new Map(tournaments?.map(t => [t.id, t]) || []);

        // Merge data
        const matchesWithData = matchesData.map(match => ({
          ...match,
          player1: match.player1_id ? profileMap.get(match.player1_id) : null,
          player2: match.player2_id ? profileMap.get(match.player2_id) : null,
          spectator: match.spectator_id ? profileMap.get(match.spectator_id) : null,
          tournament: match.tournament_id ? tournamentMap.get(match.tournament_id) : null,
        }));

        setMatches(matchesWithData);
      } else {
        setMatches([]);
      }
    } catch (error) {
      console.error('Error loading matches:', error);
      setMatches([]);
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  };

  const getMatchResult = (match: any, userId: string) => {
    if (match.status !== 'completed') return null;
    
    if (match.winner_id === userId) {
      return { text: 'Victory', color: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/30' };
    } else if (match.winner_id) {
      return { text: 'Defeat', color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/30' };
    }
    return { text: 'Draw', color: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30' };
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-slate-900 to-black">
      <div className="max-w-7xl mx-auto px-3 md:px-4 py-4 md:py-8">
        {/* Header */}
        <div className="mb-4 md:mb-8">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-white mb-1 md:mb-2">
            MY MATCHES
          </h1>
          <p className="text-sm md:text-base text-white/70">
            Track your competitive matches and results
          </p>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-4 md:mb-8 overflow-x-auto scrollbar-hide pb-2">
          {['all', 'upcoming', 'completed', 'disputed'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 md:px-4 py-2 md:py-3 rounded-lg md:rounded-xl font-bold text-sm capitalize whitespace-nowrap transition-all ${
                filter === f
                  ? 'bg-red-500 text-white'
                  : 'bg-slate-900 text-white/50 hover:text-white border border-white/10'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Matches List */}
        {loading ? (
          <LoadingScreen />
        ) : matches.length > 0 ? (
          <div className="space-y-3 md:space-y-4">
            {matches.map((match) => {
              const isPlayer1 = match.player1_id === userId;
              const opponent = isPlayer1 ? match.player2 : match.player1;
              const result = userId ? getMatchResult(match, userId) : null;

              return (
                <Link key={match.id} href={`/dashboard/matches/${match.id}`}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-slate-900 border border-white/10 rounded-xl md:rounded-2xl p-4 md:p-6 hover:border-red-500/30 transition-all cursor-pointer hover:bg-slate-800/50"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4">
                      {/* Match Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0">
                            <Gamepad2 className="w-5 h-5 md:w-6 md:h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-base md:text-lg font-black text-white line-clamp-1">
                              {match.tournament?.name}
                            </h3>
                            <p className="text-xs md:text-sm text-white/50">
                              {match.tournament?.game} • Round {match.round}
                            </p>
                          </div>
                        </div>

                        {/* Players */}
                        <div className="flex items-center gap-3 md:gap-4 md:ml-15 bg-white/5 p-3 rounded-lg md:bg-transparent md:p-0">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <div className="w-6 h-6 md:w-8 md:h-8 bg-blue-500 rounded-full flex items-center justify-center text-[10px] md:text-xs font-bold text-white flex-shrink-0">
                              YOU
                            </div>
                            <span className="font-bold text-white text-xs md:text-sm truncate">You</span>
                          </div>
                          
                          <span className="text-white/30 font-bold text-xs md:text-sm">VS</span>
                          
                          <div className="flex items-center gap-2 flex-1 min-w-0 justify-end md:justify-start">
                            <span className="font-bold text-white text-xs md:text-sm truncate">{opponent?.username}</span>
                            <div className="w-6 h-6 md:w-8 md:h-8 bg-slate-700 rounded-full flex items-center justify-center text-[10px] md:text-xs font-bold text-white flex-shrink-0">
                              {opponent?.username?.charAt(0).toUpperCase()}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Status & Time */}
                      <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-3 mt-1 md:mt-0 pt-3 md:pt-0 border-t border-white/5 md:border-0">
                        {/* Status Badge */}
                        {match.status === 'scheduled' && (
                          <span className="px-3 py-1.5 md:px-4 md:py-2 bg-blue-500/10 text-blue-500 rounded-full text-xs md:text-sm font-bold border border-blue-500/30 flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 md:w-4 md:h-4" /> Scheduled
                          </span>
                        )}
                        {match.status === 'in_progress' && (
                          <span className="px-3 py-1.5 md:px-4 md:py-2 bg-green-500/10 text-green-500 rounded-full text-xs md:text-sm font-bold border border-green-500/30 flex items-center gap-1.5">
                            <Gamepad2 className="w-3.5 h-3.5 md:w-4 md:h-4" /> In Progress
                          </span>
                        )}
                        {match.status === 'completed' && result && (
                          <span className={`px-3 py-1.5 md:px-4 md:py-2 ${result.bg} ${result.color} rounded-full text-xs md:text-sm font-bold border ${result.border} flex items-center gap-1.5`}>
                            {result.text === 'Victory' ? <CheckCircle className="w-3.5 h-3.5 md:w-4 md:h-4" /> : <XCircle className="w-3.5 h-3.5 md:w-4 md:h-4" />}
                            {result.text}
                          </span>
                        )}
                        {match.status === 'disputed' && (
                          <span className="px-3 py-1.5 md:px-4 md:py-2 bg-yellow-500/10 text-yellow-500 rounded-full text-xs md:text-sm font-bold border border-yellow-500/30 flex items-center gap-1.5">
                            <AlertCircle className="w-3.5 h-3.5 md:w-4 md:h-4" /> Disputed
                          </span>
                        )}

                        {/* Time */}
                        <div className="flex items-center gap-1.5 md:gap-2 text-white/50 text-xs md:text-sm">
                          <Calendar className="w-3.5 h-3.5 md:w-4 md:h-4" />
                          <span>{new Date(match.scheduled_time).toLocaleString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}</span>
                        </div>
                      </div>
                    </div>

                    {/* Scores (if completed) */}
                    {match.status === 'completed' && match.player1_score !== null && (
                      <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-white/10">
                        <div className="flex items-center justify-center gap-6 md:gap-8">
                          <div className="text-center">
                            <div className="text-xl md:text-2xl font-black text-white">{isPlayer1 ? match.player1_score : match.player2_score}</div>
                            <div className="text-[10px] md:text-xs text-white/50 uppercase tracking-wider">Your Score</div>
                          </div>
                          <div className="text-white/30 font-black">-</div>
                          <div className="text-center">
                            <div className="text-xl md:text-2xl font-black text-white">{isPlayer1 ? match.player2_score : match.player1_score}</div>
                            <div className="text-[10px] md:text-xs text-white/50 uppercase tracking-wider">Opponent</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 md:py-20 bg-slate-900 border border-white/10 rounded-xl md:rounded-2xl border-dashed">
            <Gamepad2 className="w-12 h-12 md:w-16 md:h-16 text-white/10 mx-auto mb-4" />
            <h3 className="text-lg md:text-xl font-bold text-white mb-2">No Matches Yet</h3>
            <p className="text-sm md:text-base text-white/50 mb-6">Join a tournament to start competing!</p>
            <Link
              href="/dashboard/tournaments"
              className="inline-block px-5 py-2.5 md:px-6 md:py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg md:rounded-xl transition-all text-sm md:text-base"
            >
              Browse Tournaments
            </Link>
          </div>
        )}
      </div>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
