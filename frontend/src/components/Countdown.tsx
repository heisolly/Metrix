"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock } from "lucide-react";

interface CountdownProps {
  targetDate: string | Date;
  title?: string;
  onComplete?: () => void;
  variant?: 'default' | 'neon' | 'fire' | 'ice';
}

export default function Countdown({ targetDate, title, onComplete, variant = 'fire' }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const difference = +new Date(targetDate) - +new Date();
    
    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);

      if (newTimeLeft.days === 0 && newTimeLeft.hours === 0 && newTimeLeft.minutes === 0 && newTimeLeft.seconds === 0) {
        onComplete?.();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate, onComplete]);

  const getColors = () => {
    switch (variant) {
      case 'neon':
        return { primary: '#ec4899', secondary: '#a855f7' };
      case 'fire':
        return { primary: '#f97316', secondary: '#ef4444' };
      case 'ice':
        return { primary: '#06b6d4', secondary: '#3b82f6' };
      default:
        return { primary: '#f97316', secondary: '#ef4444' };
    }
  };

  const colors = getColors();

  const TimeUnit = ({ value, label }: { value: number; label: string }) => {
    const digits = value.toString().padStart(2, '0').split('');
    
    return (
      <div className="flex flex-col items-center gap-2">
        <div className="flex gap-1">
          {digits.map((digit, idx) => (
            <div
              key={idx}
              className="relative w-16 h-20 md:w-20 md:h-28 bg-slate-900 rounded-lg border border-white/10 flex items-center justify-center overflow-hidden"
              style={{
                boxShadow: `0 0 20px ${colors.primary}40`,
              }}
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={digit}
                  initial={{ y: -30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 30, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-4xl md:text-5xl font-black text-white"
                  style={{
                    fontFamily: '"Orbitron", monospace',
                    textShadow: `0 0 20px ${colors.primary}`,
                  }}
                >
                  {digit}
                </motion.span>
              </AnimatePresence>
              
              {/* Divider line */}
              <div 
                className="absolute left-0 right-0 top-1/2 h-[1px] bg-white/10"
                style={{ transform: 'translateY(-0.5px)' }}
              />
            </div>
          ))}
        </div>
        <span className="text-xs md:text-sm font-bold text-white/60 uppercase tracking-widest">
          {label}
        </span>
      </div>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 md:p-8 bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-white/10">
      {title && (
        <div className="flex items-center justify-center gap-3 mb-8">
          <Clock className="w-6 h-6 text-white/80" />
          <h3 className="text-xl md:text-2xl font-bold text-white uppercase tracking-wide">
            {title}
          </h3>
        </div>
      )}

      <div className="flex justify-center items-center gap-4 md:gap-6">
        {timeLeft.days > 0 && (
          <>
            <TimeUnit value={timeLeft.days} label="Days" />
            <span className="text-3xl font-bold text-white/40 mb-6">:</span>
          </>
        )}
        
        <TimeUnit value={timeLeft.hours} label="Hours" />
        <span className="text-3xl font-bold text-white/40 mb-6">:</span>
        
        <TimeUnit value={timeLeft.minutes} label="Minutes" />
        <span className="text-3xl font-bold text-white/40 mb-6">:</span>
        
        <TimeUnit value={timeLeft.seconds} label="Seconds" />
      </div>

      {/* Bottom accent */}
      <motion.div
        className="mt-6 h-1 w-full rounded-full"
        style={{
          background: `linear-gradient(90deg, {colors.secondary}, {colors.primary}, ${colors.secondary})`,
        }}
        animate={{
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
        }}
      />
    </div>
  );
}

// Preset variants
export function TournamentCountdown({ targetDate, title }: { targetDate: string | Date; title?: string }) {
  return <Countdown targetDate={targetDate} title={title} variant="fire" />;
}

export function MatchCountdown({ targetDate, title }: { targetDate: string | Date; title?: string }) {
  return <Countdown targetDate={targetDate} title={title} variant="neon" />;
}

export function EventCountdown({ targetDate, title }: { targetDate: string | Date; title?: string }) {
  return <Countdown targetDate={targetDate} title={title} variant="ice" />;
}
