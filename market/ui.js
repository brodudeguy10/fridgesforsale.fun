/* ============================================================
   FRDX TERMINAL: the screen
   everything here reads MKT and writes orders to it. nothing in this
   file decides a price.
============================================================ */
(function(){
'use strict';
if(!window.MKT) return;
const M = window.MKT;
const $ = (s, r)=>(r || document).querySelector(s);
const esc = s=>String(s).replace(/[&<>"]/g, c=>({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' }[c]));

/* ---------- formatting ---------- */
function px(p){ if(p === null || p === undefined || isNaN(p)) return '-'; return Math.abs(p) < 1 ? p.toFixed(4) : p.toFixed(2); }
function n0(x){ return Math.round(x).toLocaleString('en-US'); }
function n2(x){ return (x < 0 ? '-' : '') + Math.abs(x).toLocaleString('en-US', { minimumFractionDigits:2, maximumFractionDigits:2 }); }
function sg(x, f){ f = f || n2; return (x > 0 ? '+' : '') + f(x); }
function pct(x){ return (x > 0 ? '+' : '') + x.toFixed(2) + '%'; }
function cls(x){ return x > 0 ? 'up' : (x < 0 ? 'dn' : ''); }
function big(x){ const a = Math.abs(x); return a >= 1e9 ? (x/1e9).toFixed(2) + 'B' : a >= 1e6 ? (x/1e6).toFixed(2) + 'M' : a >= 1e3 ? (x/1e3).toFixed(1) + 'K' : x.toFixed(0); }
function clock(t){ const m = Math.floor(t/60), s = t % 60; return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0'); }
function ts(day, t){ return 'D' + day + ' ' + clock(t); }

/* ---------- state ---------- */
const st = { sym:'FRDG', tf:1, ov:{ vwap:1, bb:0, e9:1, e50:0 }, sub:'VOL', btab:'pos', mview:'gp', open:false, hover:null, ptr:false,
  chainExp:0, opt:{ type:'C', K:0, exp:0, side:'BTO', qty:1, otype:'LMT', lmt:0 }, alerts:[] };
try{ const s = JSON.parse(localStorage.getItem('frdx_ui_v1') || '{}'); Object.assign(st, { sym:s.sym || st.sym, tf:s.tf || 1, ov:s.ov || st.ov, sub:s.sub || st.sub, btab:s.btab || st.btab, mview:s.mview || st.mview }); }catch(e){}
function saveUI(){ try{ localStorage.setItem('frdx_ui_v1', JSON.stringify({ sym:st.sym, tf:st.tf, ov:st.ov, sub:st.sub, btab:st.btab, mview:st.mview })); }catch(e){} }
const T = { side:'BUY', qty:10, type:'LMT', lmt:'', stp:'', trail:'', trailPct:'', tif:'DAY', ext:false, tp:'', sl:'', attest:false };

/* ---------- build ---------- */
let root = null;
function build(){
  if(root) return;
  root = document.createElement('div');
  root.id = 'frdx';
  root.innerHTML = `
  <div id="fx-top">
    <div>FRDX&lt;GO&gt;</div>
    <div id="fx-idx">FRDX -</div>
    <div id="fx-clk">-</div>
    <div class="grow hm" id="fx-acs">-</div>
    <button id="fx-close" title="back upstairs">X</button>
  </div>
  <div id="fx-alert"></div>
  <div id="fx-strip"></div>
  <div id="fx-tape"><span class="run" id="fx-taperun"></span></div>
  <div id="fx-cmd"><label>&gt;</label><input id="fx-cmdin" autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="FRDG GO   |   BUY 100 FRDG LMT 41.20 GTC   |   HELP"><button class="k" id="fx-cmdgo">GO</button><span id="fx-msg"></span></div>
  <div id="fx-grid">
    <div class="pn" id="fx-wl" data-v="wl"><h3>MONITOR <span class="dm" style="color:#000;opacity:.6">PX/CHG/IV</span></h3><div class="sc" id="fx-wlb"></div></div>
    <div class="pn" id="fx-gp" data-v="gp">
      <h3><span id="fx-gph">GP</span><span class="r" id="fx-tfs"></span></h3>
      <div class="quote" id="fx-quote"></div>
      <div class="ctl" id="fx-ovs"></div>
      <div id="fx-chartwrap"><canvas id="fx-chart"></canvas><div id="fx-ohlc"></div></div>
    </div>
    <div class="pn" id="fx-l2" data-v="l2"><h3>MBO / L2 <span class="r" id="fx-l2sym"></span></h3>
      <div class="nbbo" id="fx-nbbo"></div>
      <div class="books"><div id="fx-bids"></div><div id="fx-asks"></div></div>
      <h3>TAS</h3><div class="sc tas" id="fx-tas"></div></div>
    <div class="pn" id="fx-tkt" data-v="tkt"><h3>ORDER ENTRY <span class="r" id="fx-tksym"></span></h3><div class="sc">
      <div class="sides">
        <button data-side="BUY" class="b">BUY</button><button data-side="SELL" class="s">SELL</button>
        <button data-side="SHORT" class="s">SHORT</button><button data-side="COVER" class="b">COVER</button>
      </div>
      <div class="form">
        <label>QTY</label><input id="tk-qty" type="number" min="1" step="1" inputmode="numeric">
        <label>TYPE</label><select id="tk-type"><option>MKT</option><option selected>LMT</option><option value="STP">STP</option><option value="STPLMT">STP LMT</option><option>TRAIL</option><option>MOC</option><option>LOC</option></select>
        <div class="qtyq"><button data-q="1">1</button><button data-q="10">10</button><button data-q="100">100</button><button data-q="500">500</button><button data-q="pos">POS</button><button data-q="max">MAX</button></div>
        <label>LMT</label><input id="tk-lmt" type="number" step="0.01" inputmode="decimal">
        <label>STP</label><input id="tk-stp" type="number" step="0.01" inputmode="decimal">
        <label>TRAIL F</label><input id="tk-trail" type="number" step="0.01" inputmode="decimal">
        <label>TRAIL %</label><input id="tk-trailp" type="number" step="0.1" inputmode="decimal">
        <label>TIF</label><select id="tk-tif"><option>DAY</option><option>GTC</option><option>IOC</option><option>FOK</option></select>
        <label class="chk"><input type="checkbox" id="tk-ext">EXT</label><span class="dm" style="font-size:9px">PRE/AH (LMT)</span>
        <label>BKT TP</label><input id="tk-tp" type="number" step="0.01" inputmode="decimal" placeholder="lmt">
        <label>BKT SL</label><input id="tk-sl" type="number" step="0.01" inputmode="decimal" placeholder="stp">
        <label class="att" id="tk-attw" style="display:none"><input type="checkbox" id="tk-att"><span>I ATTEST I HAVE READ THE VOID HIGH-RISK SECURITY DISCLOSURE (FORM V-6), UNDERSTAND I MAY LOSE MORE THAN MY ENTIRE INVESTMENT, AND THAT THE ISSUER'S PRIOR NAME IS [REDACTED]</span></label>
      </div>
      <div class="prev" id="tk-prev"></div>
      <div class="go"><button class="k" id="tk-go">TRANSMIT</button><button id="tk-cxl">CXL ALL</button></div>
    </div></div>
    <div class="pn bt" id="fx-pos" data-v="pos"><div class="sc" id="fx-posb"></div></div>
    <div class="pn bt" id="fx-ord" data-v="ord"><div class="sc" id="fx-ordb"></div></div>
    <div class="pn bt" id="fx-fill" data-v="fill"><div class="sc" id="fx-fillb"></div></div>
    <div class="pn bt" id="fx-opt" data-v="opt">
      <div class="octl">
        <span class="yl" id="op-sym"></span>
        <select id="op-exp"></select>
        <span class="dm">|</span>
        <select id="op-side"><option>BTO</option><option>STC</option><option>STO</option><option>BTC</option></select>
        <input id="op-qty" type="number" min="1" value="1" inputmode="numeric" title="contracts">
        <select id="op-ot"><option>LMT</option><option>MKT</option></select>
        <input id="op-lmt" type="number" step="0.01" inputmode="decimal" title="limit">
        <span id="op-ctr" class="am">pick a bid/ask</span>
        <button class="k" id="op-go">SEND</button>
      </div>
      <div class="gsum" id="op-gsum"></div>
      <div class="sc" id="fx-optb"></div>
    </div>
    <div class="pn bt" id="fx-acct" data-v="acct"><div class="sc">
      <div class="cols">
        <div><h4>FUNDING</h4>
          <div class="ctrl">upstairs: <b id="ac-up" class="yl">0</b>F</div>
          <div class="ctrl"><input id="ac-amt" type="number" min="1" inputmode="numeric" placeholder="F"><button class="b" id="ac-dep">DEPOSIT (ACH)</button><button class="s" id="ac-wd">WITHDRAW</button></div>
          <h4>ACCOUNT</h4>
          <div class="ctrl"><button id="ac-cash">CASH</button><button id="ac-margin">MARGIN</button><span class="dm">REG T</span></div>
          <div class="ctrl">OPT LVL <select id="ac-lvl"><option value="1">1 COVERED</option><option value="2">2 LONG</option><option value="3">3 SPREADS</option><option value="4">4 NAKED</option></select><button id="ac-apply">APPLY</button></div>
          <div class="ctrl">TAX LOTS <select id="ac-lots"><option>FIFO</option><option>LIFO</option><option>HIFO</option></select></div>
          <canvas class="spark" id="ac-spark"></canvas>
        </div>
        <div id="ac-bal"></div>
        <div id="ac-flags"></div>
      </div></div></div>
    <div class="pn bt" id="fx-news" data-v="news"><div class="sc" id="fx-newsb"></div></div>
    <div class="pn bt" id="fx-des" data-v="des"><div class="sc" id="fx-desb"></div></div>
    <div class="pn bt" id="fx-help" data-v="help"><div class="sc" id="fx-helpb"></div></div>
  </div>
  <div id="fx-btabs"></div>
  <div id="fx-mnav"></div>
  <div id="fx-toast"></div>`;
  document.body.appendChild(root);
  wire();
}

const BTABS = [['pos','POS'],['ord','BLTR'],['fill','FILLS'],['opt','OMON'],['acct','ACCT'],['news','TOP'],['des','DES'],['help','HELP']];
const MVIEWS = [['wl','MON'],['gp','GP'],['l2','L2'],['tkt','TKT'],['pos','POS'],['ord','BLTR'],['opt','OMON'],['acct','ACCT'],['news','TOP'],['fill','FILLS'],['des','DES'],['help','HELP']];
function mobile(){ return window.innerWidth < 1000; }
function vis(v){
  if(!st.open) return false;
  if(mobile()) return st.mview === v;
  if(v === 'wl' || v === 'gp' || v === 'l2' || v === 'tkt') return true;
  return st.btab === v;
}
function layout(){
  $('#fx-btabs').innerHTML = BTABS.map(([k,l])=>`<button data-bt="${k}" class="${st.btab === k ? 'sel' : ''}">${l}</button>`).join('');
  $('#fx-mnav').innerHTML = MVIEWS.map(([k,l])=>`<button data-mv="${k}" class="${st.mview === k ? 'sel' : ''}">${l}</button>`).join('');
  root.querySelectorAll('.bt').forEach(e=>e.classList.toggle('on', e.dataset.v === st.btab));
  root.querySelectorAll('.pn').forEach(e=>e.classList.toggle('mon', e.dataset.v === st.mview));
}
function go(view){
  if(BTABS.some(b=>b[0] === view)) st.btab = view;
  st.mview = view;
  layout(); saveUI(); renderAll(true);
}

/* ---------- wiring ---------- */
function wire(){
  $('#fx-close').onclick = close;
  root.addEventListener('pointerdown', ()=>{ st.ptr = true; }, true);
  window.addEventListener('pointerup', ()=>{ setTimeout(()=>{ st.ptr = false; }, 30); }, true);
  root.addEventListener('click', e=>{
    const t = e.target.closest('[data-bt],[data-mv],[data-sym],[data-side],[data-q],[data-tf],[data-ov],[data-sub],[data-cxl],[data-flat],[data-oc],[data-go]');
    if(!t) return;
    const d = t.dataset;
    if(d.bt) go(d.bt);
    else if(d.mv) go(d.mv);
    else if(d.sym){ setSym(d.sym); if(mobile() && d.jump) go('gp'); }
    else if(d.side){ T.side = d.side; syncTicket(); }
    else if(d.q){ qtyQuick(d.q); }
    else if(d.tf){ st.tf = +d.tf; saveUI(); renderGP(true); }
    else if(d.ov){ st.ov[d.ov] = st.ov[d.ov] ? 0 : 1; saveUI(); renderGP(true); }
    else if(d.sub){ st.sub = d.sub; saveUI(); renderGP(true); }
    else if(d.cxl){ M.cancel(+d.cxl); renderAll(true); }
    else if(d.flat){ flatten(d.flat); }
    else if(d.oc){ pickContract(d.oc); }
    else if(d.go){ go(d.go); }
  });
  const ci = $('#fx-cmdin');
  ci.addEventListener('keydown', e=>{
    if(e.key === 'Enter'){ e.preventDefault(); runCmd(ci.value); hist.unshift(ci.value); hi = -1; ci.value = ''; }
    else if(e.key === 'ArrowUp'){ e.preventDefault(); if(hi < hist.length - 1){ hi++; ci.value = hist[hi]; } }
    else if(e.key === 'ArrowDown'){ e.preventDefault(); if(hi > 0){ hi--; ci.value = hist[hi]; } else { hi = -1; ci.value = ''; } }
    e.stopPropagation();
  });
  $('#fx-cmdgo').onclick = ()=>{ runCmd(ci.value); hist.unshift(ci.value); ci.value = ''; };
  /* ticket */
  const bind = (id, key, num)=>{ const el = $(id); el.addEventListener('input', ()=>{ T[key] = el.type === 'checkbox' ? el.checked : el.value; renderTicketPreview(); }); el.addEventListener('change', ()=>{ T[key] = el.type === 'checkbox' ? el.checked : el.value; syncTicket(); }); };
  bind('#tk-qty','qty'); bind('#tk-type','type'); bind('#tk-lmt','lmt'); bind('#tk-stp','stp'); bind('#tk-trail','trail'); bind('#tk-trailp','trailPct');
  bind('#tk-tif','tif'); bind('#tk-ext','ext'); bind('#tk-tp','tp'); bind('#tk-sl','sl'); bind('#tk-att','attest');
  $('#tk-go').onclick = transmit;
  $('#tk-cxl').onclick = ()=>{ M.cancelAll(); msg('ALL WORKING ORDERS CANCELED'); renderAll(true); };
  root.querySelectorAll('input,select').forEach(el=>el.addEventListener('keydown', e=>{ e.stopPropagation(); if(e.key === 'Enter' && el.closest('#fx-tkt')) transmit(); }));
  /* options */
  $('#op-exp').onchange = ()=>{ st.chainExp = +$('#op-exp').value; renderOpt(true); };
  $('#op-side').onchange = ()=>{ st.opt.side = $('#op-side').value; };
  $('#op-qty').oninput = ()=>{ st.opt.qty = +$('#op-qty').value; };
  $('#op-ot').onchange = ()=>{ st.opt.otype = $('#op-ot').value; };
  $('#op-lmt').oninput = ()=>{ st.opt.lmt = +$('#op-lmt').value; };
  $('#op-go').onclick = sendOpt;
  /* account */
  $('#ac-dep').onclick = ()=>{ const r = M.deposit($('#ac-amt').value); msg(r.msg, !r.ok); renderAll(true); };
  $('#ac-wd').onclick = ()=>{ const r = M.withdraw($('#ac-amt').value); msg(r.msg, !r.ok); renderAll(true); };
  $('#ac-cash').onclick = ()=>{ const r = M.setType('cash'); msg(r.msg, !r.ok); renderAll(true); };
  $('#ac-margin').onclick = ()=>{ const r = M.setType('margin'); msg(r.msg, !r.ok); renderAll(true); };
  $('#ac-apply').onclick = ()=>{ const r = M.applyOptions(+$('#ac-lvl').value); msg(r.msg, !r.ok); renderAll(true); };
  $('#ac-lots').onchange = ()=>{ M.setLotMethod($('#ac-lots').value); msg('TAX LOT RELIEF: ' + $('#ac-lots').value); };
  $('#fx-alert').onclick = ()=>{ st.alerts.shift(); renderAlert(); };
  /* chart crosshair */
  const cv = $('#fx-chart');
  const mv = e=>{ const r = cv.getBoundingClientRect(); st.hover = { x:e.clientX - r.left, y:e.clientY - r.top }; drawChart(); };
  cv.addEventListener('pointermove', mv); cv.addEventListener('pointerdown', mv);
  cv.addEventListener('pointerleave', ()=>{ st.hover = null; drawChart(); });
  window.addEventListener('resize', ()=>{ if(st.open){ layout(); renderAll(true); } });
  layout();
  $('#fx-tfs').innerHTML = [[1,'10S'],[3,'30S'],[6,'1M'],[18,'3M']].map(([v,l])=>`<button data-tf="${v}">${l}</button>`).join('');
  $('#fx-helpb').innerHTML = HELP;
  syncTicket();
}
let hist = [], hi = -1;

/* ---------- open / close ---------- */
let prevActive = false;
function open(){
  build();
  st.open = true; root.classList.add('on');
  document.documentElement.classList.add('overlay-open');
  try{ prevActive = gameActive; gameActive = true; }catch(e){}
  layout(); setSym(st.sym); renderAll(true);
}
function close(){
  st.open = false; root.classList.remove('on');
  document.documentElement.classList.remove('overlay-open');
  try{ if(!prevActive) gameActive = false; }catch(e){}
  try{ document.activeElement && document.activeElement.blur(); }catch(e){}
}
M.ui = { open, close, go, setSym:s=>setSym(s) };
window.openFridgeMarket = open;

function msg(t, err){ const m = $('#fx-msg'); if(!m) return; m.textContent = t; m.classList.toggle('err', !!err); m.title = t; if(mobile() || err) toast(t, err); }
function toast(t, err){ if(!root) return; const box = $('#fx-toast'); while(box.childElementCount >= 3) box.firstChild.remove(); const d = document.createElement('div'); d.textContent = t; if(err){ d.style.borderColor = '#ff4a4a'; d.style.color = '#ff8080'; } $('#fx-toast').appendChild(d); setTimeout(()=>d.remove(), 4100); }

function setSym(s){
  if(!M.BYSYM[s]) return;
  st.sym = s; saveUI();
  if(!root) return;
  const q = M.quote(s);
  T.lmt = px(T.side === 'SELL' || T.side === 'SHORT' ? q.bid : q.ask).replace(/^-$/, '');
  T.stp = ''; T.trail = ''; T.trailPct = ''; T.tp = ''; T.sl = ''; T.attest = false;
  st.chainExp = 0; st.opt.K = 0;
  syncTicket(); renderAll(true);
}

/* ---------- command line ---------- */
function runCmd(raw){
  const s = raw.trim().toUpperCase().replace(/\s+/g, ' ');
  if(!s) return;
  const w = s.split(' ');
  const fn = { HELP:'help', GLOSS:'help', H:'help', DES:'des', GP:'gp', G:'gp', OMON:'opt', OPT:'opt', MBO:'l2', L2:'l2', TAS:'l2', PORT:'pos', POS:'pos', BLTR:'ord', ORD:'ord', FILLS:'fill', TOP:'news', N:'news', ACCT:'acct', MON:'wl', TKT:'tkt' };
  try{
    if(M.BYSYM[w[0]] && (w.length === 1 || w[1] === 'GO' || w[1] === 'EQUITY' || w[1] === '<EQUITY>')){ setSym(w[0]); msg(w[0] + ' ' + M.BYSYM[w[0]].name.toUpperCase()); if(w[2] && fn[w[2]]) go(fn[w[2]]); return; }
    if(M.BYSYM[w[0]] && fn[w[1]]){ setSym(w[0]); go(fn[w[1]]); return; }
    if(w[0] === 'ACCT' && w[1]){ const r = M.setType(w[1] === 'MARGIN' ? 'margin' : 'cash'); msg(r.msg, !r.ok); return; }
    if(fn[w[0]] && w.length === 1){ go(fn[w[0]]); return; }
    if(w[0] === 'DEP' || w[0] === 'DEPOSIT'){ const r = M.deposit(+w[1]); msg(r.msg, !r.ok); return; }
    if(w[0] === 'WD' || w[0] === 'WITHDRAW'){ const r = M.withdraw(+w[1]); msg(r.msg, !r.ok); return; }
    if(w[0] === 'OPTLVL'){ const r = M.applyOptions(+w[1]); msg(r.msg, !r.ok); return; }
    if(w[0] === 'LOTS'){ M.setLotMethod(w[1]); msg('TAX LOT RELIEF: ' + w[1]); return; }
    if(w[0] === 'CXL'){ if(w[1] === 'ALL'){ M.cancelAll(); msg('ALL WORKING ORDERS CANCELED'); } else msg(M.cancel(+w[1]) ? 'CXL SENT #' + w[1] : 'NO WORKING ORDER #' + w[1], false); return; }
    if(w[0] === 'FLAT' || w[0] === 'FLATTEN'){ flatten(w[1] || st.sym); return; }
    if(w[0] === 'RESET'){ if(w[1] === 'CONFIRM'){ M.reset(); msg('ACCOUNT AND MARKET RESET. YOUR DEPOSITS ARE GONE.'); } else msg('RESET WIPES THE MARKET AND YOUR ACCOUNT. NOTHING IS REFUNDED. TYPE: RESET CONFIRM', true); return; }
    if(['BUY','SELL','SHORT','COVER','SS','BC'].indexOf(w[0]) >= 0){ stockCmd(w); return; }
    if(['BTO','STC','STO','BTC'].indexOf(w[0]) >= 0){ optCmd(w); return; }
    msg('UNKNOWN COMMAND: ' + s + '  (HELP <GO>)', true);
  }catch(e){ msg('SYNTAX ERROR. HELP <GO>', true); }
}
/* BUY 100 FRDG [MKT | LMT 41.2 | STP 40 | STPLMT 40 39.9 | TRAIL 0.5 | TRAIL% 2 | MOC | LOC 41] [DAY|GTC|IOC|FOK] [EXT] [TP 45] [SL 39] [ATTEST] */
function stockCmd(w){
  const side = { SS:'SHORT', BC:'COVER' }[w[0]] || w[0];
  const qty = +w[1], sym = w[2];
  if(!M.BYSYM[sym]) throw 0;
  const o = { sym, side, qty, type:'MKT', tif:'DAY' };
  for(let i=3;i<w.length;i++){
    const k = w[i];
    if(k === 'MKT' || k === 'MOC') o.type = k;
    else if(k === 'LMT'){ o.type = 'LMT'; o.lmt = +w[++i]; }
    else if(k === 'LOC'){ o.type = 'LOC'; o.lmt = +w[++i]; }
    else if(k === 'STP'){ o.type = 'STP'; o.stp = +w[++i]; }
    else if(k === 'STPLMT'){ o.type = 'STPLMT'; o.stp = +w[++i]; o.lmt = +w[++i]; }
    else if(k === 'TRAIL'){ o.type = 'TRAIL'; o.trailAmt = +w[++i]; }
    else if(k === 'TRAIL%'){ o.type = 'TRAIL'; o.trailPct = +w[++i]; }
    else if(['DAY','GTC','IOC','FOK'].indexOf(k) >= 0) o.tif = k;
    else if(k === 'EXT') o.ext = true;
    else if(k === 'TP'){ o.bracket = o.bracket || {}; o.bracket.tp = +w[++i]; }
    else if(k === 'SL'){ o.bracket = o.bracket || {}; o.bracket.sl = +w[++i]; }
    else if(k === 'ATTEST') o.attest = true;
    else throw 0;
  }
  const r = M.place(o);
  msg((r.ok ? '#' + r.id + ' ' + r.status + ' ' : 'REJ ') + (r.msg || describe(o)), !r.ok);
  setSym(sym);
}
/* BTO 2 FRDG 42.5C D15 [LMT 0.55] */
function optCmd(w){
  const qty = +w[1], sym = w[2], kc = w[3], exp = +String(w[4] || '').replace(/^D/, '');
  if(!M.BYSYM[sym]) throw 0;
  const m = /^([\d.]+)([CP])$/.exec(kc); if(!m || !exp) throw 0;
  const o = { opt:true, sym, side:w[0], qty, K:+m[1], type:m[2], exp, otype:'MKT', attest:true };
  if(w[5] === 'LMT'){ o.otype = 'LMT'; o.lmt = +w[6]; }
  const r = M.place(o);
  msg((r.ok ? '#' + r.id + ' ' + r.status : 'REJ ' + r.msg), !r.ok);
}
function describe(o){ return o.side + ' ' + o.qty + ' ' + o.sym + ' ' + o.type + (o.lmt ? ' ' + o.lmt : '') + (o.stp ? ' STP ' + o.stp : '') + ' ' + o.tif; }

/* ---------- ticket ---------- */
function syncTicket(){
  if(!root) return;
  root.querySelectorAll('#fx-tkt [data-side]').forEach(b=>b.classList.toggle('sel', b.dataset.side === T.side));
  $('#tk-qty').value = T.qty; $('#tk-type').value = T.type; $('#tk-lmt').value = T.lmt; $('#tk-stp').value = T.stp;
  $('#tk-trail').value = T.trail; $('#tk-trailp').value = T.trailPct; $('#tk-tif').value = T.tif; $('#tk-ext').checked = !!T.ext;
  $('#tk-tp').value = T.tp; $('#tk-sl').value = T.sl; $('#tk-att').checked = !!T.attest;
  const t = T.type;
  $('#tk-lmt').disabled = !(t === 'LMT' || t === 'STPLMT' || t === 'LOC');
  $('#tk-stp').disabled = !(t === 'STP' || t === 'STPLMT');
  $('#tk-trail').disabled = $('#tk-trailp').disabled = t !== 'TRAIL';
  $('#tk-attw').style.display = st.sym === 'VOID' ? 'flex' : 'none';
  const step = M.util.tickSize(M.state().tk[st.sym].p);
  $('#tk-lmt').step = $('#tk-stp').step = $('#tk-tp').step = $('#tk-sl').step = step;
  renderTicketPreview();
}
function qtyQuick(q){
  const qt = M.quote(st.sym), a = M.account();
  if(q === 'pos') T.qty = Math.abs(M.posQty(st.sym)) || T.qty;
  else if(q === 'max'){
    const p = (+T.lmt || qt.ask);
    if(T.side === 'SELL') T.qty = Math.max(0, M.posQty(st.sym));
    else if(T.side === 'COVER') T.qty = Math.max(0, -M.posQty(st.sym));
    else { const bp = a.type === 'margin' ? a.bp/2 : a.bp; T.qty = Math.max(0, Math.floor(bp/(p*(a.type === 'margin' ? Math.max(0.5, M.BYSYM[st.sym].house) : 1))*0.995)); }
  } else T.qty = +q;
  syncTicket();
}
function ticketOrder(){
  const o = { sym:st.sym, side:T.side, qty:+T.qty, type:T.type, tif:T.tif, ext:!!T.ext, attest:!!T.attest };
  if(T.type === 'LMT' || T.type === 'STPLMT' || T.type === 'LOC') o.lmt = +T.lmt;
  if(T.type === 'STP' || T.type === 'STPLMT') o.stp = +T.stp;
  if(T.type === 'TRAIL'){ if(+T.trail) o.trailAmt = +T.trail; else o.trailPct = +T.trailPct; }
  if((+T.tp || +T.sl) && (T.side === 'BUY' || T.side === 'SHORT')) o.bracket = { tp:+T.tp || 0, sl:+T.sl || 0 };
  return o;
}
function transmit(){
  const o = ticketOrder();
  const r = M.place(o);
  msg((r.ok ? '#' + r.id + ' ' + r.status + (r.msg ? ': ' + r.msg : '') : 'REJ ' + r.msg), !r.ok);
  if(r.ok) toast(describe(o) + ' → ' + r.status);
  renderAll(true);
}
function renderTicketPreview(){
  if(!root) return;
  const qt = M.quote(st.sym), a = M.account(), o = ticketOrder(), F = M.fees;
  const p = o.lmt || o.stp || (o.side === 'BUY' || o.side === 'COVER' ? qt.ask : qt.bid);
  const notional = (o.qty || 0)*p, fees = F.stockFees(o.side, o.qty || 0, p);
  const opening = o.side === 'BUY' || o.side === 'SHORT';
  const req = opening ? notional*(o.side === 'SHORT' || a.type === 'margin' ? Math.max(0.5, M.BYSYM[st.sym].house) : 1) : 0;
  const ses = M.session();
  const warn = [];
  if(o.type === 'MKT' && ses.name !== 'RTH') warn.push('MKT QUEUES FOR THE OPEN');
  if(ses.name !== 'RTH' && !o.ext && o.type !== 'MKT') warn.push('NOT EXT: WORKS AT THE OPEN');
  if(qt.halted) warn.push('HALTED ' + qt.halted.code);
  if(qt.ssr && o.side === 'SHORT') warn.push('SSR: LMT ABOVE NBB ONLY');
  if(M.BYSYM[st.sym].htb && o.side === 'SHORT') warn.push('HTB LOCATE ~' + n2((o.qty||0)*p*(0.005 + M.BYSYM[st.sym].borrow*0.01)) + 'F');
  if(a.type === 'cash' && o.side === 'SELL' && a.positions.some(x=>x.sym === st.sym && x.lots.some(l=>l.unpaid))) warn.push('GFV RISK: UNSETTLED LOT');
  if(a.type === 'margin' && !a.pdt && a.dayTrades5 >= 3 && (o.side === 'SELL' || o.side === 'COVER') && a.positions.some(x=>x.sym === st.sym && x.lots.some(l=>l.day === ses.day))) warn.push('THIS CLOSE IS DAY TRADE #' + (a.dayTrades5 + 1) + ' (PDT)');
  $('#tk-prev').innerHTML =
    `EST ${o.side} <b>${n0(o.qty||0)}</b> @ <b>${px(p)}</b> = <b>${n2(notional)}F</b> &nbsp; FEES <b>${n2(fees)}</b><br>` +
    `INIT REQ <b>${n2(req)}</b> &nbsp; BP <b>${n2(a.bp)}</b> &nbsp; POS <b class="${cls(M.posQty(st.sym))}">${n0(M.posQty(st.sym))}</b><br>` +
    (warn.length ? `<span class="dn">${warn.join(' · ')}</span>` : `<span class="dm">${a.type.toUpperCase()} · ${ses.name}${o.ext ? ' · EXT' : ''}</span>`);
  $('#tk-go').className = (o.side === 'BUY' || o.side === 'COVER') ? 'b' : 's';
  $('#tk-go').textContent = 'TRANSMIT ' + o.side;
}
function flatten(sym){
  const q = M.posQty(sym); if(!q){ msg('NO POSITION IN ' + sym, true); return; }
  M.state().acct.orders.forEach(o=>{ if(o.sym === sym && !o.opt && (o.status === 'OPEN' || o.status === 'HELD')) M.cancel(o.id); });
  const ses = M.session().name, qt = M.quote(sym);
  const side = q > 0 ? 'SELL' : 'COVER';
  const free = q > 0 ? q - M.account().positions.find(p=>p.sym === sym).locked : -q;
  if(free <= 0){ msg(sym + ': ENTIRE POSITION IS RSU-LOCKED', true); return; }
  const o = ses === 'RTH' ? { sym, side, qty:free, type:'MKT', tif:'DAY', attest:true } : { sym, side, qty:free, type:'LMT', lmt: q > 0 ? qt.bid : qt.ask, tif:'DAY', ext:true, attest:true };
  const r = M.place(o);
  msg(r.ok ? 'FLATTEN ' + sym + ' #' + r.id + ' ' + r.status : 'REJ ' + r.msg, !r.ok);
  renderAll(true);
}

/* ---------- options ---------- */
function pickContract(code){
  const [type, K, exp, side] = code.split('|');
  st.opt.type = type; st.opt.K = +K; st.opt.exp = +exp;
  const q = M.optQuote(st.sym, type, +K, +exp);
  st.opt.lmt = side === 'b' ? q.bid : q.ask;
  const held = (M.account().options.find(o=>o.sym === st.sym && o.type === type && o.K === +K && o.exp === +exp) || {}).q || 0;
  st.opt.side = side === 'a' ? (held < 0 ? 'BTC' : 'BTO') : (held > 0 ? 'STC' : 'STO');
  $('#op-side').value = st.opt.side; $('#op-lmt').value = st.opt.lmt.toFixed(2);
  $('#op-ctr').textContent = st.sym + ' D' + exp + ' ' + K + type;
}
function sendOpt(){
  if(!st.opt.K){ msg('PICK A CONTRACT FROM THE CHAIN FIRST', true); return; }
  const o = { opt:true, sym:st.sym, type:st.opt.type, K:st.opt.K, exp:st.opt.exp, side:$('#op-side').value, qty:+$('#op-qty').value, otype:$('#op-ot').value, lmt:+$('#op-lmt').value, attest:true };
  const r = M.place(o);
  msg(r.ok ? '#' + r.id + ' ' + r.status + ' ' + o.side + ' ' + o.qty + ' ' + o.sym + ' D' + o.exp + ' ' + o.K + o.type : 'REJ ' + r.msg, !r.ok);
  renderAll(true);
}

/* ---------- renders ---------- */
function renderAll(force){
  if(!st.open || !root) return;
  if(st.ptr && !force) { renderTop(); return; }
  renderTop(); renderAlert();
  if(vis('wl')) renderWL();
  if(vis('gp')) renderGP(force);
  if(vis('l2')) renderL2();
  if(vis('tkt')) renderTicketPreview();
  if(vis('pos')) renderPos();
  if(vis('ord')) renderOrd();
  if(vis('fill')) renderFills();
  if(vis('opt')) renderOpt(force);
  if(vis('acct')) renderAcct();
  if(vis('news')) renderNews();
  if(vis('des')) renderDes();
}
let tapeT = 0;
function renderTop(){
  const b = M.breadth(), s = M.session(), a = M.account();
  const ich = (b.idx/b.idxPrev - 1)*100;
  $('#fx-idx').innerHTML = `FRDX ${b.idx.toFixed(2)} <span style="color:${ich >= 0 ? '#003d14' : '#5a0000'}">${pct(ich)}</span>`;
  const sesCol = { PRE:'#003a6b', RTH:'#003d14', AH:'#4a2d00', CLOSED:'#5a0000' }[s.name];
  $('#fx-clk').innerHTML = `D${s.day} ${s.dow} <span style="color:${sesCol}">${s.name}</span> ${clock(s.t)} <span class="hm" style="opacity:.6">T-${clock(s.left)}</span>${s.expiryDay ? ' <span style="color:#5a0000">EXP</span>' : ''}`;
  $('#fx-acs').innerHTML = `NLV ${n2(a.equity)} · BP ${n2(a.bp)} · DAY ${sg(a.dayPL)} · ${a.type === 'margin' ? 'MRGN' : 'CASH'}${a.pdt ? ' PDT' : ' DT ' + a.dayTrades5 + '/3'}${a.marginCall ? ' · CALL' : ''}${a.restricted ? ' · RESTR' : ''}`;
  $('#fx-strip').innerHTML =
    `<span><b>TICK</b><span class="${cls(b.tick)}">${sg(b.tick, n0)}</span></span>` +
    `<span><b>TRIN</b><span class="${b.trin > 1 ? 'dn' : 'up'}">${b.trin.toFixed(2)}</span></span>` +
    `<span><b>A/D</b><span class="up">${b.adv}</span>/<span class="dn">${b.dec}</span></span>` +
    `<span><b>McCL</b><span class="${cls(b.mcclellan)}">${b.mcclellan.toFixed(1)}</span></span>` +
    `<span><b>P/C</b>${b.pcr.toFixed(2)}</span>` +
    `<span><b>FRIX</b><span class="${b.frix > 70 ? 'dn' : ''}">${b.frix.toFixed(2)}</span></span>` +
    `<span><b>FED</b>4.25</span>` +
    `<span><b>EXCESS</b><span class="${cls(a.excess)}">${n2(a.excess)}</span></span>` +
    `<span><b>SMA</b>${n2(a.sma)}</span><span><b>LEV</b>${a.leverage.toFixed(2)}x</span>`;
  if(Date.now() - tapeT > 15000){
    tapeT = Date.now();
    $('#fx-taperun').innerHTML = M.TICKERS.map(t=>{ const q = M.quote(t.sym); return `<i><span class="am">${t.sym}</span> ${px(q.last)} <span class="${cls(q.chg)}">${q.chg >= 0 ? '▲' : '▼'}${Math.abs(q.pct).toFixed(2)}%</span></i>`; }).join('') +
      M.state().news.slice(-6).map(n=>`<i class="dm">${esc(n.sym)}: ${esc(n.text)}</i>`).join('');
  }
}
function renderAlert(){
  const el = $('#fx-alert');
  if(st.alerts.length){ el.style.display = 'block'; el.textContent = st.alerts[0] + (st.alerts.length > 1 ? '  (+' + (st.alerts.length - 1) + ')' : '') + '  [TAP TO ACK]'; }
  else el.style.display = 'none';
}
function flags(sym, q){
  const t = M.BYSYM[sym], k = M.state().tk[sym], f = [];
  if(q.halted) f.push(`<span class="flag dn" title="${esc(q.halted.reason)}">${q.halted.code}</span>`);
  if(q.ssr) f.push('<span class="flag mg" title="Rule 201">SSR</span>');
  if(k.earnPending) f.push('<span class="flag yl" title="earnings before the open">E</span>');
  if(t.htb) f.push('<span class="flag dm" title="hard to borrow">HTB</span>');
  return f.join('');
}
function renderWL(){
  const pos = {}; M.account().positions.forEach(p=>pos[p.sym] = p.q);
  let h = '<table><tr><th>SYM</th><th>LAST</th><th>CHG%</th><th>BID</th><th>ASK</th><th>VOL</th><th>IV</th></tr>';
  M.TICKERS.forEach(t=>{
    const q = M.quote(t.sym);
    h += `<tr class="clk${t.sym === st.sym ? ' cur' : ''}" data-sym="${t.sym}" data-jump="1"><td>${t.sym}${pos[t.sym] ? ' <span class="yl">●</span>' : ''}${flags(t.sym, q)}</td>` +
      `<td class="${q.dir > 0 ? 'up' : q.dir < 0 ? 'dn' : ''}">${px(q.last)}</td><td class="${cls(q.chg)}">${pct(q.pct)}</td>` +
      `<td>${px(q.bid)}</td><td>${px(q.ask)}</td><td class="dm">${big(q.vol)}</td><td>${(q.iv*100).toFixed(0)}</td></tr>`;
  });
  $('#fx-wlb').innerHTML = h + '</table>';
}
function renderGP(force){
  const q = M.quote(st.sym), t = M.BYSYM[st.sym], s = M.stats(st.sym);
  $('#fx-gph').textContent = st.sym + ' <EQUITY> GP · ' + t.name.toUpperCase();
  root.querySelectorAll('#fx-tfs [data-tf]').forEach(b=>b.classList.toggle('sel', +b.dataset.tf === st.tf));
  $('#fx-quote').innerHTML = `<span class="big ${q.dir > 0 ? 'up' : q.dir < 0 ? 'dn' : ''}">${px(q.last)}</span><span class="${cls(q.chg)}">${sg(q.chg, px)} (${pct(q.pct)})</span>` +
    `<span class="dm">O</span>${px(q.open)} <span class="dm">H</span>${px(q.hi)} <span class="dm">L</span>${px(q.lo)} <span class="dm">VWAP</span>${px(q.vwap)} <span class="dm">VOL</span>${big(q.vol)} <span class="dm">IV/HV</span>${(q.iv*100).toFixed(1)}/${(s.hv*100).toFixed(1)} <span class="dm">MCAP</span>${big(s.mcap)}${flags(st.sym, q)}`;
  if(force || !$('#fx-ovs').childElementCount){
    $('#fx-ovs').innerHTML = [['vwap','VWAP'],['bb','BB(20,2)'],['e9','EMA9'],['e50','EMA50']].map(([k,l])=>`<button data-ov="${k}" class="${st.ov[k] ? 'sel' : ''}">${l}</button>`).join('') +
      '<span class="dm">|</span>' + ['VOL','RSI','MACD','ATR','OBV'].map(k=>`<button data-sub="${k}" class="${st.sub === k ? 'sel' : ''}">${k}</button>`).join('');
  }
  drawChart();
}
function drawChart(){
  if(!root || !vis('gp')) return;
  const cv = $('#fx-chart'), wrap = $('#fx-chartwrap');
  const W = wrap.clientWidth, H = wrap.clientHeight; if(W < 10 || H < 10) return;
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  if(cv.width !== Math.round(W*dpr) || cv.height !== Math.round(H*dpr)){ cv.width = Math.round(W*dpr); cv.height = Math.round(H*dpr); }
  const c = cv.getContext('2d'); c.setTransform(dpr, 0, 0, dpr, 0, 0);
  c.fillStyle = '#000'; c.fillRect(0, 0, W, H);
  const S = M.series(st.sym, st.tf);
  const pad = { l:4, r:58, t:16, b:14 };
  const subH = Math.max(40, Math.round(H*0.24));
  const mainH = H - pad.t - pad.b - subH - 6;
  const cw = Math.max(3, Math.min(11, (W - pad.l - pad.r)/90));
  const nVis = Math.max(5, Math.floor((W - pad.l - pad.r)/cw));
  const from = Math.max(0, S.candles.length - nVis);
  const cs = S.candles.slice(from);
  if(!cs.length){ c.fillStyle = '#7d7d7d'; c.font = '11px monospace'; c.fillText('NO PRINTS YET', 10, 30); return; }
  let lo = Infinity, hi = -Infinity;
  cs.forEach((k,i)=>{ lo = Math.min(lo, k.l); hi = Math.max(hi, k.h); if(st.ov.bb && S.bbU[from+i] !== null){ hi = Math.max(hi, S.bbU[from+i]); lo = Math.min(lo, S.bbL[from+i]); } });
  const a = M.account(), myOrders = a.orders.filter(o=>o.sym === st.sym && !o.opt && (o.status === 'OPEN' || o.status === 'TRIG' || o.status === 'HELD'));
  const posi = a.positions.find(p=>p.sym === st.sym);
  if(hi - lo < 1e-9){ hi += 0.01; lo -= 0.01; }
  const padP = (hi - lo)*0.08; hi += padP; lo -= padP;
  const y = p=>pad.t + (hi - p)/(hi - lo)*mainH;
  const x = i=>pad.l + i*cw + cw/2;
  /* grid */
  c.strokeStyle = '#141414'; c.lineWidth = 1; c.fillStyle = '#7d7d7d'; c.font = '10px monospace'; c.textAlign = 'left';
  for(let g=0; g<=5; g++){ const p = lo + (hi - lo)*g/5, yy = Math.round(y(p)) + 0.5; c.beginPath(); c.moveTo(pad.l, yy); c.lineTo(W - pad.r, yy); c.stroke(); c.fillText(px(p), W - pad.r + 4, yy + 3); }
  /* session shading: candles from the current day vs earlier */
  /* candles */
  cs.forEach((k,i)=>{
    const up = k.c >= k.o, col = up ? '#3ddc84' : '#ff4a4a';
    c.strokeStyle = col; c.fillStyle = col;
    const xx = Math.round(x(i)) + 0.5;
    c.beginPath(); c.moveTo(xx, y(k.h)); c.lineTo(xx, y(k.l)); c.stroke();
    const top = y(Math.max(k.o, k.c)), bh = Math.max(1, Math.abs(y(k.o) - y(k.c)));
    if(up){ c.fillStyle = '#000'; c.fillRect(xx - cw*0.35, top, cw*0.7, bh); c.strokeRect(xx - cw*0.35, top, cw*0.7, bh); }
    else c.fillRect(xx - cw*0.35, top, cw*0.7, bh);
  });
  const line = (arr, col, dash)=>{ c.strokeStyle = col; c.setLineDash(dash || []); c.beginPath(); let st0 = false; cs.forEach((k,i)=>{ const v = arr[from+i]; if(v === null || v === undefined) return; if(!st0){ c.moveTo(x(i), y(v)); st0 = true; } else c.lineTo(x(i), y(v)); }); c.stroke(); c.setLineDash([]); };
  if(st.ov.vwap) line(S.vwap, '#d66bff');
  if(st.ov.e9) line(S.ema9, '#ffd400');
  if(st.ov.e50) line(S.ema50, '#58a6ff');
  if(st.ov.bb){ line(S.bbU, '#5f5f5f', [3,3]); line(S.bbL, '#5f5f5f', [3,3]); line(S.sma20, '#444'); }
  /* last price tag */
  const last = cs[cs.length-1].c, ly = y(last);
  c.fillStyle = '#ffa028'; c.fillRect(W - pad.r, ly - 7, pad.r, 14); c.fillStyle = '#000'; c.fillText(px(last), W - pad.r + 4, ly + 3);
  c.strokeStyle = 'rgba(255,160,40,.4)'; c.setLineDash([2,3]); c.beginPath(); c.moveTo(pad.l, ly); c.lineTo(W - pad.r, ly); c.stroke(); c.setLineDash([]);
  /* your orders and your average */
  const hl = (p, col, label)=>{ if(p < lo || p > hi) return; const yy = Math.round(y(p)) + 0.5; c.strokeStyle = col; c.setLineDash([6,3]); c.beginPath(); c.moveTo(pad.l, yy); c.lineTo(W - pad.r, yy); c.stroke(); c.setLineDash([]); c.fillStyle = col; c.fillText(label, pad.l + 4, yy - 3); };
  myOrders.forEach(o=>{ const buy = o.side === 'BUY' || o.side === 'COVER'; if(o.lmt) hl(o.lmt, buy ? '#3ddc84' : '#ff4a4a', '#' + o.id + ' ' + o.side + ' ' + (o.qty - o.filled) + ' LMT'); if(o.stp) hl(o.stp, '#ffd400', '#' + o.id + ' ' + o.side + ' ' + (o.qty - o.filled) + ' STP'); });
  if(posi) hl(posi.avg, '#58a6ff', 'AVG ' + px(posi.avg) + ' x' + posi.q);
  /* sub pane */
  const sy0 = pad.t + mainH + 6, sh = subH;
  c.strokeStyle = '#222'; c.beginPath(); c.moveTo(pad.l, sy0 - 3); c.lineTo(W - pad.r, sy0 - 3); c.stroke();
  const sub = st.sub;
  const plot = (arr, col, mn, mx)=>{ c.strokeStyle = col; c.beginPath(); let s0 = false; cs.forEach((k,i)=>{ const v = arr[from+i]; if(v === null || v === undefined) return; const yy = sy0 + (mx - v)/(mx - mn || 1)*sh; if(!s0){ c.moveTo(x(i), yy); s0 = true; } else c.lineTo(x(i), yy); }); c.stroke(); };
  c.fillStyle = '#7d7d7d';
  if(sub === 'VOL'){
    let mx = 1; cs.forEach(k=>mx = Math.max(mx, k.v));
    cs.forEach((k,i)=>{ c.fillStyle = k.c >= k.o ? 'rgba(61,220,132,.55)' : 'rgba(255,74,74,.55)'; const hh = k.v/mx*sh; c.fillRect(x(i) - cw*0.35, sy0 + sh - hh, cw*0.7, hh); });
    c.fillStyle = '#7d7d7d'; c.fillText('VOL ' + big(cs[cs.length-1].v), W - pad.r + 4, sy0 + 10);
  } else if(sub === 'RSI'){
    [30,70].forEach(v=>{ const yy = sy0 + (100 - v)/100*sh; c.strokeStyle = '#2a2a2a'; c.beginPath(); c.moveTo(pad.l, yy); c.lineTo(W - pad.r, yy); c.stroke(); });
    plot(S.rsi, '#ffa028', 0, 100); c.fillStyle = '#7d7d7d'; c.fillText('RSI14 ' + S.rsi[S.rsi.length-1].toFixed(1), W - pad.r + 4, sy0 + 10);
  } else if(sub === 'MACD'){
    let mx = 1e-9; cs.forEach((k,i)=>{ mx = Math.max(mx, Math.abs(S.macd[from+i]), Math.abs(S.sig[from+i])); });
    const zy = sy0 + sh/2;
    cs.forEach((k,i)=>{ const v = S.hist[from+i]; c.fillStyle = v >= 0 ? 'rgba(61,220,132,.5)' : 'rgba(255,74,74,.5)'; c.fillRect(x(i) - cw*0.3, Math.min(zy, zy - v/mx*sh/2), cw*0.6, Math.abs(v/mx*sh/2)); });
    plot(S.macd, '#58a6ff', -mx, mx); plot(S.sig, '#ffa028', -mx, mx);
    c.fillStyle = '#7d7d7d'; c.fillText('MACD ' + S.macd[S.macd.length-1].toFixed(3), W - pad.r + 4, sy0 + 10);
  } else if(sub === 'ATR'){
    let mn = Infinity, mx = -Infinity; cs.forEach((k,i)=>{ mn = Math.min(mn, S.atr[from+i]); mx = Math.max(mx, S.atr[from+i]); });
    plot(S.atr, '#d66bff', mn, mx); c.fillStyle = '#7d7d7d'; c.fillText('ATR14 ' + px(S.atr[S.atr.length-1]), W - pad.r + 4, sy0 + 10);
  } else if(sub === 'OBV'){
    let mn = Infinity, mx = -Infinity; cs.forEach((k,i)=>{ mn = Math.min(mn, S.obv[from+i]); mx = Math.max(mx, S.obv[from+i]); });
    plot(S.obv, '#58a6ff', mn, mx); c.fillStyle = '#7d7d7d'; c.fillText('OBV ' + big(S.obv[S.obv.length-1]), W - pad.r + 4, sy0 + 10);
  }
  /* crosshair */
  const oh = $('#fx-ohlc');
  if(st.hover && st.hover.x < W - pad.r){
    const i = clampI(Math.floor((st.hover.x - pad.l)/cw), 0, cs.length - 1), k = cs[i];
    c.strokeStyle = 'rgba(255,255,255,.25)'; c.beginPath(); c.moveTo(x(i), pad.t); c.lineTo(x(i), H - pad.b); c.moveTo(pad.l, st.hover.y); c.lineTo(W - pad.r, st.hover.y); c.stroke();
    if(st.hover.y < pad.t + mainH){ const p = hi - (st.hover.y - pad.t)/mainH*(hi - lo); c.fillStyle = '#333'; c.fillRect(W - pad.r, st.hover.y - 7, pad.r, 14); c.fillStyle = '#fff'; c.fillText(px(p), W - pad.r + 4, st.hover.y + 3); }
    const tt = k.t, day = Math.floor(tt/360), sec = tt % 360;
    oh.innerHTML = `D${day} ${clock(sec)} O <b>${px(k.o)}</b> H <b>${px(k.h)}</b> L <b>${px(k.l)}</b> C <b class="${k.c >= k.o ? 'up' : 'dn'}">${px(k.c)}</b> V ${big(k.v)}`;
  } else oh.innerHTML = `${st.sym} · ${['','10S','','30S','','','1M'][st.tf] || (st.tf*10) + 'S'} · ${S.candles.length} BARS`;
}
function clampI(v, a, b){ return v < a ? a : v > b ? b : v; }
function renderL2(){
  const q = M.quote(st.sym), bk = M.book(st.sym, 12);
  $('#fx-l2sym').textContent = st.sym;
  $('#fx-nbbo').innerHTML = `<span class="up">${px(q.bid)} × ${bk.bids[0] ? n0(bk.bids[0].sz) : 0}</span><span class="dm">SPRD ${px(q.ask - q.bid)} (${((q.ask - q.bid)/q.mid*1e4).toFixed(1)}bp)</span><span class="dn">${px(q.ask)} × ${bk.asks[0] ? n0(bk.asks[0].sz) : 0}</span>`;
  let mx = 1; bk.bids.concat(bk.asks).forEach(l=>mx = Math.max(mx, l.sz));
  const tbl = (arr, side)=>'<table class="l2b"><tr><th class="l">MPID</th><th>' + (side === 'b' ? 'BID' : 'ASK') + '</th><th>SIZE</th></tr>' + arr.map((l, i)=>{
    const shade = Math.max(0.03, 0.35 - i*0.025);
    return `<tr class="${l.mine ? 'mine' : ''}" style="background:${side === 'b' ? `rgba(61,220,132,${shade*l.sz/mx})` : `rgba(255,74,74,${shade*l.sz/mx})`}"><td class="mm l">${l.mm}</td><td class="${side === 'b' ? 'up' : 'dn'}">${px(l.px)}</td><td>${n0(l.sz)}</td></tr>`;
  }).join('') + '</table>';
  $('#fx-bids').innerHTML = tbl(bk.bids, 'b'); $('#fx-asks').innerHTML = tbl(bk.asks, 'a');
  const tape = M.tape(st.sym);
  $('#fx-tas').innerHTML = '<table><tr><th class="l">TIME</th><th>PRICE</th><th>SIZE</th><th>COND</th></tr>' + tape.slice(0, 40).map(p=>{
    const col = p.px >= q.ask ? 'up' : p.px <= q.bid ? 'dn' : '';
    return `<tr><td class="l dm">${clock(p.t)}</td><td class="${p.cond && p.cond[0] === 'Y' ? 'yl' : col}">${px(p.px)}</td><td>${n0(p.q)}</td><td class="dm">${p.cond}</td></tr>`;
  }).join('') + '</table>';
}
function renderPos(){
  const a = M.account();
  let h = '<table><tr><th>SYM</th><th>QTY</th><th>AVG</th><th>LAST</th><th>MKT VAL</th><th>UNRL P/L</th><th>%</th><th>DAY P/L</th><th>%NLV</th><th>LOCK</th><th>LOTS</th><th></th></tr>';
  if(!a.positions.length) h += '<tr><td colspan="12" class="dm l">NO POSITIONS. DEPOSIT IN ACCT, THEN ORDER ENTRY. SPAWNING COLORED FRIDGES UPSTAIRS VESTS 1 SHARE OF THAT TICKER.</td></tr>';
  a.positions.forEach(p=>{
    const last = M.quote(p.sym).last;
    h += `<tr class="clk" data-sym="${p.sym}"><td>${p.sym}</td><td class="${cls(p.q)}">${n0(p.q)}</td><td>${px(p.avg)}</td><td>${px(last)}</td><td>${n2(p.mv)}</td><td class="${cls(p.upl)}">${sg(p.upl)}</td><td class="${cls(p.upl)}">${p.avg ? pct((last/p.avg - 1)*100*Math.sign(p.q)) : '-'}</td><td class="${cls(p.dayPL)}">${sg(p.dayPL)}</td><td>${(Math.abs(p.mv)/Math.max(1, a.equity)*100).toFixed(1)}</td><td class="mg">${p.locked || ''}</td><td class="dm">${p.lots.length}${p.lots.some(l=>l.wash) ? ' <span class="flag mg">W</span>' : ''}${p.lots.some(l=>l.unpaid) ? ' <span class="flag dn">U</span>' : ''}</td><td><button data-flat="${p.sym}">FLAT</button></td></tr>`;
  });
  if(a.options.length){
    h += '<tr><th>CONTRACT</th><th>QTY</th><th>AVG</th><th>MARK</th><th>MKT VAL</th><th>UNRL P/L</th><th>Δ</th><th>Γ</th><th>Θ/D</th><th>VEGA</th><th>DTE</th><th></th></tr>';
    a.options.forEach(o=>{
      const g = o.greeks;
      h += `<tr class="clk" data-sym="${o.sym}"><td>${o.sym} D${o.exp} ${o.K}${o.type}</td><td class="${cls(o.q)}">${o.q}</td><td>${o.avg.toFixed(2)}</td><td>${o.mark.toFixed(2)}</td><td>${n2(o.mv)}</td><td class="${cls(o.upl)}">${sg(o.upl)}</td><td>${(g.delta*o.q*10).toFixed(1)}</td><td>${(g.gamma*o.q*10).toFixed(2)}</td><td class="${cls(g.theta*o.q)}">${(g.theta*o.q*10).toFixed(2)}</td><td>${(g.vega*o.q*10).toFixed(2)}</td><td>${o.exp - M.session().day}</td><td></td></tr>`;
    });
  }
  h += `<tr><td class="l am" colspan="4">TOTAL</td><td>${n2(a.longMV - a.shortMV + a.optMV)}</td><td colspan="7" class="l dm">REALIZED ${sg(a.realized)} · ST ${sg(a.realizedST)} · LT ${sg(a.realizedLT)} · WASH DISALLOWED ${n2(a.wash)} · RSU VESTED ${a.rsu}</td></tr>`;
  $('#fx-posb').innerHTML = h + '</table>';
}
function renderOrd(){
  const a = M.account();
  let h = '<table><tr><th>#</th><th class="l">TIME</th><th class="l">SYM</th><th class="l">SIDE</th><th>QTY</th><th class="l">TYPE</th><th>LMT</th><th>STP</th><th class="l">TIF</th><th>FILLED</th><th>AVG</th><th class="l">STATUS</th><th class="l">NOTE</th><th></th></tr>';
  if(!a.orders.length) h += '<tr><td colspan="14" class="dm l">NO ORDERS TODAY</td></tr>';
  a.orders.forEach(o=>{
    const working = o.status === 'OPEN' || o.status === 'HELD' || o.status === 'TRIG';
    const scol = o.status === 'FILLED' ? 'up' : o.status === 'REJ' ? 'dn' : working ? 'yl' : 'dm';
    const sym = o.opt ? o.sym + ' D' + o.exp + ' ' + o.K + o.type : o.sym;
    const typ = o.opt ? o.otype : (o.type + (o.ext ? ' EXT' : '') + (o.trailAmt ? ' ' + o.trailAmt : o.trailPct ? ' ' + o.trailPct + '%' : '') + (o.ocoWith ? ' OCO' : '') + (o.parent ? ' ←#' + o.parent : ''));
    h += `<tr><td>${o.id}</td><td class="l dm">${ts(o.created.day, o.created.t)}</td><td class="l">${sym}</td><td class="l ${o.side === 'BUY' || o.side === 'COVER' || o.side === 'BTO' || o.side === 'BTC' ? 'up' : 'dn'}">${o.side}</td><td>${n0(o.qty)}</td><td class="l">${typ}</td><td>${o.lmt ? px(o.lmt) : ''}</td><td>${o.stp ? px(o.stp) : ''}</td><td class="l">${o.tif || 'DAY'}</td><td>${n0(o.filled)}</td><td>${o.avgFill ? px(o.avgFill) : ''}</td><td class="l ${scol}">${o.status}</td><td class="l dm" style="white-space:normal;max-width:280px">${esc(o.reason || '')}</td><td>${working ? `<button data-cxl="${o.id}">CXL</button>` : ''}</td></tr>`;
  });
  $('#fx-ordb').innerHTML = h + '</table>';
}
function renderFills(){
  const a = M.account();
  let h = '<table><tr><th class="l">TIME</th><th>#</th><th class="l">SYM</th><th class="l">SIDE</th><th>QTY</th><th>PRICE</th><th>NOTIONAL</th><th class="l">COND</th></tr>';
  if(!a.fills.length) h += '<tr><td colspan="8" class="dm l">NO EXECUTIONS</td></tr>';
  a.fills.forEach(f=>{
    const n = f.q*f.px*(String(f.sym).indexOf(' ') > 0 ? 10 : 1);
    h += `<tr><td class="l dm">${ts(f.day, f.t)}</td><td>${f.id || ''}</td><td class="l">${f.sym}</td><td class="l">${f.side}</td><td>${n0(f.q)}</td><td>${px(f.px)}</td><td>${n2(n)}</td><td class="l dm">${f.cond}</td></tr>`;
  });
  $('#fx-fillb').innerHTML = h + '</table>';
}
function renderOpt(force){
  const ch = M.chain(st.sym), s = M.session();
  $('#op-sym').textContent = st.sym + ' ' + px(M.quote(st.sym).last);
  if(!st.chainExp || ch.exps.indexOf(st.chainExp) < 0) st.chainExp = ch.exps[0];
  const sel = $('#op-exp');
  const want = ch.exps.map(e=>`<option value="${e}"${e === st.chainExp ? ' selected' : ''}>D${e} ${['MON','TUE','WED','THU','FRI'][(e-1)%5]} (${e - s.day}DTE)</option>`).join('');
  if(sel.innerHTML !== want && document.activeElement !== sel) sel.innerHTML = want;
  const ei = ch.exps.indexOf(st.chainExp);
  const S0 = M.quote(st.sym).last;
  let h = '<table><tr><th>Δ</th><th>Γ</th><th>Θ</th><th>VEGA</th><th>IV</th><th>BID</th><th>ASK</th><th class="c">STRIKE</th><th>BID</th><th>ASK</th><th>IV</th><th>Δ</th><th>Γ</th><th>Θ</th><th>VEGA</th></tr>';
  ch.rows.forEach(r=>{
    const c = r.c[ei], p = r.p[ei], citm = r.K < S0, pitm = r.K > S0, ct = citm ? ' itm' : '', pt = pitm ? ' itm' : '';
    const sel = (t, side)=>`data-oc="${t}|${r.K}|${st.chainExp}|${side}"`;
    h += `<tr><td class="${ct}">${c.g.delta.toFixed(2)}</td><td class="${ct}">${c.g.gamma.toFixed(3)}</td><td class="dn${ct}">${c.g.theta.toFixed(3)}</td><td class="${ct}">${c.g.vega.toFixed(3)}</td><td class="${ct}">${(c.g.iv*100).toFixed(1)}</td>` +
      `<td class="q up${ct}" ${sel('C','b')}>${c.bid.toFixed(2)}</td><td class="q dn${ct}" ${sel('C','a')}>${c.ask.toFixed(2)}</td><td class="k">${r.K}</td>` +
      `<td class="q up${pt}" ${sel('P','b')}>${p.bid.toFixed(2)}</td><td class="q dn${pt}" ${sel('P','a')}>${p.ask.toFixed(2)}</td><td class="${pt}">${(p.g.iv*100).toFixed(1)}</td><td class="${pt}">${p.g.delta.toFixed(2)}</td><td class="${pt}">${p.g.gamma.toFixed(3)}</td><td class="dn${pt}">${p.g.theta.toFixed(3)}</td><td class="${pt}">${p.g.vega.toFixed(3)}</td></tr>`;
  });
  $('#fx-optb').innerHTML = h + '</table>';
  /* portfolio greeks, beta-weighted to FRDX */
  const a = M.account();
  let D = 0, G = 0, Th = 0, V = 0, BWD = 0;
  a.options.forEach(o=>{ const g = o.greeks, m = o.q*10; D += g.delta*m; G += g.gamma*m; Th += g.theta*m; V += g.vega*m; BWD += g.delta*m*M.BYSYM[o.sym].beta*M.quote(o.sym).last/ (M.breadth().idx/100); });
  a.positions.forEach(p=>{ BWD += p.q*M.BYSYM[p.sym].beta*M.quote(p.sym).last/(M.breadth().idx/100); });
  $('#op-gsum').innerHTML = `<span class="dm">CALLS LEFT · PUTS RIGHT · CLICK BID TO SELL, ASK TO BUY · ×10 MULT · CASH-SETTLED AT CLOSE ON EXPIRY · LVL ${a.optLevel}</span>` +
    `<span>PORT Δ <b>${D.toFixed(1)}</b></span><span>Γ <b>${G.toFixed(2)}</b></span><span>Θ/D <b class="${cls(Th)}">${Th.toFixed(2)}</b></span><span>VEGA <b>${V.toFixed(2)}</b></span><span>β-WTD Δ (FRDX/100) <b>${BWD.toFixed(1)}</b></span>`;
}
function renderAcct(){
  const a = M.account();
  let up = 0; try{ up = M._fridges(); }catch(e){}
  $('#ac-up').textContent = n0(up);
  $('#ac-cash').classList.toggle('sel', a.type === 'cash'); $('#ac-margin').classList.toggle('sel', a.type === 'margin');
  if(document.activeElement !== $('#ac-lvl')) $('#ac-lvl').value = Math.max(1, a.optLevel);
  if(document.activeElement !== $('#ac-lots')) $('#ac-lots').value = a.lotMethod;
  const row = (k, v, c)=>`<tr><td class="l dm">${k}</td><td class="${c || ''}">${v}</td></tr>`;
  $('#ac-bal').innerHTML = '<h4>BALANCES</h4><table>' +
    row('NET LIQUIDATION', n2(a.equity), 'am') + row('CASH (SETTLED)', n2(a.cash), cls(a.cash) === 'dn' ? 'dn' : '') + row('UNSETTLED (T+2)', n2(a.unsettled)) +
    row('LONG MKT VAL', n2(a.longMV)) + row('SHORT MKT VAL', n2(-a.shortMV)) + row('OPTION MKT VAL', n2(a.optMV)) +
    row('INITIAL REQ (REG T)', n2(a.init)) + row('MAINT REQ (HOUSE)', n2(a.maint)) + row('EXCESS LIQUIDITY', n2(a.excess), cls(a.excess)) +
    row('SMA', n2(a.sma)) + row('BUYING POWER', n2(a.bp), 'yl') + row('GROSS LEVERAGE', a.leverage.toFixed(2) + 'x') +
    row('DAY P/L', sg(a.dayPL), cls(a.dayPL)) + row('REALIZED (ST / LT)', sg(a.realizedST) + ' / ' + sg(a.realizedLT), cls(a.realized)) +
    row('WASH SALE DISALLOWED', n2(a.wash), a.wash ? 'mg' : '') + row('EST. TAX LIABILITY', n2(a.estTax)) +
    row('COMMISSIONS + REG FEES', n2(a.fees)) + row('MARGIN INTEREST', n2(a.interest)) + row('BORROW / LOCATE', n2(a.borrowFees)) + row('DIVIDENDS (NET)', n2(a.divs)) + '</table>';
  const s = M.session();
  const settle = a.unsettledList.map(u=>`<tr><td class="l dm">SETTLES D${u.day}</td><td>${n2(u.amt)}</td></tr>`).join('') + a.ach.map(u=>`<tr><td class="l dm">ACH CLEARS D${u.day}</td><td>${n2(u.amt)}</td></tr>`).join('');
  $('#ac-flags').innerHTML = '<h4>STATUS</h4><table>' +
    row('ACCOUNT TYPE', a.type.toUpperCase()) +
    row('PATTERN DAY TRADER', a.pdt ? 'FLAGGED' : 'NO', a.pdt ? 'dn' : '') +
    row('DAY TRADES (5 SESS)', a.dayTrades5 + (a.pdt ? '' : ' / 3'), a.dayTrades5 >= 3 ? 'dn' : '') +
    row('GOOD FAITH VIOLATIONS', a.gfv + (a.gfvUntil > s.day ? ' (LIMITED TO D' + a.gfvUntil + ')' : ''), a.gfv ? 'dn' : '') +
    row('PDT RESTRICTION', a.restricted ? 'UNTIL D' + a.restrictedUntil : 'NONE', a.restricted ? 'dn' : '') +
    row('MARGIN CALL', a.marginCall ? n2(a.marginCall.amt) + ' DUE D' + a.marginCall.due : 'NONE', a.marginCall ? 'dn' : '') +
    row('OPTIONS LEVEL', a.optLevel) + row('LOT RELIEF', a.lotMethod) + '</table>' +
    (settle ? '<h4>SETTLEMENT</h4><table>' + settle + '</table>' : '');
  /* equity curve */
  const cv = $('#ac-spark'), W = cv.clientWidth, H = 60; if(W > 10){
    cv.width = W; cv.height = H; const c = cv.getContext('2d'); c.fillStyle = '#000'; c.fillRect(0, 0, W, H);
    const pts = a.eqHist.map(e=>e.eq).concat([a.equity]);
    if(pts.length > 1){ let lo = Math.min.apply(null, pts), hi = Math.max.apply(null, pts); if(hi - lo < 1){ hi += 1; lo -= 1; }
      c.strokeStyle = pts[pts.length-1] >= pts[0] ? '#3ddc84' : '#ff4a4a'; c.beginPath(); pts.forEach((p,i)=>{ const x = i/(pts.length-1)*(W-2) + 1, y = H - 2 - (p - lo)/(hi - lo)*(H - 4); i ? c.lineTo(x,y) : c.moveTo(x,y); }); c.stroke(); }
    c.fillStyle = '#7d7d7d'; c.font = '9px monospace'; c.fillText('NLV @ CLOSE', 3, 10);
  }
}
let newsN = -1;
function renderNews(){
  const n = M.state().news; if(n.length === newsN && n.length) return; newsN = n.length;
  let h = '<table>';
  n.slice().reverse().forEach(x=>{ h += `<tr><td class="ts">${ts(x.day, x.t)}</td><td class="sy" ${M.BYSYM[x.sym] ? `data-sym="${x.sym}"` : ''}>${esc(x.sym)}</td><td class="${x.impact > 0 ? 'up' : x.impact < 0 ? 'dn' : ''}">${esc(x.text)}</td></tr>`; });
  $('#fx-newsb').innerHTML = h + '</table>' + (n.length ? '' : '<div class="dm" style="padding:6px">WIRE QUIET</div>');
}
function renderDes(){
  const s = M.stats(st.sym), t = M.BYSYM[st.sym], q = M.quote(st.sym);
  const row = (k, v)=>`<tr><td class="l dm">${k}</td><td>${v}</td></tr>`;
  $('#fx-desb').innerHTML = `<h4>${st.sym} US · ${esc(s.name.toUpperCase())}</h4><div class="dm">${esc(s.sector.toUpperCase())}</div>` +
    '<table style="max-width:520px">' + row('LAST', px(q.last)) + row('MARKET CAP', big(s.mcap)) + row('FLOAT', big(s.float)) + row('SHORT INTEREST % FLOAT', (s.si*100).toFixed(1) + '%') +
    row('DAYS TO COVER', s.dtc.toFixed(1)) + row('BORROW RATE (ANN.)', (s.borrow*100).toFixed(2) + '%' + (s.htb ? ' HTB' : ' ETB')) + row('FAILS TO DELIVER', s.ftd ? n0(s.ftd) : '-') +
    row('P/E (TTM)', s.pe ? s.pe.toFixed(1) : 'NM') + row('EPS (TTM)', s.eps.toFixed(2)) + row('DIV YIELD', (s.divYield*100).toFixed(2) + '%') + row('BETA (FRDX)', s.beta.toFixed(2)) +
    row('IMPLIED VOL (30D)', (s.iv*100).toFixed(1)) + row('REALIZED VOL', (s.hv*100).toFixed(1)) + row('HOUSE MAINT REQ', (Math.max(0.25, s.house)*100).toFixed(0) + '%') +
    row('NEXT EARNINGS', s.earnIn === 0 ? 'TOMORROW BMO' : 'IN ' + s.earnIn + ' SESSIONS') + row('SPLITS', s.splits) + row('PREV CLOSE', px(q.prevClose)) + '</table>';
}

/* ---------- help: written for someone who already knows ---------- */
const HELP = `<dl>
<dt>COMMAND LINE</dt>
<dd><code>FRDG &lt;GO&gt;</code> load · <code>FRDG GP</code> / <code>DES</code> / <code>OMON</code> / <code>MBO</code> / <code>TAS</code> · <code>PORT</code> <code>BLTR</code> <code>FILLS</code> <code>TOP</code> <code>ACCT</code> <code>MON</code> <code>TKT</code></dd>
<dd><code>BUY|SELL|SHORT|COVER|SS|BC qty SYM [MKT|LMT p|STP p|STPLMT s l|TRAIL f|TRAIL% x|MOC|LOC p] [DAY|GTC|IOC|FOK] [EXT] [TP p] [SL p] [ATTEST]</code></dd>
<dd><code>BTO|STC|STO|BTC qty SYM 42.5C D15 [LMT p]</code> · <code>CXL id|ALL</code> · <code>FLAT SYM</code> · <code>DEP n</code> · <code>WD n</code> · <code>ACCT MARGIN|CASH</code> · <code>OPTLVL n</code> · <code>LOTS FIFO|LIFO|HIFO</code> · <code>RESET CONFIRM</code> · ↑↓ history</dd>
<dt>CLOCK</dt><dd>1 session = 6:00 real. PRE 00:00-00:30 · RTH 00:30-05:00 · AH 05:00-05:45 · CLOSED. 5 sessions/wk, expiry FRI close. ACH clears next session (instant credit 5K cash / 10K margin).</dd>
<dt>ORDERS</dt><dd>MKT walks the book (impact, slippage). LMT rests, shows on MBO as YOU. STP/TRAIL trigger on last → MKT. STPLMT → LMT. MOC/LOC fill in the closing cross, entry cutoff T-15s. EXT = LMT only, DAY/GTC. IOC/FOK RTH only. Brackets go live on parent fill, children OCO.</dd>
<dt>CASH ACCT</dt><dd>T+2. Selling a lot bought with unsettled proceeds = GFV. 3 GFVs = settled-cash only for 9 sessions. No shorts. No naked options.</dd>
<dt>MARGIN</dt><dd>2K min. Reg T 50% initial, house maint 25-100% by name (concentration &gt;60% NLV → 50%). Shorts under 5F: max(2.50/sh, 100%). Maint call at close, 2 sessions to cure, else liquidation at open + 25F. Debit interest tiered, daily. 4 day trades / 5 sessions = PDT. PDT under 25K = closing only, 9 sessions. PDT ≥25K = 4× day-trade BP off start-of-day excess.</dd>
<dt>SHORTS</dt><dd>HTB names charge a locate up front + borrow daily. Rule 201: -10% vs prior close → shorts only on LMT above NBB, rest of session + next. Dividends owed on short.</dd>
<dt>HALTS</dt><dd>LULD: 30-tick ref, 10/15/20% bands, 15s pause, reopening auction. MWCB L1 at FRDX -7% halts everything 30s, once per session. H10 = regulatory. MKT orders queue as HELD.</dd>
<dt>OPTIONS</dt><dd>BSM w/ cont. div yield, skewed surface (VOID smiles), term structure, IV ramps into earnings and crushes after. ×10. Cash-settled at the close on expiry. LVL1 covered · LVL2 long · LVL3 spreads · LVL4 naked (margin). Approval scales with fills + NLV, one app per session.</dd>
<dt>TAX</dt><dd>Lots FIFO/LIFO/HIFO. Held ≥30 sessions = LT. Loss with a buy within 3 sessions = wash, basis carried to the replacement lot (W).</dd>
<dt>CORP ACTIONS</dt><dd>Earnings every 15 sessions BMO, gap on surprise. Dividends ex-date, price adjusts. Fwd split &gt;1200F 4:1, RUST reverse 1:10 &lt;0.20.</dd>
<dt>BREADTH</dt><dd>TICK (upticks-downticks ×77) · TRIN (A/D ÷ upvol/dnvol) · McCL (19/39 EMA of net adv, ×10, updates at close) · P/C · FRIX (mean ATM IV).</dd>
<dt>UPSTAIRS</dt><dd>Colored fridges are issued paper. Each spawn vests 1 share of its ticker (RSU, locked T+2) and dilutes the float. Plain fridges are FRDG and vest nothing. Pond catches move FISH. VNDR lists after you have been downstairs.</dd>
<dt>FLAGS</dt><dd>● position · LUDP/M/H10 halt · SSR · E earnings tomorrow · HTB · W wash basis · U unsettled lot · Y@ your print · F large · I odd lot · D dark · T form T (ext hrs) · C cross</dd>
</dl>`;

/* ---------- live ---------- */
M.on((kind, d)=>{
  if(kind === 'alert'){ st.alerts.push(String(d)); if(st.open) renderAlert(); updateBtn(); return; }
  if(kind === 'rsu'){ if(st.open) toast('RSU VEST: +1 ' + d + ' (LOCKED T+2)'); return; }
  if(kind === 'tick'){ updateBtn(); renderAll(false); return; }
  if(kind === 'fill' && st.open){ const f = d; toast('FILL ' + f.o.side + ' ' + f.qty + ' ' + f.o.sym + ' @ ' + px(f.px)); }
  if(kind === 'session' && st.open){ toast(d === 'open' ? 'OPENING CROSS · RTH' : 'CLOSING CROSS · AH'); }
});
let btnT = 0;
function updateBtn(){
  const b = document.getElementById('fxOpenBtn'); if(!b) return;
  if(Date.now() - btnT < 2000) return; btnT = Date.now();
  const br = M.breadth(), ch = (br.idx/br.idxPrev - 1)*100;
  b.innerHTML = 'fridge market<small style="color:' + (ch >= 0 ? '#0a6b2f' : '#a11') + '">FRDX ' + br.idx.toFixed(1) + ' ' + (ch >= 0 ? '▲' : '▼') + Math.abs(ch).toFixed(2) + '%' + (M.account().marginCall || st.alerts.length ? ' ⚠' : '') + '</small>';
}
M.ui.updateBtn = updateBtn;
})();
