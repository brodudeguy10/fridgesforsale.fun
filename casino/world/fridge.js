/* ============================================================
   FRIDGE PALACE: fridges. the guests, the staff, the furniture.
   every one is built from boxes, a face screen and two little arms.
============================================================ */
import * as THREE from '../lib/three.module.min.js';
import { RoundedBoxGeometry } from '../lib/addons/geometries/RoundedBoxGeometry.js';
import { canvas, tex } from './textures.js';
import { mergeGeometries } from '../lib/addons/utils/BufferGeometryUtils.js';

const geoCache = {};
function rbox(w, h, d, r){ const k = [w, h, d, r].map(v=>v.toFixed(3)).join(','); return geoCache[k] || (geoCache[k] = new RoundedBoxGeometry(w, h, d, 3, r)); }
const BOX = new THREE.BoxGeometry(1, 1, 1);
const CYL = new THREE.CylinderGeometry(1, 1, 1, 18);
const SPH = new THREE.SphereGeometry(1, 16, 12);
const CONE = new THREE.ConeGeometry(1, 1, 16);
const matCache = {};
function mat(color, rough, metal){ const k = color + ':' + rough + ':' + metal; return matCache[k] || (matCache[k] = new THREE.MeshStandardMaterial({ color, roughness:rough === undefined ? 0.35 : rough, metalness:metal || 0 })); }
const DARK = mat('#0a0a0c', 0.6, 0.1), CHROME = mat('#e8e8ec', 0.12, 1), GOLD = mat('#e0aa45', 0.25, 1), WHITE = mat('#f4f4f4', 0.5, 0), RUBBER = mat('#1a1a1a', 0.9, 0);
function part(geo, m, x, y, z, sx, sy, sz){ const o = new THREE.Mesh(geo, m); o.position.set(x, y, z); o.scale.set(sx, sy, sz); return o; }

/* ---------- the face ---------- */
export class Face {
  constructor(o){
    this.c = canvas(128, 96); this.g = this.c.getContext('2d');
    this.t = tex(this.c, { nomip:true });
    this.col = o.eye || '#7ff3ff';
    this.bg = o.screen || '#05111a';
    this.mood = 'neutral'; this.talk = 0; this.blink = 0; this.nextBlink = 1 + Math.random()*3;
    this.look = { x:0, y:0 }; this.lookT = { x:0, y:0 }; this.acc = 0; this.shades = !!o.shades; this.moodT = 0;
    this.draw();
  }
  set(m, dur){ this.mood = m; this.moodT = dur || 0; this.draw(); }
  update(dt, near){
    this.acc += dt;
    this.nextBlink -= dt; if(this.nextBlink < 0){ this.blink = 0.14; this.nextBlink = 2 + Math.random()*4; }
    if(this.blink > 0) this.blink -= dt;
    if(this.moodT > 0){ this.moodT -= dt; if(this.moodT <= 0) this.mood = 'neutral'; }
    if(Math.random() < dt*0.4){ this.lookT.x = (Math.random() - 0.5)*1.2; this.lookT.y = (Math.random() - 0.5)*0.6; }
    this.look.x += (this.lookT.x - this.look.x)*Math.min(1, dt*6); this.look.y += (this.lookT.y - this.look.y)*Math.min(1, dt*6);
    if(this.talking > 0){ this.talking -= dt; this.talk = 0.3 + Math.abs(Math.sin(this.acc*18))*0.7*(Math.sin(this.acc*5) > -0.6 ? 1 : 0.1); } else this.talk *= 0.8;
    if(near && this.acc > 1/14){ this.acc = 0; this.draw(); }
  }
  say(sec){ this.talking = sec; }
  draw(){
    const g = this.g, W = 128, H = 96, c = this.col;
    g.fillStyle = this.bg; g.fillRect(0, 0, W, H);
    g.fillStyle = 'rgba(255,255,255,0.03)'; for(let y=0;y<H;y+=3) g.fillRect(0, y, W, 1);
    g.fillStyle = c; g.strokeStyle = c; g.lineWidth = 6; g.lineCap = 'round';
    g.shadowColor = c; g.shadowBlur = 8;
    const lx = 40 + this.look.x*8, rx = 88 + this.look.x*8, ey = 38 + this.look.y*6;
    const m = this.mood, bl = this.blink > 0;
    /* a dead screen: static, then nothing */
    if(m === 'static' || m === 'off'){
      g.shadowBlur = 0;
      if(m === 'static'){ const id = g.getImageData(0, 0, W, H), dd = id.data; for(let i=0;i<dd.length;i+=4){ const v = Math.random() < 0.5 ? Math.random()*255 : 0; dd[i] = dd[i+1] = dd[i+2] = v; dd[i+3] = 255; } g.putImageData(id, 0, 0); if(Math.random() < 0.5){ g.fillStyle = c; g.globalAlpha = 0.6; g.fillRect(0, (Math.random()*H)|0, W, 3 + Math.random()*8); g.globalAlpha = 1; } }
      else { g.fillStyle = '#020203'; g.fillRect(0, 0, W, H); g.fillStyle = 'rgba(255,255,255,0.05)'; g.fillRect(60, 46, 8, 4); }
      this.t.needsUpdate = true; return;
    }
    const jit = m === 'hurt' && Math.random() < 0.3;
    if(jit){ g.save(); g.translate((Math.random() - 0.5)*10, 0); }
    const eye = (x)=>{
      if(bl || m === 'sleepy'){ g.beginPath(); g.moveTo(x - 10, ey + 2); g.lineTo(x + 10, ey + 2); g.stroke(); return; }
      if(m === 'happy' || m === 'laugh'){ g.beginPath(); g.arc(x, ey + 6, 11, Math.PI*1.1, Math.PI*1.9); g.stroke(); return; }
      if(m === 'money'){ g.font = 'bold 30px monospace'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('$', x, ey); return; }
      if(m === 'love'){ g.beginPath(); g.moveTo(x, ey + 10); g.bezierCurveTo(x - 16, ey - 2, x - 8, ey - 14, x, ey - 5); g.bezierCurveTo(x + 8, ey - 14, x + 16, ey - 2, x, ey + 10); g.fill(); return; }
      if(m === 'dead'){ g.beginPath(); g.moveTo(x - 8, ey - 8); g.lineTo(x + 8, ey + 8); g.moveTo(x + 8, ey - 8); g.lineTo(x - 8, ey + 8); g.stroke(); return; }
      if(m === 'shock'){ g.beginPath(); g.arc(x, ey, 11, 0, 7); g.lineWidth = 4; g.stroke(); g.lineWidth = 6; g.beginPath(); g.arc(x, ey, 3, 0, 7); g.fill(); return; }
      if(m === 'angry'){ g.beginPath(); g.moveTo(x - 11, ey - 8 + (x < 64 ? 0 : 6)); g.lineTo(x + 11, ey - 8 + (x < 64 ? 6 : 0)); g.stroke(); g.beginPath(); g.arc(x, ey + 3, 6, 0, 7); g.fill(); return; }
      if(m === 'sad'){ g.beginPath(); g.ellipse(x, ey + 2, 6, 9, 0, 0, 7); g.fill(); g.beginPath(); g.moveTo(x - 11, ey - 12 + (x < 64 ? 6 : 0)); g.lineTo(x + 11, ey - 12 + (x < 64 ? 0 : 6)); g.stroke(); return; }
      g.beginPath(); g.ellipse(x, ey, 7, 11, 0, 0, 7); g.fill();
    };
    eye(lx); eye(rx);
    if(this.blackeye){ g.save(); g.shadowBlur = 0; g.strokeStyle = 'rgba(120,40,160,0.85)'; g.lineWidth = 7; g.beginPath(); g.arc(lx, ey, 17, 0, 7); g.stroke(); g.strokeStyle = 'rgba(60,20,90,0.7)'; g.lineWidth = 3; g.beginPath(); g.arc(lx, ey, 22, 0.4, 2.6); g.stroke(); g.restore(); g.fillStyle = c; g.strokeStyle = c; }
    if(this.scar){ g.save(); g.shadowBlur = 0; g.strokeStyle = '#e8e8e8'; g.lineWidth = 2; g.beginPath(); g.moveTo(rx - 14, ey - 18); g.lineTo(rx + 10, ey + 16); g.stroke(); g.restore(); g.fillStyle = c; g.strokeStyle = c; }
    if(this.shades && m !== 'money'){ g.shadowBlur = 0; g.fillStyle = '#000'; g.fillRect(20, ey - 14, 40, 22); g.fillRect(68, ey - 14, 40, 22); g.fillRect(58, ey - 10, 12, 4); g.fillStyle = 'rgba(255,255,255,0.35)'; g.fillRect(24, ey - 11, 10, 4); g.fillRect(72, ey - 11, 10, 4); g.fillStyle = c; }
    /* mouth */
    const my = 74, open = this.talk;
    g.shadowBlur = 8;
    if(open > 0.15){ g.beginPath(); g.ellipse(64, my, 12 + open*4, 3 + open*9, 0, 0, 7); g.fill(); }
    else if(m === 'happy' || m === 'money' || m === 'love'){ g.beginPath(); g.arc(64, my - 8, 16, Math.PI*0.15, Math.PI*0.85); g.stroke(); }
    else if(m === 'laugh'){ g.beginPath(); g.arc(64, my - 6, 16, 0, Math.PI); g.fill(); }
    else if(m === 'sad' || m === 'angry' || m === 'hurt'){ g.beginPath(); g.arc(64, my + 10, 14, Math.PI*1.2, Math.PI*1.8); g.stroke(); }
    else if(m === 'smug'){ g.beginPath(); g.moveTo(50, my + 2); g.quadraticCurveTo(66, my + 4, 80, my - 8); g.stroke(); }
    else if(m === 'shock'){ g.beginPath(); g.arc(64, my, 7, 0, 7); g.stroke(); }
    else if(m === 'dead'){ g.beginPath(); g.moveTo(52, my); g.lineTo(76, my); g.stroke(); }
    else { g.beginPath(); g.moveTo(54, my); g.quadraticCurveTo(64, my + 4, 74, my); g.stroke(); }
    g.shadowBlur = 0;
    if(jit) g.restore();
    this.t.needsUpdate = true;
  }
}

/* ---------- the body ---------- */
export const STYLES = ['std','retro','sxs','french','mini','smart','tall'];
export function makeFridge(o){
  o = o || {};
  const style = o.style || 'std';
  const grp = new THREE.Group();
  const inner = new THREE.Group(); grp.add(inner);
  const body = mat(o.color || '#e8e8ea', o.rough === undefined ? 0.3 : o.rough, o.metal || 0);
  const trimM = mat(o.trim || '#9aa0a8', 0.4, 0.3);
  const handleM = o.handle === 'gold' ? GOLD : CHROME;
  let w = o.w || 0.78, h = o.h || 1.72, d = o.d || 0.7;
  if(style === 'mini'){ w = 0.6; h = 1.05; d = 0.58; }
  if(style === 'sxs' || style === 'french'){ w = 0.95; }
  if(style === 'tall'){ h = 1.95; }
  if(style === 'retro'){ w = 0.8; h = 1.7; }
  const r = style === 'retro' ? 0.16 : (style === 'mini' ? 0.05 : 0.035);
  const bodyMesh = new THREE.Mesh(rbox(w, h, d, r), body); bodyMesh.position.y = h/2 + 0.04; inner.add(bodyMesh);
  /* feet */
  [[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([sx,sz])=>inner.add(part(CYL, RUBBER, sx*(w/2 - 0.08), 0.02, sz*(d/2 - 0.08), 0.03, 0.04, 0.03)));
  const front = d/2 + 0.04 + 0.002;
  const fz = d/2 + 0.002;
  /* seams + handles */
  const seam = (x, y, sw, sh)=>inner.add(part(BOX, DARK, x, y, fz, sw, sh, 0.01));
  const handle = (x, y, len, horiz)=>{ const hg = new THREE.Group(); const bar = part(CYL, handleM, 0, 0, 0.045, 0.014, len, 0.014); if(horiz) bar.rotation.z = Math.PI/2; hg.add(bar); const m1 = part(BOX, handleM, horiz ? -len/2 + 0.02 : 0, horiz ? 0 : len/2 - 0.02, 0.02, 0.02, 0.02, 0.05), m2 = part(BOX, handleM, horiz ? len/2 - 0.02 : 0, horiz ? 0 : -len/2 + 0.02, 0.02, 0.02, 0.02, 0.05); hg.add(m1, m2); hg.position.set(x, y, fz); inner.add(hg); };
  const top = h + 0.04;
  if(o.bareFront){ /* the heist builds its own doors for these */ }
  else if(style === 'std' || style === 'smart' || style === 'tall'){ const sy = top - h*0.3; seam(0, sy, w - 0.02, 0.012); handle(w/2 - 0.08, sy + 0.18, 0.22); handle(w/2 - 0.08, sy - 0.34, 0.42); }
  else if(style === 'retro'){ const sy = top - h*0.28; seam(0, sy, w - 0.1, 0.012); handle(w/2 - 0.1, sy - 0.25, 0.18, false); inner.add(part(BOX, CHROME, 0, top - 0.12, fz, w*0.5, 0.02, 0.01)); }
  else if(style === 'sxs'){ seam(0, top - h/2, 0.012, h - 0.04); handle(-0.07, top - h*0.45, 0.6); handle(0.07, top - h*0.45, 0.6); }
  else if(style === 'french'){ const sy = 0.04 + h*0.32; seam(0, (top + sy)/2, 0.012, top - sy - 0.04); seam(0, sy, w - 0.02, 0.012); handle(-0.07, sy + 0.45, 0.5); handle(0.07, sy + 0.45, 0.5); handle(0, sy - 0.12, w*0.6, true); }
  else if(style === 'mini'){ handle(w/2 - 0.07, top - 0.4, 0.3); }
  /* grille + badge */
  inner.add(part(BOX, DARK, 0, 0.1, fz, w*0.86, 0.06, 0.01));
  inner.add(part(BOX, o.handle === 'gold' ? GOLD : trimM, -w/2 + 0.12, top - 0.07, fz, 0.1, 0.022, 0.01));
  if(style === 'smart'){ const sc = part(BOX, mat('#0a1a2a', 0.1, 0.3), w*0.18, top - h*0.55, fz + 0.002, 0.22, 0.3, 0.01); inner.add(sc); }
  const res = { group:grp, inner, w, h, d, top, front:fz, body:bodyMesh };
  /* the face lives on the freezer door */
  if(o.face){
    const face = new Face(o);
    const fw = Math.min(0.5, w*0.62), fh = fw*0.75;
    const fm = new THREE.MeshBasicMaterial({ map:face.t, toneMapped:false });
    const fy = style === 'mini' ? top - 0.28 : top - 0.27;
    const screenRim = part(BOX, DARK, style === 'sxs' || style === 'french' ? 0 : -0.02, fy, fz, fw + 0.04, fh + 0.04, 0.012); inner.add(screenRim);
    const fp = new THREE.Mesh(new THREE.PlaneGeometry(fw, fh), fm); fp.position.set(screenRim.position.x, fy, fz + 0.008); inner.add(fp);
    res.face = face; res.facePlane = fp; res.faceY = fy;
  }
  if(o.arms){
    const armM = body, gloveM = o.glove ? mat(o.glove, 0.6, 0) : WHITE;
    const mk = side=>{
      const sh = new THREE.Group(); sh.position.set(side*(w/2 + 0.04), top - h*0.42, 0.05);
      const up = part(CYL, armM, 0, -0.16, 0, 0.045, 0.32, 0.045); sh.add(up);
      const hand = part(SPH, gloveM, 0, -0.34, 0, 0.07, 0.07, 0.07); sh.add(hand);
      sh.add(part(SPH, armM, 0, 0, 0, 0.06, 0.06, 0.06));
      sh.rotation.z = side*0.12;
      inner.add(sh); return sh;
    };
    res.armL = mk(-1); res.armR = mk(1);
  }
  accessories(res, o);
  compact(res);
  return res;
}
/* merge every static part of the fridge into one mesh per material.
   the face plane and the arms stay separate because they move. */
function mergeInto(root, skip){
  root.updateMatrixWorld(true);
  const inv = new THREE.Matrix4().copy(root.matrixWorld).invert();
  const byMat = new Map(), kill = [];
  root.traverse(o=>{
    if(!o.isMesh || skip.has(o)) return;
    let p = o.parent, inSkip = false; while(p && p !== root){ if(skip.has(p)) inSkip = true; p = p.parent; }
    if(inSkip) return;
    const m = new THREE.Matrix4().multiplyMatrices(inv, o.matrixWorld);
    let g = o.geometry.index ? o.geometry.toNonIndexed() : o.geometry.clone();
    for(const k of Object.keys(g.attributes)) if(k !== 'position' && k !== 'normal' && k !== 'uv') g.deleteAttribute(k);
    if(!g.attributes.uv) g.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(g.attributes.position.count*2), 2));
    g.applyMatrix4(m);
    const a = byMat.get(o.material) || []; a.push(g); byMat.set(o.material, a);
    kill.push(o);
  });
  kill.forEach(o=>o.parent.remove(o));
  /* drop now-empty groups */
  const empty = []; root.traverse(o=>{ if(o !== root && !o.isMesh && o.children.length === 0 && !skip.has(o)) empty.push(o); }); empty.forEach(o=>o.parent && o.parent.remove(o));
  for(const [mat, gs] of byMat){ const mg = mergeGeometries(gs, false); gs.forEach(g=>g.dispose()); if(mg){ const mesh = new THREE.Mesh(mg, mat); root.add(mesh); } }
}
function compact(F){
  const skip = new Set();
  if(F.facePlane) skip.add(F.facePlane);
  if(F.armL){ skip.add(F.armL); skip.add(F.armR); }
  mergeInto(F.inner, skip);
  if(F.armL){ mergeInto(F.armL, new Set()); mergeInto(F.armR, new Set()); }
}
function accessories(F, o){
  const g = F.inner, top = F.top, w = F.w, d = F.d, fz = F.front;
  (o.acc || []).forEach(a=>{
    if(a === 'bowtie'){ const y = (F.faceY || top - 0.3) - 0.3; const L = part(CONE, mat('#a01020', 0.5), -0.05, y, fz + 0.03, 0.05, 0.08, 0.03), R = part(CONE, mat('#a01020', 0.5), 0.05, y, fz + 0.03, 0.05, 0.08, 0.03); L.rotation.z = -Math.PI/2; R.rotation.z = Math.PI/2; g.add(L, R, part(SPH, mat('#700a14', 0.5), 0, y, fz + 0.035, 0.025, 0.025, 0.025)); }
    if(a === 'vest'){ const y = top - F.h*0.62; g.add(part(BOX, mat(o.vest || '#1b1b1f', 0.6), 0, y, fz + 0.004, w*0.92, F.h*0.36, 0.01)); [0,1,2].forEach(i=>g.add(part(SPH, GOLD, 0, y + 0.1 - i*0.1, fz + 0.012, 0.012, 0.012, 0.012))); }
    if(a === 'tophat'){ const hh = new THREE.Group(); hh.add(part(CYL, mat('#111', 0.5), 0, 0.01, 0, w*0.42, 0.02, w*0.42), part(CYL, mat('#111', 0.5), 0, 0.15, 0, w*0.26, 0.28, w*0.26), part(CYL, mat('#8a0d1a', 0.5), 0, 0.04, 0, w*0.265, 0.04, w*0.265)); hh.position.y = top; g.add(hh); }
    if(a === 'cowboy'){ const hh = new THREE.Group(); hh.add(part(CYL, mat('#7a5230', 0.8), 0, 0.01, 0, w*0.55, 0.02, w*0.55), part(CYL, mat('#7a5230', 0.8), 0, 0.1, 0, w*0.25, 0.18, w*0.25)); hh.position.y = top; g.add(hh); }
    if(a === 'party'){ const c = part(CONE, mat(o.partyCol || '#ff3fa4', 0.6), 0.1, top + 0.15, 0, 0.12, 0.3, 0.12); c.rotation.z = -0.25; g.add(c, part(SPH, mat('#ffe14a', 0.6), 0.14, top + 0.31, 0, 0.03, 0.03, 0.03)); }
    if(a === 'crown'){ const cr = new THREE.Group(); cr.add(part(CYL, GOLD, 0, 0.05, 0, w*0.24, 0.1, w*0.24)); for(let i=0;i<6;i++){ const an = i/6*Math.PI*2; cr.add(part(CONE, GOLD, Math.cos(an)*w*0.22, 0.14, Math.sin(an)*w*0.22, 0.03, 0.09, 0.03)); } cr.position.y = top; g.add(cr); }
    if(a === 'beanie'){ const b = part(SPH, mat(o.beanie || '#c0392b', 0.9), 0, top, 0, w*0.36, 0.16, d*0.36); g.add(b, part(SPH, mat('#fff', 0.9), 0, top + 0.16, 0, 0.05, 0.05, 0.05)); }
    if(a === 'headset'){ const t = new THREE.Mesh(new THREE.TorusGeometry(w*0.5, 0.015, 8, 24, Math.PI), mat('#111', 0.5)); t.position.y = top - 0.04; t.rotation.y = Math.PI/2; g.add(t); g.add(part(SPH, mat('#111', 0.5), w/2 + 0.01, top - 0.06, 0, 0.04, 0.05, 0.05)); }
    if(a === 'chain'){ const t = new THREE.Mesh(new THREE.TorusGeometry(w*0.32, 0.018, 6, 20, Math.PI), GOLD); t.position.set(0, (F.faceY || top - 0.3) - 0.22, fz + 0.03); t.rotation.z = Math.PI; g.add(t); g.add(part(BOX, GOLD, 0, (F.faceY || top - 0.3) - 0.56, fz + 0.03, 0.08, 0.1, 0.02)); }
    if(a === 'nametag'){ g.add(part(BOX, GOLD, w*0.25, (F.faceY || top - 0.3) - 0.35, fz + 0.006, 0.14, 0.04, 0.008)); }
    if(a === 'magnets'){ ['#e33','#3a3','#36e','#fc0','#e3f'].forEach((c, i)=>g.add(part(BOX, mat(c, 0.6), -w*0.25 + (i%3)*0.12, top - F.h*0.55 - Math.floor(i/3)*0.12, fz + 0.01, 0.07, 0.07, 0.015))); }
    if(a === 'rust'){ for(let i=0;i<14;i++) g.add(part(SPH, mat('#7a3a14', 0.95), (Math.random() - 0.5)*w*0.9, 0.2 + Math.random()*(top - 0.3), fz, 0.03 + Math.random()*0.05, 0.03 + Math.random()*0.05, 0.004)); }
    if(a === 'neon'){ const nm = new THREE.MeshBasicMaterial({ color:o.neonCol || '#ff3df2', toneMapped:false }); g.add(part(BOX, nm, -w/2 - 0.002, top/2, 0, 0.01, top - 0.1, 0.02), part(BOX, nm, w/2 + 0.002, top/2, 0, 0.01, top - 0.1, 0.02)); }
  });
}
/* walking: a waddle, a hop, arms swinging */
export function animateFridge(F, t, speed, extra){
  const g = F.inner, wob = Math.min(1, speed/1.2);
  const ph = t*7.5;
  g.position.y = Math.abs(Math.sin(ph))*0.05*wob + (extra && extra.hop ? Math.abs(Math.sin(t*9))*0.12 : 0);
  g.rotation.z = Math.sin(ph)*0.06*wob;
  g.scale.y = 1 + Math.sin(t*2.1 + (F.seed || 0))*0.008;
  if(F.armL){
    const sw = Math.sin(ph)*0.5*wob;
    if(!F.armBusy){ F.armL.rotation.x = sw; F.armR.rotation.x = -sw; F.armL.rotation.z = -0.12 - Math.sin(t*1.7)*0.03; F.armR.rotation.z = 0.12 + Math.sin(t*1.9)*0.03; }
  }
}
