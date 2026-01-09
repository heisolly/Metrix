"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  DollarSign, 
  Download, 
  Upload, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Search,
  Filter,
  CreditCard
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AdminPaymentsPage() {
  const [activeTab, setActiveTab] = useState("withdrawals");
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'withdrawals') {
        const { data } = await supabase
          .from('withdrawal_requests')
          .select(`
            *,
            user:profiles(username, email)
          `)
          .order('request_date', { ascending: false });
        
        setWithdrawals(data || []);
      }
      // Can add other tabs logic here later
    } catch (error) {
      console.error('Error loading payments data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    if (!confirm(`Mark this request as ${status}?`)) return;

    try {
      const { error } = await supabase
        .from('withdrawal_requests')
        .update({ status, completed_date: status === 'completed' ? new Date().toISOString() : null })
        .eq('id', id);

      if (error) throw error;
      loadData(); // Refresh
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-white mb-2">
            PAYMENTS & PAYOUTS
          </h1>
          <p className="text-white/70">
            Manage withdrawals and platform finances
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b border-white/10">
        <button
          onClick={() => setActiveTab('withdrawals')}
          className={`px-6 py-3 font-bold text-sm transition-all border-b-2 {
            activeTab === 'withdrawals'
              ? 'text-red-500 border-red-500'
              : 'text-white/50 border-transparent hover:text-white'
          }`}
        >
          Withdrawals
        </button>
        <button
          onClick={() => setActiveTab('revenue')}
          className={`px-6 py-3 font-bold text-sm transition-all border-b-2 {
            activeTab === 'revenue'
              ? 'text-red-500 border-red-500'
              : 'text-white/50 border-transparent hover:text-white'
          }`}
        >
          Platform Revenue
        </button>
      </div>

      {activeTab === 'withdrawals' ? (
        <div className="bg-slate-900 border border-white/10 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  <th className="px-6 py-4 text-left text-xs font-bold text-white/50 uppercase">User</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white/50 uppercase">Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white/50 uppercase">Bank Details</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white/50 uppercase">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white/50 uppercase">Date</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-white/50 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-20 text-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full mx-auto"
                      />
                    </td>
                  </tr>
                ) : withdrawals.length > 0 ? (
                  withdrawals.map((req) => (
                    <tr key={req.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-white text-sm">{req.user?.username}</div>
                        <div className="text-xs text-white/50">{req.user?.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-black text-white text-lg">{parseFloat(req.amount).toFixed(2)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-white font-bold">{req.bank_name}</div>
                        <div className="text-xs text-white/50">{req.account_number}</div>
                        <div className="text-xs text-white/50 uppercase">{req.account_name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold capitalize {
                          req.status === 'completed' ? 'bg-green-500/10 text-green-500' :
                          req.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' :
                          'bg-red-500/10 text-red-500'
                        }`}>
                          {req.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-white/50">
                        {new Date(req.request_date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {req.status === 'pending' && (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleStatusUpdate(req.id, 'completed')}
                              className="p-2 bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white rounded-lg transition-all"
                              title="Mark as Paid"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(req.id, 'rejected')}
                              className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all"
                              title="Reject"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-white/50">
                      No withdrawal requests found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-20 bg-slate-900 border border-white/10 rounded-2xl border-dashed">
          <DollarSign className="w-16 h-16 text-white/10 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Revenue Analytics Coming Soon</h3>
          <p className="text-white/50">This feature is under development.</p>
        </div>
      )}
    </div>
  );
}
