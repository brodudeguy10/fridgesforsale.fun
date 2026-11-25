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
const RES = (G.flesh && G.flesh.RES) || G.RES || 1;
/* a part's composite, centred on the part, at whatever resolution it was drawn */
const blit = (ctx, c) => ctx.drawImage(c, -c.width / (2 * RES), -c.height / (2 * RES), c.width / RES, c.height / RES);
const hsl = (a, k = 0) => `hsl(${a[0]},${a[1] * (1 - k * 0.75)}%,${a[2] + (84 - a[2]) * k * 0.45}%)`;
/* the base colour of what a part is wearing at a joint, for the caps that hide the seams */
function capColour(g, p, atTop) {
  if (g.dusty) return '#e8e0cc';
  const c = A.clothOf(g, p.kind), pale = G.flesh ? G.flesh.pale(g) : 0;
  if (p.kind === 'lleg' && !atTop && A.clothOf(g, 'foot') === 'boot') return g.look.boots;
  if (!c) return G.flesh ? G.flesh.skinCol(g) : hsl(g.look.skin, pale);
  return c === 'shirt' ? g.look.shirt : c === 'boot' ? g.look.boots : g.look.pants;
}
const dummy = g => g.look.style === 'dummy' && !g.dusty;

/* ------------------------------------------------------------ a part */
function drawPart(ctx, g, p) {
  const b = p.body, t = p.tex, d = p.def, pc = d.piece;
  ctx.save(); ctx.translate(b.position.x, b.position.y); ctx.rotate(b.angle);
  /* a piece of a limb broken in two: drawn in the whole limb's frame, only its own length of it */
  if (p.fo) ctx.translate(0, p.fo);
  ctx.save();
  if (pc) { const big = (d.wh[0] + d.wh[1]) * S * 2, y0 = Math.max(pc.y0, -big), y1 = Math.min(pc.y1, big); ctx.beginPath(); ctx.rect(-big, y0, big * 2, y1 - y0); ctx.clip(); }
  if (t) {
    /* a broken long bone that stayed inside (and didn't get a joint of its own, see body.js): it bends where it broke */
    const kink = !pc && !(p.guy.dm && p.guy.dm.regions[p.id] && p.guy.dm.regions[p.id].secJ) && t.frac.find(f => !f.out && f.bend);
    if (kink && A.LONG.has(p.kind)) {
      ctx.save(); ctx.beginPath(); ctx.rect(-t.cx, -t.cy, t.w, t.cy + kink.y); ctx.clip(); blit(ctx, t.comp); ctx.restore();
      ctx.save(); ctx.translate(0, kink.y); ctx.rotate(kink.bend * (g.alive ? 0.8 : 1)); ctx.translate(0, -kink.y); ctx.beginPath(); ctx.rect(-t.cx, kink.y, t.w, t.h); ctx.clip(); blit(ctx, t.comp); ctx.restore();
    } else blit(ctx, t.comp);
  } else { A.outline(ctx, d, S); ctx.fillStyle = '#c8a080'; ctx.fill(); }
  /* light from above, wherever above is for this part right now (or from wherever the page says its light is) */
  const Lt = G.lightAt ? G.lightAt(b.position.x, b.position.y) : null;
  const up = Lt ? G.dirLocal(b, Lt.x, Lt.y) : G.dirLocal(b, 0, -1), ext = (d.r || Math.max(d.wh[0], d.wh[1]) / 2) * S, lk = Lt ? Lt.k : 1;
  const gr = ctx.createLinearGradient(up.x * ext - up.y * ext * 0.4, up.y * ext + up.x * ext * 0.4, -up.x * ext, -up.y * ext);
  gr.addColorStop(0, `rgba(255,245,230,${0.16 * lk})`); gr.addColorStop(0.5, 'rgba(0,0,0,0)'); gr.addColorStop(1, `rgba(0,0,0,${Lt ? 0.26 + 0.2 * (1 - Math.min(1, lk)) : 0.26})`);
  ctx.save(); A.outline(ctx, d, S); ctx.clip(); ctx.fillStyle = gr; ctx.fillRect(-ext * 1.5, -ext * 1.5, ext * 3, ext * 3); ctx.restore();
  A.outline(ctx, d, S); ctx.strokeStyle = g.dusty ? '#3a3024' : dummy(g) ? 'rgba(14,8,6,0.62)' : '#0b0806'; ctx.lineWidth = dummy(g) ? 0.7 : 1.3; ctx.stroke();
  if (t) {
    /* closed fractures: a crease where it broke */
    for (const f of t.frac) if (!f.out) { ctx.strokeStyle = 'rgba(0,0,0,0.55)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(-d.wh[0] * S / 2, f.y); ctx.lineTo(0, f.y + 1.5); ctx.lineTo(d.wh[0] * S / 2, f.y - 1); ctx.stroke(); }
    /* compound: the bone out through the side */
    for (const f of t.frac) if (f.out) { ctx.fillStyle = '#efe8d8'; ctx.strokeStyle = '#7a0a0a'; ctx.lineWidth = 0.8; ctx.beginPath(); ctx.moveTo(-1.2 * S * f.side, f.y - 1.5 * S); ctx.lineTo(d.wh[0] * S * 0.9 * f.side, f.y - 3.4 * S); ctx.lineTo(d.wh[0] * S * 0.72 * f.side, f.y - 1.6 * S); ctx.lineTo(1.2 * S * f.side, f.y + 1.3 * S); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.fillStyle = '#9a1a1a'; ctx.fillRect(d.wh[0] * S * 0.72 * f.side - 0.8, f.y - 3.3 * S, 1.6, 1.2); }
    /* blood that runs out of what's open, downhill */
    if (!g.dusty) {
      const down = G.dirLocal(b, 0, 1), now = G.t, clip = dummy(g);
      /* close up (the torture room) the runs stay on his skin: past the edge of him they'd be lines hanging in the
         air, and what really leaves the edge is drops, which the blood code already makes */
      if (clip) { ctx.save(); A.outline(ctx, d, S); ctx.clip(); }
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
      if (clip) ctx.restore();
    }
  }
  ctx.restore();
  if (t) for (const e of t.ends) (dummy(g) ? drawEndReal : drawEnd)(ctx, e, g, p);
  if (p.kind === 'head') { if (dummy(g)) drawFaceReal(ctx, g, p); else drawFace(ctx, g, p); if (t && t.over) blit(ctx, t.over); if (g.hatOn && g.look.hat) drawHat(ctx, d.r * S, g.look.hatCol); }
  if (p.kind === 'hand') drawFingers(ctx, g, p);
  ctx.restore();
}
/* the cut end of a part: skin, fat, muscle in rings, the bone in the middle, the marrow in that *//* the cut end of a part: skin, fat, muscle in rings, the bone in the middle, the marrow in that */
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
/* the same, close up (the torture room): seen from the side, the cut face is a thin sliver, not a target. wet dark
   meat with the fat a thin line under a ragged lip of skin, and the bone standing proud of it, the marrow at its
   end. a clean cut (a blade, the saw) is flatter than a tear, and a tear trails strands */
function drawEndReal(ctx, e, g, p) {
  /* as wide as the narrower of the two parts that met there: the chest's end of a severed arm is an arm wide */
  const d = p.def, jd = A.jointById && A.jointById[e.joint], od = jd && A.byId[jd.a === p.id ? jd.b : jd.a];
  const wOf = q => q ? (q.wh ? q.wh[0] : q.r * 1.25) : 99, R2 = G.srand(e.seed);
  const r = (e.joint === 'neck' ? 7 : Math.min(wOf(d), wOf(od))) * S * 0.5;
  const out = Math.atan2(e.ny || (e.y < 0 ? -1 : 1), e.nx || 0);
  const torn = e.why === 'torn' || e.why === 'blast', ry = r * (torn ? 0.42 : 0.3), n = 14, rag = torn ? 0.3 : 0.08;
  ctx.save(); ctx.translate(e.x, e.y); ctx.rotate(out - Math.PI / 2);
  /* +y is outward from him now; the face lies along x */
  const lip = (k, yk, col) => { ctx.fillStyle = col; ctx.beginPath(); for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2, rr = k * (1 - rag * 0.5 + R2() * rag); ctx.lineTo(Math.cos(a) * r * rr, Math.sin(a) * ry * rr * yk); } ctx.closePath(); ctx.fill(); };
  lip(1.02, 1, e.why === 'blast' ? '#241008' : 'rgba(150,92,70,0.95)');
  lip(0.93, 0.92, '#b8995a');
  lip(0.88, 0.88, '#5e0d0a');
  /* the meat catches the light along its top edge */
  const gr = ctx.createLinearGradient(0, -ry, 0, ry); gr.addColorStop(0, 'rgba(190,60,50,0.55)'); gr.addColorStop(0.5, 'rgba(120,20,16,0.2)'); gr.addColorStop(1, 'rgba(20,0,0,0.5)');
  ctx.fillStyle = gr; ctx.beginPath(); ctx.ellipse(0, 0, r * 0.84, ry * 0.8, 0, 0, Math.PI * 2); ctx.fill();
  /* the bone: a stub past the face, off-centre, the marrow dark at the end */
  if (d.wh || p.kind === 'head') {
    const bw = r * (p.kind === 'chest' || p.kind === 'abdomen' || p.kind === 'pelvis' ? 0.42 : 0.36), bl = r * (torn ? 0.55 + R2() * 0.4 : 0.22), bx = r * (R2() - 0.5) * 0.25;
    ctx.fillStyle = '#ddd2bc'; ctx.strokeStyle = 'rgba(70,20,14,0.7)'; ctx.lineWidth = 0.45;
    ctx.beginPath(); ctx.moveTo(bx - bw / 2, -ry * 0.3);
    if (torn) { ctx.lineTo(bx - bw / 2, bl * 0.8); ctx.lineTo(bx - bw * 0.15, bl * 1.05); ctx.lineTo(bx + bw * 0.1, bl * 0.7); ctx.lineTo(bx + bw / 2, bl); } else { ctx.lineTo(bx - bw / 2, bl); ctx.lineTo(bx + bw / 2, bl); }
    ctx.lineTo(bx + bw / 2, -ry * 0.3); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#6a1a12'; ctx.beginPath(); ctx.ellipse(bx, bl * (torn ? 0.85 : 1), bw * 0.24, Math.max(0.35, bw * 0.12), 0, 0, Math.PI * 2); ctx.fill();
  }
  /* blood pooled on the face and running off its lower edge */
  ctx.fillStyle = 'rgba(70,3,3,0.55)'; ctx.beginPath(); ctx.ellipse(r * 0.1, ry * 0.25, r * 0.55, ry * 0.45, 0, 0, Math.PI * 2); ctx.fill();
  if (torn) { ctx.strokeStyle = 'rgba(150,40,34,0.85)'; ctx.lineWidth = 0.5; for (let i = 0; i < 3; i++) { const sx = (R2() - 0.5) * r * 1.4; ctx.beginPath(); ctx.moveTo(sx, ry * 0.4); ctx.quadraticCurveTo(sx + (R2() - 0.5) * 3, ry + 2, sx + (R2() - 0.5) * 4, ry + 2 + R2() * r * 0.8); ctx.stroke(); } }
  ctx.restore();
}
function drawFingers(ctx, g, p) {
  const d = p.def, w = d.wh[0] * S, h = d.wh[1] * S, s = p.side || 1;
  ctx.strokeStyle = 'rgba(0,0,0,0.45)'; ctx.lineWidth = 0.7;
  for (let i = 1; i < 4; i++) { const x = -w / 2 + w * i / 4; ctx.beginPath(); ctx.moveTo(x, h * 0.05); ctx.lineTo(x, h / 2 - 0.5); ctx.stroke(); }
  /* the thumb, on the inside */
  ctx.fillStyle = g.dusty ? '#e8e0cc' : G.flesh ? G.flesh.skinCol(g) : hsl(g.look.skin, 0); ctx.strokeStyle = dummy(g) ? 'rgba(14,8,6,0.6)' : '#0b0806'; ctx.lineWidth = dummy(g) ? 0.6 : 1;
  ctx.beginPath(); ctx.ellipse(-s * w * 0.55, -h * 0.05, w * 0.18, h * 0.26, s * 0.4, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  /* hands up: the palm toward you, its creases showing */
  const su = g.br && g.br.surr || 0;
  if (su > 0.3 && dummy(g)) {
    ctx.strokeStyle = `rgba(90,40,30,${(0.35 * su).toFixed(3)})`; ctx.lineWidth = 0.4;
    ctx.beginPath(); ctx.moveTo(-w * 0.38, -h * 0.12); ctx.quadraticCurveTo(0, -h * 0.02, w * 0.4, -h * 0.2);
    ctx.moveTo(-w * 0.4, h * 0.02); ctx.quadraticCurveTo(-w * 0.05, h * 0.1, w * 0.32, h * 0.0);
    ctx.moveTo(-s * w * 0.15, -h * 0.4); ctx.quadraticCurveTo(-s * w * 0.3, -h * 0.15, -s * w * 0.2, h * 0.1); ctx.stroke();
  }
}
/* the dummy's face: a person's, not a cartoon's. lids, irises, brows that move, a nose, a mouth that opens
   when he screams, lids half down and the eyes gone flat when he's dead */
function drawFaceReal(ctx, g, p) {
  const r = p.def.r * S, dead = !g.alive, dm = g.dm || {}, out = dm.cons < 0.3 && !dead, br = g.br || {};
  const pain = dm.pain || 0, k = clamp(pain / 90, 0, 1), eyeOut = g.eyeOut || [0, 0];
  const pale = G.flesh ? G.flesh.pale(g) : 0, skin = G.flesh ? G.flesh.skinCol(g) : hsl(g.look.skin, pale), skinDark = G.flesh ? G.flesh.skinCol(g, 14) : hsl([g.look.skin[0], g.look.skin[1], g.look.skin[2] - 14], pale), dk = G.flesh ? G.flesh.decay(g) : 0;
  const eye = br.eye || { x: 0, y: 0 }, gx = clamp(eye.x, -1, 1) * r * 0.05, gy = clamp(eye.y, -1, 1) * r * 0.035;
  const regs = g.dm && g.dm.regions, face = regs ? regs.face : null, cran = regs ? regs.cranium : null;
  const soft = 'rgba(14,8,6,0.6)';
  /* ears, at the sides, a fold inside each */
  for (const sd of [-1, 1]) {
    ctx.fillStyle = skin; ctx.strokeStyle = soft; ctx.lineWidth = 0.6;
    ctx.beginPath(); ctx.ellipse(sd * r * 0.97, r * 0.04, r * 0.16, r * 0.26, sd * 0.15, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = 'rgba(110,50,38,0.45)'; ctx.lineWidth = 0.5; ctx.beginPath(); ctx.ellipse(sd * r * 0.98, r * 0.05, r * 0.07, r * 0.15, sd * 0.15, sd > 0 ? -1.9 : 1.25, sd > 0 ? 1.9 : 5.0); ctx.stroke();
  }
  /* the sockets: a little shadow the eyes sit in */
  for (let e = 0; e < 2; e++) {
    const ex = (e ? 0.36 : -0.36) * r, ey = -0.12 * r;
    const sg = ctx.createRadialGradient(ex, ey, r * 0.05, ex, ey, r * 0.3); sg.addColorStop(0, `rgba(70,30,22,${(0.28 + dk * 0.4).toFixed(3)})`); sg.addColorStop(1, 'rgba(70,30,22,0)');
    ctx.fillStyle = sg; ctx.beginPath(); ctx.ellipse(ex, ey, r * 0.3, r * 0.22, 0, 0, Math.PI * 2); ctx.fill();
  }
  /* the eyes: white, iris, pupil, a wet glint; the upper lid comes down with pain, closes when he's out, sits
     half down and dull when he's dead */
  const lid = dead ? 0.58 : out ? 1 : clamp(0.22 + k * 0.38 + (br.mode === 'getup' ? 0.1 : 0), 0.2, 0.75);
  for (let e = 0; e < 2; e++) {
    const ex = (e ? 0.36 : -0.36) * r, ey = -0.12 * r, ew = r * 0.17, eh = r * 0.095;
    if (eyeOut[e]) {
      ctx.fillStyle = '#1a0101'; ctx.beginPath(); ctx.ellipse(ex, ey, ew * 1.05, eh * 1.25, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'rgba(140,16,16,0.85)'; ctx.beginPath(); ctx.ellipse(ex + ew * 0.15, ey + eh * 0.35, ew * 0.45, eh * 0.5, 0, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = 'rgba(110,8,8,0.8)'; ctx.lineWidth = 0.9; ctx.beginPath(); ctx.moveTo(ex, ey + eh); ctx.quadraticCurveTo(ex + 1, ey + r * 0.35, ex - 0.5, ey + r * 0.6); ctx.stroke();
      continue;
    }
    ctx.save(); ctx.beginPath(); ctx.ellipse(ex, ey, ew, eh, 0, 0, Math.PI * 2); ctx.clip();
    ctx.fillStyle = dead ? '#d8d2c6' : '#f1ece2'; ctx.fillRect(ex - ew, ey - eh, ew * 2, eh * 2);
    if (pain > 70 || (cran && cran.ais >= 2)) { ctx.strokeStyle = 'rgba(190,40,40,0.5)'; ctx.lineWidth = 0.35; ctx.beginPath(); ctx.moveTo(ex - ew, ey); ctx.lineTo(ex - ew * 0.45, ey + eh * 0.2); ctx.moveTo(ex + ew, ey - eh * 0.1); ctx.lineTo(ex + ew * 0.5, ey + eh * 0.15); ctx.stroke(); }
    const cross = cran && cran.organ > 0.25 && !dead ? (e ? -1 : 1) * r * 0.04 : 0, ix = ex + (dead ? 0 : gx) + cross, iy = ey + (dead ? eh * 0.2 : gy);
    ctx.fillStyle = dead ? '#5d5650' : '#4a3122'; ctx.beginPath(); ctx.arc(ix, iy, r * 0.072, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#120b08'; ctx.beginPath(); ctx.arc(ix, iy, r * (dead ? 0.045 : pain > 90 ? 0.022 : 0.033), 0, Math.PI * 2); ctx.fill();
    if (!dead) { ctx.fillStyle = 'rgba(255,255,255,0.8)'; ctx.beginPath(); ctx.arc(ix - r * 0.025, iy - r * 0.03, r * 0.017, 0, Math.PI * 2); ctx.fill(); }
    /* dead a while: the cornea clouds over, milky, the white of the eye going dull and brownish where it's open */
    if (dead && dk > 0) { ctx.fillStyle = `rgba(214,212,200,${Math.min(0.75, 0.2 + dk * 2.2).toFixed(3)})`; ctx.beginPath(); ctx.arc(ix, iy, r * 0.085, 0, Math.PI * 2); ctx.fill(); if (dk > 0.15) { ctx.fillStyle = `rgba(90,60,40,${Math.min(0.4, (dk - 0.15) * 1.2).toFixed(3)})`; ctx.fillRect(ex - ew, iy - eh * 0.1, ew * 2, eh * 0.5); } }
    /* the upper lid, skin, over the top of the eye */
    ctx.fillStyle = skin; ctx.fillRect(ex - ew, ey - eh, ew * 2, eh * 2 * lid);
    ctx.restore();
    /* the lid's edge and the crease above it */
    const ly = ey - eh + eh * 2 * lid;
    ctx.strokeStyle = 'rgba(30,14,10,0.8)'; ctx.lineWidth = 0.6; ctx.beginPath();
    if (lid >= 0.99) { ctx.moveTo(ex - ew, ey + eh * 0.1); ctx.quadraticCurveTo(ex, ey + eh * 0.55, ex + ew, ey + eh * 0.1); }
    else { ctx.moveTo(ex - ew, ey); ctx.quadraticCurveTo(ex, ly - eh * 0.15, ex + ew, ey); }
    ctx.stroke();
    ctx.strokeStyle = 'rgba(80,36,26,0.4)'; ctx.lineWidth = 0.45; ctx.beginPath(); ctx.moveTo(ex - ew * 0.9, ey - eh * 0.9); ctx.quadraticCurveTo(ex, ey - eh * 1.7, ex + ew * 0.9, ey - eh * 0.9); ctx.stroke();
    ctx.strokeStyle = 'rgba(80,36,26,0.3)'; ctx.beginPath(); ctx.moveTo(ex - ew * 0.8, ey + eh * 0.95); ctx.quadraticCurveTo(ex, ey + eh * 1.35, ex + ew * 0.8, ey + eh * 0.95); ctx.stroke();
  }
  /* brows: the inner ends go up and together when it hurts */
  if (!g.dusty) {
    ctx.strokeStyle = 'rgba(58,36,24,0.85)'; ctx.lineCap = 'round'; ctx.lineWidth = 1.1;
    for (const sd of [-1, 1]) { const inner = { x: sd * r * 0.14, y: -r * 0.36 - k * r * 0.08 }, mid = { x: sd * r * 0.34, y: -r * 0.42 + k * r * 0.02 }, outer = { x: sd * r * 0.55, y: -r * 0.35 + k * r * 0.06 }; ctx.beginPath(); ctx.moveTo(inner.x, inner.y); ctx.quadraticCurveTo(mid.x, mid.y - r * 0.03, outer.x, outer.y); ctx.stroke(); }
    if (k > 0.45 && !dead) { ctx.strokeStyle = 'rgba(80,36,26,0.35)'; ctx.lineWidth = 0.45; ctx.beginPath(); ctx.moveTo(-r * 0.04, -r * 0.4); ctx.lineTo(-r * 0.02, -r * 0.3); ctx.moveTo(r * 0.04, -r * 0.4); ctx.lineTo(r * 0.02, -r * 0.3); ctx.stroke(); }
  }
  /* the nose: a bridge in shadow down one side, the tip, the nostrils */
  ctx.strokeStyle = 'rgba(90,40,30,0.45)'; ctx.lineWidth = 0.6; ctx.beginPath(); ctx.moveTo(-r * 0.06, -r * 0.06); ctx.quadraticCurveTo(-r * 0.1, r * 0.12, -r * 0.13, r * 0.2); ctx.stroke();
  ctx.fillStyle = skinDark; ctx.beginPath(); ctx.ellipse(0, r * 0.22, r * 0.1, r * 0.055, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = 'rgba(40,14,10,0.7)'; for (const sd of [-1, 1]) { ctx.beginPath(); ctx.ellipse(sd * r * 0.055, r * 0.245, r * 0.03, r * 0.018, sd * 0.4, 0, Math.PI * 2); ctx.fill(); }
  /* the mouth: a scream opens it, pain holds it open, a dead man's hangs */
  const open = dead ? 0.45 : Math.max(g.mouth || 0, clamp(pain / 130, 0, 0.7), br.mode === 'getup' ? 0.3 : 0);
  const my = r * 0.47, mw = r * (0.2 + open * 0.08), mh = r * (0.02 + open * 0.2);
  if (open > 0.06) {
    ctx.fillStyle = '#2a0707'; ctx.beginPath(); ctx.ellipse(0, my, mw, mh, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#7a2a2a'; ctx.beginPath(); ctx.ellipse(0, my + mh * 0.55, mw * 0.6, mh * 0.35, 0, 0, Math.PI * 2); ctx.fill();
    if (open > 0.2) { ctx.save(); ctx.beginPath(); ctx.ellipse(0, my, mw, mh, 0, 0, Math.PI * 2); ctx.clip(); ctx.fillStyle = '#ece4d2'; const lost = g.teeth || 0; for (let i = 0; i < 6; i++) { if (i < lost * 1.5 && i % 2 === 0) continue; ctx.fillRect(-mw * 0.7 + i * mw * 0.24, my - mh, mw * 0.2, mh * 0.42); } ctx.restore(); }
    ctx.strokeStyle = dead ? (dk > 0.05 ? '#5a4c5a' : '#6a4048') : '#7a4038'; ctx.lineWidth = 0.9; ctx.beginPath(); ctx.ellipse(0, my, mw, mh, 0, 0, Math.PI * 2); ctx.stroke();
  } else {
    ctx.strokeStyle = dead ? (dk > 0.05 ? '#5a4c5a' : '#6a4048') : '#6a3830'; ctx.lineWidth = 0.9; ctx.beginPath(); ctx.moveTo(-mw, my); ctx.quadraticCurveTo(0, my + r * 0.03 - k * r * 0.05, mw, my); ctx.stroke();
    ctx.strokeStyle = 'rgba(110,60,50,0.35)'; ctx.lineWidth = 0.5; ctx.beginPath(); ctx.moveTo(-mw * 0.6, my + r * 0.09); ctx.quadraticCurveTo(0, my + r * 0.12, mw * 0.6, my + r * 0.09); ctx.stroke();
  }
  /* blood coming up from his chest: out of the corner of his mouth and down his chin */
  const mb = dm.mouthBlood || 0;
  if (mb > 0.05 && !g.dusty) {
    ctx.strokeStyle = `rgba(110,6,6,${(0.55 + 0.35 * mb).toFixed(2)})`; ctx.lineCap = 'round'; ctx.lineWidth = (0.6 + mb * 0.7) * S;
    const sx = -mw * 0.7; ctx.beginPath(); ctx.moveTo(sx, my + mh * 0.3); ctx.quadraticCurveTo(sx - r * 0.04, my + r * 0.25, sx - r * 0.02, my + r * (0.3 + mb * 0.25)); ctx.stroke();
    if (mb > 0.4) { ctx.beginPath(); ctx.moveTo(mw * 0.5, my + mh * 0.4); ctx.quadraticCurveTo(mw * 0.55, my + r * 0.2, mw * 0.45, my + r * (0.22 + mb * 0.18)); ctx.stroke(); }
    if (open > 0.06) { ctx.fillStyle = 'rgba(90,4,4,0.6)'; ctx.beginPath(); ctx.ellipse(0, my + mh * 0.3, mw * 0.8, mh * 0.6, 0, 0, Math.PI * 2); ctx.fill(); }
  }
  /* a nosebleed, and a split lip, once his face has been hit */
  if (face && (face.ais >= 1 || (cran && cran.organ > 0.2))) {
    ctx.strokeStyle = 'rgba(120,8,8,0.85)'; ctx.lineWidth = 0.8 * S; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-r * 0.055, r * 0.26); ctx.quadraticCurveTo(-r * 0.07, r * 0.36, -r * 0.09, my - mh * 0.5); ctx.stroke();
    if (face.ais >= 2) { ctx.beginPath(); ctx.moveTo(r * 0.12, my + mh); ctx.lineTo(r * 0.15, my + r * 0.38); ctx.stroke(); }
  }
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
    if (j.broken || j.b.gone || j.a.gone || j.id === 'neck' || j.section) continue;
    if (j.b.def.layer !== layer) continue;
    const pv = G.body.pivot(j), w = Math.min(j.b.def.wh ? j.b.def.wh[0] : 8, j.a.def.wh ? j.a.def.wh[0] : 8) * S * 0.47;
    ctx.fillStyle = capColour(g, j.b, true); ctx.beginPath(); ctx.arc(pv.x, pv.y, w, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = dummy(g) ? 'rgba(14,8,6,0.4)' : 'rgba(0,0,0,0.35)'; ctx.lineWidth = dummy(g) ? 0.6 : 0.8; ctx.stroke();
  }
}
/* a limb broken partway along, still on: the flesh across the break. whole round it, it's the limb bent where it
   shouldn't bend, swollen and dark there; cut most of the way round, it's a strap of skin and meat on the side the
   blade never reached, the cut faces either side of the gap with the bone's ends in them */
const TAPER = { uarm: [1, 0.82], larm: [1, 0.72], uleg: [1, 0.78], lleg: [0.98, 0.7] };
function halfW(d, y) { const tp = TAPER[d.kind] || [1, 1], h = d.wh[1] * S, u = G.clamp((y + h / 2) / h, 0, 1); return d.wh[0] * S / 2 * (tp[0] + (tp[1] - tp[0]) * u); }
function drawSection(ctx, g, j) {
  const pa = j.a, pb = j.b; if (pa.gone || pb.gone || pa.removed || pb.removed) return;
  const d = pa.def, ys = j.ys != null ? j.ys : j.la.y, hw = halfW(d, ys), soft = j.soft || 0, side = j.side || 1;
  const A1 = G.toWorld(pa.body, -hw, ys), A2 = G.toWorld(pa.body, hw, ys), B1 = G.toWorld(pb.body, -hw, ys), B2 = G.toWorld(pb.body, hw, ys);
  const skin = g.dusty ? '#e8e0cc' : G.flesh ? G.flesh.skinCol(g) : hsl(g.look.skin, 0), line = dummy(g) ? 'rgba(14,8,6,0.62)' : '#0b0806';
  const lerp = (P, Q, k) => ({ x: P.x + (Q.x - P.x) * k, y: P.y + (Q.y - P.y) * k });
  ctx.save(); ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  if (soft < 0.35) {
    /* whole round it: the skin bridges the bend, swollen, bruising */
    const mA = lerp(A1, A2, 0.5), mB = lerp(B1, B2, 0.5), nx = (A2.x - A1.x) / (2 * hw), ny = (A2.y - A1.y) / (2 * hw), sw = (1.2 + (j.frac || 2) * 0.35) * S;
    ctx.beginPath(); ctx.moveTo(A1.x, A1.y); ctx.lineTo(A2.x, A2.y);
    ctx.quadraticCurveTo((A2.x + B2.x) / 2 + nx * sw, (A2.y + B2.y) / 2 + ny * sw, B2.x, B2.y); ctx.lineTo(B1.x, B1.y);
    ctx.quadraticCurveTo((A1.x + B1.x) / 2 - nx * sw, (A1.y + B1.y) / 2 - ny * sw, A1.x, A1.y); ctx.closePath();
    ctx.fillStyle = skin; ctx.fill();
    if (!g.dusty) { const c = lerp(mA, mB, 0.5), gr = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, hw * 1.5); gr.addColorStop(0, 'rgba(70,20,40,0.45)'); gr.addColorStop(0.6, 'rgba(90,30,50,0.22)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = gr; ctx.fill(); }
    ctx.strokeStyle = line; ctx.lineWidth = dummy(g) ? 0.7 : 1.3;
    ctx.beginPath(); ctx.moveTo(A2.x, A2.y); ctx.quadraticCurveTo((A2.x + B2.x) / 2 + nx * sw, (A2.y + B2.y) / 2 + ny * sw, B2.x, B2.y); ctx.moveTo(A1.x, A1.y); ctx.quadraticCurveTo((A1.x + B1.x) / 2 - nx * sw, (A1.y + B1.y) / 2 - ny * sw, B1.x, B1.y); ctx.stroke();
    ctx.restore(); return;
  }
  /* most of the way through: what's left holding it is on the far side from where the blade came in */
  const keep = Math.max(0.12, 1 - soft), Aout = side > 0 ? A1 : A2, Aoth = side > 0 ? A2 : A1, Bout = side > 0 ? B1 : B2, Both = side > 0 ? B2 : B1;
  const Ain = lerp(Aout, Aoth, keep), Bin = lerp(Bout, Both, keep);
  /* the strap: meat inside, skin on the outside of it */
  ctx.beginPath(); ctx.moveTo(Aout.x, Aout.y); ctx.lineTo(Ain.x, Ain.y); ctx.lineTo(Bin.x, Bin.y); ctx.lineTo(Bout.x, Bout.y); ctx.closePath();
  ctx.fillStyle = g.dusty ? '#8a7a60' : '#6a0f0c'; ctx.fill();
  ctx.strokeStyle = skin; ctx.lineWidth = 1.1 * S; ctx.beginPath(); ctx.moveTo(Aout.x, Aout.y); ctx.lineTo(Bout.x, Bout.y); ctx.stroke();
  ctx.strokeStyle = line; ctx.lineWidth = dummy(g) ? 0.6 : 1.1; ctx.stroke();
  /* the cut faces either side of the gap: the meat, the fat under the skin at the edge, the bone's end standing out of it */
  for (const [P0, P1, body, dir] of [[Ain, Aoth, pa.body, 1], [Bin, Both, pb.body, -1]]) {
    const fn = G.dirWorld(body, 0, dir), fx = fn.x * 1.1 * S, fy = fn.y * 1.1 * S;
    ctx.beginPath(); ctx.moveTo(P0.x, P0.y); ctx.lineTo(P1.x, P1.y); ctx.lineTo(P1.x + fx * 0.6, P1.y + fy * 0.6); ctx.lineTo(P0.x + fx, P0.y + fy); ctx.closePath();
    ctx.fillStyle = g.dusty ? '#6a5a40' : '#5e0d0a'; ctx.fill();
    ctx.fillStyle = 'rgba(160,40,32,0.45)'; ctx.beginPath(); ctx.moveTo(P0.x + fx * 0.3, P0.y + fy * 0.3); ctx.lineTo(P1.x + fx * 0.2, P1.y + fy * 0.2); ctx.lineTo(P1.x + fx * 0.45, P1.y + fy * 0.45); ctx.lineTo(P0.x + fx * 0.7, P0.y + fy * 0.7); ctx.closePath(); ctx.fill();
    if ((j.cutB || 0) >= 1 || (j.frac || 0) >= 2) {
      const bc = G.toWorld(body, d.kind === 'larm' ? 0 : 0.2 * S * (d.side || 1), ys), bw = (d.kind === 'uleg' ? 1.1 : d.kind === 'uarm' ? 0.95 : 0.8) * S, ex = fn.x * (1.4 + (j.frac >= 3 ? 1 : 0)) * S, ey = fn.y * (1.4 + (j.frac >= 3 ? 1 : 0)) * S, tx = -fn.y * bw, ty = fn.x * bw;
      ctx.fillStyle = '#ddd2bc'; ctx.strokeStyle = 'rgba(70,20,14,0.7)'; ctx.lineWidth = 0.45;
      ctx.beginPath(); ctx.moveTo(bc.x - tx, bc.y - ty); ctx.lineTo(bc.x - tx + ex, bc.y - ty + ey); ctx.lineTo(bc.x + ex * (j.frac >= 3 ? 0.6 : 1), bc.y + ey * (j.frac >= 3 ? 0.6 : 1)); ctx.lineTo(bc.x + tx + ex, bc.y + ty + ey); ctx.lineTo(bc.x + tx, bc.y + ty); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#6a1a12'; ctx.beginPath(); ctx.arc(bc.x + ex * 0.95, bc.y + ey * 0.95, bw * 0.35, 0, Math.PI * 2); ctx.fill();
    }
  }
  ctx.restore();
}
/* his neck: skin between his collar and his jaw */
function drawNeck(ctx, g) {
  const j = g.jointById.neck; if (!j || j.broken || g.parts.head.gone) return;
  const a = G.toWorld(g.parts.chest.body, 0, -7.5 * S), b = G.toWorld(g.parts.head.body, 0, 7.2 * S), dm = dummy(g);
  ctx.strokeStyle = dm ? 'rgba(14,8,6,0.62)' : '#0b0806'; ctx.lineCap = 'round'; ctx.lineWidth = (dm ? 5.6 : 6.6) * S; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
  ctx.strokeStyle = g.dusty ? '#e8e0cc' : G.flesh ? G.flesh.skinCol(g) : hsl(g.look.skin, 0); ctx.lineWidth = (dm ? 5.6 : 6.6) * S - (dm ? 1.4 : 2.6); ctx.stroke();
  /* close up: the shadow under the jaw and a tendon down each side */
  if (dm) { ctx.strokeStyle = 'rgba(60,25,18,0.22)'; ctx.lineWidth = 0.6; const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2; ctx.beginPath(); ctx.moveTo(b.x - 2.2 * S, b.y + 0.5); ctx.lineTo(mx - 1.2 * S, my + 2); ctx.moveTo(b.x + 2.2 * S, b.y + 0.5); ctx.lineTo(mx + 1.2 * S, my + 2); ctx.stroke(); }
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
      for (const j of g.joints) if (j.section && !j.broken && j.a.def.layer === layer) drawSection(ctx, g, j);
      if (G.skin) { G.skin.creases(ctx, g, layer); G.skin.draw(ctx, g, layer); }
    }
    ctx.globalAlpha = 1;
  }
  if (G.gibs && G.gibs.drawFront) G.gibs.drawFront(ctx);
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
    if (g.cleared || !g.alive || g === home || g.parts.head.gone || g.look.noName) continue;
    const hp = g.parts.head.body.position;
    ctx.fillStyle = 'rgba(0,0,0,0.7)'; ctx.fillText(g.name, hp.x - 19, hp.y - 22 * S + 13); ctx.fillStyle = '#fff'; ctx.fillText(g.name, hp.x - 20, hp.y - 22 * S + 12);
  }
}
})();
