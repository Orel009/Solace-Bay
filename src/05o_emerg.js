// ---------- v6: faster emergency services, cops return to their cars, fire crews, health ----------
Object.assign(VT.police,{max:505,acc:460,grip:7,turn:3});Object.assign(VT.ambulance,{max:520,acc:420});Object.assign(VT.firetruck,{max:440,acc:320});
Object.assign(STR.he,{fireCome:'מכבי האש בדרך',fireOut:'הכבאים כיבו את השריפה',healthPick:'+חיים',regen:'החיים מתמלאים לאט כשלא פוגעים בך'});
Object.assign(STR.en,{fireCome:'The fire department is on its way',fireOut:'The firefighters put out the fire',healthPick:'+Health',regen:'Health slowly refills while you are not being hurt'});
Object.assign(REACT,{copRun:[R2('חזרה לניידת!','Back to the car!'),R2('הוא בורח ברכב!','He is driving off!'),R2('לניידת, מהר!','To the cruiser, quick!'),R2('אל תאבדו אותו!','Do not lose him!')],
 fireman:[R2('כולם אחורה!','Everybody back!'),R2('תפתחו את הזרנוק!','Open the hose!'),R2('עוד אחד? מי מצית את כל המכוניות האלה?','Another one? Who keeps torching these cars?'),R2('תנו לנו לעבוד!','Let us work!')],
 fireDone:[R2('כבוי. מישהו שמר על נקניקייה?','Out. Anyone save a hot dog?'),R2('מתחילים לחזור לתחנה.','Heading back to the station.'),R2('עוד יום רגיל בסולס ביי.','Just another day in Solace Bay.')]});
// --- cops walk back to their cruiser and keep chasing or leave ---
function copReturn(p,dt){const v=p.car,P=G.player;if(!v||v.dead||v.remove||v.sunk||v===P.veh||(v.driver&&v.driver!=='cop')){p.car=null;return false;}
  const dP=hyp(P.x-p.x,P.y-p.y),go=G.wanted===0||(P.veh&&dP>170&&Math.abs(P.veh.speed)>50)||dP>700;if(!go||p.stun>0)return false;
  const dx=v.x-p.x,dy=v.y-p.y,d=hyp(dx,dy);
  if(d>v.t.w*0.5+30){p.a=Math.atan2(dy,dx);walkDir(p,G.wanted>0?160:85,dt);if(G.wanted>0&&p.sayT<=0&&rand()<dt*0.5&&onScreen(p.x,p.y,0)){say(p,'copRun');sfx.voice(p,dv(p.x,p.y));}return true;}
  p.remove=true;v.door=0.7;if(onScreen(v.x,v.y,0))sfx.door();v.occ=Math.min(2,(v.occ||0)+1);
  const mates=G.peds.some(o=>o!==p&&o.car===v&&!o.dead&&!o.remove&&hyp(o.x-v.x,o.y-v.y)<500);
  if(!v.driver||!v.ai){v.driver='cop';if(G.wanted>0){v.ai={mode:'chase',faction:'police',stuck:0,rev:0,wait:mates?3:0};v.siren=true;}else{v.siren=false;trafficFromHere(v);v.persist=false;}}
  else if(v.ai&&v.ai.wait>0&&!mates)v.ai.wait=0;return true;}
// --- shared responder driving: invisible catch-up off screen, careful arrival on screen ---
function respDrive(v,tx,ty,dt,stopAt){const ai=v.ai;if(!onScreen(v.x,v.y,140)&&hyp(v.x-tx,v.y-ty)>380){if(!ai.wp||hyp(ai.wp.x-v.x,ai.wp.y-v.y)<40)ai.wp=nextNodeToward(v.x,v.y,tx,ty);
    const dx=ai.wp.x-v.x,dy=ai.wp.y-v.y,dd=hyp(dx,dy)||1,st=Math.min(dd,360*dt);v.x+=dx/dd*st;v.y+=dy/dd*st;v.a=Math.atan2(dy,dx);v.vx=dx/dd*320;v.vy=dy/dd*320;v.speed=320;v.thr=0;v.str=0;ai.stuck=0;return 1e9;}
  const d=chaseDrive(v,tx,ty,dt);if(v.speed>d*0.75+70)v.thr=-0.7;if(d<stopAt){v.thr=v.speed>20?-1:0;v.str=0;v.hb=1;}return d;}
function spawnResponder(type,tx,ty){const rn=ringNodes(tx,ty,800,1700).filter(([i,j])=>{const q=nodePos(i,j);return !onScreen(q.x,q.y,80);});if(!rn.length)return null;
  const [i,j]=pick(rn),q=nodePos(i,j),v=mkVeh(type,q.x,q.y,0);v.a=Math.atan2(ty-q.y,tx-q.x);v.driver='civ';v.persist=true;v.siren=true;v.ai={mode:'medic',stuck:0,rev:0,wp:null};return v;}
// --- fire crews ---
function fireWatch(dt){const P=G.player;if(!G.fireJob&&G.fireCD2>0)G.fireCD2-=dt;
  for(const v of G.vehicles)if(v.dead&&v.deadT==null)v.deadT=G.time;
  for(const v of G.vehicles){if(!v.dead||v.fireOut||!v.onScreen||G.time-v.deadT>(v.burnFor||(v.burnFor=rr(25,45))))continue;if(rand()<0.6){part('fire',v.x+rr(-v.t.l*0.3,v.t.l*0.3),v.y+rr(-8,8),rr(-15,15),rr(-60,-25),rr(0.4,0.8),rr(6,12));if(rand()<0.4)part('smoke',v.x+rr(-10,10),v.y,rr(-20,20)-ENV.wind*30,rr(-70,-30),rr(1.4,2.4),rr(10,16));}}
  if(!G.fireJob){if((G.fireCD2||0)>0||G.wanted>=4||P.inside)return;let tgt=null;
    for(const v of G.vehicles){if(v.t.boat||v.t.plane||v.fireOut||v.sunk||hyp(v.x-P.x,v.y-P.y)>950)continue;if((v.fuse>0&&v.driver!==P)||(v.dead&&G.time-v.deadT<20)){tgt=v;break;}}
    if(tgt){G.fireJob={w:tgt,t:rr(3,6)};tgt.persist=true;}return;}
  const J=G.fireJob,w=J.w;if(w.remove||(!w.dead&&!(w.fuse>0))||w===P.veh&&!w.dead){endFire();return;}
  if(!J.v){J.t-=dt;if(J.t>0)return;J.v=spawnResponder('firetruck',w.x,w.y);if(!J.v){J.t=2;return;}J.st='drive';J.T=50;if(hyp(w.x-P.x,w.y-P.y)<800)toast(tr('fireCome'),2.5);return;}
  const v=J.v;J.T-=dt;if(v.dead||v.driver===P||J.T<0){endFire();return;}
  if(J.st==='drive'){const d=respDrive(v,w.x,w.y,dt,380);if(d<380&&Math.abs(v.speed)<25){J.st='spray';J.crew=[];for(const s of [-1,1]){const m=mkPed('civ',v.x-Math.sin(v.a)*s*30,v.y+Math.cos(v.a)*s*30);setKind(m,'worker');m.shirt='#c9a227';m.pants='#2b2b33';m.hat='#c0392b';m.persist=true;m.medicP=1;J.crew.push(m);}say(J.crew[0],'fireman',2.5);sfx.door();J.work=0;}}
  else if(J.st==='spray'){v.thr=0;v.hb=1;let ready=0;for(const m of J.crew){if(m.dead)continue;const dx=w.x-m.x,dy=w.y-m.y,d=hyp(dx,dy);m.a=Math.atan2(dy,dx);if(d>85){pMove(m,dx/d*120*dt,dy/d*120*dt);m.walk+=120*dt;}else{m.walk=0;ready++;
      if(rand()<0.85){const a=m.a+rr(-0.12,0.12),sp=rr(260,340);part('water',m.x+Math.cos(m.a)*14,m.y+Math.sin(m.a)*14,Math.cos(a)*sp,Math.sin(a)*sp,rr(0.25,0.35),rr(3,5));}}}
    if(ready){J.work+=dt;if(rand()<dt*5)part('steam',w.x+rr(-20,20),w.y+rr(-14,14),rr(-20,20),rr(-50,-20),rr(1,1.8),rr(10,16));if(J.work>4){if(w.dead)w.fireOut=true;else{w.fuse=0;w.hp=Math.max(w.hp,w.t.hp*0.3);}J.st='back';say(J.crew[1]||J.crew[0],'fireDone',3);if(hyp(w.x-P.x,w.y-P.y)<700)toast(tr('fireOut'),2.5);}}}
  else if(J.st==='back'){let n=0;for(const m of J.crew){if(m.remove||m.dead)continue;n++;const dx=v.x-m.x,dy=v.y-m.y,d=hyp(dx,dy);m.a=Math.atan2(dy,dx);if(d>30){pMove(m,dx/d*120*dt,dy/d*120*dt);m.walk+=120*dt;}else{m.remove=true;}}
    if(!n){sfx.door();v.siren=false;trafficFromHere(v);v.persist=false;w.persist=false;G.fireJob=null;G.fireCD2=10;}}}
function endFire(){const J=G.fireJob;if(J){if(J.w)J.w.persist=false;for(const m of J.crew||[]){m.persist=false;m.medicP=0;}if(J.v&&!J.v.dead&&J.v.driver==='civ'){J.v.siren=false;J.v.persist=false;trafficFromHere(J.v);}}G.fireJob=null;G.fireCD2=12;}
// --- health: player hits, regen, pickups ---
function bulletHitsPlayer(b){const P=G.player;if(b.op===P||P.dead||P.ride||P.inside||b.kind==='flame'&&0)return false;if((P.x-b.x)**2+(P.y-b.y)**2>160)return false;
  const v=P.veh;if(v&&!(v.t.bike||v.t.cart||v.t.buggy))return false;hurtPed(P,b.dmg*(v?0.6:1),b.op,'shot');if(b.kind==='flame'&&!v)P.burn=1.5;G.hurtFlash=Math.max(G.hurtFlash||0,0.45);G.shake=Math.max(G.shake||0,2.5);
  for(let k=0;k<4;k++)part('blood',P.x,P.y,rr(-60,60),rr(-60,60),0.35,3);if(b.expl)explodeAt(b.x,b.y,b.op);return true;}
function regenTick(dt){const P=G.player;if(P.dead||P.ride)return;if(P.burn>0){P.burn-=dt;hurtPed(P,10*dt,null,'burn');if(rand()<0.5)part('fire',P.x+rr(-5,5),P.y+rr(-5,5),0,-20,0.4,rr(4,7));}
  const quiet=G.time-(G.lastHurt||-99);if(quiet>5&&P.hp<75){P.hp=Math.min(75,P.hp+2.5*dt);if(!G.seen.regen&&P.hp<60){G.seen.regen=1;toast(tr('regen'),4);}}}
function genHealth(){const H=(x,y)=>WPICKS.push({type:'health',x,y});const ft=DECOR.filter(d=>d.t==='fountain');
  H(POI.hosp.x-50,POI.hosp.y+10);H(POI.hosp.x+50,POI.hosp.y+10);for(const f of ft)H(f.x+60,f.y+60);H(POI.pier.x-40,POI.pier.y+30);H(POI.safe.x+70,POI.safe.y+30);H(POI.airport.x-120,POI.airport.y+40);H(POI.airport2.x-120,POI.airport2.y+40);
  H(POI.brew.x-80,POI.brew.y);H(POI.dealer.x-120,POI.dealer.y+20);H(POI.club.x-90,POI.club.y+20);for(const p of PARKSPOTS.filter((_,i)=>i%41===7).slice(0,6))H(p.x,p.y);}
function fireBudget(p){const now=G.time,cap=G.wanted>=5?7:G.wanted>=3?5:3.5;G.fb=Math.min(cap,(G.fb??cap)+(now-(G.fbT??now))*cap*0.8);G.fbT=now;if(G.fb<1)return false;G.fb-=1;return true;}
