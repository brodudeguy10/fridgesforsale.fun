/* ============================================================
   FRIDGE PALACE HEIST: the hardware in clement's duffel bag
   every gun is built from boxes and cylinders, held by two
   black-gloved fridge arms. the moving parts are kept separate
   so the reload animations can grab them.
============================================================ */
import * as THREE from '../lib/three.module.min.js';
import { RoundedBoxGeometry } from '../lib/addons/geometries/RoundedBoxGeometry.js';
import { canvas, tex } from '../world/textures.js';

const box = (w, h, d, r)=>r ? new RoundedBoxGeometry(w, h, d, 2, r) : new THREE.BoxGeometry(w, h, d);
const cyl = (r, l, seg, r2)=>new THREE.CylinderGeometry(r2 === undefined ? r : r2, r, l, seg || 16);
function mesh(g, m, x, y, z, rx, ry, rz){ const o = new THREE.Mesh(g, m); o.position.set(x || 0, y || 0, z || 0); o.rotation.set(rx || 0, ry || 0, rz || 0); return o; }

/* materials shared by every gun */
const MAT = (()=>{
  const wood = (()=>{ const c = canvas(128, 256), g = c.getContext('2d'); g.fillStyle = '#5a2e14'; g.fillRect(0, 0, 128, 256); for(let i=0;i<60;i++){ g.strokeStyle = `rgba(${30 + Math.random()*40},${10 + Math.random()*20},0,${0.2 + Math.random()*0.3})`; g.lineWidth = 1 + Math.random()*2; g.beginPath(); const x = Math.random()*128; g.moveTo(x, 0); g.bezierCurveTo(x + 10, 80, x - 10, 170, x + 5, 256); g.stroke(); } return tex(c); })();
  const engr = (text)=>{ const c = canvas(512, 64), g = c.getContext('2d'); g.fillStyle = '#2a2b2e'; g.fillRect(0, 0, 512, 64); g.fillStyle = '#9a8a5a'; g.font = 'italic bold 34px Georgia'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(text, 256, 34); return tex(c); };
  const gauge = (()=>{ const c = canvas(128, 128), g = c.getContext('2d'); g.fillStyle = '#f2efe6'; g.beginPath(); g.arc(64, 64, 62, 0, 7); g.fill(); g.strokeStyle = '#222'; g.lineWidth = 3; g.stroke(); for(let i=0;i<=10;i++){ const a = Math.PI*0.75 + i/10*Math.PI*1.5; g.lineWidth = i % 5 ? 2 : 4; g.beginPath(); g.moveTo(64 + Math.cos(a)*44, 64 + Math.sin(a)*44); g.lineTo(64 + Math.cos(a)*56, 64 + Math.sin(a)*56); g.stroke(); } g.fillStyle = '#c0392b'; g.beginPath(); g.arc(64, 64, 52, Math.PI*1.95, Math.PI*2.25); g.lineTo(64, 64); g.fill(); g.fillStyle = '#222'; g.font = 'bold 14px monospace'; g.textAlign = 'center'; g.fillText('FREON', 64, 96); return tex(c); })();
  return {
    metal:new THREE.MeshStandardMaterial({ color:0x2b2d31, roughness:0.32, metalness:0.9 }),
    blued:new THREE.MeshStandardMaterial({ color:0x1b2230, roughness:0.22, metalness:0.95 }),
    chrome:new THREE.MeshStandardMaterial({ color:0xd8dade, roughness:0.1, metalness:1 }),
    brass:new THREE.MeshStandardMaterial({ color:0xc9a04a, roughness:0.25, metalness:1 }),
    poly:new THREE.MeshStandardMaterial({ color:0x18191b, roughness:0.75, metalness:0.05 }),
    wood:new THREE.MeshStandardMaterial({ map:wood, roughness:0.55, metalness:0 }),
    dark:new THREE.MeshStandardMaterial({ color:0x050506, roughness:0.9 }),
    ice:new THREE.MeshStandardMaterial({ color:0x9fe8ff, roughness:0.15, metalness:0.1, emissive:0x1a6a8a, emissiveIntensity:0.6 }),
    orange:new THREE.MeshStandardMaterial({ color:0xd8500c, roughness:0.45, metalness:0.2 }),
    white:new THREE.MeshStandardMaterial({ color:0xeeeeea, roughness:0.4, metalness:0.1 }),
    frost:new THREE.MeshStandardMaterial({ color:0xe6f7ff, roughness:0.9, transparent:true, opacity:0.55 }),
    glow:new THREE.MeshBasicMaterial({ color:0x7ff3ff, toneMapped:false }),
    red:new THREE.MeshBasicMaterial({ color:0xff3030, toneMapped:false }),
    glove:new THREE.MeshStandardMaterial({ color:0x111113, roughness:0.85 }),
    sleeve:new THREE.MeshStandardMaterial({ color:0xe8e8ea, roughness:0.3 }),
    gauge:new THREE.MeshBasicMaterial({ map:gauge }),
    engr
  };
})();
export { MAT };

/* a fridge arm in a black glove: shoulder off-screen, hand where we say */
function arm(side){
  const g = new THREE.Group();
  const fore = mesh(cyl(0.03, 0.34, 12, 0.036), MAT.sleeve, 0, 0, 0.17, Math.PI/2, 0, 0); g.add(fore);
  const cuff = mesh(cyl(0.036, 0.03, 12), MAT.poly, 0, 0, 0.02, Math.PI/2, 0, 0); g.add(cuff);
  const hand = mesh(new THREE.SphereGeometry(0.042, 14, 10), MAT.glove, 0, 0, -0.01); hand.scale.set(1, 0.85, 1.25); g.add(hand);
  const thumb = mesh(cyl(0.012, 0.05, 8), MAT.glove, side*0.035, 0.012, -0.03, Math.PI/2.4, 0, side*0.4); g.add(thumb);
  return g;
}

/* ---------- the guns ---------- */
function revolver(){
  const G = new THREE.Group(), P = {};
  G.add(mesh(box(0.032, 0.058, 0.1, 0.006), MAT.blued, 0, 0.012, 0.0));
  G.add(mesh(box(0.03, 0.016, 0.1, 0.004), MAT.blued, 0, 0.044, -0.06));
  const barrel = mesh(cyl(0.011, 0.17, 16), MAT.blued, 0, 0.028, -0.13, Math.PI/2, 0, 0); G.add(barrel);
  G.add(mesh(box(0.006, 0.012, 0.012), MAT.blued, 0, 0.044, -0.205));
  G.add(mesh(box(0.012, 0.008, 0.01), MAT.blued, 0, 0.046, 0.04));
  /* the cylinder swings out on a crane for reloads */
  const crane = new THREE.Group(); crane.position.set(-0.012, 0.004, -0.018); G.add(crane);
  const drum = new THREE.Group(); drum.position.set(0.012, 0.016, 0); crane.add(drum);
  drum.add(mesh(cyl(0.023, 0.046, 18), MAT.blued, 0, 0, 0, Math.PI/2, 0, 0));
  for(let i=0;i<6;i++){ const a = i/6*Math.PI*2; drum.add(mesh(cyl(0.0055, 0.048, 8), MAT.dark, Math.cos(a)*0.013, Math.sin(a)*0.013, 0, Math.PI/2, 0, 0)); drum.add(mesh(new THREE.BoxGeometry(0.004, 0.046, 0.003), MAT.metal, Math.cos(a + 0.52)*0.022, Math.sin(a + 0.52)*0.022, 0, Math.PI/2, 0, a + 0.52)); }
  const rounds = new THREE.Group(); drum.add(rounds);
  for(let i=0;i<6;i++){ const a = i/6*Math.PI*2; rounds.add(mesh(cyl(0.005, 0.05, 8), MAT.brass, Math.cos(a)*0.013, Math.sin(a)*0.013, 0.003, Math.PI/2, 0, 0)); }
  P.crane = crane; P.drum = drum; P.rounds = rounds;
  const hammer = mesh(box(0.008, 0.02, 0.012), MAT.blued, 0, 0.045, 0.052, -0.4, 0, 0); G.add(hammer); P.hammer = hammer;
  const grip = mesh(box(0.03, 0.095, 0.04, 0.01), MAT.wood, 0, -0.045, 0.045, 0.32, 0, 0); G.add(grip);
  G.add(mesh(new THREE.TorusGeometry(0.016, 0.003, 6, 16, Math.PI), MAT.blued, 0, -0.018, 0.008, 0, Math.PI/2, Math.PI));
  G.add(mesh(box(0.004, 0.016, 0.004), MAT.metal, 0, -0.016, 0.006, 0.2, 0, 0));
  const plate = mesh(new THREE.PlaneGeometry(0.075, 0.012), new THREE.MeshStandardMaterial({ map:MAT.engr('COLD SHOULDER'), roughness:0.4, metalness:0.6 }), 0.0161, 0.03, -0.12, 0, Math.PI/2, 0); G.add(plate);
  const muzzle = new THREE.Object3D(); muzzle.position.set(0, 0.028, -0.22); G.add(muzzle);
  const R = arm(1); R.position.set(0.004, -0.06, 0.07); R.rotation.set(0.75, 0, 0); G.add(R);
  const L = arm(-1); L.position.set(-0.03, -0.068, 0.06); L.rotation.set(0.7, 0.45, 0.2); G.add(L);
  P.armR = R; P.armL = L;
  return { group:G, parts:P, muzzle, eject:null, hip:new THREE.Vector3(0.14, -0.15, -0.36), ads:new THREE.Vector3(0, -0.044, -0.32), adsFov:52 };
}
function shotgun(){
  const G = new THREE.Group(), P = {};
  G.add(mesh(box(0.042, 0.062, 0.2, 0.008), MAT.metal, 0, 0.0, 0.0));
  G.add(mesh(cyl(0.0125, 0.52, 16), MAT.blued, 0, 0.016, -0.36, Math.PI/2, 0, 0));
  G.add(mesh(cyl(0.011, 0.42, 14), MAT.blued, 0, -0.016, -0.31, Math.PI/2, 0, 0));
  G.add(mesh(new THREE.SphereGeometry(0.004, 8, 6), MAT.brass, 0, 0.03, -0.615));
  const pump = new THREE.Group(); pump.position.set(0, -0.016, -0.25); G.add(pump);
  pump.add(mesh(box(0.046, 0.036, 0.15, 0.012), MAT.wood, 0, -0.002, 0));
  for(let i=0;i<5;i++) pump.add(mesh(box(0.048, 0.003, 0.004), MAT.dark, 0, -0.012 + i*0.006, -0.05 + i*0.02));
  P.pump = pump;
  const stock = new THREE.Group(); stock.position.set(0, -0.01, 0.1); G.add(stock);
  stock.add(mesh(box(0.036, 0.05, 0.12, 0.01), MAT.wood, 0, -0.015, 0.06, 0.18, 0, 0));
  stock.add(mesh(box(0.04, 0.085, 0.12, 0.012), MAT.wood, 0, -0.06, 0.16, 0.3, 0, 0));
  G.add(mesh(new THREE.TorusGeometry(0.017, 0.003, 6, 16, Math.PI), MAT.metal, 0, -0.03, 0.05, 0, Math.PI/2, Math.PI));
  const port = mesh(box(0.002, 0.02, 0.05), MAT.dark, 0.0215, 0.006, -0.02); G.add(port);
  const shell = mesh(cyl(0.0095, 0.06, 10), new THREE.MeshStandardMaterial({ color:0xb02020, roughness:0.5 }), 0, 0, 0, Math.PI/2, 0, 0); shell.visible = false; G.add(shell); P.shell = shell;
  const plate = mesh(new THREE.PlaneGeometry(0.11, 0.016), new THREE.MeshStandardMaterial({ map:MAT.engr('ICEBREAKER'), roughness:0.4, metalness:0.6 }), 0.0215, -0.008, 0.02, 0, Math.PI/2, 0); G.add(plate);
  const muzzle = new THREE.Object3D(); muzzle.position.set(0, 0.016, -0.63); G.add(muzzle);
  const eject = new THREE.Object3D(); eject.position.set(0.03, 0.006, -0.02); G.add(eject);
  const R = arm(1); R.position.set(0.004, -0.058, 0.09); R.rotation.set(0.8, 0, 0); G.add(R);
  const L = arm(-1); L.position.set(-0.005, -0.045, -0.26); L.rotation.set(0.55, 0.25, 0.3); pump.add(L); L.position.set(-0.005, -0.03, -0.01);
  P.armR = R; P.armL = L;
  return { group:G, parts:P, muzzle, eject, hip:new THREE.Vector3(0.15, -0.16, -0.44), ads:new THREE.Vector3(0, -0.06, -0.38), adsFov:56 };
}
function smg(){
  const G = new THREE.Group(), P = {};
  G.add(mesh(box(0.044, 0.068, 0.25, 0.008), MAT.poly, 0, 0.0, -0.02));
  G.add(mesh(box(0.046, 0.012, 0.25), MAT.metal, 0, 0.038, -0.02));
  G.add(mesh(cyl(0.017, 0.1, 16), MAT.metal, 0, 0.012, -0.19, Math.PI/2, 0, 0));
  for(let i=0;i<6;i++) G.add(mesh(box(0.036, 0.004, 0.006), MAT.dark, 0, 0.012 + (i%2 ? 0.015 : -0.015), -0.155 - i*0.012));
  G.add(mesh(cyl(0.008, 0.04, 10), MAT.dark, 0, 0.012, -0.25, Math.PI/2, 0, 0));
  /* sights: a ring up front, a peep at the back */
  G.add(mesh(new THREE.TorusGeometry(0.009, 0.0025, 6, 16), MAT.metal, 0, 0.057, -0.12));
  G.add(mesh(box(0.003, 0.012, 0.003), MAT.metal, 0, 0.052, -0.12));
  G.add(mesh(new THREE.TorusGeometry(0.006, 0.003, 6, 16), MAT.metal, 0, 0.056, 0.085));
  G.add(mesh(box(0.003, 0.003, 0.003), MAT.glow, 0, 0.0565, -0.12));
  G.add(mesh(box(0.046, 0.006, 0.2), MAT.glow, 0, -0.022, -0.02));
  const mag = new THREE.Group(); mag.position.set(0, -0.04, -0.02); G.add(mag);
  mag.add(mesh(box(0.026, 0.14, 0.036, 0.004), MAT.metal, 0, -0.065, 0, 0.12, 0, 0));
  mag.add(mesh(box(0.028, 0.012, 0.04), MAT.poly, 0, -0.135, -0.008, 0.12, 0, 0));
  P.mag = mag;
  const grip = mesh(box(0.032, 0.1, 0.04, 0.01), MAT.poly, 0, -0.07, 0.07, 0.25, 0, 0); G.add(grip);
  G.add(mesh(new THREE.TorusGeometry(0.016, 0.003, 6, 16, Math.PI), MAT.poly, 0, -0.035, 0.035, 0, Math.PI/2, Math.PI));
  const bolt = mesh(box(0.01, 0.012, 0.02), MAT.chrome, 0.026, 0.024, 0.03); G.add(bolt); P.bolt = bolt;
  const stock = new THREE.Group(); stock.position.set(0, 0.0, 0.11); G.add(stock);
  stock.add(mesh(cyl(0.004, 0.16, 6), MAT.metal, 0.018, 0.0, 0.08, Math.PI/2, 0, 0)); stock.add(mesh(cyl(0.004, 0.16, 6), MAT.metal, -0.018, 0.0, 0.08, Math.PI/2, 0, 0)); stock.add(mesh(box(0.05, 0.07, 0.01), MAT.metal, 0, -0.02, 0.16));
  const plate = mesh(new THREE.PlaneGeometry(0.1, 0.014), new THREE.MeshStandardMaterial({ map:MAT.engr('LITTLE CHILL'), roughness:0.4, metalness:0.6 }), 0.0225, 0.005, -0.06, 0, Math.PI/2, 0); G.add(plate);
  const muzzle = new THREE.Object3D(); muzzle.position.set(0, 0.012, -0.275); G.add(muzzle);
  const eject = new THREE.Object3D(); eject.position.set(0.03, 0.022, -0.02); G.add(eject);
  const R = arm(1); R.position.set(0.004, -0.085, 0.1); R.rotation.set(0.8, 0, 0); G.add(R);
  const L = arm(-1); L.position.set(-0.01, -0.04, -0.14); L.rotation.set(0.45, 0.35, 0.6); G.add(L);
  P.armR = R; P.armL = L;
  return { group:G, parts:P, muzzle, eject, hip:new THREE.Vector3(0.14, -0.15, -0.36), ads:new THREE.Vector3(0, -0.0565, -0.28), adsFov:54 };
}
function freon(){
  const G = new THREE.Group(), P = {};
  /* the tank: orange, frosted, strapped on the left */
  const tank = new THREE.Group(); tank.position.set(-0.07, 0.02, -0.14); tank.scale.setScalar(0.7); G.add(tank);
  tank.add(mesh(cyl(0.05, 0.26, 20), MAT.orange, 0, 0, 0, Math.PI/2, 0, 0));
  tank.add(mesh(new THREE.SphereGeometry(0.05, 20, 10, 0, Math.PI*2, 0, Math.PI/2), MAT.orange, 0, 0, -0.13, -Math.PI/2, 0, 0));
  tank.add(mesh(new THREE.SphereGeometry(0.05, 20, 10, 0, Math.PI*2, 0, Math.PI/2), MAT.orange, 0, 0, 0.13, Math.PI/2, 0, 0));
  const frost = mesh(cyl(0.052, 0.18, 20), MAT.frost, 0, 0, -0.02, Math.PI/2, 0, 0); tank.add(frost); P.frost = frost;
  for(let i=0;i<2;i++) tank.add(mesh(cyl(0.053, 0.012, 20), MAT.metal, 0, 0, -0.07 + i*0.14, Math.PI/2, 0, 0));
  const lbl = canvas(256, 64), lg = lbl.getContext('2d'); lg.fillStyle = '#eee'; lg.fillRect(0, 0, 256, 64); lg.fillStyle = '#b00'; lg.font = 'bold 26px monospace'; lg.fillText('R-12 · PROPERTY', 8, 28); lg.fillStyle = '#222'; lg.font = 'bold 22px monospace'; lg.fillText('OF GUS. DON\'T.', 8, 56);
  tank.add(mesh(new THREE.PlaneGeometry(0.1, 0.025), new THREE.MeshBasicMaterial({ map:tex(lbl) }), -0.051, 0.0, 0.03, 0, -Math.PI/2, 0));
  /* the gun body */
  G.add(mesh(box(0.05, 0.07, 0.24, 0.012), MAT.white, 0, 0, -0.02));
  G.add(mesh(box(0.052, 0.012, 0.24), MAT.metal, 0, 0.04, -0.02));
  G.add(mesh(cyl(0.016, 0.22, 14), MAT.chrome, 0, 0.012, -0.24, Math.PI/2, 0, 0));
  const noz = mesh(cyl(0.03, 0.06, 16, 0.018), MAT.metal, 0, 0.012, -0.37, Math.PI/2, 0, 0); G.add(noz);
  const ring = mesh(new THREE.TorusGeometry(0.026, 0.004, 6, 20), MAT.glow, 0, 0.012, -0.395); G.add(ring); P.ring = ring;
  for(let i=0;i<4;i++) G.add(mesh(new THREE.TorusGeometry(0.018, 0.003, 6, 16), MAT.ice, 0, 0.012, -0.16 - i*0.04));
  /* hose from tank to body */
  const hose = new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new THREE.Vector3(-0.06, 0.035, -0.11), new THREE.Vector3(-0.07, 0.0, -0.16), new THREE.Vector3(-0.03, -0.02, -0.15), new THREE.Vector3(-0.02, 0.0, -0.1)]), 12, 0.006, 6);
  G.add(new THREE.Mesh(hose, MAT.poly));
  /* the gauge with a needle */
  const gauge = mesh(new THREE.CircleGeometry(0.022, 24), MAT.gauge, 0.0, 0.07, 0.03, -0.5, 0, 0); G.add(gauge);
  G.add(mesh(cyl(0.024, 0.012, 24), MAT.chrome, 0.0, 0.066, 0.032, -0.5 + Math.PI/2, 0, 0));
  const needle = new THREE.Group(); needle.position.set(0, 0.0705, 0.0305); needle.rotation.x = -0.5; G.add(needle);
  needle.add(mesh(box(0.002, 0.018, 0.001), MAT.red, 0, 0.008, 0.001)); P.needle = needle;
  const grip = mesh(box(0.032, 0.1, 0.04, 0.01), MAT.poly, 0, -0.07, 0.07, 0.25, 0, 0); G.add(grip);
  const fgrip = mesh(box(0.028, 0.08, 0.03, 0.01), MAT.poly, 0, -0.06, -0.15, -0.1, 0, 0); G.add(fgrip);
  const muzzle = new THREE.Object3D(); muzzle.position.set(0, 0.012, -0.41); G.add(muzzle);
  const R = arm(1); R.position.set(0.004, -0.085, 0.1); R.rotation.set(0.8, 0, 0); G.add(R);
  const L = arm(-1); L.position.set(-0.002, -0.08, -0.15); L.rotation.set(0.6, 0.1, 0.1); G.add(L);
  P.armR = R; P.armL = L;
  return { group:G, parts:P, muzzle, eject:null, hip:new THREE.Vector3(0.16, -0.17, -0.42), ads:new THREE.Vector3(0.06, -0.11, -0.38), adsFov:60 };
}

export const BUILDERS = { revolver, shotgun, smg, freon };

/* what each gun does. damage is per pellet, spread in radians */
export const WEAPONS = {
  revolver:{ key:'revolver', name:'COLD SHOULDER', kind:'.357 revolver', slot:1, mag:6, reserve:30, maxReserve:48, dmg:58, crit:2.0, pellets:1, spread:0.012, adsSpread:0.002, bloom:0.035, rof:0.36, auto:false, recoil:0.075, recoilX:0.012, reload:2.3, range:60, falloff:[30, 60, 0.7], shake:0.38, sound:'revolver' },
  shotgun:{ key:'shotgun', name:'ICEBREAKER', kind:'12 gauge pump', slot:2, mag:6, reserve:18, maxReserve:36, dmg:15, crit:1.4, pellets:9, spread:0.065, adsSpread:0.05, bloom:0.02, rof:0.85, auto:false, recoil:0.11, recoilX:0.02, reloadShell:0.52, range:30, falloff:[6, 20, 0.25], shake:0.6, sound:'shotgun', knock:3.2 },
  smg:{ key:'smg', name:'LITTLE CHILL', kind:'9mm smg', slot:3, mag:30, reserve:90, maxReserve:180, dmg:17, crit:1.6, pellets:1, spread:0.03, adsSpread:0.012, bloom:0.011, rof:0.072, auto:true, recoil:0.022, recoilX:0.01, reload:2.0, range:45, falloff:[15, 40, 0.55], shake:0.12, sound:'smg' },
  freon:{ key:'freon', name:'THE FREON CANNON', kind:'gus\'s R-12 thrower', slot:4, mag:100, reserve:0, maxReserve:0, dmg:0, freeze:70, pellets:0, spread:0.25, adsSpread:0.18, rof:0.05, auto:true, recoil:0.002, recoilX:0.002, range:7.5, shake:0.04, sound:'freon', stream:true }
};
