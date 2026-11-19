/* ============================================================
   THE GUY, version three: the wiring.
   hooks every system into the page's own engine and renderer, runs
   the guys' lives (the one waiting in the corner, any extras you
   call in, the dead ones until they're taken away), keeps the page's
   old ragdollParts / guyActivated in step, and hands the console a
   window.GORE that still answers to version two's calls.
============================================================ */
(function () {
'use strict';
const G = window.__G3; if (!G || !G.body || !G.brain) return;
const M = G.M, B = G.B, A = G.A, BODY = G.body, BR = G.brain, S = G.S;
const T = G.TUNE;
let bodyCount = 0; try { bodyCount = +localStorage.getItem('ffs_bodycount') || 0; } catch (e) {}
/* where the waiting guy stands: left of the tool bar on a wide screen, under it (it's a column there) on a phone */
G.homeX = () => G.W() < 880 || G.coarse ? G.W() - 78 : Math.max(120, G.W() - 450);
G.floorY = () => G.H();

/* ------------------------------------------------------------ the guys */
G.spawn = function (opt = {}) {
  if (G.guys.filter(g => g.alive && !g.cleared).length >= T.maxGuys && !opt.force) return null;
  bodyCount++; try { localStorage.setItem('ffs_bodycount', String(bodyCount)); } catch (e) {}
  const dusty = opt.dusty != null ? opt.dusty : Math.random() < 1 / 30;
  let x = opt.x != null ? opt.x : G.homeX();
  if (!opt.home && opt.x == null) x = clearSpot();
  const g = BODY.create(x, G.floorY() - 0.5, { n: bodyCount, dusty, name: dusty ? 'Dusty' : opt.name, home: !!opt.home, hat: G.hatsForAll });
  BR.init(g);
  if (G.dmg) G.dmg.init(g);
  if (G.flesh) G.flesh.init(g);
  if (opt.home) prompt(g);
  shim();
  return g;
};
/* somewhere on the floor nobody is standing and no fridge is sitting */
function clearSpot() {
  const w = G.W(), taken = [];
  for (const g of G.guys) if (!g.cleared) { const c = BODY.com(g); taken.push([c.x - 40 * S, c.x + 40 * S]); }
  for (const f of G.fridges()) if (f.position.y > G.H() - 260) taken.push([f.bounds.min.x - 14 * S, f.bounds.max.x + 14 * S]);
  for (let i = 0; i < 40; i++) {
    const x = G.rnd(60, w - 60); if (x > G.homeX() - 50 * S && x < G.homeX() + 50 * S) continue;
    if (!taken.some(([a, b]) => x > a && x < b)) return x;
  }
  return G.rnd(80, w - 80);
}
G.homeGuy = () => G.guys.find(g => g.home && !g.cleared && g.alive) || null;
/* the [click me] under the waiting guy's feet */
function prompt(g) {
  const pr = document.getElementById('guyPrompt'); if (!pr || !g) return;
  pr.style.display = 'block'; pr.style.right = 'auto'; pr.style.bottom = 'auto';
  /* beside him at hip height, now that he stands on the real floor */
  const c = g.parts.pelvis.body.position;
  pr.style.left = Math.max(4, c.x - 30 * S - 62) + 'px'; pr.style.top = (c.y - 8) + 'px';
}
function hidePrompt() { const pr = document.getElementById('guyPrompt'); if (pr) pr.style.display = 'none'; }
/* he's been touched: from now on he's in the music's way, like version two's woken guy */
G.wake = function (g) {
  if (!g || g.awake) return;
  g.awake = true; g.wokeT = G.t;
  if (g.home) hidePrompt();
  shim();
  G.emit('wake', g);
};
/* the page still asks after ragdollParts and guyActivated: the music bounces every awake guy */
function shim() {
  const live = G.guys.filter(g => g.awake && g.alive && !g.cleared);
  try { ragdollParts = live.flatMap(g => g.list.filter(p => p.attached && !p.gone && !p.removed).map(p => p.body)); } catch (e) {}
  try { guyActivated = live.length > 0; } catch (e) {}
}
G.shim = shim;

G.on('death', g => {
  shim();
  try { VENDOR.noteGuyKill(); } catch (e) {}
  const c = G.recap && G.recap.close ? G.recap.close(g) : null;
  if (c) G.cases.push(c); while (G.cases.length > T.morgue) G.cases.shift();
  setTimeout(() => { if (G.recap && G.recap.tag) G.recap.tag(g); }, 900);
  g.clearAt = G.ms() + T.respawnAfter * 1000;
});
G.on('sever', g => { BR.topology(g); shim(); });

function clearGuy(g) {
  if (g.gone) return;
  g.gone = G.ms();
  if (G.recap && G.recap.final) try { G.recap.final(g); } catch (e) { G.err('recap.final', e); }
  setTimeout(() => {
    if (G.gibs && G.gibs.adopt) G.gibs.adopt(g);          /* the bits that came off stay on the floor a while */
    BODY.destroy(g, !!G.gibs);
    shim();
    if (g.home && !G.homeGuy()) G.spawn({ home: true });
  }, T.fadeTime * 1000);
}
G.clearGuy = clearGuy;

/* ------------------------------------------------------------ every step: before the engine moves anything */
let lastStepMs = 1000 / 60;
M.Events.on(G.engine, 'beforeUpdate', ev => {
  const dms = (ev && ev.delta) || G.engine.timing.lastDelta || 1000 / 60;
  const h = dms / 1000 * (G.engine.timing.timeScale || 1);
  lastStepMs = dms;
  G.dt = h; G.t += h;
  if (G.away()) return;
  for (const g of G.guys) {
    if (g.cleared) continue;
    try { BR.update(g, h); } catch (e) { G.err('brain', e); }
    if (!g.awake && g.br && g.br.s && g.br.s.held) G.wake(g);              /* picked up: he's in it now */
  }
});
/* new contacts, before the solver: how fast things were closing */
M.Events.on(G.engine, 'collisionStart', ev => { if (G.dmg) try { G.dmg.collisions(ev.pairs); } catch (e) { G.err('collisions', e); } });
/* after the solver: what's touching what, how hard; then his body's own bookkeeping */
M.Events.on(G.engine, 'afterUpdate', () => {
  const h = G.dt;
  for (const g of G.guys) if (!g.cleared) BODY.clearContacts(g);
  const pairs = G.engine.pairs.list;
  for (let i = 0; i < pairs.length; i++) {
    const pr = pairs[i]; if (!pr.isActive) continue;
    const pa = pr.bodyA.plugin && pr.bodyA.plugin.part, pb = pr.bodyB.plugin && pr.bodyB.plugin.part;
    if (!pa && !pb) continue;
    let imp = 0, tim = 0; const ac = pr.activeContacts; for (let k = 0; k < ac.length; k++) { imp -= ac[k].normalImpulse; tim += Math.abs(ac[k].tangentImpulse); }
    const n = pr.collision.normal, sp = pr.collision.supports[0] || pr.bodyA.position;
    if (pa) addContact(pa, pr.bodyB, n.x, n.y, sp, imp, tim, pr);
    if (pb) addContact(pb, pr.bodyA, -n.x, -n.y, sp, imp, tim, pr);
  }
  for (const g of G.guys) {
    if (g.cleared) continue;
    try { BR.clamp(g); } catch (e) { G.err('clamp', e); }
    BODY.updateLoose(g);
    if (G.dmg) try { G.dmg.step(g, h); } catch (e) { G.err('dmg.step', e); }
    if (!g.alive && g.clearAt && G.ms() > g.clearAt && !g.gone) clearGuy(g);
  }
  if (G.dmg && G.dmg.after) try { G.dmg.after(h); } catch (e) { G.err('dmg.after', e); }
  if (G.blood) try { G.blood.step(h); } catch (e) { G.err('blood', e); }
  if (G.gibs) try { G.gibs.step(h); } catch (e) { G.err('gibs', e); }
  if (G.tools && G.tools.step) try { G.tools.step(h); } catch (e) { G.err('tools', e); }
  if (G.audio && G.audio.step) try { G.audio.step(h); } catch (e) { G.err('audio', e); }
});
function addContact(p, other, nx, ny, pt, imp, tim, pr) {
  const vp = G.pointVel(p.body, pt.x, pt.y), vo = other.isStatic ? { x: 0, y: 0 } : G.pointVel(other, pt.x, pt.y);
  const rvx = vp.x - vo.x, rvy = vp.y - vo.y, vn = rvx * nx + rvy * ny;
  const tvx = rvx - vn * nx, tvy = rvy - vn * ny;
  p.contacts.push({ other, n: { x: nx, y: ny }, pt: { x: pt.x, y: pt.y }, imp, tim, tv: Math.hypot(tvx, tvy), tdir: { x: tvx, y: tvy }, st: other.isStatic, pr });
}

/* ------------------------------------------------------------ drawing: after the page has drawn its fridges */
M.Events.on(G.render, 'afterRender', () => {
  if (G.draw) try { G.draw(G.render.context); } catch (e) { G.err('draw', e); }
  else debugDraw(G.render.context);
});
function debugDraw(ctx) {
  ctx.save();
  for (const g of G.guys) {
    for (const p of g.list) {
      if (p.gone || p.removed) continue;
      const b = p.body; ctx.beginPath(); const v = b.vertices; ctx.moveTo(v[0].x, v[0].y); for (let i = 1; i < v.length; i++) ctx.lineTo(v[i].x, v[i].y); ctx.closePath();
      ctx.fillStyle = p.attached ? '#c8a080' : '#806050'; ctx.fill(); ctx.strokeStyle = '#000'; ctx.lineWidth = 1; ctx.stroke();
    }
  }
  ctx.restore();
}

/* ------------------------------------------------------------ the window */
window.addEventListener('resize', () => {
  setTimeout(() => {
    const g = G.homeGuy();
    if (g && !g.awake) {
      const dx = G.homeX() - BODY.com(g).x, dy = G.floorY() - 0.5 - (g.parts.footL.body.position.y + 2.5 * S);
      for (const p of g.list) B.setPosition(p.body, { x: p.body.position.x + dx, y: p.body.position.y + dy });
      prompt(g);
    }
  }, 160);
});

/* ------------------------------------------------------------ the console, and version two's names for things */
const v2id = id => (A.byId[id] || A.jointById[id]) ? id : (A.V2[id] || id);
const cur = () => G.guys.find(g => !g.cleared && g.alive) || G.guys.find(g => !g.cleared) || null;
const api = {
  get guy() { return cur(); },
  get guys() { return G.guys; },
  get cases() { return G.cases; },
  tool: id => G.tools && G.tools.set(id),
  hurt: (id, d, k = 'blunt') => { const g = cur(), p = g && g.parts[v2id(id)]; if (p && G.dmg) G.dmg.direct(g, p, d, k); },
  sever: id => { const g = cur(), j = g && g.jointById[v2id(id)]; if (j) { G.wake(g); if (G.dmg) G.dmg.tear(g, j, 'torn'); else BODY.sever(g, j, 'torn'); } },
  wake: () => G.wake(cur()),
  spawn: o => G.spawn(o || {}),
  respawn: (o = {}) => { for (const g of G.guys.slice()) { if (!g.home) continue; BODY.destroy(g); } return G.spawn(Object.assign({ home: true }, o)); },
  count: () => bodyCount,
  log: G.log, errs: G.errs,
  G
};
/* the tools file already put its own calls on GORE: keep them */
const prev = window.GORE || {};
for (const k of Object.keys(prev)) if (!(k in api)) Object.defineProperty(api, k, Object.getOwnPropertyDescriptor(prev, k));
window.GORE = api;
/* let the rest of the files finish loading, then the first guy */
G.boot = function () { if (!G.homeGuy()) G.spawn({ home: true }); shim(); };
})();
