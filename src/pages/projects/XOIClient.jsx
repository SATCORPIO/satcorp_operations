import React, { useEffect, useState } from 'react';
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
  BarChart4
} from 'lucide-react';

const XOIClient = () => {
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    // Section 1
    companyName: '',
    industry: '',
    techCount: '',
    jobsPerMonth: '',
    workflow: '',
    equipmentTypes: '',
    connectivity: '',
    devices: [],
    revenue: '',
    // Section 2
    fsmSystems: [],
    otherFSM: '',
    currentXOi: '',
    xoiFeedback: '',
    integrations: [],
    otherIntegration: '',
    assetDatabase: '',
    compliance: [],
    techFrustration: '',
    // Section 3
    priorities: {},
    perfectFlow: '',
    historyWish: '',
    reportImportance: '',
    upsellImportance: '',
    dataplateTriggers: [],
    aiSummaryStyle: '',
    idealBuilder: '',
    videoSupport: '',
    multiOrg: '',
    // Section 4
    topFixes: '',
    dreamFeatures: '',
    aiRevenueOpps: '',
    // Section 5
    resistanceLevel: 0,
    resistanceDrivers: '',
    // Contact
    contactName: '',
    contactCompany: '',
    contactEmail: '',
    contactPhone: ''
  });

  useEffect(() => {
    // Stagger section animations
    const sections = document.querySelectorAll('.section');
    sections.forEach((s, i) => {
      s.style.animationDelay = (i * 0.05) + 's';
    });
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (field, value) => {
    setFormData(prev => {
      const current = prev[field] || [];
      const updated = current.includes(value)
        ? current.filter(item => item !== value)
        : [...current, value];
      return { ...prev, [field]: updated };
    });
  };

  const selectScale = (id, value) => {
    setFormData(prev => ({ ...prev, resistanceLevel: value }));
  };

  const formatDiscordPayload = () => {
    const WEBHOOK_URL = 'https://discord.com/api/webhooks/1491959357221634211/uldYeelaRmSbirVgoPgx-OpV1TqbxUa5OTJB6ul1ntMb4NyzIQgtajOkmzR8tz7SkTbP';
    const timestamp = new Date().toLocaleString();
    
    const embeds = [
      {
        title: "📁 01 | Company & Operations",
        color: 0x06b6d4, // Cyan
        fields: [
          { name: "Company/Industry", value: formData.companyName || "N/A" },
          { name: "Tech Count", value: formData.techCount || "N/A", inline: true },
          { name: "Jobs/Month", value: formData.jobsPerMonth || "N/A", inline: true },
          { name: "Connectivity", value: formData.connectivity || "N/A", inline: true },
          { name: "Devices", value: formData.devices.join(", ") || "None" },
          { name: "Revenue", value: formData.revenue || "N/A", inline: true },
          { name: "Workflow", value: formData.workflow || "N/A" },
          { name: "Equipment Types", value: formData.equipmentTypes || "N/A" }
        ]
      },
      {
        title: "💾 02 | Current Tech Stack",
        color: 0x3b82f6, // Blue
        fields: [
          { name: "FSM Systems", value: [...formData.fsmSystems, formData.otherFSM].filter(Boolean).join(", ") || "None" },
          { name: "XOi Status", value: formData.currentXOi || "N/A" },
          { name: "XOi Feedback", value: formData.xoiFeedback || "N/A" },
          { name: "Integrations Needed", value: [...formData.integrations, formData.otherIntegration].filter(Boolean).join(", ") || "None" },
          { name: "Asset DB", value: formData.assetDatabase || "N/A" },
          { name: "Data/Compliance", value: formData.compliance.join(", ") || "None" },
          { name: "Biggest Frustration", value: formData.techFrustration || "N/A" }
        ]
      },
      {
        title: "⚙️ 03 | Functional Requirements",
        color: 0x10b981, // Green
        fields: [
          { name: "Top Priorities", value: Object.entries(formData.priorities).map(([k,v]) => `• ${k}: ${v}`).join("\n") || "No ratings provided" },
          { name: "Perfect Flow", value: formData.perfectFlow || "N/A" },
          { name: "Equipment History Wish", value: formData.historyWish || "N/A" },
          { name: "Dataplate Actions", value: formData.dataplateTriggers.join(", ") || "None" },
          { name: "AI Summary Vision", value: formData.aiSummaryStyle || "N/A" },
          { name: "Workflow Builder Needs", value: formData.idealBuilder || "N/A" },
          { name: "Video Support Priority", value: formData.videoSupport || "N/A", inline: true },
          { name: "Multi-Org Required", value: formData.multiOrg || "N/A", inline: true }
        ]
      },
      {
        title: "🚀 04 | Upgrades & Innovation",
        color: 0xf59e0b, // Amber
        fields: [
          { name: "Top 3 XOi Fixes", value: formData.topFixes || "N/A" },
          { name: "Dream Features", value: formData.dreamFeatures || "N/A" },
          { name: "AI Revenue Flags", value: formData.aiRevenueOpps || "N/A" }
        ]
      },
      {
        title: "📊 05 | Success Metrics",
        color: 0xe11d48, // Red
        fields: [
          { name: "Resistance Level", value: `${formData.resistanceLevel}/10`, inline: true },
          { name: "Resistance Drivers", value: formData.resistanceDrivers || "N/A" }
        ]
      },
      {
        title: "👤 Contact Information",
        color: 0xffffff, // White
        fields: [
          { name: "Name", value: formData.contactName || "N/A", inline: true },
          { name: "Company", value: formData.contactCompany || "N/A", inline: true },
          { name: "Email", value: formData.contactEmail || "N/A", inline: true },
          { name: "Phone", value: formData.contactPhone || "N/A", inline: true }
        ],
        footer: {
          text: `KYRAX AI System • ${formData.contactCompany || 'SATCORP Client'} • ${timestamp}`
        }
      }
    ];

    return {
      username: "KYRAX // SATCORP AI",
      avatar_url: "https://raw.githubusercontent.com/Antigravity-AI/media/main/kyrax_logo_placeholder.png", // We'll use a placeholder for now, or just leave blank if no public URL
      content: "⚡ **New Discovery Matrix Transmission Received**",
      embeds: embeds
    };
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    setSubmitting(true);
    
    try {
      const payload = formatDiscordPayload();
      const WEBHOOK_URL = 'https://discord.com/api/webhooks/1491959357221634211/uldYeelaRmSbirVgoPgx-OpV1TqbxUa5OTJB6ul1ntMb4NyzIQgtajOkmzR8tz7SkTbP';
      
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        alert('TRANSMISSION SUCCESSFUL. KYRAX has received your data. We\'ll be in touch within 2 business days.');
      } else {
        throw new Error('Transmission failed');
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('TRANSMISSION ERROR. Please check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="xoi-client-wrapper">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap');

        :root {
          --bg-primary: #020202;
          --bg-secondary: #0d0d0d;
          --bg-tertiary: #141414;
          --surface: rgba(20, 20, 20, 0.7);
          --border: #1c1c1c;
          --border-active: #333333;
          --text-primary: #ffffff;
          --text-secondary: #a1a1aa;
          --text-dim: #52525b;
          --accent-red: #e11d48;
          --accent-cyan: #06b6d4;
          --accent-amber: #f59e0b;
          --mono: 'JetBrains Mono', monospace;
          --sans: 'Inter', sans-serif;
          --glass: rgba(2, 2, 2, 0.8);
        }

        .xoi-client-wrapper {
          background-color: var(--bg-primary);
          color: var(--text-primary);
          font-family: var(--sans);
          font-weight: 300;
          line-height: 1.6;
          min-height: 100vh;
          -webkit-font-smoothing: antialiased;
          background-image: 
            radial-gradient(circle at 2px 2px, rgba(255,255,255,0.02) 1px, transparent 0);
          background-size: 40px 40px;
        }

        .page {
          max-width: 840px;
          margin: 0 auto;
          padding: 80px 40px 100px;
        }

        /* HEADER */
        .doc-header {
          padding-top: 24px;
          padding-bottom: 24px;
          margin-bottom: 56px;
          border-bottom: 1px solid var(--border);
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 24px;
          position: sticky;
          top: 0;
          z-index: 100;
          background: var(--glass);
          backdrop-filter: blur(10px);
        }

        .doc-header::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          width: 80px;
          height: 1px;
          background: var(--accent-red);
          box-shadow: 0 0 10px var(--accent-red);
        }

        .doc-eyebrow {
          font-family: var(--mono);
          font-size: 10px;
          letter-spacing: 0.4em;
          text-transform: uppercase;
          color: var(--accent-cyan);
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .doc-eyebrow::before {
          content: '';
          width: 12px;
          height: 12px;
          border-left: 1px solid var(--accent-cyan);
          border-top: 1px solid var(--accent-cyan);
        }

        h1 {
          font-size: clamp(32px, 5vw, 48px);
          line-height: 1;
          letter-spacing: -0.04em;
          color: var(--text-primary);
          max-width: 600px;
          margin: 0;
          font-weight: 900;
          text-transform: uppercase;
          font-style: italic;
        }

        h1 em {
          font-style: italic;
          color: var(--accent-red);
          text-shadow: 0 0 20px rgba(225, 29, 72, 0.3);
        }

        .doc-header-right {
          text-align: right;
          flex-shrink: 0;
        }

        .doc-meta {
          font-family: var(--mono);
          font-size: 10px;
          line-height: 2.2;
          color: var(--text-dim);
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .doc-meta strong {
          color: var(--text-secondary);
          font-weight: 500;
        }

        /* INTRO */
        .intro {
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          padding: 40px;
          margin-bottom: 64px;
          position: relative;
          backdrop-filter: blur(10px);
        }

        .intro::before {
          content: '';
          position: absolute;
          top: 0; left: 0; width: 100%; height: 100%;
          background: linear-gradient(135deg, rgba(6, 182, 212, 0.03) 0%, transparent 100%);
          pointer-events: none;
        }

        .intro p {
          font-size: 14px;
          line-height: 1.8;
          color: var(--text-secondary);
          margin-bottom: 20px;
          position: relative;
          z-index: 1;
        }

        .intro p:last-child { margin-bottom: 0; }
        .intro strong { color: var(--text-primary); font-weight: 600; }

        /* SECTIONS */
        .section {
          margin-bottom: 72px;
          animation: fadeUp 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) both;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .section-header {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 32px;
          padding-bottom: 12px;
          border-bottom: 1px solid var(--border);
        }

        .section-num {
          font-family: var(--mono);
          font-size: 11px;
          color: var(--accent-cyan);
          letter-spacing: 0.2em;
          background: rgba(6,182,212,0.1);
          padding: 4px 10px;
          border: 1px solid var(--accent-cyan);
        }

        .section-title {
          font-size: 24px;
          font-weight: 800;
          letter-spacing: -0.02em;
          color: var(--text-primary);
          text-transform: uppercase;
        }

        .section-desc {
          font-size: 10px;
          color: var(--text-dim);
          margin-left: auto;
          font-family: var(--mono);
          letter-spacing: 0.2em;
          text-transform: uppercase;
        }

        /* QUESTION BLOCKS */
        .question-block {
          margin-bottom: 32px;
          padding: 32px;
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .question-block::before {
          content: '';
          position: absolute;
          top: 0; left: 0; width: 2px; height: 100%;
          background: var(--border);
          transition: background 0.3s;
        }

        .question-block:hover {
          background: var(--bg-tertiary);
          border-color: var(--border-active);
        }

        .question-block:focus-within {
          border-color: var(--accent-cyan);
          box-shadow: 0 10px 40px -10px rgba(6, 182, 212, 0.15);
        }

        .question-block:focus-within::before {
          background: var(--accent-cyan);
        }

        .q-num {
          font-family: var(--mono);
          font-size: 9px;
          color: var(--text-dim);
          letter-spacing: 0.3em;
          margin-bottom: 12px;
          text-transform: uppercase;
        }

        .q-text {
          font-size: 16px;
          font-weight: 600;
          color: var(--text-primary);
          line-height: 1.4;
          margin-bottom: 8px;
        }

        .q-hint {
          font-size: 12px;
          color: var(--text-dim);
          margin-bottom: 24px;
          line-height: 1.6;
          font-weight: 300;
        }

        /* INPUTS */
        textarea, input[type="text"], input[type="email"], input[type="number"], select {
          width: 100%;
          font-family: var(--sans);
          font-size: 14px;
          font-weight: 400;
          color: var(--text-primary);
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid var(--border);
          padding: 14px 16px;
          outline: none;
          resize: vertical;
          transition: all 0.2s;
          border-radius: 2px;
        }

        textarea:focus, input:focus, select:focus {
          border-color: var(--accent-cyan);
          background: rgba(6, 182, 212, 0.05);
          box-shadow: 0 0 15px rgba(6, 182, 212, 0.1);
        }

        textarea::placeholder, input::placeholder {
          color: var(--text-dim);
        }

        /* OPTIONS GRID */
        .options-grid {
          display: grid;
          gap: 10px;
          margin-top: 4px;
        }

        .options-grid.cols-2 { grid-template-columns: 1fr 1fr; }
        .options-grid.cols-3 { grid-template-columns: 1fr 1fr 1fr; }

        .opt-label {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 18px;
          border: 1px solid var(--border);
          cursor: pointer;
          transition: all 0.2s;
          background: rgba(0, 0, 0, 0.2);
          font-size: 13px;
          color: var(--text-secondary);
          border-radius: 2px;
        }

        .opt-label:hover { 
          border-color: var(--accent-cyan); 
          color: var(--text-primary); 
          background: rgba(6, 182, 212, 0.05); 
        }

        .opt-label input { 
          accent-color: var(--accent-cyan); 
          width: 16px;
          height: 16px;
          cursor: pointer;
        }

        /* SCALE ROW */
        .scale-row {
          display: grid;
          grid-template-columns: repeat(10, 1fr);
          gap: 6px;
          margin-top: 12px;
        }

        .scale-btn {
          aspect-ratio: 1;
          border: 1px solid var(--border);
          background: rgba(255, 255, 255, 0.03);
          font-family: var(--mono);
          font-size: 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          color: var(--text-dim);
          border-radius: 2px;
        }

        .scale-btn:hover {
          border-color: var(--accent-amber);
          color: var(--accent-amber);
          background: rgba(245, 158, 11, 0.05);
        }

        .scale-btn.active {
          background: var(--accent-amber);
          border-color: var(--accent-amber);
          color: black;
          font-weight: 700;
          box-shadow: 0 0 20px rgba(245, 158, 11, 0.3);
        }

        .scale-labels {
          display: flex;
          justify-content: space-between;
          margin-top: 10px;
          font-family: var(--mono);
          font-size: 9px;
          color: var(--text-dim);
          letter-spacing: 0.15em;
          text-transform: uppercase;
        }

        /* PRIORITY TABLE */
        .priority-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0 8px;
          margin-top: 8px;
        }

        .priority-table th {
          font-family: var(--mono);
          font-size: 9px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--text-dim);
          padding: 12px 16px;
          text-align: left;
          background: transparent;
        }

        .priority-table td {
          padding: 16px;
          background: rgba(0, 0, 0, 0.2);
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
          font-size: 14px;
          color: var(--text-secondary);
        }

        .priority-table td:first-child { 
          border-left: 1px solid var(--border); 
          border-radius: 4px 0 0 4px;
          color: var(--text-primary);
        }
        .priority-table td:last-child { 
          border-right: 1px solid var(--border); 
          border-radius: 0 4px 4px 0;
          width: 220px;
        }

        .priority-table select {
          background: var(--bg-primary);
          padding: 8px;
          border-color: var(--border-active);
        }

        /* SUBMIT SECTION */
        .submit-section {
          background: linear-gradient(135deg, var(--bg-tertiary) 0%, #000 100%);
          padding: 60px;
          margin-top: 80px;
          border: 1px solid var(--border);
          position: relative;
          overflow: hidden;
        }

        .submit-section::after {
          content: 'TOP SECRET';
          position: absolute;
          top: 20px;
          right: -40px;
          transform: rotate(45deg);
          font-family: var(--mono);
          font-size: 10px;
          color: rgba(225, 29, 72, 0.2);
          border: 1px solid rgba(225, 29, 72, 0.2);
          padding: 4px 60px;
          pointer-events: none;
        }

        .submit-section h3 {
          font-size: 28px;
          font-weight: 900;
          color: var(--text-primary);
          margin-bottom: 12px;
          margin-top: 0;
          text-transform: uppercase;
          font-style: italic;
          letter-spacing: -0.02em;
        }

        .submit-section p {
          font-size: 13px;
          color: var(--text-dim);
          margin-bottom: 40px;
          line-height: 1.8;
          max-width: 500px;
        }

        .submit-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 40px;
        }

        .submit-grid input {
          background: rgba(0,0,0,0.5);
          border-color: var(--border-active);
        }

        .submit-btn {
          background: var(--accent-red);
          color: white;
          border: none;
          padding: 20px 48px;
          font-family: var(--mono);
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.3s;
          display: inline-flex;
          align-items: center;
          gap: 16px;
          box-shadow: 0 0 30px rgba(225, 29, 72, 0.2);
        }

        .submit-btn:hover { 
          background: #ff1f54; 
          transform: translateY(-2px);
          box-shadow: 0 0 40px rgba(225, 29, 72, 0.4);
        }
        
        .submit-btn::after { 
          content: '>>'; 
          font-family: var(--mono);
          font-size: 14px; 
          opacity: 0.8;
        }

        @media (max-width: 600px) {
          .page { padding: 40px 20px 80px; }
          .doc-header { flex-direction: column; align-items: flex-start; }
          .doc-header-right { text-align: left; }
          .options-grid.cols-2, .options-grid.cols-3 { grid-template-columns: 1fr; }
          .submit-grid { grid-template-columns: 1fr; }
          .scale-row { grid-template-columns: repeat(5, 1fr); }
        }
      `}</style>

      <div className="page">
        {/* HEADER */}
        <div className="doc-header">
          <div className="doc-header-left">
            <div className="doc-eyebrow"><Shield className="w-3 h-3" /> System Discovery Matrix</div>
            <h1>Field Service Intelligence<br /><em>Discovery</em> Matrix</h1>
          </div>
          <div className="doc-header-right">
             <div className="doc-meta">
              <div><strong>Document</strong> · FSP-DQ-001</div>
              <div><strong>Version</strong> · 1.0</div>
              <div className="mt-2">
              </div>
            </div>
          </div>
        </div>

        {/* INTRO */}
        <div className="intro">
          <p>Thank you for considering this engagement. This questionnaire is designed to give us a complete picture of your business operations, technical environment, and product vision before we begin development.</p>
          <p>Your answers directly shape the architecture, feature prioritisation, and timeline of the platform. There are no wrong answers <strong>the more detail you provide, the more precisely we can build what you actually need.</strong> Please complete all sections at your own pace. This typically takes 25–40 minutes.</p>
        </div>

        {/* SECTION 1: COMPANY & OPERATIONS */}
        <div className="section">
          <div className="section-header">
            <div className="section-num">01</div>
            <div className="section-title">Company & Operations</div>
            <div className="section-desc"><Layers className="w-3 h-3 inline mr-2" /> Context // 8 Elements</div>
          </div>

          <div className="question-block">
            <div className="q-num">Q1.1</div>
            <div className="q-text">What is your company name, and what industry/trade does your field service team operate in?</div>
            <textarea 
              placeholder="e.g. Apex HVAC Services commercial HVAC installation, maintenance, and repair across the Southeast..."
              value={formData.companyName}
              onChange={(e) => handleInputChange('companyName', e.target.value)}
            ></textarea>
          </div>

          <div className="question-block">
            <div className="q-num">Q1.2</div>
            <div className="q-text">How many field technicians do you currently employ or manage?</div>
            <div className="options-grid cols-3">
              <label className="opt-label"><input type="radio" name="tech-count" checked={formData.techCount === '1–10 techs'} onChange={() => handleInputChange('techCount', '1–10 techs')} /> <span>1–10 techs</span></label>
              <label className="opt-label"><input type="radio" name="tech-count" checked={formData.techCount === '11–50 techs'} onChange={() => handleInputChange('techCount', '11–50 techs')} /> <span>11–50 techs</span></label>
              <label className="opt-label"><input type="radio" name="tech-count" checked={formData.techCount === '51–150 techs'} onChange={() => handleInputChange('techCount', '51–150 techs')} /> <span>51–150 techs</span></label>
              <label className="opt-label"><input type="radio" name="tech-count" checked={formData.techCount === '151–500 techs'} onChange={() => handleInputChange('techCount', '151–500 techs')} /> <span>151–500 techs</span></label>
              <label className="opt-label"><input type="radio" name="tech-count" checked={formData.techCount === '500+ techs'} onChange={() => handleInputChange('techCount', '500+ techs')} /> <span>500+ techs</span></label>
              <label className="opt-label"><input type="radio" name="tech-count" checked={formData.techCount === 'Multiple orgs'} onChange={() => handleInputChange('techCount', 'Multiple orgs')} /> <span>Multiple orgs</span></label>
            </div>
          </div>

          <div className="question-block">
            <div className="q-num">Q1.3</div>
            <div className="q-text">How many jobs does your team complete per month on average?</div>
            <input 
              type="number" 
              placeholder="e.g. 400" 
              value={formData.jobsPerMonth}
              onChange={(e) => handleInputChange('jobsPerMonth', e.target.value)}
            />
          </div>

          <div className="question-block">
            <div className="q-num">Q1.4</div>
            <div className="q-text">Describe your current job workflow from dispatch to job completion to invoicing.</div>
            <div className="q-hint">Walk us through what happens step by step today, even if the process is manual or messy.</div>
            <textarea 
              style={{ minHeight: '120px' }} 
              placeholder="e.g. Dispatcher receives call → enters work order in ServiceTitan → assigns to tech via app → tech travels, does job, takes photos..."
              value={formData.workflow}
              onChange={(e) => handleInputChange('workflow', e.target.value)}
            ></textarea>
          </div>

          <div className="question-block">
            <div className="q-num">Q1.5</div>
            <div className="q-text">What types of equipment or assets do your technicians most commonly service?</div>
            <div className="q-hint">List makes, models, or categories if possible.</div>
            <textarea 
              placeholder="e.g. Carrier rooftop units, Trane chillers, Daikin VRF systems, commercial boilers..."
              value={formData.equipmentTypes}
              onChange={(e) => handleInputChange('equipmentTypes', e.target.value)}
            ></textarea>
          </div>

          <div className="question-block">
            <div className="q-num">Q1.6</div>
            <div className="q-text">Do your technicians work in areas with unreliable internet connectivity?</div>
            <div className="options-grid cols-2">
              <label className="opt-label"><input type="radio" name="offline" checked={formData.connectivity === 'Yes — frequently (rooftops, basements, rural)'} onChange={() => handleInputChange('connectivity', 'Yes — frequently (rooftops, basements, rural)')} /> <span>Yes — frequently (rooftops, basements, rural)</span></label>
              <label className="opt-label"><input type="radio" name="offline" checked={formData.connectivity === 'Sometimes — occasional dead zones'} onChange={() => handleInputChange('connectivity', 'Sometimes — occasional dead zones')} /> <span>Sometimes — occasional dead zones</span></label>
              <label className="opt-label"><input type="radio" name="offline" checked={formData.connectivity === 'Rarely — mostly urban/connected'} onChange={() => handleInputChange('connectivity', 'Rarely — mostly urban/connected')} /> <span>Rarely — mostly urban/connected</span></label>
              <label className="opt-label"><input type="radio" name="offline" checked={formData.connectivity === 'No — always connected'} onChange={() => handleInputChange('connectivity', 'No — always connected')} /> <span>No — always connected</span></label>
            </div>
          </div>

          <div className="question-block">
            <div className="q-num">Q1.7</div>
            <div className="q-text">What devices do your technicians currently use in the field?</div>
            <div className="options-grid cols-2">
              <label className="opt-label"><input type="checkbox" name="devices" checked={formData.devices.includes('iPhone')} onChange={() => handleCheckboxChange('devices', 'iPhone')} /> <span>iPhone</span></label>
              <label className="opt-label"><input type="checkbox" name="devices" checked={formData.devices.includes('Android phone')} onChange={() => handleCheckboxChange('devices', 'Android phone')} /> <span>Android phone</span></label>
              <label className="opt-label"><input type="checkbox" name="devices" checked={formData.devices.includes('iPad / tablet')} onChange={() => handleCheckboxChange('devices', 'iPad / tablet')} /> <span>iPad / tablet</span></label>
              <label className="opt-label"><input type="checkbox" name="devices" checked={formData.devices.includes('Android tablet')} onChange={() => handleCheckboxChange('devices', 'Android tablet')} /> <span>Android tablet</span></label>
              <label className="opt-label"><input type="checkbox" name="devices" checked={formData.devices.includes('Rugged device (Zebra, etc.)')} onChange={() => handleCheckboxChange('devices', 'Rugged device (Zebra, etc.)')} /> <span>Rugged device (Zebra, etc.)</span></label>
              <label className="opt-label"><input type="checkbox" name="devices" checked={formData.devices.includes('Laptop / Surface')} onChange={() => handleCheckboxChange('devices', 'Laptop / Surface')} /> <span>Laptop / Surface</span></label>
            </div>
          </div>

          <div className="question-block">
            <div className="q-num">Q1.8</div>
            <div className="q-text">What is your approximate annual revenue from field service operations?</div>
            <div className="options-grid cols-3">
              <label className="opt-label"><input type="radio" name="revenue" checked={formData.revenue === 'Under $1M'} onChange={() => handleInputChange('revenue', 'Under $1M')} /> <span>Under $1M</span></label>
              <label className="opt-label"><input type="radio" name="revenue" checked={formData.revenue === '$1M–$5M'} onChange={() => handleInputChange('revenue', '$1M–$5M')} /> <span>$1M–$5M</span></label>
              <label className="opt-label"><input type="radio" name="revenue" checked={formData.revenue === '$5M–$20M'} onChange={() => handleInputChange('revenue', '$5M–$20M')} /> <span>$5M–$20M</span></label>
              <label className="opt-label"><input type="radio" name="revenue" checked={formData.revenue === '$20M–$100M'} onChange={() => handleInputChange('revenue', '$20M–$100M')} /> <span>$20M–$100M</span></label>
              <label className="opt-label"><input type="radio" name="revenue" checked={formData.revenue === '$100M+'} onChange={() => handleInputChange('revenue', '$100M+')} /> <span>$100M+</span></label>
              <label className="opt-label"><input type="radio" name="revenue" checked={formData.revenue === 'Prefer not to say'} onChange={() => handleInputChange('revenue', 'Prefer not to say')} /> <span>Prefer not to say</span></label>
            </div>
          </div>
        </div>

        {/* SECTION 2: CURRENT SOFTWARE */}
        <div className="section">
          <div className="section-header">
            <div className="section-num">02</div>
            <div className="section-title">Current Tech Stack</div>
            <div className="section-desc"><Database className="w-3 h-3 inline mr-2" /> Systems // 6 Elements</div>
          </div>

          <div className="question-block">
            <div className="q-num">Q2.1</div>
            <div className="q-text">What field service management (FSM) software are you currently using?</div>
            <div className="options-grid cols-2">
              <label className="opt-label"><input type="checkbox" checked={formData.fsmSystems.includes('ServiceTitan')} onChange={() => handleCheckboxChange('fsmSystems', 'ServiceTitan')} /> <span>ServiceTitan</span></label>
              <label className="opt-label"><input type="checkbox" checked={formData.fsmSystems.includes('Jobber')} onChange={() => handleCheckboxChange('fsmSystems', 'Jobber')} /> <span>Jobber</span></label>
              <label className="opt-label"><input type="checkbox" checked={formData.fsmSystems.includes('FieldEdge')} onChange={() => handleCheckboxChange('fsmSystems', 'FieldEdge')} /> <span>FieldEdge</span></label>
              <label className="opt-label"><input type="checkbox" checked={formData.fsmSystems.includes('ServiceMax')} onChange={() => handleCheckboxChange('fsmSystems', 'ServiceMax')} /> <span>ServiceMax</span></label>
              <label className="opt-label"><input type="checkbox" checked={formData.fsmSystems.includes('Salesforce Field Service')} onChange={() => handleCheckboxChange('fsmSystems', 'Salesforce Field Service')} /> <span>Salesforce Field Service</span></label>
              <label className="opt-label"><input type="checkbox" checked={formData.fsmSystems.includes('Microsoft Dynamics FSM')} onChange={() => handleCheckboxChange('fsmSystems', 'Microsoft Dynamics FSM')} /> <span>Microsoft Dynamics FSM</span></label>
              <label className="opt-label"><input type="checkbox" checked={formData.fsmSystems.includes('Custom / in-house')} onChange={() => handleCheckboxChange('fsmSystems', 'Custom / in-house')} /> <span>Custom / in-house</span></label>
              <label className="opt-label"><input type="checkbox" checked={formData.fsmSystems.includes('None / spreadsheets')} onChange={() => handleCheckboxChange('fsmSystems', 'None / spreadsheets')} /> <span>None / spreadsheets</span></label>
            </div>
            <div style={{ marginTop: '10px' }}>
              <input 
                type="text" 
                placeholder="Other FSM system not listed..." 
                value={formData.otherFSM}
                onChange={(e) => handleInputChange('otherFSM', e.target.value)}
              />
            </div>
          </div>

          <div className="question-block">
            <div className="q-num">Q2.2</div>
            <div className="q-text">Are you currently using XOi or any similar field intelligence tool?</div>
            <div className="options-grid cols-2">
              <label className="opt-label"><input type="radio" name="current-tool" checked={formData.currentXOi === 'Yes — currently using XOi'} onChange={() => handleInputChange('currentXOi', 'Yes — currently using XOi')} /> <span>Yes — currently using XOi</span></label>
              <label className="opt-label"><input type="radio" name="current-tool" checked={formData.currentXOi === 'Yes — using a competitor'} onChange={() => handleInputChange('currentXOi', 'Yes — using a competitor')} /> <span>Yes — using a competitor</span></label>
              <label className="opt-label"><input type="radio" name="current-tool" checked={formData.currentXOi === 'No — evaluating options'} onChange={() => handleInputChange('currentXOi', 'No — evaluating options')} /> <span>No — evaluating options</span></label>
              <label className="opt-label"><input type="radio" name="current-tool" checked={formData.currentXOi === 'No — this is new territory'} onChange={() => handleInputChange('currentXOi', 'No — this is new territory')} /> <span>No — this is new territory</span></label>
            </div>
            <div style={{ marginTop: '10px' }}>
              <textarea 
                placeholder="If yes what do you like and dislike about your current tool?"
                value={formData.xoiFeedback}
                onChange={(e) => handleInputChange('xoiFeedback', e.target.value)}
              ></textarea>
            </div>
          </div>

          <div className="question-block">
            <div className="q-num">Q2.3</div>
            <div className="q-text">Which systems would the new platform need to integrate with?</div>
            <div className="q-hint">Check all that apply we'll plan integration architecture around your stack.</div>
            <div className="options-grid cols-2">
              <label className="opt-label"><input type="checkbox" checked={formData.integrations.includes('ServiceTitan (jobs, dispatch)')} onChange={() => handleCheckboxChange('integrations', 'ServiceTitan (jobs, dispatch)')} /> <span>ServiceTitan (jobs, dispatch)</span></label>
              <label className="opt-label"><input type="checkbox" checked={formData.integrations.includes('QuickBooks / Xero (accounting)')} onChange={() => handleCheckboxChange('integrations', 'QuickBooks / Xero (accounting)')} /> <span>QuickBooks / Xero (accounting)</span></label>
              <label className="opt-label"><input type="checkbox" checked={formData.integrations.includes('Salesforce CRM')} onChange={() => handleCheckboxChange('integrations', 'Salesforce CRM')} /> <span>Salesforce CRM</span></label>
              <label className="opt-label"><input type="checkbox" checked={formData.integrations.includes('HubSpot CRM')} onChange={() => handleCheckboxChange('integrations', 'HubSpot CRM')} /> <span>HubSpot CRM</span></label>
              <label className="opt-label"><input type="checkbox" checked={formData.integrations.includes('Stripe / billing platform')} onChange={() => handleCheckboxChange('integrations', 'Stripe / billing platform')} /> <span>Stripe / billing platform</span></label>
              <label className="opt-label"><input type="checkbox" checked={formData.integrations.includes('DocuSign / e-signature')} onChange={() => handleCheckboxChange('integrations', 'DocuSign / e-signature')} /> <span>DocuSign / e-signature</span></label>
              <label className="opt-label"><input type="checkbox" checked={formData.integrations.includes('Slack / Teams (notifications)')} onChange={() => handleCheckboxChange('integrations', 'Slack / Teams (notifications)')} /> <span>Slack / Teams (notifications)</span></label>
              <label className="opt-label"><input type="checkbox" checked={formData.integrations.includes('Custom ERP / in-house')} onChange={() => handleCheckboxChange('integrations', 'Custom ERP / in-house')} /> <span>Custom ERP / in-house</span></label>
            </div>
            <div style={{ marginTop: '10px' }}>
              <input 
                type="text" 
                placeholder="Any other integrations we should know about..." 
                value={formData.otherIntegration}
                onChange={(e) => handleInputChange('otherIntegration', e.target.value)}
              />
            </div>
          </div>

          <div className="question-block">
            <div className="q-num">Q2.4</div>
            <div className="q-text">Do you have an existing equipment/asset database? If so, what format is it in?</div>
            <textarea 
              placeholder="e.g. 12,000 asset records in ServiceTitan, exported as CSV. Includes model, serial, location, install date..."
              value={formData.assetDatabase}
              onChange={(e) => handleInputChange('assetDatabase', e.target.value)}
            ></textarea>
          </div>

          <div className="question-block">
            <div className="q-num">Q2.5</div>
            <div className="q-text">Do you have any compliance, security, or data residency requirements we should be aware of?</div>
            <div className="options-grid cols-2">
              <label className="opt-label"><input type="checkbox" checked={formData.compliance.includes('SOC 2 compliance required')} onChange={() => handleCheckboxChange('compliance', 'SOC 2 compliance required')} /> <span>SOC 2 compliance required</span></label>
              <label className="opt-label"><input type="checkbox" checked={formData.compliance.includes('GDPR / EU data residency')} onChange={() => handleCheckboxChange('compliance', 'GDPR / EU data residency')} /> <span>GDPR / EU data residency</span></label>
              <label className="opt-label"><input type="checkbox" checked={formData.compliance.includes('HIPAA (if healthcare clients)')} onChange={() => handleCheckboxChange('compliance', 'HIPAA (if healthcare clients)')} /> <span>HIPAA (if healthcare clients)</span></label>
              <label className="opt-label"><input type="checkbox" checked={formData.compliance.includes('Government / ITAR contracts')} onChange={() => handleCheckboxChange('compliance', 'Government / ITAR contracts')} /> <span>Government / ITAR contracts</span></label>
              <label className="opt-label"><input type="checkbox" checked={formData.compliance.includes('Single Sign-On (SSO) required')} onChange={() => handleCheckboxChange('compliance', 'Single Sign-On (SSO) required')} /> <span>Single Sign-On (SSO) required</span></label>
              <label className="opt-label"><input type="checkbox" checked={formData.compliance.includes('No specific requirements')} onChange={() => handleCheckboxChange('compliance', 'No specific requirements')} /> <span>No specific requirements</span></label>
            </div>
          </div>

          <div className="question-block">
            <div className="q-num">Q2.6</div>
            <div className="q-text">What is your current biggest technology frustration in day-to-day field operations?</div>
            <textarea 
              style={{ minHeight: '100px' }} 
              placeholder="Be specific the more honest you are here, the better we can solve the root problem..."
              value={formData.techFrustration}
              onChange={(e) => handleInputChange('techFrustration', e.target.value)}
            ></textarea>
          </div>
        </div>

        {/* SECTION 3: CORE FEATURE REQUIREMENTS */}
        <div className="section">
          <div className="section-header">
            <div className="section-num">03</div>
            <div className="section-title">Functional Requirements</div>
            <div className="section-desc"><Cpu className="w-3 h-3 inline mr-2" /> Priority // 10 Elements</div>
          </div>

          <div className="question-block">
            <div className="q-num">Q3.1</div>
            <div className="q-text">Rate the importance of each core module to your business (1 = not needed, 5 = critical).</div>
            <table className="priority-table">
              <thead>
                <tr>
                  <th>Feature Module</th>
                  <th>Priority (1–5)</th>
                </tr>
              </thead>
              <tbody>
                {[
                  "Job creation, assignment & management",
                  "Photo & video capture with documentation",
                  "Equipment dataplate OCR (auto-read nameplates)",
                  "AI job summaries (auto-written from field data)",
                  "Guided workflows with conditional logic",
                  "Offline mode (works without internet)",
                  "Real-time remote video support (VisionLive)",
                  "Knowledge Hub (manuals, training videos)",
                  "Customer-facing reports & transparency",
                  "Analytics dashboard (tech performance, revenue)",
                  "Voice-to-text notes (hands-free documentation)",
                  "In-field quoting / sales tools"
                ].map((item, idx) => (
                  <tr key={idx}>
                    <td>{item}</td>
                    <td>
                      <select 
                        value={formData.priorities[item] || '—'} 
                        onChange={(e) => {
                          const val = e.target.value;
                          setFormData(prev => ({
                            ...prev,
                            priorities: { ...prev.priorities, [item]: val }
                          }));
                        }}
                      >
                        <option>—</option>
                        <option>1 — Not needed</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                        <option>5 — Critical</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="question-block">
            <div className="q-num">Q3.2</div>
            <div className="q-text">Walk us through what a perfect job flow looks like in the new app from a technician's perspective.</div>
            <div className="q-hint">Step by step. What does the tech see first? What do they do? What should happen automatically?</div>
            <textarea 
              style={{ minHeight: '140px' }} 
              placeholder="e.g. Tech opens app → sees today's jobs sorted by priority → taps job → sees customer info and asset history → scans dataplate on arrival → follows workflow steps..."
              value={formData.perfectFlow}
              onChange={(e) => handleInputChange('perfectFlow', e.target.value)}
            ></textarea>
          </div>

          <div className="question-block">
            <div className="q-num">Q3.3</div>
            <div className="q-text">How do you currently handle equipment history? What do you wish you could do that you can't today?</div>
            <textarea 
              placeholder="e.g. We track it manually in ServiceTitan but techs never check it before arriving on site. Wish the app would automatically surface past jobs when they scan a unit..."
              value={formData.historyWish}
              onChange={(e) => handleInputChange('historyWish', e.target.value)}
            ></textarea>
          </div>

          <div className="question-block">
            <div className="q-num">Q3.4</div>
            <div className="q-text">How important is it that customers receive automated transparency reports after a job?</div>
            <div className="options-grid cols-2">
              <label className="opt-label"><input type="radio" name="reports" checked={formData.reportImportance === 'Essential — it\'s a sales differentiator for us'} onChange={() => handleInputChange('reportImportance', 'Essential — it\'s a sales differentiator for us')} /> <span>Essential — it's a sales differentiator for us</span></label>
              <label className="opt-label"><input type="radio" name="reports" checked={formData.reportImportance === 'Important — we want it but don\'t have it'} onChange={() => handleInputChange('reportImportance', 'Important — we want it but don\'t have it')} /> <span>Important — we want it but don't have it</span></label>
              <label className="opt-label"><input type="radio" name="reports" checked={formData.reportImportance === 'Nice to have — not a current priority'} onChange={() => handleInputChange('reportImportance', 'Nice to have — not a current priority')} /> <span>Nice to have — not a current priority</span></label>
              <label className="opt-label"><input type="radio" name="reports" checked={formData.reportImportance === 'Not needed'} onChange={() => handleInputChange('reportImportance', 'Not needed')} /> <span>Not needed</span></label>
            </div>
          </div>

          <div className="question-block">
            <div className="q-num">Q3.5</div>
            <div className="q-text">Do you want the platform to support in-field quoting or upsell prompts?</div>
            <div className="q-hint">e.g. App alerts tech: "This unit is 14 years old prompt customer for replacement quote"</div>
            <div className="options-grid cols-2">
              <label className="opt-label"><input type="radio" name="upsell" checked={formData.upsellImportance === 'Yes — this is a core use case'} onChange={() => handleInputChange('upsellImportance', 'Yes — this is a core use case')} /> <span>Yes — this is a core use case</span></label>
              <label className="opt-label"><input type="radio" name="upsell" checked={formData.upsellImportance === 'Yes — but secondary to documentation'} onChange={() => handleInputChange('upsellImportance', 'Yes — but secondary to documentation')} /> <span>Yes — but secondary to documentation</span></label>
              <label className="opt-label"><input type="radio" name="upsell" checked={formData.upsellImportance === 'Maybe — want to explore it'} onChange={() => handleInputChange('upsellImportance', 'Maybe — want to explore it')} /> <span>Maybe — want to explore it</span></label>
              <label className="opt-label"><input type="radio" name="upsell" checked={formData.upsellImportance === 'No — not a priority'} onChange={() => handleInputChange('upsellImportance', 'No — not a priority')} /> <span>No — not a priority</span></label>
            </div>
          </div>

          <div className="question-block">
            <div className="q-num">Q3.6</div>
            <div className="q-text">What should happen when a technician scans an equipment dataplate?</div>
            <div className="q-hint">Select all outcomes you want the platform to trigger automatically.</div>
            <div className="options-grid cols-2">
              <label className="opt-label"><input type="checkbox" checked={formData.dataplateTriggers.includes('Pull full equipment specs from OEM database')} onChange={() => handleCheckboxChange('dataplateTriggers', 'Pull full equipment specs from OEM database')} /> <span>Pull full equipment specs from OEM database</span></label>
              <label className="opt-label"><input type="checkbox" checked={formData.dataplateTriggers.includes('Show all previous job history on that unit')} onChange={() => handleCheckboxChange('dataplateTriggers', 'Show all previous job history on that unit')} /> <span>Show all previous job history on that unit</span></label>
              <label className="opt-label"><input type="checkbox" checked={formData.dataplateTriggers.includes('Surface relevant service bulletins / recalls')} onChange={() => handleCheckboxChange('dataplateTriggers', 'Surface relevant service bulletins / recalls')} /> <span>Surface relevant service bulletins / recalls</span></label>
              <label className="opt-label"><input type="checkbox" checked={formData.dataplateTriggers.includes('Auto-populate job form fields')} onChange={() => handleCheckboxChange('dataplateTriggers', 'Auto-populate job form fields')} /> <span>Auto-populate job form fields</span></label>
              <label className="opt-label"><input type="checkbox" checked={formData.dataplateTriggers.includes('Calculate equipment age + flag if near end-of-life')} onChange={() => handleCheckboxChange('dataplateTriggers', 'Calculate equipment age + flag if near end-of-life')} /> <span>Calculate equipment age + flag if near end-of-life</span></label>
              <label className="opt-label"><input type="checkbox" checked={formData.dataplateTriggers.includes('Trigger the relevant workflow automatically')} onChange={() => handleCheckboxChange('dataplateTriggers', 'Trigger the relevant workflow automatically')} /> <span>Trigger the relevant workflow automatically</span></label>
              <label className="opt-label"><input type="checkbox" checked={formData.dataplateTriggers.includes('Show recommended parts / repair guides')} onChange={() => handleCheckboxChange('dataplateTriggers', 'Show recommended parts / repair guides')} /> <span>Show recommended parts / repair guides</span></label>
              <label className="opt-label"><input type="checkbox" checked={formData.dataplateTriggers.includes('Alert sales team if replacement opportunity')} onChange={() => handleCheckboxChange('dataplateTriggers', 'Alert sales team if replacement opportunity')} /> <span>Alert sales team if replacement opportunity</span></label>
            </div>
          </div>

          <div className="question-block">
            <div className="q-num">Q3.7</div>
            <div className="q-text">How do you want the AI job summary to work?</div>
            <div className="q-hint">What should it include? Who receives it? How should it be formatted?</div>
            <textarea 
              placeholder="e.g. After job is marked complete, AI should write a 3-paragraph summary covering: what was found, what was done, what's recommended next. Should auto-email to the customer and copy the service manager..."
              value={formData.aiSummaryStyle}
              onChange={(e) => handleInputChange('aiSummaryStyle', e.target.value)}
            ></textarea>
          </div>

          <div className="question-block">
            <div className="q-num">Q3.8</div>
            <div className="q-text">Describe your ideal workflow builder experience for the back office team.</div>
            <div className="q-hint">Who builds workflows? How complex do they get? What frustrates you about how it works today?</div>
            <textarea 
              placeholder="e.g. Service manager builds them usually 10–20 steps with branching based on what the tech finds. Biggest frustration: in XOi you have to open a new workflow for every branch, which confuses techs..."
              value={formData.idealBuilder}
              onChange={(e) => handleInputChange('idealBuilder', e.target.value)}
            ></textarea>
          </div>

          <div className="question-block">
            <div className="q-num">Q3.9</div>
            <div className="q-text">How important is a live remote video support feature (senior tech helping junior tech in real-time)?</div>
            <div className="options-grid cols-2">
              <label className="opt-label"><input type="radio" name="live-video" checked={formData.videoSupport === 'Critical — we\'d use this daily'} onChange={() => handleInputChange('videoSupport', 'Critical — we\'d use this daily')} /> <span>Critical — we'd use this daily</span></label>
              <label className="opt-label"><input type="radio" name="live-video" checked={formData.videoSupport === 'Important — several times per week'} onChange={() => handleInputChange('videoSupport', 'Important — several times per week')} /> <span>Important — several times per week</span></label>
              <label className="opt-label"><input type="radio" name="live-video" checked={formData.videoSupport === 'Occasional — a few times per month'} onChange={() => handleInputChange('videoSupport', 'Occasional — a few times per month')} /> <span>Occasional — a few times per month</span></label>
              <label className="opt-label"><input type="radio" name="live-video" checked={formData.videoSupport === 'Not needed for our workflow'} onChange={() => handleInputChange('videoSupport', 'Not needed for our workflow')} /> <span>Not needed for our workflow</span></label>
            </div>
          </div>

          <div className="question-block">
            <div className="q-num">Q3.10</div>
            <div className="q-text">Do you want the platform to support multiple companies or divisions under one account?</div>
            <div className="q-hint">e.g. Multiple brands, franchise locations, or subsidiary companies managed from one admin portal.</div>
            <div className="options-grid cols-2">
              <label className="opt-label"><input type="radio" name="multiorg" checked={formData.multiOrg === 'Yes — multi-org is required'} onChange={() => handleInputChange('multiOrg', 'Yes — multi-org is required')} /> <span>Yes — multi-org is required</span></label>
              <label className="opt-label"><input type="radio" name="multiorg" checked={formData.multiOrg === 'Yes — likely in the future'} onChange={() => handleInputChange('multiOrg', 'Yes — likely in the future')} /> <span>Yes — likely in the future</span></label>
              <label className="opt-label"><input type="radio" name="multiorg" checked={formData.multiOrg === 'No — single company only'} onChange={() => handleInputChange('multiOrg', 'No — single company only')} /> <span>No — single company only</span></label>
              <label className="opt-label"><input type="radio" name="multiorg" checked={formData.multiOrg === 'Not sure'} onChange={() => handleInputChange('multiOrg', 'Not sure')} /> <span>Not sure</span></label>
            </div>
          </div>
        </div>

        {/* SECTION 4: INNOVATION */}
        <div className="section">
          <div className="section-header">
            <div className="section-num">04</div>
            <div className="section-title">Upgrades & Innovation</div>
            <div className="section-desc"><Zap className="w-3 h-3 inline mr-2" /> Innovation // 8 Elements</div>
          </div>

          <div className="question-block">
            <div className="q-num">Q4.1</div>
            <div className="q-text">What are the top 3 things you would change or fix about XOi (or your current tool) if you could?</div>
            <textarea 
              style={{ minHeight: '120px' }} 
              placeholder="1. Photo capture crashes constantly...&#10;2. Workflow branching...&#10;3. No way to see photo dates..."
              value={formData.topFixes}
              onChange={(e) => handleInputChange('topFixes', e.target.value)}
            ></textarea>
          </div>

          <div className="question-block">
            <div className="q-num">Q4.2</div>
            <div className="q-text">Are there features you've always wanted that no current tool offers?</div>
            <textarea 
              style={{ minHeight: '120px' }} 
              placeholder="e.g. I've always wanted the app to automatically generate a proposal PDF..."
              value={formData.dreamFeatures}
              onChange={(e) => handleInputChange('dreamFeatures', e.target.value)}
            ></textarea>
          </div>

          <div className="question-block">
            <div className="q-num">Q4.3</div>
            <div className="q-text">Would you like AI to proactively flag revenue opportunities during a job?</div>
            <div className="options-grid cols-2">
              <label className="opt-label"><input type="radio" name="ai-flags" checked={formData.aiRevenueOpps === 'Yes — show alerts to tech'} onChange={() => handleInputChange('aiRevenueOpps', 'Yes — show alerts to tech')} /> <span>Yes — show alerts to tech</span></label>
              <label className="opt-label"><input type="radio" name="ai-flags" checked={formData.aiRevenueOpps === 'Yes — alert manager'} onChange={() => handleInputChange('aiRevenueOpps', 'Yes — alert manager')} /> <span>Yes — alert manager</span></label>
              <label className="opt-label"><input type="radio" name="ai-flags" checked={formData.aiRevenueOpps === 'Yes — alert both'} onChange={() => handleInputChange('aiRevenueOpps', 'Yes — alert both')} /> <span>Yes — alert both</span></label>
              <label className="opt-label"><input type="radio" name="ai-flags" checked={formData.aiRevenueOpps === 'No'} onChange={() => handleInputChange('aiRevenueOpps', 'No')} /> <span>No</span></label>
            </div>
          </div>
        </div>

        {/* SECTION 6: SUCCESS METRICS */}
        <div className="section">
          <div className="section-header">
            <div className="section-num">05</div>
            <div className="section-title">Success Metrics</div>
            <div className="section-desc"><BarChart4 className="w-3 h-3 inline mr-2" /> Outcomes // 4 Elements</div>
          </div>

          <div className="question-block">
            <div className="q-num">Q6.3</div>
            <div className="q-text">On a scale of 1–10, how resistant do you expect your technicians to be to adopting a new app?</div>
            <div className="scale-row" id="scale-resistance">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                <button 
                  key={n} 
                  className={`scale-btn ${formData.resistanceLevel === n ? 'active' : ''}`}
                  onClick={() => selectScale('scale-resistance', n)}
                >{n}</button>
              ))}
            </div>
            <div className="scale-labels"><span>No resistance</span><span>Very resistant</span></div>
            <div style={{ marginTop: '14px' }}>
              <textarea 
                placeholder="What do you think will drive resistance..."
                value={formData.resistanceDrivers}
                onChange={(e) => handleInputChange('resistanceDrivers', e.target.value)}
              ></textarea>
            </div>
          </div>
        </div>

        {/* SUBMIT */}
        <div className="submit-section">
          <h3>Submit Your Questionnaire</h3>
          <p>Once submitted, our team will review your responses within 2 business days and schedule a discovery call.</p>
          <div className="submit-grid">
            <input type="text" placeholder="Your full name" value={formData.contactName} onChange={(e) => handleInputChange('contactName', e.target.value)} />
            <input type="text" placeholder="Company name" value={formData.contactCompany} onChange={(e) => handleInputChange('contactCompany', e.target.value)} />
            <input type="email" placeholder="Email address" value={formData.contactEmail} onChange={(e) => handleInputChange('contactEmail', e.target.value)} />
            <input type="text" placeholder="Phone number (optional)" value={formData.contactPhone} onChange={(e) => handleInputChange('contactPhone', e.target.value)} />
          </div>
          <button 
            className="submit-btn" 
            onClick={handleSubmit}
            disabled={submitting}
            style={{ opacity: submitting ? 0.7 : 1, cursor: submitting ? 'not-allowed' : 'pointer' }}
          >
            <Terminal className="w-4 h-4 mr-2" /> 
            {submitting ? 'TRANSMITTING...' : 'Execute Transmission'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default XOIClient;
