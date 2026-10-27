/* ============================================================
   FRIDGE FISHING
   buy a rod in the fridge shop, then "go fishing" shows up.
   hold to charge, let go to cast. when the bobber goes under, tap.
   then hold to lift the green bar and keep the fish inside it until
   the meter fills.
   save key: fridgefish_v1
============================================================ */
(function(){
'use strict';
const D = window.FISHDATA; if(!D) return;
const FISH = D.FISH, RAR = D.RARITY, BYID = {}; FISH.forEach(f=>BYID[f.id] = f);
const KEY = 'fridgefish_v1';

const RODS = {
  twig:       { name:'Twig Rod',            cost:100,   bar:0.26, reel:1.00, hook:1.00, luck:[1,1,1,1,1,1],          blurb:'a stick and some floss.' },
  fiberglass: { name:'Fiberglass Rod',      cost:600,   bar:0.29, reel:1.05, hook:1.10, luck:[1,1.15,1.2,1.2,1.1,1], blurb:'unlocks crisper lake.' },
  graphite:   { name:'Graphite Rod',        cost:2500,  bar:0.31, reel:1.10, hook:1.20, luck:[1,1.25,1.4,1.5,1.4,1.2], blurb:'lighter, faster, more rares.' },
  compressor: { name:'The Compressor',      cost:12000, bar:0.36, reel:1.20, hook:1.30, luck:[1,1.35,1.7,2,2,1.6],   blurb:'a rod with a motor in it. unlocks the abyssal freezer.' },
  his:        { name:'His Rod',             cost:0,     bar:0.34, reel:1.15, hook:1.40, luck:[1,1.2,1.5,1.8,2.2,2.5], blurb:'he left it by the stairs. it is warm.', needs:'together' }
};
const ROD_ORDER = ['twig','fiberglass','graphite','compressor','his'];
const BAIT = {
  none:      { name:'no bait',            cost:0,    n:0,  mult:[1,1,1,1,1,1],         speed:1.0 },
  icecube:   { name:'Ice Cubes',          cost:5,    n:10, mult:[1.5,1,0.8,0.8,0.8,0.8], speed:1.45 },
  leftovers: { name:'Leftovers',          cost:25,   n:10, mult:[1,1.8,1.3,1,1,1],     speed:1.15 },
  shrimp:    { name:'Freezer-Burnt Shrimp', cost:80, n:5,  mult:[0.7,1.2,2.2,1.5,1.2,1], speed:1.0 },
  tupper:    { name:'Mystery Tupperware', cost:300,  n:3,  mult:[0.5,1,1.6,3,2,1.5],   speed:0.9 },
  coolant:   { name:'Liquid Coolant',     cost:1500, n:3,  mult:[0.3,0.6,1.4,3,5,4],   speed:0.85 }
};
const BAIT_ORDER = ['none','icecube','leftovers','shrimp','tupper','coolant'];
const LOCS = {
  puddle:  { name:'the puddle',          needs:null,         blurb:'by the cannon. where the fridges land.' },
  crisper: { name:'crisper lake',        needs:'fiberglass', blurb:'green water, plastic shores.' },
  drain:   { name:'the basement drain',  needs:'vendor',     blurb:'it goes somewhere you have been.' },
  abyss:   { name:'the abyssal freezer', needs:'compressor', blurb:'always cold. very deep.' }
};
const LOC_ORDER = ['puddle','crisper','drain','abyss'];

/* ---------- save ---------- */
function freshSave(){ return { rods:[], rod:null, bait:{}, curBait:'none', loc:'puddle', dex:{}, cooler:[], total:0, earned:0 }; }
let S = freshSave();
try{ const r = JSON.parse(localStorage.getItem(KEY) || 'null'); if(r) S = Object.assign(freshSave(), r); }catch(e){}
function save(){ try{ localStorage.setItem(KEY, JSON.stringify(S)); }catch(e){} }
function bank(){ return window.FRIDGE_BANK || { count:()=>0, spend:()=>false, give:()=>{} }; }

/* ---------- world conditions ---------- */
function vmem(){ try{ return window.VENDOR ? VENDOR.loadMem() : {}; }catch(e){ return {}; } }
function hash(n){ n = (n ^ 61) ^ (n >>> 16); n = n + (n << 3); n = n ^ (n >>> 4); n = Math.imul(n, 0x27d4eb2d); n = n ^ (n >>> 15); return (n >>> 0)/4294967296; }
function weather(){
  const d = new Date(), blk = Math.floor(Date.now()/600000), r = hash(blk*7919 + 13), mo = d.getMonth();
  const winter = mo >= 10 || mo <= 2;
  if(r < 0.35) return 'clear'; if(r < 0.55) return 'cloudy'; if(r < 0.73) return 'rain'; if(r < 0.83) return 'fog'; if(r < 0.90) return 'storm';
  return winter ? 'snow' : 'clear';
}
function moonPhase(){ const syn = 29.530588853, ref = Date.UTC(2000, 0, 6, 18, 14); let p = ((Date.now() - ref)/864e5 % syn)/syn; if(p < 0) p += 1; return p; }
function moonName(p){ return p < 0.03 || p > 0.97 ? 'new moon' : p < 0.22 ? 'waxing crescent' : p < 0.28 ? 'first quarter' : p < 0.47 ? 'waxing gibbous' : p < 0.53 ? 'full moon' : p < 0.72 ? 'waning gibbous' : p < 0.78 ? 'last quarter' : 'waning crescent'; }
function hourBand(h){ return (h >= 20 || h < 5) ? 'night' : h < 8 ? 'dawn' : h < 17 ? 'day' : 'dusk'; }
function frdxChg(){ try{ if(!window.MKT || !MKT.state()) return 0; const b = MKT.breadth(); return (b.idx/b.idxPrev - 1)*100; }catch(e){ return 0; } }
const COND = {
  night:()=>hourBand(new Date().getHours()) === 'night', day:()=>hourBand(new Date().getHours()) === 'day',
  dawn:()=>hourBand(new Date().getHours()) === 'dawn', dusk:()=>hourBand(new Date().getHours()) === 'dusk',
  rain:()=>{ const w = weather(); return w === 'rain' || w === 'storm'; }, snow:()=>weather() === 'snow', fog:()=>weather() === 'fog', storm:()=>weather() === 'storm', clear:()=>weather() === 'clear',
  cold:()=>{ const m = new Date().getMonth(); return S.loc === 'abyss' || weather() === 'snow' || m >= 10 || m <= 1; },
  fullmoon:()=>{ const p = moonPhase(); return p > 0.47 && p < 0.53; },
  '420':()=>{ const d = new Date(); return (d.getHours() === 16 || d.getHours() === 4) && d.getMinutes() >= 20 && d.getMinutes() < 30; },
  m38:()=>new Date().getMinutes() === 38,
  vendor:()=>(vmem().deaths || 0) >= 1, together:()=>vmem().relationship === 'together', unplug:()=>!!vmem().unplugged,
  hank:()=>{ try{ return VENDOR.sawAny(['wall:hank','tag:26']); }catch(e){ return false; } },
  rth:()=>{ try{ return MKT.session().name === 'RTH'; }catch(e){ return false; } },
  bull:()=>frdxChg() >= 1.2, bear:()=>frdxChg() <= -1.2,
  weekend:()=>{ const d = new Date().getDay(); return d === 0 || d === 6; },
  deep:()=>G.power >= 0.85
};
function condOK(f){ return !f.cond || f.cond.every(k=>COND[k] && COND[k]()); }
function locOK(k){ const n = LOCS[k].needs; if(!n) return true; if(n === 'vendor') return COND.vendor(); const tier = ROD_ORDER.indexOf(n); return S.rods.some(r=>ROD_ORDER.indexOf(r) >= tier); }

/* ---------- fish art ---------- */
const SHAPES = { mini:[0.5,0.5,0.18], round:[0.52,0.56,0.45], wide:[0.68,0.5,0.14], tall:[0.44,0.72,0.12], eel:[0.86,0.22,0.5], flat:[0.64,0.34,0.25],
  chest:[0.7,0.42,0.1], long:[0.8,0.32,0.3], sxs:[0.56,0.64,0.1], retro:[0.5,0.7,0.35] };
function rr(c,x,y,w,h,r){ r = Math.min(r, w/2, h/2); c.beginPath(); c.moveTo(x+r,y); c.arcTo(x+w,y,x+w,y+h,r); c.arcTo(x+w,y+h,x,y+h,r); c.arcTo(x,y+h,x,y,r); c.arcTo(x,y,x+w,y,r); c.closePath(); }
function paintFish(c, f, W, H, sil){
  const a = f.art, sh = SHAPES[a.shape] || SHAPES.tall;
  const bw = W*sh[0], bh = H*sh[1], bx = W*0.56 - bw/2 + W*0.06, by = H/2 - bh/2, rad = Math.min(bw, bh)*sh[2];
  const col = k=>sil ? '#151515' : a[k];
  c.save();
  if(a.glow && !sil){ const g = c.createRadialGradient(bx + bw/2, H/2, 2, bx + bw/2, H/2, Math.max(bw, bh)); g.addColorStop(0, a.glow); g.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = g; c.fillRect(0, 0, W, H); }
  /* tail */
  c.fillStyle = col('fin');
  c.beginPath(); c.moveTo(bx + 2, H/2); c.lineTo(bx - W*0.16, H/2 - bh*0.42); c.lineTo(bx - W*0.11, H/2); c.lineTo(bx - W*0.16, H/2 + bh*0.42); c.closePath(); c.fill();
  /* fins */
  c.beginPath(); c.moveTo(bx + bw*0.3, by + 1); c.quadraticCurveTo(bx + bw*0.45, by - bh*0.28, bx + bw*0.66, by + 1); c.fill();
  c.beginPath(); c.moveTo(bx + bw*0.35, by + bh - 1); c.quadraticCurveTo(bx + bw*0.48, by + bh + bh*0.2, bx + bw*0.6, by + bh - 1); c.fill();
  if(a.extra === 'wings' && !sil){ c.globalAlpha = 0.8; c.beginPath(); c.moveTo(bx + bw*0.4, by + bh*0.4); c.lineTo(bx + bw*0.1, by - bh*0.5); c.lineTo(bx + bw*0.7, by + bh*0.3); c.fill(); c.globalAlpha = 1; }
  /* body */
  rr(c, bx, by, bw, bh, rad);
  c.fillStyle = col('body'); c.fill();
  if(!sil){
    c.save(); rr(c, bx, by, bw, bh, rad); c.clip();
    const sh2 = c.createLinearGradient(bx, by, bx + bw, by); sh2.addColorStop(0, 'rgba(0,0,0,0.22)'); sh2.addColorStop(0.35, 'rgba(255,255,255,0.12)'); sh2.addColorStop(1, 'rgba(0,0,0,0.18)');
    c.fillStyle = sh2; c.fillRect(bx, by, bw, bh);
    pattern(c, a, bx, by, bw, bh);
    c.restore();
    c.strokeStyle = a.trim; c.lineWidth = Math.max(1.5, W*0.012); rr(c, bx, by, bw, bh, rad); c.stroke();
    /* the fridge parts: door split, handle */
    c.strokeStyle = a.trim; c.lineWidth = Math.max(1, W*0.008);
    if(a.shape === 'sxs'){ c.beginPath(); c.moveTo(bx + bw*0.5, by + 2); c.lineTo(bx + bw*0.5, by + bh - 2); c.stroke(); }
    else if(a.shape === 'chest' || a.shape === 'flat'){ c.beginPath(); c.moveTo(bx + 3, by + bh*0.28); c.lineTo(bx + bw - 3, by + bh*0.28); c.stroke(); }
    else if(a.shape !== 'eel' && a.shape !== 'round'){ c.beginPath(); c.moveTo(bx + 3, by + bh*0.36); c.lineTo(bx + bw - 3, by + bh*0.36); c.stroke(); }
    if(a.extra === 'handle' || a.extra === 'chrome' || a.shape === 'tall' || a.shape === 'retro'){
      c.fillStyle = a.extra === 'chrome' ? '#e8e8e8' : a.trim; rr(c, bx + bw*0.12, by + bh*0.12, Math.max(2, bw*0.05), bh*0.18, 2); c.fill();
      rr(c, bx + bw*0.12, by + bh*0.46, Math.max(2, bw*0.05), bh*0.22, 2); c.fill();
    }
    extras(c, a, bx, by, bw, bh, W, H);
  }
  /* eye */
  const ex = bx + bw*0.8, ey = by + bh*(a.shape === 'eel' ? 0.4 : 0.26), er = Math.max(2.5, Math.min(bw, bh)*0.1);
  c.fillStyle = sil ? '#2a2a2a' : '#fff'; c.beginPath(); c.arc(ex, ey, er, 0, 7); c.fill();
  if(!sil){ c.fillStyle = a.eye; c.beginPath(); c.arc(ex + er*0.25, ey, er*0.55, 0, 7); c.fill(); }
  /* mouth */
  if(!sil){ c.strokeStyle = a.trim; c.lineWidth = Math.max(1, W*0.01); c.beginPath(); c.moveTo(bx + bw - 2, by + bh*0.55); c.lineTo(bx + bw - bw*0.1, by + bh*0.6); c.stroke(); }
  c.restore();
}
function pattern(c, a, x, y, w, h){
  const p = a.pat; c.save();
  if(p === 'stripes'){ c.fillStyle = 'rgba(0,0,0,0.16)'; for(let i=0;i<6;i++) c.fillRect(x + w*(0.12 + i*0.15), y, w*0.05, h); }
  else if(p === 'spots' || p === 'dimples'){ c.fillStyle = p === 'spots' ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.1)'; for(let i=0;i<9;i++){ c.beginPath(); c.arc(x + w*(0.15 + (i%3)*0.3 + (i>2&&i<6 ? 0.08 : 0)), y + h*(0.25 + Math.floor(i/3)*0.25), Math.min(w,h)*0.06, 0, 7); c.fill(); } }
  else if(p === 'frost'){ c.strokeStyle = 'rgba(255,255,255,0.6)'; c.lineWidth = 1; for(let i=0;i<14;i++){ const px = x + ((i*37)%100)/100*w, py = y + ((i*61)%100)/100*h, r = Math.min(w,h)*0.07; for(let k=0;k<3;k++){ const an = k*Math.PI/3; c.beginPath(); c.moveTo(px - Math.cos(an)*r, py - Math.sin(an)*r); c.lineTo(px + Math.cos(an)*r, py + Math.sin(an)*r); c.stroke(); } } }
  else if(p === 'rust'){ for(let i=0;i<22;i++){ c.fillStyle = `rgba(${90 + (i*13)%60},${40 + (i*7)%20},10,0.45)`; c.beginPath(); c.arc(x + ((i*53)%100)/100*w, y + ((i*29)%100)/100*h, Math.min(w,h)*(0.04 + (i%4)*0.02), 0, 7); c.fill(); } }
  else if(p === 'glow'){ const g = c.createRadialGradient(x + w/2, y + h/2, 1, x + w/2, y + h/2, Math.max(w,h)*0.6); g.addColorStop(0, 'rgba(255,255,255,0.5)'); g.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = g; c.fillRect(x, y, w, h); }
  else if(p === 'screen'){ c.fillStyle = '#071018'; rr(c, x + w*0.3, y + h*0.45, w*0.4, h*0.4, 3); c.fill(); c.fillStyle = '#6ef'; c.font = `bold ${Math.max(6, h*0.14)}px monospace`; c.fillText('72°', x + w*0.36, y + h*0.72); }
  else if(p === 'pastel'){ c.fillStyle = 'rgba(255,200,220,0.5)'; c.fillRect(x, y + h*0.62, w, h*0.38); }
  else if(p === 'brushed'){ c.strokeStyle = 'rgba(255,255,255,0.18)'; c.lineWidth = 1; for(let i=0;i<h;i+=2){ c.beginPath(); c.moveTo(x, y + i); c.lineTo(x + w, y + i + 1); c.stroke(); } }
  else if(p === 'gold'){ const g = c.createLinearGradient(x, y, x + w, y + h); g.addColorStop(0, 'rgba(255,255,255,0.5)'); g.addColorStop(0.5, 'rgba(255,255,255,0)'); g.addColorStop(0.55, 'rgba(255,255,255,0.35)'); g.addColorStop(1, 'rgba(120,70,0,0.3)'); c.fillStyle = g; c.fillRect(x, y, w, h); }
  else if(p === 'void'){ c.fillStyle = '#000'; c.fillRect(x, y, w, h); for(let i=0;i<20;i++){ c.fillStyle = `rgba(${140 + (i*17)%100},40,255,${0.2 + (i%5)*0.1})`; c.fillRect(x + ((i*41)%100)/100*w, y + ((i*67)%100)/100*h, 2, 2); } }
  else if(p === 'aurora'){ ['rgba(120,255,200,0.5)','rgba(120,160,255,0.45)','rgba(255,120,220,0.35)'].forEach((col,i)=>{ c.fillStyle = col; c.beginPath(); c.moveTo(x, y + h*(0.3 + i*0.18)); for(let k=0;k<=8;k++) c.lineTo(x + w*k/8, y + h*(0.3 + i*0.18) + Math.sin(k + i*2 + performance.now()/900)*h*0.06); c.lineTo(x + w, y + h*(0.4 + i*0.18)); c.lineTo(x, y + h*(0.4 + i*0.18)); c.fill(); }); }
  else if(p === 'chart'){ c.strokeStyle = 'rgba(255,255,255,0.75)'; c.lineWidth = 1.5; c.beginPath(); const up = a.fin === '#3ddc84'; for(let k=0;k<=8;k++){ const yy = y + h*(up ? 0.8 - k*0.07 : 0.25 + k*0.07) + ((k*7)%3 - 1)*h*0.05; k ? c.lineTo(x + w*(0.08 + k*0.1), yy) : c.moveTo(x + w*0.08, yy); } c.stroke(); }
  else if(p === 'label'){ c.fillStyle = '#f4f0e0'; c.fillRect(x + w*0.3, y + h*0.5, w*0.42, h*0.22); c.fillStyle = '#333'; c.font = `${Math.max(5, h*0.12)}px monospace`; c.fillText('HANK', x + w*0.33, y + h*0.66); }
  else if(p === 'hearts'){ c.fillStyle = 'rgba(255,120,160,0.55)'; for(let i=0;i<5;i++){ const hx = x + w*(0.2 + i*0.15), hy = y + h*(0.55 + (i%2)*0.15), r = Math.min(w,h)*0.05; c.beginPath(); c.arc(hx - r/2, hy, r/1.6, 0, 7); c.arc(hx + r/2, hy, r/1.6, 0, 7); c.moveTo(hx - r, hy + r*0.2); c.lineTo(hx, hy + r*1.3); c.lineTo(hx + r, hy + r*0.2); c.fill(); } }
  else if(p === 'dents'){ c.fillStyle = 'rgba(0,0,0,0.18)'; for(let i=0;i<5;i++){ c.beginPath(); c.ellipse(x + w*(0.2 + i*0.16), y + h*(0.3 + (i%2)*0.35), w*0.06, h*0.08, i, 0, 7); c.fill(); } }
  else if(p === 'static'){ for(let i=0;i<220;i++){ const v = (i*97)%255; c.fillStyle = `rgba(${v},${v},${v},0.5)`; c.fillRect(x + ((i*31)%100)/100*w, y + ((i*57)%100)/100*h, 2, 2); } }
  c.restore();
}
function extras(c, a, x, y, w, h, W, H){
  const e = a.extra; if(!e) return;
  c.save(); c.lineWidth = Math.max(1, W*0.01);
  if(e === 'magnets'){ ['#e33','#3a3','#33e','#fc0'].forEach((col,i)=>{ c.fillStyle = col; c.fillRect(x + w*(0.2 + i*0.15), y + h*(0.5 + (i%2)*0.15), w*0.1, h*0.12); }); }
  else if(e === 'label'){ c.fillStyle = '#ffec5c'; c.fillRect(x + w*0.35, y + h*0.45, w*0.3, h*0.25); }
  else if(e === 'antenna' || e === 'lure'){ c.strokeStyle = a.trim; c.beginPath(); c.moveTo(x + w*0.8, y); c.quadraticCurveTo(x + w*1.1, y - h*0.5, x + w*1.15, y - h*0.1); c.stroke(); c.fillStyle = a.glow ? '#dff' : '#ffc'; c.beginPath(); c.arc(x + w*1.15, y - h*0.1, Math.max(3, h*0.08), 0, 7); c.fill(); }
  else if(e === 'whiskers'){ c.strokeStyle = a.trim; for(let k=-1;k<=1;k+=2){ c.beginPath(); c.moveTo(x + w, y + h*0.58); c.quadraticCurveTo(x + w*1.15, y + h*(0.58 + k*0.2), x + w*1.25, y + h*(0.62 + k*0.35)); c.stroke(); } }
  else if(e === 'dispenser'){ c.fillStyle = '#556'; rr(c, x + w*0.35, y + h*0.45, w*0.3, h*0.3, 3); c.fill(); c.fillStyle = '#9cf'; c.fillRect(x + w*0.47, y + h*0.62, w*0.06, h*0.1); }
  else if(e === 'dial'){ c.fillStyle = '#eee'; c.beginPath(); c.arc(x + w*0.4, y + h*0.6, Math.min(w,h)*0.12, 0, 7); c.fill(); c.strokeStyle = '#333'; c.beginPath(); c.moveTo(x + w*0.4, y + h*0.6); c.lineTo(x + w*0.45, y + h*0.52); c.stroke(); }
  else if(e === 'teeth'){ c.fillStyle = '#fff'; for(let i=0;i<4;i++){ c.beginPath(); c.moveTo(x + w*(0.82 + i*0.04), y + h*0.55); c.lineTo(x + w*(0.84 + i*0.04), y + h*0.68); c.lineTo(x + w*(0.86 + i*0.04), y + h*0.55); c.fill(); } }
  else if(e === 'sword'){ c.fillStyle = a.trim === '#0e151d' ? '#9ab' : a.fin; c.beginPath(); c.moveTo(x + w - 2, y + h*0.45); c.lineTo(x + w + W*0.18, y + h*0.52); c.lineTo(x + w - 2, y + h*0.6); c.fill(); }
  else if(e === 'glass'){ c.fillStyle = 'rgba(200,230,255,0.25)'; rr(c, x + w*0.22, y + h*0.42, w*0.56, h*0.5, 3); c.fill(); for(let i=0;i<4;i++){ c.fillStyle = '#5a0f1f'; c.fillRect(x + w*(0.27 + i*0.12), y + h*0.55, w*0.06, h*0.28); } }
  else if(e === 'chrome'){ c.fillStyle = '#e6e6e6'; c.fillRect(x + w*0.1, y + h*0.36, w*0.8, Math.max(1.5, h*0.025)); }
  else if(e === 'star'){ c.fillStyle = '#fff'; c.font = `bold ${h*0.35}px sans-serif`; c.fillText('★', x + w*0.32, y + h*0.7); }
  else if(e === 'crown'){ c.fillStyle = '#ffd400'; c.beginPath(); const cx = x + w*0.55, cy = y - 2, cw = w*0.36; c.moveTo(cx - cw/2, cy); c.lineTo(cx - cw/2, cy - h*0.2); c.lineTo(cx - cw/4, cy - h*0.08); c.lineTo(cx, cy - h*0.26); c.lineTo(cx + cw/4, cy - h*0.08); c.lineTo(cx + cw/2, cy - h*0.2); c.lineTo(cx + cw/2, cy); c.fill(); }
  else if(e === 'smoke'){ c.strokeStyle = 'rgba(220,220,220,0.6)'; c.beginPath(); c.moveTo(x + w*1.0, y + h*0.6); c.bezierCurveTo(x + w*1.15, y + h*0.2, x + w*1.0, y - h*0.1, x + w*1.2, y - h*0.4); c.stroke(); }
  else if(e === 'horns'){ c.fillStyle = '#eee'; [0.55, 0.8].forEach(px=>{ c.beginPath(); c.moveTo(x + w*px, y + 2); c.quadraticCurveTo(x + w*(px + 0.1), y - h*0.3, x + w*(px + 0.15), y - h*0.25); c.lineTo(x + w*(px + 0.06), y + 2); c.fill(); }); }
  else if(e === 'ears'){ c.fillStyle = a.trim; [0.55, 0.78].forEach(px=>{ c.beginPath(); c.arc(x + w*px, y + 1, Math.min(w,h)*0.1, Math.PI, 0); c.fill(); }); }
  else if(e === 'cap'){ c.fillStyle = '#2d4f8a'; c.beginPath(); c.arc(x + w*0.62, y + 2, w*0.18, Math.PI, 0); c.fill(); c.fillRect(x + w*0.62, y - 1, w*0.32, h*0.06); }
  else if(e === 'coil'){ c.strokeStyle = '#555'; c.lineWidth = 2; for(let i=0;i<4;i++){ c.beginPath(); c.ellipse(x + w*0.5, y - h*(0.04 + i*0.05), w*0.25, h*0.03, 0, 0, 7); c.stroke(); } }
  c.restore();
}
const artCache = {};
function fishImg(f, W, H, sil){
  const k = f.id + W + 'x' + H + (sil ? 's' : '');
  if(artCache[k]) return artCache[k];
  const cv = document.createElement('canvas'), dpr = Math.min(2, window.devicePixelRatio || 1);
  cv.width = W*dpr; cv.height = H*dpr; const c = cv.getContext('2d'); c.scale(dpr, dpr);
  paintFish(c, f, W, H, sil);
  artCache[k] = cv; return cv;
}

/* ---------- audio ---------- */
function ac(){ try{ if(typeof ensureAudioContext === 'function') ensureAudioContext(); const c = (typeof audioCtx !== 'undefined') ? audioCtx : null; if(c && c.state === 'suspended') c.resume(); return c; }catch(e){ return null; } }
function noiseBuf(c){ if(noiseBuf.b) return noiseBuf.b; const b = c.createBuffer(1, c.sampleRate, c.sampleRate), d = b.getChannelData(0); for(let i=0;i<d.length;i++) d[i] = Math.random()*2 - 1; return noiseBuf.b = b; }
const SND = {
  whoosh(){ const c = ac(); if(!c) return; const t = c.currentTime, s = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain(); s.buffer = noiseBuf(c); f.type = 'bandpass'; f.Q.value = 2; f.frequency.setValueAtTime(400, t); f.frequency.exponentialRampToValueAtTime(2400, t + 0.25); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.25, t + 0.06); g.gain.exponentialRampToValueAtTime(0.001, t + 0.35); s.connect(f); f.connect(g); g.connect(c.destination); s.start(t); s.stop(t + 0.4); },
  plop(v){ const c = ac(); if(!c) return; v = v || 1; const t = c.currentTime, o = c.createOscillator(), g = c.createGain(); o.type = 'sine'; o.frequency.setValueAtTime(900, t); o.frequency.exponentialRampToValueAtTime(140, t + 0.12); g.gain.setValueAtTime(0.3*v, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.18); o.connect(g); g.connect(c.destination); o.start(t); o.stop(t + 0.2);
    const s = c.createBufferSource(), f = c.createBiquadFilter(), g2 = c.createGain(); s.buffer = noiseBuf(c); f.type = 'lowpass'; f.frequency.value = 1400; g2.gain.setValueAtTime(0.18*v, t); g2.gain.exponentialRampToValueAtTime(0.001, t + 0.3); s.connect(f); f.connect(g2); g2.connect(c.destination); s.start(t); s.stop(t + 0.3); },
  tick(){ const c = ac(); if(!c) return; const t = c.currentTime, o = c.createOscillator(), g = c.createGain(); o.type = 'square'; o.frequency.value = 2200 + Math.random()*300; g.gain.setValueAtTime(0.04, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.025); o.connect(g); g.connect(c.destination); o.start(t); o.stop(t + 0.03); },
  bite(){ SND.plop(1.6); const c = ac(); if(!c) return; const t = c.currentTime, o = c.createOscillator(), g = c.createGain(); o.type = 'triangle'; o.frequency.setValueAtTime(1320, t); o.frequency.setValueAtTime(1760, t + 0.07); g.gain.setValueAtTime(0.14, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.22); o.connect(g); g.connect(c.destination); o.start(t); o.stop(t + 0.25); },
  win(r){ const c = ac(); if(!c) return; const t = c.currentTime, notes = [523, 659, 784, 1047, 1319, 1568].slice(0, 3 + Math.min(3, r)); notes.forEach((n,i)=>{ const o = c.createOscillator(), g = c.createGain(); o.type = r >= 4 ? 'sawtooth' : 'triangle'; o.frequency.value = n; g.gain.setValueAtTime(0, t + i*0.09); g.gain.linearRampToValueAtTime(0.12, t + i*0.09 + 0.01); g.gain.exponentialRampToValueAtTime(0.001, t + i*0.09 + 0.4); const f = c.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 3000; o.connect(f); f.connect(g); g.connect(c.destination); o.start(t + i*0.09); o.stop(t + i*0.09 + 0.45); }); },
  snap(){ const c = ac(); if(!c) return; const t = c.currentTime, s = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain(); s.buffer = noiseBuf(c); f.type = 'highpass'; f.frequency.value = 2500; g.gain.setValueAtTime(0.35, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.08); s.connect(f); f.connect(g); g.connect(c.destination); s.start(t); s.stop(t + 0.1);
    const o = c.createOscillator(), g2 = c.createGain(); o.type = 'sine'; o.frequency.setValueAtTime(300, t); o.frequency.exponentialRampToValueAtTime(60, t + 0.4); g2.gain.setValueAtTime(0.2, t); g2.gain.exponentialRampToValueAtTime(0.001, t + 0.45); o.connect(g2); g2.connect(c.destination); o.start(t); o.stop(t + 0.5); },
  coin(){ const c = ac(); if(!c) return; const t = c.currentTime; [988, 1319].forEach((n,i)=>{ const o = c.createOscillator(), g = c.createGain(); o.type = 'square'; o.frequency.value = n; g.gain.setValueAtTime(0.06, t + i*0.07); g.gain.exponentialRampToValueAtTime(0.001, t + i*0.07 + 0.2); o.connect(g); g.connect(c.destination); o.start(t + i*0.07); o.stop(t + i*0.07 + 0.22); }); }
};

/* ---------- game state ---------- */
const G = { state:'idle', power:0, pdir:1, bob:{ x:0, y:0, tx:0, ty:0, t:0 }, fish:null, biteAt:0, nibbles:[], winEnd:0, msg:'', msgT:0,
  reel:null, hold:false, t:0, last:0, card:null, shake:0, flash:0, rain:[], snow:[], parts:[] };
let root = null, cv = null, ctx = null, W = 0, H = 0, raf = 0, opened = false, prevActive = false, tab = 'fish';

function rodObj(){ return RODS[S.rod] || RODS.twig; }
function pickFish(){
  const rod = rodObj(), bait = BAIT[S.curBait] || BAIT.none;
  const pool = FISH.filter(f=>f.loc.indexOf(S.loc) >= 0 && condOK(f));
  let tot = 0; const w = pool.map(f=>{ const v = RAR[f.rar].w*bait.mult[f.rar]*rod.luck[f.rar]*(f.cond ? 1.6 : 1); tot += v; return v; });
  let r = Math.random()*tot;
  for(let i=0;i<pool.length;i++){ if((r -= w[i]) <= 0) return pool[i]; }
  return pool[0] || FISH[0];
}
function say(t, dur){ G.msg = t; G.msgT = G.t + (dur || 2.2); }

/* ---------- state machine ---------- */
function press(){
  ac();
  G.hold = true;
  if(G.card) return;
  if(G.state === 'idle'){
    if(!S.rod){ say('you need a rod. the fridge shop has one.'); return; }
    if(S.curBait !== 'none' && !(S.bait[S.curBait] > 0)){ S.curBait = 'none'; renderHud(); }
    G.state = 'charge'; G.power = 0; G.pdir = 1;
  } else if(G.state === 'wait'){
    G.state = 'idle'; say('too early. it saw you.'); SND.plop(0.5); G.fish = null;
  } else if(G.state === 'bite'){
    startReel();
  }
}
function release(){
  G.hold = false;
  if(G.state === 'charge'){
    G.state = 'fly'; G.bob.t = 0; SND.whoosh();
    const dist = 0.15 + G.power*0.8;
    G.bob.sx = W*0.74; G.bob.sy = H*0.52;
    G.bob.tx = W*(0.5 - (Math.random() - 0.5)*0.25 - G.power*0.12); G.bob.ty = H*(0.92 - dist*0.42);
  }
}
function land(){
  G.state = 'wait'; G.bob.x = G.bob.tx; G.bob.y = G.bob.ty; SND.plop(1);
  splash(G.bob.x, G.bob.y, 10);
  G.fish = pickFish();
  const bait = BAIT[S.curBait] || BAIT.none;
  const wait = (2.2 + Math.random()*6.5)/bait.speed;
  G.biteAt = G.t + wait;
  G.nibbles = []; const nn = Math.floor(Math.random()*4); for(let i=0;i<nn;i++) G.nibbles.push(G.t + Math.random()*wait*0.9);
  G.nibbles.sort((a,b)=>a-b);
  say(G.power >= 0.85 ? 'a long cast. deep water.' : 'wait for it.', 1.6);
}
function startBite(){
  G.state = 'bite'; SND.bite(); splash(G.bob.x, G.bob.y, 16);
  const f = G.fish, rod = rodObj();
  G.winEnd = G.t + Math.max(0.33, 1.0 - f.diff*0.0055)*rod.hook;
  if(S.curBait !== 'none'){ S.bait[S.curBait] = Math.max(0, (S.bait[S.curBait] || 0) - 1); if(!S.bait[S.curBait]) S.curBait = 'none'; save(); renderHud(); }
  try{ if(navigator.vibrate) navigator.vibrate(60); }catch(e){}
}
function startReel(){
  const f = G.fish, rod = rodObj();
  G.state = 'reel';
  const barH = rod.bar*(f.beh === 'heavy' ? 0.9 : 1);
  G.reel = { bar:Math.max(0, 0.3 - barH/2), bv:0, fy:0.3, fv:0, ft:0.5, prog:0.3, barH, next:G.t + 0.6, blink:0, perfect:true };
  say('hold to lift the bar. keep it on the fish.', 2.5);
}
function reelStep(dt){
  const R = G.reel, f = G.fish, rod = rodObj();
  const heavy = f.beh === 'heavy';
  const vendorCalm = S.rod === 'his' && f.beh === 'glitch' ? 0.6 : 1;
  /* the bar */
  if(G.hold) R.bv += 2.6*dt*rod.reel*(heavy ? 0.72 : 1); else R.bv -= 1.9*dt;
  R.bv *= Math.pow(0.2, dt);
  R.bv = Math.max(-1.3, Math.min(1.3, R.bv));
  R.bar += R.bv*dt;
  if(R.bar < 0){ R.bar = 0; R.bv = -R.bv*0.35; }
  if(R.bar > 1 - R.barH){ R.bar = 1 - R.barH; R.bv = 0; }
  /* the fish */
  let beh = f.beh; if(beh === 'mixed'){ if(!R.mb || G.t > R.mbT){ R.mb = ['smooth','dart','sinker','floater'][(Math.random()*4)|0]; R.mbT = G.t + 1.5 + Math.random()*2; } beh = R.mb; }
  const d = f.diff*vendorCalm;
  let rate = (0.5 + d/35)*(beh === 'dart' ? 1.2 : beh === 'heavy' ? 0.6 : 1);
  if(G.t > R.next){
    R.next = G.t + (0.25 + Math.random()*1.2)/rate;
    const rnd = Math.random();
    if(beh === 'sinker') R.ft = Math.pow(rnd, 1.7)*0.9 + 0.03;
    else if(beh === 'floater') R.ft = 0.97 - Math.pow(rnd, 1.7)*0.9;
    else if(beh === 'dart') R.ft = Math.max(0.03, Math.min(0.97, R.fy + (rnd - 0.5)*(0.5 + d/110)));
    else R.ft = Math.max(0.03, Math.min(0.97, R.fy + (rnd - 0.5)*(0.3 + d/120)));
    if(beh === 'glitch' && Math.random() < 0.1 + d/700){ R.fy = Math.random()*0.9 + 0.05; R.fv = 0; R.blink = 0.25; }
  }
  const k = (beh === 'heavy' ? 4 + d/14 : 6 + d/7)*0.8*vendorCalm;
  R.fv += (R.ft - R.fy)*k*dt; R.fv *= Math.pow(beh === 'dart' ? 0.02 : 0.08, dt);
  R.fy += R.fv*dt + (Math.random() - 0.5)*d*0.00035;
  R.fy = Math.max(0.02, Math.min(0.98, R.fy));
  if(R.blink > 0) R.blink -= dt;
  /* the meter */
  const inside = R.fy >= R.bar && R.fy <= R.bar + R.barH;
  R.inside = inside;
  if(inside) R.prog += dt*0.32*rod.reel*(1 - d/320);
  else { R.prog -= dt*(0.15 + d/450); R.perfect = false; }
  if(inside && Math.random() < dt*12) SND.tick();
  G.shake = inside ? 0 : 2 + d/30;
  if(R.prog >= 1) caught();
  else if(R.prog <= 0) lost();
}
function caught(){
  const f = G.fish, perfect = G.reel.perfect; G._perfect = perfect;
  const size = +(f.size[0] + (f.size[1] - f.size[0])*Math.pow(Math.random(), 1.6)*(perfect ? 1.15 : 1)).toFixed(1);
  const sz = Math.min(f.size[1]*1.08, size);
  const avg = (f.size[0] + f.size[1])/2 || 1;
  const val = Math.max(1, Math.round(f.val*Math.pow(Math.max(0.3, sz/avg), 1.25)*(perfect ? 1.5 : 1)));
  const dex = S.dex[f.id] || (S.dex[f.id] = { n:0, best:0, first:Date.now() });
  const isNew = dex.n === 0;
  dex.n++; dex.best = Math.max(dex.best, sz); S.total++;
  G.state = 'idle'; G.reel = null; G.shake = 0; G.flash = 1;
  G.card = { f, size:sz, val, isNew, perfect };
  SND.win(f.rar);
  try{ if(window.MKT && MKT.fishEvent) MKT.fishEvent(f.rar, val); }catch(e){}
  try{ if(window.VENDOR && f.id === 'vendor_catfish') VENDOR.see('fish:vendor'); if(window.VENDOR && f.id === 'hank') VENDOR.see('fish:hank'); }catch(e){}
  save(); showCard();
}
function lost(){ G.state = 'idle'; G.reel = null; G.shake = 0; SND.snap(); say(G.fish.rar >= 3 ? 'it snapped the line. you saw it for a second.' : 'it got away.', 2.4); G.fish = null; }

function splash(x, y, n){ for(let i=0;i<n;i++) G.parts.push({ x, y, vx:(Math.random() - 0.5)*120, vy:-60 - Math.random()*120, life:0.6 + Math.random()*0.4 }); }

/* ---------- loop ---------- */
function frame(ts){
  raf = requestAnimationFrame(frame);
  const now = ts/1000, dt = Math.min(0.05, now - (G.last || now)); G.last = now; G.t += dt;
  if(G.state === 'charge'){ G.power += G.pdir*dt*0.9; if(G.power > 1){ G.power = 1; G.pdir = -1; } if(G.power < 0){ G.power = 0; G.pdir = 1; } }
  else if(G.state === 'fly'){ G.bob.t += dt*1.6; const k = Math.min(1, G.bob.t); G.bob.x = G.bob.sx + (G.bob.tx - G.bob.sx)*k; G.bob.y = G.bob.sy + (G.bob.ty - G.bob.sy)*k - Math.sin(k*Math.PI)*H*0.25; if(k >= 1) land(); }
  else if(G.state === 'wait'){ if(G.nibbles.length && G.t > G.nibbles[0]){ G.nibbles.shift(); G.nib = 0.25; SND.plop(0.25); } if(G.t > G.biteAt) startBite(); }
  else if(G.state === 'bite'){ if(G.t > G.winEnd){ G.state = 'idle'; say('too slow. it spat the hook.'); G.fish = null; } }
  else if(G.state === 'reel'){ reelStep(dt); if(G.reel) G._perfect = G.reel.perfect; }
  if(G.nib > 0) G.nib -= dt;
  if(G.flash > 0) G.flash -= dt*1.5;
  draw(dt);
}

/* ---------- drawing ---------- */
/* the top bar wraps onto two or three rows on a narrow phone; start the panel under it */
function fitPanel(){ if(!root) return; const hud = root.querySelector('#fs-hud'), p = root.querySelector('#fs-panel'); if(!hud || !p) return; const b = hud.getBoundingClientRect().bottom; p.style.top = Math.max(56, Math.round(b + 6)) + 'px'; }
function resize(){ fitPanel(); const dpr = Math.min(2, window.devicePixelRatio || 1); W = window.innerWidth; H = window.innerHeight; cv.width = W*dpr; cv.height = H*dpr; cv.style.width = W + 'px'; cv.style.height = H + 'px'; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
const PAL = {
  puddle:  { sky:['#0b1220','#1b2a40'], day:['#6fa3d8','#cfe3f5'], water:['#1a2633','#0a0f16'], shore:'#0d1117', tint:'rgba(120,150,200,0.08)' },
  crisper: { sky:['#08140d','#163024'], day:['#8fcfb0','#e2f4ea'], water:['#1d3a2c','#0a1710'], shore:'#0b1a12', tint:'rgba(120,255,170,0.08)' },
  drain:   { sky:['#120808','#2a1212'], day:['#3a2222','#5a3a3a'], water:['#1f1414','#0b0606'], shore:'#0e0909', tint:'rgba(255,60,40,0.07)' },
  abyss:   { sky:['#02060f','#0a1830'], day:['#0d2440','#2b4f7a'], water:['#06142a','#01040a'], shore:'#02060c', tint:'rgba(120,200,255,0.08)' }
};
function draw(dt){
  const c = ctx, P = PAL[S.loc], hr = new Date().getHours() + new Date().getMinutes()/60;
  const dayAmt = S.loc === 'drain' || S.loc === 'abyss' ? 0 : Math.max(0, Math.min(1, Math.sin((hr - 6)/12*Math.PI)*1.6));
  const hz = H*0.42, wx = weather();
  c.save();
  if(G.shake) c.translate((Math.random() - 0.5)*G.shake, (Math.random() - 0.5)*G.shake);
  /* sky */
  const sg = c.createLinearGradient(0, 0, 0, hz);
  sg.addColorStop(0, mix(P.sky[0], P.day[0], dayAmt)); sg.addColorStop(1, mix(P.sky[1], P.day[1], dayAmt));
  c.fillStyle = sg; c.fillRect(-10, -10, W + 20, hz + 10);
  if(dayAmt < 0.5 && S.loc !== 'drain' && S.loc !== 'abyss'){ c.fillStyle = 'rgba(255,255,255,' + (0.7 - dayAmt) + ')'; for(let i=0;i<70;i++){ const x = (hash(i*31)*W), y = hash(i*17 + 5)*hz*0.9; c.fillRect(x, y, 1.2, 1.2); } }
  /* moon */
  const mp = moonPhase(), mx = W*0.2, my = hz*0.32, mr = Math.min(W, H)*0.045;
  if(S.loc !== 'drain' && S.loc !== 'abyss'){
    c.fillStyle = dayAmt > 0.5 ? 'rgba(255,255,240,0.35)' : '#f4f1d8'; c.beginPath(); c.arc(mx, my, mr, 0, 7); c.fill();
    const off = (mp < 0.5 ? 1 - mp*4 : -(mp - 0.5)*4 + 1)*mr*2; c.fillStyle = sg; c.beginPath(); c.arc(mx - off, my, mr*1.04, 0, 7); c.fill();
  }
  /* far shore: a skyline of fridges */
  c.fillStyle = P.shore;
  if(S.loc === 'abyss'){ c.fillStyle = 'rgba(190,230,255,0.18)'; for(let i=0;i<40;i++){ const x = i*W/39, len = hz*(0.1 + hash(i*11)*0.35); c.beginPath(); c.moveTo(x - 12, 0); c.lineTo(x + 12, 0); c.lineTo(x + (hash(i)*6 - 3), len); c.fill(); } c.fillStyle = 'rgba(200,240,255,0.12)'; c.fillRect(0, hz - 26, W, 26); }
  else for(let i=0;i<26;i++){ const fw = W*(0.025 + hash(i*13)*0.03), fh = hz*(0.08 + hash(i*7)*0.22), fx = i*W/24 - 10; c.fillRect(fx, hz - fh, fw, fh); c.fillStyle = 'rgba(255,220,140,' + (dayAmt < 0.5 && hash(i*3) < 0.4 ? 0.35 : 0) + ')'; c.fillRect(fx + fw*0.75, hz - fh*0.7, 2, fh*0.2); c.fillStyle = P.shore; }
  if(S.loc === 'drain'){ c.fillStyle = '#1a1010'; c.fillRect(0, 0, W, hz); for(let y=0;y<hz;y+=28) for(let x=(y/28)%2*30;x<W;x+=60){ c.strokeStyle = 'rgba(0,0,0,0.5)'; c.strokeRect(x, y, 60, 28); } const bx = W*0.62, by = hz*0.25; c.fillStyle = '#ff3a2a'; c.beginPath(); c.arc(bx, by, 6, 0, 7); c.fill(); const g = c.createRadialGradient(bx, by, 2, bx, by, W*0.35); g.addColorStop(0, 'rgba(255,60,30,0.3)'); g.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = g; c.fillRect(0, 0, W, H); }
  if(S.loc === 'puddle'){ const lx = W*0.1; c.fillStyle = '#111'; c.fillRect(lx, hz*0.25, 4, hz*0.75); c.fillRect(lx, hz*0.25, 30, 4); c.fillStyle = '#ffd98a'; c.fillRect(lx + 22, hz*0.25 + 4, 10, 4); if(dayAmt < 0.6){ const g = c.createRadialGradient(lx + 27, hz*0.28, 4, lx + 27, hz*0.28, H*0.5); g.addColorStop(0, 'rgba(255,210,120,0.22)'); g.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = g; c.fillRect(0, 0, W, H); } }
  /* water */
  const wg = c.createLinearGradient(0, hz, 0, H); wg.addColorStop(0, mix(P.water[0], P.day[0], dayAmt*0.4)); wg.addColorStop(1, P.water[1]);
  c.fillStyle = wg; c.fillRect(-10, hz, W + 20, H - hz + 10);
  c.strokeStyle = 'rgba(255,255,255,0.06)'; c.lineWidth = 1;
  for(let i=0;i<40;i++){ const y = hz + Math.pow(i/40, 1.6)*(H - hz), off = Math.sin(G.t*0.8 + i)*20, len = 30 + (i/40)*120; for(let x = (i*53)%140 - 140; x < W; x += 180 + i*3){ c.beginPath(); c.moveTo(x + off, y); c.lineTo(x + off + len, y); c.stroke(); } }
  if(S.loc !== 'drain' && S.loc !== 'abyss'){ c.fillStyle = 'rgba(255,250,220,' + (dayAmt > 0.5 ? 0.04 : 0.1) + ')'; for(let i=0;i<14;i++){ const y = hz + i*(H - hz)/14, w = mr*(1 + i*0.3)*(0.6 + 0.4*Math.sin(G.t*2 + i)); c.fillRect(mx - w, y, w*2, 2); } }
  if(S.loc === 'crisper'){ c.fillStyle = 'rgba(200,255,220,0.07)'; c.fillRect(0, H*0.9, W, H*0.1); c.strokeStyle = 'rgba(200,255,220,0.25)'; c.lineWidth = 3; c.beginPath(); c.moveTo(0, H*0.9); c.lineTo(W, H*0.9); c.stroke(); }
  if(S.loc === 'abyss'){ c.fillStyle = 'rgba(200,240,255,0.14)'; c.beginPath(); c.moveTo(0, hz); c.lineTo(W*0.18, hz); c.lineTo(W*0.1, hz + 30); c.lineTo(0, hz + 50); c.fill(); c.beginPath(); c.moveTo(W, hz); c.lineTo(W*0.8, hz); c.lineTo(W*0.9, hz + 40); c.lineTo(W, hz + 30); c.fill(); for(let i=0;i<30;i++){ c.fillStyle = 'rgba(160,220,255,' + (0.2 + 0.2*Math.sin(G.t + i)) + ')'; c.fillRect(hash(i*9)*W, hz + ((hash(i*5)*(H - hz) - G.t*8*(1 + i%3)) % (H - hz) + (H - hz)) % (H - hz), 2, 2); } }
  /* fish shadow while waiting */
  if((G.state === 'wait' || G.state === 'bite') && G.fish){
    const f = G.fish, s = Math.min(1, (G.t - (G.biteAt - 8))/6), r = 14 + f.rar*7 + Math.min(30, Math.log(1 + f.size[1])*4);
    const ang = G.t*(0.6 + f.diff/120), d = G.state === 'bite' ? 0 : 40 + 30*Math.sin(G.t*0.7);
    c.fillStyle = 'rgba(0,0,0,' + (0.22*Math.max(0.2, s)) + ')'; c.beginPath(); c.ellipse(G.bob.x + Math.cos(ang)*d, G.bob.y + 6 + Math.sin(ang)*d*0.35, r, r*0.4, ang*0.2, 0, 7); c.fill();
  }
  /* rod and line */
  const tipX = W*0.74 + (G.state === 'reel' ? Math.sin(G.t*30)*3 : 0), tipY = H*0.52 + (G.state === 'charge' ? G.power*30 : 0) + (G.state === 'reel' ? (G.reel && !G.reel.inside ? 12 : 4) : 0);
  c.strokeStyle = '#2b1d10'; c.lineWidth = 7; c.lineCap = 'round'; c.beginPath(); c.moveTo(W*0.98, H*1.02); c.lineTo(tipX, tipY); c.stroke();
  c.strokeStyle = S.rod === 'compressor' ? '#7a8590' : S.rod === 'graphite' ? '#222' : S.rod === 'his' ? '#cfc8ae' : '#6b4a2a'; c.lineWidth = 4; c.beginPath(); c.moveTo(W*0.98, H*1.02); c.lineTo(tipX, tipY); c.stroke();
  c.fillStyle = '#111'; c.beginPath(); c.arc(W*0.93, H*0.94, 9, 0, 7); c.fill();
  if(G.state !== 'idle' && G.state !== 'charge'){
    let bx = G.bob.x, by = G.bob.y;
    if(G.state === 'wait') by += Math.sin(G.t*2.4)*1.5 + (G.nib > 0 ? 5 : 0);
    if(G.state === 'bite') by += 10 + Math.sin(G.t*40)*2;
    if(G.state === 'reel') { bx = G.bob.x + Math.sin(G.t*3)*20; by = G.bob.y + 8; }
    c.strokeStyle = 'rgba(230,230,230,0.6)'; c.lineWidth = 1; c.beginPath(); c.moveTo(tipX, tipY); c.quadraticCurveTo((tipX + bx)/2, Math.max(tipY, by) + (G.state === 'reel' ? 0 : 40), bx, by); c.stroke();
    if(G.state !== 'bite' && G.state !== 'reel'){ c.fillStyle = '#f2f2f2'; c.beginPath(); c.arc(bx, by, 6, 0, Math.PI); c.fill(); c.fillStyle = '#e8312a'; c.beginPath(); c.arc(bx, by, 6, Math.PI, 0); c.fill(); c.fillStyle = '#111'; c.fillRect(bx - 1, by - 11, 2, 6); }
    if(G.state === 'wait' || G.state === 'bite'){ c.strokeStyle = 'rgba(255,255,255,0.25)'; const rr2 = ((G.t*20) % 30); c.beginPath(); c.ellipse(bx, by + 4, 8 + rr2, (8 + rr2)*0.3, 0, 0, 7); c.stroke(); }
    if(G.state === 'bite'){ c.fillStyle = '#ffd400'; c.font = `bold ${Math.round(Math.min(W, H)*0.09)}px monospace`; c.textAlign = 'center'; c.fillText('!', bx, by - 26 + Math.sin(G.t*30)*3); }
  }
  /* particles */
  G.parts = G.parts.filter(p=>{ p.life -= dt; p.vy += 300*dt; p.x += p.vx*dt; p.y += p.vy*dt; c.fillStyle = 'rgba(220,240,255,' + Math.max(0, p.life) + ')'; c.fillRect(p.x, p.y, 2, 2); return p.life > 0; });
  /* weather */
  if(S.loc === 'puddle' || S.loc === 'crisper'){
    if(wx === 'rain' || wx === 'storm'){ c.strokeStyle = 'rgba(180,200,230,0.35)'; c.lineWidth = 1; for(let i=0;i<(wx === 'storm' ? 160 : 90);i++){ const x = (hash(i*7)*W + G.t*60*(1 + i%3)) % W, y = (hash(i*11)*H + G.t*700*(1 + (i%4)*0.2)) % H; c.beginPath(); c.moveTo(x, y); c.lineTo(x - 3, y + 12); c.stroke(); } if(wx === 'storm' && Math.random() < dt*0.25) G.flash = 0.7; }
    if(wx === 'snow'){ c.fillStyle = 'rgba(255,255,255,0.8)'; for(let i=0;i<120;i++){ const x = (hash(i*5)*W + Math.sin(G.t + i)*20) % W, y = (hash(i*3)*H + G.t*40*(1 + i%3)) % H; c.fillRect(x, y, 2, 2); } }
    if(wx === 'fog'){ c.fillStyle = 'rgba(180,190,200,0.28)'; c.fillRect(0, 0, W, H); }
  }
  c.fillStyle = P.tint; c.fillRect(0, 0, W, H);
  /* charge meter */
  if(G.state === 'charge'){
    const mw = Math.min(260, W*0.5), mx2 = W/2 - mw/2, my2 = H*0.78;
    c.fillStyle = 'rgba(0,0,0,0.6)'; c.fillRect(mx2 - 3, my2 - 3, mw + 6, 18);
    const g = c.createLinearGradient(mx2, 0, mx2 + mw, 0); g.addColorStop(0, '#3ddc84'); g.addColorStop(0.8, '#ffd400'); g.addColorStop(1, '#ff4a4a'); c.fillStyle = g; c.fillRect(mx2, my2, mw*G.power, 12);
    c.strokeStyle = '#fff'; c.beginPath(); c.moveTo(mx2 + mw*0.85, my2 - 3); c.lineTo(mx2 + mw*0.85, my2 + 15); c.stroke();
  }
  /* reel game */
  if(G.state === 'reel' && G.reel) drawReel(c);
  /* text */
  if(G.msg && G.t < G.msgT){ c.globalAlpha = Math.min(1, (G.msgT - G.t)*2); c.fillStyle = 'rgba(0,0,0,0.55)'; c.font = `${Math.round(Math.max(13, Math.min(18, W*0.035)))}px "Courier New", monospace`; c.textAlign = 'center'; const tw = c.measureText(G.msg).width; c.fillRect(W/2 - tw/2 - 10, H*0.2 - 18, tw + 20, 28); c.fillStyle = '#eee'; c.fillText(G.msg, W/2, H*0.2); c.globalAlpha = 1; }
  else if(G.state === 'idle' && !G.card && tab === 'fish'){ c.fillStyle = 'rgba(255,255,255,0.55)'; c.font = `${Math.round(Math.max(12, Math.min(16, W*0.03)))}px "Courier New", monospace`; c.textAlign = 'center'; c.fillText(S.rod ? 'hold to charge. let go to cast.' : 'no rod. buy one in the fridge shop.', W/2, H*0.2); }
  if(G.flash > 0){ c.fillStyle = 'rgba(255,255,255,' + Math.max(0, G.flash)*0.6 + ')'; c.fillRect(0, 0, W, H); }
  c.restore();
}
function drawReel(c){
  const R = G.reel, f = G.fish;
  const th = Math.min(H*0.62, 420), tw = Math.max(34, Math.min(46, W*0.08)), tx = W - tw - Math.max(24, W*0.06) - 20, ty = H*0.5 - th/2;
  c.fillStyle = 'rgba(0,0,0,0.65)'; rr(c, tx - 8, ty - 8, tw + 36, th + 16, 8); c.fill();
  c.fillStyle = '#0d2233'; c.fillRect(tx, ty, tw, th);
  const by = ty + th*(1 - R.bar - R.barH), bh = th*R.barH;
  c.fillStyle = R.inside ? 'rgba(80,230,130,0.7)' : 'rgba(80,230,130,0.35)'; c.fillRect(tx + 2, by, tw - 4, bh);
  c.strokeStyle = '#6dfca0'; c.lineWidth = 2; c.strokeRect(tx + 2, by, tw - 4, bh);
  const fy = ty + th*(1 - R.fy);
  if(!(R.blink > 0 && Math.floor(G.t*30) % 2)){ const hg = c.createRadialGradient(tx + tw/2, fy, 2, tx + tw/2, fy, 26); hg.addColorStop(0, 'rgba(255,255,255,0.55)'); hg.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = hg; c.fillRect(tx - 4, fy - 26, tw + 8, 52); const img = fishImg(f, 48, 30, false); c.drawImage(img, tx + tw/2 - 24, fy - 15, 48, 30); }
  /* progress */
  const px = tx + tw + 10; c.fillStyle = '#222'; c.fillRect(px, ty, 12, th);
  const pg = Math.max(0, Math.min(1, R.prog)); c.fillStyle = pg > 0.66 ? '#3ddc84' : pg > 0.33 ? '#ffd400' : '#ff4a4a'; c.fillRect(px, ty + th*(1 - pg), 12, th*pg);
  c.fillStyle = RAR[f.rar].col; c.font = '11px monospace'; c.textAlign = 'right'; c.fillText(RAR[f.rar].name.toUpperCase() + ' · ' + f.diff, tx + tw + 22, ty - 14);
}
function mix(a, b, t){ const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16); const r = ((pa >> 16) & 255)*(1 - t) + ((pb >> 16) & 255)*t, g = ((pa >> 8) & 255)*(1 - t) + ((pb >> 8) & 255)*t, bl = (pa & 255)*(1 - t) + (pb & 255)*t; return `rgb(${r|0},${g|0},${bl|0})`; }

/* ---------- DOM ---------- */
function build(){
  if(root) return;
  root = document.createElement('div'); root.id = 'fishing';
  root.innerHTML = `<canvas id="fs-cv"></canvas>
  <div id="fs-hud">
    <button id="fs-close">X</button>
    <select id="fs-loc"></select>
    <span id="fs-env"></span>
    <span class="sp"></span>
    <select id="fs-bait"></select>
    <span id="fs-rod"></span>
  </div>
  <div id="fs-panel"></div>
  <div id="fs-card"></div>
  <div id="fs-tabs"><button data-t="fish">FISH</button><button data-t="cooler">COOLER</button><button data-t="dex">FISHDEX</button><button data-t="tackle">TACKLE</button></div>`;
  document.body.appendChild(root);
  cv = root.querySelector('#fs-cv'); ctx = cv.getContext('2d');
  const down = e=>{ if(e.button !== undefined && e.button !== 0) return; e.preventDefault(); press(); };
  cv.addEventListener('pointerdown', down);
  window.addEventListener('pointerup', ()=>{ if(opened) release(); });
  window.addEventListener('pointercancel', ()=>{ if(opened) release(); });
  window.addEventListener('keydown', e=>{ if(!opened) return; if(e.code === 'Space'){ e.preventDefault(); e.stopPropagation(); if(!e.repeat) press(); } if(e.key === 'Escape') close(); }, true);
  window.addEventListener('keyup', e=>{ if(!opened) return; if(e.code === 'Space'){ e.preventDefault(); release(); } }, true);
  root.querySelector('#fs-close').onclick = close;
  root.querySelector('#fs-loc').onchange = e=>{ const k = e.target.value; if(!locOK(k)){ e.target.value = S.loc; return; } S.loc = k; save(); G.state = 'idle'; G.fish = null; say(LOCS[k].name + '. ' + LOCS[k].blurb, 2.6); };
  root.querySelector('#fs-bait').onchange = e=>{ S.curBait = e.target.value; save(); };
  root.querySelector('#fs-tabs').onclick = e=>{ const b = e.target.closest('[data-t]'); if(b) setTab(b.dataset.t); };
  root.querySelector('#fs-panel').addEventListener('click', panelClick);
  root.querySelector('#fs-card').addEventListener('click', cardClick);
  window.addEventListener('resize', ()=>{ if(opened) resize(); });
}
function renderHud(){
  if(!root) return;
  const ls = root.querySelector('#fs-loc');
  ls.innerHTML = LOC_ORDER.map(k=>`<option value="${k}" ${k === S.loc ? 'selected' : ''} ${locOK(k) ? '' : 'disabled'}>${LOCS[k].name}${locOK(k) ? '' : ' (locked)'}</option>`).join('');
  const bs = root.querySelector('#fs-bait');
  bs.innerHTML = BAIT_ORDER.filter(k=>k === 'none' || S.bait[k] > 0).map(k=>`<option value="${k}" ${k === S.curBait ? 'selected' : ''}>${BAIT[k].name}${k === 'none' ? '' : ' ×' + S.bait[k]}</option>`).join('');
  root.querySelector('#fs-rod').textContent = S.rod ? RODS[S.rod].name : 'no rod';
  const d = new Date(), w = weather();
  root.querySelector('#fs-env').textContent = String(d.getHours()).padStart(2,'0') + ':' + String(d.getMinutes()).padStart(2,'0') + ' · ' + (S.loc === 'puddle' || S.loc === 'crisper' ? w : 'indoors, ' + w + ' outside') + ' · ' + moonName(moonPhase());
}
function setTab(t){
  tab = t;
  root.querySelectorAll('#fs-tabs button').forEach(b=>b.classList.toggle('on', b.dataset.t === t));
  const p = root.querySelector('#fs-panel');
  if(t === 'fish'){ p.style.display = 'none'; return; }
  p.style.display = 'block';
  fitPanel();
  if(t === 'cooler') renderCooler(); else if(t === 'dex') renderDex(); else renderTackle();
}
function rarTag(r){ return `<span class="rt" style="color:${RAR[r].col}">${RAR[r].name}</span>`; }
function renderCooler(){
  const p = root.querySelector('#fs-panel');
  let tot = 0; S.cooler.forEach(x=>tot += x.val);
  let h = `<div class="ph"><b>COOLER</b> <span>${S.cooler.length} fish · worth ${tot.toLocaleString()}F</span>${S.cooler.length ? `<button data-a="sellall" class="k">SELL ALL</button>` : ''}</div><div class="cool">`;
  if(!S.cooler.length) h += '<div class="empty">empty. go catch something.</div>';
  S.cooler.slice().reverse().forEach((x, ri)=>{ const i = S.cooler.length - 1 - ri, f = BYID[x.id]; if(!f) return; h += `<div class="ci"><canvas data-art="${f.id}" width="96" height="60"></canvas><div><b>${f.name}</b><br>${rarTag(f.rar)} · ${x.size}cm</div><button data-a="sell" data-i="${i}">${x.val}F</button></div>`; });
  p.innerHTML = h + '</div>';
  paintArts(p);
}
function renderDex(){
  const p = root.querySelector('#fs-panel');
  const got = FISH.filter(f=>S.dex[f.id]).length;
  let h = `<div class="ph"><b>FISHDEX</b> <span>${got}/${FISH.length} · ${S.total} caught · ${(S.earned || 0).toLocaleString()}F earned</span></div><div class="dex">`;
  FISH.slice().sort((a,b)=>a.rar - b.rar).forEach(f=>{
    const d = S.dex[f.id];
    if(d) h += `<div class="dx got" title="${f.blurb.replace(/"/g, '')}"><canvas data-art="${f.id}" width="96" height="60"></canvas><b>${f.name}</b>${rarTag(f.rar)}<small>×${d.n} · best ${d.best}cm</small><p>${f.blurb}</p></div>`;
    else { const hints = (f.cond || []).map(k=>D.HINTS[k]).filter(Boolean); h += `<div class="dx"><canvas data-art="${f.id}" data-sil="1" width="96" height="60"></canvas><b>???</b>${rarTag(f.rar)}<small>${f.loc.map(l=>LOCS[l].name).join(', ')}</small><p>${hints.length ? hints.join('. ') + '.' : 'no special conditions.'}</p></div>`; }
  });
  p.innerHTML = h + '</div>';
  paintArts(p);
}
function renderTackle(){
  const p = root.querySelector('#fs-panel'), have = bank().count();
  let h = `<div class="ph"><b>TACKLE</b> <span>you have ${have.toLocaleString()}F upstairs</span></div><div class="tk"><h4>RODS</h4>`;
  ROD_ORDER.forEach(k=>{
    const r = RODS[k];
    if(r.needs === 'together' && !COND.together() && S.rods.indexOf(k) < 0) return;
    const own = S.rods.indexOf(k) >= 0, eq = S.rod === k;
    h += `<div class="ti"><div><b>${r.name}</b> <span class="dm">bar ${Math.round(r.bar*100)}% · reel ${r.reel.toFixed(2)} · hook ${r.hook.toFixed(2)}</span><br><span class="dm">${r.blurb}</span></div>` +
      (eq ? '<button disabled>EQUIPPED</button>' : own ? `<button data-a="equip" data-k="${k}">EQUIP</button>` : `<button data-a="rod" data-k="${k}" class="k">${r.cost ? r.cost.toLocaleString() + 'F' : 'TAKE IT'}</button>`) + '</div>';
  });
  h += '<h4>BAIT</h4>';
  BAIT_ORDER.slice(1).forEach(k=>{ const b = BAIT[k]; h += `<div class="ti"><div><b>${b.name}</b> <span class="dm">×${b.n} · you have ${S.bait[k] || 0}</span><br><span class="dm">${baitBlurb(k)}</span></div><button data-a="bait" data-k="${k}" class="k">${b.cost.toLocaleString()}F</button></div>`; });
  h += '<h4>WATERS</h4>';
  LOC_ORDER.forEach(k=>{ h += `<div class="ti"><div><b>${LOCS[k].name}</b><br><span class="dm">${LOCS[k].blurb}${locOK(k) ? '' : ' · locked: ' + (LOCS[k].needs === 'vendor' ? 'go downstairs first' : 'needs ' + RODS[LOCS[k].needs].name)}</span></div>${locOK(k) ? `<button data-a="goloc" data-k="${k}">${S.loc === k ? 'HERE' : 'GO'}</button>` : '<button disabled>LOCKED</button>'}</div>`; });
  p.innerHTML = h + '</div>';
}
function baitBlurb(k){ return { icecube:'fast bites. mostly commons.', leftovers:'uncommons like it.', shrimp:'rares can smell it.', tupper:'nobody knows what is in it. epics do.', coolant:'glows. the things that bite on it are not normal.' }[k] || ''; }
function paintArts(p){ p.querySelectorAll('canvas[data-art]').forEach(cv2=>{ const f = BYID[cv2.dataset.art]; if(!f) return; const c = cv2.getContext('2d'); c.clearRect(0, 0, 96, 60); paintFish(c, f, 96, 60, !!cv2.dataset.sil); }); }
function panelClick(e){
  const b = e.target.closest('[data-a]'); if(!b) return;
  const a = b.dataset.a, k = b.dataset.k;
  if(a === 'sell'){ const i = +b.dataset.i, x = S.cooler[i]; if(!x) return; S.cooler.splice(i, 1); bank().give(x.val); S.earned = (S.earned || 0) + x.val; SND.coin(); save(); renderCooler(); }
  else if(a === 'sellall'){ let t = 0; S.cooler.forEach(x=>t += x.val); S.cooler = []; bank().give(t); S.earned = (S.earned || 0) + t; SND.coin(); save(); renderCooler(); }
  else if(a === 'rod'){ buyRod(k); renderTackle(); renderHud(); }
  else if(a === 'equip'){ S.rod = k; save(); renderTackle(); renderHud(); }
  else if(a === 'bait'){ const bt = BAIT[k]; if(bank().spend(bt.cost)){ S.bait[k] = (S.bait[k] || 0) + bt.n; S.curBait = k; save(); SND.coin(); } else flashMsg('not enough fridges. ' + bt.cost + 'F.'); renderTackle(); renderHud(); }
  else if(a === 'goloc'){ S.loc = k; save(); renderHud(); setTab('fish'); say(LOCS[k].name + '. ' + LOCS[k].blurb, 2.6); }
}
function flashMsg(t){ say(t, 2.4); const p = root && root.querySelector('#fs-panel .ph span'); if(p){ p.textContent = t; p.style.color = '#ff6060'; } }
function showCard(){
  const k = G.card, f = k.f, el = root.querySelector('#fs-card');
  el.innerHTML = `<div class="cd" style="border-color:${RAR[f.rar].col};box-shadow:0 0 40px ${RAR[f.rar].col}55">
    ${k.isNew ? '<div class="new">NEW</div>' : ''}
    <canvas width="260" height="160" id="fs-cardart"></canvas>
    <h2 style="color:${RAR[f.rar].col}">${f.name}</h2>
    <div class="meta">${RAR[f.rar].name} · ${k.size}cm · difficulty ${f.diff}${G._perfect ? ' · <span style="color:#ffd400">perfect catch ×1.5</span>' : ''}</div>
    <p>${f.blurb}</p>
    <div class="btns"><button data-c="keep">KEEP</button><button data-c="sell" class="k">SELL ${k.val}F</button><button data-c="release">LET GO</button></div></div>`;
  el.style.display = 'flex';
  const c = el.querySelector('#fs-cardart').getContext('2d'); paintFish(c, f, 260, 160, false);
}
function cardClick(e){
  const b = e.target.closest('[data-c]'); if(!b || !G.card) return;
  const k = G.card;
  if(b.dataset.c === 'keep'){ S.cooler.push({ id:k.f.id, size:k.size, val:k.val }); if(S.cooler.length > 60){ const x = S.cooler.shift(); bank().give(x.val); S.earned = (S.earned||0) + x.val; } }
  else if(b.dataset.c === 'sell'){ bank().give(k.val); S.earned = (S.earned || 0) + k.val; SND.coin(); }
  else { say('it swims off. it looked back once.', 2); }
  G.card = null; root.querySelector('#fs-card').style.display = 'none'; save();
}

/* ---------- shop + open ---------- */
function buyRod(k){
  const r = RODS[k]; if(!r) return false;
  if(S.rods.indexOf(k) >= 0){ S.rod = k; save(); return true; }
  if(r.needs === 'together' && !COND.together()) return false;
  if(r.cost && !bank().spend(r.cost)){ try{ if(!opened) alert('NOT ENOUGH FRIDGES. YOU NEED ' + r.cost + '.'); else flashMsg('not enough fridges. ' + r.cost.toLocaleString() + 'F.'); }catch(e){} return false; }
  S.rods.push(k); S.rod = k; save(); SND.coin(); updateButtons();
  return true;
}
function updateButtons(){
  const sb = document.getElementById('fsShopRod');
  if(sb){ if(S.rods.length){ sb.disabled = true; sb.textContent = 'Owned'; } }
  let gb = document.getElementById('fsGoBtn');
  if(S.rods.length && !gb){
    const eco = document.getElementById('economyBox'); if(!eco) return;
    gb = document.createElement('button'); gb.id = 'fsGoBtn'; gb.textContent = 'go fishing'; gb.onclick = open;
    eco.appendChild(gb);
  }
}
function open(){
  build(); opened = true; root.classList.add('on');
  document.documentElement.classList.add('overlay-open');
  try{ prevActive = gameActive; gameActive = true; }catch(e){}
  resize(); renderHud(); setTab('fish');
  G.last = 0; cancelAnimationFrame(raf); raf = requestAnimationFrame(frame);
  clearInterval(open._h); open._h = setInterval(renderHud, 15000);
}
function close(){
  opened = false; if(root) root.classList.remove('on');
  document.documentElement.classList.remove('overlay-open');
  try{ if(!prevActive) gameActive = false; }catch(e){}
  cancelAnimationFrame(raf); clearInterval(open._h);
  G.state = 'idle'; G.reel = null; G.fish = null;
}
window.FISHING = { open, close, buyRod, paint:paintFish, save:()=>S, reset:()=>{ S = freshSave(); save(); }, _G:G, _cond:COND, _pick:pickFish, _caught:caught, RODS, BAIT, FISH };
if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', updateButtons); else updateButtons();
})();
