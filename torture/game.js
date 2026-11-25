/* ============================================================
   TORTURE ROOM: the loop.
   the camera that fits the room to the window, the physics stepped
   at 60 a second (split finer while anything is moving fast enough
   to go through something thin), the frame drawn back to front,
   pause, reset, and the first subject.
============================================================ */
(function () {
  'use strict';
  var G = window.__G3, M = Matter, R = window.TR_ROOM, room = TR.room;
  var view = document.getElementById('tr-view'), ctx = view.getContext('2d');
  var dried = document.getElementById('driedBloodCanvas');

  /* ---------------- the camera: the whole room, as big as the window allows, above the tool palette */
  var cam = TR.cam = { z: 1, ox: 0, oy: 0, dpr: 1, shake: 0 };
  TR.fit = function () {
    var dpr = Math.min(2, window.devicePixelRatio || 1), cw = window.innerWidth, ch = window.innerHeight;
    view.width = Math.round(cw * dpr); view.height = Math.round(ch * dpr); view.style.width = cw + 'px'; view.style.height = ch + 'px';
    var pal = TR.ui ? TR.ui.reserved() : { top: 0, bottom: 0 };
    var availH = Math.max(120, ch - pal.bottom - pal.top);
    var z = Math.min(cw / room.VW, availH / room.VH);
    cam.z = z; cam.dpr = dpr;
    cam.ox = (cw - room.VW * z) / 2 - room.VX0 * z;
    cam.oy = pal.top + (availH - room.VH * z) / 2 - room.VY0 * z;
  };
  cam.toWorld = function (cx, cy) { return { x: (cx - cam.ox) / cam.z, y: (cy - cam.oy) / cam.z }; };
  cam.toScreen = function (wx, wy) { return { x: wx * cam.z + cam.ox, y: wy * cam.z + cam.oy }; };
  cam.kick = function (k) { cam.shake = Math.max(cam.shake, k); };

  /* ---------------- the physics: fixed 60 Hz, with substeps when something's fast (Matter has no swept collision,
     so a forearm thrown at a spike gets four smaller steps instead of one big one it could skip the spike in) */
  var STEP = 1000 / 60;
  TR.paused = false; TR.frozen = false;
  TR.stepCount = 0;
  function fastest() {
    var v = 0;
    for (var i = 0; i < G.guys.length; i++) { var g = G.guys[i]; if (g.cleared) continue; for (var j = 0; j < g.list.length; j++) { var p = g.list[j]; if (p.removed) continue; var b = p.body.velocity, s = b.x * b.x + b.y * b.y; if (s > v) v = s; } }
    if (G.gibs) for (i = 0; i < G.gibs.loose.length; i++) { var L = G.gibs.loose[i]; if (L.p.removed) continue; var lv = L.p.body.velocity, ls = lv.x * lv.x + lv.y * lv.y; if (ls > v) v = ls; }
    v = Math.sqrt(v);
    if (TR.tools && TR.tools.fastest) v = Math.max(v, TR.tools.fastest());
    return v;
  }
  function clampSpeeds() {
    var MAXV = 64;
    for (var i = 0; i < G.guys.length; i++) { var g = G.guys[i]; if (g.cleared) continue; for (var j = 0; j < g.list.length; j++) { var b = g.list[j].body, v = b.velocity, s = Math.hypot(v.x, v.y); if (s > MAXV) M.Body.setVelocity(b, { x: v.x * MAXV / s, y: v.y * MAXV / s }); if (Math.abs(b.angularVelocity) > 1.2) M.Body.setAngularVelocity(b, Math.sign(b.angularVelocity) * 1.2); } }
  }
  TR.substeps = 1;
  function step() {
    var v = fastest(), sub = v > 9 ? Math.min(4, Math.ceil(v / 9)) : 1;
    TR.substeps = sub;
    for (var i = 0; i < sub; i++) {
      if (TR.tools) TR.tools.preStep(sub);
      M.Engine.update(engine, STEP / sub);
      if (TR.tools) TR.tools.postStep(sub);
    }
    clampSpeeds();
    TR.stepCount++;
  }
  TR.step = step;

  /* ---------------- the frame, back to front */
  if (TR.quality == null) TR.quality = 1;
  /* the puddles, from the blood code's own pool: on a floor you're looking down at, so they spread toward you
     and away, not up */
  function puddles(ctx) {
    if (!G.blood || !G.blood.poolAt) return;
    var H = R.H, W = R.W, runs = [], cur = null;
    for (var x = 0; x <= W; x += 3) {
      var v = G.blood.poolAt(x), d = v > 0.05 ? Math.min(15, Math.sqrt(v) * 1.15) : 0;
      if (d > 0.3) { if (!cur) { cur = []; runs.push(cur); } cur.push([x, d]); } else cur = null;
    }
    if (!runs.length) return;
    ctx.save();
    /* each run of the pool by how old the blood in it is: wet red to dark brown as it dries, the shine going with it */
    var ages = runs.map(function (run) { var a = 0; for (var i = 0; i < run.length; i++) a += G.blood.poolAge ? G.blood.poolAge(run[i][0]) : 0; return Math.min(1, a / run.length / 240); });
    for (var pass = 0; pass < 2; pass++) {
      var kk = pass ? 0.55 : 1;
      for (var r = 0; r < runs.length; r++) {
        var run = runs[r], a = ages[r];
        ctx.beginPath();
        ctx.moveTo(run[0][0] - 1.5, H);
        for (var i = 0; i < run.length; i++) ctx.lineTo(run[i][0], H - run[i][1] * 0.32 * kk);
        ctx.lineTo(run[run.length - 1][0] + 1.5, H);
        for (i = run.length - 1; i >= 0; i--) ctx.lineTo(run[i][0], H + run[i][1] * 0.6 * kk);
        ctx.closePath();
        ctx.fillStyle = pass ? 'rgba(' + Math.round(48 - a * 14) + ',' + Math.round(2 + a * 8) + ',2,0.5)' : 'rgba(' + Math.round(92 - a * 42) + ',' + Math.round(6 + a * 14) + ',' + Math.round(6 + a * 4) + ',0.92)'; ctx.fill();
      }
    }
    ctx.lineWidth = 0.5;
    for (r = 0; r < runs.length; r++) { if (ages[r] > 0.8) continue; ctx.strokeStyle = 'rgba(255,190,190,' + (0.16 * (1 - ages[r] / 0.8)).toFixed(3) + ')'; ctx.beginPath(); var on = false; for (i = 0; i < runs[r].length; i++) { var p = runs[r][i]; if (p[1] > 2) { var y = H - p[1] * 0.18; on ? ctx.lineTo(p[0], y) : ctx.moveTo(p[0], y); on = true; } else on = false; } ctx.stroke(); }
    ctx.restore();
  }
  function draw() {
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = '#000'; ctx.fillRect(0, 0, view.width, view.height);
    var sx = 0, sy = 0;
    if (cam.shake > 0) { sx = (Math.random() - 0.5) * cam.shake; sy = (Math.random() - 0.5) * cam.shake; cam.shake *= 0.8; if (cam.shake < 0.05) cam.shake = 0; }
    var k = cam.z * cam.dpr;
    ctx.setTransform(k, 0, 0, k, (cam.ox + sx) * cam.dpr, (cam.oy + sy) * cam.dpr);
    ctx.save(); ctx.beginPath(); ctx.rect(room.VX0, room.VY0, room.VW, room.VH); ctx.clip();
    room.drawBack(ctx);
    ctx.drawImage(dried, room.VX0, room.VY0, room.VW, room.VH);
    puddles(ctx);
    room.drawFixtures(ctx, TR.tools ? TR.tools.hotAnchor : null);
    if (TR.tools) TR.tools.drawBack(ctx);
    try { G.draw(ctx); } catch (e) { G.err('draw', e); }
    if (TR.tools) TR.tools.drawFront(ctx);
    room.drawFx(ctx);
    room.drawLight(ctx, TR.quality);
    if (TR.tools) TR.tools.drawOver(ctx);
    ctx.restore();
  }
  TR.draw = draw;

  /* ---------------- the subject */
  var DUMMY = { style: 'dummy', skin: [24, 26, 63], cloth: { pelvis: 'briefs' }, pants: '#2a2c2e', hat: false, noName: true, stripe: false };
  TR.n = 0;
  TR.spawn = function () {
    TR.n++;
    var g = G.spawn({ home: true, name: 'Subject ' + TR.n, look: Object.assign({}, DUMMY), dusty: !!TR.wantDusty, force: true });
    TR.wantDusty = false;
    if (g) { G.wake(g); TR.subject = g; if (window.TR_HAT || G.hatsForAll) { g.look.hat = true; g.look.hatCol = '#3a2a1a'; } }
    return g;
  };
  /* everything back the way it was: him, the blood, the bits, the ropes and spikes, the light */
  TR.reset = function () {
    if (TR.tools) TR.tools.reset();
    for (var i = G.guys.length - 1; i >= 0; i--) G.body.destroy(G.guys[i]);
    if (G.gibs && G.gibs.reset) G.gibs.reset();
    if (G.blood && G.blood.reset) G.blood.reset();
    room.reset();
    if (G.recap && G.recap.isOpen && G.recap.isOpen()) G.recap.hide();
    cam.shake = 0;
    TR.spawn();
    if (TR.ui) TR.ui.onReset();
    if (TR.sfx) TR.sfx.play('latch', { x: R.W / 2, gain: 0.35 });
  };

  /* ---------------- going */
  var last = performance.now(), acc = 0;
  function frame(now) {
    requestAnimationFrame(frame);
    var dt = now - last; last = now; if (dt > 250) dt = 250;
    var xr = G.recap && G.recap.isOpen && G.recap.isOpen(), running = !TR.paused && !xr && !TR.frozen;
    if (running) {
      acc += dt; var n = 0;
      while (acc >= STEP && n < 3) { step(); acc -= STEP; n++; }
      if (n >= 3) acc = 0;
      room.tick(dt / 1000);
    } else acc = 0;
    /* paused, the tools hold still too: no auto-fire, no saw running down, no timers */
    if (TR.tools) TR.tools.frame(running ? dt / 1000 : 0);
    if (!TR.frozen) draw();
    if (TR.ui) TR.ui.frame(dt / 1000);
  }
  window.addEventListener('resize', function () { TR.fit(); });
  document.addEventListener('fullscreenchange', function () { setTimeout(TR.fit, 60); });
  TR.boot = function () {
    TR.fit();
    TR.spawn();
    if (TR.ui) TR.ui.onReset();
    requestAnimationFrame(function (t) { last = t; frame(t); });
  };
  TR.boot();
})();

