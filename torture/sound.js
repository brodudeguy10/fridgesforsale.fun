/* ============================================================
   TORTURE ROOM: what the room and the tools sound like.
   everything here is made in the browser from noise and
   oscillators (the guy's own body, blood and voice come from his
   sound file, through the same buses): the tube's hum and its
   buzz, the room's air, three guns (a crack, a body, a thump and a
   tail, through a little clipping, then the concrete's short
   reverb), brass on the floor, the pump, reloads, ricochets, the
   nail gun, the stapler, rope and chain, a chainsaw built like a
   two-stroke (idle, wide open, bogged down in meat, dying), and a
   knock at the door. three volumes (master, effects, the room) and
   his voice on a fourth, remembered.
============================================================ */
(function () {
  'use strict';
  var G = window.__G3, R = window.TR_ROOM;
  var clamp = function (x, a, b) { return x < a ? a : x > b ? b : x; };
  var rnd = function (a, b) { return a + Math.random() * (b - a); };
  var X = TR.sfx = {};
  TR.vol = { master: 0.8, fx: 0.9, amb: 0.7, voice: 0.85 };
  try { var sv = JSON.parse(localStorage.getItem('ffs_torture_settings') || '{}'); if (sv.vol) for (var k in TR.vol) if (typeof sv.vol[k] === 'number') TR.vol[k] = clamp(sv.vol[k], 0, 1); } catch (e) {}
  var A = null, ready = false, nbuf = null, send = null, hum = null;
  function au() { return window.TR_AUDIO || null; }
  function pan(x) { return clamp(((x == null ? R.W / 2 : x) / R.W - 0.5) * 1.5, -0.9, 0.9); }
  /* the room's own reverb: a short, hard concrete box, a few early reflections in it */
  function roomIR(ctx) {
    var len = Math.floor(ctx.sampleRate * 1.1), ir = ctx.createBuffer(2, len, ctx.sampleRate);
    for (var c = 0; c < 2; c++) { var d = ir.getChannelData(c); for (var i = 0; i < len; i++) { var t = i / ctx.sampleRate; d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.2) * Math.exp(-t * 3.2) * (t < 0.012 ? 0.3 : 1); } for (var k = 0; k < 6; k++) { var at = Math.floor(rnd(0.008, 0.05) * ctx.sampleRate); d[at] += rnd(-0.6, 0.6); } }
    return ir;
  }
  X.ready = function () {
    var a = au(); if (!a || ready) return; ready = true; A = a.ctx;
    nbuf = A.createBuffer(1, A.sampleRate * 2, A.sampleRate); var d = nbuf.getChannelData(0); for (var i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    var conv = A.createConvolver(); conv.buffer = roomIR(A);
    send = A.createGain(); send.gain.value = 0.32; var wet = A.createGain(); wet.gain.value = 0.55;
    send.connect(conv); conv.connect(wet); wet.connect(a.master);
    a.fx.connect(send);
    X.vol(); ambience();
  };
  X.vol = function () {
    var a = au(); if (!a) return; var v = TR.vol, t = a.ctx.currentTime;
    /* on the pause screen the clock is stopped, so a glide would never get there: set them outright */
    [[a.master, v.master], [a.fx, v.fx], [a.amb, v.amb]].forEach(function (q) {
      var p = q[0].gain; p.cancelScheduledValues(t);
      if (a.ctx.state === 'running') { p.setValueAtTime(p.value, t); p.setTargetAtTime(q[1], t, 0.03); } else p.value = q[1];
    });
  };
  X.save = function () { try { var sv = JSON.parse(localStorage.getItem('ffs_torture_settings') || '{}'); sv.vol = TR.vol; localStorage.setItem('ffs_torture_settings', JSON.stringify(sv)); } catch (e) {} };
  X.play = function (name, o) { try { if (G.audio && G.audio.play) return G.audio.play(name, o || {}); } catch (e) {} return null; };

  /* ---------------- building blocks */
  function out(x, dry) { var p = A.createStereoPanner ? A.createStereoPanner() : null, g = A.createGain(); g.gain.value = 1; if (p) { p.pan.value = pan(x); g.connect(p); p.connect(au().fx); } else g.connect(au().fx); return g; }
  function noise(t, dur, type, f0, f1, q, g0, dest, attack) {
    var s = A.createBufferSource(); s.buffer = nbuf; s.loop = true; s.loopStart = Math.random();
    var f = A.createBiquadFilter(); f.type = type; f.frequency.setValueAtTime(f0, t); if (f1 && f1 !== f0) f.frequency.exponentialRampToValueAtTime(Math.max(30, f1), t + dur); f.Q.value = q || 0.7;
    var g = A.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(Math.max(0.0002, g0), t + (attack || 0.0008)); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(f); f.connect(g); g.connect(dest); s.start(t, Math.random()); s.stop(t + dur + 0.05);
  }
  function tone(t, dur, type, f0, f1, g0, dest, attack) {
    var o = A.createOscillator(); o.type = type; o.frequency.setValueAtTime(f0, t); if (f1 && f1 !== f0) o.frequency.exponentialRampToValueAtTime(Math.max(10, f1), t + dur);
    var g = A.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(Math.max(0.0002, g0), t + (attack || 0.002)); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(dest); o.start(t); o.stop(t + dur + 0.05);
  }
  /* an odd number of points, so silence in is exactly silence out: an even curve misses zero by half a step, and every
     shaper left behind by a shot then adds a little DC to the mix for as long as it exists */
  var curves = {};
  function shaper(k) { var ws = A.createWaveShaper(), n = 1025, c = curves[k]; if (!c) { c = curves[k] = new Float32Array(n); for (var i = 0; i < n; i++) { var x = i / (n - 1) * 2 - 1; c[i] = Math.tanh(x * k) / Math.tanh(k); } } ws.curve = c; return ws; }
  function ok() { return ready && A && A.state !== 'closed'; }
  /* a node chain that only lives for one sound comes apart once the sound is over */
  function later(ms, nodes) { setTimeout(function () { for (var i = 0; i < nodes.length; i++) { try { nodes[i].disconnect(); } catch (e) {} } }, ms); }

  /* ---------------- guns: a crack, a body, a thump, a tail, all through a little clipping, then the room */
  X.gun = function (kind, x) {
    if (!ok()) return; var t = A.currentTime + 0.002, o = out(x), sh = shaper(kind === 'shotgun' || kind === 'slug' ? 2.6 : 2); sh.connect(o);
    if (kind === 'suppressed') { noise(t, 0.05, 'bandpass', 2400, 1400, 1.2, 0.5, o); tone(t, 0.03, 'square', 900, 300, 0.08, o); noise(t + 0.03, 0.04, 'highpass', 5000, 5000, 0.7, 0.12, o); later(800, [sh, o]); return; }
    var big = kind === 'shotgun' || kind === 'slug' || kind === 'bird', rifle = kind === 'rifle';
    noise(t, rifle ? 0.02 : 0.03, 'highpass', rifle ? 3200 : 2400, rifle ? 3200 : 2400, 0.7, 1.0, sh);
    noise(t, big ? 0.2 : rifle ? 0.07 : 0.1, 'bandpass', big ? 620 : rifle ? 1300 : 950, big ? 300 : 600, 0.8, big ? 1.0 : 0.8, sh);
    tone(t, big ? 0.24 : rifle ? 0.07 : 0.12, 'sine', big ? 95 : rifle ? 165 : 140, big ? 38 : 60, big ? 1.1 : 0.85, sh, 0.001);
    noise(t + 0.01, big ? 0.9 : rifle ? 0.35 : 0.5, 'lowpass', big ? 900 : 1300, 300, 0.7, big ? 0.32 : 0.22, o);
    if (kind === 'shotgun' || kind === 'bird' || kind === 'slug') setTimeout(function () { X.pump(x); }, 380);
    /* the shot's own little chain comes apart once it's over, so a long session doesn't pile up nodes */
    later(1600, [sh, o]);
  };
  X.pump = function (x) { if (!ok()) return; var t = A.currentTime, o = out(x); noise(t, 0.05, 'bandpass', 2200, 1600, 2, 0.35, o); noise(t + 0.06, 0.14, 'bandpass', 1400, 2600, 1, 0.12, o, 0.03); noise(t + 0.2, 0.04, 'bandpass', 2600, 1900, 2, 0.4, o); X.play('ratchet', { x: x, gain: 0.25, rate: 1.2 }); later(900, [o]); };
  X.dry = function (x) { X.play('click', { x: x, gain: 0.45, rate: 1.5 }); };
  X.reload = function (kind, x) {
    if (!ok()) return;
    /* the shotgun loads a shell at a time (guns.js clicks each one in and pumps at the end): this is the gate opening */
    if (kind === 'shotgun') { X.play('latch', { x: x, gain: 0.25, rate: 1.5 }); return; }
    /* the magazine out, a fresh one in, the slide or the bolt */
    var t = A.currentTime, o = out(x), L = kind === 'rifle' ? 1.7 : 1.15;
    noise(t + 0.05, 0.05, 'bandpass', 1800, 1200, 1.6, 0.28, o); tone(t + 0.05, 0.04, 'triangle', 420, 300, 0.08, o);
    X.play('latch', { x: x, gain: 0.3, rate: 1.3 });
    setTimeout(function () { X.play('click', { x: x, gain: 0.4, rate: 0.9 }); }, L * 450);
    setTimeout(function () { if (!ok()) return; var t2 = A.currentTime, o2 = out(x); noise(t2, 0.06, 'bandpass', 2600, 1500, 1.4, 0.4, o2); noise(t2 + 0.07, 0.05, 'bandpass', 1900, 2600, 1.4, 0.35, o2); later(600, [o2]); }, L * 850);
    later(2400, [o]);
  };
  /* brass on concrete: a bright ring that skips, and dies; shotgun hulls are plastic and duller */
  X.casing = function (x, k) {
    if (!ok()) return; var t = A.currentTime, o = out(x), f = rnd(2800, 4200) * (k < 0.6 ? 0.85 : 1);
    tone(t, 0.09 + 0.08 * k, 'sine', f, f * 0.98, 0.05 * k + 0.01, o, 0.001); tone(t, 0.06, 'sine', f * 1.51, f * 1.5, 0.025 * k, o, 0.001); noise(t, 0.012, 'highpass', 5000, 5000, 0.7, 0.06 * k, o);
    later(500, [o]);
  };
  /* a round off steel or stone, going away */
  X.ricochet = function (x, metal) {
    if (!ok()) return; var t = A.currentTime, o = out(x);
    noise(t, 0.02, 'highpass', 3500, 3500, 0.7, 0.4, o);
    if (metal) tone(t, 0.08, 'triangle', rnd(1800, 2600), rnd(1200, 1700), 0.12, o, 0.001);
    tone(t + 0.01, 0.35, 'sine', rnd(2400, 3200), rnd(700, 1000), 0.07, o, 0.004);
    later(800, [o]);
  };
  /* the nail gun: a pneumatic punch, the nail going home, a breath of air after */
  X.nailgun = function (x) {
    if (!ok()) return; var t = A.currentTime, o = out(x);
    noise(t, 0.035, 'bandpass', 1900, 900, 1.2, 0.6, o); tone(t, 0.06, 'sine', 210, 90, 0.4, o, 0.001); noise(t + 0.03, 0.18, 'highpass', 4000, 6000, 0.7, 0.08, o, 0.01);
    later(700, [o]);
  };
  /* the stapler: two hard clicks, a spring */
  X.staple = function (x) {
    if (!ok()) return; var t = A.currentTime, o = out(x);
    noise(t, 0.012, 'bandpass', 3200, 3200, 2, 0.45, o); noise(t + 0.035, 0.016, 'bandpass', 2300, 2300, 2, 0.32, o); tone(t + 0.035, 0.05, 'triangle', 1300, 900, 0.05, o);
    later(500, [o]);
  };
  X.spike = function (x) { if (!ok()) return; var t = A.currentTime, o = out(x); tone(t, 0.12, 'triangle', 620, 520, 0.08, o); noise(t, 0.03, 'bandpass', 1400, 900, 1, 0.25, o); X.play('step_metal', { x: x, gain: 0.3, rate: 0.85 }); later(600, [o]); };
  /* a blade or a hand through the air: a band of noise sweeping up and gone */
  X.swish = function (k, x) { if (!ok()) return; var t = A.currentTime, o = out(x); noise(t, 0.09 + 0.08 * k, 'bandpass', 500 + 400 * k, 1800 + 1600 * k, 1.6, 0.06 + 0.22 * k, o, 0.03); later(600, [o]); };
  /* a razor across skin: a dry rasp, quick little bursts */
  X.scrape = function (k, x) { if (!ok()) return; var t = A.currentTime, o = out(x); for (var i = 0; i < 4; i++) noise(t + i * 0.018, 0.016, 'bandpass', rnd(2600, 4200), rnd(2400, 3800), 3, 0.05 + 0.08 * k, o); later(500, [o]); };
  X.toolSwap = function (group) { var n = { guns: 'holster', blades: 'knife_draw', restraint: 'leather', staple: 'click', spikes: 'step_metal', saw: 'leather', hand: 'cloth' }[group]; if (n) X.play(n, { gain: 0.22 }); };
  /* tied on: leather and fibre for a rope, links settling for a chain */
  X.rope = function (x, chain) {
    if (chain) { for (var i = 0; i < 3; i++) setTimeout(function () { X.play('step_metal', { x: x, gain: 0.2, rate: rnd(1.3, 1.8) }); }, i * 70); return; }
    X.play('leather', { x: x, gain: 0.35 }); if (!ok()) return; var t = A.currentTime, o = out(x); noise(t, 0.16, 'bandpass', 900, 600, 2, 0.08, o, 0.02); later(600, [o]);
  };
  /* the tube: a tick in the ballast, a buzz when it stutters */
  X.tick = function () { if (!ok()) return; var t = A.currentTime, o = out(R.W / 2); noise(t, 0.012, 'highpass', 3000, 3000, 0.7, 0.12, o); tone(t, 0.05, 'sawtooth', 120, 120, 0.05, o); later(400, [o]); };
  X.zap = function (k) { if (!ok()) return; var t = A.currentTime, o = out(R.W / 2); for (var i = 0; i < 6; i++) noise(t + rnd(0, 0.3), rnd(0.01, 0.04), 'highpass', 2500, 2500, 0.7, 0.3 * k, o); tone(t, 0.35, 'sawtooth', 60, 60, 0.12 * k, o); later(900, [o]); };
  X.creak = function (x, k, chain) { if (!ok()) return; if (chain) { X.play('step_metal', { x: x, gain: clamp(k, 0.05, 0.4), rate: rnd(1.1, 1.6), key: 'chain', gap: 0.08 }); return; } var t = A.currentTime, o = out(x); for (var i = 0; i < 5; i++) noise(t + i * 0.022, 0.03, 'bandpass', rnd(500, 900), rnd(400, 700), 6, 0.06 * k, o); later(500, [o]); };
  /* a rope that gives: a crack, and the fibres */
  X.snapRope = function (x) { if (!ok()) return; var t = A.currentTime, o = out(x); noise(t, 0.03, 'highpass', 1800, 1800, 0.7, 0.6, o); tone(t, 0.05, 'triangle', 300, 120, 0.2, o, 0.001); noise(t + 0.02, 0.12, 'bandpass', 1200, 700, 2, 0.1, o); X.play('snap', { x: x, gain: 0.35, rate: 1.2 }); later(700, [o]); };
  /* somebody on the other side of the steel door: three slow knocks, the door ringing a little after each */
  X.knock = function (x) {
    if (!ok()) return; var t = A.currentTime + 0.05, o = out(x);
    for (var i = 0; i < 3; i++) { var ti = t + i * 0.34 + (i === 2 ? 0.08 : 0); noise(ti, 0.09, 'lowpass', 420, 160, 0.8, 0.5, o, 0.002); tone(ti, 0.28, 'sine', 118, 92, 0.28, o, 0.002); tone(ti, 0.4, 'sine', 342, 338, 0.03, o, 0.004); }
    later(2500, [o]);
  };

  /* ---------------- the room: the tube's hum (it follows the light), the ballast's whine, the air */
  function ambience() {
    var a = au(); if (!a || hum) return; var t = A.currentTime;
    var g = A.createGain(); g.gain.value = 0; var p = A.createStereoPanner ? A.createStereoPanner() : null;
    if (p) { g.connect(p); p.connect(a.amb); } else g.connect(a.amb);
    var mk = function (f, type, lv) { var o = A.createOscillator(); o.type = type; o.frequency.value = f; var og = A.createGain(); og.gain.value = lv; o.connect(og); og.connect(g); o.start(); return o; };
    mk(120, 'sine', 0.05); mk(240, 'sine', 0.02); mk(360, 'triangle', 0.008); mk(119.6, 'sine', 0.02);
    var s = A.createBufferSource(); s.buffer = nbuf; s.loop = true; var bp = A.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 6200; bp.Q.value = 3; var ng = A.createGain(); ng.gain.value = 0.02; s.connect(bp); bp.connect(ng); ng.connect(g); s.start();
    /* the room: brown noise, very low */
    var rs = A.createBufferSource(), len = A.sampleRate * 3, rb = A.createBuffer(1, len, A.sampleRate), rd = rb.getChannelData(0), last = 0; for (var i = 0; i < len; i++) { last = (last + (Math.random() * 2 - 1) * 0.02) * 0.997; rd[i] = last * 3; } rs.buffer = rb; rs.loop = true;
    var lp = A.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 260; var hp = A.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 30;
    var rg = A.createGain(); rg.gain.value = 0.028; rs.connect(lp); lp.connect(hp); hp.connect(rg); rg.connect(a.amb); rs.start();
    hum = { g: g, p: p };
    g.gain.setTargetAtTime(HUM, t, 0.8);
  }
  /* faint: under everything, there when the room is quiet (about -46 dB with the sliders where they start) */
  var HUM = 0.16;
  X.frame = function () {
    if (!hum || !TR.room) return; var lp = TR.room.lamp, t = A.currentTime;
    var lv = lp.state === 'ok' ? lp.lvl : 0; hum.g.gain.setTargetAtTime(HUM * lv, t, 0.03);
    if (hum.p) hum.p.pan.setTargetAtTime(pan(TR.room.lampPos().x) * 0.6, t, 0.1);
  };

  /* ---------------- the chainsaw: a two-stroke at idle, wide open, and bogged down in meat */
  var saw = null;
  X.saw = {
    start: function (x) {
      if (!ok()) return;
      if (!saw) build(x);
      var t = A.currentTime; saw.state = 'crank'; saw.t0 = t;
      noise(t, 0.28, 'bandpass', 900, 2600, 1.2, 0.25, saw.out, 0.05);          /* the cord */
    },
    set: function (throttle, load, x) { if (!saw) return; saw.thr = throttle; saw.load = load; if (x != null && saw.p) saw.p.pan.setTargetAtTime(pan(x), A.currentTime, 0.05); },
    stop: function () { if (!saw || saw.state === 'off') return; saw.state = 'dying'; saw.t0 = A.currentTime; },
    state: function () { return saw ? saw.state : 'off'; }
  };
  function build(x) {
    var o1 = A.createOscillator(), o2 = A.createOscillator(), o3 = A.createOscillator(); o1.type = 'sawtooth'; o2.type = 'square'; o3.type = 'sawtooth';
    var mix = A.createGain(), g2 = A.createGain(), g3 = A.createGain(); g2.gain.value = 0.45; g3.gain.value = 0.18;
    o1.connect(mix); o2.connect(g2); g2.connect(mix); o3.connect(g3); g3.connect(mix);
    var putt = A.createGain(); putt.gain.value = 0.7; var lfo = A.createOscillator(); lfo.type = 'square'; var lg = A.createGain(); lg.gain.value = 0.3; lfo.connect(lg); lg.connect(putt.gain);
    var ws = shaper(3.2), lp = A.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 1400; lp.Q.value = 1.4;
    var vol = A.createGain(); vol.gain.value = 0;
    mix.connect(putt); putt.connect(ws); ws.connect(lp); lp.connect(vol);
    var p = A.createStereoPanner ? A.createStereoPanner() : null, outg = A.createGain(); outg.gain.value = 0.32;
    if (p) { vol.connect(p); p.connect(outg); } else vol.connect(outg); outg.connect(au().fx);
    var ex = A.createBufferSource(); ex.buffer = nbuf; ex.loop = true; var exf = A.createBiquadFilter(); exf.type = 'bandpass'; exf.Q.value = 1; var exg = A.createGain(); exg.gain.value = 0; ex.connect(exf); exf.connect(exg); exg.connect(vol);
    var ch = A.createBufferSource(); ch.buffer = nbuf; ch.loop = true; var chf = A.createBiquadFilter(); chf.type = 'bandpass'; chf.frequency.value = 3400; chf.Q.value = 2.5; var chg = A.createGain(); chg.gain.value = 0; ch.connect(chf); chf.connect(chg); chg.connect(outg);
    var gr = A.createBufferSource(); gr.buffer = nbuf; gr.loop = true; var grf = A.createBiquadFilter(); grf.type = 'bandpass'; grf.frequency.value = 1700; grf.Q.value = 0.9; var grg = A.createGain(); grg.gain.value = 0; gr.connect(grf); grf.connect(grg); grg.connect(outg);
    [o1, o2, o3, lfo, ex, ch, gr].forEach(function (n) { n.start(); });
    saw = { o1: o1, o2: o2, o3: o3, lfo: lfo, lp: lp, vol: vol, exf: exf, exg: exg, chg: chg, grg: grg, p: p, out: outg, thr: 0, load: 0, f: 20, state: 'off', t0: 0 };
  }
  var sawUpdate = function () {
    var s = saw, t = A.currentTime, f, v;
    if (s.state === 'off') { s.vol.gain.setTargetAtTime(0, t, 0.05); s.chg.gain.setTargetAtTime(0, t, 0.05); s.grg.gain.setTargetAtTime(0, t, 0.05); return; }
    if (s.state === 'crank') { var k = (t - s.t0) / 0.42; f = 18 + 26 * k + Math.random() * 8; v = 0.25 + 0.4 * Math.random(); if (k >= 1) s.state = 'run'; }
    else if (s.state === 'dying') { var d = (t - s.t0) / 0.7; f = Math.max(8, s.f * (1 - d * 0.9)); v = Math.max(0, 0.8 * (1 - d)) * (0.5 + 0.5 * Math.random()); if (d >= 1) { s.state = 'off'; v = 0; } }
    else { var target = 44 + 78 * s.thr; target *= 1 - 0.2 * s.load; f = s.f + (target - s.f) * 0.18; v = 0.55 + 0.4 * s.thr; }
    s.f = f;
    s.o1.frequency.setTargetAtTime(f, t, 0.02); s.o2.frequency.setTargetAtTime(f * 0.5, t, 0.02); s.o3.frequency.setTargetAtTime(f * 2.013, t, 0.02); s.lfo.frequency.setTargetAtTime(f * 0.5, t, 0.02);
    s.lp.frequency.setTargetAtTime(700 + f * 22, t, 0.03); s.exf.frequency.setTargetAtTime(f * 4, t, 0.03); s.exg.gain.setTargetAtTime(0.2 + 0.4 * s.thr, t, 0.03);
    s.vol.gain.setTargetAtTime(v, t, 0.02);
    var running = s.state === 'run';
    s.chg.gain.setTargetAtTime(running ? 0.12 * s.thr : 0, t, 0.03); s.grg.gain.setTargetAtTime(running ? 0.55 * s.load * (0.4 + 0.6 * s.thr) : 0, t, 0.02);
  };
  var fr = X.frame; X.frame = function () { fr(); if (saw && ok()) sawUpdate(); };
})();
