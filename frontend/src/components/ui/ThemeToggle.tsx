"use client";

import { motion } from "framer-motion";
import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const themes = [
    { value: "dark" as const, label: "Dark", icon: Moon },
    { value: "light" as const, label: "Light", icon: Sun },
    { value: "system" as const, label: "System", icon: Monitor },
  ];

  const currentTheme = themes.find(t => t.value === theme) || themes[0];

  return (
    <div className="relative">
      {/* Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="p-3 bg-slate-800 dark:bg-slate-800 light:bg-white border-2 border-slate-700 dark:border-slate-700 light:border-gray-300 rounded-xl hover:border-red-500/50 transition-all duration-300"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <currentTheme.icon className="w-5 h-5 text-white dark:text-white light:text-gray-800" />
      </motion.button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />

          {/* Menu */}
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute right-0 mt-2 w-48 bg-slate-900 dark:bg-slate-900 light:bg-white border-2 border-slate-700 dark:border-slate-700 light:border-gray-300 rounded-xl shadow-xl z-50 overflow-hidden"
          >
            {themes.map((themeOption) => (
              <motion.button
                key={themeOption.value}
                onClick={() => {
                  setTheme(themeOption.value);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-3 flex items-center gap-3 transition-all duration-200 {
                  theme === themeOption.value
                    ? "bg-red-600 text-white"
                    : "text-gray-300 dark:text-gray-300 light:text-gray-700 hover:bg-slate-800 dark:hover:bg-slate-800 light:hover:bg-gray-100"
                }`}
                whileHover={{ x: 5 }}
              >
                <themeOption.icon className="w-5 h-5" />
                <span className="font-semibold">{themeOption.label}</span>
                {theme === themeOption.value && (
                  <motion.div
                    layoutId="activeTheme"
                    className="ml-auto w-2 h-2 bg-white rounded-full"
                  />
                )}
              </motion.button>
            ))}
          </motion.div>
        </>
      )}
    </div>
  );
}
