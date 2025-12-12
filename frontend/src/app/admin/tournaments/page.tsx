"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Calendar, 
  Users, 
  Trophy, 
  Clock,
  Edit,
  Trash2,
  DollarSign
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AdminTournamentsPage() {
  const router = useRouter();
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    loadTournaments();
  }, [statusFilter]);

  const loadTournaments = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('tournaments')
        .select('*')
        .order('start_date', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setTournaments(data || []);
    } catch (error) {
      console.error('Error loading tournaments:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTournaments = tournaments.filter((t) => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.game.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'upcoming': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      case 'ongoing': return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'completed': return 'text-white/50 bg-white/5 border-white/10';
      case 'cancelled': return 'text-red-500 bg-red-500/10 border-red-500/20';
      default: return 'text-white/70 bg-white/5 border-white/10';
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-white mb-2">
            TOURNAMENTS
          </h1>
          <p className="text-white/70">
            Create and manage competitive events
          </p>
        </div>
        <Link
          href="/admin/tournaments/create"
          className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-red-500/20 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Create Tournament
        </Link>
      </div>

      {/* Filters */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="md:col-span-2 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
          <input
            type="text"
            placeholder="Search tournaments by name or game..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-slate-900 border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-red-500 focus:outline-none transition-all"
          />
        </div>
        
        <div className="md:col-span-2 flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
          {['all', 'upcoming', 'ongoing', 'completed', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-3 rounded-xl font-bold text-sm capitalize whitespace-nowrap transition-all border {
                statusFilter === status
                  ? 'bg-white text-black border-white'
                  : 'bg-slate-900 text-white/50 border-white/10 hover:border-white/30 hover:text-white'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Tournaments Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full"
          />
        </div>
      ) : filteredTournaments.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTournaments.map((tournament) => (
            <div 
              key={tournament.id}
              className="bg-slate-900 border border-white/10 rounded-2xl overflow-hidden group hover:border-red-500/30 transition-all"
            >
              <div className="aspect-video bg-black relative">
                {/* Banner Placeholder */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent flex items-center justify-center">
                  <Trophy className="w-12 h-12 text-white/10" />
                </div>
                
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(tournament.status)} capitalize`}>
                    {tournament.status}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="mb-4">
                  <div className="text-xs font-bold text-red-500 uppercase tracking-wider mb-1">
                    {tournament.game}
                  </div>
                  <h3 className="text-xl font-black text-white leading-tight group-hover:text-red-500 transition-colors">
                    {tournament.name}
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-2 text-white/70 text-sm">
                    <Users className="w-4 h-4" />
                    <span>{tournament.current_participants}/{tournament.max_participants}</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/70 text-sm">
                    <DollarSign className="w-4 h-4" />
                    <span>{tournament.prize_pool}</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/70 text-sm col-span-2">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(tournament.start_date).toLocaleDateString()} at {new Date(tournament.start_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                  <Link
                    href={`/admin/tournaments/${tournament.id}`}
                    className="flex-1 px-4 py-2 bg-white text-black font-bold rounded-lg text-center hover:bg-gray-200 transition-colors"
                  >
                    Manage
                  </Link>
                  <button className="p-2 text-white/50 hover:text-white transition-colors">
                    <Edit className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-slate-900 border border-white/10 rounded-2xl border-dashed">
          <Trophy className="w-16 h-16 text-white/10 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No Tournaments Found</h3>
          <p className="text-white/50 mb-8">Try adjusting your filters or create a new tournament.</p>
          <Link
            href="/admin/tournaments/create"
            className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-all inline-flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create Tournament
          </Link>
        </div>
      )}
    </div>
  );
}
