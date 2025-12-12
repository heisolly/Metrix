import { Clock, Play, Users, Trophy, Calendar, Zap } from "lucide-react";
import Image from "next/image";

interface Team {
  id: string;
  name: string;
  logo: string;
  score?: number;
}

interface MatchCardProps {
  id: string;
  team1: Team;
  team2: Team;
  game: string;
  time: string;
  date: string;
  streamUrl: string;
  isLive?: boolean;
  prizePool?: string;
}

const MatchCard = ({ team1, team2, game, time, date, streamUrl, isLive = false, prizePool }: MatchCardProps) => (
  <div className="relative group bg-gradient-to-br from-gray-900 to-gray-800/90 rounded-xl p-5 border border-gray-800 hover:border-red-500/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(220,38,38,0.2)]">
    {/* Live indicator */}
    {isLive && (
      <div className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center z-10">
        <span className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></span>
        LIVE
      </div>
    )}

    {/* Game and prize pool */}
    <div className="flex justify-between items-center mb-4">
      <span className="text-sm font-medium text-red-400">{game}</span>
      {prizePool && (
        <div className="flex items-center text-yellow-400 text-sm">
          <Trophy className="w-4 h-4 mr-1" />
          <span>{prizePool}</span>
        </div>
      )}
    </div>
    
    {/* Teams and scores */}
    <div className="space-y-4 mb-4">
      {/* Team 1 */}
      <div className="flex items-center justify-between group/team">
        <div className="flex items-center space-x-3">
          <div className="relative w-12 h-12 rounded-lg bg-gray-800 border-2 border-transparent group-hover/team:border-red-500 transition-colors duration-300 overflow-hidden">
            <Image 
              src={team1.logo} 
              alt={team1.name}
              fill
              className="object-cover"
            />
          </div>
          <span className="font-medium text-white">{team1.name}</span>
        </div>
        {team1.score !== undefined && (
          <span className={`text-xl font-bold ${team1.score > (team2.score || 0) ? 'text-white' : 'text-gray-500'}`}>
            {team1.score}
          </span>
        )}
      </div>

      {/* VS Separator */}
      <div className="relative flex items-center justify-center my-1">
        <div className="h-px bg-gray-700 flex-1"></div>
        <span className="mx-3 text-xs text-gray-400 font-bold">VS</span>
        <div className="h-px bg-gray-700 flex-1"></div>
      </div>

      {/* Team 2 */}
      <div className="flex items-center justify-between group/team">
        <div className="flex items-center space-x-3">
          <div className="relative w-12 h-12 rounded-lg bg-gray-800 border-2 border-transparent group-hover/team:border-red-500 transition-colors duration-300 overflow-hidden">
            <Image 
              src={team2.logo} 
              alt={team2.name}
              fill
              className="object-cover"
            />
          </div>
          <span className="font-medium text-white">{team2.name}</span>
        </div>
        {team2.score !== undefined && (
          <span className={`text-xl font-bold ${team2.score > (team1.score || 0) ? 'text-white' : 'text-gray-500'}`}>
            {team2.score}
          </span>
        )}
      </div>
    </div>

    {/* Match info */}
    <div className="flex items-center justify-between text-sm text-gray-400 mt-4 pt-4 border-t border-gray-800">
      <div className="flex items-center space-x-2">
        <Calendar className="w-4 h-4 text-red-500" />
        <span>{date}</span>
      </div>
      <div className="flex items-center space-x-1">
        <Clock className="w-4 h-4 text-red-500" />
        <span>{time}</span>
      </div>
    </div>

    {/* Action button */}
    <a 
      href={streamUrl}
      className="mt-4 w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white py-2.5 rounded-lg font-medium transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg hover:shadow-red-500/20"
    >
      {isLive ? (
        <>
          <Zap className="w-4 h-4" />
          <span>Watch Live</span>
        </>
      ) : (
        <>
          <Play className="w-4 h-4" />
          <span>View Details</span>
        </>
      )}
    </a>
  </div>
);

export default function MatchSchedule() {
  // Sample matches data - replace with actual data from your API
  const upcomingMatches = [
    {
      id: '1',
      team1: { id: '1', name: 'Team Liquid', logo: '/teams/team-liquid.png' },
      team2: { id: '2', name: 'Fnatic', logo: '/teams/fnatic.png' },
      game: 'PUBG Mobile',
      time: '18:30',
      date: '25 Dec, 2024',
      streamUrl: '#',
      prizePool: '50,000'
    },
    {
      id: '2',
      team1: { id: '3', name: 'Natus Vincere', logo: '/teams/navi.png' },
      team2: { id: '4', name: 'G2 Esports', logo: '/teams/g2.png' },
      game: 'Valorant',
      time: '19:30',
      date: '25 Dec, 2024',
      streamUrl: '#',
      prizePool: '30,000'
    },
    {
      id: '3',
      team1: { id: '5', name: 'T1', logo: '/teams/t1.png' },
      team2: { id: '6', name: 'Cloud9', logo: '/teams/cloud9.png' },
      game: 'League of Legends',
      time: '20:30',
      date: '25 Dec, 2024',
      streamUrl: '#',
      prizePool: '75,000'
    },
  ];

  const liveMatches = [
    {
      id: 'live1',
      team1: { id: '7', name: 'Team Secret', logo: '/teams/secret.png', score: 2 },
      team2: { id: '8', name: 'Evil Geniuses', logo: '/teams/eg.png', score: 1 },
      game: 'Dota 2',
      time: 'LIVE',
      date: 'Now Playing',
      streamUrl: '#',
      isLive: true,
      prizePool: '100,000'
    },
    {
      id: 'live2',
      team1: { id: '9', name: 'Sentinels', logo: '/teams/sentinels.png', score: 13 },
      team2: { id: '10', name: '100 Thieves', logo: '/teams/100t.png', score: 10 },
      game: 'Valorant',
      time: 'LIVE',
      date: 'Now Playing',
      streamUrl: '#',
      isLive: true,
      prizePool: '50,000'
    },
  ];

  return (
    <section className="relative py-16 bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Live Matches Section */}
        {liveMatches.length > 0 && (
          <div className="mb-20">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                  Live Matches
                </span>
              </h2>
              <a 
                href="/live" 
                className="text-sm font-medium text-red-400 hover:text-white flex items-center transition-colors"
              >
                View All Live
                <svg className="ml-1 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {liveMatches.map((match) => (
                <MatchCard key={match.id} {...match} />
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Matches Section */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                Upcoming Matches
              </span>
            </h2>
            <a 
              href="/schedule" 
              className="text-sm font-medium text-red-400 hover:text-white flex items-center transition-colors"
            >
              View Full Schedule
              <svg className="ml-1 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingMatches.map((match) => (
              <MatchCard key={match.id} {...match} />
            ))}
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-red-500/5 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-500/5 rounded-full filter blur-3xl"></div>
      </div>
    </section>
  );
}
