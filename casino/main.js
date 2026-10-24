/* ============================================================
   FRIDGE PALACE CASINO & RESORT
   entry point. boot.js imports this when you press the button.
============================================================ */
import * as THREE from './lib/three.module.min.js';
import { Engine } from './core/engine.js';
import { Save } from './core/save.js';
import { Hud, fmt } from './core/hud.js';
import { Input } from './core/input.js';
import { Audio } from './core/audio.js';
import { renderLounge } from './core/music.js';
import { Collide, Player } from './core/player.js';
import { Bus, Tweens } from './core/util.js';
import { makeMaterials } from './world/materials.js';
import { buildWorld, finishWorld, surfaceAt } from './world/layout.js';
import { animateFridge } from './world/fridge.js';
import { FX } from './core/fx.js';
import { initExtras } from './core/extras.js';

const MODULES = [
  './games/cashier.js', './games/bar.js', './games/slots.js', './games/blackjack.js', './games/roulette.js',
  './games/poker.js', './games/wheel.js', './games/racing.js', './npc/npcs.js', './eggs/eggs.js', './heist/heist.js'
];

let C = null;

async function fonts(){
  if(!document.getElementById('fp-fonts')){
    const l = document.createElement('link'); l.id = 'fp-fonts'; l.rel = 'stylesheet';
    l.href = 'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Pacifico&display=swap';
    document.head.appendChild(l);
  }
  try{ await Promise.race([Promise.all([document.fonts.load('700 40px "Cinzel"'), document.fonts.load('40px "Pacifico"')]), new Promise(r=>setTimeout(r, 2500))]); }catch(e){}
}

export async function start(o){
  o = o || {};
  if(C && C.open) return C;
  const progress = o.progress || (()=>{});
  const root = o.root;
  progress(0.05, 'the valet is parking your fridge');
  await fonts();
  C = { THREE, open:true, root, bus:new Bus(), tweens:new Tweens(), seated:false, drunk:0, games:{}, modules:[], staff:[] };
  C.save = new Save();
  C.save.d.visits++; C.save.d.lastVisit = Date.now(); C.save.write();
  try{ C.engine = new Engine(C, root); }
  catch(e){ progress(1, 'your browser can\'t do 3D (WebGL is off or missing). the palace stays closed.'); throw e; }
  C.scene = C.engine.scene; C.camera = C.engine.camera;
  C.hud = new Hud(C, root);
  C.input = new Input(C, root);
  C.audio = new Audio(C);
  C.collide = new Collide();
  C.player = new Player(C);
  C.M = makeMaterials();
  C.fx = new FX(C);
  C.surfaceAt = surfaceAt;
  C.fmt = fmt;
  progress(0.2, 'polishing the gold');
  await frame();
  buildWorld(C);
  progress(0.4, 'unwrapping new decks');
  await frame();
  let i = 0;
  for(const path of MODULES){
    i++;
    try{
      const mod = await import(path);
      const inst = await mod.init(C);
      if(inst){ C.modules.push(inst); if(inst.name) C.games[inst.name] = inst; }
    }catch(e){ console.error('module failed', path, e); }
    progress(0.4 + 0.45*i/MODULES.length, ['counting chips', 'chilling the drinks', 'oiling the reels', 'shuffling six decks', 'spinning up the wheel', 'seating the regulars', 'greasing the big wheel', 'walking the race fridges', 'waking the staff', 'checking the basement', 'somebody by the restrooms is watching'][i - 1] || 'almost');
    await frame();
  }
  finishWorld(C);
  progress(0.88, 'warming up the lights');
  /* compile every shader now, so turning around doesn't hitch later */
  try{ const r = C.engine.renderer; if(r.compileAsync) await Promise.race([r.compileAsync(C.scene, C.camera), new Promise(res=>setTimeout(res, 20000))]); else r.compile(C.scene, C.camera); }catch(e){ console.warn(e); }
  progress(0.95, 'tuning the house band');
  const sp = C.world.anchors.spawn; C.player.spawn(sp.x, sp.z, sp.yaw);
  wire();
  initExtras(C);
  C.engine.on(loop);
  C.engine.start();
  /* the band renders in the background so the doors open now */
  (async ()=>{ try{ await C.audio.startAmbience(); if(C.noMusic) return; const m = await renderLounge({ sparse:!!C.musicSparse, bpm:C.partyTonight ? 116 : 100 }); if(C && C.open && !C.heistLock) C.audio.startMusic(m); }catch(e){ console.warn(e); } })();
  progress(1, 'welcome');
  setTimeout(()=>{
    C.hud.fade(0, 900);
    const first = C.save.d.visits <= 1;
    C.hud.hint(C.input.touch
      ? '<b>FRIDGE PALACE</b><br>left thumb walks · right thumb looks · tap things to use them<br>buy chips at the cage on your right'
      : '<b>FRIDGE PALACE</b><br>click to look around · WASD walk · shift run · E use · esc pause<br>buy chips at the cage on your right', first ? 9000 : 5000);
    if(first) setTimeout(()=>C.hud.say('DOORMAN', 'welcome to the palace. the cage is on your right. the house band is on your left. the house always wins, but it\'s polite about it.'), 1500);
    else C.hud.toast('welcome back. visit ' + C.save.d.visits);
  }, 300);
  return C;
}
function frame(){ return new Promise(r=>requestAnimationFrame(()=>r())); }

function wire(){
  C.onEscape = ()=>{
    if(C.hud.modalOpen){ C.hud.modal(null); return; }
    if(C.seated && C.seatExit){ C.seatExit(); return; }
    if(C.photo){ C.togglePhoto(false); return; }
    if(C.hud.paused){ C.hud.pause(false); return; }
    C.hud.pause(true);
  };
  C.leave = leave;
  C.confirmLeave = ()=>{
    C.input.quietUnlock();
    const b = C.hud.modal({ title:'LEAVE THE PALACE?', html:`<p>you're holding <b>${fmt(C.save.chips)}</b> chips. they stay in your account at the cage for next time.</p><div class="fp-row"><button class="fp-gold" data-a="go">LEAVE</button><button data-a="stay">STAY</button></div>` });
    b.querySelector('[data-a="go"]').onclick = ()=>{ C.hud.modal(null); leave(); };
    b.querySelector('[data-a="stay"]').onclick = ()=>C.hud.modal(null);
  };
  /* sit down at something: the camera glides into the seat, controls go to the game */
  C.sit = (pos, look, onExit)=>{
    /* phones held upright see less sideways, so the seat camera backs up a little */
    if(C.camera.aspect < 0.8){ const d = pos.clone().sub(look); pos = look.clone().add(d.multiplyScalar(1.5)); pos.y += 0.15; }
    C.seated = true; C.seatExit = onExit || null;
    C.hud.prompt(null); C.hud.showCross(false);
    C.player.sit(pos, look);
    C.audio.duck(true);
  };
  C.standUp = (done)=>{
    C.seated = false; C.seatExit = null;
    C.hud.panel(null);
    C.audio.duck(false);
    C.player.stand(()=>{ C.hud.showCross(true); if(!C.input.touch) C.input.lock(); if(done) done(); });
  };
  /* "game says something" helper */
  C.interactables = C.world.interact;
}

const _v = new THREE.Vector3(), _f = new THREE.Vector3(), _pm = new THREE.Matrix4();
let focus = null;
function loop(dt, t){
  if(!C || !C.open) return;
  const paused = C.hud.paused;
  if(!C.frustum) C.frustum = new THREE.Frustum();
  C.camera.updateMatrixWorld(); _pm.multiplyMatrices(C.camera.projectionMatrix, C.camera.matrixWorldInverse); C.frustum.setFromProjectionMatrix(_pm);
  if(!paused){
    C.tweens.update(dt);
    C.player.update(dt);
    C.fx.update(dt);
    for(const m of C.modules) if(m.update) m.update(dt, t);
    for(const s of C.world.screens) s.update(dt);
    /* staff: faces, breathing, a glance at you when you're close */
    for(const F of C.staff){
      const d2 = F.group.position.distanceToSquared(C.camera.position);
      if(F.face) F.face.update(dt, d2 < 160);
      if(!F.custom) animateFridge(F, t + (F.seed || 0), F.speed || 0);
      if(F.watch && d2 < 25 && !F.busy){ const dx = C.camera.position.x - F.group.position.x, dz = C.camera.position.z - F.group.position.z; const want = Math.atan2(dx, dz); let dy = want - F.group.rotation.y; dy = Math.atan2(Math.sin(dy), Math.cos(dy)); F.group.rotation.y += dy*Math.min(1, dt*3); }
    }
  }
  C.hud.update(dt);
  /* drinks wear off slowly */
  if(C.drunk > 0){ C.drunk = Math.max(0, C.drunk - dt*0.012); C.save.d.tipsy = C.drunk; }
  C.engine.finish.uniforms.uDrunk.value = C.drunk;
  C.audio.musicWarp(C.drunk, t);
  C.audio.listener(C.camera);
  updateNeon(dt, t);
  /* what are you looking at */
  if(!paused && !C.seated && C.player.mode === 'walk' && !C.hud.modalOpen){
    C.camera.getWorldDirection(_f);
    let best = null, bestS = -1;
    for(const it of C.world.interact){
      if(C.heistLock && !it.heist) continue;
      if(it.enabled && !it.enabled()) continue;
      _v.copy(it.pos).sub(C.camera.position);
      const d = _v.length(); if(d > (it.r || 2.2)) continue;
      _v.normalize(); const dot = _v.dot(_f);
      const need = d < 1.1 ? 0.55 : 0.86;
      if(dot < need) continue;
      const sc = dot - d*0.05;
      if(sc > bestS){ bestS = sc; best = it; }
    }
    if(best !== focus){ focus = best; if(best) C.audio.hover(); }
    const txt = best ? (typeof best.text === 'function' ? best.text() : best.text) : null;
    C.hud.prompt(txt); C.hud.cross(!!best);
    if(best && txt && C.input.was('KeyE')){ C.audio.resume(); C.audio.click(); best.use(); }
  } else if(!C.seated){ C.hud.prompt(null); }
  C.input.endFrame();
}
function updateNeon(dt, t){
  for(const m of C.world.neon){
    const f = m.userData.flicker;
    let k = 1;
    if(f && Math.random() < dt*f) m.userData.off = 0.06 + Math.random()*0.15;
    if(m.userData.off > 0){ m.userData.off -= dt; k = Math.random() < 0.5 ? 0.1 : 0.55; }
    if(C.disco){ m.material.color.setHSL((t*0.25 + m.position.x*0.03) % 1, 1, 0.6); }
    m.material.opacity = k;
  }
}

export async function leave(opts){
  if(!C || !C.open) return;
  C.open = false;
  if(!(opts && opts.instant)) await C.hud.fade(1, 500);
  try{ for(const m of C.modules) if(m.dispose) m.dispose(); }catch(e){}
  C.audio.stopAll();
  C.input.dispose();
  C.engine.dispose();
  C.tweens.clear();
  C.save.write();
  const r = C.root; C = null;
  if(r && r._onLeave) r._onLeave(opts);
}
export function api(){ return C; }
