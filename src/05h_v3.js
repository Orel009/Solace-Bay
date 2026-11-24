// ---------- v3: sturdier vehicles, burning fuse, panicking drivers, knockdowns ----------
for(const k in VT)if(!VT[k].tank)VT[k].hp=Math.round(VT[k].hp*1.5);VT.bike.hp=120;
Object.assign(STR.he,{carFire:'הרכב עולה באש — צא ממנו מהר!',thrown:'עפת מהאופנוע!',alarmOn:'אזעקת הרכב הופעלה'});
Object.assign(STR.en,{carFire:'The car is on fire — get out now!',thrown:'You were thrown off the bike!',alarmOn:'Car alarm triggered'});
function damageVeh(v,d,src,how){if(v.dead||d<=0)return;const mx=v.t.hp;
  if(how==='hit'){if(G.time<(v.hitT||0))return;v.hitT=G.time+0.3;d=Math.min(d,mx*0.2);}
  if(src===G.player&&v.t.police)crime(1,true);
  if(how==='boom'){v.hp-=d;if(v.hp<=0){v.hp=0;explodeVeh(v,src);}return;}
  v.hp=Math.max(1,v.hp-d);if(v.hp<=mx*0.12&&!v.t.tank&&!v.fuse)startFuse(v,src);}
function startFuse(v,src){v.fuse=v.driver===G.player?8:5.5;v.fuseSrc=src||null;
  if(v.driver===G.player){toast(tr('carFire'),3.5);sfx.no();}else if(v.driver&&v.ai&&!v.mission)bailOut(v);}
function fuseTick(v,dt){if(v.hp>v.t.hp*0.3){v.fuse=0;return;}v.fuse-=dt;
  if(v.onScreen!==false&&rand()<dt*26){const ca=Math.cos(v.a),sa=Math.sin(v.a),f=v.t.l*0.32;part('fire',v.x+ca*f+rr(-7,7),v.y+sa*f+rr(-7,7),rr(-20,20),rr(-50,-10),rr(0.3,0.6),rr(5,10));if(rand()<0.5)part('smoke',v.x+ca*f,v.y+sa*f,rr(-20,20),rr(-60,-20),rr(0.8,1.5),rr(8,14));}
  if(v.fuse<=0){v.fuse=0;explodeVeh(v,v.fuseSrc);}}
function bailOut(v){if(!v.driver||v.driver===G.player)return null;const kind=v.driver,ai=v.ai,P=G.player,ca=Math.cos(v.a),sa=Math.sin(v.a);
  if(ai&&ai.mode==='chase'){unload(v);v.thr=0;v.hb=1;return null;}
  let x=v.x+sa*(v.t.w*0.5+14),y=v.y-ca*(v.t.w*0.5+14);if(solidPed(tileAt(x,y))){x=v.x-sa*(v.t.w*0.5+14);y=v.y+ca*(v.t.w*0.5+14);}if(solidPed(tileAt(x,y))){x=v.x;y=v.y;}
  v.driver=null;v.ai=null;v.thr=0;v.str=0;v.hb=1;v.door=0.6;v.blink=0;if(v.onScreen)sfx.door();
  const p=mkPed(kind==='cop'?'cop':'civ',x,y);if(p.type==='civ'){p.st='flee';p.ft=9;p.fx=P.x;p.fy=P.y;if(v.onScreen){say(p,'shots',2.5);sfx.scream(1,p.fem?330:240);}}return p;}
function vehShot(v,b){const P=G.player;if(v.dead||b.op!==P)return;
  if(!v.driver){if(!v.t.boat&&!v.t.plane&&!v.t.tank&&!v.t.army&&!(v.alarm>0)&&v!==P.lastVeh){v.alarm=9;crime(1,false);}return;}
  if(v.driver==='civ'&&v.ai&&v.ai.mode==='traffic'&&!v.mission){crime(1,false);if(v.ai.panic>0)return;
    if(v.t.bus||rand()<0.5){v.ai.panic=14;v.ai.blocked=0;if(v.onScreen)sfx.horn(v,1);}else bailOut(v);}}
function alarmTick(v,dt){v.alarm-=dt;const ph=Math.floor(v.alarm*3);if(ph!==v.alPh){v.alPh=ph;v.blink=ph%2?1:-1;if(v.onScreen&&ph%2)AU.tone(ph%4===1?980:740,0.22,'square',0.07);}if(v.alarm<=0){v.alarm=0;v.blink=0;}}
// player knockdown (run over / thrown off a bike)
function knockDown(t,vx,vy){const P=G.player;G.down=Math.max(G.down||0,t);P.kvx=vx;P.kvy=vy;P.mvx=P.mvy=0;P.jump=0;}
function throwRider(v,imp){const P=G.player;if(v.driver!==P||P.dead)return;const ca=Math.cos(v.a),sa=Math.sin(v.a);v.driver=null;v.thr=0;v.str=0;P.veh=null;P.lastVeh=v;
  let x=v.x+ca*8,y=v.y+sa*8;if(solidPed(tileAt(x,y))){x=v.x;y=v.y;}P.x=x;P.y=y;P.a=v.a;const k=clamp(imp*0.55,90,260);knockDown(1.5,ca*k,sa*k);
  hurtPed(P,clamp(imp*0.04,6,18),null,'car');P.hitInv=G.time+2;G.hurtFlash=0.8;G.shake=Math.max(G.shake||0,7);toast(tr('thrown'),2);sfx.punch();}
