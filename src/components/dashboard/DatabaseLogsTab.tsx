import React, { useState } from "react";
import { Database, AlertTriangle, Download, ChevronDown, ChevronUp, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { jsPDF } from "jspdf";

interface DatabaseLogsTabProps {
  databaseLogs: any[];
  dbLoading: boolean;
  expandedLogId: string | null;
  setExpandedLogId: (id: string | null) => void;
}

export function DatabaseLogsTab({ databaseLogs, dbLoading, expandedLogId, setExpandedLogId }: DatabaseLogsTabProps) {

  const generatePDFReport = (log: any) => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.setTextColor(212, 175, 55); 
    doc.text("VAJRA INTELLIGENCE REPORT", 20, 20);
    
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 30);
    
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text(`Verdict: ${log.verdict}`, 20, 45);
    doc.text(`Threat Score: ${log.score.toFixed(1)} / 100`, 20, 55);
    doc.text(`File Hash: ${log.hash}`, 20, 65);
    
    if (log.identification?.identified) {
       doc.text(`Threat Actor: ${log.identification.name}`, 20, 75);
       let yPos = 85;
       log.identification.reporting_rules.forEach((r: string) => {
          const splitTitle = doc.splitTextToSize(`- ${r}`, 170);
          doc.text(splitTitle, 20, yPos);
          yPos += 10 * splitTitle.length;
       });
    }

    doc.save(`Vajra_Report_${(log.hash || log.fileHash || log.integrity_hash || "unk").substring(0,8)}.pdf`);
  };

  return (
    <div className="h-full min-h-[600px] flex flex-col bg-[#1A1814] border border-[#3C362A] rounded-xl shadow-2xl overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-20"></div>
      <div className="p-8 pb-4 border-b border-[#3C362A] flex justify-between items-center">
         <h2 className="text-sm font-bold uppercase tracking-widest text-[#E8E1D5] flex items-center font-serif">
            <Database size={18} className="mr-2 text-[#D4AF37]"/> Immutable Blockchain Ledger
         </h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
         {dbLoading ? (
            <div className="flex items-center justify-center h-full text-[#8A7B66] text-xs font-bold uppercase tracking-widest">
               <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-5 h-5 border-2 border-[#D4AF37] border-t-transparent rounded-full mr-3" />
               Syncing Ledger...
            </div>
         ) : databaseLogs.length === 0 ? (
            <div className="flex items-center justify-center h-full text-[#5A5042] text-[10px] font-bold uppercase tracking-widest">
               No architectural logs found.
            </div>
         ) : (
            <div className="space-y-4">
               {databaseLogs.map((log: any, idx: number) => (
                  <div key={idx} className="bg-[#14120E] border border-[#3C362A] rounded-xl overflow-hidden transition-all hover:border-[#D4AF37]/30">
                     <div 
                        className="p-4 cursor-pointer flex items-center justify-between"
                        onClick={() => setExpandedLogId(expandedLogId === log.hash ? null : log.hash)}
                     >
                        <div className="flex items-center space-x-4">
                           <div className={`w-2 h-2 rounded-full ${log.verdict === 'DEEPFAKE' ? 'bg-rose-500 shadow-[0_0_10px_#f43f5e]' : log.verdict === 'SUSPICIOUS' ? 'bg-amber-500' : 'bg-emerald-500'}`}></div>
                           <div className="font-mono text-xs text-[#8A7B66]">{(log.hash || log.fileHash || log.integrity_hash || log.id || "unk").substring(0, 16)}...</div>
                           <div className="text-[10px] uppercase font-bold text-[#5A5042] hidden md:block">
                              {new Date(log.timestamp).toLocaleString()}
                           </div>
                        </div>
                        <div className="flex items-center space-x-4">
                           <div className={`text-xs font-bold font-serif ${log.verdict === 'DEEPFAKE' ? 'text-rose-500' : 'text-emerald-500'}`}>
                              {log.verdict}
                           </div>
                           {expandedLogId === log.hash ? <ChevronUp size={16} className="text-[#8A7B66]" /> : <ChevronDown size={16} className="text-[#8A7B66]" />}
                        </div>
                     </div>
                     
                     <AnimatePresence>
                        {expandedLogId === log.hash && (
                           <motion.div 
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="border-t border-[#3C362A] bg-[#0A0907] p-6"
                           >
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                 <div>
                                    <h4 className="text-[10px] uppercase font-bold tracking-widest text-[#8A7B66] mb-2 border-b border-[#3C362A] pb-1">AI Diagnostics</h4>
                                    <p className="text-xs text-[#A69B85] font-sans leading-relaxed">
                                       {log.analysisResult?.substring(0, 300)}...
                                    </p>
                                 </div>
                                 <div className="space-y-4">
                                    <div className="bg-[#14120E] p-3 rounded border border-[#2A261D]">
                                       <div className="text-[9px] uppercase font-bold text-[#5A5042] mb-1">Threat Score</div>
                                       <div className="text-lg font-mono text-white">{log.score.toFixed(1)} <span className="text-xs text-[#5A5042]">/ 100</span></div>
                                    </div>
                                    {log.identification?.identified && (
                                       <div className="bg-rose-500/5 p-3 rounded border border-rose-500/20">
                                          <div className="text-[9px] uppercase font-bold text-rose-500 mb-1 flex items-center"><AlertTriangle size={10} className="mr-1"/> Actor Match</div>
                                          <div className="text-xs font-serif text-white">{log.identification.name}</div>
                                       </div>
                                    )}
                                    <button 
                                       onClick={(e) => { e.stopPropagation(); generatePDFReport(log); }}
                                       className="w-full py-2 bg-[#2A261D] hover:bg-[#3C362A] border border-[#3C362A] hover:border-[#D4AF37]/50 text-white text-xs font-bold uppercase tracking-widest rounded transition-colors flex justify-center items-center"
                                    >
                                       <Download size={14} className="mr-2" /> Download Report PDF
                                    </button>
                                 </div>
                              </div>
                           </motion.div>
                        )}
                     </AnimatePresence>
                  </div>
               ))}
            </div>
         )}
      </div>
    </div>
  );
}
