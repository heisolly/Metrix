"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Save, Gamepad2, Users, Calendar, Clock } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function CreateMatchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tournamentId = searchParams.get('tournament');

  const [loading, setLoading] = useState(false);
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [players, setPlayers] = useState<any[]>([]);
  const [spectators, setSpectators] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    tournament_id: tournamentId || "",
    player1_id: "",
    player2_id: "",
    spectator_id: "",
    round: 1,
    scheduled_time: "",
    scheduled_date: ""
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load tournaments
      const { data: tournamentsData } = await supabase
        .from('tournaments')
        .select('*')
        .in('status', ['upcoming', 'ongoing'])
        .order('start_date', { ascending: true });
      
      setTournaments(tournamentsData || []);

      // Load players
      const { data: playersData } = await supabase
        .from('profiles')
        .select('id, username, email')
        .eq('is_banned', false)
        .order('username', { ascending: true });
      
      setPlayers(playersData || []);

      // Load active spectators
      const { data: spectatorsData } = await supabase
        .from('spectators')
        .select('id, user:profiles(id, username)')
        .eq('status', 'active');
      
      setSpectators(spectatorsData || []);

    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate
      if (formData.player1_id === formData.player2_id) {
        alert("Player 1 and Player 2 must be different!");
        setLoading(false);
        return;
      }

      // Combine date and time
      const scheduledDateTime = new Date(`${formData.scheduled_date}T${formData.scheduled_time}`);

      // Get the highest match_number for this tournament to assign next number
      const { data: existingMatches } = await supabase
        .from('matches')
        .select('match_number')
        .eq('tournament_id', formData.tournament_id)
        .order('match_number', { ascending: false })
        .limit(1);

      const nextMatchNumber = existingMatches && existingMatches.length > 0 
        ? (existingMatches[0].match_number || 0) + 1 
        : 1;

      const { data, error } = await supabase
        .from('matches')
        .insert({
          tournament_id: formData.tournament_id,
          player1_id: formData.player1_id,
          player2_id: formData.player2_id,
          spectator_id: formData.spectator_id || null,
          round: parseInt(formData.round.toString()),
          match_number: nextMatchNumber,
          scheduled_time: scheduledDateTime.toISOString(),
          status: 'scheduled',
          match_code: `${formData.tournament_id.slice(0, 8)}-R${formData.round}-M${nextMatchNumber}`
        })
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      alert('Match created successfully!');
      router.push(`/admin/tournaments/${formData.tournament_id}`);
    } catch (error: any) {
      console.error('Error creating match:', error);
      alert(`Failed to create match: ${error.message || 'Unknown error'}`);
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
        <span className="font-bold">Back</span>
      </button>

      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
          <Gamepad2 className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-white">CREATE MATCH</h1>
          <p className="text-white/70">Schedule a new competitive match</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Tournament Selection */}
        <div className="bg-slate-900 border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-black text-white mb-6">Tournament</h3>
          
          <div>
            <label className="block text-sm font-bold text-white mb-2">Select Tournament</label>
            <select
              name="tournament_id"
              value={formData.tournament_id}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-red-500 focus:outline-none appearance-none"
            >
              <option value="">Choose a tournament...</option>
              {tournaments.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.game}) - {t.status}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Players Selection */}
        <div className="bg-slate-900 border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-black text-white mb-6 flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-500" />
            Players
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-white mb-2">Player 1</label>
              <select
                name="player1_id"
                value={formData.player1_id}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-red-500 focus:outline-none appearance-none"
              >
                <option value="">Select Player 1...</option>
                {players.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.username || p.email}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-white mb-2">Player 2</label>
              <select
                name="player2_id"
                value={formData.player2_id}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-red-500 focus:outline-none appearance-none"
              >
                <option value="">Select Player 2...</option>
                {players.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.username || p.email}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Match Details */}
        <div className="bg-slate-900 border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-black text-white mb-6 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-green-500" />
            Match Details
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-white mb-2">Round</label>
              <input
                type="number"
                name="round"
                value={formData.round}
                onChange={handleChange}
                min={1}
                required
                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-red-500 focus:outline-none"
              />
            </div>



            <div>
              <label className="block text-sm font-bold text-white mb-2">Scheduled Date</label>
              <input
                type="date"
                name="scheduled_date"
                value={formData.scheduled_date}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-red-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-white mb-2">Scheduled Time</label>
              <input
                type="time"
                name="scheduled_time"
                value={formData.scheduled_time}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-red-500 focus:outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-white mb-2">Assign Spectator (Optional)</label>
              <select
                name="spectator_id"
                value={formData.spectator_id}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-red-500 focus:outline-none appearance-none"
              >
                <option value="">No spectator assigned</option>
                {spectators.map((s: any) => (
                  <option key={s.id} value={s.user?.id}>
                    {s.user?.username}
                  </option>
                ))}
              </select>
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
            className="px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
                Create Match
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
