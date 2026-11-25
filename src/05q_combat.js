// ---------- v7: weapons, melee combos, heli damage, smarter police, emotes ----------
Object.assign(WEAP,{bat:{he:'מחבט בייסבול',en:'Baseball Bat',rate:0.5,melee:1,dmg:20,reach:46,arc:1.3,price:80,pack:1},knife:{he:'סכין',en:'Knife',rate:0.3,melee:1,dmg:24,reach:34,arc:0.9,price:120,pack:1},
 magnum:{he:'מגנום',en:'Magnum',rate:0.65,dmg:58,spread:0.02,price:900,pack:18},sniper:{he:'רובה צלפים',en:'Sniper Rifle',rate:1.3,dmg:115,spread:0.004,price:4500,pack:12,range:1},
 molotov:{he:'בקבוקי מולוטוב',en:'Molotovs',rate:0.9,dmg:0,molo:1,price:700,pack:5},minigun:{he:'מיניגאן',en:'Minigun',rate:0.05,dmg:11,spread:0.1,price:30000,pack:400,heavy:1}});
WEAP.ray={he:'אקדח קרני חייזרים',en:'Alien Ray Gun',rate:0.3,dmg:60,spread:0.01,price:0,pack:40,noshop:1,ray:1};
Object.assign(WEAP.rocket,{he:'בזוקה',en:'Bazooka',price:20000,pack:3});
WORDER.splice(0,WORDER.length,'fist','bat','knife','pistol','magnum','smg','shotgun','rifle','sniper','flame','molotov','grenade','rocket','minigun','ray');
Object.assign(WICON,{bat:WSV('<path d="M4 15l30-7c4-1 9-1 10 1s-2 5-6 6L8 19c-2 .5-4-.5-4-2z"/>'),knife:WSV('<rect x="5" y="10" width="13" height="5" rx="2"/><path d="M18 9h6c8 0 15 2 20 4c-5 2-12 2-20 2h-6z"/>'),
 magnum:WSV('<path d="M6 6h32v4h4v3H26l-1 3h-3a4 4 0 0 1-8 0h-1l-2 8H6l2-10H6z"/><circle cx="18" cy="13" r="3.5"/>'),
 sniper:WSV('<path d="M1 11h10l3-2h18v2h15v2H32v2h-8l-2 8h-4l-1-7h-5l-2 5H8l2-6H1z"/><rect x="16" y="4" width="13" height="4" rx="2"/><rect x="21" y="8" width="2" height="2"/>'),
 molotov:WSV('<path d="M20 9h8v4c4 2 6 5 6 9v1H14v-1c0-4 2-7 6-9z"/><rect x="21" y="5" width="6" height="4"/><path d="M24 5c-3-2 0-5 2-4c0 2 3 2 1 4z"/>'),
 minigun:WSV('<rect x="2" y="7" width="16" height="11" rx="3"/><rect x="18" y="8" width="26" height="2.4"/><rect x="18" y="11.3" width="26" height="2.4"/><rect x="18" y="14.6" width="26" height="2.4"/><rect x="8" y="18" width="5" height="5"/>'),
 ray:WSV('<ellipse cx="14" cy="12" rx="10" ry="6"/><rect x="20" y="10" width="18" height="4" rx="2"/><circle cx="40" cy="12" r="4"/><rect x="9" y="16" width="4" height="7"/>'),rocket:WSV('<path d="M3 9h33v7H3z"/><path d="M36 7h4v11h-4z"/><path d="M40 8.5l6 4-6 4z"/><rect x="12" y="16" width="4" height="6"/><rect x="22" y="16" width="3" height="4"/><rect x="5" y="6" width="6" height="3"/>')});
Object.assign(STR.he,{owned2:'יש לך',heliHit:'פגעת במסוק!',dragged2:'השוטר שולף אותך מהרכב!',gotBz:'מצאת בזוקה! אל תספר לאף אחד.',gotMini:'מצאת מיניגאן סודי!'});
Object.assign(STR.en,{owned2:'Owned',heliHit:'You hit the helicopter!',dragged2:'The cop is pulling you out of the car!',gotBz:'You found a bazooka! Tell no one.',gotMini:'You found a secret minigun!'});
Object.assign(REACT,{beg:[R2('בבקשה! יש לי ילדים!','Please! I have kids!'),R2('אני מצטער! אני מצטער!','I am sorry! I am sorry!'),R2('קח את הארנק, הנה, קח!','Take my wallet, here, take it!'),R2('אמא שלי לא תשרוד את זה!','My mother will not survive this!'),R2('זה היה רק ויכוח, אחי!','It was just an argument, man!')],
 pullgun:[R2('אה, ככה? גם לי יש!','Oh, like that? I have one too!'),R2('טעית בבחור, חבר!','Wrong guy, pal!'),R2('עכשיו זה רציני!','Now it is serious!'),R2('חשבת שרק לך יש?','You thought only you had one?')],
 bizOffer:[R2('אני נותן לך את השעון! הוא שווה הון!','Take my watch! It is worth a fortune!'),R2('בוא נגיע להסדר, אני משלם!','Let us settle this, I will pay!')],
 copDrag:[R2('החוצה מהרכב!','Out of the car!'),R2('ידיים על ההגה!','Hands on the wheel!'),R2('צא לאט!','Step out slowly!'),R2('נגמרה הנסיעה!','Ride is over!')],
 fart:[R2('איכס! מה אכלת?!','Ew! What did you eat?!'),R2('אני לא נושם עד שאתה הולך.','I am not breathing until you leave.'),R2('יש פה דליפת גז?','Is there a gas leak?'),R2('בבקשה, יש פה ילדים!','Please, there are kids here!'),R2('זה היה אתה?!','Was that you?!'),R2('העיניים שלי שורפות!','My eyes are burning!')],
 burp:[R2('בתיאבון, כנראה.','Bon appetit, I guess.'),R2('איזה גסות רוח!','How rude!'),R2('עשר מתוך עשר.','Ten out of ten.'),R2('נשמע כמו מנוע של משאית.','Sounded like a truck engine.')],
 whistle:[R2('אתה שורק לי?','Are you whistling at me?'),R2('יפה, תעשה עוד אחד!','Nice, do another one!'),R2('לא, תודה.','No, thanks.'),R2('הכלב שלי בדיוק בא בגלל זה.','My dog just came running because of that.')],
 laugh:[R2('מה מצחיק?','What is so funny?'),R2('גם אני רוצה לצחוק!','I want to laugh too!'),R2('הוא צוחק עליי?','Is he laughing at me?'),R2('מצחיק אותו משהו.','Something amuses him.')],
 dance:[R2('יש לו קצב!','He has rhythm!'),R2('אין לו קצב.','He has no rhythm.'),R2('יאללה, גם אני!','Come on, me too!'),R2('תצלמו את זה!','Someone film this!')],
 yell:[R2('למה אתה צועק?!','Why are you yelling?!'),R2('אני כאן, אני כאן!','I am right here!'),R2('אוי, הלב שלי.','Oh, my heart.'),R2('היי גם לך!','Hey to you too!')],
 copFun:[R2('אדוני, זה מגעיל.','Sir, that is disgusting.'),R2('אני אעשה שלא שמעתי.','I will pretend I did not hear that.'),R2('יש קנס על זה, אתה יודע?','There is a fine for that, you know.'),R2('תמשיך ללכת, אזרח.','Keep walking, citizen.')]});
// ---------- melee combos ----------
function attack(){const P=G.player,w=G.weapon,W=WEAP[w];if(w==='fist'||W.melee){meleeAttack(P,w,W);return;}
  G.fireCD=W.rate;G.weapons[w]--;if(!W.flame)P.a=autoAim(P);
  if(W.pellets)for(let i=0;i<W.pellets;i++)fire(P,null,P.x,P.y,P.a,W.dmg,W.spread,false,{life:0.3,quiet:i>0});
  else if(W.flame){fire(P,null,P.x,P.y,P.a,W.dmg,W.spread,false,{kind:'flame',spd:430,life:0.42});if(rand()<0.3)sfx.flame();}
  else if(W.nade)fire(P,null,P.x,P.y,P.a,W.dmg,0.02,true,{kind:'nade',spd:400,life:0.85,quiet:1});
  else if(W.molo){fire(P,null,P.x,P.y,P.a,0,0.03,false,{kind:'molo',spd:380,life:0.8,quiet:1});aN(0.18,0.12,'bandpass',700,1,{to:1800});}
  else if(W.ray){fire(P,null,P.x,P.y,P.a,W.dmg,W.spread,false,{kind:'ray',spd:950,life:0.7});aT(1400,0.18,'sine',0.14,{to:300});aT(700,0.18,'square',0.04,{to:200});}
  else if(W.range){fire(P,null,P.x,P.y,P.a,W.dmg,W.spread,false,{spd:1800,life:0.62});aT(60,0.5,'sine',0.35,{to:30,rev:0.6});}
  else{fire(P,null,P.x,P.y,P.a,W.dmg,W.spread,!!W.expl,W.heavy?{quiet:Math.floor(G.time*20)%2}:{});if(W.heavy)G.shake=Math.max(G.shake||0,1.6);if(w==='magnum')G.shake=Math.max(G.shake||0,2.5);}
  if(G.weapons[w]<=0){G.weapon='fist';toggleWbar(false);}crime(1,false);}
function meleeAttack(P,w,W){const air=P.jump>0,sprint=IN.b||IN.keys.ShiftLeft||IN.keys.ShiftRight,now=G.time;G.combo=now-(G.lastPunch||0)<0.95?(G.combo||0)+1:1;G.lastPunch=now;
  let kind,dmg,kb,stun=0,reach=W.reach||36,arc=W.arc||1.1,rate=W.rate,multi=1;
  if(w==='fist'){if(air){kind='kick';dmg=18;kb=330;stun=1.6;reach=48;rate=0.6;}else if(sprint&&hyp(P.mvx||0,P.mvy||0)>120){kind='shove';dmg=4;kb=340;stun=0.9;rate=0.55;arc=1.3;}
    else{const c=(G.combo-1)%4;kind=['jab','cross','hook','kick'][c];dmg=[7,9,13,15][c];kb=[60,90,240,290][c];stun=[0,0,1.1,1.5][c];if(c===3)reach=46;rate=c===3?0.55:0.3;}}
  else if(w==='bat'){kind='swing';dmg=W.dmg+(G.combo%2?0:6);kb=290;stun=G.combo%2===0?1.6:0.7;multi=2;}else{kind='stab';dmg=W.dmg;kb=40;}
  let down=null;for(const p of G.peds){if(p.dead||p.veh||!(p.stun>0)||hyp(p.x-P.x,p.y-P.y)>30)continue;if(Math.abs(angDiff(P.a,Math.atan2(p.y-P.y,p.x-P.x)))<1.2){down=p;break;}}
  if(down&&kind!=='shove'&&w==='fist'){kind='stomp';dmg=14;kb=0;stun=1;rate=0.45;}
  G.fireCD=rate;G.punchT=kind==='swing'?0.3:0.22;G.punchK=kind;
  const hits=[];if(kind==='stomp')hits.push(down);else{const cand=[];for(const p of G.peds){if(p===P||p.dead||p.veh)continue;const d=hyp(p.x-P.x,p.y-P.y);if(d<reach&&Math.abs(angDiff(P.a,Math.atan2(p.y-P.y,p.x-P.x)))<arc)cand.push([d,p]);}cand.sort((a,b)=>a[0]-b[0]);for(const c of cand.slice(0,multi))hits.push(c[1]);}
  if(!hits.length){aN(0.12,0.08,'bandpass',w==='bat'?500:1400,1,{to:w==='bat'?1600:3000});return;}
  for(const best of hits){hurtPed(best,dmg+rand()*3,P,w==='knife'?'stab':'punch');if(kb){best.kvx=Math.cos(P.a)*kb;best.kvy=Math.sin(P.a)*kb;}if(stun&&!best.dead)best.stun=Math.max(best.stun||0,stun);
    part('flash',best.x,best.y,0,0,0.08,kind==='kick'||kind==='swing'?10:7);if(w==='knife')for(let k=0;k<5;k++)part('blood',best.x,best.y,rr(-70,70),rr(-70,70),0.4,3);}
  if(w==='bat'){aT(320,0.07,'square',0.18,{lp:1800});aN(0.1,0.3,'bandpass',900,1.2);}else if(w==='knife')aN(0.08,0.2,'highpass',2500,1);else{sfx.punch();if(kind==='kick'||kind==='hook'||kind==='stomp')aT(90,0.14,'sine',0.35,{to:45});}
  if(kind==='kick'||kind==='hook'||kind==='swing'||kind==='stomp')G.shake=Math.max(G.shake||0,3);}
function autoAim(P){const W=WEAP[G.weapon]||{},R=W.range?900:400;let best=null,bs=1e9;for(const p of G.peds){if(p===P||p.dead||p.veh)continue;const dx=p.x-P.x,dy=p.y-P.y,d=hyp(dx,dy);if(d>R)continue;
  const da=Math.abs(angDiff(P.a,Math.atan2(dy,dx)));if(da>0.75)continue;let sc=d*(1+da*2);if(p.hostile||(p.type==='cop'&&G.wanted>0)||(p.type==='soldier'&&G.inBase))sc*=0.3;if(sc<bs&&los(P.x,P.y,p.x,p.y)){bs=sc;best=p;}}
  if(!best&&G.heli&&hyp(G.heli.x-P.x,G.heli.y-P.y)<460)return Math.atan2(G.heli.y-P.y,G.heli.x-P.x);return best?Math.atan2(best.y-P.y,best.x-P.x):P.a;}
// ---------- molotov fires ----------
G.fires=[];
function moloLand(x,y){if(tileAt(x,y)===TL.WATER){splash(x,y,8);return;}G.fires.push({x,y,t:6});aN(0.4,0.3,'bandpass',900,0.8,{to:300});aN(0.6,0.2,'lowpass',500,0.7);crime(1,false);G.shotT=G.time;G.shotX=x;G.shotY=y;}
function firesTick(dt){const P=G.player;for(const f of G.fires){f.t-=dt;if(rand()<0.9)for(let k=0;k<2;k++)part('fire',f.x+rr(-45,45),f.y+rr(-45,45),rr(-12,12),rr(-50,-15),rr(0.4,0.8),rr(6,13));if(rand()<0.3)part('smoke',f.x+rr(-30,30),f.y+rr(-30,30),rr(-15,15)-ENV.wind*30,rr(-60,-25),rr(1.2,2),rr(10,16));
    for(const p of G.peds){if(p.dead||p.veh)continue;const d=hyp(p.x-f.x,p.y-f.y);if(d<55&&!(p.burn>0))p.burn=2.2;else if(d<200&&p.type==='civ'&&p.st!=='flee'){p.st='flee';p.ft=3;p.fx=f.x;p.fy=f.y;}}
    if(!P.veh&&!P.ride&&hyp(P.x-f.x,P.y-f.y)<50&&!(P.burn>0))P.burn=1.2;for(const v of G.vehicles)if(!v.dead&&hyp(v.x-f.x,v.y-f.y)<55)damageVeh(v,12*dt,G.player,'shot');}
  G.fires=G.fires.filter(f=>f.t>0);}
// ---------- police helicopter can be shot ----------
function heliHit(b){const h=G.heli;if(!h||b.op!==G.player)return false;if(hyp(b.x-h.x,b.y-h.y)>(b.expl?64:46))return false;
  if(!b.expl){h.hp=(h.hp??280)-b.dmg*0.8;for(let k=0;k<3;k++)part('spark',b.x,b.y,rr(-80,80),rr(-80,80),0.25,2);if(!G.seen.heliHit){G.seen.heliHit=1;toast(tr('heliHit'),2);}if(h.hp>0){if(rand()<0.25)aT(1800,0.05,'square',0.06);return true;}}
  explodeAt(h.x,h.y,G.player);for(let k=0;k<14;k++)part('smoke',h.x+rr(-40,40),h.y+rr(-40,40),rr(-60,60),rr(-60,60),2,rr(12,20));G.heli=null;G.heliCD=50;toast(tr('heliDown'));G.money+=500;addHeat(4);post('heli');return true;}
function heliExtra(dt){const h=G.heli;if(!h)return;if((h.hp??280)<140&&rand()<0.5)part('smoke',h.x+rr(-12,12),h.y+rr(-12,12),rr(-20,20)-ENV.wind*40,rr(-40,-10),1.4,rr(8,13));
  if(G.wanted>=4&&h.see&&!G.player.dead){h.gcd=(h.gcd||1.5)-dt;if(h.gcd<=0){h.gcd=rr(1.6,2.6);const P=G.player,a=Math.atan2(P.y-h.y,P.x-h.x);fire({x:h.x,y:h.y,heli:1},null,h.x,h.y,a,9,0.12,false,{quiet:0});}}}
// ---------- smarter police and thugs ----------
function aiHostile(p,dt){const P=G.player,tgt=P.veh||P,d=hyp(tgt.x-p.x,tgt.y-p.y),cop=p.type==='cop';
  if(cop&&!G.seenNow&&G.lastSeen&&!(d<sightRange()&&los(p.x,p.y,tgt.x,tgt.y))){const ls=G.lastSeen,dl=hyp(ls.x-p.x,ls.y-p.y);p.arr=0;
    if(dl>70){p.a=Math.atan2(ls.y-p.y,ls.x-p.x);walkDir(p,110,dt);}else{p.tm-=dt;if(p.tm<=0){p.tm=rr(1,2.5);p.sa=rr(0,TAU);}p.a=p.sa||0;walkDir(p,60,dt);}return;}
  p.a=Math.atan2(tgt.y-p.y,tgt.x-p.x);
  if(cop&&p.sayT<=0&&rand()<dt*0.3&&onScreen(p.x,p.y,0)){say(p,G.wanted>=3?'copHard':G.wanted<=2?'cop':'copChase');sfx.voice(p,dv(p.x,p.y));}
  const v=P.veh,car=v&&!v.t.boat&&!v.t.plane&&!(v.alt>0.25);
  if(cop&&car&&Math.abs(v.speed)<45&&(G.wanted<=3||p.id%3!==0)){const ca=Math.cos(v.a),sa=Math.sin(v.a),sd=p.id%2?1:-1,dx=v.x+sa*sd*(v.t.w*0.5+13),dy=v.y-ca*sd*(v.t.w*0.5+13),dd=hyp(dx-p.x,dy-p.y);
    if(dd>18){p.a=Math.atan2(dy-p.y,dx-p.x);walkDir(p,155,dt);p.arr=Math.max(0,(p.arr||0)-dt*0.5);}
    else{p.walk=0;p.a=Math.atan2(v.y-p.y,v.x-p.x);p.arr=(p.arr||0)+dt;G.bustCar=Math.max(G.bustCar||0,p.arr/1.4);if(p.sayT<=0){say(p,'copDrag');sfx.voice(p,dv(p.x,p.y));}if(p.arr>1.4){p.arr=0;dragOut(p);}}return;}
  if(cop&&car&&G.wanted<=2){walkDir(p,140,dt);return;}
  const melee=p.wpn==='knife'||p.wpn==='bat'||!p.wpn&&p.type==='gang';
  if(melee){if(d>24){flankMove(p,tgt,d,24,150,dt);}else{p.walk=0;if(p.cool<=0&&!P.veh&&!(P.jump>0)){p.cool=0.85;hurtPed(P,p.wpn==='knife'?12:p.wpn==='bat'?14:7,p,'punch');sfx.punch();P.kvx=Math.cos(p.a)*150;P.kvy=Math.sin(p.a)*150;G.hurtFlash=0.4;}}return;}
  const arrest=cop&&G.wanted<=2&&!P.veh;const keep=arrest?14:(p.type==='soldier'?220:150);
  if(d>keep||!los(p.x,p.y,tgt.x,tgt.y)){if(arrest)walkDir(p,140,dt);else flankMove(p,tgt,d,keep,p.type==='soldier'?100:125,dt);}else p.walk=0;
  if(arrest){if(!P.roof&&!P.climb&&!(P.jump>0)&&d<28){G.bustBy=G.time;if(p.cool<=0){p.cool=1.5;hurtPed(P,4,p,'punch');sfx.punch();G.stagger=0.3;G.hurtFlash=0.3;}}return;}
  if(p.cool<=0&&d<340&&los(p.x,p.y,tgt.x,tgt.y)){if(!fireBudget(p)){p.cool=rr(0.2,0.5);return;}p.cool=p.type==='soldier'?0.6:rr(0.9,1.5);
    fire(p,null,p.x,p.y,p.a,p.type==='soldier'?12:cop?7:9,p.type==='soldier'?0.12:cop?0.2:0.16);}}
function flankMove(p,tgt,d,keep,sp,dt){const ang=(p.id*2.399)%TAU,off=Math.min(keep*0.8,d*0.5),tx=tgt.x+Math.cos(ang)*off,ty=tgt.y+Math.sin(ang)*off;p.a=Math.atan2(ty-p.y,tx-p.x);walkDir(p,sp,dt);p.a=Math.atan2(tgt.y-p.y,tgt.x-p.x);}
function dragOut(p){const P=G.player,v=P.veh;if(!v)return;exitVehicle();if(P.veh)return;toast(tr('dragged2'),2);sfx.punch();const a=Math.atan2(P.y-p.y,P.x-p.x);knockDown(0.9,Math.cos(a)*120,Math.sin(a)*120);hurtPed(P,4,p,'punch');G.bustBy=G.time;if(G.wanted<=2)G.bust=Math.max(G.bust||0,0.45);}
function roadblockTick(dt){G.rbCD=(G.rbCD??20)-dt;const P=G.player,v=P.veh;if(G.rbCD>0||G.wanted<4||!v||Math.abs(v.speed)<200||v.t.boat||v.t.plane)return;
  const sp=hyp(v.vx,v.vy)||1,ux=v.vx/sp,uy=v.vy/sp;for(const dist of [1100,1300,950]){const [i,j]=nearestNode(P.x+ux*dist,P.y+uy*dist),q=nodePos(i,j);if(onScreen(q.x,q.y,120)||hyp(q.x-P.x,q.y-P.y)<800)continue;
    const dx=q.x-P.x,dy=q.y-P.y;if((dx*ux+dy*uy)/hyp(dx,dy)<0.8)continue;const pa=Math.atan2(uy,ux)+Math.PI/2,ca=Math.cos(pa),sa=Math.sin(pa);
    for(const s of [-1,1]){const c=mkVeh('police',q.x+ca*s*34-ux*20,q.y+sa*s*34-uy*20,pa+(s>0?0.25:-0.25));c.siren=true;c.rb=true;const cp=mkPed('cop',c.x-ux*60,c.y-uy*60,{persist:false});cp.car=c;}
    G.rbCD=rr(40,60);return;}G.rbCD=3;}
// ---------- civilians who see a gun mid-fight ----------
function gunReact(p){const K=KINDS[p.kind]||{},r=((p.id*2654435761)>>>0)%100,P=G.player;p.brawl=0;p.conv=null;
  const tough=K.tough||p.kind==='worker'||p.kind==='punk';
  if(tough&&r<45){p.type='gang';p.faction='thug';p.hostile=true;p.wpn=pick(['pistol','knife','bat']);p.shirt=p.shirt||'#3a3a3a';say(p,'pullgun',2.5);sfx.voice(p,1);return;}
  if(p.kind==='biz'&&r<60){p.st='beg';p.ft=2.2;p.bizOffer=1;say(p,'bizOffer',2.5);sfx.voice(p,1);return;}
  if(p.kind==='elder'||r<35){p.st='beg';p.ft=2.2;say(p,'beg',2.5);sfx.voice(p,1);return;}
  if(r<55){p.st='call';p.callT=4;p.fx=P.x;p.fy=P.y;say(p,'call',3);return;}
  p.st='flee';p.ft=7;p.fx=P.x;p.fy=P.y;say(p,'gun',2);sfx.scream(1,p.voice||220);}
function begTick(p,dt){p.ft-=dt;p.walk=0;const P=G.player;p.a=Math.atan2(P.y-p.y,P.x-p.x);if(p.ft<=0){mkPickup('cash',p.x+Math.cos(p.a)*16,p.y+Math.sin(p.a)*16,{amt:p.bizOffer?ri(150,400):ri(20,90)});p.st='flee';p.ft=6;p.fx=P.x;p.fy=P.y;p.bizOffer=0;}}
// ---------- emotes: fart, burp, whistle, laugh, dance, yell ----------
const EMOTES=['fart','burp','whistle','laugh','dance','yell'];
function emote(){const P=G.player;if((G.emoteCD||0)>0||P.veh||P.dead||P.inside||P.ride||G.state!=='play')return;G.emoteCD=1.1;const k=EMOTES[bagPick('emote',EMOTES)],EM={fart:'💨',burp:'😮‍💨',whistle:'🎵',laugh:'😂',dance:'🕺',yell:'📣'};
  P.say=EM[k];P.sayT=1.4;const ca=Math.cos(P.a),sa=Math.sin(P.a);
  if(k==='fart'){for(let i=0;i<6;i++)aT(rr(70,115),0.09,'sawtooth',0.16,{lp:420,at:i*0.065,to:rr(55,90)});aN(0.55,0.22,'bandpass',160,3,{to:90});for(let i=0;i<10;i++)part('gas',P.x-ca*10+rr(-8,8),P.y-sa*10+rr(-8,8),-ca*30+rr(-20,20),-sa*30+rr(-20,20),rr(1.2,2),rr(8,14));}
  else if(k==='burp'){aSyl(78,0,0.55,0.32,3);aSyl(70,0.5,0.25,0.2,4);}
  else if(k==='whistle'){aT(1300,0.25,'sine',0.13,{to:2300});aT(1250,0.45,'sine',0.13,{to:700,at:0.32});ducksCall();}
  else if(k==='laugh'){for(let i=0;i<6;i++)aSyl(175-i*6,i*0.13,0.1,0.22,0);}
  else if(k==='dance'){G.danceT=2.4;copDanceCheck();[523,659,784,659,523,784,1046].forEach((f,i)=>aT(f,0.16,'triangle',0.12,{at:i*0.16}));}
  else{aSyl(160,0,0.42,0.35,0,0.4);P.say=G.lang==='he'?'היי!':'HEY!';}
  let n=0;for(const p of G.peds){if(p.dead||p.veh||p.medicP||(p.type!=='civ'&&p.type!=='cop'))continue;const d=hyp(p.x-P.x,p.y-P.y);if(d>(k==='yell'?260:170))continue;
    if(p.kind==='dog'){if(k==='fart'||k==='whistle'){p.st='walk';p.a=Math.atan2(P.y-p.y,P.x-p.x);say(p,'dog',1.2);sfx.bark(dv(p.x,p.y));}continue;}
    if(n<3&&p.sayT<=0){n++;setTimeout(()=>{if(p.dead)return;say(p,p.type==='cop'?'copFun':k,2.6);sfx.voice(p,dv(p.x,p.y));},250+n*450);}
    if(p.type!=='civ')continue;p.conv=null;
    if(p.perf==='statue'&&k==='fart'){p.say='!!!';p.sayT=2;secret('statue');continue;}if(p.perf)continue;
    if(k==='fart'&&d<110){p.st='flee';p.ft=1.6;p.fx=P.x;p.fy=P.y;}
    else if(k==='dance'&&rand()<0.45){p.st='dance';p.ft=rr(2.5,4);}else if(p.st==='walk'||p.st==='idle'){p.st='idle';p.tm=2;p.a=Math.atan2(P.y-p.y,P.x-p.x);}}}
function emoteTick(dt){const P=G.player;if(G.emoteCD>0)G.emoteCD-=dt;if(P.sayT>0)P.sayT-=dt;if(G.danceT>0){G.danceT-=dt;P.a+=dt*9;if(rand()<dt*6)part('spark',P.x+rr(-20,20),P.y-20+rr(-10,10),rr(-20,20),-50,0.8,3);}
  if(!G.emoBound){G.emoBound=1;const b=$('bF');b.innerHTML='<span style="font-size:22px">😜</span>';b.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();AU.init();emote();});addEventListener('keydown',e=>{if(e.code==='KeyF')emote();});}
  const show=!P.veh&&!P.inside&&!P.ride&&!P.dead&&G.state==='play';if(show!==G.emoShown){G.emoShown=show;$('bF').style.display=show?'flex':'none';}}
function genWeapons(){Object.assign(PKC,{bat:['#8d6e63','/'],knife:['#95a5a6','†'],magnum:['#7f8c8d','M'],sniper:['#34495e','◎'],molotov:['#d35400','🔥'],minigun:['#2c3e50','≡']});const R=RESTRICT;WPICKS.push({type:'rocket',x:(R.x0+R.x1)/2+90,y:(R.y0+R.y1)/2-60,once:'bz1'},{type:'minigun',x:(R.x0+R.x1)/2-120,y:R.y1-160,once:'mg1'},{type:'rocket',x:343*T,y:190*T,once:'bz2'},
  {type:'bat',x:POI.start.x+260,y:POI.start.y+40},{type:'knife',x:POI.club.x+120,y:POI.club.y+50},{type:'molotov',x:POI.brew.x+60,y:POI.brew.y+40},{type:'magnum',x:POI.cops.x-150,y:POI.cops.y+40},{type:'sniper',x:POI.halo.x+140,y:POI.halo.y+30});}
