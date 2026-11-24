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
  const R = g.dm && g.dm.regions.face; if (R) { R.organ = Math.max(R.organ, 0.35); R.bleed += 0.6; G.dmg.ais(g, R); G.dmg.record(g, { kind: 'impact', type: 'eye', region: 'face', part: 'head', lx: +(sx / S).toFixed(1), ly: +(sy / S).toFixed(1), src: 'knocked out of its socket', srcKind: 'eye', inj: [{ what: (e ? 'left' : 'right') + ' eye out of its socket', sev: 3, tissue: 'organ' }], after: G.dmg.snap(R) }); }
};
G.on('eye', (g, p, h) => { const l = G.toLocal(p.body, h.wx, h.wy); if (Math.random() < 0.45) GB.popEye(g, l.x < 0 ? 0 : 1); });
G.on('headGone', (g) => {
  const h = g.parts.head, p = h.body.position;
  if (g.dusty) GB.burst(p.x, p.y, 9, 7, ['skull', 'bone', 'tooth'], g);
  else {
    GB.burst(p.x, p.y, 6, 8, ['skull'], g); GB.burst(p.x, p.y, 5, 7, ['brain'], g); GB.burst(p.x, p.y, 4, 6, ['meat'], g); GB.burst(p.x, p.y, 3, 7, ['tooth'], g);
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
G.on('obliterate', (g, p) => {
  if (p.gone) return; const pos = p.body.position;
  for (const j of p.joints) if (!j.broken) G.dmg.tear(g, j, 'blast');
  p.gone = true; G.body.removePart(p);
  GB.burst(pos.x, pos.y, 5, 9, g.dusty ? ['bone'] : ['meat', 'meat', 'bone'], g);
  G.body.connect(g);
});

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
  switch (o.type) {
    case 'meat': ctx.fillStyle = o.dust ? '#8a7450' : '#8a1414'; ctx.beginPath(); b.vertices.forEach((v, i) => { const x = v.x - b.position.x, y = v.y - b.position.y, c = Math.cos(-b.angle), s = Math.sin(-b.angle); ctx[i ? 'lineTo' : 'moveTo'](x * c - y * s, x * s + y * c); }); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.fillStyle = '#c84a4a'; ctx.beginPath(); ctx.arc(-r * 0.2, -r * 0.2, r * 0.35, 0, Math.PI * 2); ctx.fill(); if (R() < 0.5) { ctx.fillStyle = '#e8c870'; ctx.fillRect(r * 0.1, -r * 0.5, r * 0.4, r * 0.25); } break;
    case 'bone': ctx.fillStyle = '#efe8d8'; ctx.beginPath(); ctx.moveTo(-r * 1.3, -r * 0.3); ctx.lineTo(r * 1.3, -r * 0.5); ctx.lineTo(r * 1.1, r * 0.4); ctx.lineTo(-r * 1.2, r * 0.3); ctx.closePath(); ctx.fill(); ctx.stroke(); if (!o.dust) { ctx.fillStyle = '#9a1a1a'; ctx.fillRect(-r * 1.3, -r * 0.3, r * 0.4, r * 0.6); } break;
    case 'skull': ctx.fillStyle = '#efe8d8'; ctx.beginPath(); ctx.arc(0, 0, r * 1.2, Math.PI * 1.1, Math.PI * 1.9); ctx.lineTo(r * 0.6, r * 0.3); ctx.lineTo(-r * 0.7, r * 0.4); ctx.closePath(); ctx.fill(); ctx.stroke(); if (!o.dust) { ctx.fillStyle = '#c8907a'; ctx.beginPath(); ctx.arc(0, -r * 0.5, r * 0.6, Math.PI * 1.15, Math.PI * 1.85); ctx.lineTo(0, -r * 0.4); ctx.fill(); ctx.fillStyle = '#8a1010'; ctx.fillRect(-r * 0.6, r * 0.1, r * 1.1, r * 0.25); } break;
    case 'brain': ctx.fillStyle = '#d88a92'; ctx.beginPath(); ctx.arc(0, 0, r * 1.1, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = '#9a4a52'; ctx.lineWidth = 0.8; ctx.beginPath(); ctx.arc(-r * 0.3, -r * 0.2, r * 0.4, 0, Math.PI); ctx.arc(r * 0.3, r * 0.1, r * 0.35, Math.PI, 0); ctx.stroke(); break;
    case 'eye': { ctx.fillStyle = '#f8f6f0'; ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); ctx.fillStyle = '#3a6aa0'; ctx.beginPath(); ctx.arc(r * 0.35, 0, r * 0.45, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#000'; ctx.beginPath(); ctx.arc(r * 0.45, 0, r * 0.2, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = 'rgba(200,30,30,0.7)'; ctx.lineWidth = 0.5; ctx.beginPath(); ctx.moveTo(-r, 0); ctx.lineTo(-r * 0.3, r * 0.3); ctx.moveTo(-r * 0.8, -r * 0.5); ctx.lineTo(-r * 0.2, -r * 0.1); ctx.stroke(); break; }
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
