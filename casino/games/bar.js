/* ============================================================
   FRIDGE PALACE: the freezer bar
   a ring of marble around an aquarium. the fish in the tank are
   the ones you caught upstairs. drinks make the room move.
============================================================ */
import * as THREE from '../lib/three.module.min.js';
import { G, stool } from '../world/props.js';
import { makeFridge, animateFridge } from '../world/fridge.js';
import { neonSign } from '../world/signs.js';
import { pick, rand } from '../core/util.js';
import * as T from '../world/textures.js';

const DRINKS = [
  { id:'water', name:'Ice Water', price:0, buzz:-0.25, line:"water. good call. i'll tell everyone you ordered a triple." },
  { id:'marg', name:'Frozen Margarita', price:25, buzz:0.16, line:"blended in my crisper drawer. salt's on the house." },
  { id:'toddy', name:'The Defrost', price:40, buzz:0.22, line:"hot whiskey, honey, a little steam. warms the coils." },
  { id:'freon', name:'Freon on the Rocks', price:75, buzz:0.34, tint:[0.85, 1.15, 0.9], line:"don't tell the inspector. it's mostly mint. mostly." },
  { id:'martini', name:'Dry Martini, Shaken in a Fridge', price:120, buzz:0.3, line:"shaken. the whole fridge. it's a whole thing. i get dizzy." },
  { id:'champ', name:'Bottle of Champagne (whole bar)', price:500, buzz:0.45, cheer:true, line:"a round for the room! everybody, this one's on the fridge with the chips!" }
];
const TALK = [
  "the house edge on the slots here is about six percent. the house edge on me is zero. i just like the company.",
  "the fish in the tank? some of them are yours. somebody's been fishing upstairs.",
  "the guy who used to work the back hallway, hank, sat right there. he always ordered the defrost.",
  "if you hit the wheel today, come tell me what you got. nobody ever tells me what they got.",
  "the pit boss counts cards too. he counts the people counting cards.",
  "four drinks is fun. five drinks is the bench by the door. six drinks is a story the doorman tells.",
  "the out of order machine by the restrooms is out of order. it's been out of order for so long it's in order.",
  "you want a tip? double down on eleven. you want another tip? tip the bartender.",
  "the club in the north-east has a live stock board. the regulars watch it like it's a horse race.",
  "the staff door code? i don't know it. i know it's four numbers. i know when you'd see it."
];

export function init(C){
  const { scene, M } = C, B = C.world.batch, A = C.world.anchors.bar;
  const cx = A.x, cz = A.z;
  /* the counter ring */
  const front = new THREE.Mesh(new THREE.CylinderGeometry(A.rOut, A.rOut, 1.1, 64, 1, true), M.woodDark); front.position.set(cx, 0.55, cz); scene.add(front);
  const inner = new THREE.Mesh(new THREE.CylinderGeometry(A.rIn, A.rIn, 1.1, 64, 1, true), new THREE.MeshStandardMaterial({ color:0x1a0e0a, roughness:0.6, side:THREE.BackSide })); inner.position.set(cx, 0.55, cz); scene.add(inner);
  const top = new THREE.Mesh(new THREE.RingGeometry(A.rIn - 0.08, A.rOut + 0.12, 64), M.marbleDark); top.rotation.x = -Math.PI/2; top.position.set(cx, 1.12, cz); scene.add(top);
  const edge = new THREE.Mesh(new THREE.TorusGeometry(A.rOut + 0.12, 0.035, 8, 64), M.gold); edge.rotation.x = Math.PI/2; edge.position.set(cx, 1.11, cz); scene.add(edge);
  const rail = new THREE.Mesh(new THREE.TorusGeometry(A.rOut + 0.15, 0.025, 8, 64), M.gold); rail.rotation.x = Math.PI/2; rail.position.set(cx, 0.24, cz); scene.add(rail);
  /* an LED strip under the lip */
  const led = new THREE.Mesh(new THREE.TorusGeometry(A.rOut + 0.05, 0.012, 6, 96), new THREE.MeshBasicMaterial({ color:0x7ff3ff, toneMapped:false })); led.rotation.x = Math.PI/2; led.position.set(cx, 1.04, cz); scene.add(led);
  C.collide.ring(cx, cz, A.rIn - 0.3, A.rOut + 0.18, 'bar');
  C.collide.circle(cx, cz, A.rIn - 0.2, 'barinside');
  for(let i=0;i<14;i++){ const a = i/14*Math.PI*2 + 0.11; stool(B, M, cx + Math.cos(a)*(A.rOut + 0.65), cz + Math.sin(a)*(A.rOut + 0.65), 0.78); }
  /* the backbar: two shelves of glowing bottles */
  const bottleG = new THREE.CylinderGeometry(0.035, 0.04, 0.28, 8); const neckG = new THREE.CylinderGeometry(0.012, 0.025, 0.1, 6);
  const cols = [0xff4a8a, 0xffd400, 0x7ff3ff, 0x3ddc84, 0xff8a3d, 0xc060ff, 0xe8e0c8, 0x9a2a10];
  const bmats = cols.map(c=>new THREE.MeshStandardMaterial({ color:c, emissive:c, emissiveIntensity:0.55, roughness:0.1, transparent:true, opacity:0.85 }));
  for(let sh=0; sh<2; sh++){
    const r = 1.75, y = 1.25 + sh*0.55;
    const shelf = new THREE.Mesh(new THREE.RingGeometry(r - 0.18, r + 0.12, 48), M.gold); shelf.rotation.x = -Math.PI/2; shelf.position.set(cx, y, cz); scene.add(shelf);
    for(let i=0;i<34;i++){ const a = i/34*Math.PI*2 + sh*0.1, m = bmats[(i*3 + sh) % bmats.length]; B.add(bottleG, m, cx + Math.cos(a)*r, y + 0.15, cz + Math.sin(a)*r); B.add(neckG, m, cx + Math.cos(a)*r, y + 0.34, cz + Math.sin(a)*r); }
  }
  /* the aquarium column */
  const tankR = 1.25, tankH = C.world.anchors && 6.5;
  const water = new THREE.Mesh(new THREE.CylinderGeometry(tankR - 0.03, tankR - 0.03, 5.6, 48, 1, true), new THREE.MeshStandardMaterial({ color:0x1d7fa8, roughness:0.05, transparent:true, opacity:0.32, emissive:0x0a3a5a, emissiveIntensity:0.9, side:THREE.DoubleSide, depthWrite:false }));
  water.position.set(cx, 3.05, cz); water.renderOrder = 2; scene.add(water);
  const glassC = new THREE.Mesh(new THREE.CylinderGeometry(tankR, tankR, 5.7, 48, 1, true), M.glass); glassC.position.set(cx, 3.05, cz); glassC.renderOrder = 3; scene.add(glassC);
  [0.22, 5.95].forEach(y=>{ B.add(G.cyl, M.gold, cx, y, cz, tankR + 0.08, 0.36, tankR + 0.08); });
  B.add(G.cyl, new THREE.MeshStandardMaterial({ color:0xc8b38a, roughness:1 }), cx, 0.42, cz, tankR - 0.04, 0.06, tankR - 0.04);
  const kelpM = new THREE.MeshStandardMaterial({ color:0x2a8a4a, roughness:0.8, emissive:0x0a3a1a, emissiveIntensity:0.5 });
  for(let i=0;i<10;i++){ const a = i*2.4, r = 0.3 + (i%3)*0.3; B.add(G.cone, kelpM, cx + Math.cos(a)*r, 0.45 + 0.6 + (i%2)*0.3, cz + Math.sin(a)*r, 0.07, 1.2 + (i%2)*0.6, 0.07); }
  /* a little sunken fridge in the gravel, of course */
  const sunk = makeFridge({ style:'mini', color:'#9fd3c0', rough:0.8 }); sunk.group.position.set(cx + 0.45, 0.45, cz - 0.2); sunk.group.rotation.set(0.3, 0.6, 0.5); sunk.group.scale.setScalar(0.35); scene.add(sunk.group);
  const tankLight = new THREE.PointLight(0x4ac8ff, 12, 6, 1.5); tankLight.position.set(cx, 3, cz); scene.add(tankLight);
  /* bubbles */
  const bubG = new THREE.SphereGeometry(1, 6, 4), bubM = new THREE.MeshBasicMaterial({ color:0xc8f0ff, transparent:true, opacity:0.5, toneMapped:false });
  const bubbles = new THREE.InstancedMesh(bubG, bubM, 70); scene.add(bubbles);
  const bub = []; for(let i=0;i<70;i++) bub.push({ a:rand(0, 6.28), r:rand(0.1, 1.0), y:rand(0.5, 5.8), s:rand(0.01, 0.03), v:rand(0.3, 0.8) });
  const m4 = new THREE.Matrix4();
  /* your fish */
  const fish = [];
  try{
    const save = window.FISHING && FISHING.save ? FISHING.save() : JSON.parse(localStorage.getItem('fridgefish_v1') || 'null');
    const F = window.FISHDATA ? FISHDATA.FISH : [];
    const caught = save && save.dex ? Object.keys(save.dex).map(id=>F.find(f=>f.id === id)).filter(Boolean) : [];
    caught.sort((a,b)=>b.rar - a.rar).slice(0, 24).forEach((f, i)=>{
      const cv = T.canvas(160, 100), g = cv.getContext('2d');
      if(window.FISHING && FISHING.paint) FISHING.paint(g, f, 160, 100, false);
      const t = T.tex(cv); const m = new THREE.MeshBasicMaterial({ map:t, transparent:true, side:THREE.DoubleSide, depthWrite:false, toneMapped:false, color:0xddeeff });
      const s = 0.22 + f.rar*0.05;
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(s*1.6, s), m); mesh.renderOrder = 2.5; scene.add(mesh);
      fish.push({ mesh, f, a:rand(0, 6.28), r:rand(0.35, tankR - 0.25), y:rand(1, 5.2), sp:rand(0.25, 0.6)*(Math.random() < 0.5 ? 1 : -1), bob:rand(0, 6) });
    });
  }catch(e){ console.warn(e); }
  const plaque = new THREE.Mesh(G.plane, new THREE.MeshStandardMaterial({ map:T.plate(fish.length ? 'THE PALACE AQUARIUM\n' + fish.length + ' SPECIES · CAUGHT BY YOU' : 'THE PALACE AQUARIUM\nYOUR CATCHES WILL LIVE HERE', { w:512, h:160, size:30 }), roughness:0.4 }));
  plaque.scale.set(0.9, 0.28, 1); plaque.position.set(cx, 1.6, cz + tankR + 0.01); scene.add(plaque);
  C.world.neon.push(neonSign(scene, 'the freezer bar', '#7ff3ff', cx, 5.4, cz + tankR + 0.05, 0, 0.55));
  C.world.neon.push(neonSign(scene, 'the freezer bar', '#7ff3ff', cx, 5.4, cz - tankR - 0.05, Math.PI, 0.55));
  /* the bartender */
  const bt = makeFridge({ face:true, arms:true, color:'#1c2733', trim:'#0e151d', acc:['bowtie', 'vest'], vest:'#7a1220', eye:'#ffd56a', style:'smart' });
  bt.custom = true; bt.name = 'GUS'; scene.add(bt.group); C.staff.push(bt);
  const btS = { a:0, target:0, busy:0 };
  const glass = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.03, 0.1, 10), M.glass); bt.armR.add(glass); glass.position.set(0, -0.38, 0.05);
  const order = ()=>{
    C.input.quietUnlock();
    const p = C.camera.position; btS.target = Math.atan2(p.z - cz, p.x - cx); btS.busy = 6;
    bt.face.set('happy', 2); bt.face.say(0.8);
    const vm = (()=>{ try{ return window.VENDOR ? VENDOR.loadMem() : {}; }catch(e){ return {}; } })();
    const list = DRINKS.slice();
    if(vm.sauce > 0) list.push({ id:'sauce', name:'The Sauce', price:66, buzz:0.6, tint:[1.2, 0.85, 1.1], secret:true, line:"...where did you hear about the sauce. fine. one. don't make it weird." });
    const body = C.hud.modal({ title:'THE FREEZER BAR', html:`
      <p style="text-align:center" class="fp-dim">GUS · bartender · has been here since the ice age</p>
      <div class="fp-drinks">${list.map(d=>`<button data-d="${d.id}" class="${d.secret ? 'fp-red' : ''}">${d.name}<small>${d.price ? d.price + ' chips' : 'free'}</small></button>`).join('')}</div>
      <div class="fp-row"><button data-a="coolant">ASK FOR COOLANT</button><button data-a="talk">TALK TO GUS</button></div>
      <div class="fp-dim" style="text-align:center">how you feel: ${['sober', 'warm', 'loose', 'wobbly', 'gone'][Math.min(4, Math.floor(C.drunk*3.2))]}</div>` });
    body.querySelectorAll('[data-d]').forEach(b=>b.onclick = ()=>{ const d = list.find(x=>x.id === b.dataset.d); C.hud.modal(null); serve(d); });
    body.querySelector('[data-a="coolant"]').onclick = ()=>{ C.hud.modal(null); bt.face.set('angry', 2); bt.face.say(1.5); C.hud.say('GUS', pick(["we talked about this.", "no. it's in the fishing shop upstairs and it's for fish.", "the last guy who drank coolant is the tank decoration now."])); };
    body.querySelector('[data-a="talk"]').onclick = ()=>{ C.hud.modal(null); const l = pick(TALK); bt.face.say(l.length*0.05); C.hud.say('GUS', l); C.save.d.stats.talked++; };
  };
  let waterRun = 0;
  const serve = async (d)=>{
    if(d.price && C.freeDrink){ C.freeDrink = false; C.hud.say('GUS', 'on the house. grand reopening. don\'t get used to it.'); d = Object.assign({}, d, { price:0 }); }
    if(d.price && !C.save.bet(d.price, 'bar')){ C.audio.error(); C.hud.say('GUS', "that's " + d.price + " chips. the cage is by the door."); return; }
    btS.busy = 5; bt.armBusy = true;
    const pos = new THREE.Vector3(cx + Math.cos(btS.target)*A.rOut, 1.15, cz + Math.sin(btS.target)*A.rOut);
    C.audio.pour(pos);
    await C.tweens.add({ dur:1.2, update:k=>{ bt.armR.rotation.x = -1.3*Math.sin(k*Math.PI); bt.armR.rotation.z = 0.12 + Math.sin(k*20)*0.1; } });
    bt.armBusy = false;
    C.audio.clink(pos);
    C.hud.say('GUS', d.line);
    bt.face.say(d.line.length*0.05);
    await C.tweens.sleep(0.6);
    C.audio.gulp();
    C.drunk = Math.max(0, C.drunk + d.buzz);
    if(d.price) C.save.d.drinks++; C.save.write();
    if(d.tint){ const u = C.engine.finish.uniforms.uTint.value; u.set(d.tint[0], d.tint[1], d.tint[2]); C.tweens.add({ dur:6, update:k=>u.set(d.tint[0] + (1 - d.tint[0])*k, d.tint[1] + (1 - d.tint[1])*k, d.tint[2] + (1 - d.tint[2])*k) }); }
    if(d.cheer){ C.audio.cheer(pos, 1); C.bus.emit('cheer', { pos, big:true }); C.hud.big('CHEERS', '#ffd56a'); }
    /* five waters in a row: gus respects it */
    waterRun = d.id === 'water' ? waterRun + 1 : 0;
    if(waterRun === 5){ C.drunk = 0; await C.tweens.sleep(1.4); bt.face.set('love', 3); bt.face.say(2.5); C.hud.say('GUS', 'five waters. in a casino. in this economy. you\'re the healthiest thing that\'s ever sat at this bar. this one\'s got a little umbrella in it.'); if(C.save.egg('hydrate')) C.hud.toast('secret: hydration station', 'gold'); C.audio.cheer && C.audio.cheer(pos, 0.4); }
    if(d.id === 'sauce'){ C.save.egg('sauce'); try{ VENDOR.see('casino:sauce'); }catch(e){} C.hud.toast('the room counts itself. it gets a different number.', 'gold'); }
    if(C.drunk > 1.25) blackout();
    else if(C.drunk > 0.9) C.hud.toast('you feel great. the floor disagrees.');
  };
  const blackout = async ()=>{
    C.input.quietUnlock();
    await C.hud.fade(1, 1800);
    const lost = Math.min(500, Math.floor(C.save.chips*0.1));
    C.save.take(lost);
    C.save.d.blackouts++; C.save.write();
    C.player.spawn(-21, 19.2, Math.PI*0.8);
    C.drunk = 0.35;
    await C.tweens.sleep(1.2);
    C.hud.fade(0, 2500);
    C.hud.say('DOORMAN', lost ? "morning. you slept on the bench. your wallet looks " + lost + " chips lighter. that's not on me." : "morning. you slept on the bench. you didn't have anything to lose. respect.", 7);
  };
  C.world.interact.push({ pos:new THREE.Vector3(cx, 1.3, cz), r:A.rOut + 1.4, text:()=>'order a drink from GUS', use:order, enabled:()=>{ const d = Math.hypot(C.player.pos.x - cx, C.player.pos.z - cz); return d < A.rOut + 1.2; } });
  C.world.aquarium = { water, glassC, fish, cx, cz, tankR, tankLight, bubbles, broken:false };
  return {
    name:'bar',
    update(dt, t){
      /* the bartender patrols the ring and turns to customers */
      if(btS.busy > 0) btS.busy -= dt;
      else { btS.a += dt*0.12; btS.target = btS.a; }
      let da = btS.target - btS.a; da = Math.atan2(Math.sin(da), Math.cos(da)); btS.a += da*Math.min(1, dt*2);
      const r = 2.15;
      bt.group.position.set(cx + Math.cos(btS.a)*r, 0, cz + Math.sin(btS.a)*r);
      bt.group.rotation.y = Math.atan2(Math.cos(btS.a), Math.sin(btS.a));
      animateFridge(bt, t, btS.busy > 0 ? 0 : 0.5);
      /* fish swim, bubbles rise */
      for(const f of fish){
        if(f.out) continue;
        f.a += dt*f.sp/f.r; f.bob += dt;
        const x = cx + Math.cos(f.a)*f.r, z = cz + Math.sin(f.a)*f.r, y = f.y + Math.sin(f.bob*0.7)*0.15;
        f.mesh.position.set(x, y, z);
        f.mesh.rotation.y = -f.a - Math.PI/2 + (f.sp > 0 ? 0 : Math.PI);
      }
      if(!C.world.aquarium.broken) for(let i=0;i<bub.length;i++){ const b = bub[i]; b.y += dt*b.v; if(b.y > 5.8){ b.y = 0.5; b.a = rand(0, 6.28); } m4.makeScale(b.s, b.s, b.s); m4.setPosition(cx + Math.cos(b.a + b.y*0.3)*b.r, b.y, cz + Math.sin(b.a + b.y*0.3)*b.r); bubbles.setMatrixAt(i, m4); }
      bubbles.instanceMatrix.needsUpdate = true;
    }
  };
}
