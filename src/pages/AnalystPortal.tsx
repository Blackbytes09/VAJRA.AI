import React, { useState, useEffect } from "react";
import { Shield, Check, X, ShieldAlert, Activity, User, FileAudio, ExternalLink, ChevronRight, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function AnalystPortal() {
  const navigate = useNavigate();
  const [pendingJobs, setPendingJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPendingJobs = async () => {
    try {
      const res = await fetch("/api/admin/jobs/pending");
      const data = await res.json();
      if (data.jobs) {
        setPendingJobs(data.jobs);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingJobs();
    const interval = setInterval(fetchPendingJobs, 5000); // Poll every 5s for now
    return () => clearInterval(interval);
  }, []);

  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    try {
      await fetch(`/api/admin/jobs/${id}/${action}`, { method: 'POST' });
      setPendingJobs(prev => prev.filter(j => j.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-[#14120E] text-[#E8E1D5] font-sans selection:bg-rose-500 selection:text-white flex flex-col md:flex-row">
      {/* Sidebar Command Center */}
      <aside className="w-80 bg-[#1A1814] border-r border-[#3C362A] p-6 flex flex-col hidden md:flex relative z-10">
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(rgba(225,29,72,0.5) 1px, transparent 1px)', backgroundSize: '15px 15px'}}></div>
        
        <div className="flex items-center space-x-3 mb-10 pb-6 border-b border-[#3C362A]">
          <div className="p-3 bg-rose-500/10 rounded-xl border border-rose-500/20 text-rose-500">
            <ShieldAlert size={28} />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-widest uppercase font-serif text-white">Vajra HITL</h1>
            <div className="text-[10px] uppercase font-bold text-rose-500/80 tracking-widest">Human Analyst Ring</div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-[#14120E] rounded-lg border border-[#3C362A]">
             <div className="text-xs uppercase tracking-widest text-[#8A7B66] font-bold mb-2 flex items-center">
                <Activity size={12} className="mr-2 text-rose-500"/> Pending Alerts
             </div>
             <div className="text-3xl font-mono text-white">{pendingJobs.length}</div>
          </div>
        </div>

        <div className="mt-auto pt-6 border-t border-[#3C362A]">
           <button onClick={() => navigate('/')} className="flex items-center w-full px-4 py-3 rounded-lg text-sm bg-[#14120E] text-[#8A7B66] hover:text-rose-500 hover:bg-rose-500/10 transition-colors border border-[#3C362A]">
              <LogOut size={16} className="mr-3" /> Log Out Analyst
           </button>
        </div>
      </aside>

      {/* Main Board */}
      <main className="flex-1 p-8 h-screen overflow-y-auto w-full relative">
         <div className="absolute top-0 right-0 p-8 hidden lg:block opacity-20 pointer-events-none text-[#8A7B66]">
            <ShieldAlert size={200} />
         </div>
         <header className="mb-10 max-w-4xl relative z-10">
            <h2 className="text-3xl font-black text-white font-serif tracking-tight mb-2">High-Risk Queue</h2>
            <p className="text-sm text-[#8A7B66]">Automated agents flagged these vectors as 'CRITICAL'. Review model outputs and authorize further actions.</p>
         </header>

         <div className="max-w-4xl space-y-6 relative z-10">
            {loading && <div className="text-rose-500 font-mono text-sm animate-pulse">Syncing with AI agents...</div>}
            
            <AnimatePresence>
               {pendingJobs.map(job => (
                  <motion.div 
                     layout
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, scale: 0.95 }}
                     key={job.id} 
                     className="bg-[#1A1814] border border-rose-500/30 rounded-xl overflow-hidden shadow-[0_0_20px_rgba(225,29,72,0.05)]"
                  >
                     <div className="p-4 bg-rose-500/10 border-b border-rose-500/20 flex justify-between items-center">
                        <div className="flex items-center space-x-3 text-rose-400">
                           <FileAudio size={18} />
                           <span className="text-sm font-bold uppercase tracking-widest">JOB ID: {(job.id || "unk").substring(0,8)}</span>
                        </div>
                        <span className="px-2 py-1 bg-rose-500 text-white text-[10px] uppercase font-bold tracking-widest rounded shadow-[0_0_10px_rgba(225,29,72,0.5)] flex items-center">
                           <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping mr-2"></span> Awaiting Review
                        </span>
                     </div>
                     
                     <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                           <div className="text-xs uppercase tracking-widest font-bold text-[#8A7B66] mb-4 border-b border-[#3C362A] pb-2">Agent Analysis Context</div>
                           <div className="space-y-3">
                              <div className="flex justify-between items-center bg-[#14120E] p-3 rounded">
                                 <span className="text-xs text-[#8A7B66]">Threat Score</span>
                                 <span className="text-rose-500 font-mono font-bold text-lg">{job.data.threatScore || 85}/100</span>
                              </div>
                              <div className="flex justify-between items-center bg-[#14120E] p-3 rounded">
                                 <span className="text-xs text-[#8A7B66]">Source Matrix</span>
                                 <span className="text-white text-sm font-mono">{job.data.detectedDialect || 'Unknown'}</span>
                              </div>
                              <div className="flex justify-between items-center bg-[#14120E] p-3 rounded border border-[#3C362A]">
                                 <span className="text-xs text-[#8A7B66]">MCP Grounded Fact Check</span>
                                 {job.data.groundedFactCheck ? 
                                    <span className="text-emerald-500 font-bold text-[10px] bg-emerald-500/10 px-2 py-1 rounded">VERIFIED</span> : 
                                    <span className="text-rose-500 font-bold text-[10px] bg-rose-500/10 px-2 py-1 rounded">FABRICATED</span>
                                 }
                              </div>
                           </div>
                        </div>

                        <div className="flex flex-col justify-between">
                           <div className="bg-[#14120E] p-4 rounded-lg font-mono text-[10px] text-[#A39783] border border-[#3C362A] overflow-hidden mb-4">
                              <div className="text-rose-500 mb-2">RAW_TENSOR_OUTPUT</div>
                              {JSON.stringify(job.data, null, 2)}
                           </div>
                           
                           <div className="flex space-x-3 mt-auto">
                              <button onClick={() => handleAction(job.id, 'reject')} className="flex-1 flex justify-center items-center py-3 px-4 rounded-lg bg-[#2A261D] text-white hover:bg-rose-500/20 hover:text-rose-400 transition-colors border border-[#3C362A] hover:border-rose-500/50 group">
                                 <X size={16} className="mr-2 group-hover:scale-110 transition-transform"/> Reject (False Positive)
                              </button>
                              <button onClick={() => handleAction(job.id, 'approve')} className="flex-1 flex justify-center items-center py-3 px-4 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-colors border border-emerald-500/30 group">
                                 <Check size={16} className="mr-2 group-hover:scale-110 transition-transform"/> Confirm & Block
                              </button>
                           </div>
                        </div>
                     </div>
                  </motion.div>
               ))}
               {!loading && pendingJobs.length === 0 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-12 text-center text-[#8A7B66] border border-dashed border-[#3C362A] rounded-xl flex flex-col items-center">
                     <Shield size={48} className="mb-4 text-[#3C362A]" />
                     <div className="text-lg">No pending vectors.</div>
                     <div className="text-sm mt-2 opacity-50">All orchestration logic is currently passing guardrails.</div>
                  </motion.div>
               )}
            </AnimatePresence>
         </div>
      </main>
    </div>
  );
}
