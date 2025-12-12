"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, CheckCircle, XCircle, UserPlus, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function ManualVerificationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [selectedTournament, setSelectedTournament] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [paymentReference, setPaymentReference] = useState("");
  const [searchResult, setSearchResult] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const user = await getCurrentUser();
      if (!user) {
        router.push("/admin/signin");
        return;
      }

      // Load tournaments
      const { data: tournamentsData } = await supabase
        .from("tournaments")
        .select("*")
        .order("created_at", { ascending: false });

      setTournaments(tournamentsData || []);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const searchUser = async () => {
    if (!userEmail) {
      alert("Please enter user email");
      return;
    }

    setProcessing(true);
    try {
      // Find user
      const { data: user, error: userError } = await supabase
        .from("profiles")
        .select("*")
        .eq("email", userEmail)
        .single();

      if (userError || !user) {
        alert("User not found with email: " + userEmail);
        setSearchResult(null);
        return;
      }

      // Check if already registered
      if (selectedTournament) {
        const { data: existing } = await supabase
          .from("tournament_participants")
          .select("*")
          .eq("tournament_id", selectedTournament)
          .eq("user_id", user.id)
          .single();

        setSearchResult({
          user,
          alreadyRegistered: !!existing,
          existingRegistration: existing
        });
      } else {
        setSearchResult({ user, alreadyRegistered: false });
      }
    } catch (error: any) {
      console.error("Error searching user:", error);
      alert("Error: " + error.message);
    } finally {
      setProcessing(false);
    }
  };

  const manuallyAddParticipant = async () => {
    if (!selectedTournament || !searchResult?.user) {
      alert("Please select tournament and search for user first");
      return;
    }

    if (searchResult.alreadyRegistered) {
      alert("User is already registered for this tournament");
      return;
    }

    if (!confirm(`Add ${searchResult.user.username} to tournament manually?`)) {
      return;
    }

    setProcessing(true);
    try {
      // Add to tournament
      const { error: insertError } = await supabase
        .from("tournament_participants")
        .insert({
          tournament_id: selectedTournament,
          user_id: searchResult.user.id,
          status: "registered",
          payment_reference: paymentReference || `MANUAL-${Date.now()}`
        });

      if (insertError) throw insertError;

      // Update participant count
      const { error: updateError } = await supabase.rpc(
        "increment_tournament_participants",
        { tournament_id: selectedTournament }
      );

      if (updateError) {
        console.error("Error updating count:", updateError);
        // Don't fail if count update fails
      }

      alert("✅ User successfully added to tournament!");
      
      // Reset form
      setUserEmail("");
      setPaymentReference("");
      setSearchResult(null);
      
    } catch (error: any) {
      console.error("Error adding participant:", error);
      alert("Error: " + error.message);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white mb-2">
          MANUAL PARTICIPANT VERIFICATION
        </h1>
        <p className="text-white/70">
          Add users to tournaments manually after payment verification
        </p>
      </div>

      {/* Alert Box */}
      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-6 mb-8">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-lg font-bold text-yellow-500 mb-2">
              Use this page to fix payment issues
            </h3>
            <p className="text-white/70 text-sm">
              If a user paid but wasn't added to the tournament, verify their payment
              in AlatPay dashboard and manually add them here.
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-8 space-y-6">
        {/* Tournament Selection */}
        <div>
          <label className="block text-sm font-bold text-white mb-2">
            Select Tournament
          </label>
          <select
            value={selectedTournament}
            onChange={(e) => setSelectedTournament(e.target.value)}
            className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-red-500 focus:outline-none"
          >
            <option value="">-- Select Tournament --</option>
            {tournaments.map((tournament) => (
              <option key={tournament.id} value={tournament.id}>
                {tournament.name} - {tournament.status} ({tournament.current_participants}/
                {tournament.max_participants})
              </option>
            ))}
          </select>
        </div>

        {/* User Email */}
        <div>
          <label className="block text-sm font-bold text-white mb-2">
            User Email
          </label>
          <div className="flex gap-3">
            <input
              type="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              placeholder="user@example.com"
              className="flex-1 px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-red-500 focus:outline-none"
            />
            <button
              onClick={searchUser}
              disabled={processing || !userEmail}
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl transition-all disabled:opacity-50 flex items-center gap-2"
            >
              <Search className="w-5 h-5" />
              Search
            </button>
          </div>
        </div>

        {/* Payment Reference (Optional) */}
        <div>
          <label className="block text-sm font-bold text-white mb-2">
            Payment Reference (Optional)
          </label>
          <input
            type="text"
            value={paymentReference}
            onChange={(e) => setPaymentReference(e.target.value)}
            placeholder="ALATPAY-TXN-12345 or leave blank for auto-generated"
            className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-red-500 focus:outline-none"
          />
        </div>

        {/* Search Result */}
        {searchResult && (
          <div className="mt-6 p-6 bg-black/40 border border-white/10 rounded-xl">
            <h3 className="text-lg font-bold text-white mb-4">Search Result</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-white/50">Username:</span>
                <span className="text-white font-bold">{searchResult.user.username}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Email:</span>
                <span className="text-white font-bold">{searchResult.user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">User ID:</span>
                <span className="text-white font-mono text-sm">{searchResult.user.id}</span>
              </div>
              
              {searchResult.alreadyRegistered ? (
                <div className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
                  <div className="flex items-center gap-2 text-green-500">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-bold">Already Registered</span>
                  </div>
                  <p className="text-white/70 text-sm mt-2">
                    Payment Reference: {searchResult.existingRegistration?.payment_reference}
                  </p>
                </div>
              ) : (
                <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                  <div className="flex items-center gap-2 text-yellow-500">
                    <XCircle className="w-5 h-5" />
                    <span className="font-bold">Not Registered</span>
                  </div>
                  <p className="text-white/70 text-sm mt-2">
                    User can be manually added to the tournament
                  </p>
                </div>
              )}
            </div>

            {!searchResult.alreadyRegistered && (
              <button
                onClick={manuallyAddParticipant}
                disabled={processing}
                className="w-full mt-6 px-6 py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <UserPlus className="w-5 h-5" />
                {processing ? "Adding..." : "Add to Tournament"}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-8 bg-slate-900 border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">Instructions</h3>
        <ol className="space-y-2 text-white/70 text-sm list-decimal list-inside">
          <li>Select the tournament the user tried to join</li>
          <li>Enter the user's email address</li>
          <li>Click "Search" to find the user</li>
          <li>Verify the payment in AlatPay dashboard</li>
          <li>Enter the payment reference (optional)</li>
          <li>Click "Add to Tournament" to manually register them</li>
        </ol>
      </div>
    </div>
  );
}
