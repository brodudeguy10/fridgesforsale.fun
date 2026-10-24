/* ============================================================
   FRIDGE PALACE: the front door
   adds the "fridge casino" button upstairs. nothing 3D loads until
   somebody presses it.
============================================================ */
(function(){
'use strict';
const here = (document.currentScript && document.currentScript.src) || location.href;
const MAIN = new URL('main.js', here).href;
const ESCAPE = new URL('heist/escape2d.js', here).href;
const HCSS = new URL('heist/heist.css', here).href;
const CSS = new URL('casino.css', here).href;
let root = null, busy = false, prevActive = false, musicWasOn = false;

function css(){ if(document.getElementById('fp-css')) return; const l = document.createElement('link'); l.id = 'fp-css'; l.rel = 'stylesheet'; l.href = CSS; document.head.appendChild(l); }
function button(){
  const eco = document.getElementById('economyBox'); if(!eco || document.getElementById('fpOpenBtn')) return;
  const b = document.createElement('button'); b.id = 'fpOpenBtn'; b.innerHTML = 'fridge casino<small>FRIDGE PALACE · open late</small>';
  b.onclick = open;
  const after = document.getElementById('fxOpenBtn');
  if(after && after.nextSibling) eco.insertBefore(b, after.nextSibling); else eco.appendChild(b);
}
async function open(){
  if(busy) return; busy = true;
  css();
  try{ if(typeof ensureAudioContext === 'function') ensureAudioContext(); if(typeof audioCtx !== 'undefined' && audioCtx && audioCtx.state === 'suspended') audioCtx.resume(); }catch(e){}
  root = document.createElement('div'); root.id = 'fridgepalace';
  root.innerHTML = `<div id="fp-load"><div class="fp-loadcard">
    <div class="fp-diamond"></div>
    <h1>FRIDGE PALACE</h1><div class="fp-loadsub">CASINO · RESORT · COLD STORAGE</div>
    <div class="fp-bar"><i></i></div><div class="fp-loadmsg">opening the doors</div>
    <div class="fp-tip"></div></div></div>`;
  document.body.appendChild(root);
  document.documentElement.classList.add('overlay-open');
  try{ prevActive = gameActive; gameActive = true; }catch(e){}
  try{ if(typeof audio !== 'undefined' && audio && !audio.paused){ audio.pause(); musicWasOn = true; } }catch(e){}
  const tips = ['tip: the house edge on single-zero roulette is 2.7%. on double zero it\'s 5.26%.', 'tip: basic strategy says always split aces and eights.', 'tip: the bartender knows things.', 'tip: there is a door that needs a code.', 'tip: the lucky wheel is free once a day.', 'tip: nobody has ever beaten the out of order machine.', 'tip: if the pit boss starts watching you, bet smaller.', 'tip: some of the fish in the tank are yours.'];
  root.querySelector('.fp-tip').textContent = tips[(Math.random()*tips.length)|0];
  const prog = (k, msg)=>{ const b = root && root.querySelector('.fp-bar i'); if(b) b.style.width = Math.round(k*100) + '%'; const m = root && root.querySelector('.fp-loadmsg'); if(m && msg) m.textContent = msg; };
  root._onLeave = close;
  try{
    const mod = await import(MAIN);
    await mod.start({ root, progress:prog });
    const l = root.querySelector('#fp-load'); if(l){ l.classList.add('gone'); setTimeout(()=>l.remove(), 900); }
  }catch(e){
    console.error(e);
    prog(1, 'the palace couldn\'t open on this browser. ' + (String(e && e.message) === 'webgl' ? '3D graphics (WebGL) are turned off or not supported.' : 'something broke loading it.'));
    const c = root.querySelector('.fp-loadcard'); const bt = document.createElement('button'); bt.textContent = 'back upstairs'; bt.className = 'fp-backbtn'; bt.onclick = close; c.appendChild(bt);
  }
  busy = false;
}
function close(opts){
  if(root){ root.remove(); root = null; }
  /* out the front doors and onto the page */
  if(opts && opts.escape){
    document.documentElement.classList.remove('overlay-open');
    try{ if(musicWasOn && typeof audio !== 'undefined' && audio) audio.play().catch(()=>{}); }catch(e){}
    musicWasOn = false;
    import(ESCAPE).then(m=>m.run(opts.escape)).catch(e=>{ console.error(e); try{ if(window.FRIDGE_BANK) FRIDGE_BANK.give(opts.escape.loot || 0); }catch(e2){} try{ gameActive = false; }catch(e3){} });
    return;
  }
  document.documentElement.classList.remove('overlay-open');
  try{ if(!prevActive) gameActive = false; }catch(e){}
  try{ if(musicWasOn && typeof audio !== 'undefined' && audio) audio.play().catch(()=>{}); }catch(e){}
  musicWasOn = false;
  try{ if(typeof updateCounter === 'function') updateCounter(); }catch(e){}
  podium(); wanted();
}
/* the podium fridge: if you won it, it lives upstairs now, every visit */
function podium(){
  try{
    const s = JSON.parse(localStorage.getItem('fridgepalace_v1') || 'null');
    if(!s || !s.podium || !window.FV || !window.Matter || typeof world === 'undefined' || document.getElementById('fpPodiumMark')) return;
    const b = FV.body(window.innerWidth*0.5, 80, { variant:FV.bySym.GOLD, noMarket:true });
    Matter.Body.scale(b, 2.2, 2.2); b.render.sprite.xScale *= 2.2; b.render.sprite.yScale *= 2.2; Matter.Body.setDensity(b, 0.006);
    b.plugin.podium = true;
    Matter.World.add(world, b);
    const mark = document.createElement('i'); mark.id = 'fpPodiumMark'; mark.style.display = 'none'; document.body.appendChild(mark);
  }catch(e){ console.warn(e); }
}
/* the wanted poster: up while the heat is on */
function wanted(){
  try{
    const s = JSON.parse(localStorage.getItem('fridgepalace_v1') || 'null');
    const H = s && s.heist; const old = document.getElementById('fpWanted');
    if(!H || !(H.heat > 0) || !(H.wantedUntil > Date.now())){ if(old) old.remove(); return; }
    if(!document.getElementById('hh-css')){ const l = document.createElement('link'); l.id = 'hh-css'; l.rel = 'stylesheet'; l.href = HCSS; document.head.appendChild(l); }
    const el = old || document.createElement('div'); el.id = 'fpWanted';
    const mobile = innerWidth < 760;
    el.style.left = mobile ? 'auto' : '200px'; el.style.right = mobile ? '12px' : 'auto'; el.style.top = mobile ? '64px' : '140px'; if(mobile) el.style.transform = 'rotate(3deg) scale(.75)';
    el.innerHTML = '<h3>WANTED</h3><canvas width="110" height="120"></canvas><p>FOR THE FRIDGE PALACE JOB</p><b>' + (H.totalStolen || 0).toLocaleString('en-US') + ' FRIDGES</b><p>' + '★'.repeat(H.heat) + '</p>';
    const g = el.querySelector('canvas').getContext('2d');
    g.fillStyle = '#d8d0b8'; g.fillRect(0, 0, 110, 120); g.fillStyle = '#eeeeea'; g.strokeStyle = '#333'; g.lineWidth = 2; g.fillRect(25, 12, 60, 100); g.strokeRect(25, 12, 60, 100);
    g.fillStyle = '#111'; g.fillRect(33, 20, 44, 24); g.fillStyle = '#7ff3ff'; g.fillRect(42, 27, 7, 6); g.fillRect(61, 27, 7, 6); g.fillStyle = '#333'; g.fillRect(25, 46, 60, 2);
    g.fillStyle = '#2a2a2a'; g.beginPath(); g.ellipse(92, 70, 12, 18, 0.3, 0, 7); g.fill(); g.fillStyle = '#7dff9a'; g.font = 'bold 12px Arial'; g.fillText('$', 88, 75);
    el.title = 'heat cools off one star a day';
    el.onclick = ()=>{ el.style.transform = 'rotate(' + (Math.random()*16 - 8) + 'deg)'; };
    if(!old) document.body.appendChild(el);
  }catch(e){ console.warn(e); }
}
window.fpWanted = wanted;
setTimeout(wanted, 1500);
window.openFridgeCasino = open;
setTimeout(podium, 1200);
if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', button); else button();
try{ if(new URLSearchParams(location.search).get('casino')) setTimeout(open, 600); }catch(e){}
})();
