"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Shield, 
  Ban, 
  CheckCircle,
  Mail,
  Gamepad2,
  DollarSign
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all"); // 'all', 'active', 'banned', 'admins'

  useEffect(() => {
    loadUsers();
  }, [filter]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (filter === 'banned') {
        query = query.eq('is_banned', true);
      } else if (filter === 'admins') {
        query = query.eq('is_admin', true);
      } else if (filter === 'active') {
        query = query.eq('is_banned', false);
      }

      const { data, error } = await query;

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((user) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      (user.username?.toLowerCase() || '').includes(searchLower) ||
      (user.email?.toLowerCase() || '').includes(searchLower) ||
      (user.full_name?.toLowerCase() || '').includes(searchLower)
    );
  });

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-white mb-2">
            USER MANAGEMENT
          </h1>
          <p className="text-white/70">
            Manage players, admins, and account statuses
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-slate-800 rounded-lg p-1 flex">
            {['all', 'active', 'banned', 'admins'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-md font-bold text-sm capitalize transition-all {
                  filter === f
                    ? 'bg-red-500 text-white shadow-lg'
                    : 'text-white/50 hover:text-white'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Search and Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="md:col-span-2 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
          <input
            type="text"
            placeholder="Search by username, email, or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-slate-900 border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-red-500 focus:outline-none transition-all"
          />
        </div>
        
        <div className="bg-slate-900 border border-white/10 rounded-xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
            <Gamepad2 className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <div className="text-2xl font-black text-white">{users.length}</div>
            <div className="text-xs text-white/50">Total Users</div>
          </div>
        </div>

        <div className="bg-slate-900 border border-white/10 rounded-xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
            <Ban className="w-6 h-6 text-red-500" />
          </div>
          <div>
            <div className="text-2xl font-black text-white">
              {users.filter(u => u.is_banned).length}
            </div>
            <div className="text-xs text-white/50">Banned Users</div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-slate-900 border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-white/5 border-b border-white/10">
                <th className="px-6 py-4 text-left text-xs font-bold text-white/50 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white/50 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white/50 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white/50 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-white/50 uppercase tracking-wider">Earnings</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-white/50 uppercase tracking-wider">Actions</th>
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
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-slate-700 to-slate-800 rounded-full flex items-center justify-center text-white font-bold text-sm border border-white/10">
                          {user.username ? user.username.charAt(0).toUpperCase() : <Mail className="w-4 h-4" />}
                        </div>
                        <div>
                          <div className="font-bold text-white text-sm">
                            {user.username || 'No Username'}
                          </div>
                          <div className="text-xs text-white/50">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.is_admin ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-500/10 text-red-500 rounded-full text-xs font-bold border border-red-500/20">
                          <Shield className="w-3 h-3" />
                          Admin
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 text-blue-500 rounded-full text-xs font-bold border border-blue-500/20">
                          <Gamepad2 className="w-3 h-3" />
                          {user.role || 'Player'}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.is_banned ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-700 text-white/70 rounded-full text-xs font-bold">
                          <Ban className="w-3 h-3" />
                          Banned
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-xs font-bold border border-green-500/20">
                          <CheckCircle className="w-3 h-3" />
                          Active
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white/70">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <span className="text-green-500 font-bold">
                        {(user.total_earnings || 0).toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <Link
                        href={`/admin/users/${user.id}`}
                        className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-xs font-bold rounded-lg transition-all inline-flex items-center gap-2"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-white/50">
                    No users found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
