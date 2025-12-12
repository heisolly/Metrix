"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy, Gamepad2, Clock } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { TournamentCountdown, MatchCountdown } from "@/components/Countdown";
import Link from "next/link";

interface FeaturedCountdownsProps {
  maxItems?: number;
  showTournaments?: boolean;
  showMatches?: boolean;
}

export default function FeaturedCountdowns({ 
  maxItems = 2,
  showTournaments = true,
  showMatches = true
}: FeaturedCountdownsProps) {
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeaturedItems();
  }, []);

  const loadFeaturedItems = async () => {
    try {
      const now = new Date().toISOString();

      // Fetch upcoming tournaments with countdown enabled
      if (showTournaments) {
        const { data: tournamentsData } = await supabase
          .from('tournaments')
          .select('*')
          .eq('show_countdown', true)
          .in('status', ['upcoming', 'registration_open'])
          .gte('start_date', now)
          .order('start_date', { ascending: true })
          .limit(maxItems);

        setTournaments(tournamentsData || []);
      }

      // Fetch upcoming matches with countdown enabled
      if (showMatches) {
        const { data: matchesData } = await supabase
          .from('matches')
          .select('*')
          .eq('show_countdown', true)
          .eq('status', 'scheduled')
          .gte('scheduled_time', now)
          .order('scheduled_time', { ascending: true })
          .limit(maxItems);

        if (matchesData && matchesData.length > 0) {
          // Fetch tournament info for matches
          const tournamentIds = [...new Set(matchesData.map(m => m.tournament_id))];
          const { data: tournamentInfo } = await supabase
            .from('tournaments')
            .select('id, name')
            .in('id', tournamentIds);

          const tournamentMap = new Map(tournamentInfo?.map(t => [t.id, t]) || []);
          
          const matchesWithInfo = matchesData.map(match => ({
            ...match,
            tournament: tournamentMap.get(match.tournament_id)
          }));

          setMatches(matchesWithInfo);
        }
      }
    } catch (error) {
      console.error('Error loading featured countdowns:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  const hasContent = tournaments.length > 0 || matches.length > 0;

  if (!hasContent) return null;

  return (
    <div className="w-full py-16 bg-gradient-to-b from-black to-slate-900">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Clock className="w-8 h-8 text-red-500" />
            <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-wide">
              Starting Soon
            </h2>
          </div>
          <p className="text-white/70 text-lg">
            Don't miss out on these upcoming events!
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Tournaments */}
          {tournaments.map((tournament, index) => (
            <motion.div
              key={tournament.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={`/tournaments/${tournament.id}`}>
                <div className="group cursor-pointer">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Trophy className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-red-500 transition-colors">
                        {tournament.name}
                      </h3>
                      <p className="text-white/50 text-sm">Tournament</p>
                    </div>
                  </div>
                  
                  <TournamentCountdown
                    targetDate={tournament.countdown_start_time || tournament.start_date}
                    title={`${tournament.name} Registration`}
                  />
                </div>
              </Link>
            </motion.div>
          ))}

          {/* Matches */}
          {matches.map((match, index) => (
            <motion.div
              key={match.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (tournaments.length + index) * 0.1 }}
            >
              <Link href={`/dashboard/matches/${match.id}`}>
                <div className="group cursor-pointer">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Gamepad2 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-red-500 transition-colors">
                        {match.tournament?.name || 'Upcoming Match'}
                      </h3>
                      <p className="text-white/50 text-sm">Round {match.round} - Match</p>
                    </div>
                  </div>
                  
                  <MatchCountdown
                    targetDate={match.countdown_start_time || match.scheduled_time}
                    title={`${match.tournament?.name} - Round ${match.round}`}
                  />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* View All Link */}
        <div className="text-center mt-12">
          <Link
            href="/tournaments"
            className="inline-block px-8 py-4 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-red-500/30"
          >
            View All Tournaments
          </Link>
        </div>
      </div>
    </div>
  );
}
