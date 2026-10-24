/* ============================================================
   FRIDGE PALACE HEIST: CLEMENT
   rusted olive retro, sunglasses on a face screen, a scratched-off
   name tag, a long coat, a cigarette that never goes out. he has
   the guns and the plan and you know exactly how this ends.
   follows you around until the job starts, shoots cops for you
   until the vault opens, then he's the fight.
============================================================ */
import * as THREE from '../lib/three.module.min.js';
import { makeFridge, animateFridge } from '../world/fridge.js';
import { canvas, tex } from '../world/textures.js';
import { rayOBB } from './combat.js';
import { los } from './nav.js';

const R = (a, b)=>a + Math.random()*(b - a);
const pick = a=>a[(Math.random()*a.length)|0];
const angDiff = (a, b)=>Math.atan2(Math.sin(a - b), Math.cos(a - b));

export const LINES = {
  idle:['...', 'you lost? the restrooms are painted on. don\'t ask.', 'keep walking, high roller.', 'the house always wins. unless somebody robs the house.'],
  intro:[
    'you. yeah, you. you\'ve got the look of somebody this place has been chewing on all night.',
    'name\'s clement. i\'ve been casing this dump for eleven years. the vault is behind the cage. the cage is behind doug. doug is behind on his child support.',
    'two of us. guns out, money in, nobody gets hurt unless they get creative. we split it down the middle.'
  ],
  why:'everything in that vault that isn\'t bolted down. and i brought a crowbar for the stuff that is.',
  no:['sure. go play the slots. they love you. they told me.', 'your loss. i\'ll be right here. smoking. judging.', 'come back when you\'re tired of losing politely.'],
  yes:'atta fridge. here. pick your poison.',
  armed:['whenever you\'re ready, pull it out. the second that iron shows, we\'re on the clock.', 'i\'ll be right behind you. that\'s not a threat. yet.'],
  follow:['take your time. the vault isn\'t going anywhere. it\'s a vault.', 'you play like you\'ve never stolen anything. that\'s cute.', 'see the guard by the cage? me neither. that\'s the point.', 'nice place. shame about tonight.', 'you ever notice nobody here blinks? i noticed.'],
  loud:'EVERYBODY GET DOWN! THIS IS A ROBBERY, NOT A CONVERSATION!',
  loud2:'you keep the room scared. i\'ll get to the gate at the back of the cage. get doug to fill a bag if you want the bonus.',
  atGate:['whenever you\'re done shaking down tourists, i\'m at the gate.', 'tell me when. the charge is ready. so am i.'],
  breach:'FIRE IN THE HOLE!',
  postBreach:'that\'s the alarm. good. now everybody knows we\'re serious. get the drill on that door.',
  drill:['keep them off the drill!', 'here they come. try not to die. you\'re carrying half the bag.', 'cops at the front! like moths. like expensive moths.', 'if that drill stops, we stop.'],
  jam:['drill\'s jammed! kick it! fridges always respond to violence.', 'it jammed. go kick it. i\'ll cover you. probably.'],
  vaultOpen:'oh, look at that. look at all that. go on, grab it. i\'ll watch the door.',
  enough:'that\'s plenty. come on, give me the bag and let\'s move.',
  betray:['you know what\'s better than half?', 'all of it.', 'nothing personal, partner. two ways is one too many.'],
  locked:['you hear me in there? it\'s soundproof. i can still hear you crying though.', 'enjoy the vault. you always wanted to be inside it.'],
  boss1:['you got out? how? ...is that GUS\'S FREON?', 'fine. FINE. let\'s do this the stupid way.', 'come get your half!'],
  boss1hit:['this coat was a GIFT!', 'my gold!', 'quit shooting the merchandise!', 'that\'s coming out of your half!'],
  plates:'you shot off my gold. you know how long that took to strap on?',
  boss2:'you want to play in the dark? let\'s play in the dark.',
  boss2cam:{ floor:'i see you on camera one, partner. right in the middle of the floor. bold.', slots:'camera two. hiding behind the slots. they don\'t pay out for that.', tables:'camera three. by the tables. place your bets.', club:'camera five. the club? you\'re not even a member.', staff:'oh, you\'re close now. i can hear your compressor.', lobby:'camera one. the lobby. leaving already?', cage:'back in the cage? nothing left, i took it.' },
  boss3:['the van\'s right outside! i can SEE it!', 'i\'ve got a door hanging off and i\'m still beating you!', 'stay back! i\'ve got a cigarette and i\'m not afraid to ash it!'],
  down:['ok. ok. you win. take the bag. i\'ll just... crawl.', 'tell doug i\'m sorry about the child support joke.', 'you were always gonna be the one, huh.', 'i should\'ve split it. no. no i shouldn\'t have.'],
  finish:'...worth it.',
  vendor:'what the... who\'s that behind— no. no no no. NOT HIM.',
  hurtYou:['oops.', 'watch where you\'re standing.', 'i\'d say sorry but i\'m not.'],
  youHurt:['hey! wrong fridge!', 'shoot me again and see what happens.', 'save it for the cops, genius.'],
  kill:['got one.', 'that\'s two for me.', 'drop the gun, officer. oh, you did. you died.', 'stay frosty.']
};

export class Clement {
  constructor(C, o){
    this.C = C; o = o || {};
    this.o = o; this.name = o.name || 'CLEMENT';
    const style = o.style || 'retro';
    const F = makeFridge({ face:true, arms:true, bareFront:true, style, color:o.color || '#5a5a3a', trim:o.trim || '#3a3a22', eye:o.eye || '#c8ff40', screen:'#0b0d04', shades:o.shades !== false, acc:o.acc || ['rust', 'nametag'], glove:'#1a1208' });
    F.face.scar = o.scar !== false; F.face.set('smug', 1e9);
    if(C.enemies) C.enemies.addDoor(F, { style });
    /* the coat */
    const coatM = new THREE.MeshStandardMaterial({ color:0x3a2a1a, roughness:0.85 });
    if(o.coat !== false) [-1, 1].forEach(s=>{ const p = new THREE.Mesh(new THREE.BoxGeometry(0.2, F.h*0.82, 0.04), coatM); p.position.set(s*(F.w/2 - 0.08), F.h*0.43, F.d/2 + 0.09); p.rotation.y = s*0.12; F.inner.add(p); const sd = new THREE.Mesh(new THREE.BoxGeometry(0.04, F.h*0.85, F.d*0.9), coatM); sd.position.set(s*(F.w/2 + 0.03), F.h*0.45, 0); F.inner.add(sd); });
    if(o.coat !== false){ const collar = new THREE.Mesh(new THREE.BoxGeometry(F.w + 0.1, 0.12, F.d + 0.1), coatM); collar.position.y = F.top - 0.06; F.inner.add(collar); }
    /* the cigarette */
    const cig = new THREE.Group(); cig.position.set(0.08, F.faceY - 0.08, F.d/2 + 0.08); F.inner.add(cig);
    const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.09, 6), new THREE.MeshStandardMaterial({ color:0xf2efe6, roughness:0.8 })); stick.rotation.z = Math.PI/2 - 0.3; stick.rotation.y = -0.6; cig.add(stick);
    const ember = new THREE.Mesh(new THREE.SphereGeometry(0.01, 6, 4), new THREE.MeshBasicMaterial({ color:0xff6020, toneMapped:false })); ember.position.set(0.04, 0.012, 0.03); cig.add(ember);
    this.ember = ember; this.cig = cig;
    /* the scratched-off name tag */
    const ntc = canvas(128, 32), ng = ntc.getContext('2d'); ng.fillStyle = '#c9a04a'; ng.fillRect(0, 0, 128, 32); ng.strokeStyle = '#6a5020'; ng.lineWidth = 2; for(let i=0;i<14;i++){ ng.beginPath(); ng.moveTo(10 + Math.random()*100, 4); ng.lineTo(10 + Math.random()*100, 28); ng.stroke(); }
    const tag = new THREE.Mesh(new THREE.PlaneGeometry(0.13, 0.035), new THREE.MeshStandardMaterial({ map:tex(ntc), metalness:0.8, roughness:0.4 })); tag.position.set(F.w*0.25, (F.faceY || 1.4) - 0.35, F.d/2 + 0.075); F.inner.add(tag);
    /* gold bar armor, strapped on for the fight */
    const goldM = new THREE.MeshStandardMaterial({ color:0xf0c040, roughness:0.18, metalness:1, emissive:0x2a1a00, emissiveIntensity:0.3 });
    this.plates = [];
    const pg = new THREE.Group(); pg.visible = false; F.inner.add(pg); this.plateGroup = pg;
    [[-0.14, 0.62], [0.14, 0.62], [-0.14, 0.9], [0.14, 0.9], [-0.14, 1.18], [0.14, 1.18]].forEach(([x, y])=>{ const m = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.25, 0.06), goldM); m.position.set(x, y, F.d/2 + 0.16); pg.add(m); this.plates.push({ m, hp:70, on:true }); });
    const strap = new THREE.Mesh(new THREE.BoxGeometry(F.w + 0.08, 0.04, F.d + 0.36), new THREE.MeshStandardMaterial({ color:0x111, roughness:0.8 })); strap.position.y = 0.9; pg.add(strap);
    /* his gun */
    const gm = new THREE.MeshStandardMaterial({ color:0x1d1f22, roughness:0.35, metalness:0.9 });
    const gun = new THREE.Group(); gun.add(new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.32, 0.07), gm)); gun.children[0].position.y = -0.12;
    const muzzle = new THREE.Object3D(); muzzle.position.set(0, -0.3, 0); gun.add(muzzle);
    const flash = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 6), new THREE.MeshBasicMaterial({ color:0xffc070, toneMapped:false })); flash.visible = false; muzzle.add(flash);
    F.armR.add(gun); gun.position.set(0, -0.36, 0.02);
    this.gun = gun; this.muzzle = muzzle; this.flash = flash;
    /* the duffel at his feet */
    const bagM = new THREE.MeshStandardMaterial({ color:0x1a1a1c, roughness:0.9 });
    const bag = new THREE.Group(); const bb = new THREE.Mesh(new THREE.CapsuleGeometry(0.17, 0.5, 4, 10), bagM); bb.rotation.z = Math.PI/2; bb.position.y = 0.18; bag.add(bb);
    const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.4, 8), gm); barrel.rotation.z = 1.2; barrel.position.set(0.15, 0.35, 0.05); bag.add(barrel);
    this.bag = bag;
    this.F = F;
    this.spot = o.spot || { x:-28.45, z:10.7, yaw:Math.PI/2 + 0.5 };
    F.group.position.set(this.spot.x, 0, this.spot.z); F.group.rotation.y = this.spot.yaw;
    bag.position.set(this.spot.x + 0.3, 0, this.spot.z + 0.75); bag.rotation.y = 0.4;
    C.scene.add(F.group); C.scene.add(bag);
    /* he takes up room */
    this.col = C.collide.circle(this.spot.x, this.spot.z, 0.45, 'boss');
    this.mode = 'idle'; // idle | follow | hold | fight | down | gone
    this.path = null; this.pi = 0; this.repath = 0; this.helpCD = 2; this.talkCD = 20; this.smokeT = 0;
    this.hp = 1500; this.maxHp = 1500; this.phase = 0; this.vulnerable = false;
    this.cover = null; this.coverT = 0; this.fireCD = 1.5; this.burstLeft = 0; this.sees = false; this.losT = 0; this.seenT = 0;
    this.T = { range:[7, 15] }; this.flank = false; this.speed = 3.2;
    this.target = C.combat.add({ kind:'clement', cl:this, get alive(){ return this.cl.mode !== 'gone'; }, ray:(o, d, maxT)=>this.ray(o, d, maxT), hit:info=>this.hit(info), center:()=>new THREE.Vector3(F.group.position.x, 1.0, F.group.position.z), freeze:(v)=>this.freezeHit(v) });
    this.freeze = 0;
  }
  get pos(){ return this.F.group.position; }
  say(text, dur){ this.C.hud.say(this.name, text, dur); this.F.face.say(Math.min(4, text.length*0.05)); this.C.audio.heist && this.C.audio.heist.voice(text, true); }
  /* ---------- rays and pain ---------- */
  ray(o, d, maxT){
    if(this.mode === 'gone' || this.mode === 'idle') return null;
    const F = this.F, p = F.group.position, yaw = F.group.rotation.y;
    let best = null;
    if(this.vulnerable && this.plateGroup.visible){
      for(const pl of this.plates){
        if(!pl.on) continue;
        const w = new THREE.Vector3(); pl.m.getWorldPosition(w);
        const r = rayOBB(o.x, o.y, o.z, d.x, d.y, d.z, w.x, w.y, w.z, 0.075, 0.14, 0.05, yaw, maxT);
        if(r && (!best || r.t < best.t)){ best = { t:r.t, n:r.n, part:'plate', plate:pl }; maxT = r.t; }
      }
    }
    const down = this.mode === 'down';
    const r = rayOBB(o.x, o.y, o.z, d.x, d.y, d.z, p.x, down ? 0.35 : F.h/2 + 0.04, p.z, F.w/2 + 0.06, down ? 0.35 : F.h/2 + 0.04, F.d/2 + 0.12, yaw, maxT);
    if(r && (!best || r.t < best.t)){
      best = { t:r.t, n:r.n, part:'body' };
      const hp = new THREE.Vector3(o.x + d.x*r.t, o.y + d.y*r.t, o.z + d.z*r.t);
      if(!down && Math.abs(hp.y - F.faceY) < 0.18) best.part = 'face';
    }
    return best;
  }
  hit(info){
    const C = this.C, n = new THREE.Vector3(info.n[0], info.n[1], info.n[2]);
    if(!this.vulnerable){
      if(info.src === 'player' && this.mode !== 'idle'){ C.gore.sparks(info.point, 3, { speed:2 }); if(Math.random() < 0.5 && this.talkCD < 18){ this.say(pick(LINES.youHurt), 2); this.talkCD = 20; } }
      return { hit:false };
    }
    if(info.part === 'plate'){
      const pl = info.plate;
      pl.hp -= info.dmg; C.gore.sparks(info.point, 8, { dir:n, speed:4, col:'#ffd56a' }); C.audio.heist && C.audio.heist.hit('metal', info.point);
      if(pl.hp <= 0 && pl.on){ pl.on = false; pl.m.visible = false; const w = new THREE.Vector3(); pl.m.getWorldPosition(w); C.loot && C.loot.drop('gold', w, 1500, { pop:true, delay:0.8 }); C.bus.emit('clement', { k:'plate', left:this.plates.filter(p=>p.on).length }); }
      this.hp -= info.dmg*0.15;
      C.bus.emit('clement', { k:'hp' });
      return { hit:true };
    }
    let dmg = info.dmg*(info.part === 'face' ? 1.6 : 1);
    const armor = this.plates.filter(p=>p.on).length;
    if(armor && this.plateGroup.visible) dmg *= 0.45;
    if(this.mode === 'down') dmg = 0;
    this.hp -= dmg;
    C.gore.coolant(info.point, n, 5); if(Math.random() < 0.4) C.gore.blobBurst(info.point, 2, pick(['#b8160f', '#f4f4ee']), 0.6, true);
    if(info.pellet === 0 || Math.random() < 0.4) C.audio.heist && C.audio.heist.hit('fridge', info.point);
    this.F.face.set('hurt', 0.4); this.flinch = 0.7;
    if(Math.random() < 0.08 && this.talkCD < 15){ this.say(pick(LINES.boss1hit), 2); this.talkCD = 6; }
    C.bus.emit('clement', { k:'hp', crit:info.part === 'face' });
    return { hit:true, crit:info.part === 'face' };
  }
  freezeHit(v){ if(!this.vulnerable || this.mode === 'down') return; this.freeze = Math.min(100, this.freeze + v*0.35); }
  /* ---------- states ---------- */
  setMode(m){ this.mode = m; this.path = null; if(m !== 'idle') this.col.on = false; }
  armor(on){ this.plateGroup.visible = on; }
  goTo(x, z){ const nav = this.C.heist.nav; const p = this.pos; const path = nav.path(p.x, p.z, x, z, 6000); if(path && path.length){ this.path = path; this.pi = 1; return true; } this.path = null; return false; }
  walk(dt, speed){
    if(!this.path || this.pi >= this.path.length) return 0;
    const p = this.pos, wp = this.path[this.pi], dx = wp[0] - p.x, dz = wp[1] - p.z, dd = Math.hypot(dx, dz);
    if(dd < 0.2){ this.pi++; return 0; }
    const sp = speed*(1 - Math.min(0.7, this.freeze/140)), step = Math.min(dd, sp*dt);
    p.x += dx/dd*step; p.z += dz/dd*step;
    this.wantYaw = Math.atan2(dx, dz);
    return sp;
  }
  arrived(){ return !this.path || this.pi >= this.path.length; }
  fireAt(target, acc, dmg){
    const C = this.C, from = new THREE.Vector3(); this.muzzle.getWorldPosition(from);
    if(typeof target === 'string' && target !== 'player'){ this.flash.visible = true; this.flashT = 0.06; return; }
    if(target === 'player'){ C.combat.enemyFire(from, acc, dmg, { sound:'pistol', self:this.target, weapon:'pistol', vol:1 }); }
    else {
      /* he shoots enemies for you */
      const c = target.target.center(); const d = c.clone().sub(from).normalize();
      const hit = Math.random() < acc;
      const end = hit ? c : c.clone().add(new THREE.Vector3(R(-1, 1), R(-0.5, 1), R(-1, 1)));
      C.gore.tracer(from, end, { speed:240 }); C.audio.heist && C.audio.heist.gun('pistol', from, { vol:0.9 });
      if(hit) target.target.hit({ dmg, point:c, n:[-d.x, -d.y, -d.z], dir:d, weapon:'pistol', src:'clement', dist:from.distanceTo(c), pellet:0, pellets:1 });
    }
    this.flash.visible = true; this.flashT = 0.05;
  }
  update(dt, t){
    const C = this.C, F = this.F, p = this.pos, cam = C.camera.position;
    F.face.update(dt, p.distanceToSquared(cam) < 400);
    this.talkCD -= dt;
    if(this.flashT > 0){ this.flashT -= dt; if(this.flashT <= 0) this.flash.visible = false; }
    /* the cigarette */
    this.smokeT -= dt; if(this.smokeT <= 0 && this.mode !== 'gone'){ this.smokeT = R(0.6, 1.4); const w = new THREE.Vector3(); this.ember.getWorldPosition(w); C.gore.smokePuff(w, 1, 0.04); }
    this.ember.material.color.setHSL(0.05, 1, 0.45 + Math.sin(t*3)*0.1);
    if(this.freeze > 0) this.freeze = Math.max(0, this.freeze - dt*15);
    if(this.flinch > 0) this.flinch -= dt*3;
    let moving = 0;
    const toYaw = Math.atan2(cam.x - p.x, cam.z - p.z);
    this.wantYaw = undefined;
    if(this.mode === 'idle'){
      /* never quite faces you */
      const d2 = p.distanceToSquared(cam);
      const want = d2 < 36 ? toYaw + 0.65 : this.spot.yaw;
      F.group.rotation.y += angDiff(want, F.group.rotation.y)*Math.min(1, dt*2);
      F.armBusy = true; F.armR.rotation.x = -0.25; F.armL.rotation.x = -1.9 + Math.sin(t*0.6)*0.1; F.armL.rotation.z = -0.9;
      if(Math.random() < dt*0.2) { F.armL.rotation.x = -2.2; }
    } else if(this.mode === 'follow'){
      const d = Math.hypot(cam.x - p.x, cam.z - p.z);
      this.repath -= dt;
      if(this.repath <= 0){ this.repath = 0.7; if(d > 4.5){ const back = new THREE.Vector3(Math.sin(C.player.yaw), 0, Math.cos(C.player.yaw)); this.goTo(cam.x + back.x*2.4, cam.z + back.z*2.4); } else this.path = null; }
      moving = this.walk(dt, d > 9 ? 4.6 : 2.8);
      if(!moving) this.wantYaw = toYaw + 0.5;
      F.armBusy = true; F.armR.rotation.x += (-0.25 - F.armR.rotation.x)*dt*4;
      if(this.talkCD <= 0 && d < 7 && C.player.mode === 'walk'){ this.talkCD = R(25, 45); this.say(pick(LINES.follow)); }
    } else if(this.mode === 'hold' || this.mode === 'helper'){
      if(this.holdAt && (!this.path || this.arrived())){ const dd = Math.hypot(this.holdAt[0] - p.x, this.holdAt[1] - p.z); if(dd > 0.6 && !this.path) this.goTo(this.holdAt[0], this.holdAt[1]); }
      moving = this.walk(dt, 3.6);
      /* help: shoot at the nearest enemy he can see */
      this.helpCD -= dt;
      const E = C.enemies;
      let tgt = null, bd = 1e9;
      if(E){ for(const e of E.list){ if(!e.alive) continue; const ep = e.F.group.position, d = ep.distanceToSquared(p); if(d < 400 && d < bd){ bd = d; tgt = e; } } }
      if(tgt){ this.wantYaw = Math.atan2(tgt.F.group.position.x - p.x, tgt.F.group.position.z - p.z); F.armBusy = true; F.armR.rotation.x += (-1.6 - F.armR.rotation.x)*dt*8;
        if(this.helpCD <= 0){ this.helpCD = R(0.9, 1.6); const ep = tgt.F.group.position; if(los(C.collide, p.x, 1.3, p.z, ep.x, 1.2, ep.z)){ this.fireAt(tgt, 0.6, 22); if(tgt.hp <= 0 && Math.random() < 0.3 && this.talkCD < 10){ this.say(pick(LINES.kill), 1.5); this.talkCD = 12; } } } }
      else { if(!moving) this.wantYaw = this.holdYaw !== undefined ? this.holdYaw : toYaw; F.armR.rotation.x += (-0.4 - F.armR.rotation.x)*dt*3; }
    } else if(this.mode === 'fight'){
      moving = this.fight(dt, t);
    } else if(this.mode === 'script'){
      moving = this.walk(dt, this.scriptSpeed || 3);
    } else if(this.mode === 'down'){
      /* crawling for the door */
      this.crawlT = (this.crawlT || 0) + dt;
      const k = Math.min(1, this.crawlT*1.5);
      F.inner.rotation.x = k*Math.PI/2*0.92; F.inner.position.y = k*F.d/2; F.inner.position.z = k*F.d/2;
      if(this.crawlT > 1){ const dz = 21 - p.z; if(dz > 0.5){ p.z += dt*0.18; p.x += (0 - p.x)*dt*0.05; } F.armL.rotation.x = -3 + Math.sin(t*3)*0.6; F.armR.rotation.x = -3 + Math.sin(t*3 + Math.PI)*0.6; }
      if(Math.random() < dt*5) C.gore.sparks(p.clone().setY(0.6), 2, { speed:2 });
    }
    if(this.wantYaw !== undefined) F.group.rotation.y += angDiff(this.wantYaw, F.group.rotation.y)*Math.min(1, dt*6);
    if(this.mode !== 'idle' && this.mode !== 'down' && this.mode !== 'gone') animateFridge(F, t, moving, {});
    if(this.flinch > 0){ F.inner.rotation.x = -this.flinch*0.15; }
    else if(this.mode !== 'down') F.inner.rotation.x *= 0.85;
    if(this.mode !== 'idle' && this.mode !== 'gone') C.collide.resolve(p, 0.4);
    /* phase three: falling apart */
    if(this.phase >= 3 && this.mode === 'fight'){ if(Math.random() < dt*4) C.gore.sparks(p.clone().setY(1.2), 3, { speed:3 }); if(F.door) F.door.rotation.y = -0.9 + Math.sin(t*5)*0.15; }
  }
  /* ---------- the boss fight brain ---------- */
  fight(dt, t){
    const C = this.C, p = this.pos, cam = C.camera.position, F = this.F, E = C.enemies;
    if(this.freeze > 80){ F.face.set('shock', 0.5); return 0; }
    this.coverT -= dt; this.losT -= dt;
    if(this.losT <= 0){ this.losT = 0.25; this.sees = los(C.collide, p.x, 1.45, p.z, cam.x, cam.y - 0.15, cam.z); }
    if(this.sees) this.seenT += dt; else this.seenT = Math.max(0, this.seenT - dt);
    if(this.fightAt){ /* phase-scripted spot */
      if(!this.path && Math.hypot(this.fightAt[0] - p.x, this.fightAt[1] - p.z) > 1) this.goTo(this.fightAt[0], this.fightAt[1]);
    } else if((!this.cover || this.coverT <= 0) && E){
      const c = E.chooseCover(this);
      if(c){ this.cover = c; this.coverT = R(4, 7); this.goTo(c[0], c[1]); }
      else this.coverT = 1;
    }
    const moving = this.walk(dt, this.phase >= 3 ? 1.6 : this.speed);
    this.wantYaw = this.sees ? Math.atan2(cam.x - p.x, cam.z - p.z) : this.wantYaw;
    F.armBusy = true; F.armR.rotation.x += ((this.sees ? -1.6 : -0.5) - F.armR.rotation.x)*Math.min(1, dt*8);
    this.fireCD -= dt;
    if(this.sees && this.fireCD <= 0){
      if(this.burstLeft <= 0) this.burstLeft = this.phase >= 3 ? 6 : 3;
      const acc = (this.phase >= 3 ? 0.28 : 0.42)*(this.seenT < 0.6 ? 0.4 : 1)*(C.player.walkAmt > 0.5 ? 0.75 : 1);
      this.fireAt('player', acc, this.phase >= 3 ? 7 : 9);
      this.burstLeft--;
      this.fireCD = this.burstLeft > 0 ? (this.phase >= 3 ? 0.14 : 0.24) : R(1.1, 1.8);
      if(this.talkCD <= 0 && Math.random() < 0.2){ this.talkCD = R(8, 14); this.say(pick(this.phase >= 3 ? LINES.boss3 : LINES.boss1)); }
    }
    return moving;
  }
  dispose(){ const C = this.C; C.scene.remove(this.F.group); C.scene.remove(this.bag); C.combat.remove(this.target); this.col.on = false; }
}
