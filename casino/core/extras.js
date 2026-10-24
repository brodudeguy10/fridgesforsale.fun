/* ============================================================
   FRIDGE PALACE: photo mode, the floor map, the secrets list
============================================================ */
import * as THREE from '../lib/three.module.min.js';

export const SECRETS = [
  { k:'note', name:'Sticky Fingers', hint:'somebody at the cage is bad at keeping secrets.' },
  { k:'staffdoor', name:'Staff Only', hint:'a door, a keypad, four digits.' },
  { k:'cam07', name:'Camera Seven', hint:'one camera isn\'t pointed at the casino.' },
  { k:'log', name:'Guest Book', hint:'security keeps a list of who comes and goes.' },
  { k:'hank', name:'Employee of the Month', hint:'a locker with a name on it.' },
  { k:'breaker', name:'Lights Out', hint:'a switch you really shouldn\'t flip.' },
  { k:'ren', name:'The King', hint:'a plaque near a wheel of numbers.' },
  { k:'mini', name:'The Smallest Guest', hint:'somebody lives in the wall.' },
  { k:'disco', name:'Old Habits', hint:'an old code from upstairs still works in here.' },
  { k:'broken7', name:'Percussive Maintenance', hint:'the machine that doesn\'t work can be convinced.' },
  { k:'broken38', name:'Thirty Eight', hint:'convince it a lot more.' },
  { k:'counted', name:'Card Shark', hint:'the pit boss has a limit. find it.' },
  { k:'sauce', name:'Off Menu', hint:'the bartender makes one thing for people who\'ve been downstairs.' },
  { k:'jackpot', name:'Defrosted', hint:'the big number on the west wall.' },
  { k:'podium', name:'Podium Finish', hint:'the gold fridge can be won.' },
  { k:'typedhank', name:'Say His Name', hint:'once you know a name from the basement, type it in here.', needs:()=>{ try{ return VENDOR.sawAny(['wall:hank','tag:26']); }catch(e){ return false; } } },
  { k:'visitor', name:'Company', hint:'someone from downstairs drops by, if you\'ve been down enough.', needs:()=>{ try{ return VENDOR.loadMem().deaths >= 7; }catch(e){ return false; } } },
  { k:'photo', name:'Virtual Photographer', hint:'press P while walking.' }
  ,{ k:'crushed', name:'Light Fixture', hint:'one thing in the lobby hangs by a single chain. that\'s a weapon.', needs:()=>{ try{ return (JSON.parse(localStorage.getItem('fridgepalace_v1')).heist || {}).story >= 2; }catch(e){ return false; } } }
  ,{ k:'aquarium', name:'Free The Fish', hint:'the tank can only take so much.', needs:()=>{ try{ return (JSON.parse(localStorage.getItem('fridgepalace_v1')).heist || {}).story >= 2; }catch(e){ return false; } } }
  ,{ k:'slotbuster', name:'Hand Pay', hint:'the slots pay out if you ask them firmly. ten of them.', needs:()=>{ try{ return (JSON.parse(localStorage.getItem('fridgepalace_v1')).heist || {}).story >= 2; }catch(e){ return false; } } }
  ,{ k:'mine', name:'Somebody Else\'s', hint:'if downstairs likes you, you might not have to finish the job yourself.', needs:()=>{ try{ return (JSON.parse(localStorage.getItem('fridgepalace_v1')).heist || {}).story >= 2; }catch(e){ return false; } } }
  ,{ k:'reminder', name:'A Reminder', hint:'after it\'s rebuilt, look up at the big sign.', needs:()=>{ try{ return (JSON.parse(localStorage.getItem('fridgepalace_v1')).heist || {}).story >= 3; }catch(e){ return false; } } }
  ,{ k:'payphone', name:'Collect Call', hint:'once it\'s over, something by the restrooms starts ringing.', needs:()=>{ try{ return (JSON.parse(localStorage.getItem('fridgepalace_v1')).heist || {}).story >= 3; }catch(e){ return false; } } }
];

export function initExtras(C){
  /* ---------- photo mode ---------- */
  const FILTERS = [
    { name:'clean', sat:1, tint:[1, 1, 1], vig:0.9, grain:0.03, chroma:0 },
    { name:'noir', sat:0, tint:[1.05, 1.05, 1.05], vig:1.2, grain:0.07, chroma:0 },
    { name:'warm', sat:1.15, tint:[1.12, 1.0, 0.82], vig:1, grain:0.03, chroma:0 },
    { name:'freezer', sat:0.8, tint:[0.82, 0.97, 1.18], vig:1, grain:0.03, chroma:0 },
    { name:'vhs', sat:1.3, tint:[1.05, 0.95, 1.08], vig:1.3, grain:0.14, chroma:0.003 },
    { name:'vendor', sat:0.4, tint:[1.15, 0.8, 0.75], vig:1.5, grain:0.1, chroma:0.0015 }
  ];
  let photo = false, fi = 0, el = null, fly = 0;
  const U = C.engine.finish.uniforms;
  const apply = f=>{ U.uSat.value = f.sat; U.uTint.value.set(...f.tint); U.uVig.value = f.vig; U.uGrain.value = f.grain; U.uChroma.value = f.chroma; };
  function toggle(on){
    photo = on;
    C.photo = on;
    C.hud.el.style.display = on ? 'none' : '';
    if(!el){ el = document.createElement('div'); el.id = 'fp-photo'; C.root.appendChild(el); }
    el.style.display = on ? 'flex' : 'none';
    if(on){ fly = 0; C.save.egg('photo'); render(); } else { apply(FILTERS[0]); }
  }
  function render(){ el.innerHTML = `<b>PHOTO MODE</b><span>filter: ${FILTERS[fi].name}</span><span>${C.input.touch ? '' : '1-6 filters · space/C up and down · enter snap · P exit'}</span><button data-a="f">FILTER</button><button data-a="s" class="fp-gold">SNAP</button><button data-a="x">EXIT</button>`;
    el.querySelector('[data-a="f"]').onclick = ()=>{ fi = (fi + 1) % FILTERS.length; apply(FILTERS[fi]); render(); };
    el.querySelector('[data-a="s"]').onclick = snap; el.querySelector('[data-a="x"]').onclick = ()=>toggle(false); apply(FILTERS[fi]); }
  function snap(){
    el.style.display = 'none';
    C.engine.composer.render(0);
    const url = C.engine.canvas.toDataURL('image/png');
    el.style.display = 'flex';
    const a = document.createElement('a'); const d = new Date(); a.download = 'fridge-palace-' + d.getFullYear() + String(d.getMonth() + 1).padStart(2, '0') + String(d.getDate()).padStart(2, '0') + '-' + String(d.getHours()).padStart(2, '0') + String(d.getMinutes()).padStart(2, '0') + String(d.getSeconds()).padStart(2, '0') + '.png'; a.href = url; document.body.appendChild(a); a.click(); a.remove();
    C.audio.burst({ ff:3000, q:0.7, d:0.08, g:0.3 }); U.uFlash.value = 0.8; C.tweens.add({ dur:0.4, update:k=>{ U.uFlash.value = 0.8*(1 - k); } });
  }
  C.bus.on('key', e=>{
    if(C.seated || C.hud.modalOpen || C.hud.paused) return;
    if(e.code === 'KeyP') toggle(!photo);
    if(!photo) return;
    if(/^Digit[1-6]$/.test(e.code)){ fi = +e.code.slice(5) - 1; apply(FILTERS[fi]); render(); }
    if(e.code === 'Enter') snap();
  });
  C.togglePhoto = toggle;
  /* ---------- the map ---------- */
  C.drawMap = (cv)=>{
    const g = cv.getContext('2d'), W = cv.width, H = cv.height, sx = W/62, sz = H/46;
    const X = x=>(x + 31)*sx, Z = z=>(z + 23)*sz;
    g.fillStyle = '#0b0709'; g.fillRect(0, 0, W, H);
    g.fillStyle = '#2a0d14'; g.fillRect(X(-30), Z(-22), 60*sx, 44*sz);
    g.fillStyle = '#3a3630'; g.fillRect(X(-30), Z(13), 60*sx, 9*sz);
    g.fillStyle = 'rgba(230,182,90,0.55)';
    C.collide.boxes.forEach(b=>{ if(!b.on && b.tag !== 'staffdoor') return; g.fillRect(X(b.minX), Z(b.minZ), Math.max(1, (b.maxX - b.minX)*sx), Math.max(1, (b.maxZ - b.minZ)*sz)); });
    C.collide.circles.forEach(c=>{ g.beginPath(); g.arc(X(c.x), Z(c.z), c.r*sx, 0, 7); g.fill(); });
    const label = (t, x, z)=>{ g.fillStyle = '#f7dc95'; g.font = 'bold 11px Georgia'; g.textAlign = 'center'; g.fillText(t, X(x), Z(z)); };
    label('SLOTS', -18, 5); label('BAR', 0, -6); label('TABLES', 16, -11); label("HOLD'EM", 21.5, 7.5); label('INSIDE TRACK', 0, -16); label('CLUB', 21, -16); label('STAFF', -21, -17); label('CAGE', 18, 17.5); label('WHEEL', -11, 14); label('PODIUM', 0, 12.6); label('EXIT', 0, 21);
    const p = C.player.pos; g.fillStyle = '#5dff9c'; g.beginPath(); g.arc(X(p.x), Z(p.z), 4, 0, 7); g.fill();
    g.strokeStyle = '#5dff9c'; g.lineWidth = 2; g.beginPath(); g.moveTo(X(p.x), Z(p.z)); g.lineTo(X(p.x) - Math.sin(C.player.yaw)*10, Z(p.z) - Math.cos(C.player.yaw)*10); g.stroke();
    if(C.games.npcs){ g.fillStyle = 'rgba(127,243,255,0.6)'; C.games.npcs.list.forEach(n=>{ g.fillRect(X(n.F.group.position.x) - 1.5, Z(n.F.group.position.z) - 1.5, 3, 3); }); }
  };
  /* ---------- the secrets list ---------- */
  C.secrets = ()=>{
    const d = C.save.d, list = SECRETS.filter(s=>!s.needs || s.needs());
    const got = s=>s.k === 'podium' ? d.podium : (s.k === 'jackpot' ? d.stats.jackpots > 0 : !!d.eggs[s.k]);
    return { list:list.map(s=>({ name:s.name, hint:s.hint, got:got(s) })), n:list.filter(got).length, total:list.length };
  };
}
