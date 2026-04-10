import React from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ShieldAlert, RefreshCw } from 'lucide-react';

const SessionTimer = ({ variant = 'default', className = '' }) => {
  const { timeLeft, extendSession } = useAuth();

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isWarning = timeLeft < 60;

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-3 px-4 py-2 glass-panel tactical-border ${className}`}>
        <div className="relative">
          <Clock className={`w-4 h-4 ${isWarning ? 'text-accent-red animate-pulse' : 'text-accent-red'}`} />
          {isWarning && <div className="absolute -top-1 -right-1 w-2 h-2 bg-accent-red rounded-full animate-ping" />}
        </div>
        <div className="flex flex-col">
          <span className="text-[8px] text-text-dim uppercase tracking-tighter">Auth Expiry</span>
          <span className={`font-mono text-sm font-bold ${isWarning ? 'text-accent-red glow-text-red' : 'text-white'}`}>
            {formatTime(timeLeft)}
          </span>
        </div>
        <button 
          onClick={extendSession}
          className="ml-2 p-1.5 hover:bg-white/10 rounded transition-colors group"
          title="Extend Authorization"
        >
          <RefreshCw className="w-3.5 h-3.5 text-text-dim group-hover:text-accent-cyan transition-transform duration-500 group-active:rotate-180" />
        </button>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-6 ${isWarning ? 'bg-accent-red/10 border-accent-red/50' : 'bg-white/5 border-white/5'} tactical-border p-6 stealth-shadow w-full transition-colors duration-500 ${className}`}>
       <div className="relative">
          <Clock className={`w-6 h-6 ${isWarning ? 'text-accent-red animate-pulse' : 'text-accent-red'}`} />
          {isWarning && (
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-2 -right-2"
            >
              <ShieldAlert className="w-4 h-4 text-accent-red" />
            </motion.div>
          )}
       </div>
       <div className="font-mono flex-1">
          <p className="text-[9px] text-text-dim uppercase tracking-[0.3em] mb-1">Authorization Expiry</p>
          <div className="flex items-center justify-between gap-4">
             <p className={`text-xl font-bold tracking-widest ${isWarning ? 'text-accent-red glow-text-red' : 'text-white'}`}>
                {formatTime(timeLeft)}
             </p>
             <button 
                onClick={extendSession}
                className="p-2 border border-border-dim hover:border-accent-cyan hover:text-accent-cyan transition-all group/extend bg-white/5"
                title="Extend Authorization"
             >
                <div className="flex items-center gap-2">
                   <RefreshCw className="w-3 h-3 group-hover/extend:rotate-180 transition-transform duration-500" />
                   <span className="text-[10px] hidden sm:inline">EXTEND AUTHORIZATION</span>
                </div>
             </button>
          </div>
       </div>
    </div>
  );
};

export default SessionTimer;
