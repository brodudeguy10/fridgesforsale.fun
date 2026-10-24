/* ============================================================
   FRIDGE PALACE HEIST: the noise
   guns (a crack, a body, a thump, the room answering), brass on
   marble, reloads, bullets finding metal and wood and glass, the
   alarm bell, sirens outside, a room full of fridges screaming,
   the drill, the vault door, heartbeat, breath, the band getting
   its plug pulled, and a score rendered in code: tense, action, boss.
============================================================ */
import * as THREE from '../lib/three.module.min.js';

const R = (a, b)=>a + Math.random()*(b - a);

export class HeistAudio {
  constructor(A){
    this.A = A; this.ctx = A.ctx;
    this.loops = {};
    if(!this.ctx) return;
    const c = this.ctx;
    /* the score gets its own bus so it can fade in and out under everything */
    this.scoreG = c.createGain(); this.scoreG.gain.value = 0; this.scoreG.connect(A.mus || A.master);
    this.stems = {};
    /* a harder room for gunshots: longer, darker */
    this.gunVerb = c.createConvolver(); this.gunVerb.buffer = A.ir(2.4, 2.2);
    this.gunVerbG = c.createGain(); this.gunVerbG.gain.value = 0.32; this.gunVerb.connect(this.gunVerbG); this.gunVerbG.connect(A.master);
    /* muffle: during the vault lock-in everything outside goes underwater */
    this.muffle = c.createBiquadFilter(); this.muffle.type = 'lowpass'; this.muffle.frequency.value = 22000;
  }
  ok(){ return !!this.ctx; }
  /* a destination: positional or not, with a send to the gun room */
  dest(pos, wet){
    const A = this.A, c = this.ctx; if(!c) return null;
    const g = A.out(pos, 0);
    const w = c.createGain(); w.gain.value = wet === undefined ? 0.6 : wet; g.connect(w); w.connect(this.gunVerb);
    return g;
  }
  /* ---------- guns ---------- */
  gun(kind, pos, o){
    if(!this.ctx) return; o = o || {};
    const A = this.A, mine = !pos, far = o.far || 1;
    const d = this.dest(pos, mine ? 0.7 : 0.9);
    const vol = (o.vol || 1)*(mine ? 1 : 0.9);
    const P = {
      revolver:{ crack:2600, cq:0.9, cg:0.9, body:900, bg:0.8, bd:0.22, th:110, tg:0.7, td:0.2, ring:1, tail:0.5 },
      shotgun:{ crack:1800, cq:0.7, cg:0.9, body:650, bg:1.0, bd:0.32, th:85, tg:0.9, td:0.3, ring:0, tail:0.8 },
      smg:{ crack:3200, cq:1.1, cg:0.55, body:1200, bg:0.45, bd:0.1, th:140, tg:0.35, td:0.09, ring:0, tail:0.25 },
      pistol:{ crack:2900, cq:1.0, cg:0.6, body:1100, bg:0.55, bd:0.14, th:130, tg:0.45, td:0.12, ring:0, tail:0.35 },
      rifle:{ crack:3400, cq:0.8, cg:0.8, body:1000, bg:0.7, bd:0.16, th:100, tg:0.6, td:0.15, ring:0, tail:0.5 },
      heavy:{ crack:1400, cq:0.6, cg:0.7, body:500, bg:1.0, bd:0.35, th:70, tg:1.0, td:0.35, ring:0, tail:0.9 }
    }[kind] || { crack:2600, cq:0.9, cg:0.9, body:900, bg:0.8, bd:0.22, th:110, tg:0.7, td:0.2, ring:1, tail:0.5 };
    A.burst({ ff:P.crack*R(0.9, 1.1), q:P.cq, d:0.035, g:P.cg*vol, dest:d });
    A.burst({ ff:6000, type:'highpass', q:0.5, d:0.02, g:0.4*vol, dest:d });
    A.burst({ ff:P.body, ff2:P.body*0.4, type:'lowpass', q:0.8, d:P.bd, g:P.bg*vol, dest:d });
    A.tone({ f:P.th, f2:P.th*0.35, d:P.td, g:P.tg*vol, type:'sine', dest:d });
    if(P.ring) A.tone({ f:2900, f2:2600, d:0.18, g:0.05*vol, type:'triangle', dest:d });
    /* the room slapping back */
    A.burst({ ff:420, type:'lowpass', q:0.5, a:0.02, d:P.tail, g:0.25*vol*far, t:0.03, dest:d });
  }
  dry(){ if(!this.ctx) return; this.A.tone({ f:2400, type:'square', d:0.02, g:0.06, filt:'bandpass', ff:3000 }); this.A.burst({ ff:3500, q:4, d:0.02, g:0.15 }); }
  freonStart(){
    if(!this.ctx || this.loops.freon) return;
    const c = this.ctx, d = this.A.out(null, 0.2);
    const s = c.createBufferSource(); s.buffer = this.A.nb; s.loop = true;
    const f = c.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 1800;
    const f2 = c.createBiquadFilter(); f2.type = 'peaking'; f2.frequency.value = 5200; f2.gain.value = 8;
    const g = c.createGain(); g.gain.value = 0; g.gain.setTargetAtTime(0.22, c.currentTime, 0.05);
    const lfo = c.createOscillator(); lfo.frequency.value = 7; const lg = c.createGain(); lg.gain.value = 0.05; lfo.connect(lg); lg.connect(g.gain); lfo.start();
    s.connect(f); f.connect(f2); f2.connect(g); g.connect(d); s.start();
    this.loops.freon = { stop:()=>{ g.gain.setTargetAtTime(0, c.currentTime, 0.08); setTimeout(()=>{ try{ s.stop(); lfo.stop(); }catch(e){} }, 400); } };
    this.A.burst({ ff:900, ff2:3000, q:1, d:0.15, g:0.2 });
  }
  freonStop(){ if(this.loops.freon){ this.loops.freon.stop(); this.loops.freon = null; this.A.burst({ ff:2400, ff2:600, q:2, d:0.2, g:0.1 }); } }
  /* reload foley */
  click(f, g, t){ if(!this.ctx) return; this.A.burst({ ff:f || 3200, q:5, d:0.025, g:g || 0.3, t }); this.A.tone({ f:(f || 3200)*0.6, type:'square', d:0.015, g:0.03, t, filt:'bandpass', ff:f || 3200 }); }
  slide(t, up){ if(!this.ctx) return; this.A.burst({ ff:up ? 1200 : 2400, ff2:up ? 2600 : 1100, q:1.2, a:0.01, d:0.09, g:0.25, t }); }
  clack(t){ if(!this.ctx) return; this.A.burst({ ff:1400, q:2, d:0.05, g:0.45, t }); this.A.tone({ f:240, f2:160, d:0.05, g:0.15, t }); }
  shell(pos, plastic){ if(!this.ctx) return; const d = this.A.out(pos, 0.2); if(plastic){ this.A.burst({ ff:1200, q:3, d:0.04, g:0.12, dest:d }); } else { this.A.bell(R(4200, 5200), 0, 0.03, d, 0.12); this.A.bell(R(5600, 6400), 0.06, 0.02, d, 0.08); } }
  /* ---------- impacts ---------- */
  hit(kind, pos){
    if(!this.ctx) return; const A = this.A, d = A.out(pos, 0.3);
    if(kind === 'fridge'){ A.bell(R(1400, 2200), 0, 0.12, d, 0.18); A.burst({ ff:2600, q:2, d:0.04, g:0.4, dest:d }); A.tone({ f:220, f2:120, d:0.06, g:0.15, dest:d }); }
    else if(kind === 'metal'){ A.bell(R(2600, 3800), 0, 0.08, d, 0.3); A.burst({ ff:4200, q:3, d:0.03, g:0.25, dest:d }); }
    else if(kind === 'wood'){ A.burst({ ff:900, q:1.4, d:0.07, g:0.4, dest:d }); A.tone({ f:180, f2:90, d:0.08, g:0.15, dest:d }); }
    else if(kind === 'glass'){ for(let i=0;i<9;i++){ A.bell(R(3000, 7000), i*0.025 + Math.random()*0.03, 0.03, d, 0.25); } A.burst({ ff:5000, q:0.8, d:0.3, g:0.3, dest:d }); }
    else if(kind === 'soft'){ A.burst({ ff:500, ff2:200, type:'lowpass', q:1, d:0.12, g:0.45, dest:d }); A.burst({ ff:1400, q:3, d:0.06, g:0.15, t:0.03, dest:d }); }
    else if(kind === 'shield'){ A.bell(R(800, 1100), 0, 0.14, d, 0.35); A.burst({ ff:2000, q:1, d:0.06, g:0.35, dest:d }); }
    else if(kind === 'ice'){ for(let i=0;i<6;i++) A.bell(R(2400, 5200), i*0.03, 0.04, d, 0.3); A.burst({ ff:3800, q:1, d:0.2, g:0.25, dest:d }); }
    else { A.burst({ ff:R(1200, 2400), q:1.5, d:0.05, g:0.3, dest:d }); A.burst({ ff:300, type:'lowpass', d:0.08, g:0.2, dest:d }); }
  }
  squelch(pos, big){ if(!this.ctx) return; const A = this.A, d = A.out(pos, 0.4); A.burst({ ff:700, ff2:180, type:'lowpass', q:3, d:big ? 0.4 : 0.18, g:0.5, dest:d }); for(let i=0;i<(big ? 6 : 2);i++) A.burst({ ff:R(600, 1800), q:6, d:0.05, g:0.15, t:0.05 + i*0.05, dest:d }); }
  whiz(pos){ if(!this.ctx) return; const A = this.A, d = A.out(pos, 0); A.burst({ ff:3800, ff2:1300, q:3, a:0.005, d:0.12, g:0.35, dest:d }); A.burst({ ff:7000, type:'highpass', d:0.015, g:0.3, dest:d }); }
  ricochet(pos){ if(!this.ctx) return; const A = this.A, d = A.out(pos, 0.4); A.tone({ f:R(2600, 3400), f2:R(900, 1400), glide:0.35, d:0.4, g:0.05, type:'sine', dest:d }); }
  hitmark(kill){ if(!this.ctx) return; const A = this.A; if(kill){ A.tone({ f:180, f2:70, d:0.18, g:0.35 }); A.burst({ ff:1600, q:2, d:0.05, g:0.25 }); } else { A.tone({ f:2600, type:'square', d:0.02, g:0.05, filt:'bandpass', ff:2600 }); } }
  hurt(){ if(!this.ctx) return; const A = this.A; A.burst({ ff:300, type:'lowpass', d:0.18, g:0.7 }); A.tone({ f:90, f2:50, d:0.2, g:0.5 }); A.burst({ ff:2400, q:4, d:0.06, g:0.2 }); }
  /* ---------- big things ---------- */
  explosion(pos, size){
    if(!this.ctx) return; const A = this.A, d = this.dest(pos, 1.0), s = size || 1;
    A.tone({ f:70, f2:22, d:1.4*s, g:1.2, dest:d }); A.tone({ f:45, f2:18, d:1.8*s, g:0.9, dest:d });
    A.burst({ ff:900, ff2:120, type:'lowpass', q:0.6, d:1.6*s, g:1.1, dest:d });
    A.burst({ ff:3000, q:0.5, d:0.15, g:0.9, dest:d });
    for(let i=0;i<14;i++) A.burst({ ff:R(800, 3000), q:2, d:0.04, g:0.2, t:0.3 + Math.random()*1.4, dest:d });
  }
  vaultDoor(pos, open){
    if(!this.ctx) return; const A = this.A, d = this.dest(pos, 0.9);
    const c = this.ctx, o = c.createOscillator(); o.type = 'sawtooth'; o.frequency.setValueAtTime(48, c.currentTime); o.frequency.linearRampToValueAtTime(open ? 38 : 60, c.currentTime + 2.4);
    const f = c.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 400; f.Q.value = 6;
    const g = c.createGain(); g.gain.setValueAtTime(0, c.currentTime); g.gain.linearRampToValueAtTime(0.35, c.currentTime + 0.3); g.gain.linearRampToValueAtTime(0, c.currentTime + 2.6);
    o.connect(f); f.connect(g); g.connect(d); o.start(); o.stop(c.currentTime + 2.7);
    A.bell(110, open ? 2.4 : 0.9, 0.5, d, 2.5); A.burst({ ff:300, type:'lowpass', d:0.8, g:0.8, t:open ? 2.4 : 0.9, dest:d });
  }
  slam(pos){ if(!this.ctx) return; const A = this.A, d = this.dest(pos, 1); A.bell(90, 0, 0.7, d, 3); A.burst({ ff:250, type:'lowpass', d:1.2, g:1, dest:d }); A.tone({ f:60, f2:30, d:1, g:0.9, dest:d }); }
  /* ---------- loops ---------- */
  stopLoop(k, fade){ const L = this.loops[k]; if(L){ try{ L.stop(fade); }catch(e){} this.loops[k] = null; } }
  alarm(on, pos){
    if(!this.ctx) return; if(!on){ this.stopLoop('alarm'); return; } if(this.loops.alarm) return;
    const c = this.ctx, d = this.A.out(null, 0.6);
    const o = c.createOscillator(); o.type = 'square'; o.frequency.value = 960;
    const o2 = c.createOscillator(); o2.type = 'square'; o2.frequency.value = 1440;
    const am = c.createGain(); am.gain.value = 0;
    const lfo = c.createOscillator(); lfo.type = 'square'; lfo.frequency.value = 18; const lg = c.createGain(); lg.gain.value = 0.5; lfo.connect(lg); lg.connect(am.gain);
    const f = c.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 1400; f.Q.value = 1.2;
    const g = c.createGain(); g.gain.value = 0; g.gain.setTargetAtTime(0.05, c.currentTime, 0.2);
    o.connect(am); o2.connect(am); am.connect(f); f.connect(g); g.connect(d); o.start(); o2.start(); lfo.start();
    /* the bell rings in bursts, like a real one */
    const pulse = c.createOscillator(); pulse.type = 'square'; pulse.frequency.value = 0.5; const pg = c.createGain(); pg.gain.value = 0.025; pulse.connect(pg); pg.connect(g.gain); pulse.start();
    this.loops.alarm = { g, stop:()=>{ g.gain.setTargetAtTime(0, c.currentTime, 0.3); setTimeout(()=>{ try{ o.stop(); o2.stop(); lfo.stop(); pulse.stop(); }catch(e){} }, 1500); } };
  }
  sirens(on, pos){
    if(!this.ctx) return; if(!on){ this.stopLoop('sirens'); return; } if(this.loops.sirens) return;
    const c = this.ctx, d = this.A.out(pos || new THREE.Vector3(0, 2, 30), 0.3);
    const nodes = [];
    for(let k=0;k<3;k++){
      const o = c.createOscillator(); o.type = 'sawtooth';
      const base = 700 + k*60, lfo = c.createOscillator(); lfo.frequency.value = k === 1 ? 2.8 : 0.22 + k*0.05; lfo.type = k === 1 ? 'square' : 'triangle';
      const lg = c.createGain(); lg.gain.value = k === 1 ? 250 : 420; lfo.connect(lg); lg.connect(o.frequency); o.frequency.value = base;
      const f = c.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 2200;
      const g = c.createGain(); g.gain.value = 0.035;
      o.connect(f); f.connect(g); g.connect(d); o.start(); lfo.start(); nodes.push(o, lfo);
    }
    this.loops.sirens = { stop:()=>nodes.forEach(n=>{ try{ n.stop(); }catch(e){} }) };
  }
  drill(on, pos){
    if(!this.ctx) return; if(!on){ this.stopLoop('drill'); return; } if(this.loops.drill) return;
    const c = this.ctx, d = this.dest(pos, 0.5);
    const o = c.createOscillator(); o.type = 'sawtooth'; o.frequency.value = 180;
    const o2 = c.createOscillator(); o2.type = 'square'; o2.frequency.value = 362;
    const wob = c.createOscillator(); wob.frequency.value = 9; const wg = c.createGain(); wg.gain.value = 9; wob.connect(wg); wg.connect(o.frequency); wg.connect(o2.frequency);
    const s = c.createBufferSource(); s.buffer = this.A.nb; s.loop = true; const nf = c.createBiquadFilter(); nf.type = 'bandpass'; nf.frequency.value = 3200; nf.Q.value = 2; const ng = c.createGain(); ng.gain.value = 0.12;
    const f = c.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 2400;
    const g = c.createGain(); g.gain.value = 0; g.gain.setTargetAtTime(0.09, c.currentTime, 0.4);
    o.connect(f); o2.connect(f); s.connect(nf); nf.connect(ng); ng.connect(g); f.connect(g); g.connect(d);
    o.start(); o2.start(); wob.start(); s.start();
    this.loops.drill = { o, o2, g, stop:()=>{ g.gain.setTargetAtTime(0, c.currentTime, 0.15); o.frequency.setTargetAtTime(60, c.currentTime, 0.3); setTimeout(()=>{ try{ o.stop(); o2.stop(); wob.stop(); s.stop(); }catch(e){} }, 900); } };
  }
  drillJam(pos){ if(!this.ctx) return; const L = this.loops.drill; if(L){ const t = this.ctx.currentTime; L.o.frequency.setTargetAtTime(70, t, 0.2); L.o2.frequency.setTargetAtTime(140, t, 0.2); L.g.gain.setTargetAtTime(0.03, t, 0.3); } const A = this.A, d = A.out(pos, 0.4); A.burst({ ff:600, q:3, d:0.4, g:0.5, dest:d }); A.tone({ f:90, f2:40, d:0.5, g:0.4, type:'square', filt:'lowpass', ff:400, dest:d }); }
  drillResume(){ const L = this.loops.drill; if(L){ const t = this.ctx.currentTime; L.o.frequency.setTargetAtTime(180, t, 0.4); L.o2.frequency.setTargetAtTime(362, t, 0.4); L.g.gain.setTargetAtTime(0.09, t, 0.3); } }
  heartbeat(on, rate){
    if(!this.ctx) return;
    if(!on){ if(this._hb){ clearTimeout(this._hb); this._hb = null; } return; }
    this._hbRate = rate || 1;
    if(this._hb) return;
    const beat = ()=>{ const A = this.A; A.tone({ f:60, f2:38, d:0.12, g:0.6, type:'sine' }); A.tone({ f:55, f2:36, d:0.12, g:0.45, type:'sine', t:0.22 }); this._hb = setTimeout(beat, 900/this._hbRate); };
    beat();
  }
  breath(){ if(!this.ctx) return; const A = this.A; A.burst({ ff:1100, q:0.8, a:0.25, d:0.4, g:0.05, type:'bandpass' }); A.burst({ ff:700, q:0.8, a:0.15, d:0.6, g:0.04, t:0.9, type:'bandpass' }); }
  /* a room full of fridges screaming */
  scream(pos, n){
    if(!this.ctx) return; const A = this.A, d = A.out(pos, 0.7);
    for(let i=0;i<(n || 14);i++){ const t = Math.random()*0.5, f = R(380, 900); A.tone({ f, f2:f*R(1.3, 1.9), glide:R(0.3, 0.7), type:'sawtooth', a:0.03, d:R(0.6, 1.2), g:0.02, t, dest:d, filt:'bandpass', ff:R(1200, 2600), q:4 }); }
    A.burst({ ff:2000, q:0.5, a:0.05, d:1.2, g:0.08, dest:d });
  }
  whimper(pos){ if(!this.ctx) return; const A = this.A, d = A.out(pos, 0.5); const f = R(500, 800); A.tone({ f, f2:f*0.7, glide:0.4, type:'sawtooth', a:0.05, d:0.5, g:0.012, dest:d, filt:'bandpass', ff:1500, q:6 }); }
  /* a shout: formants on a buzz. the words are on screen. */
  shout(pos, low){
    if(!this.ctx) return; const A = this.A, c = this.ctx, d = pos ? A.out(pos, 0.5) : A.out(null, 0.4);
    const V = [[730, 1090], [600, 1200], [400, 1700], [700, 1250]];
    let t = c.currentTime;
    for(let s=0; s<4; s++){
      const o = c.createOscillator(); o.type = 'sawtooth'; o.frequency.setValueAtTime((low ? 110 : 150)*R(0.95, 1.1), t); o.frequency.linearRampToValueAtTime((low ? 95 : 130), t + 0.16);
      const v = V[s % V.length];
      const f1 = c.createBiquadFilter(); f1.type = 'bandpass'; f1.frequency.value = v[0]; f1.Q.value = 6;
      const f2 = c.createBiquadFilter(); f2.type = 'bandpass'; f2.frequency.value = v[1]; f2.Q.value = 8;
      const g = c.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.25, t + 0.02); g.gain.linearRampToValueAtTime(0, t + 0.15);
      o.connect(f1); o.connect(f2); f1.connect(g); f2.connect(g); g.connect(d); o.start(t); o.stop(t + 0.2);
      t += 0.14 + Math.random()*0.04;
    }
  }
  /* clement's voice: low, rough little syllables */
  voice(text, low){
    if(!this.ctx) return; const A = this.A, c = this.ctx, d = A.out(null, 0.2);
    const n = Math.min(26, Math.ceil((text || '').length/3));
    let t = c.currentTime;
    for(let i=0;i<n;i++){ const f = (low ? 82 : 140)*R(0.85, 1.25); A.tone({ f, type:'square', d:0.06, g:0.025, t:t - c.currentTime, dest:d, filt:'bandpass', ff:R(500, 900), q:3 }); t += R(0.06, 0.1); }
  }
  /* the band gets its plug pulled */
  tapeStop(src){
    if(!this.ctx || !src) return;
    const c = this.ctx, t = c.currentTime;
    try{ src.playbackRate.cancelScheduledValues(t); src.playbackRate.setValueAtTime(src.playbackRate.value, t); src.playbackRate.exponentialRampToValueAtTime(0.06, t + 0.9); src.stop(t + 1.0); }catch(e){}
    this.A.tone({ f:200, f2:30, glide:0.9, d:0.9, g:0.1, type:'sawtooth', filt:'lowpass', ff:600 });
  }
  /* ---------- the score ---------- */
  async renderScore(kind){
    if(!this.ctx || this.stems[kind] || this['_r' + kind]) return this.stems[kind];
    this['_r' + kind] = true;
    const sr = 22050, bpm = kind === 'boss' ? 150 : kind === 'action' ? 138 : 96;
    const beat = 60/bpm, bars = kind === 'tense' ? 8 : 16, len = bars*beat*4;
    const oc = new OfflineAudioContext(2, Math.ceil(sr*(len + 1.5)), sr);
    let seed = kind === 'boss' ? 7 : kind === 'action' ? 3 : 5; const rnd = ()=>{ seed = (seed*16807) % 2147483647; return seed/2147483647; };
    const master = oc.createGain(); master.gain.value = 0.5; master.connect(oc.destination);
    const ws = oc.createWaveShaper(); { const n = 1024, cv = new Float32Array(n); for(let i=0;i<n;i++){ const x = i/n*2 - 1; cv[i] = Math.tanh(x*2.5); } ws.curve = cv; }
    const dist = oc.createGain(); dist.gain.value = 0.7; ws.connect(dist); dist.connect(master);
    const nb = oc.createBuffer(1, sr, sr); { const d = nb.getChannelData(0); for(let i=0;i<d.length;i++) d[i] = Math.random()*2 - 1; }
    const NOTE = n=>440*Math.pow(2, (n - 69)/12);
    /* D minor, with a flat second for menace */
    const roots = kind === 'boss' ? [38, 38, 39, 38, 41, 39, 38, 36] : [38, 38, 41, 39, 38, 38, 36, 39];
    const hit = (t, ff, type, a, dd, g, dest)=>{ const s = oc.createBufferSource(); s.buffer = nb; const f = oc.createBiquadFilter(); f.type = type; f.frequency.value = ff; const e = oc.createGain(); e.gain.setValueAtTime(0, t); e.gain.linearRampToValueAtTime(g, t + a); e.gain.exponentialRampToValueAtTime(0.0001, t + a + dd); s.connect(f); f.connect(e); e.connect(dest || master); s.start(t, rnd()*0.5); s.stop(t + a + dd + 0.05); };
    const kick = (t, g)=>{ const o = oc.createOscillator(); o.frequency.setValueAtTime(140, t); o.frequency.exponentialRampToValueAtTime(42, t + 0.12); const e = oc.createGain(); e.gain.setValueAtTime(g || 0.6, t); e.gain.exponentialRampToValueAtTime(0.0001, t + 0.35); o.connect(e); e.connect(ws); o.start(t); o.stop(t + 0.4); };
    const tone = (f, t, d, type, g, ff, dest)=>{ const o = oc.createOscillator(); o.type = type; o.frequency.value = f; const flt = oc.createBiquadFilter(); flt.type = 'lowpass'; flt.frequency.value = ff || 1200; const e = oc.createGain(); e.gain.setValueAtTime(0, t); e.gain.linearRampToValueAtTime(g, t + 0.01); e.gain.exponentialRampToValueAtTime(0.0001, t + d); o.connect(flt); flt.connect(e); e.connect(dest || master); o.start(t); o.stop(t + d + 0.05); };
    /* the drone under everything */
    for(let k=0;k<3;k++){ const o = oc.createOscillator(); o.type = 'sawtooth'; o.frequency.value = NOTE(26)*(1 + k*0.004); const f = oc.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 260; const g = oc.createGain(); g.gain.value = 0.05; const lfo = oc.createOscillator(); lfo.frequency.value = 0.08 + k*0.03; const lg = oc.createGain(); lg.gain.value = 120; lfo.connect(lg); lg.connect(f.frequency); o.connect(f); f.connect(g); g.connect(master); o.start(0); o.stop(len + 1); lfo.start(0); lfo.stop(len + 1); }
    for(let bar=0; bar<bars; bar++){
      const t0 = bar*beat*4, root = roots[bar % roots.length];
      for(let s=0; s<16; s++){
        const t = t0 + s*beat/4;
        /* the pulse: sixteenth-note bass */
        if(kind !== 'tense' || s % 4 === 0){ const acc = s % 4 === 0 ? 1 : 0.6; tone(NOTE(root + (s === 14 ? 1 : 0)), t, beat*0.22, 'sawtooth', 0.07*acc, kind === 'tense' ? 300 : 700); }
        if(kind === 'tense'){
          if(s === 0 || s === 6) kick(t, 0.45);
          if(s % 4 === 2) hit(t, 7000, 'highpass', 0.001, 0.04, 0.05);
        } else {
          if(s === 0 || s === 8 || (s === 10 && rnd() < 0.6) || (kind === 'boss' && s === 6)) kick(t, 0.7);
          if(s === 4 || s === 12){ hit(t, 1800, 'bandpass', 0.001, 0.18, 0.5, ws); tone(190, t, 0.08, 'triangle', 0.15, 2000); }
          if(s % 2 === 0) hit(t, 8000, 'highpass', 0.001, s % 4 === 2 ? 0.08 : 0.03, 0.08);
          if(kind === 'boss' && s % 2 === 1) hit(t, 9000, 'highpass', 0.001, 0.02, 0.05);
        }
      }
      /* stabs and the high string line */
      if(kind !== 'tense' && bar % 2 === 1){ [0, 3, 7].forEach(iv=>tone(NOTE(root + 24 + iv), t0 + beat*3.5, beat*0.4, 'square', 0.035, 2400)); }
      if(kind === 'boss' || bar >= bars/2){ const n = root + 36 + [0, 1, 3, 1][bar % 4]; const o = oc.createOscillator(); o.type = 'sawtooth'; o.frequency.value = NOTE(n); const f = oc.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 1800; const g = oc.createGain(); g.gain.setValueAtTime(0, t0); g.gain.linearRampToValueAtTime(0.03, t0 + beat*2); g.gain.linearRampToValueAtTime(0, t0 + beat*4); const vib = oc.createOscillator(); vib.frequency.value = 5.5; const vg = oc.createGain(); vg.gain.value = 4; vib.connect(vg); vg.connect(o.frequency); o.connect(f); f.connect(g); g.connect(master); o.start(t0); o.stop(t0 + beat*4 + 0.1); vib.start(t0); vib.stop(t0 + beat*4 + 0.1); }
      if(kind === 'tense' && bar % 2 === 0){ tone(NOTE(root + 25), t0 + beat*2, beat*1.6, 'sine', 0.03, 900); }
    }
    const buf = await oc.startRendering();
    const L = Math.floor(len*sr); for(let ch=0; ch<2; ch++){ const d = buf.getChannelData(ch); for(let i=L; i<d.length; i++) d[i - L] += d[i]; }
    this.stems[kind] = { buf, loopEnd:len };
    return this.stems[kind];
  }
  /* crossfade to a stem; null fades the score out */
  async score(kind, fade){
    if(!this.ctx) return;
    const c = this.ctx, f = fade === undefined ? 1.2 : fade;
    this.want = kind;
    if(this.cur && this.cur.kind === kind) return;
    const old = this.cur; this.cur = null;
    if(old){ old.g.gain.setTargetAtTime(0, c.currentTime, f/3); setTimeout(()=>{ try{ old.s.stop(); }catch(e){} }, f*1500 + 200); }
    if(!kind){ return; }
    const st = await this.renderScore(kind);
    if(!st || this.want !== kind) return;
    const s = c.createBufferSource(); s.buffer = st.buf; s.loop = true; s.loopEnd = st.loopEnd;
    const g = c.createGain(); g.gain.value = 0; g.gain.setTargetAtTime(1, c.currentTime, f/3);
    s.connect(g); g.connect(this.scoreG); s.start();
    this.scoreG.gain.setTargetAtTime(0.9, c.currentTime, 0.3);
    this.cur = { kind, s, g };
  }
  stopAll(){
    Object.keys(this.loops).forEach(k=>this.stopLoop(k));
    this.heartbeat(false);
    if(this.cur){ try{ this.cur.s.stop(); }catch(e){} this.cur = null; }
  }
}
