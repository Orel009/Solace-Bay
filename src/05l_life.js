// ---------- v5: busier streets, night life, ambulances, stunt jumps, paramedic job, sirens ----------
Object.assign(STR.he,{stunt:'קפיצת פעלולים! {0} מ׳ באוויר · +{1}$',stuntNew:'קפיצה ייחודית! ({0}/{1}) · +{2}$',stuntLow:'קפיצה יפה, אבל צריך יותר מהירות בשביל הבונוס',medicCome:'האמבולנס בדרך',revived:'הפרמדיקים החזירו אותו לחיים',
 medJob:'משמרת פרמדיק: יש פצוע בעיר. סע אליו (הסמן האדום)',medPick:'הפצוע עלה לאמבולנס. סע לבית החולים, מהר!',medPaid:'הצלת חיים! +{0}$',medLost:'הפצוע לא שרד את הנסיעה',sirenOn:'סירנה הופעלה',sirenOff:'סירנה כובתה',medHint:'באמבולנס: הצופר מדליק סירנה, ויש משמרות פרמדיק עם תשלום'});
Object.assign(STR.en,{stunt:'Stunt jump! {0} m of air · +${1}',stuntNew:'Unique stunt! ({0}/{1}) · +${2}',stuntLow:'Nice jump, but you need more speed for the bonus',medicCome:'An ambulance is on its way',revived:'The paramedics brought him back',
 medJob:'Paramedic shift: someone is hurt in the city. Drive there (red marker)',medPick:'Patient on board. Drive to the hospital, fast!',medPaid:'You saved a life! +${0}',medLost:'The patient did not make it',sirenOn:'Siren on',sirenOff:'Siren off',medHint:'In an ambulance: the horn turns on the siren, and paramedic shifts pay'});
Object.assign(REACT,{revive:[R2('איפה אני?','Where am I?'),R2('ראיתי אור לבן. זה היה הפנס שלכם.','I saw a white light. It was your flashlight.'),R2('אני חי! מי ישלם על זה?','I am alive! Who pays for this?'),R2('תודה, דוקטור!','Thanks, doc!')],
 medic:[R2('זוזו, זוזו!','Move, move!'),R2('עוד אחד? יום שלישי טיפוסי.','Another one? Typical Tuesday.'),R2('הוא נושם. בערך.','He is breathing. Roughly.')],
 party:[R2('הלילה לא נגמר!','The night never ends!'),R2('מישהו ראה את הנעל שלי?','Has anyone seen my shoe?'),R2('אחי, תן לי לנהוג. רגע, לא.','Bro, let me drive. Wait, no.'),R2('תקליטן, עוד שיר!','DJ, one more!')]});
// --- spawner with steadier density, day and night ---
function ringNodes(cx,cy,a,b){const out=[];for(let i=0;i<XS.length;i++)for(let j=0;j<YS.length;j++){const q=nodePos(i,j),d=hyp(q.x-cx,q.y-cy);if(d>=a&&d<=b)out.push([i,j]);}return out;}
function spawner(dt){G.spawnT-=dt;if(G.spawnT>0)return;G.spawnT=0.25;const P=G.player,cx=P.veh?P.veh.x:P.x,cy=P.veh?P.veh.y:P.y;
  for(const v of G.vehicles){if(v.persist||v.parked||v.driver===P||v===P.lastVeh)continue;const d=hyp(v.x-cx,v.y-cy);if(d>2400||(v.dead&&d>1300&&!v.onScreen))v.remove=true;}
  for(const p of G.peds){if(p.persist||p===P)continue;const d=hyp(p.x-cx,p.y-cy);if(d>1700||(p.dead&&!p.medic&&d>900&&!onScreen(p.x,p.y,60)))p.remove=true;}
  let traffic=0,chasers={police:0,army:0},civs=0;
  for(const v of G.vehicles)if(!v.remove&&v.ai){if(v.ai.mode==='traffic')traffic++;else if(v.ai.mode==='chase'&&chasers[v.ai.faction]!=null)chasers[v.ai.faction]++;}
  for(const p of G.peds)if(!p.remove&&!p.dead&&p.type!=='soldier'&&p!==P&&hyp(p.x-cx,p.y-cy)<1500)civs++;
  const night=ENV.dark,ar=areaAt(cx,cy),lively=ar==='strip'||ar==='down'||ar==='glass'||ar==='beach'||ar==='vista',rainK=1-0.25*ENV.rain,
    nkCar=(1-0.2*night)*rainK,nkPed=(1-(lively?0.05:0.3)*night)*rainK,rural=ar==='mil'||ar==='air'||ar==='air2';
  const tc=Math.round((rural?10:24)*nkCar),pc=Math.round((rural?12:46)*nkPed);
  for(let k=0;k<2&&traffic<tc;k++,traffic++)spawnTraffic(cx,cy);
  for(let k=0;k<3&&civs<pc;k++,civs++){if(rand()<0.22&&civs<pc-3){if(spawnGroup(cx,cy,night>0.5&&lively))civs+=2;}else spawnCiv(cx,cy);}
  const wantCars=[0,1,1,2,2,3,4][G.wanted],wantArmy=G.wanted>=6?2:G.wanted>=5?1:0;
  if(chasers.police<wantCars&&!P.dead&&!(G.chaseCD>0)){spawnChaser('police','police',null,950,1500);G.chaseCD=G.wanted>=4?4:7;}
  if(chasers.army<wantArmy&&!P.dead&&!(G.chaseCD>0)){spawnChaser('army','army',null,950,1500);G.chaseCD=6;}
  G.vehicles=G.vehicles.filter(v=>!v.remove);G.peds=G.peds.filter(p=>!p.remove);}
function spawnTraffic(cx,cy){const rn=ringNodes(cx,cy,620,1500);for(let k=0;k<10&&rn.length;k++){const [i,j]=pick(rn),np=nodePos(i,j);
  const ds=[0,1,2,3].filter(dd=>validDir(i,j,dd));if(!ds.length)continue;const dd=pick(ds);
  const v=mkVeh(trafficType(np.x,np.y),0,0,0);trafficAt(v,i,j,dd,rr(0.15,0.85));
  if(onScreen(v.x,v.y,60)||G.vehicles.some(o=>o!==v&&hyp(o.x-v.x,o.y-v.y)<120)){G.vehicles.pop();continue;}
  v.driver='civ';if(ENV.dark>0.4&&rand()<0.25&&v.t.taxi===undefined)v.ai.cruise+=30;return v;}}
function sideOK(t){return t===TL.WALK||t===TL.CONC||t===TL.SAND||t===TL.GRASS||t===TL.LOT||t===TL.DOCK;}
function spawnGroup(cx,cy,party){for(let k=0;k<10;k++){const a=rr(0,TAU),r=rr(520,1150),x=cx+Math.cos(a)*r,y=cy+Math.sin(a)*r;if(!sideOK(tileAt(x,y))||onScreen(x,y,50))continue;
  const n=ri(2,3),ps=[];for(let i=0;i<n;i++){const q=[x+Math.cos(i*2.1)*20,y+Math.sin(i*2.1)*20];if(!sideOK(tileAt(q[0],q[1])))continue;const p=mkPed('civ',q[0],q[1]);setKind(p,party?pick(['casual','punk','tourist','biz']):kindFor(q[0]/T,q[1]/T));if(party){p.party=1;p.shirt=pick(['#ff4fd8','#7ff3ff','#ffd23f','#b8e600','#ecf0f1','#e84393']);}ps.push(p);}
  if(ps.length<2)continue;for(let i=0;i<ps.length;i++){const p=ps[i],o=ps[(i+1)%ps.length];p.st='chat';p.mate=o;p.ft=rr(8,16);p.ct=i*0.8+0.3;}return true;}return false;}
// --- ambulances that come for the injured ---
function medicWatch(dt){const P=G.player;if(G.medicCD>0)G.medicCD-=dt;
  if(!G.medicJob){if(G.medicCD>0||G.wanted>=4||P.inside)return;for(const p of G.peds){if(!p.dead||p.medic||p.type!=='civ'||p.kind==='dog'||p.swim||hyp(p.x-P.x,p.y-P.y)>900)continue;
      p.medic=1;p.persist=true;G.medicJob={body:p,t:rr(6,10)};return;}return;}
  const J=G.medicJob,b=J.body;if(b.remove||!b.dead){endMedic();return;}
  if(!J.v){J.t-=dt;if(J.t>0)return;const rn=ringNodes(b.x,b.y,800,1700).filter(([i,j])=>!onScreen(nodePos(i,j).x,nodePos(i,j).y,80));if(!rn.length){J.t=2;return;}
    const [i,j]=pick(rn),q=nodePos(i,j),v=mkVeh('ambulance',q.x,q.y,0);v.a=Math.atan2(b.y-q.y,b.x-q.x);v.driver='civ';v.persist=true;v.siren=true;v.ai={mode:'medic',stuck:0,rev:0,wp:null};J.v=v;J.st='drive';J.T=45;if(hyp(b.x-P.x,b.y-P.y)<700)toast(tr('medicCome'),2.5);return;}
  const v=J.v;J.T-=dt;if(v.dead||v.driver===P||J.T<0){endMedic();return;}
  if(J.st==='drive'&&!onScreen(v.x,v.y,140)&&hyp(v.x-b.x,v.y-b.y)>380){const ai=v.ai;if(!ai.wp||hyp(ai.wp.x-v.x,ai.wp.y-v.y)<40)ai.wp=nextNodeToward(v.x,v.y,b.x,b.y);const dx=ai.wp.x-v.x,dy=ai.wp.y-v.y,dd=hyp(dx,dy)||1,st2=Math.min(dd,340*dt);
    v.x+=dx/dd*st2;v.y+=dy/dd*st2;v.a=Math.atan2(dy,dx);v.vx=dx/dd*300;v.vy=dy/dd*300;v.speed=300;v.thr=0;v.str=0;ai.stuck=0;return;}
  if(J.st==='drive'){const d=chaseDrive(v,b.x,b.y,dt);if(v.speed>d*0.75+70)v.thr=-0.7;if(d<220){v.thr=v.speed>20?-1:0;v.str=0;v.hb=1;if(Math.abs(v.speed)<25){J.st='walk';const m=mkPed('civ',v.x-Math.sin(v.a)*30,v.y+Math.cos(v.a)*30);setKind(m,'worker');m.shirt='#f4f6f7';m.pants='#2e7d32';m.persist=true;m.medicP=1;J.m=m;say(m,'medic',2.5);sfx.door();}}else if(d>200&&v.speed<60)v.thr=1;}
  else if(J.st==='walk'){const m=J.m;v.thr=0;v.hb=1;if(!m||m.dead){endMedic();return;}const dx=b.x-m.x,dy=b.y-m.y,d=hyp(dx,dy);
    if(d>24){m.a=Math.atan2(dy,dx);pMove(m,dx/d*95*dt,dy/d*95*dt);m.walk+=95*dt;}else{m.walk=0;J.work=(J.work||0)+dt;if(rand()<dt*6)part('spark',b.x+rr(-6,6),b.y+rr(-6,6),rr(-20,20),rr(-40,-10),0.3,2);
      if(J.work>3){b.dead=false;b.hp=35;b.st='walk';b.stun=1.2;b.medic=0;b.persist=false;b.tm=2;say(b,'revive',3);sfx.voice(b,1);G.decals=G.decals.filter(dc=>!(dc.t==='blood'&&hyp(dc.x-b.x,dc.y-b.y)<30));if(hyp(b.x-P.x,b.y-P.y)<600)toast(tr('revived'),2.5);J.st='back';}}}
  else if(J.st==='back'){const m=J.m,dx=v.x-m.x,dy=v.y-m.y,d=hyp(dx,dy);m.a=Math.atan2(dy,dx);if(d>30)pMove(m,dx/d*110*dt,dy/d*110*dt),m.walk+=110*dt;else{m.remove=true;sfx.door();v.siren=false;trafficFromHere(v);v.persist=false;G.medicJob=null;G.medicCD=8;}}}
function endMedic(){const J=G.medicJob;if(J){if(J.body&&!J.body.remove){J.body.persist=false;}if(J.m){J.m.persist=false;J.m.medicP=0;}if(J.v&&!J.v.dead&&J.v.driver==='civ'){J.v.siren=false;J.v.persist=false;trafficFromHere(J.v);}}G.medicJob=null;G.medicCD=10;}
// --- stunt jumps ---
const STUNTS=[];
function genStunts(){const R=mulberry32(5150);let tries=0;while(STUNTS.length<14&&tries++<600){const i=Math.floor(R()*XS.length),j=Math.floor(R()*YS.length),dir=Math.floor(R()*4);if(!validDir(i,j,dir))continue;
  const a=nodePos(i,j),b=nodePos(i+DIRS[dir][0],j+DIRS[dir][1]),x=(a.x+b.x)/2,y=(a.y+b.y)/2;if(hyp(a.x-b.x,a.y-b.y)<9*T||tileAt(x,y)!==TL.ROAD||STUNTS.some(s=>hyp(s.x-x,s.y-y)<30*T))continue;
  STUNTS.push({x,y,a:dir*Math.PI/2,id:STUNTS.length});}}
function stuntTick(dt){const P=G.player,v=P.veh;
  if(v&&v.airT>0){v.airT-=dt;v.vx=v.airV[0];v.vy=v.airV[1];v.a=v.airA;v.str=0;if(v.airT<=0){v.airT=0;sfx.crash(260);G.shake=Math.max(G.shake||0,5);part('dust',v.x,v.y,0,0,0.7,14);
      const m=Math.round(v.airD/T*4),pay=Math.round(m*8);if(v.airS<330){toast(tr('stuntLow'),2);return;}let bonus=pay;const k='st'+v.airId;if(!G.got.includes(k)){G.got.push(k);bonus+=500;toast(fmt(tr('stuntNew'),G.got.filter(x=>x.startsWith('st')).length,STUNTS.length,bonus),3.5);sfx.pass();}else toast(fmt(tr('stunt'),m,bonus),2.5);G.money+=bonus;}return;}
  if(!v||v.t.boat||v.t.plane||v.t.tank||v.dead)return;
  for(const s of STUNTS){const dx=v.x-s.x,dy=v.y-s.y;if(Math.abs(dx)>70||Math.abs(dy)>70)continue;const ca=Math.cos(s.a),sa=Math.sin(s.a);if(Math.abs(dx*ca+dy*sa)>30||Math.abs(-dx*sa+dy*ca)>62)continue;const along=v.vx*ca+v.vy*sa;if(along<200||Math.abs(angDiff(v.a,s.a))>0.6)continue;
    const sp=hyp(v.vx,v.vy);v.airT=0.35+sp/700;v.airMax=v.airT;v.airV=[v.vx,v.vy];v.airA=v.a;v.airD=sp*v.airT;v.airS=sp;v.airId=s.id;sfx.jump();return;}}
function drawStunts(inV){for(const s of STUNTS){if(!inV(s.x,s.y,110))continue;g.save();g.translate(s.x,s.y);g.rotate(s.a);g.fillStyle='rgba(0,0,0,0.32)';g.beginPath();g.moveTo(-30,-58);g.lineTo(36,-58);g.lineTo(36,62);g.lineTo(-30,62);g.closePath();g.fill();
  const gr=g.createLinearGradient(-30,0,30,0);gr.addColorStop(0,'#4d545c');gr.addColorStop(1,'#d5dae0');g.fillStyle=gr;rrect(g,-30,-58,60,116,4);g.fill();
  g.strokeStyle='rgba(0,0,0,0.3)';g.lineWidth=2;for(let k=-20;k<30;k+=10){g.beginPath();g.moveTo(k,-54);g.lineTo(k,54);g.stroke();}
  for(const yy of [-58,50]){for(let k=-30;k<30;k+=12){g.fillStyle=((k+30)/12)%2?'#16161d':'#ffd23f';g.fillRect(k,yy,12,8);}}
  const done=G.got.includes('st'+s.id);g.fillStyle=done?'rgba(127,255,160,0.95)':'rgba(255,90,60,0.95)';for(const yy of [-22,22]){g.beginPath();g.moveTo(18,yy);g.lineTo(2,yy-12);g.lineTo(2,yy+12);g.closePath();g.fill();}g.restore();}}
// --- paramedic job (like taxi) ---
function medicJobTick(dt){const P=G.player,v=P.veh;if(G.patCD>0)G.patCD-=dt;
  if(G.pat&&(!v||v!==G.pat.v)){G.pat=null;return;}
  if(!v||!v.t.amb||G.mission||G.medicJob&&G.medicJob.v===v)return;
  if(!G.seen.medHint){G.seen.medHint=1;toast(tr('medHint'),5);}
  if(!G.pat){if(G.patCD>0||G.wanted>0)return;const rn=ringNodes(v.x,v.y,900,2600);if(!rn.length)return;const [i,j]=pick(rn),q=nodePos(i,j);G.pat={v,st:'go',x:q.x+T*1.6,y:q.y+T*1.6,r:90};toast(tr('medJob'),4);sfx.blip();return;}
  const J=G.pat;if(J.st==='go'){if(hyp(v.x-J.x,v.y-J.y)<100&&Math.abs(v.speed)<70){J.st='back';J.t=hyp(POI.hosp.x-v.x,POI.hosp.y-v.y)/140+15;J.pay=Math.round(hyp(POI.hosp.x-v.x,POI.hosp.y-v.y)/12)+150;J.x=POI.hosp.x;J.y=POI.hosp.y+40;toast(tr('medPick'),3.5);sfx.door();}}
  else{J.t-=dt;if(J.t<=0){toast(tr('medLost'),3);sfx.fail();G.pat=null;G.patCD=4;return;}if(hyp(v.x-J.x,v.y-J.y)<120&&Math.abs(v.speed)<80){G.money+=J.pay;toast(fmt(tr('medPaid'),J.pay),3);sfx.pass();G.rep=Math.min(50,G.rep+2);G.pat=null;G.patCD=3;}}}
function curTarget(){const M=G.mission;if(M&&M.target)return M.target;if(!M&&G.fare)return G.fare;if(!M&&G.pat)return G.pat;if(!M){const nm=nextMission();if(nm)return nm.start;}return null;}
function drawLife(inV){drawStunts(inV);drawDucks(inV);drawEv2(inV);drawSecrets(inV);for(const p of G.peds)if(p.perf&&!p.dead&&inV(p.x,p.y,60))drawPerfExtra(p);const J=G.pat;if(J&&J.st==='go'&&inV(J.x,J.y,60)){const pu=(Math.sin(G.time*5)+1)/2;g.fillStyle=`rgba(255,60,60,${0.25+pu*0.25})`;g.beginPath();g.arc(J.x,J.y,30+pu*6,0,TAU);g.fill();g.fillStyle='#f4f6f7';g.fillRect(J.x-10,J.y-3,20,6);g.fillRect(J.x-3,J.y-10,6,20);}}
function drawSirens(){const on=Math.floor(G.time*8)%2;g.globalCompositeOperation='lighter';for(const v of G.vehicles){if(!v.siren||v.dead||!v.onScreen)continue;const ca=Math.cos(v.a),sa=Math.sin(v.a),f=v.t.l*0.18;
  glow(g,on?GL.red||'#ff3030':GL.blue||'#3d6bff',v.x+ca*f-sa*8,v.y+sa*f+ca*8,110,0.55);}g.globalAlpha=1;g.globalCompositeOperation='source-over';}
function lifeTick(dt){policeCD(dt);ducksTick(dt);grudgeTick2(dt);perfTick(dt);secretsTick(dt);trainsTick(dt);firesTick(dt);heliExtra(dt);roadblockTick(dt);emoteTick(dt);medicWatch(dt);fireWatch(dt);talkTick(dt);stuntTick(dt);medicJobTick(dt);
  if(ENV.dark>0.5&&rand()<dt*0.4){for(const p of G.peds)if(p.party&&!p.dead&&p.st==='chat'&&rand()<0.3&&onScreen(p.x,p.y,0)){say(p,'party',2.5);sfx.voice(p,0.6);break;}}}
