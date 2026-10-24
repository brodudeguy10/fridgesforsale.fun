/* ============================================================
   FRIDGE PALACE: collision + the player
   colliders live on the floor plane: boxes and circles. the player
   is a circle 0.28m wide that slides along them.
============================================================ */
import * as THREE from '../lib/three.module.min.js';

export class Collide {
  constructor(){ this.boxes = []; this.circles = []; this.cell = 4; this.grid = new Map(); this.dirty = true; }
  box(minX, minZ, maxX, maxZ, tag){ const b = { minX:Math.min(minX,maxX), minZ:Math.min(minZ,maxZ), maxX:Math.max(minX,maxX), maxZ:Math.max(minZ,maxZ), tag, on:true }; this.boxes.push(b); this.dirty = true; return b; }
  boxC(cx, cz, w, d, rotY, tag){
    /* a rotated rectangle gets its bounding box; good enough for furniture on a grid */
    const c = Math.abs(Math.cos(rotY || 0)), s = Math.abs(Math.sin(rotY || 0));
    const hw = (w*c + d*s)/2, hd = (w*s + d*c)/2;
    return this.box(cx - hw, cz - hd, cx + hw, cz + hd, tag);
  }
  circle(x, z, r, tag){ const c = { x, z, r, tag, on:true, circle:true }; this.circles.push(c); this.dirty = true; return c; }
  ring(x, z, rIn, rOut, tag){ const c = { x, z, r:rOut, rIn, tag, on:true, ring:true }; this.circles.push(c); this.dirty = true; return c; }
  build(){
    this.grid.clear();
    const add = (o, minX, minZ, maxX, maxZ)=>{
      for(let gx = Math.floor(minX/this.cell); gx <= Math.floor(maxX/this.cell); gx++)
        for(let gz = Math.floor(minZ/this.cell); gz <= Math.floor(maxZ/this.cell); gz++){
          const k = gx + ',' + gz; let a = this.grid.get(k); if(!a){ a = []; this.grid.set(k, a); } a.push(o);
        }
    };
    this.boxes.forEach(b=>add(b, b.minX, b.minZ, b.maxX, b.maxZ));
    this.circles.forEach(c=>add(c, c.x - c.r, c.z - c.r, c.x + c.r, c.z + c.r));
    this.dirty = false;
  }
  near(x, z){ if(this.dirty) this.build(); const out = new Set(); const gx = Math.floor(x/this.cell), gz = Math.floor(z/this.cell); for(let i=-1;i<=1;i++) for(let j=-1;j<=1;j++){ const a = this.grid.get((gx+i) + ',' + (gz+j)); if(a) a.forEach(o=>out.add(o)); } return out; }
  resolve(p, r){
    for(let it=0; it<3; it++){
      let hit = false;
      for(const o of this.near(p.x, p.z)){
        if(!o.on) continue;
        if(o.ring){
          const dx = p.x - o.x, dz = p.z - o.z, d = Math.hypot(dx, dz) || 1e-6;
          /* solid annulus between rIn and r */
          if(d < o.r + r && d > o.rIn - r){ hit = true; const out = (o.r + r) - d, inn = d - (o.rIn - r); if(out < inn){ p.x += dx/d*out; p.z += dz/d*out; } else { p.x -= dx/d*inn; p.z -= dz/d*inn; } }
        } else if(o.circle){
          const dx = p.x - o.x, dz = p.z - o.z, d = Math.hypot(dx, dz) || 1e-6, m = o.r + r;
          if(d < m){ hit = true; p.x += dx/d*(m - d); p.z += dz/d*(m - d); }
        } else {
          const cx = Math.max(o.minX, Math.min(p.x, o.maxX)), cz = Math.max(o.minZ, Math.min(p.z, o.maxZ));
          let dx = p.x - cx, dz = p.z - cz, d = Math.hypot(dx, dz);
          if(d < r){
            hit = true;
            if(d < 1e-6){
              /* inside: push out the short way */
              const l = p.x - o.minX, rr = o.maxX - p.x, t = p.z - o.minZ, b = o.maxZ - p.z, m = Math.min(l, rr, t, b);
              if(m === l) p.x = o.minX - r; else if(m === rr) p.x = o.maxX + r; else if(m === t) p.z = o.minZ - r; else p.z = o.maxZ + r;
            } else { p.x += dx/d*(r - d); p.z += dz/d*(r - d); }
          }
        }
      }
      if(!hit) break;
    }
  }
}

export class Player {
  constructor(C){
    this.C = C;
    this.pos = new THREE.Vector3(0, 0, 19);
    this.vel = new THREE.Vector2();
    this.yaw = 0; this.pitch = 0;
    this.eye = 1.62; this.r = 0.28;
    this.bob = 0; this.stepAcc = 0; this.walkAmt = 0;
    this.cam = C.engine.camera;
    this.mode = 'walk';
    this.tw = null;
    this.drunkPhase = 0;
    this.e = new THREE.Euler(0, 0, 0, 'YXZ');
    /* the heist adds these: crouching, a speed multiplier (aiming, carrying loot),
       and a camera shake that decays */
    this.crouch = false; this.crouchK = 0; this.speedMul = 1; this.shake = 0; this.shakeT = 0; this.noRun = false;
    this.kick = { x:0, y:0 };
  }
  addShake(a){ this.shake = Math.min(1.2, this.shake + a); }
  spawn(x, z, yaw){ this.pos.set(x, 0, z); this.yaw = yaw || 0; this.pitch = 0; this.vel.set(0, 0); }
  update(dt){
    const C = this.C, I = C.input;
    if(this.mode === 'walk'){
      const lk = I.look;
      const drunk = C.drunk || 0;
      this.yaw -= lk.x; this.pitch -= lk.y;
      this.pitch = Math.max(-1.35, Math.min(1.35, this.pitch));
      const m = I.sample();
      this.crouchK += ((this.crouch ? 1 : 0) - this.crouchK)*Math.min(1, dt*10);
      const run = I.running && !this.noRun && !this.crouch;
      const speed = (run ? 4.4 : 2.3)*(1 - drunk*0.15)*(1 - this.crouchK*0.45)*this.speedMul;
      const sy = Math.sin(this.yaw), cy = Math.cos(this.yaw);
      let tx = (m.x*cy + m.z*sy)*speed, tz = (-m.x*sy + m.z*cy)*speed;
      /* the drinks steer a little */
      if(drunk > 0.05){ this.drunkPhase += dt; const w = Math.sin(this.drunkPhase*0.9)*0.9 + Math.sin(this.drunkPhase*2.3)*0.4; tx += cy*w*drunk*1.2*(Math.abs(m.x) + Math.abs(m.z) > 0 ? 1 : 0.15); tz -= sy*w*drunk*1.2*(Math.abs(m.x) + Math.abs(m.z) > 0 ? 1 : 0.15); }
      const k = 1 - Math.exp(-dt*10);
      this.vel.x += (tx - this.vel.x)*k; this.vel.y += (tz - this.vel.y)*k;
      const ox = this.pos.x, oz = this.pos.z;
      this.pos.x += this.vel.x*dt; this.pos.z += this.vel.y*dt;
      C.collide.resolve(this.pos, this.r);
      const moved = Math.hypot(this.pos.x - ox, this.pos.z - oz);
      this.walkAmt += ((moved/dt > 0.3 ? 1 : 0) - this.walkAmt)*Math.min(1, dt*8);
      this.bob += moved*(run ? 2.6 : 3.1);
      this.stepAcc += moved;
      const stride = run ? 0.95 : 0.72;
      if(this.stepAcc > stride){ this.stepAcc = 0; C.audio.step(C.surfaceAt(this.pos.x, this.pos.z), run && !this.crouch); }
      this.running = run && moved/dt > 2.5;
      if(C.photo){ if(I.keys.Space) this.eye = Math.min(5.5, this.eye + dt*1.5); if(I.keys.KeyC) this.eye = Math.max(0.3, this.eye - dt*1.5); } else if(this.eye !== 1.62){ this.eye += (1.62 - this.eye)*Math.min(1, dt*4); }
      const bobOn = C.save.settings.bob && !C.photo ? 1 : 0;
      const by = Math.sin(this.bob*2)*0.035*this.walkAmt*bobOn, bx = Math.cos(this.bob)*0.025*this.walkAmt*bobOn;
      const eyeH = this.eye - this.crouchK*0.62;
      /* shake: two layers of noise, fast and slow, fading out */
      this.shakeT += dt; this.shake = Math.max(0, this.shake - dt*2.2);
      const sk = this.shake*this.shake, st = this.shakeT;
      const shx = (Math.sin(st*37.1) + Math.sin(st*23.7)*0.6)*0.012*sk, shy = (Math.sin(st*41.3) + Math.sin(st*17.9)*0.7)*0.012*sk;
      this.cam.position.set(this.pos.x + Math.cos(this.yaw)*bx, eyeH + by, this.pos.z - Math.sin(this.yaw)*bx);
      const roll = (drunk > 0.05 ? Math.sin(this.drunkPhase*0.7)*0.06*drunk : 0) + Math.sin(st*29.3)*0.01*sk + (this.lean || 0);
      this.e.set(this.pitch + shy + this.kick.y, this.yaw + shx + this.kick.x, roll); this.cam.quaternion.setFromEuler(this.e);
    } else if(this.tw){
      const T = this.tw; T.t = Math.min(1, T.t + dt/T.dur);
      const s = T.t < 0.5 ? 4*T.t*T.t*T.t : 1 - Math.pow(-2*T.t + 2, 3)/2;
      this.cam.position.lerpVectors(T.p0, T.p1, s);
      this.cam.quaternion.slerpQuaternions(T.q0, T.q1, s);
      if(T.t >= 1){ const cb = T.done; this.tw = null; if(cb) cb(); }
    } else if(this.mode === 'seat' && this.seatLook){
      /* in a seat you can still glance around a little by dragging */
      const lk = this.C.input.look; this.seatLook.yaw = Math.max(-0.6, Math.min(0.6, this.seatLook.yaw - lk.x*0.5)); this.seatLook.pitch = Math.max(-0.5, Math.min(0.4, this.seatLook.pitch - lk.y*0.5));
    }
  }
  /* glide the camera to a pose. pose: { pos:Vector3, look:Vector3 } */
  moveCam(pos, look, dur, done){
    const q1 = new THREE.Quaternion(); const m = new THREE.Matrix4(); m.lookAt(pos, look, new THREE.Vector3(0, 1, 0)); q1.setFromRotationMatrix(m);
    this.tw = { p0:this.cam.position.clone(), q0:this.cam.quaternion.clone(), p1:pos.clone(), q1, t:0, dur:dur || 0.8, done };
  }
  sit(pos, look, done){ this.mode = 'seat'; this.C.input.setWalk(false); this.moveCam(pos, look, 0.9, done); }
  stand(done){
    const eye = new THREE.Vector3(this.pos.x, this.eye, this.pos.z);
    const fwd = new THREE.Vector3(-Math.sin(this.yaw), 0, -Math.cos(this.yaw));
    this.pitch = 0;
    this.moveCam(eye, eye.clone().add(fwd), 0.6, ()=>{ this.mode = 'walk'; this.C.input.setWalk(true); if(done) done(); });
  }
  forward(){ return new THREE.Vector3(-Math.sin(this.yaw)*Math.cos(this.pitch), Math.sin(this.pitch), -Math.cos(this.yaw)*Math.cos(this.pitch)); }
}
