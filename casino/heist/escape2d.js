/* ============================================================
   FRIDGE PALACE HEIST: out the front door and into the main site
   the casino's last frame cracks and falls onto your fridges as
   real glass. you're a fridge in a ski mask with a bag of money,
   flat now, on the page itself. cop fridges drop from the top of
   the screen with their lights going. the site's buttons take
   bullet holes, the sign hangs by one nail, the music player skips
   when you shoot it. hold out until the van comes, then run off
   the right edge. or, if he likes you, go through his door.
============================================================ */
const W = ()=>window.innerWidth, Hh = ()=>window.innerHeight;
const R = (a, b)=>a + Math.random()*(b - a);
const pick = a=>a[(Math.random()*a.length)|0];
const clamp = (v, a, b)=>v < a ? a : v > b ? b : v;
const fmt = n=>Math.round(n).toLocaleString('en-US');
const M = ()=>window.Matter;

const GUNS = {
  revolver:{ name:'COLD SHOULDER', mag:6, dmg:55, rof:0.34, pellets:1, spread:0.015, reload:1.6, auto:false, force:0.05, sound:'revolver' },
  shotgun:{ name:'ICEBREAKER', mag:6, dmg:16, rof:0.8, pellets:7, spread:0.13, reload:2.2, auto:false, force:0.025, sound:'shotgun' },
  smg:{ name:'LITTLE CHILL', mag:30, dmg:15, rof:0.075, pellets:1, spread:0.05, reload:1.6, auto:true, force:0.012, sound:'smg' },
  freon:{ name:'THE FREON CANNON', mag:100, dmg:0, rof:0.05, pellets:0, spread:0.3, reload:0, auto:true, stream:true }
};

/* ---------- a tiny synth on the site's own audio context ---------- */
class Sfx {
  constructor(){
    let c = null; try{ if(typeof ensureAudioContext === 'function') ensureAudioContext(); c = (typeof audioCtx !== 'undefined' && audioCtx) ? audioCtx : null; }catch(e){}
    if(!c){ try{ c = new (window.AudioContext || window.webkitAudioContext)(); }catch(e){} }
    this.c = c; if(!c) return;
    if(c.state === 'suspended') c.resume();
    this.out = c.createGain(); this.out.gain.value = 0.8; this.out.connect(c.destination);
    const n = c.createBuffer(1, c.sampleRate*2, c.sampleRate), d = n.getChannelData(0); for(let i=0;i<d.length;i++) d[i] = Math.random()*2 - 1; this.nb = n;
    this.loops = [];
  }
  burst(ff, q, type, a, d, g, t, pan){ const c = this.c; if(!c) return; const T = c.currentTime + (t || 0); const s = c.createBufferSource(); s.buffer = this.nb; const f = c.createBiquadFilter(); f.type = type || 'bandpass'; f.frequency.value = ff; f.Q.value = q || 1; const e = c.createGain(); e.gain.setValueAtTime(0, T); e.gain.linearRampToValueAtTime(g, T + a); e.gain.exponentialRampToValueAtTime(0.0008, T + a + d); s.connect(f); f.connect(e); this.pan(e, pan); s.start(T, Math.random()); s.stop(T + a + d + 0.05); }
  tone(f, f2, d, g, type, t, pan){ const c = this.c; if(!c) return; const T = c.currentTime + (t || 0); const o = c.createOscillator(); o.type = type || 'sine'; o.frequency.setValueAtTime(f, T); if(f2) o.frequency.exponentialRampToValueAtTime(Math.max(1, f2), T + d); const e = c.createGain(); e.gain.setValueAtTime(0, T); e.gain.linearRampToValueAtTime(g, T + 0.005); e.gain.exponentialRampToValueAtTime(0.0008, T + d); o.connect(e); this.pan(e, pan); o.start(T); o.stop(T + d + 0.05); }
  pan(node, p){ if(p === undefined || !this.c.createStereoPanner){ node.connect(this.out); return; } const sp = this.c.createStereoPanner(); sp.pan.value = clamp(p, -1, 1); node.connect(sp); sp.connect(this.out); }
  gun(kind, pan, far){ const k = far ? 0.55 : 1; const P = { revolver:[2600, 900, 110, 0.9], shotgun:[1800, 650, 85, 1.0], smg:[3200, 1200, 140, 0.5], pistol:[2900, 1100, 130, 0.6] }[kind] || [2600, 900, 110, 0.8]; this.burst(P[0], 0.9, 'bandpass', 0.002, 0.04, P[3]*k, 0, pan); this.burst(P[1], 0.8, 'lowpass', 0.002, 0.18, P[3]*0.8*k, 0, pan); this.tone(P[2], P[2]*0.35, 0.18, 0.6*k, 'sine', 0, pan); this.burst(420, 0.5, 'lowpass', 0.02, 0.4, 0.2*k, 0.03, pan); }
  ding(pan){ this.tone(R(1400, 2200), 0, 0.2, 0.08, 'triangle', 0, pan); this.burst(2600, 2, 'bandpass', 0.001, 0.04, 0.3, 0, pan); }
  glass(big){ for(let i=0;i<(big ? 26 : 8);i++) this.tone(R(2600, 7000), 0, R(0.1, 0.4), 0.03, 'triangle', i*0.02 + Math.random()*0.15); this.burst(5000, 0.7, 'bandpass', 0.002, big ? 0.9 : 0.3, big ? 0.6 : 0.3); }
  boom(){ this.tone(70, 22, 1.4, 1.1); this.burst(900, 0.6, 'lowpass', 0.005, 1.4, 1); this.burst(3000, 0.5, 'bandpass', 0.002, 0.15, 0.7); }
  squelch(pan){ this.burst(600, 3, 'lowpass', 0.003, 0.3, 0.5, 0, pan); this.burst(1200, 5, 'bandpass', 0.003, 0.06, 0.15, 0.05, pan); }
  hurt(){ this.burst(300, 1, 'lowpass', 0.002, 0.18, 0.7); this.tone(90, 50, 0.2, 0.5); }
  click(){ this.burst(3200, 5, 'bandpass', 0.001, 0.025, 0.3); }
  horn(){ [0, 0.35].forEach(t=>{ this.tone(370, 0, 0.3, 0.12, 'square', t); this.tone(466, 0, 0.3, 0.1, 'square', t); }); }
  loop(kind){
    const c = this.c; if(!c) return null;
    if(kind === 'siren'){ const o = c.createOscillator(); o.type = 'sawtooth'; o.frequency.value = 800; const l = c.createOscillator(); l.frequency.value = 0.35; const lg = c.createGain(); lg.gain.value = 380; l.connect(lg); lg.connect(o.frequency); const f = c.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 2000; const g = c.createGain(); g.gain.value = 0.04; o.connect(f); f.connect(g); g.connect(this.out); o.start(); l.start(); const L = { stop:()=>{ try{ o.stop(); l.stop(); }catch(e){} }, g }; this.loops.push(L); return L; }
    if(kind === 'rotor'){ const s = c.createBufferSource(); s.buffer = this.nb; s.loop = true; const f = c.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 220; const g = c.createGain(); g.gain.value = 0; const l = c.createOscillator(); l.type = 'square'; l.frequency.value = 11; const lg = c.createGain(); lg.gain.value = 0.25; l.connect(lg); lg.connect(g.gain); s.connect(f); f.connect(g); g.connect(this.out); s.start(); l.start(); const L = { stop:()=>{ try{ s.stop(); l.stop(); }catch(e){} }, g }; this.loops.push(L); return L; }
    return null;
  }
  stopAll(){ this.loops.forEach(l=>l.stop()); this.loops = []; try{ this.out.disconnect(); }catch(e){} }
}

/* ---------- segment vs body: where does a bullet enter it ---------- */
function segBody(b, ax, ay, bx, by){
  let best = null;
  const parts = b.parts.length > 1 ? b.parts.slice(1) : b.parts;
  for(const p of parts){
    const v = p.vertices;
    for(let i=0;i<v.length;i++){
      const c = v[i], d = v[(i + 1) % v.length];
      const rx = bx - ax, ry = by - ay, sx = d.x - c.x, sy = d.y - c.y;
      const den = rx*sy - ry*sx; if(Math.abs(den) < 1e-9) continue;
      const t = ((c.x - ax)*sy - (c.y - ay)*sx)/den, u = ((c.x - ax)*ry - (c.y - ay)*rx)/den;
      if(t >= 0 && t <= 1 && u >= 0 && u <= 1 && (best === null || t < best)) best = t;
    }
  }
  return best;
}

export function run(P){ const e = new Escape(P); e.start(); window.__fpEscape = e; return e; }

class Escape {
  constructor(P){
    this.P = P || {}; this.t = 0; this.alive = true; this.done = false;
    this.cops = []; this.parts = []; this.tracers = []; this.puddles = []; this.shards = []; this.heli = null;
    this.hp = 100; this.keys = {}; this.mouse = { x:W()/2, y:Hh()/2, down:false };
    this.guns = ['revolver', 'shotgun', 'smg'].concat(P.freon ? ['freon'] : []);
    this.gun = this.guns.indexOf(P.weapon) >= 0 ? P.weapon : 'revolver';
    this.ammo = {}; this.guns.forEach(k=>this.ammo[k] = GUNS[k].mag);
    this.fireCD = 0; this.reloadT = 0; this.facing = 1;
    this.heat = P.heat || 0;
    this.vanTime = P.mode === 'heat' ? 38 + this.heat*4 : 45;
    this.timer = this.vanTime; this.van = null;
    this.signHits = 0; this.counterHits = 0;
    this.tries = (P.tries || 0);
  }
  /* ---------- setup ---------- */
  start(){
    const Mx = M(); if(!Mx || typeof world === 'undefined'){ this.payout(); return; }
    try{ gameActive = true; }catch(e){}
    document.documentElement.classList.add('fp-escape');
    if(!document.getElementById('hh-font')){ const l = document.createElement('link'); l.id = 'hh-font'; l.rel = 'stylesheet'; l.href = 'https://fonts.googleapis.com/css2?family=Oswald:wght@400;700&display=swap'; document.head.appendChild(l); }
    this.sfx = new Sfx();
    /* the overlay we draw on */
    const cv = document.createElement('canvas'); cv.id = 'fpEsc'; cv.style.cssText = 'position:fixed;inset:0;z-index:10005;pointer-events:none;';
    document.body.appendChild(cv); this.cv = cv; this.g = cv.getContext('2d'); this.resize();
    this._rs = ()=>this.resize(); window.addEventListener('resize', this._rs);
    /* red and blue on everything */
    const wash = document.createElement('div'); wash.id = 'fpWash'; wash.style.cssText = 'position:fixed;inset:0;z-index:10004;pointer-events:none;mix-blend-mode:screen;opacity:.0;transition:opacity 1s;';
    document.body.appendChild(wash); this.wash = wash;
    const tick = document.createElement('div'); tick.id = 'fpTick'; tick.style.cssText = 'position:fixed;left:0;right:0;top:0;height:26px;z-index:10006;background:rgba(170,10,10,.92);color:#fff;font:600 14px Oswald,Arial,sans-serif;letter-spacing:3px;line-height:26px;white-space:nowrap;overflow:hidden;pointer-events:none;';
    tick.innerHTML = '<span style="display:inline-block;padding-left:100%;animation:fpTick 26s linear infinite">LIVE · ROBBERY AT THE FRIDGE PALACE · SUSPECT FLED THROUGH THE FRONT DOORS AND INTO A WEBSITE · SUSPECT DESCRIBED AS "A FRIDGE IN A SKI MASK" · POLICE ADVISE: DO NOT CLICK ON THE SUSPECT · FRDX: NEON HALTED · LIVE ·</span>';
    document.body.appendChild(tick); this.tick = tick;
    if(!document.getElementById('fpEscCss')){ const st = document.createElement('style'); st.id = 'fpEscCss'; st.textContent = `@keyframes fpTick{to{transform:translateX(-100%)}}
      .fp-hole{position:fixed;width:16px;height:16px;margin:-8px 0 0 -8px;border-radius:50%;background:radial-gradient(circle,#000 0 28%,#1a1210 34%,rgba(80,60,50,.75) 46%,rgba(0,0,0,0) 72%);z-index:10003;pointer-events:none;}
      .fp-hole::after{content:'';position:absolute;inset:-6px;background:conic-gradient(from 20deg,transparent 0 8%,rgba(255,255,255,.35) 8.5% 9%,transparent 9.5% 30%,rgba(255,255,255,.3) 30.5% 31%,transparent 31.5% 62%,rgba(255,255,255,.3) 62.5% 63%,transparent 63.5%);border-radius:50%;opacity:.6;}
      .fp-shake{animation:fpShake .25s;}
      @keyframes fpShake{0%,100%{translate:0 0}25%{translate:-3px 1px}50%{translate:3px -1px}75%{translate:-2px 0}}
      @keyframes fpSwing{0%{rotate:0deg}30%{rotate:24deg}50%{rotate:14deg}70%{rotate:20deg}85%{rotate:16deg}100%{rotate:18deg}}
      #header.fp-nail{transform-origin:6% 10%;animation:fpSwing 1.8s ease-out forwards;}
      .fp-card{position:fixed;inset:0;z-index:10010;display:flex;overflow-y:auto;overscroll-behavior:contain;background:rgba(4,6,10,.62);font-family:Oswald,Arial,sans-serif;color:#fff;text-shadow:0 2px 4px #000;}
      .fp-card .in{text-align:center;max-width:560px;padding:20px;margin:auto}
      .fp-card h1{font-size:min(14vw,18vh,100px);margin:0;letter-spacing:8px}
      @media (max-height:460px){ .fp-card table{font-size:14px;margin:6px auto} .fp-card td{padding:1px 10px} .fp-card button{padding:8px 16px;margin:4px} .fp-card .in{padding:10px} }
      .fp-card table{margin:12px auto;font-size:17px;border-collapse:collapse;letter-spacing:1px}
      .fp-card td{padding:3px 14px;text-align:left}.fp-card td+td{text-align:right;color:#7dff9a}
      .fp-card button{font:600 16px Oswald,Arial,sans-serif;letter-spacing:3px;padding:10px 22px;margin:8px;background:rgba(0,0,0,.6);color:#fff;border:1px solid rgba(255,255,255,.5);cursor:pointer}
      .fp-card button.gold{background:#ffd56a;color:#111;border-color:#ffd56a;text-shadow:none}
      .fp-escbtn{position:fixed;z-index:10007;width:64px;height:64px;border-radius:50%;background:rgba(0,0,0,.5);border:2px solid rgba(255,255,255,.6);color:#fff;font:600 13px Oswald,Arial,sans-serif;touch-action:none;}
      html.fp-escape body{cursor:crosshair}`; document.head.appendChild(st); }
    this.holes = document.getElementById('fpHoles') || (()=>{ const d = document.createElement('div'); d.id = 'fpHoles'; document.body.appendChild(d); return d; })();
    /* nobody drags fridges during a shootout */
    try{ this.mcMask = mouseConstraint.collisionFilter.mask; mouseConstraint.collisionFilter.mask = 0; }catch(e){}
    this.bindInput();
    /* the player */
    const Mt = M();
    this.player = Mt.Bodies.rectangle(W()*0.5, Hh()*0.35, 54, 88, { friction:0.02, frictionAir:0.015, restitution:0, density:0.002, label:'heistPlayer', render:{ visible:false } });
    Mt.Body.setInertia(this.player, Infinity);
    Mt.World.add(world, this.player);
    /* the last frame, about to break */
    this.img = new Image(); this.imgOK = false;
    if(this.P.shot && !this.P.retry){ this.img.onload = ()=>{ this.imgOK = true; }; this.img.src = this.P.shot; }
    this.phase = this.P.retry ? 'fight' : 'crack'; this.phaseT = 0;
    if(this.P.retry) this.beginFight();
    else this.sfx.glass(false);
    this.last = performance.now();
    this.raf = requestAnimationFrame(()=>this.loop());
  }
  resize(){ const dpr = Math.min(2, window.devicePixelRatio || 1); this.dpr = dpr; this.cv.width = W()*dpr; this.cv.height = Hh()*dpr; this.cv.style.width = W() + 'px'; this.cv.style.height = Hh() + 'px'; }
  bindInput(){
    const kd = e=>{ if(!this.alive) return; const k = e.code; this.keys[k] = true; if(['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].indexOf(k) >= 0) e.preventDefault(); const m = /^Digit([1-4])$/.exec(k); if(m && this.guns[+m[1] - 1]) this.switchGun(this.guns[+m[1] - 1]); if(k === 'KeyQ'){ this.switchGun(this.guns[(this.guns.indexOf(this.gun) + 1) % this.guns.length]); } if(k === 'KeyR') this.reload(); if(k === 'KeyE' || k === 'KeyW' || k === 'ArrowUp') this.tryDoor(); e.stopPropagation(); };
    const ku = e=>{ this.keys[e.code] = false; };
    const mm = e=>{ this.mouse.x = e.clientX; this.mouse.y = e.clientY; };
    const md = e=>{ if(!this.alive || this.cardOpen) return; if(e.target.closest && e.target.closest('.fp-card,.fp-escbtn')) return; e.preventDefault(); e.stopPropagation(); this.mouse.x = e.clientX; this.mouse.y = e.clientY; this.mouse.down = true; this.mouse.pressed = true; };
    const mu = e=>{ this.mouse.down = false; };
    const ck = e=>{ if(!this.alive || this.cardOpen) return; if(e.target.closest && e.target.closest('.fp-card,.fp-escbtn')) return; e.preventDefault(); e.stopPropagation(); };
    const cm = e=>{ if(this.alive) e.preventDefault(); };
    const ts = e=>{ if(!this.alive || this.cardOpen) return; if(e.target.closest && e.target.closest('.fp-card,.fp-escbtn')) return; const t = e.changedTouches[0]; this.mouse.x = t.clientX; this.mouse.y = t.clientY; this.mouse.down = true; this.mouse.pressed = true; e.preventDefault(); e.stopPropagation(); };
    const te = e=>{ this.mouse.down = false; };
    window.addEventListener('keydown', kd, true); window.addEventListener('keyup', ku, true);
    window.addEventListener('mousemove', mm, true); window.addEventListener('mousedown', md, true); window.addEventListener('mouseup', mu, true); window.addEventListener('click', ck, true); window.addEventListener('contextmenu', cm, true);
    window.addEventListener('touchstart', ts, { capture:true, passive:false }); window.addEventListener('touchend', te, true);
    this.unbind = ()=>{ window.removeEventListener('keydown', kd, true); window.removeEventListener('keyup', ku, true); window.removeEventListener('mousemove', mm, true); window.removeEventListener('mousedown', md, true); window.removeEventListener('mouseup', mu, true); window.removeEventListener('click', ck, true); window.removeEventListener('contextmenu', cm, true); window.removeEventListener('touchstart', ts, true); window.removeEventListener('touchend', te, true); };
    /* phone buttons */
    if(navigator.maxTouchPoints > 0){
      const mk = (txt, css, down, up)=>{ const b = document.createElement('button'); b.className = 'fp-escbtn'; b.textContent = txt; b.style.cssText += css; b.addEventListener('touchstart', e=>{ e.preventDefault(); e.stopPropagation(); down(); }, { passive:false }); b.addEventListener('touchend', e=>{ e.preventDefault(); up && up(); }, { passive:false }); document.body.appendChild(b); (this.btns = this.btns || []).push(b); };
      mk('◀', 'left:14px;bottom:110px;', ()=>this.keys.KeyA = true, ()=>this.keys.KeyA = false);
      mk('▶', 'left:90px;bottom:110px;', ()=>this.keys.KeyD = true, ()=>this.keys.KeyD = false);
      mk('JUMP', 'right:14px;bottom:110px;', ()=>{ this.keys.Space = true; this.tryDoor(); }, ()=>this.keys.Space = false);
      mk('SWAP', 'right:90px;bottom:110px;', ()=>this.switchGun(this.guns[(this.guns.indexOf(this.gun) + 1) % this.guns.length]));
    }
  }
  /* ---------- the loop ---------- */
  loop(){
    if(!this.alive) return;
    this.raf = requestAnimationFrame(()=>this.loop());
    const now = performance.now(); const dt = Math.min(0.05, (now - this.last)/1000); this.last = now;
    this.t += dt; this.phaseT += dt;
    try{ this.step(dt); this.draw(); }catch(e){ console.error(e); }
  }
  step(dt){
    if(this.phase === 'crack'){ if(this.phaseT > 0.6){ this.shatter(); this.phase = 'fall'; this.phaseT = 0; } return; }
    if(this.phase === 'fall' && this.phaseT > 1.4){ this.beginFight(); }
    this.stepShards(dt);
    this.stepParts(dt);
    if(this.phase !== 'fight') return;
    if(this.done) return;
    this.control(dt);
    this.stepCops(dt);
    this.stepHeli(dt);
    this.waves(dt);
    /* the van */
    if(this.timer > 0){ this.timer -= dt; if(this.timer <= 0) this.vanArrives(); }
    if(this.van){ const v = this.van; v.x += (v.tx - v.x)*Math.min(1, dt*2.5); }
    const p = this.player.position;
    if(this.van && (p.x > W() + 20 || (p.x > this.van.x + 20 && p.y > Hh() - 170))) this.win('van');
    if(p.y > Hh() + 400 || p.x < -400 || p.x > W() + 400){ if(this.van) this.win('van'); else M().Body.setPosition(this.player, { x:W()/2, y:80 }); }
  }
  beginFight(){
    this.phase = 'fight'; this.phaseT = 0;
    this.wash.style.opacity = '.32';
    this.siren = this.sfx.loop('siren');
    this.big('GET TO THE VAN', 'hold out until it shows up, then run off the right edge');
    try{ if(window.MKT && MKT.pushNews) MKT.pushNews('NEON', 'BREAKING: armed robbery at the Fridge Palace. Neonfridge Hospitality halted, "a fridge in a ski mask" at large', -0.1); }catch(e){}
    this.waveList = this.makeWaves(); this.waveI = 0;
  }
  makeWaves(){
    const h = this.heat, L = [];
    L.push([1.5, 'cop', 2], [7, 'cop', 2], [13, 'cop', 2 + (h > 1 ? 1 : 0)], [19, 'swat', 1 + (h > 2 ? 1 : 0)], [24, 'cop', 2], [28, 'heli', 1], [34, 'cop', 3], [40, 'swat', 2]);
    if(h >= 3) L.push([16, 'swat', 1], [31, 'cop', 2]);
    if(h >= 5) L.push([22, 'heli', 1]);
    return L.sort((a, b)=>a[0] - b[0]);
  }
  waves(dt){
    const t = this.phaseT;
    while(this.waveI < this.waveList.length && this.waveList[this.waveI][0] <= t){
      const [, type, n] = this.waveList[this.waveI++];
      if(type === 'heli'){ if(!this.heli) this.spawnHeli(); continue; }
      for(let i=0;i<n;i++) setTimeout(()=>this.alive && !this.done && this.spawnCop(type), i*600);
    }
    /* keep a trickle going so it never goes quiet */
    if(t > 44 && this.cops.filter(c=>c.alive).length < 2 && Math.random() < dt*0.5) this.spawnCop(Math.random() < 0.3 ? 'swat' : 'cop');
  }
  /* ---------- the glass ---------- */
  shatter(){
    const Mt = M(), w = W(), h = Hh();
    const cols = 7, rows = 5, pts = [];
    for(let j=0;j<=rows;j++){ pts.push([]); for(let i=0;i<=cols;i++){ let x = i/cols*w, y = j/rows*h; if(i > 0 && i < cols) x += R(-0.3, 0.3)*w/cols; if(j > 0 && j < rows) y += R(-0.3, 0.3)*h/rows; pts[j].push({ x, y }); } }
    const cx = w/2, cy = h/2;
    for(let j=0;j<rows;j++) for(let i=0;i<cols;i++){
      const a = pts[j][i], b = pts[j][i + 1], c = pts[j + 1][i + 1], d = pts[j + 1][i];
      const tris = Math.random() < 0.5 ? [[a, b, c], [a, c, d]] : [[a, b, d], [b, c, d]];
      for(const tri of tris){
        const ox = (tri[0].x + tri[1].x + tri[2].x)/3, oy = (tri[0].y + tri[1].y + tri[2].y)/3;
        const local = tri.map(p=>({ x:p.x - ox, y:p.y - oy }));
        let body = null;
        try{ body = Mt.Bodies.fromVertices(ox, oy, [local], { friction:0.4, restitution:0.25, density:0.0006, render:{ visible:false }, label:'shard' }); }catch(e){}
        if(!body) continue;
        /* fromVertices recenters; keep the image offset honest */
        const dx = body.position.x - ox, dy = body.position.y - oy;
        Mt.Body.setVelocity(body, { x:(ox - cx)/w*R(4, 9), y:(oy - cy)/h*R(2, 6) - R(1, 3) });
        Mt.Body.setAngularVelocity(body, R(-0.08, 0.08));
        Mt.World.add(world, body);
        this.shards.push({ body, local:local.map(p=>({ x:p.x - dx, y:p.y - dy })), ox:ox + dx, oy:oy + dy, born:this.t });
      }
    }
    this.sfx.glass(true); this.sfx.boom();
    this.flash = 0.6;
  }
  stepShards(dt){
    for(let i=this.shards.length - 1; i>=0; i--){ const s = this.shards[i]; if(this.t - s.born > 4.6){ try{ M().World.remove(world, s.body); }catch(e){} this.shards.splice(i, 1); } }
  }
  /* ---------- you ---------- */
  grounded(b, w){
    const Mt = M(), all = Mt.Composite.allBodies(world).filter(x=>x !== b && !x.isSensor);
    const y = b.bounds.max.y + 2;
    const hits = Mt.Query.ray(all, { x:b.position.x - (w || 22), y }, { x:b.position.x + (w || 22), y }, 4);
    return hits.length > 0;
  }
  control(dt){
    const Mt = M(), b = this.player, K = this.keys;
    let mx = 0; if(K.KeyA || K.ArrowLeft) mx -= 1; if(K.KeyD || K.ArrowRight) mx += 1;
    const gr = this.grounded(b);
    const want = mx*6.2;
    Mt.Body.setVelocity(b, { x:b.velocity.x + (want - b.velocity.x)*(gr ? 0.35 : 0.12), y:b.velocity.y });
    if((K.Space || K.KeyW || K.ArrowUp) && gr && this.jumpCD <= 0){ Mt.Body.setVelocity(b, { x:b.velocity.x, y:-12.5 }); this.jumpCD = 0.35; this.sfx.burst(400, 1, 'lowpass', 0.005, 0.12, 0.3); }
    this.jumpCD = (this.jumpCD || 0) - dt;
    Mt.Body.setAngle(b, 0);
    this.walkT = (this.walkT || 0) + Math.abs(b.velocity.x)*dt;
    const p = b.position, aim = Math.atan2(this.mouse.y - (p.y - 18), this.mouse.x - p.x);
    this.aim = aim; this.facing = Math.cos(aim) >= 0 ? 1 : -1;
    /* guns */
    if(this.fireCD > 0) this.fireCD -= dt;
    if(this.reloadT > 0){ this.reloadT -= dt; if(this.reloadT <= 0){ this.ammo[this.gun] = GUNS[this.gun].mag; this.sfx.click(); this.sfx.burst(1400, 2, 'bandpass', 0.002, 0.05, 0.4, 0.05); } }
    const G = GUNS[this.gun];
    if(G.stream){ if(this.mouse.down) this.stream(dt); else this.ammo.freon = Math.min(100, this.ammo.freon + dt*12); }
    else if((G.auto ? this.mouse.down : this.mouse.pressed)) this.shoot();
    this.mouse.pressed = false;
    if(this.hurtT > 0) this.hurtT -= dt;
  }
  switchGun(k){ if(!k || k === this.gun) return; this.gun = k; this.reloadT = 0; this.fireCD = 0.25; this.sfx.click(); }
  reload(){ const G = GUNS[this.gun]; if(G.stream || this.reloadT > 0 || this.ammo[this.gun] >= G.mag) return; this.reloadT = G.reload; this.sfx.click(); }
  muzzle(){ const p = this.player.position; return { x:p.x + Math.cos(this.aim)*44, y:p.y - 18 + Math.sin(this.aim)*44 }; }
  shoot(){
    const G = GUNS[this.gun];
    if(this.fireCD > 0 || this.reloadT > 0) return;
    if(this.ammo[this.gun] <= 0){ this.reload(); return; }
    this.ammo[this.gun]--; this.fireCD = G.rof;
    const m = this.muzzle();
    for(let i=0;i<G.pellets;i++){ const a = this.aim + R(-1, 1)*G.spread; this.bullet(m.x, m.y, a, G.dmg, G.force, true); }
    this.sfx.gun(G.sound, (m.x/W() - 0.5)*1.4);
    this.muzzleT = 0.05; this.shake = Math.min(12, (this.shake || 0) + (this.gun === 'shotgun' ? 8 : this.gun === 'revolver' ? 5 : 2));
    /* brass */
    this.parts.push({ x:m.x - Math.cos(this.aim)*30, y:m.y, vx:-this.facing*R(1, 3), vy:R(-5, -3), life:3, col:this.gun === 'shotgun' ? '#b02020' : '#d9a441', w:5, h:3, g:0.5, bounce:0.4, spin:R(-0.4, 0.4), a:0 });
    if(this.ammo[this.gun] <= 0) setTimeout(()=>this.reload(), 250);
  }
  stream(dt){
    if(this.ammo.freon <= 0){ return; }
    this.ammo.freon = Math.max(0, this.ammo.freon - dt*22);
    const m = this.muzzle();
    for(let i=0;i<3;i++){ const a = this.aim + R(-0.25, 0.25), sp = R(7, 12); this.parts.push({ x:m.x, y:m.y, vx:Math.cos(a)*sp, vy:Math.sin(a)*sp, life:0.6, col:'rgba(210,245,255,.6)', r:R(6, 14), grow:30, g:-0.02, mist:true }); }
    for(const c of this.cops){ if(!c.alive || c.frozen) continue; const dx = c.body.position.x - m.x, dy = c.body.position.y - m.y, d = Math.hypot(dx, dy); if(d > 300) continue; const ang = Math.atan2(dy, dx); if(Math.abs(Math.atan2(Math.sin(ang - this.aim), Math.cos(ang - this.aim))) < 0.35){ c.freeze = (c.freeze || 0) + dt*90; if(c.freeze > 100){ c.frozen = true; this.sfx.ding(); } } }
    if(!this._hiss || this.t - this._hiss > 0.12){ this._hiss = this.t; this.sfx.burst(5000, 0.5, 'highpass', 0.01, 0.12, 0.12); }
  }
  /* one bullet: through the physics world, then into the page */
  bullet(x, y, ang, dmg, force, mine){
    const Mt = M(), dx = Math.cos(ang), dy = Math.sin(ang), L = Math.max(W(), Hh())*1.5;
    const ex = x + dx*L, ey = y + dy*L;
    const shooter = mine ? this.player : null;
    const all = Mt.Composite.allBodies(world).filter(b=>b !== shooter && !b.isStatic && b.label !== 'shard');
    const cand = Mt.Query.ray(all, { x, y }, { x:ex, y:ey }, 1).map(c=>c.bodyA === c.bodyB ? c.bodyA : (c.bodyA.parent || c.bodyA));
    let best = 1, hitB = null;
    const seen = new Set();
    for(const b0 of cand){ const b = b0.parent || b0; if(seen.has(b)) continue; seen.add(b); const t = segBody(b, x, y, ex, ey); if(t !== null && t < best){ best = t; hitB = b; } }
    /* the helicopter is not a physics body */
    if(mine && this.heli && this.heli.hp > 0){ const H = this.heli; const t = this.segRect(x, y, ex, ey, H.x - 70, H.y - 26, H.x + 70, H.y + 26); if(t !== null && t < best){ best = t; hitB = 'heli'; } }
    /* the walls and the ground stop bullets too */
    let wallT = 1; const statics = Mt.Composite.allBodies(world).filter(b=>b.isStatic); for(const b of statics){ const t = segBody(b, x, y, ex, ey); if(t !== null && t < wallT) wallT = t; }
    if(wallT < best){ best = wallT; hitB = 'wall'; }
    const hx = x + (ex - x)*best, hy = y + (ey - y)*best;
    /* does the bullet pass the cursor first? then it lands on whatever part of the page is under it */
    if(mine){
      const mdx = this.mouse.x - x, mdy = this.mouse.y - y, md = Math.hypot(mdx, mdy);
      if(md < best*L && Math.abs(Math.atan2(mdy, mdx) - ang) < 0.25 && this.pageHit(this.mouse.x + R(-6, 6), this.mouse.y + R(-6, 6))){ this.tracers.push({ x1:x, y1:y, x2:this.mouse.x, y2:this.mouse.y, life:0.06 }); return; }
    }
    this.tracers.push({ x1:x, y1:y, x2:hx, y2:hy, life:0.06, enemy:!mine });
    if(hitB === 'wall' || hitB === null){ this.spark(hx, hy, 4); if(mine && hitB === 'wall') this.pageHit(hx, hy, true); return; }
    if(hitB === 'heli'){ this.heli.hp -= dmg; this.spark(hx, hy, 6); this.sfx.ding((hx/W() - 0.5)*1.4); this.hitmark = 0.12; return; }
    if(hitB === this.player){ if(!mine) this.hurt(dmg, x); return; }
    Mt.Body.applyForce(hitB, { x:hx, y:hy }, { x:dx*force*(hitB.mass || 1)*0.5, y:dy*force*(hitB.mass || 1)*0.5 - 0.002*(hitB.mass || 1) });
    const cop = this.cops.find(c=>c.body === hitB);
    if(cop){ this.hitCop(cop, dmg, hx, hy, dx, dy, mine); return; }
    if(hitB.label === 'shard'){ this.sfx.glass(false); return; }
    /* one of your fridges */
    this.spark(hx, hy, 3); this.sfx.ding((hx/W() - 0.5)*1.4);
    if(Math.random() < 0.3) this.blob(hx, hy, pick(['#f4f4ee', '#b8160f']), 3);
  }
  segRect(ax, ay, bx, by, x0, y0, x1, y1){ let t0 = 0, t1 = 1; const dx = bx - ax, dy = by - ay; const p = [-dx, dx, -dy, dy], q = [ax - x0, x1 - ax, ay - y0, y1 - ay]; for(let i=0;i<4;i++){ if(p[i] === 0){ if(q[i] < 0) return null; continue; } const r = q[i]/p[i]; if(p[i] < 0){ if(r > t1) return null; if(r > t0) t0 = r; } else { if(r < t0) return null; if(r < t1) t1 = r; } } return t0; }
  /* ---------- the page takes damage ---------- */
  pageHit(x, y, quiet){
    const el = document.elementFromPoint(x, y);
    if(!el || el === document.body || el === document.documentElement || el.tagName === 'CANVAS' && !el.closest('#musicPlayer')) return false;
    /* the king cannot be shot */
    if(el.closest('#memorialText')){ this.spark(x, y, 8); this.sfx.tone(3200, 0, 0.3, 0.06, 'triangle'); this.floatText(x, y, 'the king is bulletproof'); return true; }
    const hole = document.createElement('i'); hole.className = 'fp-hole'; hole.style.left = x + 'px'; hole.style.top = y + 'px'; hole.style.transform = `rotate(${R(0, 360)}deg) scale(${R(0.8, 1.2)})`; this.holes.appendChild(hole);
    if(this.holes.childElementCount > 220) this.holes.firstChild.remove();
    const box = el.closest('button, #fridgeCounter, #header, #musicPlayer, #vendorBox, #rouletteContainer, #paintContainer, #economyBox, #rightUI') || el;
    box.classList.remove('fp-shake'); void box.offsetWidth; box.classList.add('fp-shake');
    this.spark(x, y, 5); this.sfx.burst(2200, 2, 'bandpass', 0.001, 0.05, 0.3, 0, (x/W() - 0.5)*1.4);
    if(el.closest('#header')){ this.signHits++; if(this.signHits === 3){ document.getElementById('header').classList.add('fp-nail'); this.sfx.tone(600, 200, 0.4, 0.1, 'triangle'); this.floatText(x, y + 40, 'one nail left'); } }
    if(el.closest('#fridgeCounter')){ this.counterHits++; const fc = document.getElementById('fridgeCounter'); const real = fc.textContent; fc.textContent = pick(['Fridges: ERR', 'Fridges: ???', 'Fridges: OW', 'Fridges: -1']); setTimeout(()=>{ try{ updateCounter(); }catch(e){ fc.textContent = real; } }, 600); }
    if(el.closest('#musicPlayer')){ try{ if(typeof nextSong === 'function' && typeof audio !== 'undefined' && audio && !audio.paused) nextSong(); }catch(e){} this.floatText(x, y - 20, 'skip'); }
    if(el.closest('#vendorBox')){ const vb = document.getElementById('vendorBox'); const t = vb.textContent; vb.textContent = 'ow.'; setTimeout(()=>{ vb.textContent = t; }, 1600); }
    const btn = el.closest('button'); if(btn){ btn.style.filter = 'brightness(.6)'; setTimeout(()=>{ btn.style.filter = ''; }, 900); }
    this.pageHits = (this.pageHits || 0) + 1;
    return true;
  }
  floatText(x, y, t){ this.parts.push({ x, y, vx:0, vy:-0.6, life:1.6, text:t, g:0 }); }
  /* ---------- cops ---------- */
  spawnCop(type){
    const Mt = M(), w = W(), p = this.player.position;
    let x = R(60, w - 60); for(let k=0;k<6 && Math.abs(x - p.x) < 220;k++) x = R(60, w - 60);
    const b = Mt.Bodies.rectangle(x, -80, type === 'swat' ? 62 : 52, 90, { friction:0.05, frictionAir:0.02, restitution:0.05, density:0.0022, label:'cop', render:{ visible:false } });
    const inert = b.inertia; Mt.Body.setInertia(b, Infinity);
    Mt.World.add(world, b);
    const c = { body:b, type, inert, hp:type === 'swat' ? 120 : 60, alive:true, fireCD:R(1.2, 2.2), facing:1, t:Math.random()*5, chute:true, freeze:0, frozen:false };
    this.cops.push(c);
    this.sfx.tone(900, 600, 0.3, 0.05, 'sawtooth');
    return c;
  }
  hitCop(c, dmg, x, y, dx, dy, mine){
    if(!c.alive){ this.blob(x, y, pick(['#b8160f', '#f4f4ee', '#e0b020']), 3); this.sfx.squelch(); return; }
    if(c.frozen){ this.shatterCop(c); return; }
    /* the swat shield faces you */
    if(c.type === 'swat' && Math.sign(-dx) === c.facing && !c.peek){ this.spark(x, y, 8); this.sfx.ding(); return; }
    c.hp -= dmg; this.hitmark = 0.12;
    this.mist(x, y, 4); if(Math.random() < 0.4) this.blob(x, y, pick(['#f4f4ee', '#b8160f']), 2);
    this.sfx.ding((x/W() - 0.5)*1.4);
    if(c.hp <= 0) this.killCop(c, dx, dy);
  }
  killCop(c, dx, dy){
    const Mt = M(), b = c.body;
    c.alive = false; c.deadT = 0;
    Mt.Body.setInertia(b, c.inert);
    Mt.Body.applyForce(b, { x:b.position.x, y:b.position.y - 30 }, { x:dx*0.04*b.mass, y:-0.03*b.mass });
    Mt.Body.setAngularVelocity(b, dx*0.15);
    this.spill(b.position.x, b.position.y, dx);
    this.sfx.squelch((b.position.x/W() - 0.5)*1.4); this.hitmark = 0.2; this.killmark = 0.25;
    this.kills = (this.kills || 0) + 1;
    /* the door */
    this.parts.push({ x:b.position.x, y:b.position.y, vx:dx*R(4, 8), vy:R(-8, -4), life:6, col:c.type === 'swat' ? '#15171a' : '#1c2a4a', w:46, h:58, g:0.45, bounce:0.3, spin:R(-0.3, 0.3), a:0, door:true });
  }
  shatterCop(c){
    const Mt = M(), b = c.body;
    for(let i=0;i<24;i++) this.parts.push({ x:b.position.x + R(-25, 25), y:b.position.y + R(-40, 40), vx:R(-6, 6), vy:R(-9, -2), life:R(1.5, 3), col:'rgba(190,240,255,.85)', w:R(6, 12), h:R(6, 12), g:0.5, bounce:0.3, spin:R(-0.5, 0.5), a:0 });
    this.spill(b.position.x, b.position.y, 0);
    this.sfx.glass(false); this.sfx.ding();
    c.alive = false; c.gone = true; Mt.World.remove(world, b);
    this.kills = (this.kills || 0) + 1; this.killmark = 0.25;
  }
  stepCops(dt){
    const Mt = M(), p = this.player.position;
    for(let i=this.cops.length - 1; i>=0; i--){
      const c = this.cops[i], b = c.body; c.t += dt;
      if(c.gone){ this.cops.splice(i, 1); continue; }
      if(!c.alive){ c.deadT += dt; if(c.deadT > 18){ Mt.World.remove(world, b); this.cops.splice(i, 1); } continue; }
      if(c.frozen){ c.freeze -= dt*8; if(c.freeze < 40){ c.frozen = false; } continue; }
      if(c.freeze > 0) c.freeze -= dt*20;
      /* parachute until they land */
      if(c.chute){ Mt.Body.setVelocity(b, { x:b.velocity.x*0.95, y:Math.min(b.velocity.y, 3.2) }); if(this.grounded(b, 20) && b.position.y > 0){ c.chute = false; } }
      Mt.Body.setAngle(b, 0);
      const dx = p.x - b.position.x, dist = Math.abs(dx);
      c.facing = dx >= 0 ? 1 : -1;
      const want = dist > 380 ? c.facing*(c.type === 'swat' ? 1.6 : 2.6) : dist < 180 ? -c.facing*1.4 : 0;
      if(!c.chute) Mt.Body.setVelocity(b, { x:b.velocity.x + (want - b.velocity.x)*0.2, y:b.velocity.y });
      if(!c.chute && Math.random() < dt*0.4 && this.grounded(b, 20)) Mt.Body.setVelocity(b, { x:b.velocity.x, y:-9 });
      c.fireCD -= dt;
      if(c.type === 'swat' && c.fireCD < 0.5) c.peek = true; else c.peek = false;
      if(c.fireCD <= 0 && b.position.y > 40){
        c.fireCD = c.type === 'swat' ? R(1.4, 2.2) : R(1.0, 1.9);
        const gx = b.position.x + c.facing*30, gy = b.position.y - 10;
        const ang = Math.atan2((p.y - 15) - gy, p.x - gx);
        const n = c.type === 'swat' ? 3 : 1;
        for(let k=0;k<n;k++) setTimeout(()=>{ if(!c.alive || this.done || !this.alive) return; const spread = 0.05 + Math.min(0.12, dist/6000) + (Math.abs(this.player.velocity.x) > 3 ? 0.05 : 0); this.bullet(gx, gy, ang + R(-spread, spread), c.type === 'swat' ? 5 : 8, 0.01, false); this.sfx.gun(c.type === 'swat' ? 'smg' : 'pistol', (gx/W() - 0.5)*1.4, true); c.flashT = 0.05; }, k*110);
      }
      if(c.flashT > 0) c.flashT -= dt;
    }
  }
  /* ---------- the helicopter ---------- */
  spawnHeli(){ this.heli = { x:-160, y:120, hp:420, dir:1, fireCD:3, t:0 }; this.rotor = this.sfx.loop('rotor'); this.big('THEY SENT A HELICOPTER', ''); }
  stepHeli(dt){
    const H = this.heli; if(!H) return;
    H.t += dt;
    if(this.rotor) this.rotor.g.gain.value = H.hp > 0 ? 0.25 : 0;
    if(H.hp > 0){
      const tx = this.player.position.x + Math.sin(H.t*0.5)*260;
      H.x += clamp(tx - H.x, -180, 180)*dt*0.8; H.y = 120 + Math.sin(H.t*1.3)*14;
      H.fireCD -= dt;
      if(H.fireCD <= 0){ H.fireCD = R(2, 3.2); for(let k=0;k<5;k++) setTimeout(()=>{ if(!this.heli || this.heli.hp <= 0 || this.done) return; const p = this.player.position; const a = Math.atan2(p.y - H.y, p.x - H.x); this.bullet(H.x, H.y + 20, a + R(-0.09, 0.09), 6, 0.02, false); this.sfx.gun('smg', (H.x/W() - 0.5)*1.4, true); }, k*90); }
    } else if(!H.falling){ H.falling = true; H.vy = 0; H.vr = R(-2, 2); H.r = 0; this.big('HELICOPTER DOWN', ''); this.sfx.boom(); }
    if(H.falling){ H.vy += 600*dt; H.y += H.vy*dt; H.r += H.vr*dt; H.x += Math.sin(H.t*3)*40*dt; if(Math.random() < 0.6) this.parts.push({ x:H.x, y:H.y, vx:R(-1, 1), vy:R(-2, -0.5), life:1.5, col:'rgba(60,60,60,.5)', r:R(10, 22), grow:20, g:-0.02, mist:true });
      if(H.y > Hh() - 40){ this.explode(H.x, Hh() - 40); this.heli = null; if(this.rotor){ this.rotor.stop(); this.rotor = null; } } }
  }
  explode(x, y){
    const Mt = M();
    this.sfx.boom(); this.shake = 20; this.flash = 0.4;
    for(let i=0;i<40;i++){ const a = R(0, 6.28), sp = R(3, 12); this.parts.push({ x, y, vx:Math.cos(a)*sp, vy:Math.sin(a)*sp - 4, life:R(0.5, 1.2), col:pick(['#ffd060', '#ff7a20', '#fff']), w:4, h:4, g:0.3, bounce:0.2 }); }
    for(let i=0;i<14;i++) this.parts.push({ x, y, vx:R(-2, 2), vy:R(-3, -1), life:2.5, col:'rgba(50,50,50,.5)', r:R(14, 30), grow:30, g:-0.03, mist:true });
    for(const b of Mt.Composite.allBodies(world)){ if(b.isStatic) continue; const dx = b.position.x - x, dy = b.position.y - y, d = Math.hypot(dx, dy); if(d < 320){ const k = (1 - d/320)*0.06*b.mass; Mt.Body.applyForce(b, b.position, { x:dx/(d || 1)*k, y:dy/(d || 1)*k - k*0.5 }); } }
    for(const c of this.cops){ if(!c.alive) continue; const d = Math.hypot(c.body.position.x - x, c.body.position.y - y); if(d < 220) this.killCop(c, Math.sign(c.body.position.x - x) || 1, -1); }
    const pd = Math.hypot(this.player.position.x - x, this.player.position.y - y); if(pd < 200) this.hurt(40*(1 - pd/200), x);
  }
  /* ---------- getting hit ---------- */
  hurt(dmg, fromX){
    if(this.done || this.hurtT > 0.05) { if(this.done) return; }
    this.hp -= dmg; this.hurtT = 0.15; this.redT = 0.35; this.sfx.hurt(); this.shake = Math.min(14, (this.shake || 0) + 4);
    this.mist(this.player.position.x, this.player.position.y - 20, 3);
    if(this.hp <= 0){ this.hp = 0; this.bust(); }
  }
  /* ---------- particles ---------- */
  spark(x, y, n){ for(let i=0;i<n;i++) this.parts.push({ x, y, vx:R(-4, 4), vy:R(-5, 2), life:R(0.15, 0.4), col:Math.random() < 0.3 ? '#fff' : '#ffb040', w:2, h:2, g:0.3 }); }
  mist(x, y, n){ for(let i=0;i<n;i++) this.parts.push({ x, y, vx:R(-1.5, 1.5), vy:R(-1.5, 0.5), life:R(0.5, 1), col:'rgba(230,248,255,.55)', r:R(5, 10), grow:22, g:-0.02, mist:true }); }
  blob(x, y, col, n){ for(let i=0;i<n;i++) this.parts.push({ x, y, vx:R(-4, 4), vy:R(-6, -1), life:3, col, r:R(3, 6), g:0.45, splat:true }); }
  spill(x, y, dir){
    const foods = [['#f6f6f2', 14, 22], ['#f3e6cf', 8, 10], ['#f2c230', 14, 10], ['#5b8a2a', 6, 16], ['#d42020', 10, 16], ['#7ac043', 14, 6], ['#f3efe4', 16, 14]];
    for(let i=0;i<14;i++){ const f = pick(foods); this.parts.push({ x:x + R(-15, 15), y:y + R(-20, 20), vx:dir*R(1, 5) + R(-3, 3), vy:R(-9, -3), life:R(10, 16), col:f[0], w:f[1], h:f[2], g:0.45, bounce:0.25, spin:R(-0.4, 0.4), a:0, food:true }); }
    for(let i=0;i<12;i++) this.blob(x, y, pick(['#b8160f', '#f4f4ee', '#e0b020', '#b8160f']), 1);
    this.mist(x, y, 8);
  }
  stepParts(dt){
    const h = Hh(), k = dt*60;
    for(let i=this.parts.length - 1; i>=0; i--){
      const p = this.parts[i]; p.life -= dt;
      if(p.life <= 0){ this.parts.splice(i, 1); continue; }
      p.vy += (p.g || 0)*k; p.x += p.vx*k; p.y += p.vy*k;
      if(p.grow) p.r += p.grow*dt;
      if(p.spin) p.a += p.spin*k;
      if(!p.mist && p.y > h - 4 && p.vy > 0){
        if(p.splat){ if(this.puddles.length < 90) this.puddles.push({ x:p.x, w:R(10, 26), col:p.col, a:0 }); else { const q = this.puddles[(Math.random()*90)|0]; q.x = p.x; q.col = p.col; } this.parts.splice(i, 1); continue; }
        p.y = h - 4; if(p.bounce && Math.abs(p.vy) > 2){ p.vy *= -p.bounce; p.vx *= 0.7; } else { p.vy = 0; p.vx *= 0.8; p.spin = 0; }
      }
    }
    for(let i=this.tracers.length - 1; i>=0; i--){ this.tracers[i].life -= dt; if(this.tracers[i].life <= 0) this.tracers.splice(i, 1); }
    for(const q of this.puddles) q.a = Math.min(1, q.a + dt*2);
    if(this.shake > 0) this.shake = Math.max(0, this.shake - dt*30);
    if(this.flash > 0) this.flash -= dt;
    if(this.redT > 0) this.redT -= dt;
    if(this.hitmark > 0) this.hitmark -= dt; if(this.killmark > 0) this.killmark -= dt;
    if(this.muzzleT > 0) this.muzzleT -= dt;
  }
  /* ---------- drawing ---------- */
  draw(){
    const g = this.g, d = this.dpr, w = W(), h = Hh();
    g.setTransform(d, 0, 0, d, 0, 0); g.clearRect(0, 0, w, h);
    if(this.shake > 0){ g.translate(R(-1, 1)*this.shake, R(-1, 1)*this.shake); }
    /* the frame cracking */
    if(this.phase === 'crack'){
      if(this.imgOK) g.drawImage(this.img, 0, 0, w, h); else { g.fillStyle = '#120a14'; g.fillRect(0, 0, w, h); }
      const k = Math.min(1, this.phaseT/0.5); g.strokeStyle = 'rgba(255,255,255,.85)'; g.lineWidth = 1.5;
      this._cracks = this._cracks || Array.from({ length:16 }, ()=>{ const a = R(0, 6.28), pts = [[w/2, h/2]]; let x = w/2, y = h/2; for(let s=0;s<8;s++){ x += Math.cos(a + R(-0.4, 0.4))*R(40, 120); y += Math.sin(a + R(-0.4, 0.4))*R(40, 120); pts.push([x, y]); } return pts; });
      for(const c of this._cracks){ g.beginPath(); const n = Math.ceil(c.length*k); g.moveTo(c[0][0], c[0][1]); for(let i=1;i<n;i++) g.lineTo(c[i][0], c[i][1]); g.stroke(); }
      return;
    }
    /* puddles on the ground */
    for(const q of this.puddles){ g.globalAlpha = 0.8*q.a; g.fillStyle = q.col; g.beginPath(); g.ellipse(q.x, h - 2, q.w, 3.5, 0, 0, 7); g.fill(); }
    g.globalAlpha = 1;
    /* glass */
    for(const s of this.shards){
      const b = s.body, age = this.t - s.born;
      g.save(); g.globalAlpha = age > 2.6 ? Math.max(0, 1 - (age - 2.6)/2) : 1;
      g.translate(b.position.x, b.position.y); g.rotate(b.angle);
      g.beginPath(); s.local.forEach((p, i)=>i ? g.lineTo(p.x, p.y) : g.moveTo(p.x, p.y)); g.closePath();
      g.save(); g.clip(); if(this.imgOK) g.drawImage(this.img, -s.ox, -s.oy, w, h); else { g.fillStyle = 'rgba(40,20,50,.25)'; g.fill(); } g.fillStyle = 'rgba(200,230,255,.08)'; g.fill(); g.restore();
      g.strokeStyle = 'rgba(255,255,255,.55)'; g.lineWidth = 1; g.stroke(); g.restore();
    }
    /* the van */
    if(this.van) this.drawVan(g, this.van.x, h);
    /* cops */
    for(const c of this.cops) this.drawCop(g, c);
    /* you */
    if(this.player) this.drawPlayer(g);
    /* the helicopter */
    if(this.heli) this.drawHeli(g, this.heli);
    /* particles */
    for(const p of this.parts){
      if(p.text){ g.globalAlpha = Math.min(1, p.life); g.fillStyle = '#ffd56a'; g.font = '600 15px Oswald, Arial'; g.textAlign = 'center'; g.fillText(p.text, p.x, p.y); g.globalAlpha = 1; continue; }
      if(p.mist || p.splat){ g.globalAlpha = p.mist ? Math.min(1, p.life*1.5) : 1; g.fillStyle = p.col; g.beginPath(); g.arc(p.x, p.y, p.r, 0, 7); g.fill(); g.globalAlpha = 1; continue; }
      g.save(); g.translate(p.x, p.y); if(p.a) g.rotate(p.a); g.globalAlpha = Math.min(1, p.life); g.fillStyle = p.col; g.fillRect(-p.w/2, -p.h/2, p.w, p.h); if(p.door){ g.fillStyle = '#c8c8cc'; g.fillRect(p.w/2 - 8, -10, 3, 20); } if(p.food && p.col === '#f6f6f2'){ g.fillStyle = '#2b6fd6'; g.fillRect(-p.w/2, -2, p.w, 5); } g.restore();
    }
    /* tracers */
    g.lineCap = 'round';
    for(const t of this.tracers){ g.strokeStyle = t.enemy ? 'rgba(255,200,150,.9)' : 'rgba(255,245,200,.95)'; g.lineWidth = 2; g.beginPath(); g.moveTo(t.x1, t.y1); g.lineTo(t.x2, t.y2); g.stroke(); }
    if(this.flash > 0){ g.fillStyle = `rgba(255,255,255,${this.flash})`; g.fillRect(-50, -50, w + 100, h + 100); }
    if(this.redT > 0){ const gr = g.createRadialGradient(w/2, h/2, Math.min(w, h)*0.3, w/2, h/2, Math.max(w, h)*0.7); gr.addColorStop(0, 'rgba(160,0,0,0)'); gr.addColorStop(1, `rgba(160,0,0,${this.redT*1.4})`); g.fillStyle = gr; g.fillRect(0, 0, w, h); }
    g.setTransform(d, 0, 0, d, 0, 0);
    if(this.phase === 'fight' && !this.done) this.drawHud(g, w, h);
    /* the siren wash pulses */
    if(this.wash){ const on = Math.floor(this.t*4) % 2; this.wash.style.background = on ? 'radial-gradient(ellipse at 0% 50%, rgba(255,20,20,.9), transparent 55%)' : 'radial-gradient(ellipse at 100% 50%, rgba(30,60,255,.9), transparent 55%)'; }
  }
  fridge(g, x, y, w, h, body, opt){
    /* a fridge, in two dimensions */
    const r = 7;
    g.fillStyle = body; g.strokeStyle = 'rgba(0,0,0,.55)'; g.lineWidth = 2;
    g.beginPath(); g.roundRect ? g.roundRect(x - w/2, y - h/2, w, h, r) : g.rect(x - w/2, y - h/2, w, h); g.fill(); g.stroke();
    g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(x - w/2 + 3, y - h/2 + h*0.32, w - 6, 2);
    g.fillStyle = '#c8c8cc'; g.fillRect(x + (opt.facing > 0 ? w/2 - 9 : -w/2 + 6), y - h/2 + h*0.42, 3, h*0.25);
    /* face screen */
    const fx = x - w*0.3, fy = y - h/2 + 6, fw = w*0.6, fh = h*0.22;
    g.fillStyle = opt.mask ? '#0b0b0d' : '#05111a'; g.fillRect(fx, fy, fw, fh);
    const eye = opt.eye || '#7ff3ff'; g.fillStyle = eye; g.shadowColor = eye; g.shadowBlur = 6;
    const ex = opt.facing*3;
    if(opt.dead){ g.strokeStyle = eye; g.lineWidth = 2; [fx + fw*0.3, fx + fw*0.7].forEach(cx=>{ g.beginPath(); g.moveTo(cx - 4 + ex, fy + 5); g.lineTo(cx + 4 + ex, fy + 13); g.moveTo(cx + 4 + ex, fy + 5); g.lineTo(cx - 4 + ex, fy + 13); g.stroke(); }); }
    else if(opt.mask){ g.fillStyle = '#222'; g.fillRect(fx + 2, fy + 4, fw - 4, 9); g.fillStyle = eye; g.fillRect(fx + fw*0.25 + ex, fy + 6, 6, 5); g.fillRect(fx + fw*0.62 + ex, fy + 6, 6, 5); }
    else { g.fillRect(fx + fw*0.25 + ex, fy + 5, 5, 8); g.fillRect(fx + fw*0.62 + ex, fy + 5, 5, 8); if(opt.angry){ g.fillRect(fx + fw*0.2 + ex, fy + 3, 9, 2); g.fillRect(fx + fw*0.58 + ex, fy + 3, 9, 2); } }
    g.shadowBlur = 0;
  }
  drawPlayer(g){
    const b = this.player, p = b.position, f = this.facing, bob = Math.abs(Math.sin(this.walkT*0.08))*2;
    g.save(); g.translate(p.x, p.y - bob);
    /* the bag on your back */
    g.fillStyle = '#2a2a2a'; g.beginPath(); g.ellipse(-f*26, 6, 15, 20, -f*0.3, 0, 7); g.fill(); g.fillStyle = '#7dff9a'; g.font = 'bold 14px Arial'; g.textAlign = 'center'; g.fillText('$', -f*26, 11);
    this.fridge(g, 0, 0, 54, 88, this.hurtT > 0 ? '#ffd0d0' : '#eeeeea', { facing:f, mask:true, eye:'#7ff3ff' });
    /* the gun arm */
    g.save(); g.translate(0, -18); g.rotate(this.aim); g.fillStyle = '#eeeeea'; g.fillRect(0, -4, 26, 8); g.fillStyle = '#111'; g.beginPath(); g.arc(26, 0, 6, 0, 7); g.fill();
    const gl = this.gun === 'shotgun' ? 34 : this.gun === 'smg' ? 24 : this.gun === 'freon' ? 30 : 18;
    g.fillStyle = this.gun === 'freon' ? '#e8742a' : '#1d1f22'; g.fillRect(24, -4, gl, 7); if(this.gun === 'smg'){ g.fillRect(30, 2, 6, 10); } if(this.gun === 'freon'){ g.fillStyle = '#7ff3ff'; g.fillRect(24 + gl - 3, -5, 4, 9); }
    if(this.muzzleT > 0){ g.fillStyle = '#ffe090'; g.beginPath(); g.arc(24 + gl + 6, 0, 9, 0, 7); g.fill(); }
    g.restore();
    g.restore();
  }
  drawCop(g, c){
    const b = c.body, p = b.position, w = c.type === 'swat' ? 62 : 52;
    g.save(); g.translate(p.x, p.y); g.rotate(b.angle);
    if(c.chute && c.alive){ g.strokeStyle = 'rgba(255,255,255,.6)'; g.lineWidth = 1; g.beginPath(); g.moveTo(-w/2, -45); g.lineTo(-40, -110); g.moveTo(w/2, -45); g.lineTo(40, -110); g.stroke(); g.fillStyle = '#e8e8e8'; g.beginPath(); g.ellipse(0, -110, 52, 20, 0, Math.PI, 0); g.fill(); g.fillStyle = '#1c2a4a'; g.font = 'bold 11px Arial'; g.textAlign = 'center'; g.fillText('POLICE', 0, -114); }
    this.fridge(g, 0, 0, w, 90, c.frozen ? '#bfeeff' : c.type === 'swat' ? '#15171a' : '#1c2a4a', { facing:c.facing, eye:c.type === 'swat' ? '#ff5a5a' : '#7ff3ff', angry:true, dead:!c.alive });
    if(c.alive){
      /* the light bar */
      const on = Math.floor(this.t*6 + c.t) % 2; g.fillStyle = on ? '#ff2020' : '#401010'; g.fillRect(-16, -54, 14, 8); g.fillStyle = on ? '#102040' : '#2050ff'; g.fillRect(2, -54, 14, 8);
      if(on){ g.fillStyle = 'rgba(255,40,40,.25)'; g.beginPath(); g.arc(-9, -50, 26, 0, 7); g.fill(); } else { g.fillStyle = 'rgba(40,80,255,.25)'; g.beginPath(); g.arc(9, -50, 26, 0, 7); g.fill(); }
      g.fillStyle = '#e0aa45'; g.beginPath(); g.arc(c.facing*-10, 6, 5, 0, 7); g.fill();
      g.fillStyle = '#1d1f22'; g.fillRect(c.facing > 0 ? 20 : -40, -14, 20, 6);
      if(c.flashT > 0){ g.fillStyle = '#ffd080'; g.beginPath(); g.arc(c.facing*44, -11, 7, 0, 7); g.fill(); }
      if(c.type === 'swat'){ g.save(); g.translate(c.facing*(c.peek ? 22 : 36), 6); g.fillStyle = '#121418'; g.fillRect(-6, -42, 12, 84); g.fillStyle = '#9ab8d0'; g.fillRect(-4, -34, 8, 10); g.fillStyle = '#fff'; g.save(); g.rotate(-Math.PI/2); g.font = 'bold 9px Arial'; g.textAlign = 'center'; g.fillText('POLICE', -2, 3); g.restore(); g.restore(); }
      if(c.frozen){ g.fillStyle = 'rgba(190,240,255,.35)'; g.fillRect(-w/2 - 4, -49, w + 8, 98); }
    } else if(c.deadT > 15){ g.globalAlpha = Math.max(0, 1 - (c.deadT - 15)/3); }
    g.restore();
  }
  drawHeli(g, H){
    g.save(); g.translate(H.x, H.y); g.rotate(H.r || 0);
    /* the spotlight */
    if(H.hp > 0){ const p = this.player.position; const gr = g.createLinearGradient(0, 0, p.x - H.x, p.y - H.y); gr.addColorStop(0, 'rgba(255,255,220,.25)'); gr.addColorStop(1, 'rgba(255,255,220,0)'); g.fillStyle = gr; const a = Math.atan2(p.y - H.y, p.x - H.x); g.save(); g.rotate(a); g.beginPath(); g.moveTo(0, 0); g.lineTo(900, -120); g.lineTo(900, 120); g.closePath(); g.fill(); g.restore(); }
    g.fillStyle = '#1c2a4a'; g.beginPath(); g.ellipse(0, 0, 60, 24, 0, 0, 7); g.fill();
    g.fillRect(40, -6, 70, 10); g.fillRect(104, -16, 8, 22);
    g.fillStyle = '#9ab8d0'; g.beginPath(); g.ellipse(-28, -4, 20, 13, 0, 0, 7); g.fill();
    g.fillStyle = '#fff'; g.font = 'bold 11px Arial'; g.textAlign = 'center'; g.fillText('POLICE', 10, 6);
    g.strokeStyle = '#111'; g.lineWidth = 4; const s = Math.sin(this.t*40)*90; g.beginPath(); g.moveTo(-s, -30); g.lineTo(s, -30); g.stroke();
    g.fillRect(-2, -30, 4, 8);
    const on = Math.floor(this.t*5) % 2; g.fillStyle = on ? '#ff2020' : '#2050ff'; g.beginPath(); g.arc(0, 24, 4, 0, 7); g.fill();
    if(H.hp > 0 && H.hp < 200 && Math.random() < 0.3) this.parts.push({ x:H.x + R(-20, 20), y:H.y - 10, vx:R(-1, 1), vy:-1, life:1.2, col:'rgba(70,70,70,.5)', r:8, grow:16, g:-0.02, mist:true });
    g.restore();
  }
  drawVan(g, x, h){
    const y = h - 2;
    g.save(); g.translate(x, y);
    g.fillStyle = '#f2f2ee'; g.beginPath(); g.roundRect ? g.roundRect(0, -120, 260, 96, 10) : g.rect(0, -120, 260, 96); g.fill();
    g.fillStyle = '#e8e8e2'; g.fillRect(0, -78, 50, 54);
    g.fillStyle = '#7aa8c8'; g.fillRect(8, -112, 42, 30);
    g.fillStyle = '#111'; [50, 210].forEach(wx=>{ g.beginPath(); g.arc(wx, -22, 22, 0, 7); g.fill(); g.fillStyle = '#888'; g.beginPath(); g.arc(wx, -22, 9, 0, 7); g.fill(); g.fillStyle = '#111'; });
    g.fillStyle = '#c0392b'; g.font = 'bold 22px Georgia'; g.textAlign = 'center'; g.fillText('TOTALLY NORMAL', 160, -82); g.font = 'bold 16px Georgia'; g.fillText('APPLIANCE DELIVERY', 160, -60);
    g.restore();
    if(this.van.tx === this.van.x || Math.abs(this.van.tx - this.van.x) < 2){ const a = Math.sin(this.t*6)*6; g.fillStyle = '#ffd56a'; g.font = '700 22px Oswald, Arial'; g.textAlign = 'right'; g.fillText('GET IN → ', W() - 10 + a, h - 140); }
  }
  drawHud(g, w, h){
    const top = 34;
    g.textAlign = 'center'; g.font = '700 22px Oswald, Arial'; g.fillStyle = '#fff'; g.shadowColor = '#000'; g.shadowBlur = 4;
    const tt = this.van ? 'THE VAN IS HERE · RUN OFF THE RIGHT EDGE' : 'THE VAN · ' + Math.ceil(this.timer) + 's';
    g.fillText(tt, w/2, top + 24);
    /* coolant */
    const bw = 220, bx = w/2 - bw/2, by = top + 34;
    g.fillStyle = 'rgba(0,0,0,.55)'; g.fillRect(bx, by, bw, 10); g.fillStyle = this.hp < 30 ? '#ff4a3a' : '#7ff3ff'; g.fillRect(bx, by, bw*this.hp/100, 10); g.strokeStyle = 'rgba(255,255,255,.5)'; g.lineWidth = 1; g.strokeRect(bx, by, bw, 10);
    g.font = '500 13px Oswald, Arial'; g.fillStyle = '#fff';
    const G = GUNS[this.gun], a = this.ammo[this.gun];
    g.fillText(G.name + ' · ' + (G.stream ? Math.round(a) + '%' : this.reloadT > 0 ? 'RELOADING' : a + '/' + G.mag) + (navigator.maxTouchPoints > 0 ? '' : '   ·   A D move · W jump · click shoot · R reload · 1-' + this.guns.length + ' guns'), w/2, by + 28);
    const vm = this.vendorOK();
    if(vm){ g.fillStyle = '#ff7ad0'; g.fillText('or go through his door (stand on the grey box, press W)', w/2, by + 46); }
    g.shadowBlur = 0;
    /* crosshair */
    const mx = this.mouse.x, my = this.mouse.y;
    g.strokeStyle = this.killmark > 0 ? '#ff3030' : this.hitmark > 0 ? '#ffd56a' : '#fff'; g.lineWidth = 2;
    g.beginPath(); g.moveTo(mx - 12, my); g.lineTo(mx - 4, my); g.moveTo(mx + 4, my); g.lineTo(mx + 12, my); g.moveTo(mx, my - 12); g.lineTo(mx, my - 4); g.moveTo(mx, my + 4); g.lineTo(mx, my + 12); g.stroke();
    if(this.bigT > 0){ this.bigT -= 1/60; g.globalAlpha = Math.min(1, this.bigT); g.font = '700 ' + Math.min(70, w/11) + 'px Oswald, Arial'; g.fillStyle = '#ffd56a'; g.shadowColor = '#000'; g.shadowBlur = 8; g.fillText(this.bigTxt, w/2, h*0.38); g.font = '500 18px Oswald, Arial'; g.fillStyle = '#fff'; g.fillText(this.bigSub || '', w/2, h*0.38 + 34); g.shadowBlur = 0; g.globalAlpha = 1; }
  }
  big(t, s){ this.bigTxt = t; this.bigSub = s; this.bigT = 3; }
  /* ---------- the ways out ---------- */
  vendorOK(){ try{ const m = window.VENDOR ? VENDOR.loadMem() : {}; return m.relationship === 'together' || (m.deaths || 0) >= 7 || (m.heistFavor || 0) > 0; }catch(e){ return false; } }
  tryDoor(){
    if(this.phase !== 'fight' || this.done || !this.vendorOK()) return;
    const vb = document.getElementById('vendorBox'); if(!vb) return;
    const r = vb.getBoundingClientRect(), p = this.player.position;
    if(p.x > r.left - 30 && p.x < r.right + 30 && p.y > r.top - 140){ this.win('vendor'); }
  }
  vanArrives(){
    const Mt = M();
    this.van = { x:W() + 40, tx:W() - 240 };
    this.sfx.horn(); this.big('THE VAN', 'run off the right edge');
    try{ this.wallWasSensor = rightWall.isSensor; rightWall.isSensor = true; }catch(e){}
  }
  async win(how){
    if(this.done) return; this.done = true;
    const Mt = M();
    if(how === 'vendor'){
      /* he takes care of it */
      const dark = document.createElement('div'); dark.style.cssText = 'position:fixed;inset:0;z-index:10008;background:#000;opacity:0;transition:opacity .4s;'; document.body.appendChild(dark);
      requestAnimationFrame(()=>dark.style.opacity = '1');
      await new Promise(r=>setTimeout(r, 600));
      dark.innerHTML = '<div style="position:absolute;left:50%;top:45%;transform:translate(-50%,-50%);display:flex;gap:46px"><i style="width:14px;height:10px;background:#ff2a1a;box-shadow:0 0 14px #ff2a1a"></i><i style="width:14px;height:10px;background:#ff2a1a;box-shadow:0 0 14px #ff2a1a"></i></div>';
      this.sfx.burst(300, 1, 'lowpass', 0.05, 1.2, 0.6);
      this.cops.forEach(c=>{ try{ Mt.World.remove(world, c.body); }catch(e){} }); this.cops = []; this.heli = null; if(this.rotor){ this.rotor.stop(); this.rotor = null; }
      await new Promise(r=>setTimeout(r, 1800));
      dark.style.opacity = '0'; setTimeout(()=>dark.remove(), 500);
      try{ VENDOR.patch(m=>{ m.heistHid = (m.heistHid || 0) + 1; }); const vb = document.getElementById('vendorBox'); if(vb){ vb.textContent = 'you owe me'; setTimeout(()=>{ try{ VENDOR.updateBox(); }catch(e){} }, 20000); } }catch(e){}
    }
    if(this.siren){ this.siren.stop(); }
    this.wash.style.opacity = '0';
    try{ Mt.World.remove(world, this.player); }catch(e){}
    this.player = null;
    this.payout(how);
  }
  payout(how){
    const P = this.P;
    const cut = Math.round((P.loot || 0)*(P.cut || 0));
    const total = Math.max(0, (P.loot || 0) - cut);
    /* the fridges come home: some fall from the sky, the rest go straight on the counter */
    let rain = Math.min(30, total);
    try{ FRIDGE_BANK.give(total - rain); }catch(e){}
    const rainT = setInterval(()=>{ if(rain-- <= 0){ clearInterval(rainT); return; } try{ spawnFridge(); }catch(e){ try{ FRIDGE_BANK.give(1); }catch(e2){} } }, 90);
    /* the save */
    try{
      const s = JSON.parse(localStorage.getItem('fridgepalace_v1') || '{}'); s.heist = s.heist || {};
      const H = s.heist;
      if(P.story) H.story = 3;
      H.runs = (H.runs || 0) + 1; H.totalStolen = (H.totalStolen || 0) + total; H.bestRun = Math.max(H.bestRun || 0, total);
      H.heat = Math.min(5, (H.heat || 0) + 1); H.heatAt = Date.now(); H.wantedUntil = Date.now() + 86400000;
      if(P.freon) H.freonKept = true;
      H.lastEscape = how || 'van';
      localStorage.setItem('fridgepalace_v1', JSON.stringify(s));
    }catch(e){}
    try{ if(window.MKT && MKT.heistEvent) MKT.heistEvent('escaped', total); }catch(e){}
    if(this.tick) this.tick.querySelector('span').textContent = 'LIVE · THE SUSPECT GOT AWAY · ' + fmt(total) + ' FRIDGES UNACCOUNTED FOR · THE FRIDGE PALACE IS CLOSED FOR REPAIRS · POLICE "LOOKING INTO IT" · ';
    const B = P.breakdown || {};
    const rows = [['the floor', B.floor], ['doug\'s bag', B.cage], ['chip trays', B.tables], ['the vault', B.vault], ['gold bars', B.gold], ['slot coins', B.slots]].filter(r=>r[1] > 0).map(r=>`<tr><td>${r[0]}</td><td>${fmt(r[1])}</td></tr>`).join('');
    const extra = [P.vendorKill ? 'the vendor took care of clement' : '', P.chandelier ? 'you dropped a chandelier' : '', how === 'vendor' ? 'you went through his door' : '', this.pageHits ? 'the website took ' + this.pageHits + ' bullet' + (this.pageHits === 1 ? '' : 's') : '', this.signHits >= 3 ? 'the sign is hanging by one nail' : ''].filter(Boolean).join(' · ');
    this.card(`<h1 style="color:#7dff9a">ESCAPED</h1><table>${rows}${cut ? `<tr><td>${(P.crew || 'crew')}'s cut</td><td style="color:#ff8a7a">-${fmt(cut)}</td></tr>` : ''}<tr><td><b>ON YOUR COUNTER</b></td><td><b>${fmt(total)}</b></td></tr></table><p style="opacity:.75">${extra}</p><p style="opacity:.6">the palace will look different next time you go in.</p>`, [{ t:'KEEP IT', gold:true }]).then(()=>this.cleanup(true));
  }
  bust(){
    if(this.done) return; this.done = true;
    if(this.siren) this.siren.stop();
    try{ if(window.MKT && MKT.heistEvent) MKT.heistEvent('busted'); }catch(e){}
    this.card(`<h1 style="color:#ff3a2a">BUSTED</h1><p>they got you on the main page. in front of everybody. the bag goes into evidence.</p>`, [{ t:'TRY THE ESCAPE AGAIN', gold:true }, { t:'GIVE UP' }]).then(i=>{
      if(i === 0){ const P = Object.assign({}, this.P, { retry:true, tries:(this.P.tries || 0) + 1 }); this.cleanup(false, true); run(P); }
      else { try{ const s = JSON.parse(localStorage.getItem('fridgepalace_v1') || '{}'); s.heist = s.heist || {}; if(this.P.story) s.heist.story = 3; s.heist.busted = (s.heist.busted || 0) + 1; localStorage.setItem('fridgepalace_v1', JSON.stringify(s)); }catch(e){} this.cleanup(false); }
    });
  }
  card(html, buttons){
    this.cardOpen = true;
    return new Promise(res=>{
      const c = document.createElement('div'); c.className = 'fp-card';
      c.innerHTML = `<div class="in">${html}<div>${buttons.map((b, i)=>`<button data-i="${i}" class="${b.gold ? 'gold' : ''}">${b.t}</button>`).join('')}</div></div>`;
      document.body.appendChild(c);
      c.querySelectorAll('button').forEach(b=>b.onclick = e=>{ e.stopPropagation(); c.remove(); this.cardOpen = false; res(+b.dataset.i); });
    });
  }
  cleanup(won, retry){
    const Mt = M();
    this.alive = false; cancelAnimationFrame(this.raf);
    this.unbind && this.unbind();
    this.sfx.stopAll();
    try{ if(this.player) Mt.World.remove(world, this.player); }catch(e){}
    this.cops.forEach(c=>{ try{ Mt.World.remove(world, c.body); }catch(e){} });
    this.shards.forEach(s=>{ try{ Mt.World.remove(world, s.body); }catch(e){} });
    try{ rightWall.isSensor = false; }catch(e){}
    try{ mouseConstraint.collisionFilter.mask = this.mcMask === undefined ? 0xFFFFFFFF : this.mcMask; }catch(e){}
    this.cv.remove(); this.wash.remove(); (this.btns || []).forEach(b=>b.remove());
    window.removeEventListener('resize', this._rs);
    document.documentElement.classList.remove('fp-escape');
    if(!retry){ setTimeout(()=>{ try{ this.tick.remove(); }catch(e){} }, won ? 14000 : 0); try{ gameActive = false; }catch(e){} try{ if(window.fpWanted) window.fpWanted(); }catch(e){} }
    else this.tick.remove();
  }
}
