"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Eye, CheckCircle, XCircle, Clock, Search, Filter } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function SpectatorApplicationsPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "approved" | "rejected">("all");

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('spectator_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      console.error('Error loading applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: "approved" | "rejected", notes?: string) => {
    try {
      const { error } = await supabase
        .from('spectator_applications')
        .update({ status, notes })
        .eq('id', id);

      if (error) throw error;

      alert(`Application ${status}!`);
      loadApplications();
    } catch (error: any) {
      console.error('Error updating status:', error);
      alert(`Failed to update: ${error.message}`);
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         app.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || app.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-700 border-green-300';
      case 'rejected': return 'bg-red-100 text-red-700 border-red-300';
      default: return 'bg-yellow-100 text-yellow-700 border-yellow-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-black text-white mb-2">Spectator Applications</h1>
        <p className="text-white/70">Review and manage spectator applications</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-slate-900 border border-white/10 rounded-2xl p-6">
          <div className="text-sm text-white/50 mb-1">Total</div>
          <div className="text-3xl font-black text-white">{applications.length}</div>
        </div>
        <div className="bg-slate-900 border border-yellow-500/30 rounded-2xl p-6">
          <div className="text-sm text-yellow-500 mb-1">Pending</div>
          <div className="text-3xl font-black text-white">
            {applications.filter(a => a.status === 'pending').length}
          </div>
        </div>
        <div className="bg-slate-900 border border-green-500/30 rounded-2xl p-6">
          <div className="text-sm text-green-500 mb-1">Approved</div>
          <div className="text-3xl font-black text-white">
            {applications.filter(a => a.status === 'approved').length}
          </div>
        </div>
        <div className="bg-slate-900 border border-red-500/30 rounded-2xl p-6">
          <div className="text-sm text-red-500 mb-1">Rejected</div>
          <div className="text-3xl font-black text-white">
            {applications.filter(a => a.status === 'rejected').length}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-900 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:border-red-500 focus:outline-none"
          />
        </div>

        <div className="flex gap-2">
          {(['all', 'pending', 'approved', 'rejected'] as const).map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-6 py-3 rounded-xl font-bold whitespace-nowrap transition-all {
                filterStatus === status
                  ? "bg-red-500 text-white"
                  : "bg-slate-900 text-white/70 border border-white/10 hover:text-white"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredApplications.length === 0 ? (
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-12 text-center">
            <Eye className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No applications found</h3>
            <p className="text-white/50">Try adjusting your search or filter</p>
          </div>
        ) : (
          filteredApplications.map((app, index) => (
            <motion.div
              key={app.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-slate-900 border border-white/10 rounded-2xl p-6 hover:border-red-500/50 transition-all"
            >
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Left: Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-black text-white mb-1">{app.name}</h3>
                      <div className="flex flex-wrap gap-2 text-sm text-white/70">
                        <span>{app.email}</span>
                        <span>•</span>
                        <span>{app.phone}</span>
                      </div>
                    </div>
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold border-2 ${getStatusColor(app.status)}`}>
                      {getStatusIcon(app.status)}
                      {app.status.toUpperCase()}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-xs text-white/50 mb-1">Games</div>
                      <div className="flex flex-wrap gap-1">
                        {app.games.map((game: string, i: number) => (
                          <span key={i} className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs font-semibold">
                            {game}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-white/50 mb-1">Availability</div>
                      <div className="text-white font-semibold capitalize">{app.availability}</div>
                    </div>
                  </div>

                  {app.experience && (
                    <div className="mb-4">
                      <div className="text-xs text-white/50 mb-1">Experience</div>
                      <div className="text-white/80 text-sm">{app.experience}</div>
                    </div>
                  )}

                  {app.notes && (
                    <div className="mb-4">
                      <div className="text-xs text-white/50 mb-1">Admin Notes</div>
                      <div className="text-white/80 text-sm italic">{app.notes}</div>
                    </div>
                  )}

                  <div className="text-xs text-white/40">
                    Applied: {new Date(app.created_at).toLocaleString()}
                  </div>
                </div>

                {/* Right: Actions */}
                {app.status === 'pending' && (
                  <div className="flex flex-col gap-3 lg:w-48">
                    <button
                      onClick={() => {
                        const notes = prompt("Add notes (optional):");
                        updateStatus(app.id, 'approved', notes || undefined);
                      }}
                      className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Approve
                    </button>
                    <button
                      onClick={() => {
                        const notes = prompt("Reason for rejection:");
                        if (notes) {
                          updateStatus(app.id, 'rejected', notes);
                        }
                      }}
                      className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                      <XCircle className="w-5 h-5" />
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
