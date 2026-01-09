"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Trophy,
  Zap,
  Target,
  TrendingUp,
  Users,
  Gamepad2,
  Wallet,
  Star,
  Clock,
  ChevronRight,
  Award,
  Crown,
  Flame,
  BarChart3,
  Calendar,
  Settings,
  LogOut,
  Bell,
  Search
} from "lucide-react";
import { getCurrentUser, signOut } from "@/lib/auth";
import { useRouter } from "next/navigation";
import FeaturedCountdowns from "@/components/FeaturedCountdowns";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      router.push("/signin");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black light:bg-[#f5f5f5] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  const stats = [
    { icon: Trophy, label: "Tournaments Won", value: "12", change: "+3", color: "from-yellow-500 to-orange-500" },
    { icon: Zap, label: "Total Earnings", value: "2,450", change: "+450", color: "from-green-500 to-emerald-500" },
    { icon: Target, label: "Win Rate", value: "68%", change: "+5%", color: "from-blue-500 to-cyan-500" },
    { icon: TrendingUp, label: "Rank", value: "#247", change: "+12", color: "from-purple-500 to-pink-500" },
  ];

  const recentMatches = [
    { game: "PUBG Mobile", result: "Victory", kills: 15, rank: 1, prize: "150", time: "2 hours ago" },
    { game: "Call of Duty", result: "Victory", kills: 22, rank: 1, prize: "200", time: "5 hours ago" },
    { game: "PUBG Mobile", result: "Defeat", kills: 8, rank: 4, prize: "0", time: "1 day ago" },
    { game: "Free Fire", result: "Victory", kills: 18, rank: 1, prize: "100", time: "2 days ago" },
  ];

  const upcomingTournaments = [
    { name: "PUBG Championship", prize: "5,000", players: "128/128", starts: "2 hours", entry: "25" },
    { name: "COD Warzone Battle", prize: "3,500", players: "64/100", starts: "4 hours", entry: "20" },
    { name: "Free Fire Masters", prize: "2,000", players: "45/64", starts: "Tomorrow", entry: "15" },
  ];

  return (
    <div className="min-h-screen bg-black light:bg-[#f5f5f5]">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-slate-950 to-black light:from-[#f5f5f5] light:via-white light:to-[#e8e8e8]" />
        
        {/* Floating particles */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-red-500 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Top Navigation */}
      <div className="relative z-10 border-b border-white/10 light:border-black/10 bg-black/40 light:bg-white/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div className="relative w-10 h-10">
                <Image src="/logo.png" alt="Metrix" width={40} height={40} loading="eager" style={{ height: 'auto' }} />
              </div>
              <span className="text-2xl font-black text-white light:text-black">METRIX</span>
            </Link>

            {/* Search */}
            <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search tournaments..."
                  className="w-full pl-10 pr-4 py-2 bg-white/5 light:bg-black/5 border border-white/20 light:border-black/20 rounded-lg text-white light:text-black placeholder-gray-500 focus:border-red-500 focus:outline-none"
                />
              </div>
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-4">
              <button className="relative p-2 hover:bg-white/10 light:hover:bg-black/10 rounded-lg transition-colors">
                <Bell className="w-5 h-5 text-white light:text-black" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              
              <div className="flex items-center gap-3 px-4 py-2 bg-white/5 light:bg-black/5 rounded-lg border border-white/20 light:border-black/20">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    {user?.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="hidden md:block text-white light:text-black font-bold">
                  {user?.email?.split('@')[0]}
                </span>
              </div>

              <button
                onClick={handleSignOut}
                className="p-2 hover:bg-red-500/20 rounded-lg transition-colors group"
              >
                <LogOut className="w-5 h-5 text-white light:text-black group-hover:text-red-500" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <Flame className="w-8 h-8 text-red-500" />
            <h1 className="text-4xl font-black text-white light:text-black">
              WELCOME BACK, <span className="text-red-500">CHAMPION</span>
            </h1>
          </div>
          <p className="text-white light:text-black">
            Ready to dominate the arena? Your next victory awaits.
          </p>
        </motion.div>

        {/* Featured Countdowns */}
        <FeaturedCountdowns maxItems={1} showMatches={true} showTournaments={true} />

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity blur-xl" 
                   style={{ background: `linear-gradient(to right, var(--tw-gradient-stops))` }} />
              
              <div className="relative bg-black/60 light:bg-white/80 border-2 border-white/10 light:border-black/10 rounded-2xl p-6 group-hover:border-red-500/50 transition-all">
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                
                <div className="text-3xl font-black text-white light:text-black mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-white light:text-black mb-2">
                  {stat.label}
                </div>
                <div className="flex items-center gap-1 text-green-500 text-sm font-bold">
                  <TrendingUp className="w-4 h-4" />
                  {stat.change}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Matches */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
          >
            <div className="bg-black/60 light:bg-white/80 border-2 border-white/10 light:border-black/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Gamepad2 className="w-6 h-6 text-red-500" />
                  <h2 className="text-2xl font-black text-white light:text-black">
                    RECENT MATCHES
                  </h2>
                </div>
                <Link href="/matches" className="text-red-500 hover:text-red-400 font-bold text-sm flex items-center gap-1">
                  View All
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="space-y-4">
                {recentMatches.map((match, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-white/5 light:bg-black/5 rounded-xl border border-white/10 light:border-black/10 hover:border-red-500/50 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center {
                        match.result === "Victory" 
                          ? "bg-green-500/20 border-2 border-green-500" 
                          : "bg-red-500/20 border-2 border-red-500"
                      }`}>
                        {match.result === "Victory" ? (
                          <Trophy className="w-6 h-6 text-green-500" />
                        ) : (
                          <Target className="w-6 h-6 text-red-500" />
                        )}
                      </div>
                      
                      <div>
                        <div className="font-bold text-white light:text-black">
                          {match.game}
                        </div>
                        <div className="text-sm text-white/70 light:text-black/70">
                          {match.kills} Kills • Rank #{match.rank}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className={`font-black text-lg {
                        match.result === "Victory" ? "text-green-500" : "text-red-500"
                      }`}>
                        {match.prize}
                      </div>
                      <div className="text-sm text-white/70 light:text-black/70">
                        {match.time}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Upcoming Tournaments */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="bg-black/60 light:bg-white/80 border-2 border-white/10 light:border-black/10 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <Calendar className="w-6 h-6 text-red-500" />
                <h2 className="text-2xl font-black text-white light:text-black">
                  UPCOMING
                </h2>
              </div>

              <div className="space-y-4">
                {upcomingTournaments.map((tournament, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="p-4 bg-gradient-to-r from-red-500/10 to-red-600/10 border-2 border-red-500/30 rounded-xl hover:border-red-500 transition-all cursor-pointer group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="font-black text-white light:text-black mb-1">
                          {tournament.name}
                        </div>
                        <div className="text-sm text-white/70 light:text-black/70">
                          {tournament.players} Players
                        </div>
                      </div>
                      <Crown className="w-5 h-5 text-red-500" />
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <div className="text-2xl font-black text-red-500">
                        {tournament.prize}
                      </div>
                      <div className="text-sm font-bold text-white light:text-black">
                        Entry: {tournament.entry}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-sm text-white/70 light:text-black/70">
                        <Clock className="w-4 h-4" />
                        Starts in {tournament.starts}
                      </div>
                      <button className="px-4 py-2 bg-red-500 text-white text-sm font-bold rounded-lg hover:bg-red-600 transition-colors">
                        JOIN NOW
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>

              <Link
                href="/tournaments"
                className="mt-6 w-full flex items-center justify-center gap-2 py-3 bg-white/5 light:bg-black/5 border-2 border-white/20 light:border-black/20 rounded-xl text-white light:text-black font-bold hover:border-red-500 transition-all group"
              >
                Browse All Tournaments
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { icon: Trophy, label: "Tournaments", href: "/tournaments", color: "from-yellow-500 to-orange-500" },
            { icon: Wallet, label: "Wallet", href: "/wallet", color: "from-green-500 to-emerald-500" },
            { icon: BarChart3, label: "Stats", href: "/stats", color: "from-blue-500 to-cyan-500" },
            { icon: Settings, label: "Settings", href: "/settings", color: "from-purple-500 to-pink-500" },
          ].map((action, index) => (
            <Link
              key={index}
              href={action.href}
              className="group"
            >
              <motion.div
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="p-6 bg-black/60 light:bg-white/80 border-2 border-white/10 light:border-black/10 rounded-2xl hover:border-red-500/50 transition-all text-center"
              >
                <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <div className="font-bold text-white light:text-black">
                  {action.label}
                </div>
              </motion.div>
            </Link>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
