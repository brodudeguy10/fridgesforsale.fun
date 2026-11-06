/* ============================================================
   FRIDGE PALACE: the scratch-o-matic
   a vending machine by the front doors that sells scratch-off
   tickets. you scratch them with the mouse (or a finger). every
   ticket's result is decided the moment you buy it, from a prize
   table printed on the back, and the art is drawn to match.
   three tickets on the menu. a fourth one, sometimes, that the
   machine isn't supposed to print.
============================================================ */
import * as THREE from '../lib/three.module.min.js';
import { G } from '../world/props.js';
import { bakePainted } from '../world/fridge.js';
import { neonSign } from '../world/signs.js';
import { canvas, tex } from '../world/textures.js';
import { fair, pick, rand, shuffle } from '../core/util.js';

/* prize tables: [chance, multiple of the price]. what's left over is a dud. */
const TICKETS = [
  { id:'coils', name:'LUCKY COILS', price:10, kind:'match3', c1:'#ff3f8e', c2:'#ffd400', ink:'#2a0414',
    blurb:'match three symbols, win that symbol\'s prize.',
    table:[[0.12, 1], [0.07, 2], [0.03, 5], [0.012, 10], [0.0025, 50], [0.0002, 500]] },
  { id:'burn', name:'FREEZER BURN', price:50, kind:'numbers', c1:'#3fb8ff', c2:'#e8fbff', ink:'#04182a',
    blurb:'match a winning number, win the prize under it. a snowflake wins its prize on the spot.',
    table:[[0.13, 1], [0.08, 2], [0.035, 4], [0.012, 10], [0.003, 40], [0.0004, 200], [0.00004, 1000]] },
  { id:'vault', name:'COLD HARD CASH', price:250, kind:'bars', c1:'#1f8a4a', c2:'#ffd56a', ink:'#04140a',
    blurb:'find three gold bars, win what\'s in the prize box.',
    table:[[0.14, 1], [0.07, 2], [0.025, 5], [0.006, 20], [0.001, 100], [0.0001, 1000]] }
];
const BASEMENT = { id:'basement', name:'THE BASEMENT', price:13, kind:'basement', c1:'#1a1a1a', c2:'#b8a88a', ink:'#0a0a0a',
  blurb:'nobody stocks this one.', table:[[0.5, 1], [0.15, 2], [0.05, 66/13]] };
const PITY = { id:'pity', name:'PITY PARTY', price:0, kind:'pity', c1:'#ff9ad0', c2:'#fff1f8', ink:'#3a0a22', blurb:'the machine feels bad.', table:[[1, 1]] };
const W = 640, H = 360;
const odds = T=>Math.round(1/T.table.reduce((s, r)=>s + r[0], 0)*10)/10;

/* ---------- little vector icons, so nothing depends on emoji fonts ---------- */
function icon(g, k, x, y, s){
  g.save(); g.translate(x, y); g.scale(s/40, s/40); g.lineCap = 'round'; g.lineJoin = 'round';
  if(k === 'cherry'){ g.strokeStyle = '#2a7a2a'; g.lineWidth = 3; g.beginPath(); g.moveTo(-8, 4); g.quadraticCurveTo(-4, -14, 6, -18); g.moveTo(9, 6); g.quadraticCurveTo(8, -8, 6, -18); g.stroke(); g.fillStyle = '#d0142a'; [[-9, 9], [9, 11]].forEach(([a, b])=>{ g.beginPath(); g.arc(a, b, 8, 0, 7); g.fill(); }); g.fillStyle = 'rgba(255,255,255,.6)'; g.beginPath(); g.arc(-11, 6, 2.5, 0, 7); g.fill(); }
  else if(k === 'flake'){ g.strokeStyle = '#2a9ae8'; g.lineWidth = 3.5; for(let i=0;i<6;i++){ g.save(); g.rotate(i*Math.PI/3); g.beginPath(); g.moveTo(0, 0); g.lineTo(0, -17); g.moveTo(0, -10); g.lineTo(-5, -15); g.moveTo(0, -10); g.lineTo(5, -15); g.stroke(); g.restore(); } }
  else if(k === 'bell'){ g.fillStyle = '#f2b81a'; g.strokeStyle = '#8a5a00'; g.lineWidth = 2; g.beginPath(); g.moveTo(-14, 10); g.quadraticCurveTo(-13, -16, 0, -16); g.quadraticCurveTo(13, -16, 14, 10); g.closePath(); g.fill(); g.stroke(); g.beginPath(); g.arc(0, 13, 4, 0, 7); g.fill(); g.stroke(); }
  else if(k === 'fridge'){ g.fillStyle = '#e8e8ea'; g.strokeStyle = '#333'; g.lineWidth = 2.5; g.fillRect(-11, -18, 22, 36); g.strokeRect(-11, -18, 22, 36); g.beginPath(); g.moveTo(-11, -5); g.lineTo(11, -5); g.stroke(); g.fillStyle = '#05111a'; g.fillRect(-7, -15, 14, 7); g.fillStyle = '#7ff3ff'; g.fillRect(-4, -13, 2, 3); g.fillRect(2, -13, 2, 3); g.fillStyle = '#888'; g.fillRect(6, -1, 2, 10); }
  else if(k === 'seven'){ g.fillStyle = '#e8102a'; g.strokeStyle = '#ffd400'; g.lineWidth = 2; g.font = 'bold 44px Georgia, serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.strokeText('7', 0, 2); g.fillText('7', 0, 2); }
  else if(k === 'diamond'){ g.fillStyle = '#9ff0ff'; g.strokeStyle = '#1a6a8a'; g.lineWidth = 2; g.beginPath(); g.moveTo(-15, -6); g.lineTo(-8, -15); g.lineTo(8, -15); g.lineTo(15, -6); g.lineTo(0, 17); g.closePath(); g.fill(); g.stroke(); g.beginPath(); g.moveTo(-15, -6); g.lineTo(15, -6); g.moveTo(-8, -15); g.lineTo(0, 17); g.lineTo(8, -15); g.stroke(); }
  else if(k === 'bar'){ g.fillStyle = '#f2c230'; g.strokeStyle = '#8a6a10'; g.lineWidth = 2; g.beginPath(); g.moveTo(-17, 9); g.lineTo(17, 9); g.lineTo(11, -7); g.lineTo(-11, -7); g.closePath(); g.fill(); g.stroke(); g.fillStyle = 'rgba(255,255,255,.5)'; g.fillRect(-8, -4, 10, 3); }
  else if(k === 'coin'){ g.fillStyle = '#d8a83a'; g.strokeStyle = '#7a5a10'; g.lineWidth = 2; g.beginPath(); g.arc(0, 0, 14, 0, 7); g.fill(); g.stroke(); g.fillStyle = '#7a5a10'; g.font = 'bold 18px Georgia'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('$', 0, 1); }
  else if(k === 'key'){ g.strokeStyle = '#b8b8c0'; g.lineWidth = 4; g.beginPath(); g.arc(-8, 0, 7, 0, 7); g.moveTo(-1, 0); g.lineTo(16, 0); g.moveTo(10, 0); g.lineTo(10, 6); g.moveTo(15, 0); g.lineTo(15, 5); g.stroke(); }
  else if(k === 'safe'){ g.fillStyle = '#4a4e58'; g.strokeStyle = '#1a1c20'; g.lineWidth = 2; g.fillRect(-15, -15, 30, 30); g.strokeRect(-15, -15, 30, 30); g.strokeStyle = '#c8c8d0'; g.beginPath(); g.arc(0, 0, 7, 0, 7); g.moveTo(0, 0); g.lineTo(5, -5); g.stroke(); }
  else if(k === 'bag'){ g.fillStyle = '#c8a878'; g.strokeStyle = '#5a4020'; g.lineWidth = 2; g.beginPath(); g.moveTo(-6, -12); g.lineTo(6, -12); g.lineTo(3, -7); g.quadraticCurveTo(17, 2, 12, 15); g.lineTo(-12, 15); g.quadraticCurveTo(-17, 2, -3, -7); g.closePath(); g.fill(); g.stroke(); g.fillStyle = '#2a7a2a'; g.font = 'bold 15px Georgia'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('$', 0, 5); }
  else if(k === 'eye'){ g.strokeStyle = '#b8a88a'; g.lineWidth = 2.5; g.beginPath(); g.moveTo(-17, 0); g.quadraticCurveTo(0, -14, 17, 0); g.quadraticCurveTo(0, 14, -17, 0); g.stroke(); g.fillStyle = '#b8a88a'; g.beginPath(); g.arc(0, 0, 5, 0, 7); g.fill(); }
  g.restore();
}
const M3 = [{ k:'cherry', m:1 }, { k:'flake', m:2 }, { k:'bell', m:5 }, { k:'fridge', m:10 }, { k:'seven', m:50 }, { k:'diamond', m:500 }];

/* ---------- deciding a ticket ---------- */
function roll(T){
  const r = fair(1000000)/1000000; let acc = 0;
  for(const [p, m] of T.table){ acc += p; if(r < acc) return m; }
  return 0;
}
const fm = n=>Math.round(n).toLocaleString('en-US');
/* builds what's printed under the foil, to match a result decided in advance */
function build(T, mult, price){
  const win = Math.round(mult*price), zones = [];
  const art = { win, mult, price };
  if(T.kind === 'match3'){
    const cells = [];
    if(mult > 0){ const k = M3.findIndex(s=>s.m === mult); for(let i=0;i<3;i++) cells.push(k); }
    const count = new Array(M3.length).fill(0); cells.forEach(k=>count[k]++);
    /* the rest: nothing three times. a pair of something big now and then, for the heartbreak */
    if(!mult && Math.random() < 0.45){ const k = 3 + fair(3); cells.push(k, k); count[k] += 2; }
    while(cells.length < 9){ const k = fair(M3.length); if(count[k] >= 2 || (mult && k === M3.findIndex(s=>s.m === mult))) continue; cells.push(k); count[k]++; }
    shuffle(cells); art.cells = cells;
    for(let i=0;i<9;i++){ const cx = 60 + (i % 3)*102, cy = 98 + Math.floor(i/3)*76; zones.push({ x:cx, y:cy, w:92, h:66 }); }
  } else if(T.kind === 'numbers'){
    const wn = []; while(wn.length < 2){ const n = 1 + fair(30); if(!wn.includes(n)) wn.push(n); }
    const decoy = ()=>{ const n = T.table.length, k = Math.min(fair(n), fair(n), fair(n - 1)); return Math.round(T.table[k][1]*price); };
    const yours = [];
    let parts = [];
    if(win > 0){ if(win >= price*4 && Math.random() < 0.3){ const a = Math.round(win*rand(0.3, 0.7)/5)*5 || price; parts = [a, win - a]; } else parts = [win]; }
    const snow = parts.length === 1 && Math.random() < 0.25;
    parts.forEach((p, i)=>yours.push({ n:snow ? 0 : wn[i % 2], p, hit:true, snow }));
    while(yours.length < 8){ const n = 1 + fair(30); if(wn.includes(n) || yours.some(y=>y.n === n)) continue; yours.push({ n, p:decoy(), hit:false }); }
    shuffle(yours); art.wn = wn; art.yours = yours;
    zones.push({ x:250, y:92, w:70, h:56, tag:'w' }, { x:330, y:92, w:70, h:56, tag:'w' });
    for(let i=0;i<8;i++){ const cx = 34 + (i % 4)*146, cy = 174 + Math.floor(i/4)*78; zones.push({ x:cx, y:cy, w:132, h:68 }); }
  } else if(T.kind === 'bars'){
    const other = ['coin', 'key', 'safe', 'bag'];
    const cells = [];
    const bars = mult > 0 ? 3 : (Math.random() < 0.42 ? 2 : fair(2));
    for(let i=0;i<bars;i++) cells.push('bar');
    while(cells.length < 12) cells.push(pick(other));
    shuffle(cells); art.cells = cells;
    art.box = win > 0 ? win : Math.round(pick(T.table.slice(1))[1]*price);
    zones.push({ x:452, y:118, w:156, h:118, tag:'box' });
    for(let i=0;i<12;i++){ const cx = 30 + (i % 4)*102, cy = 98 + Math.floor(i/4)*76; zones.push({ x:cx, y:cy, w:92, h:66 }); }
  } else if(T.kind === 'basement'){
    const LINES = ['YOU WERE HERE BEFORE', 'HE WENT HOME', 'THE ROOM COUNTS ITSELF', 'NOT A WINNER', 'TRY THE SAUCE', 'COUNT THE FRIDGES', 'IT GETS A DIFFERENT NUMBER', 'KEEP SCRATCHING', 'DOWNSTAIRS IS OPEN', 'NO ONE STOCKS THIS'];
    art.lines = shuffle(LINES.slice()).slice(0, 6);
    for(let i=0;i<6;i++){ const cx = 40 + (i % 3)*190, cy = 112 + Math.floor(i/3)*96; zones.push({ x:cx, y:cy, w:176, h:82 }); }
  } else if(T.kind === 'pity'){
    art.lines = ['SORRY', 'ABOUT', 'ALL THAT'];
    for(let i=0;i<3;i++) zones.push({ x:50 + i*184, y:128, w:168, h:110 });
  }
  return { T, win, mult, art, zones };
}

/* ---------- drawing the ticket ---------- */
function paintTicket(g, tk){
  const T = tk.T, a = tk.art;
  g.clearRect(0, 0, W, H);
  /* the card itself with a stamped edge */
  const gr = g.createLinearGradient(0, 0, W, H); gr.addColorStop(0, T.c1); gr.addColorStop(1, shade(T.c1, -40));
  g.fillStyle = gr; g.fillRect(0, 0, W, H);
  g.fillStyle = 'rgba(255,255,255,0.06)'; for(let i=-H; i<W; i+=22){ g.beginPath(); g.moveTo(i, 0); g.lineTo(i + H, H); g.lineTo(i + H + 8, H); g.lineTo(i + 8, 0); g.fill(); }
  g.strokeStyle = T.c2; g.lineWidth = 4; g.strokeRect(10, 10, W - 20, H - 20);
  g.setLineDash([3, 6]); g.lineWidth = 1.5; g.strokeRect(18, 18, W - 36, H - 36); g.setLineDash([]);
  g.textBaseline = 'middle'; g.textAlign = 'left';
  g.fillStyle = T.c2; g.font = 'bold 34px Georgia, serif'; g.fillText(T.name, 30, 48);
  g.textAlign = 'right'; g.font = 'bold 22px Georgia, serif'; g.fillText(T.price ? fm(T.price) + ' CHIPS' : 'FREE', W - 30, 44);
  g.font = 'italic 13px Georgia, serif'; g.fillStyle = 'rgba(255,255,255,0.8)'; g.fillText('a fridge palace product', W - 30, 66);
  g.textAlign = 'center';
  const cell = (z, fill)=>{ g.fillStyle = fill || 'rgba(255,255,255,0.92)'; rr(g, z.x, z.y, z.w, z.h, 8); g.fill(); };
  if(T.kind === 'match3'){
    tk.zones.forEach((z, i)=>{ cell(z); icon(g, M3[a.cells[i]].k, z.x + z.w/2, z.y + z.h/2, 44); });
    /* the legend */
    g.fillStyle = 'rgba(0,0,0,0.35)'; rr(g, 380, 96, 230, 222, 10); g.fill();
    g.fillStyle = T.c2; g.font = 'bold 15px Georgia'; g.fillText('MATCH 3 TO WIN', 495, 116);
    M3.slice().reverse().forEach((s, i)=>{ const y = 146 + i*30; icon(g, s.k, 418, y, 22); g.fillStyle = '#fff'; g.font = 'bold 17px Georgia'; g.textAlign = 'left'; g.fillText(fm(s.m*a.price), 446, y + 1); g.textAlign = 'center'; });
  } else if(T.kind === 'numbers'){
    g.fillStyle = T.c2; g.font = 'bold 15px Georgia'; g.fillText('WINNING NUMBERS', 325, 80);
    tk.zones.slice(0, 2).forEach((z, i)=>{ cell(z, '#fff'); g.fillStyle = T.ink; g.font = 'bold 32px Georgia'; g.fillText(String(a.wn[i]), z.x + z.w/2, z.y + z.h/2 + 2); });
    g.fillStyle = T.c2; g.font = 'bold 15px Georgia'; g.fillText('YOUR NUMBERS', W/2, 162);
    tk.zones.slice(2).forEach((z, i)=>{ const y = a.yours[i]; cell(z);
      if(y.snow){ icon(g, 'flake', z.x + z.w/2, z.y + 26, 34); }
      else { g.fillStyle = T.ink; g.font = 'bold 30px Georgia'; g.fillText(String(y.n), z.x + z.w/2, z.y + 26); }
      g.fillStyle = '#5a6a7a'; g.font = 'bold 15px Georgia'; g.fillText(fm(y.p), z.x + z.w/2, z.y + 54); });
  } else if(T.kind === 'bars'){
    tk.zones.slice(1).forEach((z, i)=>{ cell(z); icon(g, a.cells[i], z.x + z.w/2, z.y + z.h/2, 44); });
    const b = tk.zones[0]; g.fillStyle = '#05140a'; rr(g, b.x, b.y, b.w, b.h, 10); g.fill(); g.strokeStyle = T.c2; g.lineWidth = 3; rr(g, b.x, b.y, b.w, b.h, 10); g.stroke();
    g.fillStyle = T.c2; g.font = 'bold 13px Georgia'; g.fillText('PRIZE', b.x + b.w/2, b.y + 26); g.font = 'bold 30px Georgia'; g.fillText(fm(a.box), b.x + b.w/2, b.y + 66);
    g.font = 'bold 13px Georgia'; g.fillText('3 BARS WINS IT', b.x + b.w/2, b.y + 100);
  } else if(T.kind === 'basement'){
    tk.zones.forEach((z, i)=>{ cell(z, '#d8ccb0'); g.fillStyle = '#1a1410'; g.font = 'bold 15px "Courier New", monospace'; const words = a.lines[i].split(' '); const half = Math.ceil(words.length/2);
      g.fillText(words.slice(0, half).join(' '), z.x + z.w/2, z.y + z.h/2 - 10); g.fillText(words.slice(half).join(' '), z.x + z.w/2, z.y + z.h/2 + 12); if(i === 5) icon(g, 'eye', z.x + z.w - 22, z.y + 16, 18); });
    g.fillStyle = 'rgba(184,168,138,0.6)'; g.font = 'italic 13px Georgia'; g.fillText('this ticket was not printed by the palace', W/2, H - 34);
  } else if(T.kind === 'pity'){
    tk.zones.forEach((z, i)=>{ cell(z); g.fillStyle = T.ink; g.font = 'bold 30px Georgia'; g.fillText(a.lines[i], z.x + z.w/2, z.y + z.h/2); });
  }
  /* the fine print */
  g.fillStyle = 'rgba(255,255,255,0.7)'; g.font = '11px Georgia'; g.textAlign = 'left'; g.textBaseline = 'middle';
  if(T.kind !== 'basement') g.fillText(T.kind === 'pity' ? 'redeemable for chips. not redeemable for dignity.' : 'odds of winning anything: 1 in ' + odds(T) + '  ·  void where frozen  ·  must be 21 or a fridge', 30, H - 28);
}
function paintFoil(g, tk){
  g.clearRect(0, 0, W, H);
  tk.zones.forEach(z=>{
    const gr = g.createLinearGradient(z.x, z.y, z.x + z.w, z.y + z.h); gr.addColorStop(0, '#d8dce2'); gr.addColorStop(0.45, '#9aa2ac'); gr.addColorStop(0.55, '#c8ced6'); gr.addColorStop(1, '#808894');
    g.fillStyle = gr; rr(g, z.x - 2, z.y - 2, z.w + 4, z.h + 4, 9); g.fill();
    g.save(); rr(g, z.x - 2, z.y - 2, z.w + 4, z.h + 4, 9); g.clip();
    g.strokeStyle = 'rgba(255,255,255,0.18)'; g.lineWidth = 2; for(let i=-z.h; i<z.w; i+=9){ g.beginPath(); g.moveTo(z.x + i, z.y); g.lineTo(z.x + i + z.h, z.y + z.h); g.stroke(); }
    g.fillStyle = 'rgba(60,64,72,0.55)'; g.font = 'bold ' + Math.min(18, z.h*0.3) + 'px Georgia'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText(tk.T.kind === 'basement' ? '· · ·' : (z.tag === 'box' ? 'PRIZE' : 'SCRATCH'), z.x + z.w/2, z.y + z.h/2);
    g.restore();
  });
}
function rr(g, x, y, w, h, r){ g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }
function shade(hex, amt){ const n = parseInt(hex.slice(1), 16); const c = v=>Math.max(0, Math.min(255, v + amt)); return '#' + ((c(n >> 16) << 16) | (c((n >> 8) & 255) << 8) | c(n & 255)).toString(16).padStart(6, '0'); }

export function init(C){
  const { scene, M } = C;
  const A = { x:-9.6, z:21.25, ry:Math.PI };
  const grp = new THREE.Group(); grp.position.set(A.x, 0, A.z); grp.rotation.y = A.ry; scene.add(grp); grp.updateMatrixWorld(true);
  const S = C.save.d.stats;
  if(S.scratchBought === undefined){ S.scratchBought = 0; S.scratchWon = 0; S.scratchBest = 0; S.scratchDuds = 0; }
  /* ---------- the machine ---------- */
  const red = new THREE.MeshStandardMaterial({ color:0xa8142a, roughness:0.35, metalness:0.2 });
  const stat = new THREE.Group(); grp.add(stat);
  const body = new THREE.Mesh(G.rbox(1.0, 1.7, 0.62, 0.06), red); body.position.y = 0.95; stat.add(body);
  const base = new THREE.Mesh(G.rbox(1.06, 0.12, 0.68, 0.03), M.blackMatte); base.position.y = 0.06; stat.add(base);
  const crown = new THREE.Mesh(G.rbox(1.08, 0.34, 0.7, 0.05), M.gold); crown.position.y = 1.98; stat.add(crown);
  const tray = new THREE.Mesh(G.box, M.black); tray.scale.set(0.46, 0.06, 0.08); tray.position.set(0, 0.6, 0.31); stat.add(tray);
  const lip = new THREE.Mesh(G.box, M.chrome); lip.scale.set(0.5, 0.02, 0.12); lip.position.set(0, 0.56, 0.33); stat.add(lip);
  const slotP = new THREE.Mesh(G.box, M.chrome); slotP.scale.set(0.12, 0.13, 0.03); slotP.position.set(-0.3, 0.82, 0.315); stat.add(slotP);
  const kick = new THREE.Mesh(G.box, M.gold); kick.scale.set(1.0, 0.03, 0.02); kick.position.set(0, 0.42, 0.315); stat.add(kick);
  bakePainted(stat);
  /* the window: what's for sale, drawn on a canvas behind glass */
  const dc = canvas(512, 480), dg = dc.getContext('2d'), dt = tex(dc, { nomip:true });
  const disp = new THREE.Mesh(new THREE.PlaneGeometry(0.84, 0.79), new THREE.MeshBasicMaterial({ map:dt, toneMapped:false, color:0xd8d8d8 }));
  disp.position.set(0, 1.32, 0.313); grp.add(disp);
  const glassP = new THREE.Mesh(new THREE.PlaneGeometry(0.86, 0.81), M.glass); glassP.position.set(0, 1.32, 0.322); grp.add(glassP);
  /* three big candy buttons, one per ticket */
  const btnM = TICKETS.map(T=>new THREE.MeshStandardMaterial({ color:T.c1, emissive:T.c1, emissiveIntensity:0.6, roughness:0.2 }));
  btnM.forEach((m, i)=>{ const b = new THREE.Mesh(G.sph, m); b.scale.set(0.045, 0.045, 0.025); b.position.set(0.2 + (i - 1)*0.1, 0.82, 0.32); grp.add(b); });
  /* marquee bulbs that chase */
  const bulbOn = new THREE.MeshBasicMaterial({ color:0xfff1b0, toneMapped:false }), bulbOff = new THREE.MeshStandardMaterial({ color:0x5a4a20, roughness:0.4 });
  const bulbs = []; for(let i=0;i<12;i++){ const b = new THREE.Mesh(G.sph, bulbOff); b.scale.setScalar(0.022); b.position.set(-0.49 + i*0.089, 1.83, 0.355); grp.add(b); bulbs.push(b); }
  const sign = neonSign(scene, 'scratch-o-matic', '#ffd400', ...new THREE.Vector3(0, 0, 0.37).applyMatrix4(grp.matrixWorld).toArray().map((v, i)=>i === 1 ? 1.99 : v), A.ry, 0.24);
  C.world.neon.push(sign);
  /* the side sticker */
  { const c = canvas(256, 128), g = c.getContext('2d'); g.fillStyle = '#f2e8c8'; g.fillRect(0, 0, 256, 128); g.fillStyle = '#a8142a'; g.font = 'bold 26px Georgia'; g.textAlign = 'center'; g.fillText('MUST BE 21', 128, 48); g.font = 'italic 22px Georgia'; g.fillText('or a fridge', 128, 84); g.font = '13px Georgia'; g.fillStyle = '#333'; g.fillText('no refunds · no licking tickets', 128, 112);
    const st = new THREE.Mesh(new THREE.PlaneGeometry(0.3, 0.15), new THREE.MeshStandardMaterial({ map:tex(c), roughness:0.6 })); st.position.set(0.502, 1.0, 0.05); st.rotation.y = Math.PI/2; grp.add(st); }
  C.collide.boxC(A.x, A.z - 0.05, 1.15, 0.75, 0, 'scratch');
  let lastBig = null, flash = 0;
  function drawDisplay(){
    const g = dg; g.fillStyle = '#0a0406'; g.fillRect(0, 0, 512, 480);
    g.fillStyle = '#ffd56a'; g.font = 'bold 30px Georgia'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('PICK A TICKET', 256, 34);
    TICKETS.forEach((T, i)=>{ const y = 76 + i*112; g.save(); g.translate(256, y + 44); g.rotate((i - 1)*0.04);
      const gr = g.createLinearGradient(-200, -44, 200, 44); gr.addColorStop(0, T.c1); gr.addColorStop(1, shade(T.c1, -50)); g.fillStyle = gr; rr(g, -200, -44, 400, 88, 8); g.fill(); g.strokeStyle = T.c2; g.lineWidth = 3; rr(g, -200, -44, 400, 88, 8); g.stroke();
      g.fillStyle = T.c2; g.font = 'bold ' + (T.name.length > 12 ? 24 : 30) + 'px Georgia'; g.textAlign = 'left'; g.fillText(T.name, -184, -10); g.font = 'bold 20px Georgia'; g.fillText(T.price + ' CHIPS', -184, 22);
      g.fillStyle = '#c8ccd2'; rr(g, 70, -30, 116, 60, 6); g.fill(); g.fillStyle = 'rgba(60,64,72,.6)'; g.font = 'bold 14px Georgia'; g.textAlign = 'center'; g.fillText('SCRATCH', 128, 1);
      g.restore(); });
    g.fillStyle = flash > 0 && Math.floor(flash*6) % 2 ? '#ff4a8a' : '#7dff9a'; g.font = 'bold 20px Georgia'; g.textAlign = 'center';
    g.fillText(lastBig ? 'LAST BIG WINNER: YOU · ' + fm(lastBig) : 'WINNERS SOLD HERE (SOMETIMES)', 256, 452);
    dt.needsUpdate = true;
  }
  drawDisplay();
  const pos = new THREE.Vector3(0, 1.2, 0.5).applyMatrix4(grp.matrixWorld);
  C.world.interact.push({ pos:new THREE.Vector3(0, 1.25, 0.55).applyMatrix4(grp.matrixWorld), r:2.3, text:()=>'buy scratch offs · 10–250', use:()=>shop() });

  /* ---------- the shop and the scratching ---------- */
  let streakLose = 0, open = false;
  const vendorMet = ()=>{ try{ return (VENDOR.loadMem().deaths || 0) >= 1; }catch(e){ return false; } };
  function list(){ const L = TICKETS.slice(); if(vendorMet()) L.push(BASEMENT); return L; }
  function shop(msg){
    C.input.quietUnlock(); open = true;
    const L = list();
    const body = C.hud.modal({ title:'SCRATCH-O-MATIC', cls:'fp-scratchm', onClose:()=>{ open = false; }, html:`
      <p class="fp-dim" style="text-align:center;margin-top:-6px">every ticket is decided when it drops. the art just tells you how it went.</p>
      <div class="fp-tix">${L.map(T=>`<button data-t="${T.id}" style="--c1:${T.c1};--c2:${T.c2}"><b>${T.name}</b><span>${T.blurb}</span><small>${T.price} chips · ${T.id === 'basement' ? 'odds: yes' : 'wins 1 in ' + odds(T)} · tops out at ${fm(T.table[T.table.length - 1][1]*T.price)}</small></button>`).join('')}</div>
      <div class="fp-dim" style="text-align:center;font-size:12px">${msg ? msg + ' · ' : ''}tickets tonight ${fm(S.scratchBought)} · won back ${fm(S.scratchWon)} · best ${fm(S.scratchBest)}</div>` });
    body.querySelectorAll('[data-t]').forEach(b=>b.onclick = ()=>buy(L.find(T=>T.id === b.dataset.t)));
  }
  function buy(T){
    if(T.price && !C.save.bet(T.price, 'scratch offs')){ C.audio.error(); shop('not enough chips. the cage is right there.'); return; }
    S.scratchBought++; C.save.write();
    C.audio.chip(pos, 1);
    /* the machine whirs and drops a ticket */
    C.audio.tone({ f:90, f2:140, type:'sawtooth', d:0.5, g:0.05, filt:'lowpass', ff:600 });
    let real = T;
    /* once in a while it prints the one it shouldn't */
    if(T.id !== 'basement' && !C.save.d.eggs.basementticket && fair(60) === 0) real = BASEMENT;
    const tk = build(real, roll(real), T.price || real.price);
    tk.paid = T.price; tk.misprint = real !== T; tk.orig = T;
    scratchView(tk);
  }
  let curTk = null;
  function scratchView(tk){
    const T = tk.T; curTk = tk;
    const body = C.hud.modal({ title:T.name, cls:'fp-scratchm', onClose:()=>{ open = false; if(!tk.done) settle(tk, true); }, html:`
      ${tk.misprint ? '<p style="text-align:center;color:#b8a88a;font-style:italic">that isn\'t the ticket you picked.</p>' : ''}
      <div class="fp-ticket"><canvas width="${W}" height="${H}" class="t-base"></canvas><canvas width="${W}" height="${H}" class="t-foil"></canvas></div>
      <div class="fp-row" id="sc-msg" style="justify-content:center;min-height:24px">${C.input.touch ? 'scratch with your finger' : 'click and drag to scratch'}</div>
      <div class="fp-row" style="justify-content:center"><button data-a="all">SCRATCH ALL</button><button data-a="again" class="fp-gold" disabled>ANOTHER · ${fm(tk.orig.price)}</button><button data-a="back">BACK</button></div>` });
    const base = body.querySelector('.t-base').getContext('2d'), foilC = body.querySelector('.t-foil'), foil = foilC.getContext('2d');
    paintTicket(base, tk); paintFoil(foil, tk);
    /* coverage tracking: a little grid of sample points per zone */
    tk.zones.forEach(z=>{ z.pts = []; for(let j=0;j<4;j++) for(let i=0;i<6;i++) z.pts.push([z.x + (i + 0.5)*z.w/6, z.y + (j + 0.5)*z.h/4, false]); z.open = false; });
    const R_ = 22;
    let last = null, down = false, sndT = 0;
    const at = e=>{ const r = foilC.getBoundingClientRect(); return [(e.clientX - r.left)/r.width*W, (e.clientY - r.top)/r.height*H]; };
    const scrape = (a, b)=>{
      foil.globalCompositeOperation = 'destination-out'; foil.lineCap = 'round'; foil.lineWidth = R_*2;
      foil.beginPath(); foil.moveTo(a[0], a[1]); foil.lineTo(b[0], b[1]); foil.stroke();
      foil.globalCompositeOperation = 'source-over';
      for(const z of tk.zones){ if(z.open) continue; let n = 0; for(const p of z.pts){ if(!p[2] && segDist(p[0], p[1], a[0], a[1], b[0], b[1]) < R_) p[2] = true; if(p[2]) n++; } if(n/z.pts.length >= 0.45) reveal(z); }
      const now = performance.now(); if(now - sndT > 55){ sndT = now; C.audio.burst({ ff:4200 + Math.random()*2500, q:0.8, d:0.05, g:0.05 }); }
      if(Math.random() < 0.5) flakes(b);
    };
    const reveal = z=>{ z.open = true; foil.clearRect(z.x - 3, z.y - 3, z.w + 6, z.h + 6); C.audio.tone({ f:1500 + tk.zones.filter(q=>q.open).length*90, type:'sine', d:0.06, g:0.03 }); if(tk.zones.every(q=>q.open)) finish(); };
    foilC.addEventListener('pointerdown', e=>{ if(tk.done) return; down = true; last = at(e); foilC.setPointerCapture(e.pointerId); scrape(last, last); e.preventDefault(); });
    foilC.addEventListener('pointermove', e=>{ if(!down || tk.done) return; const p = at(e); scrape(last, p); last = p; });
    const up = ()=>{ down = false; last = null; };
    foilC.addEventListener('pointerup', up); foilC.addEventListener('pointercancel', up);
    /* silver dust */
    const box = body.querySelector('.fp-ticket');
    function flakes(p){ const d = document.createElement('i'); d.className = 'fp-flake'; d.style.left = (p[0]/W*100) + '%'; d.style.top = (p[1]/H*100) + '%'; d.style.setProperty('--dx', (Math.random()*30 - 15) + 'px'); box.appendChild(d); setTimeout(()=>d.remove(), 700); }
    const finish = ()=>{
      if(tk.done) return;
      tk.done = true; settle(tk, false);
      const m = body.querySelector('#sc-msg'), again = body.querySelector('[data-a="again"]');
      if(again) again.disabled = false;
      const all = body.querySelector('[data-a="all"]'); if(all) all.disabled = true;
      if(m){ m.innerHTML = tk.win > 0 ? `<b style="color:#7dff9a;font-size:18px">WINNER · ${fm(tk.win)} CHIPS</b>` : (T.kind === 'basement' ? '<b style="color:#b8a88a">nothing. it looked at you though.</b>' : pick(['not a winner.', 'nope.', 'so close. (it wasn\'t close.)', 'the house thanks you.', 'that one was a dud.'])); }
      box.classList.add(tk.win > 0 ? 'won' : 'lost');
    };
    body.querySelector('[data-a="all"]').onclick = ()=>{ if(tk.done) return; C.audio.burst({ ff:3000, ff2:7000, q:0.6, d:0.4, g:0.08 }); tk.zones.forEach(z=>{ if(!z.open){ z.open = true; foil.clearRect(z.x - 3, z.y - 3, z.w + 6, z.h + 6); } }); finish(); };
    body.querySelector('[data-a="again"]').onclick = ()=>{ if(tk.next){ const n = tk.next; tk.next = null; scratchView(n); return; } buy(tk.orig); };
    body.querySelector('[data-a="back"]').onclick = ()=>{ if(!tk.done) settle(tk, true); shop(); };
    tk.view = { finish };
  }
  /* pay out, keep score, react. "auto" means you walked away and the machine scratched it for you */
  function settle(tk, auto){
    if(tk.settled) return; tk.settled = true; tk.done = true;
    const T = tk.T;
    if(tk.win > 0){
      C.save.pay(tk.win, 'scratch offs', tk.win >= 1000 ? 'scratch offs: ' + fm(tk.win) + ' on ' + T.name.toLowerCase() : null);
      S.scratchWon += tk.win; S.scratchBest = Math.max(S.scratchBest, tk.win);
      streakLose = 0;
      const level = tk.mult >= 50 ? 3 : tk.mult >= 10 ? 2 : 1;
      C.audio.slotWin(pos, level);
      if(tk.mult >= 10){ lastBig = tk.win; flash = 6; drawDisplay(); C.fx.coins(pos.clone().setY(1), Math.min(40, 8 + tk.mult)); C.bus.emit('cheer', { pos, big:tk.mult >= 50 }); C.audio.cheer(pos, tk.mult >= 50 ? 1 : 0.5); }
      if(auto) C.hud.toast('the machine scratched it for you: ' + fm(tk.win) + ' chips', 'gold');
    } else {
      if(T.kind !== 'basement' && T.kind !== 'pity') streakLose++;
      if(auto) C.hud.toast('the machine scratched it for you. dud.');
    }
    S.scratchDuds = (tk.win > 0 ? 0 : (S.scratchDuds || 0) + 1);
    if(T.kind === 'basement'){
      if(C.save.egg('basementticket')) C.hud.toast('secret: printed downstairs', 'gold');
      try{ VENDOR.see('casino:ticket'); }catch(e){}
      C.audio.whisper && C.audio.whisper(pick(['keep scratching', 'he went home', 'count them']));
    }
    if(T.kind === 'pity' && C.save.egg('pity')) C.hud.toast('secret: pity party', 'gold');
    C.save.write();
    /* ten duds in a row: the machine has feelings */
    if(streakLose >= 10 && !auto){
      streakLose = 0;
      const pity = build(PITY, 1, 0); pity.win = Math.round(Math.max(30, (tk.paid || 10)*3)); pity.paid = 0; pity.orig = tk.orig;
      C.audio.tone({ f:660, f2:440, type:'triangle', d:0.6, g:0.05 });
      C.hud.toast('the machine makes a sad little noise and drops another ticket', 'gold');
      tk.next = pity;
      const again = C.hud.$('#fp-modal [data-a="again"]'); if(again){ again.textContent = 'TAKE THE FREE ONE'; again.disabled = false; }
    }
    C.save.emit();
  }
  return { name:'scratch', grp, update(dt_, t){
    /* the bulbs chase faster after a big win */
    const sp = flash > 0 ? 14 : 4, k = Math.floor(t*sp);
    for(let i=0;i<bulbs.length;i++){ const on = flash > 0 ? (k + i) % 2 === 0 : (k + i) % 4 === 0; const m = on ? bulbOn : bulbOff; if(bulbs[i].material !== m) bulbs[i].material = m; }
    if(flash > 0){ flash -= dt_; if(Math.floor(flash*6) !== Math.floor((flash + dt_)*6)) drawDisplay(); if(flash <= 0) drawDisplay(); }
  }, _test:{ build, roll, TICKETS, BASEMENT, buy, settle, get cur(){ return curTk; } } };
}
function segDist(px, py, ax, ay, bx, by){ const dx = bx - ax, dy = by - ay, l = dx*dx + dy*dy; let t = l ? ((px - ax)*dx + (py - ay)*dy)/l : 0; t = Math.max(0, Math.min(1, t)); const x = ax + t*dx - px, y = ay + t*dy - py; return Math.sqrt(x*x + y*y); }
