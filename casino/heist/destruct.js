/* ============================================================
   FRIDGE PALACE HEIST: the room takes damage too
   slot machines bust open and spit coins, the glass doors shatter,
   CO2 tanks go off, the video walls crack to static, the aquarium
   leaks and then lets go, the lobby chandelier hangs by one chain,
   and the big gold sign keeps the hole you put in it.
============================================================ */
import * as THREE from '../lib/three.module.min.js';
import { rayOBB, rayCyl } from './combat.js';
import { canvas, tex } from '../world/textures.js';

const R = (a, b)=>a + Math.random()*(b - a);
const staticTex = ()=>{ const c = canvas(128, 96), g = c.getContext('2d'); const id = g.createImageData(128, 96); for(let i=0;i<id.data.length;i+=4){ const v = Math.random()*200; id.data[i] = id.data[i+1] = id.data[i+2] = v; id.data[i+3] = 255; } g.putImageData(id, 0, 0); g.strokeStyle = 'rgba(255,255,255,0.8)'; g.lineWidth = 1.5; for(let k=0;k<8;k++){ g.beginPath(); g.moveTo(64, 48); let x = 64, y = 48; for(let s=0;s<5;s++){ x += R(-25, 25); y += R(-20, 20); g.lineTo(x, y); } g.stroke(); } return tex(c, { nomip:true }); };

export class Destruct {
  constructor(C){
    this.C = C; this.items = []; this.slotsBusted = 0; this.logoHit = null; this.tanks = [];
    const W = C.world;
    /* slot machines */
    (C.slots ? C.slots.machines : []).forEach(mc=>{
      const it = { kind:'slot', mc, hp:mc.broken ? 400 : 120, dead:false };
      it.target = this.reg({ kind:'slot', ray:(o, d, maxT)=>{ if(it.gone) return null; const r = rayOBB(o.x, o.y, o.z, d.x, d.y, d.z, mc.a.x, 1.0, mc.a.z, 0.42, 1.0, 0.34, mc.a.ry, maxT); return r ? { t:r.t, n:r.n, part:'slot' } : null; }, hit:info=>this.hitSlot(it, info) });
      this.items.push(it);
    });
    /* the glass front doors */
    const doors = []; C.scene.traverse(o=>{ if(o.isMesh && o.material && o.material.transparent && o.material.opacity === 0.28 && Math.abs(o.position.z - 22) < 0.01) doors.push(o); });
    doors.forEach(m=>{
      const it = { kind:'glass', m, broken:false };
      it.target = this.reg({ kind:'glass', ray:(o, d, maxT)=>{ if(it.broken) return null; const r = rayOBB(o.x, o.y, o.z, d.x, d.y, d.z, m.position.x, 1.65, 22, 0.72, 1.65, 0.03, 0, maxT); return r ? { t:r.t, n:r.n, part:'glass' } : null; }, hit:info=>{ this.breakGlass(it, info.dir); return { hit:false }; } });
      this.items.push(it);
    });
    this.glassDoors = this.items.filter(i=>i.kind === 'glass');
    /* three CO2 tanks, because somebody always leaves CO2 tanks around */
    const tankM = new THREE.MeshStandardMaterial({ color:0xb01818, roughness:0.4, metalness:0.4 });
    const lbl = (()=>{ const c = canvas(64, 128), g = c.getContext('2d'); g.fillStyle = '#b01818'; g.fillRect(0, 0, 64, 128); g.fillStyle = '#fff'; g.fillRect(6, 40, 52, 40); g.fillStyle = '#b01818'; g.font = 'bold 22px monospace'; g.fillText('CO2', 12, 68); return tex(c); })();
    const tankLM = new THREE.MeshStandardMaterial({ map:lbl, roughness:0.4, metalness:0.3 });
    [[-3.6, -4.6], [11.2, 13.2], [-13.2, -13.0], [27.5, -13.0]].forEach(([x, z])=>{
      const g = new THREE.Group(); g.position.set(x, 0, z);
      const body = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 1.0, 14), [tankLM, tankM, tankM]); body.position.y = 0.5; g.add(body);
      const cap = new THREE.Mesh(new THREE.SphereGeometry(0.13, 12, 8, 0, Math.PI*2, 0, Math.PI/2), tankM); cap.position.y = 1.0; g.add(cap);
      const valve = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.12, 8), new THREE.MeshStandardMaterial({ color:0xcccccc, metalness:1, roughness:0.2 })); valve.position.y = 1.15; g.add(valve);
      C.scene.add(g);
      const it = { kind:'tank', g, x, z, hp:30, dead:false, leak:0 };
      it.target = this.reg({ kind:'tank', center:()=>new THREE.Vector3(x, 0.6, z), ray:(o, d, maxT)=>{ if(it.dead) return null; const r = rayCyl(o.x, o.y, o.z, d.x, d.y, d.z, x, z, 0.15, 0, 1.25, maxT); return r ? { t:r.t, n:r.n, part:'tank' } : null; }, hit:info=>this.hitTank(it, info) });
      this.items.push(it); this.tanks.push(it);
    });
    /* video walls */
    (W.screens || []).forEach(s=>{
      if(!s.mesh) return;
      const it = { kind:'screen', s, hp:3, dead:false };
      const m = s.mesh, ry = m.rotation.y, w = m.geometry.parameters.width/2, h = m.geometry.parameters.height/2;
      it.target = this.reg({ kind:'screen', ray:(o, d, maxT)=>{ const r = rayOBB(o.x, o.y, o.z, d.x, d.y, d.z, m.position.x, m.position.y, m.position.z, w, h, 0.06, ry, maxT); return r ? { t:r.t, n:r.n, part:'screen' } : null; }, hit:info=>this.hitScreen(it, info) });
      this.items.push(it);
    });
    /* the big gold sign */
    {
      const it = { kind:'logo' };
      it.target = this.reg({ kind:'logo', ray:(o, d, maxT)=>{ const r = rayOBB(o.x, o.y, o.z, d.x, d.y, d.z, 0, 4.6, 11.6, 3.2, 1.2, 0.04, 0, maxT); return r ? { t:r.t, n:r.n, part:'logo' } : null; }, hit:info=>{ this.logoHit = [+info.point.x.toFixed(2), +info.point.y.toFixed(2)]; C.gore.hole(info.point, new THREE.Vector3(0, 0, info.n[2] >= 0 ? 1 : -1), 0.07); C.gore.sparks(info.point, 5, { speed:3 }); C.audio.heist && C.audio.heist.hit('metal', info.point); C.bus.emit('logohit'); return { hit:false }; } });
    }
    /* the chandelier chain */
    if(W.lobbyChandelier){
      const ch = W.lobbyChandelier;
      this.chandelier = { g:ch, down:false, falling:false, vy:0 };
      const chain = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.9, 6), new THREE.MeshStandardMaterial({ color:0xc9a04a, metalness:1, roughness:0.3 })); chain.position.set(0, 6.05, 15); C.scene.add(chain); this.chandelier.chain = chain;
      this.chandelier.target = this.reg({ kind:'chain', ray:(o, d, maxT)=>{ if(this.chandelier.down || this.chandelier.falling) return null; const r = rayCyl(o.x, o.y, o.z, d.x, d.y, d.z, 0, 15, 0.12, 5.4, 6.5, maxT); return r ? { t:r.t, n:r.n, part:'chain' } : null; }, hit:()=>{ this.dropChandelier(); return { hit:true }; } });
      this.chandelier.target2 = this.reg({ kind:'crystal', ray:(o, d, maxT)=>{ if(this.chandelier.down) return null; const p = ch.position; const r = rayCyl(o.x, o.y, o.z, d.x, d.y, d.z, p.x, p.z, 1.1, p.y - 0.5, p.y + 0.9, maxT); return r ? { t:r.t, n:r.n, part:'crystal' } : null; }, hit:info=>{ C.gore.glassBurst(info.point, 4, info.dir); C.audio.heist && C.audio.heist.hit('glass', info.point); return { hit:false }; } });
    }
    /* the aquarium */
    const A = W.aquarium;
    if(A){
      this.aq = { A, hp:24, leak:0, broken:false };
      this.aq.target = this.reg({ kind:'tank-glass', ray:(o, d, maxT)=>{ if(this.aq.broken) return null; const r = rayCyl(o.x, o.y, o.z, d.x, d.y, d.z, A.cx, A.cz, A.tankR, 0.4, 5.9, maxT); return r ? { t:r.t, n:r.n, part:'aquarium' } : null; }, hit:info=>this.hitAquarium(info) });
    }
  }
  reg(t){ t.alive = true; return this.C.combat.add(t); }
  /* ---------- the slots ---------- */
  hitSlot(it, info){
    const C = this.C, mc = it.mc, n = new THREE.Vector3(info.n[0], info.n[1], info.n[2]);
    C.gore.sparks(info.point, 6, { dir:n, speed:4 }); C.gore.hole(info.point, n, 0.05);
    if(info.pellet === 0 || Math.random() < 0.3) C.audio.heist && C.audio.heist.hit('metal', info.point);
    if(it.dead){ if(Math.random() < 0.25) C.fx.coins(info.point, 3, n); return { hit:false }; }
    it.hp -= info.dmg;
    if(it.hp <= 0){
      it.dead = true; this.slotsBusted++;
      mc.screen.material.map = staticTex(); mc.screen.material.color.setHex(0x888888); mc.screen.material.needsUpdate = true;
      mc.dead = true;
      if(mc.trim) mc.trim.visible = false;
      const front = new THREE.Vector3(Math.sin(mc.a.ry), 0, Math.cos(mc.a.ry));
      const p = new THREE.Vector3(mc.a.x, 0.9, mc.a.z).addScaledVector(front, 0.4);
      C.fx.coins(p, 50, front); C.audio.coins(p, 30); C.audio.heist && C.audio.heist.hit('glass', p);
      C.gore.glassBurst(new THREE.Vector3(mc.a.x, 1.3, mc.a.z).addScaledVector(front, 0.35), 8, front);
      C.gore.sparks(p, 20, { speed:5 }); C.gore.smokePuff(p, 4, 0.2);
      const v = Math.round(R(60, 220)*(mc.th.id === 'defrost' ? 4 : 1));
      if(C.loot){ for(let i=0;i<3;i++) C.loot.drop('chips', p, Math.round(v/3), { pop:true, delay:0.6 }); }
      /* it keeps trying to play its jingle */
      it.glitch = 6;
      C.bus.emit('slotbust', { mc, v });
    }
    return { hit:false };
  }
  breakGlass(it, dir){
    if(it.broken) return;
    const C = this.C; it.broken = true; it.m.visible = false;
    C.gore.glassBurst(new THREE.Vector3(it.m.position.x, 1.6, 22), 28, dir || new THREE.Vector3(0, 0, 1));
    C.audio.heist && C.audio.heist.hit('glass', it.m.position.clone().setY(1.6));
    C.bus.emit('glassbreak');
  }
  breakAllGlass(){ this.glassDoors.forEach(it=>this.breakGlass(it, new THREE.Vector3(0, 0, -1))); }
  hitTank(it, info){
    const C = this.C;
    if(it.dead) return { hit:false };
    it.hp -= info.dmg;
    C.gore.sparks(info.point, 4, { speed:3 }); C.audio.heist && C.audio.heist.hit('metal', info.point);
    if(it.hp > 0){ it.leak = 2.5; C.gore.mistPuff(info.point, '#f0f0f0', 4, { speed:3, size:0.15 }); return { hit:false }; }
    this.explodeTank(it);
    return { hit:true };
  }
  explodeTank(it){
    if(it.dead) return; it.dead = true;
    const C = this.C, p = new THREE.Vector3(it.x, 0.6, it.z);
    C.scene.remove(it.g);
    setTimeout(()=>C.combat.explode(p, 4.2, 140, 'world'), 0);
    C.bus.emit('tankboom', { pos:p });
  }
  hitScreen(it, info){
    const C = this.C, s = it.s;
    C.gore.sparks(info.point, 6, { speed:3 }); C.gore.glassBurst(info.point, 3, info.dir); C.audio.heist && C.audio.heist.hit('glass', info.point);
    if(it.dead) return { hit:false };
    if(--it.hp <= 0){ it.dead = true; s.mesh.material.map = staticTex(); s.mesh.material.needsUpdate = true; s.update = ()=>{}; s.dead = true; }
    return { hit:false };
  }
  hitAquarium(info){
    const C = this.C, aq = this.aq, A = aq.A, n = new THREE.Vector3(info.n[0], info.n[1], info.n[2]);
    C.gore.hole(info.point, n, 0.08); C.audio.heist && C.audio.heist.hit('glass', info.point);
    C.gore.mistPuff(info.point, '#4ac8ff', 3, { dir:n, speed:2, size:0.1 });
    aq.hp -= info.pellets > 1 ? 0.4 : 1; aq.leak = Math.min(8, aq.leak + 1);
    (aq.leaks = aq.leaks || []).push({ p:info.point.clone(), n });
    if(aq.hp <= 0) this.breakAquarium();
    return { hit:false };
  }
  breakAquarium(){
    const C = this.C, aq = this.aq, A = aq.A; if(aq.broken) return; aq.broken = true; A.broken = true;
    A.glassC.visible = false; A.water.visible = false; A.bubbles.visible = false; A.tankLight.intensity = 2;
    const c = new THREE.Vector3(A.cx, 1.5, A.cz);
    for(let i=0;i<6;i++) C.gore.blobBurst(new THREE.Vector3(A.cx, 1 + i*0.8, A.cz), 12, '#3aa8e0', 2.2, false);
    C.gore.mistPuff(c, '#7fd8ff', 30, { size:0.6, speed:4, life:1.8 });
    C.gore.glassBurst(c, 40);
    for(let i=0;i<8;i++){ const a = i/8*Math.PI*2; C.gore.puddleAt(A.cx + Math.cos(a)*R(1, 2.2), A.cz + Math.sin(a)*R(1, 2.2), '#2a6a9a', R(0.6, 1.1)); }
    C.audio.heist && C.audio.heist.hit('glass', c); C.audio.heist && C.audio.heist.explosion(c, 0.3);
    C.audio.burst({ ff:600, type:'lowpass', a:0.05, d:2.2, g:0.6, dest:C.audio.out(c, 0.6) });
    /* the fish land on the floor and flop */
    A.fish.forEach(f=>{ f.out = true; f.vy = R(1, 3); f.vx = R(-2, 2); f.vz = R(-2, 2); f.flop = 0; });
    this.flopping = A.fish;
    C.bus.emit('aquarium');
  }
  dropChandelier(){
    const ch = this.chandelier; if(!ch || ch.falling || ch.down) return;
    ch.falling = true; ch.vy = 0;
    this.C.scene.remove(ch.chain);
    this.C.audio.heist && this.C.audio.heist.hit('metal', new THREE.Vector3(0, 6, 15));
    this.C.bus.emit('chandelier', { stage:'fall' });
  }
  update(dt, t){
    const C = this.C;
    for(const it of this.items){
      if(it.kind === 'slot' && it.glitch > 0){ it.glitch -= dt; if(Math.random() < dt*0.8) C.audio.slotWin && C.audio.slotWin(new THREE.Vector3(it.mc.a.x, 1.3, it.mc.a.z), 0); if(Math.random() < dt*3) C.gore.sparks(new THREE.Vector3(it.mc.a.x, 1.3, it.mc.a.z), 3, { speed:2 }); }
      if(it.kind === 'tank' && !it.dead && it.leak > 0){ it.leak -= dt; if(Math.random() < dt*20) C.gore.mistPuff(new THREE.Vector3(it.x, 0.9, it.z), '#f0f0f0', 1, { speed:2, size:0.1 }); if(it.leak <= 0 && it.hp < 15) this.explodeTank(it); }
    }
    if(this.aq && !this.aq.broken && this.aq.leaks){ for(const l of this.aq.leaks){ if(Math.random() < dt*4) C.gore.blobBurst(l.p, 1, '#3aa8e0', 0.5, Math.random() < 0.3); } }
    if(this.flopping){ for(const f of this.flopping){ if(f.landed){ f.flop += dt; if(f.flop < 20){ f.mesh.position.y = 0.05 + Math.abs(Math.sin(f.flop*9 + f.bob))*0.08*Math.max(0, 1 - f.flop/20); f.mesh.rotation.z = Math.sin(f.flop*11)*0.6; } continue; } f.vy -= 9.8*dt; f.mesh.position.x += f.vx*dt; f.mesh.position.y += f.vy*dt; f.mesh.position.z += f.vz*dt; if(f.mesh.position.y < 0.06){ f.landed = true; f.mesh.rotation.x = -Math.PI/2; } } }
    const ch = this.chandelier;
    if(ch && ch.falling){
      ch.vy -= 9.8*dt; ch.g.position.y += ch.vy*dt;
      if(ch.g.position.y < 0.55){
        ch.g.position.y = 0.55; ch.falling = false; ch.down = true;
        ch.g.rotation.z = 0.12; ch.g.rotation.x = -0.08;
        const p = new THREE.Vector3(0, 0.6, 15);
        C.gore.glassBurst(p, 50); C.gore.glassBurst(p.clone().setY(1), 30);
        C.gore.mistPuff(p, '#e8e0d0', 18, { size:0.5, speed:3 });
        C.audio.heist && C.audio.heist.hit('glass', p); C.audio.heist && C.audio.heist.explosion(p, 0.5);
        C.player.addShake(Math.max(0, 1.2 - C.camera.position.distanceTo(p)*0.08));
        C.collide.circle(0, 15, 1.0, 'debris');
        /* guests and staff caught under it (the heist handles enemies, clement and you) */
        for(const tg of C.combat.targets.slice()){ if(tg.alive === false || !tg.center || (tg.kind !== 'civ' && tg.kind !== 'staff')) continue; const c = tg.center(); if(Math.hypot(c.x, c.z - 15) < 1.5) tg.hit({ dmg:260, point:c, n:[0, 1, 0], dir:new THREE.Vector3(0, -1, 0), weapon:'chandelier', knock:3, src:'world', explosion:true, dist:0 }); }
        C.bus.emit('chandelier', { stage:'land', pos:p });
      }
    }
  }
}
