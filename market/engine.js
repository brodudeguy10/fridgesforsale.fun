/* ============================================================
   FRDX: THE FRIDGE EXCHANGE
   a market simulator that is far more serious than it has any right
   to be. one tick per second. one trading session every 6 minutes:
     PRE 0:00-0:30  RTH 0:30-5:00  AH 5:00-5:45  CLOSED 5:45-6:00
   prices: geometric brownian motion with regime switching, a market
   factor every ticker carries beta to, poisson jumps, mean reversion
   toward a drifting fundamental, and price impact from your fills.
   the rest: level 2 book that market orders walk, MKT/LMT/STP/STP LMT/
   TRAIL/MOC/LOC, DAY/GTC/IOC/FOK, extended hours LMT only, brackets,
   cash vs margin accounts, T+2 settlement, good faith violations,
   pattern day trader rule, Reg T initial + house maintenance, margin
   calls with forced liquidation, short locates, hard-to-borrow fees,
   Rule 201 SSR, LULD pauses, market-wide circuit breakers, options
   priced with black-scholes on a skewed vol surface, greeks, cash
   settled expiry, dividends, splits, earnings gaps, wash sales, tax
   lots, and breadth (TICK, TRIN, McClellan).
   currency is F. fridges. you deposit them from the counter upstairs.
============================================================ */
(function(root){
'use strict';
const MKT = root.MKT = root.MKT || {};

/* ---------- constants ---------- */
const DAY_LEN = 360, PRE_END = 30, RTH_END = 300, AH_END = 345;
const MULT = 10;                         // option contract multiplier
const RFR = 0.0425;                      // the FED (fridge exchange directorate) rate
const VOL_K = 0.0035;                    // per-tick sigma scale
const ANNUAL = VOL_K*Math.sqrt(DAY_LEN*252);
const PDT_MIN = 25000, PDT_TRADES = 4;
const KEY = 'frdx_state_v1';

const TICKERS = [
  { sym:'FRDG', name:'Standard Refrigeration Holdings Corp.', sector:'Compressors & Motors', p0:42.18, vol:0.32, beta:1.0, divQ:0.31, sh:8.4e6, borrow:0.0025, htb:0, house:0.30, earnOff:1 },
  { sym:'RUST', name:'Rustbelt Appliance Salvage LLC', sector:'Distressed / Special Sits', p0:0.73, vol:1.45, beta:1.3, divQ:0, sh:9.6e7, borrow:0.62, htb:1, house:0.75, earnOff:2 },
  { sym:'MINI', name:'MiniCool Dorm Systems Inc.', sector:'Consumer Discretionary', p0:12.4, vol:0.62, beta:1.25, divQ:0, sh:2.2e7, borrow:0.012, htb:0, house:0.30, earnOff:3 },
  { sym:'CHST', name:'Chest Cold Storage REIT', sector:'Real Estate (Cold Chain)', p0:58.9, vol:0.21, beta:0.6, divQ:0.92, sh:5.1e6, borrow:0.003, htb:0, house:0.30, earnOff:4 },
  { sym:'SXS',  name:'Bilateral Door Technologies plc', sector:'Industrials', p0:87.3, vol:0.34, beta:1.05, divQ:0.22, sh:6.0e6, borrow:0.004, htb:0, house:0.30, earnOff:5 },
  { sym:'RTRO', name:'Frostline Heritage Brands', sector:'Consumer Staples', p0:23.6, vol:0.44, beta:0.85, divQ:0.12, sh:1.4e7, borrow:0.006, htb:0, house:0.30, earnOff:6 },
  { sym:'WINE', name:'Cellar & Cork Thermal Co.', sector:'Luxury Goods', p0:41.0, vol:0.39, beta:0.8, divQ:0.18, sh:9.0e6, borrow:0.005, htb:0, house:0.30, earnOff:7 },
  { sym:'SMRT', name:'SmartCold AI Holdings', sector:'Technology (AI Fridges)', p0:212.5, vol:0.72, beta:1.65, divQ:0, sh:3.3e6, borrow:0.02, htb:0, house:0.40, earnOff:8 },
  { sym:'FRST', name:'Permafrost Energy Partners LP', sector:'Energy (Coolant MLP)', p0:17.2, vol:0.5, beta:0.7, divQ:0.41, sh:1.7e7, borrow:0.01, htb:0, house:0.35, earnOff:9 },
  { sym:'NEON', name:'Neonfridge Hospitality Group', sector:'Leisure & Nightlife', p0:9.1, vol:0.92, beta:1.45, divQ:0, sh:3.8e7, borrow:0.08, htb:0, house:0.40, earnOff:10 },
  { sym:'GOLD', name:'Aurum Refrigeration Trust', sector:'Precious Metals (Physical)', p0:881.0, vol:0.18, beta:-0.25, divQ:0, sh:1.2e6, borrow:0.0035, htb:0, house:0.25, earnOff:11 },
  { sym:'VOID', name:'VOID Cold Systems (f/k/a [REDACTED])', sector:'??', p0:6.66, vol:2.6, beta:0.15, divQ:0, sh:4.2e7, borrow:1.85, htb:1, house:1.0, earnOff:12 },
  { sym:'VNDR', name:'The Vendor, Back Room LLC', sector:'Private (Basement)', p0:36.0, vol:0.9, beta:0.0, divQ:0.36, sh:3.6e6, borrow:0.36, htb:1, house:0.50, earnOff:13 },
  { sym:'FISH', name:'Cold Pond Fisheries ADR', sector:'Agriculture (Aquaculture)', p0:14.2, vol:0.55, beta:0.5, divQ:0.07, sh:1.1e7, borrow:0.015, htb:0, house:0.30, earnOff:14 }
];
const BYSYM = {}; TICKERS.forEach((t,i)=>{ t.i = i; BYSYM[t.sym] = t; });
MKT.TICKERS = TICKERS; MKT.BYSYM = BYSYM;
MKT.CONST = { DAY_LEN, PRE_END, RTH_END, AH_END, MULT, RFR, PDT_MIN };

const REGIMES = {
  BULL:    { mu: 0.00012, vm:0.9, next:{ CHOP:0.002, MELTUP:0.0006, BEAR:0.0006 } },
  CHOP:    { mu: 0.0,     vm:1.0, next:{ BULL:0.0015, BEAR:0.0012 } },
  BEAR:    { mu:-0.00013, vm:1.25, next:{ CHOP:0.0018, CRASH:0.0005, BULL:0.0004 } },
  MELTUP:  { mu: 0.0004,  vm:1.35, next:{ BULL:0.006, CRASH:0.0008 } },
  CRASH:   { mu:-0.0009,  vm:2.2, next:{ BEAR:0.012, CHOP:0.004 } }
};

/* ---------- utils ---------- */
let rs = (Date.now() ^ 0x9e3779b9) >>> 0;
function rnd(){ rs ^= rs << 13; rs >>>= 0; rs ^= rs >>> 17; rs ^= rs << 5; rs >>>= 0; return rs/4294967296; }
function gauss(){ let u = 0, v = 0; while(!u) u = rnd(); while(!v) v = rnd(); return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v); }
function clamp(v,a,b){ return v<a?a:(v>b?b:v); }
function tickSize(p){ return p < 1 ? 0.0001 : 0.01; }
function rp(p){ const ts = tickSize(p); return Math.max(ts, +(Math.round(p/ts)*ts).toFixed(ts < 0.01 ? 4 : 2)); }
function round2(x){ return Math.round(x*100)/100; }
MKT.util = { tickSize, rp, round2 };

/* ---------- state ---------- */
let S = null;
const listeners = [];
MKT.on = (fn)=>listeners.push(fn);
function emit(kind, data){ for(const f of listeners) try{ f(kind, data); }catch(e){} }

function freshTicker(t){
  return { p:t.p0, prevClose:t.p0, open:t.p0, hi:t.p0, lo:t.p0, dvol:0, pv:0, vv:0, F:t.p0, fv:0,
    halted:null, ref:[], ssr:false, ssrDay:-1, dir:0, imp:0, iv:1, candles:[], cur:null, splits:0, lastPx:[t.p0], upVol:0, dnVol:0, earnPending:false, shares:t.sh };
}
function fresh(){
  const tk = {}; TICKERS.forEach(t=>tk[t.sym] = freshTicker(t));
  return {
    v:1, day:1, sessT:20, lastSave:Date.now(), regime:'CHOP', seq:1,
    tk, idx:{ p:1000, prevClose:1000, candles:[], cur:null }, mwcb:-1,
    breadth:{ adLine:0, ema19:0, ema39:0, pcr:0.85 },
    acct:{ type:'cash', cash:0, unsettled:[], pos:{}, opts:{}, orders:[], fills:[], realized:0, realizedST:0, realizedLT:0,
      washDisallowed:0, washPending:{}, dayTrades:[], pdt:false, restrictedUntil:0, gfv:0, gfvUntil:0, marginCall:null, liquidate:false,
      optLevel:0, lotMethod:'FIFO', interest:0, fees:0, divs:0, borrowFees:0, ach:[], eqHist:[], startEq:0, dayStartEq:0, rsu:0, appliedLevelDay:-99 },
    news:[]
  };
}
function save(){
  if(!S) return;
  try{
    const copy = JSON.parse(JSON.stringify(S));
    for(const k in copy.tk){ copy.tk[k].candles = copy.tk[k].candles.slice(-150); copy.tk[k].ref = []; copy.tk[k].lastPx = copy.tk[k].lastPx.slice(-20); }
    copy.idx.candles = copy.idx.candles.slice(-150);
    copy.acct.fills = copy.acct.fills.slice(-200);
    copy.news = copy.news.slice(-60);
    copy.lastSave = Date.now();
    localStorage.setItem(KEY, JSON.stringify(copy));
  }catch(e){}
}
function load(){
  let s = null;
  try{ const r = localStorage.getItem(KEY); if(r) s = JSON.parse(r); }catch(e){}
  if(!s || s.v !== 1) s = fresh();
  TICKERS.forEach(t=>{ if(!s.tk[t.sym]) s.tk[t.sym] = freshTicker(t); });
  return s;
}
MKT.save = save;
MKT.reset = function(){ S = fresh(); save(); emit('reset'); return 'reset'; };
MKT.state = ()=>S;

/* ---------- clock ---------- */
function sessionName(t){ t = t === undefined ? S.sessT : t; return t < PRE_END ? 'PRE' : (t < RTH_END ? 'RTH' : (t < AH_END ? 'AH' : 'CLOSED')); }
MKT.session = function(){
  const t = S.sessT, n = sessionName(t);
  const end = n === 'PRE' ? PRE_END : n === 'RTH' ? RTH_END : n === 'AH' ? AH_END : DAY_LEN;
  const dow = ['MON','TUE','WED','THU','FRI'][(S.day-1) % 5];
  return { name:n, t, left:end - t, day:S.day, dow, expiryDay: isExpiryDay(S.day) };
};
function isExpiryDay(d){ return (d-1) % 5 === 4; }
function nextExpiry(d, incToday){ for(let k=incToday?0:1; k<10; k++) if(isExpiryDay(d+k)) return d+k; return d+5; }

/* ---------- quotes + book ---------- */
function spreadOf(sym){
  const t = BYSYM[sym], k = S.tk[sym], n = sessionName();
  let s = k.p*(0.0006 + 0.0009*t.vol)*(n === 'RTH' ? 1 : 4)*(k.halted ? 3 : 1);
  return Math.max(tickSize(k.p)*(k.p < 1 ? 4 : 1), s);
}
MKT.quote = function(sym){
  const k = S.tk[sym], sp = spreadOf(sym);
  const bid = rp(k.p - sp/2), ask = Math.max(rp(k.p + sp/2), bid + tickSize(k.p));
  return { sym, last:k.p, bid, ask, mid:(bid+ask)/2, prevClose:k.prevClose, chg:k.p - k.prevClose, pct:(k.p/k.prevClose - 1)*100,
    open:k.open, hi:k.hi, lo:k.lo, vol:k.dvol, vwap: k.vv ? k.pv/k.vv : k.p, halted:k.halted, ssr:k.ssr, iv: ivOf(sym), dir:k.dir };
};
/* depth: thinner for volatile names, much thinner outside regular hours */
function depthUnit(sym){
  const t = BYSYM[sym], k = S.tk[sym];
  return Math.max(1, Math.round(k.shares*0.00003/(1 + t.vol*1.5)*(sessionName() === 'RTH' ? 1 : 0.25)));
}
const MPIDS = ['CTDL','VIRT','JNST','NITE','SUSQ','GSCO','MSCO','UBSS','ARCA','EDGX','BATS','IEXG','FRDX','PHLX','NSDQ','HANK'];
function makeBook(sym, levels){
  const q = MKT.quote(sym), ts = tickSize(q.last), du = depthUnit(sym);
  let seed = (S.day*1000 + S.sessT)*31 + BYSYM[sym].i*7;
  const r = ()=>{ seed = (seed*1103515245 + 12345) & 0x7fffffff; return seed/0x7fffffff; };
  const step = Math.max(ts, rp(spreadOf(sym)*0.6));
  const bids = [], asks = [];
  for(let i=0;i<levels;i++){
    bids.push({ px: rp(q.bid - i*step), sz: Math.max(1, Math.round(du*(0.3 + r()*1.4)*(1 + i*0.35))), mm: MPIDS[(r()*MPIDS.length)|0] });
    asks.push({ px: rp(q.ask + i*step), sz: Math.max(1, Math.round(du*(0.3 + r()*1.4)*(1 + i*0.35))), mm: MPIDS[(r()*MPIDS.length)|0] });
  }
  /* your resting limit orders show on the book */
  S.acct.orders.forEach(o=>{
    if(o.sym !== sym || o.status !== 'OPEN' || o.type !== 'LMT' || o.opt) return;
    const side = (o.side === 'BUY' || o.side === 'COVER') ? bids : asks;
    side.push({ px:o.lmt, sz:o.qty - o.filled, mm:'YOU', mine:1 });
  });
  bids.sort((a,b)=>b.px-a.px); asks.sort((a,b)=>a.px-b.px);
  return { bids, asks, step };
}
MKT.book = (sym, levels)=>makeBook(sym, levels || 10);

/* ---------- fees ---------- */
function stockFees(side, qty, px){
  const notional = qty*px;
  let f = notional*0.0001;                                  // coolant regulatory fee, both sides
  if(side === 'SELL' || side === 'SHORT'){
    f += Math.max(0.01, notional*0.0000278);                // SEC section 31
    f += Math.min(8.30, Math.max(0.01, qty*0.000166));      // FINRA TAF
  }
  return round2(f);
}
function optFees(qty){ return round2(qty*0.65 + qty*0.0388); }
MKT.fees = { stockFees, optFees };

/* ---------- accounting ---------- */
function pos(sym){ return S.acct.pos[sym] || (S.acct.pos[sym] = { lots:[] }); }
function posQty(sym){ const p = S.acct.pos[sym]; if(!p) return 0; let q = 0; p.lots.forEach(l=>q += l.q); return q; }
MKT.posQty = posQty;
function unsettledSum(){ let s = 0; S.acct.unsettled.forEach(u=>s += u.amt); return s; }
function longMV(){ let v = 0; for(const s in S.acct.pos){ const q = posQty(s); if(q > 0) v += q*S.tk[s].p; } return v; }
function shortMV(){ let v = 0; for(const s in S.acct.pos){ const q = posQty(s); if(q < 0) v += -q*S.tk[s].p; } return v; }
function optMV(){ let v = 0; for(const id in S.acct.opts){ const o = S.acct.opts[id]; v += o.q*optMark(o)*MULT; } return v; }
function equity(){ return S.acct.cash + unsettledSum() + longMV() - shortMV() + optMV(); }
function maintReq(){
  let r = 0, eq = Math.max(1, equity());
  for(const s in S.acct.pos){
    const q = posQty(s), p = S.tk[s].p, t = BYSYM[s];
    if(q > 0){
      let pct = Math.max(0.25, t.house);
      if(q*p > 0.6*eq) pct = Math.max(pct, 0.5);           // concentration
      r += q*p*pct;
    } else if(q < 0){
      const aq = -q;
      if(p < 5) r += Math.max(2.5*aq, aq*p);                // under 5: greater of 2.50/share or 100%
      else r += aq*p*Math.max(0.3, t.house);
    }
  }
  for(const id in S.acct.opts){ const o = S.acct.opts[id]; if(o.q < 0) r += nakedReq(o)*(-o.q); }
  return r;
}
function initReq(){
  let r = 0;
  for(const s in S.acct.pos){ const q = posQty(s), p = S.tk[s].p, t = BYSYM[s]; r += Math.abs(q)*p*Math.max(0.5, t.house); }
  for(const id in S.acct.opts){ const o = S.acct.opts[id]; if(o.q < 0) r += nakedReq(o)*(-o.q); }
  return r;
}
function nakedReq(o){
  const S0 = S.tk[o.sym].p, prem = optMark(o)*MULT;
  const otm = o.type === 'C' ? Math.max(0, o.K - S0) : Math.max(0, S0 - o.K);
  const base = o.type === 'C' ? Math.max(0.2*S0 - otm, 0.1*S0) : Math.max(0.2*S0 - otm, 0.1*o.K);
  return prem + base*MULT;
}
function openOrderHolds(){
  let h = 0;
  S.acct.orders.forEach(o=>{
    if(o.status !== 'OPEN' && o.status !== 'HELD') return;
    if(o.opt){ if(o.side === 'BTO') h += (o.lmt || optQuoteFor(o).ask)*MULT*(o.qty - o.filled); return; }
    if(o.side === 'BUY' || o.side === 'SHORT'){ const px = o.lmt || o.stp || S.tk[o.sym].p; h += px*(o.qty - o.filled)*(o.side === 'SHORT' ? 0.5 : 1); }
  });
  return h;
}
function settledCash(){ return S.acct.cash; }
function buyingPower(){
  const a = S.acct;
  if(a.type === 'cash'){
    const avail = a.gfvUntil > S.day ? settledCash() : settledCash() + unsettledSum();
    return Math.max(0, avail - openOrderHolds());
  }
  const eq = equity();
  let bp = Math.max(0, (eq - initReq())*2);
  if(a.pdt && eq >= PDT_MIN && sessionName() === 'RTH') bp = Math.max(bp, Math.max(0, (a.dayStartEq - maintReq())*4));
  return Math.max(0, bp - openOrderHolds());
}
MKT.account = function(){
  const a = S.acct, eq = equity(), mr = maintReq();
  const pos = [];
  for(const s in a.pos){
    const q = posQty(s); if(!q) continue;
    let cost = 0; a.pos[s].lots.forEach(l=>cost += l.q*(l.px + (l.wash||0)/Math.max(1,Math.abs(l.q))));
    const mv = q*S.tk[s].p;
    pos.push({ sym:s, q, avg: cost/q, mv, upl: mv - cost, dayPL: q*(S.tk[s].p - S.tk[s].prevClose), lots:a.pos[s].lots,
      locked: a.pos[s].lots.filter(l=>l.lock && l.lock > S.day).reduce((x,l)=>x+l.q,0) });
  }
  const opts = [];
  for(const id in a.opts){ const o = a.opts[id]; const m = optMark(o); opts.push(Object.assign({ id, mark:m, mv:o.q*m*MULT, upl:(m - o.avg)*o.q*MULT, greeks:greeks(o.sym, o.type, o.K, o.exp) }, o)); }
  return { type:a.type, cash:a.cash, unsettled:unsettledSum(), unsettledList:a.unsettled, equity:eq, longMV:longMV(), shortMV:shortMV(), optMV:optMV(),
    maint:mr, init:initReq(), excess: eq - mr, bp: buyingPower(), sma: Math.max(0, eq - initReq()),
    dayPL: eq - a.dayStartEq, realized:a.realized, realizedST:a.realizedST, realizedLT:a.realizedLT, wash:a.washDisallowed,
    pdt:a.pdt, restricted:a.restrictedUntil > S.day, restrictedUntil:a.restrictedUntil, gfv:a.gfv, gfvUntil:a.gfvUntil,
    dayTrades5: a.dayTrades.filter(d=>d > S.day - 5).length, marginCall:a.marginCall, optLevel:a.optLevel, lotMethod:a.lotMethod,
    interest:a.interest, fees:a.fees, divs:a.divs, borrowFees:a.borrowFees, ach:a.ach, positions:pos, options:opts,
    orders:a.orders.slice(-60).reverse(), fills:a.fills.slice(-80).reverse(), eqHist:a.eqHist.slice(-60), rsu:a.rsu,
    leverage: eq > 0 ? (longMV() + shortMV())/eq : 0, estTax: Math.max(0, a.realizedST)*0.37 + Math.max(0, a.realizedLT)*0.2 };
};

/* ---------- options: black-scholes on a skewed surface ---------- */
function ncdf(x){ const t = 1/(1 + 0.2316419*Math.abs(x)); const d = 0.3989423*Math.exp(-x*x/2); let p = d*t*(0.3193815 + t*(-0.3565638 + t*(1.781478 + t*(-1.821256 + t*1.330274)))); return x > 0 ? 1 - p : p; }
function npdf(x){ return Math.exp(-x*x/2)/Math.sqrt(2*Math.PI); }
function ivOf(sym, K, exp){
  const t = BYSYM[sym], k = S.tk[sym];
  let base = t.vol*ANNUAL*REGIMES[S.regime].vm*k.iv;
  if(k.earnPending) base *= 1.35;
  if(K === undefined) return base;
  const m = Math.log(K/k.p);
  const skew = t.sym === 'VOID' ? 1 + 1.6*m*m + 0.4*m : 1 + 0.9*m*m - 0.35*m;
  const days = Math.max(0.2, exp - S.day + (RTH_END - S.sessT)/DAY_LEN);
  const term = 1 + 0.25/Math.sqrt(days);
  return Math.max(0.05, base*skew*term);
}
function yearsTo(exp){ return Math.max(1/(252*DAY_LEN), ((exp - S.day)*DAY_LEN + (RTH_END - S.sessT))/(DAY_LEN*252)); }
function bs(type, S0, K, T, r, q, v){
  const sq = Math.sqrt(T), d1 = (Math.log(S0/K) + (r - q + v*v/2)*T)/(v*sq), d2 = d1 - v*sq;
  if(type === 'C') return S0*Math.exp(-q*T)*ncdf(d1) - K*Math.exp(-r*T)*ncdf(d2);
  return K*Math.exp(-r*T)*ncdf(-d2) - S0*Math.exp(-q*T)*ncdf(-d1);
}
function greeks(sym, type, K, exp){
  const S0 = S.tk[sym].p, T = yearsTo(exp), v = ivOf(sym, K, exp), q = (BYSYM[sym].divQ*4)/Math.max(0.01, S0), r = RFR;
  const sq = Math.sqrt(T), d1 = (Math.log(S0/K) + (r - q + v*v/2)*T)/(v*sq), d2 = d1 - v*sq;
  const price = bs(type, S0, K, T, r, q, v);
  const delta = type === 'C' ? Math.exp(-q*T)*ncdf(d1) : Math.exp(-q*T)*(ncdf(d1) - 1);
  const gamma = Math.exp(-q*T)*npdf(d1)/(S0*v*sq);
  const vega = S0*Math.exp(-q*T)*npdf(d1)*sq/100;
  const thetaY = type === 'C'
    ? -S0*npdf(d1)*v*Math.exp(-q*T)/(2*sq) - r*K*Math.exp(-r*T)*ncdf(d2) + q*S0*Math.exp(-q*T)*ncdf(d1)
    : -S0*npdf(d1)*v*Math.exp(-q*T)/(2*sq) + r*K*Math.exp(-r*T)*ncdf(-d2) - q*S0*Math.exp(-q*T)*ncdf(-d1);
  const rho = type === 'C' ? K*T*Math.exp(-r*T)*ncdf(d2)/100 : -K*T*Math.exp(-r*T)*ncdf(-d2)/100;
  return { price:Math.max(0.01, price), iv:v, delta, gamma, theta: thetaY/252, vega, rho, T };
}
function optQuote(sym, type, K, exp){
  const g = greeks(sym, type, K, exp);
  const m = Math.abs(Math.log(K/S.tk[sym].p));
  const half = Math.max(0.01, g.price*(0.025 + 0.12*m)*(sessionName() === 'RTH' ? 1 : 2.5));
  return { bid: Math.max(0, round2(g.price - half)), ask: round2(g.price + half), mark: g.price, g };
}
function optQuoteFor(o){ return optQuote(o.sym, o.type, o.K, o.exp); }
function optMark(o){ if(o.exp < S.day) return 0; return greeks(o.sym, o.type, o.K, o.exp).price; }
function strikeStep(p){ return p < 5 ? 0.5 : p < 25 ? 1 : p < 100 ? 2.5 : p < 500 ? 5 : 25; }
MKT.chain = function(sym){
  const p = S.tk[sym].p, st = strikeStep(p), atm = Math.round(p/st)*st;
  const e1 = nextExpiry(S.day, S.sessT < RTH_END), e2 = nextExpiry(e1);
  const exps = [e1, e2];
  const rows = [];
  for(let i=-7;i<=7;i++){
    const K = round2(atm + i*st); if(K <= 0) continue;
    rows.push({ K, c:exps.map(e=>optQuote(sym, 'C', K, e)), p:exps.map(e=>optQuote(sym, 'P', K, e)) });
  }
  return { sym, exps, rows, atm, step:st };
};
MKT.optQuote = optQuote;
MKT.greeks = greeks;

/* ---------- order entry ---------- */
function reject(o, msg){ o.status = 'REJ'; o.reason = msg; S.acct.orders.push(o); emit('order', o); return { ok:false, msg, id:o.id }; }
MKT.place = function(spec){
  const a = S.acct, ses = sessionName();
  const o = Object.assign({ id:S.seq++, filled:0, status:'OPEN', created:{ day:S.day, t:S.sessT }, fills:[] }, spec);
  o.qty = Math.floor(+o.qty || 0);
  if(!BYSYM[o.sym]) return reject(o, 'UNKNOWN SYMBOL');
  if(o.qty <= 0) return reject(o, 'QTY MUST BE A POSITIVE WHOLE NUMBER');
  if(o.sym === 'VOID' && !o.attest) return reject(o, 'VOID REQUIRES A SIGNED HIGH-RISK SECURITY ATTESTATION');
  if(o.sym === 'VNDR' && !vendorMet()) return reject(o, 'H10: TRADING SUSPENDED PENDING DISCLOSURE (BASEMENT)');
  if(o.opt) return placeOption(o);
  const q = posQty(o.sym), tk = S.tk[o.sym], qt = MKT.quote(o.sym);
  if(['MKT','LMT','STP','STPLMT','TRAIL','MOC','LOC'].indexOf(o.type) < 0) return reject(o, 'BAD ORDER TYPE');
  if(['DAY','GTC','IOC','FOK'].indexOf(o.tif) < 0) return reject(o, 'BAD TIME IN FORCE');
  if((o.type === 'LMT' || o.type === 'STPLMT' || o.type === 'LOC') && !(o.lmt > 0)) return reject(o, 'LIMIT PRICE REQUIRED');
  if((o.type === 'STP' || o.type === 'STPLMT') && !(o.stp > 0)) return reject(o, 'STOP PRICE REQUIRED');
  if(o.type === 'TRAIL' && !(o.trailAmt > 0 || o.trailPct > 0)) return reject(o, 'TRAIL AMOUNT OR % REQUIRED');
  if(o.lmt) o.lmt = rp(o.lmt); if(o.stp) o.stp = rp(o.stp);
  if(o.ext && o.type !== 'LMT') return reject(o, 'EXTENDED HOURS: LMT ORDERS ONLY');
  if(o.ext && o.tif !== 'DAY' && o.tif !== 'GTC') return reject(o, 'EXTENDED HOURS: DAY OR GTC ONLY');
  if((o.tif === 'IOC' || o.tif === 'FOK') && ses !== 'RTH' && !o.ext) return reject(o, o.tif + ' ONLY DURING REGULAR HOURS');
  if((o.type === 'MOC' || o.type === 'LOC') && (ses !== 'RTH' || S.sessT > RTH_END - 15)) return reject(o, 'MOC/LOC CUTOFF IS 15s BEFORE THE CLOSE');
  if(o.side === 'SELL' && q - lockedQty(o.sym) < o.qty + pendingQty(o.sym, 'SELL')) return reject(o, q > 0 ? 'SELL QTY EXCEEDS AVAILABLE LONG (CHECK RSU LOCKUP / OPEN ORDERS)' : 'NO LONG POSITION. USE SHORT');
  if(o.side === 'COVER' && -q < o.qty + pendingQty(o.sym, 'COVER')) return reject(o, 'COVER QTY EXCEEDS SHORT POSITION');
  if(o.side === 'BUY' && q < 0) return reject(o, 'YOU ARE SHORT. USE COVER');
  if(o.side === 'SHORT'){
    if(a.type !== 'margin') return reject(o, 'SHORT SALES REQUIRE A MARGIN ACCOUNT');
    if(q > 0) return reject(o, 'CLOSE THE LONG BEFORE SHORTING (NO BOX POSITIONS)');
    if(tk.ssr && !(o.type === 'LMT' && o.lmt > qt.bid)) return reject(o, 'RULE 201 SSR IN EFFECT: SHORT ONLY ON A LIMIT ABOVE THE NBB (' + qt.bid + ')');
    if(BYSYM[o.sym].htb){
      const fee = round2(o.qty*qt.last*(0.005 + BYSYM[o.sym].borrow*0.01));
      if(a.cash + unsettledSum() < fee) return reject(o, 'INSUFFICIENT FUNDS FOR HTB LOCATE FEE (' + fee + 'F)');
      a.cash -= fee; a.borrowFees += fee; o.locateFee = fee;
    }
  }
  const opening = o.side === 'BUY' || o.side === 'SHORT';
  if(opening && a.restrictedUntil > S.day) return reject(o, 'ACCOUNT RESTRICTED (PDT EQUITY CALL): CLOSING TRANSACTIONS ONLY UNTIL DAY ' + a.restrictedUntil);
  if(opening && a.marginCall) return reject(o, 'OUTSTANDING MARGIN CALL (' + round2(a.marginCall.amt) + 'F): CLOSING TRANSACTIONS ONLY');
  if(opening){
    const px = o.lmt || o.stp || (o.side === 'BUY' ? qt.ask : qt.bid);
    const need = o.qty*px*(a.type === 'margin' ? Math.max(0.5, BYSYM[o.sym].house) : 1);
    const bp = a.type === 'margin' ? buyingPower()/2 : buyingPower();
    if(need > bp + 1e-6) return reject(o, 'INSUFFICIENT BUYING POWER (NEED ' + round2(need) + 'F, HAVE ' + round2(bp) + 'F)');
  }
  if(o.type === 'TRAIL') o.hwm = o.side === 'SELL' || o.side === 'SHORT' ? tk.p : tk.p;
  if(tk.halted && (o.type === 'MKT')) { o.status = 'HELD'; o.reason = 'HALTED: QUEUED FOR REOPENING AUCTION'; }
  else if(o.type === 'MKT' && ses !== 'RTH'){ o.status = 'HELD'; o.reason = 'QUEUED FOR THE OPEN'; }
  a.orders.push(o);
  if(o.bracket && (o.bracket.tp || o.bracket.sl)) o.bracketPending = true;
  if(o.status === 'OPEN') work(o, true);
  if(o.status === 'OPEN' && (o.tif === 'IOC' || o.tif === 'FOK')){ o.status = o.filled ? 'PART-CXL' : 'CXL'; o.reason = o.tif + ' REMAINDER CANCELED'; }
  emit('order', o);
  return { ok:true, id:o.id, status:o.status, msg:o.reason || '' };
};
function lockedQty(sym){ const p = S.acct.pos[sym]; if(!p) return 0; return p.lots.filter(l=>l.lock && l.lock > S.day && l.q > 0).reduce((x,l)=>x+l.q, 0); }
function pendingQty(sym, side){ return S.acct.orders.filter(o=>o.sym === sym && o.side === side && !o.opt && (o.status === 'OPEN' || o.status === 'HELD')).reduce((x,o)=>x + o.qty - o.filled, 0); }
MKT.cancel = function(id){
  const o = S.acct.orders.find(x=>x.id === id);
  if(!o || (o.status !== 'OPEN' && o.status !== 'HELD' && o.status !== 'TRIG')) return false;
  o.status = o.filled ? 'PART-CXL' : 'CXL'; o.reason = 'CANCELED BY USER';
  if(o.ocoWith){ const p = S.acct.orders.find(x=>x.id === o.ocoWith); if(p && p.status === 'OPEN'){ p.status = 'CXL'; p.reason = 'OCO SIBLING CANCELED'; } }
  emit('order', o); return true;
};
MKT.cancelAll = function(){ S.acct.orders.forEach(o=>{ if(o.status === 'OPEN' || o.status === 'HELD') MKT.cancel(o.id); }); };

/* ---------- matching ---------- */
function marketable(o, qt){
  const buy = o.side === 'BUY' || o.side === 'COVER';
  switch(o.type){
    case 'MKT': return true;
    case 'LMT': return buy ? o.lmt >= qt.ask : o.lmt <= qt.bid;
    default: return false;
  }
}
/* walk the book. returns filled qty. */
function sweep(o, maxQty, limit){
  const sym = o.sym, bk = makeBook(sym, 14), buy = o.side === 'BUY' || o.side === 'COVER';
  const levels = (buy ? bk.asks : bk.bids).filter(l=>!l.mine);
  let need = maxQty, notional = 0, got = 0;
  for(const l of levels){
    if(need <= 0) break;
    if(limit !== undefined && (buy ? l.px > limit : l.px < limit)) break;
    const take = Math.min(need, l.sz);
    notional += take*l.px; got += take; need -= take;
  }
  /* an empty book doesn't stop a market order: it slips */
  if(need > 0 && limit === undefined && o.type === 'MKT'){
    const last = levels.length ? levels[levels.length-1].px : S.tk[sym].p;
    const px = rp(last*(buy ? 1.01 : 0.99));
    notional += need*px; got += need; need = 0;
  }
  if(got <= 0) return 0;
  const avg = notional/got;
  fill(o, got, rp(avg), got > depthUnit(sym)*3 ? 'F' : '@');
  /* you move the market */
  const tk = S.tk[sym], du = depthUnit(sym)*10;
  const push = (buy ? 1 : -1)*Math.min(0.08, (got/du)*0.004*(1 + BYSYM[sym].vol));
  tk.imp += push*0.7; tk.F *= Math.exp(push*0.3);
  return got;
}
function fill(o, qty, px, cond){
  o.filled += qty;
  o.avgFill = ((o.avgFill || 0)*(o.filled - qty) + px*qty)/o.filled;
  o.fills.push({ q:qty, px });
  if(o.filled >= o.qty){ o.status = 'FILLED'; }
  else o.status = 'OPEN';
  applyStockFill(o.sym, o.side, qty, px, o);
  S.acct.fills.push({ id:o.id, sym:o.sym, side:o.side, q:qty, px, day:S.day, t:S.sessT, cond });
  printTape(o.sym, px, qty, 'Y' + cond);
  const tk = S.tk[o.sym]; tk.dvol += qty; tk.pv += px*qty; tk.vv += qty;
  if(o.status === 'FILLED') onFilled(o);
  emit('fill', { o, qty, px });
}
function onFilled(o){
  /* brackets: the take-profit and the stop go live, one cancels the other */
  if(o.bracketPending){
    o.bracketPending = false;
    const exit = (o.side === 'BUY') ? 'SELL' : 'COVER';
    let tp = null, sl = null;
    if(o.bracket.tp) tp = MKT.place({ sym:o.sym, side:exit, type:'LMT', lmt:o.bracket.tp, qty:o.qty, tif:'GTC', parent:o.id, attest:true });
    if(o.bracket.sl) sl = MKT.place({ sym:o.sym, side:exit, type:'STP', stp:o.bracket.sl, qty:o.qty, tif:'GTC', parent:o.id, attest:true });
    if(tp && sl && tp.ok && sl.ok){
      const A = S.acct.orders.find(x=>x.id === tp.id), B = S.acct.orders.find(x=>x.id === sl.id);
      if(A && B){ A.ocoWith = B.id; B.ocoWith = A.id; }
    }
  }
  if(o.ocoWith){ const sib = S.acct.orders.find(x=>x.id === o.ocoWith); if(sib && (sib.status === 'OPEN' || sib.status === 'TRIG')){ sib.status = 'CXL'; sib.reason = 'OCO: SIBLING FILLED'; } }
}
function work(o, isNew){
  if(o.status !== 'OPEN' && o.status !== 'TRIG') return;
  const tk = S.tk[o.sym]; if(tk.halted) return;
  const ses = sessionName();
  if(ses === 'CLOSED') return;
  if(ses !== 'RTH' && !o.ext) return;
  if(o.type === 'MOC' || o.type === 'LOC') return;
  const qt = MKT.quote(o.sym), buy = o.side === 'BUY' || o.side === 'COVER';
  /* stops and trails become live orders when the price trades through */
  if(o.type === 'TRAIL'){
    if(buy){ o.hwm = Math.min(o.hwm, tk.p); o.stp = rp(o.trailAmt ? o.hwm + o.trailAmt : o.hwm*(1 + o.trailPct/100)); }
    else { o.hwm = Math.max(o.hwm, tk.p); o.stp = rp(o.trailAmt ? o.hwm - o.trailAmt : o.hwm*(1 - o.trailPct/100)); }
  }
  if((o.type === 'STP' || o.type === 'STPLMT' || o.type === 'TRAIL') && o.status === 'OPEN'){
    const hit = buy ? tk.p >= o.stp : tk.p <= o.stp;
    if(!hit) return;
    o.status = 'TRIG'; o.trigAt = tk.p;
  }
  const effType = (o.type === 'STP' || o.type === 'TRAIL') ? 'MKT' : (o.type === 'STPLMT' ? 'LMT' : o.type);
  const left = o.qty - o.filled;
  if(effType === 'MKT'){
    if(o.tif === 'FOK'){
      const bk = makeBook(o.sym, 14), lv = (buy ? bk.asks : bk.bids).filter(l=>!l.mine);
      const avail = lv.reduce((x,l)=>x + l.sz, 0);
      if(avail < left){ o.status = 'CXL'; o.reason = 'FOK: INSUFFICIENT LIQUIDITY'; return; }
    }
    sweep(o, left);
  } else if(effType === 'LMT'){
    if(!marketable({ type:'LMT', side:o.side, lmt:o.lmt }, qt)){
      /* resting: occasionally a passive fill when the price leans on you */
      if(!isNew){
        const touch = buy ? tk.p <= o.lmt : tk.p >= o.lmt;
        if(touch && rnd() < 0.5){
          const q = Math.min(left, Math.max(1, Math.round(depthUnit(o.sym)*rnd())));
          fill(o, q, o.lmt, '@');
        }
      }
      if(o.tif === 'FOK' && isNew){ o.status = 'CXL'; o.reason = 'FOK: NOT MARKETABLE'; }
      return;
    }
    if(o.tif === 'FOK'){
      const bk = makeBook(o.sym, 14), lv = (buy ? bk.asks : bk.bids).filter(l=>!l.mine && (buy ? l.px <= o.lmt : l.px >= o.lmt));
      if(lv.reduce((x,l)=>x + l.sz, 0) < left){ o.status = 'CXL'; o.reason = 'FOK: INSUFFICIENT SIZE AT LIMIT'; return; }
    }
    sweep(o, left, o.lmt);
  }
  if(o.status === 'TRIG' && o.filled >= o.qty) o.status = 'FILLED';
}

/* ---------- applying fills to the account ---------- */
function pickLots(lots, sign){
  const own = lots.filter(l=>Math.sign(l.q) === sign);
  const m = S.acct.lotMethod;
  if(m === 'LIFO') own.sort((a,b)=>b.day - a.day || b.seq - a.seq);
  else if(m === 'HIFO') own.sort((a,b)=>sign > 0 ? b.px - a.px : a.px - b.px);
  else own.sort((a,b)=>a.day - b.day || a.seq - b.seq);
  return own;
}
function applyStockFill(sym, side, qty, px, o){
  const a = S.acct, P = pos(sym), fees = stockFees(side, qty, px);
  a.fees += fees;
  if(side === 'BUY' || side === 'SHORT'){
    const sign = side === 'BUY' ? 1 : -1;
    let unpaid = false;
    if(side === 'BUY'){
      const cost = qty*px + fees;
      if(a.type === 'cash' && a.cash < cost){ unpaid = true; }
      a.cash -= cost;
    } else a.cash += qty*px - fees;
    const lot = { q:sign*qty, px, day:S.day, seq:S.seq++, unpaid: unpaid && a.type === 'cash' };
    /* wash sale: a loss taken in the last 3 sessions comes back as basis */
    const w = a.washPending[sym];
    if(w && w.day >= S.day - 3 && sign > 0){ lot.wash = w.amt; a.washDisallowed += w.amt; delete a.washPending[sym]; }
    P.lots.push(lot);
  } else {
    const sign = side === 'SELL' ? 1 : -1;
    let need = qty, realized = 0, dayTrade = false;
    for(const l of pickLots(P.lots, sign)){
      if(need <= 0) break;
      const take = Math.min(need, Math.abs(l.q));
      const basis = l.px + (l.wash ? l.wash/Math.abs(l.q) : 0);
      const pl = sign > 0 ? (px - basis)*take : (basis - px)*take;
      realized += pl;
      if(l.day === S.day) dayTrade = true;
      if(l.unpaid && sign > 0) { a.gfv++; if(a.gfv >= 3) a.gfvUntil = S.day + 9; emit('alert', 'GOOD FAITH VIOLATION #' + a.gfv + ': SOLD ' + sym + ' BOUGHT WITH UNSETTLED FUNDS' + (a.gfv >= 3 ? '. ACCOUNT LIMITED TO SETTLED CASH FOR 9 SESSIONS' : '')); }
      if(l.wash) l.wash -= l.wash*take/Math.abs(l.q);
      l.q -= sign*take; need -= take;
      if(sign > 0 && S.day - l.day >= 30) a.realizedLT += pl; else a.realizedST += pl;
    }
    P.lots = P.lots.filter(l=>l.q !== 0);
    realized -= fees;
    /* a loss with a recent buy is disallowed and rolled into the next lot */
    if(realized < 0 && sign > 0){
      /* replacement shares bought in the window and still held take the loss as basis.
         otherwise it waits 3 sessions for a buy. */
      const repl = P.lots.find(l=>l.q > 0 && l.day >= S.day - 3 && !l.rsu);
      if(repl){ a.washDisallowed += -realized; repl.wash = (repl.wash||0) + -realized; }
      else a.washPending[sym] = { amt:-realized, day:S.day };
    }
    a.realized += realized;
    if(sign > 0){
      if(a.type === 'cash') a.unsettled.push({ amt:qty*px - fees, day:S.day + 2 });
      else a.cash += qty*px - fees;
    } else a.cash -= qty*px + fees;
    if(dayTrade && a.type === 'margin' && o && !o.dtCounted){ o.dtCounted = 1; a.dayTrades.push(S.day); }
  }
}

/* ---------- options orders ---------- */
function placeOption(o){
  const a = S.acct;
  /* o: { opt:true, sym, type:'C'|'P', K, exp, side:'BTO'|'STC'|'STO'|'BTC', qty, otype:'MKT'|'LMT', lmt } */
  if(['BTO','STC','STO','BTC'].indexOf(o.side) < 0) return reject(o, 'BAD OPTION SIDE');
  if(o.exp < S.day || (o.exp === S.day && S.sessT >= RTH_END)) return reject(o, 'CONTRACT EXPIRED');
  if(sessionName() !== 'RTH') return reject(o, 'OPTIONS TRADE REGULAR HOURS ONLY');
  if(S.tk[o.sym].halted) return reject(o, 'UNDERLYING HALTED');
  const key = o.sym + ' ' + o.exp + ' ' + o.K + o.type;
  const held = a.opts[key] ? a.opts[key].q : 0;
  if(o.side === 'BTO' && a.optLevel < 2) return reject(o, 'OPTIONS LEVEL 2 REQUIRED TO BUY TO OPEN (YOU: ' + a.optLevel + ')');
  if(o.side === 'STO'){
    const covered = o.type === 'C' ? Math.floor(Math.max(0, posQty(o.sym) - lockedQty(o.sym))/MULT) >= o.qty : a.cash >= o.K*MULT*o.qty;
    if(covered && a.optLevel < 1) return reject(o, 'OPTIONS LEVEL 1 REQUIRED');
    if(!covered && (a.optLevel < 4 || a.type !== 'margin')) return reject(o, 'NAKED WRITING REQUIRES LEVEL 4 + MARGIN');
  }
  if(o.side === 'STC' && held < o.qty) return reject(o, 'STC EXCEEDS LONG CONTRACTS');
  if(o.side === 'BTC' && -held < o.qty) return reject(o, 'BTC EXCEEDS SHORT CONTRACTS');
  const qt = optQuote(o.sym, o.type, o.K, o.exp);
  const buy = o.side === 'BTO' || o.side === 'BTC';
  const px = buy ? qt.ask : qt.bid;
  if(o.otype === 'LMT' && !(o.lmt > 0)) return reject(o, 'LIMIT PRICE REQUIRED');
  if(buy && (o.otype === 'LMT' ? o.lmt : px)*MULT*o.qty + optFees(o.qty) > (a.type === 'cash' ? a.cash : buyingPower())) return reject(o, 'INSUFFICIENT FUNDS FOR PREMIUM');
  o.key = key; o.type = o.type; o.status = 'OPEN';
  a.orders.push(o);
  workOpt(o);
  emit('order', o);
  return { ok:true, id:o.id, status:o.status };
}
function workOpt(o){
  if(o.status !== 'OPEN') return;
  const qt = optQuote(o.sym, o.type, o.K, o.exp), buy = o.side === 'BTO' || o.side === 'BTC';
  const px = buy ? qt.ask : qt.bid;
  if(o.otype === 'LMT' && (buy ? o.lmt < px : o.lmt > px)) return;
  const a = S.acct, qty = o.qty - o.filled, fees = optFees(qty);
  o.filled = o.qty; o.status = 'FILLED'; o.avgFill = px;
  let p = a.opts[o.key];
  if(!p) p = a.opts[o.key] = { sym:o.sym, type:o.type, K:o.K, exp:o.exp, q:0, avg:0 };
  const sgn = buy ? 1 : -1;
  if(Math.sign(p.q) === sgn || p.q === 0){ p.avg = (p.avg*Math.abs(p.q) + px*qty)/(Math.abs(p.q) + qty); p.q += sgn*qty; }
  else { const close = Math.min(qty, Math.abs(p.q)); a.realized += (sgn < 0 ? (px - p.avg) : (p.avg - px))*close*MULT; a.realizedST += (sgn < 0 ? (px - p.avg) : (p.avg - px))*close*MULT; p.q += sgn*qty; if(p.q === 0) delete a.opts[o.key]; }
  a.cash += (buy ? -1 : 1)*px*MULT*qty - fees; a.fees += fees;
  a.fills.push({ id:o.id, sym:o.key, side:o.side, q:qty, px, day:S.day, t:S.sessT, cond:'O' });
  emit('fill', { o, qty, px });
}

/* ---------- account actions ---------- */
function vendorMet(){ try{ return root.VENDOR && root.VENDOR.loadMem().deaths >= 1; }catch(e){ return false; } }
MKT.vendorMet = vendorMet;
MKT.deposit = function(amt){
  amt = Math.floor(+amt);
  const have = typeof root.fridgesOwned === 'number' ? root.fridgesOwned : (MKT._fridges ? MKT._fridges() : 0);
  if(!(amt > 0)) return { ok:false, msg:'AMOUNT?' };
  if(amt > have) return { ok:false, msg:'YOU ONLY HAVE ' + have + ' FRIDGES UPSTAIRS' };
  MKT._spendFridges(amt);
  /* ACH: instant credit up to 5,000F (10,000F in margin accounts), the rest clears next session */
  const prov = Math.min(S.acct.type === 'margin' ? 10000 : 5000, amt);
  S.acct.cash += prov;
  if(amt - prov > 0) S.acct.ach.push({ amt:amt - prov, day:S.day + 1 });
  emit('acct'); save();
  return { ok:true, msg:'ACH INITIATED: ' + amt + 'F (' + prov + 'F PROVISIONAL, ' + (amt - prov) + 'F CLEARS DAY ' + (S.day + 1) + ')' };
};
MKT.withdraw = function(amt){
  amt = Math.floor(+amt);
  const a = S.acct;
  const free = a.type === 'margin' ? Math.min(a.cash, Math.max(0, equity() - initReq())) : a.cash;
  if(!(amt > 0)) return { ok:false, msg:'AMOUNT?' };
  if(amt > free) return { ok:false, msg:'WITHDRAWABLE CASH (SETTLED, NET OF MARGIN) IS ' + Math.floor(Math.max(0, free)) + 'F' };
  a.cash -= amt; MKT._giveFridges(amt);
  emit('acct'); save();
  return { ok:true, msg:'WITHDREW ' + amt + 'F TO THE COUNTER UPSTAIRS' };
};
MKT.setType = function(type){
  const a = S.acct;
  if(type === a.type) return { ok:false, msg:'ALREADY ' + type.toUpperCase() };
  if(type === 'margin' && equity() < 2000) return { ok:false, msg:'MARGIN REQUIRES 2,000F MINIMUM EQUITY (FINRA 4210)' };
  if(type === 'cash' && (shortMV() > 0 || a.cash < 0)) return { ok:false, msg:'CLOSE SHORTS AND REPAY THE DEBIT BALANCE FIRST' };
  a.type = type; emit('acct'); save();
  return { ok:true, msg:'ACCOUNT TYPE: ' + type.toUpperCase() };
};
MKT.applyOptions = function(level){
  const a = S.acct;
  level = clamp(level|0, 0, 4);
  if(a.appliedLevelDay === S.day) return { ok:false, msg:'ONE APPLICATION PER SESSION' };
  a.appliedLevelDay = S.day;
  const exp = a.fills.length, eq = equity();
  const max = exp < 10 ? 1 : (exp < 30 || eq < 2000 ? 2 : (a.type !== 'margin' || eq < 10000 ? 3 : 4));
  if(level > max){ a.optLevel = Math.max(a.optLevel, max); save(); return { ok:false, msg:'APPROVED FOR LEVEL ' + max + ' ONLY. REASON: ' + (exp < 30 ? 'INSUFFICIENT INVESTMENT EXPERIENCE (' + exp + ' FILLS)' : 'NET LIQUIDATION / ACCOUNT TYPE') }; }
  a.optLevel = level; save();
  return { ok:true, msg:'OPTIONS LEVEL ' + level + ' APPROVED' };
};
MKT.setLotMethod = function(m){ if(['FIFO','LIFO','HIFO'].indexOf(m) >= 0){ S.acct.lotMethod = m; save(); } };

/* spawning a variant upstairs vests you one share (locked until T+2) and dilutes the float */
MKT.onSpawn = function(sym){
  if(!S || !S.tk[sym]) return;
  const k = S.tk[sym];
  k.shares += 1; k.F *= (1 - 0.00004); k.imp -= 0.00003;
  if(sym === 'FRDG') return;            // the plain ones don't come with paper
  pos(sym).lots.push({ q:1, px:0, day:S.day, seq:S.seq++, lock:S.day + 2, rsu:1 });
  S.acct.rsu++;
  emit('rsu', sym);
};
/* the fishing pond sells into FISH */
MKT.fishEvent = function(rarityRank, value){
  if(!S) return;
  const k = S.tk.FISH;
  if(rarityRank >= 4){ k.imp += 0.004*rarityRank; news('FISH', rarityRank >= 5 ? 'Cold Pond Fisheries confirms landing of a specimen previously thought extinct; analysts scramble to model' : 'FISH bid as rare catch reported at the pond; supply chain "unprecedented"', 0.02*rarityRank); }
  else k.imp -= 0.0002;
};

/* ---------- news ---------- */
const NEWS = {
  pos:[ '{S} beats on units shipped, raises full-year compressor guidance', 'Activist stake disclosed in {S}; 13D filed, letter demands "colder margins"', '{S} added to FRDX Low-Temp Dividend Aristocrats index', 'Upgrade: {S} to Overweight at Gasket & Gasket, PT raised', '{S} wins exclusive supply deal with a major dorm chain', 'Short interest in {S} hits record as borrow tightens', '{S} announces 2B F buyback authorization' ],
  neg:[ '{S} recalls units over "persistent humming"; NHTSA (National Humming Tolerance Safety Admin) investigating', 'Downgrade: {S} to Sell, "inventory sitting in basements"', '{S} CFO departs effective immediately to "spend time with family freezer"', '{S} misses on gross margin; coolant input costs surge', 'Hindenfrost Research publishes short report on {S}', '{S} delays 10-Q, cites "a fridge in the back room we can\'t account for"', 'SEC (Supervisory Exchange of Coolants) opens informal inquiry into {S}' ],
  macro:[ 'FED holds coolant rate at 4.25%; dot plot hawkish', 'FED surprise 25bp cut; "the compressors need it"', 'CPI (Coolant Price Index) hotter than expected', 'ISM Refrigeration PMI contracts for a third month', 'Nonfarm Fridges +212k vs +180k est', 'FRIX spikes as dealers scramble for downside gamma', 'Breadth deteriorates; McClellan Oscillator rolls over below zero', 'Quad witching volume expected to "freeze the tape"' ]
};
function news(sym, text, impact){
  S.news.push({ day:S.day, t:S.sessT, sym, text, impact });
  if(S.news.length > 80) S.news.shift();
  emit('news', S.news[S.news.length-1]);
}
MKT.pushNews = news;
function randomNews(){
  const r = rnd();
  if(r < 0.2){
    const t = NEWS.macro[(rnd()*NEWS.macro.length)|0];
    const s = (t.indexOf('cut') >= 0 || t.indexOf('+212') >= 0) ? 1 : -1;
    TICKERS.forEach(tk=>{ S.tk[tk.sym].imp += s*0.003*tk.beta; });
    news('MACRO', t, s*0.003);
    return;
  }
  const tk = TICKERS[(rnd()*TICKERS.length)|0];
  if(tk.sym === 'VNDR' && !vendorMet()) return;
  const good = rnd() < 0.5, pool = good ? NEWS.pos : NEWS.neg;
  const mag = (0.01 + rnd()*0.03)*(0.5 + tk.vol);
  const k = S.tk[tk.sym];
  k.imp += (good ? 1 : -1)*mag*0.5; k.F *= Math.exp((good ? 1 : -1)*mag*0.5); k.iv = Math.min(2, k.iv*1.08);
  news(tk.sym, pool[(rnd()*pool.length)|0].replace('{S}', tk.sym), good ? mag : -mag);
}

/* ---------- tape ---------- */
const tape = {};
function printTape(sym, px, q, cond){
  const t = tape[sym] || (tape[sym] = []);
  t.unshift({ px, q, cond, t:S.sessT, day:S.day, up: px >= (t[0] ? t[0].px : px) });
  if(t.length > 60) t.length = 60;
}
MKT.tape = (sym)=>tape[sym] || [];

/* ---------- candles ---------- */
const CANDLE = 10;
function candle(store, p, v){
  if(!store.cur){ store.cur = { t:S.day*DAY_LEN + S.sessT, o:p, h:p, l:p, c:p, v:0 }; }
  const c = store.cur; c.h = Math.max(c.h, p); c.l = Math.min(c.l, p); c.c = p; c.v += v;
  if((S.sessT % CANDLE) === CANDLE - 1){ store.candles.push(c); if(store.candles.length > 400) store.candles.shift(); store.cur = null; }
}

/* ---------- the tick ---------- */
let accum = 0;
function tick(){
  const ses = sessionName();
  const R = REGIMES[S.regime];
  /* regime switching */
  for(const nx in R.next){ if(rnd() < R.next[nx]){ S.regime = nx; break; } }
  const active = ses === 'RTH' ? 1 : (ses === 'CLOSED' ? 0 : 0.45);
  const zm = gauss();
  let up = 0, dn = 0, upV = 0, dnV = 0, tickSum = 0;
  if(active > 0) TICKERS.forEach(t=>{
    const k = S.tk[t.sym];
    if(t.sym === 'VNDR' && !vendorMet()){ if(!k.halted) k.halted = { code:'H10', until:1e12, reason:'TRADING SUSPENDED: BASEMENT DISCLOSURE PENDING' }; return; }
    if(k.halted){
      if(S.day*DAY_LEN + S.sessT >= k.halted.until){ reopen(t.sym); }
      else return;
    }
    const sig = t.vol*VOL_K*REGIMES[S.regime].vm*active*(k.earnPending ? 1.3 : 1);
    const b = clamp(t.beta, -1, 1);
    const eps = b*zm + Math.sqrt(1 - b*b)*gauss();
    let r = REGIMES[S.regime].mu*active*(t.beta) + sig*eps;
    if(rnd() < (t.sym === 'VOID' ? 0.012 : 0.0015)) r += gauss()*t.vol*0.04;
    r += 0.0025*Math.log(k.F/k.p);
    r += k.imp; k.imp *= 0.55;
    if(t.sym === 'GOLD' && S.regime === 'CRASH') r += 0.0006;
    const old = k.p;
    k.p = Math.max(t.sym === 'RUST' || t.sym === 'VOID' ? 0.0001 : 0.01, rp(k.p*Math.exp(r)));
    k.F *= Math.exp(gauss()*sig*0.25 + 0.00004*Math.log((k.anchor || t.p0)/k.F));
    k.iv += (1 - k.iv)*0.002;
    k.dir = k.p > old ? 1 : (k.p < old ? -1 : k.dir);
    k.hi = Math.max(k.hi, k.p); k.lo = Math.min(k.lo, k.p);
    const v = Math.max(0, Math.round(depthUnit(t.sym)*(0.2 + rnd()*0.9)*(1 + Math.abs(r)*60)*active));
    k.dvol += v; k.pv += k.p*v; k.vv += v;
    if(k.p > old){ upV += v; tickSum++; } else if(k.p < old){ dnV += v; tickSum--; }
    if(k.p > k.prevClose) up++; else if(k.p < k.prevClose) dn++;
    candle(k, k.p, v);
    /* prints for the tape */
    if(v > 0 && rnd() < 0.8){ const n = 1 + ((rnd()*3)|0); for(let i=0;i<n;i++){ const q = Math.max(1, Math.round(v/n*(0.5 + rnd()))); printTape(t.sym, rp(k.p + (rnd()-0.5)*spreadOf(t.sym)), q, ses === 'RTH' ? (q < 10 ? 'I' : (rnd() < 0.12 ? 'D' : (q > depthUnit(t.sym)*2 ? 'F' : '@'))) : 'T'); } }
    /* LULD: a 30 tick reference, bands by price and volatility */
    k.ref.push(k.p); if(k.ref.length > 30) k.ref.shift();
    const ref = k.ref.reduce((a,b)=>a+b,0)/k.ref.length;
    const band = k.p < 3 ? 0.2 : (t.vol > 1 ? 0.15 : 0.1);
    if(ses === 'RTH' && k.ref.length >= 10 && Math.abs(k.p/ref - 1) > band){
      k.halted = { code:'LUDP', until:S.day*DAY_LEN + S.sessT + 15, reason:'LIMIT UP-LIMIT DOWN TRADING PAUSE', dirUp: k.p > ref };
      news(t.sym, t.sym + ' halted: LULD pause (' + (k.p > ref ? 'limit up' : 'limit down') + ')', 0);
    }
    /* Rule 201 */
    if(!k.ssr && k.p <= k.prevClose*0.9){ k.ssr = true; k.ssrDay = S.day; news(t.sym, t.sym + ': Rule 201 short sale restriction triggered (-10%)', 0); }
  });
  /* index, breadth */
  let cap = 0, cap0 = 0;
  TICKERS.forEach(t=>{ if(t.sym === 'VNDR' && !vendorMet()) return; cap += S.tk[t.sym].p*t.sh; cap0 += t.p0*t.sh; });
  const idx = 1000*cap/cap0;
  S.idx.p = idx; candle(S.idx, idx, 0);
  S.breadth.tick = tickSum*77 + Math.round(gauss()*60);
  S.breadth.adv = up; S.breadth.dec = dn;
  S.breadth.trin = (up && dn && upV && dnV) ? (up/dn)/(upV/dnV) : 1;
  S.breadth.pcr += ((S.regime === 'BEAR' || S.regime === 'CRASH' ? 1.15 : 0.75) - S.breadth.pcr)*0.01 + gauss()*0.005;
  if(ses === 'RTH' && S.mwcb !== S.day && idx <= S.idx.prevClose*0.93){
    S.mwcb = S.day;
    TICKERS.forEach(t=>{ S.tk[t.sym].halted = { code:'M', until:S.day*DAY_LEN + S.sessT + 30, reason:'MARKET-WIDE CIRCUIT BREAKER LEVEL 1 (-7%)' }; });
    news('MACRO', 'Market-wide circuit breaker Level 1 triggered: FRDX -7%. All trading halted.', 0);
  }
  /* orders */
  S.acct.orders.forEach(o=>{ if(o.opt){ if(o.status === 'OPEN') workOpt(o); return; } work(o, false); });
  if(ses === 'RTH' && rnd() < 0.025) randomNews();
  /* session boundaries */
  S.sessT++;
  if(S.sessT === PRE_END) onOpen();
  if(S.sessT === RTH_END) onClose();
  if(S.sessT === AH_END) onAHEnd();
  if(S.sessT >= DAY_LEN){ S.sessT = 0; onNewDay(); }
  accum++;
  if(accum % 5 === 0) save();
  emit('tick');
}
function reopen(sym){
  const k = S.tk[sym];
  const dir = k.halted && k.halted.dirUp !== undefined ? (k.halted.dirUp ? 1 : -1) : 0;
  k.halted = null; k.ref = [];
  k.p = rp(k.p*Math.exp(dir*0.01*rnd() + gauss()*0.005));
  news(sym, sym + ' resumes trading after reopening auction', 0);
  S.acct.orders.forEach(o=>{ if(o.sym === sym && o.status === 'HELD' && sessionName() === 'RTH'){ o.status = 'OPEN'; o.reason = ''; } });
}
function onOpen(){
  const a = S.acct;
  a.dayStartEq = equity();
  TICKERS.forEach(t=>{
    const k = S.tk[t.sym];
    k.open = k.p; k.hi = k.p; k.lo = k.p;
    if(k.earnPending && !(k.halted && k.halted.code === 'H10')){
      const surprise = gauss();
      const gap = surprise*t.vol*0.06;
      k.p = rp(k.p*Math.exp(gap)); k.F *= Math.exp(gap*0.8); k.open = k.p; k.earnPending = false; k.iv = 0.7;
      news(t.sym, t.sym + ' Q' + (((S.day/15)|0)%4 + 1) + ' EPS ' + (surprise > 0 ? 'beat' : 'miss') + ': ' + (surprise*0.12 + 1).toFixed(2) + ' vs 1.00 est. Stock ' + (gap > 0 ? '+' : '') + (gap*100).toFixed(1) + '% at the open. IV crushed.', gap);
    }
  });
  a.orders.forEach(o=>{ if(o.status === 'HELD' && !S.tk[o.sym].halted){ o.status = 'OPEN'; o.reason = ''; } });
  if(a.liquidate){ forcedLiquidation(); a.liquidate = false; }
  emit('session', 'open');
}
function onClose(){
  const a = S.acct;
  /* the closing auction: MOC/LOC fill here */
  a.orders.forEach(o=>{
    if(o.status !== 'OPEN' || (o.type !== 'MOC' && o.type !== 'LOC')) return;
    const p = S.tk[o.sym].p, buy = o.side === 'BUY' || o.side === 'COVER';
    if(o.type === 'LOC' && (buy ? p > o.lmt : p < o.lmt)){ o.status = 'CXL'; o.reason = 'LOC: CLOSE PRICE OUTSIDE LIMIT'; return; }
    fill(o, o.qty - o.filled, p, 'C');
  });
  /* options expiry: cash-settled intrinsic */
  for(const key in a.opts){
    const o = a.opts[key];
    if(o.exp !== S.day) continue;
    const p = S.tk[o.sym].p, intr = Math.max(0, o.type === 'C' ? p - o.K : o.K - p);
    const cash = intr*MULT*o.q;
    a.cash += cash; const pl = (intr - o.avg)*MULT*o.q; a.realized += pl; a.realizedST += pl;
    a.fills.push({ id:0, sym:key, side: intr > 0 ? (o.q > 0 ? 'EXERCISE' : 'ASSIGNED') : 'EXPIRED', q:Math.abs(o.q), px:intr, day:S.day, t:S.sessT, cond:'X' });
    delete a.opts[key];
  }
  /* margin */
  if(a.type === 'margin'){
    const eq = equity(), mr = maintReq();
    if(a.marginCall){
      if(eq >= mr){ a.marginCall = null; emit('alert', 'MARGIN CALL MET'); }
      else if(S.day >= a.marginCall.due){ a.liquidate = true; emit('alert', 'MARGIN CALL NOT MET. POSITIONS WILL BE LIQUIDATED AT THE NEXT OPEN.'); }
    } else if(eq < mr){
      a.marginCall = { amt: mr - eq, day:S.day, due:S.day + 2 };
      emit('alert', 'MAINTENANCE CALL ISSUED: ' + round2(mr - eq) + 'F DUE BY CLOSE OF DAY ' + (S.day + 2));
    }
    /* pattern day trader */
    const dt5 = a.dayTrades.filter(d=>d > S.day - 5).length;
    if(dt5 >= PDT_TRADES && !a.pdt){
      a.pdt = true;
      if(eq < PDT_MIN){ a.restrictedUntil = S.day + 9; emit('alert', 'FLAGGED PATTERN DAY TRADER WITH EQUITY UNDER 25,000F. 90-DAY (9 SESSION) RESTRICTION APPLIED.'); }
      else emit('alert', 'FLAGGED PATTERN DAY TRADER. DAY TRADING BUYING POWER: 4X MAINTENANCE EXCESS.');
    }
    if(a.cash < 0){ const apr = -a.cash < 25000 ? 0.125 : (-a.cash < 100000 ? 0.11 : 0.095); const i = -a.cash*apr/252; a.cash -= i; a.interest += i; }
    for(const s in a.pos){ const q = posQty(s); if(q < 0){ const f = -q*S.tk[s].p*BYSYM[s].borrow/252; a.cash -= f; a.borrowFees += f; } }
  }
  { const b = S.breadth, net = (b.adv||0) - (b.dec||0); b.ema19 += (net - b.ema19)*0.1; b.ema39 += (net - b.ema39)*0.05; }
  a.eqHist.push({ day:S.day, eq:equity() }); if(a.eqHist.length > 120) a.eqHist.shift();
  emit('session', 'close');
}
function onAHEnd(){
  S.acct.orders.forEach(o=>{ if((o.status === 'OPEN' || o.status === 'HELD' || o.status === 'TRIG') && o.tif === 'DAY'){ o.status = o.filled ? 'PART-CXL' : 'EXP'; o.reason = 'DAY ORDER EXPIRED'; } });
}
function onNewDay(){
  const a = S.acct;
  S.day++;
  /* settlement */
  a.unsettled = a.unsettled.filter(u=>{ if(u.day <= S.day){ a.cash += u.amt; return false; } return true; });
  a.ach = a.ach.filter(u=>{ if(u.day <= S.day){ a.cash += u.amt; return false; } return true; });
  for(const s in a.pos) a.pos[s].lots.forEach(l=>{ if(l.unpaid && l.day <= S.day - 2) l.unpaid = false; });
  a.orders = a.orders.filter(o=>o.status === 'OPEN' || o.status === 'HELD' || o.status === 'TRIG' || o.created.day >= S.day - 2);
  TICKERS.forEach(t=>{
    const k = S.tk[t.sym];
    k.prevClose = k.p; k.dvol = 0; k.pv = 0; k.vv = 0; k.upVol = 0; k.dnVol = 0;
    if(k.ssr && S.day > k.ssrDay + 1) k.ssr = false;
    /* dividends every 15 sessions for payers */
    if(t.divQ > 0 && (S.day + t.earnOff) % 15 === 7){
      const q = posQty(t.sym);
      if(q){ const amt = q*t.divQ; a.cash += amt; a.divs += amt; a.fills.push({ id:0, sym:t.sym, side: q > 0 ? 'DIV' : 'DIV OWED', q:Math.abs(q), px:t.divQ, day:S.day, t:0, cond:'$' }); }
      k.p = rp(k.p - t.divQ); k.prevClose = k.p;
      news(t.sym, t.sym + ' goes ex-dividend ' + t.divQ.toFixed(2) + 'F', 0);
    }
    /* earnings tomorrow at the open */
    if((S.day + t.earnOff) % 15 === 0){ k.earnPending = true; news(t.sym, t.sym + ' reports before the bell. Implied move ±' + (t.vol*6*REGIMES[S.regime].vm).toFixed(1) + '%', 0); }
    /* splits */
    if(k.p > 1200) split(t.sym, 4);
    else if(k.p < 0.2 && t.sym === 'RUST') split(t.sym, 0.1);
  });
  S.idx.prevClose = S.idx.p;
  /* the FED meets every 10 sessions */
  if(S.day % 10 === 0) randomNewsMacro();
}
function randomNewsMacro(){ const t = NEWS.macro[(rnd()*2)|0]; news('MACRO', t, 0); }
function split(sym, ratio){
  const k = S.tk[sym];
  k.p = rp(k.p/ratio); k.prevClose = k.p; k.F /= ratio; k.anchor = (k.anchor || BYSYM[sym].p0)/ratio; k.shares *= ratio; k.splits++;
  k.candles.forEach(c=>{ c.o/=ratio; c.h/=ratio; c.l/=ratio; c.c/=ratio; });
  const P = S.acct.pos[sym]; if(P) P.lots.forEach(l=>{ l.q = Math.floor(l.q*ratio); l.px /= ratio; });
  for(const key in S.acct.opts){ const o = S.acct.opts[key]; if(o.sym === sym){ o.K = round2(o.K/ratio); o.q = Math.round(o.q*ratio); o.avg /= ratio; } }
  news(sym, sym + (ratio > 1 ? ' completes ' + ratio + '-for-1 stock split' : ' completes 1-for-' + Math.round(1/ratio) + ' reverse split to maintain listing'), 0);
}
function forcedLiquidation(){
  const a = S.acct;
  MKT.cancelAll();
  const list = [];
  for(const s in a.pos){ const q = posQty(s); if(q) list.push({ s, q, mv:Math.abs(q*S.tk[s].p) }); }
  list.sort((x,y)=>y.mv - x.mv);
  for(const it of list){
    if(equity() >= maintReq()*1.1) break;
    const lockQ = it.q > 0 ? lockedQty(it.s) : 0;
    const q = Math.abs(it.q) - lockQ; if(q <= 0) continue;
    const o = { id:S.seq++, sym:it.s, side: it.q > 0 ? 'SELL' : 'COVER', type:'MKT', qty:q, filled:0, status:'OPEN', tif:'DAY', created:{ day:S.day, t:S.sessT }, fills:[], reason:'FORCED LIQUIDATION (MARGIN CALL NOT MET)' };
    a.orders.push(o); sweep(o, q);
  }
  for(const key in a.opts){ const o = a.opts[key]; if(o.q < 0){ const p = optMark(o); a.cash -= -o.q*p*MULT; delete a.opts[key]; } }
  a.cash -= 25; a.fees += 25;
  a.marginCall = null;
  emit('alert', 'FORCED LIQUIDATION EXECUTED. 25F LIQUIDATION FEE CHARGED.');
}

/* ---------- breadth, indicators ---------- */
MKT.breadth = function(){
  const b = S.breadth;
  const net = (b.adv||0) - (b.dec||0);
  let ivs = 0; TICKERS.forEach(t=>ivs += ivOf(t.sym));
  return { tick:b.tick||0, trin:b.trin||1, adv:b.adv||0, dec:b.dec||0, mcclellan:(b.ema19 - b.ema39)*10, pcr:b.pcr, frix: ivs/TICKERS.length*100, regime:S.regime, idx:S.idx.p, idxPrev:S.idx.prevClose };
};
function ema(arr, n){ const k = 2/(n+1); const out = []; let e = arr[0]; arr.forEach((v,i)=>{ e = i ? v*k + e*(1-k) : v; out.push(e); }); return out; }
function sma(arr, n){ const out = []; let s = 0; arr.forEach((v,i)=>{ s += v; if(i >= n) s -= arr[i-n]; out.push(i >= n-1 ? s/n : null); }); return out; }
MKT.series = function(sym, tf){
  const store = sym === 'FRDX' ? S.idx : S.tk[sym];
  let cs = store.candles.slice();
  if(store.cur) cs.push(store.cur);
  tf = tf || 1;
  if(tf > 1){ const out = []; for(let i=0;i<cs.length;i+=tf){ const g = cs.slice(i, i+tf); out.push({ t:g[0].t, o:g[0].o, h:Math.max.apply(null, g.map(c=>c.h)), l:Math.min.apply(null, g.map(c=>c.l)), c:g[g.length-1].c, v:g.reduce((a,c)=>a+c.v,0) }); } cs = out; }
  const close = cs.map(c=>c.c);
  const s20 = sma(close, 20), e9 = ema(close, 9), e50 = ema(close, 50);
  const bbU = [], bbL = [];
  close.forEach((v,i)=>{ if(i < 19){ bbU.push(null); bbL.push(null); return; } const w = close.slice(i-19, i+1), m = s20[i]; const sd = Math.sqrt(w.reduce((a,x)=>a+(x-m)*(x-m),0)/20); bbU.push(m + 2*sd); bbL.push(m - 2*sd); });
  const rsi = []; let ag = 0, al = 0;
  close.forEach((v,i)=>{ if(!i){ rsi.push(50); return; } const d = v - close[i-1]; const g = Math.max(0,d), l = Math.max(0,-d); ag = (ag*13 + g)/14; al = (al*13 + l)/14; rsi.push(al === 0 ? 100 : 100 - 100/(1 + ag/al)); });
  const e12 = ema(close, 12), e26 = ema(close, 26), macd = close.map((v,i)=>e12[i] - e26[i]), sig = ema(macd, 9), hist = macd.map((v,i)=>v - sig[i]);
  let pv = 0, vv = 0; const vwap = cs.map(c=>{ const tp = (c.h + c.l + c.c)/3; pv += tp*c.v; vv += c.v; return vv ? pv/vv : c.c; });
  const atr = []; cs.forEach((c,i)=>{ const tr = i ? Math.max(c.h - c.l, Math.abs(c.h - cs[i-1].c), Math.abs(c.l - cs[i-1].c)) : c.h - c.l; atr.push(i ? (atr[i-1]*13 + tr)/14 : tr); });
  let obv = 0; const obvA = cs.map((c,i)=>{ if(i){ obv += c.c > cs[i-1].c ? c.v : (c.c < cs[i-1].c ? -c.v : 0); } return obv; });
  return { candles:cs, sma20:s20, ema9:e9, ema50:e50, bbU, bbL, rsi, macd, sig, hist, vwap, atr, obv:obvA };
};
MKT.stats = function(sym){
  const t = BYSYM[sym], k = S.tk[sym];
  const shortInt = t.htb ? 0.18 + t.borrow*0.15 : 0.02 + t.vol*0.03;
  const eps = sym === 'VOID' || sym === 'RUST' ? -0.42 : k.F*0.055;
  return { name:t.name, sector:t.sector, mcap:k.p*k.shares, float:k.shares*0.86, si:shortInt, dtc: shortInt*k.shares*0.86/Math.max(1, depthUnit(sym)*400), borrow:t.borrow, htb:!!t.htb,
    pe: eps > 0 ? k.p/eps : null, eps, divYield: t.divQ*4/k.p, beta:t.beta, house:t.house, iv:ivOf(sym), hv: t.vol*ANNUAL*REGIMES[S.regime].vm, splits:k.splits, earnIn: (15 - ((S.day + t.earnOff) % 15)) % 15, ftd: t.sym === 'VOID' ? Math.round(k.shares*0.004*(1 + rnd())) : 0 };
};

/* ---------- running ---------- */
let timer = 0;
MKT.start = function(hooks){
  if(S) return;
  hooks = hooks || {};
  MKT._spendFridges = hooks.spend || function(){};
  MKT._giveFridges = hooks.give || function(){};
  MKT._fridges = hooks.count || function(){ return 0; };
  S = load();
  /* catch up on time away: up to 10 minutes of ticks, then whole days */
  const away = Math.max(0, (Date.now() - (S.lastSave || Date.now()))/1000);
  const ticks = Math.min(600, Math.floor(away));
  for(let i=0;i<ticks;i++) tick();
  let days = Math.min(20, Math.floor((away - ticks)/DAY_LEN));
  while(days-- > 0){
    TICKERS.forEach(t=>{ const k = S.tk[t.sym]; if(k.halted && k.halted.code !== 'H10') k.halted = null; k.p = rp(Math.max(0.0001, k.p*Math.exp(gauss()*t.vol*VOL_K*Math.sqrt(270)))); });
    S.sessT = PRE_END; onOpen(); S.sessT = RTH_END; onClose(); onAHEnd(); S.sessT = 0; onNewDay();
  }
  if(!S.acct.dayStartEq) S.acct.dayStartEq = equity();
  timer = setInterval(tick, 1000);
  emit('ready');
};
MKT.stop = function(){ clearInterval(timer); timer = 0; save(); };
MKT._tick = tick;           // tests
MKT._equity = equity;
})(typeof window !== 'undefined' ? window : globalThis);
