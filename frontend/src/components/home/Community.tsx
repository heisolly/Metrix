"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Users, Eye, Banknote, Shield, Zap, Twitter, Instagram, Youtube } from "lucide-react";
import HexButton from "@/components/ui/HexButton";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function Community() {
  const [visibleCards, setVisibleCards] = useState([0, 1, 2]);

  const allFeatures = [
    { 
      icon: Trophy, 
      title: "Competitive Tournaments", 
      description: "Join daily tournaments across multiple games. Compete with the best players and win real cash prizes in Naira.",
      color: "#ef4444"
    },
    { 
      icon: Eye, 
      title: "Verified Match Results", 
      description: "Every match is verified by human spectators and AI to ensure fair play and accurate prize distribution.",
      color: "#22c55e"
    },
    { 
      icon: Banknote, 
      title: "Instant Naira Payouts", 
      description: "Win and get paid directly to your Nigerian bank account. Fast, secure, and hassle-free withdrawals.",
      color: "#ef4444"
    },
    { 
      icon: Shield, 
      title: "Anti-Cheat Protection", 
      description: "Advanced anti-cheat technology combined with spectator oversight maintains tournament integrity.",
      color: "#22c55e"
    },
  ];

  // Rotate cards every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleCards(prev => {
        const nextIndex = (prev[2] + 1) % allFeatures.length;
        return [prev[1], prev[2], nextIndex];
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const socialLinks = [
    { icon: Twitter, name: "Twitter", followers: "12.5K", color: "from-blue-500 to-blue-600" },
    { icon: Instagram, name: "Instagram", followers: "8.2K", color: "from-pink-500 to-purple-600" },
    { icon: Youtube, name: "YouTube", followers: "15.3K", color: "from-red-500 to-red-600" },
  ];

  return (
    <section className="relative py-24 px-4 bg-black light:bg-[#f5f5f5] overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-slate-950/50 to-black light:from-[#f5f5f5] light:via-[#e8e8e8] light:to-[#f5f5f5]" />
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'linear-gradient(rgba(239, 68, 68, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(239, 68, 68, 0.3) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="text-xs uppercase tracking-wider text-red-500 mb-4 font-black"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            # WELCOME TO METRIX GAMING PLATFORM
          </motion.div>
          <h2 className="text-5xl md:text-6xl font-black text-white light:text-gray-900 mb-4">
            Compete, Win, And <span className="text-red-500">Earn Real Money</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Left - Large Hero Image */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="relative w-full h-[600px]"
              animate={{
                y: [0, -20, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {/* Glow Effects */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-br from-red-500/40 to-red-600/40 blur-3xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity
                }}
              />

              {/* Red Light Beam Effect */}
              <motion.div
                className="absolute top-1/4 right-0 w-96 h-2 bg-gradient-to-r from-transparent via-red-500 to-transparent blur-sm"
                animate={{
                  scaleX: [0, 1, 0],
                  opacity: [0, 1, 0],
                  x: [-200, 0, 200]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />

              {/* Hero Image */}
              <motion.div
                className="relative w-full h-full"
                animate={{
                  rotateY: [-3, 3, -3],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={{
                  transformStyle: "preserve-3d",
                  perspective: "1000px"
                }}
              >
                <Image
                  src="/hero1.png"
                  alt="Gaming Hero"
                  fill
                  className="object-contain drop-shadow-2xl"
                  priority
                />
              </motion.div>

              {/* Floating Particles */}
              {[...Array(10)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-red-500 rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [0, -30, 0],
                    opacity: [0, 1, 0],
                    scale: [0, 1.5, 0]
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 2
                  }}
                />
              ))}
            </motion.div>
          </motion.div>

          {/* Right - Animated Feature Cards */}
          <div className="space-y-6 h-[600px] flex flex-col justify-center">
            <AnimatePresence mode="popLayout">
              {visibleCards.map((index, position) => (
                <motion.div
                  key={`{index}-${position}`}
                  className="group relative"
                  initial={{ opacity: 0, x: 100, scale: 0.8 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -100, scale: 0.8 }}
                  transition={{ 
                    duration: 0.5,
                    delay: position * 0.1
                  }}
                  layout
                >
                  <div
                    className="relative bg-black/60 light:bg-white/80 backdrop-blur-sm border-2 transition-all duration-500 p-8 rounded-2xl overflow-hidden min-h-[180px]"
                    style={{
                      borderColor: `${allFeatures[index].color}30`,
                    }}
                  >
                    {/* Background Glow */}
                    <div 
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{
                        background: `linear-gradient(to right, ${allFeatures[index].color}10, transparent)`
                      }}
                    />

                    <div className="relative z-10 flex items-start gap-6">
                      {/* Icon */}
                      <motion.div
                        className="flex-shrink-0 w-20 h-20 rounded-xl flex items-center justify-center"
                        style={{
                          background: `linear-gradient(135deg, {allFeatures[index].color}, ${allFeatures[index].color}dd)`
                        }}
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                      >
                        {(() => {
                          const IconComponent = allFeatures[index].icon;
                          return <IconComponent className="w-10 h-10 text-white" />;
                        })()}
                      </motion.div>

                      {/* Content */}
                      <div className="flex-1">
                        <h3 className="text-2xl font-black text-white light:text-gray-900 mb-3">
                          {allFeatures[index].title}
                        </h3>
                        <p className="text-gray-400 light:text-gray-600 text-base leading-relaxed">
                          {allFeatures[index].description}
                        </p>
                      </div>
                    </div>

                    {/* Shine Effect */}
                    <motion.div
                      className="absolute top-0 left-0 w-full h-full"
                      style={{
                        background: `linear-gradient(to right, transparent, ${allFeatures[index].color}20, transparent)`
                      }}
                      animate={{
                        x: ['-100%', '200%']
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        repeatDelay: 2
                      }}
                    />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Social Links Grid */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="text-3xl font-black text-white light:text-gray-900 text-center mb-10">
            Join Our <span className="text-red-500">Community</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {socialLinks.map((social, index) => (
              <motion.a
                key={social.name}
                href="#"
                className="group cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
              >
                <div
                  className="relative bg-black light:bg-white backdrop-blur-sm border-2 border-slate-800 light:border-gray-200 hover:border-red-500/50 transition-all duration-300 p-8 text-center rounded-2xl overflow-hidden"
                >
                  {/* Red glow on hover */}
                  <div className="absolute inset-0 bg-red-500/0 group-hover:bg-red-500/5 transition-all duration-300" />

                  <div className="relative z-10">
                    {/* Icon with red/green gradient */}
                    <motion.div 
                      className="w-16 h-16 bg-gradient-to-br from-red-600 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-red-600/30"
                      whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      <social.icon className="w-8 h-8 text-white" />
                    </motion.div>
                    
                    {/* Platform name */}
                    <div className="text-xl font-black text-white mb-2">{social.name}</div>
                    
                    {/* Follower count */}
                    <div className="text-sm text-red-500 font-bold">{social.followers} Followers</div>
                  </div>

                  {/* Bottom accent line */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
        >
          <motion.button
            className="px-10 py-4 bg-red-600 hover:bg-red-700 text-white font-black text-lg uppercase tracking-wider transition-all duration-300 shadow-lg shadow-red-600/50"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            JOIN METRIX COMMUNITY
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
