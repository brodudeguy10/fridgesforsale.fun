/* ============================================================
   THE VENDOR — the basement
   textured raycaster with coloured per-pixel light, a stalker
   that teleports, freezes when watched early on and fills your
   screen with static if you stare, hiding spots, a flashlight
   that dies, stamina, 3d sound, touch controls, a real pause
   menu, and the seventh death.
============================================================ */
(function(){
'use strict';
const V = window.VENDOR;
const B = V.B, A = B.A, T = B.T;
const W = B.W, H = B.H, VW1 = W+1;

/* ============================================================
   DOM
============================================================ */
let root = null, view = null, vctx = null, scareCv = null, sctx = null;
const ui = {};
function el(id){ return document.getElementById(id); }
function buildDOM(){
  if(root) return;
  root = document.createElement('div');
  root.id = 'vBase';
  root.innerHTML = `
    <canvas id="vbView"></canvas>
    <div id="vbVig"></div>
    <div id="vbRed"></div>
    <div id="vbSteam"></div>
    <div id="vbHide"><div id="vbFrost"></div></div>
    <canvas id="vbScare"></canvas>
    <div id="vbCount"></div>
    <div id="vbMsg"></div>
    <div id="vbWhisper"></div>
    <div id="vbPrompt"></div>
    <div id="vbHint"></div>
    <div id="vbStam"><i></i></div>
    <div id="vbNote"><div class="vbTagHole"></div><div id="vbNoteHead"></div><div id="vbNoteBody"></div><div id="vbNoteFoot"></div></div>
    <div id="vbTouch">
      <div id="vbStickZone"></div>
      <div id="vbLookZone"></div>
      <div id="vbStick"><div id="vbKnob"></div></div>
      <button id="vbBtnUse" class="vbBtn">USE</button>
      <button id="vbBtnLight" class="vbBtn">LIGHT</button>
      <button id="vbBtnShake" class="vbBtn">SHAKE</button>
      <button id="vbBtnPause" class="vbBtn" aria-label="pause">II</button>
    </div>
    <div id="vbTitle" class="vbScreen">
      <div class="vbTitleWrap">
        <div id="vbTitleTally"></div>
        <h1>THE VENDOR</h1>
        <div class="vbSub">the back room</div>
        <div class="vbMenu">
          <button data-act="go" id="vbGo">go down</button>
          <button data-act="settings">settings</button>
          <button data-act="up">back upstairs</button>
        </div>
        <div id="vbTitleFoot">headphones on. lights off.</div>
        <div id="vbRotate">turn your phone sideways</div>
      </div>
    </div>
    <div id="vbIntro" class="vbScreen"></div>
    <div id="vbPause" class="vbScreen">
      <div class="vbPanel">
        <div class="vbPanelHead" id="vbPauseHead">there's no menu.</div>
        <div id="vbSettings">
          <label>look speed <input type="range" id="vbSens" min="0.3" max="2.5" step="0.05"></label>
          <label>volume <input type="range" id="vbVol" min="0" max="1" step="0.02"></label>
          <label>picture <select id="vbQual"><option value="auto">auto</option><option value="low">low</option><option value="med">medium</option><option value="high">high</option></select></label>
          <label class="vbCheck"><input type="checkbox" id="vbInv"> invert look</label>
          <label class="vbCheck"><input type="checkbox" id="vbShakeOpt"> camera shake</label>
          <label class="vbCheck"><input type="checkbox" id="vbHap"> vibration</label>
        </div>
        <div class="vbMenu">
          <button data-act="resume" id="vbResume">keep going</button>
          <button data-act="leave" id="vbLeave">leave</button>
        </div>
        <div id="vbPauseSay"></div>
      </div>
    </div>
    <div id="vbDeath" class="vbScreen">
      <canvas id="vbDeathTally"></canvas>
      <div id="vbDeathLine"></div>
      <div id="vbDeathSub"></div>
      <div class="vbMenu" id="vbDeathMenu">
        <button data-act="retry">get up</button>
        <button data-act="up">go back upstairs</button>
      </div>
    </div>
    <div id="vbWin" class="vbScreen"><div id="vbWinLine"></div><div id="vbWinSub"></div></div>
    <div id="vbFreeze"></div>
    <div id="vbDebug"></div>
    <canvas id="vbMap"></canvas>
  `;
  document.body.appendChild(root);
  view = el('vbView'); vctx = view.getContext('2d', { alpha:false });
  scareCv = el('vbScare'); sctx = scareCv.getContext('2d');
  ['vbVig','vbRed','vbSteam','vbHide','vbFrost','vbCount','vbMsg','vbWhisper','vbPrompt','vbHint','vbStam','vbNote','vbNoteHead','vbNoteBody','vbNoteFoot',
   'vbTouch','vbStickZone','vbLookZone','vbStick','vbKnob','vbBtnUse','vbBtnLight','vbBtnShake','vbBtnPause',
   'vbTitle','vbTitleTally','vbRotate','vbIntro','vbPause','vbPauseHead','vbPauseSay','vbResume','vbLeave','vbSens','vbVol','vbQual','vbInv','vbShakeOpt','vbHap',
   'vbDeath','vbDeathTally','vbDeathLine','vbDeathSub','vbDeathMenu','vbWin','vbWinLine','vbWinSub','vbFreeze','vbDebug','vbMap']
   .forEach(id=>{ ui[id] = el(id); });
  ui.stamBar = ui.vbStam.querySelector('i');
  wireMenus();
  wireTouch();
}

/* ============================================================
   STATE
============================================================ */
let M = null;                 // map arrays
let cellList = [];
let lights = [], props = [], hides = [], tags = [], motes = [];
let LR, LG, LB;               // vertex light, rgb
let mode = 'off';             // off title intro play pause dying freeze dead win
let running = false, rafId = 0, lastT = 0, gameT = 0;
let tagMode = false, mem = null, opts = {};

const P = { x:0, y:0, ang:0, pitch:0, stamina:1, exhausted:false, lightOn:true, lamp:1, flick:1, flickT:0,
            shakeCD:0, hidden:null, hideT:0, bob:0, bobAmt:0, stepAcc:0, swayX:0, swayY:0, turnVel:0, moving:false, sprinting:false };
const ven = { x:0, y:0, state:'dormant', ghost:0, ghostUntil:0, glimpseAt:0, phase:0, rage:0, door:0,
              tpAt:0, inView:false, wasInView:false, lastX:0, lastY:0, knowT:-99, alwaysAt:0,
              stepAt:0, stepAlt:false, moving:false, hideTarget:null, passSpot:null, passUntil:0, wanderX:0, wanderY:0, wanderAt:0,
              flowKey:-1, flow:null, flowAt:0, visCache:0 };
let found = 0, escape = false, exposure = 0, fear = 0, stingerCD = 0;
let blackoutUntil = 0, sauceUntil = 0, tapeUntil = -999, tapeX = 0, tapeY = 0, radioOn = false, sauceUsed = false;
let sessionDeaths = 0, leaveTries = 0, whisperAt = 0, whisperQ = [];
let interactTarget = null, god = false, showMap = false;
let radioStation = 0, wurstRingUntil = -1, evAt = 0, evDone = {}, steamUntil = 0, lastZone = 0, typed = '';
const seenFrame = {}, seenAcc = {};
let SEEN_WALL = null;

/* ============================================================
   MAP + LIGHT PRECOMPUTE
============================================================ */
function isWall(x,y){ if(x<0||y<0||x>=W||y>=H) return true; return M.wall[(y|0)*W+(x|0)] !== 0; }
function los(ax,ay,bx,by){
  let x = ax|0, y = ay|0; const ex = bx|0, ey = by|0;
  const dx = bx-ax, dy = by-ay;
  const sx = dx>0?1:-1, sy = dy>0?1:-1;
  const tdx = dx!==0 ? Math.abs(1/dx) : 1e30, tdy = dy!==0 ? Math.abs(1/dy) : 1e30;
  let tmx = dx>0 ? (x+1-ax)*tdx : (ax-x)*tdx;
  let tmy = dy>0 ? (y+1-ay)*tdy : (ay-y)*tdy;
  let n = Math.abs(ex-x) + Math.abs(ey-y);
  const wa = M.wall;
  while(n-- > 0){
    if(tmx < tmy){ tmx += tdx; x += sx; } else { tmy += tdy; y += sy; }
    if(x<0||y<0||x>=W||y>=H) return false;
    if(wa[y*W+x]) return false;
  }
  return true;
}
function initMap(){
  if(M) return;
  M = B.buildMap();
  SEEN_WALL = {};
  SEEN_WALL[T.m_look] = 'look'; SEEN_WALL[T.m_noise] = 'noise'; SEEN_WALL[T.m_seven] = 'seven'; SEEN_WALL[T.m_ren] = 'ren';
  SEEN_WALL[T.m_sauce] = 'sauce'; SEEN_WALL[T.m_sold] = 'sold'; SEEN_WALL[T.m_counts] = 'counts'; SEEN_WALL[T.m_hank] = 'hank';
  SEEN_WALL[T.m_quiet] = 'quiet'; SEEN_WALL[T.tally] = 'tally';
  SEEN_WALL[T.h_fridge] = 'h_fridge'; SEEN_WALL[T.h_behind] = 'h_behind'; SEEN_WALL[T.h_box] = 'h_box';
  cellList = [];
  for(let y=1;y<H-1;y++) for(let x=1;x<W-1;x++) if(!M.wall[y*W+x]) cellList.push([x+0.5,y+0.5]);
  LR = new Float32Array(VW1*(H+1)); LG = new Float32Array(VW1*(H+1)); LB = new Float32Array(VW1*(H+1));
  lights = B.LIGHTS.map((L, i)=>{
    const vi = [], vw = [];
    const r = L.r;
    for(let vy = Math.max(0, Math.floor(L.y-r)); vy <= Math.min(H, Math.ceil(L.y+r)); vy++){
      for(let vx = Math.max(0, Math.floor(L.x-r)); vx <= Math.min(W, Math.ceil(L.x+r)); vx++){
        const d = Math.hypot(vx-L.x, vy-L.y);
        if(d > r) continue;
        /* a vertex is lit if any of the four cells around it can see the light */
        let seen = false;
        for(let k=0;k<4 && !seen;k++){
          const cx = vx - (k&1) + 0.5 - 0.0, cy = vy - (k>>1) + 0.5;
          const qx = vx + (cx - vx)*0.08, qy = vy + (cy - vy)*0.08;
          if(isWall(cx, cy)) continue;
          if(los(L.x, L.y, qx, qy)) seen = true;
        }
        if(!seen) continue;
        const f = 1 - d/r;
        vi.push(vy*VW1+vx); vw.push(f*f*(0.6 + 0.4*f));
      }
    }
    return Object.assign({}, L, { id:i, vi:new Int32Array(vi), vw:new Float32Array(vw), cur:L.i, dead:false, flickT:0 });
  });
}

/* ============================================================
   RUN SETUP
============================================================ */
function shuffle(a){ for(let i=a.length-1;i>0;i--){ const j=(Math.random()*(i+1))|0; [a[i],a[j]]=[a[j],a[i]]; } return a; }
function pick(a){ return a[(Math.random()*a.length)|0]; }
function clamp(v,a,b){ return v<a?a:(v>b?b:v); }
function d2(ax,ay,bx,by){ const dx=ax-bx, dy=ay-by; return dx*dx+dy*dy; }

function setupRun(){
  found = 0; escape = false; exposure = 0; fear = 0; stingerCD = 0;
  blackoutUntil = 0; sauceUntil = 0; tapeUntil = -999; radioOn = false; sauceUsed = false;
  interactTarget = null;
  lights.forEach(L=>{ L.dead = false; L.cur = L.i; L.flickT = 0; });
  props = B.PROPS.filter(p=> p.t !== 'magnet' || !(mem.hasE || mem.gaveE)).map(p=>Object.assign({}, p, { used:false }));
  hides = B.HIDES.map(h=>Object.assign({}, h, { used:false }));
  /* six tags, spread across the floor, and never in the room you start in */
  const pool = shuffle(B.SPOTS.slice());
  const chosen = [];
  for(const s of pool){
    if(chosen.length >= 6) break;
    if(d2(s[0],s[1],B.START.x,B.START.y) < 64) continue;
    if(chosen.some(c=>d2(c[0],c[1],s[0],s[1]) < 30)) continue;
    if(chosen.some(c=>M.zone[(c[1]|0)*W+(c[0]|0)] === M.zone[(s[1]|0)*W+(s[0]|0)])) continue;
    chosen.push(s);
  }
  for(const s of pool){ if(chosen.length >= 6) break; if(chosen.indexOf(s) < 0 && d2(s[0],s[1],B.START.x,B.START.y) >= 36) chosen.push(s); }
  const notes = shuffle(TAG_NOTES.slice());
  tags = chosen.map((s,i)=>({ x:s[0], y:s[1], taken:false, occ:false, note:notes[i] }));
  P.x = B.START.x; P.y = B.START.y; P.ang = B.START.ang; P.pitch = 0;
  P.stamina = 1; P.exhausted = false; P.lightOn = true; P.lamp = 1; P.flick = 1; P.shakeCD = 0;
  P.hidden = null; P.hideT = 0; P.bob = 0; P.bobAmt = 0; P.stepAcc = 0; P.swayX = 0; P.swayY = 0;
  const vs = pick(B.VEN_START);
  Object.assign(ven, { x:vs[0], y:vs[1], state: tagMode ? 'stalk' : 'dormant', ghost:0, ghostUntil:0, glimpseAt: gameT + 9 + Math.random()*8,
    phase:0, rage:0, door:0, tpAt: gameT + 24, inView:false, wasInView:false, lastX:P.x, lastY:P.y, knowT:-99, alwaysAt: gameT + 30,
    stepAt:0, moving:false, hideTarget:null, passSpot:null, passUntil:0, wanderAt:0, flowKey:-1, flow:null, flowAt:0 });
  motes = [];
  for(let i=0;i<34;i++) motes.push({ x:P.x+(Math.random()-0.5)*6, y:P.y+(Math.random()-0.5)*6, z:0.15+Math.random()*0.7, vx:(Math.random()-0.5)*0.05, vy:(Math.random()-0.5)*0.05, vz:(Math.random()-0.5)*0.02 });
  whisperQ = []; whisperAt = gameT + 18;
  radioStation = 0; wurstRingUntil = -1; evAt = gameT + 30 + Math.random()*15; evDone = {}; steamUntil = 0; lastZone = 0;
  for(const k in seenAcc) delete seenAcc[k];
  /* now and then, before the first tag, it's on its break in the office chair */
  ven.onBreak = !tagMode && mem.deaths >= 1 && Math.random() < 0.14;
  if(ven.onBreak){ ven.x = 6.5; ven.y = 31.75; ven.ghost = 1; ven.ghostUntil = 1e9; ven.glimpseAt = 1e9; }
  ui.vbHide.classList.remove('on');
  hideText();
  B.bakeTally(mem.deaths);
}

/* ============================================================
   WORDS
   flat. short. the thing is an appliance. it states, it repeats,
   it gets things slightly wrong. no speeches.
============================================================ */
const TAG_NOTES = [
  { h:'UNIT 04', b:'white. hums. door sticks.\nno price.', f:'it wouldnt let me price it' },
  { h:'UNIT 09', b:'condition: cold\ncontents: 1', f:'checked twice' },
  { h:'UNIT 11', b:'SOLD', f:'it took it back' },
  { h:'UNIT 13', b:'returned by customer.\ncustomer not returned.', f:'' },
  { h:'UNIT 17', b:'do not open\nuntil paid for', f:'paid for by who' },
  { h:'UNIT 22', b:'motor runs with\nthe plug out', f:'leave it' },
  { h:'UNIT 23', b:'if you can read this\nit is already walking', f:'' },
  { h:'UNIT 26', b:'smells like pennies', f:'-hank' },
  { h:'UNIT 30', b:'$0.00', f:'still not sold' },
  { h:'UNIT 31', b:'crisper drawer full\nof teeth', f:'(magnets?)' },
  { h:'UNIT 34', b:'2nd hand\n3rd hand\n4th hand', f:'' },
  { h:'UNIT 38', b:'for ren', f:'' },
  { h:'UNIT 40', b:'it moved this one\ncloser to the stairs', f:'it does that' },
  { h:'UNIT 41', b:'light inside stays on\nwith the door shut', f:'how do i know that' },
  { h:'UNIT 44', b:'do not stand in front\nof the open ones', f:'' },
  { h:'UNIT 47', b:'stock count: 6\nstock count: 6\nstock count: 7', f:'' },
  { h:'UNIT 52', b:'warranty void', f:'' },
  { h:'UNIT 55', b:'36 degrees', f:'it says that a lot' }
];
const TAG_LINES = {
  1: ['one.','you took one.','that one was mine.'],
  2: ['two.','put it back.','two. i felt that.'],
  3: ['three.','three. half the stock.','three. i can hear you breathing.'],
  4: ['four.','stop.','four. no.'],
  5: ['five.','five. no.','one left. no.']
};
const WHISPER_DORMANT = [
  "pick one, then.",
  "they hum. follow the hum.",
  "not that hum.",
  "the tags come off easy.",
  "it's thirty six degrees down here. always."
];
const WHISPER_ACTIVE = [
  "you left the light on.",
  "your steps are loud.",
  "i can hear the tag in your pocket.",
  "the door upstairs won't open from this side.",
  "there's a man upstairs. he falls over a lot.",
  "they're still dropping fridges up there. i feel it in the ceiling.",
  "that's not the boiler.",
  "left.",
  "you walked past one.",
  "i moved.",
  "shh.",
  "everything down here was somebody's.",
  "somebody used to work this shift. not anymore.",
  "i don't sell. i keep.",
  "you smell like upstairs.",
  "it's thirty six degrees down here.",
  "turn the light off. go on.",
  "i lost an E down here. years ago."
];
const WHISPER_HIDDEN = [ "you're in one of mine.", "i know which ones are empty.", "colder in there than you'd think." ];
const DEATH_LINES = {
  1:['one.','get up. there\'s six.'],
  2:['two.','back to the stairs.'],
  3:['three.','i keep a mark for every one.'],
  4:['four.','the wall\'s filling up.'],
  5:['five.','two more and it\'s full. i don\'t know what happens then.'],
  6:['six.','one more.']
};
const OPENERS_BACK = [ "you again.", "back down.", "the door shut behind you again.", "i heard the box.", "hi." ];

function fmtSince(ms){
  if(!ms || ms < 0) return null;
  const s = Math.floor(ms/1000); if(s < 90) return null;
  const m = Math.floor(s/60); if(m < 60) return m+' minute'+(m!==1?'s':'');
  const h = Math.floor(m/60); if(h < 24) return h+' hour'+(h!==1?'s':'');
  const d = Math.floor(h/24); return d+' day'+(d!==1?'s':'');
}

/* ============================================================
   TEXT UI
============================================================ */
let msgTimer = 0, whisperTimer = 0, countTimer = 0, noteTimer = 0;
function flash(txt, ms){
  ui.vbMsg.textContent = txt; ui.vbMsg.classList.add('on');
  clearTimeout(msgTimer); msgTimer = setTimeout(()=>ui.vbMsg.classList.remove('on'), ms || 2600);
}
function whisper(txt, ms){
  if(!txt) return;
  ui.vbWhisper.textContent = txt; ui.vbWhisper.classList.add('on');
  clearTimeout(whisperTimer); whisperTimer = setTimeout(()=>ui.vbWhisper.classList.remove('on'), ms || 4800);
}
function showCount(){
  ui.vbCount.textContent = found + ' / 6';
  ui.vbCount.classList.add('on');
  clearTimeout(countTimer); countTimer = setTimeout(()=>ui.vbCount.classList.remove('on'), 3200);
}
function showNote(n){
  ui.vbNoteHead.textContent = n.h; ui.vbNoteBody.textContent = n.b; ui.vbNoteFoot.textContent = n.f;
  ui.vbNote.style.setProperty('--tilt', ((Math.random()-0.5)*7).toFixed(1)+'deg');
  ui.vbNote.classList.add('on');
  clearTimeout(noteTimer); noteTimer = setTimeout(()=>ui.vbNote.classList.remove('on'), 3400);
}
function hint(txt, ms){
  ui.vbHint.textContent = txt; ui.vbHint.classList.add('on');
  setTimeout(()=>ui.vbHint.classList.remove('on'), ms || 6000);
}
function hideText(){
  ['vbMsg','vbWhisper','vbCount','vbNote','vbPrompt','vbHint'].forEach(k=>ui[k] && ui[k].classList.remove('on'));
}

/* ============================================================
   RENDER TARGET
============================================================ */
let CW = 0, CH = 0, img = null, buf = null, zbuf = null, FOCAL = 1, PLANE = 0.66, horizon = 0;
let scale = 0.5, fpsEMA = 16, lastScaleChange = 0;
const IS_TOUCH_GUESS = (window.matchMedia && matchMedia('(hover: none) and (pointer: coarse)').matches);
let touchMode = IS_TOUCH_GUESS;
function qualityScale(){
  const q = V.settings.quality;
  if(q === 'low') return 0.32;
  if(q === 'med') return 0.45;
  if(q === 'high') return 0.62;
  return scale;
}
function resize(force){
  const s = qualityScale();
  const vw = Math.max(1, window.innerWidth), vh = Math.max(1, window.innerHeight);
  const maxW = touchMode ? 520 : 760;
  let w = Math.round(vw*s), h = Math.round(vh*s);
  if(w > maxW){ h = Math.round(h*maxW/w); w = maxW; }
  w = Math.max(160, w); h = Math.max(100, h);
  if(!force && w === CW && h === CH) return;
  CW = w; CH = h;
  view.width = w; view.height = h;
  img = vctx.createImageData(w, h);
  buf = new Uint32Array(img.data.buffer);
  zbuf = new Float32Array(w);
  /* keep the horizontal view near 70 degrees in landscape; in portrait
     it narrows and you get more floor and ceiling, which is fine down here */
  PLANE = clamp(0.5*(w/h)/1.2, 0.42, 0.72);
  FOCAL = (w/2)/PLANE;
  scareCv.width = Math.min(1600, vw); scareCv.height = Math.round(scareCv.width*vh/vw);
}
window.addEventListener('resize', ()=>{ if(root && mode !== 'off'){ clearTimeout(resize._t); resize._t = setTimeout(()=>resize(), 120); } });

/* flashlight cone falloff, indexed by r^2 */
const CONE_N = 512, CONE_MAX = 4;
const CONE = new Float32Array(CONE_N);
for(let i=0;i<CONE_N;i++){
  const r2 = i/CONE_N*CONE_MAX, r = Math.sqrt(r2);
  const hot = r < 1 ? Math.pow(1 - r2, 1.6) : 0;
  const ring = Math.exp(-Math.pow((r-0.82)*5, 2))*0.18;
  const spill = 0.13/(1 + r2*2.2);
  CONE[i] = hot*1.05 + ring + spill;
}
const BAYER = new Float32Array([0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5].map(v=>(v+0.5)/16));
const Q = 20, QS = 256/Q;

/* ============================================================
   LIGHT PER FRAME
============================================================ */
function updateLights(dt){
  const now = gameT;
  const blk = now < blackoutUntil;
  const vx = ven.x, vy = ven.y, venNear = (ven.state !== 'dormant' || ven.ghost > 0.05);
  for(const L of lights){
    let target = L.dead ? 0 : L.i;
    if(blk) target = 0;
    if(!L.dead && !blk){
      if(L.k === 'tube' && Math.random() < 0.004*dt*60){ L.flickT = 0.08 + Math.random()*0.25; if(d2(L.x,L.y,P.x,P.y) < 64) A.zap(L.x, L.y); }
      if(L.dying && Math.random() < 0.02*dt*60) L.flickT = 0.05 + Math.random()*0.4;
      if(venNear){
        const dd = d2(L.x, L.y, vx, vy);
        if(dd < 16 && Math.random() < 0.25) L.flickT = 0.06;
      }
      if(escape) target *= 0.55 + 0.45*Math.sin(now*3.2 + L.id);
    }
    if(L.flickT > 0){ L.flickT -= dt; target *= Math.random() < 0.5 ? 0.05 : 0.5; }
    L.cur += (target - L.cur)*Math.min(1, dt*(target < L.cur ? 30 : 10));
  }
  LR.fill(0); LG.fill(0); LB.fill(0);
  const red = B.lightColor.red;
  for(const L of lights){
    if(L.cur < 0.01) continue;
    const col = escape ? red : B.lightColor[L.k];
    const cr = col[0]*L.cur, cg = col[1]*L.cur, cb = col[2]*L.cur;
    const vi = L.vi, vw = L.vw;
    for(let k=0;k<vi.length;k++){ const i = vi[k], w = vw[k]; LR[i] += cr*w; LG[i] += cg*w; LB[i] += cb*w; }
  }
}
function lightAt(x, y, outArr){
  if(x < 0 || y < 0 || x >= W || y >= H){ outArr[0]=outArr[1]=outArr[2]=0; return; }
  const ix = x|0, iy = y|0, fx = x-ix, fy = y-iy;
  const i0 = iy*VW1+ix, i1 = i0+1, i2 = i0+VW1, i3 = i2+1;
  const w0 = (1-fx)*(1-fy), w1 = fx*(1-fy), w2 = (1-fx)*fy, w3 = fx*fy;
  outArr[0] = LR[i0]*w0 + LR[i1]*w1 + LR[i2]*w2 + LR[i3]*w3;
  outArr[1] = LG[i0]*w0 + LG[i1]*w1 + LG[i2]*w2 + LG[i3]*w3;
  outArr[2] = LB[i0]*w0 + LB[i1]*w1 + LB[i2]*w2 + LB[i3]*w3;
}

/* ============================================================
   RENDER
============================================================ */
const AMB_R = 0.012, AMB_G = 0.014, AMB_B = 0.02;
const tmp3 = [0,0,0];
function flashPower(){
  if(!P.lightOn || gameT < blackoutUntil - 0.2 && gameT > blackoutUntil - 0.8) return 0;
  return P.lamp * P.flick;
}
function render(){
  const w = CW, h = CH, b32 = buf, zb = zbuf;
  const dX = Math.cos(P.ang), dY = Math.sin(P.ang);
  const pX = -dY*PLANE, pY = dX*PLANE;
  const f = FOCAL;
  const hor = horizon;
  const camZ = 0.5 + (P.hidden ? -0.04 : 0);
  const fl = flashPower();
  const cX = w*0.5 + P.swayX*w, cY = hor + P.swayY*h;
  const rc = h*0.62;
  const inv = 1/(rc*rc);
  const FR = 1.0*fl, FG = 0.9*fl, FB = 0.74*fl;
  const sauce = gameT < sauceUntil;
  const MAXD = 26;
  const WALL = M.wall, FLO = M.floor, CEI = M.ceil;
  const FT = B.ftex, CT = B.ctex, WT = B.tex, HT = B.hiddenTex;
  const px = P.x, py = P.y;

  /* floor and ceiling */
  const r0x = dX - pX, r0y = dY - pY;
  const sxw = 2*pX/w, syw = 2*pY/w;
  for(let y=0; y<h; y++){
    let o = y*w;
    const isF = y > hor;
    const pp = isF ? (y - hor) : (hor - y);
    if(pp === 0){ for(let x=0;x<w;x++) b32[o+x] = 0xff000000; continue; }
    const rowD = (isF ? camZ : (1-camZ))*f/pp;
    if(rowD > MAXD){ for(let x=0;x<w;x++) b32[o+x] = 0xff000000; continue; }
    const fog = 1/(1 + rowD*rowD*0.0045);
    const fa = 1/(1 + rowD*rowD*0.075);
    const dyy = (y - cY)*(y - cY)*inv;
    let fx = px + rowD*r0x, fy = py + rowD*r0y;
    const stx = rowD*sxw, sty = rowD*syw;
    const brow = (y&3)<<2;
    for(let x=0; x<w; x++, o++, fx+=stx, fy+=sty){
      const ix = fx|0, iy = fy|0;
      if(fx < 0 || fy < 0 || ix >= W || iy >= H){ b32[o] = 0xff000000; continue; }
      const ci = iy*W+ix;
      const tt = isF ? FT[FLO[ci]] : CT[CEI[ci]];
      if(!tt){ b32[o] = 0xff000000; continue; }
      const u = fx-ix, v = fy-iy;
      const tx = (u*tt.s)|0, ty = (v*tt.s)|0;
      const px32 = tt.d[(ty<<tt.sh)|tx];
      /* bilinear vertex light */
      const i0 = iy*VW1+ix, i2 = i0+VW1;
      const w0 = (1-u)*(1-v), w1 = u*(1-v), w2 = (1-u)*v, w3 = u*v;
      let lr = LR[i0]*w0 + LR[i0+1]*w1 + LR[i2]*w2 + LR[i2+1]*w3 + AMB_R;
      let lg = LG[i0]*w0 + LG[i0+1]*w1 + LG[i2]*w2 + LG[i2+1]*w3 + AMB_G;
      let lb = LB[i0]*w0 + LB[i0+1]*w1 + LB[i2]*w2 + LB[i2+1]*w3 + AMB_B;
      if(fl > 0){
        const dx = x - cX;
        const r2 = dx*dx*inv + dyy;
        const cone = r2 < CONE_MAX ? CONE[(r2*(CONE_N/CONE_MAX))|0] : 0.13/(1+r2*2.2);
        const fc = cone*fa;
        lr += FR*fc; lg += FG*fc; lb += FB*fc;
      }
      const dth = BAYER[brow|(x&3)];
      let kr = ((lr*fog*Q + dth)|0)*QS, kg = ((lg*fog*Q + dth)|0)*QS, kb = ((lb*fog*Q + dth)|0)*QS;
      let r = ((px32 & 255)*kr)>>8, g = (((px32>>>8) & 255)*kg)>>8, bb = (((px32>>>16) & 255)*kb)>>8;
      if(r > 255) r = 255; if(g > 255) g = 255; if(bb > 255) bb = 255;
      b32[o] = 0xff000000 | (bb<<16) | (g<<8) | r;
    }
  }

  /* walls */
  for(let x=0; x<w; x++){
    const cam = 2*x/w - 1;
    const rdx = dX + pX*cam, rdy = dY + pY*cam;
    let mx = px|0, my = py|0;
    const ddx = rdx === 0 ? 1e30 : Math.abs(1/rdx);
    const ddy = rdy === 0 ? 1e30 : Math.abs(1/rdy);
    let stX, stY, sdx, sdy;
    if(rdx < 0){ stX = -1; sdx = (px - mx)*ddx; } else { stX = 1; sdx = (mx + 1 - px)*ddx; }
    if(rdy < 0){ stY = -1; sdy = (py - my)*ddy; } else { stY = 1; sdy = (my + 1 - py)*ddy; }
    let side = 0, hit = 0, guard = 0, t = 0;
    while(!hit && guard++ < 96){
      if(sdx < sdy){ sdx += ddx; mx += stX; side = 0; } else { sdy += ddy; my += stY; side = 1; }
      if(mx < 0 || my < 0 || mx >= W || my >= H){ hit = 1; t = 1; break; }
      t = WALL[my*W+mx]; if(t) hit = 1;
    }
    let pd = side === 0 ? (sdx - ddx) : (sdy - ddy);
    if(pd < 0.03) pd = 0.03;
    zb[x] = pd;
    if(!hit || pd > MAXD) continue;
    if(pd < 4.6 && (x & 7) === 0 && x > w*0.22 && x < w*0.78 && SEEN_WALL[t] && (!B.hiddenMsg[t] || sauce)) seenFrame[t] = 1;
    let tex = (sauce && HT[t]) ? HT[t] : WT[t];
    if(!tex) tex = WT[1];
    let wx = side === 0 ? py + pd*rdy : px + pd*rdx;
    wx -= Math.floor(wx);
    let tx = (wx*tex.s)|0;
    if((side === 0 && rdx < 0) || (side === 1 && rdy > 0)) tx = tex.s - tx - 1;
    tx &= tex.m;
    /* light where the ray hit, pulled back off the wall a hair */
    const hx = px + pd*rdx - rdx*0.03, hy = py + pd*rdy - rdy*0.03;
    lightAt(hx, hy, tmp3);
    const sideK = side === 1 ? 0.78 : 1;
    const fog = sideK/(1 + pd*pd*0.0045);
    const fa = 1/(1 + pd*pd*0.075);
    const ar = (tmp3[0] + AMB_R), ag = (tmp3[1] + AMB_G), ab = (tmp3[2] + AMB_B);
    const top = hor - (1-camZ)*f/pd, bot = hor + camZ*f/pd;
    const span = bot - top;
    let y0 = Math.ceil(top), y1 = Math.floor(bot);
    if(y0 < 0) y0 = 0; if(y1 > h-1) y1 = h-1;
    const dx = x - cX, dxx = dx*dx*inv;
    const tstep = tex.s/span;
    let tpos = (y0 - top)*tstep;
    const td = tex.d, tsh = tex.sh, tm = tex.m;
    let o = y0*w + x;
    for(let y=y0; y<=y1; y++, o+=w, tpos+=tstep){
      const px32 = td[(((tpos|0)&tm)<<tsh)|tx];
      let lr = ar, lg = ag, lb = ab;
      if(fl > 0){
        const ddy2 = (y - cY); const r2 = dxx + ddy2*ddy2*inv;
        const cone = r2 < CONE_MAX ? CONE[(r2*(CONE_N/CONE_MAX))|0] : 0.13/(1+r2*2.2);
        const fc = cone*fa;
        lr += FR*fc; lg += FG*fc; lb += FB*fc;
      }
      const dth = BAYER[((y&3)<<2)|(x&3)];
      let kr = ((lr*fog*Q + dth)|0)*QS, kg = ((lg*fog*Q + dth)|0)*QS, kb = ((lb*fog*Q + dth)|0)*QS;
      let r = ((px32 & 255)*kr)>>8, g = (((px32>>>8) & 255)*kg)>>8, bb = (((px32>>>16) & 255)*kb)>>8;
      if(r > 255) r = 255; if(g > 255) g = 255; if(bb > 255) bb = 255;
      b32[o] = 0xff000000 | (bb<<16) | (g<<8) | r;
    }
  }

  drawSprites(dX, dY, camZ, fl, cX, cY, inv, FR, FG, FB);
  post();
  vctx.putImageData(img, 0, 0);
}

/* ---------- sprites ---------- */
const spriteList = [];
function pushSprite(spr, x, y, o){
  if(!spr) return;
  spriteList.push({ spr, x, y, z: o && o.z !== undefined ? o.z : spr.z, em: o && o.em !== undefined ? o.em : 1,
                    ec: o && o.ec, xray: o && o.xray, alpha: o && o.alpha !== undefined ? o.alpha : 1, d:0, emOnly: o && o.emOnly });
}
function gatherSprites(){
  spriteList.length = 0;
  const S = B.SPR;
  for(const L of lights){
    const on = L.cur > 0.08;
    if(L.k === 'bulb') pushSprite(on ? S.bulb : S.bulbOff, L.x, L.y, { em: L.cur/Math.max(0.01,L.i) });
    else if(L.k === 'tube') pushSprite(on ? S.tube : S.tubeOff, L.x, L.y, { em: L.cur/Math.max(0.01,L.i), ec: escape ? [255,60,40] : null });
    else if(L.k === 'blue') pushSprite(on ? S.blue : S.tubeOff, L.x, L.y, { em: L.cur/Math.max(0.01,L.i) });
  }
  for(const p of props){
    let s = null;
    if(p.sauceOnly && (gameT >= sauceUntil || p.used)) continue;
    switch(p.t){
      case 'sauce': s = p.used ? S.sauceGone : S.sauce; break;
      case 'magnet': s = p.used ? null : S.magnet; break;
      default: s = S[p.t];
    }
    if(p.t === 'unit00'){ pushSprite(s, p.x, p.y, { ec:[200,90,255], em:1, alpha:0.55 + 0.2*Math.sin(gameT*3) }); continue; }
    const o = { em: p.t === 'desk' ? (radioOn ? 1 : 0.6) : (p.t === 'boiler' ? 0.8 + Math.sin(gameT*7)*0.1 + Math.random()*0.1 : 1) };
    if(p.z !== undefined) o.z = p.z;
    pushSprite(s, p.x, p.y, o);
  }
  for(const hd of hides) pushSprite(hd.k === 'f' ? (hd.used ? S.hideFOpen : S.hideF) : (hd.used ? S.lockerOpen : S.locker), hd.x, hd.y);
  for(const t of tags) pushSprite(t.taken ? S.tagShut : S.tag, t.x, t.y, { em: t.taken ? 0 : 0.75 + 0.25*Math.sin(gameT*1.3 + t.x) });
  /* the dust in the beam */
  if(P.lightOn) for(const m of motes) pushSprite(S.dust, m.x, m.y, { z:m.z, emOnly:true, em:0.35 });
  /* it */
  const show = ven.state !== 'dormant' || ven.ghost > 0.02;
  if(show && !P.hidden || (P.hidden && show)){
    const frames = B.VEN.frames;
    if(frames.length){
      const row = frames[ven.door] || frames[0];
      const fr = row[((ven.phase*B.VEN.N)|0) % B.VEN.N];
      const ec = ven.glowColor;
      const alpha = ven.state === 'dormant' ? ven.ghost : 1;
      pushSprite(fr, ven.x, ven.y, { ec, em: 0.8 + 0.2*Math.sin(gameT*9) + ven.rage*0.3, alpha });
      if(gameT < sauceUntil) pushSprite(fr, ven.x, ven.y, { ec:[200,90,255], em:1, xray:true, alpha:0.55 });
    }
  }
}
function drawSprites(dX, dY, camZ, fl, cX, cY, inv, FR, FG, FB){
  gatherSprites();
  const w = CW, h = CH, b32 = buf, zb = zbuf, f = FOCAL, hor = horizon;
  const px = P.x, py = P.y;
  for(const s of spriteList){ const rx = s.x-px, ry = s.y-py; s.d = rx*dX + ry*dY; s.lat = rx*(-dY) + ry*dX; }
  spriteList.sort((a,b)=>b.d-a.d);
  for(const s of spriteList){
    const depth = s.d;
    if(depth < 0.12 || depth > 24) continue;
    const spr = s.spr;
    const sx = w*0.5 + f*s.lat/depth;
    const hp = f*spr.wh/depth;
    const wp = hp*spr.w/spr.h;
    const left = sx - wp/2, right = sx + wp/2;
    if(right < 0 || left >= w) continue;
    const bottom = hor + (camZ - s.z)*f/depth;
    const top = bottom - hp;
    let x0 = Math.max(0, Math.ceil(left)), x1 = Math.min(w-1, Math.floor(right));
    let y0 = Math.max(0, Math.ceil(top)), y1 = Math.min(h-1, Math.floor(bottom));
    if(x1 < x0 || y1 < y0) continue;
    lightAt(s.x, s.y, tmp3);
    const fog = 1/(1 + depth*depth*0.0045);
    const fa = 1/(1 + depth*depth*0.075);
    const ar = tmp3[0] + AMB_R, ag = tmp3[1] + AMB_G, ab = tmp3[2] + AMB_B;
    const sw = spr.w, sh = spr.h, sd = spr.d, se = spr.ei;
    const ec = s.ec || spr.ec, emk = s.em;
    const ecr = ec[0]*emk, ecg = ec[1]*emk, ecb = ec[2]*emk;
    const xs = sw/wp, ys = sh/hp;
    const alpha = s.alpha;
    for(let x=x0; x<=x1; x++){
      const behind = depth >= zb[x];
      if(behind && !s.xray) continue;
      if(s.xray && !behind) continue;
      const tx = Math.min(sw-1, ((x - left)*xs)|0);
      const dx = x - cX, dxx = dx*dx*inv;
      let o = y0*w + x;
      for(let y=y0; y<=y1; y++, o+=w){
        const ty = Math.min(sh-1, ((y - top)*ys)|0);
        const si = ty*sw + tx;
        const p = sd[si];
        const a = p>>>24;
        const e = se ? se[si] : 0;
        if(a < 110 && !e) continue;
        const dst = b32[o];
        let r, g, bb;
        if(s.xray){
          if(a < 110) continue;
          r = ((dst & 255) + ecr*0.5*alpha)|0; g = (((dst>>>8)&255) + ecg*0.3*alpha)|0; bb = (((dst>>>16)&255) + ecb*0.6*alpha)|0;
        } else if(a >= 110 && !s.emOnly){
          let lr = ar, lg = ag, lb = ab;
          if(fl > 0){
            const ddy2 = y - cY; const r2 = dxx + ddy2*ddy2*inv;
            const cone = r2 < CONE_MAX ? CONE[(r2*(CONE_N/CONE_MAX))|0] : 0.13/(1+r2*2.2);
            const fc = cone*fa; lr += FR*fc; lg += FG*fc; lb += FB*fc;
          }
          const dth = BAYER[((y&3)<<2)|(x&3)];
          const kr = ((lr*fog*Q + dth)|0)*QS, kg = ((lg*fog*Q + dth)|0)*QS, kb = ((lb*fog*Q + dth)|0)*QS;
          r = ((p & 255)*kr)>>8; g = (((p>>>8)&255)*kg)>>8; bb = (((p>>>16)&255)*kb)>>8;
          if(alpha < 1){ r = (r*alpha + (dst&255)*(1-alpha))|0; g = (g*alpha + ((dst>>>8)&255)*(1-alpha))|0; bb = (bb*alpha + ((dst>>>16)&255)*(1-alpha))|0; }
          if(e){ const k = e/255*alpha; r += ecr*k; g += ecg*k; bb += ecb*k; }
        } else {
          /* glow on its own: add it on top of what's there */
          let k = e/255*alpha*0.7;
          if(s.emOnly){
            const ddy2 = y - cY; const r2 = dxx + ddy2*ddy2*inv;
            k *= r2 < 1 ? (1-r2)*fl : 0;
            if(k <= 0.004) continue;
          }
          r = (dst & 255) + ecr*k; g = ((dst>>>8)&255) + ecg*k; bb = ((dst>>>16)&255) + ecb*k;
        }
        if(r > 255) r = 255; if(g > 255) g = 255; if(bb > 255) bb = 255;
        b32[o] = 0xff000000 | (bb<<16) | (g<<8) | (r|0);
      }
    }
  }
}

/* ---------- post ---------- */
let seed = 1234567;
function rnd(){ seed ^= seed << 13; seed ^= seed >>> 17; seed ^= seed << 5; return (seed >>> 0)/4294967296; }
function post(){
  const w = CW, h = CH, b32 = buf;
  const st = clamp(Math.pow(exposure, 1.6)*1.05 + (ven.state !== 'dormant' ? Math.max(0, 1 - Math.sqrt(d2(P.x,P.y,ven.x,ven.y))/2.2)*0.18 : 0), 0, 1);
  const sauce = gameT < sauceUntil;
  /* chromatic split when it's in your eyes */
  if(st > 0.22){
    const sh = Math.max(1, (st*5)|0);
    for(let y=0;y<h;y++){
      const o = y*w;
      for(let x=w-1; x>=sh; x--){
        const a = b32[o+x], b = b32[o+x-sh];
        b32[o+x] = (a & 0xffffff00) | (b & 0xff);
      }
    }
  }
  if(st > 0.02){
    const chance = st*0.6, amt = 0.25 + st*0.6;
    for(let i=0, n=w*h; i<n; i++){
      if(rnd() > chance) continue;
      const p = b32[i];
      const g = (rnd()*255*(0.4+st*0.6))|0;
      const r = ((p&255)*(1-amt) + g*amt)|0, gg = (((p>>>8)&255)*(1-amt) + g*amt)|0, bb = (((p>>>16)&255)*(1-amt) + g*amt)|0;
      b32[i] = 0xff000000 | (bb<<16) | (gg<<8) | r;
    }
    if(st > 0.45){
      const rows = 2 + ((st*8)|0);
      for(let k=0;k<rows;k++){
        const y = (rnd()*h)|0, s = ((rnd()-0.5)*st*30)|0, o = y*w;
        if(!s) continue;
        const row = b32.slice(o, o+w);
        for(let x=0;x<w;x++){ const sx = x - s; b32[o+x] = row[sx<0?0:(sx>=w?w-1:sx)]; }
      }
    }
  }
  if(sauce){
    const t = gameT*1.4;
    const a = 0.45 + 0.2*Math.sin(t);
    for(let i=0, n=w*h; i<n; i++){
      const p = b32[i]; const r = p&255, g = (p>>>8)&255, b = (p>>>16)&255;
      const nr = (r*(1-a) + b*a)|0, ng = (g*(1-a) + r*a*0.6)|0, nb = (b*(1-a) + g*a + 20*a)|0;
      b32[i] = 0xff000000 | ((nb>255?255:nb)<<16) | (ng<<8) | nr;
    }
  }
}

/* ============================================================
   VIEW / VISIBILITY
============================================================ */
function camSpace(x, y){
  const dX = Math.cos(P.ang), dY = Math.sin(P.ang);
  const rx = x - P.x, ry = y - P.y;
  return { depth: rx*dX + ry*dY, lat: rx*(-dY) + ry*dX };
}
function inView(x, y, margin){
  const c = camSpace(x, y);
  if(c.depth < 0.2) return false;
  if(Math.abs(c.lat)/c.depth > PLANE*(margin || 0.95)) return false;
  return los(P.x, P.y, x, y);
}
function centred(x, y, k){
  const c = camSpace(x, y);
  return c.depth > 0.2 && Math.abs(c.lat)/c.depth < (k || 0.14);
}

/* ============================================================
   FLOW FIELD (it walks the corridors, not through them)
============================================================ */
const flowQ = new Int16Array(W*H*2);
function flowTo(tx, ty){
  const key = (ty|0)*W + (tx|0);
  if(ven.flow && ven.flowKey === key && gameT - ven.flowAt < 1.2) return ven.flow;
  const d = ven.flow && ven.flow.length === W*H ? ven.flow : new Int16Array(W*H);
  d.fill(-1);
  const sx = clamp(tx|0, 0, W-1), sy = clamp(ty|0, 0, H-1);
  if(M.wall[sy*W+sx]){ ven.flow = d; ven.flowKey = key; ven.flowAt = gameT; return d; }
  let qh = 0, qt = 0;
  d[sy*W+sx] = 0; flowQ[qt++] = sx; flowQ[qt++] = sy;
  while(qh < qt){
    const cx = flowQ[qh++], cy = flowQ[qh++]; const cd = d[cy*W+cx];
    if(cx>0     && !M.wall[cy*W+cx-1]   && d[cy*W+cx-1]   < 0){ d[cy*W+cx-1] = cd+1;   flowQ[qt++]=cx-1; flowQ[qt++]=cy; }
    if(cx<W-1   && !M.wall[cy*W+cx+1]   && d[cy*W+cx+1]   < 0){ d[cy*W+cx+1] = cd+1;   flowQ[qt++]=cx+1; flowQ[qt++]=cy; }
    if(cy>0     && !M.wall[(cy-1)*W+cx] && d[(cy-1)*W+cx] < 0){ d[(cy-1)*W+cx] = cd+1; flowQ[qt++]=cx;   flowQ[qt++]=cy-1; }
    if(cy<H-1   && !M.wall[(cy+1)*W+cx] && d[(cy+1)*W+cx] < 0){ d[(cy+1)*W+cx] = cd+1; flowQ[qt++]=cx;   flowQ[qt++]=cy+1; }
  }
  ven.flow = d; ven.flowKey = key; ven.flowAt = gameT;
  return d;
}
function moveCircle(o, mx, my, r, solidProps){
  if(!isWall(o.x + mx + (mx>0?r:-r), o.y) && !isWall(o.x + mx + (mx>0?r:-r), o.y + r*0.7) && !isWall(o.x + mx + (mx>0?r:-r), o.y - r*0.7)) o.x += mx;
  if(!isWall(o.x, o.y + my + (my>0?r:-r)) && !isWall(o.x + r*0.7, o.y + my + (my>0?r:-r)) && !isWall(o.x - r*0.7, o.y + my + (my>0?r:-r))) o.y += my;
  if(solidProps){
    const push = (sx, sy, sr)=>{
      const dx = o.x - sx, dy = o.y - sy, dd = Math.hypot(dx, dy), min = sr + r;
      if(dd < min && dd > 0.0001){ const k = (min - dd)/dd; const nx = o.x + dx*k, ny = o.y + dy*k; if(!isWall(nx, o.y)) o.x = nx; if(!isWall(o.x, ny)) o.y = ny; }
    };
    for(const p of props) if(p.s) push(p.x, p.y, p.r);
    for(const hd of hides) push(hd.x, hd.y, 0.36);
    for(const t of tags) push(t.x, t.y, 0.3);
  }
}

/* ============================================================
   THE VENDOR
============================================================ */
function aggression(){
  if(tagMode) return 0.35 + found*0.06;
  let a = found/6;
  if(escape) a = 1.25;
  return a + Math.min(6, mem.deaths)*0.015;
}
function noise(x, y, radius){
  if(ven.state === 'dormant') return;
  if(d2(x, y, ven.x, ven.y) < radius*radius){ ven.lastX = x; ven.lastY = y; ven.knowT = gameT; }
}
function randomCellNear(x, y, rmin, rmax, needHidden){
  for(let i=0;i<120;i++){
    const c = cellList[(Math.random()*cellList.length)|0];
    const dd = Math.sqrt(d2(c[0],c[1],x,y));
    if(dd < rmin || dd > rmax) continue;
    if(needHidden && inView(c[0], c[1], 1.2)) continue;
    return c;
  }
  return null;
}
function teleport(intoView){
  const A_ = aggression();
  const R = escape ? 6 : clamp(15 - A_*10, 4.5, 15);
  const dX = Math.cos(P.ang), dY = Math.sin(P.ang);
  let best = null;
  for(let i=0;i<160;i++){
    const c = cellList[(Math.random()*cellList.length)|0];
    const dd = Math.sqrt(d2(c[0],c[1],P.x,P.y));
    if(dd < R*0.65 || dd > R*1.1) continue;
    const vis = inView(c[0], c[1], 1.15);
    if(intoView ? !vis : vis) continue;
    if(!intoView){
      const dot = ((c[0]-P.x)*dX + (c[1]-P.y)*dY)/dd;
      if(dot > 0.25 && Math.random() < 0.7) continue;      // rather behind you
    }
    best = c; break;
  }
  if(!best) return false;
  ven.x = best[0]; ven.y = best[1];
  ven.flowKey = -1;
  if(intoView){ A.stinger(); stingerCD = 10; }
  return true;
}
function startHunting(){
  if(ven.state !== 'dormant') return;
  ven.onBreak = false;
  ven.state = 'stalk'; ven.ghost = 0;
  const c = randomCellNear(P.x, P.y, 14, 30, true);
  if(c){ ven.x = c[0]; ven.y = c[1]; }
  ven.tpAt = gameT + 20; ven.alwaysAt = gameT + 22;
  ven.lastX = P.x; ven.lastY = P.y; ven.knowT = gameT;
}
function updateVendor(dt){
  stingerCD -= dt;
  const pd = Math.sqrt(d2(P.x,P.y,ven.x,ven.y));
  const A_ = aggression();
  ven.glowColor = tagMode ? [255,150,190] : (ven.rage > 0.7 ? [255,40,25] : (ven.rage > 0.35 ? [255,110,50] : [255,190,120]));

  /* ---- asleep: it shows up at the end of a corridor, then doesn't ---- */
  if(ven.state === 'dormant'){
    if(ven.onBreak){
      ven.phase = 0; ven.door = 0;
      const pdb = Math.sqrt(d2(P.x,P.y,ven.x,ven.y));
      if(pdb < 6 && inView(ven.x, ven.y) && centred(ven.x, ven.y, 0.25)){
        ven.onBreak = false; ven.ghost = 0.99; ven.ghostUntil = gameT + 0.25; ven.glimpseAt = gameT + 20;
        V.see('event:break'); A.stinger(); stingerCD = 10;
        setTimeout(()=>{ if(mode==='play') whisper("i was on my break."); }, 1400);
      }
      ven.inView = false;
      return;
    }
    if(ven.ghost <= 0 && gameT > ven.glimpseAt){
      for(let i=0;i<60;i++){
        const c = cellList[(Math.random()*cellList.length)|0];
        const dd = Math.sqrt(d2(c[0],c[1],P.x,P.y));
        if(dd < 6 || dd > 13) continue;
        if(!inView(c[0], c[1], 0.8)) continue;
        ven.x = c[0]; ven.y = c[1]; ven.ghost = 1; ven.ghostUntil = gameT + 0.7 + Math.random()*0.8;
        break;
      }
      ven.glimpseAt = gameT + 13 + Math.random()*14;
    }
    if(ven.ghost > 0){
      if(gameT > ven.ghostUntil || centred(ven.x, ven.y, 0.08)) ven.ghost = Math.max(0, ven.ghost - dt*6);
      if(inView(ven.x, ven.y) && ven.ghost > 0.5){ exposure = Math.min(0.5, exposure + dt*0.35); }
    }
    ven.rage = 0; ven.door = 0;
    ven.inView = false;
    return;
  }

  /* ---- awake ---- */
  const seen = !P.hidden && inView(ven.x, ven.y);
  ven.wasInView = ven.inView; ven.inView = seen;
  if(seen && !ven.wasInView && pd < 9 && stingerCD <= 0){ A.stinger(); stingerCD = 12; }

  /* what it knows */
  const canSee = !P.hidden && pd < 18 && los(ven.x, ven.y, P.x, P.y) && (P.lightOn || pd < 4 || (P.moving && pd < 7));
  if(canSee){ ven.lastX = P.x; ven.lastY = P.y; ven.knowT = gameT; }
  if(gameT > ven.alwaysAt && !P.hidden){
    /* it always knows, eventually */
    ven.alwaysAt = gameT + clamp(30 - A_*18, 9, 30) + Math.random()*8;
    ven.lastX = P.x; ven.lastY = P.y; ven.knowT = gameT;
  }
  if(gameT < tapeUntil){ ven.lastX = tapeX; ven.lastY = tapeY; ven.knowT = gameT; }

  /* where it's going */
  let tx, ty;
  if(ven.hideTarget){ tx = ven.hideTarget.x + ven.hideTarget.fx*0.9; ty = ven.hideTarget.y + ven.hideTarget.fy*0.9; }
  else if(ven.passSpot){ tx = ven.passSpot.x; ty = ven.passSpot.y; }
  else if(gameT - ven.knowT < 22){ tx = ven.lastX; ty = ven.lastY; }
  else {
    if(gameT > ven.wanderAt || d2(ven.x, ven.y, ven.wanderX, ven.wanderY) < 1){
      const c = randomCellNear(P.x, P.y, 5, 13, false) || cellList[(Math.random()*cellList.length)|0];
      ven.wanderX = c[0]; ven.wanderY = c[1]; ven.wanderAt = gameT + 12;
    }
    tx = ven.wanderX; ty = ven.wanderY;
  }

  /* speed */
  let sp = escape ? 2.75 : (0.75 + A_*1.55);
  if(tagMode) sp = 1.5 + found*0.12;
  if(!P.lightOn && !canSee) sp *= 0.8;
  const frozenByGaze = seen && !escape && found < 4 && pd > 1.4;
  if(seen && !frozenByGaze) sp *= 0.6;
  if(ven.passSpot && d2(ven.x,ven.y,ven.passSpot.x,ven.passSpot.y) < 0.3){
    sp = 0;
    if(gameT > ven.passUntil){ ven.passSpot = null; ven.knowT = -99; ven.wanderAt = 0; }
  }
  ven.moving = false;
  if(!frozenByGaze && sp > 0 && !(god && pd < 1.2)){
    const step = sp*dt;
    let vx, vy;
    const dT = Math.sqrt(d2(ven.x, ven.y, tx, ty));
    if(dT < 1.6 || (dT < 6 && los(ven.x, ven.y, tx, ty))){ vx = (tx-ven.x)/(dT||1); vy = (ty-ven.y)/(dT||1); }
    else {
      const fl = flowTo(tx, ty);
      const cx = ven.x|0, cy = ven.y|0;
      let best = fl[cy*W+cx]; if(best < 0) best = 32000;
      let bx = cx, by = cy;
      const nb = [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];
      for(const n of nb){
        const nx = cx+n[0], ny = cy+n[1];
        if(nx<0||ny<0||nx>=W||ny>=H) continue;
        if(n[0] && n[1] && (M.wall[cy*W+nx] || M.wall[ny*W+cx])) continue;
        const v = fl[ny*W+nx];
        if(v >= 0 && v < best){ best = v; bx = nx; by = ny; }
      }
      vx = bx + 0.5 - ven.x; vy = by + 0.5 - ven.y;
      const m = Math.hypot(vx, vy) || 1; vx /= m; vy /= m;
    }
    if(dT > 0.05){
      const ox = ven.x, oy = ven.y;
      moveCircle(ven, vx*Math.min(step, dT), vy*Math.min(step, dT), 0.22, false);
      ven.moving = Math.abs(ven.x-ox) + Math.abs(ven.y-oy) > 0.0005;
    }
  }
  if(ven.moving){
    ven.phase = (ven.phase + dt*sp*0.55) % 1;
    if(gameT > ven.stepAt){
      ven.stepAlt = !ven.stepAlt;
      ven.stepAt = gameT + (ven.stepAlt ? 0.38 : 0.62)/Math.max(0.6, sp*0.7);
      A.venStep(ven.x, ven.y, !los(ven.x, ven.y, P.x, P.y), sp > 2);
    }
  }

  /* teleport, the old forest way */
  if(gameT > ven.tpAt && !ven.hideTarget && !ven.passSpot){
    const interval = escape ? 6 : clamp(26 - A_*17, 7, 26);
    ven.tpAt = gameT + interval*(0.7 + Math.random()*0.6);
    const R = escape ? 6 : clamp(15 - A_*10, 4.5, 15);
    if(!seen && pd > R){
      const intoView = (found >= 5 || escape) && Math.random() < 0.3;
      teleport(intoView);
    }
  }

  /* rage, door, light */
  ven.rage = clamp(A_*0.75 + (pd < 5 ? (5-pd)/5*0.4 : 0), 0, 1);
  ven.door = pd < 2.6 || ven.rage > 0.78 ? 2 : (ven.rage > 0.4 ? 1 : 0);

  /* staring at it */
  if(seen && pd < 15 && !tagMode){
    const rate = (0.1 + 0.65*(1 - pd/15)) * (0.7 + A_*0.5) * (P.lightOn ? 1 : 0.65);
    exposure += rate*dt;
  } else exposure -= dt*0.3;
  exposure = clamp(exposure, 0, 1);
  if(exposure >= 1 && !god) return caught('stare');

  /* hiding */
  if(P.hidden){
    const hd = P.hidden;
    if(ven.hideTarget === hd && d2(ven.x, ven.y, hd.x + hd.fx*0.9, hd.y + hd.fy*0.9) < 0.5 && !god) return caught('found');
  } else if(pd < 0.6 && !god){
    return caught('touch');
  }
}

/* ============================================================
   PLAYER
============================================================ */
const keys = {};
let lookDX = 0, lookDY = 0;
const stick = { id:null, ox:0, oy:0, x:0, y:0, run:false };
let lookTouch = null;
function surfaceAt(x, y){ return M.floor[(y|0)*W+(x|0)] || 1; }
function updatePlayer(dt){
  const sens = V.settings.sens;
  const inv = V.settings.invertY ? -1 : 1;
  let turn = 0;
  if(keys['arrowleft']) turn -= 1;
  if(keys['arrowright']) turn += 1;
  const prevAng = P.ang;
  P.ang += turn*2.2*dt*sens + lookDX*0.0024*sens;
  P.pitch = clamp(P.pitch - lookDY*0.9*sens*inv, -CH*0.32, CH*0.32);
  lookDX = 0; lookDY = 0;
  if(P.hidden){
    const hd = P.hidden, base = Math.atan2(hd.fy, hd.fx);
    let da = P.ang - base; while(da > Math.PI) da -= Math.PI*2; while(da < -Math.PI) da += Math.PI*2;
    P.ang = base + clamp(da, -0.35, 0.35);
  }
  P.turnVel = (P.ang - prevAng)/Math.max(dt, 0.001);

  let fwd = 0, str = 0;
  if(!P.hidden){
    if(keys['w']||keys['arrowup']) fwd += 1;
    if(keys['s']||keys['arrowdown']) fwd -= 1;
    if(keys['a']) str -= 1;
    if(keys['d']) str += 1;
    if(stick.id !== null){ fwd += stick.y; str += stick.x; }
  }
  fwd = clamp(fwd,-1,1); str = clamp(str,-1,1);
  const want = Math.hypot(fwd, str);
  const sprintKey = keys['shift'] || stick.run;
  P.sprinting = sprintKey && fwd > 0.3 && !P.exhausted && P.stamina > 0.02;
  if(P.sprinting){ P.stamina -= dt*0.2; if(P.stamina <= 0){ P.stamina = 0; P.exhausted = true; } P.restAt = gameT + 0.9; }
  else if(gameT > (P.restAt||0)){ P.stamina = Math.min(1, P.stamina + dt*0.13); if(P.stamina > 0.35) P.exhausted = false; }
  const spd = (P.sprinting ? 3.4 : 1.95) * (fwd < 0 ? 0.7 : 1);
  const dX = Math.cos(P.ang), dY = Math.sin(P.ang);
  let mvx = (dX*fwd - dY*str*0.85), mvy = (dY*fwd + dX*str*0.85);
  const m = Math.hypot(mvx, mvy); if(m > 1){ mvx /= m; mvy /= m; }
  const ox = P.x, oy = P.y;
  if(want > 0.05) moveCircle(P, mvx*spd*dt, mvy*spd*dt, 0.22, true);
  const moved = Math.hypot(P.x-ox, P.y-oy);
  P.moving = moved > 0.0008;
  if(P.moving) P.lastMoveT = gameT;

  /* head bob, breath, flashlight sway */
  if(P.moving){ P.bob += dt*(P.sprinting ? 13 : 8.5); P.bobAmt += (1-P.bobAmt)*Math.min(1,dt*6); }
  else P.bobAmt += (0-P.bobAmt)*Math.min(1,dt*4);
  const bobY = Math.sin(P.bob)*CH*(P.sprinting ? 0.022 : 0.014)*P.bobAmt*(V.settings.shake ? 1 : 0.3);
  const breathe = Math.sin(gameT*1.6)*CH*0.004*(1-P.bobAmt);
  let shake = 0;
  if(ven.state !== 'dormant' && V.settings.shake){
    const pd = Math.sqrt(d2(P.x,P.y,ven.x,ven.y));
    if(pd < 6) shake = (6-pd)/6*CH*0.012;
  }
  horizon = clamp(((CH*0.5 + P.pitch + bobY + breathe + (Math.random()-0.5)*shake))|0, 4, CH-4);
  const tvx = clamp(-P.turnVel*0.03, -0.12, 0.12) + Math.cos(P.bob*0.5)*0.012*P.bobAmt;
  const tvy = Math.abs(Math.sin(P.bob))*0.02*P.bobAmt;
  P.swayX += (tvx - P.swayX)*Math.min(1, dt*6);
  P.swayY += (tvy - P.swayY)*Math.min(1, dt*6);

  /* footsteps, and they make noise */
  if(P.moving){
    P.stepAcc += moved;
    const stride = P.sprinting ? 0.95 : 0.72;
    if(P.stepAcc > stride){
      P.stepAcc = 0;
      A.step(surfaceAt(P.x, P.y), P.sprinting);
      noise(P.x, P.y, P.sprinting ? 11 : (surfaceAt(P.x,P.y) === 3 ? 6 : 3.2));
    }
  }

  /* the light */
  P.lamp = Math.max(0.16, P.lamp - dt*0.0055);
  P.shakeCD -= dt;
  if(P.flickT > 0){ P.flickT -= dt; P.flick = Math.random() < 0.5 ? 0.05 : 0.6; }
  else P.flick = 1;
  if(P.lamp < 0.32 && Math.random() < dt*0.6) P.flickT = 0.06 + Math.random()*0.12;
  if(ven.state !== 'dormant' && d2(P.x,P.y,ven.x,ven.y) < 25 && Math.random() < dt*3) P.flickT = 0.05 + Math.random()*0.08;

  /* fear */
  let tf = exposure*0.8;
  if(ven.state !== 'dormant'){ const pd = Math.sqrt(d2(P.x,P.y,ven.x,ven.y)); tf = Math.max(tf, clamp((9 - pd)/9, 0, 1)); }
  if(escape) tf = Math.max(tf, 0.45);
  if(P.hidden) tf = Math.max(tf, 0.4);
  fear += (tf - fear)*Math.min(1, dt*2);

  /* hiding: the cold gets in */
  if(P.hidden){
    P.hideT += dt;
    ui.vbFrost.style.opacity = clamp((P.hideT - 18)/25, 0, 0.9).toFixed(2);
    if(P.hideT > 26 && !P.hidden.warned){ P.hidden.warned = true; whisper("you can't stay in there."); }
    if(P.hideT > 40 && !ven.hideTarget && ven.state !== 'dormant'){ ven.hideTarget = P.hidden; }
  }

  /* dust drifts with you */
  for(const m of motes){
    m.x += m.vx*dt; m.y += m.vy*dt; m.z += m.vz*dt;
    if(m.z < 0.08 || m.z > 0.9) m.vz = -m.vz;
    if(d2(m.x, m.y, P.x, P.y) > 9){ const a = P.ang + (Math.random()-0.5)*1.2, r = 0.6 + Math.random()*2.2; m.x = P.x + Math.cos(a)*r; m.y = P.y + Math.sin(a)*r; }
  }
}
function toggleLight(){
  if(mode !== 'play') return;
  P.lightOn = !P.lightOn; A.click(P.lightOn);
  noise(P.x, P.y, 2);
}
function shakeLight(){
  if(mode !== 'play' || P.shakeCD > 0) return;
  P.shakeCD = 0.45;
  A.rattle();
  P.lamp = Math.min(1, P.lamp + 0.32);
  P.flickT = 0.12;
  if(!P.lightOn){ P.lightOn = true; A.click(true); }
  noise(P.x, P.y, 6);
}

/* ============================================================
   INTERACTION
============================================================ */
function facing(x, y, k){
  const c = camSpace(x, y);
  const dd = Math.hypot(c.depth, c.lat);
  return c.depth > 0 && c.depth/dd > (k || 0.55);
}
function findInteract(){
  let best = null, bd = 99;
  const consider = (o, x, y, reach, label, k)=>{
    const dd = Math.sqrt(d2(P.x, P.y, x, y));
    if(dd > reach || dd >= bd) return;
    if(!facing(x, y, k)) return;
    if(!los(P.x, P.y, x, y) && dd > 0.9) return;
    best = { o, label }; bd = dd;
  };
  if(P.hidden){ return { o:{ kind:'unhide' }, label:'get out' }; }
  for(const t of tags) if(!t.taken) consider({ kind:'tag', t }, t.x, t.y, 1.25, 'take the tag');
  for(const hd of hides) if(!hd.used) consider({ kind:'hide', hd }, hd.x, hd.y, 1.3, hd.k === 'f' ? 'get in the fridge' : 'get in the locker');
  for(const p of props){
    if(p.use === 'radio') consider({ kind:'radio', p }, p.x, p.y, 1.35, radioStation === 0 ? 'turn the radio on' : (radioStation === 1 ? 'change the station' : 'turn the radio off'));
    if(p.use === 'wurst') consider({ kind:'wurst', p }, p.x, p.y, 1.3, gameT < wurstRingUntil ? 'answer it' : 'look at the bratwurst', 0.45);
    if(p.use === 'watch' && !p.used) consider({ kind:'watch', p }, p.x, p.y, 1.15, 'pick up the watch', 0.45);
    if(p.use === 'miasma') consider({ kind:'miasma', p }, p.x, p.y, 1.25, 'smell it', 0.45);
    if(p.use === 'paper') consider({ kind:'paper', p }, p.x, p.y, 1.3, 'read the paper', 0.45);
    if(p.use === 'unit00' && !p.used && gameT < sauceUntil) consider({ kind:'unit00', p }, p.x, p.y, 1.25, 'take the tag');
    if(p.use === 'tape' && gameT > tapeUntil + 30) consider({ kind:'tape', p }, p.x, p.y, 1.2, 'press play');
    if(p.use === 'sauce' && !p.used) consider({ kind:'sauce', p }, p.x, p.y, 1.2, 'drink it');
    if(p.use === 'magnet' && !p.used) consider({ kind:'magnet', p }, p.x, p.y, 1.1, 'pick up the E', 0.4);
  }
  consider({ kind:'door' }, B.DOOR.x, 1.05, 1.7, escape ? 'get out' : 'try the door', 0.4);
  return best;
}
function interact(){
  if(mode !== 'play') return;
  const it = interactTarget; if(!it) return;
  const o = it.o;
  switch(o.kind){
    case 'tag': takeTag(o.t); break;
    case 'hide': enterHide(o.hd); break;
    case 'unhide': exitHide(); break;
    case 'radio':
      radioStation = (radioStation + 1) % 3; radioOn = radioStation > 0;
      A.radio(o.p.x, o.p.y, radioOn, radioStation); A.click(radioOn);
      if(radioStation === 1){ V.patch(m=>{ m.radio++; }); V.see('used:radio'); whisper(pick(["that station doesn't exist down here.","sixty nine point four two zero. nothing plays on it.","it only knows the one song. it's not a song."])); }
      if(radioStation === 2){ V.see('used:radio2'); whisper(pick(["that one isn't for listening to.","you'd have to see that one to get it."])); }
      noise(P.x, P.y, 5);
      break;
    case 'wurst':
      if(gameT < wurstRingUntil){
        wurstRingUntil = -1; if(o.p.ring) o.p.ring.stop(0.05);
        V.see('used:phone');
        showNote({ h:'INCOMING', b:"it's you. later.\ndon't drink the sauce.", f:"you already drank it. didn't you." });
        A.near('vn_click');
      } else flash(pick(["it's a bratwurst. it's warm.", "there's no wire coming out of it."]), 2200);
      break;
    case 'watch':
      o.p.used = true; V.see('used:watch'); A.near('quartz', { gain:0.9 });
      showNote({ h:'WATCH', b:'gold. heavy for its size.\nthe second hand ticks\nonce a second.', f:'real ones sweep.' });
      break;
    case 'miasma':
      V.see('used:miasma'); A.near('spray');
      flash(pick(['formaldehyde. and something sweet under it.', 'it smells like a waiting room.']), 2600);
      break;
    case 'paper':
      V.see('used:paper'); A.near('paper');
      ui.vbNote.classList.add('news');
      showNote({ h:'GUNSMOKE PRESS', b:'SHOPKEEPER MISSING\nbasement searched.\nnothing found but stock.', f:'five cents' });
      setTimeout(()=>ui.vbNote.classList.remove('news'), 3600);
      break;
    case 'unit00':
      o.p.used = true; V.see('tag:00'); A.tag();
      showNote({ h:'UNIT 00', b:'you.', f:'not for sale' });
      setTimeout(()=>{ if(mode==='play') whisper("put that back."); }, 2600);
      break;
    case 'tape':
      tapeX = o.p.x; tapeY = o.p.y;
      { const len = A.tape(tapeX, tapeY) || 6; tapeUntil = gameT + len; }
      V.patch(m=>{ m.tapes++; }); V.see('used:tape');
      startHunting();
      ven.lastX = tapeX; ven.lastY = tapeY; ven.knowT = gameT;
      setTimeout(()=>{ if(mode==='play') whisper(pick(["turn that off.","that's the one from upstairs. the screaming one.","i can hear that through the ceiling every day. not down here too."])); }, 1500);
      break;
    case 'sauce':
      o.p.used = true; sauceUsed = true; sauceUntil = gameT + 32;
      A.gulp(); A.near('sauce_trip', { gain:0.6 }); V.patch(m=>{ m.sauce++; }); V.see('used:sauce');
      flash('you drink it.', 2000);
      setTimeout(()=>{ if(mode==='play') whisper("oh. you can see me now.", 5200); }, 2600);
      break;
    case 'magnet':
      o.p.used = true; A.magnet(); V.buzz(15);
      V.patch(m=>{ m.hasE = true; }); V.see('used:magnet');
      flash('a magnet. the letter E.', 2200);
      setTimeout(()=>{ if(mode==='play') whisper(ven.state === 'dormant' ? "that's mine." : "that's mine. give it back. later. not now."); }, 2400);
      break;
    case 'door':
      if(escape){ win(); }
      else { A.lockRattle(B.DOOR.x, B.DOOR.y); flash(found === 0 ? 'locked.' : 'locked. ' + (6-found) + ' more.', 1600); noise(P.x, P.y, 7); }
      break;
  }
}
function takeTag(t){
  t.taken = true; found++;
  A.tag(t.x, t.y); A.killFridge(t);
  V.buzz(15);
  showNote(t.note);
  V.see('tag:' + t.note.h.replace(/\D/g, ''));
  showCount();
  V.patch(m=>{ m.tagsTotal++; if(found > m.bestChamber) m.bestChamber = found; });
  noise(t.x, t.y, 6);
  if(found === 1){
    startHunting();
    setTimeout(()=>{ if(mode==='play'){ flash(tagMode ? 'one. i\'m coming.' : pick(TAG_LINES[1])); A.lightsOut(); } }, 900);
    whisperQ.unshift("it's up.");
  } else if(found < 6){
    const n = found;
    setTimeout(()=>{ if(mode==='play') flash(pick(TAG_LINES[n])); }, 900);
  }
  if(found >= 2 && found < 6) killLights(found >= 4 ? 3 : 2);
  if(found === 3) setTimeout(()=>blackout(2.6), 2500);
  if(found === 5) setTimeout(scriptedScare, 1600);
  if(found === 6) setTimeout(beginEscape, 700);
}
function killLights(n){
  const live = lights.filter(L=>!L.dead && !L.keep);
  shuffle(live).slice(0, n).forEach((L,i)=>{
    setTimeout(()=>{ L.dead = true; L.flickT = 0.3; A.pop(L.x, L.y); }, 300 + i*700 + Math.random()*500);
  });
}
function blackout(dur){
  blackoutUntil = gameT + dur;
  A.lightsOut();
  P.flickT = 0.5;
  if(ven.state !== 'dormant' && !inView(ven.x, ven.y)){
    const c = randomCellNear(P.x, P.y, 2.2, 4.5, true);
    if(c && Math.random() < 0.6){ ven.x = c[0]; ven.y = c[1]; }
  }
}
function scriptedScare(){
  if(mode !== 'play') return;
  blackout(1.4);
  setTimeout(()=>{
    if(mode !== 'play' || P.hidden) return;
    const dX = Math.cos(P.ang), dY = Math.sin(P.ang);
    for(let r=2.4; r<4.5; r+=0.4){
      const x = P.x + dX*r, y = P.y + dY*r;
      if(isWall(x,y)) break;
      if(r >= 2.4 && !isWall(x,y)){ ven.x = x; ven.y = y; }
    }
    ven.flowKey = -1;
    A.stinger(); stingerCD = 8;
    exposure = Math.max(exposure, 0.35);
  }, 1200);
}
function beginEscape(){
  if(mode !== 'play') return;
  escape = true;
  A.unlock(B.DOOR.x, B.DOOR.y);
  flash(tagMode ? 'six. get to the door before i get to you.' : 'six. the door\'s open.', 3200);
  setTimeout(()=>{ if(mode==='play') whisper(tagMode ? "go." : "go on, then. run."); }, 3400);
  ven.tpAt = gameT + 3;
  if(!tagMode) ven.alwaysAt = gameT + 2;
}

/* ---------- hiding ---------- */
function enterHide(hd){
  if(P.hidden) return;
  /* if it saw you get in, it knows which one */
  const pd = Math.sqrt(d2(P.x,P.y,ven.x,ven.y));
  const saw = ven.state !== 'dormant' && pd < 12 && los(ven.x, ven.y, P.x, P.y);
  P.hidden = hd; P.hideT = 0; hd.warned = false;
  P.preX = P.x; P.preY = P.y;
  P.x = hd.x + hd.fx*0.05; P.y = hd.y + hd.fy*0.05;
  P.ang = Math.atan2(hd.fy, hd.fx); P.pitch = 0;
  A.hideDoor(false, hd.k);
  ui.vbHide.classList.add('on'); ui.vbHide.classList.toggle('locker', hd.k === 'l');
  ui.vbFrost.style.opacity = '0';
  if(saw){ ven.hideTarget = hd; }
  else if(ven.state !== 'dormant' && pd < 11 && Math.random() < 0.75){
    /* it comes and stands right outside. then it goes. */
    ven.passSpot = { x: hd.x + hd.fx*1.6, y: hd.y + hd.fy*1.6 };
    if(isWall(ven.passSpot.x, ven.passSpot.y)) ven.passSpot = { x: hd.x + hd.fx*1.0, y: hd.y + hd.fy*1.0 };
    ven.passUntil = gameT + 999;
    setTimeout(()=>{ if(ven.passSpot) ven.passUntil = gameT + 2.5 + Math.random()*2; }, 9000);
  }
  ven.knowT = -99;
  setTimeout(()=>{ if(P.hidden === hd && mode==='play' && Math.random() < 0.5) whisper(pick(WHISPER_HIDDEN)); }, 6000);
}
function exitHide(){
  const hd = P.hidden; if(!hd) return;
  hd.used = true;
  P.hidden = null;
  P.x = hd.x + hd.fx*0.85; P.y = hd.y + hd.fy*0.85;
  if(isWall(P.x, P.y)){ P.x = P.preX; P.y = P.preY; }
  A.hideDoor(true, hd.k);
  ui.vbHide.classList.remove('on');
  if(ven.hideTarget === hd) ven.hideTarget = null;
  noise(P.x, P.y, 5);
}

/* ============================================================
   EVENTS
   every half a minute or so, something happens. what can happen
   depends on where you are and how far along you are.
============================================================ */
function nearestFridgeProp(maxD){
  let best = null, bd = maxD*maxD;
  for(const p of props){ if(p.t !== 'display') continue; const dd = d2(p.x,p.y,P.x,P.y); if(dd < bd && !inView(p.x,p.y)){ bd = dd; best = p; } }
  for(const hd of hides){ if(hd.used || hd.k !== 'f') continue; const dd = d2(hd.x,hd.y,P.x,P.y); if(dd < bd && !inView(hd.x,hd.y)){ bd = dd; best = hd; } }
  return best;
}
function behind(dist){ return { x: P.x - Math.cos(P.ang)*dist, y: P.y - Math.sin(P.ang)*dist }; }
const EVENTS = {
  knock(){
    const f = nearestFridgeProp(9); if(!f) return false;
    A.at('fridge_knock', f.x, f.y, { occ: !los(P.x,P.y,f.x,f.y), gain:0.9 });
    if(f.k === 'f' && Math.random() < 0.5) setTimeout(()=>{ f.used = true; A.at('hide_fridge_out', f.x, f.y, { gain:0.6 }); }, 2600);
    return true;
  },
  echo(){
    /* your own footsteps, a few more of them than you took */
    if(P.moving || gameT - (P.lastMoveT||0) > 1.2) return false;
    for(let k=0;k<3;k++) setTimeout(()=>{ if(mode !== 'play') return; const b = behind(2.2 + k*0.4); A.stepAt(surfaceAt(b.x, b.y), b.x, b.y); }, 380 + k*470);
    return true;
  },
  breath(){
    if(ven.state === 'dormant' || ven.inView || d2(P.x,P.y,ven.x,ven.y) < 36) return false;
    const b = behind(1.1);
    if(isWall(b.x, b.y)) return false;
    A.at('ven_breath', b.x, b.y, { hrtf:true, gain:1, ref:0.8 });
    fear = Math.min(1, fear + 0.35);
    return true;
  },
  radio(){
    if(radioOn || evDone.radio || d2(P.x,P.y,6.5,30.5) > 256) return false;
    radioStation = 1; radioOn = true; A.radio(6.5, 30.5, true, 1);
    return true;
  },
  surge(){
    const live = lights.filter(L=>L.k === 'tube' && !L.dead && !L.keep && d2(L.x,L.y,P.x,P.y) < 64);
    if(!live.length) return false;
    const L = pick(live);
    A.at('power_surge', L.x, L.y, { gain:0.8 });
    L.flickT = 2;
    setTimeout(()=>{ L.dead = true; A.pop(L.x, L.y); }, 2050);
    return true;
  },
  steam(){
    if(lastZone !== 2 && lastZone !== 3) return false;
    const a = P.ang + (Math.random()-0.5)*1.2, x = P.x + Math.cos(a)*3, y = P.y + Math.sin(a)*3;
    A.at('steam', isWall(x,y) ? P.x : x, isWall(x,y) ? P.y : y, { gain:0.8 });
    steamUntil = gameT + 3.2;
    ui.vbSteam.classList.add('on'); setTimeout(()=>ui.vbSteam.classList.remove('on'), 2600);
    return true;
  },
  shelf(){
    if(lastZone !== 5 || evDone.shelf) return false;
    const c = randomCellNear(P.x, P.y, 4, 9, true); if(!c) return false;
    A.at('shelf_crash', c[0], c[1], { gain:0.9 });
    noise(c[0], c[1], 14);
    return true;
  },
  stairs(){
    if(evDone.stairs || d2(P.x,P.y,10.5,2) > 144) return false;
    A.at('stairs_fall', 10.5, 0.8, { gain:0.9, ref:2 });
    setTimeout(()=>{ if(mode==='play') whisper("the little man fell down the stairs again."); }, 3200);
    return true;
  },
  vigil(){
    /* a light far off goes out. when it comes back on, it's standing under it. */
    if(ven.state !== 'dormant' || ven.onBreak) return false;
    const far = lights.filter(L=>!L.dead && L.k === 'bulb' && d2(L.x,L.y,P.x,P.y) > 49 && d2(L.x,L.y,P.x,P.y) < 225 && inView(L.x, L.y, 0.9));
    if(!far.length) return false;
    const L = pick(far);
    L.flickT = 0.7;
    setTimeout(()=>{ if(ven.state !== 'dormant' || mode !== 'play') return; ven.x = L.x; ven.y = L.y + 0.3; ven.ghost = 1; ven.ghostUntil = gameT + 0.9; }, 750);
    return true;
  },
  name(){
    const n = mem.playerName; if(!n || evDone.name || ven.state === 'dormant') return false;
    whisper(n.toLowerCase() + '.', 3000);
    return true;
  },
  move(){
    /* it moves one of the tagged fridges somewhere else */
    if(evDone.move || found < 2 || tagMode) return false;
    const cand = tags.filter(t=>!t.taken && !inView(t.x,t.y) && d2(t.x,t.y,P.x,P.y) > 64);
    if(!cand.length) return false;
    const t = pick(cand);
    const spots = shuffle(B.SPOTS.slice()).filter(sp=>!tags.some(o=>d2(o.x,o.y,sp[0],sp[1]) < 4) && d2(sp[0],sp[1],P.x,P.y) > 64 && !inView(sp[0], sp[1]));
    if(!spots.length) return false;
    t.x = spots[0][0]; t.y = spots[0][1];
    A.moveFridge(t);
    setTimeout(()=>{ if(mode==='play') whisper("i moved one."); }, 1200);
    return true;
  },
  phone(){
    const w = props.find(p=>p.t === 'wurst');
    if(!w || evDone.phone || d2(w.x,w.y,P.x,P.y) > 225) return false;
    w.ring = A.at('phone_ring', w.x, w.y, { gain:0.8, ref:1.5 });
    wurstRingUntil = gameT + 6;
    return true;
  },
  drag(){
    if(ven.state === 'dormant') return false;
    A.at('ven_drag', ven.x, ven.y, { hrtf:true, occ:!los(P.x,P.y,ven.x,ven.y), gain:0.8 });
    return true;
  }
};
const EV_WEIGHT = { knock:3, echo:2, breath:3, radio:1.5, surge:2, steam:2, shelf:2, stairs:1, vigil:2, name:1, move:2.5, phone:1.5, drag:1.5 };
function updateEvents(){
  if(gameT < evAt || P.hidden) return;
  evAt = gameT + Math.max(14, 30 + Math.random()*22 - found*2.5);
  const names = shuffle(Object.keys(EVENTS));
  let total = 0; names.forEach(n=>total += EV_WEIGHT[n]);
  /* weighted order: try them until one fits the moment */
  names.sort((a,b)=>Math.random()*EV_WEIGHT[b] - Math.random()*EV_WEIGHT[a]);
  for(const n of names){
    if(evDone[n] === 'once') continue;
    if(EVENTS[n]()){ evDone[n] = (n === 'stairs' || n === 'shelf' || n === 'radio' || n === 'name' || n === 'move' || n === 'phone') ? 'once' : (evDone[n]||0) + 1; break; }
  }
}

/* ============================================================
   WHISPERS
============================================================ */
function updateWhispers(){
  if(gameT < whisperAt) return;
  whisperAt = gameT + 22 + Math.random()*20;
  let line = whisperQ.shift();
  if(!line){
    if(P.hidden) line = pick(WHISPER_HIDDEN);
    else if(ven.state === 'dormant') line = pick(WHISPER_DORMANT);
    else line = pick(WHISPER_ACTIVE);
  }
  whisper(line);
}

/* ============================================================
   LOOP
============================================================ */
let fpsShow = 0, frames = 0, fpsT = 0;
function frame(t){
  if(!running) return;
  rafId = requestAnimationFrame(frame);
  let dt = (t - lastT)/1000; lastT = t;
  if(dt > 0.1) dt = 0.1; if(dt <= 0) dt = 0.001;
  if(mode === 'play'){
    gameT += dt;
    if(!V._noSim){ updatePlayer(dt);
    if(mode === 'play') updateVendor(dt); } else { horizon = (CH/2)|0; }
    if(mode !== 'play') return;
    updateLights(dt);
    updateWhispers();
    updateEvents();
    const zone = M.zone[(P.y|0)*W + (P.x|0)];
    if(zone && zone !== lastZone){ lastZone = zone; V.see('room:' + zone); }
    /* interact prompt */
    interactTarget = findInteract();
    if(interactTarget){
      ui.vbPrompt.textContent = touchMode ? interactTarget.label : '[E] ' + interactTarget.label;
      ui.vbPrompt.classList.add('on');
      ui.vbBtnUse.classList.add('on');
      ui.vbBtnUse.textContent = shortLabel(interactTarget.o.kind);
    } else { ui.vbPrompt.classList.remove('on'); ui.vbBtnUse.classList.remove('on'); }
    /* stamina bar only when it's moving */
    ui.vbStam.classList.toggle('on', P.stamina < 0.99);
    ui.stamBar.style.transform = 'scaleX(' + P.stamina.toFixed(3) + ')';
    ui.vbStam.classList.toggle('ex', P.exhausted);
    /* fear on the edges */
    ui.vbVig.style.opacity = (0.65 + fear*0.35).toFixed(2);
    ui.vbRed.style.opacity = (Math.max(0, fear-0.45)*0.9 + exposure*0.25).toFixed(2);
    /* sound */
    let tb = null;
    { let bd = 36; for(const L of lights){ if(L.k !== 'tube' || L.cur < 0.1) continue; const dd = d2(L.x,L.y,P.x,P.y); if(dd < bd){ bd = dd; tb = { x:L.x, y:L.y, amt: L.cur*(1 - Math.sqrt(dd)/6) }; } } }
    for(const tg of tags) tg.occ = !los(P.x, P.y, tg.x, tg.y);
    A.update({ px:P.x, py:P.y, dx:Math.cos(P.ang), dy:Math.sin(P.ang),
      ven:{ x:ven.x, y:ven.y, active: ven.state !== 'dormant', ghost: ven.ghost, rage: ven.rage, occ: !los(P.x,P.y,ven.x,ven.y) },
      found, escape, exposure, fear, stamina:P.stamina, hidden: !!P.hidden, tube: tb, zone: lastZone });
    render();
    for(const k in seenFrame){
      seenAcc[k] = (seenAcc[k] || 0) + dt;
      if(seenAcc[k] > 0.35 && seenAcc[k] < 1) V.see('wall:' + SEEN_WALL[k]);
      delete seenFrame[k];
    }
    /* dynamic resolution */
    const ft = performance.now() - t;
    fpsEMA += (ft - fpsEMA)*0.05;
    if(V.settings.quality === 'auto' && gameT - lastScaleChange > 1.5){
      if(fpsEMA > 13 && scale > 0.3){ scale = Math.max(0.3, scale - 0.04); lastScaleChange = gameT; resize(); }
      else if(fpsEMA < 6 && scale < 0.6){ scale = Math.min(0.6, scale + 0.02); lastScaleChange = gameT; resize(); }
    }
    if(V.debug){
      frames++; if(t - fpsT > 500){ fpsShow = Math.round(frames*1000/(t-fpsT)); frames = 0; fpsT = t; }
      ui.vbDebug.textContent = fpsShow+'fps '+CW+'x'+CH+' work '+fpsEMA.toFixed(1)+'ms  ven:'+ven.state+' '+Math.sqrt(d2(P.x,P.y,ven.x,ven.y)).toFixed(1)+'  exp:'+exposure.toFixed(2)+(god?'  GOD':'');
      if(showMap) drawMap();
    }
  }
}
function shortLabel(k){ return ({tag:'TAKE', hide:'HIDE', unhide:'OUT', radio:'RADIO', tape:'PLAY', sauce:'DRINK', door:'DOOR', magnet:'TAKE', wurst: gameT < wurstRingUntil ? 'ANSWER' : 'LOOK', watch:'TAKE', miasma:'SMELL', paper:'READ', unit00:'TAKE'})[k] || 'USE'; }
function drawMap(){
  const c = ui.vbMap, s = 6; c.width = W*s; c.height = H*s;
  const x = c.getContext('2d');
  for(let y=0;y<H;y++) for(let xx=0;xx<W;xx++){ x.fillStyle = M.wall[y*W+xx] ? '#333' : '#111'; x.fillRect(xx*s,y*s,s,s); }
  lights.forEach(L=>{ x.fillStyle = L.dead ? '#400' : '#aa6'; x.fillRect(L.x*s-1,L.y*s-1,3,3); });
  tags.forEach(t=>{ x.fillStyle = t.taken ? '#355' : '#6ff'; x.fillRect(t.x*s-2,t.y*s-2,5,5); });
  hides.forEach(h=>{ x.fillStyle = '#6a6'; x.fillRect(h.x*s-2,h.y*s-2,4,4); });
  x.fillStyle = '#fff'; x.beginPath(); x.arc(P.x*s, P.y*s, 3, 0, 7); x.fill();
  x.strokeStyle = '#fff'; x.beginPath(); x.moveTo(P.x*s, P.y*s); x.lineTo((P.x+Math.cos(P.ang)*2)*s, (P.y+Math.sin(P.ang)*2)*s); x.stroke();
  x.fillStyle = ven.state === 'dormant' ? '#844' : '#f33'; x.beginPath(); x.arc(ven.x*s, ven.y*s, 3, 0, 7); x.fill();
}

/* ============================================================
   CAUGHT
============================================================ */
function caught(kind){
  if(mode !== 'play') return;
  mode = 'dying';
  if(document.pointerLockElement) document.exitPointerLock();
  releaseInput();
  hideText();
  ui.vbHide.classList.remove('on');
  if(tagMode){ return tagCaught(); }
  sessionDeaths++;
  const m = V.patch(mm=>{ mm.deaths++; if(found > mm.bestChamber) mm.bestChamber = found; });
  mem = m;
  const seventh = m.relationship !== 'together' && m.deaths >= 7;
  scareCv.classList.add('on');
  A.scare();
  const t0 = performance.now();
  const tagsShown = Math.min(12, m.deaths);
  (function rush(now){
    const p = Math.min(1, (now - t0)/(seventh ? 650 : 950));
    B.paintScare(sctx, scareCv.width, scareCv.height, p, { tags: tagsShown, open: kind === 'found' ? 1 : undefined });
    if(seventh && p >= 1) return freezeSeventh(m);
    if(p < 1) requestAnimationFrame(rush);
    else setTimeout(()=>afterDeath(m), 260);
  })(t0);
}
function afterDeath(m){
  sctx.fillStyle = '#000'; sctx.fillRect(0,0,scareCv.width,scareCv.height);
  A.stop();
  if(!m.broke && sessionDeaths >= 3 && m.deaths < 6){
    V.patch(mm=>{ mm.broke = true; });
    return breakContainment();
  }
  showDeath(m);
}
function showDeath(m){
  mode = 'dead';
  scareCv.classList.remove('on');
  ui.vbDeath.classList.add('on');
  const lines = DEATH_LINES[Math.min(6, m.deaths)] || DEATH_LINES[6];
  ui.vbDeathLine.textContent = '';
  ui.vbDeathSub.textContent = '';
  ui.vbDeathMenu.classList.remove('on');
  drawDeathTally(m.deaths, true);
  setTimeout(()=>{ ui.vbDeathLine.textContent = lines[0]; }, 900);
  setTimeout(()=>{ ui.vbDeathSub.textContent = lines[1]; }, 1700);
  setTimeout(()=>{ ui.vbDeathMenu.classList.add('on'); }, 2300);
}
function drawDeathTally(n, animateLast){
  const c = ui.vbDeathTally;
  const w = Math.min(520, window.innerWidth*0.86), h = w*0.36;
  c.width = w*2; c.height = h*2; c.style.width = w+'px'; c.style.height = h+'px';
  const x = c.getContext('2d'); x.scale(2,2);
  const gap = w/8.2, y0 = h*0.12, y1 = h*0.88;
  const strokes = [];
  for(let i=0;i<6;i++) strokes.push({ x: gap*(0.9 + i), on: i < n, last: i === n-1 && animateLast });
  const t0 = performance.now();
  if(animateLast) setTimeout(()=>A.scratch(), 300);
  (function draw(now){
    const p = clamp((now - t0 - 300)/450, 0, 1);
    x.clearRect(0,0,w,h);
    x.lineCap = 'round';
    strokes.forEach((s,i)=>{
      if(s.on){
        x.strokeStyle = 'rgba(232,228,214,0.95)'; x.lineWidth = w*0.014;
        const yy = s.last ? y0 + (y1-y0)*p : y1;
        x.beginPath(); x.moveTo(s.x + (i%2), y0 + (i*5%4)); x.lineTo(s.x - 1 + (i%3), yy); x.stroke();
      } else {
        x.strokeStyle = 'rgba(232,228,214,0.16)'; x.lineWidth = w*0.006; x.setLineDash([6,8]);
        x.beginPath(); x.moveTo(s.x, y0); x.lineTo(s.x, y1); x.stroke(); x.setLineDash([]);
      }
    });
    const hx = gap*7.1, hy = (y0+y1)/2, hs = h*0.16;
    x.strokeStyle = n >= 6 ? 'rgba(255,140,185,0.95)' : 'rgba(232,228,214,0.3)'; x.lineWidth = w*0.008;
    x.beginPath(); x.moveTo(hx, hy+hs*0.9);
    x.bezierCurveTo(hx-hs*1.6, hy-hs*0.2, hx-hs*0.6, hy-hs*1.4, hx, hy-hs*0.35);
    x.bezierCurveTo(hx+hs*0.6, hy-hs*1.4, hx+hs*1.6, hy-hs*0.2, hx, hy+hs*0.9); x.stroke();
    if(p < 1 && animateLast) requestAnimationFrame(draw);
  })(t0);
}

/* the seventh time. it stops. */
const SEVEN_FIRST = [ 'wait.', 'no. wait.', "that's the front of you.", "i've only ever had the back.", 'oh.' ];
const SEVEN_AGAIN = {
  friends:  [ 'you came back down.', 'i was going to do that again.', "i'm not going to." ],
  rejected: [ 'you laughed last time.', 'i still have it.', "sit down anyway." ],
  cursed:   [ "you've seen the shelves.", 'you came down anyway.', 'huh.' ],
  together: [ 'hi.' ],
  none:     [ "it's you.", 'stop running for a second.' ]
};
function freezeSeventh(m){
  mode = 'freeze';
  A.cutScare(); A.silence();
  const first = !m.sevenSeen;
  V.patch(mm=>{ mm.sevenSeen = true; });
  const lines = first ? SEVEN_FIRST : (SEVEN_AGAIN[m.lastRoute || 'none'] || SEVEN_AGAIN.none);
  const t0 = performance.now();
  let warm = 0;
  ui.vbFreeze.innerHTML = '';
  ui.vbFreeze.classList.add('on');
  (function hold(now){
    if(mode !== 'freeze') return;
    const el2 = (now - t0)/1000;
    warm = clamp((el2 - 1.6)/2.5, 0, 1);
    const glow = [255, Math.round(40 + warm*150), Math.round(20 + warm*110)];
    const open = 1 - warm*0.55;
    B.paintScare(sctx, scareCv.width, scareCv.height, 1 - warm*0.25, { freeze:true, glow, open, tags: Math.min(12, m.deaths) });
    requestAnimationFrame(hold);
  })(t0);
  let delay = 1700;
  lines.forEach((ln, i)=>{
    setTimeout(()=>{
      if(mode !== 'freeze') return;
      const d = document.createElement('div'); d.className = 'vbFreezeLine'; d.textContent = ln;
      ui.vbFreeze.appendChild(d);
    }, delay);
    delay += first ? 1500 + ln.length*30 : 1300 + ln.length*25;
  });
  setTimeout(()=>{
    if(mode !== 'freeze') return;
    root.classList.add('vbFadePink');
    setTimeout(()=>{
      A.stop();
      teardown(false);
      root.classList.remove('vbFadePink');
      if(V.startDateSim) V.startDateSim({ entry: first ? 'seventh' : 'retry', route: m.lastRoute || null });
      else V.resumeSite();
    }, 1300);
  }, delay + 900);
}

/* containment break: it gets out into the page, once */
function breakContainment(){
  mode = 'off';
  teardown(false);
  try{ isDead = true; }catch(e){}
  try{ document.getElementById('rouletteBtn').disabled = true; }catch(e){}
  const sc = document.getElementById('screenCrack'); if(sc) sc.style.visibility = 'visible';
  document.body.style.filter = 'grayscale(100%) sepia(60%) hue-rotate(-30deg) brightness(0.5)';
  const bc = document.getElementById('bloodCanvas');
  if(bc){ bc.style.display = 'block'; try{ startBloodAnimation(bc); }catch(e){} }
  setTimeout(()=>{ try{ playHeartbeat(); }catch(e){} }, 400);
  setTimeout(()=>{ const df = document.getElementById('deathFade'); if(df) df.style.opacity = '1'; }, 1500);
  const gn = document.getElementById('guyName');
  if(gn){ gn.textContent = 'THE VENDOR'; gn.style.display = 'block'; gn.style.fontSize = '14px'; gn.style.left = (window.innerWidth/2-46)+'px'; gn.style.top = (window.innerHeight/2-10)+'px'; }
  const fw = document.getElementById('hgFarewell');
  if(fw){ fw.textContent = pick(["i came up for a second.", "it's bright up here. i don't like it.", "three in a row. i wanted to see where you go."]); fw.style.display = 'block'; }
  try{ gameActive = false; }catch(e){}
  document.documentElement.classList.remove('vendor-open');
}

/* tag, from the check-in room. nobody dies. */
function tagCaught(){
  A.stinger();
  V.patch(m=>{ m.tagModeLosses++; });
  flash('got you.', 1600);
  setTimeout(()=>{ A.stop(); teardown(false); if(V.startCheckin) V.startCheckin({ fromTag:'lost', found }); else V.resumeSite(); }, 1500);
}

/* ============================================================
   WIN
============================================================ */
function win(){
  if(mode !== 'play') return;
  mode = 'win';
  releaseInput();
  if(document.pointerLockElement) document.exitPointerLock();
  A.doorOpen();
  hideText();
  if(tagMode){
    V.patch(m=>{ m.tagModeWins++; });
    root.classList.add('vbWhiteOut');
    setTimeout(()=>{ A.stop(); teardown(false); root.classList.remove('vbWhiteOut'); if(V.startCheckin) V.startCheckin({ fromTag:'won' }); else V.resumeSite(); }, 2200);
    return;
  }
  const m = V.patch(mm=>{ mm.escaped++; mm.bestChamber = Math.max(mm.bestChamber, 6); });
  root.classList.add('vbWhiteOut');
  setTimeout(()=>{
    ui.vbWin.classList.add('on');
    ui.vbWinLine.textContent = 'you got out.';
    ui.vbWinSub.textContent = pick(m.escaped > 1
      ? ["again. you keep coming back in, though.", "that's " + m.escaped + " times out. it doesn't count those.", "the door shuts behind you. you know the way back."]
      : ["six tags. none of them are worth anything upstairs.", "the door shuts behind you. it always does.", "go on, then."]);
  }, 1400);
  setTimeout(()=>{ A.stop(); root.classList.remove('vbWhiteOut'); leave(); }, 7200);
}

/* ============================================================
   INPUT
============================================================ */
function kd(e){
  if(!root || mode === 'off') return;
  const k = e.key.toLowerCase();
  if(mode === 'play'){
    if(['w','a','s','d','arrowup','arrowdown','arrowleft','arrowright',' ','shift'].indexOf(k) >= 0){ e.preventDefault(); if(touchMode) setTouchMode(false); }
    if(k === 'escape' || k === 'p'){ e.preventDefault(); pause(); return; }
    if(k === 'f'){ toggleLight(); return; }
    if(k === 'r'){ shakeLight(); return; }
    if(k === 'e' || k === 'enter'){ interact(); return; }
    if(k.length === 1){
      typed = (typed + k).slice(-4);
      if(typed === 'hank' && V.saw('wall:hank')){ typed = ''; V.see('typed:hank'); blackout(0.5); setTimeout(()=>{ if(mode==='play') whisper("don't."); }, 600); }
    }
    if(V.debug && k === 'm'){ showMap = !showMap; ui.vbMap.classList.toggle('on', showMap); return; }
    if(V.debug && k === 'g'){ god = !god; return; }
    keys[k] = true;
  } else if(mode === 'pause' && (k === 'escape' || k === 'p')){ e.preventDefault(); resume(); }
  else if((mode === 'title' || mode === 'dead') && k === 'escape'){ e.preventDefault(); leave(); }
}
function ku(e){ keys[e.key.toLowerCase()] = false; }
let dragLook = null;
function mm(e){
  if(mode !== 'play') return;
  if(document.pointerLockElement === view){ lookDX += e.movementX; lookDY += e.movementY*0.5; if(touchMode && (e.movementX || e.movementY)) setTouchMode(false); return; }
  if(dragLook){ lookDX += (e.clientX - dragLook.x)*1.4; lookDY += (e.clientY - dragLook.y)*0.7; dragLook.x = e.clientX; dragLook.y = e.clientY; }
}
function md(e){
  if(mode !== 'play' || touchMode) return;
  if(e.target !== view) return;
  if(document.pointerLockElement !== view){
    lockPointer();
    dragLook = { x:e.clientX, y:e.clientY };
  }
}
function mu(){ dragLook = null; }
function lockPointer(){
  if(touchMode || !view.requestPointerLock) return;
  try{ const p = view.requestPointerLock(); if(p && p.catch) p.catch(()=>{}); }catch(e){}
}
function onLockChange(){
  if(mode === 'play' && document.pointerLockElement !== view && !touchMode && !dragLock){ pause(); }
  dragLock = false;
}
let dragLock = false;
function releaseInput(){
  for(const k in keys) keys[k] = false;
  stick.id = null; stick.x = stick.y = 0; stick.run = false; lookTouch = null;
  ui.vbStick && ui.vbStick.classList.remove('on');
}
function addInput(){
  document.addEventListener('keydown', kd);
  document.addEventListener('keyup', ku);
  document.addEventListener('mousemove', mm);
  document.addEventListener('mousedown', md);
  document.addEventListener('mouseup', mu);
  document.addEventListener('pointerlockchange', onLockChange);
  document.addEventListener('visibilitychange', onVis);
  window.addEventListener('blur', onBlur);
}
function removeInput(){
  document.removeEventListener('keydown', kd);
  document.removeEventListener('keyup', ku);
  document.removeEventListener('mousemove', mm);
  document.removeEventListener('mousedown', md);
  document.removeEventListener('mouseup', mu);
  document.removeEventListener('pointerlockchange', onLockChange);
  document.removeEventListener('visibilitychange', onVis);
  window.removeEventListener('blur', onBlur);
  releaseInput();
}
function onVis(){ if(document.hidden && mode === 'play') pause(); }
function onBlur(){ if(mode === 'play') releaseInput(); }

/* ---------- touch ---------- */
function setTouchMode(on){
  touchMode = on;
  root.classList.toggle('touch', on);
  if(on && document.pointerLockElement) document.exitPointerLock();
}
function wireTouch(){
  const zone = ui.vbStickZone, look = ui.vbLookZone;
  const opt = { passive:false };
  zone.addEventListener('touchstart', e=>{
    e.preventDefault(); if(!touchMode) setTouchMode(true);
    if(stick.id !== null || mode !== 'play') return;
    const t = e.changedTouches[0];
    stick.id = t.identifier; stick.ox = t.clientX; stick.oy = t.clientY; stick.x = stick.y = 0; stick.run = false;
    ui.vbStick.style.left = t.clientX + 'px'; ui.vbStick.style.top = t.clientY + 'px';
    ui.vbStick.classList.add('on'); ui.vbKnob.style.transform = 'translate(-50%,-50%)';
  }, opt);
  const moveStick = e=>{
    for(const t of e.changedTouches){
      if(t.identifier !== stick.id) continue;
      e.preventDefault();
      let dx = t.clientX - stick.ox, dy = t.clientY - stick.oy;
      const R = 58, m = Math.hypot(dx, dy);
      stick.run = m > R*1.05;
      if(m > R){ dx = dx/m*R; dy = dy/m*R; }
      stick.x = dx/R; stick.y = -dy/R;
      ui.vbKnob.style.transform = 'translate(calc(-50% + '+dx.toFixed(1)+'px), calc(-50% + '+dy.toFixed(1)+'px))';
      ui.vbStick.classList.toggle('run', stick.run);
    }
  };
  const endStick = e=>{ for(const t of e.changedTouches) if(t.identifier === stick.id){ stick.id = null; stick.x = stick.y = 0; stick.run = false; ui.vbStick.classList.remove('on','run'); } };
  zone.addEventListener('touchmove', moveStick, opt);
  zone.addEventListener('touchend', endStick); zone.addEventListener('touchcancel', endStick);
  look.addEventListener('touchstart', e=>{
    e.preventDefault(); if(!touchMode) setTouchMode(true);
    if(lookTouch) return;
    const t = e.changedTouches[0]; lookTouch = { id:t.identifier, x:t.clientX, y:t.clientY };
  }, opt);
  look.addEventListener('touchmove', e=>{
    for(const t of e.changedTouches){
      if(!lookTouch || t.identifier !== lookTouch.id) continue;
      e.preventDefault();
      lookDX += (t.clientX - lookTouch.x)*2.2; lookDY += (t.clientY - lookTouch.y)*1.0;
      lookTouch.x = t.clientX; lookTouch.y = t.clientY;
    }
  }, opt);
  const endLook = e=>{ for(const t of e.changedTouches) if(lookTouch && t.identifier === lookTouch.id) lookTouch = null; };
  look.addEventListener('touchend', endLook); look.addEventListener('touchcancel', endLook);
  const tap = (btn, fn)=>{
    btn.addEventListener('touchstart', e=>{ e.preventDefault(); e.stopPropagation(); if(!touchMode) setTouchMode(true); fn(); btn.classList.add('down'); }, opt);
    btn.addEventListener('touchend', ()=>btn.classList.remove('down'));
    btn.addEventListener('click', e=>{ e.preventDefault(); fn(); });
  };
  tap(ui.vbBtnUse, interact);
  tap(ui.vbBtnLight, toggleLight);
  tap(ui.vbBtnShake, shakeLight);
  tap(ui.vbBtnPause, ()=>{ if(mode === 'play') pause(); });
  /* stop the page under it from scrolling or zooming */
  root.addEventListener('touchmove', e=>{ if(mode !== 'off') e.preventDefault(); }, opt);
  root.addEventListener('gesturestart', e=>e.preventDefault());
  root.addEventListener('contextmenu', e=>e.preventDefault());
}

/* ============================================================
   MENUS
============================================================ */
function wireMenus(){
  root.addEventListener('click', e=>{
    const b = e.target.closest && e.target.closest('button[data-act]');
    if(!b) return;
    e.preventDefault();
    const act = b.getAttribute('data-act');
    if(b.disabled) return;
    if(act === 'go'){ V.SND.play('ui_down', { gain:0.8 }); }
    else A.ui('ui_click');
    if(act === 'go') goDown();
    else if(act === 'settings'){ openPause(true); }
    else if(act === 'up') leave();
    else if(act === 'resume') resume();
    else if(act === 'leave') tryLeave();
    else if(act === 'retry') retry();
  });
  const s = V.settings;
  ui.vbSens.value = s.sens; ui.vbVol.value = s.vol; ui.vbQual.value = s.quality;
  ui.vbInv.checked = !!s.invertY; ui.vbShakeOpt.checked = s.shake !== false; ui.vbHap.checked = s.haptics !== false;
  ui.vbSens.addEventListener('input', ()=>{ s.sens = +ui.vbSens.value; V.saveSettings(); });
  ui.vbVol.addEventListener('input', ()=>{ s.vol = +ui.vbVol.value; V.saveSettings(); });
  ui.vbQual.addEventListener('change', ()=>{ s.quality = ui.vbQual.value; V.saveSettings(); if(s.quality === 'auto') scale = 0.5; resize(true); });
  ui.vbInv.addEventListener('change', ()=>{ s.invertY = ui.vbInv.checked; V.saveSettings(); });
  ui.vbShakeOpt.addEventListener('change', ()=>{ s.shake = ui.vbShakeOpt.checked; V.saveSettings(); });
  ui.vbHap.addEventListener('change', ()=>{ s.haptics = ui.vbHap.checked; V.saveSettings(); });
}
function screens(on){
  ['vbTitle','vbIntro','vbPause','vbDeath','vbWin'].forEach(k=>ui[k].classList.toggle('on', k === on));
}
let pauseFromTitle = false;
function openPause(fromTitle){
  pauseFromTitle = !!fromTitle;
  ui.vbPause.classList.add('on');
  ui.vbPauseHead.textContent = fromTitle ? 'settings' : "there's no menu.";
  ui.vbResume.textContent = fromTitle ? 'back' : 'keep going';
  ui.vbLeave.style.display = fromTitle ? 'none' : '';
  ui.vbPauseSay.textContent = '';
}
function pause(){
  if(mode !== 'play') return;
  mode = 'pause';
  releaseInput();
  if(document.pointerLockElement) document.exitPointerLock();
  openPause(false);
  duck(true);
}
function duck(on){
  const b = V.bus(); if(!b) return;
  b.master.gain.setTargetAtTime(on ? V.settings.vol*0.15 : V.settings.vol, b.ctx.currentTime, 0.15);
}
function resume(){
  if(pauseFromTitle){ ui.vbPause.classList.remove('on'); pauseFromTitle = false; return; }
  if(mode !== 'pause') return;
  ui.vbPause.classList.remove('on');
  duck(false);
  mode = 'play';
  lastT = performance.now();
  if(!touchMode) lockPointer();
}
function tryLeave(){
  leaveTries++;
  const lines = ['no.', 'that does nothing.', 'fine. go.'];
  ui.vbPauseSay.textContent = lines[Math.min(leaveTries, 3) - 1];
  if(leaveTries >= 3){ setTimeout(()=>{ A.stop(); leave(); }, 900); }
}

/* ============================================================
   FLOW: title -> intro -> play
============================================================ */
function goFullscreen(){
  const d = document.documentElement;
  const fn = d.requestFullscreen || d.webkitRequestFullscreen;
  if(!fn || document.fullscreenElement) return Promise.resolve();
  try{ const p = fn.call(d, { navigationUI:'hide' }); return (p && p.then) ? p.catch(()=>{}) : Promise.resolve(); }catch(e){ return Promise.resolve(); }
}
function lockLandscape(){ try{ if(screen.orientation && screen.orientation.lock) screen.orientation.lock('landscape').catch(()=>{}); }catch(e){} }

let readyIv = 0, titleAmb = null;
/* the title and the intro aren't silent: the building is already there */
function titleAmbience(on){
  if(on && !titleAmb){
    const a = V.SND.play('bed_base', { loop:true, gain:0.0001 }), b = V.SND.play('ven_hum', { loop:true, gain:0.0001, rate:0.94 });
    if(!a && !b) return;
    if(a) a.gain(0.35, 1.5); if(b){ b.gain(0.05, 2.5); }
    titleAmb = [a, b];
  } else if(!on && titleAmb){
    titleAmb.forEach(h=>{ if(h){ h.gain(0.0001, 0.6); setTimeout(()=>h.stop(0.1), 2500); } });
    titleAmb = null;
  }
}
function showTitle(){
  mode = 'title';
  screens('vbTitle');
  const go = document.getElementById('vbGo');
  clearInterval(readyIv);
  const check = ()=>{
    const ok = V.SND.essentialReady();
    go.disabled = !ok;
    go.classList.toggle('wait', !ok);
    go.textContent = ok ? 'go down' : 'the lights are coming on ' + Math.round(V.SND.progress()*100) + '%';
    if(ok){ clearInterval(readyIv); titleAmbience(true); }
  };
  V.SND.start();
  check();
  readyIv = setInterval(check, 200);
  const m = mem;
  const tl = ui.vbTitleTally;
  tl.textContent = '';
  if(m.deaths > 0){
    const marks = Math.min(6, m.deaths);
    tl.innerHTML = '<span class="on">' + 'I'.repeat(marks) + '</span><span class="off">' + 'I'.repeat(6-marks) + '</span><span class="heart' + (m.deaths>=6?' lit':'') + '">♡</span>';
  }
  ui.vbRotate.style.display = (touchMode && window.innerHeight > window.innerWidth) ? 'block' : 'none';
}
function goDown(){
  /* one gesture: sound, fullscreen, landscape, pointer */
  V.ac();
  goFullscreen().then(()=>{ lockLandscape(); setTimeout(()=>resize(true), 150); });
  showIntro();
}
function showIntro(){
  mode = 'intro';
  screens('vbIntro');
  const m = mem, lines = [];
  if(tagMode){
    lines.push('same rules.', 'six tags. the door.', "i'll count to ten.");
  } else if(m.visits <= 1 && m.deaths === 0){
    lines.push('you came through the box.', 'this is the back room. the stock is down here.', 'six of them have tags on. take the tags to the door.', "i'll be around.");
  } else {
    lines.push(pick(OPENERS_BACK));
    const opt2 = [];
    if(m.deaths > 0) opt2.push(m.deaths + ' mark' + (m.deaths!==1?'s':'') + ' on the wall by the door. all you.');
    const since = fmtSince(opts.since);
    if(since) opt2.push(since + '. i didn\'t go anywhere. i can\'t.');
    if(m.escaped > 0) opt2.push('you got out ' + m.escaped + ' time' + (m.escaped!==1?'s':'') + '. you came back in anyway.');
    else if(m.bestChamber > 0 && m.bestChamber < 6) opt2.push('you got ' + m.bestChamber + ' tag' + (m.bestChamber!==1?'s':'') + ' once. that\'s your best.');
    shuffle(opt2);
    lines.push(...opt2.slice(0, 2));
    if(m.deaths === 4) lines.push("the wall's filling up.");
    else if(m.deaths === 5) lines.push("two more marks and the wall's full.");
    else if(m.deaths >= 6 && m.relationship !== 'together') lines.push('one more mark.');
    lines.push('six tags. the door.');
  }
  ui.vbIntro.innerHTML = lines.map((l,i)=>'<div class="vbIntroLine" style="animation-delay:'+(i*1.0+0.3).toFixed(1)+'s">'+esc(l)+'</div>').join('')
    + '<button class="vbBegin" style="animation-delay:'+(lines.length*1.0+0.5).toFixed(1)+'s">' + (touchMode ? '[ tap to go down ]' : '[ click to go down ]') + '</button>';
  const go = ()=>{ ui.vbIntro.removeEventListener('click', go); startPlay(); };
  setTimeout(()=>ui.vbIntro.addEventListener('click', go), 600);
}
function esc(s){ return String(s).replace(/[&<>"]/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c]); }
function startPlay(){
  screens(null);
  titleAmbience(false);
  setupRun();
  if(!A.start()) console.warn('no audio');
  A.setFridges(tags);
  mode = 'play';
  lastT = performance.now();
  resize(true);
  if(!touchMode) lockPointer();
  hint(touchMode
    ? 'left thumb moves. push it to the edge to run. right thumb looks.'
    : 'WASD move   SHIFT run   F light   R shake it   E use   ESC pause', 7000);
}
function retry(){
  ui.vbDeath.classList.remove('on');
  mem = V.loadMem();
  if(!touchMode) lockPointer();
  startPlay();
  const line = pick(["again.", "up.", "back to the stairs.", "the shelves are full again.", "you know the way now."]);
  setTimeout(()=>{ if(mode === 'play') whisper(line); }, 1800);
}

/* ============================================================
   OPEN / CLOSE
============================================================ */
function teardown(resumeSite){
  running = false; cancelAnimationFrame(rafId);
  titleAmbience(false);
  duck(false);
  mode = 'off';
  removeInput();
  if(document.pointerLockElement) document.exitPointerLock();
  if(document.fullscreenElement && resumeSite) document.exitFullscreen().catch(()=>{});
  if(root){
    root.classList.remove('on');
    screens(null);
    ui.vbFreeze.classList.remove('on'); ui.vbFreeze.innerHTML = '';
    scareCv.classList.remove('on');
    ui.vbHide.classList.remove('on');
    hideText();
    try{ screen.orientation && screen.orientation.unlock && screen.orientation.unlock(); }catch(e){}
  }
  if(resumeSite) V.resumeSite();
}
function leave(){
  A.stop();
  teardown(true);
}
V.endBasementToSite = leave;

V.startBasement = function(o){
  o = o || {};
  ['tape_ic','radio_cp','radio_signal','phone_ring','quartz','spray','paper','sauce_trip'].forEach(n=>V.SND && V.SND.need(n));
  buildDOM();
  initMap();
  tagMode = !!o.tag;
  V.pauseSite();
  mem = V.patch(m=>{
    if(!tagMode){
      opts.since = m.lastVisit ? Date.now() - m.lastVisit : 0;
      m.visits++; if(!m.firstVisit) m.firstVisit = Date.now(); m.lastVisit = Date.now();
    }
  });
  sessionDeaths = 0; leaveTries = 0; god = false;
  root.classList.add('on');
  root.classList.toggle('touch', touchMode);
  root.classList.toggle('tagmode', tagMode);
  scale = touchMode ? 0.5 : 0.5;
  resize(true);
  addInput();
  running = true; lastT = performance.now();
  rafId = requestAnimationFrame(frame);
  /* bake after fonts so the writing on the walls uses them */
  B.loadFonts().then(()=>{ B.bake(mem.deaths); });
  B.bake(mem.deaths);
  if(tagMode){ V.ac(); goFullscreen(); showIntro(); }
  else showTitle();
};

/* test hooks, used by the debug console and by nothing else */
V._basement = { get state(){ return { mode, found, escape, exposure, fear, ven:{ state:ven.state, x:ven.x, y:ven.y }, P:{ x:P.x, y:P.y, ang:P.ang, hidden:!!P.hidden }, CW, CH, tags: tags.map(t=>({x:t.x,y:t.y,taken:t.taken})) }; },
  caught, EVENTS, takeTag:(i)=>takeTag(tags[i]), teleportPlayer:(x,y,a)=>{ P.x=x; P.y=y; if(a!==undefined) P.ang=a; }, startPlay, setGod:(v)=>{ god=v; }, ven, P, interact, render:()=>render(), pause:()=>pause() };

})();
