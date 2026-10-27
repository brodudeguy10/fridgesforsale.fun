/* ============================================================
   FRIDGE PALACE HEIST: the people who'd rather you didn't
   GUARD     house security, a vest, a pistol, takes cover
   COP       city police, a light bar on the head, pistol or pump
   RUSHER    a mini fridge with nothing to lose, runs at you
   SWAT      a side-by-side holding its own door as a riot shield
   HEAVY     a walk-in freezer that lobs ice blocks; shoot the coil
   they path on a half-meter grid, pick cover that can see you,
   flank, peek, flinch, freeze solid, and come apart.
============================================================ */
import * as THREE from '../lib/three.module.min.js';
import { makeFridge, animateFridge, Face, bakePainted } from '../world/fridge.js';
import { canvas, tex } from '../world/textures.js';
import { rayOBB } from './combat.js';
import { los } from './nav.js';

const R = (a, b)=>a + Math.random()*(b - a);
const pick = a=>a[(Math.random()*a.length)|0];
const sm = t=>t <= 0 ? 0 : t >= 1 ? 1 : t*t*(3 - 2*t);
const angDiff = (a, b)=>Math.atan2(Math.sin(a - b), Math.cos(a - b));

const NAMES = {
  guard:['SECURITY', 'SECURITY', 'NIGHT SHIFT', 'LOSS PREVENTION'],
  cop:['OFFICER', 'OFFICER', 'DEPUTY', 'SGT. FROST'],
  rusher:['MINI', 'DORM FRIDGE', 'THE INTERN'],
  swat:['SWAT', 'SWAT', 'TACTICAL'],
  heavy:['WALK-IN']
};
export const TYPES = {
  guard:{ hp:100, speed:2.5, acc:0.3, dmg:7, burst:[2, 3], gap:[1.1, 2.0], rof:0.22, weapon:'pistol', range:[6, 16], style:'std', color:['#2a2d34', '#33363e', '#24262c'], eye:'#ffd56a', acc2:['vest', 'headset'], vest:'#0f0f12', loot:0.8 },
  cop:{ hp:115, speed:2.7, acc:0.32, dmg:8, burst:[2, 4], gap:[1.0, 1.8], rof:0.2, weapon:'pistol', range:[6, 18], style:'tall', color:['#1c2a4a', '#20304f', '#1a2540'], eye:'#7ff3ff', acc2:['nametag'], cop:true, loot:0.8 },
  copShotgun:{ hp:125, speed:2.5, acc:0.4, dmg:5, pellets:6, burst:[1, 1], gap:[1.3, 2.0], rof:0.9, weapon:'shotgun', range:[4, 10], style:'tall', color:['#1c2a4a'], eye:'#7ff3ff', acc2:['nametag'], cop:true, loot:1 },
  rusher:{ hp:55, speed:5.2, acc:0, dmg:12, melee:true, style:'mini', color:['#e05a5a', '#ff8a3d', '#c060ff', '#7ad08a', '#5a8ae0'], eye:'#ff4040', acc2:[], loot:0.4 },
  swat:{ hp:150, speed:1.8, acc:0.26, dmg:6, burst:[3, 5], gap:[1.6, 2.6], rof:0.09, weapon:'smg', range:[5, 12], style:'sxs', color:['#15171a'], eye:'#ff5a5a', acc2:['headset'], shield:true, loot:1 },
  heavy:{ hp:950, speed:1.15, acc:0.5, dmg:26, heavy:true, range:[4, 20], loot:1 }
};

/* ---------- textures ---------- */
const interiorTex = (()=>{ const c = canvas(128, 192), g = c.getContext('2d');
  const gr = g.createLinearGradient(0, 0, 0, 192); gr.addColorStop(0, '#f4fbff'); gr.addColorStop(1, '#b8c8d4'); g.fillStyle = gr; g.fillRect(0, 0, 128, 192);
  g.fillStyle = 'rgba(255,255,255,0.9)'; g.fillRect(10, 4, 108, 6);
  [56, 104, 150].forEach(y=>{ g.fillStyle = 'rgba(200,230,255,0.9)'; g.fillRect(4, y, 120, 4); g.fillStyle = 'rgba(0,0,0,0.12)'; g.fillRect(4, y + 4, 120, 6); });
  const item = (x, y, w, h, col)=>{ g.fillStyle = col; g.fillRect(x, y - h, w, h); g.fillStyle = 'rgba(255,255,255,0.3)'; g.fillRect(x + 2, y - h + 2, 3, h - 4); };
  item(12, 56, 18, 36, '#f6f6f2'); item(34, 56, 14, 24, '#c0392b'); item(52, 56, 26, 14, '#f3e6cf'); item(84, 56, 30, 22, '#f3efe4');
  item(10, 104, 22, 30, '#7ac043'); item(38, 104, 12, 34, '#d8a020'); item(56, 104, 16, 20, '#d42020'); item(78, 104, 40, 16, '#f2c230');
  item(14, 150, 40, 26, '#5b8a2a'); item(62, 150, 20, 30, '#e8742a'); item(88, 150, 26, 18, '#9a6a3a');
  g.fillStyle = 'rgba(200,220,240,0.8)'; g.fillRect(4, 160, 120, 28); return tex(c); })();
const shieldTex = (()=>{ const c = canvas(256, 512), g = c.getContext('2d'); g.fillStyle = '#121418'; g.fillRect(0, 0, 256, 512);
  g.fillStyle = '#1e2228'; for(let y=0;y<512;y+=32) g.fillRect(0, y, 256, 2);
  g.fillStyle = '#9ab8d0'; g.fillRect(48, 70, 160, 40); g.fillStyle = 'rgba(255,255,255,0.25)'; g.fillRect(52, 74, 60, 8);
  g.fillStyle = '#f2f2f2'; g.font = 'bold 54px Arial'; g.textAlign = 'center'; g.fillText('POLICE', 128, 230); g.font = 'bold 22px Arial'; g.fillText('FREEZE.', 128, 270);
  g.strokeStyle = '#555'; g.lineWidth = 8; g.strokeRect(8, 8, 240, 496); return tex(c); })();
const ceilLight = new THREE.MeshBasicMaterial({ color:0xffffff, toneMapped:false });

function enemyGun(kind){
  const g = new THREE.Group(), m = new THREE.MeshStandardMaterial({ color:0x1d1f22, roughness:0.4, metalness:0.8 });
  const L = kind === 'shotgun' ? 0.55 : kind === 'smg' ? 0.32 : 0.2;
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.04, L, 0.06), m); body.position.y = -L/2 + 0.04; g.add(body);
  const grip = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.03, 0.1), m); grip.position.set(0, 0.03, -0.05); g.add(grip);
  if(kind === 'smg'){ const mag = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.04, 0.12), m); mag.position.set(0, -0.08, -0.07); g.add(mag); }
  const muzzle = new THREE.Object3D(); muzzle.position.set(0, -L + 0.03, 0.01); g.add(muzzle);
  const flash = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 6), new THREE.MeshBasicMaterial({ color:0xffc070, toneMapped:false, transparent:true, opacity:0.9 })); flash.visible = false; muzzle.add(flash);
  g.userData.muzzle = muzzle; g.userData.flash = flash;
  bakePainted(g, [muzzle]);
  return g;
}

/* ---------- the walk-in freezer ---------- */
function makeHeavy(){
  const grp = new THREE.Group(), inner = new THREE.Group(); grp.add(inner);
  const steel = new THREE.MeshStandardMaterial({ color:0xb8bcc2, roughness:0.32, metalness:0.85 });
  const dark = new THREE.MeshStandardMaterial({ color:0x1a1b1e, roughness:0.6, metalness:0.3 });
  const w = 1.5, h = 2.35, d = 1.25;
  const body = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), steel); body.position.y = h/2 + 0.12; inner.add(body);
  for(let i=0;i<5;i++){ const rib = new THREE.Mesh(new THREE.BoxGeometry(w + 0.02, 0.03, d + 0.02), steel); rib.position.y = 0.4 + i*0.45; inner.add(rib); }
  const door = new THREE.Group(); door.position.set(-w/2 + 0.08, 0, d/2 + 0.03); inner.add(door);
  const dp = new THREE.Mesh(new THREE.BoxGeometry(w - 0.22, h - 0.3, 0.07), steel); dp.position.set((w - 0.22)/2 - 0.0, h/2 + 0.12, 0); door.add(dp);
  const port = new THREE.Mesh(new THREE.CircleGeometry(0.16, 20), new THREE.MeshStandardMaterial({ color:0x9fd8ff, emissive:0x2a7aaa, emissiveIntensity:0.8, roughness:0.1 })); port.position.set((w - 0.22)/2, 0.95, 0.04); door.add(port);
  const lever = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.4, 0.1), dark); lever.position.set(w - 0.38, 1.1, 0.08); door.add(lever);
  const plate = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 0.14), new THREE.MeshBasicMaterial({ map:(()=>{ const c = canvas(256, 64), g = c.getContext('2d'); g.fillStyle = '#f6d020'; g.fillRect(0, 0, 256, 64); g.fillStyle = '#111'; g.font = 'bold 36px monospace'; g.textAlign = 'center'; g.fillText('WALK-IN', 128, 46); return tex(c); })() })); plate.position.set((w - 0.22)/2, 0.55, 0.04); door.add(plate);
  /* the coil on the back: the weak point */
  const comp = new THREE.Group(); comp.position.set(0, h - 0.05, -d/2 + 0.1); inner.add(comp);
  comp.add(new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.45, 0.5), dark));
  const coilM = new THREE.MeshBasicMaterial({ color:0x7ff3ff, toneMapped:false });
  for(let i=0;i<6;i++){ const coil = new THREE.Mesh(new THREE.TorusGeometry(0.11, 0.018, 6, 16), coilM); coil.position.set(-0.3 + i*0.12, 0, -0.27); comp.add(coil); }
  const fan = new THREE.Group(); fan.position.set(0, 0.24, 0); comp.add(fan);
  for(let i=0;i<4;i++){ const b = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.01, 0.06), dark); b.rotation.y = i*Math.PI/2; b.position.set(0, 0, 0); fan.add(b); }
  /* face */
  const face = new Face({ eye:'#ff3a2a', screen:'#100000' });
  const fp = new THREE.Mesh(new THREE.PlaneGeometry(0.66, 0.5), new THREE.MeshBasicMaterial({ map:face.t, toneMapped:false })); fp.position.set(0, h - 0.25, d/2 + 0.075); inner.add(fp);
  /* arms: a big hand and a cannon */
  const armM = steel;
  const mkArm = (side)=>{ const sh = new THREE.Group(); sh.position.set(side*(w/2 + 0.1), h - 0.6, 0.1); const up = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.09, 0.8, 12), armM); up.position.y = -0.4; sh.add(up); inner.add(sh); return sh; };
  const armL = mkArm(-1), armR = mkArm(1);
  const fist = new THREE.Mesh(new THREE.SphereGeometry(0.16, 12, 10), dark); fist.position.y = -0.85; armL.add(fist);
  const cannon = new THREE.Group(); cannon.position.y = -0.8; armR.add(cannon);
  const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.17, 0.7, 14), dark); tube.position.y = -0.2; cannon.add(tube);
  const mouth = new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.03, 6, 16), coilM); mouth.rotation.x = Math.PI/2; mouth.position.y = -0.55; cannon.add(mouth);
  const muzzle = new THREE.Object3D(); muzzle.position.y = -0.6; cannon.add(muzzle);
  [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sz])=>{ const wh = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.06, 12), dark); wh.rotation.z = Math.PI/2; wh.position.set(sx*(w/2 - 0.15), 0.08, sz*(d/2 - 0.15)); inner.add(wh); });
  bakePainted(inner, [door, comp, fp, armL, armR]); bakePainted(door, [port, plate]);
  return { group:grp, inner, w, h, d, face, facePlane:fp, faceY:h - 0.25, armL, armR, door, comp, fan, coilM, muzzle, top:h + 0.12 };
}

/* free the GPU side of a removed enemy. geometry and the face texture are
   unique per fridge (models are merged on build); materials are left alone
   because shared shader programs would get torn down and recompiled. */
function freeGPU(root){ if(!root) return; root.traverse(o=>{ if(o.geometry) o.geometry.dispose(); }); }
function freeEnemy(e){ freeGPU(e.F.group); if(e.flungDoor) freeGPU(e.flungDoor.g); if(e.ice){ e.ice.geometry.dispose(); } if(e.F.face && e.F.face.t) e.F.face.t.dispose(); }
export class Enemies {
  constructor(C, nav){
    this.C = C; this.nav = nav;
    this.list = []; this.dead = []; this.proj = [];
    this.diff = 1;
    this.alert = false;
    this.totalKills = 0;
    this.maxCorpses = C.engine.preset() === 'low' ? 10 : 22;
    this.thinkI = 0;
    this._v = new THREE.Vector3();
    this.iceM = new THREE.MeshStandardMaterial({ color:0xbfeeff, roughness:0.05, metalness:0.1, transparent:true, opacity:0.55, emissive:0x2a7aaa, emissiveIntensity:0.35, depthWrite:false });
    this.interiorM = new THREE.MeshStandardMaterial({ map:interiorTex, emissive:0xffffff, emissiveMap:interiorTex, emissiveIntensity:0.0, roughness:0.4 });
  }
  get alive(){ return this.list.filter(e=>e.alive); }
  count(type){ return this.list.filter(e=>e.alive && (!type || e.type === type)).length; }
  /* ---------- building one ---------- */
  spawn(type, x, z, o){
    o = o || {};
    const C = this.C, T = TYPES[type] || TYPES.guard;
    let F;
    if(T.heavy) F = makeHeavy();
    else {
      const look = { face:true, arms:true, bareFront:true, style:T.style, color:pick(T.color), eye:T.eye, acc:T.acc2.slice(), vest:T.vest, glove:'#111' };
      if(type === 'rusher'){ look.acc = [pick([[], ['beanie'], ['party'], ['rust']])].flat(); look.color = pick(T.color); }
      F = makeFridge(look);
      this.addDoor(F, look);
      if(T.cop) this.addCopGear(F);
      if(T.shield) this.addShield(F);
    }
    F.group.position.set(x, 0, z); F.group.rotation.y = o.yaw !== undefined ? o.yaw : Math.atan2(C.camera.position.x - x, C.camera.position.z - z);
    C.scene.add(F.group);
    let gun = null;
    if(!T.melee && !T.heavy){ gun = enemyGun(T.weapon); F.armR.add(gun); gun.position.set(0, -0.36, 0.02); }
    const e = {
      type, T, F, gun, name:o.name || pick(NAMES[type.replace('copShotgun', 'cop')] || ['?']),
      hp:T.hp*(o.hpMul || 1)*(0.85 + this.diff*0.15), maxHp:0, alive:true, state:'enter', stT:0,
      path:null, pi:0, cover:null, coverT:0, fireCD:R(0.8, 1.8), burstLeft:0, seenT:0, sees:false, losT:0,
      freeze:0, frozen:false, frozenT:0, flinch:0, yaw:F.group.rotation.y, speed:T.speed*R(0.9, 1.1), flank:Math.random() < 0.35,
      shieldUp:true, shieldHP:120, peekT:0, staggerT:0, meleeCD:0, lobCD:R(1.5, 3), stompCD:0, coilHP:220, coilBroken:false,
      seed:Math.random()*10, enterT:o.enter || 0, lastHurt:0, spot:o.spot || null, scripted:o.scripted || false, tag:o.tag || null
    };
    e.maxHp = e.hp;
    const self = this;
    e.target = { kind:'enemy', e, get alive(){ return e.alive; }, shootableDead:true,
      ray:(oo, d, maxT)=>self.ray(e, oo, d, maxT), hit:(info)=>self.hit(e, info),
      center:()=>new THREE.Vector3(e.F.group.position.x, e.alive ? (e.F.h || 1.7)*0.55 : 0.4, e.F.group.position.z),
      freeze:(v, dir)=>self.freezeHit(e, v, dir) };
    C.combat.add(e.target);
    this.list.push(e);
    if(o.enterFrom === 'door') C.audio.door(new THREE.Vector3(x, 1.2, z));
    return e;
  }
  addDoor(F, look){
    /* the fridge compartment door, hinged on the left; the interior hides behind it */
    const w = F.w, h = F.h, d = F.d, top = F.top, fz = d/2;
    const split = look.style === 'mini' || look.style === 'sxs' || look.style === 'french' ? (F.faceY - 0.3) : (top - h*0.3);
    const y0 = 0.1, y1 = Math.max(0.6, split - 0.02), dh = y1 - y0, dw = w - 0.03;
    const bodyM = F.body.material;
    const inner = new THREE.Mesh(new THREE.PlaneGeometry(dw - 0.06, dh - 0.06), this.interiorM.clone()); inner.position.set(0, y0 + dh/2, fz + 0.004); F.inner.add(inner);
    const door = new THREE.Group(); door.position.set(-dw/2, y0, fz + 0.03); F.inner.add(door);
    const dp = new THREE.Mesh(new THREE.BoxGeometry(dw, dh, 0.05), bodyM); dp.position.set(dw/2, dh/2, 0); door.add(dp);
    const hm = new THREE.MeshStandardMaterial({ color:0xd8dade, roughness:0.12, metalness:1 });
    const hb = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, Math.min(0.5, dh*0.5), 10), hm); hb.position.set(dw - 0.09, dh*0.72, 0.055); door.add(hb);
    const gasket = new THREE.Mesh(new THREE.BoxGeometry(dw, 0.012, 0.052), new THREE.MeshStandardMaterial({ color:0x0a0a0c, roughness:0.8 })); gasket.position.set(dw/2, dh, 0); door.add(gasket);
    bakePainted(door);
    F.door = door; F.interior = inner; F.doorH = dh; F.doorY0 = y0;
  }
  addCopGear(F){
    const bar = new THREE.Group(); bar.position.set(0, F.top + 0.05, 0); F.inner.add(bar);
    const base = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.04, 0.12), new THREE.MeshStandardMaterial({ color:0x111, roughness:0.5 })); bar.add(base);
    const r = new THREE.Mesh(new THREE.BoxGeometry(0.17, 0.07, 0.1), new THREE.MeshBasicMaterial({ color:0xff1a1a, toneMapped:false })); r.position.set(-0.11, 0.05, 0); bar.add(r);
    const b = new THREE.Mesh(new THREE.BoxGeometry(0.17, 0.07, 0.1), new THREE.MeshBasicMaterial({ color:0x1a4aff, toneMapped:false })); b.position.set(0.11, 0.05, 0); bar.add(b);
    const badge = new THREE.Mesh(new THREE.CircleGeometry(0.035, 6), new THREE.MeshStandardMaterial({ color:0xe0aa45, metalness:1, roughness:0.25 })); badge.position.set(F.w*0.28, F.top - F.h*0.45, F.d/2 + 0.06); F.inner.add(badge);
    F.lightR = r; F.lightB = b;
  }
  addShield(F){
    const sh = new THREE.Group(); sh.position.set(-0.05, 0, F.d/2 + 0.34); F.inner.add(sh);
    const m = new THREE.MeshStandardMaterial({ map:shieldTex, roughness:0.35, metalness:0.6 });
    const p = new THREE.Mesh(new THREE.BoxGeometry(0.85, 1.55, 0.06), m); p.position.y = 0.92; sh.add(p);
    const handle = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.3, 0.06), new THREE.MeshStandardMaterial({ color:0x333 })); handle.position.set(0, 0.9, -0.06); sh.add(handle);
    F.shield = sh; F.shieldPlate = p;
  }
  /* ---------- rays ---------- */
  ray(e, o, d, maxT){
    const F = e.F, p = F.group.position, yaw = F.group.rotation.y;
    let best = null;
    if(e.alive){
      /* the shield first: from the front, it eats bullets */
      if(F.shield && e.shieldUp && !e.frozen){
        const sw = new THREE.Vector3(); F.shieldPlate.getWorldPosition(sw);
        const r = rayOBB(o.x, o.y, o.z, d.x, d.y, d.z, sw.x, sw.y, sw.z, 0.43, 0.78, 0.05, yaw + (F.shield.rotation.y || 0), maxT);
        if(r){ best = { t:r.t, n:r.n, part:'shield' }; maxT = r.t; }
      }
      const hh = (F.h || 2)/2 + 0.04, hw = F.w/2 + 0.02, hd = F.d/2 + 0.06;
      const r = rayOBB(o.x, o.y, o.z, d.x, d.y, d.z, p.x, hh + (F.inner.position.y || 0), p.z, hw, hh, hd, yaw, maxT);
      if(r){
        best = { t:r.t, n:r.n, part:'body' };
        /* a hit on the face screen is a crit */
        const hp = new THREE.Vector3(o.x + d.x*r.t, o.y + d.y*r.t, o.z + d.z*r.t);
        const lx = (hp.x - p.x)*Math.cos(yaw) - (hp.z - p.z)*Math.sin(yaw), lz = (hp.x - p.x)*Math.sin(yaw) + (hp.z - p.z)*Math.cos(yaw);
        if(F.faceY && Math.abs(hp.y - F.faceY) < 0.2 && Math.abs(lx) < 0.26 && lz > F.d/2 - 0.05) best.part = 'face';
        if(e.T.heavy && lz < -F.d/2 + 0.15 && hp.y > F.h - 0.4) best.part = 'coil';
      }
    } else {
      /* a corpse: a low box along the fall direction */
      const fy = e.fallYaw !== undefined ? e.fallYaw : yaw;
      const r = rayOBB(o.x, o.y, o.z, d.x, d.y, d.z, e.restC.x, (F.d || 0.7)/2, e.restC.z, F.w/2, (F.d || 0.7)/2, (F.h || 1.7)/2, fy, maxT);
      if(r && (!best || r.t < best.t)) best = { t:r.t, n:r.n, part:'corpse' };
    }
    return best;
  }
  /* ---------- getting hurt ---------- */
  hit(e, info){
    const C = this.C, G = C.gore, H = C.audio.heist, F = e.F;
    const n = new THREE.Vector3(info.n[0], info.n[1], info.n[2]);
    if(!e.alive){
      /* shooting what's left: more comes out */
      if((e.corpseHits = (e.corpseHits || 0) + 1) < 14){ G.blobBurst(info.point, 3, pick(['#b8160f', '#f4f4ee', '#e0b020']), 0.7, true); if(Math.random() < 0.4) G.spill(info.point, n, { n:2, sauce:2, power:0.6 }); }
      G.hole(info.point, n, 0.04); H && H.hit('fridge', info.point);
      return { hit:true };
    }
    if(e.frozen && !info.explosion && info.weapon !== 'freon'){ this.shatter(e, info.dir); return { hit:true, kill:true }; }
    if(info.part === 'shield'){
      G.sparks(info.point, 8, { dir:n, speed:4 }); G.hole(info.point, n, 0.035); H && H.hit('shield', info.point);
      e.shieldHP -= info.dmg*(info.weapon === 'shotgun' ? 1.4 : 0.6);
      if(e.shieldHP <= 0){ e.staggerT = 1.6; e.shieldHP = 120; e.shieldUp = false; C.bus.emit('heistcall', { k:'shieldbreak', e }); }
      return { hit:false };
    }
    let dmg = info.dmg, crit = false;
    if(info.part === 'face'){ dmg *= info.crit || 1.6; crit = true; F.face.set('static', 0.25); }
    if(info.part === 'coil'){ dmg *= 3; crit = true; G.sparks(info.point, 14, { speed:5, col:'#7ff3ff' }); e.coilHP -= info.dmg*3; if(e.coilHP <= 0 && !e.coilBroken){ e.coilBroken = true; e.speed *= 0.6; F.coilM.color.setHex(0x331010); G.explosion(info.point, 1.2); H && H.explosion(info.point, 0.4); C.bus.emit('heistcall', { k:'coil', e }); } }
    e.hp -= dmg; e.lastHurt = 0;
    e.flinch = Math.min(1, e.flinch + (info.weapon === 'shotgun' ? 0.25 : 0.6));
    if(!crit) F.face.set('hurt', 0.6);
    /* coolant, sparks, a dent */
    G.coolant(info.point, n, info.pellets > 1 ? 2 : 5);
    if(Math.random() < 0.5) G.sparks(info.point, 3, { dir:n, speed:3 });
    if(info.pellet === 0 || Math.random() < 0.4) H && H.hit('fridge', info.point);
    if(Math.random() < 0.35) G.blobBurst(info.point, 2, pick(['#f4f4ee', '#b8160f']), 0.6, true);
    /* they notice you */
    this.alertAll(); e.seenT = Math.max(e.seenT, 0.8);
    if(e.hp <= 0){ this.kill(e, info); return { hit:true, kill:true, crit }; }
    return { hit:true, crit };
  }
  freezeHit(e, v, dir){
    if(!e.alive) return;
    e.freeze = Math.min(130, e.freeze + v*(e.T.heavy ? 0.35 : 1));
    if(e.freeze >= 100 && !e.frozen){
      e.frozen = true; e.frozenT = 0;
      const F = e.F, b = new THREE.Box3().setFromObject(F.group);
      const s = new THREE.Vector3(); b.getSize(s); const c = new THREE.Vector3(); b.getCenter(c);
      const ice = new THREE.Mesh(new THREE.BoxGeometry(s.x + 0.1, s.y + 0.08, s.z + 0.1), this.iceM); ice.position.copy(c); this.C.scene.add(ice); e.ice = ice;
      F.face.set('shock', 999);
      this.C.audio.heist && this.C.audio.heist.hit('ice', c);
      this.C.gore.mistPuff(c, '#d8f6ff', 10, { size:0.4, speed:1, life:1.4 });
      this.C.bus.emit('frozen', { e });
    }
  }
  shatter(e, dir){
    const C = this.C, p = e.F.group.position.clone();
    C.gore.iceBurst(p, e.T.heavy ? 50 : 26, { power:1.2 });
    C.gore.spill(new THREE.Vector3(p.x, 0.8, p.z), dir || new THREE.Vector3(0, 1, 0), { n:8, sauce:4, power:1.2 });
    C.audio.heist && C.audio.heist.hit('ice', p); C.audio.heist && C.audio.heist.hit('glass', p);
    if(e.ice){ C.scene.remove(e.ice); e.ice.geometry.dispose(); e.ice = null; }
    e.alive = false; e.state = 'gone'; e.shattered = true;
    C.scene.remove(e.F.group); C.combat.remove(e.target); freeEnemy(e);
    this.list.splice(this.list.indexOf(e), 1);
    this.totalKills++;
    C.bus.emit('kill', { e, how:'shatter', pos:p });
    this.drops(e, p);
  }
  kill(e, info){
    const C = this.C, F = e.F, G = C.gore, H = C.audio.heist;
    e.alive = false; e.state = 'dying'; e.stT = 0;
    if(e.ice){ C.scene.remove(e.ice); e.ice.geometry.dispose(); e.ice = null; }
    this.totalKills++;
    const dir = info.dir ? info.dir.clone().setY(0).normalize() : new THREE.Vector3(0, 0, 1);
    e.fallYaw = Math.atan2(dir.x, dir.z);
    /* which way it tips: away from the shot */
    const yaw = F.group.rotation.y;
    /* +1 tips forward, -1 tips backward: whichever way the shot pushed it */
    e.fallSign = Math.cos(angDiff(e.fallYaw, yaw)) > 0 ? 1 : -1;
    const fwd = new THREE.Vector3(Math.sin(yaw), 0, Math.cos(yaw));
    e.restC = F.group.position.clone().addScaledVector(fwd, e.fallSign*((F.d || 0.7)/2 + (F.h || 1.7)/2));
    e.fallYaw = yaw;
    F.face.set('static', 0.9); setTimeout(()=>{ if(F.face) F.face.set('off', 1e9); }, 900);
    /* the door: open hard, or off entirely */
    const violent = info.explosion || (info.weapon === 'shotgun' && info.dist < 6) || info.part === 'face' && Math.random() < 0.3;
    if(F.door){
      if(violent){ this.flingDoor(e, dir); }
      else { e.doorSwing = R(1.6, 2.3); }
    }
    if(F.interior){ e.lightFlicker = 1.4; }
    const mid = new THREE.Vector3(F.group.position.x, (F.h || 1.7)*0.45, F.group.position.z);
    G.spill(mid, dir.clone().setY(0.3), { n:e.T.heavy ? 24 : R(9, 14)|0, sauce:e.T.heavy ? 30 : 14, power:violent ? 1.5 : 1 });
    G.coolant(mid, dir, 12); G.sparks(mid, 14, { speed:4 });
    H && H.squelch(mid, true);
    if(F.shield){ e.droppedShield = true; }
    if(e.gun){ e.gun.userData.flash.visible = false; }
    C.bus.emit('kill', { e, how:info.weapon, pos:mid, crit:info.part === 'face' });
    this.drops(e, mid);
    this.dead.push(e);
    if(this.dead.length > this.maxCorpses){ const old = this.dead.shift(); this.removeCorpse(old); }
  }
  removeCorpse(e){ this.C.scene.remove(e.F.group); if(e.flungDoor) this.C.scene.remove(e.flungDoor.g); this.C.combat.remove(e.target); freeEnemy(e); const i = this.list.indexOf(e); if(i >= 0) this.list.splice(i, 1); }
  flingDoor(e, dir){
    const F = e.F, C = this.C;
    F.door.updateWorldMatrix(true, true);
    const wp = new THREE.Vector3(), wq = new THREE.Quaternion(); F.door.getWorldPosition(wp); F.door.getWorldQuaternion(wq);
    const g = new THREE.Group(); g.position.copy(wp); g.quaternion.copy(wq); C.scene.add(g);
    F.door.children.slice().forEach(ch=>g.add(ch));
    F.door.visible = false;
    e.flungDoor = { g, vx:dir.x*R(3, 5) + R(-1, 1), vy:R(2.5, 4.5), vz:dir.z*R(3, 5) + R(-1, 1), wx:R(-8, 8), wy:R(-6, 6), wz:R(-8, 8), rest:false };
  }
  drops(e, p){
    const C = this.C, L = C.loot; if(!L) return;
    if(Math.random() < (e.T.loot || 0.6)) L.drop('ammo', p, 1, { pop:true });
    if(Math.random() < 0.28) L.drop('health', p, 1, { pop:true, delay:0.5 });
    if(e.type === 'guard' || e.type === 'cop' || Math.random() < 0.3) L.drop('chips', p, Math.round(R(20, 140)), { pop:true, delay:0.6 });
    if(e.T.heavy){ for(let i=0;i<3;i++) L.drop('ammo', p, 1, { pop:true }); L.drop('health', p, 1, { pop:true }); L.drop('chips', p, 1500, { pop:true }); }
  }
  alertAll(){ if(!this.alert){ this.alert = true; this.C.bus.emit('enemyalert'); } }
  /* ---------- choosing where to stand ---------- */
  chooseCover(e){
    const C = this.C, nav = this.nav, cam = C.camera.position;
    const [rMin, rMax] = e.T.range;
    let best = null, bs = -1e9;
    const myp = e.F.group.position;
    const camYaw = C.player.yaw;
    for(let k=0;k<26;k++){
      const ang = e.flank ? Math.atan2(myp.x - cam.x, myp.z - cam.z) + R(-1.8, 1.8) : Math.atan2(myp.x - cam.x, myp.z - cam.z) + R(-0.9, 0.9);
      const r = R(rMin, rMax);
      const x = cam.x + Math.sin(ang)*r, z = cam.z + Math.cos(ang)*r;
      if(!nav.walkAt(x, z)) continue;
      const cov = nav.coverAt(x, z);
      if(!los(C.collide, x, 1.45, z, cam.x, cam.y - 0.2, cam.z)) continue;
      let crowd = 0; for(const o of this.list){ if(o !== e && o.alive && o.cover){ const dd = Math.hypot(o.cover[0] - x, o.cover[1] - z); if(dd < 2.2) crowd += 2.2 - dd; } }
      const travel = Math.hypot(x - myp.x, z - myp.z);
      /* in front of the player's eyes is worse: flankers like your blind side */
      const toE = Math.atan2(x - cam.x, z - cam.z), facing = Math.abs(angDiff(toE, camYaw + Math.PI));
      const sc = cov*2.2 - crowd*2 - travel*0.08 - Math.abs(r - (rMin + rMax)/2)*0.15 + (e.flank ? facing*0.6 : 0) + Math.random()*0.5;
      if(sc > bs){ bs = sc; best = [x, z]; }
    }
    return best;
  }
  goTo(e, x, z){
    const p = e.F.group.position;
    const path = this.nav.path(p.x, p.z, x, z, 5000);
    if(path && path.length){ e.path = path; e.pi = 1; return true; }
    return false;
  }
  /* ---------- the brain ---------- */
  update(dt, t){
    const C = this.C, cam = C.camera.position;
    /* projectiles: the heavy's ice blocks */
    for(let i=this.proj.length - 1; i>=0; i--){ const pr = this.proj[i]; pr.vy -= 9.8*dt; pr.m.position.x += pr.vx*dt; pr.m.position.y += pr.vy*dt; pr.m.position.z += pr.vz*dt; pr.m.rotation.x += dt*6; pr.m.rotation.z += dt*4; pr.life -= dt;
      const p = pr.m.position, dc = p.distanceTo(cam);
      if(p.y < 0.2 || dc < 0.8 || pr.life <= 0){ this.C.scene.remove(pr.m); this.proj.splice(i, 1); C.gore.iceBurst(p, 18, { power:1.3 }); C.audio.heist && C.audio.heist.hit('ice', p); C.audio.heist && C.audio.heist.explosion(p, 0.3); const d = p.distanceTo(cam); if(d < 3.2) C.heist && C.heist.hurt(TYPES.heavy.dmg*(1 - d/3.2) + 4, p, 'ice'); C.player.addShake(Math.max(0, 0.8 - d*0.12)); for(const o of this.list){ if(o.alive && !o.T.heavy){ const od = o.F.group.position.distanceTo(p); if(od < 2.5) o.target.hit({ dmg:40*(1 - od/2.5), point:o.target.center(), n:[0, 1, 0], dir:new THREE.Vector3(0, 0, 1), weapon:'ice', explosion:true }); } } }
    }
    let thinkBudget = 3;
    for(let k=this.list.length - 1; k>=0; k--){
      const e = this.list[k], F = e.F, g = F.group, p = g.position;
      e.stT += dt;
      if(!e.alive){ this.updateDead(e, dt, t); continue; }
      const d2 = p.distanceToSquared(cam);
      F.face.update(dt, d2 < 400);
      if(F.lightR){ const on = Math.floor(t*6 + e.seed) % 2; F.lightR.material.color.setScalar(on ? 1 : 0.15).setRGB(on ? 1 : 0.2, 0.05, 0.05); F.lightB.material.color.setRGB(0.05, 0.15, on ? 0.2 : 1); }
      if(F.fan) F.fan.rotation.y += dt*(e.coilBroken ? 1 : 14);
      /* frozen solid: nothing happens until it thaws or breaks */
      if(e.frozen){ e.frozenT += dt; e.freeze -= dt*9; if(e.freeze < 35){ e.frozen = false; if(e.ice){ C.scene.remove(e.ice); e.ice.geometry.dispose(); e.ice = null; } F.face.set('angry', 2); C.gore.mistPuff(new THREE.Vector3(p.x, 1, p.z), '#d8f6ff', 6, { size:0.3 }); } continue; }
      if(e.freeze > 0) e.freeze = Math.max(0, e.freeze - dt*22);
      const slow = 1 - Math.min(0.7, e.freeze/140);
      e.lastHurt += dt;
      if(e.flinch > 0) e.flinch = Math.max(0, e.flinch - dt*3.5);
      if(e.staggerT > 0){ e.staggerT -= dt; if(e.staggerT <= 0) e.shieldUp = true; }
      if(e.meleeCD > 0) e.meleeCD -= dt;
      /* entering: a short walk in from the door */
      if(e.enterT > 0){ e.enterT -= dt; }
      /* seeing you (rate-limited) */
      e.losT -= dt;
      if(e.losT <= 0 && thinkBudget > 0){ thinkBudget--; e.losT = R(0.2, 0.35); e.sees = los(C.collide, p.x, (F.h || 1.7)*0.8, p.z, cam.x, cam.y - 0.15, cam.z); }
      if(e.sees){ e.seenT += dt; this.alertAll(); } else e.seenT = Math.max(0, e.seenT - dt*0.6);
      const dist = Math.sqrt(d2);
      const toYaw = Math.atan2(cam.x - p.x, cam.z - p.z);
      let moving = 0, wantYaw = toYaw;
      if(e.scripted && e.state === 'enter'){ /* the heist moves this one */ }
      else if(e.T.melee) moving = this.brainRusher(e, dt, dist, slow);
      else if(e.T.heavy) moving = this.brainHeavy(e, dt, dist, slow);
      else moving = this.brainShooter(e, dt, dist, slow);
      /* walking along the path */
      if(e.path && e.pi < e.path.length && e.moveOK !== false){
        const wp = e.path[e.pi], dx = wp[0] - p.x, dz = wp[1] - p.z, dd = Math.hypot(dx, dz);
        if(dd < 0.2){ e.pi++; }
        else {
          const sp = e.speed*slow*(e.T.shield && e.shieldUp ? 0.85 : 1)*(e.flinch > 0.5 ? 0.3 : 1);
          const step = Math.min(dd, sp*dt);
          /* don't stack on each other */
          let sx = dx/dd*step, sz = dz/dd*step;
          for(const o of this.list){ if(o === e || !o.alive) continue; const ox = p.x - o.F.group.position.x, oz = p.z - o.F.group.position.z, od = Math.hypot(ox, oz); if(od < 0.9 && od > 0.01){ sx += ox/od*(0.9 - od)*dt*3; sz += oz/od*(0.9 - od)*dt*3; } }
          p.x += sx; p.z += sz; moving = sp;
          if(!e.sees || e.T.melee) wantYaw = Math.atan2(dx, dz);
        }
        C.collide.resolve(p, 0.38);
      }
      /* turn */
      const dy = angDiff(wantYaw, g.rotation.y); g.rotation.y += dy*Math.min(1, dt*(e.T.heavy ? 2.5 : 7));
      /* aim the gun arm at you */
      if(F.armR && !e.T.melee){
        F.armBusy = true;
        const aimUp = Math.atan2((cam.y - 0.3) - (F.h || 1.7)*0.7, Math.max(0.5, dist));
        const want = e.sees || e.burstLeft > 0 ? -Math.PI/2 - aimUp : -0.3;
        F.armR.rotation.x += (want - F.armR.rotation.x)*Math.min(1, dt*8);
        F.armR.rotation.z = 0.12;
        if(F.shield){ F.armL.rotation.x = -1.3; }
        else if(!e.T.heavy){ F.armL.rotation.x += (Math.sin(t*3 + e.seed)*0.2 - F.armL.rotation.x)*Math.min(1, dt*4); }
      }
      if(F.shield){ const want = e.shieldUp && e.peekT <= 0 ? 0 : 1.1; F.shield.rotation.y += (want - F.shield.rotation.y)*Math.min(1, dt*8); F.shield.position.x = -0.05 - F.shield.rotation.y*0.3; }
      animateFridge(F, t + e.seed, moving, {});
      if(e.flinch > 0){ F.inner.rotation.x = -e.flinch*0.18; F.inner.rotation.z += Math.sin(t*40)*e.flinch*0.05; }
      else F.inner.rotation.x *= 0.8;
      if(e.gun && e.gun.userData.flashT > 0){ e.gun.userData.flashT -= dt; if(e.gun.userData.flashT <= 0) e.gun.userData.flash.visible = false; }
    }
  }
  muzzlePos(e){ const m = e.gun ? e.gun.userData.muzzle : e.F.muzzle; const v = new THREE.Vector3(); if(m){ m.getWorldPosition(v); return v; } return e.F.group.position.clone().setY(1.3); }
  shoot(e){
    const C = this.C, T = e.T;
    const from = this.muzzlePos(e);
    const P = C.player;
    let acc = T.acc*(0.75 + this.diff*0.25);
    if(e.seenT < 0.7) acc *= 0.35;
    if(P.walkAmt > 0.5) acc *= P.running ? 0.55 : 0.8;
    if(P.crouch) acc *= 0.85;
    if(e.path && e.pi < e.path.length) acc *= 0.6;
    acc *= Math.max(0.35, 1 - from.distanceTo(C.camera.position)*0.025);
    C.combat.enemyFire(from, acc, T.dmg*(0.8 + this.diff*0.2), { pellets:T.pellets, sound:T.weapon === 'shotgun' ? 'shotgun' : T.weapon === 'smg' ? 'smg' : 'pistol', self:e.target, weapon:T.weapon, vol:0.85 });
    if(e.gun){ e.gun.userData.flash.visible = true; e.gun.userData.flashT = 0.05; }
    e.F.face.set('angry', 0.5);
  }
  brainShooter(e, dt, dist, slow){
    const C = this.C, T = e.T;
    e.coverT -= dt;
    if(e.enterT > 0) return 0;
    /* pick a spot */
    if(!e.cover || e.coverT <= 0 || (e.path === null && !e.sees && e.coverT < 2)){
      const c = this.chooseCover(e);
      if(c){ e.cover = c; e.coverT = R(5, 9); this.goTo(e, c[0], c[1]); }
      else { e.coverT = 1.5; this.goTo(e, C.camera.position.x + R(-3, 3), C.camera.position.z + R(-3, 3)); }
    }
    /* too close: back off */
    if(dist < 2.5 && e.coverT > 1){ e.coverT = 0.5; }
    /* shooting */
    e.fireCD -= dt*slow;
    if(e.T.shield){
      if(e.peekT > 0){ e.peekT -= dt; }
      if(e.sees && e.fireCD <= 0 && e.burstLeft <= 0 && e.staggerT <= 0){ e.peekT = 0.9; e.burstLeft = Math.round(R(T.burst[0], T.burst[1])); e.fireCD = 0.35; }
    } else if(e.sees && e.fireCD <= 0 && e.burstLeft <= 0){ e.burstLeft = Math.round(R(T.burst[0], T.burst[1])); e.fireCD = 0.12; }
    if(e.burstLeft > 0 && e.fireCD <= 0){
      if(e.sees){ this.shoot(e); }
      e.burstLeft--; e.fireCD = e.burstLeft > 0 ? T.rof*R(0.8, 1.2) : R(T.gap[0], T.gap[1])/(0.8 + this.diff*0.2);
    }
    return 0;
  }
  brainRusher(e, dt, dist, slow){
    const C = this.C, cam = C.camera.position;
    if(e.enterT > 0) return 0;
    e.repath = (e.repath || 0) - dt;
    if(e.repath <= 0){ e.repath = 0.45; if(dist > 1.4) this.goTo(e, cam.x, cam.z); }
    if(dist < 1.35 && e.meleeCD <= 0){
      e.meleeCD = 1.1; e.F.face.set('angry', 1);
      C.heist && C.heist.hurt(e.T.dmg*(0.8 + this.diff*0.2), e.F.group.position, 'melee');
      /* knock you back */
      const P = C.player, dx = P.pos.x - e.F.group.position.x, dz = P.pos.z - e.F.group.position.z, d = Math.hypot(dx, dz) || 1;
      P.vel.x += dx/d*4; P.vel.y += dz/d*4; P.addShake(0.6);
      C.audio.heist && C.audio.heist.hit('fridge', cam.clone()); C.audio.heist && C.audio.heist.hurt();
      e.F.inner.rotation.x = -0.5;
    }
    if(!e._screamed && dist < 9){ e._screamed = true; C.audio.heist && C.audio.heist.scream(e.F.group.position, 3); }
    return 0;
  }
  brainHeavy(e, dt, dist, slow){
    const C = this.C, cam = C.camera.position, F = e.F;
    if(e.enterT > 0) return 0;
    e.repath = (e.repath || 0) - dt;
    if(e.repath <= 0){ e.repath = 1.2; if(dist > 3.5) this.goTo(e, cam.x, cam.z); else e.path = null; }
    e.lobCD -= dt*slow; e.stompCD -= dt;
    if(e.sees && e.lobCD <= 0 && dist > 3){
      e.lobCD = R(2.2, 3.4)/(0.8 + this.diff*0.2);
      /* lob an ice block, leading you a little */
      const from = new THREE.Vector3(); F.muzzle.getWorldPosition(from);
      const P = C.player, lead = new THREE.Vector3(P.vel.x, 0, P.vel.y).multiplyScalar(0.5);
      const tgt = cam.clone().add(lead); tgt.y = 0.6;
      const T = Math.max(0.6, from.distanceTo(tgt)/12);
      const m = new THREE.Mesh(this.iceG || (this.iceG = new THREE.BoxGeometry(0.35, 0.35, 0.35)), this.iceM); m.position.copy(from); C.scene.add(m);
      this.proj.push({ m, vx:(tgt.x - from.x)/T, vy:(tgt.y - from.y)/T + 0.5*9.8*T, vz:(tgt.z - from.z)/T, life:T + 1 });
      F.armR.rotation.x = -2.2;
      C.audio.heist && C.audio.heist.gun('heavy', from, { vol:0.8 });
      F.face.set('angry', 1);
    }
    if(dist < 3 && e.stompCD <= 0){
      e.stompCD = 2.4; F.inner.position.y = 0.3;
      setTimeout(()=>{ if(!e.alive) return; F.inner.position.y = 0; C.player.addShake(1.1); C.audio.heist && C.audio.heist.explosion(F.group.position, 0.35); C.gore.debrisBurst(F.group.position.clone().setY(0.05), 12, '#7a1a20', new THREE.Vector3(0, 1, 0)); if(F.group.position.distanceTo(C.camera.position) < 3.4) C.heist && C.heist.hurt(22, F.group.position, 'stomp'); }, 380);
    }
    if(F.armR) F.armR.rotation.x += (-1.5 - F.armR.rotation.x)*Math.min(1, dt*2);
    if(e.coilBroken && Math.random() < dt*6) C.gore.smokePuff(new THREE.Vector3(F.group.position.x, F.h + 0.2, F.group.position.z), 1, 0.2);
    return 0;
  }
  updateDead(e, dt, t){
    const F = e.F, g = F.group, C = this.C;
    if(e.state === 'dying'){
      const k = Math.min(1, e.stT/0.55);
      const ease = k < 1 ? k*k : 1;
      const ang = ease*Math.PI/2*e.fallSign;
      /* tip over the bottom edge on the side it's falling to */
      F.inner.rotation.set(ang, 0, 0);
      const half = F.d/2;
      F.inner.position.y = Math.abs(Math.sin(ang))*half*0.98;
      F.inner.position.z = Math.sign(ang)*(1 - Math.cos(ang))*half;
      if(k >= 1 && !e.landed){ e.landed = true; C.player.addShake(Math.max(0, 0.5 - g.position.distanceTo(C.camera.position)*0.04)); C.audio.heist && C.audio.heist.hit('fridge', g.position.clone()); C.audio.burst({ ff:200, type:'lowpass', d:0.25, g:0.5, dest:C.audio.out(g.position, 0.4) }); C.gore.mistPuff(g.position.clone().setY(0.1), '#cfcac0', 5, { size:0.3, speed:1 }); e.state = 'dead'; }
      if(F.armL){ F.armBusy = true; F.armL.rotation.x += (1.4 - F.armL.rotation.x)*dt*5; F.armR.rotation.x += (1.2 - F.armR.rotation.x)*dt*5; }
    }
    if(e.doorSwing){ const d = F.door; d.rotation.y += (-e.doorSwing - d.rotation.y)*Math.min(1, dt*9); if(Math.abs(d.rotation.y + e.doorSwing) < 0.02) e.doorSwing = 0; }
    if(e.lightFlicker > 0 && F.interior){ e.lightFlicker -= dt; F.interior.material.emissiveIntensity = e.lightFlicker > 0 ? (Math.random() < 0.5 ? 0.9 : 0.1) : 0; }
    if(e.flungDoor && !e.flungDoor.rest){ const fd = e.flungDoor; fd.vy -= 9.8*dt; fd.g.position.x += fd.vx*dt; fd.g.position.y += fd.vy*dt; fd.g.position.z += fd.vz*dt; fd.g.rotation.x += fd.wx*dt; fd.g.rotation.y += fd.wy*dt; fd.g.rotation.z += fd.wz*dt; if(fd.g.position.y < 0.05){ fd.g.position.y = 0.05; if(fd.vy < -2){ fd.vy *= -0.3; fd.vx *= 0.5; fd.vz *= 0.5; fd.wx *= 0.4; fd.wz *= 0.4; C.audio.heist && C.audio.heist.hit('metal', fd.g.position.clone()); } else { fd.rest = true; fd.g.rotation.set(-Math.PI/2, fd.g.rotation.y, 0); } } }
  }
  clear(){ this.list.slice().forEach(e=>{ this.C.scene.remove(e.F.group); if(e.ice) this.C.scene.remove(e.ice); if(e.flungDoor) this.C.scene.remove(e.flungDoor.g); this.C.combat.remove(e.target); freeEnemy(e); }); this.list = []; this.dead = []; this.proj.forEach(p=>this.C.scene.remove(p.m)); this.proj = []; }
  /* clear the living only (checkpoint restarts keep the bodies) */
  clearAlive(){ this.list.filter(e=>e.alive).forEach(e=>{ this.C.scene.remove(e.F.group); if(e.ice) this.C.scene.remove(e.ice); this.C.combat.remove(e.target); freeEnemy(e); this.list.splice(this.list.indexOf(e), 1); }); this.proj.forEach(p=>this.C.scene.remove(p.m)); this.proj = []; }
}
