"use client";

import { motion } from "framer-motion";
import { Play, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import HexButton from "@/components/ui/HexButton";
import { supabase } from "@/lib/supabase";

export default function TournamentGames() {
  const [activeTab, setActiveTab] = useState("all");
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [sectionSettings, setSectionSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load section settings
      const { data: sectionData } = await supabase
        .from("homepage_sections")
        .select("*")
        .eq("section_key", "tournament_games")
        .eq("is_active", true)
        .single();

      if (sectionData) {
        setSectionSettings(sectionData);
      }

      // Load tournament games
      const { data: gamesData } = await supabase
        .from("homepage_tournament_games")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (gamesData) {
        // Transform database format to component format
        const transformedGames = gamesData.map((game: any) => ({
          id: game.id,
          game: game.game_name,
          team1: { name: game.team1_name, logo: game.team1_logo },
          team2: { name: game.team2_name, logo: game.team2_logo },
          time: game.match_time,
          date: game.match_date,
          status: game.status,
          color: {
            primary: game.color_primary,
            secondary: game.color_secondary,
            name: game.color_name
          }
        }));
        setTournaments(transformedGames);
      }
    } catch (error) {
      console.error("Error loading tournament games:", error);
      // Fallback to empty array if database fails
      setTournaments([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter tournaments based on active tab
  const filteredTournaments = tournaments.filter(tournament => {
    if (activeTab === "all") return true;
    if (activeTab === "upcoming") return tournament.status === "upcoming";
    if (activeTab === "finished") return tournament.status === "finished";
    return true;
  });

  // Don't render if section is not active or no settings
  if (!sectionSettings || loading) {
    return null;
  }

  // Get tab labels from settings or use defaults
  const tabLabels = sectionSettings.settings?.tab_labels || ["All Games", "Upcoming Games", "Finished Games"];

  return (
    <section className="relative py-20 px-4 bg-black light:bg-gray-100 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-slate-900 to-black light:from-gray-100 light:via-white light:to-gray-100" />
      <div 
        className="absolute inset-0 opacity-5 light:opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(rgba(239,68,68,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(239,68,68,0.3) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block mb-4"
          >
            <span className="text-red-500 text-sm font-bold uppercase tracking-widest">
              {sectionSettings.subtitle || "Tournament Game"}
            </span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-black text-white light:text-gray-900 mb-8"
          >
            {sectionSettings.title || "Tournament Trending Match"}
          </motion.h2>

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex justify-center gap-4 flex-wrap"
          >
            {tabLabels.map((tab: string, index: number) => (
              <button
                key={tab}
                onClick={() => setActiveTab(index === 0 ? "all" : index === 1 ? "upcoming" : "finished")}
                className={`px-8 py-3 rounded-full font-bold uppercase text-sm tracking-wider transition-all ${
                  (index === 0 && activeTab === "all") ||
                  (index === 1 && activeTab === "upcoming") ||
                  (index === 2 && activeTab === "finished")
                    ? "bg-red-600 text-white shadow-lg shadow-red-600/50"
                    : "bg-slate-800 text-gray-400 hover:bg-slate-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </motion.div>
        </div>

        {/* Tournament Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredTournaments.map((tournament, index) => (
            <motion.div
              key={tournament.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1 }}
              className="group relative"
            >
              {/* Card Background - Hexagonal */}
              <div 
                className="relative overflow-hidden border-2 hover:border-opacity-80 transition-all duration-500"
                style={{
                  backgroundImage: "url('/tournament-card-bg.png')",
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  clipPath: 'polygon(30px 0%, calc(100% - 30px) 0%, 100% 30px, 100% calc(100% - 30px), calc(100% - 30px) 100%, 30px 100%, 0% calc(100% - 30px), 0% 30px)',
                  borderColor: `${tournament.color.primary}50`
                }}
              >
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/90" />
                <div 
                  className="absolute inset-0 bg-gradient-to-r via-transparent opacity-30"
                  style={{
                    background: `linear-gradient(to right, {tournament.color.primary}30, transparent, ${tournament.color.primary}30)`
                  }}
                />
                
                {/* Glow effect on hover */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-all duration-500"
                  style={{ backgroundColor: tournament.color.primary }}
                />

                {/* Content */}
                <div className="relative p-8">
                  {/* Game Tag */}
                  <div className="text-center mb-6">
                    <span 
                      className="text-xs font-bold uppercase tracking-widest px-4 py-1 rounded-full"
                      style={{ 
                        color: tournament.color.primary,
                        backgroundColor: `${tournament.color.primary}20`,
                        border: `1px solid ${tournament.color.primary}40`
                      }}
                    >
                      {tournament.game}
                    </span>
                  </div>

                  {/* Teams and VS */}
                  <div className="grid grid-cols-7 items-center gap-4 mb-6">
                    {/* Team 1 */}
                    <div className="col-span-3 flex flex-col items-center">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="relative mb-3"
                      >
                        {/* Hexagon glow */}
                        <div 
                          className="absolute inset-0 rounded-2xl blur-xl scale-110 opacity-50"
                          style={{ backgroundColor: tournament.color.primary }}
                        />
                        
                        {/* Hexagon container */}
                        <div 
                          className="relative w-20 h-20 bg-black/80 rounded-2xl border-2 flex items-center justify-center backdrop-blur-sm"
                          style={{ borderColor: `${tournament.color.primary}cc` }}
                        >
                          <img 
                            src={tournament.team1.logo} 
                            alt={tournament.team1.name}
                            className="w-14 h-14 object-contain"
                          />
                        </div>
                      </motion.div>
                      <span className="text-white font-black text-lg">{tournament.team1.name}</span>
                    </div>

                    {/* VS */}
                    <div className="col-span-1 flex flex-col items-center">
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="relative mb-2"
                      >
                        <div 
                          className="absolute inset-0 blur-lg rounded-full opacity-40"
                          style={{ backgroundColor: tournament.color.primary }}
                        />
                        <div 
                          className="relative w-14 h-14 rounded-full flex items-center justify-center border-2"
                          style={{
                            background: `linear-gradient(135deg, {tournament.color.primary}, ${tournament.color.secondary})`,
                            borderColor: `${tournament.color.primary}99`
                          }}
                        >
                          <span className="text-white font-black text-sm">VS</span>
                        </div>
                      </motion.div>
                      <div className="text-white font-black text-xl">{tournament.time}</div>
                      <div className="text-gray-400 text-xs">{tournament.date}</div>
                    </div>

                    {/* Team 2 */}
                    <div className="col-span-3 flex flex-col items-center">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: -5 }}
                        className="relative mb-3"
                      >
                        {/* Hexagon glow */}
                        <div 
                          className="absolute inset-0 rounded-2xl blur-xl scale-110 opacity-50"
                          style={{ backgroundColor: tournament.color.primary }}
                        />
                        
                        {/* Hexagon container */}
                        <div 
                          className="relative w-20 h-20 bg-black/80 rounded-2xl border-2 flex items-center justify-center backdrop-blur-sm"
                          style={{ borderColor: `${tournament.color.primary}cc` }}
                        >
                          <img 
                            src={tournament.team2.logo} 
                            alt={tournament.team2.name}
                            className="w-14 h-14 object-contain"
                          />
                        </div>
                      </motion.div>
                      <span className="text-white font-black text-lg">{tournament.team2.name}</span>
                    </div>
                  </div>

                  {/* Watch Stream Button */}
                  <div className="flex justify-center">
                    <HexButton 
                      variant="outline"
                      icon={ArrowRight}
                      iconPosition="right"
                      size="md"
                    >
                      Watch Stream
                    </HexButton>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
