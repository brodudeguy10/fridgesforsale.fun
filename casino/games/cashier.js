/* ============================================================
   FRIDGE PALACE: the cage
   fridges in, chips out. chips in, fridges out. one for one.
   also: the palace club, and the welcome bonus.
============================================================ */
import * as THREE from '../lib/three.module.min.js';
import { G } from '../world/props.js';
import { makeFridge } from '../world/fridge.js';
import { neonSign } from '../world/signs.js';
import { decorStack } from '../world/cards.js';
import { pick } from '../core/util.js';
import * as T from '../world/textures.js';

const LINES = [
  "chips in, fridges out. that's the whole job.",
  "i count everything twice. then i count the counting.",
  "the club's upstairs. well. it's to the north. there's no upstairs. you know what i mean.",
  "no loans. management says the vendor does loans. management laughs when they say it.",
  "you'd be surprised how many people try to cash out a fridge that's still running.",
  "biggest cash out this week was a gold fridge. it cried a little.",
  "if the pit boss asks, you never heard me say 'count the tens'.",
  "the wheel's free once a day. it's rigged in your favor once a day too. kidding. it's not rigged. kidding."
];

export function init(C){
  const { scene, M } = C, B = C.world.batch, A = C.world.anchors.cashier;
  const x0 = 12, z0 = 14, z1 = 21.6;
  /* counter */
  B.add(G.box, M.woodDark, x0, 0.55, (z0 + z1)/2, 0.7, 1.1, z1 - z0);
  B.add(G.box, M.marbleDark, x0 - 0.05, 1.13, (z0 + z1)/2, 0.85, 0.06, z1 - z0 + 0.1);
  B.add(G.box, M.gold, x0 - 0.36, 1.0, (z0 + z1)/2, 0.04, 0.06, z1 - z0);
  /* bars, with three windows */
  const windows = [15.3, 17.5, 19.7];
  for(let z=z0 + 0.06; z<z1; z+=0.13){
    if(windows.some(w=>Math.abs(z - w) < 0.48)) continue;
    B.add(G.cyl8, M.gold, x0 + 0.15, 2.1, z, 0.012, 1.9, 0.012);
  }
  windows.forEach(w=>{ B.add(G.box, M.gold, x0 + 0.15, 1.6, w, 0.06, 0.05, 0.98); B.add(G.box, M.gold, x0 + 0.15, 3.05, w, 0.08, 0.1, 1.0); });
  B.add(G.box, M.gold, x0 + 0.15, 3.1, (z0 + z1)/2, 0.12, 0.12, z1 - z0);
  B.add(G.box, M.woodDark, x0 + 0.15, 4.1, (z0 + z1)/2, 0.2, 1.9, z1 - z0);
  /* the back wall of the cage, with a steel staff gate in it (x 26.0 to 27.6) */
  const GX0 = 26.0, GX1 = 27.6;
  B.add(G.box, M.woodDark, (x0 + GX0)/2, 3.25, z0, GX0 - x0, 6.5, 0.25);
  B.add(G.box, M.woodDark, (GX1 + 30)/2, 3.25, z0, 30 - GX1, 6.5, 0.25);
  B.add(G.box, M.woodDark, (GX0 + GX1)/2, 4.55, z0, GX1 - GX0, 3.9, 0.25);
  B.add(G.box, M.steel, (GX0 + GX1)/2, 2.62, z0, GX1 - GX0 + 0.2, 0.12, 0.34);
  const gateM = new THREE.MeshStandardMaterial({ color:0x3a3d44, roughness:0.35, metalness:0.8 });
  const gate = new THREE.Group(); gate.position.set(GX0, 0, z0);
  const gp = new THREE.Mesh(G.box, gateM); gp.scale.set(GX1 - GX0, 2.56, 0.1); gp.position.set((GX1 - GX0)/2, 1.28, 0); gate.add(gp);
  const gsign = new THREE.Mesh(G.plane, new THREE.MeshStandardMaterial({ map:T.plate('CAGE · STAFF ONLY', { w:512, h:96, size:40, bg:'#2a0a0a', fg:'#ffdddd', rim:'#888' }), roughness:0.5 })); gsign.scale.set(1.2, 0.22, 1); gsign.position.set((GX1 - GX0)/2, 1.8, -0.06); gsign.rotation.y = Math.PI; gate.add(gsign);
  const gh = new THREE.Mesh(G.cyl8, M.chrome); gh.scale.set(0.02, 0.2, 0.02); gh.position.set(GX1 - GX0 - 0.15, 1.1, -0.08); gate.add(gh);
  scene.add(gate);
  /* inside the cage: shelves of chips and a vault door */
  for(let i=0;i<3;i++){ B.add(G.box, M.steel, 20.5, 0.6 + i*0.7, 17.5, 0.5, 0.04, 5); }
  const dv = [100, 500, 1000, 5000, 25];
  for(let sh=0; sh<3; sh++) for(let i=0;i<9;i++) decorStack(B, 20.3 + (i%2)*0.14, 0.62 + sh*0.7, 15.3 + i*0.55, 20 + ((i*7 + sh*3) % 30), dv[(i + sh) % 5], 3);
  /* the vault door: a hinged group so the heist can open it (and slam it) */
  const VZ = 17.5, VY = 1.32, VR = 1.3;
  const vaultFrame = (()=>{ const sh = new THREE.Shape(); sh.moveTo(-1.5, 0); sh.lineTo(1.5, 0); sh.lineTo(1.5, 2.9); sh.lineTo(-1.5, 2.9); sh.closePath(); const h = new THREE.Path(); h.absarc(0, VY, VR - 0.02, 0, Math.PI*2, true); sh.holes.push(h); const g = new THREE.ExtrudeGeometry(sh, { depth:0.34, bevelEnabled:false, curveSegments:40 }); const m = new THREE.Mesh(g, M.steel); m.rotation.y = Math.PI/2; m.position.set(29.62, 0, VZ); return m; })();
  scene.add(vaultFrame);
  const vault = new THREE.Group(); vault.position.set(29.5, VY, VZ - VR);
  { const dm = new THREE.Mesh(new THREE.CylinderGeometry(VR, VR, 0.3, 48), M.steel); dm.rotation.z = Math.PI/2; dm.position.set(0, 0, VR); vault.add(dm);
    const rim = new THREE.Mesh(new THREE.TorusGeometry(VR - 0.06, 0.05, 8, 48), M.chrome); rim.rotation.y = Math.PI/2; rim.position.set(-0.16, 0, VR); vault.add(rim);
    const wheel = new THREE.Group(); wheel.position.set(-0.22, 0, VR); vault.add(wheel);
    for(let i=0;i<6;i++){ const a = i/6*Math.PI*2; const sp = new THREE.Mesh(G.cyl8, M.chrome); sp.scale.set(0.03, 0.5, 0.03); sp.position.set(0, Math.sin(a)*0.25, Math.cos(a)*0.25); sp.rotation.x = a + Math.PI/2; wheel.add(sp); }
    const hub = new THREE.Mesh(G.cyl, M.chrome); hub.scale.set(0.1, 0.08, 0.1); hub.rotation.z = Math.PI/2; wheel.add(hub);
    for(let i=0;i<8;i++){ const a = i/8*Math.PI*2; const bolt = new THREE.Mesh(G.cyl8, M.chrome); bolt.scale.set(0.06, 0.08, 0.06); bolt.rotation.z = Math.PI/2; bolt.position.set(-0.17, Math.sin(a)*(VR - 0.22), VR + Math.cos(a)*(VR - 0.22)); vault.add(bolt); }
    const hinge = new THREE.Mesh(G.cyl8, M.chrome); hinge.scale.set(0.09, 2.2, 0.09); hinge.position.set(0.05, 0, 0.02); vault.add(hinge);
    vault.userData.wheel = wheel; }
  scene.add(vault);
  /* the cage is a room now: counter on the west, a back wall with a gate on the north */
  const cageCol = {
    counter: C.collide.box(11.6, 13.8, 12.5, 22, 'counter'),
    backW: C.collide.box(12, 13.75, GX0, 14.2, 'wall'),
    backE: C.collide.box(GX1, 13.75, 30, 14.2, 'wall'),
    gate: C.collide.box(GX0, 13.75, GX1, 14.2, 'gate'),
    shelves: C.collide.box(20.15, 14.9, 20.85, 20.1, 'shelf'),
    inside: C.collide.box(12.5, 14.2, 30, 22, 'cage'),
    vaultDoor: C.collide.box(29.0, 16.1, 30.2, 18.9, 'vaultdoor')
  };
  C.world.cage = { gate, gateM, cols:cageCol, vault, vaultFrame, VZ, VY, VR, GX0, GX1, z0, tellers:null };
  /* the signs */
  C.world.neon.push(neonSign(scene, 'the cage', '#ffd56a', x0 - 0.15, 3.65, 17.5, -Math.PI/2, 0.8));
  const sign = new THREE.Mesh(G.plane, new THREE.MeshStandardMaterial({ map:T.plate('CASHIER · CHIPS · MEMBERSHIP', { w:1024, h:96, size:46 }), roughness:0.4 }));
  sign.scale.set(5.2, 0.48, 1); sign.position.set(x0 - 0.06, 4.6, 17.5); sign.rotation.y = -Math.PI/2; scene.add(sign);
  /* tellers */
  const tellers = [];
  [[15.3, '#cfd8dc', ['beanie'], 'MARGE'], [17.5, '#f4f1e6', ['bowtie', 'vest', 'nametag'], 'DOUG'], [19.7, '#9fe3d0', ['headset'], 'PAT']].forEach(([z, col, acc, name], i)=>{
    const F = makeFridge({ face:true, arms:true, color:col, acc, style:i === 1 ? 'std' : (i === 0 ? 'retro' : 'french'), eye:i === 1 ? '#ffd56a' : '#7ff3ff' });
    F.group.position.set(x0 + 0.95, 0, z); F.group.rotation.y = -Math.PI/2; scene.add(F.group);
    F.seed = i*3.1; F.name = name; F.watch = false;
    C.staff.push(F); tellers.push(F);
    if(i !== 1) F.face.set('sleepy', 9999);
  });
  const doug = tellers[1];
  C.world.cage.tellers = tellers; C.world.cage.doug = doug;
  const open = ()=>{
    C.input.quietUnlock();
    doug.face.say(1.2); doug.face.set('happy', 2);
    C.audio.chip(new THREE.Vector3(x0, 1.2, 17.5), 3);
    const s = C.save, d = s.d;
    if(!d.eggs.welcome && s.chips === 0 && s.fridges() < 100){
      s.egg('welcome'); s.pay(100, 'welcome', 'welcome bonus');
      C.hud.say('DOUG', "first time? hundred chips on the house. don't tell the house.");
    }
    const body = C.hud.modal({ title:'THE CAGE', html:`
      <div class="fp-big2">${C.fmt(s.chips)} <span class="fp-dim">chips</span></div>
      <div style="text-align:center" class="fp-dim">${C.fmt(s.fridges())} fridges on your counter upstairs · 1 fridge = 1 chip</div>
      <div class="fp-row" style="margin-top:14px"><input type="number" min="1" id="cg-amt" placeholder="amount"></div>
      <div class="fp-row"><button data-q="100">100</button><button data-q="1000">1,000</button><button data-q="10000">10,000</button><button data-q="all">ALL</button></div>
      <div class="fp-row"><button class="fp-gold" data-a="buy">BUY CHIPS</button><button data-a="cash">CASH OUT</button></div>
      <div class="fp-row fp-dim" id="cg-msg" style="min-height:20px"></div>
      <hr style="border:0;border-top:1px solid rgba(230,182,90,.3);margin:12px 0">
      <div class="fp-row">${d.member ? '<span class="fp-good">PALACE CLUB MEMBER. the rope opens for you.</span>' : '<button data-a="member">JOIN THE PALACE CLUB · 5,000</button>'}<button data-a="talk">TALK TO DOUG</button></div>
      <div class="fp-dim" style="text-align:center">the club gets you into the north-east lounge: high limit blackjack, double-zero roulette, couches, and a live FRDX board.</div>` });
    const msg = (t, ok)=>{ const m = body.querySelector('#cg-msg'); m.textContent = t; m.className = 'fp-row ' + (ok ? 'fp-good' : 'fp-bad'); };
    const amt = body.querySelector('#cg-amt');
    let mode = 'buy';
    body.querySelectorAll('[data-q]').forEach(b=>b.onclick = ()=>{ amt.value = b.dataset.q === 'all' ? '' : b.dataset.q; amt.dataset.all = b.dataset.q === 'all' ? '1' : ''; if(b.dataset.q === 'all') amt.placeholder = 'all'; C.audio.click(); });
    const val = (isBuy)=>{ if(amt.dataset.all) return isBuy ? s.fridges() : s.chips; return Math.floor(+amt.value); };
    body.querySelector('[data-a="buy"]').onclick = ()=>{ const r = s.buyChips(val(true)); msg(r.msg, r.ok); if(r.ok){ C.audio.chipStack(new THREE.Vector3(x0, 1.2, 17.5)); doug.face.set('money', 1.5); refresh(); } else C.audio.error(); };
    body.querySelector('[data-a="cash"]').onclick = ()=>{ const r = s.cashOut(val(false)); msg(r.msg, r.ok); if(r.ok){ C.audio.coins(new THREE.Vector3(x0, 1.2, 17.5), 12); refresh(); } else C.audio.error(); };
    const mb = body.querySelector('[data-a="member"]');
    if(mb) mb.onclick = ()=>{ if(s.chips < 5000){ msg('the club is 5,000 chips. you have ' + C.fmt(s.chips) + '.', false); C.audio.error(); return; } s.bet(5000, 'membership'); d.member = true; s.write(); s.emit(); C.bus.emit('member'); C.audio.jackpot(new THREE.Vector3(x0, 1.5, 17.5)); C.hud.big('PALACE CLUB', '#ffd56a'); C.hud.modal(null); C.hud.say('DOUG', "welcome to the club. the bouncer has your face now. he has a lot of faces. he means well."); };
    body.querySelector('[data-a="talk"]').onclick = ()=>{ C.hud.modal(null); talk(); };
    const refresh = ()=>{ body.querySelector('.fp-big2').innerHTML = `${C.fmt(s.chips)} <span class="fp-dim">chips</span>`; body.querySelector('.fp-dim').textContent = `${C.fmt(s.fridges())} fridges on your counter upstairs · 1 fridge = 1 chip`; };
    amt.focus();
  };
  const talk = ()=>{ const l = pick(LINES); doug.face.say(l.length*0.05); C.hud.say('DOUG', l); C.save.d.stats.talked++; };
  C.world.interact.push({ pos:new THREE.Vector3(x0 - 0.3, 1.35, 17.5), r:2.8, text:()=>'the cage: buy chips · cash out', use:open });
  C.world.interact.push({ pos:new THREE.Vector3(x0 - 0.3, 1.35, 15.3), r:2.2, text:()=>'wake up marge', use:()=>{ tellers[0].face.set('angry', 2); C.hud.say('MARGE', pick(["window's closed, hon. doug's open.", "i'm on break. i've been on break since the grand opening.", "zzz. what. no."])); } });
  C.world.interact.push({ pos:new THREE.Vector3(x0 - 0.3, 1.35, 19.7), r:2.2, text:()=>'ask pat something', use:()=>{ tellers[2].face.set('shock', 1.5); C.hud.say('PAT', pick(["i'm on the headset. security says hi. security is also me.", "if you see a fridge in the back hallway after midnight, that's not staff.", "the code for the staff door changes every year. it's always the same number though."])); } });
  /* the bouncer at the club rope */
  const R = C.world.anchors.vipRope;
  const bouncer = makeFridge({ face:true, arms:true, color:'#111114', style:'tall', acc:['headset'], shades:true, eye:'#ff5a5a' });
  bouncer.group.position.set(R.x + 2.3, 0, R.z + 0.3); bouncer.group.rotation.y = -0.4; scene.add(bouncer.group); bouncer.name = 'BOUNCER'; bouncer.watch = true; C.staff.push(bouncer);
  C.collide.circle(R.x + 2.3, R.z + 0.3, 0.5, 'bouncer');
  const syncRope = ()=>{ if(C.world.vipRope) C.world.vipRope.on = !C.save.d.member; };
  syncRope(); C.bus.on('member', syncRope);
  C.world.interact.push({ pos:new THREE.Vector3(R.x + 2.3, 1.6, R.z + 0.3), r:2.6, text:()=>'talk to the bouncer', use:()=>{ bouncer.face.say(1.5); C.hud.say('BOUNCER', C.save.d.member ? pick(["you're on the list. you're the list.", "go on in. the couches are judging you, not me.", "club's quiet tonight. the money's loud."]) : pick(["members only. the cage sells memberships.", "you're not on the list. there is a list. it's short. you're not on it.", "five thousand at the cage. then we're friends."])); } });
  C.world.interact.push({ pos:new THREE.Vector3(R.x, 1.0, R.z), r:2.2, text:()=>C.save.d.member ? null : 'the velvet rope', enabled:()=>!C.save.d.member, use:()=>{ bouncer.face.set('angry', 1.5); C.hud.say('BOUNCER', 'members only.'); } });
  return { name:'cashier', open };
}
