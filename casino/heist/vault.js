/* ============================================================
   FRIDGE PALACE HEIST: the vault
   the cage gate and the charge that takes it off its hinges, the
   thermal drill on the vault door (it jams; kick it), the room
   behind the door (cash bricks, gold, deposit boxes, gus's crate),
   the slam, the hinges you freeze and shoot, the door coming down.
============================================================ */
import * as THREE from '../lib/three.module.min.js';
import { G } from '../world/props.js';
import { canvas, tex } from '../world/textures.js';
import { rayOBB } from './combat.js';
import { mergeGeometries } from '../lib/addons/utils/BufferGeometryUtils.js';
/* one draw call per pile instead of one per bar */
function merged(geo, list, mat){ const gs = list.map(([x, y, z, ry])=>{ const g = geo.clone(); if(ry) g.rotateY(ry); g.translate(x, y, z); return g; }); const m = new THREE.Mesh(mergeGeometries(gs, false), mat); gs.forEach(g=>g.dispose()); return m; }

const R = (a, b)=>a + Math.random()*(b - a);
const sm = t=>t <= 0 ? 0 : t >= 1 ? 1 : t*t*(3 - 2*t);

export class Vault {
  constructor(C){
    this.C = C;
    const K = C.world.cage, M = C.M;
    this.K = K;
    this.state = 'closed'; // closed | drilling | open | slammed | fallen
    this.drill = null; this.progress = 0; this.jammed = false;
    this.piles = []; this.hinges = [];
    this.build();
  }
  build(){
    const C = this.C, M = C.M, S = C.scene, K = this.K;
    const steelM = new THREE.MeshStandardMaterial({ color:0x8a8e94, roughness:0.4, metalness:0.85 });
    const darkM = new THREE.MeshStandardMaterial({ color:0x2a2c30, roughness:0.5, metalness:0.7 });
    const floorTex = (()=>{ const c = canvas(256, 256), g = c.getContext('2d'); g.fillStyle = '#5a5e64'; g.fillRect(0, 0, 256, 256); for(let i=0;i<8;i++) for(let j=0;j<8;j++){ g.fillStyle = (i + j) % 2 ? '#62666c' : '#55595f'; g.fillRect(i*32 + 1, j*32 + 1, 30, 30); for(let k=0;k<6;k++){ g.fillStyle = 'rgba(255,255,255,0.08)'; g.fillRect(i*32 + 4 + k*4, j*32 + 4 + (k%2)*12, 2, 8); } } return tex(c, { repeat:[3, 3] }); })();
    /* nobody sees in here until the door moves, so it doesn't draw until then */
    const room = new THREE.Group(); room.visible = false; S.add(room); this.room = room;
    const x0 = 30.15, x1 = 37, z0 = 14.5, z1 = 20.5, h = 3.2;
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(x1 - x0, z1 - z0), new THREE.MeshStandardMaterial({ map:floorTex, roughness:0.5, metalness:0.6 })); floor.rotation.x = -Math.PI/2; floor.position.set((x0 + x1)/2, 0.005, (z0 + z1)/2); room.add(floor);
    const ceil = new THREE.Mesh(new THREE.PlaneGeometry(x1 - x0, z1 - z0), darkM); ceil.rotation.x = Math.PI/2; ceil.position.set((x0 + x1)/2, h, (z0 + z1)/2); room.add(ceil);
    const wall = (cx, cz, w, d)=>{ const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), steelM); m.position.set(cx, h/2, cz); room.add(m); };
    wall((x0 + x1)/2, z0 - 0.1, x1 - x0, 0.2); wall((x0 + x1)/2, z1 + 0.1, x1 - x0, 0.2); wall(x1 + 0.1, (z0 + z1)/2, 0.2, z1 - z0);
    C.collide.box(x0, z0 - 0.3, x1, z0, 'vault'); C.collide.box(x0, z1, x1, z1 + 0.3, 'vault'); C.collide.box(x1, z0, x1 + 0.3, z1, 'vault');
    /* light strips (emissive, no real lights) */
    this.stripM = new THREE.MeshBasicMaterial({ color:0x202428, toneMapped:false });
    [15.2, 19.8].forEach(z=>{ const s = new THREE.Mesh(new THREE.BoxGeometry(5.6, 0.04, 0.12), this.stripM); s.position.set(33.6, h - 0.04, z); room.add(s); });
    this.redM = new THREE.MeshBasicMaterial({ color:0x200000, toneMapped:false });
    const red = new THREE.Mesh(new THREE.SphereGeometry(0.08, 10, 8), this.redM); red.position.set(36.85, 2.7, 17.5); room.add(red);
    /* deposit boxes on the east wall */
    const dbTex = (()=>{ const c = canvas(256, 256), g = c.getContext('2d'); g.fillStyle = '#7a6a4a'; g.fillRect(0, 0, 256, 256); for(let i=0;i<8;i++) for(let j=0;j<8;j++){ g.fillStyle = '#9a8a62'; g.fillRect(i*32 + 2, j*32 + 2, 28, 28); g.fillStyle = '#3a3020'; g.fillRect(i*32 + 13, j*32 + 13, 6, 6); g.fillStyle = '#cbb880'; g.font = '8px monospace'; g.fillText(String(100 + i + j*8), i*32 + 5, j*32 + 10); } return tex(c); })();
    const db = new THREE.Mesh(new THREE.PlaneGeometry(4.6, 2.4), new THREE.MeshStandardMaterial({ map:dbTex, roughness:0.35, metalness:0.7 })); db.position.set(x1 - 0.01, 1.4, 17.5); db.rotation.y = -Math.PI/2; room.add(db);
    /* shelves with loot along north and south walls */
    const shelf = (z, face)=>{ for(let i=0;i<3;i++){ const s = new THREE.Mesh(new THREE.BoxGeometry(5, 0.05, 0.6), steelM); s.position.set(33.4, 0.5 + i*0.85, z); room.add(s); } [31.0, 35.8].forEach(x=>{ const p = new THREE.Mesh(new THREE.BoxGeometry(0.06, 2.3, 0.6), steelM); p.position.set(x, 1.15, z); room.add(p); }); C.collide.box(30.9, z - 0.32, 35.9, z + 0.32, 'shelf'); };
    shelf(14.9, 1); shelf(20.1, -1);
    const goldM = new THREE.MeshStandardMaterial({ color:0xf0c040, roughness:0.28, metalness:0.7, emissive:0x5a3a00, emissiveIntensity:0.45 });
    const cashTex = (()=>{ const c = canvas(64, 32), g = c.getContext('2d'); g.fillStyle = '#4a7a4a'; g.fillRect(0, 0, 64, 32); g.fillStyle = '#e8e0c0'; g.fillRect(26, 0, 12, 32); g.fillStyle = '#2a4a2a'; g.font = 'bold 14px monospace'; g.fillText('F', 6, 21); g.fillText('F', 46, 21); return tex(c); })();
    const cashM = new THREE.MeshStandardMaterial({ map:cashTex, roughness:0.8 });
    const goldG = new THREE.BoxGeometry(0.22, 0.07, 0.1), cashG = new THREE.BoxGeometry(0.16, 0.05, 0.08), boxG = new THREE.BoxGeometry(0.3, 0.12, 0.25);
    const boxM = new THREE.MeshStandardMaterial({ color:0x8a7a52, roughness:0.4, metalness:0.7 });
    const pile = (kind, x, z, shelfY, value, weight, label)=>{
      const g = new THREE.Group(); g.position.set(x, shelfY + 0.03, z); room.add(g);
      if(kind === 'gold'){ const L = []; for(let r=0;r<3;r++) for(let i=0;i<5 - r;i++) for(let j=0;j<2;j++) L.push([-0.45 + i*0.23 + r*0.11, 0.035 + r*0.07, -0.08 + j*0.13]); g.add(merged(goldG, L, goldM)); }
      else if(kind === 'cash'){ const L = []; for(let r=0;r<4;r++) for(let i=0;i<5;i++) for(let j=0;j<3;j++) L.push([-0.36 + i*0.17, 0.025 + r*0.05, -0.12 + j*0.09]); g.add(merged(cashG, L, cashM)); }
      else { const L = []; for(let i=0;i<4;i++) L.push([-0.4 + i*0.28, 0.06 + (i%2)*0.12, 0, R(-0.3, 0.3)]); g.add(merged(boxG, L, boxM)); }
      const p = { kind, g, value, weight, label, taken:false, pos:new THREE.Vector3(x, shelfY + 0.3, z) };
      this.piles.push(p);
      C.world.interact.push({ heist:true, pos:p.pos, r:2.0, enabled:()=>!p.taken && this.state === 'open' && C.heist && C.heist.canLootVault(), text:()=>'grab the ' + label, use:()=>this.take(p) });
      return p;
    };
    pile('cash', 32.2, 14.95, 0.5, 4200, 1, 'cash bricks'); pile('cash', 34.6, 14.95, 1.35, 4200, 1, 'cash bricks');
    pile('gold', 33.4, 20.05, 0.5, 7500, 2, 'gold bars'); pile('gold', 32.2, 20.05, 1.35, 7500, 2, 'gold bars');
    pile('cash', 34.6, 20.05, 2.2, 4200, 1, 'cash bricks'); pile('boxes', 36.3, 17.5, 0.0, 3000, 1, 'deposit boxes');
    /* a steel table in the middle with a cart of gold */
    const tbl = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.06, 0.8), steelM); tbl.position.set(33.6, 0.85, 17.5); room.add(tbl);
    [[-0.65, -0.35], [0.65, -0.35], [-0.65, 0.35], [0.65, 0.35]].forEach(([dx, dz])=>{ const l = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.85, 0.05), steelM); l.position.set(33.6 + dx, 0.42, 17.5 + dz); room.add(l); });
    C.collide.box(32.85, 17.05, 34.35, 17.95, 'table');
    pile('gold', 33.6, 17.5, 0.88, 9000, 2, 'gold on the table');
    /* gus's crate */
    const crateTex = (()=>{ const c = canvas(256, 160), g = c.getContext('2d'); g.fillStyle = '#8a6a3a'; g.fillRect(0, 0, 256, 160); g.strokeStyle = '#5a4020'; g.lineWidth = 6; for(let i=0;i<5;i++){ g.beginPath(); g.moveTo(0, i*40); g.lineTo(256, i*40); g.stroke(); } g.fillStyle = '#b00'; g.font = 'bold 26px monospace'; g.fillText('PROPERTY OF GUS', 10, 60); g.fillStyle = '#111'; g.font = 'bold 30px monospace'; g.fillText('DON\'T.', 70, 110); return tex(c); })();
    const crate = new THREE.Group(); crate.position.set(36.2, 0, 15.6); room.add(crate);
    const cb = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.6, 0.6), [new THREE.MeshStandardMaterial({ map:crateTex, roughness:0.9 }), new THREE.MeshStandardMaterial({ map:crateTex, roughness:0.9 }), new THREE.MeshStandardMaterial({ color:0x8a6a3a, roughness:0.9 }), new THREE.MeshStandardMaterial({ color:0x8a6a3a, roughness:0.9 }), new THREE.MeshStandardMaterial({ map:crateTex, roughness:0.9 }), new THREE.MeshStandardMaterial({ map:crateTex, roughness:0.9 })]); cb.position.y = 0.3; crate.add(cb);
    const lid = new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.05, 0.62), new THREE.MeshStandardMaterial({ color:0x7a5a2a, roughness:0.9 })); lid.position.y = 0.625; crate.add(lid);
    this.crate = { g:crate, lid, opened:false };
    C.collide.box(35.75, 15.3, 36.65, 15.9, 'crate');
    C.world.interact.push({ heist:true, pos:new THREE.Vector3(36.2, 0.8, 15.6), r:2.0, enabled:()=>!this.crate.opened && (this.state === 'slammed' || (C.heist && C.heist.allowCrate)), text:()=>'open gus\'s crate', use:()=>this.openCrate() });
    /* hinge targets on the inside of the vault door */
    const hingeM = new THREE.MeshStandardMaterial({ color:0x6a6e74, roughness:0.3, metalness:1, emissive:0x000000 });
    [0.78, 1.88].forEach((y, i)=>{
      /* the hinge pin sticks out into the vault, past the door's collision box, so bullets and gas can reach it */
      const m = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.62, 12), hingeM.clone()); m.position.set(30.02, y, K.VZ - K.VR + 0.28); m.rotation.z = Math.PI/2; room.add(m);
      const plate = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.42, 0.3), hingeM); plate.position.set(30.31, y, K.VZ - K.VR + 0.28); room.add(plate);
      const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.06, 12), new THREE.MeshStandardMaterial({ color:0xc9a04a, metalness:1, roughness:0.3 })); cap.rotation.z = Math.PI/2; cap.position.set(30.35, y, K.VZ - K.VR + 0.28); room.add(cap); m.userData.parts = [plate, cap];
      const ice = new THREE.Mesh(new THREE.SphereGeometry(0.2, 10, 8), C.enemies ? C.enemies.iceM : new THREE.MeshStandardMaterial({ color:0xbfeeff, transparent:true, opacity:0.6 })); ice.visible = false; ice.position.set(30.3, y, K.VZ - K.VR + 0.28); room.add(ice);
      const hg = { m, ice, frost:0, frozen:false, broken:false, i };
      this.hinges.push(hg);
      hg.target = C.combat.add({ kind:'hinge', get alive(){ return !hg.broken; }, center:()=>new THREE.Vector3(30.36, m.position.y, m.position.z),
        ray:(o, d, maxT)=>{ if(hg.broken || this.state !== 'slammed') return null; const r = rayOBB(o.x, o.y, o.z, d.x, d.y, d.z, 30.25, m.position.y, m.position.z, 0.16, 0.24, 0.2, 0, maxT); return r ? { t:r.t, n:r.n, part:'hinge' } : null; },
        hit:info=>{ if(this.state !== 'slammed') return { hit:false }; if(hg.frozen){ this.breakHinge(hg); return { hit:true, kill:true }; } C.gore.sparks(info.point, 6, { speed:3 }); C.audio.heist && C.audio.heist.hit('metal', info.point); C.audio.heist && C.audio.heist.ricochet(info.point); C.bus.emit('hingeping'); return { hit:false }; },
        freeze:(v)=>{ if(this.state !== 'slammed' || hg.frozen) return; hg.frost += v; hg.m.material.emissive.setRGB(0, hg.frost/60*0.4, hg.frost/60*0.6); if(hg.frost >= 60){ hg.frozen = true; hg.ice.visible = true; C.audio.heist && C.audio.heist.hit('ice', m.position); C.bus.emit('hingefrozen', { i }); } } });
    });
  }
  /* ---------- the gate ---------- */
  async breach(){
    const C = this.C, K = this.K;
    const charge = new THREE.Group();
    const brick = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.18, 0.08), new THREE.MeshStandardMaterial({ color:0xc8b890, roughness:0.8 })); charge.add(brick);
    const led = new THREE.Mesh(new THREE.SphereGeometry(0.02, 8, 6), new THREE.MeshBasicMaterial({ color:0xff2020, toneMapped:false })); led.position.set(0.1, 0.05, 0.05); charge.add(led);
    const wire = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.006, 4, 12), new THREE.MeshBasicMaterial({ color:0xffd000 })); wire.position.set(-0.05, 0, 0.05); charge.add(wire);
    charge.position.set((K.GX0 + K.GX1)/2 + 0.3, 1.1, K.z0 - 0.12); C.scene.add(charge);
    for(let i=0;i<6;i++){ led.visible = !led.visible; C.audio.beep(true); await C.tweens.sleep(0.42 - i*0.05); }
    C.scene.remove(charge);
    const p = new THREE.Vector3((K.GX0 + K.GX1)/2, 1.2, K.z0 - 0.1);
    C.combat.explode(p, 4.5, 90, 'world');
    /* the gate goes flying into the cage */
    const gate = K.gate, g = new THREE.Group(); g.position.copy(gate.position); C.scene.add(g); gate.children.slice().forEach(ch=>g.add(ch)); C.scene.remove(gate);
    this.flying = { g, vx:R(-1, 1), vy:3.5, vz:5.5, wx:R(-4, 4), wy:R(-3, 3), wz:R(-4, 4) };
    K.cols.gate.on = false; K.cols.inside.on = false;
    C.collide.dirty = true;
    C.bus.emit('breached');
  }
  /* ---------- the drill ---------- */
  startDrill(duration){
    const C = this.C, K = this.K;
    const rig = new THREE.Group(); rig.position.set(29.0, K.VY, K.VZ); C.scene.add(rig);
    const yel = new THREE.MeshStandardMaterial({ color:0xe0b020, roughness:0.5, metalness:0.3 }), blk = new THREE.MeshStandardMaterial({ color:0x18191b, roughness:0.6 });
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.32, 0.36), yel); body.position.x = -0.3; rig.add(body);
    const motor = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.3, 14), blk); motor.rotation.z = Math.PI/2; motor.position.x = -0.62; rig.add(motor);
    const bit = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.01, 0.42, 8), new THREE.MeshStandardMaterial({ color:0xcccccc, metalness:1, roughness:0.2 })); bit.rotation.z = Math.PI/2; bit.position.x = 0.12; rig.add(bit);
    [[-1, -1], [-1, 1], [1, 0]].forEach(([a, b])=>{ const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.5, 6), blk); leg.position.set(-0.4 + a*0.15, -0.65, b*0.35); leg.rotation.x = b*0.35; leg.rotation.z = a*0.2; rig.add(leg); });
    const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.03, 8, 6), new THREE.MeshBasicMaterial({ color:0x20ff40, toneMapped:false })); lamp.position.set(-0.3, 0.18, 0.1); rig.add(lamp);
    const scr = canvas(128, 48), sg = scr.getContext('2d'); const st = tex(scr, { nomip:true });
    const disp = new THREE.Mesh(new THREE.PlaneGeometry(0.28, 0.1), new THREE.MeshBasicMaterial({ map:st, toneMapped:false })); disp.position.set(-0.3, 0.05, 0.185); rig.add(disp);
    const disp2 = disp.clone(); disp2.position.z = -0.185; disp2.rotation.y = Math.PI; rig.add(disp2);
    this.drill = { rig, bit, lamp, sg, st, duration, jamAt:[0.34 + R(-0.04, 0.04), 0.71 + R(-0.04, 0.04)], jams:0 };
    this.progress = 0; this.jammed = false; this.state = 'drilling';
    C.collide.box(28.2, K.VZ - 0.5, 29.2, K.VZ + 0.5, 'crate');
    C.audio.heist && C.audio.heist.drill(true, rig.position);
    C.world.interact.push({ heist:true, pos:new THREE.Vector3(28.8, 1.3, K.VZ), r:2.4, enabled:()=>this.jammed, text:()=>'kick the drill', use:()=>this.unjam() });
  }
  unjam(){ if(!this.jammed) return; this.jammed = false; this.drill.lamp.material.color.setHex(0x20ff40); this.C.audio.heist && this.C.audio.heist.drillResume(); this.C.audio.heist && this.C.audio.heist.hit('metal', this.drill.rig.position); this.C.player.addShake(0.2); this.C.bus.emit('drill', { k:'unjam' }); }
  drawDrill(){ const D = this.drill, g = D.sg; g.fillStyle = '#031'; g.fillRect(0, 0, 128, 48); g.fillStyle = this.jammed ? '#f33' : '#3f6'; g.font = 'bold 22px monospace'; g.fillText(this.jammed ? 'JAMMED' : Math.floor(this.progress*100) + '%', 8, 30); g.fillStyle = '#3f6'; g.fillRect(8, 38, 112*this.progress, 5); D.st.needsUpdate = true; }
  updateDrill(dt){
    const D = this.drill, C = this.C; if(!D || this.state !== 'drilling') return;
    if(!this.jammed){
      this.progress = Math.min(1, this.progress + dt/D.duration);
      D.bit.rotation.x += dt*60;
      if(Math.random() < dt*20) C.gore.sparks(D.rig.position.clone().add(new THREE.Vector3(0.36, 0, 0)), 2, { speed:3, dir:new THREE.Vector3(-1, 0.3, 0) });
      if(D.jams < D.jamAt.length && this.progress >= D.jamAt[D.jams]){ D.jams++; this.jammed = true; D.lamp.material.color.setHex(0xff2020); C.audio.heist && C.audio.heist.drillJam(D.rig.position); C.gore.smokePuff(D.rig.position, 6, 0.15); C.bus.emit('drill', { k:'jam' }); }
    } else if(Math.random() < dt*3) C.gore.smokePuff(D.rig.position.clone().add(new THREE.Vector3(-0.3, 0.2, 0)), 1, 0.1);
    D.t = (D.t || 0) + dt; if(D.t > 0.2){ D.t = 0; this.drawDrill(); }
    if(this.progress >= 1){ this.finishDrill(); }
  }
  finishDrill(){
    const C = this.C, K = this.K;
    this.state = 'opening';
    C.audio.heist && C.audio.heist.drill(false);
    C.scene.remove(this.drill.rig);
    C.collide.boxes.filter(b=>b.tag === 'crate' && b.minX === 28.2).forEach(b=>b.on = false);
    this.openDoor();
  }
  async openDoor(){
    const C = this.C, K = this.K, v = K.vault;
    this.room.visible = true;
    C.audio.heist && C.audio.heist.vaultDoor(v.position.clone().setY(1.3), true);
    /* the wheel spins, then the door swings */
    await C.tweens.add({ dur:1.2, update:k=>{ v.userData.wheel.rotation.x = k*Math.PI*2; } });
    await C.tweens.add({ dur:2.4, update:k=>{ v.rotation.y = -1.75*k; } });
    K.cols.vaultDoor.on = false;
    this.swungCol = C.collide.box(26.9, 15.55, 29.5, 16.55, 'vaultdoor');
    this.lights(true);
    this.state = 'open';
    C.collide.dirty = true;
    C.bus.emit('vaultopen');
  }
  lights(on, red){ this.stripM.color.setHex(on ? 0xe8f4ff : 0x202428); this.redM.color.setHex(red ? 0xff2020 : 0x200000); }
  take(p){
    const C = this.C; if(p.taken) return;
    p.taken = true; C.audio.chipStack(p.pos); C.audio.heist && C.audio.heist.slide(0, false);
    C.tweens.add({ dur:0.4, update:k=>{ p.g.scale.setScalar(1 - k*0.95); p.g.position.y += 0.01; }, done:()=>{ p.g.visible = false; } });
    let extra = '';
    if(p.kind === 'boxes'){ const items = ['a single diamond in a sandwich bag', 'a jar of the vendor\'s sauce', 'the deed to a fridge showroom', 'forty years of losing lottery tickets', 'a gold-plated ice cube tray']; try{ if(window.VENDOR && VENDOR.sawAny(['wall:hank', 'tag:26'])) items.push('hank\'s employee badge'); }catch(e){} extra = items[(Math.random()*items.length)|0]; }
    C.heist.addLoot(p.value, 'vault', p.weight);
    C.hud.toast('+' + p.value.toLocaleString() + ' · ' + p.label + (extra ? ' (and ' + extra + ')' : ''), 'gold');
    C.bus.emit('vaultloot', { p, extra });
  }
  takenCount(){ return this.piles.filter(p=>p.taken).length; }
  async slam(){
    const C = this.C, K = this.K, v = K.vault;
    this.state = 'slamming';
    if(this.swungCol) this.swungCol.on = false;
    await C.tweens.add({ dur:0.7, ease:k=>k*k, update:k=>{ v.rotation.y = -1.75*(1 - k); } });
    K.cols.vaultDoor.on = true;
    C.audio.heist && C.audio.heist.slam(v.position.clone().setY(1.3));
    C.player.addShake(1.0);
    this.lights(false, true);
    this.state = 'slammed';
    C.collide.dirty = true;
  }
  openCrate(){
    const C = this.C; if(this.crate.opened) return;
    this.crate.opened = true;
    C.tweens.add({ dur:0.6, update:k=>{ this.crate.lid.position.set(0, 0.625 + k*0.3, -k*0.35); this.crate.lid.rotation.x = -k*1.3; } });
    C.audio.door(new THREE.Vector3(36.2, 0.6, 15.6));
    C.gore.mistPuff(new THREE.Vector3(36.2, 0.7, 15.6), '#d8f6ff', 14, { size:0.3, speed:1.2, life:2 });
    C.bus.emit('crate');
  }
  breakHinge(hg){
    const C = this.C; if(hg.broken) return;
    hg.broken = true; hg.m.visible = false; hg.ice.visible = false; (hg.m.userData.parts || []).forEach(p=>p.visible = false);
    C.gore.iceBurst(hg.m.position.clone().setY(hg.m.position.y - 0.6), 10);
    C.gore.sparks(hg.m.position, 12, { speed:5 });
    C.audio.heist && C.audio.heist.hit('ice', hg.m.position); C.audio.heist && C.audio.heist.hit('metal', hg.m.position);
    C.bus.emit('hingebroken', { i:hg.i, left:this.hinges.filter(h=>!h.broken).length });
    if(this.hinges.every(h=>h.broken)) this.fallDoor();
  }
  async fallDoor(){
    const C = this.C, K = this.K, v = K.vault;
    this.state = 'falling';
    await C.tweens.sleep(0.5);
    const pivot = new THREE.Group(); pivot.position.set(29.35, 0, K.VZ); C.scene.add(pivot); pivot.attach(v);
    C.audio.heist && C.audio.heist.vaultDoor(pivot.position.clone().setY(1), false);
    await C.tweens.add({ dur:0.9, ease:k=>k*k*k, update:k=>{ pivot.rotation.z = k*Math.PI/2*0.97; } });
    C.audio.heist && C.audio.heist.slam(pivot.position.clone().setY(0.3)); C.audio.heist && C.audio.heist.explosion(pivot.position, 0.6);
    C.player.addShake(1.3);
    C.gore.mistPuff(new THREE.Vector3(28.0, 0.3, K.VZ), '#cfcac0', 26, { size:0.6, speed:3, life:2 });
    C.gore.debrisBurst(new THREE.Vector3(28, 0.2, K.VZ), 20, '#888', new THREE.Vector3(0, 1, 0));
    K.cols.vaultDoor.on = false;
    this.state = 'fallen'; this.lights(true, false);
    C.collide.dirty = true;
    C.bus.emit('doorfell');
  }
  update(dt, t){
    const C = this.C;
    this.updateDrill(dt);
    if(this.flying){ const f = this.flying; f.vy -= 9.8*dt; f.g.position.x += f.vx*dt; f.g.position.y += f.vy*dt; f.g.position.z += f.vz*dt; f.g.rotation.x += f.wx*dt; f.g.rotation.y += f.wy*dt; f.g.rotation.z += f.wz*dt; if(f.g.position.y < 0.05 && f.vy < 0){ if(f.vy < -2.5){ f.vy *= -0.3; f.vx *= 0.5; f.vz *= 0.5; C.audio.heist && C.audio.heist.hit('metal', f.g.position.clone()); } else { f.g.position.y = 0.05; f.g.rotation.set(-Math.PI/2, f.g.rotation.y, 0); this.flying = null; } } }
    if(this.state === 'slammed'){ this.redM.color.setHex(Math.floor(t*2) % 2 ? 0xff2020 : 0x400000); }
  }
}
