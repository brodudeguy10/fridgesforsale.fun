/* ============================================================
   FRIDGE PALACE: the crowd
   guests wander between things to do: slots, the bar, the race
   screen, the tables, the lobby. they walk a navigation grid built
   from the same colliders you bump into. they talk if you ask,
   they cheer when somebody wins, they go home eventually.
============================================================ */
import * as THREE from '../lib/three.module.min.js';
import { makeFridge, animateFridge, STYLES } from '../world/fridge.js';
import { pick, rand, randi } from '../core/util.js';
import { LINES, nameFor } from './dialogue.js';

const COLORS = ['#e8e8ea', '#f4f1e6', '#e05a5a', '#5a8ae0', '#9fe3d0', '#ffd56a', '#3a3a40', '#c060ff', '#ff8a3d', '#7ad08a', '#d9a441', '#8a4b22', '#ff7ad0', '#1c2733', '#cfd8dc'];
const ACCS = [[], [], ['tophat'], ['cowboy'], ['party'], ['beanie'], ['crown'], ['chain'], ['bowtie'], ['magnets'], ['rust'], ['neon'], ['headset']];

export function init(C){
  const { scene } = C, col = C.collide;
  const NPCS = [];
  /* ---------- navigation grid ---------- */
  const X0 = -29.5, X1 = 29.5, Z0 = -21.5, Z1 = 21.5, S = 1.0;
  const nx = Math.round((X1 - X0)/S) + 1, nz = Math.round((Z1 - Z0)/S) + 1;
  let walk = null;
  const forbidden = (x, z)=>(x < -12 && z < -14) || (x > 11.6 && z > 13.8) || (Math.hypot(x, z + 1) < 3.9) || z > 21;
  function buildGrid(){
    col.build();
    walk = new Uint8Array(nx*nz);
    const p = new THREE.Vector3();
    for(let j=0;j<nz;j++) for(let i=0;i<nx;i++){
      const x = X0 + i*S, z = Z0 + j*S;
      if(forbidden(x, z)) continue;
      p.set(x, 0, z); const ox = p.x, oz = p.z; col.resolve(p, 0.5);
      if(Math.abs(p.x - ox) < 0.01 && Math.abs(p.z - oz) < 0.01) walk[j*nx + i] = 1;
    }
  }
  const cellOf = (x, z)=>[Math.round((x - X0)/S), Math.round((z - Z0)/S)];
  const ok = (i, j)=>i >= 0 && j >= 0 && i < nx && j < nz && walk[j*nx + i];
  function nearestWalk(x, z){ const [ci, cj] = cellOf(x, z); for(let r=0; r<6; r++) for(let dj=-r; dj<=r; dj++) for(let di=-r; di<=r; di++){ if(Math.max(Math.abs(di), Math.abs(dj)) !== r) continue; if(ok(ci + di, cj + dj)) return [ci + di, cj + dj]; } return null; }
  /* A* with a binary heap and stamped typed arrays (the old open list was a
     linear scan, which spiked on long walks across the hall) */
  const NN = nx*nz, gS = new Float32Array(NN), cameS = new Int32Array(NN), seenS = new Uint32Array(NN), doneS = new Uint32Array(NN);
  let stamp = 0; const hk = [], hs = []; let hn = 0;
  const hpush = (v, sc)=>{ let i = hn++; while(i > 0){ const p = (i - 1) >> 1; if(hs[p] <= sc) break; hk[i] = hk[p]; hs[i] = hs[p]; i = p; } hk[i] = v; hs[i] = sc; };
  const hpop = ()=>{ const top = hk[0], n = --hn; if(n > 0){ const v = hk[n], sc = hs[n]; let i = 0; for(;;){ const l = 2*i + 1; if(l >= n) break; const r = l + 1, m = r < n && hs[r] < hs[l] ? r : l; if(hs[m] >= sc) break; hk[i] = hk[m]; hs[i] = hs[m]; i = m; } hk[i] = v; hs[i] = sc; } return top; };
  function path(fx, fz, tx, tz){
    const a = nearestWalk(fx, fz), b = nearestWalk(tx, tz); if(!a || !b) return null;
    const st = ++stamp; hn = 0;
    const bi = b[0], bj = b[1], ka = a[1]*nx + a[0], kb = bj*nx + bi;
    const h = (i, j)=>Math.hypot(i - bi, j - bj);
    gS[ka] = 0; cameS[ka] = -1; seenS[ka] = st; hpush(ka, h(a[0], a[1]));
    let guard = 0;
    while(hn && guard++ < 4000){
      const k = hpop(); if(doneS[k] === st) continue; doneS[k] = st;
      if(k === kb){ const out = []; let c = k; while(c >= 0){ out.push([X0 + (c % nx)*S, Z0 + Math.floor(c/nx)*S]); c = cameS[c]; } out.reverse(); return smooth(out); }
      const ci = k % nx, cj = (k/nx)|0, gk = gS[k];
      for(let dj=-1; dj<=1; dj++) for(let di=-1; di<=1; di++){
        if(!di && !dj) continue; const ni = ci + di, nj = cj + dj; if(!ok(ni, nj)) continue;
        if(di && dj && (!ok(ci + di, cj) || !ok(ci, cj + dj))) continue;
        const nk = nj*nx + ni; if(doneS[nk] === st) continue;
        const ng = gk + (di && dj ? 1.414 : 1);
        if(seenS[nk] === st && gS[nk] <= ng) continue;
        seenS[nk] = st; gS[nk] = ng; cameS[nk] = k; hpush(nk, ng + h(ni, nj));
      }
    }
    return null;
  }
  /* drop waypoints you can see past */
  function clear(ax, az, bx, bz){ const d = Math.hypot(bx - ax, bz - az), n = Math.ceil(d/0.4); for(let k=1;k<n;k++){ const [i, j] = cellOf(ax + (bx - ax)*k/n, az + (bz - az)*k/n); if(!ok(i, j)) return false; } return true; }
  function smooth(pts){ if(pts.length < 3) return pts; const out = [pts[0]]; let i = 0; while(i < pts.length - 1){ let j = pts.length - 1; while(j > i + 1 && !clear(pts[i][0], pts[i][1], pts[j][0], pts[j][1])) j--; out.push(pts[j]); i = j; } return out; }

  /* the heist borrows the grid for enemies */
  C.nav = { path, nearestWalk, ok:(i, j)=>ok(i, j), cellOf, X0, Z0, S, nx, nz, rebuild:()=>buildGrid(), walkAt:(x, z)=>{ const [i, j] = cellOf(x, z); return ok(i, j); }, clear, get ready(){ return !!walk; } };
  /* ---------- places to be ---------- */
  function pois(){
    const L = [];
    (C.slots ? C.slots.machines : []).forEach(mc=>{ if(!mc.broken && !mc.isVendor) L.push({ type:'slot', mc, x:mc.seat.x, z:mc.seat.z, face:Math.atan2(mc.a.x - mc.seat.x, mc.a.z - mc.seat.z), cap:1 }); });
    for(let i=0;i<14;i++){ const a = i/14*Math.PI*2 + 0.11, r = 3.3 + 0.65; L.push({ type:'bar', x:Math.cos(a)*r, z:-1 + Math.sin(a)*r, face:Math.atan2(-Math.cos(a), -Math.sin(a)), cap:1 }); }
    for(let i=0;i<8;i++) L.push({ type:'race', x:-6 + i*1.7, z:-12.6 + (i%2)*0.6, face:Math.PI, cap:1 });
    (C.games.blackjack ? C.games.blackjack.tables : []).forEach(T=>{ if(T.a.vip) return; [[-1.6, 1.9], [1.6, 1.9]].forEach(([lx, lz])=>{ const w = new THREE.Vector3(lx, 0, lz).applyMatrix4(T.grp.matrixWorld); L.push({ type:'watch', x:w.x, z:w.z, face:Math.atan2(T.grp.position.x - w.x, T.grp.position.z - w.z), cap:1 }); }); });
    (C.games.roulette ? C.games.roulette.tables : []).forEach(T=>{ if(T.a.vip) return; [[0.8, 1.4], [-0.6, 1.5]].forEach(([lx, lz])=>{ const w = new THREE.Vector3(lx, 0, lz).applyMatrix4(T.grp.matrixWorld); L.push({ type:'watch', x:w.x, z:w.z, face:Math.atan2(T.grp.position.x - w.x, T.grp.position.z - w.z), cap:1 }); }); });
    [[-3, 15.5], [3.5, 16.5], [-6, 18], [6, 18.5], [-16, 17], [-20, 15.5], [18, 9.5], [-4, 6], [4, 5.5], [0, 11.5]].forEach(([x, z])=>L.push({ type:'mingle', x, z, face:rand(0, 6.28), cap:2 }));
    L.push({ type:'podium', x:0, z:12, face:Math.PI, cap:3 });
    L.push({ type:'wheel', x:-8, z:17.2, face:-Math.PI/2, cap:2 });
    L.push({ type:'cage', x:10.4, z:16.5, face:Math.PI/2, cap:2 });
    L.push({ type:'exit', x:0, z:20.8, face:0, cap:99 });
    return L;
  }
  let POIS = [];
  const used = new Map();
  function claim(p, n){ used.set(p, (used.get(p) || 0) + 1); n.poi = p; }
  function release(n){ if(n.poi){ used.set(n.poi, Math.max(0, (used.get(n.poi) || 1) - 1)); n.poi = null; } }
  function choose(n){
    const w = { slot:5, bar:3, race:2, watch:3, mingle:2, podium:1, wheel:1, cage:1, exit:n.age > 240 ? 6 : 0.2 };
    const free = POIS.filter(p=>(used.get(p) || 0) < p.cap && !(p.type === 'slot' && p.mc.npc));
    const tot = free.reduce((s, p)=>s + (w[p.type] || 1), 0); let r = Math.random()*tot;
    for(const p of free){ r -= (w[p.type] || 1); if(r <= 0) return p; }
    return free[0];
  }
  /* ---------- the people ---------- */
  function spawn(atDoor){
    const look = { face:true, arms:true, color:pick(COLORS), style:pick(STYLES), acc:pick(ACCS), eye:pick(['#7ff3ff', '#7ff3ff', '#ffd56a', '#ff7ad0', '#5dff9c']), shades:Math.random() < 0.15, partyCol:pick(['#ff3fa4', '#3fa4ff', '#ffd400']), beanie:pick(['#c0392b', '#2a2a2a', '#2d58c8']), neonCol:pick(['#ff3df2', '#3df2ff']) };
    const F = makeFridge(look); F.seed = Math.random()*10;
    const name = nameFor(look);
    let x, z;
    if(atDoor){ x = rand(-2, 2); z = 20.6; }
    else { const p = pick(POIS.filter(q=>q.type !== 'exit')); x = p.x + rand(-1, 1); z = p.z + rand(-1, 1); const nw = nearestWalk(x, z); if(nw){ x = X0 + nw[0]*S; z = Z0 + nw[1]*S; } }
    F.group.position.set(x, 0, z); F.group.rotation.y = rand(0, 6.28);
    scene.add(F.group);
    const n = { F, name, look, state:'idle', timer:rand(0.5, 3), path:null, pi:0, poi:null, age:atDoor ? 0 : rand(0, 200), speed:rand(0.9, 1.25), talkCD:0, hop:0, mood:pick(['chipper', 'grumpy', 'lucky', 'broke', 'tourist', 'regular']), personality:pick(Object.keys(LINES.personal)) };
    NPCS.push(n);
    return n;
  }
  function despawn(n){ release(n); if(n.machine){ n.machine.npc = null; n.machine = null; } scene.remove(n.F.group); const i = NPCS.indexOf(n); if(i >= 0) NPCS.splice(i, 1);
    /* each guest's merged body and face screen are theirs alone: give the memory back */
    n.F.group.traverse(o=>{ if(o.geometry && !o.geometry.userData.shared) o.geometry.dispose(); }); if(n.F.face && n.F.face.t) n.F.face.t.dispose(); }
  /* talking */
  function talk(n){
    n.talkCD = 4; n.state = 'chat'; n.timer = 4;
    const p = C.camera.position; n.F.group.rotation.y = Math.atan2(p.x - n.F.group.position.x, p.z - n.F.group.position.z);
    const line = LINES.pick(C, n);
    n.F.face.say(Math.min(4, line.length*0.05)); n.F.face.set(line.mood || 'happy', 3);
    C.hud.say(n.name, line.text);
    C.save.d.stats.talked++;
    if(C.save.d.stats.talked === 50){ C.hud.toast('you\'ve talked to 50 fridges tonight. they talk about you too.', 'gold'); }
  }
  C.world.interact.push({ pos:new THREE.Vector3(), r:2.2, text:()=>{ const n = nearestFacing(); return n ? 'talk to ' + n.name : null; }, use:()=>{ const n = nearestFacing(); if(n) talk(n); }, enabled:()=>{ const n = nearestFacing(); if(n){ this_pos.copy(n.F.group.position).setY(1.4); } return !!n; } });
  const this_pos = C.world.interact[C.world.interact.length - 1].pos;
  const _f = new THREE.Vector3(), _d = new THREE.Vector3();
  function nearestFacing(){
    C.camera.getWorldDirection(_f);
    let best = null, bs = 0;
    for(const n of NPCS){ _d.copy(n.F.group.position).setY(1.35).sub(C.camera.position); const d = _d.length(); if(d > 2.4) continue; _d.normalize(); const dot = _d.dot(_f); if(dot > 0.82 && dot - d*0.05 > bs){ bs = dot - d*0.05; best = n; } }
    return best;
  }
  /* cheering */
  C.bus.on('cheer', e=>{
    for(const n of NPCS){ const d = n.F.group.position.distanceTo(e.pos); if(d < (e.big ? 22 : 10)){ n.hop = e.big ? 2.5 : 1.4; n.F.face.set(Math.random() < 0.3 ? 'money' : 'happy', 3); const dx = e.pos.x - n.F.group.position.x, dz = e.pos.z - n.F.group.position.z; n.lookAt = Math.atan2(dx, dz); if(Math.random() < 0.3) n.F.face.say(1); } }
  });
  C.bus.on('race', e=>{ for(const n of NPCS){ if(n.poi && n.poi.type === 'race'){ n.hop = e.start ? 1 : 2; n.F.face.set(e.start ? 'shock' : (Math.random() < 0.5 ? 'happy' : 'sad'), 3); } } });
  /* ---------- update ---------- */
  let started = false, ambT = 0;
  function start(){
    buildGrid(); POIS = pois();
    const count = C.npcTarget || (C.engine.preset() === 'low' ? 10 : 18);
    for(let i=0;i<count;i++) spawn(false);
    started = true;
  }
  const tmp = new THREE.Vector3();
  return { name:'npcs', list:NPCS, spawn, despawn, release, talk, update(dt, t){
    /* the grid needs every collider, so it gets built on the first frame, after finishWorld */
    if(!started){ start(); return; }
    const cam = C.camera.position;
    ambT -= dt;
    for(let k=NPCS.length - 1; k>=0; k--){
      const n = NPCS[k], F = n.F, gp = F.group.position;
      n.age += dt; n.timer -= dt; if(n.talkCD > 0) n.talkCD -= dt;
      const d2 = gp.distanceToSquared(cam);
      const near = d2 < 225;
      F.face.update(dt, d2 < 100);
      /* during the heist somebody else is in charge of these people */
      if(n.ctl){ n.ctl(n, dt, t, d2); continue; }
      let moving = 0;
      if(n.state === 'idle' && n.timer <= 0){
        const p = choose(n);
        if(p){ const pth = path(gp.x, gp.z, p.x, p.z); if(pth && pth.length){ claim(p, n); n.path = pth; n.pi = 0; n.state = 'walk'; if(p.type === 'slot') p.mc.npc = n; } else n.timer = 2; }
      } else if(n.state === 'walk'){
        const wp = n.path[n.pi];
        if(!wp){ n.state = 'arrive'; }
        else {
          const dx = wp[0] - gp.x, dz = wp[1] - gp.z, dist = Math.hypot(dx, dz);
          /* give the player room */
          const pdx = cam.x - gp.x, pdz = cam.z - gp.z, pd = Math.hypot(pdx, pdz);
          let sp = 1.15*n.speed; if(pd < 1.0 && (pdx*dx + pdz*dz) > 0) sp = 0;
          if(dist < 0.15){ n.pi++; }
          else {
            const want = Math.atan2(dx, dz); let dy = want - F.group.rotation.y; dy = Math.atan2(Math.sin(dy), Math.cos(dy)); F.group.rotation.y += dy*Math.min(1, dt*6);
            const step = Math.min(dist, sp*dt); gp.x += dx/dist*step; gp.z += dz/dist*step; moving = sp;
          }
        }
      } else if(n.state === 'arrive'){
        const p = n.poi;
        if(!p){ n.state = 'idle'; n.timer = 1; }
        else if(p.type === 'exit'){ despawn(n); continue; }
        else {
          n.state = 'stay'; n.timer = p.type === 'slot' ? rand(25, 70) : p.type === 'bar' ? rand(20, 50) : rand(10, 30);
          n.faceTo = p.face; if(p.type === 'slot'){ n.machine = p.mc; p.mc.npc = n; n.spinT = rand(1, 3); }
          if(p.type === 'mingle'){ const other = NPCS.find(o=>o !== n && o.poi === p && o.state === 'stay'); if(other){ n.faceTo = Math.atan2(other.F.group.position.x - gp.x, other.F.group.position.z - gp.z); other.faceTo = n.faceTo + Math.PI; } }
        }
      } else if(n.state === 'stay'){
        if(n.faceTo !== undefined){ let dy = n.faceTo - F.group.rotation.y; dy = Math.atan2(Math.sin(dy), Math.cos(dy)); F.group.rotation.y += dy*Math.min(1, dt*3); }
        if(n.machine){ n.spinT -= dt; if(n.spinT <= 0){ n.spinT = rand(2.5, 5); if(C.slots) C.slots.npcSpin(n.machine); if(F.armR){ F.armBusy = true; F.armR.rotation.x = -1.2; setTimeout(()=>{ F.armBusy = false; }, 250); } if(Math.random() < 0.08) F.face.set(Math.random() < 0.5 ? 'money' : 'sad', 2); } }
        if(n.poi && n.poi.type === 'bar' && Math.random() < dt*0.05){ F.armBusy = true; F.armR.rotation.x = -1.6; setTimeout(()=>{ F.armBusy = false; }, 900); }
        if(n.poi && n.poi.type === 'mingle' && near && Math.random() < dt*0.3) F.face.say(rand(0.5, 1.5));
        if(n.timer <= 0){ if(n.machine){ n.machine.npc = null; n.machine = null; } release(n); n.state = 'idle'; n.timer = rand(0.3, 2); }
      } else if(n.state === 'chat'){
        if(n.timer <= 0) n.state = n.poi ? 'stay' : 'idle';
      }
      if(n.lookAt !== undefined && n.hop > 0){ let dy = n.lookAt - F.group.rotation.y; dy = Math.atan2(Math.sin(dy), Math.cos(dy)); F.group.rotation.y += dy*Math.min(1, dt*5); }
      if(n.hop > 0) n.hop -= dt;
      if(near || moving) animateFridge(F, t + F.seed, moving, { hop:n.hop > 0 });
      F.group.visible = d2 < 3600;
    }
    /* keep the room busy */
    if(!C.noSpawn && NPCS.length < (C.npcTarget || (C.engine.preset() === 'low' ? 10 : 18)) && Math.random() < dt*0.08) spawn(true);
    /* ambient chatter from people near you */
    if(ambT <= 0 && !C.noChatter){ ambT = rand(4, 9); const close = NPCS.filter(n=>n.F.group.position.distanceToSquared(cam) < 64 && n.state === 'stay'); if(close.length && Math.random() < 0.35){ const n = pick(close); n.F.face.say(1.5); if(Math.random() < 0.5){ const l = LINES.ambient(C, n); C.hud.toast(n.name + ': ' + l); } } }
  } };
}
