"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Users,
  Eye,
  Trophy,
  Calendar,
  AlertCircle,
  DollarSign,
  TrendingUp,
  Clock,
  ArrowRight
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState<any>(null);
  const [upcomingTournaments, setUpcomingTournaments] = useState<any[]>([]);
  const [recentPlayers, setRecentPlayers] = useState<any[]>([]);
  const [recentDisputes, setRecentDisputes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Calculate metrics manually for accuracy
      
      // Count ALL users (not just players)
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
      
      const { count: spectatorsCount } = await supabase
        .from('spectators')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');
      
      const { count: tournamentsCount } = await supabase
        .from('tournaments')
        .select('*', { count: 'exact', head: true })
        .in('status', ['upcoming', 'ongoing']);
      
      const { count: matchesCount } = await supabase
        .from('matches')
        .select('*', { count: 'exact', head: true })
        .gte('scheduled_time', new Date().toISOString().split('T')[0]);
      
      const { count: disputesCount } = await supabase
        .from('disputes')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'open');
      
      const { count: payoutsCount } = await supabase
        .from('withdrawal_requests')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');
      
      const metricsData = {
        total_players: totalUsers || 0,
        active_spectators: spectatorsCount || 0,
        active_tournaments: tournamentsCount || 0,
        todays_matches: matchesCount || 0,
        open_disputes: disputesCount || 0,
        pending_payouts: payoutsCount || 0,
        active_entry_fees: 0,
        monthly_payouts: 0
      };
      
      setMetrics(metricsData);

      // Get upcoming tournaments
      const { data: tournaments } = await supabase
        .from('tournaments')
        .select('*')
        .eq('status', 'upcoming')
        .order('start_date', { ascending: true })
        .limit(5);
      
      setUpcomingTournaments(tournaments || []);

      // Get recent players (all users, sorted by creation date)
      const { data: players } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      
      setRecentPlayers(players || []);

      // Get recent disputes
      try {
        const { data: disputes } = await supabase
          .from('disputes')
          .select(`
            *,
            match:matches(tournament:tournaments(name))
          `)
          .eq('status', 'open')
          .order('created_at', { ascending: false })
          .limit(5);
        
        setRecentDisputes(disputes || []);
      } catch (error) {
        console.log('Disputes table not available');
        setRecentDisputes([]);
      }

    } catch (error) {
      console.error('Error loading admin dashboard:', error);
      // Set default values on error
      setMetrics({
        total_players: 0,
        active_spectators: 0,
        active_tournaments: 0,
        todays_matches: 0,
        open_disputes: 0,
        pending_payouts: 0,
        active_entry_fees: 0,
        monthly_payouts: 0
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  const statCards = [
    {
      icon: Users,
      label: "Total Players",
      value: metrics?.total_players || 0,
      color: "from-blue-500 to-cyan-500",
      link: "/admin/users"
    },
    {
      icon: Eye,
      label: "Active Spectators",
      value: metrics?.active_spectators || 0,
      color: "from-purple-500 to-pink-500",
      link: "/admin/spectators"
    },
    {
      icon: Trophy,
      label: "Active Tournaments",
      value: metrics?.active_tournaments || 0,
      color: "from-yellow-500 to-orange-500",
      link: "/admin/tournaments"
    },
    {
      icon: Calendar,
      label: "Today's Matches",
      value: metrics?.todays_matches || 0,
      color: "from-green-500 to-emerald-500",
      link: "/admin/matches"
    },
    {
      icon: AlertCircle,
      label: "Open Disputes",
      value: metrics?.open_disputes || 0,
      color: "from-red-500 to-rose-500",
      link: "/admin/matches?tab=disputes"
    },
    {
      icon: DollarSign,
      label: "Pending Payouts",
      value: metrics?.pending_payouts || 0,
      color: "from-teal-500 to-cyan-500",
      link: "/admin/payments"
    },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Admin Navbar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 relative overflow-hidden"
      >
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-orange-500/10 to-red-500/10 rounded-3xl" />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl rounded-3xl border border-white/10" />
        
        {/* Content */}
        <div className="relative p-8">
          {/* Header Row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50" />
                <span className="text-xs font-bold text-green-500 uppercase tracking-wider">System Active</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-red-500 to-orange-500 mb-2">
                ADMIN CONTROL CENTER
              </h1>
              <p className="text-white/70">
                Platform overview and management tools
              </p>
            </div>
            
            {/* Quick Stats Preview */}
            <div className="flex gap-4">
              <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="text-2xl font-black text-white">{metrics?.total_players || 0}</div>
                <div className="text-xs text-white/50 font-bold">Players</div>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="text-2xl font-black text-green-500">{metrics?.active_tournaments || 0}</div>
                <div className="text-xs text-white/50 font-bold">Live</div>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="text-2xl font-black text-red-500">{metrics?.open_disputes || 0}</div>
                <div className="text-xs text-white/50 font-bold">Disputes</div>
              </div>
            </div>
          </div>

          {/* Quick Actions Bar */}
          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/tournaments/create"
              className="px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-red-500/30 flex items-center gap-2"
            >
              <Trophy className="w-4 h-4" />
              New Tournament
            </Link>
            
            <Link
              href="/admin/matches/create"
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all border border-white/20 flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              Create Match
            </Link>
            
            <Link
              href="/admin/users"
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all border border-white/20 flex items-center gap-2"
            >
              <Users className="w-4 h-4" />
              Manage Users
            </Link>
            
            <Link
              href="/admin/spectators"
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all border border-white/20 flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              Spectators
            </Link>

            <Link
              href="/admin/payments"
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all border border-white/20 flex items-center gap-2"
            >
              <DollarSign className="w-4 h-4" />
              Payments
            </Link>

            {metrics?.open_disputes > 0 && (
              <Link
                href="/admin/matches?tab=disputes"
                className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-500 font-bold rounded-xl transition-all border border-red-500/30 flex items-center gap-2 animate-pulse"
              >
                <AlertCircle className="w-4 h-4" />
                {metrics.open_disputes} Dispute{metrics.open_disputes !== 1 ? 's' : ''}
              </Link>
            )}
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl -z-10" />
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <Link key={index} href={stat.link}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className={`relative bg-gradient-to-br ${stat.color} p-[2px] rounded-2xl shadow-2xl cursor-pointer`}
            >
              <div className="bg-slate-900 rounded-2xl p-6 h-full">
                <div className="flex items-center justify-between mb-4">
                  <stat.icon className="w-10 h-10 text-white" />
                  <ArrowRight className="w-5 h-5 text-white/50" />
                </div>
                <div className="text-4xl font-black text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-sm font-bold text-white/70">
                  {stat.label}
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* Revenue Cards */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-white/10 rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-black text-white">Active Entry Fees</h3>
          </div>
          <div className="text-4xl font-black text-green-500 mb-2">
            {(metrics?.active_entry_fees || 0).toFixed(2)}
          </div>
          <div className="text-sm text-white/70">
            From ongoing tournaments
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-white/10 rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-black text-white">Monthly Payouts</h3>
          </div>
          <div className="text-4xl font-black text-red-500 mb-2">
            {(metrics?.monthly_payouts || 0).toFixed(2)}
          </div>
          <div className="text-sm text-white/70">
            Last 30 days
          </div>
        </motion.div>
      </div>

      {/* Quick Lists */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Upcoming Tournaments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-white/10 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-black text-white">Starting Soon</h3>
            <Link href="/admin/tournaments" className="text-red-500 hover:text-red-400 text-sm font-bold">
              View All
            </Link>
          </div>
          
          {upcomingTournaments.length > 0 ? (
            <div className="space-y-3">
              {upcomingTournaments.map((tournament) => (
                <Link
                  key={tournament.id}
                  href={`/admin/tournaments/${tournament.id}`}
                  className="block p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all"
                >
                  <div className="font-bold text-white text-sm mb-1">{tournament.name}</div>
                  <div className="flex items-center gap-2 text-xs text-white/70">
                    <Clock className="w-3 h-3" />
                    {new Date(tournament.start_date).toLocaleDateString()}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-white/50 text-sm">
              No upcoming tournaments
            </div>
          )}
        </motion.div>

        {/* Recent Players */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-white/10 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-black text-white">New Players</h3>
            <Link href="/admin/users" className="text-red-500 hover:text-red-400 text-sm font-bold">
              View All
            </Link>
          </div>
          
          {recentPlayers.length > 0 ? (
            <div className="space-y-3">
              {recentPlayers.map((player) => (
                <Link
                  key={player.id}
                  href={`/admin/users/${player.id}`}
                  className="block p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all"
                >
                  <div className="font-bold text-white text-sm mb-1">{player.username || player.email}</div>
                  <div className="text-xs text-white/70">
                    {new Date(player.created_at).toLocaleDateString()}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-white/50 text-sm">
              No new players
            </div>
          )}
        </motion.div>

        {/* Recent Disputes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-red-500/30 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-black text-white">Open Disputes</h3>
            <Link href="/admin/matches?tab=disputes" className="text-red-500 hover:text-red-400 text-sm font-bold">
              View All
            </Link>
          </div>
          
          {recentDisputes.length > 0 ? (
            <div className="space-y-3">
              {recentDisputes.map((dispute: any) => (
                <Link
                  key={dispute.id}
                  href={`/admin/matches/disputes/${dispute.id}`}
                  className="block p-3 bg-red-500/10 border border-red-500/30 rounded-lg hover:bg-red-500/20 transition-all"
                >
                  <div className="font-bold text-white text-sm mb-1">
                    {dispute.match?.tournament?.name || 'Match Dispute'}
                  </div>
                  <div className="text-xs text-white/70 line-clamp-2">
                    {dispute.reason}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-white/50 text-sm">
              No open disputes
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
