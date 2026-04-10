import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogOut, Home, Shield, User, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import SessionTimer from './SessionTimer';

const Layout = ({ children, title = 'OPERATION CENTER' }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  const handleReturnToPortal = () => {
    if (user?.role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/portal');
    }
  };

  const isPortal = location.pathname === '/admin' || location.pathname === '/portal';

  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col relative overflow-hidden">
      {/* HUD HEADER */}
      <header className="h-16 md:h-20 border-b border-border-dim bg-black/80 flex items-center justify-between px-4 md:px-8 sticky top-0 z-50 glass-panel">
        <div className="flex items-center gap-6">
          {!isPortal && (
            <button 
              onClick={handleReturnToPortal}
              className="flex items-center gap-2 text-text-dim hover:text-accent-red transition-all group"
            >
              <div className="p-2 border border-border-dim group-hover:border-accent-red/50 bg-white/5">
                <Home className="w-4 h-4" />
              </div>
            </button>
          )}
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <Shield className="w-8 h-8 text-accent-red pulse-red" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-accent-cyan rounded-full animate-ping"></div>
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg md:text-xl font-bold tracking-[0.2em] md:tracking-[0.3em] uppercase glow-text-red">
                {title}
              </h1>
              <div className="flex items-center gap-2 text-[8px] font-mono text-cyan-500 uppercase tracking-widest">
                <span className="w-1 h-1 bg-cyan-500 rounded-full animate-pulse"></span>
                Secure Uplink Terminal v7.4.2
              </div>
            </div>
          </div>
        </div>


        <div className="flex items-center gap-4 md:gap-8">
          <div className="hidden lg:block">
            <SessionTimer variant="compact" />
          </div>

          <div className="hidden md:flex flex-col items-end">
            <div className="flex items-center gap-2 text-[10px] font-mono text-accent-blue uppercase tracking-[0.2em] glow-text-cyan">
              <User className="w-3 h-3" />
              {user?.username}
            </div>
            <div className="text-[8px] font-mono text-text-dim uppercase tracking-widest mt-1">
              Auth: {user?.role === 'admin' ? 'Strategic Command' : 'Field Operative'}
            </div>
          </div>

          <button 
            onClick={handleSignOut}
            className="flex items-center gap-3 px-4 py-2 border border-accent-red/40 bg-accent-red/5 hover:bg-accent-red/20 transition-all group relative overflow-hidden"
          >
            <span className="text-[9px] font-mono tracking-[0.2em] uppercase text-accent-red font-bold hidden xs:inline">Terminate</span>
            <LogOut className="w-3 h-3 text-accent-red group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="relative h-full"
        >
          {children}
        </motion.div>
      </main>

      {/* TACTICAL FOOTER */}
      <footer className="h-10 border-t border-border-dim bg-black/90 flex items-center justify-between px-4 md:px-8 text-[8px] font-mono text-text-dim uppercase tracking-[0.3em] glass-panel">
        <div className="flex items-center gap-8">
        </div>
        <div className="text-accent-red font-bold">
          SATCORP COMMAND
        </div>
      </footer>
    </div>
  );
};

export default Layout;
