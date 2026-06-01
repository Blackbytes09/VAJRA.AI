import React, { useState, useEffect } from "react";
import { ShieldCheck, UploadCloud, Search, Info, LogIn, Activity, Network, Box, Lock, Database, ArrowRight, Bot, Cpu, Target, Radar, Loader, AlertTriangle, CheckCircle, Image as ImageIcon, Link as LinkIcon, Film, PlayCircle, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { AuthModal } from "../components/AuthModal";

export default function PublicPortal() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  const [scansAvailable, setScansAvailable] = useState({ images: 5, links: 3, videos: 2 });
  const [scanType, setScanType] = useState<"image" | "link" | "video">("image");
  
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [linkInput, setLinkInput] = useState("");
  
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          setScansAvailable(userDoc.data().scansAvailable || { images: 5, links: 3, videos: 2 });
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setScansAvailable({ images: 5, links: 3, videos: 2 });
    setResult(null);
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      setFile(f);
      if (f.type.startsWith("image/")) {
        setPreview(URL.createObjectURL(f));
      } else {
        setPreview(null);
      }
      setResult(null);
      setError(null);
    }
  };

  const handleFreeScan = async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    let scanKey: 'images' | 'links' | 'videos' = 'images';
    if (scanType === 'link') scanKey = 'links';
    if (scanType === 'video') scanKey = 'videos';

    if (scansAvailable[scanKey] <= 0) {
      navigate('/pricing');
      return;
    }

    if (scanType !== 'link' && !file) return;
    if (scanType === 'link' && !linkInput) return;

    setAnalyzing(true);
    setResult(null);
    setError(null);

    const formData = new FormData();
    if (scanType !== 'link') {
      formData.append("asset", file as File);
    } else {
      formData.append("link", linkInput);
    }
    formData.append("scanType", scanType);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Analysis failed. Please try again or use the Pro Terminal.");
      }
      
      const data = await res.json();
      setResult(data);
      
      // Update Firebase
      const newScans = { ...scansAvailable, [scanKey]: scansAvailable[scanKey] - 1 };
      setScansAvailable(newScans);
      await updateDoc(doc(db, "users", user.uid), {
        scansAvailable: newScans
      });

    } catch (err: any) {
      setError(err.message);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#E8E1D5] font-sans selection:bg-[#FF9933] selection:text-black overflow-hidden relative">
      {/* Indian Cyberpunk Background Grid & Glows */}
      <div className="absolute inset-0 z-0 pointer-events-none">
         <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#FF9933] rounded-full mix-blend-screen filter blur-[150px] opacity-10 animate-pulse"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#138808] rounded-full mix-blend-screen filter blur-[150px] opacity-10 animate-pulse" style={{ animationDelay: '2s' }}></div>
         <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>

      {/* Pitch Dashboard Header */}
      <header className="border-b border-[#333333]/50 bg-[#0A0A0A]/80 backdrop-blur-md sticky top-0 z-50">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
            <div className="flex items-center space-x-3 group cursor-pointer">
               <div className="bg-[#1C2026] text-[#FF9933] p-2 rounded shadow-[0_0_15px_rgba(255,153,51,0.2)] border border-[#FF9933]/50 group-hover:bg-[#FF9933] group-hover:text-black transition-all">
                 <ShieldCheck size={28} />
               </div>
               <div>
                  <h1 className="text-2xl font-black tracking-tight text-white font-serif flex items-center">
                    VAJRA <span className="ml-2 px-2 py-0.5 bg-[#FF9933]/10 text-[#FF9933] text-[10px] rounded border border-[#FF9933]/20 tracking-widest font-sans uppercase">Tactical Core</span>
                  </h1>
                  <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#8A7B66]">Bharat Cyber Command</span>
               </div>
            </div>
            <div className="flex items-center space-x-6">
               <div className="hidden md:flex flex-col items-end mr-4">
                 <span className="text-[10px] text-[#138808] font-bold tracking-widest uppercase flex items-center"><div className="w-1.5 h-1.5 bg-[#138808] rounded-full animate-ping mr-2"></div> All Nodes Online</span>
                 <span className="text-[9px] text-gray-500 font-mono">ENCRYPTED // AES-256</span>
               </div>
               
               {user ? (
                 <button onClick={handleLogout} className="hidden sm:flex items-center text-xs font-bold tracking-widest uppercase text-rose-500 hover:text-white transition-colors">
                    Logout
                 </button>
               ) : (
                 <button onClick={() => setShowAuthModal(true)} className="hidden sm:flex items-center text-xs font-bold tracking-widest uppercase text-[#FF9933] hover:text-white transition-colors">
                    <LogIn size={14} className="mr-2" /> Operator Login
                 </button>
               )}

               <button onClick={() => navigate('/pricing')} className="hidden sm:flex items-center text-xs font-bold tracking-widest uppercase text-[#8A7B66] hover:text-[#FF9933] transition-colors hover:shadow-[0_0_10px_rgba(255,153,51,0.5)]">
                  Enterprise Pricing
               </button>
               <button onClick={() => navigate('/pro')} className="bg-[linear-gradient(135deg,#FF9933_0%,#E97400_100%)] text-black px-6 py-2.5 rounded text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,153,51,0.4)] flex items-center gap-2 border border-[#FF9933]">
                  Deploy Terminal <ArrowRight size={14} />
               </button>
            </div>
         </div>
      </header>

      {/* Hero Section - The Pitch */}
      <main className="max-w-7xl mx-auto px-4 py-16 sm:py-24 relative z-10">
         
         <div className="text-center mb-24 max-w-4xl mx-auto relative">
            <div className="inline-block mb-4 px-4 py-1 border border-[#FF9933]/30 bg-[#FF9933]/5 rounded-full">
               <span className="text-[#FF9933] text-[10px] font-bold tracking-[0.3em] uppercase">॥ सत्यमेव जयते ॥</span>
            </div>
            <h2 className="text-5xl sm:text-7xl font-black text-white mb-6 leading-tight font-serif tracking-tighter">
               12-Layer <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF9933] to-[#D4AF37] italic">Agentic AI</span> Matrix.
            </h2>
            <p className="text-xl text-[#8A7B66] max-w-3xl mx-auto leading-relaxed border-l-2 border-[#138808] pl-6 text-left sm:text-center sm:border-l-0 sm:pl-0">
               Vajra is the premier Multi-Agent Swarm engineered for the Indian cyberspace. Designed to detect manipulated media, deepfake propaganda, and asymmetric threats using rigorous algorithmic grounding.
            </p>
         </div>

         {/* Free Public Deepfake Scanner */}
         <div className="max-w-2xl mx-auto mb-32 relative group">
           <div className="absolute inset-0 bg-[#FF9933] opacity-5 filter blur-[50px] group-hover:opacity-10 transition-opacity"></div>
           <div className="bg-[#111111]/90 backdrop-blur-md rounded-2xl p-8 border border-[#333333] relative z-10">
             
             <div className="text-center mb-8">
               <div className="inline-flex items-center space-x-2 text-[#FF9933] font-bold tracking-widest text-xs uppercase mb-2">
                 <Radar size={16} className="animate-[spin_4s_linear_infinite]" />
                 <span>Free Public Scanner</span>
               </div>
               <h3 className="text-white text-2xl font-serif">Run Rapid Integrity Check</h3>
               <p className="text-sm text-[#8A7B66] mt-2">Test media authenticity with our community-tier analysis engine. Login required.</p>
             </div>

             {!user ? (
               <div className="bg-[#0A0A0A] border border-[#FF9933]/50 p-6 rounded-xl text-center">
                 <User className="text-[#FF9933] mx-auto mb-4" size={32} />
                 <h4 className="text-white font-bold mb-2">Login Required for Free Tier</h4>
                 <p className="text-sm text-[#8A7B66] mb-6">Create a free operator account to access 10 free algorithmic scans (5 Image, 3 URL, 2 Video) and save your history securely.</p>
                 <button onClick={() => setShowAuthModal(true)} className="bg-[#FF9933] text-black w-full py-3 rounded text-sm font-bold uppercase tracking-widest hover:bg-white transition-colors flex justify-center items-center">
                    <LogIn size={16} className="mr-2" /> Operator Login / Sign Up
                 </button>
               </div>
             ) : scansAvailable.images <= 0 && scansAvailable.links <= 0 && scansAvailable.videos <= 0 ? (
               <div className="bg-[#0A0A0A] border border-[#FF9933]/50 p-6 rounded-xl text-center">
                 <Lock className="text-[#FF9933] mx-auto mb-4" size={32} />
                 <h4 className="text-white font-bold mb-2">Free Quota Reached</h4>
                 <p className="text-sm text-[#8A7B66] mb-6">You have exhausted all your free tactical scans. Upgrade to Vajra Pro to unlock enterprise limits and advanced layers.</p>
                 <button onClick={() => navigate('/pricing')} className="bg-[#FF9933] text-black w-full py-3 rounded text-sm font-bold uppercase tracking-widest hover:bg-white transition-colors flex justify-center items-center">
                    View Enterprise Pricing <ArrowRight size={16} className="ml-2" />
                 </button>
               </div>
             ) : (
               <div className="space-y-6">
                 
                 {/* Tabs */}
                 <div className="flex rounded-lg bg-[#0A0A0A] p-1 border border-[#333333]">
                    <button onClick={() => setScanType('image')} className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest flex justify-center items-center rounded transition-colors ${scanType === 'image' ? 'bg-[#1A1A1A] text-[#FF9933]' : 'text-gray-500 hover:text-white'}`}>
                       <ImageIcon size={14} className="mr-2" /> Images ({scansAvailable.images})
                    </button>
                    <button onClick={() => setScanType('link')} className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest flex justify-center items-center rounded transition-colors ${scanType === 'link' ? 'bg-[#1A1A1A] text-[#FF9933]' : 'text-gray-500 hover:text-white'}`}>
                       <LinkIcon size={14} className="mr-2" /> Link ({scansAvailable.links})
                    </button>
                    <button onClick={() => setScanType('video')} className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest flex justify-center items-center rounded transition-colors ${scanType === 'video' ? 'bg-[#1A1A1A] text-[#FF9933]' : 'text-gray-500 hover:text-white'}`}>
                       <Film size={14} className="mr-2" /> Video ({scansAvailable.videos})
                    </button>
                 </div>

                 {/* Input Area */}
                 {scanType === 'link' ? (
                    <div className="bg-[#0A0A0A] border border-[#333333] rounded-xl p-6">
                       <label className="block text-[#8A7B66] text-xs uppercase tracking-widest font-bold mb-3">Paste Media URL</label>
                       <input 
                         type="url" 
                         value={linkInput} 
                         onChange={(e) => setLinkInput(e.target.value)} 
                         placeholder="https://example.com/media..." 
                         className="w-full bg-[#1A1A1A] border border-[#3C362A] rounded p-4 text-white focus:outline-none focus:border-[#FF9933] transition-colors"
                       />
                    </div>
                 ) : (
                    <div className="relative border-2 border-dashed border-[#333333] hover:border-[#FF9933]/50 bg-[#0A0A0A] rounded-xl p-8 transition-colors text-center cursor-pointer group/upload overflow-hidden">
                       <input type="file" onChange={handleFile} accept={scanType === 'video' ? "video/mp4,video/webm" : "image/*"} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                       
                       {preview ? (
                         <div className="flex flex-col items-center">
                            <div className="relative w-32 h-32 mb-4 rounded-lg overflow-hidden border border-[#3C362A]">
                               <img src={preview} alt="Selected" className="w-full h-full object-cover" />
                            </div>
                            <p className="text-white text-sm font-bold truncate max-w-full">{file?.name}</p>
                            <p className="text-xs text-[#8A7B66] mt-1">Click to replace</p>
                         </div>
                       ) : scanType === 'video' && file ? (
                         <div className="flex flex-col items-center">
                            <PlayCircle size={40} className="mb-4 text-[#FF9933]" />
                            <p className="text-white text-sm font-bold truncate max-w-full">{file?.name}</p>
                            <p className="text-xs text-[#8A7B66] mt-1">Click to replace</p>
                         </div>
                       ) : (
                         <div className="flex flex-col items-center text-[#8A7B66] group-hover/upload:text-white transition-colors">
                            <UploadCloud size={40} className="mb-4" />
                            <p className="font-bold mb-1">Click or Drag {scanType === 'video' ? 'Video' : 'Image'}</p>
                            <p className="text-xs uppercase tracking-widest text-[#5A5042]">{scanType === 'video' ? 'MP4, WEBM • Max 20MB' : 'JPG, PNG • Max 10MB'}</p>
                         </div>
                       )}
                    </div>
                 )}

                 {/* Execute Button */}
                 <button 
                    onClick={handleFreeScan}
                    disabled={(!file && scanType !== 'link') || (!linkInput && scanType === 'link') || analyzing || scansAvailable[scanType === 'image' ? 'images' : scanType === 'link' ? 'links' : 'videos'] <= 0}
                    className="w-full bg-[linear-gradient(135deg,#FF9933_0%,#E97400_100%)] text-black hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 transition-all font-black uppercase tracking-widest text-xs py-4 rounded flex justify-center items-center shadow-[0_0_20px_rgba(255,153,51,0.2)]"
                 >
                    {analyzing ? (
                      <> <Loader className="animate-spin mr-3" size={16} /> Orchestrating Analysis... </>
                    ) : (
                      <> <Search size={16} className="mr-3" /> Initiate {scanType} Scan ({scansAvailable[scanType === 'image' ? 'images' : scanType === 'link' ? 'links' : 'videos']} left) </>
                    )}
                 </button>

                 {/* Error */}
                 {error && (
                    <div className="bg-rose-500/10 border border-rose-500/50 p-4 rounded text-rose-500 text-xs font-bold flex items-start">
                       <AlertTriangle size={14} className="mr-2 shrink-0 mt-0.5" />
                       <p>{error}</p>
                    </div>
                 )}

                 {/* Results */}
                 {result && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#0A0A0A] border border-[#333333] rounded-xl p-6">
                       
                       <div className="flex justify-between items-center mb-6 pb-4 border-b border-[#333333]">
                         <div>
                            <div className="text-[10px] uppercase font-bold tracking-widest text-[#8A7B66] mb-1">Algorithmic Confidence</div>
                            <div className="text-2xl text-white font-black">{result.integrity_score || result.score}%</div>
                         </div>
                         <div className={`px-4 py-2 rounded font-bold text-xs uppercase tracking-widest ${result.verdict === 'AUTHENTIC' ? 'bg-[#138808]/10 text-[#138808] border border-[#138808]/50' : 'bg-rose-500/10 text-rose-500 border border-rose-500/50'}`}>
                            {result.verdict}
                         </div>
                       </div>

                       <div className="mb-4">
                          <p className="text-xs text-gray-300 leading-relaxed font-sans line-clamp-4">
                             {result.analysisResult}
                          </p>
                       </div>

                       <div className="bg-[#1A1A1A] p-4 rounded mt-6 border border-[#333333]">
                          <p className="text-[10px] text-gray-500 uppercase font-mono tracking-widest flex items-start">
                             <Info size={12} className="mr-2 mt-0.5 text-[#FF9933] shrink-0" />
                             This is a limited base-level scan. Vault sync, threat archetype intelligence, deep metadata scraping, and high-res spectral anomalies are restricted to Vajra Pro.
                          </p>
                       </div>
                    </motion.div>
                 )}
               </div>
             )}
           </div>
         </div>

         {/* Agentic Architecture Bento Box */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
            
            {/* Multi-Agent Orchestration (#12 & #4 & #5) */}
            <div className="bg-[#111111]/80 backdrop-blur-sm rounded-2xl p-8 border border-[#333333] hover:border-[#FF9933]/50 transition-all col-span-1 md:col-span-2 lg:col-span-2 group overflow-hidden relative">
               <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF9933] opacity-5 filter blur-[100px] group-hover:opacity-20 transition-opacity"></div>
               <div className="flex justify-between items-start mb-6 relative z-10">
                 <div>
                    <h3 className="text-2xl font-bold text-white font-serif mb-2">Orchestrator & Subagents</h3>
                    <p className="text-sm text-[#8A7B66] tracking-widest uppercase text-[10px] font-bold">Multi-Agent Intelligence (#12, #4, #5)</p>
                 </div>
                 <Network className="text-[#FF9933]" size={36} />
               </div>
               <p className="text-gray-400 text-sm leading-relaxed mb-6 relative z-10">
                 Vajra doesn't rely on a single generative model. A high-level <strong className="text-[#FF9933]">Orchestrator</strong> breaks deepfake analysis into parallel tasks, delegating them to specialized <strong className="text-white">Subagents</strong>: PyTorch Audio Analyzers, ELA Computer Vision nodes, and Bharatiya OSINT scrapers.
               </p>
               <div className="flex items-center space-x-4 bg-[#0A0A0A] p-4 rounded-xl border border-[#333333] overflow-hidden text-xs font-mono relative z-10">
                  <div className="text-[#FF9933] flex items-center"><Target size={14} className="mr-2"/> Orchestrator</div>
                  <ArrowRight size={14} className="text-gray-600"/>
                  <div className="bg-[#1A1A1A] px-3 py-1 rounded border border-[#138808]/30 text-[#138808]">Vision Node</div>
                  <ArrowRight size={14} className="text-gray-600"/>
                  <div className="bg-[#1A1A1A] px-3 py-1 rounded border border-[#FF9933]/30 text-[#FF9933]">Audio Node</div>
               </div>
            </div>

            {/* MCP & Grounding (#1 & #7) */}
            <div className="bg-[#111111]/80 backdrop-blur-sm rounded-2xl p-8 border border-[#333333] hover:border-[#138808]/50 transition-all group overflow-hidden relative">
               <div className="absolute bottom-0 right-0 w-32 h-32 bg-[#138808] opacity-5 filter blur-[50px] group-hover:opacity-20 transition-opacity"></div>
               <div className="flex justify-between items-start mb-6">
                 <div>
                    <h3 className="text-2xl font-bold text-white font-serif mb-2">MCP Validation</h3>
                    <p className="text-sm text-[#8A7B66] tracking-widest uppercase text-[10px] font-bold">Reality Tethering (#1, #7)</p>
                 </div>
                 <Database className="text-[#138808]" size={36} />
               </div>
               <p className="text-gray-400 text-sm leading-relaxed">
                 Using the <strong className="text-white">Model Context Protocol (MCP)</strong>, Vajra connects to sovereign APIs and OSINT databases to ground its threat reports in verified, real-world Indian open-source intelligence.
               </p>
            </div>

            {/* Agent Loop & Tool Use (#2 & #3) */}
            <div className="bg-[#111111]/80 backdrop-blur-sm rounded-2xl p-8 border border-[#333333] hover:border-[#FF9933]/50 transition-all">
               <div className="flex justify-between items-start mb-6">
                 <div>
                    <h3 className="text-2xl font-bold text-white font-serif mb-2">Agent Loop</h3>
                    <p className="text-sm text-[#8A7B66] tracking-widest uppercase text-[10px] font-bold">Perceive → Plan → Act (#2, #3)</p>
                 </div>
                 <Activity className="text-[#FF9933]" size={36} />
               </div>
               <p className="text-gray-400 text-sm leading-relaxed">
                 The agents operate in a continuous reasoning cycle. They sense the media input, form an execution plan, use specialized tools (like spectrography), and observe the output before finalizing the integrity score.
               </p>
            </div>

            {/* Sandboxing & Guardrails (#8 & #9) */}
            <div className="bg-[#111111]/80 backdrop-blur-sm rounded-2xl p-8 border border-[#333333] hover:border-white/50 transition-all">
               <div className="flex justify-between items-start mb-6">
                 <div>
                    <h3 className="text-2xl font-bold text-white font-serif mb-2">Guardrails</h3>
                    <p className="text-sm text-[#8A7B66] tracking-widest uppercase text-[10px] font-bold">Zero-Trust Sandboxing (#8, #9)</p>
                 </div>
                 <Lock className="text-white" size={36} />
               </div>
               <p className="text-gray-400 text-sm leading-relaxed">
                 All subagents run in isolated sandboxes. Embedded guardrails prevent malicious media from executing arbitrary prompt injections, ensuring the integrity of the command center's intelligence.
               </p>
            </div>

            {/* Human-in-the-loop (#10) */}
            <div className="bg-[#111111]/80 backdrop-blur-sm rounded-2xl p-8 border border-[#333333] hover:border-[#138808]/50 transition-all">
               <div className="flex justify-between items-start mb-6">
                 <div>
                    <h3 className="text-2xl font-bold text-white font-serif mb-2">HITL Analyst</h3>
                    <p className="text-sm text-[#8A7B66] tracking-widest uppercase text-[10px] font-bold">Approval Gates (#10)</p>
                 </div>
                 <Bot className="text-[#138808]" size={36} />
               </div>
               <p className="text-gray-400 text-sm leading-relaxed">
                 When the swarm flags a "Critical High-Risk" media asset, it pauses execution and forwards it to the Human-In-The-Loop (HITL) Analyst Portal for manual intervention by security analysts.
               </p>
            </div>
         </div>

         {/* Call to Action Layer */}
         <div className="text-center py-24 border-t border-[#333333]/50 relative">
           <div className="absolute left-1/2 -translate-x-1/2 top-0 w-[1px] h-12 bg-gradient-to-b from-[#333333] to-transparent"></div>
           <h2 className="text-4xl font-serif font-black text-white mb-6">Built for Cyber Security Command Centers.</h2>
           <p className="text-[#8A7B66] max-w-2xl mx-auto mb-10 text-lg">Explore the Vajra Pro dashboard to see the Agentic memory context, live India metrics, and real-time execution in action.</p>
           <button onClick={() => navigate('/pro')} className="bg-[#0A0A0A] text-[#FF9933] border-2 border-[#FF9933] px-12 py-5 rounded text-lg font-black uppercase tracking-[0.2em] hover:bg-[#FF9933] hover:text-black transition-all shadow-[0_0_40px_rgba(255,153,51,0.2)] hover:shadow-[0_0_60px_rgba(255,153,51,0.5)] flex items-center mx-auto space-x-3">
              <Radar size={24} className="animate-[spin_3s_linear_infinite]" />
              <span>Initialize Node</span>
           </button>
           <div className="mt-8 text-[10px] uppercase tracking-[0.3em] text-[#8A7B66] flex justify-center items-center">
             <div className="w-4 h-[1px] bg-[#8A7B66] mr-4"></div>
             Made in Bharat
             <div className="w-4 h-[1px] bg-[#8A7B66] ml-4"></div>
           </div>
         </div>

      </main>
      
      {showAuthModal && (
         <AuthModal onClose={() => setShowAuthModal(false)} onSuccess={() => setShowAuthModal(false)} />
      )}
    </div>
  );
}

