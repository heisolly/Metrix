"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Clock, Save, Eye, EyeOff } from "lucide-react";

interface CountdownEditorProps {
  itemId: string;
  itemType: 'tournament' | 'match';
  currentStartTime?: string | null;
  scheduledTime: string;
  showCountdown?: boolean;
  onSave: (settings: CountdownSettings) => Promise<void>;
}

export interface CountdownSettings {
  show_countdown: boolean;
  countdown_start_time: string | null;
}

export default function CountdownEditor({
  itemId,
  itemType,
  currentStartTime,
  scheduledTime,
  showCountdown = true,
  onSave
}: CountdownEditorProps) {
  const [enabled, setEnabled] = useState(showCountdown);
  const [startOption, setStartOption] = useState<'now' | 'scheduled' | 'custom'>(
    currentStartTime ? 'custom' : 'scheduled'
  );
  const [customDate, setCustomDate] = useState(
    currentStartTime || new Date().toISOString().slice(0, 16)
  );
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      let startTime: string | null = null;

      if (enabled) {
        if (startOption === 'now') {
          startTime = new Date().toISOString();
        } else if (startOption === 'custom') {
          startTime = new Date(customDate).toISOString();
        } else {
          startTime = null; // Use scheduled time
        }
      }

      await onSave({
        show_countdown: enabled,
        countdown_start_time: startTime
      });

      alert('Countdown settings saved!');
    } catch (error: any) {
      alert(`Failed to save: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const getCountdownTarget = () => {
    if (startOption === 'now') {
      return new Date(Date.now() + 3600000); // 1 hour from now for demo
    } else if (startOption === 'custom') {
      return new Date(customDate);
    } else {
      return new Date(scheduledTime);
    }
  };

  return (
    <div className="bg-slate-900 border border-white/10 rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
          <Clock className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-black text-white">Countdown Settings</h3>
          <p className="text-white/50 text-sm">
            Configure countdown display for this {itemType}
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Enable/Disable Toggle */}
        <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
          <div>
            <div className="font-bold text-white mb-1">Show Countdown</div>
            <div className="text-sm text-white/50">Display countdown timer to users</div>
          </div>
          <button
            onClick={() => setEnabled(!enabled)}
            className={`relative w-16 h-8 rounded-full transition-colors {
              enabled ? 'bg-green-500' : 'bg-white/20'
            }`}
          >
            <motion.div
              animate={{ x: enabled ? 32 : 4 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg flex items-center justify-center"
            >
              {enabled ? (
                <Eye className="w-4 h-4 text-green-500" />
              ) : (
                <EyeOff className="w-4 h-4 text-white/50" />
              )}
            </motion.div>
          </button>
        </div>

        {enabled && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4"
          >
            {/* Start Time Options */}
            <div>
              <label className="block text-sm font-bold text-white mb-3">
                When should countdown start?
              </label>

              <div className="space-y-2">
                {/* Option: Now */}
                <label className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all {
                  startOption === 'now'
                    ? 'bg-purple-500/20 border-purple-500'
                    : 'bg-white/5 border-white/10 hover:border-white/20'
                }`}>
                  <input
                    type="radio"
                    name="startOption"
                    value="now"
                    checked={startOption === 'now'}
                    onChange={(e) => setStartOption(e.target.value as any)}
                    className="w-5 h-5 accent-purple-500"
                  />
                  <div>
                    <div className="font-bold text-white">Immediately</div>
                    <div className="text-xs text-white/50">Start countdown right now</div>
                  </div>
                </label>

                {/* Option: Use Scheduled Time */}
                <label className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all {
                  startOption === 'scheduled'
                    ? 'bg-purple-500/20 border-purple-500'
                    : 'bg-white/5 border-white/10 hover:border-white/20'
                }`}>
                  <input
                    type="radio"
                    name="startOption"
                    value="scheduled"
                    checked={startOption === 'scheduled'}
                    onChange={(e) => setStartOption(e.target.value as any)}
                    className="w-5 h-5 accent-purple-500"
                  />
                  <div>
                    <div className="font-bold text-white">Use Scheduled Time</div>
                    <div className="text-xs text-white/50">
                      Count to {new Date(scheduledTime).toLocaleString()}
                    </div>
                  </div>
                </label>

                {/* Option: Custom Time */}
                <label className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all {
                  startOption === 'custom'
                    ? 'bg-purple-500/20 border-purple-500'
                    : 'bg-white/5 border-white/10 hover:border-white/20'
                }`}>
                  <input
                    type="radio"
                    name="startOption"
                    value="custom"
                    checked={startOption === 'custom'}
                    onChange={(e) => setStartOption(e.target.value as any)}
                    className="w-5 h-5 accent-purple-500"
                  />
                  <div className="flex-1">
                    <div className="font-bold text-white mb-2">Custom Time</div>
                    <input
                      type="datetime-local"
                      value={customDate.slice(0, 16)}
                      onChange={(e) => {
                        setCustomDate(e.target.value);
                        setStartOption('custom');
                      }}
                      className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white text-sm focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                </label>
              </div>
            </div>

            {/* Preview */}
            <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl">
              <div className="text-sm font-bold text-white mb-2">Countdown Preview</div>
              <div className="text-xs text-white/70">
                Countdown will display to {new Date(getCountdownTarget()).toLocaleString()}
              </div>
              <div className="text-xs text-purple-500 mt-1">
                {startOption === 'now' && '⚡ Starts immediately'}
                {startOption === 'scheduled' && '📅 Uses scheduled time'}
                {startOption === 'custom' && '🎯 Custom target time'}
              </div>
            </div>
          </motion.div>
        )}

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <Save className="w-5 h-5" />
          {saving ? 'Saving...' : 'Save Countdown Settings'}
        </button>
      </div>
    </div>
  );
}
