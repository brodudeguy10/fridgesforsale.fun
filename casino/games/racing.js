/* ============================================================
   FRIDGE PALACE: the inside track
   six fridges race down a hallway on the big screen. pick one,
   bet on it, watch it lose (or not). odds come from each racer's
   rating with a 15% house margin, and the race is simulated with
   the same ratings, so the odds tell the truth.
============================================================ */
import * as THREE from '../lib/three.module.min.js';
import { canvas, tex } from '../world/textures.js';
import { fair, pick, rand, shuffle } from '../core/util.js';

const NAMES = ['Frost Bite', 'Coolant Comet', 'Mr. Freeze-Dried', 'Defrost Daddy', 'Compressor Kid', 'Ice Ice Maybe', 'Chilly Willy Nilly', 'The Crisper', 'Sub-Zero Hero', 'Butter Shelf', 'Drawer Pull', 'Energy Star', 'Freon Freddy', 'Brr-tney', 'Humming Bird', 'Leftover Larry', 'Magnet Mayhem', 'Cold Brew', 'Snow Patrol Car', 'Gasket Case', 'Thermostat Pat', 'Fridge Over Troubled Water', 'Kelvinator', 'Absolute Zero'];
const COLS = ['#e33a3a', '#3a6fd8', '#ffd400', '#3ddc84', '#ff8a3d', '#c060ff'];
const CALLS = {
  start:['and they\'re off!', 'the doors open and the fridges waddle out!', 'here they come!'],
  lead:['{n} takes the lead!', '{n} out in front!', '{n} pulls ahead, coils humming!', 'it\'s {n} on the inside!'],
  mid:['halfway down the hallway!', 'the crisper drawers are rattling!', 'what a pace! someone get these fridges some water!'],
  close:['{a} and {b} neck and neck!', 'a photo finish brewing between {a} and {b}!'],
  last:['{n} is dead last and seems fine with it.', '{n} has stopped to chill.'],
  win:['{n} wins it!', 'it\'s {n} by a handle!', '{n} crosses first!']
};
function fmtOdds(o){ return o >= 1 ? Math.round(o) + '/1' : '1/' + Math.round(1/o); }

export function init(C){
  const { scene, M } = C, A = C.world.anchors.raceScreen;
  const W = 1024, H = Math.round(1024*A.h/A.w);
  const cv = canvas(W, H), g = cv.getContext('2d'), t = tex(cv, { nomip:true });
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(A.w, A.h), new THREE.MeshBasicMaterial({ map:t, color:0xc8c8c8 }));
  screen.position.set(A.x, A.y, A.z + 0.1); scene.add(screen);
  const frame = new THREE.Mesh(new THREE.BoxGeometry(A.w + 0.3, A.h + 0.3, 0.15), M.blackMatte); frame.position.set(A.x, A.y, A.z); scene.add(frame);
  const goldF = new THREE.Mesh(new THREE.BoxGeometry(A.w + 0.4, 0.08, 0.2), M.gold); goldF.position.set(A.x, A.y + A.h/2 + 0.18, A.z); scene.add(goldF);
  const goldF2 = goldF.clone(); goldF2.position.y = A.y - A.h/2 - 0.18; scene.add(goldF2);
  const vendorMet = (()=>{ try{ return (VENDOR.loadMem().deaths || 0) >= 1; }catch(e){ return false; } })();
  const hankSeen = (()=>{ try{ return VENDOR.sawAny(['wall:hank', 'tag:26']); }catch(e){ return false; } })();
  function field(){
    let pool = NAMES.slice(); if(hankSeen) pool.push("Hank's Return"); if(vendorMet) pool.push("Vendor's Pet");
    shuffle(pool);
    const rs = pool.slice(0, 6).map((name, i)=>({ name, col:COLS[i], rating:rand(0.6, 1.6)*(name === "Vendor's Pet" ? 1.25 : 1), form:Array.from({ length:5 }, ()=>1 + Math.floor(Math.random()*6)).join('-') }));
    /* win chances by quick simulation of the same model the race uses */
    const wins = rs.map(()=>0), N = 4000;
    for(let k=0;k<N;k++){ let best = -1, bi = 0; rs.forEach((r, i)=>{ const v = r.rating + gauss()*0.35; if(v > best){ best = v; bi = i; } }); wins[bi]++; }
    rs.forEach((r, i)=>{ r.p = Math.max(0.01, wins[i]/N); r.odds = Math.max(0.5, (1/(r.p*1.15)) - 1); r.odds = r.odds >= 1 ? Math.round(r.odds) : Math.round(1/r.odds) && 1/Math.round(1/r.odds); });
    return rs;
  }
  function gauss(){ let u = 0, v = 0; while(!u) u = Math.random(); while(!v) v = Math.random(); return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v); }
  let racers = field(), race = null, call = { text:'', t:0 }, acc = 0, time = 0, results = [];
  function draw(){
    g.fillStyle = '#06140c'; g.fillRect(0, 0, W, H);
    if(!race){
      g.fillStyle = '#5dff9c'; g.font = 'bold 44px Georgia, serif'; g.textAlign = 'center'; g.fillText('INSIDE TRACK · NEXT RACE', W/2, 58);
      g.font = '20px Georgia, serif'; g.fillStyle = '#b8e8c8'; g.fillText('place your bet at any terminal', W/2, 88);
      racers.forEach((r, i)=>{ const y = 120 + i*44; g.fillStyle = r.col; g.fillRect(90, y - 24, 30, 30); g.fillStyle = '#fff'; g.font = 'bold 26px Georgia, serif'; g.textAlign = 'left'; g.fillText((i + 1) + '. ' + r.name, 136, y); g.textAlign = 'right'; g.fillStyle = '#ffd56a'; g.fillText(fmtOdds(r.odds), W - 260, y); g.fillStyle = '#88a898'; g.font = '20px Georgia, serif'; g.fillText('form ' + r.form, W - 90, y); });
      if(results.length){ g.fillStyle = '#88a898'; g.font = '18px Georgia, serif'; g.textAlign = 'center'; g.fillText('last winners: ' + results.slice(0, 4).join(' · '), W/2, H - 18); }
    } else {
      /* the hallway */
      const lane = (H - 110)/6, x0 = 60, x1 = W - 60;
      for(let i=0;i<6;i++){ g.fillStyle = i % 2 ? '#2a1a12' : '#33221a'; g.fillRect(0, 70 + i*lane, W, lane); }
      g.fillStyle = 'rgba(255,255,255,0.08)'; for(let x=(-(race.cam*800) % 80 + 80) % 80; x<W; x+=80) g.fillRect(x, 70, 2, lane*6);
      g.fillStyle = '#fff'; g.fillRect(x1, 70, 6, lane*6); g.fillStyle = '#111'; for(let y=70; y<70 + lane*6; y+=12){ g.fillRect(x1 + ((y/12) % 2 ? 0 : 3), y, 3, 6); }
      race.rs.forEach((r, i)=>{
        const x = x0 + (x1 - x0)*Math.min(1, r.pos), y = 70 + i*lane + lane*0.15, h = lane*0.7, w = h*0.62;
        const bob = Math.abs(Math.sin(race.t*12 + i))*4*(r.pos < 1 ? 1 : 0);
        g.fillStyle = r.col; g.fillRect(x - w, y - bob, w, h);
        g.fillStyle = 'rgba(0,0,0,0.4)'; g.fillRect(x - w, y - bob + h*0.36, w, 2); g.fillRect(x - w*0.25, y - bob + h*0.1, 3, h*0.18);
        g.fillStyle = '#0a1018'; g.fillRect(x - w*0.8, y - bob + h*0.06, w*0.5, h*0.22); g.fillStyle = '#7ff3ff'; g.fillRect(x - w*0.72, y - bob + h*0.1, 3, 5); g.fillRect(x - w*0.55, y - bob + h*0.1, 3, 5);
        g.fillStyle = '#fff'; g.font = 'bold 16px Georgia, serif'; g.textAlign = 'left'; g.fillText((i + 1) + ' ' + r.name, 8, 70 + i*lane + lane*0.62);
      });
      g.fillStyle = '#000'; g.fillRect(0, 0, W, 64); g.fillStyle = '#5dff9c'; g.font = 'bold 30px Georgia, serif'; g.textAlign = 'center'; g.fillText(call.text, W/2, 42);
      g.fillStyle = '#000'; g.fillRect(0, H - 40, W, 40); g.fillStyle = '#ffd56a'; g.font = 'bold 20px Georgia, serif';
      const order = race.rs.slice().sort((a, b)=>b.pos - a.pos).map(r=>race.rs.indexOf(r) + 1).join(' · ');
      g.fillText('ORDER ' + order, W/2, H - 14);
    }
    t.needsUpdate = true;
  }
  draw();
  /* terminals */
  let cur = null;
  C.world.anchors.raceTerminals.forEach(tm=>{
    C.world.interact.push({ pos:new THREE.Vector3(tm.x, 1.1, tm.z - 0.35), r:2.2, text:()=>race ? 'a race is running' : 'bet on the next race', enabled:()=>!race, use:()=>sit(tm) });
  });
  function sit(tm){
    const cam = new THREE.Vector3(tm.x, 1.45, tm.z + 0.25), look = new THREE.Vector3(A.x, A.y - 0.4, A.z);
    C.player.pos.set(tm.x, 0, tm.z + 0.3); C.player.yaw = 0;
    cur = { sel:-1, bet:50, tm };
    C.sit(cam, look, exit);
    ui();
  }
  function exit(){ if(!cur || race) return; cur = null; C.standUp(); }
  function ui(msg){
    if(!cur) return;
    const p = C.hud.panel(`<div class="fp-ptitle">INSIDE TRACK<span class="sp"></span><small>win bets · odds shown are what you get paid</small><button data-a="exit" ${race ? 'disabled' : ''}>STAND UP</button></div>
      <div class="rc-grid">${racers.map((r, i)=>`<button class="rc-horse ${cur.sel === i ? 'sel' : ''}" data-h="${i}" ${race ? 'disabled' : ''}><i style="background:${r.col}"></i>${i + 1}. ${r.name}<small>${fmtOdds(r.odds)} · form ${r.form}</small></button>`).join('')}</div>
      <div class="fp-row"><button data-b="-">−</button><div class="fp-slotbox"><small>BET</small><b>${C.fmt(cur.bet)}</b></div><button data-b="+">+</button><button data-b="max">MAX</button>
      <button class="fp-gold" data-a="go" ${cur.sel < 0 || race ? 'disabled' : ''}>START THE RACE</button></div>
      <div class="fp-row fp-dim" id="rc-msg">${msg || (cur.sel >= 0 ? 'pays ' + C.fmt(Math.floor(cur.bet*racers[cur.sel].odds)) + ' plus your bet back' : 'pick a fridge')}</div>`, 'fp-rcpanel');
    p.querySelector('[data-a="exit"]').onclick = exit;
    p.querySelectorAll('[data-h]').forEach(b=>b.onclick = ()=>{ cur.sel = +b.dataset.h; C.audio.click(); ui(); });
    const steps = [10, 25, 50, 100, 250, 500, 1000, 2500, 5000, 10000];
    p.querySelectorAll('[data-b]').forEach(b=>b.onclick = ()=>{ const i = steps.indexOf(cur.bet); if(b.dataset.b === '+') cur.bet = steps[Math.min(steps.length - 1, i + 1)]; else if(b.dataset.b === '-') cur.bet = steps[Math.max(0, i - 1)]; else cur.bet = 10000; C.audio.click(); ui(); });
    p.querySelector('[data-a="go"]').onclick = go;
  }
  async function go(){
    if(!cur || race || cur.sel < 0) return;
    if(!C.save.bet(cur.bet, 'inside track')){ ui('not enough chips'); C.audio.error(); return; }
    C.save.d.stats.races++;
    /* decide the finish with the same model the odds came from */
    const perf = racers.map(r=>r.rating + gauss()*0.35);
    const order = racers.map((r, i)=>i).sort((a, b)=>perf[b] - perf[a]);
    const finishT = order.map((ri, place)=>9 + place*0.35 + Math.random()*0.25);
    race = { t:0, cam:0, rs:racers.map((r, i)=>({ name:r.name, col:r.col, pos:0, ft:finishT[order.indexOf(i)], wob:Math.random()*6 })), order, done:false, lastCall:0 };
    call = { text:pick(CALLS.start), t:0 };
    C.audio.beep(true); setTimeout(()=>C.audio.beep(true), 400); setTimeout(()=>{ C.audio.tone && C.audio.tone({ f:1760, d:0.5, g:0.12, type:'square', filt:'lowpass', ff:3000 }); }, 800);
    C.bus.emit('race', { start:true });
    ui();
  }
  function finish(){
    const win = race.order[0], wr = racers[win];
    results.unshift(wr.name);
    call = { text:pick(CALLS.win).replace('{n}', wr.name), t:0 };
    if(cur && cur.sel === win){ const pay = Math.floor(cur.bet*wr.odds) + cur.bet; C.save.pay(pay, 'inside track'); C.hud.big('WINNER +' + C.fmt(pay - cur.bet), '#5dff9c'); C.audio.cheer(new THREE.Vector3(A.x, 2, A.z + 3), 1); C.fx.confetti(new THREE.Vector3(A.x, 3, A.z + 4), 100); }
    else if(cur){ C.hud.toast(wr.name + ' won. yours came ' + ordinal(race.order.indexOf(cur.sel) + 1) + '.', 'lose'); C.audio.aww(new THREE.Vector3(A.x, 2, A.z + 3)); }
    C.bus.emit('race', { end:true });
    setTimeout(()=>{ race = null; racers = field(); draw(); if(cur){ cur.sel = -1; ui(); } }, 4500);
  }
  const ordinal = n=>n + (n === 1 ? 'st' : n === 2 ? 'nd' : n === 3 ? 'rd' : 'th');
  return { name:'racing', update(dt){
    acc += dt; time += dt;
    if(race && !race.done){
      race.t += dt; race.cam += dt*0.2;
      race.rs.forEach((r, i)=>{ const k = Math.min(1, race.t/r.ft); r.pos = k < 1 ? k + Math.sin(race.t*1.7 + r.wob)*0.025*(1 - k)*k*4 : 1; });
      if(race.t - race.lastCall > 2.4){
        race.lastCall = race.t;
        const ord = race.rs.slice().sort((a, b)=>b.pos - a.pos);
        const r = Math.random();
        if(race.t > 6 && ord[0].pos - ord[1].pos < 0.03) call = { text:pick(CALLS.close).replace('{a}', ord[0].name).replace('{b}', ord[1].name), t:0 };
        else if(r < 0.5) call = { text:pick(CALLS.lead).replace('{n}', ord[0].name), t:0 };
        else if(r < 0.75) call = { text:pick(CALLS.mid), t:0 };
        else call = { text:pick(CALLS.last).replace('{n}', ord[5].name), t:0 };
      }
      if(race.rs.every(r=>r.pos >= 1)){ race.done = true; finish(); }
    }
    if(acc > (race ? 1/24 : 1)){ acc = 0; if(race || C.camera.position.distanceToSquared(screen.position) < 900) draw(); }
  } };
}
