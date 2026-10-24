/* ============================================================
   FRIDGE PALACE: what the guests say
   lines depend on who they are, what you've been doing, what's
   happening upstairs, and what you know about the basement.
============================================================ */
import { pick } from '../core/util.js';

const FIRST = ['Frosty', 'Chill', 'Icy', 'Coldie', 'Freezy', 'Kelvin', 'Arctic', 'Glacier', 'Brr', 'Polar', 'Snowy', 'Crispin', 'Humm', 'Gasket', 'Coily', 'Defrost', 'Sub', 'Cube', 'Butter', 'Drawer', 'Milky', 'Tupper', 'Freon', 'Compressa', 'Magnet', 'Seal', 'Vent', 'Dial', 'Shelf', 'Crisper'];
const LAST = ['McFreeze', 'Coldwell', 'Whirlton', 'Frigidson', 'Kenmoore', 'Hotpoint', 'Iceberg', 'Chillman', 'Frostington', 'Kelvinator', 'Snowden', 'Polaris', 'Glacierre', 'Humbert', 'von Kühl', 'Zero', 'Blizzard', 'Coolidge', 'Freezewell', 'Fridgerton'];
export function nameFor(look){ const a = look.acc || []; let n = pick(FIRST) + ' ' + pick(LAST); if(a.includes('crown')) n = 'Lord ' + n.split(' ')[1]; if(a.includes('cowboy')) n = n.split(' ')[0] + ' "the Kid" ' + n.split(' ')[1]; if(a.includes('tophat')) n = 'Mr. ' + n.split(' ')[1]; return n.toUpperCase(); }

const vm = ()=>{ try{ return window.VENDOR ? VENDOR.loadMem() : {}; }catch(e){ return {}; } };
const saw = keys=>{ try{ return VENDOR.sawAny(keys); }catch(e){ return false; } };
const fish = ()=>{ try{ return JSON.parse(localStorage.getItem('fridgefish_v1') || 'null'); }catch(e){ return null; } };
const mkt = ()=>{ try{ return window.MKT && MKT.state() ? MKT : null; }catch(e){ return null; } };

export const LINES = {
  personal:{
    gambler:["i'm one spin away. i've been one spin away since tuesday.", "the trick is to keep playing until you win, then keep playing.", "cold hard cash paid me forty once. i've given it four thousand since. it owes me.", "i don't have a problem. i have a system. the system has a problem."],
    tourist:["first time here! is the aquarium real? are the fish real? am i real?", "my cousin told me the podium fridge is solid gold. i licked it. it's gold.", "i came for a convention. there's no convention. i'm staying anyway.", "do you know where the buffet is? there's no buffet? that's illegal."],
    old:["back in my day a fridge was a box with ice in it. we were happy. we were damp.", "i saw the grand opening. they cut a ribbon with a freezer door.", "the band used to be better. the band used to be a guy with a harmonica.", "i've been coming here forty years. i've never won. i've never had more fun."],
    rich:["i bought the club membership just for the couches. the couches are adequate.", "i don't gamble. i invest in entertainment with a negative return.", "my chips are in a separate chip account. it's a chip trust.", "the high limit table is in the club. you wouldn't like it. i don't like it either."],
    nervous:["is it me or is the pit boss staring? he's staring. he's always staring.", "i saw a fridge in the back hallway that wasn't staff. it didn't have a face screen. it had a face.", "do you hear humming? not the band. under the band.", "they say if you win too much they take you to the back room. i've never won. i'm safe."],
    philosopher:["what is a casino but a fridge for money. it keeps it cold. it never gives it back.", "the wheel goes around. we go around. the chips go around. only the house stands still.", "if a fridge wins in a casino and nobody cheers, did it win? yes. it won. i checked.", "every slot machine is a tiny little god that hates you specifically."],
    hustler:["psst. you want to buy a chip? it's a regular chip. it's full price. i just like selling things.", "i know a guy who knows the staff door code. it's four numbers. that's all he knows.", "the bartender can make a drink that isn't on the menu. you have to have been somewhere first.", "you didn't hear it from me, but the lucky wheel is luckier in the morning. you didn't hear it from anyone. it isn't true."],
    sweet:["you look like you're having a good night. i hope you are.", "i'm not good at blackjack but i love the little cards.", "if you win big, tell me. i like being happy for people.", "the fish in the tank wave at me. i wave back. we have a thing."]
  },
  pick(C, n){
    const s = C.save, chips = s.chips, st = s.d.stats, m = vm();
    const opts = [];
    const add = (w, text, mood)=>opts.push({ w, text, mood });
    LINES.personal[n.personality].forEach(t=>add(3, t));
    if(chips === 0) add(4, "you're holding zero chips. that's either very sad or very zen.", 'sad');
    if(chips > 50000) add(5, "you're carrying " + C.fmt(chips) + " chips. walk carefully. the carpet is slippery with envy.", 'money');
    if(st.biggest > 5000) add(4, "people are talking about your " + C.fmt(st.biggest) + " hit. i'm people. i'm talking.", 'money');
    if(st.jackpots > 0) add(6, "you're the one who hit the progressive! can i touch your handle? for luck. not weird.", 'love');
    if(s.d.blackouts > 0) add(4, "weren't you asleep on the bench earlier? the doorman tucked you in. it was sweet.", 'laugh');
    if(C.drunk > 0.6) add(6, "you're wobbling. it's fine. the floor is also wobbling. it's a fridge thing.", 'laugh');
    if(s.d.member) add(2, "club member, huh? the couches in there are made of other couches.", 'happy');
    if(s.d.podium) add(5, "you won the podium fridge? the podium fridge? the one on the podium?", 'shock');
    /* after the robbery, it's all anyone talks about */
    const H = s.d.heist || {}, A = C.heistAftermath || { n:0 };
    if(A.n === 1){ add(9, pick(["were you here the other night? there was a robbery. i hid in a slot machine. well. behind one.", "they say it was two fridges. one of them was rusty. the other one had a really nice gun.", "somebody shot the aquarium. the fish are fine. the fish are traumatized.", "the cops asked me questions. i said 'i'm a fridge'. that was the end of it."]), 'shock'); }
    if(A.n === 2) add(8, pick(["pardon their dust. they keep saying that. pardon THEIR dust.", "doug has a black eye. doug won't talk about the black eye.", "the band is one guy now. he's doing his best."]), 'sad');
    if(A.n >= 3 && H.robbedVisit) add(6, pick(["new security everywhere. it's like being in a fridge inside a bigger fridge.", "you hear about the robbery? of course you did. everyone did. you look like you did.", "the metal detector beeped at my grandmother. she's ninety. she's a mini fridge."]), 'neutral');
    if(H.chandelier) add(5, "somebody dropped the lobby chandelier on a guy. i'm not saying it was cool. it was a little cool.", 'shock');
    if(H.vendorKill) add(5, "they never found the rusty one. just a tally mark on the floor. my cousin says it's the guy from the basement. my cousin says a lot of things.", 'shock');
    if(H.clementDead && !H.vendorKill) add(4, "the rusty one in the coat? he's not coming back. i heard the other one did it. the other one is very good at things.", 'neutral');
    if((H.heat || 0) >= 3) add(5, "there's a wanted poster with a ski mask on it. it looks a little like you. haha. haha?", 'shock');
    if(s.d.eggs.counted) add(5, "i heard the pit boss walked you off the blackjack table. legend.", 'laugh');
    if(st.talked > 30) add(2, "you've talked to everybody tonight. everybody's talking about you talking to everybody.", 'happy');
    if((m.deaths || 0) >= 1) add(3, "you smell like basement. it's not a judgment. it's a smell.", 'neutral');
    if((m.deaths || 0) >= 7) add(4, "somebody's been asking about you. tall. beige. doesn't blink. said you'd know.", 'shock');
    if(m.relationship === 'together') add(5, "is it true you're seeing someone from downstairs? good for you. love is love. cold is cold.", 'love');
    if(m.unplugged) add(4, "the lights flickered here once, a while ago. right when something downstairs went quiet. weird.", 'sad');
    if(saw(['wall:hank', 'tag:26'])) add(4, "hank? yeah i knew hank. he went home. everybody says that. nobody says where.", 'neutral');
    const f = fish();
    if(f && f.total > 0) add(4, "you fish? caught " + f.total + "? the tank by the bar has a couple of yours i think.", 'happy');
    if(f && f.dex && f.dex.vendor_catfish) add(5, "you caught something that came up the drain. don't bring it in here. it stares.", 'shock');
    const M = mkt();
    if(M){ try{ const b = M.breadth(); const ch = (b.idx/b.idxPrev - 1)*100; if(ch > 1) add(4, "FRDX is up " + ch.toFixed(1) + "% today. i'm up too. emotionally.", 'happy'); if(ch < -1) add(4, "FRDX is down " + Math.abs(ch).toFixed(1) + "%. i'm drinking. it's not related. it's related.", 'sad'); const a = M.account(); if(a.positions.some(p=>p.sym === 'VNDR' && p.q > 0)) add(5, "you own VNDR? brave. that stock moves when nobody's watching.", 'shock'); }catch(e){} }
    const h = new Date().getHours();
    if(h >= 2 && h < 6) add(4, "it's " + h + " in the morning out there. not in here. in here it's always now.", 'sleepy');
    if(h === 16 && new Date().getMinutes() >= 20 && new Date().getMinutes() < 30) add(8, "it's 4:20. you feel that? the whole building feels that.", 'happy');
    let tot = opts.reduce((a, o)=>a + o.w, 0), r = Math.random()*tot;
    for(const o of opts){ r -= o.w; if(r <= 0) return o; }
    return opts[0];
  },
  ambient(C, n){ return pick(["come on, come on, come on.", "one more.", "did you see that?", "these drinks taste like ice. they're ice.", "i love this song. i don't know this song.", "where's the buffet?", "who's the fridge with all the chips?", "my lucky number is cold.", "that machine just paid. i'm moving to that machine."]); }
};
