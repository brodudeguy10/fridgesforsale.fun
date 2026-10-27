/* ============================================================
   FRIDGE PALACE: everything drawn on top of the 3D
============================================================ */
const esc = s=>String(s).replace(/[&<>"]/g, c=>({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' }[c]));
export const fmt = n=>Math.round(n).toLocaleString('en-US');

export class Hud {
  constructor(C, root){
    this.C = C; this.root = root; this.paused = false;
    const el = document.createElement('div'); el.id = 'fp-hud';
    el.innerHTML = `
      <div id="fp-top">
        <div class="fp-wallet"><span class="fp-chipicon"></span><b id="fp-chips">0</b><small>chips</small></div>
        <div class="fp-wallet2"><span id="fp-fridges">0</span> fridges upstairs<span id="fp-member"></span></div>
        <div class="fp-clock" title="casinos don't have clocks">NO CLOCKS</div>
      </div>
      <div id="fp-cross"></div>
      <div id="fp-prompt"></div>
      <div id="fp-toasts"></div>
      <div id="fp-say"><b></b><span></span></div>
      <div id="fp-big"></div>
      <div id="fp-panel"></div>
      <div id="fp-modal"></div>
      <div id="fp-pause"></div>
      <div id="fp-hint"></div>
      <div id="fp-fade"></div>`;
    root.appendChild(el);
    this.el = el;
    /* plain #id lookups are cached (they run every frame); anything fancier is looked up fresh */
    const cache = {}; this.$ = s=>/^#[\w-]+$/.test(s) ? ((cache[s] && cache[s].isConnected) ? cache[s] : (cache[s] = el.querySelector(s))) : el.querySelector(s);
    this.chipsShown = C.save.chips;
    C.save.onChange(()=>this.wallet());
    this.wallet(true);
    this.sayT = 0;
    this.$('#fp-modal').addEventListener('click', e=>{ if(e.target.id === 'fp-modal' && this.modalCloseable) this.modal(null); });
  }
  wallet(snap){
    const target = this.C.save.chips;
    if(snap){ this.chipsShown = target; this.$('#fp-chips').textContent = fmt(target); }
    this.$('#fp-fridges').textContent = fmt(this.C.save.fridges());
    this.$('#fp-member').innerHTML = this.C.save.d.member ? ' · <i>PALACE CLUB</i>' : '';
    if(target > this.chipsShown) this.$('#fp-chips').parentElement.classList.add('up');
    else if(target < this.chipsShown) this.$('#fp-chips').parentElement.classList.add('down');
  }
  update(dt){
    const target = this.C.save.chips;
    if(this.chipsShown !== target){
      const d = target - this.chipsShown;
      this.chipsShown += Math.abs(d) < 1 ? d : d*Math.min(1, dt*6) + Math.sign(d);
      if(Math.sign(target - this.chipsShown) !== Math.sign(d)) this.chipsShown = target;
      this.$('#fp-chips').textContent = fmt(this.chipsShown);
    } else { const w = this.$('#fp-chips').parentElement; w.classList.remove('up', 'down'); }
    if(this.sayT > 0){ this.sayT -= dt; if(this.sayT <= 0) this.$('#fp-say').classList.remove('on'); }
    if(this.typing){ const T = this.typing; T.i += dt*48; const n = Math.min(T.text.length, Math.floor(T.i)); this.$('#fp-say span').textContent = T.text.slice(0, n); if(n >= T.text.length) this.typing = null; }
  }
  cross(on){ this.$('#fp-cross').classList.toggle('on', !!on); }
  showCross(v){ this.$('#fp-cross').style.display = v ? '' : 'none'; }
  prompt(text){
    const p = this.$('#fp-prompt');
    if(!text){ p.classList.remove('on'); this.C.input.setUseLabel(null); return; }
    const key = this.C.input.touch ? 'TAP' : 'E';
    p.innerHTML = `<kbd>${key}</kbd> ${esc(text)}`; p.classList.add('on');
    this.C.input.setUseLabel(text.split(' ')[0].toUpperCase().slice(0, 8));
  }
  toast(text, kind){
    const d = document.createElement('div'); d.className = 'fp-toast ' + (kind || ''); d.textContent = text;
    const box = this.$('#fp-toasts'); box.appendChild(d); while(box.childElementCount > 4) box.firstChild.remove();
    setTimeout(()=>d.classList.add('out'), 3200); setTimeout(()=>d.remove(), 3800);
  }
  say(name, text, dur){
    const s = this.$('#fp-say'); s.querySelector('b').textContent = name ? name + ':' : ''; s.querySelector('span').textContent = '';
    this.typing = { text, i:0 }; s.classList.add('on'); this.sayT = dur || Math.max(2.8, text.length*0.06 + 1.2);
  }
  big(text, color, ms){
    const b = this.$('#fp-big'); b.textContent = text; b.style.color = color || '#ffd56a';
    b.classList.remove('on'); void b.offsetWidth; b.classList.add('on');
    clearTimeout(this._bigT); this._bigT = setTimeout(()=>b.classList.remove('on'), ms || 1800);
  }
  /* bottom drawer for game controls */
  panel(html, cls){
    const p = this.$('#fp-panel');
    if(html === null){ p.className = ''; p.innerHTML = ''; return null; }
    p.className = 'on ' + (cls || ''); p.innerHTML = html; return p;
  }
  modal(opts){
    const m = this.$('#fp-modal');
    if(!opts){ m.className = ''; m.innerHTML = ''; this.modalOpen = false; if(this.onModalClose){ const f = this.onModalClose; this.onModalClose = null; f(); } return null; }
    this.modalOpen = true; this.modalCloseable = opts.closeable !== false; this.onModalClose = opts.onClose || null;
    m.className = 'on ' + (opts.cls || '');
    m.innerHTML = `<div class="fp-card">${opts.title ? `<h2>${esc(opts.title)}</h2>` : ''}<div class="fp-mbody">${opts.html || ''}</div>${opts.closeable === false ? '' : '<button class="fp-x" data-x="1">×</button>'}</div>`;
    m.querySelector('[data-x]') && (m.querySelector('[data-x]').onclick = ()=>this.modal(null));
    return m.querySelector('.fp-mbody');
  }
  hint(html, ms){ const h = this.$('#fp-hint'); h.innerHTML = html; h.classList.add('on'); clearTimeout(this._hT); this._hT = setTimeout(()=>h.classList.remove('on'), ms || 7000); }
  fade(to, ms){ const f = this.$('#fp-fade'); f.style.transition = `opacity ${ms || 600}ms`; f.style.opacity = to; return new Promise(r=>setTimeout(r, ms || 600)); }
  pause(on){
    const C = this.C;
    if(on && (this.paused || !C.open)) return;
    if(on && C.seated){ return; }
    this.paused = on;
    const p = this.$('#fp-pause');
    if(!on){ p.className = ''; p.innerHTML = ''; if(!C.input.touch) C.input.lock(); return; }
    C.input.quietUnlock();
    const s = C.save.settings, st = C.save.d.stats;
    p.className = 'on';
    p.innerHTML = `<div class="fp-card fp-pausecard">
      <h1>FRIDGE PALACE</h1><div class="fp-sub">casino & resort · est. tonight</div>
      <div class="fp-pbtns"><button data-a="resume" class="fp-gold">KEEP PLAYING</button><button data-a="photo">PHOTO MODE</button><button data-a="leave">LEAVE THE PALACE</button></div>
      <div class="fp-cols"><div><h3>THE FLOOR</h3><canvas id="fp-map" width="372" height="276" style="width:100%;border:1px solid rgba(230,182,90,.3)"></canvas></div><div><h3>SECRETS · ${C.secrets ? C.secrets().n + ' / ' + C.secrets().total : ''}</h3><div class="fp-secrets">${C.secrets ? C.secrets().list.map(s=>`<div class="${s.got ? 'got' : ''}"><b>${s.got ? esc(s.name) : '???'}</b><small>${esc(s.hint)}</small></div>`).join('') : ''}</div></div></div>
      <div class="fp-cols">
        <div><h3>SETTINGS</h3>
          <label>look speed <input type="range" min="0.3" max="2.5" step="0.05" value="${s.sens}" data-s="sens"></label>
          <label>volume <input type="range" min="0" max="1" step="0.01" value="${s.vol}" data-s="vol"></label>
          <label>house band <input type="range" min="0" max="1" step="0.01" value="${s.music}" data-s="music"></label>
          <label>graphics <select data-s="quality">${['auto','low','med','high'].map(q=>`<option ${q === s.quality ? 'selected' : ''}>${q}</option>`).join('')}</select></label>
          <label class="fp-chk"><input type="checkbox" data-s="invertY" ${s.invertY ? 'checked' : ''}> invert look</label>
          <label class="fp-chk"><input type="checkbox" data-s="bob" ${s.bob ? 'checked' : ''}> head bob</label>
        </div>
        <div><h3>YOUR NIGHT</h3>
          <table>
            <tr><td>chips</td><td>${fmt(C.save.chips)}</td></tr>
            <tr><td>wagered</td><td>${fmt(st.wagered)}</td></tr>
            <tr><td>won back</td><td>${fmt(st.won)}</td></tr>
            <tr><td>house edge on you</td><td>${st.wagered ? ((1 - st.won/st.wagered)*100).toFixed(1) + '%' : '-'}</td></tr>
            <tr><td>biggest hit</td><td>${fmt(st.biggest)}${st.biggestGame ? ' (' + esc(st.biggestGame) + ')' : ''}</td></tr>
            <tr><td>slot spins</td><td>${fmt(st.spins)}</td></tr>
            <tr><td>blackjack hands</td><td>${fmt(st.hands)}</td></tr>
            <tr><td>roulette spins</td><td>${fmt(st.rouletteSpins)}</td></tr>
            <tr><td>poker hands</td><td>${fmt(st.pokerHands)}</td></tr>
            <tr><td>races</td><td>${fmt(st.races)}</td></tr>
            <tr><td>jackpots</td><td>${fmt(st.jackpots)}</td></tr>
            <tr><td>drinks</td><td>${fmt(C.save.d.drinks)}</td></tr>
          </table>
        </div>
      </div>
      <div class="fp-keys">${C.input.touch ? 'left thumb: walk (push to the edge to run) · right thumb: look · tap or USE: interact' : 'WASD walk · shift run · mouse look · E use · esc pause'}</div>
    </div>`;
    p.querySelector('[data-a="resume"]').onclick = ()=>this.pause(false);
    p.querySelector('[data-a="photo"]').onclick = ()=>{ this.pause(false); if(C.togglePhoto) C.togglePhoto(true); };
    const mc = p.querySelector('#fp-map'); if(mc && C.drawMap) C.drawMap(mc);
    p.querySelector('[data-a="leave"]').onclick = ()=>{ this.pause(false); C.leave(); };
    p.querySelectorAll('[data-s]').forEach(inp=>{
      const k = inp.dataset.s;
      const apply = ()=>{
        const v = inp.type === 'checkbox' ? inp.checked : (inp.tagName === 'SELECT' ? inp.value : +inp.value);
        s[k] = v; C.save.write();
        if(k === 'vol') C.audio.setVol(v);
        if(k === 'music') C.audio.setMusic(v);
        if(k === 'quality') C.engine.setQuality(v);
      };
      inp.addEventListener('input', apply); inp.addEventListener('change', apply);
    });
  }
}
