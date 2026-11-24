/* ============================================================
   TORTURE ROOM: the room.
   poured concrete, the form lines and tie holes still in it,
   water streaks from the ceiling, old stains, a few cracks; low
   near the floor, a steel door; the floor going away from you with
   its joints and a drain. one fluorescent fixture hangs on two
   short chains in the middle of the ceiling and lights all of it,
   weakly, the far corners close to black. hooks in the ceiling,
   eye bolts in the walls and rings in the floor for the ropes.
   the fixture is a real body: hit it and it swings and flickers,
   hit it hard or shoot it and it goes, and a red emergency lamp
   over the door is all that's left.
============================================================ */
(function () {
  'use strict';
  var G = window.__G3, M = Matter, R = window.TR_ROOM, RES = window.TR_RES;
  var W = R.W, H = R.H, SIDE = R.side, TOP = R.top, FRONT = R.front, BACK = H - R.seam;
  var VX0 = -SIDE, VY0 = -TOP, VW = W + SIDE * 2, VH = H + TOP + FRONT;
  var clamp = function (x, a, b) { return x < a ? a : x > b ? b : x; };
  var rnd = function (a, b) { return a + Math.random() * (b - a); };
  var room = TR.room = { VX0: VX0, VY0: VY0, VW: VW, VH: VH, BACK: BACK };

  /* the side walls, ceiling and floor are drawn in depth: a point where the back wall meets one of them maps out to
     the edge of the frame (a straight scale from a centre just above his head, wider in y than in x) */
  var SX = (W / 2 + SIDE) / (W / 2), SY = (H + FRONT + TOP) / BACK, CY = -TOP / (1 - SY);
  function toFront(x, y) { return { x: W / 2 + (x - W / 2) * SX, y: CY + (y - CY) * SY }; }
  room.toFront = toFront;

  /* ---------------- where the ropes can go */
  room.anchors = [
    { id: 'c1', x: W * 0.2, y: 3, kind: 'hook' }, { id: 'c2', x: W * 0.36, y: 3, kind: 'hook' }, { id: 'c3', x: W * 0.64, y: 3, kind: 'hook' }, { id: 'c4', x: W * 0.8, y: 3, kind: 'hook' },
    { id: 'l1', x: 2, y: 74, kind: 'ring', side: -1 }, { id: 'l2', x: 2, y: 196, kind: 'ring', side: -1 }, { id: 'r1', x: W - 2, y: 74, kind: 'ring', side: 1 }, { id: 'r2', x: W - 2, y: 196, kind: 'ring', side: 1 },
    { id: 'f1', x: W * 0.28, y: H - 2, kind: 'floor' }, { id: 'f2', x: W * 0.72, y: H - 2, kind: 'floor' }
  ];
  room.anchorNear = function (x, y, r) { var best = null, bd = r || 16; for (var i = 0; i < room.anchors.length; i++) { var a = room.anchors[i], d = Math.hypot(a.x - x, a.y - y); if (d < bd) { bd = d; best = a; } } return best; };

  /* ---------------- value noise, for the concrete */
  var seed = 1337;
  function srand() { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; }
  var NS = 64, grid = new Float32Array(NS * NS); for (var gi = 0; gi < grid.length; gi++) grid[gi] = srand();
  function vnoise(x, y) {
    var xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi, a = (xi % NS + NS) % NS, b = (yi % NS + NS) % NS, a1 = (a + 1) % NS, b1 = (b + 1) % NS;
    var u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
    var top = grid[b * NS + a] * (1 - u) + grid[b * NS + a1] * u, bot = grid[b1 * NS + a] * (1 - u) + grid[b1 * NS + a1] * u;
    return top * (1 - v) + bot * v;
  }
  function fbm(x, y) { return vnoise(x, y) * 0.5 + vnoise(x * 2.1, y * 2.1) * 0.27 + vnoise(x * 4.3, y * 4.3) * 0.15 + vnoise(x * 8.7, y * 8.7) * 0.08; }

  /* ---------------- the concrete, baked */
  room.cv = document.createElement('canvas');
  room.cv.width = Math.ceil(VW * RES); room.cv.height = Math.ceil(VH * RES);
  function quad(x, pts, fill) { x.beginPath(); x.moveTo(pts[0], pts[1]); for (var i = 2; i < pts.length; i += 2) x.lineTo(pts[i], pts[i + 1]); x.closePath(); x.fillStyle = fill; x.fill(); }
  var DOOR = { x0: W - 152, x1: W - 90, top: BACK - 132 };
  room.door = DOOR;
  room.emerg = { x: (DOOR.x0 + DOOR.x1) / 2, y: DOOR.top - 12 };
  function bake() {
    var c = room.cv, x = c.getContext('2d');
    x.setTransform(RES, 0, 0, RES, SIDE * RES, TOP * RES);
    var fl = toFront(0, BACK), fr = toFront(W, BACK), cl = toFront(0, 0), cr = toFront(W, 0);
    /* the planes, lit as if the light were full on everywhere: the light pass darkens them later */
    quad(x, [0, 0, W, 0, W, BACK, 0, BACK], '#5d5e5c');                                     /* back wall */
    quad(x, [0, BACK, W, BACK, fr.x, H + FRONT, fl.x, H + FRONT], '#4a4a48');                 /* floor */
    quad(x, [cl.x, VY0, cr.x, VY0, W, 0, 0, 0], '#3c3d3c');                                   /* ceiling */
    quad(x, [cl.x, VY0, 0, 0, 0, BACK, fl.x, H + FRONT], '#4f504e');                          /* left wall */
    quad(x, [cr.x, VY0, W, 0, W, BACK, fr.x, H + FRONT], '#4c4d4b');                          /* right wall */
    /* the back wall: poured in panels, the plywood's grain and seams left in it */
    x.save(); x.beginPath(); x.rect(0, 0, W, BACK); x.clip();
    for (var py = 0; py < BACK; py += 2) for (var px = 0; px < W; px += 2) {
      var n = fbm(px / 38, py / 38), d = (n - 0.5) * 34;
      if (Math.abs(d) < 2) continue;
      x.fillStyle = d > 0 ? 'rgba(255,255,250,' + (d / 260).toFixed(3) + ')' : 'rgba(0,0,0,' + (-d / 220).toFixed(3) + ')'; x.fillRect(px, py, 2, 2);
    }
    /* form lines: the panel seams, a little proud of the wall, lit along the top */
    var pw = 112, ph = 94;
    for (var sx = pw; sx < W; sx += pw) { x.fillStyle = 'rgba(0,0,0,0.16)'; x.fillRect(sx - 0.4, 0, 0.8, BACK); x.fillStyle = 'rgba(255,255,250,0.05)'; x.fillRect(sx + 0.4, 0, 0.6, BACK); }
    for (var sy = ph; sy < BACK; sy += ph) { x.fillStyle = 'rgba(0,0,0,0.16)'; x.fillRect(0, sy - 0.4, W, 0.8); x.fillStyle = 'rgba(255,255,250,0.05)'; x.fillRect(0, sy + 0.4, W, 0.6); }
    /* tie holes: the little dark plugs where the forms were bolted through */
    for (sx = pw / 4; sx < W; sx += pw / 2) for (sy = ph / 4; sy < BACK; sy += ph / 2) {
      if (sx > DOOR.x0 - 6 && sx < DOOR.x1 + 6 && sy > DOOR.top - 6) continue;
      var tr = 1.25 + srand() * 0.4; x.fillStyle = 'rgba(0,0,0,0.42)'; x.beginPath(); x.arc(sx, sy, tr, 0, Math.PI * 2); x.fill();
      x.fillStyle = 'rgba(255,255,250,0.06)'; x.beginPath(); x.arc(sx + 0.4, sy + 0.5, tr * 0.7, 0, Math.PI); x.fill();
    }
    /* water down the wall from the ceiling: long darker streaks, wider where they started */
    for (var i = 0; i < 26; i++) {
      var wx = srand() * W, wl = 40 + srand() * 200, ww = 1 + srand() * 5;
      if (wx > DOOR.x0 - 4 && wx < DOOR.x1 + 4) wl = Math.min(wl, DOOR.top - 4);
      var gr = x.createLinearGradient(0, 0, 0, wl); gr.addColorStop(0, 'rgba(10,12,10,' + (0.09 + srand() * 0.12).toFixed(3) + ')'); gr.addColorStop(1, 'rgba(10,12,10,0)');
      x.fillStyle = gr; x.beginPath(); x.moveTo(wx - ww, 0); x.quadraticCurveTo(wx - ww * 0.3, wl * 0.5, wx + (srand() - 0.5) * 3, wl); x.quadraticCurveTo(wx + ww * 0.4, wl * 0.5, wx + ww, 0); x.closePath(); x.fill();
    }
    /* old stains, darker where something soaked in and dried */
    for (i = 0; i < 9; i++) {
      var stx = srand() * W, sty = BACK * (0.35 + srand() * 0.62), str = 8 + srand() * 26, sg = x.createRadialGradient(stx, sty, 0, stx, sty, str);
      sg.addColorStop(0, 'rgba(' + (srand() < 0.3 ? '30,20,14' : '14,14,12') + ',' + (0.1 + srand() * 0.14).toFixed(3) + ')'); sg.addColorStop(1, 'rgba(0,0,0,0)');
      x.fillStyle = sg; x.beginPath(); x.ellipse(stx, sty, str * 1.3, str, 0, 0, Math.PI * 2); x.fill();
    }
    /* cracks: thin, branching, a little light along one lip */
    for (i = 0; i < 6; i++) {
      var cx0 = srand() * W, cy0 = srand() * BACK * 0.8, a = srand() * Math.PI * 2;
      if (cx0 > DOOR.x0 - 10 && cx0 < DOOR.x1 + 10) continue;
      x.strokeStyle = 'rgba(8,8,8,0.55)'; x.lineWidth = 0.5; x.beginPath(); x.moveTo(cx0, cy0);
      var cxp = cx0, cyp = cy0;
      for (var k = 0; k < 9; k++) { a += (srand() - 0.5) * 1.2; cxp += Math.cos(a) * (4 + srand() * 6); cyp += Math.sin(a) * (4 + srand() * 6); x.lineTo(cxp, cyp); if (srand() < 0.25) { x.moveTo(cxp, cyp); x.lineTo(cxp + Math.cos(a + 1.2) * 6, cyp + Math.sin(a + 1.2) * 6); x.moveTo(cxp, cyp); } }
      x.stroke();
    }
    /* rust run down from each eye bolt and under the ceiling hooks */
    for (i = 0; i < room.anchors.length; i++) {
      var an = room.anchors[i]; if (an.kind === 'floor') continue;
      var rx = an.kind === 'ring' ? (an.side < 0 ? 5 : W - 5) : an.x, ry = an.kind === 'ring' ? an.y + 3 : 4, rl = 10 + srand() * 22;
      var rg = x.createLinearGradient(0, ry, 0, ry + rl); rg.addColorStop(0, 'rgba(90,46,20,0.35)'); rg.addColorStop(1, 'rgba(90,46,20,0)');
      x.fillStyle = rg; x.fillRect(rx - 1.4, ry, 2.8, rl);
    }
    x.restore();
    /* the door: steel in a steel frame, recessed, painted a long time ago, worn at the handle and the kick plate */
    x.fillStyle = '#1e201f'; x.fillRect(DOOR.x0 - 5, DOOR.top - 5, DOOR.x1 - DOOR.x0 + 10, BACK - DOOR.top + 5);
    var dg = x.createLinearGradient(DOOR.x0, 0, DOOR.x1, 0); dg.addColorStop(0, '#3e4241'); dg.addColorStop(0.5, '#474b49'); dg.addColorStop(1, '#3a3d3c');
    x.fillStyle = dg; x.fillRect(DOOR.x0, DOOR.top, DOOR.x1 - DOOR.x0, BACK - DOOR.top);
    x.strokeStyle = 'rgba(0,0,0,0.5)'; x.lineWidth = 0.8; x.strokeRect(DOOR.x0 + 0.4, DOOR.top + 0.4, DOOR.x1 - DOOR.x0 - 0.8, BACK - DOOR.top - 0.8);
    for (i = 0; i < 40; i++) { x.fillStyle = 'rgba(' + (srand() < 0.5 ? '20,20,18' : '120,110,95') + ',' + (0.05 + srand() * 0.08).toFixed(3) + ')'; x.fillRect(DOOR.x0 + srand() * (DOOR.x1 - DOOR.x0), DOOR.top + srand() * (BACK - DOOR.top), 1 + srand() * 4, 0.5 + srand() * 2); }
    /* the slot at eye height, shut, and the handle; scuffs on the kick plate */
    x.fillStyle = '#151615'; x.fillRect(DOOR.x0 + 14, DOOR.top + 30, DOOR.x1 - DOOR.x0 - 28, 6); x.fillStyle = 'rgba(255,255,255,0.06)'; x.fillRect(DOOR.x0 + 14, DOOR.top + 36, DOOR.x1 - DOOR.x0 - 28, 0.8);
    x.fillStyle = '#202221'; x.fillRect(DOOR.x1 - 13, DOOR.top + 70, 9, 3); x.fillRect(DOOR.x1 - 7, DOOR.top + 66, 3, 10);
    x.fillStyle = 'rgba(0,0,0,0.28)'; x.fillRect(DOOR.x0 + 2, BACK - 22, DOOR.x1 - DOOR.x0 - 4, 20);
    x.fillStyle = 'rgba(130,120,100,0.08)'; for (i = 0; i < 14; i++) x.fillRect(DOOR.x0 + 3 + srand() * (DOOR.x1 - DOOR.x0 - 10), BACK - 20 + srand() * 16, 2 + srand() * 6, 0.6);
    /* the emergency lamp over it, a small caged box, off while the main light works */
    x.fillStyle = '#1b1c1b'; x.fillRect(room.emerg.x - 5, room.emerg.y - 2, 10, 6); x.fillStyle = '#3a1210'; x.fillRect(room.emerg.x - 3.5, room.emerg.y - 0.5, 7, 3);
    x.strokeStyle = 'rgba(160,160,150,0.35)'; x.lineWidth = 0.4; for (i = -2; i <= 2; i++) { x.beginPath(); x.moveTo(room.emerg.x + i * 1.6, room.emerg.y - 1); x.lineTo(room.emerg.x + i * 1.6, room.emerg.y + 3.5); x.stroke(); }
    /* the floor: smoother, darker, joints running away from you, a drain, the light's reflection a bit sharper */
    x.save(); x.beginPath(); x.moveTo(0, BACK); x.lineTo(W, BACK); x.lineTo(fr.x, H + FRONT); x.lineTo(fl.x, H + FRONT); x.closePath(); x.clip();
    for (py = BACK; py < H + FRONT; py += 1.5) for (px = fl.x; px < fr.x; px += 3) {
      n = fbm(px / 30, py / 10); d = (n - 0.5) * 26; if (Math.abs(d) < 2.5) continue;
      x.fillStyle = d > 0 ? 'rgba(255,255,250,' + (d / 300).toFixed(3) + ')' : 'rgba(0,0,0,' + (-d / 220).toFixed(3) + ')'; x.fillRect(px, py, 3, 1.5);
    }
    x.strokeStyle = 'rgba(0,0,0,0.3)'; x.lineWidth = 0.6;
    for (var jx = 0; jx <= W; jx += W / 5) { var f0 = toFront(jx, BACK); x.beginPath(); x.moveTo(jx, BACK); x.lineTo(f0.x, H + FRONT); x.stroke(); }
    x.beginPath(); x.moveTo(fl.x, H + 4); x.lineTo(fr.x, H + 4); x.stroke();
    var dx = W * 0.5 + 58, dy = H + 9;
    x.fillStyle = '#121312'; x.beginPath(); x.ellipse(dx, dy, 13, 3.4, 0, 0, Math.PI * 2); x.fill();
    x.strokeStyle = 'rgba(120,120,112,0.5)'; x.lineWidth = 0.5; for (i = -5; i <= 5; i++) { x.beginPath(); x.moveTo(dx + i * 2, dy - 2.6 * Math.sqrt(1 - (i / 6) * (i / 6))); x.lineTo(dx + i * 2, dy + 2.6 * Math.sqrt(1 - (i / 6) * (i / 6))); x.stroke(); }
    var dk = x.createRadialGradient(dx, dy, 3, dx, dy, 26); dk.addColorStop(0, 'rgba(10,8,6,0.35)'); dk.addColorStop(1, 'rgba(10,8,6,0)'); x.fillStyle = dk; x.beginPath(); x.ellipse(dx, dy, 30, 7, 0, 0, Math.PI * 2); x.fill();
    x.restore();
    /* where the planes meet: a dark line in the corner, a lighter one on the arris */
    x.strokeStyle = 'rgba(0,0,0,0.45)'; x.lineWidth = 0.9; x.beginPath(); x.moveTo(0, 0); x.lineTo(W, 0); x.lineTo(W, BACK); x.lineTo(0, BACK); x.closePath(); x.stroke();
    x.beginPath(); x.moveTo(0, 0); x.lineTo(cl.x, VY0); x.moveTo(W, 0); x.lineTo(cr.x, VY0); x.moveTo(0, BACK); x.lineTo(fl.x, H + FRONT); x.moveTo(W, BACK); x.lineTo(fr.x, H + FRONT); x.stroke();
    /* the side walls and the ceiling get the same concrete, seen at a slant */
    [[cl.x, VY0, 0, 0, 0, BACK, fl.x, H + FRONT], [cr.x, VY0, W, 0, W, BACK, fr.x, H + FRONT], [cl.x, VY0, cr.x, VY0, W, 0, 0, 0]].forEach(function (pts, wi) {
      x.save(); x.beginPath(); x.moveTo(pts[0], pts[1]); for (var q = 2; q < 8; q += 2) x.lineTo(pts[q], pts[q + 1]); x.closePath(); x.clip();
      var bx0 = Math.min(pts[0], pts[2], pts[4], pts[6]), bx1 = Math.max(pts[0], pts[2], pts[4], pts[6]), by0 = Math.min(pts[1], pts[3], pts[5], pts[7]), by1 = Math.max(pts[1], pts[3], pts[5], pts[7]);
      for (var yy = by0; yy < by1; yy += 2) for (var xx = bx0; xx < bx1; xx += 2) { var nn = fbm(xx / 20 + wi * 9, yy / 40), dd = (nn - 0.5) * 30; if (Math.abs(dd) < 2.5) continue; x.fillStyle = dd > 0 ? 'rgba(255,255,250,' + (dd / 300).toFixed(3) + ')' : 'rgba(0,0,0,' + (-dd / 230).toFixed(3) + ')'; x.fillRect(xx, yy, 2, 2); }
      x.fillStyle = wi < 2 ? 'rgba(0,0,0,0.18)' : 'rgba(0,0,0,0.26)'; x.fillRect(bx0, by0, bx1 - bx0, by1 - by0);
      x.restore();
    });
    /* grain over everything, pixel by pixel, so it never looks smooth */
    x.setTransform(1, 0, 0, 1, 0, 0);
    var img = x.getImageData(0, 0, c.width, c.height), dd2 = img.data;
    for (i = 0; i < dd2.length; i += 4) { var gn = (srand() - 0.5) * 14; dd2[i] = clamp(dd2[i] + gn, 0, 255); dd2[i + 1] = clamp(dd2[i + 1] + gn, 0, 255); dd2[i + 2] = clamp(dd2[i + 2] + gn * 0.9, 0, 255); }
    x.putImageData(img, 0, 0);
  }
  bake();
  room.drawBack = function (ctx) { ctx.drawImage(room.cv, VX0, VY0, VW, VH); };

  /* ---------------- the fixture: a tube in a steel housing, on two short chains from the ceiling */
  var lamp = room.lamp = { w: 116, h: 7, chainL: 20, state: 'ok', lvl: 1, flickT: 0, nextFlick: 9 + Math.random() * 14, sparkT: 0, body: null, cons: [], hitT: -9 };
  lamp.body = M.Bodies.rectangle(W / 2, lamp.chainL + 4, lamp.w, lamp.h, { frictionAir: 0.015, friction: 0.3, restitution: 0.1, density: 0.0028, label: 'lamp', plugin: { name: { src: 'the light fixture', kind: 'lamp', mat: 'metal' }, area: 'edge', lamp: true } });
  [-1, 1].forEach(function (s) {
    var c = M.Constraint.create({ pointA: { x: W / 2 + s * 48, y: 0 }, bodyB: lamp.body, pointB: { x: s * 48, y: -lamp.h / 2 }, length: lamp.chainL, stiffness: 0.9, damping: 0.04, render: { visible: false } });
    lamp.cons.push(c);
  });
  M.World.add(engine.world, [lamp.body].concat(lamp.cons));
  room.lampPos = function () { var b = lamp.body; return { x: b.position.x, y: b.position.y + 3 }; };
  room.lampHit = function (x, y) { return M.Query.point([lamp.body], { x: x, y: y }).length > 0 || (Math.abs(y - room.lampPos().y + 1) < 4.5 && Math.abs(x - lamp.body.position.x) < lamp.w / 2); };
  var glass = [], sparkL = [];
  /* something hit it: a knock sets it swinging and the tube stutters; a hard one breaks it */
  M.Events.on(engine, 'collisionStart', function (ev) {
    for (var i = 0; i < ev.pairs.length; i++) {
      var pr = ev.pairs[i], other = pr.bodyA === lamp.body ? pr.bodyB : pr.bodyB === lamp.body ? pr.bodyA : null; if (!other || other.isStatic) continue;
      var sp = Math.hypot(other.velocity.x - lamp.body.velocity.x, other.velocity.y - lamp.body.velocity.y);
      if (sp < 2.5 || G.t - lamp.hitT < 0.12) continue; lamp.hitT = G.t;
      if (lamp.state === 'ok') {
        if (sp > 22) { var s0 = pr.collision.supports[0] || lamp.body.position; room.breakLamp(s0.x, s0.y); continue; }
        lamp.flickT = Math.max(lamp.flickT, 0.2 + sp * 0.05);
        if (TR.sfx) { TR.sfx.play('fridge_light', { x: lamp.body.position.x, gain: clamp(sp / 18, 0.08, 0.5), rate: 1.6 }); TR.sfx.tick(); }
      } else if (TR.sfx) TR.sfx.play('step_metal', { x: lamp.body.position.x, gain: clamp(sp / 20, 0.05, 0.35), rate: 1.2 });
    }
  });
  room.breakLamp = function (x, y) {
    if (lamp.state !== 'ok') return;
    lamp.state = 'broken'; lamp.lvl = 0; lamp.sparkT = 0.4;
    var p = room.lampPos();
    for (var i = 0; i < 26; i++) glass.push({ x: p.x + rnd(-50, 50), y: p.y + rnd(-1, 2), vx: rnd(-1.2, 1.2) + (x - p.x) * 0.004, vy: rnd(-1.6, 0.4), a: rnd(0, 6.28), va: rnd(-0.3, 0.3), s: rnd(0.8, 2.6), rest: false });
    room.sparkAt(x, y, 22);
    room.flash(x, y, 0.6, '220,240,255');
    if (TR.sfx) { TR.sfx.play('glass', { x: x, gain: 0.7 }); TR.sfx.zap(1); }
    if (TR.ui) TR.ui.toast('the light\'s gone');
    var g = TR.subject; if (g && g.alive && g.dm && g.dm.cons > 0.3) G.emit('voice', g, 'alarm', 0.6);
  };
  room.sparkAt = function (x, y, n) { for (var i = 0; i < (n || 8); i++) sparkL.push({ x: x, y: y, vx: rnd(-2.2, 2.2), vy: rnd(-2.6, 0.6), life: rnd(8, 26) }); if (sparkL.length > 300) sparkL.splice(0, sparkL.length - 300); };

  /* ---------------- dust hanging in the light */
  var motes = []; for (var i = 0; i < 46; i++) motes.push({ x: rnd(W * 0.2, W * 0.8), y: rnd(20, H), vx: rnd(-0.05, 0.05), vy: rnd(-0.03, 0.04), s: rnd(0.3, 0.8), ph: rnd(0, 6) });

  /* ---------------- every frame: the tube's moods, the falling glass, the sparks, the dust, and the door */
  var idle = 0, knocked = 0;
  ['pointerdown', 'keydown', 'wheel'].forEach(function (ev) { window.addEventListener(ev, function () { idle = 0; }, { passive: true }); });
  room.tick = function (dt) {
    var h = Math.min(dt, 0.05);
    if (lamp.state === 'ok') {
      lamp.nextFlick -= h;
      if (lamp.nextFlick <= 0) { lamp.flickT = rnd(0.25, 1.1); lamp.nextFlick = 9 + Math.random() * 22; }
      if (lamp.flickT > 0) { lamp.flickT -= h; lamp.lvl = Math.random() < 0.55 ? rnd(0.25, 0.75) : 1; if (Math.random() < 0.2 && TR.sfx) TR.sfx.tick(); if (lamp.flickT <= 0) lamp.lvl = 1; }
      else lamp.lvl += (1 - lamp.lvl) * Math.min(1, h * 8);
    } else {
      /* what's left of the tube spits now and then */
      lamp.sparkT -= h; lamp.lvl *= Math.pow(0.02, h);
      if (lamp.sparkT <= 0) { lamp.sparkT = rnd(2, 7); var p = room.lampPos(); room.sparkAt(p.x + rnd(-50, 50), p.y + 2, Math.floor(rnd(6, 16))); lamp.lvl = 0.6; if (TR.sfx) TR.sfx.zap(0.5); }
    }
    for (var i = glass.length - 1; i >= 0; i--) {
      var g = glass[i]; if (g.rest) continue;
      g.vy += 0.18; g.x += g.vx; g.y += g.vy; g.a += g.va;
      if (g.y >= H - 0.5) { g.y = H - 0.5 - Math.random() * 6; g.rest = true; if (Math.random() < 0.3 && TR.sfx) TR.sfx.play('glass', { x: g.x, gain: 0.08, rate: 1.6 }); }
      if (g.x < 1 || g.x > W - 1) g.vx *= -0.5;
    }
    if (glass.length > 120) glass.splice(0, glass.length - 120);
    for (i = sparkL.length - 1; i >= 0; i--) { var s = sparkL[i]; s.vy += 0.22; s.x += s.vx; s.y += s.vy; if (s.y > H - 0.5) { s.y = H - 0.5; s.vy *= -0.35; s.vx *= 0.6; } if (--s.life <= 0) sparkL.splice(i, 1); }
    for (i = 0; i < motes.length; i++) { var m = motes[i]; m.ph += h; m.x += m.vx + Math.sin(m.ph * 0.7) * 0.02; m.y += m.vy + Math.cos(m.ph * 0.5) * 0.015; if (m.x < W * 0.1) m.x = W * 0.9; if (m.x > W * 0.9) m.x = W * 0.1; if (m.y < 10) m.y = H - 10; if (m.y > H) m.y = 12; }
    /* left alone long enough, someone comes to the door. he hears it too */
    idle += h; knocked -= h;
    if (idle > 150 && knocked <= 0) {
      knocked = 300; idle = 0;
      if (TR.sfx && TR.sfx.knock) TR.sfx.knock(room.emerg.x);
      var sub = TR.subject; if (sub && sub.alive && sub.dm && sub.dm.cons > 0.5) setTimeout(function () { if (sub.alive) G.emit('voice', sub, 'plead', 0.9); }, 1300);
    }
  };

  /* ---------------- drawing */
  room.drawFixtures = function (ctx, hot) {
    /* the anchors: ceiling hooks, eye bolts in the walls, rings in the floor */
    for (var i = 0; i < room.anchors.length; i++) {
      var a = room.anchors[i], lit = hot === a;
      ctx.save(); ctx.translate(a.x, a.y);
      ctx.strokeStyle = lit ? '#e8d27a' : '#7d7f7c'; ctx.fillStyle = '#3a3b3a'; ctx.lineWidth = 1.4;
      if (a.kind === 'hook') { ctx.fillRect(-3, -3, 6, 2.2); ctx.beginPath(); ctx.moveTo(0, -1); ctx.lineTo(0, 4); ctx.arc(-2.2, 4, 2.2, 0, Math.PI, false); ctx.lineTo(-4.4, 2.8); ctx.stroke(); }
      else if (a.kind === 'ring') { ctx.fillRect(a.side < 0 ? -2 : -1, -2.6, 3, 5.2); ctx.beginPath(); ctx.ellipse(-a.side * 2.6, 2.4, 1.6, 2.6, 0, 0, Math.PI * 2); ctx.stroke(); }
      else { ctx.fillRect(-3.4, -0.2, 6.8, 2); ctx.beginPath(); ctx.ellipse(0, -1.6, 3, 1.4, 0, 0, Math.PI * 2); ctx.stroke(); }
      if (lit) { ctx.strokeStyle = 'rgba(232,210,122,0.35)'; ctx.lineWidth = 0.6; ctx.beginPath(); ctx.arc(0, 1, 6.5, 0, Math.PI * 2); ctx.stroke(); }
      ctx.restore();
    }
    /* the fixture's chains and housing, and the tube in it */
    var b = lamp.body, p = b.position;
    ctx.strokeStyle = '#707270'; ctx.lineWidth = 0.6; ctx.setLineDash([1.4, 0.8]);
    for (var k = 0; k < lamp.cons.length; k++) { var c = lamp.cons[k]; ctx.beginPath(); ctx.moveTo(c.pointA.x, c.pointA.y); ctx.lineTo(p.x + c.pointB.x, p.y + c.pointB.y); ctx.stroke(); }
    ctx.setLineDash([]);
    ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(b.angle);
    ctx.fillStyle = '#2d2f2e'; ctx.fillRect(-lamp.w / 2, -lamp.h / 2, lamp.w, lamp.h * 0.7);
    ctx.fillStyle = 'rgba(255,255,255,0.08)'; ctx.fillRect(-lamp.w / 2, -lamp.h / 2, lamp.w, 0.8);
    if (lamp.state === 'ok') {
      var lv = lamp.lvl; ctx.fillStyle = 'rgb(' + Math.round(120 + 130 * lv) + ',' + Math.round(130 + 125 * lv) + ',' + Math.round(126 + 124 * lv) + ')';
      ctx.fillRect(-lamp.w / 2 + 3, lamp.h * 0.2 - 1, lamp.w - 6, 1.8); ctx.fillRect(-lamp.w / 2 + 3, lamp.h * 0.2 + 1.4, lamp.w - 6, 1.6);
    } else {
      ctx.fillStyle = '#4a4d4b'; ctx.fillRect(-lamp.w / 2 + 3, lamp.h * 0.2 - 1, 12, 1.8); ctx.fillRect(lamp.w / 2 - 10, lamp.h * 0.2 - 1, 7, 1.8); ctx.fillRect(-lamp.w / 2 + 3, lamp.h * 0.2 + 1.4, 20, 1.6);
      ctx.fillStyle = '#1c1d1c'; ctx.fillRect(-lamp.w / 2 + 1, lamp.h * 0.2 - 1.5, 2, 4); ctx.fillRect(lamp.w / 2 - 3, lamp.h * 0.2 - 1.5, 2, 4);
    }
    ctx.restore();
  };
  room.drawFx = function (ctx) {
    for (var i = 0; i < glass.length; i++) { var g = glass[i]; ctx.save(); ctx.translate(g.x, g.y); ctx.rotate(g.a); ctx.fillStyle = 'rgba(210,225,215,0.55)'; ctx.beginPath(); ctx.moveTo(-g.s, 0); ctx.lineTo(0, -g.s * 0.4); ctx.lineTo(g.s * 0.8, g.s * 0.3); ctx.closePath(); ctx.fill(); ctx.restore(); }
  };
  /* the light pass, over everything in the room: falloff from the fixture, the far corners near black,
     a cold tint, a little glow round the tubes, dust in the cone, muzzle flashes and sparks */
  room.flashes = [];
  room.flash = function (x, y, k, col) { room.flashes.push({ x: x, y: y, k: k, t: 0, col: col || '255,200,140' }); };
  /* the falloff and the vignette, in one small picture that's only redrawn when the light moves or flickers:
     smooth gradients lose nothing at a quarter of the size, and the frame gets one multiply instead of two
     full-screen gradients */
  var LM = document.createElement('canvas'), LMS = 0.5; LM.width = Math.ceil(VW * LMS); LM.height = Math.ceil(VH * LMS);
  var lmx = LM.getContext('2d'), lmKey = '';
  function lightMap(p, lv, ok) {
    var key = Math.round(p.x * 2) + ',' + Math.round(p.y * 2) + ',' + Math.round(lv * 100) + ',' + ok;
    if (key === lmKey) return; lmKey = key;
    var amb = ok ? 0.1 : 0.05;
    lmx.setTransform(LMS, 0, 0, LMS, -VX0 * LMS, -VY0 * LMS);
    lmx.globalCompositeOperation = 'source-over';
    var gr = lmx.createRadialGradient(p.x, p.y + 40, 6, p.x, p.y + 90, 560);
    var st = [[0, 1], [0.16, 0.88], [0.34, 0.6], [0.55, 0.36], [0.78, 0.2], [1, 0.12]];
    for (var i = 0; i < st.length; i++) { var b = amb + (st[i][1] - amb) * lv; gr.addColorStop(st[i][0], 'rgb(' + Math.round(255 * b * 0.95) + ',' + Math.round(255 * b) + ',' + Math.round(255 * b * 0.97) + ')'); }
    lmx.fillStyle = gr; lmx.fillRect(VX0, VY0, VW, VH);
    /* the vignette: the frame ends in black */
    var vg = lmx.createRadialGradient(W / 2, H * 0.45, Math.min(VW, VH) * 0.35, W / 2, H * 0.45, VW * 0.72); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,0.55)');
    lmx.fillStyle = vg; lmx.fillRect(VX0, VY0, VW, VH);
  }
  room.drawLight = function (ctx, q) {
    var p = room.lampPos(), lv = lamp.state === 'broken' ? lamp.lvl * 0.5 : lamp.lvl, ok = lamp.state === 'ok', i;
    lightMap(p, lv, ok);
    ctx.save();
    ctx.globalCompositeOperation = 'multiply';
    ctx.drawImage(LM, VX0, VY0, LM.width / LMS, LM.height / LMS);
    ctx.globalCompositeOperation = 'screen';
    if (!ok && room.emerg) { var e = room.emerg, eg = ctx.createRadialGradient(e.x, e.y + 3, 1, e.x, e.y + 30, 200); eg.addColorStop(0, 'rgba(150,20,14,0.5)'); eg.addColorStop(0.3, 'rgba(90,10,8,0.18)'); eg.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = eg; ctx.fillRect(VX0, VY0, VW, VH); ctx.fillStyle = 'rgba(255,60,40,0.9)'; ctx.beginPath(); ctx.arc(e.x, e.y + 2.5, 1.8, 0, Math.PI * 2); ctx.fill(); }
    if (lv > 0.05) {
      var bl = ctx.createRadialGradient(p.x, p.y, 2, p.x, p.y, 70); bl.addColorStop(0, 'rgba(220,240,230,' + (0.22 * lv).toFixed(3) + ')'); bl.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = bl; ctx.fillRect(p.x - 80, p.y - 80, 160, 160);
      if (q > 0) { var cg = ctx.createLinearGradient(0, p.y, 0, H); cg.addColorStop(0, 'rgba(200,220,210,' + (0.06 * lv).toFixed(3) + ')'); cg.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = cg; ctx.beginPath(); ctx.moveTo(p.x - 56, p.y + 2); ctx.lineTo(p.x + 56, p.y + 2); ctx.lineTo(p.x + 150, H); ctx.lineTo(p.x - 150, H); ctx.closePath(); ctx.fill();
        ctx.fillStyle = 'rgba(220,230,220,' + (0.35 * lv).toFixed(3) + ')'; for (i = 0; i < motes.length; i++) { var m = motes[i], dd = Math.abs(m.x - p.x) - (m.y - p.y) * 0.85; if (dd > 56) continue; ctx.fillRect(m.x, m.y, m.s, m.s); } }
    }
    ctx.globalCompositeOperation = 'lighter';
    for (i = room.flashes.length - 1; i >= 0; i--) { var f = room.flashes[i]; f.t++; var a = f.k * Math.max(0, 1 - f.t / 4); if (a <= 0) { room.flashes.splice(i, 1); continue; } var fg = ctx.createRadialGradient(f.x, f.y, 1, f.x, f.y, 260); fg.addColorStop(0, 'rgba(' + f.col + ',' + (0.5 * a).toFixed(3) + ')'); fg.addColorStop(0.25, 'rgba(' + f.col + ',' + (0.14 * a).toFixed(3) + ')'); fg.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = fg; ctx.fillRect(VX0, VY0, VW, VH); }
    for (i = 0; i < sparkL.length; i++) { var s = sparkL[i]; ctx.fillStyle = 'rgba(255,' + Math.round(170 + Math.random() * 70) + ',90,' + Math.min(1, s.life / 12).toFixed(2) + ')'; ctx.fillRect(s.x - 0.6, s.y - 0.6, 1.2, 1.2); }
    ctx.restore();
  };
  /* the guy's renderer asks where the light is for each part */
  G.lightAt = function (x, y) {
    var p = room.lampPos(), dx = p.x - x, dy = p.y - y, d = Math.hypot(dx, dy) || 1, lv = lamp.state === 'ok' ? lamp.lvl : 0.25;
    return { x: dx / d, y: dy / d, k: clamp((1.35 - d / 330) * lv, 0.15, 1.3) };
  };
  room.reset = function () {
    lamp.state = 'ok'; lamp.lvl = 1; lamp.flickT = 0; lamp.nextFlick = 9 + Math.random() * 14;
    M.Body.setPosition(lamp.body, { x: W / 2, y: lamp.chainL + 4 }); M.Body.setAngle(lamp.body, 0); M.Body.setVelocity(lamp.body, { x: 0, y: 0 }); M.Body.setAngularVelocity(lamp.body, 0);
    glass.length = 0; sparkL.length = 0; room.flashes.length = 0; lmKey = ''; idle = 0;
  };
})();
