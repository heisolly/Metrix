"use client";

import { motion } from "framer-motion";
import { 
  Users, 
  Trophy, 
  TrendingUp, 
  DollarSign,
  Clock,
  Target,
  Zap,
  BarChart3
} from "lucide-react";

interface TournamentStatsProps {
  tournament: any;
  participants: any[];
  matches: any[];
}

export default function TournamentStats({ 
  tournament, 
  participants, 
  matches 
}: TournamentStatsProps) {
  
  // Calculate statistics
  const totalMatches = matches.length;
  const completedMatches = matches.filter(m => m.status === 'completed').length;
  const liveMatches = matches.filter(m => m.status === 'live').length;
  const scheduledMatches = matches.filter(m => m.status === 'scheduled').length;
  const completionRate = totalMatches > 0 ? Math.round((completedMatches / totalMatches) * 100) : 0;
  const participationRate = tournament.max_participants > 0 
    ? Math.round((participants.length / tournament.max_participants) * 100) 
    : 0;
  
  // Calculate revenue
  const totalRevenue = participants.length * (tournament.entry_fee || 0);
  const potentialRevenue = tournament.max_participants * (tournament.entry_fee || 0);
  
  // Calculate matches by round
  const matchesByRound = matches.reduce((acc, match) => {
    const round = match.round || 1;
    if (!acc[round]) acc[round] = { scheduled: 0, live: 0, completed: 0 };
    acc[round][match.status]++;
    return acc;
  }, {} as Record<number, { scheduled: number; live: number; completed: number }>);
  
  const rounds = Object.keys(matchesByRound).map(Number).sort((a, b) => a - b);

  const stats = [
    {
      label: "Total Participants",
      value: participants.length,
      max: tournament.max_participants,
      icon: Users,
      color: "from-blue-500 to-cyan-500",
      percentage: participationRate
    },
    {
      label: "Match Progress",
      value: completedMatches,
      max: totalMatches,
      icon: Trophy,
      color: "from-green-500 to-emerald-500",
      percentage: completionRate
    },
    {
      label: "Revenue Generated",
      value: `${totalRevenue}`,
      max: `${potentialRevenue}`,
      icon: DollarSign,
      color: "from-yellow-500 to-orange-500",
      percentage: potentialRevenue > 0 ? Math.round((totalRevenue / potentialRevenue) * 100) : 0
    },
    {
      label: "Live Matches",
      value: liveMatches,
      max: totalMatches,
      icon: Zap,
      color: "from-red-500 to-pink-500",
      percentage: totalMatches > 0 ? Math.round((liveMatches / totalMatches) * 100) : 0
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-slate-900 border border-white/10 rounded-xl p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-black text-white">
                {stat.percentage}%
              </span>
            </div>
            <div className="text-sm text-white/50 mb-1">{stat.label}</div>
            <div className="text-xl font-black text-white">
              {stat.value} <span className="text-sm text-white/30">/ {stat.max}</span>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-3 h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${stat.percentage}%` }}
                transition={{ duration: 1, delay: index * 0.1 }}
                className={`h-full bg-gradient-to-r ${stat.color}`}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Match Status Distribution */}
      <div className="bg-slate-900 border border-white/10 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-6">
          <BarChart3 className="w-5 h-5 text-purple-500" />
          <h3 className="text-lg font-black text-white">Match Status Distribution</h3>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
            <div className="text-3xl font-black text-blue-500 mb-1">{scheduledMatches}</div>
            <div className="text-sm text-white/50">Scheduled</div>
          </div>
          <div className="text-center p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
            <div className="text-3xl font-black text-green-500 mb-1">{liveMatches}</div>
            <div className="text-sm text-white/50">Live</div>
          </div>
          <div className="text-center p-4 bg-white/10 border border-white/20 rounded-xl">
            <div className="text-3xl font-black text-white mb-1">{completedMatches}</div>
            <div className="text-sm text-white/50">Completed</div>
          </div>
        </div>

        {/* Visual Distribution */}
        <div className="h-4 bg-white/5 rounded-full overflow-hidden flex">
          {scheduledMatches > 0 && (
            <div 
              className="bg-blue-500" 
              style={{ width: `${(scheduledMatches / totalMatches) * 100}%` }}
            />
          )}
          {liveMatches > 0 && (
            <div 
              className="bg-green-500" 
              style={{ width: `${(liveMatches / totalMatches) * 100}%` }}
            />
          )}
          {completedMatches > 0 && (
            <div 
              className="bg-white/50" 
              style={{ width: `${(completedMatches / totalMatches) * 100}%` }}
            />
          )}
        </div>
      </div>

      {/* Rounds Progress */}
      {rounds.length > 0 && (
        <div className="bg-slate-900 border border-white/10 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <Target className="w-5 h-5 text-red-500" />
            <h3 className="text-lg font-black text-white">Progress by Round</h3>
          </div>

          <div className="space-y-4">
            {rounds.map((round) => {
              const roundData = matchesByRound[round];
              const roundTotal = roundData.scheduled + roundData.live + roundData.completed;
              const roundCompletion = roundTotal > 0 
                ? Math.round((roundData.completed / roundTotal) * 100) 
                : 0;

              return (
                <div key={round} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white">
                      Round {round}
                    </span>
                    <span className="text-sm text-white/50">
                      {roundData.completed}/{roundTotal} matches
                    </span>
                  </div>
                  
                  <div className="h-3 bg-white/10 rounded-full overflow-hidden flex">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(roundData.completed / roundTotal) * 100}%` }}
                      transition={{ duration: 0.5 }}
                      className="bg-green-500"
                    />
                    <div
                      className="bg-yellow-500"
                      style={{ width: `${(roundData.live / roundTotal) * 100}%` }}
                    />
                    <div
                      className="bg-blue-500/50"
                      style={{ width: `${(roundData.scheduled / roundTotal) * 100}%` }}
                    />
                  </div>

                  <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span className="text-white/50">{roundData.completed} Done</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                      <span className="text-white/50">{roundData.live} Live</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      <span className="text-white/50">{roundData.scheduled} Pending</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Quick Insights */}
      <div className="grid md:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl p-4"
        >
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            <h4 className="font-bold text-white">Tournament Health</h4>
          </div>
          <p className="text-sm text-white/70">
            {participationRate >= 80 
              ? "Excellent! Tournament is nearly full." 
              : participationRate >= 50 
              ? "Good participation rate. Keep promoting!" 
              : "Low participation. Consider extending registration."}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-xl p-4"
        >
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-5 h-5 text-blue-500" />
            <h4 className="font-bold text-white">Match Progress</h4>
          </div>
          <p className="text-sm text-white/70">
            {completionRate >= 75 
              ? "Tournament is nearing completion!" 
              : completionRate >= 25 
              ? "Matches are progressing well." 
              : totalMatches > 0 
              ? "Tournament has just begun." 
              : "Waiting for matches to be created."}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
