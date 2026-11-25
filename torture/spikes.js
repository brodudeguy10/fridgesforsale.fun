/* ============================================================
   TORTURE ROOM: spikes, nails, staples.
   a spike is a steel point set in the floor, a wall, the ceiling
   or the air: drop him on it, throw him at it, or lay him on it,
   and the part that meets the point goes on, held to the shaft,
   free to slide down it under his weight, torn off if he's pulled
   away sideways. the nail gun pins a part to the wall behind him
   (pull hard enough and it tears out through him). the staple gun
   joins two parts of him, or tacks one to the wall, or just puts
   staples in him. all of it stays until it's taken out.
============================================================ */
(function () {
  'use strict';
  var G = window.__G3, M = Matter, B = M.Body, R = window.TR_ROOM, T = TR.tools;
  var clamp = G.clamp, rnd = G.rnd, S = G.S;
  var dctx = document.getElementById('driedBloodCanvas').getContext('2d');
  var SPIKE_L = 44, SPIKE_W = 6;
  var spikes = TR.spikes = [], nails = TR.nails = [], staples = TR.staples = [];
  /* a limb that broke in two with a spike, a nail or a staple in it: it stays in whichever piece it went into */
  G.on('split', function (g, p, p2, ys) {
    var mv = function (o, k) { if (o && o[k] === p && o.l && o.l.y > ys) o[k] = p2; };
    spikes.forEach(function (sp) { sp.on.forEach(function (e) { mv(e, 'part'); }); });
    nails.forEach(function (nl) { mv(nl, 'part'); });
    staples.forEach(function (st) { mv(st.a, 'p'); mv(st.b, 'p'); });
  });
  var flyNails = [], firstStaple = null, press = {}, hits = [];
  var preview = { a: -Math.PI / 2, free: -Math.PI / 2 };

  /* ---------------- where a spike goes */
  /* the surface nearest a point, if there's one close: the floor, the ceiling, a side wall. each one's spikes point out of it */
  function surfaceNear(x, y) {
    var c = [{ d: R.H - y, x: x, y: R.H, a: -Math.PI / 2 }, { d: y, x: x, y: 0, a: Math.PI / 2 }, { d: x, x: 0, y: y, a: 0 }, { d: R.W - x, x: R.W, y: y, a: Math.PI }], best = null;
    for (var i = 0; i < c.length; i++) if (c[i].d > -30 && Math.abs(c[i].d) < 26 && (!best || Math.abs(c[i].d) < Math.abs(best.d))) best = c[i];
    return best;
  }
  function placement(x, y) {
    var v = T.v('spike');
    if (v === 'wall') {
      var s = surfaceNear(x, y);
      /* flush with the surface it's in, and not jammed into a corner along it */
      if (s) { var side = Math.abs(Math.cos(s.a)) > 0.5; return { x: side ? s.x : clamp(s.x, 4, R.W - 4), y: side ? clamp(s.y, 4, R.H - 4) : s.y, a: s.a, onSurface: true }; }
      return { x: x, y: y, a: preview.a, onSurface: false };
    }
    return { x: x, y: y, a: preview.free, onSurface: false };
  }
  function addSpike(pl) {
    var u = { x: Math.cos(pl.a), y: Math.sin(pl.a) }, n = { x: -u.y, y: u.x };
    var base = { x: pl.x, y: pl.y }, tip = { x: base.x + u.x * SPIKE_L, y: base.y + u.y * SPIKE_L };
    var A = { x: base.x + n.x * SPIKE_W / 2, y: base.y + n.y * SPIKE_W / 2 }, C = { x: base.x - n.x * SPIKE_W / 2, y: base.y - n.y * SPIKE_W / 2 };
    var cx = (A.x + C.x + tip.x) / 3, cy = (A.y + C.y + tip.y) / 3;
    var body = M.Body.create({ position: { x: cx, y: cy }, vertices: [{ x: A.x - cx, y: A.y - cy }, { x: tip.x - cx, y: tip.y - cy }, { x: C.x - cx, y: C.y - cy }], isStatic: true, friction: 0.2, label: 'spike' });
    var sp = { id: Math.random(), base: base, tip: tip, u: u, n: n, L: SPIKE_L, body: body, on: [], blood: 0, onSurface: pl.onSurface, restoreT: 0 };
    body.plugin = { spike: sp, name: { src: 'a spike', kind: 'spike', mat: 'metal' }, area: 'edge' };
    M.World.add(engine.world, body); spikes.push(sp);
    if (TR.sfx) TR.sfx.spike(base.x);
    if (pl.onSurface) { dctx.save(); dctx.fillStyle = 'rgba(40,38,35,0.5)'; dctx.beginPath(); dctx.ellipse(base.x, base.y, Math.abs(n.x) * 6 + 1, Math.abs(n.y) * 6 + 1, 0, 0, Math.PI * 2); dctx.fill(); dctx.restore(); }
    return sp;
  }
  function removeSpike(sp) {
    for (var i = sp.on.length - 1; i >= 0; i--) offSpike(sp, sp.on[i], false);
    var k = spikes.indexOf(sp); if (k >= 0) spikes.splice(k, 1);
    try { M.World.remove(engine.world, sp.body); } catch (e) {}
    var pre = sp.id + ':'; for (var key in press) if (key.indexOf(pre) === 0) delete press[key];
  }
  /* a point on the shaft, s back from the tip */
  function Qs(sp, s) { return { x: sp.tip.x - sp.u.x * s, y: sp.tip.y - sp.u.y * s }; }

  /* ---------------- on it, and off it */
  function impale(sp, part, pt, vrel) {
    var g = part.guy, l = T.loc(part, pt.x, pt.y), s0 = Math.max(1, (sp.tip.x - pt.x) * sp.u.x + (sp.tip.y - pt.y) * sp.u.y);
    var con = M.Constraint.create({ pointA: Qs(sp, s0), bodyB: part.body, pointB: { x: pt.x - part.body.position.x, y: pt.y - part.body.position.y }, length: 0, stiffness: 0.7, damping: 0.12, render: { visible: false } });
    M.World.add(engine.world, con);
    var e = { part: part, l: l, s: s0, deep: s0, con: con, strain: 0, t: G.t };
    sp.on.push(e); sp.body.collisionFilter.group = g.group;
    if (g.dm && !g.cleared) {
      var E = 120 + vrel * vrel * 14;
      G.dmg.shot(g, part, { lx: l.x, ly: l.y, wx: pt.x, wy: pt.y, dir: { x: sp.u.x, y: sp.u.y }, exit: vrel > 5.5, size: 1.5, src: 'a spike', srcKind: 'spike', what: 'impaled on a spike', energy: E, boneK: 0.7, painK: 1.2, powder: false, boneWord: 'run through by the spike' });
    }
    sp.blood = Math.min(1, sp.blood + 0.45);
    if (G.blood && !g.dusty) G.blood.spray(pt.x, pt.y, -sp.u.x, -sp.u.y, 16, 4, 1.4, 1.5, g);
    if (TR.sfx) { TR.sfx.play('squish', { x: pt.x, gain: 0.6 }); TR.sfx.play('step_metal', { x: pt.x, gain: 0.25, rate: 0.7 }); }
    if (TR.cam) TR.cam.kick(1);
    G.wake(g);
  }
  /* off it: pulled back over the tip, or ripped off sideways. either way it tears. taken out (the spike removed), it doesn't */
  function offSpike(sp, e, torn) {
    var k = sp.on.indexOf(e); if (k >= 0) sp.on.splice(k, 1);
    try { M.World.remove(engine.world, e.con); } catch (er) {}
    if (torn && e.part && !e.part.removed && !e.part.gone) {
      var g = e.part.guy, w = G.toWorld(e.part.body, e.l.x, e.l.y);
      G.emit('wound', g, e.part, { type: 'tear', lx: e.l.x, ly: e.l.y, dir: sp.u, size: 3, depth: 2 });
      if (G.blood && !g.dusty) G.blood.spray(w.x, w.y, sp.u.x, sp.u.y, 20, 4, 1.6, 1.5, g);
      if (g.dm && g.alive) { g.dm.pain = Math.min(220, g.dm.pain + 25); G.emit('voice', g, 'scream', 0.9); }
      if (TR.sfx) TR.sfx.play('tear', { x: w.x, gain: 0.5 });
    }
    if (!sp.on.length) sp.restoreT = G.t + 0.45;
  }
  /* ---------------- every step: what's on a spike slides along it, against the drag of the meat; pulled clear of the
     point it comes off, pulled sideways hard it tears off; with nothing on it any more it can catch him again */
  function preStep(sub) {
    for (var i = 0; i < spikes.length; i++) {
      var sp = spikes[i];
      if (!sp.on.length && sp.restoreT && G.t > sp.restoreT) { sp.body.collisionFilter.group = 0; sp.restoreT = 0; }
      for (var j = sp.on.length - 1; j >= 0; j--) {
        var e = sp.on[j];
        if (!e.part || e.part.removed || e.part.gone) { offSpike(sp, e, false); continue; }
        var w = G.toWorld(e.part.body, e.l.x, e.l.y), s = (sp.tip.x - w.x) * sp.u.x + (sp.tip.y - w.y) * sp.u.y;
        if (s < -2) { offSpike(sp, e, true); continue; }
        e.s += (clamp(s, 1, sp.L - 3) - e.s) * 0.3 / sub;
        var q = Qs(sp, e.s); e.con.pointA.x = q.x; e.con.pointA.y = q.y;
        var lat = Math.abs((w.x - q.x) * sp.n.x + (w.y - q.y) * sp.n.y);
        if (lat > 9) { e.strain += 1 / (60 * sub); if (e.strain > 0.15) { offSpike(sp, e, true); continue; } } else e.strain = Math.max(0, e.strain - 0.5 / (60 * sub));
        /* further down the shaft: more of it in him, more blood down it */
        if (e.s > e.deep + 5) {
          e.deep = e.s; sp.blood = Math.min(1, sp.blood + 0.08);
          var g = e.part.guy; if (G.blood && !g.dusty) G.blood.spray(w.x, w.y, -sp.u.x * 0.3, -sp.u.y * 0.3, 4, 1.5, 1.2, 1.2, g);
          if (TR.sfx && Math.random() < 0.5) TR.sfx.play('squelch', { x: w.x, gain: 0.25, key: 'spikeslide', gap: 0.2 });
        }
      }
    }
  }
  /* a part that comes at the point fast enough goes on: measured when they first touch, before the physics pushes them apart */
  M.Events.on(engine, 'collisionStart', function (ev) {
    for (var i = 0; i < ev.pairs.length; i++) {
      var pr = ev.pairs[i], sb = pr.bodyA.plugin && pr.bodyA.plugin.spike ? pr.bodyA : pr.bodyB.plugin && pr.bodyB.plugin.spike ? pr.bodyB : null; if (!sb) continue;
      var ob = sb === pr.bodyA ? pr.bodyB : pr.bodyA, part = ob.plugin && ob.plugin.part; if (!part || part.removed || part.gone || !part.guy) continue;
      var sp = sb.plugin.spike, c = pr.collision && pr.collision.supports && pr.collision.supports[0] ? pr.collision.supports[0] : null; if (!c) continue;
      var fromTip = (sp.tip.x - c.x) * sp.u.x + (sp.tip.y - c.y) * sp.u.y, v = G.pointVel(ob, c.x, c.y), vin = -(v.x * sp.u.x + v.y * sp.u.y);
      if (fromTip < 12 && vin > 2.2) hits.push({ sp: sp, part: part, x: c.x, y: c.y, v: vin });
    }
  });
  function postStep(sub) {
    var h = 1 / (60 * sub), i;
    for (i = 0; i < hits.length; i++) { var hh = hits[i], sp0 = hh.sp; if (spikes.indexOf(sp0) < 0 || sp0.on.length >= 4 || sp0.on.some(function (e) { return e.part === hh.part; }) || hh.part.removed) continue; impale(sp0, hh.part, { x: hh.x, y: hh.y }, hh.v); }
    hits.length = 0;
    /* lying on the point with his weight on it: it goes in, slowly */
    var pairs = engine.pairs.list, seen = {};
    for (i = 0; i < pairs.length; i++) {
      var pr = pairs[i]; if (!pr.isActive) continue;
      var sb = pr.bodyA.plugin && pr.bodyA.plugin.spike ? pr.bodyA : pr.bodyB.plugin && pr.bodyB.plugin.spike ? pr.bodyB : null; if (!sb) continue;
      var ob = sb === pr.bodyA ? pr.bodyB : pr.bodyA, part = ob.plugin && ob.plugin.part; if (!part || part.removed || part.gone || !part.guy) continue;
      var sp = sb.plugin.spike; if (sp.on.length >= 4 || sp.on.some(function (e) { return e.part === part; })) continue;
      var c = pr.collision && pr.collision.supports && pr.collision.supports[0] ? pr.collision.supports[0] : ob.position;
      var fromTip = (sp.tip.x - c.x) * sp.u.x + (sp.tip.y - c.y) * sp.u.y; if (fromTip > 9) continue;
      var key = sp.id + ':' + part.id + ':' + part.guy.id; seen[key] = 1;
      press[key] = (press[key] || 0) + h * (sp.u.y < -0.5 ? 1.4 : 0.8);
      if (press[key] > 0.8) { delete press[key]; impale(sp, part, { x: c.x, y: c.y }, 1); }
    }
    for (var k in press) if (!seen[k]) { press[k] -= h * 2; if (press[k] <= 0) delete press[k]; }
  }
  function nearSpike(x, y) {
    var best = null, bd = 6;
    for (var i = 0; i < spikes.length; i++) {
      var sp = spikes[i], dx = sp.tip.x - sp.base.x, dy = sp.tip.y - sp.base.y, t = clamp(((x - sp.base.x) * dx + (y - sp.base.y) * dy) / (dx * dx + dy * dy), 0, 1);
      var d = Math.hypot(sp.base.x + dx * t - x, sp.base.y + dy * t - y); if (d < bd) { bd = d; best = sp; }
    }
    return best ? { sp: best, d: bd } : null;
  }
  TR.spikeApi = { at: function (x, y) { var n = nearSpike(x, y); return n && n.d < 1.5 ? n.sp : null; }, count: function () { return spikes.length; }, clear: function () { while (spikes.length) removeSpike(spikes[0]); }, add: function (x, y, a, onSurface) { return addSpike({ x: x, y: y, a: a, onSurface: !!onSurface }); } };
  T.removers.push({ near: function (x, y) { var n = nearSpike(x, y); return n ? { d: n.d, remove: function () { removeSpike(n.sp); } } : null; } });
  function drawSpike(ctx, sp, mode) {
    var b = sp.base, t = sp.tip, n = sp.n, u = sp.u, hw = SPIKE_W / 2;
    ctx.save(); if (mode) ctx.globalAlpha = 0.45;
    /* the plate it's set in, on a surface */
    if (sp.onSurface) { ctx.fillStyle = '#262726'; ctx.beginPath(); ctx.moveTo(b.x + n.x * 6.5, b.y + n.y * 6.5); ctx.lineTo(b.x - n.x * 6.5, b.y - n.y * 6.5); ctx.lineTo(b.x - n.x * 5 + u.x * 2.2, b.y - n.y * 5 + u.y * 2.2); ctx.lineTo(b.x + n.x * 5 + u.x * 2.2, b.y + n.y * 5 + u.y * 2.2); ctx.closePath(); ctx.fill(); }
    else { ctx.fillStyle = '#262726'; ctx.beginPath(); ctx.arc(b.x, b.y, 2.4, 0, Math.PI * 2); ctx.fill(); }
    /* the shaft: dark steel, lit down one side */
    var gr = ctx.createLinearGradient(b.x + n.x * hw, b.y + n.y * hw, b.x - n.x * hw, b.y - n.y * hw);
    gr.addColorStop(0, '#a3a6a4'); gr.addColorStop(0.45, '#5d605f'); gr.addColorStop(1, '#262828');
    ctx.fillStyle = gr; ctx.beginPath(); ctx.moveTo(b.x + n.x * hw, b.y + n.y * hw); ctx.lineTo(t.x, t.y); ctx.lineTo(b.x - n.x * hw, b.y - n.y * hw); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.5)'; ctx.lineWidth = 0.4; ctx.stroke();
    /* blood down from the point, as far as it's been in him */
    if (sp.blood > 0.02) {
      var bl = SPIKE_L * Math.min(1, 0.3 + sp.blood * 0.8), k = bl / SPIKE_L, m = { x: t.x - u.x * bl, y: t.y - u.y * bl };
      ctx.fillStyle = 'rgba(112,6,6,' + Math.min(0.85, 0.35 + sp.blood * 0.5).toFixed(2) + ')';
      ctx.beginPath(); ctx.moveTo(t.x, t.y); ctx.lineTo(m.x + n.x * hw * k * 1.05, m.y + n.y * hw * k * 1.05); ctx.quadraticCurveTo(m.x - u.x * 2, m.y - u.y * 2, m.x - n.x * hw * k * 1.05, m.y - n.y * hw * k * 1.05); ctx.closePath(); ctx.fill();
    }
    ctx.restore();
  }

  /* ---------------- the spike tool */
  T.add({ id: 'spike', group: 'spikes', name: 'SPIKE', cursor: 'none',
    help: 'click to set a spike. drop him on the point, throw him onto it, or let him lie on it: it goes in where it touches. shift-click a spike to take it out.',
    variants: [{ id: 'wall', name: 'ON A SURFACE', help: 'snaps to the floor, a wall or the ceiling, pointing out.' }, { id: 'free', name: 'ANYWHERE', help: 'wherever you click, at any angle: the wheel turns it.' }, { id: 'remove', name: 'REMOVE', help: 'click a spike to take it out. whatever was on it comes off.' }],
    down: function (pt) {
      if (T.v('spike') === 'remove') { var n = nearSpike(pt.x, pt.y); if (n) { removeSpike(n.sp); if (TR.sfx) TR.sfx.play('latch', { x: pt.x, gain: 0.3, rate: 1.3 }); } return; }
      if (spikes.length >= 24) { if (TR.ui) TR.ui.toast('that\'s enough spikes (24)'); return; }
      addSpike(placement(pt.x, pt.y));
    },
    wheel: function (dir) { preview.free += dir * Math.PI / 12; preview.a = preview.free; if (T.v('spike') === 'wall') T.setVariant(1); },
    drawCursor: function (ctx, P) {
      if (T.v('spike') === 'remove') { var n = nearSpike(P.x, P.y); ctx.strokeStyle = n ? 'rgba(255,120,100,0.9)' : 'rgba(235,235,225,0.5)'; ctx.lineWidth = 0.6; ctx.beginPath(); ctx.moveTo(P.x - 2.5, P.y - 2.5); ctx.lineTo(P.x + 2.5, P.y + 2.5); ctx.moveTo(P.x + 2.5, P.y - 2.5); ctx.lineTo(P.x - 2.5, P.y + 2.5); ctx.stroke(); return; }
      var pl = placement(P.x, P.y), u = { x: Math.cos(pl.a), y: Math.sin(pl.a) };
      drawSpike(ctx, { base: { x: pl.x, y: pl.y }, tip: { x: pl.x + u.x * SPIKE_L, y: pl.y + u.y * SPIKE_L }, u: u, n: { x: -u.y, y: u.x }, onSurface: pl.onSurface, blood: 0 }, pl.onSurface ? 'surface' : 'free');
      ctx.strokeStyle = 'rgba(235,235,225,0.5)'; ctx.lineWidth = 0.5; ctx.beginPath(); ctx.arc(P.x, P.y, 1.6, 0, Math.PI * 2); ctx.stroke();
    }
  });

  /* ---------------- nails */
  function nailHole(x, y) { dctx.save(); dctx.fillStyle = '#4a4b49'; dctx.beginPath(); dctx.arc(x, y, 0.9, 0, Math.PI * 2); dctx.fill(); dctx.fillStyle = 'rgba(0,0,0,0.6)'; dctx.beginPath(); dctx.arc(x, y, 0.45, 0, Math.PI * 2); dctx.fill(); dctx.restore(); }
  function addNail(part, x, y) {
    var g = part.guy, l = T.loc(part, x, y);
    var con = M.Constraint.create({ pointA: { x: x, y: y }, bodyB: part.body, pointB: { x: x - part.body.position.x, y: y - part.body.position.y }, length: 0, stiffness: 1, damping: 0.1, render: { visible: false } });
    M.World.add(engine.world, con);
    var nl = { part: part, l: l, x: x, y: y, con: con, strain: 0, a: rnd(0, 6.28) };
    nails.push(nl);
    if (g.dm && !g.cleared) G.dmg.shot(g, part, { lx: l.x, ly: l.y, wx: x, wy: y, dir: { x: 0, y: -1 }, exit: false, size: 0.6, src: 'a nail', srcKind: 'nail', what: 'nail wound', energy: 60, boneK: 0.25, painK: 0.7, powder: false, boneWord: 'nailed through' });
    if (TR.sfx) TR.sfx.nailgun(x);
    nailHole(x, y);
    G.wake(g);
    return nl;
  }
  /* out: pulled (the nail comes out clean, the hole stays), or torn (the part pulled off it, through the flesh) */
  function removeNail(nl, torn) {
    var k = nails.indexOf(nl); if (k < 0) return; nails.splice(k, 1);
    try { M.World.remove(engine.world, nl.con); } catch (e) {}
    var p = nl.part, ok = p && !p.removed && !p.gone, w = ok ? G.toWorld(p.body, nl.l.x, nl.l.y) : { x: nl.x, y: nl.y };
    if (torn && ok) {
      var g = p.guy, dx = w.x - nl.x, dy = w.y - nl.y;
      G.emit('wound', g, p, { type: 'tear', lx: nl.l.x, ly: nl.l.y, dir: { x: dx, y: dy }, size: 2.2, depth: 2 });
      if (G.blood && !g.dusty) G.blood.spray(w.x, w.y, dx * 0.1, dy * 0.1 - 0.4, 12, 3, 1.4, 1.3, g);
      if (g.dm && g.alive) { g.dm.pain = Math.min(220, g.dm.pain + 18); G.emit('voice', g, 'scream', 0.8); }
      if (TR.sfx) TR.sfx.play('tear', { x: w.x, gain: 0.4 });
    }
    /* the nail itself stays in the wall if he tore off it; pulled out, it drops */
    if (!torn) { flyNails.push({ x: nl.x, y: nl.y, vx: rnd(-0.6, 0.6), vy: rnd(-1.2, -0.3), a: nl.a, t: 0 }); if (flyNails.length > 30) flyNails.shift(); }
    else { dctx.save(); dctx.strokeStyle = '#7d807e'; dctx.lineWidth = 0.6; dctx.beginPath(); dctx.moveTo(nl.x, nl.y); dctx.lineTo(nl.x + Math.cos(nl.a) * 1.6, nl.y + Math.sin(nl.a) * 1.6); dctx.stroke(); dctx.fillStyle = '#9a9d9b'; dctx.beginPath(); dctx.arc(nl.x, nl.y, 0.8, 0, Math.PI * 2); dctx.fill(); dctx.restore(); }
  }
  function nailStep(sub) {
    for (var i = nails.length - 1; i >= 0; i--) {
      var nl = nails[i]; if (nl.part.removed || nl.part.gone) { removeNail(nl, false); continue; }
      var w = G.toWorld(nl.part.body, nl.l.x, nl.l.y), str = Math.hypot(w.x - nl.x, w.y - nl.y);
      if (str > 5.5) { nl.strain += 1 / (60 * sub); if (nl.strain > 0.12) removeNail(nl, true); } else nl.strain = Math.max(0, nl.strain - 0.5 / (60 * sub));
    }
  }
  function nearNail(x, y) { var best = null, bd = 5; for (var i = 0; i < nails.length; i++) { var nl = nails[i], w = G.toWorld(nl.part.body, nl.l.x, nl.l.y), d = Math.hypot(w.x - x, w.y - y); if (d < bd) { bd = d; best = nl; } } return best ? { nl: best, d: bd } : null; }
  T.removers.push({ near: function (x, y) { var n = nearNail(x, y); return n ? { d: n.d - 1, remove: function () { removeNail(n.nl, false); } } : null; } });
  T.add({ id: 'nail', group: 'spikes', name: 'NAIL GUN', cursor: 'none',
    help: 'click on him: a nail through that part into the wall behind. it holds until it\'s pulled out or torn out.',
    variants: [{ id: 'nail', name: 'NAIL', help: 'pinned where he is. pull on him hard enough and it tears out.' }, { id: 'pull', name: 'PULL OUT', help: 'click a nail head to pull it.' }],
    down: function (pt) {
      if (T.v('nail') === 'pull') { var n = nearNail(pt.x, pt.y); if (n) { removeNail(n.nl, false); if (TR.sfx) TR.sfx.play('latch', { x: pt.x, gain: 0.3, rate: 1.5 }); } return; }
      var p = T.partAt(pt.x, pt.y); if (!p) { if (TR.sfx) TR.sfx.nailgun(pt.x); nailHole(pt.x, pt.y); return; }
      if (nails.length >= 40) { if (TR.ui) TR.ui.toast('out of nails (40)'); return; }
      addNail(p, pt.x, pt.y);
    },
    drawCursor: function (ctx, P) { drawNailGun(ctx, P); }
  });
  function drawNailGun(ctx, P) {
    if (T.v('nail') === 'pull') { var n = nearNail(P.x, P.y); ctx.strokeStyle = n ? 'rgba(232,210,122,0.9)' : 'rgba(235,235,225,0.5)'; ctx.lineWidth = 0.6; ctx.beginPath(); ctx.arc(P.x, P.y, 2.4, 0, Math.PI * 2); ctx.moveTo(P.x, P.y - 3.6); ctx.lineTo(P.x, P.y - 1.2); ctx.stroke(); return; }
    ctx.save(); ctx.translate(P.x + 3, P.y + 3); ctx.rotate(-0.6);
    ctx.fillStyle = '#2b4f7a'; ctx.fillRect(0, -3, 16, 6); ctx.fillStyle = '#1b1c1d'; ctx.fillRect(-3, -1.2, 4, 2.4); ctx.fillRect(9, 3, 4, 8); ctx.fillStyle = '#c9a23a'; ctx.fillRect(14, -2, 3, 4);
    ctx.fillStyle = 'rgba(255,255,255,0.18)'; ctx.fillRect(0, -3, 16, 0.8); ctx.fillStyle = '#58595a'; ctx.fillRect(2, 3, 6, 1.6);
    ctx.restore();
    ctx.strokeStyle = 'rgba(235,235,225,0.6)'; ctx.lineWidth = 0.45; ctx.beginPath(); ctx.moveTo(P.x - 3, P.y); ctx.lineTo(P.x - 1, P.y); ctx.moveTo(P.x + 1, P.y); ctx.lineTo(P.x + 3, P.y); ctx.moveTo(P.x, P.y - 3); ctx.lineTo(P.x, P.y - 1); ctx.moveTo(P.x, P.y + 1); ctx.lineTo(P.x, P.y + 3); ctx.stroke();
  }

  /* ---------------- staples */
  function stapleWound(p, x, y) {
    var g = p.guy, l = T.loc(p, x, y);
    if (g.dm && !g.cleared) G.dmg.shot(g, p, { lx: l.x, ly: l.y, wx: x, wy: y, dir: { x: 0, y: -1 }, exit: false, size: 0.3, src: 'a staple', srcKind: 'staple', what: 'staple wound', energy: 18, boneK: 0, painK: 0.35, bleedK: 0.2, powder: false, quiet: Math.random() < 0.6 });
    G.wake(g);
    return l;
  }
  function addStaple(type, a, b) {
    if (staples.length >= 80) { if (TR.ui) TR.ui.toast('out of staples (80)'); return null; }
    var st = { type: type, a: a, b: b, con: null, strain: 0, ang: rnd(-0.7, 0.7), cur: 0 };
    var wa = G.toWorld(a.p.body, a.l.x, a.l.y);
    if (type === 'join') {
      /* the two points are drawn together, a little at a time, until they meet */
      var wb = G.toWorld(b.p.body, b.l.x, b.l.y), d = Math.hypot(wb.x - wa.x, wb.y - wa.y);
      st.cur = Math.max(1.5, d);
      st.con = M.Constraint.create({ bodyA: a.p.body, pointA: { x: wa.x - a.p.body.position.x, y: wa.y - a.p.body.position.y }, bodyB: b.p.body, pointB: { x: wb.x - b.p.body.position.x, y: wb.y - b.p.body.position.y }, length: st.cur, stiffness: 0.5, damping: 0.05, render: { visible: false } });
    } else if (type === 'wall') {
      st.wx = wa.x; st.wy = wa.y;
      st.con = M.Constraint.create({ pointA: { x: wa.x, y: wa.y }, bodyB: a.p.body, pointB: { x: wa.x - a.p.body.position.x, y: wa.y - a.p.body.position.y }, length: 0, stiffness: 0.6, damping: 0.08, render: { visible: false } });
    }
    if (st.con) M.World.add(engine.world, st.con);
    staples.push(st);
    return st;
  }
  function removeStaple(st, torn) {
    var k = staples.indexOf(st); if (k < 0) return; staples.splice(k, 1);
    if (st.con) { try { M.World.remove(engine.world, st.con); } catch (e) {} }
    if (!torn) return;
    [st.a, st.b].forEach(function (e) {
      if (!e || !e.p || e.p.removed || e.p.gone) return;
      var g = e.p.guy, w = G.toWorld(e.p.body, e.l.x, e.l.y);
      G.emit('wound', g, e.p, { type: 'tear', lx: e.l.x, ly: e.l.y, dir: { x: 0, y: -1 }, size: 1.3, depth: 1 });
      if (G.blood && !g.dusty) G.blood.spray(w.x, w.y, 0, -0.4, 5, 2, 1.6, 1.1, g);
      if (g.dm && g.alive) g.dm.pain = Math.min(220, g.dm.pain + 8);
    });
    if (TR.sfx) TR.sfx.play('tear', { x: G.toWorld(st.a.p.body, st.a.l.x, st.a.l.y).x, gain: 0.25, rate: 1.4 });
  }
  function stapleStep(sub) {
    for (var i = staples.length - 1; i >= 0; i--) {
      var st = staples[i], pa = st.a.p, pb = st.b && st.b.p;
      if (pa.removed || pa.gone || (pb && (pb.removed || pb.gone))) { removeStaple(st, false); continue; }
      if (!st.con) continue;
      var wa = G.toWorld(pa.body, st.a.l.x, st.a.l.y), over;
      if (st.type === 'join') {
        var wb = G.toWorld(pb.body, st.b.l.x, st.b.l.y), d = Math.hypot(wb.x - wa.x, wb.y - wa.y);
        if (st.cur > 1.5) { st.cur = Math.max(1.5, st.cur - 1.6 / sub); st.con.length = st.cur; }
        over = d - st.cur;
        if (over > 10) { st.strain += 1 / (60 * sub); if (st.strain > 0.12) { removeStaple(st, true); continue; } } else st.strain = Math.max(0, st.strain - 0.5 / (60 * sub));
      } else {
        over = Math.hypot(wa.x - st.wx, wa.y - st.wy);
        if (over > 3.5) { st.strain += 1 / (60 * sub); if (st.strain > 0.08) { removeStaple(st, true); continue; } } else st.strain = Math.max(0, st.strain - 0.5 / (60 * sub));
      }
    }
  }
  function staplePts(st) { var o = [{ w: G.toWorld(st.a.p.body, st.a.l.x, st.a.l.y), a: st.a.p.body.angle + st.ang }]; if (st.type === 'join') o.push({ w: G.toWorld(st.b.p.body, st.b.l.x, st.b.l.y), a: st.b.p.body.angle - st.ang }); return o; }
  function nearStaple(x, y) { var best = null, bd = 5; for (var i = 0; i < staples.length; i++) { var P = staplePts(staples[i]); for (var j = 0; j < P.length; j++) { var d = Math.hypot(P[j].w.x - x, P[j].w.y - y); if (d < bd) { bd = d; best = staples[i]; } } } return best ? { st: best, d: bd } : null; }
  T.removers.push({ near: function (x, y) { var n = nearStaple(x, y); return n ? { d: n.d - 0.5, remove: function () { removeStaple(n.st, false); } } : null; } });
  T.add({ id: 'staple', group: 'staple', name: 'STAPLE GUN', cursor: 'none',
    help: 'join two parts of him: click one, then the other, and they\'re stapled together. pulled far enough apart, the staple rips out.',
    variants: [{ id: 'join', name: 'JOIN', help: 'click a part, then another part: stapled together.' }, { id: 'wall', name: 'TO THE WALL', help: 'click a part: stapled to the wall behind. weaker than a nail.' }, { id: 'tack', name: 'TACK', help: 'just staples. as many as you like.' }],
    down: function (pt) {
      var p = T.partAt(pt.x, pt.y), v = T.v('staple');
      if (TR.sfx) TR.sfx.staple(pt.x);
      if (!p) { if (v === 'join' && firstStaple) { firstStaple = null; } return; }
      if (staples.length >= 80) { if (TR.ui) TR.ui.toast('out of staples (80)'); return; }
      if (v === 'join') {
        if (!firstStaple) { var l = stapleWound(p, pt.x, pt.y); firstStaple = { p: p, l: l }; return; }
        if (firstStaple.p === p) return;
        var l2 = stapleWound(p, pt.x, pt.y); addStaple('join', firstStaple, { p: p, l: l2 }); firstStaple = null; return;
      }
      var l3 = stapleWound(p, pt.x, pt.y);
      addStaple(v === 'wall' ? 'wall' : 'tack', { p: p, l: l3 }, null);
    },
    cancel: function () { if (firstStaple) { firstStaple = null; return true; } return false; },
    deselect: function () { firstStaple = null; },
    onVariant: function () { firstStaple = null; },
    drawCursor: function (ctx, P) {
      ctx.save(); ctx.translate(P.x + 2, P.y + 2); ctx.rotate(-0.5);
      ctx.fillStyle = '#7a1c16'; ctx.fillRect(0, -2.4, 14, 4.8); ctx.fillStyle = '#1c1c1c'; ctx.fillRect(1, 2.4, 10, 1.6); ctx.fillRect(8, -5.4, 5, 3); ctx.fillStyle = 'rgba(255,255,255,0.15)'; ctx.fillRect(0, -2.4, 14, 0.7);
      ctx.restore();
      ctx.strokeStyle = 'rgba(235,235,225,0.6)'; ctx.lineWidth = 0.45; ctx.beginPath(); ctx.moveTo(P.x - 1.3, P.y + 0.6); ctx.lineTo(P.x - 1.3, P.y - 0.4); ctx.lineTo(P.x + 1.3, P.y - 0.4); ctx.lineTo(P.x + 1.3, P.y + 0.6); ctx.stroke();
    }
  });

  /* ---------------- drawing what's in him and in the room */
  function drawFront(ctx) {
    for (var i = 0; i < spikes.length; i++) drawSpike(ctx, spikes[i]);
    for (i = 0; i < nails.length; i++) {
      var nl = nails[i], w = G.toWorld(nl.part.body, nl.l.x, nl.l.y);
      ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.beginPath(); ctx.arc(w.x + 0.4, w.y + 0.5, 1.3, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#8d908e'; ctx.beginPath(); ctx.arc(w.x, w.y, 1.2, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.beginPath(); ctx.arc(w.x - 0.35, w.y - 0.35, 0.45, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'rgba(95,8,8,0.55)'; ctx.beginPath(); ctx.arc(w.x, w.y + 1.1, 0.7, 0, Math.PI * 2); ctx.fill();
    }
    for (i = 0; i < flyNails.length; i++) { var f = flyNails[i]; ctx.save(); ctx.translate(f.x, f.y); ctx.rotate(f.a); ctx.strokeStyle = '#8d908e'; ctx.lineWidth = 0.6; ctx.beginPath(); ctx.moveTo(-2.4, 0); ctx.lineTo(2.4, 0); ctx.stroke(); ctx.fillStyle = '#8d908e'; ctx.fillRect(-2.8, -0.9, 0.7, 1.8); ctx.restore(); }
    for (i = 0; i < staples.length; i++) {
      var st = staples[i], pts = staplePts(st);
      if (st.type === 'join' && pts.length === 2 && Math.hypot(pts[0].w.x - pts[1].w.x, pts[0].w.y - pts[1].w.y) > 2.5) { ctx.strokeStyle = 'rgba(180,182,178,0.75)'; ctx.lineWidth = 0.35; ctx.beginPath(); ctx.moveTo(pts[0].w.x, pts[0].w.y); ctx.lineTo(pts[1].w.x, pts[1].w.y); ctx.stroke(); }
      for (var k = 0; k < pts.length; k++) { ctx.save(); ctx.translate(pts[k].w.x, pts[k].w.y); ctx.rotate(pts[k].a); ctx.strokeStyle = '#b4b6b2'; ctx.lineWidth = 0.45; ctx.beginPath(); ctx.moveTo(-1.3, 0.6); ctx.lineTo(-1.3, -0.4); ctx.lineTo(1.3, -0.4); ctx.lineTo(1.3, 0.6); ctx.stroke(); ctx.restore(); }
    }
  }
  function drawOver(ctx) {
    if (!firstStaple || !T.cur || T.cur.id !== 'staple') return;
    var p = firstStaple.p; if (p.removed || p.gone) { firstStaple = null; return; }
    var w = G.toWorld(p.body, firstStaple.l.x, firstStaple.l.y), P = T.pointer;
    ctx.save(); ctx.setLineDash([2, 2]); ctx.strokeStyle = 'rgba(232,210,122,0.7)'; ctx.lineWidth = 0.7; ctx.beginPath(); ctx.moveTo(w.x, w.y); ctx.lineTo(P.x, P.y); ctx.stroke(); ctx.setLineDash([]); ctx.restore();
  }
  function frame(dt) { for (var i = flyNails.length - 1; i >= 0; i--) { var f = flyNails[i]; f.x += f.vx; f.y += f.vy; f.vy += 0.2; f.a += 0.3; if (f.y > R.H - 0.5) { f.y = R.H - 0.5; f.vy *= -0.3; f.vx *= 0.5; f.a = 0; } if (++f.t > 240) flyNails.splice(i, 1); } }
  T.mods.push({ id: 'spikes', preStep: function (sub) { preStep(sub); nailStep(sub); stapleStep(sub); }, postStep: postStep, frame: frame, drawFront: drawFront, drawOver: drawOver,
    reset: function () { while (spikes.length) removeSpike(spikes[0]); while (nails.length) removeNail(nails[0], false); while (staples.length) removeStaple(staples[0], false); flyNails.length = 0; firstStaple = null; press = {}; hits.length = 0; } });
  TR.nailApi = { count: function () { return nails.length; }, clear: function () { while (nails.length) removeNail(nails[0], false); }, add: addNail };
  TR.stapleApi = { count: function () { return staples.length; }, clear: function () { while (staples.length) removeStaple(staples[0], false); } };
})();
