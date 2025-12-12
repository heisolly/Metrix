"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Trophy, Users, DollarSign, Calendar, Clock, Filter, Search } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/auth";

export default function TournamentsPage() {
  const router = useRouter();
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [myTournaments, setMyTournaments] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    loadTournaments();
  }, [filter]);

  const loadTournaments = async () => {
    try {
      setLoading(true);
      const user = await getCurrentUser();
      setUserId(user?.id || null);

      // Load all tournaments
      let query = supabase
        .from('tournaments')
        .select('*')
        .order('start_date', { ascending: true });

      if (filter === 'upcoming') {
        query = query.eq('status', 'upcoming');
      } else if (filter === 'ongoing') {
        query = query.eq('status', 'ongoing');
      } else if (filter === 'completed') {
        query = query.eq('status', 'completed');
      }

      const { data: tournamentsData } = await query;
      setTournaments(tournamentsData || []);

      // Load user's tournaments
      if (user) {
        const { data: myTourneysData } = await supabase
          .from('tournament_participants')
          .select('tournament_id')
          .eq('user_id', user.id);
        
        setMyTournaments(myTourneysData?.map(t => t.tournament_id) || []);
      }

    } catch (error) {
      console.error('Error loading tournaments:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTournaments = tournaments.filter(t =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.game.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-slate-900 to-black flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-slate-900 to-black">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-white mb-2">Tournaments</h1>
          <p className="text-white/50">Join competitive gaming tournaments and win prizes</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
              <input
                type="text"
                placeholder="Search tournaments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-red-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex gap-2">
            {['all', 'upcoming', 'ongoing', 'completed'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-3 rounded-xl font-bold capitalize transition-all {
                  filter === f
                    ? 'bg-red-500 text-white'
                    : 'bg-slate-900 text-white/50 hover:text-white border border-white/10'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Tournaments Grid */}
        {filteredTournaments.length === 0 ? (
          <div className="text-center py-20">
            <Trophy className="w-16 h-16 text-white/10 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No Tournaments Found</h3>
            <p className="text-white/50">Check back later for new tournaments</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTournaments.map((tournament) => {
              const isJoined = myTournaments.includes(tournament.id);
              const isFull = tournament.current_participants >= tournament.max_participants;

              return (
                <motion.div
                  key={tournament.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-slate-900 border border-white/10 rounded-2xl p-6 hover:border-red-500/50 transition-all cursor-pointer"
                  onClick={() => router.push(`/dashboard/tournaments/${tournament.id}`)}
                >
                  {/* Game Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-red-500 uppercase tracking-wider">
                      {tournament.game}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase {
                      tournament.status === 'upcoming' ? 'bg-blue-500 text-white' :
                      tournament.status === 'ongoing' ? 'bg-green-500 text-white' :
                      'bg-white/10 text-white'
                    }`}>
                      {tournament.status}
                    </span>
                  </div>

                  {/* Tournament Name */}
                  <h3 className="text-xl font-black text-white mb-4">{tournament.name}</h3>

                  {/* Stats */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-white/70">
                      <DollarSign className="w-4 h-4 text-green-500" />
                      <span className="font-bold text-green-500">{tournament.prize_pool}</span>
                      <span className="text-sm">Prize Pool</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/70">
                      <Users className="w-4 h-4" />
                      <span>{tournament.current_participants}/{tournament.max_participants} Players</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/70">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(tournament.start_date).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  {isJoined && (
                    <div className="px-3 py-2 bg-green-500/20 border border-green-500/30 rounded-lg text-center">
                      <span className="text-sm font-bold text-green-500">✓ Joined</span>
                    </div>
                  )}
                  {!isJoined && isFull && (
                    <div className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-center">
                      <span className="text-sm font-bold text-white/50">Full</span>
                    </div>
                  )}
                  {!isJoined && !isFull && tournament.status === 'upcoming' && (
                    <div className="px-3 py-2 bg-red-500/20 border border-red-500/30 rounded-lg text-center">
                      <span className="text-sm font-bold text-red-500">Entry: {tournament.entry_fee}</span>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
