"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  ShoppingCart, 
  Search, 
  Filter, 
  Star, 
  Eye, 
  TrendingUp,
  Shield,
  Zap,
  Tag,
  Heart,
  Plus
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/auth";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function AccountMarketplacePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);

  useEffect(() => {
    loadUser();
    loadCategories();
    loadAccounts();
  }, [selectedCategory, sortBy]);

  const loadUser = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error("Error loading user:", error);
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

  const loadAccounts = async () => {
    try {
      setLoading(true);

      let query = supabase
        .from("game_accounts")
        .select(`
          *,
          seller:seller_id(username, email),
          reviews:account_reviews(rating)
        `)
        .eq("status", "available");

      if (selectedCategory !== "all") {
        query = query.eq("game", selectedCategory);
      }

      // Sorting
      if (sortBy === "newest") {
        query = query.order("created_at", { ascending: false });
      } else if (sortBy === "price_low") {
        query = query.order("price", { ascending: true });
      } else if (sortBy === "price_high") {
        query = query.order("price", { ascending: false });
      } else if (sortBy === "popular") {
        query = query.order("views", { ascending: false });
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

  const filteredAccounts = accounts.filter((account) => {
    const matchesSearch = 
      account.account_username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account.account_description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account.game?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesPrice = account.price >= priceRange[0] && account.price <= priceRange[1];

    return matchesSearch && matchesPrice;
  });

  const stats = [
    { icon: ShoppingCart, label: "Total Accounts", value: accounts.length, color: "from-blue-500 to-cyan-500" },
    { icon: TrendingUp, label: "Featured", value: accounts.filter(a => a.is_featured).length, color: "from-purple-500 to-pink-500" },
    { icon: Shield, label: "Verified", value: accounts.filter(a => a.is_verified).length, color: "from-green-500 to-emerald-500" },
    { icon: Zap, label: "New Today", value: accounts.filter(a => {
      const today = new Date();
      const created = new Date(a.created_at);
      return created.toDateString() === today.toDateString();
    }).length, color: "from-yellow-500 to-orange-500" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-slate-900 to-black">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-900/20 via-blue-900/20 to-purple-900/20 border-b border-white/10">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        
        <div className="relative max-w-7xl mx-auto px-4 py-8 md:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6 md:mb-12"
          >
            <div className="flex items-center justify-center gap-2 md:gap-3 mb-2 md:mb-4">
              <ShoppingCart className="w-8 h-8 md:w-12 md:h-12 text-purple-500" />
              <h1 className="text-2xl md:text-5xl font-black text-white">
                ACCOUNT <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">MARKETPLACE</span>
              </h1>
            </div>
            <p className="text-sm md:text-xl text-white/70 max-w-2xl mx-auto px-4">
              Buy and sell premium gaming accounts. Secure, verified, and instant delivery.
            </p>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl md:rounded-2xl p-3 md:p-6 text-center"
              >
                <div className={`w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r ${stat.color} rounded-lg md:rounded-xl flex items-center justify-center mx-auto mb-2 md:mb-3`}>
                  <stat.icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <div className="text-xl md:text-3xl font-black text-white mb-0.5 md:mb-1">{stat.value}</div>
                <div className="text-xs md:text-sm text-white/50">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Search & Filter */}
          <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl md:rounded-2xl p-4 md:p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-white/50" />
                <input
                  type="text"
                  placeholder="Search accounts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 md:pl-12 pr-4 py-2.5 md:py-3 bg-white/5 border border-white/10 rounded-lg md:rounded-xl text-white placeholder-white/50 focus:border-purple-500 focus:outline-none text-sm md:text-base"
                />
              </div>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2.5 md:py-3 bg-white/5 border border-white/10 rounded-lg md:rounded-xl text-white focus:border-purple-500 focus:outline-none appearance-none cursor-pointer text-sm md:text-base"
              >
                <option value="newest" className="bg-slate-900">Newest First</option>
                <option value="price_low" className="bg-slate-900">Price: Low to High</option>
                <option value="price_high" className="bg-slate-900">Price: High to Low</option>
                <option value="popular" className="bg-slate-900">Most Popular</option>
              </select>

              {/* Sell Button */}
              <Link
                href="/dashboard/marketplace/sell"
                className="px-6 py-2.5 md:py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold rounded-lg md:rounded-xl transition-all flex items-center justify-center gap-2 text-sm md:text-base"
              >
                <Plus className="w-4 h-4 md:w-5 md:h-5" />
                Sell Account
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        <div className="grid lg:grid-cols-4 gap-6 md:gap-8">
          {/* Sidebar - Categories */}
          <div className="lg:col-span-1">
            <div className="bg-slate-900 border border-white/10 rounded-xl md:rounded-2xl p-4 md:p-6 lg:sticky lg:top-4">
              <h3 className="text-lg md:text-xl font-black text-white mb-3 md:mb-4 flex items-center gap-2">
                <Filter className="w-4 h-4 md:w-5 md:h-5 text-purple-500" />
                Categories
              </h3>

              <div className="flex lg:flex-col overflow-x-auto lg:overflow-visible gap-2 pb-2 lg:pb-0 scrollbar-hide">
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`flex-shrink-0 w-auto lg:w-full text-left px-4 py-2 md:py-3 rounded-lg md:rounded-xl font-bold transition-all text-sm md:text-base whitespace-nowrap ${
                    selectedCategory === "all"
                      ? "bg-purple-500 text-white"
                      : "text-white/70 hover:bg-white/5 bg-white/5 lg:bg-transparent"
                  }`}
                >
                  All Games
                </button>

                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.name)}
                    className={`flex-shrink-0 w-auto lg:w-full text-left px-4 py-2 md:py-3 rounded-lg md:rounded-xl font-bold transition-all text-sm md:text-base whitespace-nowrap ${
                      selectedCategory === category.name
                        ? "bg-purple-500 text-white"
                        : "text-white/70 hover:bg-white/5 bg-white/5 lg:bg-transparent"
                    }`}
                  >
                    {category.display_name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Accounts Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-slate-900 border border-white/10 rounded-xl md:rounded-2xl p-4 md:p-6 animate-pulse">
                    <div className="aspect-video bg-white/5 rounded-lg md:rounded-xl mb-4" />
                    <div className="h-6 bg-white/5 rounded mb-2" />
                    <div className="h-4 bg-white/5 rounded w-2/3" />
                  </div>
                ))}
              </div>
            ) : filteredAccounts.length === 0 ? (
              <div className="text-center py-12 md:py-20">
                <ShoppingCart className="w-16 h-16 md:w-24 md:h-24 text-white/10 mx-auto mb-4 md:mb-6" />
                <h3 className="text-xl md:text-2xl font-black text-white mb-2">No Accounts Found</h3>
                <p className="text-white/50 text-sm md:text-base">Try adjusting your filters or search query</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {filteredAccounts.map((account) => (
                  <AccountCard key={account.id} account={account} categories={categories} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

function AccountCard({ account, categories }: { account: any, categories: any[] }) {
  const avgRating = account.reviews?.length > 0
    ? account.reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / account.reviews.length
    : 0;

  return (
    <Link href={`/dashboard/marketplace/${account.id}`}>
      <motion.div
        whileHover={{ y: -5 }}
        className="bg-slate-900 border-2 border-white/10 hover:border-purple-500/50 rounded-xl md:rounded-2xl overflow-hidden transition-all group cursor-pointer"
      >
        {/* Image */}
        <div className="relative aspect-video bg-gradient-to-br from-purple-900/20 to-blue-900/20">
          {account.thumbnail_url ? (
            <Image
              src={account.thumbnail_url}
              alt={account.account_username || "Account"}
              fill
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <ShoppingCart className="w-12 h-12 md:w-16 md:h-16 text-white/10" />
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-2 left-2 md:top-3 md:left-3 flex gap-1 md:gap-2">
            {account.is_featured && (
              <span className="px-2 py-0.5 md:px-3 md:py-1 bg-yellow-500 text-black text-[10px] md:text-xs font-bold rounded-full flex items-center gap-1">
                <Star className="w-2.5 h-2.5 md:w-3 md:h-3" />
                Featured
              </span>
            )}
            {account.is_verified && (
              <span className="px-2 py-0.5 md:px-3 md:py-1 bg-green-500 text-white text-[10px] md:text-xs font-bold rounded-full flex items-center gap-1">
                <Shield className="w-2.5 h-2.5 md:w-3 md:h-3" />
                Verified
              </span>
            )}
          </div>

          {/* Views */}
          <div className="absolute bottom-2 right-2 md:bottom-3 md:right-3 px-2 py-0.5 md:px-3 md:py-1 bg-black/60 backdrop-blur-sm rounded-full flex items-center gap-1">
            <Eye className="w-2.5 h-2.5 md:w-3 md:h-3 text-white" />
            <span className="text-[10px] md:text-xs text-white font-bold">{account.views}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 md:p-6">
          {/* Game Tag */}
          <div className="flex items-center gap-1.5 md:gap-2 mb-2 md:mb-3">
            <Tag className="w-3.5 h-3.5 md:w-4 md:h-4 text-purple-500" />
            <span className="text-xs md:text-sm font-bold text-purple-500 uppercase">
              {categories.find(c => c.name === account.game)?.display_name || account.game}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-base md:text-lg font-black text-white mb-1 md:mb-2 line-clamp-1">
            {account.account_username || "Premium Account"}
          </h3>

          {/* Description */}
          <p className="text-xs md:text-sm text-white/50 mb-3 md:mb-4 line-clamp-2">
            {account.account_description || "High-level gaming account"}
          </p>

          {/* Stats */}
          <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4 text-xs md:text-sm">
            {account.account_level && (
              <div className="text-white/70">
                <span className="font-bold text-white">Lvl {account.account_level}</span>
              </div>
            )}
            {account.account_rank && (
              <div className="text-white/70">
                <span className="font-bold text-white">{account.account_rank}</span>
              </div>
            )}
            {avgRating > 0 && (
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 md:w-4 md:h-4 text-yellow-500 fill-yellow-500" />
                <span className="font-bold text-white">{avgRating.toFixed(1)}</span>
              </div>
            )}
          </div>

          {/* Price */}
          <div className="flex items-center justify-between pt-3 md:pt-4 border-t border-white/10">
            <div>
              {account.original_price && account.original_price > account.price && (
                <div className="text-xs md:text-sm text-white/50 line-through">
                  ₦{account.original_price.toLocaleString()}
                </div>
              )}
              <div className="text-lg md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
                ₦{account.price.toLocaleString()}
              </div>
            </div>

            <div className="px-3 py-1.5 md:px-4 md:py-2 bg-purple-500 group-hover:bg-purple-600 text-white font-bold rounded-lg md:rounded-xl transition-all text-xs md:text-sm">
              Buy Now
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
