"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Save, 
  Key, 
  Lock, 
  Map, 
  Users,
  Play,
  Eye,
  EyeOff,
  Copy,
  Check
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function TournamentRoomPage() {
  const params = useParams();
  const router = useRouter();
  const tournamentId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tournament, setTournament] = useState<any>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    room_code: "",
    room_password: "",
    map_name: "",
    total_rounds: 1
  });

  useEffect(() => {
    loadTournament();
  }, []);

  const loadTournament = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tournaments')
        .select('*')
        .eq('id', tournamentId)
        .single();

      if (error) throw error;

      if (data) {
        setTournament(data);
        setFormData({
          room_code: data.room_code || "",
          room_password: data.room_password || "",
          map_name: data.map_name || "",
          total_rounds: data.total_rounds || 1
        });
      }
    } catch (error) {
      console.error('Error loading tournament:', error);
      alert('Failed to load tournament');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { error } = await supabase
        .from('tournaments')
        .update({
          room_code: formData.room_code,
          room_password: formData.room_password,
          map_name: formData.map_name,
          total_rounds: formData.total_rounds
        })
        .eq('id', tournamentId);

      if (error) throw error;

      alert('Room details updated successfully!');
      await loadTournament();
    } catch (error: any) {
      console.error('Error updating room:', error);
      alert(`Failed to update room: ${error.message || 'Unknown error'}`);
    } finally {
      setSaving(false);
    }
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  };

  const startTournament = async () => {
    if (!formData.room_code || !formData.room_password) {
      alert('Please set room code and password first!');
      return;
    }

    if (confirm('Start this tournament? Participants will be able to see room details.')) {
      try {
        const { error } = await supabase
          .from('tournaments')
          .update({ 
            status: 'ongoing',
            current_round: 1
          })
          .eq('id', tournamentId);

        if (error) throw error;

        // Create first round
        await supabase
          .from('tournament_rounds')
          .insert({
            tournament_id: tournamentId,
            round_number: 1,
            status: 'in_progress',
            start_time: new Date().toISOString(),
            map_name: formData.map_name
          });

        alert('Tournament started!');
        router.push(`/admin/tournaments/${tournamentId}/live`);
      } catch (error: any) {
        console.error('Error starting tournament:', error);
        alert(`Failed to start tournament: ${error.message}`);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 text-white/50 hover:text-white mb-8 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-bold">Back to Tournament</span>
      </button>

      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Key className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white">ROOM SETUP</h1>
            <p className="text-white/70">{tournament?.name}</p>
          </div>
        </div>

        {tournament?.status === 'upcoming' && (
          <button
            onClick={startTournament}
            className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-green-500/20 flex items-center gap-2"
          >
            <Play className="w-5 h-5" />
            Start Tournament
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Room Details Card */}
        <div className="bg-slate-900 border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-black text-white mb-6 flex items-center gap-2">
            <Map className="w-5 h-5 text-blue-500" />
            Room Details
          </h3>

          <div className="space-y-6">
            {/* Room Code */}
            <div>
              <label className="block text-sm font-bold text-white mb-2">
                Room Code <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="room_code"
                  value={formData.room_code}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 pr-12 bg-black/40 border border-white/10 rounded-xl text-white focus:border-blue-500 focus:outline-none font-mono text-lg"
                  placeholder="e.g., 123456789"
                />
                <button
                  type="button"
                  onClick={() => copyToClipboard(formData.room_code, 'code')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  {copied === 'code' ? (
                    <Check className="w-5 h-5 text-green-500" />
                  ) : (
                    <Copy className="w-5 h-5 text-white/50" />
                  )}
                </button>
              </div>
            </div>

            {/* Room Password */}
            <div>
              <label className="block text-sm font-bold text-white mb-2">
                Room Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="room_password"
                  value={formData.room_password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 pr-24 bg-black/40 border border-white/10 rounded-xl text-white focus:border-blue-500 focus:outline-none font-mono text-lg"
                  placeholder="Enter password"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5 text-white/50" />
                    ) : (
                      <Eye className="w-5 h-5 text-white/50" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(formData.room_password, 'password')}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    {copied === 'password' ? (
                      <Check className="w-5 h-5 text-green-500" />
                    ) : (
                      <Copy className="w-5 h-5 text-white/50" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Map Name */}
            <div>
              <label className="block text-sm font-bold text-white mb-2">
                Map Name
              </label>
              <input
                type="text"
                name="map_name"
                value={formData.map_name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-blue-500 focus:outline-none"
                placeholder="e.g., Erangel, Miramar, Bermuda"
              />
            </div>

            {/* Total Rounds */}
            <div>
              <label className="block text-sm font-bold text-white mb-2">
                Total Rounds
              </label>
              <input
                type="number"
                name="total_rounds"
                value={formData.total_rounds}
                onChange={handleChange}
                min={1}
                max={10}
                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Participant Count */}
        <div className="bg-slate-900 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 text-purple-500" />
              <div>
                <h3 className="text-lg font-black text-white">Participants</h3>
                <p className="text-sm text-white/50">
                  {tournament?.current_participants || 0} / {tournament?.max_participants} players registered
                </p>
              </div>
            </div>
            <div className="text-3xl font-black text-white">
              {tournament?.current_participants || 0}
            </div>
          </div>
        </div>

        {/* Submit Button */}
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
            disabled={saving}
            className="px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {saving ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save Room Details
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
