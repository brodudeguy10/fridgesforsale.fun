/* ============================================================
   RAGE ROOM: the button on the fridge page.
   adds "rage room" under the torture room button. nothing loads
   until somebody presses it; then the rage room opens full screen
   in its own frame, the fridge page underneath stops (its physics,
   its canvas, the music), and leaving the room (the exit door, or
   "leave" on the check or the pause menu) puts everything back the
   way it was. the room keeps its own save: lifetime fridges, money
   earned, unlocked weapons, settings and key bindings.
============================================================ */
(function () {
  'use strict';
  var here = (document.currentScript && document.currentScript.src) || location.href;
  var GAME = new URL('index.html?v=1.0.0', here).href;
  var wrap = null, musicWasOn = false, prevActive = false;

  function button() {
    var eco = document.getElementById('economyBox');
    if (!eco || document.getElementById('rrOpenBtn')) return;
    if (!document.getElementById('rr-btncss')) {
      var st = document.createElement('style'); st.id = 'rr-btncss';
      st.textContent =
        '#rrOpenBtn{position:relative;overflow:hidden;background:linear-gradient(180deg,#2b2a27,#121210)!important;color:#f2c230!important;border:1px solid #f2a50c!important;cursor:pointer;font-family:monospace;font-weight:bold;padding:5px 4px 7px;line-height:1.2;letter-spacing:2px}' +
        '#rrOpenBtn small{display:block;font-size:9px;font-weight:normal;color:#b9b3a3;letter-spacing:1px;margin-top:2px}' +
        '#rrOpenBtn:after{content:"";position:absolute;left:0;right:0;bottom:0;height:3px;background:repeating-linear-gradient(135deg,#f2a50c 0 6px,#111 6px 12px)}' +
        '#rrOpenBtn:hover{filter:brightness(1.2);border-color:#ffd24a!important}' +
        '#rr-wrap{position:fixed;inset:0;z-index:100072;background:#0b0b0a}#rr-wrap iframe{position:absolute;inset:0;width:100%;height:100%;border:0;display:block}';
      document.head.appendChild(st);
    }
    var b = document.createElement('button'); b.id = 'rrOpenBtn'; b.type = 'button'; b.innerHTML = 'RAGE ROOM<small>FRIDGES · BRING A BAT</small>';
    b.onclick = open;
    place(b, eco);
  }
  /* under the torture room button, or wherever the last game button is */
  function place(b, eco) {
    var after = document.getElementById('trOpenBtn') || document.getElementById('csOpenBtn') || document.getElementById('fpOpenBtn') || document.getElementById('fxOpenBtn');
    if (after && after.parentNode === eco) { if (after.nextSibling !== b) eco.insertBefore(b, after.nextSibling); }
    else if (b.parentNode !== eco) eco.appendChild(b);
  }
  /* the fridge page under a full-screen game: nobody can see it, so its physics and its canvas stop until the room
     closes (the racing and torture boot files do the same; the shared counter keeps them from fighting) */
  function holdPage(on) {
    var W = window; W.__pageHold = Math.max(0, (W.__pageHold || 0) + (on ? 1 : -1));
    try {
      if (typeof Matter === 'undefined' || typeof render === 'undefined' || typeof matterRunner === 'undefined') return;
      if (on && W.__pageHold === 1) { Matter.Render.stop(render); Matter.Runner.stop(matterRunner); }
      if (!on && W.__pageHold === 0) { Matter.Runner.run(matterRunner, engine); Matter.Render.run(render); }
    } catch (e) {}
  }
  function open() {
    if (wrap) return;
    wrap = document.createElement('div'); wrap.id = 'rr-wrap';
    var f = document.createElement('iframe'); f.src = GAME; f.allow = 'autoplay; fullscreen'; f.title = 'rage room';
    wrap.appendChild(f); document.body.appendChild(wrap);
    document.documentElement.classList.add('overlay-open');
    try { prevActive = gameActive; gameActive = true; } catch (e) {}
    holdPage(true);
    try { if (typeof audio !== 'undefined' && audio && !audio.paused) { audio.pause(); musicWasOn = true; } } catch (e) {}
    setTimeout(function () { try { f.focus(); } catch (e) {} }, 300);
  }
  function close() {
    if (!wrap) return;
    wrap.remove(); wrap = null;
    holdPage(false);
    document.documentElement.classList.remove('overlay-open');
    try { if (!prevActive) gameActive = false; } catch (e) {}
    try { if (musicWasOn && typeof audio !== 'undefined' && audio) audio.play().catch(function () {}); } catch (e) {}
    musicWasOn = false;
  }
  window.addEventListener('message', function (e) { if (e.data && e.data.rage === 'exit' && wrap && e.source === wrap.querySelector('iframe').contentWindow) close(); });
  window.RAGE = { open: open, close: close };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { setTimeout(button, 80); }); else setTimeout(button, 80);
  /* the casino, racing and torture buttons arrive late; stay under them */
  setTimeout(function () { var b = document.getElementById('rrOpenBtn'), eco = document.getElementById('economyBox'); if (b && eco) place(b, eco); }, 1800);
})();
