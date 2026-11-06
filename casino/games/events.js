/* ============================================================
   FRIDGE PALACE: things that happen
   every couple of minutes the palace does something on its own:
   happy hour at the bar, the power flickers, a wedding party
   walks in, somebody drops chips, somebody lifts yours, somebody
   hits a slot. and sometimes a big shot shows up with people:
   THE WHALE (throws money), DIAMOND DOLORES (bets big, owns a
   very small dog), THE PROFESSOR (counts cards, gets thrown out).
   C.events.start('wedding') runs one on purpose.
============================================================ */
import * as THREE from '../lib/three.module.min.js';
import { G } from '../world/props.js';
import { makeFridge, animateFridge } from '../world/fridge.js';
import { chipStack } from '../world/cards.js';
import { pick, rand, randi, fair } from '../core/util.js';

const LINES = {
  whale:['you know what i like about this place? me. i like me in this place.', 'i bought a casino once. it was smaller than this. i gave it to my nephew.', 'my bodyguards are named left and right. guess which is which. wrong.', 'i don\'t count my chips. my chips count me.', 'tip the bartender. tip the dealer. tip me. no wait.', 'you seem nice. nice doesn\'t pay. here, have some anyway.'],
  whaleGuard:['keep walking.', 'he doesn\'t do selfies.', 'that\'s close enough.', 'i\'m left. he\'s right. don\'t ask.'],
  dolores:['darling. DARLING. is that a two dollar chip? how quaint.', 'red. always red. it matches the carpet and my temperament.', 'princess has more chips than you. she doesn\'t even have hands.', 'my third husband was a chest freezer. lovely man. no conversation.', 'i only come here for the lighting. and the money. mostly the money.'],
  princess:['arf.', 'arf arf.', 'she sniffs your shoe. she approves of nothing else about you.', 'a very small fridge wags its whole body.'],
  professor:[
    'every game in here has a house edge except one: talking to me. that one\'s free.',
    'at lucky lou\'s table, a seven is the worst card to see. every call is close to a coin flip.',
    'blackjack: always split aces and eights. never split tens. never take insurance. that\'s the whole lecture.',
    'roulette has a zero. that zero is the building you\'re standing in.',
    'slots aren\'t "due". a machine that just paid is exactly as likely to pay again. i checked. for years.',
    'the scratch tickets print the odds on the front. people read them like a horoscope.',
    'cup and ball pays even money. it\'s only even if the ball is actually under a cup.',
    'cash out while you\'re up. nobody does. that\'s why the chandeliers are so nice.'
  ],
  bride:['we met at the inside track. he bet on the wrong fridge. i bet on him.', 'have a drink on us. tell gus the bride said so.', 'i\'m not crying. it\'s condensation. it\'s a happy defrost.', 'the ceremony was in the parking garage. the reception is wherever we say it is.'],
  groom:['i proposed at the slots. she said yes. the machine said no.', 'best night of my life. second best was the night i hit cherries three times.', 'my mother is somewhere behind me. she\'s a chest freezer. she\'s judging the carpet.'],
  guest:['open bar? there\'s no open bar? there\'s a bar. it\'s open. close enough.', 'i give it six months. the warranty is twelve.', 'i caught the bouquet. it was frozen peas.', 'the cake is in the walk-in. the walk-in is also a guest.'],
  thief:['who, me?', 'i don\'t know you.', 'nice night for it.'],
  shamed:['fine. FINE. here.', 'it was a loan. you were going to get it back.', 'tell nobody. especially nicky.']
};

export function init(C){
  const { scene } = C;
  const ev = { list:[], next:rand(70, 120), last:'', actors:[], bigShot:null, chips:null, met:{} };
  C.events = ev;
  const vm = ()=>{ try{ return window.VENDOR ? VENDOR.loadMem() : {}; }catch(e){ return {}; } };
  const ok = ()=>!C.heistLock && (!C.heist || C.heist.state === 'idle') && !(C.heistAftermath && C.heistAftermath.n === 1) && C.nav && C.nav.ready && C.games.npcs;
  const pa = (text, dur)=>{ C.audio.bell && (C.audio.bell(784, 0, 0.06), C.audio.bell(988, 0.22, 0.06), C.audio.bell(1175, 0.44, 0.06)); C.hud.say('PA', text, dur || 6); };
  const snap = (x, z)=>{ const n = C.nav.nearestWalk(x, z); return n ? [C.nav.X0 + n[0]*C.nav.S, C.nav.Z0 + n[1]*C.nav.S] : [x, z]; };
  const flashM = new THREE.MeshBasicMaterial({ color:0xffffff, toneMapped:false });
  const dist2 = (a, b)=>{ const dx = a.x - b.x, dz = a.z - b.z; return dx*dx + dz*dz; };

  /* ---------- people with somewhere to be ---------- */
  function actor(look, name, x, z, o){
    o = o || {};
    const F = makeFridge(Object.assign({ face:true, arms:true }, look)); F.seed = Math.random()*10;
    if(o.scale) F.group.scale.setScalar(o.scale);
    F.group.position.set(x, 0, z); F.group.rotation.y = o.yaw || 0; scene.add(F.group);
    const a = { F, name, path:null, pi:0, speed:o.speed || 1.1, state:'idle', timer:0, trail:[[x, z]], acc:0, hop:0, follow:o.follow || null, gap:o.gap || 1.1, talk:o.talk || null, talkText:o.talkText || null, tag:o.tag || '', moving:0, lookAt:undefined };
    ev.actors.push(a); return a;
  }
  function remove(a){
    const i = ev.actors.indexOf(a); if(i >= 0) ev.actors.splice(i, 1);
    scene.remove(a.F.group);
    a.F.group.traverse(o=>{ if(o.geometry && !o.geometry.userData.shared) o.geometry.dispose(); }); if(a.F.face && a.F.face.t) a.F.face.t.dispose();
    if(a.extra) a.extra.forEach(m=>scene.remove(m));
  }
  function goTo(a, x, z){ const [tx, tz] = snap(x, z); const p = C.nav.path(a.F.group.position.x, a.F.group.position.z, tx, tz); if(p && p.length){ a.path = p; a.pi = 0; a.state = 'walk'; return true; } return false; }
  function step(a, dt, t){
    const F = a.F, gp = F.group.position, cam = C.camera.position;
    a.moving = 0;
    if(a.follow){
      /* followers walk the leader's breadcrumbs, a set distance back */
      const L = a.follow, tr = L.trail, k = Math.min(tr.length - 1, Math.round(a.gap/0.25));
      const tp = tr[k];
      if(tp){ const dx = tp[0] - gp.x, dz = tp[1] - gp.z, d = Math.hypot(dx, dz);
        if(d > 0.08){ const sp = Math.min(d*4, L.speed*1.6 + 0.4); const s = Math.min(d, sp*dt); gp.x += dx/d*s; gp.z += dz/d*s; a.moving = sp; turn(F, Math.atan2(dx, dz), dt*6); }
        else if(L.state !== 'walk'){ turn(F, L.F.group.rotation.y, dt*2); }
      }
    } else if(a.state === 'walk'){
      const wp = a.path[a.pi];
      if(!wp){ a.state = 'arrived'; if(a.onArrive){ const f = a.onArrive; a.onArrive = null; f(a); } }
      else {
        const dx = wp[0] - gp.x, dz = wp[1] - gp.z, d = Math.hypot(dx, dz);
        const pdx = cam.x - gp.x, pdz = cam.z - gp.z, pd = Math.hypot(pdx, pdz);
        let sp = a.speed; if(pd < 0.9 && (pdx*dx + pdz*dz) > 0 && a.tag !== 'thief') sp = 0;
        if(d < 0.12) a.pi++;
        else { const s = Math.min(d, sp*dt); gp.x += dx/d*s; gp.z += dz/d*s; a.moving = sp; turn(F, Math.atan2(dx, dz), dt*6); }
      }
    } else if(a.faceTo !== undefined){ turn(F, a.faceTo, dt*3); }
    if(a.lookAt !== undefined && a.hop > 0) turn(F, a.lookAt, dt*5);
    /* breadcrumbs for whoever is following */
    const last = a.trail[0]; if(!last || Math.hypot(last[0] - gp.x, last[1] - gp.z) > 0.25){ a.trail.unshift([gp.x, gp.z]); if(a.trail.length > 40) a.trail.length = 40; }
    if(a.hop > 0) a.hop -= dt;
    const d2 = gp.distanceToSquared(cam);
    F.face.update(dt, d2 < 100);
    if(d2 < 400 || a.moving) animateFridge(F, t + F.seed, a.moving, { hop:a.hop > 0 });
    F.group.visible = d2 < 3600;
  }
  function turn(F, want, k){ let dy = want - F.group.rotation.y; dy = Math.atan2(Math.sin(dy), Math.cos(dy)); F.group.rotation.y += dy*Math.min(1, k); }
  function say(a, line, dur){ a.F.face.say(Math.min(4, line.length*0.05)); C.hud.say(a.name, line, dur); }

  /* talking to them: whoever you're looking at, like the regular crowd */
  const _f = new THREE.Vector3(), _d = new THREE.Vector3();
  function facing(){
    C.camera.getWorldDirection(_f); let best = null, bs = 0;
    for(const a of ev.actors){ if(!a.talk || !a.F.group.visible) continue; const s = a.F.group.scale.x; _d.copy(a.F.group.position).setY(a.F.h*s*0.75).sub(C.camera.position); const d = _d.length(); if(d > 2.6 + s*0.4) continue; _d.normalize(); const dot = _d.dot(_f); const need = s < 0.5 ? 0.6 : 0.8; if(dot > need && dot - d*0.05 > bs){ bs = dot - d*0.05; best = a; } }
    return best;
  }
  const ipos = new THREE.Vector3();
  C.world.interact.push({ pos:ipos, r:3.2, text:()=>{ const a = facing(); return a ? (a.talkText ? a.talkText(a) : 'talk to ' + a.name.toLowerCase()) : null; }, use:()=>{ const a = facing(); if(a) a.talk(a); }, enabled:()=>{ const a = facing(); if(a) ipos.copy(a.F.group.position).setY(1.3); return !!a; } });

  /* ---------- the events ---------- */
  const KINDS = {
    happyhour:{ w:2, can:()=>!C.happyHour, run:()=>{
      C.happyHour = true; C.npcBias = { bar:6 };
      pa('happy hour at the freezer bar. everything is half price for two minutes. gus says don\'t get used to it.');
      C.hud.toast('HAPPY HOUR · drinks half price', 'gold');
      return { dur:120, end:()=>{ C.happyHour = false; C.npcBias = null; pa('happy hour is over. gus is putting the prices back.', 4); } };
    } },
    blackout:{ w:1.2, can:()=>!C.lightsBusy && !C.seated, run:()=>{
      C.lightsBusy = true;
      const ls = C.world.lights.map(l=>[l, l.intensity]), amb = C.scene.children.filter(o=>o.isHemisphereLight || o.isAmbientLight).map(l=>[l, l.intensity]);
      const env0 = C.scene.environmentIntensity;
      const set = k=>{ ls.forEach(([l, i])=>l.intensity = i*k); amb.forEach(([l, i])=>l.intensity = i*Math.max(0.06, k)); C.scene.environmentIntensity = env0*Math.max(0.04, k); };
      const neon = on=>C.world.neon.forEach(n=>n.visible = on);
      const st = { t:0, phase:0, ls, amb, set, neon };
      C.audio.tone({ f:120, f2:60, d:0.4, g:0.12, type:'sawtooth', filt:'lowpass', ff:500 });
      return { dur:8.5, st, tick:(dt)=>{
        st.t += dt;
        if(st.t < 2.2){ if(Math.random() < dt*14){ const on = Math.random() < 0.5; set(on ? 1 : 0.15); neon(on); C.audio.burst({ ff:3000, q:3, d:0.02, g:0.05 }); } }
        else if(st.phase === 0){ st.phase = 1; set(0); neon(false); C.audio.tone({ f:90, f2:30, d:0.9, g:0.2, type:'square', filt:'lowpass', ff:260 }); C.audio.aww(new THREE.Vector3(0, 2, 0));
          (C.games.npcs ? C.games.npcs.list : []).forEach(n=>{ n.F.face.set('shock', 4); });
          C.hud.say('', 'the whole palace goes dark. two hundred fridge faces glow in the dark like a very nervous audience.', 4);
          if((vm().deaths || 0) >= 1 && Math.random() < 0.5){ const ns = C.games.npcs.list; if(ns.length){ const n = pick(ns); n.F.face.set('static', 3); } C.audio.whisper && C.audio.whisper('you came back'); } }
        else if(st.t > 6 && st.phase === 1){ st.phase = 2; set(1); neon(true); C.audio.tone({ f:60, f2:240, d:1.2, g:0.08, type:'sawtooth', filt:'lowpass', ff:900 }); }
      }, end:()=>{ set(1); neon(true); C.lightsBusy = false; pa('sorry about that, folks. somebody in the kitchen left the big fridge open and the whole building felt it.', 5); } };
    } },
    wedding:{ w:1.2, can:()=>!ev.actors.some(a=>a.tag === 'wedding'), run:()=>{
      const bride = actor({ style:'french', color:'#fbfbf8', acc:['crown'], eye:'#ff7ad0' }, 'THE BRIDE', 0, 20.6, { speed:0.85, yaw:Math.PI, tag:'wedding' });
      /* a veil */
      const veil = new THREE.Mesh(new THREE.ConeGeometry(bride.F.w*0.55, bride.F.h*0.8, 16, 1, true), new THREE.MeshStandardMaterial({ color:0xffffff, transparent:true, opacity:0.45, roughness:0.6, side:THREE.DoubleSide, depthWrite:false }));
      veil.position.set(0, bride.F.top - bride.F.h*0.38, -bride.F.d*0.42); veil.rotation.x = 0.12; bride.F.inner.add(veil);
      const groom = actor({ style:'smart', color:'#1a1a1e', trim:'#0a0a0c', acc:['tophat', 'bowtie'], eye:'#ffd56a' }, 'THE GROOM', 0.8, 21, { follow:bride, gap:1.0, tag:'wedding' });
      const guests = [0, 1, 2].map(i=>actor({ style:pick(['std', 'retro', 'sxs', 'smart']), color:pick(['#e05a5a', '#5a8ae0', '#9fe3d0', '#ffd56a', '#c060ff']), acc:['party'], partyCol:pick(['#ff3fa4', '#3fa4ff', '#ffd400']) }, 'WEDDING GUEST', -0.8 + i*0.8, 21.3, { follow:bride, gap:2.1 + i*0.9, tag:'wedding' }));
      bride.talk = a=>{ a.F.face.set('love', 3); if(!ev.met.bride){ ev.met.bride = true; C.freeDrink = true; say(a, 'have a drink on us. tell gus the bride said so. the next one\'s free.'); C.hud.toast('your next drink at the bar is free', 'gold'); } else say(a, pick(LINES.bride)); };
      groom.talk = a=>{ a.F.face.set('happy', 2); say(a, pick(LINES.groom)); };
      guests.forEach(g=>g.talk = a=>{ a.F.face.set('happy', 2); say(a, pick(LINES.guest)); });
      /* tin cans on a string, clanking behind */
      const canM = new THREE.MeshStandardMaterial({ color:0xc8ccd2, metalness:0.8, roughness:0.3 });
      bride.cans = [0, 1, 2].map(()=>{ const m = new THREE.Mesh(G.cyl8, canM); m.scale.set(0.05, 0.11, 0.05); m.rotation.z = Math.PI/2; scene.add(m); return m; });
      bride.extra = bride.cans;
      C.hud.toast('a wedding party just walked in', 'gold'); C.audio.cheer(new THREE.Vector3(0, 1.5, 20), 0.7);
      C.bus.emit('cheer', { pos:new THREE.Vector3(0, 1, 20), big:false });
      const st = { stage:0, t:0, clank:0 };
      goTo(bride, 0, 11.6); bride.onArrive = ()=>{ st.stage = 1; st.t = 0; bride.faceTo = Math.PI; };
      return { dur:200, st, tick:(dt)=>{
        st.t += dt;
        /* cans drag along her trail */
        bride.cans.forEach((m, i)=>{ const p = bride.trail[Math.min(bride.trail.length - 1, 3 + i)]; if(p){ m.position.x += (p[0] + (i - 1)*0.12 - m.position.x)*Math.min(1, dt*8); m.position.z += (p[1] - m.position.z)*Math.min(1, dt*8); m.position.y = 0.05 + (bride.moving ? Math.abs(Math.sin(st.t*14 + i))*0.03 : 0); } });
        if(bride.moving){ st.clank -= dt; if(st.clank <= 0){ st.clank = 0.18 + Math.random()*0.2; C.audio.burst({ ff:3800 + Math.random()*1500, q:8, d:0.05, g:0.04, dest:C.audio.out(bride.cans[1].position, 0.2) }); } }
        if(st.stage === 1 && st.t > 6){ /* photos at the podium, then the bar */ st.stage = 2; C.fx.confetti(bride.F.group.position.clone().setY(2.2), 80); C.audio.cheer(bride.F.group.position, 0.6); goTo(bride, 2.6, 3.9); bride.onArrive = ()=>{ st.stage = 3; st.t = 0; bride.faceTo = Math.PI; }; }
        if(st.stage === 1 && Math.random() < dt*1.4){ /* camera flashes (a glow, not a light: adding lights recompiles every shader) */ const f = new THREE.Mesh(G.sph, flashM); f.scale.setScalar(0.07); f.position.copy(bride.F.group.position).add(new THREE.Vector3(rand(-1.5, 1.5), rand(1.3, 1.8), rand(1, 2.5))); scene.add(f); C.audio.burst({ ff:6000, q:2, d:0.03, g:0.03, dest:C.audio.out(f.position, 0.1) }); setTimeout(()=>scene.remove(f), 90); }
        if(st.stage === 3 && Math.random() < dt*0.08){ C.bus.emit('cheer', { pos:bride.F.group.position.clone(), big:false }); C.fx.confetti(bride.F.group.position.clone().setY(2), 40); C.audio.clink && C.audio.clink(bride.F.group.position); [bride, groom].concat(guests).forEach(a=>{ a.hop = 1.2; a.F.face.set('happy', 2); }); }
        if(st.stage === 3 && st.t > 90){ st.stage = 4; goTo(bride, 0, 20.8); bride.onArrive = ()=>{ st.stage = 5; }; }
        if(st.stage === 5){ st.done = true; }
      }, done:()=>st.done, end:()=>{ [bride, groom].concat(guests).forEach(remove); } };
    } },
    pickpocket:{ w:1, can:()=>!C.seated && C.save.chips >= 200 && C.player.mode === 'walk' && !ev.actors.some(a=>a.tag === 'thief'), run:()=>{
      const p = C.player.pos, yaw = C.player.yaw;
      /* he comes from behind you */
      let sx = p.x + Math.sin(yaw)*6, sz = p.z + Math.cos(yaw)*6; [sx, sz] = snap(sx, sz);
      const th = actor({ style:'std', color:'#2a2a30', trim:'#151518', acc:['beanie'], beanie:'#111', shades:true, eye:'#ff4a4a' }, 'SOMEBODY IN A BEANIE', sx, sz, { speed:1.9, tag:'thief' });
      const arrow = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.28, 4), new THREE.MeshBasicMaterial({ color:0xff3a3a, toneMapped:false })); arrow.rotation.x = Math.PI; arrow.visible = false; scene.add(arrow); th.extra = [arrow];
      const st = { mode:'approach', amt:0, t:0, repath:0 };
      th.talkText = a=>st.mode === 'flee' ? 'grab the pickpocket' : 'talk to ' + a.name.toLowerCase();
      th.talk = a=>{
        if(st.mode === 'flee'){
          const bonus = randi(50, 250);
          C.save.d.chips += st.amt + bonus; C.save.write(); C.save.emit();
          st.mode = 'shamed'; a.speed = 0.7; a.F.face.set('sad', 30); say(a, pick(LINES.shamed)); arrow.visible = false; a.name = 'A PICKPOCKET';
          C.hud.big('+' + C.fmt(st.amt + bonus), '#59e08c', 1600); C.audio.chipStack(a.F.group.position);
          C.hud.toast('you got your ' + C.fmt(st.amt) + ' back, plus ' + C.fmt(bonus) + ' of somebody else\'s', 'gold');
          C.bus.emit('cheer', { pos:a.F.group.position.clone(), big:false });
          if(C.save.egg('collar')) C.hud.toast('secret: citizen\'s arrest', 'gold');
          goTo(a, 0, 20.8); a.onArrive = ()=>{ st.mode = 'gone'; };
        } else { say(a, pick(LINES.thief)); a.F.face.set('smug', 2); }
      };
      return { dur:70, st, tick:(dt)=>{
        st.t += dt; const gp = th.F.group.position;
        if(st.mode === 'approach'){
          if(C.seated){ st.mode = 'leave'; goTo(th, 0, 20.8); th.onArrive = ()=>{ st.mode = 'gone'; }; return; }
          st.repath -= dt; if(st.repath <= 0){ st.repath = 0.6; goTo(th, C.player.pos.x, C.player.pos.z); }
          if(Math.hypot(gp.x - C.player.pos.x, gp.z - C.player.pos.z) < 0.85){
            st.amt = Math.min(600, Math.max(50, Math.floor(C.save.chips*0.06)));
            C.save.take(st.amt);
            C.audio.chip(gp, 2); C.audio.whoosh && C.audio.whoosh();
            C.hud.toast('hey! somebody just lifted ' + C.fmt(st.amt) + ' chips. the one in the beanie, running for the doors', 'lose');
            C.hud.big('-' + C.fmt(st.amt), '#ff4a4a', 1400);
            st.mode = 'flee'; th.speed = 3.3; th.F.face.set('laugh', 60); arrow.visible = true;
            goTo(th, 0, 20.8); th.onArrive = ()=>{ st.mode = 'escaped'; };
          }
          if(st.t > 30){ st.mode = 'leave'; goTo(th, 0, 20.8); th.onArrive = ()=>{ st.mode = 'gone'; }; }
        }
        if(arrow.visible){ arrow.position.set(gp.x, th.F.top + 0.45 + Math.sin(st.t*6)*0.06, gp.z); arrow.rotation.y += dt*3; }
        if(st.mode === 'escaped'){ C.hud.toast('the pickpocket got away with ' + C.fmt(st.amt) + ' chips. the doorman waves at him.', 'lose'); st.mode = 'gone'; }
      }, done:()=>st.mode === 'gone', end:()=>remove(th) };
    } },
    dropped:{ w:1.5, can:()=>!ev.chips, run:()=>{
      /* somewhere you can walk to, not too close, not too far */
      let x = 0, z = 0, tries = 0;
      do{ const a = Math.random()*Math.PI*2, r = rand(6, 14); [x, z] = snap(C.player.pos.x + Math.cos(a)*r, C.player.pos.z + Math.sin(a)*r); tries++; }while(tries < 20 && Math.hypot(x - C.player.pos.x, z - C.player.pos.z) < 4);
      const amt = pick([25, 50, 75, 100, 150, 250]);
      const m = chipStack(amt); m.scale.setScalar(1.6); m.position.set(x + rand(-0.3, 0.3), 0.002, z + rand(-0.3, 0.3)); m.rotation.z = 0.0; scene.add(m);
      const glint = new THREE.Mesh(G.oct, new THREE.MeshBasicMaterial({ color:0xfff1b0, toneMapped:false, transparent:true, opacity:0.8 })); glint.scale.setScalar(0.035); scene.add(glint);
      const st = { m, glint, amt, t:0, got:false };
      ev.chips = st;
      C.audio.chip(m.position, 3); C.hud.toast('you hear chips hit the floor somewhere close');
      st.it = { pos:m.position.clone().setY(0.3), r:2.2, text:()=>st.got ? null : 'pick up the chips', enabled:()=>!st.got, use:()=>{
        st.got = true; C.save.d.chips += amt; C.save.write(); C.save.emit(); C.audio.chipStack(m.position); C.hud.big('+' + amt, '#59e08c', 1200);
        C.hud.toast(pick(['finders keepers', 'nobody saw that', 'the carpet provides', 'somebody is going to be very confused later']));
      } };
      C.world.interact.push(st.it);
      return { dur:55, st, tick:(dt)=>{ st.t += dt; glint.position.set(m.position.x, 0.12 + Math.sin(st.t*4)*0.03, m.position.z); glint.rotation.y += dt*4; glint.material.opacity = 0.5 + Math.sin(st.t*9)*0.4; },
        done:()=>st.got, end:()=>{ scene.remove(m); scene.remove(glint); const i = C.world.interact.indexOf(st.it); if(i >= 0) C.world.interact.splice(i, 1); if(!st.got && st.t >= 54) C.hud.toast('somebody else found those chips'); ev.chips = null; } };
    } },
    npcJackpot:{ w:2, can:()=>C.games.npcs && C.games.npcs.list.some(n=>n.machine && n.state === 'stay'), run:()=>{
      const n = pick(C.games.npcs.list.filter(n=>n.machine && n.state === 'stay'));
      const p = n.F.group.position.clone(), amt = pick([800, 1500, 2400, 5000, 12400]);
      n.F.face.set('money', 6); n.hop = 3;
      C.audio.slotWin && C.audio.slotWin(p, amt >= 5000 ? 3 : 2); C.fx.confetti(p.clone().setY(2.2), 90); C.fx.coins(p.clone().setY(1.2), 30);
      C.bus.emit('cheer', { pos:p, big:amt >= 5000 });
      C.hud.toast(n.name + ' just hit ' + C.fmt(amt) + ' on a slot', 'gold');
      return { dur:1 };
    } },
    bigshot:{ w:2.2, can:()=>!ev.bigShot, run:()=>{
      const kinds = ['whale', 'dolores', 'professor'].filter(k=>k !== ev.lastBig);
      const k = pick(kinds); ev.lastBig = k;
      (C.save.d.bigs = C.save.d.bigs || {})[k] = 1; C.save.write();
      return BIG[k]();
    } }
  };

  /* ---------- the big shots ---------- */
  const SPOTS = { bar:[2.6, 3.9], podium:[0, 11.4], bj:[14.2, -4.4], roulette:[20, -9.6], holdem:[19.6, 8.6], cage:[10.6, 16.4], slots:[-17, -5.5], wheel:[-8, 16.6], lobby:[3.5, 17], hilo:[24, 3] };
  const tour = (a, keys, stay, done)=>{ let i = 0; const next = ()=>{ if(i >= keys.length){ done && done(); return; } const key = keys[i++]; const s = SPOTS[key]; a.at = key; if(!goTo(a, s[0], s[1])){ next(); return; } a.onArrive = ()=>{ a.faceTo = rand(0, 6.28); a.arriveN = (a.arriveN || 0) + 1; a.stayT = stay(key); a.stayNext = next; }; }; next(); };
  const stayTick = (a, dt)=>{ if(a.stayT > 0){ a.stayT -= dt; if(a.stayT <= 0 && a.stayNext){ const f = a.stayNext; a.stayNext = null; f(); } } };
  const BIG = {
    whale:()=>{
      const w = actor({ style:'french', color:'#d9a441', handle:'gold', acc:['crown', 'chain'], shades:true, eye:'#ffd56a', metal:0.4 }, 'THE WHALE', 0, 20.6, { scale:1.25, speed:0.8, yaw:Math.PI, tag:'big' });
      const L = actor({ style:'tall', color:'#16161a', trim:'#0a0a0c', acc:['headset'], shades:true, eye:'#ff4a4a' }, 'LEFT', -0.7, 21, { follow:w, gap:1.2, tag:'big' });
      const R = actor({ style:'tall', color:'#16161a', trim:'#0a0a0c', acc:['headset'], shades:true, eye:'#ff4a4a' }, 'RIGHT', 0.7, 21, { follow:w, gap:2.1, tag:'big' });
      ev.bigShot = w;
      pa('ladies and gentlefridges, the whale is in the building. if he tips you, don\'t make it weird.');
      const st = { talks:0, rain:rand(14, 22), t:0, gone:false };
      w.talk = a=>{ st.talks++; a.F.face.set('laugh', 2);
        if(st.talks === 3 && !ev.met.whaleTip){ ev.met.whaleTip = true; say(a, 'you listened to three whole stories. nobody does that. here. buy yourself a personality.', 5); C.save.d.chips += 1000; C.save.write(); C.save.emit(); C.hud.big('+1,000', '#59e08c', 1600); C.audio.chipStack(a.F.group.position); if(C.save.egg('whale')) C.hud.toast('secret: a good listener', 'gold'); }
        else say(a, pick(LINES.whale)); };
      [L, R].forEach(g=>g.talk = a=>{ a.F.face.set('angry', 1.5); say(a, pick(LINES.whaleGuard)); });
      tour(w, ['lobby', 'podium', 'bar', 'slots', 'bj', 'holdem', 'cage', 'lobby'], k=>k === 'bar' ? 40 : k === 'bj' || k === 'slots' ? 30 : 12, ()=>{ goTo(w, 0, 20.8); w.onArrive = ()=>{ st.gone = true; }; });
      return { dur:330, st, tick:(dt)=>{
        st.t += dt; stayTick(w, dt);
        st.rain -= dt;
        if(st.rain <= 0 && w.state !== 'walk'){
          st.rain = rand(20, 32);
          const p = w.F.group.position.clone();
          w.hop = 1.5; w.F.face.set('money', 3); w.F.armBusy = true; w.F.armR.rotation.x = -2.6; setTimeout(()=>{ w.F.armBusy = false; }, 900);
          C.fx.coins(p.clone().setY(2.4), 40); C.audio.coins && C.audio.coins(p, 20);
          C.bus.emit('cheer', { pos:p, big:false });
          if(dist2(C.player.pos, p) < 30){ const g = randi(60, 300); C.save.d.chips += g; C.save.write(); C.save.emit(); C.hud.big('+' + g, '#59e08c', 1300); C.hud.toast('the whale makes it rain. you catch ' + g + ' chips.', 'gold'); }
          else if(dist2(C.player.pos, p) < 400) C.hud.toast('somebody nearby is throwing chips in the air');
        }
      }, done:()=>st.gone, end:()=>{ [w, L, R].forEach(remove); ev.bigShot = null; } };
    },
    dolores:()=>{
      const d = actor({ style:'retro', color:'#ff9ad0', trim:'#c0407a', acc:['crown', 'neon'], neonCol:'#ff3df2', eye:'#ff7ad0', handle:'gold' }, 'DIAMOND DOLORES', 0, 20.6, { speed:0.75, yaw:Math.PI, tag:'big' });
      const dog = actor({ style:'mini', color:'#fbfbf8', eye:'#ff7ad0', acc:['bowtie'] }, 'PRINCESS', 0.5, 21, { follow:d, gap:0.75, scale:0.38, tag:'big' });
      ev.bigShot = d;
      pa('please welcome back to the palace, miss diamond dolores. and princess.');
      const st = { t:0, gone:false, bets:0, betT:0 };
      d.talk = a=>{ a.F.face.set('smug', 2); say(a, pick(LINES.dolores)); };
      dog.talkText = ()=>'pet princess';
      dog.talk = a=>{ a.hop = 1.6; a.F.face.set('love', 3); C.audio.tone({ f:900, f2:1400, d:0.09, g:0.05, type:'triangle' }); C.audio.tone({ f:950, f2:1500, d:0.09, g:0.05, type:'triangle', t:0.16 }); C.hud.say('PRINCESS', pick(LINES.princess), 2.5);
        if(!ev.met.dog){ ev.met.dog = true; setTimeout(()=>{ if(d.F.group.parent){ d.F.face.set('love', 2); say(d, 'she likes you. she likes NOBODY. she bit a duke.'); } }, 2600); if(C.save.egg('goodboy')) C.hud.toast('secret: good girl', 'gold'); } };
      tour(d, ['lobby', 'podium', 'roulette', 'bar', 'roulette', 'cage', 'lobby'], k=>k === 'roulette' ? 26 : k === 'bar' ? 30 : 10, ()=>{ goTo(d, 0, 20.8); d.onArrive = ()=>{ st.gone = true; }; });
      return { dur:300, st, tick:(dt)=>{
        st.t += dt; stayTick(d, dt);
        /* at the roulette tables she puts it all on red */
        if(d.at === 'roulette' && d.state === 'arrived' && d.stayT > 0 && !st.betting && st.betN !== d.arriveN){
          st.betting = true; st.betN = d.arriveN; st.betT = 7;
          const amt = pick([5000, 10000, 25000]); st.amt = amt;
          C.hud.toast('diamond dolores just put ' + C.fmt(amt) + ' on red', 'gold'); d.F.face.set('smug', 6); C.audio.chipStack(d.F.group.position);
        }
        if(st.betting){ st.betT -= dt; if(st.betT <= 0){ st.betting = false; const won = fair(37) < 18; const p = d.F.group.position.clone();
          if(won){ d.F.face.set('love', 3); d.hop = 2; dog.hop = 2; C.bus.emit('cheer', { pos:p, big:true }); C.audio.cheer(p, 0.8); C.fx.confetti(p.clone().setY(2.2), 60); C.hud.toast('red! dolores wins ' + C.fmt(st.amt*2) + '. princess barks once.', 'gold'); }
          else { d.F.face.set('sad', 3); C.audio.aww(p); C.hud.toast('black. dolores loses ' + C.fmt(st.amt) + ' and acts like it was a parking ticket.'); } } }
      }, done:()=>st.gone, end:()=>{ [d, dog].forEach(remove); ev.bigShot = null; } };
    },
    professor:()=>{
      const p = actor({ style:'tall', color:'#8a8f98', trim:'#5a5e66', acc:['bowtie'], eye:'#7ff3ff' }, 'THE PROFESSOR', 0, 20.6, { speed:0.9, yaw:Math.PI, tag:'big' });
      ev.bigShot = p;
      C.hud.toast('a quiet fridge in a bowtie walks in and heads straight for the blackjack tables');
      const st = { t:0, gone:false, heard:new Set(), kicked:false, kickAt:rand(110, 150) };
      const facts = LINES.professor.slice();
      p.talk = a=>{
        if(st.kicked){ say(a, 'class is cancelled. permanently. apparently.'); return; }
        const left = facts.filter((f, i)=>!st.heard.has(i));
        const i = facts.indexOf(left.length ? pick(left) : pick(facts)); st.heard.add(i);
        a.F.face.set('happy', 2); say(a, facts[i], 6);
        if(st.heard.size === 3 && C.save.egg('officehours')) C.hud.toast('secret: office hours', 'gold');
      };
      goTo(p, SPOTS.bj[0], SPOTS.bj[1]); p.onArrive = ()=>{ p.faceTo = Math.atan2(16 - p.F.group.position.x, -6 - p.F.group.position.z); };
      return { dur:240, st, tick:(dt)=>{
        st.t += dt;
        /* counting: he nods along to the cards */
        if(p.state === 'arrived' && !st.kicked && Math.random() < dt*0.6){ p.F.face.set(pick(['neutral', 'smug', 'happy']), 1); }
        if(!st.kicked && st.t > st.kickAt){
          st.kicked = true;
          const boss = C.staff.find(F=>F.name === 'PIT BOSS');
          if(boss){ boss.face.set('angry', 3); boss.face.say(2); }
          if(dist2(C.player.pos, p.F.group.position) < 400) C.hud.say('PIT BOSS', 'PROFESSOR. we\'ve talked about this. you\'re backed off. out.', 4);
          else C.hud.toast('somebody just got backed off the blackjack tables');
          p.F.face.set('sad', 30); p.speed = 0.7;
          setTimeout(()=>{ if(!st.gone){ goTo(p, 0, 20.8); p.onArrive = ()=>{ st.gone = true; }; } }, 2500);
        }
      }, done:()=>st.gone, end:()=>{ remove(p); ev.bigShot = null; } };
    }
  };

  /* ---------- running them ---------- */
  function start(kind){
    const K = KINDS[kind]; if(!K) return false;
    if(K.can && !K.can()) return false;
    const r = K.run(); if(!r) return false;
    r.kind = kind; r.t = 0; ev.list.push(r); ev.last = kind;
    return true;
  }
  function stopAll(){ ev.list.slice().forEach(r=>{ try{ r.end && r.end(); }catch(e){ console.warn(e); } }); ev.list = []; ev.actors.slice().forEach(remove); ev.bigShot = null; ev.chips = null; C.happyHour = false; C.npcBias = null; }
  ev.start = start; ev.stopAll = stopAll; ev.KINDS = KINDS;
  ev.active = k=>ev.list.some(r=>r.kind === k);
  return { name:'events', update(dt, t){
    if(!ok()){ if(ev.list.length || ev.actors.length) stopAll(); return; }
    for(const a of ev.actors) step(a, dt, t);
    for(let i=ev.list.length - 1; i>=0; i--){
      const r = ev.list[i]; r.t += dt;
      try{ r.tick && r.tick(dt); }catch(e){ console.warn('event', r.kind, e); r.t = r.dur; }
      if(r.t >= r.dur || (r.done && r.done())){ ev.list.splice(i, 1); try{ r.end && r.end(); }catch(e){ console.warn(e); } }
    }
    /* the scheduler */
    if(C.noEvents) return;
    ev.next -= dt;
    if(ev.next <= 0){
      ev.next = rand(100, 200);
      const can = Object.keys(KINDS).filter(k=>k !== ev.last && !ev.active(k) && (!KINDS[k].can || KINDS[k].can()));
      const tot = can.reduce((s, k)=>s + KINDS[k].w, 0); let r = Math.random()*tot;
      for(const k of can){ r -= KINDS[k].w; if(r <= 0){ start(k); break; } }
    }
  } };
}
