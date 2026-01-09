"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { 
  Mail, 
  Lock,
  ArrowRight,
  Shield,
  Zap,
  Trophy,
  Chrome,
  Check,
  Eye,
  EyeOff
} from "lucide-react";
import { signIn, signInWithGoogle } from "@/lib/auth";

export default function SignInPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);
    
    try {
      await signIn(formData);
      setSuccess("Welcome back!");
      
      // Redirect to dashboard immediately
      router.push("/dashboard/overview");
    } catch (err: any) {
      setError(err.message || "Invalid email or password. Please try again.");
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (err: any) {
      setError(err.message || "Failed to sign in with Google");
    }
  };

  return (
    <div className="min-h-screen bg-black light:bg-[#f5f5f5] flex items-center justify-center p-4 overflow-hidden relative">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-slate-950 to-black light:from-[#f5f5f5] light:via-white light:to-[#e8e8e8]" />
        
        {/* Animated circles */}
        <motion.div
          className="absolute top-20 left-20 w-72 h-72 bg-red-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-96 h-96 bg-red-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-red-500 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -50, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 5 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-5xl">
        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-12 items-center">
          {/* Left Side - Branding */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="hidden lg:block space-y-8"
          >
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="inline-block"
            >
              <div className="flex items-center gap-3">
                <div className="relative w-14 h-14">
                  <motion.div
                    className="absolute inset-0 bg-red-500/30 rounded-xl blur-xl"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 0.8, 0.5],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                    }}
                  />
                  <Image
                    src="/logo.png"
                    alt="Metrix"
                    width={56}
                    height={56}
                    className="relative z-10"
                  />
                </div>
                <div>
                  <h1 className="text-3xl font-black text-white light:text-black">
                    METRIX
                  </h1>
                  <motion.div
                    className="h-1 bg-red-500 mt-1"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                  />
                </div>
              </div>
            </motion.div>

            {/* Welcome Text */}
            <div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-5xl font-black text-white light:text-black mb-4 leading-tight"
              >
                WELCOME TO
                <br />
                THE <span className="text-red-500">ARENA</span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-lg text-white light:text-black leading-relaxed"
              >
                Join thousands of gamers competing in tournaments, earning rewards, and dominating the leaderboards.
              </motion.p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { value: "50K+", label: "Players" },
                { value: "1000+", label: "Tournaments" },
                { value: "2M+", label: "Prizes" }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="text-center p-4 bg-white/5 light:bg-black/5 rounded-xl border border-white/10 light:border-black/10"
                >
                  <div className="text-2xl font-black text-red-500 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm font-bold text-white light:text-black">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Features */}
            <div className="space-y-3">
              {[
                { icon: Trophy, text: "Exclusive tournaments" },
                { icon: Zap, text: "Instant payouts" },
                { icon: Shield, text: "Secure platform" }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex items-center gap-3 group"
                >
                  <div className="w-10 h-10 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center justify-center group-hover:bg-red-500/20 transition-all">
                    <feature.icon className="w-5 h-5 text-red-500" />
                  </div>
                  <span className="font-bold text-white light:text-black">
                    {feature.text}
                  </span>
                  <Check className="w-4 h-4 text-red-500 ml-auto" />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Side - Sign In Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative bg-black/40 light:bg-white/90 backdrop-blur-2xl border-2 border-white/10 light:border-black/10 rounded-3xl p-8 md:p-10 shadow-2xl">
              {/* Decorative corner accents */}
              <div className="absolute top-0 left-0 w-20 h-20 border-t-4 border-l-4 border-red-500 rounded-tl-3xl" />
              <div className="absolute bottom-0 right-0 w-20 h-20 border-b-4 border-r-4 border-red-500 rounded-br-3xl" />

              {/* Mobile Logo */}
              <div className="lg:hidden mb-8 text-center">
                <div className="inline-flex items-center gap-3">
                  <Image src="/logo.png" alt="Metrix" width={40} height={40} />
                  <h1 className="text-2xl font-black text-white light:text-black">
                    METRIX
                  </h1>
                </div>
              </div>

              <div className="relative">
                {/* Title */}
                <div className="text-center mb-8">
                  <h3 className="text-3xl font-black text-white light:text-black mb-2">
                    SIGN IN
                  </h3>
                  <p className="text-white light:text-black">
                    Welcome back! Enter your credentials to continue
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Success/Error Messages */}
                  {success && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-green-500 text-sm font-bold text-center"
                    >
                      {success}
                    </motion.div>
                  )}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-500 text-sm font-bold text-center"
                    >
                      {error}
                    </motion.div>
                  )}

                  {/* Email Input */}
                  <div>
                    <label className="block text-sm font-bold text-white light:text-black mb-3">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="your.email@example.com"
                        className="w-full pl-12 pr-4 py-4 bg-white/5 light:bg-black/5 border-2 border-white/20 light:border-black/20 rounded-xl text-white light:text-black placeholder-gray-500 focus:border-red-500 focus:outline-none transition-all font-medium text-lg"
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div>
                    <label className="block text-sm font-bold text-white light:text-black mb-3">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        placeholder="Enter your password"
                        className="w-full pl-12 pr-12 py-4 bg-white/5 light:bg-black/5 border-2 border-white/20 light:border-black/20 rounded-xl text-white light:text-black placeholder-gray-500 focus:border-red-500 focus:outline-none transition-all font-medium text-lg"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-red-500 transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Remember & Forgot */}
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        className="w-5 h-5 rounded border-2 border-white/20 light:border-black/20 bg-white/5 light:bg-black/5 checked:bg-red-500 checked:border-red-500 focus:ring-2 focus:ring-red-500 focus:ring-offset-0 transition-all"
                      />
                      <span className="text-sm font-medium text-white light:text-black group-hover:text-red-500 transition-colors">
                        Remember me
                      </span>
                    </label>
                    <Link
                      href="/forgot-password"
                      className="text-sm font-bold text-red-500 hover:text-red-400 transition-colors"
                    >
                      Forgot Password?
                    </Link>
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="relative w-full group overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-500 rounded-xl" />
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 rounded-xl"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                    
                    <div className="relative px-8 py-4 flex items-center justify-center gap-3">
                      {isLoading ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                          />
                          <span className="text-white font-bold text-lg">SIGNING IN...</span>
                        </>
                      ) : (
                        <>
                          <span className="text-white font-bold text-lg">SIGN IN</span>
                          <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </div>
                  </motion.button>

                  {/* Divider */}
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-white/20 light:border-black/20" />
                    </div>
                    <div className="relative flex justify-center">
                      <span className="px-4 bg-black/40 light:bg-white/90 text-sm font-bold text-white light:text-black">
                        OR
                      </span>
                    </div>
                  </div>

                  {/* Google Login */}
                  <motion.button
                    type="button"
                    onClick={handleGoogleSignIn}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white/5 light:bg-black/5 border-2 border-white/20 light:border-black/20 rounded-xl hover:border-red-500/50 transition-all group"
                  >
                    <Chrome className="w-5 h-5 text-white light:text-black group-hover:text-red-500 transition-colors" />
                    <span className="font-bold text-white light:text-black group-hover:text-red-500 transition-colors">
                      Continue with Google
                    </span>
                  </motion.button>

                  {/* Sign Up Link */}
                  <div className="text-center pt-4">
                    <p className="text-white light:text-black">
                      Don't have an account?{" "}
                      <Link
                        href="/signup"
                        className="font-bold text-red-500 hover:text-red-400 transition-colors"
                      >
                        Sign Up
                      </Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
