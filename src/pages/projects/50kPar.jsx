import { useState, useEffect, useRef, useCallback } from "react";

/* ════════════════════════════════════════════════════════════════════════════
   DUAL 50kW GENSET — PARALLEL OPERATION ENGINEERING REFERENCE
   40-year senior engineer / master electrician perspective
   Covers: Synchronization · Load Sharing · Protection · Neutral Bonding
           Single-Line Diagram · Step Procedures · Common Faults
   ════════════════════════════════════════════════════════════════════════════ */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;400;500;600;700&family=JetBrains+Mono:ital,wght@0,400;0,700;1,400&display=swap');
:root {
  --bg0:#06090d; --bg1:#0b1219; --bg2:#0f1a26; --bg3:#142030;
  --border:#1a2e44; --border2:#203850;
  --g1:#e8a020; --g1b:#ffcc60;       /* Gen 1 — amber */
  --g2:#20c8d0; --g2b:#60e8f0;       /* Gen 2 — cyan  */
  --bus:#3090e0; --busb:#60b8ff;     /* Bus  — blue   */
  --green:#28d860; --green2:#18a840;
  --red:#f03030; --red2:#ff7070;
  --yellow:#e0d020; --yb:#fff060;
  --purple:#a040e0; --purpleb:#c070ff;
  --text-hi:#cce4ff; --text-md:#5888a8; --text-lo:#2a4860;
  --mono:'JetBrains Mono',monospace; --sans:'Rajdhani',sans-serif;
}
*{box-sizing:border-box;margin:0;padding:0;}
.app{font-family:var(--sans);background:var(--bg0);color:var(--text-hi);min-height:100vh;}

/* HDR */
.hdr{display:flex;align-items:center;justify-content:space-between;padding:10px 22px;background:var(--bg1);border-bottom:2px solid var(--g1);flex-wrap:wrap;gap:8px;}
.hdr-l{display:flex;align-items:center;gap:14px;}
.tag{font-family:var(--mono);font-size:9px;letter-spacing:2px;padding:4px 12px;font-weight:700;}
.tag-g1{background:var(--g1);color:#000;}
.tag-g2{background:var(--g2);color:#000;}
.tag-bus{background:var(--bus);color:#fff;}
.hdr h1{font-size:20px;font-weight:700;letter-spacing:3px;text-transform:uppercase;}
.hdr-sub{font-family:var(--mono);font-size:9px;color:var(--text-md);letter-spacing:1px;margin-top:2px;}
.sys-status{display:flex;gap:16px;align-items:center;}
.ss{display:flex;flex-direction:column;align-items:center;gap:2px;}
.ss-dot{width:10px;height:10px;border-radius:50%;}
.ss-dot.on{animation:pulse 1.5s ease-in-out infinite;}
@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.6;transform:scale(.85)}}
.ss-lbl{font-family:var(--mono);font-size:8px;letter-spacing:1.5px;text-transform:uppercase;}

/* TABS */
.tabs{display:flex;background:var(--bg1);border-bottom:1px solid var(--border);padding:0 22px;overflow-x:auto;gap:0;}
.tab{padding:11px 20px;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;cursor:pointer;color:var(--text-lo);border-bottom:2px solid transparent;transition:all .15s;background:none;border-top:none;border-left:none;border-right:none;font-family:var(--sans);white-space:nowrap;}
.tab:hover{color:var(--text-md);}
.tab.active{color:var(--g1);border-bottom-color:var(--g1);}

.body{padding:16px;display:flex;flex-direction:column;gap:14px;}
.row{display:flex;gap:14px;flex-wrap:wrap;}
.col{display:flex;flex-direction:column;gap:14px;}

/* PANEL */
.panel{background:var(--bg2);border:1px solid var(--border);position:relative;overflow:hidden;}
.panel[data-label]::before{content:attr(data-label);position:absolute;top:0;left:0;font-family:var(--mono);font-size:8px;letter-spacing:1.5px;padding:3px 10px;background:var(--border);color:var(--text-md);text-transform:uppercase;z-index:2;}
.pi{padding:28px 16px 16px;}
.pi.nl{padding:16px;}
.panel.g1b{border-top:2px solid var(--g1);}
.panel.g2b{border-top:2px solid var(--g2);}
.panel.busb{border-top:2px solid var(--bus);}
.panel.rb{border-top:2px solid var(--red);}
.panel.gb{border-top:2px solid var(--green);}
.panel.pb{border-top:2px solid var(--purple);}

/* SYNC METER */
.sync-field{display:flex;gap:8px;flex-wrap:wrap;margin-top:8px;}
.sync-cell{background:var(--bg1);border:1px solid var(--border);padding:8px 12px;flex:1;min-width:120px;}
.sync-cell-k{font-family:var(--mono);font-size:8px;letter-spacing:1.5px;color:var(--text-md);text-transform:uppercase;margin-bottom:4px;}
.sync-cell-v{font-family:var(--mono);font-size:18px;font-weight:700;line-height:1;}
.sync-cell.ok .sync-cell-v{color:var(--green);}
.sync-cell.warn .sync-cell-v{color:var(--yellow);}
.sync-cell.bad .sync-cell-v{color:var(--red);}
.sync-bar{height:5px;background:var(--bg0);margin-top:5px;overflow:hidden;}
.sync-bar-fill{height:100%;transition:width .3s,background .3s;}

/* MACHINE BOX */
.mbox{background:var(--bg1);border:2px solid;padding:12px 16px;position:relative;}
.mbox.g1{border-color:var(--g1);}
.mbox.g2{border-color:var(--g2);}
.mbox-hdr{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;}
.mbox-title{font-size:14px;font-weight:700;letter-spacing:2px;text-transform:uppercase;}
.mbox.g1 .mbox-title{color:var(--g1b);}
.mbox.g2 .mbox-title{color:var(--g2b);}
.mbox-stat{font-family:var(--mono);font-size:8px;letter-spacing:2px;padding:2px 8px;}
.mbox-stat.run{background:#082010;color:var(--green);border:1px solid var(--green2);}
.mbox-stat.stop{background:#1a0808;color:var(--red);border:1px solid var(--red);}
.mbox-stat.sync{background:#082018;color:var(--g2);border:1px solid var(--g2);}

/* KV grid */
.kv{display:grid;grid-template-columns:1fr 1fr;gap:4px 12px;font-size:12px;}
.kv-k{color:var(--text-md);font-family:var(--mono);font-size:9px;letter-spacing:.5px;}
.kv-v{color:var(--g1b);font-family:var(--mono);font-size:11px;font-weight:700;text-align:right;}

/* SPEC TABLE */
.stbl{width:100%;border-collapse:collapse;font-size:13px;}
.stbl td{padding:5px 10px;border-bottom:1px solid var(--border);}
.stbl td:first-child{color:var(--text-md);font-family:var(--mono);font-size:9px;letter-spacing:.5px;text-transform:uppercase;width:48%;}
.stbl td:last-child{color:var(--g1b);font-weight:700;text-align:right;}
.stbl tr:last-child td{border-bottom:none;}
.stbl tr.g2c td:last-child{color:var(--g2b);}
.stbl tr.rc td:last-child{color:var(--red2);}
.stbl tr.gc td:last-child{color:var(--green);}
.stbl tr.hdr-row td{color:var(--text-hi)!important;font-size:10px!important;font-weight:700;background:var(--bg3);letter-spacing:2px!important;}

/* PROC STEPS */
.step{display:flex;gap:12px;align-items:flex-start;padding:8px 0;border-bottom:1px solid var(--border);}
.step:last-child{border-bottom:none;}
.step-n{width:24px;height:24px;border-radius:1px;display:flex;align-items:center;justify-content:center;font-family:var(--mono);font-size:10px;font-weight:700;flex-shrink:0;}
.step-n.g1c{background:var(--g1);color:#000;}
.step-n.g2c{background:var(--g2);color:#000;}
.step-n.rc{background:var(--red);color:#fff;}
.step-n.gc{background:var(--green2);color:#000;}
.step-body{}
.step-title{font-size:14px;font-weight:700;}
.step-sub{font-family:var(--mono);font-size:9px;color:var(--text-md);margin-top:2px;line-height:1.5;}
.step-warn{font-family:var(--mono);font-size:9px;color:var(--red2);margin-top:3px;}

/* FAULT TABLE */
.fault{display:flex;align-items:center;gap:10px;padding:7px 12px;border-bottom:1px solid var(--border);font-size:13px;}
.fault:last-child{border-bottom:none;}
.fdot{width:8px;height:8px;border-radius:50%;flex-shrink:0;}
.fansi{font-family:var(--mono);font-size:9px;padding:2px 6px;border:1px solid;font-weight:700;min-width:52px;text-align:center;}
.fbadge{font-family:var(--mono);font-size:9px;padding:2px 7px;font-weight:700;letter-spacing:1px;min-width:70px;text-align:center;}

/* SEC HDR */
.sh{font-family:var(--mono);font-size:8px;letter-spacing:3px;color:var(--text-md);text-transform:uppercase;margin-bottom:10px;display:flex;align-items:center;gap:8px;}
.sh::after{content:'';flex:1;height:1px;background:var(--border);}

/* NEUTRAL ZONE */
.neutral-warn{background:#0a0608;border:2px solid var(--red);padding:12px 16px;margin-bottom:12px;}
.neutral-warn-hdr{color:var(--red2);font-family:var(--mono);font-size:10px;font-weight:700;letter-spacing:2px;margin-bottom:8px;}

/* LOAD SHARING */
.bar-pair{display:flex;gap:8px;align-items:center;margin:6px 0;}
.bar-label{font-family:var(--mono);font-size:9px;color:var(--text-md);width:60px;text-align:right;}
.bar-track{flex:1;height:14px;background:var(--bg0);position:relative;overflow:hidden;}
.bar-fill{height:100%;transition:width .4s ease;}
.bar-val{font-family:var(--mono);font-size:10px;font-weight:700;width:55px;text-align:left;}

/* TOGGLE */
.toggle-row{display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap;}
.tog{padding:7px 16px;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;cursor:pointer;font-family:var(--sans);border:1px solid var(--border);background:var(--bg1);color:var(--text-lo);transition:all .15s;}
.tog:hover{color:var(--text-md);}
.tog.active{background:var(--bg3);border-color:var(--g1);color:var(--g1b);}

/* CALLOUT */
.callout{background:var(--bg1);border-left:3px solid;padding:10px 14px;margin:8px 0;font-family:var(--mono);font-size:10px;line-height:1.6;}
.callout.warn{border-color:var(--yellow);color:var(--yb);}
.callout.crit{border-color:var(--red);color:var(--red2);}
.callout.info{border-color:var(--bus);color:var(--busb);}
.callout.ok{border-color:var(--green);color:var(--green);}
`;

/* ══════════════════════════════════════════
   SYNCHRONOSCOPE (live animated)
   ══════════════════════════════════════════ */
function Synchronoscope({ angleDeg, rateDegPerSec, inSync }) {
  const canvasRef = useRef(null);
  const angleRef = useRef(angleDeg);
  const frameRef = useRef(null);

  useEffect(() => { angleRef.current = angleDeg; }, [angleDeg]);

  useEffect(() => {
    const c = canvasRef.current; if (!c) return;
    const ctx = c.getContext("2d");
    const W = c.width, H = c.height, cx = W / 2, cy = H / 2, r = W / 2 - 8;
    let t = 0;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      // Background
      ctx.fillStyle = "#060a0e"; ctx.fillRect(0, 0, W, H);
      // Bezel rings
      ctx.strokeStyle = "#1a3050"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(cx, cy, r + 4, 0, Math.PI * 2); ctx.stroke();
      // Zone arcs — red left, green center (sync zone), red right
      const syncZone = 15 * Math.PI / 180; // ±15° = sync zone
      // Green sync zone (around 12 o'clock = -π/2)
      ctx.strokeStyle = "#083018"; ctx.lineWidth = 14;
      ctx.beginPath(); ctx.arc(cx, cy, r - 4, -Math.PI / 2 - syncZone, -Math.PI / 2 + syncZone); ctx.stroke();
      ctx.strokeStyle = "#0a1820"; ctx.lineWidth = 14;
      ctx.beginPath(); ctx.arc(cx, cy, r - 4, -Math.PI / 2 + syncZone, -Math.PI / 2 - syncZone + 2 * Math.PI); ctx.stroke();
      // Tick marks
      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
        const x1 = cx + (r - 10) * Math.cos(a), y1 = cy + (r - 10) * Math.sin(a);
        const x2 = cx + (r - 2) * Math.cos(a), y2 = cy + (r - 2) * Math.sin(a);
        ctx.strokeStyle = i === 0 ? "#28d860" : "#1a3050";
        ctx.lineWidth = i === 0 ? 2.5 : 1;
        ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      }
      // 12 o'clock label
      ctx.fillStyle = "#28d860"; ctx.font = "bold 9px 'JetBrains Mono'";
      ctx.textAlign = "center"; ctx.fillText("SYNC", cx, cy - r + 22);
      // CW / CCW labels
      ctx.fillStyle = "#1a3050"; ctx.font = "7px 'JetBrains Mono'";
      ctx.fillText("FAST →", cx + r - 24, cy + 10);
      ctx.fillText("← SLOW", cx - r + 24, cy + 10);
      // Advance angle
      angleRef.current = (angleRef.current + rateDegPerSec * 0.016) % 360;
      const a = (angleRef.current - 90) * Math.PI / 180;
      // Needle shadow
      ctx.shadowColor = inSync ? "#28d860" : "#e8a020";
      ctx.shadowBlur = inSync ? 15 : 6;
      // Needle
      const nx = cx + (r - 12) * Math.cos(a), ny = cy + (r - 12) * Math.sin(a);
      ctx.strokeStyle = inSync ? "#28d860" : "#e8a020";
      ctx.lineWidth = 2.5; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(nx, ny); ctx.stroke();
      ctx.shadowBlur = 0;
      // Hub
      ctx.fillStyle = inSync ? "#28d860" : "#e8a020";
      ctx.beginPath(); ctx.arc(cx, cy, 5, 0, Math.PI * 2); ctx.fill();
      // Status
      const nearSync = Math.abs(((angleRef.current + 180) % 360) - 180) < 15;
      if (nearSync) {
        ctx.fillStyle = "#28d86080"; ctx.fillRect(0, H - 18, W, 18);
        ctx.fillStyle = "#28d860"; ctx.font = "bold 8px 'JetBrains Mono'";
        ctx.textAlign = "center"; ctx.fillText("◀ CLOSE BREAKER ▶", cx, H - 5);
      }
      t++; frameRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(frameRef.current);
  }, [rateDegPerSec, inSync]);

  return <canvas ref={canvasRef} width={170} height={170} style={{ display: "block" }} />;
}

/* ══════════════════════════════════════════
   SINGLE-LINE DIAGRAM (animated SVG)
   ══════════════════════════════════════════ */
function SingleLineDiagram({ mode, g2State }) {
  const busEnergized = true;
  const g2Paralleled = g2State === "paralleled";
  const g2Running = g2State === "running" || g2Paralleled;

  // Animated dash offset for power flow lines
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    const iv = setInterval(() => setOffset(o => (o + 1) % 20), 50);
    return () => clearInterval(iv);
  }, []);

  return (
    <svg width="100%" viewBox="0 0 820 340" style={{ maxWidth: "100%", minHeight: "200px" }}>
      <defs>
        <marker id="arG1" markerWidth="6" markerHeight="5" refX="6" refY="2.5" orient="auto">
          <polygon points="0 0,6 2.5,0 5" fill="#e8a020" />
        </marker>
        <marker id="arG2" markerWidth="6" markerHeight="5" refX="6" refY="2.5" orient="auto">
          <polygon points="0 0,6 2.5,0 5" fill="#20c8d0" />
        </marker>
        <marker id="arBus" markerWidth="6" markerHeight="5" refX="6" refY="2.5" orient="auto">
          <polygon points="0 0,6 2.5,0 5" fill="#3090e0" />
        </marker>
        <filter id="glow1"><feGaussianBlur stdDeviation="2" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        <filter id="glow2"><feGaussianBlur stdDeviation="2" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
      </defs>

      {/* ── GEN 1 ── */}
      {/* Generator symbol */}
      <circle cx="90" cy="80" r="38" fill="#0d1a0a" stroke="#e8a020" strokeWidth="2" filter="url(#glow1)" />
      <text x="90" y="75" textAnchor="middle" fill="#e8a020" fontSize="10" fontFamily="'JetBrains Mono'" fontWeight="700">GEN 1</text>
      <text x="90" y="89" textAnchor="middle" fill="#e8a020" fontSize="8" fontFamily="'JetBrains Mono'">50kW</text>
      <text x="90" y="101" textAnchor="middle" fill="#6a9060" fontSize="7" fontFamily="'JetBrains Mono'">1800RPM</text>
      {/* CB1 */}
      <rect x="66" y="138" width="48" height="28" fill="#1a0e00" stroke="#e8a020" strokeWidth="1.5" rx="1" />
      <text x="90" y="150" textAnchor="middle" fill="#e8a020" fontSize="8" fontFamily="'JetBrains Mono'" fontWeight="700">CB1</text>
      <text x="90" y="161" textAnchor="middle" fill="#6a9040" fontSize="7" fontFamily="'JetBrains Mono'">CLOSED</text>
      {/* G1 conductor to bus */}
      <line x1="90" y1="118" x2="90" y2="138" stroke="#e8a020" strokeWidth="3" strokeDasharray="6,4" strokeDashoffset={-offset} />
      <line x1="90" y1="166" x2="90" y2="200" stroke="#e8a020" strokeWidth="3" strokeDasharray="6,4" strokeDashoffset={-offset} />
      <line x1="90" y1="200" x2="280" y2="200" stroke="#e8a020" strokeWidth="3" strokeDasharray="6,4" strokeDashoffset={-offset} markerEnd="url(#arG1)" />

      {/* ── GEN 2 ── */}
      <circle cx="90" cy="280" r="38" fill={g2Running ? "#0a1a1a" : "#0d0d0d"} stroke={g2Running ? "#20c8d0" : "#2a4040"} strokeWidth="2" filter={g2Running ? "url(#glow2)" : ""} />
      <text x="90" y="275" textAnchor="middle" fill={g2Running ? "#20c8d0" : "#2a5050"} fontSize="10" fontFamily="'JetBrains Mono'" fontWeight="700">GEN 2</text>
      <text x="90" y="289" textAnchor="middle" fill={g2Running ? "#20c8d0" : "#2a5050"} fontSize="8" fontFamily="'JetBrains Mono'">50kW</text>
      <text x="90" y="301" textAnchor="middle" fill={g2Running ? "#407080" : "#1a3030"} fontSize="7" fontFamily="'JetBrains Mono'">1800RPM</text>
      {/* CB2 */}
      <rect x="66" y="218" width="48" height="28" fill={g2Paralleled ? "#001a1a" : "#0a0a0a"} stroke={g2Paralleled ? "#20c8d0" : "#2a4040"} strokeWidth="1.5" rx="1" />
      <text x="90" y="230" textAnchor="middle" fill={g2Paralleled ? "#20c8d0" : "#2a5050"} fontSize="8" fontFamily="'JetBrains Mono'" fontWeight="700">CB2</text>
      <text x="90" y="241" textAnchor="middle" fill={g2Paralleled ? "#28d860" : "#882020"} fontSize="7" fontFamily="'JetBrains Mono'">{g2Paralleled ? "CLOSED" : "OPEN"}</text>
      {/* G2 conductor — only animated if paralleled */}
      <line x1="90" y1="242" x2="90" y2="200" stroke={g2Paralleled ? "#20c8d0" : "#1a3030"} strokeWidth="3"
        strokeDasharray="6,4" strokeDashoffset={g2Paralleled ? -offset : 0} />
      <line x1="90" y1="242" x2="90" y2="246" stroke={g2Paralleled ? "#20c8d0" : "#1a3030"} strokeWidth="3" />
      <line x1="90" y1="200" x2="280" y2="200" stroke={g2Paralleled ? "#20c8d0" : "#1a3030"} strokeWidth={g2Paralleled ? 3 : 1.5}
        strokeDasharray={g2Paralleled ? "6,4" : "2,4"} strokeDashoffset={g2Paralleled ? -offset : 0} markerEnd={g2Paralleled ? "url(#arG2)" : ""} />
      <line x1="90" y1="246" x2="90" y2="260" stroke={g2Paralleled ? "#20c8d0" : "#1a3030"} strokeWidth="3"
        strokeDasharray={g2Paralleled ? "6,4" : "2,4"} strokeDashoffset={g2Paralleled ? -offset : 0} />

      {/* ── COMMON BUS ── */}
      <rect x="280" y="185" width="250" height="30" fill="#0a1828" stroke="#3090e0" strokeWidth="2" />
      <text x="405" y="198" textAnchor="middle" fill="#60b8ff" fontSize="9" fontFamily="'JetBrains Mono'" fontWeight="700" letterSpacing="2">480V 3φ COMMON BUS</text>
      <text x="405" y="211" textAnchor="middle" fill="#305888" fontSize="8" fontFamily="'JetBrains Mono'">100kW / 125kVA COMBINED</text>

      {/* Bus protection labels */}
      <text x="282" y="180" fill="#e0d020" fontSize="7" fontFamily="'JetBrains Mono'">⚡ ANSI 25 SYNC CHECK</text>
      <text x="282" y="225" fill="#e0d020" fontSize="7" fontFamily="'JetBrains Mono'">⚡ ANSI 32 REV POWER</text>

      {/* ── MAIN LOAD BREAKER ── */}
      <rect x="580" y="185" width="55" height="30" fill="#0a1a0a" stroke="#28d860" strokeWidth="1.5" rx="1" />
      <text x="607" y="197" textAnchor="middle" fill="#28d860" fontSize="8" fontFamily="'JetBrains Mono'" fontWeight="700">CB-L</text>
      <text x="607" y="208" textAnchor="middle" fill="#28d860" fontSize="7" fontFamily="'JetBrains Mono'">LOAD</text>
      <line x1="530" y1="200" x2="580" y2="200" stroke="#3090e0" strokeWidth="3" strokeDasharray="6,4" strokeDashoffset={-offset} markerEnd="url(#arBus)" />

      {/* ── LOAD BLOCK ── */}
      <rect x="635" y="170" width="140" height="60" fill="#081808" stroke="#28d860" strokeWidth="1.5" rx="2" />
      <text x="705" y="192" textAnchor="middle" fill="#28d860" fontSize="10" fontFamily="'JetBrains Mono'" fontWeight="700">LOAD</text>
      <text x="705" y="206" textAnchor="middle" fill="#20a840" fontSize="8" fontFamily="'JetBrains Mono'">0–100kW</text>
      <text x="705" y="220" textAnchor="middle" fill="#20a840" fontSize="8" fontFamily="'JetBrains Mono'">0–125 kVA</text>
      <line x1="635" y1="200" x2="635" y2="200" stroke="#28d860" strokeWidth="3" strokeDasharray="6,4" strokeDashoffset={-offset} />

      {/* ── NEUTRAL BONDING NOTE ── */}
      <rect x="280" y="240" width="250" height="46" fill="#100808" stroke="#f03030" strokeWidth="1" strokeDasharray="3,2" rx="1" />
      <text x="405" y="255" textAnchor="middle" fill="#f03030" fontSize="8" fontFamily="'JetBrains Mono'" fontWeight="700">⚠ NEUTRAL BONDING — CRITICAL</text>
      <text x="405" y="268" textAnchor="middle" fill="#c05050" fontSize="7" fontFamily="'JetBrains Mono'">ONE neutral-ground bond only.</text>
      <text x="405" y="280" textAnchor="middle" fill="#c05050" fontSize="7" fontFamily="'JetBrains Mono'">Gen 2 neutral MUST float on bus.</text>

      {/* Protection zones */}
      <rect x="60" y="55" width="62" height="110" fill="none" stroke="#e8a020" strokeWidth=".5" strokeDasharray="4,4" rx="2" />
      <text x="63" y="52" fill="#e8a020" fontSize="7" fontFamily="'JetBrains Mono'">ZONE G1</text>
      {g2Running && <><rect x="60" y="218" width="62" height="72" fill="none" stroke="#20c8d0" strokeWidth=".5" strokeDasharray="4,4" rx="2" />
        <text x="63" y="215" fill="#20c8d0" fontSize="7" fontFamily="'JetBrains Mono'">ZONE G2</text></>}

      {/* ANSI relay symbols */}
      {[["32", 76, 174], ["27/59", 104, 174]].map(([n, x, y]) => (
        <g key={n}>
          <circle cx={x} cy={y} r="7" fill="#0a0808" stroke="#e8a020" strokeWidth="1" />
          <text x={x} y={y + 3} textAnchor="middle" fill="#e8a020" fontSize="6" fontFamily="'JetBrains Mono'" fontWeight="700">{n}</text>
        </g>
      ))}
      {g2Paralleled && [["32", 76, 220 + 10], ["27/59", 104, 220 + 10]].map(([n, x, y]) => (
        <g key={n + "g2"}>
          <circle cx={x} cy={y} r="7" fill="#080a0a" stroke="#20c8d0" strokeWidth="1" />
          <text x={x} y={y + 3} textAnchor="middle" fill="#20c8d0" fontSize="6" fontFamily="'JetBrains Mono'" fontWeight="700">{n}</text>
        </g>
      ))}

      {/* Legend */}
      {[["#e8a020", "GEN 1 POWER FLOW"], ["#20c8d0", "GEN 2 POWER FLOW"], ["#3090e0", "COMBINED BUS FLOW"], ["#28d860", "LOAD FEED"]].map(([c, l], i) => (
        <g key={i}>
          <line x1={10 + i * 190} y1={326} x2={36 + i * 190} y2={326} stroke={c} strokeWidth="2" strokeDasharray="6,3" />
          <text x={40 + i * 190} y={329} fill="#3a6080" fontSize="8" fontFamily="'JetBrains Mono'">{l}</text>
        </g>
      ))}
    </svg>
  );
}

/* ══════════════════════════════════════════
   DROOP CHART — governor load sharing
   ══════════════════════════════════════════ */
function DroopChart({ droop1, droop2, totalLoadKW }) {
  const W = 320, H = 160;
  const pad = { l: 40, r: 20, t: 20, b: 40 };
  const iW = W - pad.l - pad.r, iH = H - pad.t - pad.b;
  // Droop: at no-load = f_nl, at full-load = 60Hz
  // f_nl = 60 * (1 + droop/100)
  const maxKW = 60;
  const fnl1 = 60 * (1 + droop1 / 100);
  const fnl2 = 60 * (1 + droop2 / 100);
  const fMin = 58.5, fMax = 63.5;
  const kw2x = kw => pad.l + (kw / maxKW) * iW;
  const f2y = f => pad.t + (1 - (f - fMin) / (fMax - fMin)) * iH;
  // At current total load, find operating frequency (intersection of both droops at equal kW sum)
  // Simple: both droops with same slope share equally IF same droop%
  // Equal share: each machine = totalLoad/2
  const kw1 = totalLoadKW / 2, kw2 = totalLoadKW / 2;
  const f_op1 = fnl1 - (droop1 / 100) * 60 * (kw1 / maxKW);
  const f_op2 = fnl2 - (droop2 / 100) * 60 * (kw2 / maxKW);
  const fop = (f_op1 + f_op2) / 2;

  return (
    <svg width={W} height={H} style={{ maxWidth: "100%" }}>
      {/* Grid */}
      <rect x={pad.l} y={pad.t} width={iW} height={iH} fill="#060a0e" stroke="#1a2e44" strokeWidth="1" />
      {[60, 61, 62, 63].map(f => (
        <g key={f}>
          <line x1={pad.l} y1={f2y(f)} x2={pad.l + iW} y2={f2y(f)} stroke="#1a2e44" strokeWidth="0.5" />
          <text x={pad.l - 4} y={f2y(f) + 4} fill="#304860" fontSize="8" fontFamily="'JetBrains Mono'" textAnchor="end">{f}</text>
        </g>
      ))}
      {[0, 20, 40, 60].map(k => (
        <g key={k}>
          <line x1={kw2x(k)} y1={pad.t} x2={kw2x(k)} y2={pad.t + iH} stroke="#1a2e44" strokeWidth="0.5" />
          <text x={kw2x(k)} y={H - pad.b + 14} fill="#304860" fontSize="8" fontFamily="'JetBrains Mono'" textAnchor="middle">{k}</text>
        </g>
      ))}
      {/* 60 Hz line */}
      <line x1={pad.l} y1={f2y(60)} x2={pad.l + iW} y2={f2y(60)} stroke="#1a4030" strokeWidth="1" strokeDasharray="4,4" />
      <text x={pad.l + iW + 3} y={f2y(60) + 4} fill="#1a5040" fontSize="7" fontFamily="'JetBrains Mono'">60Hz</text>
      {/* Droop line G1 */}
      <line x1={kw2x(0)} y1={f2y(fnl1)} x2={kw2x(maxKW)} y2={f2y(fnl1 - droop1 / 100 * 60)} stroke="#e8a020" strokeWidth="2" />
      <text x={kw2x(2)} y={f2y(fnl1) - 4} fill="#e8a020" fontSize="8" fontFamily="'JetBrains Mono'">G1 {droop1}% droop</text>
      {/* Droop line G2 */}
      <line x1={kw2x(0)} y1={f2y(fnl2)} x2={kw2x(maxKW)} y2={f2y(fnl2 - droop2 / 100 * 60)} stroke="#20c8d0" strokeWidth="2" />
      <text x={kw2x(2)} y={f2y(fnl2) + 12} fill="#20c8d0" fontSize="8" fontFamily="'JetBrains Mono'">G2 {droop2}% droop</text>
      {/* Operating point */}
      <circle cx={kw2x(kw1)} cy={f2y(f_op1)} r="5" fill="#e8a020" />
      <circle cx={kw2x(kw2)} cy={f2y(f_op2)} r="5" fill="#20c8d0" />
      <line x1={kw2x(kw1)} y1={f2y(f_op1)} x2={kw2x(kw1)} y2={f2y(fMin)} stroke="#e8a020" strokeWidth="1" strokeDasharray="2,2" />
      <line x1={kw2x(kw2)} y1={f2y(f_op2)} x2={kw2x(kw2)} y2={f2y(fMin)} stroke="#20c8d0" strokeWidth="1" strokeDasharray="2,2" />
      {/* Axis labels */}
      <text x={pad.l + iW / 2} y={H - 3} fill="#3a6080" fontSize="8" fontFamily="'JetBrains Mono'" textAnchor="middle">LOAD (kW per machine)</text>
      <text x={10} y={pad.t + iH / 2} fill="#3a6080" fontSize="8" fontFamily="'JetBrains Mono'" textAnchor="middle" transform={`rotate(-90,10,${pad.t + iH / 2})`}>FREQ (Hz)</text>
    </svg>
  );
}

/* ══════════════════════════════════════════
   MAIN APP
   ══════════════════════════════════════════ */
const TABS = ["Objective", "Single-Line", "Synchronizing", "Load Sharing", "Protection", "Procedure", "Common Faults"];

export default function Par50k() {
  const [tab, setTab] = useState(0);
  const [g2State, setG2State] = useState("stopped"); // stopped | running | paralleled
  const [syncRate, setSyncRate] = useState(18); // deg/sec — controls synchronoscope speed
  const [totalLoad, setTotalLoad] = useState(60); // kW total
  const [droop1, setDroop1] = useState(5);
  const [droop2, setDroop2] = useState(5);
  const [g1kw, setG1kw] = useState(30);
  const [g2kw, setG2kw] = useState(30);
  const [time, setTime] = useState("");
  const [angleHz, setAngleHz] = useState(0);

  // Live freq simulation
  const [g1hz, setG1hz] = useState(60.0);
  const [g2hz, setG2hz] = useState(60.0);
  const [g1v, setG1v] = useState(480);
  const [g2v, setG2v] = useState(480);

  useEffect(() => {
    const iv = setInterval(() => {
      setG1hz(60 + (Math.random() - 0.5) * 0.06);
      setG2hz(60 + (Math.random() - 0.5) * 0.12);
      setG1v(480 + (Math.random() - 0.5) * 1.5);
      setG2v(480 + (Math.random() - 0.5) * 1.5);
      setTime(new Date().toLocaleTimeString());
    }, 600);
    return () => clearInterval(iv);
  }, []);

  // Compute sync conditions
  const dvPct = Math.abs(g1v - g2v) / 480 * 100;
  const dfHz = Math.abs(g1hz - g2hz);
  const inSync = dvPct < 2 && dfHz < 0.2 && g2State === "running";
  const syncAngle = ((syncRate * 0.016 * 60) % 360);

  // Load sharing
  const kw1 = totalLoad * (droop1 === droop2 ? 0.5 : droop2 / (droop1 + droop2));
  const kw2 = totalLoad - kw1;
  const pct1 = kw1 / 50, pct2 = kw2 / 50;

  const dvClass = dvPct < 1 ? "ok" : dvPct < 3 ? "warn" : "bad";
  const dfClass = dfHz < 0.1 ? "ok" : dfHz < 0.3 ? "warn" : "bad";

  return (
    <div className="app">
      <style>{CSS}</style>
      {/* HEADER */}
      <div className="hdr">
        <div className="hdr-l">
          <div className="tag tag-g1">GEN-01</div>
          <div className="tag tag-g2">GEN-02</div>
          <div className="tag tag-bus">PARALLEL BUS</div>
          <div>
            <h1>Dual 50kW Generator — Parallel Operation</h1>
            <div className="hdr-sub">100kW / 125kVA COMBINED · 480V 3φ 4W · 60Hz · ANSI PROTECTION · IEEE C37.95</div>
          </div>
        </div>
        <div className="sys-status">
          <div className="ss">
            <div className="ss-dot on" style={{ background: "#e8a020", boxShadow: "0 0 8px #e8a020" }} />
            <div className="ss-lbl" style={{ color: "#e8a020" }}>GEN 1</div>
            <div style={{ fontFamily: "var(--mono)", fontSize: "9px", color: "#e8a020" }}>{g1hz.toFixed(2)}Hz</div>
          </div>
          <div className="ss">
            <div className="ss-dot" style={{ background: g2State !== "stopped" ? "#20c8d0" : "#1a3040", boxShadow: g2State !== "stopped" ? "0 0 8px #20c8d0" : "none", animation: g2State !== "stopped" ? "pulse 1.5s ease-in-out infinite" : "none" }} />
            <div className="ss-lbl" style={{ color: g2State !== "stopped" ? "#20c8d0" : "#1a3040" }}>GEN 2</div>
            <div style={{ fontFamily: "var(--mono)", fontSize: "9px", color: g2State !== "stopped" ? "#20c8d0" : "#1a3040" }}>{g2State !== "stopped" ? g2hz.toFixed(2) + "Hz" : "OFFLINE"}</div>
          </div>
          <div className="ss">
            <div className="ss-dot on" style={{ background: "#3090e0", boxShadow: "0 0 8px #3090e0" }} />
            <div className="ss-lbl" style={{ color: "#3090e0" }}>BUS</div>
            <div style={{ fontFamily: "var(--mono)", fontSize: "9px", color: "#3090e0" }}>480V</div>
          </div>
          <div style={{ fontFamily: "var(--mono)", fontSize: "10px", color: "var(--text-md)" }}>{time}</div>
        </div>
      </div>

      {/* TABS */}
      <div className="tabs">
        {TABS.map((t, i) => <button key={i} className={`tab${tab === i ? " active" : ""}`} onClick={() => setTab(i)}>{t}</button>)}
      </div>

      {/* ── TAB 0: OBJECTIVE ── */}
      {tab === 0 && (
        <div className="body">
          <div className="row">
            <div className="panel g1b" data-label="Engineering Objective" style={{ flex: 2, minWidth: "300px" }}>
              <div className="pi">
                <div className="sh">WHY RUN TWO GENERATORS TOGETHER</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: "10px" }}>
                  {[
                    { t: "N+1 Redundancy", c: "var(--green)", d: "If Gen 1 fails mid-operation, Gen 2 is already warmed, synchronized, and carrying half the load. Load transfer is instantaneous — zero interruption to connected loads. This is the primary reason mission-critical sites run parallel sets." },
                    { t: "100kW Combined Capacity", c: "var(--g1)", d: "Two 50kW units paralleled deliver 90kW prime / 100kW standby at 0.8 PF — 125 kVA apparent. Neither machine runs at more than 50% of its prime rating at combined 90kW total load, dramatically extending engine life and reducing wet-stacking risk." },
                    { t: "Load-Following Staging", c: "var(--bus)", d: "Gen 1 starts and carries base load. When load demand crosses ~80% of Gen 1's prime rating (36kW), DSE controller automatically starts Gen 2, synchronizes it, and closes CB2 to share the load. Gen 2 sheds back and stops when load drops below threshold." },
                    { t: "Fuel & Maintenance Efficiency", c: "var(--g2)", d: "Each machine runs at optimal load range (60–80% prime = best fuel efficiency and lowest carbon build-up). Alternating which machine leads allows equal wear across both sets. Neither machine runs continuously at high standby load." },
                  ].map((c, i) => (
                    <div key={i} style={{ background: "var(--bg1)", border: "1px solid var(--border)", borderLeft: `3px solid ${c.c}`, padding: "12px 14px" }}>
                      <div style={{ color: c.c, fontFamily: "var(--mono)", fontSize: "10px", fontWeight: "700", letterSpacing: "1px", marginBottom: "6px" }}>{c.t}</div>
                      <div style={{ fontSize: "13px", lineHeight: "1.5", color: "var(--text-hi)" }}>{c.d}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="col" style={{ flex: 1, minWidth: "220px" }}>
              <div className="panel g2b" data-label="Combined Output — Verified Specs">
                <div className="pi">
                  <table className="stbl">
                    <tbody>
                      <tr className="hdr-row"><td colSpan="2">COMBINED RATINGS</td></tr>
                      <tr><td>Standby (no overload)</td><td>100 kW / 125 kVA</td></tr>
                      <tr><td>Prime (ISO 8528)</td><td>90 kW / 112.5 kVA</td></tr>
                      <tr><td>Power factor basis</td><td>0.8 lagging</td></tr>
                      <tr><td>Bus voltage</td><td>480V L-L / 277V L-N</td></tr>
                      <tr><td>Full-load bus current</td><td>~150A @ 480V 3φ</td></tr>
                      <tr><td>Per-machine at ½ load</td><td>75A @ 480V each</td></tr>
                      <tr className="hdr-row"><td colSpan="2">N+1 SURVIVAL MODE</td></tr>
                      <tr><td>One machine trips</td><td>Surviving unit: 50kW max</td></tr>
                      <tr><td>Load shed required above</td><td>45kW (prime limit)</td></tr>
                      <tr><td>Full-load runtime (80 gal)</td><td>~21.6 hrs / machine</td></tr>
                      <tr><td>Combined fuel (both running)</td><td>~7.4 GPH @ 100% load</td></tr>
                      <tr><td>Fuel per machine @ ½ load</td><td>~1.9 GPH each</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="panel rb" data-label="The Non-Negotiable Rules">
                <div className="pi">
                  {[
                    { r: "Phase sequence IDENTICAL", d: "Both A-B-C. One reversed = catastrophic fault. Verify once at installation with rotation meter." },
                    { r: "Only ONE neutral-ground bond", d: "Bond Gen 1 neutral. Float Gen 2 neutral on the bus. Two bonds = ground loop current = equipment damage + nuisance trips." },
                    { r: "Sync before closing CB2", d: "Never close CB2 onto live bus without sync check. High phase angle at closure = violent mechanical shock to both alternators." },
                    { r: "Match droop settings", d: "Both governors set to same % droop (5%). Both AVRs set to same voltage droop. Any mismatch = one machine overloaded." },
                    { r: "Reverse power protection (ANSI 32)", d: "Required on EACH machine. Prevents a stalled or shutdown machine from being motored by the bus." },
                  ].map((r, i) => (
                    <div key={i} style={{ padding: "7px 0", borderBottom: "1px solid var(--border)", display: "flex", gap: "10px" }}>
                      <div style={{ color: "var(--red2)", fontFamily: "var(--mono)", fontSize: "10px", fontWeight: "700", flexShrink: 0, marginTop: "1px" }}>⚠</div>
                      <div>
                        <div style={{ color: "var(--red2)", fontFamily: "var(--mono)", fontSize: "10px", fontWeight: "700" }}>{r.r}</div>
                        <div style={{ fontSize: "12px", color: "var(--text-md)", marginTop: "2px" }}>{r.d}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 1: SINGLE-LINE ── */}
      {tab === 1 && (
        <div className="body">
          <div className="row" style={{ marginBottom: "0" }}>
            <div className="toggle-row">
              <button className={`tog${g2State === "stopped" ? " active" : ""}`} onClick={() => setG2State("stopped")}>Gen 2: Offline</button>
              <button className={`tog${g2State === "running" ? " active" : ""}`} onClick={() => setG2State("running")}>Gen 2: Running / Sync</button>
              <button className={`tog${g2State === "paralleled" ? " active" : ""}`} onClick={() => setG2State("paralleled")}>Gen 2: Paralleled (CB2 Closed)</button>
            </div>
          </div>
          <div className="panel busb" data-label="Single-Line Diagram — Dual Genset Parallel Bus">
            <div className="pi"><SingleLineDiagram mode="parallel" g2State={g2State} /></div>
          </div>
          <div className="row">
            <div className="panel g1b" data-label="Wiring — Cable & Breaker Sizing" style={{ flex: 1 }}>
              <div className="pi">
                <table className="stbl">
                  <tbody>
                    <tr className="hdr-row"><td colSpan="2">GEN 1 &amp; GEN 2 OUTPUT FEEDERS</td></tr>
                    <tr><td>Machine output current (@ 50kW / 0.8PF / 480V)</td><td>72A / phase</td></tr>
                    <tr><td>Feeder cable (125% NEC 445.13)</td><td>90A min → 1/0 AWG CU (100A)</td></tr>
                    <tr><td>Conduit fill (3 conductors)</td><td>2" EMT or equivalent</td></tr>
                    <tr><td>Gen breaker (CB1, CB2) continuous</td><td>160A frame / 90A trip (adjust)</td></tr>
                    <tr className="hdr-row"><td colSpan="2">COMMON BUS CONDUCTORS</td></tr>
                    <tr><td>Bus current (both machines full load)</td><td>150A total</td></tr>
                    <tr><td>Bus cable (125% NEC)</td><td>188A min → 3/0 AWG CU (200A)</td></tr>
                    <tr><td>Bus / camlock rating</td><td>400A frame (oversized for growth)</td></tr>
                    <tr className="hdr-row"><td colSpan="2">NEUTRAL — CRITICAL</td></tr>
                    <tr className="rc"><td>Gen 1 neutral bond</td><td>BONDED to enclosure ground</td></tr>
                    <tr className="gc"><td>Gen 2 neutral</td><td>FLOATING — NOT bonded at Gen 2</td></tr>
                    <tr><td>Neutral conductor to bus</td><td>Same size as phase (3/0 AWG)</td></tr>
                    <tr><td>Ground electrode system</td><td>Single point on bus/switchgear only</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="panel g2b" data-label="Phase Sequence Verification Procedure" style={{ flex: 1 }}>
              <div className="pi">
                <div className="callout crit">⚠ PHASE SEQUENCE CHECK IS MANDATORY before first parallel connection. One reversed phase will create a three-phase bolted fault between generators — both machines will trip on overcurrent, and alternator windings may be damaged or destroyed.</div>
                <div className="sh" style={{ marginTop: "10px" }}>VERIFICATION STEPS</div>
                {[
                  { n: "1", t: "Run Gen 1 alone on load", s: "Confirm A-B-C rotation with phase rotation meter on CB1 output terminals" },
                  { n: "2", t: "Run Gen 2 alone — no load", s: "Confirm A-B-C rotation on CB2 output terminals" },
                  { n: "3", t: "Compare L-L voltages", s: "Va-Vb-Vc must rotate same direction (CW on meter = positive sequence)" },
                  { n: "4", t: "CB2 OPEN — never close yet", s: "Phase sequence confirmed does NOT mean it's safe to close yet — still need sync" },
                  { n: "5", t: "Document and label", s: "Mark A-B-C phasing on all bus connections with permanent colored tape and labels" },
                ].map(s => (
                  <div className="step" key={s.n}>
                    <div className="step-n g2c">{s.n}</div>
                    <div><div className="step-title">{s.t}</div><div className="step-sub">{s.s}</div></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2: SYNCHRONIZING ── */}
      {tab === 2 && (
        <div className="body">
          <div className="row">
            {/* Synchronoscope */}
            <div className="panel g2b" data-label="Synchronoscope — Live Simulation" style={{ flex: "0 0 auto" }}>
              <div className="pi">
                <div style={{ display: "flex", gap: "16px", alignItems: "flex-start", flexWrap: "wrap" }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                    <Synchronoscope angleDeg={0} rateDegPerSec={syncRate} inSync={syncRate < 6} />
                    <div style={{ fontFamily: "var(--mono)", fontSize: "8px", color: "var(--text-md)", textAlign: "center" }}>
                      {syncRate < 6 ? "✓ NEAR SYNC — CLOSE NOW" : syncRate < 20 ? "↻ ROTATING — ADJUSTING" : "✗ TOO FAST — REDUCE SPEED"}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px", width: "100%" }}>
                      <div style={{ fontFamily: "var(--mono)", fontSize: "8px", color: "var(--text-md)" }}>Incoming speed (rotate rate):</div>
                      <input type="range" min="0" max="60" value={syncRate} onChange={e => setSyncRate(+e.target.value)} style={{ width: "170px" }} />
                      <div style={{ fontFamily: "var(--mono)", fontSize: "9px", color: syncRate < 6 ? "var(--green)" : syncRate < 20 ? "var(--yellow)" : "var(--red)" }}>
                        {syncRate === 0 ? "Dead — Same freq" : `ΔHz ≈ +${(syncRate / 360).toFixed(3)} Hz incoming fast`}
                      </div>
                    </div>
                  </div>
                  <div style={{ flex: 1, minWidth: "160px" }}>
                    <div className="sh">READING THE SYNCHRONOSCOPE</div>
                    {[
                      { s: "12 o'clock (0°)", d: "Perfect phase alignment — zero angle. Ideal close point." },
                      { s: "Slow clockwise rotation", d: "Incoming (Gen 2) slightly faster than running bus. Good — bring fuel down a touch." },
                      { s: "Counter-clockwise rotation", d: "Incoming slower than bus. Speed up Gen 2 governor." },
                      { s: "Fast rotation either way", d: "Frequencies too far apart. Do NOT close — could shear alternator coupling." },
                      { s: "Close at 11 o'clock CW", d: "Accounts for CB mechanical close time (~50–80ms). Pointer arrives at 12 o'clock when contacts make." },
                    ].map((r, i) => (
                      <div key={i} style={{ padding: "5px 0", borderBottom: "1px solid var(--border)" }}>
                        <div style={{ fontFamily: "var(--mono)", fontSize: "9px", color: "var(--g2b)", fontWeight: "700" }}>{r.s}</div>
                        <div style={{ fontSize: "12px", color: "var(--text-hi)", marginTop: "2px" }}>{r.d}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Sync conditions meter */}
            <div className="col" style={{ flex: 1, minWidth: "240px" }}>
              <div className="panel g1b" data-label="Synchronization Conditions — IEEE C37.95">
                <div className="pi">
                  <div className="callout info">All 4 conditions must be simultaneously satisfied before CB2 may be closed. ANSI 25 sync check relay enforces this automatically — it physically prevents CB2 closure if any window is exceeded.</div>
                  <div className="sync-field" style={{ marginTop: "12px" }}>
                    {[
                      { k: "ΔV (Voltage Match)", v: `${dvPct.toFixed(2)}%`, ok: dvPct < 1, warn: dvPct < 3, limit: "< 2% ideal / < 5% max", bar: Math.min(100, dvPct / 5 * 100) },
                      { k: "Δf (Frequency Match)", v: `${dfHz.toFixed(3)} Hz`, ok: dfHz < 0.1, warn: dfHz < 0.3, limit: "< 0.1 Hz ideal / < 0.5 Hz max", bar: Math.min(100, dfHz / 0.5 * 100) },
                      { k: "Phase Sequence", v: "A-B-C ✓", ok: true, warn: false, limit: "MUST match exactly", bar: 0 },
                      { k: "Phase Angle", v: syncRate < 5 ? "< 5°" : syncRate < 15 ? "< 30°" : "> 30°", ok: syncRate < 5, warn: syncRate < 15, limit: "< 10° at closure", bar: Math.min(100, syncRate / 60 * 100) },
                    ].map((c, i) => {
                      const cls = c.ok ? "ok" : c.warn ? "warn" : "bad";
                      const barColor = c.ok ? "var(--green)" : c.warn ? "var(--yellow)" : "var(--red)";
                      return (
                        <div className={`sync-cell ${cls}`} key={i}>
                          <div className="sync-cell-k">{c.k}</div>
                          <div className="sync-cell-v">{c.v}</div>
                          <div style={{ fontFamily: "var(--mono)", fontSize: "8px", color: "var(--text-lo)", marginTop: "2px" }}>{c.limit}</div>
                          {c.bar > 0 && <div className="sync-bar"><div className="sync-bar-fill" style={{ width: `${c.bar}%`, background: barColor }} /></div>}
                        </div>
                      );
                    })}
                  </div>
                  <div className="sh" style={{ marginTop: "14px" }}>WHAT HAPPENS IF SYNC CONDITIONS VIOLATED</div>
                  <table className="stbl">
                    <tbody>
                      {[
                        ["ΔV > 5% at closure", "Violent reactive current surge — one machine severely overloaded"],
                        ["Δf > 1 Hz at closure", "Power oscillation — both machines hunt, may trip on overload or loss of sync"],
                        ["Phase angle > 30° at closure", "Current spike 3–10× rated — mechanical shock to couplings and shaft"],
                        ["Phase sequence reversed", "Instantaneous 3φ fault — massive fault current, CB trips or windings burn"],
                        ["Closing on dead bus", "Safe — no sync needed. Close without caution only if bus confirmed de-energized"],
                      ].map(([k, v], i) => <tr key={i}><td>{k}</td><td style={{ color: "var(--red2)" }}>{v}</td></tr>)}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 3: LOAD SHARING ── */}
      {tab === 3 && (
        <div className="body">
          <div className="row">
            <div className="panel g1b" data-label="Governor Droop — Load Sharing Theory" style={{ flex: 1, minWidth: "280px" }}>
              <div className="pi">
                <div className="sh">HOW DROOP CONTROLS REAL POWER SHARING</div>
                <div className="callout info">Droop is the intentional speed drop from no-load to full-load. Two machines with IDENTICAL droop % on the same bus will automatically share real power proportionally to their ratings — no communication needed. This is the beauty of droop control.</div>
                <div style={{ margin: "12px 0" }}>
                  <DroopChart droop1={droop1} droop2={droop2} totalLoadKW={totalLoad} />
                </div>
                <div style={{ display: "flex", gap: "12px", marginTop: "8px", flexWrap: "wrap" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "var(--mono)", fontSize: "8px", color: "var(--g1)", marginBottom: "4px" }}>GEN 1 DROOP %</div>
                    <input type="range" min="2" max="10" value={droop1} onChange={e => setDroop1(+e.target.value)} style={{ width: "100%" }} />
                    <div style={{ fontFamily: "var(--mono)", fontSize: "11px", color: "var(--g1b)" }}>{droop1}% — f_nl = {(60 * (1 + droop1 / 100)).toFixed(2)} Hz</div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "var(--mono)", fontSize: "8px", color: "var(--g2)", marginBottom: "4px" }}>GEN 2 DROOP %</div>
                    <input type="range" min="2" max="10" value={droop2} onChange={e => setDroop2(+e.target.value)} style={{ width: "100%" }} />
                    <div style={{ fontFamily: "var(--mono)", fontSize: "11px", color: "var(--g2b)" }}>{droop2}% — f_nl = {(60 * (1 + droop2 / 100)).toFixed(2)} Hz</div>
                  </div>
                </div>
                <div style={{ marginTop: "8px" }}>
                  <div style={{ fontFamily: "var(--mono)", fontSize: "8px", color: "var(--text-md)", marginBottom: "4px" }}>TOTAL BUS LOAD: {totalLoad} kW</div>
                  <input type="range" min="10" max="100" value={totalLoad} onChange={e => setTotalLoad(+e.target.value)} style={{ width: "100%" }} />
                </div>
              </div>
            </div>

            <div className="col" style={{ flex: 1, minWidth: "240px" }}>
              <div className="panel g2b" data-label="Live Load Share Display">
                <div className="pi">
                  <div className="sh">REAL POWER DISTRIBUTION</div>
                  {[
                    { lbl: "GEN 1", kw: kw1, pct: pct1, c: "var(--g1)" },
                    { lbl: "GEN 2", kw: kw2, pct: pct2, c: "var(--g2)" },
                  ].map(g => (
                    <div key={g.lbl} style={{ marginBottom: "12px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--mono)", fontSize: "10px", marginBottom: "4px" }}>
                        <span style={{ color: g.c }}>{g.lbl}</span>
                        <span style={{ color: g.c }}>{g.kw.toFixed(1)} kW — {(g.pct * 100).toFixed(0)}% of 50kW</span>
                      </div>
                      <div style={{ height: "18px", background: "var(--bg0)", overflow: "hidden", border: `1px solid ${g.c}20` }}>
                        <div style={{ width: `${Math.min(100, g.pct * 100)}%`, height: "100%", background: g.c, opacity: 0.8, transition: "width .4s" }} />
                      </div>
                      <div style={{ fontFamily: "var(--mono)", fontSize: "9px", color: g.pct > 1 ? "var(--red)" : g.pct > 0.9 ? "var(--yellow)" : "var(--text-lo)", marginTop: "3px" }}>
                        {g.pct > 1 ? "⚠ OVERLOADED" : g.pct > 0.8 ? "HIGH LOAD" : g.pct > 0.4 ? "NORMAL" : "LIGHT LOAD"}
                      </div>
                    </div>
                  ))}
                  <table className="stbl" style={{ marginTop: "8px" }}>
                    <tbody>
                      <tr><td>Total bus load</td><td>{totalLoad} kW</td></tr>
                      <tr><td>Gen 1 share</td><td>{kw1.toFixed(1)} kW ({(kw1 / 50 * 100).toFixed(0)}%)</td></tr>
                      <tr className="g2c"><td>Gen 2 share</td><td>{kw2.toFixed(1)} kW ({(kw2 / 50 * 100).toFixed(0)}%)</td></tr>
                      <tr><td>Droop match</td><td style={{ color: droop1 === droop2 ? "var(--green)" : "var(--red)" }}>{droop1 === droop2 ? "✓ EQUAL — IDEAL" : "⚠ MISMATCH"}</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="panel busb" data-label="Reactive Power Sharing — AVR Droop">
                <div className="pi">
                  <div className="sh">REACTIVE POWER (kVAR) SHARING</div>
                  <div className="callout warn">Reactive power sharing is controlled by the AVR voltage droop — NOT the governor. This is the most misunderstood aspect of paralleling. Two machines can share real power (kW) perfectly while circulating massive reactive current between them.</div>
                  <table className="stbl" style={{ marginTop: "10px" }}>
                    <tbody>
                      <tr className="hdr-row"><td colSpan="2">REACTIVE DROOP SETTINGS</td></tr>
                      <tr><td>Both AVRs set to</td><td>3–5% voltage droop</td></tr>
                      <tr><td>Reactive droop function</td><td>As kVAR increases → AVR reduces V slightly → forces equal share</td></tr>
                      <tr><td>Without reactive droop</td><td>One machine over-excites, other under-excites → circulating kVAR</td></tr>
                      <tr><td>Circulating current symptom</td><td>High amps, low kW load — PF very low on one machine</td></tr>
                      <tr className="hdr-row"><td colSpan="2">CROSS-CURRENT COMPENSATION</td></tr>
                      <tr><td>Advanced method</td><td>Current transformer (CT) signal cross-fed between AVRs</td></tr>
                      <tr><td>Advantage</td><td>Stable reactive sharing even with different AVR types</td></tr>
                      <tr><td>Requirement</td><td>Same CT ratio on each machine, shielded interconnect cable</td></tr>
                      <tr><td>Common on rental sets</td><td>No — standard rental uses simple voltage droop only</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 4: PROTECTION ── */}
      {tab === 4 && (
        <div className="body">
          <div className="row">
            <div className="panel rb" data-label="Protection Relay Schedule — ANSI Device Numbers" style={{ flex: 2, minWidth: "320px" }}>
              <div className="pi">
                {[
                  { ansi: "25", fn: "Sync Check", c: "#3090e0", bg: "#0a1828", per: "Bus Tie Breaker", set: "ΔV < 5%, Δf < 0.5 Hz, Δφ < 10°", action: "Permits / blocks CB2 closure", note: "MANDATORY for parallel operation" },
                  { ansi: "32", fn: "Reverse Power", c: "#f03030", bg: "#3a0808", per: "Each Machine CB", set: "–5% of rated = –2.5 kW per machine", action: "SHUTDOWN + CB trip", note: "Prevents motoring if engine stalls" },
                  { ansi: "27", fn: "Under Voltage", c: "#e8a020", bg: "#2a1800", per: "Each Machine", set: "< 90% nom (432V)", action: "ALARM then TRIP", note: "Loss of field protection" },
                  { ansi: "59", fn: "Over Voltage", c: "#e8a020", bg: "#2a1800", per: "Each Machine", set: "> 110% nom (528V)", action: "TRIP", note: "AVR runaway protection" },
                  { ansi: "81O", fn: "Over Frequency", c: "#c84aff", bg: "#1a082a", per: "Each Machine", set: "> 63 Hz (2,100 RPM)", action: "TRIP", note: "Governor failure protection" },
                  { ansi: "81U", fn: "Under Frequency", c: "#c84aff", bg: "#1a082a", per: "Each Machine", set: "< 57 Hz (1,900 RPM)", action: "ALARM then TRIP", note: "Overload or speed collapse" },
                  { ansi: "51", fn: "Overcurrent (time)", c: "#f03030", bg: "#3a0808", per: "Each Machine CB", set: "> 125% rated (90A) with 3s delay", action: "TRIP CB", note: "Overload protection" },
                  { ansi: "50", fn: "Instantaneous OC", c: "#f03030", bg: "#3a0808", per: "Each Machine CB", set: "> 600% rated (430A)", action: "INSTANT TRIP", note: "Fault current protection" },
                  { ansi: "87G", fn: "Differential (optional)", c: "#20c8d0", bg: "#081818", per: "Each Alternator", set: "> 10% differential current", action: "INSTANT TRIP", note: "Not common at this size — used on critical standby" },
                  { ansi: "86", fn: "Lockout Relay", c: "#f03030", bg: "#3a0808", per: "Triggered by 27/59/81/32/50", set: "Latching coil", action: "Trips all CBs, requires manual reset", note: "Prevents auto-restart after serious fault" },
                ].map((r, i) => (
                  <div className="fault" key={i}>
                    <div className="fdot" style={{ background: r.c, boxShadow: `0 0 5px ${r.c}44` }} />
                    <div className="fansi" style={{ color: r.c, borderColor: r.c, background: r.bg }}>ANSI {r.ansi}</div>
                    <div style={{ flex: "0 0 140px", fontWeight: "700", fontSize: "13px" }}>{r.fn}</div>
                    <div style={{ flex: 1, fontFamily: "var(--mono)", fontSize: "9px", color: "var(--text-md)" }}>{r.per}</div>
                    <div style={{ flex: 1, fontFamily: "var(--mono)", fontSize: "9px" }}>{r.set}</div>
                    <div style={{ flex: "0 0 80px", fontFamily: "var(--mono)", fontSize: "9px", color: r.action.includes("TRIP") ? "var(--red2)" : "var(--yellow)", textAlign: "right" }}>{r.action}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="col" style={{ flex: 1, minWidth: "220px" }}>
              <div className="panel g1b" data-label="DSE 7310 MKII Parallel Mode Config">
                <div className="pi">
                  <table className="stbl">
                    <tbody>
                      <tr className="hdr-row"><td colSpan="2">DSE7310 MKII SYNC SETTINGS</td></tr>
                      <tr><td>Voltage sync window</td><td>±5% (configurable)</td></tr>
                      <tr><td>Frequency sync window</td><td>±0.5 Hz (configurable)</td></tr>
                      <tr><td>Phase angle window</td><td>±10° (configurable)</td></tr>
                      <tr><td>Sync monitoring mode</td><td>Dead bus / Live bus detect</td></tr>
                      <tr><td>Auto-sync capability</td><td>Yes — ramps Hz/V to match</td></tr>
                      <tr><td>Sync check output</td><td>Relay output C or D (volt-free)</td></tr>
                      <tr><td>Sync timeout</td><td>Configurable 0–600s (alarm if not synced)</td></tr>
                      <tr className="hdr-row"><td colSpan="2">LOAD SHARE LINK (LSL)</td></tr>
                      <tr><td>DSE load share connection</td><td>2-wire DSENet link between controllers</td></tr>
                      <tr><td>Load share accuracy</td><td>±5% between machines</td></tr>
                      <tr><td>Load demand start</td><td>Gen 2 auto-starts when Gen 1 > 80% load</td></tr>
                      <tr><td>Load demand stop</td><td>Gen 2 auto-stops when load drops below setpoint</td></tr>
                      <tr className="hdr-row"><td colSpan="2">BREAKER CONTROL</td></tr>
                      <tr><td>Breaker close relay</td><td>Output A (configurable)</td></tr>
                      <tr><td>Breaker open relay</td><td>Output B (configurable)</td></tr>
                      <tr><td>Breaker position feedback</td><td>Digital input (52a/52b contacts)</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="panel pb" data-label="Neutral Bonding — The Critical Detail">
                <div className="pi">
                  <div className="neutral-warn">
                    <div className="neutral-warn-hdr">⚠ GROUND LOOP PREVENTION</div>
                    <div style={{ fontSize: "13px", lineHeight: "1.6" }}>Two ground bonds on the same system creates a ground loop. Any current imbalance induces circulating ground current. This causes: nuisance GFCI trips, equipment damage from stray current, noise in sensitive electronics, and OSHA violations.</div>
                  </div>
                  <table className="stbl">
                    <tbody>
                      <tr className="hdr-row"><td colSpan="2">NEUTRAL BONDING RULE (NEC 250.35)</td></tr>
                      <tr className="rc"><td>Gen 1 (primary)</td><td>N bonded to enclosure GND</td></tr>
                      <tr className="gc"><td>Gen 2 (secondary)</td><td>N floating — no bond at Gen 2 frame</td></tr>
                      <tr><td>System ground point</td><td>Bus / switchgear ground bus only</td></tr>
                      <tr><td>Automatic switching</td><td>Solid-state transfer switch handles N bond automatically</td></tr>
                      <tr><td>Manual override</td><td>Remove Gen 2 neutral-ground jumper from DSE/AVR panel</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 5: PROCEDURE ── */}
      {tab === 5 && (
        <div className="body">
          <div className="row">
            <div className="panel g1b" data-label="Step-by-Step Parallel Procedure — Manual" style={{ flex: 1, minWidth: "300px" }}>
              <div className="pi">
                <div className="callout crit" style={{ marginBottom: "12px" }}>This procedure assumes phase sequence already verified at installation. Never skip phase sequence check on first-ever parallel connection.</div>
                <div className="sh">PART 1 — GEN 1 RUNNING AND CARRYING LOAD</div>
                {[
                  { n: "1", t: "Verify Gen 1 stable on load", s: "Hz: 60.0 ±0.5. Voltage: 480V ±2%. Oil pressure normal. Coolant temp normal. No alarms.", c: "g1c" },
                  { n: "2", t: "Start Gen 2 — no-load warm-up", s: "Crank Gen 2. Confirm oil pressure rise within 15s. Allow 3–5 min warm-up at no-load before attempting sync.", c: "g2c" },
                  { n: "3", t: "Verify Gen 2 voltage — match Gen 1", s: "Gen 2 AVR trim: adjust until Gen 2 L-L = Gen 1 L-L ±1% (480V ±5V). Use same meter for both readings.", c: "g2c" },
                  { n: "4", t: "Verify Gen 2 frequency — match Gen 1", s: "Gen 2 governor trim: adjust until Gen 2 Hz = Gen 1 Hz ±0.05 Hz. Aim for Gen 2 slightly faster (0.05–0.1 Hz) — creates slow CW synchronoscope rotation.", c: "g2c" },
                  { n: "5", t: "Observe synchronoscope", s: "Confirm slow clockwise rotation. If CCW, increase Gen 2 governor slightly. If fast, reduce. Target: one full revolution every 15–30 seconds.", c: "g2c" },
                  { n: "6", t: "Close CB2 at 11 o'clock position", s: "As synchronoscope pointer approaches 11 o'clock (on CW rotation), close CB2. Breaker mechanical delay (~80ms) lands contacts at 12 o'clock.", c: "gc" },
                  { n: "7", t: "Confirm parallel — check both ammeters", s: "Both machines should immediately show load current. Watch for reverse power indication — if Gen 1 drops to zero and Gen 2 goes high, a droop mismatch exists.", c: "gc" },
                  { n: "8", t: "Trim governor to equalize load share", s: "If Gen 1 carrying 70% and Gen 2 carrying 30%: slightly increase Gen 2 governor setting (raises speed → takes more load). Adjust in small increments.", c: "gc" },
                ].map(s => (
                  <div className="step" key={s.n}>
                    <div className={`step-n ${s.c}`}>{s.n}</div>
                    <div className="step-body">
                      <div className="step-title">{s.t}</div>
                      <div className="step-sub">{s.s}</div>
                    </div>
                  </div>
                ))}
                <div className="sh" style={{ marginTop: "16px" }}>PART 2 — REMOVING GEN 2 FROM PARALLEL</div>
                {[
                  { n: "A", t: "Transfer load to Gen 1", s: "Reduce Gen 2 governor until Gen 2 ammeter drops to near-zero. Gen 1 governor automatically picks up the load.", c: "g1c" },
                  { n: "B", t: "Verify Gen 2 at near zero kW", s: "Gen 2 ammeter should read < 5A (reactive only). If reverse power relay activates (red light), slightly increase Gen 2 governor.", c: "g1c" },
                  { n: "C", t: "Open CB2", s: "Manually open Gen 2 breaker. Full load now on Gen 1. Verify Gen 1 not overloaded.", c: "rc" },
                  { n: "D", t: "Cool down Gen 2 — unloaded run", s: "Run Gen 2 at no-load for 3–5 min to cool turbo and exhaust. Then normal stop sequence via DSE.", c: "g2c" },
                ].map(s => (
                  <div className="step" key={s.n}>
                    <div className={`step-n ${s.c}`}>{s.n}</div>
                    <div className="step-body">
                      <div className="step-title">{s.t}</div>
                      <div className="step-sub">{s.s}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="col" style={{ flex: 1, minWidth: "240px" }}>
              <div className="panel g2b" data-label="Automatic Parallel — DSE Load Demand Start">
                <div className="pi">
                  <div className="sh">AUTOMATIC STAGING SEQUENCE</div>
                  {[
                    { n: "1", t: "Gen 1 running as primary", s: "DSE in Auto mode, monitoring Gen 1 load% via CT inputs. Gen 2 in standby (warm, ready)" },
                    { n: "2", t: "Gen 1 load > 80% threshold", s: "DSE logic triggers Gen 2 start command. 80% of 45kW prime = 36kW load trigger." },
                    { n: "3", t: "Gen 2 auto-cranks and runs up", s: "DSE 7310 MKII auto-cranks Gen 2. Monitors frequency and voltage until within sync window." },
                    { n: "4", t: "Auto-sync module trims Gen 2", s: "DSE ramps Gen 2 governor until ΔHz < 0.2. Ramps AVR until ΔV < 2%." },
                    { n: "5", t: "DSE confirms sync window — closes CB2", s: "ANSI 25 sync check confirms all conditions. DSE energizes CB2 close coil." },
                    { n: "6", t: "Load share link balances kW", s: "DSENet 2-wire link communicates load% between units. Both DSEs trim governors to equalize." },
                    { n: "7", t: "Load drops below stop threshold", s: "When total load < 40% for > 5 min, DSE initiates Gen 2 remove sequence automatically." },
                  ].map(s => (
                    <div className="step" key={s.n}>
                      <div className="step-n g2c">{s.n}</div>
                      <div><div className="step-title">{s.t}</div><div className="step-sub">{s.s}</div></div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="panel busb" data-label="Pre-Parallel Checklist — Before First Connection">
                <div className="pi">
                  {[
                    "☐ Phase sequence verified (rotation meter on each machine independently)",
                    "☐ Gen 2 neutral-ground bond removed / floated",
                    "☐ CB2 confirmed OPEN and mechanically locked",
                    "☐ Both AVRs set to same voltage droop %",
                    "☐ Both governors set to same droop %",
                    "☐ ANSI 25 sync check relay wired and tested",
                    "☐ ANSI 32 reverse power relay on EACH machine",
                    "☐ DSENet 2-wire load share cable installed",
                    "☐ Both machines run-tested independently at 100% load",
                    "☐ Voltage trim pots accessible on both AVRs",
                    "☐ Governor speed trim accessible on both engines",
                    "☐ Camlock bus connections torqued and secured",
                    "☐ Bus cable ampacity verified for 150A combined",
                  ].map((item, i) => (
                    <div key={i} style={{ fontFamily: "var(--mono)", fontSize: "10px", color: "var(--text-md)", padding: "4px 0", borderBottom: "1px solid var(--border)" }}>{item}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 6: COMMON FAULTS ── */}
      {tab === 6 && (
        <div className="body">
          <div className="row">
            <div className="panel rb" data-label="Common Parallel Faults — Field Experience" style={{ flex: 2, minWidth: "320px" }}>
              <div className="pi">
                {[
                  {
                    t: "One machine carrying all the load — other at zero kW",
                    sev: "OPERATIONAL",
                    c: "#e8a020",
                    cause: "Governor droop mismatch between machines. The machine with tighter droop (lower %) grabs all real load. Common when two machines come from different manufacturers or when governor has been touched since installation.",
                    diagnosis: "Read Hz at no-load on each machine with CB open. They should match. If one reads 61.5 Hz and other reads 62.5 Hz at no-load with same 5% droop — the 61.5 Hz machine has tighter effective droop.",
                    fix: "Adjust both governors so no-load speed matches (both should read same Hz with CB2 open). Re-parallel and verify both ammeters show approximately equal current.",
                  },
                  {
                    t: "High amps but low kW — high kVAR circulating between machines",
                    sev: "OPERATIONAL",
                    c: "#e8a020",
                    cause: "AVR voltage droop mismatch. One machine is over-excited (high V trim), other under-excited. Reactive current circulates between machines via the bus even with no load connected. A common symptom is one machine running hot despite low kW load.",
                    diagnosis: "Disconnect load. With both CBs closed and no external load: Gen 1 ammeter and Gen 2 ammeter both read significantly above zero. Check PF meters — one near 0 leading, one near 0 lagging.",
                    fix: "Adjust AVR voltage trim on both machines so unloaded L-L bus voltage is identical. Add reactive droop (compounding) to both AVRs — typically 3–5% via internal trim pot on Stamford SX460 / Leroy Somer R449.",
                  },
                  {
                    t: "CB2 won't close — sync check relay blocking",
                    sev: "OPERATIONAL",
                    c: "#3090e0",
                    cause: "ANSI 25 sync check doing its job. One or more sync window conditions not being met: ΔV too large, Δf too large, or phase angle drifting too fast to permit stable closure.",
                    diagnosis: "Read Gen 1 and Gen 2 voltmeters and frequency meters simultaneously. Check synchronoscope rotation speed — if rotating more than 1 revolution per 10 seconds, Δf is too large.",
                    fix: "Reduce Gen 2 governor trim to slow synchronoscope rotation. Adjust Gen 2 AVR trim to match voltage. Be patient — manual sync on rental sets with no fine governor control can take 2–5 minutes.",
                  },
                  {
                    t: "Reverse power relay trips Gen 2 immediately after CB2 closes",
                    sev: "WARNING",
                    c: "#f03030",
                    cause: "Gen 2 governor set too slow — incoming at lower frequency than bus. When CB2 closes, bus drives Gen 2 alternator as a motor (generator becomes synchronous motor). Reverse power relay correctly trips.",
                    diagnosis: "Observe synchronoscope before closure — was it rotating counter-clockwise? That indicates Gen 2 slower than bus.",
                    fix: "Increase Gen 2 governor speed slightly before re-attempting. Incoming machine must be fractionally faster than bus (0.05–0.1 Hz). Slow CW synchronoscope rotation = correct.",
                  },
                  {
                    t: "Load oscillation / hunting — both machines swing simultaneously",
                    sev: "WARNING",
                    c: "#f03030",
                    cause: "Governor stability interaction. Two governors fighting each other — one picks up load, overshoots, hands back to other. Worse with isochronous governors at same gain settings. The 1–3 Hz oscillation can excite mechanical resonance.",
                    diagnosis: "Both ammeters oscillating in opposite phase (one up while other down). Frequency meter swinging ±0.5 Hz at 1–3 Hz rate.",
                    fix: "Switch one machine's governor to droop mode if currently in isochronous mode. Increase governor stability/damping trim on both. Reduce governor gain on more sensitive unit.",
                  },
                  {
                    t: "GFCI devices tripping for no apparent reason",
                    sev: "WARNING",
                    c: "#e0d020",
                    cause: "Two neutral-ground bonds — ground loop current causing stray 5mA+ ground currents that trigger GFCI devices. Almost always means Gen 2 neutral is bonded at the generator frame AND at the bus.",
                    diagnosis: "Clamp meter on neutral conductor between Gen 2 and bus — any reading above 2–3A with no load on indicates circulating ground current.",
                    fix: "Remove the neutral-ground bond at Gen 2 generator frame. The bond must exist ONLY at the common bus or switchgear ground bus. This is NEC 250.35 compliance.",
                  },
                  {
                    t: "Phase sequence reversed — catastrophic failure",
                    sev: "CRITICAL",
                    c: "#f03030",
                    cause: "Gen 2 wired with reversed phase sequence (L1-L3-L2 instead of L1-L2-L3). Closing CB2 creates a three-phase bolted fault between machines. Fault current is limited only by alternator impedance (~10–15% subtransient reactance) = 6–10× rated current for 50–100ms until breakers trip.",
                    diagnosis: "If it has already happened: both machines tripped immediately on CB closure, possibly with loud bang. Inspect alternator windings, stator, coupling for damage.",
                    fix: "Before any parallel work: verify with phase rotation meter independently on each machine. If reversed: swap any two output phases at Gen 2 terminals ONLY. Re-verify. Never rely on visual cable color alone — wiring errors happen.",
                  },
                ].map((f, i) => (
                  <div key={i} style={{ padding: "12px 0", borderBottom: "1px solid var(--border)" }}>
                    <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "6px" }}>
                      <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: f.c, flexShrink: 0, boxShadow: `0 0 5px ${f.c}66` }} />
                      <div style={{ fontFamily: "var(--mono)", fontSize: "9px", padding: "2px 8px", border: `1px solid ${f.c}`, color: f.c, fontWeight: "700" }}>{f.sev}</div>
                      <div style={{ fontWeight: "700", fontSize: "14px" }}>{f.t}</div>
                    </div>
                    <div style={{ paddingLeft: "18px" }}>
                      <div style={{ fontSize: "12px", color: "var(--text-md)", marginBottom: "4px" }}><b style={{ color: "#6080a0", fontFamily: "var(--mono)", fontSize: "10px" }}>CAUSE: </b>{f.cause}</div>
                      <div style={{ fontSize: "12px", color: "var(--text-md)", marginBottom: "4px" }}><b style={{ color: "#a0c060", fontFamily: "var(--mono)", fontSize: "10px" }}>DIAGNOSIS: </b>{f.diagnosis}</div>
                      <div style={{ fontSize: "12px", color: "var(--green)" }}><b style={{ fontFamily: "var(--mono)", fontSize: "10px" }}>FIX: </b>{f.fix}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="col" style={{ flex: 1, minWidth: "240px" }}>
              <div className="panel g1b" data-label="Operational Outcomes — What You Get">
                <div className="pi">
                  <table className="stbl">
                    <tbody>
                      <tr className="hdr-row"><td colSpan="2">COMBINED SYSTEM OUTCOMES</td></tr>
                      <tr className="gc"><td>Total available power</td><td>100kW standby</td></tr>
                      <tr className="gc"><td>Continuous prime capacity</td><td>90kW (both running)</td></tr>
                      <tr><td>Redundancy</td><td>N+1 — one fails, 50kW survives</td></tr>
                      <tr><td>Per-machine load @ 50% share</td><td>45kW = 100% prime rate</td></tr>
                      <tr><td>Per-machine load @ 50kW total</td><td>25kW = 55% prime (optimal)</td></tr>
                      <tr><td>Engine life at 55% load</td><td>25–30% longer vs continuous 90%</td></tr>
                      <tr><td>Fuel burn @ 60kW total</td><td>~3.8 GPH combined (1.9 each)</td></tr>
                      <tr><td>Fuel burn @ 90kW total</td><td>~6.7 GPH combined</td></tr>
                      <tr className="hdr-row"><td colSpan="2">WHAT DOES NOT CHANGE</td></tr>
                      <tr><td>Output voltage</td><td>Still 480V — bus sets voltage</td></tr>
                      <tr><td>Output frequency</td><td>Still 60Hz — governor droop sets</td></tr>
                      <tr><td>Single-machine fault contribution</td><td>Each machine protects itself</td></tr>
                      <tr className="hdr-row"><td colSpan="2">PROFESSIONAL RECOMMENDATION</td></tr>
                      <tr><td>Best operating range</td><td>60–80% of combined prime (54–72kW)</td></tr>
                      <tr><td>Never exceed</td><td>90kW combined (prime limit)</td></tr>
                      <tr><td>Standby headroom to 100kW</td><td>Max 500 hrs/yr, no overload</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="panel pb" data-label="40-Year Field Notes">
                <div className="pi">
                  <div style={{ fontSize: "13px", lineHeight: "1.7", color: "var(--text-hi)" }}>
                    <p style={{ marginBottom: "10px" }}>In 40 years I've seen every mistake made when paralleling rental sets. The most common: skipping phase rotation check because "the cables are color coded." Colors mean nothing if someone miswired a camlock connector. Always verify with a meter.</p>
                    <p style={{ marginBottom: "10px" }}>The second most common: connecting the neutrals of both machines to the same ground bus without understanding you've created two bonds. Suddenly every GFCI in the system nuisance-trips and the site super is screaming at you at 11pm.</p>
                    <p style={{ marginBottom: "10px" }}>Droop matching: never assume two generators from the same manufacturer have the same effective droop just because they're the same model. Governors drift over time. Always verify no-load Hz on each machine independently before attempting to parallel.</p>
                    <p>The synchronoscope is your best friend. If it's rotating fast — do not close that breaker. Slow down the incoming machine. Wait. A bad close will cost you both alternators and a very uncomfortable conversation with the rental company.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}