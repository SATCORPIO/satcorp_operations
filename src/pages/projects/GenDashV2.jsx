import { useState, useEffect, useRef } from "react";

/* ══════════════════════════════════════════════════════════════════════
   450kW DIESEL GENSET — ENGINEERING REFERENCE DASHBOARD
   Engine: Cummins QSX15-G9 | Model: DFEJ / 450DFEC
   Source: Cummins D-3400 (10/17) Official Data Sheet
   ══════════════════════════════════════════════════════════════════════ */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;700&display=swap');
:root {
  --bg0:#05080b; --bg1:#0a1118; --bg2:#0e1822; --bg3:#12202e;
  --bdr:#192e42; --bdr2:#1e3850;
  --am:#e8920a; --am2:#ffc040;
  --gr:#22d855; --gr2:#16a83c;
  --re:#f02828; --re2:#ff6858;
  --bl:#2888e0; --bl2:#58b0ff;
  --cy:#18c0c8; --ye:#d8c818;
  --pu:#9830d8; --pu2:#c060ff;
  --tx:#c0deff; --tm:#507890; --tl:#284860;
  --mo:'JetBrains Mono',monospace; --sa:'Rajdhani',sans-serif;
}
*{box-sizing:border-box;margin:0;padding:0;}
html,body{background:var(--bg0);}
.app{font-family:var(--sa);background:var(--bg0);color:var(--tx);min-height:100vh;}
.hdr{display:flex;align-items:center;justify-content:space-between;padding:10px 20px;background:var(--bg1);border-bottom:2px solid var(--am);flex-wrap:wrap;gap:8px;}
.htag{font-family:var(--mo);font-size:9px;letter-spacing:2px;padding:3px 10px;background:var(--am);color:#000;font-weight:700;}
.h1{font-size:19px;font-weight:700;letter-spacing:3px;text-transform:uppercase;}
.hsub{font-family:var(--mo);font-size:9px;color:var(--tm);letter-spacing:1px;}
.hstat{display:flex;align-items:center;gap:8px;}
.sdot{width:9px;height:9px;border-radius:50%;}
.sdot.on{animation:bk 2s infinite;}
@keyframes bk{0%,100%{opacity:1}50%{opacity:.45}}
.slbl{font-family:var(--mo);font-size:10px;color:var(--gr);letter-spacing:2px;}
.htime{font-family:var(--mo);font-size:10px;color:var(--tm);}

.tabs{display:flex;background:var(--bg1);border-bottom:1px solid var(--bdr);padding:0 20px;overflow-x:auto;}
.tab{padding:11px 17px;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;cursor:pointer;color:var(--tl);border-bottom:2px solid transparent;transition:all .15s;background:none;border-top:none;border-left:none;border-right:none;font-family:var(--sa);white-space:nowrap;}
.tab:hover{color:var(--tm);}
.tab.ac{color:var(--am);border-bottom-color:var(--am);}

.body{padding:16px;display:flex;flex-direction:column;gap:14px;}
.row{display:flex;gap:14px;flex-wrap:wrap;}
.col{display:flex;flex-direction:column;gap:14px;}
.panel{background:var(--bg2);border:1px solid var(--bdr);position:relative;overflow:hidden;}
.panel[data-lbl]::before{content:attr(data-lbl);position:absolute;top:0;left:0;font-family:var(--mo);font-size:8px;letter-spacing:1.5px;padding:3px 10px;background:var(--bdr);color:var(--tm);text-transform:uppercase;z-index:2;}
.pi{padding:28px 14px 14px;}
.pi.nl{padding:14px;}
.aa{border-top:2px solid var(--am);}
.ag{border-top:2px solid var(--gr);}
.ar{border-top:2px solid var(--re);}
.ab{border-top:2px solid var(--bl);}
.ac2{border-top:2px solid var(--cy);}
.ap{border-top:2px solid var(--pu);}

/* GAUGES */
.grow{display:flex;gap:10px;flex-wrap:wrap;justify-content:center;}
.gwrap{display:flex;flex-direction:column;align-items:center;gap:4px;}
.glbl{font-family:var(--mo);font-size:8px;letter-spacing:1px;color:var(--tm);text-transform:uppercase;}

/* TILES */
.tgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(155px,1fr));gap:8px;}
.tile{background:var(--bg1);border:1px solid var(--bdr);padding:10px 12px;border-left:3px solid var(--bdr2);transition:border-color .15s;cursor:default;}
.tile:hover{border-left-color:var(--am);}
.tile.cy{border-left-color:var(--cy);}
.tk{font-family:var(--mo);font-size:8px;letter-spacing:1.5px;color:var(--tm);text-transform:uppercase;margin-bottom:4px;}
.tv{font-size:17px;font-weight:700;color:var(--am2);line-height:1;}
.tu{font-size:10px;color:var(--tm);margin-left:2px;}
.ts{font-size:11px;color:var(--tl);margin-top:3px;}

/* TABLE */
.st{width:100%;border-collapse:collapse;font-size:13px;}
.st td{padding:5px 10px;border-bottom:1px solid var(--bdr);}
.st td:first-child{color:var(--tm);font-family:var(--mo);font-size:9px;letter-spacing:.5px;text-transform:uppercase;width:50%;}
.st td:last-child{color:var(--am2);font-weight:700;text-align:right;}
.st tr:last-child td{border-bottom:none;}
.st .hr td{color:var(--tx)!important;font-size:9px!important;font-weight:700;background:var(--bg3);letter-spacing:2px!important;}
.st .gc td:last-child{color:var(--gr);}
.st .rc td:last-child{color:var(--re2);}
.st .bc td:last-child{color:var(--bl2);}
.st .cc td:last-child{color:var(--cy);}

/* SECTION HDR */
.sh{font-family:var(--mo);font-size:8px;letter-spacing:3px;color:var(--tm);text-transform:uppercase;margin-bottom:10px;display:flex;align-items:center;gap:8px;}
.sh::after{content:'';flex:1;height:1px;background:var(--bdr);}

/* CALLOUT */
.co{border-left:3px solid;padding:9px 13px;margin:8px 0;font-family:var(--mo);font-size:9px;line-height:1.6;}
.co.warn{border-color:var(--ye);color:var(--ye);background:#0e0e00;}
.co.crit{border-color:var(--re);color:var(--re2);background:#0e0000;}
.co.info{border-color:var(--bl);color:var(--bl2);background:#000810;}
.co.ok{border-color:var(--gr);color:var(--gr);background:#000e04;}

/* FLOW ANIM */
@keyframes fR{from{stroke-dashoffset:20}to{stroke-dashoffset:0}}
@keyframes fL{from{stroke-dashoffset:0}to{stroke-dashoffset:20}}
.ff{stroke:#e8920a;stroke-width:2.5;fill:none;stroke-dasharray:7 4;animation:fR .5s linear infinite;}
.fe{stroke:#2888e0;stroke-width:2;fill:none;stroke-dasharray:9 4;animation:fR .35s linear infinite;}
.fc{stroke:#18c0c8;stroke-width:2;fill:none;stroke-dasharray:7 4;animation:fR .7s linear infinite;}
.fx{stroke:#806040;stroke-width:2;fill:none;stroke-dasharray:5 5;animation:fR .9s linear infinite;}
.fk{stroke:#d8c818;stroke-width:1.5;fill:none;stroke-dasharray:4 4;animation:fR 1.1s linear infinite;}
.fr{stroke:#e8920a;stroke-width:1.5;fill:none;stroke-dasharray:4 6;animation:fL .7s linear infinite;opacity:.5;}

/* FAULT */
.fi{display:flex;align-items:center;gap:10px;padding:7px 10px;border-bottom:1px solid var(--bdr);font-size:13px;}
.fi:last-child{border-bottom:none;}
.fdot{width:8px;height:8px;border-radius:50%;flex-shrink:0;}
.fb{font-family:var(--mo);font-size:9px;padding:2px 7px;font-weight:700;letter-spacing:1px;min-width:72px;text-align:center;}

/* MAINT */
.mr{display:flex;border-bottom:1px solid var(--bdr);}
.mr:last-child{border-bottom:none;}
.mi{font-family:var(--mo);font-size:9px;font-weight:700;color:var(--am);min-width:100px;padding:8px 12px;background:var(--bg1);border-right:1px solid var(--bdr);display:flex;align-items:center;}
.mc{padding:8px 12px;font-size:13px;line-height:1.7;}

/* SCOPE */
.scope{background:#010a04;border:1px solid #0a2010;}

/* PLEG */
.pleg{display:flex;align-items:center;gap:6px;font-family:var(--mo);font-size:10px;}
.pl{width:24px;height:2px;}
`;

/* ── ARC GAUGE ── */
function G({ value, min, max, label, unit, size = 92, color = "#e8920a", warn, danger, dec = 0 }) {
  const pct = Math.max(0, Math.min(1, (value - min) / (max - min)));
  const r = size / 2 - 10, cx = size / 2, cy = size / 2 + 5;
  const xy = d => ({ x: cx + r * Math.cos(d * Math.PI / 180), y: cy + r * Math.sin(d * Math.PI / 180) });
  const arc = (a1, a2, c) => {
    const s = xy(a1), e = xy(a2), lg = Math.abs(a2 - a1) > 180 ? 1 : 0;
    return <path d={`M${s.x},${s.y}A${r},${r}0 ${lg}1${e.x},${e.y}`} stroke={c} strokeWidth="4" fill="none" strokeLinecap="round" />;
  };
  const ang = -225 + pct * 270; const tip = xy(ang);
  let vc = color;
  if (danger !== undefined && value >= danger) vc = "#f02828";
  else if (warn !== undefined && value >= warn) vc = "#e8920a";
  return (
    <div className="gwrap">
      <svg width={size} height={size} style={{ overflow: "visible" }}>
        {arc(-225, 45, "#162438")}{arc(-225, ang, vc)}
        <line x1={cx} y1={cy} x2={tip.x} y2={tip.y} stroke={vc} strokeWidth="1.5" strokeLinecap="round" />
        <circle cx={cx} cy={cy} r="3" fill={vc} />
        <text x={cx} y={cy + 18} textAnchor="middle" fill={vc} fontSize="13" fontFamily="'JetBrains Mono'" fontWeight="700">{value.toFixed(dec)}</text>
        <text x={cx} y={cy + 28} textAnchor="middle" fill="#4a7090" fontSize="8" fontFamily="'JetBrains Mono'">{unit}</text>
        <text x={xy(-225).x - 3} y={xy(-225).y + 10} fill="#304860" fontSize="7" fontFamily="'JetBrains Mono'" textAnchor="middle">{min}</text>
        <text x={xy(45).x + 3} y={xy(45).y + 10} fill="#304860" fontSize="7" fontFamily="'JetBrains Mono'" textAnchor="middle">{max}</text>
      </svg>
      <div className="glbl">{label}</div>
    </div>
  );
}

/* ── OSCILLOSCOPE ── */
function Scope({ load = 0.75 }) {
  const ref = useRef(null), fr = useRef(null), t = useRef(0);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d"), W = c.width, H = c.height, mid = H / 2, amp = (H / 2) * .78;
    const ph = [{ c: "#e84040", o: 0, l: "L1 277V" }, { c: "#e0c020", o: (2 * Math.PI) / 3, l: "L2 277V" }, { c: "#3080e0", o: (4 * Math.PI) / 3, l: "L3 277V" }];
    const draw = () => {
      ctx.fillStyle = "#010a04"; ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = "#0a2010"; ctx.lineWidth = .5;
      for (let x = 0; x <= W; x += W / 10) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
      for (let y = 0; y <= H; y += H / 6) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
      ctx.strokeStyle = "#102010"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(0, mid); ctx.lineTo(W, mid); ctx.stroke();
      ph.forEach(p => {
        ctx.strokeStyle = p.c; ctx.lineWidth = 1.5; ctx.shadowColor = p.c; ctx.shadowBlur = 3;
        ctx.beginPath(); for (let px = 0; px < W; px++) { const a = (px / W) * 2.5 * 2 * Math.PI + p.o - t.current; ctx.lineTo(px, mid - Math.sin(a) * amp); } ctx.stroke(); ctx.shadowBlur = 0;
      });
      ph.forEach((p, i) => { ctx.fillStyle = p.c; ctx.font = "bold 9px 'JetBrains Mono'"; ctx.fillText(p.l, W - 80, 16 + i * 14); });
      ctx.fillStyle = "#304860"; ctx.font = "9px 'JetBrains Mono'";
      ctx.fillText("60.0 Hz | 2.5 CYC", 8, H - 6); ctx.fillText(`LOAD ${(load * 100).toFixed(0)}%`, W - 55, H - 6);
      t.current += .04; fr.current = requestAnimationFrame(draw);
    }; draw(); return () => cancelAnimationFrame(fr.current);
  }, [load]);
  return <div className="scope"><canvas ref={ref} width={580} height={130} style={{ width: "100%", height: "auto", display: "block" }} /></div>;
}

/* ── PHASOR ── */
function Phasor({ pf = 0.85 }) {
  const s = 160, cx = s / 2, cy = s / 2, r = 60;
  const xy = (d, radius = r) => ({ x: cx + radius * Math.cos((d - 90) * Math.PI / 180), y: cy + radius * Math.sin((d - 90) * Math.PI / 180) });
  const cols = ["#e84040", "#e0c020", "#3080e0"];
  const pfa = Math.acos(pf) * (180 / Math.PI);
  return (
    <svg width={s} height={s} style={{ overflow: "visible" }}>
      <circle cx={cx} cy={cy} r={r} stroke="#0a2030" strokeWidth=".5" fill="none" />
      <circle cx={cx} cy={cy} r={r * .5} stroke="#0a2030" strokeWidth=".5" fill="none" />
      <line x1={cx - r - 8} y1={cy} x2={cx + r + 8} y2={cy} stroke="#102030" strokeWidth=".5" />
      <line x1={cx} y1={cy - r - 8} x2={cx} y2={cy + r + 8} stroke="#102030" strokeWidth=".5" />
      {[0, 120, 240].map((ph, i) => {
        const tip = xy(ph); return (
          <g key={i}>
            <defs><marker id={`a${i}`} markerWidth="5" markerHeight="4" refX="5" refY="2" orient="auto"><polygon points="0 0,5 2,0 4" fill={cols[i]} /></marker></defs>
            <line x1={cx} y1={cy} x2={tip.x} y2={tip.y} stroke={cols[i]} strokeWidth="2" markerEnd={`url(#a${i})`} opacity=".9" />
            <text x={tip.x + (tip.x - cx) * .2} y={tip.y + (tip.y - cy) * .2 + 3} fill={cols[i]} fontSize="9" fontFamily="'JetBrains Mono'" textAnchor="middle">{["L1", "L2", "L3"][i]}</text>
          </g>);
      })}
      {(() => {
        const tip = xy(pfa); return <>
          <defs><marker id="ac" markerWidth="5" markerHeight="4" refX="5" refY="2" orient="auto"><polygon points="0 0,5 2,0 4" fill="#18c0c8" /></marker></defs>
          <line x1={cx} y1={cy} x2={tip.x} y2={tip.y} stroke="#18c0c8" strokeWidth="1.5" strokeDasharray="4,2" markerEnd="url(#ac)" opacity=".7" />
          <text x={tip.x + 8} y={tip.y} fill="#18c0c8" fontSize="8" fontFamily="'JetBrains Mono'">I(lag)</text>
        </>
      })()}
      <path d={`M${cx} ${cy - 20}A20 20 0 0 1${cx + 20 * Math.sin(pfa * Math.PI / 180)} ${cy - 20 * Math.cos(pfa * Math.PI / 180)}`} stroke="#d8c818" strokeWidth="1" fill="none" />
      <text x={cx + 12} y={cy - 12} fill="#d8c818" fontSize="8" fontFamily="'JetBrains Mono'">φ</text>
      <circle cx={cx} cy={cy} r="3" fill="#2888e0" />
    </svg>
  );
}

/* ── SYSTEM FLOW ── */
function Flow({ onSel, sel }) {
  const comps = {
    tank: { x: 14, y: 150, w: 96, h: 76, label: "FUEL TANK", sub: "Sub-base or day tank", c: "#1a300a" },
    filt: { x: 148, y: 164, w: 84, h: 48, label: "FUEL FILTER", sub: "10μ primary filter", c: "#1a2a0a" },
    eng: { x: 278, y: 120, w: 130, h: 120, label: "CUMMINS QSX15", sub: "6-CYL / 15L / 1800RPM", c: "#1a2a0e" },
    cool: { x: 278, y: 30, w: 130, h: 56, label: "RADIATOR", sub: "57.9L / 40°C ambient", c: "#0a1a2a" },
    alt: { x: 458, y: 120, w: 118, h: 120, label: "ALTERNATOR", sub: "3φ 60Hz 563kVA PMG", c: "#0a1a2e" },
    avr: { x: 458, y: 282, w: 118, h: 52, label: "AVR / PMG", sub: "PowerCommand", c: "#1a0a2e" },
    brk: { x: 628, y: 120, w: 100, h: 54, label: "MAIN BREAKER", sub: "1200A / 3-Pole", c: "#2a0a0a" },
    dist: { x: 628, y: 206, w: 100, h: 80, label: "DIST PANEL", sub: "Camlocks 400A", c: "#0a1a2a" },
    load: { x: 782, y: 158, w: 82, h: 66, label: "LOAD", sub: "0–450kW / 0.8PF", c: "#0a1a0a" },
    ctrl: { x: 278, y: 282, w: 130, h: 52, label: "PowerCommand", sub: "PCC3300", c: "#1a1a0a" },
    bat: { x: 148, y: 282, w: 84, h: 52, label: "BATTERY", sub: "12V / 1000CCA", c: "#1a0a00" },
    exh: { x: 440, y: 30, w: 84, h: 56, label: "EXHAUST", sub: "462°C / 10.2kPa", c: "#1a1010" },
  };
  const flows = [
    { t: "ff", d: "M110 188 L148 188" }, { t: "ff", d: "M232 188 L278 188" },
    { t: "fc", d: "M343 120 L343 86" }, { t: "fx", d: "M408 58 L440 58" },
    { t: "fe", d: "M576 180 L628 180" }, { t: "fe", d: "M628 174 L628 206" },
    { t: "fe", d: "M728 246 L782 191" }, { t: "fk", d: "M408 308 L458 308" },
    { t: "fk", d: "M278 308 L232 308" }, { t: "fk", d: "M148 308 L148 290" },
    { t: "fr", d: "M148 290 L148 232 L110 232 L110 188" },
  ];
  return (
    <svg width="100%" viewBox="0 0 890 380" style={{ maxWidth: "100%", minHeight: "230px" }}>
      <defs>{["ff", "fe", "fc", "fk", "fr", "fx"].map(t => <marker key={t} id={`mf${t}`} markerWidth="6" markerHeight="5" refX="6" refY="2.5" orient="auto"><polygon points="0 0,6 2.5,0 5" fill={t === "ff" || t === "fr" ? "#e8920a" : t === "fe" ? "#2888e0" : t === "fc" ? "#18c0c8" : t === "fk" ? "#d8c818" : "#806040"} /></marker>)}</defs>
      {flows.map((f, i) => <path key={i} className={f.t} d={f.d} markerEnd={`url(#mf${f.t})`} />)}
      {Object.entries(comps).map(([id, c]) => (
        <g key={id} style={{ cursor: "pointer" }} onClick={() => onSel(id === sel ? null : id)}>
          <rect x={c.x} y={c.y} width={c.w} height={c.h} fill={id === sel ? c.c + "ee" : c.c + "88"} stroke={id === sel ? "#e8920a" : "#1a2e44"} strokeWidth={id === sel ? 2 : 1} rx="2" />
          <text x={c.x + c.w / 2} y={c.y + c.h / 2 - 5} fill={id === sel ? "#fff" : "#b8d0e8"} fontSize="9" fontWeight="700" textAnchor="middle" fontFamily="'JetBrains Mono'">{c.label}</text>
          <text x={c.x + c.w / 2} y={c.y + c.h / 2 + 8} fill={id === sel ? "#e8920a" : "#3a6080"} fontSize="7" textAnchor="middle" fontFamily="'JetBrains Mono'">{c.sub}</text>
        </g>
      ))}
      {[["#e8920a", "DIESEL FUEL"], ["#2888e0", "AC POWER"], ["#18c0c8", "COOLANT"], ["#d8c818", "CTRL SIGNAL"], ["#806040", "EXHAUST"]].map(([c, l], i) => (
        <g key={i}><line x1={10 + i * 168} y1={368} x2={38 + i * 168} y2={368} stroke={c} strokeWidth="2" /><text x={42 + i * 168} y={371} fill="#3a6080" fontSize="8" fontFamily="'JetBrains Mono'">{l}</text></g>
      ))}
      <text x="445" y="379" fill="#162438" fontSize="8" textAnchor="middle" fontFamily="'JetBrains Mono'" letterSpacing="2">450kW CUMMINS QSX15-G9 — SYSTEM FLOW · CLICK COMPONENT FOR SPECS</text>
    </svg>
  );
}

/* ── COMPONENT DETAILS — QSX15 verified ── */
const DET = {
  tank: { t: "FUEL SYSTEM / DAY TANK", s: [["Standard sub-base tank", "Variable — 200–600 gal typical"], ["Daily tank (skid)", "Often 200 USG sub-base"], ["External day tank", "Recommended for >8hr continuous"], ["Fuel type", "ASTM D975 #2 Diesel (ULSD req'd)"], ["Sulfur limit", "15 ppm max (Tier 2/T4F)"], ["Max fuel inlet restriction", "127 mmHg (5.0 in Hg)"], ["Max return restriction", "165 mmHg (6.5 in Hg)"], ["Consumption @ 100% standby", "30.1 GPH / 114 L/hr"], ["Consumption @ 75% standby", "23.4 GPH / 89 L/hr"], ["Consumption @ 50% standby", "17.4 GPH / 66 L/hr"], ["Consumption @ 25% standby", "10.8 GPH / 41 L/hr"], ["Consumption @ 100% prime", "27.7 GPH / 105 L/hr"], ["Max fuel flow (pump)", "112 GPH / 424 L/hr"]] },
  filt: { t: "FUEL FILTRATION", s: [["Primary filter", "10 micron — OEM spec"], ["Secondary filter", "Engine-mounted, 2 micron spin-on"], ["Water separator", "Integral — drain every 250 hrs"], ["Change interval", "250–500 hours (per Cummins ESC)"], ["Priming pump", "Electric lift pump standard"], ["Lift pump flow", "800–1200 L/hr"], ["Fuel inlet restriction max", "127 mmHg (5.0 in Hg) — clean filter"], ["Note", "Prime system after EVERY filter change"]] },
  eng: { t: "CUMMINS QSX15-G9 — VERIFIED", s: [["Engine model", "Cummins QSX15-G9"], ["Generator set model", "DFEJ / 450DFEC (60 Hz)"], ["Configuration", "In-line 6 cylinder"], ["Block", "Cast iron, replaceable wet cylinder liners"], ["Displacement", "15.0L (915 cu in)"], ["Bore", "136.9 mm (5.39\")"], ["Stroke", "168.9 mm (6.65\")"], ["Compression ratio", "17.0:1 (Cummins D-3400 data sheet)"], ["Aspiration", "Turbocharged + air-to-air aftercooled (TCAC)"], ["Rated speed", "1800 RPM"], ["Gross engine power (standby)", "563 kWm / 755 bhp"], ["Gross engine power (prime)", "507 kWm / 680 bhp"], ["BMEP @ standby", "2192.5 kPa / 318 PSI"], ["BMEP @ prime", "2006.4 kPa / 291 PSI"], ["Piston speed @ 1800 RPM", "10.1 m/s / 1995 ft/min"], ["Overspeed trip", "2150 ±50 RPM"], ["Lube oil capacity", "83.3 L / 88 qt (NOT 10-14qt like a 50kW)"], ["Oil filters", "2× full-flow spin-on parallel"], ["Tier certification", "EPA NSPS Stationary Emergency Tier 2"]] },
  cool: { t: "COOLING SYSTEM — VERIFIED", s: [["Type", "Closed-circuit liquid / set-mounted radiator"], ["Coolant capacity w/radiator", "57.9 L / 15.3 US gal"], ["Standard ambient design", "40°C / 104°F (std radiator)"], ["Optional high-ambient", "50°C / 122°F (heavy duty radiator)"], ["Cooling air flow", "707.5 m³/min / 25,000 scfm"], ["Fan load", "19 kWm / 25.5 HP"], ["Total heat rejection (standby)", "19.6 MJ/min / 18,485 BTU/min"], ["Total heat rejection (prime)", "17.7 MJ/min / 16,680 BTU/min"], ["Thermostat range", "~82–93°C (standard Cummins)"], ["High coolant temp alarm", "~100°C"], ["High coolant temp shutdown", "~104°C"], ["Block heater", "120V or 240V (strongly recommended)"]] },
  alt: { t: "ALTERNATOR — 450kW", s: [["Type", "Brushless, self-exciting with PMG"], ["PMG function", "Permanent Magnet Generator for enhanced motor-starting and fault clearing"], ["Phases", "3 (120° displacement)"], ["Poles", "2-pole (requires exactly 1800 RPM)"], ["Insulation class", "Class H (150°C winding)"], ["Surge kW capacity", "511–516 kW (PMG option)"], ["Motor starting kVA (PMG @ 90% V)", "1,749–2,429 kVA (model dependent)"], ["Full load current @ 277/480V", "677A standby / 616A prime"], ["Full load current @ 139/240V", "1,355A standby"], ["Full load current @ 347/600V", "542A standby"], ["THD (linear load)", "< 3%"], ["Common alternator models", "Cummins C550 / Stamford HC5 / Leroy Somer LSA50"]] },
  avr: { t: "POWERCOMMAND PCC3300 CONTROL", s: [["System", "Cummins PowerCommand integrated control"], ["Voltage regulation", "±0.5% (digital)"], ["Frequency regulation", "±0.25% isochronous"], ["AmpSentry protection", "Integrated overcurrent / short circuit"], ["Display", "LCD with LED indicators"], ["Protections", "20+ engine and electrical parameters"], ["Start attempts", "Configurable — typically 3 × 15s"], ["Communication", "InPower RS-485, Modbus, optional Ethernet"], ["Remote monitoring", "InSite — via Cummins InPower software"], ["Load sharing", "Integrated kW and kVAR load share link"], ["Parallel capability", "Native parallel support with sync check relay"], ["Event log", "100+ events, SAE J1939 engine data"]] },
  brk: { t: "MAIN CIRCUIT BREAKER", s: [["Frame rating", "1200A frame (typical at this size)"], ["Trip rating", "Sized per feeder — 900–1100A typical"], ["Interrupting capacity", "65 kAIC @ 480V minimum"], ["Trip curve", "Electronic trip — LSIG (Long-Short-Instantaneous-Ground)"], ["Poles", "3-pole main + GFP 4th pole option"], ["Neutral disconnect", "Optional for parallel isolation"], ["Type", "Molded case MCCB or insulated case"], ["Common brands", "Square D NW / Eaton DSII / ABB Emax"]] },
  dist: { t: "DISTRIBUTION — 450kW", s: [["Bus current @ 480V standby", "677A per phase"], ["Bus current @ 480V prime", "616A per phase"], ["Camlock set", "L1/L2/L3/N/GND — 400A camlocks ×2 sets or cam bus"], ["Parallel cables", "4/0 AWG ×2 per phase minimum, or 500MCM"], ["Bus bar", "Copper bus bar rated 1200A (enclosed switchgear)"], ["Panel rating", "480V / 1200A / 3φ 4W"], ["GFCI outlets", "Not standard at this size — add separately if needed"], ["ATS connection", "4-wire ATS 1200A frame recommended"]] },
  load: { t: "LOAD — OPERATING PARAMETERS", s: [["Standby rating", "450 kW / 563 kVA"], ["Prime rating", "410 kW / 513 kVA (unlimited hrs)"], ["Power factor", "0.8 lagging"], ["Voltage 3φ L-L", "480V (277V L-N) standard"], ["Current @ 480V standby", "677A per phase"], ["Current @ 480V prime", "616A per phase"], ["Load step (100%)", "NFPA 110 Level 1 — 100% single step"], ["Motor starting PMG", "2,208 kVA @ 90% sustained V"], ["Altitude (no derate)", "Up to 1,740m / 5,700ft"], ["Altitude derate above", "2.8% per 305m / 1,000ft up to 2,220m"], ["Temp derate above 40°C", "5.7% per 10°C above 40°C ambient"], ["Regenerative power", "52 kW — do NOT overspeed with regen loads"]] },
  ctrl: { t: "POWERCOMMAND PCC3300", s: [["Type", "Digital genset controller"], ["Voltage accuracy", "±0.5% (vs ±1% on analog AVR)"], ["Frequency accuracy", "±0.25% isochronous at full load"], ["Protections", "AmpSentry + engine CAN J1939"], ["Engine comms", "J1939 CAN to QSX15 ECM"], ["Load share link", "2-wire analog OR digital network"], ["Parallel card", "Optional Paralleling Card required for auto-sync"], ["USB config", "InPower Pro software (service tool)"], ["Remote start", "Dry contact or network-based"], ["Alarms", "Up to 50 fault codes via LCD"], ["Battery monitoring", "Yes — low/high V alarm and shutdown"]] },
  bat: { t: "STARTING BATTERY", s: [["Voltage", "12V DC (or 24V DC option)"], ["CCA rating", "1,000 CCA minimum (Cat D450 spec)"], ["Ah capacity", "90 Ah (per Cat D450 standard)"], ["Type", "AGM strongly preferred for vibration environment"], ["Quantity", "Single 12V or dual 12V parallel"], ["Charger", "AC-powered float charger — standard"], ["Low battery alarm", "11.5V (PCC3300 configurable)"], ["Crank cutout", "9.5V (protects starter)"], ["Battery cable", "4/0 AWG minimum — short as possible"]] },
  exh: { t: "EXHAUST SYSTEM — VERIFIED", s: [["Exhaust temp @ standby load", "462.8°C / 865°F (Cummins data sheet)"], ["Exhaust temp @ prime load", "440.6°C / 825°F"], ["Exhaust flow @ standby", "87.9 m³/min / 3,105 cfm"], ["Exhaust flow @ prime", "82.4 m³/min / 2,910 cfm"], ["Max back pressure", "10.2 kPa / 41 in H2O (NOT 3 in H2O)"], ["Outlet size (typical)", "5\" to 6\" OD"], ["Muffler type", "Critical-grade (18–25 dB insertion loss)"], ["Flex section", "Mandatory — stainless steel bellows"], ["Rain cap", "Gravity-type standard"], ["Condensate trap", "Required — vertical discharge"], ["Note", "10.2 kPa = 41 in H2O. Different from 50kW (15 kPa)"]] },
};

/* ── FAULTS ── */
const FAULTS = [
  { s: "SHUTDOWN", c: "#f02828", bg: "#3a0808", n: "Low Oil Pressure", t: "< 20 PSI (configurable PCC3300)", d: "Immediate" },
  { s: "SHUTDOWN", c: "#f02828", bg: "#3a0808", n: "High Coolant Temperature", t: "> 104°C / 219°F", d: "Immediate" },
  { s: "SHUTDOWN", c: "#f02828", bg: "#3a0808", n: "Overspeed", t: "> 2,150 RPM (±50)", d: "Immediate" },
  { s: "SHUTDOWN", c: "#f02828", bg: "#3a0808", n: "Overcrank Failure", t: "3 × 15s attempts", d: "After 3rd" },
  { s: "SHUTDOWN", c: "#f02828", bg: "#3a0808", n: "Emergency Stop (E-STOP)", t: "Manual", d: "Immediate" },
  { s: "SHUTDOWN", c: "#f02828", bg: "#3a0808", n: "AmpSentry Overcurrent", t: "Sustained > 110% rated", d: "Per trip curve" },
  { s: "ALARM", c: "#e8920a", bg: "#2a1800", n: "Low Oil Pressure Pre-alarm", t: "< 25 PSI", d: "3 seconds" },
  { s: "ALARM", c: "#e8920a", bg: "#2a1800", n: "High Temp Warning", t: "> 100°C", d: "5 seconds" },
  { s: "ALARM", c: "#e8920a", bg: "#2a1800", n: "Low Coolant Level", t: "Float switch", d: "10 seconds" },
  { s: "ALARM", c: "#e8920a", bg: "#2a1800", n: "Low Fuel Level", t: "Configurable %", d: "60 seconds" },
  { s: "ALARM", c: "#e8920a", bg: "#2a1800", n: "Over/Under Voltage", t: "±10% nominal", d: "3 seconds" },
  { s: "ALARM", c: "#e8920a", bg: "#2a1800", n: "Over/Under Frequency", t: "±2.5 Hz nominal", d: "3 seconds" },
  { s: "WARN", c: "#2888e0", bg: "#0a1828", n: "Battery Low Voltage", t: "< 11.5V DC", d: "5 seconds" },
  { s: "WARN", c: "#2888e0", bg: "#0a1828", n: "Charge Alternator Fail", t: "< 12.8V running", d: "10 seconds" },
  { s: "WARN", c: "#2888e0", bg: "#0a1828", n: "High Battery Voltage", t: "> 15.5V", d: "5 seconds" },
];

/* ── MAINTENANCE ── */
const MAINT = [
  { i: "DAILY", items: ["Check fuel level — at 30.1 GPH full load, an 8-hr shift burns 240+ gallons", "Check oil level (QSX15 carries 83L — use sight glass, not just dipstick)", "Inspect coolant overflow bottle: should be between MIN/MAX marks", "Walk-around: fuel / oil / coolant leaks, exhaust smoke color", "Air filter restriction indicator (critical on dusty sites — replace red)", "Verify battery voltage > 12.6V resting", "Log run hours, voltage, frequency, oil pressure, coolant temp"] },
  { i: "50 HRS", items: ["First oil and filter change (break-in — MANDATORY)", "Inspect all drive belts: alternator, fan, coolant pump", "Check exhaust system joints for soot streaks", "Inspect camlock bus connections: look for heat marks or oxidation", "Battery load test — verify CCA still > 1000", "Test E-stop: trip and verify clean shutdown, clean restart", "Verify fuel pump primer operation"] },
  { i: "250 HRS", items: ["Oil and filter change (both full-flow filters on QSX15)", "Replace primary fuel filter — prime system after (must bleed air)", "Check coolant: freeze point, pH (7.5–9.0), DCA additive level", "Radiator fins: blow clean with compressed air from engine side outward", "Verify voltage and frequency at no-load and 75% load (should be 480V ±5V, 60.0 ±0.3 Hz)", "Inspect alternator terminal connections — re-torque to spec", "Clean PowerCommand PCC3300 face — inspect for moisture ingress"] },
  { i: "500 HRS", items: ["Replace secondary fuel filter (engine-mounted)", "Replace air filter element — not just pre-cleaner", "Coolant flush and refill: 50% EG / 50% DI water only", "Re-torque ALL electrical bus connections: camlock lugs 150–200 in·lb", "Manual test all shutdowns: low oil pressure sim, overspeed simulation", "Load bank test: 100% standby (450kW) for minimum 2 hours — verify no derate", "Inspect flexible exhaust section for cracking or leaks", "Check valve clearances per QSX15 service manual"] },
  { i: "1,000 HRS", items: ["Full major service: all filters, fluids, belts, hoses", "Replace thermostat — QSX15 thermostat commonly sticks closed after 1,000 hrs", "Megger alternator windings: 2 MΩ minimum phase-to-ground @ 500V DC", "Fuel injection verification: compare fuel rail pressure to ECM map", "Governor calibration: isochronous — should hold 60.0 Hz ±0.25 Hz no-load to full step", "Load bank: step 25→50→75→100% — verify Hz dip < 10%, recover < 3s", "ATS transfer switch contact inspection if unit in auto-start service", "InPower diagnostic download: review fault log, ECM calibration check"] },
  { i: "2,000 HRS", items: ["Injector replacement or calibration bench test (6 injectors — common rail)", "Coolant pump rebuild or replacement", "Turbocharger inspection: shaft play, bearing, blade condition", "Compression test: minimum 400 PSI per cylinder, < 10% variance", "Alternator bearing replacement", "Starter motor overhaul"] },
];

/* ── LOAD CALC ── */
function LoadCalc() {
  const [items, setItems] = useState([
    { n: "HVAC Chillers (2×)", kw: 120, pf: .85 },
    { n: "Lighting / General Power", kw: 45, pf: 1.0 },
    { n: "Motor Loads (VFDs)", kw: 80, pf: .85 },
    { n: "Data Center UPS", kw: 60, pf: .95 },
  ]);
  const [nn, setNN] = useState(""); const [nk, setNK] = useState(""); const [np, setNP] = useState("0.9");
  const tkw = items.reduce((s, i) => s + i.kw, 0);
  const tkva = items.reduce((s, i) => s + (i.kw / i.pf), 0);
  const apf = tkw / tkva;
  const pct = tkw / 450; const gph = 30.1 * pct; const rt = 200 / gph;
  const bc = pct < .7 ? "var(--gr)" : pct < .9 ? "var(--am)" : "var(--re)";
  const add = () => { if (nn && nk) { setItems([...items, { n: nn, kw: parseFloat(nk), pf: parseFloat(np) }]); setNN(""); setNK(""); } };
  return (<div>
    <div className="sh">LOAD SIZING CALCULATOR — 450kW PRIME RATING</div>
    <div className="row">
      <div style={{ flex: 1, minWidth: "240px" }}>
        {items.map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "6px 8px", borderBottom: "1px solid var(--bdr)", fontSize: "13px" }}>
            <div style={{ flex: 1 }}>{item.n}</div>
            <div style={{ fontFamily: "var(--mo)", fontSize: "10px", color: "var(--am2)", minWidth: "55px", textAlign: "right" }}>{item.kw.toFixed(0)} kW</div>
            <div style={{ fontFamily: "var(--mo)", fontSize: "10px", color: "var(--tm)", minWidth: "45px", textAlign: "right" }}>PF {item.pf}</div>
            <button onClick={() => setItems(items.filter((_, j) => j !== i))} style={{ background: "#2a0808", border: "1px solid var(--re)", color: "var(--re2)", padding: "1px 7px", cursor: "pointer", fontFamily: "var(--mo)", fontSize: "10px" }}>✕</button>
          </div>
        ))}
        <div style={{ display: "flex", gap: "6px", padding: "8px 0", flexWrap: "wrap" }}>
          <input value={nn} onChange={e => setNN(e.target.value)} placeholder="Load name" style={{ flex: 2, minWidth: "100px", background: "var(--bg1)", border: "1px solid var(--bdr)", color: "var(--tx)", padding: "4px 8px", fontFamily: "var(--sa)", fontSize: "13px" }} />
          <input value={nk} onChange={e => setNK(e.target.value)} placeholder="kW" style={{ width: "65px", background: "var(--bg1)", border: "1px solid var(--bdr)", color: "var(--am2)", padding: "4px 8px", fontFamily: "var(--mo)", fontSize: "12px" }} />
          <input value={np} onChange={e => setNP(e.target.value)} placeholder="PF" style={{ width: "55px", background: "var(--bg1)", border: "1px solid var(--bdr)", color: "var(--tx)", padding: "4px 8px", fontFamily: "var(--mo)", fontSize: "12px" }} />
          <button onClick={add} style={{ background: "var(--bg3)", border: "1px solid var(--am)", color: "var(--am2)", padding: "4px 14px", cursor: "pointer", fontFamily: "var(--mo)", fontSize: "10px", letterSpacing: "1px" }}>+ ADD</button>
        </div>
      </div>
      <div style={{ width: "210px", display: "flex", flexDirection: "column", gap: "8px" }}>
        {[["Total Real Power", tkw.toFixed(0), "kW"], ["Total Apparent", tkva.toFixed(0), "kVA"], ["Avg Power Factor", apf.toFixed(3), ""], ["Fuel Use (200 gal tank)", gph.toFixed(1), "GPH"], ["Runtime (200 gal)", rt.toFixed(1), "hrs"]].map(([k, v, u], i) => (
          <div className="tile" key={i}><div className="tk">{k}</div><div><span className="tv">{v}</span><span className="tu">{u}</span></div></div>
        ))}
        <div className="tile"><div className="tk">% of 450kW Rating</div>
          <div style={{ height: "8px", background: "var(--bg0)", marginTop: "6px", overflow: "hidden" }}>
            <div style={{ width: `${Math.min(100, pct * 100)}%`, height: "100%", background: bc, transition: "width .3s" }} />
          </div>
          <div style={{ fontFamily: "var(--mo)", fontSize: "14px", color: bc, marginTop: "4px" }}>{(pct * 100).toFixed(0)}%{pct > 1 ? " ⚠ OVERLOAD" : ""}</div>
        </div>
      </div>
    </div>
  </div>);
}

const TABS = ["System View", "Electrical", "Protection", "Maintenance", "Load Calc"];

export default function App() {
  const [tab, setTab] = useState(0);
  const [sel, setSel] = useState(null);
  const [load, setLoad] = useState(.75);
  const [time, setTime] = useState("");
  const [g, setG] = useState({ rpm: 1800, hz: 60.0, v: 480, oil: 58, temp: 88, kw: 340, pf: .84, bat: 12.7 });
  useEffect(() => {
    const iv = setInterval(() => setG(x => ({ rpm: 1800 + (Math.random() - .5) * 5, hz: 60 + (Math.random() - .5) * .08, v: 480 + (Math.random() - .5) * 2, oil: 58 + (Math.random() - .5) * 2, temp: 88 + (Math.random() - .5), kw: 340 + (Math.random() - .5) * 4, pf: .84 + (Math.random() - .5) * .01, bat: 12.7 + (Math.random() - .5) * .05 })), 700);
    const tk = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => { clearInterval(iv); clearInterval(tk); };
  }, []);

  return (
    <div className="app">
      <style>{CSS}</style>
      <div className="hdr">
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div className="htag">GENSET-001</div>
          <div><div className="h1">450kW Diesel Generator</div><div className="hsub">CUMMINS QSX15-G9 · MODEL DFEJ · EPA NSPS TIER 2 · 480V 3φ 60Hz · 563kVA STANDBY</div></div>
        </div>
        <div className="hstat">
          <div className="sdot on" style={{ background: "var(--gr)", boxShadow: "0 0 8px var(--gr)" }} />
          <div className="slbl">RUNNING</div>
          <div className="htime" style={{ marginLeft: 10 }}>{time}</div>
        </div>
      </div>
      <div className="tabs">
        {TABS.map((t, i) => <button key={i} className={`tab${tab === i ? " ac" : ""}`} onClick={() => setTab(i)}>{t}</button>)}
      </div>

      {tab === 0 && (
        <div className="body">
          <div className="panel aa" data-lbl="Live Instrumentation · QSX15 Running Values">
            <div className="pi">
              <div className="grow">
                <G value={g.rpm} min={0} max={2400} label="ENGINE RPM" unit="RPM" warn={2100} danger={2150} dec={0} />
                <G value={g.hz} min={55} max={65} label="FREQUENCY" unit="Hz" warn={61.5} danger={63} color="#2888e0" dec={1} />
                <G value={g.v} min={400} max={540} label="VOLTAGE L-L" unit="V" warn={510} danger={516} color="#2888e0" dec={0} />
                <G value={g.oil} min={0} max={120} label="OIL PRESS" unit="PSI" warn={25} danger={20} color="#22d855" dec={0} />
                <G value={g.temp} min={40} max={120} label="COOLANT °C" unit="°C" warn={100} danger={104} color="#18c0c8" dec={0} />
                <G value={g.kw} min={0} max={500} label="OUTPUT kW" unit="kW" warn={450} danger={465} color="#d8c818" dec={0} />
                <G value={g.pf} min={0} max={1} label="PWR FACTOR" unit="PF" color="#9830d8" dec={2} />
                <G value={g.bat} min={9} max={16} label="BATTERY V" unit="Vdc" warn={11.5} color="#22d855" dec={1} />
              </div>
            </div>
          </div>
          <div className="panel ag" data-lbl="System Flow · Click Component for Verified QSX15 Specs">
            <div className="pi"><Flow onSel={setSel} sel={sel} /></div>
          </div>
          {sel && DET[sel] && (
            <div className="panel aa" data-lbl={`Component Detail — ${DET[sel].t}`}>
              <div className="pi">
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                  <div className="sh" style={{ margin: 0 }}>{DET[sel].t}</div>
                  <button onClick={() => setSel(null)} style={{ background: "var(--bg1)", border: "1px solid var(--bdr)", color: "var(--tm)", padding: "3px 12px", cursor: "pointer", fontFamily: "var(--mo)", fontSize: "10px" }}>✕</button>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(270px,1fr))", gap: "0 20px" }}>
                  {DET[sel].s.map(([k, v], i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: "1px solid var(--bdr)", gap: "8px" }}>
                      <span style={{ fontFamily: "var(--mo)", fontSize: "9px", color: "var(--tm)", textTransform: "uppercase" }}>{k}</span>
                      <span style={{ fontFamily: "var(--mo)", fontSize: "10px", color: "var(--am2)", fontWeight: 700, textAlign: "right" }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          <div className="panel" data-lbl="Key Operating Parameters — Cummins DFEJ Data Sheet Verified">
            <div className="pi">
              <div className="tgrid">
                {[
                  { k: "Standby Rating", v: "450", u: "kW", s: "563 kVA @ 0.8 PF", cy: true },
                  { k: "Prime Rating", v: "410", u: "kW", s: "513 kVA (ISO 8528)", cy: true },
                  { k: "Engine Model", v: "QSX15-G9", u: "", s: "In-line 6 / TCAC" },
                  { k: "Displacement", v: "15.0", u: "L", s: "915 cu in" },
                  { k: "Bore × Stroke", v: "136.9×168.9", u: "mm", s: "5.39\" × 6.65\"" },
                  { k: "Compression Ratio", v: "17.0:1", u: "", s: "Per Cummins D-3400" },
                  { k: "Oil Capacity", v: "83.3", u: "L", s: "88 qt — 2 spin-on filters", cy: true },
                  { k: "Coolant (w/radiator)", v: "57.9", u: "L", s: "15.3 US gal", cy: true },
                  { k: "Fuel @ 100% Standby", v: "30.1", u: "GPH", s: "114 L/hr", cy: true },
                  { k: "Fuel @ 75% Standby", v: "23.4", u: "GPH", s: "89 L/hr" },
                  { k: "Current @ 480V", v: "677", u: "A", s: "per phase, standby", cy: true },
                  { k: "Motor Start kVA (PMG)", v: "2,208", u: "kVA", s: "@ 90% sustained V", cy: true },
                  { k: "Exhaust Temp", v: "463", u: "°C", s: "865°F @ standby load", cy: true },
                  { k: "Exhaust Back Pressure", v: "10.2", u: "kPa", s: "41 in H₂O max", cy: true },
                  { k: "Weight (wet)", v: "9,335", u: "lbs", s: "4,234 kg", cy: true },
                  { k: "Dimensions (L)", v: "156\"", u: "", s: "3,962mm overall" },
                  { k: "Overspeed Trip", v: "2,150", u: "RPM", s: "±50 RPM" },
                  { k: "Max Altitude (no derate)", v: "5,700", u: "ft", s: "1,740m ASL" },
                ].map((t, i) => (
                  <div className={`tile${t.cy ? " cy" : ""}`} key={i}>
                    <div className="tk">{t.k}</div>
                    <div><span className="tv">{t.v}</span><span className="tu">{t.u}</span></div>
                    <div className="ts">{t.s}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 1 && (
        <div className="body">
          <div className="panel ab" data-lbl="3-Phase Output Waveform · 480V 60Hz">
            <div className="pi">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, flexWrap: "wrap", gap: 8 }}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                  {[["#e84040", "L1 — 277V (0°)"], ["#e0c020", "L2 — 277V (120°)"], ["#3080e0", "L3 — 277V (240°)"], ["#18c0c8", "Current I (lag)"]].map(([c, l]) => (
                    <div className="pleg" key={l}><div className="pl" style={{ background: c }} />{l}</div>
                  ))}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", fontFamily: "var(--mo)", fontSize: "10px", color: "var(--tm)" }}>
                  Load:<input type="range" min="10" max="100" value={Math.round(load * 100)} onChange={e => setLoad(e.target.value / 100)} style={{ width: "80px" }} />{Math.round(load * 100)}%
                </div>
              </div>
              <Scope load={load} />
            </div>
          </div>
          <div className="row">
            <div className="panel ac2" data-lbl="Phasor Diagram" style={{ flex: "0 0 auto" }}>
              <div className="pi">
                <Phasor pf={g.pf} />
                <div style={{ fontFamily: "var(--mo)", fontSize: "9px", color: "var(--tm)", marginTop: "8px", textAlign: "center" }}>
                  φ = {(Math.acos(g.pf) * 180 / Math.PI).toFixed(1)}° | PF = {g.pf.toFixed(3)}<br />Lagging (inductive)
                </div>
              </div>
            </div>
            <div className="panel ab" data-lbl="Power Triangle — Live" style={{ flex: 1, minWidth: "200px" }}>
              <div className="pi">
                <div className="sh">POWER RELATIONSHIPS</div>
                {(() => {
                  const kw = g.kw, kva = kw / g.pf, kvar = Math.sqrt(kva * kva - kw * kw);
                  const W = 220, H = 130, scl = W * .82 / kva;
                  return (
                    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ maxWidth: "100%" }}>
                      <polygon points={`20,${H - 20} ${20 + kw * scl},${H - 20} ${20 + kw * scl},${H - 20 - kvar * scl}`} fill="#0a1a2e" stroke="#1c3250" strokeWidth="1" />
                      <line x1={20} y1={H - 20} x2={20 + kw * scl} y2={H - 20} stroke="#22d855" strokeWidth="2.5" />
                      <text x={20 + kw * scl / 2} y={H - 7} fill="#22d855" fontSize="9" textAnchor="middle" fontFamily="'JetBrains Mono'" fontWeight="700">P={kw.toFixed(0)}kW</text>
                      <line x1={20 + kw * scl} y1={H - 20} x2={20 + kw * scl} y2={H - 20 - kvar * scl} stroke="#f02828" strokeWidth="2.5" />
                      <text x={20 + kw * scl + 5} y={H - 20 - kvar * scl / 2} fill="#f02828" fontSize="9" fontFamily="'JetBrains Mono'" fontWeight="700">Q={kvar.toFixed(0)}kVAR</text>
                      <line x1={20} y1={H - 20} x2={20 + kw * scl} y2={H - 20 - kvar * scl} stroke="#2888e0" strokeWidth="2.5" />
                      <text x={20 + kw * scl / 2 - 18} y={H - 20 - kvar * scl / 2 - 8} fill="#2888e0" fontSize="9" textAnchor="middle" fontFamily="'JetBrains Mono'" fontWeight="700">S={kva.toFixed(0)}kVA</text>
                    </svg>
                  );
                })()}
                <table className="st" style={{ marginTop: "8px" }}>
                  <tbody>
                    <tr><td>Apparent S</td><td>{(g.kw / g.pf).toFixed(0)} kVA</td></tr>
                    <tr><td>Real P</td><td>{g.kw.toFixed(0)} kW</td></tr>
                    <tr><td>Reactive Q</td><td>{(Math.sqrt(Math.pow(g.kw / g.pf, 2) - Math.pow(g.kw, 2))).toFixed(0)} kVAR</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="panel aa" data-lbl="Output Configurations — 450kW" style={{ flex: 1, minWidth: "200px" }}>
              <div className="pi">
                <table className="st">
                  <tbody>
                    <tr className="hr"><td colSpan="2">STANDARD 480V CONFIGS</td></tr>
                    <tr><td>3φ 4W 480V L-L</td><td>677A / phase standby</td></tr>
                    <tr><td>3φ 4W 277V L-N</td><td>677A / phase standby</td></tr>
                    <tr><td>3φ 4W 208V L-L</td><td>~1,245A / phase (derated)</td></tr>
                    <tr><td>1φ 240V (from 3φ)</td><td>Up to 2/3 rated kW</td></tr>
                    <tr className="hr"><td colSpan="2">HIGH VOLTAGE OPTION</td></tr>
                    <tr><td>3φ 347/600V</td><td>542A standby</td></tr>
                    <tr className="hr"><td colSpan="2">ELECTRICAL PERFORMANCE</td></tr>
                    <tr><td>Voltage regulation</td><td>±0.5% (PowerCommand)</td></tr>
                    <tr><td>Frequency (isochronous)</td><td>±0.25% full load</td></tr>
                    <tr><td>THD (linear load)</td><td>&lt; 3%</td></tr>
                    <tr><td>Motor start kVA (PMG)</td><td>2,208 kVA @ 90% V</td></tr>
                    <tr><td>Surge kW</td><td>511–516 kW</td></tr>
                    <tr><td>Short circuit capacity</td><td>65 kAIC minimum</td></tr>
                    <tr><td>Phase rotation</td><td>A-B-C standard</td></tr>
                    <tr><td>Insulation class</td><td>Class H (150°C)</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 2 && (
        <div className="body">
          <div className="row">
            <div className="panel ar" data-lbl="Protection Schedule — PowerCommand PCC3300 / ANSI" style={{ flex: 2, minWidth: "300px" }}>
              <div className="pi">
                <div className="co info" style={{ marginBottom: "10px" }}>AmpSentry integrated protection in PCC3300 enforces current limits digitally. Setpoints configurable via InPower Pro service tool.</div>
                {FAULTS.map((f, i) => (
                  <div className="fi" key={i}>
                    <div className="fdot" style={{ background: f.c, boxShadow: `0 0 5px ${f.c}44` }} />
                    <span className="fb" style={{ background: f.bg, color: f.c, border: `1px solid ${f.c}` }}>{f.s}</span>
                    <span style={{ flex: 1 }}>{f.n}</span>
                    <span style={{ fontFamily: "var(--mo)", fontSize: "9px", color: "var(--tm)", textAlign: "right", minWidth: "170px" }}>{f.t}</span>
                    <span style={{ fontFamily: "var(--mo)", fontSize: "9px", color: "var(--tl)", minWidth: "90px", textAlign: "right" }}>{f.d}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="col" style={{ flex: 1, minWidth: "220px" }}>
              <div className="panel aa" data-lbl="Start Sequence — PCC3300">
                <div className="pi">
                  {[
                    { n: "1", t: "Start signal", s: "Panel, remote, or automatic (ATS)" },
                    { n: "2", t: "Pre-crank check", s: "Battery V > 9.5V, no active SD faults" },
                    { n: "3", t: "Fuel solenoid opens", s: "Engine ECM enables fuel via J1939" },
                    { n: "4", t: "Cranking", s: "Starter energized, max 15s per attempt (QSX15)" },
                    { n: "5", t: "Oil pressure confirms", s: "Must rise within 15s of firing" },
                    { n: "6", t: "Warm-up timer", s: "Configurable 0–300s" },
                    { n: "7", t: "Hz + V confirmed", s: "60.0±0.5 Hz, 480V ±5% stable" },
                    { n: "8", t: "ATS close / breaker close", s: "PCC3300 signals transfer" },
                  ].map(s => (
                    <div key={s.n} style={{ display: "flex", gap: "10px", alignItems: "flex-start", padding: "6px 0", borderBottom: "1px solid var(--bdr)" }}>
                      <div style={{ background: "var(--am)", color: "#000", fontFamily: "var(--mo)", fontSize: "9px", fontWeight: "700", minWidth: "20px", height: "20px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{s.n}</div>
                      <div><div style={{ fontSize: "13px" }}>{s.t}</div><div style={{ fontFamily: "var(--mo)", fontSize: "9px", color: "var(--tm)" }}>{s.s}</div></div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="panel ab" data-lbl="Verified Operating Limits — QSX15">
                <div className="pi">
                  <table className="st">
                    <tbody>
                      {[
                        ["Oil pressure normal", "40–75 PSI"], ["Oil press alarm", "< 25 PSI"], ["Oil press shutdown", "< 20 PSI"],
                        ["Coolant temp normal", "82–95°C"], ["Coolant alarm", "100°C"], ["Coolant shutdown", "104°C"],
                        ["Overspeed trip", "2,150 RPM ±50"], ["Freq normal", "59.5–60.5 Hz"],
                        ["Over-voltage", "528V (+10%)"], ["Under-voltage", "432V (-10%)"],
                        ["Altitude (no derate)", "≤ 5,700 ft / 1,740m"], ["Temp (no derate)", "≤ 40°C / 104°F"],
                        ["Min ambient (w/heater)", "-20°C"], ["Max ambient (std)", "50°C (with 50°C rad)"],
                      ].map(([k, v], i) => <tr key={i}><td>{k}</td><td>{v}</td></tr>)}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 3 && (
        <div className="body">
          <div className="row">
            <div className="panel ag" data-lbl="Preventive Maintenance — QSX15 Service Schedule" style={{ flex: 2 }}>
              <div className="pi">
                {MAINT.map((m, i) => (
                  <div className="mr" key={i}>
                    <div className="mi">{m.i}</div>
                    <div className="mc">
                      {m.items.map((item, j) => (
                        <div key={j} style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
                          <span style={{ color: "var(--gr2)", fontFamily: "var(--mo)", fontSize: "10px", marginTop: "2px", flexShrink: 0 }}>▸</span>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="col" style={{ flex: 1, minWidth: "220px" }}>
              <div className="panel aa" data-lbl="QSX15 Fluid Specifications — Verified">
                <div className="pi">
                  <table className="st">
                    <tbody>
                      {[
                        ["Engine oil grade", "15W-40 API CK-4"], ["Oil capacity (QSX15)", "83.3 L / 88 qt — 2 filters"], ["Oil drain interval", "250 hrs standard"],
                        ["Coolant spec", "50% EG / 50% DI water only"], ["Coolant capacity", "57.9 L / 15.3 gal"], ["Coolant interval", "1,000 hrs / annually"],
                        ["Coolant pH", "7.5–9.0"], ["Freeze protect", "–37°C / –34°F"],
                        ["DCA additive", "Required — Cummins Fleetguard"],
                        ["Diesel fuel", "ASTM D975 #2 ULSD"], ["Sulfur max", "15 ppm"], ["Biodiesel", "B5 max"],
                        ["Battery CCA", "1,000 CCA minimum"],
                      ].map(([k, v], i) => <tr key={i}><td>{k}</td><td>{v}</td></tr>)}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="panel ar" data-lbl="Field Diagnosis — QSX15 Common Faults">
                <div className="pi">
                  {[
                    { f: "Smoke at startup (white/blue)", c: "Cold engine, worn rings, or water in fuel", fix: "Verify fuel quality. If persistent: compression test" },
                    { f: "Low fuel rail pressure", c: "Worn lift pump, clogged primary filter, water in fuel", fix: "Fuel sample test, replace filters, bleed air from system" },
                    { f: "High coolant temp", c: "Low coolant, blocked fins, thermostat stuck, failed water pump", fix: "Check level cold, clean radiator fins, test thermostat 82°C" },
                    { f: "Low oil pressure", c: "Low level, worn pump, wrong viscosity, high temp", fix: "Check level, verify oil spec (15W-40 CK-4), check oil cooler" },
                    { f: "Wet stacking", c: "< 30% load for extended periods — unburned fuel deposits", fix: "Load bank at 75–100% for 2+ hrs, check exhaust color" },
                    { f: "Hz hunting / instability", c: "Governor interaction, fuel contamination, injector issue", fix: "Fuel sample, check ECM calibration via InPower" },
                  ].map((f, i) => (
                    <div key={i} style={{ padding: "7px 0", borderBottom: "1px solid var(--bdr)" }}>
                      <div style={{ color: "var(--re2)", fontFamily: "var(--mo)", fontSize: "10px", fontWeight: "700" }}>{f.f}</div>
                      <div style={{ fontSize: "12px", color: "var(--tm)", marginTop: "2px" }}><b style={{ color: "#6080a0" }}>Cause:</b> {f.c}</div>
                      <div style={{ fontSize: "12px", color: "var(--gr)", marginTop: "1px" }}><b>Fix:</b> {f.fix}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 4 && (
        <div className="body">
          <div className="panel aa" data-lbl="Load Sizing Calculator — 450kW Prime Rating">
            <div className="pi"><LoadCalc /></div>
          </div>
          <div className="row">
            <div className="panel ab" data-lbl="Derating — Per Cummins D-3400 Data Sheet" style={{ flex: 1, minWidth: "200px" }}>
              <div className="pi">
                <div className="co info">Cummins published derate factors for QSX15-G9 (D-3400). These are NOT estimates — they are from the official data sheet.</div>
                <table className="st" style={{ marginTop: "8px" }}>
                  <tbody>
                    {[
                      ["No-derate zone", "≤ 5,700 ft AND ≤ 40°C"],
                      ["5,700–7,280 ft", "2.8% per 1,000 ft"],
                      ["5,700 ft", "–0% → 450kW"],
                      ["6,700 ft", "–2.8% → 437kW"],
                      ["7,280 ft", "–4.4% → 430kW"],
                      ["Above 7,280 ft", "4.3% per 1,000 ft additional"],
                      ["Above 9,840 ft", "1.8% per 1,000 ft (+ 14.9% total base)"],
                      ["Temp above 40°C", "5.7% per 10°C"],
                      ["45°C ambient", "–2.9% → 437kW"],
                      ["50°C ambient", "–5.7% → 424kW (std rad limit)"],
                      ["Non-linear VFD loads", "Add 20–25% sizing margin"],
                      ["Motor starting (DOL)", "PMG provides 2,208 kVA @ 90% V"],
                      ["Continuous duty rule", "Load ≤ 80% of prime (328kW max)"],
                    ].map(([k, v], i) => <tr key={i}><td>{k}</td><td>{v}</td></tr>)}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="panel ag" data-lbl="Noise vs Distance" style={{ flex: 1, minWidth: "200px" }}>
              <div className="pi">
                <div className="co warn">450kW generators are significantly louder than 50kW units. Open set: ~100 dBA at 1m. Sound-attenuated enclosure reduces by 20–28 dB.</div>
                {[
                  { d: "7m / 23ft", dba: 78, l: "Attenuated — rated test" },
                  { d: "10m / 33ft", dba: 74, l: "Construction fence" },
                  { d: "15m / 49ft", dba: 70, l: "Heavy traffic level" },
                  { d: "25m / 82ft", dba: 64, l: "Loud conversation" },
                  { d: "50m / 164ft", dba: 58, l: "Normal conversation" },
                  { d: "100m / 328ft", dba: 52, l: "Quiet office" },
                ].map(d => (
                  <div key={d.d} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "5px 0", borderBottom: "1px solid var(--bdr)" }}>
                    <div style={{ minWidth: "110px", fontFamily: "var(--mo)", fontSize: "9px", color: "var(--tm)" }}>{d.d}</div>
                    <div style={{ flex: 1, height: "8px", background: "var(--bg0)", overflow: "hidden" }}>
                      <div style={{ width: `${(d.dba / 90) * 100}%`, height: "100%", background: `hsl(${120 - d.dba * 1.0}deg,70%,45%)` }} />
                    </div>
                    <div style={{ fontFamily: "var(--mo)", fontSize: "10px", color: "var(--am2)", minWidth: "50px", textAlign: "right", fontWeight: "700" }}>{d.dba} dBA</div>
                    <div style={{ fontFamily: "var(--mo)", fontSize: "9px", color: "var(--tl)", minWidth: "120px" }}>{d.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}