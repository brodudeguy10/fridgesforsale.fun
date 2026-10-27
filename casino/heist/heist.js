/* ============================================================
   FRIDGE PALACE HEIST: the job
   loads every heist system, runs the story (and heat mode),
   keeps your coolant, your bag and your checkpoints, and hands
   the escape to the main site when you go through the doors.

   the story, in order:
     clement by the restrooms → the duffel → pull a gun whenever
     → EVERYBODY GET DOWN → rob the floor / doug / the tables →
     security → blow the cage gate → drill the vault (it jams) →
     loot → clement takes the bag and slams the door → gus's freon
     → freeze the hinges, shoot them → clement in gold armor →
     he runs for the security room and kills the lights → he
     limps for the front door → finish it (or someone else does)
     → the bag → the front door → upstairs.
============================================================ */
import * as THREE from '../lib/three.module.min.js';
import { Combat } from './combat.js';
import { Gore } from './gore.js';
import { Loot } from './loot.js';
import { HeistAudio } from './heist-audio.js';
import { Enemies, TYPES } from './enemies.js';
import { Arsenal } from './weapons.js';
import { WEAPONS } from './guns.js';
import { Crowd } from './crowd.js';
import { Vault } from './vault.js';
import { Clement, LINES } from './clement.js';
import { Destruct } from './destruct.js';
import { HeistHud, fmt } from './heist-hud.js';
import { NavGrid } from './nav.js';
import { applyAftermath, stageFor, detectorTick } from './aftermath.js';
import { Heat } from './heat.js';
import { plate as plateTex } from '../world/textures.js';
import { rayOBB } from './combat.js';

const R = (a, b)=>a + Math.random()*(b - a);
const pick = a=>a[(Math.random()*a.length)|0];

/* the bouncer fights */
TYPES.bouncer = { hp:280, speed:3.6, acc:0, dmg:16, melee:true, style:'tall', color:['#111114'], eye:'#ff5a5a', acc2:['headset'], loot:1 };

export async function init(C){
  C.combat = new Combat(C);
  C.gore = new Gore(C);
  C.loot = new Loot(C);
  C.audio.heist = new HeistAudio(C.audio);
  const H = new Heist(C);
  C.heist = H;
  C.enemies = new Enemies(C, H.nav);
  C.arsenal = new Arsenal(C);
  C.crowd = new Crowd(C);
  C.vault = new Vault(C);
  C.hh = new HeistHud(C);
  H.stage = stageFor(C.save.d);
  try{ applyAftermath(C, H.stage); }catch(e){ console.warn('aftermath', e); }
  H.setupWorld();
  /* warm-up: one of every enemy and every gun, so the loader compiles their shaders
     now instead of mid-firefight */
  try{
    ['guard', 'cop', 'copShotgun', 'rusher', 'swat', 'heavy', 'bouncer'].forEach((t, i)=>{ const e = C.enemies.spawn(t, -20 + i*2, -30); e.F.group.position.y = -40; H.warm.push(e); });
    const A = C.arsenal; ['revolver', 'shotgun', 'smg', 'freon'].forEach(k=>{ const m = A.model(k); m.group.visible = true; m.flash.visible = true; });
    A.root.visible = true;
    { const r = C.engine.renderer, prev = r.getRenderTarget(); r.setRenderTarget(C.engine.composer.renderTarget1); try{ r.compile(C.engine.vmScene, C.engine.vmCamera); } finally { r.setRenderTarget(prev); } }
    ['revolver', 'shotgun', 'smg', 'freon'].forEach(k=>{ const m = A.model(k); m.group.visible = false; m.flash.visible = false; });
    A.root.visible = false;
    const ice = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.1), C.enemies.iceM); ice.position.y = -40; C.scene.add(ice); H.warmMeshes = [ice];
  }catch(e){ console.warn('warm-up', e); }
  /* build the enemy grid behind the loading screen; later rebuilds only redo what changed */
  try{ H.navBuild(); H.navDirty = false; }catch(e){ console.warn('nav', e); }
  return H;
}

class Heist {
  constructor(C){
    this.C = C; this.name = 'heist';
    this.nav = new NavGrid(C.collide, { forbid:(x, z)=>z > 21.55 || (x > 30.1 && (z < 14.6 || z > 20.4)) || Math.hypot(x, z + 1) < 2.6 });
    this.state = 'idle'; this.tok = 0;
    this.hp = 100; this.maxHp = 100; this.bandages = 1; this.healT = 0;
    this.loot = { floor:0, cage:0, tables:0, slots:0, vault:0, gold:0 }; this.weight = 0; this.bagTaken = 0;
    this.alarm = false; this.objs = []; this.objTitle = '';
    this.waiters = []; this.waves = [];
    this.mode = 'story'; this.diff = 1; this.lootMul = 1; this.fearMul = 1;
    this.navDirty = true; this.t = 0;
    this.stats = { start:0, kills:0, civ:0, shots:0 };
    this.saveH = C.save.d.heist;
    this.warm = [];
  }
  /* ---------- the world bits ---------- */
  setupWorld(){
    const C = this.C, S = this.saveH;
    /* who's by the restrooms tonight */
    const stage = this.stage;
    const storyOpen = S.story < 3 && (stage.n === 0 || stage.n >= 3);
    if(storyOpen){
      this.clement = new Clement(C);
      C.clement = this.clement;
      if(S.story === 2) S.story = 1;
      C.world.interact.push({ pos:this.clement.pos.clone().setY(1.5), r:2.6, text:()=>this.clement.mode === 'idle' ? (S.story >= 1 ? 'talk to clement' : 'talk to the guy by the restrooms') : (this.state === 'armed' ? 'talk to clement' : null), enabled:()=>this.clement && (this.clement.mode === 'idle' || (this.state === 'armed' && this.clement.pos.distanceTo(C.camera.position) < 3)), use:()=>this.talkClement() });
    }
    /* heat mode: a payphone where he used to stand */
    if(S.story >= 3){ this.heat = new Heat(C, this); }
    C.destruct = new Destruct(C);
    /* police lights outside the doors, for later */
    const pl = new THREE.Group(); pl.visible = false; C.scene.add(pl); this.policeLights = pl;
    [[-6, 26], [5, 27], [-1, 29], [9, 25]].forEach(([x, z], i)=>{ const r = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 0.6), new THREE.MeshBasicMaterial({ color:i % 2 ? 0xff1a1a : 0x1a3aff, toneMapped:false, transparent:true, opacity:0.9, side:THREE.DoubleSide })); r.position.set(x, 1.4, z); pl.add(r); const b = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 0.6), new THREE.MeshBasicMaterial({ color:i % 2 ? 0x1a3aff : 0xff1a1a, toneMapped:false, transparent:true, opacity:0.9, side:THREE.DoubleSide })); b.position.set(x + 1.7, 1.4, z); pl.add(b); });
    /* a flashlight for the dark (not on phones: an extra light costs too much) */
    if(C.engine.preset() !== 'low'){ const fl = new THREE.SpotLight(0xfff2dd, 0, 26, 0.42, 0.5, 1.4); fl.position.set(0.15, -0.1, 0); C.camera.add(fl); fl.target.position.set(0, 0, -1); C.camera.add(fl.target); this.flashlight = fl; }
    /* the panic button on the column by the cage */
    const pb = new THREE.Group(); pb.position.set(6, 1.3, 13.48); C.scene.add(pb);
    pb.add(new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.22, 0.06), new THREE.MeshStandardMaterial({ color:0xd8c050, roughness:0.4 })));
    const btn = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.05, 14), new THREE.MeshBasicMaterial({ color:0xff1a1a, toneMapped:false })); btn.rotation.x = Math.PI/2; btn.position.z = 0.05; pb.add(btn);
    this.panicPos = [6, 13.9];
    /* keys */
    C.bus.on('key', e=>this.key(e));
    this._wheel = e=>{ if(!C.input.locked || !C.arsenal.drawn) return; C.arsenal.cycle(e.deltaY > 0 ? 1 : -1); };
    document.addEventListener('wheel', this._wheel, { passive:true });
    C.bus.on('draw', ()=>{ if(this.state === 'armed' && !C.seated) this.goLoud(); });
    C.bus.on('kill', e=>{ this.stats.kills++; this.saveH.kills++; });
    C.bus.on('civkill', ()=>{ this.stats.civ++; this.saveH.civKills++; if(this.clement && this.clement.mode !== 'fight' && Math.random() < 0.5) this.clement.say(pick(['easy, psycho. dead people don\'t hand over wallets.', 'was that necessary? don\'t answer.', 'they were lying down!'])); });
    C.bus.on('chandelier', e=>{ if(e.stage === 'land'){ C.save.d.heist.chandelier = true; const cl = this.clement; if(cl && cl.vulnerable && cl.pos.distanceTo(e.pos) < 2.6 && cl.mode === 'fight'){ cl.hp = 0; cl.crushed = true; this.toast('CRUSHED.'); C.save.egg('crushed'); } for(const en of C.enemies.list){ if(en.alive && en.F.group.position.distanceTo(e.pos) < 2.4) en.target.hit({ dmg:999, point:en.target.center(), n:[0, 1, 0], dir:new THREE.Vector3(0, -1, 0), weapon:'chandelier', explosion:true }); } if(C.camera.position.distanceTo(e.pos) < 2.2) this.hurt(45, e.pos, 'chandelier'); } });
    C.bus.on('aquarium', ()=>C.save.egg('aquarium') && this.toast('secret: free the fish'));
    C.bus.on('slotbust', ()=>{ if(C.destruct.slotsBusted >= 10 && C.save.egg('slotbuster')) this.toast('secret: hand pay'); });
    C.bus.on('heistcall', e=>{ if(e.k === 'coil') this.toast('THE COIL IS BLOWN'); });
    this.eggs();
    /* robbing: one interactable that follows whoever is nearest */
    const robI = { heist:true, pos:new THREE.Vector3(), r:2.8, enabled:()=>{ if(!C.crowd.active) return false; const n = C.crowd.nearestRobbable(); if(n){ robI.pos.copy(n.F.group.position).setY(0.4); robI.n = n; } return !!n; }, text:()=>robI.n ? 'rob ' + robI.n.name : null, use:()=>{ if(robI.n) C.crowd.rob(robI.n); } };
    C.world.interact.push(robI);
    /* doug and the bag */
    const K = C.world.cage;
    C.world.interact.push({ heist:true, pos:new THREE.Vector3(12.0, 1.35, 17.5), r:3, enabled:()=>C.crowd.active && !this.dougDone && !this.dougBusy && K.doug.heist && K.doug.heist.alive && (this.state === 'loud'), text:()=>'make doug fill a bag', use:()=>this.dougFill() });
    /* chip trays at the tables */
    this.trays = [];
    const tables = [].concat((C.games.blackjack ? C.games.blackjack.tables : []).filter(t=>!t.a.vip), (C.games.roulette ? C.games.roulette.tables : []).filter(t=>!t.a.vip));
    if(C.games.poker && C.games.poker.grp) tables.push({ grp:C.games.poker.grp, poker:true });
    tables.forEach(T=>{ T.grp.updateMatrixWorld(true); const w = new THREE.Vector3(0, 1.0, -0.6).applyMatrix4(T.grp.matrixWorld); const tr = { pos:w, done:false, v:Math.round(R(600, 1300)) }; this.trays.push(tr); C.world.interact.push({ heist:true, pos:w, r:2.6, enabled:()=>C.crowd.active && !tr.done && this.state === 'loud', text:()=>'grab the chip tray', use:()=>{ tr.done = true; C.audio.chipStack(w); C.fx.coins(w, 20); this.addLoot(Math.round(tr.v*this.lootMul), 'tables'); this.toast('+' + fmt(tr.v*this.lootMul) + ' · chip tray'); this.refreshObj(); } }); });
    /* telling clement to blow the gate */
    C.world.interact.push({ heist:true, pos:new THREE.Vector3((K.GX0 + K.GX1)/2, 1.4, K.z0 - 1.2), r:3.2, enabled:()=>this.state === 'loud' && this.atGate, text:()=>'tell ' + (this.partnerName || 'clement') + ' to blow the gate', use:()=>{ this.atGate = false; this.fire('gate'); } });
    /* finish clement / take the bag */
    C.world.interact.push({ heist:true, pos:new THREE.Vector3(), r:2.6, enabled:()=>{ const cl = this.clement; if(!cl || cl.mode !== 'down' || this.finished) return false; this._fin = this._fin || C.world.interact[C.world.interact.length - 1]; return true; }, text:()=>'finish it', use:()=>this.fire('finish') });
    this.finI = C.world.interact[C.world.interact.length - 1];
    C.world.interact.push({ heist:true, pos:new THREE.Vector3(), r:2.4, enabled:()=>!!this.bagOnFloor, text:()=>'take the bag', use:()=>this.fire('bag') });
    this.bagI = C.world.interact[C.world.interact.length - 1];
    /* the pause menu's leave button asks first during a job */
    const hud = C.hud, origPause = hud.pause.bind(hud);
    hud.pause = (on)=>{ origPause(on); if(on && this.state === 'dead'){ const b = hud.$('#fp-pause [data-a="leave"]'); if(b){ b.textContent = 'WALK AWAY'; b.onclick = ()=>{ hud.pause(false); C.hh.card(null); this.abandon(true); }; } const p = hud.$('#fp-pause [data-a="photo"]'); if(p) p.style.display = 'none'; }
      if(on && this.isLoud()){ const b = hud.$('#fp-pause [data-a="leave"]'); if(b){ b.textContent = 'ABANDON THE JOB'; b.onclick = ()=>{ hud.pause(false); this.abandonPrompt(); }; } const p = hud.$('#fp-pause [data-a="photo"]'); if(p) p.style.display = 'none'; } };
  }
  /* ---------- small things for people who poke at everything ---------- */
  eggs(){
    const C = this.C;
    /* six gold plates, all of them */
    C.bus.on('clement', e=>{ if(e.k === 'plate' && e.left === 0 && this.mode !== 'heat'){ if(this.clement) this.clement.say('that was MY gold. i was going to be buried in it.', 2.5); if(C.save.egg('bullion')) this.toast('secret: gold standard'); } });
    /* the night guard sleeps through the robbery, unless you fire next to his ear */
    const guard = C.staff.find(F=>F.name === 'NIGHT GUARD');
    C.bus.on('gunshot', e=>{
      if(!guard || this._guardUp || !this.isLoud() || !e.pos || (e.src !== 'player' && !e.loud)) return;
      if(guard.group.position.distanceTo(e.pos) > 4.5) return;
      this._guardUp = true; guard.face.set('shock', 2.2); guard.face.say(2);
      C.hud.say('NIGHT GUARD', 'huh. is it my shift. it\'s not my shift. wake me up if anybody robs the place.', 4.5);
      setTimeout(()=>{ try{ guard.face.set('sleepy', 1e9); }catch(err){} }, 2600);
      if(C.save.egg('slept')) this.toast('secret: slept through it');
    });
    /* the smallest fridge in the palace has been waiting for this */
    const tiny = C.staff.find(F=>F.group && F.group.scale.x < 0.2 && F.group.position.x > 29);
    if(tiny){
      const t = { kind:'tiny', alive:true, center:()=>new THREE.Vector3(29.75, 0.08, tiny.group.position.z),
        ray:(o, d, maxT)=>{ if(!t.alive || !tiny.group.visible) return null; const r = rayOBB(o.x, o.y, o.z, d.x, d.y, d.z, 29.75, 0.08, tiny.group.position.z, 0.06, 0.09, 0.08, 0, maxT); return r ? { t:r.t, n:r.n, part:'tiny' } : null; },
        hit:()=>{ if(!t.alive) return { hit:false }; t.alive = false; tiny.face.set('angry', 3);
          C.tweens.sleep(0.5).then(()=>{ const from = new THREE.Vector3(29.7, 0.1, tiny.group.position.z); C.gore.tracer(from, C.camera.position.clone().add(new THREE.Vector3(0, -0.3, 0)), { speed:120, thick:0.3 }); C.audio.heist && C.audio.heist.click(4200, 0.15); this.hurt(1, from, 'tiny'); C.hud.say('', 'the smallest gun you have ever seen. it does exactly one point of damage. it looked like it needed that.', 4); if(C.save.egg('tinyrevenge')) this.toast('secret: small arms'); return C.tweens.add({ dur:0.6, update:k=>{ tiny.group.position.x = 29.86 + k*0.3; } }); }).then(()=>{ tiny.group.visible = false; });
          return { hit:true }; } };
      C.combat.add(t);
    }
    /* box 38, for the king */
    const V = C.vault;
    if(V && V.room){
      const m = new THREE.Mesh(new THREE.PlaneGeometry(0.29, 0.29), new THREE.MeshStandardMaterial({ map:plateTex('38', { w:128, h:128, size:64, bg:'#5a1010', fg:'#ffd56a', rim:'#ffd56a' }), roughness:0.4, metalness:0.5 }));
      m.position.set(36.98, 0.62, 18.9); m.rotation.y = -Math.PI/2; V.room.add(m);
      let opened = false;
      C.world.interact.push({ heist:true, pos:new THREE.Vector3(36.6, 0.7, 18.9), r:1.8, enabled:()=>!opened && (V.state === 'open' || V.state === 'slammed' || V.state === 'fallen'), text:()=>'open box 38', use:()=>{
        opened = true; m.rotation.y = -Math.PI/2 + 1.2; m.position.x -= 0.1;
        C.audio.heist && C.audio.heist.click(1800, 0.3);
        this.addLoot(3800, 'vault');
        C.hud.say('', 'box 38. one revolver round and a folded note: "for the king." whoever rented this box paid forty years up front.', 5);
        this.toast('+3,800 · box 38');
        if(C.save.egg('kingsbox')) this.toast('secret: for the king');
      } });
    }
  }
  isLoud(){ return ['loud', 'breach', 'drill', 'vault', 'betray', 'locked', 'boss1', 'boss2', 'boss3', 'down', 'escape'].indexOf(this.state) >= 0; }
  panicSpot(){ return this.panicPos; }
  toast(t){ this.C.hud.toast(t, 'gold'); }
  /* ---------- talking to clement ---------- */
  async talkClement(){
    const C = this.C, cl = this.clement, S = this.saveH;
    if(this.talking) return; this.talking = true;
    try{
      if(this.state === 'armed'){ cl.say(pick(LINES.armed)); return; }
      C.hh.letterbox(true);
      if(S.story === 0){ for(const l of LINES.intro){ cl.say(l, l.length*0.055 + 1); await C.tweens.sleep(l.length*0.055 + 0.6); } S.story = 1; C.save.write(); }
      else { cl.say(S.abandoned ? 'round two? bag\'s still packed. so am i.' : 'you came back. the offer stands. the vault\'s still full.', 3.5); await C.tweens.sleep(2.2); }
      let ch = await C.hh.choice(['i\'m in.', 'what\'s in it for me?', 'not tonight.']);
      if(ch === 1){ cl.say(LINES.why, 4); await C.tweens.sleep(3); ch = await C.hh.choice(['i\'m in.', 'not tonight.']); ch = ch === 0 ? 0 : 2; }
      if(ch === 2){ cl.say(pick(LINES.no), 3); C.hh.letterbox(false); return; }
      cl.say(LINES.yes, 2.5); await C.tweens.sleep(1);
      C.hh.letterbox(false);
      await this.duffel();
      this.arm();
    } finally { this.talking = false; }
  }
  async duffel(){
    const C = this.C;
    const bar = (v, m)=>`<span style="width:${Math.round(v/m*80)}px"></span>`;
    const guns = ['revolver', 'shotgun', 'smg'].map(k=>{ const W = WEAPONS[k]; return `<div class="gun"><b>${W.name}</b><i>${W.kind.toUpperCase()} · ${W.slot}</i><div class="st">damage ${bar(W.dmg*W.pellets, 140)}<br>rate ${bar(1/W.rof, 14)}<br>mag ${W.mag} · spare ${W.reserve}</div></div>`; }).join('');
    await C.hh.duffel(`<h2>CLEMENT'S DUFFEL</h2><div style="opacity:.7;letter-spacing:2px;font-size:13px">three guns, a mask that doesn't fit, and a brick of something that shouldn't be in a casino.</div><div class="g">${guns}</div>
      <div class="keys">${C.input.touch ? 'SWAP draws a gun · FIRE · AIM · RLD reloads · DUCK · YELL keeps the room down · HEAL uses a cold pack · tap people on the floor to rob them' : '<b>1 2 3</b> draw a gun · <b>Q</b> last gun · <b>H</b> holster · <b>left click</b> fire · <b>right click</b> aim · <b>R</b> reload · <b>C</b> duck · <b>F</b> yell · <b>G</b> cold pack · <b>E</b> rob / use · <b>V</b> look at it'}</div>
      <div class="keys" style="margin-top:8px;color:#ffd56a">the job starts the moment you draw. no rush.</div>
      <button data-go="1">TAKE THEM</button>`);
  }
  arm(){
    const C = this.C, A = C.arsenal;
    ['revolver', 'shotgun', 'smg'].forEach(k=>A.give(k, true));
    this.state = 'armed'; this.saveH.story = 2; C.save.write();
    this.navBuild();
    this.clement.setMode('follow');
    C.hh.show(true);
    this.setObj('THE JOB', [{ t:C.input.touch ? 'press SWAP to draw a gun. the job starts when you do' : 'draw a gun (1, 2, 3). the job starts when you do' }, { t:'clement follows you until then', opt:true }]);
    this.clement.say(pick(LINES.armed), 4);
    C.audio.heist.renderScore('tense'); C.audio.heist.renderScore('action');
    C.hh.ammo(A);
  }
  /* ---------- keys ---------- */
  key(e){
    const C = this.C, A = C.arsenal;
    if(!C.open || C.hud.paused || C.hud.modalOpen || C.seated) return;
    /* number keys belong to photo mode filters and dialogue answers while those are up */
    if(C.photo || (C.hh && C.hh.el.classList.contains('choosing'))) return;
    if(!A.order.length) return;
    const m = /^Digit([1-4])$/.exec(e.code);
    if(m){ const k = A.order.find(k=>WEAPONS[k].slot === +m[1]); if(k) A.select(k); return; }
    if(e.code === 'KeyQ'){ if(A.last && A.owned[A.last]) A.select(A.last); else A.cycle(1); }
    if(e.code === 'KeyH'){ A.holster(); }
    if((e.code === 'KeyC' || e.code === 'ControlLeft') && !C.photo){ C.player.crouch = !C.player.crouch; }
    if(e.code === 'KeyG'){ this.useBandage(); }
  }
  /* ---------- your coolant ---------- */
  hurt(dmg, from, kind){
    const C = this.C;
    if(this.state === 'dead' || this.state === 'out' || this.godT > 0) return;
    if(!this.isLoud() && this.state !== 'armed') return;
    if(this.cutscene && kind !== 'scripted') return;
    dmg *= this.mode === 'heat' ? 1 + (this.heatLevel || 1)*0.08 : 1;
    this.hp -= dmg;
    C.hh.damageFrom(from || C.camera.position);
    C.player.addShake(Math.min(0.9, dmg*0.03));
    C.audio.heist.hurt();
    C.engine.finish.uniforms.uChroma.value = Math.min(0.008, C.engine.finish.uniforms.uChroma.value + dmg*0.0003);
    if(this.hp <= 0){ this.hp = 0; this.die(kind); }
  }
  useBandage(){
    const C = this.C;
    if(this.bandages <= 0 || this.hp >= this.maxHp || this.healT > 0) return;
    this.bandages--; this.healT = 1.4; this.healLeft = 48;
    C.audio.burst({ ff:3000, q:1, d:0.3, g:0.2 }); C.audio.burst({ ff:1200, q:1, d:0.2, g:0.15, t:0.25 });
    this.toast('cold pack. that\'s better.');
  }
  collect(it){
    const C = this.C, A = C.arsenal;
    if(!this.isLoud()) return false;
    if(it.kind === 'ammo'){
      let got = 0; const amt = { revolver:8, shotgun:5, smg:24 };
      for(const k of A.order){ if(amt[k]) got += A.addAmmo(k, amt[k]); }
      if(!got) return false;
      C.audio.heist.click(2200, 0.3); C.audio.heist.slide(0.05, true); this.toast('+ammo');
      return true;
    }
    if(it.kind === 'health'){
      if(this.bandages >= 3){ if(this.hp >= this.maxHp) return false; this.hp = Math.min(this.maxHp, this.hp + 30); }
      else this.bandages++;
      C.audio.burst({ ff:2400, q:1, d:0.15, g:0.2 }); this.toast('+cold pack');
      return true;
    }
    if(it.kind === 'chips' || it.kind === 'cash'){ this.addLoot(it.amount, it.src || 'floor'); C.audio.chip(it.g.position, 4); this.toast('+' + fmt(it.amount)); return true; }
    if(it.kind === 'gold'){ this.addLoot(it.amount, 'gold', 0.4); C.audio.heist.hit('metal', it.g.position); this.toast('+' + fmt(it.amount) + ' · gold bar'); return true; }
    return false;
  }
  addLoot(n, src, weight){
    this.loot[src] = (this.loot[src] || 0) + n;
    if(weight) this.weight += weight;
    this.C.bus.emit('loot', { n, src });
  }
  bagValue(){ return Object.values(this.loot).reduce((a, b)=>a + b, 0); }
  carryMul(){ return Math.max(0.62, 1 - this.weight*0.05); }
  canLootVault(){ return this.state === 'vault'; }
  /* ---------- objectives ---------- */
  setObj(title, list){ this.objFn = null; this.showObj(title, list); }
  showObj(title, list){ this.objTitle = title; this.objs = list; this.C.hh.objectives(list, title); }
  refreshObj(){ if(this.objFn) this.showObj(this.objTitle, this.objFn()); }
  /* ---------- waiting inside scripts ---------- */
  ok(tok){ return tok === this.tok && this.C.open; }
  async wait(sec, tok){ await this.C.tweens.sleep(sec); return this.ok(tok); }
  until(fn, tok){ return new Promise(res=>{ this.waiters.push({ fn, res, tok }); }); }
  fire(k){ this.flags = this.flags || {}; this.flags[k] = true; }
  flag(k){ return this.flags && this.flags[k]; }
  /* ---------- the vibe ---------- */
  vibe(kind){
    const C = this.C, U = C.engine.finish.uniforms;
    const to = kind === 'heist' ? { sat:0.5, grain:0.085, vig:1.15, tint:[0.95, 1.0, 1.06] } : kind === 'dark' ? { sat:0.35, grain:0.11, vig:1.35, tint:[1.2, 0.75, 0.75] } : kind === 'boss' ? { sat:0.6, grain:0.09, vig:1.2, tint:[1.05, 0.95, 0.92] } : { sat:1, grain:C.engine.preset() === 'low' ? 0.02 : 0.035, vig:0.9, tint:[1, 1, 1] };
    const s0 = U.uSat.value, g0 = U.uGrain.value, v0 = U.uVig.value, t0 = U.uTint.value.clone();
    C.tweens.add({ dur:1.2, update:k=>{ U.uSat.value = s0 + (to.sat - s0)*k; U.uGrain.value = g0 + (to.grain - g0)*k; U.uVig.value = v0 + (to.vig - v0)*k; U.uTint.value.set(t0.x + (to.tint[0] - t0.x)*k, t0.y + (to.tint[1] - t0.y)*k, t0.z + (to.tint[2] - t0.z)*k); } });
  }
  lightsMode(m){
    const C = this.C, W = C.world;
    if(!this._lightsSaved){ this._lightsSaved = W.lights.map(l=>[l, l.intensity, l.color.getHex()]); this._ambSaved = C.scene.children.filter(o=>o.isHemisphereLight || o.isAmbientLight).map(l=>[l, l.intensity]); }
    if(m === 'dark'){ W.lights.forEach(l=>{ l.intensity *= 0.12; l.color.setHex(0xff2a1a); }); this._ambSaved.forEach(([l, i])=>l.intensity = i*0.12); W.neon.forEach(n=>n.visible = false); if(this.flashlight) this.flashlight.intensity = 60; C.audio.heist.explosion(new THREE.Vector3(-12, 3, -16), 0.2); }
    else if(m === 'emergency'){ this._lightsSaved.forEach(([l, i, c])=>{ l.intensity = i*0.55; l.color.setHex(c); l.color.lerp(new THREE.Color(0xff5a4a), 0.35); }); this._ambSaved.forEach(([l, i])=>l.intensity = i*0.6); W.neon.forEach(n=>n.visible = Math.random() < 0.6); if(this.flashlight) this.flashlight.intensity = 25; }
    else { this._lightsSaved.forEach(([l, i, c])=>{ l.intensity = i; l.color.setHex(c); }); this._ambSaved.forEach(([l, i])=>l.intensity = i); W.neon.forEach(n=>n.visible = true); if(this.flashlight) this.flashlight.intensity = 0; }
  }
  tripAlarm(reason){
    const C = this.C;
    if(this.alarm) return; this.alarm = true; C.crowd.alarm = true;
    C.audio.heist.alarm(true);
    setTimeout(()=>C.audio.heist.sirens(true), 6000);
    this.policeLights.visible = true;
    C.hh.wire('LIVE · ARMED ROBBERY IN PROGRESS AT THE FRIDGE PALACE · POLICE RESPONDING · WITNESSES DESCRIBE "A FRIDGE WITH A GUN" AND "A SECOND, RUSTIER FRIDGE" · DO NOT APPROACH · FRDX NEON HALTED PENDING NEWS ·');
    try{ if(window.MKT && MKT.heistEvent) MKT.heistEvent('alarm'); }catch(e){}
    if(reason) this.toast('ALARM · ' + reason);
    C.bus.emit('alarm');
    if(this.state === 'loud' && !this.securityOut) this.securityWave();
  }
  /* ---------- enemy waves ---------- */
  spawnAt(type, from, o){
    const C = this.C, E = C.enemies;
    const spots = {
      front:()=>[R(-2.2, 2.2), 20.9], staff:()=>[R(-21.5, -19.2), -15.6], club:()=>[R(18.8, 21.2), -15.5],
      restroomM:()=>[-29.1, 9], restroomF:()=>[-29.1, 12.4], cage:()=>[R(14, 18), 15.2]
    };
    const [x, z] = (spots[from] || spots.front)();
    const e = E.spawn(type, x, z, Object.assign({ enterFrom:'door' }, o || {}));
    /* walk in a few steps before thinking */
    const inward = { front:[0, -3.5], staff:[0, 3.5], club:[0, 3.5], restroomM:[3, 0], restroomF:[3, 0], cage:[0, 0] }[from] || [0, 0];
    e.enterT = 0.9; E.goTo(e, x + inward[0] + R(-1, 1), z + inward[1]);
    if(from === 'front' && this.alarm){ C.audio.heist.shout(new THREE.Vector3(x, 1.6, z), true); }
    if(from === 'restroomM' || from === 'restroomF'){ C.gore.mistPuff(new THREE.Vector3(-29, 1.2, z), '#cfcac0', 6, { size:0.3 }); }
    return e;
  }
  queue(list){ list.forEach(w=>this.waves.push(w)); }
  maxAlive(){ return (this.C.engine.preset() === 'low' ? 6 : 9) + (this.mode === 'heat' ? Math.min(3, this.heatLevel || 0) : 0); }
  pumpWaves(dt){
    const E = this.C.enemies;
    if(!this.waves.length) return;
    this.waveT = (this.waveT || 0) - dt;
    if(this.waveT > 0) return;
    if(E.count() >= this.maxAlive()) return;
    const w = this.waves.shift();
    this.spawnAt(w.type, w.from, w.o);
    this.waveT = w.gap !== undefined ? w.gap : 0.7;
  }
  securityWave(){
    const C = this.C;
    if(this.securityOut) return; this.securityOut = true;
    if(C.world.staffDoor && !C.world.staffDoor.isOpen) C.world.staffDoor.open();
    this.navDirty = true;
    this.toast('SECURITY');
    this.queue([{ type:'guard', from:'staff' }, { type:'guard', from:'staff' }, { type:'guard', from:'staff', gap:1.5 }]);
    /* the bouncer has been waiting his whole life for this */
    const b = C.staff.find(F=>F.name === 'BOUNCER');
    if(b && b.heist && b.heist.alive){
      b.group.visible = false; C.combat.remove(b.heist.target);
      C.collide.circles.filter(c=>c.tag === 'bouncer').forEach(c=>c.on = false);
      if(C.world.vipRope) C.world.vipRope.on = false;
      const e = C.enemies.spawn('bouncer', b.group.position.x, b.group.position.z, { name:'THE BOUNCER' });
      e.F.face.shades = true; e.enterT = 0.3;
      C.hud.say('BOUNCER', 'you\'re not on the list.', 2);
    }
  }
  /* ---------- the story ---------- */
  async goLoud(){
    const C = this.C;
    this.state = 'loud'; C.heistLock = true;
    this.saveH.robbedVisit = C.save.d.visits; this.saveH.robbedAt = Date.now(); this.saveH.robbedKind = this.mode; C.save.write();
    this.stats.start = performance.now();
    this.navBuild();
    try{ if(window.MKT && MKT.heistEvent) MKT.heistEvent('start'); }catch(e){}
    this.checkpoint('loud');
    this.run('loud', true);
  }
  navBuild(){ this.nav.build(); this.navDirty = false; }
  checkpoint(name){
    const C = this.C, A = C.arsenal;
    this.cp = { name, hp:Math.max(this.hp, 70), bandages:Math.max(1, this.bandages), ammo:JSON.parse(JSON.stringify(A.ammo)), owned:A.order.slice(), loot:Object.assign({}, this.loot), weight:this.weight, bagTaken:this.bagTaken, pos:[C.player.pos.x, C.player.pos.z, C.player.yaw], cl:this.clement ? { hp:this.clement.hp, plates:this.clement.plates.map(p=>p.on) } : null };
  }
  run(stage, fresh){
    this.tok++; const tok = this.tok;
    this.flags = {};
    const fn = this['stage_' + stage];
    if(fn) fn.call(this, tok, fresh).catch(e=>console.error('heist stage', stage, e));
  }
  async stage_loud(tok, fresh){
    const C = this.C, cl = this.clement;
    if(fresh){
      C.hh.show(true);
      /* the band gets its plug pulled */
      C.audio.heist.tapeStop(C.audio.musSrc); C.audio.musSrc = null;
      C.audio.amb.gain.setTargetAtTime(0.15, C.audio.ctx ? C.audio.ctx.currentTime : 0, 0.5);
      if(cl){
        if(cl.pos.distanceTo(C.camera.position) > 10){ const back = new THREE.Vector3(Math.sin(C.player.yaw), 0, Math.cos(C.player.yaw)); const c = this.nav.nearest(C.player.pos.x + back.x*2.5, C.player.pos.z + back.z*2.5); if(c){ const [x, z] = this.nav.pos(c[0], c[1]); cl.pos.set(x, 0, z); } }
        cl.setMode('hold'); cl.holdAt = null;
        const m = new THREE.Vector3(); cl.muzzle.getWorldPosition(m);
        for(let i=0;i<2;i++){ cl.F.armR.rotation.x = -2.8; cl.fireAt('player-up'); const up = m.clone().add(new THREE.Vector3(R(-1, 1), 0, R(-1, 1))); up.y = 6.45; C.gore.tracer(m, up); C.gore.debrisBurst(up, 10, '#e8e0d0', new THREE.Vector3(0, -1, 0)); C.gore.mistPuff(up, '#e8e0d0', 4, { grav:2, size:0.2 }); C.audio.heist.gun('revolver', m, { vol:1.2 }); await C.tweens.sleep(0.32); }
        cl.say(LINES.loud, 2.5);
      }
      C.hh.big('EVERYBODY GET DOWN', 'the fridge palace job', '', 2600);
      C.audio.heist.shout(null, true);
      C.crowd.goLoud();
      this.vibe('heist');
      C.audio.heist.score('tense');
      if(!await this.wait(2.4, tok)) return;
      if(cl) cl.say(LINES.loud2, 5);
    }
    if(cl){ cl.setMode('hold'); cl.holdAt = [26.8, 12.5]; cl.holdYaw = Math.PI; }
    this.atGate = false;
    this.objFn = ()=>[
      { t:'keep the room scared (' + (C.input.touch ? 'YELL' : 'F to yell') + ', aim at people)' },
      { t:'rob the people on the floor · ' + C.crowd.robbed + ' robbed', opt:true },
      { t:'make doug fill a bag at the cage', opt:true, done:!!this.dougDone },
      { t:'grab the chip trays · ' + this.trays.filter(t=>t.done).length + '/' + this.trays.length, opt:true, done:this.trays.every(t=>t.done) },
      { t:this.atGate ? 'tell ' + (this.partnerName || 'clement') + ' to blow the gate (back of the cage)' : 'meet ' + (this.partnerName || 'clement') + ' at the back of the cage' }
    ];
    this.objTitle = 'THE JOB'; this.refreshObj();
    const t0 = this.t;
    await this.until(()=>{ if(cl && !this.atGate && cl.arrived() && cl.pos.distanceTo(new THREE.Vector3(26.8, 0, 12.5)) < 1.3){ this.atGate = true; this.refreshObj(); if(cl.pos.distanceTo(C.camera.position) < 12) cl.say(pick(LINES.atGate), 3); } if(!this.securityOut && this.t - t0 > 30) this.securityWave(); return this.flag('gate'); }, tok);
    if(!this.ok(tok)) return;
    this.run('breach', true);
  }
  async dougFill(){
    const C = this.C, K = C.world.cage, D = K.doug;
    this.dougBusy = true; D.heist.filling = true;
    C.hud.say('DOUG', pick(['okay okay okay. i have a family. a freezer. it\'s a family freezer.', 'filling it. filling it. please don\'t shoot the glass, it\'s rented.', 'you know they don\'t pay me enough for this. they don\'t pay me at all. i\'m a fridge.']), 4);
    let t = 0;
    const need = 8;
    while(t < need){
      await C.tweens.sleep(0.25); t += 0.25;
      if(!D.heist.alive){ this.dougBusy = false; this.toast('doug is in no shape to fill anything'); return; }
      if(C.crowd.fear <= 0 && !this.alarm){ D.heist.filling = false; this.dougBusy = false; this.dougDone = true; C.hud.say('DOUG', '...i may have leaned on the button. by accident. sorry.', 3); this.tripAlarm('doug leaned on the silent alarm'); return; }
      C.audio.chip(new THREE.Vector3(12, 1.2, 17.5), 2);
      this.setObjProgress && this.setObjProgress(t/need);
      if(Math.floor(t*4) % 8 === 0) C.hud.toast('doug is filling the bag · ' + Math.round(t/need*100) + '%');
    }
    D.heist.filling = false; this.dougBusy = false; this.dougDone = true;
    const v = Math.round(5200*this.lootMul);
    this.addLoot(v, 'cage'); this.toast('+' + fmt(v) + ' · doug\'s bag');
    C.hud.say('DOUG', 'there. that\'s all of it. that\'s most of it. that\'s all of it.', 3);
    this.refreshObj();
  }
  async stage_breach(tok){
    const C = this.C, cl = this.clement, K = C.world.cage;
    this.state = 'breach';
    this.setObj('THE GATE', [{ t:'get back from the gate!' }]);
    if(cl) cl.say(LINES.breach, 2.5);
    C.hh.big('FIRE IN THE HOLE', '', 'red', 1800);
    if(cl){ cl.setMode('script'); cl.goTo(21, 11.2); cl.scriptSpeed = 4; }
    await C.vault.breach();
    if(!this.ok(tok)) return;
    this.navDirty = true;
    this.tripAlarm('the vault sensors');
    C.audio.heist.score('action');
    if(!await this.wait(1.5, tok)) return;
    if(cl){ cl.say(LINES.postBreach, 4); cl.setMode('script'); cl.goTo(27.6, 16.6); }
    if(!await this.wait(2.5, tok)) return;
    this.run('drill', true);
  }
  async stage_drill(tok, fresh){
    const C = this.C, cl = this.clement, V = C.vault;
    this.state = 'drill';
    if(V.state !== 'drilling' || fresh === 'restore'){ if(V.drill && V.drill.rig) C.scene.remove(V.drill.rig); V.startDrill(this.mode === 'heat' ? 60 : 72); }
    this.checkpoint('drill');
    if(cl){ cl.setMode('hold'); cl.holdAt = [24, 15.3]; cl.holdYaw = Math.PI; }
    const fired = {};
    /* coming back from a checkpoint: waves the drill already passed don't all pour in at once */
    if(!fresh) this._drillWaves = null;
    const waves = this.mode === 'heat' ? this.heatWaves() : [
      [0.06, [{ type:'cop', from:'front' }, { type:'cop', from:'front' }, { type:'cop', from:'front', gap:2 }]],
      [0.22, [{ type:'guard', from:'staff' }, { type:'rusher', from:'restroomM' }, { type:'rusher', from:'restroomF' }]],
      [0.4, [{ type:'cop', from:'front' }, { type:'copShotgun', from:'front' }, { type:'cop', from:'front' }]],
      [0.56, [{ type:'swat', from:'front' }, { type:'swat', from:'front', gap:2.5 }, { type:'rusher', from:'club' }]],
      [0.74, [{ type:'rusher', from:'restroomM' }, { type:'rusher', from:'restroomF' }, { type:'cop', from:'front' }, { type:'copShotgun', from:'front' }]],
      [0.9, [{ type:'swat', from:'front' }, { type:'cop', from:'club' }, { type:'cop', from:'front' }]]
    ];
    this.objFn = ()=>[
      { t:'keep them off the drill · ' + Math.floor(V.progress*100) + '%' },
      { t:V.jammed ? 'THE DRILL JAMMED. go kick it (E)' : 'stay alive', done:false }
    ];
    this.objTitle = 'THE VAULT'; this.refreshObj();
    if(!fresh) waves.forEach(([p], i)=>{ if(p < V.progress - 0.02) fired[i] = true; });
    let talkT = 8;
    await this.until(()=>{
      waves.forEach(([p, list], i)=>{ if(!fired[i] && V.progress >= p){ fired[i] = true; this.queue(list); } });
      talkT -= 1/30;
      if(talkT <= 0 && cl){ talkT = R(14, 22); cl.say(pick(LINES.drill), 3); }
      if(V.jammed && !this._jamSaid){ this._jamSaid = true; cl && cl.say(pick(LINES.jam), 3); C.hh.big('THE DRILL JAMMED', 'go kick it', 'red', 1800); }
      if(!V.jammed) this._jamSaid = false;
      if(Math.random() < 0.1) this.refreshObj();
      return V.state === 'open';
    }, tok);
    if(!this.ok(tok)) return;
    this.run('vault', true);
  }
  async stage_vault(tok){
    const C = this.C, cl = this.clement, V = C.vault;
    this.state = 'vault';
    this.checkpoint('vault');
    C.audio.heist.score('tense');
    C.hh.big('THE VAULT', 'grab what you can carry', '', 2200);
    if(cl){ cl.say(LINES.vaultOpen, 4); cl.setMode('script'); cl.goTo(28.7, 17.5); }
    this.objFn = ()=>[{ t:'loot the vault · ' + V.takenCount() + '/' + V.piles.length }, { t:'the heavier the bag, the slower you move', opt:true }];
    this.objTitle = 'THE VAULT'; this.refreshObj();
    let t3 = null;
    await this.until(()=>{
      const n = V.takenCount(); if(this._lastTaken !== n){ this._lastTaken = n; this.refreshObj(); }
      if(this.mode === 'heat' && !this.crewBetrays){ return n >= Math.min(4, V.piles.length) && C.player.pos.x < 30.6 || n >= V.piles.length; }
      if(n >= 3 && t3 === null){ t3 = this.t; cl && cl.say(LINES.enough, 3); }
      const inside = C.player.pos.x > 30.5;
      return (n >= 3 && inside && (C.player.pos.x < 31.6 || n >= V.piles.length || this.t - t3 > 30));
    }, tok);
    if(!this.ok(tok)) return;
    if(this.mode === 'heat' && !this.crewBetrays){ this.run('escape', true); return; }
    this.run('betray', true);
  }
  async stage_betray(tok){
    const C = this.C, cl = this.clement, V = C.vault, P = C.player;
    this.state = 'betray'; this.cutscene = true;
    C.arsenal.holster(); C.arsenal.enabled = false;
    /* make sure you're inside */
    if(P.pos.x < 31.2){ P.pos.x = 31.6; P.pos.z = 17.5; }
    C.input.setWalk(false); P.mode = 'seat';
    cl.setMode('script'); cl.pos.set(29.0, 0, 17.5); cl.F.group.rotation.y = Math.PI/2; cl.path = null;
    C.hh.letterbox(true);
    P.moveCam(new THREE.Vector3(P.pos.x + 0.6, 1.55, 17.5 + 0.3), new THREE.Vector3(29.0, 1.3, 17.5), 0.8);
    C.audio.heist.score(null);
    if(!await this.wait(0.9, tok)) return;
    cl.say(LINES.betray[0], 2.5); cl.F.face.set('smug', 99);
    if(!await this.wait(2.2, tok)) return;
    cl.say(LINES.betray[1], 1.5);
    cl.F.armBusy = true; cl.F.armR.rotation.x = -1.6;
    if(!await this.wait(0.7, tok)) return;
    cl.fireAt('player-scripted');
    C.audio.heist.gun('revolver', cl.pos.clone().setY(1.3), { vol:1.3 });
    const m = new THREE.Vector3(); cl.muzzle.getWorldPosition(m); C.gore.tracer(m, C.camera.position.clone());
    this.hp = Math.max(18, this.hp - 30); C.hh.damageFrom(cl.pos); C.audio.heist.hurt(); C.player.addShake(1); C.engine.finish.uniforms.uFlash.value = 0.4; C.tweens.add({ dur:0.6, update:k=>{ C.engine.finish.uniforms.uFlash.value = 0.4*(1 - k); } });
    /* the bag */
    this.bagTaken = this.bagValue(); this.takenLoot = Object.assign({}, this.loot); Object.keys(this.loot).forEach(k=>this.loot[k] = 0); this.weight = 0;
    C.hh.big('HE TOOK THE BAG', '', 'red', 2400);
    if(!await this.wait(1.0, tok)) return;
    cl.say(LINES.betray[2], 3);
    cl.goTo(26, 17.2); cl.scriptSpeed = 3;
    if(!await this.wait(0.8, tok)) return;
    await V.slam();
    if(!this.ok(tok)) return;
    cl.setMode('script'); cl.pos.set(20, 0, 11); cl.F.group.visible = false;
    C.enemies.clearAlive(); this.waves = [];
    P.stand(); P.mode = 'walk'; C.input.setWalk(true); if(!C.input.touch) C.input.lock();
    C.hh.letterbox(false); this.cutscene = false; C.arsenal.enabled = true;
    this.saveH.betrayed = true;
    this.run('locked', true);
  }
  async stage_locked(tok, fresh){
    const C = this.C, cl = this.clement, V = C.vault;
    this.state = 'locked';
    if(fresh !== 'restore') this.checkpoint('locked');
    C.audio.heist.alarm(false); C.audio.heist.sirens(false);
    C.audio.heist.heartbeat(true, 0.8);
    this.vibe('dark');
    this.setObj('LOCKED IN', [{ t:'find a way out of the vault' }]);
    if(!await this.wait(2.5, tok)) return;
    C.hud.say('CLEMENT', '(through the door, muffled) ' + LINES.locked[0], 4); C.audio.heist.voice(LINES.locked[0], true);
    if(!await this.wait(6, tok)) return;
    if(!V.crate.opened){ C.hud.say('', 'there\'s a crate in the corner. it says PROPERTY OF GUS. DON\'T.', 4); }
    await this.until(()=>V.crate.opened, tok); if(!this.ok(tok)) return;
    C.arsenal.give('freon', true); C.arsenal.select('freon');
    C.hh.big('THE FREON CANNON', 'gus is going to be so mad', 'ice', 2800);
    this.setObj('LOCKED IN', [{ t:'freeze the two hinges on the left edge of the door (hold fire, get close)' }, { t:'then shoot them with a gun (1, 2, 3)', opt:true }]);
    C.audio.heist.heartbeat(false);
    let said = false;
    await this.until(()=>{ const fr = V.hinges.filter(h=>h.frozen).length, br = V.hinges.filter(h=>h.broken).length; const k = fr + ':' + br; if(k !== this._hk){ this._hk = k; this.setObj('LOCKED IN', [{ t:'freeze the door hinges · ' + fr + '/2', done:fr >= 2 }, { t:'shoot the frozen hinges · ' + br + '/2', done:br >= 2 }]); if(fr >= 1 && !said){ said = true; C.hud.say('', 'the hinge frosts over and goes brittle.', 2.5); } } return V.state === 'fallen'; }, tok);
    if(!this.ok(tok)) return;
    this.run('boss1', true);
  }
  async stage_boss1(tok, fresh){
    const C = this.C, cl = this.clement;
    this.state = 'boss1';
    if(fresh !== 'restore') this.checkpoint('boss1');
    this.vibe('boss'); C.audio.heist.score('boss');
    C.audio.heist.alarm(true); C.audio.heist.sirens(true);
    cl.F.group.visible = true; cl.pos.set(17.5, 0, 9.5); cl.setMode('fight'); cl.fightAt = null; cl.vulnerable = true; cl.phase = 1; cl.armor(true);
    if(fresh !== 'restore'){ cl.hp = cl.maxHp; cl.plates.forEach(p=>{ p.on = true; p.m.visible = true; p.hp = 70; }); }
    C.hh.big('CLEMENT', 'he strapped the gold on', 'red', 2400);
    cl.say(LINES.boss1[0], 3);
    this.queue([{ type:'cop', from:'front' }, { type:'cop', from:'front' }, { type:'guard', from:'staff', gap:2 }]);
    let waveT = 22;
    this.bossObj(1);
    await this.until(()=>{ waveT -= 1/30; if(waveT <= 0){ waveT = 24; if(C.enemies.count() < 4) this.queue([{ type:pick(['cop', 'copShotgun', 'guard']), from:pick(['front', 'staff']) }, { type:pick(['cop', 'rusher']), from:pick(['front', 'restroomM']) }]); } this.bossBar(); return cl.hp <= cl.maxHp*0.66; }, tok);
    if(!this.ok(tok)) return;
    this.run('boss2', true);
  }
  bossObj(ph){ const cl = this.clement; this.setObj('CLEMENT', [{ t:ph === 1 ? 'take back the bag. shoot the gold off him' : ph === 2 ? 'he\'s in the security room. go get him' : 'stop him before he reaches the door' }, { t:ph === 3 ? 'the chandelier is hanging by one chain' : 'stay alive', opt:true }]); }
  bossBar(){ const cl = this.clement; if(!cl) return; this.C.hh.boss({ name:this.partnerName ? this.partnerName.toUpperCase() : 'CLEMENT', sub:cl.phase === 1 ? 'IN GOLD' : cl.phase === 2 ? 'IN THE DARK' : 'FALLING APART', hp:Math.max(0, cl.hp), max:cl.maxHp, armor:cl.plateGroup.visible ? cl.plates.filter(p=>p.on).length/6 : 0, phase:cl.phase }); }
  async stage_boss2(tok, fresh){
    const C = this.C, cl = this.clement;
    this.state = 'boss2';
    if(fresh !== 'restore') this.checkpoint('boss2');
    cl.vulnerable = false; cl.phase = 2;
    cl.say(LINES.boss2, 3);
    C.gore.smokePuff(cl.pos.clone().setY(1), 20, 0.5);
    if(C.world.staffDoor && !C.world.staffDoor.isOpen){ C.world.staffDoor.open(); this.navDirty = true; this.navBuild(); }
    cl.setMode('script'); cl.scriptSpeed = 5.2; cl.goTo(-21, -17.4);
    this.bossObj(2);
    await this.until(()=>{ this.bossBar(); return cl.arrived() || cl.pos.distanceTo(new THREE.Vector3(-21, 0, -17.4)) < 2; }, tok);
    if(!this.ok(tok)) return;
    /* the breaker */
    this.lightsMode('dark'); this.vibe('dark');
    C.hud.say('CLEMENT', '(over the PA) lights out, partner.', 3);
    cl.setMode('fight'); cl.vulnerable = true; cl.fightAt = null; cl.T = { range:[4, 9] };
    this.queue([{ type:'guard', from:'staff' }, { type:'guard', from:'staff' }, { type:'swat', from:'front', gap:2 }, { type:'swat', from:'front' }]);
    let camT = 6;
    await this.until(()=>{
      camT -= 1/30;
      if(camT <= 0){ camT = R(11, 16); const p = C.player.pos; const zone = p.z > 13 ? (p.x > 11 ? 'cage' : 'lobby') : p.x < -12 && p.z < -14 ? 'staff' : p.x < -8 ? 'slots' : p.x > 12 && p.z < -14 ? 'club' : p.x > 8 ? 'tables' : 'floor'; C.hud.say('CLEMENT', '(PA) ' + LINES.boss2cam[zone], 3.5); C.audio.heist.voice(LINES.boss2cam[zone], true); }
      /* keep him around the security room */
      if(cl.cover && (cl.cover[0] > -12.5 || cl.cover[1] > -14.2)){ cl.cover = null; cl.coverT = 0; }
      this.bossBar(); return cl.hp <= cl.maxHp*0.33;
    }, tok);
    if(!this.ok(tok)) return;
    this.run('boss3', true);
  }
  async stage_boss3(tok, fresh){
    const C = this.C, cl = this.clement;
    this.state = 'boss3';
    if(fresh !== 'restore') this.checkpoint('boss3');
    cl.vulnerable = false; cl.phase = 3;
    this.lightsMode('emergency'); this.vibe('boss');
    cl.say(LINES.boss3[0], 3);
    cl.armor(false);
    if(cl.F.door){ cl.F.door.rotation.y = -0.9; }
    cl.F.face.set('hurt', 999);
    cl.setMode('script'); cl.scriptSpeed = 4.2; cl.goTo(0, 16.4);
    this.bossObj(3);
    await this.until(()=>{ this.bossBar(); return cl.arrived() || cl.pos.distanceTo(new THREE.Vector3(0, 0, 16.4)) < 1.5; }, tok);
    if(!this.ok(tok)) return;
    cl.setMode('fight'); cl.vulnerable = true; cl.fightAt = [R(-1.5, 1.5), 15.6]; cl.speed = 1.6;
    this.queue([{ type:'cop', from:'front' }, { type:'cop', from:'front', gap:3 }]);
    let moveT = 5;
    await this.until(()=>{ moveT -= 1/30; if(moveT <= 0){ moveT = R(4, 7); cl.fightAt = [R(-2, 2), R(14.6, 16.6)]; cl.path = null; } this.bossBar(); return cl.hp <= 0; }, tok);
    if(!this.ok(tok)) return;
    this.run('down', true);
  }
  vendorOK(){ try{ const m = window.VENDOR ? VENDOR.loadMem() : {}; return m.relationship === 'together' || (m.deaths || 0) >= 7; }catch(e){ return false; } }
  async stage_down(tok){
    const C = this.C, cl = this.clement;
    this.state = 'down';
    cl.vulnerable = false; cl.setMode('down'); cl.hp = 0;
    C.hh.boss(null);
    C.audio.heist.score(null, 2.5);
    C.enemies.clearAlive(); this.waves = [];
    C.hh.big(cl.crushed ? 'CRUSHED' : 'DOWN', '', 'red', 2000);
    this.setObj('CLEMENT', [{ t:'finish it' }]);
    await this.wait(1.4, tok);
    cl.say(pick(LINES.down), 4);
    const vend = this.vendorOK();
    let t = 0, said = 1;
    await this.until(()=>{
      t += 1/30;
      this.finI.pos.copy(cl.pos).setY(0.6);
      if(t > said*6 && said < 3){ said++; cl.say(pick(LINES.down), 4); }
      if(vend && t > 9 && !this.flag('finish')){ this.fire('vendor'); return true; }
      return this.flag('finish');
    }, tok);
    if(!this.ok(tok)) return;
    this.finished = true;
    if(this.flag('vendor')) await this.vendorFinish(tok);
    else {
      cl.say(LINES.finish, 2);
      await this.wait(0.6, tok);
      C.audio.heist.gun(C.arsenal.cur || 'revolver', null);
      C.engine.finish.uniforms.uFlash.value = 0.2; C.tweens.add({ dur:0.3, update:k=>{ C.engine.finish.uniforms.uFlash.value = 0.2*(1 - k); } });
      cl.F.face.set('static', 1); setTimeout(()=>cl.F.face.set('off', 1e9), 1000);
      C.gore.spill(cl.pos.clone().setY(0.5), new THREE.Vector3(0, 1, 0), { n:14, sauce:18 });
      C.audio.heist.squelch(cl.pos, true);
      if(cl.F.door){ const dr = cl.F.door; C.tweens.add({ dur:0.25, update:k=>{ dr.rotation.y = -0.9 - k*1.3; } }); }
      this.saveH.clementDead = true;
    }
    if(!this.ok(tok)) return;
    /* the bag is on the floor */
    this.bagOnFloor = true;
    const b = cl.bag; b.position.set(cl.pos.x + 0.6, 0, cl.pos.z - 0.6); b.visible = true;
    this.bagI.pos.copy(b.position).setY(0.4);
    this.setObj('THE BAG', [{ t:'take the bag' }]);
    await this.until(()=>this.flag('bag'), tok); if(!this.ok(tok)) return;
    this.bagOnFloor = false; b.visible = false;
    Object.keys(this.takenLoot || {}).forEach(k=>this.loot[k] += this.takenLoot[k]);
    this.bagTaken = 0;
    C.audio.chipStack(C.camera.position);
    this.toast('the bag is back · ' + fmt(this.bagValue()));
    this.run('escape', true);
  }
  async vendorFinish(tok){
    const C = this.C, cl = this.clement;
    cl.say(LINES.vendor, 3);
    await this.wait(1.2, tok);
    this.lightsMode('dark'); if(this.flashlight) this.flashlight.intensity = 0;
    C.audio.heist.score(null);
    C.audio.whisper('mine');
    await this.wait(1.6, tok);
    C.audio.burst({ ff:300, type:'lowpass', d:0.6, g:0.6 });
    C.audio.whisper('he was rude to doug');
    await this.wait(1.4, tok);
    cl.F.group.visible = false; cl.mode = 'gone';
    this.lightsMode('emergency');
    C.hud.say('', 'when the lights come back, clement is gone. there\'s a single tally mark scratched into the marble where he was.', 6);
    this.saveH.vendorKill = true; this.saveH.clementDead = true; C.save.egg('mine');
    try{ if(window.VENDOR) VENDOR.patch(m=>{ m.heistFavor = (m.heistFavor || 0) + 1; }); }catch(e){}
    await this.wait(1, tok);
  }
  async stage_escape(tok, fresh){
    const C = this.C;
    this.state = 'escape';
    if(fresh !== 'restore') this.checkpoint('escape');
    this.lightsMode('emergency');
    C.audio.heist.score('action'); C.audio.heist.alarm(true); C.audio.heist.sirens(true);
    C.hh.big('GET OUT', 'the front door is a wall of cops', 'red', 2600);
    this.setObj('THE WAY OUT', [{ t:'get out the front door' }, { t:'they brought a walk-in freezer', opt:true }]);
    C.destruct.breakAllGlass();
    C.collide.boxes.filter(b=>b.tag === 'door').forEach(b=>b.on = false);
    this.navDirty = true;
    const heat = this.mode === 'heat' ? (this.heatLevel || 1) : 0;
    this.queue([{ type:'swat', from:'front' }, { type:'cop', from:'front' }, { type:'cop', from:'front' }, { type:'heavy', from:'front', gap:3 }, { type:'swat', from:'front' }, { type:'copShotgun', from:'front' }].concat(heat > 2 ? [{ type:'heavy', from:'front', gap:4 }] : []));
    await this.until(()=>C.player.pos.z > 21.6 && Math.abs(C.player.pos.x) < 3.2, tok);
    if(!this.ok(tok)) return;
    this.escape();
  }
  /* ---------- out the door: the shatter, and upstairs ---------- */
  escape(){
    const C = this.C;
    this.state = 'out';
    const total = this.bagValue();
    const payload = {
      mode:this.mode, loot:total, breakdown:Object.assign({}, this.loot), kills:this.stats.kills, civ:this.stats.civ,
      weapon:C.arsenal.cur || 'revolver', heat:this.heatLevel || 0, story:this.mode === 'story',
      vendorKill:!!this.saveH.vendorKill, chandelier:!!this.saveH.chandelier, logo:C.destruct.logoHit, slots:C.destruct.slotsBusted,
      time:Math.round((performance.now() - this.stats.start)/1000), holes:C.gore.holeLog.slice(0, 60), crew:this.partnerName || null,
      cut:this.mode === 'heat' && this.crew && !this.crewBetrays ? this.crew.cut : 0, freon:!!C.arsenal.owned.freon
    };
    this.saveH.holes = payload.holes; this.saveH.logo = payload.logo || this.saveH.logo || null; this.saveH.lastLoot = total; C.save.write();
    C.engine.afterRender.push(canvas=>{
      let shot = null; try{ shot = canvas.toDataURL('image/jpeg', 0.82); }catch(e){}
      payload.shot = shot;
      C.audio.heist.stopAll();
      C.leave({ instant:true, escape:payload });
    });
  }
  /* ---------- dying ---------- */
  async die(kind){
    const C = this.C;
    if(this.state === 'dead') return;
    const prevState = this.state;
    this.state = 'dead'; this.tok++;
    this.saveH.deaths++; C.save.write();
    C.arsenal.holster(); C.arsenal.stopStream();
    C.input.setWalk(false); C.player.mode = 'seat';
    const P = C.player; P.moveCam(C.camera.position.clone().setY(0.35), C.camera.position.clone().add(new THREE.Vector3(Math.sin(P.yaw)*-1, 1.8, Math.cos(P.yaw)*-1)), 1.1);
    C.audio.heist.score(null, 1); C.audio.heist.heartbeat(true, 0.5);
    C.engine.finish.uniforms.uSat.value = 0.1;
    await C.tweens.sleep(1.4);
    C.audio.heist.heartbeat(false);
    const r = await C.hh.card(`<h1>DEFROSTED</h1><p>${pick(['your coolant is on the carpet.', 'you leaked out in the middle of the casino floor.', 'somebody is going to mop you up.', 'the house always wins. today the house had help.'])}</p><p style="opacity:.6">checkpoint: ${this.cp ? this.cp.name : 'none'}</p>`, [{ t:'TRY AGAIN FROM THE CHECKPOINT', gold:true }, { t:'WALK AWAY' }]);
    if(r === 0) this.restore();
    else this.abandon(true);
  }
  restore(){
    const C = this.C, cp = this.cp, A = C.arsenal, P = C.player;
    if(!cp){ this.abandon(true); return; }
    this.hp = cp.hp; this.bandages = cp.bandages; this.loot = Object.assign({}, cp.loot); this.weight = cp.weight; this.bagTaken = cp.bagTaken;
    cp.owned.forEach(k=>A.give(k)); A.ammo = JSON.parse(JSON.stringify(cp.ammo)); A.enabled = true;
    C.enemies.clearAlive(); this.waves = []; this.godT = 2.5;
    P.mode = 'walk'; P.tw = null; P.spawn(cp.pos[0], cp.pos[1], cp.pos[2]); C.input.setWalk(true); if(!C.input.touch) C.input.lock();
    C.engine.finish.uniforms.uSat.value = 0.5;
    C.hh.letterbox(false); this.cutscene = false;
    const cl = this.clement;
    if(cl && cp.cl){ cl.hp = cp.cl.hp; cl.plates.forEach((p, i)=>{ p.on = cp.cl.plates[i]; p.m.visible = p.on; p.hp = 70; }); }
    const st = cp.name;
    if(st === 'loud'){ this.state = 'loud'; this.run('loud', false); }
    else if(st === 'drill'){ C.vault.progress = Math.max(0, C.vault.progress - 0.15); C.vault.jammed = false; this.state = 'drill'; this.run('drill', false); }
    else if(st === 'vault'){ this.state = 'vault'; this.run('vault', false); }
    else if(st === 'locked'){ this.run('locked', 'restore'); }
    else if(st === 'crewturn'){ this.run('crewturn', 'restore'); }
    else if(st === 'boss1'){ cl.F.group.visible = true; this.run('boss1', 'restore'); }
    else if(st === 'boss2'){ cl.F.group.visible = true; cl.pos.set(-21, 0, -17.4); this.state = 'boss2'; cl.setMode('fight'); cl.vulnerable = true; this.lightsMode('dark'); this.tok++; const tok = this.tok; this.flags = {}; this.queue([{ type:'guard', from:'staff' }, { type:'swat', from:'front' }]); this.bossObj(2); this.until(()=>{ this.bossBar(); return cl.hp <= cl.maxHp*0.33; }, tok).then(()=>{ if(this.ok(tok)) this.run('boss3', true); }); }
    else if(st === 'boss3'){ cl.F.group.visible = true; cl.pos.set(0, 0, 16); this.run('boss3', 'restore'); }
    else if(st === 'escape'){ this.run('escape', 'restore'); }
    C.audio.heist.score(st === 'locked' ? null : st.indexOf('boss') === 0 || st === 'crewturn' ? 'boss' : st === 'loud' ? 'tense' : 'action');
    C.hh.big('AGAIN', '', '', 1200);
  }
  async abandonPrompt(){
    const C = this.C;
    const r = await C.hh.card('<h1 class="red">ABANDON?</h1><p>walk out now and you leave with nothing. the palace will remember tonight either way.</p>', [{ t:'KEEP GOING', gold:true }, { t:'WALK OUT' }]);
    if(r === 1) this.abandon(false); else if(!C.input.touch) C.input.lock();
  }
  abandon(died){
    const C = this.C;
    this.tok++; this.state = 'out';
    this.saveH.story = this.saveH.story >= 3 ? 3 : 1; this.saveH.abandoned = (this.saveH.abandoned || 0) + 1;
    if(died){ const fine = Math.floor(C.save.chips*0.1); if(fine > 0){ C.save.take(fine); } this.saveH.lastFine = fine; }
    C.save.write();
    C.audio.heist.stopAll();
    C.leave();
  }
  /* ---------- per frame ---------- */
  update(dt, t){
    const C = this.C;
    this.t += dt;
    if(this.warm.length){ this.warm.forEach(e=>{ C.scene.remove(e.F.group); C.combat.remove(e.target); const i = C.enemies.list.indexOf(e); if(i >= 0) C.enemies.list.splice(i, 1); }); this.warm = []; (this.warmMeshes || []).forEach(m=>C.scene.remove(m)); }
    if(this.godT > 0) this.godT -= dt;
    if(this.navDirty && this.isLoud()){ this.navBuild(); }
    for(let i=this.waiters.length - 1; i>=0; i--){ const w = this.waiters[i]; if(w.tok !== this.tok){ this.waiters.splice(i, 1); w.res(false); continue; } let r = false; try{ r = w.fn(); }catch(e){ console.error(e); } if(r){ this.waiters.splice(i, 1); w.res(true); } }
    if(this.clement && this.clement.mode !== 'gone') this.clement.update(dt, t);
    if(this.heat) this.heat.update(dt, t);
    detectorTick(C, dt);
    if(!this.isLoud() && this.state !== 'armed'){ C.gore.update(dt); C.loot.update(dt); C.destruct.update(dt, t); C.arsenal.update(dt); return; }
    C.arsenal.update(dt);
    C.enemies.update(dt, t);
    C.crowd.update(dt, t);
    C.gore.update(dt);
    C.loot.update(dt);
    C.vault.update(dt, t);
    C.destruct.update(dt, t);
    this.pumpWaves(dt);
    if(this.healT > 0){ this.healT -= dt; this.hp = Math.min(this.maxHp, this.hp + this.healLeft*dt/1.4); }
    /* the chroma from getting hit fades */
    const U = C.engine.finish.uniforms; if(U.uChroma.value > 0) U.uChroma.value = Math.max(0, U.uChroma.value - dt*0.01);
    if(U.uFlash.value > 0) U.uFlash.value = Math.max(0, U.uFlash.value - dt*1.2);
    /* low coolant: heartbeat */
    const low = this.hp < 35 && this.state !== 'dead';
    if(low !== this._low){ this._low = low; C.audio.heist.heartbeat(low, 1.3); }
    /* police lights blink */
    if(this.policeLights.visible){ const on = Math.floor(t*5) % 2; this.policeLights.children.forEach((m, i)=>{ m.material.opacity = (i + on) % 2 ? 0.95 : 0.1; }); }
    /* the hud */
    const H = C.hh, A = C.arsenal;
    H.hp(this.hp, this.maxHp, this.bandages);
    H.ammo(A);
    H.cross(A.spread(), A.drawn && !C.seated && C.player.mode === 'walk', A.adsK > 0.6, A.cur === 'freon');
    H.fear(C.crowd.fear, C.crowd.active && !this.alarm && this.state === 'loud');
    H.bag(this.bagValue(), this.weight > 0 ? 'heavy · ' + Math.round((1 - this.carryMul())*100) + '% slower' : (this.bagTaken ? 'CLEMENT HAS ' + fmt(this.bagTaken) : ''), this.mode === 'heat' ? this.heatLevel : 0, '');
    if(Math.random() < dt*2) this.refreshObj();
  }
  dispose(){
    try{ document.removeEventListener('wheel', this._wheel); }catch(e){}
    try{ this.C.audio.heist.stopAll(); }catch(e){}
    try{ this.C.arsenal.dispose(); }catch(e){}
    try{ this.C.hh.dispose(); }catch(e){}
  }
}
