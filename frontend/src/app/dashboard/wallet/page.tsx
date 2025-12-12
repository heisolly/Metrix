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
      <div className="mb-8">
        <h1 className="text-4xl font-black text-white light:text-black mb-2">
          WALLET
        </h1>
        <p className="text-white light:text-black">
          Manage your earnings and withdrawals
        </p>
      </div>

      {/* Balance Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-green-500/20 to-green-600/20 border-2 border-green-500/50 rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div className="text-sm font-bold text-white light:text-black">Available Balance</div>
          </div>
          <div className="text-4xl font-black text-green-500 mb-2">
            ₦{balance.available.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-sm text-white/70 light:text-black/70">
            Ready to withdraw
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-black/60 light:bg-white/80 border-2 border-white/10 light:border-black/10 rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div className="text-sm font-bold text-white light:text-black">Pending</div>
          </div>
          <div className="text-4xl font-black text-white light:text-black mb-2">
            ₦{balance.pending.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-sm text-white/70 light:text-black/70">
            Awaiting verification
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-black/60 light:bg-white/80 border-2 border-white/10 light:border-black/10 rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div className="text-sm font-bold text-white light:text-black">Lifetime Earned</div>
          </div>
          <div className="text-4xl font-black text-white light:text-black mb-2">
            ₦{balance.lifetimeEarned.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-sm text-white/70 light:text-black/70">
            Total earnings
          </div>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-white/10 light:border-black/10">
        {[
          { key: "overview", label: "Transactions" },
          { key: "withdraw", label: "Withdraw Funds" },
          { key: "requests", label: "Withdrawal Requests" }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-6 py-3 font-bold transition-all ${
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
          className="bg-black/60 light:bg-white/80 border-2 border-white/10 light:border-black/10 rounded-2xl p-6"
        >
          <h2 className="text-2xl font-black text-white light:text-black mb-6">
            TRANSACTION HISTORY
          </h2>

          {transactions.length > 0 ? (
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 bg-white/5 light:bg-black/5 rounded-xl border border-white/10 light:border-black/10"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      transaction.type === "prize" 
                        ? "bg-green-500/20 border-2 border-green-500"
                        : transaction.type === "withdrawal"
                        ? "bg-blue-500/20 border-2 border-blue-500"
                        : "bg-red-500/20 border-2 border-red-500"
                    }`}>
                      {transaction.type === "prize" ? (
                        <Upload className="w-6 h-6 text-green-500" />
                      ) : transaction.type === "withdrawal" ? (
                        <Download className="w-6 h-6 text-blue-500" />
                      ) : (
                        <DollarSign className="w-6 h-6 text-red-500" />
                      )}
                    </div>

                    <div>
                      <div className="font-bold text-white light:text-black mb-1">
                        {transaction.description}
                      </div>
                      <div className="text-sm text-white/70 light:text-black/70">
                        {new Date(transaction.created_at).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className={`text-xl font-black mb-1 ${
                      transaction.amount > 0 ? "text-green-500" : "text-red-500"
                    }`}>
                      {transaction.amount > 0 ? "+" : ""}₦{Math.abs(transaction.amount).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div className="flex items-center gap-2 justify-end">
                      {getStatusIcon(transaction.status)}
                      <span className="text-sm font-bold text-white/70 light:text-black/70 capitalize">
                        {transaction.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <DollarSign className="w-12 h-12 text-blue-500" />
              </div>
              <h3 className="text-2xl font-black text-white light:text-black mb-2">
                No Transactions Yet
              </h3>
              <p className="text-white/70 light:text-black/70 mb-8">
                Your transaction history will appear here once you start competing
              </p>
              <Link
                href="/dashboard/tournaments"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold rounded-xl hover:from-red-600 hover:to-orange-600 transition-all shadow-lg shadow-red-500/20"
              >
                <Plus className="w-5 h-5" />
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
          className="bg-black/60 light:bg-white/80 border-2 border-white/10 light:border-black/10 rounded-2xl p-6"
        >
          <h2 className="text-2xl font-black text-white light:text-black mb-6">
            WITHDRAW FUNDS
          </h2>

          <div className="space-y-6">
            {/* Amount */}
            <div>
              <label className="block text-sm font-bold text-white light:text-black mb-2">
                Withdrawal Amount
              </label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="number"
                  value={withdrawalAmount}
                  onChange={(e) => setWithdrawalAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-12 pr-4 py-4 bg-white/5 light:bg-black/5 border-2 border-white/20 light:border-black/20 rounded-xl text-white light:text-black placeholder-gray-500 focus:border-red-500 focus:outline-none text-xl font-bold"
                />
              </div>
              <div className="mt-2 text-sm text-white/70 light:text-black/70">
                Available: ₦{balance.available.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>

            {/* Bank Details */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-white light:text-black mb-2">
                  Account Name
                </label>
                <input
                  type="text"
                  value={bankDetails.accountName}
                  onChange={(e) => setBankDetails({...bankDetails, accountName: e.target.value})}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 bg-white/5 light:bg-black/5 border-2 border-white/20 light:border-black/20 rounded-xl text-white light:text-black placeholder-gray-500 focus:border-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-white light:text-black mb-2">
                  Account Number
                </label>
                <input
                  type="text"
                  value={bankDetails.accountNumber}
                  onChange={(e) => setBankDetails({...bankDetails, accountNumber: e.target.value})}
                  placeholder="1234567890"
                  className="w-full px-4 py-3 bg-white/5 light:bg-black/5 border-2 border-white/20 light:border-black/20 rounded-xl text-white light:text-black placeholder-gray-500 focus:border-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-white light:text-black mb-2">
                  Bank Name
                </label>
                <input
                  type="text"
                  value={bankDetails.bankName}
                  onChange={(e) => setBankDetails({...bankDetails, bankName: e.target.value})}
                  placeholder="Bank of America"
                  className="w-full px-4 py-3 bg-white/5 light:bg-black/5 border-2 border-white/20 light:border-black/20 rounded-xl text-white light:text-black placeholder-gray-500 focus:border-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-white light:text-black mb-2">
                  Routing Number (Optional)
                </label>
                <input
                  type="text"
                  value={bankDetails.routingNumber}
                  onChange={(e) => setBankDetails({...bankDetails, routingNumber: e.target.value})}
                  placeholder="123456789"
                  className="w-full px-4 py-3 bg-white/5 light:bg-black/5 border-2 border-white/20 light:border-black/20 rounded-xl text-white light:text-black placeholder-gray-500 focus:border-red-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              onClick={handleWithdrawal}
              className="w-full px-6 py-4 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
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
          className="bg-black/60 light:bg-white/80 border-2 border-white/10 light:border-black/10 rounded-2xl p-6"
        >
          <h2 className="text-2xl font-black text-white light:text-black mb-6">
            WITHDRAWAL REQUESTS
          </h2>

          <div className="space-y-4">
            {withdrawalRequests.map((request) => (
              <div
                key={request.id}
                className="p-4 bg-white/5 light:bg-black/5 rounded-xl border border-white/10 light:border-black/10"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-2xl font-black text-white light:text-black mb-1">
                      ₦{request.amount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div className="text-sm text-white/70 light:text-black/70">
                      Requested: {new Date(request.requestDate).toLocaleString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(request.status)}
                    <span className={`px-4 py-2 rounded-lg font-bold capitalize ${
                      request.status === "completed"
                        ? "bg-green-500/20 text-green-500 border border-green-500/30"
                        : "bg-blue-500/20 text-blue-500 border border-blue-500/30"
                    }`}>
                      {request.status}
                    </span>
                  </div>
                </div>
                {request.completedDate && (
                  <div className="text-sm text-white/70 light:text-black/70">
                    Completed: {new Date(request.completedDate).toLocaleString()}
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
