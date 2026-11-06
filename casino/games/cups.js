/* ============================================================
   FRIDGE PALACE: three cup nicky
   a mini fridge on a milk crate runs a cup-and-ball game on a
   cardboard box by the restrooms. the palace says he doesn't work
   here. follow the ball, pick the cup, even money.
   the shuffle is real: if you can follow it, you win. it gets
   faster every time you win in a row.
   on bigger bets nicky sometimes palms the ball, so it's under
   no cup at all. he has a tell. if you catch him, call him out.
============================================================ */
import * as THREE from '../lib/three.module.min.js';
import { G } from '../world/props.js';
import { makeFridge, bakePainted } from '../world/fridge.js';
import { chipStack, DENOMS } from '../world/cards.js';
import { canvas, tex } from '../world/textures.js';
import { fair, pick, ease } from '../core/util.js';

const MIN = 10, MAX = 1000, RIDE_MAX = 8000;
const CHEAT_FROM = 200, CHEAT_PCT = 22;   /* bets this big get palmed this often (percent) */
const SIDES = ['left', 'middle', 'right'];
const NICKY = {
  hello:['three cup nicky. follow the ball, double your money. easy. too easy. that\'s the problem.', 'step right up. eyes on the ball. not on me. never on me.', 'you got eyes? you got chips? you got a game.'],
  shuffle:['round and round and round she goes...', 'keep up, keep up, keep up.', 'where she stops, nobody knows. i know. i always know.', 'eyes on the ball, friend.', 'faster than a defrost cycle, baby.', 'left, right, left, middle, who\'s counting.'],
  fast:['now we\'re cooking.', 'you\'re good. let\'s see how good.', 'this is the speed i use on tourists.'],
  win:['...sure. lucky.', 'you got good eyes. i hate good eyes.', 'beginner\'s luck. it runs out. it always runs out.', 'aight. aight. go again.'],
  lose:['so close. so so close.', 'the ball does what it wants.', 'that\'s the game, friend.', 'happens to the best of us. mostly to you.'],
  wrongCall:['WHAT. you see a hand in my pocket? no? then pay up.', 'accusing a man of cheating. on his own box. disrespect.', 'empty hands. clean cups. dirty mind. that\'s on you.'],
  caught:['okay. OKAY. how did you see that.', 'that\'s... a different ball. that\'s my backup ball. i can explain.', 'keep your voice down. here. take it. take it and be quiet.'],
  ride:['letting it ride. i like you. i like your money more.', 'double or nothing. the classic. the classic mistake.'],
  big:['big bet. big eyes. let\'s go.', 'oh we\'re doing it like THAT.'],
  shout:['hey. hey you. follow the ball, double your chips.', 'easiest money in the building. ask anybody. don\'t ask security.', 'pssst. three cups. one ball. zero house edge. mostly.', 'you look like somebody with good eyes.'],
  talk:['i\'m not affiliated with the palace. the palace says that a lot. i say it louder.', 'my cousin runs the same game in the parking garage. he\'s worse at it. i\'m the good cousin.', 'i stand on a crate because the box is too tall. don\'t make it a thing.', 'the restrooms are painted on. i know. i tried. everybody tries.', 'security? we got an understanding. i understand where they are.'],
  offended:['nah. not right now. you hurt me.', 'come back when you got some manners.']
};

function signTex(lines, o){
  const c = canvas(512, 256), g = c.getContext('2d');
  g.fillStyle = '#b8894e'; g.fillRect(0, 0, 512, 256);
  const id = g.getImageData(0, 0, 512, 256), d = id.data; for(let i=0;i<d.length;i+=4){ const n = (Math.random() - 0.5)*18; d[i] += n; d[i+1] += n; d[i+2] += n*0.8; } g.putImageData(id, 0, 0);
  g.strokeStyle = 'rgba(80,50,20,0.4)'; g.lineWidth = 2; for(let x=8; x<512; x+=11){ g.beginPath(); g.moveTo(x, 0); g.lineTo(x, 256); g.stroke(); }
  g.textAlign = 'center'; g.textBaseline = 'middle';
  lines.forEach(([t, size, col, y])=>{ g.fillStyle = col || '#1a1008'; g.font = 'bold ' + size + 'px "Comic Sans MS", "Marker Felt", cursive'; g.save(); g.translate(256, y); g.rotate((Math.random() - 0.5)*0.05); g.fillText(t, 0, 0); g.restore(); });
  return tex(c);
}

export function init(C){
  const { scene, M } = C;
  const A = { x:-23, z:8.8, ry:Math.PI/2 };
  const grp = new THREE.Group(); grp.position.set(A.x, 0, A.z); grp.rotation.y = A.ry; scene.add(grp); grp.updateMatrixWorld(true);
  const W2 = v=>v.clone().applyMatrix4(grp.matrixWorld);
  const topY = 0.74;
  const S = C.save.d.stats;
  if(S.cupsPlayed === undefined){ S.cupsPlayed = 0; S.cupsWon = 0; S.cupsBest = 0; S.cupsCaught = 0; }
  /* ---------- the setup: a box, a crate, a sign ---------- */
  const card = new THREE.MeshStandardMaterial({ color:0xb8894e, roughness:0.95 });
  const stat = new THREE.Group(); grp.add(stat);
  const box = new THREE.Mesh(G.box, card); box.scale.set(0.66, topY, 0.46); box.position.y = topY/2; stat.add(box);
  const flapM = new THREE.MeshStandardMaterial({ color:0xa07440, roughness:0.95 });
  [[-0.36, 0], [0.36, 0]].forEach(([x])=>{ const f = new THREE.Mesh(G.box, flapM); f.scale.set(0.08, 0.01, 0.44); f.position.set(x, topY - 0.02, 0); f.rotation.z = x < 0 ? 0.6 : -0.6; stat.add(f); });
  const tape = new THREE.Mesh(G.box, new THREE.MeshStandardMaterial({ color:0xc8b890, roughness:0.5 })); tape.scale.set(0.06, 0.3, 0.004); tape.position.set(-0.24, topY - 0.15, 0.231); stat.add(tape);
  /* a scrap of green felt so the cups have something to slide on */
  const crate = new THREE.Mesh(G.box, new THREE.MeshStandardMaterial({ color:0x2a6ad0, roughness:0.6 })); crate.scale.set(0.46, 0.3, 0.4); crate.position.set(0, 0.15, -0.55); stat.add(crate);
  bakePainted(stat);
  const felt = new THREE.Mesh(new THREE.PlaneGeometry(0.56, 0.32), new THREE.MeshStandardMaterial({ color:0x1d5a32, roughness:1 })); felt.rotation.x = -Math.PI/2; felt.position.set(0, topY + 0.004, 0.02); grp.add(felt);
  const sign = new THREE.Mesh(new THREE.PlaneGeometry(0.62, 0.31), new THREE.MeshStandardMaterial({ map:signTex([['THREE CUP NICKY', 46, '#8a1010', 52], ['find the ball · even money', 30, '#1a1008', 112], ['NOT AFFILIATED WITH', 26, '#1a1008', 166], ['THE PALACE', 34, '#1a1008', 206]]), roughness:0.9 }));
  sign.position.set(0, 0.42, 0.232); grp.add(sign);
  const gone = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.25), new THREE.MeshStandardMaterial({ map:signTex([['GONE FISHING', 54, '#8a1010', 80], ['not arrested', 40, '#1a1008', 160]]), roughness:0.9 }));
  gone.position.set(0, topY + 0.13, 0.05); gone.rotation.x = -0.35; gone.visible = false; grp.add(gone);
  C.collide.boxC(A.x - 0.15, A.z, 1.0, 0.8, 0, 'hustle');
  /* ---------- nicky ---------- */
  const nicky = makeFridge({ face:true, arms:true, style:'mini', color:'#3a3a40', trim:'#1a1a1e', acc:['beanie', 'chain'], beanie:'#c0392b', eye:'#5dff9c' });
  nicky.group.position.set(0, 0.3, -0.55); grp.add(nicky.group); nicky.name = 'THREE CUP NICKY'; nicky.seed = 7.7; nicky.custom = true; C.staff.push(nicky);
  /* ---------- cups and the ball ---------- */
  const cupM = new THREE.MeshStandardMaterial({ color:0xd0182a, roughness:0.35 });
  const rimM = new THREE.MeshStandardMaterial({ color:0xf2f2f2, roughness:0.4 });
  const cupG = new THREE.CylinderGeometry(0.034, 0.048, 0.1, 22);
  const rimG = new THREE.TorusGeometry(0.047, 0.005, 6, 22);
  const slotX = i=>(i - 1)*0.16, CZ = 0.03, CY = topY + 0.052;
  const cups = [0, 1, 2].map(i=>{ const m = new THREE.Mesh(cupG, cupM); const r = new THREE.Mesh(rimG, rimM); r.rotation.x = Math.PI/2; r.position.y = -0.048; m.add(r); m.position.set(slotX(i), CY, CZ); m.userData.slot = i; m.userData.idx = i; grp.add(m); return m; });
  const ball = new THREE.Mesh(new THREE.SphereGeometry(0.019, 14, 10), new THREE.MeshStandardMaterial({ color:0xffd21a, roughness:0.3, emissive:0x3a2a00 }));
  ball.position.set(0, topY + 0.023, CZ); grp.add(ball);
  const cupAt = s=>cups.find(c=>c.userData.slot === s);
  let stakeMesh = null;
  function setStake(n){ if(stakeMesh){ grp.remove(stakeMesh); stakeMesh = null; } if(n > 0){ stakeMesh = chipStack(n); stakeMesh.scale.setScalar(1.1); stakeMesh.position.set(0.22, topY + 0.004, 0.17); grp.add(stakeMesh); } }

  let cur = null, ballCup = 1, palmed = false, offendedUntil = 0, honest = 0, shoutT = 8, closed = false;
  const say = (k, dur)=>{ const line = Array.isArray(k) ? pick(k) : k; nicky.face.say(Math.min(4, line.length*0.05)); C.hud.say('THREE CUP NICKY', line, dur); };
  const ipos = W2(new THREE.Vector3(0, 1.1, 0.7));
  C.world.interact.push({ pos:ipos, r:2.4, enabled:()=>!closed, text:()=>C.engine && performance.now() < offendedUntil ? 'nicky isn\'t talking to you' : 'play cup and ball · ' + MIN + '–' + MAX.toLocaleString(), use:()=>sit() });
  C.world.interact.push({ pos:W2(new THREE.Vector3(0, 1.3, -0.55)), r:2.3, enabled:()=>!cur && !closed, text:()=>'talk to three cup nicky', use:()=>{ nicky.face.set('happy', 2); say(performance.now() < offendedUntil ? NICKY.offended : NICKY.talk); } });

  /* ---------- sitting (well, standing) ---------- */
  function sit(){
    if(cur) return;
    if(performance.now() < offendedUntil){ nicky.face.set('angry', 2); say(NICKY.offended); return; }
    /* high and back, so the cups sit above the panel and nicky's face stays in the shot (you'll want to see it) */
    const camPos = W2(new THREE.Vector3(0, 1.6, 1.05)), look = W2(new THREE.Vector3(0, 1.01, 0.24));
    const sw = W2(new THREE.Vector3(0, 0, 1.0));
    C.player.pos.set(sw.x, 0, sw.z); C.player.yaw = Math.atan2(-(look.x - sw.x), -(look.z - sw.z));
    cur = { state:'bet', stake:0, chip:25, streak:0, lastStake:0, busy:false, msg:'place a bet', ride:false };
    C.sit(camPos, look, exit);
    nicky.face.set('happy', 1.5); say(NICKY.hello, 5);
    resetCups(); ui();
  }
  function exit(){
    if(!cur || cur.busy) return;
    if(cur.state === 'pick'){ msg('pick a cup first. or call him out.'); return; }
    if(cur.stake > 0) C.save.refund(cur.stake);
    setStake(0); cur = null; C.standUp();
  }
  function resetCups(){ cups.forEach((c, i)=>{ c.userData.slot = i; c.position.set(slotX(i), CY, CZ); c.rotation.set(0, 0, 0); }); ballCup = 1; palmed = false; ball.visible = true; }

  /* ---------- the hustle ---------- */
  const level = ()=>Math.min(7, cur.streak + (cur.stake >= 400 ? 1 : 0));
  async function lift(c, up){ const y0 = c.position.y; await C.tweens.add({ dur:0.28, ease:ease.out, update:k=>{ const kk = up ? k : 1 - k; c.position.y = CY + kk*0.13; c.rotation.x = -kk*0.5; } }); if(!up) c.position.y = CY; }
  async function play(){
    if(!cur || cur.state !== 'bet' || cur.busy) return;
    if(cur.stake < MIN){ msg('minimum bet is ' + MIN); C.audio.error(); return; }
    cur.busy = true; cur.lastStake = cur.stake; cur.cheat = false; S.cupsPlayed++;
    if(cur.stake >= 600) say(NICKY.big, 2);
    /* show the ball */
    resetCups();
    const start = fair(3); ballCup = cups.findIndex(c=>c.userData.slot === start);
    const c0 = cups[ballCup];
    cur.state = 'show'; ui(); msg('watch the ball.');
    nicky.armBusy = true; nicky.armR.rotation.x = -1.0;
    await lift(c0, true); C.audio.tone({ f:520, type:'sine', d:0.08, g:0.03 });
    await C.tweens.sleep(0.75);
    await lift(c0, false); C.audio.burst({ ff:900, q:1.5, d:0.05, g:0.12 });
    nicky.armR.rotation.x = 0;
    /* shuffle */
    cur.state = 'shuffle'; ui();
    const L = level(), moves = 5 + L*2, dur = Math.max(0.15, 0.42 - L*0.04);
    msg(L >= 3 ? 'he speeds up.' : 'round and round...');
    if(L >= 3) say(NICKY.fast, 2); else say(NICKY.shuffle, 2.5);
    const cheat = honest <= 0 && cur.stake >= CHEAT_FROM && fair(100) < CHEAT_PCT;
    const cheatAt = cheat ? 1 + fair(Math.max(1, moves - 2)) : -1;
    for(let i=0;i<moves;i++){
      if(!cur) return;
      if(i === cheatAt) tell();
      if(L >= 2 && fair(4) === 0) await feint(dur);
      else await swap(dur);
    }
    if(!cur) return;
    if(honest > 0) honest--;
    nicky.armL.rotation.x = 0; nicky.armR.rotation.x = 0; nicky.armBusy = false;
    cur.cheat = cheat;
    cur.state = 'pick'; cur.busy = false; ui();
    msg('where\'s the ball?');
    say(pick(['pick a cup. any cup. one cup.', 'go on. which one.', 'take your time. or don\'t.']), 2.5);
  }
  /* two cups trade places: one passes in front, one behind */
  async function swap(dur){
    const a = fair(3); let b = fair(2); if(b >= a) b++;
    const ca = cupAt(a), cb = cupAt(b), xa = slotX(a), xb = slotX(b);
    nicky.armL.rotation.x = -1.1; nicky.armR.rotation.x = -1.1;
    C.audio.burst({ ff:700 + Math.random()*300, q:1.2, d:dur*0.6, g:0.05 });
    await C.tweens.add({ dur, ease:ease.inOut, update:k=>{
      const s = Math.sin(k*Math.PI);
      ca.position.x = xa + (xb - xa)*k; ca.position.z = CZ + s*0.08;
      cb.position.x = xb + (xa - xb)*k; cb.position.z = CZ - s*0.08;
      nicky.armL.rotation.z = -0.3 - s*0.3; nicky.armR.rotation.z = 0.3 + s*0.3;
    } });
    ca.userData.slot = b; cb.userData.slot = a;
  }
  /* a cup starts to move and doesn't */
  async function feint(dur){
    const a = fair(3), b = a === 1 ? (fair(2) ? 0 : 2) : 1;
    const ca = cupAt(a), xa = slotX(a), xb = slotX(b);
    await C.tweens.add({ dur:dur*0.9, ease:ease.inOut, update:k=>{ const s = Math.sin(k*Math.PI); ca.position.x = xa + (xb - xa)*0.45*s; ca.position.z = CZ + s*0.05; } });
    ca.position.x = xa; ca.position.z = CZ;
  }
  /* the palm: a glance away, a little smirk, his left hand dips, a click. that's the tell */
  function tell(){
    palmed = true; ballCup = -1; ball.visible = false;
    nicky.face.set('smug', 0.35); nicky.face.lookT.x = -1.4; nicky.face.look.x = -1.4;
    C.audio.click && C.tweens.sleep(0.05).then(()=>C.audio.tone({ f:2400, type:'square', d:0.015, g:0.012 }));
    const r0 = nicky.armL.rotation.x;
    C.tweens.add({ dur:0.3, update:k=>{ nicky.armL.rotation.x = r0 - Math.sin(k*Math.PI)*0.7; } });
  }
  async function choose(s){
    if(!cur || cur.state !== 'pick' || cur.busy) return;
    cur.busy = true; cur.state = 'reveal'; ui();
    const c = cupAt(s);
    const right = !palmed && ballCup >= 0 && cups[ballCup] === c;
    await lift(c, true);
    if(right){
      const won = cur.stake*2;
      cur.streak++; S.cupsWon++; S.cupsBest = Math.max(S.cupsBest, cur.streak);
      C.save.pay(won, 'cup and ball', won >= 4000 ? 'cup and ball: +' + C.fmt(won - cur.stake) + ' off three cup nicky' : null);
      C.audio.chipStack(grp.position); C.fx.coins(W2(new THREE.Vector3(0.2, topY + 0.1, 0.17)), 10 + cur.streak*3);
      C.hud.big('+' + C.fmt(won), '#59e08c', 1500);
      nicky.face.set(cur.streak >= 3 ? 'shock' : 'sad', 2); say(NICKY.win, 2.5);
      if(won >= 2000) C.bus.emit('cheer', { pos:grp.position.clone(), big:won >= 6000 });
      msg('the ' + SIDES[s] + ' cup. you got it. ' + cur.streak + ' in a row. let it ride or take it.');
      cur.pending = won; cur.stake = 0; setStake(0);
      cur.state = 'won';
    } else {
      /* show where it "was" */
      await C.tweens.sleep(0.35);
      let other;
      if(palmed){
        /* he slips it back under one of the others and lifts that one like nothing happened */
        const choices = cups.filter(x=>x !== c); other = choices[fair(2)];
        ballCup = cups.indexOf(other); palmed = false;
        nicky.armL.rotation.x = -0.9; ball.position.x = other.position.x; ball.visible = true;
      } else other = cups[ballCup];
      nicky.armR.rotation.x = -0.9;
      await lift(other, true);
      C.audio.aww(grp.position);
      nicky.face.set('smug', 2); say(NICKY.lose, 2.5);
      msg('it was under the ' + SIDES[other.userData.slot] + ' cup. place a bet.');
      cur.streak = 0; cur.stake = 0; setStake(0);
      await C.tweens.sleep(1.0);
      await Promise.all([lift(c, false), lift(other, false)]);
      nicky.armL.rotation.x = 0; nicky.armR.rotation.x = 0;
      cur.state = 'bet';
    }
    C.save.write();
    cur.busy = false; ui();
  }
  async function callOut(){
    if(!cur || cur.state !== 'pick' || cur.busy) return;
    cur.busy = true; cur.state = 'reveal'; ui();
    if(palmed){
      /* caught him */
      const won = cur.stake*4;
      nicky.face.set('shock', 3); say(NICKY.caught, 4);
      C.hud.big('CAUGHT HIM', '#ffd56a', 2200);
      /* everything comes up empty, and the ball rolls out of his hand */
      await Promise.all(cups.map(c=>lift(c, true)));
      ball.position.set(-0.24, topY + 0.023, -0.12); ball.visible = true;
      nicky.armL.rotation.x = -1.3;
      await C.tweens.to(ball, { pos:new THREE.Vector3(0.0, topY + 0.023, CZ + 0.06), dur:0.6, arc:0.06, ease:ease.out });
      C.save.pay(won, 'cup and ball', 'caught three cup nicky palming the ball: +' + C.fmt(won - cur.stake));
      C.audio.jackpot && C.audio.jackpot(grp.position); C.fx.coins(W2(new THREE.Vector3(0.2, topY + 0.1, 0.17)), 30);
      C.bus.emit('cheer', { pos:grp.position.clone(), big:true });
      S.cupsCaught++; if(C.save.egg('palmed')) C.hud.toast('secret: sleight of hand', 'gold');
      msg('he palmed it. he pays you ' + C.fmt(won) + ' to keep quiet. he swears the next five are clean.');
      honest = 5; palmed = false; ballCup = -1;
      cur.stake = 0; setStake(0); cur.streak = 0;
      await C.tweens.sleep(1.4);
      await Promise.all(cups.map(c=>lift(c, false)));
      nicky.armL.rotation.x = 0;
      resetCups();
      cur.state = 'bet';
    } else {
      /* he wasn't cheating. he is very offended */
      nicky.face.set('angry', 3); say(NICKY.wrongCall, 4);
      await Promise.all(cups.map(c=>lift(c, true)));
      C.audio.aww(grp.position);
      msg('the ball was right there under the ' + SIDES[cups[ballCup].userData.slot] + ' cup. you lose the bet, and he wants a minute.');
      cur.stake = 0; setStake(0); cur.streak = 0;
      await C.tweens.sleep(1.8);
      await Promise.all(cups.map(c=>lift(c, false)));
      offendedUntil = performance.now() + 25000;
      cur.busy = false; cur.state = 'bet';
      C.save.write();
      exit(); return;
    }
    C.save.write();
    cur.busy = false; ui();
  }
  function ride(on){
    if(!cur || cur.state !== 'won') return;
    const amt = cur.pending; cur.pending = 0;
    if(on && amt <= RIDE_MAX){
      /* the winnings go straight back on the box */
      if(!C.save.bet(amt, 'cup and ball')){ msg('not enough chips'); cur.state = 'bet'; ui(); return; }
      cur.stake = amt; setStake(amt); say(NICKY.ride, 2.5); cur.state = 'bet'; ui(); play();
      return;
    }
    cups.forEach(c=>{ if(c.position.y > CY + 0.01) lift(c, false); });
    cur.state = 'bet'; msg('place a bet.'); ui();
  }
  function msg(t){ if(cur) cur.msg = t; const m = C.hud.$('#cb-msg'); if(m) m.textContent = t; }

  /* ---------- the panel ---------- */
  function ui(){
    if(!cur) return;
    let html = `<div class="fp-ptitle">CUP AND BALL<span class="sp"></span><small>${MIN}–${MAX.toLocaleString()} · even money</small><button data-a="rules">RULES</button><button data-a="exit" ${cur.busy || cur.state === 'pick' ? 'disabled' : ''}>STEP AWAY</button></div>`;
    if(cur.state === 'bet'){
      const chips = DENOMS.filter(d=>d.v >= MIN && d.v <= MAX).reverse();
      html += `<div class="fp-row">${chips.map(d=>`<button class="fp-chip ${cur.chip === d.v ? 'sel' : ''}" data-chip="${d.v}" style="background:${d.c};color:${d.s}">${d.v >= 1000 ? d.v/1000 + 'K' : d.v}</button>`).join('')}</div>
        <div class="fp-row"><div class="fp-slotbox"><small>BET</small><b>${C.fmt(cur.stake)}</b></div><div class="fp-slotbox"><small>STREAK</small><b>${cur.streak}</b></div><div class="fp-slotbox"><small>BEST</small><b>${S.cupsBest}</b></div></div>
        <div class="fp-row"><button data-a="add">+ BET</button><button data-a="clear" ${cur.stake ? '' : 'disabled'}>CLEAR</button><button data-a="rebet" ${cur.lastStake ? '' : 'disabled'}>SAME AGAIN</button><button data-a="play" class="fp-gold" ${cur.busy ? 'disabled' : ''}>PLAY</button></div>`;
    } else if(cur.state === 'pick'){
      html += `<div class="fp-row">${SIDES.map((s, i)=>`<button data-pick="${i}" class="fp-gold">${s.toUpperCase()}<small style="display:block;font-size:10px;opacity:.8">${C.input.touch ? 'or tap the cup' : ['A / 1', 'S / 2', 'D / 3'][i]}</small></button>`).join('')}<button data-a="callout" class="fp-red">CALL HIM OUT<small style="display:block;font-size:10px;opacity:.8">${C.input.touch ? 'he cheated' : 'C · he cheated'}</small></button></div>`;
    } else if(cur.state === 'won'){
      html += `<div class="fp-row"><div class="fp-slotbox"><small>WON</small><b>${C.fmt(cur.pending)}</b></div><div class="fp-slotbox"><small>STREAK</small><b>${cur.streak}</b></div>
        <button data-a="ride" class="fp-gold" ${cur.pending > RIDE_MAX ? 'disabled' : ''}>LET IT RIDE<small style="display:block;font-size:10px;opacity:.8">${cur.pending > RIDE_MAX ? 'nicky can\'t cover it' : 'bet ' + C.fmt(cur.pending)}</small></button><button data-a="take">TAKE IT</button></div>`;
    } else {
      html += `<div class="fp-row"><div class="fp-slotbox"><small>BET</small><b>${C.fmt(cur.stake)}</b></div><div class="fp-slotbox"><small>STREAK</small><b>${cur.streak}</b></div><div class="fp-slotbox"><small>SPEED</small><b>${'▮'.repeat(1 + level())}</b></div></div>`;
    }
    html += `<div class="fp-row fp-dim" id="cb-msg">${cur.msg || ''}</div>`;
    if(cur.state === 'bet' && !C.input.touch) html += `<div class="fp-row fp-dim" style="font-size:10px;opacity:.6">space plays</div>`;
    const p = C.hud.panel(html, 'fp-cbpanel');
    p.querySelectorAll('[data-chip]').forEach(b=>b.onclick = ()=>{ cur.chip = +b.dataset.chip; C.audio.click(); ui(); });
    p.querySelectorAll('[data-pick]').forEach(b=>b.onclick = ()=>choose(+b.dataset.pick));
    const on = (k, f)=>{ const b = p.querySelector(`[data-a="${k}"]`); if(b) b.onclick = f; };
    on('exit', exit);
    on('rules', ()=>C.hud.modal({ title:'CUP AND BALL', html:`<p>nicky shows you the ball under one of three cups, then shuffles them. pick the cup with the ball and he pays even money: bet 100, get 200 back.</p><p>the shuffle is real. if you can follow it, you win. every win in a row makes him faster, and bets of 400 or more get the fast hands too. after a win you can let the whole thing ride (up to ${C.fmt(RIDE_MAX)}).</p><p>nicky is not affiliated with the palace. on bets of ${CHEAT_FROM} or more he sometimes palms the ball, and then it isn't under any cup. if you think he did, press CALL HIM OUT instead of picking. catch him and he pays four times your bet to keep you quiet. call it wrong and you lose the bet and he stops talking to you for a bit.</p>` }));
    on('add', ()=>{ const n = Math.min(cur.chip, MAX - cur.stake); if(n <= 0){ msg('max bet is ' + MAX); return; } if(!C.save.bet(n, 'cup and ball')){ msg('not enough chips'); C.audio.error(); return; } cur.stake += n; setStake(cur.stake); C.audio.chip(grp.position, 2); ui(); });
    on('clear', ()=>{ C.save.refund(cur.stake); cur.stake = 0; setStake(0); ui(); });
    on('rebet', ()=>{ const n = Math.min(MAX, cur.lastStake || 0) - cur.stake; if(n > 0){ if(!C.save.bet(n, 'cup and ball')){ msg('not enough chips'); C.audio.error(); return; } cur.stake += n; setStake(cur.stake); C.audio.chip(grp.position, 2); } ui(); });
    on('play', play);
    on('callout', callOut);
    on('ride', ()=>ride(true));
    on('take', ()=>ride(false));
  }
  C.bus.on('key', e=>{
    if(!cur || !C.seated || C.hud.modalOpen) return;
    const k = e.code;
    if(cur.state === 'bet' && (k === 'Space' || k === 'Enter')) play();
    else if(cur.state === 'pick'){
      const map = { KeyA:0, Digit1:0, ArrowLeft:0, KeyS:1, Digit2:1, ArrowDown:1, KeyD:2, Digit3:2, ArrowRight:2 };
      if(k in map) choose(map[k]); else if(k === 'KeyC') callOut();
    } else if(cur.state === 'won'){ if(k === 'KeyR') ride(true); else if(k === 'Space' || k === 'Enter' || k === 'KeyT') ride(false); }
  });
  /* tap or click a cup to pick it */
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
  const dom = C.engine.renderer.domElement;
  const onDown = e=>{
    if(!cur || cur.state !== 'pick' || cur.busy || C.hud.modalOpen) return;
    const r = dom.getBoundingClientRect(); ndc.set(((e.clientX - r.left)/r.width)*2 - 1, -((e.clientY - r.top)/r.height)*2 + 1);
    ray.setFromCamera(ndc, C.camera);
    const hit = ray.intersectObjects(cups, false)[0];
    if(hit) choose(hit.object.userData.slot);
  };
  dom.addEventListener('pointerdown', onDown);

  return { name:'cups', grp, nicky, dispose(){ dom.removeEventListener('pointerdown', onDown); }, _test:{ get palmed(){ return palmed; }, get ballSlot(){ return ballCup >= 0 ? cups[ballCup].userData.slot : -1; }, get cur(){ return cur; }, choose, callOut, play, ride }, update(dt, t){
    /* the ball rides along under whichever cup it's in */
    if(ballCup >= 0 && !palmed){ const c = cups[ballCup]; ball.position.x = c.position.x; ball.position.z = c.position.z; }
    /* the crime scene the morning after: nicky lies low */
    if(!closed && C.heistAftermath && C.heistAftermath.n === 1){ closed = true; nicky.group.visible = false; cups.forEach(c=>c.visible = false); ball.visible = false; gone.visible = true; }
    if(closed) return;
    /* he bobs on his crate */
    if(!cur || cur.state === 'bet'){ nicky.inner.position.y = Math.abs(Math.sin(t*2.2))*0.015; }
    /* and works the room when you walk by */
    if(!cur && !C.seated){ const d = C.camera.position.distanceTo(grp.position); shoutT -= dt; if(d < 5.5 && shoutT <= 0){ shoutT = 22 + Math.random()*15; if(performance.now() > offendedUntil){ nicky.face.set('happy', 2); say(NICKY.shout, 3); } }
      if(d < 6){ const dx = C.camera.position.x - grp.position.x, dz = C.camera.position.z - grp.position.z; const want = Math.atan2(dx, dz) - A.ry; let dy = want - nicky.group.rotation.y; dy = Math.atan2(Math.sin(dy), Math.cos(dy)); nicky.group.rotation.y += dy*Math.min(1, dt*3); } }
    else if(cur) nicky.group.rotation.y *= 0.9;
  } };
}
