"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Processing authentication...");

  useEffect(() => {
    handleCallback();
  }, []);

  const handleCallback = async () => {
    try {
      // Get the code from URL (query parameters)
      const searchParams = new URLSearchParams(window.location.search);
      const code = searchParams.get('code');
      const error = searchParams.get('error');
      const errorDescription = searchParams.get('error_description');

      // Also check for hash parameters (implicit flow)
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get('access_token');
      const refreshToken = hashParams.get('refresh_token');

      if (error) {
        throw new Error(errorDescription || error);
      }

      // Handle hash-based tokens (implicit flow)
      if (accessToken) {
        console.log('✅ Received access token from hash');
        
        // Set the session using the tokens
        const { data, error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken || '',
        });

        if (sessionError) throw sessionError;

        if (data.user) {
          // Check if profile exists
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

          // Create profile if it doesn't exist
          if (!profile) {
            const username = data.user.email?.split('@')[0] || 'user';
            const fullName = data.user.user_metadata?.full_name || data.user.user_metadata?.name || '';
            
            await supabase
              .from('profiles')
              .upsert({
                id: data.user.id,
                username: username,
                full_name: fullName,
                email: data.user.email,
                avatar_url: data.user.user_metadata?.avatar_url || data.user.user_metadata?.picture,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              });
          }

          setStatus("success");
          setMessage("Authentication successful! Redirecting...");
          
          // Redirect to dashboard
          setTimeout(() => {
            router.push("/dashboard/overview");
          }, 1500);
        }
      }
      // Handle code-based flow (PKCE)
      else if (code) {
        console.log('✅ Received authorization code');
        
        // Exchange code for session
        const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        
        if (exchangeError) throw exchangeError;

        if (data.user) {
          // Check if profile exists
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

          // Create profile if it doesn't exist
          if (!profile) {
            const username = data.user.email?.split('@')[0] || 'user';
            const fullName = data.user.user_metadata?.full_name || data.user.user_metadata?.name || '';
            
            await supabase
              .from('profiles')
              .upsert({
                id: data.user.id,
                username: username,
                full_name: fullName,
                email: data.user.email,
                avatar_url: data.user.user_metadata?.avatar_url || data.user.user_metadata?.picture,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              });
          }

          setStatus("success");
          setMessage("Authentication successful! Redirecting...");
          
          // Redirect to dashboard
          setTimeout(() => {
            router.push("/dashboard/overview");
          }, 1500);
        }
      } else {
        // Check if user is already authenticated
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          setStatus("success");
          setMessage("Already authenticated! Redirecting...");
          setTimeout(() => {
            router.push("/dashboard/overview");
          }, 1500);
        } else {
          throw new Error("No authentication code or token received");
        }
      }
    } catch (error: any) {
      console.error("Auth callback error:", error);
      setStatus("error");
      setMessage(error.message || "Authentication failed. Please try again.");
      
      // Redirect to signin after error
      setTimeout(() => {
        router.push("/signin");
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-slate-900 to-black flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-900 border-2 border-white/10 rounded-2xl p-8 max-w-md w-full text-center"
      >
        {status === "loading" && (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full mx-auto mb-6"
            />
            <h2 className="text-2xl font-black text-white mb-2">
              AUTHENTICATING
            </h2>
            <p className="text-white/70">{message}</p>
          </>
        )}

        {status === "success" && (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
              className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </motion.div>
            <h2 className="text-2xl font-black text-white mb-2">
              SUCCESS!
            </h2>
            <p className="text-white/70">{message}</p>
          </>
        )}

        {status === "error" && (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
              className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </motion.div>
            <h2 className="text-2xl font-black text-white mb-2">
              ERROR
            </h2>
            <p className="text-white/70">{message}</p>
            <p className="text-white/50 text-sm mt-4">Redirecting to sign in...</p>
          </>
        )}
      </motion.div>
    </div>
  );
}
