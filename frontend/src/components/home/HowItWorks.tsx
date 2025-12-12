"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { UserPlus, Gamepad2, Trophy, Banknote, CheckCircle } from "lucide-react";
import { useRef } from "react";

export default function HowItWorks() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);

  const steps = [
    {
      id: 1,
      title: "STEP 1",
      icon: UserPlus,
      heading: "Create Account",
      features: [
        "Sign up in seconds",
        "No hidden fees",
        "Email verification",
        "Secure authentication"
      ],
      color: "#ef4444"
    },
    {
      id: 2,
      title: "STEP 2",
      icon: Gamepad2,
      heading: "Join Tournament",
      features: [
        "Browse tournaments",
        "Pick your game",
        "Pay entry fee",
        "Get match details"
      ],
      color: "#f97316"
    },
    {
      id: 3,
      title: "STEP 3",
      icon: Trophy,
      heading: "Play & Win",
      features: [
        "Compete with players",
        "Show your skills",
        "Climb leaderboard",
        "Verified by spectators"
      ],
      color: "#eab308"
    },
    {
      id: 4,
      title: "STEP 4",
      icon: Banknote,
      heading: "Get Paid",
      features: [
        "Win prize money",
        "Fast withdrawals",
        "Direct bank transfer",
        "Paid in Naira"
      ],
      color: "#22c55e"
    }
  ];

  return (
    <section ref={containerRef} className="relative py-32 px-4 bg-gradient-to-b from-black via-slate-950 to-black overflow-hidden">
      {/* Animated Background Grid */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute inset-0 opacity-10"
          animate={{
            backgroundPosition: ['0px 0px', '60px 60px'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            backgroundImage: 'linear-gradient(rgba(239,68,68,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(239,68,68,0.3) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            style={{ y, opacity }}
            className="relative"
          >
            {/* Section Header */}
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-6xl md:text-7xl font-black text-white mb-6 leading-none">
                A LOOK INTO
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500">
                  HOW METRIX
                </span>
                <br />
                WORKS
              </h2>
            </motion.div>

            <motion.p
              className="text-gray-400 text-lg leading-relaxed mb-8 max-w-md"
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              With our streamlined process, join tournaments, compete with the best, and earn real money. Simple, secure, and rewarding.
            </motion.p>

            {/* CTA Button */}
            <motion.button
              className="px-8 py-4 bg-gradient-to-r from-red-600 to-orange-600 text-white font-black text-lg"
              style={{
                clipPath: 'polygon(20px 0%, calc(100% - 20px) 0%, 100% 50%, calc(100% - 20px) 100%, 20px 100%, 0% 50%)'
              }}
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(239, 68, 68, 0.5)" }}
              whileTap={{ scale: 0.95 }}
            >
              GET STARTED
            </motion.button>

            {/* 3D Animated Image */}
            <motion.div
              className="mt-12 relative w-full max-w-md mx-auto lg:mx-0 h-96"
              animate={{
                y: [0, -20, 0],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {/* Glow Effect */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-br from-red-600/40 to-orange-600/40 blur-3xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity
                }}
              />
              
              {/* Image Container */}
              <div className="relative w-full h-full">
                <motion.div
                  className="absolute inset-0"
                  style={{
                    transformStyle: "preserve-3d",
                    perspective: "1000px"
                  }}
                  animate={{
                    rotateY: [-5, 5, -5],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <img
                    src="/about.png"
                    alt="Metrix Gaming"
                    className="w-full h-full object-contain opacity-80 hover:opacity-100 transition-opacity duration-500"
                  />
                  
                  {/* Red Overlay Fade */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-red-600/20 via-transparent to-orange-600/20 mix-blend-overlay" />
                  
                  {/* Border Glow */}
                  <div className="absolute inset-0 border-2 border-red-600/30 blur-sm" />
                </motion.div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Steps - Roadmap Style */}
          <div className="relative">
            {/* Vertical Timeline */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-red-500 via-orange-500 via-yellow-500 to-green-500" />

            <div className="space-y-8 pl-12">
              {steps.map((step, index) => (
                <motion.div
                  key={step.id}
                  className="relative"
                  initial={{ opacity: 0, x: 100 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                >
                  {/* Timeline Dot */}
                  <motion.div
                    className="absolute -left-12 top-4 w-6 h-6 rounded-full border-4 border-black"
                    style={{ backgroundColor: step.color }}
                    animate={{
                      scale: [1, 1.3, 1],
                      boxShadow: [
                        `0 0 0px ${step.color}`,
                        `0 0 20px ${step.color}`,
                        `0 0 0px ${step.color}`
                      ]
                    }}
                    transition={{
                      duration: 2,
                      delay: index * 0.5,
                      repeat: Infinity
                    }}
                  />

                  {/* Step Card */}
                  <motion.div
                    className="relative bg-slate-900/50 backdrop-blur-sm border-2 border-slate-800 p-6 group hover:border-red-600/50 transition-all duration-500"
                    style={{
                      clipPath: 'polygon(20px 0%, calc(100% - 20px) 0%, 100% 20px, 100% calc(100% - 20px), calc(100% - 20px) 100%, 20px 100%, 0% calc(100% - 20px), 0% 20px)',
                      transformStyle: "preserve-3d"
                    }}
                    whileHover={{
                      scale: 1.02,
                      rotateY: 5,
                      z: 50
                    }}
                  >
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-4">
                      <motion.div
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{
                          background: `linear-gradient(135deg, {step.color}, ${step.color}dd)`
                        }}
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        <step.icon className="w-6 h-6 text-white" />
                      </motion.div>
                      <div>
                        <div className="text-xs font-black text-gray-500">{step.title}</div>
                        <div className="text-xl font-black text-white">{step.heading}</div>
                      </div>
                    </div>

                    {/* Features List */}
                    <div className="space-y-2">
                      {step.features.map((feature, i) => (
                        <motion.div
                          key={i}
                          className="flex items-center gap-2"
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.2 + i * 0.1 }}
                        >
                          <div 
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: step.color }}
                          />
                          <span className="text-sm text-gray-400">{feature}</span>
                        </motion.div>
                      ))}
                    </div>

                    {/* Hover Glow */}
                    <div 
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl pointer-events-none"
                      style={{
                        background: `radial-gradient(circle at center, ${step.color}20, transparent)`
                      }}
                    />
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-red-500 rounded-full"
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
    </section>
  );
}
