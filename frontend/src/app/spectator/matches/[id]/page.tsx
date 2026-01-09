"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Play, 
  CheckCircle,
  Clock,
  Gamepad2,
  Trophy,
  Target,
  Skull,
  Timer,
  Save,
  RefreshCw
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import LoadingScreen from "@/components/LoadingScreen";
import Countdown from "@/components/Countdown";
import Link from "next/link";

export default function SpectatorMatchDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [match, setMatch] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Live stats state
  const [liveStats, setLiveStats] = useState({
    player1_kills: 0,
    player1_deaths: 0,
    player2_kills: 0,
    player2_deaths: 0,
    time_remaining: '',
    current_round: 1,
    notes: '',
  });
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    loadMatch(true);
  }, [id]);

  // Auto-save timer every 0.1 seconds when running (real-time)
  useEffect(() => {
    if (!isTimerRunning) return;

    const autoSaveInterval = setInterval(async () => {
      try {
        const updatedDetails = {
          ...(match?.match_details || {}),
          ...liveStats,
          last_updated: new Date().toISOString(),
        };

        await supabase
          .from('matches')
          .update({ 
            match_details: updatedDetails,
            updated_at: new Date().toISOString(),
          })
          .eq('id', id);
      } catch (error) {
        if (error) console.error('Auto-save error:', error);
      }
    }, 100);

    return () => clearInterval(autoSaveInterval);
  }, [isTimerRunning, liveStats.time_remaining, id, match]);

  const loadMatch = async (showLoading = false) => {
    try {
      if (showLoading) {
        setLoading(true);
      }
      
      const { data: matchData, error: matchError } = await supabase
        .from('matches')
        .select('*')
        .eq('id', id)
        .single();

      if (matchError) throw matchError;

      if (matchData) {
        const playerIds = [matchData.player1_id, matchData.player2_id, matchData.spectator_id].filter(Boolean);
        
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, username, email')
          .in('id', playerIds);

        const { data: tournament } = await supabase
          .from('tournaments')
          .select('*')
          .eq('id', matchData.tournament_id)
          .single();

        const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);

        const matchWithData = {
          ...matchData,
          player1: profileMap.get(matchData.player1_id),
          player2: profileMap.get(matchData.player2_id),
          spectator: profileMap.get(matchData.spectator_id),
          tournament,
        };

        setMatch(matchWithData);

        if (matchData.match_details) {
          setLiveStats({
            player1_kills: matchData.match_details.player1_kills || 0,
            player1_deaths: matchData.match_details.player1_deaths || 0,
            player2_kills: matchData.match_details.player2_kills || 0,
            player2_deaths: matchData.match_details.player2_deaths || 0,
            time_remaining: matchData.match_details.time_remaining || '',
            current_round: matchData.match_details.current_round || 1,
            notes: matchData.match_details.notes || '',
          });
        }
      }
    } catch (error) {
      console.error('Error loading match:', error);
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  };

  const saveLiveStats = async () => {
    try {
      setSaving(true);
      
      const updatedDetails = {
        ...(match.match_details || {}),
        ...liveStats,
        last_updated: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('matches')
        .update({ 
          match_details: updatedDetails,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) throw error;
      
      alert('Live stats saved successfully!');
      loadMatch();
    } catch (error: any) {
      console.error('Error saving stats:', error);
      alert(`Failed to save stats: {error.message || 'Unknown error'}`);
    } finally {
      setSaving(false);
    }
  };

  const handleStartMatch = async () => {
    try {
      const { error } = await supabase
        .from('matches')
        .update({ status: 'in_progress' })
        .eq('id', id);

      if (error) throw error;
      loadMatch();
    } catch (error) {
      console.error('Error starting match:', error);
      alert('Failed to start match');
    }
  };

  const handleCompleteMatch = async () => {
    if (!confirm('Mark this match as completed?')) return;

    try {
      const { error } = await supabase
        .from('matches')
        .update({ 
          status: 'completed',
          player1_score: liveStats.player1_kills,
          player2_score: liveStats.player2_kills,
        })
        .eq('id', id);

      if (error) throw error;
      loadMatch();
    } catch (error) {
      console.error('Error completing match:', error);
      alert('Failed to complete match');
    }
  };

  if (loading) return <LoadingScreen />;
  if (!match) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Match Not Found</h2>
          <Link href="/spectator/dashboard" className="text-purple-500 hover:text-purple-400">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-500/10 text-blue-500 border-blue-500/30';
      case 'in_progress': return 'bg-green-500/10 text-green-500 border-green-500/30';
      case 'completed': return 'bg-purple-500/10 text-purple-500 border-purple-500/30';
      case 'disputed': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30';
      case 'cancelled': return 'bg-red-500/10 text-red-500 border-red-500/30';
      default: return 'bg-slate-500/10 text-slate-500 border-slate-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-black">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/spectator/dashboard">
              <button className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
            </Link>
            <div>
              <h1 className="text-3xl font-black text-white flex items-center gap-3">
                Live Match Control
                {match.status === 'in_progress' && (
                  <span className="flex items-center gap-2 text-lg">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    LIVE
                  </span>
                )}
              </h1>
              <p className="text-white/50">Match ID: {match.match_code || match.id.slice(0, 8)}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => loadMatch()}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg flex items-center gap-2 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            {match.status === 'scheduled' && (
              <button
                onClick={handleStartMatch}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg flex items-center gap-2 transition-colors"
              >
                <Play className="w-4 h-4" />
                Start Match
              </button>
            )}
            {match.status === 'in_progress' && (
              <button
                onClick={handleCompleteMatch}
                className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-lg flex items-center gap-2 transition-colors"
              >
                <CheckCircle className="w-4 h-4" />
                Complete Match
              </button>
            )}
          </div>
        </div>

        {/* Tournament Info Bar */}
        <div className="bg-slate-900 border border-white/10 rounded-2xl p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">{match.tournament?.name}</h2>
              <p className="text-white/50">{match.tournament?.game} • Round {match.round}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className={`px-4 py-2 rounded-full text-sm font-bold border {getStatusColor(match.status)}`}>
              {match.status.replace('_', ' ').toUpperCase()}
            </span>
            <div className="text-right">
              <div className="text-white/50 text-sm">Scheduled</div>
              <div className="text-white font-bold text-sm">
                {new Date(match.scheduled_time).toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Live Stats Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Player Stats */}
            <div className="bg-slate-900 border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-black text-white flex items-center gap-2">
                  <Target className="w-6 h-6 text-red-500" />
                  Live Player Stats
                </h3>
                <button
                  onClick={saveLiveStats}
                  disabled={saving}
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Saving...' : 'Save Stats'}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Player 1 Stats */}
                <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/30 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white font-black text-xl">
                      {match.player1?.username?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-white font-black text-lg">{match.player1?.username}</div>
                      <div className="text-white/50 text-sm">Player 1</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-white/70 text-sm font-bold mb-2 flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        Kills
                      </label>
                      <input
                        type="number"
                        value={liveStats.player1_kills}
                        onChange={(e) => setLiveStats({ ...liveStats, player1_kills: parseInt(e.target.value) || 0 })}
                        className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white text-2xl font-black focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-white/70 text-sm font-bold mb-2 flex items-center gap-2">
                        <Skull className="w-4 h-4" />
                        Deaths
                      </label>
                      <input
                        type="number"
                        value={liveStats.player1_deaths}
                        onChange={(e) => setLiveStats({ ...liveStats, player1_deaths: parseInt(e.target.value) || 0 })}
                        className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white text-2xl font-black focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                    <div className="pt-4 border-t border-white/10">
                      <div className="text-white/50 text-sm">K/D Ratio</div>
                      <div className="text-3xl font-black text-blue-500">
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
                    <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center text-white font-black text-xl">
                      {match.player2?.username?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-white font-black text-lg">{match.player2?.username}</div>
                      <div className="text-white/50 text-sm">Player 2</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-white/70 text-sm font-bold mb-2 flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        Kills
                      </label>
                      <input
                        type="number"
                        value={liveStats.player2_kills}
                        onChange={(e) => setLiveStats({ ...liveStats, player2_kills: parseInt(e.target.value) || 0 })}
                        className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white text-2xl font-black focus:border-purple-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-white/70 text-sm font-bold mb-2 flex items-center gap-2">
                        <Skull className="w-4 h-4" />
                        Deaths
                      </label>
                      <input
                        type="number"
                        value={liveStats.player2_deaths}
                        onChange={(e) => setLiveStats({ ...liveStats, player2_deaths: parseInt(e.target.value) || 0 })}
                        className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white text-2xl font-black focus:border-purple-500 focus:outline-none"
                      />
                    </div>
                    <div className="pt-4 border-t border-white/10">
                      <div className="text-white/50 text-sm">K/D Ratio</div>
                      <div className="text-3xl font-black text-purple-500">
                        {liveStats.player2_deaths > 0 
                          ? (liveStats.player2_kills / liveStats.player2_deaths).toFixed(2)
                          : liveStats.player2_kills.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Match Info */}
            <div className="bg-slate-900 border border-white/10 rounded-2xl p-6">
              <h3 className="text-xl font-black text-white mb-4 flex items-center gap-2">
                <Gamepad2 className="w-5 h-5" />
                Match Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-white/70 text-sm font-bold mb-2 flex items-center gap-2">
                    <Timer className="w-4 h-4" />
                    Match Timer
                  </label>
                  <div className="bg-black/50 border border-white/10 rounded-lg p-4">
                    <div className="text-center mb-3">
                      <div className="text-4xl font-black text-red-500 font-mono tracking-wider">
                        {liveStats.time_remaining || '0:00'}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => {
                          if (isTimerRunning) {
                            if (timerInterval) {
                              clearInterval(timerInterval);
                              setTimerInterval(null);
                            }
                            setIsTimerRunning(false);
                          } else {
                            const parts = (liveStats.time_remaining || '5:00').split(':');
                            const minutes = parseInt(parts[0]) || 0;
                            const seconds = parseInt(parts[1]) || 0;
                            let totalSeconds = minutes * 60 + seconds;
                            
                            if (totalSeconds <= 0) {
                              totalSeconds = 300;
                            }
                            
                            setIsTimerRunning(true);
                            const interval = setInterval(() => {
                              totalSeconds--;
                              if (totalSeconds <= 0) {
                                clearInterval(interval);
                                setTimerInterval(null);
                                setIsTimerRunning(false);
                                setLiveStats(prev => ({
                                  ...prev,
                                  time_remaining: '0:00'
                                }));
                                return;
                              }
                              const mins = Math.floor(totalSeconds / 60);
                              const secs = totalSeconds % 60;
                              setLiveStats(prev => ({
                                ...prev,
                                time_remaining: `{mins}:{secs.toString().padStart(2, '0')}`
                              }));
                            }, 1000);
                            setTimerInterval(interval);
                          }
                        }}
                        className={`px-3 py-2 rounded-lg text-xs font-bold transition-colors {
                          isTimerRunning 
                            ? 'bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-500' 
                            : 'bg-green-500/20 hover:bg-green-500/30 text-green-500'
                        }`}
                      >
                        {isTimerRunning ? 'Pause' : 'Start'}
                      </button>
                      <button
                        onClick={() => {
                          const time = prompt('Enter time (MM:SS)', '5:00');
                          if (time && /^\d+:\d{2}/.test(time)) {
                            setLiveStats({ ...liveStats, time_remaining: time });
                          }
                        }}
                        className="px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-500 rounded-lg text-xs font-bold transition-colors"
                      >
                        Set
                      </button>
                      <button
                        onClick={() => {
                          if (timerInterval) {
                            clearInterval(timerInterval);
                            setTimerInterval(null);
                          }
                          setIsTimerRunning(false);
                          setLiveStats({ ...liveStats, time_remaining: '5:00' });
                        }}
                        className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-500 rounded-lg text-xs font-bold transition-colors"
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-white/70 text-sm font-bold mb-2 flex items-center gap-2">
                    <Trophy className="w-4 h-4" />
                    Current Round
                  </label>
                  <input
                    type="number"
                    value={liveStats.current_round}
                    onChange={(e) => setLiveStats({ ...liveStats, current_round: parseInt(e.target.value) || 1 })}
                    className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white font-bold focus:border-red-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="text-white/70 text-sm font-bold mb-2 block">
                  Match Notes
                </label>
                <textarea
                  value={liveStats.notes}
                  onChange={(e) => setLiveStats({ ...liveStats, notes: e.target.value })}
                  placeholder="Add any notes about the match..."
                  rows={4}
                  className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white focus:border-red-500 focus:outline-none resize-none"
                />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Countdown */}
            {match.show_countdown && match.status === 'scheduled' && (
              <div className="bg-slate-900 border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-black text-white mb-4">Countdown</h3>
                <Countdown
                  targetDate={match.countdown_start_time || match.scheduled_time}
                  title="Match Starts In"
                  variant="fire"
                />
              </div>
            )}

            {/* Quick Info */}
            <div className="bg-slate-900 border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-black text-white mb-4">Quick Info</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/50">Match Code</span>
                  <span className="text-white font-bold">{match.match_code || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">Match Number</span>
                  <span className="text-white font-bold">#{match.match_number}</span>
                </div>
                {match.spectator && (
                  <div className="flex justify-between">
                    <span className="text-white/50">Referee</span>
                    <span className="text-white font-bold">{match.spectator.username}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-white/50">Created</span>
                  <span className="text-white font-bold">
                    {new Date(match.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
