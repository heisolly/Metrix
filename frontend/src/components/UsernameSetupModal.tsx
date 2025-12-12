"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { User, ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface UsernameSetupModalProps {
  isOpen: boolean;
  userId: string;
  email: string;
  onComplete: () => void;
}

export default function UsernameSetupModal({ isOpen, userId, email, onComplete }: UsernameSetupModalProps) {
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Validate username
    if (username.length < 3) {
      setError("Username must be at least 3 characters");
      setIsLoading(false);
      return;
    }

    if (!/^[a-zA-Z0-9_]+/.test(username)) {
      setError("Username can only contain letters, numbers, and underscores");
      setIsLoading(false);
      return;
    }

    try {
      console.log('Setting username for user:', userId);
      
      // First, check if profile exists
      const { data: existingProfile, error: checkError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .single();

      console.log('Existing profile:', existingProfile);

      // If profile doesn't exist, create it first
      if (!existingProfile) {
        console.log('Creating new profile...');
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: userId,
            email: email,
            username: username.toLowerCase(),
            full_name: fullName || null,
          });

        if (insertError) {
          console.error('Insert error:', insertError);
          if (insertError.code === '23505') {
            setError("Username already taken. Please choose another.");
          } else {
            setError(insertError.message);
          }
          setIsLoading(false);
          return;
        }
      } else {
        // Profile exists, update it
        console.log('Updating existing profile...');
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            username: username.toLowerCase(),
            full_name: fullName || null,
          })
          .eq('id', userId);

        if (updateError) {
          console.error('Update error:', updateError);
          if (updateError.code === '23505') {
            setError("Username already taken. Please choose another.");
          } else {
            setError(updateError.message);
          }
          setIsLoading(false);
          return;
        }
      }

      console.log('Username set successfully!');
      // Success - call onComplete
      onComplete();
    } catch (err: any) {
      console.error('Unexpected error:', err);
      setError(err.message || "Failed to set username");
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-red-500/30 rounded-2xl p-8 shadow-2xl"
          >
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl" />

            <div className="relative">
              {/* Icon */}
              <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <User className="w-8 h-8 text-white" />
              </div>

              {/* Title */}
              <h2 className="text-3xl font-black text-white text-center mb-2">
                WELCOME TO METRIX!
              </h2>
              <p className="text-white/70 text-center mb-8">
                Let's set up your profile to get started
              </p>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email (readonly) */}
                <div>
                  <label className="block text-sm font-bold text-white mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    readOnly
                    className="w-full px-4 py-3 bg-white/5 border-2 border-white/10 rounded-xl text-white/50 cursor-not-allowed"
                  />
                </div>

                {/* Username */}
                <div>
                  <label className="block text-sm font-bold text-white mb-2">
                    Username <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    required
                    className="w-full px-4 py-3 bg-white/5 border-2 border-white/20 rounded-xl text-white placeholder-gray-500 focus:border-red-500 focus:outline-none transition-all"
                  />
                  <p className="text-xs text-white/50 mt-1">
                    Letters, numbers, and underscores only. Min 3 characters.
                  </p>
                </div>

                {/* Full Name (optional) */}
                <div>
                  <label className="block text-sm font-bold text-white mb-2">
                    Full Name <span className="text-white/50">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 bg-white/5 border-2 border-white/20 rounded-xl text-white placeholder-gray-500 focus:border-red-500 focus:outline-none transition-all"
                  />
                </div>

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-500 text-sm font-bold text-center"
                  >
                    {error}
                  </motion.div>
                )}

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full px-6 py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold rounded-xl hover:from-red-600 hover:to-orange-600 transition-all shadow-lg shadow-red-500/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                      <span>Setting up...</span>
                    </>
                  ) : (
                    <>
                      <span>Continue to Dashboard</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
