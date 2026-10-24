/* ============================================================
   FRIDGE VARIANTS
   most spawns are the plain fridge. some aren't. every variant is
   drawn in code, has its own body size and physics, some glow, one
   floats, and each one trades on the market under its own ticker.
   spawning a variant vests you one share of it (and dilutes it a bit).
============================================================ */
(function(){
'use strict';
const FV = window.FV = {};

/* weight = chance out of the total. std uses the original png sprites. */
const VARIANTS = [
  { key:'std',   sym:'FRDG', weight:7600, w:100, h:150 },
  { key:'rust',  sym:'RUST', weight:520,  w:100, h:150, body:'#7a4a2a', trim:'#3a2414', dens:0.0012 },
  { key:'mini',  sym:'MINI', weight:420,  w:70,  h:92,  body:'#d9dde0', trim:'#8a9096', dens:0.0008 },
  { key:'chest', sym:'CHST', weight:300,  w:160, h:84,  body:'#e6e8e4', trim:'#9aa09a', dens:0.0014 },
  { key:'sxs',   sym:'SXS',  weight:250,  w:132, h:168, body:'#b8bec4', trim:'#6a7076', dens:0.0013 },
  { key:'retro', sym:'RTRO', weight:200,  w:104, h:150, body:'#9fd6c2', trim:'#4a7a6a', dens:0.0011 },
  { key:'wine',  sym:'WINE', weight:150,  w:80,  h:130, body:'#2a1a1e', trim:'#6a2a34', dens:0.001 },
  { key:'smart', sym:'SMRT', weight:120,  w:110, h:160, body:'#2e3238', trim:'#16181c', dens:0.0012, glow:'rgba(80,220,255,0.55)' },
  { key:'frost', sym:'FRST', weight:100,  w:100, h:150, body:'#cfe8ff', trim:'#7aa8d8', dens:0.001, glow:'rgba(150,210,255,0.5)', fric:0.02 },
  { key:'neon',  sym:'NEON', weight:80,   w:100, h:150, body:'#2a0a24', trim:'#ff3fb4', dens:0.0009, glow:'rgba(255,60,180,0.65)', rest:0.92 },
  { key:'gold',  sym:'GOLD', weight:50,   w:100, h:150, body:'#e8c25a', trim:'#8a6a1a', dens:0.004, glow:'rgba(255,210,90,0.6)' },
  { key:'void',  sym:'VOID', weight:30,   w:100, h:150, body:'#050308', trim:'#5a1a8a', dens:0.0006, glow:'rgba(150,60,255,0.7)', float:1 },
  { key:'vndr',  sym:'VNDR', weight:10,   w:96,  h:150, body:'#cfc8ae', trim:'#6e6857', dens:0.0011, glow:'rgba(255,190,120,0.45)', needsVendor:1 }
];
FV.VARIANTS = VARIANTS;
FV.bySym = {}; VARIANTS.forEach(v=>FV.bySym[v.sym] = v);

function rr(c,x,y,w,h,r){ c.beginPath(); c.moveTo(x+r,y); c.arcTo(x+w,y,x+w,y+h,r); c.arcTo(x+w,y+h,x,y+h,r); c.arcTo(x,y+h,x,y,r); c.arcTo(x,y,x+w,y,r); c.closePath(); }
function shade(c, x, w, base){
  const g = c.createLinearGradient(x, 0, x+w, 0);
  g.addColorStop(0, 'rgba(0,0,0,0.28)'); g.addColorStop(0.3, 'rgba(255,255,255,0.18)'); g.addColorStop(0.7, 'rgba(255,255,255,0.05)'); g.addColorStop(1, 'rgba(0,0,0,0.32)');
  c.fillStyle = base; c.fill(); c.fillStyle = g; c.fill();
}
/* draw one variant at 2x into a canvas */
function paint(v){
  const S = 2, W = v.w*S, H = v.h*S;
  const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
  const c = cv.getContext('2d');
  c.lineJoin = 'round';
  const r = v.key === 'retro' || v.key === 'vndr' ? 40 : (v.key === 'mini' ? 14 : 10);
  rr(c, 3, 3, W-6, H-6, r); shade(c, 3, W-6, v.body);
  c.strokeStyle = v.trim; c.lineWidth = 4; rr(c, 3, 3, W-6, H-6, r); c.stroke();
  const door = (y)=>{ c.fillStyle = 'rgba(0,0,0,0.45)'; c.fillRect(8, y, W-16, 3); };
  const handle = (x, y, h)=>{ c.fillStyle = '#d8dde0'; rr(c, x, y, 8, h, 4); c.fill(); c.fillStyle = 'rgba(0,0,0,0.35)'; c.fillRect(x+7, y, 2, h); };
  switch(v.key){
    case 'rust':
      door(H*0.36); handle(W-26, H*0.12, H*0.16); handle(W-26, H*0.46, H*0.24);
      for(let i=0;i<120;i++){ c.fillStyle = 'rgba('+(110+Math.random()*60|0)+','+(40+Math.random()*30|0)+',10,'+(0.3+Math.random()*0.5).toFixed(2)+')'; c.beginPath(); c.arc(Math.random()*W, Math.random()*H, 2+Math.random()*9, 0, 7); c.fill(); }
      c.fillStyle = '#111'; c.font = 'bold 22px Arial'; c.fillText('AS IS', W*0.22, H*0.7);
      break;
    case 'mini':
      door(H*0.3); handle(W-24, H*0.4, H*0.3);
      c.fillStyle = '#ff5a3a'; c.fillRect(16, H*0.6, 30, 20); c.fillStyle = '#3a8aff'; c.fillRect(54, H*0.66, 22, 22);
      break;
    case 'chest':
      c.fillStyle = 'rgba(0,0,0,0.4)'; c.fillRect(8, H*0.28, W-16, 4);
      handle(W*0.44, H*0.12, 10); c.fillStyle = '#d8dde0'; rr(c, W*0.4, H*0.12, W*0.2, 10, 5); c.fill();
      c.fillStyle = '#3a8a3a'; c.beginPath(); c.arc(W-30, H*0.6, 6, 0, 7); c.fill();
      break;
    case 'sxs':
      c.fillStyle = 'rgba(0,0,0,0.5)'; c.fillRect(W/2-2, 10, 4, H-20);
      handle(W/2-18, H*0.2, H*0.5); handle(W/2+10, H*0.2, H*0.5);
      c.fillStyle = '#20262c'; rr(c, 20, H*0.16, W*0.3, H*0.18, 6); c.fill(); c.fillStyle = '#7ad0ff'; c.font = 'bold 20px monospace'; c.fillText('34°', 28, H*0.28);
      break;
    case 'retro':
      door(H*0.34); c.fillStyle = '#e8eef0'; rr(c, W-34, H*0.38, 20, 44, 8); c.fill();
      c.fillStyle = '#c0c8cc'; c.fillRect(W*0.3, 20, W*0.4, 8);
      c.font = 'italic bold 18px Georgia'; c.fillStyle = '#4a7a6a'; c.fillText('Frostline', W*0.2, H*0.22);
      break;
    case 'wine':
      c.fillStyle = 'rgba(30,8,14,0.9)'; rr(c, 14, 14, W-28, H-40, 8); c.fill();
      for(let row=0; row<6; row++) for(let k=0;k<3;k++){ c.fillStyle = 'rgba(140,20,40,0.9)'; c.beginPath(); c.ellipse(30 + k*36, 40 + row*36, 14, 9, 0, 0, 7); c.fill(); c.fillStyle='rgba(255,255,255,0.2)'; c.fillRect(24 + k*36, 36 + row*36, 6, 2); }
      c.fillStyle = 'rgba(255,255,255,0.08)'; c.fillRect(20, 16, 10, H-50);
      break;
    case 'smart':
      door(H*0.36); handle(W-26, H*0.45, H*0.3);
      c.fillStyle = '#0a1a24'; rr(c, 18, H*0.42, W*0.5, H*0.3, 8); c.fill();
      c.fillStyle = '#5ae0ff'; c.font = 'bold 16px monospace'; c.fillText('LOW', 30, H*0.5); c.fillText('MILK', 30, H*0.56); c.fillText(':(', 30, H*0.64);
      break;
    case 'frost':
      door(H*0.36); handle(W-26, H*0.12, H*0.16); handle(W-26, H*0.46, H*0.24);
      for(let i=0;i<220;i++){ c.fillStyle = 'rgba(255,255,255,'+(0.2+Math.random()*0.6).toFixed(2)+')'; c.fillRect(Math.random()*W, H - Math.random()*Math.random()*H, 2+Math.random()*6, 2); }
      c.strokeStyle = 'rgba(255,255,255,0.8)'; c.lineWidth = 3; for(let k=0;k<8;k++){ const x = 10 + k*(W-20)/7; c.beginPath(); c.moveTo(x, 6); c.lineTo(x+3, 18 + Math.random()*20); c.stroke(); }
      break;
    case 'neon':
      c.strokeStyle = '#ff3fb4'; c.lineWidth = 6; rr(c, 10, 10, W-20, H-20, 8); c.stroke();
      c.strokeStyle = '#3fffe0'; c.lineWidth = 4; c.beginPath(); c.moveTo(12, H*0.36); c.lineTo(W-12, H*0.36); c.stroke();
      c.fillStyle = '#ff3fb4'; c.font = 'bold 24px Arial'; c.fillText('OPEN', W*0.2, H*0.6);
      break;
    case 'gold':
      door(H*0.36); handle(W-26, H*0.12, H*0.16); handle(W-26, H*0.46, H*0.24);
      c.fillStyle = 'rgba(255,255,255,0.5)'; c.beginPath(); c.moveTo(20, 10); c.lineTo(46, 10); c.lineTo(20, 80); c.closePath(); c.fill();
      c.fillStyle = '#8a6a1a'; c.font = 'bold 20px Georgia'; c.fillText('24K', W*0.3, H*0.7);
      break;
    case 'void':
      for(let i=0;i<60;i++){ c.fillStyle = 'rgba(180,120,255,'+(Math.random()*0.8).toFixed(2)+')'; c.fillRect(Math.random()*W, Math.random()*H, 2, 2); }
      c.strokeStyle = '#7a2aff'; c.lineWidth = 3; c.beginPath(); c.moveTo(12, H*0.36); c.lineTo(W-12, H*0.36); c.stroke();
      c.fillStyle = 'rgba(120,40,255,0.9)'; c.fillRect(W-24, H*0.46, 6, H*0.24);
      break;
    case 'vndr':
      door(H*0.3);
      c.font = 'bold 22px Arial'; [['S','#c4241a'],['A','#1a5ac4'],['L','#e0b020']].forEach((m,i)=>{ c.fillStyle = m[1]; c.fillText(m[0], 22 + i*22, 46 + (i%2)*4); });
      c.fillStyle = '#040303'; c.fillRect(18, H*0.5, 8, H*0.38);
      c.fillStyle = 'rgba(255,200,140,0.9)'; c.fillRect(19, H*0.5, 4, H*0.38);
      handle(W-26, H*0.4, H*0.2);
      break;
  }
  return cv.toDataURL('image/png');
}
const tex = {};
function texture(v){ if(!tex[v.key]) tex[v.key] = paint(v); return tex[v.key]; }

function vendorMet(){ try{ return window.VENDOR && VENDOR.loadMem().deaths >= 1; }catch(e){ return false; } }
FV.roll = function(){
  const pool = VARIANTS.filter(v=>!v.needsVendor || vendorMet());
  let total = 0; pool.forEach(v=>total += v.weight);
  let r = Math.random()*total;
  for(const v of pool){ if((r -= v.weight) <= 0) return v; }
  return pool[0];
};
/* make a physics body for a new fridge. std keeps the original pngs. */
FV.body = function(x, y, opt){
  opt = opt || {};
  const v = opt.variant || FV.roll();
  const M = window.Matter;
  let b;
  if(v.key === 'std'){
    const imgs = ['fridge1.png','fridge2.png','fridge3.png'];
    b = M.Bodies.rectangle(x, y, 100, 150, { restitution: opt.restitution || 0.6, friction:0.2, render:{ sprite:{ texture: imgs[(Math.random()*3)|0], xScale:0.35, yScale:0.35 } } });
  } else {
    b = M.Bodies.rectangle(x, y, v.w, v.h, {
      restitution: v.rest || opt.restitution || 0.55, friction: v.fric === undefined ? 0.2 : v.fric, density: v.dens || 0.001,
      frictionAir: v.float ? 0.04 : 0.01,
      render:{ sprite:{ texture: texture(v), xScale:0.5, yScale:0.5 } }
    });
  }
  b.plugin = b.plugin || {};
  b.plugin.fv = v;
  if(!opt.noMarket && window.MKT && MKT.onSpawn) try{ MKT.onSpawn(v.sym); }catch(e){}
  return b;
};

/* glow and the void fridges' refusal to obey gravity */
FV.attach = function(engine, render){
  const M = window.Matter;
  M.Events.on(engine, 'beforeUpdate', ()=>{
    const bodies = engine.world.bodies;
    for(let i=0;i<bodies.length;i++){
      const b = bodies[i], v = b.plugin && b.plugin.fv;
      if(v && v.float){ M.Body.applyForce(b, b.position, { x: Math.sin(performance.now()/900 + b.id)*0.00002*b.mass, y: -engine.gravity.y*engine.gravity.scale*b.mass*1.06 }); }
    }
  });
  M.Events.on(render, 'afterRender', ()=>{
    const c = render.context, bodies = engine.world.bodies, t = performance.now()/1000;
    c.save(); c.globalCompositeOperation = 'lighter';
    for(let i=0;i<bodies.length;i++){
      const b = bodies[i], v = b.plugin && b.plugin.fv;
      if(!v || !v.glow) continue;
      const rad = Math.max(v.w, v.h)*(0.85 + 0.08*Math.sin(t*3 + b.id));
      const g = c.createRadialGradient(b.position.x, b.position.y, rad*0.2, b.position.x, b.position.y, rad);
      g.addColorStop(0, v.glow); g.addColorStop(1, 'rgba(0,0,0,0)');
      c.fillStyle = g; c.fillRect(b.position.x - rad, b.position.y - rad, rad*2, rad*2);
    }
    c.restore();
  });
};
FV.texture = texture;
})();
