/* ============================================================
   COLD START engine synth (audio worklet), second version.

   no engine samples: the engine is built, not played back.
   a crank turns; each cylinder fires at its real crank angle with
   its own slight imbalance; every firing is a pressure pulse that
   goes down its own header and into the pipes, which are delay
   lines tuned to their real lengths (a pulse runs to the open end,
   reflects back inverted, runs back: that round trip is the pitch
   of the pipe, and it's why a V8's two banks, fed unevenly by a
   crossplane crank, burble). the intake breathes on its own pulse
   train through an airbox resonance. valves tick. a turbo whistles
   off its compressor blades. the gearbox whines at its own mesh
   frequency, straight-cut or helical. on the limiter the ignition
   cuts and the unburnt fuel goes bang in the pipe; on the overrun
   the loud ones crackle. on lift-off the pulses thin out and the
   intake sucks. cranking, there's compression but no fire.

   driven by AudioParams so a recording (OfflineAudioContext) is
   sample-exact. one-shot events (an afterfire) come on the port.
============================================================ */
const TAU = Math.PI * 2;
/* firing angles in a 720 degree cycle, and each cylinder's own strength (no two are quite the same) */
const PATTERNS = {
  I3: { ang: [0, 240, 480], amp: [1, 0.95, 0.91] },
  I4: { ang: [0, 180, 360, 540], amp: [1, 0.96, 0.99, 0.95] },
  F4: { ang: [0, 180, 360, 540], amp: [1, 0.7, 0.95, 0.66], jit: [0, 12, -5, 9] },
  I6: { ang: [0, 120, 240, 360, 480, 600], amp: [1, 0.98, 0.99, 0.97, 1, 0.98] },
  V6: { ang: [0, 120, 240, 360, 480, 600], amp: [1, 0.86, 0.97, 0.83, 1, 0.87] },
  V8: { ang: [0, 90, 180, 270, 360, 450, 540, 630], amp: [1, 0.98, 1, 0.97, 1, 0.98, 1, 0.97] },
  V8X: { ang: [0, 90, 180, 270, 360, 450, 540, 630], amp: [1, 0.84, 0.95, 0.88, 0.98, 0.8, 0.93, 0.86], jit: [0, 4, -3, 6, 1, -5, 3, -2] },
  V12: { ang: [0, 60, 120, 180, 240, 300, 360, 420, 480, 540, 600, 660], amp: [1, 0.98, 0.99, 0.97, 1, 0.98, 0.99, 0.97, 1, 0.98, 0.99, 0.97] },
  /* a two-rotor rotary: two power pulses per turn of the eccentric shaft, sharp, from a port that slams open */
  R2: { ang: [0, 180, 360, 540], amp: [1, 0.96, 1, 0.96] }
};

class Biquad {
  constructor() { this.b0 = 1; this.b1 = 0; this.b2 = 0; this.a1 = 0; this.a2 = 0; this.x1 = 0; this.x2 = 0; this.y1 = 0; this.y2 = 0; }
  bp(f, q, sr) { const w = TAU * Math.min(f, sr * 0.45) / sr, a = Math.sin(w) / (2 * q), c = Math.cos(w), n = 1 + a; this.b0 = a / n; this.b1 = 0; this.b2 = -a / n; this.a1 = -2 * c / n; this.a2 = (1 - a) / n; return this; }
  lp(f, q, sr) { const w = TAU * Math.min(f, sr * 0.45) / sr, a = Math.sin(w) / (2 * q), c = Math.cos(w), n = 1 + a; this.b0 = (1 - c) / 2 / n; this.b1 = (1 - c) / n; this.b2 = (1 - c) / 2 / n; this.a1 = -2 * c / n; this.a2 = (1 - a) / n; return this; }
  hp(f, q, sr) { const w = TAU * Math.min(f, sr * 0.45) / sr, a = Math.sin(w) / (2 * q), c = Math.cos(w), n = 1 + a; this.b0 = (1 + c) / 2 / n; this.b1 = -(1 + c) / n; this.b2 = (1 + c) / 2 / n; this.a1 = -2 * c / n; this.a2 = (1 - a) / n; return this; }
  run(x) { const y = this.b0 * x + this.b1 * this.x1 + this.b2 * this.x2 - this.a1 * this.y1 - this.a2 * this.y2; this.x2 = this.x1; this.x1 = x; this.y2 = this.y1; this.y1 = y; return y; }
}

/* a pipe: a delay line for the round trip, a reflection at the far end, and the losses along the way */
class Pipe {
  constructor(len, sr, refl, lossHz) {
    this.n = 8192; this.buf = new Float32Array(this.n); this.w = 0;
    this.D = Math.max(2, Math.min(this.n - 2, Math.round(2 * len / 480 * sr)));   /* hot exhaust: sound runs at about 480 m/s */
    this.r = refl; this.lp = 0; this.k = 1 - Math.exp(-TAU * lossHz / sr);
  }
  run(x) {
    let i = this.w - this.D; if (i < 0) i += this.n;
    this.lp += (this.buf[i] - this.lp) * this.k;
    const y = x + this.r * this.lp;
    this.buf[this.w] = y; this.w = (this.w + 1) % this.n;
    return y;
  }
}

class EngineProc extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return [
      { name: 'rpm', defaultValue: 800, minValue: 0, maxValue: 12000, automationRate: 'k-rate' },
      { name: 'thr', defaultValue: 0, minValue: 0, maxValue: 1, automationRate: 'k-rate' },
      { name: 'load', defaultValue: 0, minValue: -1, maxValue: 1, automationRate: 'k-rate' },
      { name: 'boost', defaultValue: 0, minValue: 0, maxValue: 2, automationRate: 'k-rate' },
      { name: 'cut', defaultValue: 0, minValue: 0, maxValue: 1, automationRate: 'k-rate' },
      { name: 'gain', defaultValue: 0, minValue: 0, maxValue: 2, automationRate: 'k-rate' },
      { name: 'whine', defaultValue: 0, minValue: 0, maxValue: 20000, automationRate: 'k-rate' },
      { name: 'rev', defaultValue: 0, minValue: 0, maxValue: 1, automationRate: 'k-rate' },
      { name: 'view', defaultValue: 0, minValue: 0, maxValue: 1, automationRate: 'k-rate' },
      /* 0 off, 1 cranking (compression, no fire), 2 running */
      { name: 'mode', defaultValue: 2, minValue: 0, maxValue: 2, automationRate: 'k-rate' },
      /* a supercharger's load: its whine follows the crank, louder under boost */
      { name: 'sc', defaultValue: 0, minValue: 0, maxValue: 2, automationRate: 'k-rate' }
    ];
  }
  constructor(opts) {
    super();
    const o = (opts && opts.processorOptions) || {};
    const P = o.profile || {};
    this.layout = o.layout || 'I4';
    this.pat = PATTERNS[this.layout] || PATTERNS.I4;
    this.s = o.sound || { rough: 0.4, bass: 0.5, intake: 0.5, exhaust: 0.5, whine: 0.3 };
    this.P = Object.assign({ sc: 0, pipe: 3, header: 0.9, header2: 0, banks: 1, bankOf: null, muffler: 0.5, valve: 0.3, lope: 0, pops: 0.2, rotary: false, whine: 'helical', whineK: 0.3, turbo: 0, intakeF: 600, chain: 0, chainOrder: 24, vol: 1 }, P);
    this.idle = o.idle || 800; this.redline = o.redline || 7000;
    this.sr = sampleRate;
    const sr = this.sr, P2 = this.P;
    /* the exhaust: per bank, a header into a pipe */
    const lossHz = 3600 - 2400 * P2.muffler;
    this.hdr = []; this.pipe = [];
    for (let b = 0; b < P2.banks; b++) {
      const hl = b === 1 && P2.header2 ? P2.header2 : P2.header;
      this.hdr.push(new Pipe(hl, sr, -0.45, 6000));
      this.pipe.push(new Pipe(P2.pipe * (1 + 0.04 * b), sr, -0.6 - 0.15 * (1 - P2.muffler), lossHz));
    }
    this.muff = new Biquad().lp(5200 - 3000 * P2.muffler, 0.6, sr);
    this.body = new Biquad().lp(220, 0.7, sr);
    this.outLp = new Biquad().lp(8500, 0.7, sr); this.inLp = new Biquad().lp(4800, 0.7, sr);
    this.dcx = 0; this.dcy = 0; this.prevEx = 0;
    /* the intake: an airbox resonance and the throttle hiss */
    this.box = new Biquad().bp(P2.intakeF, 2.2, sr); this.boxN = new Biquad().bp(P2.intakeF * 2.2, 1.0, sr);
    this.hiss = new Biquad().hp(3500, 0.7, sr);
    this.tick = new Biquad().bp(5600, 3, sr);
    this.crack = new Biquad().bp(900, 1.2, sr);
    this.c = { rpm: this.idle, thr: 0, load: 0, boost: 0, cut: 0, gain: 0, whine: 0, rev: 0, view: 0, mode: 2 };
    this.phase = 0;
    this.pulses = []; this.inPulses = [];
    this.tickE = 0; this.crackE = 0;
    this.whineP = 0; this.whineP2 = 0; this.turboP = 0; this.turboF = 2000; this.chainP = 0;
    this.skipped = 0; this.scP = 0; this.scP2 = 0; this.scL = 0;
    this.seed = (o.seed || 1234) >>> 0;
    this.port.onmessage = (e) => { const d = e.data; if (d.bang) this.bang(d.bang); };
  }
  rnd() { this.seed = (this.seed * 1664525 + 1013904223) >>> 0; return this.seed / 4294967296 * 2 - 1; }
  /* unburnt fuel going off in the pipe */
  bang(k) { this.pulses.push({ t: -this.rnd() * 0.0004, a: 1.8 + 1.4 * k, tau: 0.0045 + 0.002 * k, b: (this.rnd() > 0 ? 1 : 0) % this.P.banks }); this.crackE = Math.max(this.crackE, 0.5 + 0.5 * k); }

  process(_in, outputs, params) {
    const out = outputs[0][0]; if (!out) return true;
    const c = this.c, P = this.P, s = this.s, pat = this.pat, sr = this.sr;
    const tg = (k) => params[k][0];
    const T = { rpm: tg('rpm'), thr: tg('thr'), load: tg('load'), boost: tg('boost'), cut: tg('cut'), gain: tg('gain'), whine: tg('whine'), rev: tg('rev'), view: tg('view'), mode: tg('mode'), sc: tg('sc') };
    if (T.gain < 0.0005 && c.gain < 0.0005) { out.fill(0); for (let ch = 1; ch < outputs[0].length; ch++) outputs[0][ch].fill(0); return true; }
    const n = out.length, nCyl = pat.ang.length;
    const sm = 1 - Math.exp(-n / (sr * 0.01)), smS = 1 - Math.exp(-n / (sr * 0.05));
    c.rpm += (T.rpm - c.rpm) * Math.min(1, sm * 2.2); c.thr += (T.thr - c.thr) * sm; c.load += (T.load - c.load) * sm; c.boost += (T.boost - c.boost) * smS;
    c.sc = T.sc; c.cut = T.cut; c.gain += (T.gain - c.gain) * smS; c.whine += (T.whine - c.whine) * sm; c.rev = T.rev; c.view += (T.view - c.view) * smS; c.mode = T.mode;
    const rpmK = Math.min(1, c.rpm / this.redline), running = c.mode >= 2, cranking = c.mode === 1;
    const onLoad = Math.max(0, c.load), lifted = c.thr < 0.06;
    /* the turbo's whistle follows the shaft, which lags the boost a little */
    const fT = 1600 + c.boost * 6800 + rpmK * 1400; this.turboF += (fT - this.turboF) * smS;
    const cycleHz = c.rpm / 120, inc = cycleHz / sr * 720;
    const tau0 = (0.0009 + (1 - rpmK) * 0.0022 + s.bass * 0.0008) * (P.rotary ? 0.55 : 1) * (lifted && running ? 0.65 : 1);
    const view = c.view;
    for (let i = 0; i < n; i++) {
      const prevDeg = this.phase * 720;
      this.phase += cycleHz / sr; if (this.phase >= 1) this.phase -= 1;
      const deg = this.phase * 720;
      if (c.mode > 0) for (let k = 0; k < nCyl; k++) {
        const a = (pat.ang[k] + (pat.jit ? pat.jit[k] : 0) + 720) % 720;
        const hit = prevDeg <= deg ? (prevDeg < a && a <= deg) : (a > prevDeg || a <= deg);
        if (!hit) continue;
        const b = P.bankOf ? P.bankOf[k % P.bankOf.length] : (P.banks > 1 ? k % P.banks : 0);
        if (cranking) { this.pulses.push({ t: 0, a: 0.1 * pat.amp[k], tau: 0.004, b }); this.tickE = Math.max(this.tickE, 0.5); continue; }
        /* how hard this one fires */
        let amp = pat.amp[k] * (lifted ? 0.13 + 0.1 * rpmK : 0.24 + 0.95 * onLoad + 0.16 * c.thr) * (1 + this.rnd() * s.rough * 0.22);
        let jit = 0;
        const idleK = Math.max(0, 1 - (c.rpm - this.idle) / (this.idle * 0.9));
        if (P.lope > 0 && idleK > 0) { amp *= 1 + P.lope * idleK * this.rnd() * 0.55; jit = Math.abs(this.rnd()) * P.lope * idleK * 0.0012; }
        /* misses: a rotary at idle (brap), the limiter cutting the spark */
        const miss = (P.rotary && idleK > 0 && Math.random() < P.lope * 0.14 * idleK) || (c.cut > 0.5 && Math.random() < 0.62);
        if (miss) { this.skipped++; continue; }
        if (this.skipped > 0) { amp *= 1.2 + Math.min(this.skipped, 3) * 0.25; if (c.cut > 0.5 && Math.random() < P.pops * 0.6) this.bang(0.4 + Math.random() * 0.6); this.skipped = 0; }
        /* the overrun: lifted at high revs, the loud ones crackle and pop */
        if (lifted && c.rpm > this.redline * 0.48 && Math.random() < P.pops * 0.045) this.bang(Math.random() * 0.7);
        this.pulses.push({ t: -jit, a: amp, tau: tau0 * (1 + 0.15 * this.rnd()), b });
        this.inPulses.push({ t: -0.5 / Math.max(cycleHz * nCyl / 2, 1), a: 0.4 + c.thr });
        this.tickE = Math.max(this.tickE, 1);
        if (this.pulses.length > 40) this.pulses.shift();
        if (this.inPulses.length > 24) this.inPulses.shift();
      }
      /* render the exhaust pulses per bank */
      let p0 = 0, p1 = 0;
      for (let q = this.pulses.length - 1; q >= 0; q--) {
        const pu = this.pulses[q]; pu.t += 1 / sr;
        if (pu.t < 0) continue;
        const e = Math.exp(-pu.t / pu.tau), v = pu.a * e * (1 - Math.exp(-pu.t / 0.00012));
        if (pu.b === 1) p1 += v; else p0 += v;
        if (e < 0.002) this.pulses.splice(q, 1);
      }
      let ex = 0;
      for (let b = 0; b < P.banks; b++) ex += this.pipe[b].run(this.hdr[b].run(b === 1 ? p1 : p0));
      /* the tailpipe radiates the change in pressure more than the pressure: that's the bark */
      const rad = ex - this.prevEx; this.prevEx = ex;
      let exOut = this.muff.run(ex * 0.55 + rad * (2.2 + s.exhaust * 2.2));
      const body = this.body.run(ex);
      /* intake: its own pulse train through the airbox, more of it with your foot in, a hiss when you lift */
      let ip = 0;
      for (let q = this.inPulses.length - 1; q >= 0; q--) { const pu = this.inPulses[q]; pu.t += 1 / sr; if (pu.t < 0) continue; const e = Math.exp(-pu.t / 0.0025); ip += pu.a * e; if (e < 0.003) this.inPulses.splice(q, 1); }
      const nz = this.rnd();
      const intake = (this.box.run(ip * 0.6 + nz * (0.05 + ip * 0.5)) * 1.4 + this.boxN.run(nz) * ip * 0.3) * (0.05 + c.thr * 0.5) * s.intake * (0.4 + rpmK) * (running ? 1 : 0.2);
      const vac = lifted && running ? this.hiss.run(nz) * rpmK * 0.04 : 0;
      /* the valvetrain: a tick per firing, a sewing-machine buzz by the top */
      this.tickE *= 0.92;
      const tk = P.valve > 0 ? this.tick.run(nz * this.tickE) * P.valve * (0.05 + 0.05 * rpmK) : 0;
      /* afterfire crackle */
      this.crackE *= 0.99925;
      const cr = this.crackE > 0.01 ? this.crack.run(nz) * this.crackE * (Math.random() < 0.04 ? 3.5 : 0.35) : 0;
      /* the turbo */
      let tb = 0;
      if (P.turbo > 0) { this.turboP += this.turboF / sr; if (this.turboP > 1) this.turboP -= 1; tb = Math.sin(this.turboP * TAU + 0.3 * Math.sin(this.turboP * 7.1)) * c.boost * (0.25 + 0.75 * c.thr) * P.turbo * 0.035; }
      /* the gearbox: helical gears hum, straight-cut gears howl, and reverse is always straight-cut */
      let wh = 0;
      if (c.whine > 20) {
        this.whineP += c.whine / sr; if (this.whineP > 1) this.whineP -= 1;
        const straight = P.whine === 'straight' || c.rev > 0.5;
        const wk = Math.min(1, c.whine / 500) * (straight ? 0.04 : 0.013) * (P.whineK + (c.rev > 0.5 ? 0.8 : 0)) * (lifted ? 1.5 : 1);
        wh = (Math.sin(this.whineP * TAU) + (straight ? 0.4 * Math.sin(this.whineP * TAU * 2 + 1) : 0)) * wk * (straight ? 0.8 + 0.2 * Math.sin(this.whineP * 0.013) : 1);
      }
      /* gear-driven cams (the V12): a fine whine at a high crank order */
      let ch = 0;
      if (P.chain > 0) { this.chainP += c.rpm / 60 * P.chainOrder / sr; if (this.chainP > 1) this.chainP -= 1; ch = Math.sin(this.chainP * TAU) * P.chain * rpmK * rpmK * 0.02; }
      /* the blower: belt-driven off the crank (about 2.4x), three-lobe rotors, so a whine at a high crank order that
         climbs with the revs and gets louder on boost */
      let scw = 0;
      if (P.sc > 0) { this.scP += c.rpm / 60 * 2.4 * 6 / sr; if (this.scP > 1) this.scP -= 1; this.scP2 += c.rpm / 60 * 2.4 * 12 / sr; if (this.scP2 > 1) this.scP2 -= 1; this.scL += ((0.25 + c.sc * 2) - this.scL) * 0.0005; scw = (Math.sin(this.scP * TAU) + 0.35 * Math.sin(this.scP2 * TAU)) * P.sc * this.scL * 0.085 * (0.3 + rpmK); }
      const inK = 1 + view * 0.9;
      let y = exOut * (1 - view * 0.35) * 0.5 + body * (0.35 + view * 0.8) + intake * inK + vac + tk + cr + tb + wh + ch + scw;
      /* dc out, then a little drive, no harder than a console mixer would have taken */
      const dy = y - this.dcx + 0.995 * this.dcy; this.dcx = y; this.dcy = dy; y = dy;
      const drive = 1.1 + s.rough * 2.0;
      y = Math.tanh(y * drive) / Math.tanh(drive);
      const yo = this.outLp.run(y), yi = this.inLp.run(y);
      out[i] = (yo * (1 - view) + yi * view) * c.gain * P.vol;
    }
    for (let ch2 = 1; ch2 < outputs[0].length; ch2++) outputs[0][ch2].set(out);
    return true;
  }
}
registerProcessor('cs-engine', EngineProc);

/* ============================================================
   the tires: stick-slip, live.
   a squeal is rubber gripping the road, being dragged until it
   lets go, grabbing again, hundreds of times a second. each wheel
   here has two tread elements (a mass on a spring, the road sliding
   under it with stribeck friction: grippier when it's nearly
   stopped, slipperier once it's moving) and the game tells it how
   fast the contact patch is sliding and how hard the wheel is
   pressed down. at a little slip it chatters and groans; as the
   slip builds it locks into a squeal and the pitch climbs; at a
   full slide it settles into a steady screech with the rubber
   hissing under it. a wet road takes the grip difference away, so
   it barely sings at all.
============================================================ */
class TireProc extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    const p = [];
    for (let i = 0; i < 4; i++) p.push({ name: 's' + i, defaultValue: 0, minValue: 0, maxValue: 60, automationRate: 'k-rate' }, { name: 'l' + i, defaultValue: 1, minValue: 0, maxValue: 3, automationRate: 'k-rate' }, { name: 'g' + i, defaultValue: 0, minValue: 0, maxValue: 2, automationRate: 'k-rate' });
    p.push({ name: 'wet', defaultValue: 0, minValue: 0, maxValue: 1, automationRate: 'k-rate' }, { name: 'pitch', defaultValue: 1, minValue: 0.5, maxValue: 2, automationRate: 'k-rate' });
    return p;
  }
  constructor(opts) {
    super();
    const o = (opts && opts.processorOptions) || {};
    this.sr = sampleRate; this.seed = (o.seed || 99) >>> 0;
    this.side = o.side || [-1, 1, -1, 1];
    this.w = [];
    for (let i = 0; i < 4; i++) {
      const els = [0, 1].map(j => ({ f0: (j ? 1190 : 960) * (1 + 0.04 * (i - 1.5) / 1.5), x: 0, v: 0 }));
      this.w.push({ els, g: 0, s: 0, l: 1, tex1: 0, tex2: 0, hp: 0, hpx: 0 });
    }
    this.bp = [0, 1].map(() => [new Biquad().bp(1900, 1.1, this.sr), new Biquad().bp(3100, 1.6, this.sr)]);
    this.hissF = [0, 1].map(() => new Biquad().bp(2600, 0.9, this.sr));
    this.lp = [0, 1].map(() => new Biquad().lp(7500, 0.7, this.sr));
    this.hiss = 0;
  }
  rnd() { this.seed = (this.seed * 1664525 + 1013904223) >>> 0; return this.seed / 4294967296 * 2 - 1; }
  process(_in, outputs, params) {
    const out = outputs[0]; if (!out || !out[0]) return true;
    const L = out[0], R = out[1] || out[0], n = L.length, sr = this.sr, dt = 1 / sr;
    const wet = params.wet[0], pitch = params.pitch[0];
    let any = false, hissT = 0;
    for (let i = 0; i < 4; i++) {
      const W = this.w[i];
      W.g += (params['g' + i][0] - W.g) * 0.25; W.s += (params['s' + i][0] - W.s) * 0.3; W.l += (params['l' + i][0] - W.l) * 0.3;
      if (W.g > 0.0005) any = true;
      hissT += W.g * Math.min(1, W.s / 8);
    }
    this.hiss += (hissT - this.hiss) * 0.2;
    if (!any && this.hiss < 0.0005) { L.fill(0); if (R !== L) R.fill(0); return true; }
    L.fill(0); if (R !== L) R.fill(0);
    const ms = 1.0, mc = 0.5 + 0.32 * wet, vs = 0.09 + 0.05 * wet;
    const texK = 1 - Math.exp(-2 * Math.PI * 30 / sr);
    for (let i = 0; i < 4; i++) {
      const W = this.w[i]; if (W.g <= 0.0005) continue;
      const vb = 0.03 + 0.22 * (1 - Math.exp(-W.s / 3));
      const gl = W.g, pan = this.side[i];
      const gL = gl * (pan < 0 ? 0.62 : 0.38), gR = gl * (pan < 0 ? 0.38 : 0.62);
      const ks = W.els.map(e => { const w = 2 * Math.PI * e.f0 * pitch; return { k: w * w, c: 2 * 0.03 * w }; });
      for (let t = 0; t < n; t++) {
        /* the road: the load wanders with its texture, slowly */
        W.tex1 += (this.rnd() - W.tex1) * texK; W.tex2 += (W.tex1 * 6 - W.tex2) * texK;
        let acc = 0;
        for (let j = 0; j < 2; j++) {
          const e = W.els[j], K = ks[j];
          const N = W.l * K.k * 1e-4 * (1 + 0.12 * W.tex2) * (1 + 0.08 * j);
          const vr = e.v - vb, Fs = -K.k * e.x - K.c * e.v;
          if (vr < 1e-3 && vr > -1e-3 && Math.abs(Fs) <= N * ms) { e.v = vb; }
          else { const mu = mc + (ms - mc) * Math.exp(-(vr / vs) * (vr / vs)); e.v += (Fs - N * mu * Math.sign(vr)) * dt; }
          e.x += e.v * dt;
          if (!(e.x > -10 && e.x < 10)) { e.x = 0; e.v = 0; }
          acc += e.v - vb;
        }
        /* dc out */
        const y = acc - W.hpx + 0.995 * W.hp; W.hpx = acc; W.hp = y;
        L[t] += y * gL; R[t] += y * gR;
      }
    }
    /* the tire's own body colours it; the rubber hisses as it slides */
    for (let ch = 0; ch < 2; ch++) {
      const buf = ch ? R : L; if (ch && R === L) break;
      const [b1, b2] = this.bp[ch], hf = this.hissF[ch], lp = this.lp[ch];
      for (let t = 0; t < n; t++) {
        const x = buf[t] * 2.2;
        let y = x * 0.55 + b1.run(x) * 0.9 + b2.run(x) * 0.4 + hf.run(this.rnd()) * this.hiss * 0.18;
        y = Math.tanh(y * 1.3) / 1.3;
        buf[t] = lp.run(y);
      }
    }
    return true;
  }
}
registerProcessor('cs-tire', TireProc);
