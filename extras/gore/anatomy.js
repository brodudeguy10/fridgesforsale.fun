/* ============================================================
   THE GUY, version three: anatomy.
   his skeleton, his joints and how far they bend, the regions his
   damage is kept in, what each tissue can take, where his arteries
   run, what he wears, and the shapes of his bones and organs (the
   flesh and the x-ray both draw from these).

   units are the guy's own: 103 of them from his soles to the top of
   his head, y down, x across, the origin on the floor between his
   feet. he faces you, so his left is on your right (x > 0), the way
   a radiograph is read.
============================================================ */
(function () {
'use strict';
const G = window.__G3; if (!G) return;
const A = G.A = {};

/* parts: id, kind, side (+1 your right = his left), box [w,h] or radius, rest centre, mass share
   (Winter's segment tables), draw layer (0 behind the trunk, 1 the trunk, 2 in front) */
A.PARTS = [
  { id: 'head', kind: 'head', side: 0, r: 10, at: [0, -94], mass: 0.081, layer: 1, name: 'head' },
  { id: 'chest', kind: 'chest', side: 0, wh: [16, 15], at: [0, -73.5], mass: 0.216, layer: 1, name: 'chest' },
  { id: 'abdomen', kind: 'abdomen', side: 0, wh: [14, 9], at: [0, -62], mass: 0.139, layer: 1, name: 'abdomen' },
  { id: 'pelvis', kind: 'pelvis', side: 0, wh: [16, 11], at: [0, -52.5], mass: 0.142, layer: 1, name: 'pelvis' }
];
for (const s of [1, -1]) {
  const L = s > 0 ? 'L' : 'R', lay = s > 0 ? 0 : 2, side = s > 0 ? 'left' : 'right';
  A.PARTS.push(
    { id: 'uarm' + L, kind: 'uarm', side: s, wh: [6, 18], at: [10 * s, -71], mass: 0.028, layer: lay, name: side + ' upper arm' },
    { id: 'larm' + L, kind: 'larm', side: s, wh: [5, 15], at: [10.5 * s, -55], mass: 0.016, layer: lay, name: side + ' forearm' },
    { id: 'hand' + L, kind: 'hand', side: s, wh: [5.5, 7], at: [10.7 * s, -44], mass: 0.006, layer: lay, name: side + ' hand' },
    { id: 'uleg' + L, kind: 'uleg', side: s, wh: [7, 22], at: [4.2 * s, -37], mass: 0.100, layer: lay, name: side + ' thigh' },
    { id: 'lleg' + L, kind: 'lleg', side: s, wh: [6, 21], at: [4.2 * s, -15.5], mass: 0.0465, layer: lay, name: side + ' lower leg' },
    { id: 'foot' + L, kind: 'foot', side: s, wh: [8, 5], at: [4.7 * s, -2.5], mass: 0.0145, layer: lay, name: side + ' foot' }
  );
}
A.byId = {}; for (const p of A.PARTS) A.byId[p.id] = p;
A.LIMB = new Set(['uarm', 'larm', 'hand', 'uleg', 'lleg', 'foot']);
A.LONG = new Set(['uarm', 'larm', 'uleg', 'lleg']);
A.ARM = new Set(['uarm', 'larm', 'hand']);
A.LEG = new Set(['uleg', 'lleg', 'foot']);
A.TRUNK = new Set(['chest', 'abdomen', 'pelvis']);

/* joints: parent, child, pivot (world rest units), the range of the child relative to the parent
   (for limbs in "outward" terms: + swings the far end away from his midline), how hard the muscles
   can pull (a share of his weight times his height), how much it takes to tear it out, how hard
   the stump spurts. the root of him is the chest: whatever is still joined to it is still him */
A.JOINTS = [
  { id: 'neck', a: 'chest', b: 'head', at: [0, -82.5], lim: [-0.6, 0.6], cap: 0.07, hp: 46, art: 1.8, name: 'neck' },
  { id: 'spine', a: 'chest', b: 'abdomen', at: [0, -66.25], lim: [-0.32, 0.32], cap: 0.22, hp: 70, art: 1.1, name: 'lower back' },
  { id: 'waist', a: 'abdomen', b: 'pelvis', at: [0, -57.75], lim: [-0.32, 0.32], cap: 0.24, hp: 62, art: 1.4, name: 'waist' }
];
for (const s of [1, -1]) {
  const L = s > 0 ? 'L' : 'R', side = s > 0 ? 'left' : 'right';
  A.JOINTS.push(
    { id: 'shoulder' + L, a: 'chest', b: 'uarm' + L, at: [9 * s, -79], abd: [-0.5, 3.0], cap: 0.06, hp: 34, art: 1.0, name: side + ' shoulder' },
    { id: 'elbow' + L, a: 'uarm' + L, b: 'larm' + L, at: [10.3 * s, -62.3], abd: [-2.5, 1.6], cap: 0.04, hp: 26, art: 0.6, name: side + ' elbow' },
    { id: 'wrist' + L, a: 'larm' + L, b: 'hand' + L, at: [10.6 * s, -47.6], abd: [-1.0, 1.0], cap: 0.012, hp: 18, art: 0.45, name: side + ' wrist' },
    { id: 'hip' + L, a: 'pelvis', b: 'uleg' + L, at: [4.2 * s, -48], abd: [-0.45, 1.45], cap: 0.26, hp: 40, art: 1.25, name: side + ' hip' },
    { id: 'knee' + L, a: 'uleg' + L, b: 'lleg' + L, at: [4.2 * s, -26], abd: [-1.75, 0.5], cap: 0.22, hp: 30, art: 0.6, name: side + ' knee' },
    { id: 'ankle' + L, a: 'lleg' + L, b: 'foot' + L, at: [4.3 * s, -5], abd: [-0.7, 0.7], cap: 0.12, hp: 22, art: 0.35, name: side + ' ankle' }
  );
}
/* the relative-angle range of a joint, with the outward convention turned into screen rotation */
for (const j of A.JOINTS) {
  const s = A.byId[j.b].side;
  if (j.abd) j.lim = s > 0 ? [-j.abd[1], -j.abd[0]] : [j.abd[0], j.abd[1]];
  j.side = s;
}
A.jointById = {}; for (const j of A.JOINTS) A.jointById[j.id] = j;
/* version two's names for the parts, for anyone still typing them into the console */
A.V2 = { uarmR: 'uarmL', larmR: 'larmL', ulegR: 'ulegL', llegR: 'llegL', uarmL: 'uarmR', larmL: 'larmR', ulegL: 'ulegR', llegL: 'llegR',
  shoulderR: 'shoulderL', shoulderL: 'shoulderR', elbowR: 'elbowL', elbowL: 'elbowR', hipR: 'hipL', hipL: 'hipR', kneeR: 'kneeL', kneeL: 'kneeR' };

/* ------------------------------------------------------------ regions
   where damage is kept. a hit on a part lands in one of these by where on the part it was */
A.REGIONS = [
  /* id, name, the part, ISS body region, tissue thresholds in joules for a broad hit (concentrated hits need less),
     soft = padding that soaks a hit, the bone, the organ, what bleeds if it opens */
  { id: 'cranium', name: 'cranium', part: 'head', iss: 'head', bruise: 3, lac: 14, frac: 62, organ: 70, soft: 0.25, bone: 'skull', org: 'brain' },
  { id: 'face', name: 'face', part: 'head', iss: 'face', bruise: 2, lac: 9, frac: 26, organ: 40, soft: 0.3, bone: 'facial bones', org: 'eyes' },
  { id: 'neck', name: 'neck', part: 'chest', iss: 'head', bruise: 3, lac: 16, frac: 60, organ: 26, soft: 0.35, bone: 'cervical spine', org: 'spinal cord', artery: 3.2 },
  { id: 'thorax', name: 'chest', part: 'chest', iss: 'chest', bruise: 5, lac: 30, frac: 150, organ: 260, soft: 0.5, bone: 'ribs', org: 'heart and lungs' },
  { id: 'abdomen', name: 'abdomen', part: 'abdomen', iss: 'abdomen', bruise: 5, lac: 34, frac: 260, organ: 100, soft: 0.65, bone: 'lumbar spine', org: 'liver, spleen and bowel' },
  { id: 'pelvis', name: 'pelvis', part: 'pelvis', iss: 'extremities', bruise: 6, lac: 34, frac: 230, organ: 140, soft: 0.6, bone: 'pelvis', org: 'bladder', artery: 2.4 }
];
for (const s of [1, -1]) {
  const L = s > 0 ? 'L' : 'R', side = s > 0 ? 'left' : 'right';
  A.REGIONS.push(
    { id: 'uarm' + L, name: side + ' upper arm', part: 'uarm' + L, iss: 'extremities', bruise: 3, lac: 22, frac: 115, soft: 0.55, bone: 'humerus', artery: 1.3 },
    { id: 'larm' + L, name: side + ' forearm', part: 'larm' + L, iss: 'extremities', bruise: 2.5, lac: 16, frac: 62, soft: 0.4, bone: 'radius and ulna', artery: 1.0 },
    { id: 'hand' + L, name: side + ' hand', part: 'hand' + L, iss: 'extremities', bruise: 1.5, lac: 9, frac: 45, soft: 0.25, bone: 'hand bones' },
    { id: 'uleg' + L, name: side + ' thigh', part: 'uleg' + L, iss: 'extremities', bruise: 6, lac: 30, frac: 310, soft: 0.7, bone: 'femur', artery: 2.6 },
    { id: 'lleg' + L, name: side + ' lower leg', part: 'lleg' + L, iss: 'extremities', bruise: 3, lac: 14, frac: 145, soft: 0.35, bone: 'tibia and fibula', artery: 0.8 },
    { id: 'foot' + L, name: side + ' foot', part: 'foot' + L, iss: 'extremities', bruise: 2.5, lac: 14, frac: 85, soft: 0.3, bone: 'foot bones' }
  );
}
A.regionById = {}; for (const r of A.REGIONS) A.regionById[r.id] = r;
/* which region a point on a part belongs to (local rest units) */
A.regionAt = (partId, lx, ly) => {
  if (partId === 'head') return ly > 2.5 && Math.atan2(Math.abs(lx), ly) < 0.95 ? 'face' : 'cranium';
  if (partId === 'chest') return ly < -5.2 && Math.abs(lx) < 5.5 ? 'neck' : 'thorax';
  return partId;   /* every other part is one region of its own */
};
/* the arteries, as places a blade or a bullet can open: part, local centre, radius, how bad */
A.ARTERIES = [
  { part: 'chest', x: -2.5, y: -6.6, r: 2.4, rate: 3.2, name: 'right carotid artery' },
  { part: 'chest', x: 2.5, y: -6.6, r: 2.4, rate: 3.2, name: 'left carotid artery' },
  { part: 'head', x: 0, y: 8.6, r: 3.0, rate: 2.6, name: 'jugular vein' },
  { part: 'chest', x: 1.6, y: 1.2, r: 3.2, rate: 6.0, name: 'heart' },
  { part: 'abdomen', x: 0, y: 0, r: 2.2, rate: 4.0, name: 'abdominal aorta' },
  { part: 'pelvis', x: -5.2, y: 3.4, r: 2.4, rate: 2.6, name: 'right femoral artery' },
  { part: 'pelvis', x: 5.2, y: 3.4, r: 2.4, rate: 2.6, name: 'left femoral artery' }
];
for (const s of [1, -1]) {
  const L = s > 0 ? 'L' : 'R', side = s > 0 ? 'left' : 'right';
  A.ARTERIES.push(
    { part: 'uleg' + L, x: -2.0 * s, y: -6, r: 2.2, rate: 2.4, name: side + ' femoral artery' },
    { part: 'uarm' + L, x: -1.8 * s, y: 3, r: 1.6, rate: 1.2, name: side + ' brachial artery' },
    { part: 'larm' + L, x: -1.0 * s, y: 5.5, r: 1.3, rate: 0.8, name: side + ' radial artery' }
  );
}
A.arteryAt = (partId, lx, ly, reach = 0) => {
  let best = null, bd = 1e9;
  for (const a of A.ARTERIES) { if (a.part !== partId) continue; const d = Math.hypot(lx - a.x, ly - a.y) - a.r - reach; if (d < 0 && d < bd) { bd = d; best = a; } }
  return best;
};

/* ------------------------------------------------------------ what he wears */
A.CLOTH = { head: null, chest: 'shirt', abdomen: 'shirt', pelvis: 'pants', uarm: 'shirt', larm: null, hand: null, uleg: 'pants', lleg: 'pants', foot: 'boot' };
/* the boot shaft comes up the lower leg this far (a share of the shin, from the bottom) */
A.BOOT = 0.42;

/* ------------------------------------------------------------ shapes, in a part's own frame (units)
   the outline of each part. limbs taper; the flesh draws inside these and the physics boxes sit under them */
A.outline = (ctx, d, S) => {
  ctx.beginPath();
  if (d.r) { ctx.arc(0, 0, d.r * S, 0, Math.PI * 2); return; }
  const w = d.wh[0] * S, h = d.wh[1] * S, k = d.kind;
  const top = { chest: 0.98, abdomen: 0.92, pelvis: 0.96, uarm: 1.0, larm: 1.0, hand: 0.9, uleg: 1.0, lleg: 0.98, foot: 0.8 }[k] || 1;
  const bot = { chest: 0.9, abdomen: 0.94, pelvis: 1.0, uarm: 0.82, larm: 0.72, hand: 0.8, uleg: 0.78, lleg: 0.7, foot: 1.0 }[k] || 1;
  const r = Math.min(w, h) * (k === 'foot' ? 0.42 : k === 'hand' ? 0.48 : 0.45);
  const tw = w * top / 2, bw = w * bot / 2, y0 = -h / 2, y1 = h / 2;
  ctx.moveTo(-tw + r * 0.6, y0); ctx.lineTo(tw - r * 0.6, y0); ctx.quadraticCurveTo(tw, y0, tw, y0 + r * 0.6);
  ctx.lineTo(bw, y1 - r * 0.6); ctx.quadraticCurveTo(bw, y1, bw - r * 0.6, y1);
  ctx.lineTo(-bw + r * 0.6, y1); ctx.quadraticCurveTo(-bw, y1, -bw, y1 - r * 0.6);
  ctx.lineTo(-tw, y0 + r * 0.6); ctx.quadraticCurveTo(-tw, y0, -tw + r * 0.6, y0); ctx.closePath();
};
/* the bones inside each part, as filled shapes (units * S) */
A.bone = (ctx, d, S, opt = {}) => {
  const k = d.kind, s = d.side || 1, u = S;
  ctx.beginPath();
  const shaft = (x0, y0, x1, y1, w0, w1, knob0, knob1) => {
    const a = Math.atan2(y1 - y0, x1 - x0), nx = -Math.sin(a), ny = Math.cos(a);
    ctx.moveTo(x0 + nx * w0 * u, y0 + ny * w0 * u); ctx.lineTo(x1 + nx * w1 * u, y1 + ny * w1 * u); ctx.lineTo(x1 - nx * w1 * u, y1 - ny * w1 * u); ctx.lineTo(x0 - nx * w0 * u, y0 - ny * w0 * u); ctx.closePath();
    if (knob0) { ctx.moveTo(x0 + knob0 * u, y0); ctx.arc(x0, y0, knob0 * u, 0, Math.PI * 2); }
    if (knob1) { ctx.moveTo(x1 + knob1 * u, y1); ctx.arc(x1, y1, knob1 * u, 0, Math.PI * 2); }
  };
  if (k === 'head') {
    const r = d.r * u;
    ctx.arc(0, -r * 0.08, r * 0.86, Math.PI * 0.88, Math.PI * 2.12);    /* the vault */
    ctx.lineTo(r * 0.55, r * 0.5); ctx.quadraticCurveTo(0, r * 0.95, -r * 0.55, r * 0.5); ctx.closePath();
    if (opt.holes !== false) { /* orbits and nose, cut out */
      ctx.moveTo(-r * 0.12, -r * 0.15); ctx.arc(-r * 0.35, -r * 0.15, r * 0.23, 0, Math.PI * 2, true);
      ctx.moveTo(r * 0.58, -r * 0.15); ctx.arc(r * 0.35, -r * 0.15, r * 0.23, 0, Math.PI * 2, true);
      ctx.moveTo(0, r * 0.08); ctx.lineTo(r * 0.09, r * 0.3); ctx.lineTo(-r * 0.09, r * 0.3); ctx.closePath();
    }
  } else if (k === 'chest') {
    const w = d.wh[0] * u, h = d.wh[1] * u;
    ctx.rect(-0.9 * u, -h / 2 + 1 * u, 1.8 * u, h - 1 * u);                                 /* spine + sternum, seen through */
    for (let i = 0; i < 6; i++) { const y = -h / 2 + (2.6 + i * 1.95) * u, ww = w * (0.4 + Math.min(i, 3) * 0.02); ctx.moveTo(-ww, y - 0.55 * u); ctx.quadraticCurveTo(0, y + 1.3 * u, ww, y - 0.55 * u); ctx.lineTo(ww, y + 0.35 * u); ctx.quadraticCurveTo(0, y + 2.2 * u, -ww, y + 0.35 * u); ctx.closePath(); }
    ctx.moveTo(-0.9 * u, -h / 2 + 1.2 * u); ctx.lineTo(-w * 0.5, -h / 2 + 0.6 * u); ctx.lineTo(-w * 0.5, -h / 2 + 1.5 * u); ctx.lineTo(-0.9 * u, -h / 2 + 2 * u); ctx.closePath();   /* clavicles */
    ctx.moveTo(0.9 * u, -h / 2 + 1.2 * u); ctx.lineTo(w * 0.5, -h / 2 + 0.6 * u); ctx.lineTo(w * 0.5, -h / 2 + 1.5 * u); ctx.lineTo(0.9 * u, -h / 2 + 2 * u); ctx.closePath();
  } else if (k === 'abdomen') {
    const h = d.wh[1] * u; for (let i = 0; i < 3; i++) { const y = -h / 2 + (0.6 + i * 2.9) * u; ctx.rect(-1.6 * u, y, 3.2 * u, 2.3 * u); }
  } else if (k === 'pelvis') {
    const w = d.wh[0] * u, h = d.wh[1] * u;
    ctx.moveTo(-1.4 * u, -h / 2); ctx.lineTo(1.4 * u, -h / 2); ctx.lineTo(1.1 * u, h * 0.15); ctx.lineTo(-1.1 * u, h * 0.15); ctx.closePath();       /* sacrum */
    for (const sx of [-1, 1]) { ctx.moveTo(sx * 1.4 * u, -h / 2 + 0.5 * u); ctx.quadraticCurveTo(sx * w * 0.55, -h / 2 - 0.5 * u, sx * w * 0.47, h * 0.05); ctx.quadraticCurveTo(sx * w * 0.36, h * 0.38, sx * 4.2 * u, h * 0.42); ctx.lineTo(sx * 1.2 * u, h * 0.36); ctx.quadraticCurveTo(sx * 2.4 * u, h * 0.05, sx * 1.4 * u, -h / 2 + 0.5 * u); ctx.closePath(); }
  } else if (k === 'uarm') { const h = d.wh[1] * u / 2; shaft(0, -h + 1.8 * u, 0, h - 1.2 * u, 0.95, 0.85, 1.75, 1.3); }
  else if (k === 'larm') { const h = d.wh[1] * u / 2; shaft(-0.8 * u, -h + 0.9 * u, -0.7 * u, h - 0.9 * u, 0.5, 0.55, 0.9, 0); shaft(0.8 * u, -h + 0.9 * u, 0.9 * u, h - 0.9 * u, 0.45, 0.65, 0, 0.9); }
  else if (k === 'hand') { const h = d.wh[1] * u / 2; ctx.rect(-1.9 * u, -h + 0.5 * u, 3.8 * u, 2.4 * u); for (let i = 0; i < 4; i++) ctx.rect((-1.8 + i * 1.05) * u, -h + 3.1 * u, 0.62 * u, 3.4 * u); ctx.rect(-s * 2.6 * u, -h + 1.4 * u, 0.7 * u, 2.6 * u); }
  else if (k === 'uleg') { const h = d.wh[1] * u / 2; shaft(0.4 * (d.side || 1) * u, -h + 2 * u, 0, h - 1.4 * u, 1.15, 1.0, 2.0, 1.55); }
  else if (k === 'lleg') { const h = d.wh[1] * u / 2; shaft(-0.5 * (d.side || 1) * u, -h + 1.2 * u, -0.4 * (d.side || 1) * u, h - 0.9 * u, 1.05, 0.75, 1.45, 1.0); shaft(1.6 * (d.side || 1) * u, -h + 1.6 * u, 1.6 * (d.side || 1) * u, h - 1.2 * u, 0.35, 0.35, 0, 0.6); }
  else if (k === 'foot') { const w = d.wh[0] * u, h = d.wh[1] * u; ctx.rect(-w * 0.32, -h / 2 + 0.3 * u, w * 0.64, h * 0.5); for (let i = 0; i < 4; i++) ctx.rect(-w * 0.36 + i * w * 0.19, h * 0.1, w * 0.12, h * 0.32); }
};
/* organs: part kind -> list of { id, name, draw(ctx, S) } in the part's frame */
A.ORGANS = {
  head: [{ id: 'brain', name: 'brain', draw(c, u) { c.beginPath(); c.ellipse(0, -2.8 * u, 7.4 * u, 5.4 * u, 0, 0, Math.PI * 2); } }],
  chest: [
    { id: 'lungR', name: 'right lung', draw(c, u) { c.beginPath(); c.ellipse(-3.8 * u, -0.4 * u, 3.4 * u, 5.4 * u, 0.08, 0, Math.PI * 2); } },
    { id: 'lungL', name: 'left lung', draw(c, u) { c.beginPath(); c.ellipse(3.9 * u, -0.2 * u, 3.1 * u, 5.2 * u, -0.08, 0, Math.PI * 2); } },
    { id: 'heart', name: 'heart', draw(c, u) { c.beginPath(); c.moveTo(1.2 * u, 4.6 * u); c.bezierCurveTo(-2.6 * u, 2.2 * u, -1.6 * u, -1.4 * u, 0.6 * u, -0.3 * u); c.bezierCurveTo(2.6 * u, -1.6 * u, 4.4 * u, 1.6 * u, 1.2 * u, 4.6 * u); c.closePath(); } }
  ],
  abdomen: [
    { id: 'liver', name: 'liver', draw(c, u) { c.beginPath(); c.moveTo(-6.2 * u, -3.6 * u); c.quadraticCurveTo(0, -4.6 * u, 1.6 * u, -3.0 * u); c.quadraticCurveTo(-1 * u, -0.4 * u, -6 * u, 0.6 * u); c.closePath(); } },
    { id: 'stomach', name: 'stomach', draw(c, u) { c.beginPath(); c.ellipse(3.4 * u, -1.6 * u, 2.6 * u, 2.0 * u, 0.4, 0, Math.PI * 2); } },
    { id: 'bowel', name: 'bowel', draw(c, u) { c.beginPath(); for (let i = 0; i < 6; i++) { const x = (-4.5 + (i % 3) * 4.5) * u, y = (0.8 + Math.floor(i / 3) * 2.2) * u; c.moveTo(x + 1.9 * u, y); c.arc(x, y, 1.9 * u, 0, Math.PI * 2); } } }
  ],
  pelvis: [{ id: 'bladder', name: 'bladder', draw(c, u) { c.beginPath(); c.ellipse(0, 1.2 * u, 2.6 * u, 2.0 * u, 0, 0, Math.PI * 2); } }]
};
/* skin tones, shirts, trousers, boots */
A.PANTS = ['#2a3a5a', '#3a3328', '#2b2b2e', '#4a3a2a', '#24324a', '#33402a'];
A.BOOTS = ['#3a2414', '#2a1a10', '#4a2e18', '#1c1c1e'];
A.NAMES = ['Frank', 'Blurst', 'Theodore', 'Rustbucket', 'Gregory', 'Mortimer', 'Bartholomew', 'Cletus', 'Jebediah', 'Hank', 'Lenny', 'Stumpy', 'Wyatt', 'Ezekiel', 'Hollis', 'Amos', 'Boone', 'Virgil', 'Earl', 'Doc'];
})();
