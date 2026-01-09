"use client";

import { motion } from "framer-motion";
import { Trophy, Clock, Eye, ChevronRight } from "lucide-react";

interface Match {
  id: string;
  round: number;
  match_number: number;
  player1_id: string | null;
  player2_id: string | null;
  player1?: { id: string; username?: string; email?: string; };
  player2?: { id: string; username?: string; email?: string; };
  scheduled_time: string | null;
  status: 'scheduled' | 'live' | 'completed';
  winner_id: string | null;
  spectator_id: string | null;
  spectator?: { username?: string; };
  player1_score?: number;
  player2_score?: number;
}

interface BracketTreeProps {
  matches: Match[];
  isAdmin?: boolean;
  currentUserId?: string;
  onMatchClick?: (match: Match) => void;
}

export default function BracketTree({ 
  matches, 
  isAdmin = false,
  currentUserId,
  onMatchClick 
}: BracketTreeProps) {
  
  // Group matches by round
  const matchesByRound = matches.reduce((acc, match) => {
    if (!acc[match.round]) acc[match.round] = [];
    acc[match.round].push(match);
    return acc;
  }, {} as Record<number, Match[]>);

  const rounds = Object.keys(matchesByRound)
    .map(Number)
    .sort((a, b) => a - b);
  
  const maxRound = Math.max(...rounds, 0);

  const getRoundName = (round: number) => {
    const totalRounds = maxRound;
    if (round === totalRounds) return "Finals";
    if (round === totalRounds - 1) return "Semi-Finals";
    if (round === totalRounds - 2) return "Quarter-Finals";
    if (round === totalRounds - 3) return "Round of 16";
    if (round === totalRounds - 4) return "Round of 32";
    if (round === totalRounds - 5) return "Round of 64";
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

  const getPlayerDisplay = (player: any) => {
    if (!player) return 'TBD';
    return player.username || player.email?.split('@')[0] || 'Player';
  };

  if (matches.length === 0) {
    return (
      <div className="text-center py-20 bg-slate-900/50 border-2 border-dashed border-white/10 rounded-2xl">
        <Trophy className="w-16 h-16 text-white/10 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">No Bracket Yet</h3>
        <p className="text-white/50">
          {isAdmin ? "Click 'Edit Pairings' to create the tournament bracket" : "Bracket will be available once matches are created"}
        </p>
      </div>
    );
  }

  // Calculate spacing for tree layout
  const getMatchSpacing = (round: number) => {
    const baseSpacing = 120;
    return baseSpacing * Math.pow(2, maxRound - round);
  };

  return (
    <div className="w-full">
      {/* Scrollable bracket container */}
      <div className="overflow-x-auto pb-8">
        <div className="inline-flex gap-12 min-w-full px-4">
          {rounds.map((round, roundIndex) => {
            const roundMatches = matchesByRound[round];
            const spacing = getMatchSpacing(round);
            
            return (
              <div 
                key={round} 
                className="flex flex-col justify-around"
                style={{ 
                  minHeight: `${spacing * roundMatches.length}px`,
                  minWidth: '300px'
                }}
              >
                {/* Round Header */}
                <div className="sticky top-0 z-10 mb-8">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 rounded-full shadow-lg">
                    <Trophy className="w-4 h-4 text-white" />
                    <span className="font-black text-white text-sm uppercase tracking-wider">
                      {getRoundName(round)}
                    </span>
                  </div>
                  <div className="text-xs text-white/50 mt-2 ml-1">
                    {roundMatches.length} {roundMatches.length === 1 ? 'Match' : 'Matches'}
                  </div>
                </div>

                {/* Matches */}
                <div className="flex flex-col justify-around flex-1 gap-6">
                  {roundMatches.map((match: Match, matchIndex: number) => {
                    const userInMatch = isUserMatch(match);
                    
                    return (
                      <motion.div
                        key={match.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: roundIndex * 0.1 + matchIndex * 0.05 }}
                        style={{ 
                          marginTop: matchIndex === 0 ? 0 : `${spacing / 2}px` 
                        }}
                      >
                        <div
                          onClick={() => onMatchClick?.(match)}
                          className={`relative p-4 rounded-xl border-2 ${getStatusColor(match.status)} {
                            userInMatch ? 'ring-2 ring-yellow-500 ring-offset-2 ring-offset-black' : ''
                          } {onMatchClick ? 'cursor-pointer hover:border-red-500/50 hover:shadow-xl' : ''} transition-all group bg-slate-900`}
                        >
                          {/* Match Header */}
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
                            <div className={`relative flex items-center justify-between p-3 rounded-lg transition-all {
                              match.winner_id === match.player1_id 
                                ? 'bg-green-500/20 border border-green-500/50 shadow-lg shadow-green-500/20' 
                                : 'bg-white/5 hover:bg-white/10'
                            }`}>
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                                  {getPlayerDisplay(match.player1).charAt(0).toUpperCase()}
                                </div>
                                <span className="text-sm font-bold text-white truncate">
                                  {getPlayerDisplay(match.player1)}
                                </span>
                              </div>
                              {match.player1_score !== undefined && match.player1_score !== null && (
                                <span className="text-lg font-black text-white ml-2">{match.player1_score}</span>
                              )}
                              {match.winner_id === match.player1_id && (
                                <Trophy className="w-4 h-4 text-yellow-500 ml-2 flex-shrink-0" />
                              )}
                            </div>

                            {/* VS Divider */}
                            <div className="text-center">
                              <span className="text-xs font-bold text-white/30 bg-white/5 px-3 py-1 rounded-full">VS</span>
                            </div>

                            {/* Player 2 */}
                            <div className={`relative flex items-center justify-between p-3 rounded-lg transition-all {
                              match.winner_id === match.player2_id 
                                ? 'bg-green-500/20 border border-green-500/50 shadow-lg shadow-green-500/20' 
                                : 'bg-white/5 hover:bg-white/10'
                            }`}>
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                                  {getPlayerDisplay(match.player2).charAt(0).toUpperCase()}
                                </div>
                                <span className="text-sm font-bold text-white truncate">
                                  {getPlayerDisplay(match.player2)}
                                </span>
                              </div>
                              {match.player2_score !== undefined && match.player2_score !== null && (
                                <span className="text-lg font-black text-white ml-2">{match.player2_score}</span>
                              )}
                              {match.winner_id === match.player2_id && (
                                <Trophy className="w-4 h-4 text-yellow-500 ml-2 flex-shrink-0" />
                              )}
                            </div>
                          </div>

                          {/* Match Info */}
                          {(match.scheduled_time || match.spectator) && (
                            <div className="space-y-1 text-xs border-t border-white/10 pt-2 mt-2">
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
                          )}

                          {/* User Indicator */}
                          {userInMatch && (
                            <div className="absolute -top-2 -right-2 px-2 py-1 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg">
                              <span className="text-xs font-black text-black">YOU</span>
                            </div>
                          )}

                          {/* Click Indicator */}
                          {onMatchClick && (
                            <div className="absolute inset-0 bg-red-500/0 group-hover:bg-red-500/5 rounded-xl transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                              <ChevronRight className="w-6 h-6 text-red-500" />
                            </div>
                          )}
                        </div>

                        {/* Connection Line to Next Round */}
                        {roundIndex < rounds.length - 1 && (
                          <div className="absolute left-full top-1/2 w-12 h-0.5 bg-gradient-to-r from-white/20 to-transparent -translate-y-1/2 pointer-events-none" />
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 text-xs mt-8 pt-6 border-t border-white/10">
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
