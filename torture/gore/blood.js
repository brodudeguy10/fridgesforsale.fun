/* ============================================================
   THE GUY, version three: blood.
   drops in flight fall and slow like drops do, and whatever they
   hit keeps them: the wall behind him (stains stretched in the
   direction they were going, tails pointing the way they came, the
   way bloodstain analysts read them), the floor (a pool that holds
   what he actually lost and spreads and darkens as it dries), the
   sides of the fridges (stains that ride on the fridge when it
   moves), and other guys' clothes.

   how it leaves him depends on how it was let out: a blunt hit
   squeezes it out sideways, a blade flicks it off along the swing,
   a bullet sprays the wall behind him, an artery pumps it out in
   time with his heart, and a slow cut just drips onto the floor.
   a bloody hand that touches a wall leaves a print. a bleeding
   part dragged along the floor leaves a smear.
============================================================ */
(function () {
'use strict';
const G = window.__G3; if (!G || !G.A) return;
const A = G.A, S = G.S, clamp = G.clamp, rnd = G.rnd;
const BL = G.blood = {};
const T = G.TUNE;
const COLS = ['#7a0606', '#8c0a0a', '#650404', '#9a1010', '#5a0303'];
const DUST = ['#b8a07a', '#a08860', '#c8b490', '#8a7450'];

/* ------------------------------------------------------------ the wall behind, the floor */
const dried = document.getElementById('driedBloodCanvas');
const dctx = dried ? dried.getContext('2d') : null;
try { G.render.options.background = 'transparent'; if (dried) dried.style.zIndex = '-1'; } catch (e) {}
const ov = document.getElementById('ragdollBloodCanvas'); if (ov) ov.getContext('2d').clearRect(0, 0, ov.width, ov.height);
/* the pool gets its own strip of canvas along the floor, behind the bodies like the wall stains */
const POOLH = 44;
const pool = document.createElement('canvas'); pool.id = 'gorePool';
pool.style.cssText = `position:fixed;left:0;bottom:0;width:100vw;height:${POOLH}px;z-index:-1;pointer-events:none;`;
document.body.appendChild(pool);
const pctx = pool.getContext('2d');
const CELL = 3;
let pv = new Float32Array(Math.ceil(G.W() / CELL) + 2), pa = new Float32Array(pv.length), pd = new Float32Array(pv.length), poolDirty = true;
function sizePool() {
  const n = Math.ceil(G.W() / CELL) + 2;
  if (n !== pv.length) { const v = new Float32Array(n), a = new Float32Array(n), d = new Float32Array(n); v.set(pv.subarray(0, Math.min(n, pv.length))); a.set(pa.subarray(0, Math.min(n, pa.length))); d.set(pd.subarray(0, Math.min(n, pd.length))); pv = v; pa = a; pd = d; }
  pool.width = G.W(); pool.height = POOLH; poolDirty = true;
}
sizePool(); window.addEventListener('resize', sizePool);
BL.poolAt = x => { const i = Math.floor(x / CELL); return i >= 0 && i < pv.length ? pv[i] : 0; };
function toPool(x, ml) { const i = Math.floor(x / CELL); if (i < 1 || i >= pv.length - 1) return; const tot = pv[i] + ml; pa[i] = tot > 0 ? (pa[i] * pv[i]) / tot : 0; pv[i] = tot; poolDirty = true; }

/* a stain on the wall: stretched by how fast and which way the drop was going */
BL.stamp = function (x, y, r, vx = 0, vy = 0, col, alpha = 0.85, floor = false) {
  if (!dctx) return;
  dctx.save(); dctx.globalAlpha = alpha; dctx.fillStyle = col || G.pick(COLS);
  const sp = Math.hypot(vx, vy); dctx.translate(x, y);
  if (floor) { dctx.beginPath(); dctx.ellipse(0, 0, r * (1.6 + sp * 0.2), r * 0.45, 0, 0, Math.PI * 2); dctx.fill(); }
  else {
    dctx.rotate(Math.atan2(vy, vx)); const el = 1 + sp * 0.22;
    dctx.beginPath(); dctx.ellipse(0, 0, r * el, r, 0, 0, Math.PI * 2); dctx.fill();
    /* the tail, on the side it was heading for, and the satellites flung off past it */
    if (sp > 2.5 && r > 1) { dctx.beginPath(); dctx.moveTo(r * el * 0.7, -r * 0.35); dctx.quadraticCurveTo(r * el * 1.9, 0, r * el * 0.7, r * 0.35); dctx.fill(); }
    if (r > 2 && Math.random() < 0.6) for (let i = 0, k = 2 + Math.floor(Math.random() * 4); i < k; i++) { dctx.beginPath(); dctx.arc(r * (1.2 + sp * 0.3) * Math.random() + r, (Math.random() - 0.5) * r * 2.4, r * rnd(0.15, 0.45), 0, Math.PI * 2); dctx.fill(); }
  }
  dctx.restore();
};
/* where the back wall stops (a room with a floor you see in depth), a stain below that line is on the floor */
function stampAt(x, y, r, svx, svy, col, alpha) {
  if (T.wallBase && y > T.wallBase) { BL.stamp(x, Math.min(y, G.floorY() + 20), r, svx, 0, col, alpha, true); return false; }
  BL.stamp(x, y, r, svx, svy, col, alpha); return true;
}
BL.splat = function (x, y, r, col, n = 26) {
  for (let i = 0; i < n; i++) { const a = Math.random() * Math.PI * 2, d = Math.random() ** 0.7 * r; stampAt(x + Math.cos(a) * d, y + Math.sin(a) * d, rnd(1.5, 5) * (1 - d / r * 0.6), Math.cos(a) * 3, Math.sin(a) * 3, col); }
  stampAt(x, y, r * 0.35, 0, 0, col, 0.9);
  for (let i = 0; i < 8; i++) { const dx = x + rnd(-r, r) * 0.7, dy = y + rnd(-r, r) * 0.4; if (!(T.wallBase && dy > T.wallBase - 3)) drip(dx, dy, rnd(1.2, 2.6), col); }
};
/* a burst on the wall behind, in a cone: what comes out of his back */
BL.exitSpray = function (x, y, dx, dy, r) {
  const a0 = Math.atan2(dy, dx);
  for (let i = 0; i < 34; i++) { const a = a0 + rnd(-0.7, 0.7), d = Math.random() ** 0.6 * r; stampAt(x + Math.cos(a) * d, y + Math.sin(a) * d, rnd(0.8, 3.4) * (1 - d / r * 0.5), Math.cos(a) * 6, Math.sin(a) * 6); }
  stampAt(x, y, r * 0.18, 0, 0, null, 0.9);
  for (let i = 0; i < 5; i++) { const dx = x + rnd(-r, r) * 0.4, dy = y + rnd(-r, r) * 0.3; if (!(T.wallBase && dy > T.wallBase - 3)) drip(dx, dy, rnd(1.2, 2.2)); }
};
/* drops that run down the wall */
const drips = [];
function drip(x, y, w, col) { if (drips.length < 110) drips.push({ x, y, w, v: rnd(0.25, 0.8), left: rnd(25, 160), c: col || G.pick(COLS) }); }
BL.drip = drip;

/* ------------------------------------------------------------ drops in the air: flat arrays, no garbage */
const N = T.maxParticles;
const px = new Float32Array(N), py = new Float32Array(N), vx = new Float32Array(N), vy = new Float32Array(N), pr = new Float32Array(N), life = new Float32Array(N), vol = new Float32Array(N), wall = new Float32Array(N);
const col = new Uint8Array(N), dust = new Uint8Array(N), owner = new Int32Array(N), born = new Float32Array(N);
let n = 0;
BL.count = () => n;
function add(x, y, dvx, dvy, r, l, ml, g, w) {
  if (n >= N) { /* full: the oldest drop goes on the wall where it is */ kill(0, true); }
  const i = n++;
  px[i] = x; py[i] = y; vx[i] = dvx; vy[i] = dvy; pr[i] = r; life[i] = l; vol[i] = ml; wall[i] = w || 0;
  col[i] = Math.floor(Math.random() * COLS.length); dust[i] = g && g.dusty ? 1 : 0; owner[i] = g ? g.id : 0; born[i] = G.t;
}
function kill(i, stamp) {
  if (stamp && !dust[i]) { if (T.wallBase && py[i] > T.wallBase) floorStain(i); else BL.stamp(px[i], py[i], pr[i], vx[i], vy[i], COLS[col[i]], 0.75); }
  const j = --n;
  if (i !== j) { px[i] = px[j]; py[i] = py[j]; vx[i] = vx[j]; vy[i] = vy[j]; pr[i] = pr[j]; life[i] = life[j]; vol[i] = vol[j]; wall[i] = wall[j]; col[i] = col[j]; dust[i] = dust[j]; owner[i] = owner[j]; born[i] = born[j]; }
}
/* a room drawn in depth (the torture room: T.wallBase is where the back wall meets the floor): a drop that comes
   down below that line was over the floor, not the wall, and lands on it somewhere between the wall and where it
   fell, flattened by the angle you see the floor at. the fridge page has no wallBase and never gets here */
function floorStain(i) {
  const Hh = G.floorY(), back = wall[i] > 0, y = back ? rnd(T.wallBase + 1.5, Hh - 1) : clamp(Hh + rnd(-5, 7), T.wallBase + 1.5, Hh + 20);
  BL.stamp(px[i], y, pr[i] * 1.15, vx[i], 0, COLS[col[i]], 0.8, true);
}
/* a spray: n drops around a direction */
BL.spray = function (x, y, dx, dy, count, speed, spread, size, g, opt = {}) {
  const a0 = Math.atan2(dy, dx), base = opt.vel || { x: 0, y: 0 };
  if (T.sprayAll != null && T.sprayAll !== 1) count = Math.max(1, Math.round(count * T.sprayAll));   /* a page's blood-detail setting */
  for (let k = 0; k < count; k++) {
    const a = a0 + (Math.random() - 0.5) * spread, v = speed * rnd(0.35, 1.15);
    add(x, y, Math.cos(a) * v + base.x + rnd(-0.3, 0.3), Math.sin(a) * v + base.y + rnd(-0.3, 0.3), size * rnd(0.5, 1.3), rnd(40, 110), opt.ml || 0.6, g, opt.wall ? rnd(opt.wall * 0.5, opt.wall * 1.5) : 0);
  }
};
BL.dustPuff = (x, y, nn, g) => { for (let k = 0; k < nn; k++) add(x, y, rnd(-1.5, 1.5), rnd(-2, 0.5), rnd(0.8, 2), rnd(30, 60), 0, g || { dusty: true, id: 0 }, 0); };

/* ------------------------------------------------------------ how it leaves him */
G.on('hurt', (g, p, h, R, inj, ev) => {
  if (!ev || g.dusty) { if (g.dusty && h.E > 5) BL.dustPuff(h.wx || p.body.position.x, h.wy || p.body.position.y, Math.round(clamp(h.E || 20, 5, 40)), g); return; }
  const wx = h.wx != null ? h.wx : p.body.position.x, wy = h.wy != null ? h.wy : p.body.position.y;
  const opened = (inj || []).some(i => i.tissue !== 'soft' && i.tissue !== 'joint') && R.skin < 1;
  const k = ev.post ? 0.25 : 1;
  if (ev.kind === 'impact') {
    if (!opened && h.E < 40) return;
    /* squeezed out sideways from where it landed, more the harder it hit */
    const nn = Math.round(clamp(h.E * 0.6, 4, 60) * k), nx = h.n ? h.n.x : 0, ny = h.n ? h.n.y : -1;
    BL.spray(wx, wy, -ny, nx, nn / 2, 2.5 + Math.sqrt(h.E) * 0.4, 1.0, 1.6, g, { vel: { x: p.body.velocity.x * 0.4, y: p.body.velocity.y * 0.4 } });
    BL.spray(wx, wy, ny, -nx, nn / 2, 2.5 + Math.sqrt(h.E) * 0.4, 1.0, 1.6, g, { vel: { x: p.body.velocity.x * 0.4, y: p.body.velocity.y * 0.4 } });
    if (h.E > 30) BL.spray(wx, wy, nx, ny, nn / 3, 1.5 + Math.sqrt(h.E) * 0.3, 1.6, 2.0, g, { wall: 5 });
    if (h.srcKind === 'wall' || h.srcKind === 'floor' || h.srcKind === 'ceiling') { stampAt(wx, wy, clamp(h.E * 0.08, 1.5, 7), p.body.velocity.x, p.body.velocity.y); if (h.E > 25 && h.srcKind === 'wall') BL.splat(wx, wy, clamp(h.E * 0.4, 10, 40) * S / 1.9); }
    if (h.srcKind === 'fridge' && h.E > 6) BL.onFridge(findBody(h, p), wx, wy, clamp(h.E * 0.1, 2, 9), true);
  } else if (ev.kind === 'cut') {
    /* the blade flicks it off along the swing (a chainsaw bites many times a second, so it asks for less each time) */
    const sk = h.sprayK == null ? 1 : h.sprayK;
    BL.spray(wx, wy, h.dir.x, h.dir.y, Math.round((10 + ev.depth * 6) * sk), 3.5 + ev.depth, 0.6, 1.4, g, { wall: 9 });
    BL.spray(wx, wy, -h.dir.y, h.dir.x, Math.round((6 + ev.depth * 2) * sk), 2, 1.4, 1.3, g);
  } else if (ev.kind === 'shot' && ev.exit === false) {
    /* in and not out (a nail, a staple, a spike, a pellet that stopped): what comes back out of the hole */
    BL.spray(wx, wy, 0, -1, Math.round(6 + 8 * (ev.k || 1)), 2.2, Math.PI * 2, 0.9 + 0.3 * (ev.k || 1), g);
  } else if (ev.kind === 'shot') {
    const sk = ev.k || 1;
    BL.exitSpray(wx + rnd(-4, 4), wy + rnd(-4, 4), h.dir.x, h.dir.y, (p.kind === 'head' ? 34 : 20) * S / 1.9 * Math.sqrt(sk));
    BL.spray(wx, wy, h.dir.x, h.dir.y, Math.round(40 * Math.min(1.6, sk)), 9, 1.1, 1.8, g, { wall: 4 });
    BL.spray(wx, wy, 0, -1, 10, 2.5, Math.PI * 2, 0.9, g);              /* the mist that comes back out of the entry */
  } else if (ev.kind === 'blast') {
    BL.spray(wx, wy, h.dir.x, h.dir.y, Math.round(20 * h.k), 6 + 6 * h.k, 2.6, 2, g, { wall: 6 });
  } else if (ev.kind === 'crush') {
    BL.spray(wx, wy, -1, 0, 18, 3.5, 0.9, 1.8, g); BL.spray(wx, wy, 1, 0, 18, 3.5, 0.9, 1.8, g);
  }
});
function findBody(h, p) { for (const c of p.contacts) if (c.other.plugin && c.other.plugin.fv) return c.other; let best = null, bd = 1e9; for (const f of G.fridges()) { const d = Math.hypot(f.position.x - h.wx, f.position.y - h.wy); if (d < bd) { bd = d; best = f; } } return bd < 200 ? best : null; }
G.on('torn', (g, j, out) => {
  if (g.dusty) { BL.dustPuff((out.wa.x + out.wb.x) / 2, (out.wa.y + out.wb.y) / 2, 30, g); return; }
  const v = { x: out.wa.x - out.wb.x, y: out.wa.y - out.wb.y }, d = Math.hypot(v.x, v.y) || 1, mx = (out.wa.x + out.wb.x) / 2, my = (out.wa.y + out.wb.y) / 2;
  BL.spray(mx, my, -v.y / d, v.x / d, 55, 6, Math.PI * 2, 2.2, g);
  BL.splat(mx, my, 18 * S);
});
G.on('artery', (g, p, a) => { const w = G.toWorld(p.body, a.lx, a.ly); BL.spray(w.x, w.y, 0, -1, 30, 7, 0.8, 1.8, g, { wall: 7 }); });
G.on('ooze', (g, x, y) => { if (!g.dusty) BL.spray(x, y, 0, 1, 2, 1.5, Math.PI * 2, 1.2, g); });
G.on('headGone', (g, why) => {
  const h = g.parts.head, p = h.body.position, v = h.body.velocity;
  if (g.dusty) { BL.dustPuff(p.x, p.y, 80, g); return; }
  BL.spray(p.x, p.y, v.x, v.y - 1, 180, 10, Math.PI * 2, 2.6, g, { wall: 5 }); BL.splat(p.x, p.y, 46 * S);
});

/* ------------------------------------------------------------ stains on the fridges, in the fridge's own frame */
BL.onFridge = function (f, x, y, r, smear) {
  if (!f) return;
  const l = G.toLocal(f, x, y), pl = f.plugin = f.plugin || {};
  const list = pl.gore = pl.gore || [];
  list.push({ x: l.x, y: l.y, r, a: Math.random() * 6.28, c: G.pick(COLS), s: smear ? 1 : 0, seed: Math.random() });
  if (list.length > 32) list.splice(0, list.length - 32);
  pl.goreDirty = true;
};
/* drawn with the fridge, so they go where it goes. each bloodied fridge keeps its stains painted on a small canvas
   of its own, repainted only when a new one lands, so a hundred and fifty bloody fridges cost a hundred and fifty
   images a frame instead of thousands of little shapes */
function paintStains(ctx, list) {
  for (const s of list) {
    ctx.globalAlpha = 0.82; ctx.fillStyle = s.c;
    if (s.hand) { drawPrint(ctx, s.x, s.y, s.r, s.a, s.foot); continue; }
    ctx.beginPath(); ctx.ellipse(s.x, s.y, s.r * (s.s ? 1.9 : 1), s.r * (s.s ? 0.6 : 1), s.a, 0, Math.PI * 2); ctx.fill();
    if (!s.s && s.r > 2.5) { const R = G.srand(s.seed); for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.arc(s.x + (R() - 0.5) * s.r * 3, s.y + (R() - 0.5) * s.r * 3, s.r * 0.25, 0, 6.3); ctx.fill(); } }
  }
  ctx.globalAlpha = 1;
}
BL.drawFridges = function (ctx) {
  for (const f of G.fridges()) {
    const pl = f.plugin, list = pl && pl.gore; if (!list || !list.length) continue;
    if (!pl.goreBox) {
      let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
      for (const v of f.vertices) { const l = G.toLocal(f, v.x, v.y); x0 = Math.min(x0, l.x); y0 = Math.min(y0, l.y); x1 = Math.max(x1, l.x); y1 = Math.max(y1, l.y); }
      const m = 10 * S; pl.goreBox = { x: Math.floor(x0 - m), y: Math.floor(y0 - m), w: Math.ceil(x1 - x0 + 2 * m), h: Math.ceil(y1 - y0 + 2 * m) };
    }
    const bx = pl.goreBox;
    if (!pl.goreCv || pl.goreDirty) {
      if (!pl.goreCv) { pl.goreCv = document.createElement('canvas'); pl.goreCv.width = bx.w; pl.goreCv.height = bx.h; pl.goreCv.getContext('2d', { willReadFrequently: true }); }
      const c = pl.goreCv.getContext('2d'); c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, bx.w, bx.h); c.translate(-bx.x, -bx.y);
      paintStains(c, list); pl.goreDirty = false;
    }
    ctx.save(); ctx.translate(f.position.x, f.position.y); ctx.rotate(f.angle); ctx.drawImage(pl.goreCv, bx.x, bx.y); ctx.restore();
  }
};
function drawPrint(ctx, x, y, r, a, foot) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(a);
  if (foot) { ctx.beginPath(); ctx.ellipse(0, 0, r * 0.45, r, 0, 0, 6.3); ctx.fill(); }
  else { ctx.beginPath(); ctx.ellipse(0, r * 0.25, r * 0.5, r * 0.55, 0, 0, 6.3); ctx.fill(); for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.ellipse((-0.36 + i * 0.24) * r, -r * 0.55, r * 0.1, r * 0.33, 0, 0, 6.3); ctx.fill(); } ctx.beginPath(); ctx.ellipse(r * 0.6, 0, r * 0.12, r * 0.3, 0.8, 0, 6.3); ctx.fill(); }
  ctx.restore();
}
BL.print = function (x, y, r, a, foot) { if (!dctx) return; dctx.save(); dctx.globalAlpha = 0.7; dctx.fillStyle = G.pick(COLS); drawPrint(dctx, x, y, r, a, foot); dctx.restore(); };

/* ------------------------------------------------------------ every step */
let grid = null, gridT = -1;
function fridgeGrid() {
  const fr = G.fridges(); grid = new Map();
  for (const f of fr) { const b = f.bounds; for (let gx = Math.floor(b.min.x / 96); gx <= Math.floor(b.max.x / 96); gx++) for (let gy = Math.floor(b.min.y / 96); gy <= Math.floor(b.max.y / 96); gy++) { const k = gx * 1000 + gy; let a = grid.get(k); if (!a) grid.set(k, a = []); a.push(f); } }
}
function inBody(b, x, y) { if (x < b.bounds.min.x || x > b.bounds.max.x || y < b.bounds.min.y || y > b.bounds.max.y) return false; return G.M.Vertices.contains(b.vertices, { x, y }); }
BL.step = function (h) {
  const W = G.W(), Hh = G.floorY(), grav = 0.26 * (h / G.STEP) * (h / G.STEP) * 0 + 0.26;
  if (G.t - gridT > 0.05) { fridgeGrid(); gridT = G.t; }
  const guysNow = G.guys.filter(g => !g.cleared);
  for (let i = n - 1; i >= 0; i--) {
    const d = dust[i];
    vy[i] += d ? 0.12 : grav; vx[i] *= d ? 0.96 : 0.99; vy[i] *= d ? 0.96 : 0.995;
    px[i] += vx[i]; py[i] += vy[i]; life[i]--;
    /* some drops are heading for the wall behind him: they get there */
    if (wall[i] > 0) { wall[i]--; if (wall[i] <= 0) { kill(i, true); continue; } }
    if (py[i] >= Hh - 1) { if (!d) { if (T.wallBase) floorStain(i); else BL.stamp(px[i], Hh - 1.5, pr[i] * 1.2, vx[i], 0, COLS[col[i]], 0.8, true); toPool(px[i], vol[i] + 0.15); if (pr[i] > 1.6 && Math.random() < 0.04) G.emit('sfx', 'drop', { x: px[i], k: pr[i] / 3 }); } kill(i, false); continue; }
    if (px[i] <= 1 || px[i] >= W - 1 || py[i] <= 1) { if (!d) { BL.stamp(clamp(px[i], 1, W - 1), Math.max(1, py[i]), pr[i] * 1.3, vx[i], vy[i], COLS[col[i]]); if (pr[i] > 1.7 && Math.random() < 0.3 && !(T.wallBase && py[i] > T.wallBase - 3)) drip(clamp(px[i], 2, W - 2), py[i], pr[i] * 0.7, COLS[col[i]]); } kill(i, false); continue; }
    if (life[i] <= 0) { const onWall = !(T.wallBase && py[i] > T.wallBase - 3); kill(i, !d); if (!d && onWall && pr[i] > 2 && Math.random() < 0.12) drip(px[i], py[i], pr[i] * 0.55); continue; }
    if (d) continue;
    /* a fridge in the way */
    const cell = grid.get(Math.floor(px[i] / 96) * 1000 + Math.floor(py[i] / 96));
    if (cell) { let hit = null; for (const f of cell) if (inBody(f, px[i], py[i])) { hit = f; break; } if (hit) { BL.onFridge(hit, px[i], py[i], pr[i] * 1.1); kill(i, false); continue; } }
    /* somebody in the way: it lands on his clothes */
    if (G.flesh && (i & 3) === (Math.floor(G.t * 60) & 3)) {
      for (const g of guysNow) {
        if (g.id === owner[i] && G.t - born[i] < 0.12) continue;
        let landed = false;
        for (const p of g.list) { if (p.gone || p.removed || !p.tex) continue; if (inBody(p.body, px[i], py[i])) { G.flesh.splash(p, px[i], py[i], pr[i] * 1.1, COLS[col[i]]); landed = true; break; } }
        if (landed) { kill(i, false); break; }
      }
    }
  }
  /* running drops on the wall */
  if (dctx) for (let i = drips.length - 1; i >= 0; i--) {
    const d = drips[i]; dctx.strokeStyle = d.c; dctx.lineWidth = d.w; dctx.lineCap = 'round'; dctx.globalAlpha = 0.8;
    dctx.beginPath(); dctx.moveTo(d.x, d.y); d.y += d.v; d.x += rnd(-0.08, 0.08); dctx.lineTo(d.x, d.y); dctx.stroke(); dctx.globalAlpha = 1;
    d.left -= d.v; d.v *= 0.997; d.w *= 0.998;
    const foot = T.wallBase ? T.wallBase - 0.5 : Hh - 2;
    if (d.left <= 0 || d.y >= foot || d.v < 0.05) { dctx.fillStyle = d.c; dctx.beginPath(); dctx.arc(d.x, d.y, d.w * 0.9, 0, Math.PI * 2); dctx.fill(); drips.splice(i, 1); if (d.y >= foot && !T.wallBase) toPool(d.x, 0.4); }
  }
  for (const g of guysNow) bleedOut(g, h);
  /* the pool creeps outward and dries from the edges in */
  poolTick++;
  if (poolTick % 6 === 0) spread(h * 6);
};
let poolTick = 0;
function spread(dt) {
  const L = pv.length; let any = false;
  for (let i = 1; i < L - 1; i++) {
    if (pv[i] <= 0.001 && pv[i - 1] <= 0.001 && pv[i + 1] <= 0.001) continue;
    any = true;
    const flow = (pv[i] - pv[i + 1]) * 0.08 * (pv[i] > 1.5 || pv[i + 1] > 1.5 ? 1 : 0.2);
    if (flow > 0 ? pv[i] > 0.6 : pv[i + 1] > 0.6) { pv[i] -= flow; pv[i + 1] += flow; }
    pa[i] += dt;
  }
  if (any) poolDirty = true;
}
/* the open places on him: an artery pumps on the beat, a wound runs, a stump spurts until he's empty */
function bleedOut(g, h) {
  if (g.dusty || !g.dm) return;
  const dm = g.dm, alive = g.alive, pressure = clamp(dm.blood / T.bloodMl, 0, 1) * (alive ? 1 : 0.12);
  for (const p of g.list) {
    if (p.gone || p.removed || !p.tex) continue;
    const t = p.tex, b = p.body;
    /* stumps */
    for (const e of t.ends) {
      const age = G.t - e.t, mine = p.attached && e.side === 'a';
      const k = mine ? 1 : Math.max(0, 1 - age / 6);
      if (k <= 0) continue;
      const at = G.toWorld(b, e.x, e.y), nd = Math.hypot(e.nx, e.ny) || 1, nw = G.dirWorld(b, e.nx / nd, e.ny / nd);
      const art = (A.jointById[e.joint] || { art: 0.5 }).art * (mine ? 1 : 0.35);
      const jet = art * pressure * dm.pulse * (alive ? 1 : 0.4);
      if (jet > 0.08 && G.t - (e.lastJet || 0) > 0.03) { e.lastJet = G.t; const nn = Math.ceil(jet * 3); for (let i = 0; i < nn; i++) { const sp = 2 + 9 * jet * rnd(0.7, 1.1); add(at.x, at.y, nw.x * sp + b.velocity.x + rnd(-0.6, 0.6), nw.y * sp + b.velocity.y + rnd(-0.6, 0.6), rnd(1.1, 2.3), rnd(50, 110), 1.6, g, 0); } if (dm.pulse > 0.95 && jet > 0.5 && Math.random() < 0.3) G.emit('sfx', 'spurt', { x: at.x, k: jet }); }
      else if (Math.random() < 0.25 * k * (0.3 + pressure)) add(at.x, at.y, b.velocity.x + rnd(-0.3, 0.3), b.velocity.y + rnd(0, 0.6), rnd(0.9, 1.9), rnd(30, 80), 1.2, g, 0);
    }
    /* open wounds: drops in proportion to what they're losing */
    if (!t.openings.length) continue;
    const reg = dm.regions[A.regionAt(p.id, 0, 0)];
    const rate = reg ? reg.bleed * (0.25 + 0.75 * pressure) : 0;
    if (rate <= 0.02) continue;
    const want = rate * h / 1.4;
    if (Math.random() < want) {
      const o = G.pick(t.openings), at = G.toWorld(b, o.x, o.y), down = G.dirLocal(b, 0, 1);
      add(at.x + down.x, at.y + 1, b.velocity.x * 0.5 + rnd(-0.3, 0.3), b.velocity.y * 0.5 + rnd(0, 0.5), rnd(0.8, 1.8), rnd(30, 70), 1.4, g, 0);
    }
  }
  /* soaking into his clothes, now and then */
  if (G.flesh && Math.floor(G.t * 2) !== Math.floor((G.t - h) * 2)) G.flesh.bleedTick(g);
  /* a bloody hand on a wall leaves a print; a bleeding part dragged along the floor leaves a smear */
  for (const id of ['handL', 'handR', 'footL', 'footR']) {
    const p = g.parts[id]; if (!p || p.gone || p.removed) continue;
    const wet = (p.wet || 0);
    if (id.startsWith('foot') && p.contacts.some(c => c.n.y < -0.5) && BL.poolAt(p.body.position.x) > 2) p.wet = Math.min(1, wet + h * 2);
    if (id.startsWith('hand')) { const near = g.list.some(q => q.tex && q.tex.openings.some(o => o.bleed > 0.2 && Math.hypot(G.toWorld(q.body, o.x, o.y).x - p.body.position.x, G.toWorld(q.body, o.x, o.y).y - p.body.position.y) < 9 * S)); if (near || (p.contacts.some(c => c.n.y < -0.5) && BL.poolAt(p.body.position.x) > 2)) p.wet = Math.min(1, wet + h * 1.5); }
    if (wet > 0.25) for (const c of p.contacts) {
      if (G.t - (p.printT || 0) < 0.6) break;
      const w = G.walls(), isWall = c.other === w.leftWall || c.other === w.rightWall || c.other === w.ceiling, fr = c.other.plugin && c.other.plugin.fv;
      if (!isWall && !fr) continue;
      p.printT = G.t; p.wet = wet - 0.22;
      if (isWall) BL.print(c.pt.x, c.pt.y, (id.startsWith('hand') ? 4.5 : 4) * S, p.body.angle, id.startsWith('foot'));
      else { const l = G.toLocal(c.other, c.pt.x, c.pt.y); const pl = c.other.plugin, gl = pl.gore = pl.gore || []; gl.push({ x: l.x, y: l.y, r: 4.5 * S, a: p.body.angle - c.other.angle, c: G.pick(COLS), hand: true, foot: id.startsWith('foot') }); if (gl.length > 32) gl.splice(0, gl.length - 32); pl.goreDirty = true; }
    }
    p.wet = Math.max(0, (p.wet || 0) - h * 0.02);
  }
}
G.on('abrade', (g, p, a) => {
  if (g.dusty || !a.pt || !p.tex) return;
  const reg = g.dm && g.dm.regions[A.regionAt(p.id, 0, 0)];
  const bloody = (reg && (reg.bleed > 0.1 || reg.abr > 0.35)) || p.tex.ends.length;
  if (!bloody || Math.random() > 0.35) return;
  const w = G.walls(), c = p.contacts[0]; if (!c) return;
  if (c.other === w.ground) { toPool(a.pt.x, 0.3); BL.stamp(a.pt.x, G.floorY() - 1, 2, (a.dir && a.dir.x) || 0, 0, null, 0.6, true); }
  else if (c.other.plugin && c.other.plugin.fv) BL.onFridge(c.other, a.pt.x, a.pt.y, 2.2 * S, true);
  else if (c.other.isStatic) BL.stamp(a.pt.x, a.pt.y, 2 * S, (a.dir && a.dir.x) || 0, (a.dir && a.dir.y) || 0, null, 0.55);
});

/* ------------------------------------------------------------ the sponge: the wall, the floor, the fridges */
BL.wipe = function (x, y, r = 34) {
  if (dctx) { dctx.save(); dctx.globalCompositeOperation = 'destination-out'; const gr = dctx.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, 'rgba(0,0,0,0.5)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); dctx.fillStyle = gr; dctx.beginPath(); dctx.arc(x, y, r, 0, Math.PI * 2); dctx.fill(); dctx.restore(); }
  if (y > G.floorY() - POOLH - r) { const i0 = Math.floor((x - r) / CELL), i1 = Math.floor((x + r) / CELL); for (let i = Math.max(0, i0); i <= Math.min(pv.length - 1, i1); i++) pv[i] *= 0.7; poolDirty = true; }
  for (const f of G.fridges()) { const l = f.plugin && f.plugin.gore; if (!l || !l.length) continue; if (Math.hypot(f.position.x - x, f.position.y - y) > 140) continue; for (let i = l.length - 1; i >= 0; i--) { const w = G.toWorld(f, l[i].x, l[i].y); if (Math.hypot(w.x - x, w.y - y) < r) { l.splice(i, 1); f.plugin.goreDirty = true; } } }
};

/* ------------------------------------------------------------ drawing: drops in flight and the pool */
BL.draw = function (ctx) {
  ctx.lineCap = 'round';
  const k = S / 1.4 * (T.dropK || 1);
  for (let c = 0; c < COLS.length; c++) {
    for (let big = 0; big < 2; big++) {
      ctx.strokeStyle = COLS[c]; ctx.lineWidth = (big ? 2.6 : 1.7) * k; ctx.beginPath(); let any = false;
      for (let i = 0; i < n; i++) { if (col[i] !== c || dust[i] || (pr[i] > 1.6) !== !!big) continue; any = true; const sp = Math.hypot(vx[i], vy[i]), l = Math.min(3, 0.15 + sp * 0.35); ctx.moveTo(px[i], py[i]); ctx.lineTo(px[i] - vx[i] / (sp || 1) * l * pr[i], py[i] - vy[i] / (sp || 1) * l * pr[i] + 0.01); }
      if (any) ctx.stroke();
    }
  }
  ctx.fillStyle = DUST[1]; for (let i = 0; i < n; i++) if (dust[i]) ctx.fillRect(px[i] - pr[i] / 2, py[i] - pr[i] / 2, pr[i], pr[i]);
  if (poolDirty && (poolTick & 1) === 0) drawPool();
};
function drawPool() {
  poolDirty = false;
  pctx.clearRect(0, 0, pool.width, POOLH);
  const base = POOLH;
  pctx.beginPath(); let open = false;
  const top = i => base - Math.min(7, Math.sqrt(pv[i]) * 0.55);
  for (let i = 0; i < pv.length; i++) {
    if (pv[i] > 0.05) { const x = i * CELL; if (!open) { pctx.moveTo(x, base); open = true; } pctx.lineTo(x, top(i)); }
    else if (open) { pctx.lineTo(i * CELL, base); pctx.closePath(); open = false; }
  }
  if (open) { pctx.lineTo(pv.length * CELL, base); pctx.closePath(); }
  /* fresh is red and wet, old is brown */
  let age = 0, w = 0; for (let i = 0; i < pv.length; i++) if (pv[i] > 0.05) { age += pa[i] * pv[i]; w += pv[i]; }
  const a = w ? clamp(age / w / 90, 0, 1) : 0;
  pctx.fillStyle = `rgb(${Math.round(110 - a * 52)},${Math.round(6 + a * 6)},${Math.round(6 + a * 2)})`; pctx.fill();
  /* the shine on a wet pool */
  if (a < 0.7) { pctx.strokeStyle = `rgba(255,170,170,${0.25 * (1 - a)})`; pctx.lineWidth = 1; pctx.beginPath(); let on = false; for (let i = 0; i < pv.length; i++) { if (pv[i] > 1.5) { const x = i * CELL, y = top(i) + 1; on ? pctx.lineTo(x, y) : pctx.moveTo(x, y); on = true; } else on = false; } pctx.stroke(); }
}
/* everything gone: the drops in the air, the runs on the wall, the pool, the stains (the torture room's reset) */
BL.reset = function () {
  n = 0; drips.length = 0; pv.fill(0); pa.fill(0); pd.fill(0); poolDirty = true; drawPool();
  if (dctx) { dctx.save(); dctx.setTransform(1, 0, 0, 1, 0, 0); dctx.clearRect(0, 0, dried.width, dried.height); dctx.restore(); }
  for (const f of G.fridges()) if (f.plugin) { f.plugin.gore = []; f.plugin.goreDirty = true; }
};
BL.poolTotal = () => { let s = 0; for (let i = 0; i < pv.length; i++) s += pv[i]; return s; };
})();
