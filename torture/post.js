/* ============================================================
   TORTURE ROOM: after the gore files have loaded.
   the few things that are the fridge page's and not this room's:
   where he stands, the toe tag (the room has its own panel and
   x-ray button), his voice on its own volume, and the blood kept
   to sixty steps a second when the physics takes smaller ones.
============================================================ */
(function () {
  'use strict';
  var G = window.__G3; if (!G) return;
  var R = window.TR_ROOM;
  G.homeX = function () { return R.W * 0.5; };
  G.floorY = function () { return R.H; };
  if (G.recap) G.recap.tag = function () {};
  /* the blood code's floor strip is a page element on the fridge page; here the room draws its own puddles */
  var gp = document.getElementById('gorePool'); if (gp) gp.style.display = 'none';
  if (G.audio && G.audio.play) {
    var play = G.audio.play;
    G.audio.play = function (name, o) {
      o = o || {};
      if (name && name.indexOf('v_') === 0) { var k = TR.vol ? TR.vol.voice : 1; o = Object.assign({}, o, { gain: (o.gain == null ? 0.8 : o.gain) * k }); }
      return play(name, o);
    };
  }
  if (G.blood) {
    var bs = G.blood.step, acc = 0;
    G.blood.step = function (h) { acc += h; if (acc < 1 / 60 - 1e-6) return; acc -= 1 / 60; if (acc > 0.05) acc = 0; bs(1 / 60); };
  }
})();
