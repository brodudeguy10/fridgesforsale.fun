/* ============================================================
   FRIDGE PALACE: every surface, painted in code
============================================================ */
import * as THREE from '../lib/three.module.min.js';

export function canvas(w, h){ const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
export function tex(c, o){
  o = o || {};
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = o.linear ? THREE.NoColorSpace : THREE.SRGBColorSpace;
  if(o.repeat){ t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(o.repeat[0], o.repeat[1]); }
  t.anisotropy = o.aniso || 8;
  if(o.nomip){ t.generateMipmaps = false; t.minFilter = THREE.LinearFilter; }
  return t;
}
/* value noise, tileable at the given period */
function hash2(x, y, s){ let h = (x*374761393 + y*668265263 + s*1442695041) | 0; h = (h ^ (h >>> 13))*1274126177; return ((h ^ (h >>> 16)) >>> 0)/4294967296; }
function vnoise(x, y, p, s){
  const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
  const u = xf*xf*(3 - 2*xf), v = yf*yf*(3 - 2*yf);
  const m = (a)=>((a % p) + p) % p;
  const a = hash2(m(xi), m(yi), s), b = hash2(m(xi + 1), m(yi), s), c = hash2(m(xi), m(yi + 1), s), d = hash2(m(xi + 1), m(yi + 1), s);
  return a + (b - a)*u + (c - a)*v + (a - b - c + d)*u*v;
}
export function fbm(x, y, p, oct, s){ let v = 0, amp = 0.5, f = 1, tot = 0; for(let i=0;i<oct;i++){ v += vnoise(x*f, y*f, p*f, s + i*17)*amp; tot += amp; amp *= 0.5; f *= 2; } return v/tot; }

const cache = {};
function once(k, fn){ return cache[k] || (cache[k] = fn()); }

/* ---------- carpet: loud, red, gold, a little teal. look closer for fridges ---------- */
export function carpet(){
  return once('carpet', ()=>{
    const S = 512, c = canvas(S, S), g = c.getContext('2d');
    g.fillStyle = '#4a0d18'; g.fillRect(0, 0, S, S);
    /* mottled base */
    const id = g.getImageData(0, 0, S, S), d = id.data;
    for(let y=0;y<S;y++) for(let x=0;x<S;x++){ const n = fbm(x/64, y/64, 8, 4, 3), i = (y*S + x)*4; d[i] = 70 + n*40; d[i+1] = 12 + n*10; d[i+2] = 24 + n*14; d[i+3] = 255; }
    g.putImageData(id, 0, 0);
    const motif = (cx, cy, r)=>{
      g.save(); g.translate(cx, cy);
      g.strokeStyle = '#d9a53a'; g.lineWidth = 6; g.beginPath(); for(let i=0;i<8;i++){ const a = i*Math.PI/4; g.moveTo(0, 0); g.lineTo(Math.cos(a)*r, Math.sin(a)*r); } g.stroke();
      g.fillStyle = '#1d6d6a'; g.beginPath(); g.arc(0, 0, r*0.55, 0, 7); g.fill();
      g.strokeStyle = '#f2c95a'; g.lineWidth = 4; g.beginPath(); g.arc(0, 0, r*0.55, 0, 7); g.stroke();
      g.fillStyle = '#7e1424'; g.beginPath(); for(let i=0;i<12;i++){ const a = i*Math.PI/6, rr = i%2 ? r*0.22 : r*0.42; i ? g.lineTo(Math.cos(a)*rr, Math.sin(a)*rr) : g.moveTo(Math.cos(a)*rr, Math.sin(a)*rr); } g.closePath(); g.fill();
      /* a tiny fridge in the middle of every medallion */
      g.fillStyle = '#f2e6c8'; g.fillRect(-7, -11, 14, 22); g.fillStyle = '#7e1424'; g.fillRect(-7, -3, 14, 1.5); g.fillRect(3, -9, 1.5, 4); g.fillRect(3, 0, 1.5, 6);
      g.restore();
    };
    const pts = [[0,0],[S,0],[0,S],[S,S],[S/2,S/2]];
    pts.forEach(p=>motif(p[0], p[1], 92));
    /* swirls between the medallions */
    g.strokeStyle = 'rgba(232,180,70,0.85)'; g.lineWidth = 5;
    [[S/2,0],[0,S/2],[S,S/2],[S/2,S]].forEach(([x,y])=>{
      g.save(); g.translate(x, y);
      for(let k=0;k<4;k++){ g.rotate(Math.PI/2); g.beginPath(); for(let t=0;t<5.5;t+=0.1){ const r = 6 + t*9; const px = Math.cos(t)*r, py = Math.sin(t)*r + 30; t ? g.lineTo(px, py) : g.moveTo(px, py); } g.stroke(); }
      g.fillStyle = '#1d6d6a'; g.beginPath(); g.arc(0, 0, 14, 0, 7); g.fill();
      g.restore();
    });
    /* scattered diamonds */
    g.fillStyle = 'rgba(29,109,106,0.9)';
    for(let i=0;i<40;i++){ const x = hash2(i, 1, 5)*S, y = hash2(i, 2, 5)*S; g.save(); g.translate(x, y); g.rotate(Math.PI/4); g.fillRect(-4, -4, 8, 8); g.restore(); }
    return tex(c, { repeat:[1,1] });
  });
}
export function marble(base, vein, k){
  return once('marble' + base + vein + (k || 0), ()=>{
    const S = 512, c = canvas(S, S), g = c.getContext('2d'), id = g.createImageData(S, S), d = id.data;
    const b = new THREE.Color(base), v = new THREE.Color(vein);
    for(let y=0;y<S;y++) for(let x=0;x<S;x++){
      const n = fbm(x/128, y/128, 4, 5, 11 + (k || 0));
      const w = Math.abs(Math.sin((x/S*3 + y/S*2 + n*4.5)*Math.PI));
      const vv = Math.pow(1 - w, 9)*0.9 + fbm(x/32, y/32, 16, 2, 7)*0.06;
      const i = (y*S + x)*4;
      d[i] = (b.r*(1 - vv) + v.r*vv)*255; d[i+1] = (b.g*(1 - vv) + v.g*vv)*255; d[i+2] = (b.b*(1 - vv) + v.b*vv)*255; d[i+3] = 255;
    }
    g.putImageData(id, 0, 0);
    return tex(c, { repeat:[1,1] });
  });
}
export function wood(){
  return once('wood', ()=>{
    const W = 512, H = 512, c = canvas(W, H), g = c.getContext('2d'), id = g.createImageData(W, H), d = id.data;
    for(let y=0;y<H;y++) for(let x=0;x<W;x++){
      const n = fbm(x/256, y/32, 2, 4, 21);
      const ring = Math.sin((y/H*18 + n*6)*Math.PI*2)*0.5 + 0.5;
      const t = 0.55 + ring*0.25 + fbm(x/16, y/4, 32, 2, 3)*0.2;
      const i = (y*W + x)*4; d[i] = 70*t + 20; d[i+1] = 28*t + 8; d[i+2] = 18*t + 4; d[i+3] = 255;
    }
    g.putImageData(id, 0, 0);
    return tex(c, { repeat:[1,1] });
  });
}
export function damask(){
  return once('damask', ()=>{
    const S = 256, c = canvas(S, S), g = c.getContext('2d');
    g.fillStyle = '#0f2f33'; g.fillRect(0, 0, S, S);
    g.fillStyle = 'rgba(205,160,70,0.55)';
    const leaf = (x, y, s)=>{ g.save(); g.translate(x, y); g.scale(s, s);
      g.beginPath(); g.moveTo(0, -40); g.bezierCurveTo(25, -30, 30, -5, 0, 0); g.bezierCurveTo(-30, -5, -25, -30, 0, -40); g.fill();
      g.beginPath(); g.moveTo(0, 40); g.bezierCurveTo(25, 30, 30, 5, 0, 0); g.bezierCurveTo(-30, 5, -25, 30, 0, 40); g.fill();
      g.beginPath(); g.moveTo(-40, 0); g.bezierCurveTo(-30, 18, -6, 16, 0, 0); g.bezierCurveTo(-6, -16, -30, -18, -40, 0); g.fill();
      g.beginPath(); g.moveTo(40, 0); g.bezierCurveTo(30, 18, 6, 16, 0, 0); g.bezierCurveTo(6, -16, 30, -18, 40, 0); g.fill();
      g.beginPath(); g.arc(0, 0, 6, 0, 7); g.fill(); g.restore(); };
    leaf(S/2, S/2, 1); leaf(0, 0, 0.6); leaf(S, 0, 0.6); leaf(0, S, 0.6); leaf(S, S, 0.6);
    g.strokeStyle = 'rgba(205,160,70,0.25)'; g.lineWidth = 2; for(let x=0;x<=S;x+=S/2){ g.beginPath(); g.moveTo(x, 0); g.lineTo(x, S); g.stroke(); }
    return tex(c, { repeat:[1,1] });
  });
}
export function coffer(){
  return once('coffer', ()=>{
    const S = 256, c = canvas(S, S), g = c.getContext('2d');
    g.fillStyle = '#1a1018'; g.fillRect(0, 0, S, S);
    const gr = g.createLinearGradient(0, 0, S, S); gr.addColorStop(0, '#3a2430'); gr.addColorStop(1, '#170c14');
    g.fillStyle = gr; g.fillRect(18, 18, S - 36, S - 36);
    g.strokeStyle = '#b8862e'; g.lineWidth = 6; g.strokeRect(10, 10, S - 20, S - 20);
    g.lineWidth = 2; g.strokeRect(30, 30, S - 60, S - 60);
    g.fillStyle = '#d4a443'; [[30,30],[S-30,30],[30,S-30],[S-30,S-30]].forEach(([x,y])=>{ g.beginPath(); g.arc(x, y, 5, 0, 7); g.fill(); });
    return tex(c, { repeat:[1,1] });
  });
}
export function tiles(a, b, n){
  return once('tiles' + a + b + n, ()=>{
    const S = 256, c = canvas(S, S), g = c.getContext('2d'), s = S/(n || 4);
    for(let y=0;y<(n||4);y++) for(let x=0;x<(n||4);x++){ g.fillStyle = (x + y) % 2 ? a : b; g.fillRect(x*s, y*s, s, s); }
    g.strokeStyle = 'rgba(0,0,0,0.25)'; g.lineWidth = 2; for(let i=0;i<=S;i+=s){ g.beginPath(); g.moveTo(i, 0); g.lineTo(i, S); g.moveTo(0, i); g.lineTo(S, i); g.stroke(); }
    return tex(c, { repeat:[1,1] });
  });
}
export function concrete(){
  return once('concrete', ()=>{
    const S = 256, c = canvas(S, S), g = c.getContext('2d'), id = g.createImageData(S, S), d = id.data;
    for(let y=0;y<S;y++) for(let x=0;x<S;x++){ const n = fbm(x/40, y/40, 6.4, 5, 9), i = (y*S + x)*4, v = 70 + n*50; d[i] = v; d[i+1] = v*0.98; d[i+2] = v*0.95; d[i+3] = 255; }
    g.putImageData(id, 0, 0);
    return tex(c, { repeat:[1,1] });
  });
}
/* text that glows. bloom does the rest */
export function neon(text, color, o){
  o = o || {};
  const font = o.font || '"Pacifico", "Brush Script MT", cursive';
  const size = o.size || 120;
  const m = canvas(10, 10).getContext('2d'); m.font = `${o.weight || 400} ${size}px ${font}`;
  const w = Math.ceil(m.measureText(text).width + size*0.9), h = Math.ceil(size*1.7);
  const c = canvas(w, h), g = c.getContext('2d');
  g.font = `${o.weight || 400} ${size}px ${font}`; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.shadowColor = color; g.shadowBlur = size*0.35; g.fillStyle = color;
  g.fillText(text, w/2, h/2); g.shadowBlur = size*0.12; g.fillText(text, w/2, h/2);
  g.shadowBlur = 0; g.fillStyle = 'rgba(255,255,255,0.85)'; g.lineWidth = size*0.03;
  g.strokeStyle = 'rgba(255,255,255,0.9)'; g.strokeText(text, w/2, h/2);
  const t = tex(c, { nomip:true }); t.userData = { w, h };
  return t;
}
export function logo(){
  return once('logo', ()=>{
    const W = 1024, H = 512, c = canvas(W, H), g = c.getContext('2d');
    g.clearRect(0, 0, W, H);
    /* a diamond made of fridge doors */
    g.save(); g.translate(W/2, 170);
    const dg = g.createLinearGradient(-120, -120, 120, 120); dg.addColorStop(0, '#fff6d0'); dg.addColorStop(0.5, '#e7b74a'); dg.addColorStop(1, '#8a5a12');
    g.fillStyle = dg; g.beginPath(); g.moveTo(0, -130); g.lineTo(120, -40); g.lineTo(0, 130); g.lineTo(-120, -40); g.closePath(); g.fill();
    g.strokeStyle = '#4a2c06'; g.lineWidth = 6; g.stroke();
    g.beginPath(); g.moveTo(-120, -40); g.lineTo(120, -40); g.moveTo(-50, -40); g.lineTo(0, 130); g.lineTo(50, -40); g.moveTo(-50, -40); g.lineTo(0, -130); g.lineTo(50, -40); g.stroke();
    g.fillStyle = '#4a2c06'; g.fillRect(14, -25, 8, 40); g.fillRect(14, 30, 8, 30);
    g.restore();
    g.textAlign = 'center'; g.fillStyle = '#f5d27a'; g.shadowColor = '#ffb020'; g.shadowBlur = 24;
    g.font = '700 108px "Cinzel", "Times New Roman", serif'; g.fillText('FRIDGE PALACE', W/2, 410);
    g.shadowBlur = 0; g.font = '400 34px "Cinzel", "Times New Roman", serif'; g.fillStyle = '#e8c87a'; g.fillText('CASINO  ·  RESORT  ·  COLD STORAGE', W/2, 465);
    return tex(c, { nomip:false });
  });
}
/* a sign: text on a dark plate with a gold rim */
export function plate(text, o){
  o = o || {};
  const W = o.w || 512, H = o.h || 128, c = canvas(W, H), g = c.getContext('2d');
  g.fillStyle = o.bg || '#140c10'; g.fillRect(0, 0, W, H);
  g.strokeStyle = o.rim || '#c8963a'; g.lineWidth = 8; g.strokeRect(6, 6, W - 12, H - 12);
  g.fillStyle = o.fg || '#f0d28a'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.font = `${o.weight || 700} ${o.size || 54}px ${o.font || '"Cinzel", "Times New Roman", serif'}`;
  const lines = String(text).split('\n'); lines.forEach((l, i)=>g.fillText(l, W/2, H/2 + (i - (lines.length - 1)/2)*(o.size || 54)*1.15));
  return tex(c);
}
export function velvet(){
  return once('velvet', ()=>{
    const S = 128, c = canvas(S, S), g = c.getContext('2d'), id = g.createImageData(S, S), d = id.data;
    for(let y=0;y<S;y++) for(let x=0;x<S;x++){ const n = fbm(x/16, y/16, 8, 3, 2), i = (y*S + x)*4; d[i] = 110 + n*60; d[i+1] = 8 + n*10; d[i+2] = 22 + n*14; d[i+3] = 255; }
    g.putImageData(id, 0, 0); return tex(c, { repeat:[1,1] });
  });
}
export function leather(col){
  return once('leather' + col, ()=>{
    const S = 128, c = canvas(S, S), g = c.getContext('2d'), id = g.createImageData(S, S), d = id.data, b = new THREE.Color(col);
    for(let y=0;y<S;y++) for(let x=0;x<S;x++){ const n = fbm(x/6, y/6, 21.333, 3, 4), i = (y*S + x)*4, v = 0.8 + n*0.4; d[i] = b.r*255*v; d[i+1] = b.g*255*v; d[i+2] = b.b*255*v; d[i+3] = 255; }
    g.putImageData(id, 0, 0); return tex(c, { repeat:[1,1] });
  });
}
