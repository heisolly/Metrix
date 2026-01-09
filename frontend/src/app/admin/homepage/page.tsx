"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Eye, 
  EyeOff,
  ArrowUp,
  ArrowDown,
  Palette
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function HomepageManagementPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Section settings
  const [sectionSettings, setSectionSettings] = useState<any>(null);
  const [editingSection, setEditingSection] = useState(false);
  
  // Tournament games
  const [games, setGames] = useState<any[]>([]);
  const [editingGame, setEditingGame] = useState<any>(null);
  const [showGameForm, setShowGameForm] = useState(false);

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadUser = async () => {
    try {
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        router.push("/admin/signin");
        return;
      }
      setUser(currentUser);
    } catch (error) {
      console.error("Error loading user:", error);
      router.push("/admin/signin");
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);

      // Load section settings
      const { data: sectionData } = await supabase
        .from("homepage_sections")
        .select("*")
        .eq("section_key", "tournament_games")
        .single();

      if (sectionData) {
        setSectionSettings(sectionData);
      }

      // Load tournament games
      const { data: gamesData } = await supabase
        .from("homepage_tournament_games")
        .select("*")
        .order("display_order", { ascending: true });

      setGames(gamesData || []);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateSection = async () => {
    try {
      const { error } = await supabase
        .from("homepage_sections")
        .update({
          title: sectionSettings.title,
          subtitle: sectionSettings.subtitle,
          description: sectionSettings.description,
          is_active: sectionSettings.is_active
        })
        .eq("id", sectionSettings.id);

      if (error) throw error;

      alert("Section updated successfully!");
      setEditingSection(false);
      loadData();
    } catch (error: any) {
      alert("Error updating section: " + error.message);
    }
  };

  const saveGame = async () => {
    try {
      if (editingGame.id) {
        // Update existing
        const { error } = await supabase
          .from("homepage_tournament_games")
          .update({
            game_name: editingGame.game_name,
            team1_name: editingGame.team1_name,
            team1_logo: editingGame.team1_logo,
            team2_name: editingGame.team2_name,
            team2_logo: editingGame.team2_logo,
            match_time: editingGame.match_time,
            match_date: editingGame.match_date,
            status: editingGame.status,
            color_primary: editingGame.color_primary,
            color_secondary: editingGame.color_secondary,
            color_name: editingGame.color_name,
            is_featured: editingGame.is_featured,
            is_active: editingGame.is_active
          })
          .eq("id", editingGame.id);

        if (error) throw error;
      } else {
        // Create new
        const maxOrder = Math.max(...games.map(g => g.display_order || 0), 0);
        const { error } = await supabase
          .from("homepage_tournament_games")
          .insert({
            ...editingGame,
            display_order: maxOrder + 1
          });

        if (error) throw error;
      }

      alert("Game saved successfully!");
      setShowGameForm(false);
      setEditingGame(null);
      loadData();
    } catch (error: any) {
      alert("Error saving game: " + error.message);
    }
  };

  const deleteGame = async (id: string) => {
    if (!confirm("Are you sure you want to delete this game?")) return;

    try {
      const { error } = await supabase
        .from("homepage_tournament_games")
        .delete()
        .eq("id", id);

      if (error) throw error;

      alert("Game deleted successfully!");
      loadData();
    } catch (error: any) {
      alert("Error deleting game: " + error.message);
    }
  };

  const toggleGameVisibility = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("homepage_tournament_games")
        .update({ is_active: !currentStatus })
        .eq("id", id);

      if (error) throw error;
      loadData();
    } catch (error: any) {
      alert("Error toggling visibility: " + error.message);
    }
  };

  const moveGame = async (id: string, direction: 'up' | 'down') => {
    const index = games.findIndex(g => g.id === id);
    if (index === -1) return;
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === games.length - 1) return;

    const newGames = [...games];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newGames[index], newGames[targetIndex]] = [newGames[targetIndex], newGames[index]];

    // Update display_order for both
    try {
      await supabase
        .from("homepage_tournament_games")
        .update({ display_order: targetIndex })
        .eq("id", newGames[targetIndex].id);

      await supabase
        .from("homepage_tournament_games")
        .update({ display_order: index })
        .eq("id", newGames[index].id);

      loadData();
    } catch (error: any) {
      alert("Error reordering: " + error.message);
    }
  };

  const colorPresets = [
    { name: 'red', primary: '#ef4444', secondary: '#dc2626' },
    { name: 'purple', primary: '#a855f7', secondary: '#9333ea' },
    { name: 'orange', primary: '#f97316', secondary: '#ea580c' },
    { name: 'blue', primary: '#3b82f6', secondary: '#2563eb' },
    { name: 'green', primary: '#22c55e', secondary: '#16a34a' },
    { name: 'pink', primary: '#ec4899', secondary: '#db2777' },
    { name: 'yellow', primary: '#eab308', secondary: '#ca8a04' },
  ];

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
    <div className="min-h-screen bg-gradient-to-b from-black via-slate-900 to-black p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-white mb-2">
            HOMEPAGE <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">MANAGEMENT</span>
          </h1>
          <p className="text-white/70">Manage tournament games section on the homepage</p>
        </div>

        {/* Section Settings */}
        <div className="bg-slate-900 border-2 border-white/10 rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-white">Section Settings</h2>
            <button
              onClick={() => setEditingSection(!editingSection)}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-all"
            >
              {editingSection ? <X className="w-5 h-5" /> : <Edit className="w-5 h-5" />}
            </button>
          </div>

          {editingSection && sectionSettings ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-white mb-2">Subtitle (Small text above title)</label>
                <input
                  type="text"
                  value={sectionSettings.subtitle}
                  onChange={(e) => setSectionSettings({...sectionSettings, subtitle: e.target.value})}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white"
                  placeholder="Tournament Game"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-white mb-2">Title (Main heading)</label>
                <input
                  type="text"
                  value={sectionSettings.title}
                  onChange={(e) => setSectionSettings({...sectionSettings, title: e.target.value})}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white"
                  placeholder="Tournament Trending Match"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={sectionSettings.is_active}
                  onChange={(e) => setSectionSettings({...sectionSettings, is_active: e.target.checked})}
                  className="w-5 h-5"
                />
                <label className="text-white font-bold">Show this section on homepage</label>
              </div>

              <button
                onClick={updateSection}
                className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl transition-all flex items-center gap-2"
              >
                <Save className="w-5 h-5" />
                Save Section Settings
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-white/50 text-sm">{sectionSettings?.subtitle}</p>
              <p className="text-white text-2xl font-black">{sectionSettings?.title}</p>
              <p className="text-white/70">{sectionSettings?.description}</p>
              <p className="text-sm">
                <span className={`px-3 py-1 rounded-full ${sectionSettings?.is_active ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                  {sectionSettings?.is_active ? 'Active' : 'Inactive'}
                </span>
              </p>
            </div>
          )}
        </div>

        {/* Tournament Games */}
        <div className="bg-slate-900 border-2 border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-white">Tournament Games</h2>
            <button
              onClick={() => {
                setEditingGame({
                  game_name: '',
                  team1_name: '',
                  team1_logo: '/assets/4-3.png',
                  team2_name: '',
                  team2_logo: '/assets/1-2.png',
                  match_time: '',
                  match_date: '',
                  status: 'upcoming',
                  color_primary: '#ef4444',
                  color_secondary: '#dc2626',
                  color_name: 'red',
                  is_featured: false,
                  is_active: true
                });
                setShowGameForm(true);
              }}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-all flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Game
            </button>
          </div>

          {/* Games List */}
          <div className="space-y-4">
            {games.map((game) => (
              <div
                key={game.id}
                className="bg-black/40 border border-white/10 rounded-xl p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => moveGame(game.id, 'up')}
                      className="p-1 hover:bg-white/10 rounded"
                      disabled={games[0].id === game.id}
                    >
                      <ArrowUp className="w-4 h-4 text-white/50" />
                    </button>
                    <button
                      onClick={() => moveGame(game.id, 'down')}
                      className="p-1 hover:bg-white/10 rounded"
                      disabled={games[games.length - 1].id === game.id}
                    >
                      <ArrowDown className="w-4 h-4 text-white/50" />
                    </button>
                  </div>

                  <div
                    className="w-3 h-12 rounded"
                    style={{ backgroundColor: game.color_primary }}
                  />

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white font-bold">{game.game_name}</span>
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        game.status === 'upcoming' ? 'bg-blue-500/20 text-blue-500' :
                        game.status === 'live' ? 'bg-green-500/20 text-green-500' :
                        'bg-gray-500/20 text-gray-500'
                      }`}>
                        {game.status}
                      </span>
                      {!game.is_active && (
                        <span className="px-2 py-0.5 rounded text-xs bg-red-500/20 text-red-500">
                          Hidden
                        </span>
                      )}
                    </div>
                    <div className="text-white/70 text-sm">
                      {game.team1_name} vs {game.team2_name} • {game.match_time} • {game.match_date}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleGameVisibility(game.id, game.is_active)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-all"
                    title={game.is_active ? "Hide" : "Show"}
                  >
                    {game.is_active ? (
                      <Eye className="w-5 h-5 text-green-500" />
                    ) : (
                      <EyeOff className="w-5 h-5 text-red-500" />
                    )}
                  </button>

                  <button
                    onClick={() => {
                      setEditingGame(game);
                      setShowGameForm(true);
                    }}
                    className="p-2 hover:bg-white/10 rounded-lg transition-all"
                  >
                    <Edit className="w-5 h-5 text-blue-500" />
                  </button>

                  <button
                    onClick={() => deleteGame(game.id)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-all"
                  >
                    <Trash2 className="w-5 h-5 text-red-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Game Form Modal */}
        {showGameForm && editingGame && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-slate-900 border-2 border-white/10 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-black text-white">
                  {editingGame.id ? 'Edit Game' : 'Add New Game'}
                </h3>
                <button
                  onClick={() => {
                    setShowGameForm(false);
                    setEditingGame(null);
                  }}
                  className="p-2 hover:bg-white/10 rounded-lg"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-white mb-2">Game Name</label>
                    <input
                      type="text"
                      value={editingGame.game_name}
                      onChange={(e) => setEditingGame({...editingGame, game_name: e.target.value})}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white"
                      placeholder="PUBG MOBILE"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-white mb-2">Status</label>
                    <select
                      value={editingGame.status}
                      onChange={(e) => setEditingGame({...editingGame, status: e.target.value})}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white"
                    >
                      <option value="upcoming">Upcoming</option>
                      <option value="live">Live</option>
                      <option value="finished">Finished</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-white mb-2">Team 1 Name</label>
                    <input
                      type="text"
                      value={editingGame.team1_name}
                      onChange={(e) => setEditingGame({...editingGame, team1_name: e.target.value})}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white"
                      placeholder="Pro Player"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-white mb-2">Team 1 Logo URL</label>
                    <input
                      type="text"
                      value={editingGame.team1_logo}
                      onChange={(e) => setEditingGame({...editingGame, team1_logo: e.target.value})}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white"
                      placeholder="/assets/4-3.png"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-white mb-2">Team 2 Name</label>
                    <input
                      type="text"
                      value={editingGame.team2_name}
                      onChange={(e) => setEditingGame({...editingGame, team2_name: e.target.value})}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white"
                      placeholder="Lion King"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-white mb-2">Team 2 Logo URL</label>
                    <input
                      type="text"
                      value={editingGame.team2_logo}
                      onChange={(e) => setEditingGame({...editingGame, team2_logo: e.target.value})}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white"
                      placeholder="/assets/1-2.png"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-white mb-2">Match Time</label>
                    <input
                      type="text"
                      value={editingGame.match_time}
                      onChange={(e) => setEditingGame({...editingGame, match_time: e.target.value})}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white"
                      placeholder="07:30"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-white mb-2">Match Date</label>
                    <input
                      type="text"
                      value={editingGame.match_date}
                      onChange={(e) => setEditingGame({...editingGame, match_date: e.target.value})}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white"
                      placeholder="30 Dec 2024"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-white mb-2 flex items-center gap-2">
                    <Palette className="w-4 h-4" />
                    Color Theme
                  </label>
                  <div className="grid grid-cols-7 gap-2">
                    {colorPresets.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => setEditingGame({
                          ...editingGame,
                          color_primary: color.primary,
                          color_secondary: color.secondary,
                          color_name: color.name
                        })}
                        className={`h-12 rounded-lg border-2 transition-all ${
                          editingGame.color_name === color.name
                            ? 'border-white scale-110'
                            : 'border-white/20 hover:border-white/50'
                        }`}
                        style={{ backgroundColor: color.primary }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={editingGame.is_featured}
                      onChange={(e) => setEditingGame({...editingGame, is_featured: e.target.checked})}
                      className="w-5 h-5"
                    />
                    <span className="text-white font-bold">Featured</span>
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={editingGame.is_active}
                      onChange={(e) => setEditingGame({...editingGame, is_active: e.target.checked})}
                      className="w-5 h-5"
                    />
                    <span className="text-white font-bold">Active (Visible)</span>
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={saveGame}
                    className="flex-1 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    <Save className="w-5 h-5" />
                    Save Game
                  </button>
                  <button
                    onClick={() => {
                      setShowGameForm(false);
                      setEditingGame(null);
                    }}
                    className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
