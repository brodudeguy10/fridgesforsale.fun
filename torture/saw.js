/* ============================================================
   TORTURE ROOM: the chainsaw.
   a real object in the room: an engine and a bar, as heavy as a
   chainsaw is next to a man, held at the cursor by its top handle
   on a spring, so it swings, bumps him, and lies on the floor when
   you put it down. press to pull the cord, hold to open it up.
   with the chain moving, whatever the bar touches gets bitten,
   over and over, deeper the longer it stays: skin, fat, muscle,
   bone, and at a joint the limb comes off. off, or idling, it only
   pushes. let go and it idles; seven seconds idle and it dies.
============================================================ */
(function () {
  'use strict';
  var G = window.__G3, M = Matter, B = M.Body, R = window.TR_ROOM, T = TR.tools;
  var clamp = G.clamp, rnd = G.rnd, S = G.S;
  var saw = TR.saw = { body: null, bar: null, eng: null, hold: null, state: 'off', thr: 0, load: 0, idleT: 0, crankT: 0, phase: 0, tgt: 0, manual: 0, blood: 0, smoke: [], bites: {}, sparkT: 0, contacts: 0, face: 1 };

  /* ---------------- the saw: an engine you hold by its top handle, and a bar in front of it */
  var BAR0 = 12, BARL = 36, BARW = 5;
  function make(x, y) {
    var eng = M.Bodies.rectangle(x, y, 22, 13, { chamfer: { radius: 2 } }), bar = M.Bodies.rectangle(x + BAR0 + BARL / 2, y + 1.5, BARL, BARW, { chamfer: { radius: 2.4 } });
    /* the damage code meets the parts, not the whole: each says what it is */
    var nm = { src: 'the chainsaw', kind: 'saw', mat: 'metal' };
    eng.plugin = { name: nm, area: 'broad', saw: true }; bar.plugin = { name: nm, area: 'edge', saw: true };
    var b = B.create({ parts: [eng, bar], frictionAir: 0.03, friction: 0.15, restitution: 0.05, collisionFilter: { category: G.CAT.TNT, mask: 0xFFFFFFFF, group: 0 }, label: 'chainsaw', plugin: { name: nm, area: 'edge', saw: true } });
    var total = 0; for (var i = 0; i < G.guys.length; i++) { var g = G.guys[i]; if (g.cleared) continue; for (var j = 0; j < g.list.length; j++) total += g.list[j].body.mass; }
    B.setMass(b, Math.max(1, (total || 9) * 0.075));
    M.World.add(engine.world, b); saw.body = b; saw.bar = bar; saw.eng = eng; saw.face = 1;
  }
  /* the handle, in the saw's own frame: top of the engine, at the back. turned to face left, the saw is mirrored, not
     upside down: the handle stays on top */
  var HANDLE = { x: -5, y: -7 };
  function handlePt(face) { return G.toWorld(saw.eng, HANDLE.x, HANDLE.y * face); }
  function holdOn() {
    if (!saw.body) { var P = T.pointer; make(clamp(P.x + 8, 20, R.W - 50), clamp(P.y + 4, 15, R.H - 15)); }
    if (saw.hold) return;
    var b = saw.body; saw.face = Math.cos(b.angle) < 0 ? -1 : 1;
    var hp = handlePt(saw.face);
    saw.hold = M.Constraint.create({ pointA: { x: T.pointer.x, y: T.pointer.y }, bodyB: b, pointB: { x: hp.x - b.position.x, y: hp.y - b.position.y }, length: 0, stiffness: 0.32, damping: 0.12, render: { visible: false } });
    M.World.add(engine.world, saw.hold);
    saw.tgt = b.angle;
  }
  function letGo() { if (saw.hold) { try { M.World.remove(engine.world, saw.hold); } catch (e) {} saw.hold = null; } }
  function stopEngine(quiet) { if (saw.state !== 'off') { saw.state = 'off'; if (!quiet && TR.sfx) TR.sfx.saw.stop(); } saw.thr = 0; saw.load = 0; }

  /* ---------------- where it points: at him, or where you've turned it */
  function aimAngle() {
    var hp = handlePt(saw.face);
    if (T.v('chainsaw') === 'free') return saw.manual;
    var g = TR.subject, best = null, bd = 1e9;
    if (g && !g.cleared) for (var i = 0; i < g.list.length; i++) { var p = g.list[i]; if (p.removed || p.gone) continue; var d = Math.hypot(p.body.position.x - hp.x, p.body.position.y - hp.y); if (d < bd) { bd = d; best = p; } }
    if (!best || bd > 140) return hp.x < R.W / 2 ? 0.25 : Math.PI - 0.25;
    return Math.atan2(best.body.position.y - hp.y, best.body.position.x - hp.x);
  }
  /* ---------------- every physics step */
  function preStep(sub) {
    if (!saw.body) return;
    var b = saw.body, P = T.pointer;
    if (saw.hold) {
      saw.hold.pointA.x = P.x; saw.hold.pointA.y = P.y;
      var want = aimAngle(); saw.tgt += G.wrap(want - saw.tgt) * 0.12;
      /* facing the other way now: the hand moves to where the top handle is on that side */
      var c = Math.cos(saw.tgt), f = c < -0.15 ? -1 : c > 0.15 ? 1 : saw.face;
      if (f !== saw.face) { saw.face = f; var hp = handlePt(f); saw.hold.pointB = { x: hp.x - b.position.x, y: hp.y - b.position.y }; saw.hold.angleB = b.angle; }
      var err = G.wrap(saw.tgt - b.angle), w = b.angularVelocity;
      B.setAngularVelocity(b, w + (err * 0.22 - w * 0.35) / sub);
    }
    /* the engine running shakes it in your hand */
    if (saw.state === 'run') { var k = (0.12 + 0.5 * saw.thr) / sub; B.setVelocity(b, { x: b.velocity.x + rnd(-k, k), y: b.velocity.y + rnd(-k, k) }); }
  }
  /* after each step: what the bar is touching, and what the chain does to it */
  function postStep(sub) {
    if (!saw.body) return;
    var running = saw.state === 'run' && saw.thr > 0.25, h = 1 / (60 * sub), pairs = engine.pairs.list, cutting = 0, walls = 0;
    for (var i = 0; i < pairs.length; i++) {
      var pr = pairs[i]; if (!pr.isActive) continue;
      var other = pr.bodyA === saw.bar ? pr.bodyB : pr.bodyB === saw.bar ? pr.bodyA : null; if (!other) continue;
      var sp = pr.collision && pr.collision.supports && pr.collision.supports[0] ? pr.collision.supports[0] : other.position;
      var part = other.plugin && other.plugin.part;
      if (part && !part.removed && !part.gone) { cutting++; if (running) bite(part, sp, h); else if (saw.state === 'run') shake(part, 0.15); }
      else if (other.isStatic) { walls++; if (running) grind(sp, h); }
    }
    saw.contacts = cutting;
    var ld = cutting ? clamp(0.5 + 0.2 * cutting, 0, 1) : walls ? 0.45 : 0;
    saw.load += (ld - saw.load) * Math.min(1, h * 10);
  }
  function shake(part, k) { var b = part.body; B.setVelocity(b, { x: b.velocity.x + rnd(-k, k), y: b.velocity.y + rnd(-k, k) }); }
  /* the chain in flesh: a bite every so often, deeper the longer it stays, blood off the chain */
  function bite(part, sp, h) {
    var g = part.guy, id = part.id + ':' + g.id, acc = (saw.bites[id] || 0) + h * (5 + 9 * saw.thr);
    shake(part, 0.35 * saw.thr);
    var ax = Math.cos(saw.body.angle), ay = Math.sin(saw.body.angle);
    if (acc >= 1) {
      acc -= 1;
      var la = T.loc(part, sp.x - ax * 5, sp.y - ay * 5), lb = T.loc(part, sp.x + ax * 5, sp.y + ay * 5), l = T.loc(part, sp.x, sp.y);
      if (g.dm && !g.cleared) G.dmg.cut(g, part, { lx: l.x, ly: l.y, lx1: la.x, ly1: la.y, lx2: lb.x, ly2: lb.y, wx: sp.x, wy: sp.y, dir: { x: ax, y: ay }, len: 9 * S,
        src: 'a chainsaw', srcKind: 'chainsaw', wound: 'saw', deep: 2, maxDepth: 6, painK: 1.4, bleedK: 1.5, jointR: 5.5 * S, boneK: 1, spotR: 6, cutType: 'sawn', quiet: Math.random() < 0.4, sprayK: 0.12 });
      /* the chain throws it off along the bar, the way the chain is running: a fine wet spray, not buckets */
      if (G.blood && !g.dusty) { var a = Math.atan2(ay, ax) + (Math.random() < 0.7 ? Math.PI : 0) + rnd(-0.35, 0.35); G.blood.spray(sp.x, sp.y, Math.cos(a), Math.sin(a) - 0.25, 6, 6.5, 0.7, 0.9, g, { wall: 5 }); }
      if (g.dusty && G.blood) G.blood.dustPuff(sp.x, sp.y, 12, g);
      saw.blood = Math.min(1, saw.blood + 0.06);
      var R0 = g.dm && g.dm.regions[G.A.regionAt(part.id, l.x / S, l.y / S)];
      if (R0 && R0.bone > 1 && Math.random() < 0.5) { if (TR.sfx) TR.sfx.play('crunch', { x: sp.x, gain: 0.45, rate: rnd(0.9, 1.25), key: 'sawbone', gap: 0.08 }); if (G.gibs && Math.random() < 0.3) G.gibs.gib('bone', sp.x, sp.y, rnd(-3, 3), rnd(-4, -1), 1.2, g); }
      else if (Math.random() < 0.5) G.emit('sfx', 'cut', { x: sp.x, part: part.kind });
      if (TR.cam && Math.random() < 0.3) TR.cam.kick(0.5);
    }
    saw.bites[id] = acc;
  }
  /* the chain on concrete: sparks, a scream of metal, and it kicks */
  function grind(sp, h) {
    saw.sparkT -= h; if (saw.sparkT > 0) return; saw.sparkT = 0.05;
    TR.room.sparkAt(sp.x, sp.y, 4);
    var b = saw.body; B.setVelocity(b, { x: b.velocity.x + rnd(-1.4, 1.4), y: b.velocity.y - rnd(0.4, 1.6) });
    if (TR.sfx && Math.random() < 0.4) TR.sfx.scrape(0.8, sp.x);
  }
  /* ---------------- per frame: the engine's state, the sound, the chain going round, the smoke */
  function frame(dt) {
    var P = T.pointer, mine = T.cur && T.cur.id === 'chainsaw';
    if (saw.state === 'crank') { saw.crankT -= dt; if (saw.crankT <= 0) { saw.state = 'run'; saw.idleT = 0; } }
    if (saw.state === 'run') {
      var want = mine && saw.hold && P.down && !P.right ? 1 : 0;
      saw.thr += (want - saw.thr) * Math.min(1, dt * (want ? 7 : 4));
      if (want) saw.idleT = 0; else { saw.idleT += dt; if (saw.idleT > 7) stopEngine(); }
      saw.phase = (saw.phase + dt * (5 + 80 * saw.thr)) % 600;
      /* two-stroke smoke out of the back of the engine */
      if (saw.body && Math.random() < dt * (4 + 14 * saw.thr)) { var ex = G.toWorld(saw.eng, -11, 2 * saw.face); saw.smoke.push({ x: ex.x, y: ex.y, vx: rnd(-0.15, 0.15) - Math.cos(saw.body.angle) * 0.2, vy: rnd(-0.35, -0.1), r: rnd(1, 2), t: 0, life: rnd(40, 80) }); }
      /* the chain throws what's on it */
      saw.blood = Math.max(0, saw.blood - dt * 0.04 * saw.thr);
    }
    for (var i = saw.smoke.length - 1; i >= 0; i--) { var s = saw.smoke[i]; s.x += s.vx; s.y += s.vy; s.vx *= 0.98; s.vy *= 0.98; s.r += 0.05; if (++s.t > s.life) saw.smoke.splice(i, 1); }
    if (saw.smoke.length > 80) saw.smoke.splice(0, saw.smoke.length - 80);
    if (TR.sfx && TR.sfx.saw) TR.sfx.saw.set(saw.state === 'run' ? saw.thr : 0, saw.load, saw.body ? saw.body.position.x : P.x);
  }
  function fastest() { if (!saw.body) return 0; var v = saw.body.velocity; return Math.hypot(v.x, v.y) + Math.abs(saw.body.angularVelocity) * (BAR0 + BARL); }

  /* ---------------- drawing it, in the engine's own frame */
  function rrect(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y); ctx.quadraticCurveTo(x + w, y, x + w, y + r); ctx.lineTo(x + w, y + h - r); ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h); ctx.lineTo(x + r, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - r); ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y); ctx.closePath(); }
  function drawFront(ctx) {
    for (var i = 0; i < saw.smoke.length; i++) { var s = saw.smoke[i], k = 1 - s.t / s.life; ctx.fillStyle = 'rgba(170,170,165,' + (0.16 * k).toFixed(3) + ')'; ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill(); }
    if (!saw.body) return;
    var b = saw.body, e = saw.eng.position, run = saw.state === 'run';
    ctx.save(); ctx.translate(e.x, e.y); ctx.rotate(b.angle); if (saw.face < 0) ctx.scale(1, -1);
    /* the bar: a steel tongue with a rounded nose, the chain round its edge */
    var x0 = BAR0 - 3, x1 = BAR0 + BARL, y0 = 1.5 - BARW / 2, y1 = 1.5 + BARW / 2;
    ctx.fillStyle = '#7f8384'; rrect(ctx, x0, y0, x1 - x0, BARW, 2.4); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.14)'; ctx.fillRect(x0, y0 + 0.8, x1 - x0 - 2, 0.6);
    ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.fillRect(x0 + 2, 1.2, x1 - x0 - 6, 0.5);
    if (saw.blood > 0.02) { ctx.fillStyle = 'rgba(105,6,6,' + (0.75 * saw.blood).toFixed(3) + ')'; rrect(ctx, x0 + 6, y0, x1 - x0 - 6, BARW, 2.4); ctx.fill(); }
    /* the teeth: along the top, round the nose, back along the bottom, moving */
    var per = 2 * (x1 - x0 - 2.4) + Math.PI * 2.4, ph = (saw.phase % 2.4), tooth = saw.blood > 0.3 ? '#3a0c0a' : '#2a2b2b';
    ctx.fillStyle = tooth;
    for (var d = -ph; d < per; d += 2.4) {
      var tx, ty, ta, top = x1 - x0 - 2.4;
      if (d < top) { tx = x0 + d; ty = y0 - 0.5; ta = 0; }
      else if (d < top + Math.PI * 2.4) { var an = (d - top) / 2.4 - Math.PI / 2; tx = x1 - 2.4 + Math.cos(an) * 2.9; ty = 1.5 + Math.sin(an) * 2.9; ta = an + Math.PI / 2; }
      else { tx = x1 - 2.4 - (d - top - Math.PI * 2.4); ty = y1 + 0.5; ta = Math.PI; }
      if (tx < x0 + 0.5) continue;
      ctx.save(); ctx.translate(tx, ty); ctx.rotate(ta); ctx.fillRect(-0.6, -0.5, 1.2, 1); ctx.restore();
    }
    /* the engine: a scuffed orange housing, a dark side cover, the exhaust at the back */
    ctx.fillStyle = '#9c4a1a'; rrect(ctx, -11, -6.5, 22, 13, 2.2); ctx.fill();
    ctx.fillStyle = 'rgba(255,190,140,0.16)'; ctx.fillRect(-10, -6, 20, 1.1);
    ctx.fillStyle = '#2a2724'; rrect(ctx, -3, -4.5, 12, 9, 1.6); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.08)'; for (i = 0; i < 4; i++) ctx.fillRect(-1.5 + i * 2.6, -3.4, 1, 6.8);
    ctx.fillStyle = '#1a1918'; ctx.fillRect(-11.6, -1, 2, 4.4);
    ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.fillRect(-11, 4.6, 22, 1.9);
    /* the top handle (where the hand is), the front wrap handle, the chain brake */
    ctx.strokeStyle = '#151515'; ctx.lineWidth = 2; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-10, -5.5); ctx.quadraticCurveTo(-10, -8.6, -6, -8.6); ctx.lineTo(1, -8.6); ctx.quadraticCurveTo(3, -8.6, 3.5, -6.4); ctx.stroke();
    ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(8, 6); ctx.quadraticCurveTo(13, 5, 12.6, -1); ctx.quadraticCurveTo(12, -8, 6, -8.6); ctx.stroke();
    ctx.fillStyle = '#111'; ctx.fillRect(10.2, -10, 1.4, 6);
    /* the throttle trigger, pulled in when you hold it open */
    ctx.fillStyle = '#c23a1e'; ctx.fillRect(-4 + saw.thr * 0.8, -8.2 + saw.thr * 0.6, 2.4, 1.4);
    ctx.restore();
    /* idling, it trembles: a faint blur round the bar's nose */
    if (run) { var tip = G.toWorld(saw.eng, (x1 - 1), 1.5 * saw.face); ctx.strokeStyle = 'rgba(200,200,200,' + (0.06 + 0.14 * saw.thr).toFixed(3) + ')'; ctx.lineWidth = 0.5; ctx.beginPath(); ctx.arc(tip.x, tip.y, 3 + saw.thr * 1.5, 0, Math.PI * 2); ctx.stroke(); }
  }
  T.mods.push({ id: 'saw', preStep: preStep, postStep: postStep, frame: frame, drawFront: drawFront, fastest: fastest,
    reset: function () { letGo(); stopEngine(true); if (saw.body) { T.dropGrabOn(saw.body); try { M.World.remove(engine.world, saw.body); } catch (e) {} } saw.body = null; saw.blood = 0; saw.smoke.length = 0; saw.bites = {}; saw.contacts = 0; } });
  T.extraBodies = (function (prev) { return function () { var o = prev ? prev() : []; if (saw.body && !saw.hold) o.push(saw.body); return o; }; })(T.extraBodies);

  T.add({ id: 'chainsaw', group: 'saw', name: 'CHAINSAW', cursor: 'none',
    help: 'press to pull the cord, hold to open it up. with the chain moving, anything the bar touches gets cut; hold a limb still against it and it comes off. let go and it idles, then dies.',
    variants: [{ id: 'aim', name: 'AIMED', help: 'the bar turns to face whatever part of him is nearest.' }, { id: 'free', name: 'FREE', help: 'you turn it: the mouse wheel rotates the bar.' }],
    select: function () { holdOn(); },
    deselect: function () { letGo(); stopEngine(); },
    down: function () { holdOn(); if (saw.state === 'off') { saw.state = 'crank'; saw.crankT = 0.42; if (TR.sfx) TR.sfx.saw.start(T.pointer.x); } },
    wheel: function (dir) { if (T.v('chainsaw') !== 'free') { saw.manual = saw.body ? saw.body.angle : 0; T.setVariant(1); } saw.manual += dir * 0.26; },
    onVariant: function () { if (T.v('chainsaw') === 'free' && saw.body) saw.manual = saw.body.angle; },
    drawCursor: function (ctx, P) { ctx.strokeStyle = 'rgba(235,235,225,0.5)'; ctx.lineWidth = 0.5; ctx.beginPath(); ctx.arc(P.x, P.y, 2, 0, Math.PI * 2); ctx.stroke(); },
    /* the room's been reset with the saw in your hand: a new one, engine off */
    reset: function () { if (T.cur && T.cur.id === 'chainsaw') holdOn(); }
  });
})();
