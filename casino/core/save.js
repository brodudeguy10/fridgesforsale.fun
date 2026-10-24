/* ============================================================
   FRIDGE PALACE: the wallet, the stats, the settings
   chips are their own currency. the cage swaps them for fridges
   from the counter upstairs, one for one, both ways.
   key: fridgepalace_v1
============================================================ */
const KEY = 'fridgepalace_v1';
const DEF = {
  v:1, chips:0, firstVisit:0, visits:0, lastVisit:0,
  member:false, wheelDay:'', podium:false, podiumClaimed:false,
  bannedBJUntil:0, drinks:0, blackouts:0, tipsy:0,
  stats:{ spins:0, hands:0, rouletteSpins:0, pokerHands:0, races:0, wagered:0, won:0, biggest:0, biggestGame:'', jackpots:0, bjs:0, wheelSpins:0, talked:0 },
  jackpot:25000,
  eggs:{},
  /* the heist: story progress, the aftermath, heat mode */
  heist:{ story:0, robbedVisit:0, robbedAt:0, totalStolen:0, runs:0, heat:0, heatAt:0, wantedUntil:0, clementDead:false, vendorKill:false, holes:[], kills:0, civKills:0, bestRun:0, partyDone:false, lastLoot:0, abandoned:0, deaths:0, chandelier:false, crew:{} },
  settings:{ sens:1, vol:0.85, music:0.55, quality:'auto', invertY:false, bob:true },
  log:[]
};
function clone(o){ return JSON.parse(JSON.stringify(o)); }
export class Save {
  constructor(){
    let s = null;
    try{ s = JSON.parse(localStorage.getItem(KEY) || 'null'); }catch(e){}
    this.d = Object.assign(clone(DEF), s || {});
    this.d.stats = Object.assign(clone(DEF.stats), this.d.stats || {});
    this.d.settings = Object.assign(clone(DEF.settings), this.d.settings || {});
    this.d.eggs = this.d.eggs || {};
    this.d.heist = Object.assign(clone(DEF.heist), this.d.heist || {});
    if(!this.d.firstVisit) this.d.firstVisit = Date.now();
    this.listeners = [];
  }
  get settings(){ return this.d.settings; }
  get chips(){ return this.d.chips; }
  write(){ try{ localStorage.setItem(KEY, JSON.stringify(this.d)); }catch(e){} }
  onChange(fn){ this.listeners.push(fn); }
  emit(){ for(const f of this.listeners) try{ f(this.d); }catch(e){} }
  bank(){ return window.FRIDGE_BANK || { count:()=>0, spend:()=>false, give:()=>{} }; }
  fridges(){ try{ return this.bank().count(); }catch(e){ return 0; } }
  canAfford(n){ return this.d.chips >= n; }
  /* every bet goes through here so the stats stay honest */
  bet(n, game){
    n = Math.floor(n);
    if(!(n > 0) || n > this.d.chips) return false;
    this.d.chips -= n; this.d.stats.wagered += n;
    this.write(); this.emit(); return true;
  }
  pay(n, game, note){
    n = Math.floor(n); if(!(n > 0)) return;
    this.d.chips += n; this.d.stats.won += n;
    if(n > this.d.stats.biggest){ this.d.stats.biggest = n; this.d.stats.biggestGame = game || ''; }
    if(note) this.logLine(note);
    this.write(); this.emit();
  }
  refund(n){ n = Math.floor(n); if(n > 0){ this.d.chips += n; this.d.stats.wagered = Math.max(0, this.d.stats.wagered - n); this.write(); this.emit(); } }
  take(n){ n = Math.min(this.d.chips, Math.floor(n)); this.d.chips -= n; this.write(); this.emit(); return n; }
  buyChips(n){
    n = Math.floor(n);
    if(!(n > 0)) return { ok:false, msg:'how many?' };
    if(!this.bank().spend(n)) return { ok:false, msg:'you only have ' + this.fridges().toLocaleString() + ' fridges upstairs' };
    this.d.chips += n; this.write(); this.emit();
    return { ok:true, msg:'+' + n.toLocaleString() + ' chips' };
  }
  cashOut(n){
    n = Math.floor(n);
    if(!(n > 0)) return { ok:false, msg:'how many?' };
    if(n > this.d.chips) return { ok:false, msg:'you only have ' + this.d.chips.toLocaleString() + ' chips' };
    this.d.chips -= n; this.bank().give(n); this.write(); this.emit();
    return { ok:true, msg:n.toLocaleString() + ' fridges sent upstairs' };
  }
  egg(k){ if(this.d.eggs[k]) return false; this.d.eggs[k] = Date.now(); this.write(); return true; }
  logLine(t){ this.d.log.unshift({ t:Date.now(), s:t }); if(this.d.log.length > 40) this.d.log.length = 40; }
  reset(){ this.d = clone(DEF); this.d.firstVisit = Date.now(); this.write(); this.emit(); }
}
