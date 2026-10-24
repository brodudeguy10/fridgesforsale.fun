/* ============================================================
   FRIDGE PALACE: the building
   x runs east, z runs south, y is up. one unit is one meter.
   the hall is 60 x 44 with a 6.5m ceiling.

     north (z -22)
     ┌───────────┬──────────────┬────────────┐
     │ STAFF     │ INSIDE TRACK │ PALACE CLUB │
     ├──┬──┬──┬──┘              └─┬──────────┤
     │  slots    │   [ BAR ]   │  tables     │
     │  banks    │  (aquarium) │  bj · rou   │
     │           │   podium    │  hold'em    │
     ├ wheel ────┴── lobby ────┴── cage ─────┤
     └──────────────[ doors ]────────────────┘
     south (z +22)
============================================================ */
import * as THREE from '../lib/three.module.min.js';
import { Batch, G, uvScale, column, stool, plant, rope, couch, coffeeTable, chandelier, chair } from './props.js';
import * as T from './textures.js';
import { neonSign, VideoWall, SLIDES } from './signs.js';
import { makeFridge } from './fridge.js';

export const HALL = { minX:-30, maxX:30, minZ:-22, maxZ:22, h:6.5 };

export function buildWorld(C){
  const { scene, M } = C;
  const B = new Batch();
  const W = { interact:[], neon:[], walls:[], walls3d:[], updaters:[], anchors:{}, lights:[], screens:[] };
  C.world = W;
  const col = C.collide;

  /* ---------- floors ---------- */
  const floor = (x0, z0, x1, z1, mat, tile, y)=>{
    const w = x1 - x0, d = z1 - z0;
    const g = new THREE.PlaneGeometry(w, d); uvScale(g, w/tile, d/tile);
    const m = new THREE.Mesh(g, mat); m.rotation.x = -Math.PI/2; m.position.set((x0 + x1)/2, y || 0, (z0 + z1)/2);
    m.matrixAutoUpdate = false; m.updateMatrix(); scene.add(m); return m;
  };
  floor(-30, -14, 30, 13, M.carpet, 2.1);
  floor(-9.5, -22, 9.5, -14, M.carpet, 2.1);
  floor(-30, 13, 30, 22, M.marble, 2.4);
  const vipFloor = new THREE.MeshStandardMaterial({ map:T.wood(), roughness:0.3, color:0x8a6050 });
  floor(12, -22, 30, -14, vipFloor, 1.6);
  floor(-30, -22, -12, -14, M.tileStaff, 1.2);
  /* marble inlay ring around the podium and a gold border where carpet meets marble */
  const ring = new THREE.Mesh(new THREE.RingGeometry(2.6, 3.2, 64), M.marbleDark); ring.rotation.x = -Math.PI/2; ring.position.set(0, 0.006, 8.5); scene.add(ring);
  B.add(G.box, M.gold, 0, 0.004, 13, 60, 0.008, 0.12);

  /* ---------- walls ---------- */
  /* wall from a to b with optional openings measured along its length */
  const wall = (x1, z1, x2, z2, o)=>{
    o = o || {};
    const h = o.h || HALL.h, th = o.th || 0.3, len = Math.hypot(x2 - x1, z2 - z1), ang = Math.atan2(z2 - z1, x2 - x1);
    const ops = (o.open || []).slice().sort((a,b)=>a[0] - b[0]);
    const segs = []; let p = 0; ops.forEach(([a, b])=>{ if(a > p) segs.push([p, a]); p = b; }); if(p < len) segs.push([p, len]);
    const ux = (x2 - x1)/len, uz = (z2 - z1)/len;
    segs.forEach(([a, b])=>{
      const l = b - a, cx = x1 + ux*(a + l/2), cz = z1 + uz*(a + l/2);
      const g = new THREE.BoxGeometry(l, h, th); uvScale(g, l/2.2, h/2.2);
      B.add(g, o.mat || M.wall, cx, h/2, cz, 1, 1, 1, 0, -ang, 0);
      if(o.wains !== false){
        B.add(G.box, M.woodDark, cx, 0.6, cz, l, 1.2, th + 0.06, 0, -ang, 0);
        B.add(G.box, M.gold, cx, 1.22, cz, l, 0.05, th + 0.1, 0, -ang, 0);
        B.add(G.box, M.gold, cx, h - 0.15, cz, l, 0.12, th + 0.14, 0, -ang, 0);
      }
      col.boxC(cx, cz, l, th + 0.1, -ang, 'wall');
    });
    /* lintels over openings that aren't full height */
    ops.forEach(([a, b, oh])=>{ if(!oh) return; const l = b - a, cx = x1 + ux*(a + l/2), cz = z1 + uz*(a + l/2); B.add(G.box, o.mat || M.wall, cx, oh + (h - oh)/2, cz, l, h - oh, th, 0, -ang, 0); B.add(G.box, M.gold, cx, oh, cz, l + 0.1, 0.12, th + 0.12, 0, -ang, 0); });
  };
  wall(-30, 22, 30, 22, { open:[[27, 33, 3.4]] });                  // south, doors in the middle
  wall(-30, -22, -30, 22);                                            // west (the restroom doors are painted on)
  wall(30, -22, 30, 22, { open:[[38.2, 40.8, 2.75]] });                // east, with the vault behind the cage
  wall(-30, -22, 30, -22);
  wall(-9.5, -22, -9.5, -14.6, { h:HALL.h });
  wall(9.5, -22, 9.5, -14.6, { h:HALL.h });
  /* the club */
  wall(12, -14, 30, -14, { open:[[6.5, 9.5, 3.2]] });
  wall(12, -22, 12, -14);
  /* staff only */
  wall(-30, -14, -12, -14, { open:[[8.9, 10.4, 2.4]] });
  wall(-12, -22, -12, -14);
  /* restroom doors are painted shut */
  [[9, 'FRIDGES'], [12.4, 'FREEZERS']].forEach(([z, label], i)=>{
    B.add(G.box, M.woodDark, -29.8, 1.2, z, 0.08, 2.4, 1.3); B.add(G.box, M.gold, -29.74, 1.15, z + 0.5, 0.04, 0.05, 0.16);
    const pl = new THREE.Mesh(G.plane, new THREE.MeshStandardMaterial({ map:T.plate(label, { size:44 }), roughness:0.4 })); pl.scale.set(1.1, 0.28, 1); pl.position.set(-29.76, 2.6, z); pl.rotation.y = Math.PI/2; scene.add(pl);
    W.interact.push({ pos:new THREE.Vector3(-29.6, 1.3, z), r:2.2, text:()=>i ? 'knock' : 'try the door', use:()=>{ C.audio.door(new THREE.Vector3(-29.8, 1.2, z)); C.hud.toast(i ? 'somebody inside says "occupied" in a very low hum' : 'locked. there\'s a sign: "cleaning in progress since 1998"'); } });
  });

  /* ---------- ceiling ---------- */
  const ceil = (x0, z0, x1, z1, y, mat)=>{ const w = x1 - x0, d = z1 - z0; const g = new THREE.PlaneGeometry(w, d); uvScale(g, w/3, d/3); const m = new THREE.Mesh(g, mat || M.ceiling); m.rotation.x = Math.PI/2; m.position.set((x0 + x1)/2, y, (z0 + z1)/2); scene.add(m); };
  { /* the ceiling, with a round hole where the dome goes */
    const sh = new THREE.Shape(); sh.moveTo(-30, -22); sh.lineTo(30, -22); sh.lineTo(30, 22); sh.lineTo(-30, 22); sh.closePath();
    const hole = new THREE.Path(); hole.absarc(0, -1, 7, 0, Math.PI*2, true); sh.holes.push(hole);
    const g = new THREE.ShapeGeometry(sh, 48); uvScale(g, 1/3, 1/3);
    const m = new THREE.Mesh(g, M.ceiling); m.rotation.x = Math.PI/2; m.position.y = HALL.h; scene.add(m);
  }
  /* a dome over the bar */
  const dome = new THREE.Mesh(new THREE.SphereGeometry(7, 48, 16, 0, Math.PI*2, 0, Math.PI/2), new THREE.MeshStandardMaterial({ color:0x1a0d22, roughness:0.6, metalness:0.3, side:THREE.BackSide, emissive:0x120618, emissiveIntensity:0.5 }));
  dome.position.set(0, HALL.h - 0.02, -1); dome.scale.y = 0.35; scene.add(dome);
  const domeRing = new THREE.Mesh(new THREE.TorusGeometry(7, 0.12, 8, 64), M.gold); domeRing.rotation.x = Math.PI/2; domeRing.position.set(0, HALL.h - 0.08, -1); scene.add(domeRing);
  /* little stars in the dome */
  const starM = new THREE.MeshBasicMaterial({ color:0xfff1c8, toneMapped:false });
  for(let i=0;i<160;i++){ const a = Math.random()*Math.PI*2, e = Math.random()*Math.PI/2.2; const r = 6.95; B.add(G.sph, starM, Math.cos(a)*Math.cos(e)*r, HALL.h + Math.sin(e)*r*0.35 - 0.05, -1 + Math.sin(a)*Math.cos(e)*r, 0.025, 0.025, 0.025); }

  /* ---------- columns ---------- */
  [[-6, 13], [6, 13], [-15, 13], [15, 13], [-24, 13], [24, 13], [-6, -12], [6, -12], [-12, -12], [-12, 7], [12, 7], [12, -12]].forEach(([x, z])=>{ column(B, M, x, z, HALL.h); col.circle(x, z, 0.48, 'column'); });

  /* ---------- lights ---------- */
  const hemi = new THREE.HemisphereLight(0xffe2c0, 0x2a0a14, 0.75); scene.add(hemi);
  const amb = new THREE.AmbientLight(0x3a2030, 0.6); scene.add(amb);
  const pl = (x, y, z, c, i, d)=>{ const l = new THREE.PointLight(c, i, d || 22, 1.6); l.position.set(x, y, z); scene.add(l); W.lights.push(l); return l; };
  pl(0, 5.2, -1, 0xffcf8a, 90, 20);
  pl(0, 5.6, 15, 0xffe0b0, 26, 18);
  pl(-17, 5.2, 0, 0xff8ad8, 60, 18);
  pl(16, 5.2, -1, 0xffd29a, 80, 20);
  pl(0, 4.4, -18, 0x9affc0, 35, 14);
  pl(21, 4.4, -18, 0xffc070, 50, 14);
  pl(-21, 2.9, -18, 0xbfd8ff, 18, 10);
  /* phones and weak GPUs get three lights and a brighter fill */
  if(C.engine.preset() === 'low'){ W.lights.slice(3).forEach(l=>{ scene.remove(l); }); hemi.intensity = 1.0; amb.intensity = 0.9; }
  const crystalM = new THREE.MeshStandardMaterial({ color:0xffffff, emissive:0xfff0d0, emissiveIntensity:0.7, roughness:0.05, metalness:0.2 });
  const bulbM = new THREE.MeshBasicMaterial({ color:0xfff3d6, toneMapped:false });
  { /* the lobby chandelier is its own object, because one night it comes down */
    const CB = new Batch(), grp = new THREE.Group();
    chandelier(scene, CB, M, 0, 0, 0, 1.2, crystalM, bulbM);
    CB.build(grp); grp.position.set(0, 4.7, 15); scene.add(grp);
    W.lobbyChandelier = grp;
  }
  chandelier(scene, B, M, 16, 4.6, -1, 1.2, crystalM, bulbM);
  chandelier(scene, B, M, -17, 4.6, 0, 1.2, crystalM, bulbM);
  chandelier(scene, B, M, 21, 3.4, -18, 0.9, crystalM, bulbM);
  /* wall sconces */
  for(let x=-26; x<=26; x+=6.5){ B.add(G.box, M.gold, x, 2.6, 21.8, 0.18, 0.3, 0.08); B.add(G.sph, bulbM, x, 2.85, 21.7, 0.08, 0.1, 0.08); }
  for(let z=-18; z<=18; z+=6){ if(z > 6 && z < 14) continue; B.add(G.sph, bulbM, -29.75, 2.85, z, 0.08, 0.1, 0.08); B.add(G.sph, bulbM, 29.75, 2.85, z, 0.08, 0.1, 0.08); B.add(G.box, M.gold, -29.8, 2.6, z, 0.08, 0.3, 0.18); B.add(G.box, M.gold, 29.8, 2.6, z, 0.08, 0.3, 0.18); }
  /* cove lighting strips along the top of the walls */
  const cove = new THREE.MeshBasicMaterial({ color:0xff7ad0, toneMapped:false });
  B.add(G.box, cove, 0, HALL.h - 0.32, -21.82, 60, 0.03, 0.03); B.add(G.box, cove, 0, HALL.h - 0.32, 21.82, 60, 0.03, 0.03);
  B.add(G.box, cove, -29.82, HALL.h - 0.32, 0, 0.03, 0.03, 44); B.add(G.box, cove, 29.82, HALL.h - 0.32, 0, 0.03, 0.03, 44);

  /* ---------- the entrance ---------- */
  const door = new THREE.MeshStandardMaterial({ color:0x88b8d8, roughness:0.05, metalness:0.4, transparent:true, opacity:0.28, depthWrite:false });
  [-2.25, -0.75, 0.75, 2.25].forEach(x=>{ const d = new THREE.Mesh(G.box, door); d.scale.set(1.45, 3.3, 0.05); d.position.set(x, 1.65, 22); scene.add(d); B.add(G.box, M.gold, x + 0.72, 1.65, 22, 0.05, 3.3, 0.1); B.add(G.cyl8, M.gold, x + (x < 0 ? 0.5 : -0.5), 1.2, 21.9, 0.015, 0.8, 0.015); });
  col.box(-3, 21.8, 3, 22.4, 'door');
  /* the street outside: a painted night */
  const sc = T.canvas(1024, 512), sg = sc.getContext('2d');
  const sky = sg.createLinearGradient(0, 0, 0, 512); sky.addColorStop(0, '#05030c'); sky.addColorStop(0.6, '#1a0a2a'); sky.addColorStop(1, '#2a1030'); sg.fillStyle = sky; sg.fillRect(0, 0, 1024, 512);
  for(let i=0;i<30;i++){ const bw = 30 + Math.random()*60, bh = 120 + Math.random()*260, bx = i*36 - 20; sg.fillStyle = '#07040c'; sg.fillRect(bx, 512 - bh, bw, bh); for(let w=0; w<30; w++){ if(Math.random() < 0.35){ sg.fillStyle = Math.random() < 0.8 ? '#ffd88a' : '#7ff3ff'; sg.fillRect(bx + 4 + (w%4)*(bw/4.4), 512 - bh + 10 + Math.floor(w/4)*22, 5, 8); } } }
  sg.fillStyle = '#ff3df2'; sg.shadowColor = '#ff3df2'; sg.shadowBlur = 20; sg.font = '40px "Pacifico", cursive'; sg.fillText('open 24/7', 680, 300); sg.shadowBlur = 0;
  const street = new THREE.Mesh(new THREE.PlaneGeometry(26, 13), new THREE.MeshBasicMaterial({ map:T.tex(sc), toneMapped:false }));
  street.position.set(0, 5, 30); street.rotation.y = Math.PI; scene.add(street);
  const sidewalk = new THREE.Mesh(new THREE.PlaneGeometry(26, 9), M.concrete); sidewalk.rotation.x = -Math.PI/2; sidewalk.position.set(0, -0.01, 26.5); scene.add(sidewalk);
  W.interact.push({ pos:new THREE.Vector3(0, 1.4, 21.6), r:2.6, text:()=>'leave the palace', use:()=>C.confirmLeave() });
  W.anchors.spawn = { x:0, z:19.6, yaw:0 };
  /* red carpet runner from the doors to the podium */
  const runner = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 9), new THREE.MeshStandardMaterial({ map:T.velvet(), roughness:0.95, color:0xff6670 })); runner.rotation.x = -Math.PI/2; runner.position.set(0, 0.008, 17.3); scene.add(runner);
  B.add(G.box, M.gold, -1.2, 0.01, 17.3, 0.05, 0.02, 9); B.add(G.box, M.gold, 1.2, 0.01, 17.3, 0.05, 0.02, 9);

  /* the big sign the first thing you see */
  const lg = new THREE.Mesh(new THREE.PlaneGeometry(8, 4), new THREE.MeshBasicMaterial({ map:T.logo(), transparent:true, toneMapped:false, depthWrite:false }));
  lg.position.set(0, 4.6, 11.6); scene.add(lg);
  B.add(G.box, M.gold, 0, 6.0, 11.6, 0.04, 1, 0.04);

  /* ---------- lobby dressing ---------- */
  [[-4.5, 20.5], [4.5, 20.5], [-9, 14.4], [9, 14.4], [-28.6, 20.6], [28.6, 20.6], [-28.6, -12.6], [-13, -12.6], [28.6, -12.6], [10.6, -12.6]].forEach(([x, z])=>{ plant(B, M, x, z, 1.1); col.circle(x, z, 0.38, 'plant'); });
  /* benches */
  [[-18, 20.6], [-24, 20.6]].forEach(([x, z])=>{ couch(B, M, x, z, Math.PI, 2.6, M.leatherRed); col.boxC(x, z, 2.8, 1, 0, 'couch'); });

  /* ---------- the club ---------- */
  rope(B, M, { x:18.4, z:-13.5 }, { x:21.6, z:-13.5 }, 0.15);
  W.vipRope = col.box(18.3, -13.7, 21.7, -13.3, 'rope');
  couch(B, M, 28.7, -18, -Math.PI/2, 3, M.leatherBlack); col.boxC(28.7, -18, 1, 3.2, 0, 'couch');
  couch(B, M, 25.5, -15.2, 0, 2.4, M.leatherBlack); col.boxC(25.5, -15.2, 2.6, 1, 0, 'couch');
  coffeeTable(B, M, 27, -16.8); col.circle(27, -16.8, 0.55);
  const vipSign = neonSign(scene, 'Palace Club', '#ffd56a', 20, 3.9, -13.8, 0, 0.9); W.neon.push(vipSign);
  W.anchors.vipBJ = { x:15.8, z:-18.8, ry:0 };
  W.anchors.vipRoulette = { x:23.4, z:-19.4, ry:0 };
  W.anchors.vipRope = { x:20, z:-13.5 };

  /* ---------- inside track ---------- */
  W.anchors.raceScreen = { x:0, y:3.5, z:-21.8, w:13, h:5.4 };
  W.anchors.raceTerminals = [];
  for(let row=0; row<2; row++) for(let i=0;i<4;i++){
    const x = -5.4 + i*3.6, z = -16.2 - row*2.6;
    W.anchors.raceTerminals.push({ x, z });
    B.add(G.box, M.black, x, 0.55, z - 0.35, 0.9, 1.1, 0.35);
    B.add(G.box, M.gold, x, 1.11, z - 0.35, 0.94, 0.03, 0.38);
    chair(B, M, x, z + 0.25, 0, M.leatherBlack);
    col.boxC(x, z - 0.2, 0.95, 0.8, 0, 'terminal');
  }
  W.neon.push(neonSign(scene, 'Inside Track', '#5dff9c', 0, 6.0, -14.4, 0, 0.8));
  /* ---------- the bar ---------- */
  W.anchors.bar = { x:0, z:-1, rIn:2.6, rOut:3.3 };
  W.anchors.podium = { x:0, z:8.5 };
  W.anchors.wheel = { x:-11.2, z:17.2, ry:Math.PI/2 };
  W.anchors.cashier = { x:12, z:17.5, ry:-Math.PI/2 };
  /* ---------- slots floor ---------- */
  const slots = [];
  const themesByBank = ['burn', 'cash', 'ice'];
  [-24.5, -18, -11.5].forEach((cx, bi)=>{
    for(let side=-1; side<=1; side+=2){
      for(let i=0;i<5;i++){
        const z = -2.4 + i*1.2;
        slots.push({ x:cx + side*0.62, z, ry:side > 0 ? Math.PI/2 : -Math.PI/2, theme:themesByBank[bi] });
      }
    }
    /* the spine between the two rows */
    B.add(G.box, M.black, cx, 1.1, 0, 0.2, 2.2, 6.2);
    B.add(G.box, M.gold, cx, 2.25, 0, 0.26, 0.08, 6.3);
    col.box(cx - 1.12, -3.15, cx + 1.12, 3.15, 'slotbank');
  });
  slots.push({ x:-27.5, z:-9, ry:Math.PI/2, theme:'defrost' }, { x:-27.5, z:-7.6, ry:Math.PI/2, theme:'defrost' }, { x:-27.5, z:-10.4, ry:Math.PI/2, theme:'defrost' });
  col.box(-28.6, -11.2, -27, -6.8, 'slotbank');
  slots.push({ x:-29.2, z:-12.9, ry:Math.PI/2, theme:'vendor', id:'vendor' });
  col.box(-29.9, -13.6, -28.5, -12.2, 'slotbank');
  slots.push({ x:-29.2, z:5.2, ry:Math.PI/2, theme:'broken', id:'broken' });
  col.box(-29.9, 4.5, -28.5, 5.9, 'slotbank');
  W.anchors.slots = slots;
  W.neon.push(neonSign(scene, 'Slots', '#ff4fd8', -18, 5.0, 6.6, 0, 1.4, { flicker:0.15, both:true }));
  W.neon.push(neonSign(scene, 'Slots', '#ff4fd8', -8.2, 4.4, 0, -Math.PI/2, 1.2));
  W.neon.push(neonSign(scene, 'Defrost Deluxe', '#7ff3ff', -29.6, 3.6, -9, Math.PI/2, 0.7));
  /* ---------- table pit ---------- */
  W.anchors.bj = [{ x:11, z:-7, ry:0, min:5, max:500, name:'TABLE 1' }, { x:11, z:3.2, ry:0, min:25, max:2500, name:'TABLE 2' }];
  W.anchors.roulette = [{ x:20.5, z:-7, ry:0 }];
  W.anchors.poker = { x:21.5, z:4, ry:0 };
  W.anchors.pit = { x:16, z:-1.8 };
  W.neon.push(neonSign(scene, 'Blackjack', '#6fe8ff', 11, 4.6, -10.5, 0, 0.8));
  W.neon.push(neonSign(scene, 'Roulette', '#ff5a5a', 20.5, 4.6, -10.5, 0, 0.8));
  W.neon.push(neonSign(scene, "Hold'em", '#ffd56a', 21.5, 4.4, 7.7, Math.PI, 0.8));
  W.neon.push(neonSign(scene, 'Blackjack', '#6fe8ff', 11, 4.4, 6.4, Math.PI, 0.7));
  /* ---------- staff only ---------- */
  W.anchors.staffDoor = { x:-20.35, z:-14 };
  W.anchors.staff = { minX:-30, maxX:-12, minZ:-22, maxZ:-14 };
  const sCeil = new THREE.Mesh(new THREE.PlaneGeometry(18, 8), M.concrete); sCeil.rotation.x = Math.PI/2; sCeil.position.set(-21, 3.4, -18); scene.add(sCeil);
  const staffSign = new THREE.Mesh(G.plane, new THREE.MeshStandardMaterial({ map:T.plate('STAFF ONLY', { size:48, bg:'#2a0a0a', fg:'#ffdddd', rim:'#888' }), roughness:0.5 }));
  staffSign.scale.set(1.2, 0.3, 1); staffSign.position.set(-20.35, 2.75, -13.83); scene.add(staffSign);

  /* ---------- video walls ---------- */
  const slides = [SLIDES.logo, SLIDES.jackpot, SLIDES.drinks, SLIDES.wheel, SLIDES.race, SLIDES.member];
  try{ if(window.VENDOR && VENDOR.sawAny(['wall:hank','tag:26'])) slides.push(SLIDES.missing); }catch(e){}
  W.screens.push(new VideoWall(scene, C, 0, 3.4, -5.6, Math.PI, 3.2, 1.8, slides));
  W.screens.push(new VideoWall(scene, C, -29.82, 3.6, 0, Math.PI/2, 4.8, 2.7, [SLIDES.jackpot, SLIDES.logo]));
  W.screens.push(new VideoWall(scene, C, 29.82, 3.6, -1, -Math.PI/2, 4.8, 2.7, [SLIDES.logo, SLIDES.frdx, SLIDES.member, SLIDES.race]));
  W.screens.push(new VideoWall(scene, C, 21, 2.9, -21.82, 0, 5.4, 2.2, [SLIDES.frdx]));
  W.screens.push(new VideoWall(scene, C, 15, 3.8, 21.82, Math.PI, 3.6, 2, [SLIDES.wheel, SLIDES.drinks, SLIDES.logo]));

  W.batch = B;
  return W;
}
export function finishWorld(C){
  C.world.static = C.world.batch.build(C.scene);
  C.collide.build();
}
export function surfaceAt(x, z){
  if(z > 13) return 'marble';
  if(x > 12 && z < -14) return 'wood';
  if(x < -12 && z < -14) return 'marble';
  return 'carpet';
}
