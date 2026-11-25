/* ============================================================
   THE GUY, version three: flesh.
   every part of him carries its own stack of layers, in its own
   frame, so a wound stays exactly where it happened however he's
   turned:

       clothes   shirt, trousers, boots
       skin      his own colour, paler as he empties
       fat       yellow, thin
       muscle    red, with grain along the limb
       bone      under all of it, the same shapes the x-ray uses

   a wound is a shape cut out of some of those layers: a knife
   slits each layer a little narrower than the one above it, a
   corner splits the skin in a ragged star, a bullet punches through
   all of them, a slide along the floor sands the cloth away first
   and the skin after. the next wound in the same place starts from
   whatever the last one left, so damage builds instead of being
   stamped on fresh. on top go bruises that darken and turn as they
   age, soot, dirt, and the blood that soaks into his clothes.
============================================================ */
(function () {
'use strict';
const G = window.__G3; if (!G || !G.A) return;
const A = G.A, S = G.S, clamp = G.clamp;
const F = G.flesh = {};
const PAD = 3;
/* the layers can be drawn finer than a screen pixel, for a page that shows him close up (the torture room).
   1 on the fridge page, where nothing changes */
const RES = G.RES || 1;
F.RES = RES;
/* every layer of every part is a small canvas: seven per part, a hundred-odd per guy. on the GPU that many tiny
   canvases thrash (each is its own texture, and copying one into another stalls), so they live in main memory,
   where drawing a 40 px canvas into another one is cheap. only the finished composite goes to the screen */
const CPU = { willReadFrequently: true };
const tmp = document.createElement('canvas'), tctx = tmp.getContext('2d', CPU);
function canvas(w, h) { const c = document.createElement('canvas'); c.width = Math.ceil(w * RES); c.height = Math.ceil(h * RES); c.getContext('2d', CPU); return c; }
function sizeOf(d) { return d.r ? [Math.ceil(d.r * S * 2 + PAD * 2), Math.ceil(d.r * S * 2 + PAD * 2)] : [Math.ceil(d.wh[0] * S + PAD * 2), Math.ceil(d.wh[1] * S + PAD * 2)]; }
const hsl = (a, k = 0) => `hsl(${a[0]},${a[1] * (1 - k * 0.75)}%,${a[2] + (84 - a[2]) * k * 0.45}%)`;

/* the layers a part starts with */
F.init = function (g) {
  for (const p of g.list) {
    const [w, h] = sizeOf(p.def);
    const cloth = A.clothOf(g, p.kind);
    const t = p.tex = { w, h, cx: w / 2, cy: h / 2, cloth, dirty: true, lastPale: -1, bruises: [], openings: [], ends: [], frac: [], soak: [], lastComp: 0, def: p.def, cut: false };
    for (const k of ['mCloth', 'mSkin', 'mFat', 'mMuscle', 'stain', 'comp']) t[k] = canvas(w, h);
    if (p.kind === 'head') t.over = canvas(w, h);
    /* every mask starts whole inside the outline */
    for (const k of ['mSkin', 'mFat', 'mMuscle']) fillShape(t[k], p, '#fff');
    if (cloth) {
      fillShape(t.mCloth, p, '#fff');
      if (p.kind === 'lleg') { /* the boot shaft covers the lower part of the shin: the cloth layer holds both, coloured apart */ }
    }
    p.tex.seed = Math.random();
  }
};
function fillShape(c, p, col) { const x = c.getContext('2d'); x.save(); x.setTransform(RES, 0, 0, RES, c.width / 2, c.height / 2); A.outline(x, p.def, S); x.fillStyle = col; x.fill(); x.restore(); }
function ctxOf(c, p) { const x = c.getContext('2d'); x.setTransform(RES, 0, 0, RES, c.width / 2, c.height / 2); return x; }

/* ------------------------------------------------------------ cutting into the layers */
const LAYERS = ['mCloth', 'mSkin', 'mFat', 'mMuscle'];
/* shape(ctx, scale) draws the opening; scale shrinks it for deeper layers so a wound narrows going in */
function open(p, upto, shape, rim = 1, opts = {}) {
  const t = p.tex; if (!t) return;
  t.cut = true;
  for (let i = 0; i < LAYERS.length && i <= upto; i++) {
    const k = LAYERS[i]; if (k === 'mCloth' && !t.cloth) continue;
    const x = ctxOf(t[k], p); x.save(); x.globalCompositeOperation = 'destination-out'; x.globalAlpha = opts.alpha || 1;
    shape(x, i === 0 ? (opts.clothK || 1.15) : 1 - (i - 1) * (opts.narrow || 0.2)); x.restore();
  }
  /* the edge of a wound is bruised and bloody */
  if (rim > 0 && !p.guy.dusty) { const x = ctxOf(t.stain, p); x.save(); x.globalAlpha = 0.5 * rim; x.fillStyle = '#5a0606'; x.filter = `blur(${RES}px)`; shape(x, 1.35); x.restore(); }
  /* close up (the dummy in the torture room), what's inside is wet with blood, not a clean diagram of layers:
     a dark wash over the opening takes the shine off the fat and the bone */
  if (isDummy(p) && opts.wash !== 0) { const x = ctxOf(t.stain, p); x.save(); x.globalAlpha = opts.wash || 0.42; x.fillStyle = '#3c0303'; shape(x, 0.92); x.restore(); }
  t.dirty = true;
}
function isDummy(p) { const g = p.guy; return !!(g && g.look && g.look.style === 'dummy' && !g.dusty); }
function rand(p, seed) { return G.srand(seed + (p.tex ? p.tex.seed : 0)); }
/* a ragged tear: a star with uneven points */
function tearShape(lx, ly, ang, len, wid, seed) {
  return (x, k) => { const R = G.srand(seed); x.save(); x.translate(lx, ly); x.rotate(ang); x.beginPath(); const n = 9;
    for (let i = 0; i <= n; i++) { const u = i / n, px = (u - 0.5) * len * k, py = -wid * k * (0.35 + R() * 0.9) * Math.sin(Math.PI * u) - R() * 0.6; i ? x.lineTo(px, py) : x.moveTo(px, py); }
    for (let i = n; i >= 0; i--) { const u = i / n, px = (u - 0.5) * len * k, py = wid * k * (0.35 + R() * 0.9) * Math.sin(Math.PI * u) + R() * 0.6; x.lineTo(px, py); }
    x.closePath(); x.fillStyle = '#000'; x.fill(); x.restore(); };
}
function blobShape(lx, ly, r, seed) {
  return (x, k) => { const R = G.srand(seed); x.beginPath(); const n = 11; for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2, rr = r * k * (0.65 + R() * 0.6); const px = lx + Math.cos(a) * rr, py = ly + Math.sin(a) * rr; i ? x.lineTo(px, py) : x.moveTo(px, py); } x.closePath(); x.fillStyle = '#000'; x.fill(); };
}
function slitShape(x1, y1, x2, y2, w) {
  return (x, k) => { x.beginPath(); x.lineCap = 'round'; x.lineWidth = Math.max(0.6, w * k); x.strokeStyle = '#000'; x.moveTo(x1, y1); x.lineTo(x2, y2); x.stroke(); };
}

/* ------------------------------------------------------------ the damage events, drawn */
G.on('wound', (g, p, w) => {
  if (!p.tex) return;
  const seed = Math.random(), ang = Math.atan2(w.dir ? G.dirLocal(p.body, w.dir.x, w.dir.y).y : 0, w.dir ? G.dirLocal(p.body, w.dir.x, w.dir.y).x : 1);
  const cmPx = 1 / (G.mpp * 100);                                   /* px per cm */
  const t = p.tex;
  switch (w.type) {
    case 'split': {       /* a broad hit splits the skin in a ragged star, over the bone it ran into */
      const len = clamp(w.size * cmPx, 3, 18 * S), wid = len * 0.28;
      open(p, w.depth >= 2 ? 2 : 1, tearShape(w.lx, w.ly, ang + Math.PI / 2 + G.rnd(-0.6, 0.6), len, wid, seed), 1, { narrow: 0.3 });
      t.openings.push({ x: w.lx, y: w.ly, r: len / 2, bleed: 1, t: G.t, kind: 'lac' });
      break;
    }
    case 'tear': {        /* an edge: a long ragged gash */
      const len = clamp(w.size * cmPx * 1.2, 4, 22 * S), wid = len * 0.18;
      open(p, w.depth >= 2 ? 3 : 2, tearShape(w.lx, w.ly, ang + Math.PI / 2, len, wid, seed), 1, { narrow: 0.25 });
      t.openings.push({ x: w.lx, y: w.ly, r: len / 2, bleed: 1.2, t: G.t, kind: 'lac' });
      break;
    }
    case 'pulp': {        /* the muscle under a bruise gives way: the skin over it goes, the meat shows */
      open(p, 2, blobShape(w.lx, w.ly, w.size * S * 0.8, seed), 1.2, { narrow: 0.12 });
      const x = ctxOf(t.stain, p); x.save(); x.globalAlpha = 0.35; x.fillStyle = '#3a0000'; blobShape(w.lx, w.ly, w.size * S, seed)(x, 1); x.restore();
      t.openings.push({ x: w.lx, y: w.ly, r: w.size * S * 0.8, bleed: 0.8, t: G.t, kind: 'pulp' });
      break;
    }
    case 'cut': {         /* a knife: each layer slit a little narrower than the last, deeper each pass */
      const x2 = w.x2 != null ? w.x2 : w.lx + Math.cos(ang) * w.size * cmPx, y2 = w.y2 != null ? w.y2 : w.ly + Math.sin(ang) * w.size * cmPx;
      const wd = (0.7 + w.depth * (isDummy(p) ? 0.72 : 0.55)) * S * 0.7 * (w.thin || 1);
      open(p, Math.min(3, w.depth), slitShape(w.lx, w.ly, x2, y2, wd), 0.6, { narrow: 0.22, clothK: 1.3 });
      t.openings.push({ x: (w.lx + x2) / 2, y: (w.ly + y2) / 2, r: Math.hypot(x2 - w.lx, y2 - w.ly) / 2, bleed: 0.6 + w.depth * 0.3, t: G.t, kind: 'cut', x1: w.lx, y1: w.ly, x2, y2, depth: w.depth });
      break;
    }
    case 'slice': {       /* a razor: a strip of skin taken off along the stroke, the fat under it showing, more each pass */
      const x2 = w.x2 != null ? w.x2 : w.lx + Math.cos(ang) * w.size * cmPx, y2 = w.y2 != null ? w.y2 : w.ly + Math.sin(ang) * w.size * cmPx;
      const wd = (1.1 + w.depth * 0.7) * S * 0.75;
      open(p, Math.min(2, w.depth), slitShape(w.lx, w.ly, x2, y2, wd), 0.35, { narrow: 0.55, clothK: 1.2 });
      t.openings.push({ x: (w.lx + x2) / 2, y: (w.ly + y2) / 2, r: Math.hypot(x2 - w.lx, y2 - w.ly) / 2, bleed: 0.35 + w.depth * 0.2, t: G.t, kind: 'cut', x1: w.lx, y1: w.ly, x2, y2, depth: w.depth });
      break;
    }
    case 'saw': {         /* a chainsaw: the chain tears the meat out in a ragged trench, wider at the top */
      const x2 = w.x2 != null ? w.x2 : w.lx + Math.cos(ang) * w.size * cmPx, y2 = w.y2 != null ? w.y2 : w.ly + Math.sin(ang) * w.size * cmPx;
      const len = Math.max(3 * S, Math.hypot(x2 - w.lx, y2 - w.ly)), a2 = Math.atan2(y2 - w.ly, x2 - w.lx);
      open(p, Math.min(3, w.depth), tearShape((w.lx + x2) / 2, (w.ly + y2) / 2, a2, len * 1.15, (1.2 + w.depth * 0.6) * S, seed), 1.3, { narrow: 0.12, clothK: 1.35 });
      const x = ctxOf(t.stain, p); x.save(); x.globalAlpha = 0.5; x.fillStyle = '#3a0303'; tearShape((w.lx + x2) / 2, (w.ly + y2) / 2, a2, len * 1.5, (2 + w.depth * 0.8) * S, seed + 1)(x, 1); x.restore();
      t.openings.push({ x: (w.lx + x2) / 2, y: (w.ly + y2) / 2, r: len / 2, bleed: 1 + w.depth * 0.35, t: G.t, kind: 'lac', x1: w.lx, y1: w.ly, x2, y2, depth: w.depth });
      break;
    }
    case 'hole': {        /* a bullet: a small hole through everything, a dark collar round it, burnt powder speckled round that */
      const r = 1.25 * S * (w.k || 1);
      open(p, 3, (x, k) => { x.beginPath(); x.arc(w.lx, w.ly, r * (k > 1 ? 1.5 : 1), 0, Math.PI * 2); x.fill(); }, 0, { wash: 0 });
      const x = ctxOf(t.stain, p); x.save();
      if (isDummy(p)) {
        /* close up: you can't see into a bullet hole. it's dark, wet at the rim, in a reddish-brown ring of scraped skin */
        const gr = x.createRadialGradient(w.lx - r * 0.2, w.ly - r * 0.25, 0, w.lx, w.ly, r * 1.05); gr.addColorStop(0, '#0c0101'); gr.addColorStop(0.7, '#240202'); gr.addColorStop(1, 'rgba(70,6,6,0.9)');
        x.fillStyle = gr; x.beginPath(); x.arc(w.lx, w.ly, r * 1.05, 0, Math.PI * 2); x.fill();
        x.strokeStyle = 'rgba(105,42,30,0.6)'; x.lineWidth = r * 0.5; x.beginPath(); x.arc(w.lx, w.ly, r * 1.3, 0, Math.PI * 2); x.stroke();
        x.fillStyle = 'rgba(255,200,190,0.35)'; x.beginPath(); x.arc(w.lx - r * 0.35, w.ly - r * 0.45, r * 0.18, 0, Math.PI * 2); x.fill();
      } else { x.strokeStyle = 'rgba(40,10,10,0.75)'; x.lineWidth = 0.9; x.beginPath(); x.arc(w.lx, w.ly, r * 1.45, 0, Math.PI * 2); x.stroke(); }
      const R = G.srand(seed); x.fillStyle = 'rgba(20,16,14,0.7)';
      if (w.powder !== false) for (let i = 0; i < 22; i++) { const a = R() * Math.PI * 2, d = r * (1.8 + R() * 3.2); x.fillRect(w.lx + Math.cos(a) * d, w.ly + Math.sin(a) * d, 0.8, 0.8); }
      x.restore();
      t.openings.push({ x: w.lx, y: w.ly, r, bleed: 1.6, t: G.t, kind: 'hole' });
      t.dirty = true;
      break;
    }
    case 'peel': {        /* skin peeled up off what's under it, a strip at a time: the fat shows, and the muscle where it went deep */
      open(p, 2, slitShape(w.x1, w.y1, w.x2, w.y2, w.w || 3 * S), 0.7, { narrow: 0.45, clothK: 1.25 });
      t.openings.push({ x: w.lx, y: w.ly, r: Math.max(w.w || 3 * S, Math.hypot(w.x2 - w.x1, w.y2 - w.y1)) / 2, bleed: 0.5, t: G.t, kind: 'peel' });
      break;
    }
    case 'compound': {
      const side = Math.sign(w.lx || 1);
      t.frac.push({ y: w.ly, side, out: true, seed });
      open(p, 2, blobShape(side * p.def.wh[0] * S * 0.35, w.ly, 2.2 * S, seed), 1.2);
      t.openings.push({ x: side * p.def.wh[0] * S * 0.4, y: w.ly, r: 2 * S, bleed: 1, t: G.t, kind: 'compound' });
      break;
    }
    case 'burn': {
      const x = ctxOf(t.stain, p); x.save();
      const gr = x.createRadialGradient(w.lx, w.ly, 0, w.lx, w.ly, w.size * S);
      gr.addColorStop(0, 'rgba(18,10,6,0.85)'); gr.addColorStop(0.6, 'rgba(40,22,10,0.5)'); gr.addColorStop(1, 'rgba(40,22,10,0)');
      x.fillStyle = gr; x.fillRect(-t.w, -t.h, t.w * 2, t.h * 2); x.restore();
      /* the cloth burns away in holes, the skin blisters and goes */
      const R = G.srand(seed);
      open(p, w.size > 9 ? 1 : 0, (xx, k) => { for (let i = 0; i < 6; i++) { xx.beginPath(); xx.arc((R() - 0.5) * t.w, (R() - 0.5) * t.h, (1 + R() * 3) * S * k, 0, Math.PI * 2); xx.fill(); } }, 0.4, { alpha: 0.9 });
      break;
    }
    case 'shred': {
      const R = G.srand(seed), n = Math.round(w.size);
      for (let i = 0; i < n; i++) { const lx = (R() - 0.5) * t.w * 0.8, ly = (R() - 0.5) * t.h * 0.8; open(p, R() < 0.4 ? 3 : 1, tearShape(lx, ly, R() * 6, (2 + R() * 4) * S, 1.2 * S, R()), 0.8); t.openings.push({ x: lx, y: ly, r: 2 * S, bleed: 0.4, t: G.t, kind: 'lac' }); }
      break;
    }
  }
  if (t.openings.length > 26) t.openings.splice(0, t.openings.length - 26);
});
/* a bruise comes up red and darkens to purple, then blue, then goes green-yellow at the edges */
G.on('bruise', (g, p, b) => { if (!p.tex || g.dusty || !g.alive) return; const t = p.tex; if (t.bruises.length > 14) t.bruises.shift(); t.bruises.push({ x: b.lx, y: b.ly, r: b.size * S, k: clamp(b.E / 25, 0.25, 1), t: G.t, seed: Math.random(), edge: b.area !== 'broad' }); t.dirty = true; });
G.on('fracture', (g, p, f) => {
  if (!p.tex) return; const t = p.tex;
  if (!f.compound && A.LONG.has(p.kind) && f.frac >= 2 && !t.frac.some(q => Math.abs(q.y - f.ly) < 4 * S)) t.frac.push({ y: clamp(f.ly, -p.def.wh[1] * S * 0.36, p.def.wh[1] * S * 0.36), side: Math.sign(f.lx || 1), out: false, seed: Math.random(), bend: G.rnd(-0.35, 0.35) });
  if (p.kind === 'head' && f.frac >= 2) { const x = ctxOf(t.stain, p); x.save(); x.strokeStyle = 'rgba(40,10,10,0.7)'; x.lineWidth = 0.9; const R = G.srand(Math.random()); x.beginPath(); for (let k = 0; k < 4; k++) { let px = f.lx, py = f.ly, a = R() * 6.28; x.moveTo(px, py); for (let i = 0; i < 4; i++) { a += (R() - 0.5) * 1.3; px += Math.cos(a) * 2.6 * S; py += Math.sin(a) * 2.6 * S; x.lineTo(px, py); } } x.stroke(); x.restore(); t.dirty = true; }
});
/* sliding along something: streaks in the slide's direction, cloth first */
G.on('abrade', (g, p, a) => {
  if (!p.tex || !a.pt) return; const t = p.tex;
  if (t.lastAbr && G.t - t.lastAbr < 0.05) return; t.lastAbr = G.t;
  const l = G.toLocal(p.body, a.pt.x, a.pt.y), d = a.dir ? G.dirLocal(p.body, a.dir.x, a.dir.y) : { x: 1, y: 0 }, m = Math.hypot(d.x, d.y) || 1;
  const R = G.srand(Math.random()), k = clamp(a.dose * 260, 0.05, 0.5);
  const reg = g.dm && g.dm.regions[A.regionAt(p.id, 0, 0)], abr = reg ? reg.abr : 0;
  const streaks = (x, kk) => { x.lineCap = 'round'; for (let i = 0; i < 6; i++) { const ox = (R() - 0.5) * 6 * S, oy = (R() - 0.5) * 6 * S, len = (3 + R() * 6) * S; x.lineWidth = (0.5 + R()) * S * 0.6 * kk; x.beginPath(); x.moveTo(l.x + ox, l.y + oy); x.lineTo(l.x + ox - d.x / m * len, l.y + oy - d.y / m * len); x.stroke(); } };
  for (let i = 0; i < 2; i++) {
    const layer = i === 0 ? 'mCloth' : 'mSkin';
    if (layer === 'mCloth' && !t.cloth) continue;
    if (layer === 'mSkin' && t.cloth && abr < 0.3) continue;
    const x = ctxOf(t[layer], p); x.save(); x.globalCompositeOperation = 'destination-out'; x.globalAlpha = k * (layer === 'mSkin' ? 0.6 : 1); x.strokeStyle = '#000'; streaks(x, 1); x.restore();
  }
  if (!g.dusty && (abr > 0.25 || !t.cloth)) { const x = ctxOf(t.stain, p); x.save(); x.globalAlpha = k * 0.5; x.strokeStyle = '#8a1a1a'; streaks(x, 0.8); x.restore(); }
  else { const x = ctxOf(t.stain, p); x.save(); x.globalAlpha = k * 0.35; x.strokeStyle = '#4a4036'; streaks(x, 0.7); x.restore(); }
  t.dirty = true;
});
/* a pin gave: both pieces get an end. a knife leaves it clean, a pull leaves it ragged, a blast leaves it burnt */
G.on('torn', (g, j, out) => {
  for (const [p, side] of [[j.a, 'a'], [j.b, 'b']]) {
    if (!p.tex || p.gone) continue;
    const l0 = side === 'a' ? j.la : j.lb, l = j.section ? { x: 0, y: l0.y } : l0, t = p.tex, why = out.why;
    const seed = Math.random();
    const rag = why === 'cut' ? 0.15 : why === 'blast' ? 0.9 : 0.6;
    /* the end of the part, eaten back a little so it isn't a straight box edge */
    open(p, 3, (x, k) => { const R = G.srand(seed); x.beginPath(); const n = 10, rr = Math.max(p.def.wh ? p.def.wh[0] : p.def.r, 6) * S * 0.62; for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2, r = rr * k * (1 - rag * 0.35 + R() * rag * 0.5); const px = l.x + Math.cos(a) * r, py = l.y + Math.sin(a) * r * 0.55; i ? x.lineTo(px, py) : x.moveTo(px, py); } x.closePath(); x.fill(); }, 1);
    /* a break partway along a bone: the end faces along the limb, toward where the rest of it was */
    t.ends.push({ x: l.x, y: l.y, why, side, t: G.t, seed, joint: j.id, nx: j.section ? 0 : l.x, ny: j.section ? (side === 'a' ? 1 : -1) : l.y });
    if (why === 'blast') { const x = ctxOf(t.stain, p); x.save(); x.globalAlpha = 0.7; x.fillStyle = '#140a06'; x.beginPath(); x.arc(l.x, l.y, 5 * S, 0, Math.PI * 2); x.fill(); x.restore(); }
  }
});
/* a limb that broke in two: the lower piece gets its own copy of every layer, in the same frame, and from now on
   each keeps its own wounds */
F.clone = function (t) {
  const n = Object.assign({}, t);
  for (const k of ['mCloth', 'mSkin', 'mFat', 'mMuscle', 'stain', 'comp', 'over']) { if (!t[k]) continue; const c = document.createElement('canvas'); c.width = t[k].width; c.height = t[k].height; c.getContext('2d', CPU).drawImage(t[k], 0, 0); n[k] = c; }
  for (const k of ['bruises', 'openings', 'ends', 'frac', 'soak']) n[k] = (t[k] || []).map(o => Object.assign({}, o));
  n.dirty = true; return n;
};
G.on('split', (g, p, p2) => { if (p.tex) p2.tex = F.clone(p.tex); });
/* blood that lands on him from anywhere */
F.splash = function (p, wx, wy, r, col) {
  if (!p.tex || p.guy.dusty) return;
  const l = G.toLocal(p.body, wx, wy), t = p.tex; if (Math.abs(l.x) > t.w / 2 || Math.abs(l.y) > t.h / 2) return;
  const x = ctxOf(t.stain, p); x.save(); A.outline(x, p.def, S); x.clip();
  if (isDummy(p)) {
    /* close up, a drop that lands on skin is a spatter, not a dot: smaller, uneven, stretched, a satellite or two */
    const rr = r * G.rnd(0.2, 0.5), a = Math.random() * Math.PI, el = G.rnd(1, 2.4);
    x.globalAlpha = G.rnd(0.35, 0.62); x.fillStyle = col || '#5a0606';
    x.beginPath(); x.ellipse(l.x, l.y, rr * el, rr, a, 0, Math.PI * 2); x.fill();
    for (let i = 0, k = Math.random() < 0.5 ? 1 : 0; i < k; i++) { const d = rr * G.rnd(1.6, 3); x.beginPath(); x.arc(l.x + Math.cos(a) * d, l.y + Math.sin(a) * d, rr * G.rnd(0.2, 0.4), 0, Math.PI * 2); x.fill(); }
  } else { x.globalAlpha = 0.75; x.fillStyle = col || '#6a0808'; x.beginPath(); x.arc(l.x, l.y, r, 0, Math.PI * 2); x.fill(); }
  x.restore();
  t.dirty = true;
};
/* lying in blood, dragged through it: a wet smear on whatever's touching the floor, drawn out along the way it moved */
F.smear = function (p, wx, wy, r, dir) {
  if (!p.tex || p.guy.dusty) return;
  const l = G.toLocal(p.body, wx, wy), t = p.tex; if (Math.abs(l.x) > t.w / 2 + r || Math.abs(l.y) > t.h / 2 + r) return;
  const d = dir ? G.dirLocal(p.body, dir.x, dir.y) : { x: 1, y: 0 }, sp = Math.hypot(d.x, d.y), a = Math.atan2(d.y, d.x);
  const x = ctxOf(t.stain, p); x.save(); A.outline(x, p.def, S); x.clip();
  x.globalAlpha = G.rnd(0.22, 0.42); x.fillStyle = G.pick(['#4a0303', '#5a0505', '#3c0202']);
  x.translate(l.x, l.y); x.rotate(a); x.beginPath(); x.ellipse(-r * 0.3, 0, r * (1 + Math.min(1.5, sp * 0.4)), r * 0.6, 0, 0, Math.PI * 2); x.fill();
  x.restore(); t.dirty = true;
};
/* his clothes soak up what comes out of him */
F.soak = function (p, lx, ly, r) {
  if (!p.tex || p.guy.dusty) return;
  const t = p.tex, x = ctxOf(t.stain, p);
  x.save(); const gr = x.createRadialGradient(lx, ly, 0, lx, ly, r); gr.addColorStop(0, 'rgba(70,4,4,0.32)'); gr.addColorStop(1, 'rgba(70,4,4,0)'); x.fillStyle = gr;
  x.beginPath(); x.arc(lx, ly, r, 0, Math.PI * 2); x.fill(); x.restore(); t.dirty = true;
};
/* scuffs off the floor */
F.dirt = function (p, lx, ly, k) {
  if (!p.tex) return; const x = ctxOf(p.tex.stain, p); x.save(); x.globalAlpha = 0.12 * k; x.fillStyle = '#3a3028'; x.beginPath(); x.arc(lx, ly, 3 * S, 0, Math.PI * 2); x.fill(); x.restore(); p.tex.dirty = true;
};

/* ------------------------------------------------------------ putting the layers together */
const MUSCLE = '#8e1c18', FAT = '#e2c27a', CAVITY = '#2a0303', BONE = '#ece4d2';
function pattern(c, p, kind, g) {
  const x = c; const d = p.def, w = p.tex.w, h = p.tex.h;
  const dm = g.look && g.look.style === 'dummy';
  const dk = F.decay(g);
  if (kind === 'muscle') {
    x.fillStyle = dm ? '#741511' : MUSCLE; x.fillRect(-w, -h, w * 2, h * 2);
    if (dk > 0) { x.fillStyle = `rgba(48,22,14,${(0.6 * dk).toFixed(3)})`; x.fillRect(-w, -h, w * 2, h * 2); }
    x.strokeStyle = 'rgba(190,60,50,0.35)'; x.lineWidth = 0.7; const R = G.srand(p.tex.seed);
    for (let i = 0; i < 9; i++) { const ox = (R() - 0.5) * w; x.beginPath(); x.moveTo(ox, -h); x.quadraticCurveTo(ox + (R() - 0.5) * 4, 0, ox + (R() - 0.5) * 3, h); x.stroke(); }
    x.fillStyle = 'rgba(40,0,0,0.25)'; for (let i = 0; i < 6; i++) { x.beginPath(); x.arc((R() - 0.5) * w, (R() - 0.5) * h, 1 + R() * 2, 0, 6.3); x.fill(); }
  } else if (kind === 'fat') { x.fillStyle = dm ? '#c4a265' : FAT; x.fillRect(-w, -h, w * 2, h * 2); x.fillStyle = dm ? 'rgba(255,230,170,0.22)' : 'rgba(255,240,180,0.4)'; const R = G.srand(p.tex.seed + 1); for (let i = 0; i < 10; i++) { x.beginPath(); x.arc((R() - 0.5) * w, (R() - 0.5) * h, 0.8 + R() * 1.4, 0, 6.3); x.fill(); } if (dk > 0) { x.fillStyle = `rgba(110,84,40,${(0.5 * dk).toFixed(3)})`; x.fillRect(-w, -h, w * 2, h * 2); } }
  else if (kind === 'skin' && g.look.style === 'dummy' && !g.dusty) skinReal(x, p, g, w, h);
  else if (kind === 'skin') { x.fillStyle = F.skinCol(g); x.fillRect(-w, -h, w * 2, h * 2); if (!g.dusty) decayOver(x, p, g, w, h); if (g.dusty && d.wh) { x.strokeStyle = '#c8bca0'; x.lineWidth = 1; for (let y = -h / 2 + 2; y < h / 2; y += 4) { x.beginPath(); x.moveTo(-w / 2, y + Math.sin(y) * 0.8); x.lineTo(w / 2, y - Math.sin(y) * 0.8); x.stroke(); } } }
  else if (kind === 'cloth') {
    const lk = g.look, isBoot = p.kind === 'foot', base = g.dusty ? '#8a7a60' : isBoot ? lk.boots : (p.tex.cloth === 'shirt' ? lk.shirt : lk.pants);
    x.fillStyle = base; x.fillRect(-w, -h, w * 2, h * 2);
    if (!g.dusty) {
      if (p.kind === 'lleg') { x.fillStyle = lk.boots; x.fillRect(-w, h / 2 - PAD - d.wh[1] * S * A.BOOT, w * 2, h); x.fillStyle = 'rgba(0,0,0,0.25)'; x.fillRect(-w, h / 2 - PAD - d.wh[1] * S * A.BOOT, w * 2, 1); }
      /* the weave, a seam, the belt, the collar: the small stuff */
      x.strokeStyle = 'rgba(0,0,0,0.08)'; x.lineWidth = 0.6; for (let y = -h; y < h; y += 2.2) { x.beginPath(); x.moveTo(-w, y); x.lineTo(w, y + 1); x.stroke(); }
      if (p.kind === 'pelvis' && p.tex.cloth === 'briefs') { x.fillStyle = 'rgba(255,255,255,0.10)'; x.fillRect(-w, -h / 2 + PAD, w * 2, 1.6 * S); x.fillStyle = 'rgba(0,0,0,0.25)'; x.fillRect(-w, -h / 2 + PAD + 1.6 * S, w * 2, 0.5); x.strokeStyle = 'rgba(0,0,0,0.22)'; x.lineWidth = 0.6; x.beginPath(); x.moveTo(-w / 2, h / 2 - PAD - 1.5 * S); x.quadraticCurveTo(0, h / 2 - PAD - 4.5 * S, w / 2, h / 2 - PAD - 1.5 * S); x.stroke(); }
      else if (p.kind === 'pelvis') { x.fillStyle = '#2a1a0e'; x.fillRect(-w, -h / 2 + PAD, w * 2, 2.4 * S); x.fillStyle = '#c8a040'; x.fillRect(-1.6 * S, -h / 2 + PAD + 0.2, 3.2 * S, 2 * S); }
      if (p.kind === 'chest') { x.fillStyle = F.skinCol(g); x.beginPath(); x.moveTo(-3 * S, -h / 2 + PAD); x.lineTo(0, -h / 2 + PAD + 4 * S); x.lineTo(3 * S, -h / 2 + PAD); x.fill(); x.strokeStyle = 'rgba(0,0,0,0.3)'; x.lineWidth = 0.8; x.beginPath(); x.moveTo(0, -h / 2 + PAD + 4 * S); x.lineTo(0, h / 2); x.stroke(); for (let i = 0; i < 2; i++) { x.fillStyle = 'rgba(240,240,230,0.7)'; x.beginPath(); x.arc(0.9 * S, -h / 2 + PAD + (6.5 + i * 4) * S, 0.5 * S, 0, 6.3); x.fill(); } }
      if (p.kind === 'abdomen') { x.strokeStyle = 'rgba(0,0,0,0.3)'; x.lineWidth = 0.8; x.beginPath(); x.moveTo(0, -h); x.lineTo(0, h); x.stroke(); x.fillStyle = 'rgba(240,240,230,0.7)'; x.beginPath(); x.arc(0.9 * S, 0, 0.5 * S, 0, 6.3); x.fill(); }
      if (lk.stripe && p.tex.cloth === 'shirt') { x.fillStyle = 'rgba(255,255,255,0.13)'; for (let y = -h; y < h; y += 4 * S) x.fillRect(-w, y, w * 2, 1.4 * S); }
      if (p.kind === 'uarm') { x.fillStyle = 'rgba(0,0,0,0.18)'; x.fillRect(-w, h / 2 - PAD - 1.2 * S, w * 2, 1.2 * S); }
      if (isBoot) { x.fillStyle = 'rgba(255,255,255,0.12)'; x.fillRect(-w / 2 + 1, -h / 2 + PAD + 0.6, w - 2, 1); x.fillStyle = 'rgba(0,0,0,0.4)'; x.fillRect(-w, h / 2 - PAD - 1.1 * S, w * 2, 1.1 * S); }
    }
  }
}
/* the dummy's skin: his own tone, mottled, pores, darker where the limb turns away, a little definition on the trunk.
   seeded per part, so it looks the same every time it's redrawn */
function skinReal(x, p, g, w, h) {
  const d = p.def, pale = paleOf(g), sk = g.look.skin, R = G.srand(p.tex.seed + 7);
  x.fillStyle = F.skinCol(g); x.fillRect(-w, -h, w * 2, h * 2);
  /* blotches: a little redder here, a little sallower there */
  for (let i = 0; i < 7; i++) { const bx = (R() - 0.5) * w, by = (R() - 0.5) * h, br = (2.5 + R() * 5) * S, gr = x.createRadialGradient(bx, by, 0, bx, by, br);
    gr.addColorStop(0, R() < 0.5 ? `rgba(170,70,60,${0.05 * (1 - pale)})` : `rgba(120,110,70,${0.05})`); gr.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = gr; x.fillRect(bx - br, by - br, br * 2, br * 2); }
  /* pores and fine hair, too small to see unless you look */
  for (let i = 0; i < 90; i++) { x.fillStyle = R() < 0.6 ? 'rgba(60,30,20,0.07)' : 'rgba(255,240,225,0.06)'; x.fillRect((R() - 0.5) * w, (R() - 0.5) * h, 0.45, 0.45); }
  if (d.r) { const gr = x.createRadialGradient(-d.r * S * 0.25, -d.r * S * 0.3, d.r * S * 0.2, 0, 0, d.r * S * 1.05); gr.addColorStop(0, 'rgba(255,240,225,0.07)'); gr.addColorStop(0.75, 'rgba(0,0,0,0)'); gr.addColorStop(1, 'rgba(40,15,10,0.3)'); x.fillStyle = gr; x.fillRect(-w, -h, w * 2, h * 2); decayOver(x, p, g, w, h); return; }
  /* round: the limb turns away from you at both edges */
  const hw = d.wh[0] * S / 2, gr = x.createLinearGradient(-hw, 0, hw, 0);
  gr.addColorStop(0, 'rgba(40,15,10,0.32)'); gr.addColorStop(0.3, 'rgba(0,0,0,0)'); gr.addColorStop(0.55, 'rgba(255,240,225,0.05)'); gr.addColorStop(0.75, 'rgba(0,0,0,0)'); gr.addColorStop(1, 'rgba(40,15,10,0.36)');
  x.fillStyle = gr; x.fillRect(-w, -h, w * 2, h * 2);
  x.strokeStyle = 'rgba(60,25,18,0.12)'; x.lineWidth = 0.6;
  if (p.kind === 'chest') { x.beginPath(); x.moveTo(-hw * 0.85, -h * 0.02); x.quadraticCurveTo(-hw * 0.35, h * 0.14, -hw * 0.02, h * 0.02); x.moveTo(hw * 0.85, -h * 0.02); x.quadraticCurveTo(hw * 0.35, h * 0.14, hw * 0.02, h * 0.02); x.moveTo(0, -h * 0.3); x.lineTo(0, h * 0.4); x.stroke(); }
  if (p.kind === 'abdomen') { x.beginPath(); x.moveTo(0, -h * 0.45); x.lineTo(0, h * 0.4); for (let k = -1; k <= 1; k++) { x.moveTo(-hw * 0.45, k * h * 0.17); x.quadraticCurveTo(0, k * h * 0.17 + 0.8, hw * 0.45, k * h * 0.17); } x.stroke(); x.fillStyle = 'rgba(50,20,15,0.3)'; x.beginPath(); x.ellipse(0, h * 0.28, 0.5 * S, 0.7 * S, 0, 0, Math.PI * 2); x.fill(); }
  if (p.kind === 'uleg' || p.kind === 'uarm') { x.beginPath(); x.moveTo(-hw * 0.2, -h * 0.3); x.quadraticCurveTo(hw * 0.15, 0, -hw * 0.05, h * 0.3); x.stroke(); }
  if (p.kind === 'lleg') { x.beginPath(); x.moveTo(hw * 0.1, -h * 0.35); x.quadraticCurveTo(hw * 0.5, -h * 0.1, hw * 0.25, h * 0.15); x.stroke(); }
  if (p.kind === 'foot') { x.strokeStyle = 'rgba(60,25,18,0.25)'; for (let i = 1; i < 4; i++) { const tx = hw * (0.3 + i * 0.17) * (p.side || 1); x.beginPath(); x.moveTo(tx, h * 0.05); x.lineTo(tx, h * 0.45); x.stroke(); } }
  decayOver(x, p, g, w, h);
}
function paleOf(g) { if (g.dusty || !g.dm) return 0; return clamp((1 - g.dm.blood / G.TUNE.bloodMl) * 1.35 + (g.alive ? 0 : 0.3), 0, 1); }
F.pale = paleOf;

/* ------------------------------------------------------------ after he dies: what time does to him
   it starts when he dies and goes on while he's there, slowly, all of it laid over whatever was done to him (nothing
   heals, nothing is wiped): pallor at once; the blood settling into whatever was lowest (livor, purple-red, that
   moves if he's turned until, after a while, it's fixed where it settled); the eyes clouding and the lips going
   grey-blue; a green tinge over the belly that spreads; the veins showing through dark (marbling); the skin
   darkening, and in the end blistering and slipping in loose patches. what's open dries dark, and the blood on him
   goes brown. it's still him the whole time: every bit of this is paint on the same body */
const DECAY_T = 540;                     /* s from his death to as far as it goes here */
F.DECAY_T = DECAY_T;
F.decay = g => (!g || g.alive || g.dusty || g.diedT == null) ? 0 : clamp((G.t - g.diedT) / DECAY_T, 0, 1);
/* his skin's colour now: pale with what he's lost, then grey-green and darker as he goes */
F.skinCol = function (g, dl = 0) {
  if (g.dusty) return '#e8e0cc';
  const a = g.look.skin, k = paleOf(g), dk = F.decay(g);
  return `hsl(${(a[0] + dk * 36).toFixed(1)},${(a[1] * (1 - k * 0.75) * (1 - dk * 0.35) + dk * 9).toFixed(1)}%,${(a[2] + (84 - a[2]) * k * 0.45 - dk * 20 - dl).toFixed(1)}%)`;
};
function decayOver(x, p, g, w, h) {
  const dk = F.decay(g), t = p.tex; if (dk <= 0 || !t) return;
  /* every random number drawn in the same order every time, used or not, so nothing moves between redraws */
  const R = G.srand(t.seed + 31), veins = [], spots = [];
  for (let i = 0; i < 5; i++) { const v = { x: (R() - 0.5) * w * 0.8, y: (R() - 0.5) * h * 0.9, a: R() * 6.28, s: [] }; for (let k = 0; k < 7; k++) v.s.push([R() - 0.5, R()]); veins.push(v); }
  for (let i = 0; i < 5; i++) spots.push({ x: (R() - 0.5) * w * 0.7, y: (R() - 0.5) * h * 0.8, r: (1.4 + R() * 2.6) * S, on: R(), e: 0.6 + R() * 0.5, a: R() * 3 });
  /* livor: the blood settling in what's lowest. until it fixes, it follows whatever's down now */
  if (dk > 0.015) {
    if (!t.livor || dk < 0.2) { const dn = G.dirLocal(p.body, 0, 1); t.livor = { x: dn.x, y: dn.y }; }
    const k = clamp((dk - 0.015) / 0.2, 0, 1), L = t.livor, ext = Math.max(w, h) * 0.5;
    const gr = x.createLinearGradient(-L.x * ext * 0.15, -L.y * ext * 0.15, L.x * ext, L.y * ext);
    gr.addColorStop(0, 'rgba(110,40,90,0)'); gr.addColorStop(0.55, `rgba(112,40,92,${(0.26 * k).toFixed(3)})`); gr.addColorStop(1, `rgba(92,28,78,${(0.5 * k).toFixed(3)})`);
    x.fillStyle = gr; x.fillRect(-w, -h, w * 2, h * 2);
  }
  /* green: the belly first, the rest of the trunk, then all of him */
  const start = p.kind === 'abdomen' ? 0.16 : A.TRUNK.has(p.kind) ? 0.32 : 0.5, gk = clamp((dk - start) / 0.35, 0, 1);
  if (gk > 0) { x.fillStyle = `rgba(80,104,54,${(0.32 * gk).toFixed(3)})`; x.fillRect(-w, -h, w * 2, h * 2); }
  /* marbling: the veins under the skin, dark, branching */
  const mk = clamp((dk - 0.4) / 0.3, 0, 1);
  if (mk > 0) {
    x.strokeStyle = `rgba(46,52,62,${(0.38 * mk).toFixed(3)})`; x.lineWidth = 0.45; x.lineCap = 'round';
    for (const v of veins) { let px = v.x, py = v.y, a = v.a; x.beginPath(); x.moveTo(px, py); for (const [da, b] of v.s) { a += da * 1.3; px += Math.cos(a) * 2.1 * S; py += Math.sin(a) * 2.1 * S; x.lineTo(px, py); if (b < 0.3) { x.lineTo(px + Math.cos(a + 1) * 1.4 * S, py + Math.sin(a + 1) * 1.4 * S); x.moveTo(px, py); } } x.stroke(); }
  }
  /* slipping: blisters, and patches where the top of the skin has come loose */
  const sk = clamp((dk - 0.7) / 0.25, 0, 1);
  if (sk > 0) for (const sp of spots) {
    if (sp.on > sk) continue;
    x.save(); x.translate(sp.x, sp.y); x.rotate(sp.a);
    x.fillStyle = `rgba(196,176,146,${(0.34 * sk).toFixed(3)})`; x.beginPath(); x.ellipse(0, 0, sp.r * sp.e, sp.r * 0.62, 0, 0, Math.PI * 2); x.fill();
    x.strokeStyle = `rgba(110,60,44,${(0.45 * sk).toFixed(3)})`; x.lineWidth = 0.45; x.stroke();
    x.fillStyle = `rgba(150,66,56,${(0.3 * sk).toFixed(3)})`; x.beginPath(); x.ellipse(sp.r * 0.2, sp.r * 0.1, sp.r * 0.45, sp.r * 0.26, 0, 0, Math.PI * 2); x.fill();
    x.restore();
  }
  /* and all of it darker */
  x.fillStyle = `rgba(32,22,16,${(0.16 * dk).toFixed(3)})`; x.fillRect(-w, -h, w * 2, h * 2);
}
F.decayOver = decayOver;
/* one layer: its colour, cut to its mask, onto the composite */
function layer(dst, p, mask, kind, g) {
  const t = p.tex;
  tmp.width = mask.width; tmp.height = mask.height;
  tctx.setTransform(RES, 0, 0, RES, tmp.width / 2, tmp.height / 2);
  pattern(tctx, p, kind, g);
  tctx.setTransform(1, 0, 0, 1, 0, 0);
  tctx.globalCompositeOperation = 'destination-in'; tctx.drawImage(mask, 0, 0); tctx.globalCompositeOperation = 'source-over';
  dst.drawImage(tmp, 0, 0);
}
/* the edge of a layer's mask, inside the part: the mask, less the mask shrunk a little (kept only away from the part's
   own outline, so the silhouette doesn't get a rim) */
const eA = document.createElement('canvas'), eAx = eA.getContext('2d', CPU), eB = document.createElement('canvas'), eBx = eB.getContext('2d', CPU);
function erode(dst, dx, src, d) {
  dx.globalCompositeOperation = 'copy'; dx.drawImage(src, 0, 0);
  dx.globalCompositeOperation = 'destination-in'; for (const [x, y] of [[d, 0], [-d, 0], [0, d], [0, -d]]) dx.drawImage(src, x, y);
  dx.globalCompositeOperation = 'source-over';
}
function edge(c, t, mask, col, alpha, wk) {
  const W = mask.width, H = mask.height, d = Math.max(1, Math.round(RES * wk));
  if (eA.width !== W || eA.height !== H) { eA.width = eB.width = W; eA.height = eB.height = H; }
  if (!t.inner || t.inner.width !== W) { t.inner = document.createElement('canvas'); t.inner.width = W; t.inner.height = H; const ix = t.inner.getContext('2d', CPU), full = document.createElement('canvas'); full.width = W; full.height = H; const fx = full.getContext('2d', CPU); fx.setTransform(RES, 0, 0, RES, W / 2, H / 2); A.outline(fx, t.def || t.d, S); fx.fillStyle = '#fff'; fx.fill(); erode(t.inner, ix, full, Math.max(2, Math.round(RES * 1.3))); }
  erode(eA, eAx, mask, d);
  eBx.globalCompositeOperation = 'copy'; eBx.drawImage(mask, 0, 0);
  eBx.globalCompositeOperation = 'destination-out'; eBx.drawImage(eA, 0, 0);
  eBx.globalCompositeOperation = 'destination-in'; eBx.drawImage(t.inner, 0, 0);
  eBx.globalCompositeOperation = 'source-in'; eBx.fillStyle = col; eBx.fillRect(0, 0, W, H);
  eBx.globalCompositeOperation = 'source-over';
  c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = alpha; c.drawImage(eB, 0, 0); c.restore();
}
function bruiseColour(b, now) {
  const age = now - b.t;                                     /* game seconds: the colours of days, in a minute */
  const k = b.k * clamp(age / 2.5, 0.25, 1) * clamp(1 - (age - 160) / 90, 0, 1);
  if (age < 8) return [`rgba(150,30,40,${0.5 * k})`, `rgba(120,30,60,${0.22 * k})`];
  if (age < 45) return [`rgba(70,25,85,${0.62 * k})`, `rgba(50,40,100,${0.3 * k})`];
  if (age < 100) return [`rgba(45,40,110,${0.55 * k})`, `rgba(90,110,40,${0.25 * k})`];
  return [`rgba(70,80,50,${0.4 * k})`, `rgba(140,130,50,${0.22 * k})`];
}
F.compose = function (g, p) {
  const t = p.tex; if (!t) return;
  const c = t.comp.getContext('2d'); c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, t.comp.width, t.comp.height);
  /* the cavity and the bone, clipped to him */
  c.save(); c.setTransform(RES, 0, 0, RES, t.comp.width / 2, t.comp.height / 2); A.outline(c, p.def, S); c.clip();
  c.fillStyle = g.dusty ? '#3a3024' : CAVITY; c.fillRect(-t.w, -t.h, t.w * 2, t.h * 2);
  if (!g.dusty) { c.fillStyle = '#5a0a08'; A.outline(c, p.def, S * 0.72); c.fill(); }
  /* organs where they'd be: only ever seen through a hole */
  const orgs = A.ORGANS[p.kind];
  if (orgs && !g.dusty) for (const o of orgs) { o.draw(c, S); c.fillStyle = o.id === 'brain' ? '#d88a92' : o.id === 'heart' ? '#a01414' : o.id.startsWith('lung') ? '#c46a74' : o.id === 'liver' ? '#6a1a12' : o.id === 'bowel' ? '#c7737a' : '#b05a5a'; c.fill(); }
  A.bone(c, p.def, S, { holes: false }); c.fillStyle = BONE; c.fill('evenodd');
  c.restore();
  if (!g.dusty) layer(c, p, t.mMuscle, 'muscle', g);
  if (!g.dusty) layer(c, p, t.mFat, 'fat', g);
  layer(c, p, t.mSkin, 'skin', g);
  if (t.cloth) layer(c, p, t.mCloth, 'cloth', g);
  const top = p.kind === 'head' ? t.over.getContext('2d') : c;
  if (p.kind === 'head') { top.setTransform(1, 0, 0, 1, 0, 0); top.clearRect(0, 0, t.over.width, t.over.height); }
  /* bruises show through skin, not through cloth */
  if (t.bruises.length) {
    tmp.width = t.comp.width; tmp.height = t.comp.height; tctx.setTransform(RES, 0, 0, RES, tmp.width / 2, tmp.height / 2);
    for (const b of t.bruises) {
      const [c1, c2] = bruiseColour(b, G.t), R = G.srand(b.seed);
      tctx.save(); tctx.translate(b.x, b.y); tctx.scale(1 + R() * 0.4, 0.8 + R() * 0.4);
      const gr = tctx.createRadialGradient(0, 0, 0, 0, 0, b.r * 1.3); gr.addColorStop(0, c1); gr.addColorStop(0.55, c2); gr.addColorStop(1, 'rgba(0,0,0,0)');
      tctx.fillStyle = gr; tctx.beginPath(); tctx.arc(0, 0, b.r * 1.3, 0, Math.PI * 2); tctx.fill(); tctx.restore();
    }
    tctx.setTransform(1, 0, 0, 1, 0, 0);
    tctx.globalCompositeOperation = 'destination-in'; tctx.drawImage(t.mSkin, 0, 0);
    if (t.cloth) { tctx.globalCompositeOperation = 'destination-out'; tctx.drawImage(t.mCloth, 0, 0); }
    tctx.globalCompositeOperation = 'source-over';
    top.drawImage(tmp, 0, 0);
  }
  /* soot, dirt, blood in the cloth, the bloody edges of every opening */
  let stain = t.stain; const dkS = F.decay(g);
  if (dkS > 0.02) { tmp.width = stain.width; tmp.height = stain.height; tctx.setTransform(1, 0, 0, 1, 0, 0); tctx.drawImage(stain, 0, 0); tctx.globalCompositeOperation = 'source-atop'; tctx.fillStyle = `rgba(46,26,14,${(0.55 * Math.min(1, dkS * 2)).toFixed(3)})`; tctx.fillRect(0, 0, tmp.width, tmp.height); tctx.globalCompositeOperation = 'source-over'; stain = tmp; }
  top.save(); top.setTransform(RES, 0, 0, RES, t.comp.width / 2, t.comp.height / 2); A.outline(top, p.def, S); top.clip(); top.setTransform(1, 0, 0, 1, 0, 0); top.drawImage(stain, 0, 0); top.restore();
  /* where the skin was cut or torn: its edge, the pale underside of it showing as a thin line through the blood, and a
     shadow inside where it stands up off the fat (the part's own outline isn't an edge: only openings get this) */
  if (!g.dusty && t.cut) { edge(top, t, t.mSkin, 'rgb(236,176,160)', 0.7, 0.55); edge(top, t, t.mFat, 'rgba(60,8,4,1)', 0.3, 0.5); }
  if (t.cloth && t.cut) edge(top, t, t.mCloth, 'rgba(235,230,220,1)', 0.35, 0.5);
  t.dirty = false; t.lastPale = paleOf(g); t.lastComp = G.t;
};
/* once a frame: anything that changed, and the slow things (bruises turning, him going pale) now and then */
F.tick = function (g) {
  const pale = paleOf(g);
  for (const p of g.list) {
    const t = p.tex; if (!t || p.gone) continue;
    const skinShows = !t.cloth || p.kind === 'chest';
    if (!t.dirty && skinShows && Math.abs(pale - t.lastPale) > 0.05) t.dirty = true;
    if (!t.dirty && t.bruises.length && G.t - t.lastComp > 1.5) t.dirty = true;
    if (!t.dirty && !g.alive && !g.dusty && G.t - g.diedT < DECAY_T + 10 && G.t - t.lastComp > 2.5 + t.seed * 2) t.dirty = true;
    if (t.dirty) F.compose(g, p);
  }
};
/* every half second, blood from his open places soaks into what he's wearing */
F.bleedTick = function (g) {
  if (g.dusty || !g.alive) return;
  for (const p of g.list) {
    const t = p.tex; if (!t || p.gone) continue;
    for (const o of t.openings) { if (o.bleed <= 0.05) continue; o.bleed *= 0.985; F.soak(p, o.x + G.rnd(-1, 1), o.y + G.rnd(0, 3) * S, o.r + 3 * S + Math.min(6 * S, (G.t - o.t) * 0.4 * S)); }
  }
};
})();
