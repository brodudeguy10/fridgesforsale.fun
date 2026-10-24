/* ============================================================
   FRIDGE PALACE: shared materials
============================================================ */
import * as THREE from '../lib/three.module.min.js';
import * as T from './textures.js';

export function makeMaterials(){
  const S = THREE.MeshStandardMaterial;
  const rep = (t, x, y)=>{ const c = t.clone(); c.needsUpdate = true; c.repeat.set(x, y); c.wrapS = c.wrapT = THREE.RepeatWrapping; return c; };
  const M = {
    carpet: new S({ map:T.carpet(), roughness:0.96, metalness:0 }),
    marble: new S({ map:T.marble('#efe8dc', '#7d7466'), roughness:0.18, metalness:0, envMapIntensity:1.2 }),
    marbleDark: new S({ map:T.marble('#141012', '#a0814a', 2), roughness:0.15, metalness:0, envMapIntensity:1.3 }),
    marbleGreen: new S({ map:T.marble('#0c2a24', '#c9b27a', 5), roughness:0.15, metalness:0 }),
    gold: new S({ color:0xd9a441, metalness:1, roughness:0.27, envMapIntensity:1.4 }),
    goldDark: new S({ color:0x8a6420, metalness:1, roughness:0.4 }),
    chrome: new S({ color:0xe6e6ea, metalness:1, roughness:0.12, envMapIntensity:1.5 }),
    steel: new S({ color:0xb8bcc2, metalness:0.9, roughness:0.35 }),
    wood: new S({ map:T.wood(), roughness:0.42, metalness:0 }),
    woodDark: new S({ map:T.wood(), color:0x6a4a3a, roughness:0.35, metalness:0 }),
    wall: new S({ map:T.damask(), roughness:0.85, metalness:0.05 }),
    ceiling: new S({ map:T.coffer(), roughness:0.7, metalness:0.2 }),
    black: new S({ color:0x0b0b0e, roughness:0.22, metalness:0.2 }),
    blackMatte: new S({ color:0x121214, roughness:0.85 }),
    white: new S({ color:0xf2efe8, roughness:0.4 }),
    velvet: new S({ map:T.velvet(), roughness:0.9, color:0xffffff }),
    leatherRed: new S({ map:T.leather('#7a1220'), roughness:0.45 }),
    leatherBlack: new S({ map:T.leather('#1a1a1c'), roughness:0.4 }),
    glass: new S({ color:0x9fd8ff, roughness:0.05, metalness:0.1, transparent:true, opacity:0.18, depthWrite:false }),
    water: new S({ color:0x2a8fb8, roughness:0.1, metalness:0, transparent:true, opacity:0.35, depthWrite:false, emissive:0x08304a, emissiveIntensity:0.6 }),
    concrete: new S({ map:T.concrete(), roughness:0.95 }),
    tileStaff: new S({ map:T.tiles('#d8d4cc', '#bdb7ad', 4), roughness:0.6 }),
    plant: new S({ color:0x1f5a2a, roughness:0.8 }),
    pot: new S({ color:0x1a1a1a, roughness:0.3, metalness:0.6 }),
    screenOff: new S({ color:0x050608, roughness:0.15, metalness:0.3 })
  };
  M.carpet.map = rep(M.carpet.map, 1, 1);
  M.emissive = (color, k)=>new THREE.MeshStandardMaterial({ color:0x000000, emissive:new THREE.Color(color), emissiveIntensity:k || 2, roughness:0.5 });
  M.basic = (color)=>new THREE.MeshBasicMaterial({ color });
  M.glow = (map, color, opacity)=>new THREE.MeshBasicMaterial({ map, color:color || 0xffffff, transparent:true, opacity:opacity === undefined ? 1 : opacity, blending:THREE.AdditiveBlending, depthWrite:false, toneMapped:false, side:THREE.DoubleSide });
  M.rep = rep;
  return M;
}
