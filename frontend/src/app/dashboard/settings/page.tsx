"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { 
  Settings as SettingsIcon,
  Bell,
  Lock,
  Eye,
  EyeOff,
  Save,
  Trash2
} from "lucide-react";

export default function SettingsPage() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [notifications, setNotifications] = useState({
    tournaments: true,
    matches: true,
    messages: false,
    marketing: false
  });
  const [passwordData, setPasswordData] = useState({
    current: "",
    new: "",
    confirm: ""
  });

  const handleSaveNotifications = () => {
    // Save notification preferences
    alert("Notification preferences saved!");
  };

  const handleChangePassword = () => {
    if (passwordData.new !== passwordData.confirm) {
      alert("Passwords don't match!");
      return;
    }
    // Change password logic
    alert("Password changed successfully!");
    setPasswordData({ current: "", new: "", confirm: "" });
  };

  const handleDeleteAccount = () => {
    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      // Delete account logic
      alert("Account deletion requested");
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-black text-white light:text-black mb-2">
          SETTINGS
        </h1>
        <p className="text-white light:text-black">
          Manage your account preferences and security
        </p>
      </div>

      {/* Notifications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-black/60 light:bg-white/80 border-2 border-white/10 light:border-black/10 rounded-2xl p-6 mb-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <Bell className="w-6 h-6 text-red-500" />
          <h2 className="text-2xl font-black text-white light:text-black">
            NOTIFICATIONS
          </h2>
        </div>

        <div className="space-y-4 mb-6">
          {[
            { key: "tournaments", label: "Tournament Updates", description: "Get notified about new tournaments and results" },
            { key: "matches", label: "Match Reminders", description: "Receive reminders before your matches start" },
            { key: "messages", label: "Messages", description: "Notifications for new messages and chats" },
            { key: "marketing", label: "Marketing Emails", description: "Receive promotional emails and offers" }
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-4 bg-white/5 light:bg-black/5 rounded-xl">
              <div>
                <div className="font-bold text-white light:text-black mb-1">
                  {item.label}
                </div>
                <div className="text-sm text-white/70 light:text-black/70">
                  {item.description}
                </div>
              </div>
              <button
                onClick={() => setNotifications({
                  ...notifications,
                  [item.key]: !notifications[item.key as keyof typeof notifications]
                })}
                className={`relative w-14 h-8 rounded-full transition-colors {
                  notifications[item.key as keyof typeof notifications]
                    ? "bg-red-500"
                    : "bg-white/20 light:bg-black/20"
                }`}
              >
                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform {
                  notifications[item.key as keyof typeof notifications]
                    ? "translate-x-7"
                    : "translate-x-1"
                }`} />
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={handleSaveNotifications}
          className="w-full px-6 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
        >
          <Save className="w-5 h-5" />
          Save Preferences
        </button>
      </motion.div>

      {/* Change Password */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-black/60 light:bg-white/80 border-2 border-white/10 light:border-black/10 rounded-2xl p-6 mb-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <Lock className="w-6 h-6 text-red-500" />
          <h2 className="text-2xl font-black text-white light:text-black">
            CHANGE PASSWORD
          </h2>
        </div>

        <div className="space-y-4 mb-6">
          {/* Current Password */}
          <div>
            <label className="block text-sm font-bold text-white light:text-black mb-2">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? "text" : "password"}
                value={passwordData.current}
                onChange={(e) => setPasswordData({...passwordData, current: e.target.value})}
                placeholder="Enter current password"
                className="w-full px-4 py-3 pr-12 bg-white/5 light:bg-black/5 border-2 border-white/20 light:border-black/20 rounded-xl text-white light:text-black placeholder-gray-500 focus:border-red-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-red-500 transition-colors"
              >
                {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-bold text-white light:text-black mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                value={passwordData.new}
                onChange={(e) => setPasswordData({...passwordData, new: e.target.value})}
                placeholder="Enter new password"
                className="w-full px-4 py-3 pr-12 bg-white/5 light:bg-black/5 border-2 border-white/20 light:border-black/20 rounded-xl text-white light:text-black placeholder-gray-500 focus:border-red-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-red-500 transition-colors"
              >
                {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-bold text-white light:text-black mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              value={passwordData.confirm}
              onChange={(e) => setPasswordData({...passwordData, confirm: e.target.value})}
              placeholder="Confirm new password"
              className="w-full px-4 py-3 bg-white/5 light:bg-black/5 border-2 border-white/20 light:border-black/20 rounded-xl text-white light:text-black placeholder-gray-500 focus:border-red-500 focus:outline-none"
            />
          </div>
        </div>

        <button
          onClick={handleChangePassword}
          className="w-full px-6 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
        >
          <Lock className="w-5 h-5" />
          Change Password
        </button>
      </motion.div>

      {/* Danger Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-red-500/10 border-2 border-red-500/30 rounded-2xl p-6"
      >
        <h2 className="text-2xl font-black text-red-500 mb-4">
          DANGER ZONE
        </h2>
        <p className="text-white light:text-black mb-6">
          Once you delete your account, there is no going back. Please be certain.
        </p>
        <button
          onClick={handleDeleteAccount}
          className="px-6 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-colors flex items-center gap-2"
        >
          <Trash2 className="w-5 h-5" />
          Delete Account
        </button>
      </motion.div>
    </div>
  );
}
