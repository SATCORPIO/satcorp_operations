import { useState, useEffect, useRef } from "react";


/* ══════════════════════════════════════════════════════════════════════
   DUAL 450kW GENSET — PARALLEL OPERATION ENGINEERING REFERENCE
   Engine: Cummins QSX15-G9 × 2 | Combined: 900kW / 1,125kVA
   Verified: Cummins D-3400 (10/17) Data Sheet
   ══════════════════════════════════════════════════════════════════════ */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;700&display=swap');
:root {
  --bg0:#050709; --bg1:#0b1018; --bg2:#0e1720; --bg3:#12202c;
  --bdr:#182838; --bdr2:#1e3448;
  --g1:#e8920a; --g1b:#ffc040;
  --g2:#18c0c8; --g2b:#50e0e8;
  --bus:#2888e0; --busb:#58b0ff;
  --gr:#22d855; --gr2:#16a83c;
  --re:#f02828; --re2:#ff6858;
  --ye:#d8c818; --yb:#fff060;
  --pu:#9030d8; --pu2:#c060ff;
  --tx:#c0deff; --tm:#507890; --tl:#284060;
  --mo:'JetBrains Mono',monospace; --sa:'Rajdhani',sans-serif;
}
*{box-sizing:border-box;margin:0;padding:0;}
html,body{background:var(--bg0);}
.app{font-family:var(--sa);background:var(--bg0);color:var(--tx);min-height:100vh;}
.hdr{display:flex;align-items:center;justify-content:space-between;padding:10px 22px;background:var(--bg1);border-bottom:2px solid var(--g1);flex-wrap:wrap;gap:8px;}
.hl{display:flex;align-items:center;gap:14px;}
.tag{font-family:var(--mo);font-size:9px;letter-spacing:2px;padding:4px 12px;font-weight:700;}
.tg1{background:var(--g1);color:#000;}
.tg2{background:var(--g2);color:#000;}
.tbus{background:var(--bus);color:#fff;}
.h1{font-size:19px;font-weight:700;letter-spacing:3px;text-transform:uppercase;}
.hsub{font-family:var(--mo);font-size:9px;color:var(--tm);letter-spacing:1px;}
.sstat{display:flex;gap:14px;align-items:center;}
.ss{display:flex;flex-direction:column;align-items:center;gap:2px;}
.sdot{width:9px;height:9px;border-radius:50%;}
.sdot.on{animation:bk 1.5s ease-in-out infinite;}
@keyframes bk{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(.85)}}
.slbl{font-family:var(--mo);font-size:8px;letter-spacing:1.5px;text-transform:uppercase;}
.htime{font-family:var(--mo);font-size:10px;color:var(--tm);}

.tabs{display:flex;background:var(--bg1);border-bottom:1px solid var(--bdr);padding:0 22px;overflow-x:auto;}
.tab{padding:11px 18px;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;cursor:pointer;color:var(--tl);border-bottom:2px solid transparent;transition:all .15s;background:none;border-top:none;border-left:none;border-right:none;font-family:var(--sa);white-space:nowrap;}
.tab:hover{color:var(--tm);}
.tab.ac{color:var(--g1);border-bottom-color:var(--g1);}

.body{padding:16px;display:flex;flex-direction:column;gap:14px;}
.row{display:flex;gap:14px;flex-wrap:wrap;}
.col{display:flex;flex-direction:column;gap:14px;}
.panel{background:var(--bg2);border:1px solid var(--bdr);position:relative;overflow:hidden;}
.panel[data-lbl]::before{content:attr(data-lbl);position:absolute;top:0;left:0;font-family:var(--mo);font-size:8px;letter-spacing:1.5px;padding:3px 10px;background:var(--bdr);color:var(--tm);text-transform:uppercase;z-index:2;}
.pi{padding:28px 16px 16px;}
.pi.nl{padding:16px;}
.g1b{border-top:2px solid var(--g1);}
.g2b{border-top:2px solid var(--g2);}
.bub{border-top:2px solid var(--bus);}
.rb{border-top:2px solid var(--re);}
.gb{border-top:2px solid var(--gr);}
.pb{border-top:2px solid var(--pu);}

.st{width:100%;border-collapse:collapse;font-size:13px;}
.st td{padding:5px 10px;border-bottom:1px solid var(--bdr);}
.st td:first-child{color:var(--tm);font-family:var(--mo);font-size:9px;letter-spacing:.5px;text-transform:uppercase;width:50%;}
.st td:last-child{color:var(--g1b);font-weight:700;text-align:right;}
.st tr:last-child td{border-bottom:none;}
.st .hr td{color:var(--tx)!important;font-size:9px!important;font-weight:700;background:var(--bg3);letter-spacing:2px!important;}
.st .gc td:last-child{color:var(--gr);}
.st .rc td:last-child{color:var(--re2);}
.st .bc td:last-child{color:var(--busb);}
.st .yc td:last-child{color:var(--ye);}

.sh{font-family:var(--mo);font-size:8px;letter-spacing:3px;color:var(--tm);text-transform:uppercase;margin-bottom:10px;display:flex;align-items:center;gap:8px;}
.sh::after{content:'';flex:1;height:1px;background:var(--bdr);}

.co{border-left:3px solid;padding:9px 13px;margin:8px 0;font-family:var(--mo);font-size:9px;line-height:1.6;}
.co.warn{border-color:var(--ye);color:var(--yb);background:#0e0e00;}
.co.crit{border-color:var(--re);color:var(--re2);background:#0e0000;}
.co.info{border-color:var(--bus);color:var(--busb);background:#000810;}
.co.ok{border-color:var(--gr);color:var(--gr);background:#000e04;}

.step{display:flex;gap:12px;align-items:flex-start;padding:8px 0;border-bottom:1px solid var(--bdr);}
.step:last-child{border-bottom:none;}
.sn{width:24px;height:24px;border-radius:1px;display:flex;align-items:center;justify-content:center;font-family:var(--mo);font-size:10px;font-weight:700;flex-shrink:0;}
.sg1{background:var(--g1);color:#000;}
.sg2{background:var(--g2);color:#000;}
.src{background:var(--re);color:#fff;}
.sgc{background:var(--gr2);color:#000;}
.stitle{font-size:14px;font-weight:700;}
.ssub{font-family:var(--mo);font-size:9px;color:var(--tm);margin-top:2px;line-height:1.5;}

.fi{display:flex;align-items:center;gap:10px;padding:7px 10px;border-bottom:1px solid var(--bdr);font-size:13px;}
.fi:last-child{border-bottom:none;}
.fdot{width:8px;height:8px;border-radius:50%;flex-shrink:0;}
.fb{font-family:var(--mo);font-size:9px;padding:2px 6px;border:1px solid;font-weight:700;min-width:58px;text-align:center;}

.tog{padding:7px 16px;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;cursor:pointer;font-family:var(--sa);border:1px solid var(--bdr);background:var(--bg1);color:var(--tl);transition:all .15s;}
.tog:hover{color:var(--tm);}
.tog.on{background:var(--bg3);border-color:var(--g1);color:var(--g1b);}

@keyframes fR{from{stroke-dashoffset:20}to{stroke-dashoffset:0}}
@keyframes fL{from{stroke-dashoffset:0}to{stroke-dashoffset:20}}
.ff{stroke:#e8920a;stroke-width:2.5;fill:none;stroke-dasharray:7 4;animation:fR .5s linear infinite;}
.fe{stroke:#2888e0;stroke-width:2;fill:none;stroke-dasharray:9 4;animation:fR .35s linear infinite;}
.fc{stroke:#18c0c8;stroke-width:2;fill:none;stroke-dasharray:7 4;animation:fR .7s linear infinite;}
.fx{stroke:#806040;stroke-width:2;fill:none;stroke-dasharray:5 5;animation:fR .9s linear infinite;}
.fk{stroke:#d8c818;stroke-width:1.5;fill:none;stroke-dasharray:4 4;animation:fR 1.1s linear infinite;}
`;

/* ── SYNCHRONOSCOPE ── */
function Synchro({ rate, inSync }) {
  const ref = useRef(null), fr = useRef(null), ang = useRef(0);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d"), W = c.width, H = c.height, cx = W / 2, cy = H / 2, r = W / 2 - 8;
    const xy = d => ({ x: cx + r * Math.cos(d * Math.PI / 180), y: cy + r * Math.sin(d * Math.PI / 180) });
    const draw = () => {
      ctx.clearRect(0, 0, W, H); ctx.fillStyle = "#060a0e"; ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = "#1a3050"; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx, cy, r + 4, 0, Math.PI * 2); ctx.stroke();
      const sz = 15 * Math.PI / 180;
      ctx.strokeStyle = "#083018"; ctx.lineWidth = 14; ctx.beginPath(); ctx.arc(cx, cy, r - 4, -Math.PI / 2 - sz, -Math.PI / 2 + sz); ctx.stroke();
      ctx.strokeStyle = "#0a1820"; ctx.lineWidth = 14; ctx.beginPath(); ctx.arc(cx, cy, r - 4, -Math.PI / 2 + sz, -Math.PI / 2 - sz + 2 * Math.PI); ctx.stroke();
      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
        const x1 = cx + (r - 10) * Math.cos(a), y1 = cy + (r - 10) * Math.sin(a);
        const x2 = cx + (r - 2) * Math.cos(a), y2 = cy + (r - 2) * Math.sin(a);
        ctx.strokeStyle = i === 0 ? "#22d855" : "#1a3050"; ctx.lineWidth = i === 0 ? 2.5 : 1;
        ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      }
      ctx.fillStyle = "#22d855"; ctx.font = "bold 11px 'JetBrains Mono'"; ctx.textAlign = "center"; ctx.fillText("SYNC", cx, cy - r + 24);
      ctx.fillStyle = "#1a3050"; ctx.font = "9px 'JetBrains Mono'";
      ctx.fillText("FAST →", cx + r - 30, cy + 10); ctx.fillText("← SLOW", cx - r + 30, cy + 10);
      ang.current = (ang.current + rate * 0.016) % 360;
      const a = (ang.current - 90) * Math.PI / 180;
      ctx.shadowColor = inSync ? "#22d855" : "#e8920a"; ctx.shadowBlur = inSync ? 15 : 6;
      const nx = cx + (r - 12) * Math.cos(a), ny = cy + (r - 12) * Math.sin(a);
      ctx.strokeStyle = inSync ? "#22d855" : "#e8920a"; ctx.lineWidth = 2.5; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(nx, ny); ctx.stroke();
      ctx.shadowBlur = 0; ctx.fillStyle = inSync ? "#22d855" : "#e8920a";
      ctx.beginPath(); ctx.arc(cx, cy, 5, 0, Math.PI * 2); ctx.fill();
      const near = Math.abs(((ang.current + 180) % 360) - 180) < 15;
      if (near) { ctx.fillStyle = "#22d86080"; ctx.fillRect(0, H - 22, W, 22); ctx.fillStyle = "#22d860"; ctx.font = "bold 11px 'JetBrains Mono'"; ctx.textAlign = "center"; ctx.fillText("◀ CLOSE BREAKER ▶", cx, H - 7); }
      fr.current = requestAnimationFrame(draw);
    }; draw(); return () => cancelAnimationFrame(fr.current);
  }, [rate, inSync]);
  return <canvas ref={ref} width={170} height={170} style={{ display: "block" }} />;
}

/* ── SINGLE-LINE DIAGRAM ── */
function SLD({ g2 }) {
  const par = g2 === "paralleled", run = g2 === "running" || par;
  const [off, setOff] = useState(0);
  useEffect(() => { const iv = setInterval(() => setOff(o => (o + 1) % 20), 50); return () => clearInterval(iv); }, []);
  return (
    <svg width="100%" viewBox="0 0 900 370" style={{ maxWidth: "100%", minHeight: "220px" }}>
      <defs>
        {[["arG1", "#e8920a"], ["arG2", "#18c0c8"], ["arBus", "#2888e0"], ["arLd", "#22d855"]].map(([id, c]) => (
          <marker key={id} id={id} markerWidth="6" markerHeight="5" refX="6" refY="2.5" orient="auto"><polygon points="0 0,6 2.5,0 5" fill={c} /></marker>
        ))}
        <filter id="gw1"><feGaussianBlur stdDeviation="2" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        <filter id="gw2"><feGaussianBlur stdDeviation="2" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
      </defs>

      {/* GEN 1 */}
      <circle cx="88" cy="88" r="48" fill="#0e1a0a" stroke="#e8920a" strokeWidth="2" filter="url(#gw1)" />
      <text x="88" y="80" textAnchor="middle" fill="#e8920a" fontSize="15" fontFamily="'JetBrains Mono'" fontWeight="700">GEN 1</text>
      <text x="88" y="98" textAnchor="middle" fill="#e8920a" fontSize="12" fontFamily="'JetBrains Mono'">450kW</text>
      <text x="88" y="112" textAnchor="middle" fill="#6a8060" fontSize="10" fontFamily="'JetBrains Mono'">QSX15-G9</text>
      {/* CB1 */}
      <rect x="60" y="152" width="56" height="34" fill="#1a0e00" stroke="#e8920a" strokeWidth="1.5" rx="1" />
      <text x="88" y="166" textAnchor="middle" fill="#e8920a" fontSize="12" fontFamily="'JetBrains Mono'" fontWeight="700">CB1</text>
      <text x="88" y="180" textAnchor="middle" fill="#22d855" fontSize="10" fontFamily="'JetBrains Mono'">1200A CLOSED</text>
      <line x1="88" y1="132" x2="88" y2="152" stroke="#e8920a" strokeWidth="3" strokeDasharray="7,4" strokeDashoffset={-off} />
      {/* ANSI relays */}
      {[["32", 64, 148], ["25", 112, 148]].map(([n, x, y]) => (
        <g key={n}><circle cx={x} cy={y} r="10" fill="#0a0808" stroke="#e8920a" strokeWidth="1" />
          <text x={x} y={y + 4} textAnchor="middle" fill="#e8920a" fontSize="10" fontFamily="'JetBrains Mono'" fontWeight="700">{n}</text></g>
      ))}
      <line x1="88" y1="182" x2="88" y2="220" stroke="#e8920a" strokeWidth="3" strokeDasharray="7,4" strokeDashoffset={-off} />
      <line x1="88" y1="220" x2="295" y2="220" stroke="#e8920a" strokeWidth="3" strokeDasharray="7,4" strokeDashoffset={-off} markerEnd="url(#arG1)" />

      {/* GEN 2 */}
      <circle cx="88" cy="310" r="48" fill={run ? "#0a1a1a" : "#0d0d0d"} stroke={run ? "#18c0c8" : "#2a4040"} strokeWidth="2" filter={run ? "url(#gw2)" : ""} />
      <text x="88" y="302" textAnchor="middle" fill={run ? "#18c0c8" : "#2a5050"} fontSize="15" fontFamily="'JetBrains Mono'" fontWeight="700">GEN 2</text>
      <text x="88" y="320" textAnchor="middle" fill={run ? "#18c0c8" : "#2a5050"} fontSize="12" fontFamily="'JetBrains Mono'">450kW</text>
      <text x="88" y="334" textAnchor="middle" fill={run ? "#407080" : "#1a3030"} fontSize="10" fontFamily="'JetBrains Mono'">QSX15-G9</text>
      {/* CB2 */}
      <rect x="60" y="220" width="56" height="34" fill={par ? "#001a1a" : "#0a0a0a"} stroke={par ? "#18c0c8" : "#2a4040"} strokeWidth="1.5" rx="1" />
      <text x="88" y="234" textAnchor="middle" fill={par ? "#18c0c8" : "#2a5050"} fontSize="12" fontFamily="'JetBrains Mono'" fontWeight="700">CB2</text>
      <text x="88" y="248" textAnchor="middle" fill={par ? "#22d855" : "#882020"} fontSize="10" fontFamily="'JetBrains Mono'">{par ? "1200A CLOSED" : "OPEN"}</text>
      <line x1="88" y1="250" x2="88" y2="266" stroke={par ? "#18c0c8" : "#1a3030"} strokeWidth="3" strokeDasharray={par ? "7,4" : "2,4"} strokeDashoffset={par ? -off : 0} />
      {par && [["32", 64, 248], ["25", 112, 248]].map(([n, x, y]) => (
        <g key={n}><circle cx={x} cy={y} r="10" fill="#080a0a" stroke="#18c0c8" strokeWidth="1" />
          <text x={x} y={y + 4} textAnchor="middle" fill="#18c0c8" fontSize="10" fontFamily="'JetBrains Mono'" fontWeight="700">{n}</text></g>
      ))}
      <line x1="88" y1="250" x2="88" y2="220" stroke={par ? "#18c0c8" : "#1a3030"} strokeWidth="3" strokeDasharray={par ? "7,4" : "2,4"} strokeDashoffset={par ? -off : 0} />
      <line x1="88" y1="220" x2="295" y2="220" stroke={par ? "#18c0c8" : "#1a3030"} strokeWidth={par ? 3 : 1.5} strokeDasharray={par ? "7,4" : "2,4"} strokeDashoffset={par ? -off : 0} markerEnd={par ? "url(#arG2)" : ""} />
      {/* Gen 2 to CB2 lower */}
      <line x1="88" y1="266" x2="88" y2="266" stroke={par ? "#18c0c8" : "#1a3030"} strokeWidth="3" />

      {/* COMMON BUS */}
      <rect x="295" y="204" width="280" height="40" fill="#0a1828" stroke="#2888e0" strokeWidth="2" />
      <text x="435" y="220" textAnchor="middle" fill="#58b0ff" fontSize="15" fontFamily="'JetBrains Mono'" fontWeight="700" letterSpacing="1">480V 3φ COMMON BUS</text>
      <text x="435" y="236" textAnchor="middle" fill="#304870" fontSize="12" fontFamily="'JetBrains Mono'">900kW / 1,125kVA COMBINED STANDBY</text>

      {/* Bus protection */}
      {/* Bus protection */}
      <text x="300" y="196" fill="#d8c818" fontSize="11" fontFamily="'JetBrains Mono'">⚡ ANSI 25 SYNC CHECK (EACH CB)</text>
      <text x="300" y="258" fill="#d8c818" fontSize="11" fontFamily="'JetBrains Mono'">⚡ ANSI 32 REV POWER (EACH MACHINE)</text>
      <text x="300" y="272" fill="#d8c818" fontSize="11" fontFamily="'JetBrains Mono'">⚡ ANSI 51/50 OC (EACH MACHINE)</text>

      {/* Neutral bonding note */}
      <rect x="295" y="284" width="280" height="55" fill="#100808" stroke="#f02828" strokeWidth="1" strokeDasharray="3,2" rx="1" />
      <text x="435" y="301" textAnchor="middle" fill="#f02828" fontSize="12" fontFamily="'JetBrains Mono'" fontWeight="700">⚠ NEUTRAL BONDING — CRITICAL</text>
      <text x="435" y="316" textAnchor="middle" fill="#c05050" fontSize="11" fontFamily="'JetBrains Mono'">ONE N-G bond only. Gen 2 neutral floats.</text>
      <text x="435" y="330" textAnchor="middle" fill="#c05050" fontSize="11" fontFamily="'JetBrains Mono'">PCC3300 handles auto-isolation.</text>

      {/* Main load breaker */}
      <rect x="605" y="204" width="70" height="36" fill="#0a1a0a" stroke="#22d855" strokeWidth="1.5" rx="1" />
      <text x="640" y="219" textAnchor="middle" fill="#22d855" fontSize="12" fontFamily="'JetBrains Mono'" fontWeight="700">CB-L</text>
      <text x="640" y="233" textAnchor="middle" fill="#22d855" fontSize="10" fontFamily="'JetBrains Mono'">1600A</text>
      <line x1="545" y1="220" x2="595" y2="220" stroke="#2888e0" strokeWidth="3" strokeDasharray="7,4" strokeDashoffset={-off} markerEnd="url(#arBus)" />

      {/* Load block */}
      <rect x="675" y="188" width="160" height="85" fill="#081808" stroke="#22d855" strokeWidth="1.5" rx="2" />
      <text x="755" y="212" textAnchor="middle" fill="#22d855" fontSize="15" fontFamily="'JetBrains Mono'" fontWeight="700">LOAD</text>
      <text x="755" y="230" textAnchor="middle" fill="#18a840" fontSize="12" fontFamily="'JetBrains Mono'">0–900kW standby</text>
      <text x="755" y="246" textAnchor="middle" fill="#18a840" fontSize="12" fontFamily="'JetBrains Mono'">0–1,125kVA combined</text>
      <text x="755" y="262" textAnchor="middle" fill="#18a840" fontSize="12" fontFamily="'JetBrains Mono'">1,354A @ 480V full</text>
      <line x1="655" y1="220" x2="655" y2="220" stroke="#22d855" strokeWidth="3" strokeDasharray="7,4" strokeDashoffset={-off} markerEnd="url(#arLd)" />

      {/* Zone boxes */}
      <rect x="55" y="58" width="75" height="120" fill="none" stroke="#e8920a" strokeWidth=".5" strokeDasharray="4,4" rx="2" />
      <text x="58" y="52" fill="#e8920a" fontSize="11" fontFamily="'JetBrains Mono'">ZONE G1</text>
      {run && <><rect x="55" y="220" width="75" height="100" fill="none" stroke="#18c0c8" strokeWidth=".5" strokeDasharray="4,4" rx="2" />
        <text x="58" y="214" fill="#18c0c8" fontSize="11" fontFamily="'JetBrains Mono'">ZONE G2</text></>}

      {/* Legend */}
      {[["#e8920a", "GEN 1"], ["#18c0c8", "GEN 2"], ["#2888e0", "COMBINED BUS"], ["#22d855", "LOAD FEED"]].map(([c, l], i) => (
        <g key={i}><line x1={10 + i * 220} y1={358} x2={38 + i * 220} y2={358} stroke={c} strokeWidth="2" strokeDasharray="7,3" />
          <text x={42 + i * 220} y={361} fill="#3a6080" fontSize="11" fontFamily="'JetBrains Mono'">{l}</text></g>
      ))}
    </svg>
  );
}

/* ── DROOP CHART ── */
function Droop({ d1, d2, load }) {
  const W = 320, H = 160, pad = { l: 42, r: 22, t: 22, b: 42 }, iW = W - pad.l - pad.r, iH = H - pad.t - pad.b;
  const max = 500, fmin = 58, fmax = 64;
  const fnl1 = 60 * (1 + d1 / 100), fnl2 = 60 * (1 + d2 / 100);
  const kw2x = k => pad.l + (k / max) * iW, f2y = f => pad.t + (1 - (f - fmin) / (fmax - fmin)) * iH;
  const kw1 = load / 2, kw2 = load / 2;
  const fo1 = fnl1 - (d1 / 100) * 60 * (kw1 / max);
  const fo2 = fnl2 - (d2 / 100) * 60 * (kw2 / max);
  return (
    <svg width={W} height={H} style={{ maxWidth: "100%" }}>
      <rect x={pad.l} y={pad.t} width={iW} height={iH} fill="#060a0e" stroke="#182838" strokeWidth="1" />
      {[59, 60, 61, 62].map(f => (
        <g key={f}><line x1={pad.l} y1={f2y(f)} x2={pad.l + iW} y2={f2y(f)} stroke="#182838" strokeWidth=".5" />
          <text x={pad.l - 6} y={f2y(f) + 4} fill="#304060" fontSize="11" fontFamily="'JetBrains Mono'" textAnchor="end">{f}</text></g>
      ))}
      {[0, 100, 200, 300, 400, 500].map(k => (
        <g key={k}><line x1={kw2x(k)} y1={pad.t} x2={kw2x(k)} y2={pad.t + iH} stroke="#182838" strokeWidth=".5" />
          <text x={kw2x(k)} y={H - pad.b + 16} fill="#304060" fontSize="11" fontFamily="'JetBrains Mono'" textAnchor="middle">{k}</text></g>
      ))}
      <line x1={pad.l} y1={f2y(60)} x2={pad.l + iW} y2={f2y(60)} stroke="#1a4030" strokeWidth="1" strokeDasharray="4,4" />
      <line x1={kw2x(0)} y1={f2y(fnl1)} x2={kw2x(max)} y2={f2y(fnl1 - d1 / 100 * 60)} stroke="#e8920a" strokeWidth="2.5" />
      <text x={kw2x(10)} y={f2y(fnl1) - 6} fill="#e8920a" fontSize="11" fontFamily="'JetBrains Mono'">G1 {d1}%</text>
      <line x1={kw2x(0)} y1={f2y(fnl2)} x2={kw2x(max)} y2={f2y(fnl2 - d2 / 100 * 60)} stroke="#18c0c8" strokeWidth="2.5" />
      <text x={kw2x(10)} y={f2y(fnl2) + 14} fill="#18c0c8" fontSize="11" fontFamily="'JetBrains Mono'">G2 {d2}%</text>
      <circle cx={kw2x(kw1)} cy={f2y(fo1)} r="6" fill="#e8920a" />
      <circle cx={kw2x(kw2)} cy={f2y(fo2)} r="6" fill="#18c0c8" />
      <text x={pad.l + iW / 2} y={H - 4} fill="#3a6080" fontSize="12" fontFamily="'JetBrains Mono'" textAnchor="middle">LOAD (kW per machine)</text>
      <text x={12} y={pad.t + iH / 2} fill="#3a6080" fontSize="12" fontFamily="'JetBrains Mono'" textAnchor="middle" transform={`rotate(-90,12,${pad.t + iH / 2})`}>FREQ (Hz)</text>
    </svg>
  );
}

const TABS = ["Objective", "Single-Line", "Synchronizing", "Load Sharing", "Protection", "Procedure", "Common Faults"];

export default function App() {
  const [tab, setTab] = useState(0);
  const [g2, setG2] = useState("stopped");
  const [rate, setRate] = useState(18);
  const [load, setLoad] = useState(540);
  const [d1, setD1] = useState(5); const [d2, setD2] = useState(5);
  const [time, setTime] = useState("");
  const [g1hz, setG1hz] = useState(60.0); const [g2hz, setG2hz] = useState(60.0);
  const [g1v, setG1v] = useState(480); const [g2v, setG2v] = useState(480);
  useEffect(() => {
    const iv = setInterval(() => { setG1hz(60 + (Math.random() - .5) * .06); setG2hz(60 + (Math.random() - .5) * .12); setG1v(480 + (Math.random() - .5) * 2); setG2v(480 + (Math.random() - .5) * 2); setTime(new Date().toLocaleTimeString()); }, 700);
    return () => clearInterval(iv);
  }, []);
  const dvPct = Math.abs(g1v - g2v) / 480 * 100;
  const dfHz = Math.abs(g1hz - g2hz);
  const inSync = dvPct < 2 && dfHz < 0.2 && g2 === "running";
  const kw1 = load * (d1 === d2 ? .5 : d2 / (d1 + d2)); const kw2 = load - kw1;
  const p1 = kw1 / 450; const p2 = kw2 / 450;

  return (
    <div className="app">
      <style>{CSS}</style>
      <div className="hdr">
        <div className="hl">
          <div className="tag tg1">GEN-01</div>
          <div className="tag tg2">GEN-02</div>
          <div className="tag tbus">PARALLEL BUS</div>
          <div>
            <div className="h1">Dual 450kW — Parallel Operation</div>
            <div className="hsub">2× CUMMINS QSX15-G9 · 900kW / 1,125kVA COMBINED · 480V 3φ 60Hz · POWERCOMMAND PCC3300</div>
          </div>
        </div>
         <div className="sstat">
          {[{ c: "#e8920a", lbl: "GEN 1", hz: g1hz.toFixed(2) + "Hz", on: true }, { c: "#18c0c8", lbl: "GEN 2", hz: g2 !== "stopped" ? g2hz.toFixed(2) + "Hz" : "OFFLINE", on: g2 !== "stopped" }, { c: "#2888e0", lbl: "BUS", hz: "480V", on: true }].map((s, i) => (
            <div className="ss" key={i}>
              <div className="sdot" style={{ background: s.on ? s.c : "#1a3040", boxShadow: s.on ? `0 0 8px ${s.c}` : "none", animation: s.on ? "bk 1.5s ease-in-out infinite" : "none" }} />
              <div className="slbl" style={{ color: s.on ? s.c : "var(--tl)" }}>{s.lbl}</div>
              <div style={{ fontFamily: "var(--mo)", fontSize: "9px", color: s.on ? s.c : "var(--tl)" }}>{s.hz}</div>
            </div>
          ))}
          <div className="htime" style={{ marginLeft: 8 }}>{time}</div>
        </div>
      </div>

      <div className="tabs">
        {TABS.map((t, i) => <button key={i} className={`tab${tab === i ? " ac" : ""}`} onClick={() => setTab(i)}>{t}</button>)}
      </div>

      {/* ── TAB 0: OBJECTIVE ── */}
      {tab === 0 && (
        <div className="body">
          <div className="row">
            <div className="panel g1b" data-lbl="Engineering Objective — Why Parallel Two 450kW Sets" style={{ flex: 2, minWidth: "300px" }}>
              <div className="pi">
                <div className="sh">OPERATIONAL JUSTIFICATION</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(270px,1fr))", gap: "10px" }}>
                  {[
                    { t: "N+1 Redundancy — True Mission Critical", c: "var(--gr)", d: "Two QSX15 sets in parallel: if one machine trips mid-operation, the surviving unit carries the load instantly — no break in power. At industrial sites — data centers, hospitals, oil field operations — this is the only acceptable configuration. A single 900kW set is cheaper; two 450kW sets in parallel is survivable." },
                    { t: "900kW Combined Standby", c: "var(--g1)", d: "Combined standby: 900kW / 1,125kVA. Combined prime: 820kW / 1,025kVA. Each machine carries only 450kW at combined full load. At 60% total bus load (540kW), each machine is at 60% of its prime rating — the optimal efficiency point for fuel consumption and engine wear." },
                    { t: "Load-Following Auto-Staging", c: "var(--bus)", d: "PowerCommand PCC3300 on each unit communicates via 2-wire load share link. Gen 1 carries base load alone. When demand exceeds 80% of Gen 1 prime (328kW), PCC3300 auto-starts Gen 2, synchronizes it, and closes CB2. When load drops below the stop threshold, Gen 2 unloads and shuts down automatically." },
                    { t: "Fuel Economy at Partial Load", c: "var(--g2)", d: "At 540kW total load (60% of combined prime), each machine burns ~18 GPH — total 36 GPH for both. A single 900kW machine at 540kW (60% load) would burn ~22–24 GPH. Two machines in load-follow staging can save 30–40% fuel on sites with variable demand profiles." },
                  ].map((c, i) => (
                    <div key={i} style={{ background: "var(--bg1)", border: "1px solid var(--bdr)", borderLeft: `3px solid ${c.c}`, padding: "12px 14px" }}>
                      <div style={{ color: c.c, fontFamily: "var(--mo)", fontSize: "10px", fontWeight: "700", letterSpacing: "1px", marginBottom: "6px" }}>{c.t}</div>
                      <div style={{ fontSize: "13px", lineHeight: "1.5" }}>{c.d}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="col" style={{ flex: 1, minWidth: "220px" }}>
              <div className="panel g2b" data-lbl="Combined Output — Verified QSX15 Specs">
                <div className="pi">
                  <table className="st">
                    <tbody>
                      <tr className="hr"><td colSpan="2">COMBINED RATINGS</td></tr>
                      <tr className="gc"><td>Standby (no overload)</td><td>900kW / 1,125kVA</td></tr>
                      <tr className="gc"><td>Prime (ISO 8528)</td><td>820kW / 1,025kVA</td></tr>
                      <tr><td>Power factor basis</td><td>0.8 lagging</td></tr>
                      <tr><td>Bus voltage</td><td>480V L-L / 277V L-N</td></tr>
                      <tr><td>Full-load bus current</td><td>1,354A @ 480V 3φ</td></tr>
                      <tr><td>Per-machine at ½ load</td><td>677A @ 480V each</td></tr>
                      <tr className="hr"><td colSpan="2">N+1 SURVIVAL — ONE MACHINE TRIPS</td></tr>
                      <tr><td>Surviving unit max</td><td>450kW standby</td></tr>
                      <tr><td>Load shed above</td><td>410kW prime limit</td></tr>
                      <tr><td>Fuel (both at 100%)</td><td>60.2 GPH combined</td></tr>
                      <tr><td>Fuel (both at 60% load)</td><td>~36 GPH combined</td></tr>
                      <tr><td>Fuel (one machine, 450kW)</td><td>30.1 GPH</td></tr>
                      <tr className="hr"><td colSpan="2">CABLE / BUS SIZING</td></tr>
                      <tr><td>Per-machine feeder</td><td>677A → 2× 350MCM per phase</td></tr>
                      <tr><td>Combined bus</td><td>1,354A → copper bus duct or 4× 350MCM</td></tr>
                      <tr><td>Main load breaker</td><td>1,600A frame MCCB/ICCB</td></tr>
                      <tr><td>Gen machine breakers (CB1,CB2)</td><td>1,200A frame each</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="panel rb" data-lbl="Non-Negotiable Rules — 450kW Scale">
                <div className="pi">
                  {[
                    { r: "Phase sequence — CRITICAL", d: "Reversed phase on a 450kW machine = 3-phase fault with ~4,500A+ fault current. Both 1200A breakers will trip instantly. Alternator damage probable. Use phase rotation meter on every machine independently." },
                    { r: "Single neutral-ground bond only", d: "At 450kW, ground loop currents from dual bonding can be significant — enough to cause equipment damage, false GFCI/GFP trips, and interference with instrumentation." },
                    { r: "Sync check relay (ANSI 25) mandatory", d: "Do not wire the paralleling panel without ANSI 25 on each CB. At this power level, out-of-phase closure = catastrophic mechanical and electrical event." },
                    { r: "Match droop — both at 5%", d: "PCC3300 has integrated droop setting. Both controllers MUST be set identically. Factory default is isochronous — switch to droop mode for parallel operation." },
                    { r: "ANSI 32 reverse power on each machine", d: "Essential at 450kW. Without reverse power protection, a stalled machine is motored by the bus — draws ~80–150kW as a motor. CB may not trip on its own." },
                    { r: "LSIG trip coordination required", d: "Both machine breakers AND the main load breaker need coordinated LSIG settings. The fault should trip the machine CB, not the main bus breaker. Coordination study required." },
                  ].map((r, i) => (
                    <div key={i} style={{ padding: "7px 0", borderBottom: "1px solid var(--bdr)", display: "flex", gap: "10px" }}>
                      <div style={{ color: "var(--re2)", fontFamily: "var(--mo)", fontSize: "10px", fontWeight: "700", flexShrink: 0, marginTop: "1px" }}>⚠</div>
                      <div>
                        <div style={{ color: "var(--re2)", fontFamily: "var(--mo)", fontSize: "10px", fontWeight: "700" }}>{r.r}</div>
                        <div style={{ fontSize: "12px", color: "var(--tm)", marginTop: "2px" }}>{r.d}</div>
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
          <div style={{ display: "flex", gap: "8px", marginBottom: "0", flexWrap: "wrap" }}>
            {[["stopped", "Gen 2: Offline"], ["running", "Gen 2: Running / Syncing"], ["paralleled", "Gen 2: Paralleled (CB2 Closed)"]].map(([v, l]) => (
              <button key={v} className={`tog${g2 === v ? " on" : ""}`} onClick={() => setG2(v)}>{l}</button>
            ))}
          </div>
          <div className="panel bub" data-lbl="Single-Line Diagram — Dual 450kW Parallel Bus">
            <div className="pi"><SLD g2={g2} /></div>
          </div>
          <div className="row">
            <div className="panel g1b" data-lbl="Cable & Bus Sizing — 450kW Scale" style={{ flex: 1 }}>
              <div className="pi">
                <table className="st">
                  <tbody>
                    <tr className="hr"><td colSpan="2">MACHINE FEEDER — EACH GEN</td></tr>
                    <tr><td>Machine output current</td><td>677A / phase (standby)</td></tr>
                    <tr><td>Feeder cable (125% NEC 445.13)</td><td>846A → 2× 350MCM CU per phase</td></tr>
                    <tr><td>Conduit (per 3-phase set)</td><td>4" rigid conduit minimum</td></tr>
                    <tr><td>Machine breaker (CB1, CB2)</td><td>1,200A frame, 900A trip (LSIG)</td></tr>
                    <tr className="hr"><td colSpan="2">COMMON BUS — BOTH MACHINES</td></tr>
                    <tr><td>Combined bus current</td><td>1,354A total at 900kW</td></tr>
                    <tr><td>Bus cable / busway</td><td>Copper bus duct 1600A OR 4× 350MCM per phase</td></tr>
                    <tr><td>Main load breaker (CB-L)</td><td>1,600A frame MCCB or ICCB (LSIG)</td></tr>
                    <tr><td>Bus rating</td><td>480V / 2000A copper bus</td></tr>
                    <tr className="hr"><td colSpan="2">NEUTRAL — CRITICAL</td></tr>
                    <tr className="rc"><td>Gen 1 neutral</td><td>BONDED to enclosure/bus GND</td></tr>
                    <tr className="gc"><td>Gen 2 neutral</td><td>FLOATING — no bond at Gen 2</td></tr>
                    <tr><td>Neutral conductor</td><td>Same size as phase (2× 350MCM)</td></tr>
                    <tr><td>PCC3300 parallel card</td><td>Handles auto neutral isolation</td></tr>
                    <tr className="hr"><td colSpan="2">PROTECTION RELAY WIRING</td></tr>
                    <tr><td>ANSI 25 sync check</td><td>Wired to CB2 close coil (blocks closure)</td></tr>
                    <tr><td>ANSI 32 reverse power CT</td><td>On each machine output conductors</td></tr>
                    <tr><td>Coordination study</td><td>Required — LSIG settings per arc flash study</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="panel g2b" data-lbl="Phase Sequence Verification — 450kW" style={{ flex: 1 }}>
              <div className="pi">
                <div className="co crit">⚠ At 450kW, a phase sequence reversal will generate 3-phase fault current limited only by subtransient reactance (~10–15% Xd") = 3,000–4,500A for 50–150ms. Both 1200A breakers trip on instantaneous (ANSI 50). Alternator stator winding damage is probable. Do not skip this check.</div>
                <div className="sh" style={{ marginTop: "10px" }}>VERIFICATION PROCEDURE</div>
                {[
                  { n: "1", t: "De-energize both machines", s: "Confirm CB1 and CB2 open and locked. Tag out per LOTO." },
                  { n: "2", t: "Start Gen 1 alone — no load", s: "Close CB1. Use phase rotation meter on bus terminals. Confirm A-B-C (clockwise rotation)." },
                  { n: "3", t: "Open CB1. Start Gen 2 alone", s: "Close CB2 only. Measure A-B-C rotation on same bus terminals. Must match Gen 1 exactly." },
                  { n: "4", t: "Compare voltage magnitude", s: "Both machines should show 480V ±3%. If significantly different, check AVR trim before proceeding." },
                  { n: "5", t: "Open CB2. Phase sequence confirmed", s: "Document result. Label each phase at bus. Use color-coded bus tape and permanent markers." },
                  { n: "6", t: "Never rely on cable colors", s: "Camlock connectors are frequently wired incorrectly at plug-end. Verify with meter every time." },
                ].map(s => (
                  <div className="step" key={s.n}>
                    <div className="sn sg2">{s.n}</div>
                    <div><div className="stitle">{s.t}</div><div className="ssub">{s.s}</div></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2: SYNC ── */}
      {tab === 2 && (
        <div className="body">
          <div className="row">
            <div className="panel g2b" data-lbl="Synchronoscope — Live Simulation" style={{ flex: "0 0 auto" }}>
              <div className="pi">
                <div style={{ display: "flex", gap: "16px", alignItems: "flex-start", flexWrap: "wrap" }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                    <Synchro rate={rate} inSync={rate < 6} />
                    <div style={{ fontFamily: "var(--mo)", fontSize: "8px", color: "var(--tm)", textAlign: "center" }}>
                      {rate < 6 ? "✓ NEAR SYNC — CLOSE NOW" : rate < 20 ? "↻ ROTATING — ADJUSTING" : "✗ TOO FAST — REDUCE SPEED"}
                    </div>
                    <div style={{ width: "100%" }}>
                      <div style={{ fontFamily: "var(--mo)", fontSize: "8px", color: "var(--tm)" }}>Incoming speed control:</div>
                      <input type="range" min="0" max="60" value={rate} onChange={e => setRate(+e.target.value)} style={{ width: "170px" }} />
                      <div style={{ fontFamily: "var(--mo)", fontSize: "9px", color: rate < 6 ? "var(--gr)" : rate < 20 ? "var(--ye)" : "var(--re)" }}>
                        {rate === 0 ? "Locked — Same freq" : `ΔHz ≈ +${(rate / 360).toFixed(3)} Hz fast`}
                      </div>
                    </div>
                  </div>
                  <div style={{ flex: 1, minWidth: "160px" }}>
                    <div className="sh">READING THE SYNCHRONOSCOPE</div>
                    {[
                      { s: "12 o'clock (0°)", d: "Zero phase angle — ideal close point." },
                      { s: "Slow CW rotation", d: "Incoming faster than bus — correct direction. Fine-trim Gen 2 governor down slightly." },
                      { s: "CCW rotation", d: "Incoming slower. Speed up Gen 2 governor." },
                      { s: "Fast either direction", d: "Do NOT close. At 450kW, out-of-phase closure = violent mechanical shock to both 9,000+ lb machines." },
                      { s: "Close at 11 o'clock CW", d: "Account for 80–100ms CB close time on 1200A breaker. Pointer arrives at 12 o'clock on contact make." },
                      { s: "PCC3300 auto-sync", d: "With paralleling card installed, PCC3300 ramps Gen 2 governor and AVR automatically to sync window — no manual adjustment needed." },
                    ].map((r, i) => (
                      <div key={i} style={{ padding: "5px 0", borderBottom: "1px solid var(--bdr)" }}>
                        <div style={{ fontFamily: "var(--mo)", fontSize: "9px", color: "var(--g2b)", fontWeight: "700" }}>{r.s}</div>
                        <div style={{ fontSize: "12px", color: "var(--tx)", marginTop: "2px" }}>{r.d}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="col" style={{ flex: 1, minWidth: "240px" }}>
              <div className="panel g1b" data-lbl="Sync Conditions — IEEE C37.95 / PCC3300 Windows">
                <div className="pi">
                  <div className="co info">PCC3300 paralleling card enforces all four windows simultaneously. CB2 close coil is physically blocked until all conditions pass.</div>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "10px" }}>
                    {[
                      { k: "ΔV", v: `${dvPct.toFixed(2)}%`, ok: dvPct < 1, w: dvPct < 3, lim: "< 2% ideal", bar: Math.min(100, dvPct / 5 * 100) },
                      { k: "Δf", v: `${dfHz.toFixed(3)}Hz`, ok: dfHz < 0.1, w: dfHz < 0.3, lim: "< 0.1 Hz ideal", bar: Math.min(100, dfHz / .5 * 100) },
                      { k: "Phase Seq", v: "A-B-C ✓", ok: true, w: false, lim: "MUST match" },
                      { k: "Phase Angle", v: rate < 5 ? "< 5°" : rate < 15 ? "< 30°" : "> 30°", ok: rate < 5, w: rate < 15, lim: "< 10° at close", bar: Math.min(100, rate / 60 * 100) },
                    ].map((c, i) => {
                      const cls = c.ok ? "var(--gr)" : c.w ? "var(--ye)" : "var(--re)";
                      return (
                        <div key={i} style={{ background: "var(--bg1)", border: `1px solid ${cls}20`, padding: "10px 12px", flex: 1, minWidth: "120px" }}>
                          <div style={{ fontFamily: "var(--mo)", fontSize: "8px", color: "var(--tm)", marginBottom: "3px" }}>{c.k}</div>
                          <div style={{ fontFamily: "var(--mo)", fontSize: "16px", fontWeight: "700", color: cls }}>{c.v}</div>
                          <div style={{ fontFamily: "var(--mo)", fontSize: "7px", color: "var(--tl)", marginTop: "2px" }}>{c.lim}</div>
                          {c.bar !== undefined && <div style={{ height: "4px", background: "var(--bg0)", marginTop: "5px", overflow: "hidden" }}><div style={{ width: `${c.bar}%`, height: "100%", background: cls }} /></div>}
                        </div>
                      );
                    })}
                  </div>
                  <div className="sh" style={{ marginTop: "14px" }}>CONSEQUENCES IF SYNC VIOLATED AT 450kW</div>
                  <table className="st">
                    <tbody>
                      {[
                        ["ΔV > 5% at closure", "Reactive current surge — potential alternator heating, CB trips on overload"],
                        ["Δf > 1 Hz at closure", "Power oscillation on 9,000+ lb machines — coupling damage possible"],
                        ["Phase angle > 30°", "Current spike 3–10× rated (2,000–6,800A) — mechanical shock to both machines"],
                        ["Phase sequence reversed", "3φ fault ~3,000–4,500A — 1200A CBs trip, stator damage probable"],
                        ["PCC3300 no parallel card", "Cannot auto-sync — manual only with synchronoscope and trim pots"],
                      ].map(([k, v], i) => <tr key={i}><td>{k}</td><td style={{ color: "var(--re2)" }}>{v}</td></tr>)}
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
            <div className="panel g1b" data-lbl="Governor Droop — 450kW Load Share Theory" style={{ flex: 1, minWidth: "280px" }}>
              <div className="pi">
                <div className="sh">DROOP CONTROL FOR REAL POWER (kW)</div>
                <div className="co info">At 450kW, PCC3300 integrates governor control with load sharing. Two machines with equal droop% on the same bus automatically share kW proportionally. The PCC3300 load share link (2-wire) communicates kW setpoint between controllers for tighter sharing than droop alone.</div>
                <div style={{ margin: "12px 0" }}><Droop d1={d1} d2={d2} load={load} /></div>
                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                  {[{ lbl: "GEN 1 DROOP %", v: d1, set: setD1, c: "var(--g1)" }, { lbl: "GEN 2 DROOP %", v: d2, set: setD2, c: "var(--g2)" }].map((x, i) => (
                    <div key={i} style={{ flex: 1 }}>
                      <div style={{ fontFamily: "var(--mo)", fontSize: "8px", color: x.c, marginBottom: "4px" }}>{x.lbl}</div>
                      <input type="range" min="2" max="10" value={x.v} onChange={e => x.set(+e.target.value)} style={{ width: "100%" }} />
                      <div style={{ fontFamily: "var(--mo)", fontSize: "11px", color: x.c }}>{x.v}% — f_nl={(60 * (1 + x.v / 100)).toFixed(2)}Hz</div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: "8px" }}>
                  <div style={{ fontFamily: "var(--mo)", fontSize: "8px", color: "var(--tm)", marginBottom: "4px" }}>TOTAL BUS LOAD: {load} kW</div>
                  <input type="range" min="50" max="900" value={load} onChange={e => setLoad(+e.target.value)} style={{ width: "100%" }} />
                </div>
              </div>
            </div>
            <div className="col" style={{ flex: 1, minWidth: "240px" }}>
              <div className="panel g2b" data-lbl="Live Load Share">
                <div className="pi">
                  <div className="sh">REAL POWER DISTRIBUTION</div>
                  {[{ lbl: "GEN 1", kw: kw1, p: p1, c: "var(--g1)" }, { lbl: "GEN 2", kw: kw2, p: p2, c: "var(--g2)" }].map(g => (
                    <div key={g.lbl} style={{ marginBottom: "12px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--mo)", fontSize: "10px", marginBottom: "4px" }}>
                        <span style={{ color: g.c }}>{g.lbl}</span>
                        <span style={{ color: g.c }}>{g.kw.toFixed(0)} kW — {(g.p * 100).toFixed(0)}% of 450kW</span>
                      </div>
                      <div style={{ height: "18px", background: "var(--bg0)", overflow: "hidden", border: `1px solid ${g.c}20` }}>
                        <div style={{ width: `${Math.min(100, g.p * 100)}%`, height: "100%", background: g.c, opacity: .8, transition: "width .4s" }} />
                      </div>
                      <div style={{ fontFamily: "var(--mo)", fontSize: "9px", color: g.p > 1 ? "var(--re)" : g.p > .9 ? "var(--ye)" : "var(--tl)", marginTop: "3px" }}>
                        {g.p > 1 ? "⚠ OVERLOADED" : g.p > .8 ? "HIGH LOAD" : g.p > .5 ? "NORMAL" : "LIGHT LOAD"}
                      </div>
                    </div>
                  ))}
                  <table className="st" style={{ marginTop: "8px" }}>
                    <tbody>
                      <tr><td>Total bus load</td><td>{load} kW</td></tr>
                      <tr><td>Gen 1 share</td><td>{kw1.toFixed(0)} kW</td></tr>
                      <tr><td>Gen 2 share</td><td>{kw2.toFixed(0)} kW</td></tr>
                      <tr><td>Fuel burn (combined)</td><td>{(30.1 * (kw1 / 450) + 30.1 * (kw2 / 450)).toFixed(1)} GPH</td></tr>
                      <tr><td>Droop match</td><td style={{ color: d1 === d2 ? "var(--gr)" : "var(--re)" }}>{d1 === d2 ? "✓ EQUAL" : "⚠ MISMATCH"}</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="panel bub" data-lbl="Reactive Power (kVAR) Sharing — PCC3300 AVR">
                <div className="pi">
                  <div className="co warn">Reactive power sharing at 450kW is critical. Circulating kVAR between two 563kVA machines can reach 100+ kVAR without proper AVR droop settings — enough to overheat alternators at light real load.</div>
                  <table className="st" style={{ marginTop: "10px" }}>
                    <tbody>
                      <tr className="hr"><td colSpan="2">PCC3300 kVAR SHARING</td></tr>
                      <tr><td>Both AVRs voltage droop</td><td>3–5% (factory configurable)</td></tr>
                      <tr><td>Cross-current compensation</td><td>Optional CT interconnect between PCC3300s</td></tr>
                      <tr><td>Load share accuracy (kVAR)</td><td>±5% with PCC3300 link</td></tr>
                      <tr><td>Circulating kVAR symptom</td><td>High amps, low kW, low PF (one machine)</td></tr>
                      <tr><td>AVR type</td><td>Integrated digital in PCC3300</td></tr>
                      <tr><td>Adjustment</td><td>InPower Pro software — not a trim pot</td></tr>
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
            <div className="panel rb" data-lbl="Protection Schedule — ANSI Device Numbers · 450kW Scale" style={{ flex: 2, minWidth: "320px" }}>
              <div className="pi">
                <div className="co info" style={{ marginBottom: "10px" }}>At 450kW, protection is typically implemented via PCC3300 integrated protection PLUS hardwired ANSI relays on the breaker trip circuits. A coordination study is required to ensure fault selectivity between machine CBs and the main bus CB.</div>
                {[
                  { a: "25", f: "Sync Check", c: "#2888e0", bg: "#0a1828", p: "CB2 / CB-tie", s: "ΔV < 5%, Δf < 0.5Hz, Δφ < 10°", act: "Permits / blocks CB2 close" },
                  { a: "32", f: "Reverse Power", c: "#f02828", bg: "#3a0808", p: "Each machine CB", s: "< –2% rated = –9 kW per machine", act: "SHUTDOWN + CB trip" },
                  { a: "27", f: "Under Voltage", c: "#e8920a", bg: "#2a1800", p: "Each machine", s: "< 90% (432V) for 3s", act: "ALARM then TRIP" },
                  { a: "59", f: "Over Voltage", c: "#e8920a", bg: "#2a1800", p: "Each machine", s: "> 110% (528V)", act: "TRIP" },
                  { a: "81O", f: "Over Frequency", c: "#9030d8", bg: "#1a0828", p: "Each machine", s: "> 63 Hz / 2,100 RPM", act: "TRIP (overspeed)" },
                  { a: "81U", f: "Under Frequency", c: "#9030d8", bg: "#1a0828", p: "Each machine", s: "< 57 Hz", act: "ALARM then TRIP" },
                  { a: "51", f: "Overcurrent Time", c: "#f02828", bg: "#3a0808", p: "Each machine CB", s: "> 125% rated (846A) with 3s delay", act: "TRIP CB" },
                  { a: "50", f: "Instantaneous OC", c: "#f02828", bg: "#3a0808", p: "Each machine CB", s: "> 600% rated (4,060A) — fault level", act: "INSTANT TRIP" },
                  { a: "50G", f: "Ground Fault (GFP)", c: "#e8920a", bg: "#2a1800", p: "Main bus CB", s: "> 1,200A ground (NEC 230.95 >1000A)", act: "TRIP MAIN" },
                  { a: "86", f: "Lockout Relay", c: "#f02828", bg: "#3a0808", p: "Triggered by 27/59/81/32/50", s: "Latching", act: "Trips all CBs — manual reset required" },
                ].map((r, i) => (
                  <div className="fi" key={i}>
                    <div className="fdot" style={{ background: r.c, boxShadow: `0 0 5px ${r.c}44` }} />
                    <div className="fb" style={{ color: r.c, borderColor: r.c, background: r.bg }}>ANSI {r.a}</div>
                    <div style={{ flex: "0 0 130px", fontWeight: "700", fontSize: "13px" }}>{r.f}</div>
                    <div style={{ flex: 1, fontFamily: "var(--mo)", fontSize: "9px", color: "var(--tm)" }}>{r.p}</div>
                    <div style={{ flex: 1, fontFamily: "var(--mo)", fontSize: "9px" }}>{r.s}</div>
                    <div style={{ flex: "0 0 90px", fontFamily: "var(--mo)", fontSize: "9px", color: r.act.includes("TRIP") ? "var(--re2)" : "var(--ye)", textAlign: "right" }}>{r.act}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="col" style={{ flex: 1, minWidth: "220px" }}>
              <div className="panel g1b" data-lbl="PCC3300 Parallel Configuration">
                <div className="pi">
                  <div className="co warn">PCC3300 requires the optional Paralleling Card (feature code) to enable auto-sync and load sharing. Verify part number before commissioning.</div>
                  <table className="st" style={{ marginTop: "8px" }}>
                    <tbody>
                      <tr className="hr"><td colSpan="2">PCC3300 SYNC SETTINGS</td></tr>
                      <tr><td>Voltage sync window</td><td>±5% (InPower configurable)</td></tr>
                      <tr><td>Frequency sync window</td><td>±0.5 Hz</td></tr>
                      <tr><td>Phase angle window</td><td>±10°</td></tr>
                      <tr><td>Auto-sync mode</td><td>Active — ramps Hz and V to match</td></tr>
                      <tr><td>Sync timeout alarm</td><td>Configurable 0–600s</td></tr>
                      <tr className="hr"><td colSpan="2">LOAD SHARE LINK</td></tr>
                      <tr><td>Link type</td><td>2-wire analog PCC3300-to-PCC3300</td></tr>
                      <tr><td>kW share accuracy</td><td>±5% of rated</td></tr>
                      <tr><td>kVAR share</td><td>Optional cross-current CT</td></tr>
                      <tr><td>Load demand start</td><td>Gen 2 auto-starts &gt; 80% Gen 1 prime</td></tr>
                      <tr><td>Load demand stop</td><td>Configurable unload threshold</td></tr>
                      <tr className="hr"><td colSpan="2">BREAKER CONTROL</td></tr>
                      <tr><td>CB close relay</td><td>PCC3300 digital output (24V or relay)</td></tr>
                      <tr><td>CB position feedback</td><td>52a/52b auxiliary contacts required</td></tr>
                      <tr><td>Lockout reset</td><td>Manual via PCC3300 or pushbutton</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="panel pb" data-lbl="Neutral Bonding — 450kW NEC Requirements">
                <div className="pi">
                  <div className="co crit">⚠ NEC 250.35 requires one and only one neutral-ground bond for a separately derived system. Two bonds = ground loop. At 450kW, stray ground current can easily exceed 20–30A — enough to damage sensitive instrumentation and trip GFP relays.</div>
                  <table className="st" style={{ marginTop: "8px" }}>
                    <tbody>
                      <tr className="hr"><td colSpan="2">BONDING RULES</td></tr>
                      <tr className="rc"><td>Gen 1 neutral (primary)</td><td>BONDED at Gen 1 frame</td></tr>
                      <tr className="gc"><td>Gen 2 neutral (secondary)</td><td>FLOATING — bond removed</td></tr>
                      <tr><td>System ground point</td><td>Paralleling switchgear ground bus</td></tr>
                      <tr><td>GFP requirement (NEC 230.95)</td><td>Required — service &gt; 1,000A at 480V</td></tr>
                      <tr><td>GFP trip setting</td><td>1,200A max, 1s delay max per NEC</td></tr>
                      <tr><td>PCC3300 parallel card</td><td>Auto-handles neutral isolation on CB2</td></tr>
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
            <div className="panel g1b" data-lbl="Parallel Procedure — Manual (PCC3300 No Parallel Card)" style={{ flex: 1, minWidth: "300px" }}>
              <div className="pi">
                <div className="co crit" style={{ marginBottom: "12px" }}>Manual procedure requires trained operators. At 450kW, errors are consequential. All switches should be accessible to the operator from a single vantage point during synchronization.</div>
                <div className="sh">PART 1 — GEN 1 ON LOAD / GEN 2 SYNC</div>
                {[
                  { n: "1", t: "Verify Gen 1 stable", s: "Hz: 60.0 ±0.3. Voltage: 480V ±2%. Oil pressure: 40–75 PSI. Coolant: 82–95°C. No alarms on PCC3300.", c: "sg1" },
                  { n: "2", t: "Start Gen 2 — warm-up", s: "Start and allow 5 min warm-up at no-load. QSX15 runs hot quickly — monitor coolant temp for first 5 min.", c: "sg2" },
                  { n: "3", t: "Match Gen 2 voltage to Gen 1", s: "Adjust Gen 2 AVR trim (InPower or trim pot) until L-L voltage matches Gen 1 within ±3V (use same Fluke meter).", c: "sg2" },
                  { n: "4", t: "Match Gen 2 frequency to Gen 1", s: "Governor trim: bring Gen 2 to Gen 1 Hz ±0.05 Hz. Target Gen 2 at 60.05–60.1 Hz for slow CW sync rotation.", c: "sg2" },
                  { n: "5", t: "Observe synchronoscope — slow CW only", s: "Target: one revolution every 20–30 seconds. Faster than that: do not close. At this machine size, hesitate if in doubt.", c: "sg2" },
                  { n: "6", t: "Close CB2 at 11 o'clock", s: "On slow CW rotation, close CB2 as pointer passes 11 o'clock. 1200A breaker close time ~80–100ms. Contacts make at 12 o'clock.", c: "sgc" },
                  { n: "7", t: "Verify parallel — check both ammeters", s: "Both PCC3300 displays should show load current. Watch for reverse power alarm on Gen 2 — if so, open CB2 and increase Gen 2 governor slightly.", c: "sgc" },
                  { n: "8", t: "Verify load share", s: "Both machines should show approximately equal kW within 5–10%. If not, use InPower to check droop settings on each controller.", c: "sgc" },
                ].map(s => (
                  <div className="step" key={s.n}>
                    <div className={`sn ${s.c}`}>{s.n}</div>
                    <div><div className="stitle">{s.t}</div><div className="ssub">{s.s}</div></div>
                  </div>
                ))}
                <div className="sh" style={{ marginTop: "16px" }}>PART 2 — REMOVING GEN 2 FROM PARALLEL</div>
                {[
                  { n: "A", t: "Transfer load to Gen 1", s: "Use InPower or governor trim to reduce Gen 2 kW to near zero. Gen 1 picks up automatically.", c: "sg1" },
                  { n: "B", t: "Verify Gen 2 kW < 20kW", s: "Below 20kW on Gen 2 ammeter. Below this, reverse power relay tolerates. If PCC3300 shows reverse power — immediately open CB2.", c: "sg1" },
                  { n: "C", t: "Open CB2", s: "Full load now on Gen 1. Verify Gen 1 not overloaded (< 450kW).", c: "src" },
                  { n: "D", t: "Cool down Gen 2", s: "QSX15 turbocharger requires 5 min cool-down at no-load before shutdown. Then normal PCC3300 stop sequence.", c: "sg2" },
                ].map(s => (
                  <div className="step" key={s.n}>
                    <div className={`sn ${s.c}`}>{s.n}</div>
                    <div><div className="stitle">{s.t}</div><div className="ssub">{s.s}</div></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="col" style={{ flex: 1, minWidth: "240px" }}>
              <div className="panel g2b" data-lbl="Automatic Parallel — PCC3300 Load Demand Staging">
                <div className="pi">
                  <div className="sh">AUTO SEQUENCE (PARALLEL CARD INSTALLED)</div>
                  {[
                    { n: "1", t: "Gen 1 running as primary", s: "PCC3300-1 in Auto. Monitoring kW load via integrated CT inputs." },
                    { n: "2", t: "Load > 80% Gen 1 prime (328kW)", s: "PCC3300-1 sends start command to PCC3300-2 via load share link." },
                    { n: "3", t: "Gen 2 auto-starts (PCC3300-2)", s: "QSX15 cranks and runs up. PCC3300-2 monitors Hz and V until within sync window (±0.5 Hz, ±5%)." },
                    { n: "4", t: "PCC3300-2 auto-syncs Gen 2", s: "Paralleling card ramps governor and AVR automatically. No manual intervention needed." },
                    { n: "5", t: "ANSI 25 confirms all conditions", s: "PCC3300-2 closes CB2 only when ΔV, Δf, and phase angle all within window simultaneously." },
                    { n: "6", t: "Load share link balances kW", s: "Both PCC3300 units communicate kW setpoints and trim governors to equalize share ±5%." },
                    { n: "7", t: "Load drops below stop threshold", s: "PCC3300 initiates Gen 2 unload sequence → opens CB2 → cool-down → stop. Sequence is fully automatic." },
                  ].map(s => (
                    <div className="step" key={s.n}>
                      <div className="sn sg2">{s.n}</div>
                      <div><div className="stitle">{s.t}</div><div className="ssub">{s.s}</div></div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="panel bub" data-lbl="Pre-Parallel Commissioning Checklist">
                <div className="pi">
                  {[
                    "☐ Phase sequence verified with meter (both machines independently)",
                    "☐ Gen 2 neutral-ground bond removed",
                    "☐ CB2 confirmed OPEN and mechanically locked",
                    "☐ Both PCC3300 droop settings equal (5% recommended)",
                    "☐ PCC3300 paralleling card installed on Gen 2",
                    "☐ 2-wire load share link wired between PCC3300 controllers",
                    "☐ ANSI 25 sync check relay wired to CB2 close coil",
                    "☐ ANSI 32 reverse power CT on each machine output",
                    "☐ LSIG coordination study completed — breaker settings programmed",
                    "☐ GFP relay installed on main bus CB (NEC 230.95 required > 1000A)",
                    "☐ Both machines load-bank tested independently at 450kW",
                    "☐ Bus cable ampacity verified: 2× 350MCM per phase per machine",
                    "☐ Main bus breaker 1,600A frame installed",
                    "☐ CB1 and CB2 auxiliary 52a/52b contacts wired to PCC3300",
                    "☐ Arc flash study completed — labels applied to all panels",
                    "☐ Turbocharger warm-up timer set: 3 min min (QSX15 spec)",
                  ].map((item, i) => (
                    <div key={i} style={{ fontFamily: "var(--mo)", fontSize: "10px", color: "var(--tm)", padding: "4px 0", borderBottom: "1px solid var(--bdr)" }}>{item}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 6: FAULTS ── */}
      {tab === 6 && (
        <div className="body">
          <div className="row">
            <div className="panel rb" data-lbl="Parallel Fault Analysis — 450kW Field Experience" style={{ flex: 2, minWidth: "320px" }}>
              <div className="pi">
                {[
                  { t: "One machine carrying all load — other at zero kW", sev: "OPERATIONAL", c: "#e8920a", cause: "Governor droop mismatch. The machine with lower effective no-load Hz grabs all kW. At 450kW this is immediately visible: one machine running hot and the other barely ticking over.", diagnosis: "Open CB2. With Gen 2 running alone, record no-load Hz. Then open CB1, run Gen 1 alone — record no-load Hz. If they differ by > 0.1 Hz, droop is mismatched.", fix: "Use InPower Pro on each PCC3300 to verify droop settings match. Check governor calibration — QSX15 governors drift over time. Recalibrate via InPower if needed." },
                  { t: "High amps, low kW — circulating kVAR between machines", sev: "OPERATIONAL", c: "#e8920a", cause: "AVR/voltage droop mismatch. One PCC3300 over-excites, other under-excites. At 450kW, circulating kVAR can reach 50–150 kVAR — enough to cause alternator overheating at light load.", diagnosis: "Disconnect all external load. With both CBs closed: both ammeters show significant current but no kW on load meter. Check PF on each machine — one will be near 0 leading, other near 0 lagging.", fix: "Check voltage droop settings in InPower Pro on both PCC3300 controllers. Settings must match. Consider adding cross-current CT compensation — available as PCC3300 option." },
                  { t: "CB2 won't close — PCC3300 blocking", sev: "OPERATIONAL", c: "#2888e0", cause: "ANSI 25 sync check doing its job. One or more conditions not met: ΔV too large (> 5%), Δf too large (> 0.5 Hz), or phase angle closing window never achieved because rotation is too fast.", diagnosis: "PCC3300 display will show which sync condition is failing. Check Gen 2 voltage on PCC3300 display vs Gen 1. Check Gen 2 Hz. If both look OK — check ANSI 25 relay wiring.", fix: "Reduce Gen 2 governor trim for slow CW synchronoscope rotation. Trim AVR to match voltage. If using auto-sync (parallel card), verify card is properly installed and InPower is configured for parallel mode." },
                  { t: "Reverse power relay trips Gen 2 on CB2 closure", sev: "WARNING", c: "#f02828", cause: "Gen 2 governor set slightly slow — incoming Hz fractionally below bus. Bus drives Gen 2 as a synchronous motor on closure. ANSI 32 correctly trips.", diagnosis: "Was synchronoscope rotating CCW before closure? CCW = Gen 2 slower than bus. A slow CCW rotation is not as obvious as a slow CW rotation — operators sometimes miss it.", fix: "Increase Gen 2 governor slightly. Target: slow CW rotation (Gen 2 fractionally faster than bus). Wait for slow CW before attempting closure again." },
                  { t: "Load hunting / Hz oscillation after parallel", sev: "WARNING", c: "#f02828", cause: "Governor instability interaction between two PCC3300 controllers. PCC3300 default mode is isochronous — two isochronous governors fight each other for Hz control. Oscillation frequency typically 1–4 Hz.", diagnosis: "Both machine Hz displays oscillating in opposition. Load meters swinging. Check if both PCC3300 are in isochronous mode — they should be in droop mode for parallel.", fix: "Switch both PCC3300 governors to DROOP mode via InPower. This is the fundamental requirement for parallel operation. In droop mode, the 'winner' is determined by the droop curves — stable by design." },
                  { t: "GFCI / GFP nuisance trips", sev: "WARNING", c: "#d8c818", cause: "Two neutral-ground bonds. Ground loop current at 450kW can be substantial — 10–30A circulating through the earth path. Any GFP relay set below this will trip. GFCI devices (5mA) will trip reliably.", diagnosis: "Clamp meter on neutral conductor between Gen 2 and bus — any reading > 2A with no load indicates dual bonding. Check PCC3300 parallel card — it should float the Gen 2 neutral automatically.", fix: "Remove neutral-ground bond at Gen 2 frame. Verify PCC3300 parallel card is properly configured to isolate neutral on CB2 open. Single bond only at bus/switchgear ground bus." },
                  { t: "Phase sequence reversal — catastrophic", sev: "CRITICAL", c: "#f02828", cause: "Gen 2 wired A-C-B instead of A-B-C. Closing CB2 onto live bus creates a 3-phase bolted fault. Fault current limited by Xd\" (~12%) = 3,000–5,000A for 50–100ms until CB1 and CB2 trip on ANSI 50.", diagnosis: "Both CBs trip instantly on closure. Loud bang or thump from both machines. Inspect: alternator winding insulation, coupling disc, CB contacts, bus bars for arc damage.", fix: "PREVENT THIS: verify with phase rotation meter on BOTH machines independently before any parallel attempt. If reversal has occurred: swap any two output phase conductors at Gen 2 terminal box (not at the camlock — at the alternator terminal). Re-verify." },
                ].map((f, i) => (
                  <div key={i} style={{ padding: "12px 0", borderBottom: "1px solid var(--bdr)" }}>
                    <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "6px" }}>
                      <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: f.c, flexShrink: 0, boxShadow: `0 0 5px ${f.c}66` }} />
                      <div style={{ fontFamily: "var(--mo)", fontSize: "9px", padding: "2px 8px", border: `1px solid ${f.c}`, color: f.c, fontWeight: "700" }}>{f.sev}</div>
                      <div style={{ fontWeight: "700", fontSize: "14px" }}>{f.t}</div>
                    </div>
                    <div style={{ paddingLeft: "18px" }}>
                      <div style={{ fontSize: "12px", color: "var(--tm)", marginBottom: "4px" }}><b style={{ color: "#6080a0", fontFamily: "var(--mo)", fontSize: "10px" }}>CAUSE: </b>{f.cause}</div>
                      <div style={{ fontSize: "12px", color: "var(--tm)", marginBottom: "4px" }}><b style={{ color: "#80a060", fontFamily: "var(--mo)", fontSize: "10px" }}>DIAGNOSIS: </b>{f.diagnosis}</div>
                      <div style={{ fontSize: "12px", color: "var(--gr)" }}><b style={{ fontFamily: "var(--mo)", fontSize: "10px" }}>FIX: </b>{f.fix}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="col" style={{ flex: 1, minWidth: "240px" }}>
              <div className="panel g1b" data-lbl="Operational Outcomes — 2× QSX15 Parallel">
                <div className="pi">
                  <table className="st">
                    <tbody>
                      <tr className="hr"><td colSpan="2">COMBINED OUTCOMES</td></tr>
                      <tr className="gc"><td>Total standby capacity</td><td>900kW / 1,125kVA</td></tr>
                      <tr className="gc"><td>Total prime capacity</td><td>820kW / 1,025kVA</td></tr>
                      <tr><td>Redundancy</td><td>N+1 — 450kW survives one trip</td></tr>
                      <tr><td>Per-machine at 50% share</td><td>450kW = 100% standby</td></tr>
                      <tr><td>Optimal operating point</td><td>540kW total (60% each)</td></tr>
                      <tr><td>Fuel @ optimal (combined)</td><td>~36 GPH / 136 L/hr</td></tr>
                      <tr><td>Fuel @ full standby (combined)</td><td>60.2 GPH / 228 L/hr</td></tr>
                      <tr className="hr"><td colSpan="2">WHAT DOES NOT CHANGE</td></tr>
                      <tr><td>Output voltage</td><td>480V — bus holds voltage</td></tr>
                      <tr><td>Output frequency</td><td>60Hz — droop holds freq</td></tr>
                      <tr><td>Motor starting capability</td><td>2,208 kVA per machine PMG</td></tr>
                      <tr className="hr"><td colSpan="2">40-YEAR FIELD NOTES</td></tr>
                      <tr><td>Most common error</td><td>Not switching to droop mode</td></tr>
                      <tr><td>Second most common</td><td>Dual neutral bonds</td></tr>
                      <tr><td>Worst error</td><td>Phase reversal on first close</td></tr>
                      <tr><td>Most overlooked spec</td><td>PCC3300 paralleling card required</td></tr>
                      <tr><td>QSX15 specific note</td><td>5 min turbo cool-down before stop</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="panel pb" data-lbl="Senior Engineer Field Notes — 450kW Parallel">
                <div className="pi">
                  <div style={{ fontSize: "13px", lineHeight: "1.7", color: "var(--tx)" }}>
                    <p style={{ marginBottom: "10px" }}>At this power level, the consequences of mistakes are not the same as at 50kW. A phase reversal on a 450kW machine is not a nuisance event — it is a destructive event. I've seen alternator stator windings burned through, bus bars vaporized, and coupling discs shattered. The phase rotation meter check is not optional.</p>
                    <p style={{ marginBottom: "10px" }}>The PCC3300 is a sophisticated controller and will handle synchronization reliably — but only with the paralleling card installed and properly configured. Many rental machines ship with PCC3300 in standalone mode. Confirm the parallel card is present before accepting the equipment on site.</p>
                    <p style={{ marginBottom: "10px" }}>Droop mode is non-negotiable. Two isochronous controllers on the same bus will fight. You'll see 2–4 Hz oscillation on both machines, load meters swinging, and if you're unlucky, one machine trips on over-frequency and the other takes the full load as a step change. Switch to droop mode. Period.</p>
                    <p>The QSX15 turbocharger is substantial. Do not shut these engines down at load. Always unload first, run 5 minutes at no-load to cool the turbo, then stop. A shutdown under full load will cook the turbocharger bearing oil and you'll be replacing a $4,000–6,000 turbo unit.</p>
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