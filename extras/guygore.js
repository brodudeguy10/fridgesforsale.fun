/* ============================================================
   THE GUY, version three.
   this file used to be all of him. he outgrew it: he lives in
   extras/gore/ now, one file per system, and this loads them in
   order so index.html never has to know.

     core      the namespace, maths, units, collision layers
     anatomy   his skeleton, joints, regions, tissues, arteries
     body      the bodies and pins in the page's physics world
     brain     muscles, balance, stepping, falling, getting up
     damage    what a hit does to him, his blood, his breathing,
               how he dies and the record of all of it
     flesh     the layers his wounds are drawn into
     blood     spatter, stains, pools, drips, smears
     gibs      the bits that come off
     audio     what everything sounds like
     tools     hand, knife, hammer, six-shooter, dynamite, sponge
     render    drawing him
     recap     the toe tag and the x-ray
     main      wiring it all to the page
============================================================ */
(function () {
  var here = (document.currentScript && document.currentScript.src) || 'extras/guygore.js';
  var base = here.replace(/guygore\.js(\?.*)?$/, 'gore/');
  var v = '?v=3.0.0';
  var files = ['core', 'anatomy', 'body', 'brain', 'damage', 'flesh', 'blood', 'gibs', 'audio', 'tools', 'render', 'recap', 'main'];
  var boot = 'window.__G3 && window.__G3.boot && window.__G3.boot();';
  if (document.readyState === 'loading') {
    /* the page is still being read: these run in order, right here, before anything after this script */
    for (var i = 0; i < files.length; i++) document.write('<script src="' + base + files[i] + '.js' + v + '"><\/script>');
    document.write('<script>' + boot + '<\/script>');
  } else {
    var n = 0;
    (function next() {
      if (n >= files.length) { try { (0, eval)(boot); } catch (e) {} return; }
      var s = document.createElement('script'); s.src = base + files[n++] + '.js' + v; s.async = false; s.onload = s.onerror = next; document.body.appendChild(s);
    })();
  }
})();
