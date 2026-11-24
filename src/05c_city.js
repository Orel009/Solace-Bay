// ---------- heat / wanted, shops, robberies, ped kinds, wildlife, feed ----------
const SHOPS=[],GAS=[],TH=[0,1,4,10,20,34,52];
function starsFor(h){let s=0;for(let i=1;i<=6;i++)if(h>=TH[i])s=i;return s;}
function setStars(n){G.heat=Math.max(G.heat||0,TH[n]);if(G.wanted<n){G.wanted=n;if(n>=3)post('stars');}G.unseen=0;}
function addHeat(x){G.heat=(G.heat||0)+x;G.rep=Math.max(-50,(G.rep||0)-x*0.4);const s=starsFor(G.heat);if(s>G.wanted){G.wanted=s;if(s>=3)post('stars');}G.unseen=0;}
function clearWanted(){G.wanted=0;G.heat=0;G.unseen=0;G.lastSeen=null;}
const dv=(x,y)=>{const P=G.player;return clamp(1-hyp(x-P.x,y-P.y)/520,0,1);};

const OUTFITS=[{id:'std',he:'בגדי רחוב',en:'Street clothes',shirt:'#2e8b57',price:0},{id:'aloha',he:'חולצת חוף',en:'Beach shirt',shirt:'#ff7f50',hat:'#f5e6b3',price:150},{id:'track',he:'אימונית',en:'Tracksuit',shirt:'#2980b9',hat:'#c0392b',price:200},
 {id:'biker',he:'מעיל עור',en:'Leather jacket',shirt:'#1a1a1a',price:300},{id:'suit',he:'חליפה',en:'Suit',shirt:'#23303f',price:450},{id:'gold',he:'ז׳קט זהב',en:'Gold jacket',shirt:'#d4af37',price:2500}];
function OUTFIT(){return OUTFITS.find(o=>o.id===G.outfit)||OUTFITS[0];}
function wearOutfit(id){const ch=G.outfit!==id;G.outfit=id;if(ch&&G.wanted>0&&G.wanted<=3&&!G.seenNow){clearWanted();toast(tr('newlook'),3.5);}}
function MKT(){return{name:R2('קוויקסטופ 24','QuikStop 24'),col:'#7dffb0',rob:{name:R2('שדוד את הקופה','Rob the register'),dur:4,min:250,max:600,stars:2,cd:150,done:R2('הקופה רוקנה','Register emptied')}};}
function addShop(k,b,side,o){const cx=(b.x+b.w/2)*T,wy=side===2?(b.y+b.h)*T:b.y*T,out=side===2?1:-1;
  const s=Object.assign({k,b,side,x:cx,wy,out,sx:cx,sy:wy+out*30,open:0,cd:0},o);SHOPS.push(s);(b.shops||(b.shops=[])).push(s);return s;}

// ---------- ped kinds ----------
const KINDS={casual:{sp:1},biz:{sp:1.15,shirts:['#2c3e50','#34495e','#1b2631','#4a4a55','#5d6d7e'],v:170},tourist:{sp:0.75,shirts:['#ff7f50','#1abc9c','#f1c40f','#e84393'],hat:'#f5e6b3',v:270},
 jogger:{sp:2.5,shirts:['#00d2d3','#ff9f1a','#ff3f81','#b8e600'],v:240,hp:65},beach:{sp:0.8,v:250},worker:{sp:0.95,shirts:['#e67e22','#f39c12'],hat:'#f4d03f',hp:90,tough:1,v:140},
 elder:{sp:0.5,hair:'#d9d9d9',hp:35,v:120,meek:1},punk:{sp:1.05,shirts:['#111111','#3d0a3d'],mohawk:['#e84393','#2ecc71','#00d2d3'],hp:85,tough:1,v:200},
 dog:{sp:1.6,dog:1,hp:30,v:520,meek:1,shirts:['#8d5524','#c68642','#2b2b2b','#f1e0c5']}};
function setKind(p,k){const K=KINDS[k]||KINDS.casual;p.kind=k;p.sp=K.sp||1;p.fem=0;p.hairL=0;p.hat=null;p.moh=null;p.bare=0;if(K.shirts)p.shirt=pick(K.shirts);if(K.hat)p.hat=K.hat;if(K.hair)p.hair=K.hair;if(K.hp)p.hp=K.hp;p.voice=K.v||200;
  if(K.mohawk)p.moh=pick(K.mohawk);p.pants=pick(['#23232b','#2c3e50','#3b3b3b','#5d4e37','#1f3a5f']);
  if(!K.dog&&k!=='worker'&&k!=='elder'&&k!=='punk'&&rand()<0.45){p.fem=1;p.voice+=80;p.hairL=1;}
  if(k==='beach'){p.bare=1;p.pants=pick(['#e74c3c','#3498db','#f1c40f','#1abc9c','#e84393']);}
  if(k==='casual'&&rand()<0.2)p.hat=pick(['#c0392b','#2c3e50','#ecf0f1']);return p;}
function kindFor(tx,ty){const d=district(tx,ty),r=rand();
  if(d==='crown')return r<0.3?'biz':r<0.5?'elder':r<0.68?'jogger':r<0.82?'dog':'casual';if(d==='strip')return r<0.32?'tourist':r<0.52?'punk':r<0.78?'casual':'biz';if(d==='east')return r<0.4?'worker':r<0.8?'casual':'punk';if(d==='air')return r<0.5?'biz':r<0.8?'tourist':'worker';
  if(d==='down')return r<0.4?'biz':r<0.68?'casual':r<0.78?'tourist':r<0.87?'punk':r<0.94?'jogger':'elder';
  if(d==='harb')return r<0.5?'worker':r<0.78?'casual':r<0.9?'punk':'biz';
  if(d==='beach')return r<0.38?'beach':r<0.6?'tourist':r<0.72?'jogger':r<0.9?'casual':'dog';
  return r<0.42?'casual':r<0.56?'elder':r<0.68?'jogger':r<0.78?'dog':r<0.88?'biz':'punk';}
Object.assign(REACT,{insult:[R2('לך מפה, ליצן.','Get lost, clown.'),R2('מי אתה בכלל?','Who even are you?')],psycho:[R2('זה המשוגע מהחדשות!',"It's that psycho from the news!")],
 hello:[R2('היי, מה נשמע?','Hey, how are you?'),R2('שלום שלום!','Well hello!'),R2('יום טוב!','Have a good one!')],hero:[R2('אתה הבחור שעוזר לאנשים, נכון?',"You're the guy who helps people, right?"),R2('כל הכבוד לך!','Respect!')],
 dog:[R2('האו! האו!','Woof! Woof!')],chat:[R2('שמעת מה קרה בנמל?','Did you hear what happened at the harbor?'),R2('המחירים פה מטורפים.','Prices here are insane.'),R2('הבוס שלי משגע אותי.','My boss is driving me nuts.'),
  R2('איזה חום היום.','So hot today.'),R2('אומרים שהקדושים והגאות שוב רבים.','They say the Saints and the Tide are at it again.'),R2('כן, בטח.','Yeah, sure.'),R2('לא יכול להיות!','No way!'),R2('חחח, נכון.','Haha, true.'),
  R2('ראית את המסוק אתמול?','Did you see the chopper last night?'),R2('אני צריך חופשה.','I need a vacation.'),R2('מה אתה אומר!','You don\'t say!')]});
const FEED={rob:[R2('@bayfeed: שוד מזוין בחנות. החשוד נמלט.','@bayfeed: Armed robbery at a store. Suspect fled.'),R2('@dana_sb: מישהו הרגע שדד את הקופה מולי?!','@dana_sb: Did someone just rob the register in front of me?!')],
 bank:[R2('@solace_news: שוד בנק במרכז העיר! המשטרה בכוננות.','@solace_news: Bank heist downtown! Police on high alert.')],stars:[R2('@scanner_sb: מרדף משטרתי פעיל. התרחקו מהאזור.','@scanner_sb: Active police pursuit. Stay clear.')],
 heli:[R2('@solace_news: מסוק משטרתי הופל. כן, קראתם נכון.','@solace_news: Police chopper shot down. Yes, you read that right.')],gator:[R2('@marina_mike: תנין נשך מישהו בחוף. אל תשחו!','@marina_mike: Gator bit someone at the beach. Do not swim!')],
 boom:[R2('@bayfeed: דיווחים על פיצוץ. מה קורה בעיר הזאת?','@bayfeed: Explosion reported. What is going on in this city?')],taxi:[R2('@cab_reviews: נהג מונית של חמישה כוכבים. הגענו בחיים.','@cab_reviews: Five-star cabbie. We arrived alive.')],
 hero:[R2('@good_news_sb: אזרח אלמוני עצר שודד ברחוב.','@good_news_sb: Unknown citizen stopped a street mugger.')],fall:[R2('@parkour_sb: מישהו קפץ מגג ונשאר בחיים?','@parkour_sb: Someone jumped off a roof and lived?')]};
function post(k){if((G.feedCD||0)>G.time)return;G.feedCD=G.time+9;const f=pick(FEED[k]);if(f&&typeof showFeed==='function')showFeed(L(f));}

// ---------- talk menu ----------
function openTalk(p){G.talk={p,t:5};buildTalk();}
function talkDo(k){const T2=G.talk;if(!T2)return;const p=T2.p,P=G.player;G.talk=null;buildTalk();if(p.dead||hyp(p.x-P.x,p.y-P.y)>110)return;const K=KINDS[p.kind]||{};p.a=Math.atan2(P.y-p.y,P.x-p.x);
  if(k==='greet'){p.st='idle';p.tm=3;if(p.type==='civ'){const key=G.rep>12&&rand()<0.5?'hero':G.rep<-15?'psycho':rand()<0.5?'hello':null;if(key)say(p,key,2.6);else civLine(p);G.rep=Math.min(50,(G.rep||0)+0.4);}else civLine(p);sfx.voice(p,1);}
  else if(k==='taunt'){G.rep=Math.max(-50,(G.rep||0)-1);if(p.type==='cop'){say(p,'cop');addHeat(0.6);}else if(p.type==='gang'){p.hostile=true;say(p,'fight');}
    else if(K.meek){p.st='flee';p.ft=4;p.fx=P.x;p.fy=P.y;say(p,'bump');}else if(K.tough||rand()<0.5){p.brawl=9;say(p,'fight');}else say(p,'insult');sfx.voice(p,1);}
  else if(k==='rob'&&p.type==='civ'&&!p.mugged){p.mugged=1;say(p,'mug');mkPickup('cash',p.x+Math.cos(p.a)*18,p.y+Math.sin(p.a)*18,{amt:ri(15,90)});p.st='flee';p.ft=5;p.fx=P.x;p.fy=P.y;crime(1,false);sfx.scream(1,p.voice||200);}}

// ---------- world update ----------
function cityInit(){G.gators=[[118.5,100],[119,62],[60,151],[123,126],[100,159],[40,152],[121.5,22],[2,70]].map(p=>({x:p[0]*T,y:p[1]*T,hx:p[0]*T,hy:p[1]*T,a:rr(0,TAU),hp:70,cool:0,ph:rr(0,9)}));
  G.flam=[[110,45],[111.5,100],[109.5,128]].map(p=>({x:p[0]*T,y:p[1]*T,fly:0}));for(const s of SHOPS){s.cd=0;s.open=0;}}
function cityUpdate(dt){const P=G.player,px=P.x,py=P.y;
  // shops: sliding doors, entering
  insideUpdate(dt);if(G.way&&hyp(px-G.way.x,py-G.way.y)<110){G.way=null;sfx.blip();}
  G.ambT=(G.ambT===undefined?45:G.ambT)-dt;if(G.ambT<=0){G.ambT=rr(60,100);post('amb');}
  propsUpdate(dt);sprayUpdate(dt);
  for(const s of SHOPS){const d=hyp(px-s.sx,py-s.sy),hm=s.k==='home',sale=hm&&!owned(s.pid),locked=hm?sale||(G.wanted>0&&G.seenNow):G.wanted>0||s.cd>G.time,can=!P.veh&&!P.roof&&!P.climb&&!P.inside;
    s.open=appr(s.open,can&&d<70&&!locked?1:0,dt*3.2);
    if(G.inShop===s){if(d>46)G.inShop=null;continue;}
    if(can&&Math.abs(px-s.x)<15&&Math.abs(py-(s.wy+s.out*10))<7){if(locked){if(!s.told||G.time-s.told>4){s.told=G.time;if(!sale)toast(tr(hm?'homeSeen':s.cd>G.time?'closedRob':'locked'));}}else if(s.open>0.85){enterRoom(s);return;}}}
  // gas stations
  const v=P.veh;if(v&&!v.t.boat&&!v.t.tank&&Math.abs(v.speed)<25)for(const gs of GAS){if(hyp(v.x-gs.x,v.y-gs.y)>55)continue;const need=v.fuel<0.995||v.hp<v.t.hp-1||v.dents;
    if(need&&(G.money>0||owned('b_gas'))){v.fuel=Math.min(1,v.fuel+dt*0.3);v.hp=Math.min(v.t.hp,v.hp+dt*v.t.hp*0.2);v.dry=0;G.gasAcc=(G.gasAcc||0)+dt*14;if(G.gasAcc>=1){G.gasAcc-=1;if(!owned('b_gas'))G.money--;}
      if(v.hp>=v.t.hp-1&&v.dents){repairVeh(v);sfx.blip();}if(!gs.told||G.time-gs.told>6){gs.told=G.time;toast(tr('fueling'),2.5);}}}
  // alligators
  for(const ga of G.gators){if(ga.dead)continue;ga.cool-=dt;ga.ph+=dt;const d=hyp(px-ga.x,py-ga.y),hunt=P.swim&&!P.veh&&!P.dead&&d<270;let tx,ty,sp;
    if(hunt){tx=px;ty=py;sp=118;}else{tx=ga.hx+Math.cos(ga.ph*0.25)*120;ty=ga.hy+Math.sin(ga.ph*0.19)*120;sp=26;}
    const a=Math.atan2(ty-ga.y,tx-ga.x);ga.a+=angDiff(ga.a,a)*Math.min(1,dt*3);const nx=ga.x+Math.cos(ga.a)*sp*dt,ny=ga.y+Math.sin(ga.a)*sp*dt;if(tileAt(nx,ny)===TL.WATER){ga.x=nx;ga.y=ny;}
    if(hunt&&d<24&&ga.cool<=0){ga.cool=1.2;hurtPed(P,16,null,'bite');G.hurtFlash=0.8;splash(px,py,10);sfx.punch();post('gator');}}
  for(const f of G.flam)f.fly=appr(f.fly,hyp(px-f.x,py-f.y)<140?1:0,dt*(f.fly>0&&hyp(px-f.x,py-f.y)>=140?0.25:2.2));
  // talk menu timeout
  if(G.talk){G.talk.t-=dt;if(G.talk.t<=0||G.talk.p.dead||hyp(G.talk.p.x-px,G.talk.p.y-py)>110||P.veh){G.talk=null;buildTalk();}}
  if(G.wanted===0)G.heat=Math.max(0,Math.min(G.heat||0,0.95)-dt*0.04);}
function gatorHit(b){for(const ga of G.gators){if(ga.dead||(ga.x-b.x)**2+(ga.y-b.y)**2>330)continue;ga.hp-=b.dmg;part('blood',b.x,b.y,0,0,0.4,4);if(ga.hp<=0){ga.dead=true;splash(ga.x,ga.y,14);}return true;}return false;}
function useMed(){const P=G.player;if(G.state!=='play'||!(G.meds>0)||P.dead||P.hp>=100)return;G.meds--;P.hp=Math.min(100,P.hp+70);sfx.blip();toast(tr('medUsed'),1.5);}

// ---------- drawing ----------
function drawCityGround(inV){const tt=G.time,d=ENV.dark;
  for(const s of SHOPS){if(!inV(s.x,s.wy,80))continue;const y0=s.out>0?s.wy:s.wy-8,o=s.open*13;g.fillStyle='#16181c';g.fillRect(s.x-19,y0,38,8);g.fillStyle=d>0.2?'#fff1c4':'#2b3a4a';g.fillRect(s.x-16,y0+1,32,6);
    g.fillStyle='rgba(150,205,235,0.92)';g.fillRect(s.x-16-o,y0+1,15.5,6);g.fillRect(s.x+0.5+o,y0+1,15.5,6);g.strokeStyle='rgba(255,255,255,0.7)';g.lineWidth=1;g.strokeRect(s.x-16-o,y0+1,15.5,6);g.strokeRect(s.x+0.5+o,y0+1,15.5,6);
    g.fillStyle=s.col;g.globalAlpha=0.35;g.fillRect(s.x-18,s.out>0?s.wy+8:s.wy-34,36,26);g.globalAlpha=1;}
  for(const gs of GAS)if(inV(gs.x,gs.y,60)){g.strokeStyle='#5ad1ff';g.lineWidth=4;g.setLineDash([10,6]);g.lineDashOffset=-tt*16;g.strokeRect(gs.x-30,gs.y-44,60,88);g.setLineDash([]);}
  for(const ga of G.gators||[]){if(ga.dead||!inV(ga.x,ga.y,50))continue;g.save();g.translate(ga.x,ga.y);g.rotate(ga.a);const w=Math.sin(tt*4+ga.ph)*5;
    g.fillStyle='rgba(255,255,255,0.25)';g.beginPath();g.ellipse(0,0,24,10,0,0,TAU);g.fill();g.fillStyle='#2f5a2a';g.beginPath();g.moveTo(-34,w);g.lineTo(-14,-5);g.lineTo(-14,5);g.closePath();g.fill();
    g.beginPath();g.ellipse(0,0,17,7,0,0,TAU);g.fill();g.fillStyle='#3c6e34';g.beginPath();g.ellipse(17,0,9,4.5,0,0,TAU);g.fill();g.fillStyle='#e8e36a';g.fillRect(11,-4,2.5,2.5);g.fillRect(11,1.5,2.5,2.5);g.restore();}
  for(const f of G.flam||[]){if(!inV(f.x,f.y,260))continue;for(let k=0;k<6;k++){const a=k*1.05+0.4,r=24+k*7+f.fly*170,x=f.x+Math.cos(a)*r,y=f.y+Math.sin(a)*r-f.fly*40,fl=f.fly>0.05;
      if(fl){g.fillStyle='rgba(0,0,10,0.15)';g.beginPath();g.ellipse(x+20,y+50,8,4,0,0,TAU);g.fill();}g.fillStyle='#ff8fb1';g.beginPath();g.ellipse(x,y,fl?9:6,fl?4:5,a,0,TAU);g.fill();
      if(fl){const wv=Math.sin(tt*14+k)*7;g.strokeStyle='#ff6f9c';g.lineWidth=3;g.beginPath();g.moveTo(x-Math.sin(a)*12,y+Math.cos(a)*12+wv);g.lineTo(x,y);g.lineTo(x+Math.sin(a)*12,y-Math.cos(a)*12+wv);g.stroke();}
      else{g.strokeStyle='#ff8fb1';g.lineWidth=2;g.beginPath();g.moveTo(x+3,y-3);g.quadraticCurveTo(x+9,y-10,x+6,y-14);g.stroke();g.fillStyle='#222';g.fillRect(x+5,y-16,3,2);}}}}
function drawAwning(s,h){const hw=44,a1=projPt(s.x-hw,s.wy,34),a2=projPt(s.x+hw,s.wy,34),b2=projPt(s.x+hw,s.wy+s.out*28,24),b1=projPt(s.x-hw,s.wy+s.out*28,24);
  g.fillStyle=s.col;g.beginPath();g.moveTo(a1[0],a1[1]);g.lineTo(a2[0],a2[1]);g.lineTo(b2[0],b2[1]);g.lineTo(b1[0],b1[1]);g.closePath();g.fill();
  g.fillStyle='rgba(255,255,255,0.8)';for(let k=0;k<4;k++){const u0=(k*2+0.5)/8,u1=(k*2+1.5)/8;g.beginPath();g.moveTo(lerp(a1[0],a2[0],u0),lerp(a1[1],a2[1],u0));g.lineTo(lerp(a1[0],a2[0],u1),lerp(a1[1],a2[1],u1));g.lineTo(lerp(b1[0],b2[0],u1),lerp(b1[1],b2[1],u1));g.lineTo(lerp(b1[0],b2[0],u0),lerp(b1[1],b2[1],u0));g.closePath();g.fill();}
  g.strokeStyle='rgba(0,0,0,0.35)';g.lineWidth=1.5;g.beginPath();g.moveTo(a1[0],a1[1]);g.lineTo(a2[0],a2[1]);g.lineTo(b2[0],b2[1]);g.lineTo(b1[0],b1[1]);g.closePath();g.stroke();
  if(ENV.dark>0.02){g.fillStyle=`rgba(8,12,34,${ENV.dark*0.4})`;g.fill();}}
function drawDog(p){const wg=Math.sin(G.time*14+p.id)*4,sw=p.walk>0?Math.sin(p.walk*0.3)*3:0;g.fillStyle='rgba(0,0,0,0.5)';g.fillRect(-6+sw,-5,3,3);g.fillRect(-6-sw,2,3,3);g.fillRect(4-sw,-5,3,3);g.fillRect(4+sw,2,3,3);
  g.strokeStyle=p.shirt;g.lineWidth=2.4;g.beginPath();g.moveTo(-8,0);g.lineTo(-14,wg);g.stroke();g.fillStyle=p.shirt;g.beginPath();g.ellipse(0,0,9,4.6,0,0,TAU);g.fill();g.beginPath();g.arc(9.5,0,4.2,0,TAU);g.fill();
  g.fillStyle='rgba(0,0,0,0.45)';g.fillRect(7,-5,3,2.5);g.fillRect(7,2.5,3,2.5);g.fillStyle='#111';g.fillRect(13,-1,2,2);}
function drawDog(p){const wg=Math.sin(G.time*14+p.id)*4,sw=p.walk>0?Math.sin(p.walk*0.3)*3:0;g.fillStyle='rgba(0,0,0,0.5)';g.fillRect(-6+sw,-5,3,3);g.fillRect(-6-sw,2,3,3);g.fillRect(4-sw,-5,3,3);g.fillRect(4+sw,2,3,3);
  g.strokeStyle=p.shirt;g.lineWidth=2.4;g.beginPath();g.moveTo(-8,0);g.lineTo(-14,wg);g.stroke();g.fillStyle=p.shirt;g.beginPath();g.ellipse(0,0,9,4.6,0,0,TAU);g.fill();g.beginPath();g.arc(9.5,0,4.2,0,TAU);g.fill();
  g.fillStyle='rgba(0,0,0,0.45)';g.fillRect(7,-5,3,2.5);g.fillRect(7,2.5,3,2.5);g.fillStyle='#111';g.fillRect(13,-1,2,2);}
function drawBody(p,isP){if(p.kind==='dog'){drawDog(p);return;}
  const air=isP&&p.jump>0,moving=p.walk>0,sw=air?6:moving?Math.sin(p.walk*0.16)*7:0,of=isP?OUTFIT():null,shirt=isP?of.shirt:p.shirt,hat=isP?of.hat:p.hat,pants=isP?'#26303d':(p.pants||'#23232b'),sk=p.skin,sl=p.bare?sk:shirt;
  g.fillStyle=p.bare?sk:pants;rrect(g,-4+sw,-7,9,5,2);g.fill();rrect(g,-4-sw,2,9,5,2);g.fill();g.fillStyle=p.bare?'#e9d8b5':'#15151a';g.fillRect(3+sw,-7,3,5);g.fillRect(3-sw,2,3,5);
  const punch=isP&&G.punchT>0?10:0,wp=isP?G.weapon:p.wpn,armed=wp&&wp!=='fist'&&(isP||p.hostile||p.war||(p.type==='cop'&&G.wanted>1)||p.type==='soldier');
  const arm=(x,y)=>{g.fillStyle=sl;g.beginPath();g.arc(x*0.5,y*0.92,3.7,0,TAU);g.fill();g.fillStyle=sk;g.beginPath();g.arc(x,y,2.8,0,TAU);g.fill();};
  if(air){arm(4,-14);arm(4,14);}else if(p.st==='cower'){arm(3,-5);arm(3,5);}
  else if(armed){arm(8,5);arm(4-sw*0.5,-10);g.fillStyle='#17181b';const wl=wp==='pistol'?9:wp==='rocket'?20:16;g.fillRect(8,3.6,wl,wp==='rocket'||wp==='shotgun'?4:3);if(wp!=='pistol'){g.fillStyle='#4b3a2a';g.fillRect(5,3.6,4,3.4);}}
  else{arm(2-sw*0.7+punch,-10.6);arm(2+sw*0.7,10.6);}
  if(p.kind==='biz'){g.fillStyle='#6b4a2b';rrect(g,-1+sw*0.7,12.5,8,5,1);g.fill();}
  if(p.kind==='elder'){g.strokeStyle='#5d4037';g.lineWidth=1.6;g.beginPath();g.moveTo(3+sw*0.7,11);g.lineTo(13,13.5);g.stroke();}
  g.fillStyle=p.bare?sk:shirt;g.beginPath();g.ellipse(0,0,6.6,11,0,0,TAU);g.fill();
  if(p.bare&&p.fem){g.fillStyle=p.pants;g.fillRect(-2.5,-9.5,5,19);}
  if(p.kind==='worker'){g.fillStyle='rgba(255,255,255,0.8)';g.fillRect(-2,-10,2.2,20);g.fillRect(1.5,-10,2.2,20);}
  if(p.kind==='biz'&&!p.fem){g.fillStyle='#ecf0f1';g.fillRect(2,-2.5,4,5);g.fillStyle='#c0392b';g.fillRect(3,-1,3,2);}
  g.fillStyle='rgba(255,255,255,0.15)';g.beginPath();g.ellipse(1.5,-3,3.5,6,0,0,TAU);g.fill();
  g.strokeStyle=isP?'rgba(190,255,216,0.95)':'rgba(0,0,0,0.38)';g.lineWidth=isP?1.6:1;g.beginPath();g.ellipse(0,0,6.6,11,0,0,TAU);g.stroke();
  if(p.kind==='tourist'){g.fillStyle='#1c1c1c';rrect(g,5.5,-3,4.5,6,1);g.fill();g.fillStyle='#8fd3ff';g.fillRect(8.5,-1.2,1.5,2.4);}
  if(p.hairL){g.fillStyle=p.hair;g.beginPath();g.ellipse(-3.6,0,5.6,6.8,0,0,TAU);g.fill();}
  g.fillStyle=sk;g.beginPath();g.arc(1.5,0,5.8,0,TAU);g.fill();g.strokeStyle='rgba(0,0,0,0.25)';g.lineWidth=0.8;g.stroke();
  g.fillStyle=p.type==='cop'?'#14256b':p.type==='soldier'?'#3a4219':(isP?'#3b2a1a':p.hair);g.beginPath();g.arc(-0.3,0,p.type==='cop'||p.type==='soldier'?6.3:4.9,0,TAU);g.fill();
  if(p.moh){g.fillStyle=p.moh;rrect(g,-5.5,-1.6,11,3.2,1.5);g.fill();}
  if(hat){g.fillStyle=hat;g.beginPath();g.arc(0.3,0,6.5,0,TAU);g.fill();g.fillRect(4.5,-4,4.5,8);g.fillStyle='rgba(0,0,0,0.18)';g.beginPath();g.arc(-0.6,0,3.9,0,TAU);g.fill();}
  if(p.kind==='jogger'){g.strokeStyle='#ffffff';g.lineWidth=1.6;g.beginPath();g.moveTo(2.8,-5.3);g.lineTo(2.8,5.3);g.stroke();}
  if(p.type==='cop'){g.fillStyle='#0d1845';g.fillRect(3,-5,3,10);g.fillStyle='#f1c40f';g.fillRect(1,-1,2,2);}
  if(p.vendor){g.fillStyle='#ffffff';g.beginPath();g.arc(-0.3,0,5.4,0,TAU);g.fill();}}
