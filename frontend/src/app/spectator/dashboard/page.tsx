"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Eye, 
  Trophy, 
  Clock, 
  Users,
  ArrowRight,
  Search,
  Filter
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function SpectatorDashboard() {
  const [user, setUser] = useState<any>(null);
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "live" | "upcoming" | "completed">("all");

  useEffect(() => {
    // Get current user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (user) {
        loadMatches();
      } else {
        setLoading(false);
      }
    });
  }, []);

  const loadMatches = async () => {
    try {
      console.log('Loading matches...');
      
      // First try simple query
      const { data, error } = await supabase
        .from('matches')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        setError(`Database error: ${error.message}`);
        setLoading(false);
        return;
      }
      
      console.log('Loaded matches:', data?.length || 0, data);
      
      // If we have matches, try to get related data
      if (data && data.length > 0) {
        const matchesWithDetails = await Promise.all(
          data.map(async (match) => {
            // Get tournament
            const { data: tournament } = await supabase
              .from('tournaments')
              .select('name, game')
              .eq('id', match.tournament_id)
              .single();
            
            // Get players
            const { data: player1 } = await supabase
              .from('profiles')
              .select('username, avatar_url')
              .eq('id', match.player1_id)
              .single();
              
            const { data: player2 } = await supabase
              .from('profiles')
              .select('username, avatar_url')
              .eq('id', match.player2_id)
              .single();
            
            return {
              ...match,
              tournament,
              player1,
              player2
            };
          })
        );
        
        setMatches(matchesWithDetails);
      } else {
        setMatches([]);
      }
    } catch (error: any) {
      console.error('Error loading matches:', error);
      setError(`Failed to load matches: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const filteredMatches = matches.filter(match => {
    const matchesSearch = 
      match.tournament?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      match.player1?.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      match.player2?.username.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || match.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'bg-red-500 text-white animate-pulse';
      case 'completed': return 'bg-green-500 text-white';
      case 'upcoming': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/70">Loading matches...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <div className="max-w-md bg-slate-900 border border-white/10 rounded-2xl p-8 text-center">
          <Eye className="w-16 h-16 text-purple-500 mx-auto mb-4" />
          <h2 className="text-2xl font-black text-white mb-4">Spectator Login Required</h2>
          <p className="text-white/70 mb-6">
            Please login with your spectator account to access the dashboard.
          </p>
          <Link
            href="/signin"
            className="inline-block px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:shadow-lg transition-all"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-12">
          <div className="max-w-7xl mx-auto px-4">
            <h1 className="text-4xl font-black">Spectator Dashboard</h1>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-red-900/20 border border-red-500 rounded-2xl p-8 text-center">
            <h3 className="text-xl font-bold text-red-500 mb-4">Error Loading Matches</h3>
            <p className="text-white/70 mb-4">{error}</p>
            <button
              onClick={() => {
                setError(null);
                setLoading(true);
                loadMatches();
              }}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-all"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <Eye className="w-10 h-10" />
            <div>
              <h1 className="text-4xl font-black">Spectator Dashboard</h1>
              <p className="text-white/90">Monitor and manage live matches</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6">
            <div className="text-sm text-white/50 mb-1">Total Matches</div>
            <div className="text-3xl font-black text-white">{matches.length}</div>
          </div>
          <div className="bg-slate-900 border border-red-500/30 rounded-2xl p-6">
            <div className="text-sm text-red-500 mb-1">Live Now</div>
            <div className="text-3xl font-black text-white">
              {matches.filter(m => m.status === 'live').length}
            </div>
          </div>
          <div className="bg-slate-900 border border-blue-500/30 rounded-2xl p-6">
            <div className="text-sm text-blue-500 mb-1">Upcoming</div>
            <div className="text-3xl font-black text-white">
              {matches.filter(m => m.status === 'upcoming').length}
            </div>
          </div>
          <div className="bg-slate-900 border border-green-500/30 rounded-2xl p-6">
            <div className="text-sm text-green-500 mb-1">Completed</div>
            <div className="text-3xl font-black text-white">
              {matches.filter(m => m.status === 'completed').length}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
            <input
              type="text"
              placeholder="Search matches, players, tournaments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-900 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:border-purple-500 focus:outline-none"
            />
          </div>

          <div className="flex gap-2">
            {(['all', 'live', 'upcoming', 'completed'] as const).map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-6 py-3 rounded-xl font-bold whitespace-nowrap transition-all {
                  filterStatus === status
                    ? "bg-purple-500 text-white"
                    : "bg-slate-900 text-white/70 border border-white/10 hover:text-white"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Matches Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMatches.length === 0 ? (
            <div className="col-span-full bg-slate-900 border border-white/10 rounded-2xl p-12 text-center">
              <Trophy className="w-16 h-16 text-white/20 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No matches found</h3>
              <p className="text-white/50">Try adjusting your search or filter</p>
            </div>
          ) : (
            filteredMatches.map((match, index) => (
              <motion.div
                key={match.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-slate-900 border border-white/10 rounded-2xl overflow-hidden hover:border-purple-500/50 transition-all group"
              >
                {/* Status Badge */}
                <div className={`px-4 py-2 ${getStatusColor(match.status)} text-center font-bold text-sm`}>
                  {match.status === 'live' && '🔴 '}
                  {match.status.toUpperCase()}
                </div>

                <div className="p-6">
                  {/* Tournament Info */}
                  <div className="mb-4">
                    <div className="text-xs text-white/50 mb-1">Tournament</div>
                    <div className="font-bold text-white">{match.tournament?.name}</div>
                    <div className="text-xs text-purple-400">{match.tournament?.game}</div>
                  </div>

                  {/* Players */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {match.player1?.username?.charAt(0) || 'P'}
                        </div>
                        <span className="text-white font-semibold">{match.player1?.username || 'TBD'}</span>
                      </div>
                      {match.status === 'completed' && match.winner_id === match.player1_id && (
                        <Trophy className="w-5 h-5 text-yellow-500" />
                      )}
                      {match.player1_kills !== null && (
                        <span className="text-white/70">{match.player1_kills} kills</span>
                      )}
                    </div>

                    <div className="text-center text-white/50 text-sm font-bold">VS</div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {match.player2?.username?.charAt(0) || 'P'}
                        </div>
                        <span className="text-white font-semibold">{match.player2?.username || 'TBD'}</span>
                      </div>
                      {match.status === 'completed' && match.winner_id === match.player2_id && (
                        <Trophy className="w-5 h-5 text-yellow-500" />
                      )}
                      {match.player2_kills !== null && (
                        <span className="text-white/70">{match.player2_kills} kills</span>
                      )}
                    </div>
                  </div>

                  {/* Match Time */}
                  {match.scheduled_at && (
                    <div className="flex items-center gap-2 text-sm text-white/50 mb-4">
                      <Clock className="w-4 h-4" />
                      {new Date(match.scheduled_at).toLocaleString()}
                    </div>
                  )}

                  {/* Action Button */}
                  <Link
                    href={`/spectator/matches/${match.id}`}
                    className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 group-hover:shadow-lg"
                  >
                    {match.status === 'live' ? 'Manage Live Match' : 'View Match'}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
