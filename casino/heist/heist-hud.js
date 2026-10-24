/* ============================================================
   FRIDGE PALACE HEIST: what's drawn on top while you're working
============================================================ */
import { WEAPONS } from './guns.js';

const esc = s=>String(s).replace(/[&<>"]/g, c=>({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' }[c]));
const fmt = n=>Math.round(n).toLocaleString('en-US');

export class HeistHud {
  constructor(C){
    this.C = C;
    if(!document.getElementById('hh-css')){ const l = document.createElement('link'); l.id = 'hh-css'; l.rel = 'stylesheet'; l.href = new URL('./heist.css', import.meta.url).href; document.head.appendChild(l); }
    if(!document.getElementById('hh-font')){ const l = document.createElement('link'); l.id = 'hh-font'; l.rel = 'stylesheet'; l.href = 'https://fonts.googleapis.com/css2?family=Oswald:wght@400;700&display=swap'; document.head.appendChild(l); }
    const el = document.createElement('div'); el.id = 'hh'; el.className = 'off';
    el.innerHTML = `
      <div id="hh-frost"></div><div id="hh-red"></div><div id="hh-lb"></div>
      <div id="hh-wire"><span></span></div>
      <div id="hh-cross" class="hide"><i class="t"></i><i class="b"></i><i class="l"></i><i class="r"></i><i class="d"></i></div>
      <div id="hh-hit"></div>
      <div id="hh-dmg">${'<b></b>'.repeat(6)}</div>
      <div id="hh-obj"></div>
      <div id="hh-fear"><div class="lbl">THE ROOM</div><div class="bar"><i></i></div></div>
      <div id="hh-bag"><div class="l">THE BAG</div><div class="v">0</div><div class="w"></div><div class="stars"></div><div class="timer"></div></div>
      <div id="hh-hp"><div class="lbl"><span>COOLANT</span><span class="n">100</span></div><div class="bar"><u></u><i></i></div><div class="packs"></div></div>
      <div id="hh-ammo"><div class="nm"></div><div class="kd"></div><div class="ct"></div><div class="slots"></div></div>
      <div id="hh-boss"><div class="nm"></div><div class="sub"></div><div class="bar"><div class="ar"></div><i></i></div><div class="pips"></div></div>
      <div id="hh-big"><h1></h1><p></p></div>
      <div id="hh-choice"></div>
      <div id="hh-duffel"></div>
      <div id="hh-card"><div class="in"></div></div>
      <div id="hh-touch"><button class="fire">FIRE</button><button class="ads">AIM</button><button class="rel">RLD</button><button class="swp">SWAP</button><button class="cro">DUCK</button><button class="yel">YELL</button><button class="hea">HEAL</button></div>`;
    C.root.appendChild(el);
    this.el = el; this.$ = s=>el.querySelector(s);
    this.dmgI = 0; this.shown = {}; this.objKey = '';
    this.wireTxt = '';
    this.buildTouch();
    C.bus.on('hitmark', h=>this.hitmark(h));
  }
  show(on){ this.el.classList.toggle('off', !on); if(this.C.input.touch) this.$('#hh-touch').classList.toggle('on', !!on); }
  buildTouch(){
    const C = this.C, T = this.$('#hh-touch');
    const bind = (cls, down, up)=>{ const b = T.querySelector('.' + cls); b.addEventListener('touchstart', e=>{ e.preventDefault(); e.stopPropagation(); down(b); }, { passive:false }); b.addEventListener('touchend', e=>{ e.preventDefault(); up && up(b); }, { passive:false }); b.addEventListener('touchcancel', e=>{ up && up(b); }); };
    bind('fire', b=>{ const A = C.arsenal; if(!A) return; A.touch.fire = true; A.touch.firePressed = true; b.classList.add('on'); }, b=>{ if(C.arsenal) C.arsenal.touch.fire = false; b.classList.remove('on'); });
    bind('ads', b=>{ const A = C.arsenal; if(!A) return; A.touch.ads = !A.touch.ads; b.classList.toggle('on', A.touch.ads); });
    bind('rel', ()=>{ C.arsenal && C.arsenal.reload(); });
    bind('swp', ()=>{ C.arsenal && (C.arsenal.drawn ? C.arsenal.cycle(1) : C.arsenal.select(C.arsenal.cur || C.arsenal.order[0])); });
    bind('cro', b=>{ C.player.crouch = !C.player.crouch; b.classList.toggle('on', C.player.crouch); });
    bind('yel', ()=>{ C.bus.emit('yell'); });
    bind('hea', ()=>{ C.heist && C.heist.useBandage(); });
  }
  /* ---------- pieces ---------- */
  cross(spread, on, ads, freon){
    const c = this.$('#hh-cross');
    c.classList.toggle('hide', !on); if(!on) return;
    c.classList.toggle('ads', !!ads && !freon); c.classList.toggle('freon', !!freon);
    const cam = this.C.camera, h = this.C.root.clientHeight || innerHeight;
    const px = Math.max(3, Math.tan(spread)/Math.tan(cam.fov*Math.PI/360)*h/2);
    const k = Math.round(px);
    if(k !== this._ck){ this._ck = k; const [t, b, l, r] = c.querySelectorAll('i'); t.style.top = (-k - 9) + 'px'; b.style.top = k + 'px'; l.style.left = (-k - 9) + 'px'; r.style.left = k + 'px'; }
  }
  hitmark(h){ const e = this.$('#hh-hit'); e.className = ''; void e.offsetWidth; e.className = 'on' + (h.kill ? ' kill' : h.crit ? ' crit' : ''); this.C.audio.heist && this.C.audio.heist.hitmark(h.kill); }
  damageFrom(pos){
    const C = this.C, cam = C.camera.position;
    const ang = Math.atan2(pos.x - cam.x, pos.z - cam.z), rel = -(ang - C.player.yaw) + Math.PI;
    const bs = this.$('#hh-dmg').querySelectorAll('b'), b = bs[this.dmgI++ % bs.length];
    b.style.transition = 'none'; b.style.opacity = 1; b.style.transform = `rotate(${rel}rad)`; void b.offsetWidth; b.style.transition = 'opacity 1.2s .3s'; b.style.opacity = 0;
    const r = this.$('#hh-red'); r.classList.remove('on'); void r.offsetWidth; r.classList.add('on');
  }
  hp(v, max, packs){
    const k = Math.max(0, v/max);
    const key = Math.round(v) + ':' + packs;
    if(key === this.shown.hp) return; this.shown.hp = key;
    const h = this.$('#hh-hp');
    h.querySelector('.bar i').style.width = (k*100) + '%'; h.querySelector('.bar u').style.width = (k*100) + '%';
    h.querySelector('.n').textContent = Math.max(0, Math.round(v));
    h.classList.toggle('low', k < 0.3);
    h.querySelector('.packs').innerHTML = packs ? '<span></span>'.repeat(packs) + (this.C.input.touch ? 'HEAL' : '[G] cold pack') : '';
    this.$('#hh-frost').style.opacity = k < 0.45 ? (0.45 - k)/0.45*0.9 : 0;
  }
  ammo(A){
    const el = this.$('#hh-ammo');
    if(!A || !A.cur || !A.drawn){ if(this.shown.ammo !== 'none'){ this.shown.ammo = 'none'; el.style.opacity = A && A.order.length ? 0.6 : 0; el.querySelector('.nm').textContent = A && A.order.length ? 'HOLSTERED' : ''; el.querySelector('.kd').textContent = A && A.order.length ? (this.C.input.touch ? 'SWAP to draw' : '1 2 3 4 to draw') : ''; el.querySelector('.ct').innerHTML = ''; el.querySelector('.slots').innerHTML = ''; } return; }
    const W = WEAPONS[A.cur], a = A.ammo[A.cur];
    const key = A.cur + ':' + Math.ceil(a.mag) + ':' + a.reserve + ':' + A.order.join(',') + ':' + A.state;
    if(key === this.shown.ammo) return; this.shown.ammo = key;
    el.style.opacity = 1;
    el.querySelector('.nm').textContent = W.name; el.querySelector('.kd').textContent = A.state === 'reload' ? 'RELOADING' : W.kind.toUpperCase();
    const ct = el.querySelector('.ct');
    if(W.stream){ ct.innerHTML = `<div class="gauge"><i style="width:${a.mag/W.mag*100}%"></i></div>`; ct.classList.remove('low'); }
    else { ct.innerHTML = `${Math.ceil(a.mag)} <small>/ ${a.reserve}</small>`; ct.classList.toggle('low', a.mag <= Math.ceil(W.mag*0.25)); }
    el.querySelector('.slots').innerHTML = A.order.map(k=>`<b class="${k === A.cur ? 'on' : ''}">${WEAPONS[k].slot} ${WEAPONS[k].name.split(' ').pop()}</b>`).join('');
  }
  objectives(list, title){
    const key = (title || '') + JSON.stringify(list);
    if(key === this.objKey) return;
    const old = (this.objList || []).map(o=>o.t);
    this.objKey = key; this.objList = list;
    const el = this.$('#hh-obj');
    el.innerHTML = (title ? `<h4>${esc(title)}</h4>` : '') + list.map(o=>`<div class="${o.done ? 'done' : ''} ${o.opt ? 'opt' : ''} ${old.indexOf(o.t) < 0 ? 'new' : ''}">${esc(o.t)}</div>`).join('');
  }
  fear(v, on){
    const f = this.$('#hh-fear'); f.style.opacity = on ? 1 : 0; if(!on) return;
    const k = Math.round(v);
    if(k === this.shown.fear) return; this.shown.fear = k;
    f.querySelector('.bar i').style.width = Math.max(0, Math.min(100, v)) + '%';
    f.classList.toggle('brave', v < 25);
    f.querySelector('.lbl').textContent = v < 25 ? 'THEY\'RE GETTING BRAVE' : v < 55 ? 'THE ROOM · NERVOUS' : 'THE ROOM · TERRIFIED';
  }
  bag(v, weight, stars, timer){
    const key = Math.round(v) + ':' + weight + ':' + stars + ':' + timer;
    if(key === this.shown.bag) return; this.shown.bag = key;
    const b = this.$('#hh-bag');
    b.style.opacity = v > 0 || stars || timer ? 1 : 0;
    b.querySelector('.v').textContent = fmt(v);
    b.querySelector('.w').textContent = weight || '';
    b.querySelector('.stars').innerHTML = stars ? '★'.repeat(stars) + '<s>' + '★'.repeat(Math.max(0, 5 - stars)) + '</s>' : '';
    b.querySelector('.timer').textContent = timer || '';
  }
  boss(o){
    const b = this.$('#hh-boss');
    if(!o){ b.classList.remove('on'); return; }
    b.classList.add('on');
    b.querySelector('.nm').textContent = o.name; b.querySelector('.sub').textContent = o.sub || '';
    b.querySelector('.bar i').style.width = Math.max(0, o.hp/o.max*100) + '%';
    b.querySelector('.ar').style.width = Math.max(0, (o.armor || 0)*100) + '%';
    b.querySelector('.pips').innerHTML = [0, 1, 2].map(i=>`<b class="${i < o.phase ? 'on' : ''}"></b>`).join('');
  }
  letterbox(on){ this.$('#hh-lb').classList.toggle('on', !!on); }
  big(title, sub, cls, ms){
    const b = this.$('#hh-big'); b.className = cls || ''; b.querySelector('h1').textContent = title; b.querySelector('p').textContent = sub || '';
    void b.offsetWidth; b.classList.add('on'); clearTimeout(this._bt); this._bt = setTimeout(()=>b.classList.remove('on'), ms || 2600);
  }
  wire(text){ const w = this.$('#hh-wire'); if(!text){ w.classList.remove('on'); return; } if(text !== this.wireTxt){ this.wireTxt = text; w.querySelector('span').textContent = text; } w.classList.add('on'); }
  choice(opts){
    const el = this.$('#hh-choice');
    return new Promise(res=>{
      this.C.input.quietUnlock();
      el.innerHTML = opts.map((o, i)=>`<button data-i="${i}"><b>${i + 1}</b>${esc(o)}</button>`).join('');
      el.classList.add('on');
      const done = i=>{ el.classList.remove('on'); el.innerHTML = ''; this.C.bus.off('key', kh); if(!this.C.input.touch) this.C.input.lock(); res(i); };
      el.querySelectorAll('button').forEach(b=>b.onclick = ()=>{ this.C.audio.click(); done(+b.dataset.i); });
      const kh = e=>{ const m = /^Digit(\d)$/.exec(e.code); if(m){ const i = +m[1] - 1; if(i >= 0 && i < opts.length) done(i); } };
      this.C.bus.on('key', kh);
    });
  }
  card(html, buttons){
    const c = this.$('#hh-card');
    if(!html){ c.classList.remove('on'); return Promise.resolve(); }
    this.C.input.quietUnlock();
    c.querySelector('.in').innerHTML = html + '<div>' + (buttons || []).map((b, i)=>`<button data-i="${i}" class="${b.gold ? 'gold' : ''}">${esc(b.t)}</button>`).join('') + '</div>';
    c.classList.add('on');
    return new Promise(res=>{ c.querySelectorAll('button').forEach(b=>b.onclick = ()=>{ this.C.audio.click(); c.classList.remove('on'); res(+b.dataset.i); }); });
  }
  duffel(html){
    const d = this.$('#hh-duffel');
    if(!html){ d.classList.remove('on'); return Promise.resolve(); }
    this.C.input.quietUnlock();
    d.innerHTML = `<div class="in">${html}</div>`; d.classList.add('on');
    return new Promise(res=>{ d.querySelector('[data-go]').onclick = ()=>{ this.C.audio.click(); d.classList.remove('on'); if(!this.C.input.touch) this.C.input.lock(); res(); }; });
  }
  dispose(){ this.el.remove(); }
}
export { fmt, esc };
