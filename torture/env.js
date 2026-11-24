/* ============================================================
   TORTURE ROOM: the page the guy's code expects to find.
   his files were written for the fridge page and reach for its
   globals by name: the engine, its walls, the render, the mouse,
   the fridges, the audio context, the flags that say a game is
   open. this sets up the same names for one concrete room, so the
   same body, brain, damage, flesh and blood run in here unchanged
   (from their own copy in torture/gore/), and the fridge page's
   copy never has to know this room exists.
============================================================ */
(function () {
  'use strict';
  var M = window.Matter;
  /* the room, in the guy's own pixels: the floor he stands on is y = H, the back wall ends at H - seam, and the
     frame shows a little of the side walls, the ceiling and the floor in front of him */
  var R = window.TR_ROOM = { W: 560, H: 300, side: 18, top: 22, front: 26, seam: 18 };
  var VW = R.W + R.side * 2, VH = R.H + R.top + R.front;
  /* how finely to draw his layers: as fine as the screen will show him, no finer (1.5 to 3.5 of his pixels each) */
  (function () {
    var dpr = Math.min(2, window.devicePixelRatio || 1), z = Math.min(window.innerWidth / VW, Math.max(120, window.innerHeight - 112) / VH);
    window.TR_RES = Math.max(1.5, Math.min(3.5, Math.ceil(z * dpr * 2) / 2));
  })();

  /* ---------------- the world */
  window.engine = M.Engine.create(); engine.gravity.y = 1; engine.constraintIterations = 4;   /* joints and the hand settle in fewer steps: a light part dragged by the cursor drags the rest of him with it */
  var T = 200, wall = { isStatic: true, label: 'wall', friction: 0.9, restitution: 0.05 };
  window.ground = M.Bodies.rectangle(R.W / 2, R.H + T / 2, R.W + T * 4, T, Object.assign({}, wall, { friction: 0.95 }));
  window.leftWall = M.Bodies.rectangle(-T / 2, R.H / 2, T, R.H + T * 4, wall);
  window.rightWall = M.Bodies.rectangle(R.W + T / 2, R.H / 2, T, R.H + T * 4, wall);
  window.ceiling = M.Bodies.rectangle(R.W / 2, -T / 2, R.W + T * 4, T, wall);
  M.World.add(engine.world, [ground, leftWall, rightWall, ceiling]);

  /* ---------------- the rest of what the guy's code reaches for */
  var view = document.getElementById('tr-view');
  window.render = { canvas: view, context: view.getContext('2d'), options: { width: R.W, height: R.H, background: 'transparent', wireframes: false }, bounds: { min: { x: 0, y: 0 }, max: { x: R.W, y: R.H } } };
  window.mouseConstraint = { constraint: { bodyB: null, pointB: null, stiffness: 0.2 }, mouse: { position: { x: R.W / 2, y: R.H / 2 }, button: -1 }, collisionFilter: { category: 0x0001, mask: 0xFFFFFFFF, group: 0 } };
  window.spawnedFridges = [];
  window.gameActive = false; window.isDead = false; window.bsodActive = false; window.drawToggle = false;
  window.ragdollParts = []; window.guyActivated = false;

  /* the wall behind him, and the floor, keep what lands on them: one canvas the size of the whole view, in his pixels
     times RES, with his (0, 0) where the back wall's top left corner is */
  var dried = document.getElementById('driedBloodCanvas'), RES = window.TR_RES;
  dried.width = Math.ceil(VW * RES); dried.height = Math.ceil(VH * RES);
  var dctx = dried.getContext('2d');
  dctx.setTransform(RES, 0, 0, RES, R.side * RES, R.top * RES);   /* everything that stains it saves and restores around its own drawing, so this stays */

  /* ---------------- sound: a context made on the first click, its output split three ways (master, effects, the
     room's hum) through a soft limiter. the guy's code plays into "destination", which here means the effects bus */
  window.ensureAudioContext = function () {
    if (window.audioCtx) { try { if (window.TR_AUDIO.ctx.state === 'suspended' && !(window.TR && TR.paused)) window.TR_AUDIO.ctx.resume(); } catch (e) {} return; }
    var AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
    var ctx; try { ctx = new AC({ latencyHint: 'interactive' }); } catch (e) { return; }
    var master = ctx.createGain(), fx = ctx.createGain(), amb = ctx.createGain();
    var comp = ctx.createDynamicsCompressor(); comp.threshold.value = -10; comp.knee.value = 8; comp.ratio.value = 3; comp.attack.value = 0.004; comp.release.value = 0.2;
    fx.connect(master); amb.connect(master); master.connect(comp); comp.connect(ctx.destination);
    window.TR_AUDIO = { ctx: ctx, master: master, fx: fx, amb: amb, comp: comp };
    window.audioCtx = new Proxy(ctx, {
      get: function (t, k) { if (k === 'destination') return fx; var v = t[k]; return typeof v === 'function' ? v.bind(t) : v; },
      set: function (t, k, v) { t[k] = v; return true; }
    });
    try { if (window.TR && TR.sfx && TR.sfx.ready) TR.sfx.ready(); } catch (e) {}
  };

  /* ---------------- this room's dead aren't the fridge page's: its body count lives under its own key */
  try {
    var gi = Storage.prototype.getItem, si = Storage.prototype.setItem;
    var map = function (k) { return k === 'ffs_bodycount' ? 'ffs_torture_bodycount' : k; };
    Storage.prototype.getItem = function (k) { return gi.call(this, map(k)); };
    Storage.prototype.setItem = function (k, v) { return si.call(this, map(k), v); };
  } catch (e) {}
  window.TR = window.TR || {};
})();
