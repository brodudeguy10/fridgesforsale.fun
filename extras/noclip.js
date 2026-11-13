/* ============================================================
   noclip.

   every time this page loads, one roll: 1 in 5.

   four times out of five this file does nothing at all. no
   listeners, no downloads, nothing changed on the page.

   the fifth time the page is "armed". you can't tell. in the
   background, after the page has finished loading, it fetches the
   other place and builds it off-screen. once that's ready, the next
   time you press a button (any button, any control on this page)
   the button doesn't do what it does. you're somewhere else.

   there is a way back. it's a door. when you come back the page is
   exactly as you left it, and it won't happen again until you
   reload (and roll again).

   switches, for looking at it on purpose:
     ?backrooms=1     arm this load
     ?backrooms=0     never arm this load
     &seed=12345      which floor (any whole number)
   the last floor's seed is kept in sessionStorage as level0.seed.
============================================================ */
(function () {
  'use strict';
  var here = (document.currentScript && document.currentScript.src) || location.href;
  var MOD = new URL('../level0/level0.js', here).href;
  var q; try { q = new URLSearchParams(location.search); } catch (e) { q = { get: function () { return null; } }; }

  /* ---- the roll. once. a fair d5 ---- */
  function d5() { try { var b = new Uint32Array(1); do { crypto.getRandomValues(b); } while (b[0] >= 4294967295); return b[0] % 5; } catch (e) { return Math.floor(Math.random() * 5); } }
  var forced = q.get('backrooms'), roll = d5();
  var S = { roll: roll, armed: forced === '1' ? true : forced === '0' ? false : roll === 0, ready: false, used: false, inside: false, seed: null, error: null, info: null };
  try { Object.defineProperty(window, '__noclip', { value: S, enumerable: false }); } catch (e) {}
  if (!S.armed) return;

  /* ---- armed. from here on nothing may show ---- */
  var handle = null, ctxs = [], heldCtx = [], heldMedia = [], prevActive = false, prevFocus = null;

  /* remember every audio context the page makes, so they can all be put to sleep while you're away */
  ['AudioContext', 'webkitAudioContext'].forEach(function (name) {
    var Orig = window[name]; if (typeof Orig !== 'function' || typeof Proxy !== 'function') return;
    try { window[name] = new Proxy(Orig, { construct: function (T, args) { var c = Reflect.construct(T, args); if (!S.inside) ctxs.push(c); return c; } }); } catch (e) {}
  });

  /* ---- build the other place, quietly, once the page has settled ---- */
  function build() {
    var seed = q.get('seed'), opts = {}; if (seed !== null && seed !== '' && isFinite(+seed)) opts.seed = (+seed) | 0;
    import(MOD).then(function (m) { return m.prepare(opts); }).then(function (L) { handle = L; S.seed = L.seed; S.ready = true; if (forced === '1') S.handle = L; try { sessionStorage.setItem('level0.seed', String(L.seed)); } catch (e) {} })
      .catch(function (e) { S.error = String(e && e.message || e); });      /* a machine that can't run it just never goes */
  }
  function later() { var go = function () { setTimeout(build, 900); }; if (document.readyState === 'complete') go(); else window.addEventListener('load', go, { once: true }); }
  later();

  /* ---- what counts as a button ---- */
  var ROLES = { button: 1, link: 1, tab: 1, menuitem: 1, menuitemcheckbox: 1, menuitemradio: 1, 'switch': 1, checkbox: 1, radio: 1, option: 1, slider: 1, spinbutton: 0 };
  var TYPES = { button: 1, submit: 1, reset: 1, image: 1, checkbox: 1, radio: 1, range: 1, color: 1, file: 1 };
  var PRESS = { SELECT: 1, range: 1, color: 1, file: 1 };          /* these act the moment they're pressed, not when they're let go */
  function isControl(n) {
    var tag = n.tagName; if (!tag) return false;
    if (tag === 'BUTTON' || tag === 'SELECT' || tag === 'SUMMARY' || tag === 'OPTION') return true;
    if (tag === 'LABEL') return !!n.control;                         /* a label that works a checkbox is that checkbox */
    if (tag === 'INPUT') return !!TYPES[(n.getAttribute('type') || 'text').toLowerCase()];
    if ((tag === 'A' || tag === 'AREA') && n.hasAttribute('href')) return true;
    var r = n.getAttribute('role'); if (r && ROLES[r.toLowerCase()]) return true;
    if (n.hasAttribute('onclick') || typeof n.onclick === 'function') return true;
    if (tag === 'CANVAS' || tag === 'IFRAME' || tag === 'VIDEO' || tag === 'AUDIO' || tag === 'TEXTAREA') return false;
    try { return getComputedStyle(n).cursor === 'pointer'; } catch (e) { return false; }
  }
  function control(t) {
    if (t && t.nodeType === 3) t = t.parentElement;
    for (var n = t; n && n.nodeType === 1 && n !== document.body && n !== document.documentElement; n = n.parentElement) {
      if (n.tagName === 'CANVAS' || n.tagName === 'IFRAME') return null;
      if (isControl(n)) return n;
    }
    return null;
  }
  function pressy(c) { return !!(PRESS[c.tagName] || (c.tagName === 'INPUT' && PRESS[(c.getAttribute('type') || '').toLowerCase()])); }
  function live() { return S.armed && S.ready && !S.used && !S.inside && handle && handle.ready; }

  /* ---- the press ---- */
  var CAP = { capture: true, passive: false };
  /* a slider, a dropdown or a tick box can move before the press is over. remember how it was, so it can be put back */
  var snap = null;
  function remember(c) { if (c.tagName === 'LABEL' && c.control) c = c.control; if (!snap || snap.el !== c) snap = { el: c, value: c.value, checked: c.checked, idx: c.selectedIndex }; }
  function putBack() { if (!snap) return; var c = snap.el; try { if (snap.idx !== undefined && c.selectedIndex !== snap.idx) c.selectedIndex = snap.idx; if (snap.checked !== undefined && c.checked !== snap.checked) c.checked = snap.checked; if (snap.value !== undefined && c.value !== snap.value && c.type !== 'file') c.value = snap.value; } catch (e) {} snap = null; }
  function early(e) {                      /* the down and up halves of a press on a button: nobody else hears them */
    if (!live() || !e.isTrusted) return; var c = control(e.target); if (!c) return;
    e.stopImmediatePropagation(); remember(c);
    if (pressy(c) && (e.type === 'pointerdown' || e.type === 'mousedown') && e.cancelable) e.preventDefault();
  }
  function press(e) {
    if (!live() || !e.isTrusted) return; var c = control(e.target); if (!c) return;
    e.stopImmediatePropagation(); if (e.cancelable) e.preventDefault();
    go();
  }
  /* a control worked some other way (the keyboard on a dropdown or a slider, say): that's a press too */
  function change(e) { if (S.inside) { e.stopImmediatePropagation(); return; } if (!live() || !e.isTrusted || !control(e.target)) return; e.stopImmediatePropagation(); go(); }
  var IDLE = { Tab: 1, Shift: 1, Control: 1, Alt: 1, Meta: 1, Escape: 1, CapsLock: 1 };
  function key(e) {
    if (!live() || !e.isTrusted || IDLE[e.key] || e.ctrlKey || e.metaKey || e.altKey) return; var c = control(e.target); if (!c || !pressy(c)) return;
    remember(c); e.stopImmediatePropagation(); if (e.cancelable) e.preventDefault(); go();
  }
  var EARLY = ['pointerdown', 'mousedown', 'pointerup', 'mouseup', 'touchstart', 'touchend'];
  EARLY.forEach(function (t) { window.addEventListener(t, early, CAP); });
  window.addEventListener('click', press, CAP);
  window.addEventListener('change', change, CAP); window.addEventListener('input', change, CAP); window.addEventListener('keydown', key, CAP);
  function disarm() { EARLY.forEach(function (t) { window.removeEventListener(t, early, CAP); }); window.removeEventListener('click', press, CAP); window.removeEventListener('change', change, CAP); window.removeEventListener('input', change, CAP); window.removeEventListener('keydown', key, CAP); window.removeEventListener('pagehide', away); }

  /* ---- the page, put on hold and taken off it again (same counter the game buttons use) ---- */
  function holdPage(on) {
    var W = window; W.__pageHold = Math.max(0, (W.__pageHold || 0) + (on ? 1 : -1));
    try {
      if (typeof Matter === 'undefined' || typeof render === 'undefined' || typeof matterRunner === 'undefined') return;
      if (on && W.__pageHold === 1) { Matter.Render.stop(render); Matter.Runner.stop(matterRunner); }
      if (!on && W.__pageHold === 0) { Matter.Runner.run(matterRunner, engine); Matter.Render.run(render); }
    } catch (e) {}
  }
  function hold() {
    try { prevFocus = document.activeElement; } catch (e) {}
    try { prevActive = gameActive; gameActive = true; } catch (e) {}
    holdPage(true);
    try { var m = document.querySelectorAll('audio, video'); for (var i = 0; i < m.length; i++) if (!m[i].paused && !m[i].ended) { m[i].pause(); heldMedia.push(m[i]); } } catch (e) {}
    try { if (typeof audioCtx !== 'undefined' && audioCtx && ctxs.indexOf(audioCtx) < 0) ctxs.push(audioCtx); } catch (e) {}
    ctxs.forEach(function (c) { try { if (c.state === 'running') { c.suspend(); heldCtx.push(c); } } catch (e) {} });
  }
  function release() {
    heldCtx.forEach(function (c) { try { c.resume(); } catch (e) {} }); heldCtx = [];
    heldMedia.forEach(function (m) { try { var p = m.play(); if (p && p.catch) p.catch(function () {}); } catch (e) {} }); heldMedia = [];
    holdPage(false);
    try { if (!prevActive) gameActive = false; } catch (e) {}
    try { if (prevFocus && prevFocus.focus && document.contains(prevFocus)) prevFocus.focus({ preventScroll: true }); } catch (e) {}
    prevFocus = null;
  }

  function go() {
    if (!live()) return;
    S.used = true; S.inside = true; putBack();
    var ok = false; try { ok = handle.enter({ onExit: back }); } catch (e) { S.error = String(e && e.message || e); }
    if (!ok) { S.inside = false; disarm(); try { handle.dispose(); } catch (e) {} handle = null; return; }
    hold();
  }
  function back(info) {
    S.inside = false; S.info = info || null; handle = null;
    disarm(); release();
    try { if (info && info.fridge) localStorage.setItem('level0.fridge', '1'); } catch (e) {}
    try { window.dispatchEvent(new CustomEvent('level0:exit', { detail: info || {} })); } catch (e) {}
  }
  /* leaving the page while it's built but unused: give the GPU back */
  function away() { if (handle && !S.inside) { try { handle.dispose(); } catch (e) {} handle = null; S.ready = false; } }
  window.addEventListener('pagehide', away);
})();
