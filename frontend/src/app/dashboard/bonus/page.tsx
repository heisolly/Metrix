"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Gift, 
  Users, 
  DollarSign, 
  Copy, 
  Check,
  TrendingUp,
  Clock,
  Share2,
  ExternalLink
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function BonusPage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [referrals, setReferrals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }
      setUser(user);

      // Get profile with referral info
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      setProfile(profileData);

      // Get referrals
      const { data: referralsData } = await supabase
        .from('referrals')
        .select(`
          *,
          referred:profiles!referrals_referred_id_fkey(username, email)
        `)
        .eq('referrer_id', user.id)
        .order('created_at', { ascending: false });

      setReferrals(referralsData || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyReferralLink = () => {
    const link = `${window.location.origin}/signup?ref=${profile?.referral_code}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareReferralLink = async () => {
    const link = `${window.location.origin}/signup?ref=${profile?.referral_code}`;
    const text = `Join Metrix and compete in esports tournaments! Use my referral code: ${profile?.referral_code}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join Metrix',
          text: text,
          url: link
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      copyReferralLink();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'qualified': return 'bg-green-500/20 text-green-500 border-green-500/30';
      case 'paid': return 'bg-blue-500/20 text-blue-500 border-blue-500/30';
      default: return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'qualified': return 'Qualified - Pending Payment';
      case 'paid': return 'Paid';
      default: return 'Pending - Awaiting Payment';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Please Login</h2>
          <a href="/signin" className="text-red-500 hover:text-red-400">
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  const referralLink = `${typeof window !== 'undefined' ? window.location.origin : ''}/signup?ref=${profile?.referral_code}`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-black py-4 md:py-8">
      <div className="max-w-7xl mx-auto px-3 md:px-4">
        {/* Header */}
        <div className="mb-4 md:mb-8">
          <h1 className="text-2xl md:text-5xl font-black text-white mb-2 flex items-center gap-2 md:gap-3">
            <Gift className="w-6 h-6 md:w-10 md:h-10 text-yellow-500" />
            Referral Bonus
          </h1>
          <p className="text-white/70 text-sm md:text-lg">
            Invite friends and earn ₦500 for each paying user!
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-4 md:mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-xl md:rounded-2xl p-3 md:p-6"
          >
            <div className="flex items-center gap-2 md:gap-3 mb-1 md:mb-2">
              <DollarSign className="w-4 h-4 md:w-8 md:h-8 text-yellow-500" />
              <div className="text-xs md:text-sm text-white/70">Total Earnings</div>
            </div>
            <div className="text-lg md:text-3xl font-black text-white">
              ₦{(profile?.total_earnings || 0).toLocaleString()}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl md:rounded-2xl p-3 md:p-6"
          >
            <div className="flex items-center gap-2 md:gap-3 mb-1 md:mb-2">
              <Clock className="w-4 h-4 md:w-8 md:h-8 text-green-500" />
              <div className="text-xs md:text-sm text-white/70">Pending</div>
            </div>
            <div className="text-lg md:text-3xl font-black text-white">
              ₦{(profile?.pending_earnings || 0).toLocaleString()}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-xl md:rounded-2xl p-3 md:p-6"
          >
            <div className="flex items-center gap-2 md:gap-3 mb-1 md:mb-2">
              <Users className="w-4 h-4 md:w-8 md:h-8 text-blue-500" />
              <div className="text-xs md:text-sm text-white/70">Total Referrals</div>
            </div>
            <div className="text-lg md:text-3xl font-black text-white">
              {profile?.total_referrals || 0}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl md:rounded-2xl p-3 md:p-6"
          >
            <div className="flex items-center gap-2 md:gap-3 mb-1 md:mb-2">
              <TrendingUp className="w-4 h-4 md:w-8 md:h-8 text-purple-500" />
              <div className="text-xs md:text-sm text-white/70">Qualified</div>
            </div>
            <div className="text-lg md:text-3xl font-black text-white">
              {referrals.filter(r => r.status === 'qualified' || r.status === 'paid').length}
            </div>
          </motion.div>
        </div>

        {/* Referral Link Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-red-500/10 to-orange-500/10 border-2 border-red-500/30 rounded-xl md:rounded-2xl p-4 md:p-8 mb-4 md:mb-8"
        >
          <h2 className="text-xl md:text-2xl font-black text-white mb-2 md:mb-4">Your Referral Link</h2>
          <p className="text-white/70 mb-4 md:mb-6 text-sm md:text-base">
            Share this link with friends. When they sign up and make their first tournament payment, you'll earn ₦500!
          </p>

          <div className="flex flex-col md:flex-row gap-3 md:gap-4">
            <div className="flex-1 bg-black/50 border border-white/10 rounded-lg md:rounded-xl p-3 md:p-4 flex items-center justify-between">
              <div className="flex-1 overflow-hidden">
                <div className="text-xs text-white/50 mb-1">Your Referral Code</div>
                <div className="text-xl md:text-2xl font-black text-white font-mono truncate">
                  {profile?.referral_code}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={copyReferralLink}
                className="flex-1 md:flex-none px-4 py-3 md:px-6 md:py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg md:rounded-xl transition-all flex items-center justify-center gap-2 text-sm md:text-base"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 md:w-5 md:h-5" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 md:w-5 md:h-5" />
                    Copy
                  </>
                )}
              </button>

              <button
                onClick={shareReferralLink}
                className="flex-1 md:flex-none px-4 py-3 md:px-6 md:py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg md:rounded-xl transition-all flex items-center justify-center gap-2 text-sm md:text-base"
              >
                <Share2 className="w-4 h-4 md:w-5 md:h-5" />
                Share
              </button>
            </div>
          </div>

          <div className="mt-4 p-3 md:p-4 bg-white/5 rounded-lg">
            <div className="text-xs md:text-sm text-white/70 mb-1 md:mb-2">Full Link:</div>
            <div className="text-white font-mono text-xs md:text-sm break-all">{referralLink}</div>
          </div>
        </motion.div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-slate-900 border border-white/10 rounded-xl md:rounded-2xl p-4 md:p-8 mb-4 md:mb-8"
        >
          <h2 className="text-xl md:text-2xl font-black text-white mb-4 md:mb-6">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <div className="text-center p-3 rounded-xl bg-white/5 md:bg-transparent">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4 text-white text-xl md:text-2xl font-black">
                1
              </div>
              <h3 className="text-base md:text-lg font-bold text-white mb-1 md:mb-2">Share Your Link</h3>
              <p className="text-white/70 text-xs md:text-sm">
                Send your unique referral link to friends via social media, email, or messaging apps
              </p>
            </div>

            <div className="text-center p-3 rounded-xl bg-white/5 md:bg-transparent">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4 text-white text-xl md:text-2xl font-black">
                2
              </div>
              <h3 className="text-base md:text-lg font-bold text-white mb-1 md:mb-2">They Sign Up & Pay</h3>
              <p className="text-white/70 text-xs md:text-sm">
                Your friend creates an account and makes their first tournament payment
              </p>
            </div>

            <div className="text-center p-3 rounded-xl bg-white/5 md:bg-transparent">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4 text-white text-xl md:text-2xl font-black">
                3
              </div>
              <h3 className="text-base md:text-lg font-bold text-white mb-1 md:mb-2">You Earn ₦500</h3>
              <p className="text-white/70 text-xs md:text-sm">
                Receive ₦500 bonus once their payment is confirmed. Withdraw anytime!
              </p>
            </div>
          </div>
        </motion.div>

        {/* Referrals List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-slate-900 border border-white/10 rounded-xl md:rounded-2xl p-4 md:p-8"
        >
          <h2 className="text-xl md:text-2xl font-black text-white mb-4 md:mb-6">Your Referrals</h2>

          {referrals.length === 0 ? (
            <div className="text-center py-8 md:py-12">
              <Users className="w-12 h-12 md:w-16 md:h-16 text-white/20 mx-auto mb-3 md:mb-4" />
              <h3 className="text-lg md:text-xl font-bold text-white mb-1 md:mb-2">No referrals yet</h3>
              <p className="text-white/50 text-sm md:text-base">Start sharing your link to earn bonuses!</p>
            </div>
          ) : (
            <div className="space-y-3 md:space-y-4">
              {referrals.map((referral, index) => (
                <motion.div
                  key={referral.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-black/30 border border-white/10 rounded-lg md:rounded-xl p-3 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 md:gap-0"
                >
                  <div className="flex items-center gap-3 md:gap-4 w-full md:w-auto">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center text-white font-black flex-shrink-0">
                      {referral.referred?.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                      <div className="text-white font-bold text-sm md:text-base">{referral.referred?.username || 'User'}</div>
                      <div className="text-white/50 text-xs md:text-sm break-all">{referral.referred?.email}</div>
                      <div className="text-white/40 text-xs mt-0.5 md:mt-1">
                        Joined {new Date(referral.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto mt-2 md:mt-0 border-t md:border-t-0 border-white/10 pt-2 md:pt-0">
                    <div className={`px-2 py-1 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-bold border mb-0 md:mb-2 ${getStatusColor(referral.status)}`}>
                      {getStatusText(referral.status)}
                    </div>
                    <div className="text-lg md:text-2xl font-black text-yellow-500">
                      ₦{referral.bonus_amount.toLocaleString()}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
