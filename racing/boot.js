/* ============================================================
   COLD START: the button on the fridge page.
   adds "fridge racing" under the casino button. nothing loads
   until somebody presses it; then the game opens full screen in
   its own frame, and closing it puts everything back.
============================================================ */
(function () {
  'use strict';
  var here = (document.currentScript && document.currentScript.src) || location.href;
  var GAME = new URL('index.html', here).href;
  var wrap = null, musicWasOn = false, prevActive = false;

  function button() {
    var eco = document.getElementById('economyBox');
    if (!eco || document.getElementById('csOpenBtn')) return;
    if (!document.getElementById('cs-btncss')) {
      var st = document.createElement('style'); st.id = 'cs-btncss';
      st.textContent = '#csOpenBtn{position:relative;background:linear-gradient(180deg,#0e1a3a,#04070f)!important;color:#d8f2ff!important;border:1px solid #4a8aff!important;cursor:pointer;font-family:monospace;padding:5px 4px;line-height:1.2;font-style:italic}#csOpenBtn small{display:block;font-size:9px;color:#9ad8ff;letter-spacing:1px;margin-top:2px;font-style:normal}#csOpenBtn:hover{filter:brightness(1.3)}' +
        '#cs-wrap{position:fixed;inset:0;z-index:100070;background:#000}#cs-wrap iframe{position:absolute;inset:0;width:100%;height:100%;border:0;display:block}';
      document.head.appendChild(st);
    }
    var b = document.createElement('button'); b.id = 'csOpenBtn'; b.innerHTML = 'fridge racing<small>COLD START · 2 A.M.</small>';
    b.onclick = open;
    var after = document.getElementById('fpOpenBtn') || document.getElementById('fxOpenBtn');
    if (after && after.nextSibling) eco.insertBefore(b, after.nextSibling); else eco.appendChild(b);
  }
  function open() {
    if (wrap) return;
    wrap = document.createElement('div'); wrap.id = 'cs-wrap';
    var f = document.createElement('iframe'); f.src = GAME; f.allow = 'autoplay; fullscreen; gamepad'; f.setAttribute('allowfullscreen', '');
    wrap.appendChild(f); document.body.appendChild(wrap);
    document.documentElement.classList.add('overlay-open');
    try { prevActive = gameActive; gameActive = true; } catch (e) {}
    try { if (typeof audio !== 'undefined' && audio && !audio.paused) { audio.pause(); musicWasOn = true; } } catch (e) {}
    setTimeout(function () { try { f.focus(); } catch (e) {} }, 300);
  }
  function close() {
    if (!wrap) return;
    wrap.remove(); wrap = null;
    document.documentElement.classList.remove('overlay-open');
    try { if (!prevActive) gameActive = false; } catch (e) {}
    try { if (musicWasOn && typeof audio !== 'undefined' && audio) audio.play().catch(function () {}); } catch (e) {}
    musicWasOn = false;
  }
  window.addEventListener('message', function (e) { if (e.data && e.data.coldstart === 'exit') close(); });
  window.COLDSTART = { open: open, close: close };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { setTimeout(button, 50); }); else setTimeout(button, 50);
  /* the casino adds its button late; keep ours after it */
  setTimeout(function () { var b = document.getElementById('csOpenBtn'), c = document.getElementById('fpOpenBtn'); if (b && c && c.nextSibling !== b) c.parentNode.insertBefore(b, c.nextSibling); }, 1500);
})();
