import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, Eye, EyeOff, Loader2, ShieldCheck } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import api from '../../lib/api';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // 🔥 ANTI-SEO: Prevent this page from ever being indexed by search engines
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.getElementsByTagName('head')[0].appendChild(meta);

    return () => {
      document.getElementsByTagName('head')[0].removeChild(meta);
    };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/admin/login', { email, password });

      if (response.status === 200) {
        localStorage.setItem('adminUser', JSON.stringify(response.data));
        toast.success(`Welcome back, ${response.data.name}`);
        navigate('/admin/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Access Denied: Invalid Credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] px-6 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#D4AF37]/10 blur-[120px] rounded-full animate-pulse"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-[#141414] border border-white/10 p-10 rounded-[2.5rem] shadow-2xl">
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-[#1A1A1A] border border-[#D4AF37]/20 rounded-3xl flex items-center justify-center mx-auto mb-6 relative">
              <ShieldCheck className="h-10 w-10 text-[#D4AF37]" />
              <div className="absolute inset-0 bg-[#D4AF37]/10 blur-xl rounded-full animate-pulse"></div>
            </div>
            <h2 className="text-3xl font-bold text-white tracking-tight">Admin Portal</h2>
            <p className="text-gray-400 mt-2 text-sm">Naazie's Eats & Treats</p>
          </div>

          {error && <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-xl text-center">{error}</div>}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-[#D4AF37] font-bold">Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <Input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-12 bg-black/50 border-white/5 text-white h-14 rounded-2xl focus:ring-1 focus:ring-[#D4AF37]" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-[#D4AF37] font-bold">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <Input required type={showPass ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="pl-12 bg-black/50 border-white/5 text-white h-14 rounded-2xl focus:ring-1 focus:ring-[#D4AF37]" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors">{showPass ? <EyeOff size={20} /> : <Eye size={20} />}</button>
              </div>
            </div>

            <Button disabled={loading} type="submit" className="w-full h-14 bg-[#D4AF37] hover:bg-[#B8860B] text-black font-black text-lg rounded-2xl transition-all active:scale-95">
              {loading ? <Loader2 className="animate-spin" /> : "Enter Dashboard"}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}