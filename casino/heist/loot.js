/* ============================================================
   FRIDGE PALACE HEIST: things on the floor worth picking up
   ammo, cold packs, chip stacks, gold bars, cash bricks. they
   bob, they glow a little, you walk over them.
============================================================ */
import * as THREE from '../lib/three.module.min.js';
import { canvas, tex } from '../world/textures.js';

const label = (txt, col)=>{ const c = canvas(128, 64), g = c.getContext('2d'); g.fillStyle = col; g.fillRect(0, 0, 128, 64); g.fillStyle = '#fff'; g.font = 'bold 26px monospace'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(txt, 64, 34); return tex(c); };
const MATS = {
  ammo: new THREE.MeshStandardMaterial({ map:label('AMMO', '#3a4a2a'), roughness:0.6 }),
  health: new THREE.MeshStandardMaterial({ map:label('COLD', '#1a6ad0'), roughness:0.4, emissive:0x0a2a5a, emissiveIntensity:0.5 }),
  chips: new THREE.MeshStandardMaterial({ color:0xd02a2a, roughness:0.35, metalness:0.1 }),
  chipEdge: new THREE.MeshStandardMaterial({ color:0xffffff, roughness:0.35 }),
  gold: new THREE.MeshStandardMaterial({ color:0xf0c040, roughness:0.18, metalness:1, emissive:0x3a2500, emissiveIntensity:0.4 }),
  cash: new THREE.MeshStandardMaterial({ map:label('$$$', '#2a6a3a'), roughness:0.7 }),
  glow: new THREE.MeshBasicMaterial({ color:0xffe08a, transparent:true, opacity:0.18, depthWrite:false, blending:THREE.AdditiveBlending, toneMapped:false })
};
const GEO = {
  ammo: new THREE.BoxGeometry(0.22, 0.12, 0.14), health: new THREE.BoxGeometry(0.2, 0.06, 0.14),
  chip: new THREE.CylinderGeometry(0.035, 0.035, 0.01, 14), gold: new THREE.BoxGeometry(0.24, 0.07, 0.1), cash: new THREE.BoxGeometry(0.16, 0.06, 0.08),
  ring: new THREE.RingGeometry(0.15, 0.3, 24)
};

export class Loot {
  constructor(C){ this.C = C; this.items = []; }
  drop(kind, pos, amount, o){
    o = o || {};
    const g = new THREE.Group();
    if(kind === 'ammo') g.add(new THREE.Mesh(GEO.ammo, MATS.ammo));
    else if(kind === 'health') g.add(new THREE.Mesh(GEO.health, MATS.health));
    else if(kind === 'gold') g.add(new THREE.Mesh(GEO.gold, MATS.gold));
    else if(kind === 'cash') g.add(new THREE.Mesh(GEO.cash, MATS.cash));
    else { const n = Math.min(10, 3 + Math.floor(Math.log10(amount + 1)*2)); for(let i=0;i<n;i++){ const ch = new THREE.Mesh(GEO.chip, i % 2 ? MATS.chips : MATS.chipEdge); ch.position.y = i*0.011; g.add(ch); } }
    const ring = new THREE.Mesh(GEO.ring, MATS.glow); ring.rotation.x = -Math.PI/2; ring.position.y = -0.02; g.add(ring);
    g.position.set(pos.x, 0.12, pos.z);
    this.C.scene.add(g);
    const it = { kind, g, amount, t:Math.random()*6, vy:o.pop ? 2.5 : 0, y:o.pop ? (pos.y || 0.6) : 0.12, vx:o.pop ? (Math.random() - 0.5)*2 : 0, vz:o.pop ? (Math.random() - 0.5)*2 : 0, delay:o.delay || 0.35, weapon:o.weapon };
    this.items.push(it); return it;
  }
  update(dt){
    const C = this.C, cam = C.camera.position;
    for(let i=this.items.length - 1; i>=0; i--){
      const it = this.items[i]; it.t += dt; if(it.delay > 0) it.delay -= dt;
      if(it.vy || it.y > 0.12){ it.vy -= 9.8*dt; it.y += it.vy*dt; it.g.position.x += it.vx*dt; it.g.position.z += it.vz*dt; if(it.y < 0.12){ it.y = 0.12; it.vy = 0; it.vx = it.vz = 0; } }
      it.g.position.y = it.y + Math.sin(it.t*3)*0.03;
      it.g.rotation.y += dt*1.5;
      const dx = it.g.position.x - cam.x, dz = it.g.position.z - cam.z;
      if(it.delay <= 0 && dx*dx + dz*dz < 1.3*1.3 && C.heist && C.heist.collect(it)){ C.scene.remove(it.g); this.items.splice(i, 1); }
    }
  }
  clear(){ this.items.forEach(it=>this.C.scene.remove(it.g)); this.items = []; }
}
