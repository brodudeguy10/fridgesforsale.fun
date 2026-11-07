/* ============================================================
   COLD OPEN: nicky's crew
   charcoal fridges in knit masks with flashlights taped to their
   guns. they walk routes, sweep their lights, hear you, see you.
   suspicion fills a meter: a "?" and they come look, a "!" and
   you're done. lying still in the dark, under a table, or among
   the bodies keeps you alive. in the fight at the end they shoot
   back, freeze solid under freon and shatter.
============================================================ */
import * as THREE from '../lib/three.module.min.js';
import { makeFridge, animateFridge } from '../world/fridge.js';
import { canvas, tex } from '../world/textures.js';
import { rayOBB } from '../heist/combat.js';
import { los } from '../heist/nav.js';

const R = (a, b)=>a + Math.random()*(b - a);
const pick = a=>a[(Math.random()*a.length)|0];
const ang = (a, b)=>Math.atan2(Math.sin(a - b), Math.cos(a - b));

export const CREW_LINES = {
  idle:['clear.', 'nothing here.', 'this place smells like money and ketchup.', 'quiet down there.', 'keep your faces on the carpet.', 'nicky says ten more minutes.', 'who keeps crying. find who keeps crying.'],
  huh:['...hm?', 'what was that.', 'somebody moved.', 'hold on.', 'you hear that?'],
  lost:['nothing. nerves.', 'must be a rat. a fridge rat.', 'forget it.', 'it\'s the fish. the fish keep flopping.'],
  spot:['HEY.', 'FOUND ONE.', 'ONE\'S MOVING.', 'there you are.'],
  fight:['he\'s armed!', 'where\'d he get that?', 'flank him!', 'it\'s the one from the box!', 'shoot him, SHOOT HIM'],
  frozen:['i can\'t feel my coils', 'cold cold cold cold'],
  scared:['what IS that', 'shoot it. SHOOT IT.', 'it\'s not stopping', 'nicky never said anything about THIS']
};

/* a knit ski mask with eye and mouth holes, drawn once */
const maskTex = (()=>{ const c = canvas(128, 96), g = c.getContext('2d');
  g.fillStyle = '#121214'; g.fillRect(0, 0, 128, 96);
  g.strokeStyle = 'rgba(60,60,66,0.6)'; g.lineWidth = 1; for(let y=2; y<96; y+=4){ g.beginPath(); for(let x=0; x<128; x+=4) g.lineTo(x, y + (x % 8 ? 1.5 : -1.5)); g.stroke(); }
  g.globalCompositeOperation = 'destination-out';
  g.beginPath(); g.ellipse(40, 38, 15, 9, 0, 0, 7); g.fill(); g.beginPath(); g.ellipse(88, 38, 15, 9, 0, 0, 7); g.fill();
  g.beginPath(); g.ellipse(64, 72, 12, 6, 0, 0, 7); g.fill();
  g.globalCompositeOperation = 'source-over';
  g.strokeStyle = '#2a2a30'; g.lineWidth = 3; [[40, 38, 15, 9], [88, 38, 15, 9], [64, 72, 12, 6]].forEach(([x, y, a, b])=>{ g.beginPath(); g.ellipse(x, y, a, b, 0, 0, 7); g.stroke(); });
  return tex(c, { nomip:true }); })();
const markTex = ch=>{ const c = canvas(64, 64), g = c.getContext('2d'); g.font = 'bold 54px Georgia'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.lineWidth = 6; g.strokeStyle = '#000'; g.strokeText(ch, 32, 34); g.fillStyle = ch === '!' ? '#ff3a2a' : '#ffffff'; g.fillText(ch, 32, 34); return tex(c, { nomip:true }); };
const QM = new THREE.SpriteMaterial({ map:markTex('?'), depthTest:false, transparent:true });
const XM = new THREE.SpriteMaterial({ map:markTex('!'), depthTest:false, transparent:true });
const coneM = new THREE.MeshBasicMaterial({ color:0xfff0c8, transparent:true, opacity:0.07, depthWrite:false, blending:THREE.AdditiveBlending, side:THREE.DoubleSide, toneMapped:false });
const poolTex = (()=>{ const c = canvas(64, 64), g = c.getContext('2d'); const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, 'rgba(255,245,215,0.9)'); gr.addColorStop(0.6, 'rgba(255,240,200,0.35)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(0, 0, 64, 64); return tex(c, { nomip:true }); })();
const poolM = new THREE.MeshBasicMaterial({ map:poolTex, transparent:true, opacity:0.5, depthWrite:false, blending:THREE.AdditiveBlending, toneMapped:false, polygonOffset:true, polygonOffsetFactor:-2 });
const gunM = new THREE.MeshStandardMaterial({ color:0x18181b, roughness:0.4, metalness:0.7 });
const lensM = new THREE.MeshBasicMaterial({ color:0xfff4d0, toneMapped:false });
const flashM = new THREE.MeshBasicMaterial({ color:0xffd080, transparent:true, opacity:0.95, blending:THREE.AdditiveBlending, depthWrite:false, toneMapped:false });

function makeGun(kind){
  const g = new THREE.Group();
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.08, kind === 'pistol' ? 0.18 : 0.34), gunM); body.position.z = kind === 'pistol' ? 0.08 : 0.15; g.add(body);
  const grip = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.09, 0.04), gunM); grip.position.set(0, -0.07, 0.02); grip.rotation.x = 0.3; g.add(grip);
  if(kind !== 'pistol'){ const mag = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.1, 0.04), gunM); mag.position.set(0, -0.08, 0.17); g.add(mag); }
  /* a flashlight taped under the barrel */
  const fl = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.026, 0.1, 10), gunM); fl.rotation.x = Math.PI/2; fl.position.set(0, -0.045, kind === 'pistol' ? 0.12 : 0.24); g.add(fl);
  const lens = new THREE.Mesh(new THREE.CircleGeometry(0.02, 10), lensM); lens.position.set(0, -0.045, (kind === 'pistol' ? 0.12 : 0.24) + 0.051); g.add(lens);
  const muzzle = new THREE.Object3D(); muzzle.position.set(0, 0.01, kind === 'pistol' ? 0.18 : 0.33); g.add(muzzle);
  const flash = new THREE.Mesh(new THREE.SphereGeometry(0.05, 6, 4), flashM); flash.scale.set(1, 1, 2.2); flash.visible = false; muzzle.add(flash);
  g.userData = { muzzle, flash, lensPos:lens };
  return g;
}

export class Crew {
  constructor(C, W){
    this.C = C; this.W = W; this.list = [];
    this._v = new THREE.Vector3(); this._f = new THREE.Vector3();
  }
  spawn(o){
    const C = this.C;
    const F = makeFridge({ face:true, arms:true, style:o.style || pick(['std', 'tall', 'smart']), color:o.color || pick(['#26262b', '#1d1d21', '#2e2c2a', '#22252b']), trim:'#111', glove:'#0c0c0c', eye:o.eye || '#ff3a2a', acc:o.acc || [] });
    F.seed = Math.random()*10; F.custom = true;
    F.group.position.set(o.x, 0, o.z); F.group.rotation.y = o.yaw || 0;
    if(F.facePlane){ const m = new THREE.Mesh(F.facePlane.geometry, new THREE.MeshBasicMaterial({ map:maskTex, transparent:true, toneMapped:false, color:0x9a9a9a })); m.position.copy(F.facePlane.position); m.position.z += 0.004; F.facePlane.parent.add(m); F.mask = m; }
    C.scene.add(F.group);
    const gun = makeGun(o.weapon || 'smg'); F.armR.add(gun); gun.position.set(0, -0.36, 0.02);
    /* the flashlight beam: a faint cone and a pool on the floor where it lands */
    const len = o.lightLen || 9;
    const cone = new THREE.Mesh(new THREE.ConeGeometry(len*0.34, len, 18, 1, true), coneM); cone.geometry.translate(0, -len/2, 0); cone.geometry.rotateX(-Math.PI/2); cone.renderOrder = 7; C.scene.add(cone);
    const pool = new THREE.Mesh(new THREE.CircleGeometry(1, 24), poolM); pool.rotation.x = -Math.PI/2; pool.renderOrder = 3; C.scene.add(pool);
    const mark = new THREE.Sprite(QM); mark.scale.setScalar(0.42); mark.visible = false; mark.renderOrder = 20; C.scene.add(mark);
    const e = Object.assign({
      F, gun, cone, pool, mark, name:o.name || 'CREW', weapon:o.weapon || 'smg',
      state:o.state || 'route', route:o.route || null, ri:0, waitT:0, path:null, pi:0, speed:o.speed || 1.05,
      look:0, lookPh:Math.random()*6, sweep:o.sweep === undefined ? 0.45 : o.sweep, sus:0, seen:false, lastSeen:null, heard:0,
      alive:true, hp:o.hp || 110, freeze:0, frozen:false, frozenT:0, light:o.light !== false, lightLen:len,
      spotT:0, fireCD:0.6 + (this.list.length % 3)*0.25, burst:0, chatter:8 + (this.list.length % 4)*2.5, yawWant:o.yaw || 0, deaf:false, blind:false, tag:o.tag || '', aimAt:null, stopFor:0, combat:!!o.combat, gone:false,
      v:0, hold:false, holdT:0, lookAt:null, noticeT:0, stuckT:0, idx:this.list.length, scripted:o.scripted !== undefined ? o.scripted : !((o.state || 'route') === 'route' || o.state === 'hold' || o.state === 'combat')
    }, o.extra || {});
    e.target = { kind:'crew', e, get alive(){ return e.alive; }, shootableDead:true,
      ray:(oo, d, maxT)=>this.ray(e, oo, d, maxT), hit:info=>this.hit(e, info),
      center:()=>new THREE.Vector3(e.F.group.position.x, e.alive ? 1.0 : 0.35, e.F.group.position.z), freeze:(v, dir)=>this.freezeHit(e, v, dir) };
    C.combat.add(e.target);
    this.list.push(e);
    return e;
  }
  remove(e){ const C = this.C; C.scene.remove(e.F.group); C.scene.remove(e.cone); C.scene.remove(e.pool); C.scene.remove(e.mark); if(e.ice) C.scene.remove(e.ice); C.combat.remove(e.target); const i = this.list.indexOf(e); if(i >= 0) this.list.splice(i, 1); e.gone = true; }
  clear(){ this.list.slice().forEach(e=>this.remove(e)); }
  eye(e){ const p = e.F.group.position; return this._v.set(p.x, (e.F.top || 1.7)*0.82, p.z); }
  say(e, line, dur){ if(!line) return; e.F.face.say(Math.min(3, line.length*0.05)); const d = e.F.group.position.distanceTo(this.C.camera.position); if(d < 14) this.C.hud.say(e.name, line, dur || 2.4); }
  /* ---------- moving ----------
     a path is the nav grid's waypoints. no path means no walking: they
     hold where they are and the script carries on, instead of sliding
     through a wall to get there. */
  goTo(e, x, z){
    const N = this.C.heist.nav, p = e.F.group.position;
    let pth = N.path(p.x, p.z, x, z, 14000);
    if(!pth || !pth.length){ if(N.walk && N.clearLine(p.x, p.z, x, z)) pth = [[p.x, p.z], [x, z]]; }
    e.dest = [x, z]; e.stuckT = 0;
    if(!pth || !pth.length){
      e.path = null; e.pi = 0; e.blocked = (e.blocked || 0) + 1;
      if(this.W.debugOn) console.warn('[wake] no path for', e.name, e.idx, 'to', x.toFixed(1), z.toFixed(1));
      if(e.onArrive){ const f = e.onArrive; e.onArrive = null; setTimeout(f, 60); }
      return false;
    }
    /* the end of the path is the cell nearest the goal: finish on the goal itself if it's open */
    const endC = pth[pth.length - 1]; if(Math.hypot(endC[0] - x, endC[1] - z) < 0.6 && N.clearLine(endC[0], endC[1], x, z)) pth = pth.slice(0, -1).concat([[x, z]]);
    e.path = pth; e.pi = pth.length > 1 && Math.hypot(pth[0][0] - p.x, pth[0][1] - p.z) < 0.5 ? 1 : 0;
    return true;
  }
  walkTo(e, x, z, speed){ if(speed) e.speed = speed; return new Promise(res=>{ e.onArrive = res; this.goTo(e, x, z); }); }
  arrived(e){ return !e.path || e.pi >= e.path.length; }
  stop(e){ e.path = null; e.pi = 0; }
  /* turn the body at a fixed rate, not a snap */
  turn(e, want, rate, dt){ const g = e.F.group, d = ang(want, g.rotation.y), m = rate*dt; g.rotation.y += Math.abs(d) < m ? d : Math.sign(d)*m; return Math.abs(d); }
  /* one step along the path: stop and turn first if the next leg bends hard,
     ease up to speed, ease down into the last mark */
  step(e, dt, slow){
    const C = this.C, g = e.F.group, p = g.position;
    const wp = e.path[e.pi], dx = wp[0] - p.x, dz = wp[1] - p.z, dd = Math.hypot(dx, dz);
    const last = e.pi === e.path.length - 1;
    if(dd < (last ? 0.12 : 0.28)){ e.pi++; if(e.pi >= e.path.length){ e.path = null; this.arrive(e); } return e.v; }
    const want = Math.atan2(dx, dz), diff = Math.abs(ang(want, g.rotation.y));
    const top = e.speed*slow;
    /* aiming at something while walking (a gun on a hostage, a light on a body): he sidesteps, the gun stays put */
    const strafe = !!e.aimAt;
    let tv = strafe ? top*0.8 : diff > 0.9 && e.v < 0.35 ? 0 : top*Math.max(0.3, Math.cos(Math.min(1.35, diff)));
    if(last) tv = Math.min(tv, Math.sqrt(2*2.4*dd) + 0.06);
    e.v += Math.max(-4.5*dt, Math.min(2.6*dt, tv - e.v));
    if(!strafe){ this.turn(e, want, e.v < 0.35 ? 3.4 : 4.8, dt); e.yawWant = want; }
    if(e.v <= 0.01) return 0;
    const s = Math.min(dd, e.v*dt); let sx = dx/dd*s, sz = dz/dd*s;
    for(const o of this.list){ if(o === e || !o.alive) continue; const ox = p.x - o.F.group.position.x, oz = p.z - o.F.group.position.z, od = Math.hypot(ox, oz); if(od < 0.8 && od > 0.01){ sx += ox/od*(0.8 - od)*dt*1.5; sz += oz/od*(0.8 - od)*dt*1.5; } }
    const bx = p.x, bz = p.z;
    p.x += sx; p.z += sz;
    if(!e.ghostWalk) C.collide.resolve(p, 0.3);
    /* stuck on something: skip ahead rather than grind into it */
    const moved = Math.hypot(p.x - bx, p.z - bz);
    if(tv > 0.2 && moved < e.v*dt*0.25){ e.stuckT += dt; if(e.stuckT > 1.4){ e.stuckT = 0; e.pi++; if(e.pi >= e.path.length){ e.path = null; this.arrive(e); } } } else e.stuckT = Math.max(0, e.stuckT - dt);
    return e.v;
  }
  arrive(e){ e.v = Math.min(e.v, 0.2); if(e.onArrive){ const f = e.onArrive; e.onArrive = null; f(); } }
  /* ---------- seeing you ---------- */
  visibility(e, dt){
    const C = this.C, W = this.W, cam = C.camera.position;
    if(!e.alive || e.frozen || e.blind || W.ghost) return 0;
    const ey = this.eye(e), dx = cam.x - ey.x, dz = cam.z - ey.z, dist = Math.hypot(dx, dz);
    if(dist > 13) return 0;
    const face = e.F.group.rotation.y + e.look, a = Math.abs(ang(Math.atan2(dx, dz), face));
    const inBeam = e.light && a < 0.5 && dist < e.lightLen*1.15;
    const near = dist < 3.6 && a < 1.25;
    const touching = dist < 1.1;
    if(!inBeam && !near && !touching) return 0;
    if(!los(C.collide, ey.x, ey.y, ey.z, cam.x, cam.y - 0.05, cam.z)) return 0;
    const B = W.body;
    let v = inBeam ? 1 : touching ? 0.9 : 0.4;
    v *= B.posture === 'prone' ? 0.38 : B.posture === 'crouch' ? 0.68 : 1;
    v *= B.moving ? (B.running ? 1.7 : 1) : (B.still > 1.2 ? 0.16 : 0.5);
    const hide = W.hideFactor(e); v *= hide;
    v *= 1 - Math.min(0.65, dist/13*0.65);
    if(W.flashlitPlayer) v *= 1.4;
    return v;
  }
  /* can this one leave what it's doing to go look? only patrols and posts.
     a guard in the middle of a scripted beat stops and stares instead, then
     carries on with the beat, so the scene stays the scene. */
  canInvestigate(e){ return e.investigate !== false && !e.scripted && ((e.state === 'route' && e.route) || (e.state === 'hold' && e.holdAt) || e.state === 'search' || e.state === 'investigate'); }
  /* "?" → stop, turn to the spot, a beat to decide, then walk over. never a straight sprint */
  notice(e, quick){
    if(e.noticeT > 0 || e.state === 'investigate') return;
    e.hold = true; e.lookAt = e.lastSeen ? e.lastSeen.slice() : null; e.noticeT = quick ? 0.6 : 1.1; e.v = 0;
    this.say(e, CREW_LINES.huh[e.idx % CREW_LINES.huh.length]);
  }
  beginInvestigate(e){
    const p = e.F.group.position, ls = e.lastSeen; if(!ls){ e.hold = false; return; }
    if(e.state !== 'search' && e.state !== 'investigate'){ e.home = e.state; e.homeRi = e.route ? Math.max(0, e.ri - 1) : 0; e.baseSpeed = e.speed; }
    e.state = 'investigate'; e.hold = false; e.lookAt = null;
    /* stop a little short of the spot and shine the light on it */
    const dx = ls[0] - p.x, dz = ls[1] - p.z, d = Math.hypot(dx, dz) || 1, k = Math.max(0, d - 1.1)/d;
    e.speed = 0.95; this.goTo(e, p.x + dx*k, p.z + dz*k); e.lookAt = ls.slice();
  }
  /* after a reflex escape: scripted ones stare a while, patrols come look */
  afterReflex(e){
    e.sus = 0.6; e.aimAt = null;
    if(e.state === 'aim' && !e.scripted && (e.route || e.holdAt || e.preAim === 'investigate' || e.preAim === 'search')){ e.state = e.preAim && e.preAim !== 'aim' ? e.preAim : (e.route ? 'route' : 'hold'); if(e.state === 'investigate' || e.state === 'search'){ e.state = 'search'; e.searchT = 0.01; } this.notice(e, true); }
    else { if(e.state === 'aim') e.state = e.preAim || 'walk'; e.hold = true; e.holdT = 2.4; e.lookAt = e.lastSeen ? e.lastSeen.slice() : null; this.say(e, CREW_LINES.lost[e.idx % CREW_LINES.lost.length]); }
  }
  /* ---------- per frame ---------- */
  update(dt, t){
    const C = this.C, W = this.W, cam = C.camera.position;
    let anyAlert = 0, worst = 0;
    for(const e of this.list){
      const F = e.F, g = F.group, p = g.position;
      const d2 = p.distanceToSquared(cam);
      F.face.update(dt, d2 < 300);
      if(e.gun.userData.flashT > 0){ e.gun.userData.flashT -= dt; if(e.gun.userData.flashT <= 0) e.gun.userData.flash.visible = false; }
      if(!e.alive){ e.cone.visible = false; e.pool.visible = false; e.mark.visible = false; continue; }
      if(e.frozen){ e.frozenT += dt; if(!e.freezeLock) e.freeze -= dt*6; e.cone.visible = false; e.pool.visible = false; e.mark.visible = false; if(e.freeze < 30){ e.frozen = false; if(e.ice){ C.scene.remove(e.ice); e.ice = null; } F.face.set('angry', 2); C.gore.mistPuff(new THREE.Vector3(p.x, 1, p.z), '#d8f6ff', 6, { size:0.3 }); } continue; }
      if(e.freeze > 0) e.freeze = Math.max(0, e.freeze - dt*18);
      const slow = 1 - Math.min(0.75, e.freeze/120);
      /* timers */
      if(e.holdT > 0){ e.holdT -= dt; if(e.holdT <= 0){ e.hold = false; e.lookAt = null; } }
      if(e.noticeT > 0){ e.noticeT -= dt; if(e.noticeT <= 0) this.beginInvestigate(e); }
      /* the brain */
      if(e.state === 'route' && e.route && this.arrived(e) && !e.hold){
        if(e.waitT > 0){ e.waitT -= dt; }
        else { const wp = e.route[e.ri % e.route.length]; e.ri++; if(wp.wait){ e.waitT = wp.wait; e.wpYaw = wp.yaw; } else e.wpYaw = undefined; this.goTo(e, wp[0], wp[1]); }
      }
      if(e.state === 'route' && this.arrived(e) && e.wpYaw !== undefined) e.yawWant = e.wpYaw;
      if(e.state === 'hold' && this.arrived(e) && e.holdYaw !== undefined) e.yawWant = e.holdYaw;
      if(e.state === 'investigate' && this.arrived(e)){ e.state = 'search'; e.searchT = 3.6; e.searchYaw = g.rotation.y; e.yawWant = g.rotation.y; e.lookAt = null; }
      if(e.state === 'search'){
        e.searchT -= dt;
        /* a fixed sweep: left, right, left. you can count it */
        const k = 1 - Math.max(0, e.searchT)/3.6; e.look = Math.sin(k*Math.PI*3)*0.95;
        if(e.searchT <= 0){ e.state = e.home || 'route'; e.home = null; this.say(e, CREW_LINES.lost[e.idx % CREW_LINES.lost.length]); e.path = null; e.look = 0; e.speed = e.baseSpeed || 1.05;
          if(e.route){ e.ri = e.homeRi || this.nearestWp(e); e.waitT = 0; }
          if(e.state === 'hold' && e.holdAt) this.goTo(e, e.holdAt[0], e.holdAt[1]); }
      }
      let moving = 0;
      if(e.state === 'combat') this.brainCombat(e, dt, slow);
      const canStep = e.path && e.pi < e.path.length && e.stopFor <= 0 && e.state !== 'aim' && !e.hold;
      if(canStep) moving = this.step(e, dt, slow);
      else { e.v = Math.max(0, e.v - 5*dt); if(e.path && e.pi >= e.path.length){ e.path = null; this.arrive(e); } }
      if(e.stopFor > 0) e.stopFor -= dt;
      /* facing: a gun aimed at something turns fast, a body at rest turns slow */
      if(!canStep || e.aimAt){
        let want = e.yawWant;
        if(e.aimAt) want = Math.atan2(e.aimAt.x - p.x, e.aimAt.z - p.z);
        else if(e.lookAt && e.hold) want = Math.atan2(e.lookAt[0] - p.x, e.lookAt[1] - p.z);
        this.turn(e, want, e.state === 'aim' || e.state === 'combat' || e.aimAt ? 7 : e.hold ? 3.2 : 2.4, dt);
      }
      /* the light */
      if(e.lookAt && !e.aimAt){ const want = ang(Math.atan2(e.lookAt[0] - p.x, e.lookAt[1] - p.z), g.rotation.y); const cl = Math.max(-1.1, Math.min(1.1, want)); e.look += (cl - e.look)*Math.min(1, dt*5); }
      else if(e.state === 'route' || e.state === 'hold' || e.state === 'walk') e.look += (Math.sin(t*0.9 + e.lookPh)*e.sweep - e.look)*Math.min(1, dt*2);
      else if(e.state === 'aim' || e.state === 'combat' || e.aimAt) e.look *= Math.max(0, 1 - dt*8);
      /* arms: gun up and pointed when looking for you */
      F.armBusy = true;
      const up = e.state === 'aim' || e.state === 'combat' || e.aimAt ? -1.5 : e.state === 'search' || e.state === 'investigate' || e.hold ? -1.25 : e.state === 'drag' ? -0.6 : -1.05;
      F.armR.rotation.x += (up - F.armR.rotation.x)*Math.min(1, dt*6); F.armR.rotation.y = -e.look*0.8; F.armR.rotation.z = 0.12;
      if(e.state !== 'drag' && e.state !== 'script') F.armL.rotation.x += ((up + 0.15) - F.armL.rotation.x)*Math.min(1, dt*5);
      if(e.state !== 'script') animateFridge(F, t + F.seed, moving, {});
      /* the beam follows the gun */
      if(e.light && e.state !== 'drag'){
        const lp = e.gun.userData.lensPos.getWorldPosition(this._f);
        const yaw = g.rotation.y + e.look, pitch = e.pitch !== undefined ? e.pitch : (e.state === 'search' ? 0.32 : 0.2);
        e.cone.visible = true; e.cone.position.copy(lp); e.cone.rotation.set(0, 0, 0); e.cone.rotateY(yaw); e.cone.rotateX(pitch);
        const hitD = Math.min(e.lightLen, lp.y/Math.tan(Math.max(0.05, pitch)));
        e.pool.visible = true; e.pool.position.set(lp.x + Math.sin(yaw)*hitD, 0.012, lp.z + Math.cos(yaw)*hitD); const ps = 0.6 + hitD*0.18; e.pool.scale.set(ps, ps*1.6, 1); e.pool.rotation.z = -yaw; e.pool.material.opacity = 0.42;
      } else { e.cone.visible = false; e.pool.visible = false; }
      /* noticing */
      if(e.state !== 'script' && e.state !== 'drag' && e.state !== 'combat' && e.state !== 'aim' && !e.deaf){
        e.visT = (e.visT || 0) - dt;
        if(e.visT <= 0){ e.visT = 0.08; e.vis = this.visibility(e, dt); }
        const v = e.vis || 0;
        if(v > 0.02){ e.sus = Math.min(1.2, e.sus + v*1.5*dt); e.lastSeen = [cam.x, cam.z]; }
        else e.sus = Math.max(0, e.sus - dt*0.22);
        /* noise: running and knocking things over */
        if(W.body.noise > 0){ const dd = Math.sqrt(d2); if(dd < W.body.noise){ e.sus = Math.min(1.2, e.sus + dt*1.4); e.lastSeen = [cam.x, cam.z]; } }
        if(e.sus > 0.3 && e.lastSeen){
          if(this.canInvestigate(e)){ if(e.state === 'search' ? e.sus > 0.55 && e.noticeT <= 0 : e.state !== 'investigate') this.notice(e); else if(e.state === 'investigate') e.lookAt = e.lastSeen.slice(); }
          /* scripted: stop and stare at it until it goes away */
          else if(!e.peek){ e.peek = true; e.hold = true; e.lookAt = e.lastSeen.slice(); this.say(e, CREW_LINES.huh[e.idx % CREW_LINES.huh.length]); }
          else e.lookAt = e.lastSeen.slice();
        } else if(e.peek && e.sus < 0.18){ e.peek = false; if(e.holdT <= 0){ e.hold = false; e.lookAt = null; } }
        if(e.sus >= 1 && W.onSpotted){ e.preAim = e.state; e.hold = false; e.noticeT = 0; e.peek = false; e.state = 'aim'; e.aimAt = cam.clone(); this.say(e, CREW_LINES.spot[e.idx % CREW_LINES.spot.length], 1.6); W.onSpotted(e); }
        worst = Math.max(worst, e.sus);
        if(e.sus > 0.3) anyAlert++;
      }
      /* the mark over the head */
      if(e.sus > 0.3 || e.state === 'aim'){ e.mark.visible = true; e.mark.material = e.sus >= 1 || e.state === 'aim' ? XM : QM; e.mark.position.set(p.x, (F.top || 1.7) + 0.45 + Math.sin(t*6)*0.03, p.z); const s = 0.3 + Math.min(1, e.sus)*0.2; e.mark.scale.setScalar(s); }
      else e.mark.visible = false;
      /* chatter */
      e.chatter -= dt; if(e.chatter <= 0){ e.chatter = 12; if(d2 < 120 && (e.state === 'route' || e.state === 'hold') && !e.hold) this.say(e, CREW_LINES.idle[(e.idx + Math.floor(t/12)) % CREW_LINES.idle.length], 2.2); }
      F.group.visible = d2 < 3600;
    }
    this.worst = worst; this.alerted = anyAlert;
  }
  nearestWp(e){ if(!e.route) return 0; const p = e.F.group.position; let b = 0, bd = 1e9; e.route.forEach((w, i)=>{ const d = Math.hypot(w[0] - p.x, w[1] - p.z); if(d < bd){ bd = d; b = i; } }); return b; }
  /* ---------- violence ---------- */
  muzzle(e){ const v = new THREE.Vector3(); e.gun.userData.muzzle.getWorldPosition(v); return v; }
  /* a shot at something scripted: a guest, a wall, the ceiling */
  fireAt(e, pos, o){
    o = o || {};
    const C = this.C, from = this.muzzle(e);
    e.gun.userData.flash.visible = true; e.gun.userData.flashT = 0.05;
    C.gore.tracer(from, pos, { speed:240 });
    C.audio.heist && C.audio.heist.gun(o.sound || (e.weapon === 'shotgun' ? 'shotgun' : e.weapon === 'pistol' ? 'pistol' : 'smg'), from, { vol:o.vol || 0.9 });
    if(this.W.fx) this.W.fx.flash(from, 0xffc070, 1.2, 0.06);
    if(C.arsenal && C.arsenal.worldFlash){ C.arsenal.worldFlash.position.copy(from); C.arsenal.worldFlash.intensity = 14; }
    e.F.face.set('angry', 0.4);
    if(o.impact !== false){ const n = from.clone().sub(pos).normalize(); C.gore.impact(pos, n, o.surface || 'carpet'); }
    C.bus.emit('gunshot', { pos:from, src:'crew' });
  }
  /* the fight: shoot at you for real (heist.hurt is routed to the wake while it runs) */
  shootPlayer(e, acc, dmg){
    const C = this.C, from = this.muzzle(e);
    e.gun.userData.flash.visible = true; e.gun.userData.flashT = 0.05;
    C.combat.enemyFire(from, acc, dmg, { pellets:e.weapon === 'shotgun' ? 6 : 1, sound:e.weapon === 'shotgun' ? 'shotgun' : e.weapon === 'pistol' ? 'pistol' : 'smg', self:e.target, weapon:e.weapon, vol:0.85 });
    e.F.face.set('angry', 0.5);
  }
  brainCombat(e, dt, slow){
    const C = this.C, cam = C.camera.position, p = e.F.group.position;
    const dist = Math.hypot(cam.x - p.x, cam.z - p.z);
    e.losT = (e.losT || 0) - dt; if(e.losT <= 0){ e.losT = R(0.2, 0.35); const ey = this.eye(e); e.sees = los(C.collide, ey.x, ey.y, ey.z, cam.x, cam.y - 0.1, cam.z); }
    e.moveT = (e.moveT || 0) - dt;
    if(e.moveT <= 0){ e.moveT = R(2.5, 5); const a = Math.atan2(p.x - cam.x, p.z - cam.z) + R(-1.2, 1.2), r = R(5, 9); const N = C.heist.nav, c = N.nearest(cam.x + Math.sin(a)*r, cam.z + Math.cos(a)*r, 4); if(c){ const [x, z] = N.pos(c[0], c[1]); this.goTo(e, x, z); } }
    e.aimAt = e.sees ? cam : null;
    e.fireCD -= dt*slow;
    if(e.sees && e.fireCD <= 0){
      if(e.burst <= 0){ e.burst = e.weapon === 'smg' ? 4 : e.weapon === 'shotgun' ? 1 : 2; }
      const acc = 0.28*Math.max(0.35, 1 - dist*0.04)*(this.W.body.moving ? 0.7 : 1)*(this.W.body.posture !== 'stand' ? 0.8 : 1);
      this.shootPlayer(e, acc, e.weapon === 'shotgun' ? 7 : e.weapon === 'smg' ? 6 : 9);
      e.burst--; e.fireCD = e.burst > 0 ? (e.weapon === 'smg' ? 0.11 : 0.3) : R(1.0, 1.9);
      if(Math.random() < 0.08) this.say(e, pick(CREW_LINES.fight));
    }
    return 0;
  }
  ray(e, o, d, maxT){
    if(e.gone) return null;
    const F = e.F, p = F.group.position, h = F.h || 1.7, yaw = F.group.rotation.y;
    if(!e.alive){ const back = new THREE.Vector3(-Math.sin(yaw), 0, -Math.cos(yaw)); const c = p.clone().addScaledVector(back, e.fellBack ? h/2 : -h/2); const r = rayOBB(o.x, o.y, o.z, d.x, d.y, d.z, c.x, F.d/2, c.z, F.w/2, F.d/2, h/2, yaw, maxT); return r ? { t:r.t, n:r.n, part:'body' } : null; }
    const r = rayOBB(o.x, o.y, o.z, d.x, d.y, d.z, p.x, h/2, p.z, F.w/2, h/2, F.d/2 + 0.04, yaw, maxT);
    if(!r) return null;
    const y = o.y + d.y*r.t;
    return { t:r.t, n:r.n, part:y > (F.top || h)*0.72 ? 'head' : 'body' };
  }
  hit(e, info){
    const C = this.C, F = e.F, nn = new THREE.Vector3(info.n[0], info.n[1], info.n[2]);
    if(e.frozen && !info.explosion){ this.shatter(e, info.dir); return { hit:true, kill:true }; }
    C.gore.coolant(info.point, nn, 5); C.gore.hole(info.point, nn, 0.04);
    if(Math.random() < 0.6) C.gore.blobBurst(info.point, 2, '#b8160f', 0.6, true);
    C.audio.heist && C.audio.heist.hit('fridge', info.point);
    if(!e.alive) return { hit:true };
    const crit = info.part === 'head';
    e.hp -= info.dmg*(crit ? 2.2 : 1);
    e.sus = 1.2;
    if(e.state !== 'combat' && e.state !== 'script' && this.W.onCrewHit) this.W.onCrewHit(e);
    if(e.hp <= 0){ this.kill(e, info, crit); return { hit:true, kill:true, crit }; }
    F.face.set('hurt', 0.6); e.stopFor = 0.25;
    return { hit:true, crit };
  }
  kill(e, info, crit){
    const C = this.C, F = e.F;
    e.alive = false; e.state = 'dead'; e.path = null; e.aimAt = null;
    const fx = this.W.fx, dir = info && info.dir ? info.dir.clone() : new THREE.Vector3(0, 0, 1);
    if(crit && fx){ fx.crackFace(F, { static:0.25, dead:true }); }
    else { F.face.set('static', 0.5); setTimeout(()=>F.face.set('off', 1e9), 500); }
    C.gore.spill((info && info.point) || F.group.position.clone().setY(1), dir.clone().setY(0.3), { n:10, sauce:14 });
    if(fx){ const back = new THREE.Vector3(-Math.sin(F.group.rotation.y), 0, -Math.cos(F.group.rotation.y)); e.fellBack = back.dot(dir) > 0; fx.fall(F, e.fellBack ? 1 : -1, 0.5); fx.bleed(F.inner, new THREE.Vector3(0, (F.top || 1.7)*0.6, F.d/2), new THREE.Vector3(0, 0.5, 1), { life:6, rate:1.2 }); }
    C.audio.heist && C.audio.heist.squelch(F.group.position, true);
    C.bus.emit('crewkill', { e });
    if(this.W.onCrewKill) this.W.onCrewKill(e);
  }
  freezeHit(e, v, dir){
    if(!e.alive || e.frozen) return;
    e.freeze += v; e.stopFor = 0.15; e.F.face.set('shock', 0.5);
    if(e.state !== 'combat' && e.state !== 'script' && this.W.onCrewHit) this.W.onCrewHit(e);
    if(e.freeze >= 70){
      e.frozen = true; e.frozenT = 0; e.freeze = 140; if(this.W.lockFreeze) e.freezeLock = true;
      const C = this.C, F = e.F; const b = new THREE.Box3().setFromObject(F.group), s = new THREE.Vector3(), c = new THREE.Vector3(); b.getSize(s); b.getCenter(c);
      const ice = new THREE.Mesh(new THREE.BoxGeometry(s.x + 0.1, s.y + 0.08, s.z + 0.1), C.enemies ? C.enemies.iceM : new THREE.MeshStandardMaterial({ color:0xbfeeff, transparent:true, opacity:0.55 }));
      ice.position.copy(c); ice.rotation.y = F.group.rotation.y; C.scene.add(ice); e.ice = ice;
      C.audio.heist && C.audio.heist.hit('ice', c); C.gore.mistPuff(c, '#d8f6ff', 10, { size:0.4 });
      if(Math.random() < 0.5) this.say(e, pick(CREW_LINES.frozen), 1.6);
      if(this.W.onCrewFrozen) this.W.onCrewFrozen(e);
    }
  }
  shatter(e, dir){
    const C = this.C, p = e.F.group.position.clone();
    if(e.ice){ C.scene.remove(e.ice); e.ice = null; }
    C.gore.iceBurst(p, 26); C.gore.spill(p.clone().setY(0.6), dir || new THREE.Vector3(0, 1, 0), { n:8, sauce:6 });
    C.audio.heist && C.audio.heist.hit('ice', p); C.audio.heist && C.audio.heist.explosion(p, 0.2);
   
    e.alive = false; e.state = 'dead'; e.F.group.visible = false; e.cone.visible = false; e.pool.visible = false; e.mark.visible = false; C.combat.remove(e.target);
    C.bus.emit('crewkill', { e, shatter:true });
    if(this.W.onCrewKill) this.W.onCrewKill(e);
  }
}
