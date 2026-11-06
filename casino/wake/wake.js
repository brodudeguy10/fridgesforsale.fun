/* ============================================================
   COLD OPEN
   take too much off three cup nicky in one night and he decides
   you're perfect. a couple of minutes later something hits you
   from behind. you wake up on the floor of a casino that's being
   robbed by people who are killing everyone in it.
   you can't stand. you crawl. a fridge wrapped in packing tape
   tells you where to go. you hide, you lie still among the dead,
   you watch. then the gold fridge on the podium wakes up.

   this file: the body you're stuck in, the guide, clement's
   cameras, being found, dying, checkpoints, the trigger.
   story.js is the night itself, in order.
   save: C.save.d.wake = { runs, done:{escape,stopped}, ending, louDead, dougSaved, lastVisit }
============================================================ */
import * as THREE from '../lib/three.module.min.js';
import { makeFridge, animateFridge } from '../world/fridge.js';
import { canvas, tex } from '../world/textures.js';
import { los } from '../heist/nav.js';
import { WakeFX, Mood, glowTex } from './fx.js';
import { Crew } from './crew.js';
import { People } from './people.js';
import { GoldFridge, Defroster } from './beasts.js';
import { STORY } from './story.js';
import { applyAfter } from './after.js';

const R = (a, b)=>a + Math.random()*(b - a);
const pick = a=>a[(Math.random()*a.length)|0];
const ang = (a, b)=>Math.atan2(Math.sin(a - b), Math.cos(a - b));

/* ---------- the body you're stuck in ---------- */
const BODY = {
  locked:{ eye:0.26, mul:0, run:false, posture:'prone', bob:0, look:[-0.5, 1.2] },
  crawl:{ eye:0.3, mul:0.34, run:false, posture:'prone', bob:0, look:[-0.55, 0.9] },
  limp:{ eye:1.18, mul:0.52, run:false, posture:'crouch', bob:1.6, look:[-1.2, 1.2] },
  walk:{ eye:null, mul:0.82, run:false, posture:'stand', bob:1.2, look:[-1.35, 1.35] },
  run:{ eye:null, mul:1, run:true, posture:'stand', bob:1, look:[-1.35, 1.35] }
};
class Body {
  constructor(C, W){ this.C = C; this.W = W; this.mode = 'walk'; this.posture = 'stand'; this.prone = false; this.still = 0; this.moving = false; this.running = false; this.noise = 0; this.t = 0; this.lookAcc = 0;
    this.hands = this.makeHands(); }
  makeHands(){
    const C = this.C, g = new THREE.Group(); g.visible = false;
    const skin = new THREE.MeshStandardMaterial({ color:0xe8e8ea, roughness:0.35 }), glove = new THREE.MeshStandardMaterial({ color:0xf4f4f4, roughness:0.6 });
    const mk = side=>{ const a = new THREE.Group(); const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.05, 0.5, 10), skin); arm.rotation.x = Math.PI/2; arm.position.z = -0.2; a.add(arm); const hand = new THREE.Mesh(new THREE.SphereGeometry(0.075, 14, 10), glove); hand.position.z = -0.47; hand.scale.set(1.1, 0.8, 1.2); a.add(hand); a.position.set(side*0.22, -0.3, 0.05); g.add(a); return a; };
    this.armL = mk(-1); this.armR = mk(1);
    C.engine.vmScene.add(g); skin.color.setHex(0x8a8a90); glove.color.setHex(0x9a9a9a);
    if(!C.engine.vmScene.children.some(o=>o.isLight)){ C.engine.vmScene.add(new THREE.HemisphereLight(0xffd8c8, 0x2a0a10, 1.2)); }
    return g;
  }
  set(mode){
    const C = this.C, P = C.player, B = BODY[mode]; this.mode = mode;
    P.bodyMul = B.mul; P.bodyNoRun = !B.run; P.bobMul = B.bob; P.pitchMin = B.look[0]; P.pitchMax = B.look[1];
    this.forced = mode === 'locked' || mode === 'crawl' ? 'prone' : null;
    this.prone = this.forced === 'prone';
    if(mode === 'limp') P.crouch = false;
    this.apply();
  }
  toggleProne(){ if(this.forced) return; this.prone = !this.prone; if(this.prone) this.C.player.crouch = false; this.apply(); this.C.audio.burst({ ff:600, q:0.8, d:0.25, g:0.12 }); }
  apply(){
    const P = this.C.player, B = BODY[this.mode];
    if(this.prone){ P.eyeTarget = 0.3; P.eyeRate = this.mode === 'locked' ? 1 : 3; if(!this.forced) P.bodyMul = Math.min(B.mul, 0.34); P.bodyNoRun = true; P.skipCol = o=>o.tag === 'table' || o.tag === 'poker' || o.tag === 'couch'; P.quietSteps = ()=>this.crawlSound(); }
    else { P.eyeTarget = B.eye; P.eyeRate = 2; P.bodyMul = B.mul; P.bodyNoRun = !B.run; P.skipCol = null; P.quietSteps = this.mode === 'limp' ? ()=>this.limpSound() : false; }
    if(this.mode === 'limp' && !this.prone) P.eyeTarget = 1.18;
  }
  crawlSound(){ const A = this.C.audio; A.burst({ ff:R(400, 900), q:0.7, a:0.05, d:0.25, g:0.07 }); if(Math.random() < 0.4) A.burst({ ff:R(1800, 2600), q:1, a:0.02, d:0.12, g:0.03 }); }
  limpSound(){ const A = this.C.audio; A.step(this.C.surfaceAt(this.C.player.pos.x, this.C.player.pos.z), false); A.burst({ ff:300, q:1, a:0.05, d:0.3, g:0.06, t:0.18 }); }
  update(dt, t){
    const C = this.C, P = C.player, I = C.input;
    this.t += dt;
    const moved = P.walkAmt > 0.35;
    const look = Math.abs(I.look.x) + Math.abs(I.look.y);
    this.lookAcc = this.lookAcc*Math.max(0, 1 - dt*6) + look;
    this.moving = moved;
    this.running = !!P.running;
    if(moved || this.lookAcc > 0.06) this.still = 0; else this.still += dt;
    this.posture = this.prone ? 'prone' : (P.crouch || this.mode === 'limp') ? 'crouch' : 'stand';
    this.noise = this.running ? 7 : (moved && this.posture === 'stand' ? 2.2 : 0);
    /* crawling: the arms reach, the camera rolls with each pull */
    const crawling = this.prone && P.mode === 'walk' && this.mode !== 'locked';
    this.hands.visible = crawling && !C.arsenal.drawn;
    if(this.hands.visible){
      C.engine.vmOn = true;
      const ph = P.bob*2.4, k = P.walkAmt;
      this.armL.position.set(-0.22, -0.3 + Math.max(0, Math.sin(ph))*0.06*k, 0.05 - Math.max(0, Math.sin(ph))*0.22*k);
      this.armR.position.set(0.22, -0.3 + Math.max(0, -Math.sin(ph))*0.06*k, 0.05 - Math.max(0, -Math.sin(ph))*0.22*k);
      P.swayRoll = Math.sin(ph)*0.035*k; P.swayY = -Math.abs(Math.sin(ph))*0.025*k;
    } else if(this.mode === 'limp' && P.mode === 'walk'){
      /* a limp: one leg is slower, the camera dips on it */
      const ph = P.bob; P.swayRoll = Math.sin(ph)*0.03*P.walkAmt; P.swayY = -Math.max(0, Math.sin(ph))*0.07*P.walkAmt;
    } else { P.swayRoll *= 0.9; P.swayY *= 0.9; }
  }
  reset(){ const P = this.C.player; P.bodyMul = 1; P.bodyNoRun = false; P.bobMul = 1; P.eyeTarget = null; P.skipCol = null; P.quietSteps = false; P.pitchMin = -1.35; P.pitchMax = 1.35; P.swayRoll = 0; P.swayY = 0; P.swayX = 0; this.hands.visible = false; this.prone = false; this.forced = null; this.mode = 'walk'; }
}

/* ---------- the man in tape ---------- */
const tapeTex = (()=>{ const c = canvas(256, 512), g = c.getContext('2d'); g.fillStyle = '#b89a62'; g.fillRect(0, 0, 256, 512);
  for(let i=0;i<70;i++){ g.save(); g.translate(R(-40, 296), R(-40, 552)); g.rotate(R(-0.6, 0.6)); const w = R(160, 320), h = R(26, 40); g.fillStyle = `rgba(${(190 + Math.random()*40)|0},${(150 + Math.random()*40)|0},${(90 + Math.random()*30)|0},0.78)`; g.fillRect(-w/2, -h/2, w, h); g.strokeStyle = 'rgba(90,60,30,0.35)'; g.lineWidth = 1.5; g.strokeRect(-w/2, -h/2, w, h); g.fillStyle = 'rgba(255,255,255,0.12)'; g.fillRect(-w/2, -h/2, w, 3); g.restore(); }
  for(let i=0;i<10;i++){ g.fillStyle = 'rgba(110,10,6,0.55)'; g.beginPath(); g.ellipse(R(0, 256), R(0, 512), R(4, 14), R(6, 24), 0, 0, 7); g.fill(); }
  return tex(c); })();
const tagTex = (()=>{ const c = canvas(128, 48), g = c.getContext('2d'); g.fillStyle = '#efe4c8'; g.fillRect(0, 0, 128, 48); g.strokeStyle = '#7a6a4a'; g.lineWidth = 3; g.strokeRect(2, 2, 124, 44); g.fillStyle = '#222'; g.font = 'bold 26px Georgia'; g.textAlign = 'center'; g.fillText('HANK', 64, 33); return tex(c, { nomip:true }); })();
class Hank {
  constructor(C, W){
    this.C = C; this.W = W;
    const F = makeFridge({ face:true, arms:true, style:'std', color:'#b89a62', trim:'#8a6a3a', glove:'#c8aa72', eye:'#e8e0c8' });
    this.F = F; F.custom = true; F.group.visible = false; C.scene.add(F.group);
    const wrapM = new THREE.MeshStandardMaterial({ map:tapeTex, roughness:0.45, metalness:0.05 });
    const wrap = new THREE.Mesh(new THREE.BoxGeometry(F.w + 0.02, (F.h || 1.72)*0.86, F.d + 0.02), wrapM); wrap.position.y = 0.04 + (F.h || 1.72)*0.43; F.inner.add(wrap);
    /* tape across the face too; one eye shows */
    if(F.facePlane){ const strip = new THREE.Mesh(new THREE.PlaneGeometry(0.36, 0.11), wrapM); strip.position.copy(F.facePlane.position); strip.position.z += 0.012; strip.position.x += 0.05; strip.position.y -= 0.02; strip.rotation.z = -0.25; F.facePlane.parent.add(strip); const s2 = strip.clone(); s2.position.y += 0.1; s2.position.x += 0.08; s2.rotation.z = 0.15; s2.scale.x = 0.6; F.facePlane.parent.add(s2); }
    [F.armL, F.armR].forEach(a=>a.children.forEach(m=>{ if(m.isMesh) m.material = wrapM; }));
    /* the name tag, mostly under tape */
    const tag = new THREE.Mesh(new THREE.PlaneGeometry(0.12, 0.045), new THREE.MeshStandardMaterial({ map:tagTex, roughness:0.6 })); tag.position.set(-F.w*0.25, (F.h || 1.72)*0.56, F.d/2 + 0.025); F.inner.add(tag); this.tag = tag;
    const tagTape = new THREE.Mesh(new THREE.PlaneGeometry(0.16, 0.03), wrapM); tagTape.position.copy(tag.position); tagTape.position.z += 0.003; tagTape.position.y += 0.004; tagTape.rotation.z = 0.12; F.inner.add(tagTape); this.tagTape = tagTape;
    this.posture = 'prone'; this.path = null; this.pi = 0; this.speed = 0.7; this.t = 0; this.wait = null;
  }
  show(x, z, yaw){ this.F.group.position.set(x, 0, z); this.F.group.rotation.y = yaw || 0; this.F.group.visible = true; }
  hide(){ this.F.group.visible = false; this.path = null; }
  goTo(x, z, posture, speed){
    if(posture) this.posture = posture;
    this.speed = speed || (this.posture === 'prone' ? 0.72 : this.posture === 'crouch' ? 1.15 : 1.6);
    const N = this.C.heist.nav, p = this.F.group.position; const pth = N.path(p.x, p.z, x, z); this.path = pth && pth.length ? pth : [[x, z]]; this.pi = 0;
    return new Promise(res=>{ this.onArrive = res; });
  }
  say(text, dur){ this.F.face.say(Math.min(4, text.length*0.05)); this.C.hud.say('THE MAN IN TAPE', text, dur || Math.max(2.6, text.length*0.06)); }
  update(dt, t){
    const C = this.C, F = this.F, g = F.group, p = g.position;
    if(!g.visible) return;
    this.t += dt;
    F.face.update(dt, true);
    let moving = 0;
    if(this.path && this.pi < this.path.length){
      const wp = this.path[this.pi], dx = wp[0] - p.x, dz = wp[1] - p.z, d = Math.hypot(dx, dz);
      /* he waits for you if you fall behind */
      const lag = Math.hypot(C.player.pos.x - p.x, C.player.pos.z - p.z);
      const sp = lag > 6 && !this.noWait ? 0 : this.speed;
      if(d < 0.15) this.pi++;
      else { const s = Math.min(d, sp*dt); p.x += dx/d*s; p.z += dz/d*s; moving = sp; g.rotation.y += ang(Math.atan2(dx, dz), g.rotation.y)*Math.min(1, dt*5); }
    } else if(this.path && this.onArrive){ const f = this.onArrive; this.onArrive = null; this.path = null; f(); }
    else { let fy = this.faceYaw; const cp = C.player.pos, dd = Math.hypot(cp.x - p.x, cp.z - p.z); if(this.posture === 'prone' && dd < 2.4){ fy = Math.atan2(cp.x - p.x, cp.z - p.z) + Math.PI/2; } if(fy !== undefined) g.rotation.y += ang(fy, g.rotation.y)*Math.min(1, dt*3); }
    /* posture */
    F.armBusy = true;
    if(this.posture === 'prone'){
      const half = F.d/2, hh = (F.h || 1.72); F.inner.rotation.x = -Math.PI/2; F.inner.position.y = half*0.98; F.inner.position.z = half - hh*0.55; F.inner.rotation.z = moving ? Math.sin(this.t*6)*0.06 : 0;
      F.armL.rotation.set(-2.6 - (moving ? Math.max(0, Math.sin(this.t*5))*0.5 : 0), 0, -0.25); F.armR.rotation.set(-2.6 - (moving ? Math.max(0, -Math.sin(this.t*5))*0.5 : 0), 0, 0.25);
    } else if(this.posture === 'crouch'){
      F.inner.rotation.x = 0.35; F.inner.position.y = -0.3 + (moving ? Math.abs(Math.sin(this.t*7))*0.03 : 0); F.inner.position.z = 0; F.inner.rotation.z = moving ? Math.sin(this.t*7)*0.04 : 0;
      F.armL.rotation.set(-0.9 + Math.sin(this.t*7)*0.3*(moving ? 1 : 0), 0, -0.2); F.armR.rotation.set(-0.9 - Math.sin(this.t*7)*0.3*(moving ? 1 : 0), 0, 0.2);
    } else { F.inner.rotation.x = 0; F.inner.position.z = 0; animateFridge(F, t, moving, {}); F.armBusy = false; }
    if(this.point){ F.armR.rotation.set(-1.55, this.point, 0.1); }
  }
}

/* ---------- clement's eyes ---------- */
const CAM_SPOTS = [
  { x:-12, y:4.4, z:7.4, yaw:-2.3, zone:'the slots' }, { x:12, y:4.4, z:7.4, yaw:-0.6, zone:'the tables' },
  { x:-6, y:4.4, z:-11.6, yaw:2.6, zone:'the bar' }, { x:6, y:4.4, z:-11.6, yaw:0.5, zone:'the bar' },
  { x:-6, y:4.4, z:12.6, yaw:-2.9, zone:'the lobby' }, { x:6, y:4.4, z:12.6, yaw:2.9, zone:'the lobby' }
];
class Cams {
  constructor(C, W){
    this.C = C; this.W = W; this.list = []; this.on = false;
    const bodyM = new THREE.MeshStandardMaterial({ color:0x2a2a2e, roughness:0.4, metalness:0.6 }), ledM = new THREE.MeshBasicMaterial({ color:0xff2020, toneMapped:false });
    const coneM = new THREE.MeshBasicMaterial({ color:0xff3020, transparent:true, opacity:0.05, depthWrite:false, blending:THREE.AdditiveBlending, side:THREE.DoubleSide, toneMapped:false });
    CAM_SPOTS.forEach((s, i)=>{
      const g = new THREE.Group(); g.position.set(s.x, s.y, s.z); C.scene.add(g);
      const box = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.14, 0.3), bodyM); box.position.z = 0.12; g.add(box);
      const led = new THREE.Mesh(new THREE.SphereGeometry(0.02, 6, 4), ledM); led.position.set(0.05, 0.05, 0.28); g.add(led);
      const cone = new THREE.Mesh(new THREE.CircleGeometry(1, 20), new THREE.MeshBasicMaterial({ color:0xff2a1a, transparent:true, opacity:0.16, depthWrite:false, blending:THREE.AdditiveBlending, toneMapped:false, polygonOffset:true, polygonOffsetFactor:-2 })); cone.rotation.x = -Math.PI/2; C.scene.add(cone); cone.visible = false;
      const cam = { g, cone, led, s, yaw0:s.yaw, alive:true, seeT:0, ph:i*1.7, called:0 };
      cam.target = { kind:'camera', get alive(){ return cam.alive; }, ray:(o, d, maxT)=>{ if(!cam.alive) return null; const r = new THREE.Ray(o, d); const hit = r.intersectSphere(new THREE.Sphere(g.position.clone().add(new THREE.Vector3(0, 0, 0)), 0.22), new THREE.Vector3()); if(!hit) return null; const t = hit.distanceTo(o); return t < maxT ? { t, n:[0, -1, 0], part:'cam' } : null; },
        hit:info=>{ this.kill(cam); return { hit:true, kill:true }; }, freeze:()=>{}, center:()=>g.position.clone() };
      g.rotation.order = 'YXZ'; g.rotation.y = s.yaw; g.rotation.x = -0.42;
      this.list.push(cam);
    });
  }
  arm(on){ this.on = on; this.list.forEach(c=>{ c.cone.visible = on && c.alive; }); if(on) this.list.forEach(c=>{ if(this.C.combat.targets.indexOf(c.target) < 0) this.C.combat.add(c.target); }); }
  kill(cam){ if(!cam.alive) return; cam.alive = false; cam.cone.visible = false; cam.cone.material = cam.cone.material.clone(); cam.led.visible = false; const C = this.C, p = cam.g.position; C.gore.sparks(p, 30, { speed:5 }); C.gore.glassBurst(p, 6); C.gore.smokePuff(p, 6, 0.3); C.audio.heist && C.audio.heist.hit('glass', p); C.audio.heist && C.audio.heist.explosion(p, 0.1); cam.g.rotation.x = -1.2; C.combat.remove(cam.target); if(this.W.onCamKilled) this.W.onCamKilled(cam); }
  update(dt, t){
    if(!this.on) return;
    const C = this.C, W = this.W, cam = C.camera.position;
    for(const c of this.list){
      if(!c.alive) continue;
      c.led.visible = Math.floor(t*2 + c.ph) % 2 === 0;
      c.g.rotation.y = c.yaw0 + Math.sin(t*0.35 + c.ph)*0.6;
      { const d = c.s.y/Math.tan(0.42); c.cone.position.set(c.g.position.x + Math.sin(c.g.rotation.y)*d, 0.014, c.g.position.z + Math.cos(c.g.position.y*0 + c.g.rotation.y)*d); c.cone.scale.set(1.5, 2.4, 1); c.cone.rotation.z = -c.g.rotation.y; }
      if(W.ghost || W.camsBlind){ c.seeT = 0; continue; }
      const p = c.g.position, dx = cam.x - p.x, dz = cam.z - p.z, dist = Math.hypot(dx, dz);
      let sees = false;
      if(dist < 10){ const a = Math.abs(ang(Math.atan2(dx, dz), c.g.rotation.y)); if(a < 0.34){ const B = W.body; const vis = (B.posture === 'prone' ? 0.3 : B.posture === 'crouch' ? 0.7 : 1)*(B.moving ? 1 : 0.4)*W.hideFactor(null); if(vis > 0.2 && los(C.collide, p.x, p.y - 0.2, p.z, cam.x, cam.y - 0.05, cam.z)) sees = true; } }
      if(sees){ c.seeT += dt; c.cone.material.opacity = 0.16 + Math.min(0.3, c.seeT*0.3); }
      else { c.seeT = Math.max(0, c.seeT - dt*0.5); c.cone.material.opacity = 0.16; }
      c.called -= dt;
      if(c.seeT > 1.1 && c.called <= 0){ c.called = 12; c.seeT = 0; if(W.onCamSpot) W.onCamSpot(c); }
    }
  }
}

/* ---------- the overlay: still meter, prompts, the dive ---------- */
function buildHud(C){
  if(!document.getElementById('wk-css')){ const st = document.createElement('style'); st.id = 'wk-css'; st.textContent = `
    #wk{ position:absolute; inset:0; pointer-events:none; z-index:30; font-family:Oswald, "Cinzel", Georgia, sans-serif; }
    #wk .vig{ position:absolute; inset:0; background:radial-gradient(ellipse at center, rgba(0,0,0,0) 45%, rgba(0,0,0,.75) 100%); opacity:0; transition:opacity .6s; }
    #wk .vig.on{ opacity:1; }
    #wk .seen{ position:absolute; inset:0; box-shadow:inset 0 0 120px rgba(255,255,255,0); transition:box-shadow .25s; }
    #wk .seen.q{ box-shadow:inset 0 0 120px rgba(255,255,255,.18); } #wk .seen.x{ box-shadow:inset 0 0 160px rgba(255,40,30,.5); }
    #wk .still{ position:absolute; left:50%; bottom:calc(19% + env(safe-area-inset-bottom,0px)); transform:translateX(-50%); width:150px; text-align:center; color:#e8e2d0; font-size:11px; letter-spacing:3px; opacity:0; transition:opacity .3s; }
    #wk .still.on{ opacity:.9; } #wk .still i{ display:block; height:3px; margin-top:4px; background:rgba(255,255,255,.15); } #wk .still i b{ display:block; height:100%; width:0; background:#e8e2d0; transition:width .1s; }
    #wk .tip{ position:absolute; left:50%; top:16%; transform:translateX(-50%); width:min(560px,90vw); text-align:center; color:#f2ead8; font-size:15px; letter-spacing:2px; text-shadow:0 2px 6px #000; opacity:0; transition:opacity .4s; }
    #wk .tip.on{ opacity:1; } #wk .tip kbd{ display:inline-block; border:1px solid rgba(255,255,255,.6); border-radius:3px; padding:0 6px; margin:0 3px; font:700 12px monospace; }
    #wk .qte{ position:absolute; left:50%; top:58%; transform:translate(-50%,-50%) scale(.9); padding:14px 26px; border:2px solid #fff; color:#fff; font-size:26px; letter-spacing:6px; background:rgba(160,20,10,.55); opacity:0; transition:opacity .1s, transform .1s; pointer-events:none; cursor:pointer; }
    #wk .qte.on{ opacity:1; transform:translate(-50%,-50%) scale(1); pointer-events:auto; } #wk .qte small{ display:block; font-size:11px; letter-spacing:3px; opacity:.8; }
    #wk .title{ position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; color:#f2ead8; opacity:0; transition:opacity 1.2s; background:rgba(0,0,0,0); }
    #wk .title.on{ opacity:1; } #wk .title h1{ margin:0; font:700 clamp(40px,9vw,96px) Oswald, Georgia, sans-serif; letter-spacing:.3em; } #wk .title p{ margin:8px 0 0; letter-spacing:.5em; font-size:13px; opacity:.75; }
    #wk .blk{ position:absolute; inset:0; background:#000; opacity:0; transition:opacity .8s; }
    #wk .blk.on{ opacity:1; }
    #wk .fire{ position:absolute; inset:0; background:radial-gradient(ellipse at center, rgba(255,120,20,0) 30%, rgba(255,80,10,.45) 100%); opacity:0; transition:opacity .2s; }
  `; document.head.appendChild(st); }
  const el = document.createElement('div'); el.id = 'wk';
  el.innerHTML = '<div class="fire"></div><div class="vig"></div><div class="seen"></div><div class="still">HOLD STILL<i><b></b></i></div><div class="tip"></div><div class="qte">QUICK DIVE<small>SPACE</small></div><div class="title"><h1></h1><p></p></div><div class="blk"></div>';
  C.root.appendChild(el);
  return { el, $:s=>el.querySelector(s) };
}

export class Wake {
  constructor(C){
    this.C = C; this.name = 'wake';
    this.active = false; this.tok = 0; this.waiters = []; this.scoped = []; this.flags = {};
    this.fx = new WakeFX(C); this.mood = new Mood(C);
    this.body = new Body(C, this); this.crew = new Crew(C, this); this.people = new People(C, this);
    this.hank = new Hank(C, this); this.cams = new Cams(C, this);
    this.gold = new GoldFridge(C, this); this.def = new Defroster(C, this);
    this.ui = buildHud(C);
    C.bus.on('crewkill', ()=>{ if(this.stats) this.stats.kills++; });
    this.hp = 100; this.ghost = false; this.t = 0; this.spottedBy = null;
    /* one light for fire, made now so the shaders already know about it */
    this.fireLight = new THREE.PointLight(0xff7a2a, 0, 14, 1.6); C.scene.add(this.fireLight);
    this.S = C.save.d.wake = Object.assign({ runs:0, done:{}, ending:null, louDead:false, dougSaved:false, lastVisit:0, tab:0 }, C.save.d.wake || {});
  }
  /* ---------- small tools the story uses ---------- */
  ok(tok){ return tok === this.tok && this.active && this.C.open; }
  async wait(sec, tok){ await this.C.tweens.sleep(sec); return this.ok(tok); }
  until(fn, tok){ return new Promise(res=>{ this.waiters.push({ fn, res, tok }); }); }
  fire(k){ this.flags[k] = true; }
  flag(k){ return !!this.flags[k]; }
  say(n, t, d){ this.C.hud.say(n, t, d); }
  pa(text, dur){ const A = this.C.audio; A.tone({ f:880, type:'sine', d:0.12, g:0.03 }); A.burst({ ff:2000, q:3, d:0.3, g:0.04 }); const who = this.clementName(); this.C.hud.say(who + ' · PA', text, dur || Math.max(3, text.length*0.065)); this.C.audio.heist && this.C.audio.heist.voice && this.C.audio.heist.voice(text, true); }
  clementName(){ const H = this.C.save.d.heist || {}; return H.vendorKill ? 'SOMETHING IN CLEMENT\'S COAT' : H.clementDead ? 'CLEMENT, PATCHED' : 'CLEMENT'; }
  tip(html, ms){ const t = this.ui.$('.tip'); t.innerHTML = html || ''; t.classList.toggle('on', !!html); clearTimeout(this._tipT); if(html && ms) this._tipT = setTimeout(()=>t.classList.remove('on'), ms); }
  obj(title, list){ this.C.hh.objectives(list, title); }
  shake(a){ this.C.player.addShake(a); }
  black(on, ms){ const b = this.ui.$('.blk'); b.style.transition = `opacity ${ms || 800}ms`; b.classList.toggle('on', !!on); return new Promise(r=>setTimeout(r, ms || 800)); }
  async title(h, p, ms){ const t = this.ui.$('.title'); t.querySelector('h1').textContent = h; t.querySelector('p').textContent = p || ''; t.classList.add('on'); await this.C.tweens.sleep((ms || 3200)/1000); t.classList.remove('on'); }
  scope(x){ this.scoped.push(x); return x; }
  spawnCrew(o){ const e = this.crew.spawn(o); this.scope({ remove:()=>this.crew.remove(e) }); return e; }
  spawnPerson(o, scoped){ const p = this.people.spawn(o); if(scoped) this.scope({ remove:()=>this.people.remove(p) }); return p; }
  clearScope(){ this.scoped.splice(0).forEach(s=>{ try{ s.remove(); }catch(e){} }); }
  /* the defroster gets one of them: they scream, they cook */
  cookCrew(e){
    const C = this.C;
    e.cooking = true; e.state = 'script'; e.path = null; e.aimAt = null; e.deaf = true; e.light = false;
    C.audio.heist && C.audio.heist.scream(e.F.group.position, 2);
    if(Math.random() < 0.7) this.crew.say(e, pick(['IT\'S ON ME', 'GET IT OFF', 'nicky never said', 'no no no no']), 1.6);
    e.F.armBusy = true; e.F.armL.rotation.x = -2.8; e.F.armR.rotation.x = -2.6;
    this.fx.cook(e.F, { dur:3.6, done:()=>{ e.alive = false; e.state = 'dead'; this.C.combat.remove(e.target); } });
    this.fx.after(0.6, ()=>this.fx.fall(e.F, Math.random() < 0.5 ? 1 : -1, 1.4));
  }
  fireOn(obj, k){ this.fireObj = obj; this.fireK = k || 1; if(this.fireLight) this.fireLight.color.setHex(obj && obj.isVector3 ? 0xff3a2a : 0xff7a2a); }
  fireAt(obj, k){ if(this.fireObj === obj) this.fireK = k; }
  /* ---------- how hidden you are, for a given guard (or a camera: e = null) ---------- */
  hideFactor(e){
    const C = this.C, B = this.body, p = C.player.pos;
    if(B.prone){
      /* under a table: only a guard checking that table finds you */
      for(const o of C.collide.near(p.x, p.z)){ if((o.tag === 'table' || o.tag === 'poker') && !o.circle && p.x > o.minX && p.x < o.maxX && p.z > o.minZ && p.z < o.maxZ) return e && e.checking === o ? 1 : 0; }
      /* among the dead and not moving: you're one of them */
      if(B.still > 1 && this.people.nearestBody(p.x, p.z, 1.25)) return e && e.kicking && Math.hypot(e.F.group.position.x - p.x, e.F.group.position.z - p.z) < 1.4 ? 0.6 : 0.05;
    }
    return 1;
  }
  /* ---------- being found ---------- */
  onSpotted(e){
    if(this.spottedBy || this.dead || this.cutscene) return;
    this.spottedBy = e;
    const C = this.C; if(this.stats) this.stats.seen++;
    this.ui.$('.seen').className = 'seen x';
    C.audio.tone({ f:1320, f2:1600, d:0.2, g:0.12, type:'square', filt:'lowpass', ff:3000 }); C.audio.tone({ f:660, d:0.4, g:0.08, type:'sawtooth', t:0.05 });
    /* reflex: the world slows down. get out of the light and he loses you */
    C.engine.timeScale = 0.22;
    const t0 = performance.now();
    this.tip('REFLEX · break his line of sight', 1300);
    const chk = ()=>{
      if(!this.active){ C.engine.timeScale = 1; return; }
      if(performance.now() - t0 < 1250){ requestAnimationFrame(chk); return; }
      C.engine.timeScale = 1; this.ui.$('.seen').className = 'seen';
      const v = this.crew.visibility(e, 0);
      if(e.alive && !e.frozen && v > 0.05){ this.caught(e); }
      else { e.state = 'investigate'; e.sus = 0.7; e.aimAt = null; if(e.lastSeen) this.crew.goTo(e, e.lastSeen[0], e.lastSeen[1]); this.spottedBy = null; this.stats.reflex++; }
    };
    requestAnimationFrame(chk);
  }
  async caught(e){
    const C = this.C;
    this.dead = true; this.tok++;
    const cam = C.camera.position.clone();
    e.aimAt = cam; e.state = 'aim';
    await C.tweens.sleep(0.25);
    for(let i=0;i<3;i++){ this.crew.fireAt(e, cam.clone().add(new THREE.Vector3(R(-0.1, 0.1), -0.2, R(-0.1, 0.1))), { impact:false }); C.player.addShake(0.6); C.audio.heist && C.audio.heist.hurt(); C.engine.finish.uniforms.uChroma.value = 0.01; await C.tweens.sleep(0.13); }
    this.die('found');
  }
  /* the fight at the end: heist bullets land here */
  hurt(dmg, from, kind){
    const C = this.C;
    if(this.dead || this.godT > 0) return;
    this.hp -= dmg; C.hh.damageFrom(from || C.camera.position); C.player.addShake(Math.min(0.9, dmg*0.03)); C.audio.heist && C.audio.heist.hurt();
    C.engine.finish.uniforms.uChroma.value = Math.min(0.008, C.engine.finish.uniforms.uChroma.value + dmg*0.0003);
    if(this.hp <= 0){ this.hp = 0; this.dead = true; this.tok++; this.die(kind === 'fire' ? 'fire' : 'shot'); }
  }
  async die(why){
    const C = this.C;
    this.dead = true; this.tok++;
    C.engine.timeScale = 1;
    C.arsenal.holster(); C.arsenal.stopStream && C.arsenal.stopStream();
    C.input.setWalk(false); C.player.mode = 'seat';
    const P = C.player; P.moveCam(C.camera.position.clone().setY(0.25), C.camera.position.clone().add(new THREE.Vector3(Math.sin(P.yaw)*-1, 1.6, Math.cos(P.yaw)*-1)), 1.0);
    C.audio.heist && C.audio.heist.heartbeat(true, 0.6);
    C.engine.finish.uniforms.uSat.value = 0.08;
    await C.tweens.sleep(1.2);
    C.audio.heist && C.audio.heist.heartbeat(false);
    this.S.deaths = (this.S.deaths || 0) + 1; C.save.write();
    const why2 = { found:['they found you.', 'the light found you first.', 'you moved.'], shot:['you leaked out on the carpet.', 'one more body on the floor.'], fire:['the defroster got you. there isn\'t much left to find.', 'you cooked.'], crushed:['four tons of gold.', 'flattened. the podium fridge doesn\'t stop for anyone.'], boom:['wrong cup.', 'the whole vault went up.'] }[why] || ['it\'s over.'];
    const r = await C.hh.card(`<h1>${why === 'fire' ? 'DEFROSTED' : why === 'crushed' ? 'FLATTENED' : 'FOUND'}</h1><p>${pick(why2)}</p><p style="opacity:.6">checkpoint: ${this.cp ? this.cp.label : 'the start'}</p>`, [{ t:'TRY AGAIN', gold:true }, { t:'GIVE UP' }]);
    if(r === 0) this.restore(); else this.giveUp();
  }
  checkpoint(stage, label, o){ const C = this.C, P = C.player; this.cp = Object.assign({ stage, label:label || stage, pos:[P.pos.x, P.pos.z, P.yaw], body:this.body.mode, hp:Math.max(this.hp, 70) }, o || {}); }
  restore(){
    const C = this.C, cp = this.cp, P = C.player;
    this.tok++; this.waiters.forEach(w=>w.res(false)); this.waiters = [];
    this.clearScope(); this.dead = false; this.spottedBy = null; this.cutscene = false; this.godT = 2;
    C.hh.letterbox(false); this.tip(null); this.ui.$('.qte').classList.remove('on');
    C.engine.finish.uniforms.uSat.value = 0.45;
    this.hp = cp ? cp.hp : 100;
    P.mode = 'walk'; P.tw = null; if(cp) P.spawn(cp.pos[0], cp.pos[1], cp.pos[2]); C.input.setWalk(true); if(!C.input.touch) C.input.lock();
    this.body.set(cp ? cp.body : 'crawl');
    if(cp && cp.restoreFn) cp.restoreFn();
    this.run(cp ? cp.stage : 'wake', 'retry');
  }
  run(stage, why){
    this.tok++; const tok = this.tok; this.flags = {}; this.stage = stage;
    const fn = STORY[stage];
    if(fn) fn(this, tok, why).catch(e=>console.error('cold open', stage, e));
  }
  giveUp(){ const C = this.C; this.finish('gaveup'); }
  /* ---------- the trigger: nicky decides you're perfect ---------- */
  nickyWon(amount, streak){
    const C = this.C, S = this.S;
    if(this.active || this.armed) return;
    if(!this.canStart()) return;
    this.tabTonight = (this.tabTonight || 0) + amount;
    const hit = this.tabTonight >= 5000 || streak >= 5 || (S.tab >= 15000 && !S.runs);
    S.tab = (S.tab || 0) + amount; C.save.write();
    if(hit) this.arm();
  }
  doorTry(){ const C = this.C; C.audio.door(new THREE.Vector3(0, 1.4, 21.8)); C.audio.burst({ ff:900, q:3, d:0.3, g:0.4 }); C.hud.say('', 'the doors don\'t open. there\'s a chain on the outside handles. somebody put it there in the last minute.', 4); this.armT = Math.min(this.armT, 4); }
  canStart(force){ const C = this.C, H = C.heist; if(C.heistLock || !H || H.state !== 'idle') return false; if(C.heistAftermath && C.heistAftermath.n === 1) return false; if(!force && this.S.lastVisit === C.save.d.visits) return false; if(!force && this.after && this.after.since !== undefined && (this.S.ending === 'stopped' ? this.after.since < 3 : this.after.since < 1)) return false; return true; }
  async arm(){
    const C = this.C, nicky = C.games.cups && C.games.cups.nicky;
    this.armed = true; this.armT = 80;
    C.audio.heist && C.audio.heist.renderScore && C.audio.heist.renderScore('tense');
    if(nicky){ nicky.face.set('smug', 4); C.hud.say('THREE CUP NICKY', pick(['...yeah. okay. you\'re perfect.', 'you know what? you\'re perfect. you\'re PERFECT.', 'that\'s enough. that\'s exactly enough.']), 3.5); }
    C.events && C.events.stopAll && C.events.stopAll(); C.noEvents = true;
    await C.tweens.sleep(2.4);
    if(C.games.cups && C.games.cups.packUp) C.games.cups.packUp();
    /* the doors get chained from outside. you can try them. */
    this.doorsLocked = true;
  }
  /* ---------- the hit ---------- */
  async start(){
    const C = this.C;
    if(this.active) return;
    this.active = true; this.armed = false; this.dead = false;
    this.S.runs++; this.S.lastVisit = C.save.d.visits; C.save.write();
    this.stats = { reflex:0, seen:0, start:performance.now(), kills:0, frozen:0, shattered:0 };
    C.heistLock = true; C.noSpawn = true; C.noChatter = true; C.noEvents = true; C.wakeOn = true;
    if(C.seated && C.seatExit){ try{ C.seatExit(); }catch(e){} }
    C.hud.modal(null);
    C.hh.show(true); C.hh.$('#hh-fear').style.display = 'none'; C.hh.$('#hh-bag').style.display = 'none'; C.hh.$('#hh-hp').style.display = 'none'; C.hh.$('#hh-ammo').style.display = 'none';
    /* heist bullets hit the wake while it runs */
    const H = C.heist; if(!this._hurtWrapped){ this._hurtWrapped = true; const orig = H.hurt.bind(H); H.hurt = (d, f, k)=>this.active ? this.hurt(d, f, k) : orig(d, f, k); }
    H.navBuild && H.navBuild();
    if(C.arsenal && C.arsenal.vmLights){ C.arsenal.vmLights.forEach(l=>{ l.userData.i0 = l.intensity; l.intensity *= 0.35; }); }
    this.run('hit', 'fresh');
  }
  finish(how){
    const C = this.C;
    this.active = false; this.tok++;
    C.engine.timeScale = 1;
    this.mood.stopAll(); C.audio.heist && C.audio.heist.stopAll && C.audio.heist.stopAll();
    C.save.write();
    C.leave();
  }
  key(e){
    const C = this.C;
    if(!this.active || this.dead || C.hud.paused || C.hud.modalOpen) return;
    if(e.code === 'KeyZ' || (e.code === 'KeyC' && !C.arsenal.order.length)){
      if(e.code === 'KeyC'){ if(this.body.forced) return; if(this.body.prone){ this.body.toggleProne(); } C.player.crouch = !C.player.crouch; this.body.apply(); return; }
      this.body.toggleProne();
    }
    if(e.code === 'Space' && this.qte){ this.qte(); }
  }
  update(dt, t){
    const C = this.C;
    this.t += dt;
    /* the wallet doesn't matter tonight */
    if(this._topHid !== this.active){ this._topHid = this.active; const top = C.hud.$('#fp-top'); if(top) top.style.visibility = this.active ? 'hidden' : ''; if(this.ui && this.ui.el) this.ui.el.style.display = this.active ? '' : 'none'; }
    /* typed anywhere: coldopen. for whoever is testing this */
    if(!this.active && !this.armed && C.input.typed && C.input.typed.endsWith('coldopen') && this.canStart(true)){ C.input.typed = ''; C.hud.toast('you hear a payphone somewhere start to ring', 'gold'); this.arm(); }
    /* the countdown after nicky packs up */
    if(this.armed && !this.active){
      this.armT -= dt;
      if(this.armT <= 0) this.start();
    }
    this.fx.update(dt);
    if(this.after) this.after.update(dt, t);
    if(!this.active) return;
    if(this.godT > 0) this.godT -= dt;
    for(let i=this.waiters.length - 1; i>=0; i--){ const w = this.waiters[i]; if(w.tok !== this.tok){ this.waiters.splice(i, 1); w.res(false); continue; } let r = false; try{ r = w.fn(); }catch(e){ console.error(e); } if(r){ this.waiters.splice(i, 1); w.res(true); } }
    this.body.update(dt, t);
    this.crew.update(dt, t);
    this.people.update(dt, t);
    this.hank.update(dt, t);
    this.cams.update(dt, t);
    this.gold.update(dt, t);
    this.def.update(dt, t);
    for(const p of this.people.list) if(p.dragBy) this.people.dragTick(p, dt, t);
    if(this.tick) this.tick(dt, t);
    /* the still meter */
    const st = this.ui.$('.still'), showStill = this.body.prone && !this.dead && (this.crew.worst > 0.05 || this.showStill);
    st.classList.toggle('on', !!showStill); if(showStill) st.querySelector('b').style.width = Math.min(100, this.body.still/1.2*100) + '%';
    if(!this.spottedBy) this.ui.$('.seen').className = 'seen' + (this.crew.worst > 0.3 ? ' q' : '');
    /* fire light rides with whatever's burning */
    if(this.fireLight){ if(this.fireObj && this.fireObj.isVector3){ this.fireLight.position.copy(this.fireObj); this.fireLight.intensity = 10*this.fireK; } else if(this.fireObj && this.fireObj.visible){ const p = this.fireObj.getWorldPosition(new THREE.Vector3()); this.fireLight.position.set(p.x, 1.8, p.z); this.fireLight.intensity = (18 + Math.sin(t*17)*4 + Math.sin(t*7)*3)*this.fireK; } else this.fireLight.intensity *= 0.9; }
    /* fire close to you: the screen gets hot */
    const fz = this.ui.$('.fire'); let heat = 0; if(this.def.F.group.visible){ const d = this.def.F.group.position.distanceTo(C.camera.position); heat = Math.max(0, 1 - d/5); } fz.style.opacity = heat.toFixed(2);
    const crk = this.mood.loops.fire; if(crk){ let v = 0; if(this.def.F.group.visible) v = Math.max(v, 1 - this.def.F.group.position.distanceTo(C.camera.position)/14); if(this.gold.fire){ v = Math.max(v, 1 - this.gold.F.group.position.distanceTo(C.camera.position)/16); } crk.set(Math.max(0, v)); }
    /* hud bits the heist would normally drive */
    if(this.fightOn){ const H = C.hh, A = C.arsenal; H.hp(this.hp, 100, 0); H.ammo(A); H.cross(A.spread(), A.drawn && !C.seated && C.player.mode === 'walk', A.adsK > 0.6, A.cur === 'freon'); }
    const U = C.engine.finish.uniforms; if(U.uChroma.value > 0) U.uChroma.value = Math.max(0, U.uChroma.value - dt*0.01);
  }
}

export async function init(C){
  const W = new Wake(C);
  C.wake = W;
  C.bus.on('key', e=>W.key(e));
  /* the night after: what's left */
  try{ W.after = applyAfter(C, W); }catch(e){ console.warn('cold open aftermath', e); }
  /* warm the shaders for everything that shows up later */
  try{
    const e = W.crew.spawn({ x:0, z:-40 }); W.gold.F.group.visible = true; W.gold.F.group.position.set(3, -40, -40); W.gold.cav.visible = true; W.gold.doorL.visible = true; W.gold.doorR.visible = true;
    W.def.F.group.visible = true; W.def.F.group.position.set(-3, -40, -40); W.hank.F.group.visible = true; W.hank.F.group.position.set(6, -40, -40);
    W.fx.fire(new THREE.Vector3(0, -40, -40), 1); W.fx.flash(new THREE.Vector3(0, -40, -40), 0xffffff, 1, 0.1); W.fx.smear('warm', 0, -40, '#800', 0.5); W.fx.smear('warm', 1, -40, '#800', 0.5);
    W.cams.list.forEach(c=>c.cone.visible = true);
    W.body.hands.visible = true;
    W._warm = ()=>{ W.crew.remove(e); W.gold.F.group.visible = false; W.gold.F.group.position.set(0, 0, 0); W.gold.cav.visible = false; W.gold.doorL.visible = false; W.gold.doorR.visible = false; W.def.F.group.visible = false; W.hank.F.group.visible = false; W.cams.list.forEach(c=>c.cone.visible = false); W.body.hands.visible = false; W.fx.clear(); };
  }catch(err){ console.warn('cold open warm-up', err); }
  return { name:'wake', update(dt, t){ if(W._warm){ const f = W._warm; W._warm = null; f(); } W.update(dt, t); }, dispose(){ W.mood.stopAll(); } };
}
