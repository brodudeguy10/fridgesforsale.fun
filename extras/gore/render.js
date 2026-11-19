/* ============================================================
   THE GUY, version three: drawing him.
   each part is its flesh stack (flesh.js) drawn in the part's own
   frame, then lit from above whichever way up he is, outlined, and
   finished with what only makes sense drawn live: the face, the
   hat, blood running downhill out of whatever's open, the ends of
   anything that came off, bones through skin, a shadow on the floor.
============================================================ */
(function () {
'use strict';
const G = window.__G3; if (!G || !G.A) return;
const A = G.A, S = G.S, clamp = G.clamp;
const R = G.rend = {};
const hsl = (a, k = 0) => `hsl(${a[0]},${a[1] * (1 - k * 0.75)}%,${a[2] + (84 - a[2]) * k * 0.45}%)`;
/* the base colour of what a part is wearing at a joint, for the caps that hide the seams */
function capColour(g, p, atTop) {
  if (g.dusty) return '#e8e0cc';
  const c = A.CLOTH[p.kind], pale = G.flesh ? G.flesh.pale(g) : 0;
  if (p.kind === 'lleg' && !atTop) return g.look.boots;
  if (!c) return hsl(g.look.skin, pale);
  return c === 'shirt' ? g.look.shirt : c === 'boot' ? g.look.boots : g.look.pants;
}

/* ------------------------------------------------------------ a part */
function drawPart(ctx, g, p) {
  const b = p.body, t = p.tex, d = p.def;
  ctx.save(); ctx.translate(b.position.x, b.position.y); ctx.rotate(b.angle);
  if (t) {
    /* a broken long bone that stayed inside: the limb bends where it broke */
    const kink = t.frac.find(f => !f.out && f.bend);
    if (kink && A.LONG.has(p.kind)) {
      ctx.save(); ctx.beginPath(); ctx.rect(-t.cx, -t.cy, t.w, t.cy + kink.y); ctx.clip(); ctx.drawImage(t.comp, -t.cx, -t.cy); ctx.restore();
      ctx.save(); ctx.translate(0, kink.y); ctx.rotate(kink.bend * (g.alive ? 0.8 : 1)); ctx.translate(0, -kink.y); ctx.beginPath(); ctx.rect(-t.cx, kink.y, t.w, t.h); ctx.clip(); ctx.drawImage(t.comp, -t.cx, -t.cy); ctx.restore();
    } else ctx.drawImage(t.comp, -t.cx, -t.cy);
  } else { A.outline(ctx, d, S); ctx.fillStyle = '#c8a080'; ctx.fill(); }
  /* light from above, wherever above is for this part right now */
  const up = G.dirLocal(b, 0, -1), ext = (d.r || Math.max(d.wh[0], d.wh[1]) / 2) * S;
  const gr = ctx.createLinearGradient(up.x * ext - up.y * ext * 0.4, up.y * ext + up.x * ext * 0.4, -up.x * ext, -up.y * ext);
  gr.addColorStop(0, 'rgba(255,245,230,0.16)'); gr.addColorStop(0.5, 'rgba(0,0,0,0)'); gr.addColorStop(1, 'rgba(0,0,0,0.26)');
  ctx.save(); A.outline(ctx, d, S); ctx.clip(); ctx.fillStyle = gr; ctx.fillRect(-ext * 1.5, -ext * 1.5, ext * 3, ext * 3); ctx.restore();
  A.outline(ctx, d, S); ctx.strokeStyle = g.dusty ? '#3a3024' : '#0b0806'; ctx.lineWidth = 1.3; ctx.stroke();
  if (t) {
    /* closed fractures: a crease where it broke */
    for (const f of t.frac) if (!f.out) { ctx.strokeStyle = 'rgba(0,0,0,0.55)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(-d.wh[0] * S / 2, f.y); ctx.lineTo(0, f.y + 1.5); ctx.lineTo(d.wh[0] * S / 2, f.y - 1); ctx.stroke(); }
    /* compound: the bone out through the side */
    for (const f of t.frac) if (f.out) { ctx.fillStyle = '#efe8d8'; ctx.strokeStyle = '#7a0a0a'; ctx.lineWidth = 0.8; ctx.beginPath(); ctx.moveTo(-1.2 * S * f.side, f.y - 1.5 * S); ctx.lineTo(d.wh[0] * S * 0.9 * f.side, f.y - 3.4 * S); ctx.lineTo(d.wh[0] * S * 0.72 * f.side, f.y - 1.6 * S); ctx.lineTo(1.2 * S * f.side, f.y + 1.3 * S); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.fillStyle = '#9a1a1a'; ctx.fillRect(d.wh[0] * S * 0.72 * f.side - 0.8, f.y - 3.3 * S, 1.6, 1.2); }
    /* blood that runs out of what's open, downhill */
    if (!g.dusty) {
      const down = G.dirLocal(b, 0, 1), now = G.t;
      ctx.strokeStyle = '#5a0404'; ctx.lineCap = 'round';
      for (const o of t.openings) {
        if (o.bleed < 0.08 && now - o.t > 25) continue;
        const len = Math.min(16 * S, (now - o.t) * 6 * S * Math.min(1, o.bleed + 0.3)) * (o.bleed > 0.08 ? 1 : 0.7);
        if (len < 1) continue;
        const R2 = G.srand(o.x * 7.3 + o.y);
        ctx.globalAlpha = 0.75; ctx.lineWidth = 1.1 * S * Math.min(1.4, 0.6 + o.bleed);
        ctx.beginPath(); ctx.moveTo(o.x, o.y); ctx.quadraticCurveTo(o.x + down.x * len * 0.5 + (R2() - 0.5) * 3, o.y + down.y * len * 0.5, o.x + down.x * len, o.y + down.y * len); ctx.stroke();
        ctx.globalAlpha = 1;
      }
    }
    for (const e of t.ends) drawEnd(ctx, e, g, p);
  }
  if (p.kind === 'head') { drawFace(ctx, g, p); if (t && t.over) ctx.drawImage(t.over, -t.cx, -t.cy); if (g.hatOn && g.look.hat) drawHat(ctx, d.r * S, g.look.hatCol); }
  if (p.kind === 'hand') drawFingers(ctx, g, p);
  ctx.restore();
}
/* the cut end of a part: skin, fat, muscle in rings, the bone in the middle, the marrow in that */
function drawEnd(ctx, e, g, p) {
  const d = p.def, r = (d.wh ? Math.min(d.wh[0], d.wh[1]) : d.r) * S * 0.5, R2 = G.srand(e.seed);
  ctx.save(); ctx.translate(e.x, e.y);
  const n = 12, rag = e.why === 'cut' ? 0.05 : e.why === 'blast' ? 0.35 : 0.25;
  const ring = (k, col) => { ctx.fillStyle = col; ctx.beginPath(); for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2, rr = r * k * (1 - rag * 0.5 + R2() * rag); ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr * 0.62); } ctx.closePath(); ctx.fill(); };
  if (g.dusty) { ring(1, '#6a5a40'); ring(0.45, '#efe8d8'); ctx.restore(); return; }
  ring(1, e.why === 'blast' ? '#2a120a' : '#c89070'); ring(0.86, '#e2c27a'); ring(0.74, '#8e1c18');
  if (e.why !== 'blast') { ctx.fillStyle = 'rgba(200,60,60,0.6)'; ctx.beginPath(); ctx.arc(-r * 0.25, -r * 0.15, r * 0.3, 0, Math.PI * 2); ctx.fill(); }
  ctx.fillStyle = '#efe8d8'; ctx.beginPath(); ctx.arc(r * 0.12, 0, r * 0.34, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#a03a3a'; ctx.beginPath(); ctx.arc(r * 0.12, 0, r * 0.13, 0, Math.PI * 2); ctx.fill();
  if (e.why === 'torn') { ctx.strokeStyle = 'rgba(240,220,200,0.8)'; ctx.lineWidth = 0.7; for (let i = 0; i < 3; i++) { const a = R2() * Math.PI * 2; ctx.beginPath(); ctx.moveTo(Math.cos(a) * r * 0.5, Math.sin(a) * r * 0.3); ctx.quadraticCurveTo(Math.cos(a) * r * 1.2, Math.sin(a) * r * 0.9 + 2, Math.cos(a) * r * (1.3 + R2()), Math.sin(a) * r * 1.2 + 3); ctx.stroke(); } }
  ctx.restore();
}
function drawFingers(ctx, g, p) {
  const d = p.def, w = d.wh[0] * S, h = d.wh[1] * S, s = p.side || 1;
  ctx.strokeStyle = 'rgba(0,0,0,0.45)'; ctx.lineWidth = 0.7;
  for (let i = 1; i < 4; i++) { const x = -w / 2 + w * i / 4; ctx.beginPath(); ctx.moveTo(x, h * 0.05); ctx.lineTo(x, h / 2 - 0.5); ctx.stroke(); }
  /* the thumb, on the inside */
  ctx.fillStyle = g.dusty ? '#e8e0cc' : hsl(g.look.skin, G.flesh ? G.flesh.pale(g) : 0); ctx.strokeStyle = '#0b0806'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.ellipse(-s * w * 0.55, -h * 0.05, w * 0.18, h * 0.26, s * 0.4, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
}
function drawFace(ctx, g, p) {
  const r = p.def.r * S, dead = !g.alive, dm = g.dm || {}, out = dm.cons < 0.3 && !dead, br = g.br || {};
  const eye = br.eye || { x: 0, y: 0 }, lx = eye.x * r * 0.09, ly = eye.y * r * 0.09;
  const pain = dm.pain || 0, eyeOut = g.eyeOut || [0, 0];
  for (let e = 0; e < 2; e++) {
    const ex = (e ? 0.35 : -0.35) * r, ey = -0.15 * r;
    if (eyeOut[e]) { ctx.fillStyle = '#2a0000'; ctx.beginPath(); ctx.arc(ex, ey, r * 0.22, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#8a1010'; ctx.beginPath(); ctx.arc(ex + r * 0.05, ey + r * 0.06, r * 0.1, 0, Math.PI * 2); ctx.fill(); continue; }
    ctx.fillStyle = g.dusty ? '#1a1410' : '#fff'; ctx.beginPath(); ctx.arc(ex, ey, r * 0.22, 0, Math.PI * 2); ctx.fill();
    if (g.dusty) continue;
    ctx.strokeStyle = '#000'; ctx.lineWidth = 0.8; ctx.stroke();
    if (dead) { ctx.strokeStyle = '#111'; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(ex - r * 0.14, ey - r * 0.14); ctx.lineTo(ex + r * 0.14, ey + r * 0.14); ctx.moveTo(ex + r * 0.14, ey - r * 0.14); ctx.lineTo(ex - r * 0.14, ey + r * 0.14); ctx.stroke(); }
    else if (out) { ctx.strokeStyle = '#111'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(ex - r * 0.16, ey); ctx.lineTo(ex + r * 0.16, ey); ctx.stroke(); }
    else {
      const head = g.dm && g.dm.regions ? g.dm.regions.cranium : null, cross = head && head.organ > 0.25 ? (e ? -1 : 1) * r * 0.06 : 0;
      ctx.fillStyle = '#111'; ctx.beginPath(); ctx.arc(ex + lx + cross, ey + ly, r * (0.1 - (pain > 90 ? 0.03 : 0)), 0, Math.PI * 2); ctx.fill();
      if (pain > 60 || (head && head.ais >= 2)) { ctx.strokeStyle = 'rgba(200,30,30,0.6)'; ctx.lineWidth = 0.5; ctx.beginPath(); ctx.moveTo(ex - r * 0.2, ey); ctx.lineTo(ex - r * 0.08, ey + r * 0.03); ctx.moveTo(ex + r * 0.2, ey + r * 0.04); ctx.lineTo(ex + r * 0.1, ey); ctx.stroke(); }
    }
  }
  if (!dead && !g.dusty) { const k = clamp(pain / 80, 0, 1); ctx.strokeStyle = '#2a1a10'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(-r * 0.55, -r * 0.42 + k * r * 0.1); ctx.lineTo(-r * 0.18, -r * 0.42 - k * r * 0.12); ctx.moveTo(r * 0.55, -r * 0.42 + k * r * 0.1); ctx.lineTo(r * 0.18, -r * 0.42 - k * r * 0.12); ctx.stroke(); }
  /* the mouth: a scream opens it, pain holds it open, a dead man's hangs */
  const open = dead ? 0.5 : Math.max(g.mouth || 0, clamp(pain / 130, 0, 0.7), br.mode === 'getup' ? 0.35 : 0);
  ctx.fillStyle = '#2a0606'; ctx.beginPath(); ctx.ellipse(0, r * 0.45, r * (0.18 + open * 0.14), r * (0.05 + open * 0.26), 0, 0, Math.PI * 2); ctx.fill();
  if (open > 0.25 && !g.dusty) { ctx.fillStyle = '#f0ead8'; for (let i = 0; i < 4; i++) if (i >= (g.teeth || 0) / 1.5) ctx.fillRect(-r * 0.15 + i * r * 0.08, r * 0.45 - r * (0.05 + open * 0.26) + 0.3, r * 0.06, r * 0.08); }
  const face = g.dm && g.dm.regions ? g.dm.regions.face : null;
  if (!g.dusty && face && (face.ais >= 1 || (g.dm.regions.cranium.organ > 0.2))) { ctx.strokeStyle = '#7a0606'; ctx.lineWidth = 1.2 * S; ctx.beginPath(); ctx.moveTo(-r * 0.05, r * 0.15); ctx.lineTo(-r * 0.08, r * 0.38); if (face.ais >= 2) { ctx.moveTo(r * 0.12, r * 0.55); ctx.lineTo(r * 0.16, r * 0.85); } ctx.stroke(); }
  if (out && !dead) { const t = G.ms() / 300; ctx.fillStyle = '#ffe14a'; for (let i = 0; i < 3; i++) { const a = t + i * 2.09; ctx.beginPath(); ctx.arc(Math.cos(a) * r * 0.9, -r * 1.1 + Math.sin(a) * r * 0.25, 1.4, 0, Math.PI * 2); ctx.fill(); } }
}
function drawHat(ctx, r, col) { ctx.fillStyle = col; ctx.strokeStyle = '#000'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.ellipse(0, -r * 0.7, r * 1.55, r * 0.32, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-r * 0.75, -r * 0.75); ctx.quadraticCurveTo(-r * 0.85, -r * 1.75, -r * 0.2, -r * 1.55); ctx.quadraticCurveTo(0, -r * 1.35, r * 0.2, -r * 1.55); ctx.quadraticCurveTo(r * 0.85, -r * 1.75, r * 0.75, -r * 0.75); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.fillRect(-r * 0.75, -r * 0.95, r * 1.5, r * 0.18); }
R.hat = drawHat;
/* the round caps over each joint, so a bent elbow doesn't show a gap */
function drawCaps(ctx, g, layer) {
  for (const j of g.joints) {
    if (j.broken || j.b.gone || j.a.gone || j.id === 'neck') continue;
    if (j.b.def.layer !== layer) continue;
    const pv = G.body.pivot(j), w = Math.min(j.b.def.wh ? j.b.def.wh[0] : 8, j.a.def.wh ? j.a.def.wh[0] : 8) * S * 0.47;
    ctx.fillStyle = capColour(g, j.b, true); ctx.beginPath(); ctx.arc(pv.x, pv.y, w, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.35)'; ctx.lineWidth = 0.8; ctx.stroke();
  }
}
/* his neck: skin between his collar and his jaw */
function drawNeck(ctx, g) {
  const j = g.jointById.neck; if (!j || j.broken || g.parts.head.gone) return;
  const a = G.toWorld(g.parts.chest.body, 0, -7.5 * S), b = G.toWorld(g.parts.head.body, 0, 7.2 * S);
  ctx.strokeStyle = '#0b0806'; ctx.lineCap = 'round'; ctx.lineWidth = 6.6 * S; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
  ctx.strokeStyle = g.dusty ? '#e8e0cc' : hsl(g.look.skin, G.flesh ? G.flesh.pale(g) : 0); ctx.lineWidth = 6.6 * S - 2.6; ctx.stroke();
  const R0 = g.dm && g.dm.regions && g.dm.regions.neck;
  if (R0 && R0.lac > 0 && !g.dusty) { ctx.strokeStyle = '#6a0606'; ctx.lineWidth = 1.6 * S; ctx.beginPath(); ctx.moveTo(a.x - 2 * S, (a.y + b.y) / 2); ctx.lineTo(a.x + 2 * S, (a.y + b.y) / 2 + 1); ctx.stroke(); }
}
/* a soft shadow on the floor under anything of his that's near it */
function drawShadow(ctx, g) {
  const fy = G.floorY();
  for (const p of g.list) {
    if (p.gone || p.removed) continue;
    const b = p.body, d = fy - b.bounds.max.y; if (d > 90) continue;
    const k = 1 - Math.max(0, d) / 90, w = (b.bounds.max.x - b.bounds.min.x) * 0.6 + 4;
    ctx.fillStyle = `rgba(0,0,0,${0.22 * k})`; ctx.beginPath(); ctx.ellipse(b.position.x, fy - 1.5, w * (1.2 - k * 0.3), 3 + 2 * k, 0, 0, Math.PI * 2); ctx.fill();
  }
}

/* ------------------------------------------------------------ the whole frame */
G.draw = function (ctx) {
  ctx.save();
  if (G.blood) G.blood.drawFridges(ctx);
  if (G.gibs) G.gibs.draw(ctx);
  for (const g of G.guys) {
    if (g.cleared) continue;
    if (G.flesh) G.flesh.tick(g);
    const fade = g.gone ? Math.max(0, 1 - (G.ms() - g.gone) / (G.TUNE.fadeTime * 1000)) : 1;
    ctx.globalAlpha = fade;
    drawShadow(ctx, g);
    for (let layer = 0; layer <= 2; layer++) {
      if (layer === 1) drawNeck(ctx, g);
      drawCaps(ctx, g, layer);
      for (const p of g.list) if (!p.gone && !p.removed && p.def.layer === layer) drawPart(ctx, g, p);
    }
    ctx.globalAlpha = 1;
  }
  if (G.blood) G.blood.draw(ctx);
  if (G.tools && G.tools.drawFx) G.tools.drawFx(ctx);
  names(ctx);
  ctx.restore();
};
R.drawPart = drawPart;
/* names: the waiting guy keeps the page's own label (THE VENDOR borrows it), the extras get theirs drawn */
function names(ctx) {
  const nm = document.getElementById('guyName');
  const home = G.homeGuy ? G.homeGuy() : null;
  if (nm && !G.pageDead()) {
    if (home && !home.parts.head.gone && home.alive) { const hp = home.parts.head.body.position; nm.style.display = 'block'; nm.textContent = home.name; nm.style.left = (hp.x - 20) + 'px'; nm.style.top = (hp.y - 22 * S) + 'px'; }
    else nm.style.display = 'none';
  }
  ctx.font = '12px monospace'; ctx.textAlign = 'left';
  for (const g of G.guys) {
    if (g.cleared || !g.alive || g === home || g.parts.head.gone) continue;
    const hp = g.parts.head.body.position;
    ctx.fillStyle = 'rgba(0,0,0,0.7)'; ctx.fillText(g.name, hp.x - 19, hp.y - 22 * S + 13); ctx.fillStyle = '#fff'; ctx.fillText(g.name, hp.x - 20, hp.y - 22 * S + 12);
  }
}
})();
