/* ============================================================
   FRIDGE PALACE: input
   keyboard + mouse with pointer lock on a computer.
   on a phone: left thumb is a floating stick, right thumb looks,
   buttons for use, run and pause.
============================================================ */
export class Input {
  constructor(C, root){
    this.C = C; this.root = root;
    this.keys = {}; this.pressed = {};
    this.look = { x:0, y:0 };
    this.move = { x:0, z:0 };
    this.locked = false; this.enabled = true; this.walk = true;
    this.touch = (navigator.maxTouchPoints > 0) && matchMedia('(pointer: coarse)').matches;
    this.stick = null; this.lookTouch = null; this.runToggle = false;
    this.typed = '';
    this._kd = e=>this.keydown(e); this._ku = e=>this.keyup(e);
    this._mm = e=>this.mousemove(e); this._plc = ()=>this.plchange();
    window.addEventListener('keydown', this._kd, true);
    window.addEventListener('keyup', this._ku, true);
    document.addEventListener('mousemove', this._mm);
    document.addEventListener('pointerlockchange', this._plc);
    this.canvasClick = ()=>{ if(this.walk && this.enabled && !this.touch) this.lock(); };
    C.engine.canvas.addEventListener('click', this.canvasClick);
    if(this.touch) this.buildTouch();
  }
  lock(){ try{ const p = this.C.engine.canvas.requestPointerLock({ unadjustedMovement:true }); if(p && p.catch) p.catch(()=>{ try{ this.C.engine.canvas.requestPointerLock(); }catch(e){} }); }catch(e){ try{ this.C.engine.canvas.requestPointerLock(); }catch(e2){} } }
  unlock(){ if(document.pointerLockElement) document.exitPointerLock(); }
  plchange(){
    const was = this.locked;
    this.locked = document.pointerLockElement === this.C.engine.canvas;
    /* esc while walking drops the lock; treat it as pause */
    if(was && !this.locked && this.walk && this.enabled && !this.C.hud.paused && !this._unlockQuiet) this.C.hud.pause(true);
    this._unlockQuiet = false;
  }
  quietUnlock(){ this._unlockQuiet = true; this.unlock(); }
  keydown(e){
    if(!this.C.open) return;
    const t = e.target, typing = t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT');
    const k = e.code;
    if(k === 'Escape'){ e.preventDefault(); this.C.onEscape(); return; }
    if(typing) return;
    if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Tab'].indexOf(k) >= 0) e.preventDefault();
    if(!this.keys[k]) this.pressed[k] = true;
    this.keys[k] = true;
    if(e.key && e.key.length === 1){ this.typed = (this.typed + e.key.toLowerCase()).slice(-24); }
    this.C.bus.emit('key', e);
  }
  keyup(e){ this.keys[e.code] = false; }
  mousemove(e){
    if(!this.locked || !this.walk || !this.enabled) return;
    const s = 0.0022*this.C.save.settings.sens;
    this.look.x += e.movementX*s;
    this.look.y += e.movementY*s*(this.C.save.settings.invertY ? -1 : 1);
  }
  was(code){ if(this.pressed[code]){ this.pressed[code] = false; return true; } return false; }
  endFrame(){ this.pressed = {}; this.look.x = 0; this.look.y = 0; }
  sample(){
    let x = 0, z = 0;
    if(this.enabled && this.walk){
      if(this.keys.KeyW || this.keys.ArrowUp) z -= 1;
      if(this.keys.KeyS || this.keys.ArrowDown) z += 1;
      if(this.keys.KeyA || this.keys.ArrowLeft) x -= 1;
      if(this.keys.KeyD || this.keys.ArrowRight) x += 1;
      if(this.stick){ x += this.stick.x; z += this.stick.y; }
    }
    const l = Math.hypot(x, z); if(l > 1){ x /= l; z /= l; }
    this.move.x = x; this.move.z = z;
    this.running = !!(this.keys.ShiftLeft || this.keys.ShiftRight || (this.stick && this.stick.mag > 0.92));
    return this.move;
  }
  /* ---------- phone ---------- */
  buildTouch(){
    const r = this.root;
    const ui = document.createElement('div'); ui.id = 'fp-touch';
    ui.innerHTML = `<div id="fp-stickzone"></div><div id="fp-lookzone"></div>
      <div id="fp-stick"><div id="fp-knob"></div></div>
      <button id="fp-use" class="fp-tbtn">USE</button>
      <button id="fp-pausebtn" class="fp-tbtn">II</button>`;
    r.appendChild(ui);
    this.tui = ui;
    const sz = ui.querySelector('#fp-stickzone'), lz = ui.querySelector('#fp-lookzone'), st = ui.querySelector('#fp-stick'), kn = ui.querySelector('#fp-knob');
    const R = 56;
    sz.addEventListener('touchstart', e=>{ e.preventDefault(); const t = e.changedTouches[0]; this.stick = { id:t.identifier, ox:t.clientX, oy:t.clientY, x:0, y:0, mag:0 }; st.style.display = 'block'; st.style.left = (t.clientX - R) + 'px'; st.style.top = (t.clientY - R) + 'px'; kn.style.transform = 'translate(0,0)'; }, { passive:false });
    const mvStick = e=>{ if(!this.stick) return; for(const t of e.changedTouches){ if(t.identifier !== this.stick.id) continue; let dx = t.clientX - this.stick.ox, dy = t.clientY - this.stick.oy; const m = Math.hypot(dx, dy); if(m > R){ dx *= R/m; dy *= R/m; } this.stick.x = dx/R; this.stick.y = dy/R; this.stick.mag = Math.min(1, m/R); kn.style.transform = `translate(${dx}px,${dy}px)`; st.classList.toggle('run', this.stick.mag > 0.92); } };
    const endStick = e=>{ if(!this.stick) return; for(const t of e.changedTouches){ if(t.identifier === this.stick.id){ this.stick = null; st.style.display = 'none'; } } };
    sz.addEventListener('touchmove', e=>{ e.preventDefault(); mvStick(e); }, { passive:false });
    sz.addEventListener('touchend', endStick); sz.addEventListener('touchcancel', endStick);
    lz.addEventListener('touchstart', e=>{ e.preventDefault(); const t = e.changedTouches[0]; this.lookTouch = { id:t.identifier, x:t.clientX, y:t.clientY, t0:performance.now(), moved:0 }; }, { passive:false });
    lz.addEventListener('touchmove', e=>{ e.preventDefault(); if(!this.lookTouch) return; for(const t of e.changedTouches){ if(t.identifier !== this.lookTouch.id) continue; const dx = t.clientX - this.lookTouch.x, dy = t.clientY - this.lookTouch.y; this.lookTouch.x = t.clientX; this.lookTouch.y = t.clientY; this.lookTouch.moved += Math.abs(dx) + Math.abs(dy); const s = 0.0055*this.C.save.settings.sens; this.look.x += dx*s; this.look.y += dy*s*(this.C.save.settings.invertY ? -1 : 1); } }, { passive:false });
    const endLook = e=>{ if(!this.lookTouch) return; for(const t of e.changedTouches){ if(t.identifier === this.lookTouch.id){ if(this.lookTouch.moved < 8 && performance.now() - this.lookTouch.t0 < 250) this.pressed.KeyE = true; this.lookTouch = null; } } };
    lz.addEventListener('touchend', endLook); lz.addEventListener('touchcancel', endLook);
    ui.querySelector('#fp-use').addEventListener('touchstart', e=>{ e.preventDefault(); this.pressed.KeyE = true; }, { passive:false });
    ui.querySelector('#fp-pausebtn').addEventListener('touchstart', e=>{ e.preventDefault(); this.C.hud.pause(true); }, { passive:false });
  }
  setWalk(on){
    this.walk = on;
    if(this.tui) this.tui.style.display = on ? '' : 'none';
    if(!on){ this.keys = {}; this.stick = null; this.lookTouch = null; this.quietUnlock(); }
  }
  setUseLabel(t){ if(!this.tui) return; const b = this.tui.querySelector('#fp-use'); b.textContent = t || 'USE'; b.classList.toggle('on', !!t); }
  dispose(){
    window.removeEventListener('keydown', this._kd, true);
    window.removeEventListener('keyup', this._ku, true);
    document.removeEventListener('mousemove', this._mm);
    document.removeEventListener('pointerlockchange', this._plc);
    this.unlock();
  }
}
