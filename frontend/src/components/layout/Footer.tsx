"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Facebook, Twitter, Instagram, Linkedin, Youtube, ArrowRight } from "lucide-react";

export default function Footer() {
  const usefulLinks = [
    { name: "Gaming", href: "/gaming" },
    { name: "Latest News", href: "/news" },
    { name: "Our Gallery", href: "/gallery" },
    { name: "All Servers", href: "/servers" },
    { name: "All Players", href: "/players" },
    { name: "About Me", href: "/about" },
  ];

  const supportLinks = [
    { name: "Help & Support", href: "/support" },
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Our Blog", href: "/blog" },
    { name: "Game My Account", href: "/account" },
    { name: "Support", href: "/support" },
  ];

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Youtube, href: "#", label: "YouTube" },
  ];

  return (
    <footer className="relative bg-black light:bg-[#e8e8e8] overflow-hidden mt-[100px] pt-[100px] pb-[70px]">
      {/* Centered Footer Border Image Container */}
      <div className="relative z-10 w-[90%] mx-auto px-4">
        {/* Footer Border Image - 90% width with height */}
        <div className="relative min-h-[500px]">
          <div className="absolute inset-0 pointer-events-none -z-10">
            <Image
              src="/footer-border.png"
              alt=""
              fill
              className="object-fill"
              priority
            />
          </div>

          {/* Footer Content */}
          <div className="relative z-10 px-12 py-16 flex items-center justify-center min-h-[500px]">
            <div className="w-4/5 mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Brand Section */}
              <div className="lg:col-span-1">
                <Link href="/" className="inline-block mb-6">
                  <div className="flex items-center gap-3">
                    <Image src="/logo.png" alt="Metrix" width={50} height={50} />
                    <span className="text-3xl font-black text-white">Game</span>
                  </div>
                </Link>
                <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                  Beyond esports tournaments. Include a broader calendar of gaming events, conferences, and conventions.
                </p>
                <div>
                  <h3 className="text-white font-bold mb-4">
                    Follow <span className="text-red-500">With Us:</span>
                  </h3>
                  <div className="flex gap-3">
                    {socialLinks.map((social) => (
                      <motion.a
                        key={social.label}
                        href={social.href}
                        whileHover={{ scale: 1.1, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-10 h-10 bg-slate-800 hover:bg-red-600 rounded-lg flex items-center justify-center transition-colors"
                        aria-label={social.label}
                      >
                        <social.icon className="w-5 h-5 text-white" />
                      </motion.a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Useful Links */}
              <div>
                <h3 className="text-white text-xl font-black mb-6 relative inline-block">
                  Useful Link
                  <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-red-500" />
                </h3>
                <ul className="space-y-3">
                  {usefulLinks.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-gray-400 hover:text-red-500 transition-colors text-sm flex items-center gap-2 group"
                      >
                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Supports */}
              <div>
                <h3 className="text-white text-xl font-black mb-6 relative inline-block">
                  Supports
                  <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-red-500" />
                </h3>
                <ul className="space-y-3">
                  {supportLinks.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-gray-400 hover:text-red-500 transition-colors text-sm flex items-center gap-2 group"
                      >
                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Newsletter */}
              <div>
                <h3 className="text-white text-xl font-black mb-6 relative inline-block">
                  Newsletter
                  <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-red-500" />
                </h3>
                <p className="text-gray-400 text-sm mb-6">
                  Subscribe to our newsletter to get our latest update & news
                </p>
                <div className="relative mb-6">
                  <input
                    type="email"
                    placeholder="Email Address"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-red-500 transition-colors"
                  />
                  <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-red-600 hover:bg-red-700 p-2 rounded-md transition-colors">
                    <ArrowRight className="w-4 h-4 text-white" />
                  </button>
                </div>
                <div className="flex gap-3">
                  <a href="#" className="block">
                    <Image
                      src="/google-play.png"
                      alt="Google Play"
                      width={120}
                      height={40}
                      className="h-10 w-auto"
                    />
                  </a>
                  <a href="#" className="block">
                    <Image
                      src="/app-store.png"
                      alt="App Store"
                      width={120}
                      height={40}
                      className="h-10 w-auto"
                    />
                  </a>
                </div>
              </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="relative z-10 border-t border-slate-800/50 mt-8">
        <div className="w-[90%] mx-auto px-4 py-6">
          <p className="text-center text-gray-500 text-sm">
            Copyright © 2024 <span className="text-red-500 font-semibold">Metrix</span>. All Rights Reserved.
          </p>
        </div>
      </div>

      {/* Scroll to Top Button - Hexagonal */}
      <motion.button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        whileHover={{ scale: 1.1, y: -2 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center shadow-2xl shadow-red-600/50 z-50 transition-all group"
        style={{
          clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)'
        }}
        aria-label="Scroll to top"
      >
        {/* Glow effect */}
        <div className="absolute inset-0 bg-red-500/50 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
        
        {/* Polygonal Chevron Icon */}
        <svg
          className="w-7 h-7 text-white relative z-10"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          {/* Upward pointing chevron made of polygons */}
          <polygon points="12,6 16,10 14,10 12,8 10,10 8,10" />
          <polygon points="12,10 16,14 14,14 12,12 10,14 8,14" />
          <polygon points="12,14 16,18 14,18 12,16 10,18 8,18" />
        </svg>
      </motion.button>

      {/* Custom Scrollbar Styles */}
      <style jsx global>{`
        /* Custom Cursor */
        * {
          cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><polygon points="12,2 16,8 22,10 16,12 12,18 8,12 2,10 8,8" fill="%23ef4444" stroke="%23ffffff" stroke-width="1"/></svg>') 12 12, auto;
        }

        a, button, input[type="submit"], [role="button"] {
          cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28"><polygon points="14,2 18,9 26,12 18,15 14,22 10,15 2,12 10,9" fill="%23dc2626" stroke="%23ffffff" stroke-width="1.5"/><circle cx="14" cy="12" r="3" fill="%23ffffff"/></svg>') 14 14, pointer;
        }

        /* Custom Scrollbar */
        ::-webkit-scrollbar {
          width: 20px;
        }

        ::-webkit-scrollbar-track {
          background: #000000;
          border-left: 2px solid #1f2937;
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #ef4444 0%, #dc2626 50%, #b91c1c 100%);
          border: 1px solid #ef4444;
          clip-path: polygon(
            50% 0%, 
            60% 5%, 
            100% 5%, 
            95% 15%, 
            100% 25%, 
            95% 35%, 
            100% 45%, 
            95% 55%, 
            100% 65%, 
            95% 75%, 
            100% 85%, 
            95% 95%, 
            60% 95%, 
            50% 100%, 
            40% 95%, 
            5% 95%, 
            0% 85%, 
            5% 75%, 
            0% 65%, 
            5% 55%, 
            0% 45%, 
            5% 35%, 
            0% 25%, 
            5% 15%, 
            0% 5%, 
            40% 5%
          );
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #dc2626 0%, #b91c1c 50%, #991b1b 100%);
          border-color: #dc2626;
          box-shadow: 0 0 15px rgba(239, 68, 68, 0.8), inset 0 0 10px rgba(255, 255, 255, 0.1);
        }

        /* Firefox */
        * {
          scrollbar-width: thin;
          scrollbar-color: #ef4444 #000000;
        }
      `}</style>
    </footer>
  );
}
