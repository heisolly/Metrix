"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  ShoppingCart, 
  Shield, 
  Star, 
  Eye, 
  Tag,
  User,
  Clock,
  CheckCircle,
  AlertCircle,
  Heart
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/auth";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";

export default function AccountDetailPage() {
  const router = useRouter();
  const params = useParams();
  const accountId = params.id as string;

  const [user, setUser] = useState<any>(null);
  const [account, setAccount] = useState<any>(null);
  const [seller, setSeller] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    loadUser();
    loadAccount();
  }, [accountId]);

  const loadUser = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error("Error loading user:", error);
    }
  };

  const loadAccount = async () => {
    try {
      setLoading(true);

      // Increment view count
      await supabase.rpc("increment_account_views", { account_id: accountId });

      // Load account details
      const { data: accountData, error } = await supabase
        .from("game_accounts")
        .select(`
          *,
          seller:seller_id(id, username, email)
        `)
        .eq("id", accountId)
        .single();

      if (error) throw error;

      setAccount(accountData);
      setSeller(accountData.seller);

      // Load reviews
      const { data: reviewsData } = await supabase
        .from("account_reviews")
        .select(`
          *,
          buyer:buyer_id(username)
        `)
        .eq("account_id", accountId)
        .order("created_at", { ascending: false });

      setReviews(reviewsData || []);
    } catch (error) {
      console.error("Error loading account:", error);
      alert("Account not found");
      router.push("/dashboard/marketplace");
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    if (!user) {
      alert("Please sign in to purchase");
      router.push("/signin");
      return;
    }

    if (user.id === account.seller_id) {
      alert("You cannot buy your own account");
      return;
    }

    if (confirm(`Purchase this account for ₦${account.price.toLocaleString()}?`)) {
      setPurchasing(true);

      try {
        // Check user balance
        const { data: profile } = await supabase
          .from("profiles")
          .select("available_balance")
          .eq("id", user.id)
          .single();

        if (!profile || profile.available_balance < account.price) {
          alert("Insufficient balance. Please top up your wallet.");
          router.push("/dashboard/wallet");
          return;
        }

        // Create purchase record
        const { data: purchase, error: purchaseError } = await supabase
          .from("account_purchases")
          .insert({
            account_id: accountId,
            buyer_id: user.id,
            seller_id: account.seller_id,
            amount: account.price,
            payment_method: "wallet",
            status: "completed",
            account_details: {
              email: account.account_email,
              password: account.account_password,
              additional_info: account.account_additional_info,
            },
            completed_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (purchaseError) throw purchaseError;

        // Deduct from buyer's balance
        await supabase.rpc("deduct_balance", {
          user_id: user.id,
          amount: account.price,
        });

        // Add to seller's balance (90% - 10% platform fee)
        const sellerAmount = account.price * 0.9;
        await supabase.rpc("add_balance", {
          user_id: account.seller_id,
          amount: sellerAmount,
        });

        // Create transaction records
        await supabase.from("transactions").insert([
          {
            user_id: user.id,
            type: "account_purchase",
            amount: -account.price,
            description: `Purchased ${account.game} account`,
            status: "completed",
          },
          {
            user_id: account.seller_id,
            type: "account_sale",
            amount: sellerAmount,
            description: `Sold ${account.game} account`,
            status: "completed",
          },
        ]);

        alert("Purchase successful! Check your purchases to view account details.");
        router.push("/dashboard/marketplace/purchases");
      } catch (error: any) {
        console.error("Error purchasing account:", error);
        alert(`Purchase failed: ${error.message}`);
      } finally {
        setPurchasing(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-slate-900 to-black flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!account) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-slate-900 to-black flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-24 h-24 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-black text-white mb-2">Account Not Found</h2>
          <button
            onClick={() => router.push("/dashboard/marketplace")}
            className="text-purple-500 hover:text-purple-400 font-bold"
          >
            Back to Marketplace
          </button>
        </div>
      </div>
    );
  }

  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  const isSold = account.status === "sold";
  const isOwnAccount = user?.id === account.seller_id;

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-slate-900 to-black">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-white/50 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-bold">Back to Marketplace</span>
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Images */}
            <div className="bg-slate-900 border border-white/10 rounded-2xl overflow-hidden">
              <div className="relative aspect-video bg-gradient-to-br from-purple-900/20 to-blue-900/20">
                {account.thumbnail_url ? (
                  <Image
                    src={account.thumbnail_url}
                    alt={account.account_username}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ShoppingCart className="w-32 h-32 text-white/10" />
                  </div>
                )}

                {/* Status Badge */}
                {isSold && (
                  <div className="absolute top-4 right-4 px-4 py-2 bg-red-500 text-white font-bold rounded-xl">
                    SOLD
                  </div>
                )}
              </div>
            </div>

            {/* Details */}
            <div className="bg-slate-900 border border-white/10 rounded-2xl p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Tag className="w-5 h-5 text-purple-500" />
                    <span className="text-sm font-bold text-purple-500 uppercase">
                      {account.game}
                    </span>
                  </div>
                  <h1 className="text-3xl font-black text-white mb-2">
                    {account.account_username}
                  </h1>
                  <div className="flex items-center gap-4 text-sm text-white/50">
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {account.views} views
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      Listed {new Date(account.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  {account.is_featured && (
                    <span className="px-3 py-1 bg-yellow-500 text-black text-xs font-bold rounded-full flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      Featured
                    </span>
                  )}
                  {account.is_verified && (
                    <span className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                      <Shield className="w-3 h-3" />
                      Verified
                    </span>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {account.account_level && (
                  <div className="bg-black/40 rounded-xl p-4 text-center">
                    <div className="text-2xl font-black text-white mb-1">
                      {account.account_level}
                    </div>
                    <div className="text-sm text-white/50">Level</div>
                  </div>
                )}
                {account.account_rank && (
                  <div className="bg-black/40 rounded-xl p-4 text-center">
                    <div className="text-lg font-black text-white mb-1">
                      {account.account_rank}
                    </div>
                    <div className="text-sm text-white/50">Rank</div>
                  </div>
                )}
                {avgRating > 0 && (
                  <div className="bg-black/40 rounded-xl p-4 text-center">
                    <div className="text-2xl font-black text-white mb-1 flex items-center justify-center gap-1">
                      <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                      {avgRating.toFixed(1)}
                    </div>
                    <div className="text-sm text-white/50">{reviews.length} Reviews</div>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-black text-white mb-3">Description</h3>
                <p className="text-white/70 leading-relaxed whitespace-pre-wrap">
                  {account.account_description}
                </p>
              </div>
            </div>

            {/* Reviews */}
            {reviews.length > 0 && (
              <div className="bg-slate-900 border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-black text-white mb-4">Reviews</h3>
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="bg-black/40 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-white" />
                          </div>
                          <span className="font-bold text-white">
                            {review.buyer?.username || "Anonymous"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating
                                  ? "text-yellow-500 fill-yellow-500"
                                  : "text-white/20"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-white/70 text-sm">{review.review_text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 sticky top-4 space-y-6">
              {/* Price */}
              <div>
                {account.original_price && account.original_price > account.price && (
                  <div className="text-lg text-white/50 line-through mb-1">
                    ₦{account.original_price.toLocaleString()}
                  </div>
                )}
                <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 mb-2">
                  ₦{account.price.toLocaleString()}
                </div>
                <div className="text-sm text-white/50">
                  Platform fee: 10% • Seller receives: ₦{(account.price * 0.9).toLocaleString()}
                </div>
              </div>

              {/* Purchase Button */}
              {!isSold && !isOwnAccount && (
                <button
                  onClick={handlePurchase}
                  disabled={purchasing}
                  className="w-full px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {purchasing ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                      Processing...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5" />
                      Buy Now
                    </>
                  )}
                </button>
              )}

              {isSold && (
                <div className="w-full px-6 py-4 bg-red-500/20 border border-red-500/50 text-red-500 font-bold rounded-xl text-center">
                  SOLD OUT
                </div>
              )}

              {isOwnAccount && (
                <div className="w-full px-6 py-4 bg-blue-500/20 border border-blue-500/50 text-blue-500 font-bold rounded-xl text-center">
                  YOUR LISTING
                </div>
              )}

              {/* Seller Info */}
              <div className="pt-6 border-t border-white/10">
                <h4 className="text-sm font-bold text-white/50 mb-3">SELLER</h4>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-white">
                      {seller?.username || "Anonymous"}
                    </div>
                    <div className="text-sm text-white/50">
                      {account.seller_type === "admin" ? "Official Seller" : "User Seller"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Security */}
              <div className="pt-6 border-t border-white/10">
                <h4 className="text-sm font-bold text-white/50 mb-3">SECURITY</h4>
                <div className="space-y-2 text-sm text-white/70">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Secure payment via wallet
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Account details after payment
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Buyer protection guarantee
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
