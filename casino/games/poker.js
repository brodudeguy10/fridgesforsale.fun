/* ============================================================
   FRIDGE PALACE: no limit texas hold'em
   you and up to five regulars. blinds 10/20, buy in 400 to 4,000.
   every regular has a style: rocks, maniacs, calling stations,
   one guy who only plays aces. they estimate their odds by
   simulating the rest of the hand a couple hundred times.
   the house rakes 5% of every pot that sees a flop, capped at 30.
============================================================ */
import * as THREE from '../lib/three.module.min.js';
import { chair } from '../world/props.js';
import { makeCard, setCardFace, chipStack, RANKS, SUITS } from '../world/cards.js';
import { makeFridge } from '../world/fridge.js';
import { canvas, tex } from '../world/textures.js';
import { fair, pick, rand, ease, shuffle } from '../core/util.js';
import { eval7, describe, equity, sidePots } from './poker-eval.js';

const SB = 10, BB = 20, MINBUY = 400, MAXBUY = 4000, RAKE = 0.05, RAKECAP = 30;
const ROSTER = [
  { name:'ROCK', style:{ tight:0.7, aggro:0.3, bluff:0.03 }, look:{ color:'#8a8a90', style:'std', acc:['beanie'], beanie:'#333' }, lines:['fold.', 'i\'ll wait.', 'nope.'] },
  { name:'MANIAC MIKE', style:{ tight:0.15, aggro:0.85, bluff:0.3 }, look:{ color:'#ff5a3d', style:'retro', acc:['party'], eye:'#ffd400' }, lines:['RAISE.', 'all of it. all of my it.', 'let\'s gamble, freezers.'] },
  { name:'STATION', style:{ tight:0.2, aggro:0.15, bluff:0.05, sticky:0.6 }, look:{ color:'#9fe3d0', style:'french', acc:['tophat'] }, lines:['call.', 'i just want to see it.', 'call. i always call.'] },
  { name:'SHARK', style:{ tight:0.55, aggro:0.65, bluff:0.12 }, look:{ color:'#1c2733', style:'smart', acc:['chain'], shades:true, eye:'#7ff3ff' }, lines:['interesting.', 'you sure about that?', 'raise.'] },
  { name:'GRANDPA ICEBOX', style:{ tight:0.6, aggro:0.2, bluff:0.02 }, look:{ color:'#efe6c8', style:'retro', acc:['cowboy'], eye:'#ffd56a' }, lines:['back in my day the cards were colder.', 'i\'ll call, sonny.', 'too rich for my coils.'] },
  { name:'ACE ONLY AL', style:{ tight:0.9, aggro:0.9, bluff:0, aceOnly:true }, look:{ color:'#d9a441', style:'std', acc:['crown'], handle:'gold' }, lines:['no ace, no play.', 'ALL IN. i have an ace. probably.', '...'] },
  { name:'NERVOUS NED', style:{ tight:0.45, aggro:0.2, bluff:0.15, tell:true }, look:{ color:'#c8d8e8', style:'mini', acc:['headset'] }, lines:['oh. oh no. i mean. check.', 'is it hot in here? it\'s a freezer.', 'r-raise?'] },
  { name:'VIVI COOLER', style:{ tight:0.4, aggro:0.55, bluff:0.18 }, look:{ color:'#c060ff', style:'sxs', acc:['magnets'], eye:'#ff7ad0' }, lines:['i\'ll raise you a little.', 'bold. i like bold.', 'call. and i\'m watching you.'] }
];
const SEAT_A = [Math.PI/2, Math.PI*0.85, Math.PI*1.18, -Math.PI/2, -Math.PI*0.18, Math.PI*0.15];

export function init(C){
  const { scene, M } = C, B = C.world.batch, A = C.world.anchors.poker;
  const grp = new THREE.Group(); grp.position.set(A.x, 0, A.z); grp.rotation.y = A.ry || 0; scene.add(grp);
  const RX = 1.5, RZ = 0.95, topY = 0.8;
  /* felt */
  const fc = canvas(1024, 640), fg = fc.getContext('2d');
  const gr = fg.createRadialGradient(512, 320, 40, 512, 320, 600); gr.addColorStop(0, '#16603a'); gr.addColorStop(1, '#083018'); fg.fillStyle = gr; fg.fillRect(0, 0, 1024, 640);
  fg.strokeStyle = 'rgba(242,210,122,0.8)'; fg.lineWidth = 6; fg.beginPath(); fg.ellipse(512, 320, 360, 210, 0, 0, 7); fg.stroke();
  fg.fillStyle = 'rgba(242,210,122,0.8)'; fg.font = 'bold 40px Georgia, serif'; fg.textAlign = 'center'; fg.fillText("FRIDGE PALACE HOLD'EM", 512, 200); fg.font = '26px Georgia, serif'; fg.fillText('NO LIMIT · BLINDS 10 / 20', 512, 460);
  const felt = new THREE.Mesh(new THREE.CircleGeometry(1, 64), new THREE.MeshStandardMaterial({ map:tex(fc), roughness:0.95 }));
  felt.scale.set(RX, RZ, 1); felt.rotation.x = -Math.PI/2; felt.position.y = topY; grp.add(felt);
  const railPts = []; for(let i=0;i<=64;i++){ const a = i/64*Math.PI*2; railPts.push(new THREE.Vector3(Math.cos(a)*(RX + 0.08), topY + 0.03, Math.sin(a)*(RZ + 0.08))); }
  grp.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(railPts, true), 96, 0.08, 10, true), M.leatherBlack));
  const base = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 0.75, 48), M.woodDark); base.scale.set(RX + 0.05, 1, RZ + 0.05); base.position.y = topY - 0.4; grp.add(base);
  grp.updateMatrixWorld(true);
  C.collide.boxC(A.x, A.z, RX*2 + 0.4, RZ*2 + 0.4, A.ry || 0, 'poker');
  const seatPos = SEAT_A.map(a=>({ a, chair:new THREE.Vector3(Math.cos(a)*(RX + 0.65), 0, Math.sin(a)*(RZ + 0.65)), cards:new THREE.Vector3(Math.cos(a)*RX*0.68, topY + 0.003, Math.sin(a)*RZ*0.68), bet:new THREE.Vector3(Math.cos(a)*RX*0.48, topY + 0.003, Math.sin(a)*RZ*0.48), stack:new THREE.Vector3(Math.cos(a)*RX*0.82, topY + 0.003, Math.sin(a)*RZ*0.82) }));
  seatPos.forEach((s, i)=>{ if(i === 0) return; const w = s.chair.clone().applyMatrix4(grp.matrixWorld); chair(B, M, w.x, w.z, Math.atan2(-(w.x - A.x), -(w.z - A.z)) + Math.PI, M.leatherRed); });
  { const w = seatPos[0].chair.clone().applyMatrix4(grp.matrixWorld); chair(B, M, w.x, w.z, Math.PI, M.leatherRed); }
  /* dealer at the far side */
  const dealer = makeFridge({ face:true, arms:true, color:'#121214', acc:['bowtie', 'vest'], vest:'#7a1220', eye:'#ffd56a', style:'std' });
  dealer.group.position.set(0, 0, -(RZ + 0.62)); grp.add(dealer.group); dealer.name = 'DEALER'; C.staff.push(dealer);
  const button = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.008, 24), new THREE.MeshStandardMaterial({ map:(()=>{ const c = canvas(128, 128), g = c.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, 128, 128); g.fillStyle = '#111'; g.font = 'bold 54px Georgia'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('D', 64, 68); return tex(c); })() }));
  grp.add(button);
  const deckPos = new THREE.Vector3(0.0, topY + 0.02, -RZ*0.55);

  /* the regulars */
  const seats = [null, null, null, null, null, null];
  function seatNPC(i){
    const pool = ROSTER.filter(r=>!seats.some(s=>s && s.r === r));
    const r = pick(pool);
    const F = makeFridge(Object.assign({ face:true, arms:true }, r.look));
    const cp = seatPos[i].chair; F.group.position.set(cp.x, 0.08, cp.z); F.group.rotation.y = Math.atan2(-cp.x, -cp.z); F.group.scale.setScalar(0.9);
    grp.add(F.group); F.seed = Math.random()*9; C.staff.push(F);
    const p = { i, r, name:r.name, F, stack:Math.round(rand(1200, 3600)/10)*10, npc:true, objs:[] };
    p.stackMesh = null; seats[i] = p; drawStack(p);
    return p;
  }
  function removeNPC(p){ grp.remove(p.F.group); const k = C.staff.indexOf(p.F); if(k >= 0) C.staff.splice(k, 1); if(p.stackMesh) grp.remove(p.stackMesh); seats[p.i] = null; }
  [1, 2, 4, 5].forEach(i=>seatNPC(i));
  if(Math.random() < 0.6) seatNPC(3);
  function drawStack(p){ if(p.stackMesh) grp.remove(p.stackMesh); if(p.stack <= 0){ p.stackMesh = null; return; } const st = chipStack(p.stack, { per:14 }); st.scale.setScalar(1.3); st.position.copy(seatPos[p.i].stack); st.rotation.y = -seatPos[p.i].a; grp.add(st); p.stackMesh = st; }

  let G = null;   // the current session
  const ipos = new THREE.Vector3(0, 1.1, RZ + 0.7).applyMatrix4(grp.matrixWorld);
  C.world.interact.push({ pos:ipos, r:2.8, text:()=>"sit down for hold'em · blinds 10/20", use:()=>sit() });

  function sit(){
    C.input.quietUnlock();
    const max = Math.min(MAXBUY, C.save.chips);
    if(max < MINBUY){ C.hud.say('DEALER', 'minimum buy in is ' + MINBUY + '. the cage is by the door.'); return; }
    const b = C.hud.modal({ title:"HOLD'EM · BUY IN", html:`<p style="text-align:center">no limit · blinds 10/20 · buy in ${MINBUY} to ${C.fmt(MAXBUY)}</p><div class="fp-row"><input type="range" min="${MINBUY}" max="${max}" step="20" value="${Math.min(max, 1000)}" id="pk-buy" class="pk-raise"><b id="pk-bv" class="fp-big2" style="font-size:22px">${Math.min(max, 1000)}</b></div><div class="fp-row"><button class="fp-gold" data-a="go">TAKE A SEAT</button></div><p class="fp-dim" style="text-align:center">your stack goes back to your wallet when you stand up. the house rakes 5% of pots that see a flop (max 30).</p>` });
    const r = b.querySelector('#pk-buy'); r.oninput = ()=>{ b.querySelector('#pk-bv').textContent = r.value; };
    b.querySelector('[data-a="go"]').onclick = ()=>{
      const buy = +r.value; if(!C.save.bet(buy, 'poker buy-in')){ C.audio.error(); return; }
      C.hud.modal(null);
      const me = { i:0, name:'YOU', stack:buy, you:true, objs:[] }; seats[0] = me; drawStack(me);
      G = { me, button:Math.floor(Math.random()*6), hands:0, busy:false, log:[], board:[], boardObjs:[], waiting:null, leaving:false };
      const cam = new THREE.Vector3(0, 1.6, RZ + 0.95).applyMatrix4(grp.matrixWorld), look = new THREE.Vector3(0, topY, -0.1).applyMatrix4(grp.matrixWorld);
      const cw = seatPos[0].chair.clone().applyMatrix4(grp.matrixWorld); C.player.pos.set(cw.x, 0, cw.z); C.player.yaw = (A.ry || 0);
      C.sit(cam, look, exit);
      dealer.face.say(1); C.hud.say('DEALER', 'welcome to the game. ' + seats.filter(s=>s && s.npc).length + ' regulars tonight.');
      ui(); setTimeout(()=>loop(), 900);
    };
  }
  function exit(){
    if(!G) return;
    if(G.busy && G.inHand){ G.leaving = true; C.hud.toast('you fold and stand up after this hand'); if(G.waiting){ const r = G.waiting; G.waiting = null; r({ t:'fold' }); } ui(); return; }
    standUp();
  }
  function standUp(){
    const me = G.me; if(me.stack > 0) C.save.pay(me.stack, 'poker cash out'); C.save.d.stats.won -= me.stack; if(me.stackMesh) grp.remove(me.stackMesh); seats[0] = null;
    clearTable(); G = null; C.standUp();
  }
  function clearTable(){ seats.forEach(p=>{ if(p){ p.objs.forEach(o=>grp.remove(o)); p.objs = []; if(p.betMesh){ grp.remove(p.betMesh); p.betMesh = null; } } }); if(G){ G.boardObjs.forEach(o=>grp.remove(o)); G.boardObjs = []; } if(potMesh){ grp.remove(potMesh); potMesh = null; } }
  let potMesh = null;
  function drawPot(){ if(potMesh) grp.remove(potMesh); potMesh = null; if(G.pot > 0){ potMesh = chipStack(G.pot, { per:16 }); potMesh.scale.setScalar(1.3); potMesh.position.set(-0.05, topY + 0.003, 0.12); grp.add(potMesh); } }
  function drawBet(p){ if(p.betMesh){ grp.remove(p.betMesh); p.betMesh = null; } if(p.bet > 0){ const st = chipStack(p.bet); st.scale.setScalar(1.3); st.position.copy(seatPos[p.i].bet); grp.add(st); p.betMesh = st; } }
  async function dealTo(p, k, faceUp){
    const id = G.deck.pop(); p.hole.push(id);
    const card = makeCard(id); card.scale.setScalar(1.5); setCardFace(card, false);
    card.position.copy(deckPos); grp.add(card); p.objs.push(card);
    const s = seatPos[p.i], side = new THREE.Vector3(-Math.sin(s.a), 0, Math.cos(s.a));
    const to = s.cards.clone().addScaledVector(side, (k - 0.5)*0.1).setY(topY + 0.003 + k*0.001);
    C.audio.card(null);
    await C.tweens.to(card, { pos:to, dur:0.25, arc:0.05, update:kk=>{ card.rotation.y = (Math.PI/2 - s.a)*kk; } });
    if(faceUp){ C.audio.flip(null); await C.tweens.add({ dur:0.2, update:kk=>{ card.rotation.z = Math.PI*(1 - kk); } }); }
    return card;
  }
  async function burnAndBoard(n){
    G.deck.pop();
    for(let k=0;k<n;k++){
      const id = G.deck.pop(); G.board.push(id);
      const card = makeCard(id); card.scale.setScalar(1.6); setCardFace(card, false); card.position.copy(deckPos); grp.add(card); G.boardObjs.push(card);
      const idx = G.board.length - 1;
      C.audio.card(null);
      await C.tweens.to(card, { pos:new THREE.Vector3(-0.24 + idx*0.12, topY + 0.004, -0.12), dur:0.22, arc:0.04 });
      C.tweens.add({ dur:0.2, update:kk=>{ card.rotation.z = Math.PI*(1 - kk); } });
      await C.tweens.sleep(0.12);
    }
  }
  /* ---------- the hand ---------- */
  function active(){ return seats.filter(p=>p && p.stack > 0 || (p && p.inHand)); }
  async function loop(){
    while(G && !G.leaving){
      /* refill empty seats now and then, bust the broke */
      seats.forEach(p=>{ if(p && p.npc && p.stack <= 0){ C.hud.toast(p.name + ' busted and walked off'); removeNPC(p); } });
      if(Math.random() < 0.5){ const empty = [1, 2, 3, 4, 5].filter(i=>!seats[i]); if(empty.length && seats.filter(Boolean).length < 6){ const p = seatNPC(pick(empty)); C.hud.toast(p.name + ' sat down'); } }
      if(G.me.stack <= 0){ C.hud.say('DEALER', 'you\'re out of chips. buy back in at the cage.'); await C.tweens.sleep(1.5); standUp(); return; }
      if(seats.filter(p=>p && p.stack > 0).length < 2){ await C.tweens.sleep(1); continue; }
      await hand();
      if(!G) return;
      await C.tweens.sleep(1.2);
    }
    if(G && G.leaving) standUp();
  }
  async function hand(){
    G.busy = true; G.inHand = true; G.hands++; C.save.d.stats.pokerHands++;
    const players = seats.filter(p=>p && p.stack > 0);
    players.forEach(p=>{ p.hole = []; p.folded = false; p.allin = false; p.bet = 0; p.put = 0; p.inHand = true; p.acted = false; p.showed = false; });
    const order = i=>{ const out = []; for(let k=1;k<=6;k++){ const p = seats[(i + k) % 6]; if(p && p.inHand) out.push(p); } return out; };
    /* move the button */
    do{ G.button = (G.button + 1) % 6; }while(!(seats[G.button] && seats[G.button].inHand));
    const bpos = seatPos[G.button].bet.clone().lerp(seatPos[G.button].cards, 0.5).add(new THREE.Vector3(0.12, 0.004, 0)); C.tweens.to(button, { pos:bpos, dur:0.4 });
    G.deck = []; for(let i=0;i<52;i++) G.deck.push(i); for(let i=51;i>0;i--){ const j = fair(i + 1); [G.deck[i], G.deck[j]] = [G.deck[j], G.deck[i]]; }
    G.board = []; G.boardObjs.forEach(o=>grp.remove(o)); G.boardObjs = []; G.pot = 0; G.street = 'preflop'; drawPot();
    const seq = order(G.button);
    const heads = seq.length === 2;
    const sbP = heads ? seats[G.button] : seq[0], bbP = heads ? seq[0] : seq[1];
    post(sbP, SB); post(bbP, BB);
    G.cur = BB; G.minRaise = BB;
    log((sbP.you ? 'you post' : sbP.name + ' posts') + ' 10, ' + (bbP.you ? 'you post' : bbP.name + ' posts') + ' 20');
    C.audio.shuffle(null); await C.tweens.sleep(0.7);
    for(let k=0;k<2;k++) for(const p of seq) await dealTo(p, k, !!p.you);
    ui();
    /* preflop: first to act is left of the big blind */
    const first = heads ? seats[G.button] : order(bbP.i)[0];
    if(!await round(first)) return finish();
    for(const [st, n] of [['flop', 3], ['turn', 1], ['river', 1]]){
      collect(); G.street = st; await burnAndBoard(n); ui();
      if(players.filter(p=>!p.folded && !p.allin).length >= 2){ G.cur = 0; G.minRaise = BB; players.forEach(p=>{ p.acted = false; }); if(!await round(order(G.button)[0])) return finish(); }
      else await C.tweens.sleep(0.6);
    }
    collect();
    await showdown();
    finish();
  }
  function post(p, amt){ const a = Math.min(amt, p.stack); p.stack -= a; p.bet += a; p.put += a; if(p.stack === 0) p.allin = true; drawBet(p); drawStack(p); C.audio.chip(null, 1); }
  function collect(){ seats.forEach(p=>{ if(p && p.inHand){ G.pot += p.bet; p.bet = 0; drawBet(p); } }); drawPot(); C.audio.chipStack(null); }
  /* one betting round. returns false if the hand ended because everyone folded */
  async function round(startP){
    let idx = seats.indexOf(startP), guard = 0;
    while(guard++ < 80){
      if(!G) return false;
      const live = seats.filter(p=>p && p.inHand && !p.folded);
      if(live.length === 1){ return false; }
      const need = live.filter(p=>!p.allin && (!p.acted || p.bet < G.cur));
      if(!need.length) return true;
      const p = seats[idx % 6]; idx++;
      if(!p || !p.inHand || p.folded || p.allin) continue;
      if(p.acted && p.bet >= G.cur) continue;
      G.toAct = p; ui();
      const a = p.you ? await yourMove(p) : await npcMove(p);
      if(!G) return false;
      apply(p, a);
      G.toAct = null; ui();
    }
    return true;
  }
  function apply(p, a){
    const toCall = G.cur - p.bet;
    if(a.t === 'fold'){ p.folded = true; log((p.you ? 'you fold' : p.name + ' folds')); foldCards(p); }
    else if(a.t === 'check'){ log((p.you ? 'you check' : p.name + ' checks')); C.audio.tone && C.audio.tone({ f:300, d:0.05, g:0.05, type:'sine' }); }
    else if(a.t === 'call'){ const amt = Math.min(toCall, p.stack); p.stack -= amt; p.bet += amt; p.put += amt; if(p.stack === 0) p.allin = true; log((p.you ? 'you call ' : p.name + ' calls ') + amt + (p.allin ? ' (all in)' : '')); drawBet(p); drawStack(p); C.audio.chip(null, 2); }
    else if(a.t === 'raise'){
      const to = Math.min(a.to, p.bet + p.stack);
      const amt = to - p.bet; p.stack -= amt; p.bet = to; p.put += amt; if(p.stack === 0) p.allin = true;
      if(to - G.cur >= G.minRaise){ G.minRaise = to - G.cur; seats.forEach(q=>{ if(q && q !== p) q.acted = false; }); }
      else if(to > G.cur){ seats.forEach(q=>{ if(q && q !== p && q.bet < to) q.acted = false; }); }
      G.cur = Math.max(G.cur, to);
      log((p.you ? 'you ' : p.name + ' ') + (G.street === 'preflop' || G.cur > to - amt ? 'raise' : 'bet') + ' to ' + to + (p.allin ? ' (all in)' : ''));
      drawBet(p); drawStack(p); C.audio.chip(null, 4);
      if(p.npc && p.allin){ p.F.face.set('angry', 2); }
    }
    p.acted = true;
  }
  function foldCards(p){ p.objs.forEach(o=>C.tweens.to(o, { pos:deckPos.clone().add(new THREE.Vector3(0.3, 0, 0)), dur:0.3 })); setTimeout(()=>{ p.objs.forEach(o=>grp.remove(o)); p.objs = []; }, 350); }
  function yourMove(p){
    if(G.leaving) return Promise.resolve({ t:'fold' });
    return new Promise(res=>{ G.waiting = res; ui(); });
  }
  async function npcMove(p){
    await C.tweens.sleep(rand(0.6, 1.5));
    if(!G) return { t:'fold' };
    const st = p.r.style, toCall = G.cur - p.bet;
    const live = seats.filter(q=>q && q.inHand && !q.folded && q !== p);
    let eq = equity(p.hole, G.board, Math.max(1, live.length), G.board.length ? 220 : 140);
    if(st.aceOnly && G.street === 'preflop'){ const hasA = p.hole.some(id=>id % 13 === 0); if(!hasA) return toCall ? { t:'fold' } : { t:'check' }; return { t:'raise', to:p.bet + p.stack }; }
    const potOdds = toCall/(G.pot + seats.reduce((s, q)=>s + (q ? q.bet : 0), 0) + toCall || 1);
    const noise = rand(-0.06, 0.06);
    const strength = eq + noise - st.tight*0.08;
    const bluff = Math.random() < st.bluff;
    const potNow = G.pot + seats.reduce((s, q)=>s + (q ? q.bet : 0), 0);
    if(st.tell && strength > 0.6) p.F.face.set('shock', 1.2);
    let act;
    if(toCall === 0){
      if(strength > 0.62 - st.aggro*0.15 || bluff){ const size = Math.round((potNow*rand(0.45, 1.0)*(0.7 + st.aggro*0.6))/10)*10; act = { t:'raise', to:Math.max(G.cur + G.minRaise, p.bet + Math.max(BB, size)) }; }
      else act = { t:'check' };
    } else {
      const callable = strength > potOdds + 0.05 - (st.sticky || 0)*0.2;
      if(strength > 0.72 - st.aggro*0.12 || (bluff && toCall < p.stack*0.3)){ const size = Math.round((potNow*rand(0.6, 1.2)*(0.7 + st.aggro*0.5))/10)*10; act = { t:'raise', to:Math.max(G.cur + G.minRaise, G.cur + size) }; }
      else if(callable) act = { t:'call' };
      else act = { t:'fold' };
    }
    if(act.t === 'raise' && act.to >= p.bet + p.stack*0.85) act.to = p.bet + p.stack;
    if(act.t === 'raise' && p.stack <= toCall) act = { t:'call' };
    if(Math.random() < 0.18){ p.F.face.say(1); C.hud.say(p.name, act.t === 'fold' ? 'fold.' : pick(p.r.lines)); }
    p.F.armBusy = true; p.F.armR.rotation.x = act.t === 'fold' ? -0.3 : -0.8; setTimeout(()=>{ p.F.armBusy = false; }, 400);
    return act;
  }
  async function showdown(){
    const live = seats.filter(p=>p && p.inHand && !p.folded);
    for(const p of live){ if(p.npc){ for(const o of p.objs){ C.tweens.add({ dur:0.2, update:k=>{ o.rotation.z = Math.PI*(1 - k); } }); } C.audio.flip(null); await C.tweens.sleep(0.35); } }
    live.forEach(p=>{ p.score = eval7(p.hole.concat(G.board)); p.showed = true; });
    ui();
  }
  async function finish(){
    collect();
    const all = seats.filter(p=>p && p.inHand);
    const live = all.filter(p=>!p.folded);
    let rake = 0;
    if(G.board.length >= 3){ rake = Math.min(RAKECAP, Math.floor(G.pot*RAKE)); G.pot -= rake; }
    if(live.length === 1){
      const w = live[0]; w.stack += G.pot; log((w.you ? 'you win ' : w.name + ' wins ') + G.pot + (rake ? ' (rake ' + rake + ')' : ''));
      if(w.you){ C.hud.big('+' + C.fmt(G.pot), '#59e08c'); C.audio.chipStack(null); } else w.F.face.set('happy', 2);
    } else {
      live.forEach(p=>{ if(p.score === undefined) p.score = eval7(p.hole.concat(G.board)); });
      const pots = sidePots(all.map(p=>({ id:p.i, put:p.put, folded:p.folded })));
      /* rake comes out of the main pot */
      if(pots.length && rake) pots[0].amt = Math.max(0, pots[0].amt - rake);
      for(const pt of pots){
        const el = pt.elig.map(i=>seats[i]); const best = Math.max(...el.map(p=>p.score)); const ws = el.filter(p=>p.score === best);
        const share = Math.floor(pt.amt/ws.length); ws.forEach((p, k)=>{ p.stack += share + (k === 0 ? pt.amt - share*ws.length : 0); });
        log(ws.map(p=>p.you ? 'you' : p.name).join(' & ') + ' win' + (ws.length === 1 && !ws[0].you ? 's' : '') + ' ' + pt.amt + ' with ' + describe(best));
        if(ws.some(p=>p.you)){ C.hud.big('+' + C.fmt(Math.floor(pt.amt/ws.length)), '#59e08c'); C.audio.chipStack(null); if(pt.amt > 1500) C.bus.emit('cheer', { pos:grp.position.clone(), big:pt.amt > 5000 }); }
        ws.forEach(p=>{ if(p.npc) p.F.face.set('money', 2); });
        el.filter(p=>!ws.includes(p)).forEach(p=>{ if(p.npc) p.F.face.set('sad', 2); });
      }
    }
    G.pot = 0; drawPot();
    seats.forEach(p=>{ if(p){ drawStack(p); p.inHand = false; } });
    G.busy = false; G.inHand = false; G.toAct = null;
    ui();
    await C.tweens.sleep(2.2);
    seats.forEach(p=>{ if(p){ p.objs.forEach(o=>grp.remove(o)); p.objs = []; } });
    G && G.boardObjs.forEach(o=>grp.remove(o)); if(G) G.boardObjs = [];
  }
  function log(t){ if(!G) return; G.log.unshift(t); if(G.log.length > 6) G.log.length = 6; }

  /* ---------- the panel ---------- */
  const cardHtml = (id, hide)=>{ if(hide) return '<span class="pk-card back">??</span>'; const r = RANKS[id % 13], s = '♠♥♦♣'[Math.floor(id/13)]; return `<span class="pk-card ${Math.floor(id/13) === 1 || Math.floor(id/13) === 2 ? 'r' : ''}">${r}${s}</span>`; };
  function ui(){
    if(!G) return;
    const me = G.me, toCall = Math.max(0, (G.cur || 0) - (me.bet || 0));
    const mine = G.waiting && G.toAct === me;
    const minTo = Math.min(me.bet + me.stack, (G.cur || 0) + (G.minRaise || BB));
    const maxTo = me.bet + me.stack;
    const seatsHtml = seats.map((p, i)=>{ if(!p) return ''; const cls = (G.toAct === p ? 'act' : '') + (p.folded || (!p.inHand && G.inHand) ? ' out' : ''); const cards = p.hole && p.inHand ? (p.you || p.showed ? p.hole.map(id=>cardHtml(id)).join('') : (p.folded ? '' : cardHtml(0, true) + cardHtml(0, true))) : ''; return `<div class="pk-seat ${cls}"><b>${p.you ? 'YOU' : p.name}${G.button === i ? ' Ⓓ' : ''}</b><div>${C.fmt(p.stack)}${p.bet ? ' · bet ' + p.bet : ''}${p.allin ? ' · ALL IN' : ''}</div><div class="pk-c">${cards}</div></div>`; }).join('');
    const html = `<div class="fp-ptitle">HOLD'EM · 10/20<span class="sp"></span><small>hand ${G.hands} · pot ${C.fmt((G.pot || 0) + seats.reduce((s, q)=>s + (q ? q.bet || 0 : 0), 0))}</small><button data-a="exit">${G.leaving ? 'LEAVING…' : 'STAND UP'}</button></div>
      <div class="pk-seats">${seatsHtml}</div>
      <div class="fp-row">board: ${G.board.length ? G.board.map(id=>cardHtml(id)).join('') : '<span class="fp-dim">-</span>'}${me.hole && me.hole.length === 2 && G.board.length >= 3 && me.inHand ? '<span class="fp-dim" style="margin-left:10px">you have ' + describe(eval7(me.hole.concat(G.board))) + '</span>' : ''}</div>
      ${mine ? `<div class="fp-row"><button data-a="fold" class="fp-red">FOLD</button><button data-a="cc" class="fp-green">${toCall ? 'CALL ' + Math.min(toCall, me.stack) : 'CHECK'}</button>${maxTo > G.cur ? `<input type="range" class="pk-raise" id="pk-r" min="${minTo}" max="${maxTo}" step="10" value="${minTo}"><button data-a="raise" class="fp-gold" id="pk-rb">${G.cur ? 'RAISE TO' : 'BET'} ${minTo}</button><button data-a="pot">POT</button><button data-a="allin">ALL IN</button>` : ''}</div>` : `<div class="fp-row fp-dim">${G.toAct ? (G.toAct.you ? '' : G.toAct.name + ' is thinking') : (G.inHand ? '' : 'next hand in a moment')}</div>`}
      <div class="fp-dim" style="text-align:center;font-size:12px">${G.log.slice(0, 3).join(' · ')}</div>`;
    const p = C.hud.panel(html, 'fp-pkpanel');
    p.querySelector('[data-a="exit"]').onclick = exit;
    if(mine){
      const done = a=>{ const r = G.waiting; G.waiting = null; r(a); };
      p.querySelector('[data-a="fold"]').onclick = ()=>done({ t:'fold' });
      p.querySelector('[data-a="cc"]').onclick = ()=>done(toCall ? { t:'call' } : { t:'check' });
      const r = p.querySelector('#pk-r');
      if(r){
        r.oninput = ()=>{ p.querySelector('#pk-rb').textContent = (G.cur ? 'RAISE TO ' : 'BET ') + r.value; };
        p.querySelector('[data-a="raise"]').onclick = ()=>done({ t:'raise', to:+r.value });
        p.querySelector('[data-a="allin"]').onclick = ()=>done({ t:'raise', to:maxTo });
        p.querySelector('[data-a="pot"]').onclick = ()=>{ const pot = G.pot + seats.reduce((s, q)=>s + (q ? q.bet : 0), 0) + toCall; const to = Math.max(minTo, Math.min(maxTo, G.cur + pot)); r.value = to; r.oninput(); };
      }
    }
  }
  return { name:'poker', update(){} };
}
