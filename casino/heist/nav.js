/* ============================================================
   FRIDGE PALACE HEIST: navigation for people who want you dead
   a half-meter grid built from the same colliders you bump into,
   A* with a binary heap, string-pulling, cover cells, and a
   line-of-sight test against colliders that know how tall they are.
============================================================ */

/* how tall each kind of collider is, for bullets and eyes */
export const HEIGHT = {
  wall:6.5, column:6.5, door:3.3, cage:6.5, counter:1.15, gate:2.6, shelf:2.1, vaultdoor:2.7,
  slotbank:2.25, slot:1.9, table:0.95, poker:0.95, bar:1.12, barinside:6.5, wheel:4.4, podium:1.0,
  plant:1.6, couch:0.95, terminal:1.15, desk:0.82, lockers:2.0, rope:1.0, staffdoor:2.4,
  bouncer:2.0, boss:1.8, vault:3.2, crate:1.1, scaffold:0.0, detector:2.3, debris:0.7, tape:0.0
};
export const heightOf = o=>o.h !== undefined ? o.h : (HEIGHT[o.tag] !== undefined ? HEIGHT[o.tag] : 1.2);

class Heap {
  constructor(){ this.a = []; this.s = []; }
  push(v, s){ const a = this.a, sc = this.s; a.push(v); sc.push(s); let i = a.length - 1; while(i > 0){ const p = (i - 1) >> 1; if(sc[p] <= sc[i]) break; [a[p], a[i]] = [a[i], a[p]]; [sc[p], sc[i]] = [sc[i], sc[p]]; i = p; } }
  pop(){ const a = this.a, sc = this.s; const top = a[0]; const lv = a.pop(), ls = sc.pop(); if(a.length){ a[0] = lv; sc[0] = ls; let i = 0; for(;;){ const l = 2*i + 1, r = l + 1; let m = i; if(l < a.length && sc[l] < sc[m]) m = l; if(r < a.length && sc[r] < sc[m]) m = r; if(m === i) break; [a[m], a[i]] = [a[i], a[m]]; [sc[m], sc[i]] = [sc[i], sc[m]]; i = m; } } return top; }
  get size(){ return this.a.length; }
}

export class NavGrid {
  constructor(collide, o){
    o = o || {};
    this.col = collide;
    this.X0 = o.x0 !== undefined ? o.x0 : -29.75; this.X1 = o.x1 !== undefined ? o.x1 : 36.75;
    this.Z0 = o.z0 !== undefined ? o.z0 : -21.75; this.Z1 = o.z1 !== undefined ? o.z1 : 21.75;
    this.S = o.s || 0.5;
    this.nx = Math.round((this.X1 - this.X0)/this.S) + 1; this.nz = Math.round((this.Z1 - this.Z0)/this.S) + 1;
    this.r = o.r || 0.42;
    this.forbid = o.forbid || (()=>false);
    this.walk = null; this.cover = null;
  }
  build(){
    const col = this.col; col.build();
    const nx = this.nx, nz = this.nz;
    this.walk = new Uint8Array(nx*nz);
    this.cover = new Uint8Array(nx*nz);
    const p = { x:0, z:0 };
    for(let j=0;j<nz;j++) for(let i=0;i<nx;i++){
      const x = this.X0 + i*this.S, z = this.Z0 + j*this.S;
      if(this.forbid(x, z)) continue;
      p.x = x; p.z = z; col.resolve(p, this.r);
      if(Math.abs(p.x - x) < 0.01 && Math.abs(p.z - z) < 0.01) this.walk[j*nx + i] = 1;
    }
    /* cover: walkable cells right next to something waist-high or taller */
    for(let j=1;j<nz - 1;j++) for(let i=1;i<nx - 1;i++){
      if(!this.walk[j*nx + i]) continue;
      const x = this.X0 + i*this.S, z = this.Z0 + j*this.S;
      let best = 0;
      for(const o of col.near(x, z)){
        if(!o.on) continue; const h = heightOf(o); if(h < 0.85) continue;
        let d;
        if(o.circle && !o.ring) d = Math.hypot(x - o.x, z - o.z) - o.r;
        else if(o.ring){ const dd = Math.hypot(x - o.x, z - o.z); d = Math.max(dd - o.r, o.rIn - dd); }
        else { const cx = Math.max(o.minX, Math.min(x, o.maxX)), cz = Math.max(o.minZ, Math.min(z, o.maxZ)); d = Math.hypot(x - cx, z - cz); }
        if(d < 0.85) best = Math.max(best, h >= 1.7 ? 2 : 1);
      }
      this.cover[j*nx + i] = best;
    }
  }
  cellOf(x, z){ return [Math.round((x - this.X0)/this.S), Math.round((z - this.Z0)/this.S)]; }
  pos(i, j){ return [this.X0 + i*this.S, this.Z0 + j*this.S]; }
  ok(i, j){ return i >= 0 && j >= 0 && i < this.nx && j < this.nz && this.walk && this.walk[j*this.nx + i] === 1; }
  walkAt(x, z){ const [i, j] = this.cellOf(x, z); return this.ok(i, j); }
  coverAt(x, z){ const [i, j] = this.cellOf(x, z); return this.ok(i, j) ? this.cover[j*this.nx + i] : 0; }
  nearest(x, z, maxR){
    const [ci, cj] = this.cellOf(x, z);
    for(let r=0; r<(maxR || 10); r++) for(let dj=-r; dj<=r; dj++) for(let di=-r; di<=r; di++){
      if(Math.max(Math.abs(di), Math.abs(dj)) !== r) continue;
      if(this.ok(ci + di, cj + dj)) return [ci + di, cj + dj];
    }
    return null;
  }
  /* A*. returns world-space waypoints, string-pulled */
  path(fx, fz, tx, tz, maxIter){
    if(!this.walk) return null;
    const a = this.nearest(fx, fz), b = this.nearest(tx, tz); if(!a || !b) return null;
    const nx = this.nx, key = (i, j)=>j*nx + i;
    const g = new Map(), came = new Map(), closed = new Set();
    const h = (i, j)=>{ const dx = Math.abs(i - b[0]), dz = Math.abs(j - b[1]); return Math.max(dx, dz) + 0.414*Math.min(dx, dz); };
    const open = new Heap(); const ka = key(a[0], a[1]); g.set(ka, 0); open.push(ka, h(a[0], a[1]));
    const kb = key(b[0], b[1]); let it = 0, lim = maxIter || 9000;
    while(open.size && it++ < lim){
      const k = open.pop(); if(closed.has(k)) continue; closed.add(k);
      if(k === kb){ const out = []; let c = k; while(c !== undefined){ out.push(this.pos(c % nx, Math.floor(c/nx))); c = came.get(c); } out.reverse(); return this.smooth(out); }
      const ci = k % nx, cj = Math.floor(k/nx), gk = g.get(k);
      for(let dj=-1; dj<=1; dj++) for(let di=-1; di<=1; di++){
        if(!di && !dj) continue; const ni = ci + di, nj = cj + dj; if(!this.ok(ni, nj)) continue;
        if(di && dj && (!this.ok(ci + di, cj) || !this.ok(ci, cj + dj))) continue;
        const nk = key(ni, nj); if(closed.has(nk)) continue;
        const ng = gk + (di && dj ? 1.414 : 1);
        if(g.has(nk) && g.get(nk) <= ng) continue;
        g.set(nk, ng); came.set(nk, k); open.push(nk, ng + h(ni, nj));
      }
    }
    return null;
  }
  clearLine(ax, az, bx, bz){
    const d = Math.hypot(bx - ax, bz - az), n = Math.ceil(d/(this.S*0.5));
    for(let k=1;k<n;k++){ const [i, j] = this.cellOf(ax + (bx - ax)*k/n, az + (bz - az)*k/n); if(!this.ok(i, j)) return false; }
    return true;
  }
  smooth(pts){
    if(pts.length < 3) return pts;
    const out = [pts[0]]; let i = 0;
    while(i < pts.length - 1){ let j = pts.length - 1; while(j > i + 1 && !this.clearLine(pts[i][0], pts[i][1], pts[j][0], pts[j][1])) j--; out.push(pts[j]); i = j; }
    return out;
  }
}

/* ---------- rays against the world ----------
   colliders are 2D shapes on the floor plane. give each a height and
   they become boxes and cylinders a bullet can hit. returns the nearest
   hit {t, nx, ny, nz, obj} along origin + dir*t, t <= maxT */
export function rayWorld(col, ox, oy, oz, dx, dy, dz, maxT, skip){
  let best = maxT, hit = null;
  /* floor and ceiling */
  if(dy < -1e-6){ const t = -oy/dy; if(t > 0 && t < best){ best = t; hit = { t, nx:0, ny:1, nz:0, obj:null, surface:'floor' }; } }
  if(dy > 1e-6){ const ceil = (ox > 30.1 || (ox < -12 && oz < -14)) ? 3.4 : 6.5; const t = (ceil - oy)/dy; if(t > 0 && t < best){ best = t; hit = { t, nx:0, ny:-1, nz:0, obj:null, surface:'ceiling' }; } }
  for(const o of col.boxes){
    if(!o.on || o === skip) continue;
    const H = heightOf(o); if(H <= 0) continue;
    /* slab test */
    let t0 = 0, t1 = best, nAxis = -1, nSign = 0;
    const lo = [o.minX, 0, o.minZ], hi = [o.maxX, H, o.maxZ], org = [ox, oy, oz], dir = [dx, dy, dz];
    let ok = true;
    for(let a=0;a<3;a++){
      if(Math.abs(dir[a]) < 1e-9){ if(org[a] < lo[a] || org[a] > hi[a]){ ok = false; break; } continue; }
      let ta = (lo[a] - org[a])/dir[a], tb = (hi[a] - org[a])/dir[a], s = -1;
      if(ta > tb){ const tt = ta; ta = tb; tb = tt; s = 1; }
      if(ta > t0){ t0 = ta; nAxis = a; nSign = s; }
      if(tb < t1) t1 = tb;
      if(t0 > t1){ ok = false; break; }
    }
    if(!ok || nAxis < 0 || t0 <= 1e-4 || t0 >= best) continue;
    best = t0;
    hit = { t:t0, nx:nAxis === 0 ? nSign : 0, ny:nAxis === 1 ? nSign : 0, nz:nAxis === 2 ? nSign : 0, obj:o };
  }
  for(const o of col.circles){
    if(!o.on || o === skip) continue;
    const H = heightOf(o); if(H <= 0) continue;
    /* vertical cylinder (rings: the outer wall only; good enough for a bar counter) */
    const fx = ox - o.x, fz = oz - o.z;
    const A = dx*dx + dz*dz; if(A < 1e-9) continue;
    const Bq = 2*(fx*dx + fz*dz), Cq = fx*fx + fz*fz - o.r*o.r;
    const disc = Bq*Bq - 4*A*Cq; if(disc < 0) continue;
    const t = (-Bq - Math.sqrt(disc))/(2*A);
    if(t <= 1e-4 || t >= best) continue;
    const y = oy + dy*t; if(y < 0 || y > H) continue;
    const hx = fx + dx*t, hz = fz + dz*t, l = Math.hypot(hx, hz) || 1;
    best = t; hit = { t, nx:hx/l, ny:0, nz:hz/l, obj:o };
  }
  return hit;
}
/* can a point see another point? */
export function los(col, ax, ay, az, bx, by, bz){
  const dx = bx - ax, dy = by - ay, dz = bz - az, d = Math.hypot(dx, dy, dz);
  if(d < 1e-4) return true;
  const h = rayWorld(col, ax, ay, az, dx/d, dy/d, dz/d, d - 0.05);
  return !h;
}
