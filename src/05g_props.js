// ---------- properties: homes, businesses, spray garages, shop action bar ----------
const PROPS=[],SPRAYS=[];
FLOORS.home=['#c9a57a','#bf9a70'];FLOORS.guns=['#8f8578','#84796c'];
SIGNS.home=R2('בית מתוק בית. השכירות — פחות.','Home sweet home. The rent, less so.');
Object.assign(MAPN,{biz:R2('עסק שלך (איסוף רווחים)','Your business (collect)'),sale:R2('למכירה: בית או עסק','For sale: home or business')});Object.assign(MAPC,{biz:'#7dffa0',sale:'#ff9f43'});
Object.assign(FEED,{biz:[R2('@biz_sb: בעלים חדש לעסק ותיק בעיר. מי זה הבחור הזה?','@biz_sb: A well-known local business has a new owner. Who is this guy?')]});
const pid=o=>o.id||o.pid;
function owned(id){return !!G.owned&&G.owned[id]!=null;}
function propIncome(b){return owned(b.id)&&b.inc?Math.floor(Math.min(3,(G.playT-G.owned[b.id])/ENV.dayLen)*b.inc):0;}
function collectProp(b){const m=propIncome(b);if(m>0){G.money+=m;G.owned[b.id]=G.playT;}return m;}
function pickHomeB(tx,ty){const ok=t=>t===TL.WALK||t===TL.CONC||t===TL.GRASS;let best=null,bd=1e9;
  for(const b of BUILDINGS){if(b.shops||b.cont||b.army||b.hangar||b.court||b.lh||b.lads||b.neon||b.logo||b.cross||b.w<4||b.h<4||b.ht>3.6)continue;const d=hyp(b.x+b.w/2-tx,b.y+b.h/2-ty);if(d>=bd)continue;
    const side=ok(tget(b.x+(b.w>>1),b.y+b.h))?2:ok(tget(b.x+(b.w>>1),b.y-1))?0:-1;if(side<0)continue;bd=d;best=[b,side];}return best;}
function genProps(){const H=(id,tx,ty,name,price)=>{const r=pickHomeB(tx,ty);if(r)addShop('home',r[0],r[1],{name,price,pid:id,col:'#2ecc71'});};
  H('h_harb',22,120,R2('לופט בשוק המלח','Saltmarket loft'),8000);H('h_beach',98,52,R2('דירת חוף בטיילת המרינה','Marina Mile beach flat'),12000);H('h_crown',198,22,R2('וילה ברמת הכתר','Crown Heights villa'),35000);H('h_strip',212,62,R2('פנטהאוז בשדרת המזל','Lucky Strip penthouse'),60000);
  const sh=f=>SHOPS.find(f),B=(id,x,y,name,price,inc,perk)=>PROPS.push({id,x,y,name,price,inc,perk});
  const mk=sh(s=>s.k==='market'&&!s.gasStore),gs=sh(s=>s.gasStore),gn=sh(s=>s.k==='guns'),cs=sh(s=>s.k==='casino'),V=POI.vendors[0];
  B('b_dogs',V.x-66,V.y,R2('דוכני הנקניקיות של גאס','Gus\'s Hot Dog Stands'),3000,300,R2('נקניקיות חינם בכל הדוכנים','Free hot dogs at every stand'));
  B('b_market',mk.sx+66,mk.sy,R2('זיכיון קוויקסטופ 24','QuikStop 24 franchise'),9000,900);
  B('b_qd',POI.office.x+112,POI.office.y,R2('קוויקדרופ שליחויות','QuickDrop Couriers'),14000,1400,R2('עכשיו אתה הבוס','You are the boss now'));
  B('b_spray',POI.spray.x+150,POI.spray.y,R2('רשת מוסכי צבע טרי','FreshCoat garage chain'),18000,1800,R2('צביעה ותיקון חינם בכל המוסכים','Free respray and repair at every garage'));
  B('b_gas',gs.sx+66,gs.sy,R2('תחנות הדלק של סולס','Solace gas stations'),22000,2200,R2('דלק ותיקונים חינם','Free fuel and repairs'));
  B('b_pier',POI.pier.x-150,POI.pier.y-40,R2('הגלגל הענק במזח','The pier ferris wheel'),30000,3000);
  B('b_guns',gn.sx+66,gn.sy,R2('ברזל ואבק שריפה','Iron & Powder'),45000,4500,R2('25% הנחה על נשק','25% off weapons'));
  B('b_club',POI.club.x+110,POI.club.y,R2('מועדון החדר הסגול','The Violet Room club'),60000,6000);
  B('b_casino',cs.sx+66,cs.sy,R2('קזינו גאות המזל','Lucky Tide Casino'),180000,18000);}
function openProp(o){G.prop=o;openShop({name:o.name,col:'#7dffa0'},'prop');}
function propsUpdate(dt){const P=G.player;G.playT=(G.playT||0)+dt;G.nearProp=null;if(P.veh||P.inside||P.roof||P.climb||G.wanted>0)return;let bd=46;
  for(const b of PROPS){const d=hyp(P.x-b.x,P.y-b.y);if(d<bd){bd=d;G.nearProp=b;}}
  for(const s of SHOPS)if(s.k==='home'&&!owned(s.pid)){const d=hyp(P.x-s.sx,P.y-s.sy);if(d<bd){bd=d;G.nearProp=s;}}}
function drawPropTop(){const b=G.nearProp;if(!b||G.player.veh)return;const id=pid(b),own=owned(id),x=b.sx||b.x,y=(b.sy||b.y)-44;
  bubble(x,y,own?fmt(tr('propCollect'),propIncome(b).toLocaleString('en-US')):fmt(tr('propPrompt'),L(b.name),b.price.toLocaleString('en-US')));}
function sprayUpdate(dt){const P=G.player,v=P.veh;if(G.sprayCD>0){G.sprayCD-=dt;return;}if(!v||v.t.boat||v.t.plane||Math.abs(v.speed)>150)return;
  for(const sp of SPRAYS){if(hyp(v.x-sp.x,v.y-sp.y)>72)continue;const dmg=v.hp<v.t.hp-1||v.dents||v.holes;if(!(G.wanted>0)&&!dmg)return;G.sprayCD=3;
    if(G.wanted>0&&G.seenNow){toast(tr('seenSpray'));sfx.no();return;}const cost=owned('b_spray')?0:200;if(G.money<cost){toast(tr('nomoney'));return;}
    G.money-=cost;clearWanted();v.col=pick(['#c0392b','#2e86c1','#27ae60','#8e44ad','#f39c12','#ecf0f1','#1c1c1c','#16a085']);repairVeh(v);v.vx*=0.2;v.vy*=0.2;toast(fmt(tr('sprayFix'),cost));sfx.blip();
    for(let k=0;k<14;k++)part('steam',v.x+rr(-30,30),v.y+rr(-20,20),rr(-30,30),rr(-30,30),0.9,rr(8,14));return;}}
function homeSleep(){const P=G.player;ENV.clock=(ENV.clock+8)%24;P.hp=100;G.stamina=G.maxStam;saveGame();toast(tr('slept'),3.5);sfx.pass();}
// ---------- action bar inside shops / homes ----------
function buildInsideBar(){const el=$('ibar'),P=G.player,s=P&&P.inside;if(!s||G.state==='shop'){el.style.display='none';return;}el.style.display='flex';el.innerHTML='';el.dir=G.lang==='he'?'rtl':'ltr';
  const add=(txt,fn,cls)=>{const b=document.createElement('button');b.className='wchip'+(cls?' '+cls:'');b.textContent=txt;b.addEventListener('pointerdown',e=>{e.stopPropagation();e.preventDefault();AU.init();fn();});el.appendChild(b);};
  if(G.rob&&G.rob.s===s){const lb=document.createElement('div');lb.className='wchip robinfo';lb.textContent=tr('robbingBar');el.appendChild(lb);return;}
  if(s.bag){const lb=document.createElement('div');lb.className='wchip robinfo';lb.textContent=tr('bagBar');el.appendChild(lb);}
  if(s.k==='home'){add(tr('saveSleep'),homeSleep,'go');add(tr('wardrobe'),()=>openShop(s,'wardrobe'));add(tr('laptop'),()=>openShop(s,'laptop'));}
  else{if(s.cd>G.time){}else if(s.k==='guns')add(tr('buyW'),()=>openShop(s,'guns'),'go');else if(s.k==='market')add(tr('shopBuy'),()=>openShop(s,'food'),'go');else if(s.k==='clothes')add(tr('clothesB'),()=>openShop(s,'clothes'),'go');
    else if(s.k==='mall'){add(tr('foodB'),()=>openShop(s,'food'),'go');add(tr('clothesB'),()=>openShop(s,'clothes'),'go');}else if(s.k==='casino')add(tr('slots'),()=>openShop(s,'slots'),'go');
    if(s.rob&&!s.bag&&!(s.cd>G.time))add(tr('robB'),insideRob,'red');}
  add(tr('exitB'),leaveRoom);}
function insideRob(){const P=G.player,s=P.inside;if(!s||!s.rob)return;if(G.weapon==='fist'){const w=['rifle','smg','shotgun','pistol','rocket','flame'].find(k=>G.weapons[k]>0);if(!w){toast(tr('robNeed'),3);sfx.no();return;}G.weapon=w;}G.fireCD=0;insideAttack();buildInsideBar();}
function propPanel(md,item,m,P){const note=t=>{const d=document.createElement('div');d.className='stats';d.textContent=t;m.appendChild(d);};
  if(md==='prop'){const b=G.prop,id=pid(b);if(!owned(id)){note((b.inc?fmt(tr('propInc'),b.inc.toLocaleString('en-US')):tr('homeDesc'))+(b.perk?' · '+L(b.perk):''));
      item(tr('buy'),b.inc?tr('bizBuy'):tr('homeBuy'),b.price,()=>{G.owned[id]=G.playT;sfx.pass();post('biz');saveGame();},null);}
    else if(b.inc){note(fmt(tr('propInc'),b.inc.toLocaleString('en-US'))+(b.perk?' · '+L(b.perk):''));item(tr('collect'),'$'+propIncome(b).toLocaleString('en-US'),0,()=>{collectProp(b);},null,propIncome(b)<=0);}
    else note(tr('ownedHome'));}
  if(md==='wardrobe')for(const o of OUTFITS)if(G.outfits.includes(o.id))item(L(o),G.outfit===o.id?tr('wearing'):tr('wear'),0,()=>wearOutfit(o.id),'<span class="sw" style="background:'+o.shirt+'"></span>',G.outfit===o.id);
  if(md==='laptop'){const mine=PROPS.filter(b=>owned(b.id));if(!mine.length)note(tr('noBiz'));let tot=0;for(const b of mine){tot+=propIncome(b);item(L(b.name),'$'+propIncome(b).toLocaleString('en-US'),0,()=>{collectProp(b);},null,propIncome(b)<=0);}
    if(mine.length>1)item(tr('collectAll'),'$'+tot.toLocaleString('en-US'),0,()=>{for(const b of mine)collectProp(b);},null,tot<=0);}}
// ---------- richer interiors ----------
function roomExtra(s){const W=s.W,D=s.D,k=s.k;
  if(k==='home'){const F=s.fur={bed:[W/2-96,D-92,W/2-14,D-30],wd:[-W/2+12,D-40,-W/2+96,D-14],sofa:[-W/2+14,70,-W/2+88,94],desk:[W/2-78,36,W/2-14,58]};if(W>300)F.table=[-34,118,20,148];s.sol=Object.values(F);s.spots=[{u:W/2-56,v:D-108,m:'bed',lb:R2('מיטה: שמירה ומנוחה','Bed: save and rest')},{u:-W/2+54,v:D-58,m:'wardrobe',lb:R2('ארון בגדים','Wardrobe')},{u:W/2-46,v:76,m:'laptop',lb:R2('מחשב: העסקים שלי','Laptop: my businesses')}];s.clerk=null;return;}
  if(k==='guns'){s.sol.push([-64,104,64,132]);if(W>360&&D>250)s.sol.push([-W/2+56,160,-W/2+126,182],[W/2-126,160,W/2-56,182]);}
  if(k==='market'&&W>300)s.sol.push([-W/2+30,22,-W/2+92,44],[W/2-92,22,W/2-44,44]);
  if(k==='clothes'&&W>300)s.sol.push([-W/2+6,D-66,-W/2+46,D-10],[W/2-46,D-66,W/2-6,D-10]);
  if(k==='bank')s.sol.push([-W/2+16,56,-W/2+84,84],[W/2-84,56,W/2-16,84]);}
function roomDecor(s,Q,box){const W=s.W,D=s.D,k=s.k,o=s.out,tt=G.time,PC=['#e74c3c','#f1c40f','#3498db','#2ecc71','#e67e22','#9b59b6','#ecf0f1'];
  const at=(u,v)=>rw(s,u,v),plant=(u,v)=>{const q=at(u,v);g.fillStyle='rgba(0,0,0,0.2)';g.beginPath();g.arc(q[0]+3,q[1]+4,11,0,TAU);g.fill();g.fillStyle='#7a4a2a';g.beginPath();g.arc(q[0],q[1],7,0,TAU);g.fill();g.fillStyle='#2f8f3a';for(let i=0;i<5;i++){const a=i*TAU/5+0.4;g.beginPath();g.ellipse(q[0]+Math.cos(a)*7,q[1]+Math.sin(a)*7,7,3.5,a,0,TAU);g.fill();}};
  const rug=(r,c1,c2)=>{const q=Q(r);g.fillStyle=c1;rrect(g,q[0],q[1],q[2],q[3],6);g.fill();g.strokeStyle=c2;g.lineWidth=3;rrect(g,q[0]+5,q[1]+5,q[2]-10,q[3]-10,4);g.stroke();};
  // front windows on the door wall + corner plants
  for(const u of [-W/2+40,W/2-40]){const a=at(u-26,1),b=at(u+26,1);g.fillStyle='rgba(160,215,245,0.85)';g.fillRect(Math.min(a[0],b[0]),a[1]-3,52,6);}
  plant(-W/2+16,16);plant(W/2-16,16);
  if(k!=='home'){const bq=Q([-W/2+6,6,W/2-6,D-6]);g.strokeStyle='rgba(0,0,0,0.09)';g.lineWidth=4;g.strokeRect(bq[0],bq[1],bq[2],bq[3]);
    if(k!=='guns')for(let v=44,i=0;v<D-80;v+=62,i++)for(const sd of [-1,1]){const f=Q([sd*(W/2-4)-3,v,sd*(W/2-4)+3,v+34]);g.fillStyle=PC[(i+(sd>0?3:0))%PC.length];g.fillRect(f[0],f[1],f[2],f[3]);g.strokeStyle='#3a2a1a';g.lineWidth=1.5;g.strokeRect(f[0],f[1],f[2],f[3]);}
    const bn=at(-54,12);g.fillStyle='#5d6d7e';g.beginPath();g.arc(bn[0],bn[1],7,0,TAU);g.fill();g.fillStyle='#2c3e50';g.beginPath();g.arc(bn[0],bn[1],4,0,TAU);g.fill();}
  if(k==='home'){const F=s.fur;rug([-W/2+10,30,-W/2+96,62],'#8e3b46','#f1d9a0');const bed=box(F.bed,'#6d4c33','#e8e2d6');g.fillStyle='#4f7fb5';g.fillRect(bed[0]+3,bed[1]+bed[3]*0.42,bed[2]-6,bed[3]*0.58-3);g.fillStyle='#ffffff';rrect(g,bed[0]+8,bed[1]+6,bed[2]-16,14,4);g.fill();
    const wd=box(F.wd,'#5a3d28','#7a5438');g.strokeStyle='#3d2817';g.lineWidth=2;g.beginPath();g.moveTo(wd[0]+wd[2]/2,wd[1]+2);g.lineTo(wd[0]+wd[2]/2,wd[1]+wd[3]-2);g.stroke();
    box(F.sofa,'#3f5f7a','#5b86a8');const tv=at(-W/2+51,8);g.fillStyle='#111';g.fillRect(tv[0]-26,tv[1]-4,52,8);g.fillStyle=`rgba(120,200,255,${0.5+0.3*Math.sin(tt*9)})`;g.fillRect(tv[0]-23,tv[1]-2,46,4);
    if(F.table)box(F.table,'#7a5438','#9a7150');const dk=box(F.desk,'#4a4a52','#6a6a74');g.fillStyle='#1d1f24';g.fillRect(dk[0]+dk[2]/2-12,dk[1]+4,24,14);g.fillStyle='#7dffb0';g.fillRect(dk[0]+dk[2]/2-9,dk[1]+6,18,9);plant(W/2-18,110);g.globalCompositeOperation='lighter';glow(g,GL.warm,s.x,s.wy-s.out*D/2,Math.max(W,D)*0.6,0.14);g.globalAlpha=1;g.globalCompositeOperation='source-over';return;}
  if(k==='guns'){const q=box(s.sol[3],'#3a3f47','#aee1f5');g.fillStyle='#22262c';for(let x=q[0]+8;x<q[0]+q[2]-14;x+=22){g.fillRect(x,q[1]+8,15,4);g.fillRect(x+2,q[1]+12,4,7);}
    for(const u of [-W/2+60,-W/2+96]){const c=at(u,34);g.fillStyle='rgba(0,0,0,0.25)';g.fillRect(c[0]-12,c[1]-9,30,24);g.fillStyle='#5b6b3a';g.fillRect(c[0]-15,c[1]-12,30,24);g.strokeStyle='#39451f';g.lineWidth=2;g.strokeRect(c[0]-15,c[1]-12,30,24);g.fillStyle='#f1c40f';g.fillRect(c[0]-9,c[1]-3,18,5);}
    rug([-40,20,40,60],'#5a2d2d','#c9a15b');
    for(let i=4;i<s.sol.length;i++){const c=box(s.sol[i],'#3a3f47','#aee1f5');for(let x=c[0]+7,j=0;x<c[0]+c[2]-12;x+=14,j++){g.fillStyle=j%2?'#c9a227':'#7a2e2e';g.fillRect(x,c[1]+6,9,c[3]-12);}}
    if(W>330)for(const sd of [-1,1]){const r=Q(sd>0?[128,D-20,W/2-14,D-5]:[-W/2+14,D-20,-128,D-5]);g.fillStyle='#2b2622';g.fillRect(r[0],r[1],r[2],r[3]);g.fillStyle='#b8bec4';for(let x=r[0]+8;x<r[0]+r[2]-24;x+=30){g.fillRect(x,r[1]+4,21,3);g.fillRect(x+2,r[1]+7,4,5);}}
    const mn=at(W/2-104,30);g.fillStyle='rgba(0,0,0,0.2)';g.beginPath();g.ellipse(mn[0]+3,mn[1]+4,10,12,0,0,TAU);g.fill();g.fillStyle='#3d7bd9';g.beginPath();g.ellipse(mn[0],mn[1],9,12,0,0,TAU);g.fill();g.fillStyle='#1f3f73';g.fillRect(mn[0]-6,mn[1]-3,12,3);g.fillStyle='#c9ccd0';g.beginPath();g.arc(mn[0],mn[1],4.5,0,TAU);g.fill();}
  else if(k==='market'){const a=at(W/2-22,84);g.fillStyle='#2b2f3a';g.fillRect(a[0]-11,a[1]-16,22,32);g.fillStyle='#7dffb0';g.fillRect(a[0]-7,a[1]-11,14,9);g.fillStyle='#c9ccd0';g.fillRect(a[0]-6,a[1]+2,12,3);
    for(let i=0;i<3;i++){const b=at(-20+i*20,D-110);g.strokeStyle='#c0392b';g.lineWidth=2;g.strokeRect(b[0]-7,b[1]-7,14,14);g.strokeStyle='rgba(192,57,43,0.5)';g.beginPath();g.moveTo(b[0]-7,b[1]);g.lineTo(b[0]+7,b[1]);g.stroke();}rug([-26,8,26,32],'#2f6f5a','#bfe8d6');}
  else if(k==='clothes'){for(const [u,c] of [[-W/2+34,'#e84393'],[-W/2+62,'#3498db'],[W/2-34,'#f1c40f'],[W/2-62,'#2ecc71']]){const m=at(u,44);g.fillStyle='rgba(0,0,0,0.2)';g.beginPath();g.ellipse(m[0]+3,m[1]+4,8,11,0,0,TAU);g.fill();g.fillStyle=c;g.beginPath();g.ellipse(m[0],m[1],7,11,0,0,TAU);g.fill();g.fillStyle='#e9d8c0';g.beginPath();g.arc(m[0],m[1],4.5,0,TAU);g.fill();}
    for(let i=0;i<3;i++){const c=Q([W/2-12,150+i*36,W/2-2,180+i*36]);g.fillStyle=PC[i+2];g.fillRect(c[0],c[1],c[2],c[3]);}rug([-50,20,50,70],'#b8507c','#ffe3f0');
    for(let i=3;i<s.sol.length;i++){const c=box(s.sol[i],'#7a5438','#f3e6d0');g.fillStyle=i%2?'#b8507c':'#3f7fb5';for(let x=c[0]+3;x<c[0]+c[2]-4;x+=8)g.fillRect(x,o>0?c[1]:c[1]+c[3]-7,5,7);}}
  else if(k==='mall'){for(const u of [-W/4,W/4]){const b=Q([u-34,40,u+34,54]);g.fillStyle='#7a5438';g.fillRect(b[0],b[1],b[2],b[3]);}plant(-20,36);plant(20,36);}
  else if(k==='bank'){for(let i=1;i<3;i++){const q=box(s.sol[s.sol.length-i],'#5a3d28','#7a5438');g.fillStyle='#1d1f24';g.fillRect(q[0]+q[2]/2-10,q[1]+5,20,12);g.fillStyle='#8fd3ff';g.fillRect(q[0]+q[2]/2-8,q[1]+7,16,8);}
    for(let i=0;i<4;i++){const c=at(-W/2+30+i*20,D-24);g.fillStyle='#34495e';rrect(g,c[0]-7,c[1]-7,14,14,3);g.fill();}rug([-34,14,34,D-96],'#7b1e2b','#d4af37');
    for(let i=0;i<2;i++){const a=at(W/2-20,110+i*40);g.fillStyle='#2b2f3a';g.fillRect(a[0]-10,a[1]-14,20,28);g.fillStyle='#7dffb0';g.fillRect(a[0]-6,a[1]-9,12,8);}}
  else if(k==='casino'){for(const u of [-70,70]){const c=at(u,196);g.fillStyle='#0f5c36';g.beginPath();g.arc(c[0],c[1],26,Math.PI,0);g.fill();g.strokeStyle='#d4af37';g.lineWidth=3;g.stroke();for(let i=0;i<4;i++){g.fillStyle=PC[i];g.beginPath();g.arc(c[0]-15+i*10,c[1]-8,3.5,0,TAU);g.fill();}}rug([-30,12,30,60],'#3a0f1e','#ffd23f');}
  // ceiling light pools
  g.globalCompositeOperation='lighter';for(let u=-W/2+70;u<W/2-30;u+=120)for(let v=70;v<D-40;v+=110){const q=at(u,v);glow(g,GL.warm,q[0],q[1],70,0.16);}g.globalAlpha=1;g.globalCompositeOperation='source-over';}
function custUpdate(s,dt){for(const c of s.cust||[]){if(c.dead||c.st==='cower')continue;c.tm=(c.tm||0)-dt;if(!c.tg||c.tm<=0){c.tm=rr(2,6);let u,v,n=0;do{u=rr(-s.W/2+26,s.W/2-26);v=rr(30,s.D-96);}while(++n<16&&!roomFree(s,u,v));c.tg=rw(s,u,v);c.idle=rand()<0.4;}
    const dx=c.tg[0]-c.x,dy=c.tg[1]-c.y,d=hyp(dx,dy);if(c.idle||d<4){c.walk=0;continue;}const u2=c.x+dx/d*34*dt-s.x,v2=(s.wy-(c.y+dy/d*34*dt))*s.out;if(!roomFree(s,u2,v2)){c.tm=0;continue;}c.a=Math.atan2(dy,dx);c.x+=dx/d*34*dt;c.y+=dy/d*34*dt;c.walk+=34*dt;}}
// ---------- world drawing: spray pads, for-sale / income signs ----------
function drawSign(x,y,own,l1,l2){g.fillStyle='rgba(0,0,0,0.28)';g.beginPath();g.ellipse(x+5,y+7,26,7,0,0,TAU);g.fill();g.fillStyle='#4a3a2a';g.fillRect(x-2,y-4,4,12);
  const w=Math.max(58,Math.max(g.measureText(l1).width,l2?g.measureText(l2).width:0)+14),h=l2?32:20;g.fillStyle=own?'#12462b':'#5a2c07';rrect(g,x-w/2,y-4-h,w,h,5);g.fill();g.strokeStyle=own?'#7dffa0':'#ff9f43';g.lineWidth=2.5;rrect(g,x-w/2,y-4-h,w,h,5);g.stroke();
  g.fillStyle=own?'#7dffa0':'#ffb469';g.fillText(l1,x,y-4-h+(l2?10:10.5));if(l2){g.fillStyle='#fff';g.fillText(l2,x,y-4-h+23);}}
function drawProps(inV){const tt=G.time,P=G.player;g.save();g.textAlign='center';g.textBaseline='middle';
  for(const sp of SPRAYS){if(!inV(sp.x,sp.y,160))continue;const w=168,h=96,x=sp.x-w/2,y=sp.y-h/2;g.fillStyle='rgba(74,38,110,0.55)';rrect(g,x,y,w,h,10);g.fill();g.save();rrect(g,x,y,w,h,10);g.clip();g.strokeStyle='rgba(249,231,159,0.5)';g.lineWidth=7;
    for(let k=-h;k<w+h;k+=28){g.beginPath();g.moveTo(x+k,y+h);g.lineTo(x+k+h,y);g.stroke();}g.restore();g.strokeStyle='#f9e79f';g.lineWidth=4;g.setLineDash([14,9]);g.lineDashOffset=-tt*16;rrect(g,x,y,w,h,10);g.stroke();g.setLineDash([]);
    g.fillStyle='rgba(20,10,30,0.72)';rrect(g,sp.x-62,sp.y+20,124,24,6);g.fill();g.font='900 13px Rubik,sans-serif';g.fillStyle='#f9e79f';g.direction='ltr';g.fillText('SPRAY + FIX '+(owned('b_spray')?'FREE':'$200'),sp.x,sp.y+33);}
  g.font='900 11px Rubik,sans-serif';g.direction=G.lang==='he'?'rtl':'ltr';
  for(const b of PROPS){if(!inV(b.x,b.y,90))continue;const own=owned(b.id),inc=own?propIncome(b):0,pu=(Math.sin(tt*4)+1)/2;
    g.globalAlpha=0.25+pu*0.25;g.fillStyle=own?'#7dffa0':'#ff9f43';g.beginPath();g.arc(b.x,b.y,22+pu*4,0,TAU);g.fill();g.globalAlpha=1;
    drawSign(b.x,b.y-14,own,own?'$'+inc.toLocaleString('en-US'):tr('forSale'),own?null:'$'+b.price.toLocaleString('en-US'));}
  for(const s of SHOPS){if(s.k!=='home'||owned(s.pid)||!inV(s.x,s.wy,120))continue;drawSign(s.x+58,s.wy+s.out*30,false,tr('forSale'),'$'+s.price.toLocaleString('en-US'));}
  g.direction='ltr';g.restore();}
