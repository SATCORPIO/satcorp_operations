import React, { useEffect } from 'react';
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
  useEffect(() => {
    // Stagger section animations
    const sections = document.querySelectorAll('.section');
    sections.forEach((s, i) => {
      s.style.animationDelay = (i * 0.05) + 's';
    });
  }, []);

  const selectScale = (id, e) => {
    const btn = e.currentTarget;
    const container = document.getElementById(id);
    if (container) {
      container.querySelectorAll('.scale-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    }
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    alert('Thank you — your questionnaire has been submitted. We\'ll be in touch within 2 business days.');
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
          padding-bottom: 48px;
          margin-bottom: 56px;
          border-bottom: 1px solid var(--border);
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 24px;
          position: relative;
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
              <div><strong>Prepared by</strong> · SATCORP</div>
              <div><strong>Date</strong> · 2026</div>
              <div><strong>Confidentiality</strong> · Private</div>
            </div>
          </div>
        </div>

        {/* INTRO */}
        <div className="intro">
          <p>Thank you for considering this engagement. This questionnaire is designed to give us a complete picture of your business operations, technical environment, and product vision before we begin development.</p>
          <p>Your answers directly shape the architecture, feature prioritisation, and timeline of the platform. There are no wrong answers — <strong>the more detail you provide, the more precisely we can build what you actually need.</strong> Please complete all sections at your own pace. This typically takes 25–40 minutes.</p>
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
            <textarea placeholder="e.g. Apex HVAC Services — commercial HVAC installation, maintenance, and repair across the Southeast..."></textarea>
          </div>

          <div className="question-block">
            <div className="q-num">Q1.2</div>
            <div className="q-text">How many field technicians do you currently employ or manage?</div>
            <div className="options-grid cols-3">
              <label className="opt-label"><input type="radio" name="tech-count" /> <span>1–10 techs</span></label>
              <label className="opt-label"><input type="radio" name="tech-count" /> <span>11–50 techs</span></label>
              <label className="opt-label"><input type="radio" name="tech-count" /> <span>51–150 techs</span></label>
              <label className="opt-label"><input type="radio" name="tech-count" /> <span>151–500 techs</span></label>
              <label className="opt-label"><input type="radio" name="tech-count" /> <span>500+ techs</span></label>
              <label className="opt-label"><input type="radio" name="tech-count" /> <span>Multiple orgs</span></label>
            </div>
          </div>

          <div className="question-block">
            <div className="q-num">Q1.3</div>
            <div className="q-text">How many jobs does your team complete per month on average?</div>
            <input type="number" placeholder="e.g. 400" />
          </div>

          <div className="question-block">
            <div className="q-num">Q1.4</div>
            <div className="q-text">Describe your current job workflow — from dispatch to job completion to invoicing.</div>
            <div className="q-hint">Walk us through what happens step by step today, even if the process is manual or messy.</div>
            <textarea style={{ minHeight: '120px' }} placeholder="e.g. Dispatcher receives call → enters work order in ServiceTitan → assigns to tech via app → tech travels, does job, takes photos..."></textarea>
          </div>

          <div className="question-block">
            <div className="q-num">Q1.5</div>
            <div className="q-text">What types of equipment or assets do your technicians most commonly service?</div>
            <div className="q-hint">List makes, models, or categories if possible.</div>
            <textarea placeholder="e.g. Carrier rooftop units, Trane chillers, Daikin VRF systems, commercial boilers..."></textarea>
          </div>

          <div className="question-block">
            <div className="q-num">Q1.6</div>
            <div className="q-text">Do your technicians work in areas with unreliable internet connectivity?</div>
            <div className="options-grid cols-2">
              <label className="opt-label"><input type="radio" name="offline" /> <span>Yes — frequently (rooftops, basements, rural)</span></label>
              <label className="opt-label"><input type="radio" name="offline" /> <span>Sometimes — occasional dead zones</span></label>
              <label className="opt-label"><input type="radio" name="offline" /> <span>Rarely — mostly urban/connected</span></label>
              <label className="opt-label"><input type="radio" name="offline" /> <span>No — always connected</span></label>
            </div>
          </div>

          <div className="question-block">
            <div className="q-num">Q1.7</div>
            <div className="q-text">What devices do your technicians currently use in the field?</div>
            <div className="options-grid cols-2">
              <label className="opt-label"><input type="checkbox" name="devices" /> <span>iPhone</span></label>
              <label className="opt-label"><input type="checkbox" name="devices" /> <span>Android phone</span></label>
              <label className="opt-label"><input type="checkbox" name="devices" /> <span>iPad / tablet</span></label>
              <label className="opt-label"><input type="checkbox" name="devices" /> <span>Android tablet</span></label>
              <label className="opt-label"><input type="checkbox" name="devices" /> <span>Rugged device (Zebra, etc.)</span></label>
              <label className="opt-label"><input type="checkbox" name="devices" /> <span>Laptop / Surface</span></label>
            </div>
          </div>

          <div className="question-block">
            <div className="q-num">Q1.8</div>
            <div className="q-text">What is your approximate annual revenue from field service operations?</div>
            <div className="options-grid cols-3">
              <label className="opt-label"><input type="radio" name="revenue" /> <span>Under $1M</span></label>
              <label className="opt-label"><input type="radio" name="revenue" /> <span>$1M–$5M</span></label>
              <label className="opt-label"><input type="radio" name="revenue" /> <span>$5M–$20M</span></label>
              <label className="opt-label"><input type="radio" name="revenue" /> <span>$20M–$100M</span></label>
              <label className="opt-label"><input type="radio" name="revenue" /> <span>$100M+</span></label>
              <label className="opt-label"><input type="radio" name="revenue" /> <span>Prefer not to say</span></label>
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
              <label className="opt-label"><input type="checkbox" /> <span>ServiceTitan</span></label>
              <label className="opt-label"><input type="checkbox" /> <span>Jobber</span></label>
              <label className="opt-label"><input type="checkbox" /> <span>FieldEdge</span></label>
              <label className="opt-label"><input type="checkbox" /> <span>ServiceMax</span></label>
              <label className="opt-label"><input type="checkbox" /> <span>Salesforce Field Service</span></label>
              <label className="opt-label"><input type="checkbox" /> <span>Microsoft Dynamics FSM</span></label>
              <label className="opt-label"><input type="checkbox" /> <span>Custom / in-house</span></label>
              <label className="opt-label"><input type="checkbox" /> <span>None / spreadsheets</span></label>
            </div>
            <div style={{ marginTop: '10px' }}><input type="text" placeholder="Other FSM system not listed..." /></div>
          </div>

          <div className="question-block">
            <div className="q-num">Q2.2</div>
            <div className="q-text">Are you currently using XOi or any similar field intelligence tool?</div>
            <div className="options-grid cols-2">
              <label className="opt-label"><input type="radio" name="current-tool" /> <span>Yes — currently using XOi</span></label>
              <label className="opt-label"><input type="radio" name="current-tool" /> <span>Yes — using a competitor</span></label>
              <label className="opt-label"><input type="radio" name="current-tool" /> <span>No — evaluating options</span></label>
              <label className="opt-label"><input type="radio" name="current-tool" /> <span>No — this is new territory</span></label>
            </div>
            <div style={{ marginTop: '10px' }}>
              <textarea placeholder="If yes — what do you like and dislike about your current tool?"></textarea>
            </div>
          </div>

          <div className="question-block">
            <div className="q-num">Q2.3</div>
            <div className="q-text">Which systems would the new platform need to integrate with?</div>
            <div className="q-hint">Check all that apply — we'll plan integration architecture around your stack.</div>
            <div className="options-grid cols-2">
              <label className="opt-label"><input type="checkbox" /> <span>ServiceTitan (jobs, dispatch)</span></label>
              <label className="opt-label"><input type="checkbox" /> <span>QuickBooks / Xero (accounting)</span></label>
              <label className="opt-label"><input type="checkbox" /> <span>Salesforce CRM</span></label>
              <label className="opt-label"><input type="checkbox" /> <span>HubSpot CRM</span></label>
              <label className="opt-label"><input type="checkbox" /> <span>Stripe / billing platform</span></label>
              <label className="opt-label"><input type="checkbox" /> <span>DocuSign / e-signature</span></label>
              <label className="opt-label"><input type="checkbox" /> <span>Slack / Teams (notifications)</span></label>
              <label className="opt-label"><input type="checkbox" /> <span>Custom ERP / in-house</span></label>
            </div>
            <div style={{ marginTop: '10px' }}><input type="text" placeholder="Any other integrations we should know about..." /></div>
          </div>

          <div className="question-block">
            <div className="q-num">Q2.4</div>
            <div className="q-text">Do you have an existing equipment/asset database? If so, what format is it in?</div>
            <textarea placeholder="e.g. 12,000 asset records in ServiceTitan, exported as CSV. Includes model, serial, location, install date..."></textarea>
          </div>

          <div className="question-block">
            <div className="q-num">Q2.5</div>
            <div className="q-text">Do you have any compliance, security, or data residency requirements we should be aware of?</div>
            <div className="options-grid cols-2">
              <label className="opt-label"><input type="checkbox" /> <span>SOC 2 compliance required</span></label>
              <label className="opt-label"><input type="checkbox" /> <span>GDPR / EU data residency</span></label>
              <label className="opt-label"><input type="checkbox" /> <span>HIPAA (if healthcare clients)</span></label>
              <label className="opt-label"><input type="checkbox" /> <span>Government / ITAR contracts</span></label>
              <label className="opt-label"><input type="checkbox" /> <span>Single Sign-On (SSO) required</span></label>
              <label className="opt-label"><input type="checkbox" /> <span>No specific requirements</span></label>
            </div>
          </div>

          <div className="question-block">
            <div className="q-num">Q2.6</div>
            <div className="q-text">What is your current biggest technology frustration in day-to-day field operations?</div>
            <textarea style={{ minHeight: '100px' }} placeholder="Be specific — the more honest you are here, the better we can solve the root problem..."></textarea>
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
                      <select defaultValue="—">
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
            <div className="q-text">Walk us through what a perfect job flow looks like in the new app — from a technician's perspective.</div>
            <div className="q-hint">Step by step. What does the tech see first? What do they do? What should happen automatically?</div>
            <textarea style={{ minHeight: '140px' }} placeholder="e.g. Tech opens app → sees today's jobs sorted by priority → taps job → sees customer info and asset history → scans dataplate on arrival → follows workflow steps..."></textarea>
          </div>

          <div className="question-block">
            <div className="q-num">Q3.3</div>
            <div className="q-text">How do you currently handle equipment history? What do you wish you could do that you can't today?</div>
            <textarea placeholder="e.g. We track it manually in ServiceTitan but techs never check it before arriving on site. Wish the app would automatically surface past jobs when they scan a unit..."></textarea>
          </div>

          <div className="question-block">
            <div className="q-num">Q3.4</div>
            <div className="q-text">How important is it that customers receive automated transparency reports after a job?</div>
            <div className="options-grid cols-2">
              <label className="opt-label"><input type="radio" name="reports" /> <span>Essential — it's a sales differentiator for us</span></label>
              <label className="opt-label"><input type="radio" name="reports" /> <span>Important — we want it but don't have it</span></label>
              <label className="opt-label"><input type="radio" name="reports" /> <span>Nice to have — not a current priority</span></label>
              <label className="opt-label"><input type="radio" name="reports" /> <span>Not needed</span></label>
            </div>
          </div>

          <div className="question-block">
            <div className="q-num">Q3.5</div>
            <div className="q-text">Do you want the platform to support in-field quoting or upsell prompts?</div>
            <div className="q-hint">e.g. App alerts tech: "This unit is 14 years old — prompt customer for replacement quote"</div>
            <div className="options-grid cols-2">
              <label className="opt-label"><input type="radio" name="upsell" /> <span>Yes — this is a core use case</span></label>
              <label className="opt-label"><input type="radio" name="upsell" /> <span>Yes — but secondary to documentation</span></label>
              <label className="opt-label"><input type="radio" name="upsell" /> <span>Maybe — want to explore it</span></label>
              <label className="opt-label"><input type="radio" name="upsell" /> <span>No — not a priority</span></label>
            </div>
          </div>

          <div className="question-block">
            <div className="q-num">Q3.6</div>
            <div className="q-text">What should happen when a technician scans an equipment dataplate?</div>
            <div className="q-hint">Select all outcomes you want the platform to trigger automatically.</div>
            <div className="options-grid cols-2">
              <label className="opt-label"><input type="checkbox" /> <span>Pull full equipment specs from OEM database</span></label>
              <label className="opt-label"><input type="checkbox" /> <span>Show all previous job history on that unit</span></label>
              <label className="opt-label"><input type="checkbox" /> <span>Surface relevant service bulletins / recalls</span></label>
              <label className="opt-label"><input type="checkbox" /> <span>Auto-populate job form fields</span></label>
              <label className="opt-label"><input type="checkbox" /> <span>Calculate equipment age + flag if near end-of-life</span></label>
              <label className="opt-label"><input type="checkbox" /> <span>Trigger the relevant workflow automatically</span></label>
              <label className="opt-label"><input type="checkbox" /> <span>Show recommended parts / repair guides</span></label>
              <label className="opt-label"><input type="checkbox" /> <span>Alert sales team if replacement opportunity</span></label>
            </div>
          </div>

          <div className="question-block">
            <div className="q-num">Q3.7</div>
            <div className="q-text">How do you want the AI job summary to work?</div>
            <div className="q-hint">What should it include? Who receives it? How should it be formatted?</div>
            <textarea placeholder="e.g. After job is marked complete, AI should write a 3-paragraph summary covering: what was found, what was done, what's recommended next. Should auto-email to the customer and copy the service manager..."></textarea>
          </div>

          <div className="question-block">
            <div className="q-num">Q3.8</div>
            <div className="q-text">Describe your ideal workflow builder experience for the back office team.</div>
            <div className="q-hint">Who builds workflows? How complex do they get? What frustrates you about how it works today?</div>
            <textarea placeholder="e.g. Service manager builds them — usually 10–20 steps with branching based on what the tech finds. Biggest frustration: in XOi you have to open a new workflow for every branch, which confuses techs..."></textarea>
          </div>

          <div className="question-block">
            <div className="q-num">Q3.9</div>
            <div className="q-text">How important is a live remote video support feature (senior tech helping junior tech in real-time)?</div>
            <div className="options-grid cols-2">
              <label className="opt-label"><input type="radio" name="live-video" /> <span>Critical — we'd use this daily</span></label>
              <label className="opt-label"><input type="radio" name="live-video" /> <span>Important — several times per week</span></label>
              <label className="opt-label"><input type="radio" name="live-video" /> <span>Occasional — a few times per month</span></label>
              <label className="opt-label"><input type="radio" name="live-video" /> <span>Not needed for our workflow</span></label>
            </div>
          </div>

          <div className="question-block">
            <div className="q-num">Q3.10</div>
            <div className="q-text">Do you want the platform to support multiple companies or divisions under one account?</div>
            <div className="q-hint">e.g. Multiple brands, franchise locations, or subsidiary companies managed from one admin portal.</div>
            <div className="options-grid cols-2">
              <label className="opt-label"><input type="radio" name="multiorg" /> <span>Yes — multi-org is required</span></label>
              <label className="opt-label"><input type="radio" name="multiorg" /> <span>Yes — likely in the future</span></label>
              <label className="opt-label"><input type="radio" name="multiorg" /> <span>No — single company only</span></label>
              <label className="opt-label"><input type="radio" name="multiorg" /> <span>Not sure</span></label>
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
            <textarea style={{ minHeight: '120px' }} placeholder="1. Photo capture crashes constantly...&#10;2. Workflow branching...&#10;3. No way to see photo dates..."></textarea>
          </div>

          <div className="question-block">
            <div className="q-num">Q4.2</div>
            <div className="q-text">Are there features you've always wanted that no current tool offers?</div>
            <textarea style={{ minHeight: '120px' }} placeholder="e.g. I've always wanted the app to automatically generate a proposal PDF..."></textarea>
          </div>

          <div className="question-block">
            <div className="q-num">Q4.3</div>
            <div className="q-text">Would you like AI to proactively flag revenue opportunities during a job?</div>
            <div className="options-grid cols-2">
              <label className="opt-label"><input type="radio" name="ai-flags" /> <span>Yes — show alerts to tech</span></label>
              <label className="opt-label"><input type="radio" name="ai-flags" /> <span>Yes — alert manager</span></label>
              <label className="opt-label"><input type="radio" name="ai-flags" /> <span>Yes — alert both</span></label>
              <label className="opt-label"><input type="radio" name="ai-flags" /> <span>No</span></label>
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
                <button key={n} className="scale-btn" onClick={(e) => selectScale('scale-resistance', e)}>{n}</button>
              ))}
            </div>
            <div className="scale-labels"><span>No resistance</span><span>Very resistant</span></div>
            <div style={{ marginTop: '14px' }}><textarea placeholder="What do you think will drive resistance..."></textarea></div>
          </div>
        </div>

        {/* SUBMIT */}
        <div className="submit-section">
          <h3>Submit Your Questionnaire</h3>
          <p>Once submitted, our team will review your responses within 2 business days and schedule a discovery call.</p>
          <div className="submit-grid">
            <input type="text" placeholder="Your full name" />
            <input type="text" placeholder="Company name" />
            <input type="email" placeholder="Email address" />
            <input type="text" placeholder="Phone number (optional)" />
          </div>
          <button className="submit-btn" onClick={handleSubmit}><Terminal className="w-4 h-4 mr-2" /> Execute Transmission</button>
        </div>
      </div>
    </div>
  );
};

export default XOIClient;
