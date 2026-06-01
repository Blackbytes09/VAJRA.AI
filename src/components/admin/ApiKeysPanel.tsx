import React, { useState, useEffect } from 'react';
import { Key, Plus, Trash2, Copy, CheckCircle, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function ApiKeysPanel() {
  const [keys, setKeys] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyName, setKeyName] = useState('');
  const [newKey, setNewKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const fetchKeys = async () => {
    try {
      const res = await fetch('/api/admin/keys');
      if (res.ok) {
        const data = await res.json();
        setKeys(data);
      }
    } catch (err) {
      console.error("Failed to fetch API keys", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKeys();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyName.trim()) return;
    
    try {
      const res = await fetch('/api/admin/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: keyName })
      });
      if (res.ok) {
        const data = await res.json();
        setNewKey(data.plaintext);
        setKeyName('');
        fetchKeys();
      }
    } catch (err) {
      console.error("Failed to create key", err);
    }
  };

  const handleRevoke = async (id: string) => {
    if (!confirm("Are you sure you want to revoke this Vault Key? Nodes using it will immediately lose access.")) return;
    
    try {
      const res = await fetch(`/api/admin/keys/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchKeys();
      }
    } catch (err) {
      console.error("Failed to revoke key", err);
    }
  };

  const handleCopy = () => {
    if (newKey) {
      navigator.clipboard.writeText(newKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      <div className="bg-[#1A1814] border border-[#3C362A] rounded-xl overflow-hidden shadow-2xl relative">
        <div className="p-6 border-b border-[#3C362A] bg-[#1F1C17] flex justify-between items-center">
          <div>
            <h2 className="font-serif text-lg font-bold text-white flex items-center">
              <Key size={18} className="mr-2 text-[#D4AF37]" /> Agency Vault Keys
            </h2>
            <p className="text-xs text-[#8A7B66] mt-1">Generate identity tokens for autonomous API nodes or remote agents.</p>
          </div>
        </div>
        
        <div className="p-6">
          <form onSubmit={handleCreate} className="flex gap-3 mb-8">
            <input 
              type="text" 
              value={keyName}
              onChange={(e) => setKeyName(e.target.value)}
              placeholder="Enter Node Designation (e.g. 'Delhi Intelligence Node Alpha')" 
              className="flex-1 bg-[#14120E] border border-[#3C362A] text-white px-4 py-3 rounded-lg text-sm focus:outline-none focus:border-[#D4AF37]/50"
            />
            <button 
              type="submit"
              disabled={!keyName.trim()}
              className="bg-[#D4AF37] hover:bg-[#C19B2E] text-black font-bold uppercase tracking-widest px-6 py-3 rounded-lg text-xs transition-colors shadow-[0_0_15px_rgba(212,175,55,0.3)] disabled:opacity-50 flex items-center"
            >
              <Plus size={16} className="mr-2"/> Issue Token
            </button>
          </form>

          <AnimatePresence>
            {newKey && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, height: 0 }}
                className="mb-8 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg"
              >
                <div className="flex items-center text-emerald-500 text-[10px] font-bold uppercase tracking-widest mb-2">
                  <ShieldAlert size={14} className="mr-2" />
                  Store this token securely. It will not be shown again.
                </div>
                <div className="flex items-center justify-between bg-[#0A0907] p-3 rounded border border-emerald-500/20">
                  <code className="text-white font-mono text-sm">{newKey}</code>
                  <button onClick={handleCopy} className="text-emerald-500 hover:text-emerald-400 p-1 bg-emerald-500/10 rounded transition-colors ml-4 flex flex-shrink-0">
                    {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {loading ? (
            <div className="text-[#8A7B66] text-xs uppercase tracking-widest py-8 text-center animate-pulse">Decrypting Vault Records...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="text-[#8A7B66] border-b border-[#3C362A]">
                  <tr>
                    <th className="px-4 py-3 font-bold uppercase tracking-widest text-[10px]">Node Identity</th>
                    <th className="px-4 py-3 font-bold uppercase tracking-widest text-[10px]">Token Prefix</th>
                    <th className="px-4 py-3 font-bold uppercase tracking-widest text-[10px]">Issued Date</th>
                    <th className="px-4 py-3 font-bold uppercase tracking-widest text-[10px]">Status</th>
                    <th className="px-4 py-3 font-bold uppercase tracking-widest text-[10px] text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#3C362A]">
                  {keys.map((k) => (
                    <tr key={k.id} className={k.status === 'revoked' ? 'opacity-50' : ''}>
                      <td className="px-4 py-4 font-bold text-[#E8E1D5]">{k.name}</td>
                      <td className="px-4 py-4 font-mono text-xs text-[#A39783]">{k.keyPrefix}</td>
                      <td className="px-4 py-4 font-mono text-[10px] text-[#A39783]">{new Date(k.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-4">
                        {k.status === 'active' ? (
                          <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest bg-emerald-500/10 text-emerald-500 border border-emerald-500/30">Active</span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest bg-rose-500/10 text-rose-500 border border-rose-500/30">Revoked</span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-right">
                        {k.status === 'active' && (
                          <button 
                            onClick={() => handleRevoke(k.id)}
                            className="text-rose-500 hover:text-white hover:bg-rose-500 text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 rounded transition-colors"
                          >
                            Revoke
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {keys.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-[#8A7B66] text-xs">No active tokens found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
