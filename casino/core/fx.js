/* ============================================================
   FRIDGE PALACE: particles. coins, confetti, sparkles.
   one instanced mesh per kind, recycled.
============================================================ */
import * as THREE from '../lib/three.module.min.js';

export class FX {
  constructor(C){
    this.C = C;
    const N = 260;
    this.coinG = new THREE.CylinderGeometry(0.025, 0.025, 0.004, 14);
    this.coin = new THREE.InstancedMesh(this.coinG, new THREE.MeshStandardMaterial({ color:0xf2c14e, metalness:1, roughness:0.22, emissive:0x3a2600, emissiveIntensity:0.6 }), N);
    this.coin.instanceMatrix.setUsage(THREE.DynamicDrawUsage); this.coin.frustumCulled = false; C.scene.add(this.coin);
    this.conf = new THREE.InstancedMesh(new THREE.PlaneGeometry(0.035, 0.02), new THREE.MeshBasicMaterial({ side:THREE.DoubleSide, toneMapped:false }), N);
    this.conf.instanceMatrix.setUsage(THREE.DynamicDrawUsage); this.conf.frustumCulled = false; C.scene.add(this.conf);
    const cc = new THREE.Color(); for(let i=0;i<N;i++){ cc.setHSL(Math.random(), 0.9, 0.6); this.conf.setColorAt(i, cc); }
    this.pc = []; this.pf = []; this.N = N;
    this.m = new THREE.Matrix4(); this.q = new THREE.Quaternion(); this.e = new THREE.Euler(); this.s = new THREE.Vector3(1, 1, 1); this.p = new THREE.Vector3();
    for(let i=0;i<N;i++){ this.pc.push({ life:0 }); this.pf.push({ life:0 }); }
    this.hide(this.coin); this.hide(this.conf);
  }
  hide(im){ const m = new THREE.Matrix4().makeScale(0, 0, 0); for(let i=0;i<this.N;i++) im.setMatrixAt(i, m); im.instanceMatrix.needsUpdate = true; }
  spawn(arr, n, f){ let k = 0; for(let i=0;i<arr.length && k<n;i++){ if(arr[i].life <= 0){ f(arr[i]); k++; } } }
  coins(pos, n, dir){
    dir = dir || new THREE.Vector3(0, 1, 0);
    this.spawn(this.pc, n || 40, p=>{ p.x = pos.x; p.y = pos.y; p.z = pos.z; p.vx = dir.x*1.6 + (Math.random() - 0.5)*1.8; p.vy = 2 + Math.random()*2.6; p.vz = dir.z*1.6 + (Math.random() - 0.5)*1.8; p.rx = Math.random()*6; p.ry = Math.random()*6; p.wx = (Math.random() - 0.5)*20; p.wy = (Math.random() - 0.5)*20; p.life = 2.2 + Math.random(); p.floor = 0.01; });
  }
  confetti(pos, n){
    this.spawn(this.pf, n || 80, p=>{ p.x = pos.x + (Math.random() - 0.5)*0.4; p.y = pos.y; p.z = pos.z + (Math.random() - 0.5)*0.4; p.vx = (Math.random() - 0.5)*3; p.vy = 2.5 + Math.random()*3; p.vz = (Math.random() - 0.5)*3; p.rx = Math.random()*6; p.ry = Math.random()*6; p.wx = (Math.random() - 0.5)*14; p.wy = (Math.random() - 0.5)*14; p.life = 4 + Math.random()*2; p.floor = 0.005; });
  }
  step(arr, im, dt, drag, grav){
    const m = this.m; let any = false;
    for(let i=0;i<arr.length;i++){
      const p = arr[i];
      if(p.life <= 0){ if(p.wasAlive){ m.makeScale(0, 0, 0); im.setMatrixAt(i, m); p.wasAlive = false; any = true; } continue; }
      p.life -= dt; p.wasAlive = true; any = true;
      p.vy -= grav*dt; p.vx *= 1 - drag*dt; p.vz *= 1 - drag*dt; if(drag > 1) p.vy = Math.max(p.vy, -0.7);
      p.x += p.vx*dt; p.y += p.vy*dt; p.z += p.vz*dt;
      if(p.y < p.floor){ p.y = p.floor; p.vy *= -0.3; p.vx *= 0.6; p.vz *= 0.6; p.wx *= 0.5; p.wy *= 0.5; }
      p.rx += p.wx*dt; p.ry += p.wy*dt;
      this.e.set(p.rx, p.ry, 0); this.q.setFromEuler(this.e); this.p.set(p.x, p.y, p.z);
      const sc = Math.min(1, p.life*2); this.s.set(sc, sc, sc);
      m.compose(this.p, this.q, this.s); im.setMatrixAt(i, m);
    }
    if(any) im.instanceMatrix.needsUpdate = true;
  }
  update(dt){ this.step(this.pc, this.coin, dt, 0.2, 9.8); this.step(this.pf, this.conf, dt, 2.2, 3.5); }
}
