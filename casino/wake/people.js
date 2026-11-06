/* ============================================================
   COLD OPEN: everybody who isn't the crew
   the guests, face down with their hands on their heads, the
   dead, the ones hiding, the crowd at the doors. and the cruel
   bits: kneeling someone, executing them, dragging them across
   the floor while they leave a smear the whole way.
============================================================ */
import * as THREE from '../lib/three.module.min.js';
import { makeFridge, STYLES } from '../world/fridge.js';

const R = (a, b)=>a + Math.random()*(b - a);
const pick = a=>a[(Math.random()*a.length)|0];
const COLORS = ['#e8e8ea', '#f4f1e6', '#e05a5a', '#5a8ae0', '#9fe3d0', '#ffd56a', '#3a3a40', '#c060ff', '#ff8a3d', '#7ad08a', '#d9a441', '#8a4b22', '#ff7ad0', '#cfd8dc'];
const ACCS = [[], [], ['tophat'], ['cowboy'], ['party'], ['beanie'], ['chain'], ['bowtie'], ['magnets']];
export const NAMES = ['MARGARET', 'TONY', 'DEB', 'LITTLE SAL', 'RHONDA', 'FRANK', 'BEV', 'CARL', 'THE NEWLYWED', 'GRANDPA ICEBOX', 'DONNA', 'RICKY', 'JUNE', 'MO', 'PATTY', 'EARL', 'VERN', 'GLORIA'];
export const SOBS = ['please', 'please please please', 'i have kids. little ones. mini fridges.', 'i won\'t look. i won\'t look at you.', 'take it. take everything.', 'mama', 'i just came for the buffet', 'oh god oh god oh god'];

export class People {
  constructor(C, W){ this.C = C; this.W = W; this.list = []; this.sobT = 3; }
  spawn(o){
    const C = this.C;
    const look = Object.assign({ face:true, arms:true, color:pick(COLORS), style:pick(STYLES.filter(s=>s !== 'mini')), acc:pick(ACCS), eye:pick(['#7ff3ff', '#ffd56a', '#ff7ad0', '#5dff9c']), partyCol:pick(['#ff3fa4', '#3fa4ff', '#ffd400']), beanie:pick(['#c0392b', '#2a2a2a']) }, o.look || {});
    const F = makeFridge(look); F.seed = Math.random()*10; F.custom = true;
    F.group.position.set(o.x, 0, o.z); F.group.rotation.y = o.yaw !== undefined ? o.yaw : R(0, 6.28); C.scene.add(F.group);
    const p = { F, look, name:o.name || pick(NAMES), pose:'stand', alive:o.alive !== false, role:o.role || 'hostage', t:Math.random()*5, tag:o.tag || '', tremble:o.tremble === undefined ? 1 : o.tremble };
    this.list.push(p);
    this.pose(p, o.pose || 'stand');
    if(!p.alive){ F.face.set(o.cracked ? 'off' : 'dead', 1e9); if(o.cracked && this.W.fx) this.W.fx.crackFace(F, { static:0.01, dead:true }); if(o.puddle !== false) C.gore.puddleAt(o.x + R(-0.3, 0.3), o.z + R(-0.3, 0.3), pick(['#7a0a06', '#7a0a06', '#d8d4c8']), R(0.4, 0.8)); }
    else if(p.role === 'hostage') F.face.set(pick(['sad', 'shock', 'sad']), 1e9);
    return p;
  }
  remove(p){ this.C.scene.remove(p.F.group); const i = this.list.indexOf(p); if(i >= 0) this.list.splice(i, 1); }
  clear(){ this.list.slice().forEach(p=>this.remove(p)); }
  /* poses are set straight on the body; nothing calls animateFridge on these */
  pose(p, kind){
    const F = p.F, half = F.d/2; p.pose = kind;
    F.inner.rotation.set(0, 0, 0); F.inner.position.set(0, 0, 0); F.inner.scale.set(1, 1, 1);
    F.armBusy = true;
    if(kind === 'face'){ F.inner.rotation.x = -Math.PI/2; F.inner.position.y = half*0.98; F.inner.position.z = half; if(F.armL){ F.armL.rotation.set(-2.9, 0, -0.3); F.armR.rotation.set(-2.9, 0, 0.3); } }
    else if(kind === 'back'){ F.inner.rotation.x = Math.PI/2; F.inner.position.y = half*0.98; F.inner.position.z = -half; if(F.armL){ F.armL.rotation.set(-R(0.3, 1.6), 0, -R(0.2, 0.9)); F.armR.rotation.set(-R(0.3, 1.6), 0, R(0.2, 0.9)); } }
    else if(kind === 'side'){ F.inner.rotation.z = Math.PI/2*(Math.random() < 0.5 ? 1 : -1); F.inner.position.y = F.w/2; F.inner.position.x = -F.inner.rotation.z/(Math.PI/2)*(F.h || 1.7)*0.02; if(F.armL){ F.armL.rotation.set(-0.6, 0, -0.4); F.armR.rotation.set(-1.4, 0, 0.4); } }
    else if(kind === 'kneel'){ F.inner.position.y = -0.32; F.inner.rotation.x = 0.12; if(F.armL){ F.armL.rotation.set(-2.7, 0, -0.5); F.armR.rotation.set(-2.7, 0, 0.5); } }
    else if(kind === 'hide'){ F.inner.position.y = -0.38; F.inner.rotation.x = 0.35; if(F.armL){ F.armL.rotation.set(-1.9, 0, -0.9); F.armR.rotation.set(-1.9, 0, 0.9); } }
    else if(kind === 'slump'){ F.inner.position.y = -0.2; F.inner.rotation.x = 0.5; F.inner.rotation.z = 0.2; if(F.armL){ F.armL.rotation.set(-0.2, 0, -0.1); F.armR.rotation.set(-0.3, 0, 0.1); } }
    else if(kind === 'pound'){ if(F.armL){ F.armL.rotation.set(-2.2, 0, -0.2); F.armR.rotation.set(-2.2, 0, 0.2); } }
    else if(kind === 'hands'){ if(F.armL){ F.armL.rotation.set(-2.9, 0, -0.35); F.armR.rotation.set(-2.9, 0, 0.35); } }
    else { if(F.armL){ F.armL.rotation.set(0, 0, -0.12); F.armR.rotation.set(0, 0, 0.12); } }
  }
  update(dt, t){
    const C = this.C, cam = C.camera.position;
    this.sobT -= dt;
    for(const p of this.list){
      const F = p.F, d2 = F.group.position.distanceToSquared(cam);
      F.group.visible = d2 < 3600;
      if(d2 < 300) F.face.update(dt, true);
      if(!p.alive || p.script) continue;
      p.t += dt;
      /* the living shake */
      if(F.armL && p.tremble && d2 < 200){
        const w = 0.05*p.tremble;
        if(p.pose === 'face' || p.pose === 'kneel' || p.pose === 'hands'){ const b = p.pose === 'face' ? -2.9 : p.pose === 'kneel' ? -2.7 : -2.9; F.armL.rotation.x = b + Math.sin(t*15 + F.seed)*w; F.armR.rotation.x = b + Math.sin(t*14 + F.seed + 1)*w; }
        if(p.pose === 'hide'){ F.inner.rotation.z = Math.sin(t*18 + F.seed)*0.012*p.tremble; }
        if(p.pose === 'pound'){ const k = Math.abs(Math.sin(t*6 + F.seed)); F.armL.rotation.x = -2.0 - k*0.6; F.armR.rotation.x = -2.0 - Math.abs(Math.sin(t*6 + F.seed + 1.4))*0.6; F.inner.position.z = Math.sin(t*6 + F.seed)*0.03; }
      }
    }
    /* someone close by is crying */
    if(this.sobT <= 0){ this.sobT = R(3, 7); const near = this.list.filter(p=>p.alive && !p.script && p.role !== 'crowd' && p.F.group.position.distanceToSquared(cam) < 60); if(near.length){ const p = pick(near); C.audio.heist && C.audio.heist.whimper(p.F.group.position); p.F.face.say(0.6); if(Math.random() < 0.35) C.hud.toast(p.name.toLowerCase() + ': ' + pick(SOBS)); } }
  }
  nearestBody(x, z, maxD){ let b = null, bd = maxD || 1.3; for(const p of this.list){ if(p.pose !== 'face' && p.pose !== 'back' && p.pose !== 'side') continue; const d = Math.hypot(p.F.group.position.x - x, p.F.group.position.z - z); if(d < bd){ bd = d; b = p; } } return b; }

  /* ---------- the cruel parts ---------- */
  /* kill someone where they are. the shooter aims first, a beat, then */
  async execute(p, crew, e, o){
    o = o || {};
    const C = this.C, fx = this.W.fx, F = p.F;
    p.script = true;
    const head = F.group.localToWorld(new THREE.Vector3(0, p.pose === 'kneel' ? (F.top || 1.7)*0.62 : p.pose === 'face' ? 0.3 : (F.top || 1.7)*0.82, p.pose === 'face' ? F.d*0.2 + (F.h || 1.7)*0.6 : 0));
    if(e){ e.aimAt = head.clone(); e.state = 'script'; await C.tweens.sleep(o.aim || 0.8); }
    if(o.plead !== false && e){ F.face.set('shock', 2); C.audio.heist && C.audio.heist.whimper(F.group.position); if(o.line) C.hud.say(p.name, o.line, 2.4); await C.tweens.sleep(o.pleadT || 0.9); }
    const shots = o.shots || 1;
    for(let i=0;i<shots;i++){ if(e) crew.fireAt(e, head.clone().add(new THREE.Vector3(R(-0.05, 0.05), R(-0.05, 0.05), R(-0.05, 0.05))), { impact:false }); if(i === 0){ p.alive = false; if(p.pose === 'face' || p.pose === 'back'){ fx.crackFace(F, { static:0.3, dead:true }); C.gore.spill(head, new THREE.Vector3(0, 1, 0), { n:6, sauce:14, power:0.7 }); fx.bleed(F.inner, new THREE.Vector3(0, (F.top || 1.7)*0.82, F.d/2), new THREE.Vector3(0, 0, 1), { life:10, rate:1.3 }); } else fx.execute(F, { dir:e ? head.clone().sub(e.F.group.position).setY(0).normalize() : undefined, back:o.back, bleedT:10 }); }
      else { C.gore.coolant(head, new THREE.Vector3(0, 1, 0), 4); C.gore.blobBurst(head, 4, '#b8160f', 0.8, true); }
      await C.tweens.sleep(0.14); }
    if(e){ e.aimAt = null; }
    p.pose = p.pose === 'kneel' || p.pose === 'stand' || p.pose === 'hands' ? (o.back ? 'back' : 'face') : p.pose;
    C.bus.emit('wakeKill', { p });
  }
  /* drag a person across the floor behind a crew member. they're on their back, one arm up in his hand */
  dragStart(p, e){
    p.script = true; p.dragBy = e; e.state = 'drag'; e.dragging = p;
    const F = p.F; this.pose(p, 'back'); F.inner.position.z = 0;
    if(F.armR){ F.armR.rotation.set(-3.0, 0, 0.2); }
    this.W.fx.endSmear(p);
  }
  dragTick(p, dt, t){
    const e = p.dragBy; if(!e) return;
    const C = this.C, eg = e.F.group, yaw = eg.rotation.y;
    const back = new THREE.Vector3(-Math.sin(yaw), 0, -Math.cos(yaw));
    const at = eg.position.clone().addScaledVector(back, 0.55);
    const F = p.F, g = F.group;
    /* the body faces away from the dragger, head first. it lags a little and fishtails */
    g.position.x += (at.x - g.position.x)*Math.min(1, dt*7); g.position.z += (at.z - g.position.z)*Math.min(1, dt*7);
    g.rotation.y += Math.atan2(Math.sin(yaw + Math.PI - g.rotation.y), Math.cos(yaw + Math.PI - g.rotation.y))*Math.min(1, dt*4);
    F.inner.rotation.z = Math.sin(t*3.1 + F.seed)*0.08;
    e.F.armL.rotation.x = -0.6 + Math.sin(t*4)*0.05; e.F.armL.rotation.z = 0.2;
    /* the drag mark: under where the body actually is */
    const mid = g.localToWorld(new THREE.Vector3(0, 0, (F.h || 1.7)*0.45));
    this.W.fx.smear(p, mid.x, mid.z, p.alive ? '#8a0c08' : '#6a0805', 0.5);
    if(p.alive && Math.random() < dt*0.6){ C.audio.heist && C.audio.heist.whimper(g.position); F.face.say(0.5); }
    if(p.alive && F.armL){ F.armL.rotation.x = -1.2 + Math.sin(t*5 + F.seed)*0.6; }
  }
  dragEnd(p){ const e = p.dragBy; if(e){ e.dragging = null; e.state = 'walk'; } p.dragBy = null; this.W.fx.endSmear(p); }
}
