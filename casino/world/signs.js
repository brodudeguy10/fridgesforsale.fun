/* ============================================================
   FRIDGE PALACE: neon and screens
============================================================ */
import * as THREE from '../lib/three.module.min.js';
import { canvas, tex, neon } from './textures.js';

/* a neon sign that hums and sometimes flickers */
export function neonSign(scene, text, color, x, y, z, ry, height, o){
  o = o || {};
  const t = neon(text, color, o);
  const h = height || 0.8, w = h*t.userData.w/t.userData.h;
  const m = new THREE.MeshBasicMaterial({ map:t, transparent:true, depthWrite:false, blending:THREE.AdditiveBlending, toneMapped:false, side:THREE.FrontSide });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), m);
  mesh.position.set(x, y, z); mesh.rotation.y = ry || 0;
  if(o.both){ const back = new THREE.Mesh(mesh.geometry, m); back.rotation.y = Math.PI; back.position.z = -0.01; mesh.add(back); }
  mesh.renderOrder = 5;
  scene.add(mesh);
  mesh.userData.flicker = o.flicker || 0;
  mesh.userData.base = 1;
  return mesh;
}
export function updateNeon(list, t, dt){
  for(const m of list){
    const f = m.userData.flicker;
    let k = 1;
    if(f && Math.random() < dt*f*3) m.userData.off = 0.05 + Math.random()*0.12;
    if(m.userData.off > 0){ m.userData.off -= dt; k = Math.random() < 0.5 ? 0.15 : 0.6; }
    if(m.userData.disco) { m.material.color.setHSL((t*0.3 + m.userData.disco) % 1, 1, 0.6); }
    m.material.opacity = k;
  }
}

/* a video wall: draws itself at ~12fps from a list of "slides" */
export class VideoWall {
  constructor(scene, C, x, y, z, ry, w, h, slides){
    this.C = C;
    const pxW = 640, pxH = Math.round(640*h/w);
    this.c = canvas(pxW, pxH); this.g = this.c.getContext('2d'); this.W = pxW; this.H = pxH;
    this.t = tex(this.c, { nomip:true });
    const m = new THREE.MeshBasicMaterial({ map:this.t, toneMapped:false });
    this.mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), m);
    this.mesh.position.set(x, y, z); this.mesh.rotation.y = ry || 0;
    scene.add(this.mesh);
    const frame = new THREE.Mesh(new THREE.BoxGeometry(w + 0.16, h + 0.16, 0.12), C.M.black);
    frame.position.copy(this.mesh.position); frame.rotation.y = ry || 0; frame.translateZ(-0.07);
    scene.add(frame);
    this.slides = slides; this.i = 0; this.st = 0; this.acc = 0; this.time = 0;
  }
  update(dt){
    this.st += dt; this.acc += dt; this.time += dt;
    const s = this.slides[this.i];
    if(this.st > (s.dur || 7)){ this.st = 0; this.i = (this.i + 1) % this.slides.length; }
    if(this.acc < 1/8) return;
    this.acc = 0;
    /* only repaint walls you can see from here */
    if(this.C.frustum && (!this.C.frustum.intersectsObject(this.mesh) || this.C.camera.position.distanceToSquared(this.mesh.position) > 900)) return;
    const g = this.g;
    g.save(); this.slides[this.i].draw(g, this.W, this.H, this.st, this.time, this.C); g.restore();
    /* scanlines + a soft vignette so it reads as a screen */
    g.fillStyle = 'rgba(0,0,0,0.12)'; for(let y=0;y<this.H;y+=4) g.fillRect(0, y, this.W, 2);
    this.t.needsUpdate = true;
  }
}
/* stock slides for the walls */
const gold = '#f3cf74';
export const SLIDES = {
  logo:{ dur:7, draw(g, W, H, t){ const gr = g.createLinearGradient(0, 0, W, H); gr.addColorStop(0, '#2a0712'); gr.addColorStop(1, '#090410'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
    for(let i=0;i<40;i++){ const x = (i*97 + t*60) % W, y = (i*53) % H; g.fillStyle = `rgba(243,207,116,${0.2 + 0.2*Math.sin(t*3 + i)})`; g.fillRect(x, y, 3, 3); }
    g.fillStyle = gold; g.textAlign = 'center'; g.shadowColor = '#ffb020'; g.shadowBlur = 30; g.font = `700 ${H*0.22}px "Cinzel", serif`; g.fillText('FRIDGE PALACE', W/2, H*0.48);
    g.shadowBlur = 0; g.font = `${H*0.07}px "Cinzel", serif`; g.fillStyle = '#e9d6a6'; g.fillText('WHERE THE COLD GET HOT', W/2, H*0.66); } },
  jackpot:{ dur:6, draw(g, W, H, t, T, C){ g.fillStyle = '#05030a'; g.fillRect(0, 0, W, H);
    const j = C.save.d.jackpot; g.textAlign = 'center';
    g.fillStyle = '#ff3df2'; g.font = `700 ${H*0.12}px "Cinzel", serif`; g.fillText('PROGRESSIVE JACKPOT', W/2, H*0.28);
    g.fillStyle = Math.sin(T*8) > 0 ? '#ffe36a' : '#ffffff'; g.shadowColor = '#ffcc00'; g.shadowBlur = 40; g.font = `700 ${H*0.3}px "Cinzel", serif`; g.fillText(Math.floor(j).toLocaleString(), W/2, H*0.66); g.shadowBlur = 0;
    g.fillStyle = '#9a8ab0'; g.font = `${H*0.06}px "Cinzel", serif`; g.fillText('DEFROST DELUXE · SLOTS FLOOR WEST', W/2, H*0.85); } },
  frdx:{ dur:8, draw(g, W, H, t, T, C){ g.fillStyle = '#000'; g.fillRect(0, 0, W, H); g.fillStyle = '#ffa028'; g.fillRect(0, 0, W, H*0.16); g.fillStyle = '#000'; g.font = `700 ${H*0.1}px monospace`; g.textAlign = 'left'; g.fillText('FRDX<GO> LIVE', 20, H*0.12);
    let rows = []; try{ if(window.MKT && MKT.state()) rows = MKT.TICKERS.map(tk=>MKT.quote(tk.sym)); }catch(e){}
    if(!rows.length){ g.fillStyle = '#ffa028'; g.font = `${H*0.08}px monospace`; g.fillText('EXCHANGE OFFLINE', 20, H*0.5); return; }
    g.font = `${H*0.075}px monospace`;
    rows.slice(0, 14).forEach((q, i)=>{ const col = i < 7 ? 0 : 1, row = i % 7, x = 20 + col*W/2, y = H*0.27 + row*H*0.105; g.fillStyle = '#ffa028'; g.fillText(q.sym, x, y); g.fillStyle = '#e6e6e6'; g.fillText((q.last < 1 ? q.last.toFixed(4) : q.last.toFixed(2)).padStart(8), x + W*0.11, y); g.fillStyle = q.chg >= 0 ? '#3ddc84' : '#ff4a4a'; g.fillText(((q.pct >= 0 ? '+' : '') + q.pct.toFixed(2) + '%').padStart(8), x + W*0.28, y); }); } },
  drinks:{ dur:6, draw(g, W, H, t){ const gr = g.createRadialGradient(W/2, H/2, 10, W/2, H/2, W*0.6); gr.addColorStop(0, '#3a1440'); gr.addColorStop(1, '#0a0410'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
    g.textAlign = 'center'; g.fillStyle = '#7ff3ff'; g.font = `${H*0.13}px "Pacifico", cursive`; g.fillText('the freezer bar', W/2, H*0.35);
    g.fillStyle = '#f3cf74'; g.font = `${H*0.07}px "Cinzel", serif`; g.fillText('FROZEN MARGARITAS · ICE COLD · 25 CHIPS', W/2, H*0.55);
    g.fillStyle = '#e8a8ff'; g.font = `${H*0.055}px "Cinzel", serif`; g.fillText('please do not drink the coolant', W/2, H*0.72);
    for(let i=0;i<6;i++){ const x = W*(0.15 + i*0.14), y = H*0.87 + Math.sin(t*3 + i)*6; g.fillStyle = ['#ff4a8a','#ffd400','#7ff3ff','#3ddc84','#ff8a3d','#c060ff'][i]; g.beginPath(); g.moveTo(x - 18, y - 20); g.lineTo(x + 18, y - 20); g.lineTo(x, y + 4); g.fill(); g.fillRect(x - 2, y, 4, 18); } } },
  race:{ dur:7, draw(g, W, H, t){ g.fillStyle = '#04140a'; g.fillRect(0, 0, W, H); g.textAlign = 'center'; g.fillStyle = '#3ddc84'; g.font = `700 ${H*0.15}px "Cinzel", serif`; g.fillText('INSIDE TRACK', W/2, H*0.32);
    g.fillStyle = '#e6f5ea'; g.font = `${H*0.07}px "Cinzel", serif`; g.fillText('SIX FRIDGES · ONE HALLWAY · BET ON A WINNER', W/2, H*0.5);
    for(let i=0;i<6;i++){ const x = ((t*160*(1 + i*0.13)) % (W + 120)) - 60, y = H*0.62 + i*H*0.055; g.fillStyle = ['#e33','#3a6fd8','#ffd400','#3ddc84','#ff8a3d','#c060ff'][i]; g.fillRect(x, y, 26, 18); g.fillStyle = '#fff'; g.fillRect(x + 18, y + 3, 3, 6); } } },
  wheel:{ dur:6, draw(g, W, H, t, T, C){ g.fillStyle = '#16040e'; g.fillRect(0, 0, W, H); g.save(); g.translate(W*0.25, H/2); g.rotate(T*0.8); for(let i=0;i<20;i++){ g.fillStyle = i % 2 ? '#ff3df2' : '#ffd400'; g.beginPath(); g.moveTo(0, 0); g.arc(0, 0, H*0.4, i/20*Math.PI*2, (i + 1)/20*Math.PI*2); g.fill(); } g.restore();
    g.textAlign = 'left'; g.fillStyle = '#ffd400'; g.font = `700 ${H*0.11}px "Cinzel", serif`; g.fillText('LUCKY WHEEL', W*0.48, H*0.4); g.fillStyle = '#fff'; g.font = `${H*0.06}px "Cinzel", serif`; g.fillText('ONE FREE SPIN EVERY DAY', W*0.48, H*0.55); g.fillText('WIN THE PODIUM FRIDGE', W*0.48, H*0.66); } },
  member:{ dur:6, draw(g, W, H, t){ g.fillStyle = '#0a0a0a'; g.fillRect(0, 0, W, H); g.strokeStyle = gold; g.lineWidth = 6; g.strokeRect(20, 20, W - 40, H - 40); g.textAlign = 'center'; g.fillStyle = gold; g.font = `700 ${H*0.13}px "Cinzel", serif`; g.fillText('THE PALACE CLUB', W/2, H*0.42); g.fillStyle = '#ddd'; g.font = `${H*0.06}px "Cinzel", serif`; g.fillText('HIGH LIMITS · AMERICAN ROULETTE · NO QUESTIONS', W/2, H*0.6); g.fillText('ASK AT THE CAGE · 5,000 CHIPS', W/2, H*0.72); } },
  missing:{ dur:5, draw(g, W, H, t){ g.fillStyle = '#efe9d8'; g.fillRect(0, 0, W, H); g.fillStyle = '#111'; g.textAlign = 'center'; g.font = `700 ${H*0.12}px Georgia, serif`; g.fillText('HAVE YOU SEEN THIS MAN?', W/2, H*0.2);
    g.fillStyle = '#999'; g.fillRect(W/2 - H*0.2, H*0.27, H*0.4, H*0.4); g.fillStyle = '#555'; g.font = `${H*0.2}px Georgia, serif`; g.fillText('?', W/2, H*0.56);
    g.fillStyle = '#111'; g.font = `${H*0.07}px Georgia, serif`; g.fillText('HANK. LAST SEEN IN THE BASEMENT.', W/2, H*0.8); g.font = `${H*0.05}px Georgia, serif`; g.fillText('he dots his i\'s with little circles', W/2, H*0.9); } }
};
