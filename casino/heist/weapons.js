/* ============================================================
   FRIDGE PALACE HEIST: the guns in your hands
   drawing, holstering, aiming down the sights, recoil that climbs,
   sway when you look around, bob when you walk, the sprint tuck,
   reloads that move the actual parts, shells that bounce, muzzle
   flash that lights the room, and the freon cannon's breath.
============================================================ */
import * as THREE from '../lib/three.module.min.js';
import { BUILDERS, WEAPONS, MAT } from './guns.js';
import { canvas, tex } from '../world/textures.js';

const lerp = (a, b, k)=>a + (b - a)*k;
const sm = t=>t <= 0 ? 0 : t >= 1 ? 1 : t*t*(3 - 2*t);
const seg = (t, a, b)=>sm((t - a)/(b - a));

const flashTex = (()=>{ const c = canvas(128, 128), g = c.getContext('2d'); g.translate(64, 64);
  const gr = g.createRadialGradient(0, 0, 0, 0, 0, 60); gr.addColorStop(0, 'rgba(255,255,230,1)'); gr.addColorStop(0.2, 'rgba(255,210,120,0.9)'); gr.addColorStop(0.5, 'rgba(255,140,40,0.35)'); gr.addColorStop(1, 'rgba(255,90,0,0)'); g.fillStyle = gr;
  for(let i=0;i<7;i++){ g.save(); g.rotate(i/7*Math.PI*2 + Math.random()*0.3); g.beginPath(); g.moveTo(0, -6); g.lineTo(58 - Math.random()*20, 0); g.lineTo(0, 6); g.fill(); g.restore(); }
  g.beginPath(); g.arc(0, 0, 22, 0, 7); g.fill(); return tex(c, { nomip:true }); })();

export class Arsenal {
  constructor(C){
    this.C = C;
    const E = C.engine;
    this.vm = E.vmScene; this.vmCam = E.vmCamera;
    /* light for the gun: warm key from above, pink fill like the room, and the flash */
    const hemi = new THREE.HemisphereLight(0xffe2c0, 0x3a1020, 1.4); this.vm.add(hemi);
    const key = new THREE.DirectionalLight(0xfff0dd, 1.6); key.position.set(0.5, 1, 0.3); this.vm.add(key);
    const rim = new THREE.DirectionalLight(0xff7ad0, 0.7); rim.position.set(-0.8, 0.2, -0.5); this.vm.add(rim);
    this.vmFlash = new THREE.PointLight(0xffb060, 0, 1.5, 2); this.vmFlash.position.set(0.1, -0.05, -0.5); this.vm.add(this.vmFlash);
    this.vmLights = [hemi, key, rim];
    this.root = new THREE.Group(); this.root.visible = false; this.vm.add(this.root);
    /* the room lights up when you shoot */
    this.worldFlash = new THREE.PointLight(0xffb060, 0, 9, 1.8); C.scene.add(this.worldFlash);
    this.models = {}; this.owned = {}; this.ammo = {}; this.order = [];
    this.cur = null; this.last = null; this.drawn = false;
    this.state = 'holstered'; this.stT = 0; this.fireCD = 0; this.bloom = 0;
    this.adsK = 0; this.sprintK = 0; this.bobT = 0; this.swX = 0; this.swY = 0;
    this.rec = { z:0, rx:0, ry:0, rz:0 }; this.recoilDebt = 0;
    this.touch = { fire:false, ads:false };
    this.freonRegenT = 0; this.streaming = false; this.streamT = 0;
    this.flashT = 0; this.inspectT = 0; this.pumpT = 0; this.reloadShells = 0;
    this.enabled = true;
    this._v = new THREE.Vector3(); this._q = new THREE.Quaternion();
  }
  give(key, full){
    const W = WEAPONS[key]; if(!W) return;
    if(!this.owned[key]){ this.owned[key] = true; this.order.push(key); this.order.sort((a, b)=>WEAPONS[a].slot - WEAPONS[b].slot); this.ammo[key] = { mag:W.mag, reserve:W.reserve }; }
    else if(full){ this.ammo[key].mag = W.mag; this.ammo[key].reserve = Math.max(this.ammo[key].reserve, W.reserve); }
    this.C.bus.emit('weapons');
  }
  addAmmo(key, n){ const W = WEAPONS[key], a = this.ammo[key]; if(!W || !a || !W.maxReserve) return 0; const before = a.reserve; a.reserve = Math.min(W.maxReserve, a.reserve + n); return a.reserve - before; }
  model(key){
    if(this.models[key]) return this.models[key];
    const m = BUILDERS[key](); m.group.visible = false; this.root.add(m.group);
    /* muzzle flash: three crossed cards */
    const fm = new THREE.MeshBasicMaterial({ map:flashTex, transparent:true, depthWrite:false, blending:THREE.AdditiveBlending, toneMapped:false, side:THREE.DoubleSide });
    const fl = new THREE.Group(); for(let i=0;i<3;i++){ const p = new THREE.Mesh(new THREE.PlaneGeometry(0.16, 0.16), fm); p.rotation.y = i*Math.PI/3; p.rotation.x = Math.PI/2; fl.add(p); } const front = new THREE.Mesh(new THREE.PlaneGeometry(0.12, 0.12), fm); fl.add(front);
    fl.visible = false; m.muzzle.add(fl); m.flash = fl;
    m.group.traverse(o=>{ o.frustumCulled = false; });
    this.models[key] = m; return m;
  }
  get W(){ return this.cur ? WEAPONS[this.cur] : null; }
  get a(){ return this.cur ? this.ammo[this.cur] : null; }
  select(key){
    if(!this.owned[key] || !this.enabled) return;
    if(this.cur === key && this.drawn && this.state !== 'holster'){ return; }
    if(this.drawn && this.cur && this.cur !== key){ this.next = key; this.state = 'holster'; this.stT = 0; this.cancelReload(); return; }
    this.last = this.cur && this.cur !== key ? this.cur : this.last;
    if(this.cur && this.models[this.cur]) this.models[this.cur].group.visible = false;
    this.cur = key; const m = this.model(key); m.group.visible = true; this.root.visible = true;
    this.drawn = true; this.state = 'draw'; this.stT = 0;
    this.C.audio.heist && this.C.audio.heist.slide(0, true); this.C.audio.heist && this.C.audio.heist.click(2200, 0.25, 0.2);
    this.C.bus.emit('draw', { key });
    this.C.bus.emit('weapons');
  }
  holster(){ if(!this.drawn) return; this.next = null; this.state = 'holster'; this.stT = 0; this.cancelReload(); this.stopStream(); }
  cycle(dir){ if(!this.order.length) return; const i = this.order.indexOf(this.cur); const k = this.order[(i + (dir || 1) + this.order.length) % this.order.length]; this.select(k); }
  cancelReload(){ if(this.state === 'reload'){ this.state = 'idle'; this.stT = 0; const m = this.models[this.cur]; if(m) this.resetParts(m); } }
  resetParts(m){ const P = m.parts; if(P.crane) P.crane.rotation.set(0, 0, 0); if(P.rounds){ P.rounds.visible = true; P.rounds.children.forEach(r=>r.visible = true); } if(P.mag){ P.mag.position.set(0, -0.04, -0.02); P.mag.visible = true; } if(P.pump) P.pump.position.z = -0.25; if(P.bolt) P.bolt.position.z = 0.03; if(P.shell) P.shell.visible = false; }
  reload(){
    const W = this.W, a = this.a; if(!W || !this.drawn || this.state !== 'idle' || W.stream) return;
    if(a.mag >= W.mag || a.reserve <= 0) return;
    this.state = 'reload'; this.stT = 0; this.reloadStep = 0; this.reloadShells = 0;
    if(this.cur === 'revolver'){ this.C.audio.heist.click(1800, 0.3, 0.25); }
    this.C.bus.emit('reload', { key:this.cur });
  }
  /* world-space muzzle, for tracers and the room flash */
  muzzleWorld(){
    const m = this.models[this.cur]; if(!m) return this.C.camera.position.clone();
    m.muzzle.updateWorldMatrix(true, false);
    const p = new THREE.Vector3().setFromMatrixPosition(m.muzzle.matrixWorld);
    return this.C.camera.localToWorld(p);
  }
  aimDir(){ const d = new THREE.Vector3(); this.C.camera.getWorldDirection(d); return d; }
  spread(){
    const W = this.W; if(!W) return 0;
    const P = this.C.player, moving = P.walkAmt || 0;
    let s = lerp(W.spread, W.adsSpread, this.adsK) + this.bloom + moving*0.025*(1 - this.adsK*0.6);
    if(P.crouch) s *= 0.72;
    if(this.C.drunk) s += this.C.drunk*0.03;
    return s;
  }
  trigger(){
    const C = this.C, W = this.W, a = this.a;
    if(!W || this.state === 'draw' || this.state === 'holster' || this.sprintK > 0.5) return false;
    if(this.state === 'reload'){
      /* shotguns can stop reloading to shoot */
      if(this.cur === 'shotgun' && a.mag > 0){ this.state = 'idle'; this.models.shotgun.parts.shell.visible = false; }
      else return false;
    }
    if(this.fireCD > 0 || this.pumpT > 0) return false;
    if(W.stream) return false;
    if(a.mag <= 0){ C.audio.heist.dry(); this.fireCD = 0.25; if(a.reserve > 0) this.reload(); return false; }
    a.mag--; this.fireCD = W.rof;
    const from = C.camera.position.clone(), dir = this.aimDir();
    const tr = this.muzzleWorld();
    C.combat.fire({ from, dir, dmg:W.dmg, pellets:W.pellets, spread:this.spread(), range:W.range, falloff:W.falloff, crit:W.crit, knock:W.knock || 1, weapon:this.cur, tracerFrom:tr });
    C.audio.heist.gun(this.cur, null);
    /* recoil: a visual kick plus a climb that mostly comes back */
    const P = C.player, rk = W.recoil*(1 - this.adsK*0.35)*(P.crouch ? 0.75 : 1);
    P.pitch += rk*0.55; this.recoilDebt += rk*0.35; P.yaw += (Math.random() - 0.5)*W.recoilX*2;
    P.kick.y += rk*0.4; P.addShake(W.shake*(1 - this.adsK*0.5));
    this.rec.z += this.cur === 'shotgun' ? 0.075 : this.cur === 'revolver' ? 0.05 : 0.022;
    this.rec.rx += this.cur === 'shotgun' ? 0.22 : this.cur === 'revolver' ? 0.32 : 0.05;
    this.rec.rz += (Math.random() - 0.5)*0.08;
    this.bloom = Math.min(0.12, this.bloom + W.bloom);
    /* flash */
    const m = this.models[this.cur]; m.flash.visible = true; m.flash.rotation.z = Math.random()*6; const fs = this.cur === 'shotgun' ? 1.5 : this.cur === 'smg' ? 0.8 : 1.1; m.flash.scale.setScalar(fs*(0.8 + Math.random()*0.4)); this.flashT = 0.045;
    this.vmFlash.intensity = 6; this.worldFlash.position.copy(tr); this.worldFlash.intensity = this.cur === 'shotgun' ? 28 : 18;
    C.gore.smokePuff(tr, 2, 0.06);
    /* the moving parts */
    const Pp = m.parts;
    if(this.cur === 'revolver'){ Pp.drum.rotation.z += Math.PI/3; Pp.hammer.rotation.x = 0.2; }
    if(this.cur === 'smg'){ Pp.bolt.position.z = 0.055; this.ejectShell(false); }
    if(this.cur === 'shotgun'){ this.pumpT = 0.62; }
    C.bus.emit('fired', { key:this.cur, ammo:a.mag });
    if(a.mag === 0 && a.reserve > 0 && this.cur !== 'shotgun') setTimeout(()=>{ if(this.state === 'idle') this.reload(); }, 320);
    return true;
  }
  ejectShell(red){
    const m = this.models[this.cur]; if(!m || !m.eject) return;
    m.eject.updateWorldMatrix(true, false);
    const p = this.C.camera.localToWorld(new THREE.Vector3().setFromMatrixPosition(m.eject.matrixWorld));
    const r = new THREE.Vector3(1, 0, 0).applyQuaternion(this.C.camera.quaternion), u = new THREE.Vector3(0, 1, 0);
    const v = r.multiplyScalar(1.4 + Math.random()*0.8).addScaledVector(u, 1.6 + Math.random()*0.8);
    this.C.gore.shellEject(p, v, red);
  }
  stopStream(){ if(this.streaming){ this.streaming = false; this.C.audio.heist && this.C.audio.heist.freonStop(); } }
  stream(dt){
    const C = this.C, a = this.a, W = this.W;
    if(a.mag <= 0){ this.stopStream(); if(!this._sputter){ this._sputter = true; C.audio.heist.dry(); } return; }
    this._sputter = false;
    if(!this.streaming){ this.streaming = true; C.audio.heist.freonStart(); }
    this.freonRegenT = 1.4;
    a.mag = Math.max(0, a.mag - dt*16);
    this.streamT -= dt;
    const from = this.muzzleWorld(), dir = this.aimDir();
    if(this.streamT <= 0){
      this.streamT = 0.04;
      C.gore.mistPuff(from, '#cdf3ff', 2, { dir, speed:8, size:0.08, grow:1.8, life:0.7, grav:-0.2 });
      const hits = C.combat.cone({ from:C.camera.position, dir, range:W.range, angle:W.spread });
      hits.forEach(h=>h.tg.freeze(W.freeze*0.04*(1 - h.dist/W.range*0.5), dir));
      C.bus.emit('freon', { from, dir });
    }
    this.rec.z += dt*0.02; this.rec.rx = Math.max(this.rec.rx, Math.sin(this.stT*40)*0.006);
    C.player.addShake(dt*0.6);
  }
  update(dt){
    const C = this.C, I = C.input, P = C.player;
    if(this.fireCD > 0) this.fireCD -= dt;
    this.bloom = Math.max(0, this.bloom - dt*0.25);
    /* the climb comes back down */
    if(this.recoilDebt > 0){ const r = Math.min(this.recoilDebt, dt*0.9); P.pitch -= r; this.recoilDebt -= r; }
    P.kick.y *= Math.max(0, 1 - dt*12); P.kick.x *= Math.max(0, 1 - dt*12);
    this.rec.z *= Math.max(0, 1 - dt*14); this.rec.rx *= Math.max(0, 1 - dt*12); this.rec.rz *= Math.max(0, 1 - dt*10);
    if(this.flashT > 0){ this.flashT -= dt; if(this.flashT <= 0 && this.cur) this.models[this.cur].flash.visible = false; }
    this.vmFlash.intensity *= Math.max(0, 1 - dt*40); this.worldFlash.intensity *= Math.max(0, 1 - dt*35);
    C.engine.vmOn = this.root.visible && this.drawn;
    if(!this.drawn || !this.cur){ this.root.visible = false; C.engine.vmOn = false; I.lookScale = 1; this.adsK = 0; P.noRun = false; P.speedMul = C.heist && C.heist.carryMul ? C.heist.carryMul() : 1; this.applyFov(); return; }
    const W = this.W, a = this.a, m = this.models[this.cur], G = m.group, Pp = m.parts;
    const canInput = this.enabled && !C.hud.paused && !C.hud.modalOpen && !C.seated && P.mode === 'walk';
    this.stT += dt;
    /* aiming */
    const wantAds = canInput && (I.mouse.r || this.touch.ads) && this.state !== 'reload' && this.state !== 'draw' && this.state !== 'holster' && this.sprintK < 0.3;
    this.adsK += ((wantAds ? 1 : 0) - this.adsK)*Math.min(1, dt*(wantAds ? 12 : 9));
    I.lookScale = 1 - this.adsK*0.45;
    P.noRun = this.adsK > 0.3 || (I.mouse.l && W && !W.stream);
    P.speedMul = (1 - this.adsK*0.45)*(C.heist && C.heist.carryMul ? C.heist.carryMul() : 1);
    this.sprintK += ((P.running && this.state !== 'reload' ? 1 : 0) - this.sprintK)*Math.min(1, dt*8);
    /* triggers */
    if(canInput){
      const held = I.mouse.l || this.touch.fire, pressed = I.mousePressed.l || this.touch.firePressed;
      this.touch.firePressed = false;
      if(W.stream){ if(held && this.state === 'idle' && this.sprintK < 0.5) this.stream(dt); else this.stopStream(); }
      else if(W.auto ? held : pressed) this.trigger();
      if(I.was('KeyR')) this.reload();
      if(I.was('KeyV') && this.state === 'idle'){ this.inspectT = 2.4; C.bus.emit('inspect', { key:this.cur }); }
    } else this.stopStream();
    if(W.stream && !this.streaming){ this.freonRegenT -= dt; if(this.freonRegenT <= 0) a.mag = Math.min(W.mag, a.mag + dt*7); }
    if(Pp.needle) Pp.needle.rotation.z = 2.3 - (a.mag/W.mag)*4.6;
    if(Pp.ring){ Pp.ring.material.color.setHSL(0.52, 1, this.streaming ? 0.75 : 0.45 + Math.sin(this.stT*3)*0.05); }
    if(Pp.frost) Pp.frost.material.opacity = 0.35 + (1 - a.mag/W.mag)*0.4;
    /* state machine: draw, holster, reload, pump */
    let ox = 0, oy = 0, oz = 0, rx = 0, ry = 0, rz = 0;
    if(this.state === 'draw'){ const k = 1 - sm(this.stT/0.38); oy -= k*0.25; rx -= k*0.9; rz += k*0.3; if(this.stT >= 0.38){ this.state = 'idle'; this.stT = 0; } }
    if(this.state === 'holster'){
      const k = sm(this.stT/0.3); oy -= k*0.25; rx -= k*0.9; rz += k*0.3;
      if(this.stT >= 0.3){ G.visible = false; this.resetParts(m); if(this.next){ const n = this.next; this.next = null; this.drawn = false; this.select(n); return; } this.drawn = false; this.state = 'holstered'; this.root.visible = false; C.bus.emit('holster'); C.bus.emit('weapons'); return; }
    }
    if(this.pumpT > 0){
      this.pumpT -= dt; const t = 0.62 - this.pumpT;
      const k = t < 0.18 ? 0 : t < 0.36 ? (t - 0.18)/0.18 : t < 0.54 ? 1 - (t - 0.36)/0.18 : 0;
      Pp.pump.position.z = -0.25 + sm(k)*0.075; rx += sm(k)*0.06; rz -= sm(k)*0.08;
      if(t >= 0.2 && !this._pb){ this._pb = true; C.audio.heist.slide(0, false); this.ejectShell(true); }
      if(t >= 0.4 && !this._pf){ this._pf = true; C.audio.heist.slide(0, true); C.audio.heist.clack(0.04); }
      if(this.pumpT <= 0){ this._pb = this._pf = false; }
    }
    if(this.state === 'reload') { const r = this.animReload(dt, m); ox += r[0]; oy += r[1]; oz += r[2]; rx += r[3]; ry += r[4]; rz += r[5]; }
    if(this.cur === 'revolver') Pp.hammer.rotation.x += (-0.4 - Pp.hammer.rotation.x)*Math.min(1, dt*10);
    if(this.cur === 'smg') Pp.bolt.position.z += (0.03 - Pp.bolt.position.z)*Math.min(1, dt*30);
    if(this.inspectT > 0){ this.inspectT -= dt; const k = Math.sin(Math.min(1, (2.4 - this.inspectT)/2.4)*Math.PI); ry -= k*1.1; rx += k*0.25; rz += k*0.35; ox -= k*0.06; oz += k*0.05; }
    /* sway from looking, bob from walking, the sprint tuck, breathing */
    this.swX += ((I.look.x || 0)*-3 - this.swX)*Math.min(1, dt*10); this.swY += ((I.look.y || 0)*-3 - this.swY)*Math.min(1, dt*10);
    this.swX = Math.max(-0.15, Math.min(0.15, this.swX)); this.swY = Math.max(-0.15, Math.min(0.15, this.swY));
    const walk = P.walkAmt || 0, ak = 1 - this.adsK*0.85;
    this.bobT += dt*(P.running ? 11 : 7.5)*Math.max(0.2, walk);
    const bx = Math.sin(this.bobT)*0.012*walk*ak, by = -Math.abs(Math.cos(this.bobT))*0.012*walk*ak;
    const breathe = Math.sin(this.stT*1.6)*0.003*ak;
    const hip = m.hip, ads = m.ads;
    const crouchDip = P.crouchK*0.012;
    const narrow = C.camera.aspect < 0.8 ? 0.55 : 1;
    G.position.set(lerp(hip.x*narrow, ads.x, this.adsK) + bx + this.swX*0.04*ak + ox - this.sprintK*0.05, lerp(hip.y, ads.y, this.adsK) + by + breathe + this.swY*0.03*ak + oy - this.sprintK*0.04 - crouchDip, lerp(hip.z, ads.z, this.adsK) + this.rec.z + oz + this.sprintK*0.03);
    G.rotation.set(this.rec.rx + this.swY*0.6*ak + rx - this.sprintK*0.35, this.swX*0.8*ak + ry + this.sprintK*0.6, this.rec.rz + this.swX*0.5*ak + rz + this.sprintK*0.25 + bx*2);
    this.applyFov();
  }
  applyFov(){
    const cam = this.C.camera, base = cam.aspect < 0.8 ? 82 : 72;
    const W = this.W, target = W && this.drawn ? lerp(base, W.adsFov || base*0.75, this.adsK) : base;
    if(Math.abs(cam.fov - target) > 0.01){ cam.fov = target; cam.updateProjectionMatrix(); }
    const vb = cam.aspect < 0.8 ? 70 : 58, vt = lerp(vb, vb*0.88, this.adsK);
    if(Math.abs(this.vmCam.fov - vt) > 0.01){ this.vmCam.fov = vt; this.vmCam.updateProjectionMatrix(); }
  }
  /* reloads: [ox, oy, oz, rx, ry, rz] offsets, and the parts move */
  animReload(dt, m){
    const C = this.C, H = C.audio.heist, a = this.a, W = this.W, P = m.parts, t = this.stT;
    const o = [0, 0, 0, 0, 0, 0];
    if(this.cur === 'revolver'){
      const T = W.reload;
      const tilt = seg(t, 0, 0.3) - seg(t, T - 0.25, T);
      o[5] += tilt*0.7; o[3] += tilt*0.25; o[0] -= tilt*0.04; o[1] += tilt*0.02;
      P.crane.rotation.z = (seg(t, 0.25, 0.45) - seg(t, T - 0.45, T - 0.3))*1.25;
      const up = seg(t, 0.5, 0.7) - seg(t, 0.9, 1.05); o[3] += up*0.9;
      if(t > 0.72 && this.reloadStep === 0){ this.reloadStep = 1; P.rounds.visible = false; for(let i=0;i<6 - a.mag;i++) setTimeout(()=>this.ejectShellAt(m), i*25); }
      /* rounds go back in one at a time */
      const need = Math.min(W.mag - a.mag, a.reserve);
      const per = (T - 1.55)/Math.max(1, need);
      const shown = Math.floor(Math.max(0, t - 1.05)/per);
      if(t > 1.05){ P.rounds.visible = true; P.rounds.children.forEach((r, i)=>r.visible = i < a.mag + Math.min(need, shown)); }
      if(t > 1.05 && shown > (this._rs || 0) && shown <= need){ this._rs = shown; H.click(2800, 0.15); }
      if(t > T - 0.42 && this.reloadStep === 1){ this.reloadStep = 2; H.clack(0); H.click(1600, 0.35, 0.02); }
      if(t >= T){ const n = Math.min(W.mag - a.mag, a.reserve); a.mag += n; a.reserve -= n; this.state = 'idle'; this.stT = 0; this._rs = 0; P.rounds.children.forEach(r=>r.visible = true); P.crane.rotation.z = 0; C.bus.emit('reloaded'); }
    } else if(this.cur === 'smg'){
      const T = W.reload;
      const tilt = seg(t, 0, 0.25) - seg(t, T - 0.25, T);
      o[5] -= tilt*0.45; o[3] += tilt*0.15; o[1] += tilt*0.02;
      const out = seg(t, 0.3, 0.55);
      if(t < 0.75){ P.mag.position.y = -0.04 - out*0.25; }
      if(t > 0.3 && this.reloadStep === 0){ this.reloadStep = 1; H.click(1400, 0.3); H.slide(0.02, false); }
      if(t >= 0.75 && t < 1.25){ const k = seg(t, 0.75, 1.2); P.mag.position.y = -0.3 + k*0.26; }
      if(t > 1.2 && this.reloadStep === 1){ this.reloadStep = 2; P.mag.position.y = -0.04; H.clack(0); }
      const bolt = seg(t, 1.4, 1.55) - seg(t, 1.6, 1.68); P.bolt.position.z = 0.03 + bolt*0.04; o[4] += bolt*0.2;
      if(t > 1.6 && this.reloadStep === 2){ this.reloadStep = 3; H.slide(0, true); H.click(2400, 0.4, 0.05); }
      if(t >= T){ const n = Math.min(W.mag - a.mag, a.reserve); a.mag += n; a.reserve -= n; this.state = 'idle'; this.stT = 0; C.bus.emit('reloaded'); }
    } else if(this.cur === 'shotgun'){
      const T = W.reloadShell;
      const tilt = seg(t + this.reloadShells*T, 0, 0.25);
      o[5] -= tilt*0.35; o[3] += tilt*0.2; o[0] -= tilt*0.03; o[1] += tilt*0.03;
      const k = t/T;
      P.shell.visible = k > 0.1 && k < 0.85; P.shell.position.set(0.0, -0.04 + Math.min(1, k*1.6)*0.03, 0.04 - Math.min(1, k*1.4)*0.12);
      o[3] += Math.sin(Math.min(1, k)*Math.PI)*0.05;
      if(t >= T){
        this.stT = 0; a.mag++; a.reserve--; this.reloadShells++; H.click(2000, 0.3); C.audio.burst({ ff:900, q:2, d:0.05, g:0.25 });
        if(a.mag >= W.mag || a.reserve <= 0){ this.state = 'idle'; P.shell.visible = false; this.pumpT = this.reloadShells > 0 && this._needPump ? 0.62 : 0; C.bus.emit('reloaded'); }
      }
    }
    return o;
  }
  ejectShellAt(m){
    const C = this.C;
    const p = C.camera.localToWorld(new THREE.Vector3(0.1, -0.05, -0.3));
    C.gore.shellEject(p, new THREE.Vector3((Math.random() - 0.5)*0.4, -0.5, (Math.random() - 0.5)*0.4), false);
  }
  dispose(){ this.stopStream(); try{ this.vm.remove(this.root); this.vmLights.forEach(l=>this.vm.remove(l)); this.vm.remove(this.vmFlash); this.C.scene.remove(this.worldFlash); }catch(e){} this.C.input.lookScale = 1; }
}
