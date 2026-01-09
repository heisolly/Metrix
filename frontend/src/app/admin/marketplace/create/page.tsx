"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Save, ShoppingCart } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function AdminCreateAccountPage() {
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
    original_price: "",
    account_email: "",
    account_password: "",
    is_featured: false,
    is_verified: true,
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
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === "checkbox" ? checked : value 
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!user) {
        alert("Please sign in");
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
          original_price: formData.original_price ? parseFloat(formData.original_price) : null,
          account_email: formData.account_email,
          account_password: formData.account_password,
          seller_id: user.id,
          seller_type: "admin",
          status: "available",
          is_featured: formData.is_featured,
          is_verified: formData.is_verified,
        })
        .select()
        .single();

      if (error) throw error;

      alert("Account added successfully!");
      router.push("/admin/marketplace");
    } catch (error: any) {
      console.error("Error creating account:", error);
      alert(`Failed to create account: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-white/50 hover:text-white mb-8 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-bold">Back</span>
      </button>

      <div className="mb-8">
        <h1 className="text-3xl font-black text-white mb-2">ADD ACCOUNT</h1>
        <p className="text-white/70">Add a new gaming account to the marketplace</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-slate-900 border border-white/10 rounded-2xl p-6">
          <h3 className="text-xl font-black text-white mb-6">Account Details</h3>

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
                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-purple-500 focus:outline-none"
              >
                <option value="">Select game...</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.display_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-white mb-2">
                Username <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="account_username"
                value={formData.account_username}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-white mb-2">Level</label>
              <input
                type="number"
                name="account_level"
                value={formData.account_level}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-white mb-2">Rank</label>
              <input
                type="text"
                name="account_rank"
                value={formData.account_rank}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-purple-500 focus:outline-none"
              />
            </div>

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
                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-white mb-2">Original Price (₦)</label>
              <input
                type="number"
                name="original_price"
                value={formData.original_price}
                onChange={handleChange}
                min="100"
                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-purple-500 focus:outline-none"
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
                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-purple-500 focus:outline-none resize-none"
              />
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-white/10 rounded-2xl p-6">
          <h3 className="text-xl font-black text-white mb-6">Credentials</h3>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-white mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="account_email"
                value={formData.account_email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-white mb-2">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="account_password"
                value={formData.account_password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-purple-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-white/10 rounded-2xl p-6">
          <h3 className="text-xl font-black text-white mb-6">Settings</h3>

          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="is_featured"
                checked={formData.is_featured}
                onChange={handleChange}
                className="w-5 h-5 rounded border-white/10 bg-black/40 text-purple-500 focus:ring-purple-500"
              />
              <span className="text-white font-bold">Featured Account</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="is_verified"
                checked={formData.is_verified}
                onChange={handleChange}
                className="w-5 h-5 rounded border-white/10 bg-black/40 text-green-500 focus:ring-green-500"
              />
              <span className="text-white font-bold">Verified Account</span>
            </label>
          </div>
        </div>

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
            className="flex-1 px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
                Adding...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Add Account
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
