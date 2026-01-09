"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Save, Eye } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { MATCH_TEMPLATES, getTemplate, type MatchTemplate } from "@/lib/matchTemplates";
import CountdownEditor from "@/components/CountdownEditor";

export default function AdminMatchEditorPage() {
  const params = useParams();
  const router = useRouter();
  const matchId = params.id as string;

  const [match, setMatch] = useState<any>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<MatchTemplate | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [roomCode, setRoomCode] = useState("");
  const [roomPassword, setRoomPassword] = useState("");
  const [customInstructions, setCustomInstructions] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadMatch();
  }, [matchId]);

  const loadMatch = async () => {
    try {
      const { data, error } = await supabase
        .from('matches')
        .select('*')
        .eq('id', matchId)
        .single();

      if (error) throw error;

      if (data) {
        setMatch(data);
        setRoomCode(data.room_code || '');
        setRoomPassword(data.room_password || '');
        setCustomInstructions(data.custom_instructions || '');
        setFormData(data.match_info || {});
        const template = getTemplate(data.template_id || 'generic');
        setSelectedTemplate(template || MATCH_TEMPLATES[0]);
      }
    } catch (error) {
      console.error('Error loading match:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateChange = (templateId: string) => {
    const template = getTemplate(templateId);
    if (template) {
      setSelectedTemplate(template);
      // Reset form data when changing templates
      setFormData({});
    }
  };

  const handleFieldChange = (key: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      console.log('Saving match data:', {
        template_id: selectedTemplate?.id,
        room_code: roomCode,
        room_password: roomPassword,
        custom_instructions: customInstructions,
        match_info: formData
      });

      const { error } = await supabase
        .from('matches')
        .update({
          template_id: selectedTemplate?.id,
          room_code: roomCode || null,
          room_password: roomPassword || null,
          custom_instructions: customInstructions || null,
          match_info: formData
        })
        .eq('id', matchId);

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      alert('Match details saved successfully!');
      // Redirect to admin matches page instead of tournament
      router.push(`/admin/matches`);
    } catch (error: any) {
      console.error('Error saving match:', error);
      alert(`Failed to save: {error.message || 'Unknown error'}`);
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
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-white/50 hover:text-white mb-8 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-bold">Back</span>
      </button>

      <div className="mb-8">
        <h1 className="text-3xl font-black text-white mb-2">
          Edit Match Setup
        </h1>
        <p className="text-white/70">
          Configure match details, room codes, and player information
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Template Selection */}
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-black text-white mb-4">Select Template</h3>
            
            <div className="grid md:grid-cols-2 gap-3">
              {MATCH_TEMPLATES.map(template => (
                <button
                  key={template.id}
                  onClick={() => handleTemplateChange(template.id)}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    selectedTemplate?.id === template.id
                      ? `border-${template.color.split('-')[1]}-500 bg-gradient-to-br ${template.color}/20`
                      : 'border-white/10 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="font-bold text-white mb-1">{template.name}</div>
                  <div className="text-xs text-white/50">{template.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Basic Info */}
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-black text-white mb-4">Room Details</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-white mb-2">
                  Room Code / Lobby Code
                </label>
                <input
                  type="text"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value)}
                  className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:border-red-500 focus:outline-none"
                  placeholder="e.g., ABCD-1234-EFGH"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-white mb-2">
                  Room Password (Optional)
                </label>
                <input
                  type="text"
                  value={roomPassword}
                  onChange={(e) => setRoomPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:border-red-500 focus:outline-none"
                  placeholder="password123"
                />
              </div>
            </div>
          </div>

          {/* Template Fields */}
          {selectedTemplate && (
            <div className="bg-slate-900 border border-white/10 rounded-2xl p-6">
              <h3 className="text-xl font-black text-white mb-4">
                {selectedTemplate.name} Details
              </h3>
              
              <div className="space-y-4">
                {selectedTemplate.fields.map(field => (
                  <div key={field.key}>
                    <label className="block text-sm font-bold text-white mb-2">
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    
                    {field.type === 'textarea' ? (
                      <textarea
                        value={formData[field.key] || ''}
                        onChange={(e) => handleFieldChange(field.key, e.target.value)}
                        className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:border-red-500 focus:outline-none resize-none"
                        placeholder={field.placeholder}
                        rows={3}
                      />
                    ) : field.type === 'select' ? (
                      <select
                        value={formData[field.key] || ''}
                        onChange={(e) => handleFieldChange(field.key, e.target.value)}
                        className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-red-500 focus:outline-none appearance-none"
                      >
                        <option value="">Select {field.label}</option>
                        {field.options?.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={field.type}
                        value={formData[field.key] || ''}
                        onChange={(e) => handleFieldChange(field.key, e.target.value)}
                        className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:border-red-500 focus:outline-none"
                        placeholder={field.placeholder}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Countdown Settings */}
          <CountdownEditor
            itemId={matchId}
            itemType="match"
            currentStartTime={match?.countdown_start_time}
            scheduledTime={match?.scheduled_time}
            showCountdown={match?.show_countdown !== false}
            onSave={async (settings) => {
              const { error } = await supabase
                .from('matches')
                .update({
                  show_countdown: settings.show_countdown,
                  countdown_start_time: settings.countdown_start_time
                })
                .eq('id', matchId);
              
              if (error) throw error;
              
              // Reload match data
              loadMatch();
            }}
          />

          {/* Custom Instructions */}
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-black text-white mb-4">Custom Instructions</h3>
            <p className="text-white/50 text-sm mb-4">
              Override default template instructions or add custom notes
            </p>
            
            <textarea
              value={customInstructions}
              onChange={(e) => setCustomInstructions(e.target.value)}
              className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:border-red-500 focus:outline-none resize-none"
              rows={6}
              placeholder="Enter custom match instructions..."
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Actions */}
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-black text-white mb-4">Actions</h3>
            
            <div className="space-y-3">
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full py-3 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" />
                {saving ? 'Saving...' : 'Save Match Setup'}
              </button>

              <a
                href={`/dashboard/matches/{matchId}`}
                target="_blank"
                className="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 border border-white/20"
              >
                <Eye className="w-5 h-5" />
                Preview as Player
              </a>
            </div>
          </div>

          {/* Template Info */}
          {selectedTemplate && (
            <div className={`bg-gradient-to-br {selectedTemplate.color}/10 border-2 border-{selectedTemplate.color.split('-')[1]}-500/30 rounded-2xl p-6`}>
              <h3 className="text-lg font-black text-white mb-3">
                {selectedTemplate.name}
              </h3>
              <p className="text-white/70 text-sm mb-4">
                {selectedTemplate.description}
              </p>
              <div className="text-xs text-white/50">
                {selectedTemplate.fields.length} custom fields
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
