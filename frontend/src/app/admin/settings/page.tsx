"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Save, 
  Settings as SettingsIcon,
  Shield, 
  Globe, 
  DollarSign, 
  Clock,
  Mail,
  Lock
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    platform_commission: "10",
    default_spectator_pay: "5",
    dispute_deadline_hours: "24",
    min_withdrawal_amount: "10"
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const { data } = await supabase
        .from('platform_settings')
        .select('*');
      
      if (data) {
        const newSettings: any = {};
        data.forEach((item: any) => {
          newSettings[item.setting_key] = item.setting_value;
        });
        setSettings(prev => ({ ...prev, ...newSettings }));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Upsert all settings
      const updates = Object.entries(settings).map(([key, value]) => ({
        setting_key: key,
        setting_value: value,
        updated_at: new Date().toISOString()
      }));

      const { error } = await supabase
        .from('platform_settings')
        .upsert(updates, { onConflict: 'setting_key' });

      if (error) throw error;
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
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
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center">
          <SettingsIcon className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-white">PLATFORM SETTINGS</h1>
          <p className="text-white/70">Configure system-wide parameters</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        
        {/* Financial Settings */}
        <div className="bg-slate-900 border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-black text-white mb-6 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-500" />
            Financial Configuration
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-white mb-2">
                Platform Commission (%)
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="platform_commission"
                  value={settings.platform_commission}
                  onChange={handleChange}
                  className="w-full pl-4 pr-8 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-red-500 focus:outline-none"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50">%</span>
              </div>
              <p className="text-xs text-white/50 mt-1">Fee taken from tournament prize pools</p>
            </div>

            <div>
              <label className="block text-sm font-bold text-white mb-2">
                Min Withdrawal Amount ()
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50"></span>
                <input
                  type="number"
                  name="min_withdrawal_amount"
                  value={settings.min_withdrawal_amount}
                  onChange={handleChange}
                  className="w-full pl-8 pr-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-red-500 focus:outline-none"
                />
              </div>
              <p className="text-xs text-white/50 mt-1">Minimum amount users can withdraw</p>
            </div>
          </div>
        </div>

        {/* Operational Settings */}
        <div className="bg-slate-900 border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-black text-white mb-6 flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-500" />
            Operations & Disputes
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-white mb-2">
                Default Spectator Pay ()
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50"></span>
                <input
                  type="number"
                  name="default_spectator_pay"
                  value={settings.default_spectator_pay}
                  onChange={handleChange}
                  className="w-full pl-8 pr-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-red-500 focus:outline-none"
                />
              </div>
              <p className="text-xs text-white/50 mt-1">Base pay per match for spectators</p>
            </div>

            <div>
              <label className="block text-sm font-bold text-white mb-2">
                Dispute Deadline (Hours)
              </label>
              <div className="relative">
                 <input
                  type="number"
                  name="dispute_deadline_hours"
                  value={settings.dispute_deadline_hours}
                  onChange={handleChange}
                  className="w-full pl-4 pr-12 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-red-500 focus:outline-none"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50">Hrs</span>
              </div>
              <p className="text-xs text-white/50 mt-1">Time to file dispute after match ends</p>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-red-500/20 disabled:opacity-50 flex items-center gap-2"
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
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
