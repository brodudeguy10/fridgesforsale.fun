/* ============================================================
   TORTURE ROOM: the button on the fridge page.
   adds "torture room" under the racing button. nothing loads until
   somebody presses it; then the room opens full screen in its own
   frame, the fridge page underneath stops (its physics, its canvas,
   the music), and EXIT in the room puts everything back the way it
   was. the room keeps its own settings and its own body count.
============================================================ */
(function () {
  'use strict';
  var here = (document.currentScript && document.currentScript.src) || location.href;
  var GAME = new URL('index.html?v=1.1.0', here).href;
  var wrap = null, musicWasOn = false, prevActive = false;

  function button() {
    var eco = document.getElementById('economyBox');
    if (!eco || document.getElementById('trOpenBtn')) return;
    if (!document.getElementById('tr-btncss')) {
      var st = document.createElement('style'); st.id = 'tr-btncss';
      st.textContent = '#trOpenBtn{position:relative;background:linear-gradient(180deg,#1d1e1f,#0b0b0c)!important;color:#d9d7d0!important;border:1px solid #5a1a14!important;cursor:pointer;font-family:monospace;padding:5px 4px;line-height:1.2;letter-spacing:1px}#trOpenBtn small{display:block;font-size:9px;color:#8f8d86;letter-spacing:1px;margin-top:2px}#trOpenBtn:hover{border-color:#b32a20!important;filter:brightness(1.2)}' +
        '#tr-wrap{position:fixed;inset:0;z-index:100071;background:#000}#tr-wrap iframe{position:absolute;inset:0;width:100%;height:100%;border:0;display:block}';
      document.head.appendChild(st);
    }
    var b = document.createElement('button'); b.id = 'trOpenBtn'; b.type = 'button'; b.innerHTML = 'torture room<small>ONE ROOM · ONE DUMMY</small>';
    b.onclick = open;
    place(b, eco);
  }
  /* under the racing button, or wherever the last game button is */
  function place(b, eco) {
    var after = document.getElementById('csOpenBtn') || document.getElementById('fpOpenBtn') || document.getElementById('fxOpenBtn');
    if (after && after.parentNode === eco) { if (after.nextSibling !== b) eco.insertBefore(b, after.nextSibling); }
    else if (b.parentNode !== eco) eco.appendChild(b);
  }
  /* the fridge page under a full-screen game: nobody can see it, so its physics and its canvas stop until the room
     closes (the racing boot file does the same; the shared counter keeps them from fighting) */
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
    wrap = document.createElement('div'); wrap.id = 'tr-wrap';
    var f = document.createElement('iframe'); f.src = GAME; f.allow = 'autoplay; fullscreen'; f.title = 'torture room';
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
  window.addEventListener('message', function (e) { if (e.data && e.data.torture === 'exit' && wrap && e.source === wrap.querySelector('iframe').contentWindow) close(); });
  window.TORTURE = { open: open, close: close };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { setTimeout(button, 60); }); else setTimeout(button, 60);
  /* the casino and racing buttons arrive late; stay under them */
  setTimeout(function () { var b = document.getElementById('trOpenBtn'), eco = document.getElementById('economyBox'); if (b && eco) place(b, eco); }, 1600);
})();
