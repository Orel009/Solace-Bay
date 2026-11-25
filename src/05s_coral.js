// ---------- v8: Coral Key island, street performers, secrets ----------
Object.assign(AREAS,{coral:{he:'קורל קי',en:'Coral Key'}});
Object.assign(STR.he,{secretFound:'🔎 סוד נמצא! ({0}/{1}) · {2}',secrets:'סודות שנמצאו: {0}/{1}',rayGun:'קיבלת אקדח קרני חייזרים. אל תשאל.',bottle:'בקבוק עם פתק ({0}/5): "{1}"',treasure:'מצאת את האוצר של הפתקים! +{0}$',bigfootRun:'משהו גדול ושעיר רץ בין העצים...',ufoHint:'יש אור מוזר בשמיים...'});
Object.assign(STR.en,{secretFound:'🔎 Secret found! ({0}/{1}) · {2}',secrets:'Secrets found: {0}/{1}',rayGun:'You got an alien ray gun. Do not ask.',bottle:'Message in a bottle ({0}/5): "{1}"',treasure:'You found the bottle treasure! +${0}',bigfootRun:'Something big and hairy runs between the trees...',ufoHint:'There is a strange light in the sky...'});
const SECRETS={bigfoot:R2('צילמת את ביגפוט','You spotted Bigfoot'),ufo:R2('נחטפת לרגע על ידי עב״ם','Briefly abducted by a UFO'),ghost:R2('נגעת במכונית הרפאים','You touched the ghost car'),loop:R2('נסעת סיבוב שלם בקו העילי','Full loop on the Sky Line'),
 duck:R2('הברווז הענק דיבר','The giant duck spoke'),bottles:R2('אספת את כל הפתקים','Collected every bottle note'),copdance:R2('גרמת לשוטרים לרקוד','You made the cops dance'),halo:R2('נחתת על גג מגדל הילו','Landed on the HALO tower roof'),statue:R2('הפסל החי זז','The living statue flinched'),dev:R2('מצאת את חדר המפתחים','Found the developers\' room'),goldduck:R2('ליטפת את הברווזון המוזהב','Petted the golden duckling'),duckking:R2('עשרה ברווזים הלכו אחריך','Ten ducks followed you'),rubber:R2('הברווז הענק בנמל צייץ 12 פעמים','Made the harbor rubber duck squeak 12 times')};
const NSECRET=Object.keys(SECRETS).length;
function secret(k){if(G.got.includes('egg_'+k))return false;G.got.push('egg_'+k);const n=G.got.filter(x=>x.startsWith('egg_')).length;toast(fmt(tr('secretFound'),n,NSECRET,L(SECRETS[k])),5);sfx.pass();G.money+=750;saveGame();return true;}
// ---------- island ----------
function genCoral(){const R=mulberry32(7171),rp=a=>a[Math.floor(R()*a.length)];
  for(let y=150;y<=198;y++)for(let x=14;x<=112;x++){const dx=(x-63)/49,dy=(y-176)/21.5,e=dx*dx+dy*dy+0.035*Math.sin(x*0.5)+0.03*Math.cos(y*0.7);if(e<1){tset(x,y,e>0.8?TL.SAND:TL.GRASS);}}
  for(let y=138;y<=158;y++)for(const x of [48,49]){const t=tget(x,y);if(t===0||t===TL.DOCK)tset(x,y,TL.BRIDGE);else if(t!==TL.ROAD)tset(x,y,TL.ROAD);}
  for(let y=138;y<=158;y+=5)LAMPS.push({x:47*T,y:y*T,lx:48.5*T,ly:y*T});
  const road=(x0,y0,x1,y1)=>fillT(x0,y0,x1,y1,TL.ROAD);fillT(28,161,99,190,TL.WALK,true);
  road(30,163,97,164);road(30,187,97,188);road(30,163,31,188);road(96,163,97,188);road(48,159,49,188);road(72,163,73,188);
  const C={};
  // grand hotel
  fillT(33,166,46,184,TL.CONC);const ht=addBld(34,167,45,176,7.2,'#f4ead8',{logo:'CORAL GRAND',logoC:'#e8508a',neon:'#ff7aa8'});C.hotel={x:39.5*T,y:178.5*T};
  DECOR.push({t:'fountain',x:39.5*T,y:181*T});for(const [ax,ay] of [[34,184],[45,184],[34,178],[45,178]])TREES.push({x:ax*T,y:ay*T,r:22,palm:1});
  addShop('market',addBld(34,179,37,183,1.3,'#79d2c0',{logo:'BAR',logoC:'#fff3c4'}),1,{name:R2('בר הקוקוס','Coconut Bar'),col:'#5fe0d0'});
  // golf course
  fillT(51,166,70,185,TL.GRASS);C.golf={x:60.5*T,y:175.5*T};DECOR.push({t:'golf',x:51*T,y:166*T,w:20*T,h:20*T});
  // Vale estate
  fillT(75,166,94,185,TL.GRASS);for(let x=75;x<=94;x++){tset(x,166,TL.FENCE);tset(x,185,TL.FENCE);}for(let y=166;y<=185;y++){tset(75,y,TL.FENCE);tset(94,y,TL.FENCE);}tset(75,175,TL.CONC);tset(75,176,TL.CONC);
  fillT(76,174,86,177,TL.CONC);const vm=addBld(80,168,91,173,3.1,'#e9e4da',{logo:'V',logoC:'#c9a227'});vm.roof='#c9b79a';vm.rim='#8e7a5a';
  fillT(82,178,88,181,TL.WATER);DECOR.push({t:'helipad',x:90*T,y:181*T});C.vale={x:84*T,y:176*T};C.valeGate={x:73.5*T,y:175.5*T};C.valePad={x:90*T,y:181*T};
  for(const [ax,ay] of [[77,168],[77,183],[92,168],[92,183],[85,184]])TREES.push({x:ax*T,y:ay*T,r:24,palm:1});
  // villas and beach
  for(const [a,b,c,e] of [[33,190,40,192],[52,190,60,192],[64,190,70,192],[86,190,93,192],[99,167,103,173],[99,177,103,183],[24,167,27,173],[24,177,27,183]])villa(a,b,c,e,R,rp);
  for(let k=0;k<26;k++){const a=R()*TAU,x=63+Math.cos(a)*45,y=176+Math.sin(a)*19.5;if(tget(Math.floor(x),Math.floor(y))===TL.SAND)TREES.push({x:x*T,y:y*T,r:20+R()*8,palm:1});}
  for(let k=0;k<10;k++){const x=40+k*5,y=194.2;if(tget(x,Math.floor(y))===TL.SAND)DECOR.push({t:'umb',x:x*T,y:y*T,c:rp(['#e74c3c','#f1c40f','#3498db','#ff7aa8','#2ecc71'])});}
  for(let x=104;x<=110;x++)tset(x,176,TL.DOCK);C.pier={x:108*T,y:178*T};POI.boats.push({x:109*T,y:179.5*T,a:0});
  Object.assign(POI,{coralHotel:C.hotel,golf:C.golf,vale:C.vale,valeGate:C.valeGate,valePad:C.valePad,coralPier:C.pier,coralBridge:{x:48.5*T,y:150*T}});
  for(const [x,y,a] of [[44,186,0],[66,186,0],[78,186,0],[70,162,0]])PARKSPOTS.push({x:x*T,y:y*T,a});}
function drawGolf(dc){const x=dc.x,y=dc.y,w=dc.w,h=dc.h;g.fillStyle='rgba(120,200,90,0.35)';g.fillRect(x,y,w,h);g.strokeStyle='rgba(255,255,255,0.12)';g.lineWidth=18;for(let k=0;k<w;k+=48){g.beginPath();g.moveTo(x+k,y);g.lineTo(x+k,y+h);g.stroke();}
  for(const [fx,fy] of [[0.25,0.3],[0.7,0.22],[0.55,0.75]]){g.fillStyle='#9bdc78';g.beginPath();g.ellipse(x+w*fx,y+h*fy,70,52,0.3,0,TAU);g.fill();g.fillStyle='#e9d9a6';g.beginPath();g.ellipse(x+w*fx+80,y+h*fy+40,32,20,0.4,0,TAU);g.fill();
    g.fillStyle='#1b1b1b';g.beginPath();g.arc(x+w*fx,y+h*fy,5,0,TAU);g.fill();g.fillStyle='#f4f6f7';g.fillRect(x+w*fx-1,y+h*fy-30,2.5,30);g.fillStyle='#e74c3c';g.beginPath();g.moveTo(x+w*fx+1.5,y+h*fy-30);g.lineTo(x+w*fx+18,y+h*fy-24+Math.sin(G.time*3)*2);g.lineTo(x+w*fx+1.5,y+h*fy-18);g.fill();}}
// ---------- street performers ----------
const PERF=[];
function genPerformers(){const ft=DECOR.filter(d=>d.t==='fountain');const P=(kind,x,y,o)=>PERF.push(Object.assign({kind,x,y},o||{}));
  if(ft[0])P('mime',ft[0].x+70,ft[0].y);if(ft[1])P('preacher',ft[1].x-80,ft[1].y+10);P('statue',POI.pier.x+120,POI.pier.y-60);P('musician',POI.halo.x-120,POI.halo.y+20);
  P('protest',POI.duck.x+120,POI.duck.y+40,{n:3});P('protest2',POI.cops.x+40,POI.cops.y+70,{n:2});P('dogmascot',POI.vendors[0].x+40,POI.vendors[0].y+30);P('golfer',POI.golf.x,POI.golf.y-20);}
const PLINES={mime:[R2('(המים תקוע בקופסה בלתי נראית)','(The mime is stuck in an invisible box)'),R2('(המים מושך חבל בלתי נראה. אף אחד לא יודע לאן)','(The mime pulls an invisible rope. Nobody knows where to)'),R2('(המים מבקש כסף. בתנועות. בתוקף)','(The mime asks for money. With gestures. Firmly)')],
 preacher:[R2('הסוף קרוב! כנראה ביום שלישי!','The end is near! Probably Tuesday!'),R2('תחזרו בתשובה! או לפחות תחזירו את העגלה לסופר!','Repent! Or at least return your shopping cart!'),R2('הברווז רואה הכול!','The duck sees all!'),R2('הייתי פעם רואה חשבון. גם זה היה סוף העולם.','I used to be an accountant. That was the end of the world too.')],
 statue:[R2('...','...'),R2('(הפסל החי לא זז. בכלל. מרשים)','(The living statue does not move. At all. Impressive)')],
 musician:[R2('השיר הבא מוקדש לכל מי שנתקע בפקק!','This next song goes out to everyone stuck in traffic!'),R2('טיפים מתקבלים. גם במטבעות. גם בכריכים.','Tips welcome. Coins too. Sandwiches too.'),R2('תודה, תודה, אני פה כל השבוע. ואת כל החיים.','Thank you, thank you, I am here all week. And all my life.')],
 protest:[R2('מה אנחנו רוצים? ברווז קטן יותר! מתי? עכשיו!','What do we want? A smaller duck! When do we want it? Now!'),R2('הברווז מסתיר לנו את השמש!','The duck blocks our sun!'),R2('לא לברווז הענק! כן לברווז בינוני!','No to the giant duck! Yes to a medium duck!')],
 protest2:[R2('חניה חינם לכולם! גם על המדרכה!','Free parking for all! Sidewalks too!'),R2('דוחות זה דיכוי!','Tickets are oppression!')],
 dogmascot:[R2('נקניקייה! נקניקייה! אני נקניקייה!','Hot dog! Hot dog! I am a hot dog!'),R2('בבקשה תקנו משהו, חם לי בתחפושת.','Please buy something, it is hot in this costume.')],
 golfer:[R2('פור! פור! מישהו ראה את הכדור?','Fore! Fore! Has anyone seen my ball?'),R2('הכדור נכנס לבריכה של מר וייל. אני לא הולך לשם.','The ball went into Mr. Vale\'s pool. I am not going there.')]};
const SIGNTXT={protest:R2('לא לברווז!','NO DUCK!'),protest2:R2('חניה זה זכות','PARK FREE')};
function spawnPerformers(){for(const pf of PERF){pf.peds=[];const n=pf.n||1;for(let i=0;i<n;i++){const p=mkPed('civ',pf.x+i*26,pf.y+(i%2)*10);setKind(p,pf.kind==='golfer'?'biz':pf.kind==='protest'||pf.kind==='protest2'?'casual':'casual');p.persist=true;p.perf=pf.kind;p.st='perf';p.a=Math.PI/2;
    if(pf.kind==='mime'){p.shirt='#f4f6f7';p.pants='#111';p.hat='#111';}if(pf.kind==='statue'){p.shirt='#c9a227';p.pants='#c9a227';p.skin='#d4af37';p.hair='#b8962e';p.hat=null;}
    if(pf.kind==='dogmascot'){p.shirt='#c0392b';p.pants='#e6b35a';p.hat='#e6b35a';}if(pf.kind==='preacher'){p.shirt='#2b2b33';p.hat='#111';}if(pf.kind==='musician'){p.shirt='#8e44ad';}
    if(pf.kind.startsWith('protest'))p.sign=SIGNTXT[pf.kind];pf.peds.push(p);}}}
function perfTick(dt){const P=G.player;G.perfT=(G.perfT||0)-dt;for(const pf of PERF)for(const p of pf.peds||[]){if(p.dead||p.st!=='perf')continue;p.walk=0;
    if(pf.kind==='mime'){p.a=Math.PI/2+Math.sin(G.time*1.5)*0.4;}else if(pf.kind==='musician'){p.a=Math.PI/2;}else if(pf.kind==='dogmascot'){p.a+=dt*3;}else if(pf.kind.startsWith('protest')){p.a=Math.PI/2+Math.sin(G.time*3+p.id)*0.3;}
    const d=hyp(P.x-p.x,P.y-p.y);if(d<260&&p.sayT<=0&&rand()<dt*0.35){p.say=L(PLINES[pf.kind][bagPick('pf_'+pf.kind,PLINES[pf.kind])]);p.sayT=Math.min(4.5,1.6+p.say.length*0.04);if(pf.kind!=='mime'&&pf.kind!=='statue')sfx.voice(p,dv(p.x,p.y));}
    if(pf.kind==='musician'&&d<420&&G.state==='play'){p.mt=(p.mt||0)-dt;if(p.mt<=0){p.mt=0.28;const sc=[392,440,494,523,587,659,587,523],k=(p.mi=(p.mi||0)+1)%sc.length,v=0.06*(1-d/420);aT(sc[k],0.25,'triangle',v);if(k%2===0)aT(sc[k]/2,0.35,'sine',v*0.8);}}}}
function drawPerfExtra(p){if(p.sign){g.save();g.translate(p.x,p.y-26);g.fillStyle='#6b4f2a';g.fillRect(-1.5,0,3,16);g.fillStyle='#f5e6c4';g.fillRect(-26,-14,52,16);g.strokeStyle='#6b4f2a';g.lineWidth=1.5;g.strokeRect(-26,-14,52,16);g.fillStyle='#b03a2e';g.font='bold 9px Rubik,sans-serif';g.textAlign='center';g.textBaseline='middle';g.direction=G.lang==='he'?'rtl':'ltr';g.fillText(L(p.sign),0,-6,50);g.restore();}
  if(p.perf==='musician'){g.save();g.translate(p.x,p.y);g.rotate(p.a);g.fillStyle='#a0522d';g.beginPath();g.ellipse(9,4,7,5,0.4,0,TAU);g.fill();g.fillStyle='#3e2a1a';g.fillRect(13,1,12,2);g.restore();if(rand()<0.05)part('spark',p.x+rr(-10,10),p.y-20,rr(-15,15),-40,0.9,3);}
  if(p.perf==='mime'){g.strokeStyle='rgba(255,255,255,'+(0.25+0.15*Math.sin(G.time*2))+')';g.lineWidth=1.5;g.setLineDash([4,4]);g.strokeRect(p.x-22,p.y-22,44,44);g.setLineDash([]);}}
// ---------- secrets & easter eggs ----------
const BOTTLES=[];
function genSecrets(){const sands=[];for(let k=0;k<4000&&sands.length<60;k++){const x=4+Math.floor(rand2(k)*340),y=4+Math.floor(rand2(k+9999)*190);if(tget(x,y)===TL.SAND&&tget(x+1,y)!==TL.BLD)sands.push([x,y]);}
  const picks=[[95,40],[30,152],[236,30],[262,90],[102,194]];for(const [x,y] of picks){let best=null,bd=1e9;for(const s of sands){const d=hyp(s[0]-x,s[1]-y);if(d<bd){bd=d;best=s;}}if(best)BOTTLES.push({x:(best[0]+0.5)*T,y:(best[1]+0.5)*T});}
  DECOR.push({t:'devroom',x:POI.vale?POI.vale.x+380:0,y:POI.vale?POI.vale.y+700:0});}
function rand2(k){const x=Math.sin(k*12.9898+78.233)*43758.5453;return x-Math.floor(x);}
const BNOTES=[R2('אם מצאת את זה, אני עדיין תקוע על האי. יש פה רק קוקוסים ומיליונרים.','If you found this, I am still stuck on the island. Only coconuts and millionaires here.'),R2('הברווז לא ברווז. תבדוק את העיניים שלו.','The duck is not a duck. Check its eyes.'),R2('ביגפוט אוהב את הפרדס הישן. בלילה. הוא ביישן.','Bigfoot likes Old Orchard. At night. He is shy.'),R2('ראיתי אור ירוק מעל הבסיס הצבאי בשלוש לפנות בוקר.','I saw a green light over the army base at 3 a.m.'),R2('האוצר: מתחת לדגל של חור הגולף האחרון. סליחה, אין לי עט טוב.','The treasure: under the flag of the last golf hole. Sorry, bad pen.')];
function secretsTick(dt){const P=G.player,px=P.veh?P.veh.x:P.x,py=P.veh?P.veh.y:P.y,h=ENV.clock;
  // bottles
  for(let i=0;i<BOTTLES.length;i++){const b=BOTTLES[i];if(G.got.includes('bt'+i)||P.veh||hyp(px-b.x,py-b.y)>34)continue;G.got.push('bt'+i);const n=BOTTLES.filter((_,k)=>G.got.includes('bt'+k)).length;toast(fmt(tr('bottle'),n,L(BNOTES[i%5])),7);sfx.blip();if(n>=5)secret('bottles');}
  if(G.got.includes('egg_bottles')&&!G.got.includes('treasure')&&POI.golf&&hyp(px-(POI.golf.x+240),py-(POI.golf.y+270))<70&&!P.veh){G.got.push('treasure');G.money+=5000;toast(fmt(tr('treasure'),5000),5);sfx.pass();}
  // bigfoot at night in Old Orchard
  if(ENV.dark>0.6&&areaAt(px,py)==='res'){if(!G.bigfoot&&rand()<dt*0.05){const a=rr(0,TAU),x=px+Math.cos(a)*420,y=py+Math.sin(a)*420;if(sideOK(tileAt(x,y))&&!onScreen(x,y,10)){const p=mkPed('civ',x,y);p.persist=true;p.bigfoot=1;p.shirt='#5d4037';p.pants='#4e342e';p.skin='#6d4c41';p.hair='#3e2723';p.hat=null;p.st='walk';G.bigfoot=p;toast(tr('bigfootRun'),3);}}}
  const bf=G.bigfoot;if(bf){if(bf.dead||bf.remove||ENV.dark<0.5||hyp(bf.x-px,bf.y-py)>1600){bf.remove=true;G.bigfoot=null;}else{const d=hyp(bf.x-px,bf.y-py);if(d<240){bf.st='flee';bf.ft=3;bf.fx=px;bf.fy=py;}if(d<70&&!P.veh){secret('bigfoot');G.got.push('bigfootSeen');bf.remove=true;G.bigfoot=null;for(let k=0;k<8;k++)part('dust',bf.x,bf.y,rr(-60,60),rr(-60,60),0.8,10);}}}
  // UFO 2-4 am over the army base
  if(h>=2&&h<4.2&&!G.got.includes('egg_ufo')){const ux=(RESTRICT.x0+RESTRICT.x1)/2,uy=(RESTRICT.y0+RESTRICT.y1)/2;G.ufo={x:ux+Math.cos(G.time*0.7)*240,y:uy+Math.sin(G.time*0.9)*160};
    if(hyp(px-G.ufo.x,py-G.ufo.y)<1400&&!G.ufoHint){G.ufoHint=1;toast(tr('ufoHint'),3);}if(hyp(px-G.ufo.x,py-G.ufo.y)<70){secret('ufo');giveWeapon('ray',40);G.weapon='ray';setTimeout(()=>toast(tr('rayGun'),5),2500);for(let k=0;k<20;k++)part('spark',px+rr(-30,30),py+rr(-30,30),rr(-80,80),rr(-80,80),1,3);}}else G.ufo=null;
  // ghost car on the west bridge at midnight
  if((h>=23.9||h<1)&&!G.got.includes('egg_ghost')){if(!G.ghostCar){const y=nodePos(7,4).y+30;G.ghostCar={x:120*T,y,vx:220};}const gc=G.ghostCar;gc.x+=gc.vx*dt;if(gc.x>170*T)gc.x=110*T;if(hyp(px-gc.x,py-gc.y)<60){secret('ghost');G.ghostCar=null;}}else G.ghostCar=null;
  // train loop
  if(P.ride&&P.ride.tr){const s=P.ride.tr.s;if(P.ride.s0==null){P.ride.s0=s;P.ride.trav=0;P.ride.last=s;}else{P.ride.trav+=fwd(P.ride.last,s);P.ride.last=s;if(P.ride.trav>TRK.L-50)secret('loop');}}
  // HALO roof landing
  const v=P.veh;if(v&&v.t.heli&&POI.halo){const hb=BUILDINGS.find(b=>b.logo==='HALO');if(hb&&px>hb.x*T&&px<(hb.x+hb.w)*T&&py>hb.y*T&&py<(hb.y+hb.h)*T&&v.alt<0.45&&Math.abs(v.speed)<40){v.alt=Math.max(v.alt,0.3);secret('halo');}}
  // dev room behind the Vale estate palms
  const dr=DECOR.find(d=>d.t==='devroom');if(dr&&!P.veh&&hyp(px-dr.x,py-dr.y)<50)secret('dev');}
function duckHonk(){const P=G.player,v=P.veh;if(!v||!POI.duck||hyp(v.x-POI.duck.x,v.y-POI.duck.y)>360)return;G.duckN=(G.time-(G.duckT||0)<2.5?(G.duckN||0)+1:1);G.duckT=G.time;
  if(G.duckN>=3){G.duckN=0;if(secret('duck')){aSyl(120,0,0.6,0.4,0);aSyl(100,0.6,0.7,0.4,3);toast(L(R2('הברווז: "קוואק. תפסיק לצפור עליי." (והפיל כסף)','The duck: "Quack. Stop honking at me." (and dropped cash)')),5);for(let k=0;k<5;k++)mkPickup('cash',POI.duck.x+rr(-60,60),POI.duck.y+rr(30,90),{amt:200});}}}
function copDanceCheck(){const P=G.player;if(!POI.cops||hyp(P.x-POI.cops.x,P.y-POI.cops.y)>260||G.wanted>0)return;let n=0;for(const p of G.peds)if(p.type==='cop'&&!p.dead&&hyp(p.x-P.x,p.y-P.y)<300){p.st='dance';p.ft=4;n++;}if(n)secret('copdance');}
function drawSecrets(inV){for(let i=0;i<BOTTLES.length;i++){const b=BOTTLES[i];if(G.got.includes('bt'+i)||!inV(b.x,b.y,30))continue;const bob=Math.sin(G.time*2+i)*2;g.save();g.translate(b.x,b.y+bob);g.rotate(0.6);g.fillStyle='rgba(120,200,160,0.85)';rrect(g,-8,-4,14,8,3);g.fill();g.fillStyle='#8a6b4a';g.fillRect(6,-2,4,4);g.fillStyle='#f5e6c4';g.fillRect(-5,-2,8,4);g.restore();}
  const gc=G.ghostCar;if(gc&&inV(gc.x,gc.y,80)){g.save();g.globalAlpha=0.35+0.2*Math.sin(G.time*7);g.translate(gc.x,gc.y);g.fillStyle='#cfe9ff';rrect(g,-34,-15,68,30,12);g.fill();g.fillStyle='#ffffff';g.fillRect(-10,-11,22,22);g.restore();}
  if(G.got.includes('egg_bottles')&&!G.got.includes('treasure')&&POI.golf){const x=POI.golf.x+240,y=POI.golf.y+270;if(inV(x,y,40)){g.fillStyle='rgba(255,215,0,'+(0.3+0.3*Math.sin(G.time*5))+')';g.beginPath();g.arc(x,y,22,0,TAU);g.fill();g.fillStyle='#8a5a2b';g.font='bold 20px sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText('✕',x,y);}}
  const dr=DECOR.find(d=>d.t==='devroom');if(dr&&inV(dr.x,dr.y,60)){g.fillStyle='rgba(0,0,0,0.25)';g.fillRect(dr.x-18,dr.y-14,40,32);g.fillStyle='#6b4f2a';g.fillRect(dr.x-20,dr.y-16,40,32);g.fillStyle='#f5e6c4';g.font='bold 8px Rubik,sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText(G.lang==='he'?'צוות הפיתוח':'DEV TEAM',dr.x,dr.y-6);g.fillText(G.lang==='he'?'היה כאן':'WAS HERE',dr.x,dr.y+5);}}
function drawUfo(){const u=G.ufo;if(!u)return;const q=projPt(u.x,u.y,260);g.save();g.globalCompositeOperation='lighter';g.fillStyle='rgba(120,255,140,0.18)';g.beginPath();g.moveTo(q[0]-14,q[1]);g.lineTo(u.x-60,u.y+40);g.lineTo(u.x+60,u.y+40);g.lineTo(q[0]+14,q[1]);g.fill();g.globalCompositeOperation='source-over';
  g.fillStyle='#9aa4ad';g.beginPath();g.ellipse(q[0],q[1],46,16,0,0,TAU);g.fill();g.fillStyle='#bfe9ff';g.beginPath();g.ellipse(q[0],q[1]-6,18,12,0,0,TAU);g.fill();for(let k=0;k<6;k++){const a=G.time*3+k*1.05;g.fillStyle=k%2?'#7dff8a':'#ffe14d';g.beginPath();g.arc(q[0]+Math.cos(a)*36,q[1]+Math.sin(a)*10,3,0,TAU);g.fill();}g.restore();}
