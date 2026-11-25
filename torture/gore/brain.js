/* ============================================================
   THE GUY, version three: the brain.
   an active ragdoll. every joint has a muscle: a spring-damper that
   pulls the joint toward a target angle, no stronger than that joint
   could really pull, and weaker the more that part of him is broken.
   on top of the muscles sit his reflexes, picked fresh every step
   from what his body is actually doing:

   - standing: ankle torque keeps his centre of mass over his feet
     (the "ankle strategy"), and when that isn't enough he steps,
     placing the foot where SIMBICON would (Yin, Loken, van de Panne
     2007: target = default + c_d * distance + c_v * velocity)
   - off balance: he staggers, arms windmilling, stepping, and only
     goes down if it lasts or he's past saving
   - falling: the knees give so he folds instead of toppling like a
     plank, the hand on the side he's going reaches for the floor and
     takes his weight like a strut, the neck braces the head off it
   - in the air: limbs go everywhere, then brace for the landing
   - lying: he holds what hurts, and when he can, gets up in stages
     (swing the trunk up, crouch, rise). each stage only gets the
     help its own parts' strength can give, pushing off the floor
     through whatever he has on it, so a broken leg or arm changes how
     it goes, a leg that can't take weight stops him at his knees, and
     if the push isn't there he slumps back and tries again
   - held, dragged, pinned under something: he fights it
   - something heavy coming down on him: he gets out from under it if
     his legs let him. at his head: arms up. a gun on him: hands up

   every joint has a stop at the end of its range: a second pin that
   switches on when the joint gets there, solved by Matter with the
   other pins and the contacts, so it carries his weight and takes
   hits without the kicks a force-based limit gives off. how hard a
   joint is driven into its stop is what sprains and dislocates it

   no animation is played. the targets and the limits move and the
   physics does the rest, so the same push never lands the same way.
============================================================ */
(function () {
'use strict';
const G = window.__G3; if (!G || !G.body) return;
const A = G.A, B = G.B, BODY = G.body, S = G.S, clamp = G.clamp, wrap = G.wrap;
const BR = G.brain = {};
const L = G.HEIGHT_U * S;                           /* his height in px */
const GRAV = () => G.engine.gravity.y * G.engine.gravity.scale;
/* how quick each muscle is (rad/s natural frequency at full strength) */
const W0 = { neck: 13, spine: 15, waist: 15, shoulder: 10, elbow: 10, wrist: 9, hip: 14, knee: 15, ankle: 14 };
const jtype = id => id.replace(/[LR]$/, '');
const SIDE = { L: 1, R: -1 };

BR.init = function (g) {
  g.br = {
    mode: 'stand', since: G.t, sub: '', tgt: {}, k: {}, world: {}, eye: { x: 0, y: 0 }, look: null,
    fatigue: 0, tries: 0, getup: null, step: null, nextStepOk: 0, walkTo: null, panic: 0, held: null, heldT: 0,
    air: 0, ground: 0, lyingT: 0, last: {}, fear: 0, aimT: 0, flinch: 0, clutch: null, said: {}, impactT: -9, trunkPrev: 0,
    sub2: {}, ankleSat: 0, stuck: 0
  };
  /* who is on which side of each pin, for the inertia the muscles push against */
  BR.topology(g);
};
BR.topology = function (g) {
  /* a break in a bone (a passive joint, see body.js) is where a group ends: a muscle above it can't swing what hangs
     below it as if it were rigid, and one below it pushes against the piece it's on, not the rest of him */
  const stop = k => k.broken || (k.def && k.def.passive);
  const grow = (start, j, avoid) => { const side = new Set([start]); let grew = true; while (grew) { grew = false; for (const k of g.joints) { if (k === j || stop(k)) continue; if (side.has(k.a.id) !== side.has(k.b.id)) { if (k.a.id === avoid || k.b.id === avoid) continue; side.add(k.a.id); side.add(k.b.id); grew = true; } } } return side; };
  g.br.par2 = g.br.par2 || {};
  for (const j of g.joints) {
    const side = grow(j.b.id, j, j.a.id); side.delete(j.a.id);
    g.br.sub2[j.id] = side;
    const par = grow(j.a.id, j, j.b.id); par.delete(j.b.id); for (const id of side) par.delete(id);
    g.br.par2[j.id] = par;
  }
};

/* ------------------------------------------------------------ what his body is doing */
function sense(g, h) {
  const br = g.br, s = br.s = br.s || {};
  const com = BODY.com(g);
  s.com = com;
  s.foot = BODY.footing(g);
  const pel = g.parts.pelvis, ch = g.parts.chest, hd = g.parts.head;
  s.pelA = pel.attached ? wrap(pel.body.angle) : 0;
  s.chA = wrap(ch.body.angle);
  s.trunkTilt = Math.abs(wrap(ch.body.angle * 0.5 + (pel.attached ? pel.body.angle * 0.5 : ch.body.angle * 0.5)));
  s.headUp = !hd.gone && hd.attached ? (pel.attached ? pel.body.position.y - hd.body.position.y : ch.body.position.y - hd.body.position.y + L * 0.25) : 0;
  let touching = 0, trunkDown = 0, limbDown = 0, any = false;
  for (const p of g.list) {
    if (!p.attached || p.gone) continue;
    if (!p.contacts.length) continue;
    touching++; any = true;
    const core = A.TRUNK.has(p.kind) || p.kind === 'head', prox = p.kind === 'uleg' || p.kind === 'uarm';
    if (core || prox) for (const c of p.contacts) if (c.n.y < -0.3) { if (core) trunkDown++; else limbDown++; break; }
  }
  s.touching = touching; s.trunkDown = trunkDown; s.limbDown = limbDown;
  br.air = any ? 0 : br.air + h;
  /* the floor under him: what his feet stand on, or the page floor */
  s.floorY = s.foot.any ? s.foot.y : G.H();
  s.pelH = s.floorY - (pel.attached ? pel.body.position.y : ch.body.position.y + 20 * S);     /* how high his hips are */
  s.standH = 52.5 * S;                                                                            /* where they are when he stands */
  /* is somebody holding him */
  const mc = G.mouse(), hb = mc && mc.constraint && mc.constraint.bodyB;
  const hp = hb && hb.plugin && hb.plugin.part;
  s.held = hp && hp.guy === g && hp.attached ? hp : null;
  if (s.held) { br.heldT += h; s.mouse = mc.mouse.position; } else br.heldT = 0;
  s.cap = g.dm ? g.dm.cap : { legL: 1, legR: 1, armL: 1, armR: 1, core: 1, neck: 1, cons: 1, will: 1 };
  s.load = g.dm ? g.dm.loadKg : 0;
  s.v = Math.hypot(com.vx, com.vy);
}

/* a muscle: pull joint j toward relative angle t with strength k (0..1.5).
   the torque turns everything beyond the joint as one piece about the pin, and pushes the rest of him the other
   way about the same pin, so no small part ever gets a kick sized for a big one */
function muscle(g, j, t, k, h) {
  if (j.broken || !j.c) return;
  if (j.def.passive) { passive(g, j); return; }                        /* a break in a bone: nothing pulls on it */
  const a = j.a.body, b = j.b.body, piv = BODY.pivot(j);
  const rel = BODY.rel(j), wr = b.angularVelocity - a.angularVelocity;
  const sub = g.br.sub2[j.id];
  const ib = groupI(g, sub, true, piv, j), ia = groupI(g, sub, false, piv, j), ired = ia * ib / (ia + ib);
  const dms = (b.deltaTime || 16.667), d2 = dms * dms;
  const cap = j.ease * (g.dm ? g.dm.jointCap(j) : 1);
  let tau = 0;
  if (k > 0 && cap > 0) {
    const w = W0[jtype(j.id)] * Math.sqrt(Math.min(k, 1.5)) * (0.55 + 0.45 * cap), wh = Math.min(0.5, w * h);
    const tt = clamp(BODY.inRange(j, t), j.lim[0] - 0.05, j.lim[1] + 0.05);
    const dw = wh * wh * (tt - rel) - 2 * 0.9 * wh * wr;             /* the long way round inside the range, never through the stop */
    tau = dw * ired / d2;
    const max = j.def.cap * k * cap * BODY.massU * GRAV() * L;
    tau = clamp(tau, -max, max);
  }
  j.tauLast = tau / (BODY.massU * GRAV() * L);                     /* in his weight times his height, for anyone watching */
  if (tau) { spin(g, sub, true, piv, tau / ib, j); spin(g, sub, false, piv, -tau / ia, j); }
}
/* a break in a bone has no muscle across it, but the flesh round it drags: the two pieces can't spin against each
   other freely, the more so the more flesh is left (soft: how much of it is cut) */
function passive(g, j) {
  const a = j.a.body, b = j.b.body, piv = BODY.pivot(j), wr = b.angularVelocity - a.angularVelocity;
  if (Math.abs(wr) < 1e-5) return;
  const sub = g.br.sub2[j.id], ib = groupI(g, sub, true, piv, j), ia = groupI(g, sub, false, piv, j), ired = ia * ib / (ia + ib);
  const dms = (b.deltaTime || 16.667), d2 = dms * dms, z = 0.12 + 0.3 * (1 - (j.soft || 0));
  const tau = -wr * z * ired / d2;
  spin(g, sub, true, piv, tau / ib, j); spin(g, sub, false, piv, -tau / ia, j);
}
/* the joints' own stops: ligament and bone, not muscle, so nothing weakens them. solved on velocities, one joint at
   a time and a few times over (Gauss-Seidel), so three joints sitting on their stops at once can't add up to a kick
   that no one of them would give. a joint past its stop stops moving further past it, then eases back */
function limits(g, h) {
  const kgpx = g.kg * G.mpp * G.mpp * 3600;                          /* Matter mass x (px per step)^2 -> joules */
  for (const j of g.joints) {
    j.limE = 0;
    if (j.broken || !j.c) continue;
    const rel = BODY.rel(j);
    /* at the stop, or about to be */
    const e = rel < j.lim[0] + 0.03 ? rel - j.lim[0] - 0.03 : rel > j.lim[1] - 0.03 ? rel - j.lim[1] + 0.03 : 0;
    if (e === 0) continue;
    const a = j.a.body, b = j.b.body, wr = b.angularVelocity - a.angularVelocity;
    const into = e > 0 ? Math.max(0, wr) : Math.min(0, wr);
    j.hyper = Math.max(j.hyper, Math.max(0, Math.abs(e) - 0.03)); j.hyperW = Math.max(j.hyperW || 0, Math.abs(into));
    if (Math.abs(into) < 1e-6) continue;
    const piv = BODY.pivot(j), sub = g.br.sub2[j.id];
    const ib = groupI(g, sub, true, piv, j), ia = groupI(g, sub, false, piv, j), ired = ia * ib / (ia + ib);
    /* what the stop is about to take out: the two sides turning into each other, as wholes, in joules.
       a hand flicking into its stop is a fraction of a joule; a leg driven into it by a fridge is a lot */
    const pv = pinVel(j), wg = groupW(g, sub, true, piv, pv, j, ib) - groupW(g, sub, false, piv, pv, j, ia);
    const gin = e > 0 ? Math.max(0, wg) : Math.min(0, wg);
    const w = Math.abs(gin) < Math.abs(into) ? gin : into;
    j.limE = 0.5 * ired * w * w * kgpx;
  }
}
/* the pin's own velocity, and a side's turning rate about it from its angular momentum */
function pinVel(j) {
  const a = j.a.body, piv = BODY.pivot(j), rx = piv.x - a.position.x, ry = piv.y - a.position.y;
  return { x: a.velocity.x - ry * a.angularVelocity, y: a.velocity.y + rx * a.angularVelocity };
}
function groupW(g, sub, child, piv, pv, j, I) {
  let Lm = 0;
  for (const p of g.list) {
    if (!inGroup(g, p, sub, child, j)) continue;
    const b = p.body, rx = b.position.x - piv.x, ry = b.position.y - piv.y, vx = b.velocity.x - pv.x, vy = b.velocity.y - pv.y;
    Lm += b.mass * (rx * vy - ry * vx) + b.inertia * b.angularVelocity;
  }
  return Lm / I;
}
/* one side of a pin, as a rigid group: its inertia about the pin, and turning it */
function inGroup(g, p, sub, child, j) {
  if (p.gone) return false;
  const side = sub ? sub.has(p.id) : p === j.b;
  if (side !== child) return false;
  /* the parent side is whatever is still joined to the parent, short of a break in a bone: him, or the loose piece
     the joint is in */
  if (child) return true;
  const par = g.br.par2 && g.br.par2[j.id];
  return par ? par.has(p.id) && p.attached === j.a.attached : p.attached === j.a.attached;
}
function groupI(g, sub, child, piv, j) {
  let I = 0;
  for (const p of g.list) if (inGroup(g, p, sub, child, j)) I += BODY.inertiaAbout(p.body, piv);
  return Math.max(I, 1e-6);
}
function spin(g, sub, child, piv, al, j) {
  for (const p of g.list) {
    if (!inGroup(g, p, sub, child, j)) continue;
    const b = p.body, rx = b.position.x - piv.x, ry = b.position.y - piv.y;
    b.force.x += -ry * al * b.mass; b.force.y += rx * al * b.mass; b.torque += al * b.inertia;
  }
}
/* a world-frame muscle: turn part p's side of him (everything but the legs) toward world angle t, about his hips,
   the legs taking the push back */
function upright(g, p, t, k, h, against, w0 = 9) {
  if (!p.attached || p.gone || k <= 0) return 0;
  const b = p.body, ang = wrap(b.angle);
  const wh = Math.min(0.5, w0 * h), dms = b.deltaTime || 16.667;
  const hips = g.parts.pelvis.attached ? BODY.pivot(g.jointById.hipL.broken ? g.jointById.hipR : g.jointById.hipL) : b.position;
  let It = 0, Il = 0;
  for (const q of g.list) { if (!q.attached || q.gone) continue; const I = BODY.inertiaAbout(q.body, hips); if (A.LEG.has(q.kind)) Il += I; else It += I; }
  if (It <= 0) return 0;
  const dw = wh * wh * wrap(t - ang) - 2 * 0.95 * wh * b.angularVelocity;
  const max = 0.3 * k * BODY.massU * GRAV() * L;
  const tau = clamp(dw * It / (dms * dms) * k, -max, max);
  for (const q of g.list) {
    if (!q.attached || q.gone) continue;
    const leg = A.LEG.has(q.kind); if (leg && (!against || !Il)) continue;
    const al = leg ? -tau / Il : tau / It, qb = q.body, rx = qb.position.x - hips.x, ry = qb.position.y - hips.y;
    qb.force.x += -ry * al * qb.mass; qb.force.y += rx * al * qb.mass; qb.torque += al * qb.inertia;
  }
  return tau;
}
/* push a point mass toward a target with a critically damped spring: used for feet and for the stand-up help */
function pull(b, tx, ty, w0, h, maxF, out) {
  const wh = Math.min(0.5, w0 * h), dms = b.deltaTime || 16.667;
  const ax = wh * wh * (tx - b.position.x) - 2 * 0.9 * wh * b.velocity.x, ay = wh * wh * (ty - b.position.y) - 2 * 0.9 * wh * b.velocity.y;
  let fx = ax * b.mass / (dms * dms), fy = ay * b.mass / (dms * dms);
  const m = Math.hypot(fx, fy); if (m > maxF) { fx *= maxF / m; fy *= maxF / m; }
  b.force.x += fx; b.force.y += fy;
  if (out) { out.body.force.x -= fx; out.body.force.y -= fy; }
  return Math.hypot(fx, fy);
}
const weight = g => BODY.mass(g) * GRAV();
/* a torque from the floor: every part of him gets the push that turns a rigid body about (px, py) */
function groundTorque(g, tau, px, py) {
  let I = 0;
  for (const p of g.list) { if (!p.attached || p.gone) continue; const b = p.body; I += b.mass * ((b.position.x - px) ** 2 + (b.position.y - py) ** 2) + b.inertia; }
  if (I <= 0) return;
  const al = tau / I;
  for (const p of g.list) {
    if (!p.attached || p.gone) continue;
    const b = p.body, rx = b.position.x - px, ry = b.position.y - py;
    b.force.x += -ry * al * b.mass; b.force.y += rx * al * b.mass; b.torque += al * b.inertia;
  }
}

/* ------------------------------------------------------------ two-bone reach: angles that put the end of a limb on a point */
function reach(g, s1, s2, tx, ty, bendOut) {
  const p1 = g.parts[s1], p2 = g.parts[s2];
  if (!p1.attached || !p2.attached || p1.gone || p2.gone) return null;
  const j1 = p1.joints.find(j => j.b === p1), j2 = p2.joints.find(j => j.b === p2);
  if (!j1 || !j2 || j1.broken || j2.broken) return null;
  const o = BODY.pivot(j1), l1 = Math.hypot(j1.lb.x, j1.lb.y) + Math.hypot(j2.la.x, j2.la.y), l2 = 2 * Math.hypot(j2.lb.x, j2.lb.y) + (p2.kind === 'larm' ? 3.5 : 2.5) * S;
  let dx = tx - o.x, dy = ty - o.y, d = Math.hypot(dx, dy) || 1;
  const dd = clamp(d, Math.abs(l1 - l2) + 1, l1 + l2 - 0.5);
  const base = Math.atan2(-dx, dy);                                  /* the angle of a segment pointing straight at the target */
  const c1 = clamp((l1 * l1 + dd * dd - l2 * l2) / (2 * l1 * dd), -1, 1), a1 = Math.acos(c1);
  const sgn = bendOut ? -p1.side || 1 : p1.side || 1;
  const w1 = base + sgn * a1;                                          /* the upper segment's world angle */
  const c2 = clamp((l1 * l1 + l2 * l2 - dd * dd) / (2 * l1 * l2), -1, 1), a2 = Math.PI - Math.acos(c2);
  const w2 = w1 - sgn * a2;
  return { r1: wrap(w1 - j1.a.body.angle), r2: wrap(w2 - w1), j1, j2 };
}
function setReach(g, arm, tx, ty, k, bendOut) {
  const L2 = arm.slice(-1);
  const r = reach(g, (arm.startsWith('u') || arm.startsWith('a') ? 'uarm' : 'uleg') + L2, (arm.startsWith('u') || arm.startsWith('a') ? 'larm' : 'lleg') + L2, tx, ty, bendOut);
  if (!r) return false;
  const br = g.br; br.tgt[r.j1.id] = r.r1; br.k[r.j1.id] = k; br.tgt[r.j2.id] = r.r2; br.k[r.j2.id] = k;
  return true;
}
/* the world angle, as a relative target for joint id */
function worldT(g, id, w) { const j = g.jointById[id]; return j ? wrap(w - j.a.body.angle) : 0; }

/* ------------------------------------------------------------ the modes */
function setMode(g, m, sub = '') {
  const br = g.br;
  if (br.mode === m && br.sub === sub) return;
  br.last[br.mode] = G.t; br.prev = br.mode; br.mode = m; br.sub = sub; br.since = G.t;
  G.emit('mode', g, m, br.prev);
}
function choose(g, h) {
  const br = g.br, s = br.s, cap = s.cap;
  if (!g.alive) { setMode(g, 'dead'); return; }
  if (cap.cons < 0.22) { setMode(g, 'limp'); br.getup = null; br.step = null; return; }
  if (G.t - g.born < 0.35 && br.mode === 'stand') return;          /* his feet haven't found the floor yet */
  if (s.held) { setMode(g, s.touching >= 3 ? 'held' : 'held', s.touching >= 3 ? 'dragged' : ''); br.getup = null; br.step = null; return; }
  if (s.load > 22 && (s.trunkDown || s.limbDown)) { setMode(g, 'pinned'); br.getup = null; br.step = null; return; }
  const standing = s.foot.any && s.pelH > s.standH * 0.72 && s.trunkTilt < 0.6;
  if (br.air > 0.12 && s.pelH > s.standH * 0.4) { setMode(g, 'air'); br.step = null; br.getup = null; return; }
  if (br.mode === 'getup' && br.getup) return;                     /* the stand-up runs to its own end */
  if (br.mode === 'stand' || br.mode === 'air' && standing) {
    const sup = s.foot, hw = Math.max(4 * S, (sup.x1 - sup.x0) / 2), cx = (sup.x0 + sup.x1) / 2;
    const out = Math.abs(s.com.x + s.com.vx * 10 - cx) - hw;
    const settling = G.t < (br.settleUntil || 0) || G.t < (br.dodgeUntil || 0);
    /* gone: past saving. off balance: he staggers, arms out, stepping, and only goes down if it lasts */
    const gone = s.trunkTilt > 0.95 || !s.foot.any && br.air > (settling ? 0.2 : 0.1) || s.pelH < s.standH * 0.5;
    /* a leg that can't take weight (shattered, dislocated, cut) means he can't stay up, however well he balances */
    const lame = Math.min(cap.legL, cap.legR) < 0.3;
    const shaky = lame || !settling && (!standing && !(br.step && G.t - br.step.t0 < 0.5) || s.trunkTilt > 0.7 || (out > hw * 2.6 && !br.step) || !s.foot.any && br.air > 0.05);
    br.offT = shaky ? (br.offT || 0) + h : Math.max(0, (br.offT || 0) - h * 2);
    if (gone || br.offT > 0.28) { setMode(g, 'fall'); br.step = null; br.settleUntil = 0; br.offT = 0; G.emit('voice', g, 'fall', 0.7); return; }
    /* once he's staggering he staggers for a moment, not for a frame at a time */
    const stag = br.sub === 'stagger' ? br.offT > 0.015 || G.t < (br.staggerUntil || 0) : br.offT > 0.06;
    if (stag && br.sub !== 'stagger') { br.staggerUntil = G.t + 0.45; G.emit('voice', g, 'stagger', 0.5); }
    setMode(g, 'stand', stag ? 'stagger' : ''); return;
  }
  if (br.mode === 'fall' || br.mode === 'air' || br.mode === 'held' || br.mode === 'pinned' || br.mode === 'limp' || br.mode === 'dead') {
    if (standing && s.v < 3) { setMode(g, 'stand'); return; }
    /* down means down: his trunk on the floor and nearly still. propped on an arm or a knee he's still falling,
       and still holding himself */
    const since = G.t - br.since;
    if (s.trunkDown && s.v < 1.3 || (s.trunkDown || s.limbDown) && s.v < 0.7 && since > 0.6 || since > 2.5 && s.v < 0.5) { setMode(g, 'lie'); br.lyingT = G.t; return; }
    if (br.mode !== 'fall' && br.mode !== 'air') setMode(g, 'fall');
    return;
  }
  if (br.mode === 'lie') {
    if (standing && s.v < 2) { setMode(g, 'stand'); return; }
    if (!s.trunkDown && s.v > 5) { setMode(g, 'fall'); return; }
    return;
  }
  setMode(g, 'fall');
}

/* default: everything relaxed toward his rest pose */
function rest(g, k) {
  const br = g.br;
  for (const j of g.joints) { br.tgt[j.id] = 0; br.k[j.id] = k; }
  br.tgt.elbowL = -0.12; br.tgt.elbowR = 0.12;
}

/* ---- standing */
function stand(g, h) {
  const br = g.br, s = br.s, cap = s.cap, sup = s.foot;
  const strength = Math.min(cap.will, cap.cons);
  rest(g, 0.9 * strength);
  /* arms: hang loose with a little life in them */
  for (const L2 of ['L', 'R']) { br.k['shoulder' + L2] = 0.35 * strength; br.k['elbow' + L2] = 0.3 * strength; br.k['wrist' + L2] = 0.25 * strength; }
  /* breathing: slow and small, until a lung is filling or he's emptying, then fast and deep */
  const dmB = g.dm || {}, lab = clamp(1 - (dmB.breath == null ? 1 : dmB.breath) + Math.max(0, 0.6 - (dmB.oxy == null ? 1 : dmB.oxy)) + Math.max(0, 1 - (dmB.blood == null ? G.TUNE.bloodMl : dmB.blood) / G.TUNE.bloodMl - 0.15), 0, 1);
  br.bph = (br.bph || 0) + h * (1.6 + lab * 4.5);
  const breathe = Math.sin(br.bph + g.id) * (0.015 + lab * 0.03);
  br.tgt.spine = breathe; br.tgt.neck = 0;
  const cx = (sup.x0 + sup.x1) / 2, hw = Math.max(3 * S, (sup.x1 - sup.x0) / 2);
  /* weak leg: lean onto the good one */
  const limp = (cap.legL - cap.legR) * 0.35 * hw;
  let xdes = cx + limp;
  /* something heavy coming down on him: he sees it and gets out from under it, if his legs will let him. which way
     depends on where it's going to land and how much room he has; he still throws his arms up as he goes */
  const th = br.threat, dodging = (br.dodgeUntil || 0) > G.t;
  if (th && th.body && th.t < 0.85 && !dodging && strength > 0.5 && Math.min(cap.legL, cap.legR) > 0.5 && br.sub !== 'stagger') {
    const land = th.body.position.x + th.body.velocity.x * th.tc;
    let dir = Math.sign(s.com.x - land) || (Math.random() < 0.5 ? 1 : -1);
    if ((dir > 0 ? G.W() - s.com.x : s.com.x) < L * 0.6) dir = -dir;      /* a wall that way: the other way */
    br.walkTo = clamp(s.com.x + dir * L * 0.55, L * 0.3, G.W() - L * 0.3); br.dodgeUntil = G.t + 0.9; br.dodgeT0 = G.t; br.dodgeDir = dir; br.dodges = (br.dodges || 0) + 1;
    G.emit('dodge', g, dir); if (g.dm) g.dm.stats.dodges = (g.dm.stats.dodges || 0) + 1;
  }
  /* the first quarter second of a dodge is a shove off the floor: his legs push his trunk sideways and his feet push
     the floor the other way, so the floor's grip is what throws him clear */
  if (dodging && G.t - br.dodgeT0 < 0.25 && sup.feet.length) {
    const push = 0.65 * strength * Math.min(cap.legL, cap.legR) * GRAV(), dir = br.dodgeDir; let tot = 0;
    for (const id of ['pelvis', 'abdomen', 'chest']) { const q = g.parts[id]; if (!q.attached || q.gone) continue; const f = dir * push * BODY.mass(g) * (q.body.mass / BODY.mass(g)) * 1.6; q.body.force.x += f; tot += f; }
    const fs = sup.feet.filter(f => f.attached && !f.gone); for (const f of fs) f.body.force.x -= tot / fs.length;
  }
  /* walking home, or away from something */
  if (br.walkTo != null && !br.step) {
    const dx = br.walkTo - s.com.x;
    if (Math.abs(dx) < 10 * S) br.walkTo = null;
    else xdes = cx + clamp(dx, -1, 1) * hw * (dodging ? 1.7 : 0.95);
  }
  const e = s.com.x - xdes, v = s.com.vx;
  /* the ankle strategy: torque at the ankles that pushes his centre of mass back over his feet */
  const m = BODY.mass(g), gr = GRAV(), comH = Math.max(10 * S, s.floorY - s.com.y);
  const want = -m * gr * (2.2 * e + 18 * v);
  const feet = sup.feet.filter(f => f.attached);
  let sat = false, total = 0;
  for (const f of feet) {
    const j = f.joints.find(q => q.b === f); if (!j || j.broken) continue;
    const legCap = f.side > 0 ? cap.legL : cap.legR;
    const max = j.def.cap * 1.8 * legCap * strength * BODY.massU * gr * L / feet.length;
    let tau = want / feet.length; if (Math.abs(tau) > max) { tau = Math.sign(tau) * max; sat = true; }
    total += tau;
    br.k[j.id] = 0.5 * strength; br.tgt[j.id] = worldT(g, j.id, 0);       /* keep the sole flat */
  }
  /* the floor pushes back on his soles: the torque turns all of him about the middle of his feet, not just his shins */
  if (total) groundTorque(g, total, cx, s.floorY);
  br.ankleSat = sat ? br.ankleSat + h : 0;
  /* legs straight, hips square, trunk upright: the trunk's righting torque is taken by his legs */
  for (const L2 of ['L', 'R']) {
    const lc = L2 === 'L' ? cap.legL : cap.legR;
    br.k['knee' + L2] = 1.2 * strength * lc; br.tgt['knee' + L2] = 0;
    br.k['hip' + L2] = 1.0 * strength * lc; br.tgt['hip' + L2] = 0.04 * SIDE[L2] * -1;
  }
  /* his legs are columns of bone: the pins are a little soft, so the columns get some help holding him up */
  if (feet.length) {
    /* only the legs that are on the floor hold him, and only as well as each one still can: a shattered shin holds nothing */
    let held = 0; for (const f of feet) held += f.side > 0 ? cap.legL : cap.legR;
    const share = (G.t < (br.settleUntil || 0) ? 0.65 : 0.45) * strength * Math.min(1, held * 0.6) * (feet.length === 2 ? 1 : 0.8);
    const W = m * gr * share, sag = clamp((s.standH - s.pelH) / (6 * S), 0, 1.5);
    const up = W * (0.75 + sag * 0.5);
    for (const id of ['pelvis', 'chest']) { const q = g.parts[id]; if (q.attached && !q.gone) q.body.force.y -= up * (id === 'pelvis' ? 0.6 : 0.4); }
  }
  const lean = (br.walkTo != null ? clamp((br.walkTo - s.com.x) / L, (br.dodgeUntil || 0) > G.t ? -0.14 : -0.06, (br.dodgeUntil || 0) > G.t ? 0.14 : 0.06) : 0) ;
  const thighs = ['ulegL', 'ulegR'].map(id => g.parts[id]).filter(p => p.attached && !p.gone);
  upright(g, g.parts.pelvis, lean, 0.9 * strength * cap.core, h, thighs, 8);
  br.tgt.waist = 0; br.tgt.spine = breathe; br.k.waist = br.k.spine = 1.1 * strength * cap.core;
  /* he steps when the ankles can't hold it */
  stepping(g, h, cx, hw, strength);
  if (br.sub === 'stagger') {
    /* off balance: arms thrown out against the way he's going, windmilling */
    const dir = Math.sign(s.com.vx) || 1, ph = G.t * 11 + g.id;
    for (const L2 of ['L', 'R']) {
      const sd = SIDE[L2], up = sd === dir ? 1.9 : 1.2;
      br.tgt['shoulder' + L2] = -sd * (up + Math.sin(ph + (sd > 0 ? 0 : 1.7)) * 0.5); br.k['shoulder' + L2] = 0.8 * strength;
      br.tgt['elbow' + L2] = sd * 0.4; br.k['elbow' + L2] = 0.5 * strength;
    }
    return;
  }
  hands(g, h, strength);
}
function stepping(g, h, cx, hw, strength) {
  const br = g.br, s = br.s, sup = s.foot, cap = s.cap;
  const predX = s.com.x + s.com.vx * 9;
  if (br.step) {
    const st = br.step, f = g.parts[st.foot];
    const t = (G.t - st.t0) / st.dur;
    if (!f.attached || f.gone || t > 1.7) { br.step = null; return; }
    const legCap = f.side > 0 ? cap.legL : cap.legR;
    const L2 = st.foot.slice(-1);
    /* the swing leg goes soft and the foot is carried along an arc to where it lands */
    br.k['hip' + L2] = 0.25 * strength; br.k['knee' + L2] = 0.25 * strength;
    br.tgt['knee' + L2] = 0.4 * f.side; br.tgt['hip' + L2] = -0.15 * f.side;
    const tx = G.lerp(st.x0, st.x, clamp(t, 0, 1)), lift = Math.sin(Math.PI * clamp(t, 0, 1)) * 6 * S;
    const ty = s.floorY - f.def.wh[1] * S * 0.5 - lift + (t > 1 ? 3 * S : 0);
    pull(f.body, tx, ty, 16, h, BODY.massU * GRAV() * 2.2 * legCap * strength, g.parts.pelvis);
    if (t > 0.55 && BODY.grounded(f)) { br.step = null; br.nextStepOk = G.t + 0.06; G.emit('step', g, f); }
    return;
  }
  if (G.t < br.nextStepOk || sup.feet.length < 1) return;
  const outR = predX - sup.x1, outL = sup.x0 - predX;
  const need = outR > -hw * 0.15 || outL > -hw * 0.15 || br.ankleSat > 0.12;
  /* and to keep a sensible stance when nothing's pushing */
  const fL = g.parts.footL, fR = g.parts.footR;
  const width = fL.attached && fR.attached ? fL.body.position.x - fR.body.position.x : 9 * S;
  const tidy = !need && Math.abs(s.com.vx) < 0.4 && (width < 5 * S || width > 22 * S) && br.walkTo == null;
  if (!need && !tidy && br.walkTo == null) return;
  const dir = need ? (outR > outL ? 1 : -1) : br.walkTo != null ? Math.sign(br.walkTo - s.com.x) : (width < 5 * S ? (Math.random() < 0.5 ? 1 : -1) : (Math.abs(fL.body.position.x - s.com.x) > Math.abs(fR.body.position.x - s.com.x) ? 1 : -1));
  if (!need && br.walkTo != null && Math.abs(predX - cx) < hw * 0.5) return;
  /* SIMBICON: where the foot lands = a default stance + c_d * distance + c_v * velocity */
  const foot = dir > 0 ? fL : fR;
  if (!foot.attached || foot.gone) { if (need && br.ankleSat > 0.3) G.emit('voice', g, 'stagger', 0.5); return; }
  const other = foot === fL ? fR : fL;
  /* cv: put the foot near the capture point, x + v * sqrt(h / g), so one step can stop him */
  const cd = 0.3, cv = 17;
  let x = s.com.x + cd * (s.com.x - cx) + cv * s.com.vx + dir * 4.5 * S;
  if (tidy) x = s.com.x + dir * 4.7 * S;
  if (other.attached && !other.gone) x = dir > 0 ? Math.max(x, other.body.position.x + 6 * S) : Math.min(x, other.body.position.x - 6 * S);
  x = clamp(x, foot.body.position.x - 26 * S, foot.body.position.x + 26 * S);
  br.step = { foot: foot.id, x0: foot.body.position.x, x, t0: G.t, dur: (br.dodgeUntil || 0) > G.t ? 0.16 : need ? 0.22 : 0.3 };
}

/* ------------------------------------------------------------ a gun on him
   he has to be awake and able to see it (one eye will do), and the gun has to be on him: the sight on his body, or
   the line from the muzzle through the sight carrying on into him. the gun is drawn low and to one side of the sight,
   so that line is the way it's pointing */
function aimedAt(g) {
  if (!g.alive || !G.tools || !G.tools.current || G.tools.current() !== 'gun') return false;
  const P = G.tools.pointer; if (!P || P.over === false) return false;
  const eo = g.eyeOut || [0, 0]; if (eo[0] && eo[1]) return false;
  if (g.dm && (g.dm.cons < 0.45 || g.dm.stun > 0)) return false;
  const body = [];
  for (const p of g.list) if (p.attached && !p.gone && !p.removed && (A.TRUNK.has(p.kind) || p.kind === 'head' || p.kind === 'uarm' || p.kind === 'uleg')) body.push(p.body);
  if (!body.length) return false;
  if (G.M.Query.point(body, P).length) return true;
  /* a near miss still counts as being aimed at: a few pixels off his outline */
  for (const b of body) { const bb = b.bounds; if (P.x > bb.min.x - 5 && P.x < bb.max.x + 5 && P.y > bb.min.y - 5 && P.y < bb.max.y + 5 && G.M.Query.point([b], { x: P.x + clamp(b.position.x - P.x, -5, 5), y: P.y + clamp(b.position.y - P.y, -5, 5) }).length) return true; }
  const mz = G.tools.muzzle ? G.tools.muzzle() : null;
  if (mz) { const dx = P.x - mz.x, dy = P.y - mz.y; if (G.M.Query.ray(body, mz, { x: P.x + dx * 2.5, y: P.y + dy * 2.5 }, 3).length) return true; }
  return false;
}
/* move joint id's target and strength toward (t, k) by w (0..1): the pose he's in blends into the new one */
function blendTo(br, id, t, k, w) { br.tgt[id] = (br.tgt[id] || 0) + (t - (br.tgt[id] || 0)) * w; br.k[id] = (br.k[id] || 0) + (k - (br.k[id] || 0)) * w; }
/* how far into the hands-up pose he is (0..1): it comes up after a moment's reaction, eases down when the gun leaves
   him, and a shot or a hit knocks it out of him for a moment */
function surrender(g, h) {
  const br = g.br, aimed = aimedAt(g);
  br.aimT = aimed ? br.aimT + h : Math.max(0, br.aimT - h * 2);
  const flinch = G.t < (br.flinchUntil || 0);
  const want = aimed && br.aimT > 0.22 && !flinch ? 1 : 0;
  br.surr = (br.surr || 0) + (want - (br.surr || 0)) * Math.min(1, h * (want ? 3.4 : flinch ? 6 : 1.1));
  if (br.surr < 0.002) br.surr = 0;
  if (aimed) { const mz = G.tools.muzzle ? G.tools.muzzle() : G.tools.pointer; br.surrAway = Math.sign(br.s.com.x - (mz ? mz.x : br.s.com.x)) || 1; }
  /* he begs, now and then, while it's on him */
  if (want && br.surr > 0.6 && G.t - (br.said.plead || -9) > G.rnd(3.2, 5)) { br.said.plead = G.t; G.emit('voice', g, Math.random() < 0.7 ? 'plead' : 'whimper', 0.6); }
  return aimed;
}
/* the hands: what they're doing while he stands */
function hands(g, h, strength) {
  const br = g.br, s = br.s;
  const hd = g.parts.head; if (hd.gone || !hd.attached) return;
  surrender(g, h);
  const threatK = br.threat ? clamp(1.2 - br.threat.t, 0, 1) : 0;
  if (threatK > 0.2) { cover(g, br.threat.x, threatK * strength); return; }
  /* shot at, or just hit: he flinches and covers his head */
  if (G.t < (br.flinchUntil || 0) && br.aimT > 0) { const mz = G.tools && G.tools.muzzle ? G.tools.muzzle() : null; cover(g, mz ? mz.x : hd.body.position.x + 1, 0.8 * strength); return; }
  const k = br.surr || 0;
  if (k > 0.01) {
    /* both hands up beside his head: upper arms out and a little above level, forearms up, palms out at the gun.
       a tremble in it that gets worse the longer it goes on */
    const fear = clamp(0.5 + br.aimT * 0.15 + (g.dm ? g.dm.pain / 200 : 0), 0.5, 1.2);
    const sh = (Math.sin(G.t * 29 + g.id) * 0.04 + Math.sin(G.t * 11.3 + g.id * 2) * 0.03) * fear;
    for (const L2 of ['L', 'R']) {
      const sd = SIDE[L2], armCap = L2 === 'L' ? s.cap.armL : s.cap.armR;
      blendTo(br, 'shoulder' + L2, -sd * (1.74 + sh), 1.0 * strength * Math.max(0.25, armCap), k);
      blendTo(br, 'elbow' + L2, -sd * (1.42 + sh * 0.6), 0.9 * strength * Math.max(0.25, armCap), k);
      blendTo(br, 'wrist' + L2, sd * 0.22, 0.5 * strength, k);
    }
    /* chin down, head turned a little from it; knees soft, ready to go down */
    const away = br.surrAway || 1;
    blendTo(br, 'neck', -away * 0.14, 0.8 * strength * s.cap.neck, k);
    for (const L2 of ['L', 'R']) { const lc = L2 === 'L' ? s.cap.legL : s.cap.legR; blendTo(br, 'knee' + L2, SIDE[L2] * 0.14, 1.1 * strength * lc, k); blendTo(br, 'hip' + L2, -SIDE[L2] * 0.06, 1.0 * strength * lc, k); }
    if (k > 0.97) return;
  }
  /* holding what hurts */
  if (g.dm && g.dm.worst && g.dm.worst.pain > 0.35 && strength > 0.3 && k < 0.5) {
    const w = g.dm.worst, p = g.parts[w.part];
    if (p && p.attached && !p.gone) {
      const at = G.toWorld(p.body, 0, 0);
      const use = p.side > 0 ? 'R' : p.side < 0 ? 'L' : (s.cap.armR > s.cap.armL ? 'R' : 'L');
      if (!w.part.endsWith(use) || !A.ARM.has(p.kind)) setReach(g, 'a' + use, at.x, at.y, 0.55 * strength * (1 - k), false);
    }
  }
}
/* on the floor with a gun on him: both hands up toward it, palms out, between his face and the gun */
function handsDown(g, h, strength) {
  const br = g.br, s = br.s, hd = g.parts.head;
  if (hd.gone || !hd.attached) return;
  surrender(g, h);
  const k = br.surr || 0; if (k < 0.05) return;
  const P = G.tools.pointer, hp = hd.body.position;
  for (const L2 of ['L', 'R']) {
    const sh = g.jointById['shoulder' + L2]; if (!sh || sh.broken) continue;
    const o = BODY.pivot(sh), dx = P.x - o.x, dy = P.y - o.y, d = Math.hypot(dx, dy) || 1, r = ARM * 0.62;
    const tx = o.x + dx / d * r + (hp.x - o.x) * 0.25, ty = o.y + dy / d * r - 4 * S;
    setReach(g, 'a' + L2, tx, ty, 0.8 * strength * k * (L2 === 'L' ? s.cap.armL : s.cap.armR), false);
    br.tgt['wrist' + L2] = SIDE[L2] * 0.2; br.k['wrist' + L2] = 0.4 * strength * k;
  }
}
function cover(g, fromX, k) {
  const br = g.br, hd = g.parts.head;
  const side = fromX > hd.body.position.x ? 1 : -1;
  for (const L2 of ['L', 'R']) {
    const sd = SIDE[L2];
    br.tgt['shoulder' + L2] = -sd * (sd === side ? 2.6 : 2.1); br.k['shoulder' + L2] = 1.2 * k;
    br.tgt['elbow' + L2] = sd * 2.2; br.k['elbow' + L2] = 1.1 * k;
  }
  br.tgt.neck = -side * 0.45; br.k.neck = 1.0 * k;
}

/* ---- falling: arms toward the floor on the side he's going, head away from it */
function fall(g, h) {
  const br = g.br, s = br.s, cap = s.cap, strength = Math.min(cap.will, cap.cons);
  rest(g, 0.35 * strength);
  const dir = s.com.vx > 0.3 ? 1 : s.com.vx < -0.3 ? -1 : (wrap(s.chA) > 0 ? -1 : 1) * -1;
  const fy = s.floorY;
  for (const L2 of ['L', 'R']) {
    const sh = g.jointById['shoulder' + L2]; if (!sh || sh.broken) continue;
    const o = BODY.pivot(sh), armCap = L2 === 'L' ? cap.armL : cap.armR, hand = g.parts['hand' + L2];
    /* the arm on the side he's going goes under his shoulder, a strut; the other one reaches across.
       the hand goes no further than the arm reaches, so it meets the floor at the speed he's falling,
       not at the speed of a swing */
    const lead = Math.sign(o.x - s.com.x) === dir;
    let tx = o.x + dir * L * (lead ? 0.12 : 0.3), ty = fy - 2 * S;
    const dx = tx - o.x, dy = ty - o.y, d = Math.hypot(dx, dy) || 1, far = ARM * 0.9;
    if (d > far) { tx = o.x + dx / d * far; ty = o.y + dy / d * far; }
    const planted = hand.attached && !hand.gone && hand.contacts.some(c => c.n.y < -0.3);
    setReach(g, 'a' + L2, tx, ty, (planted ? 1.1 : 0.75) * strength * armCap, false);
    br.k['wrist' + L2] = 0.6 * strength;
    if (planted) strut(g, L2, strength * armCap);
  }
  /* the head: held up, away from the floor, as hard as the neck can */
  br.tgt.neck = worldT(g, 'neck', -dir * 0.5); br.k.neck = 1.5 * strength * cap.neck;
  /* the legs give: he folds on the way down instead of going over like a plank */
  for (const L2 of ['L', 'R']) { br.tgt['knee' + L2] = SIDE[L2] * 0.9; br.k['knee' + L2] = 0.25 * strength; br.tgt['hip' + L2] = -SIDE[L2] * 0.5; br.k['hip' + L2] = 0.3 * strength; }
  br.tgt.waist = -dir * 0.25; br.k.waist = 0.6 * strength; br.tgt.spine = -dir * 0.2; br.k.spine = 0.6 * strength;
  guard(g, strength, true);
  headGuard(g, strength);
}
/* the neck braces: near the floor, the head is held to the trunk's motion, hardest in the direction of the floor, so
   when his shoulder lands the head stops with it instead of carrying on into the floor. head and chest pull on each
   other, equal and opposite, no harder than a neck can */
function headGuard(g, k) {
  const hd = g.parts.head, ch = g.parts.chest, s = g.br.s, nk = g.jointById.neck;
  if (hd.gone || !hd.attached || !ch.attached || !nk || nk.broken || k < 0.15) return;
  if (s.floorY - hd.body.position.y > L * 0.5) return;
  const rvx = hd.body.velocity.x - ch.body.velocity.x, rvy = hd.body.velocity.y - ch.body.velocity.y;
  const dms = hd.body.deltaTime || 16.667, mh = hd.body.mass / (dms * dms);
  let fx = -rvx * mh * 0.3, fy = -Math.max(0, rvy) * mh * 0.6;
  const cap = 0.45 * k * s.cap.neck * BODY.mass(g) * GRAV(), m = Math.hypot(fx, fy);
  if (m > cap) { fx *= cap / m; fy *= cap / m; }
  hd.body.force.x += fx; hd.body.force.y += fy; ch.body.force.x -= fx; ch.body.force.y -= fy;
}
/* an arm with its hand planted takes his weight like a strut: the elbow gives a little under it, and the push
   along the arm slows the shoulder coming down. hand and chest push on each other, equal and opposite, the floor
   taking the hand's half, so nothing here makes or loses momentum that a real arm wouldn't */
const ARM = 36 * S;                                                    /* shoulder to the middle of the hand */
function strut(g, L2, k) {
  const hand = g.parts['hand' + L2], ch = g.parts.chest, sh = g.jointById['shoulder' + L2];
  if (!ch.attached || !hand.attached || !sh || sh.broken || k <= 0.05) return;
  const o = BODY.pivot(sh), hp = hand.body.position;
  let ux = o.x - hp.x, uy = o.y - hp.y; const d = Math.hypot(ux, uy) || 1; ux /= d; uy /= d;
  if (d > ARM * 1.08 || uy > -0.25) return;                         /* not under him, so not holding him */
  const vx = ch.body.velocity.x - hand.body.velocity.x, vy = ch.body.velocity.y - hand.body.velocity.y;
  const close = -(vx * ux + vy * uy);                                /* the shoulder coming at the hand, px per step */
  if (close <= 0) return;
  const dms = ch.body.deltaTime || 16.667, M = BODY.mass(g) * 0.55;
  const F = Math.min(M * close * 0.3 / (dms * dms), 1.4 * k * BODY.mass(g) * GRAV());
  ch.body.force.x += ux * F; ch.body.force.y += uy * F;
  hand.body.force.x -= ux * F; hand.body.force.y -= uy * F;
}
/* the head and the trunk, swinging toward the floor faster than he'd let them: neck and back stiffen and slow it */
function guard(g, k, keepNeck) {
  const br = g.br, s = br.s, hd = g.parts.head, ch = g.parts.chest;
  if (hd.gone || !hd.attached || k < 0.2) return;
  const toFloor = hd.body.velocity.y, near = s.floorY - hd.body.position.y;
  if (!keepNeck && toFloor > 1.5 && near < L * 0.45) {
    const nk = g.jointById.neck; if (nk && !nk.broken) { br.tgt.neck = BODY.rel(nk); br.k.neck = Math.max(br.k.neck || 0, 1.5 * k * s.cap.neck); }
  }
  if (Math.abs(ch.body.angularVelocity) * 60 > 3) for (const id of ['spine', 'waist']) {
    const j = g.jointById[id]; if (!j || j.broken) continue;
    br.tgt[id] = BODY.rel(j); br.k[id] = Math.max(br.k[id] || 0, 1.0 * k * s.cap.core);
  }
}
/* ---- in the air: everything goes, then he braces */
function air(g, h) {
  const br = g.br, s = br.s, cap = s.cap, strength = Math.min(cap.will, cap.cons);
  rest(g, 0.5 * strength);
  const ph = G.t * 9 + g.id;
  for (const L2 of ['L', 'R']) {
    const sd = SIDE[L2];
    br.tgt['shoulder' + L2] = -sd * (1.6 + Math.sin(ph + (sd > 0 ? 0 : 2)) * 1.1); br.k['shoulder' + L2] = 0.8 * strength;
    br.tgt['elbow' + L2] = sd * (0.6 + Math.sin(ph * 1.3) * 0.5);
    br.tgt['hip' + L2] = -sd * (0.3 + Math.sin(ph * 0.9 + (sd > 0 ? 0 : 3)) * 0.35);
    br.tgt['knee' + L2] = sd * (0.5 + Math.sin(ph * 1.1) * 0.4);
  }
  /* falling toward the floor fast: arms down */
  const vy = s.com.vy, timeTo = vy > 0.5 ? (s.floorY - s.com.y - L * 0.3) / (vy * 60) : 9;
  if (timeTo < 0.35 && vy > 4) fall(g, h);
  if (br.air > 0.3 && !br.screamedAir) { br.screamedAir = true; G.emit('voice', g, 'air', clamp(s.v / 14, 0.4, 1.2)); }
}
/* ---- held: kick, reach for the hand that's got him */
function held(g, h) {
  const br = g.br, s = br.s, cap = s.cap, strength = Math.min(cap.will, cap.cons), hp = s.held;
  rest(g, 0.45 * strength);
  const ph = G.t * 13 + g.id, panic = clamp(0.5 + (g.dm ? g.dm.pain / 120 : 0) + Math.min(1, br.heldT), 0.5, 1.4);
  const mp = s.mouse;
  for (const L2 of ['L', 'R']) {
    const sd = SIDE[L2], lc = L2 === 'L' ? cap.legL : cap.legR;
    br.tgt['hip' + L2] = -sd * (0.15 + Math.sin(ph + (sd > 0 ? 0 : Math.PI)) * 0.55 * panic); br.k['hip' + L2] = 0.7 * strength * lc;
    br.tgt['knee' + L2] = sd * (0.45 + Math.sin(ph * 1.07 + 1) * 0.45 * panic); br.k['knee' + L2] = 0.6 * strength * lc;
  }
  /* the free hands go for whatever has him */
  for (const L2 of ['L', 'R']) {
    const armCap = L2 === 'L' ? cap.armL : cap.armR;
    if (hp.id.endsWith(L2) && A.ARM.has(hp.kind)) continue;
    if (br.sub === 'dragged') { const sh = g.jointById['shoulder' + L2]; if (sh && !sh.broken) { const o = BODY.pivot(sh); setReach(g, 'a' + L2, o.x + G.sign(o.x - s.com.x) * L * 0.2, s.floorY, 0.9 * strength * armCap, false); } continue; }
    setReach(g, 'a' + L2, mp.x + Math.sin(ph * 0.7 + (L2 === 'L' ? 0 : 2)) * 6 * S, mp.y + 4 * S, 0.8 * strength * armCap, false);
  }
  br.tgt.neck = 0; br.k.neck = 0.6 * strength;
  if (br.heldT > 0.15 && !br.saidHeld) { br.saidHeld = true; G.emit('voice', g, 'lifted', panic); }
}
/* ---- pinned under something heavy: shove it */
function pinned(g, h) {
  const br = g.br, s = br.s, cap = s.cap, strength = Math.min(cap.will, cap.cons) * (g.dm ? clamp(g.dm.oxy * 1.3, 0.1, 1) : 1);
  rest(g, 0.4 * strength);
  const on = g.dm && g.dm.loadOn ? g.dm.loadOn : null, ph = G.t * 7 + g.id;
  for (const L2 of ['L', 'R']) {
    const armCap = L2 === 'L' ? cap.armL : cap.armR;
    if (on) setReach(g, 'a' + L2, on.x + SIDE[L2] * 8 * S, on.y + Math.sin(ph + (L2 === 'L' ? 0 : 1.6)) * 5 * S, 1.2 * strength * armCap, true);
    br.tgt['hip' + L2] = -SIDE[L2] * (0.3 + Math.sin(ph * 1.2 + (L2 === 'L' ? 0 : 2)) * 0.5); br.k['hip' + L2] = 0.8 * strength;
    br.tgt['knee' + L2] = SIDE[L2] * (0.6 + Math.sin(ph * 1.5) * 0.5); br.k['knee' + L2] = 0.7 * strength;
  }
  if (G.t - (br.said.pinned || -9) > 2.2) { br.said.pinned = G.t; G.emit('voice', g, 'strain', strength); }
}
/* ---- on the floor */
function lie(g, h) {
  const br = g.br, s = br.s, cap = s.cap, strength = Math.min(cap.will, cap.cons);
  rest(g, 0.22 * strength);
  const down = G.t - br.lyingT, pain = g.dm ? g.dm.pain : 0;
  /* he holds what hurts and curls round it */
  if (pain > 30 && strength > 0.25) {
    const w = g.dm && g.dm.worst, p = w && g.parts[w.part];
    if (p && p.attached && !p.gone) {
      const at = p.body.position;
      for (const L2 of ['L', 'R']) { if (p.id.endsWith(L2) && A.ARM.has(p.kind)) continue; setReach(g, 'a' + L2, at.x, at.y, 0.5 * strength * (L2 === 'L' ? cap.armL : cap.armR), false); }
    }
    const rock = Math.sin(G.t * 2.4 + g.id) * 0.15;
    for (const L2 of ['L', 'R']) { br.tgt['hip' + L2] = -SIDE[L2] * (0.35 + rock); br.k['hip' + L2] = 0.35 * strength; br.tgt['knee' + L2] = SIDE[L2] * 0.8; br.k['knee' + L2] = 0.35 * strength; }
    if (G.t - (br.said.writhe || -9) > G.rnd(2.5, 4.5)) { br.said.writhe = G.t; G.emit('voice', g, pain > 70 ? 'scream' : 'groan', clamp(pain / 90, 0.3, 1.2)); }
  }
  handsDown(g, h, strength);
  guard(g, strength);
  if (down < 0.8) headGuard(g, strength);
  /* getting up: when the dizziness has passed, if there's anything to get up with */
  const legs = Math.max(cap.legL, cap.legR), arms = Math.max(cap.armL, cap.armR);
  const able = strength > 0.45 && cap.core > 0.25 && (legs > 0.35 || arms > 0.6) && br.fatigue < 1 && (Math.min(cap.legL, cap.legR) >= 0.3 || br.tries < 2);
  const wait = 1.0 + (1 - strength) * 2.2 + br.fatigue * 2.5 + (g.dm ? g.dm.stun + (g.dm.daze || 0) * 0.4 + Math.min(1.5, g.dm.pain / 120) : 0);
  if (able && down > wait && s.v < 2.5) { startGetup(g); }
  br.fatigue = Math.max(0, br.fatigue - h * 0.05);
}

/* ---- getting up, in stages. each stage has a target, a help force sized by the strength he really has in the
   parts that stage uses, and a time limit. if he isn't getting anywhere, he slumps and tries again later */
function startGetup(g) {
  const br = g.br, s = br.s, ch = g.parts.chest, pel = g.parts.pelvis;
  if (!pel.attached || !ch.attached) return;
  /* which way his head is from his hips decides which arm is underneath */
  const dir = ch.body.position.x < pel.body.position.x ? -1 : 1;
  br.getup = { stage: 0, t0: G.t, dir, best: 0, bestT: G.t, x: pel.body.position.x };
  br.tries++;
  setMode(g, 'getup', 'push');
  G.emit('voice', g, 'effort', 0.6);
}
function getup(g, h) {
  const br = g.br, s = br.s, cap = s.cap, gu = br.getup, strength = Math.min(cap.will, cap.cons);
  const ch = g.parts.chest, pel = g.parts.pelvis, hd = g.parts.head;
  if (!gu || !pel.attached || !ch.attached) { br.getup = null; setMode(g, 'lie'); return; }
  const legs = (cap.legL + cap.legR) / 2, arms = (cap.armL + cap.armR) / 2, legBest = Math.max(cap.legL, cap.legR);
  const W = weight(g), fy = G.H() - 1, t = G.t - gu.t0;
  rest(g, 0.6 * strength);
  /* where his feet should end up: under his hips */
  const px = pel.body.position.x;
  const progress = clamp((fy - ch.body.position.y) / (L * 0.72), 0, 1.2);
  if (progress > gu.best + 0.03) { gu.best = progress; gu.bestT = G.t; }
  const fail = () => {
    br.getup = null; br.fatigue += 0.28 + (1 - strength) * 0.3; br.lyingT = G.t;
    br.slumpUntil = G.t + 0.45;
    setMode(g, 'lie'); G.emit('voice', g, 'fail', 0.7); G.emit('getup-fail', g);
  };
  if (G.t - gu.bestT > 1.4 || t > 6.5 || strength < 0.3) { fail(); return; }
  if (gu.stage === 0) {
    /* up off the floor: the trunk swings up toward upright about the hips, the arms pushing, the legs folding under.
       in this view a man can't sit up sideways (a hip doesn't fold that way), so the whole trunk comes up together */
    const able = Math.min(1, arms * 0.5 + cap.core * 0.5 + 0.1) * strength;
    /* the turn comes from his hands and arms on the floor, so the floor takes it back, not his legs: the leg
       underneath has to come up with his hips (it's at the end of its range), and pushing it back down would fight that */
    upright(g, pel, 0, 1.7 * able, h, null, 5);
    const help = 0.6 + 0.9 * able;                                     /* x the weight it lifts: under 1, he can't */
    lift(g, TRUNK_ALL, 'chest', px, fy - L * 0.55, 4, h, help, PUSH_ON);
    /* both hands to the floor on the head's side of the shoulders, the elbows bent out, as if pushing up */
    for (const L2 of ['L', 'R']) { const sh = g.jointById['shoulder' + L2]; if (!sh || sh.broken) continue; const o = BODY.pivot(sh); setReach(g, 'a' + L2, o.x + gu.dir * 12 * S, fy - 2 * S, 0.75 * strength * (L2 === 'L' ? cap.armL : cap.armR), true); }
    gather(g, 0.9 * strength);
    if (progress > 0.45 && Math.abs(wrap(pel.body.angle)) < 0.7) { gu.stage = 1; gu.t1 = G.t; br.sub = 'crouch'; }
  } else if (gu.stage === 1) {
    /* feet under him, hips square: a crouch */
    const help = 0.6 + 0.9 * Math.min(1, legBest * 0.9 + 0.1) * strength;
    lift(g, HIPS, 'pelvis', px, fy - L * 0.3, 5, h, help, CROUCH_ON);
    lift(g, TOP, 'chest', px, fy - L * 0.62, 5, h, help, CROUCH_ON);
    upright(g, pel, 0, 0.9 * strength * cap.core, h, null, 7);
    gather(g, 1.2 * strength);
    for (const L2 of ['L', 'R']) { const f = g.parts['foot' + L2]; if (f.attached && !f.gone) pull(f.body, px + SIDE[L2] * 6 * S, fy - 2 * S, 10, h, W * 0.3 * strength, pel); }
    const canStand = Math.min(cap.legL, cap.legR) >= 0.3;
    if (canStand && G.t - gu.t1 > 0.45 && Math.abs(wrap(pel.body.angle)) < 0.45 && progress > 0.6) { gu.stage = 2; gu.t2 = G.t; br.sub = 'rise'; G.emit('voice', g, 'effort', 0.8); }
    /* up on his knees, but one leg won't take him the rest of the way */
    else if (!canStand && G.t - gu.t1 > 1.6) { fail(); return; }
  } else {
    /* and up: the legs straighten under the help their own strength buys */
    const k = clamp((G.t - gu.t2) / 0.9, 0, 1);
    const help = 0.55 + 0.9 * Math.min(1, legs * 0.75 + legBest * 0.3) * strength;
    lift(g, HIPS, 'pelvis', px, fy - L * G.lerp(0.32, 0.52, k), 5.5, h, help, RISE_ON);
    lift(g, TOP, 'chest', px, fy - L * G.lerp(0.62, 0.74, k), 5.5, h, help, RISE_ON);
    upright(g, pel, 0, 1.0 * strength * cap.core, h, null, 7);
    for (const L2 of ['L', 'R']) { const lc = L2 === 'L' ? cap.legL : cap.legR; br.tgt['hip' + L2] = G.lerp(-SIDE[L2] * 0.7, 0, k); br.k['hip' + L2] = 1.1 * strength * lc; br.tgt['knee' + L2] = G.lerp(SIDE[L2] * 1.3, 0, k); br.k['knee' + L2] = 1.2 * strength * lc; }
    if (k >= 1 && s.foot.any && s.pelH > s.standH * 0.8 && s.trunkTilt < 0.35) {
      br.getup = null; br.tries = 0; br.settleUntil = G.t + 0.9; setMode(g, 'stand'); G.emit('getup-done', g);
      if (g.home && Math.abs(G.homeX() - px) > 40 * S) br.walkTo = G.homeX();
    }
  }
  br.tgt.neck = worldT(g, 'neck', 0); br.k.neck = 0.8 * strength * cap.neck;
}
/* the help a get-up gets: a lift on a group of his parts, as one, toward where one of them should be, sized by the
   mass it lifts and never more than the strength he has for that stage. it only exists while something he can push
   with is on the floor (hands and arms for the push, feet and shins for the crouch and the rise), and those parts
   push down on the floor just as hard: he gets up off the floor, he never floats up */
const UPPER = ['chest', 'head', 'abdomen', 'uarmL', 'uarmR', 'larmL', 'larmR', 'handL', 'handR'];
const TRUNK_ALL = UPPER.concat(['pelvis']);
const HIPS = ['pelvis', 'abdomen'], TOP = ['chest', 'head', 'uarmL', 'uarmR', 'larmL', 'larmR', 'handL', 'handR'];
const PUSH_ON = ['handL', 'handR', 'larmL', 'larmR', 'uarmL', 'uarmR', 'pelvis', 'ulegL', 'ulegR', 'llegL', 'llegR'];
const CROUCH_ON = ['footL', 'footR', 'llegL', 'llegR', 'handL', 'handR'], RISE_ON = ['footL', 'footR'];
function lift(g, ids, ref, tx, ty, w0, h, times, on) {
  const r = g.parts[ref]; if (!r || !r.attached || r.gone || times <= 0) return 0;
  const sup = [];
  for (const id of on) { const p = g.parts[id]; if (p && p.attached && !p.gone && p.contacts.some(c => c.n.y < -0.45)) sup.push(p); }
  if (!sup.length) return 0;
  const b = r.body, wh = Math.min(0.5, w0 * h), dms = b.deltaTime || 16.667, d2 = dms * dms;
  const ax = wh * wh * (tx - b.position.x) - 2 * 0.9 * wh * b.velocity.x;
  const ay = wh * wh * (ty - b.position.y) - 2 * 0.9 * wh * b.velocity.y;
  let M = 0; const ps = [];
  for (const id of ids) { const p = g.parts[id]; if (p && p.attached && !p.gone && !sup.includes(p)) { ps.push(p); M += p.body.mass; } }
  if (!M) return 0;
  const maxF = times * M * GRAV();                                    /* a multiple of the group's own weight */
  /* what it takes to move the group that way, and to hold its weight while it does */
  let fx = ax * M / d2, fy = ay * M / d2 - M * GRAV();
  if (fy > 0) fy = 0;                                                 /* it can push him up, never pull him down */
  const m = Math.hypot(fx, fy); if (m > maxF) { fx *= maxF / m; fy *= maxF / m; }
  for (const p of ps) { const k = p.body.mass / M; p.body.force.x += fx * k; p.body.force.y += fy * k; }
  for (const p of sup) { p.body.force.x -= fx / sup.length; p.body.force.y -= fy / sup.length; }
  return Math.hypot(fx, fy);
}
/* fold the legs into a crouch */
function gather(g, k) {
  const br = g.br, cap = br.s.cap;
  for (const L2 of ['L', 'R']) {
    const lc = L2 === 'L' ? cap.legL : cap.legR;
    br.tgt['hip' + L2] = -SIDE[L2] * 0.75; br.k['hip' + L2] = k * lc;
    br.tgt['knee' + L2] = SIDE[L2] * 1.35; br.k['knee' + L2] = k * lc;
    br.tgt['ankle' + L2] = worldT(g, 'ankle' + L2, 0); br.k['ankle' + L2] = 0.5 * k;
  }
  br.tgt.waist = 0; br.tgt.spine = 0; br.k.waist = br.k.spine = k * cap.core;
}

/* ---- out cold, or worse */
function limp(g, h) { rest(g, 0.06); g.br.surr = Math.max(0, (g.br.surr || 0) - h * 2); }
function dead(g, h) {
  rest(g, 0); g.br.surr = 0;
  const since = G.t - (g.diedT || G.t);
  if (since < 3.5 && Math.random() < 0.03) { const p = G.pick(g.list.filter(q => q.attached && !q.gone && A.LIMB.has(q.kind))); if (p) B.setAngularVelocity(p.body, p.body.angularVelocity + G.rnd(-0.12, 0.12)); }
}

/* ------------------------------------------------------------ the eyes and the neck: what's he looking at */
function looking(g, h) {
  const br = g.br, s = br.s, hd = g.parts.head;
  if (hd.gone || !hd.attached) return;
  let tgt = null;
  if (br.threat) tgt = { x: br.threat.x, y: br.threat.y };
  else if (G.tools && G.tools.pointer) tgt = G.tools.pointer;
  if (G.focus && G.t - G.focus.t < 1.5) tgt = G.focus;
  if (!tgt) return;
  const l = G.dirLocal(hd.body, tgt.x - hd.body.position.x, tgt.y - hd.body.position.y), m = Math.hypot(l.x, l.y) || 1;
  br.eye.x += (l.x / m - br.eye.x) * 0.2; br.eye.y += (l.y / m - br.eye.y) * 0.2;
  if (br.mode === 'stand' && !br.threat && br.aimT < 0.35) { br.tgt.neck = clamp((tgt.x - hd.body.position.x) / L * 0.6, -0.3, 0.3) + (br.tgt.neck || 0) * 0.3; br.k.neck = Math.max(br.k.neck || 0, 0.7 * Math.min(s.cap.will, s.cap.cons) * s.cap.neck); }
}
/* anything coming at his head fast */
function threats(g) {
  const br = g.br, hd = g.parts.head; br.threat = null;
  if (hd.gone || !hd.attached || !g.alive || br.s.cap.cons < 0.4) return;
  const hx = hd.body.position.x, hy = hd.body.position.y;
  let best = null;
  for (const b of G.fridges()) {
    const vx = b.velocity.x, vy = b.velocity.y, sp = Math.hypot(vx, vy); if (sp < 4) continue;
    const dx = hx - b.position.x, dy = hy - b.position.y;
    const tc = (dx * vx + dy * vy) / (sp * sp); if (tc < 0 || tc > 36) continue;          /* steps until closest */
    const cx = b.position.x + vx * tc - hx, cy = b.position.y + vy * tc - hy;
    if (Math.hypot(cx, cy) > L * 0.45 + 50) continue;
    if (!best || tc < best.tc) best = { tc, x: b.position.x, y: b.position.y, t: tc / 60, body: b };
  }
  if (!best && br.cursorThreat && G.t < br.cursorThreat.until) best = br.cursorThreat;
  if (best) { br.threat = best; if (!br.sawThreat || G.t - br.sawThreat > 2) { br.sawThreat = G.t; G.emit('voice', g, 'alarm', 0.8); } }
}

/* ------------------------------------------------------------ every step */
BR.update = function (g, h) {
  if (!g.br) BR.init(g);
  const br = g.br;
  for (const j of g.joints) { j.hyper = 0; j.hyperW = 0; j.limTau = 0; }
  sense(g, h);
  if (g.alive) threats(g);
  choose(g, h);
  switch (br.mode) {
    case 'stand': stand(g, h); break;
    case 'fall': fall(g, h); break;
    case 'air': air(g, h); break;
    case 'held': held(g, h); break;
    case 'pinned': pinned(g, h); break;
    case 'lie': lie(g, h); break;
    case 'getup': getup(g, h); break;
    case 'limp': limp(g, h); break;
    default: dead(g, h);
  }
  if (br.mode !== 'held') br.saidHeld = false;
  if (br.mode !== 'air') br.screamedAir = false;
  if (g.alive) looking(g, h);
  const dbg = G.dbg || {};
  if (!dbg.noLimit) limits(g, h);
  /* a hit makes the muscles let go for a moment, and so does a failed try at getting up */
  const ease = (g.dm ? 1 - clamp(g.dm.jolt, 0, 0.85) : 1) * (G.t < (br.slumpUntil || 0) ? 0.15 : 1);
  for (const j of g.joints) {
    if (j.broken) continue;
    /* a piece that came off has no say in anything any more: only its joints' limits are left */
    const live = j.a.attached && j.b.attached;
    if (!dbg.noMuscle) muscle(g, j, br.tgt[j.id] || 0, live ? (br.k[j.id] || 0) * ease : 0, h);
  }
  if (!dbg.noStop) stops(g, h);
};
/* the stops. each joint's second pin holds it at the end of its range when it gets there. it's one of Matter's own
   constraints, solved in the same passes as the pins and the contacts, so it takes loads and impacts like a pin.
   it holds where the joint met it (never snapping a joint that's already past back in one go, which would come
   back out as speed), eases that hold back to the end of the range, and lets go as soon as anything pulls the
   joint back into its range: the muscles, a hand dragging the limb, the way he lands */
const STOP_STIFF = 0.4;
/* how far one pass of the solver swings the hold's two ends, against the gap it's closing: Matter turns each body by
   the lever times the push over its inertia, so a hold point far out from a small piece (the stub of a bone broken
   near its end) would spin that stub further every pass than the gap it was meant to close, and the leg flies apart.
   his own joints sit between 0.6 and 2.8; past STOP_X the hold point comes in toward the pin until it's back under */
const STOP_X = 3.2;
function holdX(a, b, qx, qy) {
  const ax = qx - a.position.x, ay = qy - a.position.y, bx = qx - b.position.x, by = qy - b.position.y;
  return ((ax * ax + ay * ay) * a.inverseInertia + (bx * bx + by * by) * b.inverseInertia) / (a.inverseMass + b.inverseMass + a.inverseInertia + b.inverseInertia);
}
function stops(g, h) {
  for (const j of g.joints) {
    const w = j.lc; if (!w) continue;
    if (j.broken || !j.c) { if (j.stop) { w.stiffness = 0; w.damping = 0; j.stop = 0; } continue; }
    const a = j.a.body, b = j.b.body, dms = b.deltaTime || 16.667, d2 = dms * dms;
    const rel = BODY.rel(j);
    /* where the step will take it: its own turning, plus what this step's torques (the muscles) add */
    const wa = (a.angle - a.anglePrev) * (1 - a.frictionAir) + a.torque / a.inertia * d2;
    const wb = (b.angle - b.anglePrev) * (1 - b.frictionAir) + b.torque / b.inertia * d2;
    const next = rel + wb - wa;
    if (j.stop) {
      /* heading back into the range, or already pulled there past what the hold leaves as give: let go */
      if (j.stop > 0 ? next < j.stopAt - 0.002 || rel < j.stopAt - 0.004 : next > j.stopAt + 0.002 || rel > j.stopAt + 0.004) { w.stiffness = 0; w.damping = 0; j.stop = 0; continue; }
      const lim = j.stop > 0 ? j.lim[1] : j.lim[0];
      j.stopAt = j.stop > 0 ? Math.max(lim, j.stopAt - 0.03) : Math.min(lim, j.stopAt + 0.03);
    } else {
      if (next > j.lim[1] || rel > j.lim[1]) { j.stop = 1; j.stopAt = Math.min(Math.max(rel, j.lim[1]), j.lim[1] + 0.15); }
      else if (next < j.lim[0] || rel < j.lim[0]) { j.stop = -1; j.stopAt = Math.max(Math.min(rel, j.lim[0]), j.lim[0] - 0.15); }
      else continue;
      w.stiffness = (G.dbg && G.dbg.stopStiff) || STOP_STIFF; w.damping = 0.05;
    }
    /* the hold, re-aimed every step: a point out along the child, and where that point sits when the joint is at
       the held angle */
    const piv = BODY.pivot(j), dl = j.stopAt - rel;
    let f = 2;
    for (let i = 0; i < 8 && holdX(a, b, piv.x + (b.position.x - piv.x) * f, piv.y + (b.position.y - piv.y) * f) > STOP_X; i++) f *= 0.7;
    const qx = piv.x + (b.position.x - piv.x) * f, qy = piv.y + (b.position.y - piv.y) * f;
    const c = Math.cos(dl), sn = Math.sin(dl), rx = qx - piv.x, ry = qy - piv.y;
    w.pointA = { x: piv.x + rx * c - ry * sn - a.position.x, y: piv.y + rx * sn + ry * c - a.position.y }; w.angleA = a.angle;
    w.pointB = { x: qx - b.position.x, y: qy - b.position.y }; w.angleB = b.angle;
  }
}
/* positions after the solver: a joint bent way past anything possible is put back to its limit */
BR.clamp = function (g) {
  if (G.dbg && G.dbg.noClamp) return;
  for (const j of g.joints) {
    if (j.broken || !j.c) continue;
    const rel = BODY.rel(j);
    /* how far past its stop this step left it: what the joint's injuries are judged on */
    j.over = rel < j.lim[0] ? j.lim[0] - rel : rel > j.lim[1] ? rel - j.lim[1] : 0;
    const lo = j.lim[0] - 0.5, hi = j.lim[1] + 0.5;
    if (rel >= lo && rel <= hi) continue;
    const e = rel < lo ? rel - lo : rel - hi, piv = BODY.pivot(j), sub = g.br.sub2[j.id];
    const ib = groupI(g, sub, true, piv, j), ia = groupI(g, sub, false, piv, j), sb = ia / (ia + ib), sa = ib / (ia + ib);
    for (const p of g.list) {
      if (inGroup(g, p, sub, true, j)) B.rotate(p.body, -e * sb, piv);
      else if (inGroup(g, p, sub, false, j)) B.rotate(p.body, e * sa, piv);
    }
    j.forced = Math.max(j.forced || 0, Math.abs(e));
  }
};
BR.mode = g => g.br ? g.br.mode : 'stand';
/* hit: whatever pose he was holding, he lets go of it for a moment */
G.on('hurt', (g, p, h) => { if (g.br && g.alive && !(h && h.quiet && h.srcKind === 'staple')) g.br.flinchUntil = G.t + 0.65; });
/* a gun going off near him: he jumps */
G.on('gunfire', (x, y, tx, ty) => { for (const g of G.guys) { if (!g.br || !g.alive || g.cleared) continue; const c = g.br.s && g.br.s.com; if (c && Math.hypot(c.x - tx, c.y - ty) < L * 0.9) g.br.flinchUntil = Math.max(g.br.flinchUntil || 0, G.t + 0.35); } });
})();
