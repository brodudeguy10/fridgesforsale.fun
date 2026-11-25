/* ============================================================
   TORTURE ROOM: blades.
   three of them, each its own way of opening him up. a razor takes
   skin off in strips and never gets past the fat. a scalpel draws
   a fine line that goes a layer deeper every time you draw it
   again. a knife slashes when you swing it and stabs when you
   click. every cut lands where the blade actually crossed him, in
   the part's own frame, and his damage model decides what was
   under it: an artery, the guts, a joint that comes apart.
============================================================ */
(function () {
  'use strict';
  var G = window.__G3, M = Matter, B = M.Body, Q = M.Query, R = window.TR_ROOM, T = TR.tools;
  var clamp = G.clamp, rnd = G.rnd, S = G.S;
  var trail = [], ang = 0, from = null, moved = 0, downAt = null;

  var KIND = {
    razor: { src: 'a straight razor', srcKind: 'razor', wound: 'slice', maxDepth: 2, deep: 1, painK: 0.7, bleedK: 0.55, cool: 0.09, spotR: 4.2, minV: 10, cutType: 'incised, shallow' },
    scalpel: { src: 'a scalpel', srcKind: 'scalpel', wound: 'cut', thin: 0.42, maxDepth: 4, deep: 1, boneK: 0.25, painK: 0.55, bleedK: 0.75, cool: 0.07, spotR: 2.4, minV: 3, cutType: 'incised' },
    knife: { src: 'a knife', srcKind: 'knife', wound: 'cut', maxDepth: 5, deep: 1, painK: 1, bleedK: 1, cool: 0.15, spotR: 3.2, minV: 60, cutType: 'incised' }
  };
  /* one stroke of a blade, from a to b: every part it crosses gets a cut where it crossed */
  function stroke(id, a, b, sp) {
    var K = KIND[id], len = Math.hypot(b.x - a.x, b.y - a.y); if (len < 0.8) return;
    var dir = { x: (b.x - a.x) / len, y: (b.y - a.y) / len }, now = G.t, seen = [];
    trail.push({ x: a.x, y: a.y, x2: b.x, y2: b.y, t: 0, id: id });
    if (sp < K.minV) return;
    var hits = Q.ray(T.guyBodies(), a, b, id === 'knife' ? 3 : 1.6);
    for (var i = 0; i < hits.length; i++) {
      var h = hits[i], body = h.bodyA.plugin && h.bodyA.plugin.part ? h.bodyA : h.bodyB, p = body.plugin && body.plugin.part;
      if (!p || seen.indexOf(p) >= 0) continue; seen.push(p);
      var ck = 'cut_' + id; if (now - (p[ck] || -9) < K.cool) continue; p[ck] = now;
      var g = p.guy, la = T.loc(p, a.x, a.y), lb = T.loc(p, b.x, b.y), hw = (p.def.wh ? p.def.wh[0] : p.def.r * 2) * S / 2, hh = (p.def.wh ? p.def.wh[1] : p.def.r * 2) * S / 2;
      var cl = function (v, m) { return clamp(v, -m, m); }, x1 = cl(la.x, hw), y1 = cl(la.y, hh), x2 = cl(lb.x, hw), y2 = cl(lb.y, hh);
      var mid = G.toWorld(p.body, (x1 + x2) / 2, (y1 + y2) / 2);
      var deep = id === 'knife' ? (sp > 420 ? 2 : 1) : 1;
      if (g.dm && !g.cleared) G.dmg.cut(g, p, { lx: (x1 + x2) / 2, ly: (y1 + y2) / 2, lx1: x1, ly1: y1, lx2: x2, ly2: y2, wx: mid.x, wy: mid.y, dir: dir, len: Math.max(5 * S, Math.hypot(x2 - x1, y2 - y1)),
        src: K.src, srcKind: K.srcKind, wound: K.wound, thin: K.thin, maxDepth: K.maxDepth, deep: deep, painK: K.painK, bleedK: K.bleedK, spotR: K.spotR, cutType: K.cutType, boneK: K.boneK, quiet: id !== 'knife' && Math.random() < 0.55 });
      G.emit('sfx', 'cut', { x: mid.x, part: p.kind });
      if (id === 'knife') B.setVelocity(p.body, { x: p.body.velocity.x + dir.x * 0.5, y: p.body.velocity.y + dir.y * 0.5 });
      if (p.kind === 'head' && id !== 'razor' && Math.random() < 0.12 && G.gibs) G.gibs.popEye(g, (x1 + x2) / 2 < 0 ? 0 : 1);
    }
    /* a blade across his guts cuts them loose */
    if (G.gibs && id !== 'razor') for (var j = 0; j < G.gibs.guts.length; j++) { var gt = G.gibs.guts[j]; if (gt.anchor && Q.ray(gt.links.slice(0, 2), a, b, 4).length) { try { M.World.remove(engine.world, gt.anchor); } catch (e) {} gt.anchor = null; var w = G.toWorld(gt.part.body, gt.la.x, gt.la.y); if (G.blood) G.blood.spray(w.x, w.y, 0, 0, 18, 3, Math.PI * 2, 1.4); G.emit('sfx', 'cut', { x: w.x }); } }
    if (TR.sfx) { if (id === 'razor' && Math.random() < 0.5) TR.sfx.scrape(clamp(sp / 400, 0.3, 1), b.x); if (id === 'knife' && sp > 300 && Math.random() < 0.35) TR.sfx.swish(clamp(sp / 900, 0.3, 1), b.x); }
  }
  /* a stab: the point straight in */
  function stab(x, y) {
    var p = T.partAt(x, y); if (!p) { if (TR.sfx) TR.sfx.swish(0.3, x); return; }
    var g = p.guy, l = T.loc(p, x, y);
    if (g.dm && !g.cleared) G.dmg.shot(g, p, { lx: l.x, ly: l.y, wx: x, wy: y, dir: { x: 0, y: -1 }, exit: false, size: 1.15, src: 'a knife', srcKind: 'stab', what: 'stab wound', energy: 120, boneK: 0.3, painK: 0.9, powder: false, boneWord: 'nicked by the blade' });
    if (TR.sfx) TR.sfx.play('knife', { x: x, gain: 0.5 });
    G.emit('sfx', 'cut', { x: x, part: p.kind });
    B.setVelocity(p.body, { x: p.body.velocity.x * 0.7, y: p.body.velocity.y * 0.7 + 0.4 });
  }

  function blade(id, name, help, vhelp) {
    T.add({ id: id, group: 'blades', name: name, help: help, variants: [{ id: 'normal', name: name, help: vhelp }], cursor: 'none',
      down: function (pt) { from = { x: pt.x, y: pt.y }; downAt = { x: pt.x, y: pt.y, t: performance.now() }; moved = 0; },
      move: function (pt, e, down) {
        var P = T.pointer, dx = P.x - (P.last ? P.last.x : P.x), dy = P.y - (P.last ? P.last.y : P.y);
        if (Math.hypot(dx, dy) > 0.3) { var na = Math.atan2(dy, dx), da = G.wrap(na - ang); ang += da * 0.35; }
        if (!down || !from) return;
        moved += Math.hypot(pt.x - from.x, pt.y - from.y);
        if (Math.hypot(pt.x - from.x, pt.y - from.y) >= (id === 'scalpel' ? 1 : 1.6)) { stroke(id, from, { x: pt.x, y: pt.y }, T.speed()); from = { x: pt.x, y: pt.y }; }
      },
      up: function (pt) { if (id === 'knife' && downAt && moved < 4 && performance.now() - downAt.t < 450) stab(pt.x, pt.y); from = null; downAt = null; },
      drawCursor: function (ctx, P) { drawBlade(ctx, id, P); }
    });
  }
  blade('razor', 'RAZOR', 'drag across him. it takes the skin off in strips, the fat shows; it never goes deeper than that.', 'pass over the same place again to take more.');
  blade('scalpel', 'SCALPEL', 'drag slowly for a fine incision. each pass along the same line goes one layer deeper: skin, fat, muscle, bone.', 'precise, thin, not much blood until it\'s deep.');
  blade('knife', 'KNIFE', 'swing it across him to slash (harder swings cut deeper). click without moving to stab.', 'deep enough at a joint and the limb comes off there.');

  /* ---------------- drawing */
  function drawBlade(ctx, id, P) {
    ctx.save(); ctx.translate(P.x, P.y); ctx.rotate(ang);
    if (id === 'razor') {
      ctx.fillStyle = '#c9ccc8'; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-13, -0.6); ctx.lineTo(-13, -3.6); ctx.lineTo(-1.4, -3.2); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.lineWidth = 0.35; ctx.beginPath(); ctx.moveTo(-0.4, -0.2); ctx.lineTo(-12.6, -0.7); ctx.stroke();
      ctx.fillStyle = '#2b2620'; ctx.save(); ctx.translate(-13, -2); ctx.rotate(-0.5); ctx.fillRect(-12, -1.3, 12, 2.6); ctx.restore();
    } else if (id === 'scalpel') {
      ctx.fillStyle = '#d8dbd8'; ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(-3, -2.6, -6, -1.6); ctx.lineTo(-6, 0.4); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#8f9390'; ctx.fillRect(-19, -1.1, 13, 1.8); ctx.fillStyle = 'rgba(0,0,0,0.3)'; for (var i = 0; i < 5; i++) ctx.fillRect(-17 + i * 2, -1.1, 0.5, 1.8);
    } else {
      ctx.fillStyle = '#b9bcb8'; ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(-6, -3.6, -14, -2.6); ctx.lineTo(-14, 1.2); ctx.lineTo(-3, 0.8); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.45)'; ctx.lineWidth = 0.35; ctx.beginPath(); ctx.moveTo(-1, -0.6); ctx.quadraticCurveTo(-6, -3, -13.5, -2.2); ctx.stroke();
      ctx.fillStyle = '#26221d'; ctx.fillRect(-15.5, -2.4, 1.5, 4.6); ctx.fillStyle = '#1c1916'; ctx.fillRect(-26, -1.5, 10.5, 3);
    }
    /* blood on the edge if it's been in him */
    var used = TR.bladeBlood && TR.bladeBlood[id]; if (used) { ctx.fillStyle = 'rgba(110,8,8,' + Math.min(0.85, used).toFixed(2) + ')'; ctx.fillRect(-8, -1.2, 7.5, 1.4); }
    ctx.restore();
  }
  function frame(dt) { for (var i = trail.length - 1; i >= 0; i--) { if (++trail[i].t > 7) trail.splice(i, 1); } }
  function drawOver(ctx) { for (var i = 0; i < trail.length; i++) { var t = trail[i]; ctx.strokeStyle = 'rgba(230,230,225,' + (0.35 * (1 - t.t / 7)).toFixed(3) + ')'; ctx.lineWidth = t.id === 'knife' ? 0.9 : 0.5; ctx.beginPath(); ctx.moveTo(t.x, t.y); ctx.lineTo(t.x2, t.y2); ctx.stroke(); } }
  TR.bladeBlood = {};
  G.on('wound', function (g, p, w) { if (w.type === 'slice') TR.bladeBlood.razor = Math.min(1, (TR.bladeBlood.razor || 0) + 0.15); else if (w.type === 'cut') { var id = T.cur ? T.cur.id : 'knife'; TR.bladeBlood[id] = Math.min(1, (TR.bladeBlood[id] || 0) + 0.2); } });
  T.mods.push({ id: 'blades', frame: frame, drawOver: drawOver, reset: function () { trail.length = 0; TR.bladeBlood = {}; } });
})();
