"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Save, Trophy, Calendar, DollarSign, Users, Gamepad2, Info } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/auth";

export default function CreateTournamentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    game: "cod_mobile", // default
    platform: "mobile",
    description: "",
    prize_pool: 0,
    entry_fee: 0,
    max_participants: 32,
    start_date: "",
    start_time: "",
    region: "Global",
    mode: "Solo",
    rules: "",
    format: "single_elimination",
    require_spectator: true,
    spectator_pay_rate: 5
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.checked
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = await getCurrentUser();
      if (!user) throw new Error("Not authenticated");

      // Combine date and time
      const startDateTime = new Date(`${formData.start_date}T${formData.start_time}`);

      const { data, error } = await supabase
        .from('tournaments')
        .insert({
          name: formData.name,
          game: formData.game,
          platform: formData.platform,
          description: formData.description,
          prize_pool: formData.prize_pool,
          entry_fee: formData.entry_fee,
          max_participants: formData.max_participants,
          current_participants: 0,
          status: 'upcoming',
          start_date: startDateTime.toISOString(),
          region: formData.region,
          mode: formData.mode,
          rules: formData.rules,
          format: formData.format,
          require_spectator: formData.require_spectator,
          spectator_pay_rate: formData.spectator_pay_rate
        })
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      alert('Tournament created successfully!');
      router.push('/admin/tournaments');
    } catch (error: any) {
      console.error('Error creating tournament:', error);
      alert(`Failed to create tournament: ${error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 text-white/50 hover:text-white mb-8 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-bold">Back to Tournaments</span>
      </button>

      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 bg-red-500 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/20">
          <Trophy className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-white">CREATE TOURNAMENT</h1>
          <p className="text-white/70">Set up a new competitive event</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <div className="bg-slate-900 border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-black text-white mb-6 flex items-center gap-2">
            <Info className="w-5 h-5 text-blue-500" />
            Basic Information
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-white mb-2">Tournament Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-red-500 focus:outline-none"
                placeholder="e.g. Summer Championship 2024"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-white mb-2">Game</label>
              <select
                name="game"
                value={formData.game}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-red-500 focus:outline-none appearance-none"
              >
                <option value="cod_mobile">Call of Duty: Mobile</option>
                <option value="pubg_mobile">PUBG Mobile</option>
                <option value="free_fire">Free Fire</option>
                <option value="fortnite">Fortnite</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-white mb-2">Platform</label>
              <select
                name="platform"
                value={formData.platform}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-red-500 focus:outline-none appearance-none"
              >
                <option value="mobile">Mobile</option>
                <option value="pc">PC</option>
                <option value="ps5">PlayStation 5</option>
                <option value="xbox">Xbox Series X</option>
                <option value="crossplay">Crossplay</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-white mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-red-500 focus:outline-none"
                placeholder="Brief description of the tournament..."
              />
            </div>
          </div>
        </div>

        {/* Format & Schedule */}
        <div className="bg-slate-900 border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-black text-white mb-6 flex items-center gap-2">
            <Gamepad2 className="w-5 h-5 text-purple-500" />
            Format & Schedule
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-white mb-2">Start Date</label>
              <input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-red-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-white mb-2">Start Time</label>
              <input
                type="time"
                name="start_time"
                value={formData.start_time}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-red-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-white mb-2">Format</label>
              <select
                name="format"
                value={formData.format}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-red-500 focus:outline-none appearance-none"
              >
                <option value="single_elimination">Single Elimination</option>
                <option value="double_elimination">Double Elimination</option>
                <option value="battle_royale">Battle Royale</option>
                <option value="round_robin">Round Robin</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-white mb-2">Max Participants</label>
              <input
                type="number"
                name="max_participants"
                value={formData.max_participants}
                onChange={handleChange}
                min={2}
                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-red-500 focus:outline-none"
              />
            </div>

             <div>
              <label className="block text-sm font-bold text-white mb-2">Game Mode</label>
              <select
                name="mode"
                value={formData.mode}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-red-500 focus:outline-none appearance-none"
              >
                <option value="Solo">Solo</option>
                <option value="Duos">Duos</option>
                <option value="Squads">Squads</option>
                <option value="5v5">5v5</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-white mb-2">Region</label>
              <select
                name="region"
                value={formData.region}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-red-500 focus:outline-none appearance-none"
              >
                <option value="Global">Global</option>
                <option value="North America">North America</option>
                <option value="Europe">Europe</option>
                <option value="Asia">Asia</option>
                <option value="Africa">Africa</option>
              </select>
            </div>
          </div>
        </div>

        {/* Prize & Entry */}
        <div className="bg-slate-900 border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-black text-white mb-6 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-500" />
            Financials
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-white mb-2">Prize Pool ()</label>
              <input
                type="number"
                name="prize_pool"
                value={formData.prize_pool}
                onChange={handleChange}
                min={0}
                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-red-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-white mb-2">Entry Fee ()</label>
              <input
                type="number"
                name="entry_fee"
                value={formData.entry_fee}
                onChange={handleChange}
                min={0}
                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-red-500 focus:outline-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-white mb-2">Spectator Pay Rate ( per match)</label>
              <input
                type="number"
                name="spectator_pay_rate"
                value={formData.spectator_pay_rate}
                onChange={handleChange}
                min={0}
                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-red-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-3 pt-8">
               <input
                type="checkbox"
                id="require_spectator"
                name="require_spectator"
                checked={formData.require_spectator}
                onChange={handleCheckboxChange}
                className="w-5 h-5 rounded bg-black/40 border-white/10 text-red-500 focus:ring-red-500"
              />
              <label htmlFor="require_spectator" className="text-sm font-bold text-white">
                Require Spectators for Matches
              </label>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-4 rounded-xl font-bold text-white hover:text-white/80 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
                Creating...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Create Tournament
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
