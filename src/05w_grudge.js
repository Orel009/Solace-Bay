// ---------- grudges: annoyed people chase you, owners take their car back, road rage, live street events ----------
function pHash(p,s){return(((p.id+(s||0))*2654435761)>>>0)%100;}
function chaseSp(p){return p.kind==='dog'?178:p.kind==='elder'?70:(p.kind==='tourist'?120:148)*((KINDS[p.kind]||{}).tough?1.05:1);}
function startGrudge(p,why,car){if(!p||p.dead||p.type!=='civ'||p.medicP||p.remove)return;const K=KINDS[p.kind]||{};
  p.brawl=0;p.conv=null;p.mate=null;
  if(!car&&K.meek&&p.kind!=='elder'&&p.kind!=='dog'){if(pHash(p,7)<35){p.st='call';p.callT=4;p.fx=G.player.x;p.fy=G.player.y;say(p,'call',3);}else{p.st='flee';p.ft=4;p.fx=G.player.x;p.fy=G.player.y;say(p,'annoyMeek');}sfx.voice(p,dv(p.x,p.y));return;}
  p.gr={t:car?45:rr(14,20),why,car:car||p.gr&&p.gr.car||null,bang:0,lost:0,yell:0};p.st='walk';p.ann=0;
  say(p,car?'ownerChase':p.kind==='dog'?'dog':why==='horn'?'honkMad':why==='crash'?'crash':'chaseYell',2.6);sfx.voice(p,dv(p.x,p.y));
  if(p.kind==='dog')sfx.bark(dv(p.x,p.y));
  // friends join
  if(!car&&p.kind!=='dog'){let n=0;for(const o of G.peds){if(o===p||o.dead||o.type!=='civ'||o.gr||o.kind==='dog'||o.kind==='elder'||(KINDS[o.kind]||{}).meek||hyp(o.x-p.x,o.y-p.y)>110)continue;if(o.mate===p||p.mate===o||pHash(o,3)<45){o.gr={t:rr(10,15),why:'friend',bang:0,lost:0,yell:0};o.st='walk';o.conv=null;say(o,'friendJoin',2.4);if(++n>=2)break;}}
    if(!G.grudgeTip){G.grudgeTip=1;toast(L(R2('😡 עצבנת מישהו. הוא רודף אחריך! (נשק שלוף מבריח אותם)','😡 You annoyed someone. They are coming after you! (a drawn gun scares them off)')),4);}}}
function annoy(p,amt,why){if(!p||p.dead||p.type!=='civ'||p.gr||p.brawl>0||p.st==='flee'||p.st==='call'||p.st==='beg'||p.medicP||p.remove||p.thief||p.ev2)return;if((p.annCD||0)>G.time)return;p.annCD=G.time+0.7;
  p.ann=(p.ann||0)+amt;p.a=Math.atan2(G.player.y-p.y,G.player.x-p.x);
  if(p.ann>=1)startGrudge(p,why);else if(p.ann>=0.35){if(p.sayT<=0||rand()<0.5){say(p,why==='horn'?'horn':why==='car'?'carNudge':why==='emote'?'annoyEmote':'annoy1',2);sfx.voice(p,dv(p.x,p.y));}if(p.st==='walk'||p.st==='idle'){p.st='idle';p.tm=1.5;}}}
function annoyEmote(k){const P=G.player,amt={fart:0.45,yell:0.4,burp:0.25,laugh:0.12,dance:0,whistle:0}[k]||0;if(!amt)return;
  for(const p of G.peds){if(p.type!=='civ'||p.dead)continue;const d=hyp(p.x-P.x,p.y-P.y);if(d<(k==='yell'?150:85))annoy(p,amt*(d<50?1.5:1),'emote');}}
function annoyHorn(v){for(const p of G.peds){if(p.type!=='civ'||p.dead)continue;const d=hyp(p.x-v.x,p.y-v.y);if(d<150){const r=pHash(p,11);if(r<35)annoy(p,0.55,'horn');else if(r<75){p.st='flee';p.ft=1.6;p.fx=v.x;p.fy=v.y;}}}}
// owner gets his car back
function reclaimCar(p,car){p.remove=true;car.driver='civ';car.parked=false;car.dead=false;trafficFromHere(car);car.door=0.4;sfx.door();
  if(onScreen(car.x,car.y,60))toast(L(pick([R2('🚗 הבעלים לקח את הרכב שלו בחזרה: "המותק שלי!"','🚗 The owner took his car back: "My baby!"'),R2('🚗 הבעלים חזר לרכב: "ועכשיו תלך ברגל!"','🚗 The owner got his car back: "Now you walk!"'),R2('🚗 הבעלים לקח את הרכב: "יש פה מצלמות, יא גנב!"','🚗 The owner took his car: "There are cameras here, thief!"')])),3.5);}
function grudgeTick(p,dt){const g=p.gr,P=G.player;g.t-=dt;if(p.brawl>0)return false;
  const car=g.car&&!g.car.dead&&!g.car.remove&&!g.car.sunk?g.car:null;
  // the car is free again: walk to it and drive away
  if(car&&!car.driver&&(g.why==='owner'||g.back)){const dc=hyp(car.x-p.x,car.y-p.y);if(dc<car.t.w*0.5+26){reclaimCar(p,car);return true;}if(dc<1100&&g.t>0){p.a=Math.atan2(car.y-p.y,car.x-p.x);walkDir(p,g.back?90:140,dt);return true;}}
  if(g.back){p.gr=null;p.st='walk';return false;}
  const tgt=P.veh||P,d=hyp(tgt.x-p.x,tgt.y-p.y);
  if(P.dead||g.t<=0||d>1300||P.inside||P.roof||P.ride){if(d<600&&!P.dead)say(p,'giveup',2.5);if(car&&!car.driver){g.back=1;g.t=25;return true;}p.gr=null;p.st='walk';p.ann=0;return false;}
  if(!P.veh&&d<280&&G.weapon!=='fist'&&!(WEAP[G.weapon]||{}).melee){p.gr=null;if(p.kind==='dog'){p.st='flee';p.ft=4;p.fx=P.x;p.fy=P.y;sfx.bark(1);return true;}gunReact(p);return true;}
  g.yell-=dt;if(g.yell<=0&&onScreen(p.x,p.y,0)){g.yell=rr(2.2,3.8);say(p,p.kind==='dog'?'dog':g.car?'ownerChase':'chaseYell',2);if(p.kind==='dog')sfx.bark(dv(p.x,p.y));else sfx.voice(p,dv(p.x,p.y));}
  if(!P.veh){if(d>23){p.a=Math.atan2(P.y-p.y,P.x-p.x);walkDir(p,chaseSp(p),dt);return true;}
    p.walk=0;p.a=Math.atan2(P.y-p.y,P.x-p.x);
    if(p.kind==='dog'||p.kind==='elder'){if(p.cool<=0&&!(P.jump>0)){p.cool=p.kind==='dog'?0.9:1.3;hurtPed(P,p.kind==='dog'?4:2,p,'punch');sfx.punch();if(p.kind==='dog')sfx.bark(1);G.hurtFlash=0.25;P.kvx=Math.cos(p.a)*80;P.kvy=Math.sin(p.a)*80;}return true;}
    p.brawl=8;g.t=Math.min(g.t,9);return false;}
  const v=P.veh;if(v.t.boat||v.t.plane||v.alt>0.25||P.swim){p.walk=0;p.a=Math.atan2(v.y-p.y,v.x-p.x);if(d>500){g.lost+=dt;if(g.lost>3)g.t=0;}return true;}
  if(Math.abs(v.speed)<45){const ca=Math.cos(v.a),sa=Math.sin(v.a),sd=p.id%2?1:-1,dx=v.x+sa*sd*(v.t.w*0.5+13),dy=v.y-ca*sd*(v.t.w*0.5+13),dd=hyp(dx-p.x,dy-p.y);g.lost=0;
    if(dd>16){p.a=Math.atan2(dy-p.y,dx-p.x);walkDir(p,chaseSp(p),dt);g.bang=Math.max(0,g.bang-dt*0.5);return true;}
    p.walk=0;p.a=Math.atan2(v.y-p.y,v.x-p.x);if(p.kind==='dog'){if(rand()<dt*2)sfx.bark(1);return true;}
    g.bang+=dt;G.bangT=G.time;if((g.knock=(g.knock||0)-dt)<=0){g.knock=0.42;aN(0.07,0.25,'lowpass',380,1);G.shake=Math.max(G.shake||0,1.5);if(rand()<0.35)say(p,'windowBang',1.6);}
    if(g.bang>1.8){exitVehicle();if(P.veh)return true;const a=Math.atan2(P.y-p.y,P.x-p.x);knockDown(0.8,Math.cos(a)*130,Math.sin(a)*130);hurtPed(P,3,p,'punch');sfx.punch();
      if(car&&car===v){reclaimCar(p,car);return true;}toast(L(R2('😡 שלפו אותך מהרכב!','😡 You got pulled out of the car!')),2);p.brawl=7;g.t=Math.min(g.t,7);}return true;}
  // car moving: run after it, owners may grab another car
  p.a=Math.atan2(v.y-p.y,v.x-p.x);walkDir(p,chaseSp(p),dt);
  if(d>380){g.lost+=dt;if(car&&!g.jacked&&g.lost>2.5&&pHash(p,5)<55){const o=G.vehicles.find(o=>o.ai&&o.ai.mode==='traffic'&&o.driver==='civ'&&!o.t.police&&!o.t.boat&&!o.t.bus&&hyp(o.x-p.x,o.y-p.y)<260);
      if(o){g.jacked=1;const vic=mkPed('civ',o.x-Math.sin(o.a)*(o.t.w*0.5+14),o.y+Math.cos(o.a)*(o.t.w*0.5+14));vic.st='flee';vic.ft=4;vic.fx=o.x;vic.fy=o.y;say(vic,'jacked',2.5);
        o.ai={mode:'revenge',t:40,car,horn:1,cool:0};o.driver='civ';p.remove=true;sfx.door();if(onScreen(o.x,o.y,80)||hyp(o.x-P.x,o.y-P.y)<700)toast(L(R2('😡 הבעלים גנב רכב אחר ורודף אחריך!','😡 The owner stole another car and is coming after you!')),3.5);return true;}}
    if(g.lost>(car?9:4))g.t=0;}else g.lost=0;
  return true;}
// owner (or road-rager) chasing you in a car
function revengeDrive(v,dt){const ai=v.ai,P=G.player;ai.t-=dt;const tgt=P.veh||P,d=hyp(tgt.x-v.x,tgt.y-v.y);
  if(ai.t<=0||d>1700||P.dead){trafficFromHere(v);v.driver='civ';return;}
  if(!P.veh&&d<140){v.thr=v.speed>15?-1:0;v.hb=1;if(Math.abs(v.speed)<30){const q=mkPed('civ',v.x-Math.sin(v.a)*(v.t.w*0.5+14),v.y+Math.cos(v.a)*(v.t.w*0.5+14),{kind:'worker'});q.gr={t:20,why:'owner',car:ai.car&&!ai.car.dead?ai.car:null,bang:0,lost:0,yell:0};say(q,'ownerChase',2.5);v.driver=null;v.ai=null;v.parked=true;v.thr=0;}return;}
  chaseDrive0(v,tgt.x,tgt.y,dt);const pm=P.veh?P.veh.t.max:200,cap=Math.min(v.t.max,Math.max(pm*(d<500?0.9:1),220));if(v.speed>cap)v.thr=v.speed>cap+50?-0.4:0;
  ai.horn-=dt;if(ai.horn<=0&&d<500){ai.horn=rr(1.5,3.5);sfx.horn(v,dv(v.x,v.y));}}
// drivers stuck behind you honk, then get out
function blockTick(dt){const P=G.player,pv=P.veh;if(!pv||Math.abs(pv.speed)>12||pv.t.boat){G.blockers=null;return;}
  G.blkT=(G.blkT||0)-dt;if(G.blkT>0)return;G.blkT=0.4;
  for(const v of G.vehicles){if(!v.ai||v.ai.mode!=='traffic'||v.driver!=='civ'||v.t.police||Math.abs(v.speed)>12||Math.abs(v.x-pv.x)+Math.abs(v.y-pv.y)>260)continue;
    if(lookAhead2(v)!==pv){v.blk=0;continue;}v.blk=(v.blk||0)+0.4;
    if(v.blk>=1.6&&v.blk<2.05||v.blk>=4&&v.blk<4.45){sfx.horn(v,dv(v.x,v.y));if(v.blk<2.1&&!G.blockTip){G.blockTip=1;toast(L(R2('📯 אתה חוסם את התנועה. הנהגים מתחילים להתעצבן...','📯 You are blocking traffic. Drivers are getting angry...')),3);}}
    if(v.blk>=6.5){v.blk=0;const r=(v.id*7)%10;if(r<6){const q=mkPed('civ',v.x-Math.sin(v.a)*(v.t.w*0.5+14),v.y+Math.cos(v.a)*(v.t.w*0.5+14));v.driver=null;v.ai=null;v.thr=0;v.hb=1;v.parked=true;startGrudge(q,'horn',v);if(q.gr)q.gr.t=18;}else{v.ai.wps=[];v.blk=-8;}}}}
// ---------- live street events ----------
function ev2Spot(rmin,rmax,road){const P=G.player;for(let k=0;k<40;k++){const a=rr(0,TAU),r=rr(rmin,rmax),x=P.x+Math.cos(a)*r,y=P.y+Math.sin(a)*r,t=tileAt(x,y);if(road?t===TL.ROAD:(t===TL.WALK||t===TL.CONC))return{x,y};}return null;}
function ev2Start(){ev2StartK(pick(['snatch','snatch','bender','copchase']));}
function ev2StartK(k){const P=G.player;
  if(k==='snatch'){const s=ev2Spot(190,380);if(!s)return;const vic=mkPed('civ',s.x,s.y,{kind:pick(['elder','casual','tourist'])}),th=mkPed('civ',s.x+30,s.y+8,{kind:'punk',shirt:'#22252e'});
    th.thief=1;th.ev2=1;vic.ev2=1;th.hp0=th.hp;th.st='flee';th.ft=99;th.fx=s.x;th.fy=s.y;vic.st='idle';say(vic,'snatchVic',3);sfx.scream(1,vic.voice||240);
    G.ev2={k,vic,th,t:30};toast(L(R2('👜 גנב חטף תיק! תפוס אותו (אגרוף או בעיטה)','👜 A thief snatched a bag! Catch him (punch or kick)')),4);}
  else if(k==='bender'){const s=ev2Spot(300,600,true);if(!s)return;const a=pick([0,Math.PI/2,Math.PI,-Math.PI/2]);
    const c1=mkVeh(pick(['sedan','compact','taxi']),s.x,s.y,a),c2=mkVeh(pick(['sedan','pickup','van']),s.x-Math.cos(a)*(c1.t.l*0.5+28),s.y-Math.sin(a)*(c1.t.l*0.5+28),a+rr(-0.4,0.4));
    for(const c of[c1,c2]){c.parked=true;c.driver=null;c.ai=null;c.hp=Math.min(c.hp,c.t.hp*0.6);}for(let i=0;i<8;i++)part('smoke',s.x+rr(-30,30),s.y+rr(-20,20),rr(-20,20),rr(-30,-10),1.6,rr(8,14));
    const sd=Math.PI/2+a,d1=mkPed('civ',c1.x+Math.cos(sd)*(c1.t.w*0.5+16),c1.y+Math.sin(sd)*(c1.t.w*0.5+16),{kind:'biz'}),d2=mkPed('civ',c2.x+Math.cos(sd)*(c2.t.w*0.5+16),c2.y+Math.sin(sd)*(c2.t.w*0.5+16),{kind:'worker'});
    d1.ev2=d2.ev2=1;d1.argue=d2;d2.argue=d1;d1.st=d2.st='idle';G.ev2={k,a:d1,b:d2,c1,c2,t:40,ph:0,say:0};}
  else{const s=ev2Spot(300,560);if(!s)return;const rb=mkPed('civ',s.x,s.y,{kind:'punk',shirt:'#5a2a2a'}),cp=mkPed('cop',s.x-90,s.y-20,{persist:false});rb.thief=1;rb.ev2=1;rb.hp0=rb.hp;rb.st='flee';rb.ft=99;rb.fx=cp.x;rb.fy=cp.y;cp.foot=rb;cp.ev2=1;
    G.ev2={k,rb,cp,t:30};say(cp,'copStop',2.5);sfx.voice(cp,dv(cp.x,cp.y));}}
function ev2Tick(dt){const P=G.player;G.ev2T=(G.ev2T===undefined?25:G.ev2T)-dt;const E=G.ev2;
  if(!E){if(G.ev2T<=0&&G.wanted===0&&!P.dead&&!G.mission){G.ev2T=rr(35,60);ev2Start();}return;}
  E.t-=dt;const end=()=>{G.ev2=null;G.ev2T=rr(35,60);};
  if(E.k==='snatch'||E.k==='copchase'){const th=E.k==='snatch'?E.th:E.rb;
    if(!th||th.remove){end();return;}
    const caught=th.dead||th.hp<th.hp0-1||th.stun>0&&!E.caught;
    if(caught&&!E.caught){E.caught=1;th.thief=0;mkPickup('cash',th.x+12,th.y+6,{amt:E.k==='snatch'?ri(150,320):ri(100,220)});G.rep=Math.min(50,(G.rep||0)+5);post('hero');
      if(E.k==='snatch'){const vic=E.vic;if(vic&&!vic.dead){say(vic,'snatchThanks',3.5);vic.st='idle';vic.tm=4;}toast(L(R2('👜 תפסת את הגנב! הכסף שלך, והגברת מתה עליך.','👜 You caught the thief! The cash is yours and the lady loves you.')),3.5);}
      else{const cp=E.cp;if(cp&&!cp.dead){say(cp,'copThanks',3.5);cp.foot=null;}toast(L(R2('👮 עזרת לשוטר לתפוס חשוד. אזרח למופת!','👮 You helped a cop catch a suspect. Model citizen!')),3.5);}
      if(!th.dead){th.st='cower';th.ft=6;say(th,'thiefCaught',2.5);}E.t=Math.min(E.t,8);}
    if(!E.caught&&!th.dead){th.ft=99;const chaser=E.k==='copchase'?E.cp:null;let fx=E.k==='snatch'?E.vic.x:chaser?chaser.x:th.x-1,fy=E.k==='snatch'?E.vic.y:chaser?chaser.y:th.y;
      if(hyp(P.x-th.x,P.y-th.y)<320){fx=P.x;fy=P.y;}th.fx=fx;th.fy=fy;th.st='flee';if(th.sayT<=0&&rand()<dt*0.5)say(th,'thiefRun',1.8);
      if(E.k==='snatch'){const vic=E.vic;if(vic&&!vic.dead&&vic.sayT<=0&&rand()<dt*0.8)say(vic,'snatchVic',2);}
      if(E.k==='copchase'){const cp=E.cp;if(cp&&!cp.dead&&cp.foot){cp.a=Math.atan2(th.y-cp.y,th.x-cp.x);walkDir(cp,112,dt);if(cp.sayT<=0&&rand()<dt*0.6){say(cp,'copStop',2);sfx.voice(cp,dv(cp.x,cp.y));}if(hyp(th.x-cp.x,th.y-cp.y)<22){th.stun=4;th.thief=0;E.caught=1;E.t=Math.min(E.t,6);say(cp,'copGot',2.5);}}}
      if(!onScreen(th.x,th.y,200)&&hyp(P.x-th.x,P.y-th.y)>900){th.remove=true;if(E.k==='snatch'&&E.vic)say(E.vic,'snatchLost',3);}}
    if(E.t<=0){if(th&&!th.dead&&!E.caught)th.remove=true;if(E.cp)E.cp.foot=null;end();}return;}
  if(E.k==='bender'){const a=E.a,b=E.b;if(!a||!b||a.dead||b.dead||a.remove||b.remove||E.t<=0||hyp(a.x-P.x,a.y-P.y)>1500){for(const q of[a,b])if(q&&!q.dead){q.argue=null;q.ev2=0;}end();return;}
    if(a.gr||b.gr){a.argue=b.argue=null;a.ev2=b.ev2=0;end();return;}
    E.say-=dt;if(E.say<=0&&!a.brawl&&!(a.prey)){E.say=rr(1.4,2.2);const s=E.ph%2?b:a;say(s,'argue',2);sfx.voice(s,dv(s.x,s.y));E.ph++;}
    for(const [p,o] of[[a,b],[b,a]]){if(p.prey)continue;p.walk=0;p.a=Math.atan2(o.y-p.y,o.x-p.x);if(hyp(o.x-p.x,o.y-p.y)>40){walkDir(p,40,dt);}}
    if(E.ph===7&&!a.prey&&!E.ft){a.prey=b;E.ft=7;say(a,'argueFight',2.5);}
    if(E.ft){E.ft-=dt;if(E.ft<=0){a.prey=null;E.ph=12;}}
    if(E.ph>=12){a.prey=null;for(const [q,c] of[[a,E.c1],[b,E.c2]]){if(q&&!q.dead&&c&&!c.dead&&!c.driver){q.argue=null;q.ev2=0;q.gr={t:20,why:'back',back:1,car:c,bang:0,lost:0,yell:99};}}end();}}}
// hooks used by aiPed: argue state holds still
function ev2Ped(p,dt){if(p.argue&&!p.prey){p.walk=0;return true;}return false;}
// ---------- per-frame: bump detection ----------
function grudgeTick2(dt){const P=G.player;blockTick(dt);ev2Tick(dt);
  for(const p of G.peds)if(p.ann>0&&!p.gr)p.ann=Math.max(0,p.ann-dt*0.05);
  if(P.dead)return;
  if(!P.veh){const sp=hyp(P.mvx||0,P.mvy||0);if(sp>40)for(const p of G.peds){if(p.type!=='civ'||p.dead||p.gr)continue;const dx=p.x-P.x,dy=p.y-P.y;if(dx*dx+dy*dy<22*22){annoy(p,sp>140?0.5:0.3,'bump');if(p.sayT<=0||rand()<0.3){}}}}
  else{const v=P.veh,sp=Math.abs(v.speed);if(sp>8&&sp<75&&!v.t.boat)for(const p of G.peds){if(p.type!=='civ'||p.dead||p.gr)continue;if(Math.abs(p.x-v.x)>v.t.l||Math.abs(p.y-v.y)>v.t.l)continue;if(pointInVeh(v,p.x,p.y,12))annoy(p,0.45,'car');}}}
Object.assign(REACT,{
 annoy1:[R2('היי! תיזהר!','Hey! Watch it!'),R2('אתה עיוור?','Are you blind?'),R2('יש פה מקום לשנינו, אחי.','There is room for both of us, bro.'),R2('עוד פעם אחת ואתה רואה מה קורה.','One more time and you will see.'),R2('תסתכל לאן אתה הולך!','Look where you are going!'),R2('נו באמת!','Oh come on!')],
 carNudge:[R2('אתה נוסע עליי?!','Are you driving into me?!'),R2('זה מדרכה, לא חניה!','This is a sidewalk, not a parking spot!'),R2('עוד סנטימטר ואני קופץ על המכסה!','One more inch and I jump on the hood!'),R2('אתה רוצה בעיות?','You want trouble?')],
 annoyEmote:[R2('אתה רציני?!','Are you serious?!'),R2('יש פה אנשים!','There are people here!'),R2('תתבייש לך!','Shame on you!'),R2('עוד פעם אחת ואני מתעצבן.','One more time and I lose it.')],
 annoyMeek:[R2('אני לא רוצה בעיות!','I do not want trouble!'),R2('עזוב אותי בשקט!','Leave me alone!'),R2('אמא!','Mom!')],
 chaseYell:[R2('בוא הנה! אני רק רוצה לדבר!','Come here! I just want to talk!'),R2('אתה בורח? פחדן!','Running away? Coward!'),R2('תעצור! לא סיימנו!','Stop! We are not done!'),R2('אני אתפוס אותך!','I will catch you!'),R2('ראיתי את הפרצוף שלך!','I saw your face!'),R2('אני רץ מרתונים, אחי!','I run marathons, bro!')],
 friendJoin:[R2('אני איתך, אחי!','I got your back, bro!'),R2('מי זה? בוא נלמד אותו!','Who is that? Let us teach him!'),R2('חבר\'ה, קדימה!','Guys, let us go!')],
 giveup:[R2('...טוב, הפעם התמזל לך.','...fine, lucky this time.'),R2('פחדן! אני זוכר אותך!','Coward! I remember you!'),R2('אוף, אין לי כוח לרוץ.','Ugh, I cannot run anymore.'),R2('בפעם הבאה!','Next time!')],
 ownerChase:[R2('זה הרכב שלי!!!','That is MY car!!!'),R2('תחזיר לי את האוטו!','Give me back my car!'),R2('יש לי עוד 30 תשלומים עליו!','I still have 30 payments on it!'),R2('גנב! הרדיו שלי שם!','Thief! My radio is in there!'),R2('הכלב שלי במושב האחורי!','My dog is in the back seat!')],
 windowBang:[R2('תפתח!!!','Open up!!!'),R2('צא מהרכב!','Get out of the car!'),R2('אני רואה אותך שם!','I can see you in there!'),R2('תפתח את הדלת, עכשיו!','Open the door, now!')],
 honkMad:[R2('אתה חוסם את כל הכביש!','You are blocking the whole road!'),R2('זה כביש, לא סלון!','This is a road, not a living room!'),R2('אני מאחר לעבודה בגללך!','I am late for work because of you!'),R2('צא החוצה ונדבר!','Get out and let us talk!')],
 jacked:[R2('מה?! שוב?!','What?! Again?!'),R2('זה כבר השלישי השבוע!','That is the third one this week!'),R2('לפחות תחזיר מלא!','At least bring it back full!')],
 snatchVic:[R2('גנב! תעצרו אותו!','Thief! Stop him!'),R2('התיק שלי!','My bag!'),R2('מישהו! הוא לקח לי את הארנק!','Someone! He took my wallet!'),R2('יש לו את התרופות של החתול שלי!','He has my cat\'s medicine!')],
 snatchThanks:[R2('אתה מלאך! תודה!','You are an angel! Thank you!'),R2('אני אספר לכל הבניין עליך!','I will tell the whole building about you!'),R2('קח, קח, תקנה לך משהו!','Take it, buy yourself something!')],
 snatchLost:[R2('הוא ברח... ואף אחד לא עשה כלום.','He got away... and nobody did anything.'),R2('העיר הזאת...','This city...')],
 thiefRun:[R2('זוזו!','Move!'),R2('לא ראיתם כלום!','You saw nothing!'),R2('אני רק שומר את זה בשבילה!','I am just holding it for her!')],
 thiefCaught:[R2('אוקיי, אוקיי! הנה!','Okay, okay! Here!'),R2('זה היה התיק הראשון שלי!','That was my first bag!'),R2('אל תספר לאמא שלי!','Do not tell my mom!')],
 copStop:[R2('עצור! משטרה!','Stop! Police!'),R2('תעצור את הבחור הזה!','Stop that guy!'),R2('אין לך לאן לברוח!','You have nowhere to run!'),R2('אני כבר בן 50, תעצור!','I am fifty, just stop!')],
 copGot:[R2('תפסתי אותך! אתה עצור.','Got you! You are under arrest.'),R2('...הלב שלי. אבל תפסתי אותך.','...my heart. But I got you.')],
 copThanks:[R2('תודה, אזרח. אני לא אשכח את זה.','Thanks, citizen. I will not forget it.'),R2('יפה! אתה רוצה להצטרף לכוח?','Nice! Ever thought of joining the force?')],
 argue:[R2('אתה נכנסת בי!','You hit me!'),R2('אני?! אתה עצרת באמצע!','Me?! You stopped in the middle!'),R2('יש לי מצלמת דרך!','I have a dash cam!'),R2('גם לי! והיא רואה שאתה אשם!','So do I! And it shows it was you!'),R2('אתה יודע כמה עולה הפגוש הזה?','Do you know what this bumper costs?'),R2('יותר מהרכב שלך!','More than your car!'),R2('אני מתקשר לביטוח!','I am calling insurance!'),R2('אני מתקשר לאמא שלי!','I am calling my mom!')],
 argueFight:[R2('זהו, נמאס לי!','That is it, I have had enough!'),R2('בוא נסגור את זה כמו גברים!','Let us settle this like men!')]});
function drawEv2(inV){const E=G.ev2;if(!E||E.caught||(E.k!=='snatch'&&E.k!=='copchase'))return;const th=E.k==='snatch'?E.th:E.rb;if(!th||th.dead||th.remove)return;
  const icon=E.k==='snatch'?'👜':'🚔',pu=(Math.sin(G.time*5)+1)/2;
  const V0=G.view;if(V0&&th.x>V0[0]+70&&th.x<V0[2]-70&&th.y>V0[1]+70&&th.y<V0[3]-70){g.strokeStyle=`rgba(255,70,70,${0.5+pu*0.4})`;g.lineWidth=2.5;g.beginPath();g.arc(th.x,th.y,20+pu*6,0,TAU);g.stroke();g.font='18px sans-serif';g.textAlign='center';g.fillText(icon,th.x,th.y-30);return;}
  const V=G.view;if(!V)return;const [x0,y0,x1,y1]=V,cx=(x0+x1)/2,cy=(y0+y1)/2,dx=th.x-cx,dy=th.y-cy,hw=(x1-x0)/2-90,hh=(y1-y0)/2-90,k=Math.min(hw/Math.abs(dx||1e-6),hh/Math.abs(dy||1e-6),1),ex=cx+dx*k,ey=cy+dy*k,a=Math.atan2(dy,dx);
  g.save();g.translate(ex,ey);g.fillStyle='rgba(10,12,22,0.75)';g.beginPath();g.arc(0,0,22,0,TAU);g.fill();g.rotate(a);g.fillStyle='#ff5050';g.beginPath();g.moveTo(30,0);g.lineTo(18,-9);g.lineTo(18,9);g.fill();g.restore();g.font='20px sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText(icon,ex,ey+1);g.textBaseline='alphabetic';}
