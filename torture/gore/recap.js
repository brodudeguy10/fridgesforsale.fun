/* ============================================================
   THE GUY, version three: the recap.
   the toe tag is the same tag as before, with one new button on
   it: X-RAY. that opens the case on the light box:

   - his body, front on, the way an injury chart or a radiograph is
     laid out (his right on your left, marked R and L), or as he was
     found, in the pose he died in
   - every region shaded by its AIS severity (1 minor to 6 maximal),
     with the number written on it, so colour is never the only clue
   - fractures drawn on the bone where they happened, organs where
     they were hit, limbs that are missing as dashed outlines
   - every recorded hit marked where it landed, numbered in order,
     sized by the energy in it; the one that killed him marked apart
   - a timeline you can scrub or play, which replays the damage as it
     accumulated, and a reconstruction in words: the first injury,
     what came after, and what finally did it
   - click any region for its own breakdown and the hits it took

   everything on it comes from the record damage.js kept while he
   was alive (and anything done to him after, marked as such).
   nothing is worked out after the fact. each case is a copy taken
   when he died, so the next guy never inherits it.
============================================================ */
(function () {
'use strict';
const G = window.__G3; if (!G || !G.A) return;
const A = G.A, S = G.S, clamp = G.clamp;
const RC = G.recap = {};
const AIS_COL = ['rgba(0,0,0,0)', '#8f7a3a', '#c79a34', '#f0b33a', '#ff7a2e', '#ff3b2f', '#ffe8f0'];
const AIS_NAME = ['uninjured', 'minor', 'moderate', 'serious', 'severe', 'critical', 'maximal'];

/* ------------------------------------------------------------ a case: everything about him, copied when he died */
RC.close = function (g) {
  const R = g.dm.regions, regions = {};
  for (const r of Object.values(R)) regions[r.id] = { id: r.id, name: r.def.name, part: r.def.part, ais: r.ais, frac: r.frac, compound: r.compound, skin: +r.skin.toFixed(2), soft: +r.soft.toFixed(2), organ: +r.organ.toFixed(2), burn: +r.burn.toFixed(2), abr: +r.abr.toFixed(2), bleed: +(r.bleed + r.ibleed).toFixed(2), amp: r.amp, lac: +r.lac.toFixed(1), hits: r.hits, energy: Math.round(r.energy), cuts: r.cuts, holes: r.holes, bone: r.def.bone, org: r.def.org || '', words: G.dmg.regionWords(r) };
  const joints = {}; for (const j of g.joints) joints[j.id] = { state: j.state, broken: j.broken, why: j.why || '' };
  const c = {
    id: g.id, n: g.n, name: g.name, dusty: g.dusty, look: JSON.parse(JSON.stringify(g.look)), alive: +(g.diedT - g.born).toFixed(1),
    cause: g.cause, chain: g.rec.chain, events: g.rec.events, fatal: g.rec.fatal, regions, joints, iss: G.dmg.iss(g),
    stats: Object.assign({}, g.dm.stats), lost: Math.round(g.dm.lost), eyeOut: (g.eyeOut || [0, 0]).slice(), teeth: g.teeth || 0,
    parts: Object.fromEntries(g.list.map(p => [p.id, { gone: !!p.gone, attached: p.attached }])),
    pose: pose(g), born: g.born, diedAt: new Date().toLocaleTimeString()
  };
  g.case = c;
  return c;
};
/* and once more when he's taken away: where he ended up, and anything done to him after he died */
RC.final = function (g) { if (!g.case) return; g.case.pose2 = pose(g); g.case.parts2 = Object.fromEntries(g.list.map(p => [p.id, { gone: !!p.gone, attached: p.attached }])); if (g.rec) g.rec.closed = true; };
function pose(g) {
  const ref = g.parts.chest.body, out = {};
  /* where the middle of each part's own frame is (for a limb broken in two, where the whole limb's middle would be,
     going by its upper piece) */
  for (const p of g.list) { if (p.gone || p.removed) continue; const b = p.body, o = G.toWorld(b, 0, 0); out[p.id] = { x: o.x - ref.position.x, y: o.y - ref.position.y, a: b.angle }; }
  return out;
}

/* ------------------------------------------------------------ the toe tag, as it was, plus the button */
const css = document.createElement('style');
css.textContent = `
.guyTag { position: fixed; z-index: 10003; width: 160px; background: #e8dcc0; color: #2a2014; border: 1px solid #6a5a3a; font: 10px/1.35 monospace; padding: 8px 8px 6px 18px; transform: rotate(-5deg) translateY(8px); opacity: 0; transition: opacity .5s, transform .5s; pointer-events: none; box-shadow: 2px 3px 0 rgba(0,0,0,0.4); }
.guyTag.on { opacity: 1; transform: rotate(-5deg) translateY(0); }
.guyTag::before { content: ''; position: absolute; left: 6px; top: 8px; width: 6px; height: 6px; border-radius: 50%; background: #0b0f14; border: 1px solid #6a5a3a; }
.guyTag div:first-child { font-weight: bold; border-bottom: 1px solid #6a5a3a; margin-bottom: 3px; }
.guyTag .xr { pointer-events: auto; display: block; width: 100%; margin-top: 6px; padding: 4px 0; font: bold 10px monospace; letter-spacing: 1px; background: #0b2230; color: #bfefff; border: 1px solid #3a8ab0; cursor: pointer; }
.guyTag .xr:hover, .guyTag .xr:focus-visible { background: #12405a; outline: none; box-shadow: 0 0 6px #6ad0ff; }
#goreXray { position: fixed; inset: 0; z-index: 10000005; display: none; background: #020406; color: #cfe6f0; font: 12px/1.45 monospace; }
#goreXray.on { display: flex; }
#goreXray .xv { position: relative; flex: 1 1 auto; min-width: 0; background: radial-gradient(ellipse at 50% 45%, #0b1a24 0%, #050a0e 55%, #000 100%); }
#goreXray canvas.body { position: absolute; inset: 0; width: 100%; height: 100%; cursor: grab; touch-action: none; }
#goreXray .tip { position: absolute; pointer-events: none; background: rgba(3,10,14,0.92); border: 1px solid #2e5a6e; padding: 4px 7px; color: #dff4ff; display: none; max-width: 240px; z-index: 2; }
#goreXray .views { position: absolute; left: 10px; top: 10px; right: 52px; display: flex; flex-wrap: wrap; gap: 4px; z-index: 2; pointer-events: none; }
#goreXray .views > * { pointer-events: auto; }
#goreXray .views button, #goreXray .xp button, #goreXray select { font: 11px monospace; background: #0b1a24; color: #bfe4f4; border: 1px solid #2e5a6e; padding: 4px 8px; cursor: pointer; }
#goreXray .views button.on { background: #1f4a60; color: #fff; border-color: #6ad0ff; }
#goreXray .views button:focus-visible, #goreXray .xp button:focus-visible { outline: 1px solid #6ad0ff; }
#goreXray .legend { position: absolute; left: 10px; bottom: 74px; display: flex; gap: 6px; flex-wrap: wrap; z-index: 2; font-size: 10px; color: #9fc4d4; pointer-events: none; }
#goreXray .legend i { display: inline-block; width: 11px; height: 11px; vertical-align: -1px; margin-right: 3px; border: 1px solid #335; }
#goreXray .scrub { position: absolute; left: 10px; right: 10px; bottom: 10px; z-index: 2; display: flex; align-items: center; gap: 8px; }
#goreXray .scrub canvas { flex: 1 1 auto; height: 40px; min-width: 0; cursor: pointer; }
#goreXray .scrub .t { width: 66px; text-align: right; color: #9fc4d4; }
#goreXray .xp { flex: 0 0 360px; max-width: 42vw; overflow-y: auto; border-left: 1px solid #16303c; padding: 12px 14px 40px; background: #03080b; }
#goreXray .xp h2 { margin: 0 0 2px; font-size: 15px; color: #fff; letter-spacing: 1px; }
#goreXray .xp h3 { margin: 14px 0 4px; font-size: 11px; color: #6ad0ff; letter-spacing: 2px; font-weight: normal; border-bottom: 1px solid #16303c; }
#goreXray .xp .sub { color: #7ea6b6; }
#goreXray .xp .cod { color: #ffd2c8; }
#goreXray .xp ol { margin: 4px 0; padding-left: 18px; }
#goreXray .xp .ev { padding: 4px 6px; margin: 2px 0; border-left: 3px solid #234; cursor: pointer; }
#goreXray .xp .ev:hover, #goreXray .xp .ev.sel { background: #0b1a24; }
#goreXray .xp .ev.fatal { border-left-color: #ff3b2f; background: rgba(255,59,47,0.08); }
#goreXray .xp .ev.post { opacity: 0.6; border-left-style: dashed; }
#goreXray .xp .ev b { color: #fff; font-weight: normal; }
#goreXray .xp .tag { display: inline-block; padding: 0 4px; margin-left: 4px; font-size: 10px; border: 1px solid #335; color: #cde; }
#goreXray .xp .ais { display: inline-block; min-width: 14px; padding: 0 3px; text-align: center; color: #000; font-weight: bold; margin-right: 5px; }
#goreXray .xp table { width: 100%; border-collapse: collapse; }
#goreXray .xp td { padding: 2px 4px; border-bottom: 1px solid #0f2029; vertical-align: top; }
#goreXray .xp td:first-child { color: #7ea6b6; width: 38%; }
#goreXray .close { position: absolute; right: 10px; top: 10px; z-index: 3; font: bold 14px monospace; width: 32px; height: 32px; background: #0b1a24; color: #fff; border: 1px solid #2e5a6e; cursor: pointer; }
#goreXray .hdr { position: absolute; right: 52px; top: 12px; z-index: 2; color: #6ad0ff; letter-spacing: 2px; font-size: 11px; text-align: right; pointer-events: none; }
@media (max-width: 880px) {
  #goreXray.on { flex-direction: column; }
  #goreXray .xv { flex: 0 0 56vh; flex: 0 0 56dvh; }
  #goreXray .xp { flex: 1 1 auto; max-width: none; border-left: none; border-top: 1px solid #16303c; padding: 10px 12px 30px; }
  #goreXray .legend { bottom: 58px; font-size: 9px; gap: 3px 6px; }
  #goreXray .legend .nm { display: none; }
  #goreXray .hdr { display: none; }
}
/* a phone on its side: the body beside the notes, not above them, or he'd be the size of a thumbnail */
@media (max-width: 880px) and (max-height: 500px) and (orientation: landscape) {
  #goreXray.on { flex-direction: row; }
  #goreXray .xv { flex: 1 1 auto; }
  #goreXray .xp { flex: 0 0 46vw; max-width: 46vw; border-top: none; border-left: 1px solid #16303c; }
  #goreXray .legend { display: none; }
}
`;
document.head.appendChild(css);
RC.tag = function (g) {
  if (!document.body) return;
  const c = g.parts.chest.body.position, el = document.createElement('div');
  const limbs = g.list.filter(p => !p.attached && A.LIMB.has(p.kind) && !p.def.id.startsWith('hand') && !p.def.id.startsWith('foot')).length;
  const lines = [`JOHN DOE #${g.n}`, `NAME: ${g.name.toUpperCase()}`, `C.O.D.: ${(g.dusty ? 'he was already dead' : g.cause).toUpperCase()}`, g.dusty ? 'BLOOD LOST: NONE TO LOSE' : `BLOOD LOST: ${(g.dm.lost / 1000).toFixed(1)} L`, `FRACTURES: ${g.dm.stats.fractures} · PIECES: ${g.dm.stats.pieces}`];
  if (limbs) lines.push(`LIMBS NOT ATTACHED: ${limbs}`);
  if (g.dm.stats.shots) lines.push(`ROUNDS RECOVERED: ${g.dm.stats.shots}`);
  el.className = 'guyTag'; el.innerHTML = lines.map(l => `<div>${l.replace(/</g, '&lt;')}</div>`).join('');
  const btn = document.createElement('button'); btn.className = 'xr'; btn.type = 'button'; btn.textContent = 'X-RAY ▸'; btn.setAttribute('aria-label', `Open ${g.name}'s x-ray`);
  btn.onclick = e => { e.stopPropagation(); if (g.case) RC.open(g.case); };
  el.appendChild(btn);
  /* over him, clear of the tool bar along the bottom */
  el.style.left = '0px'; el.style.top = '0px';
  document.body.appendChild(el);
  const tw = el.offsetWidth || 190, th = el.offsetHeight || 150;
  el.style.left = clamp(c.x - 70, 8, G.W() - tw - 14) + 'px'; el.style.top = clamp(c.y - 230, 8, G.H() - th - 150) + 'px';
  requestAnimationFrame(() => el.classList.add('on'));
  let hover = false; btn.onmouseenter = () => { hover = true; }; btn.onmouseleave = () => { hover = false; };
  const hide = () => { if (hover) { setTimeout(hide, 800); return; } el.classList.remove('on'); setTimeout(() => el.remove(), 600); };
  setTimeout(hide, 9000);
};

/* ------------------------------------------------------------ the light box */
let box = null, cv = null, ctx = null, cur = null, view = { mode: 'xray', pose: 'chart', t: 0, z: 1, px: 0, py: 0, sel: null, hover: null, playing: false, ev: null };
RC.isOpen = () => !!(box && box.classList.contains('on'));
function build() {
  if (box) return;
  box = document.createElement('div'); box.id = 'goreXray'; box.setAttribute('role', 'dialog'); box.setAttribute('aria-label', 'X-ray: damage reconstruction');
  box.innerHTML = `<div class="xv"><canvas class="body" aria-label="the body, with every recorded injury"></canvas><div class="tip"></div>
    <div class="views">
      <button data-v="xray" class="on" title="bone and organ damage">X-RAY</button><button data-v="tissue" title="soft tissue and bleeding">TISSUE</button><button data-v="surface" title="the skin, as he was">SURFACE</button>
      <span style="width:8px"></span><button data-p="chart" class="on" title="laid out front on">CHART</button><button data-p="found" title="the pose he was found in">AS FOUND</button>
      <span style="width:8px"></span><button data-z="in" title="zoom in">+</button><button data-z="out" title="zoom out">−</button><button data-z="reset" title="reset the view">⟲</button>
    </div>
    <div class="legend"></div>
    <div class="hdr"></div>
    <div class="scrub"><button class="play" type="button" aria-label="play the reconstruction">▶</button><canvas class="tl" aria-label="timeline: scrub to replay the damage"></canvas><span class="t"></span></div>
    <button class="close" type="button" aria-label="close the x-ray">✕</button></div>
    <div class="xp"></div>`;
  document.body.appendChild(box);
  cv = box.querySelector('canvas.body'); ctx = cv.getContext('2d');
  box.querySelector('.close').onclick = () => RC.hide();
  for (const b of box.querySelectorAll('.views button[data-v]')) b.onclick = () => { view.mode = b.dataset.v; for (const q of box.querySelectorAll('.views button[data-v]')) q.classList.toggle('on', q === b); draw(); };
  for (const b of box.querySelectorAll('.views button[data-p]')) b.onclick = () => { view.pose = b.dataset.p; for (const q of box.querySelectorAll('.views button[data-p]')) q.classList.toggle('on', q === b); view.z = 1; view.px = view.py = 0; draw(); };
  for (const b of box.querySelectorAll('.views button[data-z]')) b.onclick = () => { if (b.dataset.z === 'in') view.z = Math.min(4, view.z * 1.3); else if (b.dataset.z === 'out') view.z = Math.max(0.6, view.z / 1.3); else { view.z = 1; view.px = view.py = 0; } draw(); };
  box.querySelector('.legend').innerHTML = [1, 2, 3, 4, 5, 6].map(a => `<span><i style="background:${AIS_COL[a]}"></i>AIS ${a}<span class="nm"> ${AIS_NAME[a]}</span></span>`).join('') + '<span><i style="background:none;border:1px dashed #9fc4d4"></i>missing</span><span>◯ a hit (size: energy)</span><span style="color:#ff3b2f">✕ fatal</span>';
  const tl = box.querySelector('canvas.tl');
  const scrubTo = e => { const r = tl.getBoundingClientRect(), x = (e.touches ? e.touches[0].clientX : e.clientX) - r.left; view.t = clamp(x / r.width, 0, 1) * endT(); view.playing = false; box.querySelector('.play').textContent = '▶'; draw(); };
  let dragT = false;
  tl.addEventListener('mousedown', e => { dragT = true; scrubTo(e); }); window.addEventListener('mousemove', e => { if (dragT) scrubTo(e); }); window.addEventListener('mouseup', () => { dragT = false; });
  tl.addEventListener('touchstart', e => { scrubTo(e); e.preventDefault(); }, { passive: false }); tl.addEventListener('touchmove', e => { scrubTo(e); e.preventDefault(); }, { passive: false });
  box.querySelector('.play').onclick = () => { if (view.playing) { view.playing = false; box.querySelector('.play').textContent = '▶'; return; } if (view.t >= endT() - 0.01) view.t = 0; view.playing = true; box.querySelector('.play').textContent = '❚❚'; let last = performance.now(); const span = endT(); const step = now => { if (!view.playing || !RC.isOpen()) return; view.t = Math.min(span, view.t + (now - last) / 1000 * Math.max(1, span / 9)); last = now; draw(); if (view.t >= span) { view.playing = false; box.querySelector('.play').textContent = '▶'; return; } requestAnimationFrame(step); }; requestAnimationFrame(step); };
  /* looking around: drag to move, wheel or pinch to zoom, hover for a name, click for the details */
  let drag = null;
  cv.addEventListener('mousedown', e => { drag = { x: e.clientX, y: e.clientY, px: view.px, py: view.py, moved: false }; cv.style.cursor = 'grabbing'; });
  window.addEventListener('mousemove', e => { if (!RC.isOpen()) return; if (drag) { const dx = e.clientX - drag.x, dy = e.clientY - drag.y; if (Math.abs(dx) + Math.abs(dy) > 3) drag.moved = true; view.px = drag.px + dx; view.py = drag.py + dy; draw(); } else hoverAt(e.clientX, e.clientY); });
  window.addEventListener('mouseup', e => { if (!drag) return; const d = drag; drag = null; cv.style.cursor = 'grab'; if (!d.moved) pickAt(e.clientX, e.clientY); });
  cv.addEventListener('wheel', e => { e.preventDefault(); view.z = clamp(view.z * (e.deltaY < 0 ? 1.12 : 1 / 1.12), 0.6, 4); draw(); }, { passive: false });
  let pinch = null;
  cv.addEventListener('touchstart', e => { if (e.touches.length === 2) pinch = { d: Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY), z: view.z }; else if (e.touches.length === 1) drag = { x: e.touches[0].clientX, y: e.touches[0].clientY, px: view.px, py: view.py, moved: false }; }, { passive: true });
  cv.addEventListener('touchmove', e => { if (pinch && e.touches.length === 2) { const d = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY); view.z = clamp(pinch.z * d / pinch.d, 0.6, 4); draw(); e.preventDefault(); } else if (drag && e.touches.length === 1) { const dx = e.touches[0].clientX - drag.x, dy = e.touches[0].clientY - drag.y; if (Math.abs(dx) + Math.abs(dy) > 6) drag.moved = true; view.px = drag.px + dx; view.py = drag.py + dy; draw(); e.preventDefault(); } }, { passive: false });
  cv.addEventListener('touchend', e => { if (drag && !drag.moved && e.changedTouches[0]) pickAt(e.changedTouches[0].clientX, e.changedTouches[0].clientY); drag = null; pinch = null; });
  document.addEventListener('keydown', e => {
    if (!RC.isOpen()) return;
    if (e.key === 'Escape') { RC.hide(); e.preventDefault(); }
    else if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { stepEvent(e.key === 'ArrowRight' ? 1 : -1); e.preventDefault(); }
    else if (e.key === ' ') { box.querySelector('.play').click(); e.preventDefault(); }
    e.stopPropagation();
  }, true);
  window.addEventListener('resize', () => { if (RC.isOpen()) { fit(); draw(); } });
}
RC.open = function (c) {
  if (!c) return;
  build(); cur = c;
  view = Object.assign(view, { t: endT(), z: 1, px: 0, py: 0, sel: null, hover: null, playing: false, ev: null });
  box.classList.add('on'); document.documentElement.classList.add('overlay-open');
  fit(); panel(); draw();
  setTimeout(() => { const b = box.querySelector('.close'); if (b) b.focus(); }, 30);
  G.emit('sfx', 'xray', {});
};
RC.hide = function () { if (!box) return; box.classList.remove('on'); view.playing = false; document.documentElement.classList.remove('overlay-open'); };
function endT() { if (!cur) return 1; const ev = cur.events; return Math.max(cur.alive, ev.length ? ev[ev.length - 1].t : 0, 0.5); }
function fit() { const r = cv.getBoundingClientRect(), dpr = Math.min(2, window.devicePixelRatio || 1); cv.width = Math.round(r.width * dpr); cv.height = Math.round(r.height * dpr); cv.dataset.dpr = dpr; const tl = box.querySelector('canvas.tl'), tr = tl.getBoundingClientRect(); tl.width = Math.round(tr.width * dpr); tl.height = Math.round(tr.height * dpr); }

/* ------------------------------------------------------------ the state of every region at time t, from the record */
function stateAt(t) {
  const st = {};
  for (const id of Object.keys(cur.regions)) st[id] = { ais: 0, frac: 0, skin: 1, soft: 0, organ: 0, bleed: 0, amp: false, burn: 0, abr: 0, compound: false };
  const hits = [], fr = [];
  for (const e of cur.events) {
    if (e.t > t + 1e-6) break;
    if (e.after && e.region && st[e.region]) Object.assign(st[e.region], e.after);
    if (e.kind === 'sever' && e.region && st[e.region]) st[e.region].amp = true;
    if (e.lx != null && e.part && (e.kind === 'impact' || e.kind === 'cut' || e.kind === 'shot' || e.kind === 'blast' || e.kind === 'crush')) hits.push(e);
    if (e.inj && e.inj.some(i => /fractur|shatter|crack|compound|broken/.test(i.what)) && e.part) fr.push(e);
  }
  return { st, hits, fr };
}
/* ------------------------------------------------------------ the drawing */
function layout() {
  const dpr = +cv.dataset.dpr || 1, W = cv.width, H = cv.height;
  /* k: screen pixels per unit of him; the chart is drawn in units x S, hence the k / S everywhere below. he fills
     about three quarters of the height, with room for the timeline */
  const k = Math.min(W / 64, (H - 120 * dpr) / 118) * view.z;
  /* the chart is centred on his chest; his middle is 21.5 units below it. centre him above the timeline strip */
  return { dpr, W, H, k, ox: W / 2 + view.px * dpr, oy: (H - 70 * dpr) / 2 - 21.5 * k + view.py * dpr };
}
/* where each part sits on the chart (rest pose) or as found, in units*S, centred on his chest */
function placement(id) {
  const d = A.byId[id];
  if (view.pose === 'found') { const P = cur.pose2 || cur.pose, p = P[id]; if (!p) return null; return { x: p.x, y: p.y, a: p.a - ((P.chest && P.chest.a) || 0), rot: (P.chest && P.chest.a) || 0 }; }
  return { x: (d.at[0] - A.byId.chest.at[0]) * S, y: (d.at[1] - A.byId.chest.at[1]) * S, a: 0 };
}
function partMissing(id, t) {
  const p = (cur.parts2 || cur.parts)[id];
  if (view.pose === 'found') return !p || p.gone;
  /* on the chart, a limb that came off by time t is drawn as a ghost (off partway down a bone: what was below it) */
  for (const e of cur.events) {
    if (e.t > t) break; if (e.kind !== 'sever') continue;
    const sec = /~cut$/.test(e.joint || '');
    if (sec ? below(A.baseId(e.joint), id) : (e.part === id || chainOff(e.joint, id))) return true;
  }
  return false;
}
/* off partway down a bone by time t: where along it (units), or null */
function sectionCut(id, t) { for (const e of cur.events) { if (e.t > t) break; if (e.kind === 'sever' && /~cut$/.test(e.joint || '') && A.baseId(e.joint) === id && e.sect != null) return e.sect; } return null; }
function below(base, id) { let p = id; const seen = new Set(); while (p && !seen.has(p)) { seen.add(p); const up = A.JOINTS.find(q => q.b === p); p = up ? up.a : null; if (p === base) return true; } return false; }
function chainOff(jid, id) {
  if (!jid) return false;
  const j = A.jointById[jid]; if (!j) return false;
  let p = id; const seen = new Set();
  while (p && !seen.has(p)) { seen.add(p); if (p === j.b) return true; const up = A.JOINTS.find(q => q.b === p); p = up ? up.a : null; }
  return false;
}
function draw() {
  if (!cur || !ctx) return;
  const L = layout(), { dpr, W, H, k } = L;
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, W, H);
  const { st, hits, fr } = stateAt(view.t);
  ctx.save(); ctx.translate(L.ox, L.oy);
  if (view.pose === 'found') { const P = cur.pose2 || cur.pose; ctx.rotate(-((P.chest && P.chest.a) || 0) * 0); }
  ctx.scale(k / S, k / S);
  const order = A.PARTS.slice().sort((a, b) => a.layer - b.layer);
  /* the soft tissue, faint; the bones, bright; the organs, between */
  for (const d of order) {
    const pl = placement(d.id); if (!pl) continue;
    const miss = partMissing(d.id, view.t), sc = miss || view.pose === 'found' ? null : sectionCut(d.id, view.t);
    ctx.save(); ctx.translate(pl.x, pl.y); ctx.rotate(pl.a);
    if (sc != null) {
      /* the rest of the limb below where it came off, as a ghost, and the bone's cut end */
      ctx.save(); ctx.beginPath(); ctx.rect(-60 * S, sc * S, 120 * S, 120 * S); ctx.clip(); A.outline(ctx, d, S); ctx.setLineDash([3, 3]); ctx.strokeStyle = 'rgba(160,200,220,0.55)'; ctx.lineWidth = 1.2 * S / k; ctx.stroke(); ctx.setLineDash([]); ctx.restore();
      ctx.strokeStyle = '#ff6a4a'; ctx.lineWidth = 1.6 * S / k; ctx.beginPath(); ctx.moveTo(-d.wh[0] * S * 0.6, sc * S); ctx.lineTo(d.wh[0] * S * 0.6, sc * S); ctx.stroke();
      ctx.beginPath(); ctx.rect(-60 * S, -120 * S, 120 * S, 120 * S + sc * S); ctx.clip();
    }
    A.outline(ctx, d, S);
    if (miss) { ctx.setLineDash([3, 3]); ctx.strokeStyle = 'rgba(160,200,220,0.55)'; ctx.lineWidth = 1.2 * S / k; ctx.stroke(); ctx.setLineDash([]); ctx.restore(); continue; }
    ctx.fillStyle = view.mode === 'surface' ? surfaceCol(d) : 'rgba(120,170,200,0.13)'; ctx.fill();
    ctx.strokeStyle = 'rgba(150,200,230,0.35)'; ctx.lineWidth = 1 * S / k; ctx.stroke();
    if (view.mode !== 'surface') {
      const orgs = cur.dusty ? [] : A.ORGANS[d.kind] || [];
      /* Dusty has been out in the desert a long time: nothing in his chest but what blew in */
      if (cur.dusty && d.kind === 'chest') weed(ctx, 0, 1.5 * S, 5.2 * S);
      for (const o of orgs) { o.draw(ctx, S); const reg = st[A.regionAt(d.id, 0, -3)] || st[d.id]; const hit = reg && reg.organ > 0.2; ctx.fillStyle = view.mode === 'tissue' ? (hit ? 'rgba(255,90,70,0.45)' : 'rgba(220,110,120,0.22)') : (hit ? 'rgba(255,120,90,0.32)' : 'rgba(140,180,200,0.10)'); ctx.fill(); }
      A.bone(ctx, d, S, { holes: true });
      ctx.save(); ctx.shadowColor = 'rgba(160,230,255,0.6)'; ctx.shadowBlur = view.mode === 'xray' ? 6 * dpr : 0;
      ctx.fillStyle = view.mode === 'xray' ? 'rgba(215,240,250,0.82)' : 'rgba(200,220,230,0.35)'; ctx.fill('evenodd'); ctx.restore();
    }
    ctx.restore();
  }
  /* severity, region by region */
  for (const d of order) {
    const pl = placement(d.id); if (!pl || partMissing(d.id, view.t)) continue;
    for (const rid of regionsOn(d.id)) {
      const r = st[rid]; if (!r || !r.ais) continue;
      ctx.save(); ctx.translate(pl.x, pl.y); ctx.rotate(pl.a); regionPath(ctx, d, rid);
      ctx.fillStyle = AIS_COL[r.ais]; ctx.globalAlpha = view.mode === 'surface' ? 0.45 : 0.38 + r.ais * 0.06; ctx.fill();
      ctx.globalAlpha = 1;
      if (view.sel === rid || view.hover === rid) { ctx.strokeStyle = view.sel === rid ? '#fff' : 'rgba(255,255,255,0.6)'; ctx.lineWidth = 2 * S / k; ctx.stroke(); }
      ctx.restore();
    }
  }
  /* the bleeding, in the tissue view: how hard each region was losing blood */
  if (view.mode === 'tissue') for (const d of order) { const pl = placement(d.id); if (!pl || partMissing(d.id, view.t)) continue; for (const rid of regionsOn(d.id)) { const r = st[rid]; if (!r || r.bleed < 0.05) continue; ctx.save(); ctx.translate(pl.x, pl.y); ctx.rotate(pl.a); ctx.fillStyle = `rgba(255,40,40,${clamp(r.bleed / 6, 0.15, 0.7)})`; regionPath(ctx, d, rid); ctx.fill(); ctx.restore(); } }
  /* fractures, on the bone where they happened */
  for (const e of fr) {
    const d = A.byId[e.part], pl = placement(e.part); if (!d || !pl || partMissing(e.part, view.t)) continue;
    const r = st[e.region] || {}, comm = /shatter|comminut/.test(e.inj.map(i => i.what).join(' '));
    ctx.save(); ctx.translate(pl.x, pl.y); ctx.rotate(pl.a);
    const y = clamp(e.ly * S, -(d.wh ? d.wh[1] : d.r * 2) * S * 0.42, (d.wh ? d.wh[1] : d.r * 2) * S * 0.42), w = (d.wh ? d.wh[0] : d.r * 1.6) * S * 0.55;
    ctx.strokeStyle = '#ff6a4a'; ctx.lineWidth = 1.6 * S / k * 1.2; ctx.shadowColor = '#ff3a2a'; ctx.shadowBlur = 5 * dpr;
    ctx.beginPath(); ctx.moveTo(-w, y - 1.2 * S); for (let i = 1; i <= 4; i++) ctx.lineTo(-w + w * 2 * i / 4, y + (i % 2 ? 1.4 : -1.2) * S); ctx.stroke();
    if (comm) { for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.moveTo((i - 1.5) * w * 0.5, y); ctx.lineTo((i - 1.5) * w * 0.6, y + (i % 2 ? 3 : -3) * S); ctx.stroke(); } }
    if (r.compound) { ctx.beginPath(); ctx.moveTo(w * 0.3, y); ctx.lineTo(w * 1.7, y - 3 * S); ctx.stroke(); }
    ctx.restore();
  }
  /* every hit, where it landed: numbered, sized by its energy; the fatal one marked */
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  for (const e of hits) {
    const d = A.byId[e.part], pl = placement(e.part); if (!d || !pl) continue;
    const inj = e.inj && e.inj.length, sev = inj ? Math.max(...e.inj.map(i => i.sev || 0)) : 0;
    if (!inj && e.E < 6 && view.ev !== e) continue;
    const c = G.toWorld({ position: { x: pl.x, y: pl.y }, angle: pl.a }, e.lx * S, e.ly * S);
    const rr = clamp(Math.log2(1 + (e.E || 20)) * 1.05, 2.2, 9) * S;
    const fatal = cur.fatal === e.i;
    ctx.save(); ctx.translate(c.x, c.y);
    ctx.strokeStyle = fatal ? '#ff3b2f' : sev ? AIS_COL[Math.min(6, sev)] : 'rgba(220,240,255,0.7)'; ctx.lineWidth = (fatal ? 2.4 : 1.3) * S / k * 1.3;
    if (e.post) ctx.setLineDash([2, 2]);
    if (e.kind === 'cut') { ctx.beginPath(); ctx.moveTo(-rr, -rr * 0.3); ctx.lineTo(rr, rr * 0.3); ctx.stroke(); }
    else if (e.kind === 'shot') { ctx.beginPath(); ctx.arc(0, 0, rr * 0.45, 0, Math.PI * 2); ctx.stroke(); ctx.fillStyle = ctx.strokeStyle; ctx.beginPath(); ctx.arc(0, 0, rr * 0.18, 0, Math.PI * 2); ctx.fill(); }
    else if (e.kind === 'blast') { ctx.beginPath(); for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2; ctx.moveTo(Math.cos(a) * rr * 0.3, Math.sin(a) * rr * 0.3); ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); } ctx.stroke(); }
    else if (e.kind === 'crush') { ctx.beginPath(); ctx.moveTo(-rr, -rr); ctx.lineTo(rr, -rr); ctx.moveTo(0, -rr); ctx.lineTo(0, rr * 0.4); ctx.lineTo(-rr * 0.4, 0); ctx.moveTo(0, rr * 0.4); ctx.lineTo(rr * 0.4, 0); ctx.stroke(); }
    else { ctx.beginPath(); ctx.arc(0, 0, rr, 0, Math.PI * 2); ctx.stroke(); }
    ctx.setLineDash([]);
    if (fatal) { ctx.beginPath(); ctx.moveTo(-rr * 1.4, -rr * 1.4); ctx.lineTo(rr * 1.4, rr * 1.4); ctx.moveTo(rr * 1.4, -rr * 1.4); ctx.lineTo(-rr * 1.4, rr * 1.4); ctx.stroke(); }
    if (view.ev === e) { ctx.strokeStyle = '#fff'; ctx.lineWidth = 1 * S / k; ctx.beginPath(); ctx.arc(0, 0, rr * 1.9, 0, Math.PI * 2); ctx.stroke(); }
    ctx.restore();
    if (inj || view.ev === e) { ctx.save(); ctx.translate(c.x + rr * 1.1, c.y - rr * 1.1); ctx.scale(S / k * 1.1, S / k * 1.1); ctx.font = 'bold 9px monospace'; ctx.fillStyle = '#000'; ctx.fillText(String(e.i + 1), 0.6, 0.6); ctx.fillStyle = fatal ? '#ff8a80' : '#e8f6ff'; ctx.fillText(String(e.i + 1), 0, 0); ctx.restore(); }
  }
  /* the AIS number on each injured region */
  for (const d of order) {
    const pl = placement(d.id); if (!pl || partMissing(d.id, view.t)) continue;
    for (const rid of regionsOn(d.id)) {
      const r = st[rid]; if (!r || r.ais < 2) continue;
      const cpos = regionCentre(d, rid), c = G.toWorld({ position: { x: pl.x, y: pl.y }, angle: pl.a }, cpos.x, cpos.y);
      ctx.save(); ctx.translate(c.x, c.y); ctx.scale(S / k * 1.2, S / k * 1.2); ctx.font = 'bold 10px monospace'; ctx.fillStyle = 'rgba(0,0,0,0.75)'; ctx.fillRect(-7, -6, 14, 12); ctx.fillStyle = AIS_COL[r.ais]; ctx.fillText(String(r.ais), 0, 0.5); ctx.restore();
    }
  }
  ctx.restore();
  /* the radiograph's markers */
  ctx.font = `bold ${14 * dpr}px monospace`; ctx.fillStyle = 'rgba(200,235,250,0.65)'; ctx.textAlign = 'left';
  if (view.pose === 'chart') { ctx.fillText('R', 16 * dpr, H * 0.5); ctx.textAlign = 'right'; ctx.fillText('L', W - 16 * dpr, H * 0.5); }
  ctx.textAlign = 'left'; ctx.font = `${10 * dpr}px monospace`; ctx.fillStyle = 'rgba(160,210,230,0.5)';
  /* when this picture is of: under the view buttons, clear of the legend however it wraps */
  const vb = box.querySelector('.views').getBoundingClientRect(), cb = cv.getBoundingClientRect();
  ctx.fillText(view.t >= endT() - 0.01 ? 'AT DEATH' + (cur.events.some(e => e.post) ? ' AND AFTER' : '') : `AT ${view.t.toFixed(1)} s`, 16 * dpr, (vb.bottom - cb.top + 16) * dpr);
  timeline();
  const tt = box.querySelector('.scrub .t'); if (tt) tt.textContent = `${view.t.toFixed(1)} / ${endT().toFixed(1)} s`;
  box.querySelector('.hdr').innerHTML = `FRIDGESFORSALE COUNTY MORGUE<br>CASE ${cur.n} · ${cur.name.toUpperCase()}`;
}
function weed(ctx, x, y, r) {
  ctx.save(); ctx.strokeStyle = 'rgba(196,160,96,0.85)'; ctx.lineWidth = 0.35 * S; const R = G.srand(7);
  ctx.beginPath();
  for (let i = 0; i < 26; i++) { const a0 = R() * 6.28, a1 = a0 + 1.2 + R() * 2.4, rr = r * (0.45 + R() * 0.55); ctx.moveTo(x + Math.cos(a0) * rr, y + Math.sin(a0) * rr); ctx.quadraticCurveTo(x + Math.cos((a0 + a1) / 2) * rr * 1.25, y + Math.sin((a0 + a1) / 2) * rr * 1.25, x + Math.cos(a1) * rr * 0.9, y + Math.sin(a1) * rr * 0.9); }
  ctx.stroke(); ctx.restore();
}
function surfaceCol(d) { const lk = cur.look, cl = A.clothOf(cur, d.kind); if (cur.dusty) return 'rgba(232,224,204,0.6)'; if (!cl) return `hsla(${lk.skin[0]},${lk.skin[1]}%,${lk.skin[2]}%,0.55)`; return cl === 'shirt' ? lk.shirt.replace('hsl', 'hsla').replace(')', ',0.5)') : cl === 'boot' ? lk.boots + '99' : lk.pants + '99'; }
function regionsOn(id) { if (id === 'head') return ['cranium', 'face']; if (id === 'chest') return ['thorax', 'neck']; return [id]; }
function regionPath(c, d, rid) {
  if (rid === 'cranium') { const r = d.r * S; c.beginPath(); c.arc(0, 0, r, Math.PI * 1.02, Math.PI * 1.98); c.lineTo(r * 0.99, -1.5 * S); c.lineTo(-r * 0.99, -1.5 * S); c.closePath(); return; }
  if (rid === 'face') { const r = d.r * S; c.beginPath(); c.arc(0, 0, r, Math.PI * -0.05, Math.PI * 1.05); c.lineTo(-r * 0.99, -1.5 * S); c.lineTo(r * 0.99, -1.5 * S); c.closePath(); return; }
  if (rid === 'neck') { const h = d.wh[1] * S; c.beginPath(); c.rect(-5.5 * S, -h / 2 - 1.5 * S, 11 * S, (7.5 - 5.2) * S + 1.5 * S); return; }
  if (rid === 'thorax') { const w = d.wh[0] * S, h = d.wh[1] * S; c.beginPath(); c.rect(-w / 2, -h / 2 + 2.3 * S, w, h - 2.3 * S); return; }
  A.outline(c, d, S);
}
function regionCentre(d, rid) { if (rid === 'cranium') return { x: 0, y: -5 * S }; if (rid === 'face') return { x: 0, y: 4 * S }; if (rid === 'neck') return { x: 0, y: -8.5 * S }; return { x: 0, y: 0 }; }
/* hit testing on the chart */
function regionAtPoint(cx, cy) {
  const L = layout(), dpr = L.dpr, r = cv.getBoundingClientRect(), x = (cx - r.left) * dpr, y = (cy - r.top) * dpr;
  const { st } = stateAt(view.t); let found = null;
  for (const d of A.PARTS.slice().sort((a, b) => b.layer - a.layer)) {
    const pl = placement(d.id); if (!pl) continue;
    for (const rid of regionsOn(d.id).slice().reverse()) {
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.translate(L.ox, L.oy); ctx.scale(L.k / S, L.k / S); ctx.translate(pl.x, pl.y); ctx.rotate(pl.a); regionPath(ctx, d, rid); const inside = ctx.isPointInPath(x, y); ctx.restore();
      if (inside) { found = rid; break; }
    }
    if (found) break;
  }
  return found ? { id: found, st: st[found] } : null;
}
function hoverAt(cx, cy) {
  const tip = box.querySelector('.tip'), h = regionAtPoint(cx, cy), r = cv.getBoundingClientRect();
  const id = h ? h.id : null; if (id !== view.hover) { view.hover = id; draw(); }
  if (!h) { tip.style.display = 'none'; return; }
  const reg = cur.regions[h.id];
  tip.style.display = 'block'; tip.style.left = (cx - r.left + 14) + 'px'; tip.style.top = (cy - r.top + 10) + 'px';
  tip.innerHTML = `<b>${reg.name}</b><br>AIS ${h.st.ais}: ${AIS_NAME[h.st.ais]}${h.st.amp ? '<br>amputated' : ''}`;
}
function pickAt(cx, cy) { const h = regionAtPoint(cx, cy); view.sel = h ? h.id : null; view.ev = null; panel(); draw(); }

/* the strip along the bottom: one tick per event, tall for bad ones, the fatal one red */
function timeline() {
  const tl = box.querySelector('canvas.tl'), c = tl.getContext('2d'), W = tl.width, H = tl.height, span = endT(), dpr = +cv.dataset.dpr || 1;
  c.clearRect(0, 0, W, H); c.fillStyle = '#071119'; c.fillRect(0, 0, W, H);
  if (cur.alive < span) { const x = cur.alive / span * W; c.fillStyle = 'rgba(255,255,255,0.05)'; c.fillRect(x, 0, W - x, H); }
  for (const e of cur.events) {
    const x = e.t / span * W, sev = e.inj && e.inj.length ? Math.max(...e.inj.map(i => i.sev || 0)) : 0;
    const h = e.kind === 'death' ? H : sev ? H * (0.25 + sev * 0.11) : H * 0.14;
    c.fillStyle = e.kind === 'death' ? '#ff3b2f' : cur.fatal === e.i ? '#ff3b2f' : sev ? AIS_COL[Math.min(6, sev)] : 'rgba(160,200,220,0.35)';
    c.fillRect(Math.round(x), H - h, Math.max(1, dpr), h);
  }
  const x = view.t / span * W; c.fillStyle = '#6ad0ff'; c.fillRect(x - dpr, 0, 2 * dpr, H);
}
function stepEvent(dir) {
  const evs = cur.events.filter(e => e.inj && e.inj.length || e.kind === 'death' || e.kind === 'sever');
  if (!evs.length) return;
  let i = evs.findIndex(e => e === view.ev); i = i < 0 ? (dir > 0 ? 0 : evs.length - 1) : clamp(i + dir, 0, evs.length - 1);
  view.ev = evs[i]; view.t = evs[i].t; if (evs[i].region) view.sel = evs[i].region; panel(); draw();
  const el = box.querySelector(`.ev[data-i="${evs[i].i}"]`); if (el) el.scrollIntoView({ block: 'nearest' });
}

/* ------------------------------------------------------------ the words: the case, the cause, the region, the order it happened in */
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));
function panel() {
  const p = box.querySelector('.xp'), c = cur, ch = c.chain || { immediate: c.cause, due: [], other: [], manner: '' };
  const cases = G.cases.slice().reverse();
  let h = `<h2>CASE ${c.n} · ${esc(c.name.toUpperCase())}</h2><div class="sub">alive ${c.alive} s after he was called in · died ${esc(c.diedAt)} · ISS ${c.iss}${c.iss >= 75 ? ' (unsurvivable)' : ''}</div>`;
  if (cases.length > 1) h += `<div style="margin-top:6px"><select aria-label="other cases">${cases.map(k => `<option value="${k.id}" ${k === c ? 'selected' : ''}>case ${k.n}: ${esc(k.name)}, ${esc(k.cause)}</option>`).join('')}</select></div>`;
  h += `<h3>CAUSE OF DEATH</h3><div class="cod">I. (a) ${esc(ch.immediate)}</div>`;
  (ch.due || []).forEach((d, i) => { h += `<div class="cod" style="padding-left:${12 + i * 8}px">${'(b)(c)(d)'.slice(i * 3, i * 3 + 3) || '·'} due to ${esc(d)}</div>`; });
  if ((ch.other || []).length) h += `<div class="sub" style="margin-top:4px">II. other significant injuries: ${esc(ch.other.join('; '))}</div>`;
  h += `<div class="sub" style="margin-top:4px">manner: ${esc(ch.manner)}</div>`;
  h += `<h3>RECONSTRUCTION</h3>` + reconstruction();
  if (view.sel) h += regionPanel(view.sel);
  h += `<h3>INJURIES BY REGION</h3><div>${Object.values(c.regions).filter(r => r.ais > 0).sort((a, b) => b.ais - a.ais).map(r => `<div class="ev" data-r="${r.id}"><span class="ais" style="background:${AIS_COL[r.ais]}">${r.ais}</span><b>${esc(r.name)}</b> <span class="sub">${esc(r.words)}</span></div>`).join('') || '<div class="sub">nothing recorded</div>'}</div>`;
  h += `<h3>TIMELINE</h3><div class="sub">every recorded event, in order. click one to see it on him. ←/→ step through, space plays.</div>`;
  h += c.events.filter(e => !e.minor || (e.n || 1) > 2).map(evRow).join('');
  h += `<div class="sub" style="margin-top:10px">blood lost ${(c.lost / 1000).toFixed(2)} L · fractures ${c.stats.fractures} · pieces ${c.stats.pieces} · hits ${c.stats.hits}${c.stats.shots ? ' · rounds ' + c.stats.shots : ''}${c.stats.falls ? ' · falls ' + c.stats.falls : ''}</div>`;
  p.innerHTML = h;
  const sel = p.querySelector('select'); if (sel) sel.onchange = () => { const k = G.cases.find(q => String(q.id) === sel.value); if (k) RC.open(k); };
  for (const el of p.querySelectorAll('.ev[data-i]')) el.onclick = () => { const e = c.events[+el.dataset.i]; view.ev = e; view.t = e.t; view.sel = e.region || view.sel; panel(); draw(); };
  for (const el of p.querySelectorAll('.ev[data-r]')) el.onclick = () => { view.sel = el.dataset.r; view.ev = null; panel(); draw(); };
}
function evRow(e) {
  const sev = e.inj && e.inj.length ? Math.max(...e.inj.map(i => i.sev || 0)) : 0, reg = e.region && cur.regions[e.region];
  const fatal = cur.fatal === e.i || e.kind === 'death';
  const what = e.kind === 'death' ? `<b>died</b>: ${esc(e.src)}` : e.kind === 'vital' ? `<b>${esc(e.type)}</b>${e.src ? ': ' + esc(e.src) : ''}` : e.minor ? `<b>${e.n} small knock${e.n > 1 ? 's' : ''}</b> to the ${esc(reg ? reg.name : e.region)}, ${esc(e.src)}` : `<b>${esc(reg ? reg.name : e.region || '')}</b>: ${esc(e.src)}${e.v ? ` · ${e.v} m/s` : ''}${e.E && e.kind !== 'shot' ? ` · ${e.E} J` : ''}${e.F ? ` · ${e.F} N` : ''}${e.dist ? ` · ${e.dist} m` : ''}`;
  const inj = e.inj && e.inj.length ? `<div class="sub">${esc(e.inj.map(i => i.what).join('; '))}</div>` : '';
  const nth = reg && e.region ? cur.events.filter(q => q.region === e.region && q.i <= e.i && q.inj && q.inj.length).length : 0;
  const tags = (fatal ? '<span class="tag" style="border-color:#ff3b2f;color:#ff8a80">FATAL</span>' : '') + (e.post ? '<span class="tag">after death</span>' : '') + (nth > 1 && sev ? `<span class="tag">${ordinal(nth)} injury here</span>` : '');
  return `<div class="ev${fatal ? ' fatal' : ''}${e.post ? ' post' : ''}${view.ev === e ? ' sel' : ''}" data-i="${e.i}">${sev ? `<span class="ais" style="background:${AIS_COL[Math.min(6, sev)]}">${sev}</span>` : '<span class="ais" style="background:#1b2a33;color:#8ab">·</span>'}<span class="sub">${e.t.toFixed(2)} s</span> ${what}${tags}${inj}</div>`;
}
const ordinal = n => n + (n % 10 === 1 && n % 100 !== 11 ? 'st' : n % 10 === 2 && n % 100 !== 12 ? 'nd' : n % 10 === 3 && n % 100 !== 13 ? 'rd' : 'th');
/* the story: the first real injury, what built on it, and the last thing */
function reconstruction() {
  const c = cur, ev = c.events.filter(e => e.inj && e.inj.length && !e.post);
  if (!ev.length) return `<div class="sub">${c.dusty ? 'skeletal remains. he was already dead.' : 'no injuries were recorded before death.'}</div>`;
  const first = ev[0], fatal = c.events[c.fatal], last = c.events.find(e => e.kind === 'death');
  const worst = e => e.inj.slice().sort((a, b) => b.sev - a.sev)[0].what;
  const regName = id => (c.regions[id] && c.regions[id].name) || id;
  const out = [];
  out.push(`<li><b>first injury</b> at ${first.t.toFixed(1)} s: ${esc(worst(first))} (${esc(regName(first.region))}), ${esc(first.src)}.</li>`);
  /* regions hurt more than once: the cumulative part */
  const by = {}; for (const e of ev) if (e.region) (by[e.region] = by[e.region] || []).push(e);
  const rep = Object.entries(by).filter(([, l]) => l.length > 1).sort((a, b) => b[1].length - a[1].length).slice(0, 3);
  for (const [r, l] of rep) out.push(`<li><b>${esc(regName(r))}</b> was hurt ${l.length} times (${l.map(e => e.t.toFixed(1) + ' s').join(', ')}): ${esc(l.map(worst).filter((v, i, a) => a.indexOf(v) === i).slice(-3).join(', then '))}.</li>`);
  const mid = ev.filter(e => e !== first && e !== fatal && !rep.some(([r]) => r === e.region)).sort((a, b) => Math.max(...b.inj.map(i => i.sev)) - Math.max(...a.inj.map(i => i.sev))).slice(0, 3);
  for (const e of mid) out.push(`<li>at ${e.t.toFixed(1)} s: ${esc(worst(e))} (${esc(regName(e.region))}), ${esc(e.src)}.</li>`);
  if (fatal && fatal.kind !== 'death') out.push(`<li><b style="color:#ff8a80">fatal</b> at ${fatal.t.toFixed(1)} s: ${esc(worst(fatal) || fatal.type)} (${esc(regName(fatal.region))}), ${esc(fatal.src)}.</li>`);
  if (last) out.push(`<li>died at ${last.t.toFixed(1)} s of ${esc(c.cause)}${c.chain && c.chain.due && c.chain.due.length > 1 ? ', the result of more than one injury' : ''}.</li>`);
  const post = c.events.filter(e => e.post && e.inj && e.inj.length).length;
  if (post) out.push(`<li class="sub">${post} more injur${post > 1 ? 'ies' : 'y'} after death, with no bleeding into them: drawn dashed.</li>`);
  return `<ol>${out.join('')}</ol>`;
}
function regionPanel(id) {
  const r = cur.regions[id]; if (!r) return '';
  const { st } = stateAt(view.t), s = st[id];
  const bone = s.frac === 3 ? 'shattered' : s.frac === 2 ? (s.compound ? 'fractured, through the skin' : 'fractured') : s.frac === 1 ? 'cracked' : 'intact';
  const rows = [
    ['severity', `<span class="ais" style="background:${AIS_COL[s.ais]}">${s.ais}</span>${AIS_NAME[s.ais]}`],
    ['skin', s.amp ? 'gone' : `${Math.round(s.skin * 100)}% intact${s.abr > 0.05 ? `, ${Math.round(s.abr * 100)}% scraped` : ''}${s.burn > 0.05 ? `, ${Math.round(s.burn * 100)}% burned` : ''}`],
    ['soft tissue', s.soft > 0.85 ? 'crushed' : s.soft > 0.55 ? 'deep bruising' : s.soft > 0.05 ? 'bruised' : 'sound'],
    [r.bone, bone], r.org ? [r.org, s.organ >= 1 ? 'destroyed' : s.organ > 0.6 ? 'badly damaged' : s.organ > 0.25 ? 'damaged' : s.organ > 0 ? 'bruised' : 'sound'] : null,
    ['bleeding', s.bleed > 0 ? `${s.bleed.toFixed(1)} ml/s at the time` : 'none'],
    ['hits taken', `${r.hits} (${r.energy} J in all)${r.cuts ? `, ${r.cuts} cuts` : ''}${r.holes ? `, ${r.holes} rounds` : ''}`]
  ].filter(Boolean);
  const evs = cur.events.filter(e => e.region === id && (e.inj && e.inj.length || e.kind === 'sever'));
  const inChain = cur.chain && (cur.chain.due || []).some(d => d.includes(r.name)) || (cur.events[cur.fatal] && cur.events[cur.fatal].region === id);
  return `<h3>${esc(r.name.toUpperCase())}</h3><table>${rows.map(([a, b]) => `<tr><td>${esc(a)}</td><td>${b}</td></tr>`).join('')}</table>${inChain ? '<div class="cod" style="margin-top:4px">this region is part of the cause of death.</div>' : ''}${evs.length ? evs.map(evRow).join('') : '<div class="sub">no injuries here.</div>'}`;
}
})();
