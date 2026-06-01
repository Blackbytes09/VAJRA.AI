import React, { useState } from "react";
import { Check, ArrowRight, ShieldCheck, Zap, Loader, QrCode, CreditCard, Building, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Pricing() {
  const navigate = useNavigate();
  const [loadingTier, setLoadingTier] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState<string | null>(null);

  const handleSubscribe = (tierId: string) => {
    setShowPaymentModal(tierId);
  };

  const processMockPayment = () => {
    setLoadingTier(showPaymentModal);
    setTimeout(() => {
      setLoadingTier(null);
      setShowPaymentModal(null);
      navigate('/pro?session_id=mock_india_txn_9999');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#14120E] text-[#E8E1D5] font-sans selection:bg-[#D4AF37] selection:text-black">
      {/* Mock India Payment Gateway Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-[#1A1814] border border-[#3C362A] rounded-2xl w-full max-w-md overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]">
            <div className="bg-[#14120E] p-4 border-b border-[#3C362A] flex justify-between items-center">
              <h3 className="text-white font-bold tracking-widest uppercase text-sm">Vajra Secure Checkout (India)</h3>
              <button onClick={() => setShowPaymentModal(null)} className="text-[#8A7B66] hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="text-[#8A7B66] text-xs uppercase tracking-widest font-bold mb-1">Total Amount</div>
                <div className="text-3xl text-white font-black">
                  {showPaymentModal === 'enterprise' ? '₹1,99,999' : '₹3,999'}
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <button onClick={processMockPayment} className="w-full bg-[#14120E] border border-[#3C362A] hover:border-[#D4AF37] p-4 rounded-xl flex items-center justify-between transition-colors group">
                  <div className="flex items-center">
                    <QrCode className="text-[#8A7B66] group-hover:text-[#D4AF37] mr-3" size={24} />
                    <span className="text-white font-bold">UPI (GPay, PhonePe, Paytm)</span>
                  </div>
                  <ArrowRight size={16} className="text-[#8A7B66] group-hover:text-[#D4AF37]" />
                </button>
                <button onClick={processMockPayment} className="w-full bg-[#14120E] border border-[#3C362A] hover:border-[#D4AF37] p-4 rounded-xl flex items-center justify-between transition-colors group">
                  <div className="flex items-center">
                    <CreditCard className="text-[#8A7B66] group-hover:text-[#D4AF37] mr-3" size={24} />
                    <span className="text-white font-bold">Cards (RuPay, Visa, Mastercard)</span>
                  </div>
                  <ArrowRight size={16} className="text-[#8A7B66] group-hover:text-[#D4AF37]" />
                </button>
                <button onClick={processMockPayment} className="w-full bg-[#14120E] border border-[#3C362A] hover:border-[#D4AF37] p-4 rounded-xl flex items-center justify-between transition-colors group">
                  <div className="flex items-center">
                    <Building className="text-[#8A7B66] group-hover:text-[#D4AF37] mr-3" size={24} />
                    <span className="text-white font-bold">NetBanking / NEFT / RTGS</span>
                  </div>
                  <ArrowRight size={16} className="text-[#8A7B66] group-hover:text-[#D4AF37]" />
                </button>
              </div>

              {loadingTier ? (
                <div className="text-center text-[#D4AF37] text-sm font-bold flex items-center justify-center py-2">
                  <Loader className="animate-spin mr-2" size={16} /> Processing Secure Payment...
                </div>
              ) : (
                <div className="text-center text-[#8A7B66] text-[10px] uppercase font-bold tracking-widest flex items-center justify-center">
                  <ShieldCheck size={12} className="mr-1" /> 256-bit Encrypted Transaction
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-20">
        
        <header className="text-center mb-20">
          <h1 className="text-4xl md:text-6xl font-black font-serif text-white tracking-tight mb-4">Enterprise Grade Security</h1>
          <p className="text-[#8A7B66] text-lg max-w-2xl mx-auto">Scale your threat intelligence with dedicated compute clusters and real-time API integrations.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          
          {/* Pro Tier */}
          <div className="bg-[#1A1814] border border-[#3C362A] rounded-2xl p-8 hover:border-[#D4AF37]/50 transition-colors flex flex-col">
            <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-widest text-[#D4AF37]">Pro Node</h3>
            <div className="flex items-baseline mb-6 border-b border-[#3C362A] pb-6">
              <span className="text-4xl font-black text-white">₹3,999</span>
              <span className="text-[#8A7B66] ml-2 text-sm">/ month</span>
            </div>
            
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-start"><Check className="text-[#D4AF37] mr-3 mt-1 flex-shrink-0" size={16}/> 10,000 Media Checks/mo</li>
              <li className="flex items-start"><Check className="text-[#D4AF37] mr-3 mt-1 flex-shrink-0" size={16}/> Real-time Grounding (VirusTotal OSINT)</li>
              <li className="flex items-start"><Check className="text-[#D4AF37] mr-3 mt-1 flex-shrink-0" size={16}/> Full CSV/PDF Export Reports</li>
              <li className="flex items-start"><Check className="text-[#D4AF37] mr-3 mt-1 flex-shrink-0" size={16}/> 99.9% Compute Uptime SLA</li>
            </ul>

            <button 
               onClick={() => handleSubscribe('pro')} 
               disabled={loadingTier === 'pro'}
               className="w-full flex justify-center items-center bg-[#2A261D] hover:bg-[#D4AF37] text-white hover:text-black font-bold uppercase tracking-widest py-4 rounded-xl transition-colors disabled:opacity-50"
            >
              {loadingTier === 'pro' ? <Loader className="animate-spin" /> : "Deploy Node"}
            </button>
            <div className="text-[10px] text-center text-[#8A7B66] tracking-widest mt-3 uppercase font-bold">
               UPI • RuPay • NetBanking
            </div>
          </div>

          {/* Enterprise Tier */}
          <div className="bg-[#14120E] border-2 border-[#D4AF37] rounded-2xl p-8 transform md:-translate-y-4 shadow-[0_0_50px_rgba(212,175,55,0.1)] relative flex flex-col">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#D4AF37] text-black text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-full">Recommended</div>
            
            <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-widest text-[#D4AF37] flex items-center"><Zap size={18} className="mr-2"/> Enterprise Cluster</h3>
            <div className="flex items-baseline mb-6 border-b border-[#3C362A] pb-6">
              <span className="text-4xl font-black text-white">₹1,99,999</span>
              <span className="text-[#8A7B66] ml-2 text-sm">/ month</span>
            </div>
            
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-start text-white"><Check className="text-[#D4AF37] mr-3 mt-1 flex-shrink-0" size={16}/> Unlimited Media Checks</li>
              <li className="flex items-start text-white"><Check className="text-[#D4AF37] mr-3 mt-1 flex-shrink-0" size={16}/> Dedicated Analyst Portal (HITL)</li>
              <li className="flex items-start text-white"><Check className="text-[#D4AF37] mr-3 mt-1 flex-shrink-0" size={16}/> Custom PyTorch Backend Integration</li>
              <li className="flex items-start text-white"><Check className="text-[#D4AF37] mr-3 mt-1 flex-shrink-0" size={16}/> PostgreSQL Dedicated Database (Zero-Trust)</li>
              <li className="flex items-start text-white"><Check className="text-[#D4AF37] mr-3 mt-1 flex-shrink-0" size={16}/> Custom Kubernetes / AWS VPC Setup</li>
            </ul>

            <button 
               onClick={() => handleSubscribe('enterprise')} 
               disabled={loadingTier === 'enterprise'}
               className="w-full flex justify-center items-center bg-[#D4AF37] hover:bg-white text-black font-bold uppercase tracking-widest py-4 rounded-xl transition-colors shadow-[0_0_20px_rgba(212,175,55,0.4)] disabled:opacity-50"
            >
              {loadingTier === 'enterprise' ? <Loader className="animate-spin" /> : "Deploy Enterprise"}
            </button>
            <div className="text-[10px] text-center text-[#8A7B66] tracking-widest mt-3 uppercase font-bold">
               RTGS • NEFT • Corporate Cards
            </div>
          </div>

          {/* Government Tier */}
          <div className="bg-[#1A1814] border border-[#3C362A] rounded-2xl p-8 hover:border-gray-500 transition-colors flex flex-col">
            <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-widest text-gray-400 flex items-center"><ShieldCheck size={18} className="mr-2"/> Federal / B2G</h3>
            <div className="flex items-baseline mb-6 border-b border-[#3C362A] pb-6">
              <span className="text-4xl font-black text-white">Custom</span>
            </div>
            
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-start"><Check className="text-gray-500 mr-3 mt-1 flex-shrink-0" size={16}/> Air-gapped On-Premises Deployment</li>
              <li className="flex items-start"><Check className="text-gray-500 mr-3 mt-1 flex-shrink-0" size={16}/> Multi-Agent Splintering (Classified)</li>
              <li className="flex items-start"><Check className="text-gray-500 mr-3 mt-1 flex-shrink-0" size={16}/> Secret-Level SSO Auth Integration</li>
            </ul>

            <button onClick={() => navigate('/')} className="w-full bg-[#2A261D] hover:bg-gray-300 text-white hover:text-black font-bold uppercase tracking-widest py-4 rounded-xl transition-colors mt-auto">
              Schedule Clearance
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
