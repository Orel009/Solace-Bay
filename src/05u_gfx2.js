// ---------- v8 graphics: textured roofs, roof equipment, street furniture, nicer trees ----------
const ROOFPAT={};
function roofPat(col){if(ROOFPAT[col])return ROOFPAT[col];const c=document.createElement('canvas');c.width=c.height=96;const q=c.getContext('2d');q.fillStyle=col;q.fillRect(0,0,96,96);let s=col.length*977;
  const r=()=>{s=(s*16807)%2147483647;return s/2147483647;};for(let k=0;k<260;k++){q.fillStyle=r()<0.5?'rgba(255,255,255,0.07)':'rgba(0,0,0,0.08)';q.fillRect(r()*96,r()*96,1+r()*2,1+r()*2);}
  q.strokeStyle='rgba(0,0,0,0.07)';q.lineWidth=1;for(let k=0;k<3;k++){const y=r()*96;q.beginPath();q.moveTo(0,y);q.lineTo(96,y+r()*6-3);q.stroke();}return ROOFPAT[col]=g.createPattern(c,'repeat');}
function roofSurface(b,rx,ry,rw,rh){const pw=Math.min(12,Math.max(5,Math.min(rw,rh)*0.08));
  g.fillStyle='rgba(255,255,255,0.13)';g.fillRect(rx,ry,rw,pw);g.fillRect(rx,ry+pw,pw,rh-pw);g.fillStyle='rgba(0,0,0,0.1)';g.fillRect(rx+pw,ry+rh-pw,rw-pw,pw);g.fillRect(rx+rw-pw,ry+pw,pw,rh-pw*2);
  g.fillStyle='rgba(0,0,0,0.13)';g.fillRect(rx+pw,ry+pw,rw-pw*2,4);g.fillRect(rx+pw,ry+pw+4,4,rh-pw*2-4);
  g.fillStyle=roofPat(b.roof);g.fillRect(rx+pw+4,ry+pw+4,rw-pw*2-4,rh-pw*2-4);
  const gr=g.createLinearGradient(rx,ry,rx+rw,ry+rh);gr.addColorStop(0,'rgba(255,255,255,0.10)');gr.addColorStop(0.55,'rgba(255,255,255,0)');gr.addColorStop(1,'rgba(0,0,0,0.10)');g.fillStyle=gr;g.fillRect(rx+pw,ry+pw,rw-pw*2,rh-pw*2);}
function roofBits(b,rx,ry,rw,rh,d){if(rw<70||rh<70)return;let s=b.seed||1;const r=()=>{s=(s*48271)%2147483647;return s/2147483647;};const pw=10;
  // vents along one edge
  const nv=1+Math.floor(r()*3),edge=Math.floor(r()*4);for(let k=0;k<nv;k++){const t=0.2+0.6*(k+0.5)/nv;let x,y;if(edge===0){x=rx+rw*t;y=ry+pw+10;}else if(edge===1){x=rx+rw-pw-10;y=ry+rh*t;}else if(edge===2){x=rx+rw*t;y=ry+rh-pw-10;}else{x=rx+pw+10;y=ry+rh*t;}
    g.fillStyle='rgba(0,0,0,0.25)';g.beginPath();g.arc(x+2.5,y+2.5,5.5,0,TAU);g.fill();g.fillStyle='#8d949c';g.beginPath();g.arc(x,y,5.5,0,TAU);g.fill();g.fillStyle='#4a5058';g.beginPath();g.arc(x,y,2.6,0,TAU);g.fill();}
  // roof hatch
  if(r()<0.7){const x=rx+pw+8+r()*(rw-pw*2-30),y=ry+pw+8+r()*(rh-pw*2-30);g.fillStyle='rgba(0,0,0,0.22)';g.fillRect(x+3,y+3,18,18);g.fillStyle='#7d858e';g.fillRect(x,y,18,18);g.fillStyle='#a3abb3';g.fillRect(x+2,y+2,14,6);g.strokeStyle='rgba(0,0,0,0.3)';g.lineWidth=1;g.strokeRect(x+0.5,y+0.5,17,17);}
  // pipe run
  if(r()<0.55){const y=ry+rh*(0.3+r()*0.4);g.strokeStyle='rgba(0,0,0,0.22)';g.lineWidth=5;g.beginPath();g.moveTo(rx+pw+6,y+2);g.lineTo(rx+rw-pw-6,y+2);g.stroke();g.strokeStyle='#9aa3ab';g.lineWidth=3.5;g.beginPath();g.moveTo(rx+pw+6,y);g.lineTo(rx+rw-pw-6,y);g.stroke();}
  // solar panels on bigger roofs
  if(rw>140&&rh>110&&r()<0.4){const cols=Math.floor((rw-60)/34),x0=rx+30;for(let k=0;k<Math.min(5,cols);k++){const x=x0+k*34,y=ry+rh-pw-44;g.fillStyle='rgba(0,0,0,0.25)';g.fillRect(x+3,y+3,28,30);g.fillStyle='#1d3557';g.fillRect(x,y,28,30);g.strokeStyle='rgba(160,200,255,0.35)';g.lineWidth=1;g.strokeRect(x+0.5,y+0.5,27,29);g.beginPath();g.moveTo(x+14,y);g.lineTo(x+14,y+30);g.moveTo(x,y+15);g.lineTo(x+28,y+15);g.stroke();}}
  if(d>0.35&&r()<0.5){g.fillStyle=`rgba(255,80,60,${0.5+0.5*Math.sin(G.time*3+b.seed)})`;g.beginPath();g.arc(rx+pw+4,ry+pw+4,2.5,0,TAU);g.fill();}}
// ---------- street furniture ----------
const STREET=new Map();
function genStreet(){let s=4242;const r=()=>{s=(s*48271)%2147483647;return s/2147483647;};const near=(x,y,list,rad)=>list.some(o=>hyp(o.x-x,o.y-y)<rad);
  const avoid=[...SHOPS.map(s=>({x:s.sx,y:s.sy})),...USES,...LADS.map(l=>({x:l.x,y:l.y})),...STATIONS.map(st=>({x:st.gx,y:st.gy})),...PROPS,...SPRAYS];
  for(let y=1;y<MH-1;y++)for(let x=1;x<MW-1;x++){if(tget(x,y)!==TL.WALK)continue;let rd=-1;if(tget(x,y-1)===TL.ROAD)rd=0;else if(tget(x+1,y)===TL.ROAD)rd=1;else if(tget(x,y+1)===TL.ROAD)rd=2;else if(tget(x-1,y)===TL.ROAD)rd=3;if(rd<0)continue;
    if(r()>0.16)continue;const cx=(x+0.5)*T,cy=(y+0.5)*T,ox=[0,1,0,-1][rd],oy=[-1,0,1,0][rd],px=cx+ox*20,py=cy+oy*20;if(near(px,py,avoid,90))continue;
    const k=r(),t=k<0.28?'stree':k<0.46?'bench':k<0.62?'bin':k<0.72?'hydrant':k<0.82?'planter':k<0.9?'news':k<0.95?'bikes':'busstop';const it={t,x:px,y:py,a:[0,Math.PI/2,Math.PI,-Math.PI/2][rd],h:r()};
    const key=(Math.floor(px/1024))+','+(Math.floor(py/1024));if(!STREET.has(key))STREET.set(key,[]);STREET.get(key).push(it);}}
function drawStreet(inV){const vw=G.view;if(!vw)return;const x0=Math.floor((vw[0]-80)/1024),x1=Math.floor((vw[2]+80)/1024),y0=Math.floor((vw[1]-80)/1024),y1=Math.floor((vw[3]+80)/1024);
  for(let cx=x0;cx<=x1;cx++)for(let cy=y0;cy<=y1;cy++){const L2=STREET.get(cx+','+cy);if(!L2)continue;for(const it of L2)if(inV(it.x,it.y,50))drawStreetItem(it);}}
function drawStreetItem(it){g.save();g.translate(it.x,it.y);g.rotate(it.a);const sh=(w,h)=>{g.fillStyle='rgba(0,0,0,0.22)';g.fillRect(-w/2+3,-h/2+3,w,h);};
  switch(it.t){case'bench':sh(34,12);g.fillStyle='#6b4a2b';g.fillRect(-17,-6,34,12);g.fillStyle='#8a6240';for(let k=-15;k<15;k+=6)g.fillRect(k,-5,4,10);g.fillStyle='#2b2b33';g.fillRect(-17,-7,3,14);g.fillRect(14,-7,3,14);break;
   case'bin':g.fillStyle='rgba(0,0,0,0.22)';g.beginPath();g.arc(3,3,8,0,TAU);g.fill();g.fillStyle='#2e7d32';g.beginPath();g.arc(0,0,8,0,TAU);g.fill();g.fillStyle='#1b5e20';g.beginPath();g.arc(0,0,5,0,TAU);g.fill();if(it.h<0.4){g.fillStyle='#f4f6f7';g.fillRect(-2,-3,5,4);}break;
   case'hydrant':g.fillStyle='rgba(0,0,0,0.22)';g.beginPath();g.arc(2,2,6,0,TAU);g.fill();g.fillStyle='#c0392b';g.beginPath();g.arc(0,0,6,0,TAU);g.fill();g.fillStyle='#e74c3c';g.beginPath();g.arc(-1,-1,3,0,TAU);g.fill();g.fillStyle='#8e2a20';g.fillRect(-8,-2,16,4);break;
   case'planter':sh(22,22);g.fillStyle='#8d7a66';rrect(g,-11,-11,22,22,4);g.fill();g.fillStyle='#3d8b37';g.beginPath();g.arc(-3,-2,7,0,TAU);g.arc(4,3,6,0,TAU);g.arc(3,-5,5,0,TAU);g.fill();if(it.h>0.5){g.fillStyle=it.h>0.75?'#ff6b9d':'#ffd23f';for(let k=0;k<4;k++){g.beginPath();g.arc(-6+k*4,(k%2)*4-2,1.8,0,TAU);g.fill();}}break;
   case'news':sh(12,10);g.fillStyle=it.h<0.5?'#2980b9':'#c0392b';g.fillRect(-6,-5,12,10);g.fillStyle='#f4f6f7';g.fillRect(-4,-3,8,3);break;
   case'bikes':g.strokeStyle='#7f8c8d';g.lineWidth=2;for(let k=-12;k<=12;k+=8){g.beginPath();g.arc(k,0,4,Math.PI,0);g.stroke();}if(it.h<0.6){g.strokeStyle='#e84393';g.lineWidth=2;g.beginPath();g.arc(-8,-4,4,0,TAU);g.arc(2,-4,4,0,TAU);g.stroke();}break;
   case'busstop':sh(54,18);g.fillStyle='rgba(160,210,240,0.55)';g.fillRect(-27,-9,54,18);g.strokeStyle='#2c3e50';g.lineWidth=2;g.strokeRect(-27,-9,54,18);g.fillStyle='#2c3e50';g.fillRect(-27,-9,54,4);g.fillStyle='#ffd23f';g.beginPath();g.arc(30,-6,5,0,TAU);g.fill();g.fillStyle='#16161d';g.font='bold 7px sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText('BUS',30,-6);break;
   case'stree':{g.fillStyle='#5d4a3a';g.fillRect(-9,-9,18,18);g.fillStyle='#4a3a2c';g.fillRect(-7,-7,14,14);g.restore();g.save();const t={x:it.x,y:it.y,r:15+it.h*5,palm:false,seed:Math.floor(it.h*1000)};const [rx,ry]=projPt(t.x,t.y,55);g.strokeStyle='#5a3d22';g.lineWidth=3.5;g.beginPath();g.moveTo(t.x,t.y);g.lineTo(rx,ry);g.stroke();drawCanopy(t,rx,ry);break;}}
  g.restore();}
// ---------- nicer trees ----------
const TREEC=[['#255b29','#2f7232','#46923a','#6fb04e'],['#2d5e22','#3d7a2a','#5a9a36','#86bd58'],['#1f5233','#2a6b40','#3f8a52','#6bb07a']];
function drawCanopy(t,rx,ry){const pal=TREEC[(t.seed!=null?t.seed:Math.floor(t.x*0.37+t.y*0.11))%3],R0=t.r;
  g.fillStyle=pal[0];g.beginPath();for(let k=0;k<7;k++){const a=k*TAU/7+t.x*0.01;g.moveTo(rx+Math.cos(a)*R0*0.5+R0*0.55,ry+Math.sin(a)*R0*0.5);g.arc(rx+Math.cos(a)*R0*0.5,ry+Math.sin(a)*R0*0.5,R0*0.55,0,TAU);}g.fill();
  g.fillStyle=pal[1];g.beginPath();for(let k=0;k<5;k++){const a=k*TAU/5+t.y*0.01;g.moveTo(rx-R0*0.12+Math.cos(a)*R0*0.32+R0*0.45,ry-R0*0.14+Math.sin(a)*R0*0.32);g.arc(rx-R0*0.12+Math.cos(a)*R0*0.32,ry-R0*0.14+Math.sin(a)*R0*0.32,R0*0.45,0,TAU);}g.fill();
  g.fillStyle=pal[2];g.beginPath();g.arc(rx-R0*0.25,ry-R0*0.3,R0*0.38,0,TAU);g.arc(rx+R0*0.05,ry-R0*0.4,R0*0.25,0,TAU);g.fill();g.fillStyle=pal[3];g.globalAlpha=0.6;g.beginPath();g.arc(rx-R0*0.33,ry-R0*0.4,R0*0.16,0,TAU);g.fill();g.globalAlpha=1;}
function drawPalm(t,rx,ry,tt,sway){for(let k=0;k<8;k++){const a=k*TAU/8+t.x*0.01+Math.sin(tt*1.5+k)*0.04*sway,L=t.r*1.15,ex=rx+Math.cos(a)*L,ey=ry+Math.sin(a)*L,nx=-Math.sin(a),ny=Math.cos(a),w=t.r*0.24;
    g.fillStyle=k%2?'#3f9a3a':'#2f8030';g.beginPath();g.moveTo(rx,ry);g.quadraticCurveTo(rx+Math.cos(a)*L*0.5+nx*w,ry+Math.sin(a)*L*0.5+ny*w,ex,ey);g.quadraticCurveTo(rx+Math.cos(a)*L*0.5-nx*w*0.4,ry+Math.sin(a)*L*0.5-ny*w*0.4,rx,ry);g.fill();
    g.strokeStyle='rgba(20,60,20,0.5)';g.lineWidth=1;g.beginPath();g.moveTo(rx,ry);g.lineTo(ex,ey);g.stroke();}
  g.fillStyle='#7a5a32';g.beginPath();g.arc(rx,ry,4.5,0,TAU);g.fill();g.fillStyle='#5a3f1e';for(let k=0;k<3;k++){g.beginPath();g.arc(rx+Math.cos(k*2.1)*4,ry+Math.sin(k*2.1)*4,2.4,0,TAU);g.fill();}}
