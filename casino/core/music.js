/* ============================================================
   FRIDGE PALACE: the house band
   32 bars of lounge jazz, rendered offline once per visit and looped:
   rhodes comping, walking bass, brushes and ride, a vibraphone that
   noodles over the top. seeded, so it's the same tune every night.
============================================================ */
function mulberry(a){ return function(){ a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0)/4294967296; }; }
const NOTE = n=>440*Math.pow(2, (n - 69)/12);
/* chords as [root midi, quality] */
const Q = { m7:[0,3,7,10,14], d7:[0,4,7,10,14], M7:[0,4,7,11,14], m7b5:[0,3,6,10,13], d7b9:[0,4,7,10,13] };
const PROG = [
  [48,'m7'],[53,'d7'],[46,'M7'],[43,'d7b9'],
  [48,'m7'],[53,'d7'],[50,'m7'],[43,'d7'],
  [48,'m7'],[53,'d7'],[46,'M7'],[51,'M7'],
  [45,'m7b5'],[50,'d7b9'],[43,'m7'],[41,'d7']
];

export async function renderLounge(opts){
  opts = opts || {};
  const sr = opts.sr || 22050, bpm = opts.bpm || 100, bars = 32;
  const beat = 60/bpm, barLen = beat*4, len = bars*barLen;
  const oc = new OfflineAudioContext(2, Math.ceil(sr*(len + 2)), sr);
  const R = mulberry(opts.seed || 1913);
  const master = oc.createGain(); master.gain.value = 0.55; master.connect(oc.destination);
  /* little room */
  const conv = oc.createConvolver(); { const n = sr*1.8, b = oc.createBuffer(2, n, sr); for(let c=0;c<2;c++){ const d = b.getChannelData(c); for(let i=0;i<n;i++) d[i] = (Math.random()*2 - 1)*Math.pow(1 - i/n, 3); } conv.buffer = b; }
  const wet = oc.createGain(); wet.gain.value = 0.28; conv.connect(wet); wet.connect(master);
  const bus = (pan, w)=>{ const p = oc.createStereoPanner(); p.pan.value = pan; p.connect(master); const s = oc.createGain(); s.gain.value = w; p.connect(s); s.connect(conv); return p; };
  const keysB = bus(-0.25, 0.6), bassB = bus(0.05, 0.15), drumB = bus(0.2, 0.35), vibB = bus(0.35, 0.8);
  const nb = oc.createBuffer(1, sr*2, sr); { const d = nb.getChannelData(0); for(let i=0;i<d.length;i++) d[i] = Math.random()*2 - 1; }
  const sw = t=>t;  // swing applied by placement
  /* ---- instruments ---- */
  function rhodes(midi, t, dur, vel){
    const f = NOTE(midi);
    const car = oc.createOscillator(), mod = oc.createOscillator(), mg = oc.createGain(), g = oc.createGain();
    car.frequency.value = f; mod.frequency.value = f; mg.gain.setValueAtTime(f*1.6*vel, t); mg.gain.exponentialRampToValueAtTime(f*0.15, t + 0.6);
    const tine = oc.createOscillator(), tg = oc.createGain(); tine.frequency.value = f*14; tg.gain.setValueAtTime(0.03*vel, t); tg.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
    mod.connect(mg); mg.connect(car.frequency);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.1*vel, t + 0.006); g.gain.exponentialRampToValueAtTime(0.035*vel, t + 0.4); g.gain.setTargetAtTime(0.0001, t + dur, 0.12);
    car.connect(g); tine.connect(tg); tg.connect(g); g.connect(keysB);
    [car, mod, tine].forEach(o=>{ o.start(t); o.stop(t + dur + 0.8); });
  }
  function bass(midi, t, dur, vel){
    const f = NOTE(midi);
    const o = oc.createOscillator(); o.type = 'triangle'; o.frequency.value = f;
    const o2 = oc.createOscillator(); o2.type = 'sine'; o2.frequency.value = f;
    const lp = oc.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.setValueAtTime(900, t); lp.frequency.exponentialRampToValueAtTime(260, t + 0.25); lp.Q.value = 1.5;
    const g = oc.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.2*vel, t + 0.01); g.gain.exponentialRampToValueAtTime(0.075*vel, t + 0.18); g.gain.setTargetAtTime(0.0001, t + dur*0.92, 0.04);
    o.connect(lp); o2.connect(lp); lp.connect(g); g.connect(bassB);
    o.start(t); o2.start(t); o.stop(t + dur + 0.3); o2.stop(t + dur + 0.3);
  }
  function noiseHit(t, ff, q, type, a, d, g, dest, rate){
    const s = oc.createBufferSource(); s.buffer = nb; s.playbackRate.value = rate || 1;
    const f = oc.createBiquadFilter(); f.type = type; f.frequency.value = ff; f.Q.value = q;
    const e = oc.createGain(); e.gain.setValueAtTime(0, t); e.gain.linearRampToValueAtTime(g, t + a); e.gain.exponentialRampToValueAtTime(0.0001, t + a + d);
    s.connect(f); f.connect(e); e.connect(dest); s.start(t, R()*1.5); s.stop(t + a + d + 0.05);
  }
  const ride = (t, v)=>{ noiseHit(t, 7200, 1.2, 'bandpass', 0.001, 0.55, 0.32*v, drumB); noiseHit(t, 4300, 6, 'bandpass', 0.001, 0.3, 0.14*v, drumB); noiseHit(t, 9500, 0.8, 'highpass', 0.001, 0.08, 0.12*v, drumB); };
  const hat = t=>noiseHit(t, 8000, 0.9, 'highpass', 0.001, 0.06, 0.2, drumB);
  const brush = (t, v)=>noiseHit(t, 2600, 0.6, 'bandpass', 0.04, 0.24, 0.22*v, drumB);
  const kick = t=>{ const o = oc.createOscillator(); o.frequency.setValueAtTime(110, t); o.frequency.exponentialRampToValueAtTime(45, t + 0.12); const g = oc.createGain(); g.gain.setValueAtTime(0.18, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.25); o.connect(g); g.connect(drumB); o.start(t); o.stop(t + 0.3); };
  function vibe(midi, t, dur, vel){
    const f = NOTE(midi);
    const o = oc.createOscillator(); o.frequency.value = f; const o2 = oc.createOscillator(); o2.frequency.value = f*4; const g2 = oc.createGain(); g2.gain.value = 0.15;
    const trem = oc.createOscillator(); trem.frequency.value = 5.2; const tg = oc.createGain(); tg.gain.value = 0.3;
    const g = oc.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.11*vel, t + 0.003); g.gain.exponentialRampToValueAtTime(0.0001, t + Math.max(0.6, dur*1.6));
    const am = oc.createGain(); am.gain.value = 0.7; trem.connect(tg); tg.connect(am.gain);
    o.connect(am); o2.connect(g2); g2.connect(am); am.connect(g); g.connect(vibB);
    [o, o2, trem].forEach(x=>{ x.start(t); x.stop(t + Math.max(0.6, dur*1.6) + 0.1); });
  }
  /* ---- the arrangement ---- */
  const swing8 = (b, eighth)=>b*beat + (eighth ? beat*0.66 : 0);
  let prevBass = 36;
  for(let bar=0; bar<bars; bar++){
    const t0 = bar*barLen;
    const [root, q] = PROG[bar % PROG.length];
    const [nroot] = PROG[(bar + 1) % PROG.length];
    const tones = Q[q];
    const intro = bar < 2, last = bar === bars - 1;
    /* drums (the band of one skips them) */
    if(!opts.sparse) for(let b=0;b<4;b++){
      ride(t0 + b*beat, b % 2 ? 0.8 : 1);
      if(b % 2 === 1){ ride(t0 + swing8(b, 1), 0.55); hat(t0 + b*beat); brush(t0 + b*beat, 0.8); }
      if(b === 0 && R() < 0.6) kick(t0);
    }
    if(!opts.sparse && R() < 0.25) brush(t0 + swing8(3, 1), 0.5);
    /* walking bass: root on 1, chord tones, chromatic approach into the next bar */
    if((!intro || bar === 1) && !opts.sparse){
      const pool = tones.slice(0, 4).map(i=>root - 12 + i).concat(tones.slice(0,3).map(i=>root + i - 12 + 12));
      const target = nroot - 12;
      for(let b=0;b<4;b++){
        let n;
        if(b === 0) n = root - 12;
        else if(b === 3) n = target + (R() < 0.5 ? 1 : -1);
        else { n = pool[(R()*pool.length)|0]; while(n > 52) n -= 12; while(n < 33) n += 12; }
        bass(n, t0 + b*beat, beat*0.95, b === 0 ? 1 : 0.85);
        prevBass = n;
      }
    }
    /* rhodes comping: rootless voicings around middle C, charleston and anticipations */
    const voice = tones.slice(1, 5).map(i=>{ let n = root + i; while(n < 58) n += 12; while(n > 72) n -= 12; return n; }).sort((a,b)=>a-b);
    const hits = R() < 0.5 ? [[0, 0, 1.4],[1, 1, 0.5]] : [[0, 1, 0.9],[2, 0, 1.2],[3, 1, 0.6]];
    hits.forEach(([b, e, d])=>{ const t = t0 + swing8(b, e); voice.forEach((n,i)=>rhodes(n, t + i*0.008, beat*d, 0.75 + R()*0.25)); });
    /* vibes: phrases in bars 4-7 of every 8 */
    if(!intro && !opts.sparse && (bar % 8) >= 3 && (bar % 8) <= 6){
      const scale = [0,2,3,5,7,9,10].map(i=>root + 12 + i);
      let idx = (R()*scale.length)|0;
      for(let b=0;b<4;b++){
        for(let e=0;e<2;e++){
          if(R() < 0.55){ idx = Math.max(0, Math.min(scale.length - 1, idx + ((R()*5)|0) - 2)); vibe(scale[idx] + (R() < 0.2 ? 12 : 0), t0 + swing8(b, e), beat*0.6, 0.7 + R()*0.3); }
        }
      }
    }
    if(last){ voice.forEach((n,i)=>rhodes(n, t0 + 3*beat + i*0.02, beat*1.5, 0.6)); }
  }
  const buf = await oc.startRendering();
  /* fold the reverb tail back onto the start so the loop is seamless */
  const L = Math.floor(len*sr);
  for(let ch=0; ch<2; ch++){ const d = buf.getChannelData(ch); for(let i=L; i<d.length; i++){ d[i - L] += d[i]; } }
  return { buf, loopEnd:len };
}
