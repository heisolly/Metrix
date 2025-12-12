"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { 
  User,
  Mail,
  Calendar,
  Trophy,
  Target,
  Zap,
  Edit,
  Save,
  X
} from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { updateProfile } from "@/lib/database";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    bio: ""
  });

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const currentUser = await getCurrentUser();
    setUser(currentUser);
    setFormData({
      username: currentUser?.user_metadata?.username || "",
      fullName: currentUser?.user_metadata?.full_name || "",
      bio: currentUser?.user_metadata?.bio || ""
    });
  };

  const handleSave = async () => {
    if (!user) return;
    
    try {
      await updateProfile(user.id, {
        username: formData.username,
        full_name: formData.fullName,
        bio: formData.bio
      });
      setIsEditing(false);
      await loadUser();
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const stats = [
    { label: "Tournaments Played", value: "24", icon: Trophy, color: "from-yellow-500 to-orange-500" },
    { label: "Wins", value: "12", icon: Target, color: "from-green-500 to-emerald-500" },
    { label: "Win Rate", value: "50%", icon: Zap, color: "from-blue-500 to-cyan-500" },
    { label: "Total Earnings", value: "2,450", icon: Trophy, color: "from-purple-500 to-pink-500" },
  ];

  const achievements = [
    { title: "First Victory", description: "Win your first tournament", unlocked: true },
    { title: "Sharpshooter", description: "Get 20+ kills in a match", unlocked: true },
    { title: "Consistent Winner", description: "Win 10 tournaments", unlocked: true },
    { title: "Top Earner", description: "Earn 1,000+", unlocked: true },
    { title: "Tournament Master", description: "Win 50 tournaments", unlocked: false },
    { title: "Elite Player", description: "Reach top 100 ranking", unlocked: false },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-black text-white light:text-black mb-2">
          PROFILE
        </h1>
        <p className="text-white light:text-black">
          Manage your account and view your gaming stats
        </p>
      </div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-black/60 light:bg-white/80 border-2 border-white/10 light:border-black/10 rounded-2xl p-8 mb-8"
      >
        <div className="flex flex-col md:flex-row items-start gap-8">
          {/* Avatar */}
          <div className="relative">
            <div className="w-32 h-32 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center">
              <span className="text-white font-black text-5xl">
                {user?.email?.charAt(0).toUpperCase()}
              </span>
            </div>
            <button className="absolute bottom-0 right-0 p-2 bg-red-500 rounded-lg hover:bg-red-600 transition-colors">
              <Edit className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-6">
              <div>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    placeholder="Username"
                    className="text-3xl font-black text-white light:text-black bg-white/5 light:bg-black/5 border-2 border-white/20 light:border-black/20 rounded-lg px-4 py-2 mb-2 focus:border-red-500 focus:outline-none"
                  />
                ) : (
                  <h2 className="text-3xl font-black text-white light:text-black mb-2">
                    {formData.username || user?.email?.split('@')[0] || "Player"}
                  </h2>
                )}
                
                <div className="flex items-center gap-2 text-white/70 light:text-black/70 mb-4">
                  <Mail className="w-4 h-4" />
                  <span>{user?.email}</span>
                </div>

                <div className="flex items-center gap-2 text-white/70 light:text-black/70">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {new Date(user?.created_at || Date.now()).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Edit Button */}
              {isEditing ? (
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Save
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit Profile
                </button>
              )}
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-bold text-white light:text-black mb-2">
                Bio
              </label>
              {isEditing ? (
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  placeholder="Tell us about yourself..."
                  rows={3}
                  className="w-full text-white light:text-black bg-white/5 light:bg-black/5 border-2 border-white/20 light:border-black/20 rounded-lg px-4 py-2 focus:border-red-500 focus:outline-none resize-none"
                />
              ) : (
                <p className="text-white light:text-black">
                  {formData.bio || "No bio yet. Click edit to add one!"}
                </p>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.05 }}
            className="bg-black/60 light:bg-white/80 border-2 border-white/10 light:border-black/10 rounded-xl p-4"
          >
            <div className={`w-10 h-10 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center mb-3`}>
              <stat.icon className="w-5 h-5 text-white" />
            </div>
            <div className="text-2xl font-black text-white light:text-black mb-1">
              {stat.value}
            </div>
            <div className="text-sm text-white/70 light:text-black/70">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Achievements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-black/60 light:bg-white/80 border-2 border-white/10 light:border-black/10 rounded-2xl p-6"
      >
        <h3 className="text-2xl font-black text-white light:text-black mb-6 flex items-center gap-2">
          <Trophy className="w-6 h-6 text-red-500" />
          ACHIEVEMENTS
        </h3>

        <div className="grid md:grid-cols-2 gap-4">
          {achievements.map((achievement, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.05 }}
              className={`p-4 rounded-xl border-2 {
                achievement.unlocked
                  ? "bg-red-500/10 border-red-500/30"
                  : "bg-white/5 light:bg-black/5 border-white/10 light:border-black/10 opacity-50"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center {
                  achievement.unlocked ? "bg-red-500" : "bg-white/10 light:bg-black/10"
                }`}>
                  <Trophy className={`w-5 h-5 ${achievement.unlocked ? "text-white" : "text-white/30 light:text-black/30"}`} />
                </div>
                <div>
                  <h4 className="font-black text-white light:text-black mb-1">
                    {achievement.title}
                  </h4>
                  <p className="text-sm text-white/70 light:text-black/70">
                    {achievement.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
