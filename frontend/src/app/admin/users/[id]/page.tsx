"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Mail, 
  Shield, 
  Ban, 
  CheckCircle, 
  DollarSign, 
  Trophy, 
  History, 
  Gamepad2
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AdminUserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [tournaments, setTournaments] = useState<any[]>([]);

  useEffect(() => {
    loadUserDetails();
  }, []);

  const loadUserDetails = async () => {
    try {
      setLoading(true);
      
      // Get profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      setUser(profile);

      // Get transactions
      const { data: txns } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10);
      
      setTransactions(txns || []);

      // Get tournaments participation
      const { data: tourneys } = await supabase
        .from('tournament_participants')
        .select(`
          *,
          tournament:tournaments(*)
        `)
        .eq('user_id', userId)
        .order('joined_at', { ascending: false });
      
      setTournaments(tourneys || []);

    } catch (error) {
      console.error('Error loading user details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBanToggle = async () => {
    if (!confirm(`Are you sure you want to {user.is_banned ? 'unban' : 'ban'} this user?`)) return;

    try {
      const { error } = await supabase.rpc('admin_toggle_user_ban', {
        p_user_id: userId,
        p_ban: !user.is_banned
      });

      if (error) throw error;

      // Refresh data
      loadUserDetails();
    } catch (error) {
      console.error('Error toggling ban:', error);
      alert('Failed to update ban status');
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

  if (!user) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-white mb-4">User Not Found</h2>
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
        <span className="font-bold">Back to Users</span>
      </button>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left Column - Profile Card */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center text-white text-3xl font-black mb-4 shadow-lg shadow-red-500/20">
                {user.username ? user.username.charAt(0).toUpperCase() : <Mail />}
              </div>
              <h1 className="text-2xl font-black text-white mb-1">
                {user.username || 'No Username'}
              </h1>
              <div className="text-white/50 text-sm mb-4">{user.email}</div>
              
              <div className="flex gap-2">
                {user.is_admin ? (
                  <span className="px-3 py-1 bg-red-500/10 text-red-500 rounded-full text-xs font-bold border border-red-500/20 flex items-center gap-1">
                    <Shield className="w-3 h-3" /> Admin
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-blue-500/10 text-blue-500 rounded-full text-xs font-bold border border-blue-500/20 flex items-center gap-1">
                    <Gamepad2 className="w-3 h-3" /> {user.role || 'Player'}
                  </span>
                )}
                
                {user.is_banned ? (
                  <span className="px-3 py-1 bg-slate-700 text-white/70 rounded-full text-xs font-bold flex items-center gap-1">
                    <Ban className="w-3 h-3" /> Banned
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-xs font-bold border border-green-500/20 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Active
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-4 py-6 border-t border-white/10">
              <div className="flex justify-between items-center text-sm">
                <span className="text-white/50">Joined</span>
                <span className="text-white font-bold">{new Date(user.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-white/50">Last Login</span>
                <span className="text-white font-bold">
                  {user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-white/50">User ID</span>
                <span className="text-white font-mono text-xs">{user.id.substring(0, 8)}...</span>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10">
              <button
                onClick={handleBanToggle}
                className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all {
                  user.is_banned
                    ? "bg-green-500 hover:bg-green-600 text-white"
                    : "bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30"
                }`}
              >
                {user.is_banned ? (
                  <>
                    <CheckCircle className="w-5 h-5" /> Unban User
                  </>
                ) : (
                  <>
                    <Ban className="w-5 h-5" /> Ban User
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-500" />
              Wallet Summary
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-black/40 rounded-xl p-4">
                <div className="text-xs text-white/50 mb-1">Available</div>
                <div className="text-xl font-black text-white">{user.available_balance || 0}</div>
              </div>
              <div className="bg-black/40 rounded-xl p-4">
                <div className="text-xs text-white/50 mb-1">Total Earned</div>
                <div className="text-xl font-black text-green-500">{user.total_earnings || 0}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Activity */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Tournament History */}
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <Trophy className="w-6 h-6 text-yellow-500" />
                Tournament History
              </h3>
              <span className="bg-white/10 px-2 py-1 rounded text-xs text-white/70 font-bold">
                {tournaments.length} Joined
              </span>
            </div>

            {tournaments.length > 0 ? (
              <div className="space-y-3">
                {tournaments.map((t) => (
                  <div key={t.id} className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-white/5">
                    <div>
                      <div className="font-bold text-white mb-1">{t.tournament?.name}</div>
                      <div className="text-xs text-white/50 flex items-center gap-2">
                        <span>{new Date(t.joined_at).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>{t.status}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-white">Rank #{t.rank || '-'}</div>
                      {t.prize_won > 0 && (
                        <div className="text-xs font-bold text-green-500">+{t.prize_won}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-white/30 border-2 border-dashed border-white/10 rounded-xl">
                No tournaments joined yet
              </div>
            )}
          </div>

          {/* Recent Transactions */}
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <History className="w-6 h-6 text-blue-500" />
                Recent Transactions
              </h3>
            </div>

            {transactions.length > 0 ? (
              <div className="space-y-3">
                {transactions.map((txn) => (
                  <div key={txn.id} className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-white/5">
                    <div>
                      <div className="font-bold text-white mb-1">{txn.description}</div>
                      <div className="text-xs text-white/50 flex items-center gap-2">
                        <span>{new Date(txn.created_at).toLocaleString()}</span>
                        <span className={`px-1.5 rounded text-[10px] uppercase font-bold {
                          txn.status === 'completed' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'
                        }`}>
                          {txn.status}
                        </span>
                      </div>
                    </div>
                    <div className={`font-black text-lg {txn.amount > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {txn.amount > 0 ? '+' : ''}{txn.amount}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-white/30 border-2 border-dashed border-white/10 rounded-xl">
                No transactions found
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
