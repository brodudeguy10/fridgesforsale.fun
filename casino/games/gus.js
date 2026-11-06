/* ============================================================
   FRIDGE PALACE: talking to gus
   a real conversation with the bartender. you pick what to say,
   he answers, and he remembers you between visits: how often you
   come by, whether you tip, what he's already told you.
   how much he likes you goes stranger → regular → friend → family.
   family drinks free, once a night.
   save: C.save.d.gus = { rep, talks, story, seen{}, tipped, usualVisit, lastVisit }
============================================================ */
import { pick } from '../core/util.js';

const TIERS = [[0, 'a stranger'], [3, 'a regular'], [6, 'a friend'], [10, 'family']];
const STORIES = [
  'i was a walk-in freezer at a steakhouse for thirty one years. you hold that much beef for that long, you learn to listen.',
  'the steakhouse closed. they were going to sell me for parts. the palace bought me whole. i owe this place. i don\'t tell it that.',
  'i was married once. doreen. chest freezer. beautiful lid. she kept everything and forgot nothing. that was the problem.',
  'people ask why the bar is a ring. it\'s so nobody is ever at the end of it. everybody here is in the middle of something.',
  'the first fish in the tank was mine. a little blue one. i named him tuesday. he\'s still in there somewhere. don\'t tap the glass.',
  'some nights, after close, i turn the lights down and polish the same glass for an hour. it\'s not about the glass.'
];
const fmt = n=>Math.round(n).toLocaleString('en-US');
const esc = s=>String(s).replace(/[&<>"]/g, c=>({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' }[c]));

export function talkGus(C, bt, ctx){
  const d = C.save.d, S = d.stats;
  const g = d.gus = Object.assign({ rep:0, talks:0, story:0, seen:{}, tipped:0, usualVisit:0, lastVisit:0 }, d.gus || {});
  const tier = ()=>{ let t = TIERS[0][1]; for(const [n, name] of TIERS) if(g.rep >= n) t = name; return t; };
  const hearts = ()=>{ const n = Math.min(10, Math.floor(g.rep)); return '♥'.repeat(Math.round(n/2)) + '♡'.repeat(5 - Math.round(n/2)); };
  const vm = (()=>{ try{ return window.VENDOR ? VENDOR.loadMem() : {}; }catch(e){ return {}; } })();
  const H = d.heist || {}, eggs = d.eggs || {};
  const ev = C.events || {};
  const net = ctx.net ? ctx.net() : 0;
  const firstEver = !g.talks;
  /* one bump in how much he likes you per visit, just for showing up */
  if(g.lastVisit !== d.visits){ g.lastVisit = d.visits; g.rep = Math.min(12, g.rep + (firstEver ? 0.5 : 1)); }
  g.talks++;
  C.save.write();

  /* ---------- what he says when you sit down ---------- */
  function greeting(){
    if(firstEver) return ['new face. i\'m gus. i pour, i listen, i don\'t judge out loud. what can i do for you?', 'happy'];
    if(C.drunk > 0.9) return ['you\'re leaning on my bar like it owes you money. let\'s talk slow.', 'sad'];
    if(C.heistAftermath && C.heistAftermath.n >= 2 && !g.seen.familiar){ g.seen.familiar = 1; return ['...you look familiar. no. no, you don\'t. what can i get you.', 'shock']; }
    if(net > 5000) return ['look at you. somebody\'s having a night. don\'t spend it all in one fridge.', 'happy'];
    if(net < -3000) return ['rough one? the house always wins. the bar always listens.', 'sad'];
    if(C.happyHour) return ['happy hour. half price drinks, full price advice.', 'happy'];
    if(ev.bigShot && ev.bigShot.name === 'THE WHALE') return ['the whale is in. he tipped me with a chip bigger than my coaster. what do you need?', 'money'];
    const t = tier();
    if(t === 'family') return [pick(['there they are. the usual seat\'s still warm.', 'family. sit. tell me everything. or nothing. both are fine.']), 'love'];
    if(t === 'a friend') return [pick(['my favorite customer. don\'t tell the others. there are no others.', 'good to see you. really.']), 'happy'];
    if(t === 'a regular') return [pick(['back again. the bar missed you. the bar is a ring of marble, but still.', 'regular. good. what\'s on your mind?']), 'happy'];
    return [pick(['what can i do for you?', 'talk or drink. or both. i do both.', 'evening. or morning. casinos don\'t have clocks.']), 'neutral'];
  }
  /* ---------- the things he knows about ---------- */
  const TOPICS = [
    { k:'lou', t:'lucky lou', on:()=>!!C.games.hilo, a:['lou sweats more than my ice bin. honest dealer though. he prints the odds right on the buttons because his mother made him promise.'] },
    { k:'nicky', t:'the cup guy by the restrooms', on:()=>!!C.games.cups, a:['nicky. the palace says he doesn\'t work here. the palace also lets him stand there. figure that one out.'],
      more:[{ t:'can you actually beat him?', a:'if you can follow the cups, sure. and on the big bets, don\'t watch his hands. hands are for show. watch his eyes.' }] },
    { k:'scratch', t:'the scratch machine', on:()=>!!C.games.scratch, a:['the scratch-o-matic. it prints the odds on every ticket and people still act surprised.'],
      more:[{ t:'ever win anything?', a:'once. forty chips. i framed the ticket. it\'s in the back. but that machine has a soft side. i\'ve seen it feel sorry for a guy. he had to lose a lot first.' }] },
    { k:'doug', t:'doug at the cage', on:()=>true, a:['doug counts everything twice. once for the palace, once for doug. good guy. nervous. he jumps when the cage door creaks.'] },
    { k:'pitboss', t:'the pit boss', on:()=>true, a:['the pit boss counts the people who count cards. he has a list. i\'m on it. i don\'t even play.'] },
    { k:'doorman', t:'the doorman', on:()=>true, a:['he carries people to the bench by the door when they overdo it. he\'s carried me. twice. that stays between us.'] },
    { k:'whale', t:'the whale', on:()=>d.bigs && d.bigs.whale, a:['the whale? he bought a casino once and gave it to his nephew. he tips like he\'s mad at his money.'],
      more:[{ t:'how do i get him to tip me?', a:'listen. that\'s it. everybody wants something from him. nobody sits through the stories. sit through the stories.' }] },
    { k:'dolores', t:'diamond dolores', on:()=>d.bigs && d.bigs.dolores, a:['dolores bets on red and nothing else. four husbands, all major appliances. the dog is the only one she trusts.'] },
    { k:'professor', t:'the professor', on:()=>d.bigs && d.bigs.professor, a:['the professor counts cards and gets thrown out every single time. he comes back because he says the lighting helps him think.'] },
    { k:'hank', t:'hank', on:()=>eggs.hank || (()=>{ try{ return VENDOR.sawAny(['wall:hank', 'tag:26']); }catch(e){ return false; } })(), a:['hank sat right there. always the defrost. one night he went downstairs to check on something and... they told me he went home.'],
      more:[{ t:'did he go home?', a:'his coat\'s still on the hook in the back. i dust it. i don\'t know why i dust it.' }] },
    { k:'payphone', t:'the guy by the payphone', on:()=>H.story >= 1, a:['the one who hangs around the restrooms making calls? never orders. tips in cash. that\'s how you know somebody\'s planning something.'] },
    { k:'robbery', t:'the robbery', on:()=>H.story >= 2 || H.robbedVisit, a:['i hid behind the bar with the champagne. the champagne made it. i\'m prouder of that than i should be.'],
      more:[{ t:'any idea who did it?', a:'nope. no idea. none. and if i did, i\'d say the same thing, wouldn\'t i. drink?' }] },
    { k:'basement', t:'downstairs', on:()=>(vm.deaths || 0) >= 1, a:['...you\'ve been down there. i can tell. people come back up quieter.'],
      more:[{ t:'what\'s down there?', a:'i don\'t go. i make one drink for people who have, and i don\'t ask. ask for it by name. you know the name.' }] }
  ];
  /* ---------- advice that depends on what you've been up to ---------- */
  function advice(){
    const L = [];
    if(S.hiloRuns > 0 && !eggs.rantable) L.push('at lou\'s table the odds are printed right there. cash out before you get sentimental about a streak.');
    if((S.cupsPlayed || 0) > 0 && !eggs.palmed) L.push('nicky\'s hands are fast. his eyes are faster. they just don\'t lie as well.');
    if((S.scratchBought || 0) >= 5 && !eggs.pity) L.push('that scratch machine notices people who keep losing to it. i\'m not saying keep losing. i\'m saying it notices.');
    if(!eggs.hydrate) L.push('you know what nobody orders here? water. i remember who does.');
    if(C.save.chips < 100) L.push('you\'re running on fumes. the cage swaps fridges for chips. or sit here and let me talk at you for free.');
    if(C.drunk > 0.7) L.push('drink some water. the bench by the door is not as comfortable as it looks.');
    if(!eggs.whale && d.bigs && d.bigs.whale) L.push('if the whale comes back, let him talk. three stories in, he gets generous.');
    L.push('never bet what you can\'t lose. you\'re a fridge. you can always make more ice.', 'the house edge is real. the fun is also real. pick which one you came for.', 'the cheapest thing in this building is a drink at happy hour. the second cheapest is my opinion.', 'blackjack: never take insurance. i don\'t care what the dealer\'s showing. never.');
    return pick(L);
  }
  function night(){
    const L = [];
    const n = C.games.npcs ? C.games.npcs.list.length : 0;
    if(C.happyHour) L.push('happy hour. i\'m pouring twice as fast for half the money. this is my cardio.');
    if(ev.bigShot) L.push({ 'THE WHALE':'the whale is here. everybody is suddenly very nice to everybody.', 'DIAMOND DOLORES':'dolores is here. somebody tell the roulette dealer to sit up straight.', 'THE PROFESSOR':'the professor is at blackjack. the pit boss has that look. give it ten minutes.' }[ev.bigShot.name] || 'somebody important just walked in. i can tell by how the pit boss is standing.');
    if(ev.actors && ev.actors.some(a=>a.tag === 'wedding')) L.push('there\'s a wedding party in. i give it six months. the warranty is twelve.');
    if(net > 2000) L.push('you\'re up ' + fmt(net) + ' tonight, by my count. i count everything. it\'s a bartender thing.');
    else if(net < -2000) L.push('you\'re down ' + fmt(-net) + ' tonight. i\'d say it\'s not the end of the world, but i\'ve never seen the end of the world. maybe it is.');
    if(C.heistAftermath && C.heistAftermath.n === 2) L.push('they\'re still patching holes. forty something. somebody had a lot of bullets and a lot of feelings.');
    if(C.heistAftermath && C.heistAftermath.n === 4) L.push('grand reopening. free champagne for everybody. i\'m the one pouring it. it\'s not free for me.');
    L.push(n > 14 ? 'busy. ' + n + ' fridges on the floor. half of them are here for the band. the other half are here for me.' : 'quiet. i like quiet. the ice likes quiet.');
    return pick(L);
  }

  /* ---------- the conversation ---------- */
  let line = '', mood = 'neutral', opts = [], body = null, typer = 0, done = false;
  function show(text, m, o){
    line = text; mood = m || 'neutral'; opts = o;
    bt.face.set(mood, 3); bt.face.say(Math.min(5, text.length*0.045));
    render();
  }
  function root(text, m){
    const t = text ? [text, m] : greeting();
    const o = [
      { t:'how\'s the night going?', go:()=>show(night(), 'neutral', back()) },
      { t:'tell me about yourself', go:story },
      { t:'got any advice?', go:()=>show(advice(), 'neutral', back()) },
      { t:'heard anything good?', go:()=>show(pick(ctx.small || ['nothing worth repeating. which means i\'ll repeat it later.']), 'smug', back([{ t:'what else?', go:()=>show(pick(ctx.small || ['that\'s it.']), 'neutral', back()) }])) },
      { t:'what do you know about...', go:topics },
      { t:'let me leave you a tip', go:tip }
    ];
    if(g.rep >= 10 && g.usualVisit !== d.visits) o.splice(4, 0, { t:'the usual, gus', go:usual });
    o.push({ t:'see you around', go:bye });
    show(t[0], t[1], o);
  }
  const back = (extra)=>[].concat(extra || [], [{ t:'(something else)', go:()=>root(pick(['what else?', 'go on.', 'mm-hm. what else?']), 'neutral') }, { t:'see you around', go:bye }]);
  function story(){
    if(g.story >= STORIES.length){ show('that\'s all the stories. the rest are classified. or boring. mostly boring.', 'laugh', back()); return; }
    const s = STORIES[g.story]; g.story++; C.save.write();
    show(s, g.story === 3 ? 'sad' : 'neutral', back(g.story < STORIES.length ? [{ t:'and then?', go:story }] : []));
  }
  function topics(){
    const L = TOPICS.filter(t=>{ try{ return t.on(); }catch(e){ return false; } });
    show(pick(['about who?', 'depends. about what?', 'i know a little about everybody. who?']), 'neutral', L.map(t=>({ t:t.t + (g.seen[t.k] ? '' : ' ·'), go:()=>topic(t) })).concat([{ t:'(never mind)', go:()=>root('sure.', 'neutral') }]));
  }
  function topic(t){
    g.seen[t.k] = 1; C.save.write();
    show(pick(t.a), 'neutral', back((t.more || []).map(m=>({ t:m.t, go:()=>{ g.seen[t.k + ':more'] = 1; C.save.write(); show(m.a, 'neutral', back([{ t:'(ask about someone else)', go:topics }])); } }))));
  }
  function tip(){
    const amts = [10, 50, 250, 1000];
    show(pick(['you don\'t have to. but you could.', 'a tip? for me? say more.', 'tips go in the jar. the jar is named doreen. long story.']), 'happy', amts.map(a=>({ t:fmt(a) + ' chips', off:C.save.chips < a, go:()=>giveTip(a) })).concat([{ t:'(actually, never mind)', go:()=>root('the jar understands.', 'sad') }]));
  }
  function giveTip(a){
    if(C.save.chips < a){ C.audio.error(); return; }
    C.save.take(a); g.tipped += a; C.audio.chip(ctx.pos, a >= 250 ? 3 : 1);
    const before = g.rep;
    g.rep = Math.min(12, g.rep + (a >= 1000 ? 3 : a >= 250 ? 2 : a >= 50 ? 1 : 0.3));
    C.save.write();
    let say = a >= 1000 ? 'a thousand. ...i\'m going to pretend i\'m not touched. i\'m touched.' : a >= 250 ? 'that\'s a real tip. doreen the jar thanks you.' : a >= 50 ? 'appreciated. truly.' : 'ten chips. it\'s the thought. the thought was ten chips.';
    /* a big tip buys a rumor about something you haven't found yet */
    if(a >= 250 && C.secrets){ const s = C.secrets().list.filter(x=>!x.got); if(s.length){ const h = pick(s); say += ' here\'s something for it. word around the bar: ' + h.hint; } }
    if(before < 10 && g.rep >= 10){ say += ' and you know what? you\'re family now. family drinks free. once a night. don\'t push it.'; if(C.save.egg('regular')) C.hud.toast('secret: family', 'gold'); }
    show(say, a >= 250 ? 'love' : 'happy', back());
  }
  function usual(){
    g.usualVisit = d.visits; C.save.write();
    done = true; close();
    ctx.serve && ctx.serve({ id:'usual', name:'The Usual', price:0, buzz:0.2, line:'the usual. i don\'t even know what it is. i make it different every time and you never notice. on the house, family.' });
  }
  function bye(){ bt.face.set('happy', 1.5); bt.face.say(0.8); C.hud.say('GUS', pick(['take care of yourself.', 'see you around.', 'don\'t be a stranger. well. you\'re ' + tier() + '. don\'t be less than that.', 'go win something. or don\'t. i\'ll be here.']), 2.5); close(); }
  function close(){ done = true; C.hud.modal(null); }

  /* ---------- drawing it ---------- */
  function render(){
    clearInterval(typer);
    body = C.hud.modal({ title:'GUS', cls:'fp-gusm', onClose:cleanup, html:`
      <div class="fp-gus">
        <div class="g-rep">bartender · since the ice age · gus thinks you're <b>${tier()}</b> <span>${hearts()}</span></div>
        <p class="g-line"></p>
        <div class="g-opts">${opts.map((o, i)=>`<button data-o="${i}" ${o.off ? 'disabled' : ''}><kbd>${i + 1}</kbd>${esc(o.t)}</button>`).join('')}</div>
      </div>` });
    const el = body.querySelector('.g-line'); let n = 0;
    const full = '"' + line + '"';
    typer = setInterval(()=>{ n += 2; el.textContent = full.slice(0, n); if(n >= full.length) clearInterval(typer); }, 16);
    el.onclick = ()=>{ clearInterval(typer); el.textContent = full; };
    body.querySelectorAll('[data-o]').forEach(b=>b.onclick = ()=>pickOpt(+b.dataset.o));
  }
  function pickOpt(i){ const o = opts[i]; if(!o || o.off) return; C.audio.click(); o.go(); }
  const onKey = e=>{ if(!C.hud.modalOpen) return; const k = e.key; if(/^[1-9]$/.test(k)){ pickOpt(+k - 1); e.preventDefault(); } };
  function cleanup(){ clearInterval(typer); document.removeEventListener('keydown', onKey, true); ctx.onClose && ctx.onClose(); }
  document.addEventListener('keydown', onKey, true);
  C.input.quietUnlock();
  root();
}
