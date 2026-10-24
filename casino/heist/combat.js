/* ============================================================
   FRIDGE PALACE HEIST: who got hit
   every shootable thing registers a ray test. a shot asks the
   world (colliders with heights, floor, ceiling) and every target,
   keeps the nearest, and tells it. analytic boxes and cylinders,
   no mesh raycasting, so a shotgun blast costs nothing.
============================================================ */
import * as THREE from '../lib/three.module.min.js';
import { rayWorld, los, heightOf } from './nav.js';

const _o = new THREE.Vector3(), _d = new THREE.Vector3(), _p = new THREE.Vector3(), _n = new THREE.Vector3();

/* ray vs a box that can turn around y. returns { t, n:[x,y,z] } in world space */
export function rayOBB(ox, oy, oz, dx, dy, dz, cx, cy, cz, hx, hy, hz, yaw, maxT){
  const c = Math.cos(-yaw), s = Math.sin(-yaw);
  const lx = ox - cx, ly = oy - cy, lz = oz - cz;
  const px = lx*c + lz*s, pz = -lx*s + lz*c, py = ly;
  const qx = dx*c + dz*s, qz = -dx*s + dz*c, qy = dy;
  let t0 = 0, t1 = maxT, ax = -1, sg = 0;
  const P = [px, py, pz], Q = [qx, qy, qz], H = [hx, hy, hz];
  for(let a=0;a<3;a++){
    if(Math.abs(Q[a]) < 1e-9){ if(P[a] < -H[a] || P[a] > H[a]) return null; continue; }
    let ta = (-H[a] - P[a])/Q[a], tb = (H[a] - P[a])/Q[a], sn = -1;
    if(ta > tb){ const tt = ta; ta = tb; tb = tt; sn = 1; }
    if(ta > t0){ t0 = ta; ax = a; sg = sn; }
    if(tb < t1) t1 = tb;
    if(t0 > t1) return null;
  }
  if(ax < 0) return null;
  /* normal back to world */
  const nl = [0, 0, 0]; nl[ax] = sg;
  const cw = Math.cos(yaw), sw = Math.sin(yaw);
  return { t:t0, n:[nl[0]*cw + nl[2]*sw, nl[1], -nl[0]*sw + nl[2]*cw] };
}
export function rayCyl(ox, oy, oz, dx, dy, dz, cx, cz, r, y0, y1, maxT){
  const fx = ox - cx, fz = oz - cz, A = dx*dx + dz*dz;
  if(A < 1e-9) return null;
  const B = 2*(fx*dx + fz*dz), Cc = fx*fx + fz*fz - r*r, disc = B*B - 4*A*Cc;
  if(disc < 0) return null;
  const t = (-B - Math.sqrt(disc))/(2*A);
  if(t <= 1e-4 || t > maxT) return null;
  const y = oy + dy*t; if(y < y0 || y > y1) return null;
  const hx = fx + dx*t, hz = fz + dz*t, l = Math.hypot(hx, hz) || 1;
  return { t, n:[hx/l, 0, hz/l] };
}

/* what a bullet hitting a collider sounds and looks like */
function surfaceOf(o, y, x, z, C){
  if(!o) return 'wall';
  const t = o.tag;
  if(t === 'wall') return y < 1.22 ? 'wood' : 'wall';
  if(t === 'column') return y < 0.4 || y > 6.1 ? 'gold' : 'marble';
  if(t === 'slotbank' || t === 'slot' || t === 'gate' || t === 'vaultdoor' || t === 'shelf' || t === 'lockers' || t === 'terminal' || t === 'detector') return 'metal';
  if(t === 'table' || t === 'poker') return y > 0.85 ? 'felt' : 'wood';
  if(t === 'bar') return y > 1.05 ? 'marble' : 'wood';
  if(t === 'counter' || t === 'cage' || t === 'desk' || t === 'staffdoor') return 'wood';
  if(t === 'door') return 'glass';
  if(t === 'plant' || t === 'couch') return 'soft';
  if(t === 'wheel' || t === 'podium') return 'gold';
  return 'wall';
}

export class Combat {
  constructor(C){
    this.C = C;
    this.targets = [];
    this.stats = { shots:0, hits:0, kills:0, civ:0, crits:0 };
  }
  add(t){ this.targets.push(t); return t; }
  remove(t){ const i = this.targets.indexOf(t); if(i >= 0) this.targets.splice(i, 1); }
  /* nearest thing along a ray */
  cast(o, d, maxT, opts){
    opts = opts || {};
    const C = this.C;
    let best = maxT, hit = null;
    const w = rayWorld(C.collide, o.x, o.y, o.z, d.x, d.y, d.z, maxT, opts.skipCol);
    if(w){ best = w.t; hit = { t:w.t, world:true, obj:w.obj, n:[w.nx, w.ny, w.nz], surface:w.surface || null }; }
    for(const tg of this.targets){
      if(tg === opts.skip || (opts.filter && !opts.filter(tg))) continue;
      if(tg.alive === false && !tg.shootableDead) continue;
      const r = tg.ray(o, d, best);
      if(r && r.t < best){ best = r.t; hit = Object.assign({ target:tg }, r); }
    }
    if(hit){
      hit.point = new THREE.Vector3(o.x + d.x*hit.t, o.y + d.y*hit.t, o.z + d.z*hit.t);
      if(hit.world){
        if(hit.surface === 'floor'){ const s = C.surfaceAt(hit.point.x, hit.point.z); hit.surface = s === 'marble' ? 'marble' : s === 'wood' ? 'wood' : 'carpet'; }
        else if(!hit.surface) hit.surface = surfaceOf(hit.obj, hit.point.y, hit.point.x, hit.point.z, C);
      }
    }
    return hit;
  }
  /* the player pulls the trigger */
  fire(o){
    const C = this.C, G = C.gore, H = C.audio.heist;
    const from = o.from, base = o.dir;
    const pellets = o.pellets || 1;
    let anyHit = false, anyKill = false, anyCrit = false;
    this.stats.shots++;
    const right = new THREE.Vector3().crossVectors(base, new THREE.Vector3(0, 1, 0)).normalize();
    const up = new THREE.Vector3().crossVectors(right, base).normalize();
    for(let i=0;i<pellets;i++){
      /* uniform in a disk, so the spread looks like a circle */
      const a = Math.random()*Math.PI*2, r = Math.sqrt(Math.random())*o.spread;
      _d.copy(base).addScaledVector(right, Math.cos(a)*r).addScaledVector(up, Math.sin(a)*r).normalize();
      const h = this.cast(from, _d, o.range || 60);
      const end = h ? h.point : _p.copy(from).addScaledVector(_d, o.range || 60).clone();
      if(o.tracerFrom && (i === 0 || Math.random() < 0.35)) G.tracer(o.tracerFrom, end, { speed:pellets > 1 ? 180 : 300, thick:pellets > 1 ? 0.7 : 1 });
      if(!h) continue;
      if(h.world){
        _n.set(h.n[0], h.n[1], h.n[2]);
        G.impact(h.point, _n, h.surface);
        if(i === 0 || Math.random() < 0.3) H && H.hit(h.surface === 'metal' || h.surface === 'gold' ? 'metal' : h.surface === 'wood' || h.surface === 'felt' ? 'wood' : h.surface === 'glass' ? 'glass' : h.surface === 'soft' ? 'soft' : 'other', h.point);
        if((h.surface === 'metal' || h.surface === 'marble') && Math.random() < 0.15) H && H.ricochet(h.point);
        continue;
      }
      /* damage falls off with distance */
      let dmg = o.dmg;
      if(o.falloff){ const [n0, n1, k] = o.falloff; if(h.t > n0) dmg *= 1 - (1 - k)*Math.min(1, (h.t - n0)/(n1 - n0)); }
      const res = h.target.hit({ dmg, crit:o.crit, point:h.point, n:h.n, dir:_d.clone(), part:h.part, weapon:o.weapon, knock:o.knock || 1, src:'player', dist:h.t, pellet:i, pellets });
      if(res){ anyHit = anyHit || res.hit !== false; anyKill = anyKill || !!res.kill; anyCrit = anyCrit || !!res.crit; }
    }
    if(anyHit){ this.stats.hits++; C.bus.emit('hitmark', { kill:anyKill, crit:anyCrit }); }
    if(anyKill) this.stats.kills++;
    /* gunfire is loud. everybody hears it */
    C.bus.emit('gunshot', { pos:from, src:'player', weapon:o.weapon });
    return { hit:anyHit, kill:anyKill };
  }
  /* a cone of freezing gas: returns targets touched */
  cone(o){
    const C = this.C, out = [];
    for(const tg of this.targets){
      if(tg.alive === false || !tg.center || !tg.freeze) continue;
      const c = tg.center(); _p.copy(c).sub(o.from); const dist = _p.length(); if(dist > o.range) continue;
      _p.multiplyScalar(1/dist); const dot = _p.dot(o.dir); if(dot < Math.cos(o.angle)) continue;
      if(!los(C.collide, o.from.x, o.from.y, o.from.z, c.x, c.y, c.z)) continue;
      out.push({ tg, dist });
    }
    return out;
  }
  explode(pos, radius, dmg, src){
    const C = this.C;
    C.gore.explosion(pos, radius);
    C.audio.heist && C.audio.heist.explosion(pos, radius/3);
    C.player.addShake(Math.max(0, 1.4 - pos.distanceTo(C.camera.position)/(radius*3)));
    C.engine.finish.uniforms.uFlash.value = Math.max(C.engine.finish.uniforms.uFlash.value, Math.max(0, 0.5 - pos.distanceTo(C.camera.position)*0.03));
    for(const tg of this.targets.slice()){
      if(tg.alive === false || !tg.center) continue;
      const c = tg.center(), d = c.distanceTo(pos);
      if(d > radius) continue;
      if(!los(C.collide, pos.x, pos.y + 0.3, pos.z, c.x, c.y, c.z)) continue;
      const k = 1 - d/radius;
      tg.hit({ dmg:dmg*k, point:c.clone(), n:[0, 1, 0], dir:c.clone().sub(pos).normalize(), weapon:'explosion', knock:4*k, src:src || 'world', explosion:true, dist:d });
    }
    /* you, too */
    const pd = C.camera.position.distanceTo(pos);
    if(pd < radius && src !== 'player-safe') C.heist && C.heist.hurt(dmg*0.6*(1 - pd/radius), pos, 'explosion');
    C.bus.emit('gunshot', { pos, src:'explosion', loud:true });
  }
  /* an enemy shoots at the player: decides hit or miss, draws the tracer */
  enemyFire(from, acc, dmg, o){
    o = o || {};
    const C = this.C, cam = C.camera.position, P = C.player;
    const head = new THREE.Vector3(cam.x, cam.y - 0.2, cam.z);
    const chest = new THREE.Vector3(cam.x, cam.y - 0.55, cam.z);
    /* can it see any of you? */
    const seeHead = los(C.collide, from.x, from.y, from.z, head.x, head.y, head.z);
    const seeChest = seeHead || los(C.collide, from.x, from.y, from.z, chest.x, chest.y, chest.z);
    let target = seeChest && !seeHead ? chest : head;
    const hitRoll = (seeHead || seeChest) && Math.random() < acc;
    const dist = from.distanceTo(target);
    let aim;
    if(hitRoll){ aim = target.clone().add(new THREE.Vector3((Math.random() - 0.5)*0.3, (Math.random() - 0.5)*0.3, (Math.random() - 0.5)*0.3)); }
    else {
      const miss = 0.5 + Math.random()*1.4 + dist*0.03;
      const side = new THREE.Vector3().subVectors(target, from).cross(new THREE.Vector3(0, 1, 0)).normalize();
      aim = target.clone().addScaledVector(side, (Math.random() < 0.5 ? -1 : 1)*miss).add(new THREE.Vector3(0, (Math.random() - 0.4)*miss, 0));
    }
    const dir = aim.clone().sub(from).normalize();
    const pellets = o.pellets || 1;
    for(let i=0;i<pellets;i++){
      const dd = pellets > 1 ? dir.clone().add(new THREE.Vector3((Math.random() - 0.5)*0.12, (Math.random() - 0.5)*0.12, (Math.random() - 0.5)*0.12)).normalize() : dir;
      const h = this.cast(from, dd, 80, { skip:o.self, filter:o.filter });
      const end = h ? h.point : from.clone().addScaledVector(dd, 80);
      if(i === 0 || Math.random() < 0.3) C.gore.tracer(from, end, { speed:220, thick:0.8 });
      /* close call: the crack of a bullet going past your head */
      const toCam = cam.clone().sub(from), along = toCam.dot(dd);
      if(along > 0){ const closest = from.clone().addScaledVector(dd, along); const miss = closest.distanceTo(cam); if(miss < 1.8 && (!h || h.t > along - 0.2) && !hitRoll) C.audio.heist && C.audio.heist.whiz(closest); }
      if(h && h.world){ _n.set(h.n[0], h.n[1], h.n[2]); C.gore.impact(h.point, _n, h.surface); if(Math.random() < 0.5) C.audio.heist && C.audio.heist.hit(h.surface === 'metal' ? 'metal' : h.surface === 'wood' ? 'wood' : h.surface === 'glass' ? 'glass' : 'other', h.point); }
      else if(h && h.target && h.target.kind !== 'player'){ h.target.hit({ dmg:(o.friendly ? dmg*0.5 : dmg), point:h.point, n:h.n, dir:dd.clone(), part:h.part, weapon:o.weapon || 'pistol', knock:1, src:'enemy', dist:h.t }); }
    }
    if(hitRoll && (seeHead || seeChest)){ C.heist && C.heist.hurt(dmg*(pellets > 1 ? Math.min(pellets, 4)*0.5 : 1), from, o.weapon || 'gun'); }
    C.audio.heist && C.audio.heist.gun(o.sound || 'pistol', from, { vol:o.vol || 0.9 });
    C.bus.emit('gunshot', { pos:from, src:'enemy' });
  }
}
export { rayWorld, los, heightOf };
