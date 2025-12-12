"use client";

import { motion } from "framer-motion";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
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
  EyeOff,
  User,
  Gift
} from "lucide-react";
import { signUp, signInWithGoogle } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

function SignUpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    referralCode: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Capture referral code from URL
  useEffect(() => {
    const refCode = searchParams.get("ref");
    if (refCode) {
      setFormData(prev => ({ ...prev, referralCode: refCode }));
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);
    
    try {
      // Validate passwords match
      if (formData.password !== formData.confirmPassword) {
        throw new Error("Passwords do not match");
      }

      // Validate password strength
      if (formData.password.length < 8) {
        throw new Error("Password must be at least 8 characters");
      }

      // Sign up
      const { user } = await signUp({
        email: formData.email,
        password: formData.password,
        username: formData.username,
      });

      if (!user) throw new Error("Registration failed");

      // Create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          username: formData.username,
          email: formData.email,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (profileError) {
        console.error("Profile creation error:", profileError);
      }

      // Process referral code if present
      if (formData.referralCode) {
        try {
          console.log("🎁 Processing referral code:", formData.referralCode);
          
          // Find referrer by referral code
          const { data: referrer, error: referrerError } = await supabase
            .from('profiles')
            .select('id, username, referral_code')
            .eq('referral_code', formData.referralCode)
            .single();

          if (referrerError) {
            console.error("❌ Error finding referrer:", referrerError);
          }

          if (referrer && !referrerError) {
            console.log("✅ Found referrer:", referrer.username, "ID:", referrer.id);
            
            // Create referral record
            const { data: referralData, error: referralError } = await supabase
              .from('referrals')
              .insert({
                referrer_id: referrer.id,
                referred_id: user.id,
                referral_code: formData.referralCode, // ✅ IMPORTANT: Include this field
                status: 'pending',
                bonus_amount: 500
              })
              .select();

            if (referralError) {
              console.error("❌ Referral creation error:", referralError);
              console.error("Full error details:", JSON.stringify(referralError, null, 2));
            } else {
              console.log("✅ Referral created successfully:", referralData);
              
              // Update referrer's total_referrals count
              const { data: currentProfile } = await supabase
                .from('profiles')
                .select('total_referrals')
                .eq('id', referrer.id)
                .single();
              
              if (currentProfile) {
                const newCount = (currentProfile.total_referrals || 0) + 1;
                console.log("📊 Updating referrer count from", currentProfile.total_referrals, "to", newCount);
                
                const { error: updateError } = await supabase
                  .from('profiles')
                  .update({ total_referrals: newCount })
                  .eq('id', referrer.id);
                
                if (updateError) {
                  console.error("❌ Error updating referral count:", updateError);
                } else {
                  console.log("✅ Referrer count updated successfully");
                }
              }

              setSuccess("Account created successfully! Referral bonus pending.");
            }
          } else {
            console.warn("⚠️ Invalid referral code:", formData.referralCode);
          }
        } catch (refError) {
          console.error("❌ Referral processing error:", refError);
          // Don't fail registration if referral processing fails
        }
      }

      if (!success) {
        setSuccess("Account created successfully! Please check your email to verify.");
      }

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push("/signin");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleGoogleSignUp = async () => {
    try {
      await signInWithGoogle();
    } catch (err: any) {
      setError(err.message || "Failed to sign up with Google");
    }
  };

  return (
    <div className="min-h-screen bg-black light:bg-[#f5f5f5] flex items-center justify-center p-4 overflow-hidden relative">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-slate-950 to-black light:from-[#f5f5f5] light:via-white light:to-[#e8e8e8]" />
        
        <motion.div
          className="absolute top-20 left-20 w-72 h-72 bg-green-500/10 rounded-full blur-3xl"
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
          className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
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

        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-green-500 rounded-full"
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
      <div className="relative z-10 w-full max-w-6xl">
        <div className="grid lg:grid-cols-[1fr_1.3fr] gap-12 items-center">
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
                    className="absolute inset-0 bg-green-500/30 rounded-xl blur-xl"
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
                    className="h-1 bg-green-500 mt-1"
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
                JOIN THE
                <br />
                <span className="text-green-500">REVOLUTION</span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-lg text-white light:text-black leading-relaxed"
              >
                Create your account and start competing in tournaments, earning rewards, and climbing the leaderboards.
              </motion.p>
            </div>

            {/* Features */}
            <div className="space-y-3">
              {[
                { icon: Trophy, text: "Compete in tournaments" },
                { icon: Zap, text: "Instant rewards" },
                { icon: Shield, text: "Secure & verified" },
                { icon: Gift, text: "Referral bonuses" }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex items-center gap-3 group"
                >
                  <div className="w-10 h-10 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center justify-center group-hover:bg-green-500/20 transition-all">
                    <feature.icon className="w-5 h-5 text-green-500" />
                  </div>
                  <span className="font-bold text-white light:text-black">
                    {feature.text}
                  </span>
                  <Check className="w-4 h-4 text-green-500 ml-auto" />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Side - Sign Up Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative bg-black/40 light:bg-white/90 backdrop-blur-2xl border-2 border-white/10 light:border-black/10 rounded-3xl p-8 md:p-10 shadow-2xl">
              {/* Decorative corner accents */}
              <div className="absolute top-0 left-0 w-20 h-20 border-t-4 border-l-4 border-green-500 rounded-tl-3xl" />
              <div className="absolute bottom-0 right-0 w-20 h-20 border-b-4 border-r-4 border-green-500 rounded-br-3xl" />

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
                    CREATE ACCOUNT
                  </h3>
                  <p className="text-white light:text-black">
                    Join thousands of gamers today
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
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

                  {/* Username Input */}
                  <div>
                    <label className="block text-sm font-bold text-white light:text-black mb-2">
                      Username
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        placeholder="Choose a username"
                        className="w-full pl-12 pr-4 py-3 bg-white/5 light:bg-black/5 border-2 border-white/20 light:border-black/20 rounded-xl text-white light:text-black placeholder-gray-500 focus:border-green-500 focus:outline-none transition-all font-medium"
                      />
                    </div>
                  </div>

                  {/* Email Input */}
                  <div>
                    <label className="block text-sm font-bold text-white light:text-black mb-2">
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
                        className="w-full pl-12 pr-4 py-3 bg-white/5 light:bg-black/5 border-2 border-white/20 light:border-black/20 rounded-xl text-white light:text-black placeholder-gray-500 focus:border-green-500 focus:outline-none transition-all font-medium"
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div>
                    <label className="block text-sm font-bold text-white light:text-black mb-2">
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
                        placeholder="Create a strong password"
                        className="w-full pl-12 pr-12 py-3 bg-white/5 light:bg-black/5 border-2 border-white/20 light:border-black/20 rounded-xl text-white light:text-black placeholder-gray-500 focus:border-green-500 focus:outline-none transition-all font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-green-500 transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password Input */}
                  <div>
                    <label className="block text-sm font-bold text-white light:text-black mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        placeholder="Confirm your password"
                        className="w-full pl-12 pr-12 py-3 bg-white/5 light:bg-black/5 border-2 border-white/20 light:border-black/20 rounded-xl text-white light:text-black placeholder-gray-500 focus:border-green-500 focus:outline-none transition-all font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-green-500 transition-colors"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Referral Code Input */}
                  <div>
                    <label className="block text-sm font-bold text-white light:text-black mb-2">
                      Referral Code <span className="text-white/50 light:text-black/50">(Optional)</span>
                    </label>
                    <div className="relative">
                      <Gift className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <input
                        type="text"
                        name="referralCode"
                        value={formData.referralCode}
                        onChange={handleChange}
                        placeholder="Enter referral code"
                        className="w-full pl-12 pr-4 py-3 bg-white/5 light:bg-black/5 border-2 border-white/20 light:border-black/20 rounded-xl text-white light:text-black placeholder-gray-500 focus:border-green-500 focus:outline-none transition-all font-medium"
                      />
                    </div>
                    {formData.referralCode && (
                      <p className="text-xs text-green-500 mt-1 flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        You'll receive ₦500 bonus after verification!
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="relative w-full group overflow-hidden mt-6"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-500 rounded-xl" />
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-green-500 to-green-600 rounded-xl"
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
                          <span className="text-white font-bold text-lg">CREATING ACCOUNT...</span>
                        </>
                      ) : (
                        <>
                          <span className="text-white font-bold text-lg">CREATE ACCOUNT</span>
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

                  {/* Google Sign Up */}
                  <motion.button
                    type="button"
                    onClick={handleGoogleSignUp}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-white/5 light:bg-black/5 border-2 border-white/20 light:border-black/20 rounded-xl hover:border-green-500/50 transition-all group"
                  >
                    <Chrome className="w-5 h-5 text-white light:text-black group-hover:text-green-500 transition-colors" />
                    <span className="font-bold text-white light:text-black group-hover:text-green-500 transition-colors">
                      Continue with Google
                    </span>
                  </motion.button>

                  {/* Sign In Link */}
                  <div className="text-center pt-4">
                    <p className="text-white light:text-black">
                      Already have an account?{" "}
                      <Link
                        href="/signin"
                        className="font-bold text-green-500 hover:text-green-400 transition-colors"
                      >
                        Sign In
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

export default function SignUpPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <SignUpContent />
    </Suspense>
  );
}
