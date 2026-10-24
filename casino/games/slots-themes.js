/* ============================================================
   FRIDGE PALACE: slot machines, the math and the art
   pure functions up top (testable in node), painters below.
   every theme's return-to-player was checked by simulating
   a few million spins; numbers are in the comments.
============================================================ */

/* ---------- the math ---------- */
const L3 = [[1,1,1],[0,0,0],[2,2,2],[0,1,2],[2,1,0]];
const L20 = [[1,1,1,1,1],[0,0,0,0,0],[2,2,2,2,2],[0,1,2,1,0],[2,1,0,1,2],[0,0,1,2,2],[2,2,1,0,0],[1,0,0,0,1],[1,2,2,2,1],[1,0,1,2,1],
  [1,2,1,0,1],[0,1,1,1,0],[2,1,1,1,2],[0,1,0,1,0],[2,1,2,1,2],[1,1,0,1,1],[1,1,2,1,1],[0,0,2,0,0],[2,2,0,2,2],[0,2,2,2,0]];
const L25 = L20.concat([[2,0,0,0,2],[1,0,2,0,1],[1,2,0,2,1],[0,2,0,2,0],[2,0,2,0,2]]);
const strip = spec=>{ const out = []; Object.keys(spec).forEach(k=>{ for(let i=0;i<spec[k];i++) out.push(k); }); /* deterministic interleave so symbols spread out */ const res = []; let seed = 7; while(out.length){ seed = (seed*1103515245 + 12345) & 0x7fffffff; res.push(out.splice(seed % out.length, 1)[0]); } return res; };

export const THEMES = {
  burn:{
    id:'burn', name:'FREEZER BURN', sub:'classic 3 reel · 5 lines', reels:3, rows:3, lines:L3, wild:'fridge', bets:[1, 2, 5, 10, 25], color:'#c8162a', trim:'#ffd56a', bg:['#2a0610', '#120208'],
    strips:[strip({ pop:9, ice:8, milk:6, bar:6, bar2:4, seven:3, fridge:2 }), strip({ pop:9, ice:8, milk:6, bar:6, bar2:4, seven:3, fridge:2 }), strip({ pop:9, ice:8, milk:6, bar:6, bar2:4, seven:3, fridge:2 })],
    pays:{ fridge:[400], seven:[75], bar2:[30], bar:[16], milk:[11], ice:[9], pop:[5] }, anybar:4,
    names:{ fridge:'WILD FRIDGE', seven:'LUCKY 7', bar2:'DOUBLE BAR', bar:'BAR', milk:'MILK', ice:'ICE', pop:'POPSICLE' }
  },
  cash:{
    id:'cash', name:'COLD HARD CASH', sub:'5 reels · 20 lines · free spins', reels:5, rows:3, lines:L20, wild:'wild', scatter:'snow', bets:[1, 2, 5, 10], color:'#1f7a3e', trim:'#f3cf74', bg:['#04210f', '#010a05'],
    strips:[0,1,2,3,4].map(i=>strip({ t10:7, J:7, Q:6, K:5, A:5, cube:4, gbar:3, gem:2, safe:2, wild:i === 0 ? 0 : 1, snow:1 })),
    pays:{ safe:[150, 625, 3125], gem:[100, 375, 1550], gbar:[75, 250, 925], cube:[50, 150, 625], A:[30, 95, 375], K:[30, 75, 300], Q:[25, 60, 250], J:[20, 50, 175], t10:[20, 50, 150], wild:[150, 750, 6225] },
    scatterPays:{ 3:2, 4:10, 5:50 }, free:{ count:8, mult:2 },
    names:{ safe:'THE SAFE', gem:'ICE DIAMOND', gbar:'GOLD BAR', cube:'ICE CUBE', A:'A', K:'K', Q:'Q', J:'J', t10:'10', wild:'GOLDEN FRIDGE (wild)', snow:'SNOWFLAKE (scatter)' }
  },
  ice:{
    id:'ice', name:'ICE QUEEN', sub:'5 reels · 25 lines · expanding wilds', reels:5, rows:3, lines:L25, wild:'iw', scatter:'crys', expand:[1,2,3], bets:[1, 2, 4, 8], color:'#3a6fd8', trim:'#d8f3ff', bg:['#06162e', '#020812'],
    strips:[0,1,2,3,4].map(i=>strip({ t10:8, J:8, Q:7, K:6, A:5, peng:4, bear:3, crown:2, queen:2, iw:(i >= 1 && i <= 3) ? 1 : 0, crys:1 })),
    pays:{ queen:[125, 450, 2300], crown:[70, 225, 950], bear:[45, 150, 575], peng:[30, 95, 375], A:[20, 55, 200], K:[15, 45, 175], Q:[15, 40, 125], J:[10, 30, 95], t10:[8, 25, 75], iw:[0, 0, 0] },
    scatterPays:{ 3:2, 4:8, 5:40 }, free:{ count:10, mult:3 },
    names:{ queen:'THE ICE QUEEN', crown:'CROWN', bear:'POLAR BEAR', peng:'PENGUIN', A:'A', K:'K', Q:'Q', J:'J', t10:'10', iw:'ICE WILD (expands)', crys:'CRYSTAL (scatter)' }
  },
  defrost:{
    id:'defrost', name:'DEFROST DELUXE', sub:'progressive · 1 line · max bet for the jackpot', reels:3, rows:3, lines:[[1,1,1]], bets:[5, 10, 25], color:'#7ff3ff', trim:'#ff3df2', bg:['#0a0420', '#03010a'], progressive:true,
    strips:[0,1,2].map(()=>strip({ drop:10, snow:8, therm:6, bell:5, bar3:3, jack:1, blank:9 })),
    pays:{ jack:[1000], bar3:[150], bell:[45], therm:[22], snow:[14], drop:[7] }, cherryish:{ drop:[2, 3] },
    names:{ jack:'JACKPOT (max bet)', bar3:'TRIPLE BAR', bell:'BELL', therm:'THERMOSTAT', snow:'SNOW', drop:'DROP', blank:'blank' }
  },
  vendor:{
    id:'vendor', name:"THE VENDOR'S BACK ROOM", sub:'5 reels · 20 lines · pick a fridge', reels:5, rows:3, lines:L20, wild:'him', scatter:'tally', bets:[1, 3, 7], color:'#2a0a0a', trim:'#ff3a2a', bg:['#140404', '#030000'],
    strips:[0,1,2,3,4].map(i=>strip({ bulb:8, tape:7, watch:6, magnet:5, sauce:4, tag:3, him:i === 0 ? 0 : 1, tally:1, dark:4 })),
    pays:{ tag:[90, 325, 1777], sauce:[45, 150, 650], magnet:[25, 90, 325], watch:[20, 55, 225], tape:[10, 35, 125], bulb:[9, 20, 90], him:[65, 300, 1777] },
    scatterPays:{ 3:3, 4:12, 5:77 }, pick:true,
    names:{ tag:'A TAG', sauce:'THE SAUCE', magnet:'MAGNET', watch:'THE WATCH', tape:'THE TAPE', bulb:'BULB', him:'HIM (wild)', tally:'TALLY (bonus)', dark:'dark' }
  }
};

/* evaluate a window: grid[reel][row] */
export function evaluate(th, grid, lineBet, nLines){
  const lines = th.lines.slice(0, nLines || th.lines.length);
  const wins = [];
  let total = 0;
  let g = grid;
  if(th.expand){ g = grid.map((col, r)=>th.expand.indexOf(r) >= 0 && col.indexOf(th.wild) >= 0 ? col.map(()=>th.wild) : col); }
  lines.forEach((ln, li)=>{
    const syms = ln.map((row, reel)=>g[reel][row]);
    if(th.reels === 3){
      const isW = s=>s === th.wild;
      let target = syms.find(s=>!isW(s)) || th.wild;
      const allMatch = syms.every(s=>s === target || isW(s));
      let pay = 0;
      if(allMatch && th.pays[target]) pay = th.pays[target][0];
      else if(th.anybar && syms.every(s=>s === 'bar' || s === 'bar2' || isW(s))) pay = th.anybar;
      else if(th.cherryish){ const n = syms.filter(s=>s === 'drop').length; if(n && syms[0] === 'drop'){ pay = th.cherryish.drop[Math.min(1, n - 1)]; } }
      if(pay){ wins.push({ line:li, cells:ln.map((row, reel)=>[reel, row]), sym:target, n:3, amt:pay*lineBet }); total += pay*lineBet; }
      return;
    }
    let target = null;
    for(const s of syms){ if(s !== th.wild){ target = s; break; } }
    if(target === th.scatter || target === 'dark' || target === 'blank') return;
    if(!target) target = th.wild;
    let n = 0;
    for(const s of syms){ if(s === target || (s === th.wild && target !== th.scatter)) n++; else break; }
    /* a line of leading wilds can pay more as wilds than as the symbol */
    let wn = 0; for(const s of syms){ if(s === th.wild) wn++; else break; }
    let pay = n >= 3 && th.pays[target] ? th.pays[target][n - 3] : 0, sym = target, cnt = n;
    if(wn >= 3 && th.pays[th.wild] && th.pays[th.wild][wn - 3] > pay){ pay = th.pays[th.wild][wn - 3]; sym = th.wild; cnt = wn; }
    if(pay){ wins.push({ line:li, cells:ln.slice(0, cnt).map((row, reel)=>[reel, row]), sym, n:cnt, amt:pay*lineBet }); total += pay*lineBet; }
  });
  let scat = 0, scells = [];
  if(th.scatter){ g.forEach((col, r)=>col.forEach((s, row)=>{ if(s === th.scatter){ scat++; scells.push([r, row]); } })); }
  let feature = null;
  if(scat >= 3){
    const totBet = lineBet*lines.length;
    const sp = th.scatterPays[Math.min(5, scat)] || 0;
    if(sp){ total += sp*totBet; wins.push({ line:-1, cells:scells, sym:th.scatter, n:scat, amt:sp*totBet }); }
    if(th.free) feature = { type:'free', count:th.free.count, mult:th.free.mult };
    if(th.pick) feature = { type:'pick' };
  }
  return { wins, total, feature, grid:g, scat };
}
export function spinGrid(th, rnd){
  const stops = th.strips.map(s=>rnd(s.length));
  const grid = th.strips.map((s, r)=>{ const out = []; for(let row=0; row<th.rows; row++) out.push(s[(stops[r] + row) % s.length]); return out; });
  return { stops, grid };
}
/* the vendor's pick bonus: six fridges, one of them is him */
export function pickPrizes(rnd){
  const prizes = [5, 8, 10, 15, 25, 'him'];
  for(let i=prizes.length - 1; i>0; i--){ const j = rnd(i + 1); [prizes[i], prizes[j]] = [prizes[j], prizes[i]]; }
  return prizes;
}

/* ---------- the art ---------- */
function rr(g, x, y, w, h, r){ g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }
function fridgeIcon(g, cx, cy, s, body, trim, face){
  g.save(); g.translate(cx, cy); g.scale(s, s);
  const gr = g.createLinearGradient(-24, 0, 24, 0); gr.addColorStop(0, body[0]); gr.addColorStop(0.5, body[1]); gr.addColorStop(1, body[0]);
  g.fillStyle = gr; rr(g, -22, -34, 44, 68, 6); g.fill(); g.strokeStyle = trim; g.lineWidth = 2.5; g.stroke();
  g.beginPath(); g.moveTo(-22, -12); g.lineTo(22, -12); g.stroke();
  g.fillStyle = trim; g.fillRect(13, -28, 3, 11); g.fillRect(13, -6, 3, 20);
  if(face){ g.fillStyle = '#0a1018'; g.fillRect(-17, -30, 26, 15); g.fillStyle = face; g.fillRect(-13, -26, 4, 6); g.fillRect(-3, -26, 4, 6); }
  g.restore();
}
function letter(g, t, col, cx, cy){ g.save(); g.font = 'bold 54px Georgia, serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.lineWidth = 6; g.strokeStyle = '#000'; g.strokeText(t, cx, cy); const gr = g.createLinearGradient(0, cy - 25, 0, cy + 25); gr.addColorStop(0, '#fff'); gr.addColorStop(1, col); g.fillStyle = gr; g.fillText(t, cx, cy); g.fillStyle = 'rgba(255,255,255,0.8)'; for(let i=0;i<4;i++) g.fillRect(cx - 20 + i*12, cy - 26 + (i%2)*4, 3, 3); g.restore(); }
function barPlate(g, cx, cy, n, col){ for(let i=0;i<n;i++){ const y = cy - (n - 1)*14 + i*28; g.fillStyle = col; rr(g, cx - 40, y - 11, 80, 22, 5); g.fill(); g.strokeStyle = '#fff'; g.lineWidth = 2; g.stroke(); g.fillStyle = '#fff'; g.font = 'bold 16px Georgia, serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('BAR', cx, y + 1); } }
function gem(g, cx, cy, col){ g.save(); g.translate(cx, cy); const gr = g.createLinearGradient(-30, -30, 30, 30); gr.addColorStop(0, '#fff'); gr.addColorStop(0.4, col); gr.addColorStop(1, '#123'); g.fillStyle = gr; g.beginPath(); g.moveTo(0, -30); g.lineTo(30, -6); g.lineTo(0, 32); g.lineTo(-30, -6); g.closePath(); g.fill(); g.strokeStyle = 'rgba(255,255,255,0.8)'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(-30, -6); g.lineTo(30, -6); g.moveTo(-12, -6); g.lineTo(0, 32); g.lineTo(12, -6); g.moveTo(-12, -6); g.lineTo(0, -30); g.lineTo(12, -6); g.stroke(); g.restore(); }
function snowflake(g, cx, cy, r, col){ g.save(); g.translate(cx, cy); g.strokeStyle = col; g.lineWidth = 4; g.lineCap = 'round'; for(let i=0;i<6;i++){ g.rotate(Math.PI/3); g.beginPath(); g.moveTo(0, 0); g.lineTo(0, -r); g.moveTo(0, -r*0.6); g.lineTo(-r*0.25, -r*0.8); g.moveTo(0, -r*0.6); g.lineTo(r*0.25, -r*0.8); g.stroke(); } g.restore(); }
export const PAINT = {
  pop(g, cx, cy){ g.fillStyle = '#d9a46a'; g.fillRect(cx - 4, cy + 10, 8, 26); const gr = g.createLinearGradient(cx - 22, 0, cx + 22, 0); gr.addColorStop(0, '#ff2a5a'); gr.addColorStop(0.5, '#ff7aa0'); gr.addColorStop(1, '#ff2a5a'); g.fillStyle = gr; rr(g, cx - 20, cy - 34, 40, 50, 18); g.fill(); g.fillStyle = 'rgba(255,255,255,0.5)'; g.fillRect(cx - 12, cy - 26, 5, 28); },
  ice(g, cx, cy){ g.save(); g.translate(cx, cy); g.rotate(-0.2); const gr = g.createLinearGradient(-26, -26, 26, 26); gr.addColorStop(0, '#f0fbff'); gr.addColorStop(1, '#6ac8f0'); g.fillStyle = gr; rr(g, -26, -26, 52, 52, 8); g.fill(); g.strokeStyle = '#fff'; g.lineWidth = 3; g.stroke(); g.fillStyle = 'rgba(255,255,255,0.8)'; g.fillRect(-16, -18, 10, 10); g.restore(); },
  milk(g, cx, cy){ g.fillStyle = '#f7f7f2'; g.beginPath(); g.moveTo(cx - 20, cy - 14); g.lineTo(cx, cy - 34); g.lineTo(cx + 20, cy - 14); g.lineTo(cx + 20, cy + 32); g.lineTo(cx - 20, cy + 32); g.closePath(); g.fill(); g.fillStyle = '#3a6fd8'; g.fillRect(cx - 20, cy, 40, 14); g.fillStyle = '#fff'; g.font = 'bold 11px Georgia, serif'; g.textAlign = 'center'; g.fillText('MILK', cx, cy + 11); },
  bar(g, cx, cy){ barPlate(g, cx, cy, 1, '#c8162a'); },
  bar2(g, cx, cy){ barPlate(g, cx, cy, 2, '#c8162a'); },
  bar3(g, cx, cy){ barPlate(g, cx, cy, 3, '#6a2c91'); },
  seven(g, cx, cy){ g.save(); g.font = 'bold 84px Georgia, serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.lineWidth = 8; g.strokeStyle = '#fff'; g.strokeText('7', cx, cy + 4); const gr = g.createLinearGradient(0, cy - 40, 0, cy + 40); gr.addColorStop(0, '#ff5a5a'); gr.addColorStop(1, '#8a0010'); g.fillStyle = gr; g.fillText('7', cx, cy + 4); g.restore(); },
  fridge(g, cx, cy){ fridgeIcon(g, cx, cy, 1, ['#d9a441', '#fff2b8'], '#7a5010', '#7ff3ff'); g.fillStyle = '#fff'; g.font = 'bold 13px Georgia, serif'; g.textAlign = 'center'; g.fillText('WILD', cx, cy + 46); },
  t10(g, cx, cy){ letter(g, '10', '#7ff3ff', cx, cy); }, J(g, cx, cy){ letter(g, 'J', '#5dff9c', cx, cy); }, Q(g, cx, cy){ letter(g, 'Q', '#ff7ad0', cx, cy); }, K(g, cx, cy){ letter(g, 'K', '#ffd56a', cx, cy); }, A(g, cx, cy){ letter(g, 'A', '#ff6a3d', cx, cy); },
  cube(g, cx, cy){ PAINT.ice(g, cx, cy); },
  gbar(g, cx, cy){ g.save(); g.translate(cx, cy); const gr = g.createLinearGradient(0, -20, 0, 20); gr.addColorStop(0, '#fff3b0'); gr.addColorStop(1, '#a8740e'); g.fillStyle = gr; g.beginPath(); g.moveTo(-34, 18); g.lineTo(34, 18); g.lineTo(24, -16); g.lineTo(-24, -16); g.closePath(); g.fill(); g.strokeStyle = '#5a3a00'; g.lineWidth = 2; g.stroke(); g.fillStyle = '#5a3a00'; g.font = 'bold 10px Georgia'; g.textAlign = 'center'; g.fillText('999.9', 0, 6); g.restore(); },
  gem(g, cx, cy){ gem(g, cx, cy, '#7ff3ff'); },
  safe(g, cx, cy){ g.fillStyle = '#2a2a30'; rr(g, cx - 30, cy - 30, 60, 60, 6); g.fill(); g.strokeStyle = '#f3cf74'; g.lineWidth = 3; g.stroke(); g.beginPath(); g.arc(cx, cy, 14, 0, 7); g.stroke(); for(let i=0;i<8;i++){ const a = i*Math.PI/4; g.beginPath(); g.moveTo(cx + Math.cos(a)*14, cy + Math.sin(a)*14); g.lineTo(cx + Math.cos(a)*19, cy + Math.sin(a)*19); g.stroke(); } },
  wild(g, cx, cy){ fridgeIcon(g, cx, cy - 4, 0.95, ['#d9a441', '#fff2b8'], '#7a5010', '#7ff3ff'); g.fillStyle = '#fff'; g.strokeStyle = '#000'; g.lineWidth = 4; g.font = 'bold 18px Georgia, serif'; g.textAlign = 'center'; g.strokeText('WILD', cx, cy + 40); g.fillText('WILD', cx, cy + 40); },
  snow(g, cx, cy){ snowflake(g, cx, cy, 30, '#e8faff'); },
  peng(g, cx, cy){ g.fillStyle = '#111'; g.beginPath(); g.ellipse(cx, cy + 4, 22, 32, 0, 0, 7); g.fill(); g.fillStyle = '#fff'; g.beginPath(); g.ellipse(cx, cy + 10, 14, 22, 0, 0, 7); g.fill(); g.fillStyle = '#ffb020'; g.beginPath(); g.moveTo(cx - 5, cy - 14); g.lineTo(cx + 5, cy - 14); g.lineTo(cx, cy - 6); g.fill(); g.fillStyle = '#fff'; g.fillRect(cx - 9, cy - 22, 5, 5); g.fillRect(cx + 4, cy - 22, 5, 5); },
  bear(g, cx, cy){ g.fillStyle = '#f4f8ff'; g.beginPath(); g.arc(cx, cy, 28, 0, 7); g.fill(); g.beginPath(); g.arc(cx - 20, cy - 22, 9, 0, 7); g.arc(cx + 20, cy - 22, 9, 0, 7); g.fill(); g.fillStyle = '#111'; g.beginPath(); g.arc(cx - 9, cy - 5, 3.5, 0, 7); g.arc(cx + 9, cy - 5, 3.5, 0, 7); g.arc(cx, cy + 8, 6, 0, 7); g.fill(); },
  crown(g, cx, cy){ g.fillStyle = '#ffd56a'; g.beginPath(); g.moveTo(cx - 32, cy + 20); g.lineTo(cx - 32, cy - 14); g.lineTo(cx - 16, cy); g.lineTo(cx, cy - 26); g.lineTo(cx + 16, cy); g.lineTo(cx + 32, cy - 14); g.lineTo(cx + 32, cy + 20); g.closePath(); g.fill(); g.strokeStyle = '#7a5010'; g.lineWidth = 2; g.stroke(); ['#7ff3ff', '#ff3a5a', '#7ff3ff'].forEach((c, i)=>{ g.fillStyle = c; g.beginPath(); g.arc(cx - 16 + i*16, cy + 8, 4, 0, 7); g.fill(); }); },
  queen(g, cx, cy){ fridgeIcon(g, cx, cy + 4, 0.9, ['#d8f3ff', '#ffffff'], '#3a6fd8', '#3a6fd8'); g.fillStyle = '#d8f3ff'; g.beginPath(); g.moveTo(cx - 18, cy - 26); g.lineTo(cx - 12, cy - 40); g.lineTo(cx - 4, cy - 30); g.lineTo(cx, cy - 44); g.lineTo(cx + 4, cy - 30); g.lineTo(cx + 12, cy - 40); g.lineTo(cx + 18, cy - 26); g.closePath(); g.fill(); },
  iw(g, cx, cy){ g.fillStyle = 'rgba(160,230,255,0.35)'; rr(g, cx - 40, cy - 40, 80, 80, 8); g.fill(); snowflake(g, cx, cy - 6, 22, '#ffffff'); g.fillStyle = '#fff'; g.strokeStyle = '#06162e'; g.lineWidth = 4; g.font = 'bold 18px Georgia, serif'; g.textAlign = 'center'; g.strokeText('WILD', cx, cy + 32); g.fillText('WILD', cx, cy + 32); },
  crys(g, cx, cy){ gem(g, cx, cy, '#c060ff'); },
  drop(g, cx, cy){ const gr = g.createLinearGradient(0, cy - 30, 0, cy + 30); gr.addColorStop(0, '#d8fbff'); gr.addColorStop(1, '#2a9fd8'); g.fillStyle = gr; g.beginPath(); g.moveTo(cx, cy - 32); g.bezierCurveTo(cx + 26, cy, cx + 24, cy + 30, cx, cy + 30); g.bezierCurveTo(cx - 24, cy + 30, cx - 26, cy, cx, cy - 32); g.fill(); },
  therm(g, cx, cy){ g.fillStyle = '#eee'; rr(g, cx - 7, cy - 34, 14, 52, 7); g.fill(); g.beginPath(); g.arc(cx, cy + 24, 12, 0, 7); g.fill(); g.fillStyle = '#e33'; g.fillRect(cx - 3, cy - 10, 6, 30); g.beginPath(); g.arc(cx, cy + 24, 8, 0, 7); g.fill(); },
  bell(g, cx, cy){ const gr = g.createLinearGradient(cx - 26, 0, cx + 26, 0); gr.addColorStop(0, '#a8740e'); gr.addColorStop(0.5, '#fff3b0'); gr.addColorStop(1, '#a8740e'); g.fillStyle = gr; g.beginPath(); g.moveTo(cx - 28, cy + 20); g.quadraticCurveTo(cx - 24, cy - 30, cx, cy - 30); g.quadraticCurveTo(cx + 24, cy - 30, cx + 28, cy + 20); g.closePath(); g.fill(); g.beginPath(); g.arc(cx, cy + 24, 6, 0, 7); g.fill(); },
  jack(g, cx, cy){ g.fillStyle = '#ff3df2'; rr(g, cx - 40, cy - 24, 80, 48, 8); g.fill(); g.strokeStyle = '#fff'; g.lineWidth = 3; g.stroke(); g.fillStyle = '#fff'; g.font = 'bold 15px Georgia, serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('JACK', cx, cy - 8); g.fillText('POT', cx, cy + 10); },
  blank(){},
  dark(g, cx, cy){ g.fillStyle = 'rgba(0,0,0,0.6)'; g.fillRect(cx - 40, cy - 40, 80, 80); },
  bulb(g, cx, cy){ g.fillStyle = '#fff3b0'; g.beginPath(); g.arc(cx, cy - 6, 20, 0, 7); g.fill(); g.fillStyle = '#888'; g.fillRect(cx - 9, cy + 12, 18, 14); g.strokeStyle = '#555'; g.lineWidth = 2; for(let i=0;i<3;i++){ g.beginPath(); g.moveTo(cx - 9, cy + 16 + i*4); g.lineTo(cx + 9, cy + 16 + i*4); g.stroke(); } },
  tape(g, cx, cy){ g.fillStyle = '#222'; rr(g, cx - 34, cy - 22, 68, 44, 4); g.fill(); g.fillStyle = '#e8d8b0'; g.fillRect(cx - 28, cy - 18, 56, 16); g.fillStyle = '#111'; g.font = '9px Georgia'; g.textAlign = 'center'; g.fillText('SCREAM MIX', cx, cy - 7); g.fillStyle = '#eee'; g.beginPath(); g.arc(cx - 14, cy + 9, 6, 0, 7); g.arc(cx + 14, cy + 9, 6, 0, 7); g.fill(); },
  watch(g, cx, cy){ g.fillStyle = '#5a3a1a'; g.fillRect(cx - 9, cy - 36, 18, 72); g.fillStyle = '#d9a441'; g.beginPath(); g.arc(cx, cy, 22, 0, 7); g.fill(); g.fillStyle = '#f8f4e8'; g.beginPath(); g.arc(cx, cy, 17, 0, 7); g.fill(); g.strokeStyle = '#111'; g.lineWidth = 2; g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx, cy - 12); g.moveTo(cx, cy); g.lineTo(cx + 9, cy + 3); g.stroke(); },
  magnet(g, cx, cy){ g.fillStyle = '#e33'; g.font = 'bold 60px Georgia, serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('E', cx, cy + 3); },
  sauce(g, cx, cy){ g.fillStyle = '#6a1a0a'; rr(g, cx - 14, cy - 18, 28, 50, 6); g.fill(); g.fillRect(cx - 6, cy - 34, 12, 18); g.fillStyle = '#f3e3c0'; g.fillRect(cx - 14, cy - 2, 28, 16); g.fillStyle = '#6a1a0a'; g.font = 'bold 8px Georgia'; g.textAlign = 'center'; g.fillText('SAUCE', cx, cy + 9); },
  tag(g, cx, cy){ g.save(); g.translate(cx, cy); g.rotate(-0.15); g.fillStyle = '#efe4c8'; g.beginPath(); g.moveTo(-26, -18); g.lineTo(18, -18); g.lineTo(30, 0); g.lineTo(18, 18); g.lineTo(-26, 18); g.closePath(); g.fill(); g.fillStyle = '#140404'; g.beginPath(); g.arc(20, 0, 3, 0, 7); g.fill(); g.font = 'bold 16px Georgia'; g.textAlign = 'center'; g.fillText('#00', -4, 6); g.restore(); },
  him(g, cx, cy){ g.fillStyle = '#cfc8ae'; rr(g, cx - 26, cy - 36, 52, 72, 5); g.fill(); g.fillStyle = '#0a0404'; g.fillRect(cx - 20, cy - 30, 40, 22); g.fillStyle = '#ff3a2a'; g.fillRect(cx - 13, cy - 24, 5, 9); g.fillRect(cx + 8, cy - 24, 5, 9); g.fillStyle = '#6e6857'; g.fillRect(cx + 17, cy - 2, 3, 22); },
  tally(g, cx, cy){ g.strokeStyle = '#efe4c8'; g.lineWidth = 4; for(let i=0;i<4;i++){ g.beginPath(); g.moveTo(cx - 22 + i*12, cy - 24); g.lineTo(cx - 22 + i*12, cy + 24); g.stroke(); } g.beginPath(); g.moveTo(cx - 30, cy + 16); g.lineTo(cx + 26, cy - 16); g.stroke(); g.strokeStyle = '#ff3a2a'; g.beginPath(); g.moveTo(cx + 30, cy - 24); g.lineTo(cx + 30, cy + 24); g.stroke(); }
};
