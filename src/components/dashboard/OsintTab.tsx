import React from "react";
import { ShieldAlert, AlertTriangle, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

interface OsintTabProps {
  osintQuery: string;
  setOsintQuery: (val: string) => void;
  osintLoading: boolean;
  osintData: any;
  handleOsintScan: () => void;
}

export function OsintTab({ osintQuery, setOsintQuery, osintLoading, osintData, handleOsintScan }: OsintTabProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full min-h-[600px]">
      <section className="bg-[#1A1814] border border-[#3C362A] rounded-xl p-8 flex flex-col shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-20"></div>
        <h2 className="text-sm font-bold uppercase tracking-widest text-[#E8E1D5] mb-6 flex items-center font-serif">
           <ShieldAlert size={18} className="mr-2 text-[#D4AF37]"/> Automated Dark Web OSINT
        </h2>
        <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-[#3C362A] rounded-xl p-10 text-[#8A7B66]">
            <ShieldAlert size={48} className="mb-4 opacity-50" />
            <span className="text-sm font-bold text-white font-serif text-center mb-2">Reverse Image / Intel Match</span>
            <span className="text-[10px] uppercase font-bold text-center tracking-widest mb-6">Initialize Python Scraper Nodes</span>
            
            <input 
               type="text" 
               placeholder="Enter Asset Hash or Image URL..."
               value={osintQuery}
               onChange={(e) => setOsintQuery(e.target.value)}
               className="w-full max-w-xs bg-[#14120E] border border-[#3C362A] text-white px-4 py-3 rounded-lg text-xs focus:outline-none focus:border-[#D4AF37]/50 mb-6 font-mono"
            />

            <button 
               onClick={handleOsintScan}
               disabled={!osintQuery || osintLoading}
               className="w-full max-w-xs bg-[#2A261D] hover:bg-[#3C362A] text-white px-6 py-3 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center disabled:opacity-50 border border-[#3C362A] hover:border-[#D4AF37]/50"
            >
               {osintLoading ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-3" /> : null}
               {osintLoading ? 'Scanning Dark Web...' : 'Run OSINT Module'}
            </button>
        </div>
      </section>
      
      <section className="bg-[#1A1814] border border-[#3C362A] rounded-xl p-8 flex flex-col shadow-2xl">
         <h2 className="text-sm font-bold uppercase tracking-widest text-[#E8E1D5] mb-6 flex items-center font-serif">
            Early Warning Results
         </h2>
         {!osintData ? (
            <div className="flex-1 flex items-center justify-center text-[#5A5042] text-[10px] uppercase tracking-widest font-bold">
               Awaiting Node Execution...
            </div>
         ) : (
            <div className="flex-1 space-y-4">
               <div className={`p-4 rounded-lg border flex items-start ${osintData.vip_threat_level === 'CRITICAL' ? 'bg-rose-500/10 border-rose-500/50' : 'bg-amber-500/10 border-amber-500/50'}`}>
                  <AlertTriangle size={20} className={`mr-3 mt-1 ${osintData.vip_threat_level === 'CRITICAL' ? 'text-rose-500' : 'text-amber-500'}`} />
                  <div>
                     <h3 className={`text-xs font-bold uppercase tracking-widest ${osintData.vip_threat_level === 'CRITICAL' ? 'text-rose-500' : 'text-amber-500'}`}>Threat Level: {osintData.vip_threat_level}</h3>
                     <p className="text-sm text-white font-serif mt-1">{osintData.matches} Identical Assets Found in Wild</p>
                  </div>
               </div>
               
               <div className="p-4 bg-[#14120E] border border-[#3C362A] rounded-lg">
                  <div className="text-[10px] text-[#A69B85] uppercase tracking-widest mb-3 font-bold border-b border-[#3C362A] pb-2">Propagation Vectors (Nodes)</div>
                  <ul className="space-y-2">
                     {osintData.urls.map((url: string, i: number) => (
                        <li key={i} className="text-xs font-mono text-[#D4AF37]/80 truncate">
                           <span className="text-[#5A5042] mr-2">[{i+1}]</span>{url}
                        </li>
                     ))}
                  </ul>
               </div>

               {osintData.early_warning_triggered && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded flex items-center text-emerald-500 text-xs font-bold uppercase tracking-widest">
                     <ShieldCheck size={14} className="mr-2" /> Early Warning Alerts Dispatched to Authorities
                  </div>
               )}
            </div>
         )}
      </section>
    </div>
  );
}
