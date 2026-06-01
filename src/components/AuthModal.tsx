import React, { useState } from 'react';
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { X, Mail, Lock, ShieldCheck, User } from 'lucide-react';

interface AuthModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function AuthModal({ onClose, onSuccess }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        // Create initial user document
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          name: name || 'Operator',
          email: user.email,
          createdAt: new Date().toISOString(),
          role: 'free_user',
          scansAvailable: {
            images: 5,
            links: 3,
            videos: 2
          }
        });
      }
      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-[#1A1814] border border-[#3C362A] rounded-2xl w-full max-w-md overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-[#8A7B66] hover:text-[#FF9933] transition-colors">
          <X size={20} />
        </button>
        <div className="bg-[#14120E] p-8 border-b border-[#3C362A] text-center">
          <div className="bg-[#1C2026] text-[#FF9933] p-3 rounded-full shadow-[0_0_15px_rgba(255,153,51,0.2)] border border-[#FF9933]/50 inline-block mb-4">
            <ShieldCheck size={32} />
          </div>
          <h2 className="text-2xl font-black text-white font-serif">{isLogin ? 'Operator Login' : 'Secure Registration'}</h2>
          <p className="text-[#8A7B66] text-sm mt-2">{isLogin ? 'Authenticate to access Vajra Tactical Core.' : 'Enlist as a new operator to access the Free Tier.'}</p>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-[#8A7B66] text-xs uppercase tracking-widest font-bold mb-2">Operator Name</label>
                <div className="relative">
                   <User className="absolute left-3 top-3.5 text-[#8A7B66]" size={16} />
                   <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-[#111111] border border-[#333333] focus:border-[#FF9933] text-white rounded p-3 pl-10 focus:outline-none transition-colors" placeholder="e.g. John Doe" required={!isLogin} />
                </div>
              </div>
            )}
            <div>
              <label className="block text-[#8A7B66] text-xs uppercase tracking-widest font-bold mb-2">Encrypted Email</label>
              <div className="relative">
                 <Mail className="absolute left-3 top-3.5 text-[#8A7B66]" size={16} />
                 <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-[#111111] border border-[#333333] focus:border-[#FF9933] text-white rounded p-3 pl-10 focus:outline-none transition-colors" placeholder="operator@cyber.in" required />
              </div>
            </div>
            <div>
              <label className="block text-[#8A7B66] text-xs uppercase tracking-widest font-bold mb-2">Passkey</label>
              <div className="relative">
                 <Lock className="absolute left-3 top-3.5 text-[#8A7B66]" size={16} />
                 <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-[#111111] border border-[#333333] focus:border-[#FF9933] text-white rounded p-3 pl-10 focus:outline-none transition-colors" placeholder="••••••••" required />
              </div>
            </div>

            {error && <div className="text-rose-500 text-xs font-bold bg-rose-500/10 p-3 rounded">{error}</div>}

            <button type="submit" disabled={loading} className="w-full bg-[linear-gradient(135deg,#FF9933_0%,#E97400_100%)] text-black py-4 rounded font-black uppercase tracking-widest hover:scale-[1.02] transition-all shadow-[0_0_20px_rgba(255,153,51,0.4)] disabled:opacity-70 disabled:hover:scale-100 flex justify-center items-center">
              {loading ? 'Authenticating...' : isLogin ? 'Initialize Session' : 'Create Access Token'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-[#FF9933] text-xs font-bold uppercase tracking-widest hover:underline">
              {isLogin ? "Need access? Request new token." : "Already have a token? Sign in."}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
