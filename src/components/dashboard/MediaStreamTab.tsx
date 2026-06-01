import React from "react";
import { Video, Mic, Scan, Activity } from "lucide-react";
import { motion } from "framer-motion";

interface MediaStreamTabProps {
  isStreaming: boolean;
  videoRef: React.RefObject<HTMLVideoElement>;
  vernacularTarget: string;
  setVernacularTarget: (val: string) => void;
  toggleStream: () => void;
  handleMediaHook: () => void;
  mediaLoading: boolean;
  captureFrameAndVerify: () => void;
  mediaData: any;
  mediaJobStatus?: string | null;
}

export function MediaStreamTab({
  isStreaming, videoRef, vernacularTarget, setVernacularTarget,
  toggleStream, handleMediaHook, mediaLoading, captureFrameAndVerify,
  mediaData, mediaJobStatus
}: MediaStreamTabProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full min-h-[600px]">
      <section className="bg-[#1A1814] border border-[#3C362A] rounded-xl p-8 flex flex-col shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-20"></div>
        <h2 className="text-sm font-bold uppercase tracking-widest text-[#E8E1D5] mb-6 flex items-center font-serif">
           <Video size={18} className="mr-2 text-[#D4AF37]"/> Video & Audio Stream Node
        </h2>
        <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-[#3C362A] rounded-xl relative overflow-hidden bg-[#14120E] min-h-[400px]">
            <video 
               id="videoRef"
               ref={videoRef}
               autoPlay 
               playsInline 
               muted
               className={`w-full h-full object-cover absolute inset-0 z-0 transition-opacity duration-300 ${isStreaming ? 'opacity-100' : 'opacity-0'}`} 
            />
            
            <div className={`relative z-10 flex flex-col items-center justify-center w-full h-full p-10 transition-opacity duration-300 ${isStreaming ? 'opacity-0 hover:opacity-100 bg-black/60' : 'opacity-100'}`}>
                {!isStreaming && <Video size={48} className="mb-4 opacity-50 text-[#8A7B66]" />}
                <span className="text-sm font-bold text-white font-serif text-center mb-2">Initialize Live Call Capture</span>
                <span className="text-[10px] uppercase font-bold text-[#8A7B66] text-center tracking-widest mb-6">Wav2Vec / PyTorch Microservices</span>
                
                <div className="w-full max-w-xs mb-6">
                   <label className="block text-[8px] uppercase tracking-widest font-bold text-[#8A7B66] mb-2">Target Vernacular Acoustics</label>
                   <select 
                      value={vernacularTarget}
                      onChange={(e) => setVernacularTarget(e.target.value)}
                      className="w-full bg-[#1A1814] border border-[#3C362A] text-white px-3 py-2 rounded-lg text-xs focus:outline-none focus:border-[#D4AF37]/50"
                   >
                      <option>Auto-Detect</option>
                      <option>Hindi (Central)</option>
                      <option>Bhojpuri (Eastern UP/Bihar)</option>
                      <option>Tamil (Southern)</option>
                      <option>Bengali (Eastern)</option>
                   </select>
                </div>

                <div className="flex flex-col gap-3 w-full max-w-xs">
                   <button 
                      onClick={toggleStream}
                      className={`w-full px-6 py-3 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center border ${isStreaming ? 'bg-rose-500/10 text-rose-500 border-rose-500/50 hover:bg-rose-500/20' : 'bg-[#D4AF37] text-black border-[#D4AF37] hover:bg-[#C19B2E] shadow-[0_0_15px_rgba(212,175,55,0.3)]'}`}
                   >
                      {isStreaming ? 'Stop Camera' : 'Start Camera'}
                   </button>

                   <button 
                      onClick={handleMediaHook}
                      disabled={mediaLoading || !isStreaming}
                      className="w-full bg-[#2A261D] hover:bg-[#3C362A] text-white px-6 py-3 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center disabled:opacity-50 border border-[#3C362A] hover:border-[#D4AF37]/50"
                   >
                      {mediaLoading ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-3" /> : null}
                      {mediaLoading ? 'Hooking Stream...' : 'Capture Audio Hook'}
                   </button>

                   <button 
                      onClick={captureFrameAndVerify}
                      disabled={!isStreaming}
                      className="w-full bg-[#2A261D] hover:bg-[#3C362A] text-[#D4AF37] px-6 py-3 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center disabled:opacity-50 border border-[#D4AF37]/30 hover:border-[#D4AF37]/80"
                   >
                      <Scan size={14} className="mr-2" />
                      Capture Frame Verify
                   </button>
                </div>
            </div>
        </div>
      </section>
      
      <section className="bg-[#1A1814] border border-[#3C362A] rounded-xl p-8 flex flex-col shadow-2xl">
         <h2 className="text-sm font-bold uppercase tracking-widest text-[#E8E1D5] mb-6 flex items-center font-serif">
            Microservice Telemetry
         </h2>
         {!mediaData && !mediaLoading ? (
            <div className="flex-1 flex items-center justify-center text-[#5A5042] text-[10px] uppercase tracking-widest font-bold">
               Awaiting Stream Hook...
            </div>
         ) : mediaLoading && mediaJobStatus ? (
            <div className="flex-1 flex flex-col items-center justify-center text-[#D4AF37] border border-[#3C362A] rounded-xl bg-[#14120E] min-h-[300px]">
               <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.5 }} className="flex flex-col items-center">
                  <Activity size={48} className="mb-4" />
                  <div className="text-[10px] uppercase font-bold tracking-widest text-[#8A7B66] mb-2">WebSockets Queue active</div>
                  <div className="text-sm font-mono">{mediaJobStatus}</div>
               </motion.div>
            </div>
         ) : !mediaData ? (
            <div className="flex-1 flex items-center justify-center text-[#5A5042] text-[10px] uppercase tracking-widest font-bold">
               Processing...
            </div>
         ) : (
            <div className="flex-1 space-y-4">
               <div className="p-4 bg-[#14120E] border border-[#3C362A] rounded-lg">
                  <div className="text-[10px] text-[#A69B85] uppercase tracking-widest mb-2 font-bold">Service Router</div>
                  <div className="text-sm text-[#D4AF37] font-mono">{mediaData.service}</div>
               </div>
               <div className="p-4 bg-[#14120E] border border-[#3C362A] rounded-lg grid grid-cols-2 gap-4">
                  <div>
                     <div className="text-[10px] text-[#A69B85] uppercase tracking-widest mb-1 font-bold">Base Dialect</div>
                     <div className="text-sm text-white font-serif">{mediaData.detectedDialect}</div>
                  </div>
                  <div>
                     <div className="text-[10px] text-[#A69B85] uppercase tracking-widest mb-1 font-bold">Probability</div>
                     <div className={`text-sm font-mono font-bold ${mediaData.deepfakeProbability > 60 ? 'text-rose-500' : 'text-emerald-500'}`}>{mediaData.deepfakeProbability}%</div>
                  </div>
               </div>
               <div className="space-y-2">
                  <div className={`p-3 rounded border text-xs font-bold tracking-wide flex justify-between ${mediaData.voiceCloningDetected ? 'bg-rose-500/10 border-rose-500/50 text-rose-500' : 'bg-[#2A261D] border-[#3C362A] text-[#8A7B66]'}`}>
                     <span>Voice Cloning Sigs</span>
                     <span>{mediaData.voiceCloningDetected ? 'DETECTED' : 'CLEAN'}</span>
                  </div>
                  <div className={`p-3 rounded border text-xs font-bold tracking-wide flex justify-between ${mediaData.lipSyncAnomalies ? 'bg-amber-500/10 border-amber-500/50 text-amber-500' : 'bg-[#2A261D] border-[#3C362A] text-[#8A7B66]'}`}>
                     <span>Visual Sync Deprecation</span>
                     <span>{mediaData.lipSyncAnomalies ? 'DETECTED' : 'CLEAN'}</span>
                  </div>
               </div>
               <p className="text-[10px] text-[#5A5042] font-mono pt-4 border-t border-[#3C362A]">
                  Note: In prod, this forwards raw WebRTC byte streams to the AI pipeline.
               </p>
            </div>
         )}
      </section>
    </div>
  );
}
