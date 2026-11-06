/* ============================================================
   COLD OPEN: the visits after
   lou's table has candles on it and somebody else dealing.
   the podium is empty and black for a night. then the gold fridge
   is back, polished, like nothing happened, and every so often
   something inside it knocks. tape footprints go from the staff
   room to a door that's only painted on. the carpet's been cleaned.
   mostly. nicky's box is evidence, or nicky is back like he never
   left, depending on how it ended.
============================================================ */
import * as THREE from '../lib/three.module.min.js';
import { canvas, tex } from '../world/textures.js';

const R = (a, b)=>a + Math.random()*(b - a);
const pick = a=>a[(Math.random()*a.length)|0];

export function applyAfter(C, W){
  const S = W.S, v = C.save.d.visits;
  if(!S.ending || !S.lastVisit || v <= S.lastVisit) return null;
  const since = v - S.lastVisit;
  const scene = C.scene;
  const out = { since, update:null };
  /* ---------- lou ---------- */
  if(S.louDead && C.games.hilo && C.games.hilo.grp){
    const grp = C.games.hilo.grp;
    const flameM = new THREE.MeshBasicMaterial({ color:0xffc060, toneMapped:false }), waxM = new THREE.MeshStandardMaterial({ color:0xf2ead8, roughness:0.6 });
    const flames = [];
    [[-0.7, -0.3], [-0.5, -0.38], [0.55, -0.35], [0.75, -0.28], [0.65, -0.42]].forEach(([x, z], i)=>{ const h = R(0.06, 0.14); const c = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.02, h, 8), waxM); c.position.set(x, 0.84 + h/2, z); grp.add(c); const f = new THREE.Mesh(new THREE.SphereGeometry(0.012, 6, 4), flameM); f.scale.y = 1.8; f.position.set(x, 0.84 + h + 0.02, z); grp.add(f); flames.push(f); });
    const pc = canvas(256, 320), g = pc.getContext('2d'); g.fillStyle = '#2a1a10'; g.fillRect(0, 0, 256, 320); g.fillStyle = '#e8d9b0'; g.fillRect(20, 20, 216, 230); g.fillStyle = '#05111a'; g.fillRect(70, 60, 116, 70); g.fillStyle = '#ffd56a'; g.beginPath(); g.arc(104, 95, 9, 0, 7); g.arc(152, 95, 9, 0, 7); g.fill(); g.strokeStyle = '#ffd56a'; g.lineWidth = 5; g.beginPath(); g.arc(128, 105, 22, 0.2, Math.PI - 0.2); g.stroke(); g.fillStyle = '#7a1220'; g.fillRect(90, 160, 76, 50); g.fillStyle = '#f2d27a'; g.font = 'bold 30px Georgia'; g.textAlign = 'center'; g.fillText('LUCKY LOU', 128, 285); g.font = 'italic 16px Georgia'; g.fillText('he sweated for us', 128, 308);
    const photo = new THREE.Mesh(new THREE.PlaneGeometry(0.2, 0.25), new THREE.MeshStandardMaterial({ map:tex(pc), roughness:0.5 })); photo.position.set(0, 0.84 + 0.13, -0.42); photo.rotation.x = -0.25; grp.add(photo);
    out.flames = flames;
  }
  /* ---------- the podium and the thing in the gold fridge ---------- */
  const P = C.world.podium;
  if(P){
    if(since === 1){
      P.gold.group.visible = false; P.ledRing.material.color.setHex(0x3a2010);
      C.gore && C.gore.scorchMark && C.gore.scorchMark(new THREE.Vector3(0, 0, 8.5), 4);
      const tapeM = new THREE.MeshBasicMaterial({ color:0xf2d21a, side:THREE.DoubleSide });
      for(let i=0;i<8;i++){ const a = i/8*Math.PI*2, b = (i + 1)/8*Math.PI*2, r = 2.9; const x1 = Math.cos(a)*r, z1 = 8.5 + Math.sin(a)*r, x2 = Math.cos(b)*r, z2 = 8.5 + Math.sin(b)*r; const L = Math.hypot(x2 - x1, z2 - z1); const m = new THREE.Mesh(new THREE.PlaneGeometry(L, 0.08), tapeM); m.position.set((x1 + x2)/2, 1.0, (z1 + z2)/2); m.rotation.y = -Math.atan2(z2 - z1, x2 - x1); scene.add(m); }
    } else {
      /* it's back. something inside knocks */
      let knockT = R(25, 45);
      out.knock = dt=>{ knockT -= dt; if(knockT > 0) return; knockT = R(30, 60); const p = P.gold.group.getWorldPosition(new THREE.Vector3()); const d = p.distanceTo(C.camera.position); if(d > 12) return; [0, 0.35, 0.7].forEach(t=>C.audio.burst({ ff:220, type:'lowpass', q:1, d:0.18, g:0.5, t, dest:C.audio.out(p, 0.3) })); if(d < 7 && Math.random() < 0.6) C.hud.say('', pick(['something inside the gold fridge knocks. three times.', 'knock knock knock. from inside the prize.', S.ending === 'stopped' ? 'from inside the gold fridge, very faintly: "...partner?"' : 'the gold fridge knocks. it sounds like it\'s asking.']), 3.5); };
    }
  }
  /* ---------- the man in tape walked home ---------- */
  { const fm = new THREE.MeshBasicMaterial({ color:0xb89a62, transparent:true, opacity:0.85, depthWrite:false, polygonOffset:true, polygonOffsetFactor:-2 });
    const steps = []; let x = -20.35, z = -13.4, k = 0;
    const goal = [-29.6, 9];
    while(Math.hypot(goal[0] - x, goal[1] - z) > 0.6 && k < 80){ const a = Math.atan2(goal[1] - z, goal[0] - x); x += Math.cos(a)*0.55; z += Math.sin(a)*0.55; const side = k % 2 ? 1 : -1; const m = new THREE.Mesh(new THREE.PlaneGeometry(0.1, 0.22), fm); m.rotation.x = -Math.PI/2; m.rotation.z = -a + Math.PI/2; m.position.set(x + Math.cos(a + Math.PI/2)*0.1*side, 0.01, z + Math.sin(a + Math.PI/2)*0.1*side); scene.add(m); steps.push(m); k++; }
  }
  /* ---------- the carpet's been cleaned. mostly. ---------- */
  if(since <= 2){ for(let i=0;i<5;i++){ let x = R(-14, 4), z = R(-6, 16); const a = R(0, 6.28); for(let s=0;s<10;s++){ W.fx.smear('after' + i, x, z, since === 1 ? '#5a0806' : '#3a1210', 0.45); x += Math.cos(a)*0.4; z += Math.sin(a)*0.4; } W.fx.endSmear('after' + i); } }
  /* ---------- the people who aren't coming back ---------- */
  const sticker = (F, text)=>{ const c = canvas(128, 48), g = c.getContext('2d'); g.fillStyle = '#ffd400'; g.fillRect(0, 0, 128, 48); g.fillStyle = '#111'; g.font = 'bold 22px Arial'; g.textAlign = 'center'; g.fillText(text, 64, 32); const m = new THREE.Mesh(new THREE.PlaneGeometry(0.16, 0.06), new THREE.MeshBasicMaterial({ map:tex(c) })); m.position.set(F.w*0.2, (F.h || 1.7)*0.55, F.d/2 + 0.02); F.inner.add(m); };
  const boss = C.staff.find(F=>F.name === 'PIT BOSS'); if(boss){ boss.face.col = '#9ad8ff'; boss.face.draw(); sticker(boss, 'NEW HIRE'); }
  const doug = C.world.cage && C.world.cage.doug;
  if(doug && !S.dougSaved){ doug.face.col = '#c8ffb0'; doug.face.draw(); sticker(doug, 'NEW DOUG'); }
  /* ---------- nicky's box ---------- */
  const cups = C.games.cups;
  if(cups){
    const back = S.ending === 'escaped' ? since >= 1 : since >= 3;
    if(!back && cups.closeFor) cups.closeFor(S.ending === 'stopped' ? 'EVIDENCE · DO NOT TOUCH' : 'OUT OF BUSINESS');
    if(back && cups.backLine) cups.backLine(S.ending === 'stopped' ? 'out on bail. no hard feelings. okay. some feelings.' : 'hey. hey you. long time. ...what? i\'ve been here the whole time.');
  }
  out.update = (dt, t)=>{ if(out.knock) out.knock(dt); if(out.flames) out.flames.forEach((f, i)=>{ f.scale.y = 1.6 + Math.sin(t*13 + i*2)*0.4; f.position.x += Math.sin(t*9 + i)*0.0003; }); };
  return out;
}
