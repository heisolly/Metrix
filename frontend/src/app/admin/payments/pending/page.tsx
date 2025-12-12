"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Clock, Eye, Image as ImageIcon, Calendar, DollarSign, User } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/auth";
import { useRouter } from "next/navigation";

interface PaymentProof {
  id: string;
  user_id: string;
  tournament_id: string;
  amount: number;
  payment_reference: string;
  proof_image_url: string;
  payment_date: string;
  notes: string;
  status: string;
  created_at: string;
  user: {
    username: string;
    email: string;
  };
  tournament: {
    name: string;
    entry_fee: number;
  };
}

export default function PendingPaymentsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState<PaymentProof[]>([]);
  const [filter, setFilter] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');
  const [selectedPayment, setSelectedPayment] = useState<PaymentProof | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadPayments();
  }, [filter]);

  const loadPayments = async () => {
    try {
      const user = await getCurrentUser();
      if (!user) {
        router.push("/admin/signin");
        return;
      }

      let query = supabase
        .from("manual_payment_proofs")
        .select(`
          *,
          user:profiles!manual_payment_proofs_user_id_fkey(username, email),
          tournament:tournaments(name, entry_fee)
        `)
        .order("created_at", { ascending: false });

      if (filter !== 'all') {
        query = query.eq('status', filter);
      }

      const { data, error } = await query;

      if (error) throw error;

      setPayments(data || []);
    } catch (error) {
      console.error("Error loading payments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (paymentId: string) => {
    if (!confirm("Approve this payment and add user to tournament?")) return;

    setProcessing(true);
    try {
      const user = await getCurrentUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase.rpc('approve_manual_payment', {
        payment_proof_id: paymentId,
        admin_id: user.id
      });

      if (error) throw error;

      if (data.success) {
        alert("✅ " + data.message);
        loadPayments();
        setSelectedPayment(null);
      } else {
        alert("❌ " + data.error);
      }
    } catch (error: any) {
      console.error("Error approving payment:", error);
      alert("Error: " + error.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async (paymentId: string) => {
    if (!rejectionReason.trim()) {
      alert("Please provide a reason for rejection");
      return;
    }

    if (!confirm("Reject this payment?")) return;

    setProcessing(true);
    try {
      const user = await getCurrentUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase.rpc('reject_manual_payment', {
        payment_proof_id: paymentId,
        admin_id: user.id,
        reason: rejectionReason
      });

      if (error) throw error;

      if (data.success) {
        alert("✅ " + data.message);
        loadPayments();
        setSelectedPayment(null);
        setRejectionReason("");
      } else {
        alert("❌ " + data.error);
      }
    } catch (error: any) {
      console.error("Error rejecting payment:", error);
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
    <div className="max-w-7xl mx-auto p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white mb-2">PENDING PAYMENTS</h1>
        <p className="text-white/70">Review and verify manual payment submissions</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-4 mb-8 flex-wrap">
        {[
          { value: 'pending', label: 'Pending', icon: Clock, color: 'yellow' },
          { value: 'approved', label: 'Approved', icon: CheckCircle, color: 'green' },
          { value: 'rejected', label: 'Rejected', icon: XCircle, color: 'red' },
          { value: 'all', label: 'All', icon: Eye, color: 'blue' }
        ].map(tab => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value as any)}
            className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${
              filter === tab.value
                ? `bg-${tab.color}-500 text-white shadow-lg shadow-${tab.color}-500/20`
                : 'bg-slate-900 text-white/50 hover:text-white'
            }`}
          >
            <tab.icon className="w-5 h-5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Payments List */}
      {payments.length === 0 ? (
        <div className="bg-slate-900 border border-white/10 rounded-2xl p-12 text-center">
          <Clock className="w-16 h-16 text-white/30 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No {filter} payments</h3>
          <p className="text-white/50">Payment submissions will appear here</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {payments.map(payment => (
            <motion.div
              key={payment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-900 border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    payment.status === 'pending' ? 'bg-yellow-500/20' :
                    payment.status === 'approved' ? 'bg-green-500/20' :
                    'bg-red-500/20'
                  }`}>
                    {payment.status === 'pending' && <Clock className="w-6 h-6 text-yellow-500" />}
                    {payment.status === 'approved' && <CheckCircle className="w-6 h-6 text-green-500" />}
                    {payment.status === 'rejected' && <XCircle className="w-6 h-6 text-red-500" />}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{payment.user.username}</h3>
                    <p className="text-white/50 text-sm">{payment.user.email}</p>
                  </div>
                </div>
                <span className={`px-4 py-2 rounded-full text-xs font-bold ${
                  payment.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' :
                  payment.status === 'approved' ? 'bg-green-500/20 text-green-500' :
                  'bg-red-500/20 text-red-500'
                }`}>
                  {payment.status.toUpperCase()}
                </span>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-white/70">
                    <User className="w-4 h-4" />
                    <span className="text-sm">Tournament: {payment.tournament.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/70">
                    <DollarSign className="w-4 h-4" />
                    <span className="text-sm">Amount: ₦{payment.amount}</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/70">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">Date: {new Date(payment.payment_date).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  {payment.payment_reference && (
                    <div className="text-white/70 text-sm">
                      <strong>Reference:</strong> {payment.payment_reference}
                    </div>
                  )}
                  {payment.notes && (
                    <div className="text-white/70 text-sm">
                      <strong>Notes:</strong> {payment.notes}
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 flex-wrap">
                {payment.proof_image_url && (
                  <a
                    href={payment.proof_image_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl transition-all flex items-center gap-2"
                  >
                    <ImageIcon className="w-4 h-4" />
                    View Proof
                  </a>
                )}
                
                {payment.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleApprove(payment.id)}
                      disabled={processing}
                      className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Approve
                    </button>
                    <button
                      onClick={() => setSelectedPayment(payment)}
                      disabled={processing}
                      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Rejection Modal */}
      {selectedPayment && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900 border border-white/10 rounded-2xl p-8 max-w-md w-full"
          >
            <h3 className="text-2xl font-black text-white mb-4">Reject Payment</h3>
            <p className="text-white/70 mb-4">
              Provide a reason for rejecting this payment from <strong>{selectedPayment.user.username}</strong>
            </p>
            
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g., Invalid payment proof, wrong amount, etc."
              rows={4}
              className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-red-500 focus:outline-none mb-4"
            />

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setSelectedPayment(null);
                  setRejectionReason("");
                }}
                className="flex-1 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReject(selectedPayment.id)}
                disabled={processing || !rejectionReason.trim()}
                className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-all disabled:opacity-50"
              >
                {processing ? "Rejecting..." : "Reject"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
