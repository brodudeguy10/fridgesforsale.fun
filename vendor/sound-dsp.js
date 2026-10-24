/* ============================================================
   THE VENDOR — DSP
   a small synthesis library. no web audio nodes in here, only
   arithmetic on Float32Arrays, so the same file runs in the
   page, in a web worker, and in node for testing.
   everything renders sample by sample:
     oscillators     sine, polyBLEP saw/square/pulse, triangle, FM
     noise           white, pink, brown, velvet (sparse crackle)
     filters         TPT state-variable (lp/hp/bp/notch/peak), one-poles
     physical        modal resonator banks, karplus-strong strings
     voice           formant filter bank (vowels), glottal pulse train
     dirt            tanh/fold/asym shapers, bitcrush, tape wow+flutter
     space           freeverb stereo reverb, filtered delay, haas width
     housekeeping    envelopes, mixing, fades, normalise, seamless loops
============================================================ */
(function(root){
'use strict';
const D = {};
let SR = 44100;
D.setSR = function(sr){ SR = sr; };
D.getSR = function(){ return SR; };
const TAU = Math.PI*2;

/* ---------- random ---------- */
D.rng = function(seed){
  let s = (seed >>> 0) || 1;
  const f = function(){ s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; };
  f.range = (a,b)=>a + (b-a)*f();
  f.pick = (arr)=>arr[(f()*arr.length)|0];
  f.bi = ()=>f()*2-1;
  return f;
};

/* ---------- buffers ---------- */
D.len = (sec)=>Math.max(1, Math.round(sec*SR));
D.buf = (sec)=>new Float32Array(D.len(sec));
D.copy = (x)=>new Float32Array(x);
D.secs = (x)=>x.length/SR;

/* a parameter can be a number, a function of time in seconds, or an array */
function P(p){
  if(typeof p === 'number') return ()=>p;
  if(typeof p === 'function') return p;
  if(p && p.length) return (t,i)=>p[Math.min(p.length-1, i)];
  return ()=>0;
}
D.P = P;
/* breakpoint envelope: [[t,v],[t,v],...] linear, or exponential if exp */
D.line = function(points, exp){
  return function(t){
    if(t <= points[0][0]) return points[0][1];
    for(let k=1;k<points.length;k++){
      const a = points[k-1], b = points[k];
      if(t <= b[0]){
        const u = (t - a[0])/(b[0]-a[0] || 1e-9);
        if(exp && a[1] > 0 && b[1] > 0) return a[1]*Math.pow(b[1]/a[1], u);
        return a[1] + (b[1]-a[1])*u;
      }
    }
    return points[points.length-1][1];
  };
};

/* ---------- pitch ---------- */
const NOTE = { c:0, 'c#':1, db:1, d:2, 'd#':3, eb:3, e:4, f:5, 'f#':6, gb:6, g:7, 'g#':8, ab:8, a:9, 'a#':10, bb:10, b:11 };
D.hz = function(name){
  const m = /^([a-g](?:#|b)?)(-?\d)$/.exec(name.toLowerCase());
  if(!m) return 440;
  const midi = (parseInt(m[2],10)+1)*12 + NOTE[m[1]];
  return 440*Math.pow(2, (midi-69)/12);
};
D.midi = (m)=>440*Math.pow(2,(m-69)/12);
/* the key everything lives in. D, with the flat second and the tritone
   kept close for when it's meant to feel wrong. */
D.KEY = { root:62, minor:[0,2,3,5,7,8,10], penta:[0,3,5,7,10], dread:[0,1,6,7] };
D.deg = function(scale, degree, octave){
  const s = D.KEY[scale], n = s.length;
  const o = Math.floor(degree/n), k = ((degree % n) + n) % n;
  return D.midi(D.KEY.root + (octave||0)*12 + o*12 + s[k]);
};

/* ---------- oscillators ---------- */
function blep(t, dt){
  if(t < dt){ t /= dt; return t+t - t*t - 1; }
  if(t > 1 - dt){ t = (t - 1)/dt; return t*t + t+t + 1; }
  return 0;
}
/* type: sine | saw | square | pulse | tri. freq can vary per sample. */
D.osc = function(type, freq, sec, opt){
  opt = opt || {};
  const n = D.len(sec), out = new Float32Array(n), f = P(freq);
  let ph = opt.phase || 0;
  const pw = opt.pw || 0.5;
  let triS = 0;
  for(let i=0;i<n;i++){
    const t = i/SR, hz = f(t,i), dt = hz/SR;
    let v;
    switch(type){
      case 'saw': v = 2*ph - 1 - blep(ph, dt); break;
      case 'square': case 'pulse': {
        const w = type === 'square' ? 0.5 : pw;
        v = (ph < w ? 1 : -1) + blep(ph, dt) - blep((ph + 1 - w) % 1, dt);
        break;
      }
      case 'tri': { const sq = (ph < 0.5 ? 1 : -1) + blep(ph, dt) - blep((ph+0.5)%1, dt); triS = triS*0.999 + sq*4*dt; v = triS; break; }
      default: v = Math.sin(ph*TAU);
    }
    out[i] = v;
    ph += dt; if(ph >= 1) ph -= Math.floor(ph);
  }
  return out;
};
/* two-operator FM: carrier freq, ratio, index envelope */
D.fm = function(freq, ratio, index, sec, opt){
  opt = opt || {};
  const n = D.len(sec), out = new Float32Array(n), f = P(freq), I = P(index), r = P(ratio);
  let pc = 0, pm = 0, fbv = 0;
  const fb = opt.feedback || 0;
  for(let i=0;i<n;i++){
    const t = i/SR, hz = f(t,i);
    const m = Math.sin(pm*TAU + fbv*fb);
    fbv = m;
    out[i] = Math.sin(pc*TAU + m*I(t,i));
    pc += hz/SR; pm += hz*r(t,i)/SR;
    if(pc > 1) pc -= 1; if(pm > 1) pm -= 1;
  }
  return out;
};
/* a glottal-ish pulse train: what a throat does under a formant filter */
D.glottal = function(freq, sec, opt){
  opt = opt || {};
  const n = D.len(sec), out = new Float32Array(n), f = P(freq), jit = opt.jitter || 0.004, rng = opt.rng || Math.random;
  let ph = 0, jj = 0;
  for(let i=0;i<n;i++){
    const t = i/SR;
    if(ph < 0.0001) jj = (rng()*2-1)*jit;
    const hz = f(t,i)*(1+jj);
    /* Rosenberg-ish: rising half sine, sharp closure */
    const o = 0.6;
    out[i] = ph < o ? 0.5*(1 - Math.cos(Math.PI*ph/o)) : Math.cos(Math.PI*(ph-o)/(2*(1-o)));
    out[i] = out[i]*2 - 1;
    ph += hz/SR; if(ph >= 1) ph -= 1;
  }
  return D.dc(out);
};

/* ---------- noise ---------- */
D.noise = function(kind, sec, rng, opt){
  rng = rng || Math.random;
  const n = D.len(sec), out = new Float32Array(n);
  if(kind === 'pink'){
    let b0=0,b1=0,b2=0,b3=0,b4=0,b5=0,b6=0;
    for(let i=0;i<n;i++){
      const w = rng()*2-1;
      b0=0.99886*b0+w*0.0555179; b1=0.99332*b1+w*0.0750759; b2=0.96900*b2+w*0.1538520;
      b3=0.86650*b3+w*0.3104856; b4=0.55000*b4+w*0.5329522; b5=-0.7616*b5-w*0.0168980;
      out[i]=(b0+b1+b2+b3+b4+b5+b6+w*0.5362)*0.11; b6=w*0.115926;
    }
  } else if(kind === 'brown'){
    let l = 0;
    for(let i=0;i<n;i++){ l = (l + 0.02*(rng()*2-1))/1.02; out[i] = l*3.5; }
  } else if(kind === 'velvet'){
    /* sparse random impulses: crackle, grit, fizz */
    const dens = (opt && opt.density) || 400;
    const p = dens/SR;
    for(let i=0;i<n;i++) if(rng() < p) out[i] = (rng() < 0.5 ? -1 : 1)*(0.3 + 0.7*rng());
  } else {
    for(let i=0;i<n;i++) out[i] = rng()*2-1;
  }
  return out;
};

/* ---------- filters ---------- */
/* Zavalishin TPT state variable filter. mode lp|hp|bp|notch|peak|bpn(normalised bp) */
D.svf = function(x, mode, cutoff, q, opt){
  const n = x.length, out = new Float32Array(n), fc = P(cutoff), Q = P(q === undefined ? 0.707 : q);
  const gainDb = opt && opt.gain || 0;
  let ic1 = 0, ic2 = 0;
  const nyq = SR*0.49;
  let lastF = -1, g = 0, k = 0, a1 = 0, a2 = 0, a3 = 0, lastQ = -1;
  const peakK = Math.pow(10, gainDb/20);
  for(let i=0;i<n;i++){
    const t = i/SR;
    let f = fc(t,i); if(f < 10) f = 10; if(f > nyq) f = nyq;
    const qq = Q(t,i);
    if(f !== lastF || qq !== lastQ){
      g = Math.tan(Math.PI*f/SR); k = 1/Math.max(0.05, qq);
      a1 = 1/(1 + g*(g + k)); a2 = g*a1; a3 = g*a2;
      lastF = f; lastQ = qq;
    }
    const v0 = x[i];
    const v3 = v0 - ic2;
    const v1 = a1*ic1 + a2*v3;
    const v2 = ic2 + a2*ic1 + a3*v3;
    ic1 = 2*v1 - ic1; ic2 = 2*v2 - ic2;
    let y;
    switch(mode){
      case 'hp': y = v0 - k*v1 - v2; break;
      case 'bp': y = v1; break;
      case 'bpn': y = v1*k; break;
      case 'notch': y = v0 - k*v1; break;
      case 'peak': y = v0 + (peakK-1)*k*v1; break;
      default: y = v2;
    }
    out[i] = y;
  }
  return out;
};
D.lp = (x,f,q)=>D.svf(x,'lp',f,q);
D.hp = (x,f,q)=>D.svf(x,'hp',f,q);
D.bp = (x,f,q)=>D.svf(x,'bpn',f,q);
D.op = function(x, cutoff, mode){
  const n = x.length, out = new Float32Array(n), fc = P(cutoff);
  let z = 0;
  for(let i=0;i<n;i++){
    const a = 1 - Math.exp(-TAU*fc(i/SR,i)/SR);
    z += (x[i]-z)*a;
    out[i] = mode === 'hp' ? x[i]-z : z;
  }
  return out;
};
D.dc = function(x){ let px = 0, py = 0; for(let i=0;i<x.length;i++){ const y = x[i] - px + 0.995*py; px = x[i]; py = y; x[i] = y; } return x; };

/* ---------- physical ---------- */
/* a bank of two-pole resonators driven by an excitation. metal, glass,
   wood, a fridge shelf. modes: [{f, d (seconds to -60dB), a}] */
D.modal = function(exc, modes, sec){
  const n = sec ? D.len(sec) : exc.length, out = new Float32Array(n);
  for(const m of modes){
    if(m.f >= SR*0.45) continue;
    const r = Math.exp(-6.9078/(Math.max(0.005, m.d)*SR));
    const w = TAU*m.f/SR, c = 2*r*Math.cos(w), r2 = r*r, a = m.a === undefined ? 1 : m.a;
    let y1 = 0, y2 = 0;
    for(let i=0;i<n;i++){
      const xin = i < exc.length ? exc[i] : 0;
      const y = c*y1 - r2*y2 + xin*a;
      y2 = y1; y1 = y; out[i] += y;
    }
  }
  return D.normalize(out, 0.9);
};
/* inharmonic partial sets */
D.modes = {
  plate: (f, rng)=>[1, 2.32, 4.25, 6.63, 9.38, 12.1].map((k,i)=>({ f:f*k*(1+(rng?rng.bi()*0.01:0)), d:1.6/(i*0.6+1), a:1/(i*0.5+1) })),
  pipe:  (f, rng)=>[1, 2.76, 5.4, 8.93, 13.34].map((k,i)=>({ f:f*k*(1+(rng?rng.bi()*0.006:0)), d:1.2/(i*0.5+1), a:1/(i+1) })),
  glass: (f, rng)=>[1, 2.65, 4.97, 7.52, 10.3, 14.1].map((k,i)=>({ f:f*k*(1+(rng?rng.bi()*0.02:0)), d:0.5/(i*0.3+1), a:1/(i*0.4+1) })),
  wood:  (f, rng)=>[1, 2.57, 4.1, 6.3].map((k,i)=>({ f:f*k*(1+(rng?rng.bi()*0.02:0)), d:0.12/(i*0.5+1), a:1/(i+1) })),
  shelf: (f, rng)=>[1, 1.47, 2.11, 3.03, 4.4, 5.9, 7.7].map((k,i)=>({ f:f*k*(1+(rng?rng.bi()*0.03:0)), d:0.35/(i*0.3+1), a:1/(i*0.6+1) })),
  bell:  (f)=>[0.5, 1, 1.19, 1.56, 2, 2.51, 3.01, 4.1].map((k,i)=>({ f:f*k, d:[3.5,2.6,1.4,1.1,0.9,0.7,0.6,0.4][i], a:[0.4,1,0.6,0.5,0.45,0.3,0.25,0.15][i] }))
};
D.click = function(sec, rng, bright){
  const x = D.noise('white', sec || 0.004, rng);
  const n = x.length;
  for(let i=0;i<n;i++) x[i] *= Math.exp(-i/(n*0.25));
  return bright ? D.hp(x, bright) : x;
};
/* karplus-strong with a damped loop and fractional tuning */
D.karplus = function(freq, sec, opt){
  opt = opt || {};
  const rng = opt.rng || Math.random;
  const n = D.len(sec), out = new Float32Array(n);
  const period = SR/freq, N = Math.max(2, Math.floor(period)), frac = period - N;
  const line = new Float32Array(N+2);
  const bright = opt.bright === undefined ? 0.5 : opt.bright;
  for(let i=0;i<line.length;i++) line[i] = (rng()*2-1);
  /* pre-darken the burst for softer plucks */
  for(let p=0; p<(1-bright)*6; p++) for(let i=1;i<line.length;i++) line[i] = 0.5*(line[i] + line[i-1]);
  const damp = opt.damp === undefined ? 0.996 : opt.damp;
  let idx = 0, ap = 0, apIn = 0;
  const apc = (1-frac)/(1+frac);
  for(let i=0;i<n;i++){
    const a = line[idx], b = line[(idx+1) % N];
    let y = damp*0.5*(a + b);
    /* allpass for the fractional part of the period */
    const o = apc*(y - ap) + apIn; apIn = y; ap = o;
    line[idx] = o;
    out[i] = a;
    idx = (idx+1) % N;
  }
  return out;
};

/* ---------- voice ---------- */
const VOWEL = {
  a:[[800,1,80],[1150,0.5,90],[2900,0.25,120]],
  e:[[400,1,70],[1600,0.35,80],[2700,0.3,100]],
  i:[[350,1,50],[1700,0.2,100],[2700,0.15,120]],
  o:[[450,1,70],[800,0.3,80],[2830,0.1,100]],
  u:[[325,1,50],[700,0.15,60],[2530,0.05,170]],
  m:[[280,1,60],[1000,0.08,100],[2200,0.03,120]],
  h:[[600,1,200],[1500,0.6,250],[2600,0.5,300]]
};
D.formant = function(x, vowel, shift, opt){
  const v = typeof vowel === 'string' ? VOWEL[vowel] : vowel;
  const s = shift || 1;
  const out = new Float32Array(x.length);
  for(const f of v){
    const y = D.svf(x, 'bpn', f[0]*s, f[0]*s/f[2]);
    for(let i=0;i<x.length;i++) out[i] += y[i]*f[1];
  }
  return out;
};
/* morph between two vowels over the length of the buffer */
D.formantMorph = function(x, v1, v2, shift){
  const a = D.formant(x, v1, shift), b = D.formant(x, v2, shift), n = x.length;
  for(let i=0;i<n;i++){ const u = i/n; a[i] = a[i]*(1-u) + b[i]*u; }
  return a;
};

/* ---------- dirt ---------- */
D.shape = function(x, drive, kind){
  const n = x.length, out = new Float32Array(n), d = drive || 1;
  for(let i=0;i<n;i++){
    const v = x[i]*d;
    switch(kind){
      case 'fold': { let s = v; for(let k=0;k<4 && (s > 1 || s < -1);k++) s = s > 1 ? 2 - s : -2 - s; out[i] = s; break; }
      case 'asym': out[i] = v > 0 ? Math.tanh(v) : Math.tanh(v*0.6)*1.3; break;
      case 'hard': out[i] = v > 1 ? 1 : (v < -1 ? -1 : v); break;
      default: out[i] = Math.tanh(v);
    }
  }
  return out;
};
D.crush = function(x, bits, hold){
  const n = x.length, out = new Float32Array(n), q = Math.pow(2, bits||8), h = Math.max(1, hold||1);
  let held = 0;
  for(let i=0;i<n;i++){ if(i % h === 0) held = Math.round(x[i]*q)/q; out[i] = held; }
  return out;
};
D.ring = function(x, freq){ const f = P(freq); let ph = 0; const out = new Float32Array(x.length); for(let i=0;i<x.length;i++){ out[i] = x[i]*Math.sin(ph*TAU); ph += f(i/SR,i)/SR; } return out; };
/* tape: slow wow and fast flutter on a variable delay line */
D.wow = function(x, opt){
  opt = opt || {};
  const wr = opt.wow || 0.6, wd = (opt.wowMs || 6)*SR/1000, fr = opt.flutter || 9, fd = (opt.flutterMs || 0.5)*SR/1000;
  const base = wd + fd + 4, n = x.length, out = new Float32Array(n);
  for(let i=0;i<n;i++){
    const t = i/SR;
    const d = base + Math.sin(t*TAU*wr)*wd + Math.sin(t*TAU*fr + 1.3)*fd;
    const p = i - d;
    if(p < 0){ out[i] = 0; continue; }
    const j = Math.floor(p), u = p - j;
    out[i] = x[j]*(1-u) + (x[j+1] || 0)*u;
  }
  return out;
};

/* ---------- envelopes + mixing ---------- */
D.env = function(x, fn){ for(let i=0;i<x.length;i++) x[i] *= fn(i/SR, i); return x; };
D.ad = function(a, d, curve){ const c = curve || 4; return (t)=> t < a ? t/a : Math.exp(-(t-a)/d*c*0.25*4/c*c/4); };
D.perc = function(a, d){ return (t)=> t < a ? t/Math.max(a,1e-5) : Math.exp(-(t-a)*6.9/Math.max(d,1e-4)); };
D.adsr = function(a, d, s, hold, r){ return (t)=>{
  if(t < a) return t/a;
  if(t < a+d) return 1 - (1-s)*(t-a)/d;
  if(t < a+d+hold) return s;
  const u = (t-a-d-hold)/r; return u >= 1 ? 0 : s*(1-u)*(1-u);
}; };
D.gain = function(x, g){ for(let i=0;i<x.length;i++) x[i] *= g; return x; };
D.add = function(dst, src, g, at){
  const o = Math.round((at||0)*SR), gg = g === undefined ? 1 : g;
  const n = Math.min(src.length, dst.length - o);
  for(let i=0;i<n;i++) dst[o+i] += src[i]*gg;
  return dst;
};
D.mulEach = function(a, b){ const n = Math.min(a.length, b.length); for(let i=0;i<n;i++) a[i] *= b[i]; return a; };
D.fade = function(x, fin, fout){
  const a = D.len(fin||0.002), b = D.len(fout||0.01), n = x.length;
  for(let i=0;i<a && i<n;i++) x[i] *= i/a;
  for(let i=0;i<b && i<n;i++) x[n-1-i] *= i/b;
  return x;
};
D.peak = function(x){ let p = 0; for(let i=0;i<x.length;i++){ const a = Math.abs(x[i]); if(a > p) p = a; } return p; };
D.rms = function(x){ let s = 0; for(let i=0;i<x.length;i++) s += x[i]*x[i]; return Math.sqrt(s/Math.max(1,x.length)); };
D.normalize = function(x, target){ const p = D.peak(x); if(p > 1e-9) D.gain(x, (target||0.9)/p); return x; };
D.reverse = function(x){ return Float32Array.from(x).reverse(); };
D.concat = function(list){ let n = 0; list.forEach(a=>n+=a.length); const o = new Float32Array(n); let k = 0; list.forEach(a=>{ o.set(a, k); k += a.length; }); return o; };
D.slice = function(x, a, b){ return x.slice(D.len(a), b === undefined ? x.length : D.len(b)); };
D.stretch = function(x, rate){ const n = Math.floor(x.length/rate), o = new Float32Array(n); for(let i=0;i<n;i++){ const p = i*rate, j = Math.floor(p), u = p-j; o[i] = x[j]*(1-u) + (x[j+1]||0)*u; } return o; };

/* ---------- stereo ---------- */
D.st = function(L, R){ return { L, R: R || L.slice(0) }; };
D.pan = function(x, p){ const a = (p+1)*Math.PI/4; const L = D.copy(x), R = D.copy(x); D.gain(L, Math.cos(a)*1.41); D.gain(R, Math.sin(a)*1.41); return { L, R }; };
D.haas = function(x, ms, side){ const d = Math.round((ms||12)*SR/1000); const L = D.copy(x), R = new Float32Array(x.length); for(let i=d;i<x.length;i++) R[i] = x[i-d]; return side < 0 ? { L:R, R:L } : { L, R }; };
D.sadd = function(dst, src, g, at, pan){
  const s = src.L ? src : D.pan(src, pan||0);
  D.add(dst.L, s.L, g, at); D.add(dst.R, s.R, g, at); return dst;
};
D.sbuf = function(sec){ return { L:D.buf(sec), R:D.buf(sec) }; };
D.snorm = function(s, target){ const p = Math.max(D.peak(s.L), D.peak(s.R)); if(p > 1e-9){ D.gain(s.L, (target||0.9)/p); D.gain(s.R, (target||0.9)/p); } return s; };
D.sfade = function(s, a, b){ D.fade(s.L, a, b); D.fade(s.R, a, b); return s; };

/* ---------- space ---------- */
/* freeverb. returns stereo. size 0..1, damp 0..1 */
D.reverb = function(input, opt){
  opt = opt || {};
  const size = opt.size === undefined ? 0.8 : opt.size, damp = opt.damp === undefined ? 0.4 : opt.damp;
  const wet = opt.wet === undefined ? 0.35 : opt.wet, dry = opt.dry === undefined ? 1 : opt.dry;
  const tail = opt.tail === undefined ? 1.5 : opt.tail;
  const inL = input.L || input, inR = input.R || input;
  const n = inL.length + D.len(tail);
  const sc = SR/44100;
  const combT = [1116,1188,1277,1356,1422,1491,1557,1617], apT = [556,441,341,225], spread = 23;
  const fb = 0.7 + 0.28*size, d1 = damp*0.4, d2 = 1 - d1;
  const pre = D.len(opt.predelay || 0);
  function chan(off){
    const combs = combT.map(c=>({ b:new Float32Array(Math.round((c+off)*sc)), i:0, s:0 }));
    const aps = apT.map(c=>({ b:new Float32Array(Math.round((c+off)*sc)), i:0 }));
    return { combs, aps };
  }
  const cl = chan(0), cr = chan(spread);
  const L = new Float32Array(n), R = new Float32Array(n);
  for(let i=0;i<n;i++){
    const j = i - pre;
    const xin = (j >= 0 && j < inL.length) ? (inL[j] + inR[j])*0.015 : 0;
    let ol = 0, or = 0;
    for(const c of cl.combs){ const y = c.b[c.i]; c.s = y*d2 + c.s*d1; c.b[c.i] = xin + c.s*fb; if(++c.i >= c.b.length) c.i = 0; ol += y; }
    for(const c of cr.combs){ const y = c.b[c.i]; c.s = y*d2 + c.s*d1; c.b[c.i] = xin + c.s*fb; if(++c.i >= c.b.length) c.i = 0; or += y; }
    for(const a of cl.aps){ const y = a.b[a.i]; a.b[a.i] = ol + y*0.5; if(++a.i >= a.b.length) a.i = 0; ol = y - ol; }
    for(const a of cr.aps){ const y = a.b[a.i]; a.b[a.i] = or + y*0.5; if(++a.i >= a.b.length) a.i = 0; or = y - or; }
    const w = opt.width === undefined ? 1 : opt.width;
    const wl = ol*(0.5+w*0.5) + or*(0.5-w*0.5), wr = or*(0.5+w*0.5) + ol*(0.5-w*0.5);
    L[i] = (i < inL.length ? inL[i]*dry : 0) + wl*wet*3;
    R[i] = (i < inR.length ? inR[i]*dry : 0) + wr*wet*3;
  }
  return { L, R };
};
/* filtered feedback delay, mono in, mono out */
D.echo = function(x, sec, fb, mix, lpHz, tail){
  const d = D.len(sec), n = x.length + D.len(tail || sec*6), out = new Float32Array(n), line = new Float32Array(d);
  let w = 0, z = 0; const a = 1 - Math.exp(-TAU*(lpHz||3000)/SR);
  for(let i=0;i<n;i++){
    const xin = i < x.length ? x[i] : 0;
    const y = line[w]; z += (y - z)*a;
    line[w] = xin + z*fb; if(++w >= d) w = 0;
    out[i] = xin + z*mix;
  }
  return out;
};
/* make a buffer loop without a click: crossfade the tail into the head */
D.loopify = function(x, xf){
  const k = D.len(xf || 0.25), n = x.length - k;
  if(n <= k) return x;
  const out = x.slice(0, n);
  for(let i=0;i<k;i++){ const u = i/k; const a = Math.sqrt(u), b = Math.sqrt(1-u); out[i] = x[i]*a + x[n+i]*b; }
  return out;
};
D.sloopify = function(s, xf){ return { L:D.loopify(s.L, xf), R:D.loopify(s.R, xf) }; };
/* a short room impulse response, for the live convolver */
D.impulse = function(sec, opt){
  opt = opt || {};
  const rng = opt.rng || D.rng(5);
  const n = D.len(sec), L = new Float32Array(n), R = new Float32Array(n);
  const decay = opt.decay || 3;
  for(let i=0;i<n;i++){
    const t = i/n;
    const env = Math.pow(1 - t, decay);
    L[i] = (rng()*2-1)*env; R[i] = (rng()*2-1)*env;
  }
  (opt.early || [[0.009,0.7],[0.017,0.5],[0.023,0.45],[0.031,0.35],[0.044,0.3],[0.061,0.22]]).forEach((e,k)=>{
    const j = D.len(e[0]); if(j < n){ L[j] += e[1]*(k%2?0.6:1); R[Math.min(n-1, j + D.len(0.0012*(k+1)))] += e[1]*(k%2?1:0.6); }
  });
  const sL = D.lp(L, D.line([[0, opt.bright||7000],[sec, opt.dark||900]], true));
  const sR = D.lp(R, D.line([[0, opt.bright||7000],[sec, opt.dark||900]], true));
  return D.snorm({ L:sL, R:sR }, 0.8);
};

root.VDSP = D;
})(typeof self !== 'undefined' ? self : (typeof globalThis !== 'undefined' ? globalThis : this));
