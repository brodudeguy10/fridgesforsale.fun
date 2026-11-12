/* ============================================================
   THE GUY, version two.
   the little man in the bottom right corner of the main page. he
   used to be ten boxes that bled a bit and fell apart after fifty
   hits. now he has:
   - a body: eleven parts, a skeleton of joints that can stretch,
     tear and snap, five litres of blood and a heart that pushes it
   - wounds drawn on the part they happened to: bruises, cuts,
     gashes down to the bone, bullet holes, burns, compound
     fractures, ripped clothes, blood that runs downhill
   - stumps that spurt in time with his heartbeat, slower as he
     runs out, until they only drip
   - a face that looks at your cursor, screams, bleeds from the
     nose, loses teeth and eyes, goes cross-eyed, goes pale, goes out
   - a ribcage, a heart you can watch beating, guts that come out on
     a chain you can drag around, a skull with a brain in it
   - tools: hand, knife, hammer, a six-shooter, dynamite, a sponge
   - a toe tag for every one of them
   loads after the page's own script and uses its engine, world,
   render, mouseConstraint, audioCtx and the dried blood canvas.
============================================================ */
(function () {
'use strict';
if (!window.Matter || typeof engine === 'undefined' || !engine.world) return;
const M = Matter, B = M.Body, Q = M.Query;
const W = () => window.innerWidth, H = () => window.innerHeight;
const rnd = (a, b) => a + Math.random() * (b - a), pick = a => a[Math.floor(Math.random() * a.length)];
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const coarse = (window.matchMedia && matchMedia('(pointer: coarse)').matches) || navigator.maxTouchPoints > 0;

/* collision layers: the world and the fridges are 1, the guy 2, gibs and guts 4, dynamite 8 */
const CAT_GUY = 0x0002, CAT_GIB = 0x0004, CAT_TNT = 0x0008;
const GUY_FILTER = { category: CAT_GUY, mask: 0x0001 | CAT_TNT };
const GIB_FILTER = { category: CAT_GIB, mask: 0x0001 };
const TNT_FILTER = { category: CAT_TNT, mask: 0x0001 | CAT_GUY };

/* ------------------------------------------------------------ canvases */
const dried = document.getElementById('driedBloodCanvas');
const dctx = dried.getContext('2d');
/* the blood used to land on the glass, in front of everything, so the more there was the less of him you could
   see. it goes on the wall behind him now: the physics canvas goes see-through and the stains sit under it */
try {
  render.options.background = 'transparent';
  dried.style.zIndex = '-1';
} catch (e) {}
const overlay = document.getElementById('ragdollBloodCanvas');
if (overlay) overlay.getContext('2d').clearRect(0, 0, overlay.width, overlay.height);
const BLOOD = ['#7a0606', '#8c0a0a', '#650404', '#9a1010', '#5a0303'];
const DUST = ['#b8a07a', '#a08860', '#c8b490', '#8a7450'];

/* ------------------------------------------------------------ sound */
let bus = null, noiseBuf = null;
function ac() { try { if (typeof ensureAudioContext === 'function') ensureAudioContext(); } catch (e) {} return (typeof audioCtx !== 'undefined' && audioCtx) ? audioCtx : null; }
function out() {
  const A = ac(); if (!A) return null;
  if (!bus) { bus = A.createGain(); bus.gain.value = 0.55; bus.connect(A.destination); }
  if (!noiseBuf) { noiseBuf = A.createBuffer(1, A.sampleRate, A.sampleRate); const d = noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; }
  return A;
}
function noise(A, t, dur, type, f0, f1, q, g, dest) {
  const s = A.createBufferSource(); s.buffer = noiseBuf; s.loop = true;
  const f = A.createBiquadFilter(); f.type = type; f.frequency.setValueAtTime(f0, t); f.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + dur); f.Q.value = q;
  const v = A.createGain(); v.gain.setValueAtTime(0.0001, t); v.gain.exponentialRampToValueAtTime(g, t + Math.min(0.01, dur * 0.2)); v.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  s.connect(f); f.connect(v); v.connect(dest || bus); s.start(t, Math.random() * 0.5); s.stop(t + dur + 0.05);
}
function tone(A, t, dur, type, f0, f1, g, dest) {
  const o = A.createOscillator(); o.type = type; o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + dur);
  const v = A.createGain(); v.gain.setValueAtTime(0.0001, t); v.gain.exponentialRampToValueAtTime(g, t + 0.008); v.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(v); v.connect(dest || bus); o.start(t); o.stop(t + dur + 0.05);
}
const SND = {
  squish(k = 1) { const A = out(); if (!A) return; const t = A.currentTime; noise(A, t, 0.16 + 0.1 * k, 'bandpass', rnd(700, 1200), 220, 2.5, 0.35 * k); tone(A, t, 0.14, 'sine', 140, 55, 0.25 * k); },
  splat(k = 1) { const A = out(); if (!A) return; const t = A.currentTime; noise(A, t, 0.09, 'lowpass', 900, 200, 1, 0.22 * k); },
  crunch(k = 1) { const A = out(); if (!A) return; const t = A.currentTime; for (let i = 0; i < 4; i++) noise(A, t + i * 0.011 + Math.random() * 0.006, 0.025, 'highpass', rnd(1800, 3200), 1500, 1, 0.3 * k); tone(A, t, 0.08, 'square', 220, 90, 0.08 * k); },
  snap(k = 1) { const A = out(); if (!A) return; const t = A.currentTime; noise(A, t, 0.05, 'highpass', 2600, 1800, 1, 0.5 * k); tone(A, t, 0.05, 'triangle', 900, 300, 0.2 * k); noise(A, t + 0.03, 0.3, 'bandpass', 600, 250, 1.5, 0.3 * k); },
  slice() { const A = out(); if (!A) return; const t = A.currentTime; noise(A, t, 0.16, 'highpass', 5200, 2400, 1, 0.12); },
  cut() { const A = out(); if (!A) return; const t = A.currentTime; noise(A, t, 0.13, 'bandpass', 1500, 500, 2, 0.3); noise(A, t + 0.02, 0.2, 'lowpass', 700, 200, 1, 0.2); },
  thud(k = 1) { const A = out(); if (!A) return; const t = A.currentTime; tone(A, t, 0.22, 'sine', 95, 38, 0.6 * k); noise(A, t, 0.12, 'lowpass', 500, 120, 1, 0.4 * k); },
  spurt(k = 1) { const A = out(); if (!A) return; const t = A.currentTime; noise(A, t, 0.22, 'bandpass', 1100, 700, 1.2, 0.1 * k); },
  ping() { const A = out(); if (!A) return; const t = A.currentTime; tone(A, t, 0.45, 'sine', 3400, 900, 0.18); noise(A, t, 0.03, 'highpass', 4000, 3000, 1, 0.3); },
  click() { const A = out(); if (!A) return; const t = A.currentTime; noise(A, t, 0.02, 'highpass', 3000, 2500, 2, 0.35); },
  spin() { const A = out(); if (!A) return; const t = A.currentTime; for (let i = 0; i < 9; i++) noise(A, t + i * 0.055, 0.015, 'highpass', 3600, 3000, 3, 0.18); noise(A, t + 0.62, 0.03, 'highpass', 2200, 1800, 1, 0.5); },
  boom() { const A = out(); if (!A) return; const t = A.currentTime; noise(A, t, 1.6, 'lowpass', 1400, 60, 0.7, 1.0); tone(A, t, 0.9, 'sine', 70, 24, 0.9); noise(A, t, 0.08, 'highpass', 3000, 1200, 1, 0.6); },
  heart() { const A = out(); if (!A) return; const t = A.currentTime; tone(A, t, 0.12, 'sine', 62, 40, 0.08); tone(A, t + 0.14, 0.1, 'sine', 55, 38, 0.06); },
  gurgle() { const A = out(); if (!A) return; const t = A.currentTime; for (let i = 0; i < 5; i++) noise(A, t + i * 0.07, 0.08, 'bandpass', rnd(250, 500), 180, 6, 0.12); },
  whistle() { const A = out(); if (!A) return; const t = A.currentTime; [[1318, 0.5], [1760, 0.35], [1318, 0.7]].reduce((at, [f, d]) => { tone(A, at, d, 'sine', f, f * 0.995, 0.12); return at + d * 0.9; }, t); },
  /* the page's own scream, with this guy's pitch, so every one of them sounds like himself */
  scream(pitch = 1, k = 1, gurgling = false) {
    const A = out(); if (!A) return; const t = A.currentTime, d = 0.6 + 0.6 * k;
    const o = A.createOscillator(); o.type = 'sawtooth'; o.frequency.setValueAtTime(420 * pitch, t); o.frequency.exponentialRampToValueAtTime(150 * pitch, t + d);
    const vib = A.createOscillator(), vg = A.createGain(); vib.frequency.value = gurgling ? 7 : 16 + Math.random() * 6; vg.gain.value = gurgling ? 90 : 40; vib.connect(vg); vg.connect(o.frequency);
    const ws = A.createWaveShaper(), c = new Float32Array(256); for (let i = 0; i < 256; i++) c[i] = Math.tanh((i - 128) / 128 * 3); ws.curve = c;
    const f = A.createBiquadFilter(); f.type = 'peaking'; f.frequency.setValueAtTime(900 * pitch, t); f.frequency.exponentialRampToValueAtTime(600 * pitch, t + d * 0.7); f.Q.value = 6; f.gain.value = 22;
    const lp = A.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = gurgling ? 900 : 5000;
    const v = A.createGain(); v.gain.setValueAtTime(0.0001, t); v.gain.exponentialRampToValueAtTime(0.5 * k, t + 0.04); v.gain.exponentialRampToValueAtTime(0.0001, t + d);
    o.connect(ws); ws.connect(f); f.connect(lp); lp.connect(v); v.connect(bus); o.start(t); vib.start(t); o.stop(t + d + 0.05); vib.stop(t + d + 0.05);
    if (gurgling) SND.gurgle();
  },
  whimper(pitch = 1) { const A = out(); if (!A) return; const t = A.currentTime; const o = A.createOscillator(); o.type = 'triangle'; o.frequency.setValueAtTime(620 * pitch, t); o.frequency.linearRampToValueAtTime(480 * pitch, t + 0.5); const v = A.createGain(); v.gain.setValueAtTime(0.0001, t); v.gain.exponentialRampToValueAtTime(0.05, t + 0.05); v.gain.exponentialRampToValueAtTime(0.0001, t + 0.55); o.connect(v); v.connect(bus); o.start(t); o.stop(t + 0.6); }
};
/* the page already ships a revolver shot and a bullet going into meat. a missing file falls back to synth */
const FILES = { shot: 'revolver.mp3', flesh: 'bullethitflesh.mp3' };
const fileOk = { shot: true, flesh: true };
function play(name, vol, synth) {
  if (fileOk[name]) {
    try { const a = new Audio(FILES[name]); a.volume = vol; const p = a.play(); if (p && p.catch) p.catch(() => { fileOk[name] = false; synth && synth(); }); a.onerror = () => { fileOk[name] = false; }; return; } catch (e) { fileOk[name] = false; }
  }
  synth && synth();
}
function shotSound() { play('shot', 0.5, () => { const A = out(); if (!A) return; const t = A.currentTime; noise(A, t, 0.25, 'lowpass', 6000, 400, 0.7, 0.8); tone(A, t, 0.18, 'sine', 160, 45, 0.7); noise(A, t + 0.12, 0.6, 'bandpass', 900, 300, 1, 0.15); }); }

/* ------------------------------------------------------------ the guys */
const NAMES = ['Frank', 'Blurst', 'Theodore', 'Rustbucket', 'Gregory', 'Mortimer', 'Bartholomew', 'Cletus', 'Jebediah', 'Hank', 'Lenny', 'Stumpy', 'Wyatt', 'Ezekiel', 'Hollis', 'Amos', 'Boone', 'Virgil', 'Earl', 'Doc'];
let bodyCount = 0; try { bodyCount = +localStorage.getItem('ffs_bodycount') || 0; } catch (e) {}
/* the rest pose, in the guy's own units: x across, y down, the feet at about +44 */
const PARTS = [
  /* id, kind, side, shape [w,h] or radius, rest centre, hp, layer (0 back, 1 middle, 2 front) */
  { id: 'head', kind: 'head', r: 10, at: [0, -56], hp: 45, layer: 1 },
  { id: 'chest', kind: 'chest', wh: [15, 19], at: [0, -36.5], hp: 75, layer: 1 },
  { id: 'pelvis', kind: 'pelvis', wh: [15, 13], at: [0, -20.5], hp: 60, layer: 1 },
  { id: 'uarmR', kind: 'uarm', side: 1, wh: [6, 19], at: [10, -35.5], hp: 34, layer: 0 },
  { id: 'larmR', kind: 'larm', side: 1, wh: [5, 18], at: [10, -17], hp: 28, layer: 0 },
  { id: 'ulegR', kind: 'uleg', side: 1, wh: [7, 22], at: [4, -3], hp: 40, layer: 0 },
  { id: 'llegR', kind: 'lleg', side: 1, wh: [6, 22], at: [4, 19], hp: 32, layer: 0 },
  { id: 'ulegL', kind: 'uleg', side: -1, wh: [7, 22], at: [-4, -3], hp: 40, layer: 2 },
  { id: 'llegL', kind: 'lleg', side: -1, wh: [6, 22], at: [-4, 19], hp: 32, layer: 2 },
  { id: 'uarmL', kind: 'uarm', side: -1, wh: [6, 19], at: [-10, -35.5], hp: 34, layer: 2 },
  { id: 'larmL', kind: 'larm', side: -1, wh: [5, 18], at: [-10, -17], hp: 28, layer: 2 }
];
/* joints: name, parent, child, the point on each (in rest units, from the part's centre), how hard it is to tear, how hard the stump spurts */
const JOINTS = [
  { id: 'neck', a: 'chest', b: 'head', pa: [0, -9.5], pb: [0, 10], hp: 46, art: 1.7 },
  { id: 'waist', a: 'chest', b: 'pelvis', pa: [0, 9.5], pb: [0, -6.5], hp: 62, art: 1.4 },
  { id: 'shoulderR', a: 'chest', b: 'uarmR', pa: [7.5, -7.5], pb: [0, -8.5], hp: 34, art: 1.0 },
  { id: 'shoulderL', a: 'chest', b: 'uarmL', pa: [-7.5, -7.5], pb: [0, -8.5], hp: 34, art: 1.0 },
  { id: 'elbowR', a: 'uarmR', b: 'larmR', pa: [0, 9], pb: [0, -8.5], hp: 26, art: 0.6 },
  { id: 'elbowL', a: 'uarmL', b: 'larmL', pa: [0, 9], pb: [0, -8.5], hp: 26, art: 0.6 },
  { id: 'hipR', a: 'pelvis', b: 'ulegR', pa: [4, 6.5], pb: [0, -10.5], hp: 40, art: 1.2 },
  { id: 'hipL', a: 'pelvis', b: 'ulegL', pa: [-4, 6.5], pb: [0, -10.5], hp: 40, art: 1.2 },
  { id: 'kneeR', a: 'ulegR', b: 'llegR', pa: [0, 10.5], pb: [0, -10.5], hp: 30, art: 0.6 },
  { id: 'kneeL', a: 'ulegL', b: 'llegL', pa: [0, 10.5], pb: [0, -10.5], hp: 30, art: 0.6 }
];
const LIMB = new Set(['uarm', 'larm', 'uleg', 'lleg']);
const S = coarse || W() < 880 ? 1.35 : 1.9;
let guy = null;
const LOG = [];
function note(m) { LOG.push(m); if (LOG.length > 40) LOG.shift(); }
const gibs = [], particles = [], drips = [], fx = [], smoke = [], tnts = [], guts = [];
let tool = 'hand', ammo = 6, reloading = 0, cylHits = 0, cylShots = 0, slowmo = 0, hatsForAll = false;
let pointer = { x: W() / 2, y: H() / 2, down: false, last: null, lastT: 0 };

/* where he waits: bottom right, clear of the right hand panel on a wide screen */
const homeX = () => W() < 880 || coarse ? W() - 70 : Math.max(120, W() - 330);
const homeY = () => H() - 70 - 44 * S;
function newGuy(force = {}) {
  bodyCount++; try { localStorage.setItem('ffs_bodycount', String(bodyCount)); } catch (e) {}
  const dusty = force.dusty != null ? force.dusty : Math.random() < 1 / 30;
  const skinH = 18 + Math.random() * 18, skinL = 52 + Math.random() * 26;
  const g = {
    n: bodyCount, name: dusty ? 'Dusty' : pick(NAMES), dusty, pitch: rnd(0.82, 1.25), alive: true, active: false, dead: 0, gone: 0,
    skin: [skinH, 45 + Math.random() * 20, skinL], shirt: `hsl(${Math.floor(rnd(0, 360))},${Math.floor(rnd(35, 70))}%,${Math.floor(rnd(30, 55))}%)`,
    pants: pick(['#2a3a5a', '#3a3328', '#2b2b2e', '#4a3a2a', '#24324a']), boots: pick(['#3a2414', '#2a1a10', '#4a2e18']),
    hat: dusty || hatsForAll || Math.random() < 0.28, hatCol: pick(['#5a3a1e', '#3a2a1a', '#7a5a34', '#222']),
    blood: dusty ? 0 : 5000, lost: 0, bpm: 72, beat: 0, pulse: 0, pain: 0, ko: 0, shock: 0,
    stats: { hits: 0, fractures: 0, pieces: 1, shots: 0, cuts: 0 }, cause: '', killer: '',
    parts: {}, list: [], joints: [], look: [0, 0], scream: 0, mouth: 0, twitch: 0, hatOn: true, eyeOut: [0, 0], teeth: 0, x: homeX(), y: homeY()
  };
  for (const d of PARTS) {
    const x = g.x + d.at[0] * S, y = g.y + d.at[1] * S;
    const opts = { isStatic: true, collisionFilter: GUY_FILTER, frictionAir: 0.012, friction: 0.5, restitution: 0.12, density: d.kind === 'head' ? 0.0011 : 0.0016, render: { visible: false }, label: 'guy' };
    const body = d.r ? M.Bodies.circle(x, y, d.r * S, opts) : M.Bodies.rectangle(x, y, d.wh[0] * S, d.wh[1] * S, opts);
    const p = { def: d, id: d.id, kind: d.kind, body, hp: d.hp, max: d.hp, wounds: [], stumps: [], frac: [], cuts: 0, open: 0, cool: 0, attached: true, gone: false, burnt: 0 };
    body.plugin = { guy: g, part: p };
    g.parts[d.id] = p; g.list.push(p);
  }
  g.list.sort((a, b) => a.def.layer - b.def.layer);
  for (const j of JOINTS) g.joints.push({ def: j, id: j.id, a: g.parts[j.a], b: g.parts[j.b], c: null, hp: j.hp, broken: false, soft: 0, maxSt: 0 });
  M.World.add(world, g.list.map(p => p.body));
  guy = g; shim();
  prompt();
  return g;
}
/* the [click me] sits under his feet, wherever he's waiting */
function prompt() { const pr = document.getElementById('guyPrompt'); if (!pr || !guy) return; pr.style.display = 'block'; pr.style.right = 'auto'; pr.style.bottom = 'auto'; pr.style.left = (guy.x - 30) + 'px'; pr.style.top = (guy.y + 46 * S) + 'px'; }
/* the page still asks after ragdollParts and guyActivated (the resize code moves a waiting guy, the music bounces an awake one) */
function shim() {
  try { ragdollParts = guy ? guy.list.filter(p => !p.gone).map(p => p.body) : []; } catch (e) {}
  try { guyActivated = !!(guy && guy.active && guy.alive); } catch (e) {}
}
function wake(g = guy) {
  if (!g || g.active) return;
  g.active = true;
  for (const p of g.list) B.setStatic(p.body, false);
  for (const j of g.joints) {
    j.c = M.Constraint.create({ bodyA: j.a.body, bodyB: j.b.body, pointA: { x: j.def.pa[0] * S, y: j.def.pa[1] * S }, pointB: { x: j.def.pb[0] * S, y: j.def.pb[1] * S }, length: 0, stiffness: 0.9, damping: 0.2, render: { visible: false } });
    M.World.add(world, j.c);
  }
  const pr = document.getElementById('guyPrompt'); if (pr) pr.style.display = 'none';
  shim();
}

/* ------------------------------------------------------------ geometry */
const toWorld = (b, lx, ly) => { const c = Math.cos(b.angle), s = Math.sin(b.angle); return { x: b.position.x + lx * c - ly * s, y: b.position.y + lx * s + ly * c }; };
const toLocal = (b, x, y) => { const c = Math.cos(-b.angle), s = Math.sin(-b.angle), dx = x - b.position.x, dy = y - b.position.y; return { x: dx * c - dy * s, y: dx * s + dy * c }; };
const dirLocal = (b, dx, dy) => { const c = Math.cos(-b.angle), s = Math.sin(-b.angle); return { x: dx * c - dy * s, y: dx * s + dy * c }; };
function anchorWorld(j, side) { const b = side === 'a' ? j.a.body : j.b.body; if (j.c) { const p = side === 'a' ? j.c.pointA : j.c.pointB; return { x: b.position.x + p.x, y: b.position.y + p.y }; } const d = side === 'a' ? j.def.pa : j.def.pb; return toWorld(b, d[0] * S, d[1] * S); }

/* ------------------------------------------------------------ blood */
function bleed(x, y, vx, vy, n, sp, spread, size, kind) {
  const g = guy, dust = kind === 'dust' || (g && g.dusty && kind !== 'gib');
  for (let i = 0; i < n && particles.length < 1400; i++) {
    const a = Math.atan2(vy, vx) + (Math.random() - 0.5) * spread, v = sp * rnd(0.35, 1.15);
    particles.push({ x, y, vx: Math.cos(a) * v + rnd(-0.3, 0.3), vy: Math.sin(a) * v + rnd(-0.3, 0.3), r: size * rnd(0.5, 1.3), life: rnd(40, 110), c: dust ? pick(DUST) : pick(BLOOD), dust });
  }
}
/* blood that lands. it stays on the glass: the page has always kept it */
function stamp(x, y, r, vx = 0, vy = 0, col, alpha = 0.85, floor = false) {
  dctx.save(); dctx.globalAlpha = alpha; dctx.fillStyle = col || pick(BLOOD);
  const sp = Math.hypot(vx, vy);
  dctx.translate(x, y);
  if (floor) { dctx.beginPath(); dctx.ellipse(0, 0, r * (1.6 + sp * 0.2), r * 0.45, 0, 0, Math.PI * 2); dctx.fill(); }
  else {
    dctx.rotate(Math.atan2(vy, vx)); dctx.beginPath(); dctx.ellipse(0, 0, r * (1 + sp * 0.22), r, 0, 0, Math.PI * 2); dctx.fill();
    if (r > 2 && Math.random() < 0.6) for (let i = 0, k = 2 + Math.floor(Math.random() * 4); i < k; i++) { dctx.beginPath(); dctx.arc(r * (1.2 + sp * 0.3) * Math.random() + r, (Math.random() - 0.5) * r * 2.4, r * rnd(0.15, 0.45), 0, Math.PI * 2); dctx.fill(); }
  }
  dctx.restore();
}
function splatBig(x, y, r, col) {
  for (let i = 0; i < 26; i++) { const a = Math.random() * Math.PI * 2, d = Math.random() ** 0.7 * r; stamp(x + Math.cos(a) * d, y + Math.sin(a) * d, rnd(1.5, 5) * (1 - d / r * 0.6), Math.cos(a) * 3, Math.sin(a) * 3, col); }
  stamp(x, y, r * 0.35, 0, 0, col, 0.9);
  for (let i = 0; i < 8; i++) drip(x + rnd(-r, r) * 0.7, y + rnd(-r, r) * 0.4, rnd(1.2, 2.6), col);
}
function drip(x, y, w, col) { if (drips.length < 90 && !(guy && guy.dusty)) drips.push({ x, y, w, v: rnd(0.25, 0.8), left: rnd(25, 160), c: col || pick(BLOOD) }); }

/* ------------------------------------------------------------ gibs */
function gib(type, x, y, vx, vy, r = 3) {
  while (gibs.length > 85) { const o = gibs.shift(); try { M.World.remove(world, o.body); } catch (e) {} if (o.tether) try { M.World.remove(world, o.tether); } catch (e) {} }
  const sides = type === 'meat' ? 5 : type === 'bone' || type === 'skull' ? 4 : 0;
  const opts = { collisionFilter: GIB_FILTER, frictionAir: 0.01, friction: 0.6, restitution: type === 'eye' ? 0.5 : 0.25, density: 0.001, render: { visible: false }, label: 'gib' };
  const body = sides ? M.Bodies.polygon(x, y, sides, r * S, opts) : M.Bodies.circle(x, y, r * S, opts);
  B.setVelocity(body, { x: vx, y: vy }); B.setAngularVelocity(body, rnd(-0.4, 0.4));
  const o = { type, body, r: r * S, born: performance.now(), seed: Math.random(), dust: guy && guy.dusty, col: type === 'hat' ? guy && guy.hatCol : null, tether: null, from: null };
  body.plugin = { gib: o };
  M.World.add(world, body); gibs.push(o); return o;
}
function gibBurst(x, y, n, sp, kinds) { for (let i = 0; i < n; i++) { const a = Math.random() * Math.PI * 2, v = rnd(2, sp); gib(pick(kinds), x + rnd(-4, 4), y + rnd(-4, 4), Math.cos(a) * v, Math.sin(a) * v - 2, rnd(1.6, 3.4)); } }
/* guts: a chain you can drag out of him */
function spillGuts(p, lx, ly) {
  const g = guy; if (!g || g.dusty || guts.length >= 3) return;
  const base = toWorld(p.body, lx, ly), links = [], cons = [];
  const n = 11, sp = 6.5 * S;
  for (let i = 0; i < n; i++) {
    const b = M.Bodies.circle(base.x + rnd(-2, 2), base.y + i * 2, 3.2 * S, { collisionFilter: GIB_FILTER, frictionAir: 0.03, friction: 0.8, restitution: 0.05, density: 0.0012, render: { visible: false }, label: 'gut' });
    B.setVelocity(b, { x: rnd(-2.5, 2.5), y: rnd(-1, 2) }); links.push(b);
  }
  for (let i = 1; i < n; i++) cons.push(M.Constraint.create({ bodyA: links[i - 1], bodyB: links[i], length: sp, stiffness: 0.65, damping: 0.1, render: { visible: false } }));
  const anchor = M.Constraint.create({ bodyA: p.body, pointA: { x: lx, y: ly }, bodyB: links[0], length: 2, stiffness: 0.5, damping: 0.1, render: { visible: false } });
  M.World.add(world, [...links, ...cons, anchor]);
  guts.push({ links, cons, anchor, part: p, born: performance.now() });
  SND.squish(1.3);
}

/* ------------------------------------------------------------ hurting him */
const KILLS = { bleed: 'exsanguination', decap: 'decapitation', head: 'massive head trauma', halves: 'bisection', chest: 'crushed chest', heart: 'his heart, mostly', blast: 'blast injuries', lead: 'lead poisoning', blunt: 'blunt force trauma', shock: 'shock' };
function die(cause) {
  const g = guy; if (!g || !g.alive) return;
  g.alive = false; g.dead = performance.now(); g.cause = cause; g.ko = 0;
  try { VENDOR.noteGuyKill(); } catch (e) {}
  shim();
  setTimeout(() => toeTag(g), 900);
  clearTimeout(g.respawn); g.respawn = setTimeout(() => clearGuy(g), 7500);
}
function nearestJoint(p, x, y) {
  let best = null, bd = 1e9;
  for (const j of guy.joints) { if (j.broken || (j.a !== p && j.b !== p)) continue; const w = anchorWorld(j, j.a === p ? 'a' : 'b'); const d = Math.hypot(w.x - x, w.y - y); if (d < bd) { bd = d; best = j; } }
  return best;
}
function sever(j, why) {
  const g = guy; if (!g || j.broken) return;
  j.broken = true; note(`sever ${j.id} ${why} st${j.maxSt.toFixed(0)}`);
  const wa = anchorWorld(j, 'a'), wb = anchorWorld(j, 'b');
  if (j.c) { try { M.World.remove(world, j.c); } catch (e) {} j.c = null; }
  const la = toLocal(j.a.body, wa.x, wa.y), lb = toLocal(j.b.body, wb.x, wb.y);
  /* the body side gets the artery. the piece that came off bleeds out for a few seconds */
  j.a.stumps.push({ x: la.x, y: la.y, art: j.def.art, t: performance.now(), joint: j.id, nx: la.x, ny: la.y });
  j.b.stumps.push({ x: lb.x, y: lb.y, art: j.def.art * 0.35, t: performance.now(), joint: j.id, nx: lb.x, ny: lb.y, loose: true });
  g.stats.pieces++;
  const v = { x: (wa.x - wb.x), y: (wa.y - wb.y) }, d = Math.hypot(v.x, v.y) || 1;
  bleed((wa.x + wb.x) / 2, (wa.y + wb.y) / 2, -v.y / d, v.x / d, g.dusty ? 30 : 55, 6, Math.PI * 2, 2.2);
  if (!g.dusty) splatBig((wa.x + wb.x) / 2, (wa.y + wb.y) / 2, 18 * S);
  else gibBurst(wa.x, wa.y, 4, 5, ['bone']);
  SND.snap(1.2); SND.squish(1.2);
  connectivity();
  if (j.id === 'neck' && g.alive) die(why === 'lead' ? KILLS.lead : KILLS.decap);
  if (j.id === 'waist') { spillGuts(j.a, la.x, la.y); spillGuts(j.b, lb.x, lb.y); if (g.alive) setTimeout(() => { if (guy === g && g.alive) die(KILLS.halves); }, 1400); }
  if (g.alive) { g.pain += 60; g.shock += 25; scream(1.3); }
}
function connectivity() {
  const g = guy, seen = new Set(['chest']); let grew = true;
  while (grew) { grew = false; for (const j of g.joints) { if (j.broken) continue; if (seen.has(j.a.id) && !seen.has(j.b.id)) { seen.add(j.b.id); grew = true; } } }
  for (const p of g.list) p.attached = seen.has(p.id) && !p.gone;
  shim();
}
function scream(k = 1) {
  const g = guy; if (!g || !g.alive || g.ko > 0 || g.dusty) return;
  const now = performance.now(); if (now - g.scream < 520) return;
  g.scream = now; g.mouth = 1;
  if (!g.parts.head.attached) return;
  const throat = g.parts.chest.stumps.some(s => s.joint === 'neck') || g.parts.head.hp < g.parts.head.max * 0.3;
  SND.scream(g.pitch, clamp(k, 0.4, 1.4), throat || g.blood < 2600);
}
function addWound(p, type, lx, ly, a, s, extra) {
  if (p.wounds.length > 16) { const i = p.wounds.findIndex(w => w.type === 'bruise'); p.wounds.splice(i >= 0 ? i : 0, 1); }
  const w = { type, x: lx, y: ly, a, s, t: performance.now(), seed: Math.random(), bleed: 0, ...extra };
  p.wounds.push(w); return w;
}
/* one hit: what it does depends on the part, how hard, and what with */
function hurt(p, dmg, kind, x, y, dir = { x: 0, y: -1 }) {
  const g = guy; if (!g || p.gone || dmg < 0.6) return;
  if (!g.active) wake(g);
  const b = p.body, L = toLocal(b, x, y), ld = dirLocal(b, dir.x, dir.y), a = Math.atan2(ld.y, ld.x);
  const head = p.kind === 'head', limb = LIMB.has(p.kind);
  p.hp -= dmg; g.stats.hits++;
  if (g.alive) { g.pain = Math.min(200, g.pain + dmg * 2.2); g.shock += dmg * 0.25; }
  const red = g.dusty ? 'dust' : null;
  /* the mark it leaves */
  if (kind === 'blunt') {
    if (dmg > 2) addWound(p, 'bruise', L.x, L.y, a, clamp(dmg * 0.6, 2, 9) * S);
    if (dmg > 6) { addWound(p, 'cut', L.x, L.y, a + Math.PI / 2, clamp(dmg * 0.5, 3, 8) * S, { bleed: dmg * 0.35 }); bleed(x, y, -dir.x, -dir.y - 0.5, Math.round(dmg * 2), 3 + dmg * 0.25, 2.2, 1.6, red); }
    if (dmg > 9 && limb && p.hp < p.max * 0.55 && p.frac.length < 2) { p.frac.push({ y: clamp(L.y, -p.def.wh[1] * S * 0.35, p.def.wh[1] * S * 0.35), side: Math.sign(L.x || 1), out: dmg > 14 }); g.stats.fractures++; SND.crunch(1.2); const pj = g.joints.find(j => j.b === p && !j.broken); if (pj && pj.c) { pj.c.stiffness = 0.4; pj.soft = 1; } if (dmg > 14) addWound(p, 'gash', 0, p.frac[p.frac.length - 1].y, 0, 4 * S, { bleed: 2, bone: true }); }
    if (dmg > 5) SND.squish(clamp(dmg / 14, 0.3, 1.2)); else if (dmg > 2) SND.thud(0.3);
  } else if (kind === 'cut') {
    g.stats.cuts++; p.cuts++;
    addWound(p, p.cuts > 1 && dmg > 6 ? 'gash' : 'cut', L.x, L.y, a, clamp(dmg * 0.9, 4, 12) * S, { bleed: 1.5 + dmg * 0.4, bone: p.cuts > 2 && !head });
    bleed(x, y, -ld.y, ld.x, 18 + dmg * 2, 4, 1.4, 1.5, red); SND.cut();
  } else if (kind === 'bullet') {
    g.stats.shots++;
    addWound(p, 'hole', L.x, L.y, a, 2.4 * S, { bleed: 3 });
    /* the exit is on his back, so it goes on the wall behind him */
    if (!g.dusty) { splatBig(x + rnd(-6, 6), y + rnd(-6, 6), (head ? 26 : 16) * S); bleed(x, y, dir.x, dir.y, 40, 9, 1.1, 1.8); }
    else bleed(x, y, dir.x, dir.y, 30, 6, 1.2, 1.5, 'dust');
    play('flesh', 0.55, () => SND.squish(1));
  } else if (kind === 'blast') {
    p.burnt = Math.min(1, p.burnt + dmg / 60); addWound(p, 'burn', L.x, L.y, a, clamp(dmg * 0.4, 4, 12) * S);
    if (dmg > 18) addWound(p, 'gash', L.x * 0.5, L.y * 0.5, a, 8 * S, { bleed: 4, bone: true });
    bleed(x, y, dir.x, dir.y, Math.round(dmg * 1.5), 6 + dmg * 0.1, 2.6, 2, red);
  }
  if (dmg > 3) scream(dmg / 10);
  /* the head */
  if (head) {
    if (g.hatOn && dmg > 4.5) { g.hatOn = false; const h = gib('hat', b.position.x, b.position.y - 10 * S, rnd(-3, 3) + dir.x * 3, -6, 6); h.col = g.hatCol; }
    if (dmg > 5) { g.ko = Math.max(g.ko, dmg * 0.12); }
    if (dmg > 7 && g.teeth < 6 && !g.dusty) { const n = 1 + Math.floor(Math.random() * 2); g.teeth += n; for (let i = 0; i < n; i++) gib('tooth', x, y, rnd(-4, 4), rnd(-6, -2), 1.1); }
    if (dmg > 9 && p.hp < p.max * 0.6) addWound(p, 'crack', L.x, L.y, a, 7 * S);
    if (dmg > 10 && p.hp < p.max * 0.45) { const e = L.x < 0 ? 0 : 1; if (!g.eyeOut[e]) popEye(e); }
    if (p.hp <= 0 && (kind === 'bullet' || kind === 'blast' || dmg > 20)) { blowHead(kind); return; }
    if (p.hp <= -p.max * 0.35) { blowHead(kind); return; }
  }
  /* the chest: ribs, then the cavity, and the heart in it */
  if (p.kind === 'chest') {
    if (p.hp < p.max * 0.55 && !p.ribs) { p.ribs = { x: clamp(L.x, -3 * S, 3 * S), y: clamp(L.y, -4 * S, 4 * S) }; SND.crunch(1.4); g.stats.fractures += 3; }
    if (p.hp <= 0 && !p.open) { p.open = 1; SND.squish(1.5); bleed(x, y, 0, -1, 60, 6, 2.4, 2.2, red); if (g.alive && (kind === 'bullet' || kind === 'blast')) die(kind === 'bullet' ? KILLS.lead : KILLS.heart); else if (g.alive) setTimeout(() => { if (guy === g && g.alive) die(KILLS.chest); }, 2600); }
  }
  if (p.kind === 'pelvis' && p.hp <= 0 && !p.open) { p.open = 1; spillGuts(p, L.x * 0.4, L.y * 0.4); }
  /* coming apart */
  const breakIt = kind === 'blast' ? dmg > 22 : kind === 'cut' ? (p.cuts >= 3 || p.hp <= 0) : kind === 'bullet' ? p.hp <= 0 && limb : head ? dmg > 24 && p.hp < p.max * 0.3 : (dmg > 16 && p.hp < p.max * 0.5) || p.hp < -p.max * 0.3;
  if (breakIt) {
    if (kind === 'blast' && dmg > 34) { for (const j of g.joints) if (!j.broken && (j.a === p || j.b === p)) sever(j, 'blast'); }
    else if (p.kind === 'chest' || p.kind === 'pelvis') {
      /* the trunk doesn't come apart from a punch: a blade has to be right at a joint */
      const j = nearestJoint(p, x, y);
      if (j && kind === 'cut') { const w = anchorWorld(j, j.a === p ? 'a' : 'b'); if (Math.hypot(w.x - x, w.y - y) < 7 * S) sever(j, 'cut'); else if (p.kind === 'pelvis' && !p.open) { p.open = 1; spillGuts(p, L.x * 0.4, L.y * 0.4); } }
    }
    else { const j = nearestJoint(p, x, y); if (j) sever(j, kind === 'bullet' ? 'lead' : kind); }
  }
  if (kind === 'blast' && dmg > 48 && limb) obliterate(p);
  if (g.alive && kind === 'blast' && dmg > 40 && (p.kind === 'chest' || head)) die(KILLS.blast);
  if (g.alive && head && kind === 'blunt' && p.hp < 0) die(KILLS.blunt);
  if (g.alive && kind === 'bullet' && head && p.hp < p.max * 0.25) die(KILLS.lead);
}
function popEye(e) {
  const g = guy, h = g.parts.head; g.eyeOut[e] = 1;
  const sx = (e ? 0.35 : -0.35) * h.def.r * S, sy = -0.15 * h.def.r * S;
  const at = toWorld(h.body, sx, sy);
  const o = gib('eye', at.x, at.y, rnd(-3, 3), rnd(-4, -1), 2.3);
  o.from = { part: h, x: sx, y: sy };
  o.tether = M.Constraint.create({ bodyA: h.body, pointA: { x: sx, y: sy }, bodyB: o.body, length: 9 * S, stiffness: 0.03, damping: 0.05, render: { visible: false } });
  M.World.add(world, o.tether);
  addWound(h, 'socket', sx, sy, 0, 2.5 * S, { bleed: 2 });
  bleed(at.x, at.y, 0, -1, 20, 3, 2, 1.4); SND.squish(0.8);
}
function blowHead(kind) {
  const g = guy, h = g.parts.head; if (h.gone) return;
  const p = h.body.position, v = h.body.velocity;
  for (const j of g.joints) if (j.b === h && !j.broken) { j.broken = true; if (j.c) { try { M.World.remove(world, j.c); } catch (e) {} j.c = null; } const la = toLocal(j.a.body, anchorWorld(j, 'a').x, anchorWorld(j, 'a').y); j.a.stumps.push({ x: la.x, y: la.y, art: 1.9, t: performance.now(), joint: 'neck', nx: la.x, ny: la.y }); }
  for (const o of gibs) if (o.from && o.from.part === h && o.tether) { try { M.World.remove(world, o.tether); } catch (e) {} o.tether = null; }
  h.gone = true; try { M.World.remove(world, h.body); } catch (e) {}
  if (g.dusty) { gibBurst(p.x, p.y, 9, 7, ['skull', 'bone', 'tooth']); bleed(p.x, p.y, 0, -1, 80, 7, Math.PI * 2, 2.4, 'dust'); }
  else {
    gibBurst(p.x, p.y, 6, 8, ['skull']); gibBurst(p.x, p.y, 5, 7, ['brain']); gibBurst(p.x, p.y, 4, 6, ['meat']); gibBurst(p.x, p.y, 3, 7, ['tooth']);
    for (let e = 0; e < 2; e++) if (!g.eyeOut[e]) { g.eyeOut[e] = 1; gib('eye', p.x + (e ? 4 : -4), p.y, rnd(-6, 6), rnd(-8, -3), 2.3); }
    bleed(p.x, p.y, v.x, v.y - 1, 180, 10, Math.PI * 2, 2.6); splatBig(p.x, p.y, 46 * S);
  }
  if (g.hatOn) { g.hatOn = false; const ht = gib('hat', p.x, p.y - 8, rnd(-4, 4), -9, 6); ht.col = g.hatCol; }
  SND.squish(1.6); SND.crunch(1.6); SND.splat(1.5);
  g.stats.pieces++; connectivity();
  if (g.alive) die(kind === 'bullet' ? KILLS.lead : kind === 'blast' ? KILLS.blast : KILLS.head);
}
function obliterate(p) {
  if (p.gone) return;
  const g = guy, pos = p.body.position;
  for (const j of g.joints) if (!j.broken && (j.a === p || j.b === p)) sever(j, 'blast');
  p.gone = true; try { M.World.remove(world, p.body); } catch (e) {}
  gibBurst(pos.x, pos.y, 5, 9, g.dusty ? ['bone'] : ['meat', 'meat', 'bone']);
  connectivity();
}

/* ------------------------------------------------------------ collisions */
M.Events.on(engine, 'collisionStart', ev => {
  const now = performance.now();
  for (const pr of ev.pairs) {
    const A = pr.bodyA, Bb = pr.bodyB;
    const pa = A.plugin && A.plugin.part, pb = Bb.plugin && Bb.plugin.part;
    /* gibs and guts leave a smear where they land */
    const ga = A.plugin && A.plugin.gib, gb = Bb.plugin && Bb.plugin.gib;
    for (const [o, other] of [[ga, Bb], [gb, A]]) if (o && !o.dust && o.type !== 'hat' && o.type !== 'tooth') { const sp = Math.hypot(o.body.velocity.x, o.body.velocity.y); if (sp > 2.5 && other.label === 'wall') { const c = pr.collision.supports && pr.collision.supports[0] || o.body.position; stamp(c.x, c.y, rnd(1.5, 3.2) * (o.type === 'brain' ? 1.4 : 1), o.body.velocity.x, o.body.velocity.y, o.type === 'brain' ? '#a8505a' : null); if (sp > 5) SND.splat(0.4); } }
    const p = pa || pb; if (!p || !guy || p.body.plugin.guy !== guy) continue;
    const self = p === pa ? A : Bb, other = p === pa ? Bb : A;
    if (other.plugin && (other.plugin.part || other.plugin.gib)) continue;
    if (other.plugin && other.plugin.tnt) continue;
    const n = pr.collision.normal, rv = { x: self.velocity.x - (other.isStatic ? 0 : other.velocity.x), y: self.velocity.y - (other.isStatic ? 0 : other.velocity.y) };
    const v = Math.abs(rv.x * n.x + rv.y * n.y);
    const heavy = other.isStatic ? 1 : clamp((other.mass || 10) / 8, 0.8, 2);
    const dmg = (v - 4) * 1.0 * heavy;
    if (dmg < 0.8 || now - p.cool < 90) continue;
    p.cool = now;
    const c = pr.collision.supports && pr.collision.supports[0] || self.position;
    hurt(p, dmg, 'blunt', c.x, c.y, { x: -rv.x / (v || 1), y: -rv.y / (v || 1) });
    if (dmg > 4 && !guy.dusty) stamp(c.x, c.y, clamp(dmg * 0.35, 1.5, 6), rv.x, rv.y);
  }
});

/* ------------------------------------------------------------ every physics tick */
let lastBeat = 0;
M.Events.on(engine, 'afterUpdate', () => {
  const g = guy, now = performance.now(), dt = 1 / 60;
  if (g && g.active) {
    /* the joints: stretch them far enough and they give */
    for (const j of g.joints) {
      if (j.broken || !j.c) continue;
      const a = anchorWorld(j, 'a'), b = anchorWorld(j, 'b'), d = Math.hypot(a.x - b.x, a.y - b.y), lim = 10 * S;
      if (d > j.maxSt) j.maxSt = d;
      if (d > lim) { j.hp -= (d - lim) * 0.3; if (Math.random() < 0.05) SND.crunch(0.3); if (d > lim * 1.6 && Math.random() < 0.3) bleed(b.x, b.y, 0, 0, 2, 1.5, Math.PI * 2, 1.2); }
      if (j.hp <= 0) { sever(j, 'torn'); if (g.alive) g.pain += 40; }
    }
    /* the heart */
    if (g.alive) {
      const lowBlood = 1 - g.blood / 5000;
      g.bpm += ((70 + Math.min(110, g.pain * 0.7) + lowBlood * 60 - (lowBlood > 0.6 ? (lowBlood - 0.6) * 300 : 0)) - g.bpm) * 0.02;
      g.pain *= 0.997; g.shock *= 0.997; g.ko = Math.max(0, g.ko - dt);
      if (g.shock > 140 && g.alive) die(KILLS.shock);
      if (!g.dusty && g.blood < 1400) die(KILLS.bleed);
    } else g.bpm *= 0.985;
    g.beat += g.bpm / 60 * dt;
    if (g.beat >= 1) { g.beat -= 1; g.pulse = 1; if (g.alive && !g.dusty && g.blood < 2800 && now - lastBeat > 300) { lastBeat = now; SND.heart(); } }
    g.pulse *= 0.86;
    g.mouth *= 0.95;
    /* bleeding: arteries in pulses, wounds in a steady run, everything slower as he empties */
    const pressure = g.dusty ? 0 : clamp(g.blood / 5000, 0, 1) * (g.alive ? 1 : 0.15);
    let rate = 0;
    for (const p of g.list) {
      if (p.gone) continue;
      const b = p.body, down = dirLocal(b, 0, 1);
      for (const w of p.wounds) {
        if (!w.bleed || g.dusty) continue;
        w.bleed *= 0.9985; if (w.bleed < 0.05) { w.bleed = 0; continue; }
        const r = w.bleed * (0.25 + 0.75 * pressure); rate += r;
        if (Math.random() < r * 0.06) { const at = toWorld(b, w.x, w.y); particles.push({ x: at.x, y: at.y, vx: b.velocity.x * 0.5 + rnd(-0.3, 0.3), vy: b.velocity.y * 0.5 + rnd(0, 0.5), r: rnd(0.8, 1.8), life: rnd(30, 70), c: pick(BLOOD) }); }
      }
      for (const s of p.stumps) {
        const age = (now - s.t) / 1000, k = s.loose ? Math.max(0, 1 - age / 6) : 1;
        if (k <= 0) continue;
        const at = toWorld(b, s.x, s.y), nd = Math.hypot(s.nx, s.ny) || 1, nw = { x: (Math.cos(b.angle) * s.nx - Math.sin(b.angle) * s.ny) / nd, y: (Math.sin(b.angle) * s.nx + Math.cos(b.angle) * s.ny) / nd };
        const r = s.art * 50 * k * (0.2 + pressure); rate += s.loose ? 0 : r;
        if (g.dusty) { if (Math.random() < 0.15 * k) bleed(at.x, at.y, nw.x, nw.y, 1, 1.5, 1, 1.2, 'dust'); continue; }
        /* the spurt: on the beat, harder with more blood in him */
        const jet = (s.loose ? 0.2 : 1) * s.art * pressure * g.pulse;
        if (jet > 0.08) { const n = Math.ceil(jet * 3); for (let i = 0; i < n; i++) { const sp = 2 + 9 * jet * rnd(0.7, 1.1); particles.push({ x: at.x, y: at.y, vx: nw.x * sp + b.velocity.x + rnd(-0.6, 0.6), vy: nw.y * sp + b.velocity.y + rnd(-0.6, 0.6), r: rnd(1.1, 2.3), life: rnd(50, 110), c: pick(BLOOD) }); } if (g.pulse > 0.95 && jet > 0.5 && Math.random() < 0.3) SND.spurt(jet); }
        else if (Math.random() < 0.25 * k * (0.3 + pressure)) particles.push({ x: at.x, y: at.y, vx: b.velocity.x + rnd(-0.3, 0.3), vy: b.velocity.y + rnd(0, 0.6), r: rnd(0.9, 1.9), life: rnd(30, 80), c: pick(BLOOD) });
      }
      /* he moves: flailing while he's awake and in the air, twitches after */
      if (!p.attached) continue;
      if (g.alive && g.ko <= 0 && LIMB.has(p.kind) && Math.random() < 0.02 + Math.min(0.05, g.pain / 3000)) B.setAngularVelocity(b, b.angularVelocity + rnd(-0.12, 0.12) * (1 + g.pain / 80));
      if (!g.alive && now - g.dead < 3500 && Math.random() < 0.01) B.setAngularVelocity(b, b.angularVelocity + rnd(-0.2, 0.2));
    }
    if (!g.dusty) { const lost = rate * dt; g.blood = Math.max(0, g.blood - lost); g.lost += lost; }
    if (g.alive && g.pain > 30 && Math.random() < 0.004) SND.whimper(g.pitch);
    /* the eyes follow the cursor */
    const h = g.parts.head; if (!h.gone) { const l = dirLocal(h.body, pointer.x - h.body.position.x, pointer.y - h.body.position.y), m = Math.hypot(l.x, l.y) || 1; g.look[0] += (l.x / m - g.look[0]) * 0.2; g.look[1] += (l.y / m - g.look[1]) * 0.2; }
    shim();
  }
  /* guts: pull hard enough and they come out of him altogether */
  for (const gt of guts) if (gt.anchor) { const a = toWorld(gt.part.body, gt.anchor.pointA.x, gt.anchor.pointA.y), b = gt.links[0].position; if (gt.part.gone || Math.hypot(a.x - b.x, a.y - b.y) > 32 * S) { try { M.World.remove(world, gt.anchor); } catch (e) {} gt.anchor = null; SND.squish(1); bleed(a.x, a.y, 0, 0, 25, 3, Math.PI * 2, 1.6); } }
  /* eyes on their nerve */
  for (const o of gibs) if (o.tether && o.from) { const a = toWorld(o.from.part.body, o.from.x, o.from.y), b = o.body.position; if (Math.hypot(a.x - b.x, a.y - b.y) > 30 * S) { try { M.World.remove(world, o.tether); } catch (e) {} o.tether = null; SND.squish(0.5); } }
  /* blood in the air */
  const w = W(), hh = H();
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.vy += p.dust ? 0.12 : 0.26; p.vx *= p.dust ? 0.96 : 0.99; p.vy *= p.dust ? 0.96 : 0.995; p.x += p.vx; p.y += p.vy; p.life--;
    if (p.y >= hh - 1) { if (!p.dust) { stamp(p.x, hh - 1.5, p.r * 1.2, p.vx, 0, p.c, 0.8, true); if (p.r > 1.6 && Math.random() < 0.05) SND.splat(0.15); } particles.splice(i, 1); continue; }
    if (p.x <= 1 || p.x >= w - 1 || p.y <= 1) { if (!p.dust) { stamp(clamp(p.x, 1, w - 1), Math.max(1, p.y), p.r * 1.3, p.vx, p.vy, p.c); if (p.r > 1.7 && Math.random() < 0.3) drip(clamp(p.x, 2, w - 2), p.y, p.r * 0.7, p.c); } particles.splice(i, 1); continue; }
    if (p.life <= 0) { if (!p.dust) { stamp(p.x, p.y, p.r, p.vx, p.vy, p.c, 0.75); if (p.r > 2 && Math.random() < 0.12) drip(p.x, p.y, p.r * 0.55, p.c); } particles.splice(i, 1); }
  }
  /* drips run down the glass */
  for (let i = drips.length - 1; i >= 0; i--) {
    const d = drips[i]; dctx.strokeStyle = d.c; dctx.lineWidth = d.w; dctx.lineCap = 'round'; dctx.globalAlpha = 0.8;
    dctx.beginPath(); dctx.moveTo(d.x, d.y); d.y += d.v; d.x += rnd(-0.08, 0.08); dctx.lineTo(d.x, d.y); dctx.stroke(); dctx.globalAlpha = 1;
    d.left -= d.v; d.v *= 0.997; d.w *= 0.998;
    if (d.left <= 0 || d.y >= hh - 2 || d.v < 0.05) { dctx.fillStyle = d.c; dctx.beginPath(); dctx.arc(d.x, d.y, d.w * 0.9, 0, Math.PI * 2); dctx.fill(); drips.splice(i, 1); }
  }
  /* effects */
  for (let i = fx.length - 1; i >= 0; i--) { const f = fx[i]; f.t++; if (f.t > f.life) fx.splice(i, 1); }
  for (let i = smoke.length - 1; i >= 0; i--) { const s = smoke[i]; s.x += s.vx; s.y += s.vy; s.vx *= 0.98; s.vy = s.vy * 0.98 - 0.02; s.r += 0.35; s.life--; if (s.life <= 0) smoke.splice(i, 1); }
  /* dynamite fuses */
  for (let i = tnts.length - 1; i >= 0; i--) { const t = tnts[i]; t.fuse -= dt * (slowmo ? 0.3 : 1); const tip = toWorld(t.body, 0, -12 * S); if (Math.random() < 0.7) fx.push({ kind: 'spark', x: tip.x, y: tip.y, vx: rnd(-1.5, 1.5), vy: rnd(-2, 0.5), t: 0, life: 12 }); if (t.fuse <= 0) { tnts.splice(i, 1); explode(t); } }
  /* gibs age out */
  for (let i = gibs.length - 1; i >= 0; i--) { const o = gibs[i]; if (now - o.born > 30000) { try { M.World.remove(world, o.body); } catch (e) {} if (o.tether) try { M.World.remove(world, o.tether); } catch (e) {} gibs.splice(i, 1); } }
  if (slowmo && now > slowmo) { slowmo = 0; engine.timing.timeScale = 1; render.canvas.style.filter = ''; }
});

/* ------------------------------------------------------------ drawing */
function hsl(a, k = 0) { return `hsl(${a[0]},${a[1] * (1 - k * 0.8)}%,${a[2] + (82 - a[2]) * k * 0.4}%)`; }
function shape(ctx, p) { const d = p.def; ctx.beginPath(); if (d.r) ctx.arc(0, 0, d.r * S, 0, Math.PI * 2); else { const w = d.wh[0] * S, h = d.wh[1] * S, r = Math.min(w, h) * 0.45; ctx.roundRect ? ctx.roundRect(-w / 2, -h / 2, w, h, r) : ctx.rect(-w / 2, -h / 2, w, h); } }
function srand(seed) { let s = Math.floor(seed * 1e9) || 1; return () => { s = (s * 16807) % 2147483647; return s / 2147483647; }; }
function drawWound(ctx, p, w, down, g) {
  const R = srand(w.seed), age = Math.min(1, (performance.now() - w.t) / 9000);
  ctx.save(); ctx.translate(w.x, w.y);
  const bloodCol = g.dusty ? '#8a7450' : '#5a0404';
  switch (w.type) {
    case 'bruise': { const gr = ctx.createRadialGradient(0, 0, 0, 0, 0, w.s); gr.addColorStop(0, `rgba(80,30,90,${0.55 + age * 0.2})`); gr.addColorStop(0.6, `rgba(60,40,90,${0.3})`); gr.addColorStop(1, 'rgba(60,40,90,0)'); ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(0, 0, w.s, 0, Math.PI * 2); ctx.fill(); break; }
    case 'cut': case 'gash': {
      const L = w.s, wd = w.type === 'gash' ? 2.6 * S : 1.1 * S;
      ctx.rotate(w.a);
      if (!g.dusty) { ctx.fillStyle = 'rgba(110,0,0,0.45)'; ctx.beginPath(); ctx.ellipse(0, 0, L * 0.7, wd * 2.4, 0, 0, Math.PI * 2); ctx.fill(); }
      ctx.fillStyle = g.dusty ? '#3a2a1a' : '#7a0a0a'; ctx.beginPath(); ctx.moveTo(-L / 2, 0); for (let i = 1; i < 6; i++) ctx.lineTo(-L / 2 + L * i / 6, -wd * (0.6 + R() * 0.5)); ctx.lineTo(L / 2, 0); for (let i = 5; i > 0; i--) ctx.lineTo(-L / 2 + L * i / 6, wd * (0.6 + R() * 0.5)); ctx.closePath(); ctx.fill();
      if (w.type === 'gash') { ctx.fillStyle = '#e8c870'; ctx.fillRect(-L * 0.38, -wd * 0.45, L * 0.76, wd * 0.18); ctx.fillStyle = '#300000'; ctx.fillRect(-L * 0.36, -wd * 0.25, L * 0.72, wd * 0.5); }
      if (w.bone) { ctx.fillStyle = '#efe8d8'; ctx.fillRect(-L * 0.3, -wd * 0.12, L * 0.6, wd * 0.28); }
      ctx.rotate(-w.a); break;
    }
    case 'hole': { ctx.fillStyle = '#5a0606'; ctx.beginPath(); ctx.arc(0, 0, w.s * 1.25, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#0a0000'; ctx.beginPath(); ctx.arc(0, 0, w.s * 0.6, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = 'rgba(30,20,20,0.6)'; ctx.lineWidth = 0.6; ctx.beginPath(); ctx.arc(0, 0, w.s * 1.6, 0, Math.PI * 2); ctx.stroke(); break; }
    case 'socket': { ctx.fillStyle = '#2a0000'; ctx.beginPath(); ctx.arc(0, 0, w.s, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#8a1010'; ctx.beginPath(); ctx.arc(w.s * 0.2, w.s * 0.25, w.s * 0.45, 0, Math.PI * 2); ctx.fill(); break; }
    case 'burn': { for (let i = 0; i < 6; i++) { ctx.fillStyle = `rgba(${20 + R() * 30},${10 + R() * 12},5,${0.5 + R() * 0.35})`; ctx.beginPath(); ctx.arc((R() - 0.5) * w.s * 1.6, (R() - 0.5) * w.s * 1.6, w.s * (0.3 + R() * 0.5), 0, Math.PI * 2); ctx.fill(); } break; }
    case 'crack': { ctx.strokeStyle = '#2a1010'; ctx.lineWidth = 0.9; ctx.beginPath(); for (let k = 0; k < 3; k++) { let x = 0, y = 0, a = R() * Math.PI * 2; ctx.moveTo(0, 0); for (let i = 0; i < 4; i++) { a += (R() - 0.5) * 1.4; x += Math.cos(a) * w.s * 0.3; y += Math.sin(a) * w.s * 0.3; ctx.lineTo(x, y); } } ctx.stroke(); break; }
  }
  /* blood runs downhill from anything open, whichever way up he is */
  if (w.bleed > 0.1 || (w.type !== 'bruise' && w.type !== 'burn' && w.type !== 'crack' && !g.dusty)) {
    const len = Math.min(18 * S, (performance.now() - w.t) / 120) * (g.dusty ? 0 : 1);
    if (len > 1) { ctx.strokeStyle = bloodCol; ctx.globalAlpha = 0.75; ctx.lineWidth = 1.1 * S; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(down.x * len * 0.5 + (R() - 0.5) * 3, down.y * len * 0.5, down.x * len, down.y * len); ctx.stroke(); ctx.globalAlpha = 1; }
  }
  ctx.restore();
}
function drawStump(ctx, s, g) {
  const r = 3.4 * S; ctx.save(); ctx.translate(s.x, s.y);
  ctx.fillStyle = g.dusty ? '#6a5a40' : '#8a0c0c'; ctx.beginPath(); for (let i = 0; i < 9; i++) { const a = i / 9 * Math.PI * 2, rr = r * (0.8 + ((i * 37) % 5) / 10); ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); } ctx.closePath(); ctx.fill();
  if (!g.dusty) { ctx.fillStyle = '#c03030'; ctx.beginPath(); ctx.arc(-r * 0.25, -r * 0.2, r * 0.45, 0, Math.PI * 2); ctx.fill(); }
  ctx.fillStyle = '#efe8d8'; ctx.beginPath(); ctx.arc(r * 0.15, 0, r * 0.42, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#a03a3a'; ctx.beginPath(); ctx.arc(r * 0.15, 0, r * 0.16, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}
function drawFace(ctx, p, g) {
  const r = p.def.r * S, dead = !g.alive, out = g.ko > 0;
  const lx = g.look[0] * r * 0.09, ly = g.look[1] * r * 0.09;
  for (let e = 0; e < 2; e++) {
    const ex = (e ? 0.35 : -0.35) * r, ey = -0.15 * r;
    if (g.eyeOut[e]) continue;
    ctx.fillStyle = g.dusty ? '#1a1410' : '#fff'; ctx.beginPath(); ctx.arc(ex, ey, r * 0.22, 0, Math.PI * 2); ctx.fill();
    if (g.dusty) continue;
    ctx.strokeStyle = '#000'; ctx.lineWidth = 0.8; ctx.stroke();
    if (dead) { ctx.strokeStyle = '#111'; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(ex - r * 0.14, ey - r * 0.14); ctx.lineTo(ex + r * 0.14, ey + r * 0.14); ctx.moveTo(ex + r * 0.14, ey - r * 0.14); ctx.lineTo(ex - r * 0.14, ey + r * 0.14); ctx.stroke(); }
    else if (out) { ctx.strokeStyle = '#111'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(ex - r * 0.16, ey); ctx.lineTo(ex + r * 0.16, ey); ctx.stroke(); }
    else { const cross = p.hp < p.max * 0.5 ? (e ? -1 : 1) * r * 0.06 : 0; ctx.fillStyle = '#111'; ctx.beginPath(); ctx.arc(ex + lx + cross, ey + ly, r * 0.1, 0, Math.PI * 2); ctx.fill(); if (g.pain > 60) { ctx.strokeStyle = 'rgba(200,30,30,0.6)'; ctx.lineWidth = 0.5; ctx.beginPath(); ctx.moveTo(ex - r * 0.2, ey); ctx.lineTo(ex - r * 0.08, ey + r * 0.03); ctx.stroke(); } }
  }
  /* brows */
  if (!dead && !g.dusty) { const k = clamp(g.pain / 80, 0, 1); ctx.strokeStyle = '#2a1a10'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(-r * 0.55, -r * 0.42 + k * r * 0.1); ctx.lineTo(-r * 0.18, -r * 0.42 - k * r * 0.12); ctx.moveTo(r * 0.55, -r * 0.42 + k * r * 0.1); ctx.lineTo(r * 0.18, -r * 0.42 - k * r * 0.12); ctx.stroke(); }
  /* the mouth */
  const open = dead ? 0.5 : Math.max(g.mouth, clamp(g.pain / 120, 0, 0.7));
  ctx.fillStyle = '#2a0606'; ctx.beginPath(); ctx.ellipse(0, r * 0.45, r * (0.18 + open * 0.14), r * (0.05 + open * 0.26), 0, 0, Math.PI * 2); ctx.fill();
  if (open > 0.25) { ctx.fillStyle = '#f0ead8'; const n = 4; for (let i = 0; i < n; i++) if (i >= g.teeth / 1.5) ctx.fillRect(-r * 0.15 + i * r * 0.08, r * 0.45 - r * (0.05 + open * 0.26) + 0.3, r * 0.06, r * 0.08); }
  /* nose and mouth bleed when his head has had enough */
  if (!g.dusty && p.hp < p.max * 0.8) { ctx.strokeStyle = '#7a0606'; ctx.lineWidth = 1.2 * S; ctx.beginPath(); ctx.moveTo(-r * 0.05, r * 0.15); ctx.lineTo(-r * 0.08, r * 0.38); ctx.moveTo(r * 0.12, r * 0.55); ctx.lineTo(r * 0.16, r * 0.85); ctx.stroke(); }
  /* the skull showing through, and the brain through that */
  if (p.hp < p.max * 0.4) { ctx.fillStyle = '#efe8d8'; ctx.beginPath(); ctx.arc(-r * 0.35, -r * 0.62, r * 0.35, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = '#8a1010'; ctx.lineWidth = 1; ctx.stroke(); }
  if (p.hp < p.max * 0.15 && !g.dusty) { ctx.fillStyle = '#d88a92'; ctx.beginPath(); ctx.arc(-r * 0.38, -r * 0.62, r * 0.2, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = '#9a4a52'; ctx.lineWidth = 0.6; ctx.beginPath(); ctx.arc(-r * 0.42, -r * 0.6, r * 0.09, 0, Math.PI); ctx.arc(-r * 0.32, -r * 0.66, r * 0.07, Math.PI, 0); ctx.stroke(); }
  if (out && !dead) { const t = performance.now() / 300; ctx.fillStyle = '#ffe14a'; for (let i = 0; i < 3; i++) { const a = t + i * 2.09; ctx.beginPath(); ctx.arc(Math.cos(a) * r * 0.9, -r * 1.1 + Math.sin(a) * r * 0.25, 1.4, 0, Math.PI * 2); ctx.fill(); } }
}
function drawHat(ctx, r, col) { ctx.fillStyle = col; ctx.strokeStyle = '#000'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.ellipse(0, -r * 0.7, r * 1.55, r * 0.32, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-r * 0.75, -r * 0.75); ctx.quadraticCurveTo(-r * 0.85, -r * 1.75, -r * 0.2, -r * 1.55); ctx.quadraticCurveTo(0, -r * 1.35, r * 0.2, -r * 1.55); ctx.quadraticCurveTo(r * 0.85, -r * 1.75, r * 0.75, -r * 0.75); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.fillRect(-r * 0.75, -r * 0.95, r * 1.5, r * 0.18); }
function drawPart(ctx, p, g) {
  const b = p.body, d = p.def, k = g.dusty ? 0 : clamp((1 - g.blood / 5000) * 1.3 + (g.alive ? 0 : 0.25), 0, 1);
  ctx.save(); ctx.translate(b.position.x, b.position.y); ctx.rotate(b.angle);
  const down = dirLocal(b, 0, 1);
  /* what he's wearing on that bit */
  let fill = g.dusty ? '#e8e0cc' : hsl(g.skin, k);
  if (!g.dusty) { if (p.kind === 'chest' || p.kind === 'uarm') fill = g.shirt; if (p.kind === 'pelvis' || p.kind === 'uleg' || p.kind === 'lleg') fill = g.pants; }
  if (g.dusty && (p.kind === 'chest' || p.kind === 'pelvis')) fill = '#8a7a60';
  shape(ctx, p); ctx.fillStyle = fill; ctx.fill();
  ctx.save(); shape(ctx, p); ctx.clip();
  if (g.dusty && d.wh) { ctx.strokeStyle = '#c8bca0'; ctx.lineWidth = 1; for (let y = -d.wh[1] * S / 2 + 3; y < d.wh[1] * S / 2; y += 4) { ctx.beginPath(); ctx.moveTo(-d.wh[0] * S / 2, y); ctx.lineTo(d.wh[0] * S / 2, y); ctx.stroke(); } }
  /* boots, a belt, a collar: the small stuff */
  if (!g.dusty && p.kind === 'lleg') { ctx.fillStyle = g.boots; ctx.fillRect(-d.wh[0] * S / 2, d.wh[1] * S * 0.12, d.wh[0] * S, d.wh[1] * S); }
  if (!g.dusty && p.kind === 'pelvis') { ctx.fillStyle = '#2a1a0e'; ctx.fillRect(-d.wh[0] * S / 2, -d.wh[1] * S / 2, d.wh[0] * S, 2.4 * S); ctx.fillStyle = '#c8a040'; ctx.fillRect(-1.6 * S, -d.wh[1] * S / 2 + 0.2, 3.2 * S, 2 * S); }
  if (!g.dusty && p.kind === 'chest') { ctx.fillStyle = hsl(g.skin, k); ctx.beginPath(); ctx.moveTo(-3 * S, -d.wh[1] * S / 2); ctx.lineTo(0, -d.wh[1] * S / 2 + 4 * S); ctx.lineTo(3 * S, -d.wh[1] * S / 2); ctx.fill(); ctx.strokeStyle = 'rgba(0,0,0,0.35)'; ctx.lineWidth = 0.8; ctx.beginPath(); ctx.moveTo(0, -d.wh[1] * S / 2 + 4 * S); ctx.lineTo(0, d.wh[1] * S / 2); ctx.stroke(); }
  if (p.burnt) { ctx.fillStyle = `rgba(20,12,6,${p.burnt * 0.55})`; ctx.fillRect(-30, -30, 60, 60); }
  /* torn clothes under the cuts show skin */
  for (const w of p.wounds) if ((w.type === 'cut' || w.type === 'gash' || w.type === 'hole') && fill !== hsl(g.skin, k) && !g.dusty) { ctx.fillStyle = hsl(g.skin, k); ctx.save(); ctx.translate(w.x, w.y); ctx.rotate(w.a); ctx.beginPath(); const L = w.s * 0.7; ctx.moveTo(-L, 0); ctx.lineTo(-L * 0.4, -2.6 * S); ctx.lineTo(L * 0.2, -1.8 * S); ctx.lineTo(L, 0); ctx.lineTo(L * 0.3, 2.4 * S); ctx.lineTo(-L * 0.5, 2 * S); ctx.closePath(); ctx.fill(); ctx.restore(); }
  for (const w of p.wounds) drawWound(ctx, p, w, down, g);
  /* the ribs, the open chest, the heart that's still going */
  if (p.ribs || p.open) {
    const o = p.ribs || { x: 0, y: 0 }, rw = (p.open ? 6 : 4.2) * S, rh = (p.open ? 7 : 4.6) * S;
    ctx.fillStyle = g.dusty ? '#2a2016' : '#4a0404'; ctx.beginPath(); ctx.ellipse(o.x, o.y, rw, rh, 0, 0, Math.PI * 2); ctx.fill();
    if (p.kind === 'chest' && p.open && !g.dusty) { const beat = 1 + g.pulse * 0.22; ctx.fillStyle = g.alive ? '#a01010' : '#5a0a0a'; ctx.save(); ctx.translate(o.x + 1.2 * S, o.y); ctx.scale(beat, beat); ctx.beginPath(); ctx.moveTo(0, 2.6 * S); ctx.bezierCurveTo(-3.4 * S, -0.4 * S, -1.8 * S, -3 * S, 0, -1.2 * S); ctx.bezierCurveTo(1.8 * S, -3 * S, 3.4 * S, -0.4 * S, 0, 2.6 * S); ctx.fill(); ctx.restore(); }
    if (p.kind === 'pelvis' && p.open && !g.dusty) { ctx.fillStyle = '#c7737a'; for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.arc(o.x + (i % 2 ? 2 : -2) * S, o.y + (i - 1.5) * 2.2 * S, 2 * S, 0, Math.PI * 2); ctx.fill(); } }
    if (p.kind === 'chest') { ctx.strokeStyle = '#efe8d8'; ctx.lineWidth = 1.3 * S; for (let i = 0; i < 4; i++) { const y = o.y - rh * 0.65 + i * rh * 0.42; ctx.beginPath(); ctx.moveTo(o.x - rw * 0.95, y); ctx.quadraticCurveTo(o.x, y + 1.6 * S, o.x + rw * (p.open && i % 2 ? 0.2 : 0.95), y - (p.open && i % 2 ? 1 : 0)); ctx.stroke(); } }
  }
  /* compound fractures: the bone comes out through the side */
  for (const f of p.frac) if (f.out) { ctx.fillStyle = '#efe8d8'; ctx.strokeStyle = '#7a0a0a'; ctx.lineWidth = 0.8; ctx.beginPath(); ctx.moveTo(-1.2 * S * f.side, f.y - 1.5 * S); ctx.lineTo(d.wh[0] * S * 0.9 * f.side, f.y - 3.2 * S); ctx.lineTo(d.wh[0] * S * 0.75 * f.side, f.y - 1.8 * S); ctx.lineTo(1.2 * S * f.side, f.y + 1.3 * S); ctx.closePath(); ctx.fill(); ctx.stroke(); }
  ctx.restore();
  shape(ctx, p); ctx.strokeStyle = '#000'; ctx.lineWidth = 1.5; ctx.stroke();
  for (const f of p.frac) if (!f.out) { ctx.strokeStyle = 'rgba(0,0,0,0.7)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(-d.wh[0] * S / 2, f.y); ctx.lineTo(0, f.y + 1.5); ctx.lineTo(d.wh[0] * S / 2, f.y - 1); ctx.stroke(); }
  /* the ends: hands, stumps, the face */
  if (p.kind === 'larm') { ctx.fillStyle = g.dusty ? '#e8e0cc' : hsl(g.skin, k); ctx.strokeStyle = '#000'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(0, d.wh[1] * S / 2 + 1.5 * S, 3 * S, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); }
  for (const s of p.stumps) drawStump(ctx, s, g);
  if (p.kind === 'head') { drawFace(ctx, p, g); if (g.hatOn && g.hat) drawHat(ctx, d.r * S, g.hatCol); }
  ctx.restore();
}
function drawGib(ctx, o) {
  const b = o.body, r = o.r, R = srand(o.seed);
  ctx.save(); ctx.translate(b.position.x, b.position.y); ctx.rotate(b.angle);
  const age = (performance.now() - o.born) / 30000; if (age > 0.85) ctx.globalAlpha = Math.max(0, (1 - age) / 0.15);
  ctx.strokeStyle = '#000'; ctx.lineWidth = 0.8;
  switch (o.type) {
    case 'meat': ctx.fillStyle = o.dust ? '#8a7450' : '#8a1414'; ctx.beginPath(); b.vertices.forEach((v, i) => { const x = v.x - b.position.x, y = v.y - b.position.y, c = Math.cos(-b.angle), s = Math.sin(-b.angle); ctx[i ? 'lineTo' : 'moveTo'](x * c - y * s, x * s + y * c); }); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.fillStyle = '#c84a4a'; ctx.beginPath(); ctx.arc(-r * 0.2, -r * 0.2, r * 0.35, 0, Math.PI * 2); ctx.fill(); if (R() < 0.5) { ctx.fillStyle = '#e8c870'; ctx.fillRect(r * 0.1, -r * 0.5, r * 0.4, r * 0.25); } break;
    case 'bone': ctx.fillStyle = '#efe8d8'; ctx.beginPath(); ctx.moveTo(-r * 1.3, -r * 0.3); ctx.lineTo(r * 1.3, -r * 0.5); ctx.lineTo(r * 1.1, r * 0.4); ctx.lineTo(-r * 1.2, r * 0.3); ctx.closePath(); ctx.fill(); ctx.stroke(); if (!o.dust) { ctx.fillStyle = '#9a1a1a'; ctx.fillRect(-r * 1.3, -r * 0.3, r * 0.4, r * 0.6); } break;
    case 'skull': ctx.fillStyle = '#efe8d8'; ctx.beginPath(); ctx.arc(0, 0, r * 1.2, Math.PI * 1.1, Math.PI * 1.9); ctx.lineTo(r * 0.6, r * 0.3); ctx.lineTo(-r * 0.7, r * 0.4); ctx.closePath(); ctx.fill(); ctx.stroke(); if (!o.dust) { ctx.fillStyle = '#c8907a'; ctx.beginPath(); ctx.arc(0, -r * 0.5, r * 0.6, Math.PI * 1.15, Math.PI * 1.85); ctx.lineTo(0, -r * 0.4); ctx.fill(); ctx.fillStyle = '#8a1010'; ctx.fillRect(-r * 0.6, r * 0.1, r * 1.1, r * 0.25); } break;
    case 'brain': ctx.fillStyle = '#d88a92'; ctx.beginPath(); ctx.arc(0, 0, r * 1.1, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = '#9a4a52'; ctx.lineWidth = 0.8; ctx.beginPath(); ctx.arc(-r * 0.3, -r * 0.2, r * 0.4, 0, Math.PI); ctx.arc(r * 0.3, r * 0.1, r * 0.35, Math.PI, 0); ctx.stroke(); break;
    case 'eye': { ctx.fillStyle = '#f8f6f0'; ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); ctx.fillStyle = '#3a6aa0'; ctx.beginPath(); ctx.arc(r * 0.35, 0, r * 0.45, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#000'; ctx.beginPath(); ctx.arc(r * 0.45, 0, r * 0.2, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = 'rgba(200,30,30,0.7)'; ctx.lineWidth = 0.5; ctx.beginPath(); ctx.moveTo(-r, 0); ctx.lineTo(-r * 0.3, r * 0.3); ctx.moveTo(-r * 0.8, -r * 0.5); ctx.lineTo(-r * 0.2, -r * 0.1); ctx.stroke(); break; }
    case 'tooth': ctx.fillStyle = '#f4f0e0'; ctx.fillRect(-r * 0.7, -r, r * 1.4, r * 2); ctx.fillStyle = '#8a1010'; ctx.fillRect(-r * 0.7, r * 0.6, r * 1.4, r * 0.4); break;
    case 'hat': ctx.translate(0, r * 0.9); drawHat(ctx, r * 0.7, o.col || '#5a3a1e'); break;
    case 'weed': { ctx.strokeStyle = '#8a6a3a'; ctx.lineWidth = 1.2; ctx.beginPath(); for (let i = 0; i < 26; i++) { const a = R() * Math.PI * 2, a2 = a + R() * 2.5, rr = r * (0.5 + R() * 0.5); ctx.moveTo(Math.cos(a) * rr, Math.sin(a) * rr); ctx.quadraticCurveTo(0, 0, Math.cos(a2) * r, Math.sin(a2) * r); } ctx.stroke(); break; }
  }
  ctx.restore();
  /* an eye on its nerve */
  if (o.tether && o.from) { const a = toWorld(o.from.part.body, o.from.x, o.from.y); ctx.strokeStyle = '#b8505a'; ctx.lineWidth = 1.3; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.quadraticCurveTo((a.x + b.position.x) / 2, Math.max(a.y, b.position.y) + 6, b.position.x, b.position.y); ctx.stroke(); }
}
function drawGuts(ctx, gt) {
  const L = gt.links, a = gt.anchor ? toWorld(gt.part.body, gt.anchor.pointA.x, gt.anchor.pointA.y) : null;
  const path = () => { ctx.beginPath(); const pts = a ? [a, ...L.map(l => l.position)] : L.map(l => l.position); ctx.moveTo(pts[0].x, pts[0].y); for (let i = 1; i < pts.length - 1; i++) { const m = { x: (pts[i].x + pts[i + 1].x) / 2, y: (pts[i].y + pts[i + 1].y) / 2 }; ctx.quadraticCurveTo(pts[i].x, pts[i].y, m.x, m.y); } const e = pts[pts.length - 1]; ctx.lineTo(e.x, e.y); };
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  path(); ctx.strokeStyle = '#4a1418'; ctx.lineWidth = 7.4 * S; ctx.stroke();
  path(); ctx.strokeStyle = '#c7737a'; ctx.lineWidth = 5.4 * S; ctx.stroke();
  path(); ctx.strokeStyle = 'rgba(240,170,176,0.55)'; ctx.lineWidth = 1.4 * S; ctx.stroke();
}
M.Events.on(render, 'afterRender', () => {
  const ctx = render.context, g = guy;
  ctx.save();
  for (const gt of guts) drawGuts(ctx, gt);
  for (const o of gibs) drawGib(ctx, o);
  if (g) {
    const fade = g.gone ? Math.max(0, 1 - (performance.now() - g.gone) / 1200) : 1; ctx.globalAlpha = fade;
    for (const p of g.list) if (!p.gone) drawPart(ctx, p, g);
    ctx.globalAlpha = 1;
  }
  /* bullet holes in the fridges stay on the fridge */
  for (const f of (typeof spawnedFridges !== 'undefined' ? spawnedFridges : [])) { const hs = f.plugin && f.plugin.holes; if (!hs) continue; for (const h of hs) { const w = toWorld(f, h.x, h.y); ctx.fillStyle = '#111'; ctx.beginPath(); ctx.arc(w.x, w.y, 2.2, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = 'rgba(220,220,220,0.7)'; ctx.lineWidth = 0.8; ctx.beginPath(); ctx.arc(w.x, w.y, 3.4, 0, Math.PI * 2); ctx.stroke(); } }
  for (const t of tnts) { const b = t.body; ctx.save(); ctx.translate(b.position.x, b.position.y); ctx.rotate(b.angle); ctx.fillStyle = '#b81818'; ctx.strokeStyle = '#000'; ctx.lineWidth = 1.2; ctx.fillRect(-3.5 * S, -10 * S, 7 * S, 20 * S); ctx.strokeRect(-3.5 * S, -10 * S, 7 * S, 20 * S); ctx.fillStyle = '#f0e0b0'; ctx.fillRect(-3.5 * S, -2 * S, 7 * S, 4 * S); ctx.fillStyle = '#111'; ctx.font = `bold ${Math.round(3 * S)}px monospace`; ctx.textAlign = 'center'; ctx.fillText('TNT', 0, 1 * S); ctx.strokeStyle = '#555'; ctx.beginPath(); ctx.moveTo(0, -10 * S); ctx.quadraticCurveTo(2 * S, -12 * S, 0, -10 * S - 3 * S * Math.max(0.2, t.fuse / 2.6)); ctx.stroke(); ctx.restore(); }
  for (const s of smoke) { ctx.fillStyle = `rgba(${s.c},${s.c},${s.c},${Math.min(0.5, s.life / 120)})`; ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill(); }
  for (const f of fx) {
    const k = 1 - f.t / f.life;
    if (f.kind === 'spark') { f.x += f.vx; f.y += f.vy; f.vy += 0.1; ctx.fillStyle = `rgba(255,${180 + Math.random() * 75},60,${k})`; ctx.fillRect(f.x, f.y, 2, 2); }
    else if (f.kind === 'flash') { const gr = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.r * (1.2 - k * 0.4)); gr.addColorStop(0, `rgba(255,250,220,${k})`); gr.addColorStop(0.4, `rgba(255,170,40,${k * 0.8})`); gr.addColorStop(1, 'rgba(255,80,0,0)'); ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2); ctx.fill(); }
    else if (f.kind === 'muzzle') { ctx.fillStyle = `rgba(255,230,150,${k * 0.9})`; ctx.beginPath(); for (let i = 0; i < 10; i++) { const a = i / 10 * Math.PI * 2, rr = (i % 2 ? 4 : 11) * (1 + (1 - k)); ctx.lineTo(f.x + Math.cos(a) * rr, f.y + Math.sin(a) * rr); } ctx.fill(); }
    else if (f.kind === 'slash') { ctx.strokeStyle = `rgba(255,255,255,${k * 0.8})`; ctx.lineWidth = 2 * k + 0.5; ctx.beginPath(); ctx.moveTo(f.x, f.y); ctx.lineTo(f.x2, f.y2); ctx.stroke(); }
    else if (f.kind === 'ring') { ctx.strokeStyle = `rgba(255,255,255,${k * 0.6})`; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(f.x, f.y, f.r * (1 - k) + 4, 0, Math.PI * 2); ctx.stroke(); }
  }
  /* blood in flight: round drops that stretch into streaks as they go, one path per colour */
  ctx.lineCap = 'round';
  const byCol = new Map();
  for (const p of particles) { let a = byCol.get(p.c + (p.r > 1.6 ? 'b' : 's')); if (!a) byCol.set(p.c + (p.r > 1.6 ? 'b' : 's'), a = []); a.push(p); }
  for (const [k, list] of byCol) { ctx.strokeStyle = list[0].c; ctx.lineWidth = (k.endsWith('b') ? 2.6 : 1.7) * (S / 1.4); ctx.beginPath(); for (const p of list) { const sp = Math.hypot(p.vx, p.vy), l = Math.min(3, 0.15 + sp * 0.35); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x - p.vx / (sp || 1) * l * p.r, p.y - p.vy / (sp || 1) * l * p.r + 0.01); } ctx.stroke(); }
  ctx.restore();
  /* his name rides on his head */
  const nm = document.getElementById('guyName');
  if (nm && g) { const h = g.parts.head; if (g.alive && !h.gone) { nm.style.display = 'block'; nm.textContent = g.name; nm.style.left = (h.body.position.x - 20) + 'px'; nm.style.top = (h.body.position.y - 34 * S) + 'px'; } else nm.style.display = 'none'; }
});

/* ------------------------------------------------------------ the end of him */
function clearGuy(g) {
  if (guy !== g) return;
  g.gone = performance.now();
  setTimeout(() => {
    for (const p of g.list) if (!p.gone) try { M.World.remove(world, p.body); } catch (e) {}
    for (const j of g.joints) if (j.c) try { M.World.remove(world, j.c); } catch (e) {}
    for (const gt of guts.splice(0)) { try { M.World.remove(world, [...gt.links, ...gt.cons]); if (gt.anchor) M.World.remove(world, gt.anchor); } catch (e) {} }
    for (const o of gibs) if (o.tether) { try { M.World.remove(world, o.tether); } catch (e) {} o.tether = null; }
    guy = null; shim(); newGuy();
  }, 1200);
}
function toeTag(g) {
  if (!document.body) return;
  const c = g.parts.chest.body.position, el = document.createElement('div');
  const limbs = g.list.filter(p => !p.attached && LIMB.has(p.kind)).length;
  const lines = [`JOHN DOE #${g.n}`, `NAME: ${g.name.toUpperCase()}`, `C.O.D.: ${(g.dusty ? 'he was already dead' : g.cause).toUpperCase()}`, g.dusty ? 'BLOOD LOST: NONE TO LOSE' : `BLOOD LOST: ${(g.lost / 1000).toFixed(1)} L`, `FRACTURES: ${g.stats.fractures} · PIECES: ${g.stats.pieces}`];
  if (limbs) lines.push(`LIMBS NOT ATTACHED: ${limbs}`);
  if (g.stats.shots) lines.push(`ROUNDS RECOVERED: ${g.stats.shots}`);
  el.className = 'guyTag'; el.innerHTML = lines.map(l => `<div>${l.replace(/</g, '&lt;')}</div>`).join('');
  el.style.left = clamp(c.x - 70, 8, W() - 170) + 'px'; el.style.top = clamp(c.y - 120, 8, H() - 120) + 'px';
  document.body.appendChild(el);
  requestAnimationFrame(() => el.classList.add('on'));
  setTimeout(() => { el.classList.remove('on'); setTimeout(() => el.remove(), 600); }, 6500);
}

/* ------------------------------------------------------------ tools */
const TOOLS = [
  { id: 'hand', icon: '✋', name: 'HAND', tip: 'grab and throw. pull hard enough and something comes off' },
  { id: 'knife', icon: '🔪', name: 'KNIFE', tip: 'drag across him to cut. three cuts in the same place and it comes off' },
  { id: 'hammer', icon: '🔨', name: 'HAMMER', tip: 'click to hit. bones break, skulls crack' },
  { id: 'gun', icon: '🔫', name: 'SIX-SHOOTER', tip: 'click to shoot. six rounds, R to reload' },
  { id: 'tnt', icon: '🧨', name: 'DYNAMITE', tip: 'click to light a stick. you can pick it up and throw it with the hand' },
  { id: 'mop', icon: '🧽', name: 'SPONGE', tip: 'drag to wipe the blood off the glass' }
];
const css = document.createElement('style');
css.textContent = `
#gorebar { position: fixed; right: 12px; bottom: 66px; z-index: 10002; display: flex; flex-direction: row; gap: 4px; font-family: monospace; }
#gorebar button { width: 36px; height: 36px; padding: 0; font-size: 18px; line-height: 36px; background: #14171c; color: #e8e8e8; border: 1px solid #3a3f47; cursor: pointer; position: relative; }
#gorebar button.on { background: #6a0a0a; border-color: #ff4a4a; box-shadow: 0 0 8px #ff2a2a; }
#gorebar button:hover::after { content: attr(data-tip); position: absolute; right: 0; bottom: 42px; width: 200px; background: #0b0f14; color: #ddd; border: 1px solid #3a3f47; padding: 4px 6px; font-size: 11px; line-height: 1.3; text-align: left; pointer-events: none; white-space: normal; }
#gorebar .ammo { position: absolute; left: 3px; right: 3px; bottom: 2px; display: flex; gap: 1px; justify-content: center; height: 4px; pointer-events: none; }
#gorebar .ammo i { width: 4px; height: 4px; background: #c8a040; display: block; }
#gorebar .ammo i.spent { background: #333; }
#gorebar .ammo.spin i { animation: goreSpin 0.6s linear infinite; }
@keyframes goreSpin { 50% { opacity: 0.2; } }
.guyTag { position: fixed; z-index: 10003; width: 160px; background: #e8dcc0; color: #2a2014; border: 1px solid #6a5a3a; font: 10px/1.35 monospace; padding: 8px 8px 6px 18px; transform: rotate(-5deg) translateY(8px); opacity: 0; transition: opacity .5s, transform .5s; pointer-events: none; box-shadow: 2px 3px 0 rgba(0,0,0,0.4); }
.guyTag.on { opacity: 1; transform: rotate(-5deg) translateY(0); }
.guyTag::before { content: ''; position: absolute; left: 6px; top: 8px; width: 6px; height: 6px; border-radius: 50%; background: #0b0f14; border: 1px solid #6a5a3a; }
.guyTag div:first-child { font-weight: bold; border-bottom: 1px solid #6a5a3a; margin-bottom: 3px; }
html.vendor-open #gorebar, html.overlay-open #gorebar { display: none; }
@media (max-width: 880px), (pointer: coarse) { body:not(.ui-hidden) #gorebar { display: none; } #gorebar { bottom: 66px; right: 8px; } #gorebar button { width: 40px; height: 40px; } #gorebar button:hover::after { display: none; } }
`;
document.head.appendChild(css);
const bar = document.createElement('div'); bar.id = 'gorebar';
for (const t of TOOLS) { const b = document.createElement('button'); b.appendChild(document.createTextNode(t.icon)); b.dataset.tool = t.id; b.dataset.tip = `${TOOLS.indexOf(t) + 1} · ${t.name}: ${t.tip}`; b.setAttribute('aria-label', t.name); b.onclick = e => { e.stopPropagation(); setTool(t.id); }; bar.appendChild(b); if (t.id === 'gun') { const a = document.createElement('div'); a.className = 'ammo'; a.id = 'goreAmmo'; b.appendChild(a); } }
document.body.appendChild(bar);
function drawAmmo() { const a = document.getElementById('goreAmmo'); if (!a) return; a.className = 'ammo' + (reloading ? ' spin' : ''); a.innerHTML = Array.from({ length: 6 }, (_, i) => `<i class="${i < ammo ? '' : 'spent'}"></i>`).join(''); }
const CURSORS = {
  knife: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='28' height='28'><path d='M2 26 L18 10 L24 4 L22 12 L6 26 Z' fill='%23d8dce4' stroke='black'/><rect x='19' y='2' width='6' height='9' transform='rotate(45 22 6)' fill='%235a3a1e' stroke='black'/></svg>\") 2 26, crosshair",
  hammer: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='30' height='30'><rect x='13' y='8' width='4' height='20' fill='%237a5a34' stroke='black'/><rect x='5' y='2' width='20' height='8' fill='%23888' stroke='black'/></svg>\") 15 5, crosshair",
  gun: 'crosshair', tnt: 'copy', mop: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='30' height='24'><rect x='2' y='4' width='26' height='16' rx='4' fill='%23e8d040' stroke='black'/><rect x='2' y='4' width='26' height='5' fill='%233a8a3a' stroke='black'/></svg>\") 15 12, crosshair", hand: ''
};
function setTool(id) {
  tool = id;
  for (const b of bar.querySelectorAll('button')) b.classList.toggle('on', b.dataset.tool === id);
  render.canvas.style.cursor = CURSORS[id] || '';
  /* only the hand picks things up */
  try { mouseConstraint.collisionFilter.mask = id === 'hand' ? 0xFFFFFFFF : 0; if (id !== 'hand' && mouseConstraint.constraint.bodyB) { mouseConstraint.constraint.bodyB = null; } } catch (e) {}
  drawAmmo();
}
setTool('hand');
function guyBodies() { return guy ? guy.list.filter(p => !p.gone).map(p => p.body) : []; }
/* the part under the cursor: the one whose middle is nearest, the front ones first when it's close */
function partAt(x, y) { const hit = Q.point(guyBodies(), { x, y }); if (!hit.length) return null; const d = b => Math.hypot(b.position.x - x, b.position.y - y) - b.plugin.part.def.layer * 1.5; return hit.sort((a, b) => d(a) - d(b))[0].plugin.part; }
function blocked() { const html = document.documentElement; return (typeof gameActive !== 'undefined' && gameActive) || (typeof isDead !== 'undefined' && isDead) || html.classList.contains('vendor-open') || html.classList.contains('overlay-open') || (typeof drawToggle !== 'undefined' && drawToggle && drawToggle.checked); }

function hammer(x, y) {
  const p = partAt(x, y);
  fx.push({ kind: 'ring', x, y, r: 16, t: 0, life: 10 });
  if (p) { const b = p.body, d = { x: b.position.x - x, y: b.position.y - y - 4 }, m = Math.hypot(d.x, d.y) || 1; hurt(p, 10 + Math.random() * 4, 'blunt', x, y, { x: d.x / m, y: d.y / m }); B.setVelocity(b, { x: b.velocity.x + d.x / m * 6, y: b.velocity.y + d.y / m * 6 - 2 }); SND.thud(1); if (p.kind === 'head') SND.crunch(0.8); return; }
  const o = Q.point(gibs.map(g => g.body), { x, y })[0]; if (o) { const gb = o.plugin.gib; if (gb.type === 'eye' || gb.type === 'brain') { bleed(x, y, 0, -1, 18, 4, Math.PI * 2, 1.4); SND.squish(0.7); removeGib(gb); return; } B.setVelocity(o, { x: rnd(-4, 4), y: -6 }); SND.thud(0.4); return; }
  const f = Q.point(world.bodies.filter(b => !b.isStatic && !b.plugin.part && !b.plugin.gib), { x, y })[0]; if (f) { B.setVelocity(f, { x: f.velocity.x + rnd(-2, 2), y: f.velocity.y - 4 }); SND.thud(0.8); return; }
  SND.thud(0.25);
}
function removeGib(o) { const i = gibs.indexOf(o); if (i >= 0) gibs.splice(i, 1); try { M.World.remove(world, o.body); } catch (e) {} if (o.tether) try { M.World.remove(world, o.tether); } catch (e) {} }
function shoot(x, y) {
  if (reloading) { SND.click(); return; }
  if (ammo <= 0) { SND.click(); reload(); return; }
  ammo--; cylShots++; drawAmmo(); shotSound();
  fx.push({ kind: 'muzzle', x, y, t: 0, life: 5 }); smoke.push({ x, y, vx: rnd(-0.3, 0.3), vy: -0.4, r: 4, life: 60, c: 200 });
  document.body.style.transform = `translate(${rnd(-3, 3)}px,${rnd(-3, 3)}px)`; setTimeout(() => { if (!isDeadSafe()) document.body.style.transform = ''; }, 60);
  const dir = (() => { const a = rnd(0, Math.PI * 2); return { x: Math.cos(a) * 0.4, y: Math.sin(a) * 0.4 - 0.6 }; })();
  /* whatever is on top at that spot takes it: dynamite, then him, then a gib, then a fridge, then the wall */
  const t = Q.point(tnts.map(t => t.body), { x, y })[0]; if (t) { const tt = tnts.find(q => q.body === t); tnts.splice(tnts.indexOf(tt), 1); explode(tt); return; }
  const p = partAt(x, y);
  if (p) { cylHits++; const dmg = p.kind === 'head' ? 34 : p.kind === 'chest' ? 38 : 24; hurt(p, dmg, 'bullet', x, y, dir); B.setVelocity(p.body, { x: p.body.velocity.x + dir.x * 7, y: p.body.velocity.y + dir.y * 7 }); B.setAngularVelocity(p.body, p.body.angularVelocity + rnd(-0.3, 0.3)); deadEye(); return; }
  const o = Q.point(gibs.map(g => g.body), { x, y })[0]; if (o) { const gb = o.plugin.gib; bleed(x, y, 0, -1, gb.type === 'hat' ? 0 : 16, 5, Math.PI * 2, 1.4); if (gb.type === 'hat') { B.setVelocity(o, { x: rnd(-3, 3), y: -9 }); B.setAngularVelocity(o, rnd(-0.5, 0.5)); } else removeGib(gb); SND.squish(0.6); cylHits++; deadEye(); return; }
  const f = Q.point(world.bodies.filter(b => !b.isStatic && !b.plugin.part && !b.plugin.gib && b.label !== 'gut'), { x, y })[0];
  if (f) { const l = toLocal(f, x, y); f.plugin = f.plugin || {}; (f.plugin.holes = f.plugin.holes || []).push({ x: l.x, y: l.y }); if (f.plugin.holes.length > 10) f.plugin.holes.shift(); for (let i = 0; i < 10; i++) fx.push({ kind: 'spark', x, y, vx: rnd(-4, 4), vy: rnd(-5, 1), t: 0, life: 16 }); SND.ping(); B.setVelocity(f, { x: f.velocity.x + rnd(-1.5, 1.5), y: f.velocity.y - 1.5 }); cylHits = -99; return; }
  /* the wall: a hole in the glass, for good */
  dctx.save(); dctx.fillStyle = '#050505'; dctx.beginPath(); dctx.arc(x, y, 2.6, 0, Math.PI * 2); dctx.fill(); dctx.strokeStyle = 'rgba(220,230,240,0.55)'; dctx.lineWidth = 0.7; dctx.beginPath(); for (let i = 0; i < 7; i++) { const a = Math.random() * Math.PI * 2, l = rnd(6, 18); dctx.moveTo(x + Math.cos(a) * 3, y + Math.sin(a) * 3); dctx.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); } dctx.stroke(); dctx.beginPath(); dctx.arc(x, y, rnd(5, 8), 0, Math.PI * 2); dctx.stroke(); dctx.restore();
  cylHits = -99;
}
function isDeadSafe() { return typeof isDead !== 'undefined' && isDead; }
function reload() { if (reloading || ammo === 6) return; reloading = performance.now(); drawAmmo(); SND.spin(); setTimeout(() => { ammo = 6; reloading = 0; cylHits = 0; cylShots = 0; drawAmmo(); }, 1300); }
/* six from six: the world slows down and somebody whistles */
function deadEye() {
  if (cylShots === 6 && cylHits === 6 && !slowmo) {
    slowmo = performance.now() + 2600; engine.timing.timeScale = 0.25;
    render.canvas.style.filter = 'sepia(0.85) contrast(1.15)'; SND.whistle();
  }
}
function placeTnt(x, y) {
  if (tnts.length >= 4) return;
  const body = M.Bodies.rectangle(x, y, 7 * S, 20 * S, { collisionFilter: TNT_FILTER, density: 0.002, friction: 0.6, restitution: 0.2, render: { visible: false }, label: 'tnt' });
  const t = { body, fuse: 2.6 }; body.plugin = { tnt: t };
  M.World.add(world, body); tnts.push(t);
  SND.click(); const A = out(); if (A) noise(A, A.currentTime, 2.6, 'highpass', 6000, 4000, 0.5, 0.05);
}
function explode(t) {
  note('boom');
  const c = { x: t.body.position.x, y: t.body.position.y }, R = 240;
  try { M.World.remove(world, t.body); } catch (e) {}
  SND.boom();
  fx.push({ kind: 'flash', x: c.x, y: c.y, r: 150, t: 0, life: 14 });
  for (let i = 0; i < 26; i++) smoke.push({ x: c.x + rnd(-20, 20), y: c.y + rnd(-20, 20), vx: rnd(-2.5, 2.5), vy: rnd(-3, 0.5), r: rnd(8, 20), life: rnd(70, 150), c: Math.floor(rnd(40, 90)) });
  for (let i = 0; i < 40; i++) fx.push({ kind: 'spark', x: c.x, y: c.y, vx: rnd(-9, 9), vy: rnd(-10, 3), t: 0, life: rnd(15, 35) });
  /* a scorch on the glass */
  const gr = dctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, 70); gr.addColorStop(0, 'rgba(10,6,4,0.75)'); gr.addColorStop(0.6, 'rgba(20,12,6,0.4)'); gr.addColorStop(1, 'rgba(20,12,6,0)'); dctx.fillStyle = gr; dctx.beginPath(); dctx.arc(c.x, c.y, 70, 0, Math.PI * 2); dctx.fill();
  document.body.style.transform = 'translate(6px,-4px)'; setTimeout(() => { document.body.style.transform = 'translate(-5px,3px)'; }, 50); setTimeout(() => { if (!isDeadSafe()) document.body.style.transform = ''; }, 110);
  /* everything nearby goes */
  const hitParts = [];
  for (const b of world.bodies.slice()) {
    if (b.isStatic && !(b.plugin && b.plugin.part)) continue;
    const d = { x: b.position.x - c.x, y: b.position.y - c.y }, dist = Math.hypot(d.x, d.y); if (dist > R) continue;
    const k = 1 - dist / R, n = { x: d.x / (dist || 1), y: d.y / (dist || 1) - 0.35 };
    if (b.plugin && b.plugin.part) { hitParts.push([b.plugin.part, k, n]); continue; }
    B.setVelocity(b, { x: b.velocity.x + n.x * 22 * k, y: b.velocity.y + n.y * 22 * k }); B.setAngularVelocity(b, b.angularVelocity + rnd(-0.4, 0.4) * k);
    if (b.plugin && b.plugin.tnt && b.plugin.tnt !== t) b.plugin.tnt.fuse = Math.min(b.plugin.tnt.fuse, 0.12);
  }
  if (guy && hitParts.length && !guy.active) wake(guy);
  for (const [p, k, n] of hitParts) { if (p.gone) continue; hurt(p, 70 * k * k + 8 * k, 'blast', p.body.position.x - n.x * 4, p.body.position.y - n.y * 4, n); if (!p.gone) { B.setVelocity(p.body, { x: p.body.velocity.x + n.x * 18 * k, y: p.body.velocity.y + n.y * 18 * k }); B.setAngularVelocity(p.body, rnd(-0.5, 0.5)); } }
}
function slice(a, b) {
  const len = Math.hypot(b.x - a.x, b.y - a.y); if (len < 3) return;
  fx.push({ kind: 'slash', x: a.x, y: a.y, x2: b.x, y2: b.y, t: 0, life: 8 });
  if (len > 14 && Math.random() < 0.3) SND.slice();
  const hits = Q.ray(guyBodies(), a, b, 4);
  const now = performance.now(), dir = { x: (b.x - a.x) / len, y: (b.y - a.y) / len };
  for (const h of hits) {
    const body = h.bodyA.plugin && h.bodyA.plugin.part ? h.bodyA : h.bodyB, p = body.plugin && body.plugin.part; if (!p || now - p.cool < 160) continue;
    p.cool = now;
    const c = body.position, t = clamp(((c.x - a.x) * dir.x + (c.y - a.y) * dir.y), 0, len), at = { x: a.x + dir.x * t, y: a.y + dir.y * t };
    hurt(p, 5 + Math.min(10, len * 0.12), 'cut', at.x, at.y, dir);
    if (p.kind === 'head' && Math.random() < 0.25) { const e = toLocal(p.body, at.x, at.y).x < 0 ? 0 : 1; if (!guy.eyeOut[e]) popEye(e); }
  }
  /* guts can be cut loose too */
  for (const gt of guts) if (gt.anchor && Q.ray(gt.links.slice(0, 2), a, b, 5).length) { try { M.World.remove(world, gt.anchor); } catch (e) {} const p = toWorld(gt.part.body, gt.anchor.pointA.x, gt.anchor.pointA.y); gt.anchor = null; bleed(p.x, p.y, 0, 0, 20, 3, Math.PI * 2, 1.5); SND.cut(); }
}
function sponge(x, y) {
  dctx.save(); dctx.globalCompositeOperation = 'destination-out'; const gr = dctx.createRadialGradient(x, y, 0, x, y, 34); gr.addColorStop(0, 'rgba(0,0,0,0.5)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); dctx.fillStyle = gr; dctx.beginPath(); dctx.arc(x, y, 34, 0, Math.PI * 2); dctx.fill(); dctx.restore();
}

const cv = render.canvas;
function down(x, y) {
  pointer.x = x; pointer.y = y;
  if (blocked()) { note('blocked ' + tool); return; }
  note(`${tool} ${Math.round(x)},${Math.round(y)} ${partAt(x, y) ? partAt(x, y).id : '-'}`);
  pointer.down = true; pointer.last = { x, y };
  if (guy && !guy.active && tool === 'hand' && partAt(x, y)) wake(guy);
  if (tool === 'hammer') hammer(x, y);
  else if (tool === 'gun') shoot(x, y);
  else if (tool === 'tnt') placeTnt(x, y);
  else if (tool === 'mop') sponge(x, y);
}
function move(x, y) {
  pointer.x = x; pointer.y = y;
  if (!pointer.down || blocked()) return;
  if (tool === 'knife') { slice(pointer.last, { x, y }); pointer.last = { x, y }; }
  else if (tool === 'mop') { sponge(x, y); }
}
cv.addEventListener('mousedown', e => down(e.clientX, e.clientY));
window.addEventListener('mousemove', e => move(e.clientX, e.clientY));
window.addEventListener('mouseup', () => { pointer.down = false; });
cv.addEventListener('touchstart', e => { const t = e.touches[0]; if (t) down(t.clientX, t.clientY); }, { passive: true });
cv.addEventListener('touchmove', e => { const t = e.touches[0]; if (t) move(t.clientX, t.clientY); }, { passive: true });
cv.addEventListener('touchend', () => { pointer.down = false; });

/* keys: 1 to 6 for the tools, R to reload, and somebody's typing */
let typed = '';
document.addEventListener('keydown', e => {
  const tg = e.target; if (tg && (tg.tagName === 'INPUT' || tg.tagName === 'TEXTAREA' || tg.isContentEditable)) return;
  if (blocked()) return;
  const n = parseInt(e.key, 10); if (n >= 1 && n <= TOOLS.length && !e.ctrlKey && !e.metaKey && !e.altKey) setTool(TOOLS[n - 1].id);
  if (e.key === 'r' || e.key === 'R') { if (tool === 'gun') reload(); }
  typed = (typed + e.key.toLowerCase()).slice(-12);
  if (typed.endsWith('yeehaw')) { typed = ''; yeehaw(); }
});
/* hats for everyone, and something rolls past */
function yeehaw() {
  hatsForAll = true; if (guy && !guy.hatOn) guy.hatOn = true; if (guy) guy.hat = true;
  const w = gib('weed', -30, H() - 40, 7 + Math.random() * 3, -2, 14); w.born = performance.now() - 18000; B.setAngularVelocity(w.body, 0.25);
  SND.whistle();
}

/* the page's music still bounces him, and the resize still moves him: keep them in step */
window.addEventListener('resize', () => { if (guy && !guy.active) { const dx = homeX() - guy.x, dy = homeY() - guy.y; for (const p of guy.list) B.setPosition(p.body, { x: p.body.position.x + dx, y: p.body.position.y + dy }); guy.x += dx; guy.y += dy; prompt(); } });

/* for the console, and for anyone poking around */
window.GORE = { get guy() { return guy; }, tool: setTool, hurt: (id, d, k = 'blunt') => { const p = guy && guy.parts[id]; if (p) hurt(p, d, k, p.body.position.x, p.body.position.y); }, shoot, hammer, slice, explode: (x, y) => { placeTnt(x, y); const t = tnts[tnts.length - 1]; if (t) t.fuse = 0; }, sever: id => { const j = guy && guy.joints.find(j => j.id === id); if (j) { wake(); sever(j, 'torn'); } }, wake: () => wake(), particles, gibs, guts, yeehaw, count: () => bodyCount, log: LOG, respawn: (o = {}) => { const g = guy; if (g) { for (const p of g.list) if (!p.gone) try { M.World.remove(world, p.body); } catch (e) {} for (const j of g.joints) if (j.c) try { M.World.remove(world, j.c); } catch (e) {} clearTimeout(g.respawn); } guy = null; return newGuy(o); } };
newGuy();
})();
