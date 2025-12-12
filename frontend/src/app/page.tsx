"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Trophy,
  Users,
  Eye,
  ArrowRight,
  MapPin,
  Shield,
  Zap,
  Target,
  Star,
  TrendingUp,
  Award,
  ChevronRight,
  Clock,
} from "lucide-react";
import Hero from "@/components/home/Hero";
import Header from "@/components/layout/Header";
import Logo from "@/components/common/Logo";
import { useFeaturedTournaments } from "@/hooks/useTournaments";
import { cn, formatCurrency, formatDate, titleCase } from "@/utils";
import { useUpcomingTournaments, useGames } from "@/hooks/useTournaments";
import TournamentTable from "@/components/tournaments/TournamentTable";
import MatchSchedule from "@/components/esports/MatchSchedule";
import TournamentGames from "@/components/tournaments/TournamentGames";
import HexButton from "@/components/ui/HexButton";
import Footer from "@/components/layout/Footer";
import HowItWorks from "@/components/home/HowItWorks";
import WhyMetrix from "@/components/home/WhyMetrix";
import TopPlayers from "@/components/home/TopPlayers";
import BecomeSpectator from "@/components/home/BecomeSpectator";
import Community from "@/components/home/Community";
import FAQPreview from "@/components/home/FAQPreview";
import FeaturedCountdowns from "@/components/FeaturedCountdowns";

export default function HomePage() {
  // Animation variants for sections
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const scaleVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-900">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <Hero />

      {/* Featured Countdowns - NEW */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionVariants}
      >
        <FeaturedCountdowns maxItems={2} />
      </motion.div>

      {/* Tournament Games Section - Featured Tournaments */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionVariants}
      >
        <TournamentGames />
      </motion.div>

      {/* How It Works */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={scaleVariants}
      >
        <HowItWorks />
      </motion.div>

      {/* Why Metrix */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionVariants}
      >
        <WhyMetrix />
      </motion.div>

      {/* Top Players Leaderboard */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={scaleVariants}
      >
        <TopPlayers />
      </motion.div>

      {/* Become a Spectator */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionVariants}
      >
        <BecomeSpectator />
      </motion.div>

      {/* Community & Social */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={scaleVariants}
      >
        <Community />
      </motion.div>

      {/* FAQ Preview */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionVariants}
      >
        <FAQPreview />
      </motion.div>

      {/* Footer */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={{ 
          hidden: { opacity: 0, y: 30 },
          visible: { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.8, ease: "easeOut" }
          }
        }}
      >
        <Footer />
      </motion.div>
    </div>
  );
}
