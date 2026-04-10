import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  Settings, 
  Activity, 
  Database, 
  Terminal, 
  ChevronRight, 
  Cpu, 
  FileText, 
  Layers, 
  Zap, 
  BarChart4,
  Filter,
  Send,
  CheckCircle2,
  XCircle,
  PlusCircle,
  Maximize2,
  HelpCircle
} from 'lucide-react';

const SECTIONS = [
  {
    name: "Work order management",
    features: [
      {id:"wo1", name:"Work order creation", desc:"Create, assign, and dispatch jobs to technicians"},
      {id:"wo2", name:"Work order status tracking", desc:"Real-time status updates: pending, in-progress, complete"},
      {id:"wo3", name:"Job history & audit trail", desc:"Full log of all actions taken on a work order"},
      {id:"wo4", name:"Priority & urgency flagging", desc:"Set urgency levels and escalation triggers"},
      {id:"wo5", name:"Recurring work orders", desc:"Scheduled recurring maintenance jobs"},
      {id:"wo6", name:"Work order templates", desc:"Pre-built templates for common job types"},
    ]
  },
  {
    name: "Video & photo documentation",
    features: [
      {id:"vp1", name:"In-field video capture", desc:"Technicians record video during job execution"},
      {id:"vp2", name:"Photo documentation", desc:"Capture before/after photos tied to work orders"},
      {id:"vp3", name:"Annotated media", desc:"Draw, mark, and annotate photos/video frames"},
      {id:"vp4", name:"AI video analysis", desc:"Auto-detect equipment, issues, and actions from video"},
      {id:"vp5", name:"Media library", desc:"Organized repository of all job media by asset/location"},
      {id:"vp6", name:"Customer-facing media sharing", desc:"Share job documentation videos with customers"},
    ]
  },
  {
    name: "AI & intelligence",
    features: [
      {id:"ai1", name:"AI job summaries", desc:"Auto-generated plain-language summaries of completed jobs"},
      {id:"ai2", name:"Predictive issue detection", desc:"Flag potential equipment failures from job data"},
      {id:"ai3", name:"Part & repair recognition", desc:"AI identifies parts and repair types from video/photos"},
      {id:"ai4", name:"Smart search", desc:"Natural language search across all job records and media"},
      {id:"ai5", name:"Compliance verification", desc:"AI checks if jobs followed required procedures"},
      {id:"ai6", name:"Performance scoring", desc:"AI-generated technician quality scores per job"},
    ]
  },
  {
    name: "Knowledge base & training",
    features: [
      {id:"kb1", name:"Equipment manuals library", desc:"Searchable repository of OEM manuals and guides"},
      {id:"kb2", name:"Step-by-step guided workflows", desc:"In-app guided procedures for common repairs"},
      {id:"kb3", name:"Video training content", desc:"Training videos accessible in the field"},
      {id:"kb4", name:"SOP management", desc:"Create, version, and enforce standard operating procedures"},
      {id:"kb5", name:"QR code equipment lookup", desc:"Scan QR/barcode to instantly pull up equipment info"},
      {id:"kb6", name:"Expert knowledge capture", desc:"Record senior tech knowledge as reusable content"},
    ]
  },
  {
    name: "Asset & equipment management",
    features: [
      {id:"as1", name:"Asset registry", desc:"Database of all customer equipment with full history"},
      {id:"as2", name:"Asset health tracking", desc:"Condition scores and maintenance history per asset"},
      {id:"as3", name:"Install & commissioning records", desc:"Document new equipment installs with media"},
      {id:"as4", name:"Warranty tracking", desc:"Track warranty status and expiry per asset"},
      {id:"as5", name:"Asset location mapping", desc:"Map view of assets across customer sites"},
      {id:"as6", name:"Equipment lifecycle tracking", desc:"Track age, repair frequency, replacement recommendations"},
    ]
  },
  {
    name: "Customer experience",
    features: [
      {id:"cx1", name:"Customer job portal", desc:"Customer-facing portal to view job status and history"},
      {id:"cx2", name:"Job completion reports", desc:"Auto-generated PDF reports sent to customers post-job"},
      {id:"cx3", name:"Customer approval flows", desc:"Customers approve estimates or scope changes in-app"},
      {id:"cx4", name:"Customer notifications", desc:"SMS/email updates on technician arrival and job status"},
      {id:"cx5", name:"Customer feedback & ratings", desc:"Post-job customer satisfaction surveys"},
      {id:"cx6", name:"Transparency documentation", desc:"Show customers exactly what was done with media proof"},
    ]
  },
  {
    name: "Technician mobile app",
    features: [
      {id:"tm1", name:"iOS & Android app", desc:"Native mobile app for field technicians"},
      {id:"tm2", name:"Offline mode", desc:"Full functionality without internet connection"},
      {id:"tm3", name:"GPS & location tracking", desc:"Real-time technician location for dispatch visibility"},
      {id:"tm4", name:"Clock in / clock out", desc:"Time tracking tied to jobs and locations"},
      {id:"tm5", name:"Parts lookup & request", desc:"Search parts catalog and request from warehouse"},
      {id:"tm6", name:"Digital forms & checklists", desc:"Replace paper forms with digital inspection checklists"},
    ]
  },
  {
    name: "Dispatch & scheduling",
    features: [
      {id:"ds1", name:"Dispatch board", desc:"Visual board for managing and assigning open jobs"},
      {id:"ds2", name:"Technician availability view", desc:"See who is available, in transit, or on-job"},
      {id:"ds3", name:"Skill-based routing", desc:"Assign jobs based on technician certifications and skills"},
      {id:"ds4", name:"Scheduling calendar", desc:"Calendar view of all scheduled jobs by team"},
      {id:"ds5", name:"SLA tracking", desc:"Monitor response time commitments per customer/contract"},
      {id:"ds6", name:"Route optimization", desc:"Optimal routing for multi-stop technician days"},
    ]
  },
  {
    name: "Estimating & invoicing",
    features: [
      {id:"ei1", name:"In-field estimates", desc:"Technicians generate estimates on-site from the app"},
      {id:"ei2", name:"Quote approval workflow", desc:"Customer approves estimates digitally before work begins"},
      {id:"ei3", name:"Parts & labor pricing", desc:"Price catalog with flat-rate and time-and-material options"},
      {id:"ei4", name:"Invoice generation", desc:"Auto-generate invoices from completed work orders"},
      {id:"ei5", name:"Payment collection", desc:"Accept payments in the field via card/digital wallet"},
      {id:"ei6", name:"Financing options", desc:"Offer customer financing on larger jobs"},
    ]
  },
  {
    name: "Analytics & reporting",
    features: [
      {id:"ar1", name:"Operations dashboard", desc:"Real-time KPIs: jobs completed, revenue, SLA compliance"},
      {id:"ar2", name:"Technician performance reports", desc:"Individual and team productivity metrics"},
      {id:"ar3", name:"First-time fix rate tracking", desc:"Track how often jobs are resolved on first visit"},
      {id:"ar4", name:"Equipment failure analytics", desc:"Identify high-failure assets and failure patterns"},
      {id:"ar5", name:"Revenue analytics", desc:"Revenue by technician, job type, customer, and region"},
      {id:"ar6", name:"Custom report builder", desc:"Build and schedule custom reports for any data set"},
    ]
  },
  {
    name: "Integrations & platform",
    features: [
      {id:"int1", name:"ServiceTitan integration", desc:"Bi-directional sync with ServiceTitan FSM"},
      {id:"int2", name:"Generic FSM API", desc:"Connect to any FSM via open API (ServiceMax, FieldEdge, etc.)"},
      {id:"int3", name:"ERP integration", desc:"Sync with QuickBooks, SAP, NetSuite"},
      {id:"int4", name:"CRM integration", desc:"Push customer and job data to Salesforce, HubSpot"},
      {id:"int5", name:"Webhook & API access", desc:"Developer API for custom integrations and automation"},
      {id:"int6", name:"SSO & identity management", desc:"SAML/OAuth SSO with enterprise identity providers"},
    ]
  },
  {
    name: "Admin & settings",
    features: [
      {id:"adm1", name:"Role-based access control", desc:"Granular permissions by role: admin, dispatcher, tech, viewer"},
      {id:"adm2", name:"Multi-location / branch management", desc:"Manage multiple service regions or branches"},
      {id:"adm3", name:"Branding & white-label", desc:"Custom logo, colors, and domain for customer-facing views"},
      {id:"adm4", name:"Notification & alert configuration", desc:"Configure who gets notified for what events"},
      {id:"adm5", name:"Data retention & compliance", desc:"Configure data retention, HIPAA/SOC2 compliance settings"},
      {id:"adm6", name:"Audit logs", desc:"Full system audit log for security and compliance"},
    ]
  }
];

const XOIAudit = () => {
  const [decisions, setDecisions] = useState({});
  const [filter, setFilter] = useState('ALL');
  const [submitting, setSubmitting] = useState(false);

  const stats = {
    total: SECTIONS.flatMap(s => s.features).length,
    future: Object.values(decisions).filter(v => v === 'FUTURE').length,
    cut: Object.values(decisions).filter(v => v === 'CUT').length,
    add: Object.values(decisions).filter(v => v === 'ADD').length,
    none: SECTIONS.flatMap(s => s.features).length - Object.values(decisions).filter(Boolean).length
  };

  const handleDecide = (id, action) => {
    setDecisions(prev => ({
      ...prev,
      [id]: prev[id] === action ? null : action
    }));
  };

  const exportDecisions = async () => {
    setSubmitting(true);
    const timestamp = new Date().toLocaleString();
    
    // Group decisions
    const groups = { 'FUTURE FEATURE': [], ADD: [], CUT: [] };
    SECTIONS.forEach(sec => {
      sec.features.forEach(f => {
        const d = decisions[f.id];
        if (d === 'FUTURE') groups['FUTURE FEATURE'].push(`${sec.name} → ${f.name}`);
        else if (d) groups[d].push(`${sec.name} → ${f.name}`);
      });
    });

    const embeds = [
      {
        title: "🎯 XOi Feature Audit Decisions",
        color: 0x06b6d4,
        description: `Audit submission from SATCORP Terminal\n**Timestamp:** ${timestamp}`,
        fields: [
          ...Object.entries(groups).filter(([_, items]) => items.length > 0).map(([key, items]) => ({
            name: `${key} (${items.length})`,
            value: items.map(i => `• ${i}`).join('\n').substring(0, 1024)
          }))
        ],
        footer: { text: "KYRAX AI System // Feature Audit Module" }
      }
    ];

    if (stats.none > 0) {
      embeds[0].fields.push({
        name: "PENDING REVIEW",
        value: `${stats.none} features remain unmarked.`
      });
    }

    try {
      const response = await fetch('https://discord.com/api/webhooks/1491959357221634211/uldYeelaRmSbirVgoPgx-OpV1TqbxUa5OTJB6ul1ntMb4NyzIQgtajOkmzR8tz7SkTbP', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: "KYRAX // AUDIT TERMINAL",
          content: "📁 **Strategic Feature Audit Transmission Received**",
          embeds
        })
      });

      if (response.ok) {
        alert('TRANSMISSION SUCCESSFUL. Feature audit data synchronized with central command.');
      } else {
        throw new Error('Transmission failed');
      }
    } catch (err) {
      console.error(err);
      alert('TRANSMISSION ERROR. Relay failed. Check system logs.');
    } finally {
      setSubmitting(false);
    }
  };

  const ExportButton = ({ className = "" }) => (
    <button 
      onClick={exportDecisions}
      disabled={submitting}
      className={`bg-white text-black px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-2 hover:bg-slate-200 transition-all stealth-shadow disabled:opacity-50 ${className}`}
    >
      {submitting ? 'Transmitting...' : <><Send className="w-3.5 h-3.5" /> Export Decisions</>}
    </button>
  );

  return (
    <Layout title="Feature Audit Board">
      <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
        
        {/* HEADER SECTION */}
        <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-8 border-b border-border-dim relative overflow-hidden">
          <div>
            <div className="flex items-center gap-3 text-accent-cyan font-mono text-[10px] uppercase tracking-[0.4em] mb-4">
              <Shield className="w-4 h-4" />
              Strategic Appraisal // Vector XOi
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-white uppercase italic">
              XOi <span className="text-accent-red glow-text-red">Feature Audit</span>
            </h1>
            <p className="text-text-secondary font-mono text-[10px] mt-4 uppercase tracking-[0.3em]">
              Determine operational viability for subsequent integration phases.
            </p>
          </div>

          <ExportButton />
        </section>

        {/* SUMMARY & FILTER BAR */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 glass-panel p-6 border-l-4 border-accent-cyan flex flex-wrap items-center gap-8">
            <div className="flex flex-col">
              <span className="text-[10px] font-mono text-text-dim uppercase tracking-widest">Total Assets</span>
              <span className="text-2xl font-black text-white">{stats.total}</span>
            </div>
            <div className="w-[1px] h-8 bg-white/10 hidden sm:block"></div>
            <div className="flex flex-col">
              <span className="text-[10px] font-mono text-accent-blue uppercase tracking-widest">Future Feature</span>
              <span className="text-2xl font-black text-accent-blue">{stats.future}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-mono text-accent-amber uppercase tracking-widest">Add</span>
              <span className="text-2xl font-black text-accent-amber">{stats.add}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-mono text-accent-red uppercase tracking-widest">Cut</span>
              <span className="text-2xl font-black text-accent-red">{stats.cut}</span>
            </div>
            <div className="w-[1px] h-8 bg-white/10 hidden sm:block"></div>
            <div className="flex flex-col">
              <span className="text-[10px] font-mono text-text-dim uppercase tracking-widest">Unmarked</span>
              <span className="text-2xl font-black text-text-dim">{stats.none}</span>
            </div>
          </div>

          <div className="glass-panel p-6 border-l-4 border-white/20 flex flex-col justify-center gap-4">
             <div className="text-[10px] font-mono text-text-dim uppercase tracking-widest flex items-center gap-2">
                <Filter className="w-3 h-3" /> Filter Vector
             </div>
             <div className="flex flex-wrap gap-2">
                {['ALL', 'FUTURE', 'ADD', 'CUT', 'NONE'].map(f => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider border transition-all ${
                      filter === f 
                      ? 'bg-white/10 border-white text-white' 
                      : 'border-white/5 text-text-dim hover:border-white/20 hover:text-white'
                    }`}
                  >
                    {f === 'FUTURE' ? 'Future Feature' : f}
                  </button>
                ))}
             </div>
          </div>
        </div>

        {/* FEATURE SECTIONS */}
        <div className="space-y-12">
          {SECTIONS.map((section, sidx) => {
            const visibleFeatures = section.features.filter(f => {
              if (filter === 'ALL') return true;
              if (filter === 'NONE') return !decisions[f.id];
              return decisions[f.id] === filter;
            });

            if (visibleFeatures.length === 0) return null;

            return (
              <motion.div 
                key={section.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: sidx * 0.05 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-6">
                  <h2 className="text-[11px] font-mono uppercase tracking-[0.5em] text-accent-cyan font-black whitespace-nowrap">
                    {section.name}
                  </h2>
                  <div className="flex-1 h-[1px] bg-gradient-to-r from-accent-cyan/30 to-transparent"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {visibleFeatures.map(feat => {
                    const status = decisions[feat.id];
                    return (
                      <div 
                        key={feat.id}
                        className={`tactical-border glass-panel p-5 flex flex-col justify-between gap-6 group transition-all duration-300 ${
                          status === 'FUTURE' ? 'border-l-4 border-l-accent-blue bg-accent-blue/5' :
                          status === 'CUT' ? 'border-l-4 border-l-accent-red bg-accent-red/5' :
                          status === 'ADD' ? 'border-l-4 border-l-accent-amber bg-accent-amber/5' :
                          'border-l-4 border-l-transparent'
                        }`}
                      >
                        <div className="space-y-2">
                          <div className="flex justify-between items-start">
                            <h3 className="text-sm font-black text-white uppercase tracking-tight group-hover:text-accent-cyan transition-colors">
                              {feat.name}
                            </h3>
                            <span className="text-[9px] font-mono text-text-dim opacity-40 uppercase">{feat.id}</span>
                          </div>
                          <p className="text-[11px] text-text-secondary leading-relaxed font-mono uppercase opacity-70">
                            {feat.desc}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-2 pt-4 border-t border-white/5">
                          {[
                            { id: 'FUTURE', label: 'Future Feature', color: 'text-accent-blue', border: 'border-accent-blue/50', bg: 'bg-accent-blue', icon: Maximize2 },
                            { id: 'ADD', label: 'Add', color: 'text-accent-amber', border: 'border-accent-amber/50', bg: 'bg-accent-amber', icon: PlusCircle },
                            { id: 'CUT', label: 'Cut', color: 'text-accent-red', border: 'border-accent-red/50', bg: 'bg-accent-red', icon: XCircle },
                          ].map(btn => (
                            <button
                              key={btn.id}
                              onClick={() => handleDecide(feat.id, btn.id)}
                              className={`flex-1 min-w-[100px] flex items-center justify-center gap-2 py-2 border text-[9px] font-bold uppercase tracking-wider transition-all ${
                                status === btn.id 
                                ? `${btn.bg} border-transparent text-black shadow-[0_0_20px_rgba(255,255,255,0.2)]` 
                                : `border-white/10 text-text-dim hover:bg-white/5 hover:text-white`
                              }`}
                            >
                              <btn.icon className="w-3 h-3" />
                              {btn.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>
        
        {/* BOTTOM EXPORT BUTTON */}
        <section className="flex justify-center pt-8 border-t border-border-dim mt-12">
          <ExportButton />
        </section>
      </div>
    </Layout>
  );
};

export default XOIAudit;
