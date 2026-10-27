/* ============================================================
   FRIDGE PALACE: cards and chips
   the deck is painted once into an atlas. the court cards are
   fridges in hats. chips are real-size clay: 39mm, eight colors.
============================================================ */
import * as THREE from '../lib/three.module.min.js';
import { canvas, tex } from './textures.js';
import { mergeGeometries } from '../lib/addons/utils/BufferGeometryUtils.js';

export const RANKS = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
export const SUITS = ['s','h','d','c'];
const SYM = { s:'♠', h:'♥', d:'♦', c:'♣' };
const RED = { h:1, d:1 };
const CW = 140, CH = 196;
let atlas = null;

function pipLayout(n){
  const L = 0.27, R = 0.73, C = 0.5;
  const T = { 1:[[C,0.5]], 2:[[C,0.2],[C,0.8]], 3:[[C,0.2],[C,0.5],[C,0.8]], 4:[[L,0.2],[R,0.2],[L,0.8],[R,0.8]],
    5:[[L,0.2],[R,0.2],[C,0.5],[L,0.8],[R,0.8]], 6:[[L,0.2],[R,0.2],[L,0.5],[R,0.5],[L,0.8],[R,0.8]],
    7:[[L,0.2],[R,0.2],[C,0.35],[L,0.5],[R,0.5],[L,0.8],[R,0.8]], 8:[[L,0.2],[R,0.2],[C,0.35],[L,0.5],[R,0.5],[C,0.65],[L,0.8],[R,0.8]],
    9:[[L,0.2],[R,0.2],[L,0.4],[R,0.4],[C,0.5],[L,0.6],[R,0.6],[L,0.8],[R,0.8]], 10:[[L,0.2],[R,0.2],[C,0.3],[L,0.4],[R,0.4],[L,0.6],[R,0.6],[C,0.7],[L,0.8],[R,0.8]] };
  return T[n];
}
function rr(g, x, y, w, h, r){ g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }
function drawCourt(g, x, y, rank, suit){
  const col = RED[suit] ? '#b3122a' : '#14141a', acc = RED[suit] ? '#e2b640' : '#3a6fd8';
  g.save(); g.translate(x + CW/2, y + CH/2);
  g.strokeStyle = acc; g.lineWidth = 3; g.strokeRect(-46, -66, 92, 132);
  /* the fridge */
  g.fillStyle = '#f2efe6'; rr(g, -24, -34, 48, 78, 6); g.fill(); g.strokeStyle = col; g.lineWidth = 2.5; g.stroke();
  g.beginPath(); g.moveTo(-24, -10); g.lineTo(24, -10); g.stroke();
  g.fillStyle = col; g.fillRect(14, -28, 3, 12); g.fillRect(14, -4, 3, 20);
  /* face */
  g.fillStyle = '#0d1b26'; g.fillRect(-18, -30, 26, 16); g.fillStyle = '#7ff3ff'; g.fillRect(-14, -26, 4, 6); g.fillRect(-4, -26, 4, 6); g.fillRect(-12, -18, 12, 2);
  /* the hat says who it is */
  g.fillStyle = acc;
  if(rank === 'K'){ g.beginPath(); g.moveTo(-20, -36); g.lineTo(-20, -52); g.lineTo(-10, -42); g.lineTo(0, -56); g.lineTo(10, -42); g.lineTo(20, -52); g.lineTo(20, -36); g.closePath(); g.fill(); }
  if(rank === 'Q'){ g.beginPath(); g.arc(0, -36, 18, Math.PI, 0); g.fill(); g.fillStyle = '#fff'; g.beginPath(); g.arc(0, -46, 4, 0, 7); g.fill(); }
  if(rank === 'J'){ g.beginPath(); g.moveTo(-20, -36); g.quadraticCurveTo(-26, -58, -8, -52); g.lineTo(0, -36); g.quadraticCurveTo(8, -58, 24, -50); g.lineTo(20, -36); g.closePath(); g.fill(); g.fillStyle = col; g.beginPath(); g.arc(-8, -52, 3, 0, 7); g.arc(24, -50, 3, 0, 7); g.fill(); }
  g.font = 'bold 22px Georgia, serif'; g.fillStyle = col; g.textAlign = 'center'; g.fillText(SYM[suit], 0, 62);
  g.restore();
}
export function cardAtlas(){
  if(atlas) return atlas;
  const c = canvas(2048, 1024), g = c.getContext('2d');
  g.fillStyle = '#000'; g.fillRect(0, 0, 2048, 1024);
  SUITS.forEach((s, row)=>RANKS.forEach((r, col)=>{
    const x = col*CW, y = row*CH, cc = RED[s] ? '#b3122a' : '#14141a';
    g.fillStyle = '#fbfaf5'; rr(g, x + 2, y + 2, CW - 4, CH - 4, 10); g.fill();
    g.fillStyle = cc; g.textAlign = 'center';
    g.font = 'bold 26px Georgia, serif'; g.fillText(r, x + 18, y + 30); g.font = '22px Georgia, serif'; g.fillText(SYM[s], x + 18, y + 52);
    g.save(); g.translate(x + CW - 18, y + CH - 30); g.rotate(Math.PI); g.font = 'bold 26px Georgia, serif'; g.fillText(r, 0, 0); g.font = '22px Georgia, serif'; g.fillText(SYM[s], 0, 22); g.restore();
    if(r === 'J' || r === 'Q' || r === 'K') drawCourt(g, x, y, r, s);
    else {
      const n = r === 'A' ? 1 : +r;
      const big = n === 1;
      g.font = (big ? 84 : 30) + 'px Georgia, serif'; g.textBaseline = 'middle';
      pipLayout(n).forEach(([px, py])=>{ g.save(); g.translate(x + 24 + px*(CW - 48), y + 20 + py*(CH - 40)); if(py > 0.55) g.rotate(Math.PI); g.fillText(SYM[s], 0, 0); g.restore(); });
      g.textBaseline = 'alphabetic';
      if(big && s === 's'){ g.fillStyle = '#fbfaf5'; g.fillRect(x + CW/2 - 6, y + CH/2 - 14, 12, 18); g.fillStyle = '#14141a'; g.fillRect(x + CW/2 - 6, y + CH/2 - 7, 12, 1.5); g.font = '9px Georgia, serif'; g.fillText('FRIDGE PALACE', x + CW/2, y + CH - 26); }
    }
  }));
  /* the back */
  const bx = 0, by = 4*CH;
  g.fillStyle = '#fbfaf5'; rr(g, bx + 2, by + 2, CW - 4, CH - 4, 10); g.fill();
  g.fillStyle = '#7a0d1c'; rr(g, bx + 9, by + 9, CW - 18, CH - 18, 6); g.fill();
  g.strokeStyle = '#e2b640'; g.lineWidth = 1.2;
  for(let i=-CH; i<CW + CH; i+=10){ g.beginPath(); g.moveTo(bx + 9 + i, by + 9); g.lineTo(bx + 9 + i - CH, by + CH - 9); g.stroke(); g.beginPath(); g.moveTo(bx + 9 + i - CH, by + 9); g.lineTo(bx + 9 + i, by + CH - 9); g.stroke(); }
  g.fillStyle = '#7a0d1c'; g.fillRect(bx + 0, by + 0, 9, CH); g.fillRect(bx + CW - 9, by, 9, CH); g.fillRect(bx, by, CW, 9); g.fillRect(bx, by + CH - 9, CW, 9);
  g.fillStyle = '#fbfaf5'; g.beginPath(); g.arc(bx + CW/2, by + CH/2, 30, 0, 7); g.fill(); g.strokeStyle = '#e2b640'; g.lineWidth = 3; g.stroke();
  g.fillStyle = '#7a0d1c'; g.fillRect(bx + CW/2 - 10, by + CH/2 - 18, 20, 36); g.fillStyle = '#fbfaf5'; g.fillRect(bx + CW/2 - 10, by + CH/2 - 6, 20, 2); g.fillRect(bx + CW/2 + 5, by + CH/2 - 14, 2, 6);
  atlas = tex(c, { aniso:8 });
  return atlas;
}
const geoC = {};
function cardGeo(idx){
  if(geoC[idx]) return geoC[idx];
  const g = new THREE.PlaneGeometry(0.063, 0.088);
  const col = idx === 'back' ? 0 : idx % 13, row = idx === 'back' ? 4 : Math.floor(idx/13);
  const u0 = col*CW/2048, u1 = (col + 1)*CW/2048, v1 = 1 - row*CH/1024, v0 = 1 - (row + 1)*CH/1024;
  const uv = g.attributes.uv; uv.setXY(0, u0, v1); uv.setXY(1, u1, v1); uv.setXY(2, u0, v0); uv.setXY(3, u1, v0);
  return geoC[idx] = g;
}
let cardMat = null;
/* card ids: 0..51 = suitIndex*13 + rankIndex */
export function cardId(r, s){ return SUITS.indexOf(s)*13 + RANKS.indexOf(r); }
export function makeCard(id){
  if(!cardMat) cardMat = new THREE.MeshStandardMaterial({ map:cardAtlas(), roughness:0.55, metalness:0 });
  const grp = new THREE.Group();
  const front = new THREE.Mesh(cardGeo(id), cardMat); front.rotation.x = -Math.PI/2;
  const back = new THREE.Mesh(cardGeo('back'), cardMat); back.rotation.x = Math.PI/2; back.position.y = -0.0004;
  grp.add(front, back);
  grp.userData.id = id;
  /* face down by default: flip 180 around the length */
  return grp;
}
export function setCardFace(card, up){ card.rotation.z = up ? 0 : Math.PI; }

/* ---------- chips ---------- */
export const DENOMS = [
  { v:25000, c:'#2a9d8f', s:'#f4e3b2' }, { v:5000, c:'#f08a24', s:'#1a1a1a' }, { v:1000, c:'#f2c230', s:'#5a3a00' },
  { v:500, c:'#6a2c91', s:'#f3e9ff' }, { v:100, c:'#151515', s:'#e9e2c8' }, { v:25, c:'#1f8a3a', s:'#f5f5f5' },
  { v:5, c:'#c0182a', s:'#f5f5f5' }, { v:1, c:'#f2f0ea', s:'#2d58c8' }
];
/* every chip in the building shares one texture: each denomination gets a row,
   the face on the left, the edge stripes on the right */
let chipAtlas = null, chipMat = null;
function chipAtlasTex(){
  if(chipAtlas) return chipAtlas;
  const c = canvas(1024, 1024), g = c.getContext('2d');
  DENOMS.forEach((d, row)=>{
    const y = row*128;
    g.fillStyle = d.c; g.fillRect(0, y, 1024, 128);
    /* face */
    g.save(); g.translate(64, y + 64);
    g.fillStyle = d.s; for(let i=0;i<8;i++){ g.save(); g.rotate(i*Math.PI/4); g.fillRect(-7, -64, 14, 18); g.restore(); }
    g.strokeStyle = d.s; g.lineWidth = 3; g.beginPath(); g.arc(0, 0, 40, 0, 7); g.stroke();
    g.fillStyle = d.s; g.font = 'bold 26px Georgia, serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(d.v >= 1000 ? (d.v/1000) + 'K' : d.v, 0, 2);
    g.restore();
    /* edge */
    g.fillStyle = d.s; for(let i=0;i<8;i++) g.fillRect(128 + i*112 + 30, y, 44, 128);
  });
  chipAtlas = tex(c);
  return chipAtlas;
}
function chipMaterial(){ if(!chipMat) chipMat = new THREE.MeshStandardMaterial({ map:chipAtlasTex(), roughness:0.45 }); return chipMat; }
/* one chip geometry per denomination, UVs pointed at its row */
const chipGeos = {};
function chipGeo(d){
  if(chipGeos[d.v]) return chipGeos[d.v];
  const row = DENOMS.indexOf(d);
  const g = new THREE.CylinderGeometry(0.0195, 0.0195, 0.0034, 24, 1).toNonIndexed();
  const pos = g.attributes.position, uv = g.attributes.uv, nrm = g.attributes.normal;
  const v0 = 1 - (row + 1)/8, v1 = 1 - row/8;
  for(let i=0;i<pos.count;i++){
    const ny = nrm.getY(i);
    if(Math.abs(ny) > 0.5){ /* cap: map x,z onto the face square */ const x = pos.getX(i)/0.0195, z = pos.getZ(i)/0.0195; uv.setXY(i, (0.5 + x*0.5)*0.125, v0 + (0.5 - z*0.5)*(v1 - v0)); }
    else { const u = uv.getX(i); uv.setXY(i, 0.125 + u*0.875, v0 + (uv.getY(i) > 0.5 ? (v1 - v0)*0.98 : (v1 - v0)*0.02)); }
  }
  g.clearGroups();
  return chipGeos[d.v] = g;
}
export function breakdown(amount){
  const out = []; let a = Math.floor(amount);
  for(const d of DENOMS){ while(a >= d.v && out.length < 40){ out.push(d); a -= d.v; } }
  return out;
}
/* a stack (or a few side by side) that adds up to amount: one merged mesh, one draw call */
const _m4 = new THREE.Matrix4(), _q = new THREE.Quaternion(), _e = new THREE.Euler(), _p = new THREE.Vector3(), _s = new THREE.Vector3(1, 1, 1);
export function chipStack(amount, o){
  o = o || {};
  const chips = breakdown(amount);
  const geos = [];
  let col = 0, h = 0, per = o.per || 12;
  chips.forEach((d, i)=>{
    if(i > 0 && i % per === 0){ col++; h = 0; }
    _p.set(col*0.042 + (Math.random() - 0.5)*0.002, 0.0017 + h, (Math.random() - 0.5)*0.002); _e.set(0, Math.random()*6, 0); _q.setFromEuler(_e);
    _m4.compose(_p, _q, _s);
    geos.push(chipGeo(d).clone().applyMatrix4(_m4));
    h += 0.0035;
  });
  const grp = new THREE.Group();
  if(geos.length){ const merged = mergeGeometries(geos, false); geos.forEach(g=>g.dispose()); const mesh = new THREE.Mesh(merged, chipMaterial()); grp.add(mesh);
    /* every stack has its own merged geometry; when a stack is taken off the table, free the GPU copy
       (dispose only drops the buffers, so a stack that gets put back simply uploads again) */
    grp.addEventListener('removed', ()=>merged.dispose()); }
  grp.userData.amount = amount;
  return grp;
}
/* a cheap stack for decoration: one tall cylinder wearing the edge stripes */
const decorGeo = {};
export function decorStack(B, x, y, z, count, denomV, s){
  s = s || 1;
  const d = DENOMS.find(q=>q.v === denomV) || DENOMS[4], row = DENOMS.indexOf(d);
  const g = new THREE.CylinderGeometry(0.0195*s, 0.0195*s, 0.0035*count*s, 16, 1, false);
  const uv = g.attributes.uv, nrm = g.attributes.normal; const v0 = 1 - (row + 1)/8, v1 = 1 - row/8;
  for(let i=0;i<uv.count;i++){ if(Math.abs(nrm.getY(i)) > 0.5) uv.setXY(i, 0.06, v0 + (v1 - v0)*0.5); else uv.setXY(i, 0.125 + uv.getX(i)*0.875, v0 + (v1 - v0)*0.5); }
  B.add(g, chipMaterial(), x, y + 0.0035*count*s/2, z);
}
