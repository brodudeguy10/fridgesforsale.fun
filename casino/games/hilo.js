/* ============================================================
   FRIDGE PALACE: higher or lower
   one deck plus a joker, dealt in a row. call the next card
   higher, lower or the same. every right call multiplies the pot
   by the real odds left in the deck (minus a small house cut),
   so a 2 showing barely pays and a 7 pays well. cash out any time.
   aces are high. a tie loses unless you called it. the joker is a
   free pass and a little bonus. ten in a row runs the table.
   the dealer is LUCKY LOU. he sweats.
============================================================ */
import * as THREE from '../lib/three.module.min.js';
import { G, stool } from '../world/props.js';
import { makeCard, setCardFace, chipStack, DENOMS, RANKS } from '../world/cards.js';
import { makeFridge, bakePainted } from '../world/fridge.js';
import { neonSign } from '../world/signs.js';
import { canvas, tex } from '../world/textures.js';
import { fair, pick, ease } from '../core/util.js';

const JOKER = 52;
const EDGE = 0.96;                 /* the house keeps 4% of every fair multiplier */
const MIN = 5, MAX = 1000;         /* stake limits */
const CAP = 100000;                /* biggest pot the table pays */
const RUN = 10;                    /* calls in a row to run the table */
const NAMES = ['', '', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
const LONG = ['', '', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'jack', 'queen', 'king', 'ace'];
/* atlas id to rank value, aces high */
export const valOf = id=>id === JOKER ? 0 : (id % 13 === 0 ? 14 : id % 13 + 1);

const LOU = {
  hello:['lucky lou. higher, lower, or same. aces high. ties go to the house unless you called them.', 'sit down. the deck is fresh. so am i. one of us is lying.', 'welcome to the only honest game in the building. the odds are printed right on the buttons.'],
  win:['nice.', 'sure. fine.', 'the deck likes you.', 'mm-hm.', 'keep going. i dare you.', 'that one was easy.'],
  bold:['against the odds. on purpose. respect.', 'you called THAT? and it hit?', 'that was a coin flip and you won the coin.'],
  obvious:['a two showing and you said higher. groundbreaking.', 'an ace showing and you said lower. bold strategy, genius.', 'you took the safe one. the pot noticed.'],
  lose:['the house thanks you.', 'and that is why they call me lucky.', 'oof. back to the cage.', 'cold deck. cold fridge. cold night.'],
  tie:['a tie. ties go to the house. it says so on the felt.', 'same card. you didn\'t call it. i did. in my head.'],
  same:['you called the SAME card. who does that.', 'same. SAME. i\'m going to need a minute.'],
  joker:['the joker. free ride. don\'t thank me, thank the printer.', 'joker\'s wild. the pot gets a little treat.'],
  sweat:['the pit boss is looking at me. stop winning.', 'i have a family. a family freezer. think of them.', 'that\'s a lot of chips on one table.'],
  cash:['smart. probably.', 'cashing out. the coward\'s victory. it spends the same.', 'take it and go before i do something about it.'],
  run:['RAN THE TABLE. ten in a row. i\'m going to go lie down.'],
  talk:['i used to deal blackjack. too much math. this is one question at a time.', 'the trick is there is no trick. the trick is the odds on the buttons.', 'a seven is the worst card to see. every call pays decent and nothing is safe.', 'the joker is real. one per deck. it\'s the only friend you have at this table.', 'people ask why i sweat. i\'m a fridge. it\'s condensation. it\'s also fear.']
};

/* the felt */
function feltTex(){
  const W = 1024, H = 512, c = canvas(W, H), g = c.getContext('2d');
  const gr = g.createRadialGradient(W/2, H/2, 40, W/2, H/2, W*0.6); gr.addColorStop(0, '#7a1a2a'); gr.addColorStop(1, '#3a0812'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
  const id = g.getImageData(0, 0, W, H), d = id.data; for(let i=0;i<d.length;i+=4){ const n = (Math.random() - 0.5)*9; d[i] += n; d[i+1] += n; d[i+2] += n; } g.putImageData(id, 0, 0);
  g.strokeStyle = '#e6c46a'; g.lineWidth = 4; g.strokeRect(28, 28, W - 56, H - 56);
  /* eight card spots in a row */
  for(let i=0;i<8;i++){ const x = 95 + i*119, y = 262; g.strokeStyle = 'rgba(242,232,200,0.55)'; g.lineWidth = 3; g.strokeRect(x - 44, y - 62, 88, 124); }
  g.fillStyle = '#f2d27a'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.font = 'bold 54px Georgia, serif'; g.fillText('HIGHER  ·  OR  ·  LOWER', W/2, 90);
  g.font = '24px Georgia, serif'; g.fillStyle = '#f2e8c8'; g.fillText('ACES HIGH · TIES GO TO THE HOUSE UNLESS CALLED · THE JOKER IS A FREE PASS', W/2, 140);
  g.font = 'italic 26px Georgia, serif'; g.fillStyle = 'rgba(242,210,122,0.8)'; g.fillText('ten in a row runs the table', W/2, 410);
  g.font = '20px Georgia, serif'; g.fillStyle = 'rgba(242,232,200,0.6)'; g.fillText('stakes ' + MIN + ' to ' + MAX.toLocaleString() + ' · table pays up to ' + CAP.toLocaleString(), W/2, 446);
  /* little arrows between the spots */
  g.fillStyle = 'rgba(242,210,122,0.5)'; for(let i=0;i<7;i++){ const x = 95 + i*119 + 60, y = 262; g.beginPath(); g.moveTo(x - 8, y - 10); g.lineTo(x + 6, y); g.lineTo(x - 8, y + 10); g.fill(); }
  return tex(c);
}
/* the joker's face */
function jokerTex(){
  const c = canvas(256, 358), g = c.getContext('2d');
  g.fillStyle = '#fbf8ef'; g.fillRect(0, 0, 256, 358);
  g.strokeStyle = '#2a2a2a'; g.lineWidth = 4; g.strokeRect(8, 8, 240, 342);
  g.fillStyle = '#c0182a'; g.font = 'bold 26px Georgia, serif'; g.textAlign = 'center';
  'JOKER'.split('').forEach((ch, i)=>g.fillText(ch, 26, 44 + i*28));
  g.save(); g.translate(128, 190);
  /* a fridge in a jester hat */
  g.fillStyle = '#e8e8ea'; g.strokeStyle = '#222'; g.lineWidth = 3; g.fillRect(-42, -40, 84, 120); g.strokeRect(-42, -40, 84, 120);
  g.beginPath(); g.moveTo(-42, 0); g.lineTo(42, 0); g.stroke();
  g.fillStyle = '#05111a'; g.fillRect(-30, -32, 60, 26); g.fillStyle = '#7ff3ff'; g.fillRect(-20, -25, 8, 10); g.fillRect(12, -25, 8, 10);
  const hat = [['#c0182a', -42, -10], ['#2d58c8', 0, 0], ['#f2c230', 42, 10]];
  hat.forEach(([col, tx, rot])=>{ g.fillStyle = col; g.beginPath(); g.moveTo(-30 + tx*0.4, -40); g.quadraticCurveTo(tx, -90, tx*1.25, -78); g.lineTo(30 + tx*0.4, -40); g.fill(); g.fillStyle = '#f2c230'; g.beginPath(); g.arc(tx*1.25, -78, 7, 0, 7); g.fill(); });
  g.restore();
  g.fillStyle = '#2a2a2a'; g.font = 'italic 18px Georgia, serif'; g.fillText('free pass', 128, 330);
  return tex(c);
}
let jokerMat = null;
function makeJoker(){
  const card = makeCard(0);
  if(!jokerMat) jokerMat = new THREE.MeshStandardMaterial({ map:jokerTex(), color:0xd2d2d2, roughness:0.6 });
  const front = card.children[0];
  front.geometry = new THREE.PlaneGeometry(0.063, 0.088); front.material = jokerMat;
  card.userData.id = JOKER;
  return card;
}

export function init(C){
  const { scene, M } = C, B = C.world.batch;
  const A = { x:26.2, z:4.8, ry:-Math.PI/2 };
  const grp = new THREE.Group(); grp.position.set(A.x, 0, A.z); grp.rotation.y = A.ry; scene.add(grp); grp.updateMatrixWorld(true);
  const topY = 0.84, CARD = 2.5, FACE = 0;
  /* the table: felt, a padded rail, a wood body, all baked */
  const felt = new THREE.Mesh(new THREE.PlaneGeometry(2.1, 1.05), new THREE.MeshStandardMaterial({ map:feltTex(), roughness:0.95 }));
  felt.rotation.x = -Math.PI/2; felt.position.y = topY; grp.add(felt);
  const stat = new THREE.Group(); grp.add(stat);
  [[0, 0.58, 2.3, 0.13], [0, -0.58, 2.3, 0.13]].forEach(([x, z, w, d])=>{ const r = new THREE.Mesh(G.rbox(w, 0.12, d, 0.05), M.leatherBlack); r.position.set(x, topY + 0.03, z); stat.add(r); });
  [[1.12, 0], [-1.12, 0]].forEach(([x, z])=>{ const r = new THREE.Mesh(G.rbox(0.13, 0.12, 1.29, 0.05), M.leatherBlack); r.position.set(x, topY + 0.03, z); stat.add(r); });
  const body = new THREE.Mesh(G.rbox(2.2, 0.8, 1.15, 0.06), M.woodDark); body.position.y = topY - 0.42; stat.add(body);
  const shoe = new THREE.Mesh(G.box, M.black); shoe.scale.set(0.14, 0.1, 0.24); shoe.position.set(0.88, topY + 0.05, -0.32); shoe.rotation.y = 0.25; stat.add(shoe);
  const goldEdge = new THREE.Mesh(G.box, M.gold); goldEdge.scale.set(2.32, 0.02, 0.02); goldEdge.position.set(0, topY + 0.09, 0.645); stat.add(goldEdge);
  bakePainted(stat);
  /* the deck sitting in the shoe, and the discard pile */
  const deckTop = makeCard(0); setCardFace(deckTop, false); deckTop.scale.setScalar(CARD); deckTop.position.set(0.88, topY + 0.105, -0.32); deckTop.rotation.y = 0.25; grp.add(deckTop);
  const shoePos = new THREE.Vector3(0.88, topY + 0.11, -0.32), discPos = new THREE.Vector3(-0.9, topY + 0.01, -0.32);
  /* the card row */
  const spot = i=>new THREE.Vector3(-0.83 + i*0.237, topY + 0.004, -0.01);
  /* the stool you sit on */
  { const w = new THREE.Vector3(0, 0, 1.08).applyMatrix4(grp.matrixWorld); stool(B, M, w.x, w.z, 0.8); }
  C.collide.boxC(A.x, A.z, 1.3, 2.4, 0, 'table');
  /* lucky lou */
  /* after the cold open, lou isn't here anymore. lefty covers his table */
  const louGone = !!(C.save.d.wake && C.save.d.wake.louDead);
  const lou = makeFridge(louGone ? { face:true, arms:true, color:'#8a96a2', trim:'#22252b', acc:['bowtie', 'vest'], vest:'#111114', eye:'#7ff3ff', style:'std' } : { face:true, arms:true, color:'#e8d9b0', trim:'#7a1220', acc:['bowtie', 'vest', 'nametag'], vest:'#7a1220', eye:'#ffd56a', style:'retro' });
  lou.group.position.set(0, 0, -0.92); grp.add(lou.group); lou.name = louGone ? 'LEFTY' : 'LUCKY LOU';
  if(louGone){ LOU.hello = ['lefty. i\'m covering lou\'s table. ...i\'m covering lou\'s table for good, i guess.', 'sit. same rules. lou wrote them on the felt. i didn\'t change anything. i won\'t.', 'he used to sweat. i don\'t. i keep thinking i should, for him.']; LOU.talk = ['i didn\'t know him that well. everybody says he was the only honest dealer in the building.', 'the candles are from gus. the photo is from doug. the felt is still his.', 'people keep asking if i\'m lucky. i say no. it feels wrong to say yes.', 'i don\'t go near the slot rows anymore. nobody on staff does.']; } lou.seed = 3.3; C.staff.push(lou);
  { const w = new THREE.Vector3(0, 0, -0.92).applyMatrix4(grp.matrixWorld); C.collide.circle(w.x, w.z, 0.45, 'croupier'); }
  /* sweat: a few drops that slide down lou when the pot gets big */
  const dropM = new THREE.MeshStandardMaterial({ color:0xbfeeff, roughness:0.05, metalness:0.1, transparent:true, opacity:0.8 });
  const drops = []; for(let i=0;i<4;i++){ const d = new THREE.Mesh(G.sph, dropM); d.scale.set(0.012, 0.018, 0.012); d.visible = false; lou.inner.add(d); drops.push({ m:d, t:Math.random() }); }
  /* the sign and the streak board above him */
  const sign = neonSign(scene, 'Higher or Lower', '#ff5ab4', ...new THREE.Vector3(0, 0, -1.25).applyMatrix4(grp.matrixWorld).toArray().map((v, i)=>i === 1 ? 3.15 : v), A.ry, 0.62, { flicker:0.05 });
  C.world.neon.push(sign);
  const bc = canvas(512, 256), bg = bc.getContext('2d'), btex = tex(bc, { nomip:true });
  const board = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 0.75), new THREE.MeshBasicMaterial({ map:btex, toneMapped:false }));
  board.position.copy(new THREE.Vector3(0, 0, -1.25).applyMatrix4(grp.matrixWorld)).setY(2.35); board.rotation.y = A.ry; scene.add(board);
  const frame = new THREE.Mesh(G.box, M.gold); frame.scale.set(1.58, 0.83, 0.03); frame.position.copy(board.position); frame.position.addScaledVector(new THREE.Vector3(Math.sin(A.ry), 0, Math.cos(A.ry)), -0.02); frame.rotation.y = A.ry; B.add(G.box, M.gold, frame.position.x, frame.position.y, frame.position.z, 0.03, 0.83, 1.58);
  const S = C.save.d.stats;
  if(S.hiloBest === undefined){ S.hiloBest = 0; S.hiloRuns = 0; S.hiloBiggest = 0; }
  function drawBoard(){
    const g = bg, st = cur ? cur.streak : 0, pot = cur && cur.state === 'call' ? cur.pot : 0, hot = st >= 5;
    const gr = g.createLinearGradient(0, 0, 0, 256); gr.addColorStop(0, hot ? '#3a0510' : '#140409'); gr.addColorStop(1, '#050203'); g.fillStyle = gr; g.fillRect(0, 0, 512, 256);
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillStyle = '#ffd56a'; g.font = 'bold 26px Georgia, serif'; g.fillText(cur && cur.state === 'call' ? 'THE POT' : 'LUCKY LOU\'S TABLE', 256, 34);
    const live = cur && cur.state === 'call';
    g.fillStyle = cur && cur.lostFlash > 0 ? '#ff4a4a' : '#7dff9a'; g.font = live || (cur && cur.lostFlash > 0) ? 'bold 74px Georgia, serif' : 'bold 48px Georgia, serif';
    g.fillText(cur && cur.state === 'call' ? C.fmt(pot) : (cur && cur.lostFlash > 0 ? 'BUST' : 'PLACE A STAKE'), 256, 104);
    /* the ladder: one bulb per call, ten to run the table */
    for(let i=0;i<RUN;i++){ const x = 58 + i*44, y = 178, on = i < st; g.fillStyle = on ? (i >= 7 ? '#ff5a3a' : '#ffd56a') : '#2a1a1a'; g.beginPath(); g.arc(x, y, 15, 0, 7); g.fill(); if(on){ g.shadowColor = g.fillStyle; g.shadowBlur = 16; g.fill(); g.shadowBlur = 0; } g.fillStyle = on ? '#2a1a00' : '#5a4040'; g.font = 'bold 14px Georgia'; g.fillText(String(i + 1), x, y + 1); }
    g.fillStyle = 'rgba(242,232,200,0.7)'; g.font = '18px Georgia, serif';
    g.fillText('best streak ' + Math.max(S.hiloBest, st) + '  ·  biggest pot ' + C.fmt(S.hiloBiggest || 0), 256, 226);
    btex.needsUpdate = true;
  }
  /* people who like to watch */
  const watch = [[-0.9, 1.25], [0.95, 1.2], [1.6, 0.4]].map(([lx, lz])=>{ const w = new THREE.Vector3(lx, 0, lz).applyMatrix4(grp.matrixWorld); const c = new THREE.Vector3(0, 0, 0).applyMatrix4(grp.matrixWorld); return { x:w.x, z:w.z, face:Math.atan2(c.x - w.x, c.z - w.z) }; });

  let cur = null, objs = [], stakeMesh = null;
  const ipos = new THREE.Vector3(0, 1.1, 0.95).applyMatrix4(grp.matrixWorld);
  C.world.interact.push({ pos:ipos, r:2.6, text:()=>'play higher or lower · ' + MIN + '–' + MAX.toLocaleString(), use:()=>sit() });
  C.world.interact.push({ pos:new THREE.Vector3(0, 1.55, -0.92).applyMatrix4(grp.matrixWorld), r:2.4, enabled:()=>!cur, text:()=>'talk to ' + lou.name.toLowerCase(), use:()=>{ lou.face.say(2); lou.face.set('happy', 2); C.hud.say(lou.name, pick(LOU.talk)); } });
  const say = (k, dur)=>{ const line = Array.isArray(k) ? pick(k) : k; lou.face.say(Math.min(4, line.length*0.05)); C.hud.say(lou.name, line, dur); };

  /* ---------- sitting ---------- */
  function sit(){
    if(cur) return;
    const camPos = new THREE.Vector3(0, 1.66, 0.92).applyMatrix4(grp.matrixWorld);
    const look = new THREE.Vector3(0, topY - 0.06, -0.05).applyMatrix4(grp.matrixWorld);
    const sw = new THREE.Vector3(0, 0, 1.08).applyMatrix4(grp.matrixWorld);
    C.player.pos.set(sw.x, 0, sw.z); C.player.yaw = Math.atan2(-(look.x - sw.x), -(look.z - sw.z));
    cur = { state:'bet', stake:0, chip:25, pot:0, streak:0, deck:[], row:[], last:0, busy:false, sames:0, ranTable:false, lostFlash:0, msg:'place a stake' };
    C.sit(camPos, look, exit);
    lou.face.set('happy', 1.5); say(LOU.hello, 5);
    drawBoard(); ui();
  }
  function exit(){
    if(!cur || cur.busy) return;
    /* walking away mid-run takes the pot with you */
    if(cur.state === 'call' && cur.pot > 0){ cashOut(true); return; }
    if(cur.stake > 0) C.save.refund(cur.stake);
    clearStake(); sweepNow();
    cur = null; drawBoard(); C.standUp();
  }
  /* ---------- 3D helpers ---------- */
  function setStake(n){ if(stakeMesh){ grp.remove(stakeMesh); stakeMesh = null; } if(n > 0){ stakeMesh = chipStack(n); stakeMesh.scale.setScalar(1.4); stakeMesh.position.set(0, topY + 0.002, 0.38); grp.add(stakeMesh); } }
  function clearStake(){ setStake(0); }
  async function dealTo(id, i){
    const card = id === JOKER ? makeJoker() : makeCard(id); card.scale.setScalar(CARD);
    setCardFace(card, false);
    card.position.copy(shoePos); card.rotation.y = 0.25;
    grp.add(card); objs.push(card);
    C.audio.card(grp.position);
    lou.armBusy = true; lou.armR.rotation.x = -0.9;
    await C.tweens.to(card, { pos:spot(i), dur:0.3, arc:0.07, ease:ease.out, update:k=>{ card.rotation.y = 0.25*(1 - k) + FACE*k; } });
    lou.armR.rotation.x = 0; lou.armBusy = false;
    C.audio.flip(grp.position);
    const y0 = card.position.y;
    await C.tweens.add({ dur:0.2, update:k=>{ card.rotation.z = Math.PI*(1 - k); card.position.y = y0 + Math.sin(k*Math.PI)*0.05; } });
    return card;
  }
  /* the row holds eight; after that everything slides left and the oldest goes to the pile */
  async function makeRoom(){
    if(cur.row.length < 8) return cur.row.length;
    const old = cur.row.shift();
    C.tweens.to(old, { pos:discPos, dur:0.3, arc:0.04 }).then(()=>{ grp.remove(old); objs = objs.filter(o=>o !== old); });
    cur.row.forEach((c, i)=>C.tweens.to(c, { pos:spot(i), dur:0.25 }));
    await C.tweens.sleep(0.26);
    return cur.row.length;
  }
  async function sweep(){
    for(const o of objs) C.tweens.to(o, { pos:discPos, dur:0.35, arc:0.05 });
    await C.tweens.sleep(0.4);
    sweepNow();
  }
  function sweepNow(){ objs.forEach(o=>grp.remove(o)); objs = []; if(cur) cur.row = []; }

  /* ---------- odds ---------- */
  function counts(){
    const r = cur.last, left = cur.deck.length; let hi = 0, lo = 0, eq = 0, jk = 0;
    for(const id of cur.deck){ if(id === JOKER){ jk++; continue; } const v = valOf(id); if(v > r) hi++; else if(v < r) lo++; else eq++; }
    return { hi, lo, eq, jk, left };
  }
  function mult(win, n){ if(win <= 0 || n <= 0) return 0; return Math.max(1.01, Math.floor(EDGE*n/win*100)/100); }
  function offer(){
    const c = counts(), n = c.left;
    const p = k=>(c[k] + c.jk)/n;
    return { c, higher:{ p:p('hi'), m:mult(c.hi + c.jk, n) }, lower:{ p:p('lo'), m:mult(c.lo + c.jk, n) }, same:{ p:p('eq'), m:mult(c.eq + c.jk, n) } };
  }

  /* ---------- the run ---------- */
  async function deal(){
    if(!cur || cur.state !== 'bet' || cur.busy) return;
    if(cur.stake < MIN){ msg('minimum stake is ' + MIN); C.audio.error(); return; }
    cur.busy = true; cur.lastStake = cur.stake;
    sweepNow();
    /* a fresh deck for every run: 52 and the joker */
    cur.deck = []; for(let i=0;i<=52;i++) cur.deck.push(i);
    for(let i=cur.deck.length - 1; i>0; i--){ const j = fair(i + 1); [cur.deck[i], cur.deck[j]] = [cur.deck[j], cur.deck[i]]; }
    C.audio.shuffle(grp.position);
    lou.armBusy = true; await C.tweens.add({ dur:0.8, update:k=>{ lou.armL.rotation.x = -1.2 + Math.sin(k*24)*0.25; lou.armR.rotation.x = -1.2 - Math.sin(k*24)*0.25; } }); lou.armBusy = false;
    /* the first card can't be the joker */
    let first = cur.deck.pop(); if(first === JOKER){ cur.deck.unshift(first); first = cur.deck.pop(); }
    cur.row.push(await dealTo(first, 0));
    cur.last = valOf(first); cur.pot = cur.stake; cur.streak = 0; cur.sames = 0; cur.ranTable = false;
    cur.state = 'call'; cur.busy = false; S.hiloRuns++;
    msg(LONG[cur.last] + ' showing. higher, lower, or the same?');
    drawBoard(); ui();
  }
  async function call(kind){
    if(!cur || cur.state !== 'call' || cur.busy) return;
    const o = offer(), pick_ = o[kind];
    if(!pick_.m){ C.audio.error(); msg('nothing left in the deck can do that'); return; }
    cur.busy = true; ui();
    const prev = cur.last;
    const id = cur.deck.pop();
    const i = await makeRoom();
    const card = await dealTo(id, i); cur.row.push(card);
    const pos = card.getWorldPosition(new THREE.Vector3());
    if(id === JOKER){
      /* free pass, and the pot gets half a step on top */
      cur.streak++; cur.pot = Math.min(CAP, Math.round(cur.pot*(1 + (pick_.m - 1)*0.5 + 0.1)));
      C.fx.confetti(pos.clone().setY(pos.y + 0.2), 40); C.audio.slotWin(pos, 2); C.hud.big('JOKER', '#ff5ab4', 1500); lou.face.set('laugh', 2); say(LOU.joker);
      return afterWin(pos, kind, prev);
    }
    const v = valOf(id);
    const won = kind === 'higher' ? v > prev : kind === 'lower' ? v < prev : v === prev;
    if(won){
      cur.streak++; cur.pot = Math.min(CAP, Math.round(cur.pot*pick_.m)); cur.last = v;
      if(kind === 'same'){ cur.sames++; C.hud.big('SAME!', '#7ff3ff', 1500); C.audio.jackpot && C.audio.jackpot(pos); say(LOU.same); lou.face.set('shock', 2);
        if(cur.sames >= 3 && C.save.egg('seeingdouble')) C.hud.toast('secret: seeing double', 'gold'); }
      else if(pick_.p < 0.45){ say(LOU.bold); lou.face.set('shock', 1.2); }
      else if(pick_.p > 0.88){ say(LOU.obvious); lou.face.set('smug', 1.2); }
      else if(Math.random() < 0.5) say(LOU.win, 2);
      C.audio.chip(pos, 3);
      return afterWin(pos, kind, prev);
    }
    /* busted */
    cur.last = v;
    const tie = v === prev;
    C.audio.aww(grp.position); lou.face.set('smug', 2); say(tie ? LOU.tie : LOU.lose);
    C.hud.big(tie ? 'TIE · HOUSE' : 'BUST', '#ff4a4a', 1400);
    msg((tie ? 'another ' + LONG[v] + '. ties go to the house.' : (v === 8 || v === 14 ? 'an ' : 'a ') + LONG[v] + '. busted') + (cur.streak ? ' after ' + cur.streak + ' in a row.' : '.') + ' stake up for another run.');
    sign.userData.off = 0.6;
    S.hiloBest = Math.max(S.hiloBest, cur.streak); C.save.write();
    cur.lostFlash = 2.2; cur.streak = 0; cur.pot = 0; cur.state = 'bet'; cur.stake = 0; clearStake();
    drawBoard(); ui();
    await C.tweens.sleep(1.4);
    await sweep();
    cur && (cur.busy = false, ui());
  }
  async function afterWin(pos, kind, prev){
    const st = cur.streak;
    if(st === 5){ C.bus.emit('cheer', { pos:grp.position.clone(), big:false }); C.audio.cheer(grp.position, 0.5); C.hud.toast('people are starting to watch', 'gold'); }
    if(st === 8){ say(LOU.sweat); lou.face.set('shock', 2.5); }
    if(st === RUN && !cur.ranTable){
      cur.ranTable = true; cur.pot = Math.min(CAP, Math.round(cur.pot*1.5));
      C.hud.big('RAN THE TABLE · ×1.5', '#ffd56a', 2600); C.fx.confetti(grp.position.clone().setY(2), 160); C.audio.jackpot && C.audio.jackpot(grp.position); C.bus.emit('cheer', { pos:grp.position.clone(), big:true });
      say(LOU.run, 4); if(C.save.egg('rantable')) C.hud.toast('secret: ran the table', 'gold');
    }
    drawBoard();
    if(cur.pot >= CAP){ msg('the table can\'t pay more than ' + C.fmt(CAP) + '. lou is paying you to leave.'); await C.tweens.sleep(0.8); cur.busy = false; return cashOut(); }
    if(!cur.deck.length || (cur.deck.length === 1 && cur.deck[0] === JOKER)){ msg('the deck ran out. lou pays you and goes to get a towel.'); await C.tweens.sleep(0.8); cur.busy = false; return cashOut(); }
    cur.busy = false;
    msg((st === 1 ? 'one' : st) + ' in a row. ' + LONG[cur.last] + ' showing.');
    ui();
  }
  async function cashOut(leaving){
    if(!cur || cur.state !== 'call' || cur.busy) return;
    cur.busy = true;
    const won = cur.pot, profit = won - cur.stake;
    C.save.pay(won, 'higher or lower', profit >= 2000 ? 'higher or lower: +' + C.fmt(profit) + ' on a ' + cur.streak + ' card run' : null);
    S.hiloBest = Math.max(S.hiloBest, cur.streak); S.hiloBiggest = Math.max(S.hiloBiggest || 0, won); C.save.write();
    C.audio.chipStack(grp.position); C.fx.coins(new THREE.Vector3(0, topY + 0.2, 0.38).applyMatrix4(grp.matrixWorld), Math.min(40, 6 + cur.streak*3));
    C.hud.big('+' + C.fmt(won), '#59e08c', 1800);
    if(profit >= cur.stake*10) C.bus.emit('cheer', { pos:grp.position.clone(), big:profit >= cur.stake*40 });
    lou.face.set(profit > cur.stake*5 ? 'sad' : 'happy', 2); say(LOU.cash, 2.5);
    cur.state = 'bet'; cur.stake = 0; cur.pot = 0; cur.streak = 0; clearStake();
    drawBoard(); ui();
    await sweep();
    if(!cur) return;
    cur.busy = false; cur.msg = 'place a stake';
    if(leaving){ cur = null; drawBoard(); C.standUp(); return; }
    ui();
  }
  function msg(t){ if(cur) cur.msg = t; const m = C.hud.$('#hl-msg'); if(m) m.textContent = t; }

  /* ---------- the panel ---------- */
  function ui(){
    if(!cur) return;
    let html = `<div class="fp-ptitle">HIGHER OR LOWER<span class="sp"></span><small>${MIN}–${MAX.toLocaleString()} · pays up to ${C.fmt(CAP)}</small><button data-a="rules">RULES</button><button data-a="exit" ${cur.busy ? 'disabled' : ''}>${cur.state === 'call' ? 'CASH OUT + STAND' : 'STAND UP'}</button></div>`;
    if(cur.state === 'bet'){
      const chips = DENOMS.filter(d=>d.v >= MIN && d.v <= MAX).reverse();
      html += `<div class="fp-row">${chips.map(d=>`<button class="fp-chip ${cur.chip === d.v ? 'sel' : ''}" data-chip="${d.v}" style="background:${d.c};color:${d.s}">${d.v >= 1000 ? d.v/1000 + 'K' : d.v}</button>`).join('')}</div>
        <div class="fp-row"><div class="fp-slotbox"><small>STAKE</small><b>${C.fmt(cur.stake)}</b></div><div class="fp-slotbox"><small>BEST STREAK</small><b>${S.hiloBest}</b></div></div>
        <div class="fp-row"><button data-a="add">+ STAKE</button><button data-a="clear" ${cur.stake ? '' : 'disabled'}>CLEAR</button><button data-a="rebet" ${cur.lastStake ? '' : 'disabled'}>SAME AGAIN</button><button data-a="deal" class="fp-gold" ${cur.busy ? 'disabled' : ''}>DEAL</button></div>`;
    } else {
      const o = offer(), pct = p=>Math.round(p*100) + '%';
      const btn = (k, label, cls)=>`<button data-call="${k}" class="${cls}" ${!o[k].m || cur.busy ? 'disabled' : ''}>${label}<small style="display:block;font-size:10px;opacity:.8">${o[k].m ? '×' + o[k].m.toFixed(2) + ' · ' + pct(o[k].p) : 'impossible'}</small></button>`;
      html += `<div class="fp-row"><div class="fp-slotbox"><small>SHOWING</small><b>${NAMES[cur.last]}</b></div><div class="fp-slotbox"><small>STREAK</small><b>${cur.streak}/${RUN}</b></div><div class="fp-slotbox"><small>POT</small><b>${C.fmt(cur.pot)}</b></div>
        ${btn('higher', '▲ HIGHER', 'fp-green')}${btn('same', '= SAME', '')}${btn('lower', '▼ LOWER', 'fp-red')}<button data-a="cash" class="fp-gold" ${cur.busy ? 'disabled' : ''}>CASH OUT<small style="display:block;font-size:10px;opacity:.8">${C.fmt(cur.pot)}</small></button></div>
        <div class="fp-row fp-dim" style="font-size:11px">deck: ${o.c.left} left · ${o.c.hi} higher · ${o.c.eq} same · ${o.c.lo} lower${o.c.jk ? ' · the joker' : ''}${C.input.touch ? '' : ' · W/↑ higher · S/↓ lower · Q same · space cashes out'}</div>`;
    }
    html += `<div class="fp-row fp-dim" id="hl-msg">${cur.msg || ''}</div>`;
    if(cur.state === 'bet' && !C.input.touch) html += `<div class="fp-row fp-dim" style="font-size:10px;opacity:.6">space deals</div>`;
    const p = C.hud.panel(html, 'fp-hlpanel');
    p.querySelectorAll('[data-chip]').forEach(b=>b.onclick = ()=>{ cur.chip = +b.dataset.chip; C.audio.click(); ui(); });
    p.querySelectorAll('[data-call]').forEach(b=>b.onclick = ()=>call(b.dataset.call));
    const on = (k, f)=>{ const b = p.querySelector(`[data-a="${k}"]`); if(b) b.onclick = f; };
    on('exit', exit);
    on('rules', ()=>C.hud.modal({ title:'HIGHER OR LOWER', html:`<p>one deck and a joker, shuffled fresh for every run. lou turns a card. you say whether the next one is higher, lower or the same. aces are high, twos are low.</p><p>every right call multiplies the pot. the multiplier on each button comes from what's actually left in the deck, minus a 4% house cut, so the safe call pays a little and the brave call pays a lot. the percent under it is your real chance.</p><p>a tie loses unless you called SAME. the joker counts as a win no matter what you called and gives the pot a little bonus. ten right in a row runs the table: the pot gets ×1.5.</p><p>cash out whenever you want. stand up in the middle of a run and you take the pot with you. the table pays up to ${C.fmt(CAP)}.</p>` }));
    on('add', ()=>{ const n = Math.min(cur.chip, MAX - cur.stake); if(n <= 0){ msg('max stake is ' + MAX); return; } if(!C.save.bet(n, 'higher or lower')){ msg('not enough chips'); C.audio.error(); return; } cur.stake += n; setStake(cur.stake); C.audio.chip(grp.position, 2); ui(); });
    on('clear', ()=>{ C.save.refund(cur.stake); cur.stake = 0; clearStake(); ui(); });
    on('rebet', ()=>{ const n = Math.min(MAX, cur.lastStake || 0) - cur.stake; if(n > 0){ if(!C.save.bet(n, 'higher or lower')){ msg('not enough chips'); C.audio.error(); return; } cur.stake += n; setStake(cur.stake); C.audio.chip(grp.position, 2); } ui(); });
    on('deal', deal);
    on('cash', ()=>cashOut());
  }
  C.bus.on('key', e=>{
    if(!cur || !C.seated || C.hud.modalOpen) return;
    const k = e.code;
    if(cur.state === 'bet' && (k === 'Space' || k === 'Enter')) deal();
    else if(cur.state === 'call'){
      if(k === 'KeyW' || k === 'ArrowUp') call('higher');
      else if(k === 'KeyS' || k === 'ArrowDown') call('lower');
      else if(k === 'KeyQ') call('same');
      else if(k === 'Space' || k === 'Enter') cashOut();
    }
  });
  drawBoard();
  return { name:'hilo', grp, lou, watch, update(dt, t){
    if(cur && cur.lostFlash > 0){ cur.lostFlash -= dt; if(cur.lostFlash <= 0) drawBoard(); }
    /* lou sweats in proportion to the pot */
    const heat = cur && cur.state === 'call' ? Math.min(1, cur.streak/8 + cur.pot/40000) : 0;
    drops.forEach((d, i)=>{ if(heat < 0.35){ d.m.visible = false; return; } d.m.visible = true; d.t += dt*(0.3 + heat*0.6); const k = d.t % 1; d.m.position.set(-0.28 + i*0.17, lou.top - 0.12 - k*0.55, lou.d/2 + 0.05); d.m.scale.set(0.012, 0.018 + k*0.01, 0.012); });
    if(heat > 0.6 && Math.random() < dt*0.4 && lou.face.mood === 'neutral') lou.face.set('shock', 0.8);
  } };
}
