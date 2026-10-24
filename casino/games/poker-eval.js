/* ============================================================
   FRIDGE PALACE: hold'em hand math
   7-card evaluator (bitmasks, no tables), equity by simulation,
   side pots. pure functions, no three.js.
============================================================ */
export const val = id=>{ const i = id % 13; return i === 0 ? 14 : i + 1; };
export const suit = id=>Math.floor(id/13);
const NAMES = ['high card', 'pair', 'two pair', 'three of a kind', 'straight', 'flush', 'full house', 'four of a kind', 'straight flush'];
const RN = { 14:'aces', 13:'kings', 12:'queens', 11:'jacks', 10:'tens', 9:'nines', 8:'eights', 7:'sevens', 6:'sixes', 5:'fives', 4:'fours', 3:'threes', 2:'twos' };
const RN1 = { 14:'ace', 13:'king', 12:'queen', 11:'jack', 10:'ten', 9:'nine', 8:'eight', 7:'seven', 6:'six', 5:'five', 4:'four', 3:'three', 2:'two' };
function pop(x){ let c = 0; while(x){ x &= x - 1; c++; } return c; }
function straightHigh(mask){ if(mask & (1 << 14)) mask |= 2; for(let h=14; h>=5; h--){ if(((mask >> (h - 4)) & 31) === 31) return h; } return 0; }
function topBits(mask, n){ const out = []; for(let v=14; v>=2 && out.length < n; v--) if(mask & (1 << v)) out.push(v); return out; }
const enc = (cat, r)=>{ let s = cat << 20; for(let i=0;i<5;i++) s |= (r[i] || 0) << (16 - i*4); return s; };
export function eval7(ids){
  const cnt = new Array(15).fill(0), sm = [0, 0, 0, 0]; let all = 0;
  for(const id of ids){ const v = val(id), s = suit(id); cnt[v]++; sm[s] |= 1 << v; all |= 1 << v; }
  let flush = 0; for(let s=0;s<4;s++) if(pop(sm[s]) >= 5) flush = sm[s];
  if(flush){ const sf = straightHigh(flush); if(sf) return enc(8, [sf]); }
  const quads = [], trips = [], pairs = [], singles = [];
  for(let v=14; v>=2; v--){ if(cnt[v] === 4) quads.push(v); else if(cnt[v] === 3) trips.push(v); else if(cnt[v] === 2) pairs.push(v); else if(cnt[v] === 1) singles.push(v); }
  if(quads.length){ const k = topBits(all & ~(1 << quads[0]), 1); return enc(7, [quads[0], k[0]]); }
  if(trips.length && (trips.length >= 2 || pairs.length)){ const p = Math.max(trips[1] || 0, pairs[0] || 0); return enc(6, [trips[0], p]); }
  if(flush) return enc(5, topBits(flush, 5));
  const st = straightHigh(all); if(st) return enc(4, [st]);
  if(trips.length){ const k = topBits(all & ~(1 << trips[0]), 2); return enc(3, [trips[0], k[0], k[1]]); }
  if(pairs.length >= 2){ const k = topBits(all & ~(1 << pairs[0]) & ~(1 << pairs[1]), 1); return enc(2, [pairs[0], pairs[1], k[0]]); }
  if(pairs.length){ const k = topBits(all & ~(1 << pairs[0]), 3); return enc(1, [pairs[0], k[0], k[1], k[2]]); }
  return enc(0, topBits(all, 5));
}
export function describe(score){
  const cat = score >> 20, r1 = (score >> 16) & 15, r2 = (score >> 12) & 15;
  if(cat === 8) return r1 === 14 ? 'a royal flush' : 'a straight flush, ' + RN1[r1] + ' high';
  if(cat === 7) return 'four ' + RN[r1];
  if(cat === 6) return RN[r1] + ' full of ' + RN[r2];
  if(cat === 5) return 'a flush, ' + RN1[r1] + ' high';
  if(cat === 4) return 'a straight, ' + RN1[r1] + ' high';
  if(cat === 3) return 'three ' + RN[r1];
  if(cat === 2) return RN[r1] + ' and ' + RN[r2];
  if(cat === 1) return 'a pair of ' + RN[r1];
  return RN1[r1] + ' high';
}
export const category = score=>NAMES[score >> 20];
/* win probability (ties count half) against n random hands */
export function equity(hole, board, nOpp, sims, rnd){
  rnd = rnd || Math.random;
  const used = new Set(hole.concat(board)); const deck = []; for(let i=0;i<52;i++) if(!used.has(i)) deck.push(i);
  let score = 0; const need = 5 - board.length;
  for(let s=0; s<sims; s++){
    /* partial fisher-yates for the cards we need */
    const take = need + nOpp*2;
    for(let i=0;i<take;i++){ const j = i + Math.floor(rnd()*(deck.length - i)); const t = deck[i]; deck[i] = deck[j]; deck[j] = t; }
    const b = board.concat(deck.slice(0, need));
    const me = eval7(hole.concat(b));
    let best = 0, tie = 0;
    for(let o=0;o<nOpp;o++){ const v = eval7([deck[need + o*2], deck[need + o*2 + 1]].concat(b)); if(v > best){ best = v; tie = 0; } if(v === best) tie++; }
    if(me > best) score += 1; else if(me === best) score += 1/(tie + 1);
  }
  return score/sims;
}
/* contributions -> pots. players: [{id, put, folded}] */
export function sidePots(players){
  const levels = [...new Set(players.filter(p=>p.put > 0).map(p=>p.put))].sort((a,b)=>a-b);
  const pots = []; let prev = 0;
  for(const L of levels){
    let amt = 0; players.forEach(p=>{ amt += Math.max(0, Math.min(p.put, L) - prev); });
    const elig = players.filter(p=>!p.folded && p.put >= L).map(p=>p.id);
    if(amt > 0){ if(elig.length) pots.push({ amt, elig }); else if(pots.length) pots[pots.length - 1].amt += amt; }
    prev = L;
  }
  /* merge pots with identical eligibility */
  const out = []; pots.forEach(p=>{ const last = out[out.length - 1]; if(last && last.elig.join() === p.elig.join()) last.amt += p.amt; else out.push(p); });
  return out;
}
