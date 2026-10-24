/* ============================================================
   THE VENDOR — shared state
   memory, settings, the audio bus, hooks into the site upstairs,
   and the debug switches.
   load order: shared.js, basement-map.js, basement-gfx.js,
   basement-audio.js, basement-core.js, coldfeet.js
============================================================ */
(function(){
'use strict';

const V = window.VENDOR = window.VENDOR || {};

/* ---------- MEMORY ----------
   same key the old build used, so nobody's count gets wiped.
   new fields get defaults on load. */
const MEM_KEY = 'vendor_memory_v1';
const SET_KEY = 'vendor_settings_v1';
const MEM_DEFAULTS = {
  visits:0, deaths:0, escaped:0, bestChamber:0, lastVisit:0, firstVisit:0,
  relationship:'stranger', dateRoute:null, datePlays:0, knownName:null,
  vendorName:null, playerName:null,
  broke:false,                 // the containment break only happens once
  rouletteDeaths:0, rouletteSeen:0,
  guyKills:0, guySeen:0,
  relayVisits:0, relaySeen:0,
  fridgesSpawned:0, fridgesSeen:0,
  checkins:0, lastCheckin:0, seenTopics:[], affection:0,
  unplugged:false, unplugCount:0,
  gifts:[], tagsTotal:0, sauce:0, tapes:0, radio:0,
  lastRoute:null, sevenSeen:false, hasE:false, gaveE:false, seen:{}, tagModeWins:0, tagModeLosses:0
};
function fresh(){ const m = {}; for(const k in MEM_DEFAULTS) m[k] = Array.isArray(MEM_DEFAULTS[k]) ? [] : MEM_DEFAULTS[k]; return m; }
V.loadMem = function(){
  let m = null;
  try{ const r = localStorage.getItem(MEM_KEY); if(r) m = JSON.parse(r); }catch(e){}
  if(!m || typeof m !== 'object') m = {};
  const f = fresh();
  for(const k in f) if(m[k] === undefined) m[k] = f[k];
  if(!Array.isArray(m.seenTopics)) m.seenTopics = [];
  if(!Array.isArray(m.gifts)) m.gifts = [];
  if(!m.seen || typeof m.seen !== 'object' || Array.isArray(m.seen)) m.seen = {};
  return m;
};
V.saveMem = function(m){ try{ localStorage.setItem(MEM_KEY, JSON.stringify(m)); }catch(e){} V.mem = m; };
V.mem = V.loadMem();
/* read, change, write. always reload first so two parts of the site
   never stomp on each other's numbers. */
V.patch = function(fn){ const m = V.loadMem(); try{ fn(m); }catch(e){ console.warn(e); } V.saveMem(m); return m; };
V.isTogether = function(){ return V.loadMem().relationship === 'together'; };
/* things you've seen down there. the VN only lets you ask about what you
   actually came across: a wall, a tag, a thing you used. */
const seenCache = {};
V.see = function(key){
  if(seenCache[key]) return false;
  seenCache[key] = 1;
  let isNew = false;
  V.patch(m=>{ if(!m.seen[key]){ m.seen[key] = Date.now(); isNew = true; } });
  return isNew;
};
V.saw = function(key){ return !!V.loadMem().seen[key]; };
V.sawAny = function(keys){ const s = V.loadMem().seen; return keys.some(k=>!!s[k]); };

/* ---------- SETTINGS ---------- */
const SET_DEFAULTS = { sens:1, vol:0.9, quality:'auto', invertY:false, shake:true, haptics:true };
V.loadSettings = function(){
  let s = null;
  try{ const r = localStorage.getItem(SET_KEY); if(r) s = JSON.parse(r); }catch(e){}
  s = Object.assign({}, SET_DEFAULTS, s || {});
  return s;
};
V.settings = V.loadSettings();
V.saveSettings = function(){ try{ localStorage.setItem(SET_KEY, JSON.stringify(V.settings)); }catch(e){} if(V._bus) V._bus.master.gain.value = V.settings.vol; };

/* ---------- AUDIO BUS ----------
   one master gain and a limiter for everything down here.
   the site's own audioCtx gets reused so nothing fights over it. */
V.ac = function(){
  try{ if(typeof ensureAudioContext === 'function') ensureAudioContext(); }catch(e){}
  let c = null;
  try{ c = (typeof audioCtx !== 'undefined') ? audioCtx : null; }catch(e){}
  if(!c){
    if(!V._ownCtx){ try{ V._ownCtx = new (window.AudioContext || window.webkitAudioContext)(); }catch(e){} }
    c = V._ownCtx || null;
  }
  if(c && c.state === 'suspended'){ try{ c.resume(); }catch(e){} }
  return c;
};
V.bus = function(){
  const c = V.ac(); if(!c) return null;
  if(V._bus && V._bus.ctx === c) return V._bus;
  const master = c.createGain(); master.gain.value = V.settings.vol;
  const comp = c.createDynamicsCompressor();
  comp.threshold.value = -14; comp.knee.value = 10; comp.ratio.value = 6;
  comp.attack.value = 0.004; comp.release.value = 0.25;
  master.connect(comp); comp.connect(c.destination);
  V._bus = { ctx:c, master, comp };
  return V._bus;
};
V.noiseBuffer = function(seconds, kind){
  const c = V.ac(); if(!c) return null;
  const key = kind + ':' + seconds;
  V._noise = V._noise || {};
  if(V._noise[key] && V._noise[key].sampleRate === c.sampleRate) return V._noise[key];
  const len = Math.max(1, (c.sampleRate * seconds) | 0);
  const b = c.createBuffer(1, len, c.sampleRate);
  const d = b.getChannelData(0);
  if(kind === 'brown'){
    let last = 0;
    for(let i=0;i<len;i++){ const w = Math.random()*2-1; last = (last + 0.02*w)/1.02; d[i] = last*3.5; }
  } else if(kind === 'pink'){
    let b0=0,b1=0,b2=0,b3=0,b4=0,b5=0,b6=0;
    for(let i=0;i<len;i++){
      const w = Math.random()*2-1;
      b0=0.99886*b0+w*0.0555179; b1=0.99332*b1+w*0.0750759; b2=0.96900*b2+w*0.1538520;
      b3=0.86650*b3+w*0.3104856; b4=0.55000*b4+w*0.5329522; b5=-0.7616*b5-w*0.0168980;
      d[i]=(b0+b1+b2+b3+b4+b5+b6+w*0.5362)*0.11; b6=w*0.115926;
    }
  } else {
    for(let i=0;i<len;i++) d[i] = Math.random()*2-1;
  }
  V._noise[key] = b;
  return b;
};

/* ---------- HAPTICS ---------- */
V.buzz = function(pattern){
  if(!V.settings.haptics) return;
  try{ if(navigator.vibrate) navigator.vibrate(pattern); }catch(e){}
};

/* ---------- THE SITE UPSTAIRS ---------- */
V.pauseSite = function(){
  try{ gameActive = true; }catch(e){}
  try{ Render.stop(render); Runner.stop(matterRunner); }catch(e){}
  try{ audio.pause(); }catch(e){}
  try{ document.body.style.transform = 'none'; }catch(e){}
  document.documentElement.classList.add('vendor-open');
};
V.resumeSite = function(){
  document.documentElement.classList.remove('vendor-open');
  try{ Render.run(render); Runner.run(matterRunner, engine); }catch(e){}
  try{ gameActive = false; }catch(e){}
  V.updateBox();
};

/* the grey box changes with how things stand down there */
let boxGlitchTimer = null;
V.updateBox = function(){
  const box = document.getElementById('vendorBox');
  if(!box) return;
  const m = V.loadMem();
  box.classList.remove('vb-together','vb-unplugged','vb-close');
  if(m.unplugged){ box.textContent = 'unplugged'; box.classList.add('vb-unplugged'); }
  else if(m.relationship === 'together'){ box.textContent = 'visit'; box.classList.add('vb-together'); }
  else { box.textContent = 'click me'; if(m.deaths >= 4) box.classList.add('vb-close'); }
  clearInterval(boxGlitchTimer);
  /* after a few deaths the label sometimes says something else for a blink */
  if(!m.unplugged && m.relationship !== 'together' && m.deaths >= 2){
    const alt = m.deaths >= 6 ? ['one more','come back','one more']
              : m.deaths >= 4 ? ['come back','again','come back']
              : ['again','click me'];
    boxGlitchTimer = setInterval(()=>{
      if(document.hidden) return;
      try{ if(gameActive) return; }catch(e){}
      if(Math.random() > 0.35) return;
      const prev = box.textContent;
      box.textContent = alt[(Math.random()*alt.length)|0];
      setTimeout(()=>{ box.textContent = prev; }, 140 + Math.random()*120);
    }, 9000);
  }
};

/* things that happen upstairs that it hears about */
V.noteRouletteDeath = function(){ V.patch(m=>{ m.rouletteDeaths++; }); };
V.noteGuyKill = function(){ V.patch(m=>{ m.guyKills++; }); };
V.noteRelay = function(){ V.patch(m=>{ m.relayVisits++; }); };
V.noteFridges = function(n){ V.patch(m=>{ m.fridgesSpawned = Math.max(m.fridgesSpawned, n|0); }); };

/* ---------- ROUTER ----------
   the grey box calls this. where it sends you depends on what
   you are to it. */
window.startHorrorGame = function(){
  try{ if(gameActive) return; }catch(e){}
  const m = V.loadMem();
  try{ if(typeof fridgesOwned === 'number') V.noteFridges(fridgesOwned); }catch(e){}
  if(m.unplugged && V.startUnplugged) return V.startUnplugged();
  if(m.relationship === 'together' && V.startCheckin) return V.startCheckin();
  if(V.startBasement) return V.startBasement({});
};

/* ---------- DEBUG ----------
   ?vendor=reset        wipe its memory
   ?vendor=deaths6      set the death count (any number)
   ?vendor=together     skip to the check-in room
   ?vendor=unplug       the dark room
   ?vendor=debug        fps counter, [m] map, [g] it can't catch you
   flags combine: ?vendor=reset,deaths6,debug                      */
(function(){
  let q = '';
  try{ q = new URLSearchParams(location.search).get('vendor') || ''; }catch(e){}
  if(!q) return;
  q.split(',').forEach(raw=>{
    const f = raw.trim().toLowerCase();
    if(f === 'reset'){ try{ localStorage.removeItem(MEM_KEY); }catch(e){} }
    else if(f.indexOf('deaths') === 0){ const n = parseInt(f.slice(6),10)||0; V.patch(m=>{ m.deaths = n; }); }
    else if(f === 'together'){ V.patch(m=>{ m.relationship='together'; m.dateRoute='together'; m.unplugged=false; if(m.deaths<7) m.deaths=7; }); }
    else if(f === 'unplug'){ V.patch(m=>{ m.unplugged=true; }); }
    else if(f === 'debug'){ V.debug = true; }
  });
  V.mem = V.loadMem();
})();
window.vendorDebug = {
  mem: ()=>V.loadMem(),
  reset: ()=>{ try{ localStorage.removeItem(MEM_KEY); }catch(e){} V.mem = V.loadMem(); V.updateBox(); return 'wiped'; },
  deaths: (n)=>{ V.patch(m=>{ m.deaths = n|0; }); V.updateBox(); return n; },
  together: ()=>{ V.patch(m=>{ m.relationship='together'; m.dateRoute='together'; m.unplugged=false; }); V.updateBox(); return 'together'; },
  stranger: ()=>{ V.patch(m=>{ m.relationship='stranger'; m.dateRoute=null; m.unplugged=false; }); V.updateBox(); return 'stranger'; },
  on: ()=>{ V.debug = true; return 'debug on'; }
};

document.addEventListener('DOMContentLoaded', ()=>V.updateBox());
if(document.readyState !== 'loading') setTimeout(()=>V.updateBox(), 0);

})();
