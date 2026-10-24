/* ============================================================
   FRIDGE PALACE: furniture
   static pieces go into a Batch that merges everything per
   material at the end, so a room full of stools costs a handful
   of draw calls instead of hundreds.
============================================================ */
import * as THREE from '../lib/three.module.min.js';
import { mergeGeometries } from '../lib/addons/utils/BufferGeometryUtils.js';
import { RoundedBoxGeometry } from '../lib/addons/geometries/RoundedBoxGeometry.js';

export class Batch {
  constructor(){ this.byMat = new Map(); this.tmp = new THREE.Object3D(); }
  /* add a geometry with a world transform */
  add(geo, mat, x, y, z, sx, sy, sz, rx, ry, rz){
    const o = this.tmp; o.position.set(x || 0, y || 0, z || 0); o.scale.set(sx === undefined ? 1 : sx, sy === undefined ? 1 : sy, sz === undefined ? 1 : sz); o.rotation.set(rx || 0, ry || 0, rz || 0); o.updateMatrix();
    return this.addM(geo, mat, o.matrix);
  }
  addM(geo, mat, m){
    let g = geo.index ? geo.toNonIndexed() : geo.clone();
    /* merged geometries must share attribute sets */
    for(const k of Object.keys(g.attributes)) if(k !== 'position' && k !== 'normal' && k !== 'uv') g.deleteAttribute(k);
    if(!g.attributes.uv){ g.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(g.attributes.position.count*2), 2)); }
    g.applyMatrix4(m);
    let a = this.byMat.get(mat); if(!a){ a = []; this.byMat.set(mat, a); } a.push(g);
    return g;
  }
  /* bake a whole Object3D tree (meshes only) into the batch */
  addObject(obj){
    obj.updateMatrixWorld(true);
    obj.traverse(o=>{ if(o.isMesh) this.addM(o.geometry, Array.isArray(o.material) ? o.material[0] : o.material, o.matrixWorld); });
  }
  build(scene){
    const out = [];
    for(const [mat, geos] of this.byMat){
      const merged = mergeGeometries(geos, false);
      if(!merged) continue;
      merged.computeBoundingSphere();
      const m = new THREE.Mesh(merged, mat); m.matrixAutoUpdate = false; m.updateMatrix();
      scene.add(m); out.push(m);
      geos.forEach(g=>g.dispose());
    }
    this.byMat.clear();
    return out;
  }
}

export const G = {
  box: new THREE.BoxGeometry(1, 1, 1),
  cyl: new THREE.CylinderGeometry(1, 1, 1, 24),
  cyl8: new THREE.CylinderGeometry(1, 1, 1, 10),
  sph: new THREE.SphereGeometry(1, 16, 12),
  cone: new THREE.ConeGeometry(1, 1, 12),
  plane: new THREE.PlaneGeometry(1, 1),
  oct: new THREE.OctahedronGeometry(1, 0),
  torus: new THREE.TorusGeometry(1, 0.08, 8, 32),
  rbox: (w, h, d, r)=>new RoundedBoxGeometry(w, h, d, 2, r)
};
export function uvScale(geo, sx, sy){ const uv = geo.attributes.uv; for(let i=0;i<uv.count;i++){ uv.setXY(i, uv.getX(i)*sx, uv.getY(i)*sy); } uv.needsUpdate = true; return geo; }

/* ---------- pieces ---------- */
export function column(B, M, x, z, h){
  B.add(G.cyl, M.marbleDark, x, h/2, z, 0.34, h, 0.34);
  B.add(G.cyl, M.gold, x, 0.12, z, 0.46, 0.24, 0.46);
  B.add(G.cyl, M.gold, x, 0.3, z, 0.4, 0.06, 0.4);
  B.add(G.cyl, M.gold, x, h - 0.2, z, 0.46, 0.4, 0.46);
  B.add(G.cyl, M.gold, x, h - 0.5, z, 0.39, 0.06, 0.39);
  for(let i=0;i<8;i++){ const a = i/8*Math.PI*2; B.add(G.box, M.gold, x + Math.cos(a)*0.345, h/2, z + Math.sin(a)*0.345, 0.025, h - 1, 0.025, 0, -a, 0); }
}
export function stool(B, M, x, z, seatH, mat){
  seatH = seatH || 0.78;
  B.add(G.cyl, M.chrome, x, 0.02, z, 0.24, 0.04, 0.24);
  B.add(G.cyl8, M.chrome, x, seatH/2, z, 0.035, seatH, 0.035);
  B.add(G.torus, M.chrome, x, 0.3, z, 0.17, 0.17, 0.4, Math.PI/2, 0, 0);
  B.add(G.cyl, mat || M.leatherRed, x, seatH + 0.04, z, 0.22, 0.09, 0.22);
}
export function chair(B, M, x, z, ry, mat){
  B.add(G.rbox(0.5, 0.12, 0.5, 0.04), mat || M.leatherRed, x, 0.48, z, 1, 1, 1, 0, ry, 0);
  const bx = x + Math.sin(ry)*0.23, bz = z + Math.cos(ry)*0.23;
  B.add(G.rbox(0.5, 0.6, 0.1, 0.04), mat || M.leatherRed, bx, 0.82, bz, 1, 1, 1, 0, ry, 0);
  B.add(G.cyl8, M.gold, x, 0.22, z, 0.04, 0.44, 0.04);
  B.add(G.cyl, M.gold, x, 0.02, z, 0.2, 0.04, 0.2);
}
export function plant(B, M, x, z, s){
  s = s || 1;
  B.add(G.cyl, M.pot, x, 0.3*s, z, 0.28*s, 0.6*s, 0.28*s);
  B.add(G.cyl, M.gold, x, 0.58*s, z, 0.3*s, 0.04*s, 0.3*s);
  for(let i=0;i<9;i++){ const a = i*2.39, r = 0.12 + (i%3)*0.08; B.add(G.cone, M.plant, x + Math.cos(a)*r*s, (0.95 + (i%4)*0.18)*s, z + Math.sin(a)*r*s, 0.18*s, 0.8*s, 0.18*s, Math.cos(a)*0.35, 0, Math.sin(a)*0.35); }
}
export function rope(B, M, a, b, sag){
  /* two stanchions and the velvet between them */
  [a, b].forEach(p=>{ B.add(G.cyl, M.gold, p.x, 0.5, p.z, 0.03, 1, 0.03); B.add(G.cyl, M.gold, p.x, 0.02, p.z, 0.15, 0.04, 0.15); B.add(G.sph, M.gold, p.x, 1.02, p.z, 0.06, 0.06, 0.06); });
  const pts = []; for(let i=0;i<=12;i++){ const t = i/12; pts.push(new THREE.Vector3(a.x + (b.x - a.x)*t, 0.95 - Math.sin(t*Math.PI)*(sag || 0.18), a.z + (b.z - a.z)*t)); }
  const tube = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 16, 0.03, 6, false);
  B.add(tube, M.velvet, 0, 0, 0);
}
export function couch(B, M, x, z, ry, len, mat){
  len = len || 2; mat = mat || M.leatherBlack;
  const c = Math.cos(ry), s = Math.sin(ry);
  const at = (lx, lz)=>[x + lx*c + lz*s, z - lx*s + lz*c];
  let p = at(0, 0); B.add(G.rbox(len, 0.42, 0.85, 0.08), mat, p[0], 0.25, p[1], 1, 1, 1, 0, ry, 0);
  p = at(0, 0.36); B.add(G.rbox(len, 0.75, 0.2, 0.08), mat, p[0], 0.62, p[1], 1, 1, 1, 0, ry, 0);
  p = at(-len/2, 0.05); B.add(G.rbox(0.18, 0.6, 0.85, 0.06), mat, p[0], 0.42, p[1], 1, 1, 1, 0, ry, 0);
  p = at(len/2, 0.05); B.add(G.rbox(0.18, 0.6, 0.85, 0.06), mat, p[0], 0.42, p[1], 1, 1, 1, 0, ry, 0);
}
export function coffeeTable(B, M, x, z){ B.add(G.cyl, M.marbleDark, x, 0.42, z, 0.5, 0.05, 0.5); B.add(G.cyl, M.gold, x, 0.2, z, 0.06, 0.4, 0.06); B.add(G.cyl, M.gold, x, 0.02, z, 0.3, 0.04, 0.3); }

/* a chandelier: rings of gold, hanging crystals, bright bulbs. returns the moving part */
export function chandelier(scene, B, M, x, y, z, s, crystalMat, bulbMat){
  s = s || 1;
  B.add(G.cyl8, M.gold, x, y + 0.9*s, z, 0.02, 1.8*s, 0.02);
  const rings = [[0.9, 0], [0.62, 0.32], [0.34, 0.6]];
  rings.forEach(([r, h])=>{
    B.add(G.torus, M.gold, x, y + h*s, z, r*s, r*s, r*s*1.5, Math.PI/2, 0, 0);
    const n = Math.round(r*18);
    for(let i=0;i<n;i++){
      const a = i/n*Math.PI*2, cx = x + Math.cos(a)*r*s, cz = z + Math.sin(a)*r*s;
      B.add(G.oct, crystalMat, cx, y + h*s - 0.16*s, cz, 0.05*s, 0.11*s, 0.05*s);
      if(i % 2 === 0) B.add(G.sph, bulbMat, cx, y + h*s + 0.07*s, cz, 0.045*s, 0.06*s, 0.045*s);
    }
  });
  B.add(G.oct, crystalMat, x, y - 0.35*s, z, 0.12*s, 0.3*s, 0.12*s);
}
