/* ============================================================
   FRIDGE PALACE HEIST: heat mode
   after the story, a payphone rings where clement used to stand.
   pick a crew member (each one changes the run, each one takes a
   cut, some of them turn on you), and do it again. every run adds
   heat: more guards, better gear, faster swat, bigger vault.
   heat cools off by one star per real day.
============================================================ */
import * as THREE from '../lib/three.module.min.js';
import { Clement } from './clement.js';
import { canvas, tex } from '../world/textures.js';
import { esc, fmt } from './heist-hud.js';

const R = (a, b)=>a + Math.random()*(b - a);
const pick = a=>a[(Math.random()*a.length)|0];

export const CREW = [
  { id:'doc', name:'DOC FROST', color:'#e8e8ea', eye:'#7ff3ff', style:'smart', perk:'medic: you start with 3 cold packs', cut:0.4, betray:0.1, acc:['bowtie'], line:'i\'ve stitched up more freezers than you\'ve had hot dinners.' },
  { id:'sub', name:'BIG SUB-ZERO', color:'#cfd8dc', eye:'#5dff9c', style:'tall', perk:'muscle: +40 coolant', cut:0.5, betray:0.15, acc:['chain'], line:'i don\'t do quiet. i do big.' },
  { id:'kid', name:'THE KID', color:'#ff8a3d', eye:'#ffd56a', style:'mini', perk:'hands: the drill runs 25% faster', cut:0.35, betray:0.2, acc:['beanie'], line:'i\'ve watched like a hundred heist movies. i\'m basically a professional.' },
  { id:'viv', name:'VIVIENNE CHILL', color:'#c060ff', eye:'#ff7ad0', style:'french', perk:'face: the room stays scared twice as long', cut:0.45, betray:0.2, acc:['neon'], line:'they\'ll be too busy looking at me to look at you.' },
  { id:'len', name:'LOOSE LENNY', color:'#8a4b22', eye:'#c8ff40', style:'retro', perk:'cheap: only takes a 25% cut', cut:0.25, betray:0.45, acc:['rust'], line:'trust me. everybody trusts me. it\'s my thing.' }
];
const BETRAY = ['funny thing about crews. there\'s always one too many.', 'sorry, boss. somebody offered me the whole bag.', 'clement sends his regards. kidding. clement\'s dead. this is all me.', 'you really should\'ve checked my references.'];

export class Heat {
  constructor(C, H){
    this.C = C; this.H = H;
    const S = C.save.d.heist;
    /* cool off: one star per real day */
    if(S.heat > 0 && S.heatAt){ const days = Math.floor((Date.now() - S.heatAt)/86400000); if(days > 0){ S.heat = Math.max(0, S.heat - days); S.heatAt = Date.now(); C.save.write(); } }
    this.level = Math.min(5, (S.heat || 0) + 1);
    const st = H.stage;
    this.open = st.n === 0 || st.n >= 3;
    this.buildPhone();
    this.ringT = R(8, 20); this.ringing = false;
  }
  buildPhone(){
    const C = this.C, S = C.scene;
    const g = new THREE.Group(); g.position.set(-29.8, 0, 10.7); g.rotation.y = Math.PI/2; S.add(g);
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.6, 0.14), new THREE.MeshStandardMaterial({ color:0x2a3a5a, roughness:0.35, metalness:0.6 })); body.position.set(0, 1.45, 0.07); g.add(body);
    const pad = new THREE.Mesh(new THREE.PlaneGeometry(0.16, 0.2), new THREE.MeshStandardMaterial({ map:(()=>{ const c = canvas(64, 80), q = c.getContext('2d'); q.fillStyle = '#ccc'; q.fillRect(0, 0, 64, 80); q.fillStyle = '#222'; q.font = 'bold 14px monospace'; [1,2,3,4,5,6,7,8,9,'*',0,'#'].forEach((k, i)=>q.fillText(String(k), 8 + (i%3)*20, 18 + Math.floor(i/3)*18)); return tex(c); })(), roughness:0.5 })); pad.position.set(0.02, 1.4, 0.145); g.add(pad);
    const handset = new THREE.Mesh(new THREE.CapsuleGeometry(0.035, 0.22, 4, 8), new THREE.MeshStandardMaterial({ color:0x111, roughness:0.4 })); handset.position.set(-0.13, 1.5, 0.17); g.add(handset); this.handset = handset;
    const cord = new THREE.Mesh(new THREE.TorusGeometry(0.05, 0.008, 4, 16, Math.PI*3), new THREE.MeshStandardMaterial({ color:0x111 })); cord.position.set(-0.13, 1.25, 0.16); cord.rotation.x = Math.PI/2; g.add(cord);
    const sign = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.12), new THREE.MeshBasicMaterial({ map:(()=>{ const c = canvas(256, 64), q = c.getContext('2d'); q.fillStyle = '#1a3aa0'; q.fillRect(0, 0, 256, 64); q.fillStyle = '#fff'; q.font = 'bold 36px Arial'; q.textAlign = 'center'; q.fillText('PHONE', 128, 46); return tex(c); })() })); sign.position.set(0, 1.92, 0.08); g.add(sign);
    this.g = g;
    C.world.interact.push({ pos:new THREE.Vector3(-29.4, 1.45, 10.7), r:2.4, enabled:()=>this.H.state === 'idle' || this.H.state === 'armed', text:()=>this.H.state === 'armed' ? 'the line is dead. your crew is with you' : (this.ringing ? 'answer the payphone' : 'pick up the payphone'), use:()=>this.answer() });
  }
  update(dt, t){
    const C = this.C;
    if(this.H.state !== 'idle' || !this.open) { this.ringing = false; return; }
    this.ringT -= dt;
    if(this.ringT <= 0){ this.ringing = !this.ringing; this.ringT = this.ringing ? 6 : R(30, 60); }
    if(this.ringing){ this.rT = (this.rT || 0) - dt; if(this.rT <= 0){ this.rT = 2.2; const p = new THREE.Vector3(-29.6, 1.5, 10.7); for(let i=0;i<14;i++) C.audio.tone({ f:i % 2 ? 1300 : 1600, type:'square', d:0.035, g:0.03, t:i*0.045, filt:'bandpass', ff:1400, dest:C.audio.out(p, 0.3) }); } this.handset.position.y = 1.5 + Math.sin(t*60)*0.003; }
  }
  async answer(){
    const C = this.C, H = this.H, S = C.save.d.heist;
    if(this.busy || H.state !== 'idle') return;
    this.busy = true;
    try{
      this.ringing = false;
      C.save.egg('payphone');
      if(!this.open){ C.hud.say('PAYPHONE', 'a recording: "too hot right now. wait for the grand reopening."'); return; }
      C.audio.click();
      C.hh.letterbox(true);
      C.hud.say('A VOICE', S.runs > 0 ? 'you again. the palace rebuilt. the vault refilled. heat\'s at ' + this.level + ' star' + (this.level === 1 ? '' : 's') + '. you want in?' : 'you\'re the one who did the palace. they rebuilt it. they refilled the vault. i have a crew. you want in?', 5);
      await C.tweens.sleep(2.6);
      const ch = await C.hh.choice(['i\'m in.', 'hang up.']);
      if(ch === 1){ C.hud.say('A VOICE', 'your call. it\'ll ring again.', 2.5); C.hh.letterbox(false); return; }
      C.hh.letterbox(false);
      const crew = CREW.slice().sort(()=>Math.random() - 0.5).slice(0, 3);
      const pickI = await this.crewCard(crew);
      this.start(crew[pickI]);
    } finally { this.busy = false; }
  }
  crewCard(crew){
    const C = this.C;
    return new Promise(res=>{
      const d = C.hh.$('#hh-duffel');
      C.input.quietUnlock();
      d.innerHTML = `<div class="in"><h2>PICK YOUR CREW</h2><div style="opacity:.7;letter-spacing:2px;font-size:13px">heat ${'★'.repeat(this.level)}${'☆'.repeat(5 - this.level)} · more cops, better gear, a bigger vault. everyone takes a cut. not everyone stays loyal.</div>
        <div class="g">${crew.map((c, i)=>`<div class="gun" data-i="${i}" style="cursor:pointer"><b style="color:${c.color}">${esc(c.name)}</b><i>CUT ${Math.round(c.cut*100)}%</i><div class="st">${esc(c.perk)}<br><span style="opacity:.6;font-style:italic">"${esc(c.line)}"</span></div></div>`).join('')}</div><div class="keys">click a name</div></div>`;
      d.classList.add('on');
      d.querySelectorAll('[data-i]').forEach(el=>el.onclick = ()=>{ C.audio.click(); d.classList.remove('on'); if(!C.input.touch) C.input.lock(); res(+el.dataset.i); });
    });
  }
  start(c){
    const C = this.C, H = this.H;
    H.mode = 'heat'; H.heatLevel = this.level; H.crew = c; H.partnerName = c.name.toLowerCase();
    H.crewBetrays = Math.random() < c.betray;
    H.lootMul = 1 + this.level*0.3;
    C.enemies.diff = 1 + this.level*0.15;
    H.fearMul = c.id === 'viv' ? 0.5 : 1;
    if(c.id === 'doc') H.bandages = 3;
    if(c.id === 'sub'){ H.maxHp = 140; H.hp = 140; }
    if(c.id === 'kid') H.drillMul = 0.75;
    /* the vault is fuller with every star */
    C.vault.piles.forEach(p=>p.value = Math.round(p.value*(1 + this.level*0.25)));
    /* the partner, built from the same frame as clement */
    const cl = new Clement(C, { name:c.name, color:c.color, eye:c.eye, style:c.style, acc:c.acc.concat(['nametag']), coat:false, scar:false, shades:c.id === 'len', spot:{ x:-28.2, z:9.6, yaw:Math.PI/2 } });
    H.clement = cl; C.clement = cl;
    cl.say(c.line, 3);
    H.duffel().then(()=>{
      ['revolver', 'shotgun', 'smg'].forEach(k=>C.arsenal.give(k, true));
      if(C.save.d.heist.freonKept) C.arsenal.give('freon', true);
      H.state = 'armed'; H.navBuild();
      cl.setMode('follow');
      C.hh.show(true);
      H.setObj('HEAT ' + '★'.repeat(this.level), [{ t:C.input.touch ? 'press SWAP to draw. the job starts when you do' : 'draw a gun (1 2 3' + (C.arsenal.owned.freon ? ' 4' : '') + '). the job starts when you do' }, { t:c.name.toLowerCase() + ' follows you', opt:true }]);
      C.audio.heist.renderScore('tense'); C.audio.heist.renderScore('action');
    });
    /* heat-specific stage overrides */
    H.heatWaves = ()=>this.waves();
    H.stage_crewturn = async (tok, fresh)=>this.crewTurn(tok, fresh);
    const origVault = H.stage_vault.bind(H);
    H.run = ((orig)=>function(stage, fresh){ if(stage === 'betray' && this.mode === 'heat') stage = 'crewturn'; return orig.call(this, stage, fresh); })(H.run);
    const origDrill = C.vault.startDrill.bind(C.vault);
    C.vault.startDrill = (dur)=>origDrill(dur*(H.drillMul || 1));
  }
  waves(){
    const L = this.level;
    const W = [
      [0.05, [{ type:'cop', from:'front' }, { type:'cop', from:'front' }, { type:L >= 2 ? 'copShotgun' : 'cop', from:'front' }]],
      [0.2, [{ type:'guard', from:'staff' }, { type:'rusher', from:'restroomM' }, { type:'rusher', from:'restroomF' }].concat(L >= 3 ? [{ type:'swat', from:'club' }] : [])],
      [0.38, [{ type:'swat', from:'front' }, { type:'cop', from:'front' }, { type:'copShotgun', from:'front' }]],
      [0.55, [{ type:L >= 4 ? 'heavy' : 'swat', from:'front', gap:2 }, { type:'rusher', from:'club' }, { type:'cop', from:'staff' }]],
      [0.72, [{ type:'swat', from:'front' }, { type:'swat', from:'front' }, { type:'rusher', from:'restroomM' }].concat(L >= 2 ? [{ type:'copShotgun', from:'club' }] : [])],
      [0.88, [{ type:L >= 3 ? 'heavy' : 'swat', from:'front' }, { type:'cop', from:'front' }, { type:'cop', from:'club' }]]
    ];
    return W;
  }
  async crewTurn(tok, fresh){
    const C = this.C, H = this.H, cl = H.clement;
    H.state = 'boss1';
    cl.F.group.visible = true;
    if(fresh !== 'restore'){
      cl.say(pick(BETRAY), 4);
      C.hh.big('BETRAYED', H.crew.name.toLowerCase() + ' wants the whole bag', 'red', 2600);
      H.bagTaken = H.bagValue(); H.takenLoot = Object.assign({}, H.loot); Object.keys(H.loot).forEach(k=>H.loot[k] = 0); H.weight = 0;
      cl.hp = cl.maxHp = 700 + this.level*150;
    }
    cl.setMode('fight'); cl.fightAt = null; cl.vulnerable = true; cl.phase = 1; cl.armor(false);
    /* its own checkpoint name, so a retry comes back here and not to clement's fight */
    if(fresh !== 'restore') H.checkpoint('crewturn');
    C.audio.heist.score('boss'); H.vibe('boss');
    await H.until(()=>{ H.bossBar(); return cl.hp <= 0; }, tok);
    if(!H.ok(tok)) return;
    H.run('down', true);
  }
}
