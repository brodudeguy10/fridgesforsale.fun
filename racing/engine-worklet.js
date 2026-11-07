/* ============================================================
   COLD START engine synth (audio worklet).
   no samples. a crank turns, cylinders fire at their real angles,
   each firing is a pressure pulse that rings through a tuned
   exhaust, an intake roars under throttle, a turbo whistles and
   dumps, the gearbox whines. a crossplane V8 burbles because its
   banks fire unevenly; a flat four drums because its headers are
   unequal; a four-pot just buzzes. same code, different engine.
============================================================ */
const TAU = Math.PI * 2;
/* firing patterns: [crank angle of each firing in a 720 degree cycle, amplitude] */
const PATTERNS = {
  I3: { ang: [0, 240, 480], amp: [1, 0.96, 0.92] },
  I4: { ang: [0, 180, 360, 540], amp: [1, 0.97, 0.99, 0.96] },
  F4: { ang: [0, 180, 360, 540], amp: [1, 0.62, 0.94, 0.58], jit: [0, 14, -6, 10] },
  I6: { ang: [0, 120, 240, 360, 480, 600], amp: [1, 0.98, 0.99, 0.97, 1, 0.98] },
  V6: { ang: [0, 120, 240, 360, 480, 600], amp: [1, 0.85, 0.97, 0.82, 1, 0.86] },
  V8: { ang: [0, 90, 180, 270, 360, 450, 540, 630], amp: [1, 0.98, 1, 0.97, 1, 0.98, 1, 0.97] },
  /* crossplane: the two banks each see uneven gaps, the merge burbles */
  V8X: { ang: [0, 90, 180, 270, 360, 450, 540, 630], amp: [1, 0.66, 0.92, 0.74, 0.97, 0.6, 0.88, 0.7], jit: [0, 6, -4, 9, 2, -7, 5, -3] },
  V12: { ang: [0, 60, 120, 180, 240, 300, 360, 420, 480, 540, 600, 660], amp: [1, 0.97, 0.99, 0.96, 1, 0.97, 0.99, 0.96, 1, 0.97, 0.99, 0.96] },
  R2: { ang: [0, 180, 360, 540], amp: [1, 0.95, 1, 0.95] }
};

class Biquad {
  constructor() { this.b0 = 1; this.b1 = 0; this.b2 = 0; this.a1 = 0; this.a2 = 0; this.x1 = 0; this.x2 = 0; this.y1 = 0; this.y2 = 0; }
  bp(f, q, sr) { const w = TAU * Math.min(f, sr * 0.45) / sr, a = Math.sin(w) / (2 * q), c = Math.cos(w), n = 1 + a; this.b0 = a / n; this.b1 = 0; this.b2 = -a / n; this.a1 = -2 * c / n; this.a2 = (1 - a) / n; }
  lp(f, q, sr) { const w = TAU * Math.min(f, sr * 0.45) / sr, a = Math.sin(w) / (2 * q), c = Math.cos(w), n = 1 + a; this.b0 = (1 - c) / 2 / n; this.b1 = (1 - c) / n; this.b2 = (1 - c) / 2 / n; this.a1 = -2 * c / n; this.a2 = (1 - a) / n; }
  hp(f, q, sr) { const w = TAU * Math.min(f, sr * 0.45) / sr, a = Math.sin(w) / (2 * q), c = Math.cos(w), n = 1 + a; this.b0 = (1 + c) / 2 / n; this.b1 = -(1 + c) / n; this.b2 = (1 + c) / 2 / n; this.a1 = -2 * c / n; this.a2 = (1 - a) / n; }
  run(x) { const y = this.b0 * x + this.b1 * this.x1 + this.b2 * this.x2 - this.a1 * this.y1 - this.a2 * this.y2; this.x2 = this.x1; this.x1 = x; this.y2 = this.y1; this.y1 = y; return y; }
}

class EngineProc extends AudioWorkletProcessor {
  constructor(opts) {
    super();
    const o = (opts && opts.processorOptions) || {};
    this.layout = o.layout || 'I4';
    this.pat = PATTERNS[this.layout] || PATTERNS.I4;
    this.sound = o.sound || { rough: 0.4, bass: 0.5, intake: 0.5, exhaust: 0.5, whine: 0.3 };
    this.litres = o.litres || 2;
    this.turbo = !!o.turbo;
    this.idle = o.idle || 800;
    /* targets set by the game, smoothed here per sample */
    this.t = { rpm: this.idle, thr: 0, load: 0, boost: 0, cut: 0, whine: 0, gain: 0, on: 1 };
    this.c = { rpm: this.idle, thr: 0, load: 0, boost: 0, cut: 0, whine: 0, gain: 0 };
    if (o.init) { Object.assign(this.t, o.init); Object.assign(this.c, o.init); }
    this.phase = 0; this.lastSlot = -1;
    this.pulses = []; // active firing pulses
    this.seed = 1234;
    const sr = sampleRate;
    /* exhaust: two resonances, bigger engines ring lower */
    const big = Math.min(1, this.litres / 6);
    this.ex1 = new Biquad(); this.ex1.bp(110 - big * 55 + this.sound.bass * -20, 1.4, sr);
    this.ex2 = new Biquad(); this.ex2.bp(420 - big * 160, 2.2, sr);
    this.ex3 = new Biquad(); this.ex3.bp(1400 - big * 500, 3, sr);
    this.lpOut = new Biquad(); this.lpOut.lp(5200, 0.7, sr);
    this.intake = new Biquad(); this.intakeF = 600;
    this.dc = 0; this.bov = 0; this.bovF = new Biquad(); this.bovF.bp(2400, 1.6, sr);
    this.whineP = 0; this.turboP = 0; this.popT = 0; this.pop = 0; this.popF = new Biquad(); this.popF.bp(320, 1.2, sr);
    this.crankle = 0;
    this.port.onmessage = (e) => {
      const d = e.data;
      if (d.bov) { this.bov = 1; return; }
      if (d.pop) { this.pop = 1; return; }
      Object.assign(this.t, d);
    };
  }
  rnd() { this.seed = (this.seed * 1664525 + 1013904223) >>> 0; return this.seed / 4294967296 * 2 - 1; }
  process(_in, outputs) {
    const out = outputs[0][0]; if (!out) return true;
    const sr = sampleRate, t = this.t, c = this.c, s = this.sound, pat = this.pat;
    const n = out.length, nCyl = pat.ang.length;
    /* update filters once a block */
    const rpmK = Math.min(1, c.rpm / 7000);
    this.intakeF += ((300 + rpmK * 1800 + c.thr * 900) - this.intakeF) * 0.2;
    this.intake.bp(this.intakeF, 1.1, sr);
    const sm = 1 - Math.exp(-1 / (sr * 0.012));
    for (let i = 0; i < n; i++) {
      c.rpm += (t.rpm - c.rpm) * sm * 2.5; c.thr += (t.thr - c.thr) * sm; c.load += (t.load - c.load) * sm; c.boost += (t.boost - c.boost) * sm * 0.5; c.cut += (t.cut - c.cut) * sm * 4; c.whine += (t.whine - c.whine) * sm; c.gain += (t.gain - c.gain) * sm * 0.3;
      /* the crank: one cycle is 720 degrees, two revolutions */
      const cycleHz = c.rpm / 120;
      this.phase += cycleHz / sr; if (this.phase >= 1) this.phase -= 1;
      const deg = this.phase * 720;
      /* which cylinder fires now: did the crank pass its angle this sample? */
      const inc = cycleHz / sr * 720, prev = deg - inc;
      for (let k = 0; k < nCyl; k++) {
        const a = (pat.ang[k] + (pat.jit ? pat.jit[k] : 0) + 720) % 720;
        const hit = prev >= 0 ? (prev < a && a <= deg) : (a <= deg || a > prev + 720);
        if (!hit) continue;
        /* each firing's strength: load, a little randomness, the pattern */
        const amp = pat.amp[k] * (0.35 + Math.max(0, c.load) * 0.85 + c.thr * 0.2) * (1 + this.rnd() * s.rough * 0.25) * (1 - c.cut * 0.85);
        this.pulses.push({ t: 0, a: amp });
        if (this.pulses.length > 24) this.pulses.shift();
      }
      /* render the pulses: a sharp pressure spike that decays, ringing through the pipe */
      let p = 0;
      const tau = 0.0016 + (1 - rpmK) * 0.0026 + s.bass * 0.0012;
      for (let q = this.pulses.length - 1; q >= 0; q--) {
        const pu = this.pulses[q]; pu.t += 1 / sr;
        const e = Math.exp(-pu.t / tau);
        p += pu.a * e * (1 - Math.exp(-pu.t / 0.00018));
        if (e < 0.002) this.pulses.splice(q, 1);
      }
      p -= this.dc; this.dc += p * 0.002; // keep it centered
      const ex = this.ex1.run(p) * (1.4 + s.bass * 1.6) + this.ex2.run(p) * (0.9 + s.exhaust) + this.ex3.run(p) * (0.3 + s.rough * 0.6) + p * 0.25;
      /* intake: filtered noise, opens up with the throttle */
      const noise = this.rnd();
      const inn = this.intake.run(noise) * (0.04 + c.thr * 0.22) * s.intake * (0.5 + rpmK);
      /* overrun pops: the exhaust crackles when you lift at high rpm */
      if (this.pop > 0) { this.pop *= 0.9993; }
      const pp = this.pop > 0.01 ? this.popF.run(this.rnd()) * this.pop * 1.6 * (Math.random() < 0.03 ? 4 : 0.4) : 0;
      /* turbo: a whistle that climbs with boost, and a blow-off valve dump */
      let tb = 0;
      if (this.turbo) { this.turboP += (2200 + c.boost * 5200 + rpmK * 1400) / sr; if (this.turboP > 1) this.turboP -= 1; tb = Math.sin(this.turboP * TAU) * c.boost * 0.05 * c.thr; }
      let bv = 0; if (this.bov > 0.002) { bv = this.bovF.run(this.rnd()) * this.bov * 0.9; this.bov *= 0.99965; }
      /* gearbox whine */
      this.whineP += (c.whine * 1) / sr; if (this.whineP > 1) this.whineP -= 1;
      const wh = Math.sin(this.whineP * TAU) * s.whine * 0.025 * Math.min(1, c.whine / 400);
      let y = ex * 0.5 + inn + pp + tb + bv + wh;
      /* the rough ones distort a little: a tanh, no harder than a ps2 mixer would */
      const drive = 1.2 + s.rough * 2.2;
      y = Math.tanh(y * drive) / Math.tanh(drive);
      y = this.lpOut.run(y);
      out[i] = y * c.gain;
    }
    /* copy to any other channels */
    for (let ch = 1; ch < outputs[0].length; ch++) outputs[0][ch].set(out);
    return true;
  }
}
registerProcessor('cs-engine', EngineProc);
