/* ============================================================
   FRIDGE PALACE: the slots floor
   34 cabinets, five themes, one progressive, one that isn't
   plugged in for most people, one that's out of order forever.
============================================================ */
import * as THREE from '../lib/three.module.min.js';
import { bakePainted } from '../world/fridge.js';
import { G, stool } from '../world/props.js';
import { THEMES, PAINT, evaluate, spinGrid, pickPrizes } from './slots-themes.js';
import { canvas, tex } from '../world/textures.js';
import { mergeGeometries } from '../lib/addons/utils/BufferGeometryUtils.js';
import { fair, pick } from '../core/util.js';

const SYMW = 120, SYMH = 100;
const spriteCache = {};
function sprite(sym){
  if(spriteCache[sym]) return spriteCache[sym];
  const c = canvas(SYMW, SYMH), g = c.getContext('2d');
  if(PAINT[sym]) PAINT[sym](g, SYMW/2, SYMH/2);
  return spriteCache[sym] = c;
}

/* one screen = one canvas + the reel state machine */
class Screen {
  constructor(th, w, h){
    this.th = th; this.W = w || 512; this.H = h || 384;
    this.c = canvas(this.W, this.H); this.g = this.c.getContext('2d');
    this.t = tex(this.c, { nomip:true });
    const n = th.reels;
    this.off = th.strips.map(s=>Math.floor(Math.random()*s.length));
    this.spin = th.strips.map(()=>null);
    this.wins = null; this.flash = 0; this.msg = ''; this.msgT = 0; this.big = null; this.time = 0;
    this.credits = 0; this.bet = 0; this.win = 0; this.free = 0;
    this.areaX = 18; this.areaY = 62; this.areaW = this.W - 36; this.areaH = this.H - 62 - 46;
    this.cw = this.areaW/n; this.ch = this.areaH/th.rows;
  }
  start(stops, durs){
    const t0 = this.time;
    this.spin = stops.map((st, r)=>({ from:this.off[r], to:st, t0, dur:durs[r], done:false }));
    this.wins = null; this.big = null;
  }
  spinning(){ return this.spin.some(s=>s && !s.done); }
  update(dt, onStop){
    this.time += dt;
    for(let r=0; r<this.spin.length; r++){
      const s = this.spin[r]; if(!s || s.done) continue;
      const len = this.th.strips[r].length, k = (this.time - s.t0)/s.dur;
      /* spin forward a few whole strips plus the distance to the stop; ease out with a small overshoot */
      const dist = ((s.from - s.to) % len + len) % len + len*(2 + r);
      if(k >= 1){ s.done = true; this.off[r] = s.to; if(onStop) onStop(r); continue; }
      const kk = Math.min(1, k/0.88), e = 1 - Math.pow(1 - kk, 3);
      const bounce = k > 0.88 ? Math.sin((k - 0.88)/0.12*Math.PI)*0.28 : 0;
      this.off[r] = ((s.from - dist*e - bounce) % len + len) % len;
      s.speed = k < 0.78 ? 1 : 0;
    }
  }
  draw(attract){
    const g = this.g, th = this.th, W = this.W, H = this.H;
    const bg = g.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, th.bg[0]); bg.addColorStop(1, th.bg[1]); g.fillStyle = bg; g.fillRect(0, 0, W, H);
    /* header */
    g.fillStyle = th.trim; g.font = 'bold 26px Georgia, serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.shadowColor = th.trim; g.shadowBlur = 12; g.fillText(th.name, W/2, 24); g.shadowBlur = 0;
    if(th.progressive){ g.fillStyle = '#ffe36a'; g.font = 'bold 18px Georgia, serif'; g.fillText('JACKPOT ' + Math.floor(this.jackpot || 25000).toLocaleString(), W/2, 48); }
    else { g.fillStyle = 'rgba(255,255,255,0.6)'; g.font = '13px Georgia, serif'; g.fillText(th.sub, W/2, 48); }
    /* reels */
    const ax = this.areaX, ay = this.areaY, cw = this.cw, ch = this.ch;
    g.save(); g.beginPath(); g.rect(ax, ay, this.areaW, this.areaH); g.clip();
    for(let r=0; r<th.reels; r++){
      const x = ax + r*cw;
      const rg = g.createLinearGradient(x, ay, x, ay + this.areaH); rg.addColorStop(0, '#9a9a9a'); rg.addColorStop(0.15, '#e4e0d8'); rg.addColorStop(0.85, '#e4e0d8'); rg.addColorStop(1, '#8a8a8a');
      g.fillStyle = th.id === 'vendor' ? '#1a0a08' : rg; g.fillRect(x + 2, ay, cw - 4, this.areaH);
      const strip = th.strips[r], len = strip.length, o = this.off[r], base = Math.floor(o), fr = o - base;
      const sp = this.spin[r], moving = sp && !sp.done && sp.speed;
      for(let row=-1; row<=th.rows; row++){
        const sym = strip[((base + row) % len + len) % len];
        const y = ay + (row - fr)*ch;
        const im = sprite(sym);
        const s = Math.min(cw/SYMW, ch/SYMH)*0.95;
        const dw = SYMW*s, dh = SYMH*s;
        if(moving){ g.globalAlpha = 0.55; g.drawImage(im, x + cw/2 - dw/2, y + ch/2 - dh*0.7, dw, dh*1.4); g.globalAlpha = 1; }
        else g.drawImage(im, x + cw/2 - dw/2, y + ch/2 - dh/2, dw, dh);
      }
      /* expanded wild overlay */
      if(this.expanded && this.expanded[r]){ g.fillStyle = 'rgba(160,230,255,0.25)'; g.fillRect(x + 2, ay, cw - 4, this.areaH); }
    }
    g.restore();
    /* reel shading + dividers */
    const sh = g.createLinearGradient(0, ay, 0, ay + this.areaH); sh.addColorStop(0, 'rgba(0,0,0,0.45)'); sh.addColorStop(0.18, 'rgba(0,0,0,0)'); sh.addColorStop(0.82, 'rgba(0,0,0,0)'); sh.addColorStop(1, 'rgba(0,0,0,0.45)');
    g.fillStyle = sh; g.fillRect(ax, ay, this.areaW, this.areaH);
    g.strokeStyle = th.trim; g.lineWidth = 3; g.strokeRect(ax, ay, this.areaW, this.areaH);
    for(let r=1; r<th.reels; r++){ g.fillStyle = 'rgba(0,0,0,0.5)'; g.fillRect(ax + r*cw - 2, ay, 4, this.areaH); }
    if(th.reels === 3 && th.lines.length === 1){ g.strokeStyle = 'rgba(255,60,60,0.8)'; g.lineWidth = 2; g.beginPath(); g.moveTo(ax - 8, ay + ch*1.5); g.lineTo(ax + this.areaW + 8, ay + ch*1.5); g.stroke(); }
    /* wins */
    if(this.wins && this.wins.length){
      const show = this.wins[Math.floor(this.time*1.4) % this.wins.length];
      const pulse = 0.6 + 0.4*Math.sin(this.time*10);
      g.lineWidth = 4; g.strokeStyle = `rgba(255,230,90,${pulse})`;
      show.cells.forEach(([r, row])=>{ g.strokeRect(ax + r*cw + 4, ay + row*ch + 3, cw - 8, ch - 6); });
      if(show.line >= 0){ const ln = th.lines[show.line]; g.strokeStyle = `rgba(255,80,80,${pulse})`; g.lineWidth = 3; g.beginPath(); ln.forEach((row, r)=>{ const px = ax + r*cw + cw/2, py = ay + row*ch + ch/2; r ? g.lineTo(px, py) : g.moveTo(px, py); }); g.stroke(); }
    }
    /* footer: credits / bet / win */
    const fy = H - 24;
    g.fillStyle = 'rgba(0,0,0,0.6)'; g.fillRect(0, H - 44, W, 44);
    g.font = 'bold 15px Georgia, serif'; g.textAlign = 'left'; g.fillStyle = '#9ad'; g.fillText('CREDITS', 12, fy - 8); g.fillStyle = '#fff'; g.font = 'bold 18px Georgia, serif'; g.fillText(Math.floor(this.credits).toLocaleString(), 12, fy + 11);
    g.textAlign = 'center'; g.font = 'bold 15px Georgia, serif'; g.fillStyle = '#9ad'; g.fillText(this.free > 0 ? 'FREE SPINS' : 'BET', W/2, fy - 8); g.fillStyle = this.free > 0 ? '#ffe36a' : '#fff'; g.font = 'bold 18px Georgia, serif'; g.fillText(this.free > 0 ? this.free + ' LEFT' : String(this.bet), W/2, fy + 11);
    g.textAlign = 'right'; g.font = 'bold 15px Georgia, serif'; g.fillStyle = '#9ad'; g.fillText('WIN', W - 12, fy - 8); g.fillStyle = this.win ? '#ffe36a' : '#fff'; g.font = 'bold 18px Georgia, serif'; g.fillText(Math.floor(this.win).toLocaleString(), W - 12, fy + 11);
    if(attract && Math.floor(this.time*2) % 2){ g.fillStyle = 'rgba(0,0,0,0.55)'; g.fillRect(W/2 - 110, H/2 - 22, 220, 44); g.fillStyle = th.trim; g.font = 'bold 22px Georgia, serif'; g.textAlign = 'center'; g.fillText(th.id === 'vendor' ? 'COME IN' : 'PLAY ME', W/2, H/2); }
    if(this.big){ const k = Math.min(1, (this.time - this.big.t)*3); g.save(); g.translate(W/2, H/2); g.scale(0.6 + k*0.4 + Math.sin(this.time*8)*0.03, 0.6 + k*0.4 + Math.sin(this.time*8)*0.03); g.fillStyle = 'rgba(0,0,0,0.7)'; g.fillRect(-200, -50, 400, 100); g.fillStyle = this.big.col; g.font = 'bold 42px Georgia, serif'; g.textAlign = 'center'; g.shadowColor = this.big.col; g.shadowBlur = 20; g.fillText(this.big.text, 0, -10); g.shadowBlur = 0; g.fillStyle = '#fff'; g.font = 'bold 26px Georgia, serif'; g.fillText(Math.floor(this.big.amt).toLocaleString(), 0, 28); g.restore(); }
    if(this.msg && this.time < this.msgT){ g.fillStyle = 'rgba(0,0,0,0.7)'; g.fillRect(0, H/2 - 18, W, 36); g.fillStyle = '#fff'; g.font = 'bold 18px Georgia, serif'; g.textAlign = 'center'; g.fillText(this.msg, W/2, H/2); }
    this.t.needsUpdate = true;
  }
  say(m, d){ this.msg = m; this.msgT = this.time + (d || 2); }
}

export function init(C){
  const { scene, M } = C, B = C.world.batch;
  const machines = [];
  const paint = {}, trims = {};
  const attract = {};
  Object.values(THEMES).forEach(th=>{
    paint[th.id] = new THREE.MeshStandardMaterial({ color:th.color, roughness:0.28, metalness:0.55, envMapIntensity:1.2 });
    trims[th.id] = new THREE.MeshBasicMaterial({ color:th.trim, toneMapped:false });
    const s = new Screen(th, 384, 288); s.credits = 0; s.bet = th.bets[0]*th.lines.length; s.draw(true);
    attract[th.id] = s;
  });
  const bezelM = M.black;
  /* shared geometry: the two glowing edge strips + the candle on top, and the lever arm */
  const boxAt = (sx, sy, sz, x, y, z)=>{ const g = new THREE.BoxGeometry(sx, sy, sz); g.translate(x, y, z); return g; };
  const cylAt = (r, h, x, y, z, rz)=>{ const g = new THREE.CylinderGeometry(r, r, h, 10).toNonIndexed(); if(rz) g.rotateZ(rz); g.translate(x, y, z); return g; };
  const trimGeo = mergeGeometries([boxAt(0.02, 1.38, 0.02, -0.4, 0.95, 0.3).toNonIndexed(), boxAt(0.02, 1.38, 0.02, 0.4, 0.95, 0.3).toNonIndexed(), cylAt(0.05, 0.1, 0, 2.2, -0.08)], false);
  const leverGeo = mergeGeometries([cylAt(0.014, 0.36, 0, 0.18, 0), cylAt(0.04, 0.05, 0, 0, 0, Math.PI/2)], false);
  const knobM = new THREE.MeshStandardMaterial({ color:0xd01020, roughness:0.2, metalness:0.2 });
  const btnM = [0xff4a4a, 0xffd400, 0x3ddc84].map(c=>new THREE.MeshBasicMaterial({ color:c, toneMapped:false }));
  const topperM = {};
  Object.values(THEMES).forEach(th=>{ const c = canvas(512, 160), g = c.getContext('2d'); g.fillStyle = '#0a0608'; g.fillRect(0, 0, 512, 160); g.strokeStyle = th.trim; g.lineWidth = 6; g.strokeRect(6, 6, 500, 148); g.fillStyle = th.trim; g.shadowColor = th.trim; g.shadowBlur = 18; g.font = 'bold 54px Georgia, serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; const words = th.name.split(' '); if(th.name.length > 14){ g.font = 'bold 44px Georgia, serif'; g.fillText(words.slice(0, Math.ceil(words.length/2)).join(' '), 256, 56); g.fillText(words.slice(Math.ceil(words.length/2)).join(' '), 256, 108); } else g.fillText(th.name, 256, 84); topperM[th.id] = new THREE.MeshBasicMaterial({ map:tex(c), color:0xd8d8d8, toneMapped:false }); });
  const bodyG = G.rbox(0.78, 1.42, 0.6, 0.06), topG = G.rbox(0.74, 0.3, 0.34, 0.05);
  const v3 = new THREE.Vector3();
  const vm = ()=>{ try{ return window.VENDOR ? VENDOR.loadMem() : {}; }catch(e){ return {}; } };
  const vendorOn = (vm().deaths || 0) >= 1;
  /* belly glass art per theme */
  const belly = {};
  Object.values(THEMES).forEach(th=>{ const c = canvas(256, 128), g = c.getContext('2d'); const gr = g.createLinearGradient(0, 0, 256, 128); gr.addColorStop(0, th.bg[0]); gr.addColorStop(1, th.color); g.fillStyle = gr; g.fillRect(0, 0, 256, 128); g.fillStyle = th.trim; g.font = 'bold 26px Georgia, serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.shadowColor = th.trim; g.shadowBlur = 10; const words = th.name.split(' '); if(words.length > 2){ g.fillText(words.slice(0, 2).join(' '), 128, 46); g.fillText(words.slice(2).join(' '), 128, 82); } else g.fillText(th.name, 128, 64); belly[th.id] = new THREE.MeshStandardMaterial({ map:tex(c), emissive:0xffffff, emissiveMap:tex(c), emissiveIntensity:0.5, roughness:0.2 }); });
  const brokenTex = (()=>{ const c = canvas(384, 288), g = c.getContext('2d'); g.fillStyle = '#05080a'; g.fillRect(0, 0, 384, 288); g.fillStyle = '#efe9d8'; g.save(); g.translate(192, 144); g.rotate(-0.08); g.fillRect(-150, -50, 300, 100); g.fillStyle = '#c8162a'; g.font = 'bold 40px Georgia, serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('OUT OF ORDER', 0, -8); g.fillStyle = '#333'; g.font = '14px Georgia, serif'; g.fillText('sorry for the inconvenience · mgmt', 0, 28); g.restore(); return tex(c); })();
  const darkTex = (()=>{ const c = canvas(384, 288), g = c.getContext('2d'); g.fillStyle = '#010101'; g.fillRect(0, 0, 384, 288); g.fillStyle = '#1a0606'; g.font = '16px Georgia, serif'; g.textAlign = 'center'; g.fillText('unplugged', 192, 150); return tex(c); })();

  C.world.anchors.slots.forEach((a, idx)=>{
    const th = THEMES[a.theme] || THEMES.burn;
    const broken = a.theme === 'broken', isVendor = a.theme === 'vendor';
    const T = broken ? THEMES.burn : th;
    const grp = new THREE.Group(); grp.position.set(a.x, 0, a.z); grp.rotation.y = a.ry; grp.updateMatrixWorld();
    const stat = new THREE.Group(); grp.add(stat);
    const body = new THREE.Mesh(bodyG, broken ? M.steel : paint[T.id]); body.position.set(0, 0.95, 0); stat.add(body);
    const base = new THREE.Mesh(G.box, M.black); base.scale.set(0.84, 0.24, 0.66); base.position.y = 0.12; stat.add(base);
    const bez = new THREE.Mesh(G.box, bezelM); bez.scale.set(0.66, 0.5, 0.04); bez.position.set(0, 1.32, 0.3); bez.rotation.x = -0.18; stat.add(bez);
    const deck = new THREE.Mesh(G.box, M.black); deck.scale.set(0.74, 0.08, 0.26); deck.position.set(0, 0.98, 0.38); deck.rotation.x = 0.25; stat.add(deck);
    const tray = new THREE.Mesh(G.box, M.chrome); tray.scale.set(0.5, 0.06, 0.14); tray.position.set(0, 0.4, 0.34); stat.add(tray);
    const bl = new THREE.Mesh(G.plane, broken ? M.steel : belly[T.id]); bl.scale.set(0.6, 0.3, 1); bl.position.set(0, 0.68, 0.302); stat.add(bl);
    const top = new THREE.Mesh(topG, broken ? M.steel : paint[T.id]); top.position.set(0, 1.83, -0.08); stat.add(top);
    const pole = new THREE.Mesh(G.cyl8, M.chrome); pole.scale.set(0.015, 0.2, 0.015); pole.position.set(0, 2.06, -0.08); stat.add(pole);
    const topPlate = new THREE.Mesh(G.plane, broken ? M.black : topperM[T.id]); topPlate.scale.set(0.66, 0.2, 1); topPlate.position.set(0, 1.83, 0.095); stat.add(topPlate);
    [-0.2, 0, 0.2].forEach((x, i)=>{ const bt = new THREE.Mesh(G.cyl8, broken ? M.black : btnM[i]); bt.scale.set(0.035, 0.02, 0.035); bt.position.set(x, 1.03, 0.42); bt.rotation.x = 0.25; stat.add(bt); });
    stat.updateMatrixWorld(true); B.addObject(stat); grp.remove(stat);
    /* the moving / glowing parts */
    const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 0.45), new THREE.MeshBasicMaterial({ map:broken ? brokenTex : (isVendor && !vendorOn ? darkTex : attract[th.id].t), color:0xb8b8b8 }));
    screen.position.set(0, 1.32, 0.323); screen.rotation.x = -0.18; grp.add(screen);
    const trimMesh = new THREE.Mesh(trimGeo, broken ? M.black : trims[T.id]); grp.add(trimMesh);
    const lever = new THREE.Group(); lever.position.set(0.43, 1.05, 0.05);
    lever.add(new THREE.Mesh(leverGeo, M.chrome));
    const knob = new THREE.Mesh(G.sph, knobM); knob.scale.setScalar(0.04); knob.position.y = 0.37; lever.add(knob); bakePainted(lever);
    grp.add(lever);
    scene.add(grp);
    /* stool in front */
    const sx = a.x + Math.sin(a.ry)*0.85, sz = a.z + Math.cos(a.ry)*0.85;
    stool(B, M, sx, sz, 0.72);
    const mc = { a, th, T, grp, screen, lever, trim:trimMesh, broken, isVendor, busy:false, idx, seat:new THREE.Vector3(sx, 0, sz), npc:null, lastJingle:0 };
    machines.push(mc);
    const front = new THREE.Vector3(Math.sin(a.ry), 0, Math.cos(a.ry));
    const ipos = new THREE.Vector3(a.x, 1.25, a.z).addScaledVector(front, 0.35);
    if(broken){
      let hits = 0;
      C.world.interact.push({ pos:ipos, r:2.2, text:()=>'out of order', use:()=>{
        hits++; C.audio.reelStop(ipos);
        mc.grp.position.x += (Math.random() - 0.5)*0.02; setTimeout(()=>{ mc.grp.position.x = a.x; }, 80);
        if(hits === 7){ C.save.pay(1, 'out of order'); C.hud.say('OUT OF ORDER', 'ow.'); C.audio.coins(ipos, 1); C.save.egg('broken7'); }
        else if(hits === 38){ C.save.pay(38, 'out of order'); C.hud.say('OUT OF ORDER', 'thirty eight. for the king. now leave me alone.'); C.audio.coins(ipos, 12); C.save.egg('broken38'); }
        else if(hits > 38 && hits % 10 === 0){ C.hud.say('OUT OF ORDER', pick(['still out of order.', 'please.', 'i have a family. they are also out of order.'])); }
        else C.hud.toast(pick(['it doesn\'t do anything.', 'the sign says out of order.', 'nothing.', 'a quiet clunk.', 'still nothing.']));
      } });
    } else {
      C.world.interact.push({ pos:ipos, r:2.2, enabled:()=>!mc.npc, text:()=>isVendor && !vendorOn ? 'it\'s unplugged' : `play ${th.name} · ${th.bets[0]*(th.reels === 3 && th.lines.length === 1 ? 1 : th.lines.length)}+ chips`, use:()=>{
        if(isVendor && !vendorOn){ C.hud.toast('the cord goes into the wall and keeps going.'); return; }
        play(mc);
      } });
    }
    C.collide.boxC(a.x, a.z, 0.84, 0.68, a.ry, 'slot');
  });

  /* ---------- playing ---------- */
  let cur = null;
  function play(mc){
    const th = mc.th, front = new THREE.Vector3(Math.sin(mc.a.ry), 0, Math.cos(mc.a.ry));
    const scr = new Screen(th, 512, 384);
    scr.credits = C.save.chips; scr.jackpot = C.save.d.jackpot;
    mc.screen.material.map = scr.t; mc.screen.material.needsUpdate = true;
    const lineChoices = th.lines.length;
    cur = { mc, scr, th, lineBet:th.bets[0], lines:lineChoices, auto:0, freeLeft:0, freeMult:1, freeWin:0, busy:false };
    scr.bet = cur.lineBet*cur.lines;
    const sp = mc.screen.getWorldPosition(new THREE.Vector3());
    const camPos = sp.clone().addScaledVector(front, 0.82); camPos.y = 1.42;
    C.player.pos.set(mc.seat.x, 0, mc.seat.z); C.player.yaw = Math.atan2(-front.x, -front.z);
    C.sit(camPos, sp, exit);
    ui();
    if(mc.isVendor){ C.audio.whisper('come in'); C.hud.say('', 'the screen is warm. it knows your count.'); }
  }
  function exit(){
    if(!cur) return;
    if(cur.busy){ cur.auto = 0; if(!cur.leaveAfter){ cur.leaveAfter = true; C.hud.toast('standing up after this spin'); } return; }
    const mc = cur.mc; mc.screen.material.map = attract[mc.th.id].t; mc.screen.material.needsUpdate = true;
    cur = null;
    C.standUp();
  }
  function ui(){
    if(!cur) return;
    const th = cur.th;
    const p = C.hud.panel(`
      <div class="fp-ptitle">${th.name}<span class="sp"></span><small>${th.sub}</small><button data-a="pay">PAYTABLE</button><button data-a="exit">STAND UP</button></div>
      <div class="fp-row">
        <div class="fp-slotbox"><small>BET / LINE</small><div><button data-a="bd">−</button><b id="sl-lb">${cur.lineBet}</b><button data-a="bu">+</button></div></div>
        <div class="fp-slotbox"><small>LINES</small><b>${cur.lines}</b></div>
        <div class="fp-slotbox"><small>TOTAL BET</small><b id="sl-tb">${cur.lineBet*cur.lines}</b></div>
        <div class="fp-slotbox"><small>LAST WIN</small><b id="sl-w">0</b></div>
      </div>
      <div class="fp-row">
        <button data-a="max">MAX BET</button>
        <button data-a="spin" class="fp-gold fp-spin">SPIN</button>
        <button data-a="auto">AUTO ×10</button>
        <button data-a="auto25">×25</button>
      </div>
      <div class="fp-row fp-dim" id="sl-msg">${C.input.touch ? 'tap SPIN' : 'space or click SPIN · the lever works too'}</div>`, 'fp-slotpanel');
    p.querySelector('[data-a="exit"]').onclick = exit;
    p.querySelector('[data-a="spin"]').onclick = ()=>spin();
    p.querySelector('[data-a="max"]').onclick = ()=>{ cur.lineBet = th.bets[th.bets.length - 1]; refresh(); spin(); };
    p.querySelector('[data-a="bd"]').onclick = ()=>{ const i = th.bets.indexOf(cur.lineBet); cur.lineBet = th.bets[Math.max(0, i - 1)]; refresh(); C.audio.click(); };
    p.querySelector('[data-a="bu"]').onclick = ()=>{ const i = th.bets.indexOf(cur.lineBet); cur.lineBet = th.bets[Math.min(th.bets.length - 1, i + 1)]; refresh(); C.audio.click(); };
    p.querySelector('[data-a="auto"]').onclick = ()=>{ cur.auto = 10; spin(); };
    p.querySelector('[data-a="auto25"]').onclick = ()=>{ cur.auto = 25; spin(); };
    p.querySelector('[data-a="pay"]').onclick = paytable;
  }
  function refresh(){ if(!cur) return; const p = C.hud.$('#fp-panel'); const tb = cur.lineBet*cur.lines; cur.scr.bet = tb; const a = p.querySelector('#sl-lb'); if(a) a.textContent = cur.lineBet; const b = p.querySelector('#sl-tb'); if(b) b.textContent = tb; }
  function msg(t){ const m = C.hud.$('#sl-msg'); if(m) m.textContent = t; }
  function paytable(){
    const th = cur.th;
    const rows = Object.keys(th.pays).filter(k=>th.pays[k].some(v=>v > 0)).map(k=>`<tr><td><canvas data-sym="${k}" width="60" height="50"></canvas></td><td>${th.names[k] || k}</td><td>${th.pays[k].map((v, i)=>(th.reels === 3 ? '3×' : (i + 3) + '×') + ' ' + v).join(' · ')}</td></tr>`).join('');
    const extra = [th.anybar ? `<p>any 3 bars pay ${th.anybar} per line</p>` : '', th.scatter ? `<p>${th.names[th.scatter]}: 3/4/5 anywhere pays ${Object.values(th.scatterPays).join('/')}× total bet${th.free ? ` and triggers ${th.free.count} free spins at ${th.free.mult}×` : ''}${th.pick ? ' and opens the back room: pick fridges, avoid him' : ''}</p>` : '', th.expand ? '<p>wilds on reels 2, 3 and 4 expand to fill the reel</p>' : '', th.progressive ? `<p>three JACKPOTs on the line at max bet (25/line) win the progressive. any other bet pays ${th.pays.jack[0]}× line bet.</p><p>cherry rule: a drop in the first position pays ${th.cherryish.drop[0]}, two drops pay ${th.cherryish.drop[1]}</p>` : '', '<p class="fp-dim">pays are multiplied by your bet per line. return to player is about 94 to 95 percent. the house thanks you.</p>'].join('');
    const b = C.hud.modal({ title:th.name + ' · PAYTABLE', html:`<table class="fp-pay">${rows}</table>${extra}` });
    b.querySelectorAll('canvas[data-sym]').forEach(cv=>{ const g = cv.getContext('2d'); g.drawImage(sprite(cv.dataset.sym), 0, 0, 60, 50); });
  }
  async function spin(){
    if(!cur || cur.busy) return;
    const th = cur.th, mc = cur.mc, scr = cur.scr;
    const free = cur.freeLeft > 0;
    const tb = cur.lineBet*cur.lines;
    if(!free){
      if(!C.save.bet(tb, th.name)){ msg('not enough chips. the cage is by the door.'); C.audio.error(); cur.auto = 0; return; }
      if(th.progressive){ C.save.d.jackpot += tb*0.03; }
    } else { cur.freeLeft--; scr.free = cur.freeLeft; }
    cur.busy = true; C.save.d.stats.spins++;
    scr.credits = C.save.chips; scr.win = 0; scr.expanded = null;
    /* lever pull */
    C.tweens.add({ dur:0.45, update:k=>{ mc.lever.rotation.x = Math.sin(k*Math.PI)*0.9; } });
    const { stops, grid } = spinGrid(th, fair);
    const res = evaluate(th, grid, cur.lineBet, cur.lines);
    /* anticipation: two scatters early stretches the last reels */
    let durs = th.strips.map((s, r)=>(th.reels === 3 ? 0.9 : 1.0) + r*0.28);
    if(th.scatter){ let n = 0; for(let r=0; r<th.reels - 1; r++){ if(grid[r].indexOf(th.scatter) >= 0) n++; if(n >= 2){ for(let k=r + 1; k<th.reels; k++) durs[k] += 0.9 + (k - r)*0.4; break; } } }
    scr.start(stops, durs);
    const snd = C.audio.slotSpinStart(mc.screen.getWorldPosition(v3));
    await new Promise(res2=>{
      const tick = ()=>{ if(!cur || cur.scr !== scr){ res2(); return; } if(!scr.spinning()){ res2(); return; } requestAnimationFrame(tick); };
      cur.onReelStop = r=>{ C.audio.reelStop(mc.screen.getWorldPosition(v3)); };
      tick();
    });
    if(snd) snd.stop();
    if(!cur || cur.scr !== scr){ return; }
    if(th.expand) scr.expanded = grid.map((col, r)=>th.expand.indexOf(r) >= 0 && col.indexOf(th.wild) >= 0);
    let win = res.total*(free ? cur.freeMult : 1);
    let jack = false;
    if(th.progressive && cur.lineBet === th.bets[th.bets.length - 1] && res.wins.some(w=>w.sym === 'jack')){
      jack = true; win = win - th.pays.jack[0]*cur.lineBet + Math.floor(C.save.d.jackpot); C.save.d.jackpot = 25000; C.save.d.stats.jackpots++;
    }
    scr.wins = res.wins;
    if(free) cur.freeWin += win;
    if(win > 0){
      C.save.pay(win, th.name);
      scr.win = win; scr.credits = C.save.chips;
      const x = win/tb;
      const pos = mc.screen.getWorldPosition(new THREE.Vector3());
      const tray = new THREE.Vector3(mc.a.x, 0.45, mc.a.z).addScaledVector(new THREE.Vector3(Math.sin(mc.a.ry), 0, Math.cos(mc.a.ry)), 0.4);
      if(jack){ scr.big = { text:'JACKPOT', col:'#ff3df2', amt:win, t:scr.time }; C.audio.jackpot(pos); C.hud.big('JACKPOT', '#ff3df2', 3000); C.fx.coins(tray, 160); C.fx.confetti(new THREE.Vector3(mc.a.x, 2.4, mc.a.z), 200); C.bus.emit('cheer', { pos, big:true }); C.disco = true; setTimeout(()=>{ C.disco = false; }, 12000); }
      else if(x >= 50){ scr.big = { text:'FRIDGE WIN', col:'#ffd56a', amt:win, t:scr.time }; C.audio.jackpot(pos); C.hud.big('FRIDGE WIN', '#ffd56a'); C.fx.coins(tray, 100); C.bus.emit('cheer', { pos, big:true }); }
      else if(x >= 25){ scr.big = { text:'MEGA WIN', col:'#ff7ad0', amt:win, t:scr.time }; C.audio.slotWin(pos, 5); C.fx.coins(tray, 60); C.bus.emit('cheer', { pos, big:false }); }
      else if(x >= 10){ scr.big = { text:'BIG WIN', col:'#7ff3ff', amt:win, t:scr.time }; C.audio.slotWin(pos, 4); C.fx.coins(tray, 30); C.bus.emit('cheer', { pos, big:false }); }
      else { C.audio.slotWin(pos, Math.min(3, Math.ceil(x))); if(x >= 3) C.fx.coins(tray, 8); }
      mc.flash = 2 + Math.min(4, x/5);
      const p = C.hud.$('#sl-w'); if(p) p.textContent = C.fmt(win);
      msg(res.wins.map(w=>(w.n + '× ' + (th.names[w.sym] || w.sym)).replace(/ \(.*\)/, '') + ' +' + C.fmt(w.amt*(free ? cur.freeMult : 1))).slice(0, 3).join(' · '));
      if(mc.isVendor && Math.random() < 0.4){ C.audio.whisper('good'); C.hud.say('', pick(['he liked that one.', 'the screen flickers like a smile.', 'somewhere below you, a bulb comes on.'])); }
    } else { msg(free ? 'free spins left: ' + cur.freeLeft : 'no win'); }
    if(res.feature && res.feature.type === 'free'){
      const was = cur.freeLeft; cur.freeLeft += res.feature.count; cur.freeMult = res.feature.mult; scr.free = cur.freeLeft;
      if(!was){ cur.freeWin = 0; }
      C.hud.big(was ? '+' + res.feature.count + ' SPINS' : res.feature.count + ' FREE SPINS', '#7ff3ff'); C.audio.slotWin(mc.screen.getWorldPosition(v3), 6); scr.say(res.feature.count + ' FREE SPINS · ' + res.feature.mult + '×', 2.5);
    }
    if(res.feature && res.feature.type === 'pick'){ await C.tweens.sleep(1); await pickBonus(tb); }
    C.save.write();
    await C.tweens.sleep(win > 0 ? (scr.big ? 2.4 : 0.9) : 0.35);
    if(!cur || cur.scr !== scr) return;
    cur.busy = false;
    if(cur.freeLeft > 0){ setTimeout(()=>spin(), 500); return; }
    if(cur.leaveAfter){ exit(); return; }
    if(free && cur.freeLeft === 0 && cur.freeWin > 0){ C.hud.big('FREE SPINS: ' + C.fmt(cur.freeWin), '#ffd56a'); cur.freeWin = 0; }
    if(cur.auto > 0){
      cur.auto--;
      if(scr.big && scr.big.text !== 'BIG WIN'){ cur.auto = 0; msg('auto stopped on a big win'); }
      else setTimeout(()=>spin(), 350);
    }
  }
  function pickBonus(tb){
    return new Promise(done=>{
      const prizes = pickPrizes(fair); let picks = 0, total = 0, over = false;
      C.audio.whisper('pick one');
      const body = C.hud.modal({ title:'THE BACK ROOM', closeable:false, html:`<p style="text-align:center">six fridges. pick three. one of them is him.</p><div class="fp-pick">${prizes.map((p, i)=>`<button data-i="${i}">▯</button>`).join('')}</div><div class="fp-row fp-big2" id="pk-t">0</div><div class="fp-row"><button data-a="take" class="fp-gold">TAKE IT</button></div>` });
      const end = ()=>{ if(over) return; over = true; if(total > 0){ C.save.pay(total, 'the back room'); C.hud.big('+' + C.fmt(total), '#ff3a2a'); } setTimeout(()=>{ C.hud.modal(null); done(); }, 900); };
      body.querySelectorAll('[data-i]').forEach(b=>b.onclick = ()=>{
        if(over || b.disabled) return; b.disabled = true; picks++;
        const p = prizes[+b.dataset.i];
        if(p === 'him'){ b.textContent = '◉◉'; b.classList.add('fp-red'); C.audio.whisper('found you'); C.engine.finish.uniforms.uFlash.value = 0.6; C.tweens.add({ dur:0.6, update:k=>{ C.engine.finish.uniforms.uFlash.value = 0.6*(1 - k); } }); C.hud.say('', 'he was in that one.'); body.querySelectorAll('[data-i]').forEach((x, i)=>{ if(!x.disabled){ x.textContent = prizes[i] === 'him' ? '◉◉' : prizes[i] + '×'; x.disabled = true; } }); end(); return; }
        total += p*tb; b.textContent = p + '×'; b.classList.add('fp-green'); C.audio.slotWin(null, 2);
        body.querySelector('#pk-t').textContent = C.fmt(total);
        if(picks >= 3) end();
      });
      body.querySelector('[data-a="take"]').onclick = end;
    });
  }
  C.bus.on('key', e=>{ if(cur && e.code === 'Space'){ spin(); } });
  /* clicking the lever in 3D */
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
  C.engine.canvas.addEventListener('pointerdown', e=>{
    if(!cur || !C.seated) return;
    const r = C.engine.canvas.getBoundingClientRect(); ndc.set(((e.clientX - r.left)/r.width)*2 - 1, -((e.clientY - r.top)/r.height)*2 + 1);
    ray.setFromCamera(ndc, C.camera);
    if(ray.intersectObject(cur.mc.lever, true).length || ray.intersectObject(cur.mc.screen, false).length) spin();
  });
  /* NPCs can borrow machines too */
  C.slots = { machines, attract,
    npcSpin(mc){ const pos = mc.screen.getWorldPosition(new THREE.Vector3()); if(C.camera.position.distanceTo(pos) < 14){ if(Math.random() < 0.25) C.audio.slotWin(pos, 1 + Math.floor(Math.random()*2)); else C.audio.reelStop(pos); } mc.flash = Math.random() < 0.2 ? 1.5 : 0; mc.lever.rotation.x = 0.8; setTimeout(()=>{ mc.lever.rotation.x = 0; }, 300); }
  };
  let acc = 0;
  return {
    name:'slots',
    update(dt, t){
      if(cur){ cur.scr.update(dt, r=>cur && cur.onReelStop && cur.onReelStop(r)); cur.scr.credits = C.save.chips; cur.scr.jackpot = C.save.d.jackpot; cur.drawAcc = (cur.drawAcc || 0) + dt; const live = cur.scr.spinning() || cur.scr.big || (cur.scr.wins && cur.scr.wins.length); if(cur.drawAcc > (live ? 1/40 : 1/6)){ cur.drawAcc = 0; cur.scr.draw(false); } }
      /* the jackpot creeps up on its own: other people are losing somewhere */
      C.save.d.jackpot += dt*1.6;
      acc += dt;
      if(acc > 0.2){
        acc = 0;
        Object.values(attract).forEach(s=>{ if(!s.near) return; s.time += 0.2; s.jackpot = C.save.d.jackpot; for(let r=0; r<s.off.length; r++) s.off[r] = (s.off[r] + 0.02*(r + 1)) % s.th.strips[r].length; s.draw(true); });
      }
      /* the floor never goes quiet: a nearby machine chirps now and then */
      C._slotAmb = (C._slotAmb || 3) - dt;
      if(C._slotAmb <= 0 && C.audio.ok()){ C._slotAmb = 2.5 + Math.random()*5; const near = machines.filter(mc=>!mc.broken && C.camera.position.distanceToSquared(mc.grp.position) < 196); if(near.length){ const mc = near[(Math.random()*near.length)|0]; const pos = mc.screen.getWorldPosition(v3); const r = Math.random(); if(r < 0.5){ [1047, 1319, 1568].forEach((f, i)=>C.audio.bell(f*(mc.th.id === 'vendor' ? 0.5 : 1), i*0.09, 0.025, C.audio.out(pos, 0.4), 0.4)); } else if(r < 0.8) C.audio.reelStop(pos); else C.audio.coins(pos, 3); } }
      /* attract screens only animate if one of their machines is close */
      Object.values(attract).forEach(s=>s.near = false);
      for(const mc of machines){ if(C.camera.position.distanceToSquared(mc.grp.position) < 225) attract[mc.th.id].near = true; }
      for(const mc of machines){
        if(mc.flash > 0){ mc.flash -= dt; mc.trim.visible = !!(Math.floor(t*12) % 2) || mc.flash <= 0; }
        else if(!mc.trim.visible) mc.trim.visible = true;
        if(C.disco && !mc.broken){ mc.trim.material.color.setHSL((t*0.4 + mc.idx*0.07) % 1, 1, 0.6); }
      }
    }
  };
}
