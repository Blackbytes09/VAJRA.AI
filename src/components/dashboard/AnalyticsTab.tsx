import React from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from "recharts";
import { Activity, ShieldAlert, Cpu } from "lucide-react";

const threatData = [
  { time: "00:00", deepfakes: 12, safe: 45, suspicious: 5 },
  { time: "04:00", deepfakes: 19, safe: 32, suspicious: 8 },
  { time: "08:00", deepfakes: 45, safe: 120, suspicious: 15 },
  { time: "12:00", deepfakes: 80, safe: 210, suspicious: 25 },
  { time: "16:00", deepfakes: 65, safe: 180, suspicious: 20 },
  { time: "20:00", deepfakes: 30, safe: 90, suspicious: 10 },
  { time: "24:00", deepfakes: 15, safe: 50, suspicious: 4 },
];

const sourceData = [
  { name: "WhatsApp", threats: 450 },
  { name: "X (Twitter)", threats: 320 },
  { name: "Telegram", threats: 280 },
  { name: "Facebook", threats: 150 },
  { name: "Unknown", threats: 90 },
];

export function AnalyticsTab() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-20 fade-in">
      <div className="flex items-center space-x-3 mb-6 border-b border-[#3C362A] pb-4">
        <Activity className="text-[#D4AF37]" size={24} />
        <h2 className="text-xl font-bold text-white uppercase tracking-widest">Global Threat Analytics</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-[#14120E] border border-[#3C362A] p-4 rounded-xl flex items-center justify-between">
            <div>
                <div className="text-[10px] text-[#8A7B66] uppercase tracking-widest font-bold">Total Scans (24H)</div>
                <div className="text-2xl font-mono text-white">24,592</div>
            </div>
            <Cpu className="text-[#D4AF37] opacity-20" size={32} />
        </div>
        <div className="bg-[#1A1814] border border-rose-500/30 p-4 rounded-xl flex items-center justify-between">
            <div>
                <div className="text-[10px] text-rose-500 uppercase tracking-widest font-bold">Deepfakes Detected</div>
                <div className="text-2xl font-mono text-rose-500">1,842</div>
            </div>
            <ShieldAlert className="text-rose-500 opacity-20" size={32} />
        </div>
        <div className="bg-[#14120E] border border-[#3C362A] p-4 rounded-xl flex items-center justify-between">
            <div>
                <div className="text-[10px] text-[#8A7B66] uppercase tracking-widest font-bold">Engine Accuracy</div>
                <div className="text-2xl font-mono text-emerald-500">99.8%</div>
            </div>
            <Activity className="text-emerald-500 opacity-20" size={32} />
        </div>
      </div>

      <div className="bg-[#1A1814] rounded-2xl border border-[#3C362A] p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37] rounded-full blur-[100px] opacity-[0.03] pointer-events-none"></div>
        <h3 className="text-sm font-bold uppercase tracking-widest text-[#8A7B66] mb-6">Threat Trajectory (24 Hours)</h3>
        
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={threatData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorDeepfake" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorSafe" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#3C362A" vertical={false} />
              <XAxis dataKey="time" stroke="#8A7B66" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#8A7B66" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#14120E', borderColor: '#3C362A', color: '#E8E1D5', fontSize: '12px' }}
                itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
              />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Area type="monotone" dataKey="deepfakes" name="Deepfakes Detected" stroke="#f43f5e" strokeWidth={2} fillOpacity={1} fill="url(#colorDeepfake)" />
              <Area type="monotone" dataKey="safe" name="Authentic Media" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorSafe)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="bg-[#1A1814] rounded-2xl border border-[#3C362A] p-6 shadow-xl text-center">
             <h3 className="text-sm font-bold uppercase tracking-widest text-[#8A7B66] mb-6 text-left">Top Threat Sources</h3>
             <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={sourceData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }} layout="vertical">
                       <CartesianGrid strokeDasharray="3 3" stroke="#3C362A" horizontal={true} vertical={false} />
                       <XAxis type="number" stroke="#8A7B66" fontSize={10} tickLine={false} axisLine={false} />
                       <YAxis dataKey="name" type="category" stroke="#8A7B66" fontSize={10} tickLine={false} axisLine={false} width={80} />
                       <Tooltip cursor={{fill: '#2A261D'}} contentStyle={{ backgroundColor: '#14120E', borderColor: '#3C362A', color: '#E8E1D5', fontSize: '12px' }} />
                       <Bar dataKey="threats" name="Threats" fill="#D4AF37" radius={[0, 4, 4, 0]} barSize={20} />
                   </BarChart>
                </ResponsiveContainer>
             </div>
         </div>
         <div className="bg-[#1A1814] rounded-2xl border border-[#3C362A] p-6 shadow-xl flex flex-col justify-center items-center relative overflow-hidden">
             <div className="absolute inset-0 z-0">
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-[#3C362A] rounded-full animate-[spin_10s_linear_infinite]"></div>
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-dashed border-[#D4AF37]/30 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
             </div>
             <div className="relative z-10 text-center">
                <ShieldAlert className="mx-auto text-[#D4AF37] mb-4" size={48} />
                <h3 className="text-white font-bold text-lg mb-2">Live Node Cluster</h3>
                <p className="text-[#8A7B66] text-xs">All intelligence nodes operational. Currently processing anomalous media streams from 3 active edge zones.</p>
                <div className="mt-6 inline-flex items-center space-x-2 bg-emerald-500/10 px-3 py-1 rounded text-emerald-500 text-xs font-bold uppercase tracking-widest border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                    <span>System Online</span>
                </div>
             </div>
         </div>
      </div>
    </div>
  );
}
