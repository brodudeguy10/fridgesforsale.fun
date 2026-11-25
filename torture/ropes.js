/* ============================================================
   TORTURE ROOM: rope and chain.
   one end on him, the other on a ceiling hook, a ring in a wall,
   a ring in the floor, a bolt driven into the back wall wherever
   you click, or another part of him. a rope only pulls: slack, it
   does nothing; taut, it holds at its length with the tension you
   set, and pulled hard enough it snaps. a chain is stiffer and
   heavier and never breaks: whatever it's tied to gives first.
   the wheel over one winds it in or lets it out. the line you see
   is its own little verlet string, pinned at both ends.
============================================================ */
(function () {
  'use strict';
  var G = window.__G3, M = Matter, B = M.Body, R = window.TR_ROOM, T = TR.tools;
  var clamp = G.clamp, rnd = G.rnd;
  var ST = TR.ropeSettings = { tension: { rope: 0.45, chain: 0.9 } };
  try { var sv = JSON.parse(localStorage.getItem('ffs_torture_settings') || '{}'); if (sv.tension) { for (var k in ST.tension) if (typeof sv.tension[k] === 'number') ST.tension[k] = clamp(sv.tension[k], 0.1, 1); } } catch (e) {}
  var ropes = TR.ropes = [], loose = [], pending = null, sel = null, hover = null;
  /* a limb that broke in two under a rope: the rope stays on whichever piece it was tied round (its pin moved with it) */
  G.on('split', function (g, p, p2, ys) { ropes.forEach(function (r) { [r.a, r.b].forEach(function (e) { if (e && e.type === 'part' && e.p === p && e.l.y > ys) e.p = p2; }); }); if (pending && pending.type === 'part' && pending.p === p && pending.l.y > ys) pending.p = p2; });
  var MAX = 30;

  /* ---------------- the ends */
  /* where a constraint's end is in the world right now */
  function cw(c, end) {
    var b = end === 'A' ? c.bodyA : c.bodyB, p = end === 'A' ? c.pointA : c.pointB;
    return b ? { x: b.position.x + p.x, y: b.position.y + p.y } : { x: p.x, y: p.y };
  }
  /* an end: an anchor of the room's, a bolt in the back wall, or a point on him in that part's own frame */
  function endPos(e) {
    if (e.type === 'part') return G.toWorld(e.p.body, e.l.x, e.l.y);
    if (e.type === 'anchor') return { x: e.a.x, y: e.a.y };
    return { x: e.x, y: e.y };
  }
  /* what's at a point to tie to: a hook or a ring if one is close, him, or (snap) a bolt in the wall right there */
  function endAt(x, y, snap) {
    var a = TR.room.anchorNear(x, y, 14);
    if (a) return { type: 'anchor', a: a };
    var p = T.partAt(x, y, 3);
    if (p) {
      var l = T.loc(p, x, y), d = p.def, hw = (d.wh ? d.wh[0] : d.r * 2) * G.S / 2, hh = (d.wh ? d.wh[1] : d.r * 2) * G.S / 2;
      if (d.piece) l = { x: l.x, y: Math.max(d.piece.y0 + 2 * G.S, Math.min(d.piece.y1 - 2 * G.S, l.y)) };
      /* tied round the limb: on its middle line across, wherever along it you clicked */
      return { type: 'part', p: p, l: { x: clamp(l.x, -hw * 0.35, hw * 0.35), y: clamp(l.y, -hh * 0.85, hh * 0.85) } };
    }
    if (!snap) return null;
    if (x < 1 || x > R.W - 1 || y < 1 || y > R.H - 1) return null;
    return { type: 'bolt', x: x, y: y };
  }

  /* ---------------- making and taking off */
  function make(kind, a, b) {
    if (ropes.length >= MAX) { if (TR.ui) TR.ui.toast('that\'s enough ' + kind + 's (' + MAX + ')'); return null; }
    var pa = endPos(a), pb = endPos(b), d = Math.hypot(pb.x - pa.x, pb.y - pa.y);
    var o = { length: Math.max(4, d * 0.98), stiffness: 0.001, damping: 0, render: { visible: false } };
    if (a.type === 'part') { o.bodyA = a.p.body; o.pointA = { x: pa.x - a.p.body.position.x, y: pa.y - a.p.body.position.y }; } else o.pointA = { x: pa.x, y: pa.y };
    if (b.type === 'part') { o.bodyB = b.p.body; o.pointB = { x: pb.x - b.p.body.position.x, y: pb.y - b.p.body.position.y }; } else o.pointB = { x: pb.x, y: pb.y };
    var c = M.Constraint.create(o); c.stiffness = 0;
    M.World.add(engine.world, c);
    var r = { kind: kind, a: a, b: b, c: c, len: o.length, cur: o.length, k: ST.tension[kind], taut: false, strain: 0, lastJerk: -9, pts: [], d: d, t0: G.t };
    initPts(r); ropes.push(r); sel = r;
    var mx = (pa.x + pb.x) / 2;
    if (TR.sfx) TR.sfx.rope(mx, kind === 'chain');
    [a, b].forEach(function (e) { if (e.type === 'part' && e.p.guy) G.wake(e.p.guy); });
    if (b.type === 'bolt' || a.type === 'bolt') { var bp = a.type === 'bolt' ? pa : pb; if (TR.sfx) TR.sfx.play('step_metal', { x: bp.x, gain: 0.3, rate: 1.4 }); }
    if (TR.ui) TR.ui.onTool();
    return r;
  }
  /* off: untied (it's just gone), or snapped (two loose ends fall where it was) */
  function remove(r, snapped) {
    var i = ropes.indexOf(r); if (i < 0) return;
    ropes.splice(i, 1);
    try { M.World.remove(engine.world, r.c); } catch (e) {}
    if (sel === r) sel = null; if (hover === r) hover = null;
    if (snapped && r.pts.length > 3) {
      var cut = Math.max(1, Math.min(r.pts.length - 2, Math.floor(r.pts.length * rnd(0.3, 0.7))));
      [r.pts.slice(0, cut + 1), r.pts.slice(cut)].forEach(function (P) { if (P.length > 1) loose.push({ pts: P.map(function (q) { return { x: q.x, y: q.y, px: q.x - rnd(-0.6, 0.6), py: q.y - rnd(0, 0.6) }; }), kind: r.kind, life: 60 * 25 }); });
      while (loose.length > 16) loose.shift();
      var m = r.pts[cut];
      if (TR.sfx) TR.sfx.snapRope(m.x);
      [r.a, r.b].forEach(function (e) { if (e.type === 'part' && e.p.guy) G.wake(e.p.guy); });
    }
    /* the CLEAR ALL count on the bar follows on its own (ui.js watches the counts) */
  }
  TR.ropeRemove = remove;

  /* ---------------- the physics: pull only when there's no slack left */
  function preStep(sub) {
    for (var i = ropes.length - 1; i >= 0; i--) {
      var r = ropes[i];
      if ((r.a.type === 'part' && (r.a.p.removed || r.a.p.gone)) || (r.b.type === 'part' && (r.b.p.removed || r.b.p.gone))) { remove(r); continue; }
      var pa = cw(r.c, 'A'), pb = cw(r.c, 'B'), d = Math.hypot(pb.x - pa.x, pb.y - pa.y);
      /* shortened, it winches in (a few units a step) rather than jumping: spin the wheel and he's hauled up, not yanked.
         let out, it goes slack at once */
      if (r.cur == null || r.cur < r.len) r.cur = r.len; else if (r.cur > r.len) r.cur = Math.max(r.len, r.cur - 2.4 / sub);
      var L = r.cur;
      if (!r.taut && d > L) {
        r.taut = true;
        /* the jerk when it catches: a creak, a clink */
        var va = r.c.bodyA ? G.pointVel(r.c.bodyA, pa.x, pa.y) : { x: 0, y: 0 }, vb = r.c.bodyB ? G.pointVel(r.c.bodyB, pb.x, pb.y) : { x: 0, y: 0 };
        var ux = (pb.x - pa.x) / d, uy = (pb.y - pa.y) / d, rv = (vb.x - va.x) * ux + (vb.y - va.y) * uy;
        if (rv > 1.2 && G.t - r.lastJerk > 0.25 && TR.sfx) { r.lastJerk = G.t; TR.sfx.creak((pa.x + pb.x) / 2, clamp(rv / 8, 0.2, 1), r.kind === 'chain'); }
      } else if (r.taut && d < L - 0.6) r.taut = false;
      r.c.length = L; r.c.stiffness = r.taut ? r.k : 0; r.c.damping = r.taut ? 0.08 : 0;
      r.d = d;
      /* a rope pulled hard enough lets go: held past its stretch for a moment, or one violent jerk. his own weight
         hanging off it stretches it a few units at most, so it takes a real pull. a chain holds and something else gives */
      var over = (d - L) * r.k / 0.45;   /* what it's pulling with, not how far it's stretched: a slack-set rope stretches more under the same load */
      if (r.kind === 'rope' && r.taut && over > 45 + 0.3 * L) { remove(r, true); continue; }
      if (r.kind === 'rope' && r.taut && over > 20 + 0.14 * L) { r.strain += 1 / (60 * sub); if (r.strain > 0.1) { remove(r, true); continue; } } else r.strain = Math.max(0, r.strain - 0.5 / (60 * sub));
      /* a hanging chain weighs on what it's tied to */
      if (r.kind === 'chain' && !r.taut) { var e = r.a.type === 'part' ? r.a : r.b.type === 'part' ? r.b : null; if (e) { var ep = endPos(e); B.applyForce(e.p.body, ep, { x: 0, y: 0.0000045 * r.len / sub }); } }
    }
  }

  /* ---------------- the line you see */
  function initPts(r) {
    var n = clamp(Math.round((r.cur || r.len) / 6), 6, 56), pa = cw(r.c, 'A'), pb = cw(r.c, 'B'); r.pts = [];
    for (var i = 0; i < n; i++) { var k = i / (n - 1), x = pa.x + (pb.x - pa.x) * k, y = pa.y + (pb.y - pa.y) * k; r.pts.push({ x: x, y: y, px: x, py: y }); }
  }
  function verlet(pts, seg, pinA, pinB) {
    var n = pts.length, i, p;
    for (i = 0; i < n; i++) { p = pts[i]; if ((i === 0 && pinA) || (i === n - 1 && pinB)) continue; var vx = (p.x - p.px) * 0.97, vy = (p.y - p.py) * 0.97; p.px = p.x; p.py = p.y; p.x += vx; p.y += vy + 0.2; }
    if (pinA) { pts[0].x = pinA.x; pts[0].y = pinA.y; } if (pinB) { pts[n - 1].x = pinB.x; pts[n - 1].y = pinB.y; }
    for (var it = 0; it < 7; it++) {
      for (i = 0; i < n - 1; i++) {
        var a = pts[i], b = pts[i + 1], dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy) || 1e-6, df = (d - seg) / d;
        var fa = (i === 0 && pinA) ? 0 : 0.5, fb = (i + 1 === n - 1 && pinB) ? 0 : 0.5; if (!fa && !fb) continue; var s = fa + fb; fa /= s; fb /= s;
        a.x += dx * df * fa; a.y += dy * df * fa; b.x -= dx * df * fb; b.y -= dy * df * fb;
      }
      for (i = 0; i < n; i++) { p = pts[i]; if (p.y > R.H - 0.6) { p.y = R.H - 0.6; p.px = p.x - (p.x - p.px) * 0.5; } if (p.x < 0.6) p.x = 0.6; if (p.x > R.W - 0.6) p.x = R.W - 0.6; if (p.y < 0.6) p.y = 0.6; }
    }
  }
  function frame(dt) {
    for (var i = 0; i < ropes.length; i++) {
      var r = ropes[i], A0 = cw(r.c, 'A'), B0 = cw(r.c, 'B'), n = r.pts.length;
      /* a rope that's been winched much shorter gets fewer points, or the line can't pull itself straight */
      var want = clamp(Math.round((r.cur || r.len) / 6), 6, 56); if (Math.abs(want - n) > 4) { initPts(r); n = r.pts.length; }
      verlet(r.pts, (r.cur || r.len) / (n - 1), A0, B0);
      /* taut, it's a straight line between its ends (with the tremble of the load in it), whatever the drawn line was doing */
      if (r.taut) for (var j = 1; j < n - 1; j++) { var q = r.pts[j], k = j / (n - 1), sx = A0.x + (B0.x - A0.x) * k, sy = A0.y + (B0.y - A0.y) * k; q.x += (sx - q.x) * 0.7; q.y += (sy - q.y) * 0.7; q.px = q.x; q.py = q.y; }
    }
    for (i = loose.length - 1; i >= 0; i--) { var L = loose[i]; verlet(L.pts, 6, null, null); if (--L.life <= 0) loose.splice(i, 1); }
    hover = null;
    var cur = T.cur && (T.cur.id === 'rope' || T.cur.id === 'chain');
    if (cur || T.pointer.shift) { var nr = nearest(T.pointer.x, T.pointer.y, 7); hover = nr ? nr.r : null; }
  }
  /* the nearest rope to a point, and how near */
  function nearest(x, y, within) {
    var best = null, bd = within || 8;
    for (var i = 0; i < ropes.length; i++) {
      var P = ropes[i].pts;
      for (var j = 0; j < P.length - 1; j++) {
        var a = P[j], b = P[j + 1], dx = b.x - a.x, dy = b.y - a.y, l2 = dx * dx + dy * dy || 1, t = clamp(((x - a.x) * dx + (y - a.y) * dy) / l2, 0, 1);
        var d = Math.hypot(a.x + dx * t - x, a.y + dy * t - y); if (d < bd) { bd = d; best = ropes[i]; }
      }
    }
    return best ? { r: best, d: bd } : null;
  }
  T.removers.push({ near: function (x, y) { var n = nearest(x, y, 8); return n ? { d: n.d, remove: function () { remove(n.r); } } : null; } });

  /* ---------------- drawing */
  function path(ctx, P) {
    ctx.beginPath(); ctx.moveTo(P[0].x, P[0].y);
    for (var i = 1; i < P.length - 1; i++) { var mx = (P[i].x + P[i + 1].x) / 2, my = (P[i].y + P[i + 1].y) / 2; ctx.quadraticCurveTo(P[i].x, P[i].y, mx, my); }
    ctx.lineTo(P[P.length - 1].x, P[P.length - 1].y);
  }
  function drawLine(ctx, P, kind, lit) {
    if (!P || P.length < 2) return;
    ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    if (kind === 'chain') {
      /* links, one along the line and the next across it, on a dark shadow so it reads against the concrete */
      path(ctx, P); ctx.strokeStyle = 'rgba(6,6,6,0.6)'; ctx.lineWidth = 2.6; ctx.stroke();
      var acc = 0, n = 0;
      for (var i = 0; i < P.length - 1; i++) {
        var a = P[i], b = P[i + 1], dx = b.x - a.x, dy = b.y - a.y, l = Math.hypot(dx, dy); if (l < 0.01) continue;
        var an = Math.atan2(dy, dx);
        for (var s = acc; s < l; s += 2.7) { var x = a.x + dx * s / l, y = a.y + dy * s / l; ctx.save(); ctx.translate(x, y); ctx.rotate(an); ctx.strokeStyle = lit ? '#e8d27a' : (n & 1 ? '#9a9c98' : '#6f716e'); ctx.lineWidth = n & 1 ? 0.7 : 0.55; ctx.beginPath(); if (n & 1) { ctx.moveTo(-1.7, 0); ctx.lineTo(1.7, 0); } else ctx.ellipse(0, 0, 1.75, 1.05, 0, 0, Math.PI * 2); ctx.stroke(); ctx.restore(); n++; }
        acc = (acc + 2.7 - (l % 2.7)) % 2.7;
      }
    } else {
      path(ctx, P); ctx.strokeStyle = 'rgba(12,8,4,0.85)'; ctx.lineWidth = 2.5; ctx.stroke();
      path(ctx, P); ctx.strokeStyle = lit ? '#e8d27a' : '#7a6748'; ctx.lineWidth = 1.7; ctx.stroke();
      path(ctx, P); ctx.setLineDash([1.1, 1.5]); ctx.strokeStyle = 'rgba(160,140,100,0.55)'; ctx.lineWidth = 0.9; ctx.stroke(); ctx.setLineDash([]);
    }
    ctx.restore();
  }
  function drawEnd(ctx, e, kind) {
    var p = endPos(e);
    if (e.type === 'bolt') { ctx.fillStyle = '#353634'; ctx.fillRect(p.x - 2.6, p.y - 2.6, 5.2, 5.2); ctx.strokeStyle = '#8b8d8a'; ctx.lineWidth = 0.9; ctx.beginPath(); ctx.arc(p.x, p.y + 1.6, 1.8, 0, Math.PI * 2); ctx.stroke(); }
    if (e.type === 'part') {
      /* wound round the limb twice, tight: two turns across it, the front of each turn lit */
      var hw = (e.p.def.wh ? e.p.def.wh[0] : e.p.def.r * 1.4) * G.S * 0.53, ch = kind === 'chain';
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(e.p.body.angle);
      for (var t = 0; t < 2; t++) {
        var oy = (t - 0.5) * (ch ? 2 : 1.7);
        ctx.strokeStyle = 'rgba(10,6,3,0.85)'; ctx.lineWidth = ch ? 1.5 : 1.9; ctx.beginPath(); ctx.moveTo(-hw, oy - 0.4); ctx.quadraticCurveTo(0, oy + 0.9, hw, oy + 0.4); ctx.stroke();
        ctx.strokeStyle = ch ? '#9a9c98' : '#7a6748'; ctx.lineWidth = ch ? 0.9 : 1.2; ctx.beginPath(); ctx.moveTo(-hw, oy - 0.4); ctx.quadraticCurveTo(0, oy + 0.9, hw, oy + 0.4); ctx.stroke();
      }
      ctx.restore();
    }
  }
  function drawFront(ctx) {
    for (var i = 0; i < loose.length; i++) drawLine(ctx, loose[i].pts, loose[i].kind, false);
    for (i = 0; i < ropes.length; i++) { var r = ropes[i]; drawLine(ctx, r.pts, r.kind, r === hover); drawEnd(ctx, r.a, r.kind); drawEnd(ctx, r.b, r.kind); }
  }
  function drawOver(ctx) {
    if (!pending) return;
    var a = endPos(pending.a), P = T.pointer, b = endAt(P.x, P.y, true), bp = b ? endPos(b) : P;
    ctx.save(); ctx.setLineDash([3, 2]); ctx.strokeStyle = b ? 'rgba(232,210,122,0.8)' : 'rgba(200,200,200,0.5)'; ctx.lineWidth = 0.9; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(bp.x, bp.y); ctx.stroke(); ctx.setLineDash([]);
    if (b) { ctx.fillStyle = 'rgba(232,210,122,0.9)'; ctx.beginPath(); ctx.arc(bp.x, bp.y, 1.8, 0, Math.PI * 2); ctx.fill(); }
    ctx.restore();
  }
  T.mods.push({ id: 'ropes', preStep: preStep, frame: frame, drawFront: drawFront, drawOver: drawOver, reset: function () { while (ropes.length) remove(ropes[0]); loose.length = 0; pending = null; } });

  /* ---------------- the two tools */
  function tool(kind) {
    var down = null;
    T.add({
      id: kind, group: 'restraint', name: kind === 'rope' ? 'ROPE' : 'CHAIN',
      help: kind === 'rope' ? 'drag from him to a hook, a ring, the wall or another part of him. the wheel over a rope makes it longer or shorter. a hard enough yank snaps it.'
        : 'like the rope, but steel: heavier, stiffer, and it never breaks. whatever it\'s tied to will give first.',
      variants: [{ id: 'tie', name: 'TIE', help: 'press on one end, let go on the other. a click on each works too.' }, { id: 'cut', name: 'UNTIE', help: 'click a ' + kind + ' to take it off.' }],
      cursor: 'crosshair',
      down: function (pt) {
        if (T.v(kind) === 'cut') { var n = nearest(pt.x, pt.y, 9); if (n) { remove(n.r); if (TR.sfx) TR.sfx.play('latch', { x: pt.x, gain: 0.3, rate: 1.3 }); } return; }
        if (pending) { finish(pt); return; }
        var a = endAt(pt.x, pt.y, true); if (!a) return;
        pending = { a: a, kind: kind }; down = { x: pt.x, y: pt.y };
        if (TR.sfx) TR.sfx.play('click', { x: pt.x, gain: 0.2, rate: 1.6 });
      },
      up: function (pt) { if (!pending || !down) return; if (Math.hypot(pt.x - down.x, pt.y - down.y) < 5) { down = null; return; } finish(pt); },
      wheel: function (dir, pt) { var n = nearest(pt.x, pt.y, 14), r = n ? n.r : TR.ropeApi.sel(); if (!r) return; adjust(r, dir); },
      cancel: function () { if (pending) { pending = null; down = null; return true; } return false; },
      deselect: function () { pending = null; down = null; },
      onVariant: function () { pending = null; down = null; },
      drawCursor: function (ctx, P) { var a = TR.room.anchorNear(P.x, P.y, 14), p = !a && T.partAt(P.x, P.y, 3); if (p) { ctx.strokeStyle = 'rgba(232,210,122,0.7)'; ctx.lineWidth = 0.7; ctx.beginPath(); ctx.arc(P.x, P.y, 3, 0, Math.PI * 2); ctx.stroke(); } else if (T.v(kind) === 'cut') { ctx.strokeStyle = hover ? 'rgba(255,120,100,0.9)' : 'rgba(235,235,225,0.5)'; ctx.lineWidth = 0.6; ctx.beginPath(); ctx.moveTo(P.x - 2.5, P.y - 2.5); ctx.lineTo(P.x + 2.5, P.y + 2.5); ctx.moveTo(P.x + 2.5, P.y - 2.5); ctx.lineTo(P.x - 2.5, P.y + 2.5); ctx.stroke(); } }
    });
    function finish(pt) {
      var b = endAt(pt.x, pt.y, true), a = pending.a; pending = null; down = null;
      if (!b) return;
      if (a.type !== 'part' && b.type !== 'part') { if (TR.ui) TR.ui.toast('one end has to be on him'); return; }
      if (a.type === 'part' && b.type === 'part' && a.p === b.p) return;
      make(kind, a, b);
    }
  }
  function adjust(r, dir) { r.len = clamp(r.len * (dir > 0 ? 1.08 : 1 / 1.08), 4, 900); sel = r; r.t0 = G.t; if (TR.sfx) TR.sfx.creak((r.pts[0].x + r.pts[r.pts.length - 1].x) / 2, 0.25, r.kind === 'chain'); if (TR.ui) TR.ui.onTool(); }
  tool('rope'); tool('chain');
  TR.ropeApi = {
    sel: function () { return sel && ropes.indexOf(sel) >= 0 ? sel : null; },
    adjust: function (dir) { var r = TR.ropeApi.sel(); if (r) adjust(r, dir); },
    tension: function (kind, k) { ST.tension[kind] = k; ropes.forEach(function (r) { if (r.kind === kind) r.k = k; }); try { var sv = JSON.parse(localStorage.getItem('ffs_torture_settings') || '{}'); sv.tension = ST.tension; localStorage.setItem('ffs_torture_settings', JSON.stringify(sv)); } catch (e) {} },
    clear: function () { while (ropes.length) remove(ropes[0]); },
    count: function () { return ropes.length; },
    make: make, endAt: endAt
  };
})();
