/* ============================================================
   FRIDGE PALACE: the stuff nobody asked for
   staff door + keypad, the security room (live cameras, a guard
   who sleeps, hank's locker, a breaker you shouldn't touch),
   the legends gallery, the ren plaque, a mouse hole, disco mode,
   and sometimes, if you've been downstairs enough, a visitor.
============================================================ */
import * as THREE from '../lib/three.module.min.js';
import { G } from '../world/props.js';
import { makeFridge, animateFridge } from '../world/fridge.js';
import { canvas, tex, plate } from '../world/textures.js';
import { pick, rand } from '../core/util.js';

const CODE = '0420';
export function init(C){
  const { scene, M } = C, B = C.world.batch, D = C.world.anchors.staffDoor;
  const vm = ()=>{ try{ return window.VENDOR ? VENDOR.loadMem() : {}; }catch(e){ return {}; } };
  const saw = k=>{ try{ return VENDOR.sawAny(k); }catch(e){ return false; } };
  const mem = vm();
  const egg = (k, msg)=>{ if(C.save.egg(k) && msg) C.hud.toast(msg, 'gold'); };

  /* ---------- the staff door ---------- */
  const door = new THREE.Mesh(G.box, new THREE.MeshStandardMaterial({ color:0x2a2a30, roughness:0.4, metalness:0.6 }));
  door.scale.set(1.5, 2.4, 0.08); door.position.set(D.x, 1.2, D.z); scene.add(door);
  const doorCol = C.collide.box(D.x - 0.76, D.z - 0.2, D.x + 0.76, D.z + 0.2, 'staffdoor');
  const pad = new THREE.Mesh(G.box, M.black); pad.scale.set(0.16, 0.24, 0.04); pad.position.set(D.x + 1.05, 1.35, D.z + 0.17); scene.add(pad);
  const led = new THREE.Mesh(G.sph, new THREE.MeshBasicMaterial({ color:0xff2020, toneMapped:false })); led.scale.setScalar(0.015); led.position.set(D.x + 1.05, 1.5, D.z + 0.2); scene.add(led);
  let open = false, wrong = 0;
  const openDoor = ()=>{ if(open) return; open = true; doorCol.on = false; led.material.color.setHex(0x20ff60); C.audio.door(door.position); C.tweens.to(door, { pos:new THREE.Vector3(D.x + 1.5, 1.2, D.z - 0.1), dur:1.2 }); };
  C.world.interact.push({ pos:new THREE.Vector3(D.x + 1.05, 1.35, D.z + 0.2), r:2, text:()=>open ? null : 'keypad', enabled:()=>!open, use:()=>keypad() });
  function keypad(){
    C.input.quietUnlock();
    let typed = '';
    const b = C.hud.modal({ title:'STAFF ONLY', html:`<div class="kp-screen" id="kp-s">____</div><div class="kp">${[1,2,3,4,5,6,7,8,9,'C',0,'⏎'].map(k=>`<button data-k="${k}">${k}</button>`).join('')}</div><div class="fp-dim" style="text-align:center" id="kp-m">${C.save.d.eggs.staffdoor ? 'your thumb remembers the code.' : 'four digits.'}</div>` });
    const scr = b.querySelector('#kp-s'), m = b.querySelector('#kp-m');
    const show = ()=>{ scr.textContent = (typed + '____').slice(0, 4); };
    const enter = ()=>{
      if(typed === CODE){ C.audio.beep(true); scr.textContent = 'OPEN'; scr.style.color = '#5dff9c'; egg('staffdoor', 'staff door unlocked'); setTimeout(()=>{ C.hud.modal(null); openDoor(); }, 500); }
      else { C.audio.beep(false); wrong++; scr.textContent = 'NOPE'; scr.style.color = '#ff4a4a'; typed = ''; setTimeout(()=>{ scr.style.color = ''; show(); }, 700);
        m.textContent = wrong >= 3 ? 'security has been notified. security is pat. pat says hi.' : pick(['wrong.', 'not that.', 'the light stays red.', 'someone on the floor knows it.']); }
    };
    b.querySelectorAll('[data-k]').forEach(btn=>btn.onclick = ()=>{ const k = btn.dataset.k; C.audio.key(); if(k === 'C'){ typed = ''; show(); return; } if(k === '⏎'){ enter(); return; } if(typed.length < 4){ typed += k; show(); if(typed.length === 4) setTimeout(enter, 250); } });
    const kh = e=>{ if(!C.hud.modalOpen){ C.bus.off('key', kh); return; } if(/^Digit\d$/.test(e.code) && typed.length < 4){ typed += e.code.slice(5); C.audio.key(); show(); if(typed.length === 4) setTimeout(enter, 250); } if(e.code === 'Backspace'){ typed = typed.slice(0, -1); show(); } };
    C.bus.on('key', kh);
  }
  /* the note with the code: on the cage counter, half under a stapler */
  const nc = canvas(256, 256), ng = nc.getContext('2d'); ng.fillStyle = '#ffec5c'; ng.fillRect(0, 0, 256, 256); ng.fillStyle = '#333'; ng.font = '30px "Pacifico", cursive'; ng.fillText('staff door', 24, 70); ng.font = 'bold 64px Georgia'; ng.fillText('4/20', 40, 150); ng.font = '22px Georgia'; ng.fillText("don't tell pat", 40, 210);
  const note = new THREE.Mesh(new THREE.PlaneGeometry(0.12, 0.12), new THREE.MeshStandardMaterial({ map:tex(nc), roughness:0.8 })); note.rotation.set(-Math.PI/2, 0, 0.4); note.position.set(11.72, 1.165, 18.75); scene.add(note);
  C.world.interact.push({ pos:new THREE.Vector3(11.72, 1.2, 18.75), r:1.6, text:()=>'a sticky note', use:()=>{ C.hud.say('', 'a yellow sticky note. "staff door 4/20. don\'t tell pat." somebody drew a little fridge next to it.'); egg('note'); } });

  /* ---------- the security room ---------- */
  const SR = C.world.anchors.staff;
  /* monitor wall */
  const cams = [];
  const mkRT = ()=>new THREE.WebGLRenderTarget(256, 160, { type:THREE.UnsignedByteType });
  const feeds = [
    { name:'CAM 01 · FLOOR', pos:new THREE.Vector3(0, 5.6, 18), look:new THREE.Vector3(0, 0, -2) },
    { name:'CAM 02 · SLOTS', pos:new THREE.Vector3(-8.5, 5.2, -6), look:new THREE.Vector3(-20, 0, 2) },
    { name:'CAM 03 · TABLES', pos:new THREE.Vector3(26, 5.2, 9), look:new THREE.Vector3(14, 0, -4) },
    { name:'CAM 05 · THE CLUB', pos:new THREE.Vector3(13, 4.5, -15), look:new THREE.Vector3(24, 0, -20) }
  ];
  feeds.forEach(f=>{ const cam = new THREE.PerspectiveCamera(70, 256/160, 0.1, 80); cam.position.copy(f.pos); cam.lookAt(f.look); f.cam = cam; f.rt = mkRT(); cams.push(f); });
  const overlayCanvas = (label)=>{ const c = canvas(256, 40), g = c.getContext('2d'); g.fillStyle = 'rgba(0,0,0,0)'; g.clearRect(0, 0, 256, 40); g.fillStyle = '#fff'; g.font = 'bold 16px monospace'; g.fillText(label, 8, 24); g.fillStyle = '#f33'; g.beginPath(); g.arc(240, 18, 6, 0, 7); g.fill(); return tex(c); };
  /* the basement feed is drawn, not rendered */
  const bc = canvas(256, 160), bg = bc.getContext('2d'), btx = tex(bc, { nomip:true });
  const screens = [];
  const sx0 = -25, sy = [2.4, 1.55];
  const slots = [cams[0], cams[1], cams[2], cams[3], { name:'CAM 06 · VAULT', drawn:'vault' }, { name:'CAM 07 · BASEMENT', drawn:'basement' }];
  slots.forEach((f, i)=>{
    const x = sx0 + (i % 3)*1.4 + 1.4, y = sy[Math.floor(i/3)];
    B.add(G.box, M.black, x, y, SR.minZ + 0.2, 1.3, 0.85, 0.12);
    const mat = new THREE.MeshBasicMaterial({ map:f.rt ? f.rt.texture : (f.drawn === 'basement' ? btx : null), color:f.rt ? 0xcfe8cf : 0xffffff });
    if(f.drawn === 'vault'){ const c = canvas(256, 160), g = c.getContext('2d'); g.fillStyle = '#111'; g.fillRect(0, 0, 256, 160); g.strokeStyle = '#555'; g.lineWidth = 6; g.beginPath(); g.arc(128, 84, 54, 0, 7); g.stroke(); for(let k=0;k<6;k++){ const a = k*Math.PI/3; g.beginPath(); g.moveTo(128, 84); g.lineTo(128 + Math.cos(a)*44, 84 + Math.sin(a)*44); g.stroke(); } g.fillStyle = '#7f7'; g.font = '12px monospace'; g.fillText('NO MOTION', 8, 150); mat.map = tex(c); }
    const sc = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 0.75), mat); sc.position.set(x, y, SR.minZ + 0.27); scene.add(sc);
    const ol = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 0.19), new THREE.MeshBasicMaterial({ map:overlayCanvas(f.name), transparent:true, toneMapped:false })); ol.position.set(x, y + 0.28, SR.minZ + 0.28); scene.add(ol);
    screens.push({ f, sc, x, y });
  });
  C.world.interact.push({ pos:new THREE.Vector3(-22.2, 1.55, SR.minZ + 0.4), r:2.6, text:()=>'watch camera 07', use:()=>{ const m = vm(); C.hud.say('', (m.deaths || 0) >= 1 ? pick(['the basement. you know that hallway.', 'a bulb swings. nothing else moves. then something else moves.', 'the timestamp on camera 07 is from a night that hasn\'t happened yet.']) : 'camera 07 shows a dark hallway full of old fridges. the label says BASEMENT. that\'s new.'); egg('cam07'); C.audio.whisper('hello'); } });
  /* desk, the guard, the log */
  B.add(G.box, M.woodDark, -21, 0.38, -19.6, 3.2, 0.76, 1.0);
  B.add(G.box, M.black, -21, 0.78, -19.6, 3.3, 0.04, 1.1);
  const guard = makeFridge({ face:true, arms:true, color:'#2a2a30', acc:['headset'], eye:'#7ff3ff', style:'std' });
  guard.group.position.set(-19.8, 0, -18.6); guard.group.rotation.y = Math.PI + 0.3; guard.group.scale.setScalar(0.95); scene.add(guard.group); guard.face.set('sleepy', 1e9); C.staff.push(guard); guard.name = 'NIGHT GUARD';
  const zc = canvas(64, 64), zg = zc.getContext('2d'); zg.fillStyle = '#fff'; zg.font = 'bold 48px Georgia'; zg.fillText('Z', 14, 50);
  const zs = []; for(let i=0;i<3;i++){ const z = new THREE.Sprite(new THREE.SpriteMaterial({ map:tex(zc), transparent:true, depthWrite:false })); z.scale.setScalar(0.18); scene.add(z); zs.push({ s:z, t:i*0.9 }); }
  C.collide.boxC(-21, -19.6, 3.3, 1.1, 0, 'desk');
  C.world.interact.push({ pos:new THREE.Vector3(-19.8, 1.4, -18.6), r:2.2, text:()=>'wake the night guard', use:()=>{ guard.face.set('shock', 1.5); setTimeout(()=>guard.face.set('sleepy', 1e9), 1800); C.hud.say('NIGHT GUARD', pick(["i'm awake. i'm watching. everything's fine. you're not supposed to be here. it's fine.", "camera seven? don't look at camera seven. i don't look at camera seven.", "who gave you the code. it was pat. it's always pat.", "zzz. i'm awake. zzz."])); } });
  C.world.interact.push({ pos:new THREE.Vector3(-22, 0.85, -19.4), r:1.8, text:()=>'read the visitor log', use:()=>{
    C.input.quietUnlock();
    const m = vm(), d = C.save.d, first = new Date(d.firstVisit);
    const rows = [`<tr><td>you</td><td>${d.visits} visit${d.visits === 1 ? '' : 's'} since ${first.toLocaleDateString()}</td></tr>`, `<tr><td>a bartender named gus</td><td>every night since the ice age</td></tr>`];
    if((m.deaths || 0) >= 1) rows.push(`<tr><td>unknown · beige · tall</td><td>every night · 3:13 am · stands in the lobby for a while · leaves</td></tr>`);
    if(saw(['wall:hank', 'tag:26'])) rows.push(`<tr><td>hank</td><td>signed out. never signed back in. the i's are dotted with little circles.</td></tr>`);
    if(C.save.d.podium) rows.push(`<tr><td>the podium fridge</td><td>left with you</td></tr>`);
    C.hud.modal({ title:'VISITOR LOG', html:`<table class="fp-pay">${rows.join('')}</table>` }); egg('log');
  } });
  /* lockers */
  for(let i=0;i<7;i++){ const z = -21.2 + i*0.62; B.add(G.box, i === 3 ? new THREE.MeshStandardMaterial({ color:0x6a6a2a, roughness:0.5, metalness:0.5 }) : M.steel, -29.65, 1.0, z, 0.5, 2.0, 0.58); B.add(G.box, M.black, -29.39, 1.6, z, 0.02, 0.2, 0.3); }
  const hl = new THREE.Mesh(new THREE.PlaneGeometry(0.3, 0.08), new THREE.MeshStandardMaterial({ map:plate('HANK', { w:256, h:64, size:36, bg:'#efe4c8', fg:'#222', rim:'#666' }), roughness:0.7 })); hl.position.set(-29.38, 1.85, -21.2 + 3*0.62); hl.rotation.y = Math.PI/2; scene.add(hl);
  C.collide.box(-30, -21.6, -29.3, -16.8, 'lockers');
  C.world.interact.push({ pos:new THREE.Vector3(-29.3, 1.4, -21.2 + 3*0.62), r:1.8, text:()=>'open hank\'s locker', use:()=>{
    C.input.quietUnlock();
    const knows = saw(['wall:hank', 'tag:26']);
    C.hud.modal({ title:"HANK'S LOCKER", html: knows
      ? `<p>a folded work shirt with a name patch. a thermos, empty. a photo of a fridge showroom, before. a note:</p><p style="font-family:'Pacifico',cursive;font-size:18px;color:#f3e6c0">"going home. tell the big one i said goodnight. don't let them sell it."</p><p class="fp-dim">the i's are dotted with little circles.</p>`
      : `<p>a work shirt with a name patch: HANK. a thermos. a photo of a fridge showroom. a note that just says "going home."</p><p class="fp-dim">you don't know who hank is. yet.</p>` });
    egg('hank', knows ? 'you found hank\'s locker' : null); C.audio.door(new THREE.Vector3(-29.5, 1, -19.3));
  } });
  /* the breaker */
  B.add(G.box, M.steel, -12.25, 1.5, -16, 0.1, 0.8, 0.55);
  let breakerCD = 0;
  C.world.interact.push({ pos:new THREE.Vector3(-12.4, 1.5, -16), r:2, text:()=>breakerCD > 0 ? null : 'flip the main breaker', use:async ()=>{
    breakerCD = 12; egg('breaker', 'you killed the lights');
    C.audio.tone({ f:80, f2:40, d:0.6, g:0.3, type:'square', filt:'lowpass', ff:300 });
    const ls = C.world.lights.map(l=>[l, l.intensity]); const hemi = C.scene.children.filter(o=>o.isHemisphereLight || o.isAmbientLight).map(l=>[l, l.intensity]);
    ls.forEach(([l])=>l.intensity = 0); hemi.forEach(([l, i])=>l.intensity = i*0.08);
    C.world.neon.forEach(n=>n.visible = false);
    C.audio.duck(true);
    C.hud.say('', 'everything goes dark. the whole building goes "aww".'); C.audio.aww(new THREE.Vector3(0, 2, 0));
    await C.tweens.sleep(2.5);
    if(vm().deaths >= 1){ C.audio.whisper('i like the dark'); C.hud.say('', 'in the dark, someone very close says "i like the dark."'); await C.tweens.sleep(2); }
    ls.forEach(([l, i])=>l.intensity = i); hemi.forEach(([l, i])=>l.intensity = i); C.world.neon.forEach(n=>n.visible = true); C.audio.duck(false);
    C.hud.say('NIGHT GUARD', 'who did that. was that you. don\'t do that.');
  } });
  const poster = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 1.0), new THREE.MeshStandardMaterial({ map:(()=>{ const c = canvas(256, 320), g = c.getContext('2d'); g.fillStyle = '#efe4c8'; g.fillRect(0, 0, 256, 320); g.fillStyle = '#7a1220'; g.font = 'bold 22px Georgia'; g.textAlign = 'center'; g.fillText('EMPLOYEE', 128, 40); g.fillText('OF THE MONTH', 128, 66); g.fillStyle = '#aaa'; g.fillRect(48, 86, 160, 150); const knows = saw(['wall:hank', 'tag:26']); g.fillStyle = '#333'; g.font = 'bold 34px Georgia'; g.fillText(knows ? 'HANK' : '_______', 128, 280); g.font = '14px Georgia'; g.fillText(knows ? 'every month since 1988' : 'position open', 128, 304); if(knows){ g.fillStyle = '#666'; g.fillRect(98, 120, 60, 90); } return tex(c); })(), roughness:0.7 }));
  poster.position.set(-15, 1.8, SR.minZ + 0.17); scene.add(poster);

  /* ---------- the legends gallery: the fish you're proudest of ---------- */
  const fishSave = (()=>{ try{ return JSON.parse(localStorage.getItem('fridgefish_v1') || 'null'); }catch(e){ return null; } })();
  const legends = (window.FISHDATA ? FISHDATA.FISH : []).filter(f=>f.rar >= 4);
  legends.forEach((f, i)=>{
    const x = -26.5 + i*1.95, z = 21.82;
    const got = fishSave && fishSave.dex && fishSave.dex[f.id];
    const c = canvas(320, 220), g = c.getContext('2d'); g.fillStyle = got ? '#10202c' : '#4a4a56'; g.fillRect(0, 0, 320, 220);
    g.save(); g.translate(30, 15); if(window.FISHING && FISHING.paint) FISHING.paint(g, f, 260, 160, !got); g.restore();
    g.fillStyle = got ? '#f3cf74' : '#555'; g.font = 'bold 18px Georgia'; g.textAlign = 'center'; g.fillText(got ? f.name.toUpperCase() : '? ? ?', 160, 205);
    B.add(G.box, M.gold, x, 1.85, z - 0.03, 1.15, 0.85, 0.05);
    const pic = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 0.7), new THREE.MeshBasicMaterial({ map:tex(c), color:0xd0d0d0 })); pic.position.set(x, 1.85, z - 0.065); pic.rotation.y = Math.PI; scene.add(pic);
    C.world.interact.push({ pos:new THREE.Vector3(x, 1.85, z - 0.2), r:2, text:()=>got ? 'look at ' + f.name : 'an empty frame', use:()=>{ C.hud.say(got ? f.name.toUpperCase() : '', got ? f.blurb + ' (best: ' + fishSave.dex[f.id].best + 'cm)' : 'the plaque says this frame is waiting for something you haven\'t caught. the fishing pond is upstairs.'); } });
  });
  if(legends.length){ const pl = new THREE.Mesh(new THREE.PlaneGeometry(3, 0.32), new THREE.MeshStandardMaterial({ map:plate('THE LEGENDS · CAUGHT UPSTAIRS', { w:1024, h:110, size:44 }), roughness:0.4 })); pl.position.set(-26.5 + (legends.length - 1)*1.95/2, 2.65, 21.75); pl.rotation.y = Math.PI; scene.add(pl); }

  /* ---------- the ren plaque ---------- */
  const rt = C.games.roulette && C.games.roulette.tables[0];
  if(rt){
    const pq = new THREE.Mesh(new THREE.PlaneGeometry(0.22, 0.07), new THREE.MeshStandardMaterial({ map:plate('REN · 38', { w:256, h:80, size:40, bg:'#3a2a0a', fg:'#f7dc95' }), metalness:0.6, roughness:0.3 }));
    pq.position.set(1.15, rt.topY + 0.1, 0.785); pq.rotation.x = -0.3; rt.grp.add(pq);
    const w = new THREE.Vector3(1.15, rt.topY + 0.1, 0.9).applyMatrix4(rt.grp.matrixWorld);
    C.world.interact.push({ pos:w, r:1.6, text:()=>'a brass plaque', use:()=>{ C.hud.say('', 'IN MEMORY OF THE LEGACY RUSSIAN ROULETTE SYSTEM. REN IS THE KING. 38. somebody glued a single chip to it.'); egg('ren', 'the king is remembered'); } });
  }
  /* ---------- the mouse hole ---------- */
  const hole = new THREE.Mesh(new THREE.CircleGeometry(0.11, 24, 0, Math.PI), new THREE.MeshBasicMaterial({ color:0x000000 })); hole.position.set(29.83, 0.0, 8.4); hole.rotation.y = -Math.PI/2; scene.add(hole);
  const tiny = makeFridge({ style:'mini', face:true, color:'#f4f1e6', eye:'#ffd56a' }); tiny.group.scale.setScalar(0.08); tiny.group.position.set(29.86, 0, 8.4); tiny.group.rotation.y = -Math.PI/2; scene.add(tiny.group); C.staff.push(tiny); tiny.watch = false;
  C.world.interact.push({ pos:new THREE.Vector3(29.7, 0.1, 8.4), r:2.2, text:()=>'a mouse hole?', use:()=>{ tiny.face.set('happy', 2); C.hud.say('', 'a fridge the size of a sugar cube lives in the wall. it has a face. it\'s watching the tables. it has opinions.'); egg('mini', 'you found the smallest fridge in the palace'); } });

  /* ---------- codes you type ---------- */
  const KON = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','KeyB','KeyA']; let kp = 0;
  C.bus.on('key', e=>{
    if(e.code === KON[kp]){ kp++; if(kp === KON.length){ kp = 0; disco(); } } else kp = e.code === KON[0] ? 1 : 0;
    const t = C.input.typed;
    if(t.endsWith('hank') && saw(['wall:hank', 'tag:26'])){ C.input.typed = ''; C.audio.whisper('he went home'); C.hud.say('', 'somewhere near the restrooms, someone says "he went home."'); egg('typedhank'); }
    if(t.endsWith('fridge')){ C.input.typed = ''; C.hud.toast('fridge.', 'gold'); }
  });
  function disco(){ C.disco = true; egg('disco', 'DISCO MODE'); C.hud.big('DISCO', '#ff3df2'); setTimeout(()=>{ C.disco = false; }, 30000); }

  /* ---------- the visitor ---------- */
  let vis = null, visT = rand(60, 150), sightings = 0;
  const together = mem.relationship === 'together';
  const VEN = makeFridge({ face:true, arms:true, style:'tall', color:'#cfc8ae', trim:'#6e6857', eye:together ? '#ff7ad0' : '#ff3a2a', screen:'#050000' });
  VEN.group.visible = false; scene.add(VEN.group); VEN.face.set(together ? 'love' : 'neutral', 1e9);
  const _f = new THREE.Vector3(), _d = new THREE.Vector3();
  function trySpawnVisitor(){
    const cam = C.camera.position; C.camera.getWorldDirection(_f); _f.y = 0; _f.normalize();
    for(let k=0;k<12;k++){
      const ang = rand(-0.5, 0.5), dist = rand(15, 24);
      const x = cam.x + (_f.x*Math.cos(ang) - _f.z*Math.sin(ang))*dist, z = cam.z + (_f.z*Math.cos(ang) + _f.x*Math.sin(ang))*dist;
      if(x < -29 || x > 29 || z < -21 || z > 21) continue;
      const p = new THREE.Vector3(x, 0, z), o = p.clone(); C.collide.resolve(p, 0.5);
      if(p.distanceTo(o) > 0.01) continue;
      VEN.group.position.set(x, 0, z); VEN.group.rotation.y = Math.atan2(cam.x - x, cam.z - z); VEN.group.visible = true;
      vis = { look:0, t:0 }; sightings++;
      return true;
    }
    return false;
  }
  return { name:'eggs', update(dt, t){
    /* cctv: only when you're standing in the security room */
    const p = C.camera.position;
    const inRoom = p.x < SR.maxX && p.z < SR.maxZ + 0.5;
    if(inRoom){
      C._cctvT = (C._cctvT || 0) + dt;
      if(C._cctvT > 0.25){
        C._cctvT = 0;
        const r = C.engine.renderer, prev = r.getRenderTarget();
        const f = cams[Math.floor(t*4) % cams.length];
        r.setRenderTarget(f.rt); r.render(scene, f.cam); r.setRenderTarget(prev);
        /* the basement feed */
        const m = vm(); bg.fillStyle = '#050505'; bg.fillRect(0, 0, 256, 160);
        for(let i=0;i<500;i++){ const v = Math.random()*90; bg.fillStyle = `rgb(${v},${v},${v})`; bg.fillRect(Math.random()*256, Math.random()*160, 2, 2); }
        bg.fillStyle = 'rgba(200,190,150,0.2)'; bg.fillRect(110, 20, 36, 120);
        if((m.deaths || 0) >= 1 && Math.sin(t*0.7) > 0.6){ bg.fillStyle = 'rgba(207,200,174,0.75)'; bg.fillRect(150, 50, 22, 70); bg.fillStyle = '#f22'; bg.fillRect(154, 58, 3, 4); bg.fillRect(163, 58, 3, 4); }
        bg.fillStyle = '#7f7'; bg.font = '12px monospace'; bg.fillText('03:13:' + String(Math.floor(t) % 60).padStart(2, '0'), 8, 150);
        btx.needsUpdate = true;
      }
    }
    zs.forEach(z=>{ z.t += dt; const k = (z.t % 2.7)/2.7; z.s.position.set(-19.8 + k*0.3, 1.9 + k*0.6, -18.6); z.s.material.opacity = 1 - k; });
    if(breakerCD > 0) breakerCD -= dt;
    /* disco lights */
    if(C.disco) C.world.lights.forEach((l, i)=>l.color.setHSL((t*0.2 + i*0.15) % 1, 0.9, 0.6));
    else if(C._wasDisco !== C.disco) C.world.lights.forEach((l, i)=>l.color.setHex([0xffcf8a, 0xffe0b0, 0xff8ad8, 0xffd29a, 0x9affc0, 0xffc070, 0xbfd8ff][i] || 0xffffff));
    C._wasDisco = C.disco;
    /* the visitor */
    const m = mem;
    if((m.deaths || 0) >= 7 && !C.seated && sightings < 3){
      if(!vis){ visT -= dt; if(visT <= 0){ visT = rand(90, 240); trySpawnVisitor(); } }
      else {
        vis.t += dt;
        C.camera.getWorldDirection(_f); _d.copy(VEN.group.position).setY(1.4).sub(p); const d = _d.length(); _d.normalize();
        if(_f.dot(_d) > 0.97) vis.look += dt;
        if(together && VEN.armR){ VEN.armBusy = true; VEN.armR.rotation.z = 2.4 + Math.sin(t*8)*0.3; }
        VEN.face.update(dt, true);
        if(vis.look > (together ? 2.5 : 1.2) || d < 8 || vis.t > 25){
          VEN.group.visible = false; vis = null;
          C.audio.whisper(together ? 'hi' : 'there you are');
          if(together){ C.hud.toast('he waved.', 'gold'); egg('wave'); }
          else { C.engine.finish.uniforms.uFlash.value = 0.25; C.tweens.add({ dur:0.5, update:k=>{ C.engine.finish.uniforms.uFlash.value = 0.25*(1 - k); } }); egg('visitor'); }
        }
      }
    }
  } };
}
