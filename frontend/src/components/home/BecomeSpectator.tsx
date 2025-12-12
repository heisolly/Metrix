"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Eye, CheckCircle, Banknote, Clock } from "lucide-react";
import HexButton from "@/components/ui/HexButton";

export default function BecomeSpectator() {
  const benefits = [
    "Earn money by verifying match results",
    "Flexible schedule - work whenever you want",
    "No gaming skills required",
    "Get paid in Naira directly to your account"
  ];

  return (
    <section className="relative py-24 px-4 bg-gradient-to-br from-slate-950 via-black to-red-950/20 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(239, 68, 68, 0.4) 1px, transparent 1px)',
            backgroundSize: '30px 30px',
          }}
        />
        <motion.div
          className="absolute top-20 right-20 w-96 h-96 bg-red-600/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 5, repeat: Infinity }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
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
              <Eye className="w-4 h-4" />
              Join Our Team
            </motion.div>

            <h2 className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight">
              Become a Metrix <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">Spectator</span>
            </h2>

            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
              Help us maintain fair play and earn money while doing it. Join our community of spectators who verify tournament matches and ensure integrity.
            </p>

            {/* Benefits List */}
            <div className="space-y-4 mb-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit}
                  className="flex items-start gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mt-0.5">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-gray-300 text-base">{benefit}</p>
                </motion.div>
              ))}
            </div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7 }}
            >
              <Link href="/spectator">
                <HexButton variant="solid" size="lg" icon={Eye} iconPosition="right">
                  Apply Now
                </HexButton>
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Visual Cards */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Earnings Card */}
            <motion.div
              className="relative bg-gradient-to-br from-green-600/20 to-emerald-600/20 backdrop-blur-sm border-2 border-green-600/30 p-8"
              style={{
                clipPath: 'polygon(30px 0%, calc(100% - 30px) 0%, 100% 30px, 100% calc(100% - 30px), calc(100% - 30px) 100%, 30px 100%, 0% calc(100% - 30px), 0% 30px)'
              }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                  <Banknote className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-sm text-green-400">Average Monthly Earnings</div>
                  <div className="text-3xl font-black text-white">₦45,000</div>
                </div>
              </div>
              <p className="text-gray-400 text-sm">
                Top spectators earn even more by verifying more matches
              </p>
            </motion.div>

            {/* Flexibility Card */}
            <motion.div
              className="relative bg-gradient-to-br from-orange-600/20 to-red-600/20 backdrop-blur-sm border-2 border-orange-600/30 p-8"
              style={{
                clipPath: 'polygon(30px 0%, calc(100% - 30px) 0%, 100% 30px, 100% calc(100% - 30px), calc(100% - 30px) 100%, 30px 100%, 0% calc(100% - 30px), 0% 30px)'
              }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-sm text-orange-400">Work Hours</div>
                  <div className="text-3xl font-black text-white">Flexible</div>
                </div>
              </div>
              <p className="text-gray-400 text-sm">
                Choose your own hours and work as much or as little as you want
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
