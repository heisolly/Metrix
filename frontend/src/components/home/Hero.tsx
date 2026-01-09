"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Play, Trophy, Users, ArrowRight, Swords } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Countdown from "@/components/Countdown";

export default function Hero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [nextEvent, setNextEvent] = useState<any>(null);
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ 
        x: (e.clientX - window.innerWidth / 2) / 50,
        y: (e.clientY - window.innerHeight / 2) / 50
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    async function loadNextEvent() {
      try {
        const now = new Date().toISOString();
        let event = null;

        // 1. Check Tournaments
        const { data: tournaments } = await supabase
          .from('tournaments')
          .select('*')
          .eq('show_countdown', true)
          .in('status', ['upcoming', 'registration_open'])
          .gte('start_date', now)
          .order('start_date', { ascending: true })
          .limit(1);

        if (tournaments && tournaments.length > 0) {
          event = { ...tournaments[0], type: 'tournament' };
        } else {
          // 2. Check Matches
          const { data: matches } = await supabase
            .from('matches')
            .select('*, tournament:tournaments(name)')
            .eq('show_countdown', true)
            .eq('status', 'scheduled')
            .gte('scheduled_time', now)
            .order('scheduled_time', { ascending: true })
            .limit(1);

          if (matches && matches.length > 0) {
            event = { ...matches[0], type: 'match' };
          }
        }

        setNextEvent(event);
      } catch (error) {
        console.error("Error loading hero countdown event:", error);
      }
    }
    loadNextEvent();
  }, []);

  return (
    <section 
      ref={containerRef}
      className="relative w-full min-h-screen bg-black light:bg-gray-100 overflow-hidden"
    >
      {/* Background Image with Lighter Gradients */}
      <motion.div 
        className="absolute inset-0 z-0"
        style={{
          x: mousePosition.x,
          y: mousePosition.y,
        }}
      >
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-70 light:opacity-90"
          style={{
            backgroundImage: "url('/game-s-1-1.png')",
            backgroundPosition: 'center 30%',
          }}
        />
        
        {/* Lighter Black Gradient Overlays - Let image show through */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/30 to-black/90 light:from-white/80 light:via-white/30 light:to-white/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60 light:from-white/60 light:via-transparent light:to-white/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent light:from-white/90 light:via-white/40 light:to-transparent" />
        
        {/* Subtle red tint overlay */}
        <div className="absolute inset-0 bg-red-900/5 light:bg-red-500/5" />
      </motion.div>

      {/* Animated scan lines */}
      <div className="absolute inset-0 z-[1] opacity-5">
        <motion.div
          className="h-full w-full"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)',
          }}
          animate={{ y: ['0%', '100%'] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Grid overlay */}
      <div 
        className="absolute inset-0 z-[2] opacity-10"
        style={{
          backgroundImage: 'linear-gradient(rgba(239,68,68,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(239,68,68,0.3) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />

      {/* Main Content */}
      <motion.div 
        className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 pt-20"
        style={{ y, opacity }}
      >
        {/* Top Badge */}
        {!nextEvent && (
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="mb-8"
            >
                <div className="inline-flex items-center gap-3 px-6 py-3 bg-black/60 light:bg-white/60 backdrop-blur-xl rounded-full border border-red-500/50 shadow-xl shadow-red-500/20 light:shadow-red-500/10">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                    <Swords className="w-5 h-5 text-red-500" />
                </motion.div>
                <span className="text-sm font-black text-white light:text-gray-900 tracking-widest uppercase">Elite Gaming Tournament</span>
                </div>
            </motion.div>
        )}
        
        {/* If event exists, show a smaller "Live Event" badge instead of the generic one */}
        {nextEvent && (
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="mb-8"
            >
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-600/20 backdrop-blur-xl rounded-full border border-red-500 shadow-lg shadow-red-500/30">
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                    <span className="text-xs font-bold text-white tracking-widest uppercase">
                        UPCOMING EVENT FOUND
                    </span>
                </div>
            </motion.div>
        )}

        {/* Main Title - Staggered Animation */}
        <div className="relative mb-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="text-center w-full"
          >
            {/* Massive METRIX Text with War Priest Font */}
            <div className="relative w-full flex justify-center">
              <style jsx>{`
                .metrix-text {
                  color: var(--white-color);
                  --text-shadow: 0 0 100px rgba(239,68,68,1), 0 0 50px rgba(239,68,68,0.8);
                  --text-stroke: 3px rgba(255,255,255,0.15);
                }
                .light .metrix-text {
                  color: #1a1a1a;
                  --text-shadow: 0 0 100px rgba(239,68,68,0.3), 0 0 50px rgba(239,68,68,0.2);
                  --text-stroke: 3px rgba(0,0,0,0.1);
                }
              `}</style>
              
              {/* Glow layer */}
              <motion.h1
                className="font-black tracking-tighter leading-none metrix-text"
                style={{
                  fontSize: 'clamp(120px, 25vw, 400px)',
                  fontFamily: 'var(--war-font)',
                  fontWeight: 400,
                  textTransform: 'uppercase',
                }}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <span 
                  className="absolute inset-0 blur-3xl opacity-70"
                  style={{
                    textShadow: 'var(--text-shadow)',
                  }}
                >
                  METRIX
                </span>
                <span className="relative block">
                  {['M', 'E', 'T', 'R', 'I', 'X'].map((letter, index) => (
                    <motion.span
                      key={index}
                      className="inline-block"
                      style={{
                        textShadow: 'var(--text-shadow)',
                        WebkitTextStroke: 'var(--text-stroke)',
                      }}
                      initial={{ y: -100, opacity: 0, rotateX: 90 }}
                      animate={{ y: 0, opacity: 1, rotateX: 0 }}
                      transition={{ 
                        duration: 0.6, 
                        delay: 0.5 + index * 0.1,
                        type: "spring",
                        stiffness: 100
                      }}
                    >
                      {letter}
                    </motion.span>
                  ))}
                </span>
              </motion.h1>

              {/* Underline decoration */}
              <motion.div
                className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex justify-center gap-2"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 'auto', opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.2 }}
              >
                <div className="h-1 w-20 bg-gradient-to-r from-transparent to-red-500" />
                <div className="h-1 w-3 bg-red-500" />
                <div className="h-1 w-20 bg-gradient-to-l from-transparent to-red-500" />
              </motion.div>
            </div>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.4 }}
              className="mt-6 text-2xl md:text-4xl font-bold text-gray-300 light:text-gray-600"
            >
              Where <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-500 light:from-red-600 light:to-orange-600">Legends</span> Are Born
            </motion.p>
          </motion.div>
        </div>

        {/* HERO COUNTDOWN */}
        <AnimatePresence>
            {nextEvent && (
                <motion.div
                    initial={{ opacity: 0, height: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, height: "auto", scale: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0, scale: 0.9, y: -20 }}
                    transition={{ duration: 0.6, ease: "easeOut", delay: 1.5 }}
                    className="w-full max-w-4xl mx-auto mb-12 relative z-30"
                >
                    <div className="transform md:scale-90 lg:scale-100 origin-center">
                        <Countdown 
                            targetDate={nextEvent.countdown_start_time || nextEvent.start_date || nextEvent.scheduled_time}
                            title={nextEvent.type === 'tournament' ? nextEvent.name : `{nextEvent.tournament?.name || 'Match'} - Round ${nextEvent.round || '1'}`}
                            variant="fire"
                        />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.6 }}
          className="flex flex-col sm:flex-row gap-4 mb-12"
        >
          <motion.a
            href="/tournaments"
            className="group relative overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl blur-xl opacity-75 group-hover:opacity-100 transition-opacity" />
            
            {/* Button */}
            <div className="relative px-10 py-5 bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl border border-red-400/30 flex items-center gap-3">
              <Play className="w-6 h-6" fill="currentColor" />
              <span className="font-black text-xl uppercase tracking-wider">Enter Battle</span>
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowRight className="w-6 h-6" />
              </motion.div>
            </div>
          </motion.a>

          <motion.a
            href="/leaderboard"
            className="group relative"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="relative px-10 py-5 bg-black/40 backdrop-blur-xl rounded-2xl border-2 border-white/20 hover:border-red-500/60 transition-all flex items-center gap-3">
              <Trophy className="w-6 h-6 text-orange-500" />
              <span className="font-black text-xl uppercase tracking-wider text-white">Rankings</span>
            </div>
          </motion.a>
        </motion.div>

        {/* Compact Stats - Inline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.8 }}
          className="flex items-center justify-center gap-8 mb-8"
        >
          {[
            { label: "Prize Pool", value: "2.4M", icon: Trophy },
            { label: "Players", value: "12.5K", icon: Users },
            { label: "Tournaments", value: "147", icon: Play },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 2 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-3 px-5 py-3 bg-black/60 backdrop-blur-xl rounded-xl border border-red-500/30 hover:border-red-500/60 transition-all"
            >
              <div className="p-2 bg-gradient-to-br from-red-600 to-orange-600 rounded-lg">
                <stat.icon className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-2xl font-black text-white leading-none mb-1">{stat.value}</div>
                <div className="text-xs text-gray-400 font-semibold uppercase tracking-wide">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>


    </section>
  );
}
