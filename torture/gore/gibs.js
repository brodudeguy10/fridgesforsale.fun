/* ============================================================
   THE GUY, version three: the bits that come off.
   small pieces (skull, brain, teeth, eyes, meat, bone, his hat) are
   light bodies that bounce off the floor and the fridges and smear
   where they land. guts come out on a chain you can drag. an eye
   hangs off its nerve until it snaps. a limb that came off stays
   a full part of him, with its wounds and its cut end, and lies
   about the floor after he's been taken away, as heavy as it was
   on him, until there are too many or it's been there too long.
============================================================ */
(function () {
'use strict';
const G = window.__G3; if (!G || !G.A) return;
const A = G.A, M = G.M, B = G.B, S = G.S, rnd = G.rnd;
const GB = G.gibs = {};
const T = G.TUNE;
const gibs = GB.list = [], guts = GB.guts = [], loose = GB.loose = [];

GB.gib = function (type, x, y, vx, vy, r = 3, g) {
  while (gibs.length > T.maxGibs) removeGib(gibs[0]);
  const sides = type === 'meat' ? 5 : type === 'bone' || type === 'skull' ? 4 : 0;
  const opts = { collisionFilter: G.filterGib(), frictionAir: 0.01, friction: 0.6, restitution: type === 'eye' ? 0.5 : type === 'tooth' ? 0.45 : 0.22, density: type === 'tooth' ? 0.0012 : 0.001, render: { visible: false }, label: 'gib' };
  const body = sides ? M.Bodies.polygon(x, y, sides, r * S, opts) : M.Bodies.circle(x, y, r * S, opts);
  B.setVelocity(body, { x: vx, y: vy }); B.setAngularVelocity(body, rnd(-0.4, 0.4));
  const o = { type, body, r: r * S, born: G.t, seed: Math.random(), dust: g && g.dusty, col: type === 'hat' && g ? g.look.hatCol : null, tether: null, from: null };
  body.plugin = { gib: o };
  M.World.add(G.world, body); gibs.push(o); return o;
};
function removeGib(o) { const i = gibs.indexOf(o); if (i >= 0) gibs.splice(i, 1); try { M.World.remove(G.world, o.body); } catch (e) {} if (o.tether) { try { M.World.remove(G.world, o.tether); } catch (e) {} o.tether = null; } }
GB.remove = removeGib;
GB.burst = function (x, y, n, sp, kinds, g) { for (let i = 0; i < n; i++) { const a = Math.random() * Math.PI * 2, v = rnd(2, sp); GB.gib(G.pick(kinds), x + rnd(-4, 4), y + rnd(-4, 4), Math.cos(a) * v, Math.sin(a) * v - 2, rnd(1.6, 3.4), g); } };

/* ------------------------------------------------------------ the guts: a chain out of him */
GB.spill = function (g, p, lx, ly) {
  if (g.dusty || guts.filter(q => q.g === g).length >= 2 || guts.length >= 5) return;
  /* close up (the dummy in the torture room) they're a gut's width, not a hose's, and longer: more, smaller links */
  const thin = g.look && g.look.style === 'dummy';
  const base = G.toWorld(p.body, lx, ly), links = [], cons = [], n = thin ? 20 : 11, sp = (thin ? 3.4 : 6.5) * S, rad = (thin ? 1.75 : 3.2) * S;
  for (let i = 0; i < n; i++) {
    const b = M.Bodies.circle(base.x + rnd(-2, 2), base.y + i * (thin ? 1.2 : 2), rad, { collisionFilter: G.filterGib(), frictionAir: 0.03, friction: 0.8, restitution: 0.05, density: 0.0012, render: { visible: false }, label: 'gut' });
    B.setVelocity(b, { x: rnd(-2.5, 2.5), y: rnd(-1, 2) }); links.push(b);
  }
  for (let i = 1; i < n; i++) cons.push(M.Constraint.create({ bodyA: links[i - 1], bodyB: links[i], length: sp, stiffness: 0.65, damping: 0.1, render: { visible: false } }));
  const anchor = M.Constraint.create({ bodyA: p.body, pointA: { x: lx, y: ly }, bodyB: links[0], length: 2, stiffness: 0.5, damping: 0.1, render: { visible: false } });
  M.World.add(G.world, [...links, ...cons, anchor]);
  const gt = { g, links, cons, anchor, part: p, la: { x: lx, y: ly }, born: G.t };
  for (const l of links) l.plugin = { gut: gt };
  guts.push(gt);
  G.emit('sfx', 'squish', { x: base.x, k: 1.3 });
};
G.on('guts', (g, p, w) => GB.spill(g, p, w.lx * 0.5, w.ly * 0.5));
G.on('torn', (g, j) => {
  if (j.id === 'spine' || j.id === 'waist') { GB.spill(g, j.a, j.la.x, j.la.y); GB.spill(g, j.b, j.lb.x, j.lb.y); }
  if (g.dusty) { const w = G.body.pivot(j); GB.burst(w.x, w.y, 4, 5, ['bone'], g); }
});

/* ------------------------------------------------------------ the head's own losses */
G.on('teeth', (g, p, h) => {
  if (g.dusty || (g.teeth || 0) >= 6) return;
  const n = 1 + Math.floor(Math.random() * 2); g.teeth = (g.teeth || 0) + n;
  for (let i = 0; i < n; i++) GB.gib('tooth', h.wx, h.wy, rnd(-4, 4), rnd(-6, -2), 1.1, g);
});
GB.popEye = function (g, e) {
  g.eyeOut = g.eyeOut || [0, 0]; if (g.eyeOut[e] || g.dusty) return;
  const hd = g.parts.head; if (hd.gone) return;
  g.eyeOut[e] = 1;
  const sx = (e ? 0.35 : -0.35) * hd.def.r * S, sy = -0.15 * hd.def.r * S, at = G.toWorld(hd.body, sx, sy);
  const o = GB.gib('eye', at.x, at.y, rnd(-3, 3), rnd(-4, -1), 2.3, g);
  o.from = { part: hd, x: sx, y: sy };
  o.tether = M.Constraint.create({ bodyA: hd.body, pointA: { x: sx, y: sy }, bodyB: o.body, length: 9 * S, stiffness: 0.03, damping: 0.05, render: { visible: false } });
  M.World.add(G.world, o.tether);
  if (G.blood) G.blood.spray(at.x, at.y, 0, -1, 20, 3, 2, 1.4, g);
  G.emit('sfx', 'squish', { x: at.x, k: 0.8 });
  const R = g.dm && g.dm.regions.face; if (R) { R.organ = Math.max(R.organ, 0.35); if (G.bleed) G.bleed.add(g, hd, { kind: 'vein', rate: 1.2, lx: sx, ly: sy + 1.5 * S, region: 'face' }); G.dmg.ais(g, R); G.dmg.record(g, { kind: 'impact', type: 'eye', region: 'face', part: 'head', lx: +(sx / S).toFixed(1), ly: +(sy / S).toFixed(1), src: 'knocked out of its socket', srcKind: 'eye', inj: [{ what: (e ? 'left' : 'right') + ' eye out of its socket', sev: 3, tissue: 'organ' }], after: G.dmg.snap(R) }); }
};
G.on('eye', (g, p, h) => { const l = G.toLocal(p.body, h.wx, h.wy); if (Math.random() < 0.45) GB.popEye(g, l.x < 0 ? 0 : 1); });
G.on('headGone', (g, why, o) => {
  const h = g.parts.head, p = h.body.position;
  if (g.dusty) GB.burst(p.x, p.y, 9, 7, ['skull', 'bone', 'tooth'], g);
  else {
    /* the head comes apart: pieces of it with his face on them, and the bits */
    if (window.TR && TR.tools && TR.tools.dropGrabOn) TR.tools.dropGrabOn(h.body);
    GB.fragment(g, h, { n: 5, dir: o && o.dir, speed: (o && o.speed) || 7 });
    GB.burst(p.x, p.y, 3, 8, ['skull'], g); GB.burst(p.x, p.y, 3, 7, ['brain'], g); GB.burst(p.x, p.y, 2, 6, ['meat'], g); GB.burst(p.x, p.y, 2, 7, ['tooth'], g);
    g.eyeOut = g.eyeOut || [0, 0];
    for (let e = 0; e < 2; e++) if (!g.eyeOut[e]) { g.eyeOut[e] = 1; GB.gib('eye', p.x + (e ? 4 : -4), p.y, rnd(-6, 6), rnd(-8, -3), 2.3, g); }
  }
  for (const o of gibs) if (o.from && o.from.part === h && o.tether) { try { M.World.remove(G.world, o.tether); } catch (e) {} o.tether = null; }
  if (g.hatOn && g.look.hat) { g.hatOn = false; GB.gib('hat', p.x, p.y - 8, rnd(-4, 4), -9, 6, g); }
  G.emit('sfx', 'headpop', { x: p.x, k: 1.6 });
});
/* a hard knock on the head and the hat goes */
G.on('hurt', (g, p, h, R) => {
  if (p.kind !== 'head' || !g.hatOn || !g.look.hat) return;
  if ((h.E || 0) > 9 || h.kind === 'shot') { g.hatOn = false; const b = p.body; GB.gib('hat', b.position.x, b.position.y - 10 * S, rnd(-3, 3) + (h.dir ? h.dir.x * 3 : 0), -6, 6, g); }
});
/* ------------------------------------------------------------ blown apart
   enough force in one place and a part doesn't come off: it comes apart. the part is cut into a few pieces along
   random lines (each one a real body, the weight of what it was, shaped like what it was, going the way it was
   going plus the way it was blown), each piece drawn with a picture of the part as it was at that moment, its torn
   edges raw, with the bone splintered where a break crosses it. a handful of smaller bits go with them. the pieces
   stay where they land, bleed for a while, and smear what they hit */
const CHUNKS = 48;
function clipPoly(P, nx, ny, d) {
  /* the side of the line n.x x + n.y y = d where that's less; each point carries whether the edge from it on is torn */
  const out = [], L = P.length, side = v => v.x * nx + v.y * ny - d;
  for (let i = 0; i < L; i++) {
    const a = P[i], b = P[(i + 1) % L], sa = side(a), sb = side(b);
    const cut = (u, v, su, sv) => { const k = su / (su - sv); return { x: u.x + (v.x - u.x) * k, y: u.y + (v.y - u.y) * k }; };
    if (sa <= 0 && sb <= 0) out.push({ x: a.x, y: a.y, cut: a.cut });
    else if (sa <= 0 && sb > 0) { out.push({ x: a.x, y: a.y, cut: a.cut }); const I = cut(a, b, sa, sb); out.push({ x: I.x, y: I.y, cut: true }); }
    else if (sa > 0 && sb <= 0) { const I = cut(a, b, sa, sb); out.push({ x: I.x, y: I.y, cut: a.cut }); }
  }
  return out;
}
const polyArea = P => { let a = 0; for (let i = 0; i < P.length; i++) { const p = P[i], q = P[(i + 1) % P.length]; a += p.x * q.y - q.x * p.y; } return Math.abs(a) / 2; };
const centroid = P => { let x = 0, y = 0, a = 0; for (let i = 0; i < P.length; i++) { const p = P[i], q = P[(i + 1) % P.length], c = p.x * q.y - q.x * p.y; a += c; x += (p.x + q.x) * c; y += (p.y + q.y) * c; } a *= 0.5; return Math.abs(a) < 1e-6 ? P[0] : { x: x / (6 * a), y: y / (6 * a) }; };
function shatter(P, n) {
  let parts = [P];
  for (let k = 1; k < n; k++) {
    parts.sort((a, b) => polyArea(b) - polyArea(a));
    const big = parts[0], c = centroid(big), an = Math.random() * Math.PI, nx = Math.cos(an), ny = Math.sin(an), off = (Math.random() - 0.5) * Math.sqrt(polyArea(big)) * 0.35, d = c.x * nx + c.y * ny + off;
    const A1 = clipPoly(big, nx, ny, d), A2 = clipPoly(big, -nx, -ny, -d);
    if (A1.length < 3 || A2.length < 3 || polyArea(A1) < 4 || polyArea(A2) < 4) continue;
    parts = parts.slice(1).concat([A1, A2]);
  }
  return parts;
}
/* the part as it looked just then, upright in its own frame, onto a canvas the pieces each show their bit of */
function snapshot(g, p) {
  const b = p.body, ext = (p.def.r ? p.def.r * 2.6 : Math.max(p.def.wh[0], p.def.wh[1]) * 1.3) * S, k = Math.min(3, (G.RES || 1) * 1.2);
  const cv = document.createElement('canvas'); cv.width = Math.ceil(ext * k); cv.height = Math.ceil(ext * k);
  const x = cv.getContext('2d');
  x.setTransform(k, 0, 0, k, cv.width / 2, cv.height / 2); x.rotate(-b.angle); x.translate(-b.position.x, -b.position.y);
  try { if (G.rend && G.rend.drawPart) G.rend.drawPart(x, g, p); } catch (e) {}
  return { cv, k, ext };
}
GB.fragment = function (g, p, o = {}) {
  if (!p || p.gone || p.removed) return [];
  const b = p.body, snap = snapshot(g, p), a0 = b.angle, c0 = Math.cos(-a0), s0 = Math.sin(-a0);
  let poly = b.vertices.map(v => { const dx = v.x - b.position.x, dy = v.y - b.position.y; return { x: dx * c0 - dy * s0, y: dx * s0 + dy * c0, cut: false }; });
  if (poly.length > 16) { const st = poly.length / 16; poly = Array.from({ length: 16 }, (_, i) => poly[Math.floor(i * st)]); }
  const pieces = shatter(poly, o.n || 4), area = pieces.reduce((s, q) => s + polyArea(q), 0) || 1, dens = b.mass / area * 0.9;
  const dir = o.dir || { x: 0, y: -1 }, dm = Math.hypot(dir.x, dir.y) || 1, sp = o.speed || 6, out = [];
  const chunks = gibs.filter(q => q.type === 'chunk'); while (chunks.length + pieces.length > CHUNKS && chunks.length) removeGib(chunks.shift());
  while (gibs.length + pieces.length > T.maxGibs) removeGib(gibs[0]);
  for (const q of pieces) {
    const c = centroid(q), wc = G.toWorld({ position: b.position, angle: a0 }, c.x, c.y);
    const verts = q.map(v => { const w = G.toWorld({ position: b.position, angle: a0 }, v.x, v.y); return { x: w.x, y: w.y }; });
    let body;
    try { body = M.Bodies.fromVertices(wc.x, wc.y, [verts], { collisionFilter: G.filterGib(), frictionAir: 0.012, friction: 0.85, restitution: 0.08, render: { visible: false }, label: 'chunk' }); } catch (e) { body = null; }
    if (!body) continue;
    B.setDensity(body, dens);
    const pv = G.pointVel(b, wc.x, wc.y), rx = wc.x - b.position.x, ry = wc.y - b.position.y, rl = Math.hypot(rx, ry) || 1, kk = rnd(0.5, 1.1);
    B.setVelocity(body, { x: pv.x + dir.x / dm * sp * kk + rx / rl * sp * 0.35, y: pv.y + dir.y / dm * sp * kk + ry / rl * sp * 0.35 - 1 });
    B.setAngularVelocity(body, b.angularVelocity + rnd(-0.25, 0.25));
    /* the piece's shape, in its own frame: where it sat in the part (c), and its outline about that */
    const ob = { type: 'chunk', body, r: Math.sqrt(polyArea(q)) / 2, born: G.t, seed: Math.random(), dust: g.dusty, tether: null, from: null, snap, a0, c, poly: q.map(v => ({ x: v.x - c.x, y: v.y - c.y, cut: v.cut })), kind: p.kind, bloody: !g.dusty };
    body.plugin = { gib: ob };
    M.World.add(G.world, body); gibs.push(ob); out.push(ob);
  }
  return out;
};
function drawChunk(ctx, o) {
  const b = o.body, P = o.poly;
  ctx.save(); ctx.translate(b.position.x, b.position.y); ctx.rotate(b.angle + o.a0);
  ctx.beginPath(); P.forEach((v, i) => ctx[i ? 'lineTo' : 'moveTo'](v.x, v.y)); ctx.closePath();
  ctx.save(); ctx.clip();
  ctx.drawImage(o.snap.cv, -o.c.x - o.snap.cv.width / (2 * o.snap.k), -o.c.y - o.snap.cv.height / (2 * o.snap.k), o.snap.cv.width / o.snap.k, o.snap.cv.height / o.snap.k);
  /* older, it darkens and dries */
  const age = G.t - o.born; if (age > 20) { ctx.fillStyle = `rgba(40,12,8,${Math.min(0.35, (age - 20) / 400).toFixed(3)})`; ctx.fill(); }
  ctx.restore();
  ctx.strokeStyle = 'rgba(14,8,6,0.6)'; ctx.lineWidth = 0.6; ctx.stroke();
  /* the torn edges: raw meat, a fringe of it, the bone splintered where a tear crosses it */
  const R = G.srand(o.seed);
  for (let i = 0; i < P.length; i++) {
    if (!P[i].cut) continue;
    const a = P[i], c = P[(i + 1) % P.length], dx = c.x - a.x, dy = c.y - a.y, L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L;
    ctx.strokeStyle = o.dust ? '#8a7a60' : '#6a0c0a'; ctx.lineWidth = 1.5 * S; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(a.x, a.y);
    const n = Math.max(2, Math.round(L / (1.5 * S))); for (let k = 1; k <= n; k++) { const t = k / n, j = (R() - 0.5) * 1.1 * S; ctx.lineTo(a.x + dx * t + nx * j, a.y + dy * t + ny * j); }
    ctx.stroke();
    ctx.strokeStyle = o.dust ? '#a89878' : 'rgba(190,70,60,0.8)'; ctx.lineWidth = 0.5; ctx.stroke();
    /* the bone: where the torn edge crosses the middle line of the part (o.c is where this piece sat on it) */
    const t0 = Math.abs(dx) > 1e-3 ? (-o.c.x - a.x) / dx : -1;
    if (t0 > 0 && t0 < 1 && o.kind !== 'hand' && o.kind !== 'foot') {
      const bx = a.x + dx * t0, by = a.y + dy * t0, bw = (o.kind === 'head' ? 2.2 : 1.1) * S;
      ctx.fillStyle = '#e6dcc6'; ctx.strokeStyle = 'rgba(70,20,14,0.7)'; ctx.lineWidth = 0.4; ctx.beginPath();
      ctx.moveTo(bx - dx / L * bw, by - dy / L * bw); ctx.lineTo(bx - nx * 1.6 * S, by - ny * 1.6 * S); ctx.lineTo(bx + dx / L * bw * 0.3, by + dy / L * bw * 0.3 - 0.4); ctx.lineTo(bx - nx * 1.1 * S + dx / L * bw, by - ny * 1.1 * S + dy / L * bw); ctx.lineTo(bx + dx / L * bw, by + dy / L * bw); ctx.closePath(); ctx.fill(); ctx.stroke();
    }
  }
  ctx.restore();
}
/* a part blown apart: its pins go first (what was beyond it falls), then it comes apart into pieces */
GB.blowApart = function (g, p, why, o = {}) {
  if (!p || p.gone || p.removed) return;
  const pos = { x: p.body.position.x, y: p.body.position.y };
  if (window.TR && TR.tools && TR.tools.dropGrabOn) TR.tools.dropGrabOn(p.body);
  for (const j of p.joints.slice()) if (!j.broken) G.dmg.tear(g, j, why || 'blast');
  GB.fragment(g, p, { n: o.n || (p.kind === 'head' ? 5 : p.kind === 'hand' || p.kind === 'foot' ? 3 : 4), dir: o.dir, speed: o.speed || 6 });
  p.gone = true; G.body.removePart(p);
  if (!g.dusty) { GB.burst(pos.x, pos.y, p.kind === 'head' ? 3 : 2, 7, ['meat', 'bone'], g); if (G.blood) { G.blood.spray(pos.x, pos.y, (o.dir && o.dir.x) || 0, (o.dir && o.dir.y) || -1, 60, 8, Math.PI * 1.2, 2.2, g, { wall: 6 }); G.blood.splat(pos.x, pos.y, 26 * S); } }
  else GB.burst(pos.x, pos.y, 5, 7, ['bone'], g);
  G.emit('sfx', 'headpop', { x: pos.x, k: 1.2 });
  G.body.connect(g);
  if (g.dm && G.dmg.record) {
    const R = g.dm.regions[A.regionAt(p.id, 0, 0)]; if (R) { R.amp = true; R.organ = Math.max(R.organ, p.kind === 'head' ? 1.3 : R.organ); G.dmg.ais(g, R); }
    G.dmg.record(g, { kind: 'sever', type: 'gibbed', region: R ? R.id : p.id, part: p.id, lx: 0, ly: 0, wx: Math.round(pos.x), wy: Math.round(pos.y), src: o.src || why || 'blown apart', srcKind: 'sever', inj: [{ what: `${(p.def.whole || p.def).name} blown apart`, sev: p.kind === 'head' ? 6 : 4, tissue: 'limb' }], after: R ? G.dmg.snap(R) : null });
  }
  if (!p.loose && g.alive) G.emit('voice', g, 'scream', 1.4);
};
G.on('obliterate', (g, p, o) => GB.blowApart(g, p, 'blast', o || {}));

/* ------------------------------------------------------------ what came off a guy who's being taken away */
GB.adopt = function (g) {
  for (const p of g.list) {
    if (p.attached || p.gone || p.removed) continue;
    loose.push({ p, g, t: G.t });
  }
  while (loose.length > T.maxLoose) dropLoose(loose[0]);
};
function dropLoose(L) { const i = loose.indexOf(L); if (i >= 0) loose.splice(i, 1); G.body.removePart(L.p); }

/* everything off the floor at once (the torture room's reset): bits, guts, loose limbs */
GB.reset = function () {
  while (gibs.length) removeGib(gibs[0]);
  for (const gt of guts) { try { M.World.remove(G.world, [...gt.links, ...gt.cons]); if (gt.anchor) M.World.remove(G.world, gt.anchor); } catch (e) {} }
  guts.length = 0;
  while (loose.length) dropLoose(loose[0]);
};

/* ------------------------------------------------------------ every step */
GB.step = function (h) {
  const now = G.t;
  /* guts: pull hard enough and they come out of him altogether */
  for (let i = guts.length - 1; i >= 0; i--) {
    const gt = guts[i];
    if (gt.anchor) { const a = G.toWorld(gt.part.body, gt.la.x, gt.la.y), b = gt.links[0].position; if (gt.part.gone || gt.part.removed || Math.hypot(a.x - b.x, a.y - b.y) > 32 * S) { try { M.World.remove(G.world, gt.anchor); } catch (e) {} gt.anchor = null; G.emit('sfx', 'squish', { x: a.x, k: 1 }); if (G.blood) G.blood.spray(a.x, a.y, 0, 0, 25, 3, Math.PI * 2, 1.6, gt.g); } }
    if (now - gt.born > (T.gutLife || 75) || (gt.g.cleared && now - gt.born > 30)) { try { M.World.remove(G.world, [...gt.links, ...gt.cons]); if (gt.anchor) M.World.remove(G.world, gt.anchor); } catch (e) {} guts.splice(i, 1); }
  }
  for (let i = gibs.length - 1; i >= 0; i--) {
    const o = gibs[i];
    if (o.type === 'chunk' && o.bloody && now - o.born < 5 && G.blood && Math.random() < 0.15) { const b = o.body; G.blood.spray(b.position.x, b.position.y + 1, b.velocity.x * 0.2, 1, 1, 0.6, 1.2, 1.1, null); }
    if (o.tether && o.from) { const a = G.toWorld(o.from.part.body, o.from.x, o.from.y), b = o.body.position; if (o.from.part.removed || Math.hypot(a.x - b.x, a.y - b.y) > 30 * S) { try { M.World.remove(G.world, o.tether); } catch (e) {} o.tether = null; G.emit('sfx', 'squish', { x: b.x, k: 0.5 }); } }
    if (now - o.born > T.gibLife) removeGib(o);
  }
  for (let i = loose.length - 1; i >= 0; i--) if (now - loose[i].t > T.looseLife) dropLoose(loose[i]);
};
/* gibs smear where they land */
G.M.Events.on(G.engine, 'collisionStart', ev => {
  for (const pr of ev.pairs) for (const [A0, B0] of [[pr.bodyA, pr.bodyB], [pr.bodyB, pr.bodyA]]) {
    const o = A0.plugin && A0.plugin.gib; if (!o || o.dust || o.type === 'hat' || o.type === 'tooth') continue;
    const sp = Math.hypot(o.body.velocity.x, o.body.velocity.y); if (sp < 2.5) continue;
    const c = pr.collision.supports && pr.collision.supports[0] || o.body.position;
    if (B0.plugin && B0.plugin.fv) { if (G.blood) G.blood.onFridge(B0, c.x, c.y, rnd(1.5, 3.2)); }
    else if (B0.isStatic && G.blood) G.blood.stamp(c.x, c.y, rnd(1.5, 3.2) * (o.type === 'brain' ? 1.4 : 1), o.body.velocity.x, o.body.velocity.y, o.type === 'brain' ? '#a8505a' : null);
    if (sp > 5) G.emit('sfx', 'splat', { x: c.x, k: 0.4 });
  }
});

/* ------------------------------------------------------------ drawing */
const gutsInFront = gt => !!(gt.g.look && gt.g.look.style === 'dummy');
GB.draw = function (ctx) {
  for (const gt of guts) if (!gutsInFront(gt)) drawGuts(ctx, gt);
  for (const o of gibs) drawGib(ctx, o);
  for (const L of loose) { const fade = Math.min(1, (T.looseLife - (G.t - L.t)) / 4); ctx.globalAlpha = Math.max(0, fade); if (G.rend) G.rend.drawPart(ctx, L.g, L.p); ctx.globalAlpha = 1; }
};
/* close up, what comes out of his belly comes out toward you: drawn over him, not behind */
GB.drawFront = function (ctx) { for (const gt of guts) if (gutsInFront(gt)) drawGuts(ctx, gt); };
function drawGib(ctx, o) {
  const b = o.body, r = o.r, R = G.srand(o.seed);
  ctx.save(); ctx.translate(b.position.x, b.position.y); ctx.rotate(b.angle);
  const age = (G.t - o.born) / T.gibLife; if (age > 0.85) ctx.globalAlpha = Math.max(0, (1 - age) / 0.15);
  ctx.strokeStyle = '#000'; ctx.lineWidth = 0.8;
  if (o.type === 'chunk') { ctx.restore(); drawChunk(ctx, o); return; }
  switch (o.type) {
    case 'meat': ctx.fillStyle = o.dust ? '#8a7450' : '#8a1414'; ctx.beginPath(); b.vertices.forEach((v, i) => { const x = v.x - b.position.x, y = v.y - b.position.y, c = Math.cos(-b.angle), s = Math.sin(-b.angle); ctx[i ? 'lineTo' : 'moveTo'](x * c - y * s, x * s + y * c); }); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.fillStyle = '#c84a4a'; ctx.beginPath(); ctx.arc(-r * 0.2, -r * 0.2, r * 0.35, 0, Math.PI * 2); ctx.fill(); if (R() < 0.5) { ctx.fillStyle = '#e8c870'; ctx.fillRect(r * 0.1, -r * 0.5, r * 0.4, r * 0.25); } break;
    case 'bone': ctx.fillStyle = '#efe8d8'; ctx.beginPath(); ctx.moveTo(-r * 1.3, -r * 0.3); ctx.lineTo(r * 1.3, -r * 0.5); ctx.lineTo(r * 1.1, r * 0.4); ctx.lineTo(-r * 1.2, r * 0.3); ctx.closePath(); ctx.fill(); ctx.stroke(); if (!o.dust) { ctx.fillStyle = '#9a1a1a'; ctx.fillRect(-r * 1.3, -r * 0.3, r * 0.4, r * 0.6); } break;
    case 'skull': ctx.fillStyle = '#efe8d8'; ctx.beginPath(); ctx.arc(0, 0, r * 1.2, Math.PI * 1.1, Math.PI * 1.9); ctx.lineTo(r * 0.6, r * 0.3); ctx.lineTo(-r * 0.7, r * 0.4); ctx.closePath(); ctx.fill(); ctx.stroke(); if (!o.dust) { ctx.fillStyle = '#c8907a'; ctx.beginPath(); ctx.arc(0, -r * 0.5, r * 0.6, Math.PI * 1.15, Math.PI * 1.85); ctx.lineTo(0, -r * 0.4); ctx.fill(); ctx.fillStyle = '#8a1010'; ctx.fillRect(-r * 0.6, r * 0.1, r * 1.1, r * 0.25); } break;
    case 'brain': ctx.fillStyle = '#d88a92'; ctx.beginPath(); ctx.arc(0, 0, r * 1.1, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = '#9a4a52'; ctx.lineWidth = 0.8; ctx.beginPath(); ctx.arc(-r * 0.3, -r * 0.2, r * 0.4, 0, Math.PI); ctx.arc(r * 0.3, r * 0.1, r * 0.35, Math.PI, 0); ctx.stroke(); break;
    case 'eye': { ctx.fillStyle = '#f8f6f0'; ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); ctx.fillStyle = '#3a6aa0'; ctx.beginPath(); ctx.arc(r * 0.35, 0, r * 0.45, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#000'; ctx.beginPath(); ctx.arc(r * 0.45, 0, r * 0.2, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = 'rgba(200,30,30,0.7)'; ctx.lineWidth = 0.5; ctx.beginPath(); ctx.moveTo(-r, 0); ctx.lineTo(-r * 0.3, r * 0.3); ctx.moveTo(-r * 0.8, -r * 0.5); ctx.lineTo(-r * 0.2, -r * 0.1); ctx.stroke(); break; }
    case 'skin': {
      /* a piece of his skin, torn off: curled at the edges, the raw side showing where it curls */
      const c = o.col || [24, 26, 63], pale = 0.25 + Math.min(0.5, (G.t - o.born) / 600);
      ctx.fillStyle = `hsl(${c[0]},${c[1] * (1 - pale * 0.75)}%,${c[2] + (84 - c[2]) * pale * 0.45}%)`;
      ctx.beginPath(); const n = 9; for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2, rr = r * (1.05 + (R() - 0.5) * 0.5) * (i % 2 ? 1 : 0.8); ctx[i ? 'lineTo' : 'moveTo'](Math.cos(a) * rr * 1.5, Math.sin(a) * rr * 0.75); } ctx.closePath(); ctx.fill();
      ctx.strokeStyle = 'rgba(80,10,8,0.85)'; ctx.lineWidth = 0.5; ctx.stroke();
      ctx.fillStyle = 'rgba(168,68,58,0.85)'; ctx.beginPath(); ctx.ellipse(r * 0.5, r * 0.2, r * 0.7, r * 0.3, 0.3, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'rgba(90,6,6,0.4)'; ctx.beginPath(); ctx.ellipse(-r * 0.3, 0, r * 0.6, r * 0.3, -0.2, 0, Math.PI * 2); ctx.fill();
      break;
    }
    case 'tooth': ctx.fillStyle = '#f4f0e0'; ctx.fillRect(-r * 0.7, -r, r * 1.4, r * 2); ctx.fillStyle = '#8a1010'; ctx.fillRect(-r * 0.7, r * 0.6, r * 1.4, r * 0.4); break;
    case 'hat': ctx.translate(0, r * 0.9); if (G.rend) G.rend.hat(ctx, r * 0.7, o.col || '#5a3a1e'); break;
    case 'weed': { ctx.strokeStyle = '#8a6a3a'; ctx.lineWidth = 1.2; ctx.beginPath(); for (let i = 0; i < 26; i++) { const a = R() * Math.PI * 2, a2 = a + R() * 2.5, rr = r * (0.5 + R() * 0.5); ctx.moveTo(Math.cos(a) * rr, Math.sin(a) * rr); ctx.quadraticCurveTo(0, 0, Math.cos(a2) * r, Math.sin(a2) * r); } ctx.stroke(); break; }
  }
  ctx.restore();
  if (o.tether && o.from) { const a = G.toWorld(o.from.part.body, o.from.x, o.from.y); ctx.strokeStyle = '#b8505a'; ctx.lineWidth = 1.3; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.quadraticCurveTo((a.x + b.position.x) / 2, Math.max(a.y, b.position.y) + 6, b.position.x, b.position.y); ctx.stroke(); }
}
function drawGuts(ctx, gt) {
  if (gt.g.look && gt.g.look.style === 'dummy') { drawGutsReal(ctx, gt); return; }
  const L = gt.links, a = gt.anchor ? G.toWorld(gt.part.body, gt.la.x, gt.la.y) : null;
  const path = () => { ctx.beginPath(); const pts = a ? [a, ...L.map(l => l.position)] : L.map(l => l.position); ctx.moveTo(pts[0].x, pts[0].y); for (let i = 1; i < pts.length - 1; i++) { const m = { x: (pts[i].x + pts[i + 1].x) / 2, y: (pts[i].y + pts[i + 1].y) / 2 }; ctx.quadraticCurveTo(pts[i].x, pts[i].y, m.x, m.y); } const e = pts[pts.length - 1]; ctx.lineTo(e.x, e.y); };
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  path(); ctx.strokeStyle = '#4a1418'; ctx.lineWidth = 7.4 * S; ctx.stroke();
  path(); ctx.strokeStyle = '#c7737a'; ctx.lineWidth = 5.4 * S; ctx.stroke();
  path(); ctx.strokeStyle = 'rgba(240,170,176,0.55)'; ctx.lineWidth = 1.4 * S; ctx.stroke();
}
/* close up: a length of bowel, not a tube. it coils on itself, it's pinched into segments, it's wet, it's bloody */
function drawGutsReal(ctx, gt) {
  const L = gt.links, a = gt.anchor ? G.toWorld(gt.part.body, gt.la.x, gt.la.y) : null;
  const P = a ? [a, ...L.map(l => l.position)] : L.map(l => l.position);
  if (P.length < 2) return;
  /* a smooth line through the links (Catmull-Rom), then a coil laid along it */
  const pts = [], seed = gt.seed || (gt.seed = Math.random() * 10);
  for (let i = 0; i < P.length - 1; i++) {
    const p0 = P[Math.max(0, i - 1)], p1 = P[i], p2 = P[i + 1], p3 = P[Math.min(P.length - 1, i + 2)];
    for (let k = 0; k < 4; k++) { const t = k / 4, t2 = t * t, t3 = t2 * t;
      pts.push({ x: 0.5 * (2 * p1.x + (-p0.x + p2.x) * t + (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 + (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3),
                 y: 0.5 * (2 * p1.y + (-p0.y + p2.y) * t + (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 + (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3) }); }
  }
  pts.push(P[P.length - 1]);
  let acc = 0; const C = [];
  for (let i = 0; i < pts.length; i++) {
    const q = pts[Math.min(pts.length - 1, i + 1)], r = pts[Math.max(0, i - 1)], dx = q.x - r.x, dy = q.y - r.y, d = Math.hypot(dx, dy) || 1;
    if (i) acc += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
    const w = Math.sin(acc * 0.55 + seed) * 1.9 * S * Math.min(1, acc / (6 * S));
    C.push({ x: pts[i].x - dy / d * w, y: pts[i].y + dx / d * w, nx: -dy / d, ny: dx / d, s: acc });
  }
  const line = () => { ctx.beginPath(); ctx.moveTo(C[0].x, C[0].y); for (let i = 1; i < C.length; i++) ctx.lineTo(C[i].x, C[i].y); };
  ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  line(); ctx.strokeStyle = '#2c0709'; ctx.lineWidth = 4.1 * S; ctx.stroke();
  line(); ctx.strokeStyle = '#a65a5e'; ctx.lineWidth = 3.3 * S; ctx.stroke();
  /* blood dried along the underside */
  ctx.beginPath(); for (let i = 0; i < C.length; i++) { const c = C[i], o = 0.9 * S; i ? ctx.lineTo(c.x + c.nx * o, c.y + c.ny * o) : ctx.moveTo(c.x + c.nx * o, c.y + c.ny * o); }
  ctx.strokeStyle = 'rgba(90,6,8,0.55)'; ctx.lineWidth = 1.3 * S; ctx.stroke();
  /* pinched into segments */
  ctx.strokeStyle = 'rgba(60,10,14,0.5)'; ctx.lineWidth = 0.45 * S; let next = 2.4 * S;
  for (let i = 1; i < C.length; i++) { if (C[i].s < next) continue; next = C[i].s + 2.4 * S; const c = C[i], h = 1.5 * S; ctx.beginPath(); ctx.moveTo(c.x - c.nx * h, c.y - c.ny * h); ctx.quadraticCurveTo(c.x + (C[i].x - C[i - 1].x) * 0.4, c.y + (C[i].y - C[i - 1].y) * 0.4, c.x + c.nx * h, c.y + c.ny * h); ctx.stroke(); }
  /* the wet shine along the top */
  ctx.beginPath(); for (let i = 0; i < C.length; i++) { const c = C[i], o = -0.75 * S; i ? ctx.lineTo(c.x + c.nx * o, c.y + c.ny * o) : ctx.moveTo(c.x + c.nx * o, c.y + c.ny * o); }
  ctx.strokeStyle = 'rgba(255,215,215,0.42)'; ctx.lineWidth = 0.5 * S; ctx.stroke();
  ctx.restore();
}
})();
