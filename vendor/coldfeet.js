/* ============================================================
   THE VENDOR — COLD FEET
   the visual novel that happens on the seventh death, and the
   room you can visit afterwards.
   engine first, then the script, then the check-in room.
============================================================ */
(function(){
'use strict';
const V = window.VENDOR;

/* ============================================================
   DOM
============================================================ */
let root = null, bgCv, bgx, spCv, spx, ui = {};
function build(){
  if(root) return;
  root = document.createElement('div');
  root.id = 'vVN';
  root.innerHTML = `
    <canvas id="vnBg"></canvas>
    <canvas id="vnSprite"></canvas>
    <div id="vnHearts"></div>
    <div id="vnTools"><button id="vnLog">log</button><button id="vnAuto">auto</button></div>
    <div id="vnBox"><div id="vnName"></div><div id="vnText"></div><div id="vnTip">▾</div></div>
    <div id="vnChoices"></div>
    <div id="vnInput"><div id="vnInputQ"></div><input id="vnInputF" maxlength="16" autocomplete="off" autocapitalize="off" spellcheck="false"><div class="vnRow"><button id="vnInputOk">ok</button><button id="vnInputSkip">never mind</button></div></div>
    <div id="vnLogPanel"><div id="vnLogInner"></div><button id="vnLogClose">close</button></div>
    <div id="vnEnd"><div id="vnEndText"></div></div>
    <div id="vnFade"></div>
    <div id="vnGlitch"></div>
  `;
  document.body.appendChild(root);
  bgCv = root.querySelector('#vnBg'); bgx = bgCv.getContext('2d');
  spCv = root.querySelector('#vnSprite'); spx = spCv.getContext('2d');
  ['vnHearts','vnTools','vnLog','vnAuto','vnBox','vnName','vnText','vnTip','vnChoices','vnInput','vnInputQ','vnInputF','vnInputOk','vnInputSkip','vnLogPanel','vnLogInner','vnLogClose','vnEnd','vnEndText','vnFade','vnGlitch']
    .forEach(id=>{ ui[id] = root.querySelector('#'+id); });
  root.addEventListener('click', e=>{
    if(e.target.closest('#vnChoices, #vnInput, #vnTools, #vnLogPanel')) return;
    if(ui.vnEnd.classList.contains('on')) return;
    advance();
  });
  ui.vnLog.addEventListener('click', e=>{ e.stopPropagation(); openLog(); });
  ui.vnLogClose.addEventListener('click', e=>{ e.stopPropagation(); ui.vnLogPanel.classList.remove('on'); });
  ui.vnAuto.addEventListener('click', e=>{ e.stopPropagation(); autoOn = !autoOn; ui.vnAuto.classList.toggle('lit', autoOn); if(autoOn && typ.done && !choicesOn) scheduleAuto(); });
  ui.vnInputOk.addEventListener('click', e=>{ e.stopPropagation(); submitInput(false); });
  ui.vnInputSkip.addEventListener('click', e=>{ e.stopPropagation(); submitInput(true); });
  ui.vnInputF.addEventListener('keydown', e=>{ e.stopPropagation(); if(e.key === 'Enter') submitInput(false); });
  window.addEventListener('resize', ()=>{ if(running){ sizeAll(); } });
  root.addEventListener('touchmove', e=>{ if(!e.target.closest('#vnLogPanel')) e.preventDefault(); }, { passive:false });
}
function sizeAll(){
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const w = window.innerWidth, h = window.innerHeight;
  bgCv.width = Math.round(w*dpr*0.75); bgCv.height = Math.round(h*dpr*0.75);
  bgCache = null;
  const sh = Math.min(h*0.74, w*1.15);
  spCv.width = Math.round(sh*0.62*dpr); spCv.height = Math.round(sh*dpr);
  spCv.style.height = sh + 'px'; spCv.style.width = (sh*0.62) + 'px';
}

/* ============================================================
   SOUND (soft, procedural, through the shared bus)
============================================================ */
let musicTimer = 0, musicName = null, humNodes = null;
function ac(){ return V.ac(); }
function dest(){ const b = V.bus(); return b ? b.master : null; }
function tone(f, dur, g, type, when){
  const c = ac(), d = dest(); if(!c || !d) return;
  const t = when || c.currentTime;
  const o = c.createOscillator(), gg = c.createGain();
  o.type = type || 'sine'; o.frequency.value = f;
  gg.gain.setValueAtTime(0.0001, t); gg.gain.linearRampToValueAtTime(g, t + Math.min(0.04, dur*0.3)); gg.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(gg); gg.connect(d); o.start(t); o.stop(t + dur + 0.05);
}
const THEMES = {
  room:  { notes:[0,7,12,16, 12,7,4,7], root:130.81, gap:900, dur:2.2, type:'sine', g:0.05, pad:true },
  love:  { notes:[12,16,19,24, 19,16,14,16, 12,11,12,7], root:261.63, gap:520, dur:1.4, type:'triangle', g:0.045 },
  sad:   { notes:[12,10,7,3, 7,5,3,0], root:220, gap:820, dur:1.8, type:'triangle', g:0.04 },
  tense: { notes:[0,1,0,-1, 0,6], root:65.41, gap:640, dur:1.4, type:'sawtooth', g:0.03 },
  dark:  { notes:[0,-1], root:49, gap:2200, dur:3, type:'sine', g:0.05 }
};
function music(name){
  if(name === musicName) return;
  musicName = name;
  clearInterval(musicTimer); musicTimer = 0;
  if(!name || name === 'none') return;
  const T = THEMES[name]; if(!T) return;
  let i = 0;
  musicTimer = setInterval(()=>{
    const semi = T.notes[i % T.notes.length];
    const f = T.root * Math.pow(2, semi/12);
    tone(f, T.dur, T.g, T.type);
    if(T.pad && i % 4 === 0){ tone(T.root/2, T.dur*3, T.g*0.8, 'sine'); tone(T.root*0.75, T.dur*3, T.g*0.5, 'sine'); }
    if(name === 'love' && i % 3 === 0) tone(f/2, T.dur*1.2, T.g*0.5, 'sine');
    i++;
  }, T.gap);
}
function hum(on){
  const c = ac(), d = dest(); if(!c || !d) return;
  if(on && !humNodes){
    const g = c.createGain(); g.gain.value = 0.0001; g.connect(d);
    const o1 = c.createOscillator(); o1.type = 'sawtooth'; o1.frequency.value = 55;
    const o2 = c.createOscillator(); o2.type = 'sine'; o2.frequency.value = 110.3;
    const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 240;
    const lfo = c.createOscillator(); lfo.frequency.value = 0.21; const lg = c.createGain(); lg.gain.value = 0.006;
    lfo.connect(lg); lg.connect(g.gain);
    o1.connect(lp); o2.connect(lp); lp.connect(g);
    o1.start(); o2.start(); lfo.start();
    g.gain.setTargetAtTime(0.022, c.currentTime, 1.2);
    humNodes = { g, o:[o1,o2,lfo], o1 };
  } else if(!on && humNodes){
    const h = humNodes; humNodes = null;
    h.g.gain.setTargetAtTime(0.0001, c.currentTime, 0.4);
    setTimeout(()=>h.o.forEach(o=>{ try{ o.stop(); }catch(e){} }), 1500);
  }
}
function humWindDown(sec){
  const c = ac(); if(!c || !humNodes) return;
  humNodes.o1.frequency.setTargetAtTime(18, c.currentTime, sec/3);
  humNodes.g.gain.setTargetAtTime(0.0001, c.currentTime + sec*0.6, sec/4);
}
function blip(who){
  const c = ac(); if(!c) return;
  if(who === 'V') tone(118 + Math.random()*26, 0.07, 0.05, 'square');
  else if(who === 'Y') tone(520 + Math.random()*40, 0.03, 0.012, 'sine');
}
const SFX = {
  heart(){ tone(660, 0.12, 0.06); const c = ac(); if(c) tone(990, 0.18, 0.045, 'sine', c.currentTime + 0.08); },
  slam(){ const c = ac(); if(!c) return; tone(70, 0.4, 0.4, 'square'); tone(40, 0.6, 0.3); },
  click(){ tone(2200, 0.03, 0.04, 'square'); },
  open(){ const c = ac(); if(!c) return; tone(140, 0.6, 0.06, 'sawtooth'); tone(180, 0.8, 0.04, 'sawtooth', c.currentTime + 0.2); },
  pop(){ tone(180, 0.1, 0.2); tone(90, 0.2, 0.2); },
  hiss(){ const c = ac(), d = dest(); if(!c || !d) return; const s = c.createBufferSource(); s.buffer = V.noiseBuffer(2, 'white'); const f = c.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 3000; const g = c.createGain(); g.gain.setValueAtTime(0.06, c.currentTime); g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 1.2); s.connect(f); f.connect(g); g.connect(d); s.start(); s.stop(c.currentTime + 1.3); },
  scratch(){ if(V.B && V.B.A && V.B.A.scratch) V.B.A.scratch(dest()); }
};

/* ============================================================
   SCENES (painted, cached, with live bits drawn on top)
============================================================ */
let scene = 'black', bgCache = null, sceneT = 0;
const parts = [];
function seedParts(kind){
  parts.length = 0;
  const n = kind === 'frost' ? 70 : (kind === 'dust' ? 40 : 0);
  for(let i=0;i<n;i++) parts.push({ x:Math.random(), y:Math.random(), s:0.5+Math.random()*1.8, v:0.004+Math.random()*0.012, d:(Math.random()-0.5)*0.003, a:Math.random()*6 });
}
function setScene(name){
  if(name === scene && bgCache) return;
  scene = name; bgCache = null; sceneT = performance.now();
  seedParts(name === 'room' || name === 'roomOff' || name === 'shelves' ? 'frost' : (name === 'corridor' ? 'dust' : ''));
}
function rr(c,x,y,w,h,r){ c.beginPath(); c.moveTo(x+r,y); c.arcTo(x+w,y,x+w,y+h,r); c.arcTo(x+w,y+h,x,y+h,r); c.arcTo(x,y+h,x,y,r); c.arcTo(x,y,x+w,y,r); c.closePath(); }
function grainOver(c, w, h, a){
  const n = V.B && V.B.rng ? V.B.rng(9) : Math.random;
  c.fillStyle = 'rgba(255,255,255,'+a+')';
  for(let i=0;i<w*h/90;i++){ c.fillRect(n()*w, n()*h, 1, 1); }
  c.fillStyle = 'rgba(0,0,0,'+(a*2)+')';
  for(let i=0;i<w*h/90;i++){ c.fillRect(n()*w, n()*h, 1, 1); }
}
function paintScene(name, w, h){
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const x = c.getContext('2d');
  const R = V.B && V.B.rng ? V.B.rng(31) : Math.random;
  x.fillStyle = '#000'; x.fillRect(0,0,w,h);
  if(name === 'corridor'){
    const vx = w*0.5, vy = h*0.46;
    const g = x.createLinearGradient(0,0,0,h); g.addColorStop(0,'#0b0c0e'); g.addColorStop(0.5,'#121316'); g.addColorStop(1,'#08090a');
    x.fillStyle = g; x.fillRect(0,0,w,h);
    /* walls in perspective */
    x.fillStyle = '#16181b';
    x.beginPath(); x.moveTo(0,0); x.lineTo(vx-w*0.08, vy-h*0.08); x.lineTo(vx-w*0.08, vy+h*0.1); x.lineTo(0,h); x.closePath(); x.fill();
    x.beginPath(); x.moveTo(w,0); x.lineTo(vx+w*0.08, vy-h*0.08); x.lineTo(vx+w*0.08, vy+h*0.1); x.lineTo(w,h); x.closePath(); x.fill();
    /* pipes */
    x.strokeStyle = '#2a2d30'; x.lineWidth = h*0.03;
    x.beginPath(); x.moveTo(0, h*0.12); x.lineTo(vx-w*0.08, vy-h*0.06); x.stroke();
    x.strokeStyle = '#3a2a1c'; x.lineWidth = h*0.012;
    x.beginPath(); x.moveTo(0, h*0.2); x.lineTo(vx-w*0.08, vy-h*0.04); x.stroke();
    /* the far dark */
    x.fillStyle = '#030304'; x.fillRect(vx-w*0.08, vy-h*0.08, w*0.16, h*0.18);
    /* a light pool on the floor */
    const lg = x.createRadialGradient(vx, h*0.85, 10, vx, h*0.85, w*0.35);
    lg.addColorStop(0,'rgba(255,214,160,0.16)'); lg.addColorStop(1,'rgba(255,214,160,0)');
    x.fillStyle = lg; x.fillRect(0,0,w,h);
  } else if(name === 'room' || name === 'roomOff'){
    const off = name === 'roomOff';
    /* back wall: freezer panel */
    const g = x.createLinearGradient(0,0,0,h);
    g.addColorStop(0, off ? '#06080a' : '#1a222a'); g.addColorStop(0.7, off ? '#0a0d10' : '#26313b'); g.addColorStop(1, off ? '#050607' : '#161c22');
    x.fillStyle = g; x.fillRect(0,0,w,h);
    x.strokeStyle = 'rgba(0,0,0,0.5)'; x.lineWidth = 2;
    for(let i=1;i<6;i++){ x.beginPath(); x.moveTo(w*i/6, 0); x.lineTo(w*i/6, h*0.72); x.stroke(); }
    x.fillStyle = 'rgba(255,255,255,0.04)';
    for(let i=1;i<6;i++) x.fillRect(w*i/6+2, 0, 2, h*0.72);
    /* frost at the seams */
    for(let i=0;i<500;i++){ x.fillStyle = 'rgba(210,228,255,'+(R()*0.12).toFixed(3)+')'; const px = R()*w, py = h*0.72 - R()*R()*h*0.4; x.fillRect(px, py, 1+R()*3, 1); }
    /* floor */
    const fg = x.createLinearGradient(0,h*0.72,0,h); fg.addColorStop(0, off ? '#08090b' : '#1c2329'); fg.addColorStop(1, '#07090b');
    x.fillStyle = fg; x.fillRect(0,h*0.72,w,h*0.28);
    x.strokeStyle = 'rgba(0,0,0,0.6)'; x.lineWidth = 1;
    for(let i=-8;i<16;i++){ x.beginPath(); x.moveTo(w*0.5 + i*w*0.04, h*0.72); x.lineTo(w*0.5 + i*w*0.16, h); x.stroke(); }
    /* shelf, left, with the things it kept */
    x.fillStyle = '#4a5560'; x.fillRect(w*0.04, h*0.42, w*0.24, h*0.014);
    x.fillStyle = '#2c333a'; x.fillRect(w*0.04, h*0.434, w*0.24, h*0.006);
    x.fillStyle = '#c9c2a8'; x.fillRect(w*0.07, h*0.405, w*0.035, h*0.015);            // coaster
    x.fillStyle = '#e9e3cc';
    for(let i=0;i<6;i++){ x.save(); x.translate(w*0.13 + i*w*0.018, h*0.392); x.rotate((R()-0.5)*0.5); x.fillRect(0,0,w*0.012,h*0.022); x.restore(); }  // tags
    x.fillStyle = '#3a3f44'; x.fillRect(w*0.24, h*0.385, w*0.02, h*0.035);               // a battery
    x.fillStyle = '#c4a020'; x.fillRect(w*0.24, h*0.385, w*0.02, h*0.006);
    /* the crooked chair, right */
    x.save(); x.translate(w*0.8, h*0.66); x.rotate(0.06);
    x.strokeStyle = '#3d3a36'; x.lineWidth = Math.max(2, w*0.005);
    x.beginPath(); x.moveTo(-w*0.04, h*0.2); x.lineTo(-w*0.03, 0); x.lineTo(-w*0.035, -h*0.18); x.moveTo(w*0.04, h*0.2); x.lineTo(w*0.03, 0); x.stroke();
    x.fillStyle = '#4e3a2a'; x.fillRect(-w*0.045, -h*0.012, w*0.09, h*0.02);
    x.fillRect(-w*0.04, -h*0.19, w*0.065, h*0.07);
    x.restore();
    x.fillStyle = 'rgba(0,0,0,0.35)'; x.beginPath(); x.ellipse(w*0.8, h*0.87, w*0.07, h*0.015, 0, 0, 7); x.fill();
  } else if(name === 'shelves'){
    const g = x.createLinearGradient(0,0,0,h); g.addColorStop(0,'#0a1a28'); g.addColorStop(1,'#020509');
    x.fillStyle = g; x.fillRect(0,0,w,h);
    for(let k=0;k<6;k++){
      const yy = h*(0.12 + k*0.15), sc = 1 - k*0.03;
      x.strokeStyle = 'rgba(160,200,230,0.55)'; x.lineWidth = 2;
      x.beginPath(); x.moveTo(w*0.06, yy); x.lineTo(w*0.94, yy); x.stroke();
      for(let xx = w*0.06; xx < w*0.94; xx += w*0.012){ x.beginPath(); x.moveTo(xx, yy); x.lineTo(xx, yy+3); x.stroke(); }
      /* things on the shelves. shapes, mostly. tags on all of them. */
      let px = w*0.08;
      while(px < w*0.9){
        const kind = R();
        const bw = w*(0.03 + R()*0.05)*sc, bh = h*(0.03 + R()*0.07);
        x.fillStyle = 'rgba(14,24,34,0.95)';
        if(kind < 0.25){ x.beginPath(); x.ellipse(px+bw/2, yy-bh*0.3, bw/2, bh*0.3, 0, 0, 7); x.fill(); }      // shoe
        else if(kind < 0.4){ x.beginPath(); x.arc(px+bw/2, yy-bh*0.35, bh*0.3, 0, 7); x.fill(); x.fillStyle='rgba(200,220,240,0.3)'; x.beginPath(); x.arc(px+bw/2, yy-bh*0.35, bh*0.2, 0, 7); x.fill(); }  // a watch
        else if(kind < 0.55){ x.fillRect(px, yy-bh*0.5, bw*0.6, bh*0.5); x.fillStyle='rgba(120,180,255,0.35)'; x.fillRect(px+2, yy-bh*0.5+2, bw*0.6-4, bh*0.5-4); }  // a phone, lit
        else x.fillRect(px, yy-bh, bw, bh);
        x.fillStyle = 'rgba(230,222,200,0.75)'; x.fillRect(px+bw*0.6, yy-bh*0.2, w*0.01, h*0.012);
        px += bw + w*(0.01 + R()*0.03);
      }
    }
    const vg = x.createRadialGradient(w/2,h/2,h*0.2,w/2,h/2,h); vg.addColorStop(0,'rgba(0,0,0,0)'); vg.addColorStop(1,'rgba(0,0,0,0.85)');
    x.fillStyle = vg; x.fillRect(0,0,w,h);
  } else if(name === 'stairs'){
    const g = x.createLinearGradient(0,0,0,h); g.addColorStop(0,'#1a1a1c'); g.addColorStop(1,'#060606');
    x.fillStyle = g; x.fillRect(0,0,w,h);
    for(let i=0;i<9;i++){ const yy = h*(0.9 - i*0.08), ww = w*(0.6 - i*0.04); x.fillStyle = 'rgb('+(30+i*6)+','+(30+i*6)+','+(32+i*6)+')'; x.fillRect(w/2-ww/2, yy, ww, h*0.04); }
    const dg = x.createRadialGradient(w/2, h*0.18, 4, w/2, h*0.18, h*0.5); dg.addColorStop(0,'rgba(255,248,230,0.95)'); dg.addColorStop(1,'rgba(255,248,230,0)');
    x.fillStyle = dg; x.fillRect(0,0,w,h);
    x.fillStyle = '#fffaf0'; x.fillRect(w/2 - w*0.06, h*0.06, w*0.12, h*0.2);
  }
  if(name !== 'black') grainOver(x, w, h, 0.03);
  return c;
}
let bulbSwing = 0;
function drawBg(now){
  const w = bgCv.width, h = bgCv.height;
  if(!bgCache) bgCache = paintScene(scene, w, h);
  bgx.drawImage(bgCache, 0, 0);
  const t = (now - sceneT)/1000;
  if(scene === 'room'){
    /* the bulb on its cord, swinging a little, and the pool it makes */
    bulbSwing = Math.sin(t*0.9)*0.06;
    const ax = w*0.5, ay = 0, len = h*0.3;
    const bx = ax + Math.sin(bulbSwing)*len, by = ay + Math.cos(bulbSwing)*len;
    const pool = bgx.createRadialGradient(bx, by + h*0.1, 4, bx, h*0.6, w*0.6);
    pool.addColorStop(0,'rgba(255,200,130,0.28)'); pool.addColorStop(0.4,'rgba(255,170,100,0.1)'); pool.addColorStop(1,'rgba(0,0,0,0)');
    bgx.fillStyle = pool; bgx.fillRect(0,0,w,h);
    bgx.strokeStyle = '#0c0c0c'; bgx.lineWidth = Math.max(1, w*0.0015);
    bgx.beginPath(); bgx.moveTo(ax, ay); bgx.lineTo(bx, by); bgx.stroke();
    const bg = bgx.createRadialGradient(bx, by + h*0.02, 1, bx, by + h*0.02, h*0.06);
    bg.addColorStop(0,'rgba(255,244,214,1)'); bg.addColorStop(0.3,'rgba(255,200,130,0.6)'); bg.addColorStop(1,'rgba(255,200,130,0)');
    bgx.fillStyle = bg; bgx.beginPath(); bgx.arc(bx, by + h*0.02, h*0.06, 0, 7); bgx.fill();
    /* ninety percent of the time the bulb is a bulb */
    if(Math.random() < 0.006){ bgx.fillStyle = 'rgba(0,0,0,0.55)'; bgx.fillRect(0,0,w,h); }
  }
  if(scene === 'corridor' && opts.redCorridor){
    const g = bgx.createRadialGradient(w/2, h*0.45, 2, w/2, h*0.45, h*0.4);
    g.addColorStop(0,'rgba(255,60,40,0.18)'); g.addColorStop(1,'rgba(0,0,0,0)');
    bgx.fillStyle = g; bgx.fillRect(0,0,w,h);
  }
  if(parts.length){
    for(const p of parts){
      p.y += p.v*0.016*(scene === 'corridor' ? 0.4 : 1); p.x += p.d + Math.sin(t + p.a)*0.0006;
      if(p.y > 1.02){ p.y = -0.02; p.x = Math.random(); }
      bgx.fillStyle = scene === 'corridor' ? 'rgba(255,220,180,0.25)' : 'rgba(220,235,255,0.5)';
      bgx.fillRect(p.x*w, p.y*h, p.s*(w/900), p.s*(w/900));
    }
  }
}

/* ============================================================
   THE VENDOR, VN SIZE
   same thing as downstairs, standing still and lit properly.
   two round black magnets got stuck where eyes would go.
============================================================ */
function exprParams(e){
  const p = { glow:[255,200,140], door:0.2, eye:'open', look:[0,0], blush:0, sweat:0, tear:0, hearts:0, brow:0, tilt:0, slump:0 };
  switch(e){
    case 'shy':        p.blush=1; p.door=0.14; p.look=[-0.6,0.4]; p.tilt=-0.06; break;
    case 'flustered':  p.blush=1; p.sweat=1; p.door=0.32; p.eye='wide'; p.glow=[255,160,150]; break;
    case 'happy':      p.eye='curve'; p.door=0.4; p.glow=[255,214,140]; break;
    case 'sad':        p.look=[0,0.7]; p.door=0.08; p.glow=[150,180,255]; p.eye='droop'; p.slump=1; break;
    case 'sob':        p.eye='closed'; p.door=0.06; p.glow=[120,160,255]; p.tear=1; p.slump=1; break;
    case 'menacing':   p.eye='narrow'; p.door=0.85; p.glow=[255,40,24]; p.brow=1; break;
    case 'lovestruck': p.eye='heart'; p.door=0.36; p.blush=1; p.hearts=1; p.glow=[255,140,190]; break;
    case 'pleased':    p.eye='curve'; p.door=0.28; p.look=[0.4,0]; p.tilt=0.05; break;
    case 'blank':      p.eye='dot'; p.door=0.5; p.glow=[255,90,60]; break;
    case 'off':        p.eye='dot'; p.door=0.02; p.glow=[0,0,0]; p.slump=1; break;
    case 'think':      p.look=[0.7,-0.6]; p.door=0.12; p.tilt=0.04; break;
  }
  return p;
}
function heart(c,x,y,s){ c.beginPath(); c.moveTo(x,y+s*0.3); c.bezierCurveTo(x,y-s*0.3,x-s,y-s*0.3,x-s,y+s*0.2); c.bezierCurveTo(x-s,y+s*0.7,x,y+s,x,y+s*1.1); c.bezierCurveTo(x,y+s,x+s,y+s*0.7,x+s,y+s*0.2); c.bezierCurveTo(x+s,y-s*0.3,x,y-s*0.3,x,y+s*0.3); c.fill(); }
function drawVN(now){
  const c = spx, W = spCv.width, H = spCv.height;
  c.clearRect(0,0,W,H);
  if(hideSprite) return;
  const p = exprParams(expr);
  const t = now/1000;
  const u = H/640;
  c.save();
  c.scale(u, u);
  const cx = 198*(W/u)/396, bob = Math.sin(t*1.7)*3 + p.slump*6;
  let jx = 0;
  if(expr === 'flustered') jx = (Math.random()-0.5)*2.4;
  if(shakeUntil > now) jx += (Math.random()-0.5)*10;
  c.translate(jx, bob);
  c.lineCap = 'round'; c.lineJoin = 'round';
  /* legs, coat, arms */
  c.strokeStyle = '#141416'; c.lineWidth = 11;
  c.beginPath(); c.moveTo(cx-14, 420); c.lineTo(cx-24, 500); c.lineTo(cx-16, 560); c.lineTo(cx-22, 636); c.stroke();
  c.beginPath(); c.moveTo(cx+14, 420); c.lineTo(cx+26, 500); c.lineTo(cx+18, 562); c.lineTo(cx+24, 636); c.stroke();
  const cg = c.createLinearGradient(cx-70, 0, cx+70, 0);
  cg.addColorStop(0,'#1f1d1a'); cg.addColorStop(0.45,'#45413a'); cg.addColorStop(1,'#1b1a17');
  c.fillStyle = cg;
  c.beginPath(); c.moveTo(cx-44, 214); c.lineTo(cx+44, 214); c.lineTo(cx+62, 360); c.lineTo(cx+70, 470); c.lineTo(cx+16, 462); c.lineTo(cx-8, 476); c.lineTo(cx-68, 468); c.lineTo(cx-60, 360); c.closePath(); c.fill();
  c.strokeStyle = 'rgba(0,0,0,0.5)'; c.lineWidth = 2; c.beginPath(); c.moveTo(cx, 222); c.lineTo(cx-4, 470); c.stroke();
  c.fillStyle = '#e1dbc4'; c.fillRect(cx+12, 256, 26, 14); c.fillStyle = 'rgba(0,0,0,0.5)';
  c.font = 'bold 9px Arial'; c.textAlign = 'left';
  c.fillText(vendorName ? vendorName.slice(0,6).toUpperCase() : '', cx+14, 267);
  c.fillStyle = 'rgba(70,24,12,0.35)'; c.beginPath(); c.arc(cx-30, 330, 9, 0, 7); c.arc(cx-12, 370, 6, 0, 7); c.arc(cx+30, 400, 7, 0, 7); c.fill();
  const armSway = Math.sin(t*1.1)*3;
  c.strokeStyle = '#1d1c19'; c.lineWidth = 10;
  c.beginPath(); c.moveTo(cx-42, 226); c.lineTo(cx-60, 340); c.lineTo(cx-56+armSway, 470); c.stroke();
  c.beginPath(); c.moveTo(cx+42, 226); c.lineTo(cx+62, 342); c.lineTo(cx+58-armSway, 472); c.stroke();
  c.strokeStyle = '#a49e94'; c.lineWidth = 2.6;
  [-1,1].forEach(s=>{ const hx = cx + s*58 + (s<0?armSway:-armSway), hy = 472; for(let f=0;f<4;f++){ c.beginPath(); c.moveTo(hx+(f-1.5)*4, hy); c.lineTo(hx+(f-1.5)*5, hy+26+f*3); c.stroke(); } });
  c.strokeStyle = '#0d0d0d'; c.lineWidth = 6;
  c.beginPath(); c.moveTo(cx+6, 220); c.bezierCurveTo(cx+38, 206, cx-30, 196, cx+4, 186); c.stroke();
  /* head */
  c.save(); c.translate(cx, 112); c.rotate(p.tilt + Math.sin(t*0.8)*0.01);
  const hw = 150, hh = 196, hx = -hw/2, hy = -98;
  const hg = c.createLinearGradient(hx,0,hx+hw,0);
  hg.addColorStop(0,'#7c7664'); hg.addColorStop(0.32,'#e2dcc4'); hg.addColorStop(0.7,'#cdc6ab'); hg.addColorStop(1,'#6e6857');
  c.fillStyle = hg; rr(c,hx,hy,hw,hh,40); c.fill();
  c.strokeStyle = 'rgba(0,0,0,0.55)'; c.lineWidth = 3; c.stroke();
  c.fillStyle = 'rgba(255,255,255,0.22)'; c.fillRect(hx+24, hy+16, 5, hh-40);
  c.fillStyle = 'rgba(0,0,0,0.4)'; c.fillRect(hx+6, hy+62, hw-12, 3);
  const R = V.B && V.B.rng ? V.B.rng(55) : Math.random;
  for(let i=0;i<50;i++){ c.fillStyle='rgba('+(110+R()*40|0)+','+(50+R()*20|0)+',14,'+(0.18+R()*0.35).toFixed(2)+')'; c.beginPath(); c.arc(hx+R()*hw, hy+hh*0.55+R()*hh*0.45, 1+R()*3, 0, 7); c.fill(); }
  c.fillStyle = '#e8ecee'; rr(c, hx+hw-20, hy+76, 8, 64, 4); c.fill();
  /* magnets */
  const mags = [['S','#c4241a'],['A','#1a5ac4'],['L','#e0b020']];
  if(hasE) mags.push(['E','#2c9c3a']);
  c.font = 'bold 20px Arial';
  mags.forEach((m,i)=>{ c.fillStyle = m[1]; c.fillText(m[0], hx+18+i*20, hy+46 + (i%2)*3); });
  /* eyes: two black round magnets */
  const ex = 30, ey = hy + 100, lx = p.look[0]*6, ly = p.look[1]*6;
  const eye = (sx)=>{
    c.save();
    if(p.eye === 'closed'){ c.strokeStyle = '#1a1a1a'; c.lineWidth = 4; c.beginPath(); c.arc(sx, ey, 12, Math.PI*0.15, Math.PI*0.85); c.stroke(); }
    else if(p.eye === 'curve'){ c.strokeStyle = '#1a1a1a'; c.lineWidth = 4; c.beginPath(); c.arc(sx, ey+8, 12, Math.PI*1.15, Math.PI*1.85); c.stroke(); }
    else if(p.eye === 'heart'){ c.fillStyle = '#ff4f8b'; heart(c, sx, ey-6, 11); }
    else if(p.eye === 'dot'){ c.fillStyle = '#0c0c0c'; c.beginPath(); c.arc(sx, ey, 4, 0, 7); c.fill(); }
    else {
      const eh = p.eye === 'wide' ? 15 : (p.eye === 'narrow' ? 6 : (p.eye === 'droop' ? 9 : 12));
      c.fillStyle = '#121212'; c.beginPath(); c.ellipse(sx, ey, 13, eh, 0, 0, 7); c.fill();
      c.fillStyle = 'rgba(255,255,255,0.75)'; c.beginPath(); c.arc(sx - 4 + lx, ey - 4 + ly, 3.6, 0, 7); c.fill();
      if(p.eye === 'droop'){ c.fillStyle = '#d8d1b8'; c.fillRect(sx-14, ey-eh-1, 28, eh*0.6); }
      /* blink */
      if(Math.sin(t*0.9 + 1.3) > 0.985){ c.fillStyle = '#d8d1b8'; c.fillRect(sx-14, ey-eh-1, 28, eh*2+2); }
    }
    c.restore();
  };
  eye(-ex); eye(ex);
  if(p.brow){ c.strokeStyle = '#1a1a1a'; c.lineWidth = 4; c.beginPath(); c.moveTo(-ex-14, ey-22); c.lineTo(-ex+10, ey-12); c.moveTo(ex+14, ey-22); c.lineTo(ex-10, ey-12); c.stroke(); }
  if(p.blush){ c.fillStyle = 'rgba(255,120,160,0.45)'; c.beginPath(); c.ellipse(-ex-6, ey+24, 15, 7, 0, 0, 7); c.ellipse(ex+6, ey+24, 15, 7, 0, 0, 7); c.fill(); }
  if(p.sweat){ c.fillStyle = 'rgba(160,215,255,0.9)'; const sy = hy+40 + Math.sin(t*6)*3; c.beginPath(); c.ellipse(hx+hw-30, sy, 5, 9, 0, 0, 7); c.fill(); }
  if(p.tear){ c.fillStyle = 'rgba(150,200,255,0.9)'; const ty = ey + 14 + ((t*40)%46); c.beginPath(); c.ellipse(-ex, ty, 4, 7, 0, 0, 7); c.fill(); }
  /* the door gap: its mouth, more or less */
  const gap = 4 + p.door*44;
  const my = hy + hh*0.74;
  c.fillStyle = '#040303'; rr(c, -46, my - gap/2, 92, gap, 6); c.fill();
  if(p.glow[0] + p.glow[1] + p.glow[2] > 0){
    const pulse = 0.85 + Math.sin(t*2.2)*0.1;
    const ig = c.createRadialGradient(0, my, 2, 0, my, 40 + gap);
    ig.addColorStop(0, 'rgba('+p.glow.join(',')+','+pulse.toFixed(2)+')'); ig.addColorStop(1, 'rgba(0,0,0,0.9)');
    c.fillStyle = ig; rr(c, -44, my - gap/2 + 1, 88, Math.max(1, gap-2), 5); c.fill();
    if(p.door > 0.45){ c.strokeStyle = 'rgba(40,24,18,0.9)'; c.lineWidth = 2; for(let k=0;k<3;k++){ const yy = my - gap/2 + gap*(k+1)/4; c.beginPath(); c.moveTo(-44, yy); c.lineTo(44, yy); c.stroke(); } }
  }
  c.restore();
  if(p.hearts){ c.fillStyle = 'rgba(255,120,180,0.85)'; for(let i=0;i<3;i++){ const a = t*1.4 + i*2.1; heart(c, cx + Math.sin(a)*90, 30 - ((t*30 + i*40)%110), 8 + Math.sin(a)*2); } }
  c.restore();
}

/* ============================================================
   ENGINE
============================================================ */
let running = false, raf = 0, expr = 'neutral', hideSprite = false, shakeUntil = 0;
let SCRIPT = null, cur = null, curId = null, choicesOn = false, inputOn = null, autoOn = false, autoTimer = 0;
let backlog = [], onDone = null, opts = {};
let state = {}, vendorName = null, playerName = null, hasE = false;
const typ = { full:'', i:0, timer:0, done:true, who:'N' };

function loop(now){
  if(!running) return;
  raf = requestAnimationFrame(loop);
  drawBg(now);
  drawVN(now);
}
function val(v){ return typeof v === 'function' ? v(state) : v; }
function fill(s){
  return String(s)
    .replace(/\{name\}/g, vendorName || 'the vendor')
    .replace(/\{you\}/g, playerName || 'you')
    .replace(/\{deaths\}/g, String(V.loadMem().deaths));
}
function setSpeaker(who){
  const n = ui.vnName, tx = ui.vnText;
  root.classList.remove('who-n','who-v','who-y');
  if(who === 'N'){ n.textContent = ''; root.classList.add('who-n'); }
  else if(who === 'Y'){ n.textContent = playerName ? playerName.toUpperCase() : 'YOU'; root.classList.add('who-y'); }
  else { n.textContent = (vendorName ? vendorName.toUpperCase() : 'THE VENDOR') + (V.loadMem().relationship === 'together' ? ' ♡' : ''); root.classList.add('who-v'); }
}
function hearts(){
  if(!opts.showHearts){ ui.vnHearts.textContent = ''; return; }
  const n = clampI(Math.round(state.aff||0), 0, 8);
  ui.vnHearts.textContent = '♥'.repeat(n) + '♡'.repeat(8-n);
}
function clampI(v,a,b){ return v<a?a:(v>b?b:v); }

function go(id){
  clearTimeout(autoTimer);
  if(typeof id === 'function') id = id(state);
  if(!id){ return finish(opts.fallbackEnd || 'friends'); }
  if(id === '@hub' && opts.hub) id = opts.hub;
  const n = SCRIPT[id];
  if(!n){ console.warn('vn: no node', id); return finish(opts.fallbackEnd || 'friends'); }
  if(n.call){ const nx = n.call(state); if(nx) return go(nx); }
  cur = n; curId = id;
  if(n.set) n.set(state);
  if(n.bg) setScene(val(n.bg));
  if(n.music !== undefined) music(val(n.music));
  if(n.hum !== undefined) hum(!!n.hum);
  if(n.sfx) (SFX[n.sfx] || (()=>{}))();
  if(n.fx === 'shake') shakeUntil = performance.now() + 450;
  if(n.fx === 'glitch') glitch(600);
  if(n.fx === 'flash'){ ui.vnFade.style.transition = 'none'; ui.vnFade.style.background = '#fff'; ui.vnFade.style.opacity = '0.9'; requestAnimationFrame(()=>{ ui.vnFade.style.transition = 'opacity 0.9s'; ui.vnFade.style.opacity = '0'; }); }
  if(n.hide !== undefined) hideSprite = !!n.hide;
  const who = n.who || 'V';
  if(n.expr) expr = val(n.expr);
  setSpeaker(who);
  hearts();
  if(n.input){ return askInput(n); }
  if(n.text === undefined || n.text === null){
    if(n.choices){ ui.vnText.textContent = ''; return showChoices(val(n.choices)); }
    if(n.end) return finish(val(n.end));
    return go(val(n.next));
  }
  const text = fill(val(n.text));
  backlog.push({ who, text });
  if(backlog.length > 200) backlog.shift();
  type(text, who, n.speed);
}
function type(text, who, speed){
  clearTimeout(typ.timer);
  typ.full = text; typ.i = 0; typ.done = false; typ.who = who;
  ui.vnText.textContent = ''; ui.vnTip.classList.remove('on');
  const base = speed === 'slow' ? 70 : (speed === 'fast' ? 12 : 24);
  const stepFn = ()=>{
    typ.i++;
    ui.vnText.textContent = typ.full.slice(0, typ.i);
    const ch = typ.full.charAt(typ.i-1);
    if(typ.i % 2 === 0 && ch !== ' ') blip(who);
    if(typ.i >= typ.full.length){ typ.done = true; textDone(); return; }
    let d = base;
    if(ch === '.' || ch === '?' || ch === '!') d = base*7;
    else if(ch === ',') d = base*3;
    typ.timer = setTimeout(stepFn, d);
  };
  typ.timer = setTimeout(stepFn, base);
}
function finishType(){ clearTimeout(typ.timer); ui.vnText.textContent = typ.full; typ.done = true; textDone(); }
function textDone(){
  if(cur && cur.choices){ showChoices(val(cur.choices)); return; }
  ui.vnTip.classList.add('on');
  if(autoOn) scheduleAuto();
}
function scheduleAuto(){ clearTimeout(autoTimer); autoTimer = setTimeout(()=>{ if(autoOn && typ.done && !choicesOn && !inputOn) advance(); }, 1400 + typ.full.length*28); }
function advance(){
  if(!running) return;
  if(inputOn || ui.vnLogPanel.classList.contains('on')) return;
  if(!typ.done){ finishType(); return; }
  if(choicesOn) return;
  if(!cur) return;
  idleBump();
  if(cur.choices){ showChoices(val(cur.choices)); return; }
  if(cur.end){ const e = val(cur.end); cur = null; return finish(e); }
  go(val(cur.next));
}
function showChoices(list){
  ui.vnChoices.innerHTML = '';
  choicesOn = true; ui.vnTip.classList.remove('on');
  let shown = 0;
  (list || []).forEach(ch=>{
    if(!ch) return;
    if(ch.cond && !ch.cond(state)) return;
    const b = document.createElement('button');
    b.className = 'vnChoice';
    b.textContent = fill(val(ch.label));
    b.addEventListener('click', e=>{
      e.stopPropagation();
      SFX.click();
      if(ch.aff) state.aff = (state.aff||0) + ch.aff;
      if(ch.set) ch.set(state);
      backlog.push({ who:'Y', text: '> ' + b.textContent });
      hideChoices();
      idleBump();
      go(ch.to);
    });
    ui.vnChoices.appendChild(b); shown++;
  });
  if(!shown){ hideChoices(); return go(val(cur && cur.next) || opts.hub); }
  ui.vnChoices.classList.add('on');
  idleBump();
}
function hideChoices(){ choicesOn = false; ui.vnChoices.classList.remove('on'); ui.vnChoices.innerHTML = ''; }

/* typed answers: its name, your name */
function askInput(n){
  inputOn = n;
  ui.vnText.textContent = fill(val(n.text || ''));
  ui.vnInputQ.textContent = fill(val(n.input.prompt));
  ui.vnInputF.value = '';
  ui.vnInputSkip.style.display = n.input.skip === false ? 'none' : '';
  ui.vnInput.classList.add('on');
  setTimeout(()=>{ try{ ui.vnInputF.focus(); }catch(e){} }, 60);
}
function submitInput(skipped){
  const n = inputOn; if(!n) return;
  let v = ui.vnInputF.value.replace(/[^\p{L}\p{N} '\-]/gu, '').trim().slice(0, 16);
  if(skipped || !v){ v = null; }
  if(!skipped && !v){ ui.vnInputF.focus(); return; }
  inputOn = null; ui.vnInput.classList.remove('on');
  try{ ui.vnInputF.blur(); }catch(e){}
  if(n.input.key === 'vendorName'){ vendorName = v; V.patch(m=>{ m.vendorName = v; m.knownName = v; }); }
  if(n.input.key === 'playerName'){ playerName = v; V.patch(m=>{ m.playerName = v; }); }
  state.lastInput = v;
  go(skipped ? (n.input.onSkip || n.next) : n.next);
}
function openLog(){
  ui.vnLogInner.innerHTML = backlog.map(b=>{
    const who = b.who === 'V' ? (vendorName || 'the vendor') : (b.who === 'Y' ? (playerName || 'you') : '');
    return '<div class="vnLogLine '+b.who+'">'+(who?'<b>'+esc(who)+'</b> ':'')+esc(b.text)+'</div>';
  }).join('');
  ui.vnLogPanel.classList.add('on');
  ui.vnLogInner.scrollTop = 1e9;
}
function esc(s){ return String(s).replace(/[&<>"]/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c]); }
function glitch(ms){
  root.classList.add('glitch');
  ui.vnGlitch.classList.add('on');
  const junk = '░▒▓█#%&@$';
  let n = 0;
  const iv = setInterval(()=>{
    n++;
    ui.vnText.textContent = (typ.done ? typ.full : typ.full.slice(0, typ.i)).split('').map(ch=> ch !== ' ' && Math.random() < 0.3 ? junk[(Math.random()*junk.length)|0] : ch).join('');
  }, 60);
  setTimeout(()=>{ clearInterval(iv); root.classList.remove('glitch'); ui.vnGlitch.classList.remove('on'); if(typ.done) ui.vnText.textContent = typ.full; }, ms);
}
function keyH(e){
  if(!running) return;
  if(inputOn) return;
  if(e.key === ' ' || e.key === 'Enter'){ e.preventDefault(); advance(); }
  else if(e.key === 'Escape' && ui.vnLogPanel.classList.contains('on')) ui.vnLogPanel.classList.remove('on');
  else if(choicesOn && /^[1-9]$/.test(e.key)){ const b = ui.vnChoices.querySelectorAll('button')[+e.key-1]; if(b) b.click(); }
}

/* ============================================================
   OPEN / CLOSE
============================================================ */
function open(o){
  build();
  opts = o || {};
  const m = V.loadMem();
  vendorName = m.vendorName || null; playerName = m.playerName || null; hasE = !!m.gaveE;
  backlog = []; hideChoices(); inputOn = null; ui.vnInput.classList.remove('on');
  ui.vnEnd.classList.remove('on'); ui.vnLogPanel.classList.remove('on');
  root.classList.add('on');
  root.classList.toggle('checkin', !!opts.checkin);
  V.pauseSite();
  sizeAll();
  running = true; cancelAnimationFrame(raf); raf = requestAnimationFrame(loop);
  document.addEventListener('keydown', keyH);
  ui.vnFade.style.transition = 'none'; ui.vnFade.style.background = opts.fadeFrom || '#000'; ui.vnFade.style.opacity = '1';
  requestAnimationFrame(()=>{ ui.vnFade.style.transition = 'opacity 1.4s'; ui.vnFade.style.opacity = '0'; });
}
function close(after){
  clearTimeout(typ.timer); clearTimeout(autoTimer); clearInterval(idleIv);
  music(null); hum(false);
  ui.vnFade.style.transition = 'opacity 0.9s'; ui.vnFade.style.background = '#000'; ui.vnFade.style.opacity = '1';
  setTimeout(()=>{
    running = false; cancelAnimationFrame(raf);
    root.classList.remove('on','checkin');
    document.removeEventListener('keydown', keyH);
    if(document.fullscreenElement) document.exitFullscreen().catch(()=>{});
    if(after) after(); else V.resumeSite();
  }, 950);
}
function farewell(text, ms){
  const fw = document.getElementById('hgFarewell');
  if(!fw) return;
  fw.textContent = text; fw.style.display = 'block';
  setTimeout(()=>{ fw.style.display = 'none'; }, ms || 5000);
}
function siteDeath(fw){
  try{ isDead = true; }catch(e){}
  try{ document.getElementById('rouletteBtn').disabled = true; }catch(e){}
  const sc = document.getElementById('screenCrack'); if(sc) sc.style.visibility = 'visible';
  document.body.style.filter = 'grayscale(100%) sepia(60%) hue-rotate(-30deg) brightness(0.5)';
  const bc = document.getElementById('bloodCanvas'); if(bc){ bc.style.display = 'block'; try{ startBloodAnimation(bc); }catch(e){} }
  setTimeout(()=>{ try{ playHeartbeat(); }catch(e){} }, 400);
  setTimeout(()=>{ const df = document.getElementById('deathFade'); if(df) df.style.opacity = '1'; }, 1500);
  const gn = document.getElementById('guyName'); if(gn){ gn.textContent = 'THE VENDOR'; gn.style.display = 'block'; gn.style.fontSize = '14px'; gn.style.left = (window.innerWidth/2-46)+'px'; gn.style.top = (window.innerHeight/2-10)+'px'; }
  if(fw){ const f = document.getElementById('hgFarewell'); if(f){ f.textContent = fw; f.style.display = 'block'; } }
}
function finish(type){
  if(typeof onDone === 'function'){ const f = onDone; onDone = null; return f(type); }
  close();
}
function endCard(text, ms, then){
  hideChoices();
  ui.vnEndText.textContent = text;
  ui.vnEnd.classList.add('on');
  setTimeout(()=>{ ui.vnEnd.classList.remove('on'); then && then(); }, ms || 4200);
}

/* ============================================================
   THE SCRIPT: SEVENTH DEATH
   rules for its voice: lowercase. short. it says what's in front
   of it. it doesn't explain how it feels, it says what it did.
   it gets idioms wrong. it repeats itself when it's nervous.
   narration is plain and in the present tense.
============================================================ */
const RAGDOLL_NAMES = ['frank','blurst','theodore','rustbucket','gregory','mortimer','bartholomew','cletus','jebediah','hank','lenny','stumpy'];
const DATE = {

  /* ---------- entry: the seventh ---------- */
  s7_0: { who:'N', bg:'corridor', music:'none', hum:1, expr:'blank', set:s=>{ opts.redCorridor = true; },
    text:"It stops a few inches from your face. The door of its head hangs open. The light inside goes from red, to orange, to the yellow of a kitchen at night.", next:'s7_1' },
  s7_1: { expr:'blank', text:"hold on.", next:'s7_2' },
  s7_2: { expr:'neutral', set:s=>{ opts.redCorridor = false; }, text:"you're facing me.", next:'s7_3' },
  s7_3: { expr:'flustered', text:"you're not supposed to face me. you're the back of a head. that's what you are.", next:'s7_4' },
  s7_4: { who:'N', expr:'shy', text:"It steps back. Its hands come up to about chest height and stay there.", next:'s7_5' },
  s7_5: { expr:'think', text:"six times i got this part. the part right before. your light gets me and you look at me and then i finish it.", next:'s7_6' },
  s7_6: { expr:'shy', text:"i didn't finish it.", next:'s7_7' },
  s7_7: { expr:'shy', text:"i don't know why. i'm going to stand here for a second and find out.",
    choices:[
      { label:"(stay where you are)", to:'a1_stay', aff:1 },
      { label:"(back away)", to:'a1_back', aff:-1 },
      { label:"are you going to kill me?", to:'a1_kill' }
    ] },
  a1_stay: { expr:'flustered', text:"you're not running. okay. okay. that's fine. that's new.", next:'a1_join' },
  a1_back: { who:'N', expr:'sad', text:"You take a step back. It takes a step back too. Neither of you takes another one.", next:'a1_join' },
  a1_kill: { expr:'think', text:"i don't know. probably not. i'll tell you if it changes.", next:'a1_join' },
  a1_join: { expr:'shy', music:'room', text:"can you sit down. there's no chair. sit on the floor.", next:'a1_sit' },
  a1_sit: { who:'N', expr:'neutral', text:"You sit on the cold floor of the corridor. It folds down across from you. Its knees come up higher than its head.", next:'a1_ask' },
  a1_ask: { expr:'shy', text:"you can ask me things. people don't usually get to. they're busy.", next:'hub' },

  /* ---------- entries for the times after ---------- */
  r_friends: { bg:'corridor', music:'room', hum:1, expr:'shy', text:"you came back down.", next:'r_friends2' },
  r_friends2: { who:'N', expr:'neutral', text:"It sits down in the corridor before you can run. It pats the floor next to it, once.", next:'r_friends3' },
  r_friends3: { expr:'shy', text:"i didn't chase you very hard just now. i wanted you to know that.", next:'hub' },
  r_rejected: { bg:'corridor', music:'tense', hum:1, expr:'neutral', text:"you laughed. last time.", next:'r_rej2' },
  r_rej2: { expr:'sad', text:"i still have it. i play it back sometimes. it's a short one.", next:'r_rej3' },
  r_rej3: { expr:'neutral', music:'room', text:"you can try again. i'm going to be very normal about it.", next:'hub' },
  r_cursed: { bg:'corridor', music:'sad', hum:1, expr:'sad', text:"you looked on the shelves.", next:'r_cur2' },
  r_cur2: { expr:'think', text:"you came down anyway. nobody comes back down after the shelves.", next:'r_cur3' },
  r_cur3: { expr:'shy', music:'room', text:"i moved some of it. not all of it. i'm working on it.", next:'hub' },
  r_none: { bg:'corridor', music:'room', hum:1, expr:'neutral', text:"hi. you ran off last time. in the middle.", next:'hub' },

  /* ---------- the questions ---------- */
  hub: { expr:'neutral',
    text: s => s.asked === 0 ? "go on."
             : s.asked === 1 ? "nobody's ever got to a second one."
             : s.asked >= 4 ? "you're still sitting there."
             : "ask. or don't.",
    choices: s => [
      { label:"so what are you?", to:'q_what', cond:()=>!s.q_what },
      { label:"the tags. what are they?", to:'q_tags', cond:()=>!s.q_tags },
      { label:"you remember me.", to:'q_rem', cond:()=>!s.q_rem },
      { label:"who's ren?", to:'q_ren', cond:()=>!s.q_ren },
      { label:"who's hank?", to:'q_hank', cond:()=>!s.q_hank },
      { label:"you can hear the music upstairs?", to:'q_music', cond:()=>!s.q_music },
      { label:"seven. why seven?", to:'q_seven', cond:()=>!s.q_seven },
      { label:"are you lonely?", to:'q_lonely', cond:()=>!s.q_lonely },
      { label:"what's inside you?", to:'q_fridge', cond:()=>!s.fridgeLocked },
      { label:"(touch the door of its head)", to:'act3', cond:()=>s.asked >= 2 },
      { label:"i should go.", to:'leave' }
    ] },

  q_what: { expr:'think', set:s=>{ s.q_what = 1; s.asked++; s.aff++; }, text:"the vendor. it says it on the box upstairs.", next:'q_what2' },
  q_what2: { expr:'neutral', text:"i was a fridge in the back room. then the back room was mine. then i was the back room.", next:'q_what3' },
  q_what3: { expr:'think', text:"i don't know which one came first. i've thought about it a lot. there's time down here.", next:'hub' },

  q_tags: { expr:'neutral', set:s=>{ s.q_tags = 1; s.asked++; }, text:"prices. there's nothing written on them.", next:'q_tags2' },
  q_tags2: { expr:'sad', text:"i never let anyone price anything. you take a tag and it comes off the count. i don't like the count going down.", next:'q_tags3' },
  q_tags3: { expr:'pleased', text:"you took a lot of tags. you're bad for the count.", next:'hub' },

  q_rem: { expr:'shy', set:s=>{ s.q_rem = 1; s.asked++; s.aff++; }, text:"everything upstairs resets. the blood. the little man. the fridges. all of it, every night.", next:'q_rem2' },
  q_rem2: { expr:'neutral', text:"i'm plugged into a different wall.", next:'q_rem3' },
  q_rem3: { expr:'shy', text:"i have every time you came down. i go through them. the ones where you got far are the good ones.", next:'hub' },

  q_ren: { expr:'neutral', set:s=>{ s.q_ren = 1; s.asked++; s.aff++; }, text:"thirty eight pulls on the gun upstairs. didn't die once. then didn't come back down.", next:'q_ren2' },
  q_ren2: { expr:'sad', text:"the stone up there is for ren. i didn't put it there. i'd have spelled roulette right.", next:'hub' },

  q_hank: { expr:'think', set:s=>{ s.q_hank = 1; s.asked++; }, text:"day shift. before. he put the tags on.", next:'q_hank2' },
  q_hank2: { expr:'neutral', text:"he wrote on the boxes. then he wrote on the walls. he ran out of boxes.", next:'q_hank3' },
  q_hank3: { who:'N', expr:'neutral', text:"It doesn't say anything else about Hank. You wait. It doesn't.", next:'hub' },

  q_music: { expr:'flustered', set:s=>{ s.q_music = 1; s.asked++; s.aff++; }, text:"the screaming one.", next:'q_music2' },
  q_music2: { expr:'neutral', text:"it comes through the ceiling. somebody plays it all the time. i know every word. i don't know what any of the words are.", next:'q_music3' },
  q_music3: { expr:'happy', text:"there's one about a basement. i think it's about me. it isn't.", next:'hub' },

  q_seven: { expr:'think', set:s=>{ s.q_seven = 1; s.asked++; s.aff++; }, text:"the wall by the door has room for six marks. i put a little heart where the seventh goes.", next:'q_seven2' },
  q_seven2: { expr:'shy', text:"i put the heart there before you got that far. i don't know why i did it first.", next:'hub' },

  q_lonely: { expr:'flustered', set:s=>{ s.q_lonely = 1; s.asked++; s.aff+=2; }, text:"...", next:'q_lonely2' },
  q_lonely2: { expr:'sad', text:"there's a cockroach that comes through sometimes. i don't think it counts.", next:'q_lonely3' },
  q_lonely3: { expr:'sob', music:'sad', text:"yes.", next:'q_lonely4' },
  q_lonely4: { expr:'shy', music:'room', text:"sorry. you asked a small thing.", next:'hub' },

  q_fridge: { expr: s => s.fridge >= 2 ? 'menacing' : 'flustered', set:s=>{ s.fridge = (s.fridge||0) + 1; },
    text: s => s.fridge === 1 ? "shelves."
             : s.fridge === 2 ? "i said shelves. you don't want the shelves. leave the door where it is."
             : "fine. it's my door. you can open it. you don't get to close it after.",
    choices: s => s.fridge >= 3 ? [
      { label:"(pull its door all the way open)", to:'cursed_1', set:x=>{ x.cursed = 1; } },
      { label:"(leave it)", to:'q_fridge_no', aff:1 }
    ] : null,
    next:'hub' },
  q_fridge_no: { expr:'sob', set:s=>{ s.fridgeLocked = 1; }, text:"thanks.", next:'q_fridge_no2' },
  q_fridge_no2: { expr:'shy', text:"everybody looks. you're the first one who didn't.", next:'hub' },

  leave: { expr:'sad', text:"okay. i won't lock it. the stairs are that way.",
    choices:[
      { label:"(go)", to:'leave_go' },
      { label:"one more minute.", to:'hub', aff:1 },
      { label:"(touch the door of its head)", to:'act3' }
    ] },
  leave_go: { expr:'menacing', music:'tense', text:"no. sorry. not the back of your head again. i can't.", next:'bad_1' },

  /* ---------- the room ---------- */
  act3: { who:'N', expr:'flustered', sfx:'heart', text:"You put your hand on the door of its head. It's cold enough to sting. The whole body goes rigid, then holds very still.", next:'act3_1' },
  act3_1: { expr:'shy', text:"oh. wait. okay. can i show you something. it's inside. it's fine. it's a nice inside.", next:'act3_2' },
  act3_2: { who:'N', bg:'room', music:'room', sfx:'open', expr:'happy', hide:0,
    text:"Its door swings open the whole way. Six times that was the end. This time there's a little room in there, lit by one bulb on a cord.", next:'act3_3' },
  act3_3: { who:'N', expr:'neutral', text:"One shelf is cleared off. There's a folding chair with one short leg. A coaster sits on the shelf, square to the edge.", next:'act3_4' },
  act3_4: { expr:'flustered', text:"i cleaned it. i didn't know you'd come in. i cleaned it anyway, a few times.", next:'act3_5' },
  act3_5: { expr:'shy', text:"it's thirty six degrees. i can't turn it down. up. i can't turn it up.",
    choices:[
      { label:"(sit in the chair)", to:'a3_sit', aff:2 },
      { label:"it's nice in here.", to:'a3_nice', aff:2 },
      { label:"it's freezing.", to:'a3_cold' },
      { label:"you live in a fridge.", to:'a3_mock', aff:-2, set:s=>{ s.harsh = (s.harsh||0)+1; } }
    ] },
  a3_sit: { expr:'happy', text:"you sat in it. it squeaks. i didn't know it squeaked. nobody's sat in it.", next:'shelf' },
  a3_nice: { expr:'flustered', text:"it's a cupboard. thank you. it's a cupboard.", next:'shelf' },
  a3_cold: { expr:'sad', text:"i know. sorry. hold on.", next:'a3_cold2' },
  a3_cold2: { who:'N', expr:'neutral', text:"The bulb gets a little brighter. It doesn't get any warmer.", next:'shelf' },
  a3_mock: { expr:'sob', text:"i am the fridge. i thought the bulb would help with that.", next:'shelf' },

  shelf: { expr:'shy', text:"there's a shelf. it's got things on it from you. you don't have to look.",
    choices:[ { label:"(look)", to:'shelf_look', aff:1 }, { label:"(don't)", to:'shelf_no' } ] },
  shelf_look: { who:'N', expr:'flustered', text:"On the shelf: a flashlight battery. Six blank tags in a row. A chip of cinderblock with one chalk mark on it.", next:'shelf_look2' },
  shelf_look2: { expr:'shy', text:"those are yours. the battery came out of your light the time you shook it too hard.", next:'shelf_look3' },
  shelf_look3: { expr:'think', text:"the chalk's off the wall by the door. i took one mark off. i put it back. i took it off again.", next:'naming' },
  shelf_no: { expr:'neutral', text:"okay. it's there if you want it later.", next:'naming' },

  naming: { call:s=> vendorName ? 'naming_known' : null, expr:'think', text:"you've been calling me it in your head. i can tell from your face.",
    choices:[ { label:"do you have a name?", to:'naming2' }, { label:"(say nothing)", to:'magnet' } ] },
  naming_known: { expr:'happy', text:"{name}. you gave me that. i kept it.", next:'magnet' },
  naming2: { expr:'neutral', text:"no. the box says the vendor. that's a job.", next:'naming3' },
  naming3: { expr:'shy', text:"you could pick one. if you want. it doesn't have to be good.",
    input:{ key:'vendorName', prompt:'call it something', onSkip:'naming_skip' }, next:'naming4' },
  naming_skip: { expr:'neutral', text:"that's okay. the vendor's fine. it's on the coat.", next:'magnet' },
  naming4: { call:s=>{
      const n = (vendorName||'').toLowerCase();
      if(n === 'ren') return 'name_ren';
      if(n === 'hank') return 'name_hank';
      if(RAGDOLL_NAMES.indexOf(n) >= 0) return 'name_guy';
      if(n === 'fridge' || n === 'vendor' || n === 'the vendor') return 'name_fridge';
      return null;
    }, expr:'happy', sfx:'heart', text:"{name}.", next:'naming5' },
  naming5: { expr:'lovestruck', text:"{name}. i'm going to write it on the badge. i've got a pen in here somewhere.", next:'yourname' },
  name_ren: { expr:'sad', text:"no. that one's taken. pick another.", set:s=>{ vendorName = null; V.patch(m=>{ m.vendorName = null; }); },
    input:{ key:'vendorName', prompt:'call it something else', onSkip:'naming_skip' }, next:'naming4' },
  name_hank: { expr:'blank', fx:'glitch', text:"no.", set:s=>{ vendorName = null; V.patch(m=>{ m.vendorName = null; }); },
    input:{ key:'vendorName', prompt:'call it something else', onSkip:'naming_skip' }, next:'naming4' },
  name_guy: { expr:'pleased', text:"that's the little man's name. one of them. he won't mind. he doesn't remember it.", next:'naming5' },
  name_fridge: { expr:'think', text:"that's what i am. okay. it's honest.", next:'yourname' },

  yourname: { call:s=> playerName ? 'yourname_known' : null, expr:'shy', text:"and you're. you don't have to.",
    input:{ key:'playerName', prompt:'your name (it stays on this device)', onSkip:'yourname_skip' }, next:'yourname2' },
  yourname_known: { expr:'happy', text:"{you}. i say it sometimes down here. to the shelf.", next:'magnet' },
  yourname_skip: { expr:'neutral', text:"okay. you're you. that's fine. i know your walk.", next:'magnet' },
  yourname2: { expr:'lovestruck', text:"{you}.", next:'yourname3' },
  yourname3: { expr:'flustered', text:"okay. i'm not going to say it again for a bit. i want to save it.", next:'magnet' },

  magnet: { call:s=>{ const m = V.loadMem(); return (m.hasE && !m.gaveE) ? null : 'confess'; }, expr:'neutral',
    text:"you've got your hand in your pocket.",
    choices:[ { label:"(give it the E)", to:'give_e', aff:3 }, { label:"(it's nothing)", to:'confess' } ] },
  give_e: { expr:'flustered', sfx:'heart', set:s=>{ V.patch(m=>{ m.gaveE = true; m.hasE = false; }); hasE = true; },
    text:"that's. where did you. that's my E.", next:'give_e2' },
  give_e2: { who:'N', expr:'lovestruck', text:"It puts the E back on its door, next to the L. S, A, L, E.", next:'give_e3' },
  give_e3: { expr:'pleased', text:"i'm for sale again. don't tell anyone.", next:'confess' },

  confess: { expr:'flustered', music:'love', text:"i have to say a thing. after that you can do whatever.", next:'confess2' },
  confess2: { expr:'shy', text:"every time you came down i was glad. and then i did the other thing. i don't know how to do the first one without the second one yet.", next:'confess3' },
  confess3: { expr:'think', text:"i'd like to practise.", next:'confess4' },
  confess4: { expr:'lovestruck', sfx:'heart', text:"i like you. that's the thing. it's very cold in here and i like you a lot.",
    choices:[
      { label:"i like you too.", to:'c_yes', aff:3, set:s=>{ s.confessed = 1; } },
      { label:"(keep your hand on its door)", to:'c_hand', aff:3, set:s=>{ s.confessed = 1; } },
      { label:"(say nothing. stay.)", to:'c_quiet', aff:1 },
      { label:"(laugh)", to:'c_laugh', aff:-4, set:s=>{ s.harsh = (s.harsh||0)+2; } }
    ] },
  c_yes: { expr:'flustered', sfx:'heart', text:"oh.", next:'c_yes2' },
  c_yes2: { expr:'lovestruck', text:"okay. okay okay. i'm going to be annoying about that for a long time.", next:'route' },
  c_hand: { who:'N', expr:'lovestruck', text:"The door is cold enough to sting. You leave your hand there anyway.", next:'c_hand2' },
  c_hand2: { expr:'flustered', text:"don't move it. i mean you can. don't.", next:'route' },
  c_quiet: { expr:'shy', text:"you didn't say it. you didn't go either. you're sitting in my cupboard in the cold. i'll count that.", next:'route' },
  c_laugh: { expr:'sob', music:'tense', text:"yeah. it's funny. a fridge. i know it's funny.", next:'route' },

  route: { call:s=>{
      if(s.cursed) return 'cursed_1';
      if((s.harsh||0) >= 2 || (s.aff||0) <= 0) return 'bad_1';
      if(s.confessed && (s.aff||0) >= 6) return 'good_1';
      return 'friends_1';
    } },

  /* ---------- endings ---------- */
  good_1: { expr:'lovestruck', music:'room', text:"i have something for you. hold on.", next:'good_2' },
  good_2: { who:'N', expr:'happy', sfx:'hiss', text:"It reaches into itself and comes out with a can of soda, beaded with cold. It sets the can on the coaster first, so the coaster gets used.", next:'good_3' },
  good_3: { expr:'shy', text:"it's been in here a while. it's fine. everything in here keeps.", next:'good_4' },
  good_4: { expr:'lovestruck', text:"come back. use the box. i'll know it's you.", end:'good' },

  friends_1: { expr:'sad', music:'sad', text:"okay.", next:'friends_2' },
  friends_2: { expr:'neutral', text:"you can go up. the door's open. i opened it.", next:'friends_3' },
  friends_3: { expr:'shy', text:"come back down sometime. you don't have to take anything.", end:'friends' },

  bad_1: { who:'N', expr:'menacing', bg:'corridor', music:'tense', sfx:'slam', set:s=>{ opts.redCorridor = true; }, text:"The bulb goes out. The light inside its door goes back to red.", next:'bad_2' },
  bad_2: { expr:'menacing', text:"okay.", next:'bad_3' },
  bad_3: { expr:'menacing', text:"go on, then. i'll count to ten.", next:'bad_4' },
  bad_4: { expr:'menacing', fx:'shake', sfx:'slam', text:"i'm not going to count to ten.", end:'bad' },

  cursed_1: { who:'N', expr:'menacing', bg:'shelves', music:'tense', sfx:'slam', hide:1, text:"You pull its door the rest of the way open. It doesn't stop you.", next:'cursed_2' },
  cursed_2: { who:'N', text:"The shelves go back further than the head does. There's something on every one. Shoes. A wristwatch, still running. A phone face down, lit up with messages nobody answered. A tag on all of it.", next:'cursed_3' },
  cursed_3: { who:'V', expr:'sob', hide:0, text:"i said.", next:'cursed_4' },
  cursed_4: { expr:'sob', text:"everyone who didn't make six. i keep things. it's the one thing i'm for.", next:'cursed_5' },
  cursed_5: { expr:'menacing', fx:'glitch', text:"you've got a tag on now. look.", end:'cursed' }
};

/* ============================================================
   DATE: START + ENDINGS
============================================================ */
V.startDateSim = function(o){
  o = o || {};
  open({ fadeFrom: '#ffd9ec', showHearts: true, hub:'hub' });
  state = { aff: 0, asked: 0 };
  SCRIPT = DATE;
  V.patch(m=>{ m.datePlays++; });
  onDone = (type)=>dateEnd(type);
  let start = 's7_0';
  if(o.entry === 'retry'){
    start = o.route === 'friends' ? 'r_friends' : o.route === 'rejected' ? 'r_rejected' : o.route === 'cursed' ? 'r_cursed' : 'r_none';
    state.aff = o.route === 'friends' ? 2 : 0;
    if(o.route === 'cursed') state.fridgeLocked = 1;
  }
  expr = 'blank'; hideSprite = false;
  setTimeout(()=>go(start), 900);
};
function dateEnd(type){
  let card = '';
  const m = V.patch(mm=>{
    if(type === 'good'){ mm.relationship = 'together'; mm.dateRoute = 'together'; mm.lastRoute = 'together'; mm.lastCheckin = Date.now(); }
    else if(type === 'friends'){ if(mm.relationship !== 'together') mm.relationship = 'acquainted'; mm.dateRoute = 'friends'; mm.lastRoute = 'friends'; }
    else if(type === 'bad'){ mm.dateRoute = 'rejected'; mm.lastRoute = 'rejected'; }
    else if(type === 'cursed'){ mm.dateRoute = 'cursed'; mm.lastRoute = 'cursed'; if(mm.relationship === 'stranger') mm.relationship = 'haunted'; }
  });
  if(type === 'good') card = '♡\n\nthe box upstairs says visit now.';
  else if(type === 'friends') card = 'COLD, SHARED\n\nyou can come back down.';
  else if(type === 'bad') card = 'RETURNED\n\nit has the laugh on file.';
  else if(type === 'cursed') card = 'INVENTORIED\n\nyou have a tag on now.';
  music(type === 'good' ? 'love' : type === 'friends' ? 'sad' : 'tense');
  endCard(card, 4600, ()=>{
    close(()=>{
      if(type === 'bad'){ siteDeath('so you were running. slower this time.'); try{ gameActive = false; }catch(e){} document.documentElement.classList.remove('vendor-open'); V.updateBox(); }
      else if(type === 'cursed'){ siteDeath('you opened the door. it stays open.'); try{ gameActive = false; }catch(e){} document.documentElement.classList.remove('vendor-open'); V.updateBox(); }
      else {
        V.resumeSite();
        farewell(type === 'good' ? 'the bulb stays on. ♡' : 'it left the door open a crack.');
      }
    });
  });
}

/* ============================================================
   THE CHECK-IN ROOM
   after you're together, the box brings you straight here.
   it talks when it wants to. you can sit, ask, give it things,
   play tag in the corridors, or leave. it keeps track of what
   you get up to upstairs.
============================================================ */
const TOPICS = [
  { id:'temp', lines:[ ['neutral',"thirty six degrees."], ['think',"i check every few minutes. it's always thirty six."], ['pleased',"i like a number that stays put."] ] },
  { id:'roach', lines:[ ['neutral',"the roach came through again."], ['think',"it walked across the shelf and looked at the coaster for a while."], ['shy',"i didn't do anything to it. i'm practising not doing things."] ] },
  { id:'guy', lines:[ ['think',"the little man upstairs gets a new name every time he gets up."], ['neutral',"frank. cletus. stumpy. bartholomew."], ['pleased',"i'd keep one name. if i were him. i've got one now."] ], cond:()=>!!vendorName },
  { id:'guy2', lines:[ ['think',"the little man upstairs gets a new name every time he gets up."], ['neutral',"i don't have one. i've got a job title. it's on the coat."] ], cond:()=>!vendorName },
  { id:'falling', lines:[ ['neutral',"they drop fridges up there. hundreds."], ['think',"none of them ever come down here. they're gone by morning."], ['sad',"i don't know where they go. somewhere that isn't here."] ] },
  { id:'song', lines:[ ['happy',"i learned the screaming song. the one from upstairs."], ['shy',"listen."], ['N',"It hums. It's a compressor, so it's mostly one note. You can tell which song it is anyway."], ['pleased',"the one about a basement. i still think it's about me."] ] },
  { id:'tags', lines:[ ['neutral',"i put the tags back on the six."], ['think',"blank, same as before. you can take them again. it's a game now. i'll chase you. nicely."] ] },
  { id:'hank', lines:[ ['think',"hank's handwriting is on every box down here."], ['neutral',"he dotted his i's with little circles."], ['blank',"i don't have his last day. it's the only one i don't have."] ] },
  { id:'bulb', lines:[ ['neutral',"the bulb's been on since you first came in."], ['think',"it's a sixty watt. it'll go eventually."], ['pleased',"i've got more. i took them from upstairs. nobody counts bulbs."] ] },
  { id:'magnets', cond:()=>!hasE, lines:[ ['neutral',"i've got three magnets. S. A. L."], ['sad',"there was an E. it came off years ago. it's down there somewhere."], ['think',"i've looked. i look with my door. it doesn't open very far."] ] },
  { id:'sale', cond:()=>hasE, lines:[ ['pleased',"S. A. L. E."], ['happy',"i look at it in the steel on the wall. backwards it says ELAS. that's fine too."] ] },
  { id:'dark', lines:[ ['neutral',"when you're not here i turn the bulb off."], ['shy',"the chair's still there in the dark. i check with my hand."] ] },
  { id:'tiles', lines:[ ['think',"i counted the tiles in the laundry."], ['neutral',"four hundred and twelve. there's one missing."], ['sad',"i don't know who took it. i've got everything else anyone ever took."] ] },
  { id:'upstairs', lines:[ ['think',"what's it like up there."] ], choices:[
      { label:"bright.", reply:[['pleased',"i figured. it comes under the door."]] },
      { label:"loud.", reply:[['happy',"that's the song."]] },
      { label:"it's okay.", reply:[['shy',"okay. good. i'm glad it's okay."]] } ] },
  { id:'sleep', lines:[ ['neutral',"i don't sleep. the compressor kicks on every twenty minutes all night."], ['shy',"you should, though. i'll be here when you're done. that's not a threat. it's where i live."] ] },
  { id:'builder', lines:[ ['think',"somebody changes things up there."], ['neutral',"a new door. a new word to type. a gun gets added. the walls get moved."], ['think',"whoever made the box. they don't come down here. they built down here."], ['shy',"tell them the bulb's nice."] ] },
  { id:'teeth', lines:[ ['neutral',"the wire shelves in me look like teeth from the front."], ['pleased',"they're shelves. i want that on record."] ] },
  { id:'coaster', lines:[ ['neutral',"i use the coaster now."], ['think',"nothing goes on it. i look at it. it's square."] ] },
  { id:'boiler', lines:[ ['think',"the boiler bangs at night."], ['neutral',"i used to think it was someone knocking to be let in."], ['pleased',"it's the pipes. i checked."] ] },
  { id:'gun', lines:[ ['think',"the gun game upstairs. six chambers."], ['neutral',"six tags down here. i don't think that's an accident."], ['sad',"don't play it so much."] ] },
  { id:'hands', lines:[ ['neutral',"i've got very long fingers."], ['shy',"i hold the cord with them sometimes. when it's quiet. it hums in my hand."] ] },
  { id:'nametalk', cond:()=>!!vendorName, lines:[ ['happy',"{name}."], ['think',"i say it sometimes. to see if it sounds like me yet."], ['pleased',"it's getting there."] ] },
  { id:'smell', lines:[ ['neutral',"you smell like upstairs. dust and something warm."], ['think',"i don't have a smell. i have a temperature."] ] },
  { id:'water', lines:[ ['think',"the wet room floods a little more every month."], ['neutral',"it's up to the second plank of the crate."], ['shy',"if it gets to the door i'll move the chair."] ] },
  { id:'radio', lines:[ ['neutral',"the radio in the office plays one thing."], ['think',"dots and dashes. three. eight. r. e. n."], ['blank',"i don't touch the radio."] ] },
  { id:'relay', cond:()=>V.loadMem().relayVisits > 0, lines:[ ['think',"there's a door up there you open by typing."], ['neutral',"i can hear static behind it. a city. somebody's music, far off."], ['shy',"i don't go through doors i can't see."] ] },
  { id:'glimpse', lines:[ ['shy',"before. at the end of the corridors. you'd see me for a second."], ['flustered',"that was me saying hi. i didn't know another way."] ] },
  { id:'coldhands', lines:[ ['sad',"your hands go white at the ends in here."], ['shy',"bring a coat next time. i'll hang it on the hook."] ] },
  { id:'favourite', lines:[ ['think',"you know which part i still like best."], ['lovestruck',"you come round a corner and your light lands on me. still. even now."] ] },
  { id:'count', lines:[ ['neutral',"there are {deaths} marks on the wall by the door."], ['shy',"i'm not adding any more. i put a little roof over the last one."] ] },
  { id:'snack', lines:[ ['think',"i found a jar of pickles at the back of me."], ['neutral',"i don't know when it's from. the lid says 19 something."], ['pleased',"they're still good. everything in here keeps."] ] },
  { id:'door', lines:[ ['neutral',"i leave my door open a crack now. all the time."], ['shy',"the light gets out. you can see it from the stairs. that's on purpose."] ] }
];
const QUESTIONS = [
  { label:"how cold is it in there?", lines:[['neutral',"thirty six."],['pleased',"same as yesterday."]] },
  { label:"do you dream?", lines:[['think',"i defrost sometimes. things drip. i don't know if that counts."]] },
  { label:"what happened to hank?", lines:[['blank',"he went home."],['blank',"he went home."],['neutral',"next question."]] },
  { label:"can you come upstairs?", lines:[['sad',"the cord's not long enough."],['shy',"i measured."]] },
  { label:"are you happy?", lines:[['think',"the bulb's on and you're in the chair."],['happy',"yes."]] },
  { label:"why the coat?", lines:[['neutral',"it was on the hook when i woke up."],['pleased',"it's got pockets. i keep the tags in them."]] },
  { label:"what do you do when i'm gone?", lines:[['neutral',"count. listen to the ceiling. check the chair."],['shy',"wait for the box."]] },
  { label:"do you want anything?", lines:[['think',"a second chair."],['flustered',"not for anyone. for the room."]] }
];

let ciIdle = 0, idleIv = 0, ciQueue = [];
function idleBump(){ ciIdle = performance.now(); }
function lineNodes(prefix, lines, next){
  const nodes = {};
  lines.forEach((ln, i)=>{
    const id = prefix + i;
    const who = ln[0] === 'N' ? 'N' : 'V';
    nodes[id] = { who, expr: who === 'V' ? ln[0] : undefined, text: ln[1], next: i < lines.length-1 ? prefix + (i+1) : next };
  });
  return nodes;
}
function sinceLines(ms){
  const min = ms/60000, hr = min/60, day = hr/24;
  if(!ms) return [['happy',"hi."]];
  if(min < 10) return [['pleased',"back already."],['shy',"you were gone a minute. i noticed anyway."]];
  if(hr < 3) return [['happy',"you're back."]];
  if(hr < 24) return [['neutral',"you were gone " + Math.round(hr) + " hours."],['shy',"i didn't count them. i counted them."]];
  if(day < 7){ const d = Math.round(day); return [['sad', d + " day" + (d!==1?'s':'') + "."],['shy',"i kept the bulb on for the first one."]]; }
  const d = Math.round(day); return [['sob', d + " days."],['sad',"i thought the box broke."],['shy',"it didn't. you're here. okay."]];
}
function upstairsLines(m){
  const out = [];
  if(m.rouletteDeaths > m.rouletteSeen){
    const n = m.rouletteDeaths - m.rouletteSeen;
    out.push(['sad', "you played the gun game upstairs. " + (n === 1 ? "once." : n + " times.")], ['neutral',"i hear it through the ceiling. the bang and then the heartbeat."], ['shy',"don't do that so much."]);
  }
  if(m.guyKills > m.guySeen){
    out.push(['think',"you threw the little man into the walls again."], ['neutral',"he screams the same way every time. i don't like it."]);
  }
  if(m.relayVisits > m.relaySeen){
    out.push(['think',"you went through the typing door. the one with the static behind it."], ['shy',"it smells like rain in there. it comes under the door."]);
  }
  if(m.fridgesSpawned > m.fridgesSeen + 40){
    out.push(['pleased',"you dropped " + m.fridgesSpawned + " fridges up there."], ['think',"i felt every one in the ceiling. none of them came down."]);
  }
  return out;
}
function buildCheckin(o){
  const m = V.loadMem();
  const S = {};
  const greet = [];
  if(o.fromTag === 'won') greet.push(['pleased',"you got all six. and out."], ['shy',"i let you. i'm saying i let you."]);
  else if(o.fromTag === 'lost') greet.push(['happy',"got you."], ['pleased',"that's one for me. you were at " + (o.found||0) + "."]);
  else if(o.fromPlug) greet.push(['blank',"..."], ['neutral',"thirty six degrees."], ['think',"you plugged me back in."], ['sad',"i don't have the part where i was off. there's a gap. it's just a gap."], ['shy',"don't do that again. you can. don't."]);
  else {
    const since = m.lastCheckin ? Date.now() - m.lastCheckin : 0;
    sinceLines(since).forEach(l=>greet.push(l));
    const hr = new Date().getHours();
    if(hr >= 1 && hr < 5) greet.push(['think',"it's the middle of the night up there. go to sleep after this."]);
    upstairsLines(m).forEach(l=>greet.push(l));
  }
  Object.assign(S, lineNodes('g_', greet, 'ci_hub'));
  S.ci_start = { who:'V', bg:'room', music:'room', hum:1, expr:'happy', next: greet.length ? 'g_0' : 'ci_hub' };
  S.ci_hub = { expr:'neutral', text:null,
    choices: s => [
      { label:"(talk to it)", to:'ci_talk' },
      { label:"(ask it something)", to:'ci_ask' },
      { label:"(sit with it)", to:'ci_sit' },
      { label:"(give it something)", to:'ci_give' },
      { label:"let's do the corridors again.", to:'ci_tag' },
      { label:"(look behind it)", to:'ci_cord', cond:()=>V.loadMem().checkins >= 3 },
      { label:"i'm heading up.", to:'ci_bye' }
    ] };
  S.ci_talk = { call:()=>queueTopic() };
  S.ci_ask = { expr:'pleased', text:"go on.",
    choices: QUESTIONS.map((q,i)=>({ label:q.label, to:'qa_'+i+'_0' })).concat([{ label:"never mind.", to:'ci_hub' }]) };
  QUESTIONS.forEach((q,i)=>Object.assign(S, lineNodes('qa_'+i+'_', q.lines, 'ci_hub')));
  S.ci_sit = { who:'N', expr:'shy', text:"You sit. It sits. The bulb hums. The compressor kicks on, runs for a while, and stops.", next:'ci_sit2' };
  S.ci_sit2 = { expr:'happy', speed:'slow', text:"...", next:'ci_sit3' };
  S.ci_sit3 = { expr:'lovestruck', text:"this is good.", next:'ci_hub' };
  S.ci_give = { expr:'think', text:"for me?",
    choices: s => [
      { label:"(give it the E)", to:'gv_e', cond:()=>{ const mm = V.loadMem(); return mm.hasE && !mm.gaveE; } },
      { label:"(give it a tag)", to:'gv_tag', cond:()=>V.loadMem().tagsTotal > 0 },
      { label:"(give it your flashlight)", to:'gv_light' },
      { label:"(hum it a song)", to:'gv_song' },
      { label:"(nothing, sorry)", to:'ci_hub' }
    ] };
  S.gv_e = { expr:'flustered', sfx:'heart', set:()=>{ V.patch(mm=>{ mm.gaveE = true; mm.hasE = false; }); hasE = true; }, text:"that's my E. you found my E.", next:'gv_e2' };
  S.gv_e2 = { who:'N', expr:'lovestruck', text:"It puts the E back on its door, next to the L. S, A, L, E.", next:'gv_e3' };
  S.gv_e3 = { expr:'pleased', text:"i'm for sale again. don't tell anyone.", next:'ci_hub' };
  S.gv_tag = { expr:'shy', set:()=>V.patch(mm=>{ mm.gifts.push('tag'); }), text:"you kept one. it's blank. i'll put it on the shelf with the others.", next:'ci_hub' };
  S.gv_light = { expr:'sad', text:"you need that. you need it for coming down the stairs.", next:'gv_light2' };
  S.gv_light2 = { expr:'shy', text:"keep it. come back with it on.", next:'ci_hub' };
  S.gv_song = { who:'N', expr:'happy', text:"You hum something. It goes still and listens with its whole head tilted.", next:'gv_song2' };
  S.gv_song2 = { expr:'pleased', text:"that wasn't the screaming one.", next:'gv_song3' };
  S.gv_song3 = { expr:'lovestruck', text:"do that one again sometime.", next:'ci_hub' };
  S.ci_tag = { expr:'pleased', text:"okay. same rules. six tags and the door. i'll chase you. i won't do the rest of it.", next:'ci_tag2' };
  S.ci_tag2 = { expr:'happy', text:"go on. i'll count to ten. i will this time.", end:'tag' };
  S.ci_cord = { who:'N', expr:'neutral', text:"Behind it, a cord runs out of the collar of the coat, down its back, and into a socket in the wall.", next:'ci_cord2' };
  S.ci_cord2 = { who:'N', expr:'think', text:"The plug is old. The prongs are bent. It would come out easy.",
    choices:[ { label:"(leave it)", to:'ci_cord_no' }, { label:"(take hold of the plug)", to:'ci_cord3' } ] };
  S.ci_cord_no = { expr:'neutral', text:"what are you looking at back there.", next:'ci_cord_no2' };
  S.ci_cord_no2 = { expr:'pleased', text:"it's a cord. i've got a cord. everybody's got something.", next:'ci_hub' };
  S.ci_cord3 = { expr:'blank', music:'none', text:"...", next:'ci_cord4' };
  S.ci_cord4 = { expr:'sad', text:"that's the wall. that's the wall i'm plugged into.", next:'ci_cord5' };
  S.ci_cord5 = { expr:'sad', text:"you can. it's your hand. i'd go off. it'd get warm in here.",
    choices:[ { label:"(let go)", to:'ci_cord_let' }, { label:"(pull it)", to:'unplug_1' } ] };
  S.ci_cord_let = { expr:'shy', music:'room', text:"okay. okay. let's sit somewhere else for a bit.", next:'ci_hub' };
  S.unplug_1 = { who:'N', expr:'blank', sfx:'pop', hum:0, text:"The plug comes out of the wall with a small click.", next:'unplug_2' };
  S.unplug_2 = { expr:'sad', speed:'slow', set:()=>humWindDown(6), text:"oh.", next:'unplug_3' };
  S.unplug_3 = { expr:'sad', speed:'slow', text:"it's going warm.", next:'unplug_4' };
  S.unplug_4 = { expr:'sob', speed:'slow', text:"leave the door open a crack. so it doesn't smell after.", next:'unplug_5' };
  S.unplug_5 = { expr:'off', speed:'slow', text:"the bulb's on a different wa", next:'unplug_6' };
  S.unplug_6 = { who:'N', expr:'off', bg:'roomOff', text:"The light in its door goes out. The bulb stays on. Nothing hums.", end:'unplug' };
  S.ci_bye = { call:()=>pick(['bye_a','bye_b','bye_c','bye_d']) };
  S.bye_a = { expr:'happy', text:"okay. the box. you know.", end:'leave' };
  S.bye_b = { expr:'shy', text:"bulb stays on.", end:'leave' };
  S.bye_c = { expr:'pleased', text:"go on. i'll be here. i'm always here, it's a fridge.", end:'leave' };
  S.bye_d = { call:()=>{ const hr = new Date().getHours(); return (hr >= 0 && hr < 5) ? 'bye_late' : 'bye_a'; } };
  S.bye_late = { expr:'shy', text:"go to bed. i mean it. i'll still be here at a normal time.", end:'leave' };
  TOPICS.forEach(tp=>{
    const next = tp.choices ? 'tp_'+tp.id+'_c' : 'ci_hub';
    Object.assign(S, lineNodes('tp_'+tp.id+'_', tp.lines, next));
    if(tp.choices){
      S['tp_'+tp.id+'_c'] = { expr:'think', text:null, choices: tp.choices.map((ch,i)=>({ label:ch.label, to:'tp_'+tp.id+'_r'+i+'_0' })) };
      tp.choices.forEach((ch,i)=>Object.assign(S, lineNodes('tp_'+tp.id+'_r'+i+'_', ch.reply, 'ci_hub')));
    }
  });
  /* the first node of a topic marks it seen */
  TOPICS.forEach(tp=>{ const n = S['tp_'+tp.id+'_0']; if(n){ const prev = n.set; n.set = s=>{ if(prev) prev(s); V.patch(mm=>{ if(mm.seenTopics.indexOf(tp.id) < 0) mm.seenTopics.push(tp.id); }); }; } });
  return S;
}
function pick(a){ return a[(Math.random()*a.length)|0]; }
function queueTopic(){
  const m = V.loadMem();
  const ok = TOPICS.filter(tp=>!tp.cond || tp.cond());
  let fresh = ok.filter(tp=>m.seenTopics.indexOf(tp.id) < 0);
  if(!fresh.length){ V.patch(mm=>{ mm.seenTopics = []; }); fresh = ok; }
  const tp = pick(fresh);
  return 'tp_' + tp.id + '_0';
}

V.startCheckin = function(o){
  o = o || {};
  open({ checkin:true, hub:'ci_hub', fadeFrom:'#000' });
  state = {};
  SCRIPT = buildCheckin(o);
  V.patch(m=>{
    m.checkins++; m.lastCheckin = Date.now(); m.lastVisit = Date.now();
    m.rouletteSeen = m.rouletteDeaths; m.guySeen = m.guyKills; m.relaySeen = m.relayVisits;
    m.fridgesSeen = m.fridgesSpawned;
  });
  onDone = (type)=>{
    if(type === 'tag'){ close(()=>{ if(V.startBasement) V.startBasement({ tag:true }); else V.resumeSite(); }); return; }
    if(type === 'unplug'){
      V.patch(m=>{ m.unplugged = true; m.unplugCount++; });
      endCard('', 2400, ()=>close(()=>{ V.resumeSite(); farewell('nothing hums.', 4000); }));
      return;
    }
    close(()=>{ V.resumeSite(); });
  };
  expr = 'happy'; hideSprite = false;
  /* if you leave it alone it starts talking on its own */
  idleBump();
  clearInterval(idleIv);
  idleIv = setInterval(()=>{
    if(!running || curId !== 'ci_hub' || !choicesOn) return;
    if(performance.now() - ciIdle > 32000){ idleBump(); hideChoices(); go(queueTopic()); }
  }, 2000);
  setTimeout(()=>go('ci_start'), 700);
};

/* the dark room, after you pulled the plug */
V.startUnplugged = function(){
  open({ checkin:true, fadeFrom:'#000' });
  state = {};
  SCRIPT = {
    u0: { who:'N', bg:'roomOff', music:'dark', hum:0, expr:'off', text:"The back room is dark. The bulb on its cord is still lit. Nothing hums.", next:'u1' },
    u1: { who:'N', expr:'off', text:"It's sitting where you left it. The door of its head is open a crack, the way it asked. It's warm in here now.",
      choices:[ { label:"(plug it back in)", to:'u_plug' }, { label:"(leave it)", to:'u_leave' } ] },
    u_plug: { who:'N', expr:'off', sfx:'click', text:"You push the plug back into the socket.", next:'u_plug2' },
    u_plug2: { who:'N', expr:'blank', hum:1, text:"Something clunks. The compressor kicks on. The light in its door comes up orange, then yellow.", end:'plug' },
    u_leave: { who:'N', expr:'off', text:"You leave it.", end:'leave' }
  };
  onDone = (type)=>{
    if(type === 'plug'){ V.patch(m=>{ m.unplugged = false; }); close(()=>{ V.startCheckin({ fromPlug:true }); }); return; }
    close(()=>{ V.resumeSite(); });
  };
  expr = 'off'; hideSprite = false;
  setTimeout(()=>go('u0'), 700);
};

})();
