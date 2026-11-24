// ---------- Meridian: second city, second airport, flights, new vehicles ----------
XS.push(272,284,298,310,324,336);
const GAPS={7:[4,8],11:[2,7]},C2={x0:272,x1:337},USES=[];
function validDir(i,j,d){const ni=i+DIRS[d][0],nj=j+DIRS[d][1];if(!(ni>=0&&nj>=0&&ni<XS.length&&nj<YS.length))return false;if(d===0&&GAPS[i])return GAPS[i].includes(j);if(d===2&&GAPS[ni])return GAPS[ni].includes(j);return true;}
function city2Land(x,y){return x>=262+Math.round(1.5*Math.sin(y*0.19+1))&&x<=345+Math.round(1.4*Math.sin(y*0.21))&&y>=5+Math.round(1.3*Math.sin(x*0.23+2))&&y<=143;}
Object.assign(PAL,{glass:['#3d6f8f','#2f5a78','#4b86a3','#27485f','#5a93ad','#356a7a','#2b3f5c'],vista:['#f2c9a0','#e9b7a1','#f5e1b8','#c9e2d8','#e8cfe0','#d9e6f2','#f0d9c0'],forge:['#8a4b3a','#7a5a48','#6b6f76','#9a5f45','#5f6570','#84523c']});
Object.assign(AREAS,{glass:{he:'רובע הזכוכית',en:'Glass Quarter'},vista:{he:'שדרות השקיעה',en:'Sunset Vista'},forge:{he:'המפחה',en:'The Forge'},air2:{he:'נמל התעופה מרידיאן',en:'Meridian Intl Airport'}});
Object.assign(VT,{
 suv:{he:'ג׳יפ עירוני',en:'SUV',l:66,w:33,max:360,acc:300,grip:6,turn:2.4,hp:210,cols:['#1c1c1c','#f4f6f7','#5d6d7e','#7b241c','#1f3a5f'],suv:1,mass:1.4},
 limo:{he:'לימוזינה',en:'Limousine',l:98,w:30,max:330,acc:230,grip:6,turn:1.9,hp:200,cols:['#111111','#f4f6f7','#e84393'],limo:1,mass:1.6},
 vanta:{he:'ואנטה חשמלית',en:'Vanta EV',l:60,w:30,max:570,acc:620,grip:8.5,turn:3.1,hp:230,cols:['#00d2d3','#f4f6f7','#16161d','#b8e600'],sport:1,elec:1,vanta:1},
 hotrod:{he:'הוט־רוד',en:'Hot Rod',l:62,w:30,max:500,acc:500,grip:4.8,turn:2.6,hp:180,cols:['#c0392b','#1c1c1c','#e67e22'],rod:1},
 buggy:{he:'באגי חולות',en:'Dune Buggy',l:48,w:30,max:400,acc:430,grip:5,turn:3.2,hp:140,cols:['#f1c40f','#e74c3c','#1abc9c'],buggy:1,mass:0.8},
 cart:{he:'רכב גולף',en:'Golf Cart',l:40,w:24,max:170,acc:200,grip:7,turn:3,hp:90,cols:['#f4f6f7','#a9dfbf'],cart:1,mass:0.6,elec:1},
 wasp:{he:'צרעה 900',en:'Wasp 900',l:42,w:14,max:580,acc:640,grip:8.5,turn:3.6,hp:130,cols:['#b8e600','#ff3f81','#00d2d3'],bike:1,mass:0.5},
 ambulance:{he:'אמבולנס',en:'Ambulance',l:72,w:34,max:400,acc:300,grip:6,turn:2.3,hp:260,cols:['#f8f9f9'],van:1,amb:1,mass:1.6},
 firetruck:{he:'כבאית',en:'Fire Truck',l:96,w:38,max:330,acc:220,grip:6,turn:1.7,hp:420,cols:['#c0392b'],van:1,fire:1,truck:1,mass:2.8},
 bulwark:{he:'משוריין כספים',en:'Cash Truck',l:74,w:36,max:300,acc:220,grip:6,turn:2,hp:650,cols:['#4d5661'],van:1,armored:1,truck:1,mass:2.4},
 jetski:{he:'אופנוע ים',en:'Jet Ski',l:38,w:16,max:500,acc:430,grip:2.4,turn:3.2,hp:90,cols:['#ff3f81','#00d2d3','#f1c40f'],boat:1,mass:0.5},
 heli:{he:'מסוק',en:'Helicopter',l:70,w:26,max:400,acc:300,grip:7,turn:2.4,hp:240,cols:['#f4f6f7','#c0392b','#16161d'],plane:1,heli:1}});
Object.assign(STR.he,{noLand:'אי אפשר לנחות כאן — חפש שטח פתוח',flyT:'טיסות',flySub:'טיסה של כשעה',flew:'נחתת ב{0}',flyUse:'✈ דלפק כרטיסים — לחץ על כפתור הפעולה',hotCar:'גנבת רכב תצוגה — האזעקה הופעלה!',heliHint:'מסוק: גז כדי להמריא ולטוס. עצור לגמרי כדי לנחות.',welcome2:'ברוך הבא למרידיאן'});
Object.assign(STR.en,{noLand:'Cannot land here — find open ground',flyT:'Flights',flySub:'About an hour in the air',flew:'You landed at {0}',flyUse:'✈ Ticket desk — press the action button',hotCar:'You stole a showroom car — the alarm is on!',heliHint:'Helicopter: gas to take off and fly. Come to a full stop to land.',welcome2:'Welcome to Meridian'});
function city2Walk(){fillT(C2.x0-1,YS[0]-1,C2.x1+1,YS[YS.length-1]+2,TL.WALK);}
function city2Roads(){for(const y of YS)fillT(C2.x0,y,C2.x1,y+1,TL.ROAD);
  for(const j of GAPS[11]){for(let x=220;x<C2.x0-1;x++)for(const y of [YS[j],YS[j]+1])tset(x,y,tget(x,y)===0?TL.BRIDGE:TL.ROAD);for(let x=224;x<C2.x0-3;x+=7)LAMPS.push({x:(x+0.5)*T,y:YS[j]*T-2,lx:(x+0.5)*T,ly:YS[j]*T+30});}}
function genCity2(){const R=mulberry32(90417),rp=a=>a[Math.floor(R()*a.length)],rob=(mn,mx,st)=>({name:R2('שדוד את הקופה','Rob the register'),dur:5,min:mn,max:mx,stars:st,cd:240,done:R2('הקופה רוקנה','Register emptied')});
  const spec={'0,1':'gas','0,4':'spray','0,8':'market','1,0':'tower','1,3':'plaza','1,6':'clothes','1,9':'spray','2,1':'bank','2,4':'dealer','2,7':'guns','2,9':'gas','3,0':'park','3,2':'market','3,5':'plaza','3,8':'brew','4,1':'pad','4,6':'market'};
  for(let i=12;i<17;i++)for(let j=0;j<YS.length-1;j++){const x0=XS[i]+3,x1=XS[i+1]-2,y0=YS[j]+3,y1=YS[j+1]-2,cx=(x0+x1+1)/2*T,cy=(y0+y1+1)/2*T,nY=(YS[j]+2.5)*T,sY=(YS[j+1]-0.5)*T,s=spec[(i-12)+','+j],d=district(x0,y0);
    if(s==='gas'){fillT(x0,y0,x1,y1,TL.CONC);const bb=addBld(x0,y0,x1,y0+2,1.2,'#2a7fb8',{logo:'GAS',logoC:'#fff3c4'});addShop('market',bb,2,MKT()).gasStore=1;for(const gx of [x0+2.5,x1-1.5]){DECOR.push({t:'pump',x:gx*T,y:(y0+5.5)*T});GAS.push({x:gx*T+52,y:(y0+5.5)*T});}continue;}
    if(s==='spray'){sprayBlock(x0,y0,x1,y1);continue;}
    if(s==='market'){const bb=addBld(x0,y0,x1,y1,1.5,'#2f8f6b',{logo:'24',logoC:'#eafff4'});addShop('market',bb,2,MKT());continue;}
    if(s==='clothes'){const bb=addBld(x0,y0,x1,y1,2.2,'#7a4fa3',{logo:'ATELIER',logoC:'#ffe3f0'});addShop('clothes',bb,2,{name:R2('אטלייה מרידיאן — בגדים','Atelier Meridian'),col:'#ff8fc0',rob:rob(400,900,2)});continue;}
    if(s==='guns'){const bb=addBld(x0,y0,x1,y1,1.8,'#4a4f57',{logo:'AMMO',logoC:'#ffb347'});addShop('guns',bb,2,{name:R2('ברזל ואבק שריפה — סניף מרידיאן','Iron & Powder Meridian'),col:'#ff9f43',rob:rob(1000,1800,3)});continue;}
    if(s==='bank'){const bb=addBld(x0,y0,x1,y1,4.2,'#d9e2ea',{logo:'M',logoC:'#1f5f8b'});addShop('bank',bb,2,{name:R2('בנק מרידיאן','Meridian Trust'),col:'#9be29f',rob:{name:R2('שדוד את הכספת','Rob the vault'),dur:10,min:7000,max:11000,stars:5,cd:700,done:R2('הכספת רוקנה!','Vault cleaned out!')}});continue;}
    if(s==='tower'){fillT(x0,y0,x1,y1,TL.CONC);addBld(x0+1,y0+1,x1-1,y1-3,8.5,'#1d3b53',{logo:'HALO',logoC:'#7ff3ff',neon:'#7ff3ff',glass:1});POI.halo={x:cx,y:(y1-1)*T};DECOR.push({t:'fountain',x:cx,y:(y1-1)*T});continue;}
    if(s==='plaza'){fillT(x0,y0,x1,y1,TL.CONC);DECOR.push({t:'fountain',x:cx,y:cy});for(const [ax,ay] of [[x0+1,y0+1],[x1,y0+1],[x0+1,y1],[x1,y1]])TREES.push({x:ax*T,y:ay*T,r:22,palm:1});continue;}
    if(s==='park'){fillT(x0,y0,x1,y1,TL.GRASS);fillT(x0+2,y0+2,x1-2,y0+4,TL.WATER);for(let k=0;k<10;k++){const tx=x0+R()*(x1-x0+1),ty=y0+R()*(y1-y0+1);if(tget(Math.floor(tx),Math.floor(ty))===TL.GRASS)TREES.push({x:tx*T,y:ty*T,r:20+R()*14});}continue;}
    if(s==='dealer'){fillT(x0,y0,x1,y1,TL.LOT);addBld(x0,y0,x1,y0+2,1.6,'#e9eef2',{logo:'AUTOHAUS',logoC:'#16161d',neon:'#00d2d3'});POI.dealer={x:cx,y:(y0+4.2)*T};POI.dealCars=[[x0+1.5,y0+5],[x0+4.5,y0+5],[x1-0.5,y0+5],[x0+1.5,y1-0.5],[x1-0.5,y1-0.5]].map(q=>({x:q[0]*T,y:q[1]*T,a:Math.PI/2}));continue;}
    if(s==='brew'){fillT(x0,y0,x1,y0+1,TL.CONC);addBld(x0,y0+2,x1,y1,1.9,'#7a3b2a',{logo:'FORGE ALE',logoC:'#ffcf5a'});POI.brew={x:cx,y:(y0+1)*T};continue;}
    if(s==='pad'){fillT(x0,y0,x1,y1,TL.CONC);addBld(x0,y0,x1,y0+2,1.4,'#56606e',{logo:'SKYPORT',logoC:'#ffe14d'});POI.pad={x:cx,y:(y0+6)*T};DECOR.push({t:'helipad',x:cx,y:(y0+6)*T});continue;}
    const lots=[];splitLots(x0,y0,x1,y1,0,lots,R);
    for(const [a,b,c,e] of lots){const r=R();
      if(r<0.07&&c-a>=1&&e-b>=1){fillT(a,b,c,e,TL.LOT);for(let y=b;y<=e;y++)for(let x=a;x<=c;x++)if(R()<0.5)PARKSPOTS.push({x:(x+0.5)*T,y:(y+0.5)*T,a:R()<0.5?Math.PI/2:-Math.PI/2});}
      else if(r<0.13&&d!=='glass'){fillT(a,b,c,e,TL.GRASS);TREES.push({x:(a+c+1)/2*T,y:(b+e+1)/2*T,r:22+R()*12,palm:d==='vista'});}
      else{let bx1=c,by1=e;if(c-a>=2&&R()<0.3){bx1=c-1;fillT(c,b,c,e,TL.CONC);}if(e-b>=2&&R()<0.3){by1=e-1;fillT(a,e,c,e,TL.CONC);}
        const ht=d==='glass'?3.4+R()*5.2:d==='vista'?1.5+R()*2.4:1+R()*1.1;
        addBld(a,b,bx1,by1,ht,rp(PAL[d]),Object.assign({ac:R()<0.5,glass:d==='glass'?1:0},d==='glass'&&R()<0.6?{neon:rp(['#7ff3ff','#5fe0d0','#7aa2ff','#ffffff'])}:d==='vista'&&R()<0.25?{neon:rp(['#ff4fd8','#ffd23f'])}:{}));}}}
  // airport
  fillT(262,145,346,193,TL.GRASS);fillT(264,147,344,191,TL.CONC);fillT(268,172,340,176,TL.ROAD);fillT(298,138,299,171,TL.ROAD);
  addBld(270,150,277,156,1.6,'#8a8f96',{hangar:1});addBld(281,150,288,156,1.6,'#7f858c',{hangar:1});addBld(304,149,326,154,1.6,'#cfe3ea',{logo:'MERIDIAN INTL',logoC:'#1f5f8b'});addBld(334,150,335,151,4.8,'#d9dde2',{lh:1});
  DECOR.push({t:'runway',x:268*T,y:172*T,w:73*T,h:5*T},{t:'helipad',x:292.5*T,y:163*T},{t:'pump',x:330*T,y:161*T});GAS.push({x:330*T+52,y:161*T});
  POI.airport2={x:315*T,y:157.5*T};POI.planes2=[{x:306*T,y:167*T,a:0},{x:320*T,y:167.5*T,a:0}];POI.helis=[{x:292.5*T,y:163*T},{x:POI.pad.x,y:POI.pad.y},{x:236*T,y:166*T}];
  for(const [bx,by] of [[290,158],[312,158],[328,158],[276,170],[340,170]])LAMPS.push({x:bx*T,y:by*T,lx:bx*T+20,ly:by*T,big:1});
  for(let k=0;k<160;k++){const x=258+Math.floor(R()*90),y=Math.floor(R()*146),t=tget(x,y);if(t===TL.GRASS&&(x<270||x>339||y<9||y>138))TREES.push({x:(x+R())*T,y:(y+R())*T,r:18+R()*14,palm:R()<0.5});else if(t===TL.SAND&&R()<0.6)TREES.push({x:(x+R())*T,y:(y+R())*T,r:22+R()*8,palm:1});}
  POI.boats.push({x:259.5*T,y:60*T,a:Math.PI/2},{x:259.5*T,y:120*T,a:Math.PI/2});POI.jets=[{x:107.5*T,y:150*T},{x:230.5*T,y:74*T},{x:259.5*T,y:66*T},{x:259.5*T,y:114*T},{x:120.5*T,y:96*T}];
  POI.desk1={x:222*T,y:157.5*T};POI.desk2={x:POI.airport2.x,y:POI.airport2.y};USES.push({x:POI.desk1.x,y:POI.desk1.y,r:54,lb:'flyUse',ic:'✈',fn:()=>openFly('a1')},{x:POI.desk2.x,y:POI.desk2.y,r:54,lb:'flyUse',ic:'✈',fn:()=>openFly('a2')});
  Object.assign(SND,{suv:{b:38,r:44,c:400,v:1.15},limo:{b:40,r:40,c:380,v:0.9},vanta:{w:'sine',b:120,r:260,c:2400,v:0.45},cart:{w:'sine',b:90,r:160,c:1600,v:0.35},hotrod:{b:34,r:70,c:520,v:1.45,am:9},buggy:{w:'square',b:60,r:110,c:900,v:0.8},wasp:{w:'square',b:110,r:190,c:1900,v:0.5},
    ambulance:{b:36,r:40,c:380,v:1.15},firetruck:{b:27,r:26,c:260,v:1.4},bulwark:{b:27,r:26,c:260,v:1.4},jetski:{w:'square',b:80,r:120,c:1200,v:0.6},heli:{w:'sawtooth',b:22,r:6,c:300,v:1.5,am:14}});}
// ---------- traffic mix per district ----------
function trafficType(x,y){const d=district(x/T,y/T),r=rand(),b=pick(TRAFFIC_TYPES);if(r<0.025)return'ambulance';if(r<0.04)return'firetruck';if(r<0.06)return'bulwark';
  switch(d){case'glass':return r<0.5?pick(['suv','suv','limo','vanta','sedan','taxi']):b;case'vista':return r<0.42?pick(['suv','buggy','vanta','wasp','muscle']):b;case'forge':return r<0.45?pick(['pickup','van','hotrod','pickup','bus']):b;
    case'crown':return r<0.4?pick(['suv','limo','cart','sedan']):b;case'strip':return r<0.4?pick(['limo','wasp','stinger','taxi']):b;case'beach':return r<0.25?pick(['buggy','wasp']):b;case'res':return r<0.14?'hotrod':b;default:return r<0.12?'suv':b;}}
function spawnTraffic(cx,cy){for(let k=0;k<8;k++){const i=ri(0,XS.length-1),j=ri(0,YS.length-1),np=nodePos(i,j);const d=hyp(np.x-cx,np.y-cy);
  if(d<700||d>1500)continue;const ds=[0,1,2,3].filter(dd=>validDir(i,j,dd));if(!ds.length)continue;const dd=pick(ds);
  const v=mkVeh(trafficType(np.x,np.y),0,0,0);trafficAt(v,i,j,dd,rr(0.2,0.8));
  if(onScreen(v.x,v.y,60)||G.vehicles.some(o=>o!==v&&hyp(o.x-v.x,o.y-v.y)<130)){G.vehicles.pop();continue;}
  v.driver='civ';return;}}
function populateCity2(){const sp=(type,x,y,a,o)=>{const v=mkVeh(type,x,y,a||0);v.parked=true;Object.assign(v,o||{});return v;};
  for(const q of POI.planes2){const pl=sp('plane',q.x,q.y,q.a);pl.persist=true;pl.fuel=1;}
  for(const h of POI.helis){const v=sp('heli',h.x,h.y,-Math.PI/2);v.persist=true;v.fuel=1;}
  POI.dealCars.forEach((q,k)=>sp(['vanta','suv','wasp','limo','vanta'][k],q.x,q.y,q.a,{persist:true,hot:1,fuel:1}));
  for(const j of POI.jets)sp('jetski',j.x,j.y,Math.PI/2);
  sp('hotrod',POI.office.x-420,POI.office.y+40,0);sp('buggy',110.5*T,70*T,Math.PI/2);sp('buggy',224.5*T,52*T,Math.PI/2);sp('cart',POI.halo.x-90,POI.halo.y,0);
  const cs=SHOPS.find(s=>s.k==='casino');sp('limo',cs.sx-170,cs.sy+2,0);sp('wasp',cs.sx+150,cs.sy+2,0);sp('ambulance',POI.hosp.x+150,POI.hosp.y-22,0);sp('firetruck',POI.cops.x-200,POI.cops.y-22,0);sp('cart',196*T,12.6*T,0);sp('suv',POI.brew.x-120,POI.brew.y,0);}
// ---------- helicopter ----------
function planePhys(v,dt,vf){if(v.t.heli){heliPhys(v,dt,vf);return;}const was=v.alt>0.25;v.alt=clamp((v.alt||0)+(vf>330&&v.driver&&!v.dead?dt*0.9:-dt*0.65),0,1);
  if(was&&v.alt<=0.25){const t=tileAt(v.x,v.y);if(t===TL.BLD||t===TL.FENCE)explodeVeh(v,null);else if(v.driver===G.player){sfx.crash(200);G.shake=4;}}}
function heliPhys(v,dt,vf){if(v.thr<0&&vf<8){v.vx*=0.86;v.vy*=0.86;}const up=v.driver&&!v.dead&&(v.thr>0||vf>70),was=v.alt>0.25;let na=clamp((v.alt||0)+(up?dt*0.75:-dt*0.5),0,1);
  if(was&&na<=0.25){const t=tileAt(v.x,v.y);if(t===TL.BLD||t===TL.FENCE||t===TL.WATER){na=0.26;if(v.driver===G.player&&G.time-(v.noLand||0)>3){v.noLand=G.time;toast(tr('noLand'),2);}}}
  v.alt=na;v.rot=(v.rot||0)+dt*(v.driver&&!v.dead?27:v.alt>0?9:0);if(v.alt>0.3&&!v.dead)v.a+=(v.sm||0)*1.9*dt*(1-Math.min(1,Math.abs(vf)/110));
  if(v.driver===G.player&&!G.seen.heli){G.seen.heli=1;toast(tr('heliHint'),6);}}
function drawPlane(v){if(v.t.heli){drawHeliV(v);return;}const alt=v.alt||0,sc=1+alt*0.55;g.fillStyle=`rgba(0,0,10,${0.3-0.13*alt})`;g.save();g.translate(v.x+5+alt*75,v.y+7+alt*100);g.rotate(v.a);planeShape(1,v);g.restore();
  g.save();g.translate(v.x,v.y);g.rotate(v.a);g.scale(sc,sc);planeShape(0,v);g.restore();
  if(v.burn>0&&rand()<0.5)part(rand()<0.5?'fire':'smoke',v.x+rr(-10,10),v.y+rr(-10,10),rr(-20,20),rr(-20,20),0.8,rr(6,12));}
function drawHeliV(v){const alt=v.alt||0,sc=1+alt*0.5,col=v.dead?'#2b2b2b':v.col;
  const body=sh=>{if(!sh)g.fillStyle=col;g.beginPath();g.ellipse(4,0,24,13,0,0,TAU);g.fill();g.fillRect(-48,-3,36,6);g.beginPath();g.ellipse(-48,0,4.5,10,0,0,TAU);g.fill();if(sh)return;
    g.strokeStyle='rgba(0,0,0,0.4)';g.lineWidth=1;g.beginPath();g.ellipse(4,0,24,13,0,0,TAU);g.stroke();g.fillStyle=v.dead?'#1a1a1a':'#15212d';g.beginPath();g.moveTo(10,-11);g.quadraticCurveTo(30,-9,28,0);g.quadraticCurveTo(30,9,10,11);g.closePath();g.fill();g.fillStyle='rgba(255,255,255,0.18)';g.fillRect(13,-8,9,5);
    g.fillStyle='rgba(0,0,0,0.25)';g.fillRect(-9,-13,3,26);g.fillStyle='#c0392b';g.fillRect(-52,-2,5,4);g.strokeStyle='#22262c';g.lineWidth=2.6;g.beginPath();g.moveTo(-14,-18);g.lineTo(18,-18);g.moveTo(-14,18);g.lineTo(18,18);g.moveTo(-6,-13);g.lineTo(-6,-18);g.moveTo(10,-13);g.lineTo(10,-18);g.moveTo(-6,13);g.lineTo(-6,18);g.moveTo(10,13);g.lineTo(10,18);g.stroke();};
  g.fillStyle=`rgba(0,0,10,${0.3-0.12*alt})`;g.save();g.translate(v.x+5+alt*60,v.y+7+alt*80);g.rotate(v.a);body(1);g.restore();
  g.save();g.translate(v.x,v.y);g.rotate(v.a);g.scale(sc,sc);body(0);const r=v.rot||0,on=v.driver&&!v.dead;if(on){g.fillStyle='rgba(30,30,30,0.2)';g.beginPath();g.arc(2,0,42,0,TAU);g.fill();}
  g.strokeStyle=on?'rgba(20,20,20,0.6)':'#1b1b1b';g.lineWidth=3.6;g.beginPath();for(let k=0;k<2;k++){const a=r+k*Math.PI/2;g.moveTo(2-Math.cos(a)*42,-Math.sin(a)*42);g.lineTo(2+Math.cos(a)*42,Math.sin(a)*42);}g.stroke();g.fillStyle='#333';g.beginPath();g.arc(2,0,4,0,TAU);g.fill();g.restore();
  if(v.burn>0&&rand()<0.5)part(rand()<0.5?'fire':'smoke',v.x+rr(-10,10),v.y+rr(-10,10),rr(-20,20),rr(-20,20),0.8,rr(6,12));}
// ---------- paint details for the new cars ----------
function paintExtra(q,t,body,dead,Lh,Wh){if(dead)return;const line=(x0,y0,x1,y1,c,w)=>{q.strokeStyle=c;q.lineWidth=w;q.beginPath();q.moveTo(x0,y0);q.lineTo(x1,y1);q.stroke();};
  if(t.suv){line(-Lh*0.45,-Wh+6.5,Lh*0.18,-Wh+6.5,'rgba(20,20,20,0.75)',1.6);line(-Lh*0.45,Wh-6.5,Lh*0.18,Wh-6.5,'rgba(20,20,20,0.75)',1.6);q.fillStyle='#1b1b1b';rrect(q,-Lh-2.5,-6,4,12,2);q.fill();}
  if(t.limo){q.fillStyle=shade(body,-0.1);for(let k=-Lh*0.32;k<Lh*0.12;k+=14)q.fillRect(k,-Wh+5,2.2,t.w-10);q.fillStyle='rgba(255,255,255,0.5)';q.fillRect(-Lh+5,-1,t.l*0.3,2);}
  if(t.vanta){q.fillStyle='rgba(0,0,0,0.55)';q.fillRect(Lh*0.5,-7,7,3);q.fillRect(Lh*0.5,4,7,3);q.fillStyle='rgba(127,243,255,0.9)';q.fillRect(-Lh+1,-Wh+2,2,t.w-4);q.fillRect(Lh-2,-Wh+4,1.5,t.w-8);}
  if(t.rod){q.fillStyle='#c9ced4';rrect(q,Lh*0.38,-6,13,12,2);q.fill();q.fillStyle='#6b7178';for(let k=0;k<3;k++)q.fillRect(Lh*0.38+2+k*4,-5,2,10);q.fillStyle='#f39c12';q.beginPath();q.moveTo(Lh*0.3,-Wh+2);q.lineTo(-Lh*0.25,-Wh+2);q.lineTo(-Lh*0.05,-Wh+7);q.lineTo(-Lh*0.4,-Wh+5);q.lineTo(Lh*0.1,-Wh+9);q.closePath();q.fill();q.beginPath();q.moveTo(Lh*0.3,Wh-2);q.lineTo(-Lh*0.25,Wh-2);q.lineTo(-Lh*0.05,Wh-7);q.lineTo(-Lh*0.4,Wh-5);q.lineTo(Lh*0.1,Wh-9);q.closePath();q.fill();}
  if(t.buggy){q.fillStyle='#22262c';rrect(q,-Lh*0.45,-Wh+5,t.l*0.5,t.w-10,3);q.fill();q.fillStyle='#8a5a2b';q.fillRect(-Lh*0.3,-8,9,6);q.fillRect(-Lh*0.3,2,9,6);for(const y of [-Wh+4,Wh-4])line(-Lh*0.5,y,Lh*0.2,y,'#d5dae0',2.2);line(-Lh*0.5,-Wh+4,-Lh*0.5,Wh-4,'#d5dae0',2.2);line(Lh*0.2,-Wh+4,Lh*0.2,Wh-4,'#d5dae0',2.2);}
  if(t.cart){q.fillStyle='#f8f9f9';rrect(q,-Lh+5,-Wh+2,t.l-14,t.w-4,3);q.fill();q.strokeStyle='rgba(0,0,0,0.3)';q.lineWidth=1;rrect(q,-Lh+5,-Wh+2,t.l-14,t.w-4,3);q.stroke();q.fillStyle='#2ecc71';q.fillRect(-Lh+7,-1.5,t.l-18,3);}
  if(t.amb){q.fillStyle='#e74c3c';q.fillRect(-Lh+6,-Wh+2,t.l*0.55,2.5);q.fillRect(-Lh+6,Wh-4.5,t.l*0.55,2.5);q.fillRect(-9,-3,18,6);q.fillRect(-3,-9,6,18);q.fillStyle='#3d6bff';q.fillRect(Lh*0.3,-8,4,5);q.fillStyle='#ff3030';q.fillRect(Lh*0.3,3,4,5);}
  if(t.fire){q.fillStyle='#d5dae0';q.fillRect(-Lh+8,-5,t.l*0.55,10);q.strokeStyle='#7f858c';q.lineWidth=1.4;q.beginPath();for(let k=-Lh+12;k<-Lh+8+t.l*0.55;k+=7){q.moveTo(k,-5);q.lineTo(k,5);}q.stroke();q.fillStyle='#f1c40f';q.fillRect(-Lh+4,-Wh+2,t.l-10,2);q.fillRect(-Lh+4,Wh-4,t.l-10,2);q.fillStyle='#3d6bff';q.fillRect(Lh*0.42,-10,4,20);}
  if(t.armored){q.fillStyle='rgba(0,0,0,0.3)';for(let k=-Lh+9;k<Lh*0.35;k+=9){q.fillRect(k,-Wh+5,2,2);q.fillRect(k,Wh-7,2,2);}q.fillStyle='#f1c40f';q.font='bold 12px sans-serif';q.textAlign='center';q.textBaseline='middle';q.fillText('$',-Lh*0.25,0.5);}}
// ---------- airports: flights ----------
const AIRP={a1:{n:R2('נמל התעופה סולס','Solace Intl'),p:()=>POI.desk1},a2:{n:R2('נמל התעופה מרידיאן','Meridian Intl'),p:()=>POI.desk2}};
function openFly(from){G.flyFrom=from;openShop({name:R2('טיסות','Flights'),col:'#8fd3ff'},'fly');}
function flyPanel(item,m){const d=document.createElement('div');d.className='stats';d.textContent=tr('flySub');m.appendChild(d);
  for(const k in AIRP){if(k===G.flyFrom)continue;const A=AIRP[k];item('✈ '+L(A.n),tr('flySub'),owned('b_air')?0:300,()=>{setTimeout(()=>{closeShop();const P=G.player,q=A.p();P.x=q.x;P.y=q.y+70;P.mvx=P.mvy=0;G.cam.x=P.x;G.cam.y=P.y;ENV.clock=(ENV.clock+1.2)%24;calcLight();G.area=null;toast(fmt(tr('flew'),L(A.n)),4);sfx.pass();saveGame();},0);},null);}}
function propsUpdate(dt){const P=G.player;G.playT=(G.playT||0)+dt;G.nearProp=null;G.nearUse=null;
  if(P.veh&&P.veh.hot){P.veh.hot=0;P.veh.persist=false;setStars(2);toast(tr('hotCar'),3.5);P.veh.alarm=8;}
  if(P.veh||P.inside||P.roof||P.climb)return;for(const u of USES){const d=hyp(P.x-u.x,P.y-u.y);if(d<(u.r||50))G.nearUse=u;}
  if(G.wanted>0)return;let bd=46;for(const b of PROPS){const d=hyp(P.x-b.x,P.y-b.y);if(d<bd){bd=d;G.nearProp=b;}}
  for(const s of SHOPS)if(s.k==='home'&&!owned(s.pid)){const d=hyp(P.x-s.sx,P.y-s.sy);if(d<bd){bd=d;G.nearProp=s;}}}
function drawPropTop(){const P=G.player,c=G.cam,pu=(Math.sin(G.time*4)+1)/2;
  for(const u of USES){if(Math.abs(u.x-c.x)>1100||Math.abs(u.y-c.y)>800)continue;g.globalAlpha=0.3+pu*0.25;g.fillStyle='#8fd3ff';g.beginPath();g.arc(u.x,u.y,26+pu*5,0,TAU);g.fill();g.globalAlpha=1;g.strokeStyle='#8fd3ff';g.lineWidth=4;g.setLineDash([10,6]);g.lineDashOffset=-G.time*18;g.beginPath();g.arc(u.x,u.y,26,0,TAU);g.stroke();g.setLineDash([]);
    g.fillStyle='#0b1020';g.font='bold 24px sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText(u.ic||'!',u.x,u.y+1);}
  if(P.veh)return;if(G.nearUse){bubble(G.nearUse.x,G.nearUse.y-44,tr(G.nearUse.lb));return;}
  const b=G.nearProp;if(!b)return;const id=pid(b),own=owned(id),x=b.sx||b.x,y=(b.sy||b.y)-44;
  bubble(x,y,own?fmt(tr('propCollect'),propIncome(b).toLocaleString('en-US')):fmt(tr('propPrompt'),L(b.name),b.price.toLocaleString('en-US')));}
function genProps2(){const B=(id,x,y,name,price,inc,perk)=>PROPS.push({id,x,y,name,price,inc,perk}),H=(id,tx,ty,name,price)=>{const r=pickHomeB(tx,ty);if(r)addShop('home',r[0],r[1],{name,price,pid:id,col:'#2ecc71'});};
  H('h_glass',304,42,R2('דירת יוקרה ברובע הזכוכית','Glass Quarter condo'),95000);H('h_forge',318,122,R2('לופט במפחה','Forge loft'),20000);
  B('b_brew',POI.brew.x+130,POI.brew.y,R2('מבשלת המפחה','Forge Ale brewery'),26000,2600);
  B('b_deal',POI.dealer.x+150,POI.dealer.y-6,R2('סוכנות הרכב אוטוהאוס','Autohaus dealership'),120000,12000);
  B('b_air',POI.airport2.x+110,POI.airport2.y,R2('חברת התעופה מרידיאן אייר','Meridian Air'),150000,15000,R2('טיסות חינם','Free flights'));}
Object.assign(SPK,{ivy:{he:'אייבי',en:'Ivy',c:'#7ff3ff',p:340},cap:{he:'קפטן רוטור',en:'Captain Rotor',c:'#ffe14d',p:120}});
function buildMissions3(){const cp=(i,j)=>{const p=nodePos(i,j);return[p.x,p.y];};
 POI.dealM={x:POI.dealer.x,y:POI.dealer.y+74,a:0};POI.padM={x:POI.pad.x+96,y:POI.pad.y,a:-Math.PI/2};
 SIDE.push({id:'s7',name:R2('נסיעת מבחן','Test Drive'),giver:'ivy',start:POI.dealer,look:'biz',steps:[
  {t:'talk',lines:[l('ivy','ברוך הבא לאוטוהאוס. אתה נראה כמו מישהו שלא יכול להרשות לעצמו שום דבר כאן.','Welcome to Autohaus. You look like someone who cannot afford anything here.'),l('ray','אני רק מסתכל.','Just looking.'),l('ivy','אז תסתכל מהר. הוואנטה החשמלית, סיבוב אחד בעיר, שתי דקות. שריטה אחת, ואתה קונה אותה.','Then look fast. The electric Vanta, one lap of the city, two minutes. One scratch and you buy it.')]},
  {t:'getveh',key:'vanta',type:'vanta',at:'dealM',col:'#00d2d3',obj:R2('היכנס לוואנטה','Get in the Vanta')},
  {t:'pick',timer:125,r:95,pts:()=>[cp(15,4),cp(16,2),cp(16,0),cp(13,0),cp(12,3),cp(12,7),cp(14,9),cp(16,7),cp(14,5)],obj:R2('עבור בכל נקודות הביקורת ({0}/{1})','Hit every checkpoint ({0}/{1})')},
  {t:'talk',lines:[l('ivy','שתי דקות. לא רע. היא עדיין עולה יותר מהבית שלך.','Two minutes. Not bad. It still costs more than your home.')]},
  {t:'reward',money:2500}]},
 {id:'s8',name:R2('מונית אווירית','Air Taxi'),giver:'cap',start:POI.pad,look:'worker',steps:[
  {t:'talk',lines:[l('cap','הטייס שלי התפטר באמצע טיסה. סיפור ארוך. אתה יודע להטיס?','My pilot quit mid-flight. Long story. Can you fly?'),l('ray','מטוסים. בערך.','Planes. Sort of.'),l('cap','מסוק הוא מטוס בלי סבלנות. עבור בטבעות והחזר אותו שלם.','A helicopter is a plane with no patience. Fly the rings and bring it back in one piece.')]},
  {t:'getveh',key:'heli',type:'heli',at:'padM',col:'#f4f6f7',obj:R2('היכנס למסוק','Get in the helicopter')},
  {t:'pick',air:1,pts:()=>[[POI.halo.x,POI.halo.y],[POI.pier.x,POI.pier.y],[POI.airport.x,POI.airport.y],[POI.airport2.x,POI.airport2.y],[POI.brew.x,POI.brew.y]],obj:R2('טוס דרך הטבעות ({0}/{1})','Fly through the rings ({0}/{1})')},
  {t:'cond',f:M=>{const v=M.key.heli;return !(v.alt>0)&&hyp(v.x-POI.pad.x,v.y-POI.pad.y)<420;},obj:R2('נחת בחזרה במנחת סקייפורט','Land back at the Skyport pad')},
  {t:'reward',money:3000}]});}
function drawGlassRoof(b,rx,ry,rw,rh){g.fillStyle='rgba(255,255,255,0.08)';g.beginPath();g.moveTo(rx,ry);g.lineTo(rx+rw*0.6,ry);g.lineTo(rx,ry+rh*0.6);g.fill();
  g.strokeStyle='rgba(255,255,255,0.14)';g.lineWidth=1.5;g.beginPath();for(let k=24;k<rw-6;k+=24){g.moveTo(rx+k,ry+5);g.lineTo(rx+k,ry+rh-5);}for(let k=24;k<rh-6;k+=24){g.moveTo(rx+5,ry+k);g.lineTo(rx+rw-5,ry+k);}g.stroke();
  if(b.logo||rw<130||rh<130)return;const k=b.seed%4,cx=rx+rw/2,cy=ry+rh/2;
  if(k===0){g.fillStyle='rgba(22,30,40,0.85)';g.beginPath();g.arc(cx,cy,36,0,TAU);g.fill();g.strokeStyle='#ffe14d';g.lineWidth=3;g.beginPath();g.arc(cx,cy,30,0,TAU);g.stroke();g.fillStyle='#f4f6f7';g.fillRect(cx-12,cy-14,5,28);g.fillRect(cx+7,cy-14,5,28);g.fillRect(cx-12,cy-3,24,6);}
  else if(k===1){g.fillStyle='#e9e2d0';rrect(g,cx-44,cy-28,88,56,8);g.fill();g.fillStyle='#3fb6e8';rrect(g,cx-34,cy-19,68,38,7);g.fill();g.fillStyle='rgba(255,255,255,0.35)';g.fillRect(cx-26,cy-12+Math.sin(G.time*2+b.seed)*3,30,3);}
  else{g.fillStyle='rgba(0,0,0,0.25)';g.fillRect(cx-27,cy-17,60,40);g.fillStyle='#8f98a3';g.fillRect(cx-30,cy-20,60,40);g.fillStyle='#5d6672';for(let j=0;j<3;j++)g.fillRect(cx-25+j*18,cy-15,12,30);}
  if(Math.floor(G.time*1.4+b.seed%7)%2){g.fillStyle='#ff4a3a';g.beginPath();g.arc(rx+12,ry+12,3.5,0,TAU);g.fill();}}
