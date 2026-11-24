/* ============================================================
   TORTURE ROOM: between the gore core and everything else.
   the room's own size and scale, before the rest of the guy's code
   reads them. he's built at the size he has on a desktop fridge
   page whatever this window is, so his physics are the ones that
   were tuned; the camera zooms in on him instead.
============================================================ */
(function () {
  'use strict';
  var G = window.__G3; if (!G) return;
  var R = window.TR_ROOM;
  G.W = function () { return R.W; };
  G.H = function () { return R.H; };
  G.S = 1.9;
  G.mpp = 1.75 / (G.HEIGHT_U * G.S);
  G.RES = window.TR_RES;
  /* one man in the room. he stays until you reset it, and so does everything that comes off him */
  Object.assign(G.TUNE, { maxGuys: 1, respawnAfter: 1e9, maxParticles: 2600, maxGibs: 140, maxLoose: 30, looseLife: 1e9, gibLife: 900, gutLife: 1e9, morgue: 4,
    /* close up, drops in the air are drawn finer, and the back wall stops where the floor starts: what comes down
       below that line lands on the floor, not on the wall */
    dropK: 0.55, wallBase: R.H - R.seam });
  G.torture = true;
  /* the site's own recordings (the revolver, the glass) live at the top of the site, one folder up from here */
  G.siteRoot = '../';
})();
