/* ============================================================
   4:20
   at 16:20:00 local time, every day, dogg.mp4 plays over everything
   for one minute. load the page at 16:20:35 and it starts 35 seconds
   in, so it always ends on 16:21:00.
   testing: add ?dogg=1 to the URL, or run dogg420() in the console.
============================================================ */
(function(){
'use strict';
const SRC = 'dogg.mp4';
let el = null, vid = null, tap = null, playingKey = null, stopTimer = 0, resumeMusic = false;

function build(){
  if(el) return;
  el = document.createElement('div');
  el.id = 'dogg420';
  el.style.cssText = 'position:fixed;inset:0;z-index:2147483646;background:#000;display:none;align-items:center;justify-content:center;';
  vid = document.createElement('video');
  vid.src = SRC; vid.preload = 'auto'; vid.playsInline = true; vid.setAttribute('playsinline', '');
  vid.style.cssText = 'width:100%;height:100%;object-fit:contain;background:#000;';
  tap = document.createElement('button');
  tap.textContent = 'tap for sound';
  tap.style.cssText = 'position:absolute;bottom:calc(24px + env(safe-area-inset-bottom,0px));left:50%;transform:translateX(-50%);font:14px monospace;letter-spacing:2px;padding:12px 20px;background:rgba(0,0,0,0.6);color:#fff;border:1px solid #fff;cursor:pointer;display:none;';
  tap.addEventListener('click', ()=>{ vid.muted = false; vid.play().catch(()=>{}); tap.style.display = 'none'; });
  el.appendChild(vid); el.appendChild(tap);
  document.body.appendChild(el);
}

function start(offsetSec, key){
  build();
  playingKey = key;
  const left = Math.max(0.5, 60 - offsetSec);
  el.style.display = 'flex';
  /* if you are in the basement, it waits for you. the music upstairs gets out of the way. */
  try{ if(window.VENDOR && VENDOR._basement && VENDOR._basement.pause) VENDOR._basement.pause(); }catch(e){}
  try{ if(typeof audio !== 'undefined' && !audio.paused){ audio.pause(); resumeMusic = true; } }catch(e){}
  const go = ()=>{
    try{ vid.currentTime = Math.min(offsetSec, Math.max(0, (vid.duration||60) - 0.5)); }catch(e){}
    vid.muted = false;
    vid.play().catch(()=>{
      /* no click on the page yet: browsers only allow it muted */
      vid.muted = true; tap.style.display = 'block';
      vid.play().catch(()=>{});
    });
  };
  if(vid.readyState >= 1) go(); else vid.addEventListener('loadedmetadata', go, { once:true });
  clearTimeout(stopTimer);
  stopTimer = setTimeout(stop, left*1000);
}
function stop(){
  if(!el) return;
  try{ vid.pause(); }catch(e){}
  el.style.display = 'none'; tap.style.display = 'none';
  if(resumeMusic){ resumeMusic = false; try{ audio.play().catch(()=>{}); }catch(e){} }
}

/* checked twice a second rather than a single timeout, because background
   tabs throttle timers and the clock can drift or jump */
function tick(){
  const d = new Date();
  const key = d.getFullYear() + '-' + d.getMonth() + '-' + d.getDate();
  if(d.getHours() === 16 && d.getMinutes() === 20){
    if(playingKey !== key) start(d.getSeconds() + d.getMilliseconds()/1000, key);
  }
}
setInterval(tick, 500);
tick();
/* warm the file up in the minute before, so it starts on the second */
setInterval(()=>{ const d = new Date(); if(d.getHours() === 16 && d.getMinutes() === 19 && d.getSeconds() > 40){ build(); } }, 5000);

window.dogg420 = function(){ start(0, 'test-' + Date.now()); return 'playing'; };
try{ if(new URLSearchParams(location.search).get('dogg')) setTimeout(()=>window.dogg420(), 800); }catch(e){}
})();
