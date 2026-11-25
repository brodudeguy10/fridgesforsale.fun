/* ============================================================
   THE GUY, version three: damage.
   one framework for every way he gets hurt. a hammer, a fridge, the
   floor after a fall, his own severed leg swung at him: each arrives
   as the same kind of event (how fast, how much mass behind it, how
   much of an area it landed on, which way, where on him), and the
   same tissues answer it.

   the tissues are layered the way Dead Island 2's FLESH describes
   its zombies (skin, fat and muscle, bone, organs): a hit spends its
   energy on the outer layers first, and what's left goes deeper. a
   layer that's already gone soaks nothing, so the second hit on the
   same bruise does more than the first did, without anything being
   multiplied up: the padding just isn't there any more.

   severity is kept per region on the Abbreviated Injury Scale (AIS:
   1 minor, 2 moderate, 3 serious, 4 severe, 5 critical, 6 maximal),
   and the Injury Severity Score is the sum of the squares of the
   worst three body regions, the way trauma units add it up.

   his blood, breathing and consciousness run off what the tissues
   say. when he dies, the cause is written the way a death
   certificate writes it: what killed him, what that was due to, and
   what else was wrong with him. every event is recorded as it
   happens, so the x-ray afterwards only shows what happened.
============================================================ */
(function () {
'use strict';
const G = window.__G3; if (!G || !G.body) return;
const A = G.A, B = G.B, BODY = G.body, S = G.S, clamp = G.clamp;
const D = G.dmg = {};
const T = G.TUNE;
const L = G.HEIGHT_U * S;
const KMH = 3.6;
const GSTEP = () => G.engine.gravity.y * G.engine.gravity.scale;

/* ------------------------------------------------------------ the knobs, together */
const K = D.K = {
  minJ: 1.2,               /* anything softer than this is just touching */
  cool: 0.08,              /* s between two counted hits on the same part */
  conc: { broad: 1, edge: 2.1, point: 2.9 },
  fallH: 0.45,             /* m of free fall before a landing counts as a fall */
  dazePerJ: 0.06,          /* s of ringing head per joule to it */
  koJ: 45, koSpan: 60,     /* J to the head where being knocked out starts, and how much more makes it certain */
  bleedLac: 0.9,           /* ml/s per cm of open laceration (scalp x2) */
  crush: { thorax: [550, 2600], neck: [260, 1400], abdomen: [900, 3800], head: [3200, 8500], pelvis: [2500, 6500], limb: [1500, 4200] },
  hyperSprain: 0.5, hyperDisloc: 1.3, hyperBreak: 2.4,
  tear: 10                 /* px of pin stretch (x S) before a joint starts to give */
};

/* ------------------------------------------------------------ bleeding: every wound tells bleed.js what it opened */
function bleedAt(g, p, o) { return G.bleed && !g.dusty ? G.bleed.add(g, p, o) : null; }
function bleedIn(g, region, what, rate, o) { return G.bleed && !g.dusty ? G.bleed.internal(g, region, what, rate, o) : null; }
/* an opened vessel: an artery pumps out through the wound; the heart and the aorta bleed mostly inside him, and what
   gets out comes up through the hole */
function openVessel(g, p, art, lx, ly, k, regId) {
  const B = G.bleed; if (!B || g.dusty) return;
  const rate = (B.VESSEL[art.name] || art.rate * 20) * k;
  if (art.name === 'heart' || art.name === 'abdominal aorta') B.internal(g, art.name === 'heart' ? 'thorax' : 'abdomen', art.name, rate, { vent: { part: p, lx, ly }, max: true });
  else B.add(g, p, { kind: B.VEINS.has(art.name) ? 'vein' : 'art', rate, lx, ly, name: art.name, region: regId });
}

/* ------------------------------------------------------------ the long bones, place by place along them
   a thigh, a shin, an upper arm and a forearm keep their damage where it happened: sites along the bone, each with
   how badly it's been hit there (dmg: hit after hit in the same place weakens it, so the next one breaks it sooner),
   how far a blade has gone into it (cut, 0 to 1), what's broken there (frac: 0 whole, 1 cracked, 2 broken through,
   3 shattered), and how much of the flesh round it has been cut or torn (soft, 0 to 1). broken through, the limb gets
   a joint there that nothing drives (body.js, BODY.split): with the flesh still round it, it bends where it broke;
   cut most of the way round, it hangs and swings; cut all the way, it comes off there, through the bone */
const SOFT_DEPTH = [0, 0.06, 0.16, 0.4, 0.6, 0.8, 0.92];
const BONE_THICK = { uleg: 0.75, uarm: 1, lleg: 0.85, larm: 1.25 };
const MAIN_ART = { uleg: 'femoral artery', uarm: 'brachial artery', larm: 'radial artery', lleg: 'tibial artery' };
const MARGIN = 5 * S;                    /* this close to a joint's pin it's the joint (cut there: the capsule; broken there: the end of the bone) */
function boneSite(R, p, y) {
  const hh = p.def.wh[1] * S / 2;
  y = clamp(y, -hh + MARGIN, hh - MARGIN);
  const L = R.sites = R.sites || [];
  let s = L.find(q => Math.abs(q.y - y) < 3.5 * S);
  if (!s) {
    s = { y, dmg: 0, cut: 0, frac: 0, soft: 0, side: 0, t: G.t };
    L.push(s);
    if (L.length > 6) { let k = -1, lo = 1e9; for (let i = 0; i < L.length; i++) { const q = L[i], v = q.dmg + q.cut + q.soft + q.frac; if (q !== s && q !== R.secSite && v < lo) { lo = v; k = i; } } if (k >= 0) L.splice(k, 1); }
  }
  return s;
}
function boneSync(R) { let b = 0, f = 0; for (const q of R.sites || []) { b = Math.max(b, q.dmg + q.cut); f = Math.max(f, q.frac); } R.bone = Math.max(R.bone, b); R.frac = Math.max(R.frac, f); }
D.boneSite = boneSite;
/* broken (or cut) through at a site: once per limb, the limb gets its joint there. done between steps, never in the
   middle of the engine's own (a hit lands inside it) */
function section(g, p, R, st, why) {
  if (st.frac < 2 && st.cut < 1) return;
  if (R.secJ || R.secQ) { if (R.secSite === st) sectionUpdate(g, R, why); return; }
  if (p.def.piece) return;
  R.secQ = true; R.secSite = st;
  (g.dm.splitQ = g.dm.splitQ || []).push({ p, R, st, why });
}
/* how the break behaves, from what's left round it: a closed break bends a little, a shattered one more, one cut most
   of the way through swings, and with nothing left holding it, it's off */
function sectionUpdate(g, R, why, ev) {
  const j = R.secJ, st = R.secSite; if (!j || j.broken || !st) return;
  const soft = st.soft, a = soft >= 0.35 ? 0.5 + soft * 2.2 : st.frac >= 3 ? 0.75 : 0.35;
  /* the range it ends up with; it gets there over a moment (sectionStress), the ends of the bone grinding past each
     other, not in one step with his weight on it */
  j.limT = Math.min(a, 2.6); if (j.lim[1] > j.limT) j.lim = [-j.limT, j.limT];
  j.hp = Math.min(j.hp, Math.max(3, (1 - soft) * 60));
  j.soft = soft; j.frac = st.frac; j.cutB = st.cut; j.side = st.side;
  if (soft >= 0.999) D.tear(g, j, why === 'broken' ? 'torn' : why || 'cut', ev);
}
function sectionNow(g) {
  const q = g.dm.splitQ; if (!q || !q.length) return;
  g.dm.splitQ = [];
  for (const it of q) {
    const { p, R, st } = it; R.secQ = false;
    if (p.gone || p.removed || R.secJ) continue;
    const j = G.body.split(g, p, st.y, { name: `${p.def.name}, through the ${R.def.bone}` });
    if (!j) continue;
    R.secJ = j; j.site = st;
    sectionUpdate(g, R, it.why);
  }
}
D.sectionNow = sectionNow;

/* ------------------------------------------------------------ his state */
D.init = function (g) {
  const regions = {};
  for (const r of A.REGIONS) regions[r.id] = { id: r.id, def: r, skin: 1, soft: 0, bone: 0, frac: 0, compound: false, organ: 0, burn: 0, abr: 0, bleed: 0, ibleed: 0, pain: 0, hits: 0, energy: 0, ais: 0, amp: false, lac: 0, cuts: 0, holes: 0, crushT: 0, notes: [] };
  g.dm = {
    regions, pain: 0, shock: 0, jolt: 0, stun: 0, cons: 1, oxy: 1, blood: g.dusty ? 0 : T.bloodMl, lost: 0, bpm: 72, beat: 0, pulse: 0, breath: 1,
    loadKg: 0, loadOn: null, worst: null, paral: 0, cord: 0, hypoxT: 0, cool: {}, fallFrom: null, thrownT: -9, thrownBy: null,
    cap: { legL: 1, legR: 1, armL: 1, armR: 1, core: 1, neck: 1, cons: 1, will: 1 },
    jointCap: j => jointCap(g, j), stats: { hits: 0, fractures: 0, pieces: 1, shots: 0, cuts: 0, blows: 0, falls: 0 }, aggr: {}
  };
  g.rec = { id: g.id, n: g.n, name: g.name, dusty: g.dusty, born: G.t, events: [], look: g.look, pitch: g.pitch, home: g.home };
};

/* ------------------------------------------------------------ the record */
D.record = function (g, ev) {
  const rec = g.rec; if (!rec || rec.closed) return null;
  if (ev.part) ev.part = A.baseId(ev.part);
  ev.i = rec.events.length; ev.t = +(G.t - rec.born).toFixed(3);
  ev.post = !g.alive;
  ev.vit = g.dm ? { blood: Math.round(g.dm.blood), oxy: +g.dm.oxy.toFixed(2), cons: +g.dm.cons.toFixed(2), bpm: Math.round(g.dm.bpm) } : null;
  if (rec.events.length >= T.eventsPerCase) {
    /* full: fold the oldest minor knock into its neighbour, never an injury */
    const k = rec.events.findIndex(e => e.kind === 'impact' && !(e.inj && e.inj.length) && !e.minor);
    if (k >= 0) rec.events.splice(k, 1); else return null;
    rec.events.forEach((e, i) => e.i = i); ev.i = rec.events.length;
  }
  rec.events.push(ev);
  G.emit('event', g, ev);
  return ev;
};
/* lots of little knocks from the same thing on the same region become one line */
function minor(g, reg, src, E) {
  const key = reg + '|' + src, a = g.dm.aggr[key];
  if (a && G.t - a.lastT < 2 && !a.ev.closed) { a.ev.n++; a.ev.E = +(a.ev.E + E).toFixed(1); a.lastT = G.t; return; }
  const ev = D.record(g, { kind: 'impact', type: 'minor', region: reg, src, E: +E.toFixed(1), n: 1, minor: true });
  if (ev) g.dm.aggr[key] = { ev, lastT: G.t };
}

/* ------------------------------------------------------------ what hit him */
function nameOf(g, other) {
  const w = G.walls();
  if (other === w.ground) return { src: 'the floor', kind: 'floor', mat: 'concrete' };
  if (other === w.leftWall) return { src: 'the left wall', kind: 'wall', mat: 'concrete' };
  if (other === w.rightWall) return { src: 'the right wall', kind: 'wall', mat: 'concrete' };
  if (other === w.ceiling) return { src: 'the ceiling', kind: 'ceiling', mat: 'concrete' };
  const pl = other.plugin || {};
  if (pl.name) return pl.name;
  if (pl.fv) { const kg = Math.round(other.mass * g.kg); return { src: (pl.fv.key === 'std' ? 'a fridge' : `a ${FRIDGE_NAMES[pl.fv.key] || pl.fv.key} fridge`) + ` (${kg} kg)`, kind: 'fridge', mat: 'metal', kgs: kg }; }
  if (pl.part) {
    const o = pl.part.guy, pn = pl.part.def.name;
    if (o === g) return { src: `his own severed ${pn}`, kind: 'limb', mat: 'flesh' };
    if (!pl.part.attached) return { src: `${o.name}'s severed ${pn}`, kind: 'limb', mat: 'flesh' };
    return { src: `${o.name}'s ${pn}`, kind: 'guy', mat: 'flesh', guy: o };
  }
  if (pl.tnt) return { src: 'a stick of dynamite', kind: 'tnt', mat: 'wood' };
  if (other.isStatic) return { src: 'something solid', kind: 'wall', mat: 'concrete' };
  return { src: 'a fridge', kind: 'fridge', mat: 'metal' };
}
const FRIDGE_NAMES = { rust: 'rusted', mini: 'mini', chest: 'chest', sxs: 'side-by-side', retro: 'retro', wine: 'wine', smart: 'smart', frost: 'frosted', neon: 'neon', gold: 'gold', void: 'void', vndr: 'grey' };
/* how much of an area it landed on: a corner or an edge, or a face */
function areaOf(pr, other) {
  if (other.plugin && other.plugin.area) return other.plugin.area;
  if (other.circleRadius) return 'broad';
  const sp = pr.collision.supports;
  const vs = other.vertices; let near = false;
  for (const s of sp) for (const v of vs) if (Math.abs(v.x - s.x) + Math.abs(v.y - s.y) < 5) near = true;
  if (other.isStatic && !(other.plugin && other.plugin.part)) return 'broad';
  return near ? (sp.length > 1 ? 'edge' : 'point') : 'broad';
}

/* the engine's new contacts, before anything is solved: closing speeds are still real */
D.collisions = function (pairs) {
  for (let i = 0; i < pairs.length; i++) {
    const pr = pairs[i];
    const pa = pr.bodyA.plugin && pr.bodyA.plugin.part, pb = pr.bodyB.plugin && pr.bodyB.plugin.part;
    if (pa) contact(pa, pr.bodyB, pr, 1);
    if (pb) contact(pb, pr.bodyA, pr, -1);
  }
};
function contact(p, other, pr, sgn) {
  const g = p.guy; if (!g || g.cleared || p.gone || !g.dm) return;
  const sp = pr.collision.supports[0] || p.body.position, n = { x: pr.collision.normal.x * sgn, y: pr.collision.normal.y * sgn };
  const vp = G.pointVel(p.body, sp.x, sp.y), vo = other.isStatic ? { x: 0, y: 0 } : G.pointVel(other, sp.x, sp.y);
  const rvx = vp.x - vo.x, rvy = vp.y - vo.y;
  const vn = -(rvx * n.x + rvy * n.y);                                /* closing speed along the normal, px/step */
  if (vn <= 0.5) return;
  const perS = 1000 / (p.body.deltaTime || 16.667), vms = vn * perS * g.mpp;
  /* the mass behind the hit: the part, and some of whatever of him was moving the same way */
  const pm = BODY.realKg(p) / g.kg, all = p.attached ? BODY.mass(g) : pm;      /* his real mass for the part, not the physics' one */
  let behind = pm;
  if (p.attached) {
    const c = BODY.com(g); const cv = -(c.vx * n.x + c.vy * n.y) * perS * g.mpp;
    let on = 0; for (const q of g.list) if (q !== p && q.attached && q.contacts.some(k => k.other === other)) on++;
    behind = pm + (all - pm) * 0.1 * clamp(cv / Math.max(vms, 0.01), 0, 1) * (on >= 2 ? 0.35 : 1);
    if (p.kind === 'head') behind = Math.min(behind, pm + 1.5 / g.kg);   /* the neck lets the head hit on its own */
  }
  let mEff = behind;
  if (!other.isStatic) { const mo = (other.plugin && other.plugin.part && other.plugin.part.attached) ? BODY.mass(other.plugin.part.guy) * 0.5 : other.mass; mEff = behind * mo / (behind + mo); }
  const E = 0.5 * mEff * g.kg * vms * vms;
  if (E < K.minJ) return;
  const who = nameOf(g, other);
  /* the other guy takes his share too: that happens on his own side of the pair */
  const area = areaOf(pr, other);
  const lp = G.toLocal(p.body, sp.x, sp.y), dir = { x: -n.x, y: -n.y };
  let type = 'blunt';
  const dm = g.dm;
  if (dm.fallFrom != null && (who.kind === 'floor' || who.kind === 'fridge' || who.kind === 'ceiling')) {
    const hM = Math.max(0, (BODY.com(g).y - dm.fallTop) * g.mpp);
    if (hM > K.fallH) { type = 'fall'; who.src += `, a fall of ${hM.toFixed(1)} m`; dm.stats.falls++; }
    dm.fallFrom = null;
  } else if (G.t - dm.thrownT < 1.4 && who.kind !== 'guy') { type = 'thrown'; who.src = 'thrown into ' + who.src; }
  if (area !== 'broad' && type === 'blunt') type = 'edge';
  impact(g, p, { E, v: vms, area, type, lx: lp.x, ly: lp.y, wx: sp.x, wy: sp.y, dir, n, src: who.src, srcKind: who.kind, mat: who.mat, kg: mEff * g.kg, otherGuy: who.guy });
}

/* ------------------------------------------------------------ an impact: the one road every blunt hit takes */
function impact(g, p, h) {
  const dm = g.dm, now = G.t;
  if (now - g.born < 0.6 && h.E < 60) return;                        /* settling onto the floor when he appears */
  if ((dm.cool[p.id] || -9) > now - K.cool && h.E < 40) return;
  dm.cool[p.id] = now;
  if (!g.awake && h.E > 3) G.wake(g);
  const ud = units(p, h.lx, h.ly), regId = A.regionAt(p.id, ud.x, ud.y), R = dm.regions[regId];
  const c = K.conc[h.area] || 1;
  /* tiny bumps: a sound, a line in the record, nothing else */
  G.emit('impact', g, p, h, R);
  if (h.E < R.def.bruise * 0.7 && h.E < 6) { minor(g, regId, h.src, h.E); return; }
  const inj = [];
  const alive = g.alive && !g.dusty;
  R.hits++; R.energy += h.E; dm.stats.hits++;
  const def = R.def;
  /* skin: splits over bone and under edges first */
  const lacDose = h.E * c * c / (def.lac * 3) * (R.skin < 1 ? 1.25 : 1);
  if (lacDose >= 1) {
    const cm = clamp(1.2 + Math.sqrt(h.E * c) * 0.45, 1, 14), deep = lacDose > 2.4;
    R.skin = Math.max(0, R.skin - 0.18 * Math.min(3, lacDose)); R.lac += cm;
    /* a scalp bleeds like nothing else; a deep split has opened the veins under it, a shallow one oozes and stops */
    const head = regId === 'cranium' || regId === 'face';
    bleedAt(g, p, { kind: deep || head ? 'vein' : 'cap', rate: cm * K.bleedLac * (head ? 2 : 1) * (deep ? 1.5 : 1) * 0.3, lx: h.lx, ly: h.ly, region: regId });
    inj.push({ what: (deep ? 'deep ' : '') + `laceration, ${cm.toFixed(0)} cm`, sev: deep ? 2 : 1, tissue: 'skin' });
    G.emit('wound', g, p, { type: h.area === 'broad' ? 'split' : 'tear', lx: h.lx, ly: h.ly, dir: h.dir, size: cm, depth: deep ? 2 : 1, E: h.E });
  }
  /* soft tissue soaks what it can; what it couldn't soak goes on */
  const pad = def.soft * (1 - R.soft * 0.8);
  const softIn = h.E * (0.6 + 0.4 * c) / (def.bruise * 30);
  const before = R.soft;
  R.soft = Math.min(1, R.soft + softIn * (1 - R.soft * 0.5));
  if (h.E > def.bruise && alive) { inj.push({ what: R.soft > 0.55 ? 'deep contusion' : 'contusion', sev: R.soft > 0.55 ? 2 : 1, tissue: 'soft' }); G.emit('bruise', g, p, { lx: h.lx, ly: h.ly, E: h.E, size: clamp(Math.sqrt(h.E) * 1.1, 1.5, 8), area: h.area }); }
  if (R.soft > 0.85 && before <= 0.85) { inj.push({ what: 'muscle crushed', sev: 2, tissue: 'soft' }); G.emit('wound', g, p, { type: 'pulp', lx: h.lx, ly: h.ly, dir: h.dir, size: 4, depth: 2, E: h.E }); }
  /* bone: the energy that got through the padding, concentrated by the area it came in on. a cracked bone gives easier */
  const toBone = h.E * Math.pow(c, 0.75) * (1 - pad);
  const boneIn = toBone / def.frac;
  if (boneIn > 0.12) {
    /* a long bone takes it where it landed (a site along it: hit the same place again and it gives sooner); anything
       else takes it as a whole */
    const long = A.LONG.has(p.kind), st = long ? boneSite(R, p, h.ly) : null, f0 = long ? st.frac : R.frac;
    if (long) {
      st.dmg += boneIn * (1 + 0.45 * Math.min(1, st.dmg));
      st.frac = Math.max(st.frac, st.dmg >= 1.8 ? 3 : st.dmg >= 1 ? 2 : st.dmg >= 0.5 ? 1 : 0);
      if (boneIn >= 1.15 && st.frac < 2) { st.frac = 2; st.dmg = Math.max(st.dmg, 1); }
      boneSync(R);
    } else {
      R.bone += boneIn * (1 + 0.45 * Math.min(1, R.bone));
      R.frac = Math.max(R.frac, R.bone >= 1.8 ? 3 : R.bone >= 1 ? 2 : R.bone >= 0.5 ? 1 : 0);
      if (boneIn >= 1.15 && R.frac < 2) { R.frac = 2; R.bone = Math.max(R.bone, 1); }
    }
    const fr = long ? st.frac : R.frac, fy = long ? st.y : h.ly;
    if (fr > f0) {
      const name = def.bone, what = fr === 1 ? `${name}: cracked` + (long ? ' (a partial fracture)' : '') : fr === 2 ? `${name}: fractured` : `${name}: shattered`;
      if (fr >= 2 && R.skin < 0.55 && !R.compound && long) { R.compound = true; inj.push({ what: `${name}: compound, through the skin`, sev: 3, tissue: 'bone' }); G.emit('wound', g, p, { type: 'compound', lx: h.lx, ly: fy, dir: h.dir, size: 4, depth: 3, E: h.E }); bleedAt(g, p, { kind: 'vein', rate: 2.2, lx: Math.sign(h.lx || 1) * p.def.wh[0] * S * 0.4, ly: fy, region: regId }); }
      else inj.push({ what, sev: boneSev(regId, fr), tissue: 'bone' });
      if (fr >= 2 && f0 < 2) dm.stats.fractures++;
      /* a broken femur bleeds into the thigh, a broken pelvis into the belly: a litre or more, slowly, unseen */
      if (long && fr >= 2) bleedIn(g, regId, 'fracture', regId.startsWith('uleg') ? 1.6 : 0.5, { vent: R.compound ? { part: p, lx: Math.sign(h.lx || 1) * p.def.wh[0] * S * 0.4, ly: fy } : null });
      if (regId === 'pelvis' && fr >= 2) bleedIn(g, regId, 'fracture', 3.2);
      if (regId === 'thorax' && fr >= 2) inj.push({ what: fr === 3 ? 'flail chest' : 'rib fractures', sev: fr === 3 ? 4 : 3, tissue: 'bone' });
      G.emit('fracture', g, p, { region: regId, frac: fr, lx: h.lx, ly: fy, E: h.E, compound: R.compound });
      /* broken through: it bends there now */
      if (long && fr >= 2) section(g, p, R, st, 'broken');
    }
  }
  /* organs: what reaches them. broken ribs and a broken skull let more through */
  if (def.org && R.def.organ) {
    const shield = def.id === 'cranium' ? (R.frac >= 2 ? 1.4 : 1) : def.id === 'thorax' ? (R.frac >= 2 ? 1.5 : 1) : 1;
    const toOrg = h.E * (0.35 + 0.25 * c) * shield * (1 - pad * 0.5) / def.organ;
    if (toOrg > 0.15) {
      const o0 = R.organ; R.organ = Math.min(1.3, R.organ + toOrg * (def.id === 'cranium' ? 0.35 : 0.45));
      if (R.organ > 0.25 && o0 <= 0.25) inj.push({ what: organWhat(regId, 1), sev: 3, tissue: 'organ' });
      if (R.organ > 0.6 && o0 <= 0.6) inj.push({ what: organWhat(regId, 2), sev: 4, tissue: 'organ' });
      if (R.organ >= 1 && o0 < 1) inj.push({ what: organWhat(regId, 3), sev: 5, tissue: 'organ' });
      /* a torn liver or spleen bleeds into the belly, a bruised lung into the chest (and the chest fills) */
      if (regId === 'abdomen') bleedIn(g, 'abdomen', R.organ > 0.6 ? 'spleen' : 'liver', toOrg * 3);
      else if (regId === 'thorax') bleedIn(g, 'thorax', 'lung', toOrg * 2.2);
    }
  }
  /* the head: knocked silly, knocked out */
  if ((regId === 'cranium' || regId === 'face') && alive) {
    /* a ringing head: slower, clumsier, for a while. out cold is rarer: likelier the harder the hit, never certain
       until it's a very hard one (most falls that hit the head don't knock anyone out) */
    const Ec = h.E * c;
    if (h.E > 5) dm.daze = Math.max(dm.daze || 0, Math.min(9, Ec * K.dazePerJ));
    const pKO = clamp((Ec - K.koJ) / K.koSpan, 0, 1);
    if (pKO > 0 && Math.random() < pKO) { dm.stun = Math.max(dm.stun, Math.min(16, 2 + (Ec - K.koJ) / 12)); inj.push({ what: 'knocked out', sev: 2, tissue: 'organ' }); }
    else if (Ec > 18) inj.push({ what: 'concussion', sev: 2, tissue: 'organ' });
    if (h.E > 8 && regId === 'face' && Math.random() < 0.5) G.emit('teeth', g, p, h);
    if (h.E > 18 && regId === 'face') G.emit('eye', g, p, h);
  }
  if (regId === 'neck' && h.E > 12) { dm.cord += h.E / 220; if (alive) dm.breathHit = Math.max(dm.breathHit || 0, h.E / 80); }
  belly(g, p, R, h.lx, h.ly, inj, alive);
  /* the hit itself: muscles let go, it hurts */
  const ground = h.srcKind === 'floor' || h.srcKind === 'wall' || h.srcKind === 'ceiling';
  dm.jolt = Math.max(dm.jolt, clamp(h.E / (ground ? 260 : 55), 0.05, ground ? 0.35 : 0.9));
  /* pain grows with the hit, but a hit twice as hard doesn't hurt twice as much, and a new bruise adds less to
     a man who already hurts all over (pain is felt worst-first, not summed) */
  if (alive) { const pn = 14 * Math.log2(1 + h.E / 5) * (0.6 + 0.4 * c); R.pain = Math.min(100, R.pain + pn); dm.pain = Math.min(220, dm.pain + pn * Math.max(0.15, 1 - dm.pain / 260)); dm.shock += h.E * 0.04; }
  ais(g, R);
  const ev = D.record(g, { kind: 'impact', type: h.type, region: regId, part: p.id, lx: +(ud.x).toFixed(1), ly: +(ud.y).toFixed(1), wx: Math.round(h.wx), wy: Math.round(h.wy), src: h.src, srcKind: h.srcKind, v: +h.v.toFixed(1), E: +h.E.toFixed(1), kg: h.kg ? +h.kg.toFixed(1) : null, area: h.area, inj, after: snap(R) });
  G.emit('hurt', g, p, h, R, inj, ev);
  if (h.otherGuy && h.otherGuy !== g && h.otherGuy.alive) { /* nothing: his own side of the collision does his part */ }
  if (alive && h.E > 4) G.emit('voice', g, h.E > 45 ? 'scream' : h.E > 14 ? 'hurt' : 'grunt', clamp(h.E / 40, 0.3, 1.3));
  /* hard enough, concentrated enough, and it doesn't break: it bursts */
  if (GIB_HIT[p.kind] && h.E * Math.sqrt(c) >= GIB_HIT[p.kind] * (R.frac >= 2 ? 0.7 : 1) && !p.gone) gibPart(g, p, h.dir, ev);
  checkDeath(g, ev);
}
D.impact = impact;
/* the belly: once the wall of it is gone (skin open, the muscle under it pulped) and what's inside has burst, there
   is nothing left to hold it in. any road there counts, a blast, a crush, a fall onto something sharp */
function belly(g, p, R, lx, ly, inj, alive) {
  if (R.id !== 'abdomen' || R.evisc) return;
  if (R.skin < 0.25 && R.soft > 0.85 && R.organ >= 0.6) {
    R.evisc = true; bleedIn(g, 'abdomen', 'bowel', 2.4, { vent: { part: p, lx, ly } });
    inj.push({ what: 'eviscerated', sev: 4, tissue: 'organ' });
    G.emit('guts', g, p, { lx, ly });
  }
}
function boneSev(reg, f) {
  const big = { uleg: 3, pelvis: 3, cranium: 3, thorax: 2, uarm: 2, lleg: 2, larm: 2, abdomen: 3, neck: 4 }, k = reg.replace(/[LR]$/, '');
  return Math.min(5, (big[k] || 1) + (f === 3 ? 1 : 0) - (f === 1 ? 1 : 0));
}
function organWhat(reg, lv) {
  const t = {
    cranium: ['brain contusion', 'brain haemorrhage', 'brain destroyed'], face: ['eye injury', 'orbital fracture', 'facial destruction'],
    neck: ['spinal cord bruised', 'spinal cord damaged', 'spinal cord severed'], thorax: ['lung contusion', 'collapsed lung', 'heart ruptured'],
    abdomen: ['liver laceration', 'spleen ruptured', 'bowel burst'], pelvis: ['bladder bruised', 'bladder ruptured', 'pelvic organs destroyed']
  };
  return (t[reg] || ['internal injury', 'internal bleeding', 'organ destroyed'])[lv - 1];
}
/* where on a part, in rest units (the region tables are in those) */
function units(p, lx, ly) { return { x: lx / S, y: ly / S }; }
function snap(R) { return { ais: R.ais, frac: R.frac, skin: +R.skin.toFixed(2), soft: +R.soft.toFixed(2), organ: +R.organ.toFixed(2), bleed: +(R.bleed + R.ibleed).toFixed(2), amp: R.amp, burn: +R.burn.toFixed(2), abr: +R.abr.toFixed(2), compound: R.compound }; }

/* ------------------------------------------------------------ the severity of a region, from what's in it */
function ais(g, R) {
  let a = 0;
  if (R.soft > 0.05 || R.abr > 0.05 || R.lac > 0) a = 1;
  if (R.lac > 10 || R.soft > 0.6 || R.abr > 0.6) a = Math.max(a, 2);
  if (R.frac === 1) a = Math.max(a, 2);
  if (R.frac >= 2) a = Math.max(a, boneSev(R.id, R.frac));
  if (R.compound) a = Math.max(a, 3);
  if (R.organ > 0.25) a = Math.max(a, 3); if (R.organ > 0.6) a = Math.max(a, 4); if (R.organ >= 1) a = Math.max(a, R.id === 'cranium' || R.id === 'thorax' || R.id === 'neck' ? 6 : 5);
  if (R.burn > 0.3) a = Math.max(a, 2); if (R.burn > 0.7) a = Math.max(a, 3);
  if (R.amp) a = Math.max(a, R.id === 'neck' ? 6 : R.id === 'uleg' + R.id.slice(-1) ? 4 : 3);
  if (R.halved) a = 6;
  a = Math.max(a, R.jointAis || 0);                                    /* a sprain, a dislocation, a joint broken through */
  R.ais = Math.min(6, a);
  return R.ais;
}
D.iss = function (g) {
  const by = {};
  for (const R of Object.values(g.dm.regions)) { const k = R.def.iss; by[k] = Math.max(by[k] || 0, R.ais); }
  const v = Object.values(by); if (v.some(a => a >= 6)) return 75;
  v.sort((a, b) => b - a); return v.slice(0, 3).reduce((s, a) => s + a * a, 0);
};

/* ------------------------------------------------------------ the knife */
D.cut = function (g, p, h) {
  const dm = g.dm; if (!dm || p.gone) return;
  if (!g.awake) G.wake(g);
  const ud = units(p, h.lx, h.ly), regId = A.regionAt(p.id, ud.x, ud.y), R = dm.regions[regId];
  const alive = g.alive && !g.dusty;
  /* the same place again goes deeper: cloth, skin, fat, muscle, then whatever holds the joint */
  const spot = p.cut.find(c => Math.hypot(c.x - ud.x, c.y - ud.y) < (h.spotR || 3.2));
  /* a blade can bite deeper per pass (the chainsaw) or never past the fat (the razor) */
  const inc = h.deep || 1, cap = h.maxDepth || 99;
  let depth; if (spot) { spot.n = Math.min(cap, spot.n + inc); depth = spot.n; } else { depth = Math.min(cap, inc); p.cut.push({ x: ud.x, y: ud.y, n: depth }); }
  R.cuts++; dm.stats.cuts++;
  const cm = clamp(h.len / (S * 6.25), 1, 9);
  R.skin = Math.max(0, R.skin - 0.12 * cm / 4); R.lac += cm; R.soft = Math.min(1, R.soft + 0.07 * depth);
  const inj = [{ what: `incised wound, ${cm.toFixed(0)} cm` + (depth > 1 ? `, ${['', '', 'into the fat', 'into the muscle', 'to the bone', 'through the joint'][Math.min(5, depth)]}` : ''), sev: depth >= 3 ? 2 : 1, tissue: depth >= 3 ? 'soft' : 'skin' }];
  /* through the skin it oozes and stops; into the fat and the muscle it opens veins, and the deeper the more */
  bleedAt(g, p, { kind: depth >= 2 ? 'vein' : 'cap', rate: cm * (depth >= 2 ? 0.16 : 0.1) * depth * (h.bleedK || 1), lx: h.lx2 != null ? (h.lx + h.lx2) / 2 : h.lx, ly: h.ly2 != null ? (h.ly + h.ly2) / 2 : h.ly, region: regId });
  /* an artery under the blade */
  const art = A.arteryAt(p.id, ud.x, ud.y, depth >= 2 ? 1 : 0);
  if (art && depth >= 2 && !R['art_' + art.name]) { R['art_' + art.name] = 1; openVessel(g, p, art, h.lx, h.ly, 1, regId); inj.push({ what: art.name + ' cut', sev: art.rate > 3 ? 5 : 4, tissue: 'artery' }); G.emit('artery', g, p, { lx: h.lx, ly: h.ly, rate: art.rate, name: art.name }); }
  if (regId === 'neck' && depth >= 4) { dm.cord += 0.34; inj.push({ what: 'throat cut to the spine', sev: 5, tissue: 'organ' }); }
  if ((regId === 'abdomen') && depth >= 3 && !R.evisc) { R.evisc = true; R.organ = Math.max(R.organ, 0.4); bleedIn(g, 'abdomen', 'bowel', 2.4, { vent: { part: p, lx: h.lx, ly: h.ly } }); inj.push({ what: 'eviscerated', sev: 4, tissue: 'organ' }); G.emit('guts', g, p, { lx: h.lx, ly: h.ly }); }
  if (alive) { const pk = h.painK || 1; R.pain = Math.min(100, R.pain + (9 + depth * 4) * pk); dm.pain = Math.min(220, dm.pain + (9 + depth * 4) * pk); dm.shock += 1.2 * pk; dm.jolt = Math.max(dm.jolt, 0.25 * Math.min(2, pk)); }
  G.emit('wound', g, p, { type: h.wound || 'cut', lx: h.lx, ly: h.ly, dir: h.dir, size: cm, depth, x2: h.lx2, y2: h.ly2, thin: h.thin });
  ais(g, R);
  const ev = D.record(g, { kind: 'cut', type: h.cutType || 'incised', region: regId, part: p.id, lx: +ud.x.toFixed(1), ly: +ud.y.toFixed(1), wx: Math.round(h.wx), wy: Math.round(h.wy), src: h.src || 'the knife', srcKind: h.srcKind || 'knife', depth, cm: +cm.toFixed(1), inj, after: snap(R) });
  G.emit('hurt', g, p, h, R, inj, ev);
  if (alive && !h.quiet) G.emit('voice', g, depth >= 3 ? 'scream' : 'hurt', 0.5 + depth * 0.15);
  /* a chainsaw held in a hand or a foot doesn't cut it off, it grinds it apart */
  if (h.srcKind === 'chainsaw' && (p.kind === 'hand' || p.kind === 'foot') && G.gibs) { p.shred = (p.shred || 0) + 1; if (p.shred > 16 && !p.gone) { G.gibs.blowApart(g, p, 'cut', { speed: 2.5, src: 'a chainsaw' }); checkDeath(g, ev); return; } }
  /* deeper than the muscle at a joint: the capsule and the ligaments round it, a share more with each pass, and it
     only comes off there when they're all cut. along a long bone, away from its joints: through the flesh round the
     bone, into the bone, and through it, and only then, with nothing left holding it, off */
  const jn = depth >= 3 ? nearJoint(g, p, h.wx, h.wy, h.jointR || MARGIN) : null;
  if (jn) {
    const need = jn.id === 'spine' || jn.id === 'waist' || jn.id === 'neck' ? 5 : 3;
    if (depth >= need) {
      const was = jn.cutT || 0;
      jn.cutT = was + (depth - need + 1) * 0.22 * (h.jointK || 1);
      if (jn.cutT >= 1) D.tear(g, jn, 'cut', ev);
      else if (jn.cutT >= 0.5 && was < 0.5) { inj.push({ what: `${jn.def.name}: cut half through`, sev: 3, tissue: 'joint' }); if (jn.state === 'ok' || jn.state === 'sprain') jointState(g, jn, 'disloc', 'the joint cut half through'); }
    }
  } else if (A.LONG.has(p.kind) && depth >= 2) {
    const st = boneSite(R, p, h.ly), s0 = st.soft, c0 = st.cut;
    if (!st.side) st.side = G.dirLocal(p.body, h.dir.x, h.dir.y).x > 0 ? -1 : 1;           /* the side the blade came in from */
    /* the flesh round the bone, from the side the blade's on: the far side of it can't be got at past a whole bone */
    st.soft = Math.min(st.cut >= 1 || st.frac >= 2 ? 1 : Math.max(st.soft, 0.75), Math.max(st.soft, SOFT_DEPTH[Math.min(6, depth)]) + (depth >= (h.maxDepth || 5) ? 0.09 * (h.deep || 1) : 0));
    if (depth >= 4) {
      st.cut = Math.min(1, st.cut + 0.2 * (h.boneK == null ? 1 : h.boneK) * (BONE_THICK[p.kind] || 1));
      /* the limb's main artery runs down the middle of it: to the bone is through it */
      const nm = (p.side > 0 ? 'left ' : 'right ') + MAIN_ART[p.kind];
      if (!R['art_' + nm]) { R['art_' + nm] = 1; openVessel(g, p, { name: nm, rate: 1 }, h.lx, h.ly, 1, regId); inj.push({ what: nm + ' cut', sev: p.kind === 'uleg' ? 5 : 4, tissue: 'artery' }); G.emit('artery', g, p, { lx: h.lx, ly: h.ly, rate: 2, name: nm }); }
    }
    if (st.cut > 0 && c0 === 0) inj.push({ what: `${R.def.bone}: cut into`, sev: 2, tissue: 'bone' });
    if (st.cut >= 1 && c0 < 1) { st.frac = Math.max(st.frac, 2); inj.push({ what: `${R.def.bone}: cut through`, sev: boneSev(regId, 2), tissue: 'bone' }); dm.stats.fractures++; G.emit('fracture', g, p, { region: regId, frac: 2, lx: h.lx, ly: st.y, E: 0, cut: true }); }
    if (st.soft >= 0.6 && s0 < 0.6) inj.push({ what: `${R.def.name}: cut most of the way round`, sev: 3, tissue: 'soft' });
    boneSync(R);
    if (st.frac >= 2 || st.cut >= 1) section(g, p, R, st, 'cut');
  }
  checkDeath(g, ev);
};
function nearJoint(g, p, x, y, within) {
  let best = null, bd = within;
  for (const j of p.joints) { if (j.broken || j.section) continue; const w = BODY.pivot(j), d = Math.hypot(w.x - x, w.y - y); if (d < bd) { bd = d; best = j; } }
  return best;
}

/* ------------------------------------------------------------ a bullet: in at the point you clicked, through, and out his back */
D.shot = function (g, p, h) {
  const dm = g.dm; if (!dm || p.gone) return;
  if (!g.awake) G.wake(g);
  const ud = units(p, h.lx, h.ly), regId = A.regionAt(p.id, ud.x, ud.y), R = dm.regions[regId];
  const alive = g.alive && !g.dusty;
  /* what made it: a round unless told otherwise. the room's nails, spikes, knife points and pellets say what they
     are, how big a hole they make, whether they come out the back, and how much they carry */
  const hk = h.size || 1, through = h.exit !== false, E = h.energy || 500, boneK = h.boneK == null ? 1 : h.boneK;
  const painK = h.painK || 1, bleedK = h.bleedK || 1;
  dm.stats.shots++; R.holes++;
  const inj = [{ what: h.what || 'gunshot wound, entry and exit', sev: hk >= 1.4 || E > 1500 ? 3 : 2, tissue: 'skin' }];
  R.skin = Math.max(0, R.skin - 0.08 * Math.min(2, hk)); R.soft = Math.min(1, R.soft + 0.35 * Math.min(2.2, hk) * (through ? 1 : 0.6));
  /* the hole bleeds, and so does the one out the back where you don't see it; a nail or a staple barely does */
  bleedAt(g, p, { kind: hk * bleedK < 0.45 ? 'cap' : 'vein', rate: 1.6 * hk * bleedK * (through ? 1.6 : 0.6), lx: h.lx, ly: h.ly, region: regId });
  /* what's under the point, front to back: the bone goes if there was the energy to break it */
  const ctx = probe; const d = p.def;
  const inBone = hitShape(ctx, c => A.bone(c, d, S), h.lx, h.ly);
  let shotSite = null;
  if (inBone && boneK > 0) {
    const fr = boneK >= 0.7 && E >= 300 ? 3 : boneK >= 0.3 ? 2 : 1, long = A.LONG.has(p.kind);
    let f0 = R.frac;
    if (long) {
      /* where it went through the bone, along it: broken there, and the flesh round it torn by what went through */
      const st = shotSite = boneSite(R, p, h.ly); f0 = st.frac;
      st.dmg += 1.6 * boneK; st.frac = Math.max(st.frac, fr);
      st.soft = Math.min(1, st.soft + 0.2 * Math.min(2, hk) * (through ? 1 : 0.5) * Math.min(1, boneK) * clamp(Math.pow(E / 500, 0.3), 0.6, 1.8));
      if (!st.side) st.side = G.dirLocal(p.body, h.dir.x, h.dir.y).x > 0 ? -1 : 1;
      boneSync(R);
    } else { R.bone += 1.6 * boneK; R.frac = Math.max(R.frac, fr); }
    if (fr >= 3) R.compound = long;
    inj.push({ what: `${R.def.bone}: ${h.boneWord || (fr >= 3 ? 'shattered by the round' : fr === 2 ? 'broken' : 'chipped')}`, sev: boneSev(regId, fr), tissue: 'bone' });
    if (f0 < 2 && fr >= 2) dm.stats.fractures++;
    if (long && fr >= 2) bleedIn(g, regId, 'fracture', 1.4 * boneK, { vent: { part: p, lx: h.lx, ly: h.ly } });
    G.emit('fracture', g, p, { region: regId, frac: long ? shotSite.frac : R.frac, lx: h.lx, ly: long ? shotSite.y : h.ly, E, compound: R.compound });
  }
  const orgs = A.ORGANS[p.kind] || [];
  for (const o of orgs) {
    if (!hitShape(ctx, c => o.draw(c, S), h.lx, h.ly)) continue;
    const lethal = o.id === 'brain' || o.id === 'heart', ok = Math.min(1.3, 0.55 + 0.45 * hk);
    R.organ = Math.max(R.organ + (lethal ? 1.2 : 0.55) * ok, (lethal ? 1.05 : 0.6) * Math.min(1, ok + 0.1));
    inj.push({ what: `${o.name}: hit`, sev: lethal ? 6 : 4, tissue: 'organ' });
    /* what the organ bleeds, inside him, and up through the hole: a lung fills the chest (and it collapses some at
       once), a liver pours, the heart is over in seconds */
    const vent = { part: p, lx: h.lx, ly: h.ly };
    if (o.id.startsWith('lung')) { if (alive) { dm.lung = (dm.lung || 0) + 0.4 * ok; dm.lungHit = (dm.lungHit || 0) + 0.4 * ok; } bleedIn(g, 'thorax', o.id, 7 * ok, { vent }); }
    else if (o.id === 'liver') bleedIn(g, regId, 'liver', 12 * ok, { vent });
    else if (o.id === 'stomach' || o.id === 'bowel') bleedIn(g, regId, o.id, 3 * ok, { vent });
    else if (o.id === 'bladder') bleedIn(g, regId, 'bladder', 1.5 * ok, { vent });
    else if (o.id === 'heart') bleedIn(g, 'thorax', 'heart', 150 * ok, { vent, max: true });
  }
  if (p.kind === 'head' && !inBone && !orgs.length) R.organ = Math.max(R.organ, 0.5);
  const art = A.arteryAt(p.id, ud.x, ud.y, 0.6);
  if (art && !R['art_' + art.name]) { R['art_' + art.name] = 1; openVessel(g, p, art, h.lx, h.ly, Math.min(1, bleedK), regId); inj.push({ what: art.name + ' hit', sev: art.rate > 3 ? 5 : 4, tissue: 'artery' }); G.emit('artery', g, p, { lx: h.lx, ly: h.ly, rate: art.rate, name: art.name }); }
  if (regId === 'neck') { dm.cord += (inBone ? 0.6 : 0.2) * Math.min(1.5, hk); }
  if (alive) { R.pain = Math.min(100, R.pain + 40 * painK); dm.pain = Math.min(220, dm.pain + 40 * painK); dm.shock += 10 * painK; dm.jolt = Math.max(dm.jolt, 0.7 * Math.min(1.4, painK)); }
  G.emit('wound', g, p, { type: 'hole', lx: h.lx, ly: h.ly, dir: h.dir, size: 1.2 * hk, depth: 4, k: hk, powder: h.powder });
  ais(g, R);
  const sk = h.srcKind || 'bullet';
  const ev = D.record(g, { kind: 'shot', type: sk === 'stab' ? 'stab' : sk === 'spike' ? 'impalement' : sk === 'nail' ? 'nail' : sk === 'staple' ? 'staple' : 'gunshot', region: regId, part: p.id, lx: +ud.x.toFixed(1), ly: +ud.y.toFixed(1), wx: Math.round(h.wx), wy: Math.round(h.wy), src: h.src || 'a .45 round from the six-shooter', srcKind: sk, E: Math.round(E), exit: through, k: +hk.toFixed(2), inj, after: snap(R) });
  G.emit('hurt', g, p, h, R, inj, ev);
  if (alive && !h.quiet) G.emit('voice', g, 'scream', 1.2 * Math.min(1.2, painK));
  /* a long bone shot through: it bends there now; shot through enough times in the same place, there's nothing
     left round it, and it comes off there */
  if (shotSite && (shotSite.frac >= 2 || shotSite.cut >= 1)) section(g, p, R, shotSite, 'shot');
  /* enough force in one place at once (a slug, a load of buckshot point blank, a rifle at the muzzle): the part comes
     apart instead of having holes in it. what's delivered in the same instant adds up; it's gone a moment later */
  if (GIB_AT[p.kind] && !p.gone) {
    const add = E * hk * (h.powder ? 1 : 0.3);
    p.blastAcc = (p.blastAcc || 0) * Math.pow(0.02, Math.max(0, G.t - (p.blastT || G.t))) + add; p.blastT = G.t;
    if (p.blastAcc >= GIB_AT[p.kind] * (p.kind === 'head' && R.frac >= 2 ? 0.7 : 1)) { p.blastAcc = 0; gibPart(g, p, h.dir, ev); }
  }
  checkDeath(g, ev);
};
/* how much force at once takes a part apart (J, shots) and how hard a blow (J, concentrated) */
const GIB_AT = { head: 1150, hand: 800, foot: 800, larm: 1400, lleg: 1600 };
const GIB_HIT = { head: 3000, hand: 1600, foot: 1600, larm: 2600, lleg: 2900 };
function gibPart(g, p, dir, ev) {
  if (!G.gibs || p.gone || p.removed) return;
  g.lastHeadDir = dir;
  if (p.kind === 'head') { const R = g.dm.regions.cranium; R.organ = 1.3; R.frac = 3; G.emit('headBlown', g, dir); D.headGone(g, 'shot', ev); }
  else G.gibs.blowApart(g, p, 'shot', { dir, speed: 7, src: ev && ev.src });
}
D.gibPart = gibPart;
const probe = document.createElement('canvas').getContext('2d');
function hitShape(ctx, draw, x, y) { ctx.setTransform(1, 0, 0, 1, 0, 0); draw(ctx); return ctx.isPointInPath(x, y, 'evenodd'); }

/* ------------------------------------------------------------ dynamite */
D.blast = function (g, p, h) {
  const dm = g.dm; if (!dm || p.gone) return;
  if (!g.awake) G.wake(g);
  const regId = A.regionAt(p.id, 0, 0), R = dm.regions[regId], alive = g.alive && !g.dusty, k = h.k;
  const E = h.E;
  R.burn = Math.min(1, R.burn + k * 0.9); R.skin = Math.max(0, R.skin - k * 0.6); R.soft = Math.min(1, R.soft + k * 0.7);
  const inj = [];
  if (k > 0.15) inj.push({ what: k > 0.5 ? 'deep burns' : 'burns', sev: k > 0.5 ? 3 : 2, tissue: 'skin' });
  if (k > 0.3) { inj.push({ what: 'fragment wounds', sev: 2, tissue: 'soft' }); bleedAt(g, p, { kind: 'vein', rate: k * 3, lx: G.rnd(-0.3, 0.3) * (p.def.wh ? p.def.wh[0] : p.def.r) * S, ly: G.rnd(-0.3, 0.3) * (p.def.wh ? p.def.wh[1] : p.def.r) * S, region: regId }); G.emit('wound', g, p, { type: 'shred', lx: 0, ly: 0, dir: h.dir, size: 3 + k * 6, depth: 2, E }); }
  let blastSite = null;
  if (k > 0.45) {
    if (A.LONG.has(p.kind)) {
      const st = blastSite = boneSite(R, p, 0), f0 = st.frac;
      st.dmg += k * 1.2; st.frac = Math.max(st.frac, st.dmg >= 1.8 ? 3 : st.dmg >= 1 ? 2 : st.frac); st.soft = Math.min(1, st.soft + k * 0.3); boneSync(R);
      if (st.frac > f0 && st.frac >= 2) { dm.stats.fractures++; inj.push({ what: `${R.def.bone}: broken by the blast`, sev: boneSev(regId, st.frac), tissue: 'bone' }); G.emit('fracture', g, p, { region: regId, frac: st.frac, lx: 0, ly: st.y, E }); }
    } else { R.bone += k * 1.2; const f0 = R.frac; R.frac = Math.max(R.frac, R.bone >= 1.8 ? 3 : R.bone >= 1 ? 2 : R.frac); if (R.frac > f0 && R.frac >= 2) { dm.stats.fractures++; inj.push({ what: `${R.def.bone}: broken by the blast`, sev: boneSev(regId, R.frac), tissue: 'bone' }); } }
  }
  if (regId === 'thorax' && k > 0.35) { dm.lung = (dm.lung || 0) + k * 0.6; dm.lungHit = (dm.lungHit || 0) + k * 0.6; R.organ = Math.min(1.3, R.organ + k * 0.8); inj.push({ what: 'blast lung', sev: k > 0.7 ? 5 : 4, tissue: 'organ' }); }
  if ((regId === 'cranium' || regId === 'face') && k > 0.4) { R.organ = Math.min(1.3, R.organ + k * 0.9); if (alive) dm.stun = Math.max(dm.stun, 3 + k * 4); }
  if (regId === 'abdomen' && k > 0.3) R.organ = Math.min(1.3, R.organ + k * 0.7);
  /* right up against it, the belly wall doesn't burn or tear so much as go */
  if (regId === 'abdomen' && k > 0.7) { R.skin = 0; R.soft = 1; }
  belly(g, p, R, 0, 0, inj, alive);
  if (alive) { R.pain = Math.min(100, R.pain + 60 * k); dm.pain = Math.min(220, dm.pain + 60 * k); dm.shock += 30 * k; dm.jolt = 0.9; dm.stun = Math.max(dm.stun, k * 2.5); }
  G.emit('wound', g, p, { type: 'burn', lx: 0, ly: 0, dir: h.dir, size: 4 + k * 8, depth: 1, E });
  ais(g, R);
  const ev = D.record(g, { kind: 'blast', type: 'blast', region: regId, part: p.id, lx: 0, ly: 0, wx: Math.round(p.body.position.x), wy: Math.round(p.body.position.y), src: `dynamite, ${(h.dist * g.mpp).toFixed(1)} m away`, srcKind: 'blast', E: Math.round(E), inj, after: snap(R) });
  G.emit('hurt', g, p, h, R, inj, ev);
  if (blastSite && blastSite.frac >= 2 && k <= 0.62) section(g, p, R, blastSite, 'blast');
  /* close enough and the limb, or all of him there, goes */
  if (k > 0.62 && A.LIMB.has(p.kind)) { for (const j of p.joints) if (!j.broken && j.b === p) D.tear(g, j, 'blast', ev); }
  if (k > 0.85 && A.LIMB.has(p.kind)) G.emit('obliterate', g, p);
  if (k > 0.85 && p.kind === 'head') { R.organ = 1.3; D.headGone(g, 'blast', ev); }
  checkDeath(g, ev);
};

/* ------------------------------------------------------------ joints: bent past where they go, or pulled apart */
/* what hurts a joint. two ways, both measured, neither scripted:
   - driven into its stop: the energy the stop had to take out of the two sides turning into each other (J).
     a hand flicking into its stop is a fraction of a joule; landing on locked knees from the ceiling is a lot
   - forced past it and held there: how far past (rad), by a fridge, a wall, his own weight landing wrong.
   [sprain, dislocation, fracture-dislocation] for each. lying on an arm that's at the end of its range is the
   stop doing its job and costs nothing (calibrated against falls, throws, drops and yanks, see the notes) */
const JOINT_E = {
  neck: [40, 90, 160], spine: [90, 180, 320], waist: [90, 180, 320],
  shoulder: [25, 45, 90], elbow: [15, 30, 60], wrist: [8, 16, 30],
  hip: [70, 140, 250], knee: [45, 110, 200], ankle: [20, 45, 90]
};
const JOINT_OVER = {
  neck: [0.25, 0.4, 0.55], spine: [0.25, 0.4, 0.55], waist: [0.25, 0.4, 0.55],
  shoulder: [0.35, 0.5, 0.7], elbow: [0.3, 0.45, 0.65], wrist: [0.35, 0.5, 0.7],
  hip: [0.3, 0.45, 0.65], knee: [0.3, 0.45, 0.65], ankle: [0.3, 0.5, 0.75]
};
const LEVEL = ['ok', 'sprain', 'disloc', 'broken'];
D.JOINT_E = JOINT_E; D.JOINT_OVER = JOINT_OVER;
function jointStress(g, h) {
  const dm = g.dm;
  for (const j of g.joints) {
    if (j.broken || !j.c) continue;
    if (j.section) { sectionStress(g, j, h); continue; }
    const type = j.id.replace(/[LR]$/, ''), te = JOINT_E[type] || [40, 90, 160], to = JOINT_OVER[type] || [0.3, 0.45, 0.65];
    const E = j.limE || 0, over = j.over || 0;
    /* hit after hit into the same stop wears it */
    j.wear = (j.wear || 0) * (1 - h * 0.02) + Math.max(0, E - te[0] * 0.4) * 0.3;
    const eE = E + j.wear;
    let lv = 0;
    for (let k = 2; k >= 0; k--) if (eE > te[k] || over > to[k]) { lv = k + 1; break; }
    j.stress = Math.max((j.stress || 0) * (1 - h * 0.5), eE / te[0], over / to[0]);
    const now = LEVEL.indexOf(j.state);
    if (lv > now && now >= 0) {
      jointState(g, j, LEVEL[lv], E > 0 && eE / te[Math.max(0, lv - 1)] >= over / to[Math.max(0, lv - 1)] ? `driven into its stop (${E.toFixed(0)} J)` : `forced ${(over * 57.3).toFixed(0)}° past its range`);
      G.emit('crack', g, j);
    }
    /* pulled apart: the pin stretched (a yank on a limb, a fridge on one end) */
    const a = BODY.anchor(j, 'a'), b = BODY.anchor(j, 'b'), d = Math.hypot(a.x - b.x, a.y - b.y), lim = K.tear * S * (j.state === 'disloc' ? 0.75 : 1);
    j.stretch = d;
    j.stretchT = d > lim * 0.55 && d > 5 * S ? (j.stretchT || 0) + h : 0;
    if (j.stretchT > 0.05 && (j.state === 'ok' || j.state === 'sprain')) jointState(g, j, 'disloc', 'pulled apart at the joint');
    if (d > lim) {
      j.hp -= (d - lim) * 0.3 * (j.def.id === 'neck' ? 0.8 : 1);
      if (Math.random() < 0.05) G.emit('creak', g, j);
      if (d > lim * 1.6 && Math.random() < 0.3) G.emit('ooze', g, b.x, b.y);
      if (j.hp <= 0) { D.tear(g, j, 'torn'); if (g.alive) dm.pain += 40; }
    }
  }
}
/* a break partway along a bone: bent hard past what the flesh round it allows, the flesh tears a little more; pulled,
   what's left of it stretches and gives */
function sectionStress(g, j, h) {
  if (j.limT != null && j.lim[1] < j.limT) { const w = Math.min(j.limT, j.lim[1] + h * 1.8); j.lim = [-w, w]; }
  const a = BODY.anchor(j, 'a'), b = BODY.anchor(j, 'b'), d = Math.hypot(a.x - b.x, a.y - b.y), lim = K.tear * S * 0.6;
  j.stretch = d;
  const st = j.site, R = g.dm.regions[A.regionAt(j.a.id, 0, 0)];
  if (st && (j.over || 0) > 0.25) { st.soft = Math.min(1, st.soft + (j.over - 0.25) * h * 0.6); if (R) sectionUpdate(g, R, 'torn'); }
  if (j.broken) return;
  if (d > lim) {
    j.hp -= (d - lim) * 0.3;
    if (st) st.soft = Math.min(1, st.soft + (d - lim) * h * 0.02);
    if (Math.random() < 0.05) G.emit('creak', g, j);
    if (j.hp <= 0) { D.tear(g, j, 'torn'); if (g.alive) g.dm.pain += 40; }
  }
}
function jointState(g, j, st, why) {
  const dm = g.dm, prev = j.state; j.state = st;
  const R = dm.regions[A.regionAt(j.b.id, 0, -1)] || dm.regions[j.b.id];
  const inj = [];
  if (st === 'sprain') { inj.push({ what: `${j.def.name}: sprained`, sev: 1, tissue: 'joint' }); }
  if (st === 'disloc') { inj.push({ what: `${j.def.name}: dislocated`, sev: j.id.startsWith('hip') || j.id.startsWith('knee') ? 3 : 2, tissue: 'joint' }); j.lim = [j.def.lim[0] - 0.55, j.def.lim[1] + 0.55]; }
  if (st === 'broken') {
    j.lim = [j.def.lim[0] - 0.9, j.def.lim[1] + 0.9];
    if (j.id === 'neck') { dm.cord = Math.max(dm.cord, 1.05); inj.push({ what: 'neck broken: cervical spine fractured, cord severed', sev: 6, tissue: 'bone' }); }
    else if (j.id === 'spine' || j.id === 'waist') { dm.paral = Math.max(dm.paral, 1); inj.push({ what: 'back broken: spinal cord severed below the chest', sev: 5, tissue: 'bone' }); }
    else inj.push({ what: `${j.def.name}: fracture-dislocation`, sev: 3, tissue: 'joint' });
    dm.stats.fractures++;
  }
  if (g.alive) { dm.pain = Math.min(220, dm.pain + (st === 'broken' ? 60 : st === 'disloc' ? 35 : 12)); if (st !== 'sprain') G.emit('voice', g, 'scream', st === 'broken' ? 1.2 : 0.9); }
  const reg = R ? R.id : j.b.id;
  if (R) { if (st === 'broken') R.frac = Math.max(R.frac, 2); R.jointAis = Math.max(R.jointAis || 0, inj[0].sev); ais(g, R); }
  const ev = D.record(g, { kind: 'joint', type: st, joint: j.id, region: reg, part: j.b.id, lx: +(j.lb.x / S).toFixed(1), ly: +(j.lb.y / S).toFixed(1), src: why || (prev === 'ok' ? 'bent past its limit' : 'bent further'), srcKind: 'joint', inj, after: R ? snap(R) : null });
  G.emit('joint', g, j, st, ev);
  checkDeath(g, ev);
}
/* a pin gives: the limb, or the head, or half of him, comes away */
D.tear = function (g, j, why, cause) {
  if (j.broken) return;
  const dm = g.dm, out = BODY.sever(g, j, why);
  if (!out) return;
  dm.stats.pieces++;
  const regB = dm.regions[j.b.id] || dm.regions[A.regionAt(j.b.id, 0, 0)];
  /* the region on the body side of the stump is the one that bleeds and is recorded as amputated */
  const amputee = j.id === 'neck' ? dm.regions.neck : regB;
  if (amputee) amputee.amp = true;
  const alive = g.alive && !g.dusty;
  if (alive) { dm.pain = Math.min(220, dm.pain + 60); dm.shock += 25; }                 /* the stump's bleeding: bleed.js, on 'torn' */
  if (j.id === 'spine' || j.id === 'waist') { dm.regions.abdomen.halved = true; ais(g, dm.regions.abdomen); }
  const how = why === 'cut' ? 'cut off' : why === 'shot' ? 'shot off' : why === 'blast' ? 'blown off' : 'torn off';
  const whole = (j.a.def.whole || j.a.def), what = j.id === 'neck' ? `decapitated (${how.replace(' off', '')})` : j.id === 'spine' || j.id === 'waist' ? `cut in half at the ${j.def.name}` : j.section ? `${whole.name} ${how} partway down, through the ${(amputee && amputee.def.bone) || 'bone'}` : `${j.b.def.name} ${how} at the ${j.def.name.replace(/^(left|right) /, '')}`;
  if (amputee) ais(g, amputee);
  const ev = D.record(g, { kind: 'sever', type: why, joint: j.id, region: amputee ? amputee.id : j.b.id, part: j.b.id, lx: +(j.lb.x / S).toFixed(1), ly: +(j.lb.y / S).toFixed(1), wx: Math.round(out.wa.x), wy: Math.round(out.wa.y), src: why === 'torn' ? (dm.lastPull || 'pulled apart') : cause && cause.src || why, srcKind: 'sever', inj: [{ what, sev: j.id === 'neck' || j.id === 'spine' || j.id === 'waist' ? 6 : j.b.kind === 'uleg' ? 4 : 3, tissue: 'limb' }], after: amputee ? snap(amputee) : null, sect: j.section ? +(j.lb.y / S).toFixed(1) : undefined });
  G.emit('torn', g, j, out, ev);
  if (alive) G.emit('voice', g, 'scream', 1.4);
  if (j.id === 'neck') { if (g.alive) die(g, 'decap', ev); }
  else if (j.id === 'spine' || j.id === 'waist') { if (g.alive) setTimeout(() => { if (g.alive) die(g, 'halves', ev); }, 1400); }
  checkDeath(g, ev);
};
D.headGone = function (g, why, ev) {
  const h = g.parts.head; if (h.gone) return;
  const R = g.dm.regions.cranium; R.organ = 1.3; R.frac = 3; R.amp = true; ais(g, R); g.dm.regions.face.ais = 6;
  G.emit('headGone', g, why, { dir: g.lastHeadDir, speed: why === 'shot' ? 8 : 6 });
  h.gone = true; BODY.removePart(h);
  for (const j of h.joints) if (!j.broken) { j.broken = true; j.state = 'torn'; if (j.c) { try { G.M.World.remove(G.world, j.c); } catch (e) {} j.c = null; } }
  BODY.connect(g);
  g.dm.stats.pieces++;
  const e2 = D.record(g, { kind: 'sever', type: why, joint: 'neck', region: 'cranium', part: 'head', lx: 0, ly: 0, src: ev && ev.src || why, srcKind: 'sever', inj: [{ what: 'head destroyed', sev: 6, tissue: 'organ' }], after: snap(R) });
  if (g.alive) die(g, why === 'blast' ? 'blast' : why === 'shot' ? 'lead' : 'head', e2 || ev);
};

/* ------------------------------------------------------------ being crushed, being dragged */
function loads(g, h) {
  const dm = g.dm, gs = GSTEP();
  let top = 0, on = null;
  for (const p of g.list) {
    if (!p.attached || p.gone) continue;
    let down = 0, up = 0, slide = 0, slideN = 0, other = null;
    for (const c of p.contacts) {
      /* the solver's impulse per step over what gravity adds per step is the mass it's holding up */
      const kg = c.imp / Math.max(gs * (p.body.deltaTime || 16.667) * (p.body.deltaTime || 16.667), 1e-9) * g.kg;
      /* pushed down on from above by something that isn't him */
      const o = c.other, mine = o.plugin && o.plugin.part && o.plugin.part.guy === g && o.plugin.part.attached;
      if (!mine && c.n.y > 0.3) { down += kg * c.n.y; if (!other || kg > other.kg) other = { kg, body: o, pt: c.pt }; }
      if (c.n.y < -0.3) up += kg * -c.n.y;
      if (c.tv > 1.2 && kg > 1 && !mine) { slide += c.tv; slideN += kg; }
    }
    p.load = G.lerp(p.load || 0, Math.min(down, up + down) , 0.25);
    if (p.load > top) { top = p.load; on = other; }
    /* crushing: steady force on a region, past what it can stand */
    const regId = p.kind === 'head' ? 'cranium' : p.kind === 'chest' ? 'thorax' : p.id;
    const R = dm.regions[regId], F = p.load * 9.81;
    const thr = K.crush[regId] || K.crush[A.TRUNK.has(p.kind) ? 'abdomen' : 'limb'];
    if (R && thr && F > thr[0]) {
      R.crushT += h;
      const k = (F - thr[0]) / (thr[1] - thr[0]);
      if (regId === 'thorax') dm.squeeze = Math.max(dm.squeeze || 0, clamp(F / (thr[0] * 2.4), 0, 1));
      if (k > 0) {
        R.soft = Math.min(1, R.soft + k * h * 0.3);
        const f0 = R.frac;
        if (A.LONG.has(p.kind)) { const st = boneSite(R, p, other && other.pt ? G.toLocal(p.body, other.pt.x, other.pt.y).y : 0); st.dmg += k * h * 0.6; st.frac = Math.max(st.frac, st.dmg >= 1.8 ? 3 : st.dmg >= 1 ? 2 : st.dmg >= 0.5 ? 1 : 0); boneSync(R); if (st.frac >= 2) section(g, p, R, st, 'broken'); }
        else { R.bone += k * h * 0.6; R.frac = Math.max(R.frac, R.bone >= 1.8 ? 3 : R.bone >= 1 ? 2 : R.bone >= 0.5 ? 1 : R.frac); }
        if (R.def.org) R.organ = Math.min(1.3, R.organ + k * h * (regId === 'cranium' ? 0.35 : 0.25));
        if (regId === 'abdomen' || regId === 'pelvis') bleedIn(g, regId, 'crush', k * 4, { max: true });
        if (R.frac > f0 || (R.organ >= 1 && !R.crushed)) {
          if (R.organ >= 1) R.crushed = true;
          const what = R.crushed ? (regId === 'cranium' ? 'skull crushed' : regId === 'thorax' ? 'chest crushed' : `${R.def.name} crushed`) : `${R.def.bone}: ${R.frac === 1 ? 'cracked' : R.frac === 2 ? 'fractured' : 'shattered'} under the weight`;
          if (R.frac >= 2 && f0 < 2) dm.stats.fractures++;
          ais(g, R);
          const ev = D.record(g, { kind: 'crush', type: 'crush', region: regId, part: p.id, lx: 0, ly: 0, wx: Math.round(p.body.position.x), wy: Math.round(p.body.position.y), src: on ? nameOf(g, on.body).src + ` (${Math.round(F)} N on him)` : `${Math.round(F)} N`, srcKind: 'crush', F: Math.round(F), inj: [{ what, sev: R.ais, tissue: R.crushed ? 'organ' : 'bone' }], after: snap(R) });
          G.emit('fracture', g, p, { region: regId, frac: R.frac, lx: 0, ly: 0, E: F / 10, crush: true });
          if (g.alive) G.emit('voice', g, 'scream', 1.1);
          if (R.crushed && regId === 'cranium') { D.headGone(g, 'crush', ev); }
          checkDeath(g, ev);
        }
      }
    } else if (R) R.crushT = Math.max(0, R.crushT - h);
    /* road rash: sliding with weight on it scrapes through the cloth, then the skin */
    if (slide > 0 && slideN > 3) {
      const ms = slide * 60 * g.mpp, dose = ms * slideN * h * 0.0016 * (p.kind === 'foot' ? 0.08 : 1);
      const RR = dm.regions[A.regionAt(p.id, 0, 0)];
      if (RR && dose > 0.0004) {
        RR.abr = Math.min(1, RR.abr + dose); RR.skin = Math.max(0, RR.skin - dose * 0.4);
        if (g.alive && !g.dusty) RR.pain = Math.min(100, RR.pain + dose * 40);
        if (RR.abr > 0.3 && G.bleed && !g.dusty) G.bleed.ooze(g, p, RR.id, RR.abr * 0.5);
        G.emit('abrade', g, p, { dose, dir: p.contacts[0] && p.contacts[0].tdir, pt: p.contacts[0] && p.contacts[0].pt });
        const key = 'abr|' + RR.id, a = dm.aggr[key];
        if (a && G.t - a.lastT < 1.2) { a.ev.dist = +(a.ev.dist + ms * h).toFixed(2); a.lastT = G.t; a.ev.after = snap(RR); }
        else if (RR.abr > 0.05) { const ev = D.record(g, { kind: 'abrasion', type: 'abrasion', region: RR.id, part: p.id, lx: 0, ly: 0, src: 'dragged along ' + (p.contacts[0] ? nameOf(g, p.contacts[0].other).src : 'the floor'), srcKind: 'abrasion', dist: +(ms * h).toFixed(2), inj: [{ what: 'abrasions', sev: RR.abr > 0.6 ? 2 : 1, tissue: 'skin' }], after: snap(RR) }); if (ev) dm.aggr[key] = { ev, lastT: G.t }; }
        ais(g, RR);
      }
    }
  }
  dm.loadKg = top; dm.loadOn = on ? on.pt : null;
}

/* ------------------------------------------------------------ what he can still do with each part */
function capOf(g, ids, joints) {
  const dm = g.dm; let c = 1;
  for (const id of ids) {
    const p = g.parts[id]; if (!p || p.gone || !p.attached) return id.startsWith('hand') || id.startsWith('foot') ? c * 0.55 : 0;
    const R = dm.regions[id];
    if (R) { c *= R.frac >= 2 ? 0.1 : R.frac === 1 ? 0.65 : 1; c *= 1 - R.soft * 0.45; c *= 1 - R.burn * 0.3; if (R.secSite && R.secSite.soft > 0.35) c *= 0.2; }
  }
  for (const jid of joints) { const j = g.jointById[jid]; if (!j || j.broken) return 0; c *= j.state === 'broken' ? 0.05 : j.state === 'disloc' ? 0.12 : j.state === 'sprain' ? 0.6 : 1; }
  return c;
}
function caps(g) {
  const dm = g.dm, cap = dm.cap, R = dm.regions;
  const cord = clamp(1 - dm.cord, 0, 1), para = clamp(1 - dm.paral, 0, 1);
  const weak = clamp((dm.blood / T.bloodMl - 0.52) / 0.33, 0.15, 1) * clamp(dm.oxy * 1.25, 0.1, 1);
  if (g.dusty) { cap.legL = capOf(g, ['ulegL', 'llegL', 'footL'], ['hipL', 'kneeL', 'ankleL']); cap.legR = capOf(g, ['ulegR', 'llegR', 'footR'], ['hipR', 'kneeR', 'ankleR']); cap.armL = capOf(g, ['uarmL', 'larmL', 'handL'], ['shoulderL', 'elbowL', 'wristL']); cap.armR = capOf(g, ['uarmR', 'larmR', 'handR'], ['shoulderR', 'elbowR', 'wristR']); cap.core = 1; cap.neck = 1; cap.cons = 1; cap.will = 0.8; return; }
  cap.legL = capOf(g, ['ulegL', 'llegL', 'footL'], ['hipL', 'kneeL', 'ankleL']) * cord * para * weak;
  cap.legR = capOf(g, ['ulegR', 'llegR', 'footR'], ['hipR', 'kneeR', 'ankleR']) * cord * para * weak;
  cap.armL = capOf(g, ['uarmL', 'larmL', 'handL'], ['shoulderL', 'elbowL', 'wristL']) * cord * weak;
  cap.armR = capOf(g, ['uarmR', 'larmR', 'handR'], ['shoulderR', 'elbowR', 'wristR']) * cord * weak;
  cap.core = clamp((R.pelvis.frac >= 2 ? 0.2 : 1) * (R.thorax.frac >= 3 ? 0.4 : R.thorax.frac >= 2 ? 0.7 : 1) * (1 - R.abdomen.organ * 0.5) * cord * para * weak, 0, 1);
  const sp = g.jointById.spine, wa = g.jointById.waist;
  if (sp && (sp.broken || sp.state === 'broken')) cap.core *= 0.1; if (wa && (wa.broken || wa.state === 'broken')) cap.core *= 0.1;
  cap.neck = clamp((R.neck.frac >= 2 ? 0.1 : 1) * cord, 0, 1);
  cap.cons = dm.cons;
  cap.will = clamp(1 - Math.max(0, dm.pain - 150) / 200, 0.35, 1) * (1 - Math.min(0.45, (dm.daze || 0) * 0.07));
}
function jointCap(g, j) {
  const cap = g.dm.cap, id = j.id, s = id.slice(-1);
  let c = id.startsWith('shoulder') || id.startsWith('elbow') || id.startsWith('wrist') ? (s === 'L' ? cap.armL : cap.armR)
    : id.startsWith('hip') || id.startsWith('knee') || id.startsWith('ankle') ? (s === 'L' ? cap.legL : cap.legR)
    : id === 'neck' ? cap.neck : cap.core;
  if (j.state === 'disloc') c = Math.min(c, 0.1); else if (j.state === 'broken') c = Math.min(c, 0.04);
  return c;
}

/* ------------------------------------------------------------ his body, every step */
D.step = function (g, h) {
  const dm = g.dm; if (!dm) return;
  if (dm.splitQ && dm.splitQ.length) sectionNow(g);
  loads(g, h);
  jointStress(g, h);
  /* in the air: remember where it started, for the fall */
  const br = g.br;
  if (br && br.air > 0.08 && dm.fallFrom == null) { dm.fallFrom = BODY.com(g).y; dm.fallTop = dm.fallFrom; }
  if (dm.fallFrom != null) dm.fallTop = Math.min(dm.fallTop, BODY.com(g).y);
  if (br && br.air === 0 && dm.fallFrom != null && G.t - (dm.fallSet || 0) > 0.6) dm.fallSet = G.t;
  if (br && br.mode !== 'air' && br.air === 0) { if (dm.fallFrom != null && !dm.fallHold) dm.fallHold = G.t; if (dm.fallHold && G.t - dm.fallHold > 0.25) { dm.fallFrom = null; dm.fallHold = 0; } } else dm.fallHold = 0;
  /* let go of him at speed and he's been thrown */
  if (br && br.s && br.s.held) dm.wasHeld = G.t;
  else if (dm.wasHeld && G.t - dm.wasHeld < 0.05) { const c = BODY.com(g); if (Math.hypot(c.vx, c.vy) > 6) { dm.thrownT = G.t; G.emit('thrown', g); } dm.wasHeld = 0; }
  dm.jolt = Math.max(0, dm.jolt - h * 2.2);
  if (g.dusty) { if (g.alive) caps(g); else { dm.bpm *= 0.985; dm.pulse *= 0.86; } return; }
  /* ---- blood. every open place on him, and in him, runs at what his heart can still push (bleed.js); dead, only
     what can drain downhill does */
  const fl = G.bleed ? G.bleed.step(g, h) : { ext: 0, int: 0 }, rate = fl.ext + fl.int;
  dm.blood = Math.max(0, dm.blood - rate * h); dm.lost += rate * h; dm.rate = rate;
  dm.lostExt = (dm.lostExt || 0) + fl.ext * h; dm.lostInt = (dm.lostInt || 0) + fl.int * h;
  if (!g.alive) { dm.bpm *= 0.985; dm.pulse *= 0.86; return; }
  for (const R of Object.values(dm.regions)) R.pain *= 1 - h * 0.02;
  const pressure = clamp(dm.blood / T.bloodMl, 0, 1);
  /* ---- the heart: racing as he empties, until there's too little left to race with */
  const lowB = 1 - dm.blood / T.bloodMl;
  const target = 70 + Math.min(110, dm.pain * 0.6) + lowB * 90 - (lowB > 0.42 ? (lowB - 0.42) * 520 : 0) - (dm.oxy < 0.4 ? (0.4 - dm.oxy) * 180 : 0);
  dm.bpm += (target - dm.bpm) * Math.min(1, h * 1.2);
  dm.beat += dm.bpm / 60 * h; if (dm.beat >= 1) { dm.beat -= 1; dm.pulse = 1; dm.beatN = (dm.beatN || 0) + 1; G.emit('beat', g); }
  dm.pulse *= Math.pow(0.86, h * 60);
  /* ---- breathing: a weight on his chest, a crushed throat, a cut cord, a hole in a lung, a chest filling with blood */
  const sq = dm.squeeze || 0; dm.squeeze = Math.max(0, sq - h * 3);
  const breath = clamp(1 - sq * 0.95 - (dm.lung || 0) * 0.62 - clamp(dm.cord - 0.75, 0, 1) * 4 - (dm.breathHit || 0) - (dm.regions.thorax.organ > 0.6 ? 0.3 : 0), 0, 1);
  dm.breathHit = Math.max(0, (dm.breathHit || 0) - h * 0.15);
  dm.breath = breath;
  const want = breath * clamp(pressure * 1.6, 0, 1);
  dm.oxy += (want - dm.oxy) * h * (want < dm.oxy ? 0.11 : 0.4);
  if (dm.oxy < 0.2) dm.hypoxT += h; else dm.hypoxT = Math.max(0, dm.hypoxT - h * 2);
  /* ---- awake or not */
  dm.stun = Math.max(0, dm.stun - h); dm.daze = Math.max(0, (dm.daze || 0) - h);
  /* blood: fine to about a quarter gone, out by two fifths, dead a little past half (DEAD_AT) */
  const fromBlood = clamp((dm.blood - T.bloodMl * 0.55) / (T.bloodMl * 0.21), 0, 1), fromOxy = clamp((dm.oxy - 0.3) / 0.35, 0, 1), fromBrain = clamp(1 - Math.max(0, dm.regions.cranium.organ - 0.45) * 1.6, 0, 1);
  const tgtC = Math.min(fromBlood, fromOxy, fromBrain, dm.stun > 0 ? 0 : 1);
  dm.cons += (tgtC - dm.cons) * Math.min(1, h * (tgtC < dm.cons ? 6 : 0.9));
  const wasOut = dm.out; dm.out = dm.cons < 0.25;
  if (dm.out !== !!wasOut) { D.record(g, { kind: 'vital', type: dm.out ? 'lost consciousness' : 'came round', src: dm.out ? (dm.stun > 0 ? 'the blow to the head' : fromOxy < fromBlood ? 'not enough air' : 'blood loss') : '', srcKind: 'vital' }); G.emit(dm.out ? 'ko' : 'wake-up', g); }
  /* ---- pain and shock */
  dm.pain *= 1 - h * 0.045; dm.shock *= 1 - h * 0.02;
  dm.shock += (D.iss(g) / 75) * h * 3 + lowB * h * 4;
  let worst = null; for (const R of Object.values(dm.regions)) if (R.pain > 8 && (!worst || R.pain > worst.pain)) worst = R;
  dm.worst = worst ? { part: worst.def.part, region: worst.id, pain: worst.pain / 100 } : null;
  caps(g);
  checkDeath(g, null);
};

/* ------------------------------------------------------------ death */
const COD = {
  decap: 'decapitation', head: 'massive head trauma', halves: 'transection of the trunk', blast: 'blast injuries', lead: 'gunshot wound',
  bleed: 'exsanguination', asphyxia: 'asphyxia', cord: 'high cervical spinal cord transection', heart: 'cardiac rupture', brain: 'massive brain injury',
  ibleed: 'internal haemorrhage', hemothorax: 'haemothorax (the chest filled with blood)',
  shock: 'traumatic shock', stab: 'stab wound', impale: 'impalement', nailed: 'penetrating injury from a nail', stapled: 'puncture wounds from staples', crushhead: 'crush injury of the head', crushchest: 'traumatic asphyxia from chest compression'
};
/* what's left when the bleeding kills him: half of what he had */
const DEAD_AT = 0.5;
D.DEAD_AT = DEAD_AT;
const pierce = ev => ev.srcKind === 'stab' ? 'stab' : ev.srcKind === 'spike' ? 'impale' : ev.srcKind === 'nail' ? 'nailed' : ev.srcKind === 'staple' ? 'stapled' : 'lead';
function checkDeath(g, ev) {
  if (!g.alive || g.dusty && !(g.parts.head.gone || g.dm.regions.cranium.organ >= 1.25)) return;
  const dm = g.dm, R = dm.regions;
  if (g.dusty) { die(g, 'head', ev); return; }
  if (g.parts.head.gone) { die(g, R.cranium.crushed ? 'crushhead' : 'head', ev); return; }
  if (R.cranium.organ >= 1) { die(g, ev && ev.kind === 'shot' ? pierce(ev) : 'brain', ev); return; }
  if (R.thorax.organ >= 1.05 && (ev ? ev.region === 'thorax' : true)) { die(g, ev && ev.kind === 'shot' ? pierce(ev) : ev && ev.kind === 'blast' ? 'blast' : 'heart', ev); return; }
  if (dm.cord >= 1 && !dm.cordT) { dm.cordT = G.t; D.record(g, { kind: 'vital', type: 'stopped breathing', src: 'the cord at his neck is cut', srcKind: 'vital' }); }
  if (dm.blood < T.bloodMl * DEAD_AT) { die(g, (dm.lostInt || 0) > (dm.lostExt || 0) * 1.2 ? 'ibleed' : 'bleed', ev); return; }
  if (dm.hypoxT > 5) { die(g, dm.cordT ? 'cord' : (dm.squeeze > 0.3 || R.thorax.crushT > 1) ? 'crushchest' : (dm.hemo || 0) > 350 ? 'hemothorax' : 'asphyxia', ev); return; }
  if (dm.shock > 160) { die(g, 'shock', ev); return; }
}
function die(g, code, ev) {
  if (!g.alive) return;
  g.alive = false; g.diedT = G.t; const dm = g.dm;
  dm.cons = 0;
  g.cause = COD[code] || code; g.codeOfDeath = code;
  const chain = causeChain(g, code, ev);
  g.rec.chain = chain;
  const dEv = D.record(g, { kind: 'death', type: code, src: chain.immediate, srcKind: 'death', fatal: ev ? ev.i : null });
  g.rec.fatal = ev ? ev.i : (dEv ? dEv.i : null);
  G.note('death ' + g.name + ' ' + code);
  G.emit('death', g, code, ev);
}
D.die = die;
/* the death certificate: part I is the chain, part II whatever else was badly wrong */
function causeChain(g, code, ev) {
  const dm = g.dm, R = dm.regions, ev2 = g.rec.events;
  const imm = COD[code] || code;
  const due = [];
  const top = (pred, n = 2) => ev2.filter(pred).sort((a, b) => (b.inj || []).reduce((s, i) => Math.max(s, i.sev), 0) - (a.inj || []).reduce((s, i) => Math.max(s, i.sev), 0)).slice(0, n);
  if (code === 'bleed') {
    const s = top(e => (e.inj || []).some(i => /artery|vein|cut off|torn off|blown off|shot off|amputat|laceration|incised|gunshot|compound|liver|spleen|heart/.test(i.what)), 3);
    for (const e of s) due.push(`${worstInj(e)} (${R[e.region] ? R[e.region].def.name : e.region}), ${e.src}`);
  } else if (code === 'ibleed') {
    const s = top(e => (e.inj || []).some(i => /liver|spleen|lung|heart|aorta|bowel|stomach|eviscerat|femur|pelvis|fractur|shattered|broken|crushed/.test(i.what)), 3);
    for (const e of s) due.push(`${worstInj(e)} (${R[e.region] ? R[e.region].def.name : e.region}), ${e.src}`);
  } else if (code === 'hemothorax') {
    const s = top(e => e.region === 'thorax' || (e.inj || []).some(i => /lung/.test(i.what)), 2); for (const e of s) due.push(`${worstInj(e)}, ${e.src}`);
  } else if (code === 'crushchest' || code === 'asphyxia') {
    const s = top(e => e.kind === 'crush' || e.region === 'thorax' || e.region === 'neck', 2); for (const e of s) due.push(`${worstInj(e)}, ${e.src}`);
    if (!due.length) due.push('chest held down by a heavy weight');
  } else if (code === 'cord') {
    const s = top(e => e.region === 'neck' || e.joint === 'neck', 2); for (const e of s) due.push(`${worstInj(e)}, ${e.src}`);
  } else if (ev) due.push(`${worstInj(ev)} (${R[ev.region] ? R[ev.region].def.name : ev.region}), ${ev.src}`);
  /* the very first thing that went wrong, if it isn't already there */
  const first = ev2.find(e => (e.inj || []).some(i => i.sev >= 2));
  if (first && !due.some(d => d.includes(first.src) && d.includes(worstInj(first)))) due.push(`which began with ${worstInj(first)} (${R[first.region] ? R[first.region].def.name : first.region}), ${first.src}`);
  const other = [];
  for (const r of Object.values(R)) if (r.ais >= 3 && !due.some(d => d.includes(r.def.name))) other.push(`${r.def.name}: ${regionWords(r)}`);
  const tools = new Set(ev2.map(e => e.srcKind));
  const manner = g.dusty ? 'he was already dead' : ['knife', 'bullet', 'blast'].some(k => tools.has(k)) || ev2.some(e => e.type === 'thrown') || ev2.some(e => /hammer/.test(e.src)) ? 'homicide' : 'accident';
  return { immediate: imm, due, other: other.slice(0, 5), manner, iss: D.iss(g) };
}
function worstInj(e) { const l = (e.inj || []).slice().sort((a, b) => b.sev - a.sev); return l.length ? l[0].what : e.type; }
function regionWords(r) {
  const w = [];
  if (r.amp) w.push('amputated'); if (r.frac >= 2) w.push(r.frac === 3 ? 'shattered ' + r.def.bone : 'fractured ' + r.def.bone); else if (r.frac === 1) w.push('cracked ' + r.def.bone);
  if (r.organ >= 0.6) w.push(organWhat(r.id, r.organ >= 1 ? 3 : 2)); if (r.burn > 0.3) w.push('burned');
  if (r.lac > 6) w.push(`${Math.round(r.lac)} cm of wounds`);
  return w.join(', ') || 'injured';
}
D.regionWords = regionWords;

/* after every guy has had his step: nothing yet */
D.after = function () {};
/* the console's old hurt(id, dmg, kind): a hit of that many units of version two's damage */
D.direct = function (g, p, d, kind) {
  const E = d * 3.2, at = p.body.position;
  if (kind === 'cut') D.cut(g, p, { lx: 0, ly: 0, wx: at.x, wy: at.y, dir: { x: 1, y: 0 }, len: 20 * S });
  else if (kind === 'bullet') D.shot(g, p, { lx: 0, ly: 0, wx: at.x, wy: at.y, dir: { x: 0, y: -1 } });
  else if (kind === 'blast') D.blast(g, p, { E, k: clamp(d / 70, 0, 1), dir: { x: 0, y: -1 }, dist: 40 });
  else impact(g, p, { E, v: Math.sqrt(2 * E / (p.body.mass * g.kg)), area: 'broad', type: 'blunt', lx: 0, ly: 0, wx: at.x, wy: at.y, dir: { x: 0, y: 1 }, n: { x: 0, y: -1 }, src: 'the console', srcKind: 'hand' });
};
D.ais = ais; D.snap = snap;
})();
