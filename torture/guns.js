/* ============================================================
   TORTURE ROOM: firearms.
   a pistol, a shotgun and a rifle. the round goes in where the
   crosshair is, through whatever's there: him (his own damage
   model takes it from there: what's under the point, bone, organ,
   artery, out the back), a loose bit of him, a rope (it parts), a
   spike (it sparks), the light (it goes), or the concrete (a hole,
   dust, chips). buckshot is nine pellets in a spread, a slug is
   one big one; the rifle climbs while you hold it. brass comes
   out and bounces. magazines and reloads, or not, your call.
============================================================ */
(function () {
  'use strict';
  var G = window.__G3, M = Matter, B = M.Body, Q = M.Query, R = window.TR_ROOM, T = TR.tools;
  var clamp = G.clamp, rnd = G.rnd, S = G.S;
  var dried = document.getElementById('driedBloodCanvas'), dctx = dried.getContext('2d');
  var AM = TR.ammo = { inf: false, pistol: { mag: 15, n: 15 }, shotgun: { mag: 8, n: 8 }, rifle: { mag: 30, n: 30 } };
  try { var sv = JSON.parse(localStorage.getItem('ffs_torture_settings') || '{}'); if (sv.infAmmo != null) AM.inf = !!sv.infAmmo; } catch (e) {}
  var reload = null, kick = 0, lastShot = -9, bloom = 0, burst = 0, burstNext = 0, autoNext = 0, pumpT = 0;
  var fx = [], casings = [], ejectQ = [];

  /* ---------------- what each round does */
  var LOAD = {
    pistol: { std: { src: 'a 9 mm round from the pistol', size: 1, energy: 500, dv: 3.2, snd: 'pistol' }, hollow: { src: 'a hollow-point round from the pistol', size: 1.45, energy: 520, dv: 3.6, snd: 'pistol', what: 'gunshot wound, expanded, entry and exit' }, quiet: { src: 'a suppressed round from the pistol', size: 1, energy: 470, dv: 3, snd: 'suppressed', noFlash: true } },
    shotgun: { buck: { src: '00 buckshot from the shotgun', size: 0.62, energy: 230, dv: 1.15, n: 9, spread: 15, snd: 'shotgun', pellets: true, what: 'pellet wound' }, slug: { src: 'a slug from the shotgun', size: 2.1, energy: 2600, dv: 9, n: 1, snd: 'slug', painK: 1.3, what: 'gunshot wound (slug), entry and exit' }, bird: { src: 'birdshot from the shotgun', size: 0.3, energy: 35, dv: 0.25, n: 26, spread: 22, snd: 'bird', pellets: true, tiny: true, what: 'birdshot pellet wound' } },
    rifle: { auto: { src: 'a 5.56 round from the rifle', size: 0.9, energy: 1750, dv: 4.2, snd: 'rifle' }, burst: { src: 'a 5.56 round from the rifle', size: 0.9, energy: 1750, dv: 4.2, snd: 'rifle' }, semi: { src: 'a 5.56 round from the rifle', size: 0.9, energy: 1750, dv: 4.2, snd: 'rifle' } }
  };

  /* ---------------- where the gun is: low and to the right of the crosshair, pointing at it */
  function gunAt(P) { return { x: P.x + 26, y: P.y + 18, a: Math.atan2(-18, -26) }; }
  function muzzle(P, kind) { var g = gunAt(P), L = kind === 'pistol' ? 13 : 23; return { x: g.x + Math.cos(g.a) * L, y: g.y + Math.sin(g.a) * L }; }

  /* ---------------- firing */
  function fire(kind, x, y) {
    var a = AM[kind], v = T.v(kind), L = LOAD[kind][v];
    if (reload && reload.kind === kind && kind !== 'shotgun') { if (TR.sfx) TR.sfx.dry(x); return false; }
    if (!AM.inf && a.n <= 0) { if (TR.sfx) TR.sfx.dry(x); startReload(kind); return false; }
    if (kind === 'shotgun' && G.t < pumpT) return false;
    if (reload && reload.kind === 'shotgun' && kind === 'shotgun') reload = null;
    if (!AM.inf) a.n--;
    lastShot = G.t;
    var P = T.pointer, mz = muzzle(P, kind);
    if (TR.sfx) TR.sfx.gun(L.snd, x);
    G.emit('gunfire', mz.x, mz.y, x, y);
    kick = Math.min(1.6, kick + (kind === 'shotgun' ? 1.2 : kind === 'rifle' ? 0.45 : 0.7));
    if (TR.cam) TR.cam.kick(kind === 'shotgun' ? (v === 'slug' ? 3.5 : 2.6) : kind === 'rifle' ? 1.1 : 1.4);
    if (!L.noFlash) { TR.room.flash(mz.x, mz.y, kind === 'shotgun' ? 1.4 : kind === 'rifle' ? 0.8 : 1); fx.push({ k: 'muzzle', x: mz.x, y: mz.y, a: gunAt(P).a, t: 0, life: 3, big: kind === 'shotgun' }); }
    fx.push({ k: 'smoke', x: mz.x, y: mz.y, vx: rnd(-0.2, 0.2), vy: -0.25, r: 2.5, t: 0, life: 50 });
    /* the brass: out of the port now, or (the shotgun) when it pumps */
    ejectQ.push({ kind: kind, t: G.t + (kind === 'shotgun' ? 0.36 : 0) });
    if (kind === 'shotgun') pumpT = G.t + 0.62;
    var n = L.n || 1, first = true;
    for (var i = 0; i < n; i++) {
      var px = x, py = y;
      if (L.spread) { var an = Math.random() * Math.PI * 2, rr = Math.sqrt(Math.random()) * L.spread; px += Math.cos(an) * rr; py += Math.sin(an) * rr * 0.85; }
      if (kind === 'rifle') { var b = Math.min(7, 0.6 + bloom * 0.9), ba = Math.random() * Math.PI * 2; px += Math.cos(ba) * b * Math.random(); py += Math.sin(ba) * b * Math.random() - bloom * 0.25; }
      hit(px, py, L, kind, first); first = false;
    }
    if (kind === 'rifle') bloom = Math.min(9, bloom + 1);
    if (!AM.inf && a.n === 0) setTimeout(function () { startReload(kind); }, kind === 'shotgun' ? 650 : 250);
    if (TR.ui) TR.ui.onAmmo();
    return true;
  }
  /* a shove along the line of fire: the part that was hit most, the rest of him a little */
  function push(p, dir, dv) {
    if (!dv) return;
    var b = p.body, g = p.guy, k = dv * 0.5;
    B.setVelocity(b, { x: b.velocity.x + dir.x * k, y: b.velocity.y + dir.y * k });
    if (g && p.attached) for (var i = 0; i < g.list.length; i++) { var q = g.list[i]; if (q === p || !q.attached || q.removed || q.gone) continue; B.setVelocity(q.body, { x: q.body.velocity.x + dir.x * dv * 0.1, y: q.body.velocity.y + dir.y * dv * 0.1 }); }
    if (g) G.wake(g);
  }
  function hit(x, y, L, kind, first) {
    var P = T.pointer, g0 = gunAt(P), ddx = x - g0.x, ddy = y - g0.y, dl = Math.hypot(ddx, ddy) || 1, dir = { x: ddx / dl, y: ddy / dl };
    /* the fixture: the first round puts it out, after that it just rings */
    if (TR.room.lampHit(x, y)) {
      if (TR.room.lamp.state === 'ok') TR.room.breakLamp(x, y); else { TR.room.sparkAt(x, y, 8); if (TR.sfx) TR.sfx.ricochet(x, true); }
      var lb = TR.room.lamp.body; B.setVelocity(lb, { x: lb.velocity.x + dir.x * L.dv * 0.3, y: lb.velocity.y + dir.y * L.dv * 0.3 });
      return;
    }
    /* a rope in the way parts; a chain sparks */
    if (TR.ropeApi) { var rs = TR.ropes; for (var i = 0; i < rs.length; i++) { var r = rs[i], Pp = r.pts; for (var j = 0; j < Pp.length - 1; j++) { var a = Pp[j], b = Pp[j + 1], dx = b.x - a.x, dy = b.y - a.y, l2 = dx * dx + dy * dy || 1, t = clamp(((x - a.x) * dx + (y - a.y) * dy) / l2, 0, 1); if (Math.hypot(a.x + dx * t - x, a.y + dy * t - y) < 1.6) { if (r.kind === 'rope') { TR.ropeRemove(r, true); } else { TR.room.sparkAt(x, y, 8); if (TR.sfx) TR.sfx.ricochet(x, true); } return; } } } }
    /* him, or a piece of him that came off: whichever part is in front at that point */
    var p = T.partAt(x, y);
    if (p) {
      var g = p.guy, l = T.loc(p, x, y);
      if (g.dm && !g.cleared) G.dmg.shot(g, p, { lx: l.x, ly: l.y, wx: x, wy: y, dir: dir, size: L.size, energy: L.energy, exit: !L.pellets, src: L.src, srcKind: L.pellets ? 'pellet' : 'bullet', what: L.what,
        painK: L.painK || (L.tiny ? 0.4 : 1), bleedK: L.tiny ? 0.35 : 1, boneK: L.tiny ? 0 : L.pellets ? 0.45 : 1, quiet: !first, powder: dl < 34 });
      push(p, dir, L.dv);
      if (first) G.emit('sfx', L.pellets ? 'squish' : 'fleshShot', { x: x, k: L.pellets ? 0.6 : 1 });
      return;
    }
    /* the chainsaw, the spikes: steel */
    if (TR.saw && TR.saw.body && Q.point([TR.saw.body], { x: x, y: y }).length) { TR.room.sparkAt(x, y, 10); if (TR.sfx) TR.sfx.ricochet(x, true); var sb = TR.saw.body; B.setVelocity(sb, { x: sb.velocity.x + dir.x * L.dv * 0.25, y: sb.velocity.y + dir.y * L.dv * 0.25 }); return; }
    if (TR.spikeApi && TR.spikeApi.at(x, y)) { TR.room.sparkAt(x, y, 10); if (TR.sfx) TR.sfx.ricochet(x, true); return; }
    /* the bits of him on the floor, and the brass: knocked about */
    var bits = [];
    if (G.gibs) { for (i = 0; i < G.gibs.list.length; i++) bits.push(G.gibs.list[i].body); for (i = 0; i < G.gibs.guts.length; i++) bits.push.apply(bits, G.gibs.guts[i].links); }
    bits.push.apply(bits, casings);
    var hb = Q.point(bits, { x: x, y: y });
    if (hb.length) {
      var hbody = hb[0]; B.setVelocity(hbody, { x: hbody.velocity.x + dir.x * L.dv * 0.8, y: hbody.velocity.y + dir.y * L.dv * 0.8 - 0.5 });
      if (hbody.plugin && hbody.plugin.casing) { if (TR.sfx) TR.sfx.casing(x, 1); } else if (G.blood) G.blood.spray(x, y, dir.x, dir.y, 6, 3, 1.2, 1.2);
      return;
    }
    wall(x, y, L, dir);
  }
  /* the concrete: a hole and the ring of broken surface round it, dust off it, chips. the steel door: a bright scuff and a
     ricochet. it all stays on the wall until the room's reset */
  function wall(x, y, L, dir) {
    var door = TR.room.door, back = R.H - R.seam, onFloor = y > back, onSide = x < 0 || x > R.W, onCeil = y < 0;
    if (!onFloor && !onSide && !onCeil && x > door.x0 && x < door.x1 && y > door.top) {
      TR.room.sparkAt(x, y, 10); if (TR.sfx) TR.sfx.ricochet(x, true);
      dctx.save(); dctx.fillStyle = 'rgba(200,200,190,0.55)'; dctx.beginPath(); dctx.ellipse(x, y, 1.6, 1.1, rnd(0, 3), 0, Math.PI * 2); dctx.fill(); dctx.fillStyle = 'rgba(30,30,30,0.7)'; dctx.beginPath(); dctx.arc(x, y, 0.55, 0, Math.PI * 2); dctx.fill(); dctx.restore();
      return;
    }
    var k = L.pellets ? (L.tiny ? 0.42 : 0.62) : Math.max(0.7, L.size), sx = onSide ? 0.45 : 1, sy = onFloor || onCeil ? 0.45 : 1, r = 1.15 * k;
    dctx.save();
    dctx.fillStyle = 'rgba(152,148,138,0.5)'; dctx.beginPath(); dctx.ellipse(x, y, r * 2.4 * sx, r * 2.4 * sy, 0, 0, Math.PI * 2); dctx.fill();
    for (var i = 0; i < 6; i++) { var an = rnd(0, Math.PI * 2), d = r * rnd(1.4, 3); dctx.fillStyle = 'rgba(120,116,108,0.55)'; dctx.fillRect(x + Math.cos(an) * d * sx - 0.3, y + Math.sin(an) * d * sy - 0.3, rnd(0.4, 0.9), rnd(0.4, 0.9)); }
    dctx.fillStyle = 'rgba(46,44,41,0.92)'; dctx.beginPath(); dctx.ellipse(x, y, r * 1.25 * sx, r * 1.25 * sy, 0, 0, Math.PI * 2); dctx.fill();
    dctx.fillStyle = 'rgba(10,9,8,0.97)'; dctx.beginPath(); dctx.ellipse(x, y, r * 0.75 * sx, r * 0.75 * sy, 0, 0, Math.PI * 2); dctx.fill();
    dctx.restore();
    var nd = L.tiny ? 1 : L.pellets ? 2 : 5;
    for (i = 0; i < nd; i++) fx.push({ k: 'dust', x: x, y: y, vx: -dir.x * rnd(0.2, 0.9) + rnd(-0.3, 0.3), vy: -dir.y * rnd(0.1, 0.6) + rnd(-0.4, 0.1), r: rnd(0.8, 2), t: 0, life: rnd(30, 60) });
    for (i = 0; i < nd; i++) fx.push({ k: 'chip', x: x, y: y, vx: -dir.x * rnd(0.5, 2) + rnd(-0.8, 0.8), vy: -rnd(0.8, 2.4), t: 0, life: 90 });
    if (fx.length > 400) fx.splice(0, fx.length - 400);
    if (TR.sfx && Math.random() < (L.pellets ? 0.12 : 0.35)) TR.sfx.ricochet(x, false);
  }
  /* ---------------- brass */
  function spawnCasing(kind) {
    var P = T.pointer, g = gunAt(P), sh = kind === 'shotgun';
    var x = clamp(g.x + Math.cos(g.a) * (sh ? 6 : 4), 3, R.W - 3), y = clamp(g.y + Math.sin(g.a) * (sh ? 6 : 4) - 3, 3, R.H - 3);
    var b = M.Bodies.rectangle(x, y, sh ? 4.4 : 2.6, sh ? 1.9 : 1.1, { density: sh ? 0.0016 : 0.003, friction: 0.5, frictionAir: 0.012, restitution: sh ? 0.2 : 0.42, collisionFilter: G.filterGib(), label: 'casing', plugin: { casing: { kind: kind, hops: 0 } } });
    B.setAngle(b, rnd(0, Math.PI)); B.setVelocity(b, { x: rnd(1.1, 2.3), y: -rnd(2, 3.4) }); B.setAngularVelocity(b, rnd(-0.45, 0.45));
    M.World.add(engine.world, b); casings.push(b);
    while (casings.length > 60) { var o = casings.shift(); T.dropGrabOn(o); try { M.World.remove(engine.world, o); } catch (e) {} }
  }
  M.Events.on(engine, 'collisionStart', function (ev) {
    for (var i = 0; i < ev.pairs.length; i++) {
      var pr = ev.pairs[i], c = pr.bodyA.plugin && pr.bodyA.plugin.casing ? pr.bodyA : pr.bodyB.plugin && pr.bodyB.plugin.casing ? pr.bodyB : null; if (!c) continue;
      var sp = Math.hypot(c.velocity.x, c.velocity.y), cs = c.plugin.casing; if (sp < 0.8 || cs.hops > 4) continue; cs.hops++;
      if (TR.sfx) TR.sfx.casing(c.position.x, clamp(sp / 4, 0.2, 1) * (cs.kind === 'shotgun' ? 0.5 : 1));
    }
  });

  /* ---------------- reloading: a magazine for the pistol and the rifle, a shell at a time for the shotgun. it counts
     time the room is running, so a pause holds it where it is */
  function startReload(kind) {
    var a = AM[kind]; if (AM.inf || a.n >= a.mag || (reload && reload.kind === kind)) return;
    reload = { kind: kind, left: kind === 'pistol' ? 1.15 : kind === 'rifle' ? 1.7 : 0.48 };
    if (TR.sfx) TR.sfx.reload(kind, T.pointer.x);
    if (TR.ui) TR.ui.onAmmo();
  }
  TR.reloadGun = function () { if (T.cur && AM[T.cur.id]) startReload(T.cur.id); };
  function tick(dt) {
    if (!reload) return;
    reload.left -= dt; if (reload.left > 0) return;
    var a = AM[reload.kind];
    if (reload.kind === 'shotgun') { a.n = Math.min(a.mag, a.n + 1); if (TR.sfx) TR.sfx.play('click', { gain: 0.35, rate: 0.8 }); if (a.n < a.mag) { reload.left = 0.48; } else { reload = null; if (TR.sfx) TR.sfx.pump(T.pointer.x); } }
    else { a.n = a.mag; reload = null; }
    if (TR.ui) TR.ui.onAmmo();
  }

  /* ---------------- per frame: the rifle's trigger, the fx, the recoil coming back down */
  function frame(dt) {
    tick(dt);
    kick *= Math.pow(0.0008, dt); if (kick < 0.01) kick = 0;
    if (G.t - lastShot > 0.28) bloom *= 0.85;
    for (var q = ejectQ.length - 1; q >= 0; q--) if (G.t >= ejectQ[q].t) { spawnCasing(ejectQ[q].kind); ejectQ.splice(q, 1); }
    var P = T.pointer;
    if (T.cur && T.cur.id === 'rifle' && !TR.paused) {
      var v = T.v('rifle');
      /* eleven a second of the room's own time: a slow frame doesn't fire faster or slower than the room runs */
      if (v === 'auto' && P.down && !P.right) { if (G.t - autoNext > 0.2) autoNext = G.t; var n = 0; while (G.t >= autoNext && n < 2) { fire('rifle', P.x, P.y); autoNext += 1 / 11; n++; } }
      if (v === 'burst' && burst > 0 && G.t >= burstNext) { if (fire('rifle', P.x, P.y)) { burst--; burstNext = G.t + 0.075; } else burst = 0; }
    } else burst = 0;
    for (var i = fx.length - 1; i >= 0; i--) {
      var f = fx[i]; f.t++;
      if (f.k === 'dust' || f.k === 'smoke') { f.x += f.vx; f.y += f.vy; f.vx *= 0.96; f.vy *= 0.96; f.r += 0.04; }
      if (f.k === 'chip') { f.x += f.vx; f.y += f.vy; f.vy += 0.2; if (f.y > R.H - 0.4) { f.y = R.H - 0.4; f.vy *= -0.3; f.vx *= 0.5; } }
      if (f.t > f.life) fx.splice(i, 1);
    }
  }
  function fastest() { var v = 0; for (var i = 0; i < casings.length; i++) { var c = casings[i].velocity; v = Math.max(v, Math.hypot(c.x, c.y) * 0.5); } return v; }

  /* ---------------- drawing: the fx in the room, the gun and its sight over everything */
  function drawFront(ctx) {
    for (var i = 0; i < casings.length; i++) { var c = casings[i], v = c.vertices; ctx.fillStyle = c.plugin.casing.kind === 'shotgun' ? '#8a1e14' : '#b8923e'; ctx.beginPath(); ctx.moveTo(v[0].x, v[0].y); for (var j = 1; j < v.length; j++) ctx.lineTo(v[j].x, v[j].y); ctx.closePath(); ctx.fill(); }
    for (i = 0; i < fx.length; i++) {
      var f = fx[i], k = 1 - f.t / f.life;
      if (f.k === 'dust') { ctx.fillStyle = 'rgba(150,148,140,' + (0.35 * k).toFixed(3) + ')'; ctx.beginPath(); ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2); ctx.fill(); }
      else if (f.k === 'chip') { ctx.fillStyle = 'rgba(120,118,112,0.9)'; ctx.fillRect(f.x, f.y, 0.8, 0.6); }
      else if (f.k === 'smoke') { ctx.fillStyle = 'rgba(190,190,185,' + (0.18 * k).toFixed(3) + ')'; ctx.beginPath(); ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2); ctx.fill(); }
    }
  }
  function poly(ctx, pts, fill) { ctx.beginPath(); ctx.moveTo(pts[0], pts[1]); for (var i = 2; i < pts.length; i += 2) ctx.lineTo(pts[i], pts[i + 1]); ctx.closePath(); ctx.fillStyle = fill; ctx.fill(); }
  /* the gun itself, its barrel along +x and its grip on +y whichever way it's pointing */
  function drawGun(ctx, kind, P) {
    var g = gunAt(P), kk = kick;
    ctx.save(); ctx.translate(g.x, g.y); ctx.rotate(g.a); if (Math.cos(g.a) < 0) ctx.scale(1, -1);
    ctx.translate(-kk * (kind === 'shotgun' ? 3.2 : 2.2), 0); ctx.rotate(-kk * (kind === 'rifle' ? 0.07 : 0.16));
    var steel = '#2a2c2d', dark = '#18191a', hi = 'rgba(255,255,255,0.16)';
    if (kind === 'pistol') {
      poly(ctx, [-1, 1.4, 3.6, 1.4, 2.7, 8.6, -2.3, 8.2], dark);                        /* grip */
      ctx.fillStyle = 'rgba(255,255,255,0.05)'; for (var i = 0; i < 4; i++) ctx.fillRect(-1.2 + i * 0.2, 3 + i * 1.3, 3.4, 0.4);
      ctx.fillStyle = steel; ctx.fillRect(-1.4, -0.2, 12.4, 1.9);                        /* frame */
      ctx.strokeStyle = steel; ctx.lineWidth = 0.6; ctx.beginPath(); ctx.arc(5.6, 2.5, 1.5, 0, Math.PI); ctx.stroke();
      ctx.fillStyle = '#323536'; ctx.fillRect(-2, -2.8, 15, 2.7);                        /* slide */
      ctx.fillStyle = hi; ctx.fillRect(-2, -2.8, 15, 0.5);
      ctx.fillStyle = 'rgba(0,0,0,0.5)'; for (i = 0; i < 4; i++) ctx.fillRect(-1.2 + i * 0.8, -2.5, 0.35, 2.1);
      if (T.v('pistol') === 'quiet') { ctx.fillStyle = '#121314'; ctx.fillRect(13, -2.4, 9, 2.2); ctx.fillStyle = hi; ctx.fillRect(13, -2.4, 9, 0.4); }
    } else if (kind === 'shotgun') {
      poly(ctx, [-2, -1.6, -16, -0.6, -17, 3.4, -11, 3, -2, 1.6], '#3b2618');              /* stock */
      ctx.fillStyle = 'rgba(255,220,180,0.07)'; ctx.fillRect(-16, -0.4, 13, 0.6);
      ctx.fillStyle = steel; ctx.fillRect(-2.4, -2.2, 8.4, 4.2);                          /* receiver */
      poly(ctx, [0.5, 2, 3.4, 2, 2.6, 6.8, -0.6, 6.4], dark);                              /* grip and guard */
      ctx.fillStyle = '#26282a'; ctx.fillRect(6, -2, 18, 1.8);                             /* barrel */
      ctx.fillStyle = '#1e2021'; ctx.fillRect(6, -0.2, 15, 1.4);                           /* the tube under it */
      ctx.fillStyle = '#4a3020'; ctx.fillRect(9 - (G.t < pumpT ? 3 * Math.sin(clamp((pumpT - G.t) / 0.62, 0, 1) * Math.PI) : 0), -0.6, 7, 2.4);   /* the pump, back and forward */
      ctx.fillStyle = hi; ctx.fillRect(6, -2, 18, 0.45);
    } else {
      poly(ctx, [-2, -1.8, -14, -1.4, -15, 3.2, -10, 2.4, -2, 1.4], '#1d1e1f');              /* stock */
      ctx.fillStyle = steel; ctx.fillRect(-2.4, -2.4, 11, 4.2);                           /* receiver */
      poly(ctx, [4, 1.8, 7.4, 1.8, 8.6, 7.2, 5.2, 7.6], '#141515');                        /* magazine */
      poly(ctx, [-0.4, 1.8, 2.4, 1.8, 1.6, 6.4, -1.4, 6.1], dark);                         /* grip */
      ctx.fillStyle = '#232526'; ctx.fillRect(8.6, -1.9, 9, 3.2);                          /* handguard */
      ctx.fillStyle = '#2c2e2f'; ctx.fillRect(17.6, -1.1, 5.4, 1.3);                       /* barrel */
      ctx.fillStyle = dark; ctx.fillRect(1, -4, 6, 1.6); ctx.fillRect(15, -3.6, 1, 1.7);   /* the sights */
      ctx.fillStyle = hi; ctx.fillRect(-2.4, -2.4, 20, 0.45);
    }
    ctx.restore();
  }
  /* the sight: a crosshair (with the shotgun's pattern, the rifle's spread), and what's left in the gun */
  function drawSight(ctx, kind, P) {
    ctx.save(); ctx.translate(P.x, P.y);
    var gap = 1.6, len = 3.2;
    for (var pass = 0; pass < 2; pass++) {
      ctx.strokeStyle = pass ? 'rgba(235,235,225,0.85)' : 'rgba(0,0,0,0.55)'; ctx.lineWidth = pass ? 0.45 : 1.1;
      ctx.beginPath(); ctx.moveTo(-gap - len, 0); ctx.lineTo(-gap, 0); ctx.moveTo(gap, 0); ctx.lineTo(gap + len, 0); ctx.moveTo(0, -gap - len); ctx.lineTo(0, -gap); ctx.moveTo(0, gap); ctx.lineTo(0, gap + len); ctx.stroke();
    }
    var L = LOAD[kind][T.v(kind)];
    if (L.spread) { ctx.strokeStyle = 'rgba(235,235,225,0.28)'; ctx.lineWidth = 0.4; ctx.setLineDash([1.2, 1.4]); ctx.beginPath(); ctx.ellipse(0, 0, L.spread, L.spread * 0.85, 0, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]); }
    if (kind === 'rifle' && bloom > 0.5) { ctx.strokeStyle = 'rgba(235,235,225,0.25)'; ctx.lineWidth = 0.4; ctx.beginPath(); ctx.arc(0, -bloom * 0.12, Math.min(7, 0.6 + bloom * 0.9), 0, Math.PI * 2); ctx.stroke(); }
    ctx.fillStyle = 'rgba(235,235,225,0.9)'; ctx.fillRect(-0.3, -0.3, 0.6, 0.6);
    ctx.restore();
    ctx.save();
    var a = AM[kind]; ctx.font = '4px monospace'; ctx.fillStyle = 'rgba(235,235,225,0.7)'; ctx.textAlign = 'left';
    ctx.fillText(AM.inf ? '∞' : (reload && reload.kind === kind ? 'reloading' : a.n + '/' + a.mag), P.x + 5, P.y + 9);
    ctx.restore();
  }
  function drawOver(ctx) {
    for (var i = 0; i < fx.length; i++) {
      var f = fx[i]; if (f.k !== 'muzzle') continue;
      ctx.save(); ctx.translate(f.x, f.y); ctx.rotate(f.a + Math.PI);
      var s = (f.big ? 1.6 : 1) * (1 - f.t / (f.life + 1));
      ctx.fillStyle = 'rgba(255,220,150,0.95)'; ctx.beginPath(); ctx.moveTo(0, 0);
      for (var j = 0; j < 7; j++) { var an = j / 7 * Math.PI * 2, rr = (j & 1 ? 2 : 6) * s; ctx.lineTo(Math.cos(an) * rr - 4 * s, Math.sin(an) * rr); }
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,230,0.95)'; ctx.beginPath(); ctx.arc(-2.4 * s, 0, 1.7 * s, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }
  }
  T.mods.push({ id: 'guns', frame: frame, drawFront: drawFront, drawOver: drawOver, fastest: fastest,
    reset: function () { for (var i = 0; i < casings.length; i++) { T.dropGrabOn(casings[i]); try { M.World.remove(engine.world, casings[i]); } catch (e) {} } casings.length = 0; fx.length = 0; ejectQ.length = 0; reload = null; kick = 0; bloom = 0; burst = 0; pumpT = 0; AM.pistol.n = AM.pistol.mag; AM.shotgun.n = AM.shotgun.mag; AM.rifle.n = AM.rifle.mag; if (TR.ui) TR.ui.onAmmo(); } });
  T.extraBodies = (function (prev) { return function () { var o = prev ? prev() : []; return o.concat(casings); }; })(T.extraBodies);

  /* ---------------- the three tools */
  function gun(id, name, help, variants) {
    T.add({ id: id, group: 'guns', name: name, help: help, variants: variants, cursor: 'none',
      down: function (pt) {
        if (id === 'rifle') {
          var v = T.v('rifle');
          if (v === 'auto') { if (fire('rifle', pt.x, pt.y)) autoNext = G.t + 1 / 11; }
          else if (v === 'burst') { if (burst === 0 && fire('rifle', pt.x, pt.y)) { burst = 2; burstNext = G.t + 0.075; } }
          else fire('rifle', pt.x, pt.y);
          return;
        }
        fire(id, pt.x, pt.y);
      },
      key: function (k) { if (k === 'r') { startReload(id); return true; } return false; },
      drawCursor: function (ctx, P) { drawGun(ctx, id, P); drawSight(ctx, id, P); },
      select: function () { if (TR.ui) TR.ui.onAmmo(); }
    });
  }
  gun('pistol', 'PISTOL', 'click to fire where the sight is. R reloads. point it at him and he\'ll put his hands up.', [{ id: 'std', name: '9 MM', help: 'a round through and out the back.' }, { id: 'hollow', name: 'HOLLOW POINT', help: 'opens up going in: a bigger hole, more blood.' }, { id: 'quiet', name: 'SUPPRESSED', help: 'no flash, a cough instead of a bang.' }]);
  gun('shotgun', 'SHOTGUN', 'click to fire. it pumps itself between shots. R loads shells one at a time.', [{ id: 'buck', name: 'BUCKSHOT', help: 'nine pellets in a spread, the size of the circle.' }, { id: 'slug', name: 'SLUG', help: 'one heavy round. it knocks him over.' }, { id: 'bird', name: 'BIRDSHOT', help: 'a cloud of small pellets: a lot of small holes, nothing deep.' }]);
  gun('rifle', 'RIFLE', 'hold to fire. it climbs and spreads the longer you hold it. R reloads.', [{ id: 'auto', name: 'FULL AUTO', help: 'eleven rounds a second while you hold.' }, { id: 'burst', name: 'BURST', help: 'three rounds a click.' }, { id: 'semi', name: 'SEMI', help: 'one round a click.' }]);
  TR.setInfAmmo = function (on) { AM.inf = !!on; if (AM.inf) reload = null; try { var sv = JSON.parse(localStorage.getItem('ffs_torture_settings') || '{}'); sv.infAmmo = AM.inf; localStorage.setItem('ffs_torture_settings', JSON.stringify(sv)); } catch (e) {} if (TR.ui) TR.ui.onAmmo(); };
  TR.gunMuzzle = function () { return T.cur && AM[T.cur.id] && !T.pointer.right ? muzzle(T.pointer, T.cur.id) : null; };
  TR.gunState = function () { var k = T.cur && AM[T.cur.id] ? T.cur.id : null; return k ? { kind: k, n: AM[k].n, mag: AM[k].mag, inf: AM.inf, reloading: !!(reload && reload.kind === k) } : null; };
})();
