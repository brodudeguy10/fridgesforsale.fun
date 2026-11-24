/* ============================================================
   THE GUY, version three: sound.
   one sprite (audio/gore.mp3, mapped by audio/gore.json) holds every
   sound: Kenney's CC0 recordings (bodies hitting things, sheet
   metal, footsteps, cloth, a knife) and synthesized flesh, bone,
   blood and voice. see fridges-tools/gore-audio/build.py.

   nothing here plays "the hit sound". an event comes in saying what
   happened (a 2.1 kg forearm hit concrete at 6 m/s and the bone
   cracked) and the sound is chosen from that: the body sample by the
   mass and the energy, a ring if what it hit was a fridge, a crack
   if a bone went, a wet layer if the skin opened. every variation is
   used once before any is used twice, pitch and level wander a
   little, the stereo position follows where it happened on screen,
   a guy trapped under a fridge is muffled by it, and there's a cap
   on how many sounds can play at once so a hundred falling fridges
   don't turn into noise.

   until the sprite has loaded (or if it can't), the old synthesized
   sounds from version two stand in.
============================================================ */
(function () {
'use strict';
const G = window.__G3; if (!G) return;
const S = G.S, clamp = G.clamp, rnd = G.rnd;
const AU = G.audio = {};
const here = (document.currentScript && document.currentScript.src) || '';
/* the torture room's copy of this file lives in torture/gore/; the sounds stay where the fridge page keeps them */
const BASE = here ? new URL('../../extras/gore/audio/', here).href : '../extras/gore/audio/';
let bus = null, comp = null, buf = null, man = null, loading = false, files = {}, noiseBuf = null;
const bags = {}, last = {}, voices = [];
const MAX = 30;

function ac() { return G.acIfAny(); }
function out() {
  const A = ac(); if (!A) return null;
  if (!bus) {
    comp = A.createDynamicsCompressor(); comp.threshold.value = -14; comp.knee.value = 10; comp.ratio.value = 4; comp.attack.value = 0.003; comp.release.value = 0.18;
    bus = A.createGain(); bus.gain.value = 0.62; bus.connect(comp); comp.connect(A.destination);
  }
  if (!loading) load(A);
  return A;
}
function load(A) {
  loading = true;
  fetch(BASE + 'gore.json').then(r => r.json()).then(m => { man = m; return fetch(BASE + 'gore.mp3'); }).then(r => r.arrayBuffer()).then(b => new Promise((res, rej) => A.decodeAudioData(b, res, rej))).then(d => { buf = d; G.note('audio sprite ' + d.duration.toFixed(1) + ' s'); }).catch(e => G.err('audio load', e));
  /* the page's own recordings, so they can be panned and overlapped too */
  for (const [k, f] of [['shot', 'revolver.mp3'], ['flesh', 'bullethitflesh.mp3'], ['glass', 'glassshatter.mp3']]) fetch((G.siteRoot || '') + f).then(r => r.ok ? r.arrayBuffer() : Promise.reject(f)).then(b => new Promise((res, rej) => A.decodeAudioData(b, res, rej))).then(d => { files[k] = d; }).catch(() => {});
}
AU.ready = () => !!buf;
AU.prime = () => out();

/* ------------------------------------------------------------ play one variation of a sound */
function pan(x) { return clamp(((x == null ? G.W() / 2 : x) / G.W()) * 2 - 1, -1, 1) * 0.7; }
AU.play = function (name, o = {}) {
  const A = out(); if (!A || !buf || !man || G.away()) return null;
  const vs = man.sounds[name]; if (!vs) return null;
  const now = A.currentTime, key = o.key || name;
  if (last[key] && now - last[key] < (o.gap != null ? o.gap : 0.028)) return null;
  last[key] = now;
  const gain = clamp(o.gain == null ? 0.8 : o.gain, 0, 1.6); if (gain < 0.02) return null;
  /* too much going on: the quietest new sounds are the ones that don't get to play */
  for (let i = voices.length - 1; i >= 0; i--) if (voices[i].end < now) voices.splice(i, 1);
  if (voices.length >= MAX) { const q = voices.reduce((a, b) => a.gain < b.gain ? a : b); if (q.gain > gain) return null; try { q.src.stop(); } catch (e) {} voices.splice(voices.indexOf(q), 1); }
  const pick = bags[name] || (bags[name] = G.bag(vs.length));
  const [t0, d] = vs[pick()];
  const src = A.createBufferSource(); src.buffer = buf;
  const rate = clamp((o.rate || 1) * (1 + rnd(-0.045, 0.045)), 0.4, 2.5); src.playbackRate.value = rate;
  let node = src;
  if (o.lp) { const f = A.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = o.lp; f.Q.value = 0.7; node.connect(f); node = f; }
  const v = A.createGain(); v.gain.value = gain * (1 + rnd(-0.08, 0.08)); node.connect(v); node = v;
  if (A.createStereoPanner) { const p = A.createStereoPanner(); p.pan.value = pan(o.x); node.connect(p); node = p; }
  node.connect(bus);
  const when = now + (o.delay || 0), dur = Math.min(d, o.dur || d);
  src.start(when, t0, dur);
  const rec = { src, gain, end: when + dur / rate, name };
  voices.push(rec);
  return rec;
};
AU.file = function (k, o = {}) {
  const A = out(); if (!A) return;
  if (!files[k]) { const el = new Audio((G.siteRoot || '') + { shot: 'revolver.mp3', flesh: 'bullethitflesh.mp3', glass: 'glassshatter.mp3' }[k]); el.volume = clamp(o.gain || 0.5, 0, 1); el.play().catch(() => {}); return; }
  const src = A.createBufferSource(); src.buffer = files[k]; src.playbackRate.value = (o.rate || 1) * (1 + rnd(-0.03, 0.03));
  const v = A.createGain(); v.gain.value = o.gain || 0.6; src.connect(v); let node = v;
  if (A.createStereoPanner) { const p = A.createStereoPanner(); p.pan.value = pan(o.x); node.connect(p); node = p; }
  node.connect(bus); src.start();
};

/* ------------------------------------------------------------ version two's synthesizer, for before the sprite arrives */
function nb(A) { if (!noiseBuf) { noiseBuf = A.createBuffer(1, A.sampleRate, A.sampleRate); const d = noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; } return noiseBuf; }
function noise(A, t, dur, type, f0, f1, q, g) { const s = A.createBufferSource(); s.buffer = nb(A); s.loop = true; const f = A.createBiquadFilter(); f.type = type; f.frequency.setValueAtTime(f0, t); f.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + dur); f.Q.value = q; const v = A.createGain(); v.gain.setValueAtTime(0.0001, t); v.gain.exponentialRampToValueAtTime(g, t + Math.min(0.01, dur * 0.2)); v.gain.exponentialRampToValueAtTime(0.0001, t + dur); s.connect(f); f.connect(v); v.connect(bus); s.start(t, Math.random() * 0.5); s.stop(t + dur + 0.05); }
function tone(A, t, dur, type, f0, f1, g) { const o = A.createOscillator(); o.type = type; o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + dur); const v = A.createGain(); v.gain.setValueAtTime(0.0001, t); v.gain.exponentialRampToValueAtTime(g, t + 0.008); v.gain.exponentialRampToValueAtTime(0.0001, t + dur); o.connect(v); v.connect(bus); o.start(t); o.stop(t + dur + 0.05); }
const SYN = {
  squish(k = 1) { const A = out(); if (!A) return; const t = A.currentTime; noise(A, t, 0.16 + 0.1 * k, 'bandpass', rnd(700, 1200), 220, 2.5, 0.35 * k); tone(A, t, 0.14, 'sine', 140, 55, 0.25 * k); },
  crunch(k = 1) { const A = out(); if (!A) return; const t = A.currentTime; for (let i = 0; i < 4; i++) noise(A, t + i * 0.011 + Math.random() * 0.006, 0.025, 'highpass', rnd(1800, 3200), 1500, 1, 0.3 * k); tone(A, t, 0.08, 'square', 220, 90, 0.08 * k); },
  thud(k = 1) { const A = out(); if (!A) return; const t = A.currentTime; tone(A, t, 0.22, 'sine', 95, 38, 0.6 * k); noise(A, t, 0.12, 'lowpass', 500, 120, 1, 0.4 * k); },
  cut() { const A = out(); if (!A) return; const t = A.currentTime; noise(A, t, 0.13, 'bandpass', 1500, 500, 2, 0.3); },
  boom() { const A = out(); if (!A) return; const t = A.currentTime; noise(A, t, 1.6, 'lowpass', 1400, 60, 0.7, 1.0); tone(A, t, 0.9, 'sine', 70, 24, 0.9); },
  click() { const A = out(); if (!A) return; const t = A.currentTime; noise(A, t, 0.02, 'highpass', 3000, 2500, 2, 0.35); },
  scream(pitch = 1, k = 1) { const A = out(); if (!A) return; const t = A.currentTime, d = 0.6 + 0.6 * k; const o = A.createOscillator(); o.type = 'sawtooth'; o.frequency.setValueAtTime(420 * pitch, t); o.frequency.exponentialRampToValueAtTime(150 * pitch, t + d); const f = A.createBiquadFilter(); f.type = 'peaking'; f.frequency.value = 900 * pitch; f.Q.value = 6; f.gain.value = 22; const v = A.createGain(); v.gain.setValueAtTime(0.0001, t); v.gain.exponentialRampToValueAtTime(0.4 * k, t + 0.04); v.gain.exponentialRampToValueAtTime(0.0001, t + d); o.connect(f); f.connect(v); v.connect(bus); o.start(t); o.stop(t + d + 0.05); }
};
/* the whistle for six from six, and the cylinder: still synthesized */
function whistle() { const A = out(); if (!A) return; const t = A.currentTime; [[1318, 0.5], [1760, 0.35], [1318, 0.7]].reduce((at, [f, d]) => { tone(A, at, d, 'sine', f, f * 0.995, 0.12); return at + d * 0.9; }, t); }
function want(name, o, fallback) { if (AU.play(name, o)) return true; if (!buf && fallback) fallback(); return false; }

/* ------------------------------------------------------------ what each thing sounds like */
const lg = (E, a, b) => clamp(Math.log10(1 + E) / Math.log10(1 + b) * (1 - a) + a, 0, 1.3);
/* a part of him hits something */
G.on('impact', (g, p, h, R) => {
  const E = h.E || 0, x = h.wx, heavy = E > 45, mid = E > 9;
  const rate = clamp(1.12 - Math.log10(Math.max(1, h.kg || 3)) * 0.18, 0.78, 1.25);
  const muff = g.dm && g.dm.loadKg > 20 ? 1400 : 0;
  /* the body: by how much went into it */
  want(heavy ? 'body_heavy' : mid ? 'body_med' : 'body_light', { x, gain: lg(E, 0.12, 400) * 0.9, rate, lp: muff || undefined, key: 'body' + g.id, gap: 0.035 }, () => SYN.thud(clamp(E / 40, 0.2, 1)));
  /* what it hit */
  if (h.mat === 'metal') AU.play(E > 60 ? 'fridge_heavy' : E > 12 ? 'fridge_med' : 'fridge_light', { x, gain: lg(E, 0.1, 500) * 0.75, rate: rnd(0.9, 1.05), key: 'fridgehit', gap: 0.05 });
  else if (h.mat === 'flesh' && E > 6) AU.play('punch', { x, gain: lg(E, 0.1, 200) * 0.6, rate: rnd(0.9, 1.1), key: 'fleshflesh' });
  else if (h.mat === 'wood') AU.play('wood', { x, gain: lg(E, 0.1, 60) * 0.6 });
  /* the wet part, if he opened */
  if (R && (R.skin < 0.9 || R.soft > 0.6) && E > 15 && !g.dusty) AU.play(E > 80 ? 'squelch' : 'squish', { x, gain: lg(E, 0.1, 300) * 0.55, key: 'wet' + g.id, gap: 0.06 });
  if (g.dusty && E > 8) AU.play('crunch', { x, gain: lg(E, 0.1, 200) * 0.4, rate: 1.3 });
});
G.on('fracture', (g, p, f) => {
  const x = p.body.position.x, E = f.E || 40;
  if (f.region === 'thorax' || f.frac >= 3 || f.crush) want('crunch', { x, gain: lg(E, 0.4, 300), rate: rnd(0.85, 1.1), key: 'bone' + g.id, gap: 0.05 }, () => SYN.crunch(1.2));
  else want('crack', { x, gain: lg(E, 0.45, 300), rate: rnd(0.9, 1.2) * (A0(p.kind) ? 1.15 : 1), key: 'bone' + g.id, gap: 0.05 }, () => SYN.crunch(1));
  if (f.compound) AU.play('squelch', { x, gain: 0.6, delay: 0.02 });
});
const A0 = k => k === 'hand' || k === 'foot' || k === 'larm';
G.on('joint', (g, j, st) => { const pv = G.body.pivot(j); if (st === 'sprain') return; AU.play('snap', { x: pv.x, gain: st === 'broken' ? 0.9 : 0.65, rate: rnd(0.9, 1.1) }); if (st === 'broken') AU.play('crack', { x: pv.x, gain: 0.7, delay: 0.01 }); });
G.on('torn', (g, j, out, ev) => {
  const x = (out.wa.x + out.wb.x) / 2;
  if (g.dusty) { AU.play('crunch', { x, gain: 0.8, rate: 1.2 }); return; }
  want(out.why === 'cut' ? 'chop' : 'tear', { x, gain: 0.95 }, () => SYN.squish(1.3));
  AU.play('squelch', { x, gain: 0.8, delay: 0.03 });
  if (j.id === 'neck' || j.id === 'spine' || j.id === 'waist') AU.play('crunch', { x, gain: 0.8, delay: 0.015 });
});
G.on('creak', (g, j) => { const pv = G.body.pivot(j); AU.play('crunch', { x: pv.x, gain: 0.18, rate: rnd(1.2, 1.6), key: 'creak' + g.id, gap: 0.12 }); });
G.on('step', (g, f) => { const c = f.contacts.find(q => q.n.y < -0.5); const metal = c && c.other.plugin && c.other.plugin.fv; AU.play(metal ? 'step_metal' : 'step', { x: f.body.position.x, gain: metal ? 0.35 : 0.28, rate: rnd(0.92, 1.08), key: 'step' + g.id, gap: 0.08 }); });
G.on('abrade', (g, p, a) => { if (G.t - (p.scrapeT || 0) < 0.22) return; p.scrapeT = G.t; AU.play('scrape', { x: p.body.position.x, gain: clamp(a.dose * 900, 0.08, 0.45), key: 'scrape' + g.id, gap: 0.2 }); if (Math.random() < 0.4) AU.play('cloth', { x: p.body.position.x, gain: 0.2, key: 'cloth' + g.id, gap: 0.25 }); });
G.on('thrown', g => { const c = G.body.com(g); AU.play('whoosh', { x: c.x, gain: 0.45, rate: 0.75 }); });
G.on('beat', g => { if (!g.dm || g.dusty || g.dm.blood > 2900 || !g.alive) return; AU.play('heart', { gain: 0.35 * clamp((3000 - g.dm.blood) / 1200, 0.3, 1), key: 'heart' + g.id, gap: 0.25, rate: 0.95 }); });
G.on('artery', (g, p, a) => { AU.play('spurt', { x: p.body.position.x, gain: 0.6 }); });
G.on('ko', g => { const c = G.body.com(g); AU.play('body_med', { x: c.x, gain: 0.25, rate: 0.8 }); });
G.on('death', (g, code) => {
  if (g.dusty) return;
  const hd = g.parts.head; if (hd.gone || code === 'decap') return;
  setTimeout(() => AU.play('v_death', { x: hd.body.position.x, gain: 0.55, rate: g.pitch * rnd(0.95, 1.02) }), 250);
});
/* everything else asks by name */
G.on('sfx', (name, o = {}) => {
  const x = o.x;
  switch (name) {
    case 'squish': want('squish', { x, gain: clamp(0.4 * (o.k || 1), 0.1, 0.9) }, () => SYN.squish(o.k || 1)); break;
    case 'splat': AU.play('splat', { x, gain: clamp(0.3 * (o.k || 1), 0.05, 0.6), key: 'splat', gap: 0.04 }); break;
    case 'drop': AU.play('drip', { x, gain: clamp(0.25 * (o.k || 1), 0.05, 0.4), key: 'drip', gap: 0.05 }); break;
    case 'spurt': AU.play('spurt', { x, gain: clamp(0.3 * (o.k || 1), 0.1, 0.55), key: 'spurt', gap: 0.18 }); break;
    case 'headpop': want('headpop', { x, gain: 1.0 }, () => { SYN.squish(1.6); SYN.crunch(1.6); }); break;
    case 'hammer': want('punch', { x, gain: clamp(0.35 + (o.k || 1) * 0.35, 0.3, 1) }, () => SYN.thud(1)); AU.play('wood', { x, gain: 0.25, rate: 0.8 }); break;
    case 'hammerMetal': AU.play('fridge_med', { x, gain: clamp(0.5 * (o.k || 1), 0.2, 0.9) }); break;
    case 'whiff': AU.play('whoosh', { x, gain: 0.3 }); break;
    case 'thud': AU.play('body_light', { x, gain: 0.35 }); break;
    case 'shot': AU.file('shot', { x, gain: 0.55 }); break;
    case 'fleshShot': AU.file('flesh', { x, gain: 0.55 }); AU.play('squelch', { x, gain: 0.5, delay: 0.02 }); break;
    case 'dry': want('click', { x, gain: 0.6 }, () => SYN.click()); break;
    case 'reload': AU.play('ratchet', { gain: 0.6 }); AU.play('latch', { gain: 0.6, delay: 0.75 }); break;
    case 'ping': AU.play('ping', { x, gain: 0.55 }); break;
    case 'glass': AU.play('glass', { x, gain: 0.5 }); break;
    case 'fuse': AU.play('fuse', { x, gain: 0.22, dur: o.dur || 2.6 }); break;
    case 'boom': want('boom', { x, gain: 1.2 }, () => SYN.boom()); break;
    case 'swish': AU.play('whoosh', { x, gain: clamp(0.3 * (o.k || 1), 0.1, 0.5), rate: 1.4, key: 'swish', gap: 0.08 }); break;
    case 'cut': want('cut', { x, gain: 0.55, key: 'cut', gap: 0.05 }, () => SYN.cut()); break;
    case 'grab': AU.play('cloth', { x, gain: 0.4 }); break;
    case 'whistle': whistle(); break;
    case 'xray': AU.play('xray', { gain: 0.5 }); break;
    case 'tool': if (o.tool === 'knife') AU.play('knife_draw', { gain: 0.45 }); else if (o.tool === 'gun') AU.play('holster', { gain: 0.5 }); else if (o.tool === 'hammer') AU.play('leather', { gain: 0.35 }); break;
  }
});

/* ------------------------------------------------------------ his voice: one thing at a time, louder things first */
const VOICE = { fall: 'v_panic', air: 'v_scream', hurt: 'v_hurt', grunt: 'v_grunt', scream: 'v_scream', groan: 'v_groan', strain: 'v_effort', effort: 'v_effort', fail: 'v_groan', lifted: 'v_panic', plead: 'v_plead', alarm: 'v_gasp', stagger: 'v_grunt', whimper: 'v_whimper' };
const RANK = { v_scream: 5, v_hurt: 4, v_panic: 4, v_choke: 5, v_gasp: 2, v_effort: 2, v_groan: 2, v_grunt: 1, v_whimper: 1, v_plead: 3, v_cough: 2 };
G.on('voice', (g, kind, k = 1) => {
  if (!g || !g.alive || g.dusty || !g.dm || g.dm.cons < 0.3) return;
  const hd = g.parts.head; if (hd.gone || !hd.attached) return;
  let name = VOICE[kind] || 'v_grunt';
  const neck = g.dm.regions.neck, chest = g.dm.regions.thorax;
  /* a cut throat or a hole in the lungs changes what comes out */
  if ((neck.lac > 2 || g.dm.cord > 0.5 || neck.organ > 0.3) && (name === 'v_scream' || name === 'v_hurt')) name = 'v_choke';
  else if (chest.organ > 0.5 && Math.random() < 0.4 && name !== 'v_scream') name = 'v_cough';
  if (g.dm.oxy < 0.5) { if (name === 'v_scream' || name === 'v_hurt') name = 'v_gasp'; }
  const A = ac(); if (!A) return;
  const now = A.currentTime, v = g.voice;
  if (v && v.end > now) { if ((RANK[name] || 1) <= (RANK[v.name] || 1) + 1 || now - v.start < 0.12) return; try { v.src.stop(); } catch (e) {} }
  if (v && now - v.end < 0.12 && (RANK[name] || 1) < 4) return;
  /* under a fridge, a scream is a muffled one */
  const muff = g.dm.loadKg > 20 ? 900 : 0;
  const r = AU.play(name, { x: hd.body.position.x, gain: clamp(0.35 + k * 0.45, 0.25, 1.1), rate: g.pitch * rnd(0.96, 1.04) * (name === 'v_scream' && g.dm.pain > 120 ? 1.06 : 1), lp: muff || undefined, key: 'voice' + g.id, gap: 0.05 });
  if (r) { g.voice = { src: r.src, end: r.end, start: now, name }; g.mouth = 1; }
  else if (!buf && (kind === 'scream' || kind === 'hurt' || kind === 'air')) { SYN.scream(g.pitch, clamp(k, 0.4, 1.4)); g.mouth = 1; }
});

/* ------------------------------------------------------------ the fridges have sound now too */
G.M.Events.on(G.engine, 'collisionStart', ev => {
  if (!bus || !buf || G.away()) return;
  let budget = 3;
  for (const pr of ev.pairs) {
    const a = pr.bodyA, b = pr.bodyB, fa = a.plugin && a.plugin.fv, fb = b.plugin && b.plugin.fv;
    if (!fa && !fb) continue;
    if ((a.plugin && a.plugin.part) || (b.plugin && b.plugin.part)) continue;        /* him: damage.js has that one */
    const n = pr.collision.normal, rvx = a.velocity.x - b.velocity.x, rvy = a.velocity.y - b.velocity.y, vn = Math.abs(rvx * n.x + rvy * n.y);
    if (vn < 3) continue;
    const m = Math.min(a.isStatic ? 1e9 : a.mass, b.isStatic ? 1e9 : b.mass), E = 0.5 * m * vn * vn;
    const sp = pr.collision.supports[0] || a.position;
    AU.play(E > 900 ? 'fridge_heavy' : E > 250 ? 'fridge_med' : 'fridge_light', { x: sp.x, gain: clamp(Math.log10(E) / 4.2 - 0.25, 0.05, 0.8), rate: rnd(0.88, 1.06) * (m > 40 ? 0.85 : m < 8 ? 1.2 : 1), key: 'env', gap: 0.045 });
    if (--budget <= 0) break;
  }
});
/* the dynamite sticks bounce like the wood they are */
G.M.Events.on(G.engine, 'collisionStart', ev => { if (!bus || !buf) return; for (const pr of ev.pairs) { const t = (pr.bodyA.plugin && pr.bodyA.plugin.tnt) || (pr.bodyB.plugin && pr.bodyB.plugin.tnt); if (!t) continue; const b = t.body, sp = Math.hypot(b.velocity.x, b.velocity.y); if (sp > 2) AU.play('wood', { x: b.position.x, gain: clamp(sp / 20, 0.08, 0.5), rate: 1.3, key: 'tnt', gap: 0.06 }); } });
AU.step = function () {};
/* the first click on the page wakes the audio up, and the sprite starts loading then */
document.addEventListener('pointerdown', () => { try { G.ac(); out(); } catch (e) {} }, { once: true, capture: true });
})();
