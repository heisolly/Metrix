"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Save, Upload, X, Plus, DollarSign } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function SellAccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    game: "",
    account_level: "",
    account_rank: "",
    account_username: "",
    account_description: "",
    price: "",
    account_email: "",
    account_password: "",
    features: {} as any,
  });

  useEffect(() => {
    loadUser();
    loadCategories();
  }, []);

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

  const loadCategories = async () => {
    try {
      const { data } = await supabase
        .from("account_categories")
        .select("*")
        .eq("is_active", true)
        .order("sort_order");

      setCategories(data || []);
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!user) {
        alert("Please sign in to sell accounts");
        router.push("/signin");
        return;
      }

      const { data, error } = await supabase
        .from("game_accounts")
        .insert({
          game: formData.game,
          account_level: formData.account_level ? parseInt(formData.account_level) : null,
          account_rank: formData.account_rank || null,
          account_username: formData.account_username,
          account_description: formData.account_description,
          price: parseFloat(formData.price),
          account_email: formData.account_email,
          account_password: formData.account_password,
          seller_id: user.id,
          seller_type: "user",
          status: "available",
          features: formData.features,
        })
        .select()
        .single();

      if (error) throw error;

      alert("Account listed successfully! It will be reviewed by our team.");
      router.push("/dashboard/marketplace");
    } catch (error: any) {
      console.error("Error creating listing:", error);
      alert(`Failed to create listing: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-slate-900 to-black">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-white/50 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-bold">Back to Marketplace</span>
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-black text-white mb-2">
            SELL YOUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-500">ACCOUNT</span>
          </h1>
          <p className="text-white/70">
            List your gaming account for sale. Fill in all details accurately.
          </p>
        </motion.div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Game Selection */}
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-black text-white mb-6">Game Information</h3>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-white mb-2">
                  Game <span className="text-red-500">*</span>
                </label>
                <select
                  name="game"
                  value={formData.game}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-green-500 focus:outline-none"
                >
                  <option value="">Select a game...</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.display_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-white mb-2">
                  Account Username <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="account_username"
                  value={formData.account_username}
                  onChange={handleChange}
                  required
                  placeholder="e.g., ProGamer123"
                  className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-green-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-white mb-2">
                  Account Level
                </label>
                <input
                  type="number"
                  name="account_level"
                  value={formData.account_level}
                  onChange={handleChange}
                  placeholder="e.g., 150"
                  className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-green-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-white mb-2">
                  Account Rank
                </label>
                <input
                  type="text"
                  name="account_rank"
                  value={formData.account_rank}
                  onChange={handleChange}
                  placeholder="e.g., Legendary, Master, etc."
                  className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-green-500 focus:outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-white mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="account_description"
                  value={formData.account_description}
                  onChange={handleChange}
                  required
                  rows={4}
                  placeholder="Describe your account: skins, weapons, characters, achievements, etc."
                  className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-green-500 focus:outline-none resize-none"
                />
              </div>
            </div>
          </div>

          {/* Account Credentials */}
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-black text-white mb-2">Account Credentials</h3>
            <p className="text-sm text-white/50 mb-6">
              These details will only be shared with the buyer after successful payment
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-white mb-2">
                  Account Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="account_email"
                  value={formData.account_email}
                  onChange={handleChange}
                  required
                  placeholder="account@example.com"
                  className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-green-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-white mb-2">
                  Account Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  name="account_password"
                  value={formData.account_password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-green-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-black text-white mb-6 flex items-center gap-2">
              <DollarSign className="w-6 h-6 text-green-500" />
              Pricing
            </h3>

            <div>
              <label className="block text-sm font-bold text-white mb-2">
                Price (₦) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="100"
                step="100"
                placeholder="5000"
                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-green-500 focus:outline-none"
              />
              <p className="text-sm text-white/50 mt-2">
                Set a competitive price. Platform fee: 10% of sale price
              </p>
            </div>
          </div>

          {/* Important Notice */}
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-6">
            <h4 className="font-bold text-yellow-500 mb-2">⚠️ Important Notice</h4>
            <ul className="text-sm text-white/70 space-y-2">
              <li>• Your listing will be reviewed by our team before going live</li>
              <li>• Provide accurate account details to avoid disputes</li>
              <li>• Account credentials will only be shared after payment confirmation</li>
              <li>• You'll receive 90% of the sale price (10% platform fee)</li>
              <li>• Fraudulent listings will result in account suspension</li>
            </ul>
          </div>

          {/* Submit */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                  Listing...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  List Account for Sale
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
