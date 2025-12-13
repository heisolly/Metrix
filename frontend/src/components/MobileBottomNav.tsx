"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Trophy,
  Calendar,
  Wallet,
  User,
} from "lucide-react";

export default function MobileBottomNav() {
  const pathname = usePathname();

  const navItems = [
    { icon: LayoutDashboard, label: "Overview", href: "/dashboard/overview" },
    { icon: Trophy, label: "Tournaments", href: "/dashboard/tournaments" },
    { icon: Calendar, label: "Matches", href: "/dashboard/matches" },
    { icon: Wallet, label: "Wallet", href: "/dashboard/wallet" },
    { icon: User, label: "Profile", href: "/dashboard/profile" },
  ];

  return (
    <div className="lg:hidden fixed bottom-5 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      <nav className="pointer-events-auto w-full max-w-sm bg-[#0A0A0A]/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl shadow-black/50 overflow-hidden ring-1 ring-white/5">
        <div className="grid grid-cols-5 h-16">
          {navItems.map((item) => {
            const isActive = pathname?.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative flex flex-col items-center justify-center gap-1 transition-all h-full group"
              >
                {/* Active Indicator - Glow effect top */}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-red-500 to-orange-500 rounded-b-full shadow-[0_2px_10px_rgba(239,68,68,0.5)]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}

                {/* Icon */}
                <div className="relative">
                  <Icon
                    className={`w-5 h-5 transition-colors duration-200 ${
                      isActive
                        ? "text-red-500"
                        : "text-white/40 group-hover:text-white/60"
                    }`}
                  />
                  {isActive && (
                     <motion.div
                       layoutId="activeGlow"
                       className="absolute inset-0 bg-red-600/20 blur-xl rounded-full"
                       transition={{ duration: 0.3 }}
                     />
                  )}
                </div>

                {/* Label */}
                <span
                  className={`text-[10px] font-bold transition-colors duration-200 ${
                    isActive
                      ? "text-white"
                      : "text-white/30 group-hover:text-white/50"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
