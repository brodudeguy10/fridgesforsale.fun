/* ============================================================
   THE GUY, version three: core.
   the shared namespace, the maths, the units, the collision layers
   and the knobs every other file reads. loaded first by
   extras/guygore.js. nothing in here touches the page on its own.
============================================================ */
(function () {
'use strict';
if (!window.Matter || typeof engine === 'undefined' || !engine.world) return;
const G = window.__G3 = { v: 3, mods: {} };
const M = G.M = Matter;
G.B = M.Body; G.Q = M.Query; G.V = M.Vector;
/* the page's own objects, by reference */
G.engine = engine; G.world = engine.world; G.render = render;
G.mouse = () => (typeof mouseConstraint !== 'undefined' ? mouseConstraint : null);
G.walls = () => { try { return { ground, leftWall, rightWall, ceiling }; } catch (e) { return {}; } };
G.fridges = () => (typeof spawnedFridges !== 'undefined' ? spawnedFridges : []);
G.ac = () => { try { if (typeof ensureAudioContext === 'function') ensureAudioContext(); } catch (e) {} return (typeof audioCtx !== 'undefined' && audioCtx) ? audioCtx : null; };
G.acIfAny = () => (typeof audioCtx !== 'undefined' && audioCtx) ? audioCtx : null;
G.pageDead = () => typeof isDead !== 'undefined' && isDead;
G.blocked = () => { const h = document.documentElement; return (typeof gameActive !== 'undefined' && gameActive) || G.pageDead() || h.classList.contains('vendor-open') || h.classList.contains('overlay-open') || (typeof drawToggle !== 'undefined' && drawToggle && drawToggle.checked); };
G.away = () => { const h = document.documentElement; return document.hidden || (typeof gameActive !== 'undefined' && gameActive) || h.classList.contains('vendor-open') || h.classList.contains('overlay-open') || (typeof bsodActive !== 'undefined' && bsodActive); };

/* ------------------------------------------------------------ maths */
const clamp = G.clamp = (x, a, b) => x < a ? a : x > b ? b : x;
G.lerp = (a, b, t) => a + (b - a) * t;
G.rnd = (a, b) => a + Math.random() * (b - a);
G.pick = a => a[Math.floor(Math.random() * a.length)];
G.wrap = a => { if (!(a > -1e6 && a < 1e6)) return 0; a = (a + Math.PI) % (2 * Math.PI); if (a < 0) a += 2 * Math.PI; return a - Math.PI; };
G.smooth = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
G.sign = x => x < 0 ? -1 : 1;
/* a seeded generator, so a wound drawn twice looks the same both times */
G.srand = seed => { let s = (Math.floor(seed * 4294967296) >>> 0) || 1; return () => { s += 0x6D2B79F5; let t = s; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; }; };
/* a shuffle bag: every variation once before any of them twice */
G.bag = n => { let q = []; let last = -1; return () => { if (!q.length) { q = Array.from({ length: n }, (_, i) => i); for (let i = n - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [q[i], q[j]] = [q[j], q[i]]; } if (n > 1 && q[q.length - 1] === last) [q[0], q[q.length - 1]] = [q[q.length - 1], q[0]]; } last = q.pop(); return last; }; };

/* rigid body helpers, in the body's own frame */
G.toWorld = (b, lx, ly) => { const c = Math.cos(b.angle), s = Math.sin(b.angle); return { x: b.position.x + lx * c - ly * s, y: b.position.y + lx * s + ly * c }; };
G.toLocal = (b, x, y) => { const c = Math.cos(-b.angle), s = Math.sin(-b.angle), dx = x - b.position.x, dy = y - b.position.y; return { x: dx * c - dy * s, y: dx * s + dy * c }; };
G.dirLocal = (b, dx, dy) => { const c = Math.cos(-b.angle), s = Math.sin(-b.angle); return { x: dx * c - dy * s, y: dx * s + dy * c }; };
G.dirWorld = (b, dx, dy) => { const c = Math.cos(b.angle), s = Math.sin(b.angle); return { x: dx * c - dy * s, y: dx * s + dy * c }; };
/* the velocity of a point on a body, in px per step */
G.pointVel = (b, x, y) => { const w = b.angularVelocity; return { x: b.velocity.x - w * (y - b.position.y), y: b.velocity.y + w * (x - b.position.x) }; };

/* ------------------------------------------------------------ screen and scale */
G.W = () => window.innerWidth; G.H = () => window.innerHeight;
G.coarse = (window.matchMedia && matchMedia('(pointer: coarse)').matches) || navigator.maxTouchPoints > 0;
/* the guy's own units are the old ones: about a hundred of them from his soles to the top of his head */
G.S = G.coarse || G.W() < 880 ? 1.35 : 1.9;
const S = G.S;
/* he is 1.75 m tall in any window. the page's gravity is 1000 px/s^2 */
G.HEIGHT_U = 103;
G.mpp = 1.75 / (G.HEIGHT_U * S);              /* metres per pixel */
G.STEP = 1 / 60;                              /* the length of a nominal step, s */

/* ------------------------------------------------------------ collision layers
   the world and the fridges are 1. every guy is in his own negative group, so his own parts
   never touch each other but they do touch every other guy. a limb that comes off joins the
   loose layer, and once it has drifted clear of him it can hit him too */
G.CAT = { WORLD: 0x0001, GUY: 0x0002, GIB: 0x0004, TNT: 0x0008, LIMB: 0x0010 };
G.filterGuy = group => ({ category: G.CAT.GUY, mask: G.CAT.WORLD | G.CAT.GUY | G.CAT.TNT | G.CAT.LIMB, group });
G.filterLimb = group => ({ category: G.CAT.LIMB, mask: G.CAT.WORLD | G.CAT.GUY | G.CAT.TNT | G.CAT.LIMB, group });
G.filterGib = () => ({ category: G.CAT.GIB, mask: G.CAT.WORLD, group: 0 });
G.filterTnt = () => ({ category: G.CAT.TNT, mask: G.CAT.WORLD | G.CAT.GUY | G.CAT.LIMB, group: 0 });

/* ------------------------------------------------------------ time
   simulated time, so slow motion is slow for everything that matters */
G.t = 0;            /* simulated seconds since load */
G.dt = G.STEP;      /* the last step, simulated seconds */
G.ms = () => performance.now();

/* ------------------------------------------------------------ events between the files */
const subs = {};
G.on = (name, fn) => { (subs[name] = subs[name] || []).push(fn); };
G.emit = (name, a, b, c) => { const l = subs[name]; if (!l) return; for (let i = 0; i < l.length; i++) { try { l[i](a, b, c); } catch (e) { G.err(name, e); } } };
G.errs = [];
G.err = (where, e) => { if (G.errs.length < 40) G.errs.push(where + ': ' + (e && e.stack || e)); if (G.errs.length < 6) console.warn('[gore]', where, e); };
G.log = [];
G.note = m => { G.log.push((G.t).toFixed(2) + ' ' + m); if (G.log.length > 200) G.log.splice(0, 50); };

/* ------------------------------------------------------------ the knobs */
G.cases = [];                 /* the morgue: every finished case this visit, newest last */
G.TUNE = {
  maxGuys: 4,                 /* alive at once, the home one included */
  bloodMl: 5000,
  maxParticles: 1600,
  maxGibs: 90,
  maxLoose: 24,               /* detached limbs kept lying around */
  looseLife: 75,              /* s before an old limb fades */
  gibLife: 30,
  morgue: 8,                  /* cases kept for the x-ray */
  eventsPerCase: 700,
  respawnAfter: 7.5,          /* s from death to the next guy, as before */
  fadeTime: 1.2
};
})();
