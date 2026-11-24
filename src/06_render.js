const CV=document.getElementById('cv'),g=CV.getContext('2d');
const LC=document.createElement('canvas'),lg=LC.getContext('2d');
const CAMZ=1150,CH=8,CHPX=CH*T;const CHUNKS=new Map();
const TC={0:'#1c5d86',1:'#dcc68e',2:'#4c8a3b',3:'#3b3c40',4:'#a39f97',5:'#2a2a2e',6:'#8b6b45',7:'#85837d',8:'#7a7a72',9:'#47484c',10:'#4b4c52'};
function mkGlow(r,gr2,b,sz){const c=document.createElement('canvas');c.width=c.height=sz;const q=c.getContext('2d'),gr=q.createRadialGradient(sz/2,sz/2,0,sz/2,sz/2,sz/2);
  gr.addColorStop(0,`rgba(${r},${gr2},${b},1)`);gr.addColorStop(0.35,`rgba(${r},${gr2},${b},0.45)`);gr.addColorStop(1,`rgba(${r},${gr2},${b},0)`);q.fillStyle=gr;q.fillRect(0,0,sz,sz);return c;}
function mkCone(){const c=document.createElement('canvas');c.width=256;c.height=192;const q=c.getContext('2d');
  for(const [a,al] of [[0.52,0.22],[0.4,0.3],[0.27,0.45]]){const gr=q.createRadialGradient(0,96,0,0,96,256);gr.addColorStop(0,`rgba(255,240,205,${al})`);gr.addColorStop(1,'rgba(255,240,205,0)');
    q.fillStyle=gr;q.beginPath();q.moveTo(0,96);q.arc(0,96,256,-a,a);q.closePath();q.fill();}return c;}
function mkCloud(){const c=document.createElement('canvas');c.width=c.height=128;const q=c.getContext('2d'),gr=q.createRadialGradient(64,64,8,64,64,64);
  gr.addColorStop(0,'rgba(0,5,20,1)');gr.addColorStop(0.6,'rgba(0,5,20,0.6)');gr.addColorStop(1,'rgba(0,5,20,0)');q.fillStyle=gr;q.fillRect(0,0,128,128);return c;}
const GL={warm:mkGlow(255,214,150,128),white:mkGlow(255,255,255,96),red:mkGlow(255,40,30,64),blue:mkGlow(50,90,255,64),green:mkGlow(60,255,110,64),amber:mkGlow(255,190,40,64),pink:mkGlow(255,80,216,128),fire:mkGlow(255,150,50,64),cyan:mkGlow(120,220,255,64),cone:mkCone(),cloud:mkCloud()};
const VIG=(()=>{const c=document.createElement('canvas');c.width=c.height=128;const q=c.getContext('2d'),gr=q.createRadialGradient(64,64,38,64,64,92);gr.addColorStop(0,'rgba(0,0,14,0)');gr.addColorStop(1,'rgba(0,0,14,0.62)');q.fillStyle=gr;q.fillRect(0,0,128,128);return c;})();
const SHOPC=['255,196,120','130,225,255','255,125,205'];
function shopOf(b){return b.ht>1.5&&!b.cont&&!b.hangar&&!b.army&&!b.lh&&!b.court&&(b.seed&7)<4?1+(b.seed>>>3)%3:0;}
function glow(q,sp,x,y,r,a){if(a<=0.01)return;q.globalAlpha=Math.min(1,a);q.drawImage(sp,x-r,y-r,r*2,r*2);}

function getChunk(cx,cy){const k=cx+','+cy;let c=CHUNKS.get(k);if(c){CHUNKS.delete(k);CHUNKS.set(k,c);return c;}
  c=document.createElement('canvas');c.width=CHPX;c.height=CHPX;const q=c.getContext('2d');
  for(let ty=0;ty<CH;ty++)for(let tx=0;tx<CH;tx++)drawTile(q,cx*CH+tx,cy*CH+ty,tx*T,ty*T);
  CHUNKS.set(k,c);if(CHUNKS.size>60)CHUNKS.delete(CHUNKS.keys().next().value);return c;}
function cornerCut(q,px,py,x,y,r,ok,col,foam){const cs=[[0,0,-1,-1],[T,0,1,-1],[T,T,1,1],[0,T,-1,1]];
  for(const [ox,oy,dx,dy] of cs){const a=tget(x+dx,y),b=tget(x,y+dy);if(!ok(a)||!ok(b))continue;const cx=px+ox,cy=py+oy;
    q.fillStyle=col(a);q.beginPath();q.moveTo(cx,cy);q.lineTo(cx-dx*r,cy);q.arcTo(cx,cy,cx,cy-dy*r,r);q.closePath();q.fill();
    if(foam){q.strokeStyle='rgba(225,242,255,0.5)';q.lineWidth=3;q.beginPath();q.moveTo(cx-dx*r,cy);q.arcTo(cx,cy,cx,cy-dy*r,r);q.stroke();}}}
function drawTile(q,x,y,px,py){const t=tget(x,y),sh=TSH[y*MW+x]||0;q.fillStyle=TC[t];q.fillRect(px,py,T,T);
  const soft=v=>v===TL.SAND||v===TL.GRASS;
  switch(t){
  case TL.WATER:{q.fillStyle='rgba(255,255,255,0.05)';if(sh>0.5)q.fillRect(px+sh*40,py+sh*30,14,2);
    q.fillStyle='rgba(220,240,255,0.33)';
    if(tget(x,y-1)!==0)q.fillRect(px,py,T,4);if(tget(x,y+1)!==0)q.fillRect(px,py+T-4,T,4);
    if(tget(x-1,y)!==0)q.fillRect(px,py,4,T);if(tget(x+1,y)!==0)q.fillRect(px+T-4,py,4,T);
    cornerCut(q,px,py,x,y,26,soft,a=>TC[a],true);break;}
  case TL.SAND:{const shore=tget(x+1,y)===0||tget(x-1,y)===0||tget(x,y+1)===0||tget(x,y-1)===0;
    if(shore){q.fillStyle='rgba(150,118,66,0.22)';q.fillRect(px,py,T,T);}
    q.fillStyle='rgba(120,90,40,0.13)';for(let k=0;k<7;k++)q.fillRect(px+((sh*997*(k+1))%60),py+((sh*631*(k+3))%60),2,2);
    q.fillStyle='rgba(255,250,225,0.12)';for(let k=0;k<3;k++)q.fillRect(px+((sh*557*(k+2))%56),py+((sh*211*(k+5))%56),6,2);
    cornerCut(q,px,py,x,y,26,v=>v===0,()=>TC[0],true);break;}
  case TL.GRASS:q.fillStyle=sh>0.5?'rgba(255,255,255,0.04)':'rgba(0,0,0,0.05)';q.fillRect(px,py,T,T);
    q.fillStyle='rgba(30,70,20,0.33)';for(let k=0;k<6;k++)q.fillRect(px+((sh*733*(k+1))%58),py+((sh*419*(k+2))%58),3,2);
    q.fillStyle='rgba(150,200,90,0.2)';for(let k=0;k<4;k++)q.fillRect(px+((sh*311*(k+3))%58),py+((sh*173*(k+4))%58),2,3);
    cornerCut(q,px,py,x,y,26,v=>v===0,()=>TC[0],true);break;
  case TL.ROAD:{const v=isVR(x),h=isHR(y);
    q.fillStyle='rgba(255,255,255,0.035)';for(let k=0;k<5;k++)q.fillRect(px+((sh*877*(k+1))%60),py+((sh*349*(k+2))%60),3,2);
    q.fillStyle='rgba(0,0,0,0.1)';for(let k=0;k<4;k++)q.fillRect(px+((sh*491*(k+2))%58),py+((sh*263*(k+1))%58),4,3);
    if(sh>0.93){q.fillStyle='#2c2d31';q.beginPath();q.arc(px+32,py+32,9,0,TAU);q.fill();q.strokeStyle='rgba(255,255,255,0.08)';q.lineWidth=1.5;q.stroke();}
    if(v&&!h){if(XS.includes(x)){q.fillStyle='#d8c25a';q.fillRect(px+T-2,py+6,4,22);q.fillRect(px+T-2,py+38,4,22);}
      const up=isHR(y-1),dn=isHR(y+1);if(up||dn){q.fillStyle='rgba(240,240,240,0.78)';for(let k=0;k<6;k++)q.fillRect(px+3+k*10.5,up?py+4:py+T-24,6,20);}}
    else if(h&&!v){if(YS.includes(y)){q.fillStyle='#d8c25a';q.fillRect(px+6,py+T-2,22,4);q.fillRect(px+38,py+T-2,22,4);}
      const lf=isVR(x-1),rt=isVR(x+1);if(lf||rt){q.fillStyle='rgba(240,240,240,0.78)';for(let k=0;k<6;k++)q.fillRect(lf?px+4:px+T-24,py+3+k*10.5,20,6);}}
    break;}
  case TL.WALK:q.strokeStyle='rgba(0,0,0,0.09)';q.lineWidth=1;q.strokeRect(px+0.5,py+0.5,32,32);q.strokeRect(px+32.5,py+32.5,31,31);
    if(sh>0.85){q.fillStyle='rgba(0,0,0,0.07)';q.fillRect(px+sh*30,py+10,12,9);}
    q.fillStyle='#6f6c66';if(tget(x,y-1)===TL.ROAD)q.fillRect(px,py,T,4);if(tget(x,y+1)===TL.ROAD)q.fillRect(px,py+T-4,T,4);
    if(tget(x-1,y)===TL.ROAD)q.fillRect(px,py,4,T);if(tget(x+1,y)===TL.ROAD)q.fillRect(px+T-4,py,4,T);
    cornerCut(q,px,py,x,y,26,v=>v===0,()=>TC[0],false);break;
  case TL.CONC:q.fillStyle='rgba(0,0,0,0.06)';q.fillRect(px,py,T,1);q.fillRect(px,py,1,T);if(sh>0.8){q.fillStyle='rgba(0,0,0,0.1)';q.fillRect(px+20,py+24,18,10);}break;
  case TL.LOT:q.fillStyle='rgba(240,240,240,0.7)';q.fillRect(px,py+8,2,T-16);q.fillRect(px+T-2,py+8,2,T-16);break;
  case TL.DOCK:q.fillStyle='rgba(0,0,0,0.22)';for(let k=8;k<T;k+=11)q.fillRect(px,py+k,T,2);q.fillStyle='#5a4228';q.fillRect(px+2,py+2,6,6);q.fillRect(px+T-8,py+T-8,6,6);break;
  case TL.BRIDGE:{const top=YS.includes(y);q.fillStyle='rgba(255,255,255,0.03)';q.fillRect(px+8,py+20,30,3);q.fillStyle='#d8c25a';if(top){q.fillRect(px+6,py+T-2,22,4);q.fillRect(px+38,py+T-2,22,4);}
    q.fillStyle='#c9ccd0';q.fillRect(px,top?py:py+T-6,T,6);q.fillStyle='#8e9299';q.fillRect(px,top?py+6:py+T-9,T,3);if(x%5===0){q.fillStyle='#70747b';q.fillRect(px+22,top?py:py+T-12,20,12);}break;}
  case TL.FENCE:q.fillStyle='#5f5f58';q.fillRect(px,py,T,T);q.strokeStyle='#b8b8b0';q.lineWidth=2;q.beginPath();
    for(let k=-T;k<T;k+=12){q.moveTo(px+k,py);q.lineTo(px+k+T,py+T);q.moveTo(px+k+T,py);q.lineTo(px+k,py+T);}q.stroke();break;
  }}
function rrect(q,x,y,w,h,r){q.beginPath();q.moveTo(x+r,y);q.arcTo(x+w,y,x+w,y+h,r);q.arcTo(x+w,y+h,x,y+h,r);q.arcTo(x,y+h,x,y,r);q.arcTo(x,y,x+w,y,r);q.closePath();}
function projPt(x,y,h){const c=G.cam,f=CAMZ/(CAMZ-h);return[c.x+(x-c.x)*f,c.y+(y-c.y)*f];}
function eachSignal(inV,cb){for(let i=0;i<XS.length;i++){const X=XS[i]*T;for(let j=0;j<YS.length;j++){const Y=YS[j]*T;if(!inV(X+T,Y+T,140))continue;const st=lightState(i,j);
  if(validDir(i,j,2))cb(X-11,Y+2*T+11,0,st[0]);if(validDir(i,j,3))cb(X-11,Y-11,1,st[1]);if(validDir(i,j,0))cb(X+2*T+11,Y-11,2,st[0]);if(validDir(i,j,1))cb(X+2*T+11,Y+2*T+11,3,st[1]);}}}

function render(){const W=G.vw,H=G.vh,dpr=G.dpr,c=G.cam,s=c.s,d=ENV.dark,P=G.player,insB=P.inside?P.inside.b:null;
  let shx=0,shy=0;if(G.shake>0){shx=rr(-G.shake,G.shake);shy=rr(-G.shake,G.shake);}
  g.setTransform(1,0,0,1,0,0);g.globalCompositeOperation='source-over';g.globalAlpha=1;g.fillStyle='#1c5d86';g.fillRect(0,0,CV.width,CV.height);
  const setW=()=>g.setTransform(dpr*s,0,0,dpr*s,dpr*(W/2-c.x*s+shx),dpr*(H/2-c.y*s+shy));setW();
  const vx0=c.x-W/2/s-40,vy0=c.y-H/2/s-40,vx1=c.x+W/2/s+40,vy1=c.y+H/2/s+40;G.view=[vx0,vy0,vx1,vy1];
  const inV=(x,y,m)=>x>vx0-m&&x<vx1+m&&y>vy0-m&&y<vy1+m;
  g.imageSmoothingEnabled=true;
  for(let cy=Math.floor(vy0/CHPX);cy<=Math.floor(vy1/CHPX);cy++)for(let cx=Math.floor(vx0/CHPX);cx<=Math.floor(vx1/CHPX);cx++){
    if(cx<0||cy<0||cx*CH>=MW||cy*CH>=MH)continue;g.drawImage(getChunk(cx,cy),cx*CHPX,cy*CHPX,CHPX+0.5,CHPX+0.5);}
  g.fillStyle=`rgba(255,255,255,${0.13*(1-d*0.5)})`;const tt=G.time,wv=1+ENV.wind*1.5;
  for(let ty=Math.max(0,Math.floor(vy0/T));ty<=Math.min(MH-1,Math.floor(vy1/T));ty++)for(let tx=Math.max(0,Math.floor(vx0/T));tx<=Math.min(MW-1,Math.floor(vx1/T));tx++){
    if(MAP[ty*MW+tx]!==0)continue;const ph=Math.sin(tt*1.3*wv+tx*0.9+ty*1.7);g.fillRect(tx*T+20+ph*14,ty*T+22+((tx*7+ty*3)%30),16,2);if((tx+ty)%2)g.fillRect(tx*T+6-ph*10,ty*T+48-((tx*5+ty)%20),10,2);}
  if(ENV.wet>0.03){g.fillStyle=`rgba(8,18,40,${0.16*ENV.wet})`;g.fillRect(vx0,vy0,vx1-vx0,vy1-vy0);}
  if(ENV.wet>0.15){g.fillStyle=`rgba(14,30,58,${0.24*ENV.wet})`;for(let ty=Math.max(0,Math.floor(vy0/T));ty<=Math.min(MH-1,Math.floor(vy1/T));ty++)for(let tx=Math.max(0,Math.floor(vx0/T));tx<=Math.min(MW-1,Math.floor(vx1/T));tx++){
      const t=MAP[ty*MW+tx],sh=TSH[ty*MW+tx];if((t!==TL.ROAD&&t!==TL.WALK&&t!==TL.CONC)||sh<0.74)continue;g.beginPath();g.ellipse(tx*T+20+sh*20,ty*T+18+sh*26,13+sh*12,7+sh*7,sh*3,0,TAU);g.fill();}}
  for(const dc of G.decals){if(!inV(dc.x,dc.y,30))continue;
    if(dc.t==='blood'){g.fillStyle='rgba(120,10,10,0.75)';g.beginPath();g.arc(dc.x,dc.y,dc.r,0,TAU);g.fill();}
    else if(dc.t==='skid'){g.fillStyle='rgba(20,20,20,0.28)';g.fillRect(dc.x-3,dc.y-3,6,6);}
    else if(dc.t==='scorch'){g.fillStyle='rgba(15,15,15,0.5)';g.beginPath();g.arc(dc.x,dc.y,dc.r,0,TAU);g.fill();}}
  if(P.inside)drawInterior(P.inside);
  for(const dc of DECOR){if(!inV(dc.x,dc.y,dc.t==='runway'?5000:dc.t==='stadium'?520:120))continue;if(!drawDecor2(dc))drawDecor(dc);}
  // lamp posts + signals (bodies)
  const lamps=[];for(const l of LAMPS)if(inV(l.x,l.y,l.big?460:250)){lamps.push(l);g.strokeStyle='#2a2c30';g.lineWidth=4;g.beginPath();g.moveTo(l.x,l.y);g.lineTo(l.lx,l.ly);g.stroke();
    g.fillStyle='#1d1f22';g.beginPath();g.arc(l.x,l.y,5,0,TAU);g.fill();g.fillStyle=d>0.05?'#fff2c8':'#c9ccd0';g.beginPath();g.arc(l.lx,l.ly,5,0,TAU);g.fill();}
  const sigs=[];eachSignal(inV,(x,y,dir,st)=>{sigs.push([x,y,dir,st]);g.save();g.translate(x,y);g.rotate(dir*Math.PI/2);g.fillStyle='rgba(0,0,0,0.25)';rrect(g,-12,-3,28,11,3);g.fill();
    g.fillStyle='#14161a';rrect(g,-14,-6,28,12,3);g.fill();const cols=[['g','#1c5a2a','#41ff7a'],['y','#5a4a12','#ffc933'],['r','#5a1616','#ff3b30']];
    for(let k=0;k<3;k++){g.fillStyle=cols[k][0]===st?cols[k][2]:cols[k][1];g.beginPath();g.arc(-8+k*8,0,3.3,0,TAU);g.fill();}g.restore();});
  for(const l of LADS)if(inV(l.gx,l.gy,30)){const pu=(Math.sin(tt*5)+1)/2,nr=G.nearLad===l;g.fillStyle=`rgba(255,210,63,${0.22+pu*0.2})`;g.beginPath();g.arc(l.gx,l.gy,nr?27:20+pu*4,0,TAU);g.fill();g.strokeStyle='#ffd23f';g.lineWidth=3;g.stroke();
    g.save();g.translate(l.gx,l.gy);g.rotate(Math.atan2(l.ry-l.gy,l.rx-l.gx)+Math.PI/2);g.strokeStyle='#1b1d22';g.lineWidth=3;g.beginPath();g.moveTo(-5,-10);g.lineTo(-5,10);g.moveTo(5,-10);g.lineTo(5,10);for(let k=-7;k<=7;k+=4.6){g.moveTo(-5,k);g.lineTo(5,k);}g.stroke();g.restore();}
  drawCityGround(inV);drawProps(inV);drawLife(inV);gpsWorld();
  drawMarkers(inV);
  for(const p of G.pickups){if(p.taken||p.h||!inV(p.x,p.y,30))continue;drawPickup(p);}
  for(const p of G.peds)if(p.dead&&!p.veh&&inV(p.x,p.y,30))drawPed(p);
  for(const p of G.peds)if(!p.dead&&!p.veh&&inV(p.x,p.y,30))drawPed(p);
  if(!P.veh&&G.state!=='title'&&!P.roof&&!P.climb&&!(P.ride&&P.ride.tr))drawPlayer();
  for(const v of G.vehicles){v.onScreen=inV(v.x,v.y,-20);if(inV(v.x,v.y,80)&&!(v.alt>0.25))drawVeh(v);}
  const bl=[];for(const b of BUILDINGS){const x0=b.x*T,y0=b.y*T,x1=x0+b.w*T,y1=y0+b.h*T;if(x1<vx0-380||x0>vx1+380||y1<vy0-380||y0>vy1+380)continue;
    b._d=hyp((x0+x1)/2-c.x,(y0+y1)/2-c.y);bl.push(b);}
  const su=ENV.sun;
  g.strokeStyle='rgba(0,0,0,0.2)';g.lineWidth=8;for(const b of bl)g.strokeRect(b.x*T,b.y*T,b.w*T,b.h*T);
  if(su.a>0.02){g.fillStyle=`rgba(0,4,18,${su.a})`;g.beginPath();
    for(const b of bl){if(b===insB)continue;const h=b.ht*50,ox=su.ox*h*0.9,oy=su.oy*h*0.9,x0=b.x*T,y0=b.y*T,x1=x0+b.w*T,y1=y0+b.h*T;
      const xn=ox>=0?x0:x1,xf=ox>=0?x1:x0,yn=oy>=0?y0:y1,yf=oy>=0?y1:y0;
      g.moveTo(xn,yn);g.lineTo(xf,yn);g.lineTo(xf+ox,yn+oy);g.lineTo(xf+ox,yf+oy);g.lineTo(xn+ox,yf+oy);g.lineTo(xn,yf);g.closePath();}
    g.fill();}
  for(const p of G.parts){if(p.type==='fire'||p.type==='spark'||p.type==='flash'||!inV(p.x,p.y,30))continue;const a=p.life/p.max;
    switch(p.type){case'smoke':g.fillStyle=`rgba(60,60,60,${a*0.45})`;break;case'blood':g.fillStyle=`rgba(150,0,0,${a})`;break;
      case'splash':g.fillStyle=`rgba(230,245,255,${a*0.8})`;break;case'wake':g.fillStyle=`rgba(240,250,255,${a*0.35})`;break;case'steam':g.fillStyle=`rgba(232,236,240,${a*0.26})`;break;case'water':g.fillStyle=`rgba(150,210,255,${a*0.8})`;break;case'gas':g.fillStyle=`rgba(140,190,60,${a*0.38})`;break;case'dust':g.fillStyle=`rgba(160,136,98,${a*0.4})`;break;default:g.fillStyle='#fff';}
    g.beginPath();g.arc(p.x,p.y,p.size,0,TAU);g.fill();}
  const sway=ENV.wind*5;
  for(const t of TREES){if(!inV(t.x,t.y,90))continue;let [rx,ry]=projPt(t.x,t.y,t.palm?90:70);rx+=Math.sin(tt*1.7+t.x*0.01)*sway;ry+=Math.cos(tt*1.3+t.y*0.01)*sway*0.5;
    if(su.a>0.02){g.fillStyle=`rgba(0,4,18,${su.a})`;g.beginPath();g.ellipse(t.x+su.ox*40,t.y+su.oy*40,t.r*0.95,t.r*0.8,0,0,TAU);g.fill();}
    g.strokeStyle='#5a3d22';g.lineWidth=5;g.beginPath();g.moveTo(t.x,t.y);g.lineTo(rx,ry);g.stroke();
    if(t.palm){for(let k=0;k<7;k++){const a=k*TAU/7+t.x*0.01+Math.sin(tt*1.5+k)*0.04*sway;g.fillStyle=k%2?'#3f9a3a':'#358a33';g.beginPath();g.ellipse(rx+Math.cos(a)*t.r*0.55,ry+Math.sin(a)*t.r*0.55,t.r*0.62,t.r*0.19,a,0,TAU);g.fill();}
      g.fillStyle='#6b4f2a';g.beginPath();g.arc(rx,ry,5,0,TAU);g.fill();}
    else{g.fillStyle='#28602a';g.beginPath();g.arc(rx,ry,t.r,0,TAU);g.fill();g.fillStyle='#34772f';g.beginPath();g.arc(rx-t.r*0.18,ry-t.r*0.2,t.r*0.74,0,TAU);g.fill();
      g.fillStyle='#4a9438';g.beginPath();g.arc(rx-t.r*0.3,ry-t.r*0.34,t.r*0.4,0,TAU);g.fill();}}
  drawLighting(lamps,inV,bl);drawSirens();
  // ---- emissive pass ----
  setW();g.globalCompositeOperation='lighter';
  if(d>0.05)for(const l of lamps)glow(g,GL.warm,l.lx,l.ly,l.big?44:28,d);
  const wr=ENV.wet*d;if(wr>0.1){g.globalAlpha=wr*0.3;for(const l of lamps)g.drawImage(GL.warm,l.lx-20,l.ly-10,40,130);for(const sg of sigs)g.drawImage(sg[3]==='g'?GL.green:sg[3]==='y'?GL.amber:GL.red,sg[0]-9,sg[1],18,70);}
  if(d>0.1&&inV(POI.lh.x,POI.lh.y,900)){const q=projPt(POI.lh.x,POI.lh.y,260);g.save();g.translate(q[0],q[1]);g.rotate(tt*0.9);g.globalAlpha=d*0.4;g.drawImage(GL.cone,0,-120,760,240);g.restore();}
  if(G.heli&&inV(G.heli.x,G.heli.y,260))glow(g,GL.white,G.heli.x,G.heli.y,205,0.1+0.22*d);
  for(const sg of sigs){const k=sg[3]==='g'?0:sg[3]==='y'?1:2,ca=Math.cos(sg[2]*Math.PI/2),sa=Math.sin(sg[2]*Math.PI/2),o=-8+k*8;glow(g,k===0?GL.green:k===1?GL.amber:GL.red,sg[0]+ca*o,sg[1]+sa*o,13,0.5+0.5*d);}
  for(const v of G.vehicles){if(v.dead||v.sunk||!inV(v.x,v.y,90))continue;const t=v.t,ca=Math.cos(v.a),sa=Math.sin(v.a),Lh=t.l/2,Wh=t.w/2-5;
    if(v.driver&&!t.boat){if(d>0.05){if(!(v.hlB&2))glow(g,GL.white,v.x+ca*Lh-sa*Wh,v.y+sa*Lh+ca*Wh,13,d);if(!(v.hlB&1))glow(g,GL.white,v.x+ca*Lh+sa*Wh,v.y+sa*Lh-ca*Wh,13,d);}
      const br=v.thr<0&&v.speed>5,ta=br?0.9:d*0.55;if(!(v.tlB&2))glow(g,GL.red,v.x-ca*Lh-sa*Wh,v.y-sa*Lh+ca*Wh,br?13:9,ta);if(!(v.tlB&1))glow(g,GL.red,v.x-ca*Lh+sa*Wh,v.y-sa*Lh-ca*Wh,br?13:9,ta);}
    if(v.blink&&v.driver&&Math.floor(tt*2.6)%2){const s=v.blink,W2=t.w/2-2;glow(g,GL.amber,v.x+ca*Lh-sa*W2*s,v.y+sa*Lh+ca*W2*s,11,0.95);glow(g,GL.amber,v.x-ca*Lh-sa*W2*s,v.y-sa*Lh+ca*W2*s,11,0.95);}
    if(t.police&&v.ai&&v.ai.mode==='chase'){const on=Math.floor(tt*8)%2;glow(g,on?GL.red:GL.blue,v.x-sa*6*(on?1:-1),v.y+ca*6*(on?1:-1),34+d*14,0.9);}}
  g.globalAlpha=1;
  for(const p of G.parts){if(!(p.type==='fire'||p.type==='spark'||p.type==='flash')||!inV(p.x,p.y,30))continue;const a=p.life/p.max;
    g.fillStyle=p.type==='fire'?`rgba(255,${(110+a*120)|0},35,${a})`:p.type==='spark'?`rgba(255,230,120,${a})`:`rgba(255,240,170,${a})`;g.beginPath();g.arc(p.x,p.y,p.size,0,TAU);g.fill();}
  for(const b of G.bullets){if(b.kind==='flame')continue;if(b.kind==='nade'){g.fillStyle='#9fb07a';g.beginPath();g.arc(b.x,b.y,5,0,TAU);g.fill();continue;}
    g.strokeStyle=b.expl?'#ffb347':'#fff6c0';g.lineWidth=b.expl?5:2.5;g.beginPath();g.moveTo(b.x,b.y);g.lineTo(b.x-b.vx*0.02,b.y-b.vy*0.02);g.stroke();}
  g.globalCompositeOperation='source-over';g.globalAlpha=1;
  bl.sort((a,b)=>b._d-a._d);for(const b of bl)drawBld(b);
  drawTrack(inV);trainGlow();
  for(const p of G.pickups)if(p.h&&!p.taken&&inV(p.x,p.y,90)&&!(P.inside&&bAt(p.x,p.y)===P.inside.b)){const f=CAMZ/(CAMZ-p.h*50),q=projPt(p.x,p.y,p.h*50);g.save();g.translate(q[0],q[1]);g.scale(f,f);g.translate(-p.x,-p.y);drawPickup(p);g.restore();}
  if(!P.veh&&G.state!=='title'&&(P.roof||P.climb))drawPlayer();
  if(P.inside)drawInsideTop(P.inside,G.view);else drawPropTop();
  drawWheels(inV,d);for(const v of G.vehicles)if(v.alt>0.25&&inV(v.x,v.y,220))drawPlane(v);
  {const M=G.mission;if(M&&M.rings)for(const r of M.rings){if(r.h){const q=projPt(r.x,r.y,r.h*50),b=Math.sin(tt*5)*4;g.fillStyle='#ffe14d';g.strokeStyle='#000';g.lineWidth=2;g.beginPath();g.moveTo(q[0],q[1]-22+b);g.lineTo(q[0]+13,q[1]-6+b);g.lineTo(q[0],q[1]+10+b);g.lineTo(q[0]-13,q[1]-6+b);g.closePath();g.fill();g.stroke();}
      else if(r.r>=90){g.strokeStyle='rgba(255,225,77,0.9)';g.lineWidth=7;g.setLineDash([22,12]);g.lineDashOffset=-tt*30;g.beginPath();g.arc(r.x,r.y,r.r,0,TAU);g.stroke();g.setLineDash([]);}}}
  drawSky(inV,d);
  // cloud shadows
  const ca2=ENV.cloud*(1-d)*0.2;if(ca2>0.01){g.globalAlpha=ca2;const span=3400,ox=tt*(14+ENV.wind*40),oy=tt*(5+ENV.wind*10);
    for(let k=0;k<7;k++){const sz=900+((k*271)%600);const x=c.x-span/2+(((k*983+ox-c.x)%span)+span)%span,y=c.y-span/2+(((k*1571+oy-c.y)%span)+span)%span;g.drawImage(GL.cloud,x-sz/2,y-sz/2,sz,sz*0.75);}g.globalAlpha=1;}
  for(const p of G.peds)if(p.sayT>0&&!p.dead&&inV(p.x,p.y,20))bubble(p.x,p.y-30,p.say);
  {const P=G.player;if(P.sayT>0&&P.say&&!P.veh&&!P.inside&&!P.ride)bubble(P.x,P.y-32,P.say);}
  // ---- screen-space weather ----
  g.setTransform(dpr,0,0,dpr,0,0);
  const rn=P.inside?0:ENV.rain;if(rn>0.03){const n=(50+150*rn)|0,dx=-8-ENV.wind*26,dy=27;g.strokeStyle=`rgba(205,220,240,${0.22+0.25*rn})`;g.lineWidth=1.3;g.beginPath();
    for(let i=0;i<n;i++){const sp=950+((i*37)%420),y=((i*97.3+tt*sp)%(H+60))-30;let x=(i*193.7+tt*sp*dx/dy)%(W+90);x=(x+W+90)%(W+90)-45;g.moveTo(x,y);g.lineTo(x+dx*0.4,y+dy*0.4);}g.stroke();
    g.strokeStyle=`rgba(220,235,255,${0.32*rn})`;g.lineWidth=1;for(let i=0;i<26*rn;i++){const q=tt*1.7+i*0.37,ph=q%1,sd=Math.floor(q);g.beginPath();g.ellipse((i*311.7+sd*97.1)%W,(i*171.3+sd*53.7)%H,ph*10,ph*5.5,0,0,TAU);g.stroke();}}
  if(ENV.fog>0.02){g.fillStyle=`rgba(${lerp(196,58,d)|0},${lerp(206,68,d)|0},${lerp(216,92,d)|0},${0.36*ENV.fog})`;g.fillRect(0,0,W,H);}
  if(ENV.flash>0.02){g.fillStyle=`rgba(235,240,255,${ENV.flash*0.5})`;g.fillRect(0,0,W,H);}
  g.globalAlpha=0.5+0.35*d;g.drawImage(VIG,0,0,W,H);g.globalAlpha=1;
  drawTargetArrow();
  if(G.hurtFlash>0){g.setTransform(1,0,0,1,0,0);g.fillStyle=`rgba(200,0,0,${G.hurtFlash*0.35})`;g.fillRect(0,0,CV.width,CV.height);}}

function drawLighting(lamps,inV,bl){const d=ENV.dark,amb=ENV.amb,f=ENV.flash;if(amb[0]>251&&amb[1]>251&&amb[2]>251)return;
  const lw=Math.ceil(G.vw/3),lh=Math.ceil(G.vh/3);if(LC.width!==lw||LC.height!==lh){LC.width=lw;LC.height=lh;}
  const c=G.cam,s=c.s/3,P=G.player,tt=G.time;lg.setTransform(1,0,0,1,0,0);lg.globalCompositeOperation='source-over';lg.globalAlpha=1;
  lg.fillStyle=`rgb(${Math.min(255,amb[0]+f*190|0)},${Math.min(255,amb[1]+f*190|0)},${Math.min(255,amb[2]+f*190|0)})`;lg.fillRect(0,0,lw,lh);
  if(P.inside){const s2=P.inside;lg.setTransform(s,0,0,s,lw/2-c.x*s,lh/2-c.y*s);lg.fillStyle='#fff';lg.fillRect(s2.x-s2.W/2-5,Math.min(s2.wy-s2.out*s2.D,s2.wy)-5,s2.W+10,s2.D+10);lg.setTransform(1,0,0,1,0,0);}
  if(d>0.05){lg.setTransform(s,0,0,s,lw/2-c.x*s,lh/2-c.y*s);lg.globalCompositeOperation='lighter';
    for(const l of lamps)glow(lg,GL.warm,l.lx,l.ly,l.big?440:235,d*0.85);
    for(const v of G.vehicles){if(v.dead||v.sunk||!inV(v.x,v.y,420))continue;const ca=Math.cos(v.a),sa=Math.sin(v.a);
      if(v.driver&&!v.t.boat){lg.save();lg.translate(v.x+ca*v.t.l*0.45,v.y+sa*v.t.l*0.45);lg.rotate(v.a);lg.globalAlpha=d*0.95;lg.globalAlpha*=(v.hlB===3?0:v.hlB?0.55:1);lg.drawImage(GL.cone,0,-160,430,320);lg.restore();glow(lg,GL.warm,v.x,v.y,80,d*0.3);}
      else if(v.driver)glow(lg,GL.warm,v.x,v.y,120,d*0.5);
      if(v.t.police&&v.ai&&v.ai.mode==='chase')glow(lg,Math.floor(tt*8)%2?GL.red:GL.blue,v.x,v.y,230,d*0.8);
      if(v.burn>0)glow(lg,GL.fire,v.x,v.y,200,d);}
    if(!P.veh&&!P.dead)glow(lg,GL.warm,P.x,P.y,130,d*0.4);
    if(P.inside){const s2=P.inside;glow(lg,GL.white,s2.x,s2.wy-s2.out*s2.D/2,Math.max(s2.W,s2.D)*0.95,1);glow(lg,GL.white,s2.x,s2.wy-s2.out*s2.D/2,Math.max(s2.W,s2.D)*0.7,1);}
    let nf=0;for(const p of G.parts){if(p.type!=='fire'&&p.type!=='flash')continue;if(++nf>24)break;glow(lg,GL.fire,p.x,p.y,p.size*7,d*0.5*(p.life/p.max));}
    for(const p of G.pickups)if(!p.taken&&inV(p.x,p.y,60))glow(lg,GL.warm,p.x,p.y,55,d*0.6);
    const tg=curTarget();if(tg&&inV(tg.x,tg.y,120))glow(lg,GL.warm,tg.x,tg.y,110,d*0.6);
    for(const k of ['club','garage'])if(inV(POI[k].x,POI[k].y,400))glow(lg,GL.pink,POI[k].x,POI[k].y-60,380,d*0.7);
    for(const sp of SPRAYS)if(inV(sp.x,sp.y,260))glow(lg,GL.pink,sp.x,sp.y,230,d*0.7);for(const b of PROPS)if(inV(b.x,b.y,120))glow(lg,GL.warm,b.x,b.y,90,d*0.6);
    for(const k of ['safe','guns','office','tide','hosp','cops'])if(inV(POI[k].x,POI[k].y,200))glow(lg,GL.warm,POI[k].x,POI[k].y,170,d*0.6);
    for(const b of bl){const sp=shopOf(b);if(!sp)continue;const cx=(b.x+b.w/2)*T,spx=sp===1?GL.warm:sp===2?GL.cyan:GL.pink;glow(lg,spx,cx,(b.y+b.h)*T+30,150,d*0.42);glow(lg,spx,cx,b.y*T-30,150,d*0.42);}
    for(const s of SHOPS)if(inV(s.sx,s.sy,200))glow(lg,GL.warm,s.sx,s.sy,175,d*0.75);for(const gs of GAS)if(inV(gs.x,gs.y,300))glow(lg,GL.white,gs.x-52,gs.y,260,d*0.6);
    if(G.boom)glow(lg,GL.fire,G.boom.x,G.boom.y,560,G.boom.t);
    if(G.heli)glow(lg,GL.white,G.heli.x,G.heli.y,250,d);
    if(inV(POI.lh.x,POI.lh.y,1000)){lg.save();lg.translate(POI.lh.x,POI.lh.y);lg.rotate(tt*0.9);lg.globalAlpha=d*0.9;lg.drawImage(GL.cone,0,-200,950,400);lg.restore();}
    for(const dc of DECOR)if(dc.t==='stand'&&inV(dc.x,dc.y,150))glow(lg,GL.warm,dc.x,dc.y,130,d*0.7);
    lg.globalAlpha=1;}
  g.setTransform(1,0,0,1,0,0);g.globalCompositeOperation='multiply';g.drawImage(LC,0,0,CV.width,CV.height);g.globalCompositeOperation='source-over';}

function drawBld(b){const x0=b.x*T,y0=b.y*T,x1=x0+b.w*T,y1=y0+b.h*T,h=b.ht*50,c=G.cam,d=ENV.dark,na=d*0.62,late=ENV.clock<5.5&&ENV.clock>0.5;
  if(G.player.inside&&G.player.inside.b===b){g.strokeStyle='rgba(255,255,255,0.22)';g.lineWidth=2;g.setLineDash([8,6]);g.strokeRect(x0,y0,x1-x0,y1-y0);g.setLineDash([]);return;}
  const P=[[x0,y0],[x1,y0],[x1,y1],[x0,y1]],Q=P.map(p=>projPt(p[0],p[1],h));const N=[[0,-1],[1,0],[0,1],[-1,0]];
  const win=b.ht>1.5&&!b.cont&&!b.hangar,fl=Math.min(10,Math.floor(b.ht*1.7)),sp=shopOf(b);
  for(let i=0;i<4;i++){const a=P[i],e=P[(i+1)%4];const mx=(a[0]+e[0])/2-c.x,my=(a[1]+e[1])/2-c.y;if(N[i][0]*mx+N[i][1]*my>=0)continue;
    const qa=Q[i],qe=Q[(i+1)%4];const wall=()=>{g.beginPath();g.moveTo(a[0],a[1]);g.lineTo(e[0],e[1]);g.lineTo(qe[0],qe[1]);g.lineTo(qa[0],qa[1]);g.closePath();};
    const row=k=>{const tq=k/(fl+1);g.moveTo(lerp(a[0],qa[0],tq),lerp(a[1],qa[1],tq));g.lineTo(lerp(e[0],qe[0],tq),lerp(e[1],qe[1],tq));};
    g.fillStyle=i%2?b.s1:b.s2;wall();g.fill();
    if(win){g.setLineDash([7,8]);g.lineWidth=4;g.strokeStyle='rgba(16,26,44,0.55)';g.beginPath();for(let k=1;k<=fl;k++)row(k);g.stroke();g.setLineDash([]);}
    if(sp){g.lineWidth=7;g.strokeStyle='rgba(18,30,48,0.7)';g.beginPath();row(0.5);g.stroke();}
    if(na>0.02){g.fillStyle=`rgba(8,12,34,${na})`;wall();g.fill();
      if(win&&d>0.25){g.setLineDash([7,8]);g.lineWidth=4;g.strokeStyle=b.neon?`rgba(255,140,235,${d*0.85})`:`rgba(255,206,120,${d*0.8})`;g.beginPath();let any=0;
        for(let k=1;k<=fl;k++){const bits=(b.seed>>>((k*2+i)%28))&3;if(late?bits>0:bits>1)continue;row(k);any=1;}if(any)g.stroke();g.setLineDash([]);}
      if(sp&&d>0.2){g.lineWidth=7;g.strokeStyle=`rgba(${SHOPC[sp-1]},${d*0.9})`;g.beginPath();row(0.5);g.stroke();}}
    if(b.lads)for(const l of b.lads)if(l.side===i)drawLadder(l,h);
    if(b.shops)for(const s of b.shops)if(s.side===i)drawAwning(s,h);}
  const roofP=()=>{g.beginPath();g.moveTo(Q[0][0],Q[0][1]);for(let i=1;i<4;i++)g.lineTo(Q[i][0],Q[i][1]);g.closePath();};
  g.fillStyle=b.roof;roofP();g.fill();g.strokeStyle=b.rim;g.lineWidth=3;g.stroke();
  const rx=Q[0][0],ry=Q[0][1],rw=Q[1][0]-Q[0][0],rh=Q[3][1]-Q[0][1],rcx=rx+rw/2,rcy=ry+rh/2;
  if(b.cont){g.strokeStyle='rgba(0,0,0,0.25)';g.lineWidth=2;g.beginPath();for(let k=8;k<rw;k+=10){g.moveTo(rx+k,ry+3);g.lineTo(rx+k,ry+rh-3);}g.stroke();}
  else if(b.hangar){g.strokeStyle='rgba(0,0,0,0.25)';g.lineWidth=3;g.beginPath();for(let k=14;k<rh;k+=16){g.moveTo(rx+4,ry+k);g.lineTo(rx+rw-4,ry+k);}g.stroke();}
  else if(b.glass)drawGlassRoof(b,rx,ry,rw,rh);
  else if(b.house)drawHouseRoof(b,rx,ry,rw,rh);
  else{g.fillStyle='rgba(0,0,0,0.13)';g.fillRect(rx+8,ry+8,rw-16,rh-16);g.fillStyle=b.roof;g.fillRect(rx+12,ry+12,rw-24,rh-24);
    g.fillStyle='rgba(255,255,255,0.05)';g.fillRect(rx+12,ry+12,rw-24,(rh-24)*0.45);
    if(!b.logo&&!b.cross&&rw>84&&rh>84&&!roofFun(b,rx,ry,rw,rh,rcx,rcy,d)){const k=b.seed%5;
      if(k===0||k===4){g.fillStyle='rgba(0,0,0,0.2)';g.fillRect(rx+rw*0.2+3,ry+rh*0.25+3,24,17);g.fillStyle='#9aa0a6';g.fillRect(rx+rw*0.2,ry+rh*0.25,24,17);g.fillStyle='#63686e';g.beginPath();g.arc(rx+rw*0.2+12,ry+rh*0.25+8.5,5.5,0,TAU);g.fill();
        if(k===4){g.fillStyle='#9aa0a6';g.fillRect(rx+rw*0.6,ry+rh*0.62,24,17);g.fillStyle='#63686e';g.beginPath();g.arc(rx+rw*0.6+12,ry+rh*0.62+8.5,5.5,0,TAU);g.fill();}}
      else if(k===1){g.fillStyle='rgba(0,0,0,0.22)';g.beginPath();g.arc(rcx+5,rcy+5,17,0,TAU);g.fill();g.fillStyle='#8a6b4a';g.beginPath();g.arc(rcx,rcy,17,0,TAU);g.fill();g.strokeStyle='#5d452c';g.lineWidth=2;g.stroke();g.fillStyle='#a5845f';g.beginPath();g.arc(rcx-3,rcy-3,9,0,TAU);g.fill();}
      else if(k===2){for(let q=0;q<3;q++){g.fillStyle=d>0.4&&((b.seed>>q)&1)?'#ffe6a8':'#7fa6bd';g.fillRect(rx+rw*0.22+q*(rw*0.2),ry+rh*0.3,rw*0.14,rh*0.36);g.strokeStyle='rgba(0,0,0,0.3)';g.lineWidth=1.5;g.strokeRect(rx+rw*0.22+q*(rw*0.2),ry+rh*0.3,rw*0.14,rh*0.36);}}
      else{g.fillStyle='rgba(0,0,0,0.2)';g.fillRect(rx+rw*0.55+4,ry+rh*0.2+4,30,26);g.fillStyle=b.rim;g.fillRect(rx+rw*0.55,ry+rh*0.2,30,26);g.fillStyle=b.s1;g.fillRect(rx+rw*0.55+4,ry+rh*0.2+4,22,18);}}}
  if(na>0.02){g.fillStyle=`rgba(8,12,34,${na})`;roofP();g.fill();}
  if(b.neon){g.strokeStyle=b.neon;g.lineWidth=4;roofP();g.stroke();if(d>0.15){g.globalCompositeOperation='lighter';g.globalAlpha=d*0.55*(Math.sin(G.time*17+b.seed)>0.93?0.3:1);g.lineWidth=11;g.stroke();g.globalAlpha=1;g.globalCompositeOperation='source-over';}}
  if(b.ht>4.2){g.fillStyle='#22252a';g.fillRect(rx+rw-22,ry+14,5,5);if(d>0.2&&Math.floor(G.time*1.2+b.seed%7)%2){g.fillStyle='#ff3b30';g.beginPath();g.arc(rx+rw-19.5,ry+16.5,4.5,0,TAU);g.fill();}}
  if(b.lads)for(const l of b.lads){const q=projPt(l.rx,l.ry,h);g.fillStyle='rgba(0,0,0,0.35)';g.fillRect(q[0]-7,q[1]-7,14,14);g.fillStyle='#ffd23f';g.fillRect(q[0]-5,q[1]-5,10,10);}
  if(b.lh){g.fillStyle='#c0392b';g.beginPath();g.arc(rcx,rcy,rw*0.42,0,TAU);g.fill();g.fillStyle=d>0.1?'#fff6c8':'#dddddd';g.beginPath();g.arc(rcx,rcy,rw*0.2,0,TAU);g.fill();}
  if(b.cross){g.fillStyle='#e02424';g.fillRect(rcx-28,rcy-9,56,18);g.fillRect(rcx-9,rcy-28,18,56);}
  if(b.logo){g.fillStyle=b.logoC;g.font='bold '+(b.logo.length>2?30:40)+'px sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText(b.logo,rcx,rcy);}}

function drawDecor(dc){switch(dc.t){
  case'duck':{const bob=Math.sin(G.time*2)*3;g.fillStyle='rgba(0,0,0,0.2)';g.beginPath();g.ellipse(dc.x+4,dc.y+6,40,26,0,0,TAU);g.fill();
    g.fillStyle='#ffd31a';g.beginPath();g.ellipse(dc.x,dc.y+bob,40,26,0,0,TAU);g.fill();g.beginPath();g.arc(dc.x+30,dc.y-14+bob,17,0,TAU);g.fill();
    g.fillStyle='#ff8c1a';g.beginPath();g.ellipse(dc.x+50,dc.y-12+bob,10,5,0,0,TAU);g.fill();g.fillStyle='#111';g.beginPath();g.arc(dc.x+35,dc.y-19+bob,3,0,TAU);g.fill();break;}
  case'sign':g.fillStyle='#6b4f2a';g.fillRect(dc.x-3,dc.y,6,24);g.fillStyle='#f5e6c4';g.fillRect(dc.x-34,dc.y-22,68,26);g.fillStyle='#6b4f2a';g.font='bold 15px sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText('? ♥ ?',dc.x,dc.y-9);break;
  case'heli':g.strokeStyle='#f1c40f';g.lineWidth=6;g.beginPath();g.arc(dc.x,dc.y,70,0,TAU);g.stroke();g.fillStyle='#f1c40f';g.font='bold 80px sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText('H',dc.x,dc.y+4);break;
  case'fountain':g.fillStyle='#bfc5c9';g.beginPath();g.arc(dc.x,dc.y,58,0,TAU);g.fill();g.fillStyle='#3a8fc4';g.beginPath();g.arc(dc.x,dc.y,48,0,TAU);g.fill();
    g.fillStyle='rgba(255,255,255,0.7)';for(let k=0;k<8;k++){const a=k*TAU/8+G.time;g.beginPath();g.arc(dc.x+Math.cos(a)*18,dc.y+Math.sin(a)*18,4,0,TAU);g.fill();}g.fillStyle='#d6dadd';g.beginPath();g.arc(dc.x,dc.y,10,0,TAU);g.fill();break;
  case'stand':g.fillStyle='rgba(0,0,0,0.22)';g.fillRect(dc.x-16,dc.y-8,40,26);g.fillStyle='#b9bec4';g.fillRect(dc.x-20,dc.y-12,40,24);g.fillStyle='#8a2d22';g.fillRect(dc.x-20,dc.y-12,40,5);
    for(let k=0;k<8;k++){g.fillStyle=k%2?'#ffffff':'#e74c3c';g.beginPath();g.moveTo(dc.x-28,dc.y-4);g.arc(dc.x-28,dc.y-4,22,k*TAU/8,(k+1)*TAU/8);g.fill();}break;
  case'wreck':g.save();g.translate(dc.x,dc.y);g.rotate(0.5);g.fillStyle='#4a3524';g.beginPath();g.moveTo(90,0);g.quadraticCurveTo(40,-34,-70,-26);g.lineTo(-80,22);g.quadraticCurveTo(30,34,90,0);g.fill();g.fillStyle='#2f2217';g.fillRect(-50,-14,90,26);g.fillStyle='#5d4630';g.fillRect(-10,-40,7,80);g.restore();break;
  case'pump':g.fillStyle='rgba(0,0,0,0.25)';g.fillRect(dc.x-9,dc.y-30,24,66);g.fillStyle='#c8ccd2';rrect(g,dc.x-13,dc.y-34,26,68,5);g.fill();g.fillStyle='#d94f3d';rrect(g,dc.x-9,dc.y-22,18,18,3);g.fill();rrect(g,dc.x-9,dc.y+4,18,18,3);g.fill();g.fillStyle='#1c1c1c';g.fillRect(dc.x-5,dc.y-18,10,6);g.fillRect(dc.x-5,dc.y+8,10,6);break;
  case'umb':g.fillStyle='rgba(0,0,0,0.18)';g.beginPath();g.arc(dc.x+5,dc.y+5,24,0,TAU);g.fill();g.fillStyle=dc.c;g.beginPath();g.arc(dc.x,dc.y,24,0,TAU);g.fill();
    g.fillStyle='rgba(255,255,255,0.55)';for(let k=0;k<4;k++){g.beginPath();g.moveTo(dc.x,dc.y);g.arc(dc.x,dc.y,24,k*TAU/4,k*TAU/4+0.6);g.fill();}g.fillStyle='#f4e3c1';g.fillRect(dc.x+20,dc.y-8,26,14);break;}}

function drawMarkers(inV){const pulse=(Math.sin(G.time*4)+1)/2;
  const ring=(x,y,col,r,ic)=>{if(!inV(x,y,60))return;g.globalAlpha=0.3+pulse*0.25;g.fillStyle=col;g.beginPath();g.arc(x,y,r+pulse*6,0,TAU);g.fill();g.globalAlpha=1;
    g.strokeStyle=col;g.lineWidth=4;g.setLineDash([10,6]);g.lineDashOffset=-G.time*18;g.beginPath();g.arc(x,y,r,0,TAU);g.stroke();g.setLineDash([]);
    if(ic){g.fillStyle='#111';g.font='bold 24px sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText(ic,x,y+1);}};
  const M=G.mission;
  if(!M){const nm=nextMission();if(nm)ring(nm.start.x,nm.start.y,nm.col,26,nm.ic);if(G.fare)ring(G.fare.x,G.fare.y,'#ffe14d',50,'');for(const sm of sideAvail())ring(sm.start.x,sm.start.y,'#b07cff',24,'?');}
  else if(M.target&&M.target.r){ring(M.target.x,M.target.y,'#ffe14d',Math.min(M.target.r,60),'');}
  if(M&&M.rings)for(const r of M.rings)if(!r.h&&r.r<90)ring(r.x,r.y,r.c,r.r,'');
  if(G.way)ring(G.way.x,G.way.y,'#ff3b3b',30,'');
  const pv=G.player.veh,dm=pv&&!pv.t.boat&&!pv.t.plane&&(pv.hp<pv.t.hp-1||pv.dents||pv.holes);if(G.wanted>0||dm)for(const sp of SPRAYS)ring(sp.x,sp.y,'#c070ff',30,'✦');}
const PKC={health:['#e74c3c','+'],armor:['#3d7bd9','▲'],bribe:['#f1c40f','★'],pistol:['#95a5a6','P'],smg:['#5d6d7e','M'],shotgun:['#8d6e63','S'],rifle:['#4e5d3a','R'],flame:['#e67e22','F'],rocket:['#7b4bb3','K'],grenade:['#5f7a3a','G'],cash:['#2ecc71','$'],chest:['#c98a2b','♦'],token:['#ffd700','★']};
function drawPickup(p){const bob=Math.sin(G.time*3+p.t)*3;g.save();g.translate(p.x,p.y+bob);
  if(p.type==='crate'){g.fillStyle='rgba(255,255,255,0.25)';g.beginPath();g.arc(0,0,26+Math.sin(G.time*4)*4,0,TAU);g.fill();g.fillStyle='#8a5a2b';g.fillRect(-14,-14,28,28);g.strokeStyle='#4a2f14';g.lineWidth=3;g.strokeRect(-14,-14,28,28);g.beginPath();g.moveTo(-14,-14);g.lineTo(14,14);g.stroke();g.restore();return;}
  const pc=PKC[p.type]||['#fff','?'];g.fillStyle='rgba(0,0,0,0.25)';g.beginPath();g.arc(3,4,13,0,TAU);g.fill();
  const gr=g.createRadialGradient(-4,-4,2,0,0,13);gr.addColorStop(0,shade(pc[0],0.45));gr.addColorStop(1,pc[0]);g.fillStyle=gr;g.beginPath();g.arc(0,0,13,0,TAU);g.fill();g.strokeStyle='rgba(255,255,255,0.9)';g.lineWidth=2;g.stroke();
  g.fillStyle='#fff';g.font='bold 15px sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText(pc[1],0,1);g.restore();}

const VSPR=new Map(),VPAD=8;
function vehSprite(v){const key=v.type+'|'+(v.dead?'x':v.col);let c=VSPR.get(key);if(c)return c;const t=v.t,S=2;c=document.createElement('canvas');c.width=(t.l+VPAD*2)*S;c.height=(t.w+VPAD*2)*S;
  const q=c.getContext('2d');q.scale(S,S);q.translate(t.l/2+VPAD,t.w/2+VPAD);paintVeh(q,t,v.dead?'#2b2b2b':v.col,v.dead);VSPR.set(key,c);if(VSPR.size>180)VSPR.delete(VSPR.keys().next().value);return c;}
function paintVeh(q,t,body,dead){const Lh=t.l/2,Wh=t.w/2,glass=dead?'#1a1a1a':'#15212d';
  const sheen=path=>{const gr=q.createLinearGradient(0,-Wh,0,Wh);gr.addColorStop(0,'rgba(0,0,0,.3)');gr.addColorStop(.22,'rgba(255,255,255,.1)');gr.addColorStop(.5,'rgba(255,255,255,.24)');gr.addColorStop(.78,'rgba(255,255,255,.04)');gr.addColorStop(1,'rgba(0,0,0,.34)');q.fillStyle=gr;path();q.fill();};
  if(t.boat){const hull=()=>{q.beginPath();q.moveTo(Lh,0);q.quadraticCurveTo(Lh*0.4,-Wh,-Lh*0.2,-Wh);q.lineTo(-Lh,-Wh+2);q.lineTo(-Lh,Wh-2);q.lineTo(-Lh*0.2,Wh);q.quadraticCurveTo(Lh*0.4,Wh,Lh,0);};
    q.fillStyle=body;hull();q.fill();sheen(hull);q.strokeStyle='rgba(0,0,0,.4)';q.lineWidth=1.5;hull();q.stroke();
    q.fillStyle=t.l>60?'#8e2f22':'#5d4037';rrect(q,-Lh+4,-Wh+5,t.l*0.48,t.w-10,3);q.fill();q.fillStyle=glass;q.fillRect(Lh*0.05,-Wh+5,7,t.w-10);q.fillStyle='#222';q.fillRect(-Lh-3,-5,6,10);return;}
  if(t.bike){const bp=()=>rrect(q,-Lh*0.55,-Wh+1,t.l*0.75,t.w-2,5);q.fillStyle=body;bp();q.fill();sheen(bp);
    q.fillStyle='#1b1b1b';q.fillRect(-Lh*0.4,-4,12,8);q.fillStyle='#bbb';q.fillRect(Lh*0.42,-10,3,20);return;}
  if(t.tank){q.fillStyle='#2e2e2a';q.fillRect(-Lh,-Wh,t.l,10);q.fillRect(-Lh,Wh-10,t.l,10);q.fillStyle='#474740';for(let k=-Lh;k<Lh;k+=8){q.fillRect(k,-Wh,3,10);q.fillRect(k,Wh-10,3,10);}
    const bp=()=>{q.beginPath();q.rect(-Lh+4,-Wh+9,t.l-8,t.w-18);};q.fillStyle=body;bp();q.fill();sheen(bp);q.fillStyle=shade(body,-0.25);q.fillRect(10,-4,52,8);
    q.fillStyle=shade(body,0.12);q.beginPath();q.arc(0,0,17,0,TAU);q.fill();q.strokeStyle='#2d3a18';q.lineWidth=2;q.stroke();q.fillStyle=shade(body,-0.2);q.beginPath();q.arc(-4,-5,5,0,TAU);q.fill();return;}
  const wx=Lh*0.6;
  const boxy=t.bus||t.van||t.army,nz=t.sport||t.rod?0.52:t.cart?0.2:0.38,rz=t.cart||t.buggy?0.2:0.3;
  const bodyP=()=>{if(boxy){q.beginPath();const f=t.bus?0.16:0.26;q.moveTo(-Lh+5,-Wh);q.lineTo(Lh-9,-Wh);q.bezierCurveTo(Lh-2,-Wh,Lh,-Wh*(1-f*0.4),Lh,-Wh*(1-f));q.lineTo(Lh,Wh*(1-f));q.bezierCurveTo(Lh,Wh*(1-f*0.4),Lh-2,Wh,Lh-9,Wh);q.lineTo(-Lh+5,Wh);q.quadraticCurveTo(-Lh,Wh,-Lh,Wh-5);q.lineTo(-Lh,-Wh+5);q.quadraticCurveTo(-Lh,-Wh,-Lh+5,-Wh);q.closePath();return;}
    q.beginPath();q.moveTo(-Lh+7,-Wh);q.quadraticCurveTo(0,-Wh-0.8,Lh*0.42,-Wh);q.bezierCurveTo(Lh*0.86,-Wh,Lh,-Wh*(1-nz*0.45),Lh,-Wh*(1-nz));q.quadraticCurveTo(Lh+1.6,0,Lh,Wh*(1-nz));q.bezierCurveTo(Lh,Wh*(1-nz*0.45),Lh*0.86,Wh,Lh*0.42,Wh);q.quadraticCurveTo(0,Wh+0.8,-Lh+7,Wh);
    q.bezierCurveTo(-Lh+1,Wh,-Lh,Wh*(1-rz*0.5),-Lh,Wh*(1-rz));q.lineTo(-Lh,-Wh*(1-rz));q.bezierCurveTo(-Lh,-Wh*(1-rz*0.5),-Lh+1,-Wh,-Lh+7,-Wh);q.closePath();};
  q.fillStyle=body;bodyP();q.fill();sheen(bodyP);q.strokeStyle='rgba(0,0,0,.45)';q.lineWidth=1.2;bodyP();q.stroke();
  {const fh=boxy?Wh-4:Wh*(1-nz)-1,bh=boxy?Wh-4:Wh*(1-rz)-1;q.fillStyle='rgba(0,0,0,.35)';q.fillRect(Lh-2.5,-fh,2.5,fh*2);q.fillRect(-Lh,-bh,2.5,bh*2);}q.fillStyle='rgba(0,0,0,.5)';for(const sx of[-1,1]){q.fillRect(sx*wx-8.5,-Wh,17,2.4);q.fillRect(sx*wx-8.5,Wh-2.4,17,2.4);}
  if(t.bus){q.fillStyle=glass;q.fillRect(Lh-13,-Wh+4,8,t.w-8);q.fillStyle='#a9d4ee';for(let k=-Lh+12;k<Lh-20;k+=16){q.fillRect(k,-Wh+2,11,4);q.fillRect(k,Wh-6,11,4);}
    q.fillStyle=shade(body,0.22);rrect(q,-Lh+8,-Wh+8,t.l-26,t.w-16,3);q.fill();q.fillStyle='rgba(0,0,0,.2)';q.fillRect(-Lh*0.3,-6,14,12);q.fillRect(Lh*0.25,-6,14,12);}
  else if(t.van||t.army){const fw=Lh*0.5;q.fillStyle=glass;q.beginPath();q.moveTo(fw+13,-Wh+4);q.lineTo(fw+13,Wh-4);q.lineTo(fw,Wh-5);q.lineTo(fw,-Wh+5);q.closePath();q.fill();
    q.fillStyle='rgba(255,255,255,.16)';q.fillRect(fw+3,-Wh+7,7,Wh-8);
    q.fillStyle=t.army?shade(body,-0.18):shade(body,0.12);rrect(q,-Lh+4,-Wh+4,fw+Lh-5,t.w-8,3);q.fill();
    if(t.army){q.strokeStyle='rgba(0,0,0,.25)';q.lineWidth=1.5;q.beginPath();for(let k=-Lh+12;k<fw-4;k+=11){q.moveTo(k,-Wh+5);q.lineTo(k,Wh-5);}q.stroke();}
    else if(body==='#f4d03f'){q.fillStyle='#c0392b';q.font='bold 16px sans-serif';q.textAlign='center';q.textBaseline='middle';q.save();q.rotate(Math.PI/2);q.fillText('QD',0,Lh*0.2);q.restore();}}
  else{const fw=Lh*0.24,rw=t.bed?-Lh*0.12:-Lh*0.5;q.fillStyle=shade(body,-0.2);q.fillRect(fw+5,-Wh-2.6,5,3);q.fillRect(fw+5,Wh-0.4,5,3);
    if(t.bed){q.fillStyle=shade(body,-0.38);rrect(q,-Lh+4,-Wh+4,t.l*0.4,t.w-8,2);q.fill();q.strokeStyle='rgba(0,0,0,.3)';q.lineWidth=1;q.beginPath();for(let k=-Lh+10;k<rw-8;k+=7){q.moveTo(k,-Wh+5);q.lineTo(k,Wh-5);}q.stroke();}
    q.fillStyle=glass;q.beginPath();q.moveTo(fw+11,-Wh+4.5);q.lineTo(fw+11,Wh-4.5);q.lineTo(rw-6,Wh-5.5);q.lineTo(rw-6,-Wh+5.5);q.closePath();q.fill();
    q.fillStyle=dead?'#333':shade(body,0.16);rrect(q,rw+1,-Wh+6,fw-rw,t.w-12,3);q.fill();
    q.fillStyle='rgba(255,255,255,.2)';q.beginPath();q.moveTo(fw+3,-Wh+7);q.lineTo(fw+9,-Wh+6);q.lineTo(fw+9,-1);q.lineTo(fw+3,-1);q.fill();
    q.strokeStyle='rgba(0,0,0,.18)';q.lineWidth=1;q.beginPath();q.moveTo(fw+13,-Wh+7);q.lineTo(Lh-4,-Wh+8);q.moveTo(fw+13,Wh-7);q.lineTo(Lh-4,Wh-8);q.stroke();
    if(t.taxi&&!dead){q.fillStyle='#1b1b1b';for(let k=-Lh+6;k<Lh-6;k+=8){q.fillRect(k,-Wh+1.5,4,2.5);q.fillRect(k,Wh-4,4,2.5);}q.fillStyle='#222';rrect(q,-5,-8,12,16,2);q.fill();q.fillStyle='#fff7c2';q.fillRect(-3,-6,8,12);}
    if(t.police&&!dead){q.fillStyle='#1f3a93';q.fillRect(-Lh+4,-Wh+1.2,t.l-8,4);q.fillRect(-Lh+4,Wh-5.2,t.l-8,4);q.fillRect(fw+14,-Wh+4,Lh-fw-18,t.w-8);q.fillStyle='#16181c';rrect(q,-5,-Wh+5,10,t.w-10,2);q.fill();q.fillStyle='#7a1414';q.fillRect(-4,-Wh+6,8,Wh-7);q.fillStyle='#16307a';q.fillRect(-4,1,8,Wh-7);}
    if(t.sport&&!dead){q.fillStyle='rgba(0,0,0,.5)';q.fillRect(-Lh+3,-3,t.l-8,6);q.fillStyle='rgba(0,0,0,.35)';q.fillRect(-Lh+1,-Wh+4,4,t.w-8);}}
  paintExtra(q,t,body,dead,Lh,Wh);
  if(!dead){const hy=boxy?Wh-9.5:Wh*(1-nz)-6.6,ty=boxy?Wh-9.5:Wh*(1-rz)-6.4;q.fillStyle='#fff3b8';rrect(q,Lh-4.2,-hy-6,3.8,6,1.6);q.fill();rrect(q,Lh-4.2,hy,3.8,6,1.6);q.fill();q.fillStyle='#8f1d1d';rrect(q,-Lh+0.3,-ty-6,3,6,1.4);q.fill();rrect(q,-Lh+0.3,ty,3,6,1.4);q.fill();}}
function drawVeh(v){const t=v.t,Lh=t.l/2,Wh=t.w/2,P=G.player;if(t.plane){drawPlane(v);return;}
  if(!v.sink){g.save();g.translate(v.x+4+ENV.sun.ox*5,v.y+5);g.rotate(v.a);g.fillStyle='rgba(0,0,0,0.3)';rrect(g,-Lh,-Wh,t.l,t.w,7);g.fill();g.restore();}
  g.save();g.translate(v.x,v.y);g.rotate(v.a);if(v.airT>0){const k=Math.sin(Math.PI*(1-v.airT/v.airMax));g.scale(1+k*0.38,1+k*0.38);}if(v.sink)g.globalAlpha=Math.max(0.1,1-v.sink/1.3);else if(t.boat&&tileAt(v.x,v.y)===TL.BRIDGE)g.globalAlpha=0.3;
  if(!t.boat&&!t.tank)drawWheelsDyn(v,t,Lh,Wh);
  g.drawImage(vehSprite(v),-Lh-VPAD,-Wh-VPAD,t.l+VPAD*2,t.w+VPAD*2);
  if(!v.dead){drawDamage(v);
    if(v.door>0&&!t.boat&&!t.bike&&!t.tank){const da=Math.sin(Math.PI*clamp(1-v.door/0.45,0,1))*1.2,hx=Lh*0.24+9;g.fillStyle='rgba(0,0,0,0.6)';g.fillRect(hx-18,-Wh,18,3.4);g.save();g.translate(hx,-Wh+1);g.rotate(da);g.fillStyle=v.col;g.fillRect(-18,-2.6,18,3.4);g.fillStyle='rgba(20,30,45,0.85)';g.fillRect(-12,-2.6,8,1.7);g.strokeStyle='rgba(0,0,0,0.5)';g.lineWidth=0.8;g.strokeRect(-18,-2.6,18,3.4);g.restore();}
    if(t.police){const on=v.ai&&v.ai.mode==='chase'&&Math.floor(G.time*8)%2;if(v.ai&&v.ai.mode==='chase'){g.fillStyle=on?'#ff3030':'#5a1010';g.fillRect(-4,-Wh+6,8,Wh-7);g.fillStyle=on?'#152a66':'#3a6bff';g.fillRect(-4,1,8,Wh-7);}}
    if(t.gold){g.fillStyle='rgba(255,255,255,'+(0.25+0.25*Math.sin(G.time*5))+')';g.fillRect(-Lh*0.4,-Wh+4,t.l*0.3,4);}
    if(v.thr<0&&v.speed>5&&!t.boat&&!t.bike&&!t.tank){const ty=t.bus||t.van||t.army?Wh-9.5:Wh*(t.cart||t.buggy?0.8:0.7)-6.4;g.fillStyle='#ff4a3a';g.fillRect(-Lh+0.3,-ty-6,3,6);g.fillRect(-Lh+0.3,ty,3,6);}
    if(t.boat&&v.driver)drawSeated(-Lh*0.15,0,v.driver===P?null:'#555');if(t.bike&&v.driver)drawSeated(-2,0,v.driver===P?null:'#555');}
  g.restore();
  if(!v.dead&&!v.sunk&&v.hp<t.hp*0.35&&rand()<0.35)part('smoke',v.x+Math.cos(v.a)*t.l*0.35,v.y+Math.sin(v.a)*t.l*0.35,rr(-20,20)-ENV.wind*30,rr(-20,20),1.2,rr(6,10));
  if(0)part('fire',v.x+Math.cos(v.a)*t.l*0.35+rr(-5,5),v.y+Math.sin(v.a)*t.l*0.35+rr(-5,5),0,-20,0.4,rr(4,8));
  if(v.burn>0&&rand()<0.5)part(rand()<0.5?'fire':'smoke',v.x+rr(-10,10),v.y+rr(-10,10),rr(-20,20)-ENV.wind*30,rr(-20,20),0.8,rr(6,12));}
function drawSeated(x,y,col){g.fillStyle=col||'#2e8b57';g.beginPath();g.ellipse(x,y,6,8,0,0,TAU);g.fill();g.fillStyle='#e0ac69';g.beginPath();g.arc(x+1,y,4.6,0,TAU);g.fill();g.fillStyle='#3b2a1a';g.beginPath();g.arc(x,y,4,0,TAU);g.fill();}

function drawPed(p){const isP=p===G.player;g.save();g.translate(p.x,p.y);
  if(p.kind==='dog'&&(p.dead||p.stun>0)){g.rotate(p.a+1.2);g.globalAlpha=p.dead?0.85:1;drawDog(p);g.restore();return;}
  if(p.dead){g.scale(1.15,1.15);drawDown(p,isP,false);g.restore();return;}
  if(isP&&G.down>0){g.scale(1.15,1.15);drawDown(p,true,true);g.restore();return;}
  if(p.stun>0){g.scale(1.15,1.15);drawDown(p,isP,true);g.restore();return;}
  if(p.st==='cower')g.scale(0.8,0.8);
  if(p.swim){g.strokeStyle='rgba(255,255,255,0.6)';g.lineWidth=2;g.beginPath();g.arc(0,0,13+Math.sin(G.time*5)*2,0,TAU);g.stroke();g.rotate(p.a);
    const sw=Math.sin(G.time*7+p.id)*7;g.fillStyle=p.skin;g.beginPath();g.arc(6+sw,-9,3.2,0,TAU);g.arc(6-sw,9,3.2,0,TAU);g.fill();g.beginPath();g.arc(1,0,5.8,0,TAU);g.fill();
    g.fillStyle=isP?'#3b2a1a':p.hair;g.beginPath();g.arc(-0.5,0,4.8,0,TAU);g.fill();g.restore();return;}
  if(!G.noShadow){g.fillStyle='rgba(0,0,0,0.27)';g.beginPath();g.ellipse(4+ENV.sun.ox*4,5,10,10,0,0,TAU);g.fill();}
  g.rotate(p.a);g.scale(1.24,1.24);drawBody(p,isP);
  if(p.type==='civ'&&!isP&&p.kind!=='dog'&&ENV.rain>0.3&&p.id%2===0){g.fillStyle=p.id%3?'#22262e':p.shirt;g.beginPath();g.arc(2,0,14,0,TAU);g.fill();g.strokeStyle='rgba(255,255,255,0.25)';g.lineWidth=1;g.beginPath();for(let k=0;k<8;k++){g.moveTo(2,0);g.lineTo(2+Math.cos(k*TAU/8)*14,Math.sin(k*TAU/8)*14);}g.stroke();}
  g.restore();}
function drawPlayer(){const P=G.player,hz=playerH(),arc=P.jump>0?Math.sin(Math.PI*(1-P.jump/JT)):0;if(hz<0.02){drawPed(P);return;}
  if(!P.roof&&!P.climb){g.fillStyle=`rgba(0,0,0,${0.32-0.14*arc})`;g.beginPath();g.ellipse(P.x+3+arc*7,P.y+5+arc*12,10-arc*3,8-arc*2.5,0,0,TAU);g.fill();}
  const f=CAMZ/(CAMZ-hz*50)*(1+0.36*arc),q=projPt(P.x,P.y,hz*50);g.save();g.translate(q[0],q[1]-arc*18);g.scale(f,f);g.translate(-P.x,-P.y);G.noShadow=1;drawPed(P);G.noShadow=0;g.restore();}
function drawLadder(l,h){const q=projPt(l.wx,l.wy,h),tx=q[0],ty=q[1],ax=l.side%2?0:6,ay=l.side%2?6:0;const rails=()=>{g.beginPath();g.moveTo(l.wx-ax,l.wy-ay);g.lineTo(tx-ax,ty-ay);g.moveTo(l.wx+ax,l.wy+ay);g.lineTo(tx+ax,ty+ay);};
  g.strokeStyle='#15171a';g.lineWidth=4.5;rails();g.stroke();g.strokeStyle='#dfe2e6';g.lineWidth=2;rails();g.stroke();const n=Math.max(3,Math.round(hyp(tx-l.wx,ty-l.wy)/9));g.beginPath();
  for(let k=1;k<n;k++){const u=k/n,x=lerp(l.wx,tx,u),y=lerp(l.wy,ty,u);g.moveTo(x-ax,y-ay);g.lineTo(x+ax,y+ay);}g.stroke();}
function drawSky(inV,d){const h=G.heli,tt=G.time,c=G.cam;
  if(d<0.6&&G.state!=='title'){for(let k=0;k<5;k++){const x=c.x+Math.sin(tt*0.13+k*1.9)*520+Math.cos(tt*0.05+k)*300,y=c.y+Math.cos(tt*0.11+k*2.3)*330+Math.sin(tt*0.07+k)*160,fl=Math.sin(tt*7+k)*4;
      const wing=(ox,oy,col)=>{g.strokeStyle=col;g.lineWidth=2.4;g.beginPath();g.moveTo(x+ox-9,y+oy-3+fl);g.quadraticCurveTo(x+ox-4,y+oy-5,x+ox,y+oy);g.quadraticCurveTo(x+ox+4,y+oy-5,x+ox+9,y+oy-3+fl);g.stroke();};
      wing(46,58,`rgba(0,0,10,${0.16*(1-d)})`);wing(0,0,`rgba(255,255,255,${0.95*(1-d)})`);}}
  if(h&&inV(h.x,h.y,300)){if(d<0.8){g.fillStyle=`rgba(0,0,10,${0.22*(1-d)})`;g.beginPath();g.ellipse(h.x+70,h.y+95,46,22,h.a,0,TAU);g.fill();}
    g.save();g.translate(h.x,h.y);g.rotate(h.a);g.scale(1.5,1.5);g.fillStyle='#1b2a52';g.fillRect(-46,-3,34,6);g.fillRect(-50,-10,6,20);g.beginPath();g.ellipse(0,0,24,13,0,0,TAU);g.fill();
    g.fillStyle='#e8ecf2';g.fillRect(-14,-13,10,26);g.fillStyle='#7fb4d8';g.beginPath();g.ellipse(13,0,9,9,0,-1.2,1.2);g.fill();
    g.rotate(tt*31);g.fillStyle='rgba(20,20,20,0.16)';g.beginPath();g.arc(0,0,44,0,TAU);g.fill();g.strokeStyle='rgba(15,15,15,0.75)';g.lineWidth=3;g.beginPath();g.moveTo(-44,0);g.lineTo(44,0);g.moveTo(0,-44);g.lineTo(0,44);g.stroke();g.restore();
    if(Math.floor(tt*3)%2){g.fillStyle='#ff3b30';g.beginPath();g.arc(h.x,h.y,5,0,TAU);g.fill();}}}
function bubble(x,y,txt){g.save();g.font='bold 14px Rubik,sans-serif';g.direction=G.lang==='he'?'rtl':'ltr';const w=g.measureText(txt).width+16;
  g.fillStyle='rgba(255,255,255,0.93)';rrect(g,x-w/2,y-24,w,24,8);g.fill();g.beginPath();g.moveTo(x-5,y);g.lineTo(x+5,y);g.lineTo(x,y+7);g.fill();
  g.fillStyle='#111';g.textAlign='center';g.textBaseline='middle';g.fillText(txt,x,y-12);g.restore();}
function curTarget(){const M=G.mission;if(M&&M.target)return M.target;if(!M&&G.fare)return G.fare;if(!M){const nm=nextMission();if(nm)return nm.start;}return null;}
function arrowTo(t,col){const c=G.cam,s=c.s,W=G.vw,H=G.vh,dpr=G.dpr;const sx=(t.x-c.x)*s+W/2,sy=(t.y-c.y)*s+H/2,m=34;g.setTransform(dpr,0,0,dpr,0,0);
  if(sx<m||sy<m+60||sx>W-m||sy>H-m){const a=Math.atan2(sy-H/2,sx-W/2);const ex=clamp(sx,m,W-m),ey=clamp(sy,m+70,H-m);
    g.save();g.translate(ex,ey);g.rotate(a);g.fillStyle=col;g.strokeStyle='#000';g.lineWidth=2;g.beginPath();g.moveTo(16,0);g.lineTo(-10,-11);g.lineTo(-5,0);g.lineTo(-10,11);g.closePath();g.fill();g.stroke();g.restore();}
  else{const b=Math.sin(G.time*6)*5;g.fillStyle=col;g.strokeStyle='#000';g.lineWidth=2;g.beginPath();g.moveTo(sx,sy-24+b);g.lineTo(sx-10,sy-40+b);g.lineTo(sx+10,sy-40+b);g.closePath();g.fill();g.stroke();}}
function drawTargetArrow(){if(G.state==='title')return;const t=curTarget();if(t)arrowTo(t,'#ffe14d');if(G.way)arrowTo(G.way,'#ff4a4a');}

// ---------- minimap ----------
const MC=document.getElementById('mini'),mg=MC.getContext('2d');
function drawMini(){const P=G.player,px=P.veh?P.veh.x:P.x,py=P.veh?P.veh.y:P.y;const S=MC.width,sc=S/220*4.4/T*(220/MC.width)*MC.width/220;
  mg.setTransform(1,0,0,1,0,0);mg.clearRect(0,0,S,S);mg.save();mg.beginPath();mg.arc(S/2,S/2,S/2-2,0,TAU);mg.clip();
  mg.fillStyle='#1d4f75';mg.fillRect(0,0,S,S);mg.imageSmoothingEnabled=true;
  mg.drawImage(MINIMG,S/2-px*sc,S/2-py*sc,MW*T*sc,MH*T*sc);
  if(ENV.dark>0.05){mg.fillStyle=`rgba(6,10,36,${ENV.dark*0.45})`;mg.fillRect(0,0,S,S);}
  trackMini(mg,S/2-px*sc,S/2-py*sc,sc,2.2);gpsPath(mg,S/2-px*sc,S/2-py*sc,sc,4);
  if(G.wanted>0&&!G.seenNow&&G.lastSeen){const bx=S/2+(G.lastSeen.x-px)*sc,by=S/2+(G.lastSeen.y-py)*sc;mg.fillStyle='rgba(255,60,60,0.22)';mg.strokeStyle='rgba(255,90,90,0.8)';mg.lineWidth=2;mg.beginPath();mg.arc(bx,by,sightRange()*sc*0.8,0,TAU);mg.fill();mg.stroke();}
  const blip=(x,y,col,r,sq)=>{let bx=S/2+(x-px)*sc,by=S/2+(y-py)*sc;const dx=bx-S/2,dy=by-S/2,dd=hyp(dx,dy),R=S/2-10;if(dd>R){bx=S/2+dx/dd*R;by=S/2+dy/dd*R;}
    mg.fillStyle=col;mg.strokeStyle='#000';mg.lineWidth=2;mg.beginPath();if(sq)mg.rect(bx-r,by-r,r*2,r*2);else mg.arc(bx,by,r,0,TAU);mg.fill();mg.stroke();};
  {const hs=SHOPS.find(q=>q.pid===G.home);if(hs)blip(hs.sx,hs.sy,'#2ecc71',6,true);}
  mg.lineWidth=1.5;mg.strokeStyle='#000';for(const s of SHOPS.concat(GAS)){const bx=S/2+((s.sx||s.x)-px)*sc,by=S/2+((s.sy||s.y)-py)*sc;if(hyp(bx-S/2,by-S/2)>S/2-8)continue;mg.fillStyle=s.col||'#5ad1ff';mg.fillRect(bx-4,by-4,8,8);mg.strokeRect(bx-4,by-4,8,8);}
  if(G.wanted>0){let bs=null,bd=1e9;for(const sp of SPRAYS){const dd=hyp(sp.x-px,sp.y-py);if(dd<bd){bd=dd;bs=sp;}}if(bs)blip(bs.x,bs.y,'#c070ff',6,true);}
  for(const b of PROPS){const bx=S/2+(b.x-px)*sc,by=S/2+(b.y-py)*sc;if(hyp(bx-S/2,by-S/2)>S/2-8)continue;mg.fillStyle=owned(b.id)?'#7dffa0':'#ff9f43';mg.beginPath();mg.moveTo(bx,by-5);mg.lineTo(bx+5,by);mg.lineTo(bx,by+5);mg.lineTo(bx-5,by);mg.closePath();mg.fill();mg.stroke();}
  for(const v of G.vehicles)if(v.ai&&v.ai.mode==='chase'&&!v.dead)blip(v.x,v.y,v.ai.faction==='police'?(Math.floor(G.time*6)%2?'#ff3030':'#3050ff'):'#ff8c00',5);
  if(!G.mission)for(const sm of sideAvail()){const bx=S/2+(sm.start.x-px)*sc,by=S/2+(sm.start.y-py)*sc;if(hyp(bx-S/2,by-S/2)<S/2-8){mg.fillStyle='#b07cff';mg.beginPath();mg.arc(bx,by,5,0,TAU);mg.fill();mg.stroke();}}
  if(G.way)blip(G.way.x,G.way.y,'#ff3b3b',7);
  const t=curTarget();if(t){const M=G.mission;blip(t.x,t.y,(M||G.fare)?'#ffe14d':nextMission().col,8);}
  mg.restore();mg.save();mg.translate(S/2,S/2);mg.rotate(P.veh?P.veh.a:P.a);mg.fillStyle='#fff';mg.strokeStyle='#000';mg.lineWidth=2;
  mg.beginPath();mg.moveTo(11,0);mg.lineTo(-7,-7);mg.lineTo(-3,0);mg.lineTo(-7,7);mg.closePath();mg.fill();mg.stroke();mg.restore();
  mg.strokeStyle='rgba(255,255,255,0.6)';mg.lineWidth=3;mg.beginPath();mg.arc(S/2,S/2,S/2-2,0,TAU);mg.stroke();}
