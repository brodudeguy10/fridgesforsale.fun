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

/* binary min-heap on parallel typed-ish arrays; no tuple swaps, no garbage */
class Heap {
  constructor(){ this.a = []; this.s = []; this.n = 0; }
  reset(){ this.n = 0; }
  push(v, sc){ const a = this.a, S = this.s; let i = this.n++; while(i > 0){ const p = (i - 1) >> 1; if(S[p] <= sc) break; a[i] = a[p]; S[i] = S[p]; i = p; } a[i] = v; S[i] = sc; }
  pop(){ const a = this.a, S = this.s; const top = a[0]; const n = --this.n; if(n > 0){ const v = a[n], sc = S[n]; let i = 0; for(;;){ const l = 2*i + 1; if(l >= n) break; const r = l + 1; const m = r < n && S[r] < S[l] ? r : l; if(S[m] >= sc) break; a[i] = a[m]; S[i] = S[m]; i = m; } a[i] = v; S[i] = sc; } return top; }
  get size(){ return this.n; }
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
  /* the first build walks every cell. after that only the cells around
     colliders that switched on or off (or appeared) are redone: a gate
     blowing open used to cost a full rebuild, a visible hitch mid-fight. */
  build(){
    const col = this.col; col.build();
    const nx = this.nx, nz = this.nz;
    const sig = o=>(o.on ? 1 : 0) + ':' + (o.circle ? o.x + ',' + o.z + ',' + o.r + ',' + (o.rIn || 0) : o.minX + ',' + o.minZ + ',' + o.maxX + ',' + o.maxZ);
    const all = col.boxes.concat(col.circles);
    if(this.walk && this._sig){
      const regions = [];
      const fp = (o, sg)=>{ const q = sg.split(':')[1].split(',').map(Number); return o.circle ? [q[0] - q[2], q[1] - q[2], q[0] + q[2], q[1] + q[2]] : q; };
      const seen = new Set();
      for(const o of all){ seen.add(o); const sg = sig(o), old = this._sig.get(o); if(old === sg) continue; this._sig.set(o, sg); regions.push(fp(o, sg)); if(old) regions.push(fp(o, old)); }
      for(const [o, sg] of this._sig){ if(!seen.has(o)){ this._sig.delete(o); regions.push(fp(o, sg)); } }
      if(!regions.length) return;
      const m = this.r + 1.0;
      for(const [x0, z0, x1, z1] of regions){
        const i0 = Math.max(0, Math.floor((x0 - m - this.X0)/this.S)), i1 = Math.min(nx - 1, Math.ceil((x1 + m - this.X0)/this.S));
        const j0 = Math.max(0, Math.floor((z0 - m - this.Z0)/this.S)), j1 = Math.min(nz - 1, Math.ceil((z1 + m - this.Z0)/this.S));
        this.cells(i0, i1, j0, j1);
      }
      return;
    }
    this.walk = new Uint8Array(nx*nz);
    this.cover = new Uint8Array(nx*nz);
    this._sig = new Map(); for(const o of all) this._sig.set(o, sig(o));
    this.cells(0, nx - 1, 0, nz - 1);
  }
  cells(i0, i1, j0, j1){
    const col = this.col, nx = this.nx, nz = this.nz;
    const p = { x:0, z:0 };
    for(let j=j0;j<=j1;j++) for(let i=i0;i<=i1;i++){
      const x = this.X0 + i*this.S, z = this.Z0 + j*this.S, k = j*nx + i;
      this.walk[k] = 0;
      if(this.forbid(x, z)) continue;
      p.x = x; p.z = z; col.resolve(p, this.r);
      if(Math.abs(p.x - x) < 0.01 && Math.abs(p.z - z) < 0.01) this.walk[k] = 1;
    }
    /* cover: walkable cells right next to something waist-high or taller */
    const buf = this._buf || (this._buf = []);
    for(let j=Math.max(1, j0);j<=Math.min(nz - 2, j1);j++) for(let i=Math.max(1, i0);i<=Math.min(nx - 2, i1);i++){
      const k = j*nx + i;
      if(!this.walk[k]){ this.cover[k] = 0; continue; }
      const x = this.X0 + i*this.S, z = this.Z0 + j*this.S;
      let best = 0;
      const near = col.gather ? col.gather(x, z, buf) : col.near(x, z);
      for(const o of near){
        if(!o.on) continue; const h = heightOf(o); if(h < 0.85) continue;
        let d;
        if(o.circle && !o.ring) d = Math.hypot(x - o.x, z - o.z) - o.r;
        else if(o.ring){ const dd = Math.hypot(x - o.x, z - o.z); d = Math.max(dd - o.r, o.rIn - dd); }
        else { const cx = Math.max(o.minX, Math.min(x, o.maxX)), cz = Math.max(o.minZ, Math.min(z, o.maxZ)); d = Math.hypot(x - cx, z - cz); }
        if(d < 0.85) best = Math.max(best, h >= 1.7 ? 2 : 1);
      }
      this.cover[k] = best;
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
  /* A*. returns world-space waypoints, string-pulled. scratch arrays are
     reused between calls and "cleared" by bumping a stamp. */
  path(fx, fz, tx, tz, maxIter){
    if(!this.walk) return null;
    const a = this.nearest(fx, fz), b = this.nearest(tx, tz); if(!a || !b) return null;
    const nx = this.nx, N = nx*this.nz;
    if(!this._g || this._g.length !== N){ this._g = new Float32Array(N); this._came = new Int32Array(N); this._seen = new Uint32Array(N); this._done = new Uint32Array(N); this._stamp = 0; this._heap = new Heap(); }
    const G = this._g, came = this._came, seen = this._seen, done = this._done;
    const st = ++this._stamp; if(st > 4e9){ seen.fill(0); done.fill(0); this._stamp = 1; }
    const bi = b[0], bj = b[1];
    const h = (i, j)=>{ const dx = Math.abs(i - bi), dz = Math.abs(j - bj); return dx > dz ? dx + 0.414*dz : dz + 0.414*dx; };
    const open = this._heap; open.reset();
    const ka = a[1]*nx + a[0], kb = bj*nx + bi;
    G[ka] = 0; came[ka] = -1; seen[ka] = this._stamp; open.push(ka, h(a[0], a[1]));
    const S = this._stamp, walk = this.walk, nz = this.nz;
    let it = 0; const lim = maxIter || 9000;
    while(open.size && it++ < lim){
      const k = open.pop(); if(done[k] === S) continue; done[k] = S;
      if(k === kb){ const out = []; let c = k; while(c >= 0){ out.push(this.pos(c % nx, (c/nx)|0)); c = came[c]; } out.reverse(); return this.smooth(out); }
      const ci = k % nx, cj = (k/nx)|0, gk = G[k];
      for(let dj=-1; dj<=1; dj++){
        const nj = cj + dj; if(nj < 0 || nj >= nz) continue;
        for(let di=-1; di<=1; di++){
          if(!di && !dj) continue; const ni = ci + di; if(ni < 0 || ni >= nx) continue;
          const nk = nj*nx + ni; if(walk[nk] !== 1 || done[nk] === S) continue;
          if(di && dj && (walk[cj*nx + ni] !== 1 || walk[nj*nx + ci] !== 1)) continue;
          const ng = gk + (di && dj ? 1.414 : 1);
          if(seen[nk] === S && G[nk] <= ng) continue;
          seen[nk] = S; G[nk] = ng; came[nk] = k; open.push(nk, ng + h(ni, nj));
        }
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
  /* the segment's bounding box: most colliders are nowhere near a short ray */
  const ex = ox + dx*best, ez = oz + dz*best;
  const sx0 = Math.min(ox, ex), sx1 = Math.max(ox, ex), sz0 = Math.min(oz, ez), sz1 = Math.max(oz, ez);
  const ix = Math.abs(dx) < 1e-9 ? 0 : 1/dx, iy = Math.abs(dy) < 1e-9 ? 0 : 1/dy, iz = Math.abs(dz) < 1e-9 ? 0 : 1/dz;
  for(const o of col.boxes){
    if(!o.on || o === skip) continue;
    if(o.maxX < sx0 || o.minX > sx1 || o.maxZ < sz0 || o.minZ > sz1) continue;
    const H = heightOf(o); if(H <= 0) continue;
    /* slab test, unrolled */
    let t0 = 0, t1 = best, nAxis = -1, nSign = 0, ta, tb, sg;
    if(ix === 0){ if(ox < o.minX || ox > o.maxX) continue; }
    else { ta = (o.minX - ox)*ix; tb = (o.maxX - ox)*ix; sg = -1; if(ta > tb){ const q = ta; ta = tb; tb = q; sg = 1; } if(ta > t0){ t0 = ta; nAxis = 0; nSign = sg; } if(tb < t1) t1 = tb; if(t0 > t1) continue; }
    if(iy === 0){ if(oy < 0 || oy > H) continue; }
    else { ta = (0 - oy)*iy; tb = (H - oy)*iy; sg = -1; if(ta > tb){ const q = ta; ta = tb; tb = q; sg = 1; } if(ta > t0){ t0 = ta; nAxis = 1; nSign = sg; } if(tb < t1) t1 = tb; if(t0 > t1) continue; }
    if(iz === 0){ if(oz < o.minZ || oz > o.maxZ) continue; }
    else { ta = (o.minZ - oz)*iz; tb = (o.maxZ - oz)*iz; sg = -1; if(ta > tb){ const q = ta; ta = tb; tb = q; sg = 1; } if(ta > t0){ t0 = ta; nAxis = 2; nSign = sg; } if(tb < t1) t1 = tb; if(t0 > t1) continue; }
    if(nAxis < 0 || t0 <= 1e-4 || t0 >= best) continue;
    best = t0;
    hit = { t:t0, nx:nAxis === 0 ? nSign : 0, ny:nAxis === 1 ? nSign : 0, nz:nAxis === 2 ? nSign : 0, obj:o };
  }
  for(const o of col.circles){
    if(!o.on || o === skip) continue;
    if(o.x + o.r < sx0 || o.x - o.r > sx1 || o.z + o.r < sz0 || o.z - o.r > sz1) continue;
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
