import React, { useState } from 'react';
import Layout from '../components/Layout';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Activity, 
  Database, 
  FileText, 
  Layout as LayoutIcon, 
  Users, 
  Cpu, 
  ArrowRight, 
  Cog, 
  Terminal, 
  Map as MapIcon, 
  ShieldAlert,
  Globe,
  Radio,
  Layers,
  Zap
} from 'lucide-react';

import telemetryBg from '../assets/telemetry-bg.png';
import syncBg from '../assets/sync-bg.png';
import intelligenceBg from '../assets/intelligence-bg.png';
import xoiBg from '../assets/xoi-intel-bg.png';

const AdminPortal = () => {
  const navigate = useNavigate();
  const [activeNode, setActiveNode] = useState(null);

  const projectCards = [
    {
      id: 'gendashv2',
      title: '450kW Diesel System Dashboard',
      subtitle: 'SYSTEM TELEMETRY v2.1',
      description: 'Cummins QSX15-G9 Technical Data Sheet & Real-time Telemetry v2',
      route: '/gendashv2',
      icon: Activity,
      color: 'text-accent-red',
      bg: telemetryBg,
      vector: 'SEC-A1-GEN'
    },
    {
      id: '450kpar',
      title: 'Dual-Generator Parallel Hub',
      subtitle: 'SYNCHRO-LINK COMMAND',
      description: '450kW Synchronization & Load-Sharing Engineering Control',
      route: '/450kpar',
      icon: Cpu,
      color: 'text-accent-blue',
      bg: syncBg,
      vector: 'SEC-B4-SYNC'
    },
    {
      id: 'xoi-client',
      title: 'XOi Client Discovery Matrix',
      subtitle: 'INTELLIGENCE GATHERING',
      description: 'Field Service intelligence and stakeholder discovery questionnaire.',
      route: '/xoi-client',
      icon: FileText,
      color: 'text-accent-green',
      bg: xoiBg,
      vector: 'SEC-C9-INTEL'
    },
    {
      id: 'xoi-audit',
      title: 'XOi Feature Audit Board',
      subtitle: 'STRATEGIC APPRAISAL',
      description: 'Internal assessment and viability audit for XOi platform features.',
      route: '/xoi-audit',
      icon: Layers,
      color: 'text-accent-cyan',
      bg: intelligenceBg,
      vector: 'SEC-D2-AUDIT'
    },
    {
      id: 'dualcore-900',
      title: 'DualCore 900 Integrated System',
      subtitle: 'DUAL-ENGINE POWER CELL',
      description: '900kW Dual-engine factory-integrated enclosure. Zero-risk parallel engineering.',
      route: '/dualcore-900',
      icon: Zap,
      color: 'text-cyan-400',
      bg: syncBg,
      vector: 'SEC-E5-DUAL'
    }
  ];

  const mapNodes = [
    { id: 1, x: '25%', y: '40%', name: 'Sector ANU North', status: 'ACTIVE' },
    { id: 2, x: '65%', y: '30%', name: 'Sector ISS Primary', status: 'ACTIVE' },
    { id: 3, x: '45%', y: '70%', name: 'Sector DYS Research', status: 'STABLE' },
    { id: 4, x: '80%', y: '60%', name: 'Field Hub Matrix', status: 'SIGNAL_LOSS', alert: true },
  ];

  return (
    <Layout title="Strategic Operations Center">
      <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-10 md:space-y-16">
        
        {/* PROJECT GRID - FOLDER DESIGN */}
        <section>
          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 mb-8 md:mb-12">
            <h2 className="text-[10px] md:text-[11px] font-mono uppercase tracking-[0.3em] md:tracking-[0.5em] text-white flex items-center gap-3">
              <span className="w-2 h-2 bg-accent-red animate-pulse"></span>
              Strategic Operations Matrix
            </h2>
            <div className="hidden md:block flex-1 h-[1px] bg-gradient-to-r from-border-dim to-transparent opacity-30"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {projectCards.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => navigate(project.route)}
                className="folder-card group"
              >
                <div className="folder-tab"></div>
                <div className="folder-texture"></div>
                
                {/* Image Header */}
                <div className="h-44 relative overflow-hidden border-b border-border-dim/50">
                  <img 
                    src={project.bg} 
                    alt={project.title} 
                    className="w-full h-full object-cover grayscale brightness-50 group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-transparent to-transparent"></div>
                  <div className="absolute top-4 right-4">
                    <span className="stamped-label">{project.vector}</span>
                  </div>
                </div>

                <div className="p-6 relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-3 bg-white/5 border border-white/10 group-hover:border-accent-red/50 transition-colors">
                      <project.icon className={`w-6 h-6 ${project.color} group-hover:text-accent-red glow-text-red`} />
                    </div>
                    <div className="text-right">
                    </div>
                  </div>

                  <h3 className="text-xl font-bold mb-3 tracking-tight group-hover:text-accent-red transition-colors font-sans uppercase">
                    {project.title}
                  </h3>
                  <p className="text-[10px] text-text-secondary leading-relaxed mb-8 font-mono uppercase tracking-wide opacity-70 group-hover:opacity-100 transition-opacity">
                    {project.description}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <div className="flex items-center gap-2 text-[9px] font-mono font-bold uppercase tracking-[0.3em] text-accent-red">
                      Establish Uplink <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <div className="text-[8px] font-mono text-text-dim uppercase tracking-widest">{project.subtitle.split(' ')[0]}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* INTERACTIVE TACTICAL SECTION - COMMAND CENTER REDESIGN */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* MULTI-VECTOR TACTICAL MAP */}
          <div className="lg:col-span-8 tactical-border glass-panel overflow-hidden h-[350px] md:h-[550px] relative flex flex-col group/map shadow-[0_0_50px_rgba(0,0,0,0.8)]">
            <div className="p-5 border-b border-border-dim bg-white/5 flex justify-between items-center relative z-10 transition-colors group-hover/map:bg-white/10">
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 bg-accent-red rounded-full animate-ping"></div>
                <h2 className="text-[12px] font-mono uppercase tracking-[0.5em] font-black text-white glow-text-red">
                  Strategic Deployment Grid
                </h2>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-[10px] font-mono text-accent-cyan uppercase tracking-[0.3em] flex items-center gap-2">
                  <Activity className="w-3 h-3 animate-pulse" />
                  Signal Sync: 99.8%
                </div>
                <div className="bg-accent-red/10 border border-accent-red/20 px-3 py-1 text-[9px] font-mono text-accent-red font-bold animate-pulse">
                  VECTOR_ACTIVE
                </div>
              </div>
            </div>
            
            <div className="flex-1 relative bg-[#050505] overflow-hidden">
               {/* Advanced Grid Layer */}
               <div className="absolute inset-0 opacity-20 pointer-events-none" 
                    style={{ 
                      backgroundImage: `
                        linear-gradient(rgba(225, 29, 72, 0.1) 1px, transparent 1px), 
                        linear-gradient(90deg, rgba(225, 29, 72, 0.1) 1px, transparent 1px)
                      `, 
                      backgroundSize: '30px 30px',
                      maskImage: 'radial-gradient(circle at center, black, transparent 80%)'
                    }}></div>
               
               {/* Depth Grid Layer */}
               <div className="absolute inset-0 opacity-5 pointer-events-none" 
                    style={{ 
                      backgroundImage: `
                        linear-gradient(rgba(6, 182, 212, 0.2) 1px, transparent 1px), 
                        linear-gradient(90deg, rgba(6, 182, 212, 0.2) 1px, transparent 1px)
                      `, 
                      backgroundSize: '120px 120px'
                    }}></div>

               {/* Stylized World Map SVG Layer */}
               <div className="absolute inset-0 flex items-center justify-center opacity-[0.15] pointer-events-none p-12">
                 <svg viewBox="0 0 1000 500" className="w-full h-full text-accent-blue" fill="none" stroke="currentColor" strokeWidth="0.5">
                   <path d="M150,200 Q200,100 300,150 T450,250 T600,100 T800,200 M200,350 Q300,450 450,350 T650,400 T850,300" strokeDasharray="5 5" />
                   <circle cx="500" cy="250" r="200" strokeDasharray="10 5" />
                   <circle cx="500" cy="250" r="100" strokeDasharray="2 4" />
                   <line x1="0" y1="250" x2="1000" y2="250" opacity="0.5" />
                   <line x1="500" y1="0" x2="500" y2="500" opacity="0.5" />
                 </svg>
               </div>

               {/* Interactive Nodes with Advanced Styling */}
               {mapNodes.map((node) => (
                 <motion.div 
                  key={node.id}
                  whileHover={{ scale: 1.2 }}
                  className="absolute cursor-pointer group/node"
                  style={{ left: node.x, top: node.y }}
                  onClick={() => setActiveNode(node)}
                 >
                   <div className={`relative flex items-center justify-center`}>
                      <div className={`w-3 h-3 rounded-full ${node.alert ? 'bg-accent-red shadow-[0_0_15px_rgba(225,29,72,0.8)]' : 'bg-accent-blue shadow-[0_0_15px_rgba(6,182,212,0.8)]'} z-10`}></div>
                      <div className={`absolute inset-0 rounded-full animate-ping ${node.alert ? 'bg-accent-red/50' : 'bg-accent-blue/50'}`}></div>
                      
                      {/* Node Connection Line (Visual Only) */}
                      <div className="absolute bottom-full left-1/2 w-[1px] h-20 bg-gradient-to-t from-white/20 to-transparent pointer-events-none"></div>
                   </div>

                   <div className="absolute top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover/node:opacity-100 transition-opacity whitespace-nowrap z-20">
                     <div className="bg-black/90 border border-white/10 p-2 backdrop-blur-md">
                       <div className="text-[10px] font-mono text-white font-bold uppercase mb-1">{node.name}</div>
                       <div className="flex items-center gap-2">
                         <div className={`w-1.5 h-1.5 rounded-full ${node.alert ? 'bg-accent-red animate-pulse' : 'bg-accent-green'}`}></div>
                         <div className="text-[8px] font-mono text-text-dim uppercase tracking-widest">{node.status}</div>
                       </div>
                     </div>
                   </div>
                 </motion.div>
               ))}

               {/* Active Node Detail Modal */}
               <AnimatePresence>
                 {activeNode && (
                   <motion.div 
                    initial={{ opacity: 0, scale: 0.9, x: 20 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.9, x: 20 }}
                    className="absolute top-2 right-2 left-2 md:left-auto md:top-10 md:right-10 md:w-72 bg-black/95 border-l-4 border-accent-red p-4 md:p-6 z-40 stealth-shadow font-mono backdrop-blur-xl"
                   >
                     <div className="flex justify-between items-start mb-6">
                       <div className="text-[11px] text-accent-red uppercase tracking-[0.3em] font-black glow-text-red">Vector Intelligence</div>
                       <button onClick={() => setActiveNode(null)} className="text-text-dim hover:text-white transition-colors">
                         <Cog className="w-4 h-4 animate-[spin_4s_linear_infinite]" />
                       </button>
                     </div>
                     
                     <h4 className="text-base text-white mb-4 uppercase font-black italic tracking-tighter">{activeNode.name}</h4>
                     
                     <div className="space-y-4 text-[10px] uppercase tracking-widest">
                        <div className="flex justify-between border-b border-white/5 pb-2">
                          <span className="text-text-dim">Operational Status</span>
                          <span className={activeNode.alert ? 'text-accent-red font-black opacity-100' : 'text-accent-green font-bold'}>{activeNode.status}</span>
                        </div>
                        <div className="flex justify-between border-b border-white/5 pb-2">
                          <span className="text-text-dim">Relational Coordinates</span>
                          <span className="text-white">{activeNode.x} // {activeNode.y}</span>
                        </div>
                        <div className="flex justify-between border-b border-white/5 pb-2">
                          <span className="text-text-dim">Last Signal Buffer</span>
                          <span className="text-accent-blue font-bold">14:02.04ms</span>
                        </div>
                        <div className="flex justify-between border-b border-white/5 pb-2">
                          <span className="text-text-dim">Encryption Grade</span>
                          <span className="text-white">RSA-4096 Tactical</span>
                        </div>
                     </div>
                     
                     <button className="w-full mt-8 py-4 bg-accent-red text-white text-[10px] font-black uppercase tracking-[0.4em] hover:bg-red-800 transition-all shadow-[0_4px_15px_rgba(225,29,72,0.3)] flex items-center justify-center gap-3">
                       Execute Protocol <ArrowRight className="w-3 h-3" />
                     </button>
                   </motion.div>
                 )}
               </AnimatePresence>

               {/* Scanline Overlay */}
               <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] opacity-20"></div>
            </div>
          </div>

          {/* RIGHT COLUMN: RADAR & COMMUNICATIONS */}
          <div className="lg:col-span-4 space-y-8 lg:space-y-10">
            {/* ENHANCED THREAT ASSESSMENT RADAR */}
            <div className="tactical-border glass-panel p-6 md:p-8 h-auto min-h-[260px] relative overflow-hidden flex flex-col items-center justify-center group/radar shadow-[0_0_30px_rgba(0,0,0,0.5)]">
              <div className="absolute top-4 left-6 flex items-center gap-3">
                <ShieldAlert className={`w-4 h-4 text-accent-red ${activeNode?.alert ? 'animate-bounce' : 'animate-pulse'}`} />
                <span className="text-[11px] font-mono text-white font-black uppercase tracking-[0.4em]">Threat Pulse Matrix</span>
              </div>
              
              <div className="relative w-40 h-40">
                <div className="radar-circle w-full h-full border-white/20"></div>
                <div className="radar-circle w-3/4 h-3/4 border-white/10"></div>
                <div className="radar-circle w-1/2 h-1/2 border-white/5"></div>
                <div className="radar-circle w-1/4 h-1/4 border-white/5"></div>
                <div className="radar-sweep !bg-gradient-to-r from-accent-red to-transparent"></div>
                
                {/* Threat Markers */}
                <div className="absolute top-1/4 left-3/4 w-2 h-2 bg-accent-red rounded-full animate-pulse blur-[1px]"></div>
                <div className="absolute bottom-1/3 right-1/4 w-1.5 h-1.5 bg-accent-red rounded-full animate-pulse delay-300 blur-[1px]"></div>
                <div className="absolute top-1/2 left-1/4 w-1.5 h-1.5 bg-accent-blue rounded-full animate-pulse delay-700 blur-[1px]"></div>
                
                {/* Distance Markers */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 text-[7px] text-text-dim font-mono">50KM</div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[7px] text-text-dim font-mono">0KM</div>
              </div>

              <div className="mt-6 text-center">
                <div className="text-[12px] font-mono text-accent-red font-black uppercase tracking-[0.3em] mb-1 italic glow-text-red">Sector 7 Perimeter Breach</div>
                <div className="text-[9px] font-mono text-text-dim font-bold uppercase tracking-widest flex items-center justify-center gap-3">
                  <span className="animate-pulse">Analyzing...</span>
                  <span className="w-1 h-1 bg-text-dim rounded-full"></span>
                  <span>Interference: 0.04%</span>
                </div>
              </div>
            </div>

            {/* ENHANCED LIVE SIGNAL INTERCEPT LOG */}
            <div className="tactical-border glass-panel h-[300px] bg-gradient-to-br from-[#0a0a0a] to-[#1a0a0e] flex flex-col shadow-[0_0_30px_rgba(225,29,72,0.1)]">
               <div className="p-4 border-b border-white/5 bg-black/40 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <Radio className="w-4 h-4 text-accent-red animate-pulse" />
                    <span className="text-[11px] font-mono text-white uppercase tracking-[0.3em] font-black">Signal Intercept</span>
                  </div>
                  <div className="text-[8px] font-mono text-accent-blue uppercase tracking-widest bg-accent-blue/5 px-2 py-0.5 rounded">
                    ENCRYPTION: AES-256
                  </div>
               </div>
               
               <div className="flex-1 p-5 overflow-hidden font-mono text-[10px] space-y-3">
                  <div className="flex gap-4 group/msg">
                    <span className="text-text-dim whitespace-nowrap opacity-50">[14:02:45]</span>
                    <p className="text-accent-green font-bold tracking-tighter">&gt; [ANU] : SECTOR_STATUS_NOMINAL // STABLE</p>
                  </div>
                  <div className="flex gap-4 group/msg">
                    <span className="text-text-dim whitespace-nowrap opacity-50">[14:02:48]</span>
                    <p className="text-accent-blue font-bold tracking-tighter">&gt; [ISS] : DATABASE_SYNC_COMPLETE // VERIFIED</p>
                  </div>
                  <div className="flex gap-4 group/msg animate-pulse">
                    <span className="text-accent-red whitespace-nowrap">[14:03:01]</span>
                    <p className="text-accent-red font-bold tracking-tighter">&gt; [DYS] : SIGNAL_NOISE_DETECTED // QUAD-9 ERROR</p>
                  </div>
                  <div className="flex gap-4 group/msg">
                    <span className="text-text-dim whitespace-nowrap opacity-50">[14:03:05]</span>
                    <p className="text-white font-bold tracking-tighter">&gt; [CMD] : STAND_BY_FOR_UPLINK_03 // QUEUED</p>
                  </div>
                  <div className="flex gap-4 group/msg border-t border-white/5 pt-2 mt-4">
                    <span className="text-accent-cyan animate-pulse">&gt;_</span>
                    <span className="text-text-dim italic">Waiting for next transmission burst...</span>
                  </div>
               </div>
               
               <div className="h-1 w-full bg-white/5 overflow-hidden relative">
                 <motion.div 
                    animate={{ x: ['100%', '-100%'] }}
                    transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
                    className="absolute inset-0 bg-accent-red w-1/3 shadow-[0_0_10px_rgba(225,29,72,1)]"
                 ></motion.div>
               </div>
            </div>
          </div>
        </section>


        {/* NETWORK LOGS */}
        <section className="tactical-border glass-panel overflow-hidden stealth-shadow">
          <div className="p-5 border-b border-border-dim flex justify-between items-center bg-white/5 relative">
            <div className="absolute top-0 left-0 w-[2px] h-full bg-accent-red"></div>
            <h2 className="text-[11px] font-mono uppercase tracking-[0.4em] flex items-center gap-3">
              <Terminal className="w-4 h-4 text-accent-cyan" />
              Network Access Dossier
            </h2>
            <div className="flex items-end gap-3 font-mono">
              <div className="flex gap-1 mb-1">
                <span className="w-1.5 h-1.5 bg-accent-green rounded-full"></span>
                <span className="w-1.5 h-1.5 bg-accent-green/50 rounded-full"></span>
                <span className="w-1.5 h-1.5 bg-accent-green/20 rounded-full"></span>
              </div>
              <span className="text-[9px] text-accent-blue uppercase tracking-widest">Real-time Encrypted Stream</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-[10px]">
              <thead className="text-text-dim border-b border-border-dim uppercase tracking-[0.2em] bg-black/40">
                <tr>
                  <th className="p-5 font-medium">Timestamp</th>
                  <th className="p-5 font-medium">Operative</th>
                  <th className="p-5 font-medium">Protocol</th>
                  <th className="p-5 font-medium">Vector ID</th>
                  <th className="p-5 font-medium text-right">Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-dim/30">
                {[
                  { time: '2026-04-09 11:24:02', user: 'ANU', action: 'STRATEGIC_CMD', vector: '/admin', status: 'CONFIRMED' },
                  { time: '2026-04-09 10:15:58', user: 'ISS', action: 'DATA_RETRIEVAL', vector: '/gendashv2', status: 'CONFIRMED' },
                  { time: '2026-04-09 09:44:12', user: 'DYS', action: 'INTEL_INPUT', vector: '/xoi-client', status: 'CONFIRMED' },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-accent-red/5 transition-all group">
                    <td className="p-5 text-text-dim group-hover:text-text-primary transition-colors">{row.time}</td>
                    <td className="p-5 font-bold text-accent-red">{row.user}</td>
                    <td className="p-5 text-text-secondary">{row.action}</td>
                    <td className="p-5 text-accent-blue">{row.vector}</td>
                    <td className="p-5 text-right">
                      <span className="px-2 py-0.5 bg-accent-green/10 text-accent-green border border-accent-green/30 text-[8px] font-bold">
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default AdminPortal;
