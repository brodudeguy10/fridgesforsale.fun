/* ============================================================
   THE GUY, version three: skin that comes away (the torture room).
   a wound that tears the skin rather than cutting it (a corner, a
   chainsaw's chain, a razor taking a strip, a blast) can leave the
   skin it tore loose hanging off one edge of it: a flap, joined to
   him along that edge and free everywhere else. it hangs, swings
   when he moves, folds on the floor, and shows its raw side when
   it turns over.

   the hand can take hold of a flap. pull it and it peels: the
   opening it came from tears on along the way you pull, a little at
   a time, bleeding, and the flap gets longer. pull hard or far
   enough and it comes off in your hand, a piece of him on the
   floor (a gib, with its own weight, that lands and stays).

   joints show the skin moving with him too: a bent knee or elbow
   creases on the inside.
============================================================ */
(function () {
'use strict';
const G = window.__G3; if (!G || !G.A || !G.flesh) return;
const A = G.A, S = G.S, clamp = G.clamp, rnd = G.rnd;
const SK = G.skin = {};
const flaps = SK.flaps = [];
const MAX = 14;
const hsl = (a, k = 0) => `hsl(${a[0]},${a[1] * (1 - k * 0.75)}%,${a[2] + (84 - a[2]) * k * 0.45}%)`;

/* ------------------------------------------------------------ making one */
/* p: the part; (lx, ly): the middle of the edge it hangs from, in the part's (limb's) frame; a: the edge's direction
   there; w: how wide; len: how long; out: which way off the edge it was torn (local) */
SK.add = function (g, p, lx, ly, a, w, len, out) {
  if (!p || p.gone || p.removed || g.dusty || !p.tex) return null;
  if (flaps.some(f => f.p === p && Math.hypot(f.lx - lx, f.ly - ly) < 3 * S)) return null;
  while (flaps.length >= MAX) flaps.shift();
  const ex = Math.cos(a), ey = Math.sin(a);
  const f = { g, p, lx, ly, ex, ey, w: clamp(w, 2.5 * S, 9 * S), len: clamp(len, 2.5 * S, 11 * S), seed: Math.random(), t0: G.t, hold: null, peel: 0, ox: out ? out.x : -ey, oy: out ? out.y : ex, n: [] };
  /* three points down the middle of it, from the edge it hangs by to its free end, laid flat along the way it was torn */
  const b = G.toWorld(p.body, lx, ly), od = G.dirWorld(p.body, f.ox, f.oy), om = Math.hypot(od.x, od.y) || 1;
  for (let i = 0; i < 3; i++) { const k = i / 2 * f.len; const x = b.x + od.x / om * k, y = b.y + od.y / om * k; f.n.push({ x, y, px: x, py: y }); }
  flaps.push(f);
  return f;
};
/* which wounds leave a flap: the ones that tear */
G.on('wound', (g, p, w) => {
  if (g.dusty || !p.tex || p.kind === 'hand' || p.kind === 'foot') return;
  const dl = w.dir ? G.dirLocal(p.body, w.dir.x, w.dir.y) : { x: 1, y: 0 }, a = Math.atan2(dl.y, dl.x), cmPx = 1 / (G.mpp * 100);
  if (w.type === 'tear' && w.size > 3.5) {
    /* torn along an edge: the skin on one side of the gash comes up */
    const len = clamp(w.size * cmPx * 1.2, 4, 22 * S), side = Math.random() < 0.5 ? 1 : -1, ax = a + Math.PI / 2;
    SK.add(g, p, w.lx + Math.cos(ax) * 0, w.ly, ax, len * 0.7, len * 0.22 + 2 * S, { x: Math.cos(a) * side, y: Math.sin(a) * side });
  } else if (w.type === 'saw' && Math.random() < 0.3) {
    const x2 = w.x2 != null ? w.x2 : w.lx, y2 = w.y2 != null ? w.y2 : w.ly, aa = Math.atan2(y2 - w.ly, x2 - w.lx);
    SK.add(g, p, (w.lx + x2) / 2, (w.ly + y2) / 2, aa, rnd(3, 5) * S, rnd(3, 6) * S, { x: -Math.sin(aa) * (Math.random() < 0.5 ? 1 : -1), y: Math.cos(aa) });
  } else if (w.type === 'slice' && w.depth >= 2 && Math.random() < 0.55) {
    /* a razor taking a strip: the strip stays on at the end the stroke started from */
    const x2 = w.x2 != null ? w.x2 : w.lx + Math.cos(a) * 6 * S, y2 = w.y2 != null ? w.y2 : w.ly + Math.sin(a) * 6 * S, aa = Math.atan2(y2 - w.ly, x2 - w.lx), L = Math.hypot(x2 - w.lx, y2 - w.ly);
    SK.add(g, p, w.lx, w.ly, aa + Math.PI / 2, (1.1 + w.depth * 0.7) * S * 0.9, Math.max(3 * S, L * 0.8), { x: Math.cos(aa), y: Math.sin(aa) });
  } else if (w.type === 'split' && w.size > 7) {
    SK.add(g, p, w.lx, w.ly, a, w.size * cmPx * 0.4, w.size * cmPx * 0.25, null);
  } else if (w.type === 'shred' && Math.random() < 0.5) {
    SK.add(g, p, rnd(-0.3, 0.3) * (p.def.wh ? p.def.wh[0] : p.def.r) * S, rnd(-0.3, 0.3) * (p.def.wh ? p.def.wh[1] : p.def.r) * S, rnd(0, 6.28), rnd(3, 6) * S, rnd(3, 7) * S, null);
  }
});
/* a part that came off or went: its flaps go with it (they stay on a part that's merely off him) */
G.on('destroy', g => { for (let i = flaps.length - 1; i >= 0; i--) if (flaps[i].g === g) flaps.splice(i, 1); });
/* a limb broken in two: a flap below the break is on the lower piece now */
G.on('split', (g, p, p2, ys) => { for (const f of flaps) if (f.p === p && f.ly > ys) f.p = p2; });
SK.reset = () => { flaps.length = 0; };

/* ------------------------------------------------------------ every step: it hangs, it swings, it peels */
const GRAV = 0.26;
G.M.Events.on(G.engine, 'afterUpdate', () => {
  if (!flaps.length) return;
  const fy = G.floorY ? G.floorY() : 1e9;
  for (let i = flaps.length - 1; i >= 0; i--) {
    const f = flaps[i], p = f.p;
    if (!p || p.gone || p.removed || f.g.cleared) { flaps.splice(i, 1); continue; }
    const b = G.toWorld(p.body, f.lx, f.ly), n = f.n, seg = f.len / 2;
    /* the edge it hangs by goes where he goes; the rest swings after it */
    n[0].px = n[0].x; n[0].py = n[0].y; n[0].x = b.x; n[0].y = b.y;
    for (let k = 1; k < 3; k++) {
      const q = n[k], vx = (q.x - q.px) * 0.94, vy = (q.y - q.py) * 0.94;
      q.px = q.x; q.py = q.y; q.x += vx; q.y += vy + GRAV * 0.55;
    }
    /* in the hand: the free end goes toward the hand */
    if (f.hold) { const q = n[2], k = 0.55; q.x += (f.hold.x - q.x) * k; q.y += (f.hold.y - q.y) * k; }
    /* a little stiffness near the edge: skin doesn't fold like cloth right where it's still attached */
    const od = G.dirWorld(p.body, f.ox, f.oy), om = Math.hypot(od.x, od.y) || 1, stiff = f.hold ? 0 : 0.08;
    n[1].x += (n[0].x + od.x / om * seg - n[1].x) * stiff; n[1].y += (n[0].y + od.y / om * seg - n[1].y) * stiff;
    for (let it = 0; it < 3; it++) {
      for (let k = 1; k < 3; k++) {
        const a = n[k - 1], c = n[k], dx = c.x - a.x, dy = c.y - a.y, d = Math.hypot(dx, dy) || 1e-6, e = (d - seg) / d;
        if (k === 1) { c.x -= dx * e; c.y -= dy * e; } else { a.x += dx * e * 0.5; a.y += dy * e * 0.5; c.x -= dx * e * 0.5; c.y -= dy * e * 0.5; }
      }
      n[1].x = n[1].x;
      for (let k = 1; k < 3; k++) if (n[k].y > fy - 0.4) { n[k].y = fy - 0.4; n[k].px += (n[k].x - n[k].px) * 0.5; }
    }
    /* pulled further than it's long: it peels on, tearing the skin it's still joined to along the way of the pull */
    if (f.hold) {
      const reach = Math.hypot(f.hold.x - n[0].x, f.hold.y - n[0].y), over = reach - f.len;
      if (over > 1.5 * S) peel(f, over);
    }
  }
});
function peel(f, over) {
  const p = f.p, g = f.g, now = G.t;
  if (now - (f.peelT || 0) < 0.07) return;
  f.peelT = now;
  /* which way along the part the pull runs, in its frame */
  const pl = G.toLocal(p.body, f.hold.x, f.hold.y), dx = pl.x - f.lx, dy = pl.y - f.ly, d = Math.hypot(dx, dy) || 1, ux = dx / d, uy = dy / d;
  const step = Math.min(2.4 * S, over * 0.35);
  /* the skin tears on from the edge: an opening continued that far, the flap's edge moves along it, and it's longer */
  const nx = f.lx + ux * step, ny = f.ly + uy * step;
  const hw = (p.def.wh ? p.def.wh[0] : p.def.r * 2) * S / 2, hh = (p.def.wh ? p.def.wh[1] : p.def.r * 2) * S / 2;
  const inside = Math.abs(nx) < hw * 0.95 && Math.abs(ny) < hh * 0.95;
  if (inside) {
    G.emit('wound', g, p, { type: 'peel', lx: (f.lx + nx) / 2, ly: (f.ly + ny) / 2, x2: nx, y2: ny, x1: f.lx, y1: f.ly, w: f.w, size: step / S });
    f.lx = nx; f.ly = ny; f.len = Math.min(16 * S, f.len + step * 0.8); f.peel += step;
    if (G.bleed) G.bleed.add(g, p, { kind: 'cap', rate: 0.5, lx: nx, ly: ny });
    if (G.dmg && g.dm) { const R = g.dm.regions[A.regionAt(p.id, nx / S, ny / S)]; if (R) { R.skin = Math.max(0, R.skin - 0.04); R.lac += step / (S * 6.25); if (g.alive) { R.pain = Math.min(100, R.pain + 6); g.dm.pain = Math.min(220, g.dm.pain + 5); } } }
    if (g.alive && Math.random() < 0.35) G.emit('voice', g, 'scream', 0.9);
    G.emit('sfx', 'squish', { x: f.n[0].x, k: 0.35 });
    if (window.TR && window.TR.sfx && Math.random() < 0.5) window.TR.sfx.play('tear', { x: f.n[0].x, gain: 0.3, rate: rnd(1.2, 1.5) });
  }
  /* too far, too fast, or off the edge of him: it comes away */
  if (!inside || f.peel > 14 * S || over > 9 * S) off(f);
}
function off(f) {
  const i = flaps.indexOf(f); if (i < 0) return;
  flaps.splice(i, 1);
  const q = f.n[2], m = f.n[1];
  if (G.gibs) { const o = G.gibs.gib('skin', m.x, m.y, (q.x - q.px) * 0.8, (q.y - q.py) * 0.8, clamp(f.len / S * 0.45, 1.6, 4), f.g); if (o) { o.w = f.w; o.len = f.len; o.col = f.g.look.skin; } }
  if (f.g.dm) G.dmg.record(f.g, { kind: 'cut', type: 'flayed', region: A.regionAt(f.p.id, f.lx / S, f.ly / S), part: f.p.id, lx: +(f.lx / S).toFixed(1), ly: +(f.ly / S).toFixed(1), src: 'a flap of skin torn off by hand', srcKind: 'hand', depth: 1, inj: [{ what: `skin torn away, ${(f.peel / (S * 6.25) + f.len / (S * 6.25)).toFixed(0)} cm`, sev: 2, tissue: 'skin' }] });
  G.emit('sfx', 'squish', { x: q.x, k: 0.7 });
  if (f.g.alive) G.emit('voice', f.g, 'scream', 1.2);
  SK.dropped = f;
}

/* ------------------------------------------------------------ the hand */
SK.pick = function (x, y) {
  let best = null, bd = 4.5;
  for (const f of flaps) for (let k = 1; k < 3; k++) { const d = Math.hypot(f.n[k].x - x, f.n[k].y - y); if (d < bd) { bd = d; best = f; } }
  return best;
};
SK.grab = (f, x, y) => { f.hold = { x, y }; G.wake(f.g); };
SK.move = (f, x, y) => { if (f.hold) { f.hold.x = x; f.hold.y = y; } };
SK.release = f => { if (f) f.hold = null; };
SK.alive = f => flaps.indexOf(f) >= 0;

/* ------------------------------------------------------------ drawing */
SK.draw = function (ctx, g, layer) {
  for (const f of flaps) { if (f.g !== g || f.p.def.layer !== layer || f.p.gone || f.p.removed) continue; drawFlap(ctx, f); }
};
function drawFlap(ctx, f) {
  const g = f.g, p = f.p, n = f.n, skin = G.flesh.skinCol(g), dead = !g.alive;
  /* the edge it hangs by, on him; then out along the middle line, narrowing to its free end */
  const e1 = G.toWorld(p.body, f.lx - f.ex * f.w / 2, f.ly - f.ey * f.w / 2), e2 = G.toWorld(p.body, f.lx + f.ex * f.w / 2, f.ly + f.ey * f.w / 2);
  const pts = [], R = G.srand(f.seed);
  for (let k = 1; k < 3; k++) {
    const a = n[k - 1], c = n[k], dx = c.x - a.x, dy = c.y - a.y, d = Math.hypot(dx, dy) || 1, wk = f.w / 2 * (k === 1 ? 0.86 : 0.55) * (0.85 + R() * 0.3);
    pts.push({ l: { x: c.x - dy / d * wk, y: c.y + dx / d * wk }, r: { x: c.x + dy / d * wk, y: c.y - dx / d * wk } });
  }
  /* which side faces you: turned over (hanging back across itself), you see the raw underside */
  const ax = n[2].x - n[0].x, ay = n[2].y - n[0].y, bx = e2.x - e1.x, by = e2.y - e1.y, flip = (bx * ay - by * ax) < 0;
  ctx.save(); ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(e1.x, e1.y); ctx.lineTo(pts[0].l.x, pts[0].l.y); ctx.lineTo(pts[1].l.x, pts[1].l.y);
  /* the torn free end: ragged */
  const mid = { x: (pts[1].l.x + pts[1].r.x) / 2, y: (pts[1].l.y + pts[1].r.y) / 2 };
  ctx.lineTo(mid.x + (R() - 0.5) * 1.2 * S, mid.y + (R() - 0.2) * 1.4 * S);
  ctx.lineTo(pts[1].r.x, pts[1].r.y); ctx.lineTo(pts[0].r.x, pts[0].r.y); ctx.lineTo(e2.x, e2.y); ctx.closePath();
  if (flip) { ctx.fillStyle = dead ? '#7a3a30' : '#a8443a'; ctx.fill(); ctx.fillStyle = 'rgba(226,194,122,0.35)'; ctx.fill(); }
  else { ctx.fillStyle = skin; ctx.fill(); ctx.fillStyle = 'rgba(120,20,16,0.18)'; ctx.fill(); }
  /* blood on it, more toward the torn end */
  const gr = ctx.createLinearGradient(n[0].x, n[0].y, n[2].x, n[2].y); gr.addColorStop(0, 'rgba(90,6,6,0.1)'); gr.addColorStop(1, 'rgba(90,6,6,0.55)');
  ctx.fillStyle = gr; ctx.fill();
  ctx.strokeStyle = 'rgba(70,8,6,0.85)'; ctx.lineWidth = 0.55; ctx.stroke();
  /* the raw edge showing along the side of it: the inside of the skin, pink, a thread of yellow fat */
  ctx.strokeStyle = flip ? 'rgba(240,200,150,0.6)' : 'rgba(205,110,95,0.7)'; ctx.lineWidth = 0.5;
  ctx.beginPath(); ctx.moveTo(pts[0].l.x, pts[0].l.y); ctx.lineTo(pts[1].l.x, pts[1].l.y); ctx.stroke();
  ctx.restore();
}

/* ------------------------------------------------------------ skin moving with him: creases inside a bent joint */
const CREASE = new Set(['elbowL', 'elbowR', 'kneeL', 'kneeR']);
SK.creases = function (ctx, g, layer) {
  if (g.dusty) return;
  for (const j of g.joints) {
    if (!CREASE.has(j.id) || j.broken || j.b.def.layer !== layer || j.a.gone || j.b.gone) continue;
    const pv = G.body.pivot(j), a = j.a.body.position, b = j.b.body.position;
    const ux = a.x - pv.x, uy = a.y - pv.y, vx = b.x - pv.x, vy = b.y - pv.y, ul = Math.hypot(ux, uy) || 1, vl = Math.hypot(vx, vy) || 1;
    const cos = (ux * vx + uy * vy) / (ul * vl), bend = Math.PI - Math.acos(clamp(cos, -1, 1));
    if (bend < 0.45) continue;
    /* the inside of the bend: between the two limbs */
    let ix = ux / ul + vx / vl, iy = uy / ul + vy / vl; const il = Math.hypot(ix, iy) || 1; ix /= il; iy /= il;
    const w = Math.min(j.b.def.wh[0], j.a.def.wh ? j.a.def.wh[0] : 6) * S, k = clamp((bend - 0.45) / 1.2, 0, 1);
    ctx.save(); ctx.strokeStyle = `rgba(60,25,18,${(0.18 + 0.3 * k).toFixed(3)})`; ctx.lineWidth = 0.45; ctx.lineCap = 'round';
    for (let i = 0; i < 3; i++) {
      const off = w * (0.18 + i * 0.12), cx = pv.x + ix * off, cy = pv.y + iy * off, half = w * (0.32 - i * 0.07);
      ctx.beginPath(); ctx.moveTo(cx - iy * half, cy + ix * half); ctx.quadraticCurveTo(cx + ix * 0.6, cy + iy * 0.6, cx + iy * half, cy - ix * half); ctx.stroke();
    }
    /* and the outside of it stretched tight: a little shine over the point */
    ctx.strokeStyle = `rgba(255,235,220,${(0.08 + 0.12 * k).toFixed(3)})`; ctx.lineWidth = 0.8;
    ctx.beginPath(); ctx.arc(pv.x - ix * w * 0.35, pv.y - iy * w * 0.35, w * 0.25, Math.atan2(-iy, -ix) - 0.7, Math.atan2(-iy, -ix) + 0.7); ctx.stroke();
    ctx.restore();
  }
};
})();
