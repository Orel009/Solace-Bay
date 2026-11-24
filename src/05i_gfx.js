// ---------- v3 graphics: steering/spinning wheels, better people ----------
function drawWheelsDyn(v,t,Lh,Wh){const st=v.dead?0:clamp(v.sm||0,-1,1)*0.55,ph=(((v.wr||0)%6)+6)%6;
  const wheel=(x,y,wl,wh,rot)=>{g.save();g.translate(x,y);if(rot)g.rotate(rot);g.fillStyle='#0b0b0c';rrect(g,-wl/2,-wh/2,wl,wh,2.2);g.fill();g.fillStyle='rgba(150,150,156,0.5)';for(let k=-wl/2+ph;k<wl/2-1.2;k+=6)g.fillRect(k,-wh/2,1.3,wh);
    g.fillStyle='rgba(255,255,255,0.10)';g.fillRect(-wl/2+1,-wh/2,wl-2,1.2);g.restore();};
  if(t.bike){wheel(-Lh+6.5,0,13,6.4,0);wheel(Lh-6.5,0,13,6.4,st*1.15);return;}
  const big=t.bus||t.army||t.truck,wl=big?17:14.5,wh=big?7:6.2,wx=Lh*0.6,wy=Wh-0.4;
  wheel(-wx,-wy,wl,wh,0);wheel(-wx,wy,wl,wh,0);wheel(wx,-wy,wl,wh,st);wheel(wx,wy,wl,wh,st);
  if(t.bus||t.limo){wheel(-wx+wl+3,-wy,wl,wh,0);wheel(-wx+wl+3,wy,wl,wh,0);}}
function vehFx(v,vf,vr,dt){const t=v.t;v.wr=(v.wr||0)+vf*dt*0.55;if(!v.onScreen||t.boat||v.alt>0.25||v.sink)return;
  const ca=Math.cos(v.a),sa=Math.sin(v.a),bx=v.x-ca*t.l*0.42,by=v.y-sa*t.l*0.42,tl=tileAt(bx,by),sp=Math.abs(vf);
  if((Math.abs(vr)>120||(v.hb&&sp>110))&&(tl===TL.ROAD||tl===TL.CONC||tl===TL.LOT||tl===10)&&rand()<0.55)part('steam',bx+rr(-8,8),by+rr(-8,8),rr(-20,20),rr(-20,20),rr(0.5,0.9),rr(5,9));
  if((tl===TL.SAND||tl===TL.GRASS)&&sp>90&&rand()<0.5)part('dust',bx+rr(-9,9),by+rr(-9,9),-ca*30+rr(-25,25),-sa*30+rr(-25,25),rr(0.5,1),rr(5,9));
  if(v.thr>0&&sp<70&&v.driver&&!t.bike&&!t.elec&&rand()<0.3)part('smoke',bx,by,-ca*40+rr(-10,10),-sa*40+rr(-10,10),0.5,rr(3,5));
  if(ENV.wet>0.4&&sp>160&&tl===TL.ROAD&&rand()<0.5)part('splash',bx+rr(-9,9),by+rr(-9,9),-ca*60+rr(-40,40),-sa*60+rr(-40,40),0.35,rr(2,4));}
function drawBody(p,isP){if(p.kind==='dog'){drawDog(p);return;}
  const air=isP&&p.jump>0,moving=p.walk>0,sw=air?6:moving?Math.sin(p.walk*0.16)*7:0,of=isP?OUTFIT():null,shirt=isP?of.shirt:p.shirt,hat=isP?of.hat:p.hat,pants=isP?'#26303d':(p.pants||'#23232b'),sk=p.skin,sl=p.bare?sk:shirt,tc=p.bare?sk:shirt;
  const leg=(o,y)=>{g.fillStyle=p.bare?sk:pants;rrect(g,-5+o,y,10,5.2,2.4);g.fill();g.fillStyle=p.bare?'#e9d8b5':(isP?'#f2f2f2':'#101014');g.beginPath();g.ellipse(5.6+o,y+2.6,3.5,2.7,0,0,TAU);g.fill();};
  const pk=isP&&G.punchT>0?G.punchK||'jab':(!isP&&p.hitT>0?p.hitK:null),pt=isP?clamp(G.punchT/0.22,0,1):clamp((p.hitT||0)/0.22,0,1),ext=Math.sin(Math.PI*(1-pt));
  if(pk==='kick'||pk==='stomp'){leg(-sw*0.3,-7.3);g.fillStyle=p.bare?sk:pants;rrect(g,-3,1.6,10+ext*(pk==='kick'?13:6),5.4,2.6);g.fill();g.fillStyle=isP?'#f2f2f2':'#101014';g.beginPath();g.ellipse(8+ext*(pk==='kick'?13:6),4.3,3.8,3,0,0,TAU);g.fill();}else{leg(sw,-7.3);leg(-sw,2.1);}
  const wp=isP?G.weapon:p.wpn,W=WEAP[wp]||{},mel=W.melee,armed=wp&&wp!=='fist'&&(isP||p.hostile||p.war||(p.type==='cop'&&G.wanted>1)||p.type==='soldier'),long=armed&&!mel&&!['pistol','magnum','grenade','molotov'].includes(wp);
  const arm=(hx,hy,s)=>{g.strokeStyle='rgba(0,0,0,0.3)';g.lineWidth=6;g.lineCap='round';g.beginPath();g.moveTo(-0.5,s*8.6);g.lineTo(hx,hy);g.stroke();g.strokeStyle=sl;g.lineWidth=4.6;g.beginPath();g.moveTo(-0.5,s*8.6);g.lineTo(hx,hy);g.stroke();g.lineCap='butt';g.fillStyle=sk;g.beginPath();g.arc(hx,hy,2.7,0,TAU);g.fill();};
  if(air){arm(6,-14,-1);arm(6,14,1);}else if(p.st==='cower'){arm(5,-4.5,-1);arm(5,4.5,1);}
  else if(p.st==='film'){arm(11,-3,-1);arm(11,3,1);}else if(p.st==='beg'){arm(4,-13,-1);arm(4,13,1);}else if(p.st==='dance'||isP&&G.danceT>0){const q=Math.sin(G.time*14);arm(4+q*4,-14,-1);arm(4-q*4,14,1);}
  else if(pk==='jab'){arm(4+ext*11,-6,-1);arm(2,11,1);}else if(pk==='cross'){arm(2,-11,-1);arm(4+ext*11,4,1);}else if(pk==='hook'){arm(2,-11,-1);arm(6+ext*7,10-ext*14,1);}
  else if(pk==='shove'){arm(5+ext*10,-7,-1);arm(5+ext*10,7,1);}else if(pk==='swing'){const sa=-1.4+2.6*(1-pt);arm(Math.cos(sa)*12,Math.sin(sa)*12,1);arm(Math.cos(sa)*10,Math.sin(sa)*10-2,-1);}else if(pk==='stab'){arm(2,-11,-1);arm(5+ext*10,4,1);}
  else if(armed&&!mel){arm(9,4.8,1);if(long)arm(15,3.2,-1);else arm(3-sw*0.5,-11,-1);}
  else{arm(2-sw*0.8,-11.2,-1);arm(2+sw*0.8,11.2,1);}
  if(p.kind==='biz'){g.fillStyle='#6b4a2b';rrect(g,-1+sw*0.8,12.6,8.5,5.2,1.2);g.fill();g.fillStyle='#c9a15b';g.fillRect(2+sw*0.8,12.6,1.5,5.2);}
  if(p.kind==='elder'){g.strokeStyle='#5d4037';g.lineWidth=1.7;g.beginPath();g.moveTo(3+sw*0.8,11.5);g.lineTo(14,14);g.stroke();}
  // torso
  const tp=()=>rrect(g,-5.8,-10.8,12,21.6,5.8);g.fillStyle=tc;tp();g.fill();
  g.fillStyle='rgba(0,0,0,0.20)';g.beginPath();g.ellipse(-3.2,0,3.6,10,0,0,TAU);g.fill();g.fillStyle='rgba(255,255,255,0.17)';g.beginPath();g.ellipse(2.6,-3.4,3,5.6,0,0,TAU);g.fill();
  if(p.bare&&p.fem){g.fillStyle=p.pants;g.fillRect(-2.5,-9.6,5,19.2);}
  if(isP&&!p.bare){g.fillStyle='rgba(255,255,255,0.85)';g.fillRect(-1.2,-10.2,2.2,20.4);g.fillStyle='rgba(0,0,0,0.25)';g.fillRect(3.4,-1,2.2,2);}
  if(p.kind==='worker'){g.fillStyle='rgba(255,255,255,0.85)';g.fillRect(-2.2,-10.2,2.2,20.4);g.fillRect(1.6,-10.2,2.2,20.4);}
  if(p.kind==='biz'&&!p.fem){g.fillStyle='#ecf0f1';g.beginPath();g.moveTo(1.5,-3.2);g.lineTo(6,0);g.lineTo(1.5,3.2);g.fill();g.fillStyle='#c0392b';g.fillRect(2.6,-0.9,3.2,1.8);}
  if(p.kind==='tourist'||p.kind==='punk'&&p.id%2){g.fillStyle=p.kind==='punk'?'#1b1b1b':'#3b6ea5';rrect(g,-8.6,-5.5,5,11,2);g.fill();}
  g.strokeStyle=isP?'rgba(190,255,216,0.95)':'rgba(0,0,0,0.42)';g.lineWidth=isP?1.5:1;tp();g.stroke();
  if(armed||(isP&&mel)){if(pk==='swing'){const sa=-1.4+2.6*(1-pt);g.save();g.translate(Math.cos(sa)*12,Math.sin(sa)*12);g.rotate(sa);drawGun(wp);g.restore();}else if(pk==='stab'){g.save();g.translate(5+ext*10,4);drawGun(wp);g.restore();}else{g.save();g.translate(mel?2+sw*0.8:9,mel?11.2:4.8);if(mel&&wp==='bat')g.rotate(-0.5);drawGun(wp);g.restore();}}
  if(p.st==='film'){g.fillStyle='#16161d';rrect(g,11,-3.5,4,7.5,1.2);g.fill();g.fillStyle='#9fe3ff';g.fillRect(11.6,-2.8,2.8,6);}
  if(p.kind==='tourist'){g.fillStyle='#1c1c1c';rrect(g,5.8,-3,4.5,6,1);g.fill();g.fillStyle='#8fd3ff';g.fillRect(8.8,-1.2,1.5,2.4);}
  // head
  g.fillStyle='rgba(0,0,0,0.25)';g.beginPath();g.arc(0.4,0.6,6.5,0,TAU);g.fill();
  if(p.hairL){g.fillStyle=p.hair;g.beginPath();g.ellipse(-3.8,0,5.8,7,0,0,TAU);g.fill();}
  g.fillStyle=sk;g.beginPath();g.arc(1.2,-5.4,1.5,0,TAU);g.arc(1.2,5.4,1.5,0,TAU);g.fill();g.beginPath();g.arc(1.7,0,5.7,0,TAU);g.fill();g.strokeStyle='rgba(0,0,0,0.28)';g.lineWidth=0.8;g.stroke();
  const cap=p.type==='cop'||p.type==='soldier';g.fillStyle=p.type==='cop'?'#14256b':p.type==='soldier'?'#3a4219':(isP?'#3b2a1a':p.hair);g.beginPath();g.arc(-0.2,0,cap?6.3:5,0,TAU);g.fill();
  if(!cap&&!hat){g.fillStyle='rgba(255,255,255,0.13)';g.beginPath();g.arc(0.8,-1.6,2.4,0,TAU);g.fill();}
  if(p.moh){g.fillStyle=p.moh;rrect(g,-5.6,-1.7,11.2,3.4,1.6);g.fill();}
  if(hat){g.fillStyle=hat;g.beginPath();g.arc(0.3,0,6.6,0,TAU);g.fill();rrect(g,4.4,-4.2,5,8.4,2);g.fill();g.fillStyle='rgba(0,0,0,0.2)';g.beginPath();g.arc(-0.6,0,4,0,TAU);g.fill();}
  if(p.kind==='jogger'){g.strokeStyle='#ffffff';g.lineWidth=1.7;g.beginPath();g.moveTo(3,-5.4);g.lineTo(3,5.4);g.stroke();}
  if(p.type==='cop'){g.fillStyle='#0d1845';rrect(g,3,-5.2,3.4,10.4,1.5);g.fill();g.fillStyle='#f1c40f';g.fillRect(1,-1,2,2);}
  if(p.type==='soldier'){g.fillStyle='rgba(20,30,10,0.45)';g.beginPath();g.arc(-2,-2,2.2,0,TAU);g.arc(1.5,2.5,1.8,0,TAU);g.fill();}
  if(p.vendor){g.fillStyle='#ffffff';g.beginPath();g.arc(-0.3,0,5.5,0,TAU);g.fill();g.fillStyle='rgba(0,0,0,0.12)';g.beginPath();g.arc(-0.3,0,3.4,0,TAU);g.fill();}}
function drawDown(p,isP,stars){const of=isP?OUTFIT():null,shirt=p.bare?p.skin:(isP?of.shirt:p.shirt);g.rotate(p.a);
  g.fillStyle=isP?'#26303d':(p.pants||'#2b2b33');rrect(g,-22,-6,11,4.6,2);g.fill();rrect(g,-21,1.6,11,4.6,2);g.fill();g.fillStyle='#101014';g.beginPath();g.ellipse(-22,-3.7,2.6,3,0,0,TAU);g.ellipse(-21,3.9,2.6,3,0,0,TAU);g.fill();
  g.strokeStyle=shirt;g.lineWidth=4.6;g.lineCap='round';g.beginPath();g.moveTo(2,-7);g.lineTo(9,-14);g.moveTo(2,7);g.lineTo(-3,15);g.stroke();g.lineCap='butt';g.fillStyle=p.skin;g.beginPath();g.arc(9,-14,2.7,0,TAU);g.arc(-3,15,2.7,0,TAU);g.fill();
  g.fillStyle=shirt;rrect(g,-12,-8,22,16,7);g.fill();g.strokeStyle='rgba(0,0,0,0.4)';g.lineWidth=1;rrect(g,-12,-8,22,16,7);g.stroke();
  g.fillStyle=p.skin;g.beginPath();g.arc(14,0,5.7,0,TAU);g.fill();g.fillStyle=isP?'#3b2a1a':p.hair;g.beginPath();g.arc(15.4,0,4.8,0,TAU);g.fill();
  if(stars){g.fillStyle='#ffe14d';for(let k=0;k<3;k++){const a=G.time*6+k*2.1;g.fillRect(14+Math.cos(a)*10-1.5,Math.sin(a)*10-1.5,3,3);}}}

function drawGun(wp){const R=(x,y,w,h,c)=>{g.fillStyle=c;g.fillRect(x,y,w,h);},D='#17181b',M='#3a3d44',WD='#6b4a2b';
  switch(wp){case'pistol':R(0,-1.6,9,3.2,D);R(0,1.2,3,3.2,M);break;
   case'magnum':R(0,-1.8,13,3.4,'#b8bec6');g.fillStyle='#8a9098';g.beginPath();g.arc(3,0,2.8,0,TAU);g.fill();R(-1,1.2,3.2,3.6,WD);break;
   case'smg':R(-1,-1.8,13,3.6,D);R(4,1.6,2.6,5,M);R(-4,-1.2,3.5,2.4,M);break;
   case'shotgun':R(-5,-2,7,4,WD);R(2,-1.9,17,1.7,D);R(2,0.3,17,1.7,D);R(6,-2.1,5,4.2,'#4a3324');break;
   case'rifle':R(-6,-1.8,7,3.6,WD);R(1,-1.6,17,3.2,D);R(7,1.4,3,5,M);R(7,-3.6,6,1.6,M);break;
   case'sniper':R(-7,-1.6,8,3.2,WD);R(1,-1.1,25,2.2,D);g.fillStyle='#0d0e10';rrect(g,5,-4.6,10,3.4,1.4);g.fill();g.fillStyle='#7fd4ff';g.fillRect(14.2,-4.2,1,2.6);break;
   case'flame':g.fillStyle='#b03a2e';rrect(g,-16,-5,8,10,3);g.fill();R(-8,-0.8,8,1.6,'#555');R(0,-1.6,14,3.2,'#6d7177');g.fillStyle=`rgba(255,160,40,${0.6+0.4*Math.sin(G.time*30)})`;g.beginPath();g.arc(15,0,2,0,TAU);g.fill();break;
   case'rocket':g.fillStyle='#4f5d2f';rrect(g,-6,-3.5,28,7,2.5);g.fill();R(22,-4.2,4,8.4,'#2f3a1c');g.fillStyle='#c0392b';g.beginPath();g.moveTo(26,-3);g.lineTo(31,0);g.lineTo(26,3);g.fill();R(2,3,3,4,M);break;
   case'minigun':R(-6,-4,10,8,'#2c3e50');for(let k=-1;k<=1;k++)R(4,k*2.4-0.9,20,1.8,D);g.fillStyle='rgba(255,255,255,'+(0.2+0.2*Math.sin(G.time*60))+')';g.fillRect(8,-3.5,2,7);break;
   case'grenade':g.fillStyle='#5f7a3a';g.beginPath();g.arc(1,0,3.4,0,TAU);g.fill();R(0,-4.6,2,1.6,M);break;
   case'molotov':g.fillStyle='#2e7d32';rrect(g,-2,-2.6,8,5.2,2);g.fill();R(6,-1.2,3.5,2.4,'#1b5e20');g.fillStyle=`rgba(255,${130+Math.floor(80*Math.sin(G.time*25))},30,0.95)`;g.beginPath();g.arc(10.5,0,2.4+Math.sin(G.time*31),0,TAU);g.fill();break;
   case'bat':g.fillStyle='#a1785a';g.beginPath();g.moveTo(-1,-1.2);g.lineTo(20,-2.6);g.quadraticCurveTo(23,0,20,2.6);g.lineTo(-1,1.2);g.closePath();g.fill();R(-3,-1.3,3,2.6,'#3e2a1a');break;
   case'knife':R(-2,-1.2,5,2.4,'#2b2b33');g.fillStyle='#d5dae0';g.beginPath();g.moveTo(3,-1.4);g.lineTo(11,-0.4);g.lineTo(3,1.4);g.closePath();g.fill();break;
   default:R(0,-1.5,10,3,D);}}
