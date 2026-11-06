/* ============================================================
   COLD OPEN: the bad stuff
   gore the heist doesn't have, made for scripted kills on specific
   fridges: drag smears, coolant pulsing out of a hole, a fridge
   gutted (the door torn open and everything inside dumped on the
   carpet), face screens cracking and dying, a fridge crushed flat,
   a fridge cooking and melting in the fire. plus the fire itself,
   embers, the dark, the drone, the ringing in your ears.
   everything here is pooled or made once, so a kill never hitches.
============================================================ */
import * as THREE from '../lib/three.module.min.js';
import { canvas, tex } from '../world/textures.js';

const R = (a, b)=>a + Math.random()*(b - a);
const _m = new THREE.Matrix4(), _q = new THREE.Quaternion(), _s = new THREE.Vector3(), _p = new THREE.Vector3(), _e = new THREE.Euler();

/* ---------- textures ---------- */
const smearTex = (()=>{ const c = canvas(64, 256), g = c.getContext('2d'); g.clearRect(0, 0, 64, 256);
  /* a long drag mark: streaks that thin out, darker clots */
  for(let i=0;i<14;i++){ const x = 10 + Math.random()*44, w = R(2, 7); const gr = g.createLinearGradient(0, 0, 0, 256); gr.addColorStop(0, 'rgba(255,255,255,0)'); gr.addColorStop(R(0.05, 0.2), 'rgba(255,255,255,0.85)'); gr.addColorStop(R(0.6, 0.9), 'rgba(255,255,255,0.7)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.beginPath(); g.moveTo(x, 0); g.bezierCurveTo(x + R(-6, 6), 90, x + R(-6, 6), 170, x + R(-4, 4), 256); g.lineTo(x + w, 256); g.bezierCurveTo(x + w + R(-6, 6), 170, x + w + R(-6, 6), 90, x + w, 0); g.fill(); }
  for(let i=0;i<10;i++){ g.fillStyle = 'rgba(255,255,255,0.95)'; g.beginPath(); g.ellipse(R(12, 52), R(20, 236), R(2, 6), R(3, 10), 0, 0, 7); g.fill(); }
  return tex(c, { nomip:false }); })();
const flameTex = (()=>{ const c = canvas(64, 128), g = c.getContext('2d');
  const gr = g.createRadialGradient(32, 92, 2, 32, 80, 52); gr.addColorStop(0, 'rgba(255,255,230,1)'); gr.addColorStop(0.2, 'rgba(255,220,120,0.95)'); gr.addColorStop(0.45, 'rgba(255,120,30,0.75)'); gr.addColorStop(0.75, 'rgba(180,30,10,0.3)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = gr; g.beginPath(); g.moveTo(32, 2); g.bezierCurveTo(60, 50, 62, 90, 32, 126); g.bezierCurveTo(2, 90, 4, 50, 32, 2); g.fill(); return tex(c, { nomip:true }); })();
const crackTex = (()=>{ const c = canvas(256, 192), g = c.getContext('2d'); g.clearRect(0, 0, 256, 192);
  g.strokeStyle = 'rgba(235,245,255,0.9)'; g.lineCap = 'round';
  const cx = R(90, 160), cy = R(70, 120);
  for(let i=0;i<14;i++){ let x = cx, y = cy; const a0 = Math.random()*6.28; g.lineWidth = R(0.8, 2.4); g.beginPath(); g.moveTo(x, y); for(let k=0;k<6;k++){ const a = a0 + R(-0.5, 0.5); x += Math.cos(a)*R(10, 30); y += Math.sin(a)*R(10, 30); g.lineTo(x, y); } g.stroke(); }
  for(let r=14; r<70; r+=R(14, 22)){ g.lineWidth = 1; g.beginPath(); for(let a=0; a<6.3; a+=R(0.3, 0.8)){ const rr = r + R(-4, 4); g.lineTo(cx + Math.cos(a)*rr, cy + Math.sin(a)*rr); } g.stroke(); }
  g.fillStyle = 'rgba(0,0,0,0.85)'; g.beginPath(); g.arc(cx, cy, 6, 0, 7); g.fill();
  return tex(c, { nomip:true }); })();
const glowTex = (()=>{ const c = canvas(64, 64), g = c.getContext('2d'); const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.35, 'rgba(255,255,255,0.35)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, 64, 64); return tex(c, { nomip:true }); })();
export { glowTex };

/* a small particle pool on an instanced mesh. billboards or free-spinning */
class Pool {
  constructor(scene, geo, mat, n, o){
    o = o || {};
    this.im = new THREE.InstancedMesh(geo, mat, n); this.im.frustumCulled = false; this.im.renderOrder = o.order || 4;
    if(o.color){ this.im.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(n*3).fill(1), 3); }
    scene.add(this.im); this.n = n; this.i = 0; this.p = []; for(let k=0;k<n;k++) this.p.push({ life:0 }); this.bill = !!o.bill; this.col = !!o.color;
    _m.makeScale(0, 0, 0); for(let k=0;k<n;k++) this.im.setMatrixAt(k, _m); this.im.instanceMatrix.needsUpdate = true;
  }
  spawn(f){ const p = this.p[this.i]; this.i = (this.i + 1) % this.n; for(const k in p) delete p[k]; p.x = p.y = p.z = p.vx = p.vy = p.vz = 0; p.s = 1; p.life = 1; p.t = 0; p.grav = 0; p.drag = 0; p.rz = 0; f(p); p.max = p.life; return p; }
  update(dt, camQ){
    let any = false;
    for(let k=0;k<this.n;k++){ const p = this.p[k];
      if(p.life <= 0){ if(p.wasLive){ p.wasLive = false; _m.makeScale(0, 0, 0); this.im.setMatrixAt(k, _m); any = true; } continue; }
      p.wasLive = true; any = true; p.t += dt;
      if(!p.keep) p.life -= dt;
      const dr = Math.max(0, 1 - p.drag*dt); p.vx *= dr; p.vz *= dr; p.vy = p.vy*dr - p.grav*dt;
      p.x += p.vx*dt; p.y += p.vy*dt; p.z += p.vz*dt;
      if(p.floor !== undefined && p.y < p.floor){ p.y = p.floor; p.vy = 0; p.vx *= 0.5; p.vz *= 0.5; }
      const k01 = 1 - Math.max(0, p.life)/p.max;
      const s = p.s*(1 + (p.grow || 0)*k01)*(p.shrink ? Math.max(0, 1 - k01) : 1);
      if(this.bill){ _q.copy(camQ); if(p.rz){ _q.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), p.rz + p.t*(p.spin || 0))); } _s.set(s*(p.sx || 1), s*(p.sy || 1), s); }
      else if(p.align){ _q.copy(p.align); _s.set(s*(p.sx || 1), s*(p.sy || 1), s*(p.sz || 1)); }
      else { _e.set(p.rx || 0, p.ry || 0, p.rz || 0); _q.setFromEuler(_e); _s.set(s*(p.sx || 1), s*(p.sy || 1), s*(p.sz || 1)); }
      _p.set(p.x, p.y, p.z); _m.compose(_p, _q, _s); this.im.setMatrixAt(k, _m);
      if(this.col && p.c0){ const f = p.cf ? k01 : 0; const c = this._c || (this._c = new THREE.Color()); c.copy(p.c0); if(p.c1) c.lerp(p.c1, f); const fade = p.fade === false ? 1 : Math.max(0, 1 - k01*k01); c.multiplyScalar(fade); this.im.setColorAt(k, c); }
    }
    if(any){ this.im.instanceMatrix.needsUpdate = true; if(this.col && this.im.instanceColor) this.im.instanceColor.needsUpdate = true; }
  }
  clear(){ this.p.forEach(p=>p.life = 0); }
}

export class WakeFX {
  constructor(C){
    this.C = C; const S = C.scene;
    const low = C.engine.preset() === 'low', N = low ? 0.6 : 1;
    this.flame = new Pool(S, new THREE.PlaneGeometry(0.5, 1), new THREE.MeshBasicMaterial({ map:flameTex, transparent:true, depthWrite:false, blending:THREE.AdditiveBlending, toneMapped:false }), 220*N|0, { bill:true, color:true, order:6 });
    this.glow = new Pool(S, new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map:glowTex, transparent:true, depthWrite:false, blending:THREE.AdditiveBlending, toneMapped:false }), 40, { bill:true, color:true, order:5 });
    this.smearP = new Pool(S, new THREE.PlaneGeometry(1, 1), new THREE.MeshStandardMaterial({ map:smearTex, transparent:true, depthWrite:false, roughness:0.08, metalness:0.1, polygonOffset:true, polygonOffsetFactor:-3, polygonOffsetUnits:-3 }), 240*N|0, { color:true, order:2 });
    this.jets = []; this.burning = []; this.cooking = []; this.timers = [];
    this.crackM = new THREE.MeshBasicMaterial({ map:crackTex, transparent:true, depthWrite:false, toneMapped:false });
    /* the gutted-door pieces get made once and reused */
    this.cavityTex = (()=>{ const c = canvas(128, 192), g = c.getContext('2d'); g.fillStyle = '#d8d8d0'; g.fillRect(0, 0, 128, 192); const gr = g.createRadialGradient(64, 20, 4, 64, 60, 140); gr.addColorStop(0, 'rgba(255,250,210,0.9)'); gr.addColorStop(1, 'rgba(60,60,50,0.9)'); g.fillStyle = gr; g.fillRect(0, 0, 128, 192); g.fillStyle = '#9a9a92'; for(let y=48; y<192; y+=46) g.fillRect(4, y, 120, 5); g.fillStyle = 'rgba(140,10,10,0.85)'; for(let i=0;i<18;i++){ g.beginPath(); g.ellipse(R(8, 120), R(10, 186), R(3, 12), R(4, 16), 0, 0, 7); g.fill(); } return tex(c); })();
    this.lastSmear = new Map();
  }
  update(dt){
    const C = this.C, q = C.camera.quaternion;
    this.flame.update(dt, q); this.glow.update(dt, q); this.smearP.update(dt, q);
    /* coolant pulsing out of holes, like a heartbeat that's slowing down */
    for(let i=this.jets.length - 1; i>=0; i--){ const j = this.jets[i]; j.t += dt; j.life -= dt; if(j.life <= 0){ this.jets.splice(i, 1); continue; }
      const beat = j.rate*(1 - j.t/(j.t + j.life)*0.6); j.ph += dt*beat;
      if(j.ph >= 1){ j.ph -= 1; const p = j.obj ? j.obj.localToWorld(j.local.clone()) : j.pos; const d = j.obj ? j.dirL.clone().transformDirection(j.obj.matrixWorld) : j.dir; const strength = Math.max(0.25, 1 - j.t/(j.t + j.life));
        C.gore.mistPuff(p, j.col || '#e6f8ff', 3, { dir:d, speed:3*strength, size:0.1, grow:1.4, life:0.7 });
        C.gore.blobBurst(p, Math.ceil(3*strength), j.sauce || '#b8160f', 0.8*strength, true);
        if(j.sound && Math.random() < 0.6) C.audio.heist && C.audio.heist.squelch(p, false);
      }
    }
    /* things on fire: flames ride on them */
    for(let i=this.burning.length - 1; i>=0; i--){ const b = this.burning[i]; b.t += dt; if(b.life !== undefined){ b.life -= dt; if(b.life <= 0){ this.burning.splice(i, 1); continue; } }
      b.acc = (b.acc || 0) + dt*(b.rate || 30);
      while(b.acc >= 1){ b.acc -= 1; const p = b.obj ? b.obj.localToWorld(new THREE.Vector3(R(-b.w, b.w), R(b.y0, b.y1), R(-b.d, b.d))) : new THREE.Vector3(b.x + R(-b.w, b.w), R(b.y0, b.y1), b.z + R(-b.d, b.d)); this.fire(p, b.size || 1); }
      if(Math.random() < dt*8){ const p = b.obj ? b.obj.getWorldPosition(new THREE.Vector3()) : new THREE.Vector3(b.x, 0, b.z); p.y += R(b.y0, b.y1); C.gore.sparks(p, 2, { speed:2, col:'#ffb040' }); }
      if(Math.random() < dt*3){ const p = b.obj ? b.obj.getWorldPosition(new THREE.Vector3()) : new THREE.Vector3(b.x, 0, b.z); p.y += b.y1; C.gore.smokePuff(p, 1, 0.35*(b.size || 1)); }
    }
    /* fridges cooking: darken, sag, drip */
    for(let i=this.cooking.length - 1; i>=0; i--){ const k = this.cooking[i]; k.t += dt; const f = Math.min(1, k.t/k.dur);
      if(k.mat){ k.mat.color.setRGB(1 - f*0.88, 1 - f*0.92, 1 - f*0.94); }
      const sag = f*f; k.F.inner.scale.set(1 + sag*0.22, 1 - sag*0.42, 1 + sag*0.18);
      k.F.inner.rotation.z = Math.sin(k.t*1.3 + k.seed)*sag*0.12;
      if(Math.random() < dt*10*(1 - f*0.5)){ const p = k.F.group.localToWorld(new THREE.Vector3(R(-k.F.w/2, k.F.w/2), R(0.3, k.F.top*(1 - sag*0.4)), k.F.d/2 + 0.02)); C.gore.blobBurst(p, 1, Math.random() < 0.5 ? '#2a2420' : '#e8e2d0', 0.3, Math.random() < 0.3); }
      if(f >= 1){ this.cooking.splice(i, 1); if(k.done) k.done(); }
    }
    for(let i=this.timers.length - 1; i>=0; i--){ const t = this.timers[i]; t.t -= dt; if(t.t <= 0){ this.timers.splice(i, 1); try{ t.f(); }catch(e){ console.warn(e); } } }
  }
  after(sec, f){ this.timers.push({ t:sec, f }); }
  clear(){ this.flame.clear(); this.glow.clear(); this.smearP.clear(); this.jets = []; this.burning = []; this.cooking = []; this.timers = []; }

  /* ---------- the vocabulary ---------- */
  fire(p, size){ this.flame.spawn(q=>{ q.x = p.x; q.y = p.y; q.z = p.z; q.vx = R(-0.15, 0.15); q.vy = R(0.8, 1.8)*(size || 1); q.vz = R(-0.15, 0.15); q.s = R(0.3, 0.6)*(size || 1); q.life = R(0.35, 0.8); q.shrink = true; q.rz = R(-0.4, 0.4); q.c0 = new THREE.Color(1, R(0.75, 1), R(0.5, 0.8)); q.c1 = new THREE.Color(0.9, 0.15, 0.02); q.cf = true; }); }
  flash(p, col, size, life){ this.glow.spawn(q=>{ q.x = p.x; q.y = p.y; q.z = p.z; q.s = size || 2; q.life = life || 0.12; q.c0 = new THREE.Color(col || 0xffd0a0); q.grow = -0.4; }); }
  /* something stays on fire. obj: an Object3D (flames in its local box), or a spot */
  ignite(o){ const b = Object.assign({ t:0, w:0.3, d:0.3, y0:0.2, y1:1.6, rate:30, size:1 }, o); this.burning.push(b); return b; }
  douse(b){ const i = this.burning.indexOf(b); if(i >= 0) this.burning.splice(i, 1); }
  /* coolant (and sauce) pulsing out of a hole on a fridge, for a while */
  bleed(obj, localPos, localDir, o){ o = o || {}; const j = { obj, local:localPos.clone(), dirL:localDir.clone().normalize(), t:0, life:o.life || 8, rate:o.rate || 1.6, ph:0.9, col:o.col, sauce:o.sauce, sound:o.sound !== false }; this.jets.push(j); return j; }
  /* a drag mark: call every frame with the thing being dragged; lays streaks behind it */
  smear(key, x, z, col, width){
    const last = this.lastSmear.get(key);
    if(!last){ this.lastSmear.set(key, { x, z }); return; }
    const dx = x - last.x, dz = z - last.z, d = Math.hypot(dx, dz);
    if(d < 0.32) return;
    const a = Math.atan2(dx, dz);
    const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI/2, 0, 0)); q.premultiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), a));
    this.smearP.spawn(p=>{ p.x = (x + last.x)/2; p.y = 0.007 + Math.random()*0.002; p.z = (z + last.z)/2; p.keep = true; p.life = 1; p.s = 1; p.sx = width || R(0.45, 0.6); p.sy = d + 0.12; p.align = q; p.c0 = new THREE.Color(col || '#8a0c08'); p.fade = false; });
    this.lastSmear.set(key, { x, z });
  }
  endSmear(key){ this.lastSmear.delete(key); }
  /* the face screen cracks, flickers, dies */
  crackFace(F, o){
    o = o || {};
    if(!F.facePlane) return;
    const pl = F.facePlane, cr = new THREE.Mesh(pl.geometry, this.crackM); cr.position.copy(pl.position); cr.position.z += 0.003; pl.parent.add(cr); F._crack = cr;
    F.face.set('static', o.static || 0.6); this.after(o.static || 0.6, ()=>F.face.set(o.dead ? 'off' : 'dead', 1e9));
    const p = pl.getWorldPosition(new THREE.Vector3()); this.C.gore.glassBurst(p, 6, F.group.getWorldDirection(new THREE.Vector3())); this.C.gore.sparks(p, 12, { speed:3 });
  }
  /* the worst one: the fresh-food door gets torn open and everything comes out */
  gut(F, col, o){
    o = o || {};
    const C = this.C, w = F.w, d = F.d, h = F.h || 1.7, doorH = h*0.62, fz = d/2 + 0.004;
    const grp = new THREE.Group(); grp.position.set(w/2 - 0.01, 0.06 + doorH/2, fz); F.inner.add(grp);
    const cav = new THREE.Mesh(new THREE.PlaneGeometry(w - 0.08, doorH - 0.06), new THREE.MeshStandardMaterial({ map:this.cavityTex, roughness:0.6, emissive:0x3a3420, emissiveIntensity:0.5 })); cav.position.set(0.04, 0.06 + doorH/2, fz + 0.001); F.inner.add(cav);
    const door = new THREE.Mesh(new THREE.BoxGeometry(w - 0.02, doorH, 0.05), new THREE.MeshStandardMaterial({ color:new THREE.Color(col || '#e8e8ea'), roughness:0.35 })); door.position.set(-(w - 0.02)/2, 0, 0.026); grp.add(door);
    const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, doorH*0.55, 8), new THREE.MeshStandardMaterial({ color:0xcfd4da, metalness:1, roughness:0.2 })); bar.position.set(-(w - 0.1), 0, 0.07); grp.add(bar);
    /* hinge swing: wrenched past where a door should go */
    C.tweens.add({ dur:o.dur || 0.5, ease:t=>1 - Math.pow(1 - t, 4), update:k=>{ grp.rotation.y = k*(o.ang || 2.4); grp.rotation.z = -k*0.08; } });
    const wp = F.inner.localToWorld(new THREE.Vector3(0, 0.06 + doorH*0.55, fz + 0.1)), dir = F.group.getWorldDirection(new THREE.Vector3());
    C.audio.heist && C.audio.heist.hit('metal', wp); C.audio.heist && C.audio.heist.squelch(wp, true);
    this.after(0.12, ()=>{ C.gore.spill(wp, dir.clone().setY(0.2), { n:o.n || 18, sauce:o.sauce || 22, power:1.2 }); C.gore.puddleAt(wp.x + dir.x*0.6, wp.z + dir.z*0.6, '#8a0c08', R(0.6, 0.9)); });
    this.after(0.5, ()=>C.gore.spill(wp.clone().setY(wp.y - 0.3), dir.clone().setY(0), { n:8, sauce:10, power:0.6 }));
    /* the light inside stays on. that's the part that gets you */
    F._gutted = { grp, cav, door };
    return grp;
  }
  /* shot at close range: face out, slump forward, leak */
  execute(F, o){
    o = o || {};
    const C = this.C, p = F.group.getWorldPosition(new THREE.Vector3()).setY((F.top || 1.7)*0.85*(F.group.scale.y || 1));
    if(F.face) this.crackFace(F, { static:0.35, dead:true });
    C.gore.spill(p, o.dir || F.group.getWorldDirection(new THREE.Vector3()).negate(), { n:o.n || 10, sauce:o.sauce || 16, power:1.1 });
    C.gore.coolant(p, o.dir || new THREE.Vector3(0, 1, 0), 10);
    C.audio.heist && C.audio.heist.squelch(p, true);
    if(o.bleed !== false) this.bleed(F.inner, new THREE.Vector3(0, (F.top || 1.7)*0.8, F.d/2), new THREE.Vector3(0, 0.4, 1), { life:o.bleedT || 9, rate:1.4 });
    if(o.fall !== false) this.fall(F, o.back ? 1 : -1, o.fallDur);
  }
  /* topple onto the face (dir -1) or the back (1), then lie there */
  fall(F, dir, dur){
    const C = this.C, half = F.d/2;
    F.armBusy = true;
    return C.tweens.add({ dur:dur || 0.55, ease:t=>t*t, update:k=>{ const a = dir*k*Math.PI/2; F.inner.rotation.x = a; F.inner.position.y = Math.abs(Math.sin(a))*half*0.98; F.inner.position.z = dir*(1 - Math.cos(a))*half*-1; if(F.armL){ F.armL.rotation.x = -k*2.6*(dir < 0 ? 1 : 0.4); F.armR.rotation.x = -k*2.4*(dir < 0 ? 1 : 0.4); } } }).then(()=>{ const p = F.group.getWorldPosition(new THREE.Vector3()); C.gore.puddleAt(p.x + R(-0.3, 0.3), p.z + R(-0.3, 0.3), '#7a0a06', R(0.5, 0.8)); C.gore.mistPuff(p.setY(0.3), '#e6f8ff', 6, { size:0.3, speed:1 }); C.audio.heist && C.audio.heist.hit('fridge', p); });
  }
  /* flattened by something very heavy and very gold */
  crush(F){
    const C = this.C, p = F.group.getWorldPosition(new THREE.Vector3());
    C.gore.spill(p.clone().setY(0.4), new THREE.Vector3(0, 0.3, 0), { n:26, sauce:34, power:2.2 });
    C.gore.debrisBurst(p.clone().setY(0.3), 24, '#cfcfd4', new THREE.Vector3(0, 1, 0), 1.6);
    C.gore.glassBurst(p.clone().setY(0.5), 10);
    C.gore.mistPuff(p.clone().setY(0.4), '#e6f8ff', 22, { size:0.5, speed:4 });
    for(let i=0;i<5;i++) C.gore.puddleAt(p.x + R(-1.2, 1.2), p.z + R(-1.2, 1.2), i % 2 ? '#7a0a06' : '#d8d4c8', R(0.4, 1.0));
    C.audio.heist && C.audio.heist.squelch(p, true); C.audio.heist && C.audio.heist.hit('metal', p);
    if(F.face) F.face.set('off', 1e9);
    C.tweens.add({ dur:0.12, update:k=>{ F.inner.scale.set(1 + k*0.55, 1 - k*0.86, 1 + k*0.5); } });
  }
  /* cooked by the defroster: flames on, color drains, the body sags and drips */
  cook(F, o){
    o = o || {};
    const C = this.C;
    if(F.body && F.body.material){ F.body.material = F.body.material.clone(); }
    const b = this.ignite({ obj:F.group, w:F.w*0.45, d:F.d*0.45, y0:0.2, y1:(F.top || 1.7)*0.95, rate:40, size:1.1, life:(o.dur || 4) + 3 });
    if(F.face){ F.face.set('static', 1.2); this.after(1.2, ()=>F.face.set('off', 1e9)); }
    const k = { F, t:0, dur:o.dur || 4, mat:F.body ? F.body.material : null, seed:Math.random()*6, done:()=>{ const p = F.group.getWorldPosition(new THREE.Vector3()); C.gore.puddleAt(p.x, p.z, '#1a1412', 0.9); C.gore.scorchMark(p, 1.6); if(o.done) o.done(); } };
    this.cooking.push(k);
    return b;
  }
}

/* ---------- the dark, the drone, the ringing ---------- */
export class Mood {
  constructor(C){ this.C = C; this.saved = null; this.loops = {}; }
  dark(level){
    const C = this.C, W = C.world;
    if(!this.saved){ this.saved = { lights:W.lights.map(l=>[l, l.intensity, l.color.getHex()]), amb:C.scene.children.filter(o=>o.isHemisphereLight || o.isAmbientLight).map(l=>[l, l.intensity, l.color.getHex()]), env:C.scene.environmentIntensity, neon:W.neon.map(n=>n.visible) }; }
    const k = level === undefined ? 0.2 : level;
    this.saved.lights.forEach(([l, i])=>{ l.intensity = i*k; l.color.setHex(0xff3a2a); });
    this.saved.amb.forEach(([l, i])=>{ l.intensity = i*Math.max(0.16, k*1.4); });
    C.scene.environmentIntensity = this.saved.env*Math.max(0.08, k*0.7);
    W.neon.forEach(n=>n.visible = false);
    this.level = k;
  }
  restore(){
    const C = this.C, S = this.saved; if(!S) return;
    S.lights.forEach(([l, i, c])=>{ l.intensity = i; l.color.setHex(c); });
    S.amb.forEach(([l, i, c])=>{ l.intensity = i; l.color.setHex(c); });
    C.scene.environmentIntensity = S.env; C.world.neon.forEach((n, i)=>n.visible = S.neon[i] !== false);
    this.saved = null;
  }
  /* a low horror bed: two detuned saws through a lowpass that breathes */
  drone(on, vol){
    const A = this.C.audio, c = A.ctx; if(!c) return;
    if(on && !this.loops.drone){
      const g = c.createGain(); g.gain.value = 0; const f = c.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 220; f.Q.value = 4;
      const o1 = c.createOscillator(), o2 = c.createOscillator(), o3 = c.createOscillator(); o1.type = 'sawtooth'; o2.type = 'sawtooth'; o3.type = 'sine'; o1.frequency.value = 41; o2.frequency.value = 41.7; o3.frequency.value = 82.4;
      const lfo = c.createOscillator(), lg = c.createGain(); lfo.frequency.value = 0.07; lg.gain.value = 120; lfo.connect(lg); lg.connect(f.frequency);
      [o1, o2, o3].forEach(o=>o.connect(f)); f.connect(g); g.connect(A.out(null, 0.6));
      [o1, o2, o3, lfo].forEach(o=>o.start());
      g.gain.setTargetAtTime(vol || 0.16, c.currentTime, 2);
      this.loops.drone = { g, stop:()=>{ g.gain.setTargetAtTime(0, c.currentTime, 1.2); setTimeout(()=>{ try{ [o1, o2, o3, lfo].forEach(o=>o.stop()); }catch(e){} }, 4000); } };
    } else if(!on && this.loops.drone){ this.loops.drone.stop(); this.loops.drone = null; }
    else if(on && this.loops.drone && vol !== undefined) this.loops.drone.g.gain.setTargetAtTime(vol, c.currentTime, 1.5);
  }
  /* the ringing after the hit, fading out over a few seconds */
  ring(sec){
    const A = this.C.audio, c = A.ctx; if(!c) return;
    const o = c.createOscillator(), g = c.createGain(); o.type = 'sine'; o.frequency.value = 3900 + Math.random()*400;
    g.gain.setValueAtTime(0.0001, c.currentTime); g.gain.exponentialRampToValueAtTime(0.05, c.currentTime + 0.05); g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + (sec || 7));
    o.connect(g); g.connect(A.out(null, 0)); o.start(); o.stop(c.currentTime + (sec || 7) + 0.1);
  }
  /* fire crackle loop that follows a point (volume by distance, set from outside) */
  crackle(on){
    const A = this.C.audio, c = A.ctx; if(!c) return null;
    if(on && !this.loops.fire){
      const src = c.createBufferSource(); src.buffer = A.nb; src.loop = true; const f = c.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 1800; f.Q.value = 0.6; const g = c.createGain(); g.gain.value = 0;
      const lo = c.createBiquadFilter(); lo.type = 'lowpass'; lo.frequency.value = 300; const g2 = c.createGain(); g2.gain.value = 0;
      src.connect(f); f.connect(g); src.connect(lo); lo.connect(g2); g.connect(A.out(null, 0.3)); g2.connect(A.out(null, 0.3)); src.start();
      this.loops.fire = { g, g2, src, set:v=>{ g.gain.setTargetAtTime(v*0.12*(0.6 + Math.random()*0.8), c.currentTime, 0.05); g2.gain.setTargetAtTime(v*0.3, c.currentTime, 0.2); }, stop:()=>{ g.gain.setTargetAtTime(0, c.currentTime, 0.5); g2.gain.setTargetAtTime(0, c.currentTime, 0.5); setTimeout(()=>{ try{ src.stop(); }catch(e){} }, 2000); } };
    } else if(!on && this.loops.fire){ this.loops.fire.stop(); this.loops.fire = null; }
    return this.loops.fire;
  }
  stopAll(){ Object.keys(this.loops).forEach(k=>{ try{ this.loops[k].stop(); }catch(e){} this.loops[k] = null; }); }
}
