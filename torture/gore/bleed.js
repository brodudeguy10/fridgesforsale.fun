/* ============================================================
   THE GUY, version three: bleeding (the torture room's copy).
   every place he bleeds from is kept on its own: where it is on
   him, what's open (a scrape, a cut vein, an artery, a stump, or
   something inside him), how fast it runs at full pressure, and
   how far it has clotted. what each one loses depends on what his
   heart has left to push with, so the more he's lost the slower
   it comes, and once he's dead only what can drain out does.

       capillary  a scrape or a shallow cut: oozes, clots in a minute
       vein       a deep cut, a hole: runs steadily, clots slowly
       artery     pumps on every heartbeat, in a jet that carries,
                  and barely clots at all
       stump      what's left where a limb came off: an artery's worth
       drain      the piece that came off, emptying what it held
       internal   inside him (a lung, the liver, a broken femur): it
                  shows only through a hole that's there, and a chest
                  filling with blood is a lung that stops working

   a wound pressed against the floor or a wall is held shut: it
   loses less and what it loses goes into the floor under him.
   everything that comes out lands somewhere: on him, on the wall,
   in the pool. the pool moves when he's dragged through it, and
   anything of his that's bloody marks what it touches (blood.js).
============================================================ */
(function () {
'use strict';
const G = window.__G3; if (!G || !G.A) return;
const A = G.A, S = G.S, clamp = G.clamp, rnd = G.rnd;
const BLD = G.bleed = {};
const T = G.TUNE;

/* ml/s at full pressure for each named vessel when it's opened. a game's minutes, not a hospital's: a cut carotid
   puts him on the floor in well under a minute, a cut femoral in about one */
const VESSEL = {
  'right carotid artery': 80, 'left carotid artery': 80, 'jugular vein': 34, 'heart': 150, 'abdominal aorta': 110,
  'right femoral artery': 62, 'left femoral artery': 62, 'right brachial artery': 28, 'left brachial artery': 28,
  'right radial artery': 16, 'left radial artery': 16, 'right tibial artery': 14, 'left tibial artery': 14
};
const VEINS = new Set(['jugular vein']);
/* a limb off at a joint (or through the middle of a bone), what the stump pumps */
const STUMP = { neck: 90, shoulder: 34, elbow: 15, wrist: 6, hip: 48, knee: 22, ankle: 6, spine: 60, waist: 70, uarm: 26, larm: 12, uleg: 44, lleg: 18 };
/* how fast each kind clots (per second), and how much of it never does */
const CLOT = { cap: [1 / 28, 0], vein: [1 / 95, 0.18], art: [1 / 520, 0.7], stump: [1 / 260, 0.45], drain: [1 / 14, 0], int: [1 / 700, 0.5] };
const MAX = 44;

function list(g) { return g.dm ? (g.dm.vessels = g.dm.vessels || []) : []; }
/* which way a wound points out of him, in the part's own frame: away from the middle of the part on the side it's on,
   tipped up a little (a jet off the front of the neck can't come at you in a picture drawn from the front, so it goes
   off to the side it's on and up, the way it looks from a step to one side) */
function outward(p, lx, ly) {
  const d = p.def, hw = (d.wh ? d.wh[0] : d.r * 2) * S / 2;
  let nx = lx / Math.max(1, hw), ny = -0.35;
  if (Math.abs(nx) < 0.25) nx = (Math.random() < 0.5 ? -1 : 1) * 0.5;
  const m = Math.hypot(nx, ny) || 1; return { x: nx / m, y: ny / m };
}

/* ------------------------------------------------------------ new places he bleeds from */
BLD.add = function (g, p, o) {
  if (!g.dm || g.dusty || !p || p.gone || !(o.rate > 0)) return null;
  const L = list(g), kind = o.kind || 'vein';
  const lx = o.lx || 0, ly = o.ly || 0;
  /* the same place again (a saw biting, a second pass of the knife): it opens further instead of making another */
  const near = L.find(v => v.part === p && v.kind === kind && !v.int && Math.hypot(v.lx - lx, v.ly - ly) < (kind === 'art' ? 3 : 2.6) * S && (!o.name || v.name === o.name));
  if (near) { near.rate0 = Math.min(near.rate0 + o.rate * (kind === 'art' ? 0.3 : 0.7), near.cap); near.clot *= 0.4; return near; }
  const dir = o.dir || outward(p, lx, ly);
  const v = { part: p, lx, ly, dx: dir.x, dy: dir.y, kind, rate0: o.rate, cap: o.rate * (kind === 'art' || kind === 'stump' ? 1.4 : 3), clot: 0, region: o.region || A.regionAt(p.id, lx / S, ly / S),
    name: o.name || null, t0: G.t, lost: 0, int: false, vol: o.vol || 0, beat: -1, q: 0 };
  L.push(v);
  /* the region's total right away, so what's written down about this wound says it's bleeding (step() keeps it after) */
  const R = g.dm.regions[v.region]; if (R && kind !== 'drain') R.bleed += o.rate * (g.alive ? 0.35 + 0.65 * perfusion(g) : 0.05);
  if (L.length > MAX) { /* too many: the smallest one that's left goes */ let k = -1, best = 1e9; for (let i = 0; i < L.length; i++) { const w = L[i], q = w.rate0 * (1 - w.clot); if (!w.int && w.kind !== 'art' && w.kind !== 'stump' && w.kind !== 'drain' && q < best) { best = q; k = i; } } if (k >= 0) L.splice(k, 1); }
  return v;
};
/* bleeding inside him: an organ, a broken femur, the pelvis. vent: a hole it can come out of, if there is one.
   max: the same thing going on and on (a weight on his belly) keeps it at the worst it's been instead of adding up */
BLD.internal = function (g, region, what, rate, o = {}) {
  if (!g.dm || g.dusty || !(rate > 0)) return null;
  const L = list(g);
  const near = L.find(v => v.int && v.region === region && v.what === what);
  if (near) {
    if (o.max) { if (rate > near.rate0 * (1 - near.clot) + 0.05) { near.rate0 = Math.max(near.rate0, rate); near.clot *= 0.7; } }
    else { near.rate0 = Math.min(near.rate0 + rate, near.cap); near.clot *= 0.5; }
    if (o.vent && !near.vent) near.vent = o.vent;
    return near;
  }
  const v = { int: true, region, what, kind: 'int', rate0: rate, cap: rate * 4 + 20, clot: 0, t0: G.t, lost: 0, vent: o.vent || null, part: o.vent ? o.vent.part : null, q: 0 };
  L.push(v);
  const R = g.dm.regions[region]; if (R && g.alive) R.ibleed += rate * perfusion(g);
  return v;
};
/* a scrape that oozes over a whole region (dragged along the floor): one per region, kept at the worst it's been */
BLD.ooze = function (g, p, region, rate) {
  const L = list(g), v = L.find(w => w.kind === 'cap' && w.ooze && w.region === region);
  if (v) { v.rate0 = Math.max(v.rate0 * (1 - v.clot), rate); v.clot = 0; return v; }
  const w = BLD.add(g, p, { kind: 'cap', rate, lx: 0, ly: 0, region });
  if (w) w.ooze = true; return w;
};

/* ------------------------------------------------------------ the stumps: whatever came off leaves an open end */
/* the parts still joined to a part, through the joints that are still whole */
function piece(g, p) { const seen = new Set([p.id]); let grew = true; while (grew) { grew = false; for (const j of g.joints) { if (j.broken) continue; if (seen.has(j.a.id) !== seen.has(j.b.id)) { seen.add(j.a.id); seen.add(j.b.id); grew = true; } } } return g.list.filter(q => seen.has(q.id) && !q.gone); }
function drainEnd(g, p, l, dir) {
  const m = Math.hypot(l.x, l.y) || 1, held = piece(g, p).reduce((s, q) => s + (q.def.mass || 0.02), 0) * T.bloodMl * 0.6;
  const v = BLD.add(g, p, { kind: 'drain', rate: clamp(held / 12, 2, 18), lx: l.x, ly: l.y, dir: dir || { x: l.x / m, y: l.y / m }, region: A.regionAt(p.id, l.x / S, l.y / S) });
  if (v) v.vol = held;
  return held;
}
G.on('torn', (g, j, out) => {
  if (!g.dm || g.dusty) return;
  const type = j.def.section ? j.def.kindOf : j.id.replace(/[LR]$/, '');
  const rate = STUMP[type] || 10;
  /* his side of it: pumping while his heart goes. if this side had already come off him, it only drains */
  if (j.a && !j.a.gone) {
    const l = j.section ? { x: 0, y: j.la.y } : j.la, m = Math.hypot(l.x, l.y) || 1, dir = j.section ? { x: 0, y: 1 } : { x: l.x / m, y: l.y / m };
    if (j.a.attached) BLD.add(g, j.a, { kind: 'stump', rate, lx: l.x, ly: l.y, dir, region: A.regionAt(j.a.id, l.x / S, l.y / S), name: j.def.name });
    else drainEnd(g, j.a, l, dir);
  }
  /* the piece that came off took the blood that was in it, and empties it out of the end */
  if (j.b && !j.b.gone) {
    const held = drainEnd(g, j.b, j.section ? { x: 0, y: j.lb.y } : j.lb, j.section ? { x: 0, y: -1 } : null);
    if (j.a && j.a.attached && !j.b.attached) { g.dm.blood = Math.max(0, g.dm.blood - held); g.dm.lost += held; g.dm.lostExt = (g.dm.lostExt || 0) + held; }
  }
});

/* a limb that broke in two: whatever was bleeding below the break is on the lower piece now (same frame, same place) */
G.on('split', (g, p, p2, ys) => { for (const v of list(g)) { if (v.part === p && !v.int && v.ly > ys) v.part = p2; if (v.int && v.vent && v.vent.part === p && v.vent.ly > ys) v.vent.part = p2; } });

/* ------------------------------------------------------------ every step: what he's losing, and from where */
/* what his heart has to push with: all of it at a full five litres, about half of it with half gone (where it
   stops), and more while it races (to a point) */
function perfusion(g) {
  const dm = g.dm, vol = clamp(dm.blood / T.bloodMl, 0, 1);
  if (!g.alive) return 0;
  return Math.pow(clamp((vol - 0.3) / 0.7, 0, 1), 0.6) * clamp(0.55 + dm.bpm / 220, 0.5, 1.25);
}
BLD.perfusion = perfusion;
/* is this wound pressed against something (the floor, a wall, his own arm lying on it): held shut */
function pressed(v, w) {
  const p = v.part; if (!p || !p.contacts.length) return null;
  for (const c of p.contacts) { if (c.other.isSensor) continue; if (Math.hypot(c.pt.x - w.x, c.pt.y - w.y) < 4.5 * S) return c; }
  return null;
}
BLD.step = function (g, h) {
  const dm = g.dm, L = list(g); let ext = 0, int = 0;
  for (const R of Object.values(dm.regions)) { R.bleed = 0; R.ibleed = 0; }
  if (!L.length) { dm.extRate = 0; return { ext: 0, int: 0 }; }
  const pf = perfusion(g), alive = g.alive;
  /* dead, what's open still drains downhill for a while, less and less as it sets */
  const sinceDeath = alive ? 0 : G.t - (g.diedT || G.t), setting = alive ? 1 : clamp(1 - sinceDeath / 300, 0.1, 1);
  for (let i = L.length - 1; i >= 0; i--) {
    const v = L[i];
    if (!v.int && (!v.part || v.part.removed || v.part.gone)) { L.splice(i, 1); continue; }
    const [ck, floor] = CLOT[v.kind] || CLOT.vein;
    /* clotting: faster the less is pushing, never past what that kind of wound allows */
    v.clot = Math.min(1 - floor, v.clot + h * ck * (alive ? 1 + (1 - pf) * 1.5 : 3));
    let q = v.rate0 * (1 - v.clot);
    if (v.kind === 'drain') { q = Math.min(q, v.vol / Math.max(h, 1e-3)); v.vol = Math.max(0, v.vol - q * h); if (v.vol <= 0.5) { L.splice(i, 1); continue; } }
    else if (!alive) {
      if (v.int) q = 0;
      else { const w = G.dirWorld(v.part.body, v.dx, v.dy), since = G.t - Math.max(v.t0, g.diedT || 0); q *= 0.05 * clamp(w.y + 0.35, 0, 1.35) * Math.exp(-since / 40) * setting; }
    }
    else if (v.kind === 'art' || v.kind === 'stump' || v.int) q *= pf;
    else q *= 0.35 + 0.65 * pf;
    if (!v.int) { const w = G.toWorld(v.part.body, v.lx, v.ly); v.wx = w.x; v.wy = w.y; v.press = pressed(v, w); if (v.press) q *= 0.45; }
    v.q = q;
    v.lost += q * h;
    const R = dm.regions[v.region];
    if (v.int) { int += q; if (R) R.ibleed += q; } else if (v.kind !== 'drain') { ext += q; if (R) R.bleed += q; }
    if (q < 0.005 && v.clot >= 1 - floor - 1e-6 && G.t - v.t0 > 5 && v.kind !== 'art' && v.kind !== 'stump') L.splice(i, 1);
  }
  /* a chest filling with blood: a lung that stops working, a little more every second */
  const th = dm.regions.thorax;
  if (th && th.ibleed > 0) { dm.hemo = (dm.hemo || 0) + th.ibleed * h; dm.lung = Math.max(dm.lung || 0, (dm.lungHit || 0) + Math.min(1.3, dm.hemo / 1100)); }
  dm.extRate = ext; dm.intRate = int;
  return { ext, int };
};

/* ------------------------------------------------------------ letting it out: drops, jets, a cough */
BLD.emit = function (g, h, add) {
  const dm = g.dm, L = list(g); if (g.dusty) return;
  const pf = perfusion(g), beat = dm.beatN || 0;
  for (const v of L) {
    if (v.int) {
      /* an internal bleed with a hole to come out of wells up through it, dark and slow, a bit of it, the rest stays in */
      if (v.vent && v.vent.part && !v.vent.part.removed && !v.vent.part.gone && v.q > 0.05) {
        const b = v.vent.part.body, w = G.toWorld(b, v.vent.lx, v.vent.ly);
        v.acc = (v.acc || 0) + v.q * 0.3 * h;
        let guard = 0;
        while (v.acc > 1.4 && guard++ < 6) { v.acc -= 1.4; add(w.x + rnd(-0.8, 0.8), w.y + rnd(0, 1), b.velocity.x * 0.7 + rnd(-0.3, 0.3), b.velocity.y * 0.7 + rnd(0, 0.5), rnd(1, 1.9), rnd(90, 150), 1.4, g, 0); }
        v.vent.part.wet = Math.min(1, (v.vent.part.wet || 0) + v.q * 0.02 * h);
        markOpening(v.vent.part, v.vent.lx, v.vent.ly, v.q * 0.3);
      }
      continue;
    }
    const q = v.q || 0; if (q <= 0.002 || v.wx == null) continue;
    const b = v.part.body;
    v.part.wet = Math.min(1, (v.part.wet || 0) + q * 0.03 * h);
    markOpening(v.part, v.lx, v.ly, q);
    /* held against the floor or a wall: it soaks out where it's pressed, into the pool or onto the wall */
    if (v.press) { BLD.pressed(v, q * h); continue; }
    if ((v.kind === 'art' || v.kind === 'stump') && g.alive && pf > 0.03) {
      /* on each beat, a jet that carries: most of that beat's blood in a stream along the way the wound faces, the
         first of it fastest; some of it reaches the wall behind him */
      if (beat !== v.beat) {
        v.beat = beat;
        const per = q * 60 / Math.max(40, dm.bpm) * 0.75, n = clamp(Math.round(per / 1.5), 2, 28), dw = G.dirWorld(b, v.dx, v.dy);
        const sp = 1.4 + 4.2 * Math.sqrt(pf) * Math.pow(Math.min(v.rate0, 120) / 60, 0.35), a0 = Math.atan2(dw.y, dw.x);
        for (let i = 0; i < n; i++) {
          const k = 1.12 - 0.55 * (i / n) + rnd(-0.07, 0.07), a = a0 + rnd(-0.14, 0.14);
          add(v.wx, v.wy, Math.cos(a) * sp * k + b.velocity.x, Math.sin(a) * sp * k + b.velocity.y, rnd(1.1, 2.3), rnd(110, 200), per / n, g, i % 6 === 0 ? rnd(5, 11) : 0);
        }
        if (per > 5 && Math.random() < 0.7) G.emit('sfx', 'spurt', { x: v.wx, k: clamp(per / 30, 0.2, 1) });
      }
      /* and between beats it keeps running out */
      v.acc = (v.acc || 0) + q * 0.25 * h;
    } else v.acc = (v.acc || 0) + q * h;
    /* the steady part: drops off the wound, falling with him */
    let guard = 0;
    while (v.acc > 1.3 && guard++ < 8) { v.acc -= 1.3; add(v.wx + rnd(-1, 1), v.wy + rnd(0, 1.2), b.velocity.x * 0.8 + rnd(-0.25, 0.25), b.velocity.y * 0.8 + rnd(0, 0.45), rnd(0.9, 1.8), rnd(90, 150), 1.3, g, 0); }
  }
  /* blood in his lungs comes up: a wet cough, blood out of his mouth and down his chin */
  const hd = g.parts.head;
  if (g.alive && hd && !hd.gone && hd.attached) {
    if (dm.cons > 0.15 && (dm.hemo || 0) > 120 && G.t - (dm.coughT || -9) > (dm.coughGap || 3)) {
      dm.coughT = G.t; dm.coughGap = rnd(2.2, 5) * clamp(1.6 - dm.hemo / 900, 0.5, 1.4);
      G.emit('voice', g, 'cough', 0.7);
      const r = hd.def.r * S, w = G.toWorld(hd.body, 0, r * 0.5), fw = G.dirWorld(hd.body, 0, 1), n = clamp(Math.round(4 + dm.hemo / 110), 4, 18);
      for (let i = 0; i < n; i++) add(w.x, w.y, fw.x * rnd(0.6, 2.6) + rnd(-1.4, 1.4) + hd.body.velocity.x, fw.y * rnd(0.4, 2) + rnd(-1.6, 0) + hd.body.velocity.y, rnd(0.7, 1.5), rnd(90, 150), 0.8, g, i % 3 === 0 ? rnd(4, 9) : 0);
      dm.mouthBlood = Math.min(1, (dm.mouthBlood || 0) + 0.25);
      if (G.flesh) G.flesh.soak(hd, rnd(-1, 1) * S, r * 0.62, 3.5 * S);
    }
    /* breathing that's going wrong: short, fast, loud */
    if (dm.cons > 0.3 && (dm.breath < 0.6 || dm.oxy < 0.55) && G.t - (dm.gaspT || -9) > rnd(1.6, 3)) { dm.gaspT = G.t; G.emit('voice', g, 'pant', 0.45); }
  }
};
/* a run of blood down from the open place on the skin, while it bleeds */
function markOpening(p, lx, ly, q) {
  const t = p.tex; if (!t) return;
  for (const o of t.openings) if (Math.hypot(o.x - lx, o.y - ly) < Math.max(3 * S, o.r + 2)) { o.bleed = Math.max(o.bleed, clamp(q / 2.5, 0.12, 1.6)); if (G.t - o.t < 1) o.t -= 1; return; }
}
/* a pressed wound: the floor under it or the wall behind it takes the blood */
BLD.pressed = function (v, ml) {
  const c = v.press; if (!c || !G.blood) return;
  v.pacc = (v.pacc || 0) + ml;
  if (v.pacc < 1) return;
  const m = v.pacc; v.pacc = 0;
  const w = G.walls(), floor = c.other === w.ground;
  if (floor) G.blood.toPool(c.pt.x + rnd(-2, 2), m);
  else if (c.other.plugin && c.other.plugin.part) { if (G.flesh) G.flesh.splash(c.other.plugin.part, c.pt.x, c.pt.y, rnd(2, 3.5) * S); return; }
  if (Math.random() < 0.5) G.blood.stamp(c.pt.x + rnd(-2, 2), floor ? G.floorY() + rnd(-2, 3) : c.pt.y + rnd(-2, 2), rnd(1.5, 3) * S / 1.9, rnd(-0.5, 0.5), rnd(-0.2, 0.2), null, 0.55, floor);
};

/* ------------------------------------------------------------ for the panel and the tests */
BLD.summary = function (g) {
  const L = list(g); let art = 0, ext = 0, int = 0, n = 0;
  for (const v of L) { const q = v.q || 0; if (q < 0.01) continue; n++; if (v.int) int += q; else if (v.kind !== 'drain') { ext += q; if (v.kind === 'art' || v.kind === 'stump') art += q; } }
  return { art, ext, int, n, hemo: g.dm ? g.dm.hemo || 0 : 0 };
};
BLD.list = list;
BLD.VESSEL = VESSEL; BLD.VEINS = VEINS; BLD.STUMP = STUMP;
})();
