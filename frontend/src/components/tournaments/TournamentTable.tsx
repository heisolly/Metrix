"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Users, Calendar, Clock, MapPin, Zap, Play, ArrowRight, Award, Gamepad2, CheckCircle, Flame } from 'lucide-react';
import Image from 'next/image';
import HexButton from '@/components/ui/HexButton';

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
  gameImage?: string;
  organizer?: string;
  format?: string;
}

interface TournamentCardProps {
  tournament: Tournament;
  index: number;
}

const TournamentCard = ({ tournament, index }: TournamentCardProps) => {
  const progress = Math.min(100, Math.round((tournament.participants / tournament.maxParticipants) * 100));
  
  const getStatusStyles = () => {
    switch (tournament.status) {
      case 'live':
        return {
          borderGlow: 'border-red-600/60',
          badgeBg: 'bg-red-600',
          progressBar: 'from-red-600 to-orange-600',
          textAccent: 'text-red-400'
        };
      case 'upcoming':
        return {
          borderGlow: 'border-orange-600/40',
          badgeBg: 'bg-orange-600',
          progressBar: 'from-orange-600 to-yellow-600',
          textAccent: 'text-orange-400'
        };
      case 'completed':
        return {
          borderGlow: 'border-gray-700/50',
          badgeBg: 'bg-gray-700',
          progressBar: 'from-gray-600 to-gray-700',
          textAccent: 'text-gray-400'
        };
      default:
        return {
          borderGlow: 'border-gray-700/50',
          badgeBg: 'bg-gray-700',
          progressBar: 'from-gray-600 to-gray-700',
          textAccent: 'text-gray-400'
        };
    }
  };

  const statusStyles = getStatusStyles();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="group relative"
    >
      {/* Main card with hexagonal shape */}
      <div 
        className={`relative overflow-hidden bg-black/80 backdrop-blur-xl border-2 ${statusStyles.borderGlow} hover:border-red-600/80 transition-all duration-500`}
        style={{
          clipPath: 'polygon(30px 0%, calc(100% - 30px) 0%, 100% 30px, 100% calc(100% - 30px), calc(100% - 30px) 100%, 30px 100%, 0% calc(100% - 30px), 0% 30px)'
        }}
      >
        
        {/* Hexagonal corner accent */}
        <div 
          className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-red-600/30 to-transparent"
          style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }}
        />
        
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-600/0 via-red-600/5 to-red-600/0 group-hover:from-red-600/10 group-hover:via-red-600/10 group-hover:to-red-600/10 transition-all duration-500" />

        {/* Header section - No image, clean gradient */}
        <div className="relative h-40 bg-gradient-to-br from-red-950/30 via-black to-black overflow-hidden">
          {/* Animated grid pattern */}
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'linear-gradient(rgba(239,68,68,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(239,68,68,0.3) 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          />
          
          {/* Status badge */}
          <div className="absolute top-4 left-4">
            <div 
              className={`${statusStyles.badgeBg} px-4 py-2 flex items-center gap-2`}
              style={{
                clipPath: 'polygon(5px 0%, calc(100% - 5px) 0%, 100% 5px, 100% calc(100% - 5px), calc(100% - 5px) 100%, 5px 100%, 0% calc(100% - 5px), 0% 5px)'
              }}
            >
              {tournament.status === 'live' && (
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [1, 0.6, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-2 h-2 bg-white rounded-full"
                />
              )}
              <span className="text-white text-xs font-black uppercase tracking-wider">
                {tournament.status}
              </span>
            </div>
          </div>

          {/* Game name */}
          <div className="absolute bottom-4 left-4 flex items-center gap-2">
            <Gamepad2 className="w-5 h-5 text-red-400" />
            <span className="text-white font-bold text-sm uppercase tracking-wider">{tournament.game}</span>
          </div>
        </div>

        {/* Content */}
        <div className="relative p-6">
          {/* Tournament name */}
          <h3 className="text-2xl font-black text-white mb-2 line-clamp-1 group-hover:text-red-400 transition-colors">
            {tournament.name}
          </h3>
          
          {tournament.organizer && (
            <p className="text-xs text-gray-500 mb-4 uppercase tracking-wider">by {tournament.organizer}</p>
          )}

          {/* Prize pool highlight */}
          <div 
            className="mb-4 p-4 bg-gradient-to-br from-red-950/30 to-orange-950/20 border border-red-600/30"
            style={{
              clipPath: 'polygon(8px 0%, calc(100% - 8px) 0%, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0% calc(100% - 8px), 0% 8px)'
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-400" />
                <span className="text-xs text-gray-400 uppercase font-bold">Prize Pool</span>
              </div>
              <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                {tournament.prize}
              </span>
            </div>
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {/* Date & Time */}
            <div className="flex items-start gap-2">
              <Calendar className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
              <div className="min-w-0">
                <div className="text-white text-sm font-semibold truncate">{tournament.date}</div>
                <div className="text-xs text-gray-500">{tournament.time}</div>
              </div>
            </div>

            {/* Participants */}
            <div className="flex items-start gap-2">
              <Users className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
              <div className="min-w-0">
                <div className="text-white text-sm font-semibold">
                  {tournament.participants}<span className="text-gray-500">/{tournament.maxParticipants}</span>
                </div>
                <div className="text-xs text-gray-500">Players</div>
              </div>
            </div>

            {/* Entry fee */}
            <div className="flex items-start gap-2">
              <Award className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
              <div className="min-w-0">
                <div className="text-white text-sm font-semibold truncate">
                  {tournament.entryFee === 'Free' ? 'Free' : tournament.entryFee}
                </div>
                <div className="text-xs text-gray-500">Entry</div>
              </div>
            </div>

            {/* Platform */}
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
              <div className="min-w-0">
                <div className="text-white text-sm font-semibold truncate">{tournament.platform}</div>
                <div className="text-xs text-gray-500">Platform</div>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mb-5">
            <div className="flex justify-between text-xs text-gray-500 mb-2">
              <span className="font-semibold">{progress}% Full</span>
              <span>{tournament.maxParticipants - tournament.participants} spots left</span>
            </div>
            <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                className={`h-full bg-gradient-to-r ${statusStyles.progressBar} rounded-full`}
                initial={{ width: 0 }}
                whileInView={{ width: `${progress}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.3 }}
              />
            </div>
          </div>

          {/* Action button */}
          <HexButton
            href={`/tournaments/${tournament.id}`}
            variant={tournament.status === 'completed' ? 'outline' : 'solid'}
            icon={tournament.status === 'live' ? Play : tournament.status === 'completed' ? CheckCircle : ArrowRight}
            iconPosition="right"
            size="md"
            className="w-full"
          >
            {tournament.status === 'live' ? 'Watch Live' : tournament.status === 'completed' ? 'View Results' : 'Register Now'}
          </HexButton>
        </div>

        {/* Bottom red accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </motion.div>
  );
};

const TournamentTable = () => {
  // Sample data - replace with your actual data
  const tournaments: Tournament[] = [
    {
      id: '1',
      name: 'Valorant World Championship 2024',
      game: 'Valorant',
      participants: 42,
      maxParticipants: 64,
      date: '15 Jan, 2024',
      time: '19:00 UTC',
      prize: '50,000',
      entryFee: 'Free',
      status: 'upcoming',
      platform: 'PC',
      gameImage: '/games/valorant.jpg',
      organizer: 'Riot Games',
      format: '5v5, Single Elimination'
    },
    {
      id: '2',
      name: 'CS:GO Major Qualifiers',
      game: 'Counter-Strike 2',
      participants: 28,
      maxParticipants: 32,
      date: '14 Jan, 2024',
      time: '20:30 UTC',
      prize: '25,000',
      entryFee: '10',
      status: 'live',
      platform: 'PC',
      gameImage: '/games/csgo.jpg',
      organizer: 'ESL',
      format: '5v5, Swiss System'
    },
    {
      id: '3',
      name: 'Fortnite Friday Finals',
      game: 'Fortnite',
      participants: 48,
      maxParticipants: 100,
      date: '13 Jan, 2024',
      time: '18:00 UTC',
      prize: '10,000',
      entryFee: 'Free',
      status: 'upcoming',
      platform: 'Cross-Platform',
      gameImage: '/games/fortnite.jpg',
      organizer: 'Epic Games',
      format: 'Solo, Battle Royale'
    },
    {
      id: '4',
      name: 'Rocket League Championship',
      game: 'Rocket League',
      participants: 16,
      maxParticipants: 32,
      date: '12 Jan, 2024',
      time: '21:00 UTC',
      prize: '15,000',
      entryFee: '5',
      status: 'completed',
      platform: 'Cross-Platform',
      gameImage: '/games/rocket-league.jpg',
      organizer: 'Psyonix',
      format: '3v3, Double Elimination'
    },
    {
      id: '5',
      name: 'League of Legends Clash',
      game: 'League of Legends',
      participants: 72,
      maxParticipants: 128,
      date: '20 Jan, 2024',
      time: '17:00 UTC',
      prize: '30,000',
      entryFee: 'Free',
      status: 'upcoming',
      platform: 'PC',
      gameImage: '/games/lol.jpg',
      organizer: 'Riot Games',
      format: '5v5, Tournament Draft'
    },
    {
      id: '6',
      name: 'Dota 2 Pro Series',
      game: 'Dota 2',
      participants: 24,
      maxParticipants: 32,
      date: '18 Jan, 2024',
      time: '16:00 UTC',
      prize: '75,000',
      entryFee: '20',
      status: 'upcoming',
      platform: 'PC',
      gameImage: '/games/dota2.jpg',
      organizer: 'Valve',
      format: '5v5, Best of 3'
    },
    {
      id: '7',
      name: 'PUBG Mobile Masters',
      game: 'PUBG Mobile',
      participants: 64,
      maxParticipants: 64,
      date: '22 Jan, 2024',
      time: '14:00 UTC',
      prize: '100,000',
      entryFee: 'Free',
      status: 'live',
      platform: 'Mobile',
      gameImage: '/games/pubg.jpg',
      organizer: 'Krafton',
      format: '4v4, Squad'
    },
    {
      id: '8',
      name: 'Apex Legends Arena Series',
      game: 'Apex Legends',
      participants: 38,
      maxParticipants: 60,
      date: '25 Jan, 2024',
      time: '20:00 UTC',
      prize: '45,000',
      entryFee: '15',
      status: 'upcoming',
      platform: 'Cross-Platform',
      gameImage: '/games/apex.jpg',
      organizer: 'EA Sports',
      format: '3v3, Battle Royale'
    },
    {
      id: '9',
      name: 'Rainbow Six Siege Pro League',
      game: 'Rainbow Six Siege',
      participants: 16,
      maxParticipants: 16,
      date: '10 Jan, 2024',
      time: '19:30 UTC',
      prize: '20,000',
      entryFee: 'Free',
      status: 'completed',
      platform: 'PC/Console',
      gameImage: '/games/r6.jpg',
      organizer: 'Ubisoft',
      format: '5v5, Tactical'
    },
    {
      id: '10',
      name: 'Overwatch Champions Cup',
      game: 'Overwatch 2',
      participants: 54,
      maxParticipants: 80,
      date: '28 Jan, 2024',
      time: '18:30 UTC',
      prize: '35,000',
      entryFee: 'Free',
      status: 'upcoming',
      platform: 'PC/Console',
      gameImage: '/games/overwatch.jpg',
      organizer: 'Blizzard',
      format: '5v5, Push & Escort'
    },
    {
      id: '11',
      name: 'Call of Duty Warzone Showdown',
      game: 'Call of Duty',
      participants: 90,
      maxParticipants: 150,
      date: '16 Jan, 2024',
      time: '21:30 UTC',
      prize: '60,000',
      entryFee: '25',
      status: 'live',
      platform: 'Cross-Platform',
      gameImage: '/games/cod.jpg',
      organizer: 'Activision',
      format: 'Solo/Duo, Battle Royale'
    },
    {
      id: '12',
      name: 'Smash Bros Ultimate Grand Finals',
      game: 'Super Smash Bros',
      participants: 32,
      maxParticipants: 32,
      date: '08 Jan, 2024',
      time: '15:00 UTC',
      prize: '12,000',
      entryFee: '5',
      status: 'completed',
      platform: 'Nintendo Switch',
      gameImage: '/games/smash.jpg',
      organizer: 'Nintendo',
      format: '1v1, Stock Battle'
    }
  ];

  // Filter tournaments by status
  const liveTournaments = tournaments.filter(t => t.status === 'live');
  const upcomingTournaments = tournaments.filter(t => t.status === 'upcoming');
  const completedTournaments = tournaments.filter(t => t.status === 'completed').slice(0, 3);

  return (
    <section className="relative py-20 bg-black overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-slate-900/50 to-black" />
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'linear-gradient(rgba(239,68,68,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(239,68,68,0.3) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block mb-4"
          >
            <span className="text-red-500 text-sm font-black uppercase tracking-widest flex items-center gap-2">
              <Flame className="w-4 h-4" />
              Live Tournaments
            </span>
          </motion.div>
          
          <h2 className="text-5xl md:text-6xl font-black text-white mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-red-400 to-white">
              Join The Battle
            </span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Compete in the most exciting esports tournaments and win amazing prizes
          </p>
        </motion.div>

        {/* Live Tournaments */}
        {liveTournaments.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-3xl font-black text-white flex items-center gap-3">
                <div className="w-1 h-8 bg-gradient-to-b from-red-600 to-orange-600 rounded-full" />
                Live Now
              </h3>
              <HexButton href="/tournaments/live" variant="outline" icon={ArrowRight} iconPosition="right" size="sm">
                View All
              </HexButton>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {liveTournaments.map((tournament, index) => (
                <TournamentCard key={`live-${tournament.id}`} tournament={tournament} index={index} />
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Tournaments */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-3xl font-black text-white">Upcoming Tournaments</h3>
            <HexButton href="/tournaments/upcoming" variant="outline" icon={ArrowRight} iconPosition="right" size="sm">
              View All
            </HexButton>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingTournaments.map((tournament, index) => (
              <TournamentCard key={`upcoming-${tournament.id}`} tournament={tournament} index={index} />
            ))}
          </div>
        </div>

        {/* Completed Tournaments */}
        {completedTournaments.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-3xl font-black text-white">Recently Concluded</h3>
              <HexButton href="/tournaments/completed" variant="outline" icon={ArrowRight} iconPosition="right" size="sm">
                View Results
              </HexButton>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {completedTournaments.map((tournament, index) => (
                <TournamentCard key={`completed-${tournament.id}`} tournament={tournament} index={index} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default TournamentTable;
