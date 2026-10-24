/* ============================================================
   FRIDGE PALACE HEIST: the morning after, and the one after that
   visit 1  crime scene: tape, chalk, your bullet holes, boards on
            the doors, no band, a cop at the door, doug "on leave"
   visit 2  pardon our dust: scaffolding, tarps, patched holes, a
            worker crew, a band of one, doug with a black eye
   visit 3  reopened: metal detectors, twice the security, cameras
   visit 4  GRAND REOPENING party, once
   after    back to normal, except the hole in the sign, framed
============================================================ */
import * as THREE from '../lib/three.module.min.js';
import { makeFridge } from '../world/fridge.js';
import { canvas, tex, plate } from '../world/textures.js';

const R = (a, b)=>a + Math.random()*(b - a);
const pick = a=>a[(Math.random()*a.length)|0];

export function stageFor(d){
  const H = d.heist || {};
  if(!H.robbedVisit) return { n:0, name:'normal' };
  const since = d.visits - H.robbedVisit;
  if(since <= 0) return { n:0, name:'normal', tonight:true };
  if(H.robbedKind === 'heat'){ return since === 1 ? { n:3, name:'reopened', heat:true } : { n:5, name:'remembered' }; }
  if(since === 1) return { n:1, name:'crime scene' };
  if(since === 2) return { n:2, name:'pardon our dust' };
  if(since === 3) return { n:3, name:'reopened' };
  if(since >= 4 && !H.partyDone) return { n:4, name:'grand reopening' };
  return { n:5, name:'remembered' };
}

const tapeTex = (()=>{ let t = null; return ()=>t || (t = (()=>{ const c = canvas(512, 48), g = c.getContext('2d'); g.fillStyle = '#f2d21a'; g.fillRect(0, 0, 512, 48); g.fillStyle = '#111'; g.font = 'bold 26px Arial'; g.fillText('POLICE LINE · DO NOT CROSS · POLICE LINE', 6, 33); const tx = tex(c); tx.wrapS = THREE.RepeatWrapping; return tx; })()); })();
const chalkTex = (()=>{ const c = canvas(256, 512), g = c.getContext('2d'); g.clearRect(0, 0, 256, 512); g.strokeStyle = 'rgba(245,245,240,0.9)'; g.lineWidth = 7; g.lineJoin = 'round';
  g.beginPath(); g.moveTo(68, 40); g.lineTo(188, 40); g.lineTo(190, 300); g.lineTo(240, 330); g.lineTo(232, 350); g.lineTo(188, 330); g.lineTo(190, 470); g.lineTo(66, 470); g.lineTo(66, 330); g.lineTo(20, 360); g.lineTo(12, 340); g.lineTo(66, 300); g.closePath(); g.stroke();
  g.strokeRect(92, 70, 72, 54); g.fillStyle = 'rgba(245,245,240,0.9)'; g.font = 'bold 22px Arial'; g.fillText('X  X', 100, 104);
  return tex(c, { nomip:true }); })();

export function applyAftermath(C, stage){
  const S = C.scene, M = C.M, H = C.save.d.heist;
  C.heistAftermath = stage;
  const n = stage.n;
  if(n === 0) { reminder(C, H, false); return; }
  /* tables shut for the crime scene; the slots never close */
  const closeGames = (re, msg)=>{ C.world.interact.forEach(it=>{ let t = ''; try{ t = typeof it.text === 'function' ? it.text() || '' : it.text || ''; }catch(e){} if(re.test(t)){ const en = it.enabled; it.enabled = ()=>false; C.world.interact.push({ pos:it.pos.clone(), r:it.r || 2.2, text:()=>'closed', use:()=>C.hud.toast(msg) }); } }); };
  const tape = (pts, y)=>{ for(let i=0;i<pts.length - 1;i++){ const [x1, z1] = pts[i], [x2, z2] = pts[i + 1]; const L = Math.hypot(x2 - x1, z2 - z1); const m = new THREE.Mesh(new THREE.PlaneGeometry(L, 0.08), new THREE.MeshBasicMaterial({ map:tapeTex(), side:THREE.DoubleSide })); m.material.map = tapeTex().clone(); m.material.map.repeat.set(L/2.4, 1); m.material.map.needsUpdate = true; m.position.set((x1 + x2)/2, y || 1.0, (z1 + z2)/2); m.rotation.y = -Math.atan2(z2 - z1, x2 - x1); m.rotation.z = Math.sin(i)*0.02; S.add(m); const post = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.5, 10), new THREE.MeshStandardMaterial({ color:0xff6a10, roughness:0.6 })); post.position.set(x1, 0.25, z1); S.add(post); } };
  if(n === 1){
    /* the crime scene */
    closeGames(/blackjack|roulette|hold'em|race|wheel/i, 'closed. there\'s a strip of police tape across it and a note that says "evidence".');
    tape([[8.5, 9.5], [8.5, -10], [25, -10], [25, 9.5], [8.5, 9.5]], 1.0);
    tape([[11.2, 13.2], [29, 13.2]], 1.0);
    tape([[-3.6, -4.6], [3.6, -4.6], [4.6, 2.6], [-4.6, 2.6], [-3.6, -4.6]], 1.05);
    for(let i=0;i<7;i++){ const ch = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 1.8), new THREE.MeshBasicMaterial({ map:chalkTex, transparent:true, depthWrite:false, polygonOffset:true, polygonOffsetFactor:-2 })); ch.rotation.x = -Math.PI/2; ch.rotation.z = R(0, 6.28); const spots = [[15, 3], [18, -4], [22, 10], [3, 16], [-2, 18.5], [10, 11], [27, 15.5], [13, -6], [-6, 6]]; const [x, z] = spots[i % spots.length]; ch.position.set(x + R(-1, 1), 0.012, z + R(-1, 1)); S.add(ch); }
    /* your holes are still in the walls */
    (H.holes || []).forEach(h=>{ C.gore.hole(new THREE.Vector3(h[0], h[1], h[2]), new THREE.Vector3(h[3], h[4], h[5]), 0.06); });
    for(let i=0;i<14;i++) C.gore.puddleAt(R(-10, 26), R(-8, 18), pick(['#6a1a10', '#d8d4c8', '#8a6a20', '#5a7a8a']), R(0.15, 0.5));
    /* boards over the doors */
    const wood = new THREE.MeshStandardMaterial({ color:0x8a6a42, roughness:0.85 });
    C.scene.traverse(o=>{ if(o.isMesh && o.material && o.material.opacity === 0.28 && Math.abs(o.position.z - 22) < 0.01) o.visible = false; });
    for(let i=0;i<7;i++){ const b = new THREE.Mesh(new THREE.BoxGeometry(6.4, 0.24, 0.05), wood); b.position.set(R(-0.2, 0.2), 0.5 + i*0.42, 21.88); b.rotation.z = R(-0.12, 0.12); S.add(b); }
    /* scattered chips and glass */
    const chipM = [0xd02a2a, 0x2a5ad0, 0x2aa04a, 0x111111, 0xf0f0f0].map(c=>new THREE.MeshStandardMaterial({ color:c, roughness:0.4 }));
    const cg = new THREE.CylinderGeometry(0.035, 0.035, 0.01, 12);
    for(let i=0;i<60;i++){ const m = new THREE.Mesh(cg, pick(chipM)); m.position.set(R(8, 28), 0.006, R(-8, 20)); if(m.position.z > 13.8 && m.position.x > 11.6) continue; S.add(m); }
    /* the gate is gone, a tarp over the hole */
    const K = C.world.cage; if(K){ K.gate.visible = false; const tarp = new THREE.Mesh(new THREE.PlaneGeometry(K.GX1 - K.GX0 + 0.2, 2.6), new THREE.MeshStandardMaterial({ color:0x2a5aa0, roughness:0.9, side:THREE.DoubleSide })); tarp.position.set((K.GX0 + K.GX1)/2, 1.3, K.z0 - 0.15); S.add(tarp); }
    /* the chandelier, if you brought it down */
    if(H.chandelier && C.world.lobbyChandelier){ const ch = C.world.lobbyChandelier; ch.position.y = 0.55; ch.rotation.z = 0.12; ch.rotation.x = -0.08; C.collide.circle(0, 15, 1.0, 'debris'); tape([[-2, 13], [2, 13], [2, 17], [-2, 17], [-2, 13]], 0.9); }
    /* a cop at the door */
    const cop = makeFridge({ face:true, arms:true, style:'tall', color:'#1c2a4a', eye:'#7ff3ff', acc:['nametag'] });
    cop.group.position.set(2.8, 0, 19.4); cop.group.rotation.y = -0.6; S.add(cop.group); cop.name = 'OFFICER'; cop.watch = true; C.staff.push(cop);
    C.collide.circle(2.8, 19.4, 0.45, 'bouncer');
    C.world.interact.push({ pos:new THREE.Vector3(2.8, 1.5, 19.4), r:2.6, text:()=>'talk to the officer', use:()=>{ cop.face.say(2); C.hud.say('OFFICER', pick(['casino\'s open, technically. don\'t touch the tape.', 'witnesses say it was a fridge. that narrows it down to everybody.', 'somebody shot the slots. the slots. who shoots a slot machine.', 'we found a mask in the lobby. you wouldn\'t know whose that is. right?', 'if you see a rusty one in a long coat, call us. we\'re told he\'s ' + (H.clementDead ? 'not a problem anymore.' : 'still out there.')])); } });
    /* doug is on leave; marge is awake for once */
    if(K && K.tellers){ K.doug.group.visible = false; const marge = K.tellers[0]; marge.face.set('neutral', 0); C.world.interact.push({ pos:new THREE.Vector3(11.7, 1.35, 15.3), r:2.2, text:()=>'talk to marge (awake?)', use:()=>{ marge.face.say(2); C.hud.say('MARGE', pick(['doug\'s on leave. stress. i\'m awake now. i hate it.', 'somebody made doug fill a bag. he\'s doing a lot of breathing exercises.', 'i slept through the whole thing. best night of my life.'])); } }); }
    C.noMusic = true; C.npcTarget = 5;
    C.world.lights.forEach(l=>l.intensity *= 0.75);
    try{ C.audio.hum && setTimeout(()=>{ try{ C._hum = C.audio.hum(new THREE.Vector3(0, 5, 0)); }catch(e){} }, 1500); }catch(e){}
  }
  if(n === 2){
    closeGames(/roulette|hold'em/i, 'closed for repairs. a sign says "the wheel is fine. the table is not."');
    /* scaffolding and tarps */
    const pipe = new THREE.MeshStandardMaterial({ color:0x9aa0a6, roughness:0.4, metalness:0.8 });
    const plank = new THREE.MeshStandardMaterial({ color:0x9a7a4a, roughness:0.9 });
    const tarpM = new THREE.MeshStandardMaterial({ color:0x2a5aa0, roughness:0.9, side:THREE.DoubleSide });
    const scaffold = (x, z, len, ry)=>{ const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = ry; S.add(g); for(let i=0;i<=len;i+=1.8) for(let s=0;s<2;s++){ const p = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 4, 6), pipe); p.position.set(i, 2, s*0.9); g.add(p); } [1.3, 2.6, 3.9].forEach(y=>{ const pl = new THREE.Mesh(new THREE.BoxGeometry(len, 0.05, 0.95), plank); pl.position.set(len/2, y, 0.45); g.add(pl); }); const t = new THREE.Mesh(new THREE.PlaneGeometry(len, 3.6), tarpM); t.position.set(len/2, 2.2, -0.05); g.add(t); };
    scaffold(12.4, 13.0, 10.8, 0); scaffold(29.0, -9, 7.2, Math.PI/2); scaffold(-29.0, -6, 9, -Math.PI/2);
    C.collide.box(12.4, 12.6, 23.2, 14.0, 'debris');
    const sign = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 0.6), new THREE.MeshStandardMaterial({ map:plate('PARDON OUR DUST · WE\'RE BETTER THAN EVER', { w:1024, h:128, size:42, bg:'#f2d21a', fg:'#111', rim:'#111' }), roughness:0.6 })); sign.position.set(0, 3.3, 20.5); sign.rotation.y = Math.PI; S.add(sign);
    /* patched holes: gray squares where the holes were */
    (H.holes || []).forEach(h=>{ const p = new THREE.Mesh(new THREE.PlaneGeometry(0.14, 0.14), new THREE.MeshStandardMaterial({ color:0x8a8a84, roughness:0.9, polygonOffset:true, polygonOffsetFactor:-3 })); const nv = new THREE.Vector3(h[3], h[4], h[5]); p.position.set(h[0] + nv.x*0.004, h[1] + nv.y*0.004, h[2] + nv.z*0.004); p.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), nv); S.add(p); });
    /* the crew */
    const hatM = new THREE.MeshStandardMaterial({ color:0xf2c020, roughness:0.4 });
    [[14, 11.5, 0.3], [27.4, -8, -1.3], [-27, -4, 1.4], [5, 15, -0.4]].forEach(([x, z, ry], i)=>{ const w = makeFridge({ face:true, arms:true, style:['std', 'tall', 'retro', 'std'][i], color:['#e8e8ea', '#cfd8dc', '#f4f1e6', '#d9a441'][i], eye:'#ffd56a', acc:['vest'], vest:'#ff7a10' }); const hat = new THREE.Mesh(new THREE.SphereGeometry(w.w*0.4, 14, 8, 0, Math.PI*2, 0, Math.PI/2), hatM); hat.position.y = w.top; w.inner.add(hat); w.group.position.set(x, 0, z); w.group.rotation.y = ry; S.add(w.group); w.name = 'WORKER'; w.watch = true; C.staff.push(w); C.collide.circle(x, z, 0.45, 'bouncer'); C.world.interact.push({ pos:new THREE.Vector3(x, 1.5, z), r:2.4, text:()=>'talk to the worker', use:()=>{ w.face.say(2); C.hud.say('WORKER', pick(['we patched forty one holes. somebody had a lot of bullets.', 'the aquarium guy cried. he cried a lot.', 'don\'t lean on that. or that. or me.', 'union break in five. it\'s always union break in five.', 'whoever did this had a real problem with slot machines.'])); C.audio.burst({ ff:900, q:2, d:0.08, g:0.3, t:0.2 }); } }); });
    C.musicSparse = true; C.npcTarget = 10;
    const K = C.world.cage; if(K && K.doug){ K.doug.face.blackeye = true; K.gate.visible = false; }
  }
  if(n >= 3){
    const K = C.world.cage; if(K && K.doug) K.doug.face.blackeye = true;
  }
  if(n === 3){
    /* metal detectors and a lot more security */
    const frameM = new THREE.MeshStandardMaterial({ color:0x3a3d44, roughness:0.4, metalness:0.7 });
    const det = [];
    [-1.6, 1.6].forEach(x=>{ const g = new THREE.Group(); g.position.set(x, 0, 19.6); S.add(g); [-0.5, 0.5].forEach(dx=>{ const p = new THREE.Mesh(new THREE.BoxGeometry(0.12, 2.2, 0.4), frameM); p.position.set(dx, 1.1, 0); g.add(p); }); const top = new THREE.Mesh(new THREE.BoxGeometry(1.12, 0.14, 0.4), frameM); top.position.y = 2.25; g.add(top); const led = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 6), new THREE.MeshBasicMaterial({ color:0x20ff40, toneMapped:false })); led.position.set(0, 2.36, 0.15); g.add(led); C.collide.box(x - 0.62, 19.4, x - 0.38, 19.8, 'detector'); C.collide.box(x + 0.38, 19.4, x + 0.62, 19.8, 'detector'); det.push({ x, led, cd:0 }); });
    C.collide.box(-0.98, 19.4, 0.98, 19.8, 'detector');
    C.world.detectors = det;
    const guards = [[-3.5, 18.5, 0.5], [3.5, 18.5, -0.5], [11, 12, -1], [-11, 12, 1], [16, -11, 0], [-16, -11, 0], [0, -6.5, 3.14], [24, 5, -1.6]];
    guards.forEach(([x, z, ry])=>{ const g = makeFridge({ face:true, arms:true, style:'std', color:'#2a2d34', eye:'#ffd56a', acc:['vest', 'headset'], vest:'#0f0f12' }); g.group.position.set(x, 0, z); g.group.rotation.y = ry; S.add(g.group); g.name = 'SECURITY'; g.watch = true; C.staff.push(g); C.collide.circle(x, z, 0.45, 'bouncer'); C.world.interact.push({ pos:new THREE.Vector3(x, 1.5, z), r:2.4, text:()=>'talk to security', use:()=>{ g.face.say(2); C.hud.say('SECURITY', pick(['new management. new rules. new me.', 'we\'re watching everybody. mostly you. no reason.', 'they doubled security. it\'s me and my brother. we\'re both named gary.', 'if you see a mask, report it. if you see a rusty fridge, run.', 'nobody\'s robbing this place twice. probably.'])); } }); });
    for(let i=0;i<10;i++){ const cam = new THREE.Mesh(new THREE.SphereGeometry(0.16, 12, 8, 0, Math.PI*2, Math.PI/2, Math.PI/2), new THREE.MeshStandardMaterial({ color:0x111, roughness:0.2, metalness:0.5 })); cam.position.set(-25 + i*5.5, 6.45, i % 2 ? -8 : 8); S.add(cam); }
    const ban = new THREE.Mesh(new THREE.PlaneGeometry(4.4, 0.6), new THREE.MeshStandardMaterial({ map:plate('NOW WITH 200% MORE SECURITY', { w:1024, h:128, size:46 }), roughness:0.5 })); ban.position.set(0, 3.4, 20.6); ban.rotation.y = Math.PI; S.add(ban);
  }
  if(n === 4){
    /* the party */
    H.partyDone = true; C.save.write();
    const cols = [0xff3fa4, 0x3fa4ff, 0xffd400, 0x5dff9c, 0xff7a10, 0xc060ff];
    for(let i=0;i<40;i++){ const g = new THREE.Group(); const x = R(-12, 12), z = R(9, 20); g.position.set(x, R(4.6, 6.1), z); const b = new THREE.Mesh(new THREE.SphereGeometry(0.22, 14, 10), new THREE.MeshStandardMaterial({ color:pick(cols), roughness:0.2, metalness:0.1 })); b.scale.y = 1.2; g.add(b); const str = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, 1.2, 4), new THREE.MeshBasicMaterial({ color:0xeeeeee })); str.position.y = -0.85; g.add(str); S.add(g); g.userData.bob = R(0, 6); (C.world.balloons = C.world.balloons || []).push(g); }
    const ban = new THREE.Mesh(new THREE.PlaneGeometry(7, 0.9), new THREE.MeshStandardMaterial({ map:plate('GRAND REOPENING · THE PALACE ENDURES', { w:1024, h:128, size:48, bg:'#7a1220', fg:'#ffd56a', rim:'#ffd56a' }), roughness:0.5 })); ban.position.set(0, 5.6, 11.65); S.add(ban);
    C.partyTonight = true;
    setTimeout(()=>{ try{ C.fx.confetti(new THREE.Vector3(0, 4, 16), 220); C.audio.cheer(new THREE.Vector3(0, 2, 14), 1.2); C.hud.big('GRAND REOPENING', '#ffd56a', 2600); C.hud.toast('free drink at the bar tonight. gus insisted.', 'gold'); }catch(e){} }, 1600);
    C.freeDrink = true;
  }
  if(n >= 3) reminder(C, H, true);
}
/* the hole in the sign, framed */
function reminder(C, H, show){
  if(!show || !H.robbedVisit) return;
  const S = C.scene;
  const p = H.logo || [1.3, 4.9];
  const fr = new THREE.Group(); fr.position.set(p[0], p[1], 11.62); S.add(fr);
  const gold = new THREE.MeshStandardMaterial({ color:0xe0aa45, roughness:0.25, metalness:1 });
  [[0, 0.16, 0.36, 0.03], [0, -0.16, 0.36, 0.03], [0.17, 0, 0.03, 0.35], [-0.17, 0, 0.03, 0.35]].forEach(([x, y, w, h])=>{ const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.03), gold); b.position.set(x, y, 0.01); fr.add(b); });
  const hole = new THREE.Mesh(new THREE.CircleGeometry(0.035, 16), new THREE.MeshBasicMaterial({ color:0x050505 })); hole.position.z = 0.012; fr.add(hole);
  const pl = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.08), new THREE.MeshStandardMaterial({ map:plate('A REMINDER', { w:256, h:48, size:30, bg:'#3a2a0a', fg:'#f7dc95' }), metalness:0.6, roughness:0.3 })); pl.position.set(0, -0.24, 0.012); fr.add(pl);
  C.world.interact.push({ pos:new THREE.Vector3(p[0], Math.min(p[1], 3), 11.4), r:4, text:()=>'look at the framed bullet hole', use:()=>{ C.hud.say('', 'a single bullet hole in the big gold sign, framed in gold, with a little plaque: A REMINDER. somebody keeps it polished.'); C.save.egg('reminder'); } });
}
/* metal detectors beep at you (called from the heist update) */
export function detectorTick(C, dt){
  const D = C.world.detectors; if(!D) return;
  const p = C.player.pos;
  for(const d of D){
    if(d.cd > 0){ d.cd -= dt; if(d.cd <= 0) d.led.material.color.setHex(0x20ff40); continue; }
    if(Math.abs(p.x - d.x) < 0.4 && Math.abs(p.z - 19.6) < 0.25){ d.cd = 2; d.led.material.color.setHex(0xff2020); C.audio.beep(false); C.audio.beep(false); C.hud.say('SECURITY', pick(['it\'s probably your fillings. go ahead.', 'beeped. you\'re fine. you\'re fine? go ahead.', 'it beeps at everybody. it beeped at gus.', 'what\'ve you got in there, a freon cannon? ha. go ahead.'])); }
  }
  if(C.world.balloons) for(const b of C.world.balloons){ b.userData.bob += dt; b.position.y += Math.sin(b.userData.bob)*0.002; b.rotation.z = Math.sin(b.userData.bob*0.7)*0.05; }
}
