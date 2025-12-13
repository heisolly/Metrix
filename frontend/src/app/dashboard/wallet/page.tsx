"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { 
  Wallet,
  DollarSign,
  TrendingUp,
  Clock,
  Download,
  Upload,
  ArrowRight,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus
} from "lucide-react";
import { 
  getProfile,
  getUserTransactions, 
  createWithdrawalRequest,
  getUserWithdrawalRequests 
} from "@/lib/database";
import { getCurrentUser } from "@/lib/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function WalletPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [withdrawalAmount, setWithdrawalAmount] = useState("");
  const [bankDetails, setBankDetails] = useState({
    accountName: "",
    accountNumber: "",
    bankName: "",
    routingNumber: ""
  });
  const [balance, setBalance] = useState({
    available: 0,
    pending: 0,
    lifetimeEarned: 0
  });
  const [transactions, setTransactions] = useState<any[]>([]);
  const [withdrawalRequests, setWithdrawalRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    loadWalletData();
  }, []);

  const loadWalletData = async () => {
    try {
      setLoading(true);
      const currentUser = await getCurrentUser();
      setUser(currentUser);

      // Get profile for balance
      const profile = await getProfile(currentUser.id);
      setBalance({
        available: profile.available_balance || 0,
        pending: profile.pending_balance || 0,
        lifetimeEarned: profile.total_earnings || 0
      });

      // Get transactions
      const txns = await getUserTransactions(currentUser.id, 20);
      setTransactions(txns);

      // Get withdrawal requests
      const requests = await getUserWithdrawalRequests(currentUser.id);
      setWithdrawalRequests(requests);

    } catch (error) {
      console.error('Error loading wallet:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdrawal = () => {
    if (!withdrawalAmount || parseFloat(withdrawalAmount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }
    if (parseFloat(withdrawalAmount) > balance.available) {
      alert("Insufficient balance");
      return;
    }
    if (!bankDetails.accountName || !bankDetails.accountNumber || !bankDetails.bankName) {
      alert("Please fill in all bank details");
      return;
    }
    
    alert(`Withdrawal request for ₦${withdrawalAmount} submitted successfully!`);
    setWithdrawalAmount("");
    setBankDetails({ accountName: "", accountNumber: "", bankName: "", routingNumber: "" });
    setActiveTab("overview");
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case "processing":
        return <AlertCircle className="w-5 h-5 text-blue-500" />;
      case "failed":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-4 md:mb-8">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-white light:text-black mb-1 md:mb-2">
          WALLET
        </h1>
        <p className="text-sm md:text-base text-white light:text-black">
          Manage your earnings and withdrawals
        </p>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6 mb-4 md:mb-8">
        {[
          {
            label: "Available Balance",
            value: balance.available,
            sub: "Ready to withdraw",
            icon: DollarSign,
            color: "green",
            bg: "bg-gradient-to-br from-green-500/20 to-green-600/20 border-green-500/50"
          },
          {
            label: "Pending",
            value: balance.pending,
            sub: "Awaiting verification",
            icon: Clock,
            color: "white",
            bg: "bg-black/60 light:bg-white/80 border-white/10 light:border-black/10"
          },
          {
            label: "Lifetime Earned",
            value: balance.lifetimeEarned,
            sub: "Total earnings",
            icon: TrendingUp,
            color: "white",
            bg: "bg-black/60 light:bg-white/80 border-white/10 light:border-black/10"
          }
        ].map((card, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`${card.bg} border-2 rounded-xl md:rounded-2xl p-4 md:p-6`}
          >
            <div className="flex items-center gap-3 mb-3 md:mb-4">
              <div className={`w-10 h-10 md:w-12 md:h-12 bg-${card.color === 'green' ? 'green-500' : 'yellow-500'} rounded-lg md:rounded-xl flex items-center justify-center`}>
                <card.icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div className="text-sm font-bold text-white light:text-black">{card.label}</div>
            </div>
            <div className={`text-2xl md:text-4xl font-black ${card.color === 'green' ? 'text-green-500' : 'text-white light:text-black'} mb-1 md:mb-2`}>
              ₦{card.value.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-xs md:text-sm text-white/70 light:text-black/70">
              {card.sub}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4 md:mb-6 overflow-x-auto scrollbar-hide pb-2 border-b border-white/10 light:border-black/10">
        {[
          { key: "overview", label: "Transactions" },
          { key: "withdraw", label: "Withdraw Funds" },
          { key: "requests", label: "Withdrawal Requests" }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 md:px-6 md:py-3 font-bold transition-all whitespace-nowrap text-sm md:text-base ${
              activeTab === tab.key
                ? "text-red-500 border-b-2 border-red-500"
                : "text-white light:text-black hover:text-red-500"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === "overview" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-black/60 light:bg-white/80 border-2 border-white/10 light:border-black/10 rounded-xl md:rounded-2xl p-4 md:p-6"
        >
          <h2 className="text-lg md:text-2xl font-black text-white light:text-black mb-4 md:mb-6">
            TRANSACTION HISTORY
          </h2>

          {transactions.length > 0 ? (
            <div className="space-y-3 md:space-y-4">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 md:p-4 bg-white/5 light:bg-black/5 rounded-lg md:rounded-xl border border-white/10 light:border-black/10"
                >
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0 ${
                      transaction.type === "prize" 
                        ? "bg-green-500/20 border-2 border-green-500"
                        : transaction.type === "withdrawal"
                        ? "bg-blue-500/20 border-2 border-blue-500"
                        : "bg-red-500/20 border-2 border-red-500"
                    }`}>
                      {transaction.type === "prize" ? (
                        <Upload className="w-5 h-5 md:w-6 md:h-6 text-green-500" />
                      ) : transaction.type === "withdrawal" ? (
                        <Download className="w-5 h-5 md:w-6 md:h-6 text-blue-500" />
                      ) : (
                        <DollarSign className="w-5 h-5 md:w-6 md:h-6 text-red-500" />
                      )}
                    </div>

                    <div>
                      <div className="font-bold text-white light:text-black mb-0.5 md:mb-1 text-sm md:text-base line-clamp-1">
                        {transaction.description}
                      </div>
                      <div className="text-xs md:text-sm text-white/70 light:text-black/70">
                        {new Date(transaction.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <div className={`text-base md:text-xl font-black mb-0.5 md:mb-1 ${
                      transaction.amount > 0 ? "text-green-500" : "text-red-500"
                    }`}>
                      {transaction.amount > 0 ? "+" : ""}₦{Math.abs(transaction.amount).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div className="flex items-center gap-1.5 md:gap-2 justify-end">
                      {getStatusIcon(transaction.status)}
                      <span className="text-xs md:text-sm font-bold text-white/70 light:text-black/70 capitalize">
                        {transaction.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 md:py-20">
              <div className="w-16 h-16 md:w-24 md:h-24 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                <DollarSign className="w-8 h-8 md:w-12 md:h-12 text-blue-500" />
              </div>
              <h3 className="text-lg md:text-2xl font-black text-white light:text-black mb-2">
                No Transactions Yet
              </h3>
              <p className="text-sm md:text-base text-white/70 light:text-black/70 mb-6 md:mb-8">
                Your transaction history will appear here once you start competing
              </p>
              <Link
                href="/dashboard/tournaments"
                className="inline-flex items-center gap-2 px-6 py-3 md:px-8 md:py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold rounded-lg md:rounded-xl hover:from-red-600 hover:to-orange-600 transition-all shadow-lg shadow-red-500/20 text-sm md:text-base"
              >
                <Plus className="w-4 h-4 md:w-5 md:h-5" />
                Join Tournament
              </Link>
            </div>
          )}
        </motion.div>
      )}

      {activeTab === "withdraw" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-black/60 light:bg-white/80 border-2 border-white/10 light:border-black/10 rounded-xl md:rounded-2xl p-4 md:p-6"
        >
          <h2 className="text-lg md:text-2xl font-black text-white light:text-black mb-4 md:mb-6">
            WITHDRAW FUNDS
          </h2>

          <div className="space-y-4 md:space-y-6">
            {/* Amount */}
            <div>
              <label className="block text-xs md:text-sm font-bold text-white light:text-black mb-1.5 md:mb-2">
                Withdrawal Amount
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-500" />
                <input
                  type="number"
                  value={withdrawalAmount}
                  onChange={(e) => setWithdrawalAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-10 md:pl-12 pr-4 py-3 md:py-4 bg-white/5 light:bg-black/5 border-2 border-white/20 light:border-black/20 rounded-lg md:rounded-xl text-white light:text-black placeholder-gray-500 focus:border-red-500 focus:outline-none text-lg md:text-xl font-bold"
                />
              </div>
              <div className="mt-1.5 md:mt-2 text-xs md:text-sm text-white/70 light:text-black/70">
                Available: ₦{balance.available.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>

            {/* Bank Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              <div>
                <label className="block text-xs md:text-sm font-bold text-white light:text-black mb-1.5 md:mb-2">
                  Account Name
                </label>
                <input
                  type="text"
                  value={bankDetails.accountName}
                  onChange={(e) => setBankDetails({...bankDetails, accountName: e.target.value})}
                  placeholder="John Doe"
                  className="w-full px-3 py-2.5 md:px-4 md:py-3 bg-white/5 light:bg-black/5 border-2 border-white/20 light:border-black/20 rounded-lg md:rounded-xl text-white light:text-black placeholder-gray-500 focus:border-red-500 focus:outline-none text-sm md:text-base"
                />
              </div>

              <div>
                <label className="block text-xs md:text-sm font-bold text-white light:text-black mb-1.5 md:mb-2">
                  Account Number
                </label>
                <input
                  type="text"
                  value={bankDetails.accountNumber}
                  onChange={(e) => setBankDetails({...bankDetails, accountNumber: e.target.value})}
                  placeholder="1234567890"
                  className="w-full px-3 py-2.5 md:px-4 md:py-3 bg-white/5 light:bg-black/5 border-2 border-white/20 light:border-black/20 rounded-lg md:rounded-xl text-white light:text-black placeholder-gray-500 focus:border-red-500 focus:outline-none text-sm md:text-base"
                />
              </div>

              <div>
                <label className="block text-xs md:text-sm font-bold text-white light:text-black mb-1.5 md:mb-2">
                  Bank Name
                </label>
                <input
                  type="text"
                  value={bankDetails.bankName}
                  onChange={(e) => setBankDetails({...bankDetails, bankName: e.target.value})}
                  placeholder="Bank of America"
                  className="w-full px-3 py-2.5 md:px-4 md:py-3 bg-white/5 light:bg-black/5 border-2 border-white/20 light:border-black/20 rounded-lg md:rounded-xl text-white light:text-black placeholder-gray-500 focus:border-red-500 focus:outline-none text-sm md:text-base"
                />
              </div>

              <div>
                <label className="block text-xs md:text-sm font-bold text-white light:text-black mb-1.5 md:mb-2">
                  Routing Number (Optional)
                </label>
                <input
                  type="text"
                  value={bankDetails.routingNumber}
                  onChange={(e) => setBankDetails({...bankDetails, routingNumber: e.target.value})}
                  placeholder="123456789"
                  className="w-full px-3 py-2.5 md:px-4 md:py-3 bg-white/5 light:bg-black/5 border-2 border-white/20 light:border-black/20 rounded-lg md:rounded-xl text-white light:text-black placeholder-gray-500 focus:border-red-500 focus:outline-none text-sm md:text-base"
                />
              </div>
            </div>

            <button
              onClick={handleWithdrawal}
              className="w-full px-4 py-3 md:px-6 md:py-4 bg-red-500 text-white font-bold rounded-lg md:rounded-xl hover:bg-red-600 transition-colors flex items-center justify-center gap-2 text-sm md:text-base"
            >
              Request Withdrawal
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      )}

      {activeTab === "requests" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-black/60 light:bg-white/80 border-2 border-white/10 light:border-black/10 rounded-xl md:rounded-2xl p-4 md:p-6"
        >
          <h2 className="text-lg md:text-2xl font-black text-white light:text-black mb-4 md:mb-6">
            WITHDRAWAL REQUESTS
          </h2>

          <div className="space-y-3 md:space-y-4">
            {withdrawalRequests.map((request) => (
              <div
                key={request.id}
                className="p-3 md:p-4 bg-white/5 light:bg-black/5 rounded-lg md:rounded-xl border border-white/10 light:border-black/10"
              >
                <div className="flex items-center justify-between mb-3 md:mb-4">
                  <div>
                    <div className="text-lg md:text-2xl font-black text-white light:text-black mb-0.5 md:mb-1">
                      ₦{request.amount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div className="text-xs md:text-sm text-white/70 light:text-black/70">
                      Requested: {new Date(request.requestDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(request.status)}
                    <span className={`px-2 py-1 md:px-4 md:py-2 rounded-lg font-bold capitalize text-xs md:text-sm ${
                      request.status === "completed"
                        ? "bg-green-500/20 text-green-500 border border-green-500/30"
                        : "bg-blue-500/20 text-blue-500 border border-blue-500/30"
                    }`}>
                      {request.status}
                    </span>
                  </div>
                </div>
                {request.completedDate && (
                  <div className="text-xs md:text-sm text-white/70 light:text-black/70">
                    Completed: {new Date(request.completedDate).toLocaleString()}
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      )}

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
