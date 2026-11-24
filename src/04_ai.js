function copSees(r){const P=G.player,px=P.x,py=P.y;
  for(const p of G.peds)if(p.type==='cop'&&!p.dead&&(p.x-px)**2+(p.y-py)**2<r*r)return true;
  for(const v of G.vehicles)if(v.t.police&&!v.dead&&v.driver==='cop'&&(v.x-px)**2+(v.y-py)**2<r*r)return true;
  return false;}
function crime(n,always){if(G.state!=='play')return;if(G.time-G.lastCrime<1.1)return;
  if(!always&&!copVisible()){plusWitness();return;}G.lastCrime=G.time;addHeat((always?1.5:0.7)*n);const P=G.player;G.lastSeen={x:P.x,y:P.y};G.seenVeh=P.veh?P.veh.id:0;G.seenOut=G.outfit;}
function los(x1,y1,x2,y2){const d=hyp(x2-x1,y2-y1),n=Math.ceil(d/24);for(let i=1;i<n;i++){const t=tileAt(x1+(x2-x1)*i/n,y1+(y2-y1)*i/n);if(t===TL.BLD||t===TL.FENCE)return false;}return true;}
function onScreen(x,y,m){const c=G.cam,hw=G.vw/2/c.s+m,hh=G.vh/2/c.s+m;return Math.abs(x-c.x)<hw&&Math.abs(y-c.y)<hh;}

// ---------- traffic ----------
function trafficAt(v,i,j,d,frac){const ni=i+DIRS[d][0],nj=j+DIRS[d][1];const a=exitPt(i,j,d),b=entryPt(ni,nj,d);
  v.x=lerp(a.x,b.x,frac);v.y=lerp(a.y,b.y,frac);v.a=d*Math.PI/2;
  v.ai={mode:'traffic',node:[ni,nj],d,wps:[b],blocked:0,stuck:0,rev:0,cruise:(v.t.bus?150:v.t.bike?230:190)+rr(-20,20)};}
function trafficFromHere(v){const [i,j]=nearestNode(v.x,v.y);let d=Math.round(((v.a%TAU)+TAU)%TAU/(Math.PI/2))%4;
  if(!validDir(i,j,d))d=[0,1,2,3].find(k=>validDir(i,j,k));
  v.ai={mode:'traffic',node:[i,j],d,wps:[entryPt(i,j,d)],blocked:0,stuck:0,rev:0,cruise:180};}
function pickDir(i,j,d){const opts=[];for(let k=0;k<4;k++){if(k===(d+2)%4||!validDir(i,j,k))continue;opts.push(k);if(k===d){opts.push(k);opts.push(k);}}return opts.length?pick(opts):(d+2)%4;}
function aiTraffic(v,dt){const ai=v.ai;if(!ai.wps.length){trafficFromHere(v);return;}
  let wp=ai.wps[0];const nk=ai.node[0]*100+ai.node[1];
  if(ai.nx==null||ai.nxN!==nk){ai.nx=pickDir(ai.node[0],ai.node[1],ai.d);ai.nxN=nk;}
  if(hyp(wp.x-v.x,wp.y-v.y)<30){ai.wps.shift();
    if(!ai.wps.length){const [i,j]=ai.node,nd=validDir(i,j,ai.nx)&&ai.nx!==(ai.d+2)%4?ai.nx:pickDir(i,j,ai.d);ai.wps.push(exitPt(i,j,nd));const ni=i+DIRS[nd][0],nj=j+DIRS[nd][1];ai.wps.push(entryPt(ni,nj,nd));ai.node=[ni,nj];ai.d=nd;v.blinkT=1.2;}
    wp=ai.wps[0];}
  {const tn=(ai.nx-ai.d+4)%4;if(ai.wps.length===1&&(tn===1||tn===3)&&hyp(wp.x-v.x,wp.y-v.y)<340)v.blink=tn===1?1:-1;else if(v.blinkT>0)v.blinkT-=dt;else v.blink=0;}
  const want=Math.atan2(wp.y-v.y,wp.x-v.x),diff=angDiff(v.a,want);
  if(ai.rev>0){ai.rev-=dt;v.thr=-0.7;v.str=-Math.sign(diff);v.hb=0;return;}
  v.str=clamp(diff*2.6,-1,1);
  const pan=ai.panic>0;if(pan){ai.panic-=dt;if(v.onScreen&&(ai.hornT=(ai.hornT||0)-dt)<=0){ai.hornT=rr(0.8,2);sfx.horn(v,dv(v.x,v.y));}}
  const target=pan?(Math.abs(diff)>0.35?190:Math.min(v.t.max*0.92,440)):Math.abs(diff)>0.35?100:ai.cruise;
  const blk=lookAhead(v);let red=false;
  if(ai.wps.length===1){const dd=hyp(wp.x-v.x,wp.y-v.y);if(dd<125&&dd>10){const st=lightState(ai.node[0],ai.node[1])[ai.d%2];red=st==='r'||(st==='y'&&dd>60);}}
  if(red&&!pan){v.thr=v.speed>8?-1:0;ai.blocked=0;ai.stuck=0;}
  else if(blk){v.thr=v.speed>8?-1:0;ai.blocked+=dt;if(blk===G.player||blk===G.player.veh){if(ai.blocked>1.1&&(ai.hornT=(ai.hornT||0)-dt)<=0&&v.onScreen){ai.hornT=rr(1.2,2.8);sfx.horn(v,dv(v.x,v.y));}}}
  else{ai.blocked=0;v.thr=v.speed<target?1:(v.speed>target+40?-0.4:0);}
  v.hb=0;
  if(Math.abs(v.speed)<6&&!blk&&v.thr>0)ai.stuck+=dt;else ai.stuck=0;
  if(ai.stuck>1.5){ai.stuck=0;ai.rev=0.9;}
  if(ai.blocked>14&&!v.onScreen)v.remove=true;}
function lookAhead(v){const ca=Math.cos(v.a),sa=Math.sin(v.a),reach=55+Math.max(0,v.speed)*0.55;
  const test=(o,hw)=>{const dx=o.x-v.x,dy=o.y-v.y;const al=dx*ca+dy*sa;if(al<v.t.l*0.4||al>reach+v.t.l*0.5)return false;return Math.abs(-dx*sa+dy*ca)<hw;};
  for(const o of G.vehicles)if(o!==v&&!o.sunk&&!o.t.boat&&test(o,26))return o;
  const P=G.player;if(!P.veh&&!P.dead&&test(P,22))return P;
  for(const p of G.peds)if(!p.dead&&!p.veh&&p!==P&&test(p,18))return p;
  return null;}

// ---------- chasing (police / gangs) ----------
function nextNodeToward(x,y,tx,ty){const [i,j]=nearestNode(x,y);const np=nodePos(i,j);
  if(hyp(np.x-x,np.y-y)>150)return np;let best=null,bd=1e9;
  for(let d=0;d<4;d++){if(!validDir(i,j,d))continue;const p=nodePos(i+DIRS[d][0],j+DIRS[d][1]);const dd=hyp(p.x-tx,p.y-ty);if(dd<bd){bd=dd;best=p;}}
  return best||np;}
function chaseDrive(v,tx,ty,dt){const ai=v.ai,d=hyp(tx-v.x,ty-v.y);let gx,gy;
  if(d<420&&los(v.x,v.y,tx,ty)){gx=tx;gy=ty;ai.wp=null;}
  else{if(!ai.wp||hyp(ai.wp.x-v.x,ai.wp.y-v.y)<80)ai.wp=nextNodeToward(v.x,v.y,tx,ty);gx=ai.wp.x;gy=ai.wp.y;}
  if(ai.rev>0){ai.rev-=dt;v.thr=-1;v.str=ai.revDir;v.hb=0;return d;}
  let diff=angDiff(v.a,Math.atan2(gy-v.y,gx-v.x));
  const look=46+Math.abs(v.speed)*0.32,ca=Math.cos(v.a),sa=Math.sin(v.a);
  if(solidFor(v,tileAt(v.x+ca*look,v.y+sa*look))){
    const l=solidFor(v,tileAt(v.x+Math.cos(v.a-0.7)*look,v.y+Math.sin(v.a-0.7)*look)),r=solidFor(v,tileAt(v.x+Math.cos(v.a+0.7)*look,v.y+Math.sin(v.a+0.7)*look));
    if(!l&&r)diff=-1.2;else if(l&&!r)diff=1.2;}
  v.str=clamp(diff*2.6,-1,1);v.thr=Math.abs(diff)>1.5?0.45:1;v.hb=Math.abs(diff)>1.1&&v.speed>200?1:0;
  if(Math.abs(v.speed)<22)ai.stuck+=dt;else ai.stuck=Math.max(0,ai.stuck-dt);
  if(ai.stuck>1.1){ai.stuck=0;ai.rev=0.85;ai.revDir=-(Math.sign(diff)||1);}
  return d;}
function aiChase(v,dt){const ai=v.ai,P=G.player,tgt=P.veh||P,law=ai.faction==='police'||ai.faction==='army';
  if(P.dead){v.thr=0;v.hb=1;return;}
  if(law&&!v.mission&&G.wanted===0){trafficFromHere(v);v.driver='civ';if(v.t.police)v.driver='cop';return;}
  const seen=!law||v.mission||G.seenNow||!G.lastSeen;let tx=tgt.x,ty=tgt.y;
  if(!seen){const ls=G.lastSeen;if(ai.sp||hyp(v.x-ls.x,v.y-ls.y)<300){ai.spT=(ai.spT||0)-dt;
      if(!ai.sp||ai.spT<=0||hyp(v.x-ai.sp.x,v.y-ai.sp.y)<150){const [i,j]=nearestNode(ls.x,ls.y);ai.sp=nodePos(clamp(i+ri(-2,2),0,XS.length-1),clamp(j+ri(-2,2),0,YS.length-1));ai.spT=7;}
      tx=ai.sp.x;ty=ai.sp.y;}else{tx=ls.x;ty=ls.y;}}
  else ai.sp=null;
  chaseDrive(v,tx,ty,dt);if(!seen){if(v.speed>190)v.thr=0;ai.bust=0;return;}
  const d=hyp(tgt.x-v.x,tgt.y-v.y);
  if(!P.veh&&d<190){v.thr=v.speed>20?-1:0;v.hb=1;if(Math.abs(v.speed)<50&&v.occ>0)unload(v);}
  if(ai.faction==='police'&&G.wanted<=2&&P.veh&&d<95&&Math.abs(P.veh.speed)<30&&!P.veh.t.boat){ai.bust=(ai.bust||0)+dt;G.bustCar=ai.bust/3.2;if(ai.bust>3.2)busted();}else ai.bust=0;
  v.cool-=dt;
  const shoots=ai.faction!=='police'||G.wanted>=3;
  if(shoots&&v.occ>0&&d<300&&v.cool<=0&&los(v.x,v.y,tgt.x,tgt.y)){v.cool=ai.faction==='police'?1.1:0.8;
    fire(null,v,v.x,v.y,Math.atan2(tgt.y-v.y,tgt.x-v.x),ai.faction==='army'?16:10,0.12);}}
function unload(v){const ai=v.ai;const n=v.occ;v.occ=0;
  for(let k=0;k<n;k++){const side=k?1:-1,ca=Math.cos(v.a),sa=Math.sin(v.a);
    let x=v.x-sa*side*(v.t.w*0.5+14),y=v.y+ca*side*(v.t.w*0.5+14);if(solidPed(tileAt(x,y))){x=v.x;y=v.y;}
    const type=ai.faction==='police'?'cop':ai.faction==='army'?'soldier':'gang';
    const p=mkPed(type,x,y,{faction:ai.faction,hostile:type!=='cop',persist:false,st:'chase'});p.cool=rr(0.6,1.4);if(v.mission)p.mission=true;}
  v.driver=null;v.ai=null;}
function spawnChaser(faction,type,col,ringMin,ringMax){const P=G.player;const nodes=[];
  for(let i=0;i<XS.length;i++)for(let j=0;j<YS.length;j++){const np=nodePos(i,j),d=hyp(np.x-P.x,np.y-P.y);if(d>=ringMin&&d<=ringMax&&!onScreen(np.x,np.y,80)&&!G.vehicles.some(o=>hyp(o.x-np.x,o.y-np.y)<90))nodes.push([i,j]);}
  for(let k=nodes.length-1;k>0;k--){const r=Math.floor(rand()*(k+1));[nodes[k],nodes[r]]=[nodes[r],nodes[k]];}
  for(const [i,j] of nodes.slice(0,1)){const np=nodePos(i,j);
    const ds=[0,1,2,3].filter(dd=>validDir(i,j,dd));const dd=pick(ds);
    const v=mkVeh(type,np.x,np.y,dd*Math.PI/2,col);v.driver=faction==='police'?'cop':faction==='army'?'soldier':'gang';v.occ=2;
    v.ai={mode:'chase',faction,stuck:0,rev:0};return v;}
  return null;}

// ---------- peds ----------
function aiPed(p,dt){if(p.dead||p.veh)return;
  if(p.burn>0){p.burn-=dt;hurtPed(p,16*dt,null,'burn');if(rand()<0.5)part('fire',p.x+rr(-5,5),p.y+rr(-5,5),0,-20,0.4,rr(4,7));if(p.dead)return;}
  if(p.kvx||p.kvy){movePed(p,p.kvx*dt,p.kvy*dt);p.kvx*=0.88;p.kvy*=0.88;if(Math.abs(p.kvx)+Math.abs(p.kvy)<5){p.kvx=0;p.kvy=0;}}
  if(p.swim){if(!p.inWater)p.inWater=0;p.inWater+=dt;if(p.inWater>14)hurtPed(p,8*dt,null,'drown');}else p.inWater=0;
  if(p.sayT>0)p.sayT-=dt;
  p.cool-=dt;
  if(p.stun>0){p.stun-=dt;p.walk=0;return;}
  if(p.brawl>0&&plusBrawl(p,dt))return;
  if(p.prey&&plusPrey(p,dt))return;
  if(p.war&&!p.hostile&&plusWar(p,dt))return;
  const hostile=p.type==='cop'?G.wanted>0:p.type==='soldier'?(p.hostile||G.inBase):(p.hostile&&p.type==='gang');
  if(hostile&&!G.player.dead){aiHostile(p,dt);return;}
  if(p.type==='soldier'){p.walk=0;const P=G.player;if(hyp(P.x-p.x,P.y-p.y)<300)p.a=Math.atan2(P.y-p.y,P.x-p.x);return;}
  if(p.type==='npc')return;
  aiCiv(p,dt);}
function walkDir(p,sp,dt){const s=p.swim?sp*0.45:sp;movePed(p,Math.cos(p.a)*s*dt,Math.sin(p.a)*s*dt);p.walk+=s*dt;}
function aiCiv(p,dt){p.tm-=dt;
  if(p.st==='call'){p.callT-=dt;p.a=Math.atan2(p.y-p.fy,p.x-p.fx);walkDir(p,55,dt);if(p.callT<=0){p.st='flee';p.ft=4;const P=G.player;
      if(!P.dead&&hyp(p.x-P.x,p.y-P.y)<1000){setStars(Math.max(1,G.wanted));addHeat(1.2);G.lastSeen={x:P.x,y:P.y};G.seenVeh=P.veh?P.veh.id:0;toast(tr('witness'));}}return;}
  if(p.st==='cower'){p.ft-=dt;p.walk=0;if(p.ft<=0)p.st='walk';return;}
  if(p.st==='chat'){p.ft-=dt;p.walk=0;const o=p.mate;if(!o||o.dead||o.st!=='chat'||p.ft<=0){p.st='walk';p.mate=null;p.tm=rr(1,3);return;}p.a=Math.atan2(o.y-p.y,o.x-p.x);p.ct-=dt;
    if(p.ct<=0){p.ct=3.2;say(p,'chat',1.5);const vv=dv(p.x,p.y);if(vv>0.15)sfx.voice(p,vv);}return;}
  if(p.st==='flee'){p.ft-=dt;p.a=Math.atan2(p.y-p.fy,p.x-p.fx)+Math.sin(G.time*2+p.id)*0.4;walkDir(p,p.kind==='elder'?75:p.kind==='dog'?170:130,dt);if(p.ft<=0)p.st='walk';return;}
  if(p.tm<=0){p.tm=rr(2,6);for(const o of G.peds)if(o.dead&&!o.veh&&hyp(o.x-p.x,o.y-p.y)<95){p.st='flee';p.ft=4;p.fx=o.x;p.fy=o.y;react(p,'body');return;}
    if(p.kind==='dog'){if(rand()<0.3&&dv(p.x,p.y)>0.2){say(p,'dog',1.2);sfx.bark(dv(p.x,p.y));}}
    else{if(p.kind==='tourist'&&rand()<0.3){p.st='idle';part('flash',p.x+Math.cos(p.a)*12,p.y+Math.sin(p.a)*12,0,0,0.1,9);return;}
      if(G.rep<-15&&rand()<0.2&&hyp(p.x-G.player.x,p.y-G.player.y)<140){p.st='flee';p.ft=3;p.fx=G.player.x;p.fy=G.player.y;react(p,'psycho');return;}
      if(rand()<0.14)for(const o of G.peds){if(o===p||o.type!=='civ'||o.dead||o.kind==='dog'||(o.st!=='walk'&&o.st!=='idle')||hyp(o.x-p.x,o.y-p.y)>64)continue;p.st=o.st='chat';p.ft=o.ft=rr(5,9);p.mate=o;o.mate=p;p.ct=0.3;o.ct=1.9;return;}}
   if(rand()<0.12)p.st='idle';else{p.st='walk';p.a=pick([0,Math.PI/2,Math.PI,-Math.PI/2])+rr(-0.12,0.12);}}
  if(p.st==='idle'){p.walk=0;return;}
  if(p.st==='chase')p.st='walk';
  const nx=p.x+Math.cos(p.a)*22,ny=p.y+Math.sin(p.a)*22,tt=tileAt(nx,ny);
  if(tt===TL.ROAD||tt===TL.WATER||tt===TL.BLD||tt===TL.FENCE){
    if(tt===TL.ROAD&&p.cross){walkDir(p,55,dt);return;}
    if(tt===TL.ROAD&&rand()<0.08){p.cross=true;walkDir(p,55,dt);return;}
    p.a+=(rand()<0.5?1:-1)*Math.PI/2;p.walk=0;return;}
  p.cross=false;walkDir(p,46*(p.sp||1),dt);}
function aiHostile(p,dt){const P=G.player,tgt=P.veh||P,d=hyp(tgt.x-p.x,tgt.y-p.y);
  if(p.type==='cop'&&!G.seenNow&&G.lastSeen&&!(d<sightRange()&&los(p.x,p.y,tgt.x,tgt.y))){const ls=G.lastSeen,dl=hyp(ls.x-p.x,ls.y-p.y);p.arr=0;
    if(dl>70){p.a=Math.atan2(ls.y-p.y,ls.x-p.x);walkDir(p,110,dt);}else{p.tm-=dt;if(p.tm<=0){p.tm=rr(1,2.5);p.sa=rr(0,TAU);}p.a=p.sa||0;walkDir(p,60,dt);}return;}
  p.a=Math.atan2(tgt.y-p.y,tgt.x-p.x);
  const arrest=p.type==='cop'&&G.wanted<=1;
  const keep=arrest?14:(p.type==='soldier'?220:150);
  if(d>keep||!los(p.x,p.y,tgt.x,tgt.y)){walkDir(p,p.type==='soldier'?100:125,dt);}else p.walk=0;
  if(arrest){if(!P.veh&&!P.roof&&!P.climb&&!(P.jump>0)&&d<28){G.bustBy=G.time;if(p.cool<=0){p.cool=1.5;hurtPed(P,5,p,'punch');sfx.punch();G.stagger=0.3;G.hurtFlash=0.3;}if(p.sayT<=0)say(p,'cop');}
    else if(P.veh&&d<44&&Math.abs(P.veh.speed)<25&&!P.veh.t.boat){p.arr+=dt;if(p.arr>1.5){p.arr=0;exitVehicle();toast(tr('dragged'));sfx.punch();}}else p.arr=0;return;}
  if(p.cool<=0&&d<340&&los(p.x,p.y,tgt.x,tgt.y)){p.cool=p.type==='soldier'?0.55:rr(0.8,1.3);
    fire(p,null,p.x,p.y,p.a,p.type==='soldier'?14:p.type==='cop'?8:11,p.type==='soldier'?0.1:p.type==='cop'?0.17:0.14);}}
function civLine(p){const lines=p.type==='gang'?(p.faction==='tide'?CHAT_TIDE:CHAT_SAINTS):p.type==='cop'?CHAT_COP:CHAT;p.say=L(pick(lines));p.sayT=3;sfx.chat(300);}
const CHAT=[{he:'יום יפה, נכון?',en:'Nice day, huh?'},{he:'ראית את המחירים בטיילת? שוד!',en:'Seen the prices on the boardwalk? Robbery!'},
 {he:'אל תתקרב לאי הצבאי. שמעתי דברים.',en:'Stay away from the army island. I hear things.'},{he:'הקדושים שולטים בלילות של מרכז העיר.',en:'The Saints own downtown at night.'},
 {he:'מאמא סולט? לא אמרתי לך כלום.',en:"Mama Salt? I didn't tell you anything."},{he:'ראית את הברווז הענק בפארק?',en:'Have you seen the giant duck in the park?'},
 {he:'שמעתי שיש מכונית זהב איפשהו בצפון-מערב.',en:'I heard there is a golden car somewhere up north-west.'},{he:'תיזהר מהמוניות. נוהגים כמו משוגעים.',en:'Watch out for the cabs. They drive like maniacs.'},
 {he:'אני מאחר לעבודה!',en:"I'm late for work!"},{he:'מה אתה מסתכל?',en:'What are you looking at?'},
 {he:'יש מוסכי צביעה בכל העיר. שווים כל דולר.',en:"There's a spray shop in midtown. Worth every dollar."},{he:'אומרים שיש אי קטן ונסתר במזרח.',en:'They say there is a tiny hidden island out east.'},
 {he:'הים קר היום. אל תשחה רחוק.',en:"Water's cold today. Don't swim too far."},{he:'סליחה, אתה יודע איפה התחנה?',en:'Excuse me, do you know where the station is?'}];
const CHAT_SAINTS=[{he:'וקס רואה הכול, אחי.',en:'Vex sees everything, man.'},{he:'האורות של העיר שלנו.',en:'The city lights are ours.'},{he:'תמשיך ללכת.',en:'Keep walking.'}];
const CHAT_TIDE=[{he:'הנמל שייך לגאות.',en:'The harbor belongs to the Tide.'},{he:'מאמא לא אוהבת זרים.',en:"Mama doesn't like strangers."},{he:'ריח של מלח, אה?',en:'Smell that salt, huh?'}];
const CHAT_COP=[{he:'תתנהג יפה, אזרח.',en:'Behave yourself, citizen.'},{he:'יום שקט. בינתיים.',en:'Quiet day. So far.'},{he:'רואה משהו חשוד? תדווח.',en:'See anything suspicious? Report it.'}];

// ---------- spawner ----------
function spawner(dt){G.spawnT-=dt;if(G.spawnT>0)return;G.spawnT=0.3;const P=G.player,cx=P.x,cy=P.y;
  for(const v of G.vehicles){if(v.persist||v.parked||v.driver===P||v===P.lastVeh)continue;const d=hyp(v.x-cx,v.y-cy);if(d>2400||(v.dead&&d>1300&&!v.onScreen))v.remove=true;}
  for(const p of G.peds){if(p.persist||p===P)continue;const d=hyp(p.x-cx,p.y-cy);if(d>1800||(p.dead&&d>900&&!onScreen(p.x,p.y,60)))p.remove=true;}
  let traffic=0,chasers={police:0,army:0},civs=0;
  for(const v of G.vehicles)if(!v.remove&&v.ai){if(v.ai.mode==='traffic')traffic++;else if(v.ai.mode==='chase'&&chasers[v.ai.faction]!=null)chasers[v.ai.faction]++;}
  for(const p of G.peds)if(!p.remove&&!p.dead&&p.type!=='soldier'&&p!==P)civs++;
  const nk=1-0.45*ENV.dark-0.2*ENV.rain;
  if(traffic<17*nk)spawnTraffic(cx,cy);
  if(civs<30*nk)spawnCiv(cx,cy);
  const wantCars=[0,1,2,3,3,4,4][G.wanted],wantArmy=G.wanted>=6?3:G.wanted>=5?2:0;
  if(chasers.police<wantCars&&!P.dead)spawnChaser('police','police',null,850,1500);
  if(chasers.army<wantArmy&&!P.dead)spawnChaser('army','army',null,900,1500);
  G.vehicles=G.vehicles.filter(v=>!v.remove);G.peds=G.peds.filter(p=>!p.remove);}
function spawnTraffic(cx,cy){for(let k=0;k<8;k++){const i=ri(0,XS.length-1),j=ri(0,YS.length-1),np=nodePos(i,j);const d=hyp(np.x-cx,np.y-cy);
  if(d<700||d>1500)continue;const ds=[0,1,2,3].filter(dd=>validDir(i,j,dd));const dd=pick(ds);
  const v=mkVeh(pick(TRAFFIC_TYPES),0,0,0);trafficAt(v,i,j,dd,rr(0.2,0.8));
  if(onScreen(v.x,v.y,60)||G.vehicles.some(o=>o!==v&&hyp(o.x-v.x,o.y-v.y)<110)){G.vehicles.pop();continue;}
  v.driver='civ';return;}}
function spawnCiv(cx,cy){for(let k=0;k<10;k++){const a=rr(0,TAU),r=rr(500,1250),x=cx+Math.cos(a)*r,y=cy+Math.sin(a)*r,t=tileAt(x,y);
  if(t!==TL.WALK&&t!==TL.CONC&&t!==TL.SAND&&t!==TL.GRASS&&t!==TL.LOT&&t!==TL.DOCK)continue;if(onScreen(x,y,40))continue;
  const tx=x/T,ty=y/T;let type='civ',o={};const rnd=rand();
  if(tx>=128&&tx<=156&&ty<=52)continue;
  if(rnd<0.06)type='cop';
  else if(rnd<0.16&&ty<60&&tx<76){type='gang';o.faction='saints';}
  else if(rnd<0.16&&ty>=112&&tx<110){type='gang';o.faction='tide';}
  const np=mkPed(type,x,y,o);if(type==='civ')setKind(np,kindFor(tx,ty));return;}}
