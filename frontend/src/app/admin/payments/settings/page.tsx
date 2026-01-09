"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Settings, Save, CreditCard, Building, User, FileText, ToggleLeft, ToggleRight } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function PaymentSettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [settings, setSettings] = useState({
    payment_gateway_enabled: true,
    manual_payment_enabled: false,
    bank_name: "",
    account_number: "",
    account_name: "",
    payment_instructions: ""
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const user = await getCurrentUser();
      if (!user) {
        router.push("/admin/signin");
        return;
      }

      // Load payment settings
      const { data, error } = await supabase
        .from("payment_settings")
        .select("*")
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error("Error loading settings:", error);
      }

      if (data) {
        setSettings(data);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleToggle = (field: 'payment_gateway_enabled' | 'manual_payment_enabled') => {
    setSettings(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("payment_settings")
        .update({
          payment_gateway_enabled: settings.payment_gateway_enabled,
          manual_payment_enabled: settings.manual_payment_enabled,
          bank_name: settings.bank_name,
          account_number: settings.account_number,
          account_name: settings.account_name,
          payment_instructions: settings.payment_instructions
        })
        .eq('id', (await supabase.from('payment_settings').select('id').single()).data?.id);

      if (error) throw error;

      alert("✅ Payment settings saved successfully!");
    } catch (error: any) {
      console.error("Error saving settings:", error);
      alert("Error: " + error.message);
    } finally {
      setSaving(false);
    }
  };

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
    <div className="max-w-4xl mx-auto p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/20">
            <Settings className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white">PAYMENT SETTINGS</h1>
            <p className="text-white/70">Configure payment gateway and manual payment options</p>
          </div>
        </div>
      </div>

      {/* Payment Mode Toggles */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Payment Gateway Toggle */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${
            settings.payment_gateway_enabled
              ? 'bg-green-500/10 border-green-500/30'
              : 'bg-slate-900 border-white/10'
          }`}
          onClick={() => handleToggle('payment_gateway_enabled')}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <CreditCard className={`w-6 h-6 ${settings.payment_gateway_enabled ? 'text-green-500' : 'text-white/50'}`} />
              <h3 className="text-lg font-bold text-white">Payment Gateway</h3>
            </div>
            {settings.payment_gateway_enabled ? (
              <ToggleRight className="w-8 h-8 text-green-500" />
            ) : (
              <ToggleLeft className="w-8 h-8 text-white/30" />
            )}
          </div>
          <p className="text-white/70 text-sm">
            {settings.payment_gateway_enabled ? 'AlatPay is enabled' : 'AlatPay is disabled'}
          </p>
        </motion.div>

        {/* Manual Payment Toggle */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${
            settings.manual_payment_enabled
              ? 'bg-blue-500/10 border-blue-500/30'
              : 'bg-slate-900 border-white/10'
          }`}
          onClick={() => handleToggle('manual_payment_enabled')}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Building className={`w-6 h-6 ${settings.manual_payment_enabled ? 'text-blue-500' : 'text-white/50'}`} />
              <h3 className="text-lg font-bold text-white">Manual Payment</h3>
            </div>
            {settings.manual_payment_enabled ? (
              <ToggleRight className="w-8 h-8 text-blue-500" />
            ) : (
              <ToggleLeft className="w-8 h-8 text-white/30" />
            )}
          </div>
          <p className="text-white/70 text-sm">
            {settings.manual_payment_enabled ? 'Bank transfer is enabled' : 'Bank transfer is disabled'}
          </p>
        </motion.div>
      </div>

      {/* Bank Account Details */}
      {settings.manual_payment_enabled && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900 border border-white/10 rounded-2xl p-8 mb-8"
        >
          <h3 className="text-xl font-black text-white mb-6 flex items-center gap-2">
            <Building className="w-6 h-6 text-blue-500" />
            Bank Account Details
          </h3>

          <div className="space-y-6">
            {/* Bank Name */}
            <div>
              <label className="block text-sm font-bold text-white mb-2">
                Bank Name
              </label>
              <input
                type="text"
                name="bank_name"
                value={settings.bank_name}
                onChange={handleChange}
                placeholder="e.g., Wema Bank, GTBank, etc."
                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-blue-500 focus:outline-none"
              />
            </div>

            {/* Account Number */}
            <div>
              <label className="block text-sm font-bold text-white mb-2">
                Account Number
              </label>
              <input
                type="text"
                name="account_number"
                value={settings.account_number}
                onChange={handleChange}
                placeholder="1234567890"
                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-blue-500 focus:outline-none"
              />
            </div>

            {/* Account Name */}
            <div>
              <label className="block text-sm font-bold text-white mb-2">
                Account Name
              </label>
              <input
                type="text"
                name="account_name"
                value={settings.account_name}
                onChange={handleChange}
                placeholder="Metrix Gaming Platform"
                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-blue-500 focus:outline-none"
              />
            </div>

            {/* Payment Instructions */}
            <div>
              <label className="block text-sm font-bold text-white mb-2">
                Payment Instructions
              </label>
              <textarea
                name="payment_instructions"
                value={settings.payment_instructions}
                onChange={handleChange}
                rows={4}
                placeholder="Instructions for users on how to make manual payment..."
                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-8 py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-green-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
              Save Settings
            </>
          )}
        </button>
      </div>

      {/* Info Box */}
      <div className="mt-8 bg-blue-500/10 border border-blue-500/30 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-blue-500 mb-2">How It Works</h3>
        <ul className="space-y-2 text-white/70 text-sm">
          <li>• <strong>Payment Gateway:</strong> Users pay via AlatPay (automatic)</li>
          <li>• <strong>Manual Payment:</strong> Users transfer to bank and upload proof</li>
          <li>• You can enable both or just one payment method</li>
          <li>• Manual payments require admin verification</li>
          <li>• Check "Pending Payments" page to approve/reject manual payments</li>
        </ul>
      </div>
    </div>
  );
}
