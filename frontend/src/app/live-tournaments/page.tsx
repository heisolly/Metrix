import React from 'react';
import { Trophy, Users, Calendar, Clock, MapPin, ChevronRight, Search, Filter } from 'lucide-react';
import Header from '@/components/layout/Header';

interface Tournament {
  id: string;
  name: string;
  game: string;
  participants: number;
  maxParticipants: number;
  date: string;
  time: string;
  prize: string;
  entryFee: string;
  status: 'upcoming' | 'live' | 'completed';
  platform: string;
  gameImage: string;
  registered: boolean;
}

const LiveTournamentsPage = () => {
  // Sample data - replace with your actual data
  const tournaments: Tournament[] = [
    {
      id: '1',
      name: 'Valorant Championship',
      game: 'Valorant',
      participants: 24,
      maxParticipants: 32,
      date: '2024-01-15',
      time: '19:00',
      prize: '5,000',
      entryFee: 'Free',
      status: 'live',
      platform: 'PC',
      gameImage: '/games/valorant.jpg',
      registered: true
    },
    {
      id: '2',
      name: 'CS:GO Pro League',
      game: 'Counter-Strike',
      participants: 16,
      maxParticipants: 16,
      date: '2024-01-14',
      time: '20:30',
      prize: '10,000',
      entryFee: '10',
      status: 'live',
      platform: 'PC',
      gameImage: '/games/csgo.jpg',
      registered: false
    },
    {
      id: '3',
      name: 'Fortnite Friday',
      game: 'Fortnite',
      participants: 48,
      maxParticipants: 100,
      date: '2024-01-13',
      time: '18:00',
      prize: '2,500',
      entryFee: 'Free',
      status: 'live',
      platform: 'Cross-Platform',
      gameImage: '/games/fortnite.jpg',
      registered: true
    },
    {
      id: '4',
      name: 'Rocket League Cup',
      game: 'Rocket League',
      participants: 8,
      maxParticipants: 16,
      date: '2024-01-12',
      time: '21:00',
      prize: '1,500',
      entryFee: '5',
      status: 'live',
      platform: 'Cross-Platform',
      gameImage: '/games/rocket-league.jpg',
      registered: false
    },
    {
      id: '5',
      name: 'League of Legends Clash',
      game: 'League of Legends',
      participants: 40,
      maxParticipants: 64,
      date: '2024-01-16',
      time: '20:00',
      prize: '8,000',
      entryFee: 'Free',
      status: 'live',
      platform: 'PC',
      gameImage: '/games/lol.jpg',
      registered: true
    },
    {
      id: '6',
      name: 'Dota 2 Battle Cup',
      game: 'Dota 2',
      participants: 32,
      maxParticipants: 64,
      date: '2024-01-17',
      time: '19:30',
      prize: '7,500',
      entryFee: '10',
      status: 'live',
      platform: 'PC',
      gameImage: '/games/dota2.jpg',
      registered: false
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'live':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Live Tournaments</h1>
          <p className="text-xl text-blue-100">Join the competition and win amazing prizes</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search tournaments..."
            />
          </div>
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <Filter className="-ml-1 mr-2 h-5 w-5 text-gray-500" />
            Filters
          </button>
        </div>

        {/* Tournaments Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tournaments.map((tournament) => (
            <div key={tournament.id} className="bg-white rounded-lg shadow overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300">
              <div className="relative h-40 bg-gray-800">
                <img
                  src={tournament.gameImage}
                  alt={tournament.game}
                  className="w-full h-full object-cover opacity-70"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-4 w-full">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-white">{tournament.name}</h3>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(tournament.status)}`}>
                      {tournament.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300">{tournament.game}</p>
                </div>
              </div>
              
              <div className="p-4">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center">
                    <Trophy className="h-5 w-5 text-yellow-500 mr-2" />
                    <div>
                      <p className="text-xs text-gray-500">Prize Pool</p>
                      <p className="font-medium">{tournament.prize}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-blue-500 mr-2" />
                    <div>
                      <p className="text-xs text-gray-500">Players</p>
                      <p className="font-medium">{tournament.participants}/{tournament.maxParticipants}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-purple-500 mr-2" />
                    <div>
                      <p className="text-xs text-gray-500">Date</p>
                      <p className="font-medium">{tournament.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-green-500 mr-2" />
                    <div>
                      <p className="text-xs text-gray-500">Time</p>
                      <p className="font-medium">{tournament.time}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <div className="text-sm text-gray-600">
                    <MapPin className="inline-block h-4 w-4 mr-1" />
                    {tournament.platform}
                  </div>
                  <button 
                    className={`px-4 py-2 rounded-md text-sm font-medium text-white {
                      tournament.registered 
                        ? 'bg-green-600 hover:bg-green-700' 
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    {tournament.registered ? 'Registered' : 'Join Now'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-8 px-4 py-3 bg-white border-t border-gray-200 sm:px-6 rounded-b-lg">
          <div className="flex-1 flex justify-between sm:hidden">
            <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Previous
            </button>
            <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to <span className="font-medium">6</span> of{' '}
                <span className="font-medium">24</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <span className="sr-only">Previous</span>
                  <span className="h-5 w-5">«</span>
                </button>
                <button aria-current="page" className="z-10 bg-blue-50 border-blue-500 text-blue-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                  1
                </button>
                <button className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                  2
                </button>
                <button className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                  3
                </button>
                <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                  ...
                </span>
                <button className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                  8
                </button>
                <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <span className="sr-only">Next</span>
                  <span className="h-5 w-5">»</span>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveTournamentsPage;
