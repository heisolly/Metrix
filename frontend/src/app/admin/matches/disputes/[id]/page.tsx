"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  Image as ImageIcon,
  AlertTriangle
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/auth";

export default function DisputeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const disputeId = params.id as string;

  const [dispute, setDispute] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [resolution, setResolution] = useState("");

  useEffect(() => {
    loadDispute();
  }, []);

  const loadDispute = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('disputes')
        .select(`
          *,
          match:matches(
            *,
            tournament:tournaments(*)
          ),
          complainant:complaining_player_id(*),
          spectator:spectator_id(*)
        `)
        .eq('id', disputeId)
        .single();
      
      if (error) throw error;
      setDispute(data);
    } catch (error) {
      console.error('Error loading dispute:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (decision: 'uphold' | 'reject') => {
    if (!resolution) {
      alert("Please provide a resolution note.");
      return;
    }

    try {
      const user = await getCurrentUser();
      
      // Update dispute status
      const { error } = await supabase
        .from('disputes')
        .update({
          status: 'resolved',
          resolution: resolution,
          resolved_by: user.id,
          resolved_at: new Date().toISOString()
        })
        .eq('id', disputeId);

      if (error) throw error;

      // Update match status based on decision
      // If upheld, maybe set match to review needed or cancel it
      // If rejected, keep original result
      // For now, just marking dispute as resolved is enough for the MVP flow

      router.push('/admin/matches?tab=disputes');
    } catch (error) {
      console.error('Error resolving dispute:', error);
      alert('Failed to resolve dispute');
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

  if (!dispute) return <div>Dispute not found</div>;

  return (
    <div className="max-w-5xl mx-auto">
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 text-white/50 hover:text-white mb-8 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-bold">Back to Disputes</span>
      </button>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6">
             <div className="flex items-center gap-3 mb-6">
               <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center">
                 <AlertTriangle className="w-6 h-6 text-white" />
               </div>
               <div>
                 <h1 className="text-2xl font-black text-white">Dispute Case</h1>
                 <p className="text-white/50 text-sm">ID: {disputeId}</p>
               </div>
             </div>

             <div className="space-y-6">
               <div className="bg-black/40 rounded-xl p-4 border border-white/5">
                 <h3 className="font-bold text-white mb-2">Complainant's Claim</h3>
                 <p className="text-white/80">{dispute.reason}</p>
                 <div className="mt-4 flex items-center gap-2">
                   <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center text-xs font-bold text-white">
                     {dispute.complainant?.username?.charAt(0).toUpperCase()}
                   </div>
                   <span className="font-bold text-white text-sm">{dispute.complainant?.username}</span>
                   <span className="text-white/30 text-xs">•</span>
                   <span className="text-white/50 text-xs">{new Date(dispute.created_at).toLocaleString()}</span>
                 </div>
               </div>

               {dispute.player_evidence && dispute.player_evidence.length > 0 && (
                 <div>
                   <h3 className="font-bold text-white mb-3 flex items-center gap-2">
                     <ImageIcon className="w-4 h-4 text-blue-500" />
                     Evidence provided
                   </h3>
                   <div className="grid grid-cols-2 gap-4">
                     {dispute.player_evidence.map((url: string, index: number) => (
                       <a href={url} target="_blank" rel="noopener noreferrer" key={index} className="block relative aspect-video bg-black rounded-lg overflow-hidden border border-white/10 hover:border-blue-500 transition-colors">
                         {/* Placeholder for image */}
                         <div className="absolute inset-0 flex items-center justify-center text-white/30">
                           Image {index + 1}
                         </div>
                       </a>
                     ))}
                   </div>
                 </div>
               )}
             </div>
          </div>
          
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-black text-white mb-4">Match Context</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-white/50 text-xs uppercase font-bold mb-1">Tournament</div>
                <div className="text-white font-bold">{dispute.match?.tournament?.name}</div>
              </div>
              <div>
                <div className="text-white/50 text-xs uppercase font-bold mb-1">Game</div>
                <div className="text-white font-bold">{dispute.match?.tournament?.game}</div>
              </div>
              <div>
                <div className="text-white/50 text-xs uppercase font-bold mb-1">Match ID</div>
                <div className="text-white font-mono text-sm">{dispute.match_id}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Panel */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-black text-white mb-6">Resolution</h3>
            
            <div className="mb-6">
              <label className="block text-sm font-bold text-white mb-2">Admin Notes</label>
              <textarea
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-red-500 focus:outline-none"
                rows={4}
                placeholder="Explain the decision..."
              />
            </div>

            <div className="space-y-3">
              <button
                onClick={() => handleResolve('uphold')}
                className="w-full py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all"
              >
                <CheckCircle className="w-5 h-5" /> Uphold Dispute
              </button>
              
              <button
                onClick={() => handleResolve('reject')}
                className="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all"
              >
                <XCircle className="w-5 h-5" /> Reject Dispute
              </button>
            </div>
            
            <p className="text-white/30 text-xs text-center mt-4">
              This action cannot be undone.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
