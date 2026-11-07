/* ============================================================
   COLD OPEN: the night, in order
   hit → wake → crawl → sweep → limp → lobby → bar → gold → run →
   staff → (ride | fight → cage → vault → clement) → the end.
   every stage builds what it needs and cleans up after itself, so
   a checkpoint can run it again from the top.
============================================================ */
import * as THREE from '../lib/three.module.min.js';
import { makeFridge } from '../world/fridge.js';
import { canvas, tex } from '../world/textures.js';
import { los } from '../heist/nav.js';

const R = (a, b)=>a + Math.random()*(b - a);
const pick = a=>a[(Math.random()*a.length)|0];
const V = (x, y, z)=>new THREE.Vector3(x, y, z);
const near = (W, x, z, r)=>Math.hypot(W.C.player.pos.x - x, W.C.player.pos.z - z) < r;
const yawTo = (fx, fz, tx, tz)=>Math.atan2(-(tx - fx), -(tz - fz));
/* a hand-placed mark, nudged onto the nearest floor a fridge can stand on */
const snap = (W, x, z)=>{ const N = W.C.heist.nav, c = N.walk && N.nearest(x, z, 4); return c ? N.pos(c[0], c[1]) : [x, z]; };
/* walk something that isn't crew (the defroster, a body being dragged) along the nav grid */
const navFollow = (W, from, to, speed, tok, each)=>{ const N = W.C.heist.nav; const pth = (N.walk && N.path(from.x, from.z, to.x, to.z, 14000)) || [[to.x, to.z]]; let i = pth.length > 1 ? 1 : 0, t = 0;
  return W.until(()=>{ t += 1/60; if(i >= pth.length || t > 14) return true; const w = pth[i], dx = w[0] - from.x, dz = w[1] - from.z, d = Math.hypot(dx, dz); if(d < 0.15){ i++; return false; } const s = Math.min(d, speed/60); from.x += dx/d*s; from.z += dz/d*s; if(each) each(Math.atan2(dx, dz)); return false; }, tok); };

/* where things happen */
const PILE = { x:-6.8, z:-0.6 };
const AISLE_A = -14.5, AISLE_B = -21.5, BANK_N = -4.7, BANK_S = 4.7;
const STAFF_DOOR = { x:-20.35, z:-14 };

/* the screens all say the same thing now */
const SLIDE_CALM = { dur:999, draw:(g, W, H, st, time)=>{ g.fillStyle = '#060000'; g.fillRect(0, 0, W, H); const on = Math.floor(time*1.5) % 2; g.fillStyle = on ? '#ff2a1a' : '#5a0a06'; g.font = `bold ${Math.round(H*0.16)}px Georgia`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('PLEASE REMAIN CALM', W/2, H*0.42); g.font = `${Math.round(H*0.07)}px Georgia`; g.fillStyle = '#a06a60'; g.fillText('the palace is experiencing technical difficulties', W/2, H*0.62); if(Math.random() < 0.08){ g.fillStyle = 'rgba(255,255,255,0.08)'; g.fillRect(0, Math.random()*H, W, Math.random()*30); } } };

export const STORY = {
  /* ============================================================ the hit */
  async hit(W, tok){
    const C = W.C, P = C.player;
    W.cutscene = true;
    C.audio.heist && C.audio.heist.hit('fridge', C.camera.position); C.audio.tone({ f:90, f2:30, d:0.5, g:0.6, type:'square', filt:'lowpass', ff:500 });
    P.addShake(1.2);
    await W.black(true, 90);
    C.audio.duck(true); W.mood.ring(9);
    if(C.audio.musSrc){ try{ C.audio.heist.tapeStop(C.audio.musSrc); }catch(e){} C.audio.musSrc = null; }
    await C.tweens.sleep(1.2);
    C.hud.say('THREE CUP NICKY', 'nothing personal. okay. it\'s a little personal.', 4);
    await C.tweens.sleep(2.6);
    setupNight(W);
    await C.tweens.sleep(1.4);
    W.title('COLD OPEN', 'a fridge palace nightmare', 3600);
    await C.tweens.sleep(4.2);
    if(!W.ok(tok)) return;
    W.run('wake', 'fresh');
  },
  /* ============================================================ wake: you can only look */
  async wake(W, tok, why){
    const C = W.C, P = C.player, U = C.engine.finish.uniforms;
    W.clearScope();
    P.mode = 'walk'; P.tw = null; P.spawn(PILE.x, PILE.z, yawTo(PILE.x, PILE.z, 1.0, 5.2)); P.pitch = 0.95;
    W.body.set('locked'); P.eyeCur = 0.22;
    W.checkpoint('wake', 'the floor', { body:'locked' });
    C.input.setWalk(true);
    W.obj('', []);
    /* the execution you wake up to */
    const boss = W.spawnPerson({ x:1.0, z:5.4, yaw:Math.PI*0.75, name:'THE PIT BOSS', pose:'kneel', look:{ color:'#202024', trim:'#0b0b0c', acc:['headset', 'bowtie', 'nametag'], eye:'#ff5a5a', style:'tall' }, role:'victim' }, true);
    const lead = W.spawnCrew({ x:2.2, z:6.3, yaw:Math.atan2(1.0 - 2.2, 5.4 - 6.3), name:'MASK', state:'script', weapon:'pistol', light:true });
    lead.pitch = 0.3;
    if(why === 'fresh'){
      U.uDrunk.value = 1.4; U.uSat.value = 0.15;
      await W.black(false, 2600);
      C.audio.heist && C.audio.heist.heartbeat(true, 0.9);
      W.tip(C.input.touch ? 'drag on the right side of the screen to look around' : 'move the mouse to look around', 7000);
    } else { await W.black(false, 600); U.uSat.value = 0.4; }
    W.mood.drone(true, 0.14);
    C.tweens.add({ dur:9, update:k=>{ U.uDrunk.value = 1.4*(1 - k) + 0.25*k; U.uSat.value = 0.15 + 0.3*k; } });
    /* wait until you've looked down and found them, or a few seconds */
    const t0 = W.t;
    if(!await W.until(()=>P.pitch < 0.25 || W.t - t0 > 7, tok)) return;
    if(!await W.wait(0.8, tok)) return;
    C.hud.say('MASK', 'one more time. the vault code.', 3);
    if(!await W.wait(2.4, tok)) return;
    C.hud.say('THE PIT BOSS', 'i don\'t know it. i count CARDS. i don\'t count codes, i swear on my compressor', 3.5);
    boss.F.face.set('shock', 9);
    if(!await W.wait(3.0, tok)) return;
    await W.people.execute(boss, W.crew, lead, { plead:false, shots:2, back:true, aim:0.6 });
    if(!W.ok(tok)) return;
    C.audio.heist && C.audio.heist.scream(V(0, 1, 16), 6);
    if(!await W.wait(1.2, tok)) return;
    C.hud.say('MASK', 'anybody else not know things? no? good. faces on the carpet.', 3.5);
    lead.state = 'walk'; W.crew.goTo(lead, 6, 14); lead.speed = 1.1;
    if(!await W.wait(3.2, tok)) return;
    /* the man in tape */
    W.hank.show(-4.2, -4.6, 0); W.hank.posture = 'prone';
    await W.hank.goTo(PILE.x + 1.0, PILE.z - 0.9, 'prone');
    if(!W.ok(tok)) return;
    W.hank.faceYaw = Math.atan2(PILE.x - W.hank.F.group.position.x, PILE.z - W.hank.F.group.position.z);
    W.hank.say('don\'t move. they think you\'re dead. let\'s keep it like that.', 4);
    if(!await W.wait(4.2, tok)) return;
    W.hank.say('you took a lot off nicky tonight. so he took you. you\'re the one they\'re going to say did all this.', 5);
    if(!await W.wait(5.2, tok)) return;
    W.hank.say('can you crawl? doesn\'t matter. you\'re going to. follow me. stay low.', 4);
    W.body.set('crawl');
    W.tip(C.input.touch ? 'left thumb to crawl. slow is fine. slow is good.' : 'WASD to crawl. slow is fine. slow is good.', 6000);
    W.checkpoint('crawl', 'the floor', { body:'crawl' });
    if(!await W.wait(1.0, tok)) return;
    W.run('crawl', 'fresh');
  },
  /* ============================================================ crawl: the first light */
  async crawl(W, tok, why){
    const C = W.C;
    W.clearScope(); W.cutscene = false;
    if(why === 'retry'){ W.hank.show(PILE.x - 1.2, PILE.z - 0.5, -Math.PI/2); }
    W.obj('THE FLOOR', [{ t:'follow the man in tape' }, { t:'stay low. stay out of the flashlights', opt:true }]);
    W.mood.drone(true, 0.14);
    /* a guard walking the gap between the bar and the slots */
    const p1 = W.spawnCrew({ x:-17, z:-7.4, yaw:Math.PI/2, name:'MASK', weapon:'smg' });
    p1.route = [Object.assign([-17, -7.4], { wait:2.5, yaw:Math.PI/2 }), Object.assign([1.5, -7.4], { wait:2.5, yaw:-Math.PI/2 })];
    p1.speed = 0.95; p1.sweep = 0.7;
    /* hank's route: north along the slots, then west to the rows */
    await W.hank.goTo(-9.2, -0.6, 'prone');
    if(!W.ok(tok)) return;
    await W.hank.goTo(-9.2, -3.6, 'prone');
    if(!W.ok(tok)) return;
    if(!await W.until(()=>near(W, -9.2, -3.2, 2.2), tok)) return;
    /* the light comes */
    W.hank.say('stop. flat. don\'t move a hair. not your eyes. nothing.', 4);
    W.showStill = true;
    W.tip(C.input.touch ? 'hold still. don\'t touch anything.' : 'hold still. hands off the keys. hands off the mouse.', 5000);
    p1.route = null; W.crew.goTo(p1, -16, -6.6); p1.speed = 0.8; p1.sweep = 0.9;
    if(!await W.until(()=>p1.F.group.position.x < -14.5 || !p1.alive, tok)) return;
    W.showStill = false;
    if(!await W.wait(1.0, tok)) return;
    W.hank.say('okay. okay. keep going. west, to the slot rows.', 3);
    p1.route = [Object.assign([-18, -7.4], { wait:3, yaw:Math.PI/2 }), Object.assign([1.5, -7.4], { wait:3, yaw:-Math.PI/2 })];
    await W.hank.goTo(-12.2, -4.9, 'prone');
    if(!W.ok(tok)) return;
    await W.hank.goTo(AISLE_A, BANK_N, 'prone');
    if(!W.ok(tok)) return;
    if(!await W.until(()=>near(W, AISLE_A, BANK_N, 2.4), tok)) return;
    W.checkpoint('sweep', 'the slots', { body:'crawl' });
    W.run('sweep', 'fresh');
  },
  /* ============================================================ sweep: he's checking every row */
  async sweep(W, tok, why){
    const C = W.C;
    W.clearScope(); W.cutscene = false;
    if(why === 'retry'){ W.hank.show(AISLE_A + 0.8, BANK_N - 0.3, Math.PI); }
    W.obj('THE SLOTS', [{ t:'stay out of his light' }, { t:'the slot machines block his view. keep a row of them between you', opt:true }]);
    /* people hiding in the rows. one of them is lucky lou */
    const lou = W.spawnPerson({ x:AISLE_A + 0.7, z:2.2, yaw:-Math.PI/2, name:'LUCKY LOU', pose:'hide', look:{ color:'#e8d9b0', trim:'#7a1220', acc:['bowtie', 'vest', 'nametag'], vest:'#7a1220', eye:'#ffd56a', style:'retro' }, role:'hider' }, true);
    const h2 = W.spawnPerson({ x:AISLE_A - 0.8, z:-0.9, yaw:Math.PI/2, pose:'hide', role:'hider' }, true);
    const h3 = W.spawnPerson({ x:AISLE_B + 0.8, z:1.4, yaw:-Math.PI/2, pose:'hide', role:'hider' }, true);
    const h4 = W.spawnPerson({ x:AISLE_B - 0.7, z:-2.0, yaw:Math.PI/2, pose:'hide', role:'hider' }, true);
    lou.F.face.set('shock', 1e9);
    if(!await W.wait(why === 'retry' ? 0.5 : 0.6, tok)) return;
    W.hank.say('quiet. somebody\'s coming up this row.', 3);
    W.hank.goTo(AISLE_A + 0.6, BANK_N - 0.4, 'prone');
    const s = W.spawnCrew({ x:AISLE_A, z:BANK_S + 1.2, yaw:Math.PI, name:'SWEEPER', weapon:'smg', state:'walk' });
    s.speed = 0.8; s.sweep = 0.5; s.pitch = 0.3;
    await W.crew.walkTo(s, AISLE_A, 2.6, 0.8);
    if(!W.ok(tok)) return;
    /* lou */
    s.state = 'script'; s.aimAt = lou.F.group.position.clone().setY(0.8);
    C.hud.say('SWEEPER', 'there you are. the lucky one.', 2.4);
    W.hank.say('he\'s busy. MOVE. back out, around the end of the machines, into the next row.', 4);
    W.tip('crawl back out, around the end of the machines, into the next row over', 6000);
    W.hank.goTo(AISLE_B + 0.3, BANK_N + 1.6, 'prone');
    if(!await W.wait(1.6, tok)) return;
    C.hud.say('LUCKY LOU', 'please. i\'m a dealer. i just deal. i don\'t even keep the chips', 3);
    if(!await W.wait(2.4, tok)) return;
    C.hud.say('SWEEPER', 'nicky says you sweat too much. let\'s see what\'s in there.', 3);
    if(!await W.wait(1.8, tok)) return;
    /* he opens him */
    lou.script = true; W.people.pose(lou, 'kneel'); lou.F.group.rotation.y = Math.atan2(s.F.group.position.x - lou.F.group.position.x, s.F.group.position.z - lou.F.group.position.z);
    s.F.armL.rotation.x = -1.4;
    W.fx.gut(lou.F, '#e8d9b0', { n:22, sauce:26 });
    C.audio.heist && C.audio.heist.scream(lou.F.group.position, 1);
    lou.F.face.set('hurt', 2);
    if(!await W.wait(1.1, tok)) return;
    W.crew.fireAt(s, lou.F.group.position.clone().setY(1.25), { impact:false });
    lou.alive = false; W.fx.crackFace(lou.F, { static:0.4, dead:true }); W.fx.fall(lou.F, -1, 0.7);
    W.S.louDead = true; C.save.write();
    if(!await W.wait(1.2, tok)) return;
    s.state = 'walk'; s.aimAt = null;
    await W.crew.walkTo(s, AISLE_A, -0.4, 0.65);
    if(!W.ok(tok)) return;
    s.state = 'script'; s.aimAt = h2.F.group.position.clone().setY(0.7);
    if(!await W.wait(0.8, tok)) return;
    await W.people.execute(h2, W.crew, s, { plead:true, line:'no no no no', aim:0.8, pleadT:1.4, shots:2 });
    if(!W.ok(tok)) return;
    s.state = 'walk'; s.aimAt = null;
    await W.crew.walkTo(s, AISLE_A, BANK_N - 0.2, 0.75);
    if(!W.ok(tok)) return;
    W.hank.say('he\'s coming this way next. go. the far end of this row, around the bottom, back into the first one. GO.', 5);
    W.tip('down this row, around the far end, back into the first row', 6000);
    W.hank.goTo(AISLE_A + 0.7, BANK_S - 0.8, 'prone');
    s.state = 'search'; s.searchT = 2.2; s.home = 'walk';
    if(!await W.wait(2.4, tok)) return;
    s.state = 'walk';
    await W.crew.walkTo(s, AISLE_B, BANK_N - 0.4, 0.8);
    if(!W.ok(tok)) return;
    await W.crew.walkTo(s, AISLE_B, -1.4, 0.8);
    if(!W.ok(tok)) return;
    s.state = 'script'; s.aimAt = h4.F.group.position.clone().setY(0.7);
    await W.people.execute(h4, W.crew, s, { plead:true, line:'i didn\'t see anything, i didn\'t see your face', aim:0.5, shots:1 });
    if(!W.ok(tok)) return;
    s.state = 'walk'; s.aimAt = null;
    await W.crew.walkTo(s, AISLE_B, 1.0, 0.8);
    if(!W.ok(tok)) return;
    s.state = 'script'; s.aimAt = h3.F.group.position.clone().setY(0.7);
    await W.people.execute(h3, W.crew, s, { plead:true, line:'mama', aim:0.4, shots:3 });
    if(!W.ok(tok)) return;
    s.state = 'walk'; s.aimAt = null;
    await W.crew.walkTo(s, AISLE_B, BANK_S + 1.0, 0.85);
    if(!W.ok(tok)) return;
    W.crew.goTo(s, -14, 13); s.speed = 1.1;
    if(!await W.wait(2.5, tok)) return;
    W.hank.say('he\'s gone. that\'s all of them in here. ...come on. the cardboard box by the restrooms.', 4);
    if(!W.stats.seen) C.save.egg('unseen') && C.hud.toast('secret: not even a question mark', 'gold');
    await W.hank.goTo(-22.2, 7.4, 'prone');
    if(!W.ok(tok)) return;
    if(!await W.until(()=>near(W, -22.4, 7.3, 2.0), tok)) return;
    W.hank.posture = 'crouch';
    W.hank.say('that\'s his box. that\'s where he set you up. lean on it. get up. you can stand. barely.', 4);
    if(!await W.wait(1.2, tok)) return;
    W.body.set('limp');
    W.tip(C.input.touch ? 'you can stand now. barely. DUCK still goes flat.' : 'you can stand now. barely. Z goes flat, C crouches.', 5000);
    W.checkpoint('lobby', 'the box', { body:'limp' });
    W.run('lobby', 'fresh');
  },
  /* ============================================================ lobby: nobody leaves */
  async lobby(W, tok, why){
    const C = W.C;
    W.clearScope(); W.cutscene = false;
    if(why === 'retry'){ W.hank.show(-22.8, 8.4, Math.PI); W.hank.posture = 'crouch'; }
    W.obj('THE LOBBY', [{ t:'follow him toward the bar' }, { t:'stay out of the light from the doors', opt:true }]);
    /* the crowd at the doors */
    const crowd = [];
    for(let i=0;i<7;i++){ const p = W.spawnPerson({ x:-2.7 + i*0.9 + R(-0.1, 0.1), z:21.1 + R(-0.1, 0.2), yaw:0, pose:'pound', role:'crowd' }, true); p.F.face.set('shock', 1e9); crowd.push(p); }
    const shooters = [[-1.8, 17.2], [0.1, 16.9], [1.9, 17.3]].map(([x, z])=>W.spawnCrew({ x, z, yaw:0, name:'MASK', state:'hold', weapon:'smg', light:true, extra:{ holdAt:[x, z] } }));
    shooters.forEach(e=>{ e.sweep = 0.2; e.investigate = false; });
    /* the van out front throws a searchlight through the glass */
    const beam = buildBeam(W); W.scope({ remove:()=>{ C.scene.remove(beam.cone); C.scene.remove(beam.pool); } });
    let massacre = false, beamSus = 0;
    W.tick = (dt, t)=>{
      /* screaming at the glass */
      if(!massacre && Math.random() < dt*2){ const p = pick(crowd); C.audio.heist && C.audio.heist.scream(p.F.group.position, 1); if(Math.random() < 0.2) C.audio.burst({ ff:300, q:1, d:0.2, g:0.3, dest:C.audio.out(p.F.group.position, 0.3) }); }
      beamSus = beam.update(dt, t, beamSus);
      if(beamSus >= 1){ beamSus = 0; const g = shooters.filter(e=>e.alive)[0]; if(g){ g.sus = 1.2; g.lastSeen = [C.player.pos.x, C.player.pos.z]; W.onSpotted(g); } }
    };
    W.scope({ remove:()=>{ W.tick = null; } });
    W.hank.goTo(-26.6, 14.8, 'crouch');
    if(!await W.until(()=>near(W, -26, 14, 4) || W.t > 0 && false, tok)) return;
    /* nobody leaves */
    W.pa('i said nobody leaves.', 2.6);
    if(!await W.wait(2.2, tok)) return;
    massacre = true;
    shooters.forEach(e=>{ e.state = 'script'; e.aimAt = V(e.F.group.position.x, 1.2, 21); });
    if(!await W.wait(0.5, tok)) return;
    for(let k=0;k<16;k++){
      const e = shooters[k % 3], p = pick(crowd.filter(c=>c.alive)) || pick(crowd);
      const hp = p.F.group.position.clone().setY(R(0.7, 1.5));
      W.crew.fireAt(e, hp, { impact:false });
      C.gore.hole(V(hp.x + R(-0.6, 0.6), hp.y + R(-0.3, 0.5), 21.97), V(0, 0, -1), 0.05);
      if(Math.random() < 0.4) C.gore.glassBurst(V(hp.x, hp.y, 21.9), 3, V(0, 0, 1));
      if(p.alive && Math.random() < 0.55){ p.alive = false; p.script = true; W.fx.execute(p.F, { dir:V(0, 0, 1), fall:true, bleedT:7, n:6 }); }
      else { C.gore.coolant(hp, V(0, 0, -1), 4); C.gore.blobBurst(hp, 3, '#b8160f', 0.7, true); }
      await C.tweens.sleep(0.09);
      if(!W.ok(tok)) return;
    }
    crowd.filter(c=>c.alive).forEach((p, i)=>{ if(i > 0){ p.alive = false; p.script = true; W.fx.execute(p.F, { dir:V(0, 0, 1), bleedT:6, n:5 }); } });
    const last = crowd.find(c=>c.alive);
    if(!await W.wait(1.6, tok)) return;
    /* one of them is still moving */
    if(last){ last.script = true; W.people.pose(last, 'face'); last.F.face.set('hurt', 1e9); W.hank.say('don\'t look. ...look away.', 3); if(!await W.wait(1.0, tok)) return; const e = shooters[1]; await W.crew.walkTo(e, last.F.group.position.x, last.F.group.position.z - 1.0, 0.9); if(!W.ok(tok)) return; await W.people.execute(last, W.crew, e, { plead:false, aim:0.6, shots:1 }); if(!W.ok(tok)) return; }
    shooters.forEach((e, i)=>{ e.state = 'route'; e.scripted = false; e.aimAt = null; e.investigate = true; e.ri = 0; e.waitT = 0; e.route = [Object.assign([-1.5 + i*4, 18.8], { wait:3 + i*1.5, yaw:Math.PI }), Object.assign([-0.5 + i*4, 16.4], { wait:4.5 - i*0.75, yaw:Math.PI })]; });
    beam.on = true;
    W.hank.say('the light. from the doors. it sweeps. wait for it to pass, then the wheel. then the column. then the podium.', 6);
    W.tip('wait for the searchlight to pass. move between cover: the wheel, the column, the podium', 7000);
    /* doug gets dragged back to the cage */
    const doug = W.spawnPerson({ x:-0.8, z:19.6, yaw:0, name:'DOUG', pose:'face', look:{ color:'#f4f1e6', acc:['bowtie', 'vest', 'nametag'], style:'std', eye:'#ffd56a' }, role:'victim' }, true);
    const d1 = W.spawnCrew({ x:-0.6, z:18.6, yaw:Math.PI/2, name:'MASK', state:'walk', weapon:'pistol', light:false });
    if(!await W.wait(4, tok)) return;
    W.people.dragStart(doug, d1);
    C.hud.say('DOUG', 'i don\'t KNOW the code! i\'m a teller! i hand out CHIPS', 3.2);
    W.crew.walkTo(d1, 13.0, 15.0, 0.75).then(()=>{ if(!W.ok(tok)) return; W.people.dragEnd(doug); doug.F.group.visible = false; d1.F.group.visible = false; d1.state = 'hold'; d1.deaf = true; });
    W.hank.goTo(-14.6, 17.8, 'crouch');
    if(!await W.until(()=>near(W, -14.4, 17.8, 2.4), tok)) return;
    W.hank.goTo(-9.0, 15.4, 'crouch');
    if(!await W.until(()=>near(W, -9.2, 15.6, 2.2), tok)) return;
    C.hud.say('DOUG', 'please. somebody. anybody. PLEASE', 2.5);
    W.hank.goTo(-6.2, 12.2, 'crouch');
    if(!await W.until(()=>near(W, -6.2, 12.4, 2.0), tok)) return;
    W.hank.goTo(-3.4, 9.2, 'crouch');
    if(!await W.until(()=>near(W, -3.6, 9.4, 2.2), tok)) return;
    W.hank.goTo(PILE.x + 1.6, PILE.z + 1.6, 'crouch');
    if(!await W.until(()=>near(W, PILE.x + 2, PILE.z + 1.4, 2.6), tok)) return;
    W.checkpoint('bar', 'the bar', { body:'limp' });
    W.run('bar', 'fresh');
  },
  /* ============================================================ bar: gus, the sauce, playing dead */
  async bar(W, tok, why){
    const C = W.C, gus = C.games.bar && C.games.bar.bt;
    W.clearScope(); W.cutscene = false;
    if(why === 'retry'){ W.hank.show(PILE.x + 2.2, PILE.z + 1.2, 0); W.hank.posture = 'crouch'; }
    W.obj('THE BAR', [{ t:'talk to whoever is hiding behind the bar' }]);
    if(gus){ C.gusHold = true; gus.group.position.set(-2.15, 0, -1); gus.group.rotation.y = -Math.PI/2; gus.inner.position.y = -0.45; gus.inner.rotation.x = 0.3; gus.face.set('shock', 1e9); }
    W.hank.say('psst. behind the bar. somebody\'s back there.', 3);
    let talked = false;
    const it = { heist:true, pos:V(-3.2, 1.0, -1), r:2.4, text:()=>talked ? null : 'gus', enabled:()=>!talked, use:()=>{ talked = true; } };
    C.world.interact.push(it); W.scope({ remove:()=>{ const i = C.world.interact.indexOf(it); if(i >= 0) C.world.interact.splice(i, 1); } });
    if(!await W.until(()=>talked, tok)) return;
    if(gus){ gus.face.set('sad', 3); gus.face.say(3); }
    C.hud.say('GUS', 'you\'re alive. you\'re ALIVE. come here. drink this. don\'t ask what\'s in it.', 4);
    if(!await W.wait(2.6, tok)) return;
    C.audio.pour(V(-2.6, 1.15, -1)); if(!await W.wait(1.2, tok)) return; C.audio.gulp();
    const u = C.engine.finish.uniforms.uTint.value; u.set(1.25, 0.8, 1.1); C.tweens.add({ dur:4, update:k=>u.set(1.25 - 0.25*k, 0.8 + 0.2*k, 1.1 - 0.1*k) });
    C.engine.finish.uniforms.uDrunk.value = 0.8; C.tweens.add({ dur:3, update:k=>{ C.engine.finish.uniforms.uDrunk.value = 0.8*(1 - k); } });
    C.hud.say('GUS', 'the sauce. i only make it for people who\'ve been somewhere bad. you\'re somewhere bad.', 4);
    W.body.set('walk');
    W.tip('you can walk now. Z still goes flat.', 4000);
    if(!await W.wait(2.6, tok)) return;
    /* someone comes to check the pile */
    W.hank.say('down. DOWN. lie with them. play dead. don\'t you move.', 4);
    W.tip(C.input.touch ? 'press DUCK to go flat next to the bodies. then don\'t move.' : 'press Z to go flat next to the bodies. then don\'t move. not even the mouse.', 6000);
    W.hank.goTo(PILE.x + 0.3, PILE.z - 2.4, 'prone');
    W.showStill = true;
    W.checkpoint('pile', 'the pile', { body:'walk' });
    let nag = 0;
    if(!await W.until(()=>{ nag += 1/60; if(nag > 9){ nag = 0; W.hank.say(pick(['the pile. get in the pile.', 'lie DOWN. with them.', 'they\'re coming. get down with the bodies.']), 2.4); } return W.body.prone && near(W, PILE.x, PILE.z, 2.2); }, tok)) return;
    const k = W.spawnCrew({ x:-1.5, z:-9.6, yaw:Math.PI, name:'CHECKER', weapon:'pistol', state:'walk' });
    k.speed = 0.9; k.pitch = 0.42;
    if(!await W.wait(3.2, tok)) return;
    const bodies = W.people.list.filter(p=>p.tag === 'pile');
    for(const b of bodies){
      if(!W.ok(tok)) return;
      const bp = b.F.group.position;
      await W.crew.walkTo(k, bp.x + 0.9, bp.z - 0.6, 0.9);
      if(!W.ok(tok)) return;
      k.kicking = true; k.state = 'walk'; k.aimAt = bp.clone().setY(0.4);
      if(!await W.wait(0.5, tok)) return;
      /* the kick */
      k.F.inner.rotation.x = 0.3; C.audio.burst({ ff:200, type:'lowpass', d:0.2, g:0.6, dest:C.audio.out(bp, 0.2) }); b.F.inner.rotation.z = 0.25; C.tweens.add({ dur:0.4, update:q=>{ b.F.inner.rotation.z = 0.25*(1 - q); } });
      if(!await W.wait(0.5, tok)) return;
      k.F.inner.rotation.x = 0;
      if(b.faking){ b.F.face.set('hurt', 3); C.audio.heist && C.audio.heist.whimper(bp); C.hud.say('CHECKER', 'this one\'s breathing.', 2); if(!await W.wait(1.0, tok)) return; b.alive = true; await W.people.execute(b, W.crew, k, { plead:false, aim:0.4, shots:2 }); if(!W.ok(tok)) return; }
      k.kicking = false;
      if(!await W.wait(0.6, tok)) return;
    }
    /* now you */
    if(!W.body.prone){ k.sus = 1.2; k.lastSeen = [C.player.pos.x, C.player.pos.z]; W.onSpotted(k); return; }
    await W.crew.walkTo(k, PILE.x + 1.3, PILE.z + 0.9, 0.85);
    if(!W.ok(tok)) return;
    k.kicking = true; k.aimAt = C.camera.position.clone();
    W.cutscene = true; k.state = 'script';
    if(!await W.wait(1.2, tok)) return;
    C.hud.say('CHECKER', '...this one\'s warm.', 2.5);
    k.F.armR.rotation.x = -1.6;
    if(!await W.wait(1.6, tok)) return;
    W.showStill = false;
    W.checker = k;
    W.run('gold', 'fresh');
  },
  /* ============================================================ gold: the prize wakes up */
  async gold(W, tok, why){
    const C = W.C, G = W.gold, k = W.checker;
    W.cutscene = true;
    const P = C.world.podium;
    if(why !== 'retry'){
      /* the podium goes wrong */
      P.ledRing.material.color.setHex(0xff2010);
      C.audio.tone({ f:40, f2:25, d:2, g:0.4, type:'sawtooth', filt:'lowpass', ff:200 }); W.shake(0.4);
      if(k){ C.hud.say('CHECKER', 'what... what is that. that\'s the prize. why is it MOVING', 3); k.aimAt = V(0, 1.6, 8.5); }
      G.takeOver();
      await G.awaken();
      if(!W.ok(tok)) return;
      W.mood.crackle(true);
      if(k){ for(let i=0;i<6;i++){ W.crew.fireAt(k, G.F.group.position.clone().setY(R(1, 3.5)), { impact:false }); C.gore.sparks(G.F.group.position.clone().setY(R(1, 3)), 6, { speed:4 }); C.audio.heist && C.audio.heist.ricochet(G.F.group.position); await C.tweens.sleep(0.16); } }
      await G.hop(-2.4, 4.6, { height:1.1 });
      if(!W.ok(tok)) return;
      await G.hop(-4.9, 1.2, { height:1.5, big:true, onLand:()=>{ if(k && k.alive){ k.alive = false; k.state = 'dead'; W.fx.crush(k.F); k.cone.visible = false; k.pool.visible = false; k.F.group.visible = false; } } });
      if(!W.ok(tok)) return;
      C.audio.heist && C.audio.heist.scream(V(0, 1, 16), 5);
      W.checkpoint('gold', 'the gold fridge', { body:'walk', restoreFn:()=>{ G.F.group.position.set(-4.9, 0, 1.2); } });
    }
    /* it turns. at you. */
    W.cutscene = false;
    G.F.group.rotation.y = Math.atan2(C.player.pos.x - G.F.group.position.x, C.player.pos.z - G.F.group.position.z);
    W.hank.say('GET UP. it\'s coming. when it comes, JUMP.', 3);
    W.body.prone = false; W.body.apply();
    if(!await W.wait(1.4, tok)) return;
    /* the dive */
    const from = G.F.group.position.clone(), aim = C.player.pos.clone();
    const dir = aim.clone().sub(from).setY(0).normalize(), end = from.clone().addScaledVector(dir, 8.5);
    let dived = false;
    const q = W.ui.$('.qte'); q.querySelector('small').textContent = C.input.touch ? 'TAP' : 'SPACE';
    const doDive = ()=>{ if(dived) return; dived = true; q.classList.remove('on'); W.qte = null; C.engine.timeScale = 1;
      const side = new THREE.Vector3(-dir.z, 0, dir.x); const pp = C.player.pos, tgt = pp.clone().addScaledVector(side, 2.2); C.collide.resolve(tgt, 0.3);
      const p0 = pp.clone(); C.tweens.add({ dur:0.4, update:t=>{ pp.lerpVectors(p0, tgt, t); C.player.swayRoll = Math.sin(t*Math.PI)*0.5; } });
      C.audio.burst({ ff:500, q:0.8, d:0.4, g:0.3 }); W.shake(0.6); };
    q.onclick = doDive;
    let qteShown = false;
    await G.charge(end.x, end.z, 1.05, kk=>{
      const d = G.F.group.position.distanceTo(C.player.pos);
      if(!qteShown && d < 4.2){ qteShown = true; q.classList.add('on'); W.qte = doDive; C.engine.timeScale = 0.35; }
      if(!dived && d < 1.4){ dived = true; W.qte = null; q.classList.remove('on'); C.engine.timeScale = 1; W.fx.crush({ group:{ getWorldPosition:v=>v.copy(C.player.pos) }, inner:new THREE.Object3D(), face:null }); W.die('crushed'); }
    });
    q.classList.remove('on'); W.qte = null; C.engine.timeScale = 1;
    if(!W.ok(tok)) return;
    if(!dived) return;
    if(why !== 'retry') C.save.egg('quickdive') && C.hud.toast('secret: first try', 'gold');
    /* it smashes into the slot machines */
    W.shake(1.4); C.audio.heist && C.audio.heist.explosion(G.F.group.position.clone().setY(1), 0.9);
    C.gore.glassBurst(G.F.group.position.clone().setY(1.2), 20); C.fx.coins(G.F.group.position.clone().setY(1.5), 40); C.audio.coins && C.audio.coins(G.F.group.position, 30);
    await G.topple(-1);
    if(!W.ok(tok)) return;
    W.run('defroster', 'fresh');
  },
  /* ============================================================ the thing inside */
  async defroster(W, tok, why){
    const C = W.C, G = W.gold, D = W.def;
    W.cutscene = true;
    W.clearScope();
    const gp = G.F.group.position;
    const front = G.F.group.localToWorld(V(0, 0, G.F.d/2 + 0.4)).setY(0);
    if(!await W.wait(1.0, tok)) return;
    C.audio.tone({ f:70, f2:140, d:2.5, g:0.25, type:'sawtooth', filt:'lowpass', ff:300 });
    W.fx.flash(gp.clone().setY(1), 0xff8030, 6, 0.6);
    D.appear(front.x, front.z, Math.atan2(C.player.pos.x - front.x, C.player.pos.z - front.z));
    D.F.inner.scale.setScalar(0.01);
    await C.tweens.add({ dur:1.4, ease:t=>t*t*(3 - 2*t), update:q=>{ D.F.inner.scale.set(q, q*(0.9 + Math.sin(q*12)*0.1), q); } });
    D.F.inner.scale.setScalar(1);
    if(!W.ok(tok)) return;
    W.mood.drone(true, 0.22);
    C.hud.say('', 'something climbs out of the prize fridge. it has been on fire for a very long time.', 4);
    /* two of them come running and find out */
    const a = W.spawnCrew({ x:-7, z:-8.5, yaw:0, name:'MASK', state:'walk', weapon:'smg' }), b = W.spawnCrew({ x:-4, z:-9.2, yaw:0, name:'MASK', state:'walk', weapon:'smg' });
    [a, b].forEach(e=>{ e.deaf = true; e.investigate = false; });
    W.crew.goTo(a, front.x - 2, front.z - 3.2); W.crew.goTo(b, front.x + 0.5, front.z - 3.6); a.speed = b.speed = 2.6;
    if(!await W.wait(2.0, tok)) return;
    C.hud.say('MASK', pick(['what IS that', 'shoot it. SHOOT IT.']), 2);
    for(let i=0;i<10;i++){ const e = i % 2 ? a : b; if(e.alive){ e.state = 'script'; e.aimAt = D.F.group.position.clone().setY(1.2); W.crew.fireAt(e, D.F.group.position.clone().setY(R(0.6, 1.8)), { impact:false }); C.gore.sparks(D.F.group.position.clone().setY(R(0.6, 1.8)), 5, { speed:3, col:'#ff8a20' }); } await C.tweens.sleep(0.13); }
    if(!W.ok(tok)) return;
    C.hud.say('MASK', 'it\'s not stopping', 1.8);
    /* it walks up to them */
    D.state = 'script';
    const go = (e)=>new Promise(res=>{ const st = { t:0 }; const f = (dt)=>{ st.t += dt; const p = D.F.group.position, q = e.F.group.position, dx = q.x - p.x, dz = q.z - p.z, d = Math.hypot(dx, dz); if(d < 1.4 || st.t > 6){ res(); return true; } p.x += dx/d*dt*1.5; p.z += dz/d*dt*1.5; D.F.group.rotation.y = Math.atan2(dx, dz); return false; }; W.until(()=>f(1/60), tok).then(res); });
    await go(a); if(!W.ok(tok)) return;
    W.cookCrew(a); if(!await W.wait(1.0, tok)) return;
    await go(b); if(!W.ok(tok)) return;
    W.cookCrew(b); if(!await W.wait(1.4, tok)) return;
    /* then it looks at you */
    D.F.group.rotation.y = Math.atan2(C.player.pos.x - D.F.group.position.x, C.player.pos.z - D.F.group.position.z);
    D.F.face.set('angry', 1e9);
    W.cutscene = false;
    W.hank.say('RUN. the staff door. north-west. RUN.', 3);
    W.body.set('run'); W.body.prone = false; W.body.apply();
    W.tip(C.input.touch ? 'run. push the stick all the way.' : 'run. hold SHIFT.', 4000);
    W.obj('RUN', [{ t:'the staff door, north-west corner' }, { t:'don\'t let it touch you', opt:true }]);
    D.state = 'stalk'; D.speed = 1.6;
    W.checkpoint('run', 'the fire', { body:'run', restoreFn:()=>{ D.appear(front.x, front.z, 0); D.state = 'stalk'; } });
    W.run('run', 'fresh');
  },
  /* ============================================================ run */
  async run(W, tok, why){
    const C = W.C, D = W.def;
    W.cutscene = false;
    if(why === 'retry'){ D.state = 'stalk'; W.body.set('run'); }
    W.blinkAfter = 4; W.defrostMul = 1.05;
    W.onDefrosterTouch = ()=>{ if(!W.dead){ W.hurt(200, D.F.group.position, 'fire'); } };
    /* the crew scatter */
    /* the crew bolt for the far side of the floor, away from the fire. each to his own spot */
    const FLEE = [[14.5, -6.5], [18.5, 3.5], [9.5, 10.5], [23.5, -9.5], [13, 12], [20.5, 9.5]];
    W.crew.list.filter(e=>e.alive && e.state !== 'dead').forEach((e, i)=>{ e.state = 'walk'; e.scripted = true; e.deaf = true; e.hold = false; e.lookAt = null; const [x, z] = snap(W, ...FLEE[i % FLEE.length]); e.speed = 2.4; W.crew.goTo(e, x, z); });
    W.hank.show(STAFF_DOOR.x + 1.5, STAFF_DOOR.z + 2.5, Math.PI); W.hank.posture = 'stand'; W.hank.noWait = true;
    C.world.staffDoor && C.world.staffDoor.open();
    C.heist.navBuild && C.heist.navBuild();
    if(!await W.until(()=>C.player.pos.z < -14.8 && C.player.pos.x < -12.3, tok)) return;
    W.hank.noWait = false;
    D.hide();
    W.onDefrosterTouch = null;
    W.checkpoint('staff', 'the staff room', { body:'walk' });
    W.run('staff', 'fresh');
  },
  /* ============================================================ staff room: the freon */
  async staff(W, tok, why){
    const C = W.C, A = C.arsenal, D = W.def;
    W.clearScope(); W.cutscene = false;
    W.body.set('walk');
    W.hank.show(-22.5, -16.2, 0); W.hank.posture = 'stand';
    W.fireOn(V(-21, 2.6, -18), 0.9); W.fireLight && W.fireLight.color.setHex(0xff3a2a);
    W.obj('THE STAFF ROOM', [{ t:'wake up the night guard' }]);
    const guard = C.staff.find(F=>F.name === 'NIGHT GUARD');
    W.hank.say('he slept through the robbery last time too. wake him up.', 3.5);
    let woke = false;
    const it = { heist:true, pos:V(-19.8, 1.2, -18.6), r:2.8, text:()=>woke ? null : 'shake the night guard', enabled:()=>!woke, use:()=>{ woke = true; } };
    C.world.interact.push(it); W.scope({ remove:()=>{ const i = C.world.interact.indexOf(it); if(i >= 0) C.world.interact.splice(i, 1); } });
    if(!await W.until(()=>woke, tok)) return;
    if(guard){ guard.face.set('shock', 4); guard.face.say(3); }
    C.hud.say('NIGHT GUARD', 'huh. is it my shift. ...why is it so dark. why are you covered in ketchup', 3.5);
    if(!await W.wait(3.4, tok)) return;
    C.hud.say('NIGHT GUARD', 'under the desk. gus left it here after last time. i don\'t ask what it\'s for.', 3.5);
    A.give('freon', true); A.select('freon');
    W.fightOn = true; C.hh.$('#hh-ammo').style.display = '';
    W.tip(C.input.touch ? 'FIRE sprays freon' : 'hold the left mouse button to spray freon', 4000);
    /* the desk catches: practice */
    if(!await W.wait(1.6, tok)) return;
    C.audio.heist && C.audio.heist.explosion(V(-22.2, 1.4, -21.4), 0.2); C.gore.sparks(V(-22.2, 1.6, -21.4), 30, { speed:4 });
    const fireSpot = W.fx.ignite({ x:-20.8, z:-19.8, w:1.3, d:0.4, y0:0.7, y1:1.6, rate:40, size:1.1 });
    let heat = 100;
    const ft = { kind:'fire', get alive(){ return heat > 0; }, ray:()=>null, hit:()=>({ hit:false }), center:()=>V(-20.8, 1.0, -19.8), freeze:(v)=>{ heat -= v*0.9; fireSpot.rate = 40*Math.max(0, heat)/100; if(heat <= 0){ W.fx.douse(fireSpot); C.gore.mistPuff(V(-20.8, 1, -19.8), '#e8f4ff', 16, { size:0.6 }); } } };
    C.combat.add(ft); W.scope({ remove:()=>{ C.combat.remove(ft); W.fx.douse(fireSpot); } });
    C.hud.say('NIGHT GUARD', 'THE DESK. the desk is on fire. it\'s a rental', 2.5);
    W.obj('THE STAFF ROOM', [{ t:'put out the fire on the desk' }]);
    if(!await W.until(()=>heat <= 0, tok)) return;
    C.hud.say('NIGHT GUARD', 'thank you. i was going to sleep on that later.', 2.5);
    if(!await W.wait(2.2, tok)) return;
    /* it found the door */
    W.fx.flash(V(STAFF_DOOR.x, 1.5, STAFF_DOOR.z), 0xff8030, 5, 0.4); C.audio.heist && C.audio.heist.slam(V(STAFF_DOOR.x, 1.4, STAFF_DOOR.z)); W.shake(0.8);
    D.appear(STAFF_DOOR.x, STAFF_DOOR.z - 0.8, Math.PI); D.state = 'stalk'; D.speed = 1.2; W.blinkAfter = 99;
    W.hank.say('it\'s here. FREON IT.', 2);
    W.obj('THE STAFF ROOM', [{ t:'hit it with the freon' }]);
    W.onDefrosterTouch = ()=>{ if(!W.dead) W.hurt(200, D.F.group.position, 'fire'); };
    let staggered = false; W.onDefrosterStagger = ()=>{ staggered = true; };
    if(!await W.until(()=>staggered, tok)) return;
    D.stagger = 999; W.onDefrosterTouch = null;
    W.hank.say('it doesn\'t die. it only stops. listen to me.', 3);
    if(!await W.wait(3, tok)) return;
    W.hank.say('the race hallway has a loading door. we go now, we live. or you go back out there, for them.', 5);
    if(!await W.wait(1.5, tok)) return;
    const ch = await C.hh.choice(['GET OUT · the loading door, now', 'GO BACK · they\'re still killing people']);
    if(!W.ok(tok)) return;
    D.stagger = 2;
    if(ch === 0){ W.checkpoint('ride', 'the hallway', { body:'run' }); W.run('ride', 'fresh'); }
    else { W.checkpoint('fight', 'the staff room', { body:'walk' }); W.run('fight', 'fresh'); }
  },
  /* ============================================================ ending one: get out */
  async ride(W, tok, why){
    const C = W.C, D = W.def, A = C.arsenal;
    W.clearScope(); W.cutscene = false; W.body.set('run');
    if(C.world.staffDoor && !C.world.staffDoor.isOpen){ C.world.staffDoor.open(); C.heist.navBuild && C.heist.navBuild(); }
    if(!A.owned.freon){ A.give('freon', true); } A.select('freon'); W.fightOn = true;
    W.obj('GET OUT', [{ t:'follow him to the loading door, behind the race screen' }]);
    if(why !== 'retry') W.tip('it\'s in the doorway. freon it, then squeeze past', 4500); else W.tip('freon first. then go', 3000);
    W.hank.show(-17, -13.2, Math.PI/2); W.hank.posture = 'stand'; W.hank.noWait = false;
    D.appear(STAFF_DOOR.x - 0.4, STAFF_DOOR.z - 1.4, 0); D.state = 'stalk'; D.speed = 1.3; D.stagger = 3; W.blinkAfter = 7; W.godT = 2.5;
    W.onDefrosterTouch = ()=>{ if(!W.dead) W.hurt(200, D.F.group.position, 'fire'); };
    W.hank.goTo(-5, -13.6, 'stand', 3.0).then(()=>W.ok(tok) && W.hank.goTo(7.2, -20.4, 'stand', 3.0));
    const door = buildLoadingDoor(W);
    if(!await W.until(()=>near(W, 7.6, -20.6, 2.4), tok)) return;
    W.hank.say('help me lift it. ...one of the racers is still in the stall. get on.', 3);
    D.hide(); W.onDefrosterTouch = null;
    await door.open();
    if(!W.ok(tok)) return;
    W.checkpoint('alley', 'the alley', { body:'walk', hp:100 });
    await alleyRide(W, tok);
  },
  async alley(W, tok){
    W.clearScope(); const door = buildLoadingDoor(W); door.open();
    await alleyRide(W, tok);
  },
  /* ============================================================ ending two: go back */
  async fight(W, tok, why){
    const C = W.C, A = C.arsenal, D = W.def, guard = C.staff.find(F=>F.name === 'NIGHT GUARD');
    W.clearScope(); W.cutscene = false; W.body.set('walk');
    D.hide(); W.onDefrosterTouch = null;
    if(C.world.staffDoor && !C.world.staffDoor.isOpen){ C.world.staffDoor.open(); C.heist.navBuild && C.heist.navBuild(); }
    if(!A.owned.freon) A.give('freon', true);
    W.fightOn = true; C.hh.$('#hh-hp').style.display = ''; C.hh.$('#hh-ammo').style.display = '';
    W.hank.show(-22.5, -16.2, 0); W.hank.posture = 'stand';
    W.fireOn(V(-21, 2.6, -18), 0.9);
    C.hud.say('NIGHT GUARD', 'going back out? take this. i\'ve never fired it. it\'s mostly for decoration.', 3.5);
    A.give('revolver', true); A.addAmmo('revolver', 18);
    W.tip(C.input.touch ? 'SWAP changes weapon' : '1 revolver · 4 freon · right mouse aims', 5000);
    if(!await W.wait(2, tok)) return;
    W.hank.say('clement has the cameras. the breaker on the east wall. kill it and he\'s blind. so is everybody else.', 4.5);
    W.obj('GO BACK', [{ t:'flip the breaker on the east wall' }]);
    let flipped = false;
    const it = { heist:true, pos:V(-12.4, 1.5, -16), r:2.2, text:()=>flipped ? null : 'flip the main breaker', enabled:()=>!flipped, use:()=>{ flipped = true; } };
    C.world.interact.push(it); W.scope({ remove:()=>{ const i = C.world.interact.indexOf(it); if(i >= 0) C.world.interact.splice(i, 1); } });
    if(!await W.until(()=>flipped, tok)) return;
    C.audio.tone({ f:80, f2:40, d:0.6, g:0.3, type:'square', filt:'lowpass', ff:300 });
    W.mood.dark(C.heist.flashlight ? 0.05 : 0.12); W.cams.arm(false); W.camsBlind = true;
    if(C.heist.flashlight){ C.heist.flashlight.intensity = 45; }
    W.pa('...the cameras are down. who did that. NICKY. your patsy is up and he has gus\'s freon.', 4);
    if(!await W.wait(2.5, tok)) return;
    W.hank.say('i can\'t go out there. i\'m not... i don\'t go out there. go. i\'ll be here.', 4);
    /* the floor: they come looking */
    W.obj('GO BACK', [{ t:'deal with the crew on the floor · 0/5' }, { t:'freon freezes them solid. a shot shatters them', opt:true }]);
    let down = 0; const dealt = new Set();
    W.lockFreeze = true;
    const count = e=>{ if(e.tag !== 'fight' || dealt.has(e)) return; dealt.add(e); down++; W.obj('GO BACK', [{ t:'deal with the crew on the floor · ' + down + '/5', done:down >= 5 }, { t:'frozen ones stay frozen. you don\'t have to break them', opt:true }]); };
    W.onCrewKill = count;
    W.onCrewFrozen = e=>{ W.stats.frozen++; count(e); };
    const spots = [[-17, -11], [-6, -10], [-14, 2], [-4, 6], [-20, 6]];
    spots.forEach(([x, z], i)=>{ const e = W.spawnCrew({ x, z, yaw:0, name:'MASK', weapon:i % 2 ? 'smg' : 'pistol', state:'combat', tag:'fight', hp:90 }); e.deaf = true; });
    if(!await W.until(()=>down >= 5, tok)) return;
    W.onCrewKill = null;
    W.checkpoint('cage', 'the floor', { body:'walk', hp:100 });
    W.run('cage', 'fresh');
  },
  async cage(W, tok, why){
    const C = W.C, A = C.arsenal, K = C.world.cage;
    W.clearScope(); W.cutscene = false; W.fightOn = true;
    if(why === 'retry'){ W.mood.dark(C.heist.flashlight ? 0.05 : 0.12); W.camsBlind = true; if(C.heist.flashlight) C.heist.flashlight.intensity = 45; }
    W.obj('THE CAGE', [{ t:'doug is in the cage. get him out' }]);
    const doug = W.spawnPerson({ x:27.6, z:15.6, yaw:Math.PI/2, name:'DOUG', pose:'kneel', look:{ color:'#f4f1e6', acc:['bowtie', 'vest', 'nametag'], style:'std', eye:'#ffd56a' }, role:'victim' }, true);
    doug.F.face.set('sad', 1e9);
    /* open the cage up for this */
    K.cols.gate.on = false; K.cols.inside.on = false; if(K.gate) K.gate.position.y = Math.max(K.gate.position.y, 3.2);
    C.heist.navBuild && C.heist.navBuild();
    W.scope({ remove:()=>{} });
    const g1 = W.spawnCrew({ x:26, z:16.8, yaw:-Math.PI/2, name:'MASK', state:'combat', weapon:'smg', tag:'cage', hp:90 });
    const g2 = W.spawnCrew({ x:24.5, z:18.6, yaw:-Math.PI/2, name:'MASK', state:'combat', weapon:'shotgun', tag:'cage', hp:110 });
    [g1, g2].forEach(e=>e.deaf = true);
    let gone = 0; const dealt = new Set(); W.lockFreeze = true; const cnt = e=>{ if(e.tag === 'cage' && !dealt.has(e)){ dealt.add(e); gone++; } }; W.onCrewKill = cnt; W.onCrewFrozen = e=>{ W.stats.frozen++; cnt(e); };
    if(!await W.until(()=>gone >= 2, tok)) return;
    W.onCrewKill = null;
    if(!await W.until(()=>near(W, 27, 16, 3), tok)) return;
    C.hud.say('DOUG', 'you came back? nobody comes back. NOBODY comes back for doug.', 3.5);
    W.S.dougSaved = true; C.save.write();
    if(!await W.wait(3.2, tok)) return;
    C.hud.say('DOUG', 'he\'s in front of the vault. nicky. he set his box up. he\'s waiting for you. he said you\'d come.', 4);
    W.checkpoint('vault', 'the vault', { body:'walk', hp:Math.max(W.hp, 80) });
    W.run('vault', 'fresh');
  },
  /* ============================================================ one last game */
  async vault(W, tok, why){
    const C = W.C, A = C.arsenal;
    W.clearScope(); W.cutscene = false; W.fightOn = true;
    if(why === 'retry'){ W.mood.dark(C.heist.flashlight ? 0.05 : 0.12); W.camsBlind = true; if(C.heist.flashlight) C.heist.flashlight.intensity = 45; const K = C.world.cage; K.cols.gate.on = false; K.cols.inside.on = false; C.heist.navBuild && C.heist.navBuild(); }
    W.obj('THE VAULT', [{ t:'nicky' }]);
    const game = buildVaultGame(W);
    W.scope({ remove:()=>game.remove() });
    if(!await W.until(()=>near(W, game.at.x - 1.3, game.at.z, 1.8), tok)) return;
    A.holster(); W.cutscene = true;
    C.input.setWalk(false); C.player.mode = 'seat';
    C.player.moveCam(V(game.at.x - 0.98, 1.3, game.at.z), V(game.at.x, 0.8, game.at.z), 1.0);
    C.hud.say('THREE CUP NICKY', 'there he is. my perfect patsy. sit down. one more game.', 3.5);
    if(!await W.wait(3.4, tok)) return;
    C.hud.say('THREE CUP NICKY', 'the ball is a detonator. the vault is wired. pick the right cup and i come quietly. pick wrong and we all go up together. even money.', 6);
    if(!await W.wait(5.6, tok)) return;
    const res = await game.play(tok);
    if(!W.ok(tok)) return;
    if(res === 'boom'){ C.audio.heist && C.audio.heist.explosion(game.at.clone().setY(1), 1.2); W.fx.flash(game.at.clone().setY(1), 0xffffff, 12, 0.5); W.shake(1.5); W.cutscene = false; W.die('boom'); return; }
    if(res === 'caught') C.save.egg('callout') && C.hud.toast('secret: not this time', 'gold');
    C.hud.say('THREE CUP NICKY', res === 'caught' ? 'how. HOW do you keep doing that.' : '...okay. okay. you got me. that\'s twice tonight.', 3.5);
    game.nicky.face.set('sad', 1e9); game.nicky.armL.rotation.x = -2.9; game.nicky.armR.rotation.x = -2.9;
    if(!await W.wait(3.2, tok)) return;
    C.player.stand(()=>{});
    C.input.setWalk(true); C.player.mode = 'walk'; if(!C.input.touch) C.input.lock();
    W.cutscene = false;
    W.checkpoint('clement', 'the cage', { body:'walk', hp:100 });
    W.run('clement', 'fresh');
  },
  /* ============================================================ clement */
  async clement(W, tok, why){
    const C = W.C, A = C.arsenal, D = W.def, H = C.save.d.heist || {};
    W.clearScope(); W.cutscene = false; W.fightOn = true;
    if(why === 'retry'){ W.mood.dark(C.heist.flashlight ? 0.05 : 0.12); W.camsBlind = true; if(C.heist.flashlight) C.heist.flashlight.intensity = 45; }
    const patched = H.clementDead && !H.vendorKill, wrong = H.vendorKill;
    W.pa(wrong ? 'nicky... nicky is... sitting. good. sit. stay. i will do. the rest. myself.' : patched ? 'nick-nick-nicky. useless. f-fine. i\'ll do it. myself. like l-last time.' : 'nicky. you had one job and it was a cardboard box. fine. i\'ll do it myself.', 5);
    const cl = W.spawnCrew({ x:20, z:-12.4, yaw:Math.PI, name:W.clementName(), state:'combat', weapon:'shotgun', hp:wrong ? 900 : 700, style:'retro', color:wrong ? '#1a1a1a' : '#5c5a34', acc:patched ? ['rust', 'magnets'] : ['rust'], eye:wrong ? '#ff2a1a' : '#ffd56a', tag:'clement' });
    if(cl.F.mask) cl.F.mask.visible = false;
    cl.F.face.shades = !wrong; cl.deaf = true;
    W.obj('CLEMENT', [{ t:'stop him' }]);
    W.tick = ()=>{ if(cl.alive) C.hh.boss({ name:cl.name, sub:'the man with the plan', hp:cl.hp, max:wrong ? 900 : 700, phase:cl.hp > 400 ? 1 : 2 }); };
    W.scope({ remove:()=>{ W.tick = null; C.hh.boss(null); } });
    W.lockFreeze = false;
    W.onCrewFrozen = e=>{ if(e === cl){ setTimeout(()=>{ if(cl.frozen){ cl.frozen = false; cl.freeze = 0; if(cl.ice){ C.scene.remove(cl.ice); cl.ice = null; } } }, 3000); } };
    /* a shatter doesn't end clement: it takes a chunk */
    const origShatter = W.crew.shatter.bind(W.crew);
    W.crew.shatter = (e, dir)=>{ if(e !== cl) return origShatter(e, dir); if(cl.ice){ C.scene.remove(cl.ice); cl.ice = null; } cl.frozen = false; cl.freeze = 0; cl.hp -= 180; C.gore.iceBurst(cl.F.group.position, 20); C.audio.heist && C.audio.heist.hit('ice', cl.F.group.position); if(cl.hp <= 0) W.crew.kill(cl, { point:cl.F.group.position.clone().setY(1) }, false); };
    W.scope({ remove:()=>{ W.crew.shatter = origShatter; } });
    if(!await W.until(()=>!cl.alive || cl.hp < (wrong ? 360 : 280), tok)) return;
    /* the end of clement */
    W.cutscene = true; cl.state = 'script'; cl.aimAt = null; W.crew.stop(cl);
    const cp = cl.F.group.position.clone();
    D.appear(cp.x - Math.sin(cl.F.group.rotation.y)*1.6, cp.z - Math.cos(cl.F.group.rotation.y)*1.6, cl.F.group.rotation.y); D.state = 'script';
    C.hud.say(cl.name, wrong ? '...you. you came up. you came UP' : patched ? 'n-no. not again. not AGAIN' : 'oh no. no no. not you. not tonight', 3);
    if(!await W.wait(1.2, tok)) return;
    cl.alive = true; cl.F.armBusy = true;
    /* it takes him back to where it came from */
    const G = W.gold, gp = G.F.group.position.clone();
    W.fx.cook(cl.F, { dur:6 });
    C.audio.heist && C.audio.heist.scream(cp, 2);
    { const p = D.F.group.position, q = cl.F.group.position; let sc = 0;
      await navFollow(W, p, V(gp.x, 0, gp.z + (gp.z > p.z ? -1.6 : 1.6)), 1.5, tok, yaw=>{ D.F.group.rotation.y = yaw; q.set(p.x - Math.sin(yaw)*0.9, 0, p.z - Math.cos(yaw)*0.9); cl.F.group.rotation.y = yaw; W.fx.smear(cl, q.x, q.z, '#1a1210', 0.6); if(++sc % 40 === 0) C.audio.heist && C.audio.heist.scream(q, 1); }); }
    if(!W.ok(tok)) return;
    D.hide(); cl.F.group.visible = false; cl.alive = false; cl.cone.visible = false; cl.pool.visible = false;
    W.fx.flash(gp.clone().setY(1), 0xff6020, 8, 0.6); C.audio.heist && C.audio.heist.slam(gp); W.shake(1);
    if(G.fire){ W.fx.douse(G.fire); G.fire = null; }
    G.cav.visible = false;
    C.hud.say('', 'the gold fridge\'s doors close. the fire inside goes out. it goes very quiet.', 4);
    W.mood.drone(false); W.mood.crackle(false);
    if(!await W.wait(4, tok)) return;
    await ending(W, tok, 'stopped');
  }
};

/* ============================================================ the night itself */
function setupNight(W){
  const C = W.C;
  /* everybody who was here is part of it now */
  if(C.games.npcs){ C.games.npcs.list.slice().forEach(n=>C.games.npcs.despawn(n)); }
  /* the regular staff: the dealers are dead at their tables, the tellers too */
  C.staff.forEach(F=>{
    if(['DEALER', 'CROUPIER'].indexOf(F.name) >= 0 || F.name === 'MARGE' || F.name === 'PAT'){ F.custom = true; F.armBusy = true; F.inner.rotation.x = 0.95; F.inner.position.y = -0.35; F.inner.position.z = 0.15; if(F.armL){ F.armL.rotation.x = -1.4; F.armR.rotation.x = -0.4; } F.face.set('off', 1e9); const p = F.group.getWorldPosition(new THREE.Vector3()); C.gore.puddleAt(p.x + R(-0.3, 0.3), p.z + R(-0.3, 0.3), '#7a0a06', R(0.4, 0.7)); }
    if(F.name === 'PIT BOSS' || F.name === 'DOUG' || F.name === 'LUCKY LOU' || F.name === 'BOUNCER' || F.name === 'GUS' || F.name === 'THREE CUP NICKY' || F.name === 'OFFICER' || F.name === 'WORKER' || F.name === 'SECURITY') F.group.visible = false;
  });
  if(C.clement && C.clement.F) C.clement.F.group.visible = false;
  const gus = C.games.bar && C.games.bar.bt; if(gus){ gus.group.visible = true; C.gusHold = true; gus.group.position.set(-2.15, 0, -1); gus.inner.position.y = -0.45; }
  if(C.games.cups && C.games.cups.nicky) C.games.cups.nicky.group.visible = false;
  W.mood.dark(C.engine.preset() === 'low' ? 0.34 : 0.26);
  C.world.screens.forEach(s=>{ s._slides = s.slides; s.slides = [SLIDE_CALM]; s.i = 0; });
  W.cams.arm(true);
  W.onCamSpot = cam=>{ W.stats.seen++; W.pa(pick(['camera says somebody\'s moving by ' + cam.s.zone + '. go look.', 'i see you. ' + cam.s.zone + '. somebody go get that.', 'one of the dead ones is crawling. ' + cam.s.zone + '.']), 3.5); const e = W.crew.list.filter(c=>c.alive && c.state !== 'script' && c.state !== 'drag').sort((a, b)=>a.F.group.position.distanceTo(C.camera.position) - b.F.group.position.distanceTo(C.camera.position))[0]; if(e){ e.sus = Math.max(e.sus, 0.65); e.lastSeen = [C.player.pos.x, C.player.pos.z]; } };
  /* the dead */
  const dead = [[-15, 10], [-8, 9], [4, 11.5], [9, -9], [13.5, -5], [18, -3], [22, 1], [-2, -8.5], [7, 16.5], [-17, 15], [3, 19.6], [-26, -8], [16, 9], [10, 0.8], [-8.5, 5]];
  dead.forEach(([x, z])=>W.spawnPerson({ x, z, pose:pick(['face', 'back', 'face', 'side']), alive:false, cracked:Math.random() < 0.4, role:'corpse' }));
  /* the pile you wake up in */
  [[PILE.x - 1.0, PILE.z + 0.4, 'back', false], [PILE.x - 0.3, PILE.z - 1.2, 'face', false], [PILE.x + 1.0, PILE.z - 0.9, 'face', true], [PILE.x - 1.6, PILE.z - 0.7, 'side', false], [PILE.x - 0.8, PILE.z + 1.4, 'face', false]].forEach(([x, z, pose, faking])=>{ const p = W.spawnPerson({ x, z, pose, yaw:Math.atan2(x - PILE.x, z - PILE.z) + R(-0.3, 0.3), alive:false, role:'corpse', tag:'pile', cracked:!faking && Math.random() < 0.5 }); if(faking){ p.faking = true; p.F.face.set('sad', 1e9); } });
  /* hostages, face down, hands on their heads */
  for(let i=0;i<12;i++){ const x = -7 + (i % 6)*2.8 + R(-0.4, 0.4), z = 14.6 + Math.floor(i/6)*2.4 + R(-0.3, 0.3); W.spawnPerson({ x, z, yaw:R(-0.3, 0.3), pose:'face', role:'hostage' }); }
  /* puddles and smears from before you woke up */
  for(let i=0;i<10;i++){ let x = R(-20, 20), z = R(-10, 18); const len = R(2, 6), a = R(0, 6.28); for(let k=0;k<len/0.4;k++){ W.fx.smear('pre' + i, x, z, '#6a0805', 0.5); x += Math.cos(a)*0.4; z += Math.sin(a)*0.4; } W.fx.endSmear('pre' + i); }
  /* guards who stay put all night */
  W.amb = [
    W.crew.spawn({ x:4, z:12.8, yaw:Math.PI, name:'MASK', state:'route', weapon:'smg', route:[Object.assign([2.5, 12.8], { wait:4 }), Object.assign([10, 12.8], { wait:4 })] }),
    W.crew.spawn({ x:14, z:-2, yaw:0, name:'MASK', state:'route', weapon:'smg', route:[Object.assign([14.5, -4], { wait:3 }), Object.assign([15, 6], { wait:3 }), Object.assign([22, 6], { wait:3 }), Object.assign([22, -4], { wait:3 })] })
  ];
  W.amb.forEach(e=>{ e.speed = 0.85; });
}

/* the searchlight through the front doors */
function buildBeam(W){
  const C = W.C;
  const origin = V(0, 2.7, 21.5);
  const cone = new THREE.Mesh(new THREE.ConeGeometry(1.9, 17, 20, 1, true), new THREE.MeshBasicMaterial({ color:0xe8f0ff, transparent:true, opacity:0.07, depthWrite:false, blending:THREE.AdditiveBlending, side:THREE.DoubleSide, toneMapped:false }));
  cone.geometry.translate(0, -8.5, 0); cone.geometry.rotateX(-Math.PI/2); cone.position.copy(origin); cone.renderOrder = 7; C.scene.add(cone);
  const pool = new THREE.Mesh(new THREE.CircleGeometry(1, 24), new THREE.MeshBasicMaterial({ color:0xe8f0ff, transparent:true, opacity:0.22, depthWrite:false, blending:THREE.AdditiveBlending, toneMapped:false })); pool.rotation.x = -Math.PI/2; C.scene.add(pool);
  const b = { cone, pool, on:false, yaw:Math.PI, update(dt, t, sus){
    cone.visible = pool.visible = b.on; if(!b.on) return 0;
    b.yaw = Math.PI + Math.sin(t*0.42)*0.95; const pitch = 0.17;
    cone.rotation.set(0, 0, 0); cone.rotateY(b.yaw); cone.rotateX(pitch);
    const dist = origin.y/Math.tan(pitch); pool.position.set(origin.x + Math.sin(b.yaw)*dist, 0.013, origin.z + Math.cos(b.yaw)*dist); pool.scale.set(1.9, 3.4, 1); pool.rotation.z = -b.yaw;
    const cam = C.camera.position, dx = cam.x - origin.x, dz = cam.z - origin.z, d = Math.hypot(dx, dz);
    const a = Math.abs(Math.atan2(Math.sin(Math.atan2(dx, dz) - b.yaw), Math.cos(Math.atan2(dx, dz) - b.yaw)));
    let v = 0;
    if(d < 17 && a < 0.13 && los(C.collide, origin.x, origin.y, origin.z - 0.4, cam.x, cam.y - 0.05, cam.z)){ const B = W.body; v = (B.posture === 'prone' ? 0.35 : B.posture === 'crouch' ? 0.75 : 1)*(B.moving ? 1 : 0.5)*W.hideFactor(null); }
    return v > 0.05 ? sus + v*dt*1.6 : Math.max(0, sus - dt*0.8);
  } };
  return b;
}

/* the roll-up loading door behind the race screen */
function buildLoadingDoor(W){
  const C = W.C;
  const g = new THREE.Group(); g.position.set(7.9, 0, -21.82); C.scene.add(g);
  const slatM = new THREE.MeshStandardMaterial({ color:0x5a5e66, roughness:0.5, metalness:0.6 });
  const door = new THREE.Group(); g.add(door);
  for(let i=0;i<12;i++){ const s = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.2, 0.06), slatM); s.position.y = 0.1 + i*0.21; door.add(s); }
  const sign = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 0.3), new THREE.MeshBasicMaterial({ map:(()=>{ const c = canvas(256, 48), gg = c.getContext('2d'); gg.fillStyle = '#d8b020'; gg.fillRect(0, 0, 256, 48); gg.fillStyle = '#111'; gg.font = 'bold 26px Arial'; gg.textAlign = 'center'; gg.fillText('RACERS · LOADING', 128, 34); return tex(c); })(), toneMapped:false })); sign.position.set(0, 2.85, 0.05); g.add(sign);
  W.scope({ remove:()=>C.scene.remove(g) });
  return { g, open:()=>C.tweens.add({ dur:1.6, update:k=>{ door.position.y = k*2.4; door.scale.y = 1 - k*0.85; } }).then(()=>{ C.audio.door(g.position); }) };
}

/* ============================================================ the ride: backwards on a race fridge */
async function alleyRide(W, tok){
  const C = W.C, D = W.def, A = C.arsenal, P = C.player;
  W.cutscene = true;
  /* the alley, built out the back */
  const al = new THREE.Group(); C.scene.add(al); W.scope({ remove:()=>C.scene.remove(al) });
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(9, 90), new THREE.MeshStandardMaterial({ color:0x1a1a1e, roughness:0.9 })); ground.rotation.x = -Math.PI/2; ground.position.set(7.9, 0.005, -67); al.add(ground);
  const brickTex = (()=>{ const c = canvas(256, 256), g = c.getContext('2d'); g.fillStyle = '#2a1712'; g.fillRect(0, 0, 256, 256);
    for(let r=0;r<16;r++){ const off = r % 2 ? 16 : 0; for(let k=-1;k<8;k++){ const v = 70 + Math.random()*40; g.fillStyle = `rgb(${v + 30|0},${v*0.45|0},${v*0.32|0})`; g.fillRect(k*32 + off + 1, r*16 + 1, 30, 14); if(Math.random() < 0.08){ g.fillStyle = 'rgba(20,10,8,0.6)'; g.fillRect(k*32 + off + 4, r*16 + 4, 18, 6); } } }
    return tex(c, { repeat:[30, 2.4] }); })();
  /* somebody tagged it a long time ago */
  [['NO REFUNDS', 3.52, -38, 1], ['KEEP IT COLD', 12.28, -55, -1], ['FROST BITE #1', 3.52, -71, 1], ['who is hank', 12.28, -86, -1]].forEach(([txt, x, z, side])=>{
    const c = canvas(512, 128), g = c.getContext('2d'); g.fillStyle = 'rgba(232,226,208,0.5)'; g.font = 'bold 64px Arial'; g.textAlign = 'center'; g.save(); g.translate(256, 80); g.rotate(-0.06); g.fillText(txt, 0, 0); g.restore();
    const m = new THREE.Mesh(new THREE.PlaneGeometry(3, 0.75), new THREE.MeshBasicMaterial({ map:tex(c), transparent:true, depthWrite:false, color:0x8a8478 })); m.position.set(x, R(1.4, 2.6), z); m.rotation.y = side*Math.PI/2; al.add(m); });
  /* no new lights out here (a new light recompiles every shader mid-chase). the bricks carry a little of their own */
  const brick = new THREE.MeshStandardMaterial({ color:0xc8a090, map:brickTex, roughness:0.95, emissive:0xffffff, emissiveMap:brickTex, emissiveIntensity:0.12 });
  [[3.3, -67], [12.5, -67]].forEach(([x, z])=>{ const w = new THREE.Mesh(new THREE.BoxGeometry(0.4, 7, 90), brick); w.position.set(x, 3.5, z); al.add(w); });
  const lampM = new THREE.MeshBasicMaterial({ color:0xffb050, toneMapped:false });
  const junkM = new THREE.MeshStandardMaterial({ color:0x2a4a2a, roughness:0.7 });
  for(let z=-26; z>-110; z-=9){ const l = new THREE.Mesh(new THREE.SphereGeometry(0.15, 8, 6), lampM); l.position.set(z % 2 ? 3.7 : 12.1, 4.2, z); al.add(l); W.fx.flash(l.position, 0xffb050, 3, 9999); }
  const obst = [];
  for(let z=-34; z>-100; z-=R(8, 13)){ const x = Math.random() < 0.5 ? R(4.3, 6.3) : R(9.3, 11.3); const b = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.2, 0.9), junkM); b.position.set(x, 0.6, z); al.add(b); obst.push(b); }
  /* the racer */
  const racer = makeFridge({ style:'mini', face:true, arms:true, color:'#e33a3a', eye:'#ffd56a', acc:['bowtie'] });
  racer.group.position.set(7.9, 0, -20.6); racer.group.rotation.y = Math.PI; C.scene.add(racer.group); W.scope({ remove:()=>C.scene.remove(racer.group) });
  W.hank.F.group.visible = false;
  C.hud.say('', 'FROST BITE · the number three racer · has never lost a race this badly', 3);
  /* you sit on the back, facing the casino */
  P.mode = 'walk'; P.tw = null; C.input.setWalk(true); W.body.set('walk'); P.bodyMul = 0; P.pitch = 0; P.skipCol = ()=>true;
  W.scope({ remove:()=>{ P.skipCol = null; } });
  A.select('freon'); W.fightOn = true; C.hh.$('#hh-hp').style.display = '';
  W.hp = 100; W.cutscene = false;
  let z = -21.2, speed = 0, gap = 7, wind = 0, windCD = 5, blasted = 0, t = 0, done = false, crashed = false;
  D.appear(7.9, -16, Math.PI); D.state = 'script'; D.speed = 0;
  W.staggerTime = 1.6;
  W.onDefrosterStagger = ()=>{ gap = Math.min(16, gap + 4.5); wind = 0; windCD = R(4, 6); C.hud.say('THE MAN IN TAPE', pick(['GOOD. again when it lifts its arms.', 'it\'s falling back!', 'keep it cold!']), 1.8); };
  W.obj('THE ALLEY', [{ t:'when it lifts its arms, hit it with freon' }, { t:'hold on', opt:true }]);
  W.tip('it\'s right behind you. when it lifts its arms, freon it', 5000);
  P.yaw = Math.PI;
  await W.until(()=>{
    if(!W.ok(tok)) return true;
    const dt = 1/60; t += dt;
    speed = Math.min(5.2, speed + dt*2.4);
    z -= speed*dt;
    racer.group.position.set(7.9 + Math.sin(t*1.7)*0.6, 0, z); racer.inner.rotation.z = Math.sin(t*9)*0.05; racer.inner.position.y = Math.abs(Math.sin(t*12))*0.04;
    P.pos.set(racer.group.position.x, 0, z + 0.25); P.eyeTarget = 1.25;
    /* swerve around junk */
    for(const b of obst){ if(Math.abs(b.position.z - z) < 0.6 && Math.abs(b.position.x - racer.group.position.x) < 1.2 && !b.userData.hit){ b.userData.hit = true; C.gore.debrisBurst(b.position.clone(), 16, '#2a4a2a', V(0, 1, 1), 1.2); C.audio.heist && C.audio.heist.hit('wood', b.position); W.shake(0.6); b.visible = false; } }
    /* it runs after you */
    gap -= dt*(0.55 + t*0.012);
    const dz = z + gap; D.F.group.position.set(7.9 + Math.sin(t*0.9)*1.2, 0, dz); D.F.group.rotation.y = Math.PI;
    if(D.stagger <= 0){ D.F.inner.position.y = Math.abs(Math.sin(t*8))*0.08; D.F.inner.rotation.z = Math.sin(t*8)*0.08; D.F.armL.rotation.x = -1.2 + Math.sin(t*8)*0.6; D.F.armR.rotation.x = -1.2 - Math.sin(t*8)*0.6; }
    windCD -= dt;
    if(windCD <= 0 && wind <= 0 && D.stagger <= 0){ wind = 0.001; C.audio.tone({ f:120, f2:420, d:1.4, g:0.18, type:'sawtooth', filt:'lowpass', ff:900 }); }
    if(wind > 0){ wind += dt; D.windT = wind; D.F.armBusy = true; D.F.armL.rotation.set(-3.0, 0, -0.6); D.F.armR.rotation.set(-3.0, 0, 0.6);
      if(wind > 1.5){ /* the blast */ wind = 0; D.windT = 0; windCD = R(4.5, 7); blasted++; const from = D.F.group.position.clone().setY(1.5); for(let i=0;i<30;i++) W.fx.fire(from.clone().add(V(R(-0.5, 0.5), R(-0.3, 0.3), -R(0, gap))), 1.6); W.fx.flash(from, 0xff6020, 6, 0.3); C.audio.heist && C.audio.heist.explosion(from, 0.4); if(gap < 11){ W.hurt(gap < 5 ? 45 : 28, from, 'fire'); } } }
    if(gap < 1.5 && !W.dead){ W.hurt(200, D.F.group.position, 'fire'); return true; }
    if(z < -96){ done = true; return true; }
    return false;
  }, tok);
  if(!W.ok(tok) || W.dead) return;
  /* the end of the alley: it jumps */
  W.cutscene = true;
  C.hud.say('THE MAN IN TAPE', 'HOLD ON', 1.5);
  await C.tweens.add({ dur:0.6, update:k=>{ D.F.group.position.z = z + gap*(1 - k); D.F.group.position.y = Math.sin(k*Math.PI)*2; } });
  W.shake(1.6); C.audio.heist && C.audio.heist.slam(racer.group.position); C.audio.heist && C.audio.heist.explosion(racer.group.position, 0.8);
  await W.black(true, 120);
  W.mood.drone(false); W.mood.crackle(false); D.hide();
  await C.tweens.sleep(2.5);
  if(!W.ok(tok)) return;
  /* morning */
  racer.group.rotation.z = Math.PI/2; racer.group.position.set(9.3, 0.3, z - 2);
  P.pos.set(7.7, 0, z); P.eyeTarget = 0.35; P.pitch = -0.2; P.yaw = 0.6;
  W.mood.restore(); C.scene.environmentIntensity = 0.3;
  const pile = new THREE.Mesh(new THREE.TorusGeometry(0.25, 0.08, 6, 14), new THREE.MeshStandardMaterial({ color:0xb89a62, roughness:0.5 })); pile.rotation.x = Math.PI/2; pile.position.set(6.7, 0.06, z - 0.8); C.scene.add(pile); W.scope({ remove:()=>C.scene.remove(pile) });
  const tag = new THREE.Mesh(new THREE.PlaneGeometry(0.14, 0.05), W.hank.tag.material); tag.rotation.x = -Math.PI/2; tag.position.set(6.8, 0.1, z - 0.7); C.scene.add(tag); W.scope({ remove:()=>C.scene.remove(tag) });
  await W.black(false, 2400);
  W.body.set('crawl'); P.bodyMul = 0; P.skipCol = ()=>true;
  C.hud.say('', 'the man in tape is gone. his tape is in a pile next to you, like he stepped out of it.', 5);
  let looked = false;
  const it = { heist:true, pos:V(6.8, 0.4, z - 0.75), r:2.2, text:()=>looked ? null : 'the tape', enabled:()=>!looked, use:()=>{ looked = true; } };
  C.world.interact.push(it); W.scope({ remove:()=>{ const i = C.world.interact.indexOf(it); if(i >= 0) C.world.interact.splice(i, 1); } });
  await Promise.race([W.until(()=>looked, tok), C.tweens.sleep(14)]);
  if(looked){ C.hud.say('', 'there\'s a name tag stuck in the tape. it says HANK.', 4); C.save.egg('hank') && C.hud.toast('secret: he went home', 'gold'); try{ VENDOR.see('casino:hank'); }catch(e){} await C.tweens.sleep(4); }
  await ending(W, tok, 'escaped');
}

/* ============================================================ nicky's last game, in front of the vault */
function buildVaultGame(W){
  const C = W.C;
  const at = V(26.2, 0, 17.5);
  const grp = new THREE.Group(); grp.position.copy(at); C.scene.add(grp);
  const box = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.74, 0.66), new THREE.MeshStandardMaterial({ color:0xb8894e, roughness:0.95 })); box.position.y = 0.37; grp.add(box);
  const nicky = makeFridge({ face:true, arms:true, style:'mini', color:'#3a3a40', trim:'#1a1a1e', acc:['beanie', 'chain'], beanie:'#c0392b', eye:'#5dff9c' });
  nicky.group.position.set(0.62, 0, 0); nicky.group.rotation.y = -Math.PI/2; grp.add(nicky.group); nicky.face.set('smug', 1e9);
  const wire = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 2.4, 6), new THREE.MeshBasicMaterial({ color:0xff2020, toneMapped:false })); wire.rotation.z = Math.PI/2; wire.position.set(1.6, 0.05, 0.6); grp.add(wire);
  const brick = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.2, 0.2), new THREE.MeshStandardMaterial({ color:0xd8d0a8 })); brick.position.set(2.8, 0.1, 0.6); grp.add(brick);
  const cupM = new THREE.MeshStandardMaterial({ color:0xd0182a, roughness:0.35 }), cupG = new THREE.CylinderGeometry(0.034, 0.048, 0.1, 18);
  const CY = 0.74 + 0.052, slotZ = i=>(i - 1)*0.16;
  const cups = [0, 1, 2].map(i=>{ const m = new THREE.Mesh(cupG, cupM); m.position.set(0, CY, slotZ(i)); m.userData.slot = i; grp.add(m); return m; });
  const ball = new THREE.Mesh(new THREE.SphereGeometry(0.019, 12, 8), new THREE.MeshBasicMaterial({ color:0xff2a2a, toneMapped:false })); ball.position.set(0, 0.763, 0); grp.add(ball);
  const cupAt = s=>cups.find(c=>c.userData.slot === s);
  const lift = (c, up)=>C.tweens.add({ dur:0.25, update:k=>{ const kk = up ? k : 1 - k; c.position.y = CY + kk*0.13; c.rotation.z = kk*0.45; } });
  return { at, nicky, remove:()=>C.scene.remove(grp),
    async play(tok){
      const pick3 = ()=>Math.floor(Math.random()*3);
      let ballCup = cups[1]; const palm = Math.random() < 0.5;
      await lift(ballCup, true); await C.tweens.sleep(0.8); await lift(ballCup, false);
      C.hud.say('THREE CUP NICKY', 'watch close. you\'re good at this. that\'s why i picked you.', 3);
      const moves = 14, dur = 0.2;
      for(let i=0;i<moves;i++){
        if(!W.ok(tok)) return 'stop';
        if(palm && i === 7){ nicky.face.set('smug', 0.3); nicky.face.lookT.x = -1.4; nicky.face.look.x = -1.4; C.audio.tone({ f:2400, type:'square', d:0.015, g:0.012 }); ballCup = null; ball.visible = false; nicky.armL.rotation.x = -1.8; setTimeout(()=>{ nicky.armL.rotation.x = 0; }, 300); }
        const a = pick3(); let b = pick3(); while(b === a) b = pick3();
        const ca = cupAt(a), cb = cupAt(b), za = slotZ(a), zb = slotZ(b);
        await C.tweens.add({ dur, update:k=>{ const s = Math.sin(k*Math.PI); ca.position.z = za + (zb - za)*k; ca.position.x = s*0.07; cb.position.z = zb + (za - zb)*k; cb.position.x = -s*0.07; if(ballCup){ ball.position.z = ballCup.position.z; ball.position.x = ballCup.position.x; } } });
        ca.userData.slot = b; cb.userData.slot = a;
      }
      C.hud.say('THREE CUP NICKY', 'go on. pick. or say what you\'re thinking.', 3);
      W.tip(C.input.touch ? 'tap a cup · or tap CALL HIM OUT' : 'A / S / D picks left, middle, right · C calls him out', 9999);
      const q = W.ui.$('.qte'); q.innerHTML = 'CALL HIM OUT<small>' + (C.input.touch ? 'TAP' : 'C') + '</small>'; q.style.top = '86%'; q.classList.add('on');
      const ans = await new Promise(res=>{
        const kh = e=>{ const m = { KeyA:0, KeyS:1, KeyD:2, Digit1:0, Digit2:1, Digit3:2 }; if(e.code in m){ done(m[e.code]); } else if(e.code === 'KeyC') done('call'); };
        const ray = new THREE.Raycaster(), nd = new THREE.Vector2(), dom = C.engine.renderer.domElement;
        const ck = e=>{ const r = dom.getBoundingClientRect(); nd.set(((e.clientX - r.left)/r.width)*2 - 1, -((e.clientY - r.top)/r.height)*2 + 1); ray.setFromCamera(nd, C.camera); const h = ray.intersectObjects(cups, false)[0]; if(h) done(h.object.userData.slot); };
        const done = v=>{ C.bus.off('key', kh); dom.removeEventListener('pointerdown', ck); q.onclick = null; q.classList.remove('on'); W.tip(null); res(v); };
        C.bus.on('key', kh); dom.addEventListener('pointerdown', ck); q.onclick = ()=>done('call');
      });
      q.innerHTML = 'QUICK DIVE<small>SPACE</small>'; q.style.top = '';
      if(ans === 'call'){ if(palm){ await Promise.all(cups.map(c=>lift(c, true))); ball.visible = true; ball.position.set(0.45, 0.74, -0.1); nicky.armL.rotation.x = -1.4; C.tweens.to(ball, { pos:V(0.05, 0.763, 0), dur:0.5, arc:0.06 }); return 'caught'; } await Promise.all(cups.map(c=>lift(c, true))); C.hud.say('THREE CUP NICKY', 'it was right there. you know what that means.', 2.5); await C.tweens.sleep(1.4); return 'boom'; }
      const c = cupAt(ans); await lift(c, true);
      if(!palm && ballCup === c){ return 'won'; }
      C.hud.say('THREE CUP NICKY', 'wrong cup.', 1.5); await C.tweens.sleep(1.0); return 'boom';
    } };
}

/* ============================================================ the end */
async function ending(W, tok, how){
  const C = W.C, S = W.S;
  S.ending = how; S.done = S.done || {}; S.done[how] = true; C.save.write();
  C.save.egg('coldopen') && C.hud.toast('secret: cold open', 'gold');
  if(S.done.escaped && S.done.stopped) C.save.egg('bothways') && C.hud.toast('secret: both ways out', 'gold');
  if(how === 'stopped' && W.stats.kills === 0) C.save.egg('nokill') && C.hud.toast('secret: cold hands', 'gold');
  await C.tweens.sleep(1.5);
  const mins = Math.round((performance.now() - W.stats.start)/60000);
  const r = await C.hh.card(how === 'escaped'
    ? `<h1>ESCAPED</h1><p>you got out. the man in tape didn't, or did, or was never there. the palace will open again. it always opens again.</p><p style="opacity:.65">${mins} minutes · spotted ${W.stats.seen} time${W.stats.seen === 1 ? '' : 's'} · ${W.stats.reflex} close call${W.stats.reflex === 1 ? '' : 's'}</p>`
    : `<h1>STOPPED</h1><p>nicky is in handcuffs. doug is alive. the gold fridge is closed with something inside it, and nobody is going to open it.</p><p style="opacity:.65">${mins} minutes · ${W.stats.frozen} frozen · spotted ${W.stats.seen} time${W.stats.seen === 1 ? '' : 's'}</p>`,
    [{ t:'WALK OUT', gold:true }]);
  W.finish(how);
}
