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
      {/* Welcome Header - Mobile Optimized */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4 md:mb-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Flame className="w-5 h-5 md:w-6 md:h-6 text-red-500 animate-pulse" />
              <h1 className="text-lg md:text-2xl lg:text-3xl font-black text-white light:text-black">
                WELCOME BACK
              </h1>
            </div>
            <p className="text-xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">
              {profile?.username?.toUpperCase() || "PLAYER"}
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm md:text-base">
            <Crown className="w-4 h-4 text-yellow-500" />
            <span className="text-white/70 light:text-black/70">Rank #{profile?.rank || 0}</span>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards - Mobile Optimized Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 mb-4 md:mb-6">
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
            value: `₦${stats?.total_earnings || 0}`, 
            subtitle: "Total",
            gradient: "from-blue-500 via-cyan-500 to-teal-500",
            glow: "shadow-blue-500/20"
          },
          { 
            icon: Award, 
            label: "Rank", 
            value: `#${profile?.rank || 0}`, 
            subtitle: "Global",
            gradient: "from-purple-500 via-pink-500 to-red-500",
            glow: "shadow-purple-500/20"
          },
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -3, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`relative bg-gradient-to-br ${stat.gradient} p-[1px] md:p-[2px] rounded-lg md:rounded-xl shadow-lg ${stat.glow}`}
          >
            <div className="bg-black/90 light:bg-white/90 rounded-lg md:rounded-xl p-2.5 md:p-4 h-full flex flex-col">
              <div className="flex items-center justify-between mb-1.5 md:mb-2">
                <stat.icon className="w-4 h-4 md:w-6 md:h-6 text-white light:text-black flex-shrink-0" />
                <Zap className="w-2.5 h-2.5 md:w-4 md:h-4 text-yellow-500 flex-shrink-0" />
              </div>
              <div className="text-lg md:text-2xl lg:text-3xl font-black text-white light:text-black mb-0.5 md:mb-1 leading-tight">
                {stat.value}
              </div>
              <div className="text-[9px] md:text-xs font-bold text-white/70 light:text-black/70 leading-tight">
                {stat.label}
              </div>
              <div className="text-[8px] md:text-xs text-green-500 font-bold leading-tight mt-0.5">
                {stat.subtitle}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Mobile: Tabs for Content Sections */}
      <div className="lg:hidden mb-4">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {['Tournaments', 'Results', 'Next Match'].map((tab, i) => (
            <button
              key={tab}
              className={`px-4 py-2 rounded-lg font-bold text-sm whitespace-nowrap transition-all ${
                i === 0 
                  ? 'bg-red-500 text-white' 
                  : 'bg-white/5 text-white/70 hover:bg-white/10'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Active Tournaments - Mobile Optimized */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 light:from-white/90 light:to-gray-100/90 border-2 border-white/10 light:border-black/10 rounded-xl md:rounded-2xl p-4 md:p-6 backdrop-blur-xl shadow-2xl mb-4 md:mb-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg md:rounded-xl flex items-center justify-center">
              <Trophy className="w-4 h-4 md:w-6 md:h-6 text-white" />
            </div>
            <h2 className="text-lg md:text-xl lg:text-2xl font-black text-white light:text-black">
              ACTIVE TOURNAMENTS
            </h2>
          </div>
          <Link href="/dashboard/tournaments" className="text-red-500 hover:text-red-400 font-bold text-xs md:text-sm flex items-center gap-1 group">
            View All
            <ArrowRight className="w-3 h-3 md:w-4 md:h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {activeTournaments.length > 0 ? (
          <div className="space-y-3 md:space-y-4 max-h-[400px] md:max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {activeTournaments.map((item: any, index: number) => {
              const tournament = item.tournament;
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  whileHover={{ scale: 1.01, x: 5 }}
                  whileTap={{ scale: 0.99 }}
                  className="relative p-3 md:p-4 bg-gradient-to-r from-white/5 to-white/10 light:from-black/5 light:to-black/10 rounded-lg md:rounded-xl border border-white/20 light:border-black/20 hover:border-red-500/50 transition-all group overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/5 to-red-500/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="relative">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <Gamepad2 className="w-3 h-3 md:w-4 md:h-4 text-red-500 flex-shrink-0" />
                          <span className="text-xs md:text-sm font-bold text-white/70 light:text-black/70">
                            {tournament.game}
                          </span>
                          <span className="px-2 py-0.5 bg-red-500/20 border border-red-500/30 rounded text-[10px] md:text-xs font-bold text-red-500">
                            {item.status}
                          </span>
                        </div>
                        <h3 className="text-base md:text-lg lg:text-xl font-black text-white light:text-black mb-2 md:mb-3 group-hover:text-red-500 transition-colors line-clamp-2">
                          {tournament.name}
                        </h3>
                        <div className="flex flex-wrap items-center gap-3 md:gap-4 text-xs md:text-sm">
                          <div className="flex items-center gap-1 md:gap-2">
                            <Users className="w-3 h-3 md:w-4 md:h-4 text-white/50 light:text-black/50" />
                            <span className="font-bold text-white light:text-black">
                              {tournament.current_participants}/{tournament.max_participants}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 md:gap-2">
                            <DollarSign className="w-3 h-3 md:w-4 md:h-4 text-green-500" />
                            <span className="font-black text-green-500">₦{tournament.prize_pool}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-white/10 light:border-black/10">
                      <div className="flex items-center gap-1 md:gap-2">
                        <Clock className="w-3 h-3 md:w-4 md:h-4 text-yellow-500" />
                        <span className="text-xs md:text-sm font-bold text-white light:text-black">
                          {new Date(tournament.start_date).toLocaleDateString()}
                        </span>
                      </div>
                      <Link
                        href={`/dashboard/tournaments/${tournament.id}`}
                        className="px-3 md:px-4 py-1.5 md:py-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs md:text-sm font-bold rounded-lg hover:from-red-600 hover:to-red-700 transition-all shadow-lg shadow-red-500/20"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 md:py-16 text-center">
            <Trophy className="w-12 h-12 md:w-16 md:h-16 text-white/20 light:text-black/20 mb-4" />
            <h3 className="text-lg md:text-xl font-black text-white light:text-black mb-2">
              No Active Tournaments
            </h3>
            <p className="text-sm md:text-base text-white/70 light:text-black/70 mb-6">
              Join a tournament to start competing
            </p>
            <Link
              href="/dashboard/tournaments"
              className="px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold rounded-lg md:rounded-xl hover:from-red-600 hover:to-orange-600 transition-all shadow-lg shadow-red-500/20 flex items-center gap-2 text-sm md:text-base"
            >
              <Plus className="w-4 h-4 md:w-5 md:h-5" />
              Browse Tournaments
            </Link>
          </div>
        )}
      </motion.div>

      {/* Bottom Cards - Mobile Stacked */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Recent Results */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          whileHover={{ y: -3 }}
          className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 light:from-white/90 light:to-gray-100/90 border-2 border-white/10 light:border-black/10 rounded-xl md:rounded-2xl p-4 md:p-6 shadow-2xl"
        >
          <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-5">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg md:rounded-xl flex items-center justify-center">
              <Target className="w-4 h-4 md:w-6 md:h-6 text-white" />
            </div>
            <h3 className="text-base md:text-lg lg:text-xl font-black text-white light:text-black">
              RECENT RESULTS
            </h3>
          </div>
          {recentResults.length > 0 ? (
            <div className="space-y-2 md:space-y-3">
              {recentResults.map((result: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-2 md:p-3 bg-white/5 light:bg-black/5 rounded-lg hover:bg-white/10 light:hover:bg-black/10 transition-all">
                  <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
                    {getPlacementIcon(result.rank)}
                    <span className="text-xs md:text-sm text-white/70 light:text-black/70 truncate">
                      {result.tournament.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
                    <span className={`text-xs md:text-sm font-black ${getPlacementColor(result.rank)}`}>
                      #{result.rank}
                    </span>
                    <span className="text-xs md:text-sm font-bold text-green-500">₦{result.prize_won}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-white/50 light:text-black/50 text-xs md:text-sm">
                No results yet
              </p>
            </div>
          )}
        </motion.div>

        {/* Your Rank */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          whileHover={{ y: -3 }}
          className="relative bg-gradient-to-br from-red-500/20 to-orange-500/20 border-2 border-red-500/30 rounded-xl md:rounded-2xl p-4 md:p-6 overflow-hidden shadow-2xl shadow-red-500/10"
        >
          <div className="absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 bg-red-500/10 rounded-full blur-3xl" />
          <div className="relative flex items-center gap-2 md:gap-3 mb-4 md:mb-5">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg md:rounded-xl flex items-center justify-center">
              <Award className="w-4 h-4 md:w-6 md:h-6 text-white" />
            </div>
            <h3 className="text-base md:text-lg lg:text-xl font-black text-white light:text-black">
              YOUR RANK
            </h3>
          </div>
          <div className="relative text-center">
            <div className="text-4xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500 mb-2">
              #{profile?.rank || 0}
            </div>
            <div className="text-xs md:text-sm text-white/70 light:text-black/70">
              Keep competing to climb!
            </div>
          </div>
        </motion.div>
      </div>

      {/* Mobile Bottom Navigation Spacer */}
      <div className="h-20 lg:hidden" />

    </div>
  );
}
