"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Search, Menu, X, User, ChevronDown, Play } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import HexButton from "@/components/ui/HexButton";
import ThemeToggle from "@/components/ui/ThemeToggle";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHovered, setIsHovered] = useState<number | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const navLinks = [
    { 
      href: "/", 
      label: "HOME"
    },
    { 
      href: "/news", 
      label: "NEWS"
    },
    { 
      href: "/contact", 
      label: "CONTACT"
    },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b {
        isScrolled 
          ? 'bg-[#0a0e17]/98 light:bg-[#f5f5f5]/98 backdrop-blur-xl shadow-2xl shadow-red-500/5 light:shadow-gray-300 border-red-500/20 light:border-gray-300' 
          : 'bg-gradient-to-b from-[#0a0e17]/95 via-[#0a0e17]/90 to-transparent light:from-[#f5f5f5]/95 light:via-[#f5f5f5]/90 light:to-transparent border-transparent'
      }`}
    >
      {/* Top accent line with animated glow */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-red-500 to-transparent">
        <motion.div
          className="h-full w-32 bg-gradient-to-r from-transparent via-red-400 to-transparent blur-sm"
          animate={{ x: ['-100%', '1000%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear", repeatDelay: 2 }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center group relative z-10">
            <motion.div 
              className="relative flex items-center gap-3"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Logo Image */}
              <div className="relative w-12 h-12">
                <div className="absolute inset-0 bg-red-500/20 rounded-lg blur-md group-hover:bg-red-500/30 transition-all" />
                <Image
                  src="/logo.png"
                  alt="Metrix"
                  width={48}
                  height={48}
                  className="relative z-10 drop-shadow-2xl"
                  priority
                />
              </div>
              
              {/* Logo Text */}
              <div className="hidden sm:block">
                <span className="text-2xl font-black text-white light:text-gray-900 tracking-tight">
                  METRIX
                </span>
                <div className="h-[2px] w-full bg-gradient-to-r from-red-500 to-transparent" />
              </div>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link, index) => (
              <div 
                key={link.href} 
                className="relative group"
                onMouseEnter={() => setIsHovered(index)}
                onMouseLeave={() => setIsHovered(null)}
              >
                <Link
                  href={link.href}
                  className={`relative px-5 py-3 text-[13px] font-bold tracking-wide transition-all duration-300 flex items-center gap-1.5 {
                    isActive(link.href) 
                      ? 'text-red-400 light:text-red-600' 
                      : 'text-gray-300 light:text-gray-700 hover:text-white light:hover:text-gray-900'
                  }`}
                >
                  {/* Hover background effect */}
                  <span className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/10 to-red-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
                  
                  <span className="relative z-10">{link.label}</span>
                </Link>
                
                {/* Active indicator with glow */}
                {isActive(link.href) && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2"
                  >
                    <div className="w-12 h-[3px] bg-gradient-to-r from-red-500 to-orange-500 rounded-full" />
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 blur-md opacity-50" />
                  </motion.div>
                )}
              </div>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            
            {/* Search Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className={`p-2.5 rounded-lg transition-all duration-300 {
                isSearchOpen 
                  ? 'bg-red-500/20 text-red-400 border border-red-500/50' 
                  : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-transparent'
              }`}
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </motion.button>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Divider */}
            <div className="hidden md:block h-8 w-[1px] bg-gradient-to-b from-transparent via-gray-700 to-transparent" />
            
            {/* Join Tournaments Button - Prompts Sign In */}
            <div className="hidden xl:block">
              <HexButton
                href="/signin"
                variant="solid"
                icon={Play}
                iconPosition="left"
                size="sm"
              >
                Join Tournaments
              </HexButton>
            </div>

            {/* Sign In Button */}
            <Link href="/signin">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-600 text-white text-sm font-bold tracking-wide rounded-lg shadow-lg shadow-green-500/20 transition-all duration-300 relative overflow-hidden group"
                style={{
                  clipPath: 'polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%)'
                }}
              >
                {/* Shine effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.6 }}
                />
                
                <User className="w-4 h-4 relative z-10" />
                <span className="relative z-10">SIGN IN</span>
              </motion.button>
            </Link>
            
            {/* Mobile Menu Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="lg:hidden p-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-all duration-300 border border-gray-700/50"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait">
                {isMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="w-6 h-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="w-6 h-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Search Bar Expanded */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden border-t border-red-500/10 bg-gradient-to-b from-red-500/5 to-transparent"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
              <div className="relative max-w-2xl mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-red-400" />
                <input
                  type="text"
                  placeholder="Search tournaments, games, players..."
                  className="w-full pl-12 pr-4 py-4 bg-[#0f1419] border-2 border-red-500/30 focus:border-red-500 rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all duration-300 shadow-lg shadow-red-500/5"
                  autoFocus
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 px-3 py-1 bg-red-500/20 border border-red-500/30 rounded-md">
                  <span className="text-xs font-bold text-red-400">ESC</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden overflow-hidden border-t border-red-500/10 bg-gradient-to-b from-[#0f1419] to-[#0a0e17]"
          >
            <div className="px-4 pt-4 pb-6 space-y-2">
              {navLinks.map((link, index) => (
                <motion.div 
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    href={link.href}
                    className={`block px-4 py-3 rounded-lg text-base font-bold transition-all duration-300 ${
                      isActive(link.href)
                        ? 'bg-gradient-to-r from-red-500/20 to-orange-500/20 text-red-400 border border-red-500/30'
                        : 'text-gray-300 hover:bg-white/5 hover:text-white'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span>{link.label}</span>
                  </Link>
                </motion.div>
              ))}
              
              <div className="pt-4 space-y-3 border-t border-red-500/10">
                <Link href="/signin">
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white font-bold rounded-lg shadow-lg"
                    style={{
                      clipPath: 'polygon(5% 0%, 100% 0%, 95% 100%, 0% 100%)'
                    }}
                  >
                    <Play className="w-4 h-4" fill="white" />
                    JOIN TOURNAMENTS
                  </motion.button>
                </Link>
                
                <Link href="/signin">
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white font-bold rounded-lg shadow-lg"
                    style={{
                      clipPath: 'polygon(5% 0%, 100% 0%, 95% 100%, 0% 100%)'
                    }}
                  >
                    <User className="w-4 h-4" />
                    SIGN IN
                  </motion.button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
