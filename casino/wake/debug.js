/* ============================================================
   COLD OPEN: wakedebug
   type "wakedebug" anywhere to see what everyone is thinking.
   every guard gets a number, a state and a line showing where he's
   walking, plus a yellow line to whatever he's staring at.
   the panel top right lists everybody, so a playtest note can say
   "#3 stood in the aisle forever" and mean exactly one fridge.
============================================================ */
import * as THREE from '../lib/three.module.min.js';
import { canvas, tex } from '../world/textures.js';

const COLORS = { route:'#5ad8ff', hold:'#6dff8a', walk:'#ffffff', script:'#c8c8c8', drag:'#ff6ad0', investigate:'#ffd84a', search:'#ffb020', aim:'#ff2a2a', dead:'#555555' };

export class WakeDebug {
  constructor(C, W){
    this.C = C; this.W = W; this.on = false; this.t = 0;
    this.grp = new THREE.Group(); this.grp.visible = false; this.grp.renderOrder = 50; C.scene.add(this.grp);
    this.lines = new THREE.Group(); this.grp.add(this.lines);
    this.labels = new Map();
    const el = document.createElement('div'); el.id = 'wk-dbg';
    el.style.cssText = 'position:absolute;right:10px;top:60px;z-index:60;pointer-events:none;font:11px/1.35 monospace;color:#e8e2d0;background:rgba(0,0,0,.62);padding:8px 10px;border:1px solid rgba(255,255,255,.18);max-width:min(360px,46vw);white-space:pre;display:none';
    (C.root || document.body).appendChild(el); this.el = el;
    this.warns = [];
    const ow = console.warn.bind(console);
    console.warn = (...a)=>{ if(typeof a[0] === 'string' && a[0].startsWith('[wake]')){ this.warns.unshift(a.join(' ').slice(7)); this.warns.length = Math.min(this.warns.length, 4); } ow(...a); };
  }
  toggle(){ this.on = !this.on; this.W.debugOn = this.on; this.grp.visible = this.on; this.el.style.display = this.on ? '' : 'none'; this.C.hud.toast(this.on ? 'wakedebug on · type it again to hide' : 'wakedebug off'); if(!this.on){ this.clearLines(); } }
  clearLines(){ this.lines.children.slice().forEach(l=>{ this.lines.remove(l); l.geometry.dispose(); l.material.dispose(); }); }
  line(pts, col){ if(pts.length < 2) return; const g = new THREE.BufferGeometry().setFromPoints(pts); const l = new THREE.Line(g, new THREE.LineBasicMaterial({ color:col, depthTest:false, transparent:true, opacity:0.9, toneMapped:false, fog:false, linewidth:2 })); l.renderOrder = 51; this.lines.add(l); }
  label(key, text, col){
    let L = this.labels.get(key);
    if(!L){ const c = canvas(384, 40); const t = tex(c, { nomip:true }); const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map:t, depthTest:false, transparent:true, toneMapped:false, fog:false })); sp.scale.set(2.4, 0.25, 1); sp.renderOrder = 52; this.grp.add(sp); L = { c, t, sp, text:'' }; this.labels.set(key, L); }
    if(L.text !== text + col){ L.text = text + col; const g = L.c.getContext('2d'); g.clearRect(0, 0, 384, 40); g.fillStyle = 'rgba(0,0,0,.7)'; g.fillRect(0, 0, 384, 40); g.fillStyle = col; g.font = 'bold 20px monospace'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(text, 192, 21); L.t.needsUpdate = true; }
    L.sp.visible = true; L.used = true; return L.sp;
  }
  update(dt){
    const C = this.C, W = this.W;
    if(C.input.typed && C.input.typed.endsWith('wakedebug')){ C.input.typed = ''; this.toggle(); }
    if(!this.on) return;
    this.t -= dt; if(this.t > 0) return; this.t = 0.1;
    this.clearLines();
    this.labels.forEach(L=>{ L.used = false; });
    const V = (x, z, y)=>new THREE.Vector3(x, y === undefined ? 0.06 : y, z);
    const rows = [];
    const crew = W.crew.list;
    crew.forEach(e=>{
      const p = e.F.group.position, st = !e.alive ? 'dead' : e.state, col = COLORS[st] || '#ffffff';
      if(e.alive && e.path && e.pi < e.path.length){ const pts = [V(p.x, p.z)]; for(let i=e.pi;i<e.path.length;i++) pts.push(V(e.path[i][0], e.path[i][1])); this.line(pts, col); }
      if(e.alive && e.lookAt) this.line([V(p.x, p.z, 1.2), V(e.lookAt[0], e.lookAt[1], 0.3)], '#ffd84a');
      if(e.alive){ const tag = '#' + e.idx + ' ' + st + (e.hold ? ' (hold)' : '') + (e.sus > 0.05 ? ' ' + e.sus.toFixed(2) : ''); const sp = this.label('c' + e.idx + e.name, tag, col); sp.position.set(p.x, (e.F.top || 1.7) + 0.85, p.z); }
      rows.push(('#' + e.idx).padEnd(4) + (e.name || '').slice(0, 14).padEnd(15) + st.padEnd(12) + (e.alive ? 'v' + (e.v || 0).toFixed(1) + (e.blocked ? ' nopath×' + e.blocked : '') : ''));
    });
    /* hank */
    const H = W.hank, hp = H.F.group.position;
    if(H.F.group.visible){ if(H.path && H.pi < H.path.length){ const pts = [V(hp.x, hp.z)]; for(let i=H.pi;i<H.path.length;i++) pts.push(V(H.path[i][0], H.path[i][1])); this.line(pts, '#d8b878'); } const sp = this.label('hank', 'HANK ' + H.posture + ((Math.hypot(C.player.pos.x - hp.x, C.player.pos.z - hp.z) > 6 && !H.noWait) ? ' (waiting for you)' : ''), '#d8b878'); sp.position.set(hp.x, 1.3, hp.z); }
    /* the defroster */
    const D = W.def;
    if(D.F.group.visible){ const dp = D.F.group.position; if(D.path && D.pi < D.path.length){ const pts = [V(dp.x, dp.z)]; for(let i=D.pi;i<D.path.length;i++) pts.push(V(D.path[i][0], D.path[i][1])); this.line(pts, '#ff5a1a'); } const sp = this.label('def', 'DEFROSTER ' + D.state + (D.stagger > 0 ? ' stagger ' + D.stagger.toFixed(1) : ''), '#ff7a3a'); sp.position.set(dp.x, 2.6, dp.z); }
    /* labels stay readable at a distance */
    const cp = C.camera.position;
    this.labels.forEach(L=>{ if(!L.used){ L.sp.visible = false; return; } const k = Math.max(1, Math.min(3.5, L.sp.position.distanceTo(cp)/6)); L.sp.scale.set(2.4*k, 0.25*k, 1); });
    this.el.textContent = 'COLD OPEN · ' + (W.active ? W.stage : 'off') + (W.cp ? '  checkpoint: ' + W.cp.label : '') + '\n' +
      'you ' + C.player.pos.x.toFixed(1) + ', ' + C.player.pos.z.toFixed(1) + '  body ' + W.body.mode + (W.body.prone ? ' flat' : '') + '  still ' + W.body.still.toFixed(1) + '\n' +
      (rows.length ? '\n' + rows.join('\n') : '\n(no crew)') +
      (this.warns.length ? '\n\n' + this.warns.join('\n') : '');
  }
}
