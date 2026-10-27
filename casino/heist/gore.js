/* ============================================================
   FRIDGE PALACE HEIST: what comes out of a fridge when you shoot it
   milk, eggs, ketchup, cheese, old takeout, pickles, soda, ice.
   coolant mist, sparks, puddles, bullet holes, brass, tracers,
   glass, plaster dust. every kind is one instanced mesh, recycled.
============================================================ */
import * as THREE from '../lib/three.module.min.js';
import { canvas, tex } from '../world/textures.js';

const _m = new THREE.Matrix4(), _q = new THREE.Quaternion(), _e = new THREE.Euler(), _s = new THREE.Vector3(), _p = new THREE.Vector3(), _v = new THREE.Vector3(), _up = new THREE.Vector3(0, 1, 0), _c = new THREE.Color(), _q2 = new THREE.Quaternion();
const R = (a, b)=>a + Math.random()*(b - a);

/* ---------- textures ---------- */
const softTex = (()=>{ const c = canvas(64, 64), g = c.getContext('2d'); const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.4, 'rgba(255,255,255,0.45)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, 64, 64); return tex(c, { nomip:true }); })();
const holeTex = (()=>{ const c = canvas(64, 64), g = c.getContext('2d'); g.clearRect(0, 0, 64, 64);
  const gr = g.createRadialGradient(32, 32, 0, 32, 32, 30); gr.addColorStop(0, 'rgba(0,0,0,1)'); gr.addColorStop(0.22, 'rgba(10,8,8,1)'); gr.addColorStop(0.35, 'rgba(60,50,45,0.9)'); gr.addColorStop(0.6, 'rgba(40,30,25,0.35)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.beginPath(); g.arc(32, 32, 30, 0, 7); g.fill();
  g.strokeStyle = 'rgba(20,15,12,0.8)'; g.lineWidth = 1.2; for(let i=0;i<7;i++){ const a = Math.random()*6.28, l = 12 + Math.random()*16; g.beginPath(); g.moveTo(32 + Math.cos(a)*7, 32 + Math.sin(a)*7); g.lineTo(32 + Math.cos(a + R(-0.2, 0.2))*l, 32 + Math.sin(a + R(-0.2, 0.2))*l); g.stroke(); }
  return tex(c, { nomip:true }); })();
const scorchTex = (()=>{ const c = canvas(128, 128), g = c.getContext('2d'); for(let i=0;i<40;i++){ const a = Math.random()*6.28, r = Math.random()*40; const gr = g.createRadialGradient(64 + Math.cos(a)*r, 64 + Math.sin(a)*r, 0, 64 + Math.cos(a)*r, 64 + Math.sin(a)*r, 20 + Math.random()*20); gr.addColorStop(0, 'rgba(10,8,6,0.5)'); gr.addColorStop(1, 'rgba(10,8,6,0)'); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); } return tex(c, { nomip:true }); })();
const cartonTex = (()=>{ const c = canvas(64, 64), g = c.getContext('2d'); g.fillStyle = '#f6f6f2'; g.fillRect(0, 0, 64, 64); g.fillStyle = '#2b6fd6'; g.fillRect(0, 22, 64, 16); g.fillStyle = '#fff'; g.font = 'bold 12px sans-serif'; g.fillText('MILK', 16, 35); return tex(c); })();
const takeoutTex = (()=>{ const c = canvas(64, 64), g = c.getContext('2d'); g.fillStyle = '#f3efe4'; g.fillRect(0, 0, 64, 64); g.fillStyle = '#c0392b'; g.font = 'bold 20px serif'; g.fillText('福', 20, 40); g.strokeStyle = '#c0392b'; g.lineWidth = 3; g.strokeRect(4, 4, 56, 56); return tex(c); })();
const canTex = (()=>{ const c = canvas(64, 64), g = c.getContext('2d'); g.fillStyle = '#d42020'; g.fillRect(0, 0, 64, 64); g.fillStyle = '#fff'; g.font = 'italic bold 15px serif'; g.fillText('Frost', 10, 38); g.fillStyle = '#ccc'; g.fillRect(0, 0, 64, 6); g.fillRect(0, 58, 64, 6); return tex(c); })();

/* a blob for puddles: a circle with a lumpy edge */
function blobGeo(){
  const n = 28, pts = [];
  for(let i=0;i<n;i++){ const a = i/n*Math.PI*2, r = 1 + Math.sin(a*3 + 1)*0.12 + Math.sin(a*5 + 2)*0.08 + Math.sin(a*7)*0.05; pts.push(new THREE.Vector2(Math.cos(a)*r, Math.sin(a)*r)); }
  const g = new THREE.ShapeGeometry(new THREE.Shape(pts)); g.rotateX(-Math.PI/2); return g;
}

class Pool {
  constructor(scene, geo, mat, n, o){
    o = o || {};
    this.n = n; this.o = o;
    this.mesh = new THREE.InstancedMesh(geo, mat, n);
    this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.mesh.frustumCulled = false; this.mesh.count = 0; this.mesh.visible = true; /* visible until the first frame so the loader compiles its shader */
    if(o.color){ this.mesh.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(n*3).fill(1), 3); this.mesh.instanceColor.setUsage(THREE.DynamicDrawUsage); }
    if(o.renderOrder) this.mesh.renderOrder = o.renderOrder;
    scene.add(this.mesh);
    this.p = []; for(let i=0;i<n;i++) this.p.push({ life:0 });
    this.next = 0; this.hi = 0;
  }
  spawn(f){
    /* ring buffer: the oldest particle gets reused when we're full */
    let idx = -1;
    for(let k=0;k<this.n;k++){ const i = (this.next + k) % this.n; if(this.p[i].life <= 0){ idx = i; break; } }
    if(idx < 0) idx = this.next;
    this.next = (idx + 1) % this.n;
    const p = this.p[idx];
    Object.assign(p, { x:0, y:0, z:0, vx:0, vy:0, vz:0, rx:0, ry:0, rz:0, wx:0, wy:0, wz:0, s:1, sx:1, sy:1, sz:1, grow:0, life:1, max:1, grav:9.8, bounce:0.3, drag:0, floor:0, rest:false, fade:true, col:null, fadeCol:false, onLand:null, stretch:0, billboard:false, keep:false, align:null, written:false });
    f(p); p.max = p.life;
    if(p.col && this.mesh.instanceColor){ _c.set(p.col); p.cr = _c.r; p.cg = _c.g; p.cb = _c.b; this.mesh.setColorAt(idx, _c); this.mesh.instanceColor.needsUpdate = true; }
    if(idx + 1 > this.hi) this.hi = idx + 1;
    return p;
  }
  update(dt, camQ){
    let any = false, hi = 0;
    const mesh = this.mesh, cf = this.o.colorFade && mesh.instanceColor;
    for(let i=0;i<this.hi;i++){
      const p = this.p[i];
      if(p.life <= 0){ if(p.alive){ p.alive = false; _m.makeScale(0, 0, 0); mesh.setMatrixAt(i, _m); any = true; } continue; }
      hi = i + 1;
      /* decals that have settled (holes, scorch, finished puddles) were already written: skip them */
      if(p.keep && p.rest && p.written && !p.growing){ p.alive = true; continue; }
      p.alive = true; any = true;
      if(!p.keep) p.life -= dt;
      if(!p.rest){
        p.vy -= p.grav*dt;
        if(p.drag){ const k = Math.max(0, 1 - p.drag*dt); p.vx *= k; p.vy *= k; p.vz *= k; }
        p.x += p.vx*dt; p.y += p.vy*dt; p.z += p.vz*dt;
        p.rx += p.wx*dt; p.ry += p.wy*dt; p.rz += p.wz*dt;
        if(p.y < p.floor){
          p.y = p.floor;
          if(p.onLand){ const f = p.onLand; p.onLand = null; f(p); }
          if(Math.abs(p.vy) < 1.2 || p.bounce <= 0){ p.vy = 0; p.vx *= 0.5; p.vz *= 0.5; if(Math.hypot(p.vx, p.vz) < 0.15){ p.rest = true; p.rx = p.restRx !== undefined ? p.restRx : p.rx; p.rz = p.restRz !== undefined ? p.restRz : p.rz; } }
          else { p.vy = -p.vy*p.bounce; p.vx *= 0.7; p.vz *= 0.7; p.wx *= 0.6; p.wz *= 0.6; }
        }
      }
      let sc = p.s + p.grow*(p.max - p.life);
      const k = p.life/p.max;
      if(p.fade && k < 0.25) sc *= k/0.25;
      _p.set(p.x, p.y, p.z);
      if(p.billboard && camQ){ _q.copy(camQ); if(p.rz){ _e.set(0, 0, p.rz); _q2.setFromEuler(_e); _q.multiply(_q2); } }
      else if(p.stretch){ _v.set(p.vx, p.vy, p.vz); const l = _v.length() || 1; _v.multiplyScalar(1/l); _q.setFromUnitVectors(_up, _v); }
      else if(p.align){ _q.copy(p.align); }
      else { _e.set(p.rx, p.ry, p.rz); _q.setFromEuler(_e); }
      if(p.stretch) _s.set(p.sx*sc, Math.max(p.sy*sc, Math.hypot(p.vx, p.vy, p.vz)*p.stretch), p.sz*sc);
      else _s.set(p.sx*sc, p.sy*sc, p.sz*sc);
      _m.compose(_p, _q, _s); mesh.setMatrixAt(i, _m); p.written = true;
      if(cf && p.cr !== undefined){ const f = Math.min(1, k*1.6); _c.setRGB(p.cr*f, p.cg*f, p.cb*f); mesh.setColorAt(i, _c); }
    }
    if(any){ mesh.instanceMatrix.needsUpdate = true; if(cf) mesh.instanceColor.needsUpdate = true; }
    mesh.count = hi; mesh.visible = hi > 0;
    if(!hi) this.hi = 0;
  }
  clear(){ this.p.forEach(p=>p.life = 0); }
}

export class Gore {
  constructor(C){
    this.C = C;
    const S = C.scene;
    const std = (o)=>new THREE.MeshStandardMaterial(Object.assign({ roughness:0.5 }, o));
    const add = (o)=>new THREE.MeshBasicMaterial(Object.assign({ transparent:true, depthWrite:false, blending:THREE.AdditiveBlending, toneMapped:false }, o));
    const low = C.engine.preset() === 'low';
    const N = low ? 0.5 : 1;
    this.food = {
      carton: new Pool(S, new THREE.BoxGeometry(0.07, 0.16, 0.07), std({ map:cartonTex }), 30*N|0),
      egg: new Pool(S, (()=>{ const g = new THREE.SphereGeometry(0.03, 10, 8); g.scale(1, 1.3, 1); return g; })(), std({ color:0xf3e6cf, roughness:0.4 }), 60*N|0),
      cheese: new Pool(S, new THREE.CylinderGeometry(0.06, 0.06, 0.04, 3, 1, false, 0, Math.PI*0.5), std({ color:0xf2c230, roughness:0.6 }), 30*N|0),
      takeout: new Pool(S, new THREE.CylinderGeometry(0.06, 0.045, 0.08, 4), std({ map:takeoutTex }), 20*N|0),
      can: new Pool(S, new THREE.CylinderGeometry(0.032, 0.032, 0.11, 12), std({ map:canTex, metalness:0.6, roughness:0.3 }), 30*N|0),
      pickle: new Pool(S, new THREE.CapsuleGeometry(0.02, 0.07, 4, 8), std({ color:0x5b8a2a, roughness:0.6 }), 30*N|0),
      lettuce: new Pool(S, new THREE.CircleGeometry(0.05, 7), std({ color:0x7ac043, roughness:0.7, side:THREE.DoubleSide }), 40*N|0),
      jar: new Pool(S, new THREE.CylinderGeometry(0.04, 0.04, 0.1, 10), std({ color:0xd8a020, roughness:0.15, metalness:0.1, transparent:true, opacity:0.8 }), 20*N|0)
    };
    this.foodKinds = Object.keys(this.food);
    this.blob = new Pool(S, new THREE.SphereGeometry(0.03, 8, 6), std({ roughness:0.15 }), 160*N|0, { color:true });
    this.ice = new Pool(S, new THREE.BoxGeometry(0.06, 0.06, 0.06), std({ color:0xbfeeff, roughness:0.05, metalness:0.1, transparent:true, opacity:0.75, emissive:0x2a6a8a, emissiveIntensity:0.5 }), 140*N|0);
    this.mist = new Pool(S, new THREE.PlaneGeometry(1, 1), add({ map:softTex, opacity:0.55 }), 200*N|0, { color:true, colorFade:true });
    this.smoke = new Pool(S, new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map:softTex, transparent:true, depthWrite:false, opacity:0.35, color:0x6a6a70 }), 80*N|0);
    this.spark = new Pool(S, new THREE.BoxGeometry(0.008, 1, 0.008), add({ color:0xffc860 }), 260*N|0, { color:true, colorFade:true });
    this.tracerP = new Pool(S, new THREE.BoxGeometry(0.012, 1, 0.012), add({ color:0xfff0b0, opacity:0.9 }), 60);
    this.debris = new Pool(S, new THREE.BoxGeometry(0.04, 0.04, 0.04), std({ roughness:0.9 }), 160*N|0, { color:true });
    this.glass = new Pool(S, (()=>{ const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute([0, 0.06, 0, -0.04, -0.03, 0, 0.05, -0.04, 0], 3)); g.computeVertexNormals(); return g; })(), new THREE.MeshStandardMaterial({ color:0xcfe8ff, roughness:0.05, metalness:0.3, transparent:true, opacity:0.6, side:THREE.DoubleSide }), 160*N|0);
    this.shell = new Pool(S, new THREE.CylinderGeometry(0.0055, 0.0055, 0.03, 8), std({ color:0xc9a04a, metalness:1, roughness:0.25 }), 60, { color:true });
    this.holeP = new Pool(S, new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map:holeTex, transparent:true, depthWrite:false, polygonOffset:true, polygonOffsetFactor:-4, polygonOffsetUnits:-4 }), 320);
    this.scorch = new Pool(S, new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map:scorchTex, transparent:true, depthWrite:false, polygonOffset:true, polygonOffsetFactor:-3, polygonOffsetUnits:-3 }), 24);
    this.puddle = new Pool(S, blobGeo(), new THREE.MeshStandardMaterial({ roughness:0.06, metalness:0.1, transparent:true, opacity:0.88, depthWrite:false, polygonOffset:true, polygonOffsetFactor:-2, polygonOffsetUnits:-2 }), 70*N|0, { color:true });
    this.pools = [...Object.values(this.food), this.blob, this.ice, this.mist, this.smoke, this.spark, this.tracerP, this.debris, this.glass, this.shell, this.holeP, this.scorch, this.puddle];
    this.holeLog = [];
    this.audioCD = 0;
  }
  update(dt){
    const q = this.C.camera.quaternion;
    for(const p of this.pools) p.update(dt, q);
    this.growPuddles(dt);
    if(this.audioCD > 0) this.audioCD -= dt;
  }
  clear(){ this.pools.forEach(p=>p.clear()); }

  /* ---------- the vocabulary ---------- */
  mistPuff(pos, col, n, o){
    o = o || {};
    for(let i=0;i<n;i++) this.mist.spawn(p=>{ p.x = pos.x + R(-0.05, 0.05); p.y = pos.y + R(-0.05, 0.05); p.z = pos.z + R(-0.05, 0.05); const sp = o.speed || 1.4; const d = o.dir; p.vx = (d ? d.x*sp : 0) + R(-0.6, 0.6)*sp; p.vy = (d ? d.y*sp : 0) + R(-0.2, 0.9)*sp; p.vz = (d ? d.z*sp : 0) + R(-0.6, 0.6)*sp; p.grav = o.grav === undefined ? -0.3 : o.grav; p.drag = 2.2; p.s = o.size || R(0.18, 0.35); p.grow = o.grow || 0.9; p.life = o.life || R(0.8, 1.6); p.billboard = true; p.rz = R(0, 6); p.col = col || '#dff6ff'; p.fade = false; p.floor = -10; });
  }
  sparks(pos, n, o){
    o = o || {};
    for(let i=0;i<n;i++) this.spark.spawn(p=>{ p.x = pos.x; p.y = pos.y; p.z = pos.z; const sp = o.speed || 5; const nr = o.dir; p.vx = (nr ? nr.x*sp*0.7 : 0) + R(-1, 1)*sp; p.vy = (nr ? nr.y*sp*0.7 : 0) + R(-0.3, 1.2)*sp; p.vz = (nr ? nr.z*sp*0.7 : 0) + R(-1, 1)*sp; p.stretch = 0.018; p.sx = p.sz = 1; p.sy = 0.02; p.life = R(0.15, 0.45); p.bounce = 0.4; p.col = o.col || (Math.random() < 0.3 ? '#ffffff' : '#ffb040'); p.fade = false; p.floor = 0.01; });
  }
  smokePuff(pos, n, size){
    for(let i=0;i<n;i++) this.smoke.spawn(p=>{ p.x = pos.x + R(-0.03, 0.03); p.y = pos.y; p.z = pos.z + R(-0.03, 0.03); p.vx = R(-0.2, 0.2); p.vy = R(0.15, 0.5); p.vz = R(-0.2, 0.2); p.grav = -0.1; p.drag = 1.5; p.s = size || 0.12; p.grow = 0.5; p.life = R(1.0, 2.2); p.billboard = true; p.rz = R(0, 6); p.floor = -10; });
  }
  tracer(from, to, o){
    const d = _v.copy(to).sub(from), L = d.length(); if(L < 0.5) return;
    d.multiplyScalar(1/L);
    /* a short streak flying along the path, not a laser */
    const speed = (o && o.speed) || 260, len = Math.min(L, 2.2);
    this.tracerP.spawn(p=>{ p.x = from.x + d.x*0.6; p.y = from.y + d.y*0.6; p.z = from.z + d.z*0.6; p.vx = d.x*speed; p.vy = d.y*speed; p.vz = d.z*speed; p.grav = 0; p.stretch = len/speed; p.sx = p.sz = (o && o.thick) || 1; p.sy = len; p.life = Math.max(0.02, (L - 0.6)/speed); p.fade = false; p.floor = -100; });
  }
  hole(pos, n, size){
    const s = size || R(0.05, 0.075);
    const nv = _v.set(n.x, n.y, n.z).normalize();
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), nv);
    const spin = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), R(0, 6.28)); q.multiply(spin);
    this.holeP.spawn(p=>{ p.x = pos.x + nv.x*0.004; p.y = pos.y + nv.y*0.004; p.z = pos.z + nv.z*0.004; p.grav = 0; p.rest = true; p.keep = true; p.life = 1; p.s = s; p.align = q; p.fade = false; });
    if(this.holeLog.length < 90) this.holeLog.push([+pos.x.toFixed(2), +pos.y.toFixed(2), +pos.z.toFixed(2), +nv.x.toFixed(2), +nv.y.toFixed(2), +nv.z.toFixed(2)]);
  }
  scorchMark(pos, size){
    const q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI/2);
    this.scorch.spawn(p=>{ p.x = pos.x; p.y = 0.012; p.z = pos.z; p.grav = 0; p.rest = true; p.keep = true; p.life = 1; p.s = size || 2; p.align = q; p.fade = false; });
  }
  puddleAt(x, z, col, size){
    this.puddle.spawn(p=>{ p.x = x; p.y = 0.006 + Math.random()*0.002; p.z = z; p.grav = 0; p.rest = true; p.keep = true; p.life = 1; p.s = 0.05; p.grow = 0; p.ry = R(0, 6.28); p.col = col; p.fade = false; p.target = size || R(0.15, 0.35); p.growing = true; });
  }
  /* puddles grow for a bit after they land */
  growPuddles(dt){
    for(const p of this.puddle.p){ if(p.life > 0 && p.growing){ p.s += (p.target - p.s)*Math.min(1, dt*1.5); if(Math.abs(p.target - p.s) < 0.005) p.growing = false; } }
  }
  debrisBurst(pos, n, col, nrm, size){
    for(let i=0;i<n;i++) this.debris.spawn(p=>{ p.x = pos.x; p.y = pos.y; p.z = pos.z; const sp = R(1.2, 3.2); p.vx = (nrm ? nrm.x*sp : 0) + R(-1, 1); p.vy = (nrm ? nrm.y*sp : 0) + R(0, 2.2); p.vz = (nrm ? nrm.z*sp : 0) + R(-1, 1); p.wx = R(-15, 15); p.wy = R(-15, 15); p.wz = R(-15, 15); p.s = (size || 1)*R(0.3, 1); p.life = R(2, 5); p.bounce = 0.3; p.col = col; });
  }
  glassBurst(pos, n, dir){
    for(let i=0;i<n;i++) this.glass.spawn(p=>{ p.x = pos.x + R(-0.4, 0.4); p.y = pos.y + R(-0.6, 0.6); p.z = pos.z + R(-0.1, 0.1); const sp = R(1, 3); p.vx = (dir ? dir.x*sp : 0) + R(-1, 1); p.vy = R(-0.5, 2); p.vz = (dir ? dir.z*sp : 0) + R(-1, 1); p.wx = R(-20, 20); p.wy = R(-20, 20); p.wz = R(-20, 20); p.s = R(0.6, 1.8); p.life = R(6, 12); p.bounce = 0.2; p.restRx = -Math.PI/2; p.restRz = 0; });
  }
  iceBurst(pos, n, o){
    o = o || {};
    for(let i=0;i<n;i++) this.ice.spawn(p=>{ p.x = pos.x + R(-0.3, 0.3); p.y = pos.y + R(0, 1.4); p.z = pos.z + R(-0.3, 0.3); const sp = R(1.5, 4.5)*(o.power || 1); const a = R(0, 6.28); p.vx = Math.cos(a)*sp; p.vy = R(1, 4); p.vz = Math.sin(a)*sp; p.wx = R(-12, 12); p.wy = R(-12, 12); p.wz = R(-12, 12); p.s = R(0.6, 2.2); p.life = R(5, 10); p.bounce = 0.35; });
    this.mistPuff(new THREE.Vector3(pos.x, pos.y + 0.8, pos.z), '#bfefff', 10, { size:0.5, speed:1.6, life:1.6 });
  }
  shellEject(pos, vel, red){
    this.shell.spawn(p=>{ p.x = pos.x; p.y = pos.y; p.z = pos.z; p.vx = vel.x; p.vy = vel.y; p.vz = vel.z; p.wx = R(-30, 30); p.wy = R(-30, 30); p.wz = R(-30, 30); p.life = 6; p.bounce = 0.45; p.col = red ? '#b02020' : '#c9a04a'; p.sy = red ? 2.2 : 1; p.sx = p.sz = red ? 1.7 : 1;
      p.restRx = Math.PI/2; p.onLand = ()=>{ if(this.audioCD <= 0){ this.audioCD = 0.05; this.C.audio.heist && this.C.audio.heist.shell(new THREE.Vector3(p.x, 0, p.z), red); } }; });
  }
  /* the main event: a fridge coming apart */
  spill(pos, dir, o){
    o = o || {};
    const n = o.n || 10, power = o.power || 1;
    for(let i=0;i<n;i++){
      const kind = this.foodKinds[(Math.random()*this.foodKinds.length)|0];
      this.food[kind].spawn(p=>{ p.x = pos.x + R(-0.15, 0.15); p.y = pos.y + R(-0.3, 0.3); p.z = pos.z + R(-0.15, 0.15); const sp = R(1, 3.5)*power; p.vx = (dir ? dir.x*sp : 0) + R(-1.2, 1.2); p.vy = R(0.5, 3)*power; p.vz = (dir ? dir.z*sp : 0) + R(-1.2, 1.2); p.wx = R(-10, 10); p.wy = R(-10, 10); p.wz = R(-10, 10); p.life = R(25, 40); p.bounce = kind === 'egg' ? 0 : 0.3; p.s = R(0.85, 1.15);
        if(kind === 'egg') p.onLand = q=>{ this.puddleAt(q.x, q.z, '#f6c33a', R(0.06, 0.1)); this.blobBurst(new THREE.Vector3(q.x, 0.03, q.z), 3, '#f7f0dc', 0.4); q.life = 0.01; };
        if(kind === 'carton') p.onLand = q=>{ this.puddleAt(q.x + R(-0.1, 0.1), q.z + R(-0.1, 0.1), '#f4f4ee', R(0.2, 0.4)); };
        if(kind === 'jar') p.onLand = q=>{ this.glassBurst(new THREE.Vector3(q.x, 0.05, q.z), 3); this.puddleAt(q.x, q.z, '#c8961c', R(0.12, 0.2)); q.life = 0.01; };
        if(kind === 'lettuce'){ p.grav = 4; p.drag = 1.2; p.restRx = -Math.PI/2; }
      });
    }
    /* sauces: droplets that leave puddles where they land */
    const sauces = ['#b8160f', '#f4f4ee', '#e0b020', '#5aa02a', '#b8160f'];
    for(let i=0;i<(o.sauce || 12); i++){ const col = sauces[(Math.random()*sauces.length)|0]; this.blobBurst(pos, 1, col, power, true); }
  }
  blobBurst(pos, n, col, power, puddle){
    for(let i=0;i<n;i++) this.blob.spawn(p=>{ p.x = pos.x + R(-0.1, 0.1); p.y = pos.y + R(-0.2, 0.2); p.z = pos.z + R(-0.1, 0.1); const sp = R(0.8, 3)*(power || 1); const a = R(0, 6.28); p.vx = Math.cos(a)*sp; p.vy = R(0.5, 3.2)*(power || 1); p.vz = Math.sin(a)*sp; p.s = R(0.5, 1.4); p.life = R(0.8, 3); p.bounce = 0; p.col = col; p.sy = 0.7;
      if(puddle) p.onLand = q=>{ if(Math.random() < 0.6) this.puddleAt(q.x, q.z, col, R(0.08, 0.22)); q.life = Math.min(q.life, 0.2); }; });
  }
  /* coolant venting from a bullet hole in a fridge */
  coolant(pos, nrm, n){
    this.mistPuff(pos, '#e6f8ff', n || 6, { dir:nrm, speed:2.2, size:0.12, grow:1.4, life:0.9 });
  }
  /* bullets hitting the world */
  impact(pos, nrm, surface){
    const s = surface || 'wall';
    const COL = { wall:'#3b4a3a', marble:'#e8e6e0', wood:'#5a3218', carpet:'#7a1a20', metal:'#888', floor:'#7a1a20', ceiling:'#2a2228', gold:'#d9a441', glass:'#cfe8ff', felt:'#1f6a3a' };
    if(s !== 'glass') this.hole(pos, nrm);
    if(s === 'metal' || s === 'gold'){ this.sparks(pos, 6, { dir:nrm, speed:4 }); }
    else { this.debrisBurst(pos, 4, COL[s] || '#888', nrm, 0.6); this.mistPuff(pos, s === 'marble' ? '#cfcac0' : '#5a5050', 2, { dir:nrm, speed:0.8, size:0.1, grow:0.6, life:0.7, grav:0.2 }); }
  }
  explosion(pos, r){
    r = r || 3;
    this.mistPuff(pos, '#ffb050', 18, { size:0.9, speed:5, life:0.6, grow:3, grav:-1 });
    this.mistPuff(pos, '#ff6a20', 10, { size:0.6, speed:3, life:0.4, grow:2 });
    this.smokePuff(pos, 16, 0.7);
    this.sparks(pos, 50, { speed:9 });
    this.debrisBurst(pos, 30, '#2a2a2a', new THREE.Vector3(0, 1, 0), 1.6);
    this.scorchMark(pos, r*1.1);
  }
}
