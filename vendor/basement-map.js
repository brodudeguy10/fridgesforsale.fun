/* ============================================================
   THE VENDOR — the basement layout
   one fixed floor plan, so you learn it the way it learned you.
   the tags move every run. it moves every run.
   grid is W x H, index = y*W + x. 0 = open floor.
============================================================ */
(function(){
'use strict';
const V = window.VENDOR;
const B = V.B = V.B || {};

const W = 48, H = 40;

/* wall texture ids */
const T = B.T = {
  concrete:1, brick:2, tile:3, block:4, shelf:5, freezer:6, wood:7, pipe:8,
  door:9, tally:10, paint:11, rack:12,
  m_look:20, m_noise:21, m_seven:22, m_ren:23, m_sauce:24, m_sold:25,
  h_fridge:26, h_behind:27, h_box:28, m_counts:29, m_hank:30, m_quiet:31
};
/* message walls draw over a base wall */
B.msgBase = { 20:4, 21:3, 22:6, 23:4, 24:4, 25:11, 26:8, 27:2, 28:7, 29:4, 30:5, 31:7 };
/* walls that only show their writing while you've had the sauce */
B.hiddenMsg = { 26:true, 27:true, 28:true };

/* floor ids */
const F = B.F = { concrete:1, tile:2, water:3, wood:4, grate:5, polished:6 };
/* ceiling ids */
const C = B.C = { concrete:1, drop:2, pipes:3, frost:4 };

/* zones, for footsteps, ambience and the odd line */
const Z = B.Z = { stair:1, corridor:2, boiler:3, laundry:4, storage:5, crawl:6, flood:7, office:8, hall:9, showroom:10, cold:11 };
B.zoneNames = { 1:'the stairs', 2:'the pipe corridor', 3:'the boiler room', 4:'the laundry', 5:'storage', 6:'the crawlspace', 7:'the wet room', 8:'the office', 9:'the long hall', 10:'the showroom', 11:'the cold room' };

function build(){
  const wall  = new Uint8Array(W*H).fill(T.concrete);
  const floor = new Uint8Array(W*H);
  const ceil  = new Uint8Array(W*H);
  const zone  = new Uint8Array(W*H);
  const idx = (x,y)=>y*W+x;
  const inb = (x,y)=>x>=0&&y>=0&&x<W&&y<H;

  function carve(x0,y0,x1,y1,o){
    for(let y=y0;y<=y1;y++) for(let x=x0;x<=x1;x++){
      if(!inb(x,y)) continue;
      const i=idx(x,y); wall[i]=0; floor[i]=o.f; ceil[i]=o.c||C.concrete; zone[i]=o.z;
    }
    if(o.w){
      for(let y=y0-1;y<=y1+1;y++) for(let x=x0-1;x<=x1+1;x++){
        if(!inb(x,y)) continue;
        const i=idx(x,y);
        if(wall[i]!==0) wall[i]=o.w;
      }
    }
  }
  function setW(x,y,t){ if(inb(x,y)) wall[idx(x,y)] = t; }

  /* ---- rooms ---- */
  carve( 9, 1,12, 4,{f:F.concrete, c:C.concrete, z:Z.stair,    w:T.block});
  carve(13, 2,31, 3,{f:F.concrete, c:C.pipes,    z:Z.corridor, w:T.pipe});
  carve(32, 1,46,12,{f:F.concrete, c:C.pipes,    z:Z.boiler,   w:T.brick});
  carve(35,15,46,21,{f:F.tile,     c:C.drop,     z:Z.laundry,  w:T.tile});
  carve(14, 6,30,21,{f:F.concrete, c:C.concrete, z:Z.storage,  w:T.block});
  carve( 8,23,46,24,{f:F.concrete, c:C.drop,     z:Z.hall,     w:T.concrete});
  carve( 2,17, 7,21,{f:F.water,    c:C.concrete, z:Z.flood,    w:T.block});
  carve( 2,28,11,37,{f:F.wood,     c:C.drop,     z:Z.office,   w:T.wood});
  carve(13,27,31,37,{f:F.polished, c:C.drop,     z:Z.showroom, w:T.paint});
  carve(35,27,46,37,{f:F.grate,    c:C.frost,    z:Z.cold,     w:T.freezer});

  /* ---- crawlspace: one wide, twisting, no lights ---- */
  carve( 2, 3, 8, 3,{f:F.concrete, z:Z.crawl, w:T.block});
  carve( 2, 3, 2,12,{f:F.concrete, z:Z.crawl, w:T.block});
  carve( 2, 7, 5, 7,{f:F.concrete, z:Z.crawl, w:T.block});
  carve( 2,12, 6,12,{f:F.concrete, z:Z.crawl, w:T.block});
  carve( 6,12, 6,16,{f:F.concrete, z:Z.crawl, w:T.block});
  carve( 4, 9, 4,11,{f:F.concrete, z:Z.crawl, w:T.block});

  /* ---- connectors (no wall paint, they just punch through) ---- */
  carve(20, 4,21, 5,{f:F.concrete, c:C.concrete, z:Z.storage});
  carve(31,18,34,18,{f:F.concrete, c:C.concrete, z:Z.storage});
  carve(40,13,41,14,{f:F.tile,     c:C.drop,     z:Z.laundry});
  carve(38,22,38,22,{f:F.tile,     c:C.drop,     z:Z.laundry});
  carve(17,22,18,22,{f:F.concrete, c:C.concrete, z:Z.storage});
  carve(26,22,27,22,{f:F.concrete, c:C.concrete, z:Z.storage});
  carve( 3,22, 7,24,{f:F.water,    c:C.concrete, z:Z.flood});
  carve( 4,25, 5,27,{f:F.concrete, c:C.concrete, z:Z.hall});
  carve(12,33,12,33,{f:F.wood,     c:C.drop,     z:Z.office});
  carve(18,25,19,26,{f:F.polished, c:C.drop,     z:Z.showroom});
  carve(28,25,28,26,{f:F.polished, c:C.drop,     z:Z.showroom});
  carve(32,35,34,35,{f:F.grate,    c:C.frost,    z:Z.cold});
  carve(40,25,41,26,{f:F.grate,    c:C.frost,    z:Z.cold});

  /* ---- fixtures ---- */
  setW(10,0,T.door);
  setW(11,0,T.tally);
  /* boiler room pillars */
  [[35,4],[35,9],[39,4],[39,9],[43,4],[43,9]].forEach(p=>setW(p[0],p[1],T.brick));
  /* storage shelving, aisles two wide, one cross aisle */
  [16,19,22,25,28].forEach(sx=>{ for(let y=8;y<=19;y++){ if(y===13) continue; setW(sx,y,T.shelf); } });
  /* cold room racks */
  for(let y=30;y<=34;y++){ setW(38,y,T.rack); setW(43,y,T.rack); }

  /* ---- writing on the walls ---- */
  setW(24,5,T.m_look);      // storage, north wall
  setW(34,16,T.m_noise);    // laundry west wall
  setW(47,32,T.m_seven);    // cold room east wall
  setW(6,7,T.m_ren);        // crawlspace dead end
  setW(13,10,T.m_sauce);    // storage west wall, by the sauce
  setW(23,26,T.m_sold);     // showroom north wall
  setW(26,1,T.h_fridge);    // corridor ceiling side (sauce only)
  setW(47,6,T.h_behind);    // boiler east wall (sauce only)
  setW(1,31,T.h_box);       // office west wall (sauce only)
  setW(1,19,T.m_counts);    // wet room west wall
  setW(28,12,T.m_hank);     // a shelf end in storage
  setW(8,38,T.m_quiet);     // office south wall, by the mattress

  /* hard edge */
  for(let x=0;x<W;x++){ if(wall[idx(x,0)]===0) wall[idx(x,0)]=T.concrete; if(wall[idx(x,H-1)]===0) wall[idx(x,H-1)]=T.concrete; }
  for(let y=0;y<H;y++){ if(wall[idx(0,y)]===0) wall[idx(0,y)]=T.concrete; if(wall[idx(W-1,y)]===0) wall[idx(W-1,y)]=T.concrete; }

  return { wall, floor, ceil, zone };
}

/* ---- props ----
   s = solid, r = collision radius */
const PROPS = [
  // boiler room
  {t:'boiler',  x:37.5,y:6.5, s:1,r:0.55},
  {t:'heater',  x:45.5,y:11.5,s:1,r:0.35},
  {t:'crate',   x:33.5,y:11.5,s:1,r:0.38},
  {t:'crate',   x:45.4,y:1.6, s:1,r:0.36},
  // laundry
  {t:'washer',  x:36.5,y:15.5,s:1,r:0.4},
  {t:'washer',  x:37.5,y:15.5,s:1,r:0.4},
  {t:'dryer',   x:44.5,y:15.5,s:1,r:0.4},
  {t:'dryer',   x:45.5,y:15.5,s:1,r:0.4},
  {t:'bucket',  x:36.4,y:20.6,s:0,r:0.2},
  {t:'boombox', x:42.5,y:20.6,s:1,r:0.25, use:'tape'},
  // storage
  {t:'boxes',   x:17.5,y:9.5, s:1,r:0.35},
  {t:'crate',   x:21.5,y:16.5,s:1,r:0.36},
  {t:'boxes',   x:27.5,y:11.5,s:1,r:0.35},
  {t:'crate',   x:14.5,y:18.5,s:1,r:0.36},
  {t:'sauce',   x:14.5,y:8.5, s:1,r:0.3, use:'sauce'},
  {t:'boxes',   x:30.4,y:6.6, s:1,r:0.35},
  // office
  {t:'desk',    x:6.5, y:30.5,s:1,r:0.5, use:'radio'},
  {t:'chair',   x:6.5, y:31.6,s:0,r:0.2},
  {t:'cabinet', x:2.5, y:28.5,s:1,r:0.35},
  {t:'mattress',x:9.5, y:36.3,s:0,r:0.2},
  {t:'boxes',   x:10.5,y:28.6,s:1,r:0.35},
  // corridor
  {t:'bucket',  x:24.5,y:2.4, s:0,r:0.2},
  // showroom display fridges
  {t:'display', x:15.5,y:29.5,s:1,r:0.35},{t:'display', x:17.5,y:29.5,s:1,r:0.35},
  {t:'display', x:19.5,y:29.5,s:1,r:0.35},
  {t:'display', x:23.5,y:29.5,s:1,r:0.35},{t:'display', x:25.5,y:29.5,s:1,r:0.35},
  {t:'display', x:27.5,y:29.5,s:1,r:0.35},{t:'display', x:29.5,y:29.5,s:1,r:0.35},
  {t:'display', x:15.5,y:33.5,s:1,r:0.35},{t:'display', x:17.5,y:33.5,s:1,r:0.35},
  {t:'display', x:19.5,y:33.5,s:1,r:0.35},{t:'display', x:21.5,y:33.5,s:1,r:0.35},
  {t:'display', x:23.5,y:33.5,s:1,r:0.35},
  {t:'display', x:27.5,y:33.5,s:1,r:0.35},{t:'display', x:29.5,y:33.5,s:1,r:0.35},
  // cold room
  {t:'hook',    x:36.5,y:28.5,s:0,r:0.1},{t:'hook', x:40.5,y:28.3,s:0,r:0.1},
  {t:'hook',    x:44.5,y:28.6,s:0,r:0.1},{t:'hook', x:36.5,y:36.4,s:0,r:0.1},
  {t:'hook',    x:40.5,y:36.5,s:0,r:0.1},
  {t:'stack',   x:46.4,y:27.6,s:1,r:0.38},{t:'stack', x:35.6,y:37.4,s:1,r:0.38},
  // crawlspace: the E that fell off its door
  {t:'magnet',  x:4.5, y:9.35,s:0,r:0.1, use:'magnet'},
  // wet room
  {t:'crate',   x:2.6, y:21.4,s:1,r:0.36},
  // hall
  {t:'boxes',   x:33.5,y:24.5,s:1,r:0.32}
];

/* places you can hide. f = fridge, l = locker. face = which way the door opens */
const HIDES = [
  {k:'f', x:21.5,y:29.5, fx:0, fy:1},
  {k:'f', x:25.5,y:33.5, fx:0, fy:-1},
  {k:'l', x:46.5,y:20.5, fx:-1,fy:0},
  {k:'l', x:2.5, y:36.5, fx:1, fy:0},
  {k:'f', x:46.5,y:32.5, fx:-1,fy:0}
];

/* where the six can turn up. at least one per room so every
   room matters at some point. */
const SPOTS = [
  [30.5,2.5],[44.5,2.5],[34.5,7.5],[45.5,6.5],
  [46.4,18.5],[36.5,18.5],
  [18.5,10.5],[26.5,18.5],[15.5,20.5],[23.5,7.5],
  [5.5,7.5],[4.5,10.5],[6.5,19.5],[2.5,17.5],
  [10.5,29.5],[3.5,34.5],
  [30.5,36.5],[14.5,27.6],[21.5,36.5],
  [45.5,29.5],[36.5,33.5],[41.5,36.6],
  [45.5,24.5],[9.5,23.5]
];

/* lights. k: bulb (warm), tube (green-white, buzzes), blue (cold room),
   boiler (the pilot, orange), lamp (desk). r = reach in tiles */
const LIGHTS = [
  {k:'bulb',  x:10.5,y:2.5,  r:4.5, i:0.85, keep:1},
  {k:'tube',  x:15.5,y:2.5,  r:5,   i:0.7},
  {k:'tube',  x:22.5,y:3.0,  r:5,   i:0.7},
  {k:'tube',  x:29.5,y:2.5,  r:5,   i:0.65},
  {k:'boiler',x:37.5,y:7.4,  r:5.5, i:0.8, keep:1},
  {k:'bulb',  x:44.5,y:3.5,  r:5,   i:0.7},
  {k:'bulb',  x:34.5,y:11.0, r:4.5, i:0.6},
  {k:'tube',  x:40.5,y:18.5, r:5.5, i:0.7},
  {k:'tube',  x:44.5,y:18.0, r:4.5, i:0.55},
  {k:'bulb',  x:15.5,y:7.5,  r:4.5, i:0.6},
  {k:'bulb',  x:24.0,y:13.5, r:5,   i:0.65},
  {k:'bulb',  x:29.5,y:20.5, r:4.5, i:0.55},
  {k:'bulb',  x:20.5,y:20.5, r:4,   i:0.5},
  {k:'bulb',  x:2.5, y:12.5, r:3,   i:0.35, dying:1},
  {k:'bulb',  x:4.5, y:19.5, r:4,   i:0.5, dying:1},
  {k:'tube',  x:12.5,y:23.5, r:5,   i:0.6},
  {k:'tube',  x:24.5,y:23.5, r:5,   i:0.6},
  {k:'tube',  x:36.5,y:23.5, r:5,   i:0.6},
  {k:'tube',  x:44.5,y:23.5, r:4,   i:0.5},
  {k:'bulb',  x:5.5, y:34.0, r:4.5, i:0.55},
  {k:'lamp',  x:6.6, y:30.1, r:3,   i:0.5, keep:1},
  {k:'tube',  x:17.5,y:31.5, r:5.5, i:0.65},
  {k:'tube',  x:26.5,y:31.5, r:5.5, i:0.65},
  {k:'tube',  x:22.5,y:35.5, r:5,   i:0.55},
  {k:'blue',  x:40.5,y:32.0, r:5.5, i:0.7, keep:1},
  {k:'blue',  x:36.5,y:29.5, r:4,   i:0.5},
  {k:'blue',  x:44.5,y:35.5, r:4,   i:0.5}
];
B.lightColor = {
  bulb:  [1.00,0.72,0.42],
  tube:  [0.70,0.92,0.78],
  blue:  [0.45,0.68,1.10],
  boiler:[1.10,0.50,0.18],
  lamp:  [1.00,0.80,0.50],
  red:   [1.10,0.12,0.08]
};

B.W = W; B.H = H;
B.PROPS = PROPS; B.HIDES = HIDES; B.SPOTS = SPOTS; B.LIGHTS = LIGHTS;
B.START = { x:10.5, y:3.2, ang:-Math.PI/2 };
B.DOOR  = { x:10.5, y:1.1 };          // stand here and use it
B.VEN_START = [[40.5,35.5],[44.5,30.5],[36.5,31.5]];
B.buildMap = build;

})();
