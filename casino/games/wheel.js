/* ============================================================
   FRIDGE PALACE: the lucky wheel and the podium fridge
   one free spin a day (by your clock). extra spins cost 1,000.
   the gold fridge on the podium is one of the prizes. if you win
   it, it follows you home.
============================================================ */
import * as THREE from '../lib/three.module.min.js';
import { G } from '../world/props.js';
import { makeFridge } from '../world/fridge.js';
import { canvas, tex } from '../world/textures.js';
import { fair, pick, ease } from '../core/util.js';

const SEGS = [
  { k:'chips', v:1000, label:'1,000', col:'#c8162a' },
  { k:'drink', label:'FREE DRINK', col:'#7ff3ff' },
  { k:'chips', v:2500, label:'2,500', col:'#1f7a3e' },
  { k:'bait', label:'COOLANT BAIT', col:'#3ddc84' },
  { k:'chips', v:500, label:'500', col:'#c8162a' },
  { k:'mystery', label:'MYSTERY', col:'#6a2c91' },
  { k:'chips', v:5000, label:'5,000', col:'#d9a441' },
  { k:'shares', label:'5 GOLD SHARES', col:'#f2c230' },
  { k:'chips', v:1500, label:'1,500', col:'#1f7a3e' },
  { k:'podium', label:'PODIUM FRIDGE', col:'#ffffff' },
  { k:'chips', v:750, label:'750', col:'#c8162a' },
  { k:'drink', label:'FREE DRINK', col:'#7ff3ff' },
  { k:'chips', v:10000, label:'10,000', col:'#ff3df2' },
  { k:'mystery', label:'MYSTERY', col:'#6a2c91' },
  { k:'chips', v:2000, label:'2,000', col:'#1f7a3e' },
  { k:'bait', label:'COOLANT BAIT', col:'#3ddc84' },
  { k:'chips', v:1000, label:'1,000', col:'#c8162a' },
  { k:'shares', label:'5 GOLD SHARES', col:'#f2c230' },
  { k:'chips', v:3000, label:'3,000', col:'#1f7a3e' },
  { k:'chips', v:500, label:'500', col:'#c8162a' }
];
/* how likely each segment is. the podium is on the wheel, it is not on the wheel often */
const WEIGHT = SEGS.map(s=>s.k === 'podium' ? 1 : s.k === 'chips' ? (s.v >= 10000 ? 2 : s.v >= 5000 ? 4 : s.v >= 2500 ? 7 : 10) : s.k === 'mystery' ? 6 : 8);
const today = ()=>{ const d = new Date(); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); };

export function init(C){
  const { scene, M } = C, B = C.world.batch, A = C.world.anchors.wheel, P = C.world.anchors.podium;
  /* ---------- the wheel ---------- */
  const grp = new THREE.Group(); grp.position.set(A.x, 0, A.z); grp.rotation.y = A.ry; scene.add(grp);
  const R = 1.5, cy = 2.4;
  const S = 1024, c = canvas(S, S), g = c.getContext('2d'), n = SEGS.length;
  SEGS.forEach((s, i)=>{
    const a0 = -Math.PI/2 + (i - 0.5)/n*Math.PI*2, a1 = a0 + Math.PI*2/n;
    g.fillStyle = s.col; g.beginPath(); g.moveTo(S/2, S/2); g.arc(S/2, S/2, S*0.49, a0, a1); g.closePath(); g.fill();
    g.strokeStyle = '#f7dc95'; g.lineWidth = 6; g.stroke();
    g.save(); g.translate(S/2, S/2); g.rotate((a0 + a1)/2);
    g.fillStyle = s.col === '#ffffff' || s.col === '#7ff3ff' || s.col === '#f2c230' || s.col === '#3ddc84' ? '#111' : '#fff';
    g.font = `bold ${s.label.length > 8 ? 30 : 44}px Georgia, serif`; g.textAlign = 'right'; g.textBaseline = 'middle'; g.fillText(s.label, S*0.46, 0);
    if(s.k === 'podium'){ g.fillStyle = '#d9a441'; g.fillRect(S*0.16, -16, 22, 32); }
    g.restore();
  });
  const hub = g.createRadialGradient(S/2, S/2, 10, S/2, S/2, 120); hub.addColorStop(0, '#fff6d0'); hub.addColorStop(1, '#8a5a12'); g.fillStyle = hub; g.beginPath(); g.arc(S/2, S/2, 110, 0, 7); g.fill();
  g.fillStyle = '#2a1a04'; g.font = 'bold 34px Georgia, serif'; g.textAlign = 'center'; g.fillText('LUCKY', S/2, S/2 - 6); g.fillText('WHEEL', S/2, S/2 + 30);
  const disc = new THREE.Group(); disc.position.set(0, cy, 0.12); grp.add(disc);
  const face = new THREE.Mesh(new THREE.CircleGeometry(R, 64), new THREE.MeshStandardMaterial({ map:tex(c), roughness:0.35, metalness:0.1, emissive:0xffffff, emissiveMap:tex(c), emissiveIntensity:0.25 }));
  disc.add(face);
  const rim = new THREE.Mesh(new THREE.TorusGeometry(R + 0.04, 0.07, 10, 80), M.gold); disc.add(rim);
  /* pegs between segments */
  for(let i=0;i<n;i++){ const a = -Math.PI/2 + (i - 0.5)/n*Math.PI*2; const peg = new THREE.Mesh(G.cyl8, M.chrome); peg.scale.set(0.02, 0.08, 0.02); peg.rotation.x = Math.PI/2; peg.position.set(Math.cos(a)*(R - 0.03), -Math.sin(a)*(R - 0.03), 0.04); disc.add(peg); }
  /* a ring of bulbs that chase */
  const bulbs = []; const bulbG = new THREE.SphereGeometry(0.045, 8, 6);
  for(let i=0;i<40;i++){ const a = i/40*Math.PI*2; const m = new THREE.MeshBasicMaterial({ color:0xfff1c0, toneMapped:false }); const b = new THREE.Mesh(bulbG, m); b.position.set(Math.cos(a)*(R + 0.22), cy + Math.sin(a)*(R + 0.22), 0.1); grp.add(b); bulbs.push(b); }
  const ring = new THREE.Mesh(new THREE.TorusGeometry(R + 0.22, 0.05, 8, 80), M.goldDark); ring.position.set(0, cy, 0.05); grp.add(ring);
  /* the frame and the flapper */
  { const bw = new THREE.Vector3(0, cy, -0.12).applyMatrix4(new THREE.Matrix4().makeRotationY(A.ry)); B.add(G.box, M.black, A.x + bw.x, cy, A.z + bw.z, 3.8, 4.4, 0.18, 0, A.ry, 0); }
  B.add(G.cyl, M.gold, A.x, 0.1, A.z, 2.2, 0.2, 2.2);
  B.add(G.cyl, M.marbleDark, A.x, 0.25, A.z, 2.0, 0.12, 2.0);
  const flap = new THREE.Group(); flap.position.set(0, cy + R + 0.12, 0.2); grp.add(flap);
  const tri = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.3, 3), new THREE.MeshStandardMaterial({ color:0xd01020, metalness:0.3, roughness:0.3 })); tri.rotation.z = Math.PI; tri.position.y = -0.1; flap.add(tri);
  C.collide.circle(A.x, A.z, 2.1, 'wheel');
  const sign = new THREE.Mesh(G.plane, new THREE.MeshBasicMaterial({ map:(()=>{ const cc = canvas(512, 128), gg = cc.getContext('2d'); gg.fillStyle = '#16040e'; gg.fillRect(0, 0, 512, 128); gg.fillStyle = '#ffd400'; gg.font = 'bold 44px Georgia, serif'; gg.textAlign = 'center'; gg.fillText('ONE FREE SPIN A DAY', 256, 60); gg.fillStyle = '#fff'; gg.font = '26px Georgia, serif'; gg.fillText('win the podium fridge', 256, 100); return tex(cc); })(), toneMapped:false }));
  sign.scale.set(2.4, 0.6, 1); sign.position.set(0, 4.9, 0.14); grp.add(sign);
  grp.updateMatrixWorld(true);

  /* ---------- the podium ---------- */
  const pod = new THREE.Group(); pod.position.set(P.x, 0, P.z); scene.add(pod);
  const plat = new THREE.Mesh(new THREE.CylinderGeometry(2.3, 2.4, 0.35, 64), M.marbleDark); plat.position.y = 0.175; pod.add(plat);
  const top = new THREE.Group(); top.position.y = 0.36; pod.add(top);
  const turn = new THREE.Mesh(new THREE.CylinderGeometry(2.0, 2.0, 0.06, 64), M.gold); top.add(turn);
  const ledRing = new THREE.Mesh(new THREE.TorusGeometry(2.36, 0.03, 6, 96), new THREE.MeshBasicMaterial({ color:0xffd56a, toneMapped:false })); ledRing.rotation.x = Math.PI/2; ledRing.position.y = 0.3; pod.add(ledRing);
  const gold = makeFridge({ style:'french', color:'#e3b04b', metal:1, rough:0.18, handle:'gold', trim:'#8a5a12', acc:['crown'] });
  gold.group.scale.setScalar(1.35); gold.group.position.y = 0.03; top.add(gold.group);
  const spot = new THREE.SpotLight(0xfff2d0, 60, 12, 0.45, 0.5, 1.5); spot.position.set(P.x, 6, P.z + 2.5); spot.target.position.set(P.x, 1, P.z); scene.add(spot); scene.add(spot.target);
  C.collide.circle(P.x, P.z, 2.45, 'podium');
  const podSign = new THREE.Mesh(G.plane, new THREE.MeshBasicMaterial({ map:(()=>{ const cc = canvas(512, 96), gg = cc.getContext('2d'); gg.fillStyle = '#0a0608'; gg.fillRect(0, 0, 512, 96); gg.strokeStyle = '#d9a441'; gg.lineWidth = 4; gg.strokeRect(4, 4, 504, 88); gg.fillStyle = '#f7dc95'; gg.font = 'bold 34px Georgia, serif'; gg.textAlign = 'center'; gg.textBaseline = 'middle'; gg.fillText(C.save.d.podium ? 'WON BY YOU · ENJOY IT UPSTAIRS' : 'THE PODIUM FRIDGE', 256, 50); return tex(cc); })(), toneMapped:false }));
  podSign.scale.set(2.2, 0.41, 1); podSign.position.set(P.x, 0.5, P.z + 2.42); podSign.rotation.x = -0.25; scene.add(podSign);
  C.world.interact.push({ pos:new THREE.Vector3(P.x, 1.4, P.z + 2.2), r:3.2, text:()=>'admire the podium fridge', use:()=>{ C.hud.say('', C.save.d.podium ? 'it\'s yours. it\'s also still here. it\'s in two places. it\'s a podium fridge, it can do that.' : pick(['solid gold. french doors. a crown. it doesn\'t keep anything cold. it doesn\'t have to.', 'a little card says: "win me on the lucky wheel."', 'you can see yourself in it. you look like you need a spin.'])); } });

  /* ---------- spinning ---------- */
  let spinning = false, ang = 0, chase = 0, lastSeg = -1;
  const segAt = a=>{ const k = ((-a/(Math.PI*2))*n) % n; return (Math.round(k) % n + n) % n; };
  const canFree = ()=>C.save.d.wheelDay !== today();
  C.world.interact.push({ pos:new THREE.Vector3(A.x + 1.3, 1.6, A.z), r:3.4, text:()=>spinning ? null : (canFree() ? 'spin the lucky wheel · free today' : 'spin again · 1,000 chips (free spin tomorrow)'), use:()=>start() });
  function start(){
    if(spinning) return;
    const free = canFree();
    if(!free){
      C.input.quietUnlock();
      const b = C.hud.modal({ title:'LUCKY WHEEL', html:`<p style="text-align:center">your free spin resets at midnight. you can spin again now for 1,000 chips.</p><div class="fp-row"><button class="fp-gold" data-a="pay">SPIN FOR 1,000</button><button data-a="no">NOT NOW</button></div>` });
      b.querySelector('[data-a="pay"]').onclick = ()=>{ if(!C.save.bet(1000, 'lucky wheel')){ C.audio.error(); C.hud.modal(null); C.hud.toast('you need 1,000 chips'); return; } C.hud.modal(null); go(false); };
      b.querySelector('[data-a="no"]').onclick = ()=>C.hud.modal(null);
      return;
    }
    go(true);
  }
  function go(free){
    const wheelW = new THREE.Vector3(0, cy, 0).applyMatrix4(grp.matrixWorld);
    const camW = new THREE.Vector3(0, 1.75, 4.2).applyMatrix4(grp.matrixWorld);
    C.player.pos.set(camW.x, 0, camW.z);
    C.sit(camW, wheelW, null);
    let power = 0, dir = 1, held = false;
    const p = C.hud.panel(`<div class="fp-ptitle">LUCKY WHEEL<span class="sp"></span><small>${free ? 'free spin' : 'paid spin'}</small></div><div class="fp-row"><div style="width:260px;height:14px;background:#111;border:1px solid var(--line)"><i id="wh-p" style="display:block;height:100%;width:0;background:linear-gradient(90deg,#3ddc84,#ffd400,#ff4a4a)"></i></div></div><div class="fp-row"><button class="fp-gold fp-spin" id="wh-go">HOLD TO PULL</button></div><div class="fp-row fp-dim">hold, then let go. it doesn't matter how hard you pull. it feels like it does.</div>`);
    const bar = p.querySelector('#wh-p'), btn = p.querySelector('#wh-go');
    const iv = setInterval(()=>{ if(held){ power += dir*0.04; if(power > 1){ power = 1; dir = -1; } if(power < 0){ power = 0; dir = 1; } bar.style.width = (power*100) + '%'; } }, 30);
    const down = e=>{ e.preventDefault(); held = true; };
    const up = e=>{ if(!held) return; held = false; window.removeEventListener('pointerup', up); C.bus.off('key', kd); window.removeEventListener('keyup', ku, true); clearInterval(iv); btn.disabled = true; release(Math.max(0.2, power), free); };
    const kd = e=>{ if(e.code === 'Space' || e.code === 'KeyE'){ held = true; } };
    const ku = e=>{ if(e.code === 'Space' || e.code === 'KeyE') up(e); };
    btn.addEventListener('pointerdown', down); window.addEventListener('pointerup', up); C.bus.on('key', kd); window.addEventListener('keyup', ku, true);
  }
  async function release(power, free){
    spinning = true;
    if(free){ C.save.d.wheelDay = today(); C.save.write(); }
    C.save.d.stats.wheelSpins++;
    /* pick the prize, then make the wheel land on it */
    const tot = WEIGHT.reduce((a, b)=>a + b, 0); let r = fair(tot), idx = 0; for(let i=0;i<n;i++){ r -= WEIGHT[i]; if(r < 0){ idx = i; break; } }
    const turns = 3 + Math.round(power*3);
    const target = -(idx/n)*Math.PI*2 + (Math.random() - 0.5)*(Math.PI*2/n)*0.6;
    const start = ang;
    const dist = ((start - target) % (Math.PI*2) + Math.PI*2) % (Math.PI*2) + Math.PI*2*turns;
    await C.tweens.add({ dur:6 + power*1.5, ease:t=>1 - Math.pow(1 - t, 3.2), update:k=>{ ang = start - dist*k; disc.rotation.z = -ang; } });
    spinning = false;
    const s = SEGS[idx];
    await award(s);
    await C.tweens.sleep(1.8);
    C.standUp();
  }
  async function award(s){
    const pos = new THREE.Vector3(A.x, 2, A.z);
    if(s.k === 'chips'){ C.save.pay(s.v, 'lucky wheel'); C.hud.big('+' + C.fmt(s.v) + ' CHIPS', '#ffd56a'); C.audio.slotWin(pos, 4); C.fx.coins(new THREE.Vector3(A.x + 1, 1.5, A.z), 40); }
    else if(s.k === 'drink'){ C.drunk += 0.2; C.audio.clink(pos); C.hud.big('FREE DRINK', '#7ff3ff'); C.hud.say('GUS', 'heard you won a drink. here. it\'s a margarita. it\'s always a margarita.'); }
    else if(s.k === 'bait'){
      try{ const raw = JSON.parse(localStorage.getItem('fridgefish_v1') || 'null') || { rods:[], rod:null, bait:{}, curBait:'none', loc:'puddle', dex:{}, cooler:[], total:0, earned:0 }; raw.bait = raw.bait || {}; raw.bait.coolant = (raw.bait.coolant || 0) + 3; localStorage.setItem('fridgefish_v1', JSON.stringify(raw)); if(window.FISHING && FISHING.save){ const S = FISHING.save(); S.bait.coolant = (S.bait.coolant || 0) + 3; } }catch(e){}
      C.hud.big('3 COOLANT BAIT', '#3ddc84'); C.hud.toast('added to your tackle box upstairs', 'gold'); C.audio.slotWin(pos, 2);
    }
    else if(s.k === 'shares'){
      let ok = false; try{ if(window.MKT && MKT.onSpawn){ for(let i=0;i<5;i++) MKT.onSpawn('GOLD'); ok = true; } }catch(e){}
      C.hud.big('5 GOLD SHARES', '#f2c230'); C.hud.toast(ok ? 'vested in your exchange account (locked 2 sessions)' : 'the exchange is closed. here is 2,500 instead.', 'gold'); if(!ok) C.save.pay(2500, 'lucky wheel'); C.audio.slotWin(pos, 3);
    }
    else if(s.k === 'mystery'){
      const roll = fair(100);
      if(roll < 50){ const v = [100, 250, 500][fair(3)]; C.save.pay(v, 'lucky wheel'); C.hud.big('MYSTERY: ' + v, '#c060ff'); }
      else if(roll < 85){ const v = [3000, 6000][fair(2)]; C.save.pay(v, 'lucky wheel'); C.hud.big('MYSTERY: ' + C.fmt(v), '#c060ff'); C.audio.slotWin(pos, 4); }
      else if(roll < 99){ C.hud.big('MYSTERY: A HUG', '#c060ff'); C.hud.say('', 'the wheel can\'t hug you. it tried. that\'s what counts.'); }
      else { C.save.pay(20000, 'lucky wheel'); C.hud.big('MYSTERY: 20,000', '#ff3df2'); C.audio.jackpot(pos); C.fx.confetti(pos, 120); }
    }
    else if(s.k === 'podium'){
      C.save.d.podium = true; C.save.pay(25000, 'podium'); C.save.write();
      C.hud.big('THE PODIUM FRIDGE', '#ffd56a', 4000); C.audio.jackpot(pos); C.fx.confetti(new THREE.Vector3(P.x, 3, P.z), 220); C.fx.coins(new THREE.Vector3(P.x, 1.5, P.z), 120);
      C.bus.emit('cheer', { pos:new THREE.Vector3(P.x, 1, P.z), big:true });
      C.hud.say('DOORMAN', 'the podium fridge is yours. 25,000 chips came with it. it\'ll be waiting upstairs when you leave.', 7);
      C.disco = true; setTimeout(()=>{ C.disco = false; }, 15000);
    }
    C.save.logLine('lucky wheel: ' + s.label);
  }
  return { name:'wheel', update(dt, t){
    chase += dt*(spinning ? 18 : 4);
    bulbs.forEach((b, i)=>{ const on = Math.floor(chase + i) % 4 === 0; b.material.color.setHex(C.disco ? new THREE.Color().setHSL((i/40 + t*0.3) % 1, 1, 0.6).getHex() : (on ? 0xfff1c0 : 0x3a2a10)); });
    top.rotation.y += dt*0.25;
    ledRing.material.color.setHSL(C.disco ? (t*0.3) % 1 : 0.12, 1, 0.6 + Math.sin(t*2)*0.1);
    /* flapper clicks as pegs pass */
    const sg = segAt(ang);
    if(sg !== lastSeg){ lastSeg = sg; if(spinning){ C.audio.wheelTick(new THREE.Vector3(A.x, cy + R, A.z), 0.25); flap.rotation.z = 0.5; } }
    flap.rotation.z *= Math.pow(0.001, dt);
  } };
}
