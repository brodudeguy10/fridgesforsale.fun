/* ============================================================
   TORTURE ROOM: the frame.
   his condition in the corner (a map of him coloured by how badly
   each part is hurt, his blood, his pain, whether he's still with
   you), the palette along the bottom on a solid bar, the selected
   tool's variants and settings under it, pause/reset/exit, the
   pause menu with the volumes and the controls, and the keys.
============================================================ */
(function () {
  'use strict';
  var G = window.__G3, R = window.TR_ROOM, T = TR.tools;
  var clamp = G.clamp;
  var ui = TR.ui = {};
  var root = document.getElementById('tr-ui');
  var SET = { dock: true, quality: 1, blood: 1 };
  try { var sv = JSON.parse(localStorage.getItem('ffs_torture_settings') || '{}'); if (sv.ui) Object.assign(SET, sv.ui); } catch (e) {}
  function save() { try { var s = JSON.parse(localStorage.getItem('ffs_torture_settings') || '{}'); s.ui = SET; localStorage.setItem('ffs_torture_settings', JSON.stringify(s)); } catch (e) {} }
  TR.quality = SET.quality;
  G.TUNE.sprayAll = SET.blood ? 1 : 0.45;
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }

  /* ---------------- icons: thin line drawings, one per tool */
  var IC = {
    hand: '<path d="M8 13V6.5a1.3 1.3 0 0 1 2.6 0V12M10.6 11V4.8a1.3 1.3 0 0 1 2.6 0V11M13.2 11V5.6a1.3 1.3 0 0 1 2.6 0V11.5M15.8 11.5V7.6a1.3 1.3 0 0 1 2.6 0v6.2c0 3.6-2.4 6.2-6 6.2-2.6 0-4.1-1.3-5.4-3.4L5 13.4a1.3 1.3 0 0 1 2.1-1.5L8 13"/>',
    rope: '<path d="M4 4c3 0 3 3 6 3s3-3 6-3M4 4v0"/><path d="M10 7c-1 4 2 6 1 9s-3 4-2 5"/><circle cx="9" cy="20" r="1.6"/><path d="M5 9c2 1 3 0 5-2M15 9c-2 1-3 0-5-2"/>',
    chain: '<rect x="8" y="2" width="6" height="7" rx="3"/><rect x="9.5" y="7.5" width="3" height="7" rx="1.5"/><rect x="8" y="13" width="6" height="7" rx="3"/>',
    pistol: '<path d="M3 7h16v4H9l-1 1v6H4l1-7-2-1z"/><path d="M9 11c0 2 2 2 2 0"/>',
    shotgun: '<path d="M1 9h20v2.4H11v1.4H8l-1 1-3.5 2.6L2 14l3-3H1z"/><path d="M13 11.4h5"/>',
    rifle: '<path d="M1 10h12V8h3v2h6v2h-9l1 5h-2l-1.5-5H9l-3 2.5H2l2-2.5H1z"/><path d="M8 8h3"/>',
    razor: '<path d="M3 15l11-9 3 1-11 9z"/><path d="M14 6l6-2-1 3"/>',
    scalpel: '<path d="M2 18l10-8"/><path d="M12 10c3-3 6-4 8-4-1 2-3 4-7 6z"/>',
    knife: '<path d="M2 20l6-6"/><path d="M8 14l3 3"/><path d="M9.5 15.5L20 4c-1 5-4 9-8.5 12.5"/>',
    chainsaw: '<rect x="2" y="9" width="7" height="7" rx="1.5"/><path d="M9 11h11a2 2 0 0 1 0 4H9"/><path d="M4 9c0-3 4-3 4 0"/><path d="M11 11v-1M14 11v-1M17 11v-1M11 15v1M14 15v1M17 15v1"/>',
    spike: '<path d="M11 2l3 16H8z"/><path d="M5 18h12v3H5z"/>',
    nail: '<rect x="2" y="7" width="12" height="6" rx="1"/><path d="M6 13v6h4v-6M14 9h4M18 7.5v4"/><path d="M19 9.5h3"/>',
    staple: '<path d="M3 8h13l3 3H3z"/><path d="M6 11v6h4v-6"/><path d="M15 15v3h4v-3"/>'
  };

  /* ---------------- build */
  var cond = el('div', null); cond.id = 'tr-cond';
  cond.innerHTML = '<div class="nm"><b class="who">SUBJECT 1</b><span class="iss"></span></div><div class="st">conscious</div>' +
    '<div class="row"><canvas class="map" width="116" height="208" aria-label="where he\'s hurt"></canvas><div class="bars">' +
    '<div class="bar">BLOOD<i class="b-blood"></i></div><div class="bar">PAIN<i class="b-pain"></i></div><div class="bar">AWARE<i class="b-cons"></i></div><div class="worst"></div></div></div>' +
    '<button class="xr" type="button" disabled title="after he\'s dead">X-RAY ▸</button>';
  root.appendChild(cond);
  var top = el('div'); top.id = 'tr-top';
  top.innerHTML = '<button class="tb" data-a="help" title="controls (Esc)">?</button><button class="tb" data-a="pause" title="pause (Esc)"><b>❚❚</b><span> PAUSE</span></button><button class="tb" data-a="reset" title="reset the room"><b>↺</b><span> RESET</span></button><button class="tb red" data-a="exit" title="back to the fridges"><b>✕</b><span> EXIT</span></button>';
  root.appendChild(top);
  var toastEl = el('div'); toastEl.id = 'tr-toast'; root.appendChild(toastEl);
  var dock = el('div'); dock.id = 'tr-dock'; var pal = el('div'); pal.id = 'tr-pal'; var info = el('div'); info.id = 'tr-info';
  dock.appendChild(pal); dock.appendChild(info); root.appendChild(dock);
  if (!SET.dock) dock.classList.add('hid');
  T.groups.forEach(function (gr) {
    var tools = T.list.filter(function (t) { return t.group === gr.id; }); if (!tools.length) return;
    var g = el('div', 'grp'); g.innerHTML = '<div class="gl"><kbd>' + gr.key + '</kbd>' + gr.name + '</div>'; var gb = el('div', 'gb');
    tools.forEach(function (t) { var b = el('button', 'tool', '<svg viewBox="0 0 22 22">' + (IC[t.id] || '') + '</svg><span>' + t.name + '</span>'); b.type = 'button'; b.dataset.tool = t.id; b.title = t.name + ': ' + t.help; b.onclick = function () { T.select(t.id); }; gb.appendChild(b); });
    g.appendChild(gb); pal.appendChild(g);
  });
  /* the pause menu */
  var pause = el('div'); pause.id = 'tr-pause';
  pause.innerHTML = '<div class="box" role="dialog" aria-label="paused"><h2>PAUSED</h2>' +
    '<div class="btns"><button data-a="resume">RESUME</button><button data-a="restart">RESTART SCENE</button><button data-a="fs">FULLSCREEN</button><button data-a="exit">EXIT ROOM</button></div>' +
    '<div class="sec">SOUND</div>' +
    ['master', 'fx', 'amb', 'voice'].map(function (k) { return '<div class="sl"><span>' + { master: 'MASTER', fx: 'EFFECTS', amb: 'AMBIENT', voice: 'HIS VOICE' }[k] + '</span><input type="range" min="0" max="100" data-v="' + k + '"><output></output></div>'; }).join('') +
    '<div class="sec">GRAPHICS</div><div class="opt"><label><input type="checkbox" data-o="quality"> light in the air (dust, the cone)</label><label><input type="checkbox" data-o="blood"> full blood detail (off: about half the drops, for a slow computer)</label></div>' +
    '<div class="sec">GAME</div><div class="opt"><label><input type="checkbox" data-o="inf"> infinite ammo</label><label><input type="checkbox" data-o="dock"> show the palette (T)</label></div>' +
    '<div class="sec">CONTROLS</div><table>' +
    [['left mouse', 'use the tool'], ['right mouse (hold)', 'the hand, whatever tool you have'], ['shift + click', 'take out the spike, nail, staple or rope under the cursor'], ['mouse wheel', 'rope: longer or shorter · spike: turn it · chainsaw: turn the bar'], ['W / E', 'previous / next tool'], ['S / D', 'previous / next variant'], ['1 to 7', 'tool groups'], ['R', 'reload'], ['T', 'show or hide the palette'], ['F', 'fullscreen'], ['Delete', 'remove what\'s under the cursor'], ['Esc', 'pause, or cancel a rope or staple halfway']].map(function (r) { return '<tr><td>' + r[0] + '</td><td>' + r[1] + '</td></tr>'; }).join('') +
    '</table><div class="foot">he\'s a dummy: nobody in particular. nothing you do in here leaves this room.<br>some words do things if you type them on this screen.</div></div>';
  root.appendChild(pause);

  /* ---------------- the buttons */
  function act(a) {
    if (a === 'pause') ui.pause(true);
    else if (a === 'resume') ui.pause(false);
    else if (a === 'help') ui.pause(true, true);
    else if (a === 'reset' || a === 'restart') { ui.pause(false); TR.reset(); }
    else if (a === 'fs') ui.fullscreen();
    else if (a === 'exit') ui.exit();
  }
  top.addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) act(b.dataset.a); });
  pause.addEventListener('click', function (e) { var b = e.target.closest('button'); if (b && b.dataset.a) act(b.dataset.a); if (e.target === pause) ui.pause(false); });
  cond.querySelector('.xr').onclick = function () { var g = TR.subject; if (g && g.case && G.recap) { G.recap.open(g.case); } };
  var overX = false;
  cond.querySelector('.xr').addEventListener('pointerenter', function () { overX = true; cond.classList.remove('under'); });
  cond.querySelector('.xr').addEventListener('pointerleave', function () { overX = false; });
  pause.querySelectorAll('input[type=range]').forEach(function (r) {
    var k = r.dataset.v; r.value = Math.round(TR.vol[k] * 100); r.nextElementSibling.textContent = r.value;
    r.oninput = function () { TR.vol[k] = r.value / 100; r.nextElementSibling.textContent = r.value; if (TR.sfx) { TR.sfx.vol(); TR.sfx.save(); } };
  });
  pause.querySelectorAll('input[type=checkbox]').forEach(function (c) {
    var o = c.dataset.o; c.checked = o === 'inf' ? !!(TR.ammo && TR.ammo.inf) : !!SET[o];
    c.onchange = function () {
      if (o === 'inf') { TR.setInfAmmo(c.checked); return; }
      SET[o] = c.checked ? 1 : 0; save();
      if (o === 'quality') TR.quality = SET.quality;
      if (o === 'blood') G.TUNE.sprayAll = SET.blood ? 1 : 0.45;
      if (o === 'dock') { dock.classList.toggle('hid', !SET.dock); TR.fit(); }
    };
  });

  ui.pause = function (on, help) {
    TR.paused = !!on; pause.classList.toggle('on', TR.paused);
    if (on) { var c = pause.querySelector('input[data-o=inf]'); if (c) c.checked = !!(TR.ammo && TR.ammo.inf); if (help) pause.querySelector('table').scrollIntoView({ block: 'nearest' }); }
    top.querySelector('[data-a=pause]').innerHTML = on ? '<b>▶</b><span> RESUME</span>' : '<b>❚❚</b><span> PAUSE</span>';
    try { var a = window.TR_AUDIO; if (a) { if (on) a.ctx.suspend(); else a.ctx.resume(); } } catch (e) {}
  };
  ui.fullscreen = function () {
    var d = document, de = d.documentElement;
    try { if (d.fullscreenElement || d.webkitFullscreenElement) (d.exitFullscreen || d.webkitExitFullscreen).call(d); else (de.requestFullscreen || de.webkitRequestFullscreen).call(de); } catch (e) {}
  };
  ui.exit = function () {
    try { if (window.TR_AUDIO) window.TR_AUDIO.ctx.suspend(); } catch (e) {}
    if (window.parent && window.parent !== window) window.parent.postMessage({ torture: 'exit' }, '*');
    else location.href = '../';
  };
  var toastT = 0;
  ui.toast = function (msg) { toastEl.textContent = msg; toastEl.classList.add('on'); toastT = 2.2; };
  ui.reserved = function () { return { top: 0, bottom: SET.dock ? dock.getBoundingClientRect().height : 0 }; };

  /* ---------------- the selected tool */
  ui.onTool = function () {
    var d = T.cur; if (!d) return;
    pal.querySelectorAll('.tool').forEach(function (b) { b.classList.toggle('on', b.dataset.tool === d.id); });
    var vi = T.variant[d.id], v = d.variants[vi];
    var html = '<span class="tn">' + (T.pointer.right ? 'HAND (right mouse)' : d.name) + '</span>';
    if (d.variants.length > 1) html += '<span class="vs">' + d.variants.map(function (x, i) { return '<button type="button" class="vb' + (i === vi ? ' on' : '') + '" data-i="' + i + '" title="' + x.help.replace(/"/g, '&quot;') + '">' + x.name + '</button>'; }).join('') + '</span>';
    html += '<span class="hp">' + d.help + (v && v.help ? ' <span style="color:var(--ink3)">' + v.help + '</span>' : '') + '</span>';
    html += '<span class="set">' + settings(d) + '</span><span class="keys">W/E tool · S/D variant · T palette · Esc pause</span>';
    info.innerHTML = html;
    info.querySelectorAll('.vb').forEach(function (b) { b.onclick = function () { T.setVariant(+b.dataset.i); }; });
    wire(d);
    requestAnimationFrame(function () { if (TR.fit) TR.fit(); });
  };
  function settings(d) {
    if (d.id === 'rope' || d.id === 'chain') { var r = TR.ropeApi.sel(), k = TR.ropeSettings.tension[d.id]; return '<label title="how hard it pulls once it\'s taut">TENSION <input type="range" min="10" max="100" value="' + Math.round(k * 100) + '" data-s="tension"></label>' + (r ? '<button type="button" class="vb" data-s="short">− LENGTH</button><button type="button" class="vb" data-s="long">+ LENGTH</button>' : '') + '<button type="button" class="vb" data-s="clear">CLEAR ALL (' + TR.ropeApi.count() + ')</button>'; }
    if (d.group === 'guns') { var s = TR.gunState && TR.gunState(); return '<span class="ammo">' + (s ? (s.inf ? '∞' : s.reloading ? 'RELOADING' : s.n + ' / ' + s.mag) : '') + '</span><button type="button" class="vb" data-s="reload">RELOAD (R)</button><label><input type="checkbox" data-s="inf"' + (TR.ammo.inf ? ' checked' : '') + '> ∞ AMMO</label>'; }
    if (d.id === 'spike') return '<button type="button" class="vb" data-s="clearSpikes">CLEAR SPIKES (' + TR.spikeApi.count() + ')</button>';
    if (d.id === 'nail') return '<button type="button" class="vb" data-s="clearNails">PULL ALL (' + TR.nailApi.count() + ')</button>';
    if (d.id === 'staple') return '<button type="button" class="vb" data-s="clearStaples">REMOVE ALL (' + TR.stapleApi.count() + ')</button>';
    if (d.id === 'chainsaw') return '<span class="sawst">' + sawWord() + '</span>';
    return '';
  }
  function sawWord() { var s = TR.saw; return s.state === 'off' ? 'ENGINE OFF' : s.state === 'crank' ? 'PULLING THE CORD' : s.thr > 0.5 ? 'FLAT OUT' : 'IDLING'; }
  function wire(d) {
    var q = function (s) { return info.querySelector('[data-s=' + s + ']'); };
    var t = q('tension'); if (t) t.oninput = function () { TR.ropeApi.tension(d.id, t.value / 100); };
    var a = q('short'); if (a) a.onclick = function () { TR.ropeApi.adjust(-1); };
    a = q('long'); if (a) a.onclick = function () { TR.ropeApi.adjust(1); };
    a = q('clear'); if (a) a.onclick = function () { TR.ropeApi.clear(); ui.onTool(); };
    a = q('reload'); if (a) a.onclick = function () { TR.reloadGun(); };
    a = q('inf'); if (a) a.onchange = function () { TR.setInfAmmo(a.checked); };
    a = q('clearSpikes'); if (a) a.onclick = function () { TR.spikeApi.clear(); ui.onTool(); };
    a = q('clearNails'); if (a) a.onclick = function () { TR.nailApi.clear(); ui.onTool(); };
    a = q('clearStaples'); if (a) a.onclick = function () { TR.stapleApi.clear(); ui.onTool(); };
  }
  ui.onAmmo = function () { var d = T.cur; if (!d || d.group !== 'guns') return; var s = TR.gunState(), e = info.querySelector('.ammo'); if (e && s) e.textContent = s.inf ? '∞' : s.reloading ? 'RELOADING' : s.n + ' / ' + s.mag; };
  ui.onReset = function () { lastHash = ''; mapDirty = true; cond.querySelector('.who').textContent = (TR.subject ? TR.subject.name : 'SUBJECT').toUpperCase(); if (T.cur) ui.onTool(); };

  /* ---------------- his condition */
  var AIS_COL = ['#2a2c2e', '#8f7a3a', '#c79a34', '#f0b33a', '#ff7a2e', '#ff3b2f', '#ffe8f0'];
  var AIS_NAME = ['uninjured', 'minor', 'moderate', 'serious', 'severe', 'critical', 'maximal'];
  var MAP = { head: [29, 11, 8], chest: [20, 21, 18, 18], abdomen: [21, 39, 16, 11], pelvis: [20, 50, 18, 9],
    uarmR: [12, 22, 7, 16], larmR: [11, 39, 6, 14], handR: [11, 54, 6, 6], uarmL: [39, 22, 7, 16], larmL: [41, 39, 6, 14], handL: [41, 54, 6, 6],
    ulegR: [21, 60, 7, 20], llegR: [21, 81, 6, 15], footR: [19, 97, 8, 4], ulegL: [30, 60, 7, 20], llegL: [31, 81, 6, 15], footL: [31, 97, 8, 4] };
  var mapCv = cond.querySelector('.map'), mx = mapCv.getContext('2d'), lastHash = '', mapDirty = true, condT = 0;
  function drawMap(g) {
    mx.setTransform(2, 0, 0, 2, 0, 0); mx.clearRect(0, 0, 58, 104);
    var best = {};
    if (g && g.dm) for (var k in g.dm.regions) { var r = g.dm.regions[k], pid = r.def.part; best[pid] = Math.max(best[pid] || 0, r.ais || 0); }
    for (var id in MAP) {
      var m = MAP[id], p = g && g.parts[id], gone = !p || p.gone || !p.attached, a = best[id] || 0;
      mx.beginPath(); if (m.length === 3) mx.arc(m[0], m[1], m[2], 0, Math.PI * 2); else mx.rect(m[0], m[1], m[2], m[3]);
      if (gone) { mx.setLineDash([2, 1.5]); mx.strokeStyle = '#6c6b66'; mx.lineWidth = 0.8; mx.stroke(); mx.setLineDash([]); continue; }
      mx.fillStyle = g && g.dusty ? '#5a5244' : AIS_COL[a]; mx.fill(); mx.strokeStyle = '#4a4c4e'; mx.lineWidth = 0.6; mx.stroke();
    }
    if (g && !g.alive) { mx.strokeStyle = 'rgba(224,65,47,0.9)'; mx.lineWidth = 1.4; mx.beginPath(); mx.moveTo(23, 5); mx.lineTo(35, 17); mx.moveTo(35, 5); mx.lineTo(23, 17); mx.stroke(); }
  }
  function setBar(cls, v, col) { var i = cond.querySelector('.' + cls); i.style.setProperty('--v', Math.round(clamp(v, 0, 1) * 100) + '%'); if (col) i.style.setProperty('--c', col); }
  function updateCond() {
    var g = TR.subject; if (!g || g.cleared) return;
    var dm = g.dm || {}, blood = g.dusty ? 0 : (dm.blood || 0) / G.TUNE.bloodMl, pain = clamp((dm.pain || 0) / 160, 0, 1), cons = g.alive ? clamp(dm.cons == null ? 1 : dm.cons, 0, 1) : 0;
    var st = g.dusty ? 'he was already dead' : !g.alive ? 'dead: ' + (g.cause || 'unknown') : cons < 0.3 ? 'unconscious' : cons < 0.7 ? 'dazed' : pain > 0.6 ? 'conscious, in agony' : pain > 0.25 ? 'conscious, hurting' : 'conscious';
    var stE = cond.querySelector('.st'); stE.textContent = st; stE.classList.toggle('dead', !g.alive);
    setBar('b-blood', blood, blood > 0.6 ? '#8a2a22' : blood > 0.4 ? '#b8501c' : '#e0412f'); setBar('b-pain', pain, '#c79a34'); setBar('b-cons', cons, '#6a9ab0');
    var iss = G.dmg && G.dmg.iss ? G.dmg.iss(g) : 0; cond.querySelector('.iss').textContent = iss ? 'ISS ' + iss : '';
    var ev = g.rec && g.rec.events, last = null; if (ev) for (var i = ev.length - 1; i >= 0 && i > ev.length - 30; i--) { if (ev[i].inj && ev[i].inj.length && !ev[i].minor) { last = ev[i]; break; } }
    cond.querySelector('.worst').textContent = last ? last.inj[last.inj.length - 1].what + ' (' + (g.dm.regions[last.region] ? g.dm.regions[last.region].def.name : last.region) + ')' : '';
    var xr = cond.querySelector('.xr'); xr.disabled = !(g.case && !g.alive); xr.title = xr.disabled ? 'after he\'s dead' : 'every recorded injury, and what killed him';
    var hash = g.alive + ':' + g.list.map(function (p) { return (p.gone ? 'g' : p.attached ? 'a' : 'd'); }).join('') + ':' + Object.keys(dm.regions || {}).map(function (k) { return dm.regions[k].ais; }).join('');
    if (hash !== lastHash || mapDirty) { drawMap(g); lastHash = hash; mapDirty = false; }
  }

  /* ---------------- per frame */
  /* the counts on the CLEAR buttons follow what's in the room (a rope that snapped, a nail that tore out) */
  var countKey = '';
  function counts() { return [TR.ropeApi.count(), TR.spikeApi.count(), TR.nailApi.count(), TR.stapleApi.count(), TR.ropeApi.sel() ? 1 : 0].join(','); }
  ui.frame = function (dt) {
    condT -= dt;
    if (condT <= 0) {
      condT = 0.15; updateCond();
      if (T.cur && T.cur.id === 'chainsaw') { var s = info.querySelector('.sawst'); if (s) s.textContent = sawWord(); }
      var ck = counts(), ae = document.activeElement;
      if (ck !== countKey) { countKey = ck; if (T.cur && /^(rope|chain|spike|nail|staple)$/.test(T.cur.id) && !(ae && ae.type === 'range' && info.contains(ae))) ui.onTool(); }
    }
    if (toastT > 0) { toastT -= dt; if (toastT <= 0) toastEl.classList.remove('on'); }
    /* working under the panel: it fades (the X-RAY button brings it back when you go for it) */
    var P = T.pointer, sc = TR.cam && TR.cam.toScreen(P.x, P.y), cr = cond.getBoundingClientRect(), under = !!(sc && P.over && !overX && sc.x > cr.left - 6 && sc.x < cr.right + 6 && sc.y > cr.top - 6 && sc.y < cr.bottom + 6);
    if (under !== cond.classList.contains('under')) cond.classList.toggle('under', under);
    if (TR.sfx && TR.sfx.frame) TR.sfx.frame();
  };

  /* ---------------- keys */
  var typed = '';
  window.addEventListener('keydown', function (e) {
    /* a slider or a checkbox that was last clicked keeps the focus: the letters still have to work */
    var tg = e.target; if (tg && (tg.tagName === 'TEXTAREA' || (tg.tagName === 'INPUT' && !/^(range|checkbox|button)$/.test(tg.type)))) return;
    var k = e.key.toLowerCase();
    /* words only count on the pause screen, where letters don't do anything else */
    if (k.length === 1 && TR.paused) { typed = (typed + k).slice(-12); eggs(); }
    if (k === 'escape') { e.preventDefault(); if (G.recap && G.recap.isOpen && G.recap.isOpen()) return; if (!TR.paused && T.cancel()) return; ui.pause(!TR.paused); return; }
    if (TR.paused) return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (k === 't') { SET.dock = SET.dock ? 0 : 1; dock.classList.toggle('hid', !SET.dock); save(); TR.fit(); var c = pause.querySelector('input[data-o=dock]'); if (c) c.checked = !!SET.dock; }
    else if (k === 'w') T.cycle(-1);
    else if (k === 'e') T.cycle(1);
    else if (k === 's') T.cycleVariant(-1);
    else if (k === 'd') T.cycleVariant(1);
    else if (k === 'r') { if (T.cur && T.cur.key) T.cur.key('r'); }
    else if (k === 'f') ui.fullscreen();
    else if (k === 'delete' || k === 'backspace') { T.removeAt(T.pointer.x, T.pointer.y); }
    else if (/^[1-7]$/.test(k)) {
      var gr = T.groups[+k - 1]; if (!gr) return; var tools = T.list.filter(function (t) { return t.group === gr.id; }); if (!tools.length) return;
      var i = tools.indexOf(T.cur); T.select(tools[(i + 1) % tools.length].id);
    } else return;
    e.preventDefault();
  });
  /* things you can type */
  function eggs() {
    if (/yeehaw$/.test(typed)) { var g = TR.subject; if (g) { g.look.hat = true; g.look.hatCol = '#3a2a1a'; g.hatOn = true; } window.TR_HAT = true; ui.toast('yeehaw'); typed = ''; }
    else if (/dusty$/.test(typed)) { TR.wantDusty = true; ui.toast('the next one\'s already dead (reset)'); typed = ''; }
    else if (/lights$/.test(typed)) { if (TR.room.lamp.state === 'ok') TR.room.breakLamp(TR.room.lampPos().x, TR.room.lampPos().y); else { TR.room.reset(); ui.toast('lights on'); } typed = ''; }
  }

  /* ---------------- going */
  var last = 'hand'; try { last = localStorage.getItem('ffs_torture_tool') || 'hand'; } catch (e) {}
  T.select(T.byId[last] && last !== 'chainsaw' ? last : 'hand');
  setTimeout(function () { var b = document.getElementById('tr-boot'); if (b) { b.classList.add('gone'); setTimeout(function () { b.remove(); }, 700); } }, 250);
})();
