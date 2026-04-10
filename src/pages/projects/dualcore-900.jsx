import { useState, useEffect, useRef } from "react";

/* ════════════════════════════════════════════════════════════════════════════
   DUALCORE 900 — INTEGRATED DUAL-ENGINE GENERATOR
   Engineering Design Document
   
   CONCEPT: Two Cummins QSX15-G9 engines in one factory-integrated enclosure
   solving every failure mode of field-parallel operation while exceeding
   the efficiency of both a parallel setup and a single 900kW machine.
   
   Design philosophy: Factory certainty. Field simplicity. Zero sync risk.
   ════════════════════════════════════════════════════════════════════════════ */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Rajdhani:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;700&display=swap');
:root {
  --ink:#040810;      /* near-black blue */
  --p0:#050c18;       /* page bg */
  --p1:#081220;       /* card bg */
  --p2:#0c1a2c;       /* card inner */
  --p3:#102234;       /* elevated */
  --line:#143050;     /* border */
  --line2:#1a3c60;    /* border bright */
  --E1:#f0a010;       /* Engine 1 — gold */
  --E1b:#ffe080;
  --E2:#10c8d0;       /* Engine 2 — cyan */
  --E2b:#60eef4;
  --BUS:#3090f0;      /* Bus — blue */
  --BUSb:#80c0ff;
  --OK:#20e060;       /* green */
  --OK2:#10a038;
  --WN:#e0c010;       /* warning yellow */
  --ER:#f02828;       /* red */
  --ER2:#ff7060;
  --PU:#9040e0;       /* purple accent */
  --PUb:#c080ff;
  --TX:#b8d8f8;       /* text hi */
  --TM:#80aacc;       /* text mid — brightened from #486888 */
  --TL:#4a74a2;       /* text lo — brightened from #1e3858 */
  --MO:'JetBrains Mono',monospace;
  --SA:'Rajdhani',sans-serif;
  --DI:'Bebas Neue',sans-serif;
}
*{box-sizing:border-box;margin:0;padding:0;}
html,body{background:var(--ink);}
.app{font-family:var(--SA);background:var(--p0);color:var(--TX);min-height:100vh;}

/* ─── MASTHEAD ─── */
.mast{
  background:linear-gradient(135deg,#080f1c 0%,#0a1828 50%,#040c18 100%);
  border-bottom:1px solid var(--line);
  padding:0 28px;
  position:relative;
  overflow:hidden;
}
.mast::before{
  content:'';position:absolute;top:0;left:0;right:0;bottom:0;
  background:repeating-linear-gradient(
    -45deg,transparent,transparent 20px,
    rgba(16,48,80,.15) 20px,rgba(16,48,80,.15) 21px
  );
  pointer-events:none;
}
.mast-inner{display:flex;align-items:center;justify-content:space-between;padding:14px 0;gap:12px;flex-wrap:wrap;position:relative;}
.brand{display:flex;align-items:center;gap:20px;}
.brand-mark{
  background:linear-gradient(135deg,var(--E1) 0%,#ffd060 50%,var(--E2) 100%);
  color:#000;font-family:var(--DI);font-size:11px;letter-spacing:3px;
  padding:5px 14px;clip-path:polygon(6px 0,100% 0,calc(100% - 6px) 100%,0 100%);
}
.brand-name{font-family:var(--DI);font-size:32px;letter-spacing:6px;
  background:linear-gradient(90deg,var(--E1b) 0%,var(--BUSb) 60%,var(--E2b) 100%);
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
  line-height:1;
}
.brand-sub{font-family:var(--MO);font-size:11px;color:var(--TM);letter-spacing:2px;margin-top:2px;}
.spec-strip{display:flex;gap:20px;flex-wrap:wrap;}
.spec-chip{text-align:center;}
.spec-chip-v{font-family:var(--DI);font-size:18px;color:var(--BUSb);letter-spacing:2px;}
.spec-chip-k{font-family:var(--MO);font-size:10px;color:var(--TM);letter-spacing:2px;text-transform:uppercase;}
.sys-dots{display:flex;gap:12px;align-items:center;}
.dot-item{display:flex;flex-direction:column;align-items:center;gap:3px;}
.dot{width:10px;height:10px;border-radius:50%;}
.dot.on{animation:pulse 1.8s ease-in-out infinite;}
@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.55;transform:scale(.82)}}
.dot-lbl{font-family:var(--MO);font-size:10px;letter-spacing:1.5px;text-transform:uppercase;}
.dot-val{font-family:var(--MO);font-size:10px;}

/* ─── TABS ─── */
.tabs{display:flex;background:var(--ink);border-bottom:1px solid var(--line);padding:0 28px;overflow-x:auto;}
.tab{padding:12px 18px;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;cursor:pointer;color:var(--TL);border-bottom:2px solid transparent;transition:all .15s;background:none;border-top:none;border-left:none;border-right:none;font-family:var(--SA);white-space:nowrap;}
.tab:hover{color:var(--TM);}
.tab.ac{color:var(--E1);border-bottom-color:var(--E1);}

.body{padding:20px 28px;display:flex;flex-direction:column;gap:16px;}
.row{display:flex;gap:16px;flex-wrap:wrap;}
.col{display:flex;flex-direction:column;gap:16px;}

/* ─── PANELS ─── */
.panel{background:var(--p1);border:1px solid var(--line);position:relative;}
.panel[data-lbl]::before{
  content:attr(data-lbl);position:absolute;top:0;left:0;
  font-family:var(--MO);font-size:10px;letter-spacing:2px;
  padding:3px 12px;background:var(--line);color:var(--TM);text-transform:uppercase;z-index:2;
}
.pi{padding:26px 18px 18px;}
.pi.nl{padding:18px;}
.e1t{border-top:2px solid var(--E1);}
.e2t{border-top:2px solid var(--E2);}
.but{border-top:2px solid var(--BUS);}
.okt{border-top:2px solid var(--OK);}
.ert{border-top:2px solid var(--ER);}
.put{border-top:2px solid var(--PU);}
.wnt{border-top:2px solid var(--WN);}
.panel.highlight{border:1px solid var(--E1);background:linear-gradient(135deg,var(--p1) 80%,#1a1800 100%);}

/* ─── SECTION HDR ─── */
.sh{font-family:var(--MO);font-size:11px;letter-spacing:3px;color:var(--TM);text-transform:uppercase;margin-bottom:12px;display:flex;align-items:center;gap:10px;}
.sh::after{content:'';flex:1;height:1px;background:var(--line);}
.sh.e1{color:var(--E1);}
.sh.e2{color:var(--E2);}
.sh.bu{color:var(--BUSb);}

/* ─── SPEC TABLE ─── */
.st{width:100%;border-collapse:collapse;font-size:13px;}
.st td{padding:5px 10px;border-bottom:1px solid var(--line);}
.st td:first-child{color:var(--TM);font-family:var(--MO);font-size:11px;letter-spacing:.5px;text-transform:uppercase;width:52%;}
.st td:last-child{font-weight:700;text-align:right;}
.st tr:last-child td{border-bottom:none;}
.st .hr td{color:var(--TX)!important;font-size:11px!important;font-weight:700;background:var(--p3);letter-spacing:2px!important;}
.st .e1c td:last-child{color:var(--E1b);}
.st .e2c td:last-child{color:var(--E2b);}
.st .okc td:last-child{color:var(--OK);}
.st .erc td:last-child{color:var(--ER2);}
.st .buc td:last-child{color:var(--BUSb);}
.st .yc td:last-child{color:var(--WN);}
.st .puc td:last-child{color:var(--PUb);}
.st td:last-child{color:var(--E1b);}

/* ─── CALLOUT ─── */
.co{border-left:3px solid;padding:10px 14px;margin:8px 0;font-family:var(--MO);font-size:11px;line-height:1.7;}
.co.ok{border-color:var(--OK);color:var(--OK);background:rgba(20,80,30,.15);}
.co.er{border-color:var(--ER);color:var(--ER2);background:rgba(60,0,0,.15);}
.co.inf{border-color:var(--BUS);color:var(--BUSb);background:rgba(8,24,50,.25);}
.co.wn{border-color:var(--WN);color:var(--WN);background:rgba(40,30,0,.2);}
.co.pu{border-color:var(--PU);color:var(--PUb);background:rgba(40,8,60,.2);}

/* ─── COMPARE GRID ─── */
.cmp-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:1px;background:var(--line);}
.cmp-cell{background:var(--p1);padding:10px 14px;}
.cmp-cell.hdr{background:var(--p3);font-family:var(--MO);font-size:11px;letter-spacing:2px;font-weight:700;text-transform:uppercase;}
.cmp-cell.e1h{color:var(--E1);}
.cmp-cell.e2h{color:var(--E2);}
.cmp-cell.dch{color:var(--BUSb);}
.cmp-k{font-family:var(--MO);font-size:11px;color:var(--TM);margin-bottom:3px;text-transform:uppercase;letter-spacing:.5px;}
.cmp-v{font-size:13px;font-weight:600;}
.cmp-v.bad{color:var(--ER2);}
.cmp-v.ok{color:var(--OK);}
.cmp-v.great{color:var(--E2b);}
.cmp-v.neutral{color:var(--TX);}

/* ─── FEATURE CARDS ─── */
.fgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(270px,1fr));gap:12px;}
.fcard{background:var(--p2);border:1px solid var(--line);border-left:3px solid;padding:14px 16px;}
.fcard-t{font-family:var(--MO);font-size:12px;font-weight:700;letter-spacing:1px;margin-bottom:7px;text-transform:uppercase;}
.fcard-b{font-size:13px;line-height:1.6;color:var(--TX);}
.fcard-tag{font-family:var(--MO);font-size:10px;letter-spacing:2px;padding:2px 8px;display:inline-block;margin-top:7px;text-transform:uppercase;}

/* ─── FLOW LINES ─── */
@keyframes fR{from{stroke-dashoffset:20}to{stroke-dashoffset:0}}
@keyframes fL{from{stroke-dashoffset:0}to{stroke-dashoffset:20}}
.fe1{stroke:var(--E1);stroke-width:2.5;fill:none;stroke-dasharray:7 4;animation:fR .5s linear infinite;}
.fe2{stroke:var(--E2);stroke-width:2.5;fill:none;stroke-dasharray:7 4;animation:fR .5s linear infinite;}
.fbu{stroke:var(--BUS);stroke-width:2;fill:none;stroke-dasharray:9 4;animation:fR .35s linear infinite;}
.ffu{stroke:#c08020;stroke-width:2;fill:none;stroke-dasharray:6 4;animation:fR .6s linear infinite;}
.fco{stroke:#20b0b8;stroke-width:2;fill:none;stroke-dasharray:6 4;animation:fR .7s linear infinite;}
.fex{stroke:#805030;stroke-width:1.5;fill:none;stroke-dasharray:5 5;animation:fR .9s linear infinite;}
.fct{stroke:#c8c010;stroke-width:1.5;fill:none;stroke-dasharray:4 4;animation:fR 1.1s linear infinite;}

/* ─── EFFICIENCY BARS ─── */
.ebar-row{display:flex;align-items:center;gap:10px;margin:5px 0;}
.ebar-lbl{font-family:var(--MO);font-size:11px;color:var(--TM);width:120px;text-align:right;flex-shrink:0;}
.ebar-track{flex:1;height:12px;background:var(--ink);position:relative;overflow:hidden;border:1px solid var(--line);}
.ebar-fill{height:100%;transition:width .5s ease;}
.ebar-val{font-family:var(--MO);font-size:10px;font-weight:700;width:60px;flex-shrink:0;}

/* ─── STAGES ─── */
.stage{display:flex;gap:12px;align-items:flex-start;padding:8px 0;border-bottom:1px solid var(--line);}
.stage:last-child{border-bottom:none;}
.snum{width:26px;height:26px;display:flex;align-items:center;justify-content:center;font-family:var(--MO);font-size:11px;font-weight:700;flex-shrink:0;}
.sbody .st{font-size:14px;font-weight:600;}
.sbody .ss{font-family:var(--MO);font-size:11px;color:var(--TM);margin-top:3px;line-height:1.5;}

/* ─── TILES ─── */
.tgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:8px;}
.tile{background:var(--p2);border:1px solid var(--line);padding:10px 13px;border-left:3px solid var(--line2);transition:border-color .15s;}
.tile:hover{border-left-color:var(--E1);}
.tile.e1{border-left-color:var(--E1);}
.tile.e2{border-left-color:var(--E2);}
.tile.bu{border-left-color:var(--BUS);}
.tile.ok{border-left-color:var(--OK);}
.tk{font-family:var(--MO);font-size:10px;letter-spacing:2px;color:var(--TM);text-transform:uppercase;margin-bottom:4px;}
.tv{font-family:var(--DI);font-size:20px;color:var(--E1b);letter-spacing:1px;line-height:1;}
.tu{font-size:10px;color:var(--TM);margin-left:2px;}
.ts{font-size:11px;color:var(--TL);margin-top:3px;}

/* TOGGLE */
.tog{padding:7px 16px;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;cursor:pointer;font-family:var(--SA);border:1px solid var(--line);background:var(--p1);color:var(--TL);transition:all .15s;}
.tog:hover{color:var(--TM);}
.tog.on{background:var(--p3);border-color:var(--E1);color:var(--E1b);}

/* GAUGE */
.grow{display:flex;gap:10px;flex-wrap:wrap;justify-content:center;}
.gwrap{display:flex;flex-direction:column;align-items:center;gap:4px;}
.glbl{font-family:var(--MO);font-size:10px;letter-spacing:1px;color:var(--TM);text-transform:uppercase;}
`;

/* ── ARC GAUGE ── */
function G({value,min,max,label,unit,size=88,color="#f0a010",warn,danger,dec=0}){
  const pct=Math.max(0,Math.min(1,(value-min)/(max-min)));
  const r=size/2-10,cx=size/2,cy=size/2+5;
  const xy=d=>({x:cx+r*Math.cos(d*Math.PI/180),y:cy+r*Math.sin(d*Math.PI/180)});
  const arc=(a1,a2,c)=>{const s=xy(a1),e=xy(a2),lg=Math.abs(a2-a1)>180?1:0;
    return<path d={`M${s.x},${s.y}A${r},${r}0 ${lg}1${e.x},${e.y}`}stroke={c}strokeWidth="4"fill="none"strokeLinecap="round"/>;};
  const ang=-225+pct*270,tip=xy(ang);
  let vc=color;
  if(danger!==undefined&&value>=danger)vc="#f02828";
  else if(warn!==undefined&&value>=warn)vc="#e0c010";
  return(<div className="gwrap">
    <svg width={size}height={size}style={{overflow:"visible"}}>
      {arc(-225,45,"#0c1e30")}{arc(-225,ang,vc)}
      <line x1={cx}y1={cy}x2={tip.x}y2={tip.y}stroke={vc}strokeWidth="1.5"strokeLinecap="round"/>
      <circle cx={cx}cy={cy}r="3"fill={vc}/>
      <text x={cx}y={cy+17}textAnchor="middle"fill={vc}fontSize="13"fontFamily="'JetBrains Mono'"fontWeight="700">{value.toFixed(dec)}</text>
      <text x={cx}y={cy+27}textAnchor="middle"fill="#5a80a0"fontSize="10"fontFamily="'JetBrains Mono'">{unit}</text>
    </svg>
    <div className="glbl">{label}</div>
  </div>);
}

/* ── INTEGRATED ARCHITECTURE DIAGRAM ── */
function ArchDiagram({mode}){
  const[off,setOff]=useState(0);
  useEffect(()=>{const iv=setInterval(()=>setOff(o=>(o+1)%20),50);return()=>clearInterval(iv);},[]);
  const both=mode==="dual",e2=mode!=="e1only";

  return(
    <svg width="100%"viewBox="0 0 900 440"style={{maxWidth:"100%",minHeight:"260px"}}>
      <defs>
        {[["aE1","#f0a010"],["aE2","#10c8d0"],["aBU","#3090f0"],["aOK","#20e060"],["aFU","#c08020"],["aCO","#20b0b8"],["aEX","#805030"]].map(([id,c])=>(
          <marker key={id}id={id}markerWidth="6"markerHeight="5"refX="6"refY="2.5"orient="auto"><polygon points="0 0,6 2.5,0 5"fill={c}/></marker>
        ))}
        <filter id="gE1"><feGaussianBlur stdDeviation="2"result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <filter id="gE2"><feGaussianBlur stdDeviation="2"result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>

      {/* ── OUTER ENCLOSURE ── */}
      <rect x="8"y="8"width="884"height="424"fill="none"stroke="#1a3050"strokeWidth="2"strokeDasharray="8,4"rx="4"/>
      <text x="14"y="24"fill="#4a74a2"fontSize="12"fontFamily="'JetBrains Mono'"letterSpacing="3">DUALCORE 900 — INTEGRATED ENCLOSURE BOUNDARY</text>

      {/* ── COMMON FUEL SYSTEM (top center) ── */}
      <rect x="350"y="20"width="200"height="60"fill="#0e1808"stroke="#c08020"strokeWidth="1.5"rx="2"/>
      <text x="450"y="44"textAnchor="middle"fill="#e0a040"fontSize="12"fontFamily="'JetBrains Mono'"fontWeight="700">COMMON FUEL SYSTEM</text>
      <text x="450"y="57"textAnchor="middle"fill="#b08820"fontSize="10"fontFamily="'JetBrains Mono'">Sub-base tank · Polisher · Single fill</text>
      <text x="450"y="68"textAnchor="middle"fill="#b08820"fontSize="10"fontFamily="'JetBrains Mono'">Day tank heater · Single level sensor</text>

      {/* Fuel to E1 */}
      <path className="ffu"d="M390 80 L390 135 L220 135"markerEnd="url(#aFU)"/>
      {/* Fuel to E2 */}
      <path className="ffu"d="M510 80 L510 135 L680 135"markerEnd="url(#aFU)"/>

      {/* ── COMMON COOLING (top right of center) ── */}
      <rect x="580"y="20"width="150"height="60"fill="#081818"stroke="#20b0b8"strokeWidth="1.5"rx="2"/>
      <text x="655"y="42"textAnchor="middle"fill="#40c8d0"fontSize="12"fontFamily="'JetBrains Mono'"fontWeight="700">COMMON COOLING</text>
      <text x="655"y="54"textAnchor="middle"fill="#2ab0b8"fontSize="10"fontFamily="'JetBrains Mono'">Dual-core radiator bank</text>
      <text x="655"y="65"textAnchor="middle"fill="#2ab0b8"fontSize="10"fontFamily="'JetBrains Mono'">Variable-speed elec. fans</text>

      {/* Coolant loops */}
      <path className="fco"d="M620 80 L620 100 L280 100 L280 155"markerEnd="url(#aCO)"/>
      <path className="fco"d="M690 80 L690 105 L720 105 L720 155"markerEnd="url(#aCO)"/>

      {/* ── ENGINE 1 ── */}
      <rect x="80"y="120"width="280"height="160"fill={`#0e1a08`}stroke={`#f0a010`}strokeWidth="2"rx="2"filter="url(#gE1)"/>
      <text x="220"y="148"textAnchor="middle"fill="#f0a010"fontSize="13"fontFamily="'JetBrains Mono'"fontWeight="700"letterSpacing="1">ENGINE 1 — QSX15-G9</text>
      <text x="220"y="162"textAnchor="middle"fill="#b08820"fontSize="10"fontFamily="'JetBrains Mono'">450kW / 563kVA · 1800RPM</text>
      <text x="220"y="175"textAnchor="middle"fill="#b08820"fontSize="10"fontFamily="'JetBrains Mono'">Bore 136.9mm · CR 17.0:1</text>
      {/* E1 alternator */}
      <ellipse cx="220"cy="220"rx="55"ry="30"fill="#0a1808"stroke="#f0a010"strokeWidth="1.5"/>
      <text x="220"y="216"textAnchor="middle"fill="#f0a010"fontSize="11"fontFamily="'JetBrains Mono'"fontWeight="700">ALT 1</text>
      <text x="220"y="228"textAnchor="middle"fill="#b08820"fontSize="9"fontFamily="'JetBrains Mono'">PMG · Class H</text>
      {/* E1 CB */}
      <rect x="168"y="265"width="104"height="28"fill="#1a0e00"stroke="#f0a010"strokeWidth="1.5"rx="1"/>
      <text x="220"y="277"textAnchor="middle"fill="#f0a010"fontSize="11"fontFamily="'JetBrains Mono'"fontWeight="700">CB1 — 1200A</text>
      <text x="220"y="288"textAnchor="middle"fill="#20e060"fontSize="10"fontFamily="'JetBrains Mono'">FACTORY WIRED</text>
      {/* CB1 to bus */}
      <path className="fe1"d="M220 293 L220 330 L430 330"markerEnd="url(#aE1)"/>

      {/* ── ENGINE 2 ── */}
      <rect x="540"y="120"width="280"height="160"fill="#081a18"stroke="#10c8d0"strokeWidth="2"rx="2"filter="url(#gE2)"opacity={e2?1:.3}/>
      <text x="680"y="148"textAnchor="middle"fill={e2?"#10c8d0":"#1a4040"}fontSize="13"fontFamily="'JetBrains Mono'"fontWeight="700"letterSpacing="1">ENGINE 2 — QSX15-G9</text>
      <text x="680"y="162"textAnchor="middle"fill={e2?"#2ab0b8":"#0a2828"}fontSize="10"fontFamily="'JetBrains Mono'">450kW / 563kVA · 1800RPM</text>
      <text x="680"y="175"textAnchor="middle"fill={e2?"#2ab0b8":"#0a2828"}fontSize="10"fontFamily="'JetBrains Mono'">Bore 136.9mm · CR 17.0:1</text>
      <ellipse cx="680"cy="220"rx="55"ry="30"fill="#081818"stroke={e2?"#10c8d0":"#1a4040"}strokeWidth="1.5"/>
      <text x="680"y="216"textAnchor="middle"fill={e2?"#10c8d0":"#1a4040"}fontSize="8"fontFamily="'JetBrains Mono'"fontWeight="700">ALT 2</text>
      <text x="680"y="228"textAnchor="middle"fill={e2?"#107880":"#0a2828"}fontSize="7"fontFamily="'JetBrains Mono'">PMG · Class H · N FLOAT</text>
      <rect x="628"y="265"width="104"height="28"fill={e2?"#001a1a":"#0a0a0a"}stroke={e2?"#10c8d0":"#1a4040"}strokeWidth="1.5"rx="1"/>
      <text x="680"y="277"textAnchor="middle"fill={e2?"#10c8d0":"#1a4040"}fontSize="8"fontFamily="'JetBrains Mono'"fontWeight="700">CB2 — 1200A</text>
      <text x="680"y="288"textAnchor="middle"fill={e2?"#20e060":"#882020"}fontSize="7"fontFamily="'JetBrains Mono'">{e2?"FACTORY WIRED":"N/A"}</text>
      {e2&&<path className="fe2"d="M680 293 L680 330 L570 330"markerEnd="url(#aE2)"/>}

      {/* ── INTEGRATED PARALLELING SWITCHGEAR ── */}
      <rect x="350"y="310"width="200"height="120"fill="#080a20"stroke="#3090f0"strokeWidth="2"rx="2"/>
      <text x="450"y="328"textAnchor="middle"fill="#3090f0"fontSize="9"fontFamily="'JetBrains Mono'"fontWeight="700"letterSpacing="1">INT. PARALLEL SWITCHGEAR</text>
      {/* Bus bar */}
      <rect x="362"y="334"width="176"height="14"fill="#0a1828"stroke="#3090f0"strokeWidth="1.5"/>
      <text x="450"y="344"textAnchor="middle"fill="#3090f0"fontSize="7"fontFamily="'JetBrains Mono'">480V COMMON BUS · 2000A</text>
      {/* ANSI relays */}
      {["25","32","51","27","86"].map((n,i)=>(
        <g key={n}>
          <circle cx={368+i*38}cy={368}r="10"fill="#080818"stroke="#3090f0"strokeWidth="1"/>
          <text x={368+i*38}y={371}textAnchor="middle"fill="#3090f0"fontSize="10"fontFamily="'JetBrains Mono'"fontWeight="700">{n}</text>
        </g>
      ))}
      <text x="450"y="390"textAnchor="middle"fill="#80aacc"fontSize="10"fontFamily="'JetBrains Mono'">FACTORY WIRED · FACTORY TESTED · FACTORY COORDINATED</text>
      {/* Neutral management */}
      <rect x="362"y="396"width="176"height="22"fill="#100808"stroke="#f02828"strokeWidth="1"strokeDasharray="2,2"rx="1"/>
      <text x="450"y="407"textAnchor="middle"fill="#f02828"fontSize="10"fontFamily="'JetBrains Mono'"fontWeight="700">E1 N BONDED · E2 N ISOLATED RELAY</text>
      <text x="450"y="418"textAnchor="middle"fill="#ad4a4a"fontSize="9"fontFamily="'JetBrains Mono'">PERMANENT · CANNOT BE WRONG IN FIELD</text>

      {/* ── EXHAUST COLLECTOR ── */}
      <rect x="80"y="20"width="130"height="55"fill="#100a00"stroke="#805030"strokeWidth="1.5"rx="2"/>
      <text x="145"y="40"textAnchor="middle"fill="#805030"fontSize="8"fontFamily="'JetBrains Mono'"fontWeight="700">EXHAUST</text>
      <text x="145"y="52"textAnchor="middle"fill="#604020"fontSize="7"fontFamily="'JetBrains Mono'">Ind. turbos → Y-collect</text>
      <text x="145"y="63"textAnchor="middle"fill="#604020"fontSize="7"fontFamily="'JetBrains Mono'">→ Critical silencer</text>
      <path className="fex"d="M140 120 L140 75"markerEnd="url(#aEX)"/>
      {e2&&<path className="fex"d="M280 120 L280 90 L175 75"markerEnd="url(#aEX)"/>}

      {/* ── OUTPUT ── */}
      <rect x="730"y="330"width="140"height="80"fill="#081808"stroke="#20e060"strokeWidth="1.5"rx="2"/>
      <text x="800"y="352"textAnchor="middle"fill="#20e060"fontSize="12"fontFamily="'JetBrains Mono'"fontWeight="700">OUTPUT</text>
      <text x="800"y="366"textAnchor="middle"fill="#40c060"fontSize="11"fontFamily="'JetBrains Mono'">{both?"900kW":"450kW"}</text>
      <text x="800"y="378"textAnchor="middle"fill="#40c060"fontSize="11"fontFamily="'JetBrains Mono'">480V 3φ 60Hz</text>
      <text x="800"y="390"textAnchor="middle"fill="#40c060"fontSize="11"fontFamily="'JetBrains Mono'">SINGLE CONNECTION POINT</text>
      <text x="800"y="402"textAnchor="middle"fill="#40c060"fontSize="10"fontFamily="'JetBrains Mono'">Camlocks · ATS port</text>
      <path className="fbu"d="M550 330 L550 370 L730 370"markerEnd="url(#aBU)"/>

      {/* ── HMI CONTROL ── */}
      <rect x="730"y="20"width="140"height="90"fill="#080818"stroke="#9040e0"strokeWidth="1.5"rx="2"/>
      <text x="800"y="40"textAnchor="middle"fill="#9040e0"fontSize="8"fontFamily="'JetBrains Mono'"fontWeight="700">UNIFIED HMI</text>
      <text x="800"y="53"textAnchor="middle"fill="#602090"fontSize="7"fontFamily="'JetBrains Mono'">Master controller</text>
      <text x="800"y="64"textAnchor="middle"fill="#602090"fontSize="7"fontFamily="'JetBrains Mono'">PCC3300 × 2 slaves</text>
      <text x="800"y="75"textAnchor="middle"fill="#602090"fontSize="7"fontFamily="'JetBrains Mono'">Touchscreen 10"</text>
      <text x="800"y="86"textAnchor="middle"fill="#602090"fontSize="7"fontFamily="'JetBrains Mono'">Single operator view</text>
      <text x="800"y="97"textAnchor="middle"fill="#602090"fontSize="7"fontFamily="'JetBrains Mono'">IoT · predictive maint.</text>
      <path className="fct"d="M730 65 L720 65 L720 360 L730 370"strokeDasharray="4,4"/>

      {/* Legend */}
      {[["#f0a010","ENGINE 1"],["#10c8d0","ENGINE 2"],["#3090f0","BUS POWER"],["#c08020","FUEL"],["#20b0b8","COOLANT"],["#805030","EXHAUST"],["#c8c010","CONTROL"]].map(([c,l],i)=>(
        <g key={i}><line x1={10+i*120}y1={430}x2={36+i*120}y2={430}stroke={c}strokeWidth="2"strokeDasharray="7,3"/>
        <text x={40+i*120}y={433}fill="#3a6080"fontSize="8"fontFamily="'JetBrains Mono'">{l}</text></g>
      ))}
    </svg>
  );
}

/* ── INTEGRATED SLD ── */
function IntSLD({mode}){
  const[off,setOff]=useState(0);
  useEffect(()=>{const iv=setInterval(()=>setOff(o=>(o+1)%20),50);return()=>clearInterval(iv);},[]);
  const both=mode==="dual",e2=mode!=="e1only";
  return(
    <svg width="100%"viewBox="0 0 860 320"style={{maxWidth:"100%",minHeight:"190px"}}>
      <defs>
        {[["aE1","#f0a010"],["aE2","#10c8d0"],["aBU","#3090f0"],["aOK","#20e060"]].map(([id,c])=>(
          <marker key={id}id={id}markerWidth="6"markerHeight="5"refX="6"refY="2.5"orient="auto"><polygon points="0 0,6 2.5,0 5"fill={c}/></marker>
        ))}
      </defs>
      {/* Enclosure box */}
      <rect x="2"y="2"width="680"height="316"fill="none"stroke="#1a3050"strokeWidth="1"strokeDasharray="6,3"rx="3"/>
      <text x="8"y="18"fill="#4a74a2"fontSize="10"fontFamily="'JetBrains Mono'"letterSpacing="2">DUALCORE 900 — INTERNAL BOUNDARY</text>

      {/* E1 generator symbol */}
      <circle cx="90"cy="100"r="48"fill="#0e1a08"stroke="#f0a010"strokeWidth="2"/>
      <text x="90"y="93"textAnchor="middle"fill="#f0a010"fontSize="13"fontFamily="'JetBrains Mono'"fontWeight="700">E1</text>
      <text x="90"y="106"textAnchor="middle"fill="#b08820"fontSize="11"fontFamily="'JetBrains Mono'">450kW</text>
      <text x="90"y="118"textAnchor="middle"fill="#b08820"fontSize="10"fontFamily="'JetBrains Mono'">N BONDED</text>

      {/* CB1 — internal, factory */}
      <rect x="62"y="164"width="56"height="30"fill="#1a0e00"stroke="#f0a010"strokeWidth="1.5"rx="1"/>
      <text x="90"y="176"textAnchor="middle"fill="#f0a010"fontSize="8"fontFamily="'JetBrains Mono'"fontWeight="700">CB1</text>
      <text x="90"y="187"textAnchor="middle"fill="#20e060"fontSize="6"fontFamily="'JetBrains Mono'">INTERNAL</text>
      <line x1="90"y1="148"x2="90"y2="164"stroke="#f0a010"strokeWidth="3"strokeDasharray="7,4"strokeDashoffset={-off}/>
      <line x1="90"y1="194"x2="90"y2="235"stroke="#f0a010"strokeWidth="3"strokeDasharray="7,4"strokeDashoffset={-off}/>
      <line x1="90"y1="235"x2="310"y2="235"stroke="#f0a010"strokeWidth="3"strokeDasharray="7,4"strokeDashoffset={-off}markerEnd="url(#aE1)"/>

      {/* ANSI relays E1 */}
      {[["32",64,162],["25",116,162]].map(([n,x,y])=>(
        <g key={n}><circle cx={x}cy={y}r="7"fill="#0a0808"stroke="#f0a010"strokeWidth="1"/>
        <text x={x}y={y+3}textAnchor="middle"fill="#f0a010"fontSize="6"fontFamily="'JetBrains Mono'"fontWeight="700">{n}</text></g>
      ))}

      {/* E2 generator symbol */}
      <circle cx="590"cy="100"r="48"fill="#081a18"stroke={e2?"#10c8d0":"#1a3030"}strokeWidth="2"opacity={e2?1:.3}/>
      <text x="590"y="93"textAnchor="middle"fill={e2?"#10c8d0":"#1a3030"}fontSize="9"fontFamily="'JetBrains Mono'"fontWeight="700">E2</text>
      <text x="590"y="106"textAnchor="middle"fill={e2?"#107880":"#0a2828"}fontSize="8"fontFamily="'JetBrains Mono'">450kW</text>
      <text x="590"y="118"textAnchor="middle"fill={e2?"#107880":"#0a2828"}fontSize="7"fontFamily="'JetBrains Mono'">N ISOLATED</text>

      {/* CB2 — internal */}
      <rect x="562"y="164"width="56"height="30"fill={e2?"#001a1a":"#0a0a0a"}stroke={e2?"#10c8d0":"#1a3030"}strokeWidth="1.5"rx="1"opacity={e2?1:.4}/>
      <text x="590"y="176"textAnchor="middle"fill={e2?"#10c8d0":"#1a3030"}fontSize="8"fontFamily="'JetBrains Mono'"fontWeight="700">CB2</text>
      <text x="590"y="187"textAnchor="middle"fill={e2?"#20e060":"#882020"}fontSize="6"fontFamily="'JetBrains Mono'">{e2?"INTERNAL":""}</text>
      {e2&&<><line x1="590"y1="148"x2="590"y2="164"stroke="#10c8d0"strokeWidth="3"strokeDasharray="7,4"strokeDashoffset={-off}/>
      <line x1="590"y1="194"x2="590"y2="235"stroke="#10c8d0"strokeWidth="3"strokeDasharray="7,4"strokeDashoffset={-off}/>
      <line x1="590"y1="235"x2="372"y2="235"stroke="#10c8d0"strokeWidth="3"strokeDasharray="7,4"strokeDashoffset={-off}markerEnd="url(#aE2)"/></>}
      {e2&&[["32",562,162],["25",618,162]].map(([n,x,y])=>(
        <g key={n}><circle cx={x}cy={y}r="7"fill="#080a0a"stroke="#10c8d0"strokeWidth="1"/>
        <text x={x}y={y+3}textAnchor="middle"fill="#10c8d0"fontSize="6"fontFamily="'JetBrains Mono'"fontWeight="700">{n}</text></g>
      ))}

      {/* INTERNAL BUS */}
      <rect x="310"y="220"width="62"height="30"fill="#0a1828"stroke="#3090f0"strokeWidth="2"/>
      <text x="341"y="233"textAnchor="middle"fill="#3090f0"fontSize="7"fontFamily="'JetBrains Mono'"fontWeight="700">INT BUS</text>
      <text x="341"y="244"textAnchor="middle"fill="#1a3870"fontSize="6"fontFamily="'JetBrains Mono'">480V 2kA</text>

      {/* AUTO-SYNC module inside */}
      <rect x="290"y="170"width="100"height="36"fill="#080820"stroke="#9040e0"strokeWidth="1.5"rx="2"/>
      <text x="340"y="184"textAnchor="middle"fill="#9040e0"fontSize="7"fontFamily="'JetBrains Mono'"fontWeight="700">DIGITAL AUTO-SYNC</text>
      <text x="340"y="196"textAnchor="middle"fill="#602090"fontSize="6"fontFamily="'JetBrains Mono'">Factory calibrated · No trim</text>
      <text x="340"y="206"textAnchor="middle"fill="#602090"fontSize="6"fontFamily="'JetBrains Mono'">No phase reversal possible</text>

      {/* Bus to output load breaker — outside enclosure */}
      <line x1="372"y1="235"x2="700"y2="235"stroke="#3090f0"strokeWidth="3"strokeDasharray="9,4"strokeDashoffset={-off}markerEnd="url(#aBU)"/>

      {/* OUTPUT BREAKER — external */}
      <rect x="700"y="218"width="64"height="34"fill="#0a1a0a"stroke="#20e060"strokeWidth="1.5"rx="1"/>
      <text x="732"y="232"textAnchor="middle"fill="#20e060"fontSize="8"fontFamily="'JetBrains Mono'"fontWeight="700">CB-OUT</text>
      <text x="732"y="244"textAnchor="middle"fill="#20e060"fontSize="7"fontFamily="'JetBrains Mono'">1600A ATS</text>

      {/* OUTPUT LOADS */}
      <rect x="764"y="200"width="88"height="70"fill="#081808"stroke="#20e060"strokeWidth="1.5"rx="2"/>
      <text x="808"y="222"textAnchor="middle"fill="#20e060"fontSize="9"fontFamily="'JetBrains Mono'"fontWeight="700">LOAD</text>
      <text x="808"y="236"textAnchor="middle"fill="#18a040"fontSize="8"fontFamily="'JetBrains Mono'">{both?"0–900kW":"0–450kW"}</text>
      <text x="808"y="250"textAnchor="middle"fill="#18a040"fontSize="8"fontFamily="'JetBrains Mono'">{both?"0–1125kVA":"0–563kVA"}</text>
      <text x="808"y="263"textAnchor="middle"fill="#18a040"fontSize="7"fontFamily="'JetBrains Mono'">Single plug point</text>
      <line x1="764"y1="235"x2="764"y2="235"stroke="#20e060"strokeWidth="3"strokeDasharray="7,4"strokeDashoffset={-off}markerEnd="url(#aOK)"/>

      {/* Neutral management */}
      <rect x="290"y="268"width="100"height="38"fill="#0e0808"stroke="#f02828"strokeWidth="1"strokeDasharray="2,2"rx="1"/>
      <text x="340"y="282"textAnchor="middle"fill="#f02828"fontSize="11"fontFamily="'JetBrains Mono'"fontWeight="700">N-G MANAGEMENT</text>
      <text x="340"y="293"textAnchor="middle"fill="#ad4a4a"fontSize="9"fontFamily="'JetBrains Mono'">E1: bonded. E2: isolated relay.</text>
      <text x="340"y="303"textAnchor="middle"fill="#ad4a4a"fontSize="9"fontFamily="'JetBrains Mono'">Single field ground point only.</text>

      {/* Legend */}
      {[["#f0a010","E1 POWER"],["#10c8d0","E2 POWER"],["#3090f0","BUS"],["#20e060","OUTPUT"],["#9040e0","CONTROL"]].map(([c,l],i)=>(
        <g key={i}><line x1={10+i*160}y1={313}x2={34+i*160}y2={313}stroke={c}strokeWidth="2"strokeDasharray="7,3"/>
        <text x={38+i*160}y={316}fill="#3a6080"fontSize="8"fontFamily="'JetBrains Mono'">{l}</text></g>
      ))}
    </svg>
  );
}

/* ── LOAD STAGING ANIMATION ── */
function LoadStaging(){
  const[load,setLoad]=useState(200);
  const[time,setTime]=useState(0);
  const e1On=true;
  const e2On=load>328;
  const e1kw=e2On?load/2:Math.min(load,450);
  const e2kw=e2On?load/2:0;
  const e1pct=e1kw/450;
  const e2pct=e2kw/450;
  const stagingMsg=load<260?"E1 alone — efficient single-engine operation":
    load<328?"E1 approaching 73% prime — E2 staging to start":
    load<360?"E2 starting / synchronizing — auto-sync in progress":
    load<820?"PARALLEL — both engines sharing load equally":
    "⚠ APPROACHING PRIME LIMIT (820kW combined)";
  const msgColor=load<260?"var(--OK)":load<328?"var(--WN)":load<820?"var(--E2)":"var(--ER)";

  return(<div>
    <div className="sh">INTELLIGENT LOAD STAGING — DC-900</div>
    <div style={{display:"flex",gap:"16px",alignItems:"center",flexWrap:"wrap",marginBottom:"12px"}}>
      <div style={{fontFamily:"var(--MO)",fontSize:"8px",color:"var(--TM)"}}>TOTAL LOAD DEMAND:</div>
      <input type="range"min="50"max="900"value={load}onChange={e=>setLoad(+e.target.value)}style={{flex:1,minWidth:"150px"}}/>
      <div style={{fontFamily:"var(--DI)",fontSize:"20px",color:"var(--BUSb)",letterSpacing:"2px"}}>{load} kW</div>
    </div>
    <div style={{background:"var(--p0)",border:`1px solid ${msgColor}`,padding:"8px 14px",fontFamily:"var(--MO)",fontSize:"9px",color:msgColor,letterSpacing:"1px",marginBottom:"12px"}}>{stagingMsg}</div>
    {[{lbl:"ENGINE 1",kw:e1kw,pct:e1pct,c:"var(--E1)",on:true},{lbl:"ENGINE 2",kw:e2kw,pct:e2pct,c:"var(--E2)",on:e2On}].map(e=>(
      <div key={e.lbl} style={{marginBottom:"10px"}}>
        <div style={{display:"flex",justifyContent:"space-between",fontFamily:"var(--MO)",fontSize:"9px",marginBottom:"3px"}}>
          <span style={{color:e.c}}>{e.lbl} — {e.on?"RUNNING":"STANDBY"}</span>
          <span style={{color:e.c}}>{e.kw.toFixed(0)} kW ({(e.pct*100).toFixed(0)}% of 450kW)</span>
        </div>
        <div style={{height:"16px",background:"var(--ink)",border:`1px solid ${e.c}30`,overflow:"hidden"}}>
          <div style={{width:`${Math.min(100,e.pct*100)}%`,height:"100%",background:e.c,opacity:.75,transition:"width .4s"}}/>
        </div>
        <div style={{fontFamily:"var(--MO)",fontSize:"8px",color:e.pct>.9?"var(--ER)":e.pct>.7?"var(--WN)":"var(--TL)",marginTop:"2px"}}>
          {e.on?(e.pct>.9?"HIGH":e.pct>.7?"LOADED":e.pct>.4?"NORMAL":"LIGHT"):"OFFLINE"}
        </div>
      </div>
    ))}
    <table className="st" style={{marginTop:"8px"}}>
      <tbody>
        <tr><td>Combined fuel burn</td><td>{(30.1*(e1kw/450)+30.1*(e2kw/450)).toFixed(1)} GPH</td></tr>
        <tr><td>Single 900kW at same load (est.)</td><td>{(30.1*(load/900)*1.12).toFixed(1)} GPH (est. +12%)</td></tr>
        <tr><td>Fuel saved vs single 900kW</td><td style={{color:"var(--OK)"}}>{Math.max(0,(30.1*(load/900)*1.12)-(30.1*(e1kw/450)+30.1*(e2kw/450))).toFixed(1)} GPH</td></tr>
      </tbody>
    </table>
  </div>);
}

const TABS=["Design Philosophy","Architecture","Integrated SLD","Shared Systems","Control & Intelligence","Efficiency Analysis","Build Specifications"];

export default function App(){
  const[tab,setTab]=useState(0);
  const[archMode,setArchMode]=useState("dual");
  const[sldMode,setSldMode]=useState("dual");
  const[time,setTime]=useState("");
  const[g,setG]=useState({e1rpm:1800,e1hz:60,e1v:480,e1kw:320,e1oil:58,e1temp:88,e2rpm:1800,e2hz:60,e2v:480,e2kw:320,e2oil:56,e2temp:87,bus:480,total:640,eff:94});
  useEffect(()=>{
    const iv=setInterval(()=>{
      setG(x=>({...x,
        e1rpm:1800+(Math.random()-.5)*4,e1hz:60+(Math.random()-.5)*.06,e1v:480+(Math.random()-.5)*1.5,e1kw:320+(Math.random()-.5)*3,e1oil:58+(Math.random()-.5)*1.5,e1temp:87+(Math.random()-.5),
        e2rpm:1800+(Math.random()-.5)*4,e2hz:60+(Math.random()-.5)*.06,e2v:480+(Math.random()-.5)*1.5,e2kw:320+(Math.random()-.5)*3,e2oil:56+(Math.random()-.5)*1.5,e2temp:86+(Math.random()-.5),
        total:640+(Math.random()-.5)*5,
      }));
      setTime(new Date().toLocaleTimeString());
    },700);
    return()=>clearInterval(iv);
  },[]);

  return(
    <div className="app">
      <style>{CSS}</style>

      {/* MASTHEAD */}
      <div className="mast">
        <div className="mast-inner">
          <div className="brand">
            <div>
              <div className="brand-mark">ENGINEERING DESIGN</div>
              <div className="brand-name">DUALCORE 900</div>
              <div className="brand-sub">DC-900 SERIES · INTEGRATED DUAL-ENGINE GENERATOR · PATENT PENDING</div>
            </div>
          </div>
          <div className="spec-strip">
            {[["900kW","STANDBY"],["820kW","PRIME"],["1125kVA","APPARENT"],["480V","3φ 60Hz"],["2×QSX15","ENGINE"]].map(([v,k])=>(
              <div className="spec-chip" key={k}><div className="spec-chip-v">{v}</div><div className="spec-chip-k">{k}</div></div>
            ))}
          </div>
          <div className="sys-dots">
            {[{c:"var(--E1)",l:"E1",v:g.e1hz.toFixed(2)+"Hz",on:true},{c:"var(--E2)",l:"E2",v:g.e2hz.toFixed(2)+"Hz",on:true},{c:"var(--BUS)",l:"BUS",v:"480V",on:true},{c:"var(--OK)",l:"LOAD",v:g.total.toFixed(0)+"kW",on:true}].map(s=>(
              <div className="dot-item" key={s.l}>
                <div className="dot on" style={{background:s.c,boxShadow:`0 0 8px ${s.c}`}}/>
                <div className="dot-lbl" style={{color:s.c}}>{s.l}</div>
                <div className="dot-val" style={{color:s.c}}>{s.v}</div>
              </div>
            ))}
            <div style={{fontFamily:"var(--MO)",fontSize:"9px",color:"var(--TM)",marginLeft:8}}>{time}</div>
          </div>
        </div>
      </div>

      <div className="tabs">
        {TABS.map((t,i)=><button key={i}className={`tab${tab===i?" ac":""}`}onClick={()=>setTab(i)}>{t}</button>)}
      </div>

      {/* ── TAB 0: DESIGN PHILOSOPHY ── */}
      {tab===0&&(
        <div className="body">
          {/* Live monitoring strip */}
          <div className="panel e1t" data-lbl="Live System Monitoring">
            <div className="pi">
              <div className="grow">
                <G value={g.e1rpm} min={0} max={2400} label="E1 RPM" unit="RPM" color="#f0a010" dec={0}/>
                <G value={g.e1hz}  min={55} max={65}  label="E1 FREQ" unit="Hz" color="#f0a010" dec={1}/>
                <G value={g.e1kw}  min={0} max={500}  label="E1 OUTPUT" unit="kW" color="#f0a010" dec={0} warn={450} danger={460}/>
                <G value={g.e1temp}min={40} max={120} label="E1 COOLANT" unit="°C" color="#f0a010" dec={0} warn={100} danger={104}/>
                <G value={g.e2rpm} min={0} max={2400} label="E2 RPM" unit="RPM" color="#10c8d0" dec={0}/>
                <G value={g.e2hz}  min={55} max={65}  label="E2 FREQ" unit="Hz" color="#10c8d0" dec={1}/>
                <G value={g.e2kw}  min={0} max={500}  label="E2 OUTPUT" unit="kW" color="#10c8d0" dec={0} warn={450} danger={460}/>
                <G value={g.e2temp}min={40} max={120} label="E2 COOLANT" unit="°C" color="#10c8d0" dec={0} warn={100} danger={104}/>
                <G value={g.total} min={0} max={950}  label="TOTAL BUS" unit="kW" color="#3090f0" dec={0}/>
              </div>
            </div>
          </div>

          <div className="row">
            {/* Con/Solution comparison */}
            <div className="panel but" data-lbl="Parallel System Cons → DC-900 Solutions" style={{flex:2,minWidth:"360px"}}>
              <div className="pi">
                <div className="cmp-grid">
                  <div className="cmp-cell hdr e1h">PARALLEL CON</div>
                  <div className="cmp-cell hdr erc" style={{color:"var(--ER2)"}}>WHY IT FAILS</div>
                  <div className="cmp-cell hdr dch">DC-900 SOLUTION</div>
                  {[
                    ["Phase sequence reversal","Annual field wiring error — destroys alternators","Factory internal bus — physically impossible to reverse"],
                    ["Manual synchronization","Operator skill-dependent — out-of-phase closure = violent event","Digital auto-sync, factory calibrated — no synchronoscope, no trim"],
                    ["Dual neutral bonding","NEC violation — ground loops, GFCI trips, equipment damage","E1 bonded, E2 isolated relay — permanent, cannot be wired wrong"],
                    ["Two fuel systems","Two fill points, two day tanks, two polishers, dual contamination risk","Single sub-base tank, single fill, shared polisher, one level sensor"],
                    ["Two cooling systems","Two thermostat settings drift, two fill points, two different fluid ages","Common coolant manifold, dual-core shared radiator, single fill"],
                    ["Two separate exhausts","Two mufflers, two flex sections, twice the pressure drop engineering","Individual turbos → Y-collector → single critical silencer"],
                    ["Two control panels","Operator confusion, mismatched settings, separate fault logs","Single unified HMI — one touchscreen, one view, one fault log"],
                    ["No factory protection coordination","Arc flash study done in field — often skipped — settings drift","Factory ANSI 25/32/50/51/27/59/86 pre-set, tested, labeled"],
                    ["Droop mismatch","Governors drift, technician adjustments don't match — one machine carries all","Factory-matched governor pairs, equal droop, factory load-share verification test"],
                    ["Two maintenance programs","Double parts inventory, twice the service calls, staggered intervals","Common oil kit, equal wear pairs, single service interval, predictive sensors"],
                    ["PCC3300 parallel card missing","Frequently missing on rental fleet — auto-sync doesn't function","Integrated — built into design, not an option, cannot be omitted"],
                    ["Two separate footprints","Requires significant job-site real estate for two separate units","Single skid — approximately 40% smaller combined footprint"],
                  ].map(([con,fail,sol],i)=>(
                    <><div key={`c${i}`}className="cmp-cell"><div className="cmp-k">CON {i+1}</div><div className="cmp-v bad">{con}</div></div>
                    <div key={`f${i}`}className="cmp-cell"><div className="cmp-k">FIELD REALITY</div><div className="cmp-v neutral" style={{fontSize:"12px",lineHeight:"1.4"}}>{fail}</div></div>
                    <div key={`s${i}`}className="cmp-cell"><div className="cmp-k">DC-900 APPROACH</div><div className="cmp-v great" style={{fontSize:"12px",lineHeight:"1.4"}}>{sol}</div></div></>
                  ))}
                </div>
              </div>
            </div>

            <div className="col" style={{flex:1,minWidth:"240px"}}>
              <div className="panel highlight" data-lbl="Design Goals">
                <div className="pi">
                  <div className="sh">ENGINEERING OBJECTIVES</div>
                  {[
                    {g:"Factory certainty",d:"Every wiring connection, every relay setting, every droop calibration done and tested before the unit leaves the factory. Zero field configuration required for paralleling."},
                    {g:"Field simplicity",d:"Operator interaction: POWER ON. That's it. The system handles synchronization, load sharing, staging, and protection automatically. No trained sync operator required."},
                    {g:"Zero single-point failure",d:"Every critical system has a redundant path: two engines, two alternators, two sets of relays. Failure of either engine: surviving engine carries up to 450kW with zero interruption."},
                    {g:"Efficiency at real-world loads",d:"Real sites rarely run at 100% load. DC-900 staging algorithm keeps the running engine between 60–80% prime at all times — the most fuel-efficient, lowest-wear operating range."},
                    {g:"Predictive maintenance",d:"Vibration sensors, oil quality sensor, coolant pH sensor, exhaust temp trending. IoT data to cloud. Alert 200 hours before a failure, not after."},
                    {g:"Single service event",d:"Equal-wear matched engine pairs. Both engines have equal run hours. Both share one oil drain, one coolant fill, one filter kit. One service call services both."},
                  ].map((g,i)=>(
                    <div key={i} style={{padding:"8px 0",borderBottom:"1px solid var(--line)"}}>
                      <div style={{fontFamily:"var(--MO)",fontSize:"10px",fontWeight:"700",color:"var(--E1b)",marginBottom:"4px"}}>{g.g}</div>
                      <div style={{fontSize:"13px",lineHeight:"1.5",color:"var(--TX)"}}>{g.d}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 1: ARCHITECTURE ── */}
      {tab===1&&(
        <div className="body">
          <div style={{display:"flex",gap:"8px",flexWrap:"wrap"}}>
            {[["e1only","E1 Only (Base Load)"],["dual","Both Engines (Full Power)"],["e1maint","E1 Maintenance Mode"]].map(([v,l])=>(
              <button key={v}className={`tog${archMode===v?" on":""}`}onClick={()=>setArchMode(v)}>{l}</button>
            ))}
          </div>
          <div className="panel but" data-lbl="DC-900 Physical Architecture — Integrated Enclosure View">
            <div className="pi"><ArchDiagram mode={archMode}/></div>
          </div>
          <div className="row">
            <div className="panel e1t" data-lbl="Physical Layout — Skid Design" style={{flex:1,minWidth:"250px"}}>
              <div className="pi">
                <div className="co inf">Engines are mounted BACK-TO-BACK on a common ISO-standard skid. Alternator shaft ends face inward toward the central switchgear bay. Cooling and fuel systems run along the top spine. Service access panels on all four sides.</div>
                <table className="st" style={{marginTop:"10px"}}>
                  <tbody>
                    <tr className="hr"><td colSpan="2">PHYSICAL SPECIFICATIONS</td></tr>
                    <tr><td>Overall length (estimate)</td><td>~380" / 9,652mm</td></tr>
                    <tr><td>Width</td><td>~96" / 2,438mm</td></tr>
                    <tr><td>Height w/enclosure</td><td>~102" / 2,591mm</td></tr>
                    <tr><td>Base skid</td><td>ISO 1AA or 1C container frame option</td></tr>
                    <tr><td>Weight (wet, estimated)</td><td>~24,000–28,000 lbs</td></tr>
                    <tr><td>Vibration isolation</td><td>Anti-vibration mounts, each engine independent</td></tr>
                    <tr><td>Engine layout</td><td>Back-to-back, alternator ends facing center</td></tr>
                    <tr><td>Enclosure rating</td><td>IP56 minimum, sound-attenuated, weatherproof</td></tr>
                    <tr><td>Sound attenuation</td><td>25–30 dB(A) reduction → ~72–75 dBA @ 7m</td></tr>
                    <tr><td>Access panels</td><td>4-side swing-out, oil drain through floor frame</td></tr>
                    <tr><td>Transport</td><td>4× lifting eyes, fork pockets, tie-down rated</td></tr>
                    <tr className="hr"><td colSpan="2">FIELD CONNECTIONS (SINGLE POINTS)</td></tr>
                    <tr className="okc"><td>Fuel inlet</td><td>1× 2" NPT external fill</td></tr>
                    <tr className="okc"><td>Electrical output</td><td>1× output bus (camlocks or bus stubs)</td></tr>
                    <tr className="okc"><td>Shore power (utilities)</td><td>1× 240V 30A inlet (heaters, charger)</td></tr>
                    <tr className="okc"><td>Exhaust outlet</td><td>1× 6" OD silencer outlet</td></tr>
                    <tr className="okc"><td>Comms / IoT</td><td>1× RJ45 / cellular modem option</td></tr>
                    <tr className="okc"><td>Coolant fill</td><td>1× external fill port, overflow</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="panel e2t" data-lbl="Internal Bay Layout" style={{flex:1,minWidth:"250px"}}>
              <div className="pi">
                <table className="st">
                  <tbody>
                    <tr className="hr"><td colSpan="2">INTERNAL ZONE BREAKDOWN</td></tr>
                    <tr><td>Zone A — Engine 1 bay</td><td>E: QSX15-G9 #1, turbo, exhaust flex</td></tr>
                    <tr><td>Zone B — Engine 2 bay</td><td>E: QSX15-G9 #2, turbo, exhaust flex</td></tr>
                    <tr><td>Zone C — Central switchgear</td><td>CB1, CB2, bus bars, ANSI relays, PCC3300 × 2</td></tr>
                    <tr><td>Zone D — Top spine</td><td>Common fuel system, coolant header, air intake plenum</td></tr>
                    <tr><td>Zone E — Cooling section</td><td>Dual-core radiator, 2× variable-speed fans</td></tr>
                    <tr><td>Zone F — Output bay</td><td>Output bus, camlocks, ATS port, HMI panel</td></tr>
                    <tr><td>Zone G — Exhaust collector</td><td>Y-collector, flex sections, critical silencer</td></tr>
                    <tr className="hr"><td colSpan="2">MAINTENANCE ACCESS</td></tr>
                    <tr><td>Engine oil drain</td><td>Common quick-connect floor drain — 1 connection</td></tr>
                    <tr><td>Air filters</td><td>Both accessible from same side panel</td></tr>
                    <tr><td>Fuel filters</td><td>Both accessible, top spine door</td></tr>
                    <tr><td>Battery access</td><td>Single door, two batteries side by side</td></tr>
                    <tr><td>Switchgear access</td><td>Full-height door, center bay</td></tr>
                    <tr><td>Annual service</td><td>Single service event covers both engines</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2: INTEGRATED SLD ── */}
      {tab===2&&(
        <div className="body">
          <div style={{display:"flex",gap:"8px",flexWrap:"wrap"}}>
            {[["e1only","E1 Only"],["dual","Both Engines Parallel"]].map(([v,l])=>(
              <button key={v}className={`tog${sldMode===v?" on":""}`}onClick={()=>setSldMode(v)}>{l}</button>
            ))}
          </div>
          <div className="panel but" data-lbl="DC-900 Single-Line Diagram — Integrated">
            <div className="pi"><IntSLD mode={sldMode}/></div>
          </div>
          <div className="row">
            <div className="panel e1t" data-lbl="How This Differs From Field Parallel" style={{flex:1}}>
              <div className="pi">
                <div className="sh">KEY DIFFERENCES vs FIELD-PARALLEL</div>
                {[
                  {d:"PHASE SEQUENCE",par:"Verified by field electrician. Errors happen. Consequences: destroyed alternators.",dc:"Internal bus hardwired A-B-C at factory. No field connection between the two machines. Phase reversal is physically impossible.",ok:true},
                  {d:"SYNCHRONIZATION",par:"Manual synchronoscope, operator trim pots, requires trained technician. Out-of-phase closure risk every time.",dc:"Factory-installed digital auto-synchronizer. No synchronoscope. No operator adjustment. Sync is automatic and verified before CB2 ever closes.",ok:true},
                  {d:"NEUTRAL BONDING",par:"E2 neutral must be floated in field. Often skipped or forgotten. Creates ground loops.",dc:"E1 bonded at factory. E2 neutral isolation relay factory-installed, wired, and tested. Cannot be incorrectly configured in field.",ok:true},
                  {d:"PROTECTION COORDINATION",par:"LSIG settings programmed in field. Arc flash study may not be current. CB trip curves not matched at factory.",dc:"All ANSI devices factory-set, tested, and labeled. Trip coordination study completed at factory. Arc flash labels applied at factory.",ok:true},
                  {d:"OUTPUT CONNECTION",par:"Two sets of camlocks on two separate units. Customer must build parallel bus.",dc:"Single set of output camlocks / bus stubs on one panel face. Customer connects one cable set.",ok:true},
                  {d:"OPERATOR INTERFACE",par:"Two separate PCC3300 panels, two E-stops, two key switches. Operator must manage both.",dc:"Single touchscreen HMI, single E-stop, single key switch. Both engines managed as one system.",ok:true},
                ].map((r,i)=>(
                  <div key={i} style={{padding:"8px 0",borderBottom:"1px solid var(--line)"}}>
                    <div style={{fontFamily:"var(--MO)",fontSize:"9px",fontWeight:"700",color:"var(--BUSb)",marginBottom:"5px",letterSpacing:"1px"}}>{r.d}</div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px"}}>
                      <div style={{background:"rgba(60,0,0,.2)",border:"1px solid var(--line)",padding:"6px 10px",fontSize:"12px",lineHeight:"1.4",color:"#c09090"}}>{r.par}</div>
                      <div style={{background:"rgba(0,40,0,.2)",border:"1px solid var(--OK2)",padding:"6px 10px",fontSize:"12px",lineHeight:"1.4",color:"#90c090"}}>{r.dc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 3: SHARED SYSTEMS ── */}
      {tab===3&&(
        <div className="body">
          <div className="row">
            {/* Fuel */}
            <div className="panel e1t" data-lbl="Shared Fuel System Design" style={{flex:1,minWidth:"260px"}}>
              <div className="pi">
                <div className="sh">INTEGRATED FUEL ARCHITECTURE</div>
                <div className="co inf">Two separate fuel systems on field-parallel units create double the contamination risk, double the filtration points, and require two separate fuel deliveries to be managed simultaneously. The DC-900 solves this with a single, engineered common fuel system.</div>
                <table className="st" style={{marginTop:"10px"}}>
                  <tbody>
                    <tr className="hr"><td colSpan="2">SUB-BASE TANK</td></tr>
                    <tr><td>Capacity</td><td>400 USG / 1,514L</td></tr>
                    <tr><td>Construction</td><td>Double-wall steel, 110% containment</td></tr>
                    <tr><td>Fill point</td><td>1× external 2" NPT — single fill</td></tr>
                    <tr><td>Level sensor</td><td>1× electronic — feeds HMI display</td></tr>
                    <tr><td>Runtime @ 100% (both engines)</td><td>~6.6 hrs (60.2 GPH combined)</td></tr>
                    <tr><td>Runtime @ 60% load</td><td>~11.1 hrs (~36 GPH combined)</td></tr>
                    <tr className="hr"><td colSpan="2">FUEL POLISHER (INTEGRATED)</td></tr>
                    <tr><td>Type</td><td>Continuous-circulation kidney loop</td></tr>
                    <tr><td>Filter rating</td><td>2 micron absolute</td></tr>
                    <tr><td>Flow rate</td><td>~5 GPH circulation</td></tr>
                    <tr><td>Water separator</td><td>Automatic drain to collection bowl</td></tr>
                    <tr><td>Benefit</td><td>Eliminates microbiological growth, removes water — extends injector life 40–60%</td></tr>
                    <tr className="hr"><td colSpan="2">ENGINE-SIDE FUEL DISTRIBUTION</td></tr>
                    <tr><td>Primary filters (×2)</td><td>Independent 10μ per engine — series isolated</td></tr>
                    <tr><td>Secondary filters (×2)</td><td>Engine-mounted, 2μ, per Cummins spec</td></tr>
                    <tr><td>Fuel manifold</td><td>Common supply header, independent branches</td></tr>
                    <tr><td>Return manifold</td><td>Common return header back to tank</td></tr>
                    <tr><td>Isolation valves</td><td>Each engine can be isolated for filter service</td></tr>
                    <tr><td>Tank heater</td><td>1× 120V immersion heater — cold climate</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
            {/* Cooling */}
            <div className="panel e2t" data-lbl="Shared Cooling System Design" style={{flex:1,minWidth:"260px"}}>
              <div className="pi">
                <div className="sh">INTEGRATED COOLING ARCHITECTURE</div>
                <div className="co inf">Two separate cooling systems on field-parallel units have independent thermostats that drift, independent coolant ages, and independent fill points. In 40 years I've seen temperature imbalances between parallel-running machines cause premature head gasket failures. The DC-900 uses a common coolant system with matched thermal management.</div>
                <table className="st" style={{marginTop:"10px"}}>
                  <tbody>
                    <tr className="hr"><td colSpan="2">RADIATOR BANK</td></tr>
                    <tr><td>Configuration</td><td>2× radiator cores, series-coupled frame</td></tr>
                    <tr><td>Combined coolant capacity</td><td>~115L / 30.4 gal (2× 57.9L QSX15)</td></tr>
                    <tr><td>Ambient design (std)</td><td>40°C / 104°F</td></tr>
                    <tr><td>Ambient design (opt)</td><td>50°C / 122°F (heavy duty cores)</td></tr>
                    <tr className="hr"><td colSpan="2">VARIABLE-SPEED FAN SYSTEM</td></tr>
                    <tr><td>Fan drive</td><td>Electric VFD (replaces belt-driven)</td></tr>
                    <tr><td>Speed range</td><td>20–100% based on coolant temp sensor</td></tr>
                    <tr><td>Fan power saved vs belt-driven</td><td>~8–15 kW at partial load</td></tr>
                    <tr><td>Control</td><td>Master HMI — PID coolant temp loop</td></tr>
                    <tr><td>Benefit</td><td>Quieter, more efficient, no belt replacement</td></tr>
                    <tr className="hr"><td colSpan="2">COOLANT MANIFOLD</td></tr>
                    <tr><td>Header material</td><td>Stainless steel</td></tr>
                    <tr><td>Isolation valves</td><td>Each engine isolatable for coolant service</td></tr>
                    <tr><td>Thermostat</td><td>2× independent (82°C ea) + common return</td></tr>
                    <tr><td>Coolant fill</td><td>1× external fill point (top of spine)</td></tr>
                    <tr><td>Coolant spec</td><td>50% EG / 50% DI water, Fleetguard DCA</td></tr>
                    <tr><td>Block heaters</td><td>2× 120V / 1500W on common utility circuit</td></tr>
                    <tr className="hr"><td colSpan="2">WASTE HEAT RECOVERY (OPTION)</td></tr>
                    <tr><td>Port type</td><td>Plate heat exchanger tee on return header</td></tr>
                    <tr><td>Available heat</td><td>~35.4 MJ/min / 33,000 BTU/min combined</td></tr>
                    <tr><td>Application</td><td>Site heating, process hot water — reduces net fuel cost</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
            {/* Exhaust */}
            <div className="panel wnt" data-lbl="Exhaust System Design" style={{flex:1,minWidth:"260px"}}>
              <div className="pi">
                <div className="sh">INTEGRATED EXHAUST ARCHITECTURE</div>
                <div className="co wn">Cannot combine exhaust BEFORE the turbochargers — backpressure would damage both turbos and cross-contaminate exhaust pulses. The DC-900 uses individual turbos and flex sections, then collects downstream into a single large-bore Y-collector and common silencer.</div>
                <table className="st" style={{marginTop:"10px"}}>
                  <tbody>
                    <tr className="hr"><td colSpan="2">PER-ENGINE (INDIVIDUAL)</td></tr>
                    <tr><td>Turbochargers</td><td>2× independent — cannot be shared</td></tr>
                    <tr><td>Exhaust manifold</td><td>2× individual per engine (4-2 or 6-1)</td></tr>
                    <tr><td>Flex section</td><td>2× SS bellows — thermal expansion</td></tr>
                    <tr><td>Per-engine back pressure max</td><td>10.2 kPa / 41 in H₂O (Cummins QSX15)</td></tr>
                    <tr><td>Per-engine temp @ standby</td><td>462.8°C / 865°F</td></tr>
                    <tr className="hr"><td colSpan="2">Y-COLLECTOR (COMBINED)</td></tr>
                    <tr><td>Y-collector material</td><td>304SS / 316SS — high temp rated</td></tr>
                    <tr><td>Collector pipe diameter</td><td>8" minimum — combine two 5" inlets</td></tr>
                    <tr><td>Check valves</td><td>2× one-way flow check (prevents cross-flow)</td></tr>
                    <tr><td>Check valve type</td><td>Gravity flapper or spring-assisted butterfly</td></tr>
                    <tr><td>Purpose</td><td>Allows one engine to run without blowback into other exhaust</td></tr>
                    <tr className="hr"><td colSpan="2">COMMON SILENCER</td></tr>
                    <tr><td>Type</td><td>Critical-grade industrial silencer</td></tr>
                    <tr><td>Insertion loss</td><td>25–30 dB(A)</td></tr>
                    <tr><td>Combined exhaust flow</td><td>~175 m³/min / 6,180 cfm (both at standby)</td></tr>
                    <tr><td>Outlet</td><td>1× 8–10" OD outlet stack</td></tr>
                    <tr><td>Rain cap</td><td>Gravity type</td></tr>
                    <tr><td>Condensate drain</td><td>1× at Y-collector low point</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 4: CONTROL ── */}
      {tab===4&&(
        <div className="body">
          <div className="row">
            <div className="panel put" data-lbl="Unified Control System Architecture" style={{flex:1,minWidth:"280px"}}>
              <div className="pi">
                <div className="sh">DC-900 CONTROL HIERARCHY</div>
                <div style={{display:"flex",flexDirection:"column",gap:"8px"}}>
                  {[
                    {lv:"L3 — MASTER CONTROLLER",c:"var(--PUb)",d:"Custom embedded controller: orchestrates start/stop staging, load demand decisions, fault management, IoT data aggregation. Communicates with both PCC3300s via CANbus. Single source of truth."},
                    {lv:"L2 — PCC3300 × 2 (ENGINE CONTROLLERS)",c:"var(--BUSb)",d:"Each engine has its own Cummins PCC3300 for engine-level protection and control. Both are factory-configured for parallel operation with paralleling card installed. Load share link pre-wired between them."},
                    {lv:"L1 — QSX15 ECM × 2 (ENGINE ECM)",c:"var(--E1b)",d:"Each QSX15 engine has its own ECM communicating via J1939 CAN to its PCC3300. Fuel injection, timing, protection — all engine-level."},
                    {lv:"L0 — SENSORS / ACTUATORS",c:"var(--OK)",d:"All sensors factory-wired: vibration (bearing), oil quality, coolant pH, fuel level, exhaust temp (both), battery voltage (×2), bus current (×3 CTs per phase). Fan VFDs. Neutral isolation relay. All home-run to master controller."},
                  ].map((l,i)=>(
                    <div key={i} style={{background:"var(--p0)",border:`1px solid var(--line)`,borderLeft:`3px solid ${l.c}`,padding:"10px 14px"}}>
                      <div style={{fontFamily:"var(--MO)",fontSize:"9px",color:l.c,fontWeight:"700",marginBottom:"5px"}}>{l.lv}</div>
                      <div style={{fontSize:"13px",lineHeight:"1.5"}}>{l.d}</div>
                    </div>
                  ))}
                </div>
                <div className="sh" style={{marginTop:"14px"}}>DIGITAL AUTO-SYNC MODULE</div>
                <table className="st">
                  <tbody>
                    <tr><td>Type</td><td>Digital integrated — not relay-based</td></tr>
                    <tr><td>Method</td><td>Master PCC3300 ramps E2 governor and AVR to match bus</td></tr>
                    <tr><td>Sync window</td><td>ΔV &lt; 2%, Δf &lt; 0.1 Hz, Δφ &lt; 5° — factory tight</td></tr>
                    <tr><td>Close time</td><td>CB2 close coil energized at 11 o'clock — auto</td></tr>
                    <tr><td>Phase check</td><td>Hardwired — physically impossible to swap via software</td></tr>
                    <tr><td>Sync timeout</td><td>60s max — fault and alarm if not achieved</td></tr>
                    <tr><td>Operator role</td><td>None — fully automatic</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="col" style={{flex:1,minWidth:"240px"}}>
              <div className="panel e1t" data-lbl="Load Staging Algorithm">
                <div className="pi">
                  <LoadStaging/>
                </div>
              </div>
              <div className="panel e2t" data-lbl="Predictive Maintenance System">
                <div className="pi">
                  <div className="sh">SENSOR SUITE</div>
                  <table className="st">
                    <tbody>
                      {[
                        ["Vibration (each bearing)","Tri-axis MEMS — bearing wear trending"],
                        ["Oil quality (each engine)","Viscosity / particle count — degradation curve"],
                        ["Coolant pH (common)","Alert below 7.5 — additive depletion"],
                        ["Fuel quality","Water detection, particle count"],
                        ["Exhaust temp (×2)","Trend analysis — injector degradation"],
                        ["Run hours (×2)","Equal-wear tracking — flag drift > 10hrs"],
                        ["Battery V (×2)","Load-test cycle auto-initiated monthly"],
                        ["Turbo inlet/outlet pressure","Turbo efficiency degradation indicator"],
                        ["Bus harmonic analyzer","THD monitoring — VFD load trending"],
                        ["Coolant temp delta","ΔT between engines — cooling imbalance alert"],
                      ].map(([k,v],i)=><tr key={i}><td>{k}</td><td>{v}</td></tr>)}
                    </tbody>
                  </table>
                  <div className="co pu" style={{marginTop:"10px"}}>IoT gateway integrated. All data streams to cloud dashboard. Threshold alerts via SMS/email. Trend prediction: alert 150–200 hours before predicted failure. Reduces unplanned downtime by estimated 60–70% vs time-based maintenance alone.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 5: EFFICIENCY ── */}
      {tab===5&&(
        <div className="body">
          <div className="row">
            <div className="panel but" data-lbl="Efficiency Analysis — DC-900 vs Alternatives" style={{flex:2,minWidth:"320px"}}>
              <div className="pi">
                <div className="sh">FUEL CONSUMPTION COMPARISON AT VARIOUS LOADS</div>
                <div className="co inf">All fuel figures derived from Cummins QSX15-G9 data sheet (D-3400). Single 900kW values estimated from QST30/KTA38 class engines typical for that output. DC-900 values use actual QSX15 consumption curve with staging algorithm.</div>
                {[
                  {load:"250kW (28%)",p:"One 450kW unit running",v1:"~14.5 GPH (QSX15 @ 56% prime)",dc:"~14.5 GPH (E1 only, 56% — no penalty)",d2:"~29 GPH (both running at 28% = wet stack risk)",single:"~16 GPH (900kW at 28% = very inefficient)",best:"DC-900 = field-parallel identical. Single 900kW worst."},
                  {load:"450kW (50%)",p:"Transition zone",v1:"~23 GPH (one QSX15 at 100% prime = max single)",dc:"~18 GPH (E1 at 45% + E2 staged — auto decides)",d2:"~23 GPH (both at 50% each = 2×)",single:"~21 GPH (900kW at 50%)",best:"DC-900 auto-stages most efficiently."},
                  {load:"600kW (67%)",p:"Common operating point",v1:"N/A — exceeds single unit",dc:"~32 GPH (both at 67% each — sweet spot)",d2:"~32 GPH (same machines, same result if matched)",single:"~23 GPH (900kW at 67%)",best:"Single large machine more efficient at this point — but zero redundancy."},
                  {load:"820kW (91%)",p:"High demand",v1:"N/A",dc:"~52 GPH (both at 91% prime)",d2:"~52 GPH (if managed correctly)",single:"~29 GPH est. (900kW at 91%)",best:"Single machine wins on fuel at high load — dual wins on redundancy."},
                ].map((r,i)=>(
                  <div key={i} style={{background:"var(--p0)",border:"1px solid var(--line)",padding:"12px 14px",marginBottom:"8px"}}>
                    <div style={{fontFamily:"var(--MO)",fontSize:"10px",color:"var(--BUSb)",fontWeight:"700",marginBottom:"8px",letterSpacing:"1px"}}>{r.load} — {r.p}</div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:"8px",marginBottom:"8px"}}>
                      {[["SINGLE 450kW",r.v1,"var(--TM)"],["DC-900",r.dc,"var(--E2b)"],["FIELD PARALLEL",r.d2,"var(--E1b)"],["SINGLE 900kW",r.single,"var(--TM)"]].map(([k,v,c])=>(
                        <div key={k} style={{background:"var(--p2)",padding:"8px 10px",border:"1px solid var(--line)"}}>
                          <div style={{fontFamily:"var(--MO)",fontSize:"7px",color:"var(--TL)",marginBottom:"3px",letterSpacing:"1px"}}>{k}</div>
                          <div style={{fontSize:"12px",color:c,fontWeight:"600"}}>{v}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{fontFamily:"var(--MO)",fontSize:"9px",color:"var(--OK)",borderTop:"1px solid var(--line)",paddingTop:"6px"}}>▸ {r.best}</div>
                  </div>
                ))}
                <div className="sh" style={{marginTop:"14px"}}>EFFICIENCY INNOVATIONS OVER STANDARD PARALLEL</div>
                <div className="fgrid">
                  {[
                    {t:"Variable-Speed Fan System",c:"var(--E2)",tag:"8–15 kW SAVED",d:"Electric VFD fans replace fixed belt-driven fans (19 kW per engine at full speed). At 60% load, fan power drops to ~8–10 kW total vs 38 kW combined fixed. Annual savings at typical duty cycle: ~40,000 kWh."},
                    {t:"Isochronous-Droop Hybrid Control",c:"var(--PUb)",tag:"±0.1 Hz STABILITY",d:"Droop for load sharing during transitions. Isochronous for steady-state frequency regulation. Tighter Hz regulation than pure droop (±0.25%) — critical for VFD and UPS-served loads."},
                    {t:"Fuel Polishing System",c:"var(--WN)",tag:"40% INJECTOR LIFE",d:"Continuous 2μ kidney-loop polishing eliminates microbiological growth and water in diesel. Extends injector and pump service life by 40–60%. Eliminates water-in-fuel emergency shutdowns."},
                    {t:"Equal-Wear Engine Matching",c:"var(--E1)",tag:"EQUAL OVERHAUL",d:"Engines factory-selected from consecutive build lots — matched bore/ring clearances, matched injector calibration. Equal wear means both engines reach overhaul at the same time. One rebuild event instead of two."},
                    {t:"Active Harmonic Filtering (Option)",c:"var(--OK)",tag:"THD < 3%",d:"Integrated 50A active harmonic filter on output bus. Maintains THD < 3% even with 100% VFD load. Eliminates the 20–25% generator derating required for non-linear loads. Reclaims ~45kW of capacity on typical VFD-heavy sites."},
                    {t:"Waste Heat Recovery Port",c:"var(--BUS)",tag:"35 MJ/min",d:"Plate heat exchanger tee on common coolant return. Available heat: ~35 MJ/min (33,000 BTU/min) combined. Used for site heating or domestic hot water — reduces net site energy cost by 8–15% on heating-load sites."},
                  ].map((f,i)=>(
                    <div key={i}className="fcard"style={{borderLeftColor:f.c}}>
                      <div className="fcard-t"style={{color:f.c}}>{f.t}</div>
                      <div className="fcard-b">{f.d}</div>
                      <div className="fcard-tag"style={{background:`${f.c}20`,color:f.c,border:`1px solid ${f.c}`}}>{f.tag}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="col" style={{flex:1,minWidth:"240px"}}>
              <div className="panel okt" data-lbl="Operating Cost Comparison (Annual Est.)">
                <div className="pi">
                  <div className="co inf">Assumptions: 2,000 hrs/yr operation, 60% avg load, $4.50/gal diesel, 250-hr oil change.</div>
                  <table className="st" style={{marginTop:"8px"}}>
                    <tbody>
                      <tr className="hr"><td colSpan="2">FIELD PARALLEL (2× 450kW)</td></tr>
                      <tr><td>Fuel (2,000hr @ 36 GPH avg)</td><td>$324,000</td></tr>
                      <tr><td>Maintenance (×2 units)</td><td>~$18,000</td></tr>
                      <tr><td>Commissioning (annual)</td><td>~$4,000</td></tr>
                      <tr className="erc"><td>TOTAL ANNUAL</td><td>~$346,000</td></tr>
                      <tr className="hr"><td colSpan="2">DC-900 (INTEGRATED DUAL)</td></tr>
                      <tr><td>Fuel (2,000hr @ 32 GPH avg)</td><td>$288,000</td></tr>
                      <tr><td>Maintenance (1 unit service)</td><td>~$11,000</td></tr>
                      <tr><td>Commissioning (plug and go)</td><td>~$1,500</td></tr>
                      <tr className="okc"><td>TOTAL ANNUAL</td><td>~$300,500</td></tr>
                      <tr className="hr"><td colSpan="2">ANNUAL SAVINGS vs PARALLEL</td></tr>
                      <tr className="okc"><td>Net savings per year</td><td>~$45,500</td></tr>
                      <tr className="okc"><td>Over 5-year lifecycle</td><td>~$227,500</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="panel put" data-lbl="Redundancy Analysis">
                <div className="pi">
                  <table className="st">
                    <tbody>
                      <tr className="hr"><td colSpan="2">N+1 FAILURE SCENARIOS</td></tr>
                      <tr><td>E1 trips — E2 survives</td><td style={{color:"var(--OK)"}}>450kW available. Instant. Zero interruption.</td></tr>
                      <tr><td>E2 trips — E1 survives</td><td style={{color:"var(--OK)"}}>450kW available. Instant. Zero interruption.</td></tr>
                      <tr><td>Load &gt; 450kW on one engine</td><td style={{color:"var(--WN)"}}>Master controller auto-sheds non-critical loads</td></tr>
                      <tr><td>Common fuel system fail</td><td style={{color:"var(--WN)"}}>External fuel bypass inlet standard equipment</td></tr>
                      <tr><td>Common cooling fail</td><td style={{color:"var(--WN)"}}>Each engine has independent thermostat — slower derate</td></tr>
                      <tr><td>Master controller fail</td><td style={{color:"var(--WN)"}}>Each PCC3300 falls back to standalone mode</td></tr>
                      <tr><td>Single exhaust blockage</td><td style={{color:"var(--OK)"}}>Y-collector check valves isolate — E2 continues</td></tr>
                      <tr className="hr"><td colSpan="2">VERSUS SINGLE 900kW</td></tr>
                      <tr><td>Single 900kW machine trips</td><td style={{color:"var(--ER2)"}}>100% power loss — zero redundancy</td></tr>
                      <tr><td>DC-900 loses one engine</td><td style={{color:"var(--OK)"}}>50% capacity remains — N+1 survives</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 6: BUILD SPECS ── */}
      {tab===6&&(
        <div className="body">
          <div className="row">
            <div className="panel e1t" data-lbl="Complete Build Specification — DC-900" style={{flex:1}}>
              <div className="pi">
                <div className="tgrid">
                  {[
                    {k:"Engines",v:"2×",u:"QSX15-G9",s:"Factory matched consecutive serial",cl:"e1"},
                    {k:"Standby Rating",v:"900",u:"kW",s:"1,125 kVA @ 0.8 PF",cl:"bu"},
                    {k:"Prime Rating",v:"820",u:"kW",s:"1,025 kVA (ISO 8528)",cl:"bu"},
                    {k:"Displacement (combined)",v:"30.0",u:"L",s:"2× 15L QSX15",cl:"e1"},
                    {k:"Oil Capacity (combined)",v:"166.6",u:"L",s:"88 qt per engine × 2",cl:"e1"},
                    {k:"Coolant (combined)",v:"115.8",u:"L",s:"57.9L per engine × 2",cl:"e2"},
                    {k:"Sub-base fuel tank",v:"400",u:"USG",s:"1,514L double-wall"},
                    {k:"Fuel @ 100% combined",v:"60.2",u:"GPH",s:"228 L/hr both engines",cl:"e1"},
                    {k:"Fuel polisher",v:"2μ",u:"",s:"Continuous kidney loop"},
                    {k:"Bus voltage",v:"480",u:"V L-L",s:"277V L-N / 3φ 4W",cl:"bu"},
                    {k:"Machine breakers (CB1,CB2)",v:"1200",u:"A",s:"65 kAIC, LSIG factory set",cl:"e1"},
                    {k:"Output breaker",v:"1600",u:"A",s:"Factory coordinated",cl:"bu"},
                    {k:"Current @ 480V standby",v:"1,354",u:"A",s:"677A per machine",cl:"bu"},
                    {k:"ANSI protection",v:"25,32,51,27,59,81,86",u:"",s:"Factory wired and tested"},
                    {k:"Motor start kVA (PMG ea.)",v:"2,208",u:"kVA",s:"@ 90% sustained voltage",cl:"e2"},
                    {k:"HMI display",v:"10\"",u:"",s:"Touchscreen, IP65, full color"},
                    {k:"Fan system",v:"VFD",u:"",s:"2× variable-speed electric",cl:"ok"},
                    {k:"Exhaust Y-collector",v:"8\"",u:"OD",s:"304SS + check valves"},
                    {k:"Sound level (attenuated)",v:"~74",u:"dBA",s:"@ 7m / 23ft"},
                    {k:"Weight wet (estimated)",v:"~26,000",u:"lbs",s:"~11,800 kg"},
                    {k:"L × W × H (estimated)",v:"380×96×102",u:"in",s:"9.65m × 2.44m × 2.59m"},
                    {k:"Enclosure IP rating",v:"IP56",u:"",s:"Sound-attenuated weatherproof"},
                    {k:"Vibration isolation",v:"Anti-vib",u:"",s:"Independent per engine"},
                    {k:"Predictive maintenance",v:"IoT",u:"",s:"10-sensor suite + cloud"},
                    {k:"Battery CCA (each)",v:"1,000",u:"CCA",s:"AGM × 2 — cross-connected",cl:"ok"},
                    {k:"Shore power input",v:"240V",u:"30A",s:"Heaters + chargers unified"},
                    {k:"Waste heat recovery",v:"35",u:"MJ/min",s:"Optional PHE tee",cl:"ok"},
                    {k:"Emissions (both engines)",v:"Tier 2",u:"NSPS",s:"EPA Stationary Emergency"},
                    {k:"Standards",v:"NFPA 110",u:"",s:"Level 1, UL2200, CSA"},
                    {k:"Warranty",v:"2-yr",u:"",s:"Base + extended options"},
                  ].map((t,i)=>(
                    <div className={`tile ${t.cl||""}`}key={i}>
                      <div className="tk">{t.k}</div>
                      <div><span className="tv">{t.v}</span><span className="tu">{t.u}</span></div>
                      <div className="ts">{t.s}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="panel okt" data-lbl="Factory Test Protocol" style={{flex:1,minWidth:"280px"}}>
              <div className="pi">
                <div className="sh">DC-900 FACTORY ACCEPTANCE TEST</div>
                {[
                  {n:"1",t:"Individual engine run-in",s:"Each QSX15 run-in 4 hrs at progressive load: 25→50→75→100%. Verify oil pressure, temp, Hz, V against data sheet."},
                  {n:"2",t:"Protection relay functional test",s:"Manually simulate every ANSI fault on each machine. Verify correct CB trips and ALARM/SHUTDOWN sequence. Log results."},
                  {n:"3",t:"Auto-sync test",s:"Run both engines. Initiate auto-sync from HMI. Verify CB2 closes within 60s with ΔV < 2%, Δf < 0.1 Hz, Δφ < 5°."},
                  {n:"4",t:"Load share verification",s:"Apply 450kW resistive load bank. Verify both machines carry 225kW ±5% each. Record load share link accuracy."},
                  {n:"5",t:"Full load test — 8 hours",s:"900kW combined (450kW each). Verify: no derate, coolant temp < 95°C, oil pressure 40–75 PSI, Hz 60.0 ±0.25, V 480 ±2%."},
                  {n:"6",t:"Step load test",s:"Apply 100% load in single step. Verify Hz dip < 10%, recovery < 3 seconds. Record waveform. Required per NFPA 110 Level 1."},
                  {n:"7",t:"Staging algorithm test",s:"Ramp load 0→350kW (E2 starts), hold 5 min, ramp 350→200kW (E2 stops). Verify seamless transitions, no power dips."},
                  {n:"8",t:"Single-engine failure simulation",s:"Trip CB1 under 600kW load. Verify E2 picks up full remaining 600kW and alarms correctly. Trip test on E2 as well."},
                  {n:"9",t:"Fuel system test",s:"Verify fuel polisher operation, level sensor accuracy, single-point fill. Run each engine to 50% tank — verify level alarm."},
                  {n:"10",t:"IoT / predictive system test",s:"Verify all 10 sensors reporting to HMI and cloud. Verify alert thresholds. Verify remote start/stop command."},
                ].map(s=>(
                  <div key={s.n} style={{display:"flex",gap:"12px",alignItems:"flex-start",padding:"7px 0",borderBottom:"1px solid var(--line)"}}>
                    <div style={{background:"var(--E1)",color:"#000",fontFamily:"var(--MO)",fontSize:"9px",fontWeight:"700",minWidth:"22px",height:"22px",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{s.n}</div>
                    <div><div style={{fontSize:"13px",fontWeight:"700"}}>{s.t}</div><div style={{fontFamily:"var(--MO)",fontSize:"9px",color:"var(--TM)",marginTop:"2px",lineHeight:"1.5"}}>{s.s}</div></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="col" style={{flex:1,minWidth:"240px"}}>
              <div className="panel e2t" data-lbl="What We Cannot Solve — Engineering Honesty">
                <div className="pi">
                  <div className="co er">Engineering honesty: integrated systems solve most parallel cons but introduce their own constraints. These must be understood before specification.</div>
                  <div className="sh" style={{marginTop:"10px"}}>INHERENT TRADE-OFFS</div>
                  {[
                    {t:"Common fuel system is a single-point risk",d:"If the sub-base tank is contaminated or the fuel manifold leaks, both engines are affected. Mitigation: fuel polisher, isolation valves, external bypass inlet, 110% containment."},
                    {t:"Heavier and larger than single 50kW",d:"At ~26,000 lbs, this unit requires heavy transport and significant crane capacity for placement. Field-parallel allows two lighter lifts."},
                    {t:"Internal repairs require taking whole unit offline",d:"If internal wiring or switchgear needs service, both engines may need to be stopped. Field-parallel allows service on one unit while the other runs."},
                    {t:"Higher capital cost than field-parallel",d:"Integrated unit costs more upfront than two separate rental sets. The operating cost savings ($45K/year) typically break even in 2–3 years on high-use sites."},
                    {t:"Proprietary integrated system",d:"Service requires technician familiar with DC-900 integrated system, not just a Cummins service tech. Training and parts programs must be established at purchase."},
                    {t:"Common cooling — single coolant failure affects both",d:"A catastrophic coolant leak on the common header could threaten both engines. Mitigation: per-engine isolation valves, independent thermostat per engine, fast coolant low alarm."},
                  ].map((r,i)=>(
                    <div key={i} style={{padding:"7px 0",borderBottom:"1px solid var(--line)"}}>
                      <div style={{color:"var(--WN)",fontFamily:"var(--MO)",fontSize:"9px",fontWeight:"700",marginBottom:"3px"}}>⚠ {r.t}</div>
                      <div style={{fontSize:"12px",color:"var(--TM)",lineHeight:"1.5"}}>{r.d}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="panel e1t" data-lbl="Senior Engineer Conclusion">
                <div className="pi">
                  <div style={{fontSize:"13px",lineHeight:"1.8",color:"var(--TX)"}}>
                    <p style={{marginBottom:"10px"}}>In 40 years I've seen every combination of parallel generator failure. The most dangerous is the phase reversal on first connection — it happens to experienced electricians who trust cable color codes. The DC-900's internal bus eliminates this entirely. You cannot wire it wrong.</p>
                    <p style={{marginBottom:"10px"}}>The second is the neutral bonding error. At 450kW, a dual bond doesn't just nuisance-trip GFCI outlets — it injects significant ground current into the site electrical system. The permanent factory isolation relay on E2 neutral is the correct engineering solution.</p>
                    <p style={{marginBottom:"10px"}}>The efficiency argument is real but nuanced. At high load (&gt; 700kW), a single 900kW machine burns less fuel. But most industrial sites don't run at 700kW continuously — they run at 50–65% of peak demand. In that operating range, two smaller machines in load-following staging consistently beat one large machine.</p>
                    <p>What this design cannot do: make the consequences of a common fuel contamination event disappear. That's the honest trade-off. The solution is rigorous fuel management — which the integrated polisher addresses — and the external bypass inlet for emergency direct-tank operation.</p>
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
