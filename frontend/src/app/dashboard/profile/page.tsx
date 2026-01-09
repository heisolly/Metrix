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
  X,
  Camera,
  MapPin,
  Link as LinkIcon
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
      <div className="mb-4 md:mb-8 px-2 md:px-0">
        <h1 className="text-2xl md:text-4xl font-black text-white light:text-black mb-1 md:mb-2">
          PROFILE
        </h1>
        <p className="text-sm md:text-base text-white/70 light:text-black/70">
          Manage your account and view your gaming stats
        </p>
      </div>

      {/* Main Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900 light:bg-white border border-white/10 light:border-black/10 rounded-2xl md:rounded-3xl overflow-hidden mb-6 md:mb-8 shadow-xl"
      >
        {/* Banner */}
        <div className="h-32 md:h-48 bg-gradient-to-r from-red-600 via-orange-500 to-red-600 relative">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20"></div>
          {isEditing && (
            <button className="absolute top-4 right-4 p-2 bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-black/70 transition-colors">
              <Camera className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="px-4 md:px-8 pb-6 md:pb-8 relative">
          {/* Avatar & Actions Row */}
          <div className="flex justify-between items-end -mt-12 md:-mt-16 mb-4 md:mb-6">
            <div className="relative">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl md:rounded-3xl border-4 border-slate-900 light:border-white bg-black light:bg-gray-100 flex items-center justify-center shadow-lg transform rotate-[-2deg]">
                <span className="text-white light:text-black font-black text-4xl md:text-5xl">
                  {user?.email?.charAt(0).toUpperCase()}
                </span>
              </div>
              {isEditing && (
                <button className="absolute -bottom-2 -right-2 p-2 bg-red-500 rounded-lg shadow-lg text-white hover:bg-red-600 transition-colors z-10">
                  <Camera className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="mb-1 md:mb-4">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-white/5 light:bg-black/5 hover:bg-white/10 light:hover:bg-black/10 border border-white/10 light:border-black/10 rounded-xl text-white light:text-black font-bold text-sm flex items-center gap-2 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  <span className="hidden md:inline">Edit Profile</span>
                  <span className="md:hidden">Edit</span>
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="p-2 md:px-4 md:py-2 bg-white/5 light:bg-black/5 hover:bg-white/10 rounded-xl text-white light:text-black font-bold text-sm transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-xl text-white font-bold text-sm flex items-center gap-2 transition-colors shadow-lg shadow-green-500/20"
                  >
                    <Save className="w-4 h-4" />
                    <span className="hidden md:inline">Save Changes</span>
                    <span className="md:hidden">Save</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* User Details */}
          <div className="space-y-4 md:space-y-6">
            <div className="flex flex-col gap-1">
              {isEditing ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    placeholder="Full Name"
                    className="w-full md:w-1/2 px-4 py-2 bg-white/5 light:bg-black/5 border border-white/10 rounded-xl text-white light:text-black text-lg focus:border-red-500 focus:outline-none"
                  />
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    placeholder="Username"
                    className="w-full md:w-1/2 px-4 py-2 bg-white/5 light:bg-black/5 border border-white/10 rounded-xl text-white light:text-black text-xl md:text-3xl font-black focus:border-red-500 focus:outline-none"
                  />
                </div>
              ) : (
                <>
                  <h2 className="text-2xl md:text-3xl font-black text-white light:text-black flex items-center gap-2">
                    {formData.username || user?.email?.split('@')[0] || "Player"}
                    {formData.fullName && (
                      <span className="text-base md:text-lg font-normal text-white/50 light:text-black/50">
                        ({formData.fullName})
                      </span>
                    )}
                  </h2>
                  <div className="flex flex-wrap items-center gap-3 text-sm md:text-base text-white/50 light:text-black/50">
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-4 h-4" />
                      <span>{user?.email}</span>
                    </div>
                    <div className="w-1 h-1 bg-white/20 rounded-full hidden md:block"></div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      <span>Joined {new Date(user?.created_at || Date.now()).getFullYear()}</span>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Bio Section */}
            <div className="relative">
              {isEditing ? (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-white/50 uppercase tracking-wider">About Me</label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    placeholder="Write something about yourself..."
                    rows={3}
                    className="w-full px-4 py-3 bg-white/5 light:bg-black/5 border border-white/10 rounded-xl text-white light:text-black focus:border-red-500 focus:outline-none resize-none"
                  />
                </div>
              ) : (
                <div className="bg-white/5 light:bg-black/5 rounded-xl p-4 md:p-6 backdrop-blur-sm border border-white/5">
                  <p className="text-white/80 light:text-black/80 text-sm md:text-base leading-relaxed">
                    {formData.bio || "No bio yet. Click edit to add one!"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8 px-1">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.05 }}
            className="bg-gradient-to-br from-slate-900 to-black light:from-white light:to-gray-50 border border-white/10 light:border-black/10 rounded-2xl p-4 md:p-6 shadow-lg relative overflow-hidden group"
          >
            <div className={`absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br ${stat.color} opacity-10 group-hover:opacity-20 transition-opacity blur-2xl rounded-full`}></div>
            
            <div className={`w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mb-3 shadow-lg shadow-black/20`}>
              <stat.icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            
            <div className="relative">
              <div className="text-2xl md:text-3xl font-black text-white light:text-black mb-1 tracking-tight">
                {stat.value}
              </div>
              <div className="text-xs md:text-sm text-white/50 light:text-black/50 font-medium uppercase tracking-wide">
                {stat.label}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Achievements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-slate-900 light:bg-white border border-white/10 light:border-black/10 rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-xl"
      >
        <h3 className="text-xl md:text-2xl font-black text-white light:text-black mb-4 md:mb-6 flex items-center gap-2 md:gap-3">
          <Trophy className="w-6 h-6 md:w-8 md:h-8 text-yellow-500" />
          ACHIEVEMENTS
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          {achievements.map((achievement, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.05 }}
              className={`p-4 rounded-xl border transition-all duration-300 ${
                achievement.unlocked
                  ? "bg-gradient-to-br from-slate-800 to-slate-900 light:from-gray-50 light:to-white border-yellow-500/20 shadow-lg shadow-black/20"
                  : "bg-slate-900/50 light:bg-gray-100/50 border-white/5 light:border-black/5 opacity-50 grayscale"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-inner ${
                  achievement.unlocked ? "bg-gradient-to-br from-yellow-500 to-orange-500" : "bg-white/5 light:bg-black/5"
                }`}>
                  <Trophy className={`w-6 h-6 ${achievement.unlocked ? "text-white" : "text-white/20 light:text-black/20"}`} />
                </div>
                <div>
                  <h4 className={`font-black mb-1 text-sm md:text-base ${
                    achievement.unlocked ? "text-white light:text-black" : "text-white/40 light:text-black/40"
                  }`}>
                    {achievement.title}
                  </h4>
                  <p className="text-xs md:text-sm text-white/50 light:text-black/50 leading-relaxed">
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
