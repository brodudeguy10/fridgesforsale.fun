/* ============================================================
   THE VENDOR — sound
   all of it is synthesised. 3d positioned with HRTF for the
   thing itself, so it comes from the side it is actually on.
   walls muffle it. the music is layers that come in one at a
   time as you take tags, the way the old forest game did it.
============================================================ */
(function(){
'use strict';
const V = window.VENDOR;
const B = V.B;

const A = B.A = {};
let c = null, out = null, gameIn = null, muffle = null, dry = null, wet = null, conv = null, close = null;
let started = false;
const layers = {};
let hum = null, statics = null, tube = null, radio = null;
const fridgeHums = [];
let nextBoom = 0, nextTick = 0, nextPulse = 0, nextHeart = 0, nextBreath = 0, nextAmb = 0, nextHumClick = 0, nextSiren = 0;

function now(){ return c ? c.currentTime : 0; }
function setPos(p, x, y){
  if(p.positionX){ p.positionX.value = x; p.positionY.value = 0; p.positionZ.value = y; }
  else p.setPosition(x, 0, y);
}
function panned(x, y, hrtf, dest){
  const p = c.createPanner();
  p.panningModel = hrtf ? 'HRTF' : 'equalpower';
  p.distanceModel = 'inverse'; p.refDistance = 1.3; p.maxDistance = 60; p.rolloffFactor = 1.25;
  setPos(p, x, y);
  const f = c.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 16000; f.Q.value = 0.5;
  f.connect(p); p.connect(dest || gameIn);
  return { in:f, p, f };
}
function env(g, t, a, peak, d, floor){
  g.gain.cancelScheduledValues(t);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.linearRampToValueAtTime(peak, t + a);
  g.gain.exponentialRampToValueAtTime(floor || 0.0001, t + a + d);
}
function noiseSrc(kind, loop){
  const s = c.createBufferSource();
  s.buffer = V.noiseBuffer(kind==='brown'||kind==='pink' ? 4 : 2, kind || 'white');
  s.loop = !!loop;
  return s;
}
function osc(type, f){ const o = c.createOscillator(); o.type = type; o.frequency.value = f; return o; }
function gain(v){ const g = c.createGain(); g.gain.value = v; return g; }
function filt(type, f, q){ const b = c.createBiquadFilter(); b.type = type; b.frequency.value = f; if(q!==undefined) b.Q.value = q; return b; }
function shaper(amount){
  const ws = c.createWaveShaper(); const n = 1024, curve = new Float32Array(n);
  for(let i=0;i<n;i++){ const x = i*2/n - 1; curve[i] = Math.tanh(x*amount); }
  ws.curve = curve; return ws;
}
function impulse(seconds, decay){
  const rate = c.sampleRate, len = (rate*seconds)|0;
  const buf = c.createBuffer(2, len, rate);
  for(let ch=0; ch<2; ch++){
    const d = buf.getChannelData(ch);
    for(let i=0;i<len;i++){
      const t = i/rate;
      let v = (Math.random()*2-1) * Math.pow(1 - i/len, decay);
      /* a few hard early reflections off concrete */
      if(i === ((0.011+ch*0.004)*rate|0) || i === ((0.029+ch*0.006)*rate|0) || i === ((0.047)*rate|0)) v += 0.6;
      d[i] = v * (t < 0.002 ? t/0.002 : 1);
    }
  }
  return buf;
}

/* ---------- START / STOP ---------- */
A.start = function(){
  const bus = V.bus(); if(!bus) return false;
  c = bus.ctx;
  if(started) A.stop();
  out = gain(1); out.connect(bus.master);
  muffle = filt('lowpass', 20000, 0.7); muffle.connect(out);
  close = gain(1); close.connect(out);          // things that are in your own head: never muffled
  gameIn = gain(1);
  dry = gain(0.82); wet = gain(0.32);
  conv = c.createConvolver(); conv.buffer = impulse(2.4, 2.6);
  gameIn.connect(dry); dry.connect(muffle);
  gameIn.connect(conv); conv.connect(wet); wet.connect(muffle);

  /* room tone and a drone you stop hearing after a minute */
  const rt = noiseSrc('brown', true), rtf = filt('lowpass', 380, 0.4), rtg = gain(0.18);
  rt.connect(rtf); rtf.connect(rtg); rtg.connect(dry); rt.start();
  const d1 = osc('sine', 38), d2 = osc('sine', 38.55), dg = gain(0.05);
  d1.connect(dg); d2.connect(dg); dg.connect(dry); d1.start(); d2.start();
  layers.room = { nodes:[rt,d1,d2], g:rtg };

  /* music layers */
  function layer(name){ const g = gain(0.0001); g.connect(gameIn); layers[name] = { g, nodes:[] }; return layers[name]; }
  layer('boom'); layer('tick'); layer('pulse'); layer('siren');
  const pad = layer('pad');
  [55, 58.27, 82.4, 87.31].forEach((f,i)=>{
    const o = osc('sawtooth', f); o.detune.value = (i%2?7:-6);
    const lp = filt('lowpass', 260 + i*40, 2);
    const lfo = osc('sine', 0.07 + i*0.03), lg = gain(110);
    lfo.connect(lg); lg.connect(lp.frequency);
    const og = gain(0.11);
    o.connect(lp); lp.connect(og); og.connect(pad.g);
    o.start(); lfo.start(); pad.nodes.push(o, lfo);
  });

  /* the static you get from looking at it */
  const sn = noiseSrc('white', true), shp = filt('highpass', 1400, 0.6), sbp = filt('peaking', 4200, 1.2); sbp.gain.value = 6;
  const sg = gain(0.0001);
  sn.connect(shp); shp.connect(sbp); sbp.connect(sg); sg.connect(close); sn.start();
  statics = { g: sg, src: sn };

  /* its hum. positional, HRTF, occluded by walls */
  const hp = panned(20, 20, true);
  const hg = gain(0.0001);
  const trem = gain(1), tlfo = osc('sine', 5.3), tdepth = gain(0.28);
  tlfo.connect(tdepth); tdepth.connect(trem.gain); tlfo.start();
  const ws = shaper(2.5);
  const lp = filt('lowpass', 900, 1.1);
  const os = [osc('sawtooth', 55), osc('sawtooth', 55.8), osc('square', 82.6), osc('sine', 27.5)];
  const ogs = [0.3, 0.26, 0.09, 0.5];
  os.forEach((o,i)=>{ const g = gain(ogs[i]); o.connect(g); g.connect(ws); o.start(); });
  ws.connect(lp); lp.connect(trem); trem.connect(hg); hg.connect(hp.in);
  hum = { p: hp, g: hg, lp, os, tlfo, ws };

  /* fluorescent buzz, one emitter that hops to the nearest live tube */
  const tp = panned(0, 0, false);
  const tbo = osc('sawtooth', 120), tbb = filt('bandpass', 2300, 4), tbg = gain(0.0001);
  const tbo2 = osc('square', 60), tbg2 = gain(0.25);
  tbo.connect(tbb); tbo2.connect(tbg2); tbg2.connect(tbb); tbb.connect(tbg); tbg.connect(tp.in); tbo.start(); tbo2.start();
  tube = { p: tp, g: tbg, os:[tbo, tbo2] };

  nextBoom = nextTick = nextPulse = nextHeart = nextBreath = now() + 1;
  nextAmb = now() + 4; nextHumClick = now() + 6; nextSiren = now();
  started = true;
  A.frozen = false;
  return true;
};
A.stop = function(){
  if(!c || !started) return;
  started = false;
  const t = now();
  try{ out.gain.setTargetAtTime(0.0001, t, 0.15); }catch(e){}
  const kill = []
    .concat(layers.room ? layers.room.nodes : [])
    .concat(layers.pad ? layers.pad.nodes : [])
    .concat(hum ? hum.os.concat([hum.tlfo]) : [])
    .concat(statics ? [statics.src] : [])
    .concat(tube ? tube.os : [])
    .concat(fridgeHums.map(f=>f.o).reduce((a,b)=>a.concat(b), []));
  if(radio){ radio.stopAll(); radio = null; }
  const o = out;
  setTimeout(()=>{ kill.forEach(n=>{ try{ n.stop(); }catch(e){} }); try{ o.disconnect(); }catch(e){} }, 700);
  fridgeHums.length = 0;
  hum = null; statics = null; tube = null;
};
A.silence = function(sec){
  /* the freeze: everything but the hum cuts dead */
  if(!c || !started) return;
  const t = now();
  ['boom','tick','pulse','siren','pad'].forEach(k=>{ if(layers[k]) { layers[k].g.gain.cancelScheduledValues(t); layers[k].g.gain.setValueAtTime(0.0001, t); } });
  if(statics){ statics.g.gain.cancelScheduledValues(t); statics.g.gain.setValueAtTime(0.0001, t); }
  A.frozen = true;
};

/* ---------- FRIDGES ---------- */
A.setFridges = function(list){
  fridgeHums.forEach(f=>{ try{ f.o.forEach(o=>o.stop()); f.p.p.disconnect(); }catch(e){} });
  fridgeHums.length = 0;
  if(!c || !started) return;
  list.forEach(fr=>{
    const p = panned(fr.x, fr.y, false);
    const g = gain(0.0001);
    const o1 = osc('sine', 60 + Math.random()*1.5), o2 = osc('triangle', 120.4), o3 = osc('sine', 181);
    const g2 = gain(0.35), g3 = gain(0.12);
    o1.connect(g); o2.connect(g2); g2.connect(g); o3.connect(g3); g3.connect(g);
    g.connect(p.in); o1.start(); o2.start(); o3.start();
    g.gain.setTargetAtTime(0.06, now(), 1.5);
    fridgeHums.push({ fr, p, g, o:[o1,o2,o3] });
  });
};
A.killFridge = function(fr){
  const h = fridgeHums.find(f=>f.fr===fr); if(!h) return;
  const t = now();
  h.o.forEach(o=>{ try{ o.frequency.setTargetAtTime(o.frequency.value*0.4, t, 0.3); }catch(e){} });
  h.g.gain.setTargetAtTime(0.0001, t, 0.25);
  setTimeout(()=>{ h.o.forEach(o=>{ try{ o.stop(); }catch(e){} }); }, 1600);
};

/* ---------- LISTENER ---------- */
function listener(x, y, dx, dy){
  const L = c.listener;
  if(L.positionX){
    L.positionX.value = x; L.positionY.value = 0; L.positionZ.value = y;
    L.forwardX.value = dx; L.forwardY.value = 0; L.forwardZ.value = dy;
    L.upX.value = 0; L.upY.value = 1; L.upZ.value = 0;
  } else { L.setPosition(x,0,y); L.setOrientation(dx,0,dy,0,1,0); }
}

/* ---------- PER-FRAME ----------
   s = { px,py,dx,dy, ven:{x,y,active,ghost,rage,dist,occ}, fridges(occ flags),
         found, escape, exposure, fear, stamina, hidden, tube:{x,y,amt} } */
A.update = function(s){
  if(!c || !started) return;
  const t = now();
  listener(s.px, s.py, s.dx, s.dy);

  /* hiding: the world goes thick and far away */
  muffle.frequency.setTargetAtTime(s.hidden ? 520 : 20000, t, 0.12);

  /* hum */
  if(hum){
    const v = s.ven;
    setPos(hum.p.p, v.x, v.y);
    let vol = 0.0001;
    if(v.active) vol = 0.55;
    else if(v.ghost > 0.05) vol = 0.4*v.ghost;
    if(A.frozen) vol = 0.18;
    hum.g.gain.setTargetAtTime(vol, t, 0.15);
    hum.p.f.frequency.setTargetAtTime(v.occ ? 420 : 9000, t, 0.25);
    hum.lp.frequency.setTargetAtTime(600 + v.rage*1400, t, 0.4);
    hum.os[1].detune.setTargetAtTime(14 + v.rage*60, t, 0.5);
    hum.os[0].frequency.setTargetAtTime(A.frozen ? 49 : 55 + v.rage*3, t, 0.6);
    hum.tlfo.frequency.setTargetAtTime(5.3 + v.rage*4, t, 0.5);
    /* compressor cycling: a clunk and a shudder, like an old fridge kicking in */
    if(v.active && t > nextHumClick){
      nextHumClick = t + 5 + Math.random()*9;
      thunk(v.x, v.y, v.occ, 0.5);
    }
  }
  fridgeHums.forEach(h=>{ h.p.f.frequency.setTargetAtTime(h.fr.occ ? 300 : 6000, t, 0.3); });

  /* tube buzz */
  if(tube){
    if(s.tube){ setPos(tube.p.p, s.tube.x, s.tube.y); tube.g.gain.setTargetAtTime(0.05*s.tube.amt, t, 0.1); }
    else tube.g.gain.setTargetAtTime(0.0001, t, 0.2);
  }

  /* static */
  if(statics) statics.g.gain.setTargetAtTime(A.frozen ? 0.0001 : Math.min(0.55, s.exposure*0.55 + (s.fear>0.85?0.05:0)), t, 0.05);

  /* music layers, by how many tags are gone */
  if(!A.frozen){
    const f = s.found;
    const tgt = {
      pad:   f>=2 ? 0.55 + (f>=4?0.25:0) : (s.ven.ghost>0.3 ? 0.15 : 0.0001),
      boom:  f>=1 ? 0.9 : 0.0001,
      tick:  f>=3 ? 0.6 : 0.0001,
      pulse: f>=5 || s.escape ? 0.55 : 0.0001,
      siren: s.escape ? 0.35 : 0.0001
    };
    for(const k in tgt) if(layers[k]) layers[k].g.gain.setTargetAtTime(tgt[k], t, 1.2);
    /* boom: a slow drum, almost a heartbeat */
    const boomGap = s.escape ? 1.1 : (2.4 - Math.min(1.1, f*0.18));
    if(t > nextBoom){ nextBoom = t + boomGap; boomHit(layers.boom.g, t + 0.02); }
    if(t > nextTick){ nextTick = t + 0.25 + Math.random()*(1.6 - Math.min(1, f*0.15)); tickHit(layers.tick.g, t + 0.02); }
    if(t > nextPulse){ nextPulse = t + (s.escape ? 0.19 : 0.215); pulseHit(layers.pulse.g, t + 0.02); }
    if(s.escape && t > nextSiren){ nextSiren = t + 2.6; sirenHit(layers.siren.g, t + 0.02); }
  }

  /* your own heart, your own breath */
  const fear = s.fear;
  if(fear > 0.22 && t > nextHeart){
    const bpm = 64 + fear*96;
    nextHeart = t + 60/bpm;
    heart(t + 0.02, 0.18 + fear*0.5);
    if(fear > 0.75) V.buzz(18);
  }
  const winded = 1 - s.stamina;
  if((winded > 0.35 || fear > 0.55 || s.hidden) && t > nextBreath){
    const rate = 0.5 + Math.max(winded, fear)*1.4;
    nextBreath = t + 2.6/rate;
    breath(t + 0.02, 0.05 + Math.max(winded, fear)*0.12 + (s.hidden ? 0.06 : 0), 1.1/rate);
  }

  /* the building */
  if(t > nextAmb){
    nextAmb = t + 3 + Math.random()*7;
    const r = Math.random();
    const ax = s.px + (Math.random()-0.5)*18, ay = s.py + (Math.random()-0.5)*18;
    if(r < 0.35) drip(ax, ay);
    else if(r < 0.6) knock(ax, ay);
    else if(r < 0.72) distantSlam();
    else if(r < 0.82 && s.found >= 2) farSteps();
    else creak(ax, ay);
  }
};

/* ---------- MUSIC HITS ---------- */
function boomHit(dest, t){
  const o = osc('sine', 62); o.frequency.setValueAtTime(62, t); o.frequency.exponentialRampToValueAtTime(30, t+0.5);
  const g = gain(0.0001); env(g, t, 0.01, 0.9, 0.9);
  const n = noiseSrc('brown'), nf = filt('lowpass', 180), ng = gain(0.0001); env(ng, t, 0.005, 0.6, 0.25);
  o.connect(g); g.connect(dest); n.connect(nf); nf.connect(ng); ng.connect(dest);
  o.start(t); o.stop(t+1.2); n.start(t); n.stop(t+0.4);
}
function tickHit(dest, t){
  const n = noiseSrc('white'), bp = filt('bandpass', 2600 + Math.random()*3000, 18), g = gain(0.0001);
  env(g, t, 0.002, 0.5, 0.18);
  n.connect(bp); bp.connect(g); g.connect(dest); n.start(t); n.stop(t+0.25);
  if(Math.random() < 0.18){
    /* a reversed swell, like something breathing in */
    const s = noiseSrc('pink'), sf = filt('bandpass', 700, 1.5), sg = gain(0.0001);
    sg.gain.setValueAtTime(0.0001, t); sg.gain.exponentialRampToValueAtTime(0.5, t+1.4); sg.gain.setValueAtTime(0.0001, t+1.42);
    s.connect(sf); sf.connect(sg); sg.connect(dest); s.start(t); s.stop(t+1.5);
  }
}
function pulseHit(dest, t){
  const o = osc('square', 41.2), lp = filt('lowpass', 220, 4), g = gain(0.0001);
  env(g, t, 0.004, 0.45, 0.12);
  o.connect(lp); lp.connect(g); g.connect(dest); o.start(t); o.stop(t+0.2);
}
function sirenHit(dest, t){
  [440, 622.25].forEach((f,i)=>{
    const o = osc('triangle', f); o.frequency.setValueAtTime(f, t); o.frequency.linearRampToValueAtTime(f*0.94, t+1.2);
    const g = gain(0.0001); env(g, t + i*1.25, 0.2, 0.18, 1.1);
    o.connect(g); g.connect(dest); o.start(t); o.stop(t+2.6);
  });
}
function heart(t, v){
  [0, 0.17].forEach((off,i)=>{
    const o = osc('sine', i?52:66); o.frequency.setValueAtTime(i?52:66, t+off); o.frequency.exponentialRampToValueAtTime(24, t+off+0.18);
    const g = gain(0.0001); env(g, t+off, 0.012, v*(i?0.7:1), 0.2);
    o.connect(g); g.connect(close); o.start(t+off); o.stop(t+off+0.3);
  });
}
function breath(t, v, len){
  [0, len*1.05].forEach((off,i)=>{
    const n = noiseSrc('pink'), bp = filt('bandpass', i ? 620 : 1050, 0.9), g = gain(0.0001);
    g.gain.setValueAtTime(0.0001, t+off);
    g.gain.linearRampToValueAtTime(v*(i?1:0.8), t+off+len*0.4);
    g.gain.exponentialRampToValueAtTime(0.0001, t+off+len);
    n.connect(bp); bp.connect(g); g.connect(close); n.start(t+off); n.stop(t+off+len+0.05);
  });
}

/* ---------- WORLD ONE-SHOTS ---------- */
function drip(x,y){
  const p = panned(x,y,false), t = now()+0.01;
  const o = osc('sine', 1400 + Math.random()*900); o.frequency.setValueAtTime(o.frequency.value, t); o.frequency.exponentialRampToValueAtTime(o.frequency.value*1.8, t+0.06);
  const g = gain(0.0001); env(g, t, 0.002, 0.25, 0.09);
  o.connect(g); g.connect(p.in); o.start(t); o.stop(t+0.12);
}
function knock(x,y){
  const p = panned(x,y,false), t = now()+0.01;
  const n = 1 + (Math.random()*3|0);
  for(let i=0;i<n;i++){
    const tt = t + i*(0.14 + Math.random()*0.2);
    [220, 341, 563, 911].forEach((f,k)=>{ const o = osc('sine', f*(0.9+Math.random()*0.2)); const g = gain(0.0001); env(g, tt, 0.002, 0.18/(k+1), 0.5 - k*0.08); o.connect(g); g.connect(p.in); o.start(tt); o.stop(tt+0.6); });
  }
}
function creak(x,y){
  const p = panned(x,y,false), t = now()+0.01;
  const o = osc('sawtooth', 90), bp = filt('bandpass', 700, 6), g = gain(0.0001);
  o.frequency.setValueAtTime(80, t); o.frequency.linearRampToValueAtTime(110 + Math.random()*40, t+0.9);
  const lfo = osc('square', 23), lg = gain(30); lfo.connect(lg); lg.connect(o.frequency);
  g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.09, t+0.3); g.gain.exponentialRampToValueAtTime(0.0001, t+1.0);
  o.connect(bp); bp.connect(g); g.connect(p.in); o.start(t); lfo.start(t); o.stop(t+1.05); lfo.stop(t+1.05);
}
function distantSlam(){
  const t = now()+0.01;
  const o = osc('sine', 70); o.frequency.setValueAtTime(70, t); o.frequency.exponentialRampToValueAtTime(32, t+0.4);
  const g = gain(0.0001); env(g, t, 0.005, 0.22, 0.6);
  const n = noiseSrc('brown'), nf = filt('lowpass', 300), ng = gain(0.0001); env(ng, t, 0.003, 0.35, 0.3);
  const lp = filt('lowpass', 500);
  o.connect(g); g.connect(lp); n.connect(nf); nf.connect(ng); ng.connect(lp); lp.connect(gameIn);
  o.start(t); o.stop(t+0.8); n.start(t); n.stop(t+0.5);
}
function farSteps(){
  const t = now()+0.05;
  for(let i=0;i<4;i++){
    const tt = t + i*0.55 + (i%2)*0.08;
    const o = osc('sine', 55); o.frequency.setValueAtTime(55, tt); o.frequency.exponentialRampToValueAtTime(28, tt+0.15);
    const g = gain(0.0001); env(g, tt, 0.004, 0.12, 0.2);
    const lp = filt('lowpass', 260);
    o.connect(g); g.connect(lp); lp.connect(gameIn); o.start(tt); o.stop(tt+0.3);
  }
}
function thunk(x, y, occ, v){
  const p = panned(x, y, true), t = now()+0.01;
  if(occ) p.f.frequency.value = 450;
  const o = osc('square', 48), lp = filt('lowpass', 300), g = gain(0.0001); env(g, t, 0.003, v*0.5, 0.25);
  o.connect(lp); lp.connect(g); g.connect(p.in); o.start(t); o.stop(t+0.35);
  [310, 487].forEach((f,i)=>{ const oo = osc('sine', f), gg = gain(0.0001); env(gg, t+0.04, 0.002, v*0.12/(i+1), 0.35); oo.connect(gg); gg.connect(p.in); oo.start(t); oo.stop(t+0.5); });
}

/* footsteps by surface */
A.step = function(surface, sprint){
  if(!c || !started) return;
  const t = now()+0.005;
  const v = sprint ? 1.25 : 0.85;
  const n = noiseSrc('white'), g = gain(0.0001);
  let f;
  switch(surface){
    case 2: case 6: f = filt('bandpass', 2100, 1.2); env(g, t, 0.002, 0.13*v, 0.06);
      { const o = osc('sine', 1700 + Math.random()*300), og = gain(0.0001); env(og, t, 0.001, 0.025*v, 0.05); o.connect(og); og.connect(gameIn); o.start(t); o.stop(t+0.08); }
      break;
    case 3: f = filt('bandpass', 500, 1.5); f.frequency.setValueAtTime(380, t); f.frequency.exponentialRampToValueAtTime(1800, t+0.12); env(g, t, 0.01, 0.2*v, 0.16); break;
    case 4: f = filt('lowpass', 520, 1); env(g, t, 0.002, 0.2*v, 0.08);
      { const o = osc('sine', 150 + Math.random()*30), og = gain(0.0001); env(og, t, 0.002, 0.06*v, 0.07); o.connect(og); og.connect(gameIn); o.start(t); o.stop(t+0.1); }
      break;
    case 5: f = filt('bandpass', 1500, 2); env(g, t, 0.001, 0.1*v, 0.05);
      [840, 1390, 2230].forEach((ff,i)=>{ const o = osc('sine', ff*(0.95+Math.random()*0.1)), og = gain(0.0001); env(og, t, 0.001, 0.035*v/(i+1), 0.18); o.connect(og); og.connect(gameIn); o.start(t); o.stop(t+0.22); });
      break;
    default: f = filt('lowpass', 650, 0.8); env(g, t, 0.002, 0.2*v, 0.07);
  }
  n.connect(f); f.connect(g); g.connect(gameIn); n.start(t); n.stop(t+0.2);
};
A.venStep = function(x, y, occ, heavy){
  if(!c || !started) return;
  const p = panned(x, y, true), t = now()+0.005;
  if(occ) p.f.frequency.value = 380;
  const o = osc('sine', 58); o.frequency.setValueAtTime(58, t); o.frequency.exponentialRampToValueAtTime(26, t+0.16);
  const g = gain(0.0001); env(g, t, 0.003, heavy ? 0.7 : 0.45, 0.2);
  const n = noiseSrc('brown'), nf = filt('lowpass', 420), ng = gain(0.0001); env(ng, t, 0.002, 0.5, 0.1);
  o.connect(g); g.connect(p.in); n.connect(nf); nf.connect(ng); ng.connect(p.in);
  o.start(t); o.stop(t+0.3); n.start(t); n.stop(t+0.2);
  /* the head rattles on the cord every step */
  if(Math.random() < 0.7){
    [377, 591, 1010].forEach((f,i)=>{ const oo = osc('sine', f*(0.97+Math.random()*0.06)), gg = gain(0.0001); env(gg, t+0.03, 0.001, 0.07/(i+1), 0.2); oo.connect(gg); gg.connect(p.in); oo.start(t); oo.stop(t+0.3); });
  }
};
A.pop = function(x, y){
  if(!c || !started) return;
  const p = panned(x, y, false), t = now()+0.005;
  const n = noiseSrc('white'), hp = filt('highpass', 2500), g = gain(0.0001); env(g, t, 0.001, 0.5, 0.06);
  n.connect(hp); hp.connect(g); g.connect(p.in); n.start(t); n.stop(t+0.1);
  for(let i=0;i<6;i++){ const tt = t + 0.04 + Math.random()*0.3; const o = osc('sine', 3000+Math.random()*4000), og = gain(0.0001); env(og, tt, 0.001, 0.05, 0.08); o.connect(og); og.connect(p.in); o.start(tt); o.stop(tt+0.1); }
};
A.lightsOut = function(){
  if(!c || !started) return;
  const t = now()+0.01;
  const o = osc('sawtooth', 60), lp = filt('lowpass', 400), g = gain(0.0001);
  g.gain.setValueAtTime(0.3, t); g.gain.exponentialRampToValueAtTime(0.0001, t+0.5);
  o.frequency.setValueAtTime(60, t); o.frequency.exponentialRampToValueAtTime(20, t+0.5);
  o.connect(lp); lp.connect(g); g.connect(gameIn); o.start(t); o.stop(t+0.55);
};

/* ---------- PLAYER ONE-SHOTS ---------- */
A.click = function(on){
  if(!c || !started) return;
  const t = now()+0.003;
  const o = osc('square', on ? 2400 : 1800), g = gain(0.0001); env(g, t, 0.001, 0.08, 0.02);
  const o2 = osc('square', on ? 900 : 700), g2 = gain(0.0001); env(g2, t+0.025, 0.001, 0.05, 0.02);
  o.connect(g); g.connect(close); o2.connect(g2); g2.connect(close); o.start(t); o.stop(t+0.04); o2.start(t); o2.stop(t+0.07);
};
A.rattle = function(){
  if(!c || !started) return;
  const t = now()+0.003;
  for(let i=0;i<7;i++){
    const tt = t + i*0.055 + Math.random()*0.02;
    const n = noiseSrc('white'), bp = filt('bandpass', 3000 + Math.random()*2000, 6), g = gain(0.0001); env(g, tt, 0.001, 0.25, 0.03);
    n.connect(bp); bp.connect(g); g.connect(close); n.start(tt); n.stop(tt+0.05);
  }
  const o = osc('sine', 920), g = gain(0.0001); o.frequency.setValueAtTime(920, t+0.1); o.frequency.exponentialRampToValueAtTime(610, t+0.45); env(g, t+0.1, 0.002, 0.04, 0.35);
  o.connect(g); g.connect(close); o.start(t); o.stop(t+0.5);
};
A.tag = function(x, y){
  if(!c || !started) return;
  const t = now()+0.005;
  /* the seal, then the paper */
  const o = osc('sine', 90); o.frequency.setValueAtTime(140, t); o.frequency.exponentialRampToValueAtTime(45, t+0.12);
  const g = gain(0.0001); env(g, t, 0.002, 0.5, 0.14);
  o.connect(g); g.connect(close); o.start(t); o.stop(t+0.2);
  const s = noiseSrc('pink'), sf = filt('bandpass', 400, 1), sg = gain(0.0001);
  sf.frequency.setValueAtTime(300, t); sf.frequency.exponentialRampToValueAtTime(2400, t+0.35);
  sg.gain.setValueAtTime(0.0001, t); sg.gain.linearRampToValueAtTime(0.25, t+0.05); sg.gain.exponentialRampToValueAtTime(0.0001, t+0.4);
  s.connect(sf); sf.connect(sg); sg.connect(close); s.start(t); s.stop(t+0.45);
  for(let i=0;i<14;i++){
    const tt = t + 0.25 + i*0.022 + Math.random()*0.012;
    const n = noiseSrc('white'), hp = filt('highpass', 1800 + Math.random()*2000), ng = gain(0.0001); env(ng, tt, 0.001, 0.12 + Math.random()*0.1, 0.012);
    n.connect(hp); hp.connect(ng); ng.connect(close); n.start(tt); n.stop(tt+0.03);
  }
};
A.stinger = function(){
  if(!c || !started) return;
  const t = now()+0.005;
  [55, 116.5, 164.8, 233].forEach((f,i)=>{
    const o = osc('sawtooth', f), lp = filt('lowpass', 3200, 2), g = gain(0.0001);
    lp.frequency.setValueAtTime(3200, t); lp.frequency.exponentialRampToValueAtTime(200, t+1.6);
    env(g, t, 0.008, 0.22/(i*0.4+1), 1.6);
    o.connect(lp); lp.connect(g); g.connect(close); o.start(t); o.stop(t+1.8);
  });
  const n = noiseSrc('white'), hp = filt('highpass', 2000), ng = gain(0.0001); env(ng, t, 0.002, 0.35, 0.5);
  n.connect(hp); hp.connect(ng); ng.connect(close); n.start(t); n.stop(t+0.6);
  const s = osc('sine', 48), sg = gain(0.0001); env(sg, t, 0.005, 0.9, 1.2); s.frequency.setValueAtTime(70, t); s.frequency.exponentialRampToValueAtTime(30, t+1);
  s.connect(sg); sg.connect(close); s.start(t); s.stop(t+1.3);
  V.buzz(45);
};
A.scare = function(){
  if(!c) return;
  const bus = V.bus(); const dest = started ? close : bus.master;
  const t = now()+0.002;
  const n = noiseSrc('white'), hp = filt('highpass', 900), ng = gain(0.0001); env(ng, t, 0.003, 0.9, 1.2);
  n.connect(hp); hp.connect(ng); ng.connect(dest); n.start(t); n.stop(t+1.3);
  const o = osc('sawtooth', 900), ws = shaper(6), g = gain(0.0001), bp = filt('bandpass', 1400, 2);
  o.frequency.setValueAtTime(1100, t); o.frequency.exponentialRampToValueAtTime(260, t+1.2);
  const fm = osc('sine', 37), fg = gain(300); fm.connect(fg); fg.connect(o.frequency);
  env(g, t, 0.005, 0.7, 1.3);
  o.connect(ws); ws.connect(bp); bp.connect(g); g.connect(dest); o.start(t); fm.start(t); o.stop(t+1.4); fm.stop(t+1.4);
  const s = osc('sine', 80), sg = gain(0.0001); s.frequency.setValueAtTime(80, t); s.frequency.exponentialRampToValueAtTime(25, t+0.9); env(sg, t, 0.003, 1.0, 1.0);
  s.connect(sg); sg.connect(dest); s.start(t); s.stop(t+1.1);
  V.buzz([120, 40, 200]);
};
A.cutScare = function(){
  /* used at the seventh: the scream stops mid-breath */
  if(!c) return;
  const bus = V.bus();
  const t = now();
  bus.master.gain.cancelScheduledValues(t);
  bus.master.gain.setValueAtTime(0.0001, t);
  bus.master.gain.setTargetAtTime(V.settings.vol, t+0.9, 0.4);
};
A.lockRattle = function(x, y){
  if(!c || !started) return;
  const p = panned(x, y, false), t = now()+0.005;
  for(let i=0;i<3;i++){
    const tt = t + i*0.12;
    [180, 455, 702].forEach((f,k)=>{ const o = osc('square', f*(0.95+Math.random()*0.1)), lp = filt('lowpass', 1800), g = gain(0.0001); env(g, tt, 0.001, 0.12/(k+1), 0.12); o.connect(lp); lp.connect(g); g.connect(p.in); o.start(tt); o.stop(tt+0.15); });
  }
};
A.unlock = function(x, y){
  if(!c || !started) return;
  const p = panned(x, y, false), t = now()+0.005;
  const o = osc('square', 70), lp = filt('lowpass', 500), g = gain(0.0001); env(g, t, 0.002, 0.7, 0.5);
  o.connect(lp); lp.connect(g); g.connect(p.in); o.start(t); o.stop(t+0.6);
  [260, 410, 760].forEach((f,i)=>{ const oo = osc('sine', f), gg = gain(0.0001); env(gg, t+0.05, 0.002, 0.2/(i+1), 0.9); oo.connect(gg); gg.connect(p.in); oo.start(t); oo.stop(t+1); });
};
A.doorOpen = function(){
  if(!c || !started) return;
  const t = now()+0.005;
  const o = osc('sawtooth', 160), bp = filt('bandpass', 900, 5), g = gain(0.0001);
  o.frequency.setValueAtTime(130, t); o.frequency.linearRampToValueAtTime(210, t+1.4);
  const lfo = osc('square', 19), lg = gain(25); lfo.connect(lg); lg.connect(o.frequency);
  g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.14, t+0.4); g.gain.exponentialRampToValueAtTime(0.0001, t+1.6);
  o.connect(bp); bp.connect(g); g.connect(close); o.start(t); lfo.start(t); o.stop(t+1.7); lfo.stop(t+1.7);
  const w = noiseSrc('pink', true), wf = filt('lowpass', 900), wg = gain(0.0001);
  wg.gain.setValueAtTime(0.0001, t); wg.gain.linearRampToValueAtTime(0.25, t+1.5); wg.gain.exponentialRampToValueAtTime(0.0001, t+5);
  w.connect(wf); wf.connect(wg); wg.connect(close); w.start(t); w.stop(t+5.1);
};
A.scratch = function(dest){
  const cc = V.ac(); if(!cc) return;
  if(!c) c = cc;
  const d = dest || (started ? close : V.bus().master);
  const t = c.currentTime + 0.01;
  const n = noiseSrc('white'), bp = filt('bandpass', 2400, 3), g = gain(0.0001);
  bp.frequency.setValueAtTime(1800, t); bp.frequency.linearRampToValueAtTime(3600, t+0.45);
  g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.35, t+0.05);
  for(let i=1;i<9;i++) g.gain.setValueAtTime(0.12 + Math.random()*0.3, t + i*0.05);
  g.gain.exponentialRampToValueAtTime(0.0001, t+0.5);
  n.connect(bp); bp.connect(g); g.connect(d); n.start(t); n.stop(t+0.55);
};
A.gulp = function(){
  if(!c || !started) return;
  const t = now()+0.005;
  for(let i=0;i<3;i++){
    const tt = t + i*0.38;
    const o = osc('sine', 180), g = gain(0.0001); o.frequency.setValueAtTime(220, tt); o.frequency.exponentialRampToValueAtTime(90, tt+0.12); env(g, tt, 0.01, 0.3, 0.15);
    o.connect(g); g.connect(close); o.start(tt); o.stop(tt+0.2);
  }
};
A.hideDoor = function(open){
  if(!c || !started) return;
  const t = now()+0.005;
  const n = noiseSrc('pink'), f = filt('bandpass', open ? 600 : 300, 1.2), g = gain(0.0001); env(g, t, 0.01, 0.25, 0.25);
  n.connect(f); f.connect(g); g.connect(close); n.start(t); n.stop(t+0.3);
  const o = osc('sine', open ? 110 : 70), og = gain(0.0001); env(og, t+0.05, 0.003, 0.4, 0.15); o.connect(og); og.connect(close); o.start(t); o.stop(t+0.3);
};

/* ---------- EASTER EGGS ---------- */
/* a tape in the laundry. it is very loud. something hears it. */
A.tape = function(x, y){
  if(!c || !started) return 0;
  const p = panned(x, y, false);
  const box = filt('lowpass', 2600, 1.2), hpf = filt('highpass', 120), bg = gain(0.9);
  box.connect(hpf); hpf.connect(bg); bg.connect(p.in);
  const t0 = now() + 0.05, len = 6.2, step = 0.112;
  /* guitars: two saws a semitone apart through a fuzz */
  const g1 = osc('sawtooth', 61.7), g2 = osc('sawtooth', 65.4), fz = shaper(14), gl = filt('lowpass', 1500), gg = gain(0.0001);
  g1.connect(fz); g2.connect(fz); fz.connect(gl); gl.connect(gg); gg.connect(box);
  gg.gain.setValueAtTime(0.0001, t0); gg.gain.linearRampToValueAtTime(0.16, t0+0.02); gg.gain.setValueAtTime(0.16, t0+len-0.2); gg.gain.linearRampToValueAtTime(0.0001, t0+len);
  /* riff: the root drops on the beat */
  for(let k=0; k<len/0.45; k++){ const tt = t0 + k*0.45; const f = [61.7, 61.7, 58.3, 69.3][k%4]; g1.frequency.setValueAtTime(f, tt); g2.frequency.setValueAtTime(f*1.059, tt); }
  g1.start(t0); g2.start(t0); g1.stop(t0+len); g2.stop(t0+len);
  /* blast beat */
  for(let i=0; i*step < len-0.1; i++){
    const tt = t0 + i*step;
    const k = osc('sine', 70); k.frequency.setValueAtTime(110, tt); k.frequency.exponentialRampToValueAtTime(42, tt+0.06);
    const kg = gain(0.0001); env(kg, tt, 0.001, 0.55, 0.07); k.connect(kg); kg.connect(box); k.start(tt); k.stop(tt+0.09);
    if(i%2 === 1){ const sn = noiseSrc('white'), sb = filt('bandpass', 1900, 0.8), sg = gain(0.0001); env(sg, tt, 0.001, 0.4, 0.06); sn.connect(sb); sb.connect(sg); sg.connect(box); sn.start(tt); sn.stop(tt+0.08); }
  }
  /* the pig squeal on the down beat of every bar */
  for(let b=0; b<len/1.8; b++){
    const tt = t0 + 0.9 + b*1.8;
    const v = osc('sawtooth', 300), vf = filt('bandpass', 900, 8), vg = gain(0.0001);
    v.frequency.setValueAtTime(260, tt); v.frequency.exponentialRampToValueAtTime(820, tt+0.3); v.frequency.exponentialRampToValueAtTime(420, tt+0.6);
    vf.frequency.setValueAtTime(700, tt); vf.frequency.exponentialRampToValueAtTime(2400, tt+0.3);
    env(vg, tt, 0.01, 0.22, 0.6); v.connect(vf); vf.connect(vg); vg.connect(box); v.start(tt); v.stop(tt+0.7);
  }
  return len;
};
/* a radio in the office, set to a station that does not exist down here */
A.radio = function(x, y, on){
  if(!c || !started) return;
  if(radio){ radio.stopAll(); radio = null; }
  if(!on) return;
  const p = panned(x, y, false);
  const nodes = [];
  const n = noiseSrc('white', true), nf = filt('bandpass', 2400, 0.6), ng = gain(0.035);
  const crack = osc('square', 7), cg = gain(0.02); crack.connect(cg); cg.connect(ng.gain);
  n.connect(nf); nf.connect(ng); ng.connect(p.in); n.start(); crack.start(); nodes.push(n, crack);
  const tone = osc('sine', 600), tg = gain(0.0001), tlp = filt('lowpass', 1800);
  tone.connect(tlp); tlp.connect(tg); tg.connect(p.in); tone.start(); nodes.push(tone);
  /* -.. ...-- ---.. the same three things, over and over */
  const morse = '...-- ---..   .-. . -.   ';
  const u = 0.09;
  let t = now() + 0.4;
  for(let rep=0; rep<6; rep++){
    for(const ch of morse){
      if(ch === '.'){ tg.gain.setValueAtTime(0.09, t); tg.gain.setValueAtTime(0.0001, t+u); t += u*2; }
      else if(ch === '-'){ tg.gain.setValueAtTime(0.09, t); tg.gain.setValueAtTime(0.0001, t+u*3); t += u*4; }
      else t += u*3;
    }
    t += 1.2;
  }
  radio = { stopAll: ()=>{ nodes.forEach(o=>{ try{ o.stop(); }catch(e){} }); try{ p.p.disconnect(); }catch(e){} } };
};

A.ready = ()=>started;
A.ctx = ()=>c;
})();
