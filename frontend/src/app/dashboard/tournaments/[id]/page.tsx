"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Trophy, Calendar, Users, DollarSign, Gamepad2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/auth";
import BracketTree from "@/components/BracketTree";
import LoadingScreen from "@/components/LoadingScreen";
import { initializeAlatPay, loadAlatPayScript } from "@/lib/alatpay";

export default function PlayerTournamentPage() {
  const params = useParams();
  const router = useRouter();
  const tournamentId = params.id as string;
  
  const [tournament, setTournament] = useState<any>(null);
  const [matches, setMatches] = useState<any[]>([]);
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const [userEmail, setUserEmail] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [isParticipant, setIsParticipant] = useState(false);
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    loadTournament();
  }, []);

  // Load AlatPay script
  useEffect(() => {
    loadAlatPayScript().catch(console.error);
  }, []);

  const loadTournament = async () => {
    try {
      const user = await getCurrentUser();
      setUserId(user?.id);
      setUserEmail(user?.email || "");

      // Get tournament
      const { data: tourney } = await supabase
        .from('tournaments')
        .select('*')
        .eq('id', tournamentId)
        .single();
      
      setTournament(tourney);

      // Check if user is participant
      if (user) {
        const { data: participation } = await supabase
          .from('tournament_participants')
          .select('id')
          .eq('tournament_id', tournamentId)
          .eq('user_id', user.id)
          .single();
        
        setIsParticipant(!!participation);
      }

      // Get matches
      const { data: matchesData } = await supabase
        .from('matches')
        .select('*')
        .eq('tournament_id', tournamentId)
        .order('round', { ascending: true })
        .order('match_number', { ascending: true });

      if (matchesData && matchesData.length > 0) {
        // Get all unique player IDs
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
    } catch (error) {
      console.error('Error loading tournament:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async (reference: any) => {
    setJoining(true);
    try {
      // Join tournament
      const { error } = await supabase
        .from('tournament_participants')
        .insert({
          tournament_id: tournamentId,
          user_id: userId,
          status: 'registered',
          payment_reference: reference.reference || reference.transactionId || reference.id
        });

      if (error) throw error;

      // Update tournament participant count
      await supabase.rpc('increment_tournament_participants', {
        tournament_id: tournamentId
      });

      alert('Successfully joined the tournament!');
      loadTournament();
    } catch (error: any) {
      console.error('Error joining tournament:', error);
      alert(`Failed to join tournament: ${error.message}`);
    } finally {
      setJoining(false);
    }
  };

  const handlePaymentClose = () => {
    setJoining(false);
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (!tournament) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-white text-xl">Tournament not found</p>
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
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Tournament Header */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-white/10 rounded-2xl p-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-red-500 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/20">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-black text-white mb-1">{tournament.name}</h1>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      tournament.status === 'upcoming' ? 'bg-blue-500/20 text-blue-500' :
                      tournament.status === 'ongoing' ? 'bg-green-500/20 text-green-500' :
                      'bg-gray-500/20 text-gray-500'
                    }`}>
                      {tournament.status.toUpperCase()}
                    </span>
                    <span className="text-white/50 text-sm">{tournament.game}</span>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-white/70 mb-6">{tournament.description}</p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-black/20 rounded-xl p-4 text-center">
                <DollarSign className="w-6 h-6 text-green-500 mx-auto mb-2" />
                <div className="text-2xl font-black text-white">₦{tournament.prize_pool}</div>
                <div className="text-xs text-white/50">Prize Pool</div>
              </div>
              <div className="bg-black/20 rounded-xl p-4 text-center">
                <Users className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                <div className="text-2xl font-black text-white">{tournament.current_participants}/{tournament.max_participants}</div>
                <div className="text-xs text-white/50">Participants</div>
              </div>
              <div className="bg-black/20 rounded-xl p-4 text-center">
                <Calendar className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                <div className="text-2xl font-black text-white">{new Date(tournament.start_date).toLocaleDateString()}</div>
                <div className="text-xs text-white/50">Start Date</div>
              </div>
              <div className="bg-black/20 rounded-xl p-4 text-center">
                <Gamepad2 className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                <div className="text-2xl font-black text-white">{tournament.mode}</div>
                <div className="text-xs text-white/50">Mode</div>
              </div>
            </div>
          </div>

          {/* Bracket */}
          {matches.length > 0 && (
            <div className="bg-slate-900 border border-white/10 rounded-2xl p-8">
              <h2 className="text-2xl font-black text-white mb-6">Tournament Bracket</h2>
              <BracketTree matches={matches} />
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Tournament Info */}
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-black text-white mb-4">Details</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-white/50">Entry Fee</span>
                <span className="text-white font-bold">₦{tournament.entry_fee}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Format</span>
                <span className="text-white font-bold">{tournament.format}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Region</span>
                <span className="text-white font-bold">{tournament.region}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Platform</span>
                <span className="text-white font-bold">{tournament.platform}</span>
              </div>
            </div>
          </div>

          {isParticipant && (
            <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-6 text-center">
              <Trophy className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white mb-2">You're Registered!</h3>
              <p className="text-white/70 text-sm">Good luck in the tournament!</p>
            </div>
          )}
        </div>

        {/* Join Tournament CTA */}
        {!isParticipant && tournament.status === 'upcoming' && tournament.current_participants < tournament.max_participants && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 p-6 bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 rounded-2xl text-center"
          >
            <h3 className="text-xl font-bold text-white mb-2">Want to compete?</h3>
            <p className="text-white/70 mb-4">Join this tournament and compete for the prize pool!</p>
            
            {userId && userEmail ? (
              <button
                onClick={() => {
                  setJoining(true);
                  
                  initializeAlatPay({
                    amount: tournament.entry_fee,
                    email: userEmail,
                    firstName: userEmail.split('@')[0],
                    lastName: '',
                    phone: '',
                    metadata: {
                      tournamentId: tournamentId,
                      userId: userId,
                      tournamentName: tournament.name
                    },
                    onSuccess: async (response) => {
                      console.log('🎉 AlatPay Payment Successful:', response);
                      await handlePaymentSuccess(response);
                    },
                    onClose: () => {
                      console.log('Payment popup closed');
                      setJoining(false);
                    },
                    onError: (error) => {
                      console.error('Payment error:', error);
                      alert('Payment failed. Please try again.');
                      setJoining(false);
                    }
                  });
                }}
                className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={joining}
              >
                {joining ? "Processing..." : `Pay ₦${tournament.entry_fee} to Join`}
              </button>
            ) : (
              <button
                onClick={() => router.push('/signin')}
                className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-all"
              >
                Sign in to Join
              </button>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
