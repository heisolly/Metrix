"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Trophy, Calendar, Users, DollarSign, Gamepad2, Key, Lock, Map as MapIcon, Copy, Check, Eye, EyeOff, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/auth";
import BracketTree from "@/components/BracketTree";
import LoadingScreen from "@/components/LoadingScreen";
import UseALATPay from "react-alatpay";
import { ALATPAY_PUBLIC_KEY, ALATPAY_BUSINESS_ID } from "@/lib/alatpay";

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
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    loadTournament();
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

        const profileMap = new Map<string, any>(
          profiles?.map(p => [p.id, p] as [string, any]) || []
        );

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

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
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
                <div className="text-2xl font-black text-white">{tournament.max_participants}</div>
                <div className="text-xs text-white/50">Max Players</div>
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

          {/* Room Details - Only show for participants when tournament is ongoing */}
          {isParticipant && tournament.status === 'ongoing' && tournament.room_code && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-red-500/10 via-orange-500/10 to-yellow-500/10 border-2 border-red-500/30 rounded-2xl p-6 md:p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center animate-pulse">
                  <Key className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white">ROOM DETAILS</h2>
                  <p className="text-white/70 text-sm">Join the game with these credentials</p>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mb-6">
                {/* Room Code */}
                <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Key className="w-4 h-4 text-blue-400" />
                    <span className="text-sm font-bold text-white/70">Room Code</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black text-white font-mono tracking-wider">
                      {tournament.room_code}
                    </span>
                    <button
                      onClick={() => copyToClipboard(tournament.room_code, 'code')}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      {copied === 'code' ? (
                        <Check className="w-5 h-5 text-green-500" />
                      ) : (
                        <Copy className="w-5 h-5 text-white/50 hover:text-white" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Room Password */}
                <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Lock className="w-4 h-4 text-purple-400" />
                    <span className="text-sm font-bold text-white/70">Password</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black text-white font-mono tracking-wider">
                      {showPassword ? tournament.room_password : '••••••'}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowPassword(!showPassword)}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5 text-white/50 hover:text-white" />
                        ) : (
                          <Eye className="w-5 h-5 text-white/50 hover:text-white" />
                        )}
                      </button>
                      <button
                        onClick={() => copyToClipboard(tournament.room_password, 'password')}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                      >
                        {copied === 'password' ? (
                          <Check className="w-5 h-5 text-green-500" />
                        ) : (
                          <Copy className="w-5 h-5 text-white/50 hover:text-white" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Map Name */}
                <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <MapIcon className="w-4 h-4 text-green-400" />
                    <span className="text-sm font-bold text-white/70">Map</span>
                  </div>
                  <div className="text-2xl font-black text-white">
                    {tournament.map_name || 'TBD'}
                  </div>
                </div>
              </div>

              {/* Attention Notes */}
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-black text-yellow-500 mb-2">⚠️ IMPORTANT NOTES</h3>
                    <ul className="text-sm text-white/90 space-y-1">
                      <li>• Join the game room using the code and password above</li>
                      <li>• Make sure you're using the correct game mode: <span className="font-bold text-white">{tournament.mode}</span></li>
                      <li>• Round {tournament.current_round} of {tournament.total_rounds} is currently in progress</li>
                      <li>• Report any issues to tournament admins immediately</li>
                      <li>• Follow all tournament rules and fair play guidelines</li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Waiting Message for Non-Participants */}
          {!isParticipant && tournament.status === 'ongoing' && (
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-6 text-center">
              <AlertCircle className="w-12 h-12 text-blue-400 mx-auto mb-3" />
              <h3 className="text-xl font-black text-white mb-2">Tournament In Progress</h3>
              <p className="text-white/70">
                This tournament has already started. Room details are only visible to registered participants.
              </p>
            </div>
          )}

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
                  try {
                    setJoining(true);
                    
                    const config = UseALATPay({
                      amount: tournament.entry_fee,
                      apiKey: ALATPAY_PUBLIC_KEY,
                      businessId: ALATPAY_BUSINESS_ID,
                      currency: "NGN",
                      email: userEmail,
                      firstName: userEmail.split('@')[0],
                      lastName: '',
                      color: "#ef4444",
                      metadata: JSON.stringify({
                        tournamentId: tournamentId,
                        userId: userId,
                        tournamentName: tournament.name
                      }),
                      phone: '',
                      onClose: () => {
                        console.log("AlatPay popup closed");
                        setJoining(false);
                      },
                      onTransaction: (response: any) => {
                        console.log("🎉 AlatPay Transaction Response:", response);
                        if (response.status === 'success' || response.status === 'successful') {
                          handlePaymentSuccess(response);
                        } else {
                          console.error("Payment failed:", response);
                          alert("Payment was not successful. Please try again.");
                          setJoining(false);
                        }
                      },
                    });
                    
                    config.submit();
                  } catch (error) {
                    console.error("Error initializing payment:", error);
                    alert("Failed to open payment window. Please refresh and try again.");
                    setJoining(false);
                  }
                }}
                className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={joining}
              >
                {joining ? "Processing..." : `Pay ₦${tournament.entry_fee.toLocaleString()} to Join`}
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
