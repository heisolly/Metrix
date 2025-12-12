"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  ShoppingCart, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Check,
  X,
  Star,
  Shield,
  DollarSign,
  TrendingUp,
  Users,
  Search
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function AdminMarketplacePage() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadAccounts();
    loadStats();
  }, [filter]);

  const loadAccounts = async () => {
    try {
      setLoading(true);

      let query = supabase
        .from("game_accounts")
        .select(`
          *,
          seller:seller_id(username, email),
          buyer:buyer_id(username)
        `)
        .order("created_at", { ascending: false });

      if (filter !== "all") {
        query = query.eq("status", filter);
      }

      const { data, error } = await query;

      if (error) throw error;

      setAccounts(data || []);
    } catch (error) {
      console.error("Error loading accounts:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const { data, error } = await supabase.rpc("get_account_marketplace_stats");

      if (error) throw error;

      if (data && data.length > 0) {
        setStats(data[0]);
      }
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  const handleVerify = async (accountId: string, verified: boolean) => {
    try {
      const { error } = await supabase
        .from("game_accounts")
        .update({ is_verified: verified })
        .eq("id", accountId);

      if (error) throw error;

      alert(`Account ${verified ? "verified" : "unverified"} successfully`);
      loadAccounts();
    } catch (error: any) {
      console.error("Error updating account:", error);
      alert(`Failed to update: ${error.message}`);
    }
  };

  const handleFeature = async (accountId: string, featured: boolean) => {
    try {
      const { error } = await supabase
        .from("game_accounts")
        .update({ is_featured: featured })
        .eq("id", accountId);

      if (error) throw error;

      alert(`Account ${featured ? "featured" : "unfeatured"} successfully`);
      loadAccounts();
    } catch (error: any) {
      console.error("Error updating account:", error);
      alert(`Failed to update: ${error.message}`);
    }
  };

  const handleDelete = async (accountId: string) => {
    if (!confirm("Are you sure you want to delete this account listing?")) return;

    try {
      const { error } = await supabase
        .from("game_accounts")
        .delete()
        .eq("id", accountId);

      if (error) throw error;

      alert("Account deleted successfully");
      loadAccounts();
    } catch (error: any) {
      console.error("Error deleting account:", error);
      alert(`Failed to delete: ${error.message}`);
    }
  };

  const handleUpdatePrice = async (accountId: string) => {
    const newPrice = prompt("Enter new price:");
    if (!newPrice) return;

    const price = parseFloat(newPrice);
    if (isNaN(price) || price < 0) {
      alert("Invalid price");
      return;
    }

    try {
      const { error } = await supabase
        .from("game_accounts")
        .update({ price })
        .eq("id", accountId);

      if (error) throw error;

      alert("Price updated successfully");
      loadAccounts();
    } catch (error: any) {
      console.error("Error updating price:", error);
      alert(`Failed to update: ${error.message}`);
    }
  };

  const filteredAccounts = accounts.filter((account) =>
    account.account_username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    account.game?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    account.seller?.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-white mb-2">MARKETPLACE MANAGEMENT</h1>
          <p className="text-white/70">Manage gaming account listings and sales</p>
        </div>

        <Link
          href="/admin/marketplace/create"
          className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold rounded-xl transition-all flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Account
        </Link>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <ShoppingCart className="w-5 h-5 text-blue-500" />
              <span className="text-sm text-white/50">Total</span>
            </div>
            <div className="text-3xl font-black text-white">{stats.total_accounts}</div>
          </div>

          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <Eye className="w-5 h-5 text-green-500" />
              <span className="text-sm text-white/50">Available</span>
            </div>
            <div className="text-3xl font-black text-white">{stats.available_accounts}</div>
          </div>

          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <Check className="w-5 h-5 text-purple-500" />
              <span className="text-sm text-white/50">Sold</span>
            </div>
            <div className="text-3xl font-black text-white">{stats.sold_accounts}</div>
          </div>

          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-yellow-500" />
              <span className="text-sm text-white/50">Sales</span>
            </div>
            <div className="text-3xl font-black text-white">{stats.total_sales}</div>
          </div>

          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="w-5 h-5 text-green-500" />
              <span className="text-sm text-white/50">Revenue</span>
            </div>
            <div className="text-2xl font-black text-white">
              ₦{parseFloat(stats.total_revenue || 0).toLocaleString()}
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 mb-8">
        <div className="grid md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
            <input
              type="text"
              placeholder="Search accounts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-white/50 focus:border-purple-500 focus:outline-none"
            />
          </div>

          {/* Status Filter */}
          <div className="flex gap-2">
            {["all", "available", "sold", "pending"].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`flex-1 px-4 py-3 rounded-xl font-bold transition-all ${
                  filter === status
                    ? "bg-purple-500 text-white"
                    : "bg-black/40 text-white/70 hover:bg-white/5"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Accounts Table */}
      <div className="bg-slate-900 border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-black/40 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-white/70">Account</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-white/70">Game</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-white/70">Seller</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-white/70">Price</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-white/70">Status</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-white/70">Views</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-white/70">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto"
                    />
                  </td>
                </tr>
              ) : filteredAccounts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-white/50">
                    No accounts found
                  </td>
                </tr>
              ) : (
                filteredAccounts.map((account) => (
                  <tr key={account.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="px-6 py-4">
                      <div className="font-bold text-white">{account.account_username}</div>
                      <div className="text-sm text-white/50">Level {account.account_level}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-purple-500 uppercase">
                        {account.game}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-white">{account.seller?.username || "Unknown"}</div>
                      <div className="text-sm text-white/50">{account.seller_type}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-white">₦{account.price.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          account.status === "available"
                            ? "bg-green-500/20 text-green-500"
                            : account.status === "sold"
                            ? "bg-red-500/20 text-red-500"
                            : "bg-yellow-500/20 text-yellow-500"
                        }`}
                      >
                        {account.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-white/70">
                        <Eye className="w-4 h-4" />
                        {account.views}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleVerify(account.id, !account.is_verified)}
                          className={`p-2 rounded-lg transition-all ${
                            account.is_verified
                              ? "bg-green-500 text-white"
                              : "bg-white/5 text-white/50 hover:bg-white/10"
                          }`}
                          title={account.is_verified ? "Verified" : "Verify"}
                        >
                          <Shield className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleFeature(account.id, !account.is_featured)}
                          className={`p-2 rounded-lg transition-all ${
                            account.is_featured
                              ? "bg-yellow-500 text-white"
                              : "bg-white/5 text-white/50 hover:bg-white/10"
                          }`}
                          title={account.is_featured ? "Featured" : "Feature"}
                        >
                          <Star className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleUpdatePrice(account.id)}
                          className="p-2 bg-white/5 hover:bg-white/10 text-white/70 rounded-lg transition-all"
                          title="Update Price"
                        >
                          <DollarSign className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDelete(account.id)}
                          className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-500 rounded-lg transition-all"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
