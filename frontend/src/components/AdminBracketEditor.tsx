"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Save, 
  X, 
  Shuffle, 
  Clock, 
  Eye, 
  Users,
  AlertCircle,
  Trash2
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ToastProvider";

interface Participant {
  id: string;
  user_id: string;
  user?: {
    id: string;
    username: string;
    email: string;
  };
}

interface Match {
  id?: string;
  round: number;
  match_number: number;
  player1_id: string | null;
  player2_id: string | null;
  scheduled_time: string | null;
  spectator_id: string | null;
  status: string;
}

interface AdminBracketEditorProps {
  tournamentId: string;
  participants: Participant[];
  existingMatches: any[];
  spectators: any[];
  onSave: () => void;
  onCancel: () => void;
}

export default function AdminBracketEditor({
  tournamentId,
  participants,
  existingMatches,
  spectators,
  onSave,
  onCancel
}: AdminBracketEditorProps) {
  const [matches, setMatches] = useState<Match[]>(existingMatches);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const toast = useToast();

  // Generate bracket structure
  const generateBracket = () => {
    setGenerating(true);
    
    try {
      const playerCount = participants.length;
      
      if (playerCount < 2) {
        toast.warning('Not Enough Players', 'Need at least 2 participants to create a bracket');
        setGenerating(false);
        return;
      }

      // Calculate rounds needed
      const rounds = Math.ceil(Math.log2(playerCount));
      const totalSlots = Math.pow(2, rounds);
      
      // Shuffle participants for random seeding
      const shuffled = [...participants].sort(() => Math.random() - 0.5);
      
      // Create Round 1 matches
      const newMatches: Match[] = [];
      let matchNumber = 1;
      
      for (let i = 0; i < totalSlots; i += 2) {
        newMatches.push({
          round: 1,
          match_number: matchNumber++,
          player1_id: shuffled[i]?.user_id || null,
          player2_id: shuffled[i + 1]?.user_id || null,
          scheduled_time: null,
          spectator_id: null,
          status: 'scheduled'
        });
      }

      // Create empty matches for subsequent rounds
      let currentRoundMatches = newMatches.length;
      for (let round = 2; round <= rounds; round++) {
        const roundMatches = Math.ceil(currentRoundMatches / 2);
        for (let i = 0; i < roundMatches; i++) {
          newMatches.push({
            round,
            match_number: matchNumber++,
            player1_id: null,
            player2_id: null,
            scheduled_time: null,
            spectator_id: null,
            status: 'scheduled'
          });
        }
        currentRoundMatches = roundMatches;
      }

      setMatches(newMatches);
      toast.success('Bracket Generated!', `Created {newMatches.length} matches across ${rounds} rounds`);
    } catch (error) {
      console.error('Error generating bracket:', error);
      toast.error('Generation Failed', 'Could not generate bracket');
    } finally {
      setGenerating(false);
    }
  };

  // Update match
  const updateMatch = (matchIndex: number, updates: Partial<Match>) => {
    setMatches(prev => prev.map((m, i) => 
      i === matchIndex ? { ...m, ...updates } : m
    ));
  };

  // Swap players
  const swapPlayers = (matchIndex: number, position: 'player1' | 'player2', newPlayerId: string) => {
    const key = position === 'player1' ? 'player1_id' : 'player2_id';
    updateMatch(matchIndex, { [key]: newPlayerId });
  };

  // Save all matches to database
  const saveMatches = async () => {
    setSaving(true);
    
    try {
      console.log('Starting bracket save...', { tournamentId, matchCount: matches.length });
      
      // Delete existing matches for this tournament
      const { error: deleteError } = await supabase
        .from('matches')
        .delete()
        .eq('tournament_id', tournamentId);

      if (deleteError) {
        console.error('Delete error:', deleteError);
        throw deleteError;
      }

      // Insert new matches
      const matchesToInsert = matches.map(m => ({
        tournament_id: tournamentId,
        round: m.round,
        match_number: m.match_number,
        player1_id: m.player1_id || null,
        player2_id: m.player2_id || null,
        scheduled_time: m.scheduled_time || null,
        spectator_id: m.spectator_id || null,
        status: m.status || 'scheduled',
        match_code: `${tournamentId.slice(0, 8)}-R${m.round}-M${m.match_number}`
      }));

      console.log('Inserting matches:', matchesToInsert.length);
      console.log('Sample match:', matchesToInsert[0]);

      const { data, error } = await supabase
        .from('matches')
        .insert(matchesToInsert)
        .select();

      if (error) {
        console.error('Insert error:', error);
        throw error;
      }

      console.log('Matches saved successfully:', data?.length);
      toast.success('Bracket Saved!', `Created ${data?.length || matches.length} matches`);
      onSave();
    } catch (error: any) {
      console.error('Error saving matches:', error);
      toast.error('Save Failed', error.message || 'Could not save bracket');
    } finally {
      setSaving(false);
    }
  };

  // Group matches by round
  const matchesByRound = matches.reduce((acc, match, index) => {
    if (!acc[match.round]) acc[match.round] = [];
    acc[match.round].push({ ...match, index });
    return acc;
  }, {} as Record<number, (Match & { index: number })[]>);

  const rounds = Object.keys(matchesByRound).map(Number).sort((a, b) => a - b);

  // Get available participants (not already in a match)
  const getAvailableParticipants = (currentMatchIndex: number, currentPosition: 'player1' | 'player2') => {
    const currentMatch = matches[currentMatchIndex];
    const usedPlayerIds = new Set(
      matches.flatMap((m, i) => {
        if (i === currentMatchIndex) {
          // For current match, exclude the other position
          return currentPosition === 'player1' ? [m.player2_id] : [m.player1_id];
        }
        return [m.player1_id, m.player2_id];
      }).filter(Boolean)
    );

    return participants.filter(p => !usedPlayerIds.has(p.user_id));
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex items-center justify-between p-4 bg-slate-900 border border-white/10 rounded-xl">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-500" />
          <div>
            <h3 className="font-bold text-white">Bracket Editor Mode</h3>
            <p className="text-sm text-white/50">
              {matches.length > 0 
                ? `Editing ${matches.length} matches` 
                : 'Generate bracket to get started'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {matches.length === 0 && (
            <button
              onClick={generateBracket}
              disabled={generating || participants.length < 2}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 text-white font-bold rounded-xl transition-all flex items-center gap-2"
            >
              <Shuffle className="w-4 h-4" />
              {generating ? 'Generating...' : 'Generate Bracket'}
            </button>
          )}
          
          {matches.length > 0 && (
            <>
              <button
                onClick={saveMatches}
                disabled={saving}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-green-500/50 text-white font-bold rounded-xl transition-all flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : 'Save Bracket'}
              </button>
              
              <button
                onClick={onCancel}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </>
          )}
        </div>
      </div>

      {/* Matches Editor */}
      {matches.length > 0 && (
        <div className="space-y-8">
          {rounds.map(round => (
            <div key={round} className="space-y-4">
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-red-500" />
                Round {round}
                <span className="text-sm text-white/50 font-normal">
                  ({matchesByRound[round].length} matches)
                </span>
              </h3>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {matchesByRound[round].map((match) => {
                  const availableForP1 = getAvailableParticipants(match.index, 'player1');
                  const availableForP2 = getAvailableParticipants(match.index, 'player2');
                  
                  return (
                    <motion.div
                      key={match.index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-slate-900 border border-white/10 rounded-xl space-y-3"
                    >
                      {/* Match Number */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-white">
                          Match #{match.match_number}
                        </span>
                        <button
                          onClick={() => {
                            setMatches(prev => prev.filter((_, i) => i !== match.index));
                          }}
                          className="p-1 hover:bg-red-500/20 rounded text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Player 1 */}
                      <div>
                        <label className="text-xs text-white/50 mb-1 block">Player 1</label>
                        <select
                          value={match.player1_id || ''}
                          onChange={(e) => swapPlayers(match.index, 'player1', e.target.value)}
                          className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white text-sm focus:border-red-500 focus:outline-none"
                        >
                          <option value="">Select Player</option>
                          {match.player1_id && (
                            <option value={match.player1_id}>
                              {participants.find(p => p.user_id === match.player1_id)?.user?.username || 'Current Player'}
                            </option>
                          )}
                          {availableForP1.map(p => (
                            <option key={p.user_id} value={p.user_id}>
                              {p.user?.username || p.user?.email}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Player 2 */}
                      <div>
                        <label className="text-xs text-white/50 mb-1 block">Player 2</label>
                        <select
                          value={match.player2_id || ''}
                          onChange={(e) => swapPlayers(match.index, 'player2', e.target.value)}
                          className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white text-sm focus:border-red-500 focus:outline-none"
                        >
                          <option value="">Select Player</option>
                          {match.player2_id && (
                            <option value={match.player2_id}>
                              {participants.find(p => p.user_id === match.player2_id)?.user?.username || 'Current Player'}
                            </option>
                          )}
                          {availableForP2.map(p => (
                            <option key={p.user_id} value={p.user_id}>
                              {p.user?.username || p.user?.email}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Schedule Time */}
                      <div>
                        <label className="text-xs text-white/50 mb-1 block flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Schedule Time
                        </label>
                        <input
                          type="datetime-local"
                          value={match.scheduled_time?.slice(0, 16) || ''}
                          onChange={(e) => updateMatch(match.index, { 
                            scheduled_time: e.target.value ? new Date(e.target.value).toISOString() : null 
                          })}
                          className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white text-sm focus:border-red-500 focus:outline-none"
                        />
                      </div>

                      {/* Spectator */}
                      <div>
                        <label className="text-xs text-white/50 mb-1 block flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          Assign Spectator
                        </label>
                        <select
                          value={match.spectator_id || ''}
                          onChange={(e) => updateMatch(match.index, { spectator_id: e.target.value || null })}
                          className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white text-sm focus:border-red-500 focus:outline-none"
                        >
                          <option value="">No Spectator</option>
                          {spectators.map(s => (
                            <option key={s.id} value={s.user_id}>
                              {s.user?.username || s.user?.email}
                            </option>
                          ))}
                        </select>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {matches.length === 0 && !generating && (
        <div className="text-center py-20 bg-slate-900 border border-white/10 rounded-2xl border-dashed">
          <Shuffle className="w-16 h-16 text-white/10 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No Bracket Yet</h3>
          <p className="text-white/50 mb-6">
            Click "Generate Bracket" to automatically create matches from participants
          </p>
          <p className="text-sm text-white/30">
            {participants.length} participants ready
          </p>
        </div>
      )}
    </div>
  );
}
