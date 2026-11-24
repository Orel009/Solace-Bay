// ---------- jumping, roofs, ladders, damage, reactions, activities ----------
const LADS=[],JT=0.5;
const R2=(he,en)=>({he,en});
const REACT={bump:[R2('היי! תיזהר!','Hey! Watch it!'),R2('מה הבעיה שלך?','What is your problem?')],shots:[R2('יריות! רוצו!','Shots! Run!'),R2('אלוהים אדירים!','Oh my god!')],
 gun:[R2('יש לו נשק!','He has a gun!'),R2('אל תירה!',"Don't shoot!")],car:[R2('משוגע!','Maniac!'),R2('תלמד לנהוג!','Learn to drive!')],horn:[R2('מה אתה צופר?!','Stop honking!'),R2('סבלנות!','Patience!')],
 body:[R2('שמישהו יזמין אמבולנס!','Somebody call an ambulance!'),R2('אני לא ראיתי כלום...','I saw nothing...')],boom:[R2('מה זה היה?!','What was that?!'),R2('פיצוץ!','Explosion!')],
 call:[R2('הלו, משטרה? ראיתי הכול!','Hello, police? I saw everything!')],mug:[R2('קח! רק אל תפגע בי!',"Take it! Just don't hurt me!")],fight:[R2('אתה רוצה מכות?','You want a fight?'),R2('בוא הנה!','Come here!')],
 thanks:[R2('תודה! הצלת אותי!','Thank you! You saved me!')],crash:[R2('הרסת לי את האוטו!','You wrecked my car!')],vendor:[R2('נקניקייה חמה, 20 דולר!','Hot dogs, 20 bucks!')],snack:[R2('בתיאבון!','Enjoy!')],
 full:[R2('אתה נראה שבע, חבר.','You look full, pal.')],fare:[R2('תודה, נהג.','Thanks, driver.')],help:[R2('הצילו!','Help!')],rain:[R2('איזה מבול...','What a downpour...')],cop:[R2('עצור! משטרה!','Freeze! Police!'),R2('ידיים למעלה!','Hands up!')]};
function react(p,key){if(!p||G.sayCD>0)return;G.sayCD=0.9;say(p,key);if(p.kind==='dog')sfx.bark(dv(p.x,p.y));else sfx.voice(p,dv(p.x,p.y));}
function nearestCiv(x,y,r){let b=null,bd=r;for(const p of G.peds){if(p.type!=='civ'||p.dead)continue;const d=hyp(p.x-x,p.y-y);if(d<bd){bd=d;b=p;}}return b;}
function bAt(x,y){return BUILDINGS[BMAP[Math.floor(y/T)*MW+Math.floor(x/T)]];}

function addLadder(b,side,pos){const x0=b.x*T,y0=b.y*T,x1=(b.x+b.w)*T,y1=(b.y+b.h)*T;let l;
  if(side===2)l={gx:pos,gy:y1+15,rx:pos,ry:y1-17,wx:pos,wy:y1};else if(side===0)l={gx:pos,gy:y0-15,rx:pos,ry:y0+17,wx:pos,wy:y0};
  else if(side===1)l={gx:x1+15,gy:pos,rx:x1-17,ry:pos,wx:x1,wy:pos};else l={gx:x0-15,gy:pos,rx:x0+17,ry:pos,wx:x0,wy:pos};
  l.b=b;l.side=side;LADS.push(l);(b.lads||(b.lads=[])).push(l);}
function genLadders(){const ok=t=>t===TL.WALK||t===TL.CONC||t===TL.GRASS||t===TL.LOT||t===TL.SAND;
  for(const b of BUILDINGS){if(b.cont||b.army||b.hangar||b.court||b.lh||b.lads||(b.shops&&!b.lad)||b.ht>2.8)continue;if(b.seed%3&&!b.lad)continue;
    const tries=[[2,b.x+(b.w>>1),b.y+b.h],[0,b.x+(b.w>>1),b.y-1],[1,b.x+b.w,b.y+(b.h>>1)],[3,b.x-1,b.y+(b.h>>1)]];
    for(const [s,tx,ty] of tries)if(ok(tget(tx,ty))){addLadder(b,s,(s%2===0?tx:ty)*T+T/2);break;}}
  const c=POI.court;addLadder(c.bs,2,c.x);addLadder(c.bs,0,c.x);
  let rn=0;const RT=['cash','token','armor','token','smg','cash','token','shotgun','health','token','grenade','cash'];
  for(const l of LADS){const b=l.b;if(b.court||b.w<2||b.h<2||b.rt)continue;if((rn++)%3)continue;b.rt=1;const ty=RT[(rn/3|0)%RT.length],x=(b.x+b.w/2)*T,y=(b.y+b.h/2)*T;
    if(ty==='token')TOKENS.push({id:TOKENS.length,x,y,h:b.ht});else WPICKS.push({type:ty,x,y,h:b.ht,amt:ty==='cash'?400:0,once:ty==='cash'?'c'+rn:null});}}

function playerH(){const P=G.player;if(P.climb){const c=P.climb;return c.l.b.ht*Math.min(1,c.up?c.t:1-c.t);}return(P.roof?P.roof.ht:0)+(P.jump>0?Math.sin(Math.PI*(1-P.jump/JT))*0.9:0);}
function pMove(P,dx,dy){if(P.inside){roomMove(P,dx,dy);return;}
 const base=P.roof?P.roof.ht:0,air=P.jump>0,lim=base+(air?0.95:0.45);
  const solid=(t,tx,ty)=>{if(t===TL.BLD){const b=BUILDINGS[BMAP[ty*MW+tx]];return air?b.ht>lim:(P.roof?Math.abs(b.ht-base)>0.45:true);}
    if(P.roof&&!air)return true;if(t===TL.FENCE)return !air;return false;};
  P.x+=dx;let c=circlePush(P.x,P.y,9,solid);if(c){P.x+=c[0];P.y+=c[1];}P.y+=dy;c=circlePush(P.x,P.y,9,solid);if(c){P.x+=c[0];P.y+=c[1];}
  if(P.roof&&!air&&tileAt(P.x,P.y)===TL.BLD){const b=bAt(P.x,P.y);if(b!==P.roof)P.roof=b;}}
function land(P){P.jump=0;G.jumpCD=0.12;const base=P.roof?P.roof.ht:0,t=tileAt(P.x,P.y),nb=t===TL.BLD?bAt(P.x,P.y):null,nh=nb?nb.ht:0;
  if(base-nh>1.4){G.stats.falls++;hurtPed(P,(base-nh-1)*9,null,'fall');G.hurtFlash=0.5;G.shake=5;if(base-nh>2)post('fall');}
  for(let k=0;k<8;k++)part('steam',P.x+rr(-6,6),P.y+rr(-6,6),rr(-70,70),rr(-70,70),0.45,rr(3,7));
  P.roof=nb;if(!nb&&t===TL.WATER){splash(P.x,P.y,10);sfx.splash();}else sfx.step();}
function plusFoot(P,dt,jp){if(G.jumpCD>0)G.jumpCD-=dt;
  if(P.climb){const c=P.climb,l=c.l;c.t+=dt/(0.35+l.b.ht*0.3);const t=Math.min(1,c.up?c.t:1-c.t);P.x=lerp(l.gx,l.rx,t);P.y=lerp(l.gy,l.ry,t);P.a=Math.atan2(l.ry-l.gy,l.rx-l.gx);P.walk+=dt*90;P.mvx=P.mvy=0;
    if(c.t>=1){P.roof=c.up?l.b:null;P.climb=null;}return true;}
  if(!(P.jump>0)&&!P.inside){let near=null;const onR=!!P.roof;for(const l of LADS){const ax=onR?l.rx:l.gx,ay=onR?l.ry:l.gy;if(hyp(P.x-ax,P.y-ay)>(onR?30:36))continue;near=l;
      const dx=onR?l.gx-l.rx:l.rx-l.gx,dy=onR?l.gy-l.ry:l.ry-l.gy,dl=hyp(dx,dy);if(((P.mvx||0)*dx+(P.mvy||0)*dy)/dl>45){P.ladT=(P.ladT||0)+dt;if(P.ladT>0.22){P.ladT=0;P.climb={l,t:0,up:!onR};G.nearLad=null;sfx.door();return true;}}else P.ladT=0;break;}
    if(near&&!G.seen.lad){G.seen.lad=1;toast(tr('ladHint'),5);}G.nearLad=near;}
  if(P.jump>0){P.jump-=dt;if(P.jump<=0)land(P);}
  else if(jp&&!P.swim&&G.jumpCD<=0){P.jump=JT;sfx.jump();for(let k=0;k<7;k++)part('steam',P.x+rr(-6,6),P.y+rr(-6,6),rr(-55,55),rr(-55,55),0.4,rr(3,6));}
  return false;}
function tryLadder(){const P=G.player;for(const l of LADS){if(P.roof){if(hyp(P.x-l.rx,P.y-l.ry)<40){P.climb={l,t:0,up:false};sfx.door();return true;}}
  else if(hyp(P.x-l.gx,P.y-l.gy)<60){P.climb={l,t:0,up:true};sfx.door();return true;}}return false;}

// ---------- vehicle damage ----------
function addDentDir(v,dx,dy,sev){if(sev<=0||v.t.tank||!(v.onScreen||v.driver===G.player))return;const t=v.t,Lh=t.l/2,Wh=t.w/2,ca=Math.cos(v.a),sa=Math.sin(v.a);
  const lx=clamp((dx*ca+dy*sa)*Lh*1.5,-Lh+3,Lh-3),ly=clamp((-dx*sa+dy*ca)*Wh*1.5,-Wh+3,Wh-3);
  const ds=v.dents||(v.dents=[]);ds.push({x:lx+rr(-3,3),y:ly+rr(-3,3),r:clamp(4+sev*0.07,4,13),s:rand()});if(ds.length>9)ds.shift();
  if(sev>40){if(lx>Lh*0.5)v.hlB=(v.hlB||0)|(ly<0?1:2);if(lx<-Lh*0.5)v.tlB=(v.tlB||0)|(ly<0?1:2);}
  if(sev>130&&!v.pull)v.pull=rr(-0.14,0.14);}
function addHole(v,wx,wy){const ca=Math.cos(v.a),sa=Math.sin(v.a),dx=wx-v.x,dy=wy-v.y,hs=v.holes||(v.holes=[]);hs.push({x:dx*ca+dy*sa,y:-dx*sa+dy*ca});if(hs.length>14)hs.shift();}
function repairVeh(v){v.hp=v.t.hp;v.fuse=0;v.dents=null;v.holes=null;v.hlB=0;v.tlB=0;v.pull=0;}
function drawDamage(v){const t=v.t,Lh=t.l/2,Wh=t.w/2,dm=1-v.hp/t.hp,car=!t.boat&&!t.bike&&!t.tank;if(!v.dents&&!v.holes&&dm<0.45)return;
  g.save();rrect(g,-Lh,-Wh,t.l,t.w,7);g.clip();
  if(v.dents)for(const dn of v.dents){g.fillStyle='rgba(0,0,0,0.42)';g.beginPath();for(let k=0;k<7;k++){const a=k*TAU/7,r=dn.r*(0.65+((dn.s*(k+1)*7.3)%1)*0.6);g.lineTo(dn.x+Math.cos(a)*r,dn.y+Math.sin(a)*r);}g.closePath();g.fill();
    g.strokeStyle='rgba(255,255,255,0.24)';g.lineWidth=1;g.beginPath();g.moveTo(dn.x-dn.r*0.6,dn.y-dn.r*0.2);g.lineTo(dn.x+dn.r*0.5,dn.y+dn.r*0.4);g.moveTo(dn.x-dn.r*0.2,dn.y+dn.r*0.6);g.lineTo(dn.x+dn.r*0.7,dn.y-dn.r*0.3);g.stroke();}
  if(v.holes){g.fillStyle='#0a0a0a';for(const h of v.holes){g.beginPath();g.arc(h.x,h.y,1.7,0,TAU);g.fill();}}
  if(car&&dm>0.4){const fx=Lh*0.24+6;g.strokeStyle='rgba(255,255,255,0.6)';g.lineWidth=0.8;g.beginPath();for(let k=0;k<5;k++){g.moveTo(fx,-2);g.lineTo(fx+Math.cos(k*1.3)*6,-2+Math.sin(k*1.3)*(Wh-4));}g.stroke();}
  if(car&&dm>0.68){g.fillStyle='rgba(0,0,0,0.5)';g.fillRect(Lh*0.5,-Wh+3,Lh*0.42,t.w-6);}
  g.fillStyle='#161616';if(v.hlB&1)g.fillRect(Lh-4,-Wh+2,5,8);if(v.hlB&2)g.fillRect(Lh-4,Wh-10,5,8);if(v.tlB&1)g.fillRect(-Lh-1,-Wh+2,5,8);if(v.tlB&2)g.fillRect(-Lh-1,Wh-10,5,8);
  g.restore();}

// ---------- ped behaviours ----------
function plusBrawl(p,dt){const P=G.player;if(P.dead||P.veh||P.roof||P.climb){p.brawl=0;return false;}p.brawl-=dt;const d=hyp(P.x-p.x,P.y-p.y);p.a=Math.atan2(P.y-p.y,P.x-p.x);if(p.hitT>0)p.hitT-=dt;
  const W=WEAP[G.weapon]||{};if(G.weapon!=='fist'&&!W.melee&&d<320){gunReact(p);return true;}
  if(p.dodge>0){p.dodge-=dt;const s=p.id%2?1:-1;movePed(p,-Math.sin(p.a)*s*140*dt,Math.cos(p.a)*s*140*dt);return true;}
  if(d>23)walkDir(p,128,dt);else{p.walk=0;if(G.punchT>0.15&&rand()<dt*3){p.dodge=0.25;return true;}
    if(p.cool<=0&&!(P.jump>0)){p.bc=(p.bc||0)+1;const K=KINDS[p.kind]||{},kick=p.bc%3===0,dmg=(kick?11:6)*(K.tough?1.3:1);p.cool=kick?1.1:rr(0.55,0.85);p.hitK=kick?'kick':p.bc%2?'jab':'cross';p.hitT=0.22;
      hurtPed(P,dmg,p,'punch');sfx.punch();const kb=kick?220:110;P.kvx=Math.cos(p.a)*kb;P.kvy=Math.sin(p.a)*kb;G.hurtFlash=0.4;if(kick)G.shake=Math.max(G.shake||0,3);if(p.sayT<=0&&rand()<0.3)say(p,'fight');}}return true;}
function plusPrey(p,dt){const q=p.prey;if(!q||q.dead||q.remove){p.prey=null;return false;}const d=hyp(q.x-p.x,q.y-p.y);p.a=Math.atan2(q.y-p.y,q.x-p.x);
  if(d>22)walkDir(p,118,dt);else if(p.cool<=0){p.cool=1;hurtPed(q,6,p,'punch');sfx.punch();}q.st='flee';q.ft=2;q.fx=p.x;q.fy=p.y;if(q.sayT<=0&&rand()<dt)say(q,'help');return true;}
function plusWar(p,dt){p.wt=(p.wt||0)-dt;if(p.wt<=0){p.wt=0.7;let b=null,bd=330;for(const o of G.peds){if(!o.war||o.dead||o.faction===p.faction)continue;const d=hyp(o.x-p.x,o.y-p.y);if(d<bd){bd=d;b=o;}}p.tg=b;}
  const o=p.tg;if(!o||o.dead)return false;const d=hyp(o.x-p.x,o.y-p.y);p.a=Math.atan2(o.y-p.y,o.x-p.x);if(d>170)walkDir(p,95,dt);else p.walk=0;
  if(p.cool<=0&&los(p.x,p.y,o.x,o.y)){p.cool=rr(0.7,1.3);fire(p,null,p.x,p.y,p.a,10,0.16);}return true;}
function plusWitness(){if(G.callCD>0)return;const P=G.player;if(P.roof)return;let best=null,bd=340;
  for(const p of G.peds){if(p.type!=='civ'||p.kind==='dog'||p.dead||p.stun>0||p.st==='call'||p.brawl>0)continue;const d=hyp(p.x-P.x,p.y-P.y);if(d<bd&&d>70&&los(p.x,p.y,P.x,P.y)){bd=d;best=p;}}
  if(best){best.st='call';best.callT=4.5;best.fx=P.x;best.fy=P.y;G.callCD=15;say(best,'call',4.5);}}
function findSpot(rmin,rmax){const P=G.player;for(let k=0;k<30;k++){const a=rr(0,TAU),r=rr(rmin,rmax),x=P.x+Math.cos(a)*r,y=P.y+Math.sin(a)*r,t=tileAt(x,y);if((t===TL.WALK||t===TL.CONC)&&!onScreen(x,y,60))return{x,y};}return null;}
function plusEvents(dt){const P=G.player;if(G.sayCD>0)G.sayCD-=dt;if(G.callCD>0)G.callCD-=dt;
  const ev=G.ev;if(ev){if(ev.v.dead||ev.v.remove||hyp(ev.v.x-P.x,ev.v.y-P.y)>1900)G.ev=null;
    else if(ev.t.dead||ev.t.stun>0){say(ev.v,'thanks',3.5);ev.v.st='idle';ev.v.tm=3;mkPickup('cash',ev.v.x+14,ev.v.y,{amt:150});toast(tr('thanks'));G.rep=Math.min(50,G.rep+6);post('hero');ev.t.prey=null;G.ev=null;}}
  // seeing a drawn gun
  G.gunT=(G.gunT||0)-dt;if(G.gunT<=0){G.gunT=0.5;if(!P.veh&&!P.roof&&G.weapon!=='fist'&&!P.swim)for(const p of G.peds){if(p.type!=='civ'||p.dead||p.st==='flee'||p.st==='cower'||p.st==='call'||p.brawl>0)continue;
      if(hyp(p.x-P.x,p.y-P.y)<105&&rand()<0.45){p.st='flee';p.ft=3.5;p.fx=P.x;p.fy=P.y;react(p,'gun');}}}
  G.evT=(G.evT===undefined?40:G.evT)-dt;if(G.evT>0||G.wanted>0||P.dead)return;G.evT=rr(55,95)*(G.done.includes('m5')?0.55:1);const s=findSpot(480,820);if(!s)return;
  if(rand()<0.5){for(let k=0;k<3;k++){mkPed('gang',s.x+rr(-30,30),s.y+rr(-30,30),{faction:'saints',war:1});mkPed('gang',s.x+140+rr(-30,30),s.y+rr(-40,40),{faction:'tide',war:1});}}
  else{const v=mkPed('civ',s.x,s.y),t=mkPed('gang',s.x+50,s.y+10,{faction:'thug',shirt:'#3a3a3a',wpn:null});t.prey=v;G.ev={v,t};}}
function plusTaxi(dt){const P=G.player,v=P.veh;if(G.fareCD>0)G.fareCD-=dt;
  if(G.fare&&(!v||v!==G.fare.v)){G.fare=null;toast(tr('fareLost'));return;}
  if(!v||!v.t.taxi||G.mission)return;
  if(!G.fare){if(G.fareCD>0||Math.abs(v.speed)>25||G.wanted>0)return;
    for(const p of G.peds){if(p.type!=='civ'||p.kind==='dog'||p.dead||p.st==='flee'||p.stun>0||p.brawl>0||hyp(p.x-v.x,p.y-v.y)>78)continue;
      let n=null;for(let k=0;k<24&&!n;k++){const q=nodePos(ri(0,XS.length-1),ri(0,YS.length-1)),d=hyp(q.x-v.x,q.y-v.y);if(d>1300&&d<3800)n={x:q.x+T*1.6,y:q.y+T*1.6,d};}
      if(!n)return;p.remove=true;G.fare={x:n.x,y:n.y,r:80,v,pay:Math.round(n.d/18),t:n.d/150+12};toast(tr('fare'),3.5);sfx.door();return;}}
  else{G.fare.t-=dt;if(hyp(v.x-G.fare.x,v.y-G.fare.y)<95&&Math.abs(v.speed)<70){const pay=G.fare.pay+(G.fare.t>0?Math.round(G.fare.pay*0.5):0);G.money+=pay;toast(fmt(tr('farePaid'),pay));sfx.pass();G.rep=Math.min(50,G.rep+2);post('taxi');
      const p=mkPed('civ',v.x-Math.sin(v.a)*30,v.y+Math.cos(v.a)*30);say(p,'fare');G.fare=null;G.fareCD=2.5;}}}
function plusHeli(dt){const P=G.player;if(G.heliCD>0)G.heliCD-=dt;let h=G.heli;
  if(!h){if(G.wanted>=3&&!(G.heliCD>0)&&!P.dead){const a=rr(0,TAU);G.heli={x:P.x+Math.cos(a)*1100,y:P.y+Math.sin(a)*1100,a:0,vx:0,vy:0,see:false,ph:0,hp:280};toast(tr('heli'));}return;}
  const leave=G.wanted<3||P.dead;let tx,ty;
  if(leave){tx=h.x+(h.x-P.x)*2+1;ty=h.y+(h.y-P.y)*2+1;if(hyp(h.x-P.x,h.y-P.y)>1500){G.heli=null;return;}}
  else if(G.seenNow||h.see){tx=P.x;ty=P.y;}else{const ls=G.lastSeen||P;h.ph+=dt*0.7;tx=ls.x+Math.cos(h.ph)*270;ty=ls.y+Math.sin(h.ph*1.3)*270;}
  const dx=tx-h.x,dy=ty-h.y,d=hyp(dx,dy)||1,sp=Math.min(265,d*1.5),k=Math.min(1,dt*1.5);h.vx=lerp(h.vx,dx/d*sp,k);h.vy=lerp(h.vy,dy/d*sp,k);h.x+=h.vx*dt;h.y+=h.vy*dt;
  if(hyp(h.vx,h.vy)>20)h.a+=angDiff(h.a,Math.atan2(h.vy,h.vx))*Math.min(1,dt*3);
  h.see=!leave&&!P.inside&&hyp(P.x-h.x,P.y-h.y)<195;}
function heliHit(b){const h=G.heli;if(!h||!b.expl||b.op!==G.player||hyp(b.x-h.x,b.y-h.y)>48)return false;explodeAt(h.x,h.y,G.player);G.heli=null;G.heliCD=50;toast(tr('heliDown'));G.money+=500;addHeat(4);post('heli');return true;}
function plusAmbient(dt){if(rand()<dt*3&&G.view){const v=G.view,x=rr(v[0],v[2]),y=rr(v[1],v[3]),tx=Math.floor(x/T),ty=Math.floor(y/T);
  if(tget(tx,ty)===TL.ROAD&&TSH[ty*MW+tx]>0.93)for(let k=0;k<3;k++)part('steam',tx*T+32+rr(-6,6),ty*T+32+rr(-6,6),rr(-8,8)-ENV.wind*20,rr(-26,-12),rr(1.6,2.6),rr(6,10));}}
function vendorTalk(p){const P=G.player;if(P.hp>=100){say(p,'full');return;}const fr=owned('b_dogs');if(!fr&&G.money<20){say(p,'vendor');return;}if(!fr)G.money-=20;P.hp=Math.min(100,P.hp+45);say(p,'snack');sfx.blip();toast(tr('snack'),1.6);}

// ---------- weapon icons ----------
const WSV=s=>`<svg class="wic" viewBox="0 0 48 24" fill="currentColor">${s}</svg>`;
const WICON={fist:WSV('<path d="M14 9a3 3 0 0 1 6 0a3 3 0 0 1 6 0a3 3 0 0 1 6 0v7a6 6 0 0 1-6 6h-6a6 6 0 0 1-6-6z"/><rect x="9" y="11" width="5" height="8" rx="2.5"/>'),
 pistol:WSV('<path d="M8 5h28v3h2v4H24l-2 4h-6l-1 7H8l2-11H8z"/>'),
 smg:WSV('<path d="M3 7h30V5h3v2h8v3h-8v2h-8v10h-5V12h-7l-2 6h-5l1-6H3z"/>'),
 shotgun:WSV('<path d="M2 8h44v3H34v3H22v-2h-6l-4 8H5l4-9H2z"/>'),
 rifle:WSV('<path d="M2 9h9l2-3h20v2h13v3H35v2h-6l-1 9h-5l-1-8h-6l-2 6H9l2-7H2z"/><rect x="18" y="3" width="10" height="2"/>'),
 flame:WSV('<rect x="3" y="5" width="11" height="14" rx="3"/><path d="M14 10h22v4H14z"/><path d="M37 6c5 2 8 4 9 6c-1 2-4 4-9 6c2-2 2-4 0-6c2-2 2-4 0-6z"/><rect x="20" y="14" width="4" height="7"/>'),
 rocket:WSV('<path d="M4 8h30v8H4z"/><path d="M34 5h6v14h-6z"/><path d="M40 8l6 4-6 4z"/><rect x="13" y="16" width="5" height="7"/><rect x="24" y="16" width="3" height="5"/>'),
 grenade:WSV('<ellipse cx="22" cy="15" rx="8" ry="8.5"/><rect x="19" y="3" width="6" height="5"/><path d="M25 3h8v9h-2.5V5.5H25z"/>'),
 armor:WSV('<path d="M14 3h6l4 3 4-3h6l4 6-4 3v9H14v-9l-4-3z"/>')};
