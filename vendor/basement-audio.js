/* ============================================================
   THE VENDOR — the basement's mixer
   every sound here comes out of the rendered bank (sound-bank.js).
   this file only routes it:
     world   things in the room. 3d positioned, through the reverb,
             muffled when you're hiding
     beds    one ambient bed per kind of room, crossfaded as you walk
     music   seven stems that all loop at 9.6s, started together,
             faded in and out by what's happening
     close   things inside your own head: heart, breath, static, stingers
============================================================ */
(function(){
'use strict';
const V = window.VENDOR;
const B = V.B;
const SND = V.SND;
const A = B.A = {};

let c = null, out = null, gameIn = null, muffle = null, dry = null, wet = null, conv = null, close = null, music = null, beds = null;
let started = false;
const L = {};                       // running loops
const fridgeLoops = [];
let radio = null, scareH = null;
let nextHeart = 0, nextBreath = 0, breathIn = true, nextAmb = 0, nextKick = 0;
const BED_FOR_ZONE = { 1:'bed_base', 2:'bed_pipes', 3:'bed_boiler', 4:'bed_laundry', 5:'bed_base', 6:'bed_crawl', 7:'bed_wet', 8:'bed_office', 9:'bed_base', 10:'bed_cold', 11:'bed_cold' };
const BEDS = ['bed_base','bed_pipes','bed_boiler','bed_laundry','bed_crawl','bed_wet','bed_office','bed_cold'];
const STEMS = ['mus_boom','mus_boom_fast','mus_drone','mus_tick','mus_pulse','mus_screech','mus_siren'];
const SURF = { 1:'step_concrete', 2:'step_tile', 3:'step_water', 4:'step_wood', 5:'step_grate', 6:'step_polished' };

function gain(v){ const g = c.createGain(); g.gain.value = v; return g; }
function now(){ return c ? c.currentTime : 0; }
function tgt(param, v, tau){ try{ param.setTargetAtTime(Math.max(0.0001, v), now(), tau); }catch(e){} }

A.ready = ()=>started;
A.ctx = ()=>c;

/* ---------- start / stop ---------- */
A.start = function(){
  const bus = V.bus(); if(!bus) return false;
  c = bus.ctx;
  if(started) A.stop(true);
  out = gain(1); out.connect(bus.master);
  muffle = c.createBiquadFilter(); muffle.type = 'lowpass'; muffle.frequency.value = 20000; muffle.Q.value = 0.7; muffle.connect(out);
  close = gain(1); close.connect(out);
  music = gain(0.85); music.connect(out);
  beds = gain(1); beds.connect(muffle);
  gameIn = gain(1);
  dry = gain(0.85); wet = gain(0.38);
  conv = c.createConvolver();
  const ir0 = SND.buffer('ir_basement', 0);
  let ir = null;
  if(ir0){
    /* a convolver wants its impulse at the context's own rate */
    const ratio = c.sampleRate/ir0.sampleRate, n = Math.floor(ir0.length*ratio);
    ir = c.createBuffer(ir0.numberOfChannels, n, c.sampleRate);
    for(let ch=0; ch<ir0.numberOfChannels; ch++){
      const src = ir0.getChannelData(ch), dst = ir.getChannelData(ch);
      for(let i=0;i<n;i++){ const p = i/ratio, j = p|0, u = p-j; dst[i] = src[j]*(1-u) + (src[j+1]||0)*u; }
    }
  }
  if(ir) conv.buffer = ir;
  else {
    const n = (c.sampleRate*1.8)|0, b = c.createBuffer(2, n, c.sampleRate);
    for(let ch=0; ch<2; ch++){ const d = b.getChannelData(ch); for(let i=0;i<n;i++) d[i] = (Math.random()*2-1)*Math.pow(1-i/n, 3); }
    conv.buffer = b;
  }
  gameIn.connect(dry); dry.connect(muffle);
  gameIn.connect(conv); conv.connect(wet); wet.connect(muffle);

  /* beds: all running, only the room you're in is up */
  BEDS.forEach(n=>{ L[n] = SND.play(n, { loop:true, gain:0.0001, dest:beds }); });
  /* music: started on the same tick so the stems stay locked together */
  const t0 = c.currentTime + 0.15;
  STEMS.forEach(n=>{ L[n] = SND.play(n, { loop:true, gain:0.0001, dest:music, at:t0 }); });
  /* its hum: calm and raging versions on the same spot, crossfaded */
  L.hum = SND.play('ven_hum', { loop:true, gain:0.0001, x:20, y:20, hrtf:true, dest:gameIn, ref:1.6 });
  L.rage = SND.play('ven_hum_rage', { loop:true, gain:0.0001, x:20, y:20, hrtf:true, dest:gameIn, ref:1.6 });
  L.static = SND.play('static', { loop:true, gain:0.0001, dest:close });
  L.tube = SND.play('tube_buzz', { loop:true, gain:0.0001, x:0, y:0, dest:gameIn, ref:1 });
  nextHeart = nextBreath = now() + 1; nextAmb = now() + 4; nextKick = now() + 7;
  started = true;
  A.frozen = false;
  return true;
};
A.stop = function(quick){
  if(!c || !started) return;
  started = false;
  const t = now(), o = out;
  try{ o.gain.setTargetAtTime(0.0001, t, quick ? 0.02 : 0.15); }catch(e){}
  const all = Object.keys(L).map(k=>L[k]).concat(fridgeLoops.map(f=>f.h));
  if(radio){ all.push(radio); radio = null; }
  setTimeout(()=>{ all.forEach(h=>{ if(h) h.stop(0.02); }); try{ o.disconnect(); }catch(e){} }, quick ? 80 : 700);
  Object.keys(L).forEach(k=>delete L[k]);
  fridgeLoops.length = 0;
};
A.silence = function(){
  /* the seventh: everything but the hum stops dead */
  if(!c || !started) return;
  STEMS.forEach(n=>{ if(L[n]){ L[n].g.gain.cancelScheduledValues(now()); L[n].g.gain.setValueAtTime(0.0001, now()); } });
  if(L.static){ L.static.g.gain.cancelScheduledValues(now()); L.static.g.gain.setValueAtTime(0.0001, now()); }
  A.frozen = true;
};

/* ---------- fridges with tags on: each one hums ---------- */
A.setFridges = function(list){
  fridgeLoops.forEach(f=>f.h && f.h.stop(0.1));
  fridgeLoops.length = 0;
  if(!started) return;
  list.forEach(fr=>{
    const h = SND.play('fridge_hum', { loop:true, gain:0.0001, x:fr.x, y:fr.y, dest:gameIn, rate:0.97 + Math.random()*0.06, offset:Math.random()*5 });
    if(h) h.gain(0.32, 1.5);
    fridgeLoops.push({ fr, h });
  });
};
A.killFridge = function(fr){
  const f = fridgeLoops.find(x=>x.fr === fr); if(!f || !f.h) return;
  /* the motor winds down when the tag comes off */
  f.h.rate(0.25, 0.5); f.h.gain(0.0001, 0.45);
  setTimeout(()=>f.h.stop(0.1), 2000);
};

/* ---------- per frame ---------- */
function listener(x, y, dx, dy){
  const Ls = c.listener;
  if(Ls.positionX){
    Ls.positionX.value = x; Ls.positionY.value = 0; Ls.positionZ.value = y;
    Ls.forwardX.value = dx; Ls.forwardY.value = 0; Ls.forwardZ.value = dy;
    Ls.upX.value = 0; Ls.upY.value = 1; Ls.upZ.value = 0;
  } else { Ls.setPosition(x,0,y); Ls.setOrientation(dx,0,dy,0,1,0); }
}
A.update = function(s){
  if(!c || !started) return;
  const t = now();
  listener(s.px, s.py, s.dx, s.dy);
  tgt(muffle.frequency, s.hidden ? 480 : 20000, 0.12);

  /* rooms */
  const want = BED_FOR_ZONE[s.zone] || 'bed_base';
  BEDS.forEach(n=>{ if(L[n]) L[n].gain(n === want ? (s.escape ? 0.25 : 0.55) : 0.0001, 1.6); });

  /* it */
  const v = s.ven;
  let vol = 0.0001;
  if(v.active) vol = 0.9; else if(v.ghost > 0.05) vol = 0.6*v.ghost;
  if(A.frozen) vol = 0.25;
  const rage = A.frozen ? 0 : v.rage;
  if(L.hum){ L.hum.pos(v.x, v.y); L.hum.gain(vol*(1 - rage*0.85), 0.2); L.hum.occ(v.occ); L.hum.rate(A.frozen ? 0.9 : 1, 0.5); }
  if(L.rage){ L.rage.pos(v.x, v.y); L.rage.gain(vol*rage, 0.2); L.rage.occ(v.occ); }
  if(v.active && t > nextKick){ nextKick = t + 6 + Math.random()*9; SND.play('ven_kick', { x:v.x, y:v.y, hrtf:true, occ:v.occ, dest:gameIn, gain:0.7 }); }
  fridgeLoops.forEach(f=>{ if(f.h) f.h.occ(f.fr.occ); });

  /* tubes */
  if(L.tube){
    if(s.tube){ L.tube.pos(s.tube.x, s.tube.y); L.tube.gain(0.35*s.tube.amt, 0.1); }
    else L.tube.gain(0.0001, 0.2);
  }

  /* static: from staring */
  if(L.static) L.static.gain(A.frozen ? 0.0001 : Math.min(0.75, s.exposure*0.8 + (s.fear > 0.85 ? 0.04 : 0)), 0.05);

  /* music, by what's happening */
  if(!A.frozen){
    const f = s.found;
    const m = {
      mus_drone:     f >= 2 ? 0.55 + (f >= 4 ? 0.2 : 0) : (v.ghost > 0.3 ? 0.25 : 0.0001),
      mus_boom:      f >= 1 && f < 4 && !s.escape ? 0.8 : 0.0001,
      mus_boom_fast: f >= 4 || s.escape ? 0.85 : 0.0001,
      mus_tick:      f >= 3 ? 0.55 : 0.0001,
      mus_pulse:     f >= 5 || s.escape ? 0.6 : 0.0001,
      mus_screech:   Math.max(s.exposure > 0.2 ? s.exposure*0.9 : 0, f >= 5 ? 0.25 : 0) || 0.0001,
      mus_siren:     s.escape ? 0.4 : 0.0001
    };
    for(const k in m) if(L[k]) L[k].gain(m[k], k === 'mus_screech' ? 0.3 : 1.4);
  }

  /* your heart and your breath */
  const fear = s.fear;
  if(fear > 0.22 && t > nextHeart){
    nextHeart = t + 60/(62 + fear*98);
    SND.play('heart', { dest:close, gain:0.25 + fear*0.6, jitter:0.02 });
    if(fear > 0.75) V.buzz(18);
  }
  const winded = 1 - s.stamina, push = Math.max(winded, fear);
  if((winded > 0.3 || fear > 0.5 || s.hidden) && t > nextBreath){
    const shaky = fear > 0.6 || s.hidden;
    const b = SND.play(breathIn ? 'breath_in' : 'breath_out', { dest:close, gain:0.18 + push*0.4 + (s.hidden ? 0.12 : 0), variant: (shaky ? 3 : 0) + ((Math.random()*3)|0), rate: 1 + push*0.25 });
    const dur = b && b.src.buffer ? b.src.buffer.duration/(1 + push*0.25) : 0.8;
    nextBreath = t + dur + (breathIn ? 0.05 : Math.max(0.15, 1.2 - push*1.0));
    breathIn = !breathIn;
  }

  /* the building, doing building things */
  if(t > nextAmb){
    nextAmb = t + 3 + Math.random()*7;
    const r = Math.random();
    const ax = s.px + (Math.random()-0.5)*18, ay = s.py + (Math.random()-0.5)*18;
    if(r < 0.32) SND.play('drip', { x:ax, y:ay, dest:gameIn, gain:0.5, jitter:0.08 });
    else if(r < 0.55) SND.play('knock', { x:ax, y:ay, dest:gameIn, gain:0.45, jitter:0.05 });
    else if(r < 0.7) SND.play('slam_far', { dest:beds, gain:0.35, jitter:0.04 });
    else if(r < 0.8 && s.found >= 2) SND.play('steps_far', { dest:beds, gain:0.5 });
    else if(r < 0.86 && v.active) SND.play('ven_drag', { x:v.x + (Math.random()-0.5)*4, y:v.y + (Math.random()-0.5)*4, dest:gameIn, gain:0.45, hrtf:true, occ:true });
    else SND.play('creak', { x:ax, y:ay, dest:gameIn, gain:0.4, jitter:0.06 });
  }
};

/* ---------- one-shots the game calls ---------- */
A.step = function(surface, sprint){
  if(!started) return;
  SND.play(SURF[surface] || 'step_concrete', { dest:gameIn, gain: sprint ? 0.85 : 0.55, jitter:0.06, rate: sprint ? 1.05 : 1 });
};
A.stepAt = function(surface, x, y){
  if(!started) return;
  SND.play(SURF[surface] || 'step_concrete', { x, y, dest:gameIn, gain:0.7, jitter:0.05, hrtf:true });
};
A.moveFridge = function(fr){
  const f = fridgeLoops.find(x=>x.fr === fr); if(f && f.h) f.h.pos(fr.x, fr.y);
};
A.venStep = function(x, y, occ, heavy){
  if(!started) return;
  SND.play('ven_step', { x, y, occ, hrtf:true, dest:gameIn, gain: heavy ? 1 : 0.8, jitter:0.05, ref:1.6 });
};
A.pop = (x, y)=>started && SND.play('bulb_pop', { x, y, dest:gameIn, gain:0.8, jitter:0.05 });
A.zap = (x, y)=>started && SND.play('tube_zap', { x, y, dest:gameIn, gain:0.45, jitter:0.1 });
A.lightsOut = ()=>started && SND.play('power_down', { dest:gameIn, gain:0.8 });
A.click = (on)=>started && SND.play(on ? 'flash_on' : 'flash_off', { dest:close, gain:0.7 });
A.rattle = ()=>started && SND.play('rattle', { dest:close, gain:0.8, jitter:0.04 });
A.tag = ()=>started && SND.play('tag_take', { dest:close, gain:0.9 });
A.stinger = function(){ if(!started) return; SND.play('stinger', { dest:close, gain:0.9 }); V.buzz(45); };
A.scare = function(){
  const bus = V.bus(); if(!bus) return;
  scareH = SND.play('scare', { dest: started ? close : bus.master, gain:1 });
  V.buzz([120, 40, 200]);
};
A.cutScare = function(){
  /* the seventh: the scream stops halfway, leaving the ringing */
  if(scareH) scareH.stop(0.02);
  SND.play('tinnitus', { gain:0.35 });
};
A.lockRattle = (x, y)=>started && SND.play('lock_rattle', { x, y, dest:gameIn, gain:0.8 });
A.unlock = (x, y)=>started && SND.play('unlock', { x, y, dest:gameIn, gain:1, ref:3 });
A.doorOpen = ()=>started && SND.play('door_open', { dest:close, gain:0.9 });
A.scratch = (dest)=>SND.play('scratch', { dest: dest || undefined, gain:0.6, jitter:0.04 });
A.gulp = ()=>started && SND.play('gulp', { dest:close, gain:0.8 });
A.hideDoor = function(open, kind){
  if(!started) return;
  if(kind === 'l') SND.play('hide_locker', { dest:close, gain:0.8, jitter:0.05 });
  else SND.play(open ? 'hide_fridge_out' : 'hide_fridge_in', { dest:close, gain:0.85 });
};
A.magnet = ()=>started && SND.play('magnet', { dest:close, gain:0.7 });
A.ui = (name)=>SND.play(name || 'ui_click', { gain:0.6 });
/* anything else, placed in the room */
A.at = function(name, x, y, o){
  if(!started) return null;
  o = o || {};
  return SND.play(name, Object.assign({ x, y, dest:gameIn, gain:0.8 }, o));
};
A.flat = function(name, o){ if(!started) return null; return SND.play(name, Object.assign({ dest:beds, gain:0.6 }, o || {})); };
A.near = function(name, o){ if(!started) return null; return SND.play(name, Object.assign({ dest:close, gain:0.7 }, o || {})); };

/* ---------- easter eggs ---------- */
A.tape = function(x, y){
  if(!started) return 0;
  const h = SND.play('tape_ic', { x, y, dest:gameIn, gain:1, ref:2.5 });
  if(!h){ SND.need('tape_ic'); return 0; }
  return h.src.buffer.duration;
};
A.radio = function(x, y, on, station){
  if(radio){ radio.stop(0.2); radio = null; }
  if(!on || !started) return;
  radio = SND.play(station === 2 ? 'radio_signal' : 'radio_cp', { x, y, loop:true, dest:gameIn, gain:0.7, ref:1.5 });
  if(!radio) SND.need(station === 2 ? 'radio_signal' : 'radio_cp');
};
})();
