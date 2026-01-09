"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Trophy, 
  Calendar, 
  Users, 
  DollarSign, 
  Gamepad2, 
  Edit, 
  Trash2, 
  Play, 
  CheckCircle,
  Clock,
  Settings,
  Brackets
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import BracketTree from "@/components/BracketTree";
import AdminBracketEditor from "@/components/AdminBracketEditor";
import TournamentStats from "@/components/TournamentStats";

export default function AdminTournamentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const tournamentId = params.id as string;

  const [tournament, setTournament] = useState<any>(null);
  const [participants, setParticipants] = useState<any[]>([]);
  const [matches, setMatches] = useState<any[]>([]);
  const [spectators, setSpectators] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingBracket, setEditingBracket] = useState(false);

  useEffect(() => {
    loadTournamentDetails();
  }, []);

  const loadTournamentDetails = async () => {
    try {
      setLoading(true);
      
      // Get tournament
      const { data: tourney } = await supabase
        .from('tournaments')
        .select('*')
        .eq('id', tournamentId)
        .single();
      
      setTournament(tourney);

      // Get participants with user details
      const { data: parts, error: partsError } = await supabase
        .from('tournament_participants')
        .select(`
          *,
          user:user_id(id, username, email)
        `)
        .eq('tournament_id', tournamentId);
      
      if (partsError) {
        console.error('Participants query error:', partsError);
        // Fallback: get participants and fetch usernames separately
        const { data: simpleParts } = await supabase
          .from('tournament_participants')
          .select('*')
          .eq('tournament_id', tournamentId);
        
        if (simpleParts && simpleParts.length > 0) {
          // Fetch usernames for each participant
          const participantsWithUsers = await Promise.all(
            simpleParts.map(async (p) => {
              const { data: userData } = await supabase
                .from('profiles')
                .select('id, username, email')
                .eq('id', p.user_id)
                .single();
              
              return {
                ...p,
                user: userData || { id: p.user_id, username: null, email: null }
              };
            })
          );
          setParticipants(participantsWithUsers);
        } else {
          setParticipants([]);
        }
      } else {
        setParticipants(parts || []);
      }

      // Get matches (without joins - we'll fetch profiles separately)
      const { data: matchesData, error: matchesError } = await supabase
        .from('matches')
        .select('*')
        .eq('tournament_id', tournamentId)
        .order('round', { ascending: true })
        .order('match_number', { ascending: true });
      
      if (matchesError) {
        console.error('Matches query error:', matchesError);
        setMatches([]);
      } else if (matchesData && matchesData.length > 0) {
        // Fetch player profiles for all matches
        const playerIds = new Set<string>();
        matchesData.forEach(match => {
          if (match.player1_id) playerIds.add(match.player1_id);
          if (match.player2_id) playerIds.add(match.player2_id);
          if (match.spectator_id) playerIds.add(match.spectator_id);
        });

        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, username, email')
          .in('id', Array.from(playerIds));

        const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);

        // Merge profile data with matches
        const matchesWithProfiles = matchesData.map(match => ({
          ...match,
          player1: match.player1_id ? profileMap.get(match.player1_id) : null,
          player2: match.player2_id ? profileMap.get(match.player2_id) : null,
          spectator: match.spectator_id ? profileMap.get(match.spectator_id) : null,
        }));

        setMatches(matchesWithProfiles);
      } else {
        setMatches([]);
      }

      // Get active spectators
      const { data: spectatorsData, error: specError } = await supabase
        .from('spectators')
        .select('*')
        .eq('status', 'active');
      
      if (spectatorsData && spectatorsData.length > 0) {
        const spectatorUserIds = spectatorsData.map(s => s.user_id).filter(Boolean);
        const { data: spectatorProfiles } = await supabase
          .from('profiles')
          .select('id, username, email')
          .in('id', spectatorUserIds);
        
        const spectatorProfileMap = new Map(spectatorProfiles?.map(p => [p.id, p]) || []);
        const spectatorsWithProfiles = spectatorsData.map(s => ({
          ...s,
          user: s.user_id ? spectatorProfileMap.get(s.user_id) : null
        }));
        
        setSpectators(spectatorsWithProfiles);
      } else {
        setSpectators([]);
      }

    } catch (error) {
      console.error('Error loading tournament details:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus: string) => {
    if (!confirm(`Change status to {newStatus}?`)) return;

    try {
      const { error } = await supabase
        .from('tournaments')
        .update({ status: newStatus })
        .eq('id', tournamentId);

      if (error) throw error;
      loadTournamentDetails();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  const deleteTournament = async () => {
    if (!confirm("Are you sure? This will delete all matches and participant data!")) return;
    
    try {
      const { error } = await supabase
        .from('tournaments')
        .delete()
        .eq('id', tournamentId);

      if (error) throw error;
      router.push('/admin/tournaments');
    } catch (error) {
      console.error('Error deleting tournament:', error);
      alert('Failed to delete tournament');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-white mb-4">Tournament Not Found</h2>
        <button 
          onClick={() => router.back()}
          className="text-red-500 hover:text-red-400 font-bold"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 text-white/50 hover:text-white mb-8 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-bold">Back to Tournaments</span>
      </button>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Main Info Column */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Tournament Overview */}
          <div className="bg-slate-900 border border-white/10 rounded-2xl overflow-hidden">
            <div className="h-48 bg-gradient-to-r from-slate-800 to-slate-900 relative">
               <div className="absolute inset-0 flex items-center justify-center">
                  <Trophy className="w-24 h-24 text-white/5" />
               </div>
               <div className="absolute bottom-6 left-6">
                 <div className="text-sm font-bold text-red-500 uppercase tracking-wider mb-2">
                   {tournament.game} • {tournament.platform}
                 </div>
                 <h1 className="text-3xl font-black text-white">{tournament.name}</h1>
               </div>
               <div className="absolute top-6 right-6">
                 <span className={`px-4 py-2 rounded-full font-bold text-sm uppercase {
                   tournament.status === 'upcoming' ? 'bg-blue-500 text-white' :
                   tournament.status === 'ongoing' ? 'bg-green-500 text-white' :
                   'bg-white/10 text-white'
                 }`}>
                   {tournament.status}
                 </span>
               </div>
            </div>

            <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-6 border-b border-white/10">
              <div>
                <div className="text-white/50 text-xs uppercase font-bold mb-1">Prize Pool</div>
                <div className="text-xl font-black text-green-500">{tournament.prize_pool}</div>
              </div>
              <div>
                <div className="text-white/50 text-xs uppercase font-bold mb-1">Entry Fee</div>
                <div className="text-xl font-black text-white">{tournament.entry_fee}</div>
              </div>
              <div>
                <div className="text-white/50 text-xs uppercase font-bold mb-1">Participants</div>
                <div className="text-xl font-black text-white">
                  {tournament.current_participants}/{tournament.max_participants}
                </div>
              </div>
              <div>
                <div className="text-white/50 text-xs uppercase font-bold mb-1">Format</div>
                <div className="text-xl font-black text-white capitalize">
                  {tournament.format?.replace('_', ' ')}
                </div>
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-lg font-bold text-white mb-2">Description</h3>
              <p className="text-white/70">{tournament.description || 'No description provided.'}</p>
            </div>
          </div>

          {/* Tournament Statistics */}
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-black text-white mb-6 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              Tournament Analytics
            </h3>
            <TournamentStats 
              tournament={tournament}
              participants={participants}
              matches={matches}
            />
          </div>

          {/* Participants List */}
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-500" />
                Participants ({participants.length})
              </h3>
            </div>

            <div className="space-y-2">
              {participants.length > 0 ? (
                participants.map((p) => {
                  // Handle both user object and direct user_id
                  const user = p.user;
                  const username = user?.username || user?.email?.split('@')[0] || 'User';
                  const displayName = user?.username || user?.email || p.user_id;
                  const joinedDate = p.joined_at || p.created_at;
                  
                  return (
                    <div key={p.id} className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-white/5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center text-xs font-bold text-white">
                          {username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-white">{displayName}</div>
                          {user?.email && user?.username && (
                            <div className="text-xs text-white/50">{user.email}</div>
                          )}
                        </div>
                      </div>
                      <div className="text-sm text-white/50">
                        {joinedDate ? new Date(joinedDate).toLocaleDateString() : 'Recently'}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-white/30 border-2 border-dashed border-white/10 rounded-xl">
                  No participants yet
                </div>
              )}
            </div>
          </div>

          {/* Bracket & Match Schedule */}
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <Brackets className="w-5 h-5 text-purple-500" />
                Bracket & Match Schedule
              </h3>
              
              {!editingBracket && (
                <button
                  onClick={() => setEditingBracket(true)}
                  className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-xl transition-all flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit Pairings
                </button>
              )}
            </div>

            {editingBracket ? (
              <AdminBracketEditor
                tournamentId={tournamentId}
                participants={participants}
                existingMatches={matches}
                spectators={spectators}
                onSave={() => {
                  setEditingBracket(false);
                  loadTournamentDetails();
                }}
                onCancel={() => setEditingBracket(false)}
              />
            ) : (
              <BracketTree
                matches={matches}
                isAdmin={true}
                onMatchClick={(match) => {
                  router.push(`/admin/matches/{match.id}`);
                }}
              />
            )}
          </div>

        </div>

        {/* Sidebar Actions */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-black text-white mb-6">Actions</h3>
            
            <div className="space-y-3">
              <Link
                href={`/admin/matches/create?tournament={tournamentId}`}
                className="w-full py-3 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all"
              >
                <Gamepad2 className="w-5 h-5" /> Create Match
              </Link>

              <Link
                href={`/admin/tournaments/${tournamentId}/participants`}
                className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all"
              >
                <Users className="w-5 h-5" /> Manage Participants
              </Link>

              <Link
                href={`/admin/tournaments/${tournamentId}/room`}
                className="w-full py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all"
              >
                <Settings className="w-5 h-5" /> Room Setup
              </Link>

              {tournament.status === 'ongoing' && (
                <Link
                  href={`/admin/tournaments/${tournamentId}/live`}
                  className="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all animate-pulse"
                >
                  <Play className="w-5 h-5" /> Live Management
                </Link>
              )}

              {tournament.status === 'upcoming' && (
                <button
                  onClick={() => updateStatus('ongoing')}
                  className="w-full py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all"
                >
                  <Play className="w-5 h-5" /> Start Tournament
                </button>
              )}
              
              {tournament.status === 'ongoing' && (
                <button
                  onClick={() => updateStatus('completed')}
                  className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all"
                >
                  <CheckCircle className="w-5 h-5" /> End Tournament
                </button>
              )}

              <Link
                href={`/admin/tournaments/{tournamentId}/edit`}
                className="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all"
              >
                <Edit className="w-5 h-5" /> Edit Details
              </Link>

              <button
                onClick={deleteTournament}
                className="w-full py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 font-bold rounded-xl flex items-center justify-center gap-2 transition-all"
              >
                <Trash2 className="w-5 h-5" /> Delete Tournament
              </button>
            </div>
          </div>

          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-black text-white mb-4">Schedule</h3>
            <div className="space-y-4 text-sm">
              <div>
                <div className="text-white/50 mb-1">Starts</div>
                <div className="flex items-center gap-2 text-white font-bold">
                  <Calendar className="w-4 h-4 text-red-500" />
                  {new Date(tournament.start_date).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-2 text-white font-bold pl-6">
                  <Clock className="w-4 h-4 text-red-500" />
                  {new Date(tournament.start_date).toLocaleTimeString()}
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
