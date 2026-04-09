import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Terminal, Lock, User, AlertTriangle } from 'lucide-react';

import loginBg from '../assets/login-bg.png';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoggingIn(true);

    // Simulate system delay for "tactical feel"
    setTimeout(() => {
      const result = login(username, password);
      if (result.success) {
        navigate(result.role === 'admin' ? '/admin' : '/portal');
      } else {
        setError(result.message);
        setIsLoggingIn(false);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden font-sans">
      {/* Cinematic Full Screen Background */}
      <img 
        src={loginBg} 
        alt="Background" 
        className="full-screen-bg"
      />

      {/* Foreground Overlay for Depth */}
      <div className="absolute inset-0 bg-gradient-to-tr from-black via-black/40 to-transparent pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="w-full max-w-md z-10 p-8"
      >
        <div className="tactical-border glass-panel p-8 stealth-shadow">
          <div className="flex flex-col items-center mb-10">
            <motion.div 
              animate={{ rotate: [0, 90, 180, 270, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="bg-accent-red/10 p-4 rounded-full border border-accent-red/30 mb-4 pulse-red"
            >
              <Shield className="w-12 h-12 text-accent-red" />
            </motion.div>
            <h1 className="text-3xl font-bold tracking-widest uppercase text-white font-sans glow-text-red">
              SATCORP <span className="text-accent-red">COVERT</span>
            </h1>
            <p className="text-[10px] font-mono text-cyan-500 mt-2 tracking-[0.4em] uppercase opacity-80 glow-text-cyan">
              Sector Zero Access Point
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-1">
              <label className="text-[9px] font-mono text-accent-red uppercase tracking-[0.3em] pl-1">
                Operative ID
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-black/40 border border-border-dim p-4 pl-10 text-white font-mono text-sm focus:border-accent-cyan outline-none transition-all placeholder:text-text-dim/50"
                  placeholder="ID_IDENTIFIER"
                  required
                  disabled={isLoggingIn}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-mono text-accent-red uppercase tracking-[0.3em] pl-1">
                Neural Key
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/40 border border-border-dim p-4 pl-10 text-white font-mono text-sm focus:border-accent-cyan outline-none transition-all placeholder:text-text-dim/50"
                  placeholder="••••••••••••"
                  required
                  disabled={isLoggingIn}
                />
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3 bg-red-900/20 border border-red-500/30 text-accent-red text-[10px] font-mono uppercase tracking-wider"
              >
                <AlertTriangle className="w-4 h-4" />
                System Alert: {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full bg-accent-red text-white font-bold py-4 uppercase tracking-[0.3em] text-[11px] hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed group transition-all relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              {isLoggingIn ? (
                <span className="flex items-center justify-center gap-3">
                  <Terminal className="w-4 h-4 animate-spin text-cyan-400" />
                  Decrypting...
                </span>
              ) : (
                "Establish Link"
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-border-dim/50 flex justify-between items-center text-[8px] font-mono text-text-dim uppercase tracking-[0.2em]">
            <span className="text-accent-red">SECURE NODE 7.4.2</span>
            <span className="text-accent-blue">AUTHORIZED ONLY</span>
          </div>
        </div>
      </motion.div>
      
      {/* Decorative scanline pattern overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)]"></div>
    </div>
  );
};

export default LoginPage;
