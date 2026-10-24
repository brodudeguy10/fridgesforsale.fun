/* ============================================================
   THE VENDOR — the sound bank
   every sound in the game as a recipe on top of sound-dsp.js.
   rule one: no two families are built the same way, so they
   stay apart by ear.
     footsteps     transient + surface body (noise, modal tile, splash, grate metal)
     the vendor    sub impact + bone creak (karplus) + head rattle (shelf modes)
                   hum: motor + gurgle + a throat under it (glottal + formants)
     rooms         decorrelated noise beds per zone, with things baked in
     the building  stick-slip creaks, pipe modes, glass, power thunks
     music         stems that all loop at 9.6s, so they stay in sync
     scares        dread chord stacks, FM screech through a wavefolder
     the VN        a music box, a fridge that talks in little burbles
     easter eggs   a cassette of goregrind, a radio, a phone, a watch
   rule two: everything pitched sits on D. pentatonic for anything
   random, the flat second and the tritone when it's meant to hurt.
============================================================ */
(function(root){
'use strict';
const D = root.VDSP;
const BANK = {};
function def(name, opt, fn){ BANK[name] = Object.assign({ v:1, sr:32000, pri:2, peak:0.8 }, opt, { fn }); }
const LOOP = 9.6;               // music stem length: 16 beats at 100bpm
const BEAT = LOOP/16;

/* ---------- little builders ---------- */
function perc(x, a, d){ return D.env(x, D.perc(a, d)); }
function sine(f, sec){ return D.osc('sine', f, sec); }
function thump(f0, f1, sec, R){
  const x = D.osc('sine', D.line([[0,f0],[sec*0.6,f1]], true), sec);
  return perc(x, 0.002, sec);
}
function burst(kind, sec, R, a, d){ return perc(D.noise(kind, sec, R), a||0.002, d||sec); }
function stickSlip(sec, R, rate0, rate1, res){
  /* friction: an impulse train whose rate wanders, through resonances */
  const n = D.len(sec), x = new Float32Array(n);
  const rate = D.line([[0,rate0],[sec*0.5, (rate0+rate1)/2 + R.bi()*8],[sec,rate1]]);
  let ph = 0;
  for(let i=0;i<n;i++){
    const t = i/D.getSR();
    ph += rate(t)*(1 + R.bi()*0.25)/D.getSR();
    if(ph >= 1){ ph -= 1; x[i] = 0.6 + R()*0.4; }
  }
  const env = D.line([[0,0],[0.08,1],[sec*0.7,0.8],[sec,0]]);
  D.env(x, env);
  const out = new Float32Array(n);
  (res || [[620,9,1],[1700,7,0.5],[3100,6,0.2]]).forEach(r=>D.add(out, D.svf(x,'bpn',r[0]*(1+R.bi()*0.05),r[1]), r[2]));
  return out;
}
function plip(R, f){
  const ff = f || R.range(1300, 2600), sec = 0.07;
  const x = D.osc('sine', D.line([[0,ff],[sec,ff*1.9]], true), sec);
  return perc(x, 0.001, 0.06);
}
function glassShower(R, n, sec){
  const out = D.buf(sec);
  for(let k=0;k<n;k++){
    const t = R()*R()*sec*0.8;
    const f = R.range(2200, 7000);
    const g = D.modal(D.click(0.002, R), D.modes.glass(f, R), 0.2);
    D.add(out, g, R.range(0.05, 0.25)*(1 - t/sec), t);
  }
  return out;
}
function cassette(x, R){
  let y = D.wow(x, { wow:0.55, wowMs:4, flutter:7.5, flutterMs:0.35 });
  y = D.svf(y, 'hp', 90, 0.7); y = D.lp(y, 4200, 0.8);
  y = D.shape(y, 1.6, 'asym');
  const hiss = D.lp(D.noise('white', D.secs(y), R), 6000);
  D.add(y, hiss, 0.025);
  return y;
}

/* ============================================================
   FOOTSTEPS (yours)
============================================================ */
def('step_concrete', { v:6, pri:0, peak:0.55 }, (i,R)=>{
  const out = D.buf(0.3);
  D.add(out, D.hp(D.click(0.003, R), 1400), 0.5);
  D.add(out, D.lp(burst('brown', 0.12, R, 0.002, 0.09), 380), 1.4, 0.004);
  D.add(out, thump(95, 48, 0.07), 0.3, 0.002);
  D.add(out, D.bp(perc(D.noise('velvet', 0.14, R, { density:2600 }), 0.01, 0.12), 3200, 1.2), 0.5, 0.012);
  D.add(out, D.svf(perc(D.noise('pink', 0.09, R), 0.012, 0.08), 'bpn', D.line([[0,700],[0.09,1900]], true), 1.4), 0.25, 0.05 + R()*0.02);
  return out;
});
def('step_tile', { v:6, pri:0, peak:0.5 }, (i,R)=>{
  const out = D.buf(0.32);
  D.add(out, D.hp(D.click(0.002, R), 2600), 0.7);
  D.add(out, D.modal(D.click(0.002, R), D.modes.glass(R.range(1500, 2200), R).map(m=>({ f:m.f, d:m.d*0.12, a:m.a })), 0.2), 0.16);
  D.add(out, D.lp(burst('pink', 0.06, R, 0.001, 0.05), 900), 0.6, 0.003);
  if(i % 3 === 0) D.add(out, D.svf(perc(D.noise('white', 0.06, R), 0.01, 0.05), 'bpn', 2400, 2), 0.2, 0.06);
  return out;
});
def('step_water', { v:6, pri:0, peak:0.55 }, (i,R)=>{
  const out = D.buf(0.5);
  const sw = D.svf(D.noise('white', 0.22, R), 'bpn', D.line([[0,380],[0.06,1500],[0.2,2600]], true), 1.3);
  D.add(out, perc(sw, 0.012, 0.2), 0.9);
  D.add(out, D.lp(burst('brown', 0.25, R, 0.02, 0.22), 300), 0.9);
  const n = 3 + (R()*4|0);
  for(let k=0;k<n;k++) D.add(out, plip(R), R.range(0.08, 0.22), 0.05 + R()*0.35);
  return out;
});
def('step_wood', { v:6, pri:0, peak:0.55 }, (i,R)=>{
  const out = D.buf(0.6);
  D.add(out, D.modal(D.click(0.004, R), D.modes.wood(R.range(120, 170), R), 0.25), 0.7);
  D.add(out, D.lp(burst('brown', 0.08, R, 0.002, 0.07), 600), 1.0);
  D.add(out, D.hp(D.click(0.002, R), 2000), 0.25);
  if(i % 3 === 1) D.add(out, stickSlip(0.32, R, 45, 70, [[520,10,1],[1300,8,0.4]]), 0.12, 0.08);
  return out;
});
def('step_grate', { v:6, pri:0, peak:0.5 }, (i,R)=>{
  const out = D.buf(0.7);
  const f = R.range(330, 470);
  D.add(out, D.modal(D.click(0.003, R), D.modes.plate(f, R).map(m=>({ f:m.f, d:m.d*0.35, a:m.a })), 0.6), 0.35);
  D.add(out, D.modal(D.click(0.002, R), D.modes.plate(f*1.08, R).map(m=>({ f:m.f, d:m.d*0.2, a:m.a })), 0.4), 0.15, 0.03);
  D.add(out, D.lp(burst('brown', 0.08, R, 0.002, 0.07), 500), 0.9);
  D.add(out, D.hp(D.click(0.002, R), 3000), 0.4);
  return out;
});
def('step_polished', { v:6, pri:0, peak:0.5 }, (i,R)=>{
  const out = D.buf(0.3);
  D.add(out, D.hp(D.click(0.002, R), 1800), 0.6);
  D.add(out, D.lp(burst('pink', 0.08, R, 0.002, 0.07), 1200), 0.7);
  if(i % 2 === 0){
    const f0 = R.range(1800, 2400);
    const sq = D.fm(D.line([[0,f0],[0.05,f0*1.25]]), 2.01, D.line([[0,0.4],[0.05,1.4]]), 0.06);
    D.add(out, perc(sq, 0.008, 0.05), 0.12, 0.03);
  }
  return out;
});

/* ============================================================
   THE VENDOR
============================================================ */
def('ven_step', { v:8, pri:0, peak:0.75 }, (i,R)=>{
  const out = D.buf(0.9);
  D.add(out, thump(62, 30, 0.3), 1.0);
  D.add(out, D.lp(burst('brown', 0.18, R, 0.003, 0.16), 260), 1.3);
  /* the knee, a joint too many */
  if(i % 2 === 0) D.add(out, perc(D.lp(D.karplus(R.range(66, 92), 0.35, { damp:0.985, bright:0.15, rng:R }), 900), 0.002, 0.3), 0.35, 0.04);
  /* the head, rattling on its cord: glass shelves inside a steel box */
  const rat = D.buf(0.25);
  const hits = 3 + (R()*4|0);
  for(let k=0;k<hits;k++) D.add(rat, D.click(0.002, R), R.range(0.3, 1), 0.02 + R()*0.12);
  D.add(out, D.modal(rat, D.modes.shelf(R.range(560, 880), R), 0.6), 0.22, 0.05);
  return D.shape(out, 1.3);
});
def('ven_hum', { v:1, pri:0, sr:22050, loop:true, peak:0.6 }, (i,R)=>{
  const sec = 8.3;
  const out = D.buf(sec);
  /* the motor: D2 and its sub, through an old filter */
  const m1 = D.osc('saw', (t)=>73.42*(1 + 0.003*Math.sin(t*0.75*Math.PI*2)), sec);
  const m2 = D.osc('square', 36.71, sec);
  const motor = D.lp(D.add(m1, m2, 0.6), 340, 1.2);
  D.add(out, D.shape(motor, 1.6), 0.55);
  /* 100Hz-ish ripple off the windings */
  D.env(out, (t)=>0.85 + 0.15*Math.sin(t*Math.PI*2*7.5));
  /* refrigerant gurgle */
  const g = D.svf(D.noise('velvet', sec, R, { density:70 }), 'bpn', (t)=>480 + 220*Math.sin(t*1.7), 6);
  D.add(out, D.lp(g, 900), 0.35);
  /* the part that is wrong: a throat inside the hum */
  const throat = D.glottal((t)=>36.71*(1 + 0.02*Math.sin(t*0.6)), sec, { jitter:0.01, rng:R });
  const voice = D.formantMorph(throat, 'u', 'o', 0.9);
  D.env(voice, (t)=>0.5 + 0.5*Math.sin(t*Math.PI*2/sec*2 - 1.2));
  D.add(out, D.wow(voice, { wow:0.3, wowMs:3 }), 0.4);
  /* a whine that beats against itself */
  D.add(out, D.add(sine(587.33, sec), sine(591.1, sec), 1), 0.012);
  return D.loopify(out, 0.3);
});
def('ven_hum_rage', { v:1, pri:1, sr:22050, loop:true, peak:0.7 }, (i,R)=>{
  const sec = 8.3;
  const out = D.buf(sec);
  const m1 = D.osc('saw', (t)=>73.42*(1 + 0.006*Math.sin(t*1.5*Math.PI*2)), sec);
  const m2 = D.osc('square', 36.71, sec);
  const motor = D.lp(D.add(m1, m2, 0.8), 900, 1.8);
  D.add(out, D.shape(D.ring(motor, 41), 3.2, 'fold'), 0.45);
  D.add(out, D.shape(motor, 2.5), 0.45);
  const throat = D.glottal((t)=>73.42*(1 + 0.03*Math.sin(t*2.1)), sec, { jitter:0.03, rng:R });
  D.add(out, D.shape(D.formantMorph(throat, 'a', 'o', 1.0), 2.2), 0.45);
  /* the flat second against the root: it's meant to hurt */
  D.add(out, D.add(sine(587.33, sec), sine(622.25, sec), 1), 0.02);
  D.add(out, D.bp(D.noise('velvet', sec, R, { density:900 }), 2400, 1.5), 0.25);
  return D.loopify(out, 0.3);
});
def('ven_kick', { v:3, pri:1, peak:0.7 }, (i,R)=>{
  /* the compressor kicking on: relay, clunk, a shudder */
  const out = D.buf(1.2);
  D.add(out, D.hp(D.click(0.002, R), 2500), 0.6);
  D.add(out, thump(80, 40, 0.18), 0.8, 0.01);
  D.add(out, D.modal(D.click(0.003, R), D.modes.shelf(R.range(200, 260), R), 0.8), 0.25, 0.02);
  const surge = D.lp(D.osc('saw', D.line([[0,30],[0.4,73.42]], true), 1.1), 300);
  D.env(surge, D.line([[0,0],[0.15,1],[1.1,0]]));
  D.add(out, surge, 0.5, 0.05);
  return out;
});
def('ven_breath', { v:4, pri:1, peak:0.6 }, (i,R)=>{
  /* close, behind you. too slow to be a person. */
  const out = D.buf(3.2);
  const inh = D.formantMorph(D.noise('pink', 1.3, R), 'h', 'u', 0.85);
  D.env(inh, D.line([[0,0],[0.9,1],[1.3,0]]));
  const exh = D.formantMorph(D.noise('pink', 1.7, R), 'a', 'h', 0.8);
  D.env(exh, D.line([[0,0],[0.1,1],[1.7,0]]));
  D.add(out, inh, 0.7); D.add(out, exh, 0.8, 1.4);
  const rasp = D.formant(D.glottal(48, 1.7, { jitter:0.05, rng:R }), 'o', 0.8);
  D.env(rasp, D.line([[0,0],[0.15,1],[1.6,0]]));
  D.add(out, rasp, 0.08, 1.4);
  return out;
});
def('ven_drag', { v:2, pri:2, peak:0.5 }, (i,R)=>{
  /* something heavy pulled across concrete, far off */
  const sec = 3.4, out = D.buf(sec);
  const sc = D.svf(D.noise('pink', sec, R), 'bpn', (t)=>900 + 500*Math.sin(t*2.3) + 300*Math.sin(t*7.1), 2);
  D.env(sc, (t)=>(0.5 + 0.5*Math.sin(t*5.3)*Math.sin(t*1.1))*Math.min(1, t*2)*Math.min(1, (sec-t)*2));
  D.add(out, sc, 1);
  const n = D.len(sec), ex = new Float32Array(n);
  for(let k=0;k<n;k++) if(R() < 0.0015) ex[k] = R();
  D.add(out, D.modal(ex, D.modes.plate(R.range(300, 420), R), sec), 0.25);
  return D.lp(out, 1600);
});

/* ============================================================
   THE TAGGED FRIDGES (clean hum, no throat in it)
============================================================ */
def('fridge_hum', { v:1, pri:0, sr:22050, loop:true, peak:0.5 }, (i,R)=>{
  const sec = 6.2, out = D.buf(sec);
  D.add(out, sine(73.42, sec), 0.6);
  D.add(out, D.lp(D.osc('tri', 146.83, sec), 400), 0.3);
  D.add(out, D.lp(D.noise('pink', sec, R), 220), 0.5);
  D.add(out, D.svf(D.noise('velvet', sec, R, { density:25 }), 'bpn', 600, 5), 0.2);
  D.env(out, (t)=>0.9 + 0.1*Math.sin(t*Math.PI*2*0.5));
  return D.loopify(out, 0.25);
});

/* ============================================================
   ROOMS: one bed per kind of space, stereo, decorrelated
============================================================ */
function bed(sec, R, fn){
  const L = D.buf(sec), Rr = D.buf(sec);
  fn(L, D.rng((R()*1e9)|0), 0); fn(Rr, D.rng((R()*1e9)|0), 1);
  return D.sloopify({ L, R:Rr }, 0.6);
}
def('bed_base', { v:1, pri:0, sr:22050, loop:true, stereo:true, peak:0.5 }, (i,R)=>bed(8.6, R, (x, r, ch)=>{
  D.add(x, D.lp(D.noise('pink', 8.6, r), 280), 0.8);
  D.add(x, D.lp(D.noise('brown', 8.6, r), 70), 1.2);
  D.add(x, D.add(sine(73.42, 8.6), sine(77.78, 8.6), 1), 0.012);
  D.env(x, (t)=>0.8 + 0.2*Math.sin(t*Math.PI*2/8.6 + ch));
}));
def('bed_pipes', { v:1, pri:1, sr:22050, loop:true, stereo:true, peak:0.5 }, (i,R)=>bed(8.6, R, (x, r, ch)=>{
  D.add(x, D.lp(D.noise('brown', 8.6, r), 90), 1.0);
  /* water moving through iron overhead */
  const w = D.svf(D.noise('pink', 8.6, r), 'bpn', (t)=>700 + 300*Math.sin(t*0.9 + ch) + 120*Math.sin(t*3.7), 4);
  D.add(x, w, 0.35);
  for(let k=0;k<5;k++) D.add(x, D.modal(D.click(0.003, r), D.modes.pipe(r.range(160, 320), r), 1.2), 0.05, r()*7.5);
}));
def('bed_boiler', { v:1, pri:1, sr:22050, loop:true, stereo:true, peak:0.6 }, (i,R)=>bed(8.6, R, (x, r, ch)=>{
  const roar = D.lp(D.noise('brown', 8.6, r), 170);
  D.env(roar, (t)=>0.75 + 0.25*Math.sin(t*9.1 + ch)*Math.sin(t*2.3));
  D.add(x, roar, 1.4);
  D.add(x, D.hp(D.noise('white', 8.6, r), 3500), 0.03);
  D.add(x, sine(41.2, 8.6), 0.12);
  for(let k=0;k<7;k++) D.add(x, D.modal(D.click(0.002, r), D.modes.plate(r.range(900, 2400), r).map(m=>({ f:m.f, d:0.15, a:m.a })), 0.3), 0.04, r()*8);
}));
def('bed_cold', { v:1, pri:1, sr:22050, loop:true, stereo:true, peak:0.5 }, (i,R)=>bed(8.6, R, (x, r, ch)=>{
  D.add(x, D.svf(D.noise('pink', 8.6, r), 'bpn', 460 + ch*30, 3), 0.7);
  D.add(x, D.lp(D.noise('brown', 8.6, r), 90), 0.8);
  D.add(x, D.env(sine(1174.66 + ch*1.5, 8.6), (t)=>0.5 + 0.5*Math.sin(t*0.73 + ch)), 0.008);
  for(let k=0;k<9;k++) D.add(x, D.modal(D.click(0.001, r), D.modes.glass(r.range(3000, 6500), r), 0.15), 0.03, r()*8.2);
}));
def('bed_laundry', { v:1, pri:2, sr:22050, loop:true, stereo:true, peak:0.45 }, (i,R)=>bed(8.6, R, (x, r, ch)=>{
  D.add(x, D.svf(D.noise('pink', 8.6, r), 'bpn', 1200, 0.8), 0.25);
  D.add(x, D.lp(D.noise('brown', 8.6, r), 80), 0.8);
  for(let k=0;k<6;k++) D.add(x, plip(r), 0.12, r()*8.2);
  D.add(x, stickSlip(1.4, r, 15, 30, [[300,6,1],[760,6,0.4]]), 0.04, 3 + ch*2);
}));
def('bed_wet', { v:1, pri:2, sr:22050, loop:true, stereo:true, peak:0.5 }, (i,R)=>bed(8.6, R, (x, r, ch)=>{
  const tr = D.svf(D.noise('velvet', 8.6, r, { density:2400 }), 'bpn', (t)=>1800 + 800*Math.sin(t*1.3 + ch*2), 1.5);
  D.add(x, tr, 0.35);
  D.add(x, D.lp(D.noise('brown', 8.6, r), 120), 0.9);
  for(let k=0;k<14;k++) D.add(x, plip(r), r.range(0.05, 0.18), r()*8.3);
}));
def('bed_office', { v:1, pri:2, sr:22050, loop:true, stereo:true, peak:0.4 }, (i,R)=>bed(8.6, R, (x, r, ch)=>{
  D.add(x, D.lp(D.noise('pink', 8.6, r), 400), 0.35);
  /* a wall clock that keeps time down here, more or less */
  for(let s=0; s<8; s++){ const tk = D.modal(D.click(0.001, r), D.modes.wood(3200, r).map(m=>({ f:m.f, d:0.03, a:m.a })), 0.06); D.add(x, tk, s%2 ? 0.05 : 0.07, s + 0.3 + ch*0.0004); }
}));
def('bed_crawl', { v:1, pri:2, sr:22050, loop:true, stereo:true, peak:0.5 }, (i,R)=>bed(8.6, R, (x, r, ch)=>{
  D.add(x, D.lp(D.noise('brown', 8.6, r), 110), 1.4);
  D.add(x, D.lp(D.noise('pink', 8.6, r), 600), 0.08);
  for(let k=0;k<3;k++) D.add(x, D.bp(burst('velvet', 0.6, r, 0.05, 0.5), 2400, 0.8), 0.08, r()*7.5);
}));

/* fluorescent tubes */
def('tube_buzz', { v:1, pri:1, sr:32000, loop:true, peak:0.5 }, (i,R)=>{
  const sec = 4.1, out = D.buf(sec);
  D.add(out, D.svf(D.osc('square', 120, sec), 'bpn', 2400, 3), 0.7);
  D.add(out, D.svf(D.osc('saw', 240, sec), 'bpn', 4800, 4), 0.25);
  D.add(out, D.hp(D.noise('velvet', sec, R, { density:300 }), 3000), 0.25);
  D.env(out, (t)=>0.85 + 0.15*Math.sin(t*Math.PI*2*1.4));
  return D.loopify(out, 0.2);
});
def('tube_zap', { v:4, pri:2, peak:0.5 }, (i,R)=>{
  const out = D.buf(0.4);
  D.add(out, D.hp(D.click(0.002, R), 3000), 0.6);
  const z = D.svf(D.osc('square', 120, 0.2), 'bpn', 3500, 2);
  D.env(z, (t)=>Math.sin(t*90)*Math.sin(t*90) > 0.5 ? 1 : 0.1);
  D.add(out, perc(z, 0.002, 0.18), 0.4, 0.01);
  D.add(out, D.hp(D.noise('velvet', 0.3, R, { density:4000 }), 2500), 0.2);
  return out;
});

/* ============================================================
   THE BUILDING
============================================================ */
def('drip', { v:10, pri:1, peak:0.4 }, (i,R)=>{
  const out = D.buf(0.35);
  D.add(out, plip(R), 1);
  D.add(out, D.karplus(R.range(1400, 2600), 0.25, { damp:0.97, bright:0.8, rng:R }), 0.12);
  return out;
});
def('knock', { v:6, pri:1, peak:0.55 }, (i,R)=>{
  const out = D.buf(1.8);
  const f = R.range(150, 260), hits = 1 + (R()*3|0);
  for(let k=0;k<hits;k++) D.add(out, D.modal(D.click(0.004, R), D.modes.pipe(f*(1 - k*0.03), R), 1.4), 0.9 - k*0.2, k*R.range(0.14, 0.3));
  return D.lp(out, 3000);
});
def('creak', { v:6, pri:1, peak:0.45 }, (i,R)=>{
  const sec = R.range(0.9, 1.6);
  const out = stickSlip(sec, R, R.range(18, 35), R.range(40, 80));
  return D.add(out, D.modal(D.click(0.004, R), D.modes.wood(R.range(90, 130), R), sec), 0.3);
});
def('slam_far', { v:3, pri:1, stereo:true, peak:0.6 }, (i,R)=>{
  const x = D.buf(0.6);
  D.add(x, thump(70, 32, 0.4), 1);
  D.add(x, D.lp(burst('brown', 0.3, R, 0.003, 0.25), 350), 1.2);
  D.add(x, D.modal(D.click(0.003, R), D.modes.plate(R.range(90, 140), R), 0.6), 0.3);
  return D.reverb(D.lp(x, 600), { size:0.92, damp:0.6, wet:0.7, dry:0.5, tail:3 });
});
def('steps_far', { v:3, pri:2, stereo:true, peak:0.5 }, (i,R)=>{
  const x = D.buf(3);
  for(let k=0;k<5;k++) D.add(x, thump(58, 28, 0.25), 0.9, k*0.56 + (k%2)*0.09);
  return D.reverb(D.lp(x, 280), { size:0.9, damp:0.7, wet:0.6, dry:0.6, tail:2.5 });
});
def('bulb_pop', { v:4, pri:1, peak:0.6 }, (i,R)=>{
  const out = D.buf(1.2);
  D.add(out, D.hp(D.click(0.003, R), 2000), 0.9);
  D.add(out, thump(140, 60, 0.06), 0.3);
  D.add(out, D.modal(D.click(0.002, R), D.modes.glass(R.range(2800, 4200), R), 0.5), 0.4);
  D.add(out, glassShower(R, 26, 1.1), 0.7, 0.03);
  D.add(out, D.hp(burst('velvet', 0.08, R, 0.001, 0.07), 4000), 0.4);
  return out;
});
def('power_down', { v:2, pri:1, peak:0.7 }, (i,R)=>{
  const out = D.buf(1.6);
  D.add(out, D.hp(D.click(0.003, R), 1500), 0.6);
  D.add(out, thump(90, 35, 0.3), 0.8);
  const drop = D.lp(D.osc('saw', D.line([[0,120],[1.4,18]], true), 1.5), 500);
  D.env(drop, D.line([[0,1],[1.5,0]]));
  D.add(out, drop, 0.5, 0.02);
  D.add(out, D.hp(burst('velvet', 0.2, R, 0.001, 0.18), 3000), 0.3);
  return out;
});
def('power_surge', { v:2, pri:2, peak:0.6 }, (i,R)=>{
  const sec = 2.4, out = D.buf(sec);
  const b = D.svf(D.osc('square', D.line([[0,120],[2,126]]), sec), 'bpn', D.line([[0,1800],[2,5200]], true), 2);
  D.env(b, D.line([[0,0],[2,1],[2.05,0]]));
  D.add(out, b, 0.5);
  D.add(out, D.hp(D.noise('velvet', sec, R, { density:900 }), 3000), 0.2);
  D.add(out, D.hp(D.click(0.003, R), 1500), 0.8, 2.02);
  D.add(out, glassShower(R, 14, 0.4), 0.5, 2.02);
  return out;
});
def('shelf_crash', { v:2, pri:2, stereo:true, peak:0.7 }, (i,R)=>{
  const x = D.buf(2.4);
  for(let k=0;k<9;k++){
    const t = k === 0 ? 0 : R()*R()*1.6;
    D.add(x, D.lp(burst('pink', 0.12, R, 0.002, 0.1), 1500), R.range(0.3, 1), t);
    if(k % 2 === 0) D.add(x, D.modal(D.click(0.003, R), D.modes.plate(R.range(250, 600), R), 0.7), 0.25, t);
  }
  D.add(x, thump(80, 35, 0.3), 0.9, 0.02);
  return D.reverb(x, { size:0.8, damp:0.5, wet:0.35, tail:1.5 });
});
def('fridge_knock', { v:3, pri:2, peak:0.6 }, (i,R)=>{
  /* knuckles on the inside of a steel box */
  const out = D.buf(2.2);
  const times = [0, 0.32, 0.64, 1.35];
  times.slice(0, 3 + (i%2)).forEach((t,k)=>{
    D.add(out, D.lp(D.modal(D.click(0.006, R), D.modes.shelf(R.range(180, 240), R), 0.4), 900), 1 - k*0.08, t + R()*0.03);
    D.add(out, thump(110, 70, 0.05), 0.3, t);
  });
  return out;
});
def('steam', { v:2, pri:2, peak:0.6 }, (i,R)=>{
  const sec = 3.2, out = D.buf(sec);
  D.add(out, D.modal(D.click(0.004, R), D.modes.pipe(R.range(180, 240), R), 1), 0.6);
  const h = D.svf(D.noise('white', sec, R), 'hp', D.line([[0,5000],[0.4,1800],[sec,3000]], true), 0.8);
  D.env(h, D.line([[0,0],[0.05,1],[0.6,0.8],[sec,0]]));
  D.add(out, h, 0.6, 0.02);
  return out;
});
def('stairs_fall', { v:1, pri:2, stereo:true, peak:0.6 }, (i,R)=>{
  /* the little man from upstairs, down the stairs on the far side of the door */
  const x = D.buf(2.8);
  let t = 0;
  for(let k=0;k<11;k++){
    D.add(x, thump(R.range(80, 120), 40, 0.12), 0.8, t);
    D.add(x, D.modal(D.click(0.003, R), D.modes.wood(R.range(180, 260), R), 0.2), 0.4, t);
    t += Math.max(0.06, 0.28 - k*0.02) + R()*0.04;
  }
  D.add(x, thump(70, 30, 0.4), 1, t + 0.05);
  return D.reverb(D.lp(x, 900), { size:0.7, damp:0.6, wet:0.4, tail:1.2 });
});

/* ============================================================
   YOU
============================================================ */
function switchClick(R, on){
  const out = D.buf(0.12);
  D.add(out, D.modal(D.click(0.002, R), D.modes.wood(on ? 2600 : 2200, R).map(m=>({ f:m.f, d:0.02, a:m.a })), 0.05), 0.8);
  D.add(out, D.modal(D.click(0.002, R), D.modes.wood(on ? 1900 : 1700, R).map(m=>({ f:m.f, d:0.02, a:m.a })), 0.05), 0.5, 0.028);
  D.add(out, D.karplus(on ? 1500 : 1300, 0.06, { damp:0.94, bright:0.9, rng:R }), 0.06, 0.03);
  return out;
}
def('flash_on',  { v:3, pri:0, peak:0.45 }, (i,R)=>switchClick(R, true));
def('flash_off', { v:3, pri:0, peak:0.45 }, (i,R)=>switchClick(R, false));
def('rattle', { v:4, pri:0, peak:0.55 }, (i,R)=>{
  /* two batteries knocking around in a plastic tube */
  const out = D.buf(0.65);
  const n = 8 + (R()*6|0);
  for(let k=0;k<n;k++){
    const t = k*0.045 + R()*0.02;
    D.add(out, D.modal(D.click(0.0015, R), D.modes.shelf(R.range(1800, 3200), R).map(m=>({ f:m.f, d:0.03, a:m.a })), 0.05), R.range(0.3, 0.9), t);
  }
  D.add(out, perc(D.karplus(R.range(850, 1000), 0.4, { damp:0.993, bright:0.6, rng:R }), 0.002, 0.35), 0.15, 0.1);
  return out;
});
def('tag_take', { v:4, pri:0, peak:0.65 }, (i,R)=>{
  const out = D.buf(1.0);
  /* the seal letting go */
  const suck = D.svf(D.noise('pink', 0.15, R), 'bpn', D.line([[0,300],[0.15,90]], true), 2);
  D.add(out, perc(suck, 0.01, 0.14), 1.2);
  D.add(out, thump(140, 50, 0.08), 0.5, 0.01);
  /* then the paper: crackle that thickens and tears */
  const crk = D.noise('velvet', 0.4, R, { density:900 });
  D.env(crk, D.line([[0,0.2],[0.3,1],[0.4,0]]));
  D.add(out, D.bp(crk, 2800, 0.7), 0.7, 0.2);
  D.add(out, D.svf(burst('white', 0.07, R, 0.002, 0.06), 'bpn', 2200, 1.2), 0.5, 0.58);
  return out;
});
def('breath_in', { v:6, pri:1, peak:0.45 }, (i,R)=>{
  const sec = R.range(0.6, 0.9), x = D.formantMorph(D.noise('pink', sec, R), 'h', i%2 ? 'u' : 'o', R.range(0.95, 1.1));
  D.env(x, D.line([[0,0],[sec*0.75,1],[sec,0]]));
  if(i >= 3) D.env(x, (t)=>0.75 + 0.25*Math.sin(t*R.range(18,26)));
  return x;
});
def('breath_out', { v:6, pri:1, peak:0.45 }, (i,R)=>{
  const sec = R.range(0.7, 1.0), x = D.formantMorph(D.noise('pink', sec, R), 'a', 'h', R.range(0.9, 1.05));
  D.env(x, D.line([[0,0],[0.06,1],[sec,0]]));
  if(i >= 3) D.env(x, (t)=>0.7 + 0.3*Math.sin(t*R.range(14,22)));
  return x;
});
def('heart', { v:4, pri:0, peak:0.7 }, (i,R)=>{
  const out = D.buf(0.55);
  D.add(out, thump(62, 32, 0.16), 1);
  D.add(out, D.lp(burst('brown', 0.1, R, 0.005, 0.09), 150), 0.8);
  D.add(out, thump(52, 28, 0.14), 0.7, 0.17);
  D.add(out, D.modal(D.click(0.006, R), D.modes.wood(88, R), 0.3), 0.15);
  return D.lp(out, 400);
});
def('hide_fridge_in', { v:2, pri:1, peak:0.6 }, (i,R)=>{
  const out = D.buf(0.7);
  D.add(out, D.lp(stickSlip(0.25, R, 60, 90, [[500,8,1],[1200,6,0.3]]), 2000), 0.3);
  D.add(out, thump(100, 45, 0.12), 0.9, 0.22);
  D.add(out, D.svf(burst('pink', 0.12, R, 0.002, 0.1), 'bpn', 250, 1.5), 1, 0.22);
  return out;
});
def('hide_fridge_out', { v:2, pri:1, peak:0.6 }, (i,R)=>{
  const out = D.buf(0.8);
  const suck = D.svf(D.noise('pink', 0.12, R), 'bpn', D.line([[0,120],[0.12,420]], true), 2);
  D.add(out, perc(suck, 0.01, 0.1), 1.2);
  D.add(out, D.lp(stickSlip(0.35, R, 50, 80, [[500,8,1],[1200,6,0.3]]), 2000), 0.3, 0.08);
  return out;
});
def('hide_locker', { v:3, pri:1, peak:0.6 }, (i,R)=>{
  const out = D.buf(0.9);
  D.add(out, D.modal(D.click(0.004, R), D.modes.plate(R.range(260, 340), R).map(m=>({ f:m.f, d:m.d*0.4, a:m.a })), 0.8), 0.6);
  D.add(out, D.hp(D.click(0.002, R), 2500), 0.5, 0.05);
  D.add(out, thump(110, 50, 0.1), 0.5);
  return out;
});
def('lock_rattle', { v:3, pri:1, peak:0.6 }, (i,R)=>{
  const out = D.buf(0.8);
  for(let k=0;k<4;k++) D.add(out, D.modal(D.click(0.003, R), D.modes.plate(R.range(420, 900), R).map(m=>({ f:m.f, d:m.d*0.15, a:m.a })), 0.25), 0.7, k*0.11 + R()*0.03);
  D.add(out, thump(90, 50, 0.08), 0.4);
  return out;
});
def('unlock', { v:1, pri:1, peak:0.8 }, (i,R)=>{
  const out = D.buf(2.2);
  D.add(out, thump(70, 35, 0.4), 1);
  D.add(out, D.modal(D.click(0.006, R), D.modes.plate(160, R), 2), 0.5);
  D.add(out, perc(D.karplus(420, 1.5, { damp:0.997, bright:0.5, rng:R }), 0.002, 1.4), 0.15, 0.08);
  return D.echo(out, 0.21, 0.3, 0.25, 1500, 1);
});
def('door_open', { v:1, pri:1, stereo:true, peak:0.75 }, (i,R)=>{
  const sec = 6, x = D.buf(sec);
  D.add(x, stickSlip(2.2, R, 14, 40, [[380,9,1],[910,8,0.5],[2100,6,0.2]]), 0.6);
  const air = D.svf(D.noise('pink', sec, R), 'lp', D.line([[0,200],[1.5,600],[4,2400]], true), 0.8);
  D.env(air, D.line([[0,0],[1.2,0.4],[3,1],[sec,0]]));
  D.add(x, air, 0.6);
  /* through the open door: the song upstairs, muffled by a whole floor */
  const g = D.buf(sec);
  for(let t=1.6; t<sec; t+=0.11){ D.add(g, thump(110, 45, 0.06), 0.6, t); }
  D.env(g, D.line([[0,0],[2.2,0],[4,0.6],[sec,0]]));
  D.add(x, D.lp(g, 220), 0.6);
  return D.reverb(x, { size:0.75, damp:0.5, wet:0.25, tail:1 });
});
def('gulp', { v:2, pri:2, peak:0.6 }, (i,R)=>{
  const out = D.buf(1.4);
  for(let k=0;k<3;k++){
    const b = D.formant(D.glottal(D.line([[0,160],[0.14,95]], true), 0.16, { rng:R }), 'u', 0.8);
    D.add(out, perc(b, 0.01, 0.15), 0.7, k*0.38);
    D.add(out, D.lp(D.click(0.004, R), 900), 0.4, k*0.38 + 0.1);
  }
  return out;
});
def('scratch', { v:3, pri:0, peak:0.55 }, (i,R)=>{
  /* chalk on cinderblock */
  const sec = 0.55;
  const x = D.svf(D.noise('white', sec, R), 'bpn', D.line([[0,1800],[sec,3600]]), 2.5);
  D.env(x, (t)=>(t < 0.03 ? t/0.03 : 1)*(0.5 + 0.5*Math.sign(Math.sin(t*120)))*Math.min(1,(sec-t)*8));
  return D.add(x, D.hp(D.noise('velvet', sec, R, { density:2000 }), 2000), 0.3);
});
def('magnet', { v:2, pri:2, peak:0.5 }, (i,R)=>D.modal(D.click(0.002, R), D.modes.shelf(R.range(2400, 3000), R).map(m=>({ f:m.f, d:0.05, a:m.a })), 0.2));

/* ============================================================
   MUSIC STEMS (all 9.6 seconds, they loop in step)
============================================================ */
/* stems are rendered over two full periods plus a crossfade, events
   placed in both. the second period has the reverb already settled, and
   its tail crossfades into its own head, which holds the same notes. */
const XF = 1.2;
function periodic(len, R, fn, wetAmt, size){
  const total = 2*len + XF;
  const s = D.sbuf(total);
  const at = (x, g, t, pan)=>{ D.sadd(s, x, g, t, pan); D.sadd(s, x, g, t + len, pan); };
  fn(s, R, at, total);
  const w = D.reverb(s, { size: size || 0.88, damp:0.55, wet: wetAmt === undefined ? 0.4 : wetAmt, tail:0 });
  const a = D.len(len), b = D.len(2*len + XF);
  return D.sloopify({ L:w.L.slice(a, b), R:w.R.slice(a, b) }, XF);
}
function stem(R, fn, wetAmt){ return periodic(LOOP, R, fn, wetAmt); }
function drum(R, f){
  const x = D.buf(1.4);
  D.add(x, D.osc('sine', D.line([[0,f*1.7],[0.08,f],[1,f*0.8]], true), 1.4), 1);
  D.env(x, D.perc(0.002, 1.2));
  D.add(x, D.lp(burst('pink', 0.2, R, 0.002, 0.18), 400), 0.8);
  D.add(x, D.modal(D.click(0.004, R), D.modes.wood(f*1.6, R).map(m=>({ f:m.f, d:0.4, a:m.a })), 0.6), 0.2);
  return x;
}
def('mus_boom', { v:1, pri:1, sr:22050, loop:true, stereo:true, peak:0.8 }, (i,R)=>stem(R, (s, r, at)=>{
  [0, 4, 8, 12].forEach(b=>at(drum(R, 46.25), 1, b*BEAT, (b%8 ? 0.15 : -0.15)));
}, 0.5));
def('mus_boom_fast', { v:1, pri:1, sr:22050, loop:true, stereo:true, peak:0.8 }, (i,R)=>stem(R, (s, r, at)=>{
  [0, 2, 4, 6, 8, 10, 11, 12, 14].forEach(b=>at(drum(R, b % 4 ? 55 : 46.25), b % 4 ? 0.6 : 1, b*BEAT, b%2 ? 0.3 : -0.2));
}, 0.45));
def('mus_drone', { v:1, pri:1, sr:22050, loop:true, stereo:true, peak:0.6 }, (i,R)=>stem(R, (s, r, at, sec)=>{
  /* D, E flat, A flat: root, flat second, tritone */
  [[73.42,-0.4],[77.78,0.4],[103.83,-0.2],[146.83,0.3],[155.56,-0.3]].forEach((n,k)=>{
    const x = D.lp(D.osc('saw', (t)=>n[0]*(1 + 0.003*Math.sin(t*Math.PI*2*(k+1)/LOOP)), sec), (t)=>320 + 180*Math.sin(t*Math.PI*2*2/LOOP + k), 1.4);
    D.sadd(s, x, 0.25, 0, n[1]);
  });
  D.sadd(s, D.env(sine(1174.66, sec), (t)=>0.5 + 0.5*Math.sin(t*Math.PI*2/LOOP)), 0.01, 0, 0.5);
  D.sadd(s, D.env(sine(1244.51, sec), (t)=>0.5 - 0.5*Math.sin(t*Math.PI*2/LOOP)), 0.01, 0, -0.5);
}, 0.5));
def('mus_tick', { v:1, pri:2, sr:22050, loop:true, stereo:true, peak:0.6 }, (i,R)=>stem(R, (s, r, at)=>{
  const pat = [0,3,5,6,9,10,13,14.5];
  pat.forEach((b,k)=>at(D.modal(D.click(0.002, R), D.modes.pipe(R.range(2200, 3400), R).map(m=>({ f:m.f, d:0.18, a:m.a })), 0.3), 0.5, b*BEAT, k%2 ? 0.6 : -0.6));
  /* a breath taken backwards, once a loop */
  const sw = D.svf(D.noise('pink', 2.4, R), 'bpn', 800, 1.4);
  D.env(sw, (t)=>Math.pow(t/2.4, 3));
  at(sw, 0.5, 13*BEAT - 2.4 + 0.3, 0);
}, 0.55));
def('mus_pulse', { v:1, pri:2, sr:22050, loop:true, stereo:true, peak:0.7 }, (i,R)=>stem(R, (s, r, at)=>{
  for(let k=0;k<32;k++){
    const f = (k % 8 === 7) ? 38.89 : 36.71;
    const x = D.lp(D.osc('square', f, 0.25), 260, 2);
    at(perc(x, 0.003, 0.18), k % 4 === 0 ? 1 : 0.6, k*BEAT/2, 0);
  }
}, 0.2));
def('mus_screech', { v:1, pri:2, sr:22050, loop:true, stereo:true, peak:0.5 }, (i,R)=>stem(R, (s, r, at, sec)=>{
  /* strings, very high, too close together */
  [[1174.66,-0.6],[1244.51,0.6],[1661.22,0]].forEach((n,k)=>{
    const x = D.osc('saw', (t)=>n[0]*(1 + 0.006*Math.sin(t*TAU6*(5.5 + k*0.7))), sec);
    const f = D.formant(x, 'i', 1.2);
    D.env(f, (t)=>(0.6 + 0.4*Math.sin(t*Math.PI*2*(k+1)/LOOP))*(0.7 + 0.3*Math.sin(t*31)));
    D.sadd(s, f, 0.25, 0, n[1]);
  });
}, 0.6));
const TAU6 = Math.PI*2;
def('mus_siren', { v:1, pri:2, sr:22050, loop:true, stereo:true, peak:0.6 }, (i,R)=>stem(R, (s, r, at, sec)=>{
  [0, 1].forEach(k=>{
    const g = D.glottal((t)=>{ const u = ((t + k*LOOP/2) % LOOP)/LOOP; return u < 0.5 ? 587.33*Math.pow(415.3/587.33, u*2) : 415.3*Math.pow(587.33/415.3, (u-0.5)*2); }, sec, { jitter:0.002, rng:R });
    D.sadd(s, D.formant(g, 'u', 1.6), 0.35, 0, k ? 0.5 : -0.5);
  });
}, 0.6));

/* ============================================================
   SCARES
============================================================ */
def('stinger', { v:3, pri:0, stereo:true, peak:0.95 }, (i,R)=>{
  const sec = 3.2, s = D.sbuf(sec);
  const chord = [[73.42,-0.3],[155.56,0.3],[207.65,-0.2],[293.66,0.2],[311.13,0]];
  chord.forEach((n,k)=>{
    const x = D.osc('saw', n[0]*(1 + R.bi()*0.004), sec);
    const b = D.svf(x, 'lp', D.line([[0,5200],[0.25,1400],[sec,260]], true), 1.6);
    const v = D.formant(b, 'a', 1 + k*0.05);
    D.env(v, D.perc(0.004, sec*0.9));
    D.sadd(s, D.shape(v, 1.8), 0.32, 0, n[1]);
  });
  /* metal shriek over the top */
  const fm = D.fm(D.line([[0,1800],[1.4,1500]], true), 1.414, D.line([[0,9],[1,1]]), 1.6);
  D.sadd(s, perc(fm, 0.003, 1.4), 0.15, 0.01, 0);
  D.sadd(s, thump(55, 25, 1.4), 1.1, 0, 0);
  D.sadd(s, D.hp(burst('white', 0.5, R, 0.001, 0.45), 2500), 0.35, 0, 0);
  return D.reverb(s, { size:0.9, damp:0.4, wet:0.35, tail:1.2 });
});
def('scare', { v:2, pri:0, stereo:true, peak:0.98 }, (i,R)=>{
  const sec = 2.2, s = D.sbuf(sec);
  /* the door rips open */
  const seal = D.svf(D.noise('pink', 0.15, R), 'bpn', D.line([[0,120],[0.15,600]], true), 2);
  D.sadd(s, perc(seal, 0.005, 0.12), 1.2, 0, 0);
  D.sadd(s, stickSlip(0.4, R, 90, 160, [[700,8,1],[1900,6,0.6]]), 0.5, 0.02, 0.3);
  /* the scream: a throat and a screech through a wavefolder */
  const throat = D.glottal(D.line([[0,220],[0.3,330],[1.6,180]], true), 1.8, { jitter:0.04, rng:R });
  const voice = D.shape(D.formantMorph(throat, 'a', 'e', 1.1), 3.5, 'fold');
  D.env(voice, D.line([[0,0],[0.03,1],[1.2,0.8],[1.8,0]]));
  D.sadd(s, voice, 0.55, 0.05, -0.15);
  const screech = D.fm(D.line([[0,1100],[1.3,280]], true), 1.5, D.line([[0,14],[1.3,4]]), 1.6, { feedback:0.6 });
  D.sadd(s, D.shape(perc(screech, 0.003, 1.5), 2, 'fold'), 0.35, 0.05, 0.2);
  D.sadd(s, thump(85, 22, 1.2), 1.3, 0, 0);
  D.sadd(s, D.hp(burst('white', 1.3, R, 0.002, 1.2), 900), 0.45, 0, 0);
  const out = { L:D.crush(s.L, 7, 2), R:D.crush(s.R, 7, 2) };
  return D.reverb(out, { size:0.7, damp:0.5, wet:0.2, tail:0.8 });
});
def('tinnitus', { v:1, pri:1, stereo:true, peak:0.3 }, (i,R)=>{
  const sec = 5, s = D.sbuf(sec);
  D.sadd(s, D.env(sine(7458.6, sec), D.line([[0,0],[0.05,1],[sec,0]])), 1, 0, -0.2);
  D.sadd(s, D.env(sine(7440, sec), D.line([[0,0],[0.05,0.7],[sec,0]])), 1, 0, 0.2);
  return s;
});
def('static', { v:1, pri:0, loop:true, peak:0.6 }, (i,R)=>{
  const sec = 2.3, out = D.buf(sec);
  D.add(out, D.hp(D.noise('white', sec, R), 1200), 0.7);
  D.add(out, D.bp(D.noise('velvet', sec, R, { density:3000 }), 3400, 0.8), 0.6);
  D.add(out, D.svf(D.osc('square', 59.94, sec), 'bpn', 180, 2), 0.06);
  D.env(out, (t)=>0.8 + 0.2*Math.sin(t*Math.PI*2*59.94/8));
  return D.loopify(out, 0.1);
});
def('death_swell', { v:1, pri:1, stereo:true, peak:0.6 }, (i,R)=>{
  const sec = 4, s = D.sbuf(sec);
  [36.71, 38.89, 55].forEach((f,k)=>{ const x = D.lp(D.osc('saw', f, sec), 200); D.env(x, D.line([[0,0],[2.5,1],[sec,0]])); D.sadd(s, x, 0.4, 0, k-1); });
  return D.reverb(s, { size:0.9, wet:0.5, tail:1 });
});

/* ============================================================
   EASTER EGG SOUNDS
============================================================ */
def('tape_ic', { v:1, pri:3, peak:0.85 }, (i,R)=>{
  /* a cassette of goregrind somebody left in a washing machine. synthesised:
     blast beat, two guitars a semitone apart, a pig squeal on the bar. */
  const sec = 6.4, out = D.buf(sec), step = 0.112;
  const kick = ()=>{ const x = D.buf(0.12); D.add(x, thump(140, 45, 0.09), 1); D.add(x, D.hp(D.click(0.002, R), 2000), 0.4); return x; };
  const snare = ()=>{ const x = D.buf(0.16); D.add(x, D.bp(burst('white', 0.14, R, 0.001, 0.12), 1900, 0.7), 1); D.add(x, D.modal(D.click(0.003, R), D.modes.wood(190, R), 0.12), 0.4); return x; };
  for(let k=0; k*step < sec - 0.2; k++){ D.add(out, kick(), 0.8, k*step); if(k % 2) D.add(out, snare(), 0.7, k*step); }
  const riff = [36.71, 36.71, 34.65, 41.2, 36.71, 38.89, 34.65, 36.71];
  const g1 = D.osc('saw', (t)=>riff[Math.floor(t/0.45) % riff.length]*2, sec);
  const g2 = D.osc('saw', (t)=>riff[Math.floor(t/0.45) % riff.length]*2*1.059, sec);
  let gt = D.add(g1, g2, 1);
  gt = D.svf(D.shape(D.shape(gt, 8), 3, 'fold'), 'peak', 1200, 1, { gain:-6 });
  D.add(out, D.lp(gt, 2600), 0.4);
  for(let b=0; b<sec/1.8; b++){
    const t0 = 0.9 + b*1.8;
    const p = D.glottal(D.line([[0,300],[0.25,880],[0.6,420]], true), 0.65, { jitter:0.03, rng:R });
    const sq = D.shape(D.formantMorph(p, 'i', 'e', 1.3), 3);
    D.env(sq, D.line([[0,0],[0.03,1],[0.6,0]]));
    D.add(out, sq, 0.25, t0);
    const gut = D.formant(D.glottal(68, 0.8, { jitter:0.08, rng:R }), 'o', 0.8);
    D.add(out, D.shape(D.env(gut, D.line([[0,0],[0.05,1],[0.8,0]])), 4), 0.2, t0 + 0.75);
  }
  return cassette(out, R);
});
def('radio_cp', { v:1, pri:3, sr:22050, loop:true, peak:0.55 }, (i,R)=>{
  /* 69.420. static, a melody from very far away, and the same morse forever */
  const sec = 9.6, out = D.buf(sec);
  D.add(out, D.bp(D.noise('white', sec, R), 2400, 0.5), 0.3);
  D.add(out, D.hp(D.noise('velvet', sec, R, { density:600 }), 2000), 0.3);
  const mel = [0,2,4,3,1,0,2,1];
  mel.forEach((d,k)=>{ const f = D.deg('penta', d, 1); const b = D.modal(D.click(0.003, R), D.modes.bell(f), 1.5); D.add(out, D.lp(b, 1600), 0.15, k*1.2); });
  const morse = '...-- ---..   .-. . -.';
  const u = 0.085; let t = 0.3;
  for(const ch of morse){
    if(ch === ' '){ t += u*3; continue; }
    const len = ch === '.' ? u : u*3;
    const tone = D.env(sine(600, len), (tt)=>Math.min(1, tt*400, (len-tt)*400));
    D.add(out, tone, 0.35, t); t += len + u;
  }
  return D.loopify(D.wow(out, { wow:0.4, wowMs:5 }), 0.2);
});
/* a 5x7 font, enough for one word */
const FONT = { H:['10001','10001','10001','11111','10001','10001','10001'], E:['11111','10000','10000','11110','10000','10000','11111'],
  L:['10000','10000','10000','10000','10000','10000','11111'], O:['01110','10001','10001','10001','10001','10001','01110'],
  I:['11111','00100','00100','00100','00100','00100','11111'], S:['01111','10000','10000','01110','00001','00001','11110'],
  A:['01110','10001','10001','11111','10001','10001','10001'], ' ':['00000','00000','00000','00000','00000','00000','00000'] };
def('radio_signal', { v:1, pri:3, sr:32000, loop:true, peak:0.5 }, (i,R)=>{
  /* the second station. it sounds like nothing. it looks like something,
     if you look at it the way you'd look at a signal. */
  const word = 'HELLO', sec = 9.6, out = D.buf(sec);
  const cols = [];
  for(const ch of word){ const g = FONT[ch]; for(let c=0;c<5;c++) cols.push(g.map(r=>r[c] === '1')); cols.push(new Array(7).fill(false)); }
  const colT = 6.0/cols.length, f0 = 1400, f1 = 4600;
  for(let r=0;r<7;r++){
    const f = f1 - (f1-f0)*r/6;
    cols.forEach((col, c)=>{
      if(!col[r]) return;
      const t = 1.6 + c*colT;
      const tone = D.env(sine(f, colT), (tt)=>Math.min(1, tt*80, (colT-tt)*80));
      D.add(out, tone, 0.12, t);
    });
  }
  D.add(out, D.bp(D.noise('pink', sec, R), 900, 0.6), 0.25);
  D.add(out, D.env(D.osc('square', 220, sec), (t)=>Math.sin(t*3)>0.97 ? 0.3 : 0), 0.15);
  return D.loopify(out, 0.2);
});
def('phone_ring', { v:1, pri:3, peak:0.6 }, (i,R)=>{
  /* an old bell phone. from a sausage. */
  const sec = 6, out = D.buf(sec);
  [0, 3].forEach(t0=>{
    const ring = D.add(D.modal(D.noise('velvet', 1.4, R, { density:20 }), D.modes.bell(1046.5), 1.6), D.modal(D.noise('velvet', 1.4, R, { density:20 }), D.modes.bell(1174.66), 1.6), 1);
    D.env(ring, (t)=>t < 1.3 ? 1 : 0);
    D.add(out, ring, 0.5, t0);
  });
  return D.lp(out, 3500);
});
def('quartz', { v:2, pri:3, peak:0.4 }, (i,R)=>D.modal(D.click(0.0008, R), D.modes.shelf(R.range(4200, 5200), R).map(m=>({ f:m.f, d:0.012, a:m.a })), 0.03));
def('spray', { v:2, pri:3, peak:0.5 }, (i,R)=>{
  const out = D.buf(0.6);
  D.add(out, D.modal(D.click(0.002, R), D.modes.wood(1800, R), 0.05), 0.4);
  D.add(out, D.svf(burst('white', 0.4, R, 0.01, 0.38), 'hp', 4000, 0.8), 0.8, 0.03);
  return out;
});
def('paper', { v:3, pri:3, peak:0.5 }, (i,R)=>{
  const sec = 0.7, x = D.noise('velvet', sec, R, { density:1500 });
  D.env(x, D.line([[0,0],[0.05,1],[0.4,0.6],[sec,0]]));
  return D.bp(x, 2600, 0.6);
});
def('sauce_trip', { v:1, pri:3, stereo:true, peak:0.6 }, (i,R)=>{
  const sec = 3, s = D.sbuf(sec);
  const sw = D.svf(D.noise('pink', sec, R), 'bpn', D.line([[0,300],[sec,4000]], true), 4);
  D.env(sw, (t)=>Math.pow(t/sec, 2));
  D.sadd(s, D.haas(sw, 18), 0.8);
  [0, 7, 12, 19].forEach((st,k)=>D.sadd(s, D.env(sine(D.midi(62+st), sec), (t)=>Math.pow(t/sec, 2.5)), 0.1, 0, k%2 ? 0.6 : -0.6));
  return s;
});

/* ============================================================
   UI + MENUS
============================================================ */
def('ui_click', { v:3, pri:0, peak:0.4 }, (i,R)=>{
  const out = D.buf(0.2);
  D.add(out, thump(160, 80, 0.06), 0.6);
  D.add(out, D.modal(D.click(0.002, R), D.modes.wood(1100 + i*90, R).map(m=>({ f:m.f, d:0.04, a:m.a })), 0.1), 0.5);
  return D.lp(out, 3000);
});
def('ui_down', { v:1, pri:0, stereo:true, peak:0.7 }, (i,R)=>{
  /* "go down": the floor of the shop opening under you */
  const sec = 2.8, s = D.sbuf(sec);
  D.sadd(s, thump(70, 30, 1.2), 1, 0, 0);
  [36.71, 77.78].forEach((f,k)=>{ const x = D.lp(D.osc('saw', f, sec), D.line([[0,800],[sec,120]], true)); D.env(x, D.perc(0.01, sec)); D.sadd(s, x, 0.35, 0, k ? 0.4 : -0.4); });
  D.sadd(s, D.modal(D.click(0.004, R), D.modes.plate(98, R), 2), 0.25, 0, 0);
  return D.reverb(s, { size:0.9, damp:0.5, wet:0.45, tail:1.5 });
});
def('ir_basement', { v:1, pri:0, stereo:true, peak:0.8 }, (i,R)=>D.impulse(2.3, { rng:R, decay:3.2, bright:6500, dark:700 }));

/* ============================================================
   THE VISUAL NOVEL
============================================================ */
def('vn_v', { v:12, pri:0, peak:0.45 }, (i,R)=>{
  /* its voice: a fridge trying to make a syllable */
  const f = D.deg('penta', i % 5, -1);
  const sec = R.range(0.06, 0.1);
  const g = D.glottal(D.line([[0,f*1.03],[sec,f*0.97]]), sec, { jitter:0.01, rng:R });
  const v = D.formant(g, R.pick(['o','u','m','a']), R.range(0.9, 1.1));
  D.add(v, D.lp(D.osc('saw', 73.42, sec), 300), 0.3);
  D.env(v, D.line([[0,0],[0.008,1],[sec*0.7,0.7],[sec,0]]));
  return D.crush(v, 10, 1);
});
def('vn_y', { v:4, pri:0, peak:0.25 }, (i,R)=>D.modal(D.click(0.001, R), D.modes.wood(D.deg('penta', i+2, 2), R).map(m=>({ f:m.f, d:0.03, a:m.a })), 0.06));
def('vn_click', { v:2, pri:0, peak:0.35 }, (i,R)=>D.modal(D.click(0.002, R), D.modes.wood(1500 + i*200, R).map(m=>({ f:m.f, d:0.05, a:m.a })), 0.12));
def('vn_heart', { v:2, pri:1, stereo:true, peak:0.5 }, (i,R)=>{
  const s = D.sbuf(2.4);
  [i ? 74 : 69, i ? 78 : 74, 81].forEach((m,k)=>D.sadd(s, D.modal(D.click(0.002, R), D.modes.bell(D.midi(m)), 2.2), 0.4, k*0.07, k-1));
  return D.reverb(s, { size:0.7, wet:0.3, tail:0.6 });
});
def('vn_slam', { v:1, pri:1, stereo:true, peak:0.8 }, (i,R)=>{
  const x = D.buf(0.8);
  D.add(x, thump(90, 30, 0.4), 1); D.add(x, D.modal(D.click(0.004, R), D.modes.plate(140, R), 0.8), 0.5); D.add(x, D.lp(burst('brown', 0.2, R), 400), 1);
  return D.reverb(x, { size:0.8, wet:0.35, tail:1 });
});
def('vn_hiss', { v:1, pri:2, peak:0.6 }, (i,R)=>{
  /* a can of soda: the tab, the crack, the fizz */
  const out = D.buf(2);
  D.add(out, D.modal(D.click(0.002, R), D.modes.shelf(2400, R).map(m=>({ f:m.f, d:0.04, a:m.a })), 0.1), 0.5);
  D.add(out, D.svf(burst('white', 0.08, R, 0.001, 0.07), 'bpn', 1800, 1), 0.9, 0.12);
  const fz = D.hp(D.noise('velvet', 1.8, R, { density:5000 }), 3500);
  D.env(fz, D.line([[0,0],[0.02,1],[1.8,0]]));
  D.add(out, fz, 0.5, 0.15);
  return out;
});
def('vn_pop', { v:1, pri:2, peak:0.6 }, (i,R)=>{
  /* a plug coming out of the wall */
  const out = D.buf(0.5);
  D.add(out, D.modal(D.click(0.002, R), D.modes.wood(900, R), 0.1), 0.6);
  D.add(out, D.hp(burst('velvet', 0.06, R, 0.001, 0.05), 3000), 0.6, 0.01);
  D.add(out, thump(60, 30, 0.2), 0.3);
  return out;
});
def('vn_open', { v:1, pri:1, peak:0.6 }, (i,R)=>{
  const out = D.buf(1.6);
  const suck = D.svf(D.noise('pink', 0.15, R), 'bpn', D.line([[0,120],[0.15,500]], true), 2);
  D.add(out, perc(suck, 0.01, 0.13), 1);
  D.add(out, stickSlip(0.9, R, 30, 55, [[450,9,1],[1100,7,0.4]]), 0.3, 0.1);
  D.add(out, D.lp(D.noise('pink', 1.4, R), 1500), 0.08, 0.15);
  return out;
});
def('vn_hum', { v:1, pri:1, sr:22050, loop:true, peak:0.5 }, (i,R)=>{
  const sec = 6.2, out = D.buf(sec);
  D.add(out, sine(73.42, sec), 0.5);
  D.add(out, D.lp(D.osc('saw', 73.42, sec), 260), 0.35);
  D.add(out, D.lp(D.noise('pink', sec, R), 300), 0.25);
  return D.loopify(out, 0.25);
});
/* the music box: a tine (FM bell) and the click of the comb before each note */
function box(R, midi, sec){
  const f = D.midi(midi);
  const x = D.add(D.env(D.fm(f, 3.5, D.line([[0,2.4],[0.4,0.3]]), sec), D.perc(0.002, sec*0.9)), D.env(sine(f*2, sec), D.perc(0.001, 0.5)), 0.2);
  D.add(x, D.hp(D.click(0.001, R), 3000), 0.3);
  return x;
}
function boxTheme(R, notes, padNotes, len, wet, slow){
  const beat = len/notes.length;
  const st = periodic(len, R, (s, r, at, total)=>{
    notes.forEach((m,k)=>{ if(m === null) return; at(box(R, m + (R.bi()*0.08), 1.8), 0.32, k*beat + R()*0.012, Math.sin(k*1.7)*0.4); });
    if(padNotes) padNotes.forEach((m,k)=>{
      const x = D.lp(D.add(D.osc('saw', D.midi(m), total), D.osc('saw', D.midi(m)*1.004, total), 1), 700);
      D.env(x, (t)=>0.6 + 0.4*Math.sin(t*Math.PI*2/len + k));
      D.sadd(s, x, 0.035, 0, k%2 ? 0.5 : -0.5);
    });
    D.sadd(s, D.hp(D.noise('velvet', total, R, { density:30 }), 1500), 0.08, 0, 0);
  }, wet || 0.35, 0.82);
  return slow ? { L:D.wow(st.L, { wow:1/len*2, wowMs:7 }), R:D.wow(st.R, { wow:1/len*2, wowMs:7 }) } : st;
}
/* melodies in D minor. null is a rest. */
def('mus_room', { v:1, pri:1, sr:22050, loop:true, stereo:true, peak:0.55 }, (i,R)=>boxTheme(R,
  [74,77,81,79, 77,74,72,74, 77,null,76,74, 72,69,72,null], [50,57,62], 12.8, 0.35));
def('mus_love', { v:1, pri:2, sr:22050, loop:true, stereo:true, peak:0.55 }, (i,R)=>boxTheme(R,
  [77,81,84,81, 79,77,76,77, 81,79,77,74, 76,77,null,null], [53,60,65], 9.6, 0.3));
def('mus_sad', { v:1, pri:2, sr:22050, loop:true, stereo:true, peak:0.5 }, (i,R)=>boxTheme(R,
  [74,null,72,null, 69,null,70,69, 65,null,67,null, 62,null,null,null], [50,53,57], 16, 0.5, true));
def('mus_tense', { v:1, pri:2, sr:22050, loop:true, stereo:true, peak:0.55 }, (i,R)=>{
  return boxTheme(R, [62,null,63,null, 62,null,null,68, 62,null,63,null, null,null,null,null], [38,39,26], 9.6, 0.45, false);
});
def('mus_dark', { v:1, pri:2, sr:22050, loop:true, stereo:true, peak:0.4 }, (i,R)=>bed(9.6, R, (x, r, ch)=>{
  D.add(x, D.lp(D.noise('brown', 9.6, r), 90), 1);
  for(let k=0;k<6;k++) D.add(x, plip(r), 0.1, r()*9);
  D.add(x, D.env(sine(7458.6 + ch*12, 9.6), (t)=>0.3 + 0.3*Math.sin(t*0.4)), 0.006);
}));

function trimTail(out){
  const L = out.L || out, Rr = out.R || null, thr = 0.0006;
  let n = L.length;
  while(n > 64 && Math.abs(L[n-1]) < thr && (!Rr || Math.abs(Rr[n-1]) < thr)) n--;
  n = Math.min(L.length, n + 64);
  if(n === L.length) return out;
  return Rr ? { L:L.slice(0,n), R:Rr.slice(0,n) } : L.slice(0,n);
}
root.VBANK = BANK;
root.VBANK_VERSION = 'vendor-snd-3';
/* render one entry, all variants. returns { name, sr, loop, stereo, data:[ {L,R} | Float32Array ] } */
root.VBANK_RENDER = function(name){
  const e = BANK[name];
  D.setSR(e.sr);
  const data = [];
  for(let i=0;i<e.v;i++){
    let seed = 0; for(let k=0;k<name.length;k++) seed = (seed*31 + name.charCodeAt(k)) >>> 0;
    const R = D.rng(seed + i*7919 + 1);
    let out = e.fn(i, R);
    if(out.L){ if(!e.stereo) out = out.L; }
    if(out.L){ if(!e.loop){ D.dc(out.L); D.dc(out.R); } D.snorm(out, e.peak); if(!e.loop) D.sfade(out, 0.0005, 0.02); }
    else { if(!e.loop) D.dc(out); D.normalize(out, e.peak); if(!e.loop) D.fade(out, 0.0005, 0.02); }
    if(!e.loop) out = trimTail(out);
    data.push(out);
  }
  return { name, sr:e.sr, loop:!!e.loop, stereo:!!e.stereo, data };
};
})(typeof self !== 'undefined' ? self : (typeof globalThis !== 'undefined' ? globalThis : this));
