/* ============================================================
   COLD OPEN: the gold fridge and the defroster
   the prize fridge on the podium was never a prize. it swells, its
   doors blow open, there's fire inside, and it comes off the podium
   hopping like a fridge does, except it weighs four tons. when it's
   done, something climbs out of it.
   THE DEFROSTER: a fridge that's been on fire for a very long time
   and is still walking. it melts whoever it touches. bullets do
   nothing. freon makes it stop for a second. it is always closer
   than the last time you looked.
============================================================ */
import * as THREE from '../lib/three.module.min.js';
import { makeFridge, animateFridge } from '../world/fridge.js';
import { canvas, tex } from '../world/textures.js';
import { rayOBB } from '../heist/combat.js';
import { los } from '../heist/nav.js';

const R = (a, b)=>a + Math.random()*(b - a);
const pick = a=>a[(Math.random()*a.length)|0];
const ang = (a, b)=>Math.atan2(Math.sin(a - b), Math.cos(a - b));

const fireCavity = (()=>{ const c = canvas(128, 256), g = c.getContext('2d'); const gr = g.createLinearGradient(0, 256, 0, 0); gr.addColorStop(0, '#fff4c0'); gr.addColorStop(0.3, '#ffb030'); gr.addColorStop(0.7, '#d23a08'); gr.addColorStop(1, '#3a0800'); g.fillStyle = gr; g.fillRect(0, 0, 128, 256);
  for(let i=0;i<30;i++){ g.fillStyle = `rgba(255,${(180 + Math.random()*70)|0},80,${R(0.2, 0.6)})`; g.beginPath(); g.ellipse(R(0, 128), R(0, 256), R(4, 18), R(10, 40), 0, 0, 7); g.fill(); }
  return tex(c, { nomip:true }); })();
const charTex = (()=>{ const c = canvas(256, 512), g = c.getContext('2d'); g.fillStyle = '#141010'; g.fillRect(0, 0, 256, 512);
  for(let i=0;i<900;i++){ const v = (Math.random()*40)|0; g.fillStyle = `rgb(${v + 18},${v + 12},${v + 10})`; g.fillRect(R(0, 256), R(0, 512), R(2, 8), R(2, 8)); }
  /* glowing cracks where the fire is still inside */
  g.lineCap = 'round';
  for(let i=0;i<26;i++){ let x = R(0, 256), y = R(0, 512); g.strokeStyle = `rgba(255,${(90 + Math.random()*120)|0},20,0.95)`; g.lineWidth = R(1, 3.5); g.beginPath(); g.moveTo(x, y); for(let k=0;k<7;k++){ x += R(-22, 22); y += R(-30, 30); g.lineTo(x, y); } g.stroke(); }
  return tex(c); })();
const burnFace = (()=>{ const c = canvas(128, 96), g = c.getContext('2d'); g.fillStyle = '#0a0302'; g.fillRect(0, 0, 128, 96);
  const eye = (x)=>{ const gr = g.createRadialGradient(x, 40, 1, x, 40, 14); gr.addColorStop(0, '#fff8d0'); gr.addColorStop(0.4, '#ff9a20'); gr.addColorStop(1, 'rgba(255,40,0,0)'); g.fillStyle = gr; g.beginPath(); g.arc(x, 40, 14, 0, 7); g.fill(); };
  eye(40); eye(88);
  g.strokeStyle = '#ff6a10'; g.lineWidth = 4; g.beginPath(); g.moveTo(40, 74); for(let x=40; x<=88; x+=6) g.lineTo(x, 70 + ((x/6)|0) % 2*8); g.stroke();
  return tex(c, { nomip:true }); })();

/* ---------- the gold fridge ---------- */
export class GoldFridge {
  constructor(C, W){
    this.C = C; this.W = W;
    const F = makeFridge({ style:'french', color:'#e3b04b', metal:1, rough:0.18, handle:'gold', trim:'#8a5a12', acc:['crown'] });
    this.F = F; F.group.visible = false; C.scene.add(F.group);
    const w = F.w, h = F.h || 1.72, d = F.d, fz = d/2 + 0.004;
    /* a cavity of fire behind two french doors that aren't there yet */
    const cav = new THREE.Mesh(new THREE.PlaneGeometry(w - 0.06, h*0.92), new THREE.MeshBasicMaterial({ map:fireCavity, toneMapped:false })); cav.position.set(0, 0.06 + h*0.46, fz + 0.001); cav.visible = false; F.inner.add(cav);
    const goldM = new THREE.MeshStandardMaterial({ color:0xe3b04b, metalness:1, roughness:0.2 });
    const mk = side=>{ const hinge = new THREE.Group(); hinge.position.set(side*(w/2 - 0.01), 0.06 + h*0.46, fz); F.inner.add(hinge); const door = new THREE.Mesh(new THREE.BoxGeometry(w/2 - 0.015, h*0.9, 0.05), goldM); door.position.set(-side*(w/4), 0, 0.026); hinge.add(door); hinge.visible = false; return hinge; };
    this.doorL = mk(-1); this.doorR = mk(1); this.cav = cav;
    this.t = 0; this.state = 'idle'; this.scale = 1.35; this.hp = 1e9;
    this.target = { kind:'gold', get alive(){ return F.group.visible; }, ray:(o, dd, maxT)=>{ if(!F.group.visible) return null; const p = F.group.position, s = F.group.scale.x; const r = rayOBB(o.x, o.y, o.z, dd.x, dd.y, dd.z, p.x, h*s/2, p.z, w*s/2, h*s/2, d*s/2, F.group.rotation.y, maxT); return r ? { t:r.t, n:r.n, part:'gold' } : null; },
      hit:info=>{ C.gore.sparks(info.point, 8, { speed:4 }); C.audio.heist && C.audio.heist.ricochet(info.point); return { hit:false }; }, freeze:()=>{}, center:()=>F.group.position.clone().setY(1.5) };
  }
  /* swap in for the podium prize, at the same size, same spot */
  takeOver(){
    const C = this.C, P = C.world.podium; const F = this.F;
    const wp = P.gold.group.getWorldPosition(new THREE.Vector3());
    F.group.position.copy(wp); F.group.rotation.y = 0; F.group.scale.setScalar(P.gold.group.scale.x); F.group.visible = true;
    P.gold.group.visible = false; this.scale = P.gold.group.scale.x;
    C.combat.add(this.target);
  }
  /* it gets bigger. it shouldn't be able to do that */
  async awaken(){
    const C = this.C, F = this.F, W = this.W;
    this.state = 'awaken';
    C.audio.heist && C.audio.heist.slam(F.group.position);
    for(let i=0;i<5;i++){ W.shake(0.35); C.audio.tone({ f:60 + i*8, f2:30, d:0.5, g:0.25, type:'sawtooth', filt:'lowpass', ff:400 }); C.gore.sparks(F.group.position.clone().setY(R(1, 2.5)), 6, { speed:3 }); await C.tweens.sleep(0.32 - i*0.04); }
    const s0 = this.scale;
    await C.tweens.add({ dur:1.3, ease:t=>t*t*(3 - 2*t), update:k=>{ const s = s0 + (2.6 - s0)*k; F.group.scale.set(s, s*(1 + Math.sin(k*30)*0.02), s); F.inner.rotation.z = Math.sin(k*40)*0.03*(1 - k); } });
    this.scale = 2.6;
    /* the doors go */
    this.cav.visible = true; this.doorL.visible = true; this.doorR.visible = true;
    C.audio.heist && C.audio.heist.explosion(F.group.position.clone().setY(2), 0.9);
    W.shake(1.1);
    C.tweens.add({ dur:0.35, ease:t=>1 - Math.pow(1 - t, 3), update:k=>{ this.doorL.rotation.y = -k*2.2; this.doorR.rotation.y = k*2.2; } });
    const front = F.group.localToWorld(new THREE.Vector3(0, 1.0, F.d/2 + 0.3));
    W.fx.flash(front, 0xffa040, 7, 0.4); C.gore.sparks(front, 60, { speed:9 }); C.gore.smokePuff(front, 14, 0.8);
    this.fire = W.fx.ignite({ obj:F.group, w:F.w*0.35, d:F.d*0.2, y0:0.3, y1:F.h*0.95, rate:55, size:1.6 });
    W.fireOn(F.group, 1);
    this.state = 'awake';
  }
  /* a hop: it squats, leaves the ground, lands hard */
  async hop(x, z, o){
    o = o || {};
    const C = this.C, F = this.F, W = this.W, g = F.group;
    const from = g.position.clone(), to = new THREE.Vector3(x, 0, z), yaw = Math.atan2(x - from.x, z - from.z);
    const y0 = g.rotation.y; let dy = ang(yaw, y0);
    await C.tweens.add({ dur:0.22, update:k=>{ F.inner.scale.y = 1 - k*0.12; g.rotation.y = y0 + dy*k*0.5; } });
    await C.tweens.add({ dur:o.dur || 0.55, ease:t=>t, update:k=>{ g.position.lerpVectors(from, to, k); g.position.y = Math.sin(k*Math.PI)*(o.height || 0.9); F.inner.scale.y = 1 + Math.sin(k*Math.PI)*0.08; g.rotation.y = y0 + dy*(0.5 + k*0.5); } });
    g.position.y = 0; F.inner.scale.y = 0.9;
    W.shake(o.big ? 1.2 : 0.7); C.audio.heist && C.audio.heist.slam(g.position); C.audio.tone({ f:55, f2:25, d:0.6, g:0.35, type:'sine' });
    C.gore.debrisBurst(g.position.clone().setY(0.1), 14, '#7a1a20', new THREE.Vector3(0, 1, 0), 1.2); C.gore.smokePuff(g.position.clone().setY(0.2), 8, 0.6);
    W.fx.flash(g.position.clone().setY(0.5), 0xffa040, 4, 0.2);
    await C.tweens.add({ dur:0.15, update:k=>{ F.inner.scale.y = 0.9 + k*0.1; } });
    if(o.onLand) o.onLand();
  }
  /* a straight charge, sliding, sparks off the floor */
  async charge(x, z, dur, onStep){
    const C = this.C, F = this.F, W = this.W, g = F.group;
    const from = g.position.clone(), to = new THREE.Vector3(x, 0, z);
    g.rotation.y = Math.atan2(x - from.x, z - from.z);
    let acc = 0;
    await C.tweens.add({ dur:dur || 1.0, ease:t=>t*t, update:k=>{ g.position.lerpVectors(from, to, k); F.inner.rotation.x = 0.12*Math.sin(k*20); acc++; if(acc % 2 === 0){ C.gore.sparks(g.position.clone().setY(0.05), 6, { speed:4 }); } if(onStep) onStep(k); W.shake(0.12); } });
    F.inner.rotation.x = 0;
  }
  async topple(dir){
    const C = this.C, F = this.F, W = this.W;
    await C.tweens.add({ dur:0.8, ease:t=>t*t, update:k=>{ F.inner.rotation.x = -k*Math.PI/2*(dir || 1); F.inner.position.y = Math.sin(k*Math.PI/2)*F.d/2; } });
    W.shake(1.3); C.audio.heist && C.audio.heist.slam(F.group.position); C.audio.heist && C.audio.heist.explosion(F.group.position.clone().setY(0.6), 0.6);
    C.gore.debrisBurst(F.group.position.clone().setY(0.4), 30, '#d9a441', new THREE.Vector3(0, 1, 0), 1.5);
  }
  update(dt, t){
    if(!this.F.group.visible) return;
    this.t += dt;
    if(this.state === 'idle') return;
    if(this.cav.visible){ this.cav.material.color.setRGB(0.85 + Math.sin(t*23)*0.15, 0.85 + Math.sin(t*17)*0.15, 0.85); }
  }
}

/* ---------- the defroster ---------- */
export class Defroster {
  constructor(C, W){
    this.C = C; this.W = W;
    const F = makeFridge({ face:true, arms:true, style:'tall', color:'#2a1e1a', trim:'#140c0a', glove:'#1a0c08', eye:'#ff9a20', rough:0.9 });
    this.F = F; F.custom = true;
    /* charred skin with glowing cracks, wrapped around the body */
    const skinM = new THREE.MeshStandardMaterial({ map:charTex, roughness:0.95, emissive:0xff4a10, emissiveMap:charTex, emissiveIntensity:0.9 });
    const skin = new THREE.Mesh(new THREE.BoxGeometry(F.w + 0.012, (F.h || 1.95) + 0.01, F.d + 0.012), skinM); skin.position.y = (F.h || 1.95)/2 + 0.04; F.inner.add(skin); this.skin = skin; this.skinM = skinM;
    if(F.facePlane){ F.facePlane.material = new THREE.MeshBasicMaterial({ map:burnFace, toneMapped:false }); F.facePlane.position.z += 0.01; }
    F.group.visible = false; C.scene.add(F.group);
    this.state = 'off'; this.t = 0; this.speed = 1.35; this.stagger = 0; this.windT = 0; this.unseenT = 0; this.burnCD = 0; this.path = null; this.pi = 0; this.repath = 0;
    this.target = { kind:'defroster', get alive(){ return F.group.visible; }, ray:(o, d, maxT)=>{ if(!F.group.visible) return null; const p = F.group.position; const h = (F.h || 1.95); const r = rayOBB(o.x, o.y, o.z, d.x, d.y, d.z, p.x, h/2, p.z, F.w/2, h/2, F.d/2, F.group.rotation.y, maxT); return r ? { t:r.t, n:r.n, part:'body' } : null; },
      hit:info=>{ C.gore.sparks(info.point, 5, { speed:3, col:'#ff8a20' }); W.fx.fire(info.point, 1); if(Math.random() < 0.3) C.audio.heist && C.audio.heist.hit('metal', info.point); return { hit:false }; },
      freeze:(v)=>this.chill(v), center:()=>F.group.position.clone().setY(1.2) };
  }
  appear(x, z, yaw){
    const C = this.C, F = this.F, W = this.W;
    F.group.position.set(x, 0, z); F.group.rotation.y = yaw || 0; F.group.visible = true;
    if(!this.fire) this.fire = W.fx.ignite({ obj:F.group, w:F.w*0.5, d:F.d*0.5, y0:0.2, y1:(F.h || 1.95)*1.05, rate:46, size:1.2 });
    if(C.combat.targets.indexOf(this.target) < 0) C.combat.add(this.target);
    W.fireOn(F.group, 0.8);
  }
  hide(){ this.F.group.visible = false; this.state = 'off'; if(this.fire){ this.W.fx.douse(this.fire); this.fire = null; } this.C.combat.remove(this.target); }
  chill(v){
    if(this.state === 'off') return;
    this.cold = (this.cold || 0) + v;
    const C = this.C, p = this.F.group.position;
    if(Math.random() < 0.3) C.gore.mistPuff(p.clone().setY(R(0.6, 1.8)), '#e8f4ff', 3, { size:0.5, speed:1.5, grav:-1 });
    if(this.cold > 22 && this.stagger <= 0){
      this.cold = 0; this.stagger = this.W.staggerTime || 2.4; this.windT = 0;
      C.audio.burst({ ff:2600, ff2:500, q:0.7, d:1.2, g:0.35 }); C.audio.tone({ f:180, f2:70, d:0.8, g:0.2, type:'sawtooth', filt:'lowpass', ff:600 });
      this.F.face.say(1);
      if(this.W.onDefrosterStagger) this.W.onDefrosterStagger();
    }
  }
  /* the stalk: walks at you. if you don't look at it for a while, it's closer when you do */
  update(dt, t){
    const C = this.C, W = this.W, F = this.F, g = F.group, p = g.position, cam = C.camera.position;
    if(!g.visible) return;
    this.t += dt;
    /* the skin breathes */
    this.skinM.emissiveIntensity = 0.7 + Math.sin(t*3.3)*0.25 + (this.windT > 0 ? this.windT*1.2 : 0);
    F.face.update(dt, true);
    W.fireAt(g, 0.8 + Math.sin(t*9)*0.15);
    if(this.stagger > 0){
      this.stagger -= dt; F.inner.rotation.x = -0.25*Math.min(1, this.stagger); F.armL.rotation.x = 0.6; F.armR.rotation.x = 0.6;
      if(Math.random() < dt*12) C.gore.mistPuff(p.clone().setY(R(0.5, 1.9)), '#e8f4ff', 2, { size:0.6, speed:1.2, grav:-1.2 });
      return;
    }
    F.inner.rotation.x *= 0.9;
    if(this.state === 'stalk' || this.state === 'hunt'){
      const dx = cam.x - p.x, dz = cam.z - p.z, dist = Math.hypot(dx, dz);
      /* has it been seen? */
      const toIt = new THREE.Vector3(p.x - cam.x, 1.2 - cam.y, p.z - cam.z).normalize(), fwd = C.camera.getWorldDirection(new THREE.Vector3());
      const seen = fwd.dot(toIt) > 0.55 && los(C.collide, cam.x, cam.y, cam.z, p.x, 1.3, p.z);
      if(seen) this.unseenT = 0; else this.unseenT += dt;
      if(this.state === 'stalk' && this.unseenT > (W.blinkAfter || 5) && dist > 9){
        /* it's closer now */
        const N = C.heist.nav, a = Math.atan2(p.x - cam.x, p.z - cam.z) + R(-0.7, 0.7), r = Math.max(6, dist*0.55);
        const c = N.nearest(cam.x + Math.sin(a)*r, cam.z + Math.cos(a)*r, 5);
        if(c){ const [x, z] = N.pos(c[0], c[1]); if(!los(C.collide, cam.x, cam.y, cam.z, x, 1.3, z)){ p.set(x, 0, z); this.path = null; this.unseenT = 0; } }
      }
      this.repath -= dt;
      if(this.repath <= 0){ this.repath = 0.8; const N = C.heist.nav; const pth = N.path(p.x, p.z, cam.x, cam.z); this.path = pth && pth.length ? pth : [[cam.x, cam.z]]; this.pi = 0; }
      let moving = 0;
      if(this.path && this.pi < this.path.length){ const wp = this.path[this.pi], ex = wp[0] - p.x, ez = wp[1] - p.z, dd = Math.hypot(ex, ez); if(dd < 0.2) this.pi++; else { const s = Math.min(dd, this.speed*dt*(W.defrostMul || 1)); p.x += ex/dd*s; p.z += ez/dd*s; moving = this.speed; g.rotation.y += ang(Math.atan2(ex, ez), g.rotation.y)*Math.min(1, dt*3); } }
      animateFridge(F, t*0.6, moving*0.7, {}); F.inner.rotation.z += Math.sin(t*1.3)*0.05;
      F.armBusy = true; F.armL.rotation.x = -1.2 + Math.sin(t*1.7)*0.2; F.armR.rotation.x = -1.3 + Math.sin(t*1.5 + 1)*0.2; F.armL.rotation.z = -0.4; F.armR.rotation.z = 0.4;
      if(dist < 1.5 && W.onDefrosterTouch) W.onDefrosterTouch();
    }
    /* anyone from the crew who gets close cooks */
    this.burnCD -= dt;
    if(this.burnCD <= 0 && W.crew){ this.burnCD = 0.3; for(const e of W.crew.list){ if(!e.alive || e.cooking) continue; const d = e.F.group.position.distanceTo(p); if(d < 2.2){ e.cooking = true; W.cookCrew(e); } } }
  }
}
