/* ============================================================
   THE GUY, version three: the body.
   puts a guy into the world: fifteen rigid parts on fourteen pins,
   each guy in his own collision group so his parts pass through each
   other but hit everyone else. keeps track of what each part is
   touching, where his centre of mass is, what he is standing on, and
   takes him apart when something gives.
============================================================ */
(function () {
'use strict';
const G = window.__G3; if (!G || !G.A) return;
const A = G.A, M = G.M, B = G.B, S = G.S;
const BODY = G.body = {};
G.guys = [];
let nextGroup = -3000, nextId = 1;

/* the masses: 75 kg of him in the page's units, scaled with how big he is on this screen */
BODY.massU = 14 * (S / 1.9) * (S / 1.9);
BODY.kg = 75 / BODY.massU;                          /* kg per unit of the page's mass */

/* the masses the physics uses. his real ones (anatomy.js) drive the injuries; these are shifted toward the ends of
   his limbs, because a tiny foot pinned under a heavy body gets pushed straight into the floor by the solver */
const PHYS = { head: 0.081, chest: 0.216, abdomen: 0.139, pelvis: 0.142, uarm: 0.026, larm: 0.016, hand: 0.012, uleg: 0.085, lleg: 0.045, foot: 0.05 };
const PHYS_SUM = (() => { let s = 0; for (const d of A.PARTS) s += PHYS[d.kind] || d.mass; return s; })();
BODY.realKg = p => p.def.mass * 75;
function partBody(d, x, y, group) {
  const kind = d.kind, foot = kind === 'foot', hand = kind === 'hand';
  const o = {
    collisionFilter: G.filterGuy(group), frictionAir: 0.01, restitution: foot ? 0.02 : 0.08,
    friction: foot ? 0.95 : hand ? 0.8 : 0.5, frictionStatic: foot ? 1.4 : 0.8, slop: 0.04,
    render: { visible: false }, label: 'guy'
  };
  let b;
  if (d.r) b = M.Bodies.circle(x, y, d.r * S, o, 14);
  else {
    const w = d.wh[0] * S, h = d.wh[1] * S;
    /* rounded ends so limbs roll off things instead of catching on corners; a flat sole to stand on */
    const ch = foot ? [1.2 * S, 1.2 * S, 0.8 * S, 0.8 * S] : Math.min(w, h) * (A.TRUNK.has(kind) ? 0.28 : 0.44);
    o.chamfer = { radius: ch };
    b = M.Bodies.rectangle(x, y, w, h, o);
  }
  B.setMass(b, (PHYS[d.kind] || d.mass) / PHYS_SUM * BODY.massU);
  return b;
}

/* a new guy, standing with his soles at (x, y) */
BODY.create = function (x, y, opt = {}) {
  const group = nextGroup--, dusty = !!opt.dusty;
  const g = {
    id: nextId++, n: opt.n || 0, name: opt.name || G.pick(A.NAMES), dusty, group, pitch: opt.pitch || G.rnd(0.84, 1.22),
    born: G.t, awake: false, alive: true, home: !!opt.home, cleared: false, gone: 0,
    parts: {}, list: [], joints: [], jointById: {},
    look: {
      skin: [G.rnd(16, 34), G.rnd(40, 62), G.rnd(48, 78)],
      shirt: `hsl(${Math.floor(G.rnd(0, 360))},${Math.floor(G.rnd(30, 68))}%,${Math.floor(G.rnd(30, 54))}%)`,
      pants: G.pick(A.PANTS), boots: G.pick(A.BOOTS), stripe: Math.random() < 0.3,
      hat: dusty || opt.hat || Math.random() < 0.28, hatCol: G.pick(['#5a3a1e', '#3a2a1a', '#7a5a34', '#222'])
    },
    hatOn: true, mpp: G.mpp, kg: BODY.kg, massU: BODY.massU
  };
  for (const d of A.PARTS) {
    const body = partBody(d, x + d.at[0] * S, y + d.at[1] * S, group);
    const p = { def: d, id: d.id, kind: d.kind, side: d.side, body, guy: g, attached: true, loose: false, looseT: 0, gone: false, joints: [], contacts: [], cut: [] };
    body.plugin = { guy: g, part: p };
    g.parts[d.id] = p; g.list.push(p);
  }
  g.list.sort((a, b) => a.def.layer - b.def.layer);
  for (const jd of A.JOINTS) {
    const a = g.parts[jd.a], b = g.parts[jd.b];
    const px = x + jd.at[0] * S, py = y + jd.at[1] * S;
    const la = { x: px - a.body.position.x, y: py - a.body.position.y }, lb = { x: px - b.body.position.x, y: py - b.body.position.y };
    const c = M.Constraint.create({ bodyA: a.body, bodyB: b.body, pointA: { x: la.x, y: la.y }, pointB: { x: lb.x, y: lb.y }, length: 0, stiffness: 1, damping: 0.08, render: { visible: false } });
    const j = { def: jd, id: jd.id, a, b, c, la, lb, lim: jd.lim.slice(), state: 'ok', broken: false, hp: jd.hp, stretch: 0, hyper: 0, ease: 1 };
    /* the joint's stop: a second pin that's off until the joint reaches the end of its range, then locks it there.
       it's one of Matter's own constraints, solved in the same passes as the pins and the contacts, so a stop can
       carry his weight the way a real knee does when he kneels on it (brain.js decides when it holds) */
    j.lc = M.Constraint.create({ bodyA: a.body, bodyB: b.body, pointA: { x: 0, y: 0 }, pointB: { x: 0, y: 0 }, length: 0, render: { visible: false } });
    j.lc.stiffness = 0; j.lc.damping = 0; j.lc.plugin = { gStop: j }; j.stop = 0;
    g.joints.push(j); g.jointById[jd.id] = j; a.joints.push(j); b.joints.push(j);
  }
  M.World.add(G.world, g.list.map(p => p.body));
  M.World.add(G.world, g.joints.map(j => j.c));
  M.World.add(G.world, g.joints.map(j => j.lc));
  G.guys.push(g);
  G.emit('create', g);
  return g;
};

/* the world position of a joint's pin on either side, from where it sits on each part */
BODY.anchor = (j, side) => side === 'a' ? G.toWorld(j.a.body, j.la.x, j.la.y) : G.toWorld(j.b.body, j.lb.x, j.lb.y);
BODY.pivot = j => { const a = BODY.anchor(j, 'a'), b = BODY.anchor(j, 'b'); return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }; };
/* a joint's angle, wrapped about the middle of its range rather than about zero: a shoulder that goes up to 3 rad
   must never read a little past +pi as "a long way the other way" */
BODY.inRange = (j, a) => { const mid = (j.lim[0] + j.lim[1]) / 2; return mid + G.wrap(a - mid); };
BODY.rel = j => BODY.inRange(j, j.b.body.angle - j.a.body.angle);
/* a part's rest offset to a world point given in rest units */
BODY.localOf = (p, ux, uy) => ({ x: (ux - p.def.at[0]) * S, y: (uy - p.def.at[1]) * S });

/* everything still pinned to the chest is still him */
BODY.connect = function (g) {
  const seen = new Set(['chest']); let grew = true;
  while (grew) { grew = false; for (const j of g.joints) { if (j.broken) continue; if (seen.has(j.a.id) !== seen.has(j.b.id)) { seen.add(j.a.id); seen.add(j.b.id); grew = true; } } }
  for (const p of g.list) {
    const was = p.attached; p.attached = seen.has(p.id) && !p.gone;
    if (was && !p.attached && !p.gone) { p.looseT = G.t; p.detachedAt = G.t; }
  }
};

/* a pin gives. returns the stump records so the flesh can draw the ends */
BODY.sever = function (g, j, why) {
  if (j.broken) return null;
  j.broken = true; j.state = 'torn'; j.why = why;
  const wa = BODY.anchor(j, 'a'), wb = BODY.anchor(j, 'b');
  if (j.c) { try { M.World.remove(G.world, j.c); } catch (e) {} j.c = null; }
  if (j.lc) { try { M.World.remove(G.world, j.lc); } catch (e) {} j.lc = null; }
  BODY.connect(g);
  const out = { j, wa, wb, why };
  G.emit('sever', g, j, out);
  return out;
};

/* the parts that are still him, by mass */
BODY.com = function (g, all = false) {
  let m = 0, x = 0, y = 0, vx = 0, vy = 0;
  for (const p of g.list) {
    if (p.gone || (!all && !p.attached)) continue;
    const b = p.body, k = b.mass; m += k; x += b.position.x * k; y += b.position.y * k; vx += b.velocity.x * k; vy += b.velocity.y * k;
  }
  if (!m) return { x: 0, y: 0, vx: 0, vy: 0, m: 0 };
  return { x: x / m, y: y / m, vx: vx / m, vy: vy / m, m };
};
BODY.mass = (g, all = false) => { let m = 0; for (const p of g.list) if (!p.gone && (all || p.attached)) m += p.body.mass; return m; };
/* the inertia of a part about a point, in the page's units (Matter keeps its inertia four times the real one) */
BODY.inertiaAbout = (b, pt) => b.inertia + b.mass * ((b.position.x - pt.x) ** 2 + (b.position.y - pt.y) ** 2);

/* ------------------------------------------------------------ contacts
   filled every step from the engine's pairs: what each part touches, which way it pushes, how hard */
BODY.clearContacts = g => { for (const p of g.list) p.contacts.length = 0; };
/* the contact pushing up on a part from below hardest (a floor, a fridge top, another guy) */
BODY.support = p => { let best = null; for (const c of p.contacts) if (c.n.y < -0.55 && (!best || c.imp > best.imp)) best = c; return best; };
BODY.grounded = p => !p.gone && p.contacts.some(c => c.n.y < -0.5);
/* the floor's height under him, if he's on the floor: the highest support point under his feet */
BODY.footing = function (g) {
  const out = { feet: [], x0: 1e9, x1: -1e9, y: 0, any: false };
  for (const id of ['footL', 'footR']) {
    const f = g.parts[id];
    if (!f || f.gone || !f.attached) continue;
    const c = BODY.support(f);
    if (!c) continue;
    const b = f.body, hw = f.def.wh[0] * S * 0.5;
    const a = G.toWorld(b, -hw, f.def.wh[1] * S * 0.5), z = G.toWorld(b, hw, f.def.wh[1] * S * 0.5);
    out.feet.push(f); out.any = true;
    out.x0 = Math.min(out.x0, a.x, z.x); out.x1 = Math.max(out.x1, a.x, z.x); out.y = Math.max(out.y, c.pt.y);
  }
  if (!out.any) { out.x0 = out.x1 = 0; }
  return out;
};
/* how many parts of him are lying on something */
BODY.touching = g => { let n = 0; for (const p of g.list) if (p.attached && !p.gone && p.contacts.length) n++; return n; };

/* ------------------------------------------------------------ taking him out of the world */
BODY.removePart = function (p) {
  if (p.removed) return; p.removed = true;
  try { M.World.remove(G.world, p.body); } catch (e) {}
};
BODY.destroy = function (g, keepLoose = false) {
  for (const j of g.joints) {
    if (j.c) { try { M.World.remove(G.world, j.c); } catch (e) {} j.c = null; }
    if (j.lc) { try { M.World.remove(G.world, j.lc); } catch (e) {} j.lc = null; }
  }
  for (const p of g.list) { if (keepLoose && !p.attached && !p.gone) continue; BODY.removePart(p); }
  const i = G.guys.indexOf(g); if (i >= 0) G.guys.splice(i, 1);
  g.cleared = true;
  G.emit('destroy', g);
};
/* a loose limb, once it's clear of him, can hit him: it leaves his group */
BODY.updateLoose = function (g) {
  for (const p of g.list) {
    if (p.attached || p.gone || p.removed || p.loose) continue;
    let clear = true;
    const bb = p.body.bounds;
    for (const q of g.list) { if (!q.attached || q.gone) continue; const qb = q.body.bounds; if (bb.min.x < qb.max.x + 2 && bb.max.x > qb.min.x - 2 && bb.min.y < qb.max.y + 2 && bb.max.y > qb.min.y - 2) { clear = false; break; } }
    if (clear && G.t - p.detachedAt > 0.35) {
      p.loose = true;
      /* the whole piece that came off goes together, so its own joints still hold it */
      const grp = nextGroup--;
      for (const q of g.list) if (!q.attached && !q.gone && !q.loose && connectedLoose(g, p, q)) { q.loose = true; q.body.collisionFilter = G.filterLimb(grp); }
      p.body.collisionFilter = G.filterLimb(grp);
    }
  }
};
function connectedLoose(g, a, b) {
  if (a === b) return true;
  const seen = new Set([a.id]); let grew = true;
  while (grew) { grew = false; for (const j of g.joints) { if (j.broken) continue; if (seen.has(j.a.id) !== seen.has(j.b.id)) { seen.add(j.a.id); seen.add(j.b.id); grew = true; } } }
  return seen.has(b.id);
}
BODY.nextGroup = () => nextGroup--;
})();
