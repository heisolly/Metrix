"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { CheckCircle, Shield, Eye, Banknote, Zap } from "lucide-react";

export default function WhyMetrix() {
  const values = [
    "Verified results by real humans and AI spectators",
    "Dual verification system ensures maximum accuracy",
    "Fast Naira payouts directly to your bank account",
    "Advanced anti-cheat technology with spectator oversight"
  ];

  const features = [
    {
      icon: Shield,
      title: "Verified Results",
      description: "Every match is verified by real humans and AI to ensure fair play and accurate results."
    },
    {
      icon: Eye,
      title: "Human & AI Spectators",
      description: "Dual verification system with human spectators and AI analysis for maximum accuracy."
    },
    {
      icon: Banknote,
      title: "Naira Payouts",
      description: "Win and get paid directly in Nigerian Naira. Fast, secure, and hassle-free withdrawals."
    },
    {
      icon: Zap,
      title: "Anti-Cheat System",
      description: "Advanced anti-cheat technology combined with spectator oversight to maintain integrity."
    }
  ];

  return (
    <section className="relative py-24 px-4 bg-black overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-5">
        <div 
          style={{
            backgroundImage: 'linear-gradient(rgba(239, 68, 68, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(239, 68, 68, 0.3) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
          className="w-full h-full"
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Top Section - Text and Image */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="text-xs uppercase tracking-wider text-red-500 mb-4 font-black"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              # Why Choose Our Gaming Site
            </motion.div>

            <h2 className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight">
              Our Values Inspire And Drive Our
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-600"> Every Move !</span>
            </h2>

            {/* Values List */}
            <div className="space-y-4 mb-8">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  className="flex items-start gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-0.5">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-gray-300 text-base leading-relaxed">{value}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Image - Top */}
          <motion.div
            className="relative h-96 rounded-2xl overflow-hidden"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            whileHover={{ scale: 1.02 }}
          >
            <Image
              src="/gallery01.jpg"
              alt="Gaming"
              fill
              className="object-cover"
            />
            {/* Red/Green Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-green-500/20 mix-blend-overlay" />
            
            {/* Border Glow */}
            <div className="absolute inset-0 border-2 border-red-500/30" />
          </motion.div>
        </div>

        {/* Bottom Section - Image and Badge with Text */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Image - Bottom */}
          <motion.div
            className="relative h-96 rounded-2xl overflow-hidden order-2 lg:order-1"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            whileHover={{ scale: 1.02 }}
          >
            <Image
              src="/gallery02.jpg"
              alt="Gaming Tournament"
              fill
              className="object-cover"
            />
            {/* Green/Red Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tl from-green-500/20 to-red-500/20 mix-blend-overlay" />
            
            {/* Border Glow */}
            <div className="absolute inset-0 border-2 border-red-500/30" />
          </motion.div>

          {/* Right Content - Badge and Description */}
          <motion.div
            className="relative order-1 lg:order-2"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Circular Badge */}
            <motion.div
              className="w-48 h-48 mx-auto lg:mx-0 mb-8 relative"
              animate={{
                rotate: 360
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              <div className="absolute inset-0 rounded-full border-4 border-red-500/30 flex items-center justify-center">
                <motion.div
                  className="text-center"
                  animate={{
                    rotate: -360
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                >
                  <div className="w-32 h-32 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center p-4">
                    {/* Metrix Logo */}
                    <Image
                      src="/logo.png"
                      alt="Metrix"
                      width={80}
                      height={80}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </motion.div>
              </div>
              
              {/* Rotating Text */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200">
                <path
                  id="curve"
                  d="M 100, 100 m -75, 0 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0"
                  fill="transparent"
                />
                <text className="text-xs fill-red-500 font-bold tracking-wider">
                  <textPath href="#curve">
                    • METRIX GAMING • EXCELLENCE • INTEGRITY •
                  </textPath>
                </text>
              </svg>
            </motion.div>

            {/* Description Text */}
            <div className="space-y-6">
              <p className="text-gray-300 leading-relaxed">
                Gamers can join local gaming meetups, participate in gaming events, or connect with like-minded individuals through online forums and social media groups. Engaging with the community helps build connections and creates opportunities for collaborative gaming experiences.
              </p>
              <p className="text-gray-300 leading-relaxed">
                Storytelling is a crucial element in modern video game design, creating immersive and engaging experiences. Games with compelling narratives often leave lasting impressions on players.
              </p>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-2 gap-4 mt-8">
              {features.slice(0, 2).map((feature, index) => (
                <motion.div
                  key={feature.title}
                  className="p-4 bg-slate-900/50 backdrop-blur-sm border border-red-500/20 rounded-xl hover:border-red-500/50 transition-all"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <feature.icon className="w-8 h-8 text-red-500 mb-2" />
                  <h4 className="text-sm font-bold text-white">{feature.title}</h4>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Floating Particles */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-red-500/50 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -40, 0],
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0]
          }}
          transition={{
            duration: 4 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 3
          }}
        />
      ))}
    </section>
  );
}
