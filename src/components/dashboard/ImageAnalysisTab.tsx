import React, { useRef, useEffect } from "react";
import { UploadCloud, CheckCircle, Target, TriangleAlert, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ImageAnalysisTabProps {
  file: File | null;
  preview: string | null;
  analyzing: boolean;
  result: any | null;
  handleFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
  executeAnalysis: () => void;
  drawSpectralMocks: () => void;
  sourceCanvasRef: React.RefObject<HTMLCanvasElement>;
  elaCanvasRef: React.RefObject<HTMLCanvasElement>;
  fftCanvasRef: React.RefObject<HTMLCanvasElement>;
  setFeedbackSent: (sent: boolean) => void;
  feedbackSent: boolean;
}

export function ImageAnalysisTab({
  file, preview, analyzing, result, handleFile, executeAnalysis,
  drawSpectralMocks, sourceCanvasRef, elaCanvasRef, fftCanvasRef,
  setFeedbackSent, feedbackSent
}: ImageAnalysisTabProps) {

  useEffect(() => {
    if (result && !result.cached) {
      drawSpectralMocks();
    }
  }, [result, drawSpectralMocks]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full min-h-[600px]">
      <section className="bg-[#1A1814] border border-[#3C362A] rounded-xl p-8 flex flex-col shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-20"></div>
        <h2 className="text-sm font-bold uppercase tracking-widest text-[#E8E1D5] mb-6 flex items-center font-serif">
          <UploadCloud size={18} className="mr-2 text-[#D4AF37]"/> Input Telemetry
        </h2>
        <div className="flex-1 border-2 border-dashed border-[#3C362A] rounded-xl flex flex-col items-center justify-center p-8 text-center relative group hover:border-[#D4AF37]/50 transition-colors bg-[#14120E] overflow-hidden">
          {preview ? (
            <div className="h-full w-full relative flex items-center justify-center">
              <img src={preview} alt="Evidence" className="max-h-full max-w-full object-contain rounded-lg opacity-80" />
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 mix-blend-overlay pointer-events-none"></div>
              {analyzing && (
                <div className="absolute inset-0 border-y-2 border-[#D4AF37]/80 h-32 w-full animate-scan pointer-events-none shadow-[0_0_20px_rgba(212,175,55,0.4)] blur-[1px]"></div>
              )}
            </div>
          ) : (
            <>
              <div className="w-16 h-16 bg-[#2A261D] rounded-full flex items-center justify-center mb-4 group-hover:bg-[#3C362A] transition-colors shadow-inner">
                <UploadCloud size={24} className="text-[#8A7B66] group-hover:text-[#D4AF37] transition-colors" />
              </div>
              <p className="text-xs uppercase font-bold text-[#8A7B66] mb-2 tracking-widest">Secure Asset Drop</p>
              <p className="text-[10px] text-[#5A5042] tracking-wider">Supports Military-grade JPEG, PNG, MPEG4</p>
            </>
          )}
          <input
            type="file"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={handleFile}
            accept="image/*,video/*"
          />
        </div>

        <button
          onClick={() => executeAnalysis()}
          disabled={!file || analyzing}
          className="mt-6 w-full bg-[#D4AF37] text-black font-bold uppercase tracking-widest py-4 rounded-xl shadow-[0_0_15px_rgba(212,175,55,0.2)] hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] disabled:opacity-50 disabled:shadow-none transition-all flex justify-center items-center text-xs"
        >
          {analyzing ? (
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-5 h-5 border-2 border-black border-t-transparent rounded-full mr-3" />
          ) : (
            <Target size={16} className="mr-2" />
          )}
          {analyzing ? "Synthesizing Analytics..." : "Execute Diagnostics"}
        </button>
      </section>

      <section className="bg-[#1A1814] border border-[#3C362A] rounded-xl p-8 shadow-2xl relative overflow-hidden flex flex-col">
        <h2 className="text-sm font-bold uppercase tracking-widest text-[#E8E1D5] mb-6 flex items-center justify-between font-serif">
          <span>Diagnostic Matrix</span>
          {result?.score && (
             <span className={`px-3 py-1 rounded text-[10px] bg-black bg-opacity-50 ${result.score > 70 ? 'text-rose-500 border border-rose-500/30' : result.score > 40 ? 'text-amber-500 border border-amber-500/30' : 'text-emerald-500 border border-emerald-500/30'}`}>
                INDEX: {result.score.toFixed(1)} / 100
             </span>
          )}
        </h2>

        {!result ? (
          <div className="flex-1 flex items-center justify-center text-[#5A5042] text-[10px] uppercase tracking-widest font-bold">
            Awaiting Telemetry Setup...
          </div>
        ) : (
          <div className="flex-1 space-y-6 overflow-y-auto pr-2 custom-scrollbar">
            {result.cached && (
               <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/30 p-3 rounded-lg flex items-start">
                 <Info size={14} className="text-[#D4AF37] mt-0.5 mr-2 flex-shrink-0" />
                 <p className="text-[10px] text-[#A69B85] uppercase tracking-widest">Vault Match Detected. Retrieving cached analytics footprint. Zero computational cycles consumed.</p>
               </div>
            )}
            
            <div className={`p-5 border-l-4 rounded-r-lg bg-[#2A261D]/50 backdrop-blur-sm ${result.verdict === 'DEEPFAKE' ? 'border-rose-500' : result.verdict === 'SUSPICIOUS' ? 'border-amber-500' : 'border-emerald-500'}`}>
              <div className="flex items-center justify-between">
                 <h3 className="text-lg font-serif font-bold text-white tracking-wide">{result.verdict}</h3>
                 {result.verdict === 'AUTHENTIC' ? <CheckCircle className="text-emerald-500" /> : <TriangleAlert className={result.verdict === 'DEEPFAKE' ? 'text-rose-500' : 'text-amber-500'} />}
              </div>
            </div>

            {/* Canvas placeholders for Spectral Mocks */}
            {preview && !result.cached && (
               <div className="space-y-4">
                  <div className="text-[10px] uppercase font-bold text-[#8A7B66] tracking-widest mb-1 border-b border-[#3C362A] pb-1">Spectral Forensics</div>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="bg-[#14120E] border border-[#3C362A] rounded-lg p-2 flex flex-col items-center">
                        <span className="text-[8px] uppercase tracking-widest text-[#5A5042] mb-2 font-bold w-full text-left">Error Level Analysis</span>
                        <canvas ref={elaCanvasRef} className="w-full h-auto rounded border border-[#3C362A]/50 bg-black mix-blend-screen" />
                     </div>
                     <div className="bg-[#14120E] border border-[#3C362A] rounded-lg p-2 flex flex-col items-center">
                        <span className="text-[8px] uppercase tracking-widest text-[#5A5042] mb-2 font-bold w-full text-left">Frequency Transform (FFT)</span>
                        <canvas ref={fftCanvasRef} className="w-full h-auto rounded border border-[#3C362A]/50 bg-black mix-blend-screen" />
                     </div>
                  </div>
               </div>
            )}

            {result.metadata?.india_threat?.identified && (
               <div className="border border-rose-500/20 bg-rose-500/5 rounded-lg p-4">
                  <div className="text-[10px] uppercase font-bold text-rose-500 tracking-widest mb-3 flex items-center">
                     <Target size={12} className="mr-2" /> Threat Archetype Identified
                  </div>
                  <div className="text-sm font-bold text-white font-serif mb-2">{result.metadata.india_threat.name}</div>
                  <div className="text-xs text-[#A69B85] mb-3">Confidence Matrix: <span className="text-rose-400 font-mono">{result.metadata.india_threat.confidence}%</span></div>
                  <ul className="text-[10px] text-[#8A7B66] space-y-1 ml-4 list-disc marker:text-rose-500">
                     {result.metadata.india_threat.reporting_rules?.map((rule: string, i: number) => (
                        <li key={i}>{rule}</li>
                     ))}
                  </ul>
               </div>
            )}

            <div className="border border-[#3C362A] bg-[#14120E] rounded-lg p-4">
               <div className="text-[10px] uppercase font-bold text-[#8A7B66] tracking-widest mb-3 border-b border-[#3C362A] pb-2">Analysis Breakdown</div>
               {result.analysisResult ? result.analysisResult.split('\n').map((para: string, i: number) => (
                  <p key={i} className="text-xs text-[#A69B85] mb-2 font-sans leading-relaxed">{para}</p>
               )) : (
                  <p className="text-xs text-[#A69B85] mb-2 font-sans leading-relaxed">
                     {result.verdict === 'AUTHENTIC' ? "This asset shows no signs of artificial manipulation or facial replacement. Safe for internal operations." : 
                     "This asset contains distinct spectral and metadata anomalies indicative of sophisticated forging or deepfake generation."}
                  </p>
               )}
            </div>

            <div className="bg-[#14120E] p-4 rounded-xl text-[10px] font-mono text-[#5A5042] border border-[#2A261D]">
              <div className="flex justify-between mb-1"><span>FILE:</span> <span className="text-[#8A7B66] truncate ml-2">{(file as any)?.name}</span></div>
              <div className="flex justify-between mb-1"><span>DIGEST:</span> <span className="text-[#D4AF37]/50">{(result.integrity_hash || result.fileHash || result.hash)?.substring(0,16)}...</span></div>
              {(result.osintReport || result.osint) && (
                 <>
                  <div className="flex justify-between mb-1"><span>EXIF SANITIZED:</span> <span className={(result.osintReport || result.osint).metadataStripped ? "text-amber-500" : "text-emerald-500"}>{(result.osintReport || result.osint).metadataStripped ? "TRUE (WARNING)" : "FALSE"}</span></div>
                  <div className="flex justify-between mb-1"><span>CAMERA/DEVICE:</span> <span className="text-[#8A7B66]">{(result.osintReport || result.osint).cameraInfo}</span></div>
                 </>
              )}
              <div className="flex justify-between"><span>LATENCY:</span> <span className="text-[#8A7B66]">{result.processing_time}ms</span></div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
