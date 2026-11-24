const TL={WATER:0,SAND:1,GRASS:2,ROAD:3,WALK:4,BLD:5,DOCK:6,CONC:7,FENCE:8,LOT:9};
const MAP=new Uint8Array(MW*MH),BMAP=new Int16Array(MW*MH).fill(-1),TSH=new Float32Array(MW*MH);
const XS=[10,22,36,48,62,76,90,104,176,190,204,218],YS=[10,22,34,48,60,72,86,100,112,124,136];
const LAMPS=[];
const BUILDINGS=[],TREES=[],PARKSPOTS=[],DECOR=[],POI={},TOKENS=[],WPICKS=[];
const RESTRICT={x0:131*T,y0:18*T,x1:154*T,y1:50*T};
function tget(x,y){return(x<0||y<0||x>=MW||y>=MH)?0:MAP[y*MW+x];}
function tset(x,y,v){if(x>=0&&y>=0&&x<MW&&y<MH)MAP[y*MW+x]=v;}
function tileAt(x,y){return tget(Math.floor(x/T),Math.floor(y/T));}
function fillT(x0,y0,x1,y1,v,onlyLand){for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){if(onlyLand&&tget(x,y)===0)continue;tset(x,y,v);}}
const PAL={down:['#5d6b7a','#6c7785','#4f5866','#7a8090','#56606e','#65707e','#4d6a78'],
 res:['#b9876a','#c9a27e','#a8766a','#d0b48c','#9c8c7a','#b6a6a0','#c08f7a'],
 harb:['#8a6e52','#7b7f86','#946a4e','#6e7a70','#857563'],
 beach:['#e8d9c0','#f0e6d2','#d9e4ea','#f2d7c4','#cfe0d0','#e6cfd8'],
 army:['#5b6340','#666b4a','#4e5536']};
function district(x,y){if(x>=258)return y>=146?'air2':y<48?'glass':y<100?'vista':'forge';if(x>=168)return y>=146?'air':y<48?'crown':y<86?'strip':'east';if(y>=112&&x<104)return'harb';if(x>=76)return'beach';if(y<60)return'down';return'res';}
let SOFF=0;
function addBld(x0,y0,x1,y1,ht,col,o){const id=BUILDINGS.length;
  const b=Object.assign({seed:(Math.imul(id+7+SOFF,2654435761)>>>0),x:x0,y:y0,w:x1-x0+1,h:y1-y0+1,ht,col,roof:shade(col,0.16),rim:shade(col,-0.15),s1:shade(col,-0.28),s2:shade(col,-0.45)},o||{});
  BUILDINGS.push(b);for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){tset(x,y,TL.BLD);BMAP[y*MW+x]=id;}return b;}
const DIRS=[[1,0],[0,1],[-1,0],[0,-1]];
function nodePos(i,j){return{x:(XS[i]+1)*T,y:(YS[j]+1)*T};}
function nearestNode(x,y){let bi=0,bd=1e9,bj=0;XS.forEach((v,i)=>{const d=Math.abs((v+1)*T-x);if(d<bd){bd=d;bi=i;}});bd=1e9;YS.forEach((v,j)=>{const d=Math.abs((v+1)*T-y);if(d<bd){bd=d;bj=j;}});return[bi,bj];}
function exitPt(i,j,d){const X=XS[i]*T,Y=YS[j]*T;switch(d){case 0:return{x:X+2*T+10,y:Y+1.5*T};case 1:return{x:X+0.5*T,y:Y+2*T+10};case 2:return{x:X-10,y:Y+0.5*T};default:return{x:X+1.5*T,y:Y-10};}}
function entryPt(i,j,d){const X=XS[i]*T,Y=YS[j]*T;switch(d){case 0:return{x:X-6,y:Y+1.5*T};case 1:return{x:X+0.5*T,y:Y-6};case 2:return{x:X+2*T+6,y:Y+0.5*T};default:return{x:X+1.5*T,y:Y+2*T+6};}}
const isVR=x=>XS.includes(x)||XS.includes(x-1), isHR=y=>YS.includes(y)||YS.includes(y-1);

function genWorld(){
  const R=mulberry32(77031),rp=a=>a[Math.floor(R()*a.length)];
  for(let y=0;y<MH;y++)for(let x=0;x<MW;x++){
    const west=4+Math.round(1.6*Math.sin(y*0.21)+1.1*Math.sin(y*0.53+1));
    const north=3+Math.round(1.4*Math.sin(x*0.19+2)+1.0*Math.sin(x*0.47));
    const east=116+Math.round(1.6*Math.sin(y*0.13)+1.2*Math.sin(y*0.41+0.5));
    if(x>=west&&y>=north&&x<=east&&y<=143)MAP[y*MW+x]=x>=107?TL.SAND:TL.GRASS;else if(eastLand(x,y))MAP[y*MW+x]=x>=223?TL.SAND:TL.GRASS;else if(city2Land(x,y))MAP[y*MW+x]=x<=265?TL.SAND:TL.GRASS;
  }
  const xL=XS[0],xR=XS[WE]+1,xL2=XS[WE+1],xR2=XS[11]+1,yT=YS[0],yB=YS[YS.length-1]+1;
  fillT(xL-1,yT-1,xR+1,yB+1,TL.WALK);fillT(xL2-1,yT-1,xR2+1,yB+1,TL.WALK);city2Walk();
  fillT(4,yB+2,106,143,TL.CONC,true);
  for(const x of XS)fillT(x,yT,x+1,yB,TL.ROAD);
  for(const y of YS){fillT(xL,y,xR,y+1,TL.ROAD);fillT(xL2,y,xR2,y+1,TL.ROAD);}city2Roads();
  for(const j of BR)for(let x=xR+1;x<xL2;x++)for(const y of [YS[j],YS[j]+1])tset(x,y,tget(x,y)===0?TL.BRIDGE:TL.ROAD);
  for(const j of BR)for(let x=xR+6;x<xL2-3;x+=7)LAMPS.push({x:(x+0.5)*T,y:YS[j]*T-2,lx:(x+0.5)*T,ly:YS[j]*T+30});
  for(const px of [14,28,44,58,70,94])fillT(px,144,px+2,155,TL.DOCK);
  for(let i=0;i<XS.length;i++){let n=0;for(let y=yT+4;y<yB-2;y+=5){if(isHR(y)||isHR(y-1)||isHR(y+1))continue;const left=(n++)%2===0,x=left?XS[i]*T-12:(XS[i]+2)*T+12;LAMPS.push({x,y:(y+0.5)*T,lx:x+(left?34:-34),ly:(y+0.5)*T});}}
  for(let j=0;j<YS.length;j++)for(const [xa,xb] of [[xL,xR],[xL2,xR2],[C2.x0,C2.x1]]){let n=0;for(let x=xa+4;x<xb-2;x+=5){if(isVR(x)||isVR(x-1)||isVR(x+1))continue;const top=(n++)%2===0,y=top?YS[j]*T-12:(YS[j]+2)*T+12;LAMPS.push({x:(x+0.5)*T,y,lx:(x+0.5)*T,ly:y+(top?34:-34)});}}
  for(let x=9;x<=104;x+=8)LAMPS.push({x:x*T,y:142.7*T,lx:x*T,ly:142.7*T-26});
  for(const [bx,by] of [[136,33.5],[149,36],[142,20.5],[142,47.6]])LAMPS.push({x:bx*T,y:by*T,lx:bx*T+20,ly:by*T,big:1});
  // containers on the quay
  for(const [cx,cy] of [[7,140],[18,141],[38,140],[50,141],[64,140],[80,141],[86,140]]){
    addBld(cx,cy,cx+2,cy+1,0.55+R()*0.3,rp(['#b03a2e','#1f618d','#239b56','#d68910','#6c3483']),{cont:1});}
  // military island
  for(let y=12;y<=54;y++)for(let x=124;x<=160;x++){
    const jx=Math.round(Math.sin(y*0.5)*1.2),jy=Math.round(Math.sin(x*0.45)*1.2);
    if(x>=128+jx&&x<=155+jx&&y>=15+jy&&y<=51+jy)tset(x,y,TL.SAND);}
  fillT(130,17,153,49,TL.GRASS);
  fillT(132,19,152,48,TL.CONC);
  for(let y=18;y<=49;y++){tset(131,y,TL.FENCE);tset(153,y,TL.FENCE);}
  for(let x=131;x<=153;x++){tset(x,18,TL.FENCE);tset(x,49,TL.FENCE);}
  fillT(131,32,131,34,TL.CONC);
  fillT(119,32,129,34,TL.DOCK);fillT(130,32,130,34,TL.CONC);
  addBld(134,21,139,25,1.3,PAL.army[0],{army:1});
  addBld(134,42,139,46,1.3,PAL.army[1],{army:1});
  addBld(143,21,151,29,1.7,'#6b705c',{hangar:1});
  addBld(144,39,150,46,2.6,PAL.army[2],{army:1,hq:1});
  DECOR.push({t:'heli',x:138.5*T,y:33.5*T});
  POI.tank={x:146*T,y:34*T,a:Math.PI};POI.armytruck={x:137*T,y:29.5*T,a:0};
  POI.guards=[[132.5,31.2],[132.5,35.8],[141,20],[148,35],[140,47.5],[150,32]].map(p=>({x:p[0]*T,y:p[1]*T}));
  // secret island
  fillT(139,117,145,122,TL.SAND);tset(139,117,0);tset(145,117,0);tset(139,122,0);tset(145,122,0);
  DECOR.push({t:'sign',x:142*T,y:119.2*T});POI.secret={x:142*T,y:119.2*T};
  TREES.push({x:140.4*T,y:118.4*T,r:26,palm:1},{x:144*T,y:121.3*T,r:24,palm:1},{x:143.8*T,y:118.2*T,r:22,palm:1});

  const spec={'2,9':'office','1,9':'safe','2,2':'club','1,1':'garage','4,9':'tide','3,6':'hosp','4,3':'cops','5,5':'spray','1,4':'park','5,1':'plaza','3,7':'plaza','3,3':'guns','6,5':'court','4,5':'clothes','3,1':'bank','6,2':'mall','2,6':'market','5,8':'market','0,6':'gas','5,3':'gas','8,1':'market','10,2':'gas','9,0':'green','10,0':'green','9,4':'casino','8,5':'guns','10,6':'clothes','9,7':'plaza','8,8':'gas','10,8':'market','8,3':'stadium','0,1':'spray2','6,8':'spray2','9,5':'spray2','9,9':'spray2'};
  for(let i=0;i<11;i++)for(let j=0;j<YS.length-1;j++){if(i===WE)continue;
    const x0=XS[i]+3,x1=XS[i+1]-2,y0=YS[j]+3,y1=YS[j+1]-2;
    const cx=(x0+x1+1)/2*T,nY=(YS[j]+2.5)*T,sY=(YS[j+1]-0.5)*T;
    let s=spec[i+','+j];const d=district(x0,y0),sx=s==='spray2'?[BUILDINGS.length,TREES.length,PARKSPOTS.length]:null;if(sx)s=undefined;
    if(s==='office'){fillT(x0,y0,x0+3,y1,TL.LOT);addBld(x0+4,y0,x1,y1,1.7,'#d9b44a',{logo:'QD',logoC:'#c0392b',lad:1});
      POI.office={x:(x0+6.5)*T,y:nY};POI.van={x:(x0+2)*T,y:(y0+3.5)*T,a:-Math.PI/2};continue;}
    if(s==='safe'){fillT(x0,y0,x1,y1,TL.GRASS);addShop('home',addBld(x0+1,y0,x1-1,y0+4,2.1,'#a7745c',{logo:'⌂',logoC:'#2ecc71',lad:1}),0,{name:R2('הדירה של ריי',"Ray's place"),price:0,pid:'home0',col:'#2ecc71'});
      TREES.push({x:(x0+2)*T,y:(y1)*T,r:28},{x:(x1-1)*T,y:(y1-0.5)*T,r:24});POI.safe={x:cx,y:nY};continue;}
    if(s==='club'){addBld(x0,y0,x1,y1,3.4,'#3b1f4f',{neon:'#ff4fd8',logo:'♦',logoC:'#ff4fd8'});POI.club={x:cx,y:sY};continue;}
    if(s==='garage'){addBld(x0,y0,x1,y1,2.0,'#34343f',{logo:'S',logoC:'#c59bff',neon:'#9b59ff'});POI.garage={x:cx,y:sY};continue;}
    if(s==='casino'){const bb=addBld(x0,y0,x1,y1,2.6,'#3a0f1e',{logo:'LUCKY',logoC:'#ffd23f',neon:'#ffd23f'});addShop('casino',bb,2,{name:R2('קזינו גאות המזל','Lucky Tide Casino'),col:'#ffd23f',rob:{name:R2('שדוד את הקופה','Rob the cage'),dur:8,min:3000,max:5000,stars:4,cd:500,done:R2('הקופה של הקזינו אצלך','The casino cage is yours')}});continue;}
    if(s==='green'){fillT(x0,y0,x1,y1,TL.GRASS);fillT(x0+2,y0+2,x0+4,y0+3,TL.WATER);DECOR.push({t:'flag',x:(x1-1.5)*T,y:(y1-0.5)*T},{t:'flag',x:(x0+1.5)*T,y:(y1-1)*T});for(let k=0;k<7;k++)TREES.push({x:(x0+R()*(x1-x0+1))*T,y:(y0+4.5+R()*(y1-y0-4))*T,r:20+R()*12});continue;}
    if(s==='stadium'){fillT(x0,y0,x1,y1,TL.CONC);DECOR.push({t:'stadium',x:cx,y:(y0+y1+1)/2*T,rx:(x1-x0+1)*T/2-10,ry:(y1-y0+1)*T/2-10});continue;}
    if(s==='court'){fillT(x0,y0,x1,y1,TL.CONC);const o={court:1};addBld(x0,y0,x1,y0+1,1.6,'#7d6a58',o);const bs=addBld(x0,y1-1,x1,y1,1.6,'#8a735c',o);addBld(x0,y0+2,x0+1,y1-2,1.6,'#74624f',o);addBld(x1-1,y0+2,x1,y1-2,1.6,'#74624f',o);
      fillT(x0+3,y0+3,x1-3,y1-3,TL.GRASS);TREES.push({x:(x0+3.5)*T,y:(y0+3.5)*T,r:24},{x:(x1-2.5)*T,y:(y1-2.5)*T,r:22});POI.court={x:cx,y:(y0+y1+1)/2*T,bs};continue;}
    if(s==='guns'){const bb=addBld(x0,y0,x1,y1,1.8,'#5a4a3a',{logo:'AMMO',logoC:'#ffb347'}),sh=addShop('guns',bb,2,{name:R2('ברזל ואבק שריפה — נשק','Iron & Powder Guns'),col:'#ff9f43',rob:{name:R2('שדוד את הקופה','Rob the register'),dur:6,min:900,max:1600,stars:3,cd:300,done:R2('שדדת חנות נשק. אמיץ. או טיפש.','You robbed a gun shop. Brave. Or stupid.')}});if(!POI.guns)POI.guns={x:sh.sx,y:sh.sy};continue;}
    if(s==='clothes'){const bb=addBld(x0,y0,x1,y1,1.9,'#b8507c',{logo:'TL',logoC:'#ffe3f0'});addShop('clothes',bb,2,{name:R2('חוט ומחט — בגדים','Threadline Clothing'),col:'#ff8fc0',rob:{name:R2('שדוד את הקופה','Rob the register'),dur:4,min:300,max:700,stars:2,cd:180,done:R2('הקופה רוקנה. הסטייל נשאר.','Register emptied. The style stays.')}});continue;}
    if(s==='bank'){const bb=addBld(x0,y0,x1,y1,2.4,'#cfc8b8',{logo:'$',logoC:'#2e7d32'});addShop('bank',bb,2,{name:R2('בנק סולס','Solace Savings Bank'),col:'#9be29f',rob:{name:R2('שדוד את הכספת','Rob the vault'),dur:9,min:5000,max:8000,stars:4,cd:600,done:R2('הכספת רוקנה!','Vault cleaned out!')}});continue;}
    if(s==='mall'){const bb=addBld(x0,y0,x1,y1,1.7,'#e6d6c0',{logo:'MALL',logoC:'#c0392b'}),o={name:R2('קניון המפרץ','Baywalk Mall'),col:'#ffd27a',rob:{name:R2('שדוד את התכשיטן','Rob the jeweler'),dur:6,min:1500,max:2500,stars:3,cd:300,done:R2('התכשיטים אצלך','Jewels secured')}};addShop('mall',bb,2,o);addShop('mall',bb,0,Object.assign({},o));continue;}
    if(s==='gas'){fillT(x0,y0,x1,y1,TL.CONC);const bb=addBld(x0,y0,x1,y0+2,1.2,'#d94f3d',{logo:'GAS',logoC:'#fff3c4'});addShop('market',bb,2,MKT()).gasStore=1;for(const gx of [x0+2.5,x1-1.5]){DECOR.push({t:'pump',x:gx*T,y:(y0+5.5)*T});GAS.push({x:gx*T+52,y:(y0+5.5)*T});}continue;}
    if(s==='tide'){fillT(x0,y0,x1,y0,TL.CONC);addBld(x0,y0+1,x1,y1,1.7,'#2f6f6a',{logo:'≈',logoC:'#5fe0d0'});POI.tide={x:cx,y:nY};continue;}
    if(s==='hosp'){addBld(x0,y0,x1,y1,2.5,'#e6e6e6',{cross:1});POI.hosp={x:cx,y:nY};continue;}
    if(s==='cops'){addBld(x0,y0,x1,y1,2.3,'#2c3e70',{logo:'★',logoC:'#f1c40f'});POI.cops={x:cx,y:nY};continue;}
    if(s==='spray'){POI.spray=sprayBlock(x0,y0,x1,y1);continue;}
    if(s==='park'){fillT(x0,y0,x1,y1,TL.GRASS);fillT(x0+3,y0+2,x0+6,y0+4,TL.WATER);
      POI.duck={x:(x0+5)*T,y:(y0+3.5)*T};DECOR.push({t:'duck',x:POI.duck.x,y:POI.duck.y});
      for(let k=0;k<9;k++){const tx=x0+R()*(x1-x0+1),ty=y0+R()*(y1-y0+1);if(tget(Math.floor(tx),Math.floor(ty))===TL.GRASS&&!(tx>x0+2&&tx<x0+8&&ty>y0+1&&ty<y0+6))TREES.push({x:tx*T,y:ty*T,r:20+R()*14});}
      POI.parkTok={x:(x0+1)*T,y:(y1+0.5)*T};continue;}
    if(s==='plaza'){fillT(x0,y0,x1,y1,TL.CONC);DECOR.push({t:'fountain',x:cx,y:(y0+y1+1)/2*T});
      for(const [ax,ay] of [[x0+1,y0+1],[x1,y0+1],[x0+1,y1],[x1,y1]])TREES.push({x:ax*T,y:ay*T,r:22});continue;}
    let regs=[[x0,y0,x1,y1]];if(s==='market'){const bb=addBld(x0,y0,x0+3,y0+3,1.25,'#2f8f6b',{logo:'24',logoC:'#eafff4'});addShop('market',bb,0,MKT());regs=[[x0+4,y0,x1,y1],[x0,y0+4,x0+3,y1]];}
    const lots=[];for(const r of regs)splitLots(r[0],r[1],r[2],r[3],0,lots,R);
    for(const [a,b,c,e] of lots){const r=R();if(d==='crown'){villa(a,b,c,e,R,rp);continue;}
      if(r<0.08&&c-a>=1&&e-b>=1){fillT(a,b,c,e,TL.LOT);for(let y=b;y<=e;y++)for(let x=a;x<=c;x++)if(R()<0.5)PARKSPOTS.push({x:(x+0.5)*T,y:(y+0.5)*T,a:R()<0.5?Math.PI/2:-Math.PI/2});}
      else if(r<0.14&&d!=='down'){fillT(a,b,c,e,TL.GRASS);TREES.push({x:(a+c+1)/2*T,y:(b+e+1)/2*T,r:22+R()*12,palm:d==='beach'});}
      else{let bx1=c,by1=e;
        if(c-a>=2&&R()<0.3){bx1=c-1;fillT(c,b,c,e,TL.CONC);}
        if(e-b>=2&&R()<0.3){by1=e-1;fillT(a,e,c,e,TL.CONC);}
        const ht=d==='down'?2.6+R()*4.4:d==='beach'?1.6+R()*3:d==='harb'?1+R()*0.9:d==='strip'?1.8+R()*3.2:1+R()*1.3;
        addBld(a,b,bx1,by1,ht,rp(PAL[d]),Object.assign({ac:R()<0.5},d==='strip'&&R()<0.5?{neon:rp(['#ff4fd8','#5fe0d0','#ffd23f','#7aa2ff'])}:{}));}
    }
    if(sx){SOFF+=BUILDINGS.length-sx[0]-1;BUILDINGS.length=sx[0];TREES.length=sx[1];PARKSPOTS.length=sx[2];for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)BMAP[y*MW+x]=-1;sprayBlock(x0,y0,x1,y1);}
  }
  fillT(156,78,161,83,TL.SAND);for(const [ax,ay] of [[156,78],[161,78],[156,83],[161,83]])tset(ax,ay,0);addBld(158,80,159,81,5.2,'#f1f1ee',{lh:1});POI.lh={x:159*T,y:81*T};
  fillT(20,160,26,163,TL.SAND);for(const [ax,ay] of [[20,160],[26,160],[20,163],[26,163]])tset(ax,ay,0);DECOR.push({t:'wreck',x:23*T,y:161.3*T});
  POI.vendors=[{x:POI.hosp.x-200,y:POI.hosp.y},{x:POI.club.x+210,y:POI.club.y},{x:82.5*T,y:27.5*T},{x:110.5*T,y:88*T},{x:POI.office.x-250,y:POI.office.y}];for(const v of POI.vendors)DECOR.push({t:'stand',x:v.x,y:v.y});
  // greenery outside the grid
  for(let k=0;k<1200;k++){const x=Math.floor(R()*256),y=Math.floor(R()*MH);const t=tget(x,y);
    if(t===TL.GRASS&&(x<9||y<9||(x>106&&x<122)||(x>=168&&(x<175||x>219||y<9||y>138))))TREES.push({x:(x+R())*T,y:(y+R())*T,r:18+R()*14});
    else if(t===TL.SAND&&((x>=108&&x<=113)||(x>=223&&x<=227))&&y<136&&R()<0.6)TREES.push({x:(x+R())*T,y:(y+R())*T,r:22+R()*8,palm:1});}
  for(let k=0;k<26;k++){const y=12+R()*120,x=109+R()*4;if(tget(Math.floor(x),Math.floor(y))===TL.SAND)DECOR.push({t:'umb',x:x*T,y:y*T,c:rp(['#e74c3c','#3498db','#f1c40f','#1abc9c','#ffffff'])});}
  for(let y=0;y<MH;y++)for(let x=0;x<256;x++)TSH[y*MW+x]=R();{const R9=mulberry32(4411);for(let y=0;y<MH;y++)for(let x=256;x<MW;x++)TSH[y*MW+x]=R9();}
  // points of interest
  POI.start={x:31*T,y:141.5*T};
  POI.stinger={x:109.5*T,y:58*T,a:Math.PI/2};
  POI.speedboat={x:73.7*T,y:150*T,a:Math.PI/2};
  POI.tidedock={x:61.7*T,y:147.5*T};
  POI.crates=[{x:122*T,y:120*T},{x:138*T,y:92*T},{x:125*T,y:57*T,alarm:2}];
  POI.aurum={x:8*T,y:30*T,a:Math.PI/2};
  POI.boats=[{x:31.7*T,y:150*T,a:Math.PI/2},{x:121*T,y:70*T,a:0},{x:97.7*T,y:151*T,a:-Math.PI/2},{x:121.5*T,y:31*T,a:Math.PI}];genEast(R,rp);
  const conc=[];for(let y=12;y<130;y++)for(let x=12;x<104;x++)if(tget(x,y)===TL.CONC&&tget(x,y-1)!==TL.ROAD)conc.push([x,y]);
  const cpick=()=>{const c=conc[Math.floor(R()*conc.length)];return{x:(c[0]+0.5)*T,y:(c[1]+0.5)*T};};
  [POI.parkTok,{x:142.6*T,y:120.6*T},{x:148*T,y:34.5*T},{x:95.5*T,y:155.3*T},{x:8.5*T,y:8.5*T},{x:10.5*T,y:142.5*T},
   {x:111*T,y:140.5*T},cpick(),{x:100.5*T,y:6.5*T},{x:15.5*T,y:155.3*T},{x:120.5*T,y:33.5*T},cpick()].forEach((p,i)=>TOKENS.push({id:i,x:p.x,y:p.y}));
  WPICKS.push({type:'pistol',x:POI.safe.x+90,y:POI.safe.y},{type:'smg',x:60.5*T,y:141.5*T},{type:'health',x:POI.hosp.x+80,y:POI.hosp.y},
    {type:'health',x:110*T,y:96*T},{type:'smg',x:140*T,y:36*T},{type:'pistol',x:63*T,y:66*T},{type:'health',x:23.5*T,y:142*T},{type:'smg',x:30*T,y:20.5*T},{type:'shotgun',x:90.5*T,y:141.6*T},{type:'rifle',x:148*T,y:47.5*T},{type:'rocket',x:151*T,y:31*T},{type:'grenade',x:142*T,y:121*T},{type:'flame',x:100.5*T,y:8.5*T},
    {type:'armor',x:POI.cops.x-90,y:POI.cops.y},{type:'armor',x:112*T,y:120*T},{type:'bribe',x:8.5*T,y:100*T},{type:'bribe',x:111*T,y:30*T},{type:'bribe',x:55.5*T,y:9.4*T});
  const ct=POI.court;WPICKS.push({type:'rocket',x:ct.x-70,y:ct.y+40},{type:'armor',x:ct.x+70,y:ct.y+40},{type:'cash',x:ct.x,y:ct.y-50,amt:800,once:'court'},{type:'chest',x:25.3*T,y:162.5*T,once:'wreck'},{type:'cash',x:157.5*T,y:79.5*T,amt:500,once:'lh'});
  TOKENS.push({id:TOKENS.length,x:ct.x,y:ct.y+60},{id:TOKENS.length+1,x:157.4*T,y:82.6*T});
  genCity2();genProps();genProps2();genFun();genStunts();genLadders();
}
function sprayBlock(x0,y0,x1,y1){fillT(x0,y0,x1,y0+2,TL.CONC);addBld(x0,y0+3,x1,y1,1.4,'#8e5ea2',{logo:'✦',logoC:'#f9e79f'});const sp={x:(x0+x1+1)/2*T,y:(y0+1.5)*T};SPRAYS.push(sp);return sp;}
function splitLots(x0,y0,x1,y1,dep,out,R){const w=x1-x0+1,h=y1-y0+1;
  if((w<=5&&h<=5)||(dep>=3&&R()<0.4)){out.push([x0,y0,x1,y1]);return;}
  if(w>=h&&w>=5){const s=x0+2+Math.floor(R()*(w-3));splitLots(x0,y0,s-1,y1,dep+1,out,R);splitLots(s,y0,x1,y1,dep+1,out,R);}
  else if(h>=5){const s=y0+2+Math.floor(R()*(h-3));splitLots(x0,y0,x1,s-1,dep+1,out,R);splitLots(x0,s,x1,y1,dep+1,out,R);}
  else out.push([x0,y0,x1,y1]);}

let MINIMG=null;
function buildMinimap(){const c=document.createElement('canvas');c.width=MW*2;c.height=MH*2;const g=c.getContext('2d');
  const col={0:'#1d4f75',1:'#c9b57c',2:'#3f7432',3:'#58595e',4:'#8f8c86',5:'#26262b',6:'#7a5d3c',7:'#6f6d68',8:'#999',9:'#4a4b50',10:'#6a6b72'};
  for(let y=0;y<MH;y++)for(let x=0;x<MW;x++){g.fillStyle=col[MAP[y*MW+x]];g.fillRect(x*2,y*2,2,2);}
  MINIMG=c;}
