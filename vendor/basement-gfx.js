/* ============================================================
   THE VENDOR — textures, sprites, the thing itself
   everything is painted with canvas once at load, then pulled
   into typed arrays so the renderer only does array reads.
   no image files. nothing to 404.
============================================================ */
(function(){
'use strict';
const V = window.VENDOR;
const B = V.B;
const T = B.T, F = B.F, C = B.C;

/* seeded random, so the walls look the same every visit */
function rng(seed){ let a = seed>>>0; return function(){ a = (a + 0x6D2B79F5)>>>0; let t = a; t = Math.imul(t ^ t>>>15, t | 1); t ^= t + Math.imul(t ^ t>>>7, t | 61); return ((t ^ t>>>14)>>>0) / 4294967296; }; }
function cv(w,h){ const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
function clamp(v,a,b){ return v<a?a:(v>b?b:v); }

const HAND = '"Reenie Beanie", "Comic Sans MS", cursive';
const TYPE = '"Special Elite", "Courier New", monospace';

/* ---------- canvas -> texture ---------- */
function toTex(c){
  const s = c.width;
  const d = new Uint32Array(c.getContext('2d').getImageData(0,0,s,s).data.buffer.slice(0));
  return { s, sh: Math.log2(s)|0, m: s-1, d };
}
function grain(ctx, w, h, amt, r){
  const id = ctx.getImageData(0,0,w,h), d = id.data;
  for(let i=0;i<d.length;i+=4){
    const n = (r()*2-1)*amt;
    d[i]=clamp(d[i]+n,0,255); d[i+1]=clamp(d[i+1]+n,0,255); d[i+2]=clamp(d[i+2]+n,0,255);
  }
  ctx.putImageData(id,0,0);
}
function blots(ctx, w, h, n, r, col, maxR){
  for(let i=0;i<n;i++){
    ctx.fillStyle = col.replace('A', (0.05+r()*0.16).toFixed(3));
    ctx.beginPath(); ctx.arc(r()*w, r()*h, 1+r()*(maxR||6), 0, Math.PI*2); ctx.fill();
  }
}
function streaks(ctx, w, h, n, r, col){
  for(let i=0;i<n;i++){
    const x = r()*w, ww = 1+r()*2.5, y = r()*h*0.4, hh = h*0.25 + r()*h*0.6;
    const g = ctx.createLinearGradient(0,y,0,y+hh);
    g.addColorStop(0, col.replace('A','0.35')); g.addColorStop(1, col.replace('A','0'));
    ctx.fillStyle = g; ctx.fillRect(x,y,ww,hh);
  }
}
function crack(ctx, w, h, r){
  ctx.strokeStyle = 'rgba(0,0,0,0.45)'; ctx.lineWidth = 1;
  let x = r()*w, y = r()*h*0.5;
  ctx.beginPath(); ctx.moveTo(x,y);
  for(let i=0;i<7;i++){ x += (r()-0.5)*10; y += 3+r()*7; ctx.lineTo(x,y); }
  ctx.stroke();
}
function grime(ctx, w, h, a){
  const g = ctx.createLinearGradient(0,h*0.6,0,h);
  g.addColorStop(0,'rgba(20,14,8,0)'); g.addColorStop(1,'rgba(20,14,8,'+a+')');
  ctx.fillStyle = g; ctx.fillRect(0,0,w,h);
}

/* ---------- WALLS ---------- */
const P = {};
P[T.concrete] = function(c,s,r){
  c.fillStyle = '#4c4f53'; c.fillRect(0,0,s,s);
  blots(c,s,s,30,r,'rgba(0,0,0,A)',6); blots(c,s,s,12,r,'rgba(255,255,255,A)',4);
  c.fillStyle='rgba(0,0,0,0.35)'; c.fillRect(0,(s*0.33)|0,s,1); c.fillRect(0,(s*0.66)|0,s,1);
  c.fillStyle='rgba(255,255,255,0.06)'; c.fillRect(0,(s*0.33|0)+1,s,1);
  for(let i=0;i<5;i++){ c.fillStyle='rgba(0,0,0,0.5)'; c.fillRect(((i*13+7)%s), (s*0.15|0) + (i%2)*(s*0.5|0), 2, 2); }
  streaks(c,s,s,6,r,'rgba(48,26,8,A)'); crack(c,s,s,r); grime(c,s,s,0.5); grain(c,s,s,16,r);
};
P[T.brick] = function(c,s,r){
  c.fillStyle = '#3a3532'; c.fillRect(0,0,s,s);
  const bh = s/8, bw = s/4;
  for(let row=0; row<8; row++){
    const off = (row%2)*bw/2;
    for(let col=-1; col<5; col++){
      const x = col*bw + off, y = row*bh;
      const v = 0.8 + r()*0.4;
      c.fillStyle = 'rgb('+((96*v)|0)+','+((50*v)|0)+','+((38*v)|0)+')';
      c.fillRect(x+1, y+1, bw-2, bh-2);
      c.fillStyle = 'rgba(255,255,255,0.05)'; c.fillRect(x+1,y+1,bw-2,1);
    }
  }
  const g = c.createLinearGradient(0,0,0,s*0.5); g.addColorStop(0,'rgba(0,0,0,0.55)'); g.addColorStop(1,'rgba(0,0,0,0)');
  c.fillStyle = g; c.fillRect(0,0,s,s);
  blots(c,s,s,14,r,'rgba(0,0,0,A)',5); grime(c,s,s,0.45); grain(c,s,s,14,r);
};
P[T.tile] = function(c,s,r){
  c.fillStyle = '#56584f'; c.fillRect(0,0,s,s);
  const ts = s/4;
  for(let y=0;y<4;y++) for(let x=0;x<4;x++){
    const v = 0.85 + r()*0.18, yel = r()*14;
    c.fillStyle = 'rgb('+((178*v+yel)|0)+','+((182*v+yel*0.8)|0)+','+((168*v)|0)+')';
    c.fillRect(x*ts+1, y*ts+1, ts-2, ts-2);
    c.fillStyle='rgba(255,255,255,0.12)'; c.fillRect(x*ts+2, y*ts+2, ts-5, 1);
  }
  /* one gone */
  c.fillStyle = '#3c3d3a'; c.fillRect(ts*2+1, ts*1+1, ts-2, ts-2); blots(c,s,s,4,r,'rgba(0,0,0,A)',3);
  streaks(c,s,s,4,r,'rgba(90,40,10,A)'); blots(c,s,s,16,r,'rgba(40,30,10,A)',4);
  grime(c,s,s,0.55); grain(c,s,s,10,r);
};
P[T.block] = function(c,s,r){
  c.fillStyle = '#2e322f'; c.fillRect(0,0,s,s);
  const bh = s/4, bw = s/2;
  for(let row=0; row<4; row++){
    const off = (row%2)*bw/2;
    for(let col=-1; col<3; col++){
      const x = col*bw + off, y = row*bh, v = 0.9 + r()*0.15;
      c.fillStyle = 'rgb('+((80*v)|0)+','+((88*v)|0)+','+((82*v)|0)+')';
      c.fillRect(x+1,y+1,bw-2,bh-2);
    }
  }
  for(let i=0;i<7;i++){ c.fillStyle='rgba(150,150,140,0.35)'; const w=3+r()*8; c.fillRect(r()*s, r()*s, w, 2+r()*4); }
  streaks(c,s,s,5,r,'rgba(30,20,10,A)'); grime(c,s,s,0.5); grain(c,s,s,15,r);
};
P[T.shelf] = function(c,s,r){
  c.fillStyle = '#121214'; c.fillRect(0,0,s,s);
  const lv = [2, s*0.36, s*0.68];
  for(let k=0;k<3;k++){
    const y0 = lv[k]+3, y1 = (k<2?lv[k+1]:s-2);
    let x = 5;
    while(x < s-8){
      const bw = 8 + r()*16, bh = Math.min(y1-y0-2, 8 + r()*14);
      if(r() < 0.18){ x += bw; continue; }
      const v = 0.7 + r()*0.4;
      c.fillStyle = 'rgb('+((128*v)|0)+','+((92*v)|0)+','+((58*v)|0)+')';
      c.fillRect(x, y1-bh, bw-1, bh);
      c.fillStyle = 'rgba(200,190,150,0.5)'; c.fillRect(x+bw*0.3, y1-bh+2, bw*0.35, 2);
      c.fillStyle = 'rgba(0,0,0,0.25)'; c.fillRect(x, y1-bh, 1, bh);
      x += bw + 1;
    }
  }
  for(let k=0;k<3;k++){ c.fillStyle='#6c6e70'; c.fillRect(0,lv[k],s,2); c.fillStyle='#2a2b2c'; c.fillRect(0,lv[k]+2,s,1); }
  c.fillStyle='#8a5a22'; c.fillRect(0,0,3,s); c.fillRect(s-3,0,3,s);
  c.fillStyle='rgba(0,0,0,0.6)'; for(let y=4;y<s;y+=6){ c.fillRect(1,y,1,2); c.fillRect(s-2,y,1,2); }
  grain(c,s,s,10,r);
};
P[T.freezer] = function(c,s,r){
  const g = c.createLinearGradient(0,0,s,0);
  g.addColorStop(0,'#5d6872'); g.addColorStop(0.5,'#7d8a96'); g.addColorStop(1,'#59636c');
  c.fillStyle = g; c.fillRect(0,0,s,s);
  c.fillStyle='rgba(0,0,0,0.5)'; c.fillRect(0,0,1,s); c.fillRect(s/2,0,1,s);
  c.fillStyle='rgba(255,255,255,0.15)'; c.fillRect(1,0,1,s); c.fillRect(s/2+1,0,1,s);
  for(let y=4;y<s;y+=12){ c.fillStyle='#2c3238'; c.fillRect(3,y,2,2); c.fillRect(s/2+3,y,2,2); c.fillRect(s-5,y,2,2); }
  for(let i=0;i<s;i++){ for(let k=0;k<3;k++){ if(r()<0.7){ c.fillStyle='rgba(220,235,255,'+(0.3+r()*0.5).toFixed(2)+')'; c.fillRect(i, s-1-((r()*r()*s*0.35)|0), 1, 1+((r()*3)|0)); } } }
  const fg = c.createLinearGradient(0,s*0.7,0,s); fg.addColorStop(0,'rgba(210,230,255,0)'); fg.addColorStop(1,'rgba(210,230,255,0.45)');
  c.fillStyle = fg; c.fillRect(0,0,s,s);
  grain(c,s,s,8,r);
};
P[T.wood] = function(c,s,r){
  const pw = s/8;
  for(let i=0;i<8;i++){
    const v = 0.75 + r()*0.4;
    c.fillStyle = 'rgb('+((84*v)|0)+','+((56*v)|0)+','+((34*v)|0)+')';
    c.fillRect(i*pw,0,pw,s);
    c.fillStyle='rgba(0,0,0,0.45)'; c.fillRect(i*pw,0,1,s);
    for(let k=0;k<4;k++){ c.fillStyle='rgba(30,16,6,0.25)'; c.fillRect(i*pw+1+r()*(pw-2), r()*s, 1, 6+r()*14); }
    c.fillStyle='#1a120c'; c.fillRect(i*pw+pw/2, 3, 1, 1); c.fillRect(i*pw+pw/2, s-4, 1, 1);
  }
  const g = c.createLinearGradient(0,s*0.62,0,s); g.addColorStop(0,'rgba(0,0,0,0)'); g.addColorStop(0.5,'rgba(10,8,4,0.55)'); g.addColorStop(1,'rgba(10,8,4,0.75)');
  c.fillStyle = g; c.fillRect(0,0,s,s);
  c.strokeStyle='rgba(60,40,20,0.6)'; c.lineWidth=1; c.beginPath(); c.moveTo(0,s*0.66); for(let x=0;x<=s;x+=4) c.lineTo(x, s*0.66 + Math.sin(x*0.4)*2 + r()*2); c.stroke();
  grain(c,s,s,10,r);
};
P[T.pipe] = function(c,s,r){
  P[T.concrete](c,s,r);
  c.fillStyle='rgba(0,0,0,0.35)'; c.fillRect(0,0,s,s);
  function pipe(y, th, col1, col2, rust){
    const g = c.createLinearGradient(0,y,0,y+th);
    g.addColorStop(0, col2); g.addColorStop(0.35, col1); g.addColorStop(1, '#111');
    c.fillStyle = g; c.fillRect(0,y,s,th);
    if(rust){ for(let i=0;i<8;i++){ c.fillStyle='rgba(120,50,12,'+(0.2+r()*0.4).toFixed(2)+')'; c.fillRect(r()*s, y+r()*th, 2+r()*6, 1+r()*2); } }
    c.fillStyle='#222'; c.fillRect(s*0.25,y-1,3,th+2); c.fillRect(s*0.75,y-1,3,th+2);
  }
  pipe(s*0.12, s*0.16, '#5a5f63', '#9aa0a4', true);
  pipe(s*0.40, s*0.07, '#7a4a28', '#c0884a', false);
  pipe(s*0.66, s*0.14, '#4c5052', '#8a8f92', true);
  c.fillStyle='rgba(40,25,10,0.5)'; c.fillRect(s*0.6, s*0.8, 2, s*0.2);
};
P[T.door] = function(c,s,r){
  c.fillStyle = '#25282a'; c.fillRect(0,0,s,s);
  const g = c.createLinearGradient(0,0,s,0); g.addColorStop(0,'#3e4844'); g.addColorStop(0.5,'#55615b'); g.addColorStop(1,'#3a433f');
  c.fillStyle = g; c.fillRect(s*0.12,s*0.04,s*0.76,s*0.96);
  c.fillStyle='#14171a'; c.fillRect(s*0.36,s*0.14,s*0.28,s*0.2);
  c.strokeStyle='rgba(120,130,125,0.35)'; c.lineWidth=1;
  for(let i=0;i<4;i++){ c.beginPath(); c.moveTo(s*0.36+i*s*0.07, s*0.14); c.lineTo(s*0.36+i*s*0.07, s*0.34); c.stroke(); }
  c.fillStyle='#8c9290'; c.fillRect(s*0.18,s*0.55,s*0.64,s*0.05);
  c.fillStyle='#2a2e2c'; c.fillRect(s*0.18,s*0.6,s*0.64,s*0.02);
  c.fillStyle='rgba(200,190,170,0.55)'; c.font = 'bold '+(s*0.12|0)+'px '+TYPE; c.textAlign='center';
  c.fillText('SHOP', s*0.5, s*0.47);
  c.fillText('↑', s*0.5, s*0.82);
  streaks(c,s,s,4,r,'rgba(60,30,10,A)'); grain(c,s,s,10,r);
};
P[T.paint] = function(c,s,r){
  c.fillStyle = '#9c927a'; c.fillRect(0,0,s,s);
  c.fillStyle = '#3c4a3e'; c.fillRect(0,s*0.68,s,s*0.32);
  c.fillStyle = '#2a332b'; c.fillRect(0,s*0.68,s,2);
  for(let i=0;i<9;i++){ c.fillStyle='rgba(80,78,70,0.8)'; const w=2+r()*9, h=2+r()*6; c.fillRect(r()*s, r()*s*0.6, w, h); }
  streaks(c,s,s,7,r,'rgba(70,50,20,A)'); blots(c,s,s,18,r,'rgba(30,20,10,A)',4); grime(c,s,s,0.45); grain(c,s,s,12,r);
};
P[T.rack] = function(c,s,r){
  P[T.freezer](c,s,r);
  c.fillStyle='rgba(10,14,20,0.75)'; c.fillRect(2,2,s-4,s-4);
  for(let k=0;k<4;k++){
    const y = 4 + k*(s/4);
    c.fillStyle='#9fb0c0'; c.fillRect(2,y+s/4-6,s-4,2);
    for(let x=4;x<s-6;x+= 10+r()*6){ if(r()<0.3) continue; const bh = 4+r()*6; c.fillStyle='rgba(190,210,230,'+(0.5+r()*0.3).toFixed(2)+')'; c.fillRect(x, y+s/4-6-bh, 6+r()*4, bh); }
  }
  c.strokeStyle='rgba(180,200,220,0.25)'; for(let x=3;x<s;x+=3){ c.beginPath(); c.moveTo(x,2); c.lineTo(x,s-2); c.stroke(); }
};

/* writing. messy, every letter a little off */
function scrawl(c, s, lines, opt){
  opt = opt || {};
  const r = rng(opt.seed||7);
  const size = opt.size || s*0.2;
  c.save();
  c.textAlign = 'center'; c.textBaseline = 'middle';
  const lh = size*1.02;
  const top = s*0.5 - (lines.length-1)*lh/2 + (opt.dy||0)*s;
  lines.forEach((ln, li)=>{
    const chars = ln.split('');
    c.font = (opt.weight||'') + ' ' + size + 'px ' + (opt.font||HAND);
    let total = 0; const ws = chars.map(ch=>{ const w = c.measureText(ch).width*0.92; total += w; return w; });
    let x = s*0.5 - total/2;
    chars.forEach((ch,i)=>{
      const y = top + li*lh + (r()-0.5)*size*0.12;
      c.save(); c.translate(x + ws[i]/2, y); c.rotate((r()-0.5)*0.22 + (opt.tilt||0));
      const sc = 0.9 + r()*0.2; c.scale(sc, sc);
      if(opt.drip){ c.fillStyle = opt.color; c.fillRect(-1, size*0.25, 1.4, size*(0.2+r()*0.9)); }
      c.fillStyle = opt.color || 'rgba(140,10,8,0.9)';
      c.fillText(ch, 0, 0);
      if(opt.double){ c.globalAlpha = 0.35; c.fillText(ch, 1, 1); c.globalAlpha = 1; }
      c.restore();
      x += ws[i];
    });
  });
  c.restore();
}
const MSG = {};
MSG[T.m_look]   = { lines:['DONT','LOOK','AT IT'], color:'rgba(150,12,10,0.92)', drip:1, size:0.24 };
MSG[T.m_noise]  = { lines:['it goes','to the','noise'], color:'rgba(20,20,22,0.85)', size:0.2 };
MSG[T.m_seven]  = { lines:['7 times','then it','stops'], color:'rgba(30,20,20,0.85)', size:0.2 };
MSG[T.m_ren]    = { lines:['REN','38'], color:'rgba(230,230,220,0.85)', size:0.3, font:HAND };
MSG[T.m_sauce]  = { lines:['dont drink','the sauce'], color:'rgba(20,18,16,0.88)', size:0.17 };
MSG[T.m_sold]   = { lines:['SOLD','SOLD','SOLD'], color:'rgba(150,12,10,0.9)', size:0.22, drip:1, tilt:-0.08 };
MSG[T.h_fridge] = { lines:['ITS NOT','A FRIDGE'], color:'rgba(170,80,255,0.95)', size:0.2 };
MSG[T.h_behind] = { lines:['LOOK','BEHIND','YOU'], color:'rgba(170,80,255,0.95)', size:0.22 };
MSG[T.h_box]    = { lines:['the box','was never','a box'], color:'rgba(170,80,255,0.95)', size:0.19 };
MSG[T.m_counts] = { lines:['it','counts'], color:'rgba(150,12,10,0.88)', size:0.26, drip:1 };
MSG[T.m_hank]   = { lines:['HANK','DAY SHIFT','DO NOT','RESTOCK'], color:'rgba(20,20,18,0.85)', size:0.15, font:TYPE };
MSG[T.m_quiet]  = { lines:['stay in','the dark','it sees','the light'], color:'rgba(20,20,22,0.85)', size:0.15 };

/* the tally wall. one mark per death, six slots, then a little heart
   where the seventh would go. */
function paintTally(c, s, deaths){
  P[T.block](c, s, rng(4410));
  c.save();
  const shown = Math.min(deaths, 6);
  const x0 = s*0.16, gap = s*0.1, y0 = s*0.3, y1 = s*0.66;
  for(let i=0;i<6;i++){
    const x = x0 + i*gap;
    c.lineCap = 'round';
    if(i < shown){
      c.strokeStyle = 'rgba(230,228,215,0.92)'; c.lineWidth = s*0.022;
      c.beginPath(); c.moveTo(x + (i%2)*1.5, y0 + (i*7%5)); c.lineTo(x - 1 + (i%3), y1 - (i*3%4)); c.stroke();
    } else {
      c.strokeStyle = 'rgba(230,228,215,0.18)'; c.lineWidth = s*0.01; c.setLineDash([s*0.02, s*0.025]);
      c.beginPath(); c.moveTo(x, y0); c.lineTo(x, y1); c.stroke(); c.setLineDash([]);
    }
  }
  /* seventh slot */
  const hx = x0 + 6*gap + s*0.02, hy = (y0+y1)/2, hs = s*0.05;
  c.strokeStyle = deaths >= 6 ? 'rgba(255,140,180,0.95)' : 'rgba(230,228,215,0.35)';
  c.lineWidth = s*0.012;
  c.beginPath();
  c.moveTo(hx, hy+hs*0.9);
  c.bezierCurveTo(hx-hs*1.6, hy-hs*0.2, hx-hs*0.6, hy-hs*1.4, hx, hy-hs*0.35);
  c.bezierCurveTo(hx+hs*0.6, hy-hs*1.4, hx+hs*1.6, hy-hs*0.2, hx, hy+hs*0.9);
  c.stroke();
  if(deaths >= 7){ c.fillStyle='rgba(255,120,170,0.7)'; c.fill(); }
  c.font = (s*0.07|0)+'px '+HAND; c.fillStyle='rgba(230,228,215,0.5)'; c.textAlign='center';
  c.fillText(deaths>0 ? 'you' : '', s*0.45, s*0.82);
  c.restore();
}

/* ---------- FLOORS ---------- */
const PF = {};
PF[F.concrete] = function(c,s,r){ c.fillStyle='#3d3e40'; c.fillRect(0,0,s,s); blots(c,s,s,40,r,'rgba(0,0,0,A)',7); blots(c,s,s,10,r,'rgba(255,255,255,A)',3); crack(c,s,s,r); c.fillStyle='rgba(0,0,0,0.4)'; c.fillRect(0,0,s,1); c.fillRect(0,0,1,s); grain(c,s,s,14,r); };
PF[F.tile] = function(c,s,r){
  const ts = s/4;
  for(let y=0;y<4;y++) for(let x=0;x<4;x++){ const dark = (x+y)%2; const v = 0.85+r()*0.2; c.fillStyle = dark? 'rgb('+((60*v)|0)+','+((62*v)|0)+','+((60*v)|0)+')' : 'rgb('+((150*v)|0)+','+((148*v)|0)+','+((132*v)|0)+')'; c.fillRect(x*ts,y*ts,ts,ts); }
  c.fillStyle='rgba(0,0,0,0.3)'; for(let i=0;i<=4;i++){ c.fillRect(i*ts,0,1,s); c.fillRect(0,i*ts,s,1); }
  blots(c,s,s,24,r,'rgba(30,20,10,A)',6); grain(c,s,s,10,r);
};
PF[F.water] = function(c,s,r){
  c.fillStyle='#1d2224'; c.fillRect(0,0,s,s);
  c.strokeStyle='rgba(150,170,175,0.18)'; c.lineWidth=1;
  for(let k=0;k<5;k++){ const cx=r()*s, cy=r()*s, rad=3+r()*10; c.beginPath(); c.ellipse(cx,cy,rad,rad*0.7,0,0,Math.PI*2); c.stroke(); }
  blots(c,s,s,20,r,'rgba(0,0,0,A)',8);
  for(let i=0;i<30;i++){ c.fillStyle='rgba(200,220,225,'+(0.05+r()*0.15).toFixed(2)+')'; c.fillRect(r()*s, r()*s, 1+r()*3, 1); }
  grain(c,s,s,8,r);
};
PF[F.wood] = function(c,s,r){
  const ph = s/6;
  for(let i=0;i<6;i++){ const v=0.7+r()*0.4; c.fillStyle='rgb('+((76*v)|0)+','+((50*v)|0)+','+((30*v)|0)+')'; c.fillRect(0,i*ph,s,ph); c.fillStyle='rgba(0,0,0,0.5)'; c.fillRect(0,i*ph,s,1); c.fillRect(((r()*s)|0), i*ph, 1, ph); for(let k=0;k<5;k++){ c.fillStyle='rgba(20,10,4,0.3)'; c.fillRect(r()*s, i*ph+1+r()*(ph-2), 6+r()*14, 1); } }
  blots(c,s,s,10,r,'rgba(0,0,0,A)',6); grain(c,s,s,10,r);
};
PF[F.grate] = function(c,s,r){
  c.fillStyle='#4b5560'; c.fillRect(0,0,s,s);
  for(let y=0;y<s;y+=8) for(let x=0;x<s;x+=8){ c.fillStyle='#0a0c10'; c.fillRect(x+2,y+2,4,4); c.fillStyle='rgba(255,255,255,0.12)'; c.fillRect(x+1,y+1,6,1); }
  for(let i=0;i<40;i++){ c.fillStyle='rgba(220,235,255,'+(0.1+r()*0.25).toFixed(2)+')'; c.fillRect(r()*s, r()*s, 1+r()*2, 1+r()*2); }
  grain(c,s,s,8,r);
};
PF[F.polished] = function(c,s,r){
  c.fillStyle='#55585a'; c.fillRect(0,0,s,s);
  blots(c,s,s,18,r,'rgba(255,255,255,A)',10); blots(c,s,s,18,r,'rgba(0,0,0,A)',6);
  c.fillStyle='rgba(0,0,0,0.35)'; c.fillRect(0,0,s,1); c.fillRect(0,0,1,s);
  grain(c,s,s,8,r);
};
const PC = {};
PC[C.concrete] = function(c,s,r){ c.fillStyle='#2e2f31'; c.fillRect(0,0,s,s); blots(c,s,s,30,r,'rgba(0,0,0,A)',8); c.fillStyle='rgba(0,0,0,0.5)'; c.fillRect(0,s/2,s,2); grain(c,s,s,12,r); };
PC[C.drop] = function(c,s,r){
  c.fillStyle='#6e6d66'; c.fillRect(0,0,s,s);
  for(let i=0;i<60;i++){ c.fillStyle='rgba(0,0,0,'+(0.1+r()*0.2).toFixed(2)+')'; c.fillRect(r()*s, r()*s, 1, 1); }
  c.fillStyle='#3b3b38'; c.fillRect(0,0,s,2); c.fillRect(0,0,2,s); c.fillRect(0,s/2,s,1); c.fillRect(s/2,0,1,s);
  const st = c.createRadialGradient(s*0.7,s*0.3,1,s*0.7,s*0.3,s*0.25); st.addColorStop(0,'rgba(90,60,20,0.5)'); st.addColorStop(1,'rgba(90,60,20,0)');
  c.fillStyle = st; c.fillRect(0,0,s,s);
  grain(c,s,s,10,r);
};
PC[C.pipes] = function(c,s,r){ PC[C.concrete](c,s,r); c.fillStyle='#4a4e50'; c.fillRect(0,s*0.2,s,s*0.12); c.fillStyle='#6a4428'; c.fillRect(0,s*0.62,s,s*0.06); c.fillStyle='rgba(0,0,0,0.5)'; c.fillRect(0,s*0.32,s,2); };
PC[C.frost] = function(c,s,r){ c.fillStyle='#39444e'; c.fillRect(0,0,s,s); for(let i=0;i<80;i++){ c.fillStyle='rgba(220,235,255,'+(0.08+r()*0.3).toFixed(2)+')'; c.fillRect(r()*s, r()*s, 1+r()*3, 1); } c.fillStyle='#262e36'; c.fillRect(0,0,s,2); grain(c,s,s,8,r); };

/* ---------- SPRITES ----------
   a sprite is { w, h, d: Uint32 colour, ei: Uint8 glow, ec: glow rgb,
   wh: height in world units, z: how far off the floor it starts }   */
function spriteFrom(main, em, wh, z, ec){
  const w = main.width, h = main.height;
  const d = new Uint32Array(main.getContext('2d').getImageData(0,0,w,h).data.buffer.slice(0));
  let ei = null;
  if(em){
    const ed = em.getContext('2d').getImageData(0,0,w,h).data;
    ei = new Uint8Array(w*h);
    let any = false;
    for(let i=0;i<w*h;i++){ const a = ed[i*4+3]; if(a){ ei[i] = a; any = true; } }
    if(!any) ei = null;
  }
  return { w, h, d, ei, ec: ec || [255,220,170], wh, z: z||0 };
}
function mk(w, h, wh, z, ec, draw){
  const m = cv(w,h), e = cv(w,h);
  draw(m.getContext('2d'), e.getContext('2d'), w, h);
  return spriteFrom(m, e, wh, z, ec);
}
function rr(c,x,y,w,h,r){ c.beginPath(); c.moveTo(x+r,y); c.arcTo(x+w,y,x+w,y+h,r); c.arcTo(x+w,y+h,x,y+h,r); c.arcTo(x,y+h,x,y,r); c.arcTo(x,y,x+w,y,r); c.closePath(); }
function sgrain(c,w,h,amt,seed){
  const r = rng(seed||1);
  const id = c.getImageData(0,0,w,h), d = id.data;
  for(let i=0;i<d.length;i+=4){ if(!d[i+3]) continue; const n=(r()*2-1)*amt; d[i]=clamp(d[i]+n,0,255); d[i+1]=clamp(d[i+1]+n,0,255); d[i+2]=clamp(d[i+2]+n,0,255); }
  c.putImageData(id,0,0);
}
function rust(c, x, y, w, h, n, seed){
  const r = rng(seed||3);
  for(let i=0;i<n;i++){ c.fillStyle='rgba('+(110+r()*40|0)+','+(48+r()*20|0)+',14,'+(0.25+r()*0.45).toFixed(2)+')'; c.beginPath(); c.arc(x+r()*w, y+r()*h, 0.6+r()*2.4, 0, Math.PI*2); c.fill(); }
}

/* the old fridges with the tags on */
function oldFridge(c, e, w, h, open, tag, seed){
  const r = rng(seed);
  const bx = w*0.1, bw = w*0.8, by = h*0.04, bh = h*0.94;
  const g = c.createLinearGradient(bx,0,bx+bw,0);
  g.addColorStop(0,'#8f8a78'); g.addColorStop(0.35,'#d2ccb4'); g.addColorStop(0.7,'#bdb69c'); g.addColorStop(1,'#77725f');
  c.fillStyle = g; rr(c,bx,by,bw,bh,w*0.14); c.fill();
  c.strokeStyle='rgba(0,0,0,0.55)'; c.lineWidth=1.5; c.stroke();
  c.fillStyle='rgba(255,255,255,0.18)'; c.fillRect(bx+bw*0.16, by+bh*0.06, 2, bh*0.8);
  c.fillStyle='rgba(0,0,0,0.4)'; c.fillRect(bx+2, by+bh*0.3, bw-4, 1.5);
  /* handle */
  c.fillStyle='#d9dde0'; rr(c, bx+bw*0.8, by+bh*0.38, 3, bh*0.18, 1.5); c.fill();
  c.fillStyle='rgba(0,0,0,0.4)'; c.fillRect(bx+bw*0.8+3, by+bh*0.38, 1, bh*0.18);
  rust(c, bx, by+bh*0.6, bw, bh*0.4, 26, seed+1); rust(c, bx, by, bw, bh*0.3, 8, seed+2);
  c.fillStyle='rgba(30,30,30,0.85)'; c.fillRect(bx+bw*0.1, by+bh-3, bw*0.8, 3);
  if(open){
    /* the door sits a crack open on the hinge side. cold light leaks out. */
    c.fillStyle='#050608'; c.fillRect(bx+bw*0.04, by+bh*0.32, 2.5, bh*0.6);
    e.fillStyle='rgba(255,255,255,1)'; e.fillRect(bx+bw*0.04, by+bh*0.32, 2, bh*0.6);
    e.fillStyle='rgba(255,255,255,0.35)'; e.fillRect(bx+bw*0.04-2, by+bh*0.34, 6, bh*0.56);
  }
  if(tag){
    c.strokeStyle='#ccc'; c.lineWidth=0.8; c.beginPath(); c.moveTo(bx+bw*0.82, by+bh*0.47); c.lineTo(bx+bw*0.7, by+bh*0.58); c.stroke();
    c.save(); c.translate(bx+bw*0.62, by+bh*0.62); c.rotate(-0.25);
    c.fillStyle='#ece6d0'; c.fillRect(-5,-4,12,9); c.fillStyle='#c41a12'; c.fillRect(-3,-1,8,1.3); c.fillRect(-3,2,5,1);
    c.restore();
    e.fillStyle='rgba(255,255,255,0.25)'; e.fillRect(bx+bw*0.55, by+bh*0.56, 12, 10);
  }
  sgrain(c,w,h,10,seed+9);
}
function modernFridge(c, e, w, h, mode, seed){
  const bx = w*0.08, bw = w*0.84, by = h*0.03, bh = h*0.95;
  const g = c.createLinearGradient(bx,0,bx+bw,0);
  g.addColorStop(0,'#9da2a6'); g.addColorStop(0.3,'#e4e7e8'); g.addColorStop(0.75,'#cfd3d5'); g.addColorStop(1,'#8b9094');
  c.fillStyle = g; rr(c,bx,by,bw,bh,3); c.fill();
  c.strokeStyle='rgba(0,0,0,0.5)'; c.lineWidth=1.2; c.stroke();
  c.fillStyle='rgba(0,0,0,0.45)'; c.fillRect(bx+1, by+bh*0.36, bw-2, 1.5);
  c.fillStyle='#b9bec2'; c.fillRect(bx+bw*0.86, by+bh*0.1, 2.5, bh*0.2); c.fillRect(bx+bw*0.86, by+bh*0.42, 2.5, bh*0.28);
  c.fillStyle='#f6f0d8'; c.fillRect(bx+bw*0.2, by+bh*0.5, bw*0.42, bh*0.12);
  c.fillStyle='#b8160e'; c.font='bold '+(h*0.07|0)+'px '+TYPE; c.textAlign='center';
  c.fillText(mode==='hide' ? 'EMPTY' : '$—', bx+bw*0.41, by+bh*0.59);
  if(mode==='hide'){ c.fillStyle='#0a0a0c'; c.fillRect(bx+bw*0.02, by+bh*0.38, 2, bh*0.56); }
  if(mode==='open'){
    c.fillStyle='#0b0d10'; c.fillRect(bx+3, by+bh*0.38, bw-6, bh*0.58);
    c.fillStyle='#2b2f33'; for(let k=0;k<3;k++) c.fillRect(bx+4, by+bh*(0.5+k*0.14), bw-8, 1.5);
    c.fillStyle='#d8dcdf'; c.save(); c.translate(bx, by+bh*0.38); c.fillRect(-w*0.18, 0, w*0.18, bh*0.58); c.restore();
  }
  if(mode!=='open'){ e.fillStyle='rgba(255,255,255,1)'; e.fillRect(bx+bw*0.12, by+bh*0.08, 2, 2); }
  sgrain(c,w,h,6,seed);
}
function locker(c, e, w, h, open, seed){
  const bx=w*0.1,bw=w*0.8,by=h*0.02,bh=h*0.96;
  c.fillStyle='#4a5560'; c.fillRect(bx,by,bw,bh);
  c.strokeStyle='rgba(0,0,0,0.6)'; c.lineWidth=1; c.strokeRect(bx+0.5,by+0.5,bw-1,bh-1);
  if(open){ c.fillStyle='#08090a'; c.fillRect(bx+2,by+3,bw-4,bh-6); c.fillStyle='#5a6672'; c.fillRect(bx-w*0.1,by+2,w*0.12,bh-4); }
  else{
    c.fillStyle='rgba(0,0,0,0.6)'; for(let k=0;k<5;k++) c.fillRect(bx+bw*0.25, by+bh*0.08+k*4, bw*0.5, 1.5);
    c.fillStyle='#22262a'; c.fillRect(bx+bw*0.18, by+bh*0.5, 3, 6);
    c.fillStyle='rgba(0,0,0,0.85)'; c.fillRect(bx+bw-3, by+4, 2, bh-8);
  }
  rust(c,bx,by+bh*0.7,bw,bh*0.3,14,seed);
  sgrain(c,w,h,10,seed);
}

const SPR = B.SPR = {};
function buildSprites(){
  SPR.tag      = mk(48,96,0.82,0,[190,225,255],(c,e,w,h)=>oldFridge(c,e,w,h,true,true,11));
  SPR.tagShut  = mk(48,96,0.82,0,[190,225,255],(c,e,w,h)=>oldFridge(c,e,w,h,false,false,11));
  SPR.display  = mk(44,100,0.86,0,[60,255,120],(c,e,w,h)=>modernFridge(c,e,w,h,'shut',21));
  SPR.hideF    = mk(44,100,0.86,0,[60,255,120],(c,e,w,h)=>modernFridge(c,e,w,h,'hide',22));
  SPR.hideFOpen= mk(44,100,0.86,0,[60,255,120],(c,e,w,h)=>modernFridge(c,e,w,h,'open',23));
  SPR.locker   = mk(40,110,0.92,0,null,(c,e,w,h)=>locker(c,e,w,h,false,31));
  SPR.lockerOpen=mk(40,110,0.92,0,null,(c,e,w,h)=>locker(c,e,w,h,true,32));
  SPR.boiler = mk(120,128,1.0,0,[255,130,40],(c,e,w,h)=>{
    const g = c.createLinearGradient(10,0,110,0); g.addColorStop(0,'#2c2a28'); g.addColorStop(0.45,'#6a625a'); g.addColorStop(1,'#26231f');
    c.fillStyle=g; rr(c,14,8,92,118,18); c.fill();
    c.strokeStyle='rgba(0,0,0,0.6)'; c.lineWidth=2; c.stroke();
    c.fillStyle='rgba(0,0,0,0.5)'; for(let y=20;y<120;y+=22) c.fillRect(14,y,92,2);
    c.fillStyle='#8d8578'; for(let y=24;y<120;y+=22) for(let x=20;x<104;x+=10) c.fillRect(x,y,2,2);
    c.fillStyle='#1a1816'; c.fillRect(44,84,32,22); c.fillStyle='#111'; c.fillRect(48,88,24,14);
    e.fillStyle='rgba(255,255,255,1)'; e.fillRect(50,92,20,8); e.fillStyle='rgba(255,255,255,0.4)'; e.fillRect(46,88,28,16);
    c.fillStyle='#ddd'; c.beginPath(); c.arc(40,46,7,0,7); c.fill(); c.fillStyle='#111'; c.fillRect(39,40,1.5,6);
    c.beginPath(); c.arc(76,46,7,0,7); c.fillStyle='#ddd'; c.fill(); c.fillStyle='#111'; c.fillRect(76,46,5,1.5);
    c.fillStyle='#4a4038'; c.fillRect(50,0,10,10); c.fillRect(0,30,16,8); c.fillRect(104,58,16,8);
    rust(c,14,8,92,118,60,41); sgrain(c,w,h,12,42);
  });
  SPR.heater = mk(48,100,0.8,0,null,(c,e,w,h)=>{ const g=c.createLinearGradient(6,0,42,0); g.addColorStop(0,'#5a5e5a'); g.addColorStop(0.4,'#a3a89e'); g.addColorStop(1,'#4b4f4c'); c.fillStyle=g; rr(c,6,10,36,88,10); c.fill(); c.fillStyle='#333'; c.fillRect(20,0,3,12); c.fillRect(28,0,3,12); c.fillStyle='#f0e6c8'; c.fillRect(14,46,20,12); c.fillStyle='#a11'; c.fillRect(16,49,16,2); rust(c,6,60,36,38,24,51); sgrain(c,w,h,10,52); });
  const washer = (dry)=>(c,e,w,h)=>{ c.fillStyle= dry?'#cfcdc4':'#dcdcd6'; rr(c,3,4,w-6,h-6,3); c.fill(); c.strokeStyle='rgba(0,0,0,0.5)'; c.stroke(); c.fillStyle='#8c8c86'; c.fillRect(5,7,w-10,8); c.fillStyle='#222'; c.beginPath(); c.arc(w/2,h*0.6,h*0.26,0,7); c.fill(); c.fillStyle= dry?'#3a3a36':'#28323a'; c.beginPath(); c.arc(w/2,h*0.6,h*0.2,0,7); c.fill(); c.strokeStyle='rgba(255,255,255,0.25)'; c.beginPath(); c.arc(w/2-3,h*0.57,h*0.14,3.6,4.6); c.stroke(); rust(c,3,h*0.75,w-6,h*0.2,10,61+(dry?1:0)); sgrain(c,w,h,8,63); };
  SPR.washer = mk(56,60,0.45,0,null,washer(false));
  SPR.dryer  = mk(56,60,0.45,0,null,washer(true));
  SPR.crate = mk(56,56,0.42,0,null,(c,e,w,h)=>{ c.fillStyle='#6b4a2a'; c.fillRect(2,4,w-4,h-6); c.fillStyle='#4a321a'; for(let y=4;y<h;y+=10) c.fillRect(2,y,w-4,2); c.fillStyle='#8a6440'; c.fillRect(2,4,5,h-6); c.fillRect(w-7,4,5,h-6); c.strokeStyle='#4a321a'; c.lineWidth=3; c.beginPath(); c.moveTo(7,8); c.lineTo(w-7,h-6); c.stroke(); c.fillStyle='rgba(0,0,0,0.6)'; c.font='bold 9px '+TYPE; c.fillText('FRAGILE', 10, h*0.42); sgrain(c,w,h,12,71); });
  SPR.boxes = mk(60,64,0.5,0,null,(c,e,w,h)=>{ const r=rng(81); const bx=[[4,30,30,32],[30,34,26,28],[10,6,28,26],[34,12,22,22]]; bx.forEach(b=>{ const v=0.75+r()*0.35; c.fillStyle='rgb('+((140*v)|0)+','+((100*v)|0)+','+((62*v)|0)+')'; c.fillRect(b[0],b[1],b[2],b[3]); c.fillStyle='rgba(210,200,160,0.6)'; c.fillRect(b[0]+b[2]*0.45,b[1],3,b[3]); c.fillStyle='rgba(0,0,0,0.35)'; c.fillRect(b[0],b[1]+b[3]-2,b[2],2); }); sgrain(c,w,h,10,82); });
  SPR.desk = mk(96,72,0.5,0,[255,200,120],(c,e,w,h)=>{
    c.fillStyle='#4a3020'; c.fillRect(4,30,88,8); c.fillStyle='#3a2416'; c.fillRect(8,38,26,34); c.fillRect(70,38,18,34);
    c.fillStyle='rgba(0,0,0,0.5)'; c.fillRect(12,46,18,1); c.fillRect(12,58,18,1);
    /* the radio */
    c.fillStyle='#2a2622'; c.fillRect(48,14,30,16); c.fillStyle='#d8c890'; c.fillRect(51,17,16,6); c.fillStyle='#111'; c.fillRect(58,17,1,6);
    c.fillStyle='#777'; c.beginPath(); c.arc(72,22,3,0,7); c.fill(); c.strokeStyle='#888'; c.beginPath(); c.moveTo(76,14); c.lineTo(86,0); c.stroke();
    c.fillStyle='#111'; c.font='5px '+TYPE; c.fillText('69.4', 51, 28);
    e.fillStyle='rgba(255,255,255,0.65)'; e.fillRect(51,17,16,6);
    /* lamp */
    c.fillStyle='#222'; c.fillRect(20,26,10,4); c.fillRect(24,10,2,16); c.fillStyle='#3a5a3a'; c.beginPath(); c.moveTo(14,12); c.lineTo(36,12); c.lineTo(30,2); c.lineTo(20,2); c.closePath(); c.fill();
    e.fillStyle='rgba(255,255,255,1)'; e.fillRect(16,12,18,3); e.fillStyle='rgba(255,255,255,0.35)'; e.fillRect(10,15,30,15);
    c.fillStyle='#e8e2cc'; c.fillRect(36,26,10,4); c.fillRect(38,25,9,3);
    sgrain(c,w,h,10,91);
  });
  SPR.chair = mk(40,56,0.45,0,null,(c,e,w,h)=>{ c.strokeStyle='#2a2a2a'; c.lineWidth=2.5; c.beginPath(); c.moveTo(10,54); c.lineTo(12,30); c.moveTo(30,54); c.lineTo(28,30); c.moveTo(12,30); c.lineTo(10,4); c.stroke(); c.fillStyle='#5a3a2a'; c.fillRect(8,26,26,5); c.save(); c.translate(10,6); c.rotate(-0.12); c.fillRect(0,0,22,12); c.restore(); });
  SPR.mattress = mk(96,24,0.13,0,null,(c,e,w,h)=>{ c.fillStyle='#8a826a'; rr(c,2,6,92,16,5); c.fill(); c.fillStyle='rgba(80,50,20,0.55)'; c.beginPath(); c.ellipse(50,14,18,5,0.2,0,7); c.fill(); c.fillStyle='rgba(0,0,0,0.3)'; for(let x=10;x<90;x+=12) c.fillRect(x,8,1,12); sgrain(c,w,h,12,101); });
  SPR.bucket = mk(32,32,0.2,0,null,(c,e,w,h)=>{ c.fillStyle='#c4a91a'; c.beginPath(); c.moveTo(5,8); c.lineTo(27,8); c.lineTo(24,30); c.lineTo(8,30); c.closePath(); c.fill(); c.fillStyle='#222'; c.fillRect(5,7,22,3); c.strokeStyle='#666'; c.beginPath(); c.arc(16,8,10,3.3,6.1); c.stroke(); c.strokeStyle='#5a4a30'; c.lineWidth=2; c.beginPath(); c.moveTo(18,8); c.lineTo(28,0); c.stroke(); });
  SPR.cabinet = mk(44,80,0.65,0,null,(c,e,w,h)=>{ c.fillStyle='#5b6058'; c.fillRect(4,2,36,76); for(let k=0;k<4;k++){ c.fillStyle='rgba(0,0,0,0.5)'; c.fillRect(4,2+k*19,36,1.5); c.fillStyle='#aaa'; c.fillRect(18,10+k*19,8,2); c.fillStyle='#e6dfc8'; c.fillRect(17,5+k*19,10,4); } c.fillStyle='#0a0a0a'; c.fillRect(6,42,32,3); rust(c,4,50,36,28,12,111); sgrain(c,w,h,10,112); });
  SPR.hook = mk(16,64,0.45,0.55,null,(c,e,w,h)=>{ c.fillStyle='#777'; for(let y=0;y<44;y+=4) c.fillRect(7,y,2,3); c.strokeStyle='#999'; c.lineWidth=2; c.beginPath(); c.moveTo(8,44); c.lineTo(8,54); c.arc(5,54,3,0,Math.PI); c.stroke(); c.fillStyle='#ece6d0'; c.fillRect(9,56,6,5); });
  SPR.stack = mk(56,120,1.0,0,[190,225,255],(c,e,w,h)=>{
    const t = cv(48,60); oldFridge(t.getContext('2d'), cv(48,60).getContext('2d'), 48,60,false,false,121);
    c.drawImage(t,4,60,48,60); c.save(); c.translate(30,30); c.rotate(0.08); c.drawImage(t,-24,-30,48,60); c.restore();
  });
  SPR.sauce = mk(48,64,0.5,0,null,(c,e,w,h)=>{
    c.fillStyle='#6b4a2a'; c.fillRect(4,30,40,34); c.fillStyle='#4a321a'; for(let y=30;y<64;y+=8) c.fillRect(4,y,40,1.5);
    c.fillStyle='#1a0f08'; rr(c,19,8,10,22,3); c.fill(); c.fillRect(22,2,4,8);
    c.fillStyle='#c41a12'; c.fillRect(21,0,6,4);
    c.fillStyle='#e8dcc0'; c.fillRect(19,16,10,7); c.fillStyle='#a11'; c.font='bold 4px '+TYPE; c.fillText('SOY',20,21);
    c.fillStyle='rgba(255,255,255,0.3)'; c.fillRect(21,10,1,14);
  });
  SPR.sauceGone = mk(48,64,0.5,0,null,(c,e,w,h)=>{ c.fillStyle='#6b4a2a'; c.fillRect(4,30,40,34); c.fillStyle='#4a321a'; for(let y=30;y<64;y+=8) c.fillRect(4,y,40,1.5); c.fillStyle='rgba(20,10,4,0.6)'; c.beginPath(); c.ellipse(24,31,6,1.5,0,0,7); c.fill(); });
  SPR.boombox = mk(48,32,0.18,0,[255,40,30],(c,e,w,h)=>{ c.fillStyle='#202022'; rr(c,2,6,44,24,3); c.fill(); c.strokeStyle='#555'; c.beginPath(); c.moveTo(8,6); c.lineTo(12,0); c.lineTo(36,0); c.lineTo(40,6); c.stroke(); c.fillStyle='#444'; c.beginPath(); c.arc(12,19,7,0,7); c.arc(36,19,7,0,7); c.fill(); c.fillStyle='#111'; c.fillRect(19,12,10,8); c.fillStyle='#e8e2cc'; c.fillRect(20,22,8,5); c.fillStyle='#000'; c.font='bold 5px '+TYPE; c.fillText('IC',21,27); e.fillStyle='rgba(255,255,255,1)'; e.fillRect(22,9,2,2); });
  SPR.magnet = mk(24,24,0.09,0,[120,255,140],(c,e,w,h)=>{ c.save(); c.translate(12,14); c.rotate(-0.4); c.fillStyle='#2c9c3a'; c.font='bold 18px Arial'; c.textAlign='center'; c.fillText('E',0,6); c.restore(); e.fillStyle='rgba(255,255,255,0.18)'; e.beginPath(); e.arc(12,13,10,0,7); e.fill(); });
  SPR.wurst = mk(32,16,0.06,0.42,null,(c,e,w,h)=>{ c.fillStyle='#7a3a22'; rr(c,3,5,26,7,3.5); c.fill(); c.fillStyle='rgba(255,200,160,0.35)'; c.fillRect(6,6,18,1.5); c.fillStyle='#3a1a0e'; for(let x=8;x<26;x+=5) c.fillRect(x,7,2,1); });
  SPR.watch = mk(24,16,0.05,0,[255,230,150],(c,e,w,h)=>{ c.fillStyle='#2a2420'; c.fillRect(1,7,22,3); c.fillStyle='#c9a64a'; c.beginPath(); c.arc(12,8,5,0,7); c.fill(); c.fillStyle='#f0ecd8'; c.beginPath(); c.arc(12,8,3.6,0,7); c.fill(); c.fillStyle='#111'; c.fillRect(12,5,0.8,3); e.fillStyle='rgba(255,255,255,0.25)'; e.beginPath(); e.arc(12,8,5,0,7); e.fill(); });
  SPR.miasma = mk(16,28,0.11,0.45,[200,150,255],(c,e,w,h)=>{ c.fillStyle='rgba(120,80,140,0.85)'; rr(c,3,8,10,18,2); c.fill(); c.fillStyle='#ccc'; c.fillRect(6,2,4,6); c.fillStyle='#111'; c.fillRect(7,0,2,3); c.fillStyle='#e8e2cc'; c.fillRect(4,14,8,6); c.fillStyle='#4a2050'; c.font='bold 3px Arial'; c.fillText('MIASMA',4,18); e.fillStyle='rgba(255,255,255,0.18)'; e.fillRect(3,8,10,18); });
  SPR.paper = mk(40,16,0.07,0.65,null,(c,e,w,h)=>{ c.save(); c.translate(20,9); c.rotate(-0.15); c.fillStyle='#d8d0b8'; c.fillRect(-17,-5,34,10); c.fillStyle='#333'; c.fillRect(-15,-4,30,2); for(let y=0;y<4;y++) c.fillRect(-15,-1+y*1.5,12,0.7); c.fillRect(-1,-1,14,4); c.restore(); });
  SPR.unit00 = SPR.tag;
  SPR.bulb = mk(16,48,0.26,0.74,[255,200,130],(c,e,w,h)=>{ c.fillStyle='#111'; c.fillRect(7,0,1.5,34); c.fillStyle='#333'; c.fillRect(5,32,6,5); c.fillStyle='#f5e6b0'; c.beginPath(); c.arc(8,42,5,0,7); c.fill(); e.fillStyle='rgba(255,255,255,1)'; e.beginPath(); e.arc(8,42,5,0,7); e.fill(); e.fillStyle='rgba(255,255,255,0.3)'; e.beginPath(); e.arc(8,42,8,0,7); e.fill(); });
  SPR.bulbOff = mk(16,48,0.26,0.74,null,(c,e,w,h)=>{ c.fillStyle='#111'; c.fillRect(7,0,1.5,34); c.fillStyle='#333'; c.fillRect(5,32,6,5); c.fillStyle='#4a463c'; c.beginPath(); c.arc(8,42,5,0,7); c.fill(); });
  const tube = (col, on)=>(c,e,w,h)=>{ c.fillStyle='#2a2c2c'; c.fillRect(0,0,w,5); c.fillStyle= on?'#e8f2ea':'#5a5e5c'; c.fillRect(3,5,w-6,4); if(on){ e.fillStyle='rgba(255,255,255,1)'; e.fillRect(3,5,w-6,4); e.fillStyle='rgba(255,255,255,0.35)'; e.fillRect(0,4,w,8); } };
  SPR.tube = mk(64,12,0.05,0.93,[200,255,215],tube(0,true));
  SPR.tubeOff = mk(64,12,0.05,0.93,null,tube(0,false));
  SPR.blue = mk(64,12,0.05,0.93,[120,170,255],tube(1,true));
  SPR.dust = mk(8,8,0.03,0.4,[255,255,255],(c,e)=>{ e.fillStyle='rgba(255,255,255,0.5)'; e.fillRect(3,3,2,2); });
}

/* ============================================================
   THE VENDOR
   a long grey shop coat. legs with a joint too many. arms that
   hang past the hem. no neck, a power cord where one goes.
   for a head, an old round-shouldered fridge with the door
   cracked open and a light on inside.
============================================================ */
const VW = 96, VH = 256;
function paintVendor(c, e, phase, door, seed){
  const r = rng(seed);
  const cx = VW/2, ground = VH-2;
  const s = Math.sin(phase*Math.PI*2), s2 = Math.sin(phase*Math.PI*2 + Math.PI);
  const hipY = 156;
  c.lineCap = 'round'; c.lineJoin = 'round';
  /* legs */
  function leg(side, sw){
    const hx = cx + side*7, fx = cx + side*9 + sw*11;
    const k1x = hx + side*6 + sw*3, k1y = hipY + 34;
    const k2x = hx + side*1 - sw*5, k2y = hipY + 66;
    c.strokeStyle = '#141416'; c.lineWidth = 6;
    c.beginPath(); c.moveTo(hx, hipY); c.lineTo(k1x, k1y); c.lineTo(k2x, k2y); c.lineTo(fx, ground-3); c.stroke();
    c.strokeStyle = '#26262a'; c.lineWidth = 2; c.beginPath(); c.moveTo(hx+1, hipY+2); c.lineTo(k1x+1, k1y); c.stroke();
    c.fillStyle = '#0c0c0e'; c.beginPath(); c.ellipse(fx + side*2, ground-2, 8, 3, 0, 0, 7); c.fill();
  }
  leg(-1, s); leg(1, s2);
  /* coat */
  const sway = s*2;
  const cg = c.createLinearGradient(cx-26,0,cx+26,0);
  cg.addColorStop(0,'#1c1b19'); cg.addColorStop(0.45,'#3a3732'); cg.addColorStop(1,'#181715');
  c.fillStyle = cg;
  c.beginPath();
  c.moveTo(cx-17, 80); c.lineTo(cx+17, 80);
  c.lineTo(cx+22+sway*0.5, 140); c.lineTo(cx+26+sway, 176);
  c.lineTo(cx+6, 172); c.lineTo(cx-4, 178); c.lineTo(cx-25+sway, 174);
  c.lineTo(cx-22+sway*0.5, 140); c.closePath(); c.fill();
  c.strokeStyle = 'rgba(0,0,0,0.6)'; c.lineWidth = 1; c.beginPath(); c.moveTo(cx, 84); c.lineTo(cx-2+sway*0.4, 172); c.stroke();
  /* stains, a name badge nobody filled in */
  for(let i=0;i<9;i++){ c.fillStyle='rgba(60,20,10,'+(0.2+r()*0.35).toFixed(2)+')'; c.beginPath(); c.arc(cx-16+r()*32, 110+r()*60, 1+r()*3.5, 0, 7); c.fill(); }
  c.fillStyle = '#d8d2bc'; c.fillRect(cx+5, 96, 9, 5); c.fillStyle='rgba(0,0,0,0.4)'; c.fillRect(cx+6, 98, 6, 0.8);
  c.fillStyle = 'rgba(0,0,0,0.35)'; c.fillRect(cx-14, 128, 9, 8); c.fillRect(cx+5, 128, 9, 8);
  /* arms. too long. */
  function arm(side, sw){
    const sx = cx + side*16, sy = 84;
    const ex = sx + side*7 + sw*3, ey = 134;
    const hx = sx + side*5 + sw*6, hy = 192;
    c.strokeStyle = '#1a1917'; c.lineWidth = 5.5;
    c.beginPath(); c.moveTo(sx, sy); c.lineTo(ex, ey); c.lineTo(hx, hy); c.stroke();
    c.strokeStyle = '#9a948a'; c.lineWidth = 1.4;
    for(let f=0; f<4; f++){
      const fx = hx + (f-1.5)*2.2*side, fl = 14 + f*2 + r()*3;
      c.beginPath(); c.moveTo(fx, hy+2); c.lineTo(fx + side*(f-1)*1.5, hy + fl*0.6); c.lineTo(fx + side*(f-1)*2.5, hy+fl); c.stroke();
    }
    c.fillStyle = '#8e887e'; c.beginPath(); c.ellipse(hx, hy+2, 3.5, 4, 0, 0, 7); c.fill();
  }
  arm(-1, s2); arm(1, s);
  /* the cord */
  c.strokeStyle = '#0e0e0e'; c.lineWidth = 3;
  c.beginPath(); c.moveTo(cx+4, 82); c.bezierCurveTo(cx+18, 76, cx-14, 72, cx+2, 68); c.stroke();
  /* head */
  c.save();
  const tilt = (s*0.035) + (r()-0.5)*0.02;
  c.translate(cx, 40); c.rotate(tilt);
  const hw = 50, hh = 70, hx = -hw/2, hy = -36;
  const hg = c.createLinearGradient(hx,0,hx+hw,0);
  hg.addColorStop(0,'#7a7462'); hg.addColorStop(0.35,'#cfc8ae'); hg.addColorStop(0.7,'#b7af93'); hg.addColorStop(1,'#625d4e');
  c.fillStyle = hg; rr(c,hx,hy,hw,hh,15); c.fill();
  c.strokeStyle='rgba(0,0,0,0.6)'; c.lineWidth=1.5; c.stroke();
  /* freezer door line, logo, a dent */
  c.fillStyle='rgba(0,0,0,0.45)'; c.fillRect(hx+3, hy+20, hw-6, 1.5);
  c.fillStyle='#d6dadd'; c.fillRect(hx+hw*0.3, hy+9, hw*0.4, 2.5);
  c.fillStyle='rgba(0,0,0,0.25)'; c.beginPath(); c.ellipse(hx+hw*0.25, hy+hh*0.7, 5, 3, 0.5, 0, 7); c.fill();
  /* magnets: S A L, the E fell off a long time ago */
  const mags = [['S','#c4241a'],['A','#1a5ac4'],['L','#e0b020']];
  c.font = 'bold 7px Arial';
  mags.forEach((m,i)=>{ c.fillStyle = m[1]; c.fillText(m[0], hx+8+i*7, hy+16 + (i%2)); });
  /* handle on the right */
  c.fillStyle='#e2e6e8'; rr(c, hx+hw-8, hy+26, 3.5, 22, 1.5); c.fill();
  rust(c, hx, hy+hh*0.55, hw, hh*0.45, 30, seed+5); rust(c, hx, hy, hw, hh*0.3, 10, seed+6);
  /* the door. hinged right, the gap opens on the left and down the middle,
     and inside there are wire shelves like a mouth full of grille. */
  const gap = 2 + door*22;
  const gx = hx + 6, gy = hy + 26, gh = hh - 32;
  c.fillStyle = '#040303'; c.fillRect(gx, gy, gap, gh);
  if(door > 0.3){
    c.strokeStyle = 'rgba(60,40,30,0.95)'; c.lineWidth = 1;
    for(let k=0;k<4;k++){ const yy = gy + 6 + k*(gh-8)/3; c.beginPath(); c.moveTo(gx, yy); for(let x=gx; x<=gx+gap; x+=3) c.lineTo(x, yy + ((x/3)%2?1.5:0)); c.stroke(); }
  }
  /* door slab swung toward the viewer a little */
  c.fillStyle = '#b5ae94'; c.fillRect(gx+gap, gy-1, 3, gh+2);
  c.restore();
  /* emissive: what's lit inside */
  e.save(); e.translate(cx, 40); e.rotate(tilt);
  const ex = -25+6, ey = -36+26, eh = 70-32;
  const lg = e.createLinearGradient(ex,0,ex+gap,0);
  lg.addColorStop(0,'rgba(255,255,255,0.55)'); lg.addColorStop(0.5,'rgba(255,255,255,1)'); lg.addColorStop(1,'rgba(255,255,255,0.75)');
  e.fillStyle = lg; e.fillRect(ex+0.5, ey+1, Math.max(1, gap-1), eh-2);
  if(door > 0.3){
    e.globalCompositeOperation = 'destination-out';
    e.fillStyle = 'rgba(0,0,0,0.85)';
    for(let k=0;k<4;k++){ const yy = ey + 6 + k*(eh-8)/3; e.fillRect(ex, yy, gap, 1.4); }
    e.globalCompositeOperation = 'source-over';
  }
  e.fillStyle = 'rgba(255,255,255,0.22)'; e.fillRect(ex-3, ey-3, gap+6, eh+6);
  e.restore();
}
const VEN = B.VEN = { frames:[], N:8, doors:[0.12,0.45,0.95] };
function buildVendor(){
  VEN.frames = [];
  for(let d=0; d<VEN.doors.length; d++){
    const row = [];
    for(let f=0; f<VEN.N; f++){
      row.push(mk(VW, VH, 1.0, 0, [255,200,150], (c,e)=>paintVendor(c, e, f/VEN.N, VEN.doors[d], 900 + f*3 + d)));
    }
    VEN.frames.push(row);
  }
}

/* ============================================================
   THE CATCH
   full screen, full resolution. drawn fresh every frame so it
   can breathe and shake.
============================================================ */
let scareNoise = null;
function noiseTile(){
  if(scareNoise) return scareNoise;
  const c = cv(256,256), x = c.getContext('2d'), id = x.createImageData(256,256), d = id.data;
  for(let i=0;i<d.length;i+=4){ const v = (Math.random()*255)|0; d[i]=d[i+1]=d[i+2]=v; d[i+3]=255; }
  x.putImageData(id,0,0); scareNoise = c; return c;
}
B.paintScare = function(ctx, W, H, p, opts){
  opts = opts || {};
  const glow = opts.glow || [255,40,20];
  const t = performance.now()/1000;
  const frozen = !!opts.freeze;
  /* a black frame now and then, like the picture can't keep up */
  if(!frozen && p > 0.2 && p < 0.95 && Math.random() < 0.12){ ctx.fillStyle = '#000'; ctx.fillRect(0,0,W,H); return; }
  const jit = frozen ? 1.5 : (1-p*0.2)*22*p;
  const scale = (frozen ? 1.9 : 0.6 + p*1.55);
  const cx = W/2 + (Math.random()-0.5)*jit, cy = H*0.52 + (Math.random()-0.5)*jit;
  const r = rng(77);
  ctx.save();
  ctx.fillStyle = '#000'; ctx.fillRect(0,0,W,H);
  ctx.translate(cx, cy); ctx.scale(scale, scale); ctx.rotate((frozen ? 0 : (Math.random()-0.5)*0.04*p) + 0.03);
  const u = Math.min(W,H)*0.6;
  const hw = u*1.15, hh = u*1.55;
  /* the enamel, filthy */
  const g = ctx.createLinearGradient(-hw/2,0,hw/2,0);
  g.addColorStop(0,'#1c1912'); g.addColorStop(0.28,'#6b6552'); g.addColorStop(0.6,'#575140'); g.addColorStop(1,'#14120c');
  ctx.fillStyle = g; rr(ctx,-hw/2,-hh/2,hw,hh,u*0.28); ctx.fill();
  for(let i=0;i<220;i++){ ctx.fillStyle='rgba('+(60+r()*50|0)+','+(22+r()*18|0)+',8,'+(0.2+r()*0.5).toFixed(2)+')'; ctx.beginPath(); ctx.arc(-hw/2+r()*hw, -hh/2+r()*hh, 1+r()*u*0.03, 0, 7); ctx.fill(); }
  ctx.strokeStyle='rgba(0,0,0,0.5)'; ctx.lineWidth=1.2;
  for(let i=0;i<60;i++){ const x=-hw/2+r()*hw, y=-hh/2+r()*hh; ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(x+(r()-0.5)*u*0.25, y+(r()-0.5)*u*0.08); ctx.stroke(); }
  /* the opening */
  const open = opts.open !== undefined ? opts.open : Math.min(1, 0.35 + p*0.9);
  const ow = hw*0.8*open, oh = hh*0.64, ox = -hw*0.38, oy = -hh*0.2;
  ctx.fillStyle = '#050000'; ctx.fillRect(ox, oy, ow, oh);
  const ig = ctx.createRadialGradient(ox+ow*0.5, oy+oh*0.55, 2, ox+ow*0.5, oy+oh*0.5, Math.max(ow,oh)*0.7);
  ig.addColorStop(0,'rgba('+glow[0]+','+Math.min(255,glow[1]+90)+','+Math.min(255,glow[2]+60)+',1)');
  ig.addColorStop(0.3,'rgba('+glow.join(',')+',0.9)');
  ig.addColorStop(0.75,'rgba('+(glow[0]*0.25|0)+','+(glow[1]*0.15|0)+',0,1)');
  ig.addColorStop(1,'rgba(4,0,0,1)');
  ctx.fillStyle = ig; ctx.fillRect(ox, oy, ow, oh);
  ctx.save(); ctx.beginPath(); ctx.rect(ox, oy, ow, oh); ctx.clip();
  /* silhouettes on the shelves: shoes, a hand, a watch, tags. all black against the light. */
  const shelfY = [0.24, 0.47, 0.7, 0.93].map(k=>oy + oh*k);
  ctx.fillStyle = '#060101';
  shelfY.forEach((yy, k)=>{
    let x = ox + u*0.02;
    const rr2 = rng(300+k);
    while(x < ox + ow){
      const kind = rr2(), w = u*(0.05 + rr2()*0.08), h = oh*(0.06 + rr2()*0.12);
      if(kind < 0.3){ ctx.beginPath(); ctx.ellipse(x+w/2, yy - h*0.25, w/2, h*0.28, 0, 0, 7); ctx.fill(); }
      else if(kind < 0.42){
        /* fingers, hanging over the edge */
        for(let f=0; f<4; f++){ ctx.fillRect(x + f*w*0.22, yy - h*0.2, w*0.12, h*(0.9 + f%2*0.3)); }
        ctx.fillRect(x - w*0.05, yy - h*0.45, w*0.95, h*0.32);
      }
      else if(kind < 0.55){ ctx.beginPath(); ctx.arc(x+w/2, yy-h*0.5, h*0.4, 0, 7); ctx.fill(); }
      else if(kind < 0.75){ ctx.fillRect(x, yy - h, w*0.7, h); }
      x += w + u*(0.01 + rr2()*0.05);
    }
  });
  /* tags hanging from the shelf above, one for each time */
  const n = Math.min(14, opts.tags||0);
  for(let i=0;i<n;i++){
    const tx = ox + ow*(0.08 + (i%7)*0.13), base = shelfY[Math.floor(i/7)] - oh*0.23 + oh*0.02, ty = base + Math.sin(t*1.7+i)*u*0.006;
    ctx.strokeStyle='rgba(0,0,0,0.9)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(tx, base - u*0.03); ctx.lineTo(tx, ty); ctx.stroke();
    ctx.fillStyle='rgba(230,215,190,0.85)'; ctx.fillRect(tx-u*0.016, ty, u*0.032, u*0.022);
  }
  /* the wire racks: a grille of thin bars, which from here looks like a mouth */
  shelfY.forEach(yy=>{
    ctx.fillStyle = 'rgba(20,10,8,0.95)'; ctx.fillRect(ox, yy - u*0.006, ow, u*0.013);
    ctx.fillStyle = 'rgba(255,200,170,0.25)'; ctx.fillRect(ox, yy - u*0.006, ow, u*0.002);
    for(let x=ox; x<ox+ow; x+=u*0.022){
      ctx.fillStyle = 'rgba(16,8,6,0.95)'; ctx.fillRect(x, yy - u*0.05, u*0.004, u*0.05);
      ctx.fillStyle = 'rgba(16,8,6,0.9)'; ctx.fillRect(x + u*0.001, yy, u*0.003, u*0.018 + ((x*7)%5)*u*0.004);
    }
  });
  /* frost breathing out */
  for(let i=0;i<70;i++){ const a = r()*Math.PI*2, d = (t*0.5 + r())%1; ctx.fillStyle='rgba(225,235,255,'+(0.22*(1-d)).toFixed(2)+')'; ctx.beginPath(); ctx.arc(ox+ow*0.5+Math.cos(a)*d*ow*0.7, oy+oh*0.5+Math.sin(a)*d*oh*0.6, 1+d*u*0.02, 0, 7); ctx.fill(); }
  ctx.restore();
  /* rust bleeding down out of the seam */
  for(let i=0;i<14;i++){ const x = ox + r()*ow, l = u*(0.05 + r()*0.25); const gg = ctx.createLinearGradient(0, oy+oh, 0, oy+oh+l); gg.addColorStop(0,'rgba(70,18,6,0.9)'); gg.addColorStop(1,'rgba(70,18,6,0)'); ctx.fillStyle = gg; ctx.fillRect(x, oy+oh, u*0.006, l); }
  /* the door slab, swinging at you */
  ctx.fillStyle = '#4c473a';
  ctx.beginPath();
  ctx.moveTo(ox+ow, oy-u*0.02); ctx.lineTo(ox+ow+u*0.22*open, oy-u*0.14*open);
  ctx.lineTo(ox+ow+u*0.22*open, oy+oh+u*0.14*open); ctx.lineTo(ox+ow, oy+oh+u*0.02); ctx.closePath(); ctx.fill();
  ctx.fillStyle='rgba(0,0,0,0.6)'; ctx.fillRect(ox+ow, oy, u*0.015, oh);
  /* magnets */
  ctx.font = 'bold '+(u*0.09|0)+'px Arial';
  [['S','#7a1a12'],['A','#1a3a7a'],['L','#8a6a14']].forEach((m,i)=>{ ctx.fillStyle=m[1]; ctx.fillText(m[0], -hw*0.32+i*u*0.1, -hh*0.33 + (i%2)*u*0.02); });
  ctx.restore();
  /* tearing: slices of the picture slip sideways */
  if(!frozen && p > 0.25){
    for(let k=0;k<4;k++){ const y = (Math.random()*H)|0, h = (4 + Math.random()*H*0.05)|0, dx = ((Math.random()-0.5)*W*0.08*p)|0; try{ ctx.drawImage(ctx.canvas, 0, y, W, h, dx, y, W, h); }catch(e){} }
  }
  /* grain */
  const nz = noiseTile();
  ctx.save(); ctx.globalAlpha = frozen ? 0.07 : 0.16 + p*0.12; ctx.globalCompositeOperation = 'overlay';
  const ox2 = -Math.random()*256, oy2 = -Math.random()*256;
  for(let y=oy2; y<H; y+=256) for(let x=ox2; x<W; x+=256) ctx.drawImage(nz, x, y);
  ctx.restore();
  const vg = ctx.createRadialGradient(W/2,H/2,Math.min(W,H)*0.18,W/2,H/2,Math.max(W,H)*0.72);
  vg.addColorStop(0,'rgba(0,0,0,0)'); vg.addColorStop(1,'rgba(0,0,0,'+(frozen?0.88:0.96)+')');
  ctx.fillStyle = vg; ctx.fillRect(0,0,W,H);
  if(!frozen && p > 0.15){ ctx.fillStyle = 'rgba(150,0,0,'+(0.22*p).toFixed(2)+')'; ctx.fillRect(0,0,W,H); }
};

/* ---------- BAKE ---------- */
B.tex = {}; B.ftex = {}; B.ctex = {};
B.bakeTally = function(deaths){
  const s = 128, c = cv(s,s), ctx = c.getContext('2d');
  paintTally(ctx, s, deaths);
  B.tex[T.tally] = toTex(c);
};
function bakeMsg(id, hidden){
  const s = 128, c = cv(s,s), ctx = c.getContext('2d');
  const base = cv(64,64); P[B.msgBase[id]](base.getContext('2d'), 64, rng(500+id));
  ctx.imageSmoothingEnabled = false; ctx.drawImage(base, 0, 0, s, s);
  if(!hidden){
    const m = MSG[id];
    scrawl(ctx, s, m.lines, { color:m.color, size:s*m.size, drip:m.drip, font:m.font, tilt:m.tilt, seed:id*13 });
  }
  return toTex(c);
}
B.hiddenTex = {};
let fontsAsked = false;
B.loadFonts = function(){
  if(fontsAsked) return B._fontsP;
  fontsAsked = true;
  const want = [ '40px "Reenie Beanie"', '20px "Special Elite"' ];
  const p = (document.fonts && document.fonts.load) ? Promise.all(want.map(f=>document.fonts.load(f).catch(()=>null))) : Promise.resolve();
  B._fontsP = Promise.race([ p, new Promise(res=>setTimeout(res, 1800)) ]);
  return B._fontsP;
};
let baked = false;
B.bake = function(deaths){
  if(!baked){
    for(const k in P){
      const id = +k; const s = 64; const c = cv(s,s);
      P[id](c.getContext('2d'), s, rng(100+id));
      B.tex[id] = toTex(c);
    }
    for(const k in MSG){
      const id = +k;
      if(B.hiddenMsg[id]){ B.hiddenTex[id] = bakeMsg(id, false); B.tex[id] = bakeMsg(id, true); }
      else B.tex[id] = bakeMsg(id, false);
    }
    for(const k in PF){ const id=+k, c=cv(64,64); PF[id](c.getContext('2d'),64,rng(300+id)); B.ftex[id] = toTex(c); }
    for(const k in PC){ const id=+k, c=cv(64,64); PC[id](c.getContext('2d'),64,rng(400+id)); B.ctex[id] = toTex(c); }
    buildSprites();
    buildVendor();
    baked = true;
  }
  B.bakeTally(deaths||0);
};

B.rng = rng; B.cv = cv;
})();
