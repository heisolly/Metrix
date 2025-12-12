"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Trophy,
  TrendingUp,
  DollarSign,
  Award,
  Clock,
  Users,
  Gamepad2,
  ArrowRight,
  Target,
  Flame,
  Zap,
  Star,
  Crown,
  Plus,
  AlertCircle
} from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { useRouter } from "next/navigation";
import {
  getProfile,
  getUserStats,
  getUserTournaments,
  getNextMatch,
  getUserTransactions
} from "@/lib/database";
import UsernameSetupModal from "@/components/UsernameSetupModal";
import LoadingScreen from "@/components/LoadingScreen";

export default function DashboardOverviewPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [activeTournaments, setActiveTournaments] = useState<any[]>([]);
  const [nextMatch, setNextMatch] = useState<any>(null);
  const [recentResults, setRecentResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setError(null);
      const currentUser = await getCurrentUser();
      setUser(currentUser);

      // Try to get profile, if table doesn't exist, create a temporary profile
      try {
        const userProfile = await getProfile(currentUser.id);
        setProfile(userProfile);

        // Check if username is set
        if (!userProfile.username) {
          setShowUsernameModal(true);
          setLoading(false);
          return;
        }

        // Get user stats
        try {
          const userStats = await getUserStats(currentUser.id);
          setStats(userStats);
        } catch (error) {
          console.log('Stats not available yet');
          setStats({
            tournaments_played: 0,
            wins: 0,
            win_rate: 0,
            total_earnings: 0
          });
        }

        // Get active tournaments
        try {
          const tournaments = await getUserTournaments(currentUser.id, 'registered');
          setActiveTournaments(tournaments);
        } catch (error) {
          console.log('Tournaments not available yet');
          setActiveTournaments([]);
        }

        // Get next match
        try {
          const match = await getNextMatch(currentUser.id);
          setNextMatch(match);
        } catch (error) {
          console.log('Matches not available yet');
          setNextMatch(null);
        }

        // Get recent results
        try {
          const completed = await getUserTournaments(currentUser.id, 'completed');
          setRecentResults(completed.slice(0, 3));
        } catch (error) {
          console.log('Results not available yet');
          setRecentResults([]);
        }

      } catch (profileError: any) {
        console.error('Profile error:', profileError);
        
        // If profile doesn't exist, create a temporary one and show username modal
        setProfile({
          id: currentUser.id,
          email: currentUser.email,
          username: null,
          rank: 0,
          total_earnings: 0,
          available_balance: 0,
          pending_balance: 0
        });
        
        setStats({
          tournaments_played: 0,
          wins: 0,
          win_rate: 0,
          total_earnings: 0
        });
        
        setShowUsernameModal(true);
      }

    } catch (error: any) {
      console.error('Error loading dashboard:', error);
      
      // Check if it's a connection error
      if (error?.message?.includes('fetch') || error?.message?.includes('network') || error?.message?.includes('connection')) {
        setError('Connection error. Please check your internet connection and try again.');
      } else if (error?.message?.includes('auth') || error?.message?.includes('session')) {
        router.push("/signin");
      } else {
        setError('Failed to load dashboard. Please refresh the page.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUsernameSetupComplete = () => {
    setShowUsernameModal(false);
    loadDashboardData();
  };

  const getTimeUntilMatch = (matchTime: string) => {
    const now = new Date();
    const match = new Date(matchTime);
    const diff = match.getTime() - now.getTime();
    
    if (diff < 0) return "Starting soon";
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `{hours}h ${minutes}m`;
  };

  const getPlacementColor = (rank: number) => {
    if (rank === 1) return "text-yellow-500";
    if (rank === 2) return "text-gray-400";
    if (rank === 3) return "text-orange-500";
    return "text-white light:text-black";
  };

  const getPlacementIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-5 h-5 text-yellow-500" />;
    if (rank === 2) return <Star className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <Star className="w-5 h-5 text-orange-500" />;
    return null;
  };

  if (loading) {
    return <LoadingScreen />;
  }

  // Show error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-black via-slate-900 to-black">
        <div className="text-center p-8 bg-slate-900 border border-red-500/30 rounded-2xl max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-black text-white mb-2">Connection Error</h2>
          <p className="text-white/70 mb-6">{error}</p>
          <button
            onClick={() => {
              setLoading(true);
              loadDashboardData();
            }}
            className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Show username setup modal
  if (showUsernameModal && user) {
    return (
      <UsernameSetupModal
        isOpen={showUsernameModal}
        userId={user.id}
        email={user.email}
        onComplete={handleUsernameSetupComplete}
      />
    );
  }

  return (
    <div className="h-full">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4 md:mb-6 px-4 md:px-0"
      >
        <div className="flex items-center gap-2 md:gap-3 mb-2">
          <Flame className="w-6 h-6 md:w-8 md:h-8 text-red-500 animate-pulse" />
          <h1 className="text-xl md:text-2xl lg:text-3xl font-black text-white light:text-black">
            WELCOME BACK, <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">
              {profile?.username?.toUpperCase() || "PLAYER"}
            </span>
          </h1>
        </div>
        <p className="text-white/70 light:text-black/70 flex items-center gap-2">
          <Crown className="w-4 h-4 text-yellow-500" />
          Rank #{profile?.rank || 0} • Ready to dominate the arena
        </p>
      </motion.div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 px-4 md:px-0">
        {/* Left Column (2/3 width) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Top 3 Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
            {[
              { 
                icon: Trophy, 
                label: "Tournaments", 
                value: stats?.tournaments_played || 0, 
                subtitle: "Played",
                gradient: "from-yellow-500 via-orange-500 to-red-500",
                glow: "shadow-yellow-500/20"
              },
              { 
                icon: TrendingUp, 
                label: "Win Rate", 
                value: `${stats?.win_rate || 0}%`, 
                subtitle: `${stats?.wins || 0} wins`,
                gradient: "from-green-500 via-emerald-500 to-teal-500",
                glow: "shadow-green-500/20"
              },
              { 
                icon: DollarSign, 
                label: "Earnings", 
                value: `${stats?.total_earnings || 0}`, 
                subtitle: "Total earned",
                gradient: "from-blue-500 via-cyan-500 to-teal-500",
                glow: "shadow-blue-500/20"
              },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className={`relative bg-gradient-to-br {stat.gradient} p-[2px] rounded-2xl shadow-2xl ${stat.glow}`}
              >
                <div className="bg-black/90 light:bg-white/90 rounded-2xl p-4 md:p-5 h-full">
                  <div className="flex items-center justify-between mb-3">
                    <stat.icon className="w-8 h-8 text-white light:text-black" />
                    <Zap className="w-5 h-5 text-yellow-500" />
                  </div>
                  <div className="text-2xl md:text-3xl font-black text-white light:text-black mb-1">
                    {stat.value}
                  </div>
                  <div className="text-xs font-bold text-white/70 light:text-black/70 mb-1">
                    {stat.label}
                  </div>
                  <div className="text-xs text-green-500 font-bold">
                    {stat.subtitle}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Large Main Content - Active Tournaments */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex-1 bg-gradient-to-br from-slate-900/90 to-slate-800/90 light:from-white/90 light:to-gray-100/90 border-2 border-white/10 light:border-black/10 rounded-2xl p-4 md:p-6 overflow-hidden backdrop-blur-xl shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl md:text-2xl font-black text-white light:text-black">
                  ACTIVE TOURNAMENTS
                </h2>
              </div>
              <Link href="/dashboard/tournaments" className="text-red-500 hover:text-red-400 font-bold text-sm flex items-center gap-1 group">
                View All
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {activeTournaments.length > 0 ? (
              <div className="space-y-4 overflow-y-auto max-h-[calc(100%-80px)] pr-2 custom-scrollbar">
                {activeTournaments.map((item: any, index: number) => {
                  const tournament = item.tournament;
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      whileHover={{ scale: 1.02, x: 5 }}
                      className="relative p-5 bg-gradient-to-r from-white/5 to-white/10 light:from-black/5 light:to-black/10 rounded-xl border border-white/20 light:border-black/20 hover:border-red-500/50 transition-all group overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/5 to-red-500/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                      
                      <div className="relative flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Gamepad2 className="w-4 h-4 text-red-500" />
                            <span className="text-sm font-bold text-white/70 light:text-black/70">
                              {tournament.game}
                            </span>
                            <span className="px-2 py-0.5 bg-red-500/20 border border-red-500/30 rounded text-xs font-bold text-red-500">
                              {item.status}
                            </span>
                          </div>
                          <h3 className="text-lg md:text-xl font-black text-white light:text-black mb-3 group-hover:text-red-500 transition-colors">
                            {tournament.name}
                          </h3>
                          <div className="flex flex-wrap items-center gap-3 md:gap-6">
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4 text-white/50 light:text-black/50" />
                              <span className="text-sm font-bold text-white light:text-black">
                                {tournament.current_participants}/{tournament.max_participants}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <DollarSign className="w-4 h-4 text-green-500" />
                              <span className="text-sm font-black text-green-500">{tournament.prize_pool}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="relative flex items-center justify-between pt-4 border-t border-white/10 light:border-black/10">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-yellow-500" />
                          <span className="text-sm font-bold text-white light:text-black">
                            Starts {new Date(tournament.start_date).toLocaleDateString()}
                          </span>
                        </div>
                        <Link
                          href={`/dashboard/tournaments/${tournament.id}`}
                          className="px-5 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-bold rounded-lg hover:from-red-600 hover:to-red-700 transition-all shadow-lg shadow-red-500/20"
                        >
                          View Details
                        </Link>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[calc(100%-80px)] text-center">
                <Trophy className="w-16 h-16 text-white/20 light:text-black/20 mb-4" />
                <h3 className="text-xl font-black text-white light:text-black mb-2">
                  No Active Tournaments
                </h3>
                <p className="text-white/70 light:text-black/70 mb-6">
                  Join a tournament to start competing
                </p>
                <Link
                  href="/dashboard/tournaments"
                  className="px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold rounded-xl hover:from-red-600 hover:to-orange-600 transition-all shadow-lg shadow-red-500/20 flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Browse Tournaments
                </Link>
              </div>
            )}
          </motion.div>

          {/* Bottom 2 Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              whileHover={{ y: -3 }}
              className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 light:from-white/90 light:to-gray-100/90 border-2 border-white/10 light:border-black/10 rounded-2xl p-4 md:p-6 shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg md:text-xl font-black text-white light:text-black">
                  RECENT RESULTS
                </h3>
              </div>
              {recentResults.length > 0 ? (
                <div className="space-y-3">
                  {recentResults.map((result: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white/5 light:bg-black/5 rounded-lg hover:bg-white/10 light:hover:bg-black/10 transition-all">
                      <div className="flex items-center gap-3">
                        {getPlacementIcon(result.rank)}
                        <span className="text-sm text-white/70 light:text-black/70 truncate">
                          {result.tournament.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-sm font-black ${getPlacementColor(result.rank)}`}>
                          #{result.rank}
                        </span>
                        <span className="text-sm font-bold text-green-500">{result.prize_won}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-white/50 light:text-black/50 text-sm">
                    No results yet
                  </p>
                </div>
              )}
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              whileHover={{ y: -3 }}
              className="relative bg-gradient-to-br from-red-500/20 to-orange-500/20 border-2 border-red-500/30 rounded-2xl p-4 md:p-6 overflow-hidden shadow-2xl shadow-red-500/10"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-3xl" />
              <div className="relative flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg md:text-xl font-black text-white light:text-black">
                  YOUR RANK
                </h3>
              </div>
              <div className="relative text-center">
                <div className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500 mb-2">
                  #{profile?.rank || 0}
                </div>
                <div className="text-sm text-white/70 light:text-black/70">
                  Keep competing to climb!
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Right Column (1/3 width) - Next Match Widget */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="hidden lg:flex relative bg-gradient-to-br from-red-500/10 via-red-600/10 to-orange-500/10 border-2 border-red-500/30 rounded-2xl p-4 md:p-6 flex-col overflow-hidden shadow-2xl shadow-red-500/10"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full blur-3xl animate-pulse" />
          
          <div className="relative flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl flex items-center justify-center animate-pulse">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-black text-white light:text-black">
              NEXT MATCH
            </h2>
          </div>

          {nextMatch ? (
            <div className="relative flex-1 space-y-5">
              <div className="p-4 bg-white/5 light:bg-black/5 rounded-xl border border-white/10 light:border-black/10">
                <div className="text-sm text-white/70 light:text-black/70 mb-2">Tournament</div>
                <div className="font-bold text-white light:text-black">{nextMatch.tournament.name}</div>
              </div>

              <div className="p-5 bg-gradient-to-r from-red-500/20 to-orange-500/20 border-2 border-red-500/30 rounded-xl">
                <div className="text-sm text-white/70 light:text-black/70 mb-2">Starts In</div>
                <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">
                  {getTimeUntilMatch(nextMatch.scheduled_time)}
                </div>
              </div>

              {nextMatch.match_code && (
                <div className="p-4 bg-white/5 light:bg-black/5 rounded-xl border border-white/10 light:border-black/10">
                  <div className="text-sm text-white/70 light:text-black/70 mb-2">Match Code</div>
                  <div className="font-mono font-bold text-lg text-white light:text-black bg-white/10 light:bg-black/10 px-4 py-3 rounded-lg text-center">
                    {nextMatch.match_code}
                  </div>
                </div>
              )}

              <Link
                href="/dashboard/match-room"
                className="relative w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white font-black rounded-xl hover:from-red-600 hover:to-orange-600 transition-all shadow-2xl shadow-red-500/30 group"
              >
                Open Match Room
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          ) : (
            <div className="relative flex-1 flex flex-col items-center justify-center text-center">
              <Clock className="w-16 h-16 text-white/20 light:text-black/20 mb-4" />
              <h3 className="text-xl font-black text-white light:text-black mb-2">
                No Upcoming Matches
              </h3>
              <p className="text-white/70 light:text-black/70 mb-6">
                Join a tournament to schedule matches
              </p>
              <Link
                href="/dashboard/tournaments"
                className="px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold rounded-xl hover:from-red-600 hover:to-orange-600 transition-all shadow-lg shadow-red-500/20 flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Find Tournaments
              </Link>
            </div>
          )}
        </motion.div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #ef4444, #f97316);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #dc2626, #ea580c);
        }
      `}</style>
    </div>
  );
}
