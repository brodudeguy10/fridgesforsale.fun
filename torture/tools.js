/* ============================================================
   TORTURE ROOM: the tools, and the hand.
   one registry every tool file adds itself to (its group, its
   variants, what the mouse does with it), the mouse and keys turned
   into room coordinates, the right button that's always the hand,
   shift-click to take something back out, and the stand-in the
   guy's brain reads to know where the cursor is and whether a gun
   is pointed at him.
============================================================ */
(function () {
  'use strict';
  var G = window.__G3, M = Matter, B = M.Body, Q = M.Query, R = window.TR_ROOM;
  var clamp = G.clamp, rnd = G.rnd, S = G.S;
  var T = TR.tools = { list: [], byId: {}, groups: [], cur: null, variant: {}, hotAnchor: null, settings: {} };
  /* the palette, in order: the number keys pick these */
  T.groups = [
    { id: 'hand', name: 'HAND', key: '1' }, { id: 'restraint', name: 'RESTRAINTS', key: '2' }, { id: 'guns', name: 'FIREARMS', key: '3' },
    { id: 'blades', name: 'BLADES', key: '4' }, { id: 'saw', name: 'CHAINSAW', key: '5' }, { id: 'spikes', name: 'SPIKES & NAILS', key: '6' }, { id: 'staple', name: 'STAPLE GUN', key: '7' }
  ];
  T.add = function (def) { def.variants = def.variants || [{ id: 'normal', name: 'NORMAL', help: '' }]; T.list.push(def); T.byId[def.id] = def; T.variant[def.id] = 0; return def; };
  T.v = function (id) { var d = T.byId[id || (T.cur && T.cur.id)]; return d ? d.variants[T.variant[d.id]].id : null; };
  T.select = function (id) {
    var d = T.byId[id]; if (!d || d === T.cur) return;
    if (T.cur && T.cur.deselect) T.cur.deselect();
    T.cur = d; if (d.select) d.select();
    if (TR.ui) TR.ui.onTool();
    if (TR.sfx) TR.sfx.toolSwap(d.group);
    try { localStorage.setItem('ffs_torture_tool', id); } catch (e) {}
  };
  T.cycle = function (dir) { var i = T.list.indexOf(T.cur); T.select(T.list[(i + dir + T.list.length) % T.list.length].id); };
  T.cycleVariant = function (dir) { var d = T.cur; if (!d || d.variants.length < 2) return; T.variant[d.id] = (T.variant[d.id] + dir + d.variants.length) % d.variants.length; if (d.onVariant) d.onVariant(); if (TR.ui) TR.ui.onTool(); if (TR.sfx) TR.sfx.play('click', { gain: 0.25, rate: 1.4 }); };
  T.setVariant = function (i) { var d = T.cur; if (!d) return; T.variant[d.id] = clamp(i, 0, d.variants.length - 1); if (d.onVariant) d.onVariant(); if (TR.ui) TR.ui.onTool(); };

  /* ---------------- the pointer, in room coordinates */
  var P = T.pointer = { x: R.W / 2, y: R.H / 2, sx: 0, sy: 0, vx: 0, vy: 0, t: 0, down: false, right: false, shift: false, hist: [], over: false, last: null };
  function track(x, y) {
    var now = performance.now();
    P.hist.push({ x: x, y: y, t: now }); while (P.hist.length > 2 && now - P.hist[0].t > 90) P.hist.shift();
    var bx = 0, by = 0, best = -1;
    for (var i = 1; i < P.hist.length; i++) { var a = P.hist[i - 1], b = P.hist[i], dt = Math.max(8, b.t - a.t), vx = (b.x - a.x) / dt * 1000, vy = (b.y - a.y) / dt * 1000; if (vx * vx + vy * vy > best) { best = vx * vx + vy * vy; bx = vx; by = vy; } }
    P.vx = bx; P.vy = by; P.last = { x: P.x, y: P.y }; P.x = x; P.y = y; P.t = now;
    window.mouseConstraint.mouse.position.x = x; window.mouseConstraint.mouse.position.y = y;
  }
  T.speed = function () { return Math.hypot(P.vx, P.vy); };

  /* ---------------- finding things under a point */
  T.guyBodies = function () { var out = []; for (var i = 0; i < G.guys.length; i++) { var g = G.guys[i]; if (g.cleared) continue; for (var j = 0; j < g.list.length; j++) { var p = g.list[j]; if (!p.gone && !p.removed) out.push(p.body); } } if (G.gibs) for (i = 0; i < G.gibs.loose.length; i++) { var L = G.gibs.loose[i]; if (!L.p.removed) out.push(L.p.body); } return out; };
  T.partAt = function (x, y, slop) {
    var bs = T.guyBodies(), hit = Q.point(bs, { x: x, y: y });
    if (!hit.length && slop) { for (var a = 0; a < 8 && !hit.length; a++) { var an = a / 8 * Math.PI * 2; hit = Q.point(bs, { x: x + Math.cos(an) * slop, y: y + Math.sin(an) * slop }); } }
    if (!hit.length) return null;
    var d = function (b) { return Math.hypot(b.position.x - x, b.position.y - y) - b.plugin.part.def.layer * 1.5; };
    return hit.sort(function (a, b) { return d(a) - d(b); })[0].plugin.part;
  };
  T.loc = function (p, x, y) { return G.toLocal(p.body, x, y); };
  /* anything else the hand can pick up: bits, guts, the light, shell casings */
  T.thingAt = function (x, y) {
    var c = [];
    if (G.gibs) { for (var i = 0; i < G.gibs.list.length; i++) c.push(G.gibs.list[i].body); for (i = 0; i < G.gibs.guts.length; i++) c.push.apply(c, G.gibs.guts[i].links); }
    if (TR.room.lamp.body) c.push(TR.room.lamp.body);
    if (T.extraBodies) c.push.apply(c, T.extraBodies());
    var hit = Q.point(c, { x: x, y: y }); return hit.length ? hit[0] : null;
  };

  /* ---------------- the hand */
  var grab = null, flap = null;
  function handDown(x, y, strong) {
    /* a flap of his skin hanging loose: take hold of that, not the part (skin.js peels it) */
    var fl = G.skin && G.skin.pick(x, y);
    if (fl) { flap = fl; G.skin.grab(fl, x, y); if (TR.sfx) TR.sfx.play('cloth', { x: x, gain: 0.2, rate: 1.3 }); return true; }
    var p = T.partAt(x, y, 3), body = p ? p.body : T.thingAt(x, y);
    if (!body || body.isStatic) { if (TR.sfx) TR.sfx.play('whoosh', { x: x, gain: 0.08, rate: 1.6 }); return false; }
    var off = { x: x - body.position.x, y: y - body.position.y };
    var c = M.Constraint.create({ pointA: { x: x, y: y }, bodyB: body, pointB: off, length: 0, stiffness: T.grabK(p, strong), damping: strong ? 0.08 : 0.02, render: { visible: false } });
    M.World.add(engine.world, c); grab = { c: c, body: body, part: p, strong: strong, t0: G.t };
    window.mouseConstraint.constraint = c;
    if (p && p.guy) { G.wake(p.guy); if (p.guy.dm) p.guy.dm.lastPull = strong ? 'torn off by hand' : 'pulled apart by hand'; G.emit('sfx', 'grab', { x: x, part: p.kind }); if (TR.sfx) TR.sfx.play('cloth', { x: x, gain: 0.25 }); }
    return true;
  }
  /* how hard the hand holds: a light part (a hand, a forearm) gets a firmer grip, or the weight of the rest of him
     on the other end of the arm leaves it trailing far behind the cursor */
  T.grabK = function (p, strong) { if (strong) return 0.55; if (!p || !p.def.mass) return 0.2; return clamp(0.2 * Math.sqrt(0.1 / p.def.mass), 0.2, 0.6); };
  function handMove(x, y) { if (flap) { if (G.skin.alive(flap)) G.skin.move(flap, x, y); else flap = null; } if (grab) { grab.c.pointA.x = x; grab.c.pointA.y = y; } }
  /* the part in the hand broke in two: the hand has whichever piece it was holding (body.js moved the grip already) */
  G.on('split', function () { if (grab && grab.c && grab.c.bodyB !== grab.body) { grab.body = grab.c.bodyB; grab.part = grab.body.plugin && grab.body.plugin.part || grab.part; } });
  function handUp() {
    if (flap) { G.skin.release(flap); flap = null; }
    if (!grab) return;
    var was = grab, sp = Math.hypot(P.vx, P.vy), moving = performance.now() - P.t < 90;
    try { M.World.remove(engine.world, grab.c); } catch (e) {}
    window.mouseConstraint.constraint = { bodyB: null, pointB: null };
    grab = null;
    /* a throw: let go while the mouse is still moving and he goes the way it was going, all of him, the part you
       held a little ahead of the rest (the spring alone loses the flick if he'd caught up with the cursor) */
    if (moving && sp > 150 && !was.body.isStatic) {
      var vx = P.vx / 60, vy = P.vy / 60, cap = Math.min(1, 26 / Math.hypot(vx, vy)); vx *= cap; vy *= cap;
      var p = was.part, bodies = p && p.guy && p.attached ? p.guy.list.filter(function (q) { return q.attached && !q.removed && !q.gone; }).map(function (q) { return q.body; }) : [was.body];
      bodies.forEach(function (b) { var w = b === was.body ? 0.7 : 0.45; B.setVelocity(b, { x: b.velocity.x + (vx - b.velocity.x) * w, y: b.velocity.y + (vy - b.velocity.y) * w }); });
      if (p && p.guy) G.wake(p.guy);
      if (TR.sfx) TR.sfx.swish(clamp(sp / 1400, 0.25, 1), P.x);
    }
  }
  T.holding = function () { return grab; };
  T.dropGrabOn = function (body) { if (grab && grab.body === body) handUp(); };
  T.add({
    id: 'hand', group: 'hand', name: 'HAND',
    help: 'grab any part of him and drag. let go mid-swing to throw. pull hard enough and something gives.',
    variants: [{ id: 'grab', name: 'GRAB', help: 'a firm hold. throw him, swing him, pull him into things.' }, { id: 'rip', name: 'RIP', help: 'a grip that doesn\'t let go: pull a limb hard and it comes off.' }],
    cursor: 'grab',
    down: function (pt) { handDown(pt.x, pt.y, T.v('hand') === 'rip'); },
    move: function (pt) { handMove(pt.x, pt.y); },
    up: function () { handUp(); }
  });

  /* ---------------- the stand-in for the fridge page's tool bar: the guy's brain asks it what you're holding */
  var V3 = { hand: 'hand', rope: 'hand', chain: 'hand', pistol: 'gun', shotgun: 'gun', rifle: 'gun', razor: 'knife', scalpel: 'knife', knife: 'knife', chainsaw: 'knife', spike: 'hand', staple: 'knife' };
  G.tools = { pointer: P, current: function () { return P.right ? 'hand' : (T.cur ? V3[T.cur.id] || 'hand' : 'hand'); }, set: function (id) { T.select(id); }, step: function () {}, drawFx: function () {}, partAt: T.partAt,
    /* where the gun's muzzle is, when a gun's in hand: his brain works out from it whether it's pointed at him */
    muzzle: function () { return TR.gunMuzzle ? TR.gunMuzzle() : null; } };

  /* ---------------- taking things back out: shift-click, or a tool's remove variant */
  T.removers = [];
  T.removeAt = function (x, y) {
    var best = null, bd = 9;
    for (var i = 0; i < T.removers.length; i++) { var r = T.removers[i].near(x, y); if (r && r.d < bd) { bd = r.d; best = r; } }
    if (best) { best.remove(); if (TR.sfx) TR.sfx.play('latch', { x: x, gain: 0.3, rate: 1.3 }); return true; }
    return false;
  };

  /* ---------------- input */
  var view = document.getElementById('tr-view');
  function pt(e) { var w = TR.cam.toWorld(e.clientX, e.clientY); return { x: w.x, y: w.y, sx: e.clientX, sy: e.clientY, shift: e.shiftKey, alt: e.altKey }; }
  var activeBtn = -1;
  view.addEventListener('contextmenu', function (e) { e.preventDefault(); });
  view.addEventListener('pointerdown', function (e) {
    if (TR.paused) return;
    try { window.ensureAudioContext(); } catch (er) {}
    var p = pt(e); track(p.x, p.y); P.shift = e.shiftKey;
    try { view.setPointerCapture(e.pointerId); } catch (er) {}
    e.preventDefault();
    if (e.button === 2) { P.right = true; activeBtn = 2; handDown(p.x, p.y, false); if (TR.ui) TR.ui.onTool(); return; }
    if (e.button !== 0) return;
    activeBtn = 0; P.down = true;
    if (e.shiftKey && T.removeAt(p.x, p.y)) { P.down = false; activeBtn = -1; return; }
    if (T.cur && T.cur.down) T.cur.down(p, e);
  });
  view.addEventListener('pointermove', function (e) {
    var p = pt(e); track(p.x, p.y); P.over = true; P.shift = e.shiftKey;
    if (TR.paused) return;
    if (activeBtn === 2) { handMove(p.x, p.y); return; }
    if (T.cur && T.cur.move) T.cur.move(p, e, P.down);
  });
  function release(e) {
    if (activeBtn === 2) { handUp(); P.right = false; activeBtn = -1; if (TR.ui) TR.ui.onTool(); return; }
    if (activeBtn !== 0) return;
    activeBtn = -1; P.down = false;
    var p = pt(e);
    if (T.cur && T.cur.up) T.cur.up(p, e);
  }
  view.addEventListener('pointerup', release);
  view.addEventListener('pointercancel', release);
  view.addEventListener('pointerleave', function () { P.over = false; });
  view.addEventListener('wheel', function (e) { e.preventDefault(); if (TR.paused) return; var p = pt(e); if (T.cur && T.cur.wheel) T.cur.wheel(e.deltaY > 0 ? 1 : -1, p, e); else if (T.wheelAny) T.wheelAny(e.deltaY > 0 ? 1 : -1, p, e); }, { passive: false });
  /* the page must never scroll or zoom under the game */
  document.addEventListener('touchmove', function (e) { if (e.target === view) e.preventDefault(); }, { passive: false });
  T.cancel = function () { if (T.cur && T.cur.cancel) return T.cur.cancel(); return false; };

  /* ---------------- the hooks the loop calls */
  T.mods = [];   /* physics helpers that aren't tools (ropes run whatever's selected) */
  T.preStep = function (sub) { for (var i = 0; i < T.mods.length; i++) if (T.mods[i].preStep) T.mods[i].preStep(sub); if (grab && grab.body && grab.part && (grab.part.removed || grab.part.gone)) handUp(); };
  T.postStep = function (sub) { for (var i = 0; i < T.mods.length; i++) if (T.mods[i].postStep) T.mods[i].postStep(sub); };
  T.frame = function (dt) {
    if (dt > 0) {
      for (var i = 0; i < T.mods.length; i++) if (T.mods[i].frame) T.mods[i].frame(dt);
      if (T.cur && T.cur.frame) T.cur.frame(dt, P);
    }
    T.hotAnchor = (T.cur && (T.cur.id === 'rope' || T.cur.id === 'chain')) ? TR.room.anchorNear(P.x, P.y, 14) : null;
    view.style.cursor = P.right ? 'grabbing' : (T.cur && T.cur.cursor) || 'default';
    if (P.right) view.style.cursor = 'grabbing';
  };
  T.fastest = function () { var v = 0; for (var i = 0; i < T.mods.length; i++) if (T.mods[i].fastest) v = Math.max(v, T.mods[i].fastest()); return v; };
  T.drawBack = function (ctx) { for (var i = 0; i < T.mods.length; i++) if (T.mods[i].drawBack) T.mods[i].drawBack(ctx); };
  T.drawFront = function (ctx) { for (var i = 0; i < T.mods.length; i++) if (T.mods[i].drawFront) T.mods[i].drawFront(ctx); };
  T.drawOver = function (ctx) {
    for (var i = 0; i < T.mods.length; i++) if (T.mods[i].drawOver) T.mods[i].drawOver(ctx);
    if (P.over && !TR.paused && !P.right && T.cur && T.cur.drawCursor) T.cur.drawCursor(ctx, P);
    if (grab) { var b = grab.body, w = { x: b.position.x + grab.c.pointB.x, y: b.position.y + grab.c.pointB.y }; ctx.strokeStyle = 'rgba(232,210,122,0.45)'; ctx.lineWidth = 0.6; ctx.setLineDash([2, 2]); ctx.beginPath(); ctx.moveTo(w.x, w.y); ctx.lineTo(grab.c.pointA.x, grab.c.pointA.y); ctx.stroke(); ctx.setLineDash([]); ctx.fillStyle = 'rgba(232,210,122,0.8)'; ctx.beginPath(); ctx.arc(w.x, w.y, 1.4, 0, Math.PI * 2); ctx.fill(); }
  };
  T.reset = function () { handUp(); for (var i = 0; i < T.mods.length; i++) if (T.mods[i].reset) T.mods[i].reset(); for (i = 0; i < T.list.length; i++) if (T.list[i].reset) T.list[i].reset(); };
  T.mods.push({ id: 'hand' });
  window.addEventListener('blur', function () { handUp(); P.right = false; P.down = false; activeBtn = -1; });
})();

