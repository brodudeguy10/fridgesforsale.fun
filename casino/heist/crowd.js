/* ============================================================
   FRIDGE PALACE HEIST: everybody get down
   when the gun comes out the guests hit the carpet, the staff put
   their hands up, gus ducks behind the bar and the night guard
   sleeps through all of it. the room's fear drains; yell, fire,
   aim at people to keep it up. let it drop and somebody gets brave.
   walk up to anyone on the floor and take what they've got.
============================================================ */
import * as THREE from '../lib/three.module.min.js';
import { animateFridge } from '../world/fridge.js';
import { rayOBB } from './combat.js';
import { canvas, tex } from '../world/textures.js';

const R = (a, b)=>a + Math.random()*(b - a);
const pick = a=>a[(Math.random()*a.length)|0];

const YELLS = ['EVERYBODY GET DOWN!', 'STAY DOWN!', 'NOBODY MOVES!', 'EYES ON THE CARPET!', 'NOBODY BE A HERO!', 'HANDS WHERE I CAN SEE THEM!', 'DOWN! DOWN! DOWN!', 'THIS IS A ROBBERY, NOT A CONVERSATION!', 'DON\'T MAKE ME DEFROST YOU!', 'KEEP YOUR DOORS SHUT!'];
const ROB_LINES = {
  chipper:['take it! take it! i was gonna lose it anyway!', 'is this part of the show? it\'s a great show.', 'you have very kind eyes. under the mask. probably.'],
  grumpy:['unbelievable. i was up four hundred.', 'i\'m writing a review about this.', 'fine. FINE. take it.'],
  lucky:['that was my lucky stack. you\'re taking my LUCK.', 'i hit a jackpot tonight and now THIS?', 'my horoscope said "unexpected losses". i thought it meant slots.'],
  broke:['that\'s it. that\'s all i have. that\'s a button.', 'you can have my coupons. they\'re expired.', 'i owe the vendor money. now i owe you too?'],
  tourist:['is this normal here? is this a local thing?', 'my guidebook did not mention this.', 'can i get a photo with you? no? okay.'],
  regular:['eleven years i\'ve been coming here. this is new.', 'tell doug i said goodbye.', 'i knew that guy by the restrooms was trouble.']
};
const ITEMS = [
  { t:'a gold watch', v:600, line:'"it\'s a replica. a very good replica. take it."' },
  { t:'a wedding ring', v:450, line:'"my ex-wife would be thrilled."' },
  { t:'a lucky rabbit\'s foot', v:1, line:'"it wasn\'t working anyway."' },
  { t:'a VIP comp card', v:250, line:'"it gets you a free shrimp cocktail."' },
  { t:'a single golden egg', v:800, line:'"don\'t ask where i got it."' },
  { t:'a pocket full of magnets', v:30, line:'"they\'re collectible."' }
];

export class Crowd {
  constructor(C){
    this.C = C;
    this.active = false; this.fear = 100; this.alarm = false;
    this.npcs = []; this.staff = [];
    this.heroCD = 6; this.yellCD = 0; this.robbed = 0; this.robTotal = 0; this.killed = 0;
    this.whimperT = 2;
    this.marker = (()=>{ const c = canvas(64, 64), g = c.getContext('2d'); g.fillStyle = '#ff3a2a'; g.font = 'bold 56px Georgia'; g.textAlign = 'center'; g.fillText('!', 32, 52); const s = new THREE.Sprite(new THREE.SpriteMaterial({ map:tex(c), depthTest:false, transparent:true })); s.scale.setScalar(0.4); s.visible = false; s.renderOrder = 10; C.scene.add(s); return s; })();
    C.bus.on('yell', ()=>this.yell());
    C.bus.on('gunshot', e=>{ if(!this.active) return; if(e.src === 'player') this.fear = Math.min(100, this.fear + 9); if(e.loud) this.fear = Math.min(100, this.fear + 20); });
    C.bus.on('key', e=>{ if(this.active && e.code === 'KeyF') this.yell(); });
  }
  /* ---------- the moment ---------- */
  goLoud(){
    const C = this.C;
    this.active = true; this.fear = 100;
    C.noSpawn = true; C.noChatter = true;
    const npcMod = C.games.npcs;
    const list = npcMod ? npcMod.list.slice() : [];
    list.forEach((n, i)=>this.take(n, i));
    /* staff */
    C.staff.forEach(F=>{
      if(F === (C.world.cage && C.world.cage.doug)) { this.staffUp(F, 'doug'); return; }
      if(F.name === 'NIGHT GUARD') return; /* he sleeps through it */
      if(F.name === 'GUS' || (F.name || '').indexOf('GUS') >= 0){ this.staffUp(F, 'duck'); return; }
      if(F.group && F.group.scale.x < 0.2) return; /* the mouse-hole fridge doesn't care */
      if(F.name === 'BOUNCER'){ this.staffUp(F, 'bouncer'); return; }
      this.staffUp(F, 'hands');
    });
    C.audio.heist && C.audio.heist.scream(new THREE.Vector3(0, 1.5, 4), 22);
    setTimeout(()=>C.audio.heist && C.audio.heist.scream(new THREE.Vector3(-14, 1.5, 0), 12), 300);
    setTimeout(()=>C.audio.heist && C.audio.heist.scream(new THREE.Vector3(14, 1.5, -2), 12), 500);
  }
  take(n, i){
    const C = this.C;
    if(n.machine){ n.machine.npc = null; n.machine = null; }
    C.games.npcs.release(n);
    const flee = Math.random() < 0.18;
    n.h = { state:flee ? 'flee' : 'drop', t:-R(0, 0.9), down:0, robbed:false, alive:true, frozen:0, hp:30, fearSelf:1 };
    n.F.face.set('shock', 999);
    n.ctl = (nn, dt, t, d2)=>this.control(nn, dt, t, d2);
    const self = this;
    n.h.target = { kind:'civ', n, get alive(){ return n.h.alive; }, shootableDead:true,
      ray:(o, d, maxT)=>self.rayCiv(n, o, d, maxT), hit:(info)=>self.hitCiv(n, info),
      center:()=>new THREE.Vector3(n.F.group.position.x, n.h.down > 0.5 ? 0.35 : 0.9, n.F.group.position.z),
      freeze:(v)=>self.freezeCiv(n, v) };
    C.combat.add(n.h.target);
    this.npcs.push(n);
  }
  staffUp(F, mode){
    const C = this.C;
    F.heist = { mode, t:R(0, 0.5), hp:40, alive:true };
    F.armBusy = true; F.custom = true;
    if(mode !== 'bouncer') F.face.set('shock', 999);
    if(mode === 'doug') F.face.set('shock', 999);
    this.staff.push(F);
    const self = this;
    F.heist.target = { kind:'staff', F, get alive(){ return F.heist.alive; }, shootableDead:true,
      ray:(o, d, maxT)=>{ if(F.heist.mode === 'duck' && F.heist.duck > 0.5) return null; const p = F.group.getWorldPosition(new THREE.Vector3()), q = F.group.getWorldQuaternion(new THREE.Quaternion()); const yaw = new THREE.Euler().setFromQuaternion(q, 'YXZ').y; const h = F.h || 1.7; const r = rayOBB(o.x, o.y, o.z, d.x, d.y, d.z, p.x, (F.heist.alive ? h/2 : 0.35), p.z, F.w/2, F.heist.alive ? h/2 : 0.35, F.d/2 + 0.04, yaw, maxT); return r ? { t:r.t, n:r.n, part:'body' } : null; },
      hit:(info)=>self.hitStaff(F, info), center:()=>F.group.getWorldPosition(new THREE.Vector3()).setY(1) };
    C.combat.add(F.heist.target);
  }
  /* ---------- per frame ---------- */
  control(n, dt, t, d2){
    const C = this.C, h = n.h, F = n.F, g = F.group;
    h.t += dt;
    if(!h.alive){ return; }
    if(h.frozen > 0){ return; }
    if(h.state === 'drop'){
      if(h.t < 0) return;
      h.down = Math.min(1, h.down + dt*2.4);
      this.poseDown(n, h.down, t);
      if(h.down >= 1){ h.state = 'down'; }
    } else if(h.state === 'down'){
      this.poseDown(n, 1, t);
      /* the scared ones tremble more */
      if(F.armL){ const w = this.fear/100*0.2 + 0.05; F.armL.rotation.x = -1.57 + Math.sin(t*14 + F.seed)*w*(h.robbed ? 0 : 1); F.armR.rotation.x = -1.57 + Math.sin(t*13 + F.seed + 1)*w*(h.robbed ? 0 : 1); if(h.robbed){ F.armL.rotation.x = -0.4; F.armR.rotation.x = -0.4; } }
      if(d2 < 100) F.face.update(dt, true);
    } else if(h.state === 'getup' || h.state === 'hero' || h.state === 'flee'){
      if(h.state === 'flee' && h.t < 0) return;
      if(h.down > 0){ h.down = Math.max(0, h.down - dt*2); this.poseDown(n, h.down, t); if(h.down > 0) return; }
      if(!h.path){ const goal = h.state === 'hero' ? (this.alarm ? [0, 20.8] : this.C.heist.panicSpot()) : [rand2(-2, 2), 20.8]; h.goal = goal; h.path = C.nav.path(g.position.x, g.position.z, goal[0], goal[1]); h.pi = 0; if(!h.path){ h.state = 'down'; h.down = 1; return; } }
      const wp = h.path[h.pi];
      if(!wp){ this.arrive(n); return; }
      const dx = wp[0] - g.position.x, dz = wp[1] - g.position.z, dd = Math.hypot(dx, dz);
      if(dd < 0.2) h.pi++;
      else { const sp = (h.state === 'flee' ? 3.4 : 2.8)*n.speed, step = Math.min(dd, sp*dt); g.position.x += dx/dd*step; g.position.z += dz/dd*step; g.rotation.y = Math.atan2(dx, dz); }
      F.armBusy = true; if(F.armL){ F.armL.rotation.x = Math.sin(t*12)*0.9; F.armR.rotation.x = -Math.sin(t*12)*0.9; F.armL.rotation.z = -0.5; F.armR.rotation.z = 0.5; }
      animateFridge(F, t + F.seed, 3, {});
      F.face.update(dt, d2 < 200);
      if(h.state === 'hero'){ this.marker.visible = true; this.marker.position.set(g.position.x, (F.top || 1.8) + 0.5, g.position.z); }
    }
  }
  arrive(n){
    const h = n.h;
    if(h.state === 'hero'){ this.marker.visible = false; if(!this.alarm){ this.C.heist.tripAlarm('a guest hit the panic button'); } h.state = 'drop'; h.t = 0; h.path = null; return; }
    /* out the door */
    this.C.combat.remove(h.target);
    this.npcs.splice(this.npcs.indexOf(n), 1);
    this.C.games.npcs.despawn(n);
  }
  poseDown(n, k, t){
    const F = n.F, s = k*k*(3 - 2*k), ang = -s*Math.PI/2, half = F.d/2;
    F.inner.rotation.set(ang, 0, 0);
    F.inner.position.y = Math.abs(Math.sin(ang))*half*0.98;
    F.inner.position.z = -(1 - Math.cos(ang))*half;
  }
  rayCiv(n, o, d, maxT){
    const F = n.F, p = F.group.position, h = n.h;
    let r;
    if(h.down > 0.5 || !h.alive){
      /* lying on its back, head toward -z local */
      const yaw = F.group.rotation.y, back = new THREE.Vector3(-Math.sin(yaw), 0, -Math.cos(yaw));
      const c = p.clone().addScaledVector(back, half(F) + (F.h || 1.7)/2);
      r = rayOBB(o.x, o.y, o.z, d.x, d.y, d.z, c.x, half(F), c.z, F.w/2, half(F), (F.h || 1.7)/2, yaw, maxT);
    } else r = rayOBB(o.x, o.y, o.z, d.x, d.y, d.z, p.x, (F.h || 1.7)/2, p.z, F.w/2, (F.h || 1.7)/2, F.d/2, F.group.rotation.y, maxT);
    return r ? { t:r.t, n:r.n, part:'body' } : null;
  }
  hitCiv(n, info){
    const C = this.C, h = n.h, G = C.gore, nn = new THREE.Vector3(info.n[0], info.n[1], info.n[2]);
    if(h.frozenSolid){ this.shatterCiv(n, info.dir); return { hit:true, kill:true }; }
    G.coolant(info.point, nn, 4); C.audio.heist && C.audio.heist.hit('fridge', info.point);
    if(!h.alive){ if((h.corpse = (h.corpse || 0) + 1) < 10) G.blobBurst(info.point, 3, pick(['#b8160f', '#f4f4ee']), 0.6, true); return { hit:true }; }
    h.hp -= info.dmg;
    if(h.hp <= 0){
      h.alive = false; this.killed++;
      n.F.face.set('static', 0.8); setTimeout(()=>n.F.face.set('off', 1e9), 800);
      G.spill(info.point, (info.dir || nn).clone().setY(0.4), { n:9, sauce:12 });
      C.audio.heist && C.audio.heist.squelch(info.point, true);
      this.fear = Math.min(100, this.fear + 40);
      if(h.down < 0.5){ h.down = 1; this.poseDown(n, 1, 0); }
      this.marker.visible = h.state === 'hero' ? false : this.marker.visible;
      C.bus.emit('civkill', { n });
      return { hit:true, kill:true };
    }
    n.F.face.set('hurt', 1); this.fear = Math.min(100, this.fear + 15);
    if(h.state === 'hero'){ h.state = 'drop'; h.t = 0; h.path = null; this.marker.visible = false; C.hud.say('', n.name + ' changes their mind about being a hero.'); }
    return { hit:true };
  }
  freezeCiv(n, v){ const h = n.h; if(!h.alive || h.frozenSolid) return; h.frz = (h.frz || 0) + v; if(h.frz > 60){ h.frozenSolid = true; h.frozen = 1; const b = new THREE.Box3().setFromObject(n.F.group), s = new THREE.Vector3(), c = new THREE.Vector3(); b.getSize(s); b.getCenter(c); const ice = new THREE.Mesh(new THREE.BoxGeometry(s.x + 0.08, s.y + 0.08, s.z + 0.08), this.C.enemies.iceM); ice.position.copy(c); this.C.scene.add(ice); h.ice = ice; this.C.audio.heist && this.C.audio.heist.hit('ice', c); this.C.bus.emit('civfreeze', { n }); } }
  shatterCiv(n, dir){ const C = this.C, h = n.h, p = n.F.group.position.clone(); if(h.ice) C.scene.remove(h.ice); C.gore.iceBurst(p, 20); C.gore.spill(p.clone().setY(0.4), dir || new THREE.Vector3(0, 1, 0), { n:6, sauce:4 }); h.alive = false; this.killed++; C.combat.remove(h.target); this.npcs.splice(this.npcs.indexOf(n), 1); C.games.npcs.despawn(n); C.bus.emit('civkill', { n, shatter:true }); }
  hitStaff(F, info){
    const C = this.C, s = F.heist, nn = new THREE.Vector3(info.n[0], info.n[1], info.n[2]);
    C.gore.coolant(info.point, nn, 4); C.audio.heist && C.audio.heist.hit('fridge', info.point);
    if(!s.alive){ return { hit:true }; }
    s.hp -= info.dmg;
    if(s.hp <= 0){
      s.alive = false; this.killed++;
      F.face.set('static', 0.8); setTimeout(()=>F.face.set('off', 1e9), 800);
      C.gore.spill(info.point, (info.dir || nn).clone().setY(0.4), { n:8, sauce:10 });
      C.audio.heist && C.audio.heist.squelch(info.point, true);
      s.fall = 0; this.fear = Math.min(100, this.fear + 35);
      C.bus.emit('staffkill', { F });
      return { hit:true, kill:true };
    }
    F.face.set('hurt', 1);
    return { hit:true };
  }
  updateStaff(dt, t){
    for(const F of this.staff){
      const s = F.heist; s.t += dt;
      if(!s.alive){
        if(s.fall !== undefined && s.fall < 1){ s.fall = Math.min(1, s.fall + dt*2); const a = -s.fall*s.fall*Math.PI/2; F.inner.rotation.set(a, 0, 0); F.inner.position.y = Math.abs(Math.sin(a))*F.d/2; F.inner.position.z = -(1 - Math.cos(a))*F.d/2; }
        continue;
      }
      if(s.mode === 'hands' || s.mode === 'doug'){
        const k = Math.min(1, s.t*3);
        if(F.armL){ const shake = Math.sin(t*15 + (F.seed || 0))*0.06; F.armL.rotation.x = -2.9*k + shake; F.armR.rotation.x = -2.9*k - shake; F.armL.rotation.z = -0.35*k; F.armR.rotation.z = 0.35*k; }
        if(s.mode === 'doug' && s.filling){ F.armBusy = true; F.armR.rotation.x = -1.3 + Math.sin(t*9)*0.5; F.armL.rotation.x = -1.2 - Math.sin(t*9)*0.5; }
      } else if(s.mode === 'duck'){
        s.duck = Math.min(1, (s.duck || 0) + dt*2);
        F.group.position.y = -s.duck*1.25;
      } else if(s.mode === 'bouncer'){
        /* the bouncer is not a hands-up kind of fridge. the heist turns him into a fight */
      }
      if(F.face) F.face.update(dt, true);
    }
  }
  update(dt, t){
    if(!this.active) return;
    const C = this.C;
    this.updateStaff(dt, t);
    if(this.yellCD > 0) this.yellCD -= dt;
    /* the fear drains */
    if(!this.alarm){
      const downs = this.npcs.filter(n=>n.h.alive && n.h.state !== 'flee').length;
      this.fear = Math.max(0, this.fear - dt*(1.6 + downs*0.06)*(C.heist.fearMul || 1));
      /* aiming at people keeps them down */
      const A = C.arsenal;
      if(A && A.drawn && A.adsK > 0.6){ const f = new THREE.Vector3(); C.camera.getWorldDirection(f); for(const n of this.npcs){ if(!n.h.alive) continue; const d = n.F.group.position.clone().setY(0.5).sub(C.camera.position); const dl = d.length(); if(dl < 16 && d.normalize().dot(f) > 0.96){ this.fear = Math.min(100, this.fear + dt*14); break; } } }
      /* somebody gets brave */
      this.heroCD -= dt;
      if(this.fear < 25 && this.heroCD <= 0 && !this.npcs.some(n=>n.h.state === 'hero')){
        this.heroCD = R(5, 8);
        const cand = this.npcs.filter(n=>n.h.alive && n.h.state === 'down' && !n.h.frozenSolid);
        if(cand.length && Math.random() < 0.7){ const n = pick(cand); n.h.state = 'hero'; n.h.path = null; n.h.t = 0; n.F.face.set('angry', 999); C.hud.say(n.name, pick(['i\'m not scared of you!', 'somebody hit the button!', 'for the palace!', 'i\'ve got a family freezer to protect!'])); C.audio.heist && C.audio.heist.shout(n.F.group.position, false); C.bus.emit('hero', { n }); }
      }
    }
    /* whimpering */
    this.whimperT -= dt;
    if(this.whimperT <= 0){ this.whimperT = R(1.2, 3); const dn = this.npcs.filter(n=>n.h.alive && n.h.state === 'down'); if(dn.length){ const n = pick(dn); C.audio.heist && C.audio.heist.whimper(n.F.group.position); if(Math.random() < 0.15 && n.F.group.position.distanceTo(C.camera.position) < 8){ C.hud.toast(n.name + ': ' + pick(['please...', 'i just came for the buffet', 'mom?', 'is it over?', 'i can\'t feel my compressor', 'somebody call the vendor', 'not the face screen, not the face screen'])); } } }
    /* during the fight, people slip out the door */
    if(this.alarm && Math.random() < dt*0.12){ const dn = this.npcs.filter(n=>n.h.alive && n.h.state === 'down' && !n.h.frozenSolid); if(dn.length){ const n = pick(dn); n.h.state = 'flee'; n.h.path = null; n.h.t = 0; } }
  }
  /* ---------- you ---------- */
  yell(){
    const C = this.C;
    if(!this.active || this.yellCD > 0 || !(C.arsenal && C.arsenal.drawn)) return;
    this.yellCD = 1.6;
    this.fear = Math.min(100, this.fear + 28);
    const line = pick(YELLS);
    C.hud.say('YOU', line, 1.6);
    C.audio.heist && C.audio.heist.shout(null, true);
    /* heroes in front of you lose their nerve */
    const f = new THREE.Vector3(); C.camera.getWorldDirection(f);
    for(const n of this.npcs){ if(n.h.state !== 'hero') continue; const d = n.F.group.position.clone().setY(1).sub(C.camera.position); if(d.length() < 18 && d.normalize().dot(f) > 0.8){ n.h.state = 'drop'; n.h.t = 0; n.h.path = null; n.F.face.set('shock', 999); this.marker.visible = false; C.hud.toast(n.name + ' gets back down', 'gold'); } }
    C.bus.emit('yelled', { line });
  }
  nearestRobbable(){
    const C = this.C, f = new THREE.Vector3(); C.camera.getWorldDirection(f);
    let best = null, bs = 0;
    for(const n of this.npcs){
      if(!n.h.alive || n.h.robbed || n.h.state !== 'down' || n.h.frozenSolid) continue;
      const p = n.F.group.position, d = new THREE.Vector3(p.x, 0.4, p.z).sub(C.camera.position), dl = d.length();
      if(dl > 2.6) continue; d.normalize(); const dot = d.dot(f);
      if(dot > 0.6 && dot - dl*0.05 > bs){ bs = dot - dl*0.05; best = n; }
    }
    return best;
  }
  rob(n){
    const C = this.C, h = n.h;
    h.robbed = true;
    const base = { chipper:[80, 260], grumpy:[40, 180], lucky:[250, 900], broke:[2, 40], tourist:[120, 420], regular:[90, 320] }[n.mood] || [60, 240];
    let amt = Math.round(R(base[0], base[1])*(C.heist.lootMul || 1));
    let extra = null;
    if(Math.random() < 0.2){ extra = pick(ITEMS); amt += extra.v; }
    this.robbed++; this.robTotal += amt;
    n.F.face.set('sad', 999); n.F.face.say(1.5);
    const p = n.F.group.position.clone().setY(0.5);
    C.fx.coins(p, 14, new THREE.Vector3(0, 1, 0)); C.audio.chip(p, 5);
    C.hud.say(n.name, extra ? extra.line : pick(ROB_LINES[n.mood] || ROB_LINES.regular));
    C.hud.toast('+' + amt.toLocaleString() + ' from ' + n.name + (extra ? ' (and ' + extra.t + ')' : ''), 'gold');
    C.heist.addLoot(amt, 'floor');
    this.fear = Math.min(100, this.fear + 4);
    C.bus.emit('robbed', { n, amt });
  }
  /* ---------- the end of it ---------- */
  release(){
    /* used when the heist is abandoned: everybody gets up and leaves */
    this.active = false; this.marker.visible = false;
    this.npcs.slice().forEach(n=>{ this.C.combat.remove(n.h.target); if(n.h.ice) this.C.scene.remove(n.h.ice); });
    this.staff.forEach(F=>this.C.combat.remove(F.heist.target));
  }
}
function half(F){ return F.d/2; }
function rand2(a, b){ return a + Math.random()*(b - a); }
