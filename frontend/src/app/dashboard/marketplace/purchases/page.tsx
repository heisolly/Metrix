"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Eye, EyeOff, Copy, Check, Tag, Calendar } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function MyPurchasesPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [purchases, setPurchases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCredentials, setVisibleCredentials] = useState<Set<string>>(new Set());
  const [copiedFields, setCopiedFields] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    if (user) {
      loadPurchases();
    }
  }, [user]);

  const loadUser = async () => {
    try {
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        router.push("/signin");
        return;
      }
      setUser(currentUser);
    } catch (error) {
      console.error("Error loading user:", error);
      router.push("/signin");
    }
  };

  const loadPurchases = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("account_purchases")
        .select(`
          *,
          account:game_accounts(*)
        `)
        .eq("buyer_id", user.id)
        .eq("status", "completed")
        .order("purchased_at", { ascending: false });

      if (error) throw error;

      setPurchases(data || []);
    } catch (error) {
      console.error("Error loading purchases:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleCredentials = (purchaseId: string) => {
    setVisibleCredentials(prev => {
      const newSet = new Set(prev);
      if (newSet.has(purchaseId)) {
        newSet.delete(purchaseId);
      } else {
        newSet.add(purchaseId);
      }
      return newSet;
    });
  };

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedFields(prev => new Set(prev).add(field));
      setTimeout(() => {
        setCopiedFields(prev => {
          const newSet = new Set(prev);
          newSet.delete(field);
          return newSet;
        });
      }, 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-slate-900 to-black">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-white mb-2">
            MY <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">PURCHASES</span>
          </h1>
          <p className="text-white/70">View and manage your purchased gaming accounts</p>
        </div>

        {/* Purchases */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full"
            />
          </div>
        ) : purchases.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingCart className="w-24 h-24 text-white/10 mx-auto mb-6" />
            <h3 className="text-2xl font-black text-white mb-2">No Purchases Yet</h3>
            <p className="text-white/50 mb-6">Start browsing the marketplace to find your perfect account</p>
            <button
              onClick={() => router.push("/dashboard/marketplace")}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold rounded-xl transition-all"
            >
              Browse Marketplace
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {purchases.map((purchase) => {
              const account = purchase.account;
              const isVisible = visibleCredentials.has(purchase.id);
              const emailCopied = copiedFields.has(`${purchase.id}-email`);
              const passwordCopied = copiedFields.has(`${purchase.id}-password`);

              return (
                <motion.div
                  key={purchase.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-slate-900 border-2 border-white/10 rounded-2xl overflow-hidden"
                >
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Tag className="w-5 h-5 text-purple-500" />
                          <span className="text-sm font-bold text-purple-500 uppercase">
                            {account.game}
                          </span>
                        </div>
                        <h3 className="text-2xl font-black text-white mb-1">
                          {account.account_username}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-white/50">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Purchased {new Date(purchase.purchased_at).toLocaleDateString()}
                          </div>
                          {account.account_level && (
                            <div>Level {account.account_level}</div>
                          )}
                          {account.account_rank && (
                            <div>{account.account_rank}</div>
                          )}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-sm text-white/50 mb-1">Paid</div>
                        <div className="text-2xl font-black text-white">
                          ₦{purchase.amount.toLocaleString()}
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="mb-6 pb-6 border-b border-white/10">
                      <p className="text-white/70">{account.account_description}</p>
                    </div>

                    {/* Credentials */}
                    <div className="bg-black/40 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-black text-white">Account Credentials</h4>
                        <button
                          onClick={() => toggleCredentials(purchase.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white font-bold rounded-lg transition-all"
                        >
                          {isVisible ? (
                            <>
                              <EyeOff className="w-4 h-4" />
                              Hide
                            </>
                          ) : (
                            <>
                              <Eye className="w-4 h-4" />
                              Show
                            </>
                          )}
                        </button>
                      </div>

                      {isVisible ? (
                        <div className="space-y-4">
                          {/* Email */}
                          <div>
                            <label className="block text-sm font-bold text-white/50 mb-2">
                              Email
                            </label>
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={purchase.account_details?.email || account.account_email}
                                readOnly
                                className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-mono"
                              />
                              <button
                                onClick={() => copyToClipboard(
                                  purchase.account_details?.email || account.account_email,
                                  `${purchase.id}-email`
                                )}
                                className="px-4 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-xl transition-all"
                              >
                                {emailCopied ? (
                                  <Check className="w-5 h-5" />
                                ) : (
                                  <Copy className="w-5 h-5" />
                                )}
                              </button>
                            </div>
                          </div>

                          {/* Password */}
                          <div>
                            <label className="block text-sm font-bold text-white/50 mb-2">
                              Password
                            </label>
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={purchase.account_details?.password || account.account_password}
                                readOnly
                                className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-mono"
                              />
                              <button
                                onClick={() => copyToClipboard(
                                  purchase.account_details?.password || account.account_password,
                                  `${purchase.id}-password`
                                )}
                                className="px-4 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-xl transition-all"
                              >
                                {passwordCopied ? (
                                  <Check className="w-5 h-5" />
                                ) : (
                                  <Copy className="w-5 h-5" />
                                )}
                              </button>
                            </div>
                          </div>

                          {/* Additional Info */}
                          {purchase.account_details?.additional_info && (
                            <div>
                              <label className="block text-sm font-bold text-white/50 mb-2">
                                Additional Information
                              </label>
                              <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white/70 text-sm">
                                <pre className="whitespace-pre-wrap font-mono">
                                  {JSON.stringify(purchase.account_details.additional_info, null, 2)}
                                </pre>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-white/50">
                          Click "Show" to view account credentials
                        </div>
                      )}
                    </div>

                    {/* Warning */}
                    <div className="mt-6 bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                      <p className="text-sm text-yellow-500">
                        ⚠️ <strong>Important:</strong> Keep these credentials safe and private. Change the password immediately after logging in for security.
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
