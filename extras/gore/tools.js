/* ============================================================
   THE GUY, version three: the tools.
   the same six as before: hand, knife, hammer, six-shooter,
   dynamite, sponge. none of them decides what happens to him any
   more; each one is just a way of putting energy into his body,
   and damage.js works out the rest the same way it does for a
   fridge or the floor:

     hand      grab, drag, throw. pull hard enough and it comes off
     knife     drag across him. the same place again goes deeper
     hammer    hits as hard as you swing it: a flick hurts more
     gun       six rounds; R reloads; six from six and time slows
     dynamite  a blast that falls off with distance
     sponge    the wall, the floor and the fridges

   plus two buttons: one calls in another guy (up to four), one
   opens the morgue on the last one who died.
============================================================ */
(function () {
'use strict';
const G = window.__G3; if (!G || !G.A) return;
const A = G.A, M = G.M, B = G.B, Q = G.Q, S = G.S, rnd = G.rnd, clamp = G.clamp;
const TL = G.tools = {};
const fx = TL.fx = [], smoke = [], tnts = [];
let tool = 'hand', ammo = 6, reloading = 0, cylHits = 0, cylShots = 0, slowmo = 0;
const pointer = TL.pointer = { x: G.W() / 2, y: G.H() / 2, down: false, last: null, vx: 0, vy: 0, t: 0, hist: [] };
TL.current = () => tool;

const TOOLS = [
  { id: 'hand', icon: '✋', name: 'HAND', tip: 'grab and throw. pull hard enough and something comes off' },
  { id: 'knife', icon: '🔪', name: 'KNIFE', tip: 'drag across him to cut. the same place again goes deeper, and a deep cut at a joint takes it off' },
  { id: 'hammer', icon: '🔨', name: 'HAMMER', tip: 'click to hit. a faster swing hits harder. bones crack, then break' },
  { id: 'gun', icon: '🔫', name: 'SIX-SHOOTER', tip: 'click to shoot. six rounds, R to reload. point it at him and see what he does' },
  { id: 'tnt', icon: '🧨', name: 'DYNAMITE', tip: 'click to light a stick. you can pick it up and throw it with the hand' },
  { id: 'mop', icon: '🧽', name: 'SPONGE', tip: 'drag to wipe the blood off the wall, the floor and the fridges' }
];
const ICON_GUY = '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><circle cx="12" cy="5" r="3.2" fill="#e8e8e8"/><path d="M8 10h8l-1 6h-2l-.5 6h-1l-.5-6H9z" fill="#e8e8e8"/><path d="M19 3v5M16.5 5.5h5" stroke="#7cff7c" stroke-width="2"/></svg>';
const ICON_XRAY = '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><rect x="3" y="2" width="18" height="20" rx="2" fill="#0b2230" stroke="#6ad0ff"/><path d="M12 5v14M8 8q4 2 8 0M7.5 11q4.5 2 9 0M8 14q4 2 8 0" stroke="#bfefff" stroke-width="1.4" fill="none"/><circle cx="12" cy="4.6" r="1.2" fill="#bfefff"/></svg>';

/* ------------------------------------------------------------ the bar */
const css = document.createElement('style');
css.textContent = `
#gorebar { position: fixed; right: 12px; bottom: 66px; z-index: 10002; display: flex; flex-direction: row; gap: 4px; font-family: monospace; }
#gorebar button { width: 36px; height: 36px; padding: 0; font-size: 18px; line-height: 36px; background: #14171c; color: #e8e8e8; border: 1px solid #3a3f47; cursor: pointer; position: relative; display: flex; align-items: center; justify-content: center; }
#gorebar button.on { background: #6a0a0a; border-color: #ff4a4a; box-shadow: 0 0 8px #ff2a2a; }
#gorebar button.sep { margin-left: 6px; }
#gorebar button:disabled { opacity: 0.35; cursor: default; }
#gorebar button:hover::after { content: attr(data-tip); position: absolute; right: 0; bottom: 42px; width: 210px; background: #0b0f14; color: #ddd; border: 1px solid #3a3f47; padding: 4px 6px; font-size: 11px; line-height: 1.3; text-align: left; pointer-events: none; white-space: normal; }
#gorebar .ammo { position: absolute; left: 3px; right: 3px; bottom: 2px; display: flex; gap: 1px; justify-content: center; height: 4px; pointer-events: none; }
#gorebar .ammo i { width: 4px; height: 4px; background: #c8a040; display: block; }
#gorebar .ammo i.spent { background: #333; }
#gorebar .ammo.spin i { animation: goreSpin 0.6s linear infinite; }
#gorebar .n { position: absolute; right: 2px; top: 1px; font-size: 9px; line-height: 9px; color: #9fd; }
@keyframes goreSpin { 50% { opacity: 0.2; } }
html.vendor-open #gorebar, html.overlay-open #gorebar { display: none; }
/* on a phone the bar is a column up the right edge, above the waiting guy's head, so nothing covers him */
@media (max-width: 880px), (pointer: coarse) { body:not(.ui-hidden) #gorebar { display: none; } #gorebar { flex-direction: column; bottom: 168px; right: 8px; gap: 3px; } #gorebar button { width: 40px; height: 38px; } #gorebar button:hover::after { display: none; } #gorebar button.sep { margin-left: 0; margin-top: 4px; } }
/* a phone on its side: too short for a column, so a row along the top */
@media (pointer: coarse) and (max-height: 500px) { #gorebar { flex-direction: row; top: 8px; left: 8px; right: auto; bottom: auto; } #gorebar button.sep { margin-top: 0; margin-left: 4px; } }
`;
document.head.appendChild(css);
const bar = document.createElement('div'); bar.id = 'gorebar';
for (const t of TOOLS) {
  const b = document.createElement('button'); b.appendChild(document.createTextNode(t.icon)); b.dataset.tool = t.id;
  b.dataset.tip = `${TOOLS.indexOf(t) + 1} · ${t.name}: ${t.tip}`; b.setAttribute('aria-label', t.name);
  b.onclick = e => { e.stopPropagation(); TL.set(t.id); }; bar.appendChild(b);
  if (t.id === 'gun') { const a = document.createElement('div'); a.className = 'ammo'; a.id = 'goreAmmo'; b.appendChild(a); }
}
const spawnBtn = document.createElement('button'); spawnBtn.className = 'sep'; spawnBtn.innerHTML = ICON_GUY + '<span class="n" id="goreGuys"></span>';
spawnBtn.dataset.tip = 'G · ANOTHER GUY: call one in. up to four at once. they bump into each other'; spawnBtn.setAttribute('aria-label', 'Call in another guy');
spawnBtn.onclick = e => { e.stopPropagation(); if (!G.blocked()) { G.spawn({}); updateBar(); } }; bar.appendChild(spawnBtn);
const morgueBtn = document.createElement('button'); morgueBtn.innerHTML = ICON_XRAY;
morgueBtn.dataset.tip = 'X · THE MORGUE: the last one who died, under the x-ray'; morgueBtn.setAttribute('aria-label', 'Open the morgue x-ray'); morgueBtn.disabled = true;
morgueBtn.onclick = e => { e.stopPropagation(); if (G.recap && G.cases.length) G.recap.open(G.cases[G.cases.length - 1]); }; bar.appendChild(morgueBtn);
document.body.appendChild(bar);
function updateBar() {
  const alive = G.guys.filter(g => g.alive && !g.cleared).length;
  const n = document.getElementById('goreGuys'); if (n) n.textContent = alive > 1 ? String(alive) : '';
  spawnBtn.disabled = alive >= G.TUNE.maxGuys; morgueBtn.disabled = !(G.cases && G.cases.length);
}
TL.updateBar = updateBar;
G.on('death', () => setTimeout(updateBar, 50)); G.on('create', () => setTimeout(updateBar, 50)); G.on('destroy', () => setTimeout(updateBar, 50));
function drawAmmo() { const a = document.getElementById('goreAmmo'); if (!a) return; a.className = 'ammo' + (reloading ? ' spin' : ''); a.innerHTML = Array.from({ length: 6 }, (_, i) => `<i class="${i < ammo ? '' : 'spent'}"></i>`).join(''); }
const CURSORS = {
  knife: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='28' height='28'><path d='M2 26 L18 10 L24 4 L22 12 L6 26 Z' fill='%23d8dce4' stroke='black'/><rect x='19' y='2' width='6' height='9' transform='rotate(45 22 6)' fill='%235a3a1e' stroke='black'/></svg>\") 2 26, crosshair",
  hammer: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='30' height='30'><rect x='13' y='8' width='4' height='20' fill='%237a5a34' stroke='black'/><rect x='5' y='2' width='20' height='8' fill='%23888' stroke='black'/></svg>\") 15 5, crosshair",
  gun: 'crosshair', tnt: 'copy', mop: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='30' height='24'><rect x='2' y='4' width='26' height='16' rx='4' fill='%23e8d040' stroke='black'/><rect x='2' y='4' width='26' height='5' fill='%233a8a3a' stroke='black'/></svg>\") 15 12, crosshair", hand: ''
};
TL.set = function (id) {
  const was = tool; tool = id;
  for (const b of bar.querySelectorAll('button[data-tool]')) b.classList.toggle('on', b.dataset.tool === id);
  G.render.canvas.style.cursor = CURSORS[id] || '';
  /* only the hand picks things up */
  try { const mc = G.mouse(); mc.collisionFilter.mask = id === 'hand' ? 0xFFFFFFFF : 0; if (id !== 'hand' && mc.constraint.bodyB) mc.constraint.bodyB = null; } catch (e) {}
  drawAmmo();
  if (id !== was) G.emit('sfx', 'tool', { tool: id });
};
TL.set('hand'); updateBar();

/* ------------------------------------------------------------ finding things under the cursor */
function guyBodies() { const out = []; for (const g of G.guys) if (!g.cleared) for (const p of g.list) if (!p.gone && !p.removed) out.push(p.body); if (G.gibs) for (const L of G.gibs.loose) if (!L.p.removed) out.push(L.p.body); return out; }
/* the part under a point: the front ones first when they overlap */
function partAt(x, y) {
  const hit = Q.point(guyBodies(), { x, y }); if (!hit.length) return null;
  const d = b => Math.hypot(b.position.x - x, b.position.y - y) - b.plugin.part.def.layer * 1.5;
  return hit.sort((a, b) => d(a) - d(b))[0].plugin.part;
}
TL.partAt = partAt;
const loc = (p, x, y) => G.toLocal(p.body, x, y);

/* ------------------------------------------------------------ the hammer: a 600 g head at however fast you swung it */
function hammer(x, y) {
  const sw = Math.hypot(pointer.vx, pointer.vy) * G.mpp;               /* the cursor's speed, m/s */
  const v = clamp(6 + sw * 0.35, 6, 15), E = 0.5 * 0.6 * v * v;
  fx.push({ kind: 'ring', x, y, r: 10 + v, t: 0, life: 10 });
  const p = partAt(x, y);
  if (p) {
    const g = p.guy, b = p.body, d = { x: b.position.x - x, y: b.position.y - y - 4 }, m = Math.hypot(d.x, d.y) || 1, dir = { x: d.x / m, y: d.y / m };
    const l = loc(p, x, y);
    if (g.dm && !g.cleared) G.dmg.impact(g, p, { E, v, area: 'point', type: 'blunt', lx: l.x, ly: l.y, wx: x, wy: y, dir, n: { x: -dir.x, y: -dir.y }, src: `a hammer blow (${v.toFixed(0)} m/s)`, srcKind: 'hammer', kg: 0.6 });
    B.setVelocity(b, { x: b.velocity.x + dir.x * v * 0.5, y: b.velocity.y + dir.y * v * 0.5 - 1.5 });
    G.emit('sfx', 'hammer', { x, k: v / 12, part: p.kind });
    if (g.dm) g.dm.stats.blows++;
    return;
  }
  const gb = G.gibs ? Q.point(G.gibs.list.map(o => o.body), { x, y })[0] : null;
  if (gb) { const o = gb.plugin.gib; if (o.type === 'eye' || o.type === 'brain') { if (G.blood) G.blood.spray(x, y, 0, -1, 18, 4, Math.PI * 2, 1.4); G.emit('sfx', 'squish', { x, k: 0.7 }); G.gibs.remove(o); return; } B.setVelocity(gb, { x: rnd(-4, 4), y: -6 }); G.emit('sfx', 'thud', { x, k: 0.4 }); return; }
  const f = Q.point(G.world.bodies.filter(b => !b.isStatic && !(b.plugin && (b.plugin.part || b.plugin.gib))), { x, y })[0];
  if (f) { B.setVelocity(f, { x: f.velocity.x + rnd(-2, 2), y: f.velocity.y - 4 }); G.emit('sfx', 'hammerMetal', { x, k: v / 12 }); return; }
  G.emit('sfx', 'whiff', { x, k: 0.4 });
}

/* ------------------------------------------------------------ the six-shooter */
function shoot(x, y) {
  if (reloading) { G.emit('sfx', 'dry', { x }); return; }
  if (ammo <= 0) { G.emit('sfx', 'dry', { x }); reload(); return; }
  ammo--; cylShots++; drawAmmo(); G.emit('sfx', 'shot', { x });
  fx.push({ kind: 'muzzle', x, y, t: 0, life: 5 }); smoke.push({ x, y, vx: rnd(-0.3, 0.3), vy: -0.4, r: 4, life: 60, c: 200 });
  document.body.style.transform = `translate(${rnd(-3, 3)}px,${rnd(-3, 3)}px)`; setTimeout(() => { if (!G.pageDead()) document.body.style.transform = ''; }, 60);
  /* it comes out of his back somewhere a little off straight behind */
  const dir = (() => { const a = rnd(0, Math.PI * 2); return { x: Math.cos(a) * 0.4, y: Math.sin(a) * 0.4 - 0.6 }; })();
  /* whatever is on top takes it: dynamite, then a guy, then a gib, then a fridge, then the wall */
  const t = Q.point(tnts.map(t => t.body), { x, y })[0]; if (t) { const tt = tnts.find(q => q.body === t); tnts.splice(tnts.indexOf(tt), 1); explode(tt); return; }
  const p = partAt(x, y);
  if (p) {
    cylHits++; const g = p.guy, l = loc(p, x, y);
    if (g.dm && !g.cleared) G.dmg.shot(g, p, { lx: l.x, ly: l.y, wx: x, wy: y, dir });
    else if (G.blood) G.blood.exitSpray(x, y, dir.x, dir.y, 14 * S);
    B.setVelocity(p.body, { x: p.body.velocity.x + dir.x * 7, y: p.body.velocity.y + dir.y * 7 }); B.setAngularVelocity(p.body, p.body.angularVelocity + rnd(-0.3, 0.3));
    G.emit('sfx', 'fleshShot', { x, part: p.kind });
    deadEye(); return;
  }
  const o = G.gibs ? Q.point(G.gibs.list.map(g => g.body), { x, y })[0] : null;
  if (o) { const gb = o.plugin.gib; if (G.blood && gb.type !== 'hat') G.blood.spray(x, y, 0, -1, 16, 5, Math.PI * 2, 1.4); if (gb.type === 'hat') { B.setVelocity(o, { x: rnd(-3, 3), y: -9 }); B.setAngularVelocity(o, rnd(-0.5, 0.5)); } else G.gibs.remove(gb); G.emit('sfx', 'squish', { x, k: 0.6 }); cylHits++; deadEye(); return; }
  const f = Q.point(G.world.bodies.filter(b => !b.isStatic && !(b.plugin && (b.plugin.part || b.plugin.gib)) && b.label !== 'gut'), { x, y })[0];
  if (f) { const l = G.toLocal(f, x, y); f.plugin = f.plugin || {}; (f.plugin.holes = f.plugin.holes || []).push({ x: l.x, y: l.y }); if (f.plugin.holes.length > 10) f.plugin.holes.shift(); for (let i = 0; i < 10; i++) fx.push({ kind: 'spark', x, y, vx: rnd(-4, 4), vy: rnd(-5, 1), t: 0, life: 16 }); G.emit('sfx', 'ping', { x }); B.setVelocity(f, { x: f.velocity.x + rnd(-1.5, 1.5), y: f.velocity.y - 1.5 }); cylHits = -99; return; }
  /* the wall: a hole in the glass, for good */
  const d = document.getElementById('driedBloodCanvas'), dctx = d && d.getContext('2d');
  if (dctx) { dctx.save(); dctx.fillStyle = '#050505'; dctx.beginPath(); dctx.arc(x, y, 2.6, 0, Math.PI * 2); dctx.fill(); dctx.strokeStyle = 'rgba(220,230,240,0.55)'; dctx.lineWidth = 0.7; dctx.beginPath(); for (let i = 0; i < 7; i++) { const a = Math.random() * Math.PI * 2, l = rnd(6, 18); dctx.moveTo(x + Math.cos(a) * 3, y + Math.sin(a) * 3); dctx.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); } dctx.stroke(); dctx.beginPath(); dctx.arc(x, y, rnd(5, 8), 0, Math.PI * 2); dctx.stroke(); dctx.restore(); }
  G.emit('sfx', 'glass', { x });
  cylHits = -99;
}
function reload() { if (reloading || ammo === 6) return; reloading = G.ms(); drawAmmo(); G.emit('sfx', 'reload', {}); setTimeout(() => { ammo = 6; reloading = 0; cylHits = 0; cylShots = 0; drawAmmo(); }, 1300); }
/* six from six: the world slows down and somebody whistles */
function deadEye() {
  if (cylShots === 6 && cylHits === 6 && !slowmo) {
    slowmo = G.ms() + 2600; G.engine.timing.timeScale = 0.25;
    G.render.canvas.style.filter = 'sepia(0.85) contrast(1.15)'; G.emit('sfx', 'whistle', {});
  }
}

/* ------------------------------------------------------------ dynamite */
function placeTnt(x, y) {
  if (tnts.length >= 4) return;
  const body = M.Bodies.rectangle(x, y, 7 * S, 20 * S, { collisionFilter: G.filterTnt(), density: 0.002, friction: 0.6, restitution: 0.2, render: { visible: false }, label: 'tnt' });
  const t = { body, fuse: 2.6 }; body.plugin = { tnt: t };
  M.World.add(G.world, body); tnts.push(t);
  G.emit('sfx', 'fuse', { x, dur: 2.6 });
}
function explode(t) {
  G.note('boom');
  const c = { x: t.body.position.x, y: t.body.position.y }, Rr = 240;
  try { M.World.remove(G.world, t.body); } catch (e) {}
  G.emit('sfx', 'boom', { x: c.x });
  G.focus = { x: c.x, y: c.y, t: G.t };
  fx.push({ kind: 'flash', x: c.x, y: c.y, r: 150, t: 0, life: 14 });
  for (let i = 0; i < 26; i++) smoke.push({ x: c.x + rnd(-20, 20), y: c.y + rnd(-20, 20), vx: rnd(-2.5, 2.5), vy: rnd(-3, 0.5), r: rnd(8, 20), life: rnd(70, 150), c: Math.floor(rnd(40, 90)) });
  for (let i = 0; i < 40; i++) fx.push({ kind: 'spark', x: c.x, y: c.y, vx: rnd(-9, 9), vy: rnd(-10, 3), t: 0, life: rnd(15, 35) });
  const d = document.getElementById('driedBloodCanvas'), dctx = d && d.getContext('2d');
  if (dctx) { const gr = dctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, 70); gr.addColorStop(0, 'rgba(10,6,4,0.75)'); gr.addColorStop(0.6, 'rgba(20,12,6,0.4)'); gr.addColorStop(1, 'rgba(20,12,6,0)'); dctx.fillStyle = gr; dctx.beginPath(); dctx.arc(c.x, c.y, 70, 0, Math.PI * 2); dctx.fill(); }
  document.body.style.transform = 'translate(6px,-4px)'; setTimeout(() => { document.body.style.transform = 'translate(-5px,3px)'; }, 50); setTimeout(() => { if (!G.pageDead()) document.body.style.transform = ''; }, 110);
  const hit = [];
  for (const b of G.world.bodies.slice()) {
    if (b.isStatic) continue;
    const dd = { x: b.position.x - c.x, y: b.position.y - c.y }, dist = Math.hypot(dd.x, dd.y); if (dist > Rr) continue;
    const k = 1 - dist / Rr, n = { x: dd.x / (dist || 1), y: dd.y / (dist || 1) - 0.35 };
    if (b.plugin && b.plugin.part) { hit.push([b.plugin.part, k, n, dist]); continue; }
    B.setVelocity(b, { x: b.velocity.x + n.x * 22 * k, y: b.velocity.y + n.y * 22 * k }); B.setAngularVelocity(b, b.angularVelocity + rnd(-0.4, 0.4) * k);
    if (b.plugin && b.plugin.tnt && b.plugin.tnt !== t) b.plugin.tnt.fuse = Math.min(b.plugin.tnt.fuse, 0.12);
  }
  for (const [p, k, n, dist] of hit) {
    if (p.gone || p.removed) continue;
    const g = p.guy, E = 2600 * k * k + 60 * k;
    if (g.dm && !g.cleared) G.dmg.blast(g, p, { E, k: k * k * 0.95 + k * 0.08, dir: n, dist });
    if (!p.gone && !p.removed) { B.setVelocity(p.body, { x: p.body.velocity.x + n.x * 18 * k, y: p.body.velocity.y + n.y * 18 * k }); B.setAngularVelocity(p.body, rnd(-0.5, 0.5)); }
  }
}

/* ------------------------------------------------------------ the knife: through whatever's on the line, as deep as the place has already been cut */
function slice(a, b) {
  const len = Math.hypot(b.x - a.x, b.y - a.y); if (len < 3) return;
  fx.push({ kind: 'slash', x: a.x, y: a.y, x2: b.x, y2: b.y, t: 0, life: 8 });
  if (len > 14 && Math.random() < 0.3) G.emit('sfx', 'swish', { x: b.x, k: clamp(len / 40, 0.3, 1) });
  const hits = Q.ray(guyBodies(), a, b, 4), now = G.t, dir = { x: (b.x - a.x) / len, y: (b.y - a.y) / len };
  const seen = new Set();
  for (const h of hits) {
    const body = h.bodyA.plugin && h.bodyA.plugin.part ? h.bodyA : h.bodyB, p = body.plugin && body.plugin.part;
    if (!p || seen.has(p) || now - (p.cutT || -9) < 0.16) continue;
    seen.add(p); p.cutT = now;
    const g = p.guy;
    /* where the line crosses the part, in its own frame */
    const la = loc(p, a.x, a.y), lb = loc(p, b.x, b.y), hw = (p.def.wh ? p.def.wh[0] : p.def.r * 2) * S / 2, hh = (p.def.wh ? p.def.wh[1] : p.def.r * 2) * S / 2;
    const cl = (v, m) => clamp(v, -m, m);
    const x1 = cl(la.x, hw), y1 = cl(la.y, hh), x2 = cl(lb.x, hw), y2 = cl(lb.y, hh);
    const mid = G.toWorld(p.body, (x1 + x2) / 2, (y1 + y2) / 2);
    if (g.dm && !g.cleared) G.dmg.cut(g, p, { lx: (x1 + x2) / 2, ly: (y1 + y2) / 2, lx1: x1, ly1: y1, lx2: x2, ly2: y2, wx: mid.x, wy: mid.y, dir, len: Math.max(6 * S, Math.hypot(x2 - x1, y2 - y1)) });
    G.emit('sfx', 'cut', { x: mid.x, part: p.kind });
    if (p.kind === 'head' && Math.random() < 0.2 && G.gibs) G.gibs.popEye(g, (x1 + x2) / 2 < 0 ? 0 : 1);
  }
  /* guts can be cut loose too */
  if (G.gibs) for (const gt of G.gibs.guts) if (gt.anchor && Q.ray(gt.links.slice(0, 2), a, b, 5).length) { try { M.World.remove(G.world, gt.anchor); } catch (e) {} const p = G.toWorld(gt.part.body, gt.la.x, gt.la.y); gt.anchor = null; if (G.blood) G.blood.spray(p.x, p.y, 0, 0, 20, 3, Math.PI * 2, 1.5); G.emit('sfx', 'cut', { x: p.x }); }
}

/* ------------------------------------------------------------ input */
const cv = G.render.canvas;
function track(x, y) {
  const now = G.ms();
  pointer.hist.push({ x, y, t: now }); while (pointer.hist.length > 2 && now - pointer.hist[0].t > 90) pointer.hist.shift();
  /* the swing: the fastest stretch of the last ~90 ms of movement (a hit lands at the end of a swing, when the hand
     is already slowing), each stretch timed over at least 8 ms so two events a millisecond apart can't read as light speed */
  let bx = 0, by = 0, best = -1;
  for (let i = 1; i < pointer.hist.length; i++) {
    const a = pointer.hist[i - 1], b = pointer.hist[i], dt = Math.max(8, b.t - a.t), vx = (b.x - a.x) / dt * 1000, vy = (b.y - a.y) / dt * 1000;
    if (vx * vx + vy * vy > best) { best = vx * vx + vy * vy; bx = vx; by = vy; }
  }
  pointer.vx = bx; pointer.vy = by;                                   /* px/s */
  pointer.x = x; pointer.y = y; pointer.t = now;
}
function down(x, y) {
  track(x, y);
  if (G.blocked()) return;
  pointer.down = true; pointer.last = { x, y };
  const p = partAt(x, y);
  if (p && p.guy && !p.guy.cleared && tool === 'hand') { G.wake(p.guy); if (p.guy.dm) p.guy.dm.lastPull = 'pulled apart by hand'; G.emit('sfx', 'grab', { x, part: p.kind }); }
  if (tool === 'hammer') hammer(x, y);
  else if (tool === 'gun') shoot(x, y);
  else if (tool === 'tnt') placeTnt(x, y);
  else if (tool === 'mop' && G.blood) G.blood.wipe(x, y);
}
function move(x, y) {
  track(x, y);
  if (!pointer.down || G.blocked()) return;
  if (tool === 'knife') { slice(pointer.last, { x, y }); pointer.last = { x, y }; }
  else if (tool === 'mop' && G.blood) G.blood.wipe(x, y);
}
cv.addEventListener('mousedown', e => down(e.clientX, e.clientY));
window.addEventListener('mousemove', e => move(e.clientX, e.clientY));
window.addEventListener('mouseup', () => { pointer.down = false; });
cv.addEventListener('touchstart', e => { const t = e.touches[0]; if (t) down(t.clientX, t.clientY); }, { passive: true });
cv.addEventListener('touchmove', e => { const t = e.touches[0]; if (t) move(t.clientX, t.clientY); }, { passive: true });
cv.addEventListener('touchend', () => { pointer.down = false; });

/* keys: 1 to 6 for the tools, R to reload, G for another guy, X for the morgue, and somebody's typing */
let typed = '';
document.addEventListener('keydown', e => {
  const tg = e.target; if (tg && (tg.tagName === 'INPUT' || tg.tagName === 'TEXTAREA' || tg.isContentEditable)) return;
  if (G.recap && G.recap.isOpen && G.recap.isOpen()) return;
  if (G.blocked()) return;
  const n = parseInt(e.key, 10); if (n >= 1 && n <= TOOLS.length && !e.ctrlKey && !e.metaKey && !e.altKey) TL.set(TOOLS[n - 1].id);
  const k = e.key.toLowerCase();
  if (k === 'r' && tool === 'gun') reload();
  typed = (typed + k).slice(-12);
  if (typed.endsWith('yeehaw')) { typed = ''; yeehaw(); }
});
/* hats for everyone, and something rolls past */
function yeehaw() {
  G.hatsForAll = true; for (const g of G.guys) { g.look.hat = true; g.hatOn = true; }
  if (G.gibs) { const w = G.gibs.gib('weed', -30, G.H() - 40, 7 + Math.random() * 3, -2, 14); w.born = G.t - 18; B.setAngularVelocity(w.body, 0.25); }
  G.emit('sfx', 'whistle', {});
}

/* ------------------------------------------------------------ every step: fuses, smoke, slow motion, a weapon coming at his face */
TL.step = function (h) {
  for (let i = fx.length - 1; i >= 0; i--) { const f = fx[i]; f.t++; if (f.t > f.life) fx.splice(i, 1); }
  for (let i = smoke.length - 1; i >= 0; i--) { const s = smoke[i]; s.x += s.vx; s.y += s.vy; s.vx *= 0.98; s.vy = s.vy * 0.98 - 0.02; s.r += 0.35; s.life--; if (s.life <= 0) smoke.splice(i, 1); }
  for (let i = tnts.length - 1; i >= 0; i--) { const t = tnts[i]; t.fuse -= h; const tip = G.toWorld(t.body, 0, -12 * S); if (Math.random() < 0.7) fx.push({ kind: 'spark', x: tip.x, y: tip.y, vx: rnd(-1.5, 1.5), vy: rnd(-2, 0.5), t: 0, life: 12 }); if (t.fuse <= 0) { tnts.splice(i, 1); explode(t); } }
  if (slowmo && G.ms() > slowmo) { slowmo = 0; G.engine.timing.timeScale = 1; G.render.canvas.style.filter = ''; }
  /* the cursor swinging a weapon at a guy's head is a threat he can see coming */
  const sp = Math.hypot(pointer.vx, pointer.vy);
  if ((tool === 'hammer' || tool === 'knife') && sp > 500 && G.ms() - pointer.t < 120) for (const g of G.guys) {
    if (!g.alive || g.cleared || !g.br || g.parts.head.gone) continue;
    const hp = g.parts.head.body.position, dx = hp.x - pointer.x, dy = hp.y - pointer.y, dist = Math.hypot(dx, dy);
    if (dist < 160 && (dx * pointer.vx + dy * pointer.vy) / (dist * sp + 1) > 0.6) g.br.cursorThreat = { x: pointer.x, y: pointer.y, t: dist / sp, until: G.t + 0.35 };
  }
};
TL.drawFx = function (ctx) {
  for (const t of tnts) { const b = t.body; ctx.save(); ctx.translate(b.position.x, b.position.y); ctx.rotate(b.angle); ctx.fillStyle = '#b81818'; ctx.strokeStyle = '#000'; ctx.lineWidth = 1.2; ctx.fillRect(-3.5 * S, -10 * S, 7 * S, 20 * S); ctx.strokeRect(-3.5 * S, -10 * S, 7 * S, 20 * S); ctx.fillStyle = '#f0e0b0'; ctx.fillRect(-3.5 * S, -2 * S, 7 * S, 4 * S); ctx.fillStyle = '#111'; ctx.font = `bold ${Math.round(3 * S)}px monospace`; ctx.textAlign = 'center'; ctx.fillText('TNT', 0, 1 * S); ctx.strokeStyle = '#555'; ctx.beginPath(); ctx.moveTo(0, -10 * S); ctx.quadraticCurveTo(2 * S, -12 * S, 0, -10 * S - 3 * S * Math.max(0.2, t.fuse / 2.6)); ctx.stroke(); ctx.restore(); }
  /* bullet holes in the fridges stay on the fridge */
  for (const f of G.fridges()) { const hs = f.plugin && f.plugin.holes; if (!hs) continue; for (const h of hs) { const w = G.toWorld(f, h.x, h.y); ctx.fillStyle = '#111'; ctx.beginPath(); ctx.arc(w.x, w.y, 2.2, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = 'rgba(220,220,220,0.7)'; ctx.lineWidth = 0.8; ctx.beginPath(); ctx.arc(w.x, w.y, 3.4, 0, Math.PI * 2); ctx.stroke(); } }
  for (const s of smoke) { ctx.fillStyle = `rgba(${s.c},${s.c},${s.c},${Math.min(0.5, s.life / 120)})`; ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill(); }
  for (const f of fx) {
    const k = 1 - f.t / f.life;
    if (f.kind === 'spark') { f.x += f.vx; f.y += f.vy; f.vy += 0.1; ctx.fillStyle = `rgba(255,${180 + Math.random() * 75},60,${k})`; ctx.fillRect(f.x, f.y, 2, 2); }
    else if (f.kind === 'flash') { const gr = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.r * (1.2 - k * 0.4)); gr.addColorStop(0, `rgba(255,250,220,${k})`); gr.addColorStop(0.4, `rgba(255,170,40,${k * 0.8})`); gr.addColorStop(1, 'rgba(255,80,0,0)'); ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2); ctx.fill(); }
    else if (f.kind === 'muzzle') { ctx.fillStyle = `rgba(255,230,150,${k * 0.9})`; ctx.beginPath(); for (let i = 0; i < 10; i++) { const a = i / 10 * Math.PI * 2, rr = (i % 2 ? 4 : 11) * (1 + (1 - k)); ctx.lineTo(f.x + Math.cos(a) * rr, f.y + Math.sin(a) * rr); } ctx.fill(); }
    else if (f.kind === 'slash') { ctx.strokeStyle = `rgba(255,255,255,${k * 0.8})`; ctx.lineWidth = 2 * k + 0.5; ctx.beginPath(); ctx.moveTo(f.x, f.y); ctx.lineTo(f.x2, f.y2); ctx.stroke(); }
    else if (f.kind === 'ring') { ctx.strokeStyle = `rgba(255,255,255,${k * 0.6})`; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(f.x, f.y, f.r * (1 - k) + 4, 0, Math.PI * 2); ctx.stroke(); }
  }
};

/* the console, as before */
Object.assign(window.GORE || (window.GORE = {}), {
  shoot, hammer, slice, yeehaw, reload,
  explode: (x, y) => { placeTnt(x, y); const t = tnts[tnts.length - 1]; if (t) t.fuse = 0; },
  get particles() { return G.blood ? G.blood.count() : 0; }, get gibs() { return G.gibs ? G.gibs.list : []; }, get guts() { return G.gibs ? G.gibs.guts : []; }
});
TL.tnts = tnts;
})();
