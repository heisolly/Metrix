"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface HexButtonProps {
  children: ReactNode;
  variant?: "solid" | "outline";
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
  onClick?: () => void;
  href?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function HexButton({
  children,
  variant = "solid",
  icon: Icon,
  iconPosition = "left",
  onClick,
  href,
  className = "",
  size = "md",
}: HexButtonProps) {
  const sizes = {
    sm: "px-6 py-2 text-sm",
    md: "px-8 py-3 text-base",
    lg: "px-10 py-4 text-lg",
  };

  const Component = href ? motion.a : motion.button;
  const componentProps = href ? { href } : { onClick };

  return (
    <Component
      {...componentProps}
      className={`group relative inline-flex items-center justify-center gap-2 font-black uppercase tracking-wider overflow-hidden {sizes[size]} ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Hexagonal Background */}
      <div
        className={`absolute inset-0 transition-all duration-300 {
          variant === "solid"
            ? "bg-gradient-to-r from-red-600 to-red-700 group-hover:from-red-500 group-hover:to-red-600"
            : "bg-black border-2 border-red-600 group-hover:bg-red-900/20"
        }`}
        style={{
          clipPath: "polygon(8% 0%, 92% 0%, 100% 50%, 92% 100%, 8% 100%, 0% 50%)",
        }}
      />

      {/* Glow Effect */}
      {variant === "solid" && (
        <div
          className="absolute -inset-1 bg-gradient-to-r from-red-600 to-orange-600 blur-lg opacity-75 group-hover:opacity-100 transition-opacity"
          style={{
            clipPath: "polygon(8% 0%, 92% 0%, 100% 50%, 92% 100%, 8% 100%, 0% 50%)",
          }}
        />
      )}

      {/* Shine Effect on Hover */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        initial={{ x: "-100%" }}
        whileHover={{ x: "100%" }}
        transition={{ duration: 0.6 }}
        style={{
          clipPath: "polygon(8% 0%, 92% 0%, 100% 50%, 92% 100%, 8% 100%, 0% 50%)",
        }}
      />

      {/* Content */}
      <span className="relative z-10 flex items-center gap-2 text-white">
        {Icon && iconPosition === "left" && <Icon className="w-5 h-5" fill={variant === "solid" ? "currentColor" : "none"} />}
        {children}
        {Icon && iconPosition === "right" && (
          <motion.div
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Icon className="w-5 h-5" />
          </motion.div>
        )}
      </span>
    </Component>
  );
}
