// ---------- player ----------
function updatePlayer(dt){const P=G.player;if(P.dead)return;if(P.ride){rideUpdate(dt);return;}const [mx,my]=readKeys(),mag=Math.min(1,hyp(mx,my)),k=IN.keys;
  if(P.veh){const v=P.veh;P.x=v.x;P.y=v.y;G.nearLad=null;let fx=IN.x||k.KeyX;
    if(G.ctrl==='classic'){const kx=(k.KeyD||k.ArrowRight?1:0)-(k.KeyA||k.ArrowLeft?1:0),sx=kx||(Math.abs(IN.mx)>0.15?clamp(IN.mx*1.35,-1,1):0);
      const gas=IN.act||k.KeyW||k.ArrowUp||IN.my<-0.6,brk=IN.b||k.KeyS||k.ArrowDown||IN.my>0.65;
      v.str=sx;v.thr=gas?1:brk?-1:0;v.hb=(IN.w||k.Space)?1:0;}
    else{const brake=IN.b||k.ShiftLeft||k.ShiftRight;fx=fx||IN.act||k.Space;
      if(mag>0.15){const want=Math.atan2(my,mx),diff=angDiff(v.a,want),ad=Math.abs(diff);
        if(v.rev?ad>1.3:ad>2.1&&v.speed<140){v.rev=true;const d2=angDiff(v.a,want+Math.PI);v.thr=-mag;v.str=clamp(-d2*2.4,-1,1);}
        else{v.rev=false;v.str=clamp(diff*2.4,-1,1);v.thr=mag*(ad>1.3?0.55:1);}}
      else{v.thr=0;v.str=0;v.rev=false;}
      v.hb=brake?1:0;if(brake&&mag<0.15)v.thr=v.speed>15?-1:0;}
    if(!v.t.boat&&!v.t.tank){v.fuel=Math.max(0,v.fuel-Math.abs(v.thr)*dt/260);if(v.fuel<=0){v.thr=0;if(!v.dry){v.dry=1;toast(tr('nofuel'),4);}}}
    if(fx&&G.fireCD<=0){if(v.t.tank){G.fireCD=1.1;fire(P,v,v.x,v.y,v.a,120,0.01,true);G.shake=6;crime(1,false);}
      else if(v.t.amb||v.t.fire||v.t.police){G.fireCD=0.5;v.siren=!v.siren;toast(tr(v.siren?'sirenOn':'sirenOff'),1.2);sfx.blip();}
      else{G.fireCD=0.6;sfx.horn(v,1);react(nearestCiv(v.x,v.y,170),'horn');for(const p of G.peds)if(p.type==='civ'&&!p.dead&&hyp(p.x-v.x,p.y-v.y)<160){p.st='flee';p.ft=2;p.fx=v.x;p.fy=v.y;}}}
    if(IN.enterP)exitVehicle();
  }else if(G.down>0){G.down-=dt;G.skidNow=false;P.walk=0;P.mvx=P.mvy=0;if(P.kvx||P.kvy){pMove(P,P.kvx*dt,P.kvy*dt);P.kvx*=0.9;P.kvy*=0.9;if(Math.abs(P.kvx)+Math.abs(P.kvy)<5){P.kvx=0;P.kvy=0;}}
    P.swim=!P.roof&&!P.inside&&tileAt(P.x,P.y)===TL.WATER;if(P.swim)G.down=0;
  }else{G.skidNow=false;const act=IN.act||k.Space,sprint=IN.b||k.ShiftLeft||k.ShiftRight;let ts=0;
    if(!plusFoot(P,dt,(IN.x||k.KeyC)&&!P.inside)){const air=P.jump>0;
    if(mag>0.12){P.a+=angDiff(P.a,Math.atan2(my,mx))*Math.min(1,dt*16);ts=P.swim?85*mag:lerp(70,165,clamp((mag-0.12)/0.7,0,1))*(sprint?1.32:1);}
    if(G.stagger>0){G.stagger-=dt;ts=Math.min(ts,45);}
    const kk=Math.min(1,dt*(air?3:ts?11:16));P.mvx=(P.mvx||0)+(Math.cos(P.a)*ts-(P.mvx||0))*kk;P.mvy=(P.mvy||0)+(Math.sin(P.a)*ts-(P.mvy||0))*kk;
    const sp=hyp(P.mvx,P.mvy);if(sp>4){pMove(P,P.mvx*dt,P.mvy*dt);P.walk+=sp*dt;P.stepD=(P.stepD||0)+sp*dt;if(P.stepD>30&&!P.swim&&!air){P.stepD=0;sfx.step();}}else P.walk=0;
    if(!P.roof&&!air&&!P.inside)for(const p of G.peds){if(p.dead||p.veh)continue;const dx=p.x-P.x,dy=p.y-P.y,d2=dx*dx+dy*dy;if(d2<324&&d2>0.01){const d=Math.sqrt(d2),push=(18-d)*0.5;movePed(p,dx/d*push,dy/d*push);if(sp>150&&p.type==='civ'&&!(p.stun>0))react(p,'bump');}}
    if(P.kvx||P.kvy){pMove(P,P.kvx*dt,P.kvy*dt);P.kvx*=0.88;P.kvy*=0.88;if(Math.abs(P.kvx)+Math.abs(P.kvy)<5){P.kvx=0;P.kvy=0;}}
    P.swim=!P.roof&&!P.inside&&!(P.jump>0)&&tileAt(P.x,P.y)===TL.WATER;
    if(P.swim){if(!P.wasSwim){splash(P.x,P.y,10);sfx.splash();}G.stamina=Math.max(0,G.stamina-dt);if(G.stamina<=0){hurtPed(P,14*dt,null,'drown');G.hurtFlash=0.4;}}
    else G.stamina=Math.min(G.maxStam,G.stamina+dt*3);P.wasSwim=P.swim;
    if(act&&G.fireCD<=0&&!P.swim){if(P.inside)insideAttack();else attack();}
    if(IN.enterP){if(P.inside)insideUse();else if(P.roof)tryLadder();else if(G.nearUse)G.nearUse.fn();else if(G.nearProp)openProp(G.nearProp);else if(G.nearLad&&tryLadder()){}else if(!tryEnter()&&!tryLadder())talkNear();}
    if(IN.weapP){const ws=WORDER.filter(w=>w==='fist'||(G.weapons[w]||0)>0);G.weapon=ws[(ws.indexOf(G.weapon)+1)%ws.length];sfx.door();}}}
  IN.enterP=false;IN.weapP=false;
  if(G.weapon!=='fist'&&!(G.weapons[G.weapon]>0))G.weapon='fist';}
function attackOld(){const P=G.player,w=G.weapon,W=WEAP[w];
  if(w==='fist'){G.fireCD=W.rate;G.punchT=0.16;let best=null,bd=36;for(const p of G.peds){if(p===P||p.dead||p.veh)continue;const d=hyp(p.x-P.x,p.y-P.y);
      if(d<bd&&Math.abs(angDiff(P.a,Math.atan2(p.y-P.y,p.x-P.x)))<1.1){bd=d;best=p;}}
    sfx.punch();if(best){G.combo=G.time-(G.lastPunch||0)<1.3?(G.combo||0)+1:1;G.lastPunch=G.time;const fin=G.combo%3===0;hurtPed(best,fin?13:8+rand()*3,P,'punch');const kb=fin?260:90;best.kvx=Math.cos(P.a)*kb;best.kvy=Math.sin(P.a)*kb;part('flash',best.x,best.y,0,0,0.08,7);if(!best.dead&&(fin||best.hp<14)){best.stun=1.7;G.shake=3;}}return;}
  G.fireCD=W.rate;G.weapons[w]--;if(!W.flame)P.a=autoAim(P);
  if(W.pellets)for(let i=0;i<W.pellets;i++)fire(P,null,P.x,P.y,P.a,W.dmg,W.spread,false,{life:0.3,quiet:i>0});
  else if(W.flame){fire(P,null,P.x,P.y,P.a,W.dmg,W.spread,false,{kind:'flame',spd:430,life:0.42});if(rand()<0.3)sfx.flame();}
  else if(W.nade)fire(P,null,P.x,P.y,P.a,W.dmg,0.02,true,{kind:'nade',spd:400,life:0.85,quiet:1});
  else fire(P,null,P.x,P.y,P.a,W.dmg,W.spread,!!W.expl);
  crime(1,false);}
function autoAimOld(P){let best=null,bs=1e9;for(const p of G.peds){if(p===P||p.dead||p.veh)continue;const dx=p.x-P.x,dy=p.y-P.y,d=hyp(dx,dy);if(d>400)continue;
  const da=Math.abs(angDiff(P.a,Math.atan2(dy,dx)));if(da>0.75)continue;let sc=d*(1+da*2);
  if(p.hostile||(p.type==='cop'&&G.wanted>0)||(p.type==='soldier'&&G.inBase))sc*=0.3;if(sc<bs&&los(P.x,P.y,p.x,p.y)){bs=sc;best=p;}}
  return best?Math.atan2(best.y-P.y,best.x-P.x):P.a;}
function tryEnter(){const P=G.player;let best=null,bd=1e9;
  for(const v of G.vehicles){if(v.dead||v.sink||v.sunk)continue;const d=hyp(v.x-P.x,v.y-P.y);const reach=v.t.l*0.5+(P.swim?40:30);if(d<reach&&d<bd){bd=d;best=v;}}
  if(!best)return false;const v=best;
  if(v.driver&&v.driver!==P){const type=v.driver,ca=Math.cos(v.a),sa=Math.sin(v.a);let x=v.x+sa*(v.t.w*0.5+14),y=v.y-ca*(v.t.w*0.5+14);
    if(v.t.boat||solidPed(tileAt(x,y))){x=v.x-sa*(v.t.w*0.5+14);y=v.y+ca*(v.t.w*0.5+14);}
    const p=mkPed(type==='cop'?'cop':type==='soldier'?'soldier':type==='gang'?'gang':'civ',x,y,{faction:v.ai&&v.ai.faction});
    if(p.type==='civ'){if(p.id%4===0){p.brawl=6;react(p,'fight');}else{p.st='flee';p.ft=4;p.fx=v.x;p.fy=v.y;}crime(1,false);}else{p.hostile=true;if(p.type==='cop')crime(1,true);}
    if(v.occ>0&&v.ai&&v.ai.faction){v.occ=Math.max(0,v.occ-1);const ai=v.ai;v.ai=ai;unload(v);}}
  else if(v.t.police&&!v.parked)crime(1,true);
  v.driver=P;v.ai=null;v.parked=false;v.door=0.45;P.veh=v;P.lastVeh=v;v.rev=false;sfx.door();
  if(v.type==='aurum'&&!G.seen.aurum){G.seen.aurum=1;toast(tr('aurum'),4);}else toast(vehName(v),1.6);return true;}
function exitVehicle(){const P=G.player,v=P.veh;if(!v)return;if(v.alt>0.25){toast(tr('noexit'),1.5);return;}const ca=Math.cos(v.a),sa=Math.sin(v.a),off=v.t.w*0.5+14;
  const cands=[[v.x+sa*off,v.y-ca*off],[v.x-sa*off,v.y+ca*off],[v.x-ca*(v.t.l*0.5+14),v.y-sa*(v.t.l*0.5+14)],[v.x+ca*(v.t.l*0.5+14),v.y+sa*(v.t.l*0.5+14)]];
  let pos=null;if(v.t.boat){for(const c of cands){const t=tileAt(c[0],c[1]);if(t===TL.DOCK||t===TL.SAND||t===TL.CONC||t===TL.WALK||t===TL.GRASS){pos=c;break;}}}
  if(!pos)for(const c of cands)if(!solidPed(tileAt(c[0],c[1]))){pos=c;break;}
  if(!pos)return;P.x=pos[0];P.y=pos[1];P.a=v.a;v.door=0.45;v.driver=null;v.thr=0;v.str=0;v.hb=v.t.boat?0:1;P.veh=null;sfx.door();}
function talkNear(){const P=G.player;let best=null,bd=62;for(const p of G.peds){if(p===P||p.dead||p.veh||p.hostile||p.stun>0||p.brawl>0)continue;const d=hyp(p.x-P.x,p.y-P.y);if(d<bd){bd=d;best=p;}}
  if(!best)return;best.a=Math.atan2(P.y-best.y,P.x-best.x);
  if(best.vendor){vendorTalk(best);return;}
  if(best.kind==='dog'){say(best,'dog',1.5);sfx.bark(1);G.rep=Math.min(50,G.rep+0.3);return;}
  if(best.type==='npc'){civLine(best);return;}
  best.st='idle';best.tm=5;openTalk(best);}

// ---------- world interactions ----------
function vehCollide(){const V=G.vehicles,P=G.player;
  const act=V.map(v=>!v.sunk&&(Math.abs(v.vx)+Math.abs(v.vy)>1||v.thr!==0)&&Math.abs(v.x-P.x)<2600&&Math.abs(v.y-P.y)<2600);
  for(let i=0;i<V.length;i++){const a=V[i];if(a.sunk)continue;for(let j=i+1;j<V.length;j++){const b=V[j];if(b.sunk||!!a.t.boat!==!!b.t.boat||(!act[i]&&!act[j])||a.alt>0.25||b.alt>0.25)continue;
    const dx=b.x-a.x,dy=b.y-a.y,rad=(a.t.l+b.t.l)*0.5;if(dx*dx+dy*dy>rad*rad)continue;
    for(const p of vehCircles(a))for(const q of vehCircles(b)){const ex=q[0]-p[0],ey=q[1]-p[1],d=hyp(ex,ey),rs=p[2]+q[2];if(d>=rs||d<0.01)continue;
      const nx=ex/d,ny=ey/d,pen=rs-d,ma=a.t.mass||1,mb=b.t.mass||1,tot=ma+mb;
      a.x-=nx*pen*mb/tot;a.y-=ny*pen*mb/tot;b.x+=nx*pen*ma/tot;b.y+=ny*pen*ma/tot;
      const rv=(b.vx-a.vx)*nx+(b.vy-a.vy)*ny;if(rv<0){const imp=-1.3*rv/(1/ma+1/mb);a.vx-=imp*nx/ma;a.vy-=imp*ny/ma;b.vx+=imp*nx/mb;b.vy+=imp*ny/mb;
        const dmg=Math.max(0,-rv-90)*0.08;if(dmg>0){damageVeh(a,dmg*mb/tot*2,b.driver===P?P:null,'hit');damageVeh(b,dmg*ma/tot*2,a.driver===P?P:null,'hit');if(-rv>240){if(a.t.bike&&a.driver===P)throwRider(a,-rv);else if(b.t.bike&&b.driver===P)throwRider(b,-rv);}addDentDir(a,nx,ny,-rv-50);addDentDir(b,-nx,-ny,-rv-50);
          if(a.driver===P||b.driver===P){sfx.crash(-rv);if(-rv>150)part('spark',p[0]+nx*p[2],p[1]+ny*p[2],rr(-80,80),rr(-80,80),0.3,3);
            const o=a.driver===P?b:a;if(o.t.police)crime(1,true);if(o.ai&&o.ai.mode==='traffic'&&!o.dead&&-rv>120&&rand()<0.35&&o.driver==='civ'){o.driver=null;o.ai=null;o.thr=0;o.hb=1;const q=mkPed('civ',o.x-Math.sin(o.a)*(o.t.w*0.5+14),o.y+Math.cos(o.a)*(o.t.w*0.5+14));q.brawl=8;say(q,'crash');}}}}}}}}
function vehPedCollide(){const P=G.player,list=G.peds.concat(P.veh?[]:[P]);for(const v of G.vehicles){if(v.sunk||v.alt>0.25)continue;const sp=hyp(v.vx,v.vy);if(sp<1&&v.parked)continue;
  for(const p of list){if(p.dead||p.veh)continue;if(p===P&&(P.roof||P.climb||P.jump>0.1))continue;if(!!v.t.boat!==!!p.swim)continue;
    const dx=p.x-v.x,dy=p.y-v.y,rr2=v.t.l*0.6+12;if(dx*dx+dy*dy>rr2*rr2)continue;const ca=Math.cos(v.a),sa=Math.sin(v.a),lx=dx*ca+dy*sa,ly=-dx*sa+dy*ca,hl=v.t.l/2+8,hw=v.t.w/2+8;
    if(Math.abs(lx)>hl||Math.abs(ly)>hw)continue;const ox=hl-Math.abs(lx),oy=hw-Math.abs(ly);
    if(ox<oy){const s=Math.sign(lx)||1;p.x+=ca*s*ox;p.y+=sa*s*ox;}else{const s=Math.sign(ly)||1;p.x+=-sa*s*oy;p.y+=ca*s*oy;}
    if(sp>75){const src=v.driver===P?P:null;
      if(p===P){if(G.time>(P.hitInv||0)){P.hitInv=G.time+1.6;G.hurtFlash=1;knockDown(0.9+sp/500,v.vx*0.75,v.vy*0.75);hurtPed(P,clamp((sp-60)*0.13,5,48),null,'car');sfx.punch();G.shake=Math.max(G.shake||0,6);}}
      else{p.kvx=v.vx*0.7;p.kvy=v.vy*0.7;hurtPed(p,(sp-55)*0.32,src,'car');if(p.dead){if(v.onScreen)AU.hit(0.15,0.3,400);}else p.stun=Math.max(p.stun||0,1.4);}}
    else if(sp>25&&v.driver===P&&p.type==='civ'){react(p,'car');if(p.st!=='flee'&&p.st!=='call'){p.st='flee';p.ft=1.5;p.fx=v.x;p.fy=v.y;}}}}}
function updatePickups(dt){const P=G.player,px=P.x,py=P.y;
  for(const p of G.pickups){if(p.taken){p.resp-=dt;if(p.resp<=0&&p.respawn&&!onScreen(p.x,p.y,40))p.taken=false;continue;}
    const r=p.type==='crate'?44:28;if((p.x-px)**2+(p.y-py)**2>r*r)continue;if(Math.abs((p.h||0)-(P.roof&&!P.veh?P.roof.ht:0))>0.7)continue;
    const ty=p.type;
    if(ty==='health'){if(P.hp>=100)continue;P.hp=Math.min(100,P.hp+60);}
    else if(ty==='armor'){if(G.armor>=100)continue;G.armor=100;toast(tr('armor'),1.5);}
    else if(ty==='bribe'){if(G.wanted<=0)continue;clearWanted();toast(tr('bribe'));}
    else if(WEAP[ty]){if(WEAP[ty].melee&&G.weapons[ty]>0)continue;giveWeapon(ty,WEAP[ty].melee?1:WEAP[ty].pack);toast(ty==='rocket'&&p.once?tr('gotBz'):ty==='minigun'?tr('gotMini'):L(WEAP[ty])+(WEAP[ty].melee?'':' +'+WEAP[ty].pack),2.5);}
    else if(ty==='cash'){G.money+=p.amt;if(p.amt>=100)toast('+$'+p.amt,1.5);}
    else if(ty==='chest'){G.money+=3000;toast(tr('chest'),4);sfx.pass();}
    else if(ty==='token'){G.tokens.push(p.tid);G.money+=250;toast(fmt(tr('token'),G.tokens.length,TOKENS.length));if(G.tokens.length===TOKENS.length){G.money+=5000;setTimeout(()=>toast(tr('alltokens'),5),2500);}saveGame();}
    else if(ty==='crate'){if(p.alarm){setStars(p.alarm);toast(tr('alarm'));for(const s of G.peds)if(s.type==='soldier')s.hostile=true;}}
    sfx.blip();p.taken=true;p.resp=45;if(p.once){G.got.push(p.once);saveGame();}}
  G.pickups=G.pickups.filter(p=>!p.taken||p.respawn);}
function worldTriggers(dt){const P=G.player,px=P.x,py=P.y;plusTaxi(dt);
  const inBase=px>RESTRICT.x0&&px<RESTRICT.x1&&py>RESTRICT.y0&&py<RESTRICT.y1;
  if(inBase&&!G.inBase){toast(tr('restricted'));setStars(2);}G.inBase=inBase;
  if(hyp(px-POI.secret.x,py-POI.secret.y)<110&&!G.seen.secret){G.seen.secret=1;toast(tr('secret'),6);sfx.pass();}
  if(hyp(px-POI.duck.x,py-POI.duck.y)<120){if(!G.duckT||G.time-G.duckT>8){G.duckT=G.time;toast('🦆 '+tr('duck'),2);AU.tone(500,0.15,'square',0.12,0.6);}}
  const ar=areaAt(px,py);if(ar&&ar!==G.area){G.area=ar;showArea(ar);}
  // wanted: cops must actually see you
  if(G.wanted>0){if(!G.lastSeen){G.lastSeen={x:px,y:py};G.seenVeh=P.veh?P.veh.id:0;}
    const seen=copVisible()||(G.inBase&&G.peds.some(s=>s.type==='soldier'&&!s.dead&&hyp(s.x-px,s.y-py)<600));
    if(seen){G.unseen=0;G.lastSeen.x=px;G.lastSeen.y=py;G.seenVeh=P.veh?P.veh.id:0;G.seenOut=G.outfit;}
    else{if(G.seenNow)toast(tr('hide'),2.2);const sw=(P.veh?P.veh.id:0)!==G.seenVeh;G.unseen+=dt*(sw?2:1)*(G.outfit!==G.seenOut?2.2:1)*(1+0.3*ENV.dark);}
    G.seenNow=seen;
    if(G.unseen>7+G.wanted*2){clearWanted();toast(tr('lost'));sfx.blip();}}
  else{G.seenNow=false;G.lastSeen=null;}}

// ---------- death / arrest ----------
function wasted(){if(G.state==='dead'||G.state==='title')return;for(const id of ['shop','mapview','pause','dlg'])$(id).style.display='none';G.dialog=null;G.shop=null;G.down=0;G.player.dead=true;if(G.mission)failMission('f_dead');G.state='dead';G.deadT=3.4;G.deadKind='wasted';bigMsg(tr('wasted'),'#ff3b3b');sfx.fail();}
function busted(){if(G.state!=='play')return;G.player.dead=true;if(G.player.veh){G.player.veh.driver=null;G.player.veh=null;}if(G.mission)failMission('f_dead');G.state='dead';G.deadT=3.4;G.deadKind='busted';bigMsg(tr('busted'),'#5aa0ff');sfx.fail();}
function respawn(){const P=G.player,b=G.deadKind==='busted';const pos=b?POI.cops:POI.hosp;
  if(P.veh){P.veh.driver=null;P.veh=null;}P.dead=false;P.hp=100;G.down=0;P.hitInv=0;P.roof=null;P.jump=0;P.climb=null;P.inside=null;G.rob=null;for(const s of SHOPS){for(const c of s.cust||[])c.remove=true;s.cust=[];}G.bust=0;G.heli=null;G.fare=null;G.stagger=0;P.x=pos.x;P.y=pos.y;P.a=-Math.PI/2;P.swim=false;P.kvx=P.kvy=0;G.stamina=G.maxStam;
  G.money=Math.max(0,G.money-(b?150:100));if(b){G.weapons={fist:1};G.weapon='fist';}
  G.wanted=0;G.heat=0;G.unseen=0;G.armor=0;G.lastSeen=null;G.talk=null;
  for(const p of G.peds){p.hostile=false;if(p.type==='cop'||p.type==='gang')p.remove=true;}
  for(const v of G.vehicles)if(v.ai&&v.ai.mode==='chase')v.remove=true;
  G.peds=G.peds.filter(p=>!p.remove);G.vehicles=G.vehicles.filter(v=>!v.remove);G.bullets=[];G.state='play';G.cam.x=P.x;G.cam.y=P.y;saveGame();}

// ---------- save ----------
function saveGame(){if(!G.player)return;store.set('sb_save',{v:1,money:G.money,done:G.done,tokens:G.tokens,weapons:G.weapons,armor:G.armor,clock:ENV.clock,got:G.got,outfit:G.outfit,outfits:G.outfits,meds:G.meds,rep:G.rep,way:G.way,duck:G.duckHorn,owned:G.owned,playT:G.playT,home:G.home});}

// ---------- setup ----------
function populateStatic(){
  for(const s of PARKSPOTS)if(rand()<0.42){const v=mkVeh(pick(['compact','sedan','sedan','pickup','van','muscle','compact','taxi']),s.x,s.y,s.a);v.parked=true;}
  for(const b of POI.boats){const v=mkVeh(rand()<0.5?'dinghy':'speedboat',b.x,b.y,b.a);v.parked=true;}
  const au=mkVeh('aurum',POI.aurum.x,POI.aurum.y,POI.aurum.a);au.persist=true;au.parked=true;
  const tk=mkVeh('tank',POI.tank.x,POI.tank.y,POI.tank.a);tk.persist=true;tk.parked=true;
  const at=mkVeh('army',POI.armytruck.x,POI.armytruck.y,POI.armytruck.a);at.persist=true;at.parked=true;
  for(const s of POI.guards){const p=mkPed('soldier',s.x,s.y);p.persist=true;p.st='guard';p.a=Math.PI;}
  for(const t of TOKENS)if(!G.tokens.includes(t.id))mkPickup('token',t.x,t.y,{tid:t.id,h:t.h});
  for(const q of POI.planes){const pl=mkVeh('plane',q.x,q.y,q.a);pl.persist=true;pl.parked=true;pl.fuel=1;}
  for(const s of SHOPS){roomInit(s);s.bag=null;s.cust=[];if(!s.clerk){s.clerkP=null;continue;}const q=rw(s,s.clerk.u,s.clerk.v);s.clerkP=mkPed('npc',q[0],q[1],{persist:true,clerk:1,a:s.out>0?Math.PI/2:-Math.PI/2});setKind(s.clerkP,'casual');s.clerkP.shirt=CLERKC[s.k];s.clerkP.hat=null;s.cust=[];}
  for(const sm of SIDE)if(sm.look&&!G.done.includes(sm.id)){const gp=mkPed('npc',sm.start.x+30,sm.start.y-6,{persist:true,a:Math.PI});setKind(gp,sm.look);if(sm.id==='s5'){gp.shirt='#1f3a93';gp.hat='#14256b';}}
  for(const v of POI.vendors)mkPed('npc',v.x+34,v.y,{vendor:1,persist:true,shirt:'#f4f4f4',a:Math.PI/2});
  populateCity2();
  for(const w of WPICKS){if(w.once&&G.got.includes(w.once))continue;mkPickup(w.type,w.x,w.y,{respawn:!w.once,h:w.h,amt:w.amt,once:w.once});}}
function startGame(fresh){AU.init();if(fresh)store.del('sb_save');const sv=store.get('sb_save',null);
  G.vehicles=[];G.peds=[];G.pickups=[];G.bullets=[];G.parts=[];G.decals=[];G.mission=null;G.wanted=0;G.seen={};
  G.money=sv?sv.money:0;G.done=sv?sv.done:[];G.tokens=sv?sv.tokens:[];G.weapons=sv?sv.weapons:{fist:1};G.weapon='fist';G.armor=sv&&sv.armor||0;G.got=sv&&sv.got||[];G.outfit=sv&&sv.outfit||'std';G.outfits=sv&&sv.outfits||['std'];G.meds=sv&&sv.meds||0;G.rep=sv&&sv.rep||0;G.heat=0;G.talk=null;G.shop=null;G.inShop=null;cityInit();G.way=sv&&sv.way||null;G.duckHorn=sv&&sv.duck||0;G.stats={falls:0,sunk:0,robs:0};G.rob=null;G.spot=null;G.nearLad=null;G.owned=sv&&sv.owned||{home0:0};G.playT=sv&&sv.playT||0;G.home=sv&&sv.home||'home0';G.atProp=null;G.sprayCD=0;G.ibKey='';$('ibar').style.display='none';G.heli=null;G.fare=null;G.ev=null;G.bust=0;G.lastSeen=null;G.area=null;ENV.clock=sv&&sv.clock!=null?sv.clock:8;setWeather('clear',true);calcLight();
  const hs=SHOPS.find(s=>s.k==='home'&&s.pid===G.home)||SHOPS.find(s=>s.pid==='home0'),start={x:hs.sx,y:hs.sy+hs.out*14};
  G.player=mkPed('player',start.x,start.y);G.peds.pop();G.player.hp=100;G.player.a=-Math.PI/2;
  populateStatic();G.cam.x=G.player.x;G.cam.y=G.player.y;G.stamina=G.maxStam;
  $('menu').style.display='none';$('hud').style.display='block';$('controls').style.display='block';$('bPause').style.display='block';
  try{if(document.documentElement.requestFullscreen&&matchMedia('(pointer:coarse)').matches)document.documentElement.requestFullscreen().catch(()=>{});}catch(e){}
  G.state='play';G.obj=null;
  if(!sv||!G.done.length){if(!sv){showDialog(INTRO,()=>{toast(tr('homeHint'),8);setTimeout(()=>{if(G.state==='play'&&!G.mission)toast(tr('help'),10);},8600);});}}
  saveGame();}

// ---------- loop ----------
function resize(){G.dpr=Math.min(G.lowFx?1.25:2,devicePixelRatio||1);applyLayout();CV.width=G.vw*G.dpr;CV.height=G.vh*G.dpr;CV.style.width=G.vw+'px';CV.style.height=G.vh+'px';
  const ms=Math.round(Math.min(130,Math.max(96,Math.min(G.vw,G.vh)/G.ui*0.28)));MC.style.width=MC.style.height=ms+'px';MC.width=MC.height=Math.round(ms*G.dpr*G.ui);document.getElementById('root').style.setProperty('--vw',G.vw+'px');document.documentElement.style.setProperty('--ms',ms+'px');}
function updateCamera(dt){const P=G.player,c=G.cam;let tx=P.x,ty=P.y,z=1;
  if(P.veh){const v=P.veh;tx+=v.vx*0.35;ty+=v.vy*0.35;z=lerp(1,0.6,clamp(Math.abs(v.speed)/420,0,1));if(v.alt)z*=1-0.25*v.alt;}
  else if(!P.dead){tx+=(P.mvx||0)*0.3;ty+=(P.mvy||0)*0.3;if(P.ride&&P.ride.tr)z=0.7;}
  c.x=lerp(c.x,tx,1-Math.pow(0.02,dt));c.y=lerp(c.y,ty,1-Math.pow(0.02,dt));c.z=lerp(c.z,z,1-Math.pow(0.25,dt));
  c.s=Math.min(G.vw,G.vh)/500*c.z*(Math.max(G.vw,G.vh)>1100?1.1:1);if(G.shake>0)G.shake=Math.max(0,G.shake-dt*30);}
function step(dt){G.time+=dt;
  if(G.state==='dialog'){updateDialog(dt);return;}
  if(G.state==='dead'){G.deadT-=dt;for(const v of G.vehicles)if(v.driver&&v.ai){if(v.ai.mode==='traffic')aiTraffic(v,dt);}for(const v of G.vehicles)if(!v.sunk)vehPhys(v,dt);updateParts(dt);if(G.deadT<=0)respawn();return;}
  if(G.state!=='play')return;
  if(G.player.dead){G.state='dead';G.deadT=3;G.deadKind=G.deadKind||'wasted';return;}
  updateEnv(dt);G.fireCD-=dt;G.bustCar=0;updatePlayer(dt);
  const P=G.player;
  for(const v of G.vehicles){if(v.driver&&v.driver!==P&&v.ai){if(v.ai.mode==='traffic')aiTraffic(v,dt);else if(v.ai.mode!=='medic')aiChase(v,dt);}
    else if(!v.driver){v.thr=0;v.str=0;}
    if(v.burn>0)v.burn-=dt;if(v.door>0)v.door-=dt;
    if(v.fuse>0&&!v.dead&&!v.sunk)fuseTick(v,dt);if(v.alarm>0)alarmTick(v,dt);
    const moving=Math.abs(v.vx)+Math.abs(v.vy)>0.5||v.thr!==0||v.sink;if(moving&&!v.sunk&&(hyp(v.x-P.x,v.y-P.y)<2600||(v.ai&&v.persist)))vehPhys(v,dt);}
  vehCollide();vehPedCollide();
  for(const p of G.peds)aiPed(p,dt);
  updateBullets(dt);updateParts(dt);updatePickups(dt);worldTriggers(dt);gpsTick(dt);lifeTick(dt);updateMission(dt);spawner(dt);plusEvents(dt);plusHeli(dt);plusAmbient(dt);cityUpdate(dt);if(G.state!=='play')return;
  {const grab=G.time-(G.bustBy||-9)<0.25&&!P.veh,sp=hyp(P.mvx||0,P.mvy||0);G.bust=clamp((G.bust||0)+(grab&&sp<70&&G.time-(G.lastPunch||-9)>0.7?dt/2.2:-dt*0.6),0,1);if(G.wanted===0)G.bust=0;if(G.bust>=1){G.bust=0;busted();}}
  if(G.boom){G.boom.t-=dt*1.8;if(G.boom.t<=0)G.boom=null;}
  regenTick(dt);
  if(P.hp<P._lastHp)G.hurtFlash=Math.max(G.hurtFlash||0,0.6);P._lastHp=P.hp;}
let last=0;
function frame(now){const dt=Math.min(0.05,(now-last)/1000||0);last=now;
  if(G.state==='title'){G.time+=dt;G.cam.x=60*T+Math.sin(G.time*0.05)*1800;G.cam.y=70*T+Math.cos(G.time*0.04)*1500;G.cam.s=Math.min(G.vw,G.vh)/560*0.75;ENV.clock=19.4;calcLight();}
  else{G.ft=lerp(G.ft||0.016,dt,0.03);if(G.state==='play'&&!G.lowFx&&G.ft>0.028&&G.time>10){G.lowFx=1;resize();}
    step(dt);if(G.state==='map')drawMap();if(G.state!=='pause'||true)updateCamera(dt);updateHUD(dt);updateAudio();}
  render();requestAnimationFrame(frame);}
function init(){genWorld();buildMinimap();buildMissions();buildMissions2();buildMissions3();resize();addEventListener('resize',resize);setupInput();
  G.player=mkPed('player',POI.start.x,POI.start.y);G.peds=[];
  applyLang();$('menu').style.display='flex';requestAnimationFrame(frame);
  window.__G=G;}
init();
