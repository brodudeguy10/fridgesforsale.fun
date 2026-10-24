/* ============================================================
   FRIDGE PALACE: sound
   every sound is synthesized. the crowd bed and the music get
   rendered offline once, then loop. effects are built per hit.
============================================================ */
export class Audio {
  constructor(C){
    this.C = C;
    let ctx = null;
    try{ if(typeof ensureAudioContext === 'function') ensureAudioContext(); ctx = (typeof audioCtx !== 'undefined' && audioCtx) ? audioCtx : null; }catch(e){}
    if(!ctx){ try{ ctx = new (window.AudioContext || window.webkitAudioContext)(); }catch(e){} }
    this.ctx = ctx;
    if(!ctx) return;
    const s = C.save.settings;
    this.master = ctx.createGain(); this.master.gain.value = s.vol;
    this.comp = ctx.createDynamicsCompressor(); this.comp.threshold.value = -14; this.comp.ratio.value = 4; this.comp.attack.value = 0.004; this.comp.release.value = 0.2;
    this.master.connect(this.comp); this.comp.connect(ctx.destination);
    this.sfx = ctx.createGain(); this.sfx.gain.value = 1; this.sfx.connect(this.master);
    this.amb = ctx.createGain(); this.amb.gain.value = 0.55; this.amb.connect(this.master);
    this.mus = ctx.createGain(); this.mus.gain.value = s.music; this.mus.connect(this.master);
    this.duckG = ctx.createGain(); this.duckG.gain.value = 1; this.duckG.connect(this.mus);
    /* a short room reverb */
    this.verb = ctx.createConvolver(); this.verb.buffer = this.ir(1.6, 2.6); this.verbG = ctx.createGain(); this.verbG.gain.value = 0.22; this.verb.connect(this.verbG); this.verbG.connect(this.master);
    this.nb = this.noise(2);
  }
  ok(){ return !!this.ctx; }
  resume(){ if(this.ctx && this.ctx.state === 'suspended') this.ctx.resume(); }
  setVol(v){ if(this.master) this.master.gain.value = v; }
  setMusic(v){ if(this.mus) this.mus.gain.value = v; }
  duck(on){ if(!this.ctx) return; this.duckG.gain.setTargetAtTime(on ? 0.35 : 1, this.ctx.currentTime, 0.4); }
  noise(sec){ const c = this.ctx, b = c.createBuffer(1, c.sampleRate*sec, c.sampleRate), d = b.getChannelData(0); for(let i=0;i<d.length;i++) d[i] = Math.random()*2 - 1; return b; }
  ir(sec, decay){ const c = this.ctx, n = c.sampleRate*sec, b = c.createBuffer(2, n, c.sampleRate); for(let ch=0; ch<2; ch++){ const d = b.getChannelData(ch); for(let i=0;i<n;i++) d[i] = (Math.random()*2 - 1)*Math.pow(1 - i/n, decay); } return b; }
  /* where effects go: optionally through a 3D panner */
  out(pos, wet){
    const c = this.ctx; if(!c) return null;
    const g = c.createGain();
    if(pos){
      const p = c.createPanner(); p.panningModel = 'HRTF'; p.distanceModel = 'inverse'; p.refDistance = 1.6; p.rolloffFactor = 1.3; p.maxDistance = 60;
      p.positionX.value = pos.x; p.positionY.value = pos.y; p.positionZ.value = pos.z;
      g.connect(p); p.connect(this.sfx);
      if(wet !== 0){ const w = c.createGain(); w.gain.value = wet === undefined ? 0.5 : wet; p.connect(w); w.connect(this.verb); }
    } else { g.connect(this.sfx); if(wet){ const w = c.createGain(); w.gain.value = wet; g.connect(w); w.connect(this.verb); } }
    return g;
  }
  listener(cam){
    if(!this.ctx) return;
    const L = this.ctx.listener, p = cam.position, t = this.ctx.currentTime;
    const f = { x:0, y:0, z:-1 }, u = { x:0, y:1, z:0 };
    const q = cam.quaternion;
    const fx = 2*(q.x*q.z + q.w*q.y), fy = 2*(q.y*q.z - q.w*q.x), fz = 1 - 2*(q.x*q.x + q.y*q.y);
    f.x = -fx; f.y = -fy; f.z = -fz;
    const ux = 2*(q.x*q.y - q.w*q.z), uy = 1 - 2*(q.x*q.x + q.z*q.z), uz = 2*(q.y*q.z + q.w*q.x);
    if(L.positionX){ L.positionX.setTargetAtTime(p.x, t, 0.02); L.positionY.setTargetAtTime(p.y, t, 0.02); L.positionZ.setTargetAtTime(p.z, t, 0.02);
      L.forwardX.setTargetAtTime(f.x, t, 0.02); L.forwardY.setTargetAtTime(f.y, t, 0.02); L.forwardZ.setTargetAtTime(f.z, t, 0.02);
      L.upX.setTargetAtTime(ux, t, 0.02); L.upY.setTargetAtTime(uy, t, 0.02); L.upZ.setTargetAtTime(uz, t, 0.02); }
    else { L.setPosition(p.x, p.y, p.z); L.setOrientation(f.x, f.y, f.z, ux, uy, uz); }
  }
  /* ---------- building blocks ---------- */
  tone(o){
    /* { f, f2, type, a, d, g, t, dest, q, filt } */
    if(!this.ctx) return null;
    const c = this.ctx, t = (o.t || 0) + c.currentTime;
    const osc = c.createOscillator(); osc.type = o.type || 'sine'; osc.frequency.setValueAtTime(o.f, t);
    if(o.f2) osc.frequency.exponentialRampToValueAtTime(Math.max(1, o.f2), t + (o.glide || o.d || 0.2));
    if(o.det) osc.detune.value = o.det;
    const g = c.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(o.g || 0.2, t + (o.a || 0.005)); g.gain.exponentialRampToValueAtTime(0.0008, t + (o.a || 0.005) + (o.d || 0.3));
    let n = osc;
    if(o.filt){ const f = c.createBiquadFilter(); f.type = o.filt; f.frequency.value = o.ff || 2000; f.Q.value = o.q || 0.7; osc.connect(f); n = f; }
    n.connect(g); g.connect(o.dest || this.out(null));
    osc.start(t); osc.stop(t + (o.a || 0.005) + (o.d || 0.3) + 0.05);
    return osc;
  }
  burst(o){
    /* filtered noise hit: { ff, q, type, a, d, g, t, dest, rate } */
    if(!this.ctx) return;
    const c = this.ctx, t = (o.t || 0) + c.currentTime;
    const s = c.createBufferSource(); s.buffer = this.nb; s.playbackRate.value = o.rate || 1;
    const f = c.createBiquadFilter(); f.type = o.type || 'bandpass'; f.frequency.setValueAtTime(o.ff || 2000, t); if(o.ff2) f.frequency.exponentialRampToValueAtTime(o.ff2, t + (o.d || 0.1)); f.Q.value = o.q || 1;
    const g = c.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(o.g || 0.3, t + (o.a || 0.002)); g.gain.exponentialRampToValueAtTime(0.0008, t + (o.a || 0.002) + (o.d || 0.1));
    s.connect(f); f.connect(g); g.connect(o.dest || this.out(null));
    s.start(t, Math.random()*1.5); s.stop(t + (o.a || 0.002) + (o.d || 0.1) + 0.05);
  }
  bell(f, t, g, dest, dur){
    /* FM bell: struck metal for slot wins */
    if(!this.ctx) return;
    const c = this.ctx, T = c.currentTime + (t || 0);
    const car = c.createOscillator(), mod = c.createOscillator(), mg = c.createGain(), og = c.createGain();
    car.frequency.value = f; mod.frequency.value = f*3.5; mg.gain.setValueAtTime(f*2.2, T); mg.gain.exponentialRampToValueAtTime(f*0.1, T + (dur || 0.8));
    mod.connect(mg); mg.connect(car.frequency);
    og.gain.setValueAtTime(0, T); og.gain.linearRampToValueAtTime(g || 0.12, T + 0.003); og.gain.exponentialRampToValueAtTime(0.0008, T + (dur || 0.8));
    car.connect(og); og.connect(dest || this.out(null, 0.4));
    car.start(T); mod.start(T); car.stop(T + (dur || 0.8) + 0.05); mod.stop(T + (dur || 0.8) + 0.05);
  }
  /* ---------- the sounds ---------- */
  click(){ if(!this.ctx) return; this.tone({ f:1800, type:'square', d:0.03, g:0.04, filt:'lowpass', ff:3000 }); }
  hover(){ if(!this.ctx) return; this.tone({ f:2600, type:'sine', d:0.02, g:0.015 }); }
  error(){ if(!this.ctx) return; this.tone({ f:220, type:'square', d:0.12, g:0.05, filt:'lowpass', ff:900 }); this.tone({ f:180, type:'square', d:0.16, g:0.05, t:0.1, filt:'lowpass', ff:900 }); }
  chip(pos, n){
    if(!this.ctx) return; n = Math.min(6, n || 1); const d = this.out(pos, 0.3);
    for(let i=0;i<n;i++){ const t = i*0.035 + Math.random()*0.02; this.burst({ ff:3200 + Math.random()*1800, q:6, d:0.04, g:0.35, t, dest:d }); this.tone({ f:2400 + Math.random()*900, type:'triangle', d:0.05, g:0.05, t, dest:d }); }
  }
  chipStack(pos){ if(!this.ctx) return; for(let i=0;i<5;i++) this.chip(pos, 1 + (i%2)); }
  card(pos){ if(!this.ctx) return; const d = this.out(pos, 0.2); this.burst({ ff:5000, ff2:1800, q:0.8, type:'bandpass', d:0.07, g:0.25, dest:d }); this.burst({ ff:900, q:1, d:0.03, g:0.12, t:0.06, dest:d }); }
  flip(pos){ if(!this.ctx) return; const d = this.out(pos, 0.2); this.burst({ ff:3500, q:1.5, d:0.05, g:0.22, dest:d }); }
  shuffle(pos){ if(!this.ctx) return; const d = this.out(pos, 0.3); for(let i=0;i<26;i++) this.burst({ ff:4000 + Math.random()*2000, q:2, d:0.02, g:0.1, t:i*0.028, dest:d }); }
  step(surface, run){
    if(!this.ctx) return;
    const g = run ? 0.32 : 0.22;
    if(surface === 'marble'){ this.burst({ ff:2400, q:3, d:0.05, g, dest:this.out(null, 0.5) }); this.tone({ f:120, f2:70, d:0.06, g:g*0.5 }); }
    else if(surface === 'wood'){ this.burst({ ff:700, q:2, d:0.07, g:g*1.2, dest:this.out(null, 0.3) }); this.tone({ f:160, f2:90, d:0.07, g:g*0.5 }); }
    else { this.burst({ ff:420, q:0.8, type:'lowpass', d:0.08, g:g*0.9 }); }
  }
  slotSpinStart(pos){
    if(!this.ctx) return null;
    const c = this.ctx, d = this.out(pos, 0.2);
    /* a motor whir plus a click train that slows down when the reels stop */
    const o = c.createOscillator(); o.type = 'sawtooth'; o.frequency.value = 55;
    const f = c.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 600; f.Q.value = 2;
    const g = c.createGain(); g.gain.value = 0; g.gain.setTargetAtTime(0.05, c.currentTime, 0.03);
    o.connect(f); f.connect(g); g.connect(d); o.start();
    let alive = true;
    const tick = ()=>{ if(!alive) return; this.burst({ ff:2600, q:5, d:0.012, g:0.12, dest:d }); setTimeout(tick, 45 + Math.random()*10); };
    tick();
    return { stop:()=>{ alive = false; g.gain.setTargetAtTime(0, c.currentTime, 0.05); o.stop(c.currentTime + 0.3); } };
  }
  reelStop(pos){ if(!this.ctx) return; const d = this.out(pos, 0.2); this.tone({ f:180, f2:90, d:0.08, g:0.18, type:'square', filt:'lowpass', ff:800, dest:d }); this.burst({ ff:1500, q:2, d:0.04, g:0.25, dest:d }); }
  slotWin(pos, level){
    if(!this.ctx) return; const d = this.out(pos, 0.5);
    const scale = [523, 659, 784, 1047, 1319, 1568, 2093];
    const n = 3 + Math.min(10, level*2);
    for(let i=0;i<n;i++) this.bell(scale[i % scale.length]*(i >= 7 ? 2 : 1), i*0.07, 0.09, d, 0.6);
  }
  jackpot(pos){
    if(!this.ctx) return; const d = this.out(pos, 0.6);
    for(let k=0;k<5;k++){ [523, 659, 784, 1047].forEach((f,i)=>this.bell(f*(k%2 ? 1.5 : 1), k*0.35 + i*0.06, 0.1, d, 1.2)); }
    for(let i=0;i<40;i++) this.tone({ f:1200 + Math.random()*1800, type:'triangle', d:0.06, g:0.03, t:i*0.06, dest:d });
    this.cheer(pos, 1);
  }
  coins(pos, n){ if(!this.ctx) return; const d = this.out(pos, 0.4); n = Math.min(40, n); for(let i=0;i<n;i++){ const t = i*0.05 + Math.random()*0.04; this.tone({ f:3000 + Math.random()*1500, type:'triangle', d:0.08, g:0.04, t, dest:d }); this.burst({ ff:6000, q:4, d:0.02, g:0.08, t, dest:d }); } }
  ballSpin(pos, dur){
    if(!this.ctx) return; const c = this.ctx, d = this.out(pos, 0.3), T = c.currentTime;
    const s = c.createBufferSource(); s.buffer = this.nb; s.loop = true;
    const f = c.createBiquadFilter(); f.type = 'bandpass'; f.Q.value = 3; f.frequency.setValueAtTime(2400, T); f.frequency.exponentialRampToValueAtTime(700, T + dur);
    const g = c.createGain(); g.gain.setValueAtTime(0, T); g.gain.linearRampToValueAtTime(0.12, T + 0.2); g.gain.setValueAtTime(0.12, T + dur*0.75); g.gain.exponentialRampToValueAtTime(0.001, T + dur);
    s.connect(f); f.connect(g); g.connect(d); s.start(T); s.stop(T + dur + 0.1);
  }
  ballBounce(pos, n){ if(!this.ctx) return; const d = this.out(pos, 0.3); for(let i=0;i<n;i++){ const t = i*0.13*(1 + i*0.15); this.tone({ f:2600 - i*200, type:'triangle', d:0.03, g:0.12/(i + 1), t, dest:d }); this.burst({ ff:3500, q:4, d:0.02, g:0.15/(i + 1), t, dest:d }); } }
  wheelTick(pos, g){ if(!this.ctx) return; this.burst({ ff:3000, q:6, d:0.015, g:g || 0.2, dest:this.out(pos, 0.2) }); this.tone({ f:1400, type:'square', d:0.01, g:0.02, dest:this.out(pos, 0) }); }
  cheer(pos, amt){
    if(!this.ctx) return; const d = this.out(pos, 0.7);
    const n = 6 + (amt || 0)*14;
    for(let i=0;i<n;i++){ const t = Math.random()*0.6, f = 220 + Math.random()*500; this.tone({ f, f2:f*1.4, type:'sawtooth', a:0.04, d:0.4 + Math.random()*0.3, g:0.012, t, dest:d, filt:'bandpass', ff:900 + Math.random()*900, q:3 }); }
    this.burst({ ff:1200, q:0.4, a:0.08, d:1.2, g:0.08, dest:d });
    /* a little applause */
    for(let i=0;i<30*(amt || 0.5);i++) this.burst({ ff:2500 + Math.random()*2000, q:1.5, d:0.03, g:0.05, t:0.2 + Math.random()*1.6, dest:d });
  }
  aww(pos){ if(!this.ctx) return; const d = this.out(pos, 0.6); for(let i=0;i<8;i++){ const f = 300 + Math.random()*200; this.tone({ f, f2:f*0.6, glide:0.8, type:'sawtooth', a:0.05, d:0.8, g:0.012, t:Math.random()*0.2, dest:d, filt:'bandpass', ff:700, q:4 }); } }
  pour(pos){ if(!this.ctx) return; const d = this.out(pos, 0.3); this.burst({ ff:900, ff2:2200, q:2, a:0.05, d:1.1, g:0.12, dest:d }); for(let i=0;i<10;i++) this.tone({ f:600 + i*80, type:'sine', d:0.05, g:0.02, t:0.1 + i*0.08, dest:d }); }
  clink(pos){ if(!this.ctx) return; const d = this.out(pos, 0.4); this.bell(2900, 0, 0.05, d, 0.5); this.bell(3700, 0.05, 0.04, d, 0.4); }
  gulp(){ if(!this.ctx) return; for(let i=0;i<3;i++) this.tone({ f:180, f2:90, d:0.12, g:0.15, t:i*0.32, type:'sine' }); }
  door(pos){ if(!this.ctx) return; const d = this.out(pos, 0.5); this.burst({ ff:300, q:1, a:0.05, d:0.5, g:0.25, dest:d }); this.tone({ f:90, f2:60, d:0.3, g:0.2, dest:d }); }
  beep(ok){ if(!this.ctx) return; this.tone({ f:ok ? 1320 : 260, type:'square', d:ok ? 0.08 : 0.25, g:0.04, filt:'lowpass', ff:2500 }); }
  key(){ if(!this.ctx) return; this.tone({ f:900 + Math.random()*300, type:'square', d:0.04, g:0.035, filt:'lowpass', ff:2000 }); }
  whoosh(){ if(!this.ctx) return; this.burst({ ff:400, ff2:2400, q:1, a:0.1, d:0.4, g:0.12 }); }
  hum(pos){ if(!this.ctx) return null; const c = this.ctx, d = this.out(pos, 0.1); const o = c.createOscillator(); o.frequency.value = 60; const o2 = c.createOscillator(); o2.frequency.value = 120; const g = c.createGain(); g.gain.value = 0.05; o.connect(g); o2.connect(g); g.connect(d); o.start(); o2.start(); return { stop:()=>{ try{ o.stop(); o2.stop(); }catch(e){} } }; }
  whisper(text){
    if(!this.ctx) return; const c = this.ctx, T = c.currentTime;
    const n = Math.min(30, (text || 'hello').length);
    for(let i=0;i<n;i++){ const f = [700, 1100, 1700, 2400][i%4]; this.burst({ ff:f + Math.random()*400, q:8, a:0.02, d:0.08, g:0.06, t:i*0.07, dest:this.out(null, 0.8) }); }
  }
  /* the crowd: render 12s of babble offline, then loop it at the center of the room */
  async startAmbience(){
    if(!this.ctx || this.ambSrc) return;
    const sr = 22050, len = 12;
    const oc = new OfflineAudioContext(2, sr*len, sr);
    const nb = oc.createBuffer(1, sr*len, sr), nd = nb.getChannelData(0); for(let i=0;i<nd.length;i++) nd[i] = Math.random()*2 - 1;
    /* room tone */
    const rt = oc.createBufferSource(); rt.buffer = nb; const rf = oc.createBiquadFilter(); rf.type = 'lowpass'; rf.frequency.value = 500; const rg = oc.createGain(); rg.gain.value = 0.05; rt.connect(rf); rf.connect(rg); rg.connect(oc.destination); rt.start();
    /* voices: glottal pulses through formant pairs, vowel changes every syllable */
    const V = [[730,1090],[270,2290],[530,1840],[570,840],[440,1020],[300,870],[660,1720]];
    for(let v=0; v<26; v++){
      const pan = oc.createStereoPanner(); pan.pan.value = Math.random()*2 - 1; pan.connect(oc.destination);
      const vg = oc.createGain(); vg.gain.value = 0; vg.connect(pan);
      const src = oc.createOscillator(); src.type = 'sawtooth'; const base = 95 + Math.random()*170; src.frequency.value = base;
      const f1 = oc.createBiquadFilter(), f2 = oc.createBiquadFilter(); f1.type = f2.type = 'bandpass'; f1.Q.value = 8; f2.Q.value = 10;
      const m1 = oc.createGain(); m1.gain.value = 1; const m2 = oc.createGain(); m2.gain.value = 0.5;
      src.connect(f1); src.connect(f2); f1.connect(m1); f2.connect(m2); m1.connect(vg); m2.connect(vg);
      let t = Math.random()*2;
      while(t < len - 0.3){
        const phrase = 0.8 + Math.random()*2.2, end = Math.min(len - 0.2, t + phrase);
        while(t < end){
          const syl = 0.09 + Math.random()*0.14, vw = V[(Math.random()*V.length)|0];
          f1.frequency.setTargetAtTime(vw[0], t, 0.02); f2.frequency.setTargetAtTime(vw[1], t, 0.02);
          src.frequency.setTargetAtTime(base*(0.85 + Math.random()*0.35), t, 0.05);
          vg.gain.setTargetAtTime(0.012 + Math.random()*0.01, t, 0.015); vg.gain.setTargetAtTime(0.002, t + syl*0.7, 0.02);
          t += syl;
        }
        vg.gain.setTargetAtTime(0, t, 0.05);
        t += 0.3 + Math.random()*1.8;
      }
      src.start(0);
    }
    /* a laugh now and then */
    for(let k=0;k<4;k++){ const t0 = 1 + Math.random()*(len - 3); const o = oc.createOscillator(); o.type = 'sawtooth'; const f = 180 + Math.random()*160; const g = oc.createGain(); g.gain.value = 0; const bp = oc.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 900; bp.Q.value = 3; o.connect(bp); bp.connect(g); g.connect(oc.destination); for(let i=0;i<6;i++){ const t = t0 + i*0.16; o.frequency.setValueAtTime(f*(1 - i*0.03), t); g.gain.setTargetAtTime(0.03, t, 0.01); g.gain.setTargetAtTime(0, t + 0.08, 0.02); } o.start(t0); o.stop(t0 + 1.2); }
    const buf = await oc.startRendering();
    /* crossfade the loop seam */
    for(let ch=0; ch<2; ch++){ const d = buf.getChannelData(ch), fade = sr*0.5; for(let i=0;i<fade;i++){ const a = i/fade; d[i] = d[i]*a + d[d.length - fade + i]*(1 - a); } }
    const s = this.ctx.createBufferSource(); s.buffer = buf; s.loop = true; s.loopEnd = len - 0.5;
    s.connect(this.amb); s.start();
    this.ambSrc = s;
  }
  startMusic(m){
    if(!this.ctx || !m) return;
    try{ if(this.musSrc) this.musSrc.stop(); }catch(e){}
    const s = this.ctx.createBufferSource(); s.buffer = m.buf; s.loop = true; s.loopStart = 0; s.loopEnd = m.loopEnd;
    s.connect(this.duckG); s.start();
    this.musSrc = s;
  }
  /* the band sounds worse the more you drink */
  musicWarp(drunk, t){ if(this.musSrc) this.musSrc.playbackRate.value = 1 + Math.sin(t*0.8)*0.012*drunk + Math.sin(t*2.1)*0.006*drunk; }
  stopAll(){ try{ if(this.ambSrc) this.ambSrc.stop(); }catch(e){} try{ if(this.musSrc) this.musSrc.stop(); }catch(e){} this.ambSrc = null; this.musSrc = null; try{ this.master.disconnect(); }catch(e){} }
}
