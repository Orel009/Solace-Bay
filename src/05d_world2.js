// ---------- east district, bridges, airport, pier, plane ----------
const WE=7,BR=[4,8],ROOFC=['#b5533c','#8d4a3a','#6d7b8a','#a8643f','#5f6f7a'];
TL.BRIDGE=10;
VT.plane={he:'מטוס קל',en:'Light Plane',l:92,w:30,max:560,acc:250,grip:9,turn:1.5,hp:160,cols:['#f4f6f7'],plane:1,mass:1.2};
Object.assign(PAL,{crown:['#f3ece0','#e8dccb','#f7f3ea','#e6e0d4','#efe3d0'],strip:['#2a1f3d','#3b1f2e','#1f2a44','#402a1a','#2d2d38'],east:['#9a6b52','#7d7f86','#8c7a5c','#6f7b72','#a0876a']});
Object.assign(AREAS,{crown:{he:'קראון הייטס',en:'Crown Heights'},strip:{he:'לאקי סטריפ',en:'Lucky Strip'},east:{he:'איסטגייט',en:'Eastgate'},air:{he:'נמל התעופה סולס',en:'Solace Intl Airport'}});
function eastLand(x,y){return x>=169+Math.round(1.4*Math.sin(y*0.17))&&x<=227+Math.round(1.5*Math.sin(y*0.23+1))&&y>=5+Math.round(1.3*Math.sin(x*0.21))&&y<=143;}
function villa(a,b,c,e,R,rp){fillT(a,b,c,e,TL.GRASS);const w=c-a+1,h=e-b+1,rc=rp(ROOFC);let bb;
  if(w<2||h<2)bb=addBld(a,b,c,e,0.9+R()*0.4,rp(PAL.crown),{house:1});
  else{bb=addBld(a,b,w>2?c-1:c,h>2?e-1:e,0.9+R()*0.5,rp(PAL.crown),{house:1});
    if(w>2&&h>2&&R()<0.5)tset(c,e,TL.WATER);else if(w>2||h>2)TREES.push({x:(c+0.5)*T,y:(e+0.5)*T,r:20+R()*8,palm:R()<0.4});}
  bb.roof=rc;bb.rim=shade(rc,-0.25);}
function genEast(R,rp){
  fillT(112,32,129,34,TL.DOCK);                                   // causeway to Fort Collar
  fillT(170,145,246,193,TL.GRASS);fillT(172,147,244,191,TL.CONC);fillT(176,172,240,176,TL.ROAD);fillT(190,138,191,171,TL.ROAD);
  addBld(180,150,187,156,1.6,'#8a8f96',{hangar:1});addBld(196,150,203,156,1.6,'#7f858c',{hangar:1});addBld(212,149,232,154,1.5,'#cfd6dd',{logo:'SOLACE INTL',logoC:'#2c3e50'});addBld(238,150,239,151,4.6,'#d9dde2',{lh:1});
  DECOR.push({t:'runway',x:176*T,y:172*T,w:65*T,h:5*T});
  POI.airport={x:208*T,y:163*T};POI.planes=[{x:200*T,y:167*T,a:0},{x:214*T,y:167.5*T,a:0}];
  DECOR.push({t:'pump',x:226*T,y:161*T});GAS.push({x:226*T+52,y:161*T});
  fillT(228,62,247,65,TL.DOCK);fillT(240,57,251,70,TL.DOCK);DECOR.push({t:'wheel',x:246*T,y:63.5*T});POI.pier={x:243*T,y:67*T};
  POI.vendors.push({x:238*T,y:63.2*T});DECOR.push({t:'stand',x:238*T,y:63.2*T});
  POI.truckM={x:140*T,y:36.5*T,a:Math.PI};POI.tankM={x:147*T,y:37.5*T,a:Math.PI};POI.lhDock={x:155*T,y:80.5*T};POI.lhLand={x:157.3*T,y:82.4*T};
  POI.cakevan={x:POI.garage.x-150,y:POI.garage.y+70,a:0};
  for(let k=0;k<10;k++){const y=10+R()*128,x=224+R()*3;if(tget(Math.floor(x),Math.floor(y))===TL.SAND)DECOR.push({t:'umb',x:x*T,y:y*T,c:rp(['#e74c3c','#3498db','#f1c40f','#1abc9c','#ffffff'])});}
  POI.boats.push({x:231*T,y:40*T,a:0},{x:231*T,y:100*T,a:0},{x:249*T,y:72*T,a:Math.PI/2});
  LAMPS.push({x:236*T,y:61.6*T,lx:236*T,ly:62.3*T},{x:244*T,y:56.6*T,lx:244*T,ly:57.4*T},{x:250*T,y:70.4*T,lx:250*T,ly:69.6*T},{x:200*T,y:158*T,lx:200*T+20,ly:158*T,big:1},{x:222*T,y:158*T,lx:222*T+20,ly:158*T,big:1},{x:186*T,y:170*T,lx:186*T+20,ly:170*T,big:1});}

// ---------- plane ----------
function planePhys(v,dt,vf){const was=v.alt>0.25;v.alt=clamp((v.alt||0)+(vf>330&&v.driver&&!v.dead?dt*0.9:-dt*0.65),0,1);
  if(was&&v.alt<=0.25){const t=tileAt(v.x,v.y);if(t===TL.BLD||t===TL.FENCE)explodeVeh(v,null);else if(v.driver===G.player){sfx.crash(200);G.shake=4;}}}
function planeShape(sh,v){if(!sh)g.fillStyle='#d5dae0';g.beginPath();g.moveTo(6,-56);g.lineTo(20,-56);g.lineTo(25,0);g.lineTo(20,56);g.lineTo(6,56);g.lineTo(1,0);g.closePath();g.fill();
  g.beginPath();g.moveTo(-42,-20);g.lineTo(-33,-20);g.lineTo(-30,0);g.lineTo(-33,20);g.lineTo(-42,20);g.closePath();g.fill();
  if(!sh)g.fillStyle=v.dead?'#2b2b2b':'#f4f6f7';g.beginPath();g.ellipse(0,0,46,9,0,0,TAU);g.fill();
  if(sh)return;g.strokeStyle='rgba(0,0,0,0.35)';g.lineWidth=1;g.stroke();g.fillStyle='#c0392b';g.fillRect(-12,-8.5,8,17);g.fillRect(8,-56,10,6);g.fillRect(8,50,10,6);
  g.fillStyle='#15212d';g.beginPath();g.ellipse(26,0,9,5.5,0,0,TAU);g.fill();
  if(v.driver&&!v.dead){g.fillStyle='rgba(40,40,40,0.3)';g.beginPath();g.ellipse(47,0,2.5,17,0,0,TAU);g.fill();}else{g.fillStyle='#333';g.fillRect(45,-12,3,24);}}
function drawPlane(v){const alt=v.alt||0,sc=1+alt*0.55;g.fillStyle=`rgba(0,0,10,${0.3-0.13*alt})`;g.save();g.translate(v.x+5+alt*75,v.y+7+alt*100);g.rotate(v.a);planeShape(1,v);g.restore();
  g.save();g.translate(v.x,v.y);g.rotate(v.a);g.scale(sc,sc);planeShape(0,v);g.restore();
  if(v.burn>0&&rand()<0.5)part(rand()<0.5?'fire':'smoke',v.x+rr(-10,10),v.y+rr(-10,10),rr(-20,20),rr(-20,20),0.8,rr(6,12));}

// ---------- extra decor ----------
function drawDecor2(dc){const tt=G.time;switch(dc.t){
  case'runway':g.fillStyle='rgba(255,255,255,0.85)';for(let x=dc.x+90;x<dc.x+dc.w-90;x+=150)g.fillRect(x,dc.y+dc.h/2-4,80,8);
    for(let k=0;k<6;k++){g.fillRect(dc.x+16,dc.y+24+k*46,50,22);g.fillRect(dc.x+dc.w-66,dc.y+24+k*46,50,22);}
    g.strokeStyle='rgba(255,230,120,0.7)';g.lineWidth=3;g.strokeRect(dc.x+4,dc.y+4,dc.w-8,dc.h-8);return true;
  case'stadium':g.fillStyle='#8f949a';g.beginPath();g.ellipse(dc.x,dc.y,dc.rx,dc.ry,0,0,TAU);g.fill();g.fillStyle='#5d6268';g.beginPath();g.ellipse(dc.x,dc.y,dc.rx-26,dc.ry-26,0,0,TAU);g.fill();
    g.fillStyle='#3f8f3a';g.beginPath();g.ellipse(dc.x,dc.y,dc.rx-58,dc.ry-58,0,0,TAU);g.fill();g.strokeStyle='rgba(255,255,255,0.75)';g.lineWidth=3;g.beginPath();g.ellipse(dc.x,dc.y,dc.rx-74,dc.ry-74,0,0,TAU);g.moveTo(dc.x,dc.y-dc.ry+74);g.lineTo(dc.x,dc.y+dc.ry-74);g.stroke();
    g.beginPath();g.arc(dc.x,dc.y,26,0,TAU);g.stroke();return true;
  case'flag':g.fillStyle='#e8f5e0';g.beginPath();g.arc(dc.x,dc.y,26,0,TAU);g.fill();g.fillStyle='#111';g.beginPath();g.arc(dc.x,dc.y,5,0,TAU);g.fill();g.strokeStyle='#ddd';g.lineWidth=2;g.beginPath();g.moveTo(dc.x,dc.y);g.lineTo(dc.x+4,dc.y-34);g.stroke();
    g.fillStyle='#e74c3c';g.beginPath();g.moveTo(dc.x+4,dc.y-34);g.lineTo(dc.x+22+Math.sin(tt*4)*3,dc.y-28);g.lineTo(dc.x+4,dc.y-22);g.fill();return true;
  case'wheel':g.fillStyle='rgba(0,0,10,0.2)';g.beginPath();g.ellipse(dc.x+50,dc.y+70,120,40,0,0,TAU);g.fill();return true;}
  return false;}
function drawWheels(inV,d){const tt=G.time;for(const dc of DECOR){if(dc.t!=='wheel'||!inV(dc.x,dc.y,260))continue;const q=projPt(dc.x,dc.y,150),R=150,a0=tt*0.22;
  g.strokeStyle='#5d6470';g.lineWidth=8;g.beginPath();g.moveTo(dc.x-70,dc.y+40);g.lineTo(q[0],q[1]);g.lineTo(dc.x+70,dc.y+40);g.stroke();
  g.strokeStyle='#e9edf2';g.lineWidth=5;g.beginPath();g.arc(q[0],q[1],R,0,TAU);g.stroke();g.lineWidth=2;g.beginPath();g.arc(q[0],q[1],R-22,0,TAU);for(let k=0;k<12;k++){const a=a0+k*TAU/12;g.moveTo(q[0],q[1]);g.lineTo(q[0]+Math.cos(a)*R,q[1]+Math.sin(a)*R);}g.stroke();
  const cols=['#e74c3c','#f1c40f','#3498db','#2ecc71','#e84393','#ff9f43'];for(let k=0;k<12;k++){const a=a0+k*TAU/12,x=q[0]+Math.cos(a)*R,y=q[1]+Math.sin(a)*R;g.fillStyle=cols[k%6];rrect(g,x-11,y-9,22,18,5);g.fill();
    if(d>0.2){g.globalCompositeOperation='lighter';glow(g,GL.warm,x,y,26,d*0.8);g.globalAlpha=1;g.globalCompositeOperation='source-over';}}
  g.fillStyle='#c0392b';g.beginPath();g.arc(q[0],q[1],14,0,TAU);g.fill();}}
function drawHouseRoof(b,rx,ry,rw,rh){const horiz=rw>=rh;g.fillStyle='rgba(0,0,0,0.16)';if(horiz)g.fillRect(rx,ry+rh/2,rw,rh/2);else g.fillRect(rx+rw/2,ry,rw/2,rh);
  g.strokeStyle='rgba(0,0,0,0.3)';g.lineWidth=2;g.beginPath();if(horiz){g.moveTo(rx+10,ry+rh/2);g.lineTo(rx+rw-10,ry+rh/2);}else{g.moveTo(rx+rw/2,ry+10);g.lineTo(rx+rw/2,ry+rh-10);}g.stroke();
  g.strokeStyle='rgba(0,0,0,0.1)';g.lineWidth=1;g.beginPath();if(horiz)for(let k=8;k<rh;k+=9){g.moveTo(rx+2,ry+k);g.lineTo(rx+rw-2,ry+k);}else for(let k=8;k<rw;k+=9){g.moveTo(rx+k,ry+2);g.lineTo(rx+k,ry+rh-2);}g.stroke();
  g.fillStyle='#7a5a48';g.fillRect(rx+rw*0.68,ry+rh*0.2,12,12);}
