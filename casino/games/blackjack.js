/* ============================================================
   FRIDGE PALACE: blackjack
   six decks, cut card at 75%, dealer stands on all 17s, blackjack
   pays 3:2, double on any two, double after split, split to four
   hands, split aces get one card, late surrender, insurance 2:1,
   perfect pairs side bet. the regulars at the table play basic
   strategy (mostly). the pit boss watches the count.
============================================================ */
import * as THREE from '../lib/three.module.min.js';
import { mergeGeometries } from '../lib/addons/utils/BufferGeometryUtils.js';
import { G, stool } from '../world/props.js';
import { makeCard, setCardFace, chipStack, DENOMS, RANKS, SUITS } from '../world/cards.js';
import { makeFridge, animateFridge, bakePainted } from '../world/fridge.js';
import { canvas, tex } from '../world/textures.js';
import { fair, pick, rand, ease } from '../core/util.js';

/* ---------- rules ---------- */
export const rankOf = id=>RANKS[id % 13];
export const suitOf = id=>SUITS[Math.floor(id/13)];
export function cardVal(id){ const r = rankOf(id); return r === 'A' ? 11 : (r === 'K' || r === 'Q' || r === 'J' || r === '10') ? 10 : +r; }
export function handValue(cards){ let t = 0, a = 0; for(const c of cards){ const v = cardVal(c); t += v; if(v === 11) a++; } while(t > 21 && a > 0){ t -= 10; a--; } return { total:t, soft:a > 0 }; }
export const isBJ = cards=>cards.length === 2 && handValue(cards).total === 21;
export function basic(cards, up, canDouble, canSplit, canSurr){
  const v = handValue(cards), d = cardVal(up);
  if(canSplit && cards.length === 2 && cardVal(cards[0]) === cardVal(cards[1])){
    const p = cardVal(cards[0]);
    if(p === 11 || p === 8) return 'split';
    if(p === 9 && [2,3,4,5,6,8,9].includes(d)) return 'split';
    if((p === 7 || p === 2 || p === 3) && d <= 7) return 'split';
    if(p === 6 && d <= 6) return 'split';
    if(p === 4 && (d === 5 || d === 6)) return 'split';
  }
  if(canSurr && cards.length === 2 && !v.soft){ if(v.total === 16 && d >= 9) return 'surrender'; if(v.total === 15 && d === 10) return 'surrender'; }
  if(v.soft && cards.length >= 2){
    const t = v.total;
    if(t >= 19) return (t === 19 && d === 6 && canDouble) ? 'double' : 'stand';
    if(t === 18){ if(d >= 3 && d <= 6 && canDouble) return 'double'; if(d <= 8) return 'stand'; return 'hit'; }
    if(t === 17) return d >= 3 && d <= 6 && canDouble ? 'double' : 'hit';
    if(t === 15 || t === 16) return d >= 4 && d <= 6 && canDouble ? 'double' : 'hit';
    if(t === 13 || t === 14) return d >= 5 && d <= 6 && canDouble ? 'double' : 'hit';
    return 'hit';
  }
  const t = v.total;
  if(t >= 17) return 'stand';
  if(t >= 13) return d <= 6 ? 'stand' : 'hit';
  if(t === 12) return d >= 4 && d <= 6 ? 'stand' : 'hit';
  if(t === 11) return canDouble && d <= 10 ? 'double' : 'hit';
  if(t === 10) return canDouble && d <= 9 ? 'double' : 'hit';
  if(t === 9) return canDouble && d >= 3 && d <= 6 ? 'double' : 'hit';
  return 'hit';
}
export function perfectPairs(a, b){
  if(rankOf(a) !== rankOf(b)) return 0;
  if(suitOf(a) === suitOf(b)) return 25;
  const red = s=>s === 'h' || s === 'd';
  return red(suitOf(a)) === red(suitOf(b)) ? 12 : 6;
}
class Shoe {
  constructor(decks){ this.decks = decks; this.fill(); }
  fill(){ this.cards = []; for(let d=0; d<this.decks; d++) for(let i=0;i<52;i++) this.cards.push(i); for(let i=this.cards.length - 1; i>0; i--){ const j = fair(i + 1); [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]]; } this.cut = Math.floor(this.cards.length*(0.72 + Math.random()*0.06)); this.dealt = 0; this.rc = 0; }
  draw(){ const c = this.cards[this.dealt++]; const v = cardVal(c); this.rc += v <= 6 ? 1 : (v >= 10 ? -1 : 0); return c; }
  needShuffle(){ return this.dealt >= this.cut; }
  tc(){ const left = Math.max(0.5, (this.cards.length - this.dealt)/52); return this.rc/left; }
}

/* ---------- the felt ---------- */
function feltTexture(name, min, max){
  const W = 2048, H = 1300, c = canvas(W, H), g = c.getContext('2d');
  const gr = g.createRadialGradient(W/2, H*0.3, 50, W/2, H*0.4, W*0.7); gr.addColorStop(0, '#1b7a45'); gr.addColorStop(1, '#0b3d22'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
  /* fine noise */
  const id = g.getImageData(0, 0, W, H), d = id.data; for(let i=0;i<d.length;i+=4){ const n = (Math.random() - 0.5)*10; d[i] += n; d[i+1] += n; d[i+2] += n; } g.putImageData(id, 0, 0);
  const cx = W/2, cy = 0, rx = W*0.47, ry = H*0.96;
  const arcText = (text, r, size, col)=>{ g.save(); g.font = `bold ${size}px Georgia, serif`; g.fillStyle = col; g.textAlign = 'center'; g.textBaseline = 'middle'; const chars = text.split(''); const tot = g.measureText(text).width; let a = Math.PI/2 + tot/(2*r); chars.forEach(ch=>{ const w = g.measureText(ch).width; a -= w/(2*r); g.save(); g.translate(cx + Math.cos(a)*r*(rx/ry), cy + Math.sin(a)*r); g.rotate(a - Math.PI/2); g.fillText(ch, 0, 0); g.restore(); a -= w/(2*r); }); g.restore(); };
  g.strokeStyle = '#e6c46a'; g.lineWidth = 6; g.beginPath(); g.ellipse(cx, cy, rx*0.72, ry*0.72, 0, 0, Math.PI); g.stroke();
  g.lineWidth = 3; g.beginPath(); g.ellipse(cx, cy, rx*0.5, ry*0.5, 0, 0, Math.PI); g.stroke();
  arcText('BLACKJACK PAYS 3 TO 2', ry*0.62, 54, '#f2d27a');
  arcText('DEALER MUST STAND ON ALL 17s', ry*0.43, 40, '#f2e8c8');
  arcText('INSURANCE PAYS 2 TO 1', ry*0.33, 34, '#f2d27a');
  /* betting circles */
  for(let i=0;i<5;i++){
    const th = (25 + i*32.5)*Math.PI/180, r = 0.84;
    const x = cx + Math.cos(th)*rx*r, y = cy + Math.sin(th)*ry*r;
    g.strokeStyle = '#f2e8c8'; g.lineWidth = 6; g.beginPath(); g.arc(x, y, 62, 0, 7); g.stroke();
    g.lineWidth = 3; g.beginPath(); g.arc(x - Math.cos(th)*0 + 90*Math.cos(th + Math.PI/2)*0.0, y, 0, 0, 7); g.stroke();
    const px = x + Math.cos(th - Math.PI/2)*0 - Math.cos(th)*108, py = y - Math.sin(th)*108;
    g.lineWidth = 3; g.beginPath(); g.arc(px, py, 30, 0, 7); g.stroke(); g.fillStyle = '#f2e8c8'; g.font = 'bold 18px Georgia'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('PP', px, py);
  }
  g.fillStyle = 'rgba(242,210,122,0.85)'; g.font = 'bold 44px Georgia, serif'; g.textAlign = 'center'; g.fillText('FRIDGE PALACE', cx, ry*0.2);
  g.font = '30px Georgia, serif'; g.fillText(name + ' · ' + min.toLocaleString() + ' to ' + max.toLocaleString(), cx, ry*0.26);
  return tex(c);
}
const SEAT_DEG = [25, 57.5, 90, 122.5, 155];
const NPC_LOOKS = [
  { color:'#e05a5a', style:'retro', acc:['cowboy'], eye:'#ffd56a', name:'TEX' },
  { color:'#5a8ae0', style:'std', acc:['beanie'], beanie:'#2a2a2a', name:'MO' },
  { color:'#f4f1e6', style:'french', acc:['chain'], shades:true, name:'BIG FREEZE' },
  { color:'#9fe3d0', style:'mini', acc:['party'], name:'LIL CHILL' },
  { color:'#3a3a40', style:'smart', acc:['tophat'], eye:'#ff7ad0', name:'THE COUNT' },
  { color:'#d9a441', style:'std', acc:['crown'], handle:'gold', name:'GOLDIE' }
];

export function init(C){
  const { scene, M } = C, B = C.world.batch;
  const anchors = C.world.anchors.bj.slice();
  if(C.world.anchors.vipBJ) anchors.push(Object.assign({ min:100, max:10000, name:'HIGH LIMIT', vip:true }, C.world.anchors.vipBJ));
  const tables = anchors.map((a, i)=>buildTable(C, a, i));
  /* the pit boss */
  const pit = C.world.anchors.pit;
  const boss = makeFridge({ face:true, arms:true, color:'#202024', trim:'#0b0b0c', acc:['headset', 'bowtie', 'nametag'], eye:'#ff5a5a', style:'tall' });
  boss.group.position.set(pit.x, 0, pit.z); boss.watch = true; boss.name = 'PIT BOSS'; scene.add(boss.group); C.staff.push(boss);
  C.collide.circle(pit.x, pit.z, 0.5, 'boss');
  C.world.interact.push({ pos:new THREE.Vector3(pit.x, 1.5, pit.z), r:2.4, text:()=>'talk to the pit boss', use:()=>{ boss.face.say(2); C.hud.say('PIT BOSS', C.save.d.bannedBJUntil > Date.now() ? "you know what you did. the tables will be here in ten minutes. so will i." : pick(["i'm not watching you. i'm watching everybody. you're in everybody.", "counting's not illegal. it's just rude.", "the high limit table's in the club. bring a jacket. you're a fridge, you don't need a jacket. bring one anyway.", "dealers stand on all seventeens. i stand on all of them too. it's a union thing.", "if you win big, i'll come shake your hand. i don't have hands that shake. i'll come wave."])); } });
  C.bjBoss = boss;
  let cur = null;

  function buildTable(C, a, idx){
    const grp = new THREE.Group(); grp.position.set(a.x, 0, a.z); grp.rotation.y = a.ry || 0; scene.add(grp);
    const rx = 1.3, rz = 1.4, z0 = -0.45, topY = 0.82;
    const sh = new THREE.Shape(); sh.moveTo(-rx, -z0); sh.lineTo(rx, -z0);
    const N = 48; for(let i=0;i<=N;i++){ const th = i/N*Math.PI; sh.lineTo(Math.cos(th)*rx, -(z0 + Math.sin(th)*rz)); }
    const geo = new THREE.ShapeGeometry(sh, 48);
    /* map felt UV: x in [-rx, rx], z in [z0, z0 + rz] */
    const pos = geo.attributes.position, uv = geo.attributes.uv; for(let i=0;i<pos.count;i++){ const x = pos.getX(i), y = pos.getY(i), z = -y; uv.setXY(i, (x + rx)/(2*rx), 1 - (z - z0)/rz); }
    const felt = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ map:feltTexture(a.name, a.min, a.max), roughness:0.95 }));
    felt.rotation.x = -Math.PI/2; felt.position.y = topY; grp.add(felt);
    /* the padded rail along the curve */
    const pts = []; for(let i=0;i<=N;i++){ const th = i/N*Math.PI; pts.push(new THREE.Vector3(Math.cos(th)*(rx + 0.06), topY + 0.03, z0 + Math.sin(th)*(rz + 0.06))); }
    const rail = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 64, 0.075, 10, false), M.leatherBlack); grp.add(rail);
    const wood = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts.map(p=>p.clone().setY(topY - 0.04))), 64, 0.05, 8, false), M.wood); grp.add(wood);
    /* the skirt */
    const skirtG = new THREE.ExtrudeGeometry(sh, { depth:0.7, bevelEnabled:false, curveSegments:24 });
    const skirt = new THREE.Mesh(skirtG, M.woodDark); skirt.rotation.x = -Math.PI/2; skirt.position.y = topY - 0.72; skirt.scale.set(0.97, 0.97, 1); grp.add(skirt);
    const dealerEdge = new THREE.Mesh(G.box, M.woodDark); dealerEdge.scale.set(2*rx, 0.08, 0.08); dealerEdge.position.set(0, topY, z0); grp.add(dealerEdge);
    /* tray, shoe, discard */
    const tray = new THREE.Mesh(G.box, M.black); tray.scale.set(0.7, 0.03, 0.16); tray.position.set(0, topY + 0.015, z0 + 0.1); grp.add(tray);
    const dv = [1000, 500, 100, 25, 5, 1];
    /* the dealer's chip tray: twelve stacks baked into one mesh */
    { const tg = []; let tm = null; dv.forEach((v, i)=>{ for(let k=0;k<2;k++){ const st = chipStack(v*(18 + k*4), { per:30 }); st.position.set(-0.3 + i*0.11 + k*0.045, topY + 0.03, z0 + 0.1); st.rotation.z = Math.PI/2; st.rotation.y = Math.PI/2; st.updateMatrixWorld(true); st.traverse(o=>{ if(o.isMesh){ tm = o.material; tg.push(o.geometry.clone().applyMatrix4(o.matrixWorld)); o.geometry.dispose(); } }); } });
      if(tg.length){ const mg = mergeGeometries(tg, false); tg.forEach(g=>g.dispose()); grp.add(new THREE.Mesh(mg, tm)); } }
    const shoe = new THREE.Mesh(G.box, M.black); shoe.scale.set(0.16, 0.12, 0.32); shoe.position.set(0.9, topY + 0.06, z0 + 0.25); shoe.rotation.y = -0.3; grp.add(shoe);
    { const stat = new THREE.Group(); grp.add(stat); [rail, wood, skirt, dealerEdge, tray, shoe].forEach(m=>stat.attach(m)); bakePainted(stat); }
    const disc = new THREE.Mesh(G.box, new THREE.MeshStandardMaterial({ color:0x2a2a30, transparent:true, opacity:0.7, roughness:0.1 })); disc.scale.set(0.14, 0.1, 0.2); disc.position.set(-0.95, topY + 0.05, z0 + 0.22); grp.add(disc);
    const plaque = new THREE.Mesh(G.plane, new THREE.MeshBasicMaterial({ map:(()=>{ const c = canvas(256, 64), g = c.getContext('2d'); g.fillStyle = '#111'; g.fillRect(0, 0, 256, 64); g.fillStyle = '#ffd56a'; g.font = 'bold 26px Georgia'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(a.min.toLocaleString() + ' – ' + a.max.toLocaleString(), 128, 34); return tex(c); })(), toneMapped:false }));
    plaque.scale.set(0.3, 0.075, 1); plaque.position.set(-0.6, topY + 0.04, z0 + 0.02); plaque.rotation.x = -0.6; grp.add(plaque);
    /* seats */
    const seatW = SEAT_DEG.map(dg=>{ const th = dg*Math.PI/180; return { th,
      spot:new THREE.Vector3(Math.cos(th)*rx*0.8, topY + 0.002, z0 + Math.sin(th)*rz*0.8),
      bet:new THREE.Vector3(Math.cos(th)*rx*0.84, topY + 0.002, z0 + Math.sin(th)*rz*0.84),
      pp:new THREE.Vector3(Math.cos(th)*rx*0.84 - Math.cos(th)*0.11, topY + 0.002, z0 + Math.sin(th)*rz*0.84 - Math.sin(th)*0.105),
      stool:new THREE.Vector3(Math.cos(th)*(rx + 0.55), 0, z0 + Math.sin(th)*(rz + 0.55)) }; });
    grp.updateMatrixWorld(true);
    seatW.forEach(s=>{ const w = s.stool.clone().applyMatrix4(grp.matrixWorld); stool(B, M, w.x, w.z, 0.78); });
    C.collide.boxC(a.x, a.z + 0.25*Math.cos(a.ry || 0), 2.8, 1.6, a.ry || 0, 'table');
    /* dealer */
    const dealer = makeFridge({ face:true, arms:true, color:a.vip ? '#121214' : '#f2efe8', trim:'#888', acc:['bowtie', 'vest'], vest:a.vip ? '#6a2c91' : '#7a1220', eye:a.vip ? '#ffd56a' : '#7ff3ff', style:a.vip ? 'french' : 'std' });
    dealer.group.position.set(0, 0, z0 - 0.5); grp.add(dealer.group); dealer.custom = false; dealer.name = 'DEALER'; dealer.seed = idx*2; C.staff.push(dealer);
    /* regulars */
    const npcs = [];
    const nN = a.vip ? 1 : 1 + (idx % 2) + (Math.random() < 0.5 ? 1 : 0);
    const used = new Set([2]);
    for(let k=0;k<nN;k++){
      let s; do{ s = Math.floor(Math.random()*5); }while(used.has(s)); used.add(s);
      const look = NPC_LOOKS[(idx*2 + k) % NPC_LOOKS.length];
      const F = makeFridge(Object.assign({ face:true, arms:true }, look, { acc:look.acc }));
      const sp = seatW[s].stool; F.group.position.set(sp.x, 0.12, sp.z); F.group.rotation.y = Math.atan2(-sp.x, -(sp.z - z0)); F.group.scale.setScalar(0.92);
      grp.add(F.group); F.seed = Math.random()*10; C.staff.push(F);
      npcs.push({ seat:s, F, name:look.name, bank:(a.min*40)*(1 + Math.random()*3), style:pick(['basic', 'basic', 'basic', 'hunch', 'scared']) });
    }
    const T = { a, idx, grp, felt, topY, z0, seatW, dealer, npcs, shoe:new Shoe(6), objs:[], shoePos:new THREE.Vector3(0.9, topY + 0.14, z0 + 0.2), discPos:new THREE.Vector3(-0.95, topY + 0.1, z0 + 0.22), lastBet:0, strikes:0 };
    const ipos = new THREE.Vector3(0, 1.1, z0 + rz + 0.2).applyMatrix4(grp.matrixWorld);
    C.world.interact.push({ pos:ipos, r:2.8, text:()=>`play blackjack · ${a.name} · ${a.min}–${a.max}`, use:()=>sit(T), enabled:()=>!a.vip || C.save.d.member });
    return T;
  }

  /* ---------- seat + camera ---------- */
  function sit(T){
    if(C.save.d.bannedBJUntil > Date.now()){ const m = Math.ceil((C.save.d.bannedBJUntil - Date.now())/60000); C.hud.say('PIT BOSS', "not tonight. come back in " + m + " minute" + (m === 1 ? '' : 's') + ". the cards need a break from you."); return; }
    const s = T.seatW[2];
    const camPos = new THREE.Vector3(Math.cos(s.th)*1.65, 1.62, T.z0 + Math.sin(s.th)*1.75).applyMatrix4(T.grp.matrixWorld);
    const look = new THREE.Vector3(0, T.topY - 0.05, T.z0 + 0.45).applyMatrix4(T.grp.matrixWorld);
    const stoolW = s.stool.clone().applyMatrix4(T.grp.matrixWorld);
    C.player.pos.set(stoolW.x, 0, stoolW.z);
    C.player.yaw = Math.atan2(-(look.x - stoolW.x), -(look.z - stoolW.z));
    cur = { T, state:'bet', bet:0, pp:0, chip:Math.max(T.a.min, 5), hands:[], dealer:[], busy:false, msg:'place your bet' };
    C.sit(camPos, look, exit);
    T.dealer.face.set('happy', 1.5); T.dealer.face.say(1);
    C.hud.say('DEALER', pick(["welcome. minimum is " + T.a.min + ".", "good evening. cards are fresh.", "have a seat. the shoe's warm."]));
    ui();
  }
  function exit(){
    if(!cur) return;
    if(cur.state !== 'bet'){ C.hud.toast('finish the hand first'); return; }
    if(cur.bet > 0){ C.save.refund(cur.bet + cur.pp); }
    clearBetChips();
    cur = null; C.standUp();
  }
  /* ---------- 3D helpers ---------- */
  const W = (T, v)=>v.clone();
  function place(T, obj, local){ obj.position.copy(local); T.grp.add(obj); T.objs.push(obj); return obj; }
  async function dealCard(T, id, to, faceUp, angle){
    const card = makeCard(id); card.scale.setScalar(1.6);
    setCardFace(card, false);
    card.position.copy(T.shoePos); card.rotation.y = -0.3;
    T.grp.add(card); T.objs.push(card);
    C.audio.card(new THREE.Vector3().copy(to).applyMatrix4(T.grp.matrixWorld));
    T.dealer.armBusy = true; T.dealer.armR.rotation.x = -0.9;
    await C.tweens.to(card, { pos:to, dur:0.32, arc:0.08, ease:ease.out, update:k=>{ card.rotation.y = -0.3*(1 - k) + (angle || 0)*k; } });
    T.dealer.armR.rotation.x = 0; T.dealer.armBusy = false;
    if(faceUp) await flip(card, true);
    return card;
  }
  async function flip(card, up){ C.audio.flip(card.getWorldPosition(new THREE.Vector3())); const z0 = card.rotation.z, z1 = up ? 0 : Math.PI; const y0 = card.position.y; await C.tweens.add({ dur:0.22, update:k=>{ card.rotation.z = z0 + (z1 - z0)*k; card.position.y = y0 + Math.sin(k*Math.PI)*0.04; } }); }
  function betChips(T, amount, at, key){
    if(T[key]){ T.grp.remove(T[key]); T[key] = null; }
    if(amount <= 0) return null;
    const st = chipStack(amount); st.scale.setScalar(1.4); st.position.copy(at); T.grp.add(st); T[key] = st; return st;
  }
  function clearBetChips(){ if(!cur) return; const T = cur.T; ['_bet', '_pp', '_ins', '_bet1', '_bet2', '_bet3'].forEach(k=>{ if(T[k]){ T.grp.remove(T[k]); T[k] = null; } }); T.npcs.forEach(n=>{ if(n._chips){ T.grp.remove(n._chips); n._chips = null; } }); }
  async function sweep(T){
    for(const o of T.objs){ C.tweens.to(o, { pos:T.discPos, dur:0.35, arc:0.05 }); }
    await C.tweens.sleep(0.4);
    T.objs.forEach(o=>T.grp.remove(o)); T.objs = [];
  }
  function spotFor(T, seat, handIdx, nHands, cardIdx){
    const s = T.seatW[seat];
    const side = new THREE.Vector3(-Math.sin(s.th), 0, Math.cos(s.th)).multiplyScalar(-1);
    const off = nHands > 1 ? (handIdx - (nHands - 1)/2)*0.17 : 0;
    const inward = new THREE.Vector3(-Math.cos(s.th), 0, -Math.sin(s.th));
    return s.spot.clone().addScaledVector(side, off + cardIdx*0.028).addScaledVector(inward, cardIdx*0.035 + 0.04).setY(T.topY + 0.003 + cardIdx*0.0012);
  }
  /* ---------- the round ---------- */
  async function deal(){
    if(!cur || cur.state !== 'bet' || cur.busy) return;
    const T = cur.T;
    if(cur.bet < T.a.min){ msg('minimum bet is ' + T.a.min); C.audio.error(); return; }
    cur.busy = true; cur.state = 'deal';
    T.lastBet = cur.bet; T.lastPP = cur.pp;
    C.save.d.stats.hands++;
    /* the count watcher */
    const tc = T.shoe.tc();
    if(tc >= 3 && cur.bet >= T.a.min*8) T.strikes++;
    else if(tc <= 0 && cur.bet <= T.a.min*2 && T.strikes > 0) T.strikes += 0.5;
    if(T.shoe.needShuffle()){ msg('shuffling'); C.audio.shuffle(T.shoePos.clone().applyMatrix4(T.grp.matrixWorld)); T.dealer.face.set('happy'); await C.tweens.sleep(1.2); T.shoe.fill(); T.strikes = 0; }
    /* NPC bets */
    T.npcs.forEach(n=>{ n.hands = []; n.bet = Math.min(T.a.max, Math.max(T.a.min, Math.round(T.a.min*(1 + Math.floor(Math.random()*4))))); if(n.bank < n.bet){ n.bank = T.a.min*60; } n.bank -= n.bet; n._chips = chipStack(n.bet); n._chips.scale.setScalar(1.4); n._chips.position.copy(T.seatW[n.seat].bet); T.grp.add(n._chips); C.audio.chip(null, 2); });
    const seats = T.npcs.map(n=>({ seat:n.seat, npc:n })).concat([{ seat:2, you:true }]).sort((a, b)=>b.seat - a.seat);
    cur.hands = [{ cards:[], bet:cur.bet, done:false, objs:[] }]; cur.dealer = []; cur.hole = null;
    seats.forEach(s=>{ if(s.npc) s.npc.hands = [{ cards:[], bet:s.npc.bet, done:false }]; });
    /* two rounds */
    for(let rd=0; rd<2; rd++){
      for(const s of seats){
        const h = s.you ? cur.hands[0] : s.npc.hands[0];
        const id = T.shoe.draw(); h.cards.push(id);
        await dealCard(T, id, spotFor(T, s.seat, 0, 1, h.cards.length - 1), true, Math.PI/2 - T.seatW[s.seat].th);
      }
      const id = T.shoe.draw(); cur.dealer.push(id);
      const dc = await dealCard(T, id, new THREE.Vector3(-0.06 + rd*0.12, T.topY + 0.003 + rd*0.001, T.z0 + 0.32), rd === 0);
      if(rd === 1) cur.hole = dc;
    }
    ui();
    /* perfect pairs */
    if(cur.pp > 0){ const m = perfectPairs(cur.hands[0].cards[0], cur.hands[0].cards[1]); if(m){ C.save.pay(cur.pp*(m + 1), 'perfect pairs'); C.hud.toast('PERFECT PAIRS ' + m + ':1 · +' + C.fmt(cur.pp*m), 'win'); C.audio.chipStack(null); } else C.hud.toast('perfect pairs lost', 'lose'); betChips(T, 0, null, '_pp'); }
    /* insurance + peek */
    const up = cur.dealer[0], upV = cardVal(up);
    if(upV === 11){
      cur.state = 'insurance'; cur.busy = false; msg('insurance? pays 2 to 1. costs ' + Math.floor(cur.bet/2)); ui();
      T.dealer.face.say(1); C.hud.say('DEALER', 'insurance is open.');
      const take = await new Promise(r=>{ cur.insResolve = r; });
      cur.busy = true; cur.state = 'deal';
      if(take){ const ins = Math.floor(cur.bet/2); if(C.save.bet(ins, 'insurance')){ cur.ins = ins; betChips(T, ins, T.seatW[2].pp.clone().add(new THREE.Vector3(0, 0, -0.08)), '_ins'); } }
    }
    if(upV >= 10){
      await C.tweens.sleep(0.4);
      if(isBJ(cur.dealer)){
        await flip(cur.hole, true);
        T.dealer.face.set('happy', 2); C.hud.say('DEALER', 'dealer has blackjack.');
        if(cur.ins){ C.save.pay(cur.ins*3, 'insurance'); C.hud.toast('insurance pays +' + C.fmt(cur.ins*2), 'win'); }
        await settle(true); return;
      } else if(cur.ins){ C.hud.toast('no blackjack. insurance lost.', 'lose'); betChips(T, 0, null, '_ins'); cur.ins = 0; }
    }
    /* players act, right to left from the dealer's view */
    for(const s of seats){
      if(s.you){ await yourTurn(); if(!cur) return; }
      else await npcTurn(T, s.npc);
    }
    await dealerTurn();
    await settle(false);
  }
  function yourTurn(){
    return new Promise(async resolve=>{
      cur.turnResolve = resolve; cur.hi = 0;
      const h0 = cur.hands[0];
      if(isBJ(h0.cards)){ h0.done = true; h0.bj = true; C.hud.big('BLACKJACK', '#ffd56a'); C.save.d.stats.bjs++; resolve(); return; }
      cur.state = 'play'; cur.busy = false; ui();
    });
  }
  async function act(a){
    if(!cur || cur.state !== 'play' || cur.busy) return;
    const T = cur.T, h = cur.hands[cur.hi];
    const two = h.cards.length === 2;
    cur.busy = true;
    if(a === 'hit'){
      const id = T.shoe.draw(); h.cards.push(id);
      await dealCard(T, id, spotFor(T, 2, cur.hi, cur.hands.length, h.cards.length - 1), true, 0);
      const v = handValue(h.cards).total;
      if(v > 21){ h.done = true; h.bust = true; C.hud.toast('bust · ' + v, 'lose'); T.dealer.face.set('sad', 1); }
      else if(v === 21) h.done = true;
    } else if(a === 'stand'){ h.done = true; }
    else if(a === 'double'){
      if(!two || !C.save.bet(h.bet, 'blackjack')){ cur.busy = false; msg('can\'t double'); return; }
      h.bet *= 2; h.doubled = true;
      betChips(T, h.bet, T.seatW[2].bet.clone().add(new THREE.Vector3((cur.hi - (cur.hands.length - 1)/2)*0.17, 0, 0)), cur.hi ? '_bet' + cur.hi : '_bet');
      C.audio.chip(null, 3);
      const id = T.shoe.draw(); h.cards.push(id);
      await dealCard(T, id, spotFor(T, 2, cur.hi, cur.hands.length, h.cards.length - 1), true, Math.PI/2);
      const v = handValue(h.cards).total; if(v > 21){ h.bust = true; C.hud.toast('bust · ' + v, 'lose'); }
      h.done = true;
    } else if(a === 'split'){
      if(!(two && cardVal(h.cards[0]) === cardVal(h.cards[1]) && cur.hands.length < 4) || !C.save.bet(h.bet, 'blackjack')){ cur.busy = false; msg('can\'t split'); return; }
      const aces = cardVal(h.cards[0]) === 11;
      const nh = { cards:[h.cards.pop()], bet:h.bet, done:false, fromSplit:true, aces };
      h.fromSplit = true; h.aces = aces;
      cur.hands.splice(cur.hi + 1, 0, nh);
      /* rebuild the cards on the table for the new layout */
      await relayout(T);
      for(const hh of [h, nh]){ const id = T.shoe.draw(); hh.cards.push(id); await dealCard(T, id, spotFor(T, 2, cur.hands.indexOf(hh), cur.hands.length, hh.cards.length - 1), true, 0); if(aces) hh.done = true; else if(handValue(hh.cards).total === 21) hh.done = true; }
      cur.hands.forEach((hh, i)=>betChips(T, hh.bet, T.seatW[2].bet.clone().add(new THREE.Vector3((i - (cur.hands.length - 1)/2)*0.17, 0, 0)), i ? '_bet' + i : '_bet'));
      C.audio.chip(null, 3);
    } else if(a === 'surrender'){
      if(!two || cur.hands.length > 1){ cur.busy = false; return; }
      h.done = true; h.surrender = true; C.hud.toast('surrendered · half back'); C.save.refund(Math.floor(h.bet/2));
    }
    while(cur.hi < cur.hands.length && cur.hands[cur.hi].done) cur.hi++;
    cur.busy = false;
    if(cur.hi >= cur.hands.length){ cur.state = 'dealer'; ui(); cur.turnResolve(); }
    else ui();
  }
  async function relayout(T){
    /* move every card of yours to its new spot */
    const mine = T.objs.filter(o=>o.userData.id !== undefined && cur.hands.some(h=>h.cards.includes(o.userData.id)) && !cur.dealer.includes(o.userData.id));
    const moves = [];
    cur.hands.forEach((h, hi)=>h.cards.forEach((id, ci)=>{ const o = mine.find(m=>m.userData.id === id && !m.userData._m); if(o){ o.userData._m = 1; moves.push(C.tweens.to(o, { pos:spotFor(T, 2, hi, cur.hands.length, ci), dur:0.25 })); } }));
    mine.forEach(m=>delete m.userData._m);
    await Promise.all(moves);
  }
  async function npcTurn(T, n){
    const h = n.hands[0];
    if(isBJ(h.cards)){ h.bj = true; n.F.face.set('money', 2); return; }
    let guard = 0;
    while(!h.done && guard++ < 8){
      await C.tweens.sleep(0.45 + Math.random()*0.4);
      let a = basic(h.cards, cur.dealer[0], h.cards.length === 2, false, false);
      if(n.style === 'scared' && handValue(h.cards).total >= 12) a = 'stand';
      if(n.style === 'hunch' && Math.random() < 0.25) a = a === 'hit' ? 'stand' : 'hit';
      if(a === 'split') a = 'hit';
      if(a === 'surrender') a = 'stand';
      n.F.armBusy = true; n.F.armR.rotation.x = a === 'stand' ? 0 : -0.6; setTimeout(()=>{ n.F.armBusy = false; }, 300);
      if(a === 'stand'){ h.done = true; break; }
      if(a === 'double'){ h.bet *= 2; n.bank -= h.bet/2; }
      const id = T.shoe.draw(); h.cards.push(id);
      await dealCard(T, id, spotFor(T, n.seat, 0, 1, h.cards.length - 1), true, Math.PI/2 - T.seatW[n.seat].th + (a === 'double' ? Math.PI/2 : 0));
      const v = handValue(h.cards).total;
      if(v > 21){ h.bust = true; h.done = true; n.F.face.set('sad', 2); }
      if(a === 'double') h.done = true;
    }
  }
  async function dealerTurn(){
    const T = cur.T;
    await flip(cur.hole, true);
    const anyLive = cur.hands.some(h=>!h.bust && !h.surrender && !h.bj) || T.npcs.some(n=>n.hands[0] && !n.hands[0].bust && !n.hands[0].bj);
    let v = handValue(cur.dealer);
    while(anyLive && v.total < 17){
      await C.tweens.sleep(0.5);
      const id = T.shoe.draw(); cur.dealer.push(id);
      await dealCard(T, id, new THREE.Vector3(-0.06 + (cur.dealer.length - 1)*0.12, T.topY + 0.003 + cur.dealer.length*0.001, T.z0 + 0.32), true);
      v = handValue(cur.dealer);
    }
    T.dealer.face.say(1);
    C.hud.say('DEALER', v.total > 21 ? 'dealer busts with ' + v.total + '.' : 'dealer has ' + v.total + '.');
    if(v.total > 21) T.dealer.face.set('dead', 2);
  }
  async function settle(dealerBJ){
    const T = cur.T;
    const dv = handValue(cur.dealer).total, dBust = dv > 21;
    let net = 0, paid = 0;
    cur.hands.forEach((h, i)=>{
      let res = 'lose', pay = 0;
      const pv = handValue(h.cards).total;
      if(h.surrender) res = 'surrender';
      else if(dealerBJ){ if(h.bj){ res = 'push'; pay = h.bet; } }
      else if(h.bj && !h.fromSplit){ res = 'blackjack'; pay = h.bet + Math.floor(h.bet*1.5); }
      else if(h.bust) res = 'bust';
      else if(dBust || pv > dv){ res = 'win'; pay = h.bet*2; }
      else if(pv === dv){ res = 'push'; pay = h.bet; }
      h.result = res;
      if(pay) C.save.pay(pay, 'blackjack');
      paid += pay; net += pay - (h.surrender ? h.bet/2 : h.bet);
    });
    T.npcs.forEach(n=>{ const h = n.hands[0]; if(!h) return; const pv = handValue(h.cards).total; let pay = 0; if(dealerBJ){ if(h.bj) pay = h.bet; } else if(h.bj) pay = h.bet*2.5; else if(!h.bust && (dBust || pv > dv)) pay = h.bet*2; else if(!h.bust && pv === dv) pay = h.bet; n.bank += pay; if(pay > h.bet){ n.F.face.set('happy', 2); if(Math.random() < 0.3) n.F.face.say(0.8); } else if(pay < h.bet) n.F.face.set('sad', 1.5); });
    const res = cur.hands.map(h=>h.result);
    if(net > 0){ C.hud.big(res.includes('blackjack') ? 'BLACKJACK' : 'WIN +' + C.fmt(net), '#59e08c'); C.audio.chipStack(null); T.dealer.face.set('sad', 1.5); if(net >= T.a.min*20) C.bus.emit('cheer', { pos:T.grp.position.clone(), big:false }); }
    else if(net < 0){ C.hud.toast(res.join(' · ') + ' · ' + C.fmt(net), 'lose'); T.dealer.face.set('happy', 1); }
    else C.hud.toast(res.join(' · '));
    cur.lastResult = res.join(' · ') + (net ? ' (' + (net > 0 ? '+' : '') + C.fmt(net) + ')' : '');
    await C.tweens.sleep(1.4);
    clearBetChips();
    await sweep(T);
    /* the pit boss notices */
    if(T.strikes >= 3){ await caught(T); return; }
    cur.state = 'bet'; cur.bet = 0; cur.pp = 0; cur.ins = 0; cur.busy = false; cur.hands = []; cur.dealer = [];
    msg(cur.lastResult || 'place your bet'); ui();
  }
  async function caught(T){
    const boss = C.bjBoss;
    boss.busy = true; boss.watch = false;
    const target = new THREE.Vector3(0.9, 0, T.z0 + 1.9).applyMatrix4(T.grp.matrixWorld);
    const from = boss.group.position.clone();
    C.hud.say('PIT BOSS', "excuse me. a word.");
    await C.tweens.add({ dur:2.2, update:k=>{ boss.group.position.lerpVectors(from, target, k); boss.speed = 1; boss.group.rotation.y = Math.atan2(target.x - from.x, target.z - from.z); } });
    boss.speed = 0; boss.face.set('angry', 6); boss.face.say(3);
    C.hud.say('PIT BOSS', "you've been betting big when the shoe's rich and small when it's not. that's a lot of math for a fridge. take ten minutes. walk it off.", 6);
    C.save.d.bannedBJUntil = Date.now() + 10*60*1000; C.save.egg('counted'); C.save.write();
    await C.tweens.sleep(3);
    T.strikes = 0;
    cur.state = 'bet'; cur.bet = 0; cur.busy = false;
    exit();
    await C.tweens.add({ dur:2.2, update:k=>{ boss.group.position.lerpVectors(target, from, k); boss.speed = 1; } });
    boss.speed = 0; boss.busy = false; boss.watch = true;
  }

  /* ---------- the panel ---------- */
  function msg(t){ if(cur) cur.msg = t; const m = C.hud.$('#bj-msg'); if(m) m.textContent = t; }
  function ui(){
    if(!cur) return;
    const T = cur.T, a = T.a;
    const chips = DENOMS.filter(d=>d.v >= a.min/5 && d.v <= a.max).reverse().slice(0, 6);
    const hv = h=>{ const v = handValue(h.cards); return (v.soft && v.total < 21 ? 'soft ' : '') + v.total; };
    const dealerShown = cur.dealer.length ? (cur.state === 'dealer' || cur.state === 'bet' ? handValue(cur.dealer).total : cardVal(cur.dealer[0])) : '-';
    let html = `<div class="fp-ptitle">BLACKJACK · ${a.name}<span class="sp"></span><small>${a.min}–${a.max} · shoe ${Math.round((1 - T.shoe.dealt/T.shoe.cards.length)*100)}% left</small><button data-a="rules">RULES</button><button data-a="exit" ${cur.state !== 'bet' ? 'disabled' : ''}>STAND UP</button></div>`;
    if(cur.state === 'bet'){
      html += `<div class="fp-row">${chips.map(d=>`<button class="fp-chip ${cur.chip === d.v ? 'sel' : ''}" data-chip="${d.v}" style="background:${d.c};color:${d.s}">${d.v >= 1000 ? d.v/1000 + 'K' : d.v}</button>`).join('')}</div>
        <div class="fp-row"><div class="fp-slotbox"><small>BET</small><b>${C.fmt(cur.bet)}</b></div><div class="fp-slotbox"><small>PERFECT PAIRS</small><b>${C.fmt(cur.pp)}</b></div></div>
        <div class="fp-row"><button data-a="add">+ BET</button><button data-a="addpp">+ PAIRS</button><button data-a="clear">CLEAR</button><button data-a="rebet" ${T.lastBet ? '' : 'disabled'}>REBET</button><button data-a="x2" ${T.lastBet ? '' : 'disabled'}>REBET ×2</button><button data-a="deal" class="fp-gold">DEAL</button></div>`;
    } else {
      html += `<div class="fp-row"><div class="fp-slotbox"><small>DEALER</small><b>${dealerShown}</b></div>${cur.hands.map((h, i)=>`<div class="fp-slotbox ${i === cur.hi && cur.state === 'play' ? 'on' : ''}"><small>HAND ${cur.hands.length > 1 ? i + 1 : ''} · ${C.fmt(h.bet)}</small><b>${h.cards.length ? hv(h) : '-'}${h.bust ? ' BUST' : ''}${h.bj ? ' BJ' : ''}</b></div>`).join('')}</div>`;
      if(cur.state === 'play'){
        const h = cur.hands[cur.hi], two = h.cards.length === 2;
        const canSplit = two && cardVal(h.cards[0]) === cardVal(h.cards[1]) && cur.hands.length < 4 && C.save.chips >= h.bet;
        const canDouble = two && C.save.chips >= h.bet;
        html += `<div class="fp-row"><button data-a="hit" class="fp-green">HIT</button><button data-a="stand" class="fp-red">STAND</button><button data-a="double" ${canDouble ? '' : 'disabled'}>DOUBLE</button><button data-a="split" ${canSplit ? '' : 'disabled'}>SPLIT</button><button data-a="surrender" ${two && cur.hands.length === 1 ? '' : 'disabled'}>SURRENDER</button><button data-a="hint">?</button></div>`;
      } else if(cur.state === 'insurance'){
        html += `<div class="fp-row"><button data-a="insY" class="fp-gold">INSURANCE (${Math.floor(cur.bet/2)})</button><button data-a="insN">NO INSURANCE</button></div>`;
      }
    }
    html += `<div class="fp-row fp-dim" id="bj-msg">${cur.msg || ''}</div>`;
    const p = C.hud.panel(html, 'fp-bjpanel');
    p.querySelectorAll('[data-chip]').forEach(b=>b.onclick = ()=>{ cur.chip = +b.dataset.chip; C.audio.click(); ui(); });
    const on = (k, f)=>{ const b = p.querySelector(`[data-a="${k}"]`); if(b) b.onclick = f; };
    on('exit', exit);
    on('rules', ()=>C.hud.modal({ title:'BLACKJACK RULES', html:'<p>six decks, reshuffled at the cut card (around 75%). dealer stands on all 17s. blackjack pays 3 to 2.</p><p>double on any first two cards, including after a split. split up to four hands. split aces get one card each, and 21 on a split hand isn\'t blackjack.</p><p>late surrender: give up half your bet on your first two cards, after the dealer checks for blackjack.</p><p>insurance is offered when the dealer shows an ace and pays 2 to 1.</p><p>perfect pairs: your first two cards are a pair. mixed colors 6:1, same color 12:1, same suit 25:1.</p><p class="fp-dim">the pit boss does not appreciate math.</p>' }));
    on('add', ()=>{ const n = Math.min(cur.chip, a.max - cur.bet); if(n <= 0){ msg('table max is ' + a.max); return; } if(!C.save.bet(n, 'blackjack')){ msg('not enough chips'); C.audio.error(); return; } cur.bet += n; betChips(T, cur.bet, T.seatW[2].bet, '_bet'); C.audio.chip(T.grp.position, 2); ui(); });
    on('addpp', ()=>{ const n = Math.min(cur.chip, Math.floor(a.max/10) - cur.pp); if(n <= 0){ msg('pairs max is ' + Math.floor(a.max/10)); return; } if(!C.save.bet(n, 'perfect pairs')){ msg('not enough chips'); return; } cur.pp += n; betChips(T, cur.pp, T.seatW[2].pp, '_pp'); C.audio.chip(T.grp.position, 1); ui(); });
    on('clear', ()=>{ C.save.refund(cur.bet + cur.pp); cur.bet = 0; cur.pp = 0; betChips(T, 0, null, '_bet'); betChips(T, 0, null, '_pp'); ui(); });
    const rebet = m=>{ const want = Math.min(a.max, T.lastBet*m), wantPP = Math.min(Math.floor(a.max/10), (T.lastPP || 0)*m); C.save.refund(cur.bet + cur.pp); cur.bet = 0; cur.pp = 0; if(!C.save.bet(want + wantPP, 'blackjack')){ msg('not enough chips'); ui(); return; } cur.bet = want; cur.pp = wantPP; betChips(T, cur.bet, T.seatW[2].bet, '_bet'); betChips(T, cur.pp, T.seatW[2].pp, '_pp'); C.audio.chip(null, 3); ui(); deal(); };
    on('rebet', ()=>rebet(1)); on('x2', ()=>rebet(2));
    on('deal', deal);
    ['hit', 'stand', 'double', 'split', 'surrender'].forEach(k=>on(k, ()=>act(k)));
    on('hint', ()=>{ const h = cur.hands[cur.hi]; const s = basic(h.cards, cur.dealer[0], h.cards.length === 2, h.cards.length === 2 && cardVal(h.cards[0]) === cardVal(h.cards[1]), h.cards.length === 2 && cur.hands.length === 1); msg('the book says: ' + s.toUpperCase()); });
    on('insY', ()=>{ cur.insResolve && cur.insResolve(true); }); on('insN', ()=>{ cur.insResolve && cur.insResolve(false); });
  }
  C.bus.on('key', e=>{
    if(!cur) return;
    if(cur.state === 'play'){ const m = { KeyH:'hit', KeyS:'stand', KeyD:'double', KeyP:'split', KeyR:'surrender' }[e.code]; if(m) act(m); }
    if(cur.state === 'bet' && (e.code === 'Space' || e.code === 'Enter')) deal();
  });
  return { name:'blackjack', tables, update(dt, t){} };
}
