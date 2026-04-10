import React from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Activity, FileText, Cpu, ArrowRight, ShieldCheck, Download, Layers, Zap } from 'lucide-react';

import telemetryBg from '../assets/telemetry-bg.png';
import syncBg from '../assets/sync-bg.png';
import intelligenceBg from '../assets/intelligence-bg.png';
import xoiBg from '../assets/xoi-intel-bg.png';
import dualcoreBg from '../assets/dualcore-bg.png';

const ClientPortal = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const allProjects = {
    gendashv2: {
      title: '450kW Diesel System Dashboard',
      subtitle: 'SYSTEM TELEMETRY',
      description: 'Cummins QSX15-G9 Technical Data Sheet & Real-time Telemetry v2',
      route: '/gendashv2',
      icon: Activity,
      color: 'text-accent-red',
      bg: telemetryBg,
      vector: 'VEC-A1-GEN'
    },
    '450kpar': {
      title: 'Dual-Generator Parallel Hub',
      subtitle: 'SYNCHRO-LINK COMMAND',
      description: '450kW Synchronization & Load-Sharing Engineering Control',
      route: '/450kpar',
      icon: Cpu,
      color: 'text-accent-blue',
      bg: syncBg,
      vector: 'VEC-B4-SYNC'
    },
    'xoi-client': {
      title: 'XOi Client Discovery Matrix',
      subtitle: 'INTELLIGENCE GATHERING',
      description: 'Field Service intelligence and stakeholder discovery questionnaire.',
      route: '/xoi-client',
      icon: FileText,
      color: 'text-accent-green',
      bg: xoiBg,
      vector: 'VEC-C9-INTEL'
    },
    'xoi-audit': {
      title: 'XOi Feature Audit Board',
      subtitle: 'STRATEGIC APPRAISAL',
      description: 'Internal assessment and viability audit for XOi platform features.',
      route: '/xoi-audit',
      icon: Layers,
      color: 'text-accent-cyan',
      bg: intelligenceBg,
      vector: 'VEC-D2-AUDIT'
    },
    'dualcore-900': {
      title: 'DualCore 900 Integrated System',
      subtitle: 'DUAL-ENGINE POWER CELL',
      description: 'Dual Cummins QSX15-G9 factory-integrated enclosure. 900kW Standby / 820kW Prime.',
      route: '/dualcore-900',
      icon: Zap,
      color: 'text-accent-cyan',
      bg: dualcoreBg,
      vector: 'VEC-E5-DUAL'
    }
  };

  const myProjects = user?.projects?.map(id => ({ id, ...allProjects[id] })) || [];

  return (
    <Layout title="Operative Internal Terminal">
      <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 md:space-y-12">
        {/* WELCOME SECTION */}
        <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 pb-10 border-b border-border-dim relative overflow-hidden">
          <div className="z-10">
            <div className="flex items-center gap-3 text-accent-cyan font-mono text-[10px] uppercase tracking-[0.4em] mb-4 glow-text-cyan">
              <ShieldCheck className="w-4 h-4" />
              Authenticated Session Active // Layer 4 Encryption
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-white uppercase italic">
              Welcome, <span className="text-accent-red glow-text-red">Operative {user?.username?.split('@')[0]}</span>
            </h1>
            <p className="text-text-secondary font-mono text-[10px] mt-4 uppercase tracking-[0.3em] max-w-2xl leading-relaxed">
              Tactical authorization established. Deploying <span className="text-white">{myProjects.length} strategic assets</span> to your terminal. Verify metadata before initialization.
            </p>
          </div>
        </section>

        {/* ASSIGNED PROJECTS */}
        <section>
          <div className="flex items-center gap-6 mb-16 relative z-20">
            <div className="text-[11px] font-mono uppercase tracking-[0.5em] text-accent-cyan flex items-center gap-3">
              <div className="w-3 h-[1px] bg-accent-cyan"></div>
              Authorized Deployment Files
            </div>
            <div className="flex-1 h-[1px] bg-gradient-to-r from-border-dim to-transparent opacity-40"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
            {myProjects.length > 0 ? (
              myProjects.map((project, i) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.2 }}
                  onClick={() => navigate(project.route)}
                  className="folder-card group"
                >
                  <div className="folder-tab"></div>
                  <div className="folder-texture"></div>

                  {/* Cinematic Card Header */}
                  <div className="h-48 relative overflow-hidden border-b border-border-dim/50">
                    <img 
                      src={project.bg} 
                      alt={project.title} 
                      className="w-full h-full object-cover grayscale brightness-25 group-hover:grayscale-0 group-hover:brightness-50 group-hover:scale-110 transition-all duration-1000" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-[#1a1a1a]/40 to-transparent"></div>
                    <div className="absolute top-4 right-4">
                      <span className="stamped-label">{project.vector}</span>
                    </div>
                    <div className="absolute bottom-6 left-8">
                      <span className="text-[10px] font-mono text-accent-cyan tracking-[0.4em] uppercase font-bold">
                        {project.subtitle}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 md:p-10 flex flex-col h-full relative z-10">
                    <div className="flex justify-between items-start mb-8">
                      <div className="p-4 bg-black/60 border border-white/10 group-hover:border-accent-red transition-all stealth-shadow">
                        <project.icon className={`w-10 h-10 ${project.color} group-hover:text-accent-red glow-text-red`} />
                      </div>
                      <div className="flex gap-1.5 mt-2">
                        <div className="w-1.5 h-1.5 bg-accent-red pulse-red"></div>
                        <div className="w-1.5 h-1.5 bg-white/10"></div>
                        <div className="w-1.5 h-1.5 bg-white/10"></div>
                      </div>
                    </div>

                    <h3 className="text-2xl md:text-4xl font-black text-white group-hover:text-accent-red transition-colors mb-4 tracking-tighter uppercase italic">
                      {project.title}
                    </h3>
                    <p className="text-[11px] text-text-secondary mb-12 leading-relaxed font-mono uppercase tracking-wide opacity-80">
                      {project.description}
                    </p>

                    <div className="mt-auto pt-8 border-t border-white/5 flex justify-between items-center text-white">
                      <button 
                        className="bg-accent-red text-white px-6 md:px-10 py-3 text-[11px] font-bold uppercase tracking-[0.4em] flex items-center gap-3 hover:bg-red-800 transition-all relative overflow-hidden group/btn"
                      >
                        <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
                        Establish Link <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                      
                      <button className="p-3 border border-border-dim hover:border-accent-cyan hover:text-accent-cyan transition-all group/dl bg-white/5">
                        <Download className="w-5 h-5 group-hover/dl:scale-110 transition-transform" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center border-2 border-dashed border-border-dim/30 bg-white/5">
                <div className="flex flex-col items-center gap-4">
                  <ShieldCheck className="w-12 h-12 text-text-dim opacity-20" />
                  <p className="text-[10px] font-mono text-text-dim uppercase tracking-[0.6em]">
                    No Strategic Assets Assigned to this Terminal
                  </p>
                  <p className="text-[8px] font-mono text-accent-red uppercase tracking-[0.2em] opacity-60">
                    Awaiting authorization from Central Command
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* SUPPORT / PROTOCOLS SECTION */}
        <section className="bg-white/5 tactical-border p-8 flex flex-col md:flex-row items-center justify-between gap-10 stealth-shadow border-l-4 border-l-accent-cyan">
          <div className="flex items-center gap-6">
            <div className="p-4 bg-black/60 border border-border-dim">
              <FileText className="w-8 h-8 text-accent-cyan" />
            </div>
            <div>
              <h4 className="font-bold text-[11px] uppercase tracking-[0.4em] text-white glow-text-cyan">Tactical Transmission Protocols</h4>
              <p className="text-[9px] text-text-dim font-mono mt-2 uppercase tracking-widest max-w-xl">
                Encrypted terminal errors or authorization conflicts should be reported via the covert uplink. Direct signal to ANU Command.
              </p>
            </div>
          </div>
          <a 
            href="https://discord.gg/KqphHMq6vS" 
            target="_blank" 
            rel="noreferrer"
            className="text-[10px] font-bold font-mono text-accent-red uppercase tracking-[0.4em] border border-accent-red/40 px-10 py-3 hover:bg-accent-red/10 transition-all stealth-shadow bg-black/40 text-center"
          >
            SIGNAL: ANU@satcorp.io
          </a>
        </section>
      </div>
    </Layout>
  );
};

export default ClientPortal;
