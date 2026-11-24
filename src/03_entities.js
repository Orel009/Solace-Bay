const VT={
 compact:{he:'מכונית קטנה',en:'Compact',l:50,w:27,max:300,acc:280,grip:6,turn:2.9,hp:80,cols:['#c0392b','#2e86c1','#27ae60','#d35400','#8e44ad','#7f8c8d','#ecf0f1']},
 sedan:{he:'סדאן',en:'Sedan',l:60,w:30,max:340,acc:260,grip:6,turn:2.6,hp:100,cols:['#34495e','#922b21','#1a5276','#b7950b','#616a6b','#f4f6f7','#145a32']},
 taxi:{he:'מונית',en:'Taxi',l:60,w:30,max:330,acc:260,grip:6,turn:2.6,hp:100,cols:['#f4c430'],taxi:1},
 stinger:{he:'סטינגר',en:'Stinger',l:62,w:30,max:490,acc:440,grip:7,turn:2.9,hp:100,cols:['#ffd400','#e74c3c','#ffffff'],sport:1},
 muscle:{he:'מכונית שרירים',en:'Muscle',l:64,w:32,max:440,acc:390,grip:4.6,turn:2.5,hp:120,cols:['#1b4f72','#641e16','#17202a','#7d6608']},
 pickup:{he:'טנדר',en:'Pickup',l:66,w:32,max:310,acc:240,grip:5.5,turn:2.3,hp:140,cols:['#7b241c','#566573','#1e8449','#a04000'],bed:1,mass:1.3},
 van:{he:'ואן',en:'Van',l:70,w:34,max:290,acc:210,grip:5.5,turn:2.1,hp:150,cols:['#ecf0f1','#5d6d7e','#a9cce3'],van:1,mass:1.5},
 bus:{he:'אוטובוס',en:'Bus',l:124,w:38,max:240,acc:150,grip:6,turn:1.4,hp:260,cols:['#1f77b4','#c0392b'],bus:1,mass:3},
 bike:{he:'אופנוע',en:'Motorbike',l:40,w:14,max:440,acc:470,grip:8,turn:3.4,hp:50,cols:['#c0392b','#1c1c1c','#2471a3'],bike:1,mass:0.5},
 police:{he:'ניידת',en:'Police Car',l:62,w:31,max:450,acc:390,grip:6.5,turn:2.8,hp:170,cols:['#f8f9f9'],police:1},
 army:{he:'משאית צבאית',en:'Army Truck',l:86,w:38,max:270,acc:180,grip:6,turn:1.8,hp:320,cols:['#4b5320'],army:1,mass:2.4},
 tank:{he:'טנק',en:'Tank',l:84,w:48,max:190,acc:140,grip:14,turn:1.6,hp:2000,cols:['#556b2f'],tank:1,mass:6},
 aurum:{he:'אורום',en:'Aurum',l:62,w:30,max:590,acc:550,grip:8,turn:3.1,hp:220,cols:['#d4af37'],sport:1,gold:1},
 speedboat:{he:'סירה מהירה',en:'Speedboat',l:72,w:28,max:440,acc:270,grip:1.6,turn:2.2,hp:160,cols:['#ecf0f1','#e74c3c'],boat:1},
 dinghy:{he:'סירת גומי',en:'Dinghy',l:46,w:22,max:270,acc:210,grip:2.2,turn:2.6,hp:80,cols:['#e67e22','#7f8c8d'],boat:1},
};
const TRAFFIC_TYPES=['compact','compact','sedan','sedan','sedan','taxi','taxi','pickup','van','muscle','bike','bus','stinger','sedan','compact'];
const WEAP={fist:{he:'אגרופים',en:'Fists',rate:0.38},pistol:{he:'אקדח',en:'Pistol',rate:0.3,dmg:26,spread:0.03,price:150,pack:24},smg:{he:'תת-מקלע',en:'SMG',rate:0.085,dmg:13,spread:0.08,price:400,pack:90},
 shotgun:{he:'רובה ציד',en:'Shotgun',rate:0.75,dmg:17,spread:0.17,pellets:6,price:600,pack:16},rifle:{he:'רובה סער',en:'Assault Rifle',rate:0.11,dmg:22,spread:0.035,price:1200,pack:90},
 flame:{he:'להביור',en:'Flamethrower',rate:0.045,dmg:7,spread:0.14,flame:1,price:1500,pack:150},rocket:{he:'משגר רקטות',en:'Rocket Launcher',rate:1.1,dmg:120,spread:0.01,expl:1,price:3000,pack:5},
 grenade:{he:'רימונים',en:'Grenades',rate:0.8,dmg:100,nade:1,price:500,pack:6}};
const WORDER=['fist','pistol','smg','shotgun','rifle','flame','rocket','grenade'];
const vehName=v=>L(v.t);

function mkVeh(type,x,y,a,col){const t=VT[type];const v={k:'veh',type,t,x,y,a:a||0,vx:0,vy:0,speed:0,hp:t.hp,col:col||pick(t.cols),
  driver:null,ai:null,thr:0,str:0,hb:0,dead:false,burn:0,sink:0,sunk:false,persist:false,parked:false,id:++UID,ta:0,cool:0,occ:0,fuel:(t.boat||t.tank)?1:rr(0.4,1)};
  G.vehicles.push(v);return v;}
function mkPed(type,x,y,o){const p=Object.assign({k:'ped',type,x,y,a:rr(0,TAU),hp:type==='cop'?80:type==='soldier'?90:60,dead:false,veh:null,
  st:'walk',tm:rr(1,4),cool:rr(0.5,1.5),walk:0,kvx:0,kvy:0,swim:false,persist:false,hostile:false,id:++UID,say:null,sayT:0,arr:0,
  shirt:pick(['#c0392b','#2980b9','#27ae60','#f39c12','#8e44ad','#16a085','#d35400','#7f8c8d','#ecf0f1','#e84393','#34495e']),
  skin:pick(['#f1c27d','#e0ac69','#c68642','#8d5524','#ffdbac']),hair:pick(['#2c1b0e','#111','#6b4423','#c9a15b','#888'])},o||{});
  if(type==='cop'){p.shirt='#1f3a93';p.wpn='pistol';}
  if(type==='soldier'){p.shirt='#4b5320';p.wpn='smg';}
  if(type==='gang'){p.shirt=p.faction==='tide'?'#1f8f86':'#9b2fbf';p.wpn='pistol';}
  if(type==='civ')setKind(p,p.kind||'casual');
  G.peds.push(p);return p;}

function solidPed(t){return t===TL.BLD||t===TL.FENCE;}
function solidFor(v,t){if(v.t.boat)return t!==TL.WATER&&t!==TL.BRIDGE;return t===TL.BLD||t===TL.FENCE;}
function circlePush(x,y,r,solid){const tx0=Math.floor((x-r)/T),tx1=Math.floor((x+r)/T),ty0=Math.floor((y-r)/T),ty1=Math.floor((y+r)/T);
  let pxp=0,pxn=0,pyp=0,pyn=0,any=false;
  for(let ty=ty0;ty<=ty1;ty++)for(let tx=tx0;tx<=tx1;tx++){if(!solid(tget(tx,ty),tx,ty))continue;
    const cx=clamp(x,tx*T,tx*T+T),cy=clamp(y,ty*T,ty*T+T);const dx=x-cx,dy=y-cy,d=hyp(dx,dy);
    if(d>=r)continue;any=true;let px=0,py=0;
    if(d<0.001){const l=x-tx*T,rg=tx*T+T-x,tp=y-ty*T,bt=ty*T+T-y,m=Math.min(l,rg,tp,bt);
      if(m===l)px=-(l+r);else if(m===rg)px=rg+r;else if(m===tp)py=-(tp+r);else py=bt+r;}
    else{px=dx/d*(r-d);py=dy/d*(r-d);}
    if(px>pxp)pxp=px;if(px<pxn)pxn=px;if(py>pyp)pyp=py;if(py<pyn)pyn=py;}
  return any?[pxp+pxn,pyp+pyn]:null;}
function vehCircles(v){const ca=Math.cos(v.a),sa=Math.sin(v.a),o=v.t.l*0.28,r=v.t.w*0.5;
  if(v.t.l>100){const o2=v.t.l*0.36;return[[v.x+ca*o2,v.y+sa*o2,r],[v.x,v.y,r],[v.x-ca*o2,v.y-sa*o2,r]];}
  return[[v.x+ca*o,v.y+sa*o,r],[v.x-ca*o,v.y-sa*o,r]];}
function pointInVeh(v,x,y,m){const dx=x-v.x,dy=y-v.y,ca=Math.cos(v.a),sa=Math.sin(v.a);
  return Math.abs(dx*ca+dy*sa)<v.t.l/2+m&&Math.abs(-dx*sa+dy*ca)<v.t.w/2+m;}

function vehPhys(v,dt){const t=v.t;let ca=Math.cos(v.a),sa=Math.sin(v.a);
  let vf=v.vx*ca+v.vy*sa,vr=-v.vx*sa+v.vy*ca;
  const thr=(v.dead||v.sink)?0:v.thr,str=(v.dead||v.sink)?0:v.str;
  if(thr>0){if(vf<0)vf+=t.acc*2.2*thr*dt;else vf+=t.acc*thr*dt*(1-0.55*vf/t.max);}
  else if(thr<0){if(vf>12)vf+=t.acc*2.4*thr*dt;else vf+=t.acc*0.75*thr*dt;}
  else vf-=Math.sign(vf)*Math.min(Math.abs(vf),(t.boat?40:70+Math.abs(vf)*0.35)*dt);
  vf=clamp(vf,-t.max*0.4,t.max*(v.hp<t.hp*0.5&&!t.tank?0.72+0.56*v.hp/t.hp:1));
  if(t.plane)planePhys(v,dt,vf);
  if(v.hb&&!t.boat)vf-=Math.sign(vf)*Math.min(Math.abs(vf),240*dt);
  const grip=t.grip*(v.hb?0.22:1)*(t.boat?1:1-0.42*ENV.wet);v.sm=lerp(v.sm||0,str,Math.min(1,dt*9));vr*=Math.max(0,1-grip*dt);
  const sp=Math.abs(vf),tf=clamp(vf/110,-1,1)*(1-clamp((sp-t.max*0.6)/t.max,0,0.3));
  v.a+=(v.sm*t.turn*(v.hb?1.4:1)+(v.pull||0))*tf*dt;
  if(v.driver===G.player)G.skidNow=!t.boat&&(Math.abs(vr)>105||(v.hb&&Math.abs(vf)>90));
  ca=Math.cos(v.a);sa=Math.sin(v.a);
  v.vx=ca*vf-sa*vr;v.vy=sa*vf+ca*vr;v.speed=vf;v.slide=vr;
  moveVeh(v,dt);
  if(!t.boat&&!v.sunk&&!(v.alt>0.25)&&tileAt(v.x,v.y)===TL.WATER){
    if(!v.sink){v.sink=0.001;splash(v.x,v.y,18);sfx.splash();}
  }
  if(v.sink){v.sink+=dt;v.vx*=0.92;v.vy*=0.92;if(v.sink>1.3)sinkVeh(v);}
  // skid marks
  if(!t.boat&&Math.abs(vr)>130&&!v.sink&&G.decals.length<600&&v.onScreen){const bx=v.x-ca*t.l*0.35,by=v.y-sa*t.l*0.35;
    G.decals.push({t:'skid',x:bx-sa*t.w*0.35,y:by+ca*t.w*0.35,a:v.a},{t:'skid',x:bx+sa*t.w*0.35,y:by-ca*t.w*0.35,a:v.a});}
  vehFx(v,vf,vr,dt);
  if(t.boat&&Math.abs(vf)>60&&rand()<0.7)part('wake',v.x-ca*t.l*0.5+rr(-6,6),v.y-sa*t.l*0.5+rr(-6,6),0,0,0.9,rr(5,9));
}
function moveVeh(v,dt){if(v.alt>0.25){v.x=clamp(v.x+v.vx*dt,T,(MW-1)*T);v.y=clamp(v.y+v.vy*dt,T,(MH-1)*T);return;}
 const sp=hyp(v.vx,v.vy),n=Math.max(1,Math.ceil(sp*dt/12)),sdt=dt/n;
  for(let k=0;k<n;k++){v.x+=v.vx*sdt;v.y+=v.vy*sdt;let px=0,py=0,hit=false;
    for(const c of vehCircles(v)){const p=circlePush(c[0],c[1],c[2],tt=>solidFor(v,tt));if(p){px+=p[0];py+=p[1];hit=true;}}
    if(hit){v.x+=px;v.y+=py;const l=hyp(px,py)||1,nx=px/l,ny=py/l,vn=v.vx*nx+v.vy*ny;
      if(vn<0){v.vx-=1.25*vn*nx;v.vy-=1.25*vn*ny;v.vx*=0.86;v.vy*=0.86;const imp=-vn;
        if(imp>110){damageVeh(v,(imp-110)*0.07,null,'hit');if(v.t.bike&&imp>250&&v.driver===G.player)throwRider(v,imp);addDentDir(v,-nx,-ny,imp-90);if(v.driver===G.player)sfx.crash(imp);if(imp>160)part('spark',v.x-nx*v.t.w*0.5,v.y-ny*v.t.w*0.5,rr(-60,60),rr(-60,60),0.3,3);}}}}
}
function sinkVeh(v){v.sunk=true;v.remove=true;if(v.driver===G.player||v===G.player.lastVeh)G.stats.sunk++;splash(v.x,v.y,24);
  if(v.driver===G.player){const P=G.player;P.veh=null;P.x=v.x;P.y=v.y;v.driver=null;}
  else if(v.driver&&v.driver!==G.player){const p=mkPed(v.driver==='cop'?'cop':'civ',v.x,v.y);p.st='flee';p.ft=3;p.fx=v.x-10;p.fy=v.y;}}
function explodeVeh(v,src){v.dead=true;v.burn=7;v.col='#2b2b2b';
  const d=v.driver;v.driver=null;v.ai=null;
  if(d===G.player){G.player.veh=null;G.player.x=v.x;G.player.y=v.y;killPed(G.player,src,'boom');}
  explodeAt(v.x,v.y,src,v);if(v.t.armored)for(let k=0;k<6;k++)mkPickup('cash',v.x+rr(-50,50),v.y+rr(-50,50),{amt:ri(300,700)});}
function explodeAt(x,y,src,skip){sfx.boom();G.shake=Math.max(G.shake||0,14);G.boom={x,y,t:1};
  for(const p of G.peds)if(p.type==='civ'&&!p.dead&&hyp(p.x-x,p.y-y)<520){p.st='flee';p.ft=6;p.fx=x;p.fy=y;}react(nearestCiv(x,y,520),'boom');post('boom');
  for(let i=0;i<26;i++)part('fire',x+rr(-18,18),y+rr(-18,18),rr(-140,140),rr(-140,140),rr(0.4,0.9),rr(8,16));
  for(let i=0;i<14;i++)part('smoke',x+rr(-20,20),y+rr(-20,20),rr(-40,40),rr(-40,40),rr(1,2),rr(12,22));
  G.decals.push({t:'scorch',x,y,r:rr(36,48)});
  for(const p of G.peds){if(p.dead||p.veh)continue;const d=hyp(p.x-x,p.y-y);if(d<100)hurtPed(p,110*(1-d/140),src,'boom');}
  for(const o of G.vehicles){if(o===skip||o.dead||o.sunk)continue;const d=hyp(o.x-x,o.y-y);if(d<120){damageVeh(o,90*(1-d/160),src,'boom');const k=(120-d)*3;o.vx+=(o.x-x)/(d||1)*k;o.vy+=(o.y-y)/(d||1)*k;}}
  const P=G.player;if(P.veh===null&&!P.dead){}
}

function movePed(p,dx,dy){const r=9;
  p.x+=dx;let c=circlePush(p.x,p.y,r,solidPed);if(c){p.x+=c[0];p.y+=c[1];}
  p.y+=dy;c=circlePush(p.x,p.y,r,solidPed);if(c){p.x+=c[0];p.y+=c[1];}
  p.swim=tileAt(p.x,p.y)===TL.WATER;}
function hurtPed(p,d,src,how){if(p.dead||d<=0)return;if(p===G.player&&G.armor>0&&how!=='drown'){const ab=Math.min(G.armor,d*0.8);G.armor-=ab;d-=ab;}p.hp-=d;if(p===G.player)G.lastHurt=G.time;else if(how==='punch'&&p.hp>0)p.stag=p.type==='cop'?0.7:0.28;
  if(G.decals.length<600&&how!=='drown'&&how!=='burn')part('blood',p.x,p.y,rr(-40,40),rr(-40,40),0.4,3);
  if(p!==G.player){
    if(p.type==='civ'||(!p.hostile&&p.type!=='npc')){p.st='flee';p.ft=6;p.fx=src?src.x:p.x-1;p.fy=src?src.y:p.y;}
    if(src===G.player){
      {const K=KINDS[p.kind]||{};if(p.type==='civ'&&how==='punch'&&p.hp>0&&!(p.brawl>0)&&!K.meek&&(K.tough||p.id%2===0)){p.brawl=10;react(p,'fight');}}
      if(p.type==='gang'){p.hostile=true;for(const o of G.peds)if(o.type==='gang'&&o.faction===p.faction&&!o.dead&&hyp(o.x-p.x,o.y-p.y)<500)o.hostile=true;}
      if(p.type==='soldier')p.hostile=true;
      if(p.type==='cop')crime(1,true);else crime(1,false);}}
  if(p.hp<=0)killPed(p,src,how);}
function killPed(p,src,how){if(p.dead)return;p.dead=true;p.hp=0;p.st='dead';
  if(how!=='drown'&&G.decals.length<600)G.decals.push({t:'blood',x:p.x+rr(-4,4),y:p.y+rr(-4,4),r:rr(9,15)});
  if(p===G.player){wasted();return;}
  if(src===G.player&&p.type==='cop')crime(2,true);else if(src===G.player&&p.type==='civ')crime(2,false);
  if(rand()<0.35&&!p.swim)mkPickup('cash',p.x+rr(-8,8),p.y+rr(-8,8),{amt:ri(5,45)});}

function fire(op,ov,x,y,ang,dmg,spread,expl,o){o=o||{};const a=ang+rr(-spread,spread),spd=o.spd||(expl?700:950);
  G.bullets.push({x:x+Math.cos(a)*18,y:y+Math.sin(a)*18,vx:Math.cos(a)*spd,vy:Math.sin(a)*spd,life:o.life||(expl?0.9:0.55),op,ov,dmg,expl,kind:o.kind,h:op===G.player&&G.player.roof?G.player.roof.ht:0});
  if(o.kind==='flame')return;
  if(o.kind!=='nade')part('flash',x+Math.cos(a)*20,y+Math.sin(a)*20,0,0,0.06,expl?14:7);
  if(!o.quiet&&(op===G.player||hyp(x-G.player.x,y-G.player.y)<700))sfx.shot(expl);
  if(!o.quiet){for(const p of G.peds)if(p.type==='civ'&&!p.dead&&hyp(p.x-x,p.y-y)<380){if(p.st==='call'||p.brawl>0)continue;if(p.id%4===1){p.st='cower';p.ft=4;}else{p.st='flee';p.ft=5;p.fx=x;p.fy=y;}}
    if(op===G.player){const nc=nearestCiv(x,y,380);if(nc&&G.sayCD<=0)sfx.scream(dv(nc.x,nc.y),nc.voice||200);react(nc,'shots');}}}
function updateBullets(dt){for(const b of G.bullets){const steps=Math.max(1,Math.ceil(hyp(b.vx,b.vy)*dt/10)),sdt=dt/steps;
  if(b.kind==='flame')part('fire',b.x+rr(-4,4),b.y+rr(-4,4),b.vx*0.1,b.vy*0.1,0.22,rr(5,10));
  for(let k=0;k<steps&&!b.dead;k++){b.x+=b.vx*sdt;b.y+=b.vy*sdt;const tt=tileAt(b.x,b.y);
    if(heliHit(b)||gatorHit(b)){b.dead=true;break;}
    if((tt===TL.BLD&&!(b.h&&bAt(b.x,b.y).ht<=b.h+0.2))||tt===TL.FENCE){b.dead=true;if(b.kind!=='flame')part('spark',b.x,b.y,rr(-50,50),rr(-50,50),0.2,2);if(b.expl)explodeAt(b.x,b.y,b.op);break;}
    for(const p of G.peds){if(p.dead||p.veh||p===b.op)continue;if((p.x-b.x)**2+(p.y-b.y)**2<130){hurtPed(p,b.dmg,b.op,'shot');if(b.kind==='flame')p.burn=3;b.dead=true;if(b.expl)explodeAt(b.x,b.y,b.op);break;}}
    if(b.dead)break;
    for(const v of G.vehicles){if(v===b.ov||v.sunk||v.alt>0.25)continue;if(pointInVeh(v,b.x,b.y,2)){if(!b.expl&&b.kind!=='flame')addHole(v,b.x,b.y);damageVeh(v,b.dmg*(b.expl?4.5:0.45),b.op,b.expl?'boom':'shot');vehShot(v,b);b.dead=true;part('spark',b.x,b.y,rr(-60,60),rr(-60,60),0.25,2);
      if(b.expl)explodeAt(b.x,b.y,b.op,v);break;}}}
  b.life-=dt;if(b.life<=0){b.dead=true;if(b.expl)explodeAt(b.x,b.y,b.op);}}
  G.bullets=G.bullets.filter(b=>!b.dead);}

function part(type,x,y,vx,vy,life,size){if(G.parts.length>450)return;G.parts.push({type,x,y,vx,vy,life,max:life,size});}
function splash(x,y,n){for(let i=0;i<n;i++)part('splash',x+rr(-14,14),y+rr(-14,14),rr(-90,90),rr(-90,90),rr(0.4,0.8),rr(3,6));}
function updateParts(dt){for(const p of G.parts){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vx*=0.94;p.vy*=0.94;p.life-=dt;
  if(p.type==='smoke'||p.type==='wake'||p.type==='steam'||p.type==='dust')p.size+=dt*10;}
  G.parts=G.parts.filter(p=>p.life>0);
  if(G.decals.length>600)G.decals.splice(0,G.decals.length-600);}

function mkPickup(type,x,y,o){const p=Object.assign({type,x,y,t:rand()*6,id:++UID},o||{});G.pickups.push(p);return p;}
function giveWeapon(w,ammo){G.weapons[w]=(G.weapons[w]||0)+ammo;if(G.weapon==='fist')G.weapon=w;}
