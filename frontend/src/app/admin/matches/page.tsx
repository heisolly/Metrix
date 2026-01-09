"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
  CheckCircle,
  Edit,
  Trash2,
  Play,
  XCircle,
  Clock,
  Eye,
  Calendar,
  Users,
  Filter,
  Search
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import Countdown from "@/components/Countdown";

export default function AdminMatchesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'matches');
  
  const [matches, setMatches] = useState<any[]>([]);
  const [disputes, setDisputes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCountdown, setShowCountdown] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'matches') {
        // Fetch matches without joins first
        const { data: matchesData } = await supabase
          .from('matches')
          .select('*')
          .order('scheduled_time', { ascending: false })
          .limit(100);

        if (matchesData && matchesData.length > 0) {
          // Collect IDs
          const playerIds = new Set<string>();
          const tournamentIds = new Set<string>();
          
          matchesData.forEach(match => {
            if (match.player1_id) playerIds.add(match.player1_id);
            if (match.player2_id) playerIds.add(match.player2_id);
            if (match.tournament_id) tournamentIds.add(match.tournament_id);
          });

          // Fetch profiles and tournaments
          const { data: profiles } = await supabase
            .from('profiles')
            .select('id, username')
            .in('id', Array.from(playerIds));

          const { data: tournaments } = await supabase
            .from('tournaments')
            .select('id, name')
            .in('id', Array.from(tournamentIds));

          const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);
          const tournamentMap = new Map(tournaments?.map(t => [t.id, t]) || []);

          // Merge data
          const matchesWithData = matchesData.map(match => ({
            ...match,
            player1: profileMap.get(match.player1_id),
            player2: profileMap.get(match.player2_id),
            tournament: tournamentMap.get(match.tournament_id),
          }));

          setMatches(matchesWithData);
        } else {
          setMatches([]);
        }
      } else {
        const { data } = await supabase
          .from('disputes')
          .select('*')
          .order('created_at', { ascending: false });
        setDisputes(data || []);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMatch = async (matchId: string) => {
    if (!confirm('Are you sure you want to delete this match? This action cannot be undone.')) return;

    try {
      const { error } = await supabase
        .from('matches')
        .delete()
        .eq('id', matchId);

      if (error) throw error;

      alert('Match deleted successfully!');
      loadData();
    } catch (error: any) {
      alert(`Failed to delete match: ${error.message}`);
    }
  };

  const handleCancelMatch = async (matchId: string) => {
    if (!confirm('Cancel this match?')) return;

    try {
      const { error } = await supabase
        .from('matches')
        .update({ status: 'cancelled' })
        .eq('id', matchId);

      if (error) throw error;

      alert('Match cancelled!');
      loadData();
    } catch (error: any) {
      alert(`Failed to cancel match: ${error.message}`);
    }
  };

  const handleStartMatch = async (matchId: string) => {
    if (!confirm('Start this match now?')) return;

    try {
      const { error } = await supabase
        .from('matches')
        .update({ status: 'live' })
        .eq('id', matchId);

      if (error) throw error;

      alert('Match started!');
      loadData();
    } catch (error: any) {
      alert(`Failed to start match: ${error.message}`);
    }
  };

  const filteredMatches = matches.filter(match => {
    const matchesStatus = filterStatus === 'all' || match.status === filterStatus;
    const matchesSearch = !searchTerm || 
      match.player1?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.player2?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.tournament?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.match_code?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-2">
            MATCH MANAGEMENT
          </h1>
          <p className="text-white/70">
            Monitor, control, and manage all competitive matches
          </p>
        </div>
        <Link
          href="/admin/matches/create"
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2 w-fit"
        >
          <Play className="w-5 h-5" />
          Create Match
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b border-white/10">
        <button
          onClick={() => setActiveTab('matches')}
          className={`px-6 py-3 font-bold text-sm transition-all border-b-2 {
            activeTab === 'matches'
              ? 'text-red-500 border-red-500'
              : 'text-white/50 border-transparent hover:text-white'
          }`}
        >
          All Matches ({matches.length})
        </button>
        <button
          onClick={() => setActiveTab('disputes')}
          className={`px-6 py-3 font-bold text-sm transition-all border-b-2 flex items-center gap-2 {
            activeTab === 'disputes'
              ? 'text-red-500 border-red-500'
              : 'text-white/50 border-transparent hover:text-white'
          }`}
        >
          Disputes
          {disputes.length > 0 && (
            <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
              {disputes.length}
            </span>
          )}
        </button>
      </div>

      {/* Content */}
      {activeTab === 'matches' ? (
        <>
          {/* Filters */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by player, tournament, or match code..."
                className="w-full pl-12 pr-4 py-3 bg-slate-900 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:border-red-500 focus:outline-none"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-900 border border-white/10 rounded-xl text-white focus:border-red-500 focus:outline-none appearance-none"
              >
                <option value="all">All Statuses</option>
                <option value="scheduled">Scheduled</option>
                <option value="live">Live</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="disputed">Disputed</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full"
              />
            </div>
          ) : filteredMatches.length > 0 ? (
            <div className="space-y-4">
              <AnimatePresence>
                {filteredMatches.map((match, index) => (
                  <motion.div
                    key={match.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-slate-900 border border-white/10 rounded-2xl p-6 hover:border-red-500/30 transition-all"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      {/* Match Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase {
                            match.status === 'live' ? 'bg-green-500 text-white animate-pulse' :
                            match.status === 'completed' ? 'bg-white/20 text-white' :
                            match.status === 'cancelled' ? 'bg-red-500/20 text-red-500' :
                            match.status === 'disputed' ? 'bg-yellow-500/20 text-yellow-500' :
                            'bg-blue-500/20 text-blue-500'
                          }`}>
                            {match.status}
                          </span>
                          <span className="text-white/50 text-sm font-mono">{match.match_code}</span>
                        </div>

                        <h3 className="text-xl font-bold text-white mb-2">
                          {match.tournament?.name || 'Unknown Tournament'}
                        </h3>

                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-purple-500" />
                            <span className="text-white/70">
                              <span className="text-white font-bold">{match.player1?.username || 'Player 1'}</span>
                              <span className="text-white/30 mx-2">vs</span>
                              <span className="text-white font-bold">{match.player2?.username || 'Player 2'}</span>
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 mt-2 text-sm text-white/50">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(match.scheduled_time).toLocaleString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <span>Round {match.round}</span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-2">
                        {/* Countdown Button */}
                        {match.status === 'scheduled' && (
                          <button
                            onClick={() => setShowCountdown(showCountdown === match.id ? null : match.id)}
                            className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-500 border border-purple-500/30 font-bold rounded-lg transition-all flex items-center gap-2"
                          >
                            <Clock className="w-4 h-4" />
                            Countdown
                          </button>
                        )}

                        {/* Start Match */}
                        {match.status === 'scheduled' && (
                          <button
                            onClick={() => handleStartMatch(match.id)}
                            className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-500 border border-green-500/30 font-bold rounded-lg transition-all flex items-center gap-2"
                          >
                            <Play className="w-4 h-4" />
                            Start
                          </button>
                        )}

                        {/* Edit */}
                        <Link
                          href={`/admin/matches/${match.id}/edit`}
                          className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-500 border border-blue-500/30 font-bold rounded-lg transition-all flex items-center gap-2"
                        >
                          <Edit className="w-4 h-4" />
                          Edit
                        </Link>

                        {/* View */}
                        <Link
                          href={`/dashboard/matches/${match.id}`}
                          target="_blank"
                          className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold rounded-lg transition-all flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </Link>

                        {/* Cancel */}
                        {match.status === 'scheduled' && (
                          <button
                            onClick={() => handleCancelMatch(match.id)}
                            className="px-4 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-500 border border-yellow-500/30 font-bold rounded-lg transition-all flex items-center gap-2"
                          >
                            <XCircle className="w-4 h-4" />
                            Cancel
                          </button>
                        )}

                        {/* Delete */}
                        <button
                          onClick={() => handleDeleteMatch(match.id)}
                          className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-500 border border-red-500/30 font-bold rounded-lg transition-all flex items-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    </div>

                    {/* Countdown Display */}
                    <AnimatePresence>
                      {showCountdown === match.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="mt-6 overflow-hidden"
                        >
                          <Countdown
                            targetDate={match.scheduled_time}
                            title={`${match.tournament?.name} - Round ${match.round}`}
                            variant="neon"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="text-center py-20 bg-slate-900 border border-white/10 rounded-2xl border-dashed">
              <Calendar className="w-16 h-16 text-white/10 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No Matches Found</h3>
              <p className="text-white/50 mb-6">
                {searchTerm || filterStatus !== 'all' 
                  ? 'Try adjusting your filters' 
                  : 'Create your first match to get started'}
              </p>
              <Link
                href="/admin/matches/create"
                className="inline-block px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-all"
              >
                Create Match
              </Link>
            </div>
          )}
        </>
      ) : (
        <DisputesList disputes={disputes} />
      )}
    </div>
  );
}

function DisputesList({ disputes }: { disputes: any[] }) {
  if (disputes.length === 0) {
    return (
      <div className="text-center py-20 bg-slate-900 border border-white/10 rounded-2xl border-dashed">
        <CheckCircle className="w-16 h-16 text-green-500/50 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">No Disputes Found</h3>
        <p className="text-white/50">All clear! No matches currently require attention.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {disputes.map((dispute) => (
        <div key={dispute.id} className="bg-slate-900 border border-red-500/30 rounded-2xl p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 bg-red-500 text-white rounded-full text-xs font-bold uppercase">
                  {dispute.status}
                </span>
                <span className="text-white/50 text-sm">
                  Opened {new Date(dispute.created_at).toLocaleDateString()}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-1">
                Match Dispute #{dispute.id.substring(0, 8)}
              </h3>
              <p className="text-white/50 text-sm mt-2">
                Reason: {dispute.reason}
              </p>
            </div>
            
            <Link
              href={`/admin/matches/disputes/${dispute.id}`}
              className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-all text-center"
            >
              Review Case
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
