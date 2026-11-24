// ---------- shop interiors ----------
const FLOORS={guns:['#4a4038','#52463c'],clothes:['#ece2e8','#dfd2dc'],market:['#e2e8e5','#d2dcd8'],mall:['#f0e7d7','#e4d9c5'],bank:['#dbd4c5','#cbc3b2'],casino:['#5a1f2e','#6b2638']};
const CLERKC={guns:'#5d4037',clothes:'#e84393',market:'#27ae60',mall:'#2980b9',bank:'#2c3e50',casino:'#111111'};
const SIGNS={market:R2('אין החזרות. גם לא על החזרות.','No refunds. No refunds on refunds.'),guns:R2('המחיר סופי. גם אתה, אם תתווכח.','Prices are final. So are you, if you argue.'),clothes:R2('אתה נראה מעולה. (זה שלט, הוא לא רואה אותך.)','You look great. (This is a sign. It cannot see you.)'),
 bank:R2('הכסף שלך בטוח אצלנו. מאיתנו — פחות.','Your money is safe with us. From us — less so.'),casino:R2('הבית תמיד מנצח. הבית מודה לך.','The house always wins. The house thanks you.'),mall:R2('קניון בייווק — כי בחוץ חם.','Baywalk Mall — because it is hot outside.')};
Object.assign(REACT,{bankhi:[R2('אפשר לעזור? בבקשה אל תגיד "שוד".','Can I help? Please do not say "robbery".')],jewel:[R2('רק מסתכלים? כולם רק מסתכלים.','Just looking? Everyone is just looking.')],cage:[R2('אסימונים קונים במכונות, מותק.','Chips are at the machines, hon.')],
 clerk:[R2('ברוך הבא! גש לדלפק.','Welcome! Step up to the counter.'),R2('לא לגעת בסחורה, בבקשה.','Please do not touch the merchandise.')],norob:[R2('ברצינות? אין פה קופה.','Seriously? There is no register here.')]});
function roomInit(s){const b=s.b;s.W=Math.min(b.w*T-48,440);s.D=Math.min(b.h*T-40,300);if(b.shops.length>1)s.D=Math.min(s.D,b.h*T/2-20);const W=s.W,D=s.D,cw=Math.min(W-90,230),k=s.k;
  s.sol=[[-cw/2,D-62,cw/2,D-44]];s.spots=[];s.clerk={u:0,v:D-24};
  if(k==='market'){s.sol.push([-W/2+26,74,-34,90],[34,74,W/2-26,90]);if(D>230)s.sol.push([-W/2+26,134,-34,150],[34,134,W/2-26,150]);s.spots.push({u:0,v:D-82,m:'food',lb:R2('קנייה','Shop')});}
  else if(k==='guns'){s.sol.push([-W/2+8,60,-W/2+24,D-90],[W/2-24,60,W/2-8,D-90]);s.spots.push({u:0,v:D-82,m:'guns',lb:R2('נשק ותחמושת','Guns & ammo')});}
  else if(k==='clothes'){s.sol.push([-W/4-16,96,-W/4+16,128],[W/4-16,96,W/4+16,128]);s.spots.push({u:-W/4,v:152,m:'clothes',lb:R2('בגדים','Outfits')},{u:W/4,v:152,m:'clothes',lb:R2('בגדים','Outfits')},{u:0,v:D-82,m:'clothes',lb:R2('קופה','Checkout')});}
  else if(k==='mall'){s.sol.push([-W/2+30,88,-W/2+90,124],[W/2-90,88,W/2-30,124]);s.spots.push({u:-W/2+60,v:148,m:'food',lb:R2('מזון מהיר','Food court')},{u:W/2-60,v:148,m:'clothes',lb:R2('בגדים','Outfits')},{u:0,v:D-82,m:'jewel',lb:R2('תכשיטים','Jeweler')});}
  else if(k==='bank')s.spots.push({u:0,v:D-82,m:'bankhi',lb:R2('פקיד','Teller')});
  else if(k==='casino'){s.sol.push([-W/2+30,80,-W/2+70,170],[W/2-70,80,W/2-30,170]);s.spots.push({u:-W/2+94,v:125,m:'slots',lb:R2('מכונת מזל','Slots')},{u:W/2-94,v:125,m:'slots',lb:R2('מכונת מזל','Slots')},{u:0,v:D-82,m:'cage',lb:R2('קופאית','Cashier')});}}
function rw(s,u,v){return[s.x+u,s.wy-s.out*v];}
function roomFree(s,u,v){for(const r of s.sol)if(u>r[0]-14&&u<r[2]+14&&v>r[1]-14&&v<r[3]+14)return false;return true;}
function enterRoom(s){const P=G.player;P.inside=s;P.x=s.x;P.y=s.wy-s.out*18;P.mvx=P.mvy=0;P.a=s.out>0?-Math.PI/2:Math.PI/2;P.roof=null;P.jump=0;sfx.door();s.cust=[];G.talk=null;buildTalk();toggleWbar(false);
  for(let k=ri(0,2);k>0;k--){let u,v,tr2=0;do{u=rr(-s.W/2+30,s.W/2-30);v=rr(40,s.D-100);}while(++tr2<20&&!roomFree(s,u,v));const q=rw(s,u,v),c=mkPed('npc',q[0],q[1],{persist:true,cust:1});setKind(c,pick(['casual','biz','tourist','elder','punk']));s.cust.push(c);}
  toast(L(s.name)+(G.seen.shopHint?'':' — '+tr('shopHint')),G.seen.shopHint?2:5);G.seen.shopHint=1;}
function leaveRoom(){const P=G.player,s=P.inside;if(!s)return;P.inside=null;P.y=s.wy+s.out*13;P.x=clamp(P.x,s.x-12,s.x+12);G.inShop=s;for(const c of s.cust||[])c.remove=true;s.cust=[];sfx.door();
  if(G.rob){G.rob=null;setStars(1);toast(tr('robFail'));}}
function roomMove(P,dx,dy){const s=P.inside,o=s.out,hw=s.W/2-9,u0=P.x-s.x,v0=(s.wy-P.y)*o;let u=u0+dx,v=v0-dy*o;
  const hit=(a,b)=>{if(a<-hw||a>hw||b>s.D-9)return true;if(b<9&&Math.abs(a)>=17)return true;for(const r of s.sol)if(a>r[0]-9&&a<r[2]+9&&b>r[1]-9&&b<r[3]+9)return true;return false;};
  if(hit(u,v0))u=u0;if(hit(u,v))v=v0;if(v<18&&Math.abs(u)<32)u*=0.86;
  if(v<-5){leaveRoom();return;}P.x=s.x+u;P.y=s.wy-o*v;}
function nearSpot(s){const P=G.player;let b=null,bd=52;for(const sp of s.spots){const q=rw(s,sp.u,sp.v),d=hyp(P.x-q[0],P.y-q[1]);if(d<bd){bd=d;b=sp;}}return b;}
function insideUse(){const P=G.player,s=P.inside,sp=nearSpot(s);if(!sp){if(s.clerkP&&!s.clerkP.dead){say(s.clerkP,'clerk');sfx.voice(s.clerkP,1);}return;}
  if(sp.m==='bankhi'||sp.m==='jewel'||sp.m==='cage'){say(s.clerkP,sp.m,3);sfx.voice(s.clerkP,1);return;}openShop(s,sp.m);}
function insideAttack(){const P=G.player,s=P.inside;G.fireCD=0.5;if(G.weapon==='fist'){sfx.punch();G.punchT=0.16;return;}
  const c=s.clerkP;if(!s.rob||!c||c.dead){if(c)say(c,'norob');return;}if(G.rob)return;if(s.cd>G.time){toast(tr('closedRob'));return;}
  if(hyp(P.x-c.x,P.y-c.y)>200){toast(tr('robNear'),2);return;}
  G.rob={s,t:0};say(c,'mug',3);sfx.scream(1,260);setStars(1);G.lastSeen={x:s.sx,y:s.sy};toast(tr('robHint'),4);for(const q of s.cust||[]){q.st='cower';q.ft=99;}P.a=Math.atan2(c.y-P.y,c.x-P.x);}
function insideUpdate(dt){const P=G.player,s=P.inside;if(!s){G.spot=null;return;}G.spot=nearSpot(s);if(G.wanted>0)G.unseen=Math.min(G.unseen,2);
  const r=G.rob;if(r&&r.s===s){r.t+=dt;const c=s.clerkP;c.st='cower';if(rand()<dt*4)AU.tone(1400,0.08,'square',0.05);
    if(hyp(P.x-c.x,P.y-c.y)>230){G.rob=null;setStars(1);toast(tr('robFail'));}
    else if(r.t>=s.rob.dur){const q=rw(s,0,s.D-84);mkPickup('cash',q[0],q[1],{amt:ri(s.rob.min,s.rob.max)});s.cd=G.time+s.rob.cd;setStars(s.rob.stars);G.rep=Math.max(-50,G.rep-4);G.rob=null;c.st='idle';toast(L(s.rob.done)+' — '+tr('robGrab'),4);sfx.pass();post(s.k==='bank'?'bank':'rob');if(G.stats)G.stats.robs=(G.stats.robs||0)+1;}}}
function drawInterior(s){const W=s.W,D=s.D,o=s.out,x0=s.x-W/2,y0=Math.min(s.wy-o*D,s.wy),fl=FLOORS[s.k],tt=G.time;
  g.fillStyle=fl[0];g.fillRect(x0,y0,W,D);g.fillStyle=fl[1];for(let i=0;i*32<W;i++)for(let j=0;j*32<D;j++)if((i+j)%2)g.fillRect(x0+i*32,y0+j*32,Math.min(32,W-i*32),Math.min(32,D-j*32));
  g.strokeStyle='#15161b';g.lineWidth=9;g.strokeRect(x0-4.5,y0-4.5,W+9,D+9);g.fillStyle=fl[0];g.fillRect(s.x-17,o>0?s.wy-1:s.wy-10,34,11);
  const m=rw(s,0,18);g.fillStyle='rgba(140,36,36,0.65)';rrect(g,s.x-24,m[1]-11,48,22,4);g.fill();
  const Q=r=>{const a=rw(s,r[0],r[1]),b=rw(s,r[2],r[3]);return[Math.min(a[0],b[0]),Math.min(a[1],b[1]),Math.abs(b[0]-a[0]),Math.abs(b[1]-a[1])];};
  const box=(r,col,top)=>{const q=Q(r);g.fillStyle='rgba(0,0,0,0.25)';g.fillRect(q[0]+4,q[1]+5,q[2],q[3]);g.fillStyle=col;g.fillRect(q[0],q[1],q[2],q[3]);if(top){g.fillStyle=top;g.fillRect(q[0]+3,q[1]+3,q[2]-6,q[3]-6);}return q;};
  const dots=(q,cols)=>{for(let x=q[0]+6,i=0;x<q[0]+q[2]-6;x+=9,i++)for(let y=q[1]+5;y<q[1]+q[3]-4;y+=8){g.fillStyle=cols[(i+((y/8)|0))%cols.length];g.fillRect(x,y,6,5);}};
  const cq=box(s.sol[0],'#6b4a2e','#8a6540');g.fillStyle='#1d1f24';g.fillRect(cq[0]+cq[2]/2+26,cq[1]+3,20,12);g.fillStyle='#7dffb0';g.fillRect(cq[0]+cq[2]/2+29,cq[1]+5,8,4);
  const PC=['#e74c3c','#f1c40f','#3498db','#2ecc71','#e67e22','#9b59b6','#ecf0f1'];
  if(s.k==='market'){for(let i=1;i<s.sol.length;i++)dots(box(s.sol[i],'#9aa3ad','#c7ced6'),PC);const f=Q([-W/2+4,D-70,-W/2+26,D-14]);g.fillStyle='#2c6e8f';g.fillRect(f[0],f[1],f[2],f[3]);g.fillStyle='rgba(180,230,255,0.55)';g.fillRect(f[0]+3,f[1]+3,f[2]-6,f[3]-6);}
  else if(s.k==='guns'){for(let i=1;i<3;i++){const q=box(s.sol[i],'#2b2622','#3a332d');g.strokeStyle='#9aa0a6';g.lineWidth=2.5;g.beginPath();for(let y=q[1]+10;y<q[1]+q[3]-6;y+=16){g.moveTo(q[0]+3,y);g.lineTo(q[0]+q[2]-3,y+4);}g.stroke();}
    const t=rw(s,W/2-60,26);g.fillStyle='#f4f1e8';g.beginPath();g.arc(t[0],t[1],16,0,TAU);g.fill();g.strokeStyle='#c0392b';g.lineWidth=3;g.beginPath();g.arc(t[0],t[1],10,0,TAU);g.stroke();g.fillStyle='#c0392b';g.beginPath();g.arc(t[0],t[1],3,0,TAU);g.fill();}
  else if(s.k==='clothes'){for(let i=1;i<3;i++){const q=Q(s.sol[i]),cx=q[0]+q[2]/2,cy=q[1]+q[3]/2;g.fillStyle='rgba(0,0,0,0.2)';g.beginPath();g.arc(cx+4,cy+5,22,0,TAU);g.fill();for(let k=0;k<10;k++){g.fillStyle=PC[k%PC.length];g.beginPath();g.moveTo(cx,cy);g.arc(cx,cy,22,k*TAU/10,(k+1)*TAU/10);g.fill();}g.fillStyle='#ddd';g.beginPath();g.arc(cx,cy,5,0,TAU);g.fill();}
    const mq=Q([-W/2+2,40,-W/2+10,110]);g.fillStyle='#bfe6ff';g.fillRect(mq[0],mq[1],mq[2],mq[3]);g.strokeStyle='#d4af37';g.lineWidth=2;g.strokeRect(mq[0],mq[1],mq[2],mq[3]);}
  else if(s.k==='mall'){dots(box(s.sol[1],'#c0392b','#f5d6a8'),['#f1c40f','#e67e22','#c0392b']);dots(box(s.sol[2],'#2980b9','#dfe9f2'),PC);const c=rw(s,0,70);g.fillStyle='#bfc5c9';g.beginPath();g.arc(c[0],c[1],26,0,TAU);g.fill();g.fillStyle='#3a8fc4';g.beginPath();g.arc(c[0],c[1],20,0,TAU);g.fill();
    g.fillStyle='rgba(255,255,255,0.7)';for(let k=0;k<5;k++){const a=k*TAU/5+tt;g.beginPath();g.arc(c[0]+Math.cos(a)*9,c[1]+Math.sin(a)*9,2.5,0,TAU);g.fill();}g.fillStyle='rgba(160,230,255,0.6)';g.fillRect(cq[0]+6,cq[1]+4,cq[2]/2-20,10);}
  else if(s.k==='bank'){g.fillStyle='rgba(170,225,255,0.5)';g.fillRect(cq[0],cq[1]+(o>0?cq[3]-4:0),cq[2],4);const vq=rw(s,W/2-50,D-22);g.fillStyle='#8f969e';g.beginPath();g.arc(vq[0],vq[1],20,0,TAU);g.fill();g.strokeStyle='#4d535a';g.lineWidth=4;g.stroke();
    g.strokeStyle='#c9ced4';g.lineWidth=3;g.beginPath();for(let k=0;k<4;k++){const a=k*TAU/8+tt*0.2;g.moveTo(vq[0]-Math.cos(a)*14,vq[1]-Math.sin(a)*14);g.lineTo(vq[0]+Math.cos(a)*14,vq[1]+Math.sin(a)*14);}g.stroke();
    for(const u of [-60,60]){const a=rw(s,u,60),b=rw(s,u,D-100);g.strokeStyle='#8a1c2b';g.lineWidth=3;g.beginPath();g.moveTo(a[0],a[1]);g.lineTo(b[0],b[1]);g.stroke();g.fillStyle='#d4af37';g.beginPath();g.arc(a[0],a[1],5,0,TAU);g.arc(b[0],b[1],5,0,TAU);g.fill();}}
  else if(s.k==='casino'){for(let i=1;i<3;i++){const q=box(s.sol[i],'#1c1c22','#2c2c36');for(let y=q[1]+8,j=0;y<q[1]+q[3]-10;y+=22,j++){g.fillStyle=Math.floor(tt*3+j+i)%3?'#ffd23f':'#ff4fd8';g.fillRect(q[0]+6,y,q[2]-12,12);}}
    const c=rw(s,0,110);g.fillStyle='#0f5c36';g.beginPath();g.arc(c[0],c[1],34,0,TAU);g.fill();g.strokeStyle='#d4af37';g.lineWidth=4;g.stroke();for(let k=0;k<12;k++){g.fillStyle=k%2?'#c0392b':'#111';g.beginPath();g.moveTo(c[0],c[1]);g.arc(c[0],c[1],22,k*TAU/12+tt*0.6,(k+1)*TAU/12+tt*0.6);g.fill();}}
  const sg=rw(s,0,D-10);g.save();g.font='bold 11px Rubik,sans-serif';g.direction=G.lang==='he'?'rtl':'ltr';g.textAlign='center';g.textBaseline='middle';g.fillStyle=s.k==='guns'||s.k==='casino'?'#ffe9a8':'#3a3a44';g.fillText(L(SIGNS[s.k]),sg[0],sg[1]);g.restore();
  for(const sp of s.spots){const q=rw(s,sp.u,sp.v),pu=(Math.sin(tt*4)+1)/2;g.strokeStyle=s.col;g.globalAlpha=0.5+pu*0.4;g.lineWidth=3;g.setLineDash([7,5]);g.lineDashOffset=-tt*14;g.beginPath();g.arc(q[0],q[1],17,0,TAU);g.stroke();g.setLineDash([]);g.globalAlpha=1;}}
function drawInsideTop(s,v){const W=s.W,D=s.D,x0=s.x-W/2-9,y0=Math.min(s.wy-s.out*D,s.wy)-9;g.fillStyle='rgba(6,8,22,0.52)';g.beginPath();g.rect(v[0]-60,v[1]-60,v[2]-v[0]+120,v[3]-v[1]+120);g.rect(x0,y0,W+18,D+18);g.rect(s.x-34,s.out>0?s.wy+9:s.wy-55,68,46);g.fill('evenodd');
  const r=G.rob;if(r&&r.s===s&&s.clerkP){const c=s.clerkP,k=clamp(r.t/s.rob.dur,0,1);g.fillStyle='rgba(0,0,0,0.7)';g.fillRect(c.x-32,c.y-34,64,9);g.fillStyle='#ff5050';g.fillRect(c.x-30,c.y-32,60*k,5);}
  if(G.spot){const q=rw(s,G.spot.u,G.spot.v);bubble(q[0],q[1]-22,L(G.spot.lb));}}

// ---------- full map ----------
const MAPN={home:R2('בית (שמירה)','Home (save)'),guns:R2('חנות נשק','Gun shop'),clothes:R2('בגדים','Clothing'),market:R2('חנות נוחות','QuikStop'),mall:R2('קניון','Mall'),bank:R2('בנק','Bank'),casino:R2('קזינו','Casino'),gas:R2('תחנת דלק','Gas station'),
 spray:R2('מוסך צביעה','Spray shop'),hosp:R2('בית חולים','Hospital'),cops:R2('משטרה','Police'),air:R2('נמל תעופה','Airport'),main:R2('משימת סיפור','Story mission'),side:R2('משימת צד','Side mission'),way:R2('היעד שסימנת','Your waypoint')};
const MAPC={home:'#2ecc71',guns:'#ff9f43',clothes:'#ff8fc0',market:'#3fbf8a',mall:'#e0b050',bank:'#6fcf7a',casino:'#d4af37',gas:'#5ad1ff',spray:'#c070ff',hosp:'#ff6b6b',cops:'#3d6bff',air:'#9aa7b5',main:'#ffe14d',side:'#b07cff',way:'#ff3b3b'};
function mapGlyph(q,k,x,y,r,txt){q.fillStyle=MAPC[k];q.strokeStyle='#0b0d14';q.lineWidth=r*0.22;q.beginPath();q.arc(x,y,r,0,TAU);q.fill();q.stroke();q.fillStyle='#0b0d14';q.strokeStyle='#0b0d14';const u=r/10;q.lineWidth=u*1.6;
  const T2=t=>{q.font=`900 ${r*1.25}px Rubik,sans-serif`;q.textAlign='center';q.textBaseline='middle';q.fillText(t,x,y+u*0.6);};
  switch(k){case'home':q.beginPath();q.moveTo(x-6*u,y);q.lineTo(x,y-6*u);q.lineTo(x+6*u,y);q.lineTo(x+4*u,y);q.lineTo(x+4*u,y+5*u);q.lineTo(x-4*u,y+5*u);q.lineTo(x-4*u,y);q.closePath();q.fill();break;
   case'guns':q.fillRect(x-6*u,y-4*u,12*u,3.4*u);q.fillRect(x-5*u,y-1*u,3.4*u,6*u);break;
   case'clothes':q.beginPath();q.moveTo(x-3*u,y-5*u);q.lineTo(x+3*u,y-5*u);q.lineTo(x+7*u,y-2*u);q.lineTo(x+5*u,y+0.5*u);q.lineTo(x+3.5*u,y-0.5*u);q.lineTo(x+3.5*u,y+5.5*u);q.lineTo(x-3.5*u,y+5.5*u);q.lineTo(x-3.5*u,y-0.5*u);q.lineTo(x-5*u,y+0.5*u);q.lineTo(x-7*u,y-2*u);q.closePath();q.fill();break;
   case'mall':q.fillRect(x-5*u,y-2*u,10*u,7.5*u);q.beginPath();q.arc(x,y-2*u,3*u,Math.PI,0);q.stroke();break;
   case'gas':q.beginPath();q.moveTo(x,y-6.5*u);q.quadraticCurveTo(x+6*u,y+1*u,x,y+6*u);q.quadraticCurveTo(x-6*u,y+1*u,x,y-6.5*u);q.fill();break;
   case'hosp':q.fillRect(x-1.8*u,y-6*u,3.6*u,12*u);q.fillRect(x-6*u,y-1.8*u,12*u,3.6*u);break;
   case'air':q.beginPath();q.moveTo(x,y-7*u);q.lineTo(x+1.6*u,y-1*u);q.lineTo(x+7*u,y+2*u);q.lineTo(x+1.4*u,y+2*u);q.lineTo(x+1*u,y+5*u);q.lineTo(x+3*u,y+6.5*u);q.lineTo(x-3*u,y+6.5*u);q.lineTo(x-1*u,y+5*u);q.lineTo(x-1.4*u,y+2*u);q.lineTo(x-7*u,y+2*u);q.lineTo(x-1.6*u,y-1*u);q.closePath();q.fill();break;
   case'way':q.fillRect(x-4*u,y-6*u,1.8*u,12*u);q.beginPath();q.moveTo(x-2.2*u,y-6*u);q.lineTo(x+6*u,y-3*u);q.lineTo(x-2.2*u,y);q.fill();break;
   case'market':T2('24');break;case'bank':T2('$');break;case'casino':T2('♦');break;case'spray':T2('✦');break;case'cops':T2('★');break;case'side':T2('?');break;default:T2(txt||'!');}}
function mapItems(){const it=[];for(const s of SHOPS)if(!(s.k==='mall'&&s.side===0)&&!s.gasStore)it.push([s.k,s.sx,s.sy]);for(const gs of GAS)it.push(['gas',gs.x,gs.y]);
  it.push(['home',POI.safe.x,POI.safe.y],['spray',POI.spray.x,POI.spray.y],['hosp',POI.hosp.x,POI.hosp.y],['cops',POI.cops.x,POI.cops.y],['air',POI.airport.x,POI.airport.y]);
  if(!G.mission){const n=nextMission();if(n)it.push(['main',n.start.x,n.start.y,n.ic]);for(const sm of sideAvail())it.push(['side',sm.start.x,sm.start.y]);}else{const t=curTarget();if(t)it.push(['main',t.x,t.y,'!']);}
  if(G.way)it.push(['way',G.way.x,G.way.y]);return it;}
function openMap(){if(G.state!=='play'&&G.state!=='pause')return;G.mapFrom=G.state;G.state='map';$('pause').style.display='none';$('mapview').style.display='block';$('mapHint').textContent=tr('mapHint');toggleWbar(false);drawMap();}
function closeMap(){$('mapview').style.display='none';if(G.mapFrom==='pause'){G.state='pause';$('pause').style.display='flex';}else G.state='play';}
function drawMap(){const c=$('bigmap'),q=c.getContext('2d'),dpr=G.dpr,cw=c.clientWidth,ch=c.clientHeight;if(c.width!==Math.round(cw*dpr)||c.height!==Math.round(ch*dpr)){c.width=Math.round(cw*dpr);c.height=Math.round(ch*dpr);}
  const leg=Math.min(cw*0.3,210)*dpr,aw=c.width-leg,sc=Math.min(aw/(MW*T),c.height/(MH*T))*0.97,rtl=G.lang==='he',ox=(rtl?0:leg)+(aw-MW*T*sc)/2,oy=(c.height-MH*T*sc)/2;G.mapT={sc,ox,oy};
  q.fillStyle='#0d2233';q.fillRect(0,0,c.width,c.height);q.imageSmoothingEnabled=true;q.drawImage(MINIMG,ox,oy,MW*T*sc,MH*T*sc);
  q.font=`italic 900 ${11*dpr}px Rubik,sans-serif`;q.textAlign='center';q.textBaseline='middle';q.fillStyle='rgba(255,255,255,0.5)';
  for(const [k,tx,ty] of [['down',45,30],['res',45,90],['harb',55,128],['beach',111,96],['fort',142,10],['crown',198,16],['strip',198,66],['east',198,118],['air',208,196]])q.fillText(L(AREAS[k]),ox+tx*T*sc,oy+ty*T*sc);
  const r=Math.max(7,Math.min(11,cw/70))*dpr;for(const it of mapItems())mapGlyph(q,it[0],ox+it[1]*sc,oy+it[2]*sc,it[0]==='way'||it[0]==='main'?r*1.25:r,it[3]);
  const P=G.player,px=ox+(P.veh?P.veh.x:P.x)*sc,py=oy+(P.veh?P.veh.y:P.y)*sc,pu=(Math.sin(performance.now()/160)+1)/2;q.strokeStyle=`rgba(255,255,255,${0.9-pu*0.7})`;q.lineWidth=2*dpr;q.beginPath();q.arc(px,py,(8+pu*12)*dpr,0,TAU);q.stroke();
  q.save();q.translate(px,py);q.rotate(P.veh?P.veh.a:P.a);q.fillStyle='#fff';q.strokeStyle='#000';q.lineWidth=2*dpr;q.beginPath();q.moveTo(10*dpr,0);q.lineTo(-7*dpr,-7*dpr);q.lineTo(-3*dpr,0);q.lineTo(-7*dpr,7*dpr);q.closePath();q.fill();q.stroke();q.restore();
  const lx=rtl?c.width-leg:0;q.fillStyle='rgba(8,10,20,0.88)';q.fillRect(lx,0,leg,c.height);const ks=['main','side','way','home','guns','clothes','market','mall','bank','casino','gas','spray','hosp','cops','air'],rh=Math.min(26*dpr,(c.height-50*dpr)/ks.length),lr=Math.min(9*dpr,rh*0.4);
  q.font=`700 ${Math.min(13*dpr,rh*0.55)}px Rubik,sans-serif`;q.textBaseline='middle';q.direction=rtl?'rtl':'ltr';
  ks.forEach((k,i)=>{const y=44*dpr+i*rh,ix=rtl?c.width-16*dpr:16*dpr;mapGlyph(q,k,ix,y,lr,k==='main'?'!':'');q.fillStyle='#fff';q.font=`700 ${Math.min(13*dpr,rh*0.55)}px Rubik,sans-serif`;q.textAlign=rtl?'right':'left';q.fillText(L(MAPN[k]),rtl?ix-16*dpr:ix+16*dpr,y);});
  q.direction='ltr';}
function mapTap(e){const m=G.mapT;if(!m)return;const dpr=G.dpr,wx=(e.offsetX*dpr-m.ox)/m.sc,wy=(e.offsetY*dpr-m.oy)/m.sc;if(wx<0||wy<0||wx>MW*T||wy>MH*T)return;
  if(G.way&&hyp(wx-G.way.x,wy-G.way.y)<260)G.way=null;else{let best=null,bd=220;for(const it of mapItems()){const d=hyp(it[1]-wx,it[2]-wy);if(it[0]!=='way'&&d<bd){bd=d;best=it;}}G.way=best?{x:best[1],y:best[2]}:{x:wx,y:wy};}sfx.blip();drawMap();}

// ---------- layout: rotation + tablet scale ----------
function applyLayout(){const W=innerWidth,H=innerHeight,root=$('root'),rot=!!G.rot&&H>W;G.vw=rot?H:W;G.vh=rot?W:H;root.style.width=G.vw+'px';root.style.height=G.vh+'px';root.style.transform=rot?`translateX(${W}px) rotate(90deg)`:'none';
  const u=clamp(Math.min(G.vw,G.vh)/520,1,1.45);G.ui=u;root.style.setProperty('--u',u.toFixed(3));root.classList.toggle('port',G.vh>G.vw);}
function slotSpin(bet){if(G.money<bet){sfx.no();return;}G.money-=bet;const S=['7','★','♦','♣','BAR'],r=[pick(S),pick(S),pick(S)];let mult=0;if(r[0]===r[1]&&r[1]===r[2])mult=r[0]==='7'?20:r[0]==='★'?10:6;else if(r[0]===r[1]||r[1]===r[2]||r[0]===r[2])mult=1;
  const win=bet*mult;G.money+=win;G.slot={r,win,bet};if(mult>1){sfx.pass();if(mult>=10)post('jack');}else if(mult===1)sfx.blip();else sfx.no();buildShop();}
