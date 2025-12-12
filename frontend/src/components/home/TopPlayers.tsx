"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Trophy, TrendingUp, Award } from "lucide-react";

export default function TopPlayers() {
  const players = [
    {
      rank: 1,
      name: "ShadowStrike",
      earnings: "₦125,000",
      wins: 23,
      avatar: "/assets/4-3.png",
      badge: "Champion"
    },
    {
      rank: 2,
      name: "PhoenixRising",
      earnings: "₦98,500",
      wins: 19,
      avatar: "/assets/1-2.png",
      badge: "Elite"
    },
    {
      rank: 3,
      name: "NeonNinja",
      earnings: "₦87,200",
      wins: 17,
      avatar: "/assets/4-3.png",
      badge: "Elite"
    },
    {
      rank: 4,
      name: "CyberViper",
      earnings: "₦76,800",
      wins: 15,
      avatar: "/assets/1-2.png",
      badge: "Pro"
    },
    {
      rank: 5,
      name: "StormLegend",
      earnings: "₦65,400",
      wins: 13,
      avatar: "/assets/4-3.png",
      badge: "Pro"
    }
  ];

  const getRankColor = (rank: number) => {
    if (rank === 1) return "from-yellow-500 to-orange-500";
    if (rank === 2) return "from-gray-400 to-gray-500";
    if (rank === 3) return "from-orange-700 to-orange-800";
    return "from-red-600 to-red-700";
  };

  return (
    <section className="relative py-24 px-4 bg-black overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-black to-slate-950" />
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'linear-gradient(rgba(239,68,68,0.3) 2px, transparent 2px), linear-gradient(90deg, rgba(239,68,68,0.3) 2px, transparent 2px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-block text-xs uppercase tracking-wider text-red-500 mb-4 font-black flex items-center gap-2"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Trophy className="w-4 h-4" />
            Leaderboard
          </motion.div>
          <h2 className="text-5xl md:text-6xl font-black text-white mb-4">
            Top <span className="text-red-500">Players</span>
          </h2>
          <p className="text-gray-400 text-lg">
            Our most successful gamers this month
          </p>
        </motion.div>

        {/* Leaderboard */}
        <div className="space-y-4">
          {players.map((player, index) => (
            <motion.div
              key={player.rank}
              className="group"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              {/* Player Card with Hexagonal Shape */}
              <div
                className="relative bg-slate-900/80 backdrop-blur-sm border-2 border-slate-800 hover:border-red-600/50 transition-all duration-500 overflow-hidden group-hover:shadow-2xl group-hover:shadow-red-600/20"
                style={{
                  clipPath: 'polygon(25px 0%, calc(100% - 25px) 0%, 100% 25px, 100% calc(100% - 25px), calc(100% - 25px) 100%, 25px 100%, 0% calc(100% - 25px), 0% 25px)'
                }}
              >
                <div className="flex items-center gap-6 p-6">
                  {/* Rank Badge */}
                  <div className={`flex-shrink-0 w-16 h-16 bg-gradient-to-br ${getRankColor(player.rank)} rounded-xl flex items-center justify-center relative`}>
                    <span className="text-2xl font-black text-white">#{player.rank}</span>
                    {player.rank <= 3 && (
                      <div className="absolute -top-1 -right-1">
                        <Trophy className="w-5 h-5 text-yellow-400" />
                      </div>
                    )}
                  </div>

                  {/* Avatar */}
                  <div className="flex-shrink-0 relative w-14 h-14 rounded-full overflow-hidden border-2 border-red-600/50 group-hover:border-red-600 transition-colors">
                    <Image
                      src={player.avatar}
                      alt={player.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Player Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-black text-white mb-1">
                      {player.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 text-xs font-bold bg-red-600/20 text-red-500 rounded">
                        {player.badge}
                      </span>
                      <span className="text-gray-400 text-sm flex items-center gap-1">
                        <Award className="w-3 h-3" />
                        {player.wins} Wins
                      </span>
                    </div>
                  </div>

                  {/* Earnings */}
                  <div className="flex-shrink-0 text-right">
                    <div className="text-xs text-gray-500 mb-1">Total Earnings</div>
                    <div className="text-2xl font-black text-green-500 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      {player.earnings}
                    </div>
                  </div>
                </div>

                {/* Hover Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
        >
          <motion.button
            className="px-8 py-3 border-2 border-red-600 text-red-500 font-black transition-all hover:bg-red-600 hover:text-white"
            style={{
              clipPath: 'polygon(15px 0%, calc(100% - 15px) 0%, 100% 50%, calc(100% - 15px) 100%, 15px 100%, 0% 50%)'
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View Full Leaderboard
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
