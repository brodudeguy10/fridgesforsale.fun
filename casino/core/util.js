/* ============================================================
   FRIDGE PALACE: small shared tools
============================================================ */
export class Bus {
  constructor(){ this.m = {}; }
  on(k, f){ (this.m[k] = this.m[k] || []).push(f); return f; }
  off(k, f){ const a = this.m[k]; if(a){ const i = a.indexOf(f); if(i >= 0) a.splice(i, 1); } }
  emit(k, d){ const a = this.m[k]; if(a) a.slice().forEach(f=>{ try{ f(d); }catch(e){ console.error(e); } }); }
}
export const ease = {
  linear:t=>t,
  inOut:t=>t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3)/2,
  out:t=>1 - Math.pow(1 - t, 3),
  in:t=>t*t*t,
  back:t=>{ const c1 = 1.70158, c3 = c1 + 1; return 1 + c3*Math.pow(t - 1, 3) + c1*Math.pow(t - 1, 2); },
  bounce:t=>{ const n = 7.5625, d = 2.75; if(t < 1/d) return n*t*t; if(t < 2/d) return n*(t -= 1.5/d)*t + 0.75; if(t < 2.5/d) return n*(t -= 2.25/d)*t + 0.9375; return n*(t -= 2.625/d)*t + 0.984375; }
};
/* game-time tweens: they freeze with the frame loop, unlike setTimeout */
export class Tweens {
  constructor(){ this.list = []; }
  add(o){
    /* { dur, ease, update(k), done } */
    const t = Object.assign({ t:0, dur:0.5, ease:ease.inOut }, o);
    this.list.push(t);
    return new Promise(res=>{ t._res = res; });
  }
  /* move an Object3D: position / rotation / scale targets */
  to(obj, o){
    const p0 = obj.position.clone(), r0 = obj.rotation.clone(), s0 = obj.scale.clone(), q0 = obj.quaternion.clone();
    const arc = o.arc || 0;
    return this.add({ dur:o.dur || 0.5, ease:o.ease || ease.inOut, update:k=>{
      if(o.pos){ obj.position.lerpVectors(p0, o.pos, k); if(arc) obj.position.y += Math.sin(k*Math.PI)*arc; }
      if(o.quat) obj.quaternion.slerpQuaternions(q0, o.quat, k);
      else if(o.rot){ obj.rotation.set(r0.x + (o.rot.x - r0.x)*k, r0.y + (o.rot.y - r0.y)*k, r0.z + (o.rot.z - r0.z)*k); }
      if(o.scale) obj.scale.lerpVectors(s0, o.scale, k);
      if(o.update) o.update(k);
    }, done:o.done });
  }
  sleep(sec){ return this.add({ dur:sec, update:()=>{} }); }
  update(dt){
    for(let i=this.list.length - 1; i>=0; i--){
      const t = this.list[i]; t.t = Math.min(1, t.t + dt/t.dur);
      try{ t.update && t.update(t.ease(t.t)); }catch(e){ console.error(e); }
      if(t.t >= 1){ this.list.splice(i, 1); try{ t.done && t.done(); }catch(e){ console.error(e); } t._res && t._res(); }
    }
  }
  clear(){ this.list.forEach(t=>t._res && t._res()); this.list = []; }
}
export const rand = (a, b)=>a + Math.random()*(b - a);
export const randi = (a, b)=>Math.floor(rand(a, b + 1));
export const pick = a=>a[(Math.random()*a.length)|0];
export const clamp = (v, a, b)=>v < a ? a : v > b ? b : v;
export function shuffle(a){ for(let i=a.length - 1; i>0; i--){ const j = (Math.random()*(i + 1))|0; [a[i], a[j]] = [a[j], a[i]]; } return a; }
/* crypto-backed integer in [0, n) for anything that pays out */
export function fair(n){
  try{ const u = new Uint32Array(1); const lim = Math.floor(4294967296/n)*n; let x; do{ crypto.getRandomValues(u); x = u[0]; }while(x >= lim); return x % n; }
  catch(e){ return Math.floor(Math.random()*n); }
}
