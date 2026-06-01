import React, { useState, useEffect } from "react";
import { Users, Shield, BarChart, Settings, List, Eye, BrainCircuit, Activity, Database, LogOut, ChevronRight } from "lucide-react";
import { collection, getDocs, orderBy, query, limit } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ApiKeysPanel } from "../components/admin/ApiKeysPanel";

export default function AdminTerminal() {
  const navigate = useNavigate();
  const [logs, setLogs] = useState<any[]>([]);
  const [selectedLog, setSelectedLog] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<'overview'|'keys'>('overview');
  
  // AI Assistant State
  const [aiPanelOpen, setAiPanelOpen] = useState(false);
  const [queryInput, setQueryInput] = useState("");
  const [aiChat, setAiChat] = useState<{role: 'user'|'agent', content: string}[]>([]);
  const [isAiTyping, setIsAiTyping] = useState(false);

  useEffect(() => {
    const fetchDatabaseLogs = async () => {
      try {
        const q = query(collection(db, "scans"), orderBy("timestamp", "desc"), limit(20));
        const querySnapshot = await getDocs(q);
        const docs = querySnapshot.docs.map(doc => doc.data());
        setLogs(docs);
      } catch (err) {
        console.error("Failed to fetch logs", err);
      }
    };
    fetchDatabaseLogs();
  }, []);

  const handleAiSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryInput.trim()) return;

    const userPrompt = queryInput;
    setAiChat(prev => [...prev, { role: 'user', content: userPrompt }]);
    setQueryInput("");
    setIsAiTyping(true);

    try {
      const res = await fetch("/api/admin/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
           prompt: userPrompt,
           logsContext: logs.slice(0, 5) // send top 5 logs as context
        })
      });
      const data = await res.json();
      setAiChat(prev => [...prev, { role: 'agent', content: data.reply || data.error }]);
    } catch(err) {
      setAiChat(prev => [...prev, { role: 'agent', content: "SYSTEM FAILURE: Connection to Vajra AI Core lost." }]);
    } finally {
      setIsAiTyping(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#14120E] text-[#E8E1D5] font-sans selection:bg-[#D4AF37] selection:text-black">
      <div className="flex h-screen overflow-hidden">
        
        {/* Sidebar */}
        <aside className="w-64 bg-[#1A1814] border-r border-[#3C362A] p-6 hidden md:flex flex-col relative">
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#D4AF37 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>
          
          <div className="flex items-center space-x-3 mb-10 z-10">
            <Shield className="text-[#D4AF37]" size={32} />
            <div>
               <div className="text-xl font-black tracking-widest text-white uppercase font-serif">VAJRA<span className="text-[#D4AF37]">CORE</span></div>
               <div className="text-[9px] uppercase tracking-widest font-bold text-[#8A7B66]">Classified Admin Node</div>
            </div>
          </div>
          
          <nav className="space-y-3 z-10 font-medium">
             <button onClick={() => setActiveTab('overview')} className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-sm transition-colors ${activeTab === 'overview' ? 'bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20' : 'hover:bg-[#2A261D] text-[#8A7B66]'}`}><BarChart size={18}/><span>Intelligence Overview</span></button>
             <button className="flex items-center space-x-3 w-full hover:bg-[#2A261D] px-4 py-3 rounded-lg text-sm text-[#8A7B66] transition-colors"><List size={18}/><span>Global Audit Logs</span></button>
             <button onClick={() => setAiPanelOpen(true)} className="flex items-center space-x-3 w-full hover:bg-[#2A261D] px-4 py-3 rounded-lg text-sm text-[#8A7B66] transition-colors"><BrainCircuit size={18}/><span>Vajra AI Assistant</span></button>
             <button onClick={() => setActiveTab('keys')} className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-sm transition-colors ${activeTab === 'keys' ? 'bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20' : 'hover:bg-[#2A261D] text-[#8A7B66]'}`}><Users size={18}/><span>Agency Access Control</span></button>
          </nav>
          
          <div className="mt-auto z-10">
             <button onClick={() => navigate('/')} className="flex items-center text-xs font-bold uppercase tracking-widest text-[#5A5042] hover:text-[#D4AF37] transition-colors w-full p-2">
                <LogOut size={14} className="mr-2"/> Exit Terminal
             </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 overflow-y-auto relative">
           
           <header className="mb-10 flex justify-between items-end">
              <div>
                 <h1 className="text-3xl font-black mb-2 text-white font-serif tracking-tight">
                    {activeTab === 'overview' ? 'System Intelligence' : 'Agency Access Control'}
                 </h1>
                 <p className="text-sm text-[#8A7B66]">
                    {activeTab === 'overview' ? 'Real-time monitoring of autonomous orchestrator routing and threat vectors.' : 'Issue identity tokens for remote node authorization.'}
                 </p>
              </div>
              <div className="text-right">
                 <div className="text-xs uppercase tracking-widest font-bold text-[#D4AF37]">Clearance Level</div>
                 <div className="text-xl font-mono">SUPREME_COMMAND</div>
              </div>
           </header>

           {activeTab === 'keys' && <ApiKeysPanel />}

           {activeTab === 'overview' && (
             <>
               {/* Metrics */}
               <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
              <div className="bg-[#1A1814] p-6 border border-[#3C362A] rounded-xl relative overflow-hidden group hover:border-[#D4AF37]/50 transition-colors">
                 <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Activity size={48} className="text-[#D4AF37]" /></div>
                 <div className="text-xs font-bold uppercase tracking-widest text-[#8A7B66] mb-2">Total Scans</div>
                 <div className="text-4xl font-mono text-white">1,428</div>
                 <div className="mt-3 text-xs text-emerald-500 font-bold">+12% this week</div>
              </div>
              <div className="bg-[#1A1814] p-6 border border-[#3C362A] rounded-xl relative overflow-hidden group hover:border-[#D4AF37]/50 transition-colors">
                 <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><BrainCircuit size={48} className="text-rose-500" /></div>
                 <div className="text-xs font-bold uppercase tracking-widest text-[#8A7B66] mb-2">Deepfake Rate</div>
                 <div className="text-4xl font-mono text-rose-500">18.4%</div>
                 <div className="mt-3 text-xs text-rose-500/70 font-bold">Elevated alert</div>
              </div>
              <div className="bg-[#1A1814] p-6 border border-[#3C362A] rounded-xl relative overflow-hidden group hover:border-[#D4AF37]/50 transition-colors">
                 <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Database size={48} className="text-amber-500" /></div>
                 <div className="text-xs font-bold uppercase tracking-widest text-[#8A7B66] mb-2">Cached Vectors</div>
                 <div className="text-4xl font-mono text-amber-500">842</div>
                 <div className="mt-3 text-xs text-amber-500/70 font-bold">Vault integrity: 100%</div>
              </div>
              <div className="bg-[#1A1814] p-6 border border-[#3C362A] rounded-xl relative overflow-hidden group hover:border-[#D4AF37]/50 transition-colors">
                 <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Activity size={48} className="text-emerald-500" /></div>
                 <div className="text-xs font-bold uppercase tracking-widest text-[#8A7B66] mb-2">Node Status</div>
                 <div className="text-4xl font-mono text-emerald-500">OPTIMAL</div>
                 <div className="mt-3 text-xs text-emerald-500/70 font-bold">Auto-orchestration Active</div>
              </div>
           </div>

           {/* Logs Table */}
           <div className="bg-[#1A1814] border border-[#3C362A] rounded-xl overflow-hidden">
              <div className="p-6 border-b border-[#3C362A] flex justify-between items-center bg-[#1F1C17]">
                 <h2 className="font-serif text-lg font-bold text-white">Global Audit Logs & Routing</h2>
              </div>
              <div className="overflow-x-auto">
                 <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-[#14120E] text-[#8A7B66]">
                       <tr>
                          <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px]">Timestamp</th>
                          <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px]">Asset Signature</th>
                          <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px]">Orchestrator Route</th>
                          <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px]">Verdict</th>
                          <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px]">Action</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-[#3C362A]">
                       {logs.map((L, i) => (
                          <tr key={i} className="hover:bg-[#2A261D]/50 transition-colors cursor-pointer" onClick={() => setSelectedLog(L)}>
                             <td className="px-6 py-4 font-mono text-xs text-[#A39783]">{new Date(L.timestamp).toLocaleString()}</td>
                             <td className="px-6 py-4 font-mono text-xs max-w-[200px] truncate" title={L.filename}>{L.filename}</td>
                             <td className="px-6 py-4">
                                <div className="flex space-x-1">
                                   <span className="w-2 h-2 rounded-full bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.8)]" title="Spectral Engine" />
                                   <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" title="OSINT Engine" />
                                   {L.metadata?.routes_taken?.neural_llm_engine ? (
                                      <span className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]" title="LLM Neural Engine" />
                                   ) : (
                                      <span className="w-2 h-2 rounded-full bg-[#3C362A]" title="LLM Neural Bypassed" />
                                   )}
                                </div>
                             </td>
                             <td className="px-6 py-4">
                                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest border ${
                                   L.verdict === 'DEEPFAKE' ? 'bg-rose-500/10 text-rose-500 border-rose-500/30' :
                                   L.verdict === 'SUSPICIOUS' ? 'bg-amber-500/10 text-amber-500 border-amber-500/30' :
                                   'bg-[emerald]-500/10 text-emerald-500 border-emerald-500/30'
                                }`}>
                                   {L.verdict}
                                </span>
                             </td>
                             <td className="px-6 py-4">
                                <button className="text-[#D4AF37] hover:text-white transition-colors"><ChevronRight size={18}/></button>
                             </td>
                          </tr>
                       ))}
                       {logs.length === 0 && (
                          <tr><td colSpan={5} className="px-6 py-8 text-center text-[#8A7B66]">No recent logs found.</td></tr>
                       )}
                    </tbody>
                 </table>
              </div>
           </div>
           </>
          )}
        </main>
        
        {/* Detail Modal */}
        <AnimatePresence>
           {selectedLog && (
              <motion.div 
                 initial={{ opacity: 0, x: 100 }} 
                 animate={{ opacity: 1, x: 0 }} 
                 exit={{ opacity: 0, x: 100 }}
                 className="absolute right-0 top-0 bottom-0 w-96 bg-[#1A1814] border-l border-[#3C362A] shadow-2xl p-6 overflow-y-auto z-50 flex flex-col"
              >
                 <div className="flex justify-between items-center mb-6">
                    <h3 className="font-serif text-xl font-bold text-white">Log Forensics</h3>
                    <button onClick={() => setSelectedLog(null)} className="text-[#8A7B66] hover:text-white p-1 bg-[#2A261D] rounded">✕</button>
                 </div>

                 <div className="space-y-6">
                    <div>
                       <div className="text-[10px] font-bold uppercase tracking-widest text-[#8A7B66] mb-1">Asset Hash (SHA-256)</div>
                       <div className="font-mono text-[10px] text-[#A39783] bg-[#14120E] p-2 rounded border border-[#3C362A] break-all">
                          {selectedLog.fileHash}
                       </div>
                    </div>

                    <div className="bg-[#14120E] p-4 rounded-lg border border-[#3C362A]">
                       <div className="text-[10px] font-bold uppercase tracking-widest text-[#8A7B66] mb-3">Orchestrator Diagnostics</div>
                       <div className="space-y-3">
                          <div className="flex justify-between items-center text-sm">
                             <span className="text-[#E8E1D5]">Spectral Engine (ELA)</span>
                             <span className="font-mono text-white">{selectedLog.metadata?.ela_score ?? "N/A"}</span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                             <span className="text-[#E8E1D5]">Frequency Engine (FFT)</span>
                             <span className="font-mono text-white">{selectedLog.metadata?.fft_score ?? "N/A"}</span>
                          </div>
                          <div className="flex justify-between items-center text-sm pt-2 border-t border-[#3C362A]">
                             <span className="text-[#E8E1D5] flex items-center">Neural LLM Triggered</span>
                             {selectedLog.metadata?.routes_taken?.neural_llm_engine ? (
                                <span className="text-amber-500 font-bold text-[10px] uppercase tracking-widest px-2 py-0.5 bg-amber-500/10 rounded">YES</span>
                             ) : (
                                <span className="text-[#8A7B66] font-bold text-[10px] uppercase tracking-widest">BYPASSED</span>
                             )}
                          </div>
                       </div>
                    </div>

                    {selectedLog.metadata?.india_threat?.identified && (
                       <div className="bg-rose-500/5 p-4 rounded-lg border border-rose-500/30 shadow-[0_0_15px_rgba(225,29,72,0.1)]">
                          <div className="text-[10px] font-bold uppercase tracking-widest text-rose-500 mb-2 flex items-center">
                             <Shield size={12} className="mr-2" /> Threat Vector Matched
                          </div>
                          <div className="text-sm font-bold text-rose-400 font-serif leading-tight">
                             {selectedLog.metadata.india_threat.name}
                          </div>
                          <ul className="mt-3 space-y-1">
                             {selectedLog.metadata.india_threat.reporting_rules?.map((r: string, i: number) => (
                                <li key={i} className="text-[10px] text-rose-500/80 pl-2 border-l border-rose-500/30">
                                   {r}
                                </li>
                             ))}
                          </ul>
                       </div>
                    )}
                 </div>
              </motion.div>
           )}
        </AnimatePresence>
         {/* AI Assistant Modal */}
         <AnimatePresence>
            {aiPanelOpen && (
               <motion.div 
                  initial={{ opacity: 0, x: 100 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  exit={{ opacity: 0, x: 100 }}
                  className="absolute right-0 top-0 bottom-0 w-[400px] bg-[#1A1814] border-l border-[#3C362A] shadow-[0_0_50px_rgba(212,175,55,0.05)] p-6 overflow-hidden z-50 flex flex-col"
               >
                  <div className="flex justify-between items-center mb-6">
                     <div className="flex items-center space-x-2 text-[#D4AF37]">
                        <BrainCircuit size={24} />
                        <h3 className="font-serif text-xl font-bold">Vajra Core<span className="text-white ml-1 text-sm font-sans tracking-widest uppercase align-middle bg-[#D4AF37]/20 px-2 py-0.5 rounded">AI</span></h3>
                     </div>
                     <button onClick={() => setAiPanelOpen(false)} className="text-[#8A7B66] hover:text-white p-1 bg-[#2A261D] rounded">✕</button>
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4 scrollbar-thin scrollbar-thumb-[#3C362A]">
                     {aiChat.length === 0 && (
                        <div className="text-center text-[#8A7B66] text-xs font-mono py-10 opacity-50">
                           System Manager Initialized. Provide an inquiry or command regarding the node matrix...
                        </div>
                     )}
                     {aiChat.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                           <div className={`max-w-[85%] text-sm rounded-lg p-3 ${
                              msg.role === 'user' ? 'bg-[#D4AF37] text-black font-medium' : 'bg-[#14120E] border border-[#3C362A] text-[#E8E1D5]'
                           }`}>
                              {msg.content}
                           </div>
                        </div>
                     ))}
                     {isAiTyping && (
                        <div className="flex justify-start">
                           <div className="bg-[#14120E] border border-[#3C362A] rounded-lg p-3 w-16 flex justify-center space-x-1">
                              <span className="w-1.5 h-1.5 bg-[#8A7B66] rounded-full animate-bounce"></span>
                              <span className="w-1.5 h-1.5 bg-[#8A7B66] rounded-full animate-bounce" style={{animationDelay: '100ms'}}></span>
                              <span className="w-1.5 h-1.5 bg-[#8A7B66] rounded-full animate-bounce" style={{animationDelay: '200ms'}}></span>
                           </div>
                        </div>
                     )}
                  </div>

                  <form onSubmit={handleAiSubmit} className="relative">
                     <input 
                        type="text" 
                        value={queryInput}
                        onChange={(e) => setQueryInput(e.target.value)}
                        placeholder="Command Vajra Core..."
                        className="w-full bg-[#14120E] border border-[#3C362A] text-white pl-4 pr-10 py-3 rounded-lg text-sm focus:outline-none focus:border-[#D4AF37]/50"
                        disabled={isAiTyping}
                     />
                     <button type="submit" disabled={isAiTyping} className="absolute right-2 top-2 text-[#D4AF37] p-1.5 hover:bg-[#D4AF37]/10 rounded transition-colors">
                        <ChevronRight size={16} />
                     </button>
                  </form>
               </motion.div>
            )}
         </AnimatePresence>

      </div>
    </div>
  );
}
