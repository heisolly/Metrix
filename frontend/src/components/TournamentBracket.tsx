"use client";

import { motion } from "framer-motion";
import { Users, Clock, Eye, Trophy, ChevronRight } from "lucide-react";

interface Match {
  id: string;
  round: number;
  match_number: number;
  player1_id: string | null;
  player2_id: string | null;
  player1?: { id: string; username: string; };
  player2?: { id: string; username: string; };
  scheduled_time: string | null;
  status: 'scheduled' | 'live' | 'completed';
  winner_id: string | null;
  spectator_id: string | null;
  spectator?: { username: string; };
}

interface TournamentBracketProps {
  matches: Match[];
  isAdmin?: boolean;
  currentUserId?: string;
  onMatchClick?: (match: Match) => void;
}

export default function TournamentBracket({ 
  matches, 
  isAdmin = false,
  currentUserId,
  onMatchClick 
}: TournamentBracketProps) {
  
  // Group matches by round
  const matchesByRound = matches.reduce((acc, match) => {
    if (!acc[match.round]) acc[match.round] = [];
    acc[match.round].push(match);
    return acc;
  }, {} as Record<number, Match[]>);

  const rounds = Object.keys(matchesByRound).map(Number).sort((a, b) => a - b);
  const maxRound = Math.max(...rounds, 0);

  const getRoundName = (round: number) => {
    const remaining = Math.pow(2, maxRound - round + 1);
    if (round === maxRound) return "Finals";
    if (round === maxRound - 1) return "Semi-Finals";
    if (round === maxRound - 2) return "Quarter-Finals";
    return `Round ${round}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'border-green-500 bg-green-500/10';
      case 'completed': return 'border-white/20 bg-white/5';
      default: return 'border-blue-500/30 bg-blue-500/5';
    }
  };

  const isUserMatch = (match: Match) => {
    return currentUserId && (
      match.player1_id === currentUserId || 
      match.player2_id === currentUserId
    );
  };

  if (matches.length === 0) {
    return (
      <div className="text-center py-20 bg-slate-900 border border-white/10 rounded-2xl border-dashed">
        <Trophy className="w-16 h-16 text-white/10 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">No Bracket Yet</h3>
        <p className="text-white/50">
          {isAdmin ? "Click 'Generate Bracket' to create the tournament bracket" : "Bracket will be available soon"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Bracket Grid */}
      <div className="overflow-x-auto pb-4">
        <div className="inline-flex gap-8 min-w-full">
          {rounds.map((round, roundIndex) => (
            <div key={round} className="flex-shrink-0" style={{ width: '280px' }}>
              {/* Round Header */}
              <div className="mb-6 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 rounded-full">
                  <Trophy className="w-4 h-4 text-white" />
                  <span className="font-black text-white text-sm uppercase tracking-wider">
                    {getRoundName(round)}
                  </span>
                </div>
                <div className="text-xs text-white/50 mt-2">
                  {matchesByRound[round].length} {matchesByRound[round].length === 1 ? 'Match' : 'Matches'}
                </div>
              </div>

              {/* Matches */}
              <div className="space-y-4">
                {matchesByRound[round].map((match, matchIndex) => {
                  const userInMatch = isUserMatch(match);
                  
                  return (
                    <motion.div
                      key={match.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: roundIndex * 0.1 + matchIndex * 0.05 }}
                      onClick={() => onMatchClick?.(match)}
                      className={`relative p-4 rounded-xl border-2 ${getStatusColor(match.status)} {
                        userInMatch ? 'ring-2 ring-yellow-500 ring-offset-2 ring-offset-black' : ''
                      } {onMatchClick ? 'cursor-pointer hover:border-red-500/50' : ''} transition-all group`}
                    >
                      {/* Match Number */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold text-white/50">
                          Match #{match.match_number}
                        </span>
                        {match.status === 'live' && (
                          <span className="flex items-center gap-1 text-xs font-bold text-green-500">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            LIVE
                          </span>
                        )}
                        {match.status === 'completed' && match.winner_id && (
                          <Trophy className="w-4 h-4 text-yellow-500" />
                        )}
                      </div>

                      {/* Players */}
                      <div className="space-y-2 mb-3">
                        {/* Player 1 */}
                        <div className={`flex items-center gap-2 p-2 rounded-lg {
                          match.winner_id === match.player1_id ? 'bg-green-500/20 border border-green-500/30' : 'bg-white/5'
                        }`}>
                          <div className="w-6 h-6 bg-slate-700 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                            {match.player1?.username?.charAt(0).toUpperCase() || '?'}
                          </div>
                          <span className="text-sm font-bold text-white truncate">
                            {match.player1?.username || 'TBD'}
                          </span>
                          {match.winner_id === match.player1_id && (
                            <Trophy className="w-3 h-3 text-yellow-500 ml-auto flex-shrink-0" />
                          )}
                        </div>

                        {/* VS */}
                        <div className="text-center text-xs font-bold text-white/30">VS</div>

                        {/* Player 2 */}
                        <div className={`flex items-center gap-2 p-2 rounded-lg {
                          match.winner_id === match.player2_id ? 'bg-green-500/20 border border-green-500/30' : 'bg-white/5'
                        }`}>
                          <div className="w-6 h-6 bg-slate-700 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                            {match.player2?.username?.charAt(0).toUpperCase() || '?'}
                          </div>
                          <span className="text-sm font-bold text-white truncate">
                            {match.player2?.username || 'TBD'}
                          </span>
                          {match.winner_id === match.player2_id && (
                            <Trophy className="w-3 h-3 text-yellow-500 ml-auto flex-shrink-0" />
                          )}
                        </div>
                      </div>

                      {/* Match Info */}
                      <div className="space-y-1 text-xs">
                        {match.scheduled_time && (
                          <div className="flex items-center gap-2 text-white/50">
                            <Clock className="w-3 h-3" />
                            <span>{new Date(match.scheduled_time).toLocaleString()}</span>
                          </div>
                        )}
                        {match.spectator && (
                          <div className="flex items-center gap-2 text-white/50">
                            <Eye className="w-3 h-3" />
                            <span>{match.spectator.username}</span>
                          </div>
                        )}
                      </div>

                      {/* User Indicator */}
                      {userInMatch && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                          <span className="text-xs font-black text-black">YOU</span>
                        </div>
                      )}

                      {/* Click Indicator */}
                      {onMatchClick && (
                        <div className="absolute inset-0 bg-red-500/0 group-hover:bg-red-500/5 rounded-xl transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <ChevronRight className="w-6 h-6 text-red-500" />
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              {/* Connection Lines (visual only) */}
              {roundIndex < rounds.length - 1 && (
                <div className="absolute top-0 right-0 w-8 h-full pointer-events-none">
                  <svg className="w-full h-full" style={{ overflow: 'visible' }}>
                    {matchesByRound[round].map((_, index) => {
                      const y1 = 80 + index * 200; // Approximate position
                      const y2 = 80 + Math.floor(index / 2) * 400;
                      return (
                        <path
                          key={index}
                          d={`M 0 {y1} L 20 {y1} L 20 {y2} L 40 ${y2}`}
                          stroke="rgba(255,255,255,0.1)"
                          strokeWidth="2"
                          fill="none"
                        />
                      );
                    })}
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 border-2 border-blue-500/30 bg-blue-500/5 rounded" />
          <span className="text-white/50">Scheduled</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 border-2 border-green-500 bg-green-500/10 rounded" />
          <span className="text-white/50">Live</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 border-2 border-white/20 bg-white/5 rounded" />
          <span className="text-white/50">Completed</span>
        </div>
        {currentUserId && (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 border-2 border-yellow-500 bg-yellow-500/10 rounded ring-2 ring-yellow-500" />
            <span className="text-white/50">Your Match</span>
          </div>
        )}
      </div>
    </div>
  );
}
