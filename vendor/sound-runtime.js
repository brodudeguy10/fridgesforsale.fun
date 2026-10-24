/* ============================================================
   THE VENDOR — sound runtime
   gets the bank rendered (worker, cache, or main thread as a last
   resort), turns it into AudioBuffers, and plays it.
   V.SND.play(name, { x, y, hrtf, gain, rate, jitter, dest, loop, at })
============================================================ */
(function(){
'use strict';
const V = window.VENDOR = window.VENDOR || {};
const S = V.SND = {};
const raw = {}, bufs = {}, last = {};
let started = false, worker = null, want = [], pending = 0;
const VERSION = (window.VBANK_VERSION || 'snd');
const listeners = [];

function names(maxPri){
  const B = window.VBANK || {};
  return Object.keys(B).filter(n=>B[n].pri <= maxPri).sort((a,b)=>B[a].pri - B[b].pri);
}
S.total = ()=>names(2).length;
S.loaded = ()=>names(2).filter(n=>raw[n]).length;
S.progress = ()=>{ const t = S.total(); return t ? S.loaded()/t : 0; };
S.has = (n)=>!!raw[n];
S.essentialReady = ()=>names(0).every(n=>raw[n]);
S.onReady = (fn)=>{ if(S.essentialReady()) fn(); else listeners.push(fn); };

/* ---------- cache (indexedDB): the second visit skips rendering ---------- */
let dbP = null;
function db(){
  if(dbP) return dbP;
  dbP = new Promise((res)=>{
    try{
      const r = indexedDB.open('vendor-sound', 1);
      r.onupgradeneeded = ()=>{ r.result.createObjectStore('bank'); };
      r.onsuccess = ()=>res(r.result);
      r.onerror = ()=>res(null);
    }catch(e){ res(null); }
  });
  return dbP;
}
function cacheGetAll(){
  return db().then(d=>new Promise(res=>{
    if(!d) return res({});
    try{
      const out = {};
      const tx = d.transaction('bank', 'readonly'), st = tx.objectStore('bank');
      const req = st.openCursor();
      req.onsuccess = ()=>{ const c = req.result; if(c){ if(c.key.indexOf(VERSION + ':') === 0) out[c.key.slice(VERSION.length+1)] = c.value; c.continue(); } else res(out); };
      req.onerror = ()=>res({});
    }catch(e){ res({}); }
  }));
}
function cachePut(name, entry){
  db().then(d=>{ if(!d) return; try{ d.transaction('bank','readwrite').objectStore('bank').put(entry, VERSION + ':' + name); }catch(e){} });
}
function cachePrune(){
  db().then(d=>{ if(!d) return; try{
    const st = d.transaction('bank','readwrite').objectStore('bank'); const req = st.openCursor();
    req.onsuccess = ()=>{ const c = req.result; if(c){ if(c.key.indexOf(VERSION + ':') !== 0) c.delete(); c.continue(); } };
  }catch(e){} });
}

function got(entry, fromCache){
  if(!entry || entry.error || !entry.name) return;
  raw[entry.name] = entry;
  delete bufs[entry.name];
  if(!fromCache) cachePut(entry.name, entry);
  if(S.essentialReady()){ while(listeners.length) try{ listeners.shift()(); }catch(e){} }
}

/* ---------- render ---------- */
function renderMain(list){
  /* no worker (file:// or an old browser): render a few at a time between frames */
  let i = 0;
  (function next(){
    const t0 = performance.now();
    while(i < list.length && performance.now() - t0 < 12){
      try{ got(window.VBANK_RENDER(list[i])); }catch(e){}
      i++;
    }
    if(i < list.length) setTimeout(next, 16);
  })();
}
function render(list){
  list = list.filter(n=>!raw[n]);
  if(!list.length) return;
  if(!worker){
    try{
      worker = new Worker(SCRIPT_SRC ? SCRIPT_SRC.replace(/sound-runtime\.js.*$/, 'sound-worker.js') : 'vendor/sound-worker.js');
      worker.onmessage = (e)=>{ if(e.data && e.data.name) got(e.data); };
      worker.onerror = ()=>{ const left = Object.keys(window.VBANK).filter(n=>!raw[n]); worker = 'dead'; renderMain(left); };
    }catch(e){ worker = 'dead'; }
  }
  if(worker === 'dead') renderMain(list);
  else worker.postMessage({ cmd:'render', names:list });
}
const SCRIPT_SRC = document.currentScript ? document.currentScript.src : null;
S.start = function(){
  if(started) return;
  started = true;
  if(!window.VBANK){ console.warn('sound bank missing'); return; }
  cacheGetAll().then(cached=>{
    Object.keys(cached).forEach(n=>{ if(window.VBANK[n]) got(cached[n], true); });
    cachePrune();
    render(names(2));
  });
};
/* easter egg sounds only render when something asks for them */
S.need = function(name){ if(!raw[name] && window.VBANK && window.VBANK[name]){ S.start(); render([name]); } };

/* ---------- buffers ---------- */
function toBuffers(name){
  if(bufs[name]) return bufs[name];
  const e = raw[name]; if(!e) return null;
  const c = V.ac(); if(!c) return null;
  bufs[name] = e.data.map(d=>{
    const st = !!d.L, L = st ? d.L : d, R = st ? d.R : null;
    const b = c.createBuffer(st ? 2 : 1, L.length, e.sr);
    b.copyToChannel(L, 0); if(st) b.copyToChannel(R, 1);
    return b;
  });
  return bufs[name];
}
S.buffer = function(name, idx){
  const arr = toBuffers(name);
  if(!arr || !arr.length){ S.need(name); return null; }
  if(idx !== undefined) return arr[idx % arr.length];
  let k = (Math.random()*arr.length)|0;
  if(arr.length > 2 && k === last[name]) k = (k+1) % arr.length;
  last[name] = k;
  return arr[k];
};

/* ---------- play ---------- */
function setPos(p, x, y){
  if(p.positionX){ p.positionX.value = x; p.positionY.value = 0; p.positionZ.value = y; }
  else p.setPosition(x, 0, y);
}
S.setPos = setPos;
S.play = function(name, o){
  o = o || {};
  const c = V.ac(); if(!c) return null;
  const b = S.buffer(name, o.variant); if(!b) return null;
  const src = c.createBufferSource(); src.buffer = b;
  src.loop = !!o.loop;
  let rate = o.rate || 1;
  if(o.jitter) rate *= 1 + (Math.random()*2-1)*o.jitter;
  src.playbackRate.value = rate;
  const g = c.createGain(); g.gain.value = o.gain === undefined ? 1 : o.gain;
  src.connect(g);
  let tail = g, p = null, f = null;
  if(o.x !== undefined){
    f = c.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = o.occ ? 420 : 18000; f.Q.value = 0.5;
    p = c.createPanner();
    p.panningModel = o.hrtf ? 'HRTF' : 'equalpower';
    p.distanceModel = 'inverse'; p.refDistance = o.ref || 1.3; p.maxDistance = 60; p.rolloffFactor = o.rolloff || 1.25;
    setPos(p, o.x, o.y);
    g.connect(f); f.connect(p); tail = p;
  }
  const dest = o.dest || (V.bus() && V.bus().master);
  if(!dest) return null;
  tail.connect(dest);
  const at = o.at || c.currentTime;
  try{ src.start(at, o.offset || 0); }catch(e){ return null; }
  const h = {
    src, g, p, f, name,
    stop(fade){ const t = c.currentTime; try{ g.gain.cancelScheduledValues(t); g.gain.setTargetAtTime(0.0001, t, (fade||0.05)/3); src.stop(t + (fade||0.05) + 0.05); }catch(e){} },
    gain(v, tau){ try{ g.gain.setTargetAtTime(Math.max(0.0001, v), c.currentTime, tau || 0.1); }catch(e){} },
    rate(v, tau){ try{ src.playbackRate.setTargetAtTime(v, c.currentTime, tau || 0.1); }catch(e){} },
    pos(x, y){ if(p) setPos(p, x, y); },
    occ(on){ if(f) f.frequency.setTargetAtTime(on ? 420 : 18000, c.currentTime, 0.2); }
  };
  src.onended = ()=>{ try{ tail.disconnect(); }catch(e){} };
  return h;
};

/* start rendering a few seconds after the page settles, so the
   fridges upstairs get the first frames */
function kick(){ setTimeout(()=>S.start(), 1800); }
if(document.readyState === 'complete') kick(); else window.addEventListener('load', kick);
})();
