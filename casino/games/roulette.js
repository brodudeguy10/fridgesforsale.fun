/* ============================================================
   FRIDGE PALACE: roulette
   single zero on the floor, double zero in the club.
   every inside and outside bet: straight, split, street, corner,
   six line, column, dozen, red/black, odd/even, high/low.
   the ball is picked first, then the physics lies to match it.
============================================================ */
import * as THREE from '../lib/three.module.min.js';
import { G, stool } from '../world/props.js';
import { chipStack, DENOMS } from '../world/cards.js';
import { makeFridge } from '../world/fridge.js';
import { canvas, tex } from '../world/textures.js';
import { mergeGeometries } from '../lib/addons/utils/BufferGeometryUtils.js';
import { fair, pick, rand, ease } from '../core/util.js';

export const EU = [0,32,15,19,4,21,2,25,17,34,6,27,13,36,11,30,8,23,10,5,24,16,33,1,20,14,31,9,22,18,29,7,28,12,35,3,26];
export const US = [0,28,9,26,30,11,7,20,32,17,5,22,34,15,3,24,36,13,1,'00',27,10,25,29,12,8,19,31,18,6,21,33,16,4,23,35,14,2];
export const REDS = new Set([1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36]);
export const colorOf = n=>(n === 0 || n === '00') ? 'green' : (REDS.has(n) ? 'red' : 'black');
export function payOf(bet){ return bet.pay !== undefined ? bet.pay : Math.floor(36/bet.nums.length) - 1; }
export function wins(bet, n){ return bet.nums.some(x=>String(x) === String(n)); }
/* outside bets as number sets */
const range = (a, b)=>{ const o = []; for(let i=a;i<=b;i++) o.push(i); return o; };
export const OUTSIDE = {
  red:{ label:'RED', nums:range(1, 36).filter(n=>REDS.has(n)), pay:1 }, black:{ label:'BLACK', nums:range(1, 36).filter(n=>!REDS.has(n)), pay:1 },
  odd:{ label:'ODD', nums:range(1, 36).filter(n=>n % 2), pay:1 }, even:{ label:'EVEN', nums:range(1, 36).filter(n=>!(n % 2)), pay:1 },
  low:{ label:'1 to 18', nums:range(1, 18), pay:1 }, high:{ label:'19 to 36', nums:range(19, 36), pay:1 },
  d1:{ label:'1st 12', nums:range(1, 12), pay:2 }, d2:{ label:'2nd 12', nums:range(13, 24), pay:2 }, d3:{ label:'3rd 12', nums:range(25, 36), pay:2 },
  c1:{ label:'2 to 1', nums:range(1, 36).filter(n=>n % 3 === 1), pay:2 }, c2:{ label:'2 to 1', nums:range(1, 36).filter(n=>n % 3 === 2), pay:2 }, c3:{ label:'2 to 1', nums:range(1, 36).filter(n=>n % 3 === 0), pay:2 }
};
/* board coordinates: u across 0..12 (columns), v down 0..3 (rows). returns a bet spec */
export function hitTest(u, v){
  const E = 0.22;
  const col = Math.min(11, Math.max(0, Math.floor(u))), row = Math.min(2, Math.max(0, Math.floor(v)));
  const num = (c, r)=>c*3 + (3 - r);
  const fu = u - Math.round(u), fv = v - Math.round(v);
  const nearU = Math.abs(fu) < E && Math.round(u) > 0 && Math.round(u) < 12;
  const nearV = Math.abs(fv) < E && Math.round(v) > 0 && Math.round(v) < 3;
  const bottom = v > 3 - E;
  if(bottom){
    if(nearU){ const c = Math.round(u) - 1; return { type:'six line', nums:range(c*3 + 1, c*3 + 6) }; }
    return { type:'street', nums:[col*3 + 1, col*3 + 2, col*3 + 3] };
  }
  if(nearU && nearV){ const c = Math.round(u) - 1, r = Math.round(v) - 1; return { type:'corner', nums:[num(c, r), num(c + 1, r), num(c, r + 1), num(c + 1, r + 1)].sort((a,b)=>a-b) }; }
  if(nearU){ const c = Math.round(u) - 1; return { type:'split', nums:[num(c, row), num(c + 1, row)].sort((a,b)=>a-b) }; }
  if(nearV){ const r = Math.round(v) - 1; return { type:'split', nums:[num(col, r), num(col, r + 1)].sort((a,b)=>a-b) }; }
  return { type:'straight', nums:[num(col, row)] };
}

/* ---------- textures ---------- */
function wheelTexture(order){
  const S = 1024, c = canvas(S, S), g = c.getContext('2d'), cx = S/2, n = order.length;
  g.fillStyle = '#3a2412'; g.fillRect(0, 0, S, S);
  for(let i=0;i<n;i++){
    const a0 = i/n*Math.PI*2 - Math.PI/2 - Math.PI/n, a1 = a0 + Math.PI*2/n, v = order[i];
    g.fillStyle = colorOf(v) === 'red' ? '#b3122a' : colorOf(v) === 'black' ? '#121214' : '#127a3a';
    g.beginPath(); g.moveTo(cx, cx); g.arc(cx, cx, S*0.49, a0, a1); g.closePath(); g.fill();
    g.strokeStyle = '#d8b25a'; g.lineWidth = 3; g.beginPath(); g.moveTo(cx + Math.cos(a0)*S*0.3, cx + Math.sin(a0)*S*0.3); g.lineTo(cx + Math.cos(a0)*S*0.49, cx + Math.sin(a0)*S*0.49); g.stroke();
    g.save(); g.translate(cx, cx); g.rotate((a0 + a1)/2 + Math.PI/2); g.fillStyle = '#fff'; g.font = 'bold 34px Georgia, serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(String(v), 0, -S*0.43); g.restore();
  }
  g.fillStyle = '#5a3a1a'; g.beginPath(); g.arc(cx, cx, S*0.3, 0, 7); g.fill();
  const gr = g.createRadialGradient(cx, cx, 10, cx, cx, S*0.3); gr.addColorStop(0, '#e8c46a'); gr.addColorStop(1, '#8a5a12'); g.fillStyle = gr; g.beginPath(); g.arc(cx, cx, S*0.22, 0, 7); g.fill();
  g.strokeStyle = '#d8b25a'; g.lineWidth = 6; g.beginPath(); g.arc(cx, cx, S*0.3, 0, 7); g.stroke(); g.beginPath(); g.arc(cx, cx, S*0.37, 0, 7); g.lineWidth = 2; g.stroke();
  return tex(c);
}
/* the felt: wheel well on the left, the board on the right */
const BOARD = { x0:-0.42, x1:1.18, z0:-0.36, z1:0.12, zeroW:0.12 };
function feltTexture(us, name){
  const W = 2048, H = 1024, c = canvas(W, H), g = c.getContext('2d');
  g.fillStyle = us ? '#5a0d1a' : '#0f5a32'; g.fillRect(0, 0, W, H);
  const id = g.getImageData(0, 0, W, H), d = id.data; for(let i=0;i<d.length;i+=4){ const n = (Math.random() - 0.5)*10; d[i] += n; d[i+1] += n; d[i+2] += n; } g.putImageData(id, 0, 0);
  /* table is 2.6 x 1.3 local: x -1.3..1.3, z -0.65..0.65 */
  const X = x=>(x + 1.3)/2.6*W, Z = z=>(z + 0.65)/1.3*H;
  const bx0 = X(BOARD.x0), bx1 = X(BOARD.x1), bz0 = Z(BOARD.z0), bz1 = Z(BOARD.z1), cw = (bx1 - bx0)/12, rh = (bz1 - bz0)/3;
  g.lineWidth = 4; g.strokeStyle = '#f2e8c8'; g.font = 'bold 44px Georgia, serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
  for(let ccol=0; ccol<12; ccol++) for(let r=0; r<3; r++){
    const n = ccol*3 + (3 - r), x = bx0 + ccol*cw, y = bz0 + r*rh;
    g.strokeRect(x, y, cw, rh);
    g.fillStyle = colorOf(n) === 'red' ? '#d0203a' : '#111';
    g.beginPath(); g.ellipse(x + cw/2, y + rh/2, cw*0.32, rh*0.36, 0, 0, 7); g.fill();
    g.fillStyle = '#fff'; g.fillText(String(n), x + cw/2, y + rh/2 + 2);
  }
  /* zero(s) */
  const zx = bx0 - X(BOARD.x0 + BOARD.zeroW) + X(BOARD.x0);
  if(us){ g.strokeRect(zx, bz0, bx0 - zx, rh*1.5); g.strokeRect(zx, bz0 + rh*1.5, bx0 - zx, rh*1.5); g.fillStyle = '#127a3a'; g.fillText('0', (zx + bx0)/2, bz0 + rh*0.75); g.fillText('00', (zx + bx0)/2, bz0 + rh*2.25); }
  else { g.strokeRect(zx, bz0, bx0 - zx, rh*3); g.fillStyle = '#127a3a'; g.fillText('0', (zx + bx0)/2, bz0 + rh*1.5); }
  /* columns */
  for(let r=0;r<3;r++){ g.strokeRect(bx1, bz0 + r*rh, cw, rh); g.fillStyle = '#f2e8c8'; g.font = 'bold 30px Georgia, serif'; g.fillText('2 TO 1', bx1 + cw/2, bz0 + r*rh + rh/2); }
  /* dozens + outside */
  g.font = 'bold 34px Georgia, serif';
  ['1st 12', '2nd 12', '3rd 12'].forEach((t, i)=>{ g.strokeRect(bx0 + i*cw*4, bz1, cw*4, rh*0.8); g.fillStyle = '#f2e8c8'; g.fillText(t, bx0 + i*cw*4 + cw*2, bz1 + rh*0.4); });
  ['1-18', 'EVEN', 'RED', 'BLACK', 'ODD', '19-36'].forEach((t, i)=>{ const x = bx0 + i*cw*2, y = bz1 + rh*0.8; g.strokeRect(x, y, cw*2, rh*0.8); if(t === 'RED' || t === 'BLACK'){ g.fillStyle = t === 'RED' ? '#d0203a' : '#111'; g.beginPath(); g.moveTo(x + cw, y + 10); g.lineTo(x + cw*1.7, y + rh*0.4); g.lineTo(x + cw, y + rh*0.8 - 10); g.lineTo(x + cw*0.3, y + rh*0.4); g.closePath(); g.fill(); } else { g.fillStyle = '#f2e8c8'; g.fillText(t, x + cw, y + rh*0.4); } });
  g.fillStyle = 'rgba(242,210,122,0.8)'; g.font = 'bold 40px Georgia, serif'; g.fillText('FRIDGE PALACE · ' + name, X(0.38), Z(0.5));
  g.strokeStyle = '#d8b25a'; g.lineWidth = 8; g.beginPath(); g.arc(X(-0.92), Z(0), H*0.3, 0, 7); g.stroke();
  return tex(c);
}

export function init(C){
  const { scene, M } = C, B = C.world.batch;
  const list = C.world.anchors.roulette.map(a=>Object.assign({ us:false, min:5, max:2000, name:'SINGLE ZERO' }, a));
  if(C.world.anchors.vipRoulette) list.push(Object.assign({ us:true, min:50, max:20000, name:'DOUBLE ZERO · CLUB', vip:true }, C.world.anchors.vipRoulette));
  const tables = list.map((a, i)=>build(a, i));
  let cur = null;

  function build(a, idx){
    const grp = new THREE.Group(); grp.position.set(a.x, 0, a.z); grp.rotation.y = a.ry || 0; scene.add(grp);
    const topY = 0.84;
    const felt = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 1.3), new THREE.MeshStandardMaterial({ map:feltTexture(a.us, a.name), roughness:0.95 }));
    felt.rotation.x = -Math.PI/2; felt.position.y = topY; grp.add(felt);
    const railM = M.leatherBlack;
    [[0, 0.7, 2.8, 0.14], [0, -0.7, 2.8, 0.14]].forEach(([x, z, w, d])=>{ const r = new THREE.Mesh(G.rbox(w, 0.12, d, 0.05), railM); r.position.set(x, topY + 0.03, z); grp.add(r); });
    [[1.37, 0], [-1.37, 0]].forEach(([x, z])=>{ const r = new THREE.Mesh(G.rbox(0.14, 0.12, 1.54, 0.05), railM); r.position.set(x, topY + 0.03, z); grp.add(r); });
    const body = new THREE.Mesh(G.rbox(2.7, 0.8, 1.4, 0.06), M.woodDark); body.position.y = topY - 0.42; grp.add(body);
    /* the wheel */
    const wx = -0.92, wz = 0;
    const bowl = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.38, 0.12, 48), M.wood); bowl.position.set(wx, topY + 0.04, wz); grp.add(bowl);
    const track = new THREE.Mesh(new THREE.TorusGeometry(0.38, 0.025, 8, 64), M.woodDark); track.rotation.x = Math.PI/2; track.position.set(wx, topY + 0.1, wz); grp.add(track);
    const rotor = new THREE.Group(); rotor.position.set(wx, topY + 0.08, wz); grp.add(rotor);
    const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.33, 0.33, 0.02, 64), [new THREE.MeshStandardMaterial({ color:0x3a2412 }), new THREE.MeshStandardMaterial({ map:wheelTexture(a.us ? US : EU), roughness:0.35, metalness:0.1 }), M.wood]);
    rotor.add(disc);
    const order = a.us ? US : EU;
    { const gs = []; for(let i=0;i<order.length;i++){ const al = i/order.length*Math.PI*2 + Math.PI/order.length; const g = new THREE.BoxGeometry(0.004, 0.012, 0.035).toNonIndexed(); g.rotateY(Math.PI/2 - al); g.translate(Math.cos(al)*0.29, 0.016, Math.sin(al)*0.29); gs.push(g); } rotor.add(new THREE.Mesh(mergeGeometries(gs, false), M.gold)); }
    const cone = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.08, 24), M.gold); cone.position.y = 0.05; rotor.add(cone);
    const turret = new THREE.Group(); turret.position.y = 0.1; rotor.add(turret);
    [0, Math.PI/2].forEach(r=>{ const bar = new THREE.Mesh(G.cyl8, M.gold); bar.scale.set(0.008, 0.18, 0.008); bar.rotation.z = Math.PI/2; bar.rotation.y = r; turret.add(bar); });
    [[0.09,0],[-0.09,0],[0,0.09],[0,-0.09]].forEach(([x,z])=>{ const k = new THREE.Mesh(G.sph, M.gold); k.scale.setScalar(0.014); k.position.set(x, 0, z); turret.add(k); });
    const ball = new THREE.Mesh(new THREE.SphereGeometry(0.011, 16, 12), new THREE.MeshStandardMaterial({ color:0xffffff, roughness:0.2 })); ball.position.set(wx + 0.37, topY + 0.11, wz); grp.add(ball);
    /* croupier at the wheel end */
    const cr = makeFridge({ face:true, arms:true, color:a.vip ? '#2a0a12' : '#f2efe8', acc:['bowtie', 'vest'], vest:a.vip ? '#d9a441' : '#0f5a32', eye:'#ffd56a', style:'std' });
    cr.group.position.set(-0.1, 0, -1.12); grp.add(cr.group); cr.seed = idx; cr.name = 'CROUPIER'; C.staff.push(cr);
    /* stools on the player side */
    grp.updateMatrixWorld(true);
    [-0.4, 0.3, 1.0].forEach(x=>{ const w = new THREE.Vector3(x, 0, 1.15).applyMatrix4(grp.matrixWorld); stool(B, M, w.x, w.z, 0.8); });
    C.collide.boxC(a.x, a.z, 2.9, 1.6, a.ry || 0, 'table');
    C.collide.boxC(...(()=>{ const w = new THREE.Vector3(-0.1, 0, -1.12).applyMatrix4(grp.matrixWorld); return [w.x, w.z, 0.9, 0.8, 0, 'croupier']; })());
    const dolly = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.022, 0.07, 16), new THREE.MeshStandardMaterial({ color:0xf2efe8, metalness:0.3, roughness:0.2 })); dolly.visible = false; grp.add(dolly);
    /* spectators */
    const T = { a, grp, topY, rotor, ball, order, wx, wz, dolly, cr, chips:[], hist:[], rotA:0, rotV:0.6, ballA:0, spinning:false };
    const ipos = new THREE.Vector3(0.3, 1.1, 0.9).applyMatrix4(grp.matrixWorld);
    C.world.interact.push({ pos:ipos, r:2.6, text:()=>`play roulette · ${a.name} · ${a.min}–${a.max}`, use:()=>sit(T), enabled:()=>!a.vip || C.save.d.member });
    return T;
  }
  /* board (u,v) to table local xz */
  function boardPos(T, bet){
    const cw = (BOARD.x1 - BOARD.x0)/12, rh = (BOARD.z1 - BOARD.z0)/3;
    const nums = bet.nums.filter(n=>n !== 0 && n !== '00');
    if(bet.key && OUTSIDE[bet.key]){
      const k = bet.key; const outY = BOARD.z1 + rh*0.4, out2 = BOARD.z1 + rh*1.2;
      if(k[0] === 'c'){ const r = { c3:0, c2:1, c1:2 }[k]; return new THREE.Vector3(BOARD.x1 + cw/2, 0, BOARD.z0 + r*rh + rh/2); }
      if(k[0] === 'd'){ const i = +k[1] - 1; return new THREE.Vector3(BOARD.x0 + i*cw*4 + cw*2, 0, outY); }
      const i = ['low', 'even', 'red', 'black', 'odd', 'high'].indexOf(k); return new THREE.Vector3(BOARD.x0 + i*cw*2 + cw, 0, out2);
    }
    if(!nums.length) return new THREE.Vector3(BOARD.x0 - BOARD.zeroW/2, 0, BOARD.z0 + rh*(bet.nums[0] === '00' ? 2.25 : (T.a.us ? 0.75 : 1.5)));
    let u = 0, v = 0;
    nums.forEach(n=>{ const c = Math.floor((n - 1)/3), r = 2 - ((n - 1) % 3); u += c + 0.5; v += r + 0.5; });
    u /= nums.length; v /= nums.length;
    if(bet.type === 'street' || bet.type === 'six line') v = 3;
    return new THREE.Vector3(BOARD.x0 + u*cw, 0, BOARD.z0 + v*rh);
  }
  function sit(T){
    const camPos = new THREE.Vector3(0.35, 1.75, 1.15).applyMatrix4(T.grp.matrixWorld);
    const look = new THREE.Vector3(0.2, T.topY, -0.15).applyMatrix4(T.grp.matrixWorld);
    const stoolW = new THREE.Vector3(0.3, 0, 1.15).applyMatrix4(T.grp.matrixWorld); C.player.pos.set(stoolW.x, 0, stoolW.z);
    C.player.yaw = T.grp.rotation.y;
    cur = { T, bets:[], chip:Math.max(T.a.min, 5), last:null, busy:false };
    C.sit(camPos, look, exit);
    T.cr.face.say(1); C.hud.say('CROUPIER', pick(['place your bets.', 'bonsoir. faites vos jeux.', 'the wheel is hot tonight. it\'s always hot. it\'s friction.']));
    ui();
  }
  function exit(){ if(!cur || cur.busy) return; const T = cur.T; cur.bets.forEach(b=>C.save.refund(b.amt)); clear3D(T); cur = null; C.standUp(); }
  function clear3D(T){ T.chips.forEach(o=>T.grp.remove(o)); T.chips = []; }
  function draw3D(){
    const T = cur.T; clear3D(T);
    const merged = {};
    cur.bets.forEach(b=>{ const k = b.type + ':' + b.nums.join(','); merged[k] = merged[k] || { b, amt:0 }; merged[k].amt += b.amt; });
    Object.values(merged).forEach(({ b, amt })=>{ const st = chipStack(amt, { per:16 }); st.scale.setScalar(1.25); st.position.copy(boardPos(T, b)).setY(T.topY + 0.002); T.grp.add(st); T.chips.push(st); });
  }
  function addBet(spec){
    if(!cur || cur.busy) return;
    const T = cur.T, tot = cur.bets.reduce((s, b)=>s + b.amt, 0);
    const amt = Math.min(cur.chip, T.a.max - tot);
    if(amt <= 0){ msg('table max ' + C.fmt(T.a.max)); return; }
    if(!C.save.bet(amt, 'roulette')){ msg('not enough chips'); C.audio.error(); return; }
    cur.bets.push(Object.assign({ amt }, spec));
    C.audio.chip(null, 1); draw3D(); ui();
  }
  async function spin(){
    if(!cur || cur.busy) return;
    const T = cur.T;
    const tot = cur.bets.reduce((s, b)=>s + b.amt, 0);
    if(tot < T.a.min){ msg('minimum ' + T.a.min); C.audio.error(); return; }
    cur.busy = true; cur.last = cur.bets.map(b=>Object.assign({}, b)); C.save.d.stats.rouletteSpins++;
    ui();
    T.cr.face.say(1.2); C.hud.say('CROUPIER', 'no more bets.');
    /* watch the wheel */
    const wheelW = new THREE.Vector3(T.wx, T.topY, T.wz).applyMatrix4(T.grp.matrixWorld);
    const camW = new THREE.Vector3(T.wx + 0.55, T.topY + 0.75, T.wz + 0.6).applyMatrix4(T.grp.matrixWorld);
    C.player.moveCam(camW, wheelW, 1.0);
    const idx = fair(T.order.length), result = T.order[idx];
    const dur = 7 + Math.random()*2;
    C.audio.ballSpin(wheelW, dur*0.7);
    const n = T.order.length, pocketA = i=>i/n*Math.PI*2;
    const rot0 = T.rotA; const rotV = 1.6 + Math.random()*0.6; T.spinning = true;
    let ballA0 = Math.random()*Math.PI*2, ballV = -(11 + Math.random()*3);
    const tDrop = dur*0.62;
    await C.tweens.add({ dur, ease:ease.linear, update:k=>{
      const t = k*dur;
      T.rotA = rot0 + rotV*t - 0.08*t*t;
      T.rotor.rotation.y = -T.rotA;
      let a, r, y;
      if(t < tDrop){ /* the ball rides the outer track, slowing down */
        a = ballA0 + ballV*t + 0.75*t*t; r = 0.37; y = T.topY + 0.11;
      } else {
        /* it drops, rattles, and settles in its pocket (which moves with the rotor) */
        const u = Math.min(1, (t - tDrop)/(dur - tDrop));
        const free = ballA0 + ballV*tDrop + 0.75*tDrop*tDrop + (ballV + 1.5*tDrop)*(t - tDrop)*Math.max(0, 1 - u*1.5);
        const lock = T.rotA + pocketA(idx) + Math.PI/2;
        const kk = ease.out(Math.min(1, u*1.6));
        const fa = free + Math.round((lock - free)/(Math.PI*2))*Math.PI*2*0;
        let dA = lock - fa; dA = Math.atan2(Math.sin(dA), Math.cos(dA));
        a = fa + dA*kk;
        r = 0.37 - (0.37 - 0.29)*Math.min(1, u*2.2) + (u < 0.5 ? Math.abs(Math.sin(u*28))*0.02*(1 - u*2) : 0);
        y = T.topY + 0.11 - 0.03*Math.min(1, u*2.2) + (u < 0.5 ? Math.abs(Math.sin(u*28))*0.015*(1 - u*2) : 0);
      }
      T.ball.position.set(T.wx + Math.sin(a)*r, y, T.wz - Math.cos(a)*r);
    } });
    C.audio.ballBounce(wheelW, 5);
    T.spinning = false;
    T.ballIdx = idx;
    /* the result */
    const col = colorOf(result);
    T.hist.unshift(result); if(T.hist.length > 14) T.hist.pop();
    C.hud.big(String(result) + ' ' + col.toUpperCase(), col === 'red' ? '#ff4a5a' : col === 'green' ? '#59e08c' : '#e8e8e8');
    T.cr.face.say(1); C.hud.say('CROUPIER', result + ', ' + col + (result !== 0 && result !== '00' ? (result % 2 ? ', odd' : ', even') : '') + '.');
    const dp = boardPos(T, { nums:[result], type:'straight' }); T.dolly.position.copy(dp).setY(T.topY + 0.035 + 0.06); T.dolly.visible = true;
    let paid = 0, won = 0;
    cur.bets.forEach(b=>{ if(wins(b, result)){ const p = b.amt*(payOf(b) + 1); paid += p; won += b.amt*payOf(b); } });
    await C.tweens.sleep(1.2);
    C.player.moveCam(new THREE.Vector3(0.35, 1.75, 1.15).applyMatrix4(T.grp.matrixWorld), new THREE.Vector3(0.2, T.topY, -0.15).applyMatrix4(T.grp.matrixWorld), 0.8);
    if(paid > 0){ C.save.pay(paid, 'roulette'); C.audio.chipStack(null); C.hud.toast('you win ' + C.fmt(won) + ' (+' + C.fmt(paid) + ' back)', 'win'); T.cr.face.set('sad', 1); if(won >= T.a.min*30){ C.bus.emit('cheer', { pos:T.grp.position.clone(), big:won >= T.a.min*100 }); C.fx.confetti(new THREE.Vector3().copy(T.grp.position).setY(2), 60); } }
    else { C.hud.toast('the house takes ' + C.fmt(cur.bets.reduce((s, b)=>s + b.amt, 0)), 'lose'); T.cr.face.set('happy', 1); }
    await C.tweens.sleep(1.4);
    cur.bets = []; draw3D(); T.dolly.visible = false;
    cur.busy = false; msg(paid ? 'won ' + C.fmt(won) + ' on ' + result : 'last: ' + result + ' ' + col); ui();
  }
  function msg(t){ const m = C.hud.$('#rl-msg'); if(m) m.textContent = t; }
  function ui(){
    if(!cur) return;
    const T = cur.T, a = T.a;
    const tot = cur.bets.reduce((s, b)=>s + b.amt, 0);
    const chips = DENOMS.filter(d=>d.v >= a.min/5 && d.v <= a.max).reverse().slice(0, 6);
    const amtOn = (pred)=>cur.bets.filter(pred).reduce((s, b)=>s + b.amt, 0);
    const cell = n=>{ const v = amtOn(b=>b.type === 'straight' && String(b.nums[0]) === String(n)); return v ? `<i>${v >= 1000 ? (v/1000).toFixed(v >= 10000 ? 0 : 1) + 'K' : v}</i>` : ''; };
    let grid = '';
    for(let r=0; r<3; r++) for(let c=0; c<12; c++){ const n = c*3 + (3 - r); grid += `<div class="rl-n ${colorOf(n)}" style="grid-column:${c + 1};grid-row:${r + 1}">${n}${cell(n)}</div>`; }
    const lineBets = cur.bets.filter(b=>['split', 'street', 'corner', 'six line'].includes(b.type));
    const marks = lineBets.map(b=>{ const p = boardPos(T, b); const u = (p.x - BOARD.x0)/((BOARD.x1 - BOARD.x0)/12), v = (p.z - BOARD.z0)/((BOARD.z1 - BOARD.z0)/3); return `<b class="rl-mark" style="left:${u/12*100}%;top:${v/3*100}%">${b.amt}</b>`; }).join('');
    const out = k=>{ const v = amtOn(b=>b.key === k); return v ? `<i>${v}</i>` : ''; };
    const zeros = a.us ? `<div class="rl-z" data-z="0">0${cell(0)}</div><div class="rl-z" data-z="00">00${cell('00')}</div>` : `<div class="rl-z one" data-z="0">0${cell(0)}</div>`;
    const html = `<div class="fp-ptitle">ROULETTE · ${a.name}<span class="sp"></span><small>${a.min}–${C.fmt(a.max)} · bet ${C.fmt(tot)}</small><button data-a="rules">BETS</button><button data-a="exit" ${cur.busy ? 'disabled' : ''}>STAND UP</button></div>
      <div class="rl-hist">${T.hist.map(h=>`<span class="${colorOf(h)}">${h}</span>`).join('') || '<span class="fp-dim">no spins yet</span>'}</div>
      <div class="rl-wrap"><div class="rl-zeros">${zeros}</div>
        <div class="rl-board" id="rl-board">${grid}${marks}</div>
        <div class="rl-cols"><div data-o="c3">2:1${out('c3')}</div><div data-o="c2">2:1${out('c2')}</div><div data-o="c1">2:1${out('c1')}</div></div></div>
      <div class="rl-out"><div data-o="d1">1st 12${out('d1')}</div><div data-o="d2">2nd 12${out('d2')}</div><div data-o="d3">3rd 12${out('d3')}</div></div>
      <div class="rl-out six"><div data-o="low">1-18${out('low')}</div><div data-o="even">EVEN${out('even')}</div><div data-o="red" class="red">RED${out('red')}</div><div data-o="black" class="black">BLACK${out('black')}</div><div data-o="odd">ODD${out('odd')}</div><div data-o="high">19-36${out('high')}</div></div>
      <div class="fp-row">${chips.map(d=>`<button class="fp-chip ${cur.chip === d.v ? 'sel' : ''}" data-chip="${d.v}" style="background:${d.c};color:${d.s}">${d.v >= 1000 ? d.v/1000 + 'K' : d.v}</button>`).join('')}
        <button data-a="undo" ${cur.bets.length && !cur.busy ? '' : 'disabled'}>UNDO</button><button data-a="clear" ${cur.bets.length && !cur.busy ? '' : 'disabled'}>CLEAR</button><button data-a="rebet" ${cur.last && !cur.bets.length && !cur.busy ? '' : 'disabled'}>REBET</button><button data-a="spin" class="fp-gold" ${cur.busy ? 'disabled' : ''}>SPIN</button></div>
      <div class="fp-row fp-dim" id="rl-msg">tap a number for a straight bet. tap a line between numbers for a split, a corner for four, the bottom edge for a street.</div>`;
    const p = C.hud.panel(html, 'fp-rlpanel');
    const board = p.querySelector('#rl-board');
    board.onclick = e=>{ if(cur.busy) return; const r = board.getBoundingClientRect(); const u = (e.clientX - r.left)/r.width*12, v = (e.clientY - r.top)/r.height*3; addBet(hitTest(u, Math.min(2.999, v))); };
    board.addEventListener('pointerdown', e=>{ const r = board.getBoundingClientRect(); if((e.clientY - r.top)/r.height > 0.93){ e.preventDefault(); const u = (e.clientX - r.left)/r.width*12; addBet(hitTest(u, 2.99)); e.stopPropagation(); board._skip = true; } });
    board.addEventListener('click', e=>{ if(board._skip){ board._skip = false; e.stopImmediatePropagation(); } }, true);
    p.querySelectorAll('[data-z]').forEach(z=>z.onclick = ()=>addBet({ type:'straight', nums:[z.dataset.z === '00' ? '00' : 0] }));
    p.querySelectorAll('[data-o]').forEach(o=>o.onclick = ()=>{ const k = o.dataset.o; addBet({ type:OUTSIDE[k].label, key:k, nums:OUTSIDE[k].nums, pay:OUTSIDE[k].pay }); });
    p.querySelectorAll('[data-chip]').forEach(b=>b.onclick = ()=>{ cur.chip = +b.dataset.chip; C.audio.click(); ui(); });
    const on = (k, f)=>{ const b = p.querySelector(`[data-a="${k}"]`); if(b) b.onclick = f; };
    on('exit', exit); on('spin', spin);
    on('undo', ()=>{ const b = cur.bets.pop(); if(b) C.save.refund(b.amt); draw3D(); ui(); });
    on('clear', ()=>{ cur.bets.forEach(b=>C.save.refund(b.amt)); cur.bets = []; draw3D(); ui(); });
    on('rebet', ()=>{ const need = cur.last.reduce((s, b)=>s + b.amt, 0); if(!C.save.bet(need, 'roulette')){ msg('not enough chips for the same bets'); return; } cur.bets = cur.last.map(b=>Object.assign({}, b)); draw3D(); ui(); });
    on('rules', ()=>C.hud.modal({ title:'ROULETTE BETS', html:'<table class="fp-pay"><tr><td>straight (1 number)</td><td>35 to 1</td></tr><tr><td>split (2)</td><td>17 to 1</td></tr><tr><td>street (3)</td><td>11 to 1</td></tr><tr><td>corner (4)</td><td>8 to 1</td></tr><tr><td>six line (6)</td><td>5 to 1</td></tr><tr><td>column / dozen (12)</td><td>2 to 1</td></tr><tr><td>red/black · odd/even · 1-18/19-36</td><td>1 to 1</td></tr></table><p>house edge: 2.70% on single zero, 5.26% on double zero. the club table is double zero because the club is a scam with couches.</p>' }));
  }
  C.bus.on('key', e=>{ if(cur && !cur.busy && (e.code === 'Space' || e.code === 'Enter')) spin(); });
  return { name:'roulette', tables, update(dt, t){
    for(const T of tables){
      if(!T.spinning){ T.rotA += dt*0.35; T.rotor.rotation.y = -T.rotA; if(T.ballIdx !== undefined){ const a = T.rotA + T.ballIdx/T.order.length*Math.PI*2 + Math.PI/2; T.ball.position.set(T.wx + Math.sin(a)*0.29, T.topY + 0.08, T.wz - Math.cos(a)*0.29); } }
    }
  } };
}
